//Enemy

Init.db.enemy = function(){ var ePreDb = {};

	ePreDb["eSlime"] = {}; //{
	ePreDb["eSlime"]["Big"] = { //{
		"name":"eSlime",
		"sprite":{'name':"eSlime",'sizeMod':0.7},
		"ability":{'bulletSingle':0.5},
		"weapon":{'dmgMain':1,'dmgRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'resource':{'hp':{'max':12,'regen':0},'mana':{'max':123,'regen':12}},
		'armorMain':1,
		"equip":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		"acc":2,
		"maxSpd":5,
	    "moveRange":{'ideal':200,"confort":100,"aggressive":300,"farthest":600},	
		'drop':{'mod':{'quantity':1,'quality':1,'rarity':1},'category':['regular','plan']},
	}; //}
	//}
	
	ePreDb["troll"] = {}; //{
	ePreDb["troll"]["ice"] = {  //{
		"name":"Boss",
		"sprite":{'name':"eTroll",'sizeMod':1},
		"ability":{'bulletSingle':0.5},
		"weapon":{'dmgMain':1,'dmgRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'resource':{'hp':{'max':12,'regen':0},'mana':{'max':123,'regen':12}},
		'armorMain':1,
		"equip":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		"acc":2,
		"maxSpd":5,
		"moveRange":{'ideal':200,"confort":50,"aggressive":400,"farthest":600},	
		'drop':{'mod':{'quantity':1,'quality':1,'rarity':1},'category':['regular','plan']},
	}; //}
	//}
	
	ePreDb["boss"] = {}; //{
	ePreDb["boss"]["iceTroll"] = {  //{
		"name":"Boss",
		"sprite":{'name':"eTroll",'sizeMod':1},
		"ability":{},
		"weapon":{'dmgMain':1,'dmgRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'resource':{'hp':{'max':12,'regen':0},'mana':{'max':123,'regen':12}},
		'armorMain':1,
		"equip":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		"acc":2,
		"maxSpd":10,
		'boss':'iceTroll',
		"moveRange":{'ideal':400,"confort":100,"aggressive":300,"farthest":600},
		'drop':{'mod':{'quantity':1,'quality':1,'rarity':1},'category':['regular','plan']},
	}; //}
	//}
	
	
	
	
	
	ePreDb["bossMinion"] = {}; //{
	ePreDb["bossMinion"]["goddess"] = {  //{
		"name":"Boss",
		"sprite":{'name':"eSlime",'sizeMod':0.7},
		"ability":{'bullet360':0.5},
		"weapon":{'dmgMain':1,'dmgRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'resource':{'hp':{'max':12,'regen':0},'mana':{'max':123,'regen':12}},
		'armorMain':1,
		"equip":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		"acc":2,
		"maxSpd":10,
		"moveRange":{'ideal':150,"confort":50,"aggressive":400,"farthest":600},	
		'drop':{'mod':{'quantity':1,'quality':1,'rarity':1},'category':['regular','plan']},
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
			
			var temp = Mortal.template('enemy');
			var e = ePreDb[i][j];
			e = useTemplate(temp,e);
			
			e.context = e.name; 
			if(e.combat && !e.nevercombat){ e.context += ' | Lvl: ' + e.lvl;}
			e.hp = e.resource.hp.max;
			
			Db.enemy[i][j] = new Function('return ' + stringify(e));	//not used atm. currently creating from scratch everytime
		}
	}
	
}
//







