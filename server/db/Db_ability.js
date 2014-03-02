/*
a['bulletMulti'] = {					//bulletMulti is the id of attack
    'type':'attack',                    //attack, buff, curse, heal or summon
    'name':'Multishot',                 //visible name
    'icon':'attackMagic.fireball',      //icon
	'spd':{								//how atk spd impact ability spd
		'main':0.8,
		'support':0.2
	},   
	'period':{							//atk/s (period = 40 => 1 atk/s)
		'own':20,					//amount of frame where player cant re-use same ability
		'global':10,					//amount of frame where player cant use any ability
	},                        
	
	
	'modList':{
		//to be added by player
	},
	'orb' = {
		'upgrade':{
			'amount':0,
			'bonus':'none'			//specify what type of bonus the orb of upgrade grants to this ability
		}
	},
	
	
	
	'action':{
		'anim':'attack',				//sprite animation to perform
		'animOnSprite':'invincibility',			//anim to create below the player
		
		'func':'Combat.action.attack',	//function to call
		'param':{
			'type':"bullet",			//type of attack (bullet or strike)
			'angle':15,					//angle between 1 and last bullet
			'amount':5,					//amount bullet
			'aim': 0,					//angle precision (0 = perfect)
			'hitImg':{					//anim when enemy hit by attack
				'name':"thunder2",
				'sizeMod':0.5
			},
			'objImg':{					//bullet sprite (BULLET ONLY)
				'name':"arrow",
				'sizeMod':1
			},
			'delayAnim':{				//Anim.creation when using ability	(STRIKE ONLY)
				'name':"fire1",
				'sizeMod':0.5
			},
			'preDelayAnim':{			//Anim.creation when delay is over (STRIKE ONLY)
				'name':"fire2",
				'sizeMod':0.5
			},
			
			
			'dmg':{
				'main':100,				//dmg dealt
				'ratio':{				//ratio between the elements. will be normalize (aka sum of ratio = 1 with same proportion)
					'melee':0,
					'range':10,
					'magic':80,
					'fire':10,
					'cold':0,
					'lightning':0
				}	
			},
		
		//$$$$$$$$$$$$$$
		//Optional extra
		//$$$$$$$$$$$$$$
			
			'curse':{					//grant a boost to the hit target
				'chance':1,				//chance that curse is succesful
				'boost':[{				//can add multiple boost in same array.
					'stat':'maxSpd',		//stat changed
					'type':'*',				//type of boost (+ or *)
					'value':0.1,			//value of the change
					'time':50				//duration
				}]
			},
			
			bleed : {'chance':1,'magn':1,'time':1},		//they are MODIFIER (chance = 2 => x2 more chance that the burn effect will trigger)
			knock : {'chance':1,'magn':1,'time':1},
			drain : {'chance':1,'magn':1,'time':1},	
			burn : {'chance':1,'magn':1,'time':1},
			chill : {'chance':1,'magn':1,'time':1},
			confuse : {'chance':1,'magn':1,'time':1},
			leech : {'chance':1,'magn':1},			
			crit : {'chance':1,'magn':1},
			
			hitIfMod':0,				//if 0: normal, 1: attack allies
			
			'heal':{					//regeneration resource on hit
				'hp':100,				
			}
			
			onHit:{					//When attack will hit the enemy, it will create another attack 
				chance:1,				//chance of doing another attack
				attack:{ATTACK},		//attack info
			},
		//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
		//Bullet Only
		
			spd:15, 					//bullet travelling speed
			ghost: 0,					//does bullet goes thru wall?
			pierce : {
				'chance':0.5,			//chance to pierce
				'amount':2,				//max amount of enemy it can pierce
				'dmgReduc':0.5			//everytime it pierces, globalDmg is reduced by dmgReduc
			},
			"parabole":{
				'height':10,			//height of parabole (distance from middle)
				'min':100,				//min distance where bullets will collide
				'max':500,				//max distance where bullets will collide
				'timer':50,				//time before bullets collide
			},
			'boomerang':{
				'comeBackTime':50,		//time before bullet turns 180 degre
				'spd':2,				//spd mod
				'spdBack':1.5,			//spd mod when bullet comes back
				'newId':1				//after turn back, renew id so it can hit enemy again
			},
			'sin':{
				"amp":5,				//amplitude 
				"freq":2				//frequence
			},
			'nova':{				//Bullet that shoots other bullets while travelling
				'period':1,				//time per attack
				'rotation':10,			//angle change per frame
				'attack':{ATTACK}		//attack to cast
			},
			
			
			
			
		}
	}
};

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//If attack if strike = {
	'param':{
			'type':"strike",			//type of attack (bullet or strike)
			
		//Strike Only
			'maxHit':1,					//max amount of enemy that can be hit by each strike
			'width':1,					//width size of the strike hitbox
			'height':1,					//height size of the strike hitbox
			'minRange':5,				//min range for the center of the strike hitbox
			'maxRange':50,				//max range for the center of the strike hitbox
			'delay':2,					//delay between clicking/performing anim and the actual damage phase
			'preDelayAnim':{			//anim where the player clicked sprite
				'name':"attack1",
				'sizeMod':0.5
			},
			'delayAnim':{				//anim where the player clicked sprite after the delay
				'name':"attack1",
				'sizeMod':0.5
			},
			
		//Both Bullet and Strike
			'angle':15,					//angle between 1 and last strike
			'amount':5,					//amount strike
			'aim': 0,					//angle precision (0 = perfect)
			'hitImg':{					//anim when enemy hit by attack
				'name':"attack2",
				'sizeMod':0.5
			},
			
			'dmg':{
				'main':100,				//dmg dealt
				'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}	//ratio (will be normalize)
			},	
	}
};	

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
'func':'Combat.action.summon',
'param':[
	{
		'name':'summonDragon',			//name of the summon family
		'maxChild':5,					//max amount of familiar that a player can own at once of the same family
		'time':1000,					//time familiar will live before disappearing
		'distance':500,					//if enemy is farther than that distance from the player, familiar teleports ontop of player
	},
	{
		"category":"slime",			//enemy category
		"variant":"Big",				//enemy variant
		"lvl":0,						//enemy lvl
		'amount':1						//amount of enemy created per cast
		"modAmount":0,					//amount of enemy mods (randomly selected)
	}
]

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
'func':'Combat.action.boost',
'param':[	//can add multiple boost in same array.
	{
	'stat':'maxSpd',	//stat changed
	'type':'*',			//type of boost (+ or *)
	'value':0.1,		//value of the change
	'time':50			//duration
	},
]	
*/	

