var Q = q.id;

var List, Db, db;


var get = function(key,attr){
	var mq = Quest.getMain(key,Q);
	var a = mq[attr];
	return typeof a === 'object' ? deepClone(a) : a;	//prevent setting
}

var set = function(key,attr,attr2,value){
	var mq = Quest.getMain(key,Q);
	mq.started = true;
	if(value === undefined) mq[attr] = attr2;	//aka deep = 1
	else mq[attr][attr2] = value;
	
	
	if(attr === 'complete' && attr2)	Quest.complete(key,Q);
}

var getAct = function(key){
	return Quest.getActor(key);
}

var dialogue = function(key,npc,convo,node){
	Dialogue.start(key,{group:Q,npc:npc,convo:convo,node:node});
}


var addItem = function(key,item,amount){
	if(Quest.itemExist(Q+'-'+item)) item = Q+'-'+item;
	Itemlist.add(key,item,amount);
}
var removeItem = function(key,item,amount){
	if(Quest.itemExist(Q+'-'+item)) item = Q+'-'+item;
	Itemlist.remove(key,item,amount);
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

var teleport = Actor.teleport;
var chat = Chat.add;
var cutscene = function(key,map,path){
	console.log(key,map,path);
	console.log(Object.keys(q.map),q.map[map]);

	Actor.setCutscene(getAct(key),q.map[map][Q].path[path]);
}

