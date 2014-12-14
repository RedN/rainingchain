//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Boost','Actor','Strike','MapModel','Drop','Bullet','ActiveList','Collision','Map','ActorGroup']));

var Map = exports.Map = function(namemodel,version,creatorkey){	//create instance of map. version is usually the player name
	var tmp = {
		id:'',
		lvl:0,
		addon:{},	//needed cuz spot custom
		model:'',
		version:'',
		timer:5*60*1000/25,
		list:{entity:{},player:{},bullet:{},npc:{},anim:{},actor:{},drop:{},group:{}},		//acts like all but for faster activeList and collisionRect
	};
	tmp.version = version || 'MAIN';
	tmp.id = namemodel + '@' + tmp.version;
	var model = MapModel.get(namemodel);
	if(!model) return ERROR(3,'invalid map model',namemodel);
	tmp.addon = Tk.deepClone(model.addon);
	
	for(var i in tmp.addon){ for(var j in tmp.addon[i].spot){
		tmp.addon[i].spot[j].map = tmp.id;
		tmp.addon[i].spot[j].addon = i;
		tmp.addon[i].spot.map = tmp.id;
	}}
	tmp.name = model.name;
	tmp.model = model.id;
	tmp.lvl = model.lvl;
	tmp.timer = tmp.version === 'MAIN' ? 1/0 : 5*60*1000/25;
	
	LIST[tmp.id] = tmp;
	
	Map.load(tmp,creatorkey);
	return tmp;
}

Map.TRANSITION_SPOT = {x:0,y:0,map:'QfirstTown-transitionMap@MAIN'};

var LIST = Map.LIST = {};	//for debug only

Map.getModel = function(name){	//kinda more related to Actor.Spot
	return name.split('@')[0];
}	

Map.getVersion = function(name){
	return name.replace(Map.getModel(name),"").replace("@","")	 || 'MAIN';
}

Map.getInstanceType = function(name){
	if(name.have('@MAIN')) return 'public';
	if(name.have('@@')) return 'solo';
	if(name.have('@')) return 'party';
	else return 'public';
}


Map.load = function(map,key){
	for(var j in map.addon){
		if(map.addon[j].load)
			map.addon[j].load(map.addon[j].spot,key);
	}
}

Map.loop = function(){	//static
	Map.loop.FRAME_COUNT++;
	for(var i in LIST)
		Map.loop.forEach(LIST[i]);
}
Map.loop.FRAME_COUNT = 0;

Map.loop.forEach = function(map){
	//Time Out Instance
	if(Map.loop.FRAME_COUNT % Math.floor(10*1000/25) === 0){		//each 10 sec, incase big bug...
		if(!map.isTown && map.list.player.$isEmpty()){
			Map.remove(map);
			return;
		}	
	}
	
	for(var j in map.addon){
		if(map.addon[j].loop && !map.list.player.$isEmpty()){
			map.addon[j].loop(map.addon[j].spot);
		}
	}
}


Map.leave = function(act,map,loggingout){
	map = map || act.map;
	var oldmap = LIST[map];
	if(!oldmap) return;	//ex: teleport after login
	
	ActiveList.clear(act);
	
	delete oldmap.list.actor[act.id];
	if(oldmap.list[act.type]) delete oldmap.list[act.type][act.id];
	
	if(act.type === 'player' && loggingout !== true){
		for(var i in oldmap.addon)
			if(oldmap.addon[i].playerLeave)
				oldmap.addon[i].playerLeave(act.id,map,oldmap.addon[i].spot,oldmap.addon[i].variable,oldmap);
	}
	if(!oldmap.isTown && act.type === 'player' && oldmap.list.player.$isEmpty())
		Map.remove(map);
	
}

Map.enter = function(act,force){
	var map = act.map;
	var newmap = LIST[map];
	if(!newmap){
		if(!force) return ERROR(3,'map dont exist',map);
		newmap = Map(Map.getModel(map),Map.getVersion(map),act.id);
	}
	Map.addToEntityList(newmap,act.type,act.id,true);
	
	ActiveList.init(act);
	
	if(act.type === 'player'){
		for(var i in newmap.addon)
			if(newmap.addon[i].playerEnter)
				newmap.addon[i].playerEnter(act.id,act.map,newmap.addon[i].spot,newmap.addon[i].variable,newmap);
	}
}

//ts("Map.remove(LIST[p.map])");
Map.remove = function(map){
	if(typeof map === 'string') map = LIST[map];
	for(var i in map.list.bullet) Bullet.remove(i);	//need to be first because activeList has npc
	for(var i in map.list.group) ActorGroup.remove(i);
	for(var i in map.list.player){
		ERROR(4,'deleting map and player inside',map.id);   //should not happen
		Actor.teleport.town(Actor.get(i),true);
	}	
	for(var i in map.list.npc) Actor.remove(i);
	for(var i in map.list.drop) Drop.remove(i);
	for(var i in map.list.strike) Strike.remove(i);
	delete LIST[map.id];
}


Map.getCollisionRect = function(id,rect,type,cb){	//ONLY for actor, used in map loop. return array is no cb, else call func foreach
	var array = [];	
	for(var i in LIST[id].list[type]){
		var act = Actor.get(i);
		if(!act){ ERROR(3,'act dont exist',id,i); continue; }
		if(Collision.testPtRect(act,rect))	array.push(i);
	}
	if(!cb) return array;
	for(var i in array)	cb(array[i]);	
}



Map.instance = {};
Map.instance.getMapWithModel = function(model){	//return array of map with model
	var list = [];
	for(var i in LIST){
		if(Map.getModel(i) === model){
			list.push(LIST[i].id);
		}
	}
	return list;
}

Map.instance.getPlayerName = function(id){ 	//return list of players NAME that are in a certain model of instance
	var plist = [];
	for(var i in LIST[id].list.player){
		var act = Actor.get(i);
		if(!act){ ERROR(2,'no act'); continue;}
		plist.push(act.name);
	}
	return plist;
}

Map.addToEntityList = function(map,list,id,includeInEntity){
	if(map.list.actor.$length() > 1000) return ERROR(3,'too many monster',map.id);
	if(map.list.bullet.$length() > 10000) return ERROR(3,'too many bullet',map.id);
	
	map.list[list][id] = id;
	
	if(includeInEntity)	//aka !group !anim
		map.list.entity[id] = id;
		
	if(list === 'player' || list === 'npc')
		map.list.actor[id] = id;
}

Map.removeFromEntityList = function(map,list,id){
	delete map.list[list][id];
	delete map.list.actor[id];
	delete map.list.entity[id];
}


Map.removeAllAnim = function(){
	for(var i in LIST){
		LIST[i].list.anim = {};
	}
}



Map.getSpot = function(map,addon,spot){
	var res = map.addon[addon] && map.addon[addon].spot[spot];
	if(!res) return ERROR(3,'spot dont exist',map.id,addon,spot);
	return res;
}

Map.getPlayerInMap = function(map){
	return Object.keys(map.list.player);
}
Map.getNpcInMap = function(map){
	return Object.keys(map.list.npc);
}
Map.getActorInMap = function(map){
	return Map.getPlayerInMap(map).concat(Map.getNpcInMap(map));
}
Map.get = function(id){
	return LIST[id] || null;
}






