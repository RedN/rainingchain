//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Actor','Main','Bullet','Strike','Change','Sign','Map','Drop','Test','Server','Performance','Collision'],['Loop','Activelist','Group']));

var LOOPLOGOUT = 10;
var Loop = exports.Loop = function(){
	try { if(Loop.error()) return;	} catch(err){ ERROR.err(3,err);  } //aka reset
	
	Loop.frame++;
	try { Performance.loop(); } catch(err){ ERROR.err(3,err);  }
	try { Test.loop(); } catch(err){ ERROR.err(3,err);  }
	
	try { Collision.loop(); } catch(err){ ERROR.err(3,err);  }
    try { Loop.bullet(); } catch(err){ ERROR.err(3,err);  }
	try { Loop.strike(); } catch(err){ ERROR.err(3,err);  } 
	try { Loop.group(); } catch(err){ ERROR.err(3,err);  }
	try { Loop.actor(); } catch(err){ ERROR.err(3,err);  }
	try { Loop.main(); } catch(err){ ERROR.err(3,err);  }
	try { Loop.drop(); } catch(err){ ERROR.err(3,err);  }
	try { Loop.map(); } catch(err){ ERROR.err(3,err);  }
	try { if(!Loop.interval(500)) Loop.party(); } catch(err){ ERROR.err(3,err);  }
	
	try { Change.update(); } catch(err){ ERROR.err(3,err);  }
	try { Change.send(); } catch(err){ ERROR.err(3,err);  } //REAL PROBLEM...
	try { if(Loop.interval(LOOPLOGOUT)) Loop.logOut(); } catch(err){ ERROR.err(3,err);  }
	//REAL PROBLEM...
}
Loop.frame = 0; 

Loop.interval = function(num){
	return Loop.frame % num === 0;
}

Loop.actor = function(){
	for (var i in List.actor ){     
	    Actor.loop(List.actor[i]); 
	}
}
Loop.main = function(){
	for (var i in List.main){     
		Main.loop(List.main[i]);
	}
}
Loop.bullet = function (){
	for(var i in List.bullet){
		Bullet.loop(List.bullet[i]);
	}
}

Loop.strike = function(){
	for(var i in List.strike){
		Strike.loop(List.strike[i]); 
	}
}

Loop.drop = function(){
	for(var i in List.drop){ 
		var drop = List.drop[i];
		if(--drop.timer <= 0){ Drop.remove(drop); }
	}
}

Loop.map = function(){
	for(var i in List.map){
		Map.loop(List.map[i]);		
	}
}

Loop.group = function(){
	for(var i in List.group){
		Group.loop(List.group[i]);
	}
}

Loop.logOut = function(){
	//Check inactivity of players 
	for(var i in List.socket){
		var socket = List.socket[i];
		socket.timer += 40*LOOPLOGOUT;		//gets reset when input
		socket.globalTimer += 40*LOOPLOGOUT;		
		if(((!Server.isAdmin(i) && socket.timer >= Server.frequence.inactivity) || socket.globalTimer >= Server.frequence.disconnect || socket.toRemove) && !socket.beingRemoved){
			Sign.off(i,'Disconnected due to inactivity.');
		}
		if(socket.removed)	Sign.off.remove(i);
	}
	for(var i in List.main){
		if(!List.socket[i]){
			ERROR(2,'socket disconnect but main not removed');
			Sign.off.remove.safe(i);
		}
	}
}

Loop.party = function(){	
	for(var i in List.party){
		if(List.party[i].list.$empty()) delete List.party[i]
	}

}

Loop.error = function(){
	ERROR.count = Math.max(ERROR.count - 0.1,0);
	if(ERROR.count > 100){
		Server.reset(ERROR.last);
		ERROR.count = 0;
		return true;
	}
}

var Activelist = exports.Activelist = {};	//Actor.loop.activeList is where the update happens
Activelist.test = function(act,obj){	
	//Test used to know if obj should be in activeList of act.
	//optimization: test only once for each pair. ex: act.activeListAlreadyTest
	if(!obj){ return false; }
	if(act.id === obj.id){ return false; }
	if(!obj.viewedIf || !act.viewedIf){ return false; }
	if(obj.viewedIf === 'false' || act.viewedIf === 'false'){ return false; }
	if(act.map !== obj.map){ return false; }
	if(obj.dead || act.dead){ return false; }
	if(typeof obj.viewedIf === 'function' && !obj.viewedIf(act.id,obj.id)){ return false; }
	if(typeof act.viewedIf === 'function' && !act.viewedIf(obj.id,act.id)){ return false; }
	if(typeof obj.viewedIf === 'object' && obj.viewedIf.indexOf(act.id) === -1){ return false; }
	if(typeof act.viewedIf === 'object' && act.viewedIf.indexOf(obj.id) === -1){ return false; }
	
	var rect = [act.x-800,act.x+800,act.y-600,act.y+600];
	
	return Collision.ptRect(obj,rect);
}