Init.db.ability = function(cb){
	Db.ability = {}; var abilityPreDb = {}; var a = abilityPreDb;
	
	db.ability.find({},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results){
			a[results[i].id] = results[i];
		}
	
	
	
	a['pvp-bullet'] = {'type':'attack','name':'Basic Bullet','icon':'attackRange.steady',
		'spd':{'main':1,'support':0},'period':{'own':30,'global':20},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"attack1",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':1,'magic':0,'fire':0,'cold':0,'lightning':0}},
		}
	}};
	
	a['pvp-explosion'] = {'type':'attack','name':'Explosion','icon':'attackMagic.ball',
		'spd':{'main':1,'support':0},'period':{'own':30,'global':20},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'preDelayAnim':{'name':"fire_explosion",'sizeMod':1},
			'dmg':{'main':200,'ratio':{'melee':0,'range':0,'magic':0,'fire':1,'cold':0,'lightning':0}},
			'width':50,
			'height':50,
			'delay':10,
			'minRange':0,
			'maxRange':200,
		}
	}};
	
	a['pvp-freeze'] = {'type':'attack','name':'Freeze Bullet','icon':'attackMagic.crystal',
		'spd':{'main':1,'support':0},'period':{'own':100,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"ice2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':1,'lightning':0}},
			'chill':{time:25,magn:100,chance:1000},
		}
	}};
	
	a['pvp-fireball'] = {'type':'attack','name':'Fireball Boom','icon':'attackMagic.meteor',
		'spd':{'main':1,'support':0},'period':{'own':100,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':360,'amount':9,
			'objImg':{'name':"fireball",'sizeMod':1.2},'hitImg':{'name':"fire2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':1,'cold':0,'lightning':0}},
		}
	}};
		
	a['pvp-heal'] = {'type':'heal','name':'Regen','icon':'heal.plus',
		'spd':{'main':1,'support':0},'period':{'own':250,'global':50},'cost':{},
		'action':{'animOnSprite':'special1','func':'Actor.changeHp','param':[
			1000
		]}
	};
	
	a['pvp-invincibility'] = {'type':'dodge','name':'Invincibility','icon':'blessing.spike',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25,'bypassGlobalCooldown':true},'cost':{"mana":50},
		'action':{'animOnSprite':'special1Red','func':'Actor.boost','param':[[
			{"stat":"globalDef","type":"+","value":Cst.bigInt,"time":4,"name":"Dodge"},
		]]}
	};
	
	
	
	/////
	//PVP END
	////
	
	//Bee.
	a['pierce'] = {'type':'attack','name':'boom','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'delayAnim':{'name':"attack1",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			'width':50,
			'height':50,
			'delay':0,
			'minRange':0,
			'maxRange':50,
		}
	}};
	

	
	//Demon
	a['fireNova'] = {'type':'attack','name':'sin','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fire2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			
			spd:4,
			nova:{					
				period:1,				
				rotation:3,
				attack:{		//attack info
					'type':"bullet",'angle':360,'amount':1,
					'objImg':{'name':"fireball",'sizeMod':0.5},'hitImg':{'name':"fire2",'sizeMod':0.3},
					'dmg':{'main':25,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
				},		
			},
		}
	}};
	a['fireCircle'] = {'type':'attack','name':'sin','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':360,'amount':9,
			'objImg':{'name':"fireball",'sizeMod':1.2},'hitImg':{'name':"fire2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		}
	}};
	
	a['fireExplosion'] = {'type':'attack','name':'sin','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'hitImg':{'name':"fire2",'sizeMod':0.5},
			'preDelayAnim':{'name':"fire3",'sizeMod':2},
			'dmg':{'main':10000,'ratio':{'melee':50,'range':0,'magic':50,'fire':0,'cold':0,'lightning':0}},
			'width':200,
			'height':200,
			'delay':10,
			'minRange':0,
			'maxRange':0,
		}
	}};
	
	//First fireball
	a['fireball'] = {'type':'attack','name':'Basic Fireball','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fire2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':100,'cold':0,'lightning':0}},
		}
	}};
	
	
	
	
	a['bulletMulti'] = {'type':'attack','name':'Multishot','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':15,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"thunder2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		}
	}};
	
	a['bulletMulti-fast'] = {'type':'attack','name':'fast','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':15,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"thunder2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			
			onHit:{					//When attack will hit the enemy, it will create another attack 
				chance:1,				//chance of doing another attack
				attack:{		//attack info
					'type':"bullet",'angle':360,'amount':360,
					'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"thunder2",'sizeMod':0.5},
					'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
				},		
			},
	
			
		}
	}};
	
	a['bulletMulti-hitmod'] = {'type':'attack','name':'hitmod','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':15,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"thunder2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			
			'hitIfMod':1,'ghost':1,	
		}
	}};
	
	
			
			
	a['bulletMulti-sin'] = {'type':'attack','name':'sin','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"thunder2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			
			spd:4,
			nova:{					//When attack will hit the enemy, it will create another attack 
				period:2,				//chance of doing another attack
				rotation:10,
				attack:{		//attack info
					'type':"bullet",'angle':360,'amount':4,
					'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"thunder2",'sizeMod':0.5},
					'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
				},		
			},
			
			
		}
	}};
	
	a['bulletMulti-para'] = {'type':'attack','name':'para','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':15,'amount':10,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"thunder2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			"parabole":{
				'height':10,			//height of parabole (distance from middle)
				'min':100,				//min distance where bullets will collide
				'max':500,				//max distance where bullets will collide
				'timer':50,				//time before bullets collide
			},
			
		}
	}};
	
	
	//is now a strike
	a['bulletMulti-boom'] = {'type':'attack','name':'boom','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'delayAnim':{'name':"fire1",'sizeMod':0.5},
			'hitImg':{'name':"fire2",'sizeMod':0.2},
			'preDelayAnim':{'name':"fire2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			'width':100,
			'height':100,
			'delay':1,
			'minRange':50,
			'maxRange':500,
		}
	}};
	
	
	
	//test above
	
	a['bullet360'] = {'type':'attack','name':'360 Shot','icon':'attackMagic.fire',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},'cost':{'mana':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':360,'amount':9,
			'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fire_explosion",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		}
	}};	
	
	a['bulletSingle'] = {'type':'attack','name':'Single','icon':'attackMagic.meteor',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':15,'amount':1,
			'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"ice2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		}
	}};

	a['strikeSingle'] = {'type':'attack','name':'Slash','icon':'attackMelee.slash',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,'delay':2,'maxHit':1,'width':1,'height':1,'minRange':5,'maxRange':50,
			'hitImg':{'name':"attack1",'sizeMod':0.5},'objImg':{'name':"attack1",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			'hitIfMod':0,'heal':{'hp':100}
		}	
	}};

	a['dodgeRegular'] = {'type':'dodge','name':'Dodge','icon':'dodge.start',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},'cost':{"dodge":75},
		'action':{'func':'Actor.boost','param':[[
			{"stat":"globalDef","type":"+","value":Cst.bigInt,"time":4,"name":"Dodge"},
		]]}
	};
	
	
	if(server){
		Init.db.ability.orb();
		Init.db.ability.mod();
		Init.db.ability.template();	
	}
	
	for(var i in a){
		a[i].id = i;
		Ability.creation(a[i]);
	}	
	cb();});
	
	
}

