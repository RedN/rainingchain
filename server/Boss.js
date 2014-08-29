eval(loadDependency(['Db','List','Actor','Loop','Tk','Init','Boss','Combat','Collision']));
//boss
//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
Db.boss = {};
Init.db.boss = function(){	//do nothing...
	for(var i in Db.boss){
		Boss.creation.model(Db.boss[i]);
	}
}

var Boss = exports.Boss = {};

Boss.creation = function(name,e){
	var boss = Tk.deepClone(Db.boss[name]);
	if(!boss) return ERROR(2,'no boss with this name',name);
	boss.parent = e.id;
	return boss;
}

Boss.creation.model = function(boss){	
	//boss.variable = Tk.useTemplate(Boss.template.variable(),boss.variable,0,0);
}

Boss.template = function(){
	return {	
		id:'',
		phase:{},
		currentPhase:'',
		active:1,
		variable:Boss.template.variable(),
	}
}
Boss.template.variable = function(){
	return {
		_frame:0,		//always increase
		_framePhase:0,	//reset to 0 when change phase
		_hpRatio:1,
		_target:{},		//id:angle
		_minion:{},
		_noattack:0,	//time if above 0 => cant attack
	}	
}

Boss.ability = function(boss,name,extra){
	var v = boss.variable;
	if(v._noattack > 0) return;
	var ab = Db.ability[name];
	if(ab.type === 'summon')
		Combat.summon.simple(boss.parent,ab.action.param.npc);	
	else {
		Combat.attack.simple(List.actor[boss.parent],ab.action.param,extra);
	}
}

Boss.getSummon = function(boss,name){
	var act = List.actor[boss.parent];
	if(!act.summon[name]) return [];
	var tmp = [];
	for(var i in act.summon[name].child)
		tmp.push(act.summon[name].child[i]);
	return tmp;
}

Boss.loop = function(boss){
	var act = List.all[boss.parent];
	var v = boss.variable;
	v._frame++;
	v._framePhase++;
	if(Loop.interval(25))	Boss.loop.getTarget(boss);
	if(Loop.interval(3)) 	Boss.loop.angleTarget(boss);
		
	boss.active = !v._target.$empty();
	if(!boss.active) return;
	
	
	v._noattack--;
	v._angle = act.angle;
	v._hpRatio = act.hp/act.resource.hp.max;
	
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
			boss.variable._framePhase = 0;
		}
	}
	
	boss.phase[boss.currentPhase].loop(boss.parent);
}

Boss.loop.angleTarget = function(boss){	//TOFIX can only have player target
	var act = List.all[boss.parent];
	for(var i in boss.variable._target){ 
		if(!List.all[i]){ delete boss.variable._target[i]; continue; }
		boss.variable._target[i] = Collision.anglePtPt(act,List.all[i]);
	}
}

Boss.loop.getTarget = function(boss){	//TOFIX can only have player target
	//Update Boss Target. can have multiple targets unlike regular enemy
	var act = List.all[boss.parent];
	boss.variable._target = {};
	for(var i in act.activeList){ 
		if(List.all[i].type === 'player'){
			boss.variable._target[i] = Collision.anglePtPt(act,List.all[i]);
		}
	}
}


/*
//to form the V
Boss.attack(boss,'midSpear',{angle:boss.angle+boss.opening});
Boss.attack(boss,'midSpear',{angle:boss.angle-boss.opening});

//random projectiles inside the V
if(Math.random() < 0.4){
	Boss.attack(boss,'midSpear',{angle:boss.angle+Math.randomML()*boss.opening});
	Boss.attack(boss,'midSpear',{angle:boss.angle+Math.randomML()*boss.opening});
}
//##################################
360 with holes:

boss.center = Math.random()*360;
for(var j = 0 ; j < boss.hole ; j++){
	for(var k = 0 ; k < (360/boss.hole-2*boss.opening) ; k+=4){
		Boss.attack(act,'midSpear',{angle:boss.center+360/boss.hole*j+boss.opening+k});
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



