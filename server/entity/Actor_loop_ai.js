
Actor.loop.input = function(act){
	if(act.type === 'player') return;
	if(act.move && act.moveSelf) Actor.loop.input.move(act);
	if(act.combat && act.frameCount % 25 === 0){
		Actor.loop.input.ability(act);
	}
}

Actor.loop.input.move = function(act){
	//update enemy input for movement.
	var tar = act.target;
	if(tar.main.list.length) Actor.loop.input.move.main(act);
	if(tar.sub.list.length && (tar.main.confort || tar.main.isStuck)) Actor.loop.input.move.sub(act);
	for(var i in act.moveInput){	if(Math.random()< 0.05){ act.moveInput[i] = 1;} }	//Prevent Piling
	
}

Actor.loop.input.move.main = function(act){
	var target = List.all[act.target.main.list[0]];
	if(!target) return;
	var x = target.x - act.x;
	var y = target.y - act.y;
	var diff = Math.sqrt(x*x+y*y);
	
	act.angle = atan2(y,x);
	
	var min = act.moveRange.ideal - act.moveRange.confort;
	var max = act.moveRange.ideal + act.moveRange.confort;
	var outofreach = act.moveRange.farthest;
	
	if(diff  >= min && diff  <= max){ 	//OK
		act.moveInput = [0,0,0,0];
		act.target.main.confort = 1;
	} else {
		act.target.main.confort = 0;
	}
	
	if(diff  >= outofreach){	//Out of Reach
		if(!act.status.knock.active.time){act.active = 0;}	//Otherwise knock stops weird
		act.moveInput = [0,0,0,0];
		act.target.main.list.shift();
	} else if(diff  >= max){	//Too Far
		act.moveInput = [x>0,y>0,x<0,y<0];		
	}	
	
	if(diff  <= min){	//Too Close
		act.moveInput = [x<0,y<0,x>0,y>0];
	}	
	
	act.mouseX = Cst.WIDTH2+x; 
	act.mouseY = Cst.HEIGHT2+y;

}

Actor.loop.input.move.sub = function(act){
	var target = act.target.sub.list[0];
	if(!target) return;
	var x = target.x - act.x;
	var y = target.y - act.y;
	var diff = Math.sqrt(x*x+y*y);
	
	if(diff  < 36){	//OK
		act.moveInput = [0,0,0,0];
		act.target.sub.list.shift();
	} else { 	//Too Far
		act.moveInput = [x>0,y>0,x<0,y<0];		
	}

}

Actor.loop.input.ability = function(act){
	act.abilityChange.press = '0000000000000000000000';
	if(!act.target.main.list[0]) return;

	var diff = Collision.distancePtPt(act,List.all[act.target.main.list[0]]);
	
	var range = 'close';
	if(diff > act.abilityAi.range[0]) range = 'middle';
	if(diff > act.abilityAi.range[1]) range = 'far';
	
	
	var id = act.abilityAi[range].random();
	if(!id || id === 'idle') return;
	
	console.log(id);
	
	for(var i in act.ability){
		if(act.ability[i].id === id){
			act.abilityChange.press = act.abilityChange.press.set(+i,'1');
			console.log(id);
		}
	}	
	
}







Actor.loop.setTarget = function(act){
	if(act.type !== 'enemy') return;
	var tar = act.target;
	
	//Main
	var timemain = act.frameCount % (tar.main.list.length ? tar.main.period.renew : tar.main.period.first) === 0;
	if(act.combat && timemain)	Actor.loop.setTarget.main(act);
	
	//Sub
	var timesub = act.frameCount % tar.sub.period.first === 0;
	if(act.target.sub.list.length === 0 && tar.main.confort && timesub)	Actor.loop.setTarget.sub(act);
	
	//Stuck	
	if(act.frameCount % act.target.main.period.stuck === 0){
		tar.main.isStuck = Actor.isStuck(act);
		if(tar.main.isStuck){
			Actor.loop.setTarget.stuck(act);
		}
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
	act.target.main.list = Object.keys(targetList).length ? [targetList.random()] : [] ;	
} 
		


Actor.loop.setTarget.sub = function(act){
	var maintar = List.all[act.target.main.list[0]];
	
	if(maintar){
		var rayon = (Math.randomML()*act.moveRange.confort)+act.moveRange.ideal;
		var angle = Math.randomML()*360;
		act.target.sub.list.push({x:cos(angle)*rayon+maintar.x,y:sin(angle)*rayon+maintar.y});
		return;
	}
	if(!maintar){
		var rayon = Math.random()*300;
		var angle = Math.random()*360;
		act.target.sub.list.push({x:cos(angle)*rayon+act.crX,y:sin(angle)*rayon+act.crY});
		act.angle = Collision.anglePtPt(act,act.target.sub.list[0]);
	}

} 

Actor.loop.setTarget.stuck = function(act){
	var maintar = List.all[act.target.main.list[0]];
	if(!maintar) return;
	
	act.target.sub.list = Actor.getPath(act,maintar);
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
	var maintar = List.all[act.target.main.list[0]];
	if(!maintar) return 0;
	
	var path = Collision.getPath(Collision.getPos(act),Collision.getPos(maintar));
	for(var i in path){
		if(Collision.ActorMap(path[i],act.map,act)) return 1;	
	}
	return 0;
}







