Actor.creation = function(d){	//d: x  y  map category variant lvl modAmount extra
	if(Test.no.npc) return;
	
	Map.convertSpot(d);	
	var data = Tk.useTemplate(Actor.creation.template(),d);
	var e = Actor.creation.db(data);
	e = Actor.creation.data(e,data);
	e = Actor.creation.extra(e);
	e = Actor.creation.optionList(e);
		
	List.actor[e.id] = e;
	List.all[e.id] = e;
	Map.enter(e);
	
	if(e.loot) e.loot = {func:e.loot,list:[]};
	
	
	if(e.nevermove){ Actor.creation.nevermove(e); }
	if(e.nevercombat){ Actor.creation.nevercombat(e); }	
	else {
		e = Actor.creation.mod(e); 
		e = Actor.creation.boost(e);
	}
	
	for(var i in e.immune) e.mastery.def[i].sum = Cst.bigInt;
	
	if(!e.group) e.deleteOnceDead = 1;
	return e.id;
}

Actor.creation.template = function(){
	return {x:0,y:0,v:0,map:"test@MAIN",category:'system',variant:"default",lvl:0,extra:{},modAmount:1}

}

Actor.creation.group = function(gr,el){
   	if(Test.no.npc) return;
	
	/*
	gr: x y map respawn
    el: [  {'amount':1,"category":"slime","variant":"Big","lvl":0,'modAmount':1},
		{'amount':10,"category":"bat","variant":"normal","lvl":0,'modAmount':1},	];
	*/
	var enemyIdList = [];
	
	Map.convertSpot(gr);
	gr = Tk.useTemplate(Actor.creation.group.template(),gr);	
	el = Tk.arrayfy(el);
	
	var id = gr.group;
	List.group[id] = {
		'id':id,
		'param':[gr,el],        //used to revive group
		'list':{},              //hold enemies
		'respawn':gr.respawn,   //time before respawn when all monster dead
	};
	
	for(var i in el){
		var amount = el[i].amount || 1;
		el[i] = Tk.useTemplate(el[i],gr);  //info about x,y,map
		for(var j = 0 ; j < amount; j++){
			var eid = Actor.creation(el[i]);
			List.group[id].list[eid] = 1;
			
			enemyIdList.push(eid);
		}
	}
	return enemyIdList;
	
}

Actor.creation.group.template = function(){
	return {'x':0,'y':0,'v':25,'map':'test@MAIN','respawn':100,group:Math.randomId()}
}

Actor.creation.boost = function(e){
	for(var i in e.boost.list){ 
		e.boost.list[i].base = Tk.viaArray.get({'origin':e,'array':e.boost.list[i].stat});	
		e.boost.list[i].permBase = e.boost.list[i].base;
	}
	return e;
}

Actor.creation.db = function(cr){
	var e = Tk.deepClone(Db.npc[cr.category][cr.variant]);
	e.lvl = Actor.creation.lvl(List.map[cr.map].lvl,cr.lvl); 
	
	e.id = Math.randomId();
	e.publicId = Math.randomId(6);
	e.frame = Math.floor(Math.random()*100);
	
	e.globalDef =  Actor.creation.db.globalLvlMod(e.lvl).globalDef;
	e.globalDmg = Actor.creation.db.globalLvlMod(e.lvl).globalDef;
	if(e.globalMod) e = e.globalMod(e,e.lvl);
	
	if(e.boss)	e.boss = Boss.creation(e.boss,e);
	
	Sprite.creation(e,e.sprite);		//To set hitbox and bumper
		
	return e;
}

Actor.creation.lvl = function(lvl,mod){
	if(!mod) return lvl;
	if(typeof mod === 'number') return mod;
	if(typeof mod === 'function') return mod(lvl);
	
	if(mod[0] === '+' || mod[0] === '-') return lvl + +mod;
	if(mod[0] === '*') return lvl * +mod.slice(1);
	
	return lvl;	
}

Actor.creation.db.globalLvlMod = function(lvl){
	return {
		globalDef:lvl+10,
		globalDmg:lvl+10,
		//deathExp:Math.logBase(2,lvl+8)-2,	//0:x1, 8:x2, 24:x3, 56:x4
	};
}

