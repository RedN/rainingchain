//List of functions used by Draw.

//Convert a boost object into a string.
//note: prototype.toString() would be better.
convertBoostDraw = function(boost){
	if(boost.type === 'custom'){ return uniqueBoostDb[boost.value].name; }

	var name = statDb[boost.stat].name;
	
	//Round and add %
	var value = boost.value;
	var rawValue = boost.value;
	if(Math.abs(value) < 1){ 
		value *= 100; value = round(value,2).toString() + '%';
	} else { value = round(value,2)};
	
	
	var last = name[name.length-1];
	if(last == 'x' ||  last == '*' || last == '+' || last == '^'){
		if(rawValue < 0){value = '-' + last + value;}
		if(rawValue > 0){value = last + value;}
		name = name.slice(0,-1);
	} else {
		if(value < 0){value = '-' + value;}
		if(value > 0){value = '+' + value;}
	}
	
	return [name,value];
	 
	/*
	if(boost.type == 'base'){	}
	else if(boost.type == 'max'){
		return '-Set Max ' + prename + ' to ' + value;
	} else if(boost.type == 'min'){
		return '-Set Min ' + prename + ' to ' + value;
	}
	*/
}

//Convert attack mod into a string
convertAttackMod = {
	'bleed':(function(a){ return round(a.chance*100,2) + '% to Bleed for ' + round(a.magn*100*a.time,2) + '% Initial Dmg over ' + round(a.time/25,2) + 's.'; }),
	'knock':(function(a){ return round(a.chance*100,2) + '% to Knockback by ' + round(a.magn*a.time,2) + ' pixel over ' + round(a.time/25,2) + 's.'; }),	
	'drain':(function(a){ return round(a.chance*100,2) + '% to Drain ' + round(a.magn*100,2) + '% Mana.'; }),
	'burn':(function(a){ return round(a.chance*100,2) + '% to Burn for ' + round(a.magn*100*a.time,2) + '% Hp of Monster\'s Remaining Hp over ' + round(a.time/25,2) + 's.'; }),
	'chill':(function(a){ return round(a.chance*100,2) + '% to Chill, reducing Speed by -' + round(a.magn*100,2) + '% for ' + round(a.time/25,2) + 's.'; }),
	'confuse':(function(a){ return round(a.chance*100,2) + '% to Confuse for ' + round(a.time/25,2) + 's.'; }),
	'leech':(function(a){ return round(a.chance*100,2) + '% to Life Leech ' + round(a.magn*100,2) + '% Hp'; }),
	'pierce':(function(a){ return round(a.chance*100,2) + '% to Pierce, reducing this attack damage by ' + round(100-a.dmgReduc*100,2) + '% Dmg.'; }),
	'curse':(function(a){ return round(a.chance*100,2) + '% to Lower ' + statDb[a.boost[0].stat].name + ' by ' + round(100-a.boost[0].value*100,2) + '% for ' + round(a.boost[0].time/25,2) + 's.'; }),
	'boomerang':(function(a){ return 'Boomerang'; }),
	'nova':(function(a){ return 'Nova'; }),
	'parabole':(function(a){ return 'Parabole Bullet'; }),
	'sin':(function(a){ return 'Sin Bullet'; }),
	'onHit':(function(a){ return 'Explosive'; }),
	'hitIfMod':(function(a){ return 'Affect Allies'; }),
}


