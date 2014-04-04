
//if not playerOnly : cant be boosted with equip/curse for non player
Init.db.stat = function(){
	Db.stat = {
	
	//ATL-4	
	//{Speed
	'maxSpd':{
		'icon':'defensive.speed',
		'name':'Max Speed',
		'boost':{'base':12,'stat':['maxSpd'],'min':0,},
		'description':"Movement Speed. If facing and moving at opposite direction, your Max Speed is reduced.",
		},
	'acc':{
		'icon':'defensive.speed',
		'name':'Acceleration',
		'boost':{'base':3,'stat':['acc'],'min':0,},
		'description':"Movement Acceleration.",
		},
	'friction':{
		'icon':'defensive.speed',
		'name':'Friction',
		'boost':{'base':0.9,'stat':['friction'],'min':0,'max':1},
		'playerOnly':1,
		'description':"",
		},
	//}
	
	//{Misc
	'aim':{
		'icon':'element.range',
		'name':'Aim',
		'boost':{'stat':['aim'],'min':0,},
		'description':"How precise your attacks are. Only affect direction. (Still same chance to deal damage.)",
		},
	//}

	//{Resource
	'dodge-regen':{
		'icon':'resource.dodge',
		'name':'Regen Dodge',
		'boost':{'base':1,'stat':['resource','dodge','regen'],},
		'playerOnly':1,
		'description':"Dodge Regeneration per frame.",
		},
	'hp-regen':{
		'icon':'resource.hp',
		'name':'Regen Life',
		'boost':{'base':1,'stat':['resource','hp','regen'],},
		'description':"Life Regeneration per frame.",
		},
	'mana-regen':{
		'icon':'resource.mana',
		'name':'Regen Mana',
		'boost':{'base':1,'stat':['resource','mana','regen'],},
		'description':"Mana Regeneration per frame.",
		},	
	'fury-regen':{
		'icon':'resource.fury',
		'name':'Regen Fury',
		'boost':{'base':1,'stat':['resource','fury','regen'],},
		'playerOnly':1,
		'description':"Fury Regeneration per frame.",
		},
	'heal-regen':{
		'icon':'resource.heal',
		'name':'Regen Heal',
		'boost':{'base':1,'stat':['resource','heal','regen'],},
		'playerOnly':1,
		'description':"Heal Regeneration per frame.",
		},

		
	'dodge-max':{
		'icon':'resource.dodge',
		'name':'Max Dodge',
		'boost':{'base':100,'stat':['resource','dodge','max'],},
		'playerOnly':1,
		'description':"Maximum Dodge Points.",
		},
	'hp-max':{
		'icon':'resource.hp',
		'name':'Max Life',
		'boost':{'base':1000,'stat':['resource','hp','max'],},
		'description':"Maximum Life Points.",
		},
	'mana-max':{
		'icon':'resource.mana',
		'name':'Max Mana',
		'boost':{'base':100,'stat':['resource','mana','max'],},
		'description':"Maximum Mana Points.",
		},	
	'fury-max':{
		'icon':'resource.fury',
		'name':'Max Fury',
		'boost':{'base':100,'stat':['resource','fury','max'],},
		'playerOnly':1,
		'description':"Maximum Fury Points.",
		},
	'heal-max':{
		'icon':'resource.heal',
		'name':'Max Heal',
		'boost':{'base':100,'stat':['resource','heal','max'],},
		'playerOnly':1,
		'description':"Maximum Heal Points.",
		},
	
	
	
	'leech-magn':{
		'icon':'resource.hp',
		'name':'Leech Life Magn.',
		'boost':{'base':0.01,'stat':['bonus','leech','magn'],},
		'description':"Affect %Life recovered if the Life Leech is successful. Leech is not affected by damage dealt.",
		},
	'leech-chance':{
		'icon':'resource.hp',
		'name':'Leech Life Chance',
		'boost':{'base':0,'stat':['bonus','leech','chance'],},
		'description':"Affect Chance to Life Leech when hitting an enemy.",
		},
	
	
	
	//}
	
	//{Item
	'pickRadius':{
		'icon':'defensive.pickup',
		'name':'Pick Radius',
		'boost':{'base':100,'stat':['pickRadius'],'min':5},
		'playerOnly':1,
		'description':"Maximum distance that you can still pick items on the ground.",
		},	
	'item-quantity':{
		'icon':'defensive.item',
		'name':'Item Quantity',
		'boost':{'stat':['item','quantity'],},
		'playerOnly':1,
		'description':"Chance to receive more drops from enemies. Quantity impacts chance that an enemy will drop something.",
		},
	'item-quality':{
		'icon':'defensive.item',
		'name':'Item Quality',
		'boost':{'stat':['item','quality'],},
		'playerOnly':1,
		'description':"Chance to receive higher quality plans from enemies. Quality impacts chance to roll top-bracket stats.",
		},
	'item-rarity':{
		'icon':'defensive.item',
		'name':'Item Rarity',
		'boost':{'stat':['item','rarity'],},
		'playerOnly':1,
		'description':"Chance to receive higher rarity plans from enemies. Rarity impacts chance to have additional boost on crafted equip.",
		},
	//}	
		
	//{Attack
	'atkSpd-main':{
		'icon':'offensive.atkSpd',
		'name':'Atk Spd Main',
		'boost':{'base':1,'stat':['atkSpd','main'],},
		'description':"Affect how fast your character can use abilities.",
		},
	'atkSpd-support':{
		'icon':'offensive.atkSpd',
		'name':'Atk Spd Support',
		'boost':{'base':1,'stat':['atkSpd','support'],},
		'description':"Affect how fast your character can use abilities.",
		},
	'crit-chance':{
		'icon':'offensive.strike',
		'name':'Crit Chance',
		'boost':{'base':0.05,'stat':['bonus','crit','chance'],},
		'description':"Affect chance to do a Critical Hit.",
		},
	'crit-magn':{
		'icon':'offensive.strike',
		'name':'Crit Magn',
		'boost':{'base':1.5,'stat':['bonus','crit','magn'],},
		'description':"Affect Additional Damage when doing a Critical Hit.",
		},
	'bullet-amount':{
		'icon':'offensive.bullet',
		'name':'Proj. Amount',
		'boost':{'base':1,'stat':['bonus','bullet','amount'],},
		'description':"Shoot x times additional bullets.  If amount isn't whole, it is rounded up or down randomly.",
		},
	'bullet-spd':{
		'icon':'offensive.bullet',
		'name':'Proj. Spd',
		'boost':{'base':1,'stat':['bonus','bullet','spd'],},
		'description':"Affect speed at which your bullet travels.",
		},
	'strike-range':{
		'icon':'offensive.strike',
		'name':'Strike Range',
		'boost':{'base':1,'stat':['bonus','strike','range'],},
		'playerOnly':1,
		'description':"Affect the minimum and maximum distance where you can strike.",
		},
	'strike-size':{
		'icon':'offensive.strike',
		'name':'AoE Size',
		'boost':{'base':1,'stat':['bonus','strike','size'],},
		'playerOnly':1,
		'description':"Affect the width and height of your strike.",
		},	
	'strike-maxHit':{
		'icon':'offensive.strike',
		'name':'AoE Max Target',
		'boost':{'base':1,'stat':['bonus','strike','maxHit'],},
		'playerOnly':1,
		'description':"Affect the maximum amount of target that can be hit by the same strike.",
		},
	//}
	
	//{Status
	'burn-time':{
		'icon':'status.burn',
		'name':'Burn Time',
		'boost':{'base':100,'stat':['bonus','burn','time'],},
		'description':"Affect Burn Duration.",
		},
	'burn-magn':{
		'icon':'status.burn',
		'name':'Burn Magn',
		'boost':{'base':0.005,'stat':['bonus','burn','magn'],},
		'description':"Affect damage dealt to a burnt enemy.",
		},	
	'burn-chance':{
		'icon':'status.burn',
		'name':'Burn Chance',
		'boost':{'base':1,'stat':['bonus','burn','chance'],},
		'description':"Affect chance to burn enemy.",
		},	
	'chill-time':{
		'icon':'status.chill',
		'name':'Chill Time',
		'boost':{'base':50,'stat':['bonus','chill','time'],},
		'description':"Affect Chill Duration.",
		},
	'chill-magn':{
		'icon':'status.chill',
		'name':'Chill Magn',
		'boost':{'base':2,'stat':['bonus','chill','magn'],},
		'description':"Affect how much speed and attack speed with be reduced.",
		},	
	'chill-chance':{
		'icon':'status.chill',
		'name':'Chill Chance',
		'boost':{'base':1,'stat':['bonus','chill','chance'],},
		'description':"Affect chance to chill enemy.",
		},	
	'stun-time':{
		'icon':'status.stun',
		'name':'Confuse Time',
		'boost':{'base':10,'stat':['bonus','stun','time'],},
		'description':"Affect Confuse Duration.",
		},
	'stun-magn':{
		'icon':'status.stun',
		'name':'Confuse Magn',
		'boost':{'base':2,'stat':['bonus','stun','magn'],},
		'description':"Affect how reduced the sight of view of stund enemy is.",
		},	
	'stun-chance':{
		'icon':'status.stun',
		'name':'Confuse Chance',
		'boost':{'base':1,'stat':['bonus','stun','chance'],},
		'description':"Affect chance to stun enemy.",
		},		
	'bleed-time':{
		'icon':'status.bleed',
		'name':'Bleed Time',
		'boost':{'base':1,'stat':['bonus','bleed','time'],},
		'description':"Affect Bleed Duration.",
		},
	'bleed-magn':{
		'icon':'status.bleed',
		'name':'Bleed Magn',
		'boost':{'base':100,'stat':['bonus','bleed','magn'],},
		'description':"Affect damage dealt by bleeding enemy.",
		},	
	'bleed-chance':{
		'icon':'status.bleed',
		'name':'Bleed Chance',
		'boost':{'base':1,'stat':['bonus','bleed','chance'],},
		'description':"Affect chance to bleed enemy.",
		},		
	'drain-time':{
		'icon':'status.drain',
		'name':'Drain Time',
		'boost':{'base':100,'stat':['bonus','drain','time'],},
		'description':"USELESS. Affect how long the enemy will be drained.",
		},
	'drain-magn':{
		'icon':'status.drain',
		'name':'Drain Magn',
		'boost':{'base':10,'stat':['bonus','drain','magn'],},
		'description':"Affect how much mana is drained from enemy.",
		},	
	'drain-chance':{
		'icon':'status.drain',
		'name':'Drain Chance',
		'boost':{'base':1,'stat':['bonus','drain','chance'],},
		'description':"Affect chance to drain enemy.",
		},	
	'knock-time':{
		'icon':'status.knock',
		'name':'Knock Time',
		'boost':{'base':25,'stat':['bonus','knock','time'],},
		'description':"Affect how long the enemy will be pushed back.",
		},
	'knock-magn':{
		'icon':'status.knock',
		'name':'Knock Magn',
		'boost':{'base':10,'stat':['bonus','knock','magn'],},
		'description':"Affect how far away the enemy will be pushed.",
		},	
	'knock-chance':{
		'icon':'status.knock',
		'name':'Knock Chance',
		'boost':{'base':1,'stat':['bonus','knock','chance'],},
		'description':"Affect chance to push enemy with your attack.",
		},	
	
	'resist-burn':{
		'icon':'status.burn',
		'name':'Burn Resist',
		'boost':{'stat':['status','burn','resist'],},
		'description':"",
		},	
	'resist-chill':{
		'icon':'status.chill',
		'name':'Chill Resist',
		'boost':{'stat':['status','chill','resist'],},
		'description':"",
		},	
	'resist-drain':{
		'icon':'status.drain',
		'name':'Drain Resist',
		'boost':{'stat':['status','drain','resist'],},
		'description':"",
		},	
	'resist-stun':{
		'icon':'status.stun',
		'name':'Confuse Resist',
		'boost':{'stat':['status','stun','resist'],},
		'description':"",
		},	
	'resist-knock':{
		'icon':'status.knock',
		'name':'Knock Resist',
		'boost':{'stat':['status','knock','resist'],},
		'description':"",
		},	
	'resist-bleed':{
		'icon':'status.bleed',
		'name':'Bleed Resist',
		'boost':{'stat':['status','bleed','resist'],},
		'description':"",
		},	
	
	//}	
		
	//{Skill
	'exp-melee':{
		'icon':'skill.melee',
		'name':'Melee Exp',
		'boost':{'base':1,'stat':['bonus','exp','melee'],},
		'playerOnly':1,
		'description':"",
		},
	'exp-range':{
		'icon':'skill.range',
		'name':'Range Exp',
		'boost':{'base':1,'stat':['bonus','exp','range'],},
		'playerOnly':1,
		'description':"",
		},
	'exp-magic':{
		'icon':'skill.magic',
		'name':'Magic Exp',
		'boost':{'base':1,'stat':['bonus','exp','magic'],},
		'playerOnly':1,
		'description':"",
		},
	'exp-metalwork':{
		'icon':'skill.metalwork',
		'name':'Metalwork Exp',
		'boost':{'base':1,'stat':['bonus','exp','metalwork'],},
		'playerOnly':1,
		'description':"",
		},
	'exp-woodwork':{
		'icon':'skill.woodwork',
		'name':'Woodwork Exp',
		'boost':{'base':1,'stat':['bonus','exp','woodwork'],},
		'playerOnly':1,
		'description':"",
		},
	'exp-leatherwork':{
		'icon':'skill.leatherwork',
		'name':'Leatherwork Exp',
		'boost':{'base':1,'stat':['bonus','exp','leatherwork'],},
		'playerOnly':1,
		'description':"",
		},
	'exp-geology':{
		'icon':'skill.geology',
		'name':'Geology Exp',
		'boost':{'base':1,'stat':['bonus','exp','geology'],},
		'playerOnly':1,
		'description':"",
		},
	'exp-metallurgy':{
		'icon':'skill.metallurgy',
		'name':'Metallurgy Exp',
		'boost':{'base':1,'stat':['bonus','exp','metallurgy'],},
		'playerOnly':1,
		'description':"",
		},	
	'exp-trapping':{
		'icon':'skill.trapping',
		'name':'Trapping Exp',
		'boost':{'base':1,'stat':['bonus','exp','trapping'],},
		'playerOnly':1,
		'description':"",
		},
	//}

	//{Def
	'globalDef':{
		'icon':'element.melee',
		'name':'Main Defense',
		'boost':{'base':1,'stat':['globalDef'],},
		'description':"Reduce Damage Taken from all elements.",
		},
	'def-melee-+':{
		'icon':'element.melee',
		'name':'Def Melee +',
		'boost':{'stat':['mastery','def','melee','+'],},
		'playerOnly':1,
		'description':"Reduce Melee Damage Taken",
		},	
	'def-melee-*':{
		'icon':'element.melee',
		'name':'Def Melee *',
		'boost':{'base':1,'stat':['mastery','def','melee','*'],},
		'playerOnly':1,
		'description':"Reduce Melee Damage Taken",
		},
	'def-melee-^':{
		'icon':'element.melee',
		'name':'Def Melee ^',
		'boost':{'base':1,'stat':['mastery','def','melee','^'],},
		'playerOnly':1,
		'description':"Reduce Melee Damage Taken",
		},
	'def-melee-x':{
		'icon':'element.melee',
		'name':'Def Melee x',
		'boost':{'base':1,'stat':['mastery','def','melee','x'],},
		'playerOnly':1,
		'description':"Reduce Melee Damage Taken",
		},
	'def-melee-mod':{
		'icon':'element.melee',
		'name':'Def Melee Mod',
		'boost':{'base':1,'stat':['mastery','def','melee','mod'],},
		'description':"Reduce Melee Damage Taken",
		},		
	'def-range-+':{
		'icon':'element.range',
		'name':'Def Range +',
		'boost':{'stat':['mastery','def','range','+'],},
		'playerOnly':1,
		'description':"Reduce Range Damage Taken",
		},	
	'def-range-*':{
		'icon':'element.range',
		'name':'Def Range *',
		'boost':{'base':1,'stat':['mastery','def','range','*'],},
		'playerOnly':1,
		'description':"Reduce Range Damage Taken",
		},
	'def-range-^':{
		'icon':'element.range',
		'name':'Def Range ^',
		'boost':{'base':1,'stat':['mastery','def','range','^'],},
		'playerOnly':1,
		'description':"Reduce Range Damage Taken",
		},
	'def-range-x':{
		'icon':'element.range',
		'name':'Def Range x',
		'boost':{'base':1,'stat':['mastery','def','range','x'],},
		'playerOnly':1,
		'description':"Reduce Range Damage Taken",
		},
	'def-range-mod':{
		'icon':'element.melee',
		'name':'Def Melee Mod',
		'boost':{'base':1,'stat':['mastery','def','melee','mod'],},
		'description':"Reduce Range Damage Taken",
		},
	'def-magic-+':{
		'icon':'element.magic',
		'name':'Def Magic +',
		'boost':{'stat':['mastery','def','magic','+'],},
		'playerOnly':1,
		'description':"Reduce Magic Damage Taken",
		},	
	'def-magic-*':{
		'icon':'element.magic',
		'name':'Def Magic *',
		'boost':{'base':1,'stat':['mastery','def','magic','*'],},
		'playerOnly':1,
		'description':"Reduce Magic Damage Taken",
		},
	'def-magic-^':{
		'icon':'element.magic',
		'name':'Def Magic ^',
		'boost':{'base':1,'stat':['mastery','def','magic','^'],},
		'playerOnly':1,
		'description':"Reduce Magic Damage Taken",
		},
	'def-magic-x':{
		'icon':'element.magic',
		'name':'Def Magic x',
		'boost':{'base':1,'stat':['mastery','def','magic','x'],},
		'playerOnly':1,
		'description':"Reduce Magic Damage Taken",
		},
	'def-magic-mod':{
		'icon':'element.magic',
		'name':'Def Magic x',
		'boost':{'base':1,'stat':['mastery','def','magic','mod'],},
		'description':"Reduce Magic Damage Taken",
		},	
	'def-fire-+':{
		'icon':'element.fire',
		'name':'Def Fire +',
		'boost':{'stat':['mastery','def','fire','+'],},
		'playerOnly':1,
		'description':"Reduce Fire Damage Taken",
		},	
	'def-fire-*':{
		'icon':'element.fire',
		'name':'Def Fire *',
		'boost':{'base':1,'stat':['mastery','def','fire','*'],},
		'playerOnly':1,
		'description':"Reduce Fire Damage Taken",
		},
	'def-fire-^':{
		'icon':'element.fire',
		'name':'Def Fire ^',
		'boost':{'base':1,'stat':['mastery','def','fire','^'],},
		'playerOnly':1,
		'description':"Reduce Fire Damage Taken",
		},
	'def-fire-x':{
		'icon':'element.fire',
		'name':'Def Fire x',
		'boost':{'base':1,'stat':['mastery','def','fire','x'],},
		'playerOnly':1,
		'description':"Reduce Fire Damage Taken",
		},
	'def-fire-mod':{
		'icon':'element.fire',
		'name':'Def Fire Mod',
		'boost':{'base':1,'stat':['mastery','def','fire','mod'],},
		'description':"Reduce Fire Damage Taken",
		},		
	'def-cold-+':{
		'icon':'element.cold',
		'name':'Def Cold +',
		'boost':{'stat':['mastery','def','cold','+'],},
		'playerOnly':1,
		'description':"Reduce Cold Damage Taken",
		},	
	'def-cold-*':{
		'icon':'element.cold',
		'name':'Def Cold *',
		'boost':{'base':1,'stat':['mastery','def','cold','*'],},
		'playerOnly':1,
		'description':"Reduce Cold Damage Taken",
		},
	'def-cold-^':{
		'icon':'element.cold',
		'name':'Def Cold ^',
		'boost':{'base':1,'stat':['mastery','def','cold','^'],},
		'playerOnly':1,
		'description':"Reduce Cold Damage Taken",
		},
	'def-cold-x':{
		'icon':'element.cold',
		'name':'Def Cold x',
		'boost':{'base':1,'stat':['mastery','def','cold','x'],},
		'playerOnly':1,
		'description':"Reduce Cold Damage Taken",
		},
	'def-cold-mod':{
		'icon':'element.cold',
		'name':'Def Cold Mod',
		'boost':{'base':1,'stat':['mastery','def','cold','mod'],},
		'description':"Reduce Cold Damage Taken",
		},		
	'def-lightning-+':{
		'icon':'element.lightning',
		'name':'Def Lightning +',
		'boost':{'stat':['mastery','def','lightning','+'],},
		'playerOnly':1,
		'description':"Reduce Lightning Damage Taken",
		},	
	'def-lightning-*':{
		'icon':'element.lightning',
		'name':'Def Lightning *',
		'boost':{'base':1,'stat':['mastery','def','lightning','*'],},
		'playerOnly':1,
		'description':"Reduce Lightning Damage Taken",
		},
	'def-lightning-^':{
		'icon':'element.lightning',
		'name':'Def Lightning ^',
		'boost':{'base':1,'stat':['mastery','def','lightning','^'],},
		'playerOnly':1,
		'description':"Reduce Lightning Damage Taken",
		},
	'def-lightning-x':{
		'icon':'element.lightning',
		'name':'Def Lightning x',
		'boost':{'base':1,'stat':['mastery','def','lightning','x'],},
		'playerOnly':1,
		'description':"Reduce Lightning Damage Taken",
		},
	'def-lightning-mod':{
		'icon':'element.lightning',
		'name':'Def Lightning Mod',
		'boost':{'base':1,'stat':['mastery','def','lightning','mod'],},
		'description':"Reduce Lightning Damage Taken",
		},		
	//}
	
	//{Dmg
	'globalDmg':{
		'icon':'element.melee',
		'name':'Main Damage',
		'boost':{'base':1,'stat':['globalDmg'],},
		'description':"Increase Damage Dealt for all elements.",
		},
	'dmg-melee-+':{
		'icon':'element.melee',
		'name':'Dmg Melee +',
		'boost':{'stat':['mastery','dmg','melee','+'],},
		'playerOnly':1,
		'description':"Increase Melee Damage Dealt",
		},	
	'dmg-melee-*':{
		'icon':'element.melee',
		'name':'Dmg Melee *',
		'boost':{'base':1,'stat':['mastery','dmg','melee','*'],},
		'playerOnly':1,
		'description':"Increase Melee Damage Dealt",
		},
	'dmg-melee-^':{
		'icon':'element.melee',
		'name':'Dmg Melee ^',
		'boost':{'base':1,'stat':['mastery','dmg','melee','^'],},
		'playerOnly':1,
		'description':"Increase Melee Damage Dealt",
		},
	'dmg-melee-x':{
		'icon':'element.melee',
		'name':'Dmg Melee x',
		'boost':{'base':1,'stat':['mastery','dmg','melee','x'],},
		'playerOnly':1,
		'description':"Increase Melee Damage Dealt",
		},
	'dmg-melee-mod':{
		'icon':'element.melee',
		'name':'Dmg Melee Mod',
		'boost':{'base':1,'stat':['mastery','dmg','melee','mod'],},
		'description':"Increase Melee Damage Dealt",
		},		
	'dmg-range-+':{
		'icon':'element.range',
		'name':'Dmg Range +',
		'boost':{'stat':['mastery','dmg','range','+'],},
		'playerOnly':1,
		'description':"Increase Range Damage Dealt",
		},	
	'dmg-range-*':{
		'icon':'element.range',
		'name':'Dmg Range *',
		'boost':{'base':1,'stat':['mastery','dmg','range','*'],},
		'playerOnly':1,
		'description':"Increase Range Damage Dealt",
		},
	'dmg-range-^':{
		'icon':'element.range',
		'name':'Dmg Range ^',
		'boost':{'base':1,'stat':['mastery','dmg','range','^'],},
		'playerOnly':1,
		'description':"Increase Range Damage Dealt",
		},
	'dmg-range-x':{
		'icon':'element.range',
		'name':'Dmg Range x',
		'boost':{'base':1,'stat':['mastery','dmg','range','x'],},
		'playerOnly':1,
		'description':"Increase Range Damage Dealt",
		},
	'dmg-range-mod':{
		'icon':'element.melee',
		'name':'Dmg Melee Mod',
		'boost':{'base':1,'stat':['mastery','dmg','melee','mod'],},
		'description':"Increase Range Damage Dealt",
		},
	'dmg-magic-+':{
		'icon':'element.magic',
		'name':'Dmg Magic +',
		'boost':{'stat':['mastery','dmg','magic','+'],},
		'playerOnly':1,
		'description':"Increase Magic Damage Dealt",
		},	
	'dmg-magic-*':{
		'icon':'element.magic',
		'name':'Dmg Magic *',
		'boost':{'base':1,'stat':['mastery','dmg','magic','*'],},
		'playerOnly':1,
		'description':"Increase Magic Damage Dealt",
		},
	'dmg-magic-^':{
		'icon':'element.magic',
		'name':'Dmg Magic ^',
		'boost':{'base':1,'stat':['mastery','dmg','magic','^'],},
		'playerOnly':1,
		'description':"Increase Magic Damage Dealt",
		},
	'dmg-magic-x':{
		'icon':'element.magic',
		'name':'Dmg Magic x',
		'boost':{'base':1,'stat':['mastery','dmg','magic','x'],},
		'playerOnly':1,
		'description':"Increase Magic Damage Dealt",
		},
	'dmg-magic-mod':{
		'icon':'element.magic',
		'name':'Dmg Magic x',
		'boost':{'base':1,'stat':['mastery','dmg','magic','mod'],},
		'description':"Increase Magic Damage Dealt",
		},	
	'dmg-fire-+':{
		'icon':'element.fire',
		'name':'Dmg Fire +',
		'boost':{'stat':['mastery','dmg','fire','+'],},
		'playerOnly':1,
		'description':"Increase Fire Damage Dealt",
		},	
	'dmg-fire-*':{
		'icon':'element.fire',
		'name':'Dmg Fire *',
		'boost':{'base':1,'stat':['mastery','dmg','fire','*'],},
		'playerOnly':1,
		'description':"Increase Fire Damage Dealt",
		},
	'dmg-fire-^':{
		'icon':'element.fire',
		'name':'Dmg Fire ^',
		'boost':{'base':1,'stat':['mastery','dmg','fire','^'],},
		'playerOnly':1,
		'description':"Increase Fire Damage Dealt",
		},
	'dmg-fire-x':{
		'icon':'element.fire',
		'name':'Dmg Fire x',
		'boost':{'base':1,'stat':['mastery','dmg','fire','x'],},
		'playerOnly':1,
		'description':"Increase Fire Damage Dealt",
		},
	'dmg-fire-mod':{
		'icon':'element.fire',
		'name':'Dmg Fire Mod',
		'boost':{'base':1,'stat':['mastery','dmg','fire','mod'],},
		'description':"Increase Fire Damage Dealt",
		},		
	'dmg-cold-+':{
		'icon':'element.cold',
		'name':'Dmg Cold +',
		'boost':{'stat':['mastery','dmg','cold','+'],},
		'playerOnly':1,
		'description':"Increase Cold Damage Dealt",
		},	
	'dmg-cold-*':{
		'icon':'element.cold',
		'name':'Dmg Cold *',
		'boost':{'base':1,'stat':['mastery','dmg','cold','*'],},
		'playerOnly':1,
		'description':"Increase Cold Damage Dealt",
		},
	'dmg-cold-^':{
		'icon':'element.cold',
		'name':'Dmg Cold ^',
		'boost':{'base':1,'stat':['mastery','dmg','cold','^'],},
		'playerOnly':1,
		'description':"Increase Cold Damage Dealt",
		},
	'dmg-cold-x':{
		'icon':'element.cold',
		'name':'Dmg Cold x',
		'boost':{'base':1,'stat':['mastery','dmg','cold','x'],},
		'playerOnly':1,
		'description':"Increase Cold Damage Dealt",
		},
	'dmg-cold-mod':{
		'icon':'element.cold',
		'name':'Dmg Cold Mod',
		'boost':{'base':1,'stat':['mastery','dmg','cold','mod'],},
		'description':"Increase Cold Damage Dealt",
		},		
	'dmg-lightning-+':{
		'icon':'element.lightning',
		'name':'Dmg Lightning +',
		'boost':{'stat':['mastery','dmg','lightning','+'],},
		'playerOnly':1,
		'description':"Increase Lightning Damage Dealt",
		},	
	'dmg-lightning-*':{
		'icon':'element.lightning',
		'name':'Dmg Lightning *',
		'boost':{'base':1,'stat':['mastery','dmg','lightning','*'],},
		'playerOnly':1,
		'description':"Increase Lightning Damage Dealt",
		},
	'dmg-lightning-^':{
		'icon':'element.lightning',
		'name':'Dmg Lightning ^',
		'boost':{'base':1,'stat':['mastery','dmg','lightning','^'],},
		'playerOnly':1,
		'description':"Increase Lightning Damage Dealt",
		},
	'dmg-lightning-x':{
		'icon':'element.lightning',
		'name':'Dmg Lightning x',
		'boost':{'base':1,'stat':['mastery','dmg','lightning','x'],},
		'playerOnly':1,
		'description':"Increase Lightning Damage Dealt",
		},
	'dmg-lightning-mod':{
		'icon':'element.lightning',
		'name':'Dmg Lightning Mod',
		'boost':{'base':1,'stat':['mastery','dmg','lightning','mod'],},
		'description':"Increase Lightning Damage Dealt",
		},		
	//}
	
	//{Weapon
	'weapon-mace':{
		'icon':'melee.mace',
		'name':'Dmg Mace',
		'boost':{'stat':['bonus','weapon','mace'],},
		'playerOnly':1,	
		'description':"Increase Damage Dealt with Mace",
		},			
	'weapon-spear':{
		'icon':'melee.spear',
		'name':'Dmg Spear',
		'boost':{'stat':['bonus','weapon','spear'],},
		'playerOnly':1,	
		'description':"Increase Damage Dealt with Spear",
		},	
	'weapon-sword':{
		'icon':'melee.sword',
		'name':'Dmg Sword',
		'boost':{'stat':['bonus','weapon','sword'],},
		'playerOnly':1,	
		'description':"Increase Damage Dealt with Sword",
		},	
	'weapon-bow':{
		'icon':'range.bow',
		'name':'Dmg Bow',
		'boost':{'stat':['bonus','weapon','bow'],},
		'playerOnly':1,	
		'description':"Increase Damage Dealt with Bow",
		},			
	'weapon-boomerang':{
		'icon':'range.boomerang',
		'name':'Dmg Boomerang',
		'boost':{'stat':['bonus','weapon','boomerang'],},
		'playerOnly':1,	
		'description':"Increase Damage Dealt with Boomerang",
		},	
	'weapon-crossbow':{
		'icon':'range.crossbow',
		'name':'Dmg Crossbow',
		'boost':{'stat':['bonus','weapon','crossbow'],},
		'playerOnly':1,
		'description':"Increase Damage Dealt with Crossbow",
		},		
	'weapon-wand':{	
		'icon':'magic.wand',
		'name':'Dmg Wand',
		'boost':{'stat':['bonus','weapon','wand'],},
		'playerOnly':1,	
		'description':"Increase Damage Dealt with Wand",
		},			
	'weapon-staff':{
		'icon':'magic.staff',
		'name':'Dmg Staff',
		'boost':{'stat':['bonus','weapon','staff'],},
		'playerOnly':1,	
		'description':"Increase Damage Dealt with Staff",
		},	
	'weapon-orb':{
		'icon':'magic.orb',
		'name':'Dmg Orb',
		'boost':{'stat':['bonus','weapon','orb'],},
		'playerOnly':1,	
		'description':"Increase Damage Dealt with Orb",
		},
	//}
	
	//{Summon
	'summon-amount':{
		'icon':'summon.wolf',
		'name':'Summon Amount',
		'boost':{'base':1,'stat':['bonus','summon','amount'],},
		'playerOnly':1,	
		'description':"Affect how many summons you can have at once.",
		},
	'summon-time':{
		'icon':'summon.wolf',
		'name':'Summon Time',
		'boost':{'base':1,'stat':['bonus','summon','time'],},
		'playerOnly':1,	
		'description':"Affect how long your summons last.",
		},
	'summon-atk':{
		'icon':'summon.wolf',
		'name':'Summon Atk',
		'boost':{'base':1,'stat':['bonus','summon','atk'],},
		'playerOnly':1,	
		'description':"Affect the overall damage of your summons.",
		},
	'summon-def':{
		'icon':'summon.wolf',
		'name':'Summon Def',
		'boost':{'base':1,'stat':['bonus','summon','def'],},
		'playerOnly':1,	
		'description':"Affect the overall defence of your summons.",
		},
	//}


}
	
	for(var i in Db.stat){
		Db.stat[i].description = Db.stat[i].description || Db.stat[i].name;
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
	//generate bonus attribute for Actor
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
	//generate boost attribute for Actor
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

