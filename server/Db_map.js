//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Tk','Init','Bullet','Strike','Group','Map','Drop']));
var astar = require('astar');

Db.map = {};
//var mapList = [];

Init.db.map = function (){	
	for(var i in Db.map){
		Db.map[i].id = i;
		Db.map[i] = Map.creation.model(Db.map[i]);
	}
}

Map.template = function(){
	return Tk.useTemplate(Map.template.model(),{
		model:'',
		version:'',
		alwaysExist:false,
		timer:5*60*1000/25,
		list:{all:{},player:{},bullet:{},npc:{},anim:{},actor:{},drop:{},group:{}},		//acts like List.all (for faster activeList and collisionRect)
	});
}

Map.template.model = function(){
	return {
		id:'',
		addon:{},
		name : "No Name Map",
		tileset : 'v1.1',
		grid :{player:[[]],npc:[[]],bullet:[[]]},
		lvl:0,
		fall:null,
		graphic:'',	//if use same graphic than other map
	}
}
Map.template.addon = function(){
	return {
		load:null,
		loop:null,
		playerEnter:null,
		playerLeave:null,
		spot:{},
		path:{},
		variable:{},
	}
}
Map.creation = function(namemodel,version,creatorkey){	//create instance of map. version is usually the player name
	version = version || 'MAIN';
	var newid = namemodel + '@' + version;
	var model = Db.map[namemodel];

	var newaddon = {};
	for(var i in model.addon) newaddon[i] = Tk.useTemplate(Map.template.addon(),Tk.deepClone(model.addon[i]));
	
	for(var i in newaddon){
		for(var j in newaddon[i].spot){
			newaddon[i].spot[j].map = newid;
			newaddon[i].spot[j].addon = i;
			newaddon[i].spot.map = newid;
		}
	}
	
	var map = Tk.useTemplate(Map.template(),{
		id:newid,
		name:model.name,
		model:model.id,
		version:version,
		alwaysExist:version === 'MAIN' && model.alwaysExist,
		graphic:model.graphic,
		grid:Db.map[model.graphic].grid,
		fall:model.fall,
		lvl:model.lvl,
		addon:newaddon,
		timer:version === 'MAIN' ? 1/0 : 5*60*1000/25,
	});
	
	List.map[newid] = map;
	
	Map.load(List.map[newid],creatorkey);
	return newid;
}

Map.creation.model = function(map){	//create the model that will be in Db.map | Model will then be modded by quest
	map = Tk.useTemplate(Map.template.model(),map);
	
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

//ts("Map.remove(List.map[p.map])");
Map.remove = function(map){
	if(map.alwaysExist) return; //cant delete main maps
	for(var i in map.list.bullet) Bullet.remove(List.all[i]);	//need to be first because activeList has npc
	for(var i in map.list.group) Group.remove(List.group[i]);
	for(var i in map.list.player){
		ERROR(4,'deleting map and player inside',map.id);   //should not happen
		Actor.teleport.town(List.all[i],true);
	}	
	for(var i in map.list.actor) Actor.remove(List.all[i]);
	for(var i in map.list.drop) Drop.remove(List.all[i]);
	for(var i in map.list.strike) Strike.remove(List.all[i]);
	delete List.map[map.id];
}