//Each Ability has a Orb Modifier (string) which refer to the Db.abilityOrb (function)
//A ability can be upgraded with orb of upgrade. doing so, the new ability will be modified depending on Orb Modifier

//Each ability can also have mods that come in Db.abilityMod


Init.db.ability.template = function(){
	Db.abilityTemplate = {}; var a = Db.abilityTemplate;
	
	a['fireball'] = {'type':'attack','name':'Fireball','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':[10,20],'global':[10,20],'bypassGlobalCooldown':false},'orb':'dmg',		
		'action':{'func':'Combat.action.attack','param':{	
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"fire_explosion",'sizeMod':0.5},
			'dmg':{'main':[1,1.2],'ratio':{'melee':0,'range':[25,50],'magic':[25,50],'fire':[25,50],'cold':0,'lightning':0}},
			'burn':{'chance':[1.5,2],'magn':[1,1.2],'time':1}
		}
	}};
		
	for(var i in a){
		//Orb
		a[i].orb = a[i].orb || 'dmg';
	
		if(Db.abilityOrb[a[i].orb]){
			a[i].orb = {'upgrade':{'amount':0,'bonus':a[i].orb}};	 
		} else { 
			//create a custom orb bonus only for this ability
			Db.abilityOrb[a[i].id] = a[i].orb;
			Db.abilityOrb[a[i].id].id = a[i].id;
		}	
		
		
		Item.creation({
			id:'abilityPlan-'+i,
			icon:'plan.ability',
			name:a[i].name,
			option:[	{'name':'Learn Ability','func':'Plan.use.ability','param':[{'piece':i,'quality':0,'item':'abilityPlan-'+i}]} ],
			type:'abilityTemplate',		
		});
		
	}
	
}

