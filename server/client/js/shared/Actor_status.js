//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Main','Boss','Combat','ActiveList','Map','Collision','Sprite','Anim','Boost']));

(function(){ //}
var INTERVAL_STATUS = 3;

Actor.Status = function(){
	return {
		bleed:{time:0,magn:0},				//fixed dmg per frame, fast but short
		knock:{time:0,magn:0,angle:0},	//push
		drain:{time:0,magn:0},				//leech mana
		burn:{time:0,magn:0},				//dmg/frame depending on hp, long but slow
		chill:{time:0,magn:0},				//slower move
		stun:{time:0,magn:0},				//stun, remove attack charge
	};
}

Actor.StatusResist = function(bleed,knock,drain,burn,chill,stun){
	return {
		bleed:bleed || 0,
		knock:knock || 0,
		drain:drain || 0,
		burn:burn || 0,
		chill:chill || 0,
		stun:stun || 0,
	}
}

//#################

Actor.status = {};
//Afflict
Actor.status.afflict = function(dmg,b,target){
	for(var i in CST.element.toStatus){
		var el = CST.element.toStatus[i];
		if(b[el] && b[el].chance >= Math.random()){
			Actor.status.afflict[el](target,b,dmg);
		}
	}	
}
	
Actor.status.afflict.burn = function(act,b){	
	var info = b.burn;
	var burn = act.status.burn;
	var resist = act.statusResist.burn;
	burn.time = info.time*(1-resist); 
	burn.magn = info.magn*(1-resist); 
}

Actor.status.afflict.stun = function(act,b){
	var info = b.stun;
	var stun = act.status.stun;
	var resist = act.statusResist.stun;
	
	stun.time = info.time*(1-resist);
	stun.magn = info.magn*(1-resist);
	
	Actor.boost(act,[
		Boost('stun','maxSpd',0,stun.time,'*'),
		Boost('stun','atkSpd',0.25,stun.time,'*'),
	]); 
	
	for(var i in act.abilityChange.charge){
		act.abilityChange.charge[i] /= Math.max(stun.magn,1);
	}
}

Actor.status.afflict.bleed = function(act,b,dmg){
	var info = b.bleed;
	var bleed = act.status.bleed;
	var resist = act.statusResist.bleed;

	bleed.time = info.time;
	bleed.magn = info.magn*(1-resist);
}

Actor.status.afflict.chill = function(act,b){
	var info = b.chill;
	var chill = act.status.chill;
	var resist = act.statusResist.chill;
	
	chill.time = info.time*(1-resist);
	chill.magn = (1/info.magn)*(1-resist);
	
	Actor.boost(act,Boost('chill','maxSpd',chill.magn,chill.time,'*'));
}

Actor.status.afflict.knock = function(act,b){
	var info = b.knock;
	var knock = act.status.knock;
	var resist = act.statusResist.knock;
	
	knock.time = info.time*(1-resist); 
	knock.magn = info.magn*(1-resist);	
	knock.angle = b.moveAngle || 0;
}

Actor.status.afflict.drain = function(act,b){
	var info = b.drain;
	var drain = act.status.drain;
	var resist = act.statusResist.drain;
	
	var atker = Actor.get(b.parent); if(!atker) return;
	
	drain.time = info.time*(1-resist); 
	drain.magn = info.magn*(1-resist);	
	
	Actor.boost(act,Boost('drainBad','mana-regen',1/4,drain.time,'+')); 
	atker.mana = Math.min(atker.manaMax,atker.mana + drain.magn);
	act.mana = Math.max(0,act.mana - drain.magn);
	
}


//Loop
Actor.status.loop = function(act){
	if(!Actor.testInterval(act,INTERVAL_STATUS)) return;
	Actor.status.loop.knock(act);
	Actor.status.loop.burn(act);
	Actor.status.loop.bleed(act);
	if(act.status.stun.time > 0) Actor.status.loop.stun(act);
	if(act.status.chill.time > 0) Actor.status.loop.chill(act);
	if(act.status.drain.time > 0) Actor.status.loop.drain(act);
	
	if(Actor.testInterval(act,2*INTERVAL_STATUS)){
		act.statusClient = '';
		for(var i in CST.status.list)	act.statusClient += act.status[CST.status.list[i]].time > 0 ? '1' : '0';
	}
}

Actor.status.loop.stun = function(act){
	act.status.stun.time--;
}

Actor.status.loop.chill = function(act){
	act.status.chill.time--;
}

Actor.status.loop.drain = function(act){
	act.status.drain.time--;
}

Actor.status.loop.knock = function(act){
	var status = act.status.knock;
	if(status.time > 0){
		status.time -= INTERVAL_STATUS;
		act.spdX = Tk.cos(status.angle)*status.magn;
		act.spdY = Tk.sin(status.angle)*status.magn;
	}
}

Actor.status.loop.burn = function(act){
	var status = act.status.burn;
	if(status.time > 0){
		status.time -= INTERVAL_STATUS;
		Actor.changeHp(act, -status.magn*act.hp*INTERVAL_STATUS);
	}
}

Actor.status.loop.bleed = function(act){
	var status = act.status.bleed;
	
	if(status.time > 0){
		status.time -= INTERVAL_STATUS;
		Actor.changeHp(act, -status.magn*INTERVAL_STATUS);
	}
}



//Clear
Actor.status.clear = function(act){
	Actor.status.clear.burn(act);
	Actor.status.clear.knock(act);
	Actor.status.clear.bleed(act);
	Actor.status.clear.stun(act);
	Actor.status.clear.chill(act);
	Actor.status.clear.drain(act);
};

Actor.status.clear.burn = function(act){ 
	act.status.burn.time = 0; 
} 

Actor.status.clear.knock = function(act){ 
	act.status.knock.time = 0; 
}

Actor.status.clear.bleed = function(act){ 
	act.status.bleed.time = 0; 
}

Actor.status.clear.stun = function(act){ 
	act.status.stun.time = 0;
	Actor.boost.removeById(act,'maxSpd','stun');
	Actor.boost.removeById(act,'atkSpd','stun');
}

Actor.status.clear.chill = function(act){ 
	act.status.chill.time = 0;
	Actor.boost.removeById(act,'maxSpd','chill');
}

Actor.status.clear.drain = function(act){ 
	act.status.drain.time = 0;
	Actor.boost.removeById(act,'mana-max','drainBad');
}



})();








