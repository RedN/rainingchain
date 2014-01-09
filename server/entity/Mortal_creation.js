Mortal = typeof Mortal !== 'undefined' ? Mortal : {};

Mortal.creation = function(data){
	//data: x  y  map category variant lvl modAmount extra

	var e = Mortal.template('enemy');
	e = Mortal.creation.db(e,data);
	e = Mortal.creation.info(e,data);
	e = useTemplate(e,e.extra,2);	//deep clone of function
	e = Mortal.creation.optionList(e);
	
	e.data = data;
	List.mortal[e.id] = e;
	List.all[e.id] = e;
	
	if(e.nevercombat){ Mortal.creation.nevercombat(e); }	
	else {
		e = Mortal.creation.mod(e,data); 
		e = Mortal.creation.boost(e);
	}
	if(e.nevermove){ Mortal.creation.nevermove(e); }
	
	return e.id
}

Mortal.creation.group = function(gr,el){
   	/*
	gr: x y map respawn
    el: [  {'amount':1,"category":"eSlime","variant":"Big","lvl":0,'modAmount':1},
		{'amount':10,"category":"troll","variant":"ice","lvl":0,'modAmount':1},	];
	*/
	var id = Math.randomId();
	var enemyIdList = [];
	
	gr = useTemplate(Mortal.creation.group.template(),gr);	
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
			
			var eid = Mortal.creation(el[i]);
			var e = List.all[eid];
			
			enemyIdList.push(eid);
			List.group[id].list[eid] = e;
			e.group = id;
		}
	}
	return enemyIdList;
	
}

Mortal.creation.group.template = function(){
	return {'x':0,'y':0,'v':25,'map':'test','respawn':100}
}

Mortal.creation.boost = function(e){
	for(var i in e.boost.list){ 
        e.boost.list[i].base = valueViaArray({'origin':e,'array':e.boost.list[i].stat});	
	}
	return e;
}

Mortal.creation.db = function(e,d){
	e = Db.enemy[d.category][d.variant]();
	for(var i in Db.enemy[d.category][d.variant]) e[i] = Db.enemy[d.category][d.variant][i];
	
	e.id = Math.randomId();
	e.publicId = Math.random().toString(36).substring(13);
	
	if(e.boss){	
		var id = e.boss;
		e.boss = Db.boss[id]();
		for(var i in Db.boss[id]){e.boss[i] = Db.boss[id][i];}
		e.boss.parent = e; 
	}
	var count = 0;
	for(var i in e.ability){ 
		var chanceMod = e.ability[i];	//need to fix so chanceMod do something
		Mortal.learnAbility(e,i);
		Mortal.swapAbility(e,count,i);
		count++;
	}
	
	Sprite.creation(e,e.sprite);		//To set hitbox and bumper
		
	return e;
}

Mortal.creation.info = function(e,cr){
    e.map = cr.map || 'test';
	e.x = cr.x + Math.randomML() * (cr.v || 0); 
	e.y = cr.y + Math.randomML() * (cr.v || 0); 
	e.category = cr.category || 'eSlime'; 
	e.variant = cr.variant || 'Regular'; 
	e.lvl = cr.lvl || 0; 
	e.modAmount = cr.modAmount !== undefined ?  cr.modAmount : 1;
	e.extra = cr.extra || {};
	return e;
}

Mortal.creation.mod = function(e,d){
	var list = Object.keys(Mortal.creation.mod.list);
	for(var i = 0 ; i < d.modAmount ; i++){
		var choosen = list[Math.floor(Math.random()*list.length)];
		e = Mortal.creation.mod.list[choosen](e);
		e.name += ': ' + choosen;
		e.context += ': ' + choosen;
		e.modList.push(choosen);
	}
	return e;
}

