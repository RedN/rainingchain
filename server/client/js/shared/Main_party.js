//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Main','Message','Actor','Party'],['Party']));

Main.party = {};
Main.Party = function(party){
	party = party || {};
	var tmp = {
		id:party.id || Math.randomId(),
	};
	
	return tmp;
}
Main.Party.compressClient = function(party){
	var p = Party.get(party.id);
	var tmp = {
		id:party.id,
		list:[],
		leader:Main.get(p.leader).username,
	};

	for(var i in p.list)
		tmp.list.push(p.list[i]);
	return tmp;	
}
Main.Party.uncompressClient = function(party){
	return party;
}

//Start quest must change party.quest


Main.joinParty = function(main,name){ //only called directly when sign in, otherwise, use changeParty
	main.party.id = name;
	
	var party = Party.get(name);
	if(!party){
		party = Party(name);	//create if not exist
		Party.setQuest(party,main.questActive);
	} else if(party.quest){
		party = Party(Math.randomId());
		Main.addMessage(main,"You can't join this party because they are already doing a quest.");
	}
	Party.addPlayer(party,main.id,main.username);
	
	Main.setFlag(main,'party');
	
	Main.addMessage(main, 'You are now in party "' + name + '".');
	/*
	if(Party.testQuest(act,name) === false){
		Message.add(act.id,"You can't join this party because one of more players do not share the same active quest than you. Abandon your active quest or make sure they are doing the same than yours. You have been moved in a temporary party instead.");
		name = '!TEMP-' + act.name;
		Party.creation(act,name);
		act.party = name;
	}
	*/
}

Main.leaveParty = function(main){	//only called directly when sign off, otherwise, use changeParty
	var party = Party.get(main.party.id);
	Party.removePlayer(party,main.id);
}

Main.changeParty = function(main,newParty){
	if(main.questActive)
		return Main.addMessage(main,"You can't change your party while doing a quest.");
	newParty = newParty || Math.randomId();
	Main.leaveParty(main);
	Main.joinParty(main,newParty);
}

Main.getParty = function(main){
	return Party.get(main.party.id);
}



//http://puu.sh/c3bxT.txt

