//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Tk','Party','Boss','Map','Test','Quest','Chat','Sprite','Change']));
Actor.creation = function(d){	//d: x  y  map model lvl modAmount extra
	if(Test.no.npc) return;
	if(List.map[d.map] && List.map[d.map].list.actor.$length() > 1000) return ERROR(3,'too many monster',d.map);
	
	Map.convertSpot(d);	
	if(!d.model) ERROR(1,'asd',d);
	var data = Tk.useTemplate(Actor.creation.template(),d,true);
	var e = Actor.creation.db(data);
	e = Actor.creation.data(e,data);
	e = Actor.creation.extra(e);
	e = Actor.creation.optionList(e);
		
	List.actor[e.id] = e;
	List.all[e.id] = e;
	Map.enter(e);
		
	if(e.nevermove) Actor.creation.nevermove(e); 
	if(e.nevercombat) Actor.creation.nevercombat(e); 
	else {
		e = Actor.creation.mod(e); 
		e = Actor.creation.boost(e);
		e = Actor.creation.weakness(e);
		e.resource.hp.max = e.hp; e.resource.mana.max = e.mana;
		for(var i in e.immune) if(e.immune) e.mastery.def[i].sum = CST.bigInt;
	}
	
	Change.update.npc.creation(e); e.change = {}; //otherwise, data would be sent twice, in sa.i and sa.u
	
	
	if(e.pushable || e.block) Actor.stickToGrid(e);
	
	return e.id;
}

Actor.creation.template = function(){
	return {x:0,y:0,v:0,map:"Qbug",model:'Qbug',lvl:0,extra:{},modAmount:1}
}

Actor.creation.group = function(gr,el){
   	if(Test.no.npc) return;
	/*
	gr: x y map respawn
    el: [  {'amount':1,"model":"slime","lvl":0,'modAmount':1},
		{'amount':10,"model":"bat","lvl":0,'modAmount':1},	];
	*/
	var enemyIdList = [];
	
	Map.convertSpot(gr);
	gr = Tk.useTemplate(Actor.creation.group.template(),gr,true);	
	gr.group = Math.randomId();	//cant used the one in gr cuz when reviving would be same id again
	el = Tk.arrayfy(el);
	
	var id = gr.group;
	List.group[id] = {
		'id':id,
		'map':gr.map,
		'param':[gr,el],        //used to revive node appgroup
		'list':{},              //hold enemies
		'respawn':gr.respawn,   //time before respawn when all monster dead
	};
	if(!List.map[gr.map]){ return ERROR(3,'spawn group but map not exist',gr.map);}
	List.map[gr.map].list.group[id] = id;
	
	
	
	for(var i in el){
		var amount = el[i].amount || 1;
		el[i] = Tk.useTemplate(el[i],gr,true);  //info about x,y,map,group
		for(var j = 0 ; j < amount; j++){
			var eid = Actor.creation(el[i]);
			List.group[id].list[eid] = 1;
			
			enemyIdList.push(eid);
		}
	}
	return enemyIdList;
	
}

Actor.creation.group.template = function(){
	return {x:0,y:0,v:25,map:'QfirstTown-main@MAIN',respawn:100,group:'bob',lvl:0}
}

Actor.creation.boost = function(e){
	for(var i in e.boost.list){ 
		e.boost.list[i].base = Tk.viaArray.get({'origin':e,'array':e.boost.list[i].stat});	
		e.boost.list[i].permBase = e.boost.list[i].base;
	}
	return e;
}

Actor.creation.db = function(cr){
	if(!Db.npc[cr.model]) return ERROR(2,'npc model dont exist',cr.model);
	var e = Tk.deepClone(Db.npc[cr.model]);
	if(!List.map[cr.map]){ ERROR(3,'map dont exist?',cr.map); }
	else e.lvl = Actor.creation.lvl(List.map[cr.map].lvl,cr.lvl); 
	
	e.id = Math.randomId();
	e.publicId = Math.randomId(6);
	e.frame = Math.floor(Math.random()*100);
	
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
	e.map = cr.map || 'QfirstTown-main@MAIN';
	
	var pos = Actor.creation.data.position(cr);
	e.x = e.crX = pos.x; 
	e.y = e.crY = pos.y; 	
	
	
	
	e.model = cr.model;
	e.modAmount = (e.modAmount === false || e.modAmount === 0) ? 0 : Actor.creation.data.modAmount(cr.modAmount);
	e.extra = cr.extra;
	e.group = cr.group || '';
	
	e.target.main = {x:e.x,y:e.y};
	e.target.sub = {x:e.x,y:e.y};
	e.data = cr;
	
	return e;
}

