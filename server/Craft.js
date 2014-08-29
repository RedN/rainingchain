//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Tk','Itemlist','Chat','Ability','Item','Skill','Equip'],['Craft']));
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


var Craft = exports.Craft = {};

//{Equip
Craft.equip = function(plan){
	var equip = Equip.template();
	equip.piece = plan.piece;
	equip.type = plan.type;
	equip.icon = plan.piece + '.' + plan.type;
	equip.name = plan.type.capitalize();
	equip.lvl = plan.lvl;
	equip.req = Craft.equip.req(plan);
	equip.creator = plan.creator || null;
	
	plan.amount = Craft.equip.amount(plan);
	equip.boost = Craft.equip.boost(plan,equip.boost);
	
	equip.id = Math.randomId();
		
	if(CST.isWeapon(equip.piece)) equip = Craft.equip.weapon(plan,equip);
	if(CST.isArmor(equip.piece)) equip = Craft.equip.armor(plan,equip);
	
	Equip.creation(equip);
	
	return equip.id;
}

Craft.equip.req = function(plan){
	var req = {};
	if(CST.isWeapon(plan.piece)){	//aka weapon
		if(['mace','spear','sword'].have(plan.type)) req['melee'] = plan.lvl;
		if(['bow','boomerang','crossbow'].have(plan.type)) req['range'] = plan.lvl;
		if(['wand','staff','orb'].have(plan.type)) req['magic'] = plan.lvl;
	} else {	//aka armor
		if(plan.type === 'metal') req['melee'] = plan.lvl;
		if(plan.type === 'wood') req['range'] = plan.lvl;
		if(plan.type === 'bone') req['magic'] = plan.lvl;
		
		if(plan.type === 'ruby') req = {melee:(plan.lvl*0.8).r(0),range:(plan.lvl*0.8).r(0),magic:(plan.lvl*0.8).r(0)};
		if(plan.type === 'sapphire') req = {melee:(plan.lvl*0.8).r(0),range:(plan.lvl*0.8).r(0),magic:(plan.lvl*0.8).r(0)};
		if(plan.type === 'topaz') req = {melee:(plan.lvl*0.8).r(0),range:(plan.lvl*0.8).r(0),magic:(plan.lvl*0.8).r(0)};
	}
	return req;

}

Craft.equip.amount = function(plan){
	var amount = Math.pow(Math.random(),(1+(plan.rarity||0)));
	amount = -Math.logBase(3,amount);
	amount = Math.floor(amount);
	amount += 1;
	// 1/3 => 2, 1/9 => 3, 1/27 => 4, 1/81 => 5...
	
	if(amount > 6){	//1/128
		//unique
		amount = 6;
	}
	
	amount = amount.mm(plan.minAmount,plan.maxAmount);
	return amount; 
}

Craft.equip.boost = function(plan,where,amount){
	//add boosts to a weapon/armor/other using a plan
	//plan: piece, type, quality, lvl
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
	if(equip.model) return equip; //aka using it has model
	
	var mod = 0.9 + Math.pow(Math.random(),1/(plan.quality+1))*0.2;
		
	equip.dmg.main = (10 + plan.lvl/2) * mod;
	
	equip.dmg.ratio = Craft.equip.getRatio(equip.piece,equip.type);
		
	Craft.equip.weapon.boost(plan,equip);
	return equip;
}

//quality:1,lvl:0},
Craft.equip.weapon.boost = function(plan,weapon){
	var badel = [];
	var goodel = [];
	for(var i in weapon.dmg.ratio) 
		if(weapon.dmg.ratio[i] !== 1.5) badel.push(i);
		else goodel.push(i);
		
	var boost = ['hp','dmg','status','spd','mana'].random();
	//ts("add(Plan.creation.simple())")
	if(boost === 'hp')	weapon.boost.unshift(Craft.boost(plan,{stat:'hp-max',value:[230,270]}));
	if(boost === 'mana')	weapon.boost.unshift(Craft.boost(plan,{stat:'mana-regen',value:[5/25*0.9,5/25*1.1]}));
	if(boost === 'spd')	weapon.boost.unshift(Craft.boost(plan,{stat:'atkSpd',value:[0.45,0.55]}));
	if(boost === 'dmg'){
		var el = badel.random() || 'melee';
		weapon.boost.unshift(Craft.boost(plan,{stat:'dmg-' + el + '-+',value:[0.45,0.55]}));
	}
	if(boost === 'status'){
		var el = goodel.random() || 'melee';
		var status = CST.element.toStatus[el];
		weapon.boost.unshift(Craft.boost(plan,{stat:status + '-chance',value:[0.20,0.30]}));
	}
	return weapon;
};



Craft.equip.armor = function(plan,equip){
	var mod = 0.9 + Math.pow(Math.random(),1/(plan.quality+1))*0.2;
	equip.def.main = (4+plan.lvl/5) * mod;
	
	equip.def.ratio = Craft.equip.getRatio(equip.piece,equip.type);
	
	return equip;
}

