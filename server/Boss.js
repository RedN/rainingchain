eval(loadDependency(['Actor','Combat','Collision','Ability'],['Boss']));
//boss
//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN



var Boss = exports.Boss = function(id,variable,phase,startingPhase){	//model...
	var tmp = {	
		id:id,
		phase:phase,
		currentPhase:startingPhase,
		active:1,
		variable:variable,
	};
	
	DB[id] = tmp;
};
var DB = Boss.DB = {};
Boss.Variable = function(list){
	var tmp = {
		_frame:0,		//always increase
		_framePhase:0,	//reset to 0 when change phase
		_hpRatio:1,
		_target:{},		//id:angle
		_minion:{},
		_noattack:0,	//time if above 0 => cant attack
	}	
	for(var i in list){
		if(i.contains('_',true)) return ERROR(3,'cant have boss variable starting with _');
		tmp[i] = list[i];
	}
	return tmp;		
}

Boss.Phase = function(info){
	return {
		loop:info.loop || CST.func,
		transitionTest:info.transitionTest || function(){ return false; },
		transitionIn:info.transitionIn || CST.func,
		transitionOut:info.transitionOut || CST.func,
	};
}

Boss.get = function(name,e){
	var boss = Tk.deepClone(DB[name]);
	if(!boss) return ERROR(2,'no boss with this name',name);
	boss.parent = e.id;
	return boss;
}

Boss.useAbility = function(boss,ab,extra){
	var v = boss.variable;
	if(v._noattack > 0) return;
	Actor.useAbility(Boss.getAct(boss),ab,false,false,extra);
}
Boss.getAct = function(boss){
	return Actor.get(boss.parent);
}


Boss.getSummon = function(boss,name){
	var act = Actor.get(boss.parent);
	if(!act.summon[name]) return [];
	var tmp = [];
	for(var i in act.summon[name].child)
		tmp.push(act.summon[name].child[i]);
	return tmp;
}

Boss.loop = function(boss){
	var act = Actor.get(boss.parent);
	var v = boss.variable;
	v._frame++;
	v._framePhase++;
	if(Actor.testInterval(act,25))	Boss.loop.updateTarget(boss);
	if(Actor.testInterval(act,3)) 	Boss.loop.updateTargetAngle(boss);
		
	boss.active = !v._target.$isEmpty();
	if(!boss.active) return;
	
	
	v._noattack--;
	v._angle = act.angle;
	v._hpRatio = act.hp/act.hpMax;
	
	Boss.loop.transition(boss);
}

Boss.loop.transition = function(boss){
	var curPhase = boss.currentPhase;
	var phase = boss.phase[curPhase];
	
	if(phase.transitionTest){
		var res = phase.transitionTest(boss.parent);
		if(res){
			boss.currentPhase = res;
			if(boss.phase[res].transitionIn)
				boss.phase[res].transitionIn(boss.parent);
			if(boss.phase[curPhase].transitionOut)
				boss.phase[curPhase].transitionOut(boss.parent);
			boss.variable._framePhase = 1;
		}
	}
	
	boss.phase[boss.currentPhase].loop(boss.parent);
}

Boss.loop.updateTargetAngle = function(boss){	//TOFIX can only have player target
	var act = Actor.get(boss.parent);
	for(var i in boss.variable._target){ 
		if(!Actor.get(i)){ delete boss.variable._target[i]; continue; }
		boss.variable._target[i] = Collision.getAnglePtPt(act,Actor.get(i));
	}
}

Boss.loop.updateTarget = function(boss){	//TOFIX can only have player target
	//Update Boss Target. can have multiple targets unlike regular enemy
	var act = Actor.get(boss.parent);
	boss.variable._target = {};
	for(var i in act.activeList){ 
		if(Actor.isPlayer(i)){
			boss.variable._target[i] = Collision.getAnglePtPt(act,Actor.get(i));
		}
	}
}
Boss.getRandomTarget = function(boss){
	for(var i in boss.variable._target)
		return boss.variable._target[i];
	return null;
}

/*
//to form the V
Boss.attack(boss,'midSpear',boss.angle+boss.opening);
Boss.attack(boss,'midSpear',boss.angle-boss.opening);

//random projectiles inside the V
if(Math.random() < 0.4){
	Boss.attack(boss,'midSpear',boss.angle+Math.randomML()*boss.opening);
	Boss.attack(boss,'midSpear',boss.angle+Math.randomML()*boss.opening);
}
//##################################
360 with holes:

boss.center = Math.random()*360;
for(var j = 0 ; j < boss.hole ; j++){
	for(var k = 0 ; k < (360/boss.hole-2*boss.opening) ; k+=4){
		Boss.attack(act,'midSpear',boss.center+360/boss.hole*j+boss.opening+k);
	}	
}

//##################################
spiral of fire:

boss.center += 4.3;

if(boss.frame % 1 == 0){
	var angle = boss.center;
	
	if(angle%360 < 5){ boss.hole = Math.floor(Math.random()*6) + 2;}
	
	for(var i = 0 ; i < 11 ; i++){
		var dist = 0 + 55*i;
		var middleX = Tk.cos(angle)*dist;
		var middleY = Tk.sin(angle)*dist;
			
		if(i != boss.hole && i != boss.hole+1){
			//addStrike(act,boss.attack['spiral'],{'middleX':middleX,'middleY':middleY});
		}
	}
}

*/



