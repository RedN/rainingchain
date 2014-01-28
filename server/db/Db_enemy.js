//Enemy

/*
scaling is done with globalDef and globalDmg
weapon is always same
"equip":{'def':{ is only used for ratio


ideally:
enemy.mainDef * ratio = player.equip.def
enemy.mainDmg = player.weapon

*/

/*
ePreDb["troll"]["ice"] = {  //{		//troll is category, ice is variant
	"name":"Ice Troll",				//name	
	"sprite":{						//sprite used 
		'name':"eTroll",
		'sizeMod':1
	},
	"ability":{						//ability used by enemy
		'bulletSingle':0.2,			//ability id : frequence (chance to be used)
	},
	'resource':{						
		'hp':{
			'max':1000,				//max hp
			'regen':1				//how much hp enemy regen every frame
		},
	},
	'globalDef':1,					//only thing that changes with enemy lvl is globalDef and globalDmg
	'globalDmg':function(lvl){ 		//if number, globalDef = globalDef * (lvl + 10)	#RECOMMENDED because easy balance
		return lvl + 100;			//if function, globalDef = globalDef(lvl)
	},
	
	"equip":{
		'def':{					//only used for ratio (use value between 0-1)
			'melee':1,
			'range':1,
			'magic':1,
			'fire':1,
			'cold':1,
			'lightning':1
		}
	},	
		
	"acc":2,					//acceleration
	"maxSpd":5,					//max speed
	"moveRange":{		
		'ideal':200,			//distance monster wants to be from u
		"confort":50,			//ideal range = ideal range more or less confort
		"aggressive":400,		//if player within this range, enemy will attack you
		"farthest":600			//if player farther than this range, enemy will stop following
	},	
	'drop':{
		'category':{			
			'regular':1			//drop table used : quantity modifier bonus
		}
	},
	
	
	
	//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
	//Extra
	
	'globalMod':function(e,lvl){ 	//at the end, the whole enemy can be modded depending on its lvl
		e.maxSpd = e.maxSpd + lvl; 
		return e;
	},
	
	'nevercombat':0,			//put 1 if enemy never fights
	'nevermove':0,				//put 1 if enemy never moves
	
	'boss':'iceTroll',			//id of the boss
	
	
	
};













*/


Init.db.enemy = function(){ var ePreDb = {};

	
	ePreDb["troll"] = {}; //{
	ePreDb["troll"]["ice"] = {  //{
		"name":"Ice Troll",
		"sprite":{'name':"eTroll",'sizeMod':1},
		"ability":{'bulletSingle':0.2},
		'resource':{'hp':{'max':1000,'regen':1},'mana':{'max':100,'regen':1}},
		
		'globalDef':1,
		'globalDmg':function(lvl){ return lvl + 100},
		'globalMod':function(e,lvl){ e.maxSpd = e.maxSpd + lvl;  return e;},
		
		
		
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
			
			Db.enemy[i][j] = new Function('return ' + stringify(e));
			Db.enemy[i][j].globalDmg = ePreDb[i][j].globalDmg || e.globalDmg;	//cuz can be function
			Db.enemy[i][j].globalDef = ePreDb[i][j].globalDef || e.globalDef;
			Db.enemy[i][j].globalMod = ePreDb[i][j].globalMod || e.globalMod;
			
			
		}
	}
	
}
//






