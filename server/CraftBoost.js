//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Boost']));



var CraftBoost = exports.CraftBoost = function(piece,all,type){
	for(var i in type)
		for(var j in all)
			type[i].push(all[j]);
	DB[piece] = type;
}
var DB = CraftBoost.DB = {};
CraftBoost.generateBoost = function(piece,type,quality,exclude){
	exclude = exclude || {};
	
	var list = DB[piece] && DB[piece][type];
	if(!list) return ERROR(3,'wrong piece or type',piece,type);
	
	var safety = 0;
	do var chosen = list.random('chance');
	while(exclude[chosen.stat] && safety++ < 10000)
	var tier = Math.pow(Math.random(),1/((quality||0)+1));
	var value = chosen.value * (0.75 + 0.5 *tier);
	
	return Boost.Perm(chosen.stat,value,'*');
}

CraftBoost.Type = function(array){	//CraftBoost.Sub[]
	var tmp = [];
	for(var i in array){
		for(var j in array[i].statList){
			tmp.push({
				stat:array[i].statList[j],
				value:array[i].value,
				chance:array[i].chance/array[i].statList.length,
			});
		}
	}
	return tmp;
}

CraftBoost.Sub = function(groupInfo,valueMod,chance){
	return {
		statList:groupInfo.list,
		value:groupInfo.baseValue * (valueMod || 1),
		chance:chance || 1,	
	}
}	

CraftBoost.Stat = function(stat){
	if(!GROUP[stat]) return ERROR('invalid stat',stat);
	return GROUP[stat];
}	

//######################

var GROUP = {};
var StatGroup = function(id,baseValue,list){
	if(!list) list = [id];
	GROUP[id] = {
		id:id,
		baseValue:baseValue,
		list:list
	};	
	//create group for each
	for(var i in list)
		if(!GROUP[list[i]]) StatGroup(list[i],baseValue);
};

