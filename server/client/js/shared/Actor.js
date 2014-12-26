//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Account','Boss','Map','ActiveList','Debug','ActorGroup','Quest','Message','Send','Stat','Button','OptionList','Sprite','Main','ActorModel'],['Actor']));

var Actor = exports.Actor = function(modelId,extra){
	var act = {
		//non-extra
		change:{},
		old:{},
		//flag in model
		permBoost:{},    //no timer
		boost:null,
		frame:Math.floor(Math.random()*100),
		activeList:{},   //actors near this object
		active:1,    	//if not active, dont move. no cpu
		damagedBy:{},   //list of actors that damaged him (used for owner of the drops)
		dead:0,          //dead:invisible
		
		moveAngle:1,
		spdX:0,	
		spdY:0,	
		mouseX:0,	
		mouseY:0,
		moveInput:Actor.MoveInput(),	
		bumper:Actor.Bumper(),        //true if touchs map

		attackReceived:{},	//so pierce doesnt hit multiple times
		targetSetting:Actor.TargetSetting(),
		targetMain:Actor.TargetMain(),
		targetSub:Actor.TargetSub(),
		mapMod:{},
			
		abilityChange:Actor.AbilityChange(),	
		statusClient:'000000',
		curseClient:{},
		timeout:{},
		summon:{},       //if actor is master
		summoned:null,      //if actor is child
		
		serverX:0,
		serverY:0,
		id:Math.randomId(),
		group:'',            //enemy group
		
		noAbility:0,	//for temp time only ex:town
		isActor:true,
		
		//extra
		map:Actor.DEFAULT_SPOT.map,
		x:Actor.DEFAULT_SPOT.x,	
		y:Actor.DEFAULT_SPOT.y,	
		spriteFilter:null,
		
		equip:Actor.Equip(),

		status:Actor.Status(),
		bonus:Actor.Bonus(),	//Bonus applies on top of ability attack. If effect not on ability, do nothing.
		
		viewedIf:'true', //condition to see. check viewedIfList
		angle:1,
		username:"player000",     //id name
		context:'',
		weakness:Actor.Weakness(),	//set when creating
		optionList:null,	
			
		//{Setting for Map.load extra
		dialogue:null,
		chatHead:null,
		deathAbility:[],
		deathEvent:null,	//function param:id of each killer
		deathEventOnce:null,	//function param:array id of killers
		onclick:{},
		loot:null,
		block:null,
		teleport:null,
		tag:{},				//to get enemy in q.event
		hideOptionList:false,
		lastInteraction:Date.now(),
		lastAbilitySkill:'',
		skillPlot:null,
		toggle:null,
		bank:0,
		signpost:'',		
		//}	
		
		//player only
		skill:Actor.Skill(),
		removeList:{},	//for things that got removed from activeList
		privateChange:{},
		privateOld:{},
		magicFind:Actor.MagicFind(),
		pickRadius:250,
		respawnLoc:Actor.RespawnLoc(),
		respawnTimer:25,
		questMarker:{},
	}
	var model = Tk.deepClone(ActorModel.get(modelId));
	if(!model) return ERROR(2,'no model dont exist',modelId);
	for(var i in model) act[i] = model[i];
	for(var i in extra) act[i] = extra[i];
	
	Sprite.updateBumper(act);
	
	Actor.setBoostListBase(act);
	
	if(!SERVER) return act;
	
	if(act.type !== 'player')
		Actor.setAbilityListUsingAbilityAi(act); //based on aiChance
		
	act.optionList = Actor.generateOptionList(act);
	act.onclick = Actor.generateOnclick(act);
		
	act.context = act.name;
	if(act.type === 'npc')
		act.acc = act.maxSpd/3;
	
	if(act.boss) act.boss = Boss.get(act.boss,act);
	
	if(act.nevermove) Actor.nevermove(act); 
	if(act.nevercombat) Actor.nevercombat(act); 
	else {
		for(var i in act.immune) 
			if(act.immune) act.mastery.def[i].sum = CST.bigInt;
		Actor.setWeakness(act);
		act.hpMax = act.hp; 
		act.manaMax = act.mana;
	}
	
		
	Actor.setChange(act,0,true); //set change and old	
	act.change = {}; //otherwise, data would be sent twice, in sa.i and sa.u
	if(act.type === 'player'){	//QUICKFIX, otherwise reuptation ability disappear when login in
		var ab = Tk.deepClone(act.ability);
		Actor.equip.update(act);	//only if player
		act.ability = ab;
	}
	
	return act;
}

