//Combat: Sub Functions
if(!SERVER) Combat = {attack:{}};
Combat.attack.mod = function(player,atk){
	atk = Combat.attack.mod.bonus(player.bonus,atk);
	atk = Combat.attack.mod.weapon(player.weapon,atk);
	atk = Combat.attack.mod.player(player,atk);
	return atk;
}

Combat.attack.mod.bonus = function(bon,atk){
	var bon = Tk.useTemplate(Actor.template.bonus(),bon,0);
	
	//Status Effect
	for(var i in Cst.status.list){
		var status = Cst.status.list[i];
		atk[status].magn *= bon[status].magn;
		atk[status].chance *= bon[status].chance;
		atk[status].time *= bon[status].time;
	}
	atk.leech.chance *= bon.leech.chance;
	atk.leech.magn *= bon.leech.magn;
	atk.crit.magn *= bon.crit.magn; atk.crit.chance *= bon.crit.chance;
	
	
	if(atk.type === 'bullet'){
		atk.amount *= bon.bullet.amount; atk.amount = Math.roundRandom(atk.amount);
		atk.spd *= bon.bullet.spd;
	}
	if(atk.type === 'strike'){
		atk.width *= bon.strike.size; 
		atk.height *= bon.strike.size; 
		atk.maxHit *= bon.strike.maxHit; atk.maxHit = Math.roundRandom(atk.maxHit);
		atk.maxRange *= bon.strike.range; 
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
	if(SERVER) var weapon = Db.equip[weaponid] || Db.equip['unarmed'];
	if(!SERVER) var weapon = Db.query('equip',player.weapon) || {main:1,ratio:Cst.element.template(1)};
	
	var sum = 0;
	atk.dmg.main *= weapon.dmg.main;
	for (var i in atk.dmg.ratio){ 
		var val = Math.min(weapon.dmg.ratio[i],atk.dmg.ratio[i]);
		atk.dmg.ratio[i] = val;
		sum += val;
	}
	atk.weaponCompability = sum;
	return	atk;
}



