var astar = require('astar');

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
		atk:{'type':"bullet",'angle':15,'amount':1, 'aim': 0,'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"coldHit",'sizeMod':0.5},
			'dmg':{'main':1,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}}},	
		anything:'youwant',
		rotation:-1
	};
	
	
	//actions generated only once when loading the map.
	a.load = function(map,spot,variable,cst){	//main: loadId, map:instancedName, spot = map.spot[loadId], variable = map.variable[loadId], cst = map.cst[loadId],
		//######################
		Actor.creation({				//create 1 enemy that cant respawn
			'spot':spot.c,				//location
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
		extra:function(act){		//@param: enemy object
			act.hp = 100;
		}
		//#####
		//#####
		//COMMON EXTRA:		
		PARAM: key: playerID, | act:enemy Obj that has this properties, | mortid: enemy Id that has this properties, | map: mapId 
		
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
		deathAbility:[0,1,3],
		
		//called for each player who dealt 1+ dmg to this monster when this monster dies
		deathFunc:function(key,act,map){},		
		
		//called once whe monsters dies. killers is array of playerId. first id is guy who has the drop
		deathFuncArray:function(killers,act,map){},	
		
		//delete this enemy when he dies. 
		deleteOnceDead:1,
		
		//enemy in combat? overwrite Db.enemy
		combat:0,
		
		//change condition so attacks will hit another actor. check Combat.damageIf
		damageIf:function(defObj,atkObj){
			return 
		},
		damageIf:'npc',		//can also be string and will refer to Combat.damageIf.list
		
		//test if defObj can be a target of the enemy.
		targetIf:		exact same than damageIf
		
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
		act.switch = {		
			on:function(key,act,map){	//function when player activate the switch. map = map Obj
				map.addon.Qtutorial.variable.rotation *= -1;		
			},
			off:function(key,act,map){ //function when player desactivate the switch
				map.addon.Qtutorial.variable.rotation *= -1;			
			}
			off:null		//once activated, the switch cant be desactivated.
		
		}
		
		//an enemy that acts as a chest. can only be opened once REQ: enemy needs to have anim:'open' and 'close'. NOTE: will be trasnformed to {func:,list:[]}
		//must return a boolean about the success of the action (Ex: if enough inventory space)
		act.loot = function(key,eId){
			Itemlist.add(List.main[key].invList,'gold',1000);
			return true;
		} 
		
		
		
		
		

		
		//######################
		Actor.creation.group(			//create a group of monsters that respawns
			{
				'x':1060,				
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
			'spot':spot.o,
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
			map,					//map id
			zone,					//zone that will trigger the function (use spot)
			type,					//either 'player' or 'npc'. for both, create 2 Map.collisionRect
			function(key){			//function that will be called for each actor thats in the zone. param is their id
				List.all[key].hp -= 100;
			}
		);
		
		//######################
		Attack.creation(		//create an attack generated by the map
			{
				damageIf:'player-simple',		//condition to hit. either 'player-simple' or 'npc-simple'
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
	var a = Db.map;
	
	for(var i in mapList)	Db.map[mapList[i]] = require('./map/'+mapList[i]).map;		
	
	for(var m in a){	
		a[m] = a[m]();
		a[m].id = m;
		Map.creation.model(a[m]);
	}
	
}

Init.db.map.model = function(){
	return {
		addon:{},
		name : "No Name Map",
		tileset : 'v1.1',
		grid :[[]],
		lvl:0,
		fall:null,
		graphic:null,	//if use same graphic than other map
	}
}

Map.creation = function(namemodel,version,lvl){	//create instance of map. version is usually the player name
	version = version || 'MAIN';
	var newid = namemodel + '@' + version;
	var model = Db.map[namemodel];
	
	var newaddon = deepClone(model.addon);
	for(var i in newaddon){
		for(var j in newaddon[i].spot){
			newaddon[i].spot[j].map = newid;
			newaddon[i].spot[j].addon = i;
		}
	}
	//TOFIX problem with grid if using graphic
	
	var map = {
		id:newid,
		name:model.name,
		model:model.id,
		version:version,
		graphic:model.graphic,
		grid:Db.map[model.graphic].grid,
		fall:model.fall,
		lvl:lvl || model.lvl,
		addon:newaddon,
		timer:version === 'MAIN' ? 1/0 : 1000,// 5*60*1000/25,	//TOFIXTEST
		list:{all:{},player:{},bullet:{},npc:{},anim:{},actor:{}},		//acts like List.all (for faster activeList and collisionRect)
		
	};
	
	List.map[newid] = map;
	
	Map.load(List.map[newid]);
	return newid;
}

Map.creation.model = function(map){	//create the model that will be in Db.map | Model will then be modded by quest
	var grid = [];	//for astar
	for(var i = 0 ; i < map.grid.length; i++){	
		grid[i] = [];
		for(var j = 0 ; j < map.grid[i].length; j++){
			grid[i][j] = +!+map.grid[i][j];	//opposite
		}
	}
	
	map.graphic = map.graphic || map.id;
	map.addon = map.addon || {};
		
	var strGrid = stringify(map.grid);
	map.grid = {};
	map.grid.astar = new astar.Graph(grid);
	
	//PRE: 0 => can walk, 1 => cant; 2 => bullet only can walk; 3 => fall close; 4 => fall
	//POST: 0 => cant walk, 1 => can walk; 3 => fall close 4=> fall
	map.grid.player = JSON.parse(strGrid.replaceAll('0','a').replaceAll('1','0').replaceAll('2','0').replaceAll('a','1'));
	map.grid.npc = JSON.parse(strGrid.replaceAll('0','a').replaceAll('1','0').replaceAll('2','0').replaceAll('a','1').replaceAll('4','0'));
	map.grid.bullet = JSON.parse(strGrid.replaceAll('0','a').replaceAll('1','0').replaceAll('2','1').replaceAll('a','1'));
	
	return map;
}

Map.remove = function(map){
	if(map.id.have("@MAIN")) return; //cant delete main maps
	for(var i in map.list){
		for(var j in map.list[i]){
			removeAny(List.all[j]);
		}
	}
	delete List.map[map.id];
}


