Db.boost = {};
Db.boost.list = {};

Db.boost.list.all = [



];
Db.boost.list.test = {
	all:[
		{'stat':['dmg-+'],'valueMod':2,'chance':1},
		{'stat':'item-rarity','valueMod':1,'chance':0.5},
	],				
	ruby:[
		{'stat':['burn-all'],'valueMod':1.5,'chance':1},
		{'stat':'burn-chance','valueMod':2,'chance':1},
		
	]
};

Db.boost.list.amulet = {
	all:[
		{'stat':['dmg-+'],'valueMod':2,'chance':1},
		{'stat':['def-+'],'valueMod':2,'chance':1},
		{'stat':['status-all'],'valueMod':1,'chance':1},
		{'stat':'item-rarity','valueMod':1,'chance':0.5},
	],				
	ruby:[
		{'stat':['burn-all'],'valueMod':1.5,'chance':1},
		{'stat':'burn-chance','valueMod':2,'chance':1},
		
	],
	sapphire:[
		{'stat':['chill-all'],'valueMod':1,'chance':1},
		{'stat':'chill-chance','valueMod':2,'chance':1},
	
	],
	topaz:[
		{'stat':['stun-all'],'valueMod':1,'chance':1},
		{'stat':'stun-chance','valueMod':2,'chance':1},
	
	],
};

Db.boost.list.ring = {
	all:[
		{'stat':['dmg-+'],'valueMod':2,'chance':1},
		{'stat':['def-+'],'valueMod':2,'chance':1},
		{'stat':['status-all'],'valueMod':1,'chance':1},
		{'stat':'item-quality','valueMod':1,'chance':0.5},
	],				
	ruby:[
		{'stat':['burn-all'],'valueMod':1.5,'chance':1},
		{'stat':'burn-magn','valueMod':2,'chance':1},
		
	],
	sapphire:[
		{'stat':['chill-all'],'valueMod':1,'chance':1},
		{'stat':'chill-magn','valueMod':2,'chance':1},
	
	],
	topaz:[
		{'stat':['stun-all'],'valueMod':1,'chance':1},
		{'stat':'stun-magn','valueMod':2,'chance':1},
	
	],
};

Db.boost.list.bracelet = {
	all:[
		{'stat':['dmg-^'],'valueMod':2,'chance':1},
		{'stat':['def-^'],'valueMod':2,'chance':1},
		{'stat':['status-all'],'valueMod':1,'chance':1},
		{'stat':'item-quantity','valueMod':1,'chance':0.5},
	],				
	ruby:[
		{'stat':['burn-all'],'valueMod':1.5,'chance':1},
		{'stat':'burn-time','valueMod':2,'chance':1},
		
	],
	sapphire:[
		{'stat':['chill-all'],'valueMod':1,'chance':1},
		{'stat':'chill-time','valueMod':2,'chance':1},
	
	],
	topaz:[
		{'stat':['stun-all'],'valueMod':1,'chance':1},
		{'stat':'stun-time','valueMod':2,'chance':1},
	
	],
};

Db.boost.list.helm = {
	all:[
		{'stat':['dmg-+'],'valueMod':2,'chance':1},
		{'stat':['def-+'],'valueMod':2,'chance':1},
		{'stat':['resource-max'],'valueMod':1,'chance':1},
		{'stat':['resource-regen'],'valueMod':1,'chance':1},
	],				
	metal:[
		{'stat':'hp-max','valueMod':1,'chance':1},
	],
	wood:[
		{'stat':'hp-regen','valueMod':1,'chance':1},
		
	],
	bone:[
		{'stat':'mana-max','valueMod':1,'chance':1},
		{'stat':'mana-regen','valueMod':1,'chance':1},
	],
};

Db.boost.list.body = {
	all:[
		{'stat':['dmg-x'],'valueMod':2,'chance':1},
		{'stat':['def-x'],'valueMod':2,'chance':1},
		{'stat':['def'],'valueMod':4,'chance':1},
	
	],				
	metal:[
		{'stat':['def-melee'],'valueMod':8,'chance':1},
		
	],
	wood:[
		{'stat':['def-range'],'valueMod':8,'chance':1},
	
	],
	bone:[
		{'stat':['def-magic'],'valueMod':8,'chance':1},
	
	],
};

