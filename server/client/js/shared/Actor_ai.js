//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Combat','Map','Boost','Collision','Tk']));
var astar = require('astar');

Actor.TargetSetting = function(maxAngleChange,periodSub,periodMainActor,periodMainSpot,periodStuck){
	return {
		maxAngleChange: maxAngleChange ||90,
		periodSub: periodSub ||50,				//change where he wants to be relative to main target
		periodMainActor:periodMainActor ||90,	//change main target if real target
		periodMainSpot:periodMainSpot || 12,		//change main target if spot (aka fake target)
		periodStuck: periodStuck ||113,	
		updateMain:true,	//for cutscene
		updateSub:true,
	}
}
Actor.TargetMain = function(targetId,x,y){
	return {
		x:x||0,
		y:y||0,
		targetId:targetId || '',
		type:typeof targetId === 'string' ? 'actor' : 'spot',
	}
}
Actor.TargetSub = function(x,y,callback){
	return {
		x:x||0,
		y:y||0,
		callback:callback || null,	//param:act
	}
}

Actor.MoveRange = function(ideal,max,confort){
	return {
		ideal:100*Tk.nu(ideal,1),                //distance enemy wants to be from target
		confort:25*Tk.nu(confort,1),               
		aggressive:400*Tk.nu(max,1),           //attack player if within this range
		farthest:600*Tk.nu(max,1),             //stop follow player if above this range
	};
}

Actor.ai = {};
Actor.ai.update = function(act){
	Actor.ai.setTarget(act);  		//update Enemy Target
	Actor.ai.updateInput(act); 		//simulate enemy key press depending on target 
}

Actor.ai.updateInput = function(act){
	if(act.move && act.useUpdateInput)
		Actor.ai.updateInput.move(act);
		
	if(act.type !== 'npc') return;
	
	if(act.combat && act.frame % 25 === 0)
		Actor.ai.updateInput.ability(act);
	
	if(act.frame % 5 === 0)
		Actor.ai.updateInput.mouse(act);
	
}

Actor.ai.updateInput.mouse = function(act){
	var target = act.combat ? Actor.ai.setTarget.getMainPos(act) : act.targetSub;
	if(!target) return;
	var x = target.x-act.x;
	var y = target.y-act.y;
	act.angle = Tk.atan2(y,x);
	act.mouseX = y+CST.WIDTH2;
	act.mouseY = x+CST.HEIGHT2;
} 

Actor.ai.updateInput.move = function(act){
	
	//if(tar.cutscene.path.length) Actor.ai.updateInput.move.cutscene(act);	//set sub as the first position in stuck
	
	if(act.frame % 2 === 0)
		Actor.ai.updateInput.move.towardSub(act);
	
}

Actor.ai.updateInput.move.towardSub = function(act){
	var sub = act.targetSub;			//where he wants to go
	
	var x = sub.x - act.x;
	var y = sub.y - act.y;
	var diff = Math.sqrt(x*x+y*y);
	
	if(diff  < 25){
		act.moveInput = Actor.MoveInput();
		if(sub.callback) sub.callback(act.id);
	} else { //too far from loc,
		if(Math.abs(x) > 10){
			act.moveInput.right = x>0; 
			act.moveInput.left = !act.moveInput.right;
		} else {
			act.moveInput.left = act.moveInput.right = false;
		}
		if(Math.abs(y) > 10){
			act.moveInput.down = y>0; 
			act.moveInput.up = !act.moveInput.down;
		} else {
			act.moveInput.up = act.moveInput.down = false;
		}
		
	}
	
}



//ts("Actor.ai.goTo(Actor.get(key),{x:500,y:500},function(key,success){ INFO(success); },25*10)");





//cutscene[ {x,y,timeLimit,spd,wait} ]	
Actor.followPath = function(act,cutscene,callback){
	act.useUpdateInput = true;
	act.targetSetting.updateMain = false;
	act.targetSetting.updateSub = false;
	var oldCombat = act.combat;
	var oldMove = act.move;
	Actor.followPath.applyNext(act,cutscene,0,function(key){
		Actor.endPath(act,oldCombat,oldMove);
		if(callback) callback(key);
	});
}

Actor.followPath.applyNext = function(act,fullList,num,callbackIfDone){	//spdMod not applied
	var spot = fullList[num];
	if(!spot) return callbackIfDone(act.id);	//finished
	
	//Actor.permBoost(act,'followPath',[Boost.Perm('maxSpd',spot.spdMod,"***")]);	//BAD... for npc screw everything. cant add permboost to npc... cant do !== 1, cuz need overwrite
	
	Actor.followPath.goTo(act,spot,function(key,success){
		if(!success) Actor.teleport(act,Actor.Spot(spot.x,spot.y,act.map));	//to prevent gettig stuck
		
		Actor.followPath.wait(act,spot.wait,function(key){
			Actor.followPath.applyNext(act,fullList,num + 1,callbackIfDone);
		});
		if(spot.event) spot.event(key);
		
	},spot.timeLimit);
}

Actor.followPath.goTo = function(act,spot,callback,timeLimit){	//for cutscene, timeLimit param:key,success
	var wasSuccessFull = false;
	act.targetSub = Actor.TargetSub(spot.x,spot.y,function(key){
		var act = Actor.get(key);
		wasSuccessFull = true;
		if(callback) callback(key,true);
	});
	if(timeLimit){
		Actor.setTimeout(act,function(key){
			if(wasSuccessFull) return;	//reached it before timeLimit
			var act = Actor.get(key);
			if(callback) callback(key,false);
		},timeLimit,'Actor.followPath.goTo');
	}
}