statListOperationInit = (function(){

defListOperation = [
	{'name':'Melee','icon':'defensive.melee','stat':[{'name':'x','stat':'def-melee-x'},{'name':'*','stat':'def-melee-*'},{'name':'^','stat':'def-melee-^'},{'name':'+','stat':'def-melee-+'}],'string':(function(){ return defConvertStringLeft('melee')})},
	{'name':'Range','icon':'defensive.range','stat':[{'name':'x','stat':'def-range-x'},{'name':'*','stat':'def-range-*'},{'name':'^','stat':'def-range-^'},{'name':'+','stat':'def-range-+'}],'string':(function(){ return defConvertStringLeft('range')})},
	{'name':'Magic','icon':'defensive.magic','stat':[{'name':'x','stat':'def-magic-x'},{'name':'*','stat':'def-magic-*'},{'name':'^','stat':'def-magic-^'},{'name':'+','stat':'def-magic-+'}],'string':(function(){ return defConvertStringLeft('magic')})},
	{'name':'Fire','icon':'defensive.fire','stat':[{'name':'x','stat':'def-fire-x'},{'name':'*','stat':'def-fire-*'},{'name':'^','stat':'def-fire-^'},{'name':'+','stat':'def-fire-+'}],'string':(function(){ return defConvertStringLeft('fire')})},
	{'name':'Cold','icon':'defensive.cold','stat':[{'name':'x','stat':'def-cold-x'},{'name':'*','stat':'def-cold-*'},{'name':'^','stat':'def-cold-^'},{'name':'+','stat':'def-cold-+'}],'string':(function(){ return defConvertStringLeft('cold')})},
	{'name':'Lightning','icon':'defensive.lightning','stat':[{'name':'x','stat':'def-lightning-x'},{'name':'*','stat':'def-lightning-*'},{'name':'^','stat':'def-lightning-^'},{'name':'+','stat':'def-lightning-+'}],'string':(function(){ return defConvertStringLeft('lightning')})},
	
	{'name':'Burn','icon':'defensive.burn','stat':[{'name':'Resist','stat':'resist-burn'},{'name':'Max','stat':'resistMax-burn'}],'string':(function(){ return defConvertStringStatus('burn')})},
	{'name':'Chill','icon':'defensive.chill','stat':[{'name':'Resist','stat':'resist-chill'},{'name':'Max','stat':'resistMax-chill'}],'string':(function(){ return defConvertStringStatus('chill')})},
	{'name':'Confuse','icon':'defensive.confuse','stat':[{'name':'Resist','stat':'resist-confuse'},{'name':'Max','stat':'resistMax-confuse'}],'string':(function(){ return defConvertStringStatus('confuse')})},
	{'name':'Knockback','icon':'defensive.knock','stat':[{'name':'Resist','stat':'resist-knock'},{'name':'Max','stat':'resistMax-knock'}],'string':(function(){ return defConvertStringStatus('knock')})},
	{'name':'Bleed','icon':'defensive.bleed','stat':[{'name':'Resist','stat':'resist-bleed'},{'name':'Max','stat':'resistMax-bleed'}],'string':(function(){ return defConvertStringStatus('bleed')})},

	{'name':'Speed','icon':'defensive.speed','stat':[{'name':'Max','stat':'maxSpd'},{'name':'Acc.','stat':'acc'},{'name':'Fric.','stat':'friction'}],'string':(function(){ return 'Max: ' + round(player.boost.list['maxSpd'].base,2,1) + ', Acc.: ' + round(player.boost.list['acc'].base,2,1)+ ', Fric.: ' + round(player.boost.list['friction'].base,2,1)})},
	{'name':'Pick Radius','icon':'defensive.pickup','stat':[{'name':'Pick Radius','stat':'pickRadius'}],'string':(function(){ return round(player.boost.list['pickRadius'].base,2,1)})},
	{'name':'Item Finding','icon':'defensive.item','stat':[{'name':'Quality','stat':'item-quality'},{'name':'Quantity','stat':'item-quantity'},{'name':'Rarity','stat':'item-rarity'}],'string':(function(){ return 'Qual.: ' + round(player.boost.list['item-quality'].base,2,1) + ', Quant.: ' + round(player.boost.list['item-quantity'].base,2,1)+ ', Rarity: ' + round(player.boost.list['item-rarity'].base,2,1)})},


	{'name':'Life','icon':'resource.hp','stat':[{'name':'Max','stat':'hp-max'},{'name':'Regen','stat':'hp-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['hp-max'].base,0,1) + ', Regen: ' + round(player.boost.list['hp-regen'].base,2,1)})},
	{'name':'Mana','icon':'resource.mana','stat':[{'name':'Max','stat':'mana-max'},{'name':'Regen','stat':'mana-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['mana-max'].base,0,1) + ', Regen: ' + round(player.boost.list['mana-regen'].base,2,1)})},
	{'name':'Fury','icon':'resource.fury','stat':[{'name':'Max','stat':'fury-max'},{'name':'Regen','stat':'fury-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['fury-max'].base,0,1) + ', Regen: ' + round(player.boost.list['fury-regen'].base,2,1)})},
	{'name':'Dodge','icon':'resource.dodge','stat':[{'name':'Max','stat':'dodge-max'},{'name':'Regen','stat':'dodge-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['dodge-max'].base,0,1) + ', Regen: ' + round(player.boost.list['dodge-regen'].base,2,1)})},
	

];


offListOperation = [
	{'name':'Melee','icon':'offensive.melee','stat':[{'name':'x','stat':'dmg-melee-x'},{'name':'*','stat':'dmg-melee-*'},{'name':'^','stat':'dmg-melee-^'},{'name':'+','stat':'dmg-melee-+'}],'string':(function(){ return offConvertStringLeft('melee')})},
	{'name':'Range','icon':'offensive.range','stat':[{'name':'x','stat':'dmg-range-x'},{'name':'*','stat':'dmg-range-*'},{'name':'^','stat':'dmg-range-^'},{'name':'+','stat':'dmg-range-+'}],'string':(function(){ return offConvertStringLeft('range')})},
	{'name':'Magic','icon':'offensive.magic','stat':[{'name':'x','stat':'dmg-magic-x'},{'name':'*','stat':'dmg-magic-*'},{'name':'^','stat':'dmg-magic-^'},{'name':'+','stat':'dmg-magic-+'}],'string':(function(){ return offConvertStringLeft('magic')})},
	{'name':'Fire','icon':'offensive.fire','stat':[{'name':'x','stat':'dmg-fire-x'},{'name':'*','stat':'dmg-fire-*'},{'name':'^','stat':'dmg-fire-^'},{'name':'+','stat':'dmg-fire-+'}],'string':(function(){ return offConvertStringLeft('fire')})},
	{'name':'Cold','icon':'offensive.cold','stat':[{'name':'x','stat':'dmg-cold-x'},{'name':'*','stat':'dmg-cold-*'},{'name':'^','stat':'dmg-cold-^'},{'name':'+','stat':'dmg-cold-+'}],'string':(function(){ return offConvertStringLeft('cold')})},
	{'name':'Lightning','icon':'offensive.lightning','stat':[{'name':'x','stat':'dmg-lightning-x'},{'name':'*','stat':'dmg-lightning-*'},{'name':'^','stat':'dmg-lightning-^'},{'name':'+','stat':'dmg-lightning-+'}],'string':(function(){ return offConvertStringLeft('lightning')})},
	
	{'name':'Weapon','icon':'offensive.melee','stat':[{'name':'Mace','stat':'weapon-mace'},{'name':'Spear','stat':'weapon-spear'},{'name':'Sword','stat':'weapon-sword'}],'string':(function(){ return 'Mace: ' + round(player.boost.list['weapon-mace'].base,2,1) + ', Spear: ' + round(player.boost.list['weapon-spear'].base,2,1) + ', Sword: ' + round(player.boost.list['weapon-sword'].base,2,1)						})},
	{'name':'Weapon','icon':'offensive.range','stat':[{'name':'Bow','stat':'weapon-bow'},{'name':'Boomerang','stat':'weapon-boomerang'},{'name':'Crossbow','stat':'weapon-crossbow'}],'string':(function(){ return 'Bow: ' + round(player.boost.list['weapon-bow'].base,2,1) + ', Boom.: ' + round(player.boost.list['weapon-boomerang'].base,2,1) + ', CBow: ' + round(player.boost.list['weapon-crossbow'].base,2,1)						})},
	{'name':'Weapon','icon':'offensive.magic','stat':[{'name':'Wand','stat':'weapon-wand'},{'name':'Staff','stat':'weapon-staff'},{'name':'Orb','stat':'weapon-orb'}],'string':(function(){ return 'Wand: ' + round(player.boost.list['weapon-wand'].base,2,1) + ', Staff: ' + round(player.boost.list['weapon-staff'].base,2,1) + ', Orb: ' + round(player.boost.list['weapon-orb'].base,2,1)						})},
	
	{'name':'Burn','icon':'offensive.burn','stat':[{'name':'Chance','stat':'burn-chance'},{'name':'Magn','stat':'burn-magn'},{'name':'Time','stat':'burn-time'}],'string':(function(){ return offConvertStringStatus('burn')})},
	{'name':'Chill','icon':'offensive.chill','stat':[{'name':'Chance','stat':'chill-chance'},{'name':'Magn','stat':'chill-magn'},{'name':'Time','stat':'chill-time'}],'string':(function(){ return offConvertStringStatus('chill')})},
	{'name':'Confuse','icon':'offensive.confuse','stat':[{'name':'Chance','stat':'confuse-chance'},{'name':'Magn','stat':'confuse-magn'},{'name':'Time','stat':'confuse-time'}],'string':(function(){ return offConvertStringStatus('confuse')})},
	{'name':'Knockback','icon':'offensive.knock','stat':[{'name':'Chance','stat':'knock-chance'},{'name':'Magn','stat':'knock-magn'},{'name':'Time','stat':'knock-time'}],'string':(function(){ return offConvertStringStatus('knock')})},
	{'name':'Bleed','icon':'offensive.bleed','stat':[{'name':'Chance','stat':'bleed-chance'},{'name':'Magn','stat':'bleed-magn'},{'name':'Time','stat':'bleed-time'}],'string':(function(){ return offConvertStringStatus('bleed')})},
	{'name':'Drain','icon':'offensive.drain','stat':[{'name':'Chance','stat':'drain-chance'},{'name':'Magn','stat':'drain-magn'},{'name':'Time','stat':'drain-time'}],'string':(function(){ return offConvertStringStatus('drain')})},
	
	{'name':'Leech Hp','icon':'resource.hp','stat':[{'name':'Chance','stat':'leech-chance'},{'name':'Magn','stat':'leech-magn'},{'name':'Time','stat':'leech-time'}],'string':(function(){ return offConvertStringStatus('leech'); })},
	
	{'name':'Pierce','icon':'offensive.pierce','stat':[{'name':'Chance','stat':'pierce-chance'},{'name':'Dmg Mod','stat':'pierce-dmgReduc'}],'string':(function(){ return 'Chance: ' + round(player.boost.list['pierce-chance'].base,2,1) + ', Dmg Mod: ' + round(player.boost.list['pierce-dmgReduc'].base,2,1); })},
	{'name':'Bullet','icon':'offensive.bullet','stat':[{'name':'Amount','stat':'bullet-amount'},{'name':'Aim','stat':'aim'}],'string':(function(){ return 'Amount: ' + round(player.boost.list['bullet-amount'].base,2,1) + ' , Aim: ' + round(player.boost.list['aim'].base,2,1); })},
	{'name':'Strike','icon':'offensive.bullet','stat':[{'name':'AoE','stat':'bullet-amount'},{'name':'Range','stat':'aim'},{'name':'Max','stat':'aim'}],'string':(function(){ return 'AoE: ' + round(player.boost.list['strike-size'].base,2,1) + ', Range: ' + round(player.boost.list['strike-range'].base,2,1) + ', Max: ' + round(player.boost.list['strike-maxHit'].base,2,1); })},
	{'name':'Summon','icon':'summon.wolf','stat':[{'name':'Amount','stat':'summon-amount'},{'name':'Time','stat':'summon-time'},{'name':'Attack','stat':'summon-atk'},{'name':'Defence','stat':'summon-def'}],'string':(function(){ return '#:' + round(player.boost.list['summon-amount'].base,2,1) + ', Time:' + round(player.boost.list['summon-time'].base,2,1) + ', A:' + round(player.boost.list['summon-atk'].base,2,1)+ ', D:' + round(player.boost.list['summon-def'].base,2,1); })},

	{'name':'Atk Spd','icon':'offensive.atkSpd','stat':[{'name':'Main','stat':'atkSpd-main'},{'name':'Support','stat':'atkSpd-support'}],'string':(function(){ return 'Main:' + round(player.boost.list['atkSpd-main'].base,2,1) + ', Support:' + round(player.boost.list['atkSpd-support'].base,2,1); })},

	
	
];
})();


//{Convert	
offConvertStringLeft = function(name){
	var b0 = round(player.boost.list['dmg-' + name + '-x'].base,2,1);
	var b1 = round(player.boost.list['dmg-' + name + '-*'].base,2,1);
	var b2 = round(player.boost.list['dmg-' + name + '-^'].base,2,1);
	var b3 = round(player.boost.list['dmg-' + name + '-+'].base,2,1);
	var sum = round(Math.pow(player.boost.list['dmg-' + name + '-x'].base*player.boost.list['dmg-' + name + '-*'].base,player.boost.list['dmg-' + name + '-^'].base) + player.boost.list['dmg-' + name + '-+'].base,3);
	var string = '( ' + b0 + ' * ' + b1 + ' ) ^ ' + b2 + ' + ' + b3 + ' = ' + sum;
	return string
}

defConvertStringLeft = function(name){
	var b0 = round(player.boost.list['def-' + name + '-x'].base,2,1);
	var b1 = round(player.boost.list['def-' + name + '-*'].base,2,1);
	var b2 = round(player.boost.list['def-' + name + '-^'].base,2,1);
	var b3 = round(player.boost.list['def-' + name + '-+'].base,2,1);
	var sum = round(Math.pow(player.boost.list['def-' + name + '-x'].base*player.boost.list['def-' + name + '-*'].base,player.boost.list['def-' + name + '-^'].base) + player.boost.list['def-' + name + '-+'].base,3);
	var string = '( ' + b0 + ' * ' + b1 + ' ) ^ ' + b2 + ' + ' + b3 + ' = ' + sum;
	return string
}

offConvertStringStatus = function(name){
	var b0 = round(player.boost.list[name + '-chance'].base,2,1);
	var b1 = round(player.boost.list[name + '-magn'].base,2,1);
	var b2 = round(player.boost.list[name + '-time'].base,2,1);

	var string = '%: ' + b0 + ', Magn: ' + b1 + ', Time: ' + b2;
	return string
}

defConvertStringStatus = function(name){
	var b0 = round(player.boost.list['resist-' + name].base,2,1);
	var b1 = round(player.boost.list['resistMax-' + name].base,2,1);
	
	var string = 'Resist: ' + b0 + ', Max: ' + b1;
	return string
}
//}


closeAllWindow = function(key){
	if(mainList[key].windowList.trade.trader){ mainList[mainList[key].windowList.trade.trader].windowList.trade = 0; }
	
	for(var i in mainList[key].windowList){
		mainList[key].windowList[i] = 0;
	}
}

openWindow = function(key,name,param){
	closeAllWindow(key);
	mainList[key].windowList[name] = 1;
	
	
	if(name === 'shop'){
		mainList[key].windowList.shop = shopList[param];
	}
	if(name === 'quest'){
		mainList[key].windowList.quest = param;
		updateQuestReq(key,param);
		updateQuestHint(key,param);
	}
	if(name === 'trade'){
		if(!mainList[param].windowList.trade){
			closeAllWindow(key);
			mainList[key].windowList.trade = {'trader':param,'tradeList':mainList[param].tradeList,'confirm':{'self':0,'other':0}};
			mainList[param].windowList.trade = {'trader':key,'tradeList':mainList[key].tradeList,'confirm':{'self':0,'other':0}};
		} else { Chat.add(key,'This player is busy.');}
	}
}










