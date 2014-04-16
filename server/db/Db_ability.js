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
			'delayAnim':{				//Anim.creation when delay is over (STRIKE ONLY)
				'name':"fire1",
				'sizeMod':0.5
			},
			'preDelayAnim':{			//Anim.creation when using ability	(STRIKE ONLY)
				'name':"fireHit",
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
			
			bleed : {'baseChance':0,'chance':1,'magn':1,'time':1},		//they are MODIFIER (chance = 2 => x2 more chance that the burn effect will trigger) (except for baseChance)
			knock : {'baseChance':0,'chance':1,'magn':1,'time':1},
			drain : {'baseChance':0,'chance':1,'magn':1,'time':1},	
			burn : {'baseChance':0,'chance':1,'magn':1,'time':1},
			chill : {'baseChance':0,'chance':1,'magn':1,'time':1},
			stun : {'baseChance':0,'chance':1,'magn':1,'time':1},
			leech : {'baseChance':0,'chance':1,'magn':1},			
			crit : {'chance':1,'magn':1},
			
			damageIfMod':0,				//if 0: normal, 1: attack allies
			
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
			maxTimer:40,				//how many frame it stays
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
	{'stat':'hp-max','type':'+','value':1000,'time':50},
]	
*/	

Init.db.ability = function(cb){
	Db.ability = {}; var abilityPreDb = {}; var a = abilityPreDb;
	
	db.find('ability',{},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results){
			a[results[i].id] = results[i];
		}
	
	//Alt-03
	//{ Pvp
	a['pvp-bullet'] = {'type':'attack','name':'Basic Bullet','icon':'attackRange.steady',
		'spd':{'main':1,'support':0},'period':{'own':30,'global':20},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"strikeHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		}
	}};
	
	a['pvp-explosion'] = {'type':'attack','name':'Explosion','icon':'attackMagic.ball',
		'spd':{'main':1,'support':0},'period':{'own':30,'global':20},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'preDelayAnim':{'name':"fireBomb2",'sizeMod':1},
			'dmg':{'main':200,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
			'width':50,
			'height':50,
			'delay':8,
			'minRange':0,
			'maxRange':200,
		}
	}};
	
	a['pvp-freeze'] = {'type':'attack','name':'Freeze Bullet','icon':'attackMagic.crystal',
		'spd':{'main':1,'support':0},'period':{'own':100,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"coldHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
			'chill':{time:25,magn:100,chance:1000},
		}
	}};
	
	a['pvp-fireball'] = {'type':'attack','name':'Fireball Boom','icon':'attackMagic.meteor',
		'spd':{'main':1,'support':0},'period':{'own':100,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':360,'amount':9,
			'objImg':{'name':"fireball",'sizeMod':1.2},'hitImg':{'name':"fireHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		}
	}};
		
	a['pvp-heal'] = {'type':'heal','name':'Regen','icon':'heal.plus',
		'spd':{'main':1,'support':0},'period':{'own':250,'global':50},'cost':{},
		'action':{'animOnSprite':'boostRed','func':'Actor.changeHp','param':[
			1000
		]}
	};
	
	a['pvp-invincibility'] = {'type':'dodge','name':'Invincibility','icon':'blessing.spike',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25,'bypassGlobalCooldown':true},'cost':{"mana":50},
		'action':{'animOnSprite':'boostWhite','func':'Actor.boost','param':[[
			{"stat":"globalDef","type":"+","value":Cst.bigInt,"time":4,"name":"Dodge"},
		]]}
	};
	//}
	

	a['scratch'] = {'type':'attack','name':'Scratch','icon':'attackMelee.scar',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'delayAnim':{'name':"scratch",'sizeMod':0.5},
			'hitImg':{'name':"strikeHit",'sizeMod':0.25},
			'dmg':{'main':100,'ratio':{'melee':100,'range':0,'magic':0,'fire':0,'cold':0,'lightning':0}},
			'width':50,
			'height':50,
			'delay':0,
			'minRange':0,
			'maxRange':50,
		}
	}};	
	
	a['scratchBig'] = {'type':'attack','name':'Multi Scratch','icon':'attackMelee.scar',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'delayAnim':{'name':"scratch2",'sizeMod':0.5},
			'hitImg':{'name':"strikeHit",'sizeMod':0.25},
			'dmg':{'main':200,'ratio':{'melee':100,'range':0,'magic':0,'fire':0,'cold':0,'lightning':0}},
			'width':100,
			'height':100,
			'delay':0,
			'maxHit':5,
			'minRange':0,
			'maxRange':100,
		}
	}};	
	
	a['dart'] = {'type':'attack','name':'Dart','icon':'attackRange.head',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"dart",'sizeMod':1},'hitImg':{'name':"strikeHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':100,'magic':0,'fire':0,'cold':0,'lightning':0}},
		}
	}};	
	
	a['bind'] = {'type':'attack','name':'Binding','icon':'curse.stumble',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'hitImg':{'name':"bind",'sizeMod':0.25},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':100,'lightning':0}},
			'preDelayAnim':{
				'name':"bind",
				'sizeMod':1
			},
			'chill':{'baseChance':1,'chance':1,'time':1,'magn':1},
			'width':25,
			'height':25,
			'delay':10,
			'minRange':0,
			'maxRange':100,
		}
	}};	
	
	a['mine'] = {'type':'attack','name':'Mine','icon':'attackRange.head',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,'spd':0,'maxTimer':250,
			'objImg':{'name':"dart",'sizeMod':1},'hitImg':{'name':"curseGreen",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':100,'fire':0,'cold':0,'lightning':0}},
		}
	}};	
	
	a['blessing'] = {'type':'blessing','name':'Blessing','icon':'blessing.fly',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'animOnSprite':'boostWhite','func':'Combat.action.boost','param':[]}
	};

	a['summon'] = {'type':'summon','name':'Summon','icon':'summon.wolf',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'animOnSprite':'boostPink','func':'Combat.action.summon','param':[]}
	};
	
	//{ Regular Elemental Bullet
	a['fireBullet'] = {'type':'attack','name':'Fire Bullet','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fireHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':1,'cold':0,'lightning':0}},
		}
	}};
	a['coldBullet'] = {'type':'attack','name':'Cold Bullet','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"coldHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':1,'lightning':0}},
		}
	}};
	a['lightningBullet'] = {'type':'attack','name':'Lightning Bullet','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"lightningball",'sizeMod':1},'hitImg':{'name':"lightningHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':0,'lightning':1}},
		}
	}};
	
	a['arrowBullet'] = {'type':'attack','name':'Arrow','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"splashMelee",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':1,'magic':0,'fire':0,'cold':0,'lightning':0}},
		}
	}};
	
	a['magicBullet'] = {'type':'attack','name':'Magic Bullet','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"shadowball",'sizeMod':1},'hitImg':{'name':"lightningHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':1,'fire':0,'cold':0,'lightning':0}},
		}
	}};
	
	a['meleeBullet'] = {'type':'attack','name':'Bone Throw','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"bone",'sizeMod':1},'hitImg':{'name':"strikeHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':1,'range':0,'magic':0,'fire':0,'cold':0,'lightning':0}},
		}
	}};
	
	a['rangeBullet'] = {'type':'attack','name':'Rock Throw','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"rock",'sizeMod':1},'hitImg':{'name':"earthBomb",'sizeMod':0.4},
			'dmg':{'main':100,'ratio':{'melee':0,'range':1,'magic':0,'fire':0,'cold':0,'lightning':0}},
		}
	}};
	
	a['dart'] = {'type':'attack','name':'Dart','icon':'attackRange.head',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"dart",'sizeMod':1},'hitImg':{'name':"strikeHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':1,'magic':0,'fire':0,'cold':0,'lightning':0}},
		}
	}};	
	
	a['windBullet'] = {'type':'attack','name':'Wind','icon':'attackRange.head',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"tornado",'sizeMod':1},'hitImg':{'name':"strikeHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':1,'magic':0,'fire':0,'cold':0,'lightning':0}},
		}
	}};	
	
	
	//}
	a['fireBomb'] = {'type':'attack','name':'Fire Explosion','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'preDelayAnim':{'name':"fireBomb",'sizeMod':1},
			'dmg':{'main':400,'ratio':{'melee':0,'range':0,'magic':0,'fire':1,'cold':0,'lightning':0}},
			'width':50,
			'height':50,
			'delay':10,
			'minRange':0,
			'maxRange':200,
		}
	}};
	
	a['coldBomb'] = {'type':'attack','name':'Cold Explosion','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'preDelayAnim':{'name':"coldBomb",'sizeMod':1},
			'dmg':{'main':400,'ratio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':1,'lightning':0}},
			'width':50,
			'height':50,
			'delay':10,
			'minRange':0,
			'maxRange':200,
		}
	}};
	
	a['magicBomb'] = {'type':'attack','name':'Cold Explosion','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'preDelayAnim':{'name':"magicBomb",'sizeMod':1},
			'dmg':{'main':400,'ratio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':1,'lightning':0}},
			'width':50,
			'height':50,
			'delay':10,
			'minRange':0,
			'maxRange':200,
		}
	}};
	
	a['windBomb'] = {'type':'attack','name':'Tornado','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'preDelayAnim':{'name':"windBomb",'sizeMod':1},
			'dmg':{'main':400,'ratio':{'melee':0,'range':1,'magic':0,'fire':0,'cold':0,'lightning':0}},
			'width':50,
			'height':50,
			'delay':10,
			'minRange':0,
			'maxRange':200,
		}
	}};
	
	
	
	
	a['boneBoomerang'] = {'type':'attack','name':'Bone Boomerang','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"bone",'sizeMod':1},'hitImg':{'name':"strikeHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':1,'magic':0,'fire':0,'cold':0,'lightning':0}},
			'boomerang':{'comeBackTime':50,'spd':2,'spdBack':1.5,'newId':1},
		}
	}};
		
	
	
	a['lightningBomb'] = {'type':'attack','name':'Lightning Explosion','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'preDelayAnim':{'name':"lightningBomb",'sizeMod':1},
			'dmg':{'main':400,'ratio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':0,'lightning':1}},
			'width':50,
			'height':50,
			'delay':10,
			'minRange':0,
			'maxRange':200,
		}
	}};
	
	a['healZone'] = {'type':'attack','name':'Heal Zone','icon':'heal.plus',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,
			'delayAnim':{'name':"aura",'sizeMod':2},
			'dmg':{'main':0,'ratio':{'melee':0,'range':0,'magic':0,'fire':1,'cold':0,'lightning':0}},
			'width':200,
			'height':200,
			'delay':0,
			'minRange':0,
			'maxRange':0,
			'damageIfMod':1,
			'heal':{hp:200},
		}
	}};

	
	a['coldNova'] = {'type':'attack','name':'Cold Nova','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"coldHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':1,'lightning':0}},
			maxTimer:80,
			spd:4,
			nova:{					
				period:4,				
				rotation:3,
				attack:{		//attack info
					'type':"bullet",'angle':360,'amount':4,
					'objImg':{'name':"iceshard",'sizeMod':0.5},'hitImg':{'name':"coldHit",'sizeMod':0.3},
					'dmg':{'main':25,'ratio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':1,'lightning':0}},
					'maxTimer':10,
				},		
			},
		}
	}};
	
	a['lightningNova'] = {'type':'attack','name':'Lightning Nova','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"lightningball",'sizeMod':1},'hitImg':{'name':"lightningHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':1,'lightning':0}},
			maxTimer:80,
			nova:{					
				period:6,				
				rotation:0,
				attack: {
					'type':"strike",'angle':0,'amount':1,
					'delayAnim':{'name':"lightningHit",'sizeMod':0.5},
					'hitImg':{'name':"lightningHit",'sizeMod':0.25},
					'dmg':{'main':200,'ratio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':0,'lightning':1}},
					'width':75,'height':75,'delay':0,
					'minRange':0,'maxRange':0,
				}	
			},
		}
	}};
	
	a['fireNova'] = {'type':'attack','name':'Fire Nova','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':50,'global':50},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fireHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':100,'cold':0,'lightning':0}},
			
			spd:4,
			nova:{					
				period:1,				
				rotation:3,
				attack:{		//attack info
					'type':"bullet",'angle':0,'amount':1,
					'objImg':{'name':"fireball",'sizeMod':0.5},'hitImg':{'name':"fireHit",'sizeMod':0.3},
					'dmg':{'main':25,'ratio':{'melee':0,'range':0,'magic':0,'fire':100,'cold':0,'lightning':0}},
				},		
			},
		}
	}};
	
	

	
	//First fireball
	a['fireball'] = {'type':'attack','name':'Basic Fireball','icon':'attackMagic.fireball',
		'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fireHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':0,'fire':100,'cold':0,'lightning':0}},
		}
	}};
	
	
	
	
	a['bulletMulti'] = {'type':'attack','name':'Multishot','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':15,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"lightningHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		}
	}};
	
	a['bulletMulti-fast'] = {'type':'attack','name':'fast','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':15,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"lightningHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			
			onHit:{					//When attack will hit the enemy, it will create another attack 
				chance:1,				//chance of doing another attack
				attack:{		//attack info
					'type':"bullet",'angle':360,'amount':360,
					'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"lightningHit",'sizeMod':0.5},
					'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
				},		
			},
	
			
		}
	}};
	
	a['bulletMulti-hitmod'] = {'type':'attack','name':'hitmod','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':15,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"lightningHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			
			'damageIfMod':1,'ghost':1,	
		}
	}};
	
	
			
			
	a['bulletMulti-sin'] = {'type':'attack','name':'sin','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':0,'amount':1,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"lightningHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			
			spd:4,
			nova:{					//When attack will hit the enemy, it will create another attack 
				period:2,				//chance of doing another attack
				rotation:10,
				attack:{		//attack info
					'type':"bullet",'angle':360,'amount':4,
					'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"lightningHit",'sizeMod':0.5},
					'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
				},		
			},
			
			
		}
	}};
	
	a['bulletMulti-para'] = {'type':'attack','name':'para','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':15,'amount':10,
			'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"lightningHit",'sizeMod':0.5},
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
			'delayAnim':{'name':"lightningHit",'sizeMod':0.5},
			'hitImg':{'name':"lightningHit",'sizeMod':0.2},
			'preDelayAnim':{'name':"lightningHit",'sizeMod':0.5},
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
			'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fireBomb",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		}
	}};	
	
	a['bulletSingle'] = {'type':'attack','name':'Single','icon':'attackMagic.meteor',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"bullet",'angle':15,'amount':1,
			'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"coldHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		}
	}};

	a['strikeSingle'] = {'type':'attack','name':'Slash','icon':'attackMelee.slash',
		'spd':{'main':0.8,'support':0.2},'period':{'own':20,'global':10},
		'action':{'func':'Combat.action.attack','param':{
			'type':"strike",'angle':0,'amount':1,'delay':2,'maxHit':1,'width':1,'height':1,'minRange':5,'maxRange':50,
			'hitImg':{'name':"strikeHit",'sizeMod':0.5},'objImg':{'name':"strikeHit",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			'damageIfMod':0,'heal':{'hp':100}
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
			'burn':{'baseChance':0,'chance':[1.5,2],'magn':[1,1.2],'time':1}
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
	db.upsert('ability',{'id':a.id}, a, db.err);	
	
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
			if(aa.animOnSprite !== false && !aa.animOnSprite) action.animOnSprite = 'boostWhite';
		}
	}
	
	Db.ability[a.id] = a;	
	
		
	//Setting Item Part
	Item.creation({
		name:a.name,
		icon:'plan.ability',
		option:[	
			{'name':'Learn Ability','remove':1,'func':'Actor.ability.add','param':[a.id]},
			// {'name':'Examine Ability','func':'Actor.examineAbility','param':[a.id]},
		],
		type:'ability',
		id:a.id,
	});
	return a.id;
}

Ability.uncompress = function(name){	//turn ability into function. called when swapAbility
	var ab = typeof name === 'object' ? name : deepClone(Db.ability[name]);
	if(!ab) return null;
	
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
				'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fireHit",'sizeMod':0.5},
				'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			}
		}
	};
}

Ability.template.attack = function(){	//unused OLD AND BAD
	return {
		'type':"bullet",'angle':5,'amount':1, 'aim': 0,
		'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fireHit",'sizeMod':0.5},
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

	
