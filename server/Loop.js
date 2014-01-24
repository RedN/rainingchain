Loop = function(){
	Loop.frameCount++;	
    Test.loop();
    
	Loop.Bullet();
	Loop.Strike();
	Loop.EnemyGroup();
	Loop.Actor();
	Loop.Drop();
	Loop.Map();
	
	Change.update();
	Change.send();
	
	Loop.logOut();
	
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
		//Time Out Instance
		if(Loop.frameCount % (60*1000/40) === 0){		//each min
			if(Map.instance.player(i).length === 0){
				List.map[i].timer -= 60*1000/25;
				if(List.map[i].timer <= 0){
					Map.remove(List.map[i]);
				}
			}	
		}
		
		for(var j in List.map[i].loop){
			List.map[i].loop[j](i);
		}
	}
}

Loop.EnemyGroup = function(){
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
				delete List.group[i];
				continue;
			}
		}	
	}
}

Loop.logOut = function(){
	//Check inactivity of players 
	for(var key in List.socket){
		var socket = List.socket[key];
		socket.timer += 40;		
		if((socket.timer >= 10*60*1000 || socket.toRemove) && !socket.beingRemoved){
			Sign.off(key,'Disconnected due to inactivity.');
		}
	}
}


ActiveList = {};
ActiveList.test = function(mort,obj){
	//Test used to know if obj should be in activeList of mort.
	if(!obj){ return false; }
	if(!obj.viewedIf){ return false; }
	if(typeof obj.viewedIf === 'function' && !obj.viewedIf(mort.id)){ return false; }
	if(obj.viewedIf === 'false'){ return false; }
	if(typeof obj.viewedIf === 'object' && obj.viewedIf.indexOf(mort.id) === -1){ return false; }
	if(mort.map !== obj.map){ return false; }
	if(obj.dead){ return false; }
	if(mort.id === obj.id){ return false; }
	
	var pt = {'x':obj.x,'y':obj.y};
	var rect = [mort.x-800,mort.x+800,mort.y-600,mort.y+600];
	
	return Collision.PtRect(pt,rect);
}


ActiveList.add = function(bullet){
	for(var i in List.actor){
		if(ActiveList.test(List.actor[i],bullet)){ 
			List.actor[i].activeList[bullet.id] = bullet.id;
			if(List.actor[i].type != 'player' || bullet.type == 'strike'){ bullet.viewedBy[List.actor[i].id] = List.actor[i].id; }
		}
	}
}

ActiveList.remove = function(b){
	if(!b) return;
	for(var i in b.viewedBy){
		if(!List.all[i]) continue;	//quick fix
		if(List.all[i].removeList) List.all[i].removeList[b.publicId || b.id] = 1;
        delete List.all[i].activeList[b.id];
	}
}

remove = function(mort){
	if(!mort) return;
	if(mort.type === 'bullet') Bullet.remove(mort);
	else if(mort.type === 'enemy') Actor.remove(mort);
	else if(mort.type === 'player') Sign.off(mort.id);
	else if(mort.type === 'drop') Drop.remove(mort);
	else if(mort.type === 'strike') Strike.remove(mort);
	else if(mort.type === 'strike') Strike.remove(mort);
}




