Actor = typeof Actor !== 'undefined' ? Actor : {};

Actor.creation = function(d){
	if(d.xym){ d.x = d.xym.x; d.y = d.xym.y; d.map = d.xym.map; delete d.xym;}
	//data: x  y  map category variant lvl modAmount extra

	
	var data = useTemplate(Actor.creation.template(),d);
	var e = Actor.template('enemy');
	e = Actor.creation.db(e,data);
	e = Actor.creation.info(e,data);
	e = Actor.creation.extra(e,data);
	e = Actor.creation.optionList(e);
		
	e.data = data;
	List.actor[e.id] = e;
	List.all[e.id] = e;
	Map.enter(e);
	
	
	if(typeof e.dialogue === 'function') e.dialogue = {func:e.dialogue,distance:125};
	if(typeof e.teleport === 'function') e.teleport = {func:e.teleport,distance:75};
	if(typeof e.chest === 'function') e.chest = {func:e.chest,list:[]};
	if(e.switch) e.switch.state = e.switch.state || 'off';
	
	
	if(e.nevercombat){ Actor.creation.nevercombat(e); }	
	else {
		e = Actor.creation.mod(e,data); 
		e = Actor.creation.boost(e);
	}
	if(e.nevermove){ Actor.creation.nevermove(e); }
	
	for(var i in e.immune) e.mastery.def[i].sum = Cst.bigInt;
	
	if(!e.group) e.deleteOnceDead = 1;
	return e.id;
}

Actor.creation.template = function(){
	return {x:0,y:0,v:0,map:"test@MAIN",category:'system',variant:"default",lvl:0,extra:{},modAmount:0}

}

Actor.creation.group = function(gr,el){
   	/*
	gr: x y map respawn
    el: [  {'amount':1,"category":"slime","variant":"Big","lvl":0,'modAmount':1},
		{'amount':10,"category":"troll","variant":"ice","lvl":0,'modAmount':1},	];
	*/
	var id = Math.randomId();
	var enemyIdList = [];
	
	if(gr.xym){ gr.x = gr.xym.x; gr.y = gr.xym.y; gr.map = gr.xym.map; delete gr.xym;}
	gr = useTemplate(Actor.creation.group.template(),gr);	
	
	List.group[id] = {
		'id':id,
		'param':[gr,el],        //used to revive group
		'list':{},              //hold enemies
		'respawn':gr.respawn,   //time before respawn when all monster dead
	};
	
	el = arrayfy(el);
	for(var i in el){
		var amount = el[i].amount || 1;
		for(var j = 0 ; j < amount; j++){
			el[i] = useTemplate(el[i],gr);  //info about x,y,map
			
			var eid = Actor.creation(el[i]);
			var e = List.all[eid];
			
			enemyIdList.push(eid);
			List.group[id].list[eid] = e;
			e.group = id;
		}
	}
	return enemyIdList;
	
}

Actor.creation.group.template = function(){
	return {'x':0,'y':0,'v':25,'map':'test@MAIN','respawn':100}
}

Actor.creation.boost = function(e){
	for(var i in e.boost.list){ 
		e.boost.list[i].base = viaArray.get({'origin':e,'array':e.boost.list[i].stat});	
		e.boost.list[i].permBase = e.boost.list[i].base;
	}
	return e;
}

Actor.creation.db = function(e,d){
	var f = Db.enemy[d.category][d.variant];
	e = f();
	for(var i in f.ability) e.ability[i].action.param = f.ability[i];
	for(var i in f) if(i !== 'ability') e[i] = f[i];	//cuz of function (globalDmg) + cant delete ability if multi use same
	
	e.ability = Actor.template.ability(e.ability);
	e.abilityList = Actor.template.ability(e.abilityList);
	
	e.id = Math.randomId();
	e.publicId = Math.randomId(6);
	e.frameCount = Math.floor(Math.random()*100);
	
	e.globalDef = typeof e.globalDef === 'function' ? e.globalDef(e.lvl) : e.globalDef * Actor.creation.db.globalLvlMod(e.lvl).globalDef
	e.globalDmg = typeof e.globalDmg === 'function' ? e.globalDmg(e.lvl) : e.globalDmg * Actor.creation.db.globalLvlMod(e.lvl).globalDmg
	e.deathExp = e.deathExp * Actor.creation.db.globalLvlMod(e.lvl).deathExp;
	if(e.globalMod) e = e.globalMod(e,e.lvl);

	
	if(e.boss){	
		e.boss = Boss.creation(e.boss);
		e.boss.parent = e.id; 
	}
	
	Sprite.creation(e,e.sprite);		//To set hitbox and bumper
		
	return e;
}

Actor.creation.db.globalLvlMod = function(lvl){
	return {
		globalDef:lvl+10,
		globalDmg:lvl+10,
		deathExp:Math.logBase(2,lvl+8)-2,	//0:x1, 8:x2, 24:x3, 56:x4
	};
}

