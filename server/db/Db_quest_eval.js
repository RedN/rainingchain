var Q = q.id;

var List, Db, db;


var get = function(key,attr){
	var mq = Quest.getMain(key,Q);
	var a = mq[attr];
	return typeof a === 'object' ? deepClone(a) : a;	//prevent setting
}

var set = function(key,attr,attr2,value){
	var mq = Quest.getMain(key,Q);
	if(!mq.started) return;
	if(value === undefined) mq[attr] = attr2;	//aka deep = 1
	else mq[attr][attr2] = value;
}

var getAct = function(key){
	return Quest.getActor(key);
}
