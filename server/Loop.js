Loop = function(){
	try {
	Loop.frameCount++;	
    Test.loop();
    
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
		if((socket.timer >= 10*60*1000 || socket.globalTimer >= 6*60*60*1000 || socket.toRemove) && !socket.beingRemoved){
			Sign.off(i,'Disconnected due to inactivity.');
		}
		if(socket.removed)	Sign.off.remove(i);
	}
	for(var i in List.main)	if(!List.socket[i]){
		Sign.off.remove.safe(i);
	}
}

ActiveList = {};
ActiveList.test = function(mort,obj){
	//Test used to know if obj should be in activeList of mort.
	if(!obj){ return false; }
	if(mort.id === obj.id){ return false; }
	if(!obj.viewedIf){ return false; }
	if(obj.viewedIf === 'false'){ return false; }
	if(mort.map !== obj.map){ return false; }
	if(obj.dead){ return false; }
	if(typeof obj.viewedIf === 'function' && !obj.viewedIf(mort.id,obj.id)){ return false; }
	if(typeof obj.viewedIf === 'object' && obj.viewedIf.indexOf(mort.id) === -1){ return false; }
	
	var pt = {'x':obj.x,'y':obj.y};
	var rect = [mort.x-800,mort.x+800,mort.y-600,mort.y+600];
	
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

removeAny = function(mort){
	if(!mort) return;
	if(mort.type === 'bullet') Bullet.remove(mort);
	else if(mort.type === 'enemy') Actor.remove(mort);
	else if(mort.type === 'player') Sign.off(mort.id);
	else if(mort.type === 'drop') Drop.remove(mort);
	else if(mort.type === 'strike') Strike.remove(mort);
	else if(mort.type === 'strike') Strike.remove(mort);
}




