
Actor.loop.input = function(act){
	if(act.type === 'enemy' || act.target.cutscene.active){
		if(act.move && act.moveSelf) //&& act.frameCount % 3 === 0 //bad cuz fuck timing for period.main
			Actor.loop.input.move(act);
	}
	
	if(act.type === 'player') return;
	if(act.combat && act.frameCount % 25 === 0){
		Actor.loop.input.ability(act);
	}
}

Actor.loop.input.move = function(act){
	var tar = act.target;
	if(tar.stuck.length) Actor.loop.input.move.stuck(act);	//set sub as the first position in stuck
	if(tar.cutscene.length) Actor.loop.input.move.cutscene(act);	//set sub as the first position in stuck
	
	Actor.loop.input.move.sub(act);
	
	for(var i in act.moveInput){	if(Math.random()< 0.05){ act.moveInput[i] = 1;} }	//Prevent Piling
}

Actor.loop.input.move.sub = function(act){
	var loc = act.target.sub;			//where he wants to go
	
	var x = loc.x - act.x;
	var y = loc.y - act.y;
	var diff = Math.sqrt(x*x+y*y);
	
	if(diff  < 10){
		act.moveInput = [0,0,0,0];
		act.target.reachedGoal = 1;
	} else {
		act.target.reachedGoal = 0;
		act.moveInput = [x>0,y>0,x<0,y<0];		//too far from loc
	}
	
	if(typeof act.target.main === 'string'){
		var target = List.all[act.target.main];
		if(!target) return;
		act.angle = atan2(target.y-act.y,target.x-act.x);
		act.mouseX = target.x-act.x+Cst.WIDTH2;
		act.mouseY = target.y-act.y+Cst.HEIGHT2;
	} else if(diff  > 10){
		act.angle = atan2(y,x);
	}
}

Actor.loop.input.move.stuck = function(act){
	if(act.target.reachedGoal){
		act.target.stuck.shift();
		act.target.reachedGoal = 0;
	}
	
	act.target.sub = act.target.stuck[0] || act.target.sub;
}

Actor.loop.input.move.cutscene = function(act){
	var tar = act.target;
	if(tar.reachedGoal){
		tar.cutscene.path.shift();
		tar.reachedGoal = 0;
		tar.cutscene.time = 0;
		if(tar.cutscene.path.length === 0) tar.cutscene.func(act.id);
	}
	tar.cutscene.time++;
	tar.sub = tar.cutscene[0] || tar.sub;
	
	if(tar.cutscene.time >= 25*30){	//aka being stuck for more than 30 sec
		act.x = tar.sub.x;
		act.y = tar.sub.y;
		tar.reachedGoal = 1;
	}
}



Actor.loop.input.ability = function(act){
	act.abilityChange.press = '0000000000000000000000';
	var target = List.all[act.target.main];
	if(!target) return;
	
	var diff = Collision.distancePtPt(act,target);
	
	var range = 'close';
	if(diff > act.abilityAi.range[0]) range = 'middle';
	if(diff > act.abilityAi.range[1]) range = 'far';
	
	
	var id = act.abilityAi[range].random();
	if(!id || id === 'idle') return;

	for(var i in act.ability){
		if(act.ability[i].id === id){
			act.abilityChange.press = act.abilityChange.press.set(+i,'1');
		}
	}	
	
}

Actor.loop.setTarget = function(act){
	if(act.type !== 'enemy') return;
	var tar = act.target;
	
	//Main
	if(!tar.main) tar.main = {x:act.x,y:act.y,real:0};	//problem..
	var bool = act.frameCount % (typeof tar.main === 'string' ? tar.period.main : 25) === 0;	//if got target => custom & if no target => 25
	if(act.combat && bool)	Actor.loop.setTarget.main(act);
	
	//Sub	
	if(act.frameCount % tar.period.sub === 0){
		Actor.loop.setTarget.sub(act); 
	}
	
	//Stuck	

	if(act.frameCount % tar.period.stuck === 0){
		tar.isStuck = Actor.isStuck(act);
		if(tar.isStuck) Actor.loop.setTarget.stuck(act);
		else tar.stuck = [];
	}
}

Actor.loop.setTarget.main = function(act){
	var targetList = {}; 
	for (var i in act.activeList){
		var target = List.all[i];
		var hIf = typeof act.targetIf === 'function' ? act.targetIf : Combat.hitIf.list[act.targetIf];
			
		if(Combat.targetIf.global(act,target) && hIf(target,act)){
			var diff = Collision.distancePtPt(act,target);
			if(diff <= act.moveRange.aggressive){
				targetList[i] = 1/(diff+100);
			}
		}
	}
	act.target.main = targetList.random() || {x:act.x,y:act.y,real:0};		//kinda dumb cuz array only 1
} 
		
Actor.loop.setTarget.sub = function(act){
	var cible = typeof act.target.main === 'string' ? List.all[act.target.main] : act.target.main;
	if(!cible) return;
	
	var rayon = (Math.randomML()*act.moveRange.confort*2)+act.moveRange.ideal;
	var angle = Math.randomML()*360;
	act.target.sub = {x:cos(angle)*rayon+cible.x,y:sin(angle)*rayon+cible.y};
} 






/*
if(act.target.cutscene.active){
	var c = act.target.cutscene;
	act.x = c.list[0].x;
	act.y = c.list[0].y;
	c.list.shift();
	if(c.list.length === 0){
		c.active = 0;
		if(c.func) c.func(act);
	}
}
*/

Actor.setCutscene = function(act, path, spd, cb){
	spd = spd || 8;
	path = deepClone(path);
	
	act.target.cutscene = {
		active:1,
		time:0,
		list:path,
		func:cb,		
	}
}

Actor.loop.setTarget.stuck = function(act){
	var maintar = List.all[act.target.main];
	if(!maintar) return;
	
	act.target.stuck = Actor.getPath(act,maintar);
	act.target.sub = act.target.stuck[0] || act.target.sub;
} 


Actor.getPath = function(act,target){	//using a*
	if(act.map !== target.map) return [];
	var map = Db.map[Map.getModel(act.map)].grid.astar.nodes;
	
	var start = Collision.getPos(act);
	var end = Collision.getPos(target);
	
	start = map[start.y][start.x];
	end = map[end.y][end.x];
	
	return astar.search.parse(astar.search(map,start,end));
}

Actor.isStuck = function(act){
	var maintar = List.all[act.target.main];
	if(!maintar) return 0;
	
	var path = Collision.getPath(Collision.getPos(act),Collision.getPos(maintar));
	for(var i in path){
		if(Collision.ActorMap(path[i],act.map,act)) return 1;	
	}
	return 0;
}






