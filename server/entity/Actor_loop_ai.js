
Actor.loop.input = function(act){
	if(act.type === 'npc' || act.target.cutscene.active){
		if(act.move && act.moveSelf) //&& act.frame % 3 === 0 //bad cuz fuck timing for period.main
			Actor.loop.input.move(act);
	}
	if(act.type === 'npc' && act.combat && act.frame % 25 === 0){
		Actor.loop.input.ability(act);
	}
}

Actor.loop.input.move = function(act){
	var tar = act.target;
	if(tar.stuck.length) Actor.loop.input.move.stuck(act);	//set sub as the first position in stuck
	else if(tar.cutscene.path.length) Actor.loop.input.move.cutscene(act);	//set sub as the first position in stuck
	
	if(act.frame % 2 === 0) Actor.loop.input.move.sub(act);
	
}

Actor.loop.input.move.sub = function(act){
	var loc = act.target.sub;			//where he wants to go
	
	var x = loc.x - act.x;
	var y = loc.y - act.y;
	var diff = Math.sqrt(x*x+y*y);
	
	if(diff  < 15){
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
	} else if(diff  > 15){
		act.angle = atan2(y,x);
		for(var i in act.moveInput){	if(Math.random()< 0.05){ act.moveInput[i] = 1;} }	//little shake when stuck
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
		
		if(tar.cutscene.path.length === 0){
			Actor.endCutscene(act);
			return;
		}
	}
	
	if(typeof tar.cutscene.path[0] !== 'number')
		tar.sub = tar.cutscene.path[0] || tar.sub;
	else {
		Actor.freeze(act,tar.cutscene.path[0]);
		tar.reachedGoal = 1;
	}
		
	
	tar.cutscene.time++;
	if(tar.cutscene.time >= 25*30){	//aka being stuck for more than 30 sec
		act.x = tar.sub.x;
		act.y = tar.sub.y;
		Actor.freeze.remove(act);
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
	
	var ab = Actor.getAbility(act);
	for(var i in ab){
		if(ab[i].id === id){
			act.abilityChange.press = act.abilityChange.press.set(+i,'1');
		}
	}	
	
}

Actor.loop.setTarget = function(act){
	if(act.type !== 'npc') return;
	var tar = act.target;
	
	//Main
	var bool = act.frame % (tar.main.fake ? 25 : tar.period.main) === 0;	//if no target => 25 && if got target => custom
	if(act.combat && bool)	Actor.loop.setTarget.main(act);
	
	//Sub	
	if(act.frame % tar.period.sub === 0)
		Actor.loop.setTarget.sub(act); 
	
	
	//Stuck	
	return;	//TOFIX
	if(act.frame % tar.period.stuck === 0){
		tar.isStuck = Actor.isStuck(act,List.all[act.target.main]);
		if(tar.isStuck) Actor.loop.setTarget.stuck(act);
		else tar.stuck = [];
	}
}

Actor.loop.setTarget.main = function(act){
	var targetList = {}; 
	var enemypower = 0;
	for (var i in act.activeList){
		var target = List.all[i];
		
		if(target.type === 'player') enemypower++;
		if(Combat.targetIf(act,target)){
			var diff = Collision.distancePtPt(act,target);
			if(diff <= act.moveRange.aggressive){
				targetList[i] = 1/(diff+100);
			}
		}
	}

	act.target.main = targetList.random() || {x:act.x,y:act.y,fake:1};
	
	if(!act.target.main.fake)
		Actor.boost.enemyPower(act,enemypower);
	
	
} 
		
Actor.loop.setTarget.sub = function(act){
	var cible = typeof act.target.main === 'string' ? List.all[act.target.main] : act.target.main;
	if(!cible) return;
	
	var rayon = (Math.randomML()*act.moveRange.confort*2)+act.moveRange.ideal;
	var angle = (act.angle+180) + Math.randomML()*act.target.maxAngleChange;
	act.target.sub = {x:cos(angle)*rayon+cible.x,y:sin(angle)*rayon+cible.y};
} 

Actor.loop.setTarget.stuck = function(act){
	var maintar = List.all[act.target.main];
	if(!maintar) return;
	
	act.target.stuck = Actor.getPath(act,maintar);
	act.target.sub = act.target.stuck[0] || act.target.sub;
} 

Actor.getPath = function(act,target){	//using a*
	return [];
	if(act.map !== target.map) return [];
	var map = Db.map[Map.getModel(act.map)].grid.astar.nodes;
	
	var start = Collision.getPos(act);
	var end = Collision.getPos(target);
	
	start = map[start.y][start.x];
	end = map[end.y][end.x];
	
	return astar.search.parse(astar.search(map,start,end));
}

Actor.isStuck = function(act,maintar){
	if(!maintar) return 0;
	var path = Collision.getPath(Collision.getPos(act),Collision.getPos(maintar));
	for(var i in path){
		if(Collision.ActorMap(path[i],act.map,act)) return 1;	
	}
	return 0;
}

Actor.setCutscene = function(act, path, cb, boost){
	boost = boost || 8;
	if(!Array.isArray(boost))
		boost = [{'stat':'maxSpd','value':boost,'type':'min'},{'stat':'maxSpd','value':boost,'type':'max'}];
	
	Actor.permBoost(act,'cutscene',boost);
	
	act.target.cutscene = {
		active:1,
		time:0,
		path:deepClone(path),
		oldCombat:act.combat || 0,
		func:cb,		
	}
	act.combat = 0;
}

Actor.endCutscene = function(act){
	var tar = act.target;
	if(tar.cutscene.func) tar.cutscene.func(act.id);
	tar.cutscene.active = 0;
	Actor.permBoost(act,"cutscene");
	act.combat = tar.cutscene.oldCombat;
}