Craft.equip.getRatio = function(piece,type){
	//Weapon
	if(type === 'mace') return {melee:1.5,range:1,magic:1,fire:1.5,cold:1,lightning:1};
	else if(type === 'spear') return {melee:1.5,range:1,magic:1,fire:1,cold:1.5,lightning:1};
	else if(type === 'sword') return {melee:1.5,range:1,magic:1,fire:1,cold:1,lightning:1.5};
	else if(type === 'bow') return {melee:1,range:1.5,magic:1,fire:1.5,cold:1,lightning:1};
	else if(type === 'boomerang') return {melee:1,range:1.5,magic:1,fire:1,cold:1,lightning:1.5};
	else if(type === 'crossbow') return {melee:1,range:1.5,magic:1,fire:1,cold:1.5,lightning:1};
	else if(type === 'wand') return {melee:1,range:1,magic:1.5,fire:1.5,cold:1,lightning:1};
	else if(type === 'staff') return {melee:1,range:1,magic:1.5,fire:1,cold:1.5,lightning:1};
	else if(type === 'orb') return {melee:1,range:1,magic:1.5,fire:1,cold:1,lightning:1.5};
	
	//Armor
	var valueStab = Craft.equip.getRatio.mod[piece];
	
	if(type === 'metal') return {melee:valueStab,range:1,magic:1,fire:0,cold:0,lightning:0};
	else if(type === 'wood') return {melee:1,range:valueStab,magic:1,fire:0,cold:0,lightning:0};
	else if(type === 'bone') return {melee:1,range:1,magic:valueStab,fire:0,cold:0,lightning:0};
	
	else if(type === 'ruby') return {melee:0,range:0,magic:0,fire:valueStab,cold:1,lightning:1};
	else if(type === 'sapphire') return {melee:0,range:0,magic:0,fire:1,cold:valueStab,lightning:1};
	else if(type === 'topaz') return {melee:0,range:0,magic:0,fire:1,cold:1,lightning:valueStab};
	
	return ERROR(3,'wrong type or piece',type,piece) || {melee:0,range:0,magic:0,fire:1,cold:1,lightning:1.5}
}
Craft.equip.getRatio.mod = {
	'ring':1.5,	
	'amulet':2,		
	'helm':1.5,	
	'body':2,
	'weapon':1.5,
}


Craft.equip.salvage = function(key,id){
	//transform equip into shard
	var inv = List.main[key].invList;
	if(!Itemlist.have(inv,id)) return ERROR(4,'salvaging item but dont own it',id);
	var equip = Db.equip[id] || Db.plan[id];
	if(!equip) return ERROR(3,'no equip');
	
	Itemlist.remove(inv,id);
	
	var info = Craft.equip.salvage.getBase(equip);
	Itemlist.add(inv,Craft.getRandomMaterial(0),info.item);
	 
	if(Craft.isPlan(equip) || equip.creator === List.all[key].username){
		var base = Craft.equip.salvage.getModExp(equip);
		for(var i in base) base[i] *= info.exp;
		Skill.addExp(key,base);
	}
}

Craft.isPlan = function(equip){
	return equip.id.have('plan-',0);
}
Craft.equip.salvage.getBase = function(equip){
	if(!Craft.isPlan(equip)){
		if(equip.color === 'white') return {item:1,exp:250};
		if(equip.color === 'blue') return {item:2,exp:350};
		if(equip.color === 'yellow') return {item:4,exp:500};
	}
	return {item:(equip.minAmountOriginal+1)||0,exp:250*(equip.minAmountOriginal+1)||0};
}

Craft.equip.salvage.getModExp = function(equip){
	var type = equip.type;
	if(type === 'metal') return {metalwork:1};
	if(type === 'wood') return {woodwork:1};
	if(type === 'bone') return {leatherwork:1};
	
	
	if(type === 'bow') return {woodwork:1};
	if(type === 'crossbow') return {woodwork:1};
	if(type === 'boomerange') return {woodwork:1};
	
	if(type === 'mace') return {metalwork:1};
	if(type === 'sword') return {metalwork:1};
	if(type === 'spear') return {metalwork:1};
	
	if(type === 'orb') return {leatherwork:1};
	if(type === 'staff') return {leatherwork:1};
	if(type === 'wand') return {leatherwork:1};
	
	return {leatherwork:1/3,metalwork:1/3,woodwork:1/3};
}


//}

Craft.getRandomMaterial = function(num){
	num = num || 0;
	num = Math.floor(num/20);

	var mat = Craft.getRandomMaterial.list.random();
	return mat + '-' + num;
}

Craft.getRandomMaterial.list = {
	metal:1/4,
	wood:1/4,
	bone:1/4,
	ruby:1/12,
	topaz:1/12,
	sapphire:1/12,
};


//{Boost
Craft.boost = function(seed,boost){
	seed.quality = seed.quality || 0;
	seed.lvl = seed.lvl || 0;
	
	boost = Tk.deepClone(boost);
	
	var value = Craft.boost.roll(boost.value,seed.quality);
	
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
	if(Db.equip[wId]){		equip = Tk.deepClone(Db.equip[wId]); category = 'equip';}
	if(Db.ability[wId]){	equip = Tk.deepClone(Db.ability[wId]); category = 'ability';}
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
	Item.removeFromDb(equip.id);
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




//}