Mortal.creation.mod.list = {
	
	'immuneFire': (function(e){ e.equip.def.fire = 1/0;  return e; }),
	'immuneCold': (function(e){ e.equip.def.cold = 1/0;  return e; }),
	'immuneLightning': (function(e){ e.equip.def.lightning = 1/0;  return e; }),
	'immuneMelee': (function(e){ e.equip.def.melee = 1/0;  return e; }),
	'immuneRange': (function(e){ e.equip.def.range = 1/0;  return e; }),
	'immuneMagic': (function(e){ e.equip.def.magic = 1/0;  return e; }),

	'immuneStatus': (function(e){ for(var i in e.status){ e.status[i].resist = 100; }  return e; }),

	//'BAx2': (function(e){ e.bonus.bullet.amount *= 2; return e; }),

	//'BAx4': (function(e){ e.bonus.bullet.amount *= 4; e.dmgMain /= 2; return e; }),
	'regen': (function(e){ e.resource.hp.regen = e.resource.hp.max/250; return e; }),
	'extraLife': (function(e){ e.resource.hp.max *= 2; e.hp *= 2; return e; }),
	'leech': (function(e){ e.bonus.leech.chance = 0.5; e.bonus.leech.magn = 0.5; return e; }),
	
	
	'atkSpd': (function(e){ e.atkSpd.main *= 2; return e; }),
	
	
	'reflectPhysical': (function(e){ e.reflect = {"melee":0.5,"range":0.5,"magic":0.5,"fire":0,"cold":0,"lightning":0}; return e; }),
	'reflectElemental': (function(e){ e.reflect = {"melee":0,"range":0,"magic":0,"fire":0.5,"cold":0.5,"lightning":0.5}; return e; }),
	'aoe': (function(e){ e.bonus.strike.size *= 2; e.bonus.strike.maxHit *= 2; return e; }),
	
}


Mortal.creation.optionList = function(e){
	var ol = {'name':e.name,'option':[]};
	
	if(e.type === 'player') ol.option.push({'name':'Trade',"func":'Main.openWindow',"param":['trade',e.id]});
	if(e.dialogue)	ol.option.push({'name':'Talk To',"func":'Mortal.talk',"param":[e.id]});
	
	e.optionList = ol;
	return e;
}

Mortal.creation.nevercombat = function(mort){
	mort.combat = 0;
	
	delete mort.killed;
	delete mort.targetMod;
	
	
	
	delete mort.permBoost;
	delete mort.boost;
	
	//General
	delete mort.drop;
	delete mort.item;
	delete mort.pickRadius;
	delete mort.target;
	
	//Combat
	delete mort.attackReceived;	
	delete mort.hitIf;
	delete mort.targetIf;
	delete mort.boss;
	delete mort.deleteOnceDead;
	delete mort.bonus;	
	delete mort.mastery;
	delete mort.ability;
	delete mort.abilityList;
	delete mort.atkSpd;
	
	//Def = DefMain * defArmor * mort.mastery.def
	delete mort.hp;	
	delete mort.mana;
	delete mort.dodge;
	delete mort.fury;
	delete mort.resource;
	
	delete mort.defMain;	
	delete mort.reflect;
	
	//Resist
	delete mort.status;
	
	//Atk
	delete mort.dmg;
	delete mort.dmgMain;
	delete mort.aim;
	delete mort.weapon;
	delete mort.ability;
	delete mort.equip;
	delete mort.moveRange
	
	
	delete mort.summon
	delete mort.summmoned;
	
	//For update:
	mort.resource = {'hp':{'max':1}};
	mort.hp = 1;
}

Mortal.creation.nevermove = function(mort){
	mort.move = 0;
		
	delete mort.friction; 
	delete mort.maxSpd;
	delete mort.acc;
	delete mort.mapMod; 
	delete mort.moveAngle;
	delete mort.spdX;
	delete mort.spdY; 
	delete mort.moveInput; 
	delete mort.bumper; 
	delete mort.changeDir; 
	delete mort.moveRange;
	
	//For update:
	mort.spdX = 0;
	mort.spdY = 0;
	mort.maxSpd = 1;
}

Mortal.creation.dialogue = function(mort){
	if(mort.dialogue){
		mort.dialogue = useTemplate(Mortal.template.dialogue,mort.dialogue);
	}
	Mortal.creation.dialogue.generic(mort);
	return mort;	
}

Mortal.creation.dialogue.generic = function(mort){
	var overwrite = mort.dialogue.option;
	mort.dialogue.option = {};
	Mortal.creation.dialogue.generic.recursive(mort.dialogue.tag,mort.dialogue.option,Dialogue.generic);
	for(var i in overwrite){
		mort.dialogue.option[i] = overwrite[i];
	}
	return mort;
}

Mortal.creation.dialogue.generic.recursive = function(tag,option,dialogue){
	for(var j in dialogue.option){
		option[j] = dialogue.option[j];
	}
	for(var j in dialogue){
		if(j !== 'option' && tag.have(j)){
			Mortal.creation.dialogue.generic.recursive(tag,option,dialogue[j]);
		}
	}
}


