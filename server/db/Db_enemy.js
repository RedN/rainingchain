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
				boost:[{'stat':'leech-chance','type':'+','value':1000,'time':50},
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
				'knock,baseChance':1,
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
			{'template':'fireBomb','aiChance':[0.3,0.1,0.1],'extra':{
				'maxRange':0,
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
			{'template':'scratchBig','aiChance':[1,0,0],'extra':{	//onDeath
				'dmg,main':300,'objImg,name':'splashMelee','bleed,baseChance':1,
			}},
			
			{'template':'dart','aiChance':[0.2,1,1],'extra':{
				'bleed,baseChance':0.2,'chill,baseChance':0.4,'amount':5,'angle':25,
				'dmg,main':50,'parabole':{'height':10,'min':10,'max':500,'timer':50},
			}},
			[0.4,0.2,0.2]
		],
		'deathAbility':[0],
		'deathExp':1,
		"mastery":{'def':{'melee':0.01,'range':0.01,'magic':0.01,'fire':0.01,'cold':0.01,'lightning':0.01},
					'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		"acc":0.5,
		"maxSpd":2,
		"moveRange":{'ideal':10,"confort":25,"aggressive":500,"farthest":600},	
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
		if(a.action.func === 'Combat.action.boost'){		
			a.action.param = deepClone(extra.boost);
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