Actor.addToMap = function(act,spot,force){	//act=[Actor]
	if(!force && !Actor.addToMap.test(act,spot)) return;
	//else e.lvl = Actor.creation.lvl(Map.get(spot.map).lvl,cr.lvl); 
	
	act.map = spot.map;
	act.x = act.crX = spot.x; 
	act.y = act.crY = spot.y; 
	act.targetMain = Actor.TargetMain(null,spot.x,spot.y);	
	act.targetSub =  Actor.TargetSub(spot.x,spot.y);	
	
	Actor.addToList(act);
	ActiveList.addToList(act);
	Map.enter(act,force);
		
	
	if(act.pushable || act.block) 
		Actor.stickToGrid(act);
	
	return act;
}
Actor.addToMap.test = function(act,spot){
	if(!Map.get(spot.map)) return ERROR(3,'map dont exist?',spot.map);
	return true;
}

Actor.LIST = {};	//supposed to be only accesable by file starting with Actor_
Actor.USERNAME_TO_ID = {};
Actor.get = function(id){
	return Actor.LIST[id] || null;
}

Actor.isOnline = function(id){
	return !!Actor.get(id);
}

Actor.getViaUserName = function(id){
	return Actor.get(Account.getKeyViaUsername(id)) || null;
}

Actor.isInMap = function(act,map){
	return act.map.contains(map,true);
}

Actor.addToList = function(bullet){
	Actor.LIST[bullet.id] = bullet;
}
Actor.removeFromList = function(id){
	delete Actor.LIST[id]; 
}

Actor.isPlayer = function(act){
	if(typeof act === 'string') return Actor.LIST[act].type === 'player';
	return act.type === 'player';
}

Actor.DEFAULT_SPRITENAME = 'mace';
Actor.DEFAULT_SPOT = {x:1550,y:550,map:'QfirstTown-main@MAIN'};
Actor.IDLE_ABILITY_ID = 'Qsystem-idle';

//###############

Actor.MagicFind = function(quantity,quality,rarity){
	return {
		quantity:quantity || 0,
		quality:quality || 0,
		rarity:rarity || 0
	};
}

//###############

Actor.Bonus = function(){
	return Stat.actorBonus();
}

Actor.sendMessage = function(act,txt){
	Message.add(act.id,txt);
}

Actor.ChatHead = function(text,timer){
	return {
		text:text || '',
		timer:timer || 25*10,
	}
}

Actor.nevercombat = function(act){
	act.combat = 0;
	/*
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
	*/
	//For update:
	act.hpMax = 1;
	act.hp = 1;
}

Actor.nevermove = function(act){
	act.move = 0;
		/*
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
	*/
	//For update:
	act.spdX = 0;
	act.spdY = 0;
	act.maxSpd = 1;
}

Actor.generateOnclick = function(act){
	act.onclick = act.onclick || {};
	
	for(var i in act.onclick)	//if added onclick manually in quest api
		if(act.onclick[i] && act.onclick[i].param[0] !== act.id)
			act.onclick[i].param.unshift(act.id);
			
	var click = {
		left:act.onclick.left || (act.optionList && act.optionList.option[0]) || null,
		right:act.onclick.right || null,
		shiftLeft:act.onclick.shiftLeft || null,
		shiftRight:act.onclick.shiftRight || null,
	}
	
	if(!click.shiftLeft	&& !click.shiftRight && !click.left && !click.right) return null;
	return click;
}

Actor.generateOptionList = function(act){
	if(act.hideOptionList) return null;
	var name = act.name;
	var option = [];
	
	if(act.onclick){
		if(act.onclick.left) option.push(act.onclick.left);	//note: Button.Click is same than OptionList.Option
		if(act.onclick.right) option.push(act.onclick.right);
		if(act.onclick.shiftLeft) option.push(act.onclick.shiftLeft);
		if(act.onclick.shiftRight) option.push(act.onclick.shiftRight);
	}
	
	//if(act.type === 'player') option.push(OptionList.Option(Actor.click.trade,[OptionList.ACTOR,act.id],'Trade'));
	if(act.dialogue) option.push(OptionList.Option(Actor.click.dialogue,[OptionList.ACTOR,act.id],'Talk'));
	if(act.waypoint) option.push(OptionList.Option(Actor.click.waypoint,[OptionList.ACTOR,act.id],'Set Respawn'));
	if(act.loot)	option.push(OptionList.Option(Actor.click.loot,[OptionList.ACTOR,act.id],'Loot'));
	if(act.skillPlot)	option.push(OptionList.Option(Actor.click.skillPlot,[OptionList.ACTOR,act.id],'Harvest'));
	if(act.toggle) option.push(OptionList.Option(Actor.click.toggle,[OptionList.ACTOR,act.id],'Interact With'));
	if(act.teleport) option.push(OptionList.Option(Actor.click.teleport,[OptionList.ACTOR,act.id],'Teleport'));
	if(act.bank) option.push(OptionList.Option(Actor.click.bank,[OptionList.ACTOR,act.id],'Bank'));
	if(act.signpost) option.push(OptionList.Option(Actor.click.signpost,[OptionList.ACTOR,act.id],'Read'));
	if(act.pushable) option.push(OptionList.Option(Actor.click.pushable,[OptionList.ACTOR,act.id],'Push'));
	
	if(act.deathEvent && Quest.TESTING.simple) 
		option.push(OptionList.Option(function(key,eid){ 	
			var e = Actor.get(eid);
			Message.add(key,'You killed "' + e.name + '".'); 
			e.deathEvent(key,eid);  
		},[act.id],'Kill'));
	
	if(option.length === 0) return null;
	return Actor.OptionList(act.name,option);	//bad...
}


