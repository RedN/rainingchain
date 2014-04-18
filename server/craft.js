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

//{Equip
Craft.equip = function(plan){
	var equip = Equip.template();
	equip.piece = plan.piece;
	equip.type = plan.type;
	equip.icon = plan.piece + '.' + plan.type;
	equip.name = plan.type.capitalize();
	equip.lvl = plan.lvl;
	equip.plan = plan;
	equip.req = Craft.equip.req(plan);
	equip.creator = plan.creator || null;
	
	plan.amount = Craft.equip.amount(plan);
	equip.boost = Craft.equip.boost(plan,equip.boost);
	
	equip.id = Math.randomId();
		
	if(Cst.isWeapon(equip.piece)) equip = Craft.equip.weapon(plan,equip);
	if(Cst.isArmor(equip.piece)) equip = Craft.equip.armor(plan,equip);
	
	Equip.creation(equip);
	
	return equip.id;
}

Craft.equip.req = function(plan){
	var req = {};
	if(Cst.isWeapon(plan.piece)){	//aka weapon
		req[plan.piece] = plan.lvl;
	} else {	//aka armor
		if(['metal','chain','ruby'].have(plan.type)) req['melee'] = plan.lvl;
		if(['wood','leaf','sapphire'].have(plan.type)) req['range'] = plan.lvl;
		if(['bone','hide','topaz'].have(plan.type)) req['magic'] = plan.lvl;
	}
	return req;

}

Craft.equip.amount = function(plan){
	var amount = Math.pow(Math.random(),(1+(plan.rarity||0)));
	amount = -Math.logBase(2,amount);
	amount = Math.floor(amount);
	amount += 1;
	// 1/2 => 1, 1/4 => 2, 1/8 => 3, 1/16 => 4...
	
	if(amount > 6){	//1/128
		//unique
		amount = 6;
	}
	
	amount = amount.mm(plan.minAmount,plan.maxAmount);
	return amount; 
}

Craft.equip.boost = function(plan,where,amount){
	//add boosts to a weapon/armor/other using a plan
	//plan: piece, type, quality, lvl, cap, 
	//amount overwrite plan.amount
	
	loop:
	for(var i = 0 ; i < (amount || plan.amount) && i > -1; i++){
		var boost = Craft.equip.boost.generate(plan);
		for(var j in where) if(where[j].stat === boost.stat){ i -= 0.99;continue loop;}	//verify if always have it
		where.push(boost);		
	}
	return where;
}

Craft.equip.boost.generate = function(plan){	//return a random boost adequat for piece and type
	var boost = Db.boost.list[plan.piece][plan.type].random('chance');
	return Craft.boost(plan,boost);	 
}

