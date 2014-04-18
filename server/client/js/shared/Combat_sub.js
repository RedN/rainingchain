//Combat: Sub Functions
if(!server) Combat = {action:{attack:{}}};
Combat.attack.mod = function(player,atk){
	atk = Combat.attack.mod.bonus(player.bonus,atk);
	atk = Combat.attack.mod.weapon(player.weapon,atk);
	atk = Combat.attack.mod.player(player,atk);
	return atk;
}

Combat.attack.mod.bonus = function(bon,atk){
	var bon = useTemplate(Actor.template.bonus(),bon,0);
	
	//Status Effect
	var list = ['time','magn','chance'];
	for(var i in Cst.status.list){
		for(var j in list){
			atk[Cst.status.list[i]][list[j]] *= bon[Cst.status.list[i]][list[j]];
		}
	}
	for(var j in list){
		atk.leech[list[j]] *= bon.leech[list[j]];
	}
	atk.crit.magn *= bon.crit.magn; atk.crit.chance *= bon.crit.chance;
	
	
	if(atk.type === 'b' || atk.type === 'bullet'){
		atk.amount *= bon.bullet.amount; if(Math.random() <= atk.amount%1){atk.amount += 1; } atk.amount = Math.floor(atk.amount);
		atk.spd *= bon.bullet.spd;
	}
	if(atk.type === 's' || atk.type === 'strike'){
		atk.width *= bon.strike.size; 
		atk.height *= bon.strike.size; 
		atk.maxHit *= bon.strike.maxHit; if(Math.random() <= atk.maxHit%1){atk.maxHit += 1; } atk.maxHit = Math.floor(atk.maxHit);
		atk.maxRange *= bon.strike.range; 
	}
	return atk;
}

Combat.attack.mod.player = function(player,attack){
	attack.dmg.main *= player.globalDmg;
	
	for(var i in attack.dmg.ratio){ 
		attack.dmg.ratio[i] *= player.mastery.dmg[i].sum * player.mastery.dmg[i].mod;
	}
	return attack;
}

Combat.attack.mod.weapon = function(weaponid,attack){
	if(server) var weapon = Db.equip[weaponid] || Db.equip['unarmed'];
	if(!server) var weapon = Db.query('equip',player.weapon) || {main:1,ratio:Cst.element.template(1)};
	
	var sum = 0;
	attack.dmg.main *= weapon.dmg.main;
	for (var i in attack.dmg.ratio){ 
		var val = Math.min(weapon.dmg.ratio[i],attack.dmg.ratio[i]);
		attack.dmg.ratio[i] = val;
		sum += val;
	}
	attack.weaponCompability = sum;
	return	attack;
}