Actor.followPath.wait = function(act,time,callback){
	if(!time && callback) return callback(act.id);	
	var oldMove = act.move;
	act.move = false;
	Actor.setTimeout(act,function(key){
		var act = Actor.get(key);
		act.move = oldMove;
		if(callback) callback(key);
	},time,'Actor.ai.wait');
}

Actor.endPath = function(act,combat,move){
	act.useUpdateInput = act.type === 'npc';
	act.combat = combat;
	act.move = move;
	Actor.timeout.remove(act,'Actor.followPath.goTo');	
	Actor.timeout.remove(act,'Actor.ai.wait');	
	act.targetSetting.updateMain = true;
	act.targetSetting.updateSub = true;
	//Actor.permBoost(act,'followPath');
	Actor.ai.resetSub(act);	//so sub doesnt have callback
}

//###########

Actor.ai.resetSub = function(act){
	act.targetSub = Actor.TargetSub(act.x,act.y);	//for sub doesnt have callback
}

Actor.ai.updateInput.ability = function(act){
	act.abilityChange.press = '0000000000000000000000';
	if(act.targetMain.type !== 'actor') return;
	var target = Actor.ai.setTarget.getMainPos(act);
	if(!target) return;
	
	var diff = Collision.getDistancePtPt(act,target);
	
	var range = 'close';
	if(diff > act.abilityAi.range[0]) range = 'middle';	//bad...
	if(diff > act.abilityAi.range[1]) range = 'far';
	
	
	var id = act.abilityAi[range].random();
	if(!id || id === 'idle') return;
	
	var ab = Actor.getAbility(act);
	for(var i in ab){
		if(ab[i] && ab[i].id === id){
			act.abilityChange.press = act.abilityChange.press.set(+i,'1');
		}
	}	
	
}

Actor.ai.setTarget = function(act){
	if(act.type !== 'npc') return;
	//Main
	var period = act.targetMain.type === 'actor' ? act.targetSetting.periodMainActor : act.targetSetting.periodMainSpot;
	if(act.targetSetting.updateMain && act.frame % period === 0)	
		Actor.ai.setTarget.updateMain(act);
	
	//Sub	
	if(act.targetSetting.updateSub && act.frame % act.targetSetting.periodSub === 0)
		Actor.ai.setTarget.sub(act);

}

Actor.ai.setTarget.getMainPos = function(act){	
	if(act.targetMain.type === 'spot') return {x:act.targetMain.x,y:act.targetMain.y};
	var tar = Actor.get(act.targetMain.targetId);
	if(!tar) return {x:act.x,y:act.y};	//bad... might have logged out
	return {x:tar.x,y:tar.y};
}



Actor.ai.setTarget.updateMain = function(act){
	if(!act.combat) return;
	var targetList = {}; 
	var playerCount = 0;
	for (var i in act.activeList){
		var target = Actor.get(i);
		if(!target) continue; 	//aka not player?
		if(target.type === 'player') playerCount++;
		if(!Combat.targetIf(act,target)) continue;
		
		var dist = Collision.getDistancePtPt(act,target);
		if(dist > act.moveRange.aggressive) continue;
		
		targetList[i] = 1/(dist+100);
	}
	var chosen = targetList.randomAttribute();
	if(!chosen)	act.targetMain = Actor.TargetMain(null,act.x,act.y);
	else {
		act.targetMain = Actor.TargetMain(chosen);
		Actor.boost(act,Combat.getEnemyPower(act,playerCount));
	}
} 
		
Actor.ai.setTarget.sub = function(act){
	var tar = Actor.ai.setTarget.getMainPos(act);
	if(!tar) return;
	
	var rayon = (Math.randomML()*act.moveRange.confort*2)+act.moveRange.ideal;
	
	var count = 0;
	do {
		var angle = (act.angle+180) + Math.randomML()*act.targetSetting.maxAngleChange;	//pick random angle
		var x = Tk.cos(angle)*rayon+tar.x;
		var y = Tk.sin(angle)*rayon+tar.y;
	} while(Collision.testLineMap(act.map,act,{x:x,y:y}) && ++count < 100)	//while reachable
	act.targetSub = Actor.TargetSub(x,y);
} 
/*
Actor.ai.setTarget.stuck = function(act){
	return;
	var maintar = Actor.get(act.target.main);
	if(!maintar) return;
	
	act.target.stuck = Actor.getPath(act,maintar);
	act.target.sub = act.target.stuck[0] || act.target.sub;
} 

Actor.getPath = function(act,target){	//using a*
	return [];
	if(act.map !== target.map) return [];
	var map = MapModel.get(act.map).grid.astar.nodes;
	
	var start = Collision.getPos(act);
	var end = Collision.getPos(target);
	
	start = map[start.y][start.x];
	end = map[end.y][end.x];
	
	return Actor.getPath.parseAStar(astar.search(map,start,end));
}

Actor.getPath.parseAStar = function(array){
	for(var i in array)	array[i] = {y:array[i].x*32,x:array[i].y*32};	//inverting x and y cuz xy represent position of the nodes in the grid
	return array;
}
*/

Actor.isStuck = function(act,maintar){
	if(!maintar) return 0;
	var path = Collision.getPath(Collision.getPos(act),Collision.getPos(maintar));
	for(var i in path){
		if(Collision.actorMap(path[i].x,path[i].y,act.map,act)) return 1;	
	}
	return 0;
}