(function(){	//StatGroup Init
	StatGroup('dmg',0.01,['dmg-melee-+','dmg-melee-*','dmg-melee-x','dmg-melee-^','dmg-range-+','dmg-range-*','dmg-range-x','dmg-range-^','dmg-magic-+','dmg-magic-*','dmg-magic-x','dmg-magic-^','dmg-fire-+','dmg-fire-*','dmg-fire-x','dmg-fire-^','dmg-cold-+','dmg-cold-*','dmg-cold-x','dmg-cold-^','dmg-lightning-+','dmg-lightning-*','dmg-lightning-x','dmg-lightning-^']);
	StatGroup('dmg-+',0.01,['dmg-melee-+','dmg-range-+','dmg-magic-+','dmg-fire-+','dmg-cold-+','dmg-lightning-+']);
	StatGroup('dmg-^',0.01,['dmg-melee-^','dmg-range-^','dmg-magic-^','dmg-fire-^','dmg-cold-^','dmg-lightning-^']);
	StatGroup('dmg-*',0.01,['dmg-melee-*','dmg-range-*','dmg-magic-*','dmg-fire-*','dmg-cold-*','dmg-lightning-*']);
	StatGroup('dmg-x',0.01,['dmg-melee-x','dmg-range-x','dmg-magic-x','dmg-fire-x','dmg-cold-x','dmg-lightning-x']);
		
	StatGroup('dmg-melee',0.01,['dmg-melee-+','dmg-melee-*','dmg-melee-x','dmg-melee-^']);
	StatGroup('dmg-range',0.01,['dmg-range-+','dmg-range-*','dmg-range-x','dmg-range-^']);
	StatGroup('dmg-magic',0.01,['dmg-magic-+','dmg-magic-*','dmg-magic-x','dmg-magic-^']);
	StatGroup('dmg-fire',0.01,['dmg-fire-+','dmg-fire-*','dmg-fire-x','dmg-fire-^']);
	StatGroup('dmg-cold',0.01,['dmg-cold-+','dmg-cold-*','dmg-cold-x','dmg-cold-^']);
	StatGroup('dmg-lightning',0.01,['dmg-lightning-+','dmg-lightning-*','dmg-lightning-x','dmg-lightning-^']);

	//Def
	StatGroup('def',0.01,['def-melee-+','def-melee-*','def-melee-x','def-melee-^','def-range-+','def-range-*','def-range-x','def-range-^','def-magic-+','def-magic-*','def-magic-x','def-magic-^','def-fire-+','def-fire-*','def-fire-x','def-fire-^','def-cold-+','def-cold-*','def-cold-x','def-cold-^','def-lightning-+','def-lightning-*','def-lightning-x','def-lightning-^']);
	StatGroup('def-+',0.01,['def-melee-+','def-range-+','def-magic-+','def-fire-+','def-cold-+','def-lightning-+']);
	StatGroup('def-^',0.01,['def-melee-^','def-range-^','def-magic-^','def-fire-^','def-cold-^','def-lightning-^']);
	StatGroup('def-*',0.01,['def-melee-*','def-range-*','def-magic-*','def-fire-*','def-cold-*','def-lightning-*']);
	StatGroup('def-x',0.01,['def-melee-x','def-range-x','def-magic-x','def-fire-x','def-cold-x','def-lightning-x']);
		
	StatGroup('def-melee',0.01,['def-melee-+','def-melee-*','def-melee-x','def-melee-^']);
	StatGroup('def-range',0.01,['def-range-+','def-range-*','def-range-x','def-range-^']);
	StatGroup('def-magic',0.01,['def-magic-+','def-magic-*','def-magic-x','def-magic-^']);
	StatGroup('def-fire',0.01,['def-fire-+','def-fire-*','def-fire-x','def-fire-^']);
	StatGroup('def-cold',0.01,['def-cold-+','def-cold-*','def-cold-x','def-cold-^']);
	StatGroup('def-lightning',0.01,['def-lightning-+','def-lightning-*','def-lightning-x','def-lightning-^']);
		
	//Weapon
	StatGroup('weapon',0.01,['weapon-mace','weapon-spear','weapon-sword','weapon-bow','weapon-boomerang','weapon-crossbow','weapon-wand','weapon-staff','weapon-orb']);		
	StatGroup('weapon-melee',0.01,['weapon-mace','weapon-spear','weapon-sword']);
	StatGroup('weapon-range',0.01,['weapon-bow','weapon-boomerang','weapon-crossbow']);
	StatGroup('weapon-magic',0.01,['weapon-wand','weapon-staff','weapon-orb']);
		
	//Status
	StatGroup('status-all',0.01,['burn-magn','burn-chance','burn-time','chill-magn','chill-chance','chill-time','stun-magn','stun-chance','stun-time','bleed-magn','bleed-chance','bleed-time','knock-magn','knock-chance','knock-time','drain-magn','drain-chance','drain-time']);
	StatGroup('status-magn',0.01,['burn-magn','chill-magn','stun-magn','bleed-magn','knock-magn','drain-magn']);
	StatGroup('status-chance',0.01,['burn-chance','chill-chance','stun-chance','bleed-chance','knock-chance','drain-chance']);
	StatGroup('status-time',0.01,['burn-time','chill-time','stun-time','bleed-time','knock-time','drain-time']);
	StatGroup('burn-all',0.01,['burn-magn','burn-chance','burn-time']);
	StatGroup('chill-all',0.01,['chill-magn','chill-chance','chill-time']);
	StatGroup('stun-all',0.01,['stun-magn','stun-chance','stun-time']);
	StatGroup('bleed-all',0.01,['bleed-magn','bleed-chance','bleed-time']);
	StatGroup('knock-all',0.01,['knock-magn','knock-chance','knock-time']);
	StatGroup('drain-all',0.01,['drain-magn','drain-chance','drain-time']);
	StatGroup('summon-all',0.01,['summon-amount','summon-time','summon-atk','summon-def']);
	StatGroup('magicFind-all',0.01,['magicFind-quantity','magicFind-quality','magicFind-rarity']);
	StatGroup('mana-max',0.01);
	StatGroup('mana-regen',0.01);
	StatGroup('atkSpd',0.01);
	StatGroup('crit-chance',0.01);
	StatGroup('crit-magn',0.01);
	StatGroup('leech-magn',0.01);
	StatGroup('leech-chance',0.01);
	StatGroup('bullet-amount',0.01);
	StatGroup('strike-range',0.01);
	StatGroup('strike-size',0.01);
	StatGroup('strike-maxHit',0.2);
	StatGroup('pickRadius',200);
	StatGroup('hp-max',1);
	StatGroup('hp-regen',0.01);
	StatGroup('maxSpd',0.1);
	StatGroup('acc',0.01);
})();