Db.boost.list.shield = {
	all:[
		{'stat':['dmg-*'],'valueMod':2,'chance':1},
		{'stat':['def-*'],'valueMod':2,'chance':1},
		{'stat':['weapon'],'valueMod':1,'chance':1},
	
	],				
	metal:[
		{'stat':['weapon-melee'],'valueMod':1,'chance':1},
		
	],
	wood:[
		{'stat':['weapon-range'],'valueMod':1,'chance':1},
	
	],
	bone:[
		{'stat':['weapon-magic'],'valueMod':1,'chance':1},
	
	],
};

Db.boost.list.gloves = {
	all:[
		{'stat':['dmg-+'],'valueMod':2,'chance':1},
		{'stat':['def-+'],'valueMod':2,'chance':1},
		
		{'stat':'atkSpd-main','valueMod':1,'chance':1},
		{'stat':'pickRadius','valueMod':1,'chance':1},
	],				
	chain:[
		{'stat':'leech-magn','valueMod':1,'chance':1},
		{'stat':'leech-chance','valueMod':1,'chance':1},
		
	],
	leaf:[
		{'stat':'crit-magn','valueMod':1,'chance':1},
		{'stat':'crit-chance','valueMod':1,'chance':1},
	],
	hide:[
		{'stat':['summon-all'],'valueMod':1,'chance':1},
	],
};

Db.boost.list.pants = {
	all:[
		{'stat':['dmg-x'],'valueMod':2,'chance':1},
		{'stat':['def-x'],'valueMod':2,'chance':1},
		{'stat':['summon-all'],'valueMod':1,'chance':1},
		
	],				
	chain:[
		{'stat':'item-quality','valueMod':1,'chance':0.5},
		{'stat':'summon-amount','valueMod':1,'chance':1},
	],
	leaf:[
		{'stat':'item-quantity','valueMod':1,'chance':0.5},
		{'stat':'summon-atk','valueMod':1,'chance':1},
	
	],
	hide:[
		{'stat':'item-rarity','valueMod':1,'chance':0.5},
		{'stat':'summon-def','valueMod':1,'chance':1},
	
	],
};

Db.boost.list.boots = {
	all:[
		{'stat':['dmg-*'],'valueMod':2,'chance':1},
		{'stat':['def-*'],'valueMod':2,'chance':1},
		{'stat':'maxSpd','valueMod':1,'chance':1},
		{'stat':'acc','valueMod':1,'chance':1},
	],				
	chain:[
		{'stat':'strike-range','valueMod':1,'chance':1},
		
	],
	leaf:[
		{'stat':'strike-size','valueMod':1,'chance':1},
	
	],
	hide:[
		{'stat':'strike-maxHit','valueMod':1,'chance':1},
	
	],
};

Db.boost.list.melee = {
	all:[
		{'stat':['dmg'],'valueMod':1,'chance':1},
		{'stat':['dmg-melee'],'valueMod':1,'chance':1},
	],				
	mace:[	//brute force / tank
		{'stat':['dmg-melee'],'valueMod':10,'chance':1},
		{'stat':['def'],'valueMod':10,'chance':1},
	],
	spear:[	//aoe
		{'stat':'strike-size','valueMod':1,'chance':1},
		{'stat':'strike-maxHit','valueMod':1,'chance':1},
		{'stat':'strike-range','valueMod':1,'chance':1},
	],
	sword:[	//status
		{'stat':['status-time'],'valueMod':1,'chance':1},
		{'stat':['status-magn'],'valueMod':1,'chance':1},
		{'stat':['status-chance'],'valueMod':1,'chance':1},
	],
};

Db.boost.list.range = {
	all:[
		{'stat':['dmg'],'valueMod':1,'chance':1},
		{'stat':['dmg-range'],'valueMod':1,'chance':1},
	
	],				
	bow:[	//amount
		{'stat':'bullet-amount','valueMod':1,'chance':1},
	],
	boomerang:[	//crit
		{'stat':'crit-chance','valueMod':1,'chance':1},
		{'stat':'crit-magn','valueMod':1,'chance':1},
	
	],
	crossbow:[	//speed
		{'stat':'atkSpd-main','valueMod':5,'chance':10},
		//{'stat':'atkSpd-support','valueMod':5,'chance':10},
	],
};

