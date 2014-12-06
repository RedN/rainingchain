//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Main','Message','Actor'],['Party']));

var Party = exports.Party = function(id){
	var tmp = {
		id:id,
		quest:null,
		leader:null,
		list:{},
		maxSize:100,
		quest:null,
	};
	LIST[id] = tmp;
	return tmp;
}
var LIST = Party.LIST = {};

Party.remove = function(party){
	for(var i in party.list)
		Main.leaveParty(Main.get(i));	//true to prevent infinite loop
	delete LIST[party.id];
}


Party.getKeyList = function(party){
	return Object.keys(party.list);
}
Party.setQuest = function(party,quest){
	party.quest = quest;
}

Party.get = function(id){
	return LIST[id];
}

Party.addPlayer = function(party,key,name){
	party.list[key] = name;
	if(!party.leader) Party.changeLeader(party,key,false);
	Party.addMessage(party,name.q() + ' has joined the party.');
	Party.setFlagForAll(party);
}

Party.removePlayer = function(party,key){
	var name = party.list[key];
	delete party.list[key];
	Main.setFlag(Main.get(key),'party');
	if(party.list.$isEmpty())
		return Party.remove(party);
	Party.addMessage(party,name.q() + ' left the party.');
	if(party.leader === key)
		Party.changeLeader(party,party.list.$keys()[0]);
	Party.setFlagForAll(party);
}
Party.changeLeader = function(party,key,message){
	if(!party.list[key]) return ERROR(3,'leader not in party');
	
	party.leader = key;
	if(message !== false) Party.addMessage(party,'Your new party leader is ' + Main.get(key).username.q() + '.');
	Party.setFlagForAll(party);
	
}
Party.addMessage = function(party,str,toexclude){
	for(var i in party.list){
		if(toexclude !== i)
			Main.addMessage(Main.get(i),str);
	}
}
Party.setFlagForAll = function(party){
	for(var i in party.list){
		var main = Main.get(i);
		Main.setFlag(main,'party');
		main.party = Main.Party(party);
	}
}


Party.getViaMain = function(main){
	return Main.getParty(main);
}

Party.isLeader = function(partyOrKey,key){	//accept
	if(!key) key = partyOrKey;
	return Party.getLeader(partyOrKey) === key;
}	
Party.getLeader = function(party){
	var p = typeof party === 'string' ? Party.getViaMain(Main.get(party)) : party;
	return p.leader;
}	

Party.getForEach = function(party,func){
	for(var i in party.list)
		if(!func(i)) return false;
	return true;

}
Party.getSize = function(party){
	return party.list.$length();
}


Party.forEach = function(party,func,type){
	var bool;
	if(type === 'or'){
		for(var i in party.list)
			bool = bool || func(i);
	}	
	if(type === 'and'){
		bool = true;
		for(var i in party.list)
			bool = bool && func(i);
	}	
	if(!type){
		for(var i in party.list)
			bool = func(i);
	}
	return bool;
}




