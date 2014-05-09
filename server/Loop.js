Loop = function(){
	try {
	Loop.frame++;
	Performance.loop();
	Test.loop();
   
	Collision.loop();
    Loop.bullet();
	Loop.strike();
	Loop.group();
	Loop.actor();
	Loop.drop();
	Loop.map();
	Loop.team();
	
	Change.update();
	Change.send();
	
	Loop.logOut();
	} catch(err){ ERROR.err(err);  } //REAL PROBLEM... should change that so each loop has own try...
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
		socket.timer += 40;		//gets reset when input
		socket.globalTimer += 40;		
		if((socket.timer >= Server.frequence.inactivity || socket.globalTimer >= Server.frequence.disconnect || socket.toRemove) && !socket.beingRemoved){
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

Loop.team = function(){
	if(!Loop.interval(50)) return;
	List.team = {};
	for(var i in List.main){
		var team = List.actor[i].team;
		List.team[team] = List.team[team] || {};
		List.team[team][i] = i;
	}

}

Activelist = {};	//Actor.loop.activeList is where the update happens
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
	
	return Collision.PtRect(obj,rect);
}

Activelist.update = function(act){	//called by npc in loop
	var tested = {};
	//Test Already in List if they deserve to stay
	for(var j in act.activeList){
		tested[j] = 1;
		if(!Activelist.test(act,List.all[j])){
			delete List.all[j].activeList[act.id];
			delete act.activeList[j];
			if(act.type === 'player') act.removeList.push(List.all[j].publicId || j);
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
	var range = 'all';
	if(act.type === 'bullet' || act.type === 'strike') range = 'actor';	//attack only need to check actor
	
	for(var j in List.map[act.map].list[range]){
		if(Activelist.test(act,List.all[j])){
			act.activeList[j] = 1;			//for player, if 1:need init, if 2:just update
			List.all[j].activeList[act.id] = 1;	
		}
	}
}



Activelist.clear = function(b){	//called when living forever
	if(!b){ ERROR(2,'actor dont exist'); return; }
	
	for(var i in b.activeList){
		var viewer = List.all[i];
		if(!viewer){ ERROR(2,'actor dont exist'); continue; }
		if(viewer.type === 'player') viewer.removeList.push(b.publicId || b.id);
        delete viewer.activeList[b.id];
	}
	b.activeList = {};	
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


Group = {};

Group.loop = function(g){
	var alldead = true;
	
	for(var i in g.list){
		var e = List.actor[i];	//bug when removing map
		if(!e){ delete g.list[i]; ERROR(2,'no actor');  continue; }
		if(!e.dead){ alldead = false; }
	}
	
	if(alldead && --g.respawn <= 0){ //aka all dead
		Actor.creation.group(g.param[0],g.param[1]); 		
		Group.remove(g);
	}	

}

Group.remove = function(g){
	for(var i in g.list){
		var e = List.actor[i];
		if(!e){ ERROR(2,'no actor');  continue; }
		Actor.remove(e);
	}
	delete List.group[g.id];
}






Activelist.loop = function(){	//unsued
	return;
	if(!Loop.interval(25)) return;

	for(var i in List.actor) List.actor[i].activeList = {};
	
	for(var i in List.main){
		var p = List.actor[i];
		
		
		
	
	
	}






}
//activelist used: boss, target, mapMod, chat, button, send
//bullet: Collision.BulletActor, 









