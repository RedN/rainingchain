
Mortal.loop.input = function(mort){
	if(mort.type === 'player') return;
	if(mort.move) Mortal.loop.input.move(mort);
	if(mort.combat && mort.frameCount % 25 === 0){
		Mortal.loop.input.ability(mort);
	}
}

Mortal.loop.input.move = function(mort){
	//update enemy input for movement.
	var tar = mort.target;
	if(tar.main.list.length) Mortal.loop.input.move.main(mort);
	if(tar.sub.list.length && (tar.main.confort || tar.main.isStuck)) Mortal.loop.input.move.sub(mort);
	for(var i in mort.moveInput){	if(Math.random()< 0.05){ mort.moveInput[i] = 1;} }	//Prevent Piling
	
}

Mortal.loop.input.move.main = function(mort){
	var target = List.all[mort.target.main.list[0]];
	if(!target) return;
	var x = target.x - mort.x;
	var y = target.y - mort.y;
	var diff = Math.sqrt(x*x+y*y);
	
	mort.angle = atan2(y,x);
	
	var min = mort.moveRange.ideal - mort.moveRange.confort;
	var max = mort.moveRange.ideal + mort.moveRange.confort;
	var outofreach = mort.moveRange.farthest;
	
	if(diff  >= min && diff  <= max){ 	//OK
		mort.moveInput = [0,0,0,0];
		mort.target.main.confort = 1;
	} else {
		mort.target.main.confort = 0;
	}
	
	if(diff  >= outofreach){	//Out of Reach
		if(!mort.status.knock.active.time){mort.active = 0;}	//Otherwise knock stops weird
		mort.moveInput = [0,0,0,0];
		mort.target.main.list.shift();
	} else if(diff  >= max){	//Too Far
		mort.moveInput = [x>0,y>0,x<0,y<0];		
	}	
	
	if(diff  <= min){	//Too Close
		mort.moveInput = [x<0,y<0,x>0,y>0];
	}	
	
	mort.mouseX = Cst.WIDTH2+x; 
	mort.mouseY = Cst.HEIGHT2+y;

}

Mortal.loop.input.move.sub = function(mort){
	var target = mort.target.sub.list[0];
	if(!target) return;
	var x = target.x - mort.x;
	var y = target.y - mort.y;
	var diff = Math.sqrt(x*x+y*y);
	
	if(diff  < 36){	//OK
		mort.moveInput = [0,0,0,0];
		mort.target.sub.list.shift();
	} else { 	//Too Far
		mort.moveInput = [x>0,y>0,x<0,y<0];		
	}

}


Mortal.loop.setTarget = function(mort){
	if(mort.type !== 'enemy') return;
	var tar = mort.target;
	
	//Main
	var timemain = mort.frameCount % (tar.main.list.length ? tar.main.period.renew : tar.main.period.first) === 0;
	if(mort.combat && timemain)	Mortal.loop.setTarget.main(mort);
	
	//Sub
	var timesub = mort.frameCount % tar.sub.period.first === 0;
	if(mort.target.sub.list.length === 0 && tar.main.confort && timesub)	Mortal.loop.setTarget.sub(mort);
	
	//Stuck	
	if(mort.frameCount % mort.target.main.period.stuck === 0){
		tar.main.isStuck = Mortal.isStuck(mort);
		if(tar.main.isStuck){
			Mortal.loop.setTarget.stuck(mort);
		}
	}
	
}

Mortal.loop.setTarget.main = function(mort){
	var targetList = []; 
	for (var i in mort.activeList){
		var target = List.all[i];
		var hIf = typeof mort.targetIf === 'function' ? mort.targetIf : Combat.hitIf.list[mort.targetIf];
			
		if(Combat.targetIf.global(mort,target) && hIf(target,mort)){
			var diff = Collision.distancePtPt(mort,target);
			if(diff <= mort.moveRange.aggressive){
				targetList.push({'mod':1/(diff+100),'id':i});
			}
		}
	}
	
	mort.target.main.list = targetList.length ? [targetList.random().id] : [] ;	//could be imrpoved...
} 

Mortal.loop.setTarget.sub = function(mort){
	var maintar = List.all[mort.target.main.list[0]];
	
	if(maintar){
		var rayon = (Math.randomML()*mort.moveRange.confort)+mort.moveRange.ideal;
		var angle = Math.randomML()*360;
		mort.target.sub.list.push({x:cos(angle)*rayon+maintar.x,y:sin(angle)*rayon+maintar.y});
		return;
	}
	if(!maintar){
		var rayon = Math.random()*300;
		var angle = Math.random()*360;
		mort.target.sub.list.push({x:cos(angle)*rayon+mort.crX,y:sin(angle)*rayon+mort.crY});
		mort.angle = Collision.anglePtPt(mort,mort.target.sub.list[0]);
	}

} 

Mortal.loop.setTarget.stuck = function(mort){
	var maintar = List.all[mort.target.main.list[0]];
	if(!maintar) return;
	
	mort.target.sub.list = Mortal.getPath(mort,maintar);
	console.log(mort.id,mort.target.sub.list);
} 





Mortal.loop.input.ability = function(mort){
	/*
	var target = List.all[mort.target];
	var diffX = target.x - mort.x;
	var diffY = target.y - mort.y;
	var diff = Math.sqrt(diffX*diffX+diffY*diffY);
	*/
	
	mort.abilityChange.press = '';
	for(var i in mort.ability){
		mort.abilityChange.press += mort.ability[i].chance >= Math.random() ? '1' : '0';	
	}
}

Mortal.getPath = function(mort,target){	//using a*
	if(mort.map !== target.map) return [];
	var map = Db.map[mort.map].grid.nodes;
	
	var start = Collision.getPos(mort);
	var end = Collision.getPos(target);
	
	start = map[start.y][start.x];
	end = map[end.y][end.x];
	
	return astar.search.parse(astar.search(map,start,end));
}


Mortal.isStuck = function(mort){
	var maintar = List.all[mort.target.main.list[0]];
	if(!maintar) return 0;
	
	var path = Collision.getPath(Collision.getPos(mort),Collision.getPos(maintar));
	for(var i in path){
		if(Collision.PosMap(path[i],mort.map)) return 1;	
	}
	return 0;
}





