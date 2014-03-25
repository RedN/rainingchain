Loop = function(){
	try {
	Loop.frameCount++;	
    Test.loop();
    Performance.loop();
	
	Loop.Bullet();
	Loop.Strike();
	Loop.Group();
	Loop.Actor();
	Loop.Drop();
	Loop.Map();
	
	Change.update();
	Change.send();
	
	Loop.logOut();
	} catch(err){ logError(err); }
}
Loop.frameCount = 0; 

Loop.interval = function(num){
	return Loop.frameCount % num === 0;
}

Loop.Actor = function(){
	for (var i in List.actor ){     
	    Actor.loop(List.actor[i]); 
	}
}

Loop.Bullet = function (){
	for(var i in List.bullet){
		Bullet.loop(List.bullet[i]);
	}
	if(Loop.interval(25)){
		Bullet.loop.mapMod();	
	}
}

Loop.Strike = function(){
	for(var i in List.strike){
		Strike.loop(List.strike[i]); 
	}
}

Loop.Drop = function(){
	for(var i in List.drop){ 
		var drop = List.drop[i];
		drop.timer--; 
		if(drop.timer <= 0){ Drop.remove(drop); }
	}
}

Loop.Map = function(){
	for(var i in List.map){
		Map.loop(List.map[i]);		
	}
}

Loop.Group = function(){
	for(var i in List.group){
		var g = List.group[i];
		var list = g.list;
		var bool = true;
		
		for(var j in list){
			var e = list[j];
			if(!e){ delete list[j];  continue; }
			if(!e.dead){ bool = false; }
			if(e.dead && e.deleteOnceDead){
				Actor.remove(e);
				delete list[j];
				continue;
			}
		}
		if(!Object.keys(g.list)){ delete List.group[i]; continue; } //if deleted all enemies in group
		
		if(bool){ //aka all dead
			g.respawn--;
			if(g.respawn <= 0){
				Actor.creation.group.apply(this,g.param); 
				for(var j in list) Actor.remove(list[j]);				
				delete List.group[i];
				continue;
			}
		}	
	}
}

Loop.logOut = function(){
	//Check inactivity of players 
	for(var i in List.socket){
		var socket = List.socket[i];
		socket.timer += 40;		
		socket.globalTimer += 40;		
		if((socket.timer >= Server.frequence.inactivity || socket.globalTimer >= Server.frequence.disconnect || socket.toRemove) && !socket.beingRemoved){
			Sign.off(i,'Disconnected due to inactivity.');
		}
		if(socket.removed)	Sign.off.remove(i);
	}
	for(var i in List.main)	if(!List.socket[i]){
		Sign.off.remove.safe(i);
	}
}

ActiveList = {};
ActiveList.test = function(act,obj){
	//Test used to know if obj should be in activeList of act.
	if(!obj){ return false; }
	if(act.id === obj.id){ return false; }
	if(!obj.viewedIf){ return false; }
	if(obj.viewedIf === 'false'){ return false; }
	if(act.map !== obj.map){ return false; }
	if(obj.dead){ return false; }
	if(typeof obj.viewedIf === 'function' && !obj.viewedIf(act.id,obj.id)){ return false; }
	if(typeof obj.viewedIf === 'object' && obj.viewedIf.indexOf(act.id) === -1){ return false; }
	
	var pt = {'x':obj.x,'y':obj.y};
	var rect = [act.x-800,act.x+800,act.y-600,act.y+600];
	
	return Collision.PtRect(pt,rect);
}

ActiveList.add = function(bullet){
	for(var i in List.actor){
		var player = List.actor[i];
		if(!player) continue;
		
		if(ActiveList.test(player,bullet)){ 
			player.activeList[bullet.id] = bullet.id;
			if(player.type !== 'player' || bullet.type === 'strike'){ 
				bullet.viewedBy[player.id] = 1; 
			}
		}
	}
}

ActiveList.remove = function(b){
	if(!b) return;
	for(var i in b.viewedBy){
		if(!List.all[i]) continue;	//quick fix
		if(List.all[i].removeList) List.all[i].removeList.push(b.publicId || b.id);
        delete List.all[i].activeList[b.id];
	}
}

removeAny = function(act){
	if(!act) return;
	if(act.type === 'bullet') Bullet.remove(act);
	else if(act.type === 'enemy') Actor.remove(act);
	else if(act.type === 'player') Sign.off(act.id);
	else if(act.type === 'drop') Drop.remove(act);
	else if(act.type === 'strike') Strike.remove(act);
	else if(act.type === 'strike') Strike.remove(act);
}




