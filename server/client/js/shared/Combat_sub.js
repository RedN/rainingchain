//Combat: Sub Functions
if(!server) Combat = {action:{attack:{}}};
Combat.action.attack.mod = function(player,atk){
	atk = Combat.action.attack.mod.bonus(player.bonus,atk);
	atk = Combat.action.attack.mod.player(player,atk);
	atk = Combat.action.attack.mod.weapon(player.weapon,atk);
	return atk;
}

Combat.action.attack.mod.bonus = function(bon,atk){
	var bon = useTemplate(Mortal.template.bonus(),bon,0);
	
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
		atk.pierce.chance *= bon.pierce.chance; atk.pierce.dmgReduc *= bon.pierce.dmgReduc;
	}
	if(atk.type === 's' || atk.type === 'strike'){
		atk.width *= bon.strike.size; 
		atk.height *= bon.strike.size; 
		atk.maxHit *= bon.strike.maxHit; if(Math.random() <= atk.maxHit%1){atk.maxHit += 1; } atk.maxHit = Math.floor(atk.maxHit);
		atk.maxRange *= bon.strike.range; 
	}
	return atk;
}

Combat.action.attack.mod.player = function(player,attack){
	for(var i in attack.dmg){ 
		attack.dmg[i] *= player.dmgMain * player.mastery.dmg[i].sum * player.mastery.dmg[i].mod;
	}
	return attack;
}

Combat.action.attack.mod.weapon = function(weapon,attack){
	var sum = 0;
	for (var i in attack.dmg){ 
		attack.dmg[i] *= weapon.dmgMain;
		var val = Math.min(weapon.dmgRatio[i],attack.dmgRatio[i]);
		attack.dmg[i] *= val;
		sum += val;
	}
	attack.weaponCompability = sum;
	return	attack;
}