Actor.creation.data = function(e,cr){
	e.map = cr.map || 'test@MAIN';
	
	var pos = Actor.creation.data.position(cr);
	e.x = e.crX = pos.x; 
	e.y = e.crY = pos.y; 	
	
	e.category = cr.category; 
	e.variant = cr.variant; 
	e.modAmount = e.modAmount === false ? 0 : Actor.creation.data.modAmount(cr.modAmount);
	e.extra = cr.extra;
	e.group = cr.group || '';
	
	e.target.main = {x:e.x,y:e.y};
	e.data = cr;
	
	return e;
}

Actor.creation.data.modAmount = function(num){
	if(typeof num === 'number') return num;
	
	if(num === true){
		var a = Math.random();
		if(a > 1/4) return 0;
		if(a > 1/8) return 1;
		if(a > 1/32) return 2;
		return 3;
	}
	return 0;
}

Actor.creation.data.position = function(cr){
	for(var i = 0; i < 100; i++){
		var x = cr.x + Math.randomML() * cr.v;
		var y = cr.y + Math.randomML() * cr.v;
		if(!Actor.isStuck(
			{map:cr.map,x:cr.x,y:cr.y,type:'npc'},
			{map:cr.map,x:x,y:y,type:'npc'})){
			return {x:x,y:y};
		}
	}
	return {x:cr.x,y:cr.y};
}


Actor.creation.mod = function(e){
	for(var i = 0 ; i < e.modAmount ; i++){
		var choosen = Actor.creation.mod.list.random('chance');
		if(e.modList.have(choosen)){ i -= 0.99; continue; }
		
		e.modList.push(choosen);
		choosen = Actor.creation.mod.list[choosen];
		e = choosen.func(e);
		e.name += ': ' + choosen.name;
		e.context += ': ' + choosen.name;
		
	}
	return e;
}

Actor.creation.mod.list = {
	'immuneMelee':{'name':'Immune to Melee','chance':1,
		'func': (function(e){ e.immune.melee = 1;  return e; })},
	'immuneRange':{'name':'Immune to Range','chance':1,
		'func': (function(e){ e.immune.range = 1;  return e; })},
	'immuneMagic':{'name':'Immune to Magic','chance':1,
		'func': (function(e){ e.immune.magic = 1;  return e; })},
	'immuneFire':{'name':'Immune to Fire','chance':1,
		'func':(function(e){ e.immune.fire = 1;  return e; })},
	'immuneCold':{'name':'Immune to Cold','chance':1,
		'func': (function(e){ e.immune.cold = 1;  return e; })},
	'immuneLightning':{'name':'Immune to Lightning','chance':1,
		'func': (function(e){ e.immune.lightning = 1;  return e; })},

	'immuneStatus':{'name':'Immune to Status','chance':1,
		'func': (function(e){ for(var i in e.status){ e.status[i].resist = 1; }  return e; })},

	'BAx2':{'name':'More Bullets','chance':1,
		'func': (function(e){ e.bonus.bullet.amount *= 2; return e; })},
	'BAx4':{'name':'Even More Bullets','chance':1,
		'func': (function(e){ e.bonus.bullet.amount *= 4; e.globalDmg /= 2; return e; })},
	'regen':{'name':'Fast Regen','chance':1,
		'func': (function(e){ e.resource.hp.regen = 2*e.resource.hp.regen || e.resource.hp.max/250; return e; })},
	'extraLife':{'name':'More Life','chance':1,
		'func': (function(e){ e.resource.hp.max *= 2; e.hp *= 2; return e; })},
	'leech':{'name':'Leech Hp','chance':1,
		'func': (function(e){ e.bonus.leech.chance = 0.5; e.bonus.leech.magn = 0.5; return e; })},
	'atkSpd':{'name':'Faster Attack','chance':1,
		'func': (function(e){ e.atkSpd.main *= 2; return e; })},
	/*'reflectPhysical':{'name':'Reflect Physical','chance':1,
		'func': (function(e){ e.reflect = {"melee":0.5,"range":0.5,"magic":0.5,"fire":0,"cold":0,"lightning":0}; return e; })},
	'reflectElemental':{'name':'Reflect Elemental','chance':1,	//TOFIX
		'func': (function(e){ e.reflect = {"melee":0,"range":0,"magic":0,"fire":0.5,"cold":0.5,"lightning":0.5}; return e; })},*/
	'aoe':{'name':'Bigger AoE','chance':1,
		'func': (function(e){ e.bonus.strike.size *= 2; e.bonus.strike.maxHit *= 2; return e; })},
}