Ability = {};
Ability.creation = function(a){
	//Setting Ability
	db.ability.update( {'id':a.id}, a, { upsert: true }, db.err);	
	
	a.spd = convertRatio(a.spd);
	a.cost = a.cost || {};
	a.reset = a.reset || {'attack':0};
	a.period = a.period  || {};
	a.period.own = a.period.own  || 50;
	a.period.global = a.period.global  || 50;
	a.period.bypassGlobalCooldown = a.period.bypassGlobalCooldown === undefined ? false : a.period.bypassGlobalCooldown;
	a.modList = a.modList || {};
	a.orb = a.orb || {'upgrade':{'amount':0,'bonus':'none'}};	//dunno if should be more complete
	a.action = a.action || {};
	
	if(a.action){
		var aa = a.action;
		if(aa.func === 'Combat.action.attack'){
			if(aa.anim !== false && !aa.anim) aa.anim = 'attack';
			
			aa.param.dmg.ratio = convertRatio(aa.param.dmg.ratio);
		}
		if(aa.func === 'Combat.action.boost'){
			if(aa.animOnSprite !== false && !aa.animOnSprite) action.animOnSprite = 'boost';
		}
	}
	
	Db.ability[a.id] = a;	
	
		
	//Setting Item Part
	Item.creation({
		name:a.name,
		icon:'plan.ability',
		option:[	
			{'name':'Learn Ability','func':'Actor.useAbilityPlan','param':[a.id]},
			//{'name':'Examine Ability','func':'Actor.examineAbility','param':[a.id]},
		],
		type:'ability',
		id:a.id,
	});
	return a.id;
}

