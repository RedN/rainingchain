Map = {};

Map.creation = function(namemodel,version){
	//create a copy of a default map. used for instanced map. version is usually the player name
	version = version || 'MAIN';
	var newid = namemodel + '@' + version;
	var model = Db.map[namemodel];
	
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
		hotspot:model.hotspot,
		variable:deepClone(model.variable),
		cst:model.cst,
	};
	
	List.map[newid] = map;
	
	Map.load(namemodel,newid);
	return newid;
}

Map.creation.model = function(map){
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
	return map;
}

Map.creation.all = function(){
	for(var i in Db.map){
		Map.creation(i);
	}
}

Map.mapMod = {};

Map.getModel = function(name){
	return List.map[name].model;
}	

Map.load = function(modelId,loadedmapId){
	var map = List.map[loadedmapId];
	
	for(var i in map.load){
		map.load[i](
			loadedmapId,
			map.hotspot,
			map.variable,
			map.cst
		);
	}
	//console.log(map);
	//console.log(map.hotspot);
	
}


Map.instance = {};
Map.instance.list = function(name){
	var list = [];
	for(var i in List.map){
		if(List.map[i].model === name){
			list.push(List.map[i].id);
		}
	}
	return list;
}

Map.instance.player = function(name){
	//return list of players that are in a certain model of instance
	var list = [];
	for(var i in List.main){
		if(List.map[List.all[i].map].name === name){
			list.push(List.all[i].name);
		}
	}
	return list;
}

Map.remove = function(map){
	if(map.id === map.model) return; //cant delete main maps
	var id = map.id;
	for(var i in List.all){
		if(List.all[i].map === id){
			removeAny(List.all[i]);
		}
	}
	delete List.map[id];
}


Map.collisionRect = function(map,rect,type,cb){	//used in map loop
	var list = List.map[map].list;
	var array = [];
	for(var i in list){
		var mort = List.all[i];
		if( (!type || mort.type === type) && Collision.PtRect(mort,rect)){
			array.push(i);
		}
	}
	if(!cb) return array;
	
	for(var i in array){
		cb(array[i]);	
	}
}




