var astar = require('astar');

Db.map = {};
//var mapList = [];

Init.db.map = function (){	
	var a = Db.map;
	
	//for(var i in mapList)	Db.map[mapList[i]] = require('./map/'+mapList[i]).map;		//not longer using. each map must be a quest
	
	for(var m in a){
		a[m] = a[m]();
		a[m].id = m;
		Map.creation.model(a[m]);
	}
	
}

Init.db.map.template = function(){
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
	
	var newaddon = Tk.deepClone(model.addon);
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
		timer:version === 'MAIN' ? 1/0 : 5*60*1000/25,
		list:{all:{},player:{},bullet:{},npc:{},anim:{},actor:{},drop:{}},		//acts like List.all (for faster activeList and collisionRect)
		
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
		
	var strGrid = Tk.stringify(map.grid);
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
	if(Map.getVersion(map.id) === "MAIN") return; //cant delete main maps
	for(var i in map.list.actor) Actor.remove(List.all[i]);
	for(var i in map.list.drop) Drop.remove(List.all[i]);
	for(var i in map.list.bullet) Bullet.remove(List.all[i]);
	for(var i in map.list.strike) Strike.remove(List.all[i]);
	
}


