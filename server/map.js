
/*
Db.map loaded.
Map model created
Quest loaded
	Modify Map Model
	Modify Enemy
	Modify Item
	Modify Ability
	Modify Equip
	Modify Equip
Map MAIN created

*/


Map = {};

Map.creation = function(namemodel,version,lvl){
	//create a copy of a default map. used for instanced map. version is usually the player name
	version = version || 'MAIN';
	var newid = namemodel + '@' + version;
	var model = Db.map[namemodel];
	
	var newaddon = deepClone(model.addon);
	for(var i in newaddon){
		for(var j in newaddon[i].spot)
			newaddon[i].spot[j].map = newid;
	}
	
	var map = {
		id:newid,
		randomId:Math.randomId(),
		name:model.name,
		version:version,
		graphic:model.graphic,
		grid:Db.map[model.graphic].grid,
		model:model.id,
		fall:model.fall,
		timer:version === 'MAIN' ? 1/0 : 1000,// 5*60*1000/25,
		list:{all:{},player:{},bullet:{},enemy:{},anim:{}},		//acts like List.all (for faster activeList and collisionRect)
		lvl:lvl || model.lvl,
		addon:newaddon,
	};
	
	List.map[newid] = map;
	
	Map.load(newid);
	return newid;
}

Map.creation.model = function(map){	//create the model that will be in Db.map | Model will then be modded by quest
	var grid = [];	//for astart
	for(var i = 0 ; i < map.grid.length; i++){	
		grid[i] = [];
		for(var j = 0 ; j < map.grid[i].length; j++){
			grid[i][j] = +!+map.grid[i][j];	//opposite
		}
	}
	
	var strGrid = stringify(map.grid);
	map.grid = {};
	map.grid.astar = new astar.Graph(grid);
	
	//PRE: 0 => can walk, 1 => cant; 2 => bullet only can walk; 3 => fall close; 4 => fall
	//POST: 0 => cant walk, 1 => can walk; 3 => fall close 4=> fall
	map.grid.player = JSON.parse(strGrid.replaceAll('0','a').replaceAll('1','0').replaceAll('2','0').replaceAll('a','1'));
	map.grid.enemy = JSON.parse(strGrid.replaceAll('0','a').replaceAll('1','0').replaceAll('2','0').replaceAll('a','1').replaceAll('4','0'));
	map.grid.bullet = JSON.parse(strGrid.replaceAll('0','a').replaceAll('1','0').replaceAll('2','1').replaceAll('a','1'));
	
	map.graphic = map.graphic || map.id;
	map.addon = map.addon || {};
	
	return map;
}

Map.creation.all = function(){
	for(var i in Db.map){
		Map.creation(i);
	}
}


Map.loop = function(map){
	//Time Out Instance
	if(Loop.interval(60*1000/40)){		//each min
		if(Map.instance.player(map.id).length === 0){
			map.timer -= 60*1000/25;
			if(map.timer <= 0){
				Map.remove(map);
				return;
			}
		}	
	}
	
	for(var j in map.addon){
		if(map.addon[j].loop)
			map.addon[j].loop(
				map.id,
				map.addon[j].spot,
				map.addon[j].variable,
				map.addon[j]
			);
	}
}

Map.getModel = function(name){
	return List.map[name] ? List.map[name].model : name.split('@')[0];
}	

Map.load = function(map){
	var map = List.map[map];
	
	for(var j in map.addon){
		if(map.addon[j].load)
			map.addon[j].load(
				map.id,
				map.addon[j].spot,
				map.addon[j].variable,
				map.addon[j]
			);
	}
	
}


Map.instance = {};
Map.instance.list = function(model){
	var list = [];
	for(var i in List.map){
		if(List.map[i].model === model){
			list.push(List.map[i].id);
		}
	}
	return list;
}

Map.instance.player = function(id){
	//return list of players names that are in a certain model of instance
	var plist = [];
	for(var i in List.map[id].list.player){
		if(List.all[i]){
			plist.push(List.all[i].name);
		}
	}
	return plist;
}

Map.remove = function(map){
	if(map.id === map.model) return; //cant delete main maps
	for(var i in map.list){
		for(var j in map.list[i]){
			removeAny(List.all[j]);
		}
	}
	delete List.map[map.id];
}


Map.collisionRect = function(id,rect,type,cb){	//used in map loop. return array is no cb, else call func foreach
	var array = [];
	for(var i in List.map[id].list[type]){
		var act = List.all[i];
		if(Collision.PtRect(act,rect)){
			array.push(i);
		}
	}
	if(!cb) return array;
	for(var i in array)	cb(array[i]);	
}


Map.leave = function(act,map){
	map = map || act.map;
	var oldmap = List.map[map];
	
	if(act.type === 'player'){
		for(var i in oldmap.addon)
			if(oldmap.addon[i].playerLeave)
				oldmap.addon[i].playerLeave(act.id,map,oldmap.addon[i].spot,oldmap.addon[i].variable,oldmap);
	}
	delete oldmap.list.all[act.id];
	if(oldmap.list[act.type]) delete oldmap.list[act.type][act.id];
}
Map.enter = function(act,map){
	map = map || act.map;
	var newmap = List.map[act.map];
	newmap.list.all[act.id] = 1;
	if(newmap.list[act.type]) newmap.list[act.type][act.id] = 1;
	
	if(act.type === 'player'){
		for(var i in newmap.addon)
			if(newmap.addon[i].playerEnter)
				newmap.addon[i].playerEnter(act.id,act.map,newmap.addon[i].spot,newmap.addon[i].variable,newmap);
		//
		var lvlMod = (10+newmap.lvl) / (10+Actor.getCombatLevel(act));
		
		Actor.permBoost(act,'mapLevelDifference',[
			{'stat':'globalDmg','value':lvlMod,'type':'***'},
			{'stat':'globalDef','value':lvlMod,'type':'***'},
		]);
		
	}
}




Map.getSpot = function(id,addon,spot){
	var a = Db.map[Map.getModel(id)].addon[addon].spot[spot];
	
	return {
		x:a.x,
		y:a.y,
		map:id,
	}
}





