/*
category	//equip or ability
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


Craft = {};

//{Plan


//{Equip
Craft.equip = function(plan){	//at this point, seed should be all-set
	var equip = Equip.template();
	equip.piece = plan.piece;
	equip.type = plan.type;
	equip.icon = plan.piece + '.' + plan.type;
	equip.name = plan.type.capitalize();
	equip.lvl = plan.lvl;
	equip.plan = plan;
	
	var amount = Craft.equip.amount(plan);
	equip.boost = Craft.boost(plan,equip.boost,amount);
	
	equip.id = Math.randomId();
		
	if(Cst.equip.weapon.piece.have(equip.piece)) equip = Craft.equip.weapon(plan,equip);
	if(Cst.equip.armor.piece.have(equip.piece)) equip = Craft.equip.armor(plan,equip);
	
	Equip.creation(equip);
	
	return equip.id;
}

Craft.equip.amount = function(plan){
	var amount = Math.pow(Math.random(),(1+plan.rarity));
	amount = -Math.logBase(2,amount);
	amount = Math.floor(amount);
	// 1/2 => 0, 1/4 => 1, 1/8 => 2, 1/16 => 3...
	
	if(amount > 6){	//1/256
		//unique
		amount = 6;
	}
	
	amount = amount.mm(plan.minAmount,plan.maxAmount);
	return amount; 
}


Craft.equip.weapon = function(plan,equip){
	var mod = 0.9 + Math.pow(Math.random(),1/(plan.quality+1))*0.2;
	equip.dmg.main = (plan.lvl+10) * mod;
	
	equip.dmg.ratio = {melee:1/1000,range:0,magic:0,fire:0,cold:0,lightning:0};
	
	for(var i in equip.dmg.ratio){
		if(Cst.element.elemental.have(i)){
			if(Math.random() < 0.25) equip.dmg.ratio[i] += 0.5+Math.random()*0.5;
			if(Math.random() < 0.25) equip.dmg.ratio[i] += 0.0+Math.random()*0.2;
		}
		if(Math.random() < 0.25) equip.dmg.ratio[i] += 0.0+Math.random()*0.2;
	}
	if(Math.random() < 0.90) equip.dmg.ratio[plan.piece] += 0.2+Math.random()*1;
	return equip;
}

Craft.equip.armor = function(plan,equip){
	var mod = 0.9 + Math.pow(Math.random(),1/(plan.quality+1))*0.2;
	mod *= Craft.equip.armor.mod[plan.piece];
	equip.def.main = (plan.lvl+10) * mod;
	
	var list = Craft.equip.armor.ratio[plan.type];
	
	equip.def.ratio = {melee:1/1000,range:0,magic:0,fire:0,cold:0,lightning:0};
	for(var i in equip.def.ratio){
		if(list[0].have(i))	equip.def.ratio[i] += 0.8+Math.random()*0.4;
		if(list[1].have(i))	equip.def.ratio[i] += 0.2+Math.random()*0.2;
		if(list[2].have(i))	equip.def.ratio[i] += 0.1+Math.random()*0.1;
	}
	return equip;
}

Craft.equip.armor.ratio = {
	'metal':  [['melee'],['range','magic'],['fire','cold','lightning']],
	'wood':  [['range'],['melee','magic'],['fire','cold','lightning']],
	'bone':  [['magic'],['melee','range'],['fire','cold','lightning']],
	'chain':  [['melee'],['range','magic','fire','cold','lightning'],[]],
	'leaf':  [['range'],['melee','magic','fire','cold','lightning'],[]],
	'hide':  [['magic'],['melee','range','fire','cold','lightning'],[]],
	'ruby':  [['fire'],['cold','lightning'],['melee','range','magic']],
	'sapphire':  [['cold'],['fire','lightning'],['melee','range','magic']],
	'topaz':  [['lightning'],['fire','cold'],['melee','range','magic']],
}
Craft.equip.armor.mod = {
	'ring':2,	
	'amulet':4,		
	'bracelet':6,
	'gloves':8,		
	'boots':10,
	'pants':12,	
	'helm':15,	
	'shield':20,
	'body':25,
}
Craft.equip.armor.mod  = convertRatio(Craft.equip.armor.mod);

Craft.equip.color = function(w){
	if(w.boost.length === 0) return 'white'; 
	if(w.boost.length <= 2) return 'blue';  
	return 'yellow';  
}

Craft.equip.salvage = function(key,id){
	//transform equip into shard
	var inv = List.main[key].invList;
	if(Itemlist.have(inv,id)){
		var equip = Db.equip[id];
		if(!equip) return;
		
		Itemlist.remove(inv,id);
		Itemlist.add(inv,'shard-'+equip.color);
	}
}
//}

//{Boost
Craft.boost = function(seed,where,amount){
	//add a boost to a weapon/armor/other using a seed
	for(var i = 0 ; i < amount && i > -1; i++){
		var boost = Craft.boost.generate.equip(seed);
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

Craft.boost.generate = function(seed,boost){
	seed.quality = seed.quality || 1;
	seed.lvl = seed.lvl || 0;
	seed.cap = seed.cap || 1;
	
	boost = deepClone(boost);
	
	var value = Craft.boost.generate.roll(boost.value,seed.quality);
	value = Math.min(value,boost.value[1]*seed.cap);	//for death for example
	
	return {'stat':boost.stat,
			'type':boost.type || 'base',
			'value':value,
			'tier':Craft.boost.generate.tier(boost.value,value)
	};
}

Craft.boost.generate.equip = function(seed){
	var boost = Db.boost.list[seed.piece][seed.type].random('chance');
	return Craft.boost.generate(seed,boost);	 
}




Craft.boost.generate.roll = function(mm,qual){
	qual = qual || 0;
	return mm[0] + (mm[1]-mm[0])*( Math.pow(Math.random(),1/(qual+1)));
}

Craft.boost.generate.tier = function(mm,value){
	return (value-mm[0])/(mm[1]-mm[0])
}
//}

//{Orb
Craft.orb = function(key,orb,amount,wId,mod){	//would be better if split in multi func
	var inv = List.main[key].invList;
	var mort = List.all[key];
	
	//Set amount of orbs used
	amount = amount.mm(0,Itemlist.have(inv,orb + '_orb',0,'amount'));
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
	if(orb === 'boost') Craft.orb.boost(key,equip,amount);
	if(orb === 'removal') Craft.orb.removal(key,equip);
	if(orb === 'upgrade') Craft.orb.upgrade(key,equip,amount,mod);
	

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
		Actor.removeAbility(mort,wId);
		Actor.learnAbility(mort,equip.id);
	}
}

Craft.orb.boost = function(key,equip,amount){
	//need to change so amount makes impact
	amount = amount || 1;
	equip.boost = Craft.boost(equip.seed,equip.boost,1);
	equip.orb.boost.history.push([Date.now(),equip.boost[equip.boost.length-1]]);
}

Craft.orb.removal = function(key,equip){
	if(!equip.boost.length){ Chat.add(key,"This piece of equipment doesn't have any boost to remove."); return; }
	equip.boost = [];
	equip.color = 'white';
}

Craft.orb.upgrade = function(key,equip,amount,mod){
	if(mod){	//aka want to upgrade a mod on an ability
		if(equip.modList && equip.modList[mod] !== undefined){
			equip.modList[mod] += amount;
			return;
		} else {
			Chat.add(key,"This ability doesn't have this mod.");
			return; 
		}
	} 
	
	//aka want to upgrade equip or ability has a whole
	equip.orb.upgrade.amount += amount;
	equip.orb.upgrade.bonus = Craft.orb.upgrade.formula(equip.orb.upgrade.amount);	//so-so useful for ability
}



Craft.orb.upgrade.formula = function(x){
	return 0.9+0.1*Math.log10(10+x);
}
//}

//{Material
Craft.material = {};
Craft.material.salvage = function(key,id,amount){
	//transform equip into shard
	var inv = List.main[key].invList;
	amount = amount.mm(0,Itemlist.have(inv,id,0,'amount'));
	if(!amount || !Itemlist.test(inv,[['material-currency',1]])) return;
	
	var main = List.main[key];
	
	var dbRate = Db.material[id].exchangeRate;
	var count = Craft.material.salvage.count(dbRate,main.material[id],amount);
	if(count) return;
	
	main.material[id] -= amount;
	Itemlist.remove(inv,id,amount);
	Itemlist.add(inv,'material-currency',count);
	Chat.add(key,'You have converted x' + amount + ' ' + Db.item[id].name + ' into x' + count + ' ' + Db.item['material-currency'].name);
}

Craft.material.salvage.count = function(dbRate,mainMaterial,amount){
	var count = 0;
	for(var i = 0; i < amount; i++){
		count += Math.ceil(dbRate*(Math.pow(1.01,mainMaterial)));
		mainMaterial--;
	}
	return count;
}


Craft.material.create = function(key,id,amount){
	//amount: amount wanted to craft
	var main = List.main[key];
	var inv = main.invList;
	
	var amountFrag = Itemlist.have(inv,'material-currency',0,'amount');
	if(!amountFrag || !Itemlist.test(inv,[[id,1]])) return;
	
	
	var dbRate = Db.material[id].exchangeRate;
	
	var info = Craft.material.create.count(dbRate,main.material[id],amountFrag,amount);

	main.material[id] += info.amount;
	Itemlist.remove(inv,'material-currency',info.cost);
	Itemlist.add(inv,id,info.amount);
	Chat.add(key,'You have converted x' + info.cost + ' ' + Db.item['material-currency'].name + ' into x' + info.amount + ' ' + Db.item[id].name);
	
};

Craft.material.create.count = function(dbRate,mainMaterial,amountFrag,amountWanted){
	var amountCrafted = 0;
	var costSum = 0;
	for(var i = 0 ; i < amountWanted; i++){
		var cost = Math.ceil(dbRate*(Math.pow(1.01,mainMaterial)))*2;
		if(amountFrag < cost) break;
	
		costSum += cost;
		amountFrag -= cost;
		mainMaterial++;
		amountCrafted++;
	}
	return {'amount':amountCrafted,'cost':costSum};
}
//}	

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
	
	if(typeof ab.period.global === 'object'){ ab.period.global = Craft.boost.generate.roll(ab.period.global,qua); }
	if(typeof ab.period.own === 'object'){ ab.period.own = Craft.boost.generate.roll(ab.period.own,qua); }
	
	if(ab.action.func === 'Combat.action.attack'){
		var atk = ab.action.param;
		
		//All
		if(typeof atk.angle === 'object'){ atk.angle = Craft.boost.generate.roll(atk.angle,qua); }
		if(typeof atk.amount === 'object'){ atk.amount = Craft.boost.generate.roll(atk.amount,qua); }
		if(typeof atk.dmg.main === 'object'){ atk.dmg.main = Craft.boost.generate.roll(atk.dmg.main,qua); }
		for(var i in atk.dmg.ratio){
			if(typeof atk.dmg.ratio[i] === 'object'){ atk.dmg.ratio[i] = Craft.boost.generate.roll(atk.dmg.ratio[i],qua); }
		}
		atk.dmg.ratio = convertRatio(atk.dmg.ratio);
		
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
	Actor.removeAbility(List.all[key],abid);
	ab.id = Math.randomId();
	Ability.creation(ab);
	Actor.learnAbility(List.all[key],ab.id);
	Chat.add(key,'Mod Added.');
	Itemlist.remove(List.main[key].invList,'mod-'+ mod);	
}



//}


