//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Debug']));

var db;
//_preset reserved
var QuestVar = exports.QuestVar = function(quest,main,oldValue){	//oldValue is taken from db
	var regular = QuestVar.getInitVar(quest);
	if(!oldValue) oldValue = regular;
	else {
		for(var i in oldValue){
			if(regular[i] === undefined)	//var was removed
				delete oldValue[i];
		}
		for(var i in regular){
			if(oldValue[i] === undefined)	//var was added
				oldValue[i] = regular[i];
		}
	}
	
	oldValue.key = main.id;
	oldValue.username = main.username;
	return oldValue;
}
QuestVar.Model = function(quest,varName){	//called from s.exports
	var tmp = {
		quest:quest,
		key:null,
		_preset:null,
	}
	for(var i in varName)
		tmp[i] = varName[i];
	DB[quest] = tmp;
	LIST[quest] = {};
}


var LIST = QuestVar.LIST = {};	//player values ||| questId:playerId:variableName:value
var DB = QuestVar.DB = {};	//default values

QuestVar.init = function(dbLink){
	db = dbLink;
}

QuestVar.set = function(quest,key,name,value){
	if(typeof value === 'object') return ERROR(3,'cant set object',quest,name,value);
	if(value === undefined) return ERROR(3,'undefined value',quest,name);
	try {
		if(Debug.trackQuestVar) INFO(name,value,'[old: ' + LIST[quest][key][name] + ']');
		return LIST[quest][key][name] = value;
	}catch(err){ ERROR.err(3,err); }
}
QuestVar.add = function(quest,key,name,value){
	if(isNaN(value)) return ERROR(3,'NaN',quest,name,value);
	try {
		if(Debug.trackQuestVar) INFO(name,LIST[quest][key][name] + value,'[old: ' + LIST[quest][key][name] + ']');
		return LIST[quest][key][name] += value;
	}catch(err){ ERROR.err(3,err); }
}
QuestVar.get = function(quest,key,name){
	var value = LIST[quest] && LIST[quest][key] && LIST[quest][key][name];
	if(value === undefined) return ERROR(3,'undefined',quest,key,name);
	return value;
}
QuestVar.getInitVar = function(quest){
	if(!DB[quest]) return ERROR(3,'no quest',quest);
	return Tk.deepClone(DB[quest]);
}
QuestVar.getInitVar.all = function(){
	return Tk.deepClone(DB);
}

QuestVar.addToList = function(questVar){	//questVar was created via QuestVar
	try {
		LIST[questVar.quest][questVar.key] = questVar;
	}catch(err){ ERROR.err(3,err); }
}

QuestVar.removeFromList = function(quest,main){
	try {
		delete LIST[quest][main.id];
	}catch(err){ ERROR.err(3,err); }
}

QuestVar.onSignOff = function(main){
	try {
		if(!main.questActive) return;
		delete LIST[main.questActive][main.id];
	}catch(err){ ERROR.err(3,err); }
}


QuestVar.removeFromDb = function(quest,main,cb){
	db.questVar.remove({quest:quest,username:main.username},cb||db.err);
}

QuestVar.getViaMain = function(main){
	try {
		return LIST[main.questActive][main.id];
	}catch(err){ ERROR.err(3,err); }
}

QuestVar.uncompressDb = function(questVar,main){
	if(!questVar){
		ERROR(3,'questVar dont exist for',main.questActive,main.username);
		questVar = QuestVar(main.questActive,main);
	}
	return questVar;
}

QuestVar.onSignIn = function(questVar,main){
	if(questVar)
		QuestVar.addToList(QuestVar(questVar.quest,main,questVar));
}








