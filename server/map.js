
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
		name:model.name,
		version:version,
		grid:model.grid,
		model:model.id,
		timer:version === 'MAIN' ? 1/0 : 1000,// 5*60*1000/25,
		list:{},		//acts like List.all (for faster activeList)
		lvl:lvl || model.lvl,
		addon:newaddon,
	};
	
	List.map[newid] = map;
	
	Map.load(newid);
	return newid;
}

Map.creation.model = function(map){	//create the model that will be in Db.map | Model will then be modded by quest
	var grid = [];
	for(var i = 0 ; i < map.grid.length; i++){	
		grid[i] = [];
		for(var j = 0 ; j < map.grid[i].length; j++){
			grid[i][j] = +!+map.grid[i][j];
		}
	}
	
	var strGrid = stringify(map.grid);
	map.grid = {};
	map.grid.astar = new astar.Graph(grid);
	map.grid.actor = JSON.parse(strGrid.replaceAll('0','a').replaceAll('1','0').replaceAll('2','0').replaceAll('a','1'));
	map.grid.bullet = JSON.parse(strGrid.replaceAll('0','a').replaceAll('1','0').replaceAll('2','1').replaceAll('a','1'));
	
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
	return List.map[name].model;
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
	for(var i in List.map[id].list){
		if(List.all[i] && List.all[i].type === 'player'){
			plist.push(List.all[i].name);
		}
	}
	return plist;
}

Map.remove = function(map){
	if(map.id === map.model) return; //cant delete main maps
	for(var i in map.list){
		removeAny(List.all[i]);
	}
	delete List.map[map.id];
}


Map.collisionRect = function(id,rect,type,cb){	//used in map loop. return array is no cb, else call func foreach
	var list = List.map[id].list;
	var array = [];
	for(var i in list){
		var mort = List.all[i];
		if( (!type || mort.type === type) && Collision.PtRect(mort,rect)){
			array.push(i);
		}
	}
	if(!cb) return array;
	for(var i in array)	cb(array[i]);	
}