//######################

CraftBoost('weaponFirstBoost',CraftBoost.Type([ //{
		CraftBoost.Sub(CraftBoost.Stat('hp-max'),25,1),
		CraftBoost.Sub(CraftBoost.Stat('mana-regen'),50,1),
		CraftBoost.Sub(CraftBoost.Stat('atkSpd'),40,1),
	]),{
	mace:CraftBoost.Type([ 
		CraftBoost.Sub(CraftBoost.Stat('bleed-chance'),30,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-range-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-magic-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-fire-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-cold-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-lightning-+'),50,1/5),
	]),
	spear:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('bleed-chance'),30,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-range-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-magic-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-fire-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-cold-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-lightning-+'),50,1/5),
	]),
	sword:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('bleed-chance'),30,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-range-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-magic-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-fire-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-cold-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-lightning-+'),50,1/5),
	]),
	bow:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('knock-chance'),30,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-melee-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-magic-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-fire-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-cold-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-lightning-+'),50,1/5),
	]),
	boomerang:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('knock-chance'),30,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-melee-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-magic-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-fire-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-cold-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-lightning-+'),50,1/5),
	]),
	crossbow:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('knock-chance'),30,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-melee-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-magic-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-fire-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-cold-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-lightning-+'),50,1/5),
	]),
	wand:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('drain-chance'),30,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-melee-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-range-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-fire-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-cold-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-lightning-+'),50,1/5),
	]),
	staff:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('drain-chance'),30,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-melee-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-range-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-fire-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-cold-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-lightning-+'),50,1/5),
	]),
	orb:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('drain-chance'),30,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-melee-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-range-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-fire-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-cold-+'),50,1/5),
		CraftBoost.Sub(CraftBoost.Stat('dmg-lightning-+'),50,1/5),
	])	
}); //}
	
CraftBoost('weapon',CraftBoost.Type([ //{
		CraftBoost.Sub(CraftBoost.Stat('dmg'),1,1),
	]),{
	mace:CraftBoost.Type([ //brute force / tank
		CraftBoost.Sub(CraftBoost.Stat('dmg-melee'),10,1),
		CraftBoost.Sub(CraftBoost.Stat('def'),10,1),
	]),
	spear:CraftBoost.Type([ //aoe
		CraftBoost.Sub(CraftBoost.Stat('strike-size'),5,1),
		CraftBoost.Sub(CraftBoost.Stat('strike-maxHit'),5,1),	
		CraftBoost.Sub(CraftBoost.Stat('strike-range'),5,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-melee'),2,1),
	]),
	sword:CraftBoost.Type([ //status
		CraftBoost.Sub(CraftBoost.Stat('status-all'),5,6),
		CraftBoost.Sub(CraftBoost.Stat('dmg-melee'),2,1),
	]),
	bow:CraftBoost.Type([ //amount
		CraftBoost.Sub(CraftBoost.Stat('bullet-amount'),5,2),
		CraftBoost.Sub(CraftBoost.Stat('dmg-range'),2,1),
	]),
	boomerang:CraftBoost.Type([ //crit
		CraftBoost.Sub(CraftBoost.Stat('crit-chance'),5,2),
		CraftBoost.Sub(CraftBoost.Stat('crit-magn'),5,2),
		CraftBoost.Sub(CraftBoost.Stat('dmg-range'),2,1),
	]),
	crossbow:CraftBoost.Type([ //speed
		CraftBoost.Sub(CraftBoost.Stat('atkSpd'),5,2),
		CraftBoost.Sub(CraftBoost.Stat('dmg-range'),2,1),
	]),
	wand:CraftBoost.Type([ //leech
		CraftBoost.Sub(CraftBoost.Stat('leech-chance'),5,1),
		CraftBoost.Sub(CraftBoost.Stat('leech-magn'),5,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-magic'),2,1),
	]),
	staff:CraftBoost.Type([ //aoe onHit
		CraftBoost.Sub(CraftBoost.Stat('strike-maxHit'),10,1),
		CraftBoost.Sub(CraftBoost.Stat('strike-range'),10,1),
		CraftBoost.Sub(CraftBoost.Stat('strike-size'),10,1),
		CraftBoost.Sub(CraftBoost.Stat('dmg-magic'),2,1),
	]),
	orb:CraftBoost.Type([ //status
		CraftBoost.Sub(CraftBoost.Stat('status-all'),5,6),
		CraftBoost.Sub(CraftBoost.Stat('dmg-magic'),2,1),
	])
});	//}

CraftBoost('amulet',CraftBoost.Type([ //{
		CraftBoost.Sub(CraftBoost.Stat('dmg-+'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('def-+'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('status-all'),1,1),
		CraftBoost.Sub(CraftBoost.Stat('magicFind-rarity'),1,0.5),
	]),{
	ruby:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('burn-all'),1.5,1),
		CraftBoost.Sub(CraftBoost.Stat('burn-chance'),2,1),
	]),
	sapphire:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('chill-all'),1.5,1),
		CraftBoost.Sub(CraftBoost.Stat('chill-chance'),2,1),
	]),
	topaz:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('stun-all'),1.5,1),
		CraftBoost.Sub(CraftBoost.Stat('stun-chance'),2,1),	
	])	
}); //}`

