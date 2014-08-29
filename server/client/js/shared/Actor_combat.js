//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Tk','Actor']));

Actor.getCombatLevel = function(act){
	return Math.max(act.skill.lvl.melee,act.skill.lvl.range,act.skill.lvl.magic);
}

Actor.getCombatLevelDmgMod = function(act){
	var combatlvl = Actor.getCombatLevel(act);
	return (10+combatlvl)/(10+combatlvl/2);
}

Actor.setCombatContext = function(act,what,type,reset){
	act.combatContext[what] = type;
	if(what === 'ability'){
		if(reset){
			act.abilityList[type] = {};
			act.ability[type] = [];
		}
		act.abilityChange = Actor.template.abilityChange(act.abilityList[type]);
		act.flag.ability = 1;
		act.flag.abilityList = 1;
	}
	if(what === 'equip'){
		if(reset) act.equip[type] = [];
		Actor.update.equip(act);	//act.flag.equip set there
	}
}

Actor.changeHp = function(act,amount){
	Actor.changeResource(act,{hp:amount});
}

Actor.changeResource = function(act,heal){
	for(var i in heal){
		if(typeof heal[i] === 'string'){ act[i] += heal[i].numberOnly()/100*act.resource[i].max; }	//ex: 50%		
		else {	act[i] += heal[i];	}
		act[i] = Math.min(act[i],act.resource[i].max);
	}
}

Actor.getDef = function(act){
	var defratio = SERVER ? Actor.getEquip(act).def : player.equip.def;
	var def = {
		main:act.globalDef,
		ratio:Tk.deepClone(defratio)
	};
	for(var i in def.ratio){
		def.ratio[i] *= act.mastery.def[i].mod * act.mastery.def[i].sum;
		def.ratio[i].mm(1);
	}
	return def;
}

Actor.dodge = function(act,time,dist){
	
	Actor.invincible(act,time);
	
	//movement
	Actor.movePush(act,act.angle,dist/time,time)
	
}

Actor.invincible = function(act,time){
	//invincibility
	var oldtouch = act.damagedIf;
	act.damagedIf = 'false';
	Actor.setTimeout(act,'actor.invincible',time,function(key){
		List.all[key].damagedIf = oldtouch;	
	});

}

Actor.rechargeAbility = function(act){
	var ab = Actor.getAbility(act);
	act.abilityChange.globalCooldown = 0;
	for(var i in ab){
		var ss = ab[i]; if(!ss) continue;	//cuz can have hole if player
		act.abilityChange.charge[ss.id] = 1000;
	}
}




