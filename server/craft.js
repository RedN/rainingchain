/*
category	//armor or weapon or ability
piece //where its equipped, melee, range, magic, helm, ammy
type //chain,ruby,...	OR for ability, the ability template used


quality = higher chance to be near top bracket
rarity = affect amount of mods
amount = amount of mods
lvl = lvl used for boosts

0.9+0.1*Math.log10(10+x);


ABILITY

ability has a template
each ability has orbMod (ex: dmg)	ability.orb.upgrade = {'amount':10,'bonus':'dmg'}
adding orb to ability improves it depending on orbMod
each ability has mods (ex: x2b)		ability.modList.x2b = 10
adding orb to ability mods improves the mod depending on Db.ability.mod function






*/


//BOOST
Init.db.boost = function(){
	//stats in [] are transformed into multiple stats using boostPreDbConvertList.
	//value: [min,max], mod: chance to be picked
	
	var boostPreDb = {};
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
		
	Db.boost = boostPreDb;
}

Craft = {};

Craft.seed = function(seed){ //need to fix for ability too
	//set the default seed. take into consideration if weapon or armorseed = seed ? deepClone(seed) : {}; 
	
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

Craft.plan = function(key,sed,req){
	var seed = sed;
	var bool = true;
	var inv = List.main[key].invList;
	var string = 'To craft ' + seed.piece + ': <br>';
	
	//verify if has skill lvl
	for(var i in req.skill){
		var color = 'green';
		if(List.main[key].skill[i] < req.skill[i]){ bool = false; color = 'red';}
		string += "<span style='color:" + color + "'> Level" + req.item[i].lvl + " " + Db.item[req.item[i].item].name + "</span>, ";
	}
	
	//verify if has item
	for(var i in req.item){
		var color = 'green';
		if(!Itemlist.have(inv,req.item[i].item,req.item[i].amount)){	bool = false; color = 'red';}
		string += "<span style='color:" + color + "'> x" + req.item[i].amount + " " + Db.item[req.item[i].item].name + "</span>, ";
	}
	
	if(bool){ 
		for(var i in req.item){	Itemlist.remove(inv,req.item[i].item,req.item[i].amount);}
		var id = Craft.create(seed);
		Itemlist.add(inv,id);
	}
	else { Chat.add(key,string); }
	
	
}

Craft.create = function(seed){
	seed = Craft.seed(seed);
	if(seed.category === 'armor' || seed.category === 'weapon'){ return Craft.equip(seed); }
}

Craft.equip = function(seed){
	var equip = Equip.template();
	equip.piece = seed.piece;
	equip.type = seed.type;
	equip.visual = seed.piece + '.' + seed.type;
	equip.name = seed.type;
	equip.lvl = seed.lvl;
	equip.seed = seed;
	
	equip.boost = Craft.boost(seed,equip.boost,seed.amount);
	equip.id = Math.randomId();
	
	
	for(var k in Cst.element.list){
		var i = Cst.element.list[k];
		equip.defRatio[i] = Math.random()*0.5+0.5;
		equip.dmgRatio[i] = Math.random()*0.5+0.5;
	}
	var mod = 0.9 + Math.pow(Math.random(),1/(seed.quality+1))*0.2;
	equip.defMain = Math.pow(seed.lvl+10,1.5)/30 * mod;	
	equip.dmgMain = Math.pow(seed.lvl+10,1.5)/30 * mod*100;	
	
	Equip.creation(equip);
	
	return equip.id;
}

Craft.equip.color = function(w){
	if(w.boost.length === 0) return 'white'; 
	if(w.boost.length <= 2) return 'blue';  
	return 'yellow';  
}

//{Boost
Craft.boost = function(seed,where,amount){
	//add a boost to a weapon/armor/other using a seed
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
	var boost = Db.boost[seed.piece].random(seed.lvl);
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
//}

//should be under Main.useOrb??
Craft.orb = function(key,orb,amount,wId,mod){
	var inv = List.main[key].invList;
	var mort = List.all[key];
	
	//Set amount of orbs used
	amount = amount === 'pref' ? List.main[key].pref.orbAmount : amount;
	amount = Math.min(amount,Itemlist.have(inv,orb + '_orb',0,'amount'));
	if(!amount) return;
	
	//Know if ability or equip
	var equip; var category;
	if(Db.equip[wId]){		equip = deepClone(Db.equip[wId]); category = 'equip';}
	if(Db.ability[wId]){	equip = deepClone(Db.ability[wId]); category = 'ability';}
	if(!equip || (category === 'ability' && orb !== 'upgrade')){	//ability can only be modded by upgrade
		Chat.add(key,"You can't use this orb on this item.");
		return; 
	} 
	
	
	//Use Orb
	if(orb === 'boost'){
		//need to change so amount makes impact
		amount = 1;
		equip.boost = Craft.boost(equip.seed,equip.boost,1);
		equip.orb.boost.history.push([Date.now(),equip.boost[equip.boost.length-1]]);
	}
	if(orb === 'removal'){
		//need to change so amount makes impact
		amount = 1;
		if(!equip.boost.length){ Chat.add(key,"This piece of equipment doesn't have any boost to remove."); return; }
		var remove = Math.floor(Math.random()*equip.boost.length);
		equip.boost.splice(remove,1);
	}
	
	if(orb === 'upgrade'){
		if(mod){	//aka want to upgrade a mod on an ability
			if(equip.modList && equip.modList[mod] !== undefined){
				equip.modList[mod] += amount;
			} else { Chat.add(key,"This ability doesn't have this mod."); return; }
		} 
		if(!mod){	//aka want to upgrade equip or ability has a whole
			equip.orb.upgrade.amount += amount;
			equip.orb.upgrade.bonus = Craft.orb.formula(equip.orb.upgrade.amount);	//so-so useful for ability
		}
	}
	
	
	
	//Save the changes
	Item.remove(equip.id);
	Itemlist.remove(inv,orb + '_orb',amount);
	Chat.add(key,amount + ' Orbs used on ' + equip.name);
	equip.id = Math.randomId();
	
	
	if(category === 'equip'){
		Equip.creation(equip);
		Itemlist.remove(inv,wId);
		Itemlist.add(inv,equip.id);
	}
	if(category === 'ability'){
		Ability.creation(equip);
		Mortal.removeAbility(mort,wId);
		Mortal.learnAbility(mort,equip.id);
	}
}

Craft.orb.formula = function(x){
	return 0.9+0.1*Math.log10(10+x);
}



Craft.salvage = function(key,id){
	//transform equip into shardvar inv = List.main[key].invList;
	if(Itemlist.have(inv,id)){
		var type = Db.item[id].type;
		if(type === 'weapon'){ var equip = Db.equip[id]; }
		else if(type === 'armor'){ var equip = Db.equip[id]; }
		else {return;}
		Itemlist.remove(inv,id);
		Itemlist.add(inv,'shard-'+equip.color);
	}
}

Craft.setDmgViaRatio = function(info){
	//use dmgratio to make dmg
	var dmg = {};
	var sum = 0;
	for(var i in info.dmgRatio){sum += info.dmgRatio[i];}
	for(var i in info.dmgRatio){info.dmgRatio[i] = info.dmgRatio[i] / sum;}
	for(var i in info.dmgRatio){ dmg[i] = info.dmgRatio[i] * info.dmgMain; }
}

Craft.ratio = {};

Craft.ratio.dmg = function(info){
	//Make it so dmg ratio is always 0<x<1
	info.dmg = {};
	
	var dmg = {};
	var sum = 0;
	for(var i in info.dmgRatio){sum += info.dmgRatio[i];}
	for(var i in info.dmgRatio){
		info.dmgRatio[i] = info.dmgRatio[i] / sum;
		info.dmg[i] = info.dmgMain * info.dmgRatio[i];
	}
	return info;
}


//{Ability BROKEN
Craft.ability = function(seed){
	var a = Craft.ability.template(seed);
	Ability.creation(a);
	return a.id;	
}

Craft.ability.template = function(seed){
	var qua = seed.quality || 1;
	var an = seed.type || 'fireball';

	var ab = deepClone(Db.ability.template[an]);
	
	if(typeof ab.period === 'object'){ ab.period = Craft.boost.generate.roll(ab.period,qua); }
	
	if(ab.action.func === 'Combat.action.attack'){
		var atk = ab.action.param.attack;
		
		//All
		if(typeof atk.angle === 'object'){ atk.angle = Craft.boost.generate.roll(atk.angle,qua); }
		if(typeof atk.amount === 'object'){ atk.amount = Craft.boost.generate.roll(atk.amount,qua); }
		if(typeof atk.dmgMain === 'object'){ atk.dmgMain = Craft.boost.generate.roll(atk.dmgMain,qua); }
		for(var i in atk.dmgRatio){
			if(typeof atk.dmgRatio[i] === 'object'){ atk.dmgRatio[i] = Craft.boost.generate.roll(atk.dmgRatio[i],qua); }
		}
		
		//Status
		for(var st in Cst.status.list){
			var i = Cst.status.list[st];
			if(typeof atk[i] === 'object'){ 
				if(typeof atk[i].chance === 'object'){ atk[i].chance = Craft.boost.generate.roll(atk[i].chance,qua); }
				if(typeof atk[i].magn === 'object'){ atk[i].magn = Craft.boost.generate.roll(atk[i].magn,qua); }
				if(typeof atk[i].time === 'object'){ atk[i].time = Craft.boost.generate.roll(atk[i].time,qua); }
			}
		}
		if(atk.leech){
			if(typeof atk.leech.chance === 'object'){ atk.leech.chance = Craft.boost.generate.roll(atk.leech.chance,qua); }
			if(typeof atk.leech.magn === 'object'){ atk.leech.magn = Craft.boost.generate.roll(atk.leech.magn,qua); }
			if(typeof atk.leech.time === 'object'){ atk.leech.time = Craft.boost.generate.roll(atk.leech.time,qua); }
		}
		if(atk.pierce){
			if(typeof atk.pierce.chance === 'object'){ atk.pierce.chance = Craft.boost.generate.roll(atk.pierce.chance,qua); }
			if(typeof atk.pierce.dmgReduc === 'object'){ atk.pierce.dmgReduc = Craft.boost.generate.roll(atk.pierce.dmgReduc,qua); }
		}
		//need to add curse etc...
	}
	if(ab.action.func === 'Combat.action.summon'){
	
	}
	if(ab.action.func === 'Combat.action.boost'){
	
	}
	ab.id = Math.randomId();
	
	return ab;
}

Craft.ability.mod = function(key,abid,mod){
	//abid: Ability Id, mod: mod Id
	
	//Verify
	var ab = deepClone(Db.ability[abid]);
	if(ab.modList[mod] !== undefined){ Chat.add(key,'This ability already has this mod.'); return; }
	if(Object.keys(ab.modList).length > 5){ Chat.add(key,'This ability already has the maximal amount of mods.'); return; }
	
	//Add
	ab.modList[mod] = 0;
	Mortal.removeAbility(List.all[key],abid);
	ab.id = Math.randomId();
	Ability.creation(ab);
	Mortal.learnAbility(List.all[key],ab.id);
	Chat.add(key,'Mod Added.');
	Itemlist.remove(List.main[key].invList,'mod-'+ mod);	
}

Craft.ability.attack = function(seed){
	//not really used anymore cuz of template
	var possible = {
		'strike':[
			{'mod':1,'hit':'attack3','dmgRatio':{'melee':100,'range':0,'magic':0,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'hit':'fire2','dmgRatio':{'melee':100,'range':0,'magic':0,'fire':25,'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'hit':'ice2','dmgRatio':{'melee':100,'range':0,'magic':0,'fire':5*Math.random(),'cold':25,'lightning':5*Math.random()}},
			{'mod':1,'hit':'thunder2','dmgRatio':{'melee':100,'range':0,'magic':0,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':25}},
			{'mod':1,'hit':'darkness1','dmgRatio':{'melee':100,'range':0,'magic':0,'fire':25,'cold':25,'lightning':25}},
			],

		
		'bullet':[
			{'mod':1,'image':'arrow','hit':'attack3','dmgRatio':{'melee':0,'range':100,'magic':0,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'image':'arrow','hit':'fire2','dmgRatio':{'melee':0,'range':100,'magic':0,'fire':25,'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'image':'arrow','hit':'ice2','dmgRatio':{'melee':0,'range':100,'magic':0,'fire':5*Math.random(),'cold':25,'lightning':5*Math.random()}},
			{'mod':1,'image':'arrow','hit':'thunder2','dmgRatio':{'melee':0,'range':100,'magic':0,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':25}},
			{'mod':1,'image':'arrow','hit':'darkness1','dmgRatio':{'melee':0,'range':100,'magic':0,'fire':25,'cold':25,'lightning':25}},
			
			{'mod':1,'image':'fireball','hit':'fire2','dmgRatio':{'melee':0,'range':0,'magic':100,'fire':100,'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'image':'fireball','hit':'fire2','dmgRatio':{'melee':0,'range':0,'magic':50,'fire':150,'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'image':'fireball','hit':'fire2','dmgRatio':{'melee':0,'range':0,'magic':150,'fire':50,'cold':5*Math.random(),'lightning':5*Math.random()}},
			
			{'mod':1,'image':'iceshard','hit':'ice2','dmgRatio':{'melee':0,'range':0,'magic':100,'fire':5*Math.random(),'cold':100,'lightning':5*Math.random()}},
			{'mod':1,'image':'iceshard','hit':'ice2','dmgRatio':{'melee':0,'range':0,'magic':50,'fire':5*Math.random(),'cold':150,'lightning':5*Math.random()}},
			{'mod':1,'image':'iceshard','hit':'ice2','dmgRatio':{'melee':0,'range':0,'magic':150,'fire':5*Math.random(),'cold':50,'lightning':5*Math.random()}},
		
			{'mod':1,'image':'lightningball','hit':'thunder2','dmgRatio':{'melee':0,'range':0,'magic':100,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':100}},
			{'mod':1,'image':'lightningball','hit':'thunder2','dmgRatio':{'melee':0,'range':0,'magic':50,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':150}},
			{'mod':1,'image':'lightningball','hit':'thunder2','dmgRatio':{'melee':0,'range':0,'magic':150,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':50}},
		]
	}
	
	return possible[seed.type].random();
	
}

//}



