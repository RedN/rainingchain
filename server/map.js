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

Map.getModel = function(name){
	return name.split('@')[0];
}	

Map.getVersion = function(name){
	return name.replace(Map.getModel(name),"").replace("@","");
}

Map.convertSpot = function(d){
	if(!d.spot) return;
	d.x = d.spot.x;
	d.y = d.spot.y;
	d.map = d.spot.map;
	d.addon = d.spot.addon;
	delete d.spot;
}

Map.load = function(map){
	for(var j in map.addon){
		if(map.addon[j].load)
			map.addon[j].load(map.addon[j].spot);
	}
}

Map.loop = function(map){
	//Time Out Instance
	if(Loop.interval(60*1000/40)){		//each min
		if(map.list.player.$length() === 0){
			map.timer -= 60*1000/25;
			if(map.timer <= 0){
				Map.remove(map);
			}
			return;		//no addon if nobody in map
		}	
	}
	
	for(var j in map.addon){
		if(map.addon[j].loop)
			map.addon[j].loop(map.addon[j].spot);
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
	//return list of players NAME that are in a certain model of instance
	var plist = [];
	for(var i in List.map[id].list.player){
		if(List.all[i]){
			plist.push(List.all[i].name);
		}
	}
	return plist;
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
		lvlMod = Math.min(lvlMod,1);
		
		Actor.permBoost(act,'mapLevelDifference',[
			{'stat':'globalDmg','value':lvlMod,'type':'***'},
			{'stat':'globalDef','value':lvlMod,'type':'***'},
		]);
		
	}
}


//Quest related
Map.collisionRect = function(id,rect,type,cb){	//used in map loop. return array is no cb, else call func foreach
	var array = [];
	for(var i in List.map[id].list[type]){
		var act = List.all[i];		//TOFIX test if player exist
		if(!act){ DEBUG(0,'act dont exist ' + id); continue; }
		if(Collision.PtRect(act,rect)){
			array.push(i);
		}
	}
	if(!cb) return array;
	for(var i in array)	cb(array[i]);	
}

Map.getSpot = function(id,addon,spot){
	var a = Db.map[Map.getModel(id)].addon[addon].spot[spot];	//cant use list cuz map could not be created yet
	
	if(!a){ DEBUG(0,'spot not found ' + id + addon + spot); return }
	return {
		x:a.x,
		y:a.y,
		map:id,
	}
}

Map.getAddon = function(id,addon){
	return List.map[id].addon[addon];	
}

Map.getEnemy = function(map,tag){
	var list = List.map[map].list.npc;
	for(var i in list){
		if(List.all[i].tag === tag)
			return List.all[i];
	}
	return null;
}





