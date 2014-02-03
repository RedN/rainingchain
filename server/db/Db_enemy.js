//Enemy

/*
scaling is done with globalDef and globalDmg
weapon is always same
"equip":{'def':{ is only used for ratio


ideally:
enemy.mainDef * ratio = player.equip.def
enemy.mainDmg = player.Weapon

*/

/*
ePreDb["troll"]["ice"] = {  //{		//troll is category, ice is variant
	"name":"Ice Troll",				//name	
	"sprite":{						//sprite used 
		'name':"troll",
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
	'deathExp':1,					//same system than other global
	
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
	'moveSelf':0,
	'drop':{
		'category':{			
			'regular':1			//drop table used : quantity modifier bonus
		},
		'plan':{				//chance to drop plan
			'melee':1/100,
			'body':1/100,
			'range':{
				'bow':1/100,			
			}
		},
		'mod':{					
			quantity:1,			//chance to drop something
			quality:1,			//plan only: higher chance for high roll
			rarity:1,			//plan only: higher chance to have more boost
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
		"sprite":{'name':"troll",'sizeMod':1},
		"abilityList":{'bulletSingle':0.2},
		'resource':{'hp':{'max':1000,'regen':1},'mana':{'max':100,'regen':1}},
		
		'globalDef':1,
		'globalDmg':function(lvl){ return lvl + 100},
		'globalMod':function(e,lvl){ e.maxSpd = e.maxSpd + lvl;  return e;},
		'deathExp':1,
		
		"equip":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	

		"acc":2,
		"maxSpd":5,
		"moveRange":{'ideal':200,"confort":50,"aggressive":400,"farthest":600},	
		'drop':{'category':{'regular':1},'plan':{'melee':1/10,'helm':1/10}},
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
	
	
	ePreDb["block"] = {}; //{
	ePreDb["block"]["2x2"] = {  //{
		"name":"Block",
		"sprite":{'name':"block2x2",'sizeMod':1},
		'nevercombat':1,
		'moveSelf':0,
		"block":{pushable:1,direction:4,distance:50,magn:10,time:10,size:[-1,1,-1,1]},
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
			
			//Init Drop
			if(e.drop){
				e.drop.mod = e.drop.mod || {};
				e.drop.mod.quantity = e.drop.mod.quantity || 1;
				e.drop.mod.quality = e.drop.mod.quality || 1;
				e.drop.mod.rarity = e.drop.mod.rarity || 1;
				
				
				if(e.drop.plan){
					for(var k in e.drop.plan){
						if(typeof e.drop.plan[k] === 'number'){
							var tmp = e.drop.plan[k];
							e.drop.plan[k] = {};
							for(var t in Cst.equip[k].type)	e.drop.plan[k][Cst.equip[k].type[t]] = tmp/3;							
						}
					}
				}
				
			}
			
			Db.enemy[i][j] = new Function('return ' + stringify(e));
			Db.enemy[i][j].globalDmg = ePreDb[i][j].globalDmg || e.globalDmg;	//cuz cant stringify function
			Db.enemy[i][j].globalDef = ePreDb[i][j].globalDef || e.globalDef;
			Db.enemy[i][j].globalMod = ePreDb[i][j].globalMod || e.globalMod;
			
			
		}
	}
	
}
//