Actor.creation.info = function(e,cr){
	e.map = cr.map || 'test@MAIN';
	
	var pos = Actor.creation.info.position(cr);
	e.x = e.crX = pos.x; 
	e.y = e.crY = pos.y; 	
	
	e.category = cr.category || 'slime'; 
	e.variant = cr.variant || 'Regular'; 
	e.modAmount = cr.modAmount !== undefined ?  cr.modAmount : 1;
	e.extra = cr.extra || {};
	
	e.lvl = Actor.creation.info.lvl(List.map[e.map].lvl,cr.lvl); 
	
	e.target.main = {x:e.x,y:e.y};
	return e;
}

Actor.creation.info.position = function(cr){
	for(var i = 0; i < 100; i++){
		var x = cr.x + Math.randomML() * cr.v;
		var y = cr.y + Math.randomML() * cr.v;
		if(!Actor.isStuck(
			{map:cr.map,x:cr.x,y:cr.y,type:'enemy'},
			{map:cr.map,x:x,y:y,type:'enemy'})){
			return {x:x,y:y};
		}
	}
	return {x:cr.x,y:cr.y};
}

Actor.creation.info.lvl = function(lvl,mod){
	if(!mod) return lvl;
	if(typeof mod === 'number') return mod;
	if(typeof mod === 'function') return mod(lvl);
	
	if(mod[0] === '+' || mod[0] === '-') return lvl + +mod;
	if(mod[0] === '*') return lvl * +mod.slice(1);
	
	return lvl;	
}

Actor.creation.mod = function(e,d){
	var list = Object.keys(Actor.creation.mod.list);
	for(var i = 0 ; i < d.modAmount ; i++){
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
	'reflectPhysical':{'name':'Reflect Physical','chance':1,
		'func': (function(e){ e.reflect = {"melee":0.5,"range":0.5,"magic":0.5,"fire":0,"cold":0,"lightning":0}; return e; })},
	//'reflectElemental':{'name':'Reflect Elemental','chance':1,	//TOFIX
	//	'func': (function(e){ e.reflect = {"melee":0,"range":0,"magic":0,"fire":0.5,"cold":0.5,"lightning":0.5}; return e; })},
	'aoe':{'name':'Bigger AoE','chance':1,
		'func': (function(e){ e.bonus.strike.size *= 2; e.bonus.strike.maxHit *= 2; return e; })},
	'drop':{'name':'Better Drop','chance':1,
		'func': (function(e){ e.drop.mod.quantity += 2; e.drop.mod.quality += 2; e.drop.mod.rarity += 2; return e; })},
}

Actor.creation.extra = function(act){
	act = useTemplate(act,act.viaArray,1,1);
	delete act.viaArray;
	
	if(typeof act.extra === 'function')	act.extra(act);
	else act = useTemplate(act,act.extra);	
	
	delete act.extra;
	return act;
}

Actor.creation.optionList = function(e){
	var ol = {'name':e.name,'option':[]};
	
	if(e.onclick.shiftLeft)	ol.option.push(e.onclick.shiftLeft);
	if(e.type === 'player') ol.option.push({'name':'Trade',"func":'Main.openWindow',"param":['trade',e.id]});
	if(e.dialogue)	ol.option.push({'name':'Talk To',"func":'Actor.dialogue',"param":[e.id]});
	if(e.waypoint)	ol.option.push({'name':'Set Respawn',"func":'Actor.setRespawn',"param":[{x:e.x,y:e.y+64,map:e.map}]});
	if(e.chest)	ol.option.push({'name':'Open Chest',"func":'Actor.openChest',"param":[e.id]});	
	if(e.skillPlot)	ol.option.push({'name':'Harvest',"func":'Actor.harvest',"param":[e.id]});
	if(e.teleport){
		var info = {'name':'Teleport',"func":'Actor.teleport.click',"param":[e.id]};
		ol.option.push(info);
		ol.option.push({'name':'Select Instance',"func":'Actor.teleport.selectInstance',"param":[e.id]});
		e.onclick.shiftLeft = info;
	}
	if(e.switch){
		ol.option.push({'name':'Pull Switch',"func":'Actor.activateSwitch',"param":[e.id]});
	}	
	if(e.block && e.block.pushable){
		var info = {'name':'Push',"func":'Actor.pushing',"param":[e.id]};
		ol.option.push(info);
		e.onclick.shiftLeft = info;
	} 
	
	e.optionList = ol.option.length ? ol : '';
	return e;
}

Actor.creation.nevercombat = function(act){
	act.combat = 0;
	
	delete act.killed;
	
	
	
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
	delete act.moveRange;
	
	//For update:
	act.spdX = 0;
	act.spdY = 0;
	act.maxSpd = 1;
}