Actor.creation.extra = function(act){
	if(typeof act.extra === 'function')	act.extra(act);
	else act = Tk.useTemplate(act,act.extra,1,1);	
	
	delete act.extra;
	return act;
}

Actor.creation.optionList = function(e){
	var ol = {'name':e.name,'option':[]};
	
	if(e.onclick.shiftLeft)	ol.option.push(e.onclick.shiftLeft);
	if(e.type === 'player') ol.option.push({'name':'Trade',"func":'Actor.click.player',"param":[e.id]});
	if(e.dialogue)	ol.option.push({'name':'Talk',"func":'Actor.click.dialogue',"param":[e.id]});
	if(e.waypoint)	ol.option.push({'name':'Set Respawn',"func":'Actor.click.waypoint',"param":[e.id]});
	if(e.loot)	ol.option.push({'name':'Loot',"func":'Actor.click.loot',"param":[e.id]});	
	if(e.skillPlot)	ol.option.push({'name':'Harvest',"func":'Actor.click.skillPlot',"param":[e.id]});
	if(e.teleport){
		var info = {'name':'Teleport',"func":'Actor.click.teleport',"param":[e.id]};
		ol.option.push(info);
		//ol.option.push({'name':'Select Instance',"func":'Actor.teleport.selectInstance',"param":[e.id]});
		e.onclick.shiftLeft = info;
	}
	if(e.toggle)	ol.option.push({'name':'Pull Switch',"func":'Actor.click.toggle',"param":[e.id]});
	
	if(e.pushable){
		var info = {'name':'Push',"func":'Actor.click.pushable',"param":[e.id]};
		ol.option.push(info);
		e.onclick.shiftLeft = info;
	} 
	
	e.optionList = ol.option.length ? ol : null;
	return e;
}

Actor.creation.nevercombat = function(act){
	act.combat = 0;
	
	delete act.permBoost;
	delete act.boost;
	
	//General
	delete act.drop;
	delete act.item;
	delete act.pickRadius;
	
	//Combat
	delete act.attackReceived;	
	delete act.damageIf;
	delete act.targetIf;
	delete act.boss;
	delete act.deleteOnceDead;
	delete act.bonus;	
	delete act.mastery;
	delete act.ability;
	delete act.abilityList;
	delete act.atkSpd;
	
	//Def = DefMain * defArmor * act.mastery.def
	delete act.hp;	
	delete act.mana;
	delete act.dodge;
	delete act.fury;
	delete act.resource;
	
	delete act.globalDef;	
	delete act.reflect;
	
	//Resist
	delete act.status;
	
	//Atk
	delete act.dmg;
	delete act.globalDmg;
	delete act.aim;
	delete act.weapon;
	delete act.ability;
	delete act.equip;
	
	
	delete act.summon
	delete act.summmoned;
	
	//For update:
	act.resource = {'hp':{'max':1}};
	act.hp = 1;
}

Actor.creation.nevermove = function(act){
	act.move = 0;
		
	delete act.friction; 
	delete act.maxSpd;
	delete act.acc;
	delete act.mapMod; 
	delete act.moveAngle;
	delete act.spdX;
	delete act.spdY; 
	delete act.moveInput; 
	delete act.bumper; 
	//delete act.moveRange;
	
	//For update:
	act.spdX = 0;
	act.spdY = 0;
	act.maxSpd = 1;
}

Actor.remove = function(act){
	Map.leave(act);
	delete List.actor[act.id];
	delete List.all[act.id]
	if(act.group) delete List.group[act.group].list[act.id];
}







