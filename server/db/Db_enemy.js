//Enemy

Init.db.enemy = function(){ var ePreDb = {};

	ePreDb["eSlime"] = {}; //{
	ePreDb["eSlime"]["Big"] = { //{
		"name":"eSlime",
		"sprite":{'name':"eSlime",'sizeMod':0.7},
		"ability":{'bulletSingle':0.1},
		"weapon":{'dmgMain':100,'dmgRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'resource':{'hp':{'max':12,'regen':0},'mana':{'max':123,'regen':12}},
		'armorMain':1,
		"equip":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		"acc":2,
		"maxSpd":5,
	    "moveRange":{'ideal':200,"confort":100,"aggressive":300,"farthest":600},	
		'drop':{'category':{'regular':1},'plan':{'melee':1/100}},
	}; //}
	//}
	
	ePreDb["troll"] = {}; //{
	ePreDb["troll"]["ice"] = {  //{
		"name":"Ice Troll",
		"sprite":{'name':"eTroll",'sizeMod':1},
		"ability":{'bulletSingle':0.1},
		"weapon":{'dmgMain':100,'dmgRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'resource':{'hp':{'max':12,'regen':0},'mana':{'max':123,'regen':12}},
		'armorMain':1,
		"equip":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		"acc":2,
		"maxSpd":5,
		"moveRange":{'ideal':200,"confort":50,"aggressive":400,"farthest":600},	
		'drop':{'category':{'regular':1}},
	}; //}
	//}
	
	ePreDb["boss"] = {}; //{
	ePreDb["boss"]["iceTroll"] = {  //{
		"name":"Boss",
		"sprite":{'name':"eTroll",'sizeMod':1},
		"ability":{},
		"weapon":{'dmgMain':100,'dmgRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'resource':{'hp':{'max':12,'regen':0},'mana':{'max':123,'regen':12}},
		'armorMain':1,
		"equip":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		"acc":2,
		"maxSpd":10,
		'boss':'iceTroll',
		"moveRange":{'ideal':400,"confort":100,"aggressive":300,"farthest":600},
		'drop':{'category':{'regular':1}},
	}; //}
	//}
	
	
	
	ePreDb["neutral"] = {}; //{
	ePreDb["neutral"]["julie"] = {  //{
		"name":"Jenny",
		"sprite":{'name':"julie",'sizeMod':1},
		'nevercombat':1,
		"acc":0.5,
		"maxSpd":3,
	}; //}
	//}
	
	ePreDb['picture'] = {}; //{
	ePreDb["picture"]["barrier"] = {  //{
		"name":"Barrier",
		"sprite":{'name':"barrier",'sizeMod':2},
		'nevermove':1,
		'nevercombat':1,
	}; //}
	//}
		
	for(var i in ePreDb){	for(var j in ePreDb[i]){
		var e = ePreDb[i][j];
		if(e.armor)	for(var k in e.armor.def) e.armor.def[k] *= e.armorMain;	
	}}
	
	
	//Turn Object into function
	Db.enemy = {};
	for(var i in ePreDb){ Db.enemy[i] = {}; 
		for(var j in ePreDb[i]){
			
			var temp = Actor.template('enemy');
			var e = ePreDb[i][j];
			e = useTemplate(temp,e);
			
			e.context = e.name; 
			if(e.combat && !e.nevercombat){ e.context += ' | Lvl: ' + e.lvl;}
			e.hp = e.resource.hp.max;
			
			if(e.drop){
				e.drop.mod = e.drop.mod || {};
				e.drop.quantity = e.drop.quantity || 1;
				e.drop.quality = e.drop.quality || 1;
				e.drop.rarity = e.drop.rarity || 1;
			}
			
			Db.enemy[i][j] = new Function('return ' + stringify(e));	//not used atm. currently creating from scratch everytime
		}
	}
	
}
//







