var Q = q.id;

var List, Db, db;


var get = function(key,attr){
	var mq = Quest.getMain(key,Q);
	var a = mq[attr];
	return typeof a === 'object' ? deepClone(a) : a;	//prevent setting
}

var set = function(key,attr,attr2,value){
	var mq = Quest.getMain(key,Q);
	
	if(attr === 'started'){
		mq[attr] = true;
		chat(key,"You started the quest '" + q.name + "'.");
		return;
	}	
	if(!mq.started){
		Chat.add(key,"You need to start this quest via the Quest Tab before making progress in it."); 
		return;
	}
	if(value === undefined) mq[attr] = attr2;	//aka deep = 1
	else mq[attr][attr2] = value;
	
	if(attr === 'complete' && attr2)	Quest.complete(key,Q);
}

var startQuest = function(key){
	Chat.question(key,{
		'func':function(key){
			Quest.start(key,Q);	
		},	
		'text':'Would you like to start the quest "' + q.name + '"?',
	});
}

var getAct = function(key){
	return Quest.getActor(key);
}

var dialogue = function(key,npc,convo,node){
	Dialogue.start(key,{group:Q,npc:npc,convo:convo,node:node});
}


var addItem = function(key,item,amount){
	if(typeof item === 'object'){
		for(var i in item) addItem(key,i,item[i]);
		return;
	}

	item = getItemName(item);
	if(Quest.itemExist(item))	Itemlist.add(key,item,amount);
	else chat(key,"BUG. ITEM DOES NOT EXIST @ " + item);
}

var removeItem = function(key,item,amount){
	if(typeof item === 'object'){
		for(var i in item) removeItem(key,i,item[i]);
		return;
	}

	item = getItemName(item);
	if(Quest.itemExist(item))	Itemlist.remove(key,item,amount);
	else chat(key,"BUG. ITEM DOES NOT EXIST @ " + item);
}

var haveItem = function(key,item,amount,removeifgood){
	if(typeof item === 'object'){
		for(var i in item){
			if(!haveItem(key,i,item[i])) return false;
		}
		if(amount) removeItem(key,item);	//amount acts as removeifgood
		return true;
	}

	item = getItemName(item);
	if(Quest.itemExist(item)){
		var success = Itemlist.have(key,item,amount);
		if(success && removeifgood) Itemlist.remove(key,item,amount);
		return success;
	}
	else chat(key,"BUG. ITEM DOES NOT EXIST @ " + item);
	return false;
}

var getItemName = function(name){
	if(name.have(Q)) return name;
	else return Q + '-' + name;
}

var testItem = function (key,item,amount,addifgood){
	if(typeof item === 'object'){
		var success = Itemlist.test(key,Itemlist.objToArray(item));
		if(amount) addItem(key,item);	//amount acts as addifgood
		return true;
	}
	
	
	item = getItemName(item);
	var success = Itemlist.test(key,[[item,amount || 1]]);
	if(success && addifgood) addItem(key,item,amount);
	return success;
}


var chat = Chat.add;
var cutscene = function(key,map,path){
	Actor.setCutscene(getAct(key),q.map[map][Q].path[path]);
}



var teleport = function(key,map,letter,popup){	//type: 0=immediate, 1=popup
	var spot = typeof letter === 'string' ? Map.getSpot(map,Q,letter) : {x:letter.x,y:letter.y,map:map};
	
	if(!popup) Actor.teleport(key,spot);
	else {
		Chat.question(key,{
			func:function(){Actor.teleport(key,spot);},
			option:true,			
		});
	}
}

var freeze = function(key,time,cb){
	Actor.freeze(getAct(key),time,cb);
}
var unfreeze = function(key){
	Actor.freeze.remove(getAct(key));
}

var getMapAddon = function(key){
	return Map.getAddon(getAct(key).map,Q);
}


var drop = function(key,spot,name,amount,time){
	time = time || 25*120;
	if(!Quest.itemExist(Q+ '-' + name)) return;
	
	var tmp = {'spot':spot,"item":Q + '-' + name,"amount":amount,'timer':time};
	if(typeof key === 'string') tmp.viewedIf = [key];
	Drop.creation(tmp);	
}

var bullet = function(spot,atk,angle,hit){
	hit = hit || 'player-simple';
	
	Attack.creation(
		{damageIf:hit,spot:spot,angle:angle},
		useTemplate(Attack.template(),atk)
	);

}

var actor = function(spot,cat,variant,extra){
	Actor.creation({spot:spot,category:cat,variant:variant,extra:(extra || {})});
}

var actorGroup = function(spot,respawn,list,extra){
	var tmp = [];
	for(var i in list){
		var m = list[i];
		tmp.push({
			"category":m[0],"variant":m[1],'amount':m[2] || 1,'modAmount':1,'extra':(m[3] || {})
		});
	}
	Actor.creation.group({'spot':spot,'respawn':respawn},tmp);
}

var sprite = function(key,name,size){
	var tmp = {name:name};
	if(size && size !== 1) tmp.sizeMod = size;
	Sprite.change(getAct(key),tmp);
}

var bossAttack = Boss.attack;
var bossSummon = Boss.summon;


var getEnemy = function(key,tag){
	return Map.getEnemy(getAct(key).map,tag);
}

var block = function(zone,extra,image){
	image = image || 'spike';
	extra = extra || {};
	if(zone[2] === zone[3]){	//horizontal
		for(var i = zone[0]; i <= zone[1]; i += 32){
			actor({x:i+16,y:zone[2],map:zone.map,addon:zone.addon},'block',image,extra);
		}
	}
	if(zone[0] === zone[1]){
		for(var i = zone[2]; i <= zone[3]; i += 32){
			actor({x:zone[0],y:i+16,map:zone.map,addon:zone.addon},'block',image,extra);
		}	
	}
}


var respawn = function(key,map,letter){	//must be same map
	var player = getAct(key);
	map = Actor.teleport.getMapName(player,map);

	var spot = Map.getSpot(map,Q,letter);
	if(spot) player.respawnLoc.recent = {x:spot.x,y:spot.y,map:spot.map};
}




var collision = function(spot,cb){
	if(!Loop.interval(5)) return;
		Map.collisionRect(spot.map,spot,'player',cb);
}