Actor.creation.data.modAmount = function(num){
	if(typeof num === 'number') return num;
	
	if(num === true){
		var a = Math.random();
		if(a > 1/8) return 0;
		if(a > 1/32) return 1;
		return 2;
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
		
		e.modList.push(Actor.creation.mod.list[choosen].name);	//atm modList only used for context on client
		choosen = Actor.creation.mod.list[choosen];
		e = choosen.func(e);
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
	//'BAx4':{'name':'Even More Bullets','chance':1,
	//	'func': (function(e){ e.bonus.bullet.amount *= 3; e.globalDmg /= 2; return e; })},
	'regen':{'name':'Fast Regen','chance':1,
		'func': (function(e){ e.resource.hp.regen = 3*e.resource.hp.regen || e.resource.hp.max/250; return e; })},
	'extraLife':{'name':'More Life','chance':1,
		'func': (function(e){ e.resource.hp.max *= 2; e.hp *= 2; return e; })},
	'leech':{'name':'Leech Hp','chance':1,
		'func': (function(e){ e.bonus.leech.chance = 0.5; e.bonus.leech.magn = 0.5; return e; })},
	'atkSpd':{'name':'Faster Attack','chance':1,
		'func': (function(e){ e.atkSpd *= 2; return e; })},
	/*'reflectPhysical':{'name':'Reflect Physical','chance':1,
		'func': (function(e){ e.reflect = {"melee":0.5,"range":0.5,"magic":0.5,"fire":0,"cold":0,"lightning":0}; return e; })},
	'reflectElemental':{'name':'Reflect Elemental','chance':1,	//TOFIX
		'func': (function(e){ e.reflect = {"melee":0,"range":0,"magic":0,"fire":0.5,"cold":0.5,"lightning":0.5}; return e; })},*/
	'aoe':{'name':'Bigger AoE','chance':1,
		'func': (function(e){ e.bonus.strike.size *= 2; e.bonus.strike.maxHit *= 2; return e; })},
}

Actor.creation.weakness = function(e){
	var average = 0;
	for(var i in e.mastery.def) average += e.mastery.def[i].sum;
	average /= 6;
	
	for(var i in e.mastery.def){
		if(e.mastery.def[i].sum > average*1.4) e.weakness.resist += i + ',';
		if(e.mastery.def[i].sum < average/1.4) e.weakness.weak += i + ',';
	}
	e.weakness.resist.slice(0,-1);	//remove extra ,
	e.weakness.weak.slice(0,-1);	//remove extra ,
	return e;
}

Actor.creation.extra = function(act){
	if(typeof act.extra === 'function')	act.extra(act);
	else {
		act = Tk.useTemplate(act,act.extra,true,true);
		act.globalDef *= Actor.creation.db.globalLvlMod(act.lvl).globalDef;
		act.globalDmg *= Actor.creation.db.globalLvlMod(act.lvl).globalDmg;
	}	
	delete act.extra;
	
	act.context = act.name;
	act.acc = act.maxSpd/3;
	return act;
}

Actor.creation.optionList = function(e){
	var ol = {'name':e.name,'option':[]};
	
	if(e.onclick.shiftLeft){
		e.onclick.shiftLeft.param.unshift(e.id);
		ol.option.push(e.onclick.shiftLeft);
	}
	if(e.onclick.shiftRight){
		e.onclick.shiftRight.param.unshift(e.id);
		ol.option.push(e.onclick.shiftRight);
	}
	if(e.onclick.left){
		e.onclick.left.param.unshift(e.id);
		ol.option.push(e.onclick.left);
	}
	if(e.type === 'player') ol.option.push({'name':'Trade',"func":Actor.click.trade,"param":['$actor',e.id]});
	if(e.dialogue) Actor.creation.optionList.addLeft(ol,e,{'name':'Talk',"func":Actor.click.dialogue,"param":['$actor',e.id]});
	if(e.waypoint)	Actor.creation.optionList.addLeft(ol,e,{'name':'Set Respawn',"func":Actor.click.waypoint,"param":['$actor',e.id]});
	if(e.loot)	Actor.creation.optionList.addLeft(ol,e,{'name':'Loot',"func":Actor.click.loot,"param":['$actor',e.id]});
	if(e.skillPlot)	Actor.creation.optionList.addLeft(ol,e,{'name':'Harvest',"func":Actor.click.skillPlot,"param":['$actor',e.id]});
	if(e.toggle) Actor.creation.optionList.addLeft(ol,e,{'name':'Interact With',"func":Actor.click.toggle,"param":['$actor',e.id]});
	if(e.teleport)	Actor.creation.optionList.addLeft(ol,e,{'name':'Teleport',"func":Actor.click.teleport,"param":['$actor',e.id]});
	
	if(e.bank)	Actor.creation.optionList.addLeft(ol,e,{'name':'Bank',"func":Actor.click.bank,"param":['$actor',e.id]});
	if(e.signpost)	Actor.creation.optionList.addLeft(ol,e,{'name':'Read',"func":Actor.click.signpost,"param":['$actor',e.id]});
	
	if(e.pushable)	Actor.creation.optionList.addLeft(ol,e,{'name':'Push',"func":Actor.click.pushable,"param":['$actor',e.id]});
	
	if(e.deathEvent && Quest.test.simple){
		ol.option.push({'name':'Kill',"func":function(key,eid){ Chat.add(key,'You killed "' + List.all[eid].name + '".'); e.deathEvent(key,eid);  },"param":[e.id]});
	}
	
	if(e.onclick.right){	//special case only
		e.onclick.right.param.unshift(e.id);
		ol.option.push(e.onclick.right);
	}
	
	e.optionList = (ol.option.length && !e.hideOptionList) ? ol : null;
	return e;
}

Actor.creation.optionList.addLeft = function(ol,e,info){
	ol.option.push(info);
	e.onclick.left = info;
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
	delete act.bonus;	
	delete act.mastery;
	delete act.ability;
	delete act.abilityList;
	delete act.atkSpd;
	
	//Def = DefMain * defArmor * act.mastery.def
	delete act.hp;	
	delete act.mana;
	
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
	if(act.group) {
		if(!List.group[act.group]) return ERROR(3,'Actor.remove no group','name',act.name);
		delete List.group[act.group].list[act.id];		//BUG
	}
	Party.leave(act);
}





