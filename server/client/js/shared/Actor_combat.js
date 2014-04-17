Actor = {};

Actor.getCombatLevel = function(act){
	return Math.max(act.skill.lvl.melee,act.skill.lvl.range,act.skill.lvl.magic);
}

Actor.enemyPower = function(num){
	var dmg = 1 + Math.sqrt(num-1) * 0.25;
	var def = 1 + Math.sqrt(num-1) * 0.50;
	return [
		{'stat':'globalDmg','value':dmg || 1,'type':'*','time':60*1000,'name':'enemypower'},
		{'stat':'globalDef','value':def || 1,'type':'*','time':60*1000,'name':'enemypower'},
	];
}

Actor.setCombatContext = function(act,type){
	act.combatContext = type;
	Actor.update.equip(act);

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
	var defratio = server ? Actor.getEquip(act).def : player.equip.def;
	var def = {
		main:act.globalDef,
		ratio:deepClone(defratio)
	};
	for(var i in def.ratio){
		def.ratio[i] *= act.mastery.def[i].mod * act.mastery.def[i].sum;
		def.ratio[i].mm(1);
	}
	return def;
}


