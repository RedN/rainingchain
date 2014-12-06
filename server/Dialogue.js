//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Main'],['Dialogue']));


var Dialogue = exports.Dialogue = function(Q,id,name,image,list){
	var tmp = {
		quest:Q,
		id:id,
		name:name,
		image:image,
		nodeList:{},
	};
	for(var i in list)	tmp.nodeList[list[i].id] = list[i];
	
	//set npc to
	for(var i in tmp.nodeList){
		tmp.nodeList[i].npc = id;
		for(var j in tmp.nodeList[i].option)
			tmp.nodeList[i].option[j].npc = id;
	}
	
	DB[Q] = DB[Q] || {};	//bad
	DB[Q][id] = tmp;	//bad, should change for new Dialogue()	
};

var DB = Dialogue.DB = {};

Dialogue.Node = function(Q,id,text,option,event,noFace,allowExit){
	var tmp = {
		id:id,
		text:text,
		option:[],
		event:event,
		quest:Q,
		noFace:!!noFace,
		allowExit:!!allowExit,
	};	
	
	for(var i in option)
		option[i].node = id;
	tmp.option = option;
	return tmp;		
}

Dialogue.Option = function(Q,text,next,event){
	return {
		text:text,
		next:next,
		event:event,
		quest:Q,
		npc:'',		//set later,
		node:'',	//set later
	};		
}

Dialogue.Face = function(image,name){
	return {image:image,name:name};
}

Dialogue.get = function(quest,npc){
	return (DB[quest] && DB[quest][npc]) || null;
}



