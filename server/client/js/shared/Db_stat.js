
//if not playerOnly : cant be boosted with equip/curse for non player
Init.db.stat = function(){
	Db.stat = {
	    
	//{Speed
	'maxSpd':{
		'icon':'defensive.speed',
		'name':'Max Speed',
		'boost':{'base':12,'stat':['maxSpd'],'min':0,},
		},
	'acc':{
		'icon':'defensive.speed',
		'name':'Acceleration',
		'boost':{'base':3,'stat':['acc'],'min':0,},
		},
	'friction':{
		'icon':'defensive.speed',
		'name':'Friction',
		'boost':{'base':0.9,'stat':['friction'],'min':0,'max':1},
		'playerOnly':1,
		},
	//}
	
	//{Misc
	'aim':{
		'icon':'defensive.range',
		'name':'Aim',
		'boost':{'stat':['aim'],'min':0,},
		},
	//}

	//{Resource
	'dodge-regen':{
		'icon':'resource.dodge',
		'name':'Regen Dodge',
		'boost':{'base':1,'stat':['resource','dodge','regen'],},
		'playerOnly':1,
		},
	'hp-regen':{
		'icon':'resource.hp',
		'name':'Regen Life',
		'boost':{'base':1,'stat':['resource','hp','regen'],},
		'playerOnly':1,
		},
	'mana-regen':{
		'icon':'resource.mana',
		'name':'Regen Mana',
		'boost':{'base':1,'stat':['resource','mana','regen'],},
		'playerOnly':1,
		},	
	'fury-regen':{
		'icon':'resource.fury',
		'name':'Regen Fury',
		'boost':{'base':1,'stat':['resource','fury','regen'],},
		'playerOnly':1,
		},
	'heal-regen':{
		'icon':'resource.heal',
		'name':'Regen Heal',
		'boost':{'base':1,'stat':['resource','heal','regen'],},
		'playerOnly':1,
		},

		
	'dodge-max':{
		'icon':'resource.dodge',
		'name':'Max Dodge',
		'boost':{'base':100,'stat':['resource','dodge','max'],},
		'playerOnly':1,
		},
	'hp-max':{
		'icon':'resource.hp',
		'name':'Max Life',
		'boost':{'base':1000,'stat':['resource','hp','max'],},
		'playerOnly':1,
		},
	'mana-max':{
		'icon':'resource.mana',
		'name':'Max Mana',
		'boost':{'base':100,'stat':['resource','mana','max'],},
		'playerOnly':1,
		},	
	'fury-max':{
		'icon':'resource.fury',
		'name':'Max Fury',
		'boost':{'base':100,'stat':['resource','fury','max'],},
		'playerOnly':1,},
	'heal-max':{
		'icon':'resource.heal',
		'name':'Max Heal',
		'boost':{'base':100,'stat':['resource','heal','max'],},
		'playerOnly':1,},
	
	
	
	'leech-magn':{
		'icon':'resource.hp',
		'name':'Leech Life Magn.',
		'boost':{'stat':['bonus','leech','magn'],},
		'playerOnly':1,
		},
	'leech-chance':{
		'icon':'resource.hp',
		'name':'Leech Life Chance',
		'boost':{'stat':['bonus','leech','chance'],},
		'playerOnly':1,
		},
	
	
	
	//}
	
	//{Item
	'pickRadius':{
		'icon':'defensive.pickup',
		'name':'Pick Radius',
		'boost':{'base':100,'stat':['pickRadius'],'min':5},
		'playerOnly':1,
		},	
	'item-quantity':{
		'icon':'defensive.item',
		'name':'Item Quantity',
		'boost':{'stat':['item','quantity'],},
		'playerOnly':1,
		},
	'item-quality':{
		'icon':'defensive.item',
		'name':'Item Quality',
		'boost':{'stat':['item','quality'],},
		'playerOnly':1,
		},
	'item-rarity':{
		'icon':'defensive.item',
		'name':'Item Rarity',
		'boost':{'stat':['item','rarity'],},
		'playerOnly':1,
		},
	//}	
		
	//{Attack
	'atkSpd-main':{
		'icon':'offensive.atkSpd',
		'name':'Atk Spd Main',
		'boost':{'base':1,'stat':['atkSpd','main'],},
		},
	'atkSpd-support':{
		'icon':'offensive.atkSpd',
		'name':'Atk Spd Support',
		'boost':{'base':1,'stat':['atkSpd','support'],},
		},
	'crit-chance':{
		'icon':'offensive.strike',
		'name':'Crit Chance',
		'boost':{'base':0.05,'stat':['bonus','crit','chance'],},
		'playerOnly':1,
		},
	'crit-magn':{
		'icon':'offensive.strike',
		'name':'Crit Magn',
		'boost':{'base':1.5,'stat':['bonus','crit','magn'],},
		'playerOnly':1,
		},
	'bullet-amount':{
		'icon':'offensive.bullet',
		'name':'Proj. Amount',
		'boost':{'base':1,'stat':['bonus','bullet','amount'],},
		'playerOnly':1,
		},
	'strike-range':{
		'icon':'offensive.strike',
		'name':'Strike Range',
		'boost':{'base':1,'stat':['bonus','strike','range'],},
		'playerOnly':1,
		},
	'strike-size':{
		'icon':'offensive.strike',
		'name':'AoE Size',
		'boost':{'base':1,'stat':['bonus','strike','size'],},
		'playerOnly':1,
		},	
	'strike-maxHit':{
		'icon':'offensive.strike',
		'name':'AoE Max Target',
		'boost':{'base':1,'stat':['bonus','strike','maxHit'],},
		'playerOnly':1,
		},
	//}
	
	//{Status
	'burn-time':{
		'icon':'offensive.burn',
		'name':'Burn Time',
		'boost':{'base':1,'stat':['bonus','burn','time'],},
		'playerOnly':1,
		},
	'burn-magn':{
		'icon':'offensive.burn',
		'name':'Burn Magn',
		'boost':{'base':0.01,'stat':['bonus','burn','magn'],},
		'playerOnly':1,
		},	
	'burn-chance':{
		'icon':'offensive.burn',
		'name':'Burn Chance',
		'boost':{'base':1,'stat':['bonus','burn','chance'],},
		'playerOnly':1,
		},	
	'chill-time':{
		'icon':'offensive.chill',
		'name':'Chill Time',
		'boost':{'base':1,'stat':['bonus','chill','time'],},
		'playerOnly':1,
		},
	'chill-magn':{
		'icon':'offensive.chill',
		'name':'Chill Magn',
		'boost':{'base':0.25,'stat':['bonus','chill','magn'],},
		'playerOnly':1,
		},	
	'chill-chance':{
		'icon':'offensive.chill',
		'name':'Chill Chance',
		'boost':{'base':1,'stat':['bonus','chill','chance'],},
		'playerOnly':1,
		},	
	'confuse-time':{
		'icon':'offensive.confuse',
		'name':'Confuse Time',
		'boost':{'base':1,'stat':['bonus','confuse','time'],},
		'playerOnly':1,
		},
	'confuse-magn':{
		'icon':'offensive.confuse',
		'name':'Confuse Magn',
		'boost':{'base':1,'stat':['bonus','confuse','magn'],},
		'playerOnly':1,
		},	
	'confuse-chance':{
		'icon':'offensive.confuse',
		'name':'Confuse Chance',
		'boost':{'base':1,'stat':['bonus','confuse','chance'],},
		'playerOnly':1,
		},		
	'bleed-time':{
		'icon':'offensive.bleed',
		'name':'Bleed Time',
		'boost':{'base':1,'stat':['bonus','bleed','time'],},
		'playerOnly':1,
		},
	'bleed-magn':{
		'icon':'offensive.bleed',
		'name':'Bleed Magn',
		'boost':{'base':0.25,'stat':['bonus','bleed','magn'],},
		'playerOnly':1,
		},	
	'bleed-chance':{
		'icon':'offensive.bleed',
		'name':'Bleed Chance',
		'boost':{'base':1,'stat':['bonus','bleed','chance'],},
		'playerOnly':1,
		},		
	'drain-time':{
		'icon':'offensive.drain',
		'name':'Bleed Time',
		'boost':{'base':1,'stat':['bonus','drain','time'],},
		'playerOnly':1,
		},
	'drain-magn':{
		'icon':'offensive.drain',
		'name':'Bleed Magn',
		'boost':{'base':0.05,'stat':['bonus','drain','magn'],},
		'playerOnly':1,
		},	
	'drain-chance':{
		'icon':'offensive.drain',
		'name':'Bleed Chance',
		'boost':{'base':1,'stat':['bonus','drain','chance'],},
		'playerOnly':1,
		},	
	'knock-time':{
		'icon':'offensive.knock',
		'name':'Knock Time',
		'boost':{'base':1,'stat':['bonus','knock','time'],},
		'playerOnly':1,
		},
	'knock-magn':{
		'icon':'offensive.knock',
		'name':'Knock Magn',
		'boost':{'base':10,'stat':['bonus','knock','magn'],},
		'playerOnly':1,
		},	
	'knock-chance':{
		'icon':'offensive.knock',
		'name':'Knock Chance',
		'boost':{'base':1,'stat':['bonus','knock','chance'],},
		'playerOnly':1,
		},	
	
	'resist-burn':{
		'icon':'offensive.burn',
		'name':'Burn Resist',
		'boost':{'stat':['status','burn','resist'],},
		},	
	'resist-chill':{
		'icon':'offensive.chill',
		'name':'Chill Resist',
		'boost':{'stat':['status','chill','resist'],},
		},	
	'resist-drain':{
		'icon':'offensive.drain',
		'name':'Chill Resist',
		'boost':{'stat':['status','drain','resist'],},
		},	
	'resist-confuse':{
		'icon':'offensive.confuse',
		'name':'Confuse Resist',
		'boost':{'stat':['status','confuse','resist'],},
		},	
	'resist-knock':{
		'icon':'offensive.knock',
		'name':'Knock Resist',
		'boost':{'stat':['status','knock','resist'],},
		},	
	'resist-bleed':{
		'icon':'offensive.bleed',
		'name':'Bleed Resist',
		'boost':{'stat':['status','bleed','resist'],},
		},	
	
	//}	
		
	//{Skill
	'exp-melee':{
		'icon':'skill.melee',
		'name':'Melee Exp',
		'boost':{'base':1,'stat':['bonus','exp','melee'],},
		'playerOnly':1,
		},
	'exp-range':{
		'icon':'skill.range',
		'name':'Range Exp',
		'boost':{'base':1,'stat':['bonus','exp','range'],},
		'playerOnly':1,
		},
	'exp-magic':{
		'icon':'skill.magic',
		'name':'Magic Exp',
		'boost':{'base':1,'stat':['bonus','exp','magic'],},
		'playerOnly':1,
		},
	'exp-metalwork':{
		'icon':'skill.metalwork',
		'name':'Metalwork Exp',
		'boost':{'base':1,'stat':['bonus','exp','metalwork'],},
		'playerOnly':1,
		},
	'exp-woodwork':{
		'icon':'skill.woodwork',
		'name':'Woodwork Exp',
		'boost':{'base':1,'stat':['bonus','exp','woodwork'],},
		'playerOnly':1,
		},
	'exp-leatherwork':{
		'icon':'skill.leatherwork',
		'name':'Leatherwork Exp',
		'boost':{'base':1,'stat':['bonus','exp','leatherwork'],},
		'playerOnly':1,
		},
	'exp-geology':{
		'icon':'skill.geology',
		'name':'Geology Exp',
		'boost':{'base':1,'stat':['bonus','exp','geology'],},
		'playerOnly':1,
		},
	'exp-metallurgy':{
		'icon':'skill.metallurgy',
		'name':'Metallurgy Exp',
		'boost':{'base':1,'stat':['bonus','exp','metallurgy'],},
		'playerOnly':1,
		},	
	'exp-trapping':{
		'icon':'skill.trapping',
		'name':'Trapping Exp',
		'boost':{'base':1,'stat':['bonus','exp','trapping'],},
		'playerOnly':1,
		},
	//}

	//{Def
	'globalDef':{
		'icon':'defensive.melee',
		'name':'Main Defense',
		'boost':{'base':1,'stat':['globalDef'],},
		},
	'def-melee-+':{
		'icon':'defensive.melee',
		'name':'Def Melee +',
		'boost':{'stat':['mastery','def','melee','+'],},
		'playerOnly':1,
		},	
	'def-melee-*':{
		'icon':'defensive.melee',
		'name':'Def Melee *',
		'boost':{'base':1,'stat':['mastery','def','melee','*'],},
		'playerOnly':1,
		},
	'def-melee-^':{
		'icon':'defensive.melee',
		'name':'Def Melee ^',
		'boost':{'base':1,'stat':['mastery','def','melee','^'],},
		'playerOnly':1,
		},
	'def-melee-x':{
		'icon':'defensive.melee',
		'name':'Def Melee x',
		'boost':{'base':1,'stat':['mastery','def','melee','x'],},
		'playerOnly':1,
		},
	'def-melee-mod':{
		'icon':'defensive.melee',
		'name':'Def Melee Mod',
		'boost':{'base':1,'stat':['mastery','def','melee','mod'],},
		},		
	'def-range-+':{
		'icon':'defensive.range',
		'name':'Def Range +',
		'boost':{'stat':['mastery','def','range','+'],},
		'playerOnly':1,
		},	
	'def-range-*':{
		'icon':'defensive.range',
		'name':'Def Range *',
		'boost':{'base':1,'stat':['mastery','def','range','*'],},
		'playerOnly':1,
		},
	'def-range-^':{
		'icon':'defensive.range',
		'name':'Def Range ^',
		'boost':{'base':1,'stat':['mastery','def','range','^'],},
		'playerOnly':1,
		},
	'def-range-x':{
		'icon':'defensive.range',
		'name':'Def Range x',
		'boost':{'base':1,'stat':['mastery','def','range','x'],},
		'playerOnly':1,
		},
	'def-range-mod':{
		'icon':'defensive.melee',
		'name':'Def Melee Mod',
		'boost':{'base':1,'stat':['mastery','def','melee','mod'],},
		},
	'def-magic-+':{
		'icon':'defensive.magic',
		'name':'Def Magic +',
		'boost':{'stat':['mastery','def','magic','+'],},
		'playerOnly':1,
		},	
	'def-magic-*':{
		'icon':'defensive.magic',
		'name':'Def Magic *',
		'boost':{'base':1,'stat':['mastery','def','magic','*'],},
		'playerOnly':1,
		},
	'def-magic-^':{
		'icon':'defensive.magic',
		'name':'Def Magic ^',
		'boost':{'base':1,'stat':['mastery','def','magic','^'],},
		'playerOnly':1,
		},
	'def-magic-x':{
		'icon':'defensive.magic',
		'name':'Def Magic x',
		'boost':{'base':1,'stat':['mastery','def','magic','x'],},
		'playerOnly':1,
		},
	'def-magic-mod':{
		'icon':'defensive.magic',
		'name':'Def Magic x',
		'boost':{'base':1,'stat':['mastery','def','magic','mod'],},
		},	
	'def-fire-+':{
		'icon':'defensive.fire',
		'name':'Def Fire +',
		'boost':{'stat':['mastery','def','fire','+'],},
		'playerOnly':1,
		},	
	'def-fire-*':{
		'icon':'defensive.fire',
		'name':'Def Fire *',
		'boost':{'base':1,'stat':['mastery','def','fire','*'],},
		'playerOnly':1,
		},
	'def-fire-^':{
		'icon':'defensive.fire',
		'name':'Def Fire ^',
		'boost':{'base':1,'stat':['mastery','def','fire','^'],},
		'playerOnly':1,
		},
	'def-fire-x':{
		'icon':'defensive.fire',
		'name':'Def Fire x',
		'boost':{'base':1,'stat':['mastery','def','fire','x'],},
		'playerOnly':1,
		},
	'def-fire-mod':{
		'icon':'defensive.fire',
		'name':'Def Fire Mod',
		'boost':{'base':1,'stat':['mastery','def','fire','mod'],},
		},		
	'def-cold-+':{
		'icon':'defensive.cold',
		'name':'Def Cold +',
		'boost':{'stat':['mastery','def','cold','+'],},
		'playerOnly':1,
		},	
	'def-cold-*':{
		'icon':'defensive.cold',
		'name':'Def Cold *',
		'boost':{'base':1,'stat':['mastery','def','cold','*'],},
		'playerOnly':1,
		},
	'def-cold-^':{
		'icon':'defensive.cold',
		'name':'Def Cold ^',
		'boost':{'base':1,'stat':['mastery','def','cold','^'],},
		'playerOnly':1,
		},
	'def-cold-x':{
		'icon':'defensive.cold',
		'name':'Def Cold x',
		'boost':{'base':1,'stat':['mastery','def','cold','x'],},
		'playerOnly':1,
		},
	'def-cold-mod':{
		'icon':'defensive.cold',
		'name':'Def Cold Mod',
		'boost':{'base':1,'stat':['mastery','def','cold','mod'],},
		},		
	'def-lightning-+':{
		'icon':'defensive.lightning',
		'name':'Def Lightning +',
		'boost':{'stat':['mastery','def','lightning','+'],},
		'playerOnly':1,
		},	
	'def-lightning-*':{
		'icon':'defensive.lightning',
		'name':'Def Lightning *',
		'boost':{'base':1,'stat':['mastery','def','lightning','*'],},
		'playerOnly':1,
		},
	'def-lightning-^':{
		'icon':'defensive.lightning',
		'name':'Def Lightning ^',
		'boost':{'base':1,'stat':['mastery','def','lightning','^'],},
		'playerOnly':1,
		},
	'def-lightning-x':{
		'icon':'defensive.lightning',
		'name':'Def Lightning x',
		'boost':{'base':1,'stat':['mastery','def','lightning','x'],},
		'playerOnly':1,
		},
	'def-lightning-mod':{
		'icon':'defensive.lightning',
		'name':'Def Lightning Mod',
		'boost':{'base':1,'stat':['mastery','def','lightning','mod'],},
		},		
	//}
	
	//{Dmg
	'globalDmg':{
		'icon':'offensive.melee',
		'name':'Main Damage',
		'boost':{'base':1,'stat':['globalDmg'],},
		},
	'dmg-melee-+':{
		'icon':'offensive.melee',
		'name':'Dmg Melee +',
		'boost':{'stat':['mastery','dmg','melee','+'],},
		'playerOnly':1,
		},	
	'dmg-melee-*':{
		'icon':'offensive.melee',
		'name':'Dmg Melee *',
		'boost':{'base':1,'stat':['mastery','dmg','melee','*'],},
		'playerOnly':1,
		},
	'dmg-melee-^':{
		'icon':'offensive.melee',
		'name':'Dmg Melee ^',
		'boost':{'base':1,'stat':['mastery','dmg','melee','^'],},
		'playerOnly':1,
		},
	'dmg-melee-x':{
		'icon':'offensive.melee',
		'name':'Dmg Melee x',
		'boost':{'base':1,'stat':['mastery','dmg','melee','x'],},
		'playerOnly':1,
		},
	'dmg-melee-mod':{
		'icon':'offensive.melee',
		'name':'Dmg Melee Mod',
		'boost':{'base':1,'stat':['mastery','dmg','melee','mod'],},
		},		
	'dmg-range-+':{
		'icon':'offensive.range',
		'name':'Dmg Range +',
		'boost':{'stat':['mastery','dmg','range','+'],},
		'playerOnly':1,
		},	
	'dmg-range-*':{
		'icon':'offensive.range',
		'name':'Dmg Range *',
		'boost':{'base':1,'stat':['mastery','dmg','range','*'],},
		'playerOnly':1,
		},
	'dmg-range-^':{
		'icon':'offensive.range',
		'name':'Dmg Range ^',
		'boost':{'base':1,'stat':['mastery','dmg','range','^'],},
		'playerOnly':1,
		},
	'dmg-range-x':{
		'icon':'offensive.range',
		'name':'Dmg Range x',
		'boost':{'base':1,'stat':['mastery','dmg','range','x'],},
		'playerOnly':1,
		},
	'dmg-range-mod':{
		'icon':'offensive.melee',
		'name':'Dmg Melee Mod',
		'boost':{'base':1,'stat':['mastery','dmg','melee','mod'],},
		},
	'dmg-magic-+':{
		'icon':'offensive.magic',
		'name':'Dmg Magic +',
		'boost':{'stat':['mastery','dmg','magic','+'],},
		'playerOnly':1,
		},	
	'dmg-magic-*':{
		'icon':'offensive.magic',
		'name':'Dmg Magic *',
		'boost':{'base':1,'stat':['mastery','dmg','magic','*'],},
		'playerOnly':1,
		},
	'dmg-magic-^':{
		'icon':'offensive.magic',
		'name':'Dmg Magic ^',
		'boost':{'base':1,'stat':['mastery','dmg','magic','^'],},
		'playerOnly':1,
		},
	'dmg-magic-x':{
		'icon':'offensive.magic',
		'name':'Dmg Magic x',
		'boost':{'base':1,'stat':['mastery','dmg','magic','x'],},
		'playerOnly':1,
		},
	'dmg-magic-mod':{
		'icon':'offensive.magic',
		'name':'Dmg Magic x',
		'boost':{'base':1,'stat':['mastery','dmg','magic','mod'],},
		},	
	'dmg-fire-+':{
		'icon':'offensive.fire',
		'name':'Dmg Fire +',
		'boost':{'stat':['mastery','dmg','fire','+'],},
		'playerOnly':1,
		},	
	'dmg-fire-*':{
		'icon':'offensive.fire',
		'name':'Dmg Fire *',
		'boost':{'base':1,'stat':['mastery','dmg','fire','*'],},
		'playerOnly':1,
		},
	'dmg-fire-^':{
		'icon':'offensive.fire',
		'name':'Dmg Fire ^',
		'boost':{'base':1,'stat':['mastery','dmg','fire','^'],},
		'playerOnly':1,
		},
	'dmg-fire-x':{
		'icon':'offensive.fire',
		'name':'Dmg Fire x',
		'boost':{'base':1,'stat':['mastery','dmg','fire','x'],},
		'playerOnly':1,
		},
	'dmg-fire-mod':{
		'icon':'offensive.fire',
		'name':'Dmg Fire Mod',
		'boost':{'base':1,'stat':['mastery','dmg','fire','mod'],},
		},		
	'dmg-cold-+':{
		'icon':'offensive.cold',
		'name':'Dmg Cold +',
		'boost':{'stat':['mastery','dmg','cold','+'],},
		'playerOnly':1,
		},	
	'dmg-cold-*':{
		'icon':'offensive.cold',
		'name':'Dmg Cold *',
		'boost':{'base':1,'stat':['mastery','dmg','cold','*'],},
		'playerOnly':1,
		},
	'dmg-cold-^':{
		'icon':'offensive.cold',
		'name':'Dmg Cold ^',
		'boost':{'base':1,'stat':['mastery','dmg','cold','^'],},
		'playerOnly':1,
		},
	'dmg-cold-x':{
		'icon':'offensive.cold',
		'name':'Dmg Cold x',
		'boost':{'base':1,'stat':['mastery','dmg','cold','x'],},
		'playerOnly':1,
		},
	'dmg-cold-mod':{
		'icon':'offensive.cold',
		'name':'Dmg Cold Mod',
		'boost':{'base':1,'stat':['mastery','dmg','cold','mod'],},
		},		
	'dmg-lightning-+':{
		'icon':'offensive.lightning',
		'name':'Dmg Lightning +',
		'boost':{'stat':['mastery','dmg','lightning','+'],},
		'playerOnly':1,
		},	
	'dmg-lightning-*':{
		'icon':'offensive.lightning',
		'name':'Dmg Lightning *',
		'boost':{'base':1,'stat':['mastery','dmg','lightning','*'],},
		'playerOnly':1,
		},
	'dmg-lightning-^':{
		'icon':'offensive.lightning',
		'name':'Dmg Lightning ^',
		'boost':{'base':1,'stat':['mastery','dmg','lightning','^'],},
		'playerOnly':1,
		},
	'dmg-lightning-x':{
		'icon':'offensive.lightning',
		'name':'Dmg Lightning x',
		'boost':{'base':1,'stat':['mastery','dmg','lightning','x'],},
		'playerOnly':1,
		},
	'dmg-lightning-mod':{
		'icon':'offensive.lightning',
		'name':'Dmg Lightning Mod',
		'boost':{'base':1,'stat':['mastery','dmg','lightning','mod'],},
		},		
	//}
	
	//{Weapon
	'weapon-mace':{
		'icon':'offensive.mace',
		'name':'Dmg Mace',
		'boost':{'stat':['bonus','weapon','mace'],},
		'playerOnly':1,	
		},			
	'weapon-spear':{
		'icon':'offensive.spear',
		'name':'Dmg Spear',
		'boost':{'stat':['bonus','weapon','spear'],},
		'playerOnly':1,	
		},	
	'weapon-sword':{
		'icon':'offensive.sword',
		'name':'Dmg Sword',
		'boost':{'stat':['bonus','weapon','sword'],},
		'playerOnly':1,	
		},	
	'weapon-bow':{
		'icon':'offensive.bow',
		'name':'Dmg Bow',
		'boost':{'stat':['bonus','weapon','bow'],},
		'playerOnly':1,	
		},			
	'weapon-boomerang':{
		'icon':'offensive.boomerang',
		'name':'Dmg Boomerang',
		'boost':{'stat':['bonus','weapon','boomerang'],},
		'playerOnly':1,	
		},	
	'weapon-crossbow':{
		'icon':'offensive.crossbow',
		'name':'Dmg Crossbow',
		'boost':{'stat':['bonus','weapon','crossbow'],},
		'playerOnly':1,
		},		
	'weapon-wand':{	
		'icon':'offensive.wand',
		'name':'Dmg Wand',
		'boost':{'stat':['bonus','weapon','wand'],},
		'playerOnly':1,	
		},			
	'weapon-staff':{
		'icon':'offensive.staff',
		'name':'Dmg Staff',
		'boost':{'stat':['bonus','weapon','staff'],},
		'playerOnly':1,	
		},	
	'weapon-orb':{
		'icon':'offensive.orb',
		'name':'Dmg Orb',
		'boost':{'stat':['bonus','weapon','orb'],},
		'playerOnly':1,	
		},
	//}
	
	//{Summon
	'summon-amount':{
		'icon':'summon.wolf',
		'name':'Summon Amount',
		'boost':{'base':1,'stat':['bonus','summon','amount'],},
		'playerOnly':1,	
		},
	'summon-time':{
		'icon':'summon.wolf',
		'name':'Summon Time',
		'boost':{'base':1,'stat':['bonus','summon','time'],},
		'playerOnly':1,	
		},
	'summon-atk':{
		'icon':'summon.wolf',
		'name':'Summon Atk',
		'boost':{'base':1,'stat':['bonus','summon','atk'],},
		'playerOnly':1,	
		},
	'summon-def':{
		'icon':'summon.wolf',
		'name':'Summon Def',
		'boost':{'base':1,'stat':['bonus','summon','def'],},
		'playerOnly':1,	
		},
	//}


}
	
	for(var i in Db.stat){
		var s = Db.stat[i].boost;
		
		s.name = {};
		s.max = typeof s.max !== 'undefined' ? s.max : 100000;
		s.permMax = s.max;
		s.min = typeof s.min !== 'undefined' ? s.min : -100000;
		s.permMin = s.min;
		s.base = typeof s.base !== 'undefined' ? s.base : 0;
		s.permBase = s.base;
		
	}
	Init.db.stat.bonus();
	Init.db.stat.boost();
}

	
Init.db.stat.bonus = function(){
	var info = {};
	
	for(var i in Db.stat){
		if(Db.stat[i].boost.stat[0] === 'bonus'){
			var a = Db.stat[i].boost.stat;
			var value = Db.stat[i].boost.base;
			
			if(a.length === 3){
				info[a[1]] = info[a[1]] || {};
				info[a[1]][a[2]] = value;
			}
			if(a.length === 4){
				info[a[1]] = info[a[1]] || {};
				info[a[1]][a[2]] = info[a[1]][a[2]] || {};
				info[a[1]][a[2]][a[3]]= value;
			}
		}
	}
	Actor.template.bonus = new Function('return ' + stringify(info));
}


Init.db.stat.boost = function(){
	var p = {};
	var e = {};
	
	for(var i in Db.stat){
		p[i] = Db.stat[i].boost;
		if(!Db.stat[i].playerOnly){
			e[i] = Db.stat[i].boost;
		}
	}

	Actor.template.boost = new Function('type', 'return type === "player" ? ' + stringify(p) + ' : ' + stringify(e));
}

