if(server) var Collision = require('./client/js/shared/Collision').Collision;
//boss
Db.boss = {};
Init.db.boss = function(){
	for(var i in Db.boss){
		Db.boss[i] = Db.boss[i]();
		Db.boss[i].id = i;
		Boss.creation.model(Db.boss[i]);
	}
}

Boss = {};

Boss.creation = function(name,e){
	var b = deepClone(Db.boss[name]);
	b.parent = e.id;
	return b;
}


Boss.creation.model = function(boss){

}


Boss.template = function(){
	return {
		'active':1,
		'phase':[],
		'currentPhase':0,
		'frame':0,
		'hpRatio':1,
		'target':{},		//id:angle
		'minion':{},
		'tooFar':1000,
		'noattack':0,		//time if above 0 => cant attack
		
		'extraLoop':{},
		'attack':{},
		'ability':{},
	}
}

Boss.attack = function(boss,name,extra){
	if(boss.noattack < 0)
		Combat.attack.simple(List.actor[boss.parent],boss.attack[name],extra);
}




Boss.loop = function(boss){
	var enemy = List.all[boss.parent];
	
	boss.frame++;
	Boss.loop.target(boss);
	boss.active = boss.target.$length();
	if(!boss.active) return;
	
	boss.noattack--;
	boss.angle = enemy.angle;
	boss.hpRatio = enemy.hp/enemy.resource.hp.max;
	
	Boss.loop.transition(boss);
	
	for(var i in boss.extraLoop){
		boss.extraLoop[i](boss);
	}

}

Boss.loop.transition = function(boss){
	var curPhase = boss.currentPhase;
	var phase = boss.phase[boss.currentPhase];
	
	if(phase.transitionTest){
		var res = phase.transitionTest(boss);
		if(res === true) boss.currentPhase++;
		if(typeof res === 'number') boss.currentPhase = res;
	}
	
	if(curPhase !== boss.currentPhase){
		if(boss.phase[boss.currentPhase].transitionIn)
			boss.phase[boss.currentPhase].transitionIn(boss);
		if(boss.phase[curPhase].transitionOut)
			boss.phase[curPhase].transitionOut(boss);
	}
		
	
	boss.phase[boss.currentPhase].loop(boss);
	
	

}

Boss.loop.target = function(boss){
	//Update Boss Target. can have multiple targets unlike regular enemy
	var act = List.all[boss.parent];
	boss.target = {};
	for(var i in act.activeList){ 
		if(List.all[i].type === 'player'){
			boss.target[i] = Collision.anglePtPt(act,List.all[i]);
		}
	}
}


/*
//to form the V
Boss.attack(boss,'midSpear',{'angle':boss.angle+boss.opening});
Boss.attack(boss,'midSpear',{'angle':boss.angle-boss.opening});

//random projectiles inside the V
if(Math.random() < 0.4){
	Boss.attack(boss,'midSpear',{'angle':boss.angle+Math.randomML()*boss.opening});
	Boss.attack(boss,'midSpear',{'angle':boss.angle+Math.randomML()*boss.opening});
}
//##################################
360 with holes:

boss.center = Math.random()*360;
for(var j = 0 ; j < boss.hole ; j++){
	for(var k = 0 ; k < (360/boss.hole-2*boss.opening) ; k+=4){
		Boss.attack(act,'midSpear',{'angle':boss.center+360/boss.hole*j+boss.opening+k});
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
		var middleX = cos(angle)*dist;
		var middleY = sin(angle)*dist;
			
		if(i != boss.hole && i != boss.hole+1){
			//addStrike(act,boss.attack['spiral'],{'middleX':middleX,'middleY':middleY});
		}
	}
}

*/