Actor.creation = {}; 

Actor.creation.lvl = function(lvl,mod){
	if(!mod) return lvl;
	if(typeof mod === 'number') return mod;
	if(typeof mod === 'function') return mod(lvl);
	
	if(mod[0] === '+' || mod[0] === '-') return lvl + +mod;
	if(mod[0] === '*') return lvl * +mod.slice(1);
	
	return lvl;	
}


Actor.remove = function(act){
	if(typeof act === 'string') act = Actor.LIST[act];
	Map.leave(act,act.map,true);
	if(Actor.isPlayer(act)) 
		delete Actor.USERNAME_TO_ID[act.username];
	Actor.removeFromList(act.id);
	ActiveList.removeFromList(act.id);
	if(act.group) ActorGroup.removeActorFromGroup(act);
	if(act.summoned && Actor.get(act.summoned.parent)) 
		delete Actor.get(act.summoned.parent).summon[act.summoned.name];
}

Actor.setWeakness = function(act){
	var min = CST.bigInt;
	var max = 0;
	var resist = '';
	var weak = '';
	
	for(var i in act.mastery.def){
		if(act.mastery.def[i].sum > max){
			max = act.mastery.def[i].sum;
			resist = i;
		}
		if(act.mastery.def[i].sum < min){
			min = act.mastery.def[i].sum;
			weak = i;
		}
	}
	if(weak === resist) weak = resist = '';
	act.weakness = Actor.Weakness(resist,weak);
}

Actor.Weakness = function(resist,weak){
	return {
		resist:resist || '',
		weak:weak || '',
	}
}

Actor.getMouse = function(act){
	return SERVER ? {x:act.mouseX,y:act.mouseY} : Input.getMouse();
}
	
Actor.getMain = function(act){	//accept string key and object
	return SERVER ? Main.get(act.id || act) : main;
}

Actor.Map = function(map){
	return map;
}	

Actor.Map.compressClient = function(name){
	//used for instanced. client doesnt need to know its instanced
	return Map.getModel(name);
}

//####################################


Actor.Mastery = function(def,dmg){
	return {	
		def:def || Actor.Mastery.part(),
		dmg:dmg || Actor.Mastery.part(),
	};
};

Actor.Mastery.part = function(me,ra,ma,fi,co,li){
	return {
		melee:me || Actor.Mastery.element(),
		range:ra || Actor.Mastery.element(),
		magic:ma || Actor.Mastery.element(),
		fire:fi || Actor.Mastery.element(),
		cold:co || Actor.Mastery.element(),
		lightning:li || Actor.Mastery.element(),
	}
}
Actor.Mastery.element = function(sum,plus,time,x,exp){
	return {
		'+':plus === undefined ? 0: plus,
		'*': time === undefined ? 1: time,
		'x':x === undefined ? 1: x,
		'^':exp === undefined ? 1: exp,
		'sum':sum === undefined ? 1: sum,
		'mod':1
	};
}

Actor.mastery = {};
Actor.mastery.update = function(act){
	//Note: mod is applied in Combat.attack.mod.act
	var mas = act.mastery;
	for(var i in mas){
		for(var j in mas[i]){
			var m = mas[i][j];
			m.sum = Math.pow(m['x'] * m['*'],m['^']) + m['+'];
		}
	}
}


Actor.CombatContext = function(){
	return {ability:'normal',equip:'normal'};
}


Actor.Pushable = function(magn,time,event){
	return {
		magn:magn,
		time:time,
		event:event||null,
		timer:0,
		angle:0
	};
}
Actor.Block = function(size,value,impactPlayer,impactNpc,impactBullet){
	return {
		size:size,
		value:value === undefined ? 1 : value,
		impactPlayer:impactPlayer === undefined ? true : impactPlayer,
		impactNpc:impactNpc === undefined ? true : impactNpc,
		impactBullet:impactBullet === undefined ? true : impactBullet,
	};
}


Actor.changeSprite = function(act,info){
	Sprite.change(act,info);
}

Actor.Summon = function(){
	return {
		child:{},
	}
}
Actor.Summoned = function(parent,name,time,distance){
	return {
		parent:parent,
		name:name,
		time:time,
		distance:distance,		
	}
}


Actor.OptionList = function(name,option){
	return OptionList(name,option);
}
