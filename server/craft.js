/*
category	//armor or weapon
piece //where its equipped, melee, range, magic, helm, ammy
type //chain,ruby,...
quality = higher chance to be near top bracket
rarity = affect amount of mods
amount = amount of mods
lvl = lvl used for boosts

0.9+0.1*Math.log10(10+x);

*/


//BOOST
initBoostDb = function(){
	//stats in [] are transformed into multiple stats using boostPreDbConvertList.
	//value: [min,max], mod: chance to be picked
	
	boostPreDb = {};
	boostPreDb['melee'] = [
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];
	boostPreDb['range'] = [
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];
	
	boostPreDb['magic'] = [
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];
	
	boostPreDb['bracelet'] = [
		{'stat':'acc','lvl':0,'mod':1,'value':[0.2,0.4]},
		{'stat':'pickRadius','lvl':0,'mod':1,'value':[1000,1000]},
		{'stat':'item-quantity','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];
	
	boostPreDb['helm'] = [
		{'stat':'pierce-chance','lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':'pierce-dmgReduc','lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':'pickRadius','lvl':0,'mod':1,'value':[1000,1000]},
		{'stat':'item-quality','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];
	
	boostPreDb['amulet'] = [
		{'stat':'pickRadius','lvl':0,'mod':1,'value':[1000,1000]},
		{'stat':'item-rarity','lvl':0,'mod':1,'value':[.3,.3]},		
		{'stat':['status-all'],'lvl':0,'mod':5,'value':[.1,.3]},		
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];
	
	boostPreDb['gloves'] = [
		{'stat':'pickRadius','lvl':0,'mod':1,'value':[1000,1000]},
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':'strike-range','lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];
	
	boostPreDb['body'] = [
		{'stat':'pierce-chance','lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':'item-quantity','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];
	
	boostPreDb['shield'] = [
		{'stat':'strike-size','lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':'item-quality','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];

	boostPreDb['boots'] = [
		{'stat':'pierce-dmgReduc','lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':'maxSpd','lvl':0,'mod':1,'value':[1,3]},
		{'stat':'acc','lvl':0,'mod':1,'value':[0.2,0.4]},
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];

	boostPreDb['pants'] = [
		{'stat':'maxSpd','lvl':0,'mod':1,'value':[1,3]},
		{'stat':'acc','lvl':0,'mod':1,'value':[0.2,0.4]},
		{'stat':'item-quantity','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':'bullet-amount','lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];


	boostPreDb['ring'] = [
		{'stat':'item-quantity','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':'item-quality','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':'item-rarity','lvl':0,'mod':1,'value':[.3,.3]},		
		{'stat':['status-all'],'lvl':0,'mod':5,'value':[.1,.3]},		
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];


	
	var boostPreDbConvertList = {
		'dmg':['dmg-melee-+','dmg-melee-*','dmg-melee-x','dmg-melee-^','dmg-range-+','dmg-range-*','dmg-range-x','dmg-range-^','dmg-magic-+','dmg-magic-*','dmg-magic-x','dmg-magic-^','dmg-fire-+','dmg-fire-*','dmg-fire-x','dmg-fire-^','dmg-cold-+','dmg-cold-*','dmg-cold-x','dmg-cold-^','dmg-lightning-+','dmg-lightning-*','dmg-lightning-x','dmg-lightning-^'],
		'dmg-+':['dmg-melee-+','dmg-range-+','dmg-magic-+','dmg-fire-+','dmg-cold-+','dmg-lightning-+'],'dmg-^':['dmg-melee-^','dmg-range-^','dmg-magic-^','dmg-fire-^','dmg-cold-^','dmg-lightning-^'],'dmg-*':['dmg-melee-*','dmg-range-*','dmg-magic-*','dmg-fire-*','dmg-cold-*','dmg-lightning-*'],'dmg-x':['dmg-melee-x','dmg-range-x','dmg-magic-x','dmg-fire-x','dmg-cold-x','dmg-lightning-x'],'dmg-+':['dmg-melee-+','dmg-range-+','dmg-magic-+','dmg-fire-+','dmg-cold-+','dmg-lightning-+'],'dmg-^':['dmg-melee-^','dmg-range-^','dmg-magic-^','dmg-fire-^','dmg-cold-^','dmg-lightning-^'],'dmg-*':['dmg-melee-*','dmg-range-*','dmg-magic-*','dmg-fire-*','dmg-cold-*','dmg-lightning-*'],'dmg-x':['dmg-melee-x','dmg-range-x','dmg-magic-x','dmg-fire-x','dmg-cold-x','dmg-lightning-x'],
		'dmg-melee':['dmg-melee-+','dmg-melee-*','dmg-melee-x','dmg-melee-^'],
		'dmg-range':['dmg-range-+','dmg-range-*','dmg-range-x','dmg-range-^'],
		'dmg-magic':['dmg-magic-+','dmg-magic-*','dmg-magic-x','dmg-magic-^'],
		'dmg-fire':['dmg-fire-+','dmg-fire-*','dmg-fire-x','dmg-fire-^'],
		'dmg-cold':['dmg-cold-+','dmg-cold-*','dmg-cold-x','dmg-cold-^'],
		'dmg-lightning':['dmg-lightning-+','dmg-lightning-*','dmg-lightning-x','dmg-lightning-^'],
	
		'def':['def-melee-+','def-melee-*','def-melee-x','def-melee-^','def-range-+','def-range-*','def-range-x','def-range-^','def-magic-+','def-magic-*','def-magic-x','def-magic-^','def-fire-+','def-fire-*','def-fire-x','def-fire-^','def-cold-+','def-cold-*','def-cold-x','def-cold-^','def-lightning-+','def-lightning-*','def-lightning-x','def-lightning-^'],
		'def-+':['def-melee-+','def-range-+','def-magic-+','def-fire-+','def-cold-+','def-lightning-+'],'def-^':['def-melee-^','def-range-^','def-magic-^','def-fire-^','def-cold-^','def-lightning-^'],'def-*':['def-melee-*','def-range-*','def-magic-*','def-fire-*','def-cold-*','def-lightning-*'],'def-x':['def-melee-x','def-range-x','def-magic-x','def-fire-x','def-cold-x','def-lightning-x'],'dmg-+':['dmg-melee-+','dmg-range-+','dmg-magic-+','dmg-fire-+','dmg-cold-+','dmg-lightning-+'],'dmg-^':['dmg-melee-^','dmg-range-^','dmg-magic-^','dmg-fire-^','dmg-cold-^','dmg-lightning-^'],'dmg-*':['dmg-melee-*','dmg-range-*','dmg-magic-*','dmg-fire-*','dmg-cold-*','dmg-lightning-*'],'dmg-x':['dmg-melee-x','dmg-range-x','dmg-magic-x','dmg-fire-x','dmg-cold-x','dmg-lightning-x'],
		'def-melee':['def-melee-+','def-melee-*','def-melee-x','def-melee-^'],
		'def-range':['def-range-+','def-range-*','def-range-x','def-range-^'],
		'def-magic':['def-magic-+','def-magic-*','def-magic-x','def-magic-^'],
		'def-fire':['def-fire-+','def-fire-*','def-fire-x','def-fire-^'],
		'def-cold':['def-cold-+','def-cold-*','def-cold-x','def-cold-^'],
		'def-lightning':['def-lightning-+','def-lightning-*','def-lightning-x','def-lightning-^'],
		
		'weapon':['weapon-mace','weapon-spear','weapon-sword','weapon-bow','weapon-boomerang','weapon-crossbow','weapon-wand','weapon-staff','weapon-orb'],		
		'weapon-melee':['weapon-mace','weapon-spear','weapon-sword'],
		'weapon-range':['weapon-bow','weapon-boomerang','weapon-crossbow'],
		'weapon-magic':['weapon-wand','weapon-staff','weapon-orb'],
			
		'status-all':['burn-magn','burn-chance','burn-time','chill-magn','chill-chance','chill-time','confuse-magn','confuse-chance','confuse-time','bleed-magn','bleed-chance','bleed-time','knock-magn','knock-chance','knock-time','drain-magn','drain-chance','drain-time'],
		'status-magn':['burn-magn','chill-magn','confuse-magn','bleed-magn','knock-magn','drain-magn'],
		'status-chance':['burn-chance','chill-chance','confuse-chance','bleed-chance','knock-chance','drain-chance'],
		'status-time':['burn-time','chill-time','confuse-time','bleed-time','knock-time','drain-time'],
		'burn-all':['burn-magn','burn-chance','burn-time'],
		'chill-all':['chill-magn','chill-chance','chill-time'],
		'confuse-all':['confuse-magn','confuse-chance','confuse-time'],
		'bleed-all':['bleed-magn','bleed-chance','bleed-time'],
		'knock-all':['knock-magn','knock-chance','knock-time'],
		'drain-all':['drain-magn','drain-chance','drain-time'],
		
	
	}
	
	var toRemove = [];  //remove the stats in [] and transform in list of stat
	for(var i in boostPreDb){
		for(var k in boostPreDb[i]){
			if(typeof boostPreDb[i][k].stat !== 'string'){
				var stat = boostPreDb[i][k].stat[0];
				var array = boostPreDbConvertList[stat];
				for(var j in array){
					boostPreDb[i].push({'stat':array[j],'lvl':boostPreDb[i][k].lvl,'mod':boostPreDb[i][k].mod/array.length,
											'value':boostPreDb[i][k].value});
				}
				toRemove.push(boostPreDb[i][k]);
			}
		}
		for(var m in toRemove){	boostPreDb[i].splice(boostPreDb[i].indexOf(toRemove[m]),1); }
	}
		
	boostDb = deepClone(boostPreDb);
}

Craft = {};

Craft.create = function(seed){
	seed = Craft.seed(seed);
	if(seed.category === 'armor' || seed.category === 'weapon'){ return Craft.create.equip(seed); }
}

Craft.create.equip = function(seed){
	if(seed.category === 'weapon'){
		var equip = defaultWeapon();
	}
	if(seed.category === 'armor'){
		var equip = defaultArmor();
	}
	
	equip.piece = seed.piece;
	equip.type = seed.type;
	equip.visual = seed.piece + '.' + seed.type;
	equip.name = seed.type;
	equip.lvl = seed.lvl;
	equip.seed = seed;
	
	equip.boost = Craft.boost(seed,equip.boost,seed.amount);
	equip.id = Math.randomId();
	
	return Craft.create.equip[seed.category](equip);
}

Craft.create.equip.armor = function(armor){
	var seed = armor.seed;
	
	for(var k in Cst.element.list){
		var i = Cst.element.list[k];
		armor.defRatio[i] = Math.random()*0.5+0.5;
	}
	var mod = 0.9 + Math.pow(Math.random(),1/(seed.quality+1))*0.2;
	armor.defMain = Math.pow(seed.lvl+10,1.5)/30 * mod;	

	
	initArmor(armor);
	return armor.id;
}

Craft.create.equip.weapon = function(weapon){
	var seed = weapon.seed;
	
	var mod = 0.9 + Math.pow(Math.random(),1/(seed.quality+1))*0.2;
	weapon.dmgMain = Math.pow(seed.lvl+10,1.5)/30 * mod;	
	
	//Crappy dmgRatio system
	for(var i in weapon.dmgRatio){
		weapon.dmgRatio[i] = Math.random();
	}
	weapon.dmgRatio[seed.piece] += 0.50;
	
	initWeapon(weapon);
	return weapon.id;
}

Craft.create.equip.color = function(w){
	if(w.boost.length === 0) return 'white'; 
	if(w.boost.length <= 2) return 'blue';  
	return 'yellow';  
}



//Init
Craft.plan = function(key,sed,req){
	var seed = sed;
	var bool = true;
		
	var string = 'To craft ' + seed.piece + ': <br>';
	
	//verify if has skill lvl
	for(var i in req.skill){
		var color = 'green';
		if(mainList[key].skill[i] < req.skill[i]){ bool = false; color = 'red';}
		string += "<span style='color:" + color + "'> Level" + req.item[i].lvl + " " + itemDb[req.item[i].item].name + "</span>, ";
	}
	
	//verify if has item
	for(var i in req.item){
		var color = 'green';
		if(!mainList[key].invList.have(req.item[i].item,req.item[i].amount)){	bool = false; color = 'red';}
		string += "<span style='color:" + color + "'> x" + req.item[i].amount + " " + itemDb[req.item[i].item].name + "</span>, ";
	}
	
	if(bool){ 
		for(var i in req.item){	mainList[key].invList.remove(req.item[i].item,req.item[i].amount);}
		var id = Craft.create(seed);
		mainList[key].invList.add(id);
	}
	else { Chat.add(key,string); }
	
	
}



//set the default seed. take into consideration if weapon or armor
Craft.seed = function(seed){ //need to fix for ability too
	seed = seed ? deepClone(seed) : {}; 
	
	seed.category = seed.category || 'armor'; 
	if(seed.category === 'weapon'){ 
		seed.piece = seed.piece || Cst.equip.weapon.piece[Math.floor(Math.random()*Cst.equip.weapon.piece.length)];
	}
	if(seed.category === 'armor'){ 
		seed.piece = seed.piece || Cst.equip.armor.piece[Math.floor(Math.random()*Cst.equip.armor.piece.length)]; 
	}
	if(!seed.type && (seed.category === 'armor' || seed.category === 'weapon')){ 
		seed.type =  Cst.equip[seed.piece].type[Math.floor(Math.random()*Cst.equip[seed.piece].type.length)]; 
	}
	
	seed.quality = seed.quality  || 0; 
	seed.lvl = seed.lvl || 0; 
	seed.rarity = seed.rarity  || 0; 
		
	var amount = Math.pow(Math.random(),(1+seed.rarity));
	amount = Math.pow(amount,1/2);
	amount = Math.pow(amount,1/2);
	amount = Math.log(1/amount) / Math.log(2);
	amount = Math.floor(amount);
	amount = amount%6;
	seed.amount = amount+3; 
	return seed;
}

Craft.seed.template = function(obj){
	var seed = {}
	seed.quality = 0;
	seed.lvl = obj.lvl
	seed.rarity = 0;
	seed.type = obj.type;
	seed.category = obj.dmgMain ? 'weapon' : 'armor';
	seed.piece = obj.piece;
	seed.amount = obj.boost.length;
	
	return seed;
}


//Orb
Craft.orb = function(key,orb,amount,wId,mod){
	amount = amount === 'pref' ? mainList[key].pref.orbAmount : amount;
	amount = Math.min(amount,mainList[key].invList.have(orb + '_orb',0,'amount'));
	var func; var equip; var type;
	if(weaponDb[wId]){	func = initWeapon;	equip = deepClone(weaponDb[wId]); type = 'equip';}
	if(armorDb[wId]){	func = initArmor;	equip = deepClone(armorDb[wId]); type = 'equip';}
	if(abilityDb[wId]){	func = initAbility;	equip = deepClone(abilityDb[wId]); type = 'ability';}
	if(!equip){	Chat.add(key,"You can't use this orb on this item.");return; }
	
	if(orb === 'boost'){
		equip.boost = Craft.boost(equip.seed,equip.boost,1);
		equip.orb.boost.history.push([Date.now(),equip.boost[equip.boost.length-1]]);
	}
	if(orb === 'upgrade'){
		if(!mod){
			equip.orb.upgrade.amount += amount;
			equip.orb.upgrade.bonus = orbFormula(equip.orb.upgrade.amount);
		} else if(equip.modList && equip.modList[mod] !== undefined){
			equip.modList[mod]++;
		}
	}
	if(orb === 'removal'){
		if(!equip.boost){ Chat.add(key,"This piece of equipment doesn't have any boost ro remove."); return; }
		var rev = Math.floor(Math.random()*equip.boost.length);
		equip.boost.splice(rev,1);
	}
	
	Item.remove(equip.id);
	equip.id = Math.randomId();
	func(equip);
	mainList[key].invList.remove(orb + '_orb',amount);
	
	if(type === 'equip'){
		mainList[key].invList.remove(wId);
		mainList[key].invList.add(equip.id);
	}
	if(type === 'ability'){
		Mortal.removeAbility(key,wId);
		Mortal.learnAbility(key,equip.id);
		Chat.add(key,'Ability Mod Upgraded.');
	}
}



//transform equip into shard
Craft.salvage = function(key,id){
	if(mainList[key].invList.have(id)){
		var type = itemDb[id].type;
		if(type === 'weapon'){ var equip = weaponDb[id]; }
		else if(type === 'armor'){ var equip = armorDb[id]; }
		else {return;}
		mainList[key].invList.remove(id);
		mainList[key].invList.add('shard-'+equip.color);
	}
}



//add a boost to a weapon/armor/other using a seed
Craft.boost = function(seed,where,amount){
	for(var i = 0 ; i < amount && i > -1; i++){
		var boost = Craft.boost.generate(seed);
		for(var j in where){
			if(where[j].stat === boost.stat){ 
				i -= 0.99;
				continue;
			} 
		}
		where.push(boost);		
	}
	return where;
}

Craft.boost.generate = function(seed){
	var boost = randomViaMod(boostDb[seed.piece],seed.lvl);
	var value = Craft.boost.generate.roll(boost.value,seed.quality);
	
	return {'stat':boost.stat,
			'type':boost.type || 'base',
			'value':value,
			'tier':Craft.boost.generate.tier(boost.value,value)
	};
}



Craft.boost.generate.roll = function(mm,qual){
	qual = qual || 0;
	return mm[0] + (mm[1]-mm[0])*( Math.pow(Math.random(),1/(qual+1)));
}

Craft.boost.generate.tier = function(mm,value){
	return (value-mm[0])/(mm[1]-mm[0])
}




