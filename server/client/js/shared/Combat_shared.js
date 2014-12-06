//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Combat','Equip']));

//Combat: Sub Functions
if(!SERVER) Combat = {attack:{}};
Combat.attack.mod = function(player,atk){
	atk = Combat.attack.mod.bonus(player.bonus,atk);
	atk = Combat.attack.mod.weapon(Actor.getWeapon(player),atk);
	atk = Combat.attack.mod.player(player,atk);
	return atk;
}
Combat.attack.mod.bonus = function(bon,atk){
	var bon = Tk.useTemplate(Actor.Bonus(),bon,0);
	
	//Status Effect
	for(var i in CST.status.list){
		var status = CST.status.list[i];
		if(!atk[status]) continue;
		atk[status].magn *= bon[status].magn;
		atk[status].chance *= bon[status].chance;
		atk[status].time *= bon[status].time;
	}
	if(atk.leech){
		atk.leech.chance *= bon.leech.chance;
		atk.leech.magn *= bon.leech.magn;
	}
	if(atk.crit){
		atk.crit.magn *= bon.crit.magn; 
		atk.crit.chance *= bon.crit.chance;
	}
	
	if(atk.type === 'bullet'){
		atk.amount *= bon.bullet.amount; atk.amount = Math.roundRandom(atk.amount);
		atk.spd *= bon.bullet.spd;
	}
	if(atk.type === 'strike'){
		atk.width *= bon.strike.size; 
		atk.height *= bon.strike.size; 
		atk.maxHit *= bon.strike.maxHit; atk.maxHit = Math.roundRandom(atk.maxHit);
		atk.initPosition.maxRange *= bon.strike.range; 
	}
	return atk;
}

Combat.attack.mod.player = function(player,atk){
	atk.dmg.main *= player.globalDmg;
	
	for(var i in atk.dmg.ratio){ 
		atk.dmg.ratio[i] *= player.mastery.dmg[i].sum * player.mastery.dmg[i].mod;
	}
	return atk;
}

Combat.attack.mod.weapon = function(weaponid,atk){
	if(SERVER) var weapon = Equip.get(weaponid) || Equip.get(CST.UNARMED);
	if(!SERVER) var weapon = QueryDb.get('equip',weaponid) || {main:1,ratio:CST.element.template(1)};
	
	atk.dmg.main *= weapon.dmg.main;
	for(var i in atk.dmg.ratio){ 
		atk.dmg.ratio[i] *= weapon.dmg.ratio[i];	//if good element, x1.5
	}
	return	atk;
}




