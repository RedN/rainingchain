//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Main','Bullet','Strike','Sign','Map','Drop','Debug','Server','Collision'],['ActiveList']));
if(SERVER) eval('var ActiveList;');
(function(){ //}
//activelist used: boss, target, mapMod, chat, button, send
//bullet: Collision.bulletActor, 

ActiveList = exports.ActiveList = {};	//Actor.loop.activeList is where the update happens
var LIST = ActiveList.LIST = {};
ActiveList.test = function(act,obj){	
	//Test used to know if obj should be in activeList of act.
	//optimization: test only once for each pair. ex: act.activeListAlreadyTest
	if(!obj){ return false; }
	if(act.id === obj.id){ return false; }
	if(!obj.viewedIf || !act.viewedIf){ return false; }
	if(obj.viewedIf === 'false' || act.viewedIf === 'false'){ return false; }
	if(act.map !== obj.map){ return false; }
	if(obj.dead || act.dead){ return false; }
	if(typeof obj.viewedIf === 'function' && (!act.isActor || !obj.viewedIf(act.id,obj.id))){ return false; }
	if(typeof act.viewedIf === 'function' && (!obj.isActor || !act.viewedIf(obj.id,act.id))){ return false; }
	if(typeof obj.viewedIf === 'object' && obj.viewedIf.indexOf(act.id) === -1){ return false; }
	if(typeof act.viewedIf === 'object' && act.viewedIf.indexOf(obj.id) === -1){ return false; }
	
	var rect = {x:act.x-800,width:1600,y:act.y-600,height:1200};
	return Collision.testPtRect(obj,rect);
}

ActiveList.update = function(act){	//called by npc in loop
	var tested = {};
	//Test Already in List if they deserve to stay
	for(var j in act.activeList){
		tested[j] = 1;
		if(!ActiveList.test(act,LIST[j])){
			delete LIST[j].activeList[act.id];
			delete act.activeList[j];
			
			
			if(act.type === 'player'){
				var fadeout = LIST[j].type === 'bullet' ? 3 : 12;
				if(act.removeList[j] === undefined) act.removeList[j] = fadeout;	//case manually doing it for chest, switch
			}
		}
	}
	
	//Add New Boys
	var map = Map.get(act.map);
	for(var j in map.list.entity){
		if(tested[j]) continue;	//no need to test again

		if(ActiveList.test(act,LIST[j])){
			act.activeList[j] = ActiveList.NEVER_SEEN;			//for player, if 1:need init, if 2:just update
			LIST[j].activeList[act.id] = ActiveList.NEVER_SEEN;	
		}
	}
}

ActiveList.init = function(act){	//when Map.enter
	var map = Map.get(act.map);
	if(!map) return ERROR(3,'no map');
	if(act.type === 'bullet'){
		for(var j in map.list.actor){	//attack only need to check actor
			if(ActiveList.test(act,LIST[j])){
				act.activeList[j] = ActiveList.NEVER_SEEN;				//needs to be there for collision detect
				if(LIST[j].type === 'player') 
					LIST[j].activeList[act.id] = ActiveList.NEVER_SEEN;	//only players should be aware of bullets. otherwise, enemy becomes active
				//for player, if 1:need init, if 2:just update
			}
		}
		return;
	}
	if(act.type === 'player' || act.awareNpc){
		for(var j in map.list.entity){
			if(ActiveList.test(act,LIST[j])){
				act.activeList[j] = ActiveList.NEVER_SEEN;
				LIST[j].activeList[act.id] = ActiveList.NEVER_SEEN;	
			}
		}
		return;
		//bug: if both player tele same time, player is in both add and remove list. fixed in Receive.js	
	}	
	if(act.type === 'npc'){	
		for(var j in map.list.actor){	//only check for player nearby
			if(LIST[j].type === 'player' && ActiveList.test(act,LIST[j])){
				act.activeList[j] = ActiveList.NEVER_SEEN;
				LIST[j].activeList[act.id] = ActiveList.NEVER_SEEN;	
			}
		}
		return;
	}	
}

ActiveList.clear = function(act){	//called when living forever
	if(!act) return ERROR(2,'actor dont exist');
		
	for(var i in act.activeList){
		var viewer = LIST[i];
		if(!viewer) continue; 	//normal for npc because when npc dies, he cant tell the bullet cuz not in activeList
		//add yourself in removeList of others
		if(Actor.isPlayer(viewer)) viewer.removeList[act.id] = act.type === 'bullet' ? 3 : 24;
        
		//add them to your list
		if(Actor.isPlayer(act)) act.removeList[viewer.id] = viewer.type === 'bullet' ? 3 : 24;
		
		delete viewer.activeList[act.id];
	}
	
	act.activeList = {};	
}

ActiveList.removeAny = function(act){
	if(SERVER){
		if(typeof act === 'string') act = LIST[act];
		if(!act) return ERROR(2,'actor dont exist');
		if(act.type === 'bullet') Bullet.remove(act);
		else if(act.type === 'npc') Actor.remove(act);
		else if(act.type === 'player') Sign.off(act.id);
		else if(act.type === 'drop') Drop.remove(act);
		else if(act.type === 'strike') Strike.remove(act);
		return;
	}
	var id = act.id || act;
	Bullet.removeFromList(id);
	Strike.removeFromList(id);
	Actor.removeFromList(id);
	Drop.removeFromList(id); 
	ActiveList.removeFromList(id); 
}


ActiveList.NEVER_SEEN = 1;
ActiveList.SEEN = 2;

ActiveList.get = function(id){
	return ActiveList.LIST[id] || null;
}

ActiveList.addToList = function(bullet){
	ActiveList.LIST[bullet.id] = bullet;
}
ActiveList.removeFromList = function(id){
	delete ActiveList.LIST[id]; 
}


ActiveList.removeInactive = function(){ //client
	for(var i in LIST){
		var act = LIST[i];
		if(!act || ++act.toRemove > 105){
			ActiveList.removeAny(i);
		}	//aka no update for 4 sec
	}
}
})();