Db.boost.list.magic = {
	all:[
		{'stat':['dmg'],'valueMod':1,'chance':1},
		{'stat':['dmg-magic'],'valueMod':1,'chance':1},
	
	],				
	wand:[	//leech
		{'stat':'leech-chance','valueMod':1,'chance':1},
		{'stat':'leech-magn','valueMod':1,'chance':1},
		
	],
	staff:[	//aoe onHit
		{'stat':'strike-maxHit','valueMod':10,'chance':1},
		{'stat':'strike-range','valueMod':10,'chance':1},
		{'stat':'strike-size','valueMod':10,'chance':1},
	
	],
	orb:[	//status
		{'stat':['status-chance'],'valueMod':1,'chance':1},
		{'stat':['status-magn'],'valueMod':1,'chance':1},
		{'stat':['status-time'],'valueMod':1,'chance':1},
	
	],
};

Init.db.boost = function(){
	//stats in [] are transformed into multiple stats using boostPreDbConvertList.
	//value: [min,max], mod: chance to be picked

	Init.db.boost.base();
	
	for(var i in Db.boost.list){
		if(i === 'all') continue;
		for(var j in Db.boost.list[i]){
			if(j === 'all') continue;
			
			var typeList = Db.boost.list[i][j];
			
			//Add stuff from all
			for(var k in Db.boost.list.all)	typeList.push(deepClone(Db.boost.list.all[k]));
			for(var k in Db.boost.list[i].all)	typeList.push(deepClone(Db.boost.list[i].all[k]));
			
			//Convert Group into individual
			for(var k in typeList){
				if(typeof typeList[k].stat === 'string') continue;
				
				var group = Db.boost.group[typeList[k].stat[0]];
				
				for(var m in group){
					typeList.push({
						'stat':group[m],
						'valueMod':typeList[k].valueMod,
						'chance':typeList[k].chance/group.length,
					})
				}			
			}
			for(var k = typeList.length-1; k >= 0; k--){
				if(typeof typeList[k].stat !== 'string') typeList.splice(k,1);
			}	
			
			//Set Value
			for(var k in typeList){
				var base = Db.boost.base[typeList[k].stat];
				base *= typeList[k].valueMod;
				typeList[k].value = [base*0.75,base*1.25];		
				delete typeList[k].valueMod;
			}
		}
	}
	
}


//##############################################
//##############################################

