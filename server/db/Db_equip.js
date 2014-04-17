//Armor

//Exact same system than Weapon.js
Db.equip = {};
Init.db.equip = function (cb){
	var pre = Db.equip;
	db.find('equip',{},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results)	pre[results[i].id] = Equip.uncompress(results[i]);
			
	pre['unarmed'] = {		//DONT TOUCH
		'piece': 'melee','type': 'mace','icon':'melee.mace',
		'name':"Mace",'sprite':{'name':"mace",'sizeMod':1},
		'dmg':{'main':1,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
	};					//DONT TOUCH
	
	
	pre['metalbody'] = {'name':"Hello Kitty",'piece':'body','type':'metal','icon':'body.metal',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['metalhelm'] = {'name':"Hello Kitty",'piece':'helm','type':'metal','icon':'helm.metal',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['metalshield'] = {'name':"Hello Kitty",'piece':'shield','type':'metal','icon':'shield.metal',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
		
	
	pre['woodbody'] = {'name':"Hello Kitty",'piece':'body','type':'wood','icon':'body.wood',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['woodhelm'] = {'name':"Hello Kitty",'piece':'helm','type':'wood','icon':'helm.wood',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['woodshield'] = {'name':"Hello Kitty",'piece':'shield','type':'wood','icon':'shield.wood',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['bonebody'] = {'name':"Hello Kitty",'piece':'body','type':'bone','icon':'body.bone',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['bonehelm'] = {'name':"Hello Kitty",'piece':'helm','type':'bone','icon':'helm.bone',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['boneshield'] = {'name':"Hello Kitty",'piece':'shield','type':'bone','icon':'shield.bone',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}


	//
	
	pre['bracelet'] = {'name':"Hello Kitty",'piece':'bracelet','type':'ruby','icon':'bracelet.ruby',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['amulet'] = {'name':"Hello Kitty",'piece':'amulet','type':'ruby','icon':'amulet.ruby',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['gloves'] = {'name':"Hello Kitty",'piece':'gloves','type':'chain','icon':'gloves.chain',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['boots'] = {'name':"Hello Kitty",'piece':'boots','type':'chain','icon':'boots.chain',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['pants'] = {'name':"Hello Kitty",'piece':'pants','type':'chain','icon':'pants.chain',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['ring'] = {'name':"Hello Kitty",'piece':'ring','type':'ruby','icon':'ring.ruby',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	//Add the default Weapons to the PreDb List
	pre['summonWand'] = {
		'piece': 'magic','type':'wand','icon':'magic.wand',
		'name':"Summon Wand",'sprite':{'name':"pWand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost': [
		
		],
	}
	
	
	
	
	
	pre['mace'] = {
		'piece': 'melee','type': 'mace','icon':'melee.mace',
		'name':"Mace",'sprite':{'name':"mace",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost': [		
			
		],

	}
	



	pre['spear'] = {
		'piece': 'melee','type': 'spear','icon': 'melee.spear',
		'name':"Spear",'sprite':{'name':"spear",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost': [],

	}
	
	pre['sword'] = {
		'piece': 'melee','type': 'sword','icon': 'melee.sword',
		'name':"Sword",'sprite':{'name':"sword",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost': [],

	}
		
	pre['bow'] = {
		'piece': 'range','type': 'bow','icon': 'range.bow',
		'name':"Bow",'sprite':{'name':"bow",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],

	}
	
	pre['boomerang'] = {
		'piece': 'range','type': 'boomerang','icon': 'range.boomerang',
		'name':"Boomerang", 'sprite':{'name':"bow",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[	
		
		],

	}
	
	pre['crossbow'] = {
		'piece': 'range','type': 'crossbow','icon': 'range.crossbow',
		'name':"Crossbow", 'sprite':{'name':"bow",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}
	
	pre['wand'] = {
		'piece': 'magic','type': 'wand','icon': 'magic.wand',
		'name':"Wand", 'sprite':{'name':"wand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}
	
	pre['staff'] = {
		'piece': 'magic','type': 'staff','icon': 'magic.staff',
		'name':"Staff", 'sprite':{'name':"wand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}

	pre['orb'] = {
		'piece': 'magic','type': 'orb','icon': 'magic.orb',
		'name':"Orb", 'type': 'orb','sprite':{'name':"wand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}
	
	pre['goddess'] = {
		'piece': 'magic','type': 'orb','icon': 'magic.orb',
		'name':"Wand", 'type': 'staff','sprite':{'name':"wand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
			
	}
	
	//OPENBETA
	/*
Db.equip["t9yo85o22"] = {"name":"Mace","piece":"melee","type":"mace","icon":"melee.mace","lvl":0,"def":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"dmg":{"main":10.635595831554383,"ratio":{"melee":0.3187536684484203,"range":0,"magic":0,"fire":0.17736547563881472,"cold":0.398906150525558,"lightning":0.10497470538720695}},"boost":[{"stat":"dmg-range-^","type":"base","value":0.012483957179356367,"tier":0.9967914358712733}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"blue","salvagable":1,"plan":{"piece":"melee","type":"mace","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"9zj6qbtw6","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":1,"cap":1},"req":{"melee":0},"id":"t9yo85o22","sprite":{"name":"mace","sizeMod":1},"category":"weapon"};
Db.equip["24fvltcng"] = {"name":"Bow","piece":"range","type":"bow","icon":"range.bow","lvl":0,"def":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"dmg":{"main":9.813436146825552,"ratio":{"melee":0.0013469449471722494,"range":0.9330138487527695,"magic":0,"fire":0,"cold":0.01592038497845811,"lightning":0.049718821321600104}},"boost":[{"stat":"bullet-amount","type":"base","value":0.011811888657975942,"tier":0.8623777315951884}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"blue","salvagable":1,"plan":{"piece":"range","type":"bow","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"s2x3bq2q9","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":1,"cap":1},"req":{"range":0},"id":"24fvltcng","sprite":{"name":"bow","sizeMod":1},"category":"weapon"};
Db.equip["ipw6bxde4"] = {"name":"Staff","piece":"magic","type":"staff","icon":"magic.staff","lvl":0,"def":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"dmg":{"main":9.447079943493009,"ratio":{"melee":0.0002606675478748475,"range":0,"magic":0.2153208117430615,"fire":0.2771798434598971,"cold":0.28608387717357103,"lightning":0.22115480007559546}},"boost":[{"stat":"strike-size","type":"base","value":0.09246989369858057,"tier":0.34939787397161115},{"stat":"strike-maxHit","type":"base","value":0.10513631904032082,"tier":0.6027263808064164},{"stat":"dmg-range-+","type":"base","value":0.011661418032599614,"tier":0.8322836065199226},{"stat":"dmg-magic-x","type":"base","value":0.010364265121752397,"tier":0.5728530243504794},{"stat":"dmg-cold-+","type":"base","value":0.011427031783387064,"tier":0.7854063566774128}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"yellow","salvagable":1,"plan":{"piece":"magic","type":"staff","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"lzq65gcut","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":5,"cap":1},"req":{"magic":0},"id":"ipw6bxde4","sprite":{"name":"wand","sizeMod":1},"category":"weapon"};
Db.equip["kc3fy1ltl"] = {"name":"Ruby","piece":"amulet","type":"ruby","icon":"amulet.ruby","lvl":0,"def":{"main":0.3555574203640515,"ratio":{"melee":0.09544241817200799,"range":0.061503665060619,"magic":0.05703339967371532,"fire":0.5177631361654597,"cold":0.1355073120321913,"lightning":0.1327500688960067}},"dmg":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"boost":[{"stat":"dmg-fire-+","type":"base","value":0.021146188979037105,"tier":0.6146188979037104}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"blue","salvagable":1,"plan":{"piece":"amulet","type":"ruby","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"d7uurnr5b","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":1,"cap":1},"req":{"melee":0},"id":"kc3fy1ltl","category":"armor"};
Db.equip["w74kcmoxj"] = {"name":"Bone","piece":"helm","type":"bone","icon":"helm.bone","lvl":0,"def":{"main":1.5892811794765294,"ratio":{"melee":0.1254105499120724,"range":0.15825115366745354,"magic":0.45080293874237815,"fire":0.08449910410591562,"cold":0.09231956170690513,"lightning":0.0887166918652752}},"dmg":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"boost":[{"stat":"mana-regen","type":"base","value":0.008501163891050965,"tier":0.20023277821019297},{"stat":"def-melee-+","type":"base","value":0.023754225806333126,"tier":0.8754225806333125},{"stat":"mana-max","type":"base","value":1.0372180180856958,"tier":0.5744360361713916}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"yellow","salvagable":1,"plan":{"piece":"helm","type":"bone","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"a7mxqsjui","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":3,"cap":1},"req":{"magic":0},"id":"w74kcmoxj","category":"armor"};
Db.equip["xnpno7719"] = {"name":"Topaz","piece":"ring","type":"topaz","icon":"ring.topaz","lvl":0,"def":{"main":0.21517113516764608,"ratio":{"melee":0.05892182481873827,"range":0.0927357521353658,"magic":0.05564546016871699,"fire":0.12161835105701385,"cold":0.11963402330146482,"lightning":0.5514445885187003}},"dmg":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"boost":[{"stat":"stun-magn","type":"base","value":0.016773575742263347,"tier":0.17735757422633472},{"stat":"dmg-lightning-+","type":"base","value":0.019077794787008315,"tier":0.4077794787008315},{"stat":"dmg-range-+","type":"base","value":0.015304363993927836,"tier":0.0304363993927836},{"stat":"stun-chance","type":"base","value":0.011075096225831658,"tier":0.7150192451663316}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"yellow","salvagable":1,"plan":{"piece":"ring","type":"topaz","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"7bkgwpnbl","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":4,"cap":1},"req":{"magic":0},"id":"xnpno7719","category":"armor"};
Db.equip["5lzcbznld"] = {"name":"Hide","piece":"gloves","type":"hide","icon":"gloves.hide","lvl":0,"def":{"main":0.830578448579592,"ratio":{"melee":0.138134695964759,"range":0.11565061834467094,"magic":0.38727726504616816,"fire":0.14173197073002727,"cold":0.0899053369533558,"lightning":0.12730011296101873}},"dmg":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"boost":[{"stat":"def-fire-+","type":"base","value":0.01937852664384991,"tier":0.43785266438499104},{"stat":"dmg-magic-+","type":"base","value":0.01848660215269774,"tier":0.3486602152697741}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"blue","salvagable":1,"plan":{"piece":"gloves","type":"hide","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"c10ztwd15","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":2,"cap":1},"req":{"magic":0},"id":"5lzcbznld","category":"armor"};
Db.equip["ub12yl35d"] = {"name":"Bone","piece":"body","type":"bone","icon":"body.bone","lvl":0,"def":{"main":2.511265480379556,"ratio":{"melee":0.14200498533077577,"range":0.11849866367615264,"magic":0.5249628951051081,"fire":0.0840153657015971,"cold":0.0678527457764457,"lightning":0.0626653444099206}},"dmg":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"boost":[{"stat":"dmg-melee-x","type":"base","value":0.01988418339751661,"tier":0.48841833975166093},{"stat":"def-fire-x","type":"base","value":0.02034184863558039,"tier":0.534184863558039}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"blue","salvagable":1,"plan":{"piece":"body","type":"bone","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"xotcs5muk","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":2,"cap":1},"req":{"magic":0},"id":"ub12yl35d","category":"armor"};
Db.equip["csb34pzva"] = {"name":"Bone","piece":"shield","type":"bone","icon":"shield.bone","lvl":0,"def":{"main":2.078228260883513,"ratio":{"melee":0.11360580889413442,"range":0.12458180890059664,"magic":0.5275753542629132,"fire":0.06984456191804177,"cold":0.07223198634110138,"lightning":0.09216047968321268}},"dmg":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"boost":[{"stat":"weapon-orb","type":"base","value":0.007609140106942505,"tier":0.021828021388500988}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"blue","salvagable":1,"plan":{"piece":"shield","type":"bone","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"y11n38vgf","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":1,"cap":1},"req":{"magic":0},"id":"csb34pzva","category":"armor"};
Db.equip["ri7qsje6y"] = {"name":"Sapphire","piece":"bracelet","type":"sapphire","icon":"bracelet.sapphire","lvl":0,"def":{"main":0.6121903890196015,"ratio":{"melee":0.08110599577505787,"range":0.06451681943038486,"magic":0.05903586639854875,"fire":0.1748429175267244,"cold":0.43725992748415876,"lightning":0.18323847338512544}},"dmg":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"boost":[{"stat":"chill-time","type":"base","value":0.01915951257105917,"tier":0.41595125710591685}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"blue","salvagable":1,"plan":{"piece":"bracelet","type":"sapphire","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"alcloyses","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":1,"cap":1},"req":{"range":0},"id":"ri7qsje6y","category":"armor"};
Db.equip["yk4w35h1k"] = {"name":"Chain","piece":"pants","type":"chain","icon":"pants.chain","lvl":0,"def":{"main":1.1556226619354943,"ratio":{"melee":0.3511296842289275,"range":0.1128618740682788,"magic":0.14189932327490812,"fire":0.1292544662960473,"cold":0.12351377824483514,"lightning":0.1413408738870031}},"dmg":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"boost":[{"stat":"summon-time","type":"base","value":0.009998104277765379,"tier":0.4996208555530758},{"stat":"summon-amount","type":"base","value":0.008827357109403237,"tier":0.2654714218806475}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"blue","salvagable":1,"plan":{"piece":"pants","type":"chain","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"kbjrtrwru","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":2,"cap":1},"req":{"melee":0},"id":"yk4w35h1k","category":"armor"};
Db.equip["qjo3fpkpf"] = {"name":"Chain","piece":"boots","type":"chain","icon":"boots.chain","lvl":0,"def":{"main":1.0498307007547543,"ratio":{"melee":0.4261973639050554,"range":0.13190215654363488,"magic":0.13320522400463947,"fire":1.0777236863238639,"cold":1.09878358096956012,"lightning":1.13218798825324624}},"dmg":{"main":0,"ratio":{"melee":0.16666666666666666,"range":0.16666666666666666,"magic":0.16666666666666666,"fire":0.16666666666666666,"cold":0.16666666666666666,"lightning":0.16666666666666666}},"boost":[{"stat":"maxSpd","type":"base","value":0.09116054247133434,"tier":0.3232108494266867},{"stat":"acc","type":"base","value":0.012182649361202494,"tier":0.9365298722404986}],"orb":{"upgrade":{"amount":0,"bonus":1},"boost":{"amount":0,"bonus":0,"history":[]}},"creator":"sam","accountBound":0,"color":"blue","salvagable":1,"plan":{"piece":"boots","type":"chain","lvl":0,"category":"equip","color":"white","icon":"plan.equip","id":"zg28xxovs","maxAmount":5,"minAmount":0,"name":"Equip Plan","quality":0,"rarity":0,"req":{"item":[],"skill":{}},"creator":"sam","amount":2,"cap":1},"req":{"melee":0},"id":"qjo3fpkpf","category":"armor"};
*/
	
	
	for(var i in pre){	
		pre[i].id = i;
		Equip.creation(pre[i]);	
	}
	
	cb.call();
	
	
}); }

Equip = {};

Equip.creation = function(equip){
	equip = useTemplate(Equip.template(),equip);
	
	equip.color = Equip.creation.color(equip);
	equip.category = Cst.isWeapon(equip.piece) ? 'weapon' : 'armor';
	
	equip.def.ratio = convertRatio(equip.def.ratio);
	equip.dmg.ratio = convertRatio(equip.dmg.ratio);

	
	Db.equip[equip.id] = equip;
	
	var item = {
		'name':equip.name,
		'icon':equip.piece + '.' + equip.type,
		'type':'equip',
		'id':equip.id,
		'option':[	
			{'name':'Examine Equip','func':'Main.examine','param':['equip',equip.id]},
			{'name':'Change Equip','func':'Actor.equip','param':[equip.id]},
		],
	};
	if(!equip.accountBound && equip.creator !== null)
		item.option.push({'name':'Account Bound','func':'Equip.accountBound','param':[equip.id]});
	if(equip.salvagable)
		item.option.push({'name':'Salvage','func':'Craft.equip.salvage','param':[equip.id]});
			
	
	Item.creation(item);
	
	db.upsert('equip',{'id':equip.id}, Equip.compress(equip), db.err);

}

Equip.creation.color = function(w){
	if(w.boost.length === 0) return 'white'; 
	if(w.boost.length <= 2) return 'blue';  
	return 'yellow';  
}

Equip.compress = function(e){
	e = deepClone(e);
	e.dmg = Equip.compress.element(e.dmg);
	e.def = Equip.compress.element(e.def);
	return e;
}

Equip.uncompress = function(e){
	e.dmg = Equip.uncompress.element(e.dmg);
	e.def = Equip.uncompress.element(e.def);
	return e;
}

Equip.compress.element = function(e){
	for(var i in e.ratio) e.ratio[i] = round(e.ratio[i],4);
	e.main = round(e.main,4);
	var r = e.ratio;
	return [e.main,r.melee,r.range,r.magic,r.fire,r.cold,r.lightning];	
}

Equip.uncompress.element = function(r){
	return {
		main:r[0],
		ratio:{
			melee:r[1],
			range:r[2],
			magic:r[3],
			fire:r[4],
			cold:r[5],
			lightning:r[6],	
		}
	}
}

//Add Default Weapon elements and init weapon
	
	
//################################################

Equip.template = function(){
	return {
		'name':"Hello Kitty",
		'piece':'pants',
		'type':'chain',
		'icon':'pants.chain',
		'lvl':0,
		'def':{'main':0,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		'dmg':{'main':0,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},		
		'boost':[],
		'orb':{'upgrade':{'amount':0,'bonus':1},'boost':{'amount':0,'bonus':0,'history':[]}},
		'creator':null,
		'accountBound':0,
		'color':'white',
		'salvagable':1,
	}
}


Equip.accountBound = function(key,eid){
	var equip = Db.equip[eid];
	
	if(equip.accountBound){	//shouldnt happen
		Chat.add(key,'This equip is already account bound.');
		return;
	}
	
	Craft.orb.boost(key,equip,1);
	
	if(equip.creator === List.all[key].username){
		for(var i in equip.boost)
			equip.boost[i].value *= 1.2;	
	}
	
	
	Item.remove(equip.id);
	Itemlist.remove(List.main[key].invList,equip.id);
	Chat.add(key,'Equip succesfully account bound.');
	equip.id = Math.randomId();
	equip.accountBound = 1;
	
	Equip.creation(equip);
	Itemlist.add(List.main[key].invList,equip.id);
	
}

/*
when account bound =>add 1 bonus
if self found => all boost become *1.2
*/
	


