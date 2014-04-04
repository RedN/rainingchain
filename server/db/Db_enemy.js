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
		'bulletSingle':0.2,			//ability id : frequence (chance to be used, 0-1 chance per second)
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
	'deathExp':1,					//same system than other global but for exp given in combat
	
	"mastery":{
		'def':{					//used as modifier
			'melee':1,
			'range':1,
			'magic':1,
			'fire':1,
			'cold':1,
			'lightning':1
		}
		'dmg':{					//used as modifier
			'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1
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
		},
		'plan':{				//chance to drop plan
			'melee':1/100,
			'body':1/100,
			'range':{
				'bow':1/100,			
			}
		},
		'mod':{					
			quantity:1,			//chance mod to drop something
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
	
	'moveSelf':0,
	
	"block":{
		condition:'true',		//condition to block player | 'true' = always, other function(key)
		size:[-1,1,-1,1]		//area blocked by the block. [minX,maxX,minY,maxY] relative to center
		pushable:1,				//can player push block
		magn:10,				//when pushed, increase spd by magn
		time:10,				//when pushed, increase spd for time amount of frame
	},
	'waypoint':1,				//DONT USE. USE "system" "grave" instead. player can right clikc to set respawnLoc
	
	'immune':{					//grants immunity to elements
		'fire':1,
	},
	
	'ghost':1,					//bypass collision test
};













*/

Db.enemy = {};
Init.db.enemy = function(){ 
	var a = Db.enemy;

	//ALT-2
	a["bat"] = {}; //{
	a["bat"]["normal"] = {  //{
		"name":"Bat",
		"sprite":{'name':"bat",'sizeMod':1},
		"abilityList":[
			{'template':'scratch','aiChance':[0.2,0,0],'extra':{
				'leech,baseChance':0.25,'leech,magn':25,'hitImg,name':'cursePink',			
			}},
			{'template':'scratch','aiChance':[0.4,0,0],'extra':{}},
			{'template':'lightningBullet','aiChance':[0.4,0.4,1],'extra':{}},
			{'template':'blessing','aiChance':[0,0.1,0.2],'extra':{
				param:[{'stat':'leech-chance','type':'+','value':1000,'time':50},
						{'stat':'crit-chance','type':'+','value':1000,'time':50}
				],
			}},
			[0.4,0.4,1]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':2,'range':2,'magic':2,'fire':1,'cold':0.5,'lightning':1},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":2,
		"maxSpd":15,
		"moveRange":{'ideal':50,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["bee"] = {}; //{
	a["bee"]["normal"] = {  //{
		"name":"Bee",
		"sprite":{'name':"bee",'sizeMod':1},
		"abilityList":[
			{'template':'scratch','aiChance':[0.2,0,0],'extra':{}},
			{'template':'scratchBig','aiChance':[0,0,0],'extra':{	//onDeath
				'dmg,main':400,'objImg,name':'splashMelee',
			}},
			{'template':'dart','aiChance':[0,0.2,0.4],'extra':{
				'burn,baseChance':0.2,
			}},
			
			[0.4,0.4,1]
		],
		'deathAbility':[1],
		'deathExp':1,
		"mastery":{'def':{'melee':2,'range':1.5,'magic':1.5,'fire':0.5,'cold':1,'lightning':2},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":2,
		"maxSpd":10,
		"moveRange":{'ideal':50,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["mosquito"] = {}; //{
	a["mosquito"]["normal"] = {  //{
		"name":"Mosquito",
		"sprite":{'name':"mosquito",'sizeMod':1},
		"abilityList":[
			{'template':'dart','aiChance':[1,0.2,0.4],'extra':{
				'knock,baseChance':0.25,
			}},
			{'template':'lightningBullet','aiChance':[1,0.2,0.4],'extra':{
				'amount':5,'angle':30,'knock,baseChance':0.25,'sin':{"amp":2,"freq":2},
			}},
			[0.4,0.2,0.2]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':0.1},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":2,
		"maxSpd":20,
		'atkSpd':{main:2,support:1},
		"moveRange":{'ideal':250,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["mushroom"] = {}; //{
	a["mushroom"]["normal"] = {  //{
		"name":"Mushroom",
		"sprite":{'name':"mushroom",'sizeMod':1},
		"abilityList":[
			{'template':'magicBullet','aiChance':[1,1,1],'extra':{
				'spd':0.1,'maxTimer':250,'stun,baseChance':1,'dmg,main':200,'objImg,name':'spore'
			}},
			{'template':'magicBullet','aiChance':[0.5,0.3,0.3],'extra':{
				'stun,baseChance':0.5,'objImg,name':'spore','angle':360,'amount':5,
			}},
			[0.4,0.2,0.2]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':0.1},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":2,
		"maxSpd":20,
		"moveRange":{'ideal':100,"confort":250,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["larva"] = {}; //{
	a["larva"]["normal"] = {  //{
		"name":"Larva",
		"sprite":{'name':"larva",'sizeMod':1},
		"abilityList":[
			{'template':'fireBomb','aiChance':[0,0,0],'extra':{
				'maxRange':0,'dmg':{main:500,ratio:Cst.element.template(1)},
			}},
			[0.4,0.2,0.2]
		],
		'deathAbility':[0],
		'deathExp':1,
		"mastery":{'def':{'melee':0.01,'range':0.01,'magic':0.01,'fire':0.01,'cold':0.01,'lightning':0.01},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":2,
		"maxSpd":5,
		"moveRange":{'ideal':10,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["plant"] = {}; //{
	a["plant"]["normal"] = {  //{
		"name":"Plant",
		"sprite":{'name':"plant",'sizeMod':1},
		"abilityList":[
			{'template':'scratchBig','aiChance':[1,0,0],'extra':{
				'dmg,main':300,'objImg,name':'splashMelee','bleed,baseChance':1,
			}},
			
			{'template':'dart','aiChance':[0.2,1,1],'extra':{
				'bleed,baseChance':0.2,'chill,baseChance':0.4,'amount':5,'angle':25,
				'dmg,main':50,'parabole':{'height':10,'min':10,'max':500,'timer':50},
				'curse':{'chance':1,'boost':[{'stat':'globalDmg','type':'*','value':0.5,'time':50},{'stat':'maxSpd','type':'+','value':0.1231231414,'time':50}]},
			}},
			[0.4,0.2,0.2]
		],
		'deathAbility':[0],
		'deathExp':1,
		"mastery":{'def':{'melee':0.5,'range':2,'magic':2,'fire':0.5,'cold':1,'lightning':1},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":2,
		"moveRange":{'ideal':10,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["slime"] = {}; //{
	a["slime"]["normal"] = {  //{
		"name":"Slime",
		"sprite":{'name':"slime",'sizeMod':1},
		"abilityList":[
			{'template':'summon','aiChance':[0.4,0.4,0.4],'extra':{'param':[
				{'name':'slimeChild','maxChild':5,'time':20*25,'distance':500},
				{"category":"slime","variant":"child","lvl":0,'amount':1,"modAmount":0}
			]}},
		
			{'template':'coldBullet','aiChance':[0.2,0.4,0.4],'extra':{
				'chill,baseChance':0.2,'amount':5,'angle':25,'dmg,main':50,
			}},
			{'template':'healZone','aiChance':[0.1,0.1,0.2],'extra':{
				'heal':{'hp':200},
			}},
			[0.4,0.2,0.2]
		],
		'deathAbility':[0],
		'deathExp':1,
		"mastery":{'def':{'melee':1,'range':1,'magic':1,'fire':2,'cold':2,'lightning':0.5},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":8,
		"moveRange":{'ideal':100,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	a["slime"]["child"] = {  //{
		"name":"Small Slime",
		"sprite":{'name':"slime",'sizeMod':0.5},
		"abilityList":[
			{'template':'coldBullet','aiChance':[1,1,1],'extra':{
				'dmg,main':25,'objImg,sizeMod':0.5,
			}},
			[0.2,0.2,0.2]
		],
		'deathAbility':[0],
		'deathExp':0,
		"mastery":{'def':{'melee':0.1,'range':0.1,'magic':0.1,'fire':0.2,'cold':0.2,'lightning':0.05},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":10,
		"moveRange":{'ideal':10,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["salamander"] = {}; //{
	a["salamander"]["normal"] = {  //{
		"name":"Salamander",
		"sprite":{'name':"salamander",'sizeMod':1},
		"abilityList":[
			{'template':'fireBullet','aiChance':[1,1,1],'extra':{
				'dmg,main':10,'burn,baseChance':1,'burn,magn':5,
			}},
			{'template':'coldBullet','aiChance':[1,1,1],'extra':{
				'dmg,main':10,'chill,baseChance':1,
			}},
			{'template':'lightningBullet','aiChance':[1,1,1],'extra':{
				'dmg,main':10,'stun,baseChance':1,
			}},
			{'template':'meleeBullet','aiChance':[1,1,1],'extra':{
				'dmg,main':10,'bleed,baseChance':1,'bleed,magn':5,
			}},
			{'template':'magicBullet','aiChance':[1,1,1],'extra':{
				'dmg,main':10,'drain,baseChance':1,
			}},
			{'template':'rangeBullet','aiChance':[4,1,1],'extra':{
				'dmg,main':10,'knock,baseChance':1,
			}},
			[4,4,4]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':0.5,'range':0.5,'magic':2,'fire':2,'cold':2,'lightning':2},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":8,
		"moveRange":{'ideal':150,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["goblin"] = {}; //{
	a["goblin"]["melee"] = {  //{
		"name":"Goblin",
		"sprite":{'name':"goblin",'sizeMod':1},
		"abilityList":[
			{'template':'scratch','aiChance':[1,0,0],'extra':{
				'objImg,name':'slashMelee',
			}},
			{'template':'scratchBig','aiChance':[1,0,0],'extra':{
				'bleed,baseChance':1,'bleed,magn':2,
			}},
			{'template':'rangeBullet','aiChance':[0,0,1],'extra':{
				'stun,baseChance':0.25,
			}},
			[1,0,1]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':2,'range':2,'magic':0.5,'fire':2,'cold':0.5,'lightning':0.5},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":10,
		"moveRange":{'ideal':50,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	a["goblin"]["range"] = {  //{
		"name":"Goblin",
		"sprite":{'name':"goblin",'sizeMod':1},
		"abilityList":[
			{'template':'arrowBullet','aiChance':[0,0.5,0.5],'extra':{
				'angle':10,'amount':3,'aim':25,
			}},
			{'template':'scratchBig','aiChance':[1,0,0],'extra':{
				'knock,baseChance':1,'knock,magn':2,'knock,time':1,
			}},
			{'template':'rangeBullet','aiChance':[0,0,1],'extra':{
				'amount':5,'angle':45,'parabole':{'height':10,'min':10,'max':500,'timer':50},
			}},
			[1,1,1]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':0.5,'range':2,'magic':2,'fire':1,'cold':1,'lightning':0.5},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":10,
		"moveRange":{'ideal':150,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	a["goblin"]["magic"] = {  //{
		"name":"Goblin",
		"sprite":{'name':"goblin",'sizeMod':1},
		"abilityList":[
			{'template':'fireBomb','aiChance':[0,0.5,0.5],'extra':{
				'burn,baseChance':1,
			}},
			{'template':'healZone','aiChance':[0.2,0.2,0.2],'extra':{}},
			{'template':'coldNova','aiChance':[0.5,0.5,0.5],'extra':{}},
			{'template':'scratch','aiChance':[1,0,0],'extra':{
				'dmg,ratio,lightning':1,'objImg':'slashLightning',
			}},
			[1,1,1]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':0.5,'range':0.5,'magic':0.5,'fire':2,'cold':2,'lightning':2},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":10,
		"moveRange":{'ideal':250,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["orc"] = {}; //{
	a["orc"]["melee"] = {  //{
		"name":"Goblin",
		"sprite":{'name':"orcMelee",'sizeMod':1},
		"abilityList":[
			{'template':'scratch','aiChance':[1,0.5,0],'extra':{
				'objImg,name':'slashMelee',
			}},
			{'template':'scratchBig','aiChance':[1,0.5,0],'extra':{
				'bleed,baseChance':1,'bleed,magn':2,
			}},
			{'template':'blessing','aiChance':[0.2,0.4,0.4],'extra':{
				'global':{'action,animOnSprite':'boostRed'},
				param:[{'stat':'bleed-chance','type':'+','value':1000,'time':100},
					{'stat':'atkSpd-main','type':'*','value':3,'time':100},
					{'stat':'globalDef','type':'*','value':10,'time':100},
				],
			}},
			{'template':'rangeBullet','aiChance':[0.5,0.5,1],'extra':{
				'amount':3,'angle':30,
			}},
			[0.5,0.5,0.5]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':2,'range':2,'magic':0.5,'fire':2,'cold':0.5,'lightning':0.5},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":10,
		"moveRange":{'ideal':50,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	a["orc"]["range"] = {  //{
		"name":"Orc",
		"sprite":{'name':"orcRange",'sizeMod':1},
		"abilityList":[
			{'template':'arrowBullet','aiChance':[0,0.5,0.5],'extra':{
				'objImg,sizeMod':1.5,'amount':3,'angle':30,'pierce,baseChance':1,'dmg,main':200,
			}},
			
			{'template':'scratch','aiChance':[1,0,0],'extra':{
				'objImg,name':'slashLightning','stun,baseChance':1,'stun,magn':2,'stun,time':1,
			}},
			{'template':'arrowBullet','aiChance':[0.5,1,1],'extra':{
				'global':{period:{own:10,global:10}},
				'amount':5,'angle':45,'parabole':{'height':10,'min':10,'max':500,'timer':50},
			}},
			[1,1,1]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':0.5,'range':2,'magic':2,'fire':1,'cold':1,'lightning':0.5},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":10,
		"moveRange":{'ideal':150,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	a["orc"]["magic"] = {  //{ //TODO
		"name":"Orc",
		"sprite":{'name':"orcMagic",'sizeMod':1},
		"abilityList":[
			{'template':'coldBomb','aiChance':[0,0.5,0.5],'extra':{
				'chill,baseChance':1,
			}},
			{'template':'healZone','aiChance':[0.2,0.2,0.2],'extra':{}},
			{'template':'lightningNova','aiChance':[0.5,0.5,0.5],'extra':{}},
			{'template':'scratch','aiChance':[1,0,0],'extra':{
				'dmg,ratio,fire':1,'objImg,name':'slashFire','burn,baseChance':0.5,
			}},
			[1,1,1]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':0.5,'range':0.5,'magic':0.5,'fire':2,'cold':2,'lightning':2},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":10,
		"moveRange":{'ideal':250,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["gargoyle"] = {}; //{
	a["gargoyle"]["normal"] = {  //{
		"name":"Gargoyle",
		"sprite":{'name':"gargoyle",'sizeMod':1},
		"abilityList":[
			{'template':'lightningBomb','aiChance':[0.5,0.5,1],'extra':{}},
			{'template':'scratch','aiChance':[0.5,0,0],'extra':{
				'stun,baseChance':1,
			}},
			{'template':'lightningBullet','aiChance':[1,1,1],'extra':{}},
			{'template':'lightningNova','aiChance':[0,0.4,0.4],'extra':{}},
			[0.5,0.5,0.5]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':1,'range':1,'magic':2,'fire':1,'cold':0.5,'lightning':4},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":8,
		"moveRange":{'ideal':150,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["ghost"] = {}; //{
	a["ghost"]["normal"] = {  //{
		"name":"Ghost",
		"sprite":{'name':"ghost",'sizeMod':1},
		"abilityList":[
			{'template':'magicBullet','aiChance':[0.5,0.5,1],'extra':{
				'curse':{'chance':0.25,'boost':[{'stat':'globalDmg','type':'*','value':0.1,'time':50}]},
			}},
			{'template':'magicBomb','aiChance':[0.3,0.5,0.5],'extra':{
				'drain,baseChance':1,
				'curse':{'chance':0.25,'boost':[{'stat':'globalDef','type':'*','value':0.5,'time':50}]},
			}},
			{'template':'lightningBullet','aiChance':[1,1,1],'extra':{}},
			[0.5,0.5,0.5]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		immune:{melee:1,range:1,magic:1},
		"acc":0.5,
		"maxSpd":8,
		"moveRange":{'ideal':150,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["death"] = {}; //{
	a["death"]["normal"] = {  //{
		"name":"Death",
		"sprite":{'name':"death",'sizeMod':1},
		"abilityList":[
			{'template':'magicBullet','aiChance':[0.5,0.5,0.5],'extra':{
				'drain,baseChance':1,
				'curse':{'chance':0.25,'boost':[{'stat':'hp-regen','type':'*','value':0.5,'time':250},{'stat':'mana-regen','type':'*','value':0.5,'time':250}]},
			}},
			{'template':'magicBomb','aiChance':[0.8,0.8,0.8],'extra':{
				'aim':25,'dmg,main':25,'minRange':100,
				'onStrike':{chance:1,attack:{
						'type':"bullet",'angle':360,'amount':8,
						'objImg':{'name':"shadowball",'sizeMod':0.8},'hitImg':{'name':"magicHit",'sizeMod':0.5},
						'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':1,'fire':0,'cold':0,'lightning':0}},
					}
				}
			}},
			{'template':'coldBullet','aiChance':[0.1,0.3,0.3],'extra':{}},
			[0.5,0.5,0.5]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':2,'range':2,'magic':0.5,'fire':0.5,'cold':2,'lightning':0.5},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":8,
		"moveRange":{'ideal':200,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["skeleton"] = {}; //{
	a["skeleton"]["normal"] = {  //{
		"name":"Skeleton",
		"sprite":{'name':"skeleton",'sizeMod':1},
		"abilityList":[
			{'template':'boneBoomerang','aiChance':[0.1,0.5,0.5],'extra':{
				'amount':5,'angle':45,
			}},
			{'template':'boneBoomerang','aiChance':[0.1,0.8,0.8],'extra':{
				'objImg,size':1.5,'dmg,main':250,'knock,baseChance':1,
			}},
			{'template':'scratch','aiChance':[1,0,0],'extra':{
				'knock,baseChance':0.25,
			}},
			[0.5,0.5,0.5]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':2,'range':2,'magic':0.5,'fire':0.5,'cold':2,'lightning':0.5},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":8,
		"moveRange":{'ideal':200,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["spirit"] = {}; //{
	a["spirit"]["fire"] = {  //{
		"name":"Spirit",
		"sprite":{'name':"spirit",'sizeMod':1},
		"abilityList":[
			{'template':'fireBomb','aiChance':[0.5,0.5,0.5],'extra':{
				'aim':20,
				'onStrike':{chance:1,attack:{
						'type':"bullet",'angle':360,'amount':4,
						'objImg':{'name':"fireball",'sizeMod':0.8},'hitImg':{'name':"fireHit",'sizeMod':0.5},
						'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':1,'cold':0,'lightning':0}},
					}
				}
			}},
			{'template':'fireBullet','aiChance':[0.4,0.8,0.8],'extra':{
				'amount':3,'angle':45,'burn,baseChance':1,
			}},
			{'template':'fireBomb','aiChance':[0.3,0.3,0.3],'extra':{
				'preDelayAnim,name':'cursePink','dmg,main':25,
				'curse':{'chance':1,'boost':[{'stat':'def-fire-mod','type':'*','value':0.5,'time':150}]},
			}},
			{'template':'fireNova','aiChance':[0,0.4,0.4],'extra':{}},
			[0.5,0.5,0.5]
		],
		//'reflect':{'fire':2},
		'deathExp':1,
		"mastery":{'def':{'melee':0.5,'range':0.5,'magic':0.5,'fire':2,'cold':0.5,'lightning':0.5},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":8,
		"moveRange":{'ideal':200,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["demon"] = {}; //{
	a["demon"]["normal"] = {  //{
		"name":"Demon",
		"sprite":{'name':"demon",'sizeMod':1},
		"abilityList":[
			{'template':'fireNova','aiChance':[0,0.4,0.4],'extra':{}},
			{'template':'fireBullet','aiChance':[0.4,0.4,0.4],'extra':{
				'amount':7,angle:360,'burn,baseChance':1,'burn,magn':2,
			}},
			{'template':'scratch','aiChance':[0.4,0,0],'extra':{
				'dmg,ratio,fire':1,'delayAnim,name':'slashFire',
			}},
			[0.5,0.5,0.5]
		],
		'immune':{'fire':1},
		'deathExp':1,
		"mastery":{'def':{'melee':2,'range':0.5,'magic':2,'fire':1,'cold':0.5,'lightning':0.5},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":2,
		"maxSpd":8,
		"moveRange":{'ideal':200,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}

	a["taurus"] = {}; //{
	a["taurus"]["normal"] = {  //{
		"name":"Taurus",
		"sprite":{'name':"taurus",'sizeMod':1},
		"abilityList":[
			{'template':'rangeBullet','aiChance':[0,0.4,0.4],'extra':{
				'amount':7,'angle':160,'bleed,baseChance':0.5,
			}},
			{'template':'scratchBig','aiChance':[1,0,0],'extra':{
				'delayAnim,sizeMod':1.5,'dmg,main':200,
				'onStrike':{chance:0.5,attack:{
						'type':"bullet",'angle':360,'amount':8,
						'objImg':{'name':"rock",'sizeMod':0.8},'hitImg':{'name':"earthHit",'sizeMod':0.5},
						'dmg':{'main':25,'ratio':{'melee':1,'range':1,'magic':0,'fire':0,'cold':0,'lightning':0}},
					}
				}
			}},
			[0.5,0.5,0.5]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':4,'range':4,'magic':0.5,'fire':1,'cold':1,'lightning':1},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":2,
		"maxSpd":8,
		"moveRange":{'ideal':50,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	
	a["mummy"] = {}; //{
	a["mummy"]["normal"] = {  //{
		"name":"Mummy",
		"sprite":{'name':"mummy",'sizeMod':1},
		'resource':{'hp':{'max':1000,'regen':3},'mana':{'max':100,'regen':1}},
		"abilityList":[
			{'template':'scratch','aiChance':[1,0,0],'extra':{
				'leech,baseChance':1,'delayAnim,name':'cursePink',
			}},
			{'template':'scratch','aiChance':[0.5,0,0],'extra':{
				'chill,baseChance':1,'delayAnim,name':'slashCold',
			}},
			{'template':'coldNova','aiChance':[0,0.2,0.4],'extra':{}},
			{'template':'magicBomb','aiChance':[0,0.5,0.5],'extra':{
				'dmg,main':100,
				'curse':{'chance':0.75,'boost':[{'stat':'globalDmg','type':'*','value':0.5,'time':50}]},
			}},
			[0.5,0.5,0.5]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':1,'range':1,'magic':0.5,'fire':0.5,'cold':2,'lightning':2},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":2,
		"maxSpd":8,
		"moveRange":{'ideal':50,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["bird"] = {}; //{
	a["bird"]["red"] = {  //{
		"name":"Bird",
		"sprite":{'name':"birdRed",'sizeMod':1},
		"abilityList":[
			{'template':'windBomb','aiChance':[0.5,0.5,0.5],'extra':{}},
			{'template':'scratch','aiChance':[0.5,0,0],'extra':{
				'knock,baseChance':1,'delayAnim,name':'earthHit',
			}},
			{'template':'windBullet','aiChance':[0,0.5,0.5],'extra':{
				'amount':5,'angle':45,'sin':{"amp":2,"freq":2},'knock,baseChance':0.5,
			}},
			[0.5,0.5,0.5]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':1,'range':0.5,'magic':1,'fire':2,'cold':0.5,'lightning':0.5},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":2,
		"maxSpd":8,
		"moveRange":{'ideal':250,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	a["dragon"] = {}; //{
	a["dragon"]["king"] = {  //{
		"name":"Dragon",
		"sprite":{'name':"dragonKing",'sizeMod':1},
		"abilityList":[
			{'template':'windBullet','aiChance':[1,0.5,0.5],'extra':{
				'angle':360,'amount':9,
			}},
			{'template':'fireNova','aiChance':[0.5,0.5,0.5],'extra':{}},
			{'template':'coldNova','aiChance':[0.5,0.5,0.5],'extra':{}},
			{'template':'lightningNova','aiChance':[0.5,0.5,0.5],'extra':{}},
			{'template':'scratchBig','aiChance':[0.5,0,0],'extra':{
				'bleed,baseChance':1,
			}},
			[0.5,0.5,0.5]
		],
		'deathExp':1,
		"mastery":{'def':{'melee':2,'range':2,'magic':1,'fire':2,'cold':2,'lightning':2},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":2,
		"maxSpd":14,
		"moveRange":{'ideal':250,"confort":25,"aggressive":500,"farthest":600},	
	}; //}
	//}
	
	
	
	
	a["troll"] = {}; //{
	a["troll"]["ice"] = {  //{
		"name":"Ice Troll",
		"sprite":{'name':"troll",'sizeMod':1},
		
		
		'resource':{'hp':{'max':1000,'regen':1},'mana':{'max':100,'regen':1}},
		
		'globalDef':1,
		'globalDmg':1,
		'deathExp':1,
		
		"mastery":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},

		"acc":2,
		"maxSpd":5,
		"moveRange":{'ideal':200,"confort":50,"aggressive":400,"farthest":600},	
		'drop':{'category':{'regular':1},'plan':{'melee':1/10,'helm':1/10}},
	}; //}
	//}
	
	a["neutral"] = {}; //{
	a["neutral"]["jenny"] = {  //{
		"name":"Jenny",
		"sprite":{'name':"jenny",'sizeMod':1},
		'nevercombat':1,
		"acc":0.5,
		"maxSpd":3,
	}; //}
	//}
	
	a["system"] = {}; //{
	a["system"]["grave"] = {  //{
		"name":"Grave",
		"sprite":{'name':"grave",'sizeMod':1},
		"waypoint":1,
		'nevercombat':1,
		'nevermove':1,
		"block":{condition:'true',pushable:0,size:[-1,1,-1,1]},
	}; //}
	a["system"]["chest"] = {  //{
		"name":"Chest",
		"sprite":{'name':"chest",'sizeMod':1},
		'nevercombat':1,
		'nevermove':1,
	}; //}
	a["system"]["switch"] = {  //{
		"name":"Switch",
		"sprite":{'name':"switchBox",'sizeMod':1},
		'nevercombat':1,
		'nevermove':1,
	}; //}
	//}
	
	a["block"] = {}; //{
	a["block"]["1x1"] = {  //{
		"name":"Block",
		"sprite":{'name':"block1x1",'sizeMod':1},
		'nevercombat':1,
		'moveSelf':0,
		"block":{condition:'true',pushable:1,magn:4,time:16,size:[-1,1,-1,1]},
	}; //}
	
	a["block"]["2x2"] = {  //{
		"name":"Block",
		"sprite":{'name':"block1x1",'sizeMod':2},
		'nevercombat':1,
		'moveSelf':0,
		"block":{condition:'true',pushable:1,magn:4,time:9,size:[-1,1,-1,1]},
	}; //}
	a["block"]["2x2Fix"] = {  //{
		"name":"Block",
		"sprite":{'name':"block1x1-black",'sizeMod':2},
		'nevercombat':1,
		'moveSelf':0,
		"block":{condition:'true',pushable:0,size:[-1,1,-1,1]},
	}; //}

	a["block"]["3x3"] = {  //{
		"name":"Block",
		"sprite":{'name':"block1x1",'sizeMod':3},
		'nevercombat':1,
		'moveSelf':0,
		"block":{condition:'true',pushable:1,magn:8,time:8,size:[-1,1,-1,1]},
	}; //}
	
	a["block"]["4x4"] = {  //{
		"name":"Block",
		"sprite":{'name':"block1x1",'sizeMod':4},
		'nevercombat':1,
		'moveSelf':0,
		"block":{condition:'true',pushable:1,magn:8,time:8,size:[-1,1,-1,1]},
	}; //}
	//}

	
	a["tree"] = {}; //{
	a["tree"]["red"] = {  //{
		"name":"Red Tree",
		"sprite":{'name':"treeRed",'sizeMod':1},
		'nevercombat':1,
		'nevermove':1,
	}; //}
	a["tree"]["down"] = {  //{
		"name":"Tree",
		"sprite":{'name':"block1x1",'sizeMod':1},
		'nevercombat':1,
		'nevermove':1,
	}; //}
	//}
	

	//Turn Object into function
	for(var i in a){ 
		for(var j in a[i]){
			a[i][j].category = i;
			a[i][j].variant = j;
			Init.db.enemy.creation(a[i][j]);			
		}
	}
	
}

Init.db.enemy.creation = function(e){
	e = useTemplate(Actor.template('enemy'),e);
	
	e.context = e.name; 
	if(e.combat && !e.nevercombat)	e.context += ' | Lvl: ' + e.lvl;
	for(var i in e.resource)
		e[i] = e.resource[i].max;

	e = Init.db.enemy.creation.drop(e);	
	e = Init.db.enemy.creation.ability(e);
	
	var tmp = {def:{},dmg:{}};
	for(var i in e.mastery.def){
		tmp.def[i] = {sum:e.mastery.def[i],mod:1};
		tmp.dmg[i] = {sum:e.mastery.dmg[i],mod:1};
	}
	e.mastery = tmp;
		
	
	//Add to Db.enemy	
	var a = Db.enemy[e.category][e.variant] = new Function('return ' + stringify(e));
	
	//things cant stringify cuz function
	a.globalDmg = e.globalDmg;	
	a.globalDef = e.globalDef;
	a.globalMod = e.globalMod;
	
	a.ability = [];	
	for(var i in e.ability)
		a.ability.push(e.ability[i].action.param);
		
	return e;
}

Init.db.enemy.creation.drop = function(e){ 
	e.drop.mod = e.drop.mod || {};
	e.drop.mod.quantity = e.drop.mod.quantity || 0;
	e.drop.mod.quality = e.drop.mod.quality || 0;
	e.drop.mod.rarity = e.drop.mod.rarity || 0;
	
	if(e.drop.plan){
		for(var k in e.drop.plan){
			if(typeof e.drop.plan[k] === 'number'){
				var tmp = e.drop.plan[k];
				e.drop.plan[k] = {};
				for(var t in Cst.equip[k].type)	e.drop.plan[k][Cst.equip[k].type[t]] = tmp/3;							
			}
		}
	}
	return e;
}
		
Init.db.enemy.creation.ability = function(e){
	var position = 0;
	for(var i in e.abilityList){
		if(!e.abilityList[i].template){
			e.abilityAi.close['idle'] = e.abilityList[i][0];
			e.abilityAi.middle['idle'] = e.abilityList[i][1];
			e.abilityAi.far['idle'] = e.abilityList[i][2];
			continue;
		}	
				
		var a = deepClone(Db.ability[e.abilityList[i].template]);
		var extra = e.abilityList[i].extra;
		if(extra.global)
			a = useTemplate(a,a.action.param.global,1,1);
		delete extra.global;
		
		
		if(a.action.func === 'Combat.action.attack'){
			a.action.param = useTemplate(Attack.template(),a.action.param,0);
			a.action.param = useTemplate(a.action.param,extra,1,1);	//TOFIX if want to change something other then attack
		}
		if(a.action.func === 'Combat.action.boost' || a.action.func === 'Combat.action.summon'){		
			a.action.param = deepClone(extra.param);
		}
		
		var id = Math.randomId();
		e.abilityList[i].id = id;
		a.id = id;
		
		e.abilityAi.close[id] = e.abilityList[i].aiChance[0];
		e.abilityAi.middle[id] = e.abilityList[i].aiChance[1];
		e.abilityAi.far[id] = e.abilityList[i].aiChance[2];
		
		Actor.swapAbility(e,a,position++);
	}
	
	var a = {};
	for(var i in e.abilityList)	a[e.abilityList[i].id] = 1;
	e.abilityList = a;
	return e;
}



