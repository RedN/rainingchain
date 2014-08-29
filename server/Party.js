//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Chat'],['Party']));

var Party = exports.Party = {};

Party.template = function(){
	return {
		list:{},
		leader:'',	
	}
}

Party.join = function(act,name){
	Party.leave(act);
	
	act.party = name;
	
	if(!List.party[name]) Party.creation(act,name);
	
	if(Party.testQuest(act,name) === false){
		Chat.add(act.id,"You can't join this party because one of more players do not share the same active quest than you. Abandon your active quest or make sure they are doing the same than yours. You have been moved in a temporary party instead.");
		name = '!TEMP-' + act.name;
		Party.creation(act,name);
		act.party = name;
	}
	
	for(var i in List.party[name].list){
		if(i !== act.id) Chat.add(i,act.name + ' joined your party.');
		List.all[i].flag.party = 1;
	}
	
	List.party[name].list[act.id] = act.id;	
	
	
	Chat.add(act.id, 'You are now in party "' + name + '".');
}

Party.leave = function(act){
	var party = List.party[act.party];
	if(!party || !party.list){ return; }	//normal if player loggin in
	
	delete party.list[act.id];

	if(party.list.$length() === 0){ delete List.party[act.party]; return; }
		
	if(party.leader === act.id){
		party.leader = party.list.randomAttribute();
		for(var i in party.list)	Chat.add(i,"Your new party leader is " + List.all[party.leader].name + '.');
	}

	for(var i in party.list)
		act.flag.party = 1;
	
	act.flag.party = 1;
}



Party.testQuest = function(act,name,questid){	//return true if OK
	name = name || act.party;
	var quest = questid || List.main[act.id].questActive;
	if(!quest) return true;
	
	for(var i in List.party[name].list){
		if(List.main[i].questActive && List.main[i].questActive !== quest) 
			return false
	}
	return true;
}

Party.creation = function(act,name){
	List.party[name] = {
		'leader':act.id,
		'id':name,
		'list':{
			
		
		}	
	}
	List.party[name].list[act.id] = act.id;
}