Db.boost.group = {
	//Dmg
	'dmg':['dmg-melee-+','dmg-melee-*','dmg-melee-x','dmg-melee-^','dmg-range-+','dmg-range-*','dmg-range-x','dmg-range-^','dmg-magic-+','dmg-magic-*','dmg-magic-x','dmg-magic-^','dmg-fire-+','dmg-fire-*','dmg-fire-x','dmg-fire-^','dmg-cold-+','dmg-cold-*','dmg-cold-x','dmg-cold-^','dmg-lightning-+','dmg-lightning-*','dmg-lightning-x','dmg-lightning-^'],
	'dmg-+':['dmg-melee-+','dmg-range-+','dmg-magic-+','dmg-fire-+','dmg-cold-+','dmg-lightning-+'],
	'dmg-^':['dmg-melee-^','dmg-range-^','dmg-magic-^','dmg-fire-^','dmg-cold-^','dmg-lightning-^'],
	'dmg-*':['dmg-melee-*','dmg-range-*','dmg-magic-*','dmg-fire-*','dmg-cold-*','dmg-lightning-*'],
	'dmg-x':['dmg-melee-x','dmg-range-x','dmg-magic-x','dmg-fire-x','dmg-cold-x','dmg-lightning-x'],
	
	'dmg-melee':['dmg-melee-+','dmg-melee-*','dmg-melee-x','dmg-melee-^'],
	'dmg-range':['dmg-range-+','dmg-range-*','dmg-range-x','dmg-range-^'],
	'dmg-magic':['dmg-magic-+','dmg-magic-*','dmg-magic-x','dmg-magic-^'],
	'dmg-fire':['dmg-fire-+','dmg-fire-*','dmg-fire-x','dmg-fire-^'],
	'dmg-cold':['dmg-cold-+','dmg-cold-*','dmg-cold-x','dmg-cold-^'],
	'dmg-lightning':['dmg-lightning-+','dmg-lightning-*','dmg-lightning-x','dmg-lightning-^'],

	//Def
	'def':['def-melee-+','def-melee-*','def-melee-x','def-melee-^','def-range-+','def-range-*','def-range-x','def-range-^','def-magic-+','def-magic-*','def-magic-x','def-magic-^','def-fire-+','def-fire-*','def-fire-x','def-fire-^','def-cold-+','def-cold-*','def-cold-x','def-cold-^','def-lightning-+','def-lightning-*','def-lightning-x','def-lightning-^'],
	'def-+':['def-melee-+','def-range-+','def-magic-+','def-fire-+','def-cold-+','def-lightning-+'],
	'def-^':['def-melee-^','def-range-^','def-magic-^','def-fire-^','def-cold-^','def-lightning-^'],
	'def-*':['def-melee-*','def-range-*','def-magic-*','def-fire-*','def-cold-*','def-lightning-*'],
	'def-x':['def-melee-x','def-range-x','def-magic-x','def-fire-x','def-cold-x','def-lightning-x'],
	
	'def-melee':['def-melee-+','def-melee-*','def-melee-x','def-melee-^'],
	'def-range':['def-range-+','def-range-*','def-range-x','def-range-^'],
	'def-magic':['def-magic-+','def-magic-*','def-magic-x','def-magic-^'],
	'def-fire':['def-fire-+','def-fire-*','def-fire-x','def-fire-^'],
	'def-cold':['def-cold-+','def-cold-*','def-cold-x','def-cold-^'],
	'def-lightning':['def-lightning-+','def-lightning-*','def-lightning-x','def-lightning-^'],
	
	//Weapon
	'weapon':['weapon-mace','weapon-spear','weapon-sword','weapon-bow','weapon-boomerang','weapon-crossbow','weapon-wand','weapon-staff','weapon-orb'],		
	'weapon-melee':['weapon-mace','weapon-spear','weapon-sword'],
	'weapon-range':['weapon-bow','weapon-boomerang','weapon-crossbow'],
	'weapon-magic':['weapon-wand','weapon-staff','weapon-orb'],
	
	//Status
	'status-all':['burn-magn','burn-chance','burn-time','chill-magn','chill-chance','chill-time','stun-magn','stun-chance','stun-time','bleed-magn','bleed-chance','bleed-time','knock-magn','knock-chance','knock-time','drain-magn','drain-chance','drain-time'],
	'status-magn':['burn-magn','chill-magn','stun-magn','bleed-magn','knock-magn','drain-magn'],
	'status-chance':['burn-chance','chill-chance','stun-chance','bleed-chance','knock-chance','drain-chance'],
	'status-time':['burn-time','chill-time','stun-time','bleed-time','knock-time','drain-time'],
	'burn-all':['burn-magn','burn-chance','burn-time'],
	'chill-all':['chill-magn','chill-chance','chill-time'],
	'stun-all':['stun-magn','stun-chance','stun-time'],
	'bleed-all':['bleed-magn','bleed-chance','bleed-time'],
	'knock-all':['knock-magn','knock-chance','knock-time'],
	'drain-all':['drain-magn','drain-chance','drain-time'],

	'summon-all':['summon-amount','summon-time','summon-atk','summon-def'],
	'item-all':['item-quantity','item-quality','item-rarity'],
	
	'resource-max':['mana-max'],
	'resource-regen':['mana-regen'],
	//'resource-max':['mana-max','fury-max','heal-max','dodge-max'],
	//'resource-regen':['mana-regen','fury-regen','heal-regen','dodge-regen'],
	
	
}

Db.boost.base = {
	group:{
		'dmg-+':0.01,
		'dmg-^':0.01,
		'dmg-x':0.01,
		'dmg-*':0.01,
		'def-+':0.01,
		'def-^':0.01,
		'def-x':0.01,
		'def-*':0.01,
		'weapon':0.01,
		'status-magn':0.01,
		'status-chance':0.01,
		'status-time':0.01,
		'summon-all':0.01,
		'item-all':0.01,
		'resource-max':1,	//hp excluded
		'resource-regen':0.01,
	},
	normal:{
		//normal
		'atkSpd-main':0.01,
		'atkSpd-support':0.01,
		'crit-chance':0.01,
		'crit-magn':0.01,
		'leech-magn':0.01,
		'leech-chance':0.01,
		'bullet-amount':0.01,
		'strike-range':0.01,
		'strike-size':0.01,
		'strike-maxHit':0.01,
		'pickRadius':100,
		'hp-max':1,
		'hp-regen':0.01,
		'maxSpd':0.1,
		'acc':0.01,
	}
}



Init.db.boost.base = function(){
	for(var i in Db.boost.base.group){
		for(var j in Db.boost.group[i]){
			Db.boost.base.normal[Db.boost.group[i][j]] = Db.boost.base.group[i];
		}
	}
	Db.boost.base = Db.boost.base.normal;
}