Activelist.update = function(act){	//called by npc in loop
	var tested = {};
	//Test Already in List if they deserve to stay
	for(var j in act.activeList){
		tested[j] = 1;
		if(!Activelist.test(act,List.all[j])){
			delete List.all[j].activeList[act.id];
			delete act.activeList[j];
			
			
			if(act.type === 'player'){
				var fadeout = List.all[j].type === 'bullet' ? 3 : 12;
				var id = List.all[j].publicId || j;
				if(act.removeList[id] === undefined) act.removeList[id] = fadeout;	//case manually doing it for chest, switch
			}
		}
	}
	
	//Add New Boys
	for(var j in List.map[act.map].list.all){
		if(tested[j]) continue;	//no need to test again

		if(Activelist.test(act,List.all[j])){
			act.activeList[j] = 1;			//for player, if 1:need init, if 2:just update
			List.all[j].activeList[act.id] = 1;	
		}
	}
}

Activelist.init = function(act){	//when Map.enter
	if(act.type === 'bullet' || act.type === 'strike'){
		for(var j in List.map[act.map].list.actor){	//attack only need to check actor
			if(Activelist.test(act,List.all[j])){
				act.activeList[j] = 1;				//needs to be there for collision detect
				if(List.all[j].type === 'player') List.all[j].activeList[act.id] = 1;	//only players should be aware of bullets. otherwise, enemy becomes active
				//for player, if 1:need init, if 2:just update
			}
		}
		return;
	}
	if(act.type === 'player' || act.awareNpc){
		for(var j in List.map[act.map].list.all){
			if(Activelist.test(act,List.all[j])){
				act.activeList[j] = 1;
				List.all[j].activeList[act.id] = 1;	
			}
		}
		return;
		//bug: if both player tele same time, player is in both add and remove list. fixed in Receive.js	
	}	
	if(act.type === 'npc'){	
		for(var j in List.map[act.map].list.actor){	//only check for player nearby
			if(List.all[j].type === 'player' && Activelist.test(act,List.all[j])){
				act.activeList[j] = 1;
				List.all[j].activeList[act.id] = 1;	
			}
		}
		return;
	}	
}

Activelist.clear = function(act){	//called when living forever
	if(!act){ ERROR(2,'actor dont exist'); return; }
	
	for(var i in act.activeList){
		var viewer = List.all[i];
		if(!viewer){ continue; }	//normal for npc because when npc dies, he cant tell the bullet cuz not in activeList
		//add yourself in removeList of others
		if(viewer.type === 'player') viewer.removeList[act.publicId || act.id] = act.type === 'bullet' ? 3 : 24;
        
		//add them to your list
		if(act.type === 'player') act.removeList[viewer.publicId || act.id] = viewer.type === 'bullet' ? 3 : 24;
		
		delete viewer.activeList[act.id];
	}

	
	act.activeList = {};	
}

Activelist.removeAny = function(act){
	if(typeof act === 'string') act = List.all[act];
	if(!act) { ERROR(2,'actor dont exist'); return; }
	if(act.type === 'bullet') Bullet.remove(act);
	else if(act.type === 'npc') Actor.remove(act);
	else if(act.type === 'player') Sign.off(act.id);
	else if(act.type === 'drop') Drop.remove(act);
	else if(act.type === 'strike') Strike.remove(act);
}


//activelist used: boss, target, mapMod, chat, button, send
//bullet: Collision.bulletActor, 


var Group = exports.Group = {};

Group.loop = function(g){
	var alldead = true;
	
	for(var i in g.list){
		var e = List.actor[i];	//bug when removing map
		if(!e){ delete g.list[i]; ERROR(2,'no actor');  continue; }
		if(!e.dead){ alldead = false; }
	}
	
	if(alldead){	
		if(g.respawn === false){ return Group.remove(g); } 
	
		if(--g.respawn <= 0){	//= false if no respawn like summon
			Actor.creation.group(g.param[0],g.param[1]); 	
			Group.remove(g);
		}
		
	}	

}

Group.remove = function(g){
	if(!g) return ERROR(3,'no group');
	for(var i in g.list){
		var e = List.actor[i];
		if(!e){ ERROR(2,'no actor');  continue; }
		Actor.remove(e);
	}
	delete List.group[g.id];
	delete List.map[g.map].list.group[g.id];
}