Ability.uncompress = function(name){	
	var ab = typeof name === 'object' ? name : deepClone(Db.ability[name]);
	if(!ab) return 0;
	
	ab = Ability.uncompress.mod(ab);
	
	if(ab.action && ab.action.func === 'Combat.action.attack'){
		var at = ab.action.param;
		at = useTemplate(Attack.template(),at);
		ab.action.param = new Function('return ' + stringify(at));
	}
	return ab;
}

Ability.uncompress.mod = function(ab){	
	//ability mods
	for(var i in ab.modList){
		var modType = i;
		var amountOrb = ab.modList[i];
		ab = Db.abilityMod[modType].func(ab,amountOrb,Craft.orb.upgrade.formula(amountOrb));
	}
	
	//ability orb
	var orbType = ab.orb.upgrade.bonus;
	var amountOrb = ab.orb.upgrade.amount;
	ab = Db.abilityOrb[orbType].func(ab,amountOrb,Craft.orb.upgrade.formula(amountOrb));	
	
	return ab;
}

Ability.template = function(){	//unused OLD AND BAD
	return {
		'name':'Fire','icon':'melee.mace',
		'cost':{"dodge":0},'reset':{'attack':0},
		'spd':{'main':0.8,'support':0.2},'period':{'cooldown':50,'perform':50},
		'action':{'func':'Combat.action.attack','param':{
				'type':"bullet",'angle':5,'amount':1, 'aim': 0,
				'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fire2",'sizeMod':0.5},
				'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			}
		}
	};
}

Ability.template.attack = function(){	//unused OLD AND BAD
	return {
		'type':"bullet",'angle':5,'amount':1, 'aim': 0,
		'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fire2",'sizeMod':0.5},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
	};
}



/*
Ability

###offensive###

atk normal
atk large with aoe
explode self
mine

1 arrow very fast
3 arrows slower
360
explode arrow


###blessing###
boost-self
boost-other 

aura
aura-group

###healing###

heal
heal-other
heal-group

hp to mana
mana to hp

cure status

###summon###

summon-temp
summon-perm
summon explode
totem

###warp###

invisibility
light 

teleport
teleport-enemy

telekenesis
telekenesis area

detect life

###curse###

disable atk
boost-enemy

###dodge###

1 big use all
dodge + freeze nearby
while dodging, boost def


if(attack[0].mods[i].chance <= 0.33){ attack[0].mods[i].chance *= 2;} 	else {attack[0].mods[i].chance = 1-(1-attack[0].mods[i].chance)/2}
*/

	
