
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

Map.creation = function(namemodel,version){
	//create a copy of a default map. used for instanced map. version is usually the player name
	version = version || 'MAIN';
	var newid = namemodel + '@' + version;
	var model = Db.map[namemodel];
	
	var hs = deepClone(model.hotspot);
	for(var i in hs) for(var j in hs[i]) hs[i][j].map = newid;
	
	var map = {
		id:newid,
		name:model.name,
		version:version,
		grid:model.grid,
		model:model.id,
		timer:version === 'MAIN' ? 1/0 : 5*60*1000/25,
		list:{},		//acts like List.all (for faster activeList)
		
		loop:model.loop,
		load:model.load,
		hotspot:hs,
		variable:deepClone(model.variable),
		cst:model.cst,
		
		playerLeave:model.playerLeave,
		playerEnter:model.playerEnter,
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
	
	map.variable = map.variable || {};
	map.cst = map.cst || {};
	map.hotspot = map.hotspot || {};
	map.load = map.load || {};
	map.loop = map.loop || {};
	map.playerEnter = map.playerEnter || {};
	map.playerLeave = map.playerLeave || {};
	return map;
}

Map.creation.all = function(){
	for(var i in Db.map){
		Map.creation(i);
	}
}




Map.getModel = function(name){
	return List.map[name].model;
}	

Map.load = function(map){
	var map = List.map[map];
	
	for(var i in map.load){
		map.load[i](
			map.id,
			map.hotspot[i],
			map.variable[i],
			map.cst[i]
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
	var list = List.map[id].list;
	for(var i in list){
		if(List.all[i] && List.all[i].type === 'player'){
			plist.push(List.all[i].name);
		}
	}
	return list;
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




