//// BROKEN in clientLoop updatePermBoost

//working on Send (aka send.js)

//MAIN LOOP//
Loop = function(){
    Test.loop();
    
	Loop.Bullet();
	Loop.Strike();
	Loop.EnemyGroup();
	Loop.Mortal();
	Loop.Drop();
	Loop.Shop();
	
	Change.update();
	Change.send();
	
	Loop.logOut();
	
}

Loop.Mortal = function(){
	for (var i in mList ){     
	    Mortal.loop(mList[i]); 
	}
}

Loop.Bullet = function (){
	for(var i in bList){
		Bullet.loop(bList[i]);
	}
}
Loop.Strike = function(){
	for(var i in sList){
		Strike.loop(sList[i]); 
	}
}


Loop.EnemyGroup = function(){
	for(var i in egList){
		var g = egList[i];
		var list = g.list;
		var bool = true;
		
		for(var j in list){
			var e = list[j];
			if(!e){ delete list[j];  continue; }
			if(!e.dead){ bool = false; }
			if(e.dead && e.deleteOnceDead){
				Mortal.remove(e);
				delete list[j];
				continue;
			}
		}
		if(!Object.keys(g.list)){ delete egList[i]; continue; } //if deleted all enemies in group
		
		if(bool){ //aka all dead
			g.respawn--;
			if(g.respawn <= 0){
				Mortal.creation.group.apply(this,g.param); 
				delete egList[i];
				continue;
			}
		}	
	}
}

//Check inactivity of players 
Loop.logOut = function(){
	for(var key in socketList){
		if(socketList[key].toRemove){
			disconnectPlayer(key,'Disconnected due to inactivity.');
		}
	}
}


//Test used to know if obj should be in activeList of mort.
ActiveList = {};
ActiveList.test = function(mort,obj){
	if(!obj){ return false; }
	if(!obj.viewedIf){ return false; }
	if(typeof obj.viewedIf === 'function' && !obj.viewedIf(mort)){ return false; }
	if(mort.map != obj.map){ return false; }
	if(obj.dead){ return false; }
	
	var pt = {'x':obj.x,'y':obj.y};
	var rect = [mort.x-800,mort.x+800,mort.y-600,mort.y+600];
	
	return Collision.PtRect(pt,rect);
}


ActiveList.add = function(bullet){
	for(var i in mList){
		if(ActiveList.test(mList[i],bullet)){ 
			mList[i].activeList[bullet.id] = bullet.id;
			if(mList[i].type != 'player' || bullet.type == 'strike'){ bullet.viewedBy[mList[i].id] = mList[i]; }
		}
	}
}

ActiveList.remove = function(b){
	for(var i in b.viewedBy){	
        delete b.viewedBy[i].activeList[b.id];
	}
}