CraftBoost('ring',CraftBoost.Type([ //{
		CraftBoost.Sub(CraftBoost.Stat('dmg-*'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('def-+'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('status-all'),1,1),
		CraftBoost.Sub(CraftBoost.Stat('magicFind-quality'),1,0.5),
		CraftBoost.Sub(CraftBoost.Stat('magicFind-quantity'),1,0.5),
	]),{
	ruby:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('burn-all'),1.5,1),
		CraftBoost.Sub(CraftBoost.Stat('burn-magn'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('burn-time'),2,1),
	]),
	sapphire:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('chill-all'),1.5,1),
		CraftBoost.Sub(CraftBoost.Stat('chill-magn'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('chill-time'),2,1),
	]),
	topaz:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('stun-all'),1.5,1),
		CraftBoost.Sub(CraftBoost.Stat('stun-magn'),2,1),	
		CraftBoost.Sub(CraftBoost.Stat('stun-time'),2,1),	
	])	
}); //}

CraftBoost('helm',CraftBoost.Type([ //{
		CraftBoost.Sub(CraftBoost.Stat('dmg-^'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('def-^'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('summon-all'),1,1),
		CraftBoost.Sub(CraftBoost.Stat('atkSpd'),1,1),
		CraftBoost.Sub(CraftBoost.Stat('pickRadius'),1,1),
	]),{
	metal:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('hp-max'),1.5,1),
		CraftBoost.Sub(CraftBoost.Stat('leech-magn'),1,1),
		CraftBoost.Sub(CraftBoost.Stat('leech-chance'),1,1),
		CraftBoost.Sub(CraftBoost.Stat('summon-amount'),2,1),
		
	]),
	wood:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('hp-regen'),1.5,1),
		CraftBoost.Sub(CraftBoost.Stat('crit-magn'),1,1),	
		CraftBoost.Sub(CraftBoost.Stat('crit-chance'),1,1),	
		CraftBoost.Sub(CraftBoost.Stat('summon-atk'),2,1),	
	]),
	bone:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('mana-max'),1,1),
		CraftBoost.Sub(CraftBoost.Stat('mana-regen'),1.5,1),
		CraftBoost.Sub(CraftBoost.Stat('maxSpd'),1,1),	
		CraftBoost.Sub(CraftBoost.Stat('summon-def'),2,1),	
	])	
}); //}
	
CraftBoost('body',CraftBoost.Type([ //{
		CraftBoost.Sub(CraftBoost.Stat('dmg-x'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('def-x'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('def'),1.5,1),
		CraftBoost.Sub(CraftBoost.Stat('weapon'),1,1),
	]),{
	metal:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('def-melee'),8,1),
		CraftBoost.Sub(CraftBoost.Stat('weapon-melee'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('strike-range'),1,1),		
	]),
	wood:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('def-range'),8,1),
		CraftBoost.Sub(CraftBoost.Stat('weapon-range'),2,1),	
		CraftBoost.Sub(CraftBoost.Stat('strike-size'),1,1),
	]),
	bone:CraftBoost.Type([
		CraftBoost.Sub(CraftBoost.Stat('def-magic'),8,1),
		CraftBoost.Sub(CraftBoost.Stat('weapon-magic'),2,1),
		CraftBoost.Sub(CraftBoost.Stat('strike-maxHit'),1,1),	
	])	
}); //}
	
//[base*0.75,base*1.25]




