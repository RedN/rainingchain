//Enemy

/*
scaling is done with globalDef and globalDmg
weapon is always same
"equip":{'def':{ is only used for ratio


ideally:
enemy.mainDef * ratio = player.equip.def
enemy.mainDmg = player.weapon

*/


Init.db.enemy = function(){ var ePreDb = {};

	
	ePreDb["troll"] = {}; //{
	ePreDb["troll"]["ice"] = {  //{
		"name":"Ice Troll",
		"sprite":{'name':"eTroll",'sizeMod':1},
		"ability":{'bulletSingle':0.5},
		'resource':{'hp':{'max':1000,'regen':1},'mana':{'max':100,'regen':1}},
		
		'globalDef':10,
		'globalDmg':10,
		"equip":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		
		"acc":2,
		"maxSpd":5,
		"moveRange":{'ideal':200,"confort":50,"aggressive":400,"farthest":600},	
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

	
	//Turn Object into function
	Db.enemy = {};
	for(var i in ePreDb){ Db.enemy[i] = {}; 
		for(var j in ePreDb[i]){
			var e = ePreDb[i][j];
			
			e = useTemplate(Actor.template('enemy'),e);
			
			e.context = e.name; 
			if(e.combat && !e.nevercombat){ 
				e.context += ' | Lvl: ' + e.lvl;
			}
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






