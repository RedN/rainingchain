//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Quest','Server','Main','MapModel','ActiveList','ItemList','Map','Message','Drop','Collision','OptionList','Button','OptionList']));


Actor.RespawnLoc = function(recent,safe){
	return {
		recent:recent || Tk.deepClone(Actor.DEFAULT_SPOT),
		safe:safe || Tk.deepClone(Actor.DEFAULT_SPOT),
	};
}

Actor.RespawnLoc.compressDb = function(respawnLoc){
	respawnLoc.recent.x = Math.round(respawnLoc.recent.x);
	respawnLoc.recent.y = Math.round(respawnLoc.recent.y);
	respawnLoc.safe.x = Math.round(respawnLoc.safe.x);
	respawnLoc.safe.y = Math.round(respawnLoc.safe.y);
	return respawnLoc;
}

Actor.RespawnLoc.uncompressDb = function(respawnLoc){	//add verify
	if(!Actor.RespawnLoc.testIntegrity(respawnLoc)) return Actor.RespawnLoc();
	return respawnLoc;
}

Actor.RespawnLoc.testIntegrity = function(respawnLoc){
	if(!MapModel.get(respawnLoc.safe.map) || !MapModel.get(respawnLoc.recent.map)){
		ERROR(3,'invalid map respawnLoc',respawnLoc);
		return false;
	}
	return true;
}
	
	
Actor.Spot = function(x,y,map){
	return {
		x:x !== undefined ? x : Actor.DEFAULT_SPOT.x,
		y:y !== undefined ? y : Actor.DEFAULT_SPOT.y,
		map:map||Actor.DEFAULT_SPOT.map,	
	}
}

//#####################

Actor.setRespawn = function(act,spot,isSafe){
	spot = Tk.deepClone(spot);
	spot.map = Actor.teleport.getMapName(act,spot.map);
	
	act.respawnLoc.recent = spot;
	
	var type = Map.getInstanceType(spot.map);
	if(isSafe || type === 'public') act.respawnLoc.safe = Tk.deepClone(spot);
}

Actor.setRespawn.town = function(act){
	Actor.setRespawn(act,Actor.setRespawn.town.SPOT,true);
}

Actor.setRespawn.town.SPOT = {x:40*32,y:70*32,map:'QfirstTown-main@MAIN'};
	
Actor.getRespawnSpot = function(act){
	var recentmap = Actor.teleport.getMapName(act,act.respawnLoc.recent.map);
	if(Map.get(recentmap)) return act.respawnLoc.recent;
	return act.respawnLoc.safe;
}
	
Actor.getPartyName = function(act){
	return Main.get(act.id).party.id;
}

//############################

Actor.teleport = function(act,spot,force){
	act.x = spot.x;
	act.y = spot.y;
	var map = force ? spot.map : Actor.teleport.getMapName(act,spot.map);	//allow admin to go in solo instance
	
	if(act.map === map){ 			//regular teleport
		ActiveList.update(act);
		return; 
	}
	try {
		if(!Map.get(map)) //test if need to create instance
			Map(Map.getModel(map),Map.getVersion(map),act.id); 
	} catch(err){  ERROR.err(3,err);}
	
	try { 
		Map.leave(act); 
		act.map = map;
		Map.enter(act);
		ActiveList.update(act);
	} catch(err){  ERROR.err(3,err);}
	Actor.questMarker.update(act);
}

Actor.teleport.getMapName = function(act,map){
	if(!map) return act.map;
	if(!map.contains("@"))	return map + '@MAIN'; 				//main instance
	if(map.contains("@@"))	return map + act.username; 				//alone instance
	if(map[map.length-1] === '@') return map + Actor.getPartyName(act);	//party instance
	return map;
}



Actor.teleport.join = function(act,mort2){	//TOFIX
	if(mort2.map.contains("@@")) return false;
	
	Actor.teleport(act,mort2.respawnLoc.recent);
	return true;
}

Actor.teleport.town = function(act,respawntoo,force){
	if(force === false && !Main.quest.haveDoneTutorial(Actor.getMain(act))) 
		return Message.add(act.id,'You need to complete the tutorial to do that.');
	Actor.teleport(act,Actor.setRespawn.town.SPOT);
	if(respawntoo) Actor.setRespawn.town(act);
	return true;
}

Actor.teleport.fromQuest = function(act,spot,newmap,deleteold){
	var oldmap = act.map;
	if(newmap){
		var targetMap = Actor.teleport.getMapName(act,spot.map);
		var targetMapObject = Map.get(targetMap);
		if(targetMapObject){	//TODO verify if other players in instance
			if(oldmap === targetMap)	
				Actor.teleport(act,Map.TRANSITION_SPOT,true); //if player in map, teleport out before delete
			Map.remove(targetMapObject);
		}
	}
	Actor.teleport(act,spot);
	
	var oldmapObject = Map.get(oldmap);
	if(deleteold !== false && oldmapObject && oldmapObject.list.player.$isEmpty())
		Map.remove(oldmapObject);
}
	
	


