Craft.equip.weapon = function(plan,equip){
	equip.sprite = {'name':Craft.equip.weapon.sprite[plan.type].name,'sizeMod':Craft.equip.weapon.sprite[plan.type].sizeMod};

	if(equip.model) return equip; //aka using it has model
	
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

Craft.equip.weapon.sprite = {
	'mace':{'name':"mace",'sizeMod':1},
	'sword':{'name':"sword",'sizeMod':1},
	'spear':{'name':"spear",'sizeMod':1},
	'bow':{'name':"bow",'sizeMod':1},
	'boomerang':{'name':"bow",'sizeMod':1},
	'crossbow':{'name':"bow",'sizeMod':1},
	'wand':{'name':"wand",'sizeMod':1},
	'staff':{'name':"wand",'sizeMod':1},
	'orb':{'name':"wand",'sizeMod':1},
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
Craft.boost = function(seed,boost){
	seed.quality = seed.quality || 0;
	seed.lvl = seed.lvl || 0;
	seed.cap = seed.cap || 1;
	
	boost = deepClone(boost);
	
	var value = Craft.boost.roll(boost.value,seed.quality);
	value = Math.min(value,boost.value[1]*seed.cap);	//for quest death for example
	
	return {
		'stat':boost.stat,
		'type':boost.type || 'base',
		'value':value,
		'tier':Craft.boost.tier(boost.value,value),
	};
}

Craft.boost.roll = function(mm,qual){
	qual = qual || 0;
	return mm[0] + (mm[1]-mm[0])*( Math.pow(Math.random(),1/(qual+1)));
}

Craft.boost.tier = function(mm,value){
	return (value-mm[0])/(mm[1]-mm[0])
}
//}

//{Orb
Craft.orb = function(key,orb,amount,wId,mod){	//would be better if split in multi func
	var inv = List.main[key].invList;
	var act = List.all[key];
	
	//Set amount of orbs used
	amount = amount.mm(0,Itemlist.have(inv,orb + '_orb',0,'amount'));
	if(!amount){
		Chat.add(key,"You don't have any orbs to use.");
		return;
	}
	
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
	Itemlist.remove(inv,orb + '_orb',amount);
	Item.remove(equip.id);
	Chat.add(key,amount + ' Orbs used on ' + equip.name);
	equip.id = Math.randomId();
	
	
	if(category === 'equip'){
		Equip.creation(equip);
		Itemlist.remove(inv,wId);
		Itemlist.add(inv,equip.id);
	}
	if(category === 'ability'){
		Ability.creation(equip);
		Actor.ability.remove(act,wId);
		Actor.ability.add(act,equip.id);
	}
}

Craft.orb.boost = function(key,equip,amount){
	//need to change so amount makes impact
	amount = amount || 1;
	equip.boost = Craft.equip.boost({piece:equip.piece,type:equip.type},equip.boost,1);
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

Craft.orb.save = function(){


}
//}


//{Ability BROKEN
Craft.ability = function(seed){
	//seed: quality, piece (piece refers to the id of the template to use);

	var a = Craft.ability.template(seed);
	Ability.creation(a);
	return a.id;	
}

Craft.ability.template = function(seed){
	var qua = seed.quality || 0;
	var an = seed.piece || 'fireball';

	var ab = deepClone(Db.abilityTemplate[an]);
	
	if(typeof ab.period.global === 'object'){ ab.period.global = Craft.boost.roll(ab.period.global,qua); }
	if(typeof ab.period.own === 'object'){ ab.period.own = Craft.boost.roll(ab.period.own,qua); }
	
	if(ab.action.func === 'Combat.attack'){
		var atk = ab.action.param;
		
		//All
		if(typeof atk.angle === 'object'){ atk.angle = Craft.boost.roll(atk.angle,qua); }
		if(typeof atk.amount === 'object'){ atk.amount = Craft.boost.roll(atk.amount,qua); }
		if(typeof atk.dmg.main === 'object'){ atk.dmg.main = Craft.boost.roll(atk.dmg.main,qua); }
		for(var i in atk.dmg.ratio){
			if(typeof atk.dmg.ratio[i] === 'object'){ atk.dmg.ratio[i] = Craft.boost.roll(atk.dmg.ratio[i],qua); }
		}
		atk.dmg.ratio = convertRatio(atk.dmg.ratio);
		
		//Status
		for(var st in Cst.status.list){
			var i = Cst.status.list[st];
			if(typeof atk[i] === 'object'){ 
				if(typeof atk[i].chance === 'object'){ atk[i].chance = Craft.boost.roll(atk[i].chance,qua); }
				if(typeof atk[i].magn === 'object'){ atk[i].magn = Craft.boost.roll(atk[i].magn,qua); }
				if(typeof atk[i].time === 'object'){ atk[i].time = Craft.boost.roll(atk[i].time,qua); }
			}
		}
		if(atk.leech){
			if(typeof atk.leech.chance === 'object'){ atk.leech.chance = Craft.boost.roll(atk.leech.chance,qua); }
			if(typeof atk.leech.magn === 'object'){ atk.leech.magn = Craft.boost.roll(atk.leech.magn,qua); }
			if(typeof atk.leech.time === 'object'){ atk.leech.time = Craft.boost.roll(atk.leech.time,qua); }
		}
		if(atk.pierce){
			if(typeof atk.pierce.chance === 'object'){ atk.pierce.chance = Craft.boost.roll(atk.pierce.chance,qua); }
			if(typeof atk.pierce.dmgReduc === 'object'){ atk.pierce.dmgReduc = Craft.boost.roll(atk.pierce.dmgReduc,qua); }
		}
		//need to add curse etc...
	}
	if(ab.action.func === 'Combat.summon'){
	
	}
	if(ab.action.func === 'Combat.boost'){
	
	}
	ab.id = Math.randomId();
	
	return ab;
}

Craft.ability.mod = function(key,id,mod){
	//abid: Ability Id, mod: mod Id
	
	//Verify
	var ab = deepClone(Db.ability[id]);
	if(ab.modList[mod] !== undefined){ Chat.add(key,'This ability already has this mod.'); return; }
	if(Object.keys(ab.modList).length > 5){ Chat.add(key,'This ability already has the maximal amount of mods.'); return; }
	
	//Add
	ab.modList[mod] = 0;
	Actor.ability.remove(List.all[key],id);
	ab.id = Math.randomId();
	Ability.creation(ab);
	Actor.ability.add(List.all[key],ab.id);
	Chat.add(key,'Mod Added.');
	Itemlist.remove(List.main[key].invList,Db.abilityMod[mod].item);	
}



//}


