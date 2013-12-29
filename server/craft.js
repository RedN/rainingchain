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
	
	equip.boost = addBoostViaSeed(seed,equip.boost,seed.amount);
	equip.id = Math.randomId();
	
	return Craft.create.equip[seed.category](equip);
}

Craft.create.equip.armor = function(armor){
	var seed = armor.seed;
	
	for(var k in elementName){
		var i = elementName[k];
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
	if(!seed){ seed = {}; }
	seed = deepClone(seed);
	
	if(!seed.category){ seed.category = 'armor'; }
	if(seed.category == 'weapon' && !seed.piece){ 
		seed.piece = weaponPieceName[Math.floor(Math.random()*weaponPieceName.length)];
	}
	if(seed.category == 'armor' && !seed.piece){ 
		seed.piece = armorPieceName[Math.floor(Math.random()*armorPieceName.length)]; 
	}
	if(!seed.type && (seed.category == 'armor' || seed.category == 'weapon')){ 
		seed.type =  typeForPiece[seed.piece][Math.floor(Math.random()*typeForPiece[seed.piece].length)]; 
	}
	
	if(!seed.quality){ seed.quality = 0; }
	if(!seed.lvl){ seed.lvl = 0; }
	if(!seed.rarity){ seed.rarity = 0; }

	
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
		equip.boost = addBoostViaSeed(equip.seed,equip.boost,1);
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
	
	removeItemDb(equip.id);
	equip.id = Math.randomId();
	func(equip);
	mainList[key].invList.remove(orb + '_orb',amount);
	
	if(type === 'equip'){
		mainList[key].invList.remove(wId);
		mainList[key].invList.add(equip.id);
	}
	if(type === 'ability'){
		removeAbility(key,wId);
		addAbility(key,equip.id);
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









