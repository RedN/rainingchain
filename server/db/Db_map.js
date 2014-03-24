

/*
Db.map['test'] = function(){	//'test' = mapId
	var m = {};
	m.name = "Test";				//display name of name
	m.grid = ['111000001']			//used for collision test. (generate via lua.js and tiled)
	
	
	var a = map.addon.main;
	a.spot = {					//list of location used to create actor, drop, attack zone etc... (generate via lua.js and tiled)
		a:{x:1,y:12},					//pt spot
		b:{x:21,y:12},
		c:[minX,maxX,minY,maxY],		//zone spot
	},	
	
								
	a.variable = {		//list of custom variable used by map to remember stuff. each map has its own copy
		atk:{'type':"bullet",'angle':15,'amount':1, 'aim': 0,'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"iceHit",'sizeMod':0.5},
			'dmg':{'main':1,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}}},	
		anything:'youwant',
		rotation:-1
	};
	
	
	//actions generated only once when loading the map.
	a.load = function(map,spot,variable,cst){	//main: loadId, map:instancedName, spot = map.spot[loadId], variable = map.variable[loadId], cst = map.cst[loadId],
		//######################
		Actor.creation({				//create 1 enemy that cant respawn
			'xym':spot.c,				//location
			"category":"system",		
			"variant":"switch",
			"extra":{},
		});
		
		//#############
		//EXTRA: Create a enemy with certain attributes different than the DB
		//#####
		//Normal format:	99% case
		extra:{
			'attribute':value,
			'att2':value2
		}
		
		//#####
		//Via Array: If you want to access a sub-attribute, use viaArray
		extra:{
			'viaArray':{
				'target,sub,period,first':100,,
			},
			'normalAtt':value,
		},
		//#####
		//Function: use when needs to know mortId
		extra:function(mort){		//@param: enemy object
			mort.hp = 100;
		}
		//#####
		//#####
		//COMMON EXTRA:		
		PARAM: key: playerID, | mort:enemy Obj that has this properties, | mortid: enemy Id that has this properties, | map: mapId 
		
		//can right click to talkTo. used to trigger dialogues.
		dialogue:function(key){
			if(List.main[key].quest.Qtest.stuff){			
				Quest.complete(key,'Qtest');
				Dialogue.start(key,{'group':'Qtest','npc':'Jenny','convo':'intro','node':'intro2'});
			} else {
				Dialogue.start(key,{'group':'Qtest','npc':'Jenny','convo':'intro','node':'intro0'});
			}		
		},
		
		//list of abilities the enemy will trigger when dying. ABILITIES NEED TO BE IN .ability . if want only to be cast at death, put 0 chance to trigger for ai
		deathAbility:[		
			'fireball',
			'explosion',
		],
		
		//called for each player who dealt 1+ dmg to this monster when this monster dies
		deathFunc:function(key,mort,map){},		
		
		//called once whe monsters dies. killers is array of playerId. first id is guy who has the drop
		deathFuncArray:function(killers,mort,map){},	
		
		//delete this enemy when he dies. 
		deleteOnceDead:1,
		
		//enemy in combat? overwrite Db.enemy
		combat:0,
		
		//change condition so attacks will hit another actor. check Combat.hitIf
		hitIf:function(defObj,atkObj){
			return 
		},
		hitIf:'enemy',		//can also be string and will refer to Combat.hitIf.list
		
		//test if defObj can be a target of the enemy.
		targetIf:		exact same than hitIf
		
		//set a function to call when player click on the enemy. onclick info will be added to optionList automatically
		onclick:{
			'shiftLeft':{
				'func':function(key,param0,param1...){},
				'param':['param0','param1',...]		
			},
			'left':same,
			'shiftRight':same,
			'right':same,	//NOT RECOMMENDED. leave for optionList						
		}
		
		//change the respawnLoc of the player aka place the player respawn when dead
		waypoint:{
			x:10,
			y:10,
			map:map,		
		},
		
		//an enemy that acts as a switch. REQ: enemy needs to have anim:'off' and 'on'
		mort.switch = {		
			on:function(key,mort,map){	//function when player activate the switch. map = map Obj
				map.addon.Qtutorial.variable.rotation *= -1;		
			},
			off:function(key,mort,map){ //function when player desactivate the switch
				map.addon.Qtutorial.variable.rotation *= -1;			
			}
			off:null		//once activated, the switch cant be desactivated.
		
		}
		
		//an enemy that acts as a chest. can only be opened once REQ: enemy needs to have anim:'open' and 'close'. NOTE: will be trasnformed to {func:,list:[]}
		//must return a boolean about the success of the action (Ex: if enough inventory space)
		mort.chest = function(key,eId){
			Itemlist.add(List.main[key].invList,'gold',1000);
			return true;
		} 
		
		
		
		
		

		
		//######################
		Actor.creation.group(			//create a group of monsters that respawns
			{
				'x':1060,				//or 'xym':spot.a
				'y':1900,
				'map':map,				//always put 'map':map.
				'respawn':100			//frames before enemy group respawns. (timer starts when every members is dead)
			},
			[
				{							//first enemy type of the group
					'amount':3,					//amount
					"category":"troll",			//enemy category
					"variant":"ice",			//enemy variant
					'lvl':0,					//enemy lvl
					'modAmount':1				//amount of mods each enemy has (see modList)
				},
				{'amount':3,"category":"troll","variant":"ice",'lvl':0,'modAmount':1},		//second enemy type of the group
			]
		);
		
		//######################
		Drop.creation({						//create a drop on the ground
			'xym':spot.o,
			'map':map,
			"item":"gold",		//itemId
			"amount":1,						//item amount
			'timer':1/0						//how long it will stay on the ground b4 dissappearing
		});
		
	}


	
	//actions generated every frame for each instance
	a.loop = function(map,spot,variable,cst){	//main: loadId, map:instancedName, spot = map.spot[loadId], variable = map.variable[loadId], cst = map.cst[loadId],
		
		//######################
		if(Loop.interval(10)){		//only happens 1 times out of 10 frames
			//stuff
		}		

		//######################
		Map.collisionRect(		//call a function for each actor in a zone
			map,					//map
			zone,					//zone that will trigger the function (use spot)
			type,					//either 'player' or 'enemy'. for both, create 2 Map.collisionRect
			function(key){			//function that will be called for each actor thats in the zone. param is their id
				List.all[key].hp -= 100;
			}
		);
		
		//######################
		Attack.creation(		//create an attack generated by the map
			{
				hitIf:'player-simple',		//condition to hit. either 'player-simple' or 'enemy-simple'
				xy:spot.a,				//position
				map:map,					//map
				angle:Math.randomML()*2		//angle used to shoot bullets
			},
			useTemplate(Attack.template(),cst.arrow)	//attack information. use cst to generate attack that are often used
		);

	}
	




*/

Db.map = {};
var mapList = [
	'pvpF4A',
	'test',
];

Init.db.map = function (){
	for(var i in mapList){
		Db.map[mapList[i]] = require('./map/'+mapList[i]).map;
	}
	
	
	//ts("Actor.creation.group({'x':1060,'y':1900,'map':'test@MAIN','respawn':100},[{'amount':1,'category':'boss','variant':'iceTroll','lvl':0,'modAmount':1},]);")
			
			
	
	for(var m in Db.map){	
		Db.map[m] = Db.map[m]();
		Db.map[m].id = m;
		Map.creation.model(Db.map[m]);
	}
	
}

Init.db.map.baseMap = function(){
	return {
		addon:{},
		name : "No Name Map",
		tileset : 'v1.1',
		grid :[[]],
		lvl:0,
		graphic:null,	//if use same graphic than other map
	}
}



