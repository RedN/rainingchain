//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Server','Main','ActiveList','Socket','Map','Actor','Performance','Anim','ItemList','Strike','Drop','Bullet'],['Send']));
var BISON = require('./client/js/shared/BISON');

var Send = exports.Send = {};
var LOOP100 = true;
	
Send.loop = function(){		// 1/2 times
	Send.loop.FRAME_COUNT++;
	if(Send.loop.FRAME_COUNT % 2 !== 0)	return;
		
	LOOP100 = Send.loop.FRAME_COUNT % 100 === 0;
	Socket.forEach(function(socket){
		if(!socket.clientReady) return;
		if(socket.key === Send.activeBotwatch.WATCHER) return;
		var info = Send.sendUpdate(socket.key,socket);
		
		if(socket.key === Send.activeBotwatch.WATCHED){
			var watcherSocket = Socket.get(Send.activeBotwatch.WATCHER);
			if(watcherSocket)
				watcherSocket.emit('change', info );
			else {
				Send.activeBotwatch.WATCHER = null;
				Send.activeBotwatch.WATCHED = null;
			}
		} 
			
		if(Send.loop.FRAME_COUNT % 10 === 0) 
			Performance.bandwidth('UPLOAD',info,socket,10);
	});
	Send.reset();
}
Send.loop.FRAME_COUNT = 0;


//send 31k string = 2 ms, send small = 0.02 ms
Send.sendUpdate = function(key,socket){
	var player = Actor.get(key);
	
	var sa = Send.template();
	
	//Update Private Player
	if(!player.privateChange.$isEmpty())
		sa.p = player.privateChange;
		
	//Remove List
	if(!player.removeList.$isEmpty()) 
		sa.r = player.removeList;
	
	//Main
	if(!Main.get(key).change.$isEmpty()) 
		sa.m = Main.get(key).change;
		
	//Update ActiveList
	for(var i in player.activeList){
		var obj = ActiveList.get(i);
		if(!obj){ delete player.activeList[i]; ERROR(2,'no act'); continue; }
		
		if(player.activeList[i] !== ActiveList.SEEN){		//Need to Init
			sa.i = sa.i || {};
			sa.i[obj.id] = Send.init(obj);
			player.activeList[i] = ActiveList.SEEN;
		} else {
			if(!obj.change.$isEmpty() || LOOP100){
				sa.u = sa.u || {};
				sa.u[obj.id] = obj.change;	//Only Update
			}
		}
	}
	
	
	
	//Anim
	var map = Map.get(player.map);
	for(var i in map.list.anim){
		var anim = Anim.get(i);
		if(!Send.testIncludeAnim(player,anim)) continue;
		sa.a = sa.a || [];
		sa.a.push(Send.init(anim));		
	}
	
	//Send
	if(BISON.active) sa = BISON.encode(sa);
	socket.emit('change', sa );
	return sa;
}

Send.template = function(){
	return {};
	/*	too slow to add them and remove if empty
		u:{},  //update (already init-ed)
		p:{},	//player
		m:{},	//main
		i:{},  //init (first time seen by player		
		r:{},	//removeList	
		a:[],  //animation
	}
	*/
}


Send.testIncludeAnim = function(player,anim){
	if(anim.target.type === 'id'){	//aka target is an obj
		var targ = Actor.get(anim.target.id);
		if(!targ) return;	//possible if died
		if(player.id === anim.target.id || ActiveList.test(player,targ)){
			return true;
		}
	}
	if(anim.target.type === 'position'){	//aka target is already in form {x:1,y:1,map:1}
		if(ActiveList.test(player,anim.target)){
			return true;
		}
	}
	return false;
}



Send.reset = function(){
	Anim.removeAll();
	Actor.resetChangeForAll();
	Main.resetChangeForAll();
}

//####################################
Send.init = function(obj){ //create object that has all info for the client to init the object
	if(obj.type == 'bullet') return Bullet.doInitPack(obj);
	else if(obj.type == 'strike') return Strike.doInitPack(obj);
	else if(obj.type == 'drop') return Drop.doInitPack(obj);
	else if(obj.type == 'npc' || obj.type == 'player')	return Actor.doInitPack(obj);
	else if(obj.type == 'anim') return Anim.doInitPack(obj);
}


//########################################



Send.activeBotwatch = function(key,towatch){
	Main.get(key).old = {};
	Actor.get(key).old = {};
	Actor.get(key).privateOld = {};

	Main.get(towatch).old = {};
	Actor.get(towatch).old = {};
	Actor.get(towatch).privateOld = {};
	Send.activeBotwatch.WATCHER = key;
	Send.activeBotwatch.WATCHED = towatch;
}
Send.activeBotwatch.WATCHER = null;
Send.activeBotwatch.WATCHED = null;






















