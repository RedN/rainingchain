var Q = q.id;

var List, Db, db;


var get = function(key,attr){
	var mq = Quest.getMain(key,Q);
	var a = mq[attr];
	return typeof a === 'object' ? deepClone(a) : a;	//prevent setting
}

var set = function(key,attr,attr2,value){
	var mq = Quest.getMain(key,Q);
		
	if(!mq.started){
		Chat.add(key,"You need to start this quest via the Quest Tab before making progress in it."); 
		startQuest(key);
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
	if(item.indexOf(Q) !== 0) item = item = Q+'-'+item;
	if(Quest.itemExist(item)) Itemlist.add(key,item,amount);
}
var removeItem = function(key,item,amount){
	if(item.indexOf(Q) !== 0) item = item = Q+'-'+item;
	if(Quest.itemExist(item)) Itemlist.remove(key,item,amount);
}

var haveItem = function(key,item,amount){
	if(Quest.itemExist(Q+'-'+item)) item = Q+'-'+item;
	Itemlist.have(key,item,amount);
}

var testItem = function (key,array_items){
	var list = deepClone(array_items);
	for(var i in list){
		if(Quest.itemExist(Q+'-'+list[i][0]))
			list[i][0] = Q+'-'+list[i][0];
	}
	return Itemlist.test(key,list);
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


var getMapAddon = function(key){
	return Map.getAddon(getAct(key).map,Q);
}

var actor = function(spot,cat,variant,extra){
	Actor.creation({xym:spot,category:cat,variant:variant,extra:(extra || {})});
}

var actorGroup = function(spot,respawn,list,extra){
	var tmp = [];
	for(var i in list){
		var m = list[i];
		tmp.push({
			"category":m[0],"variant":m[1],'amount':m[2] || 1,'modAmount':1,'extra':(m[3] || {})
		});
	}
	Actor.creation.group({'xym':spot,'respawn':respawn},tmp);
}

var bullet = function(spot,atk,angle,hit){
	hit = hit || 'player-simple';
	
	Attack.creation(
		{damageIf:hit,xym:spot,angle:angle},
		useTemplate(Attack.template(),atk)
	);

}


var freeze = Actor.freeze;
var unfreeze = Actor.freeze.remove;





