//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Server','ItemList','Save','Message','Dialogue','Boost','Drop','Quest','Collision','Send','Main','Command','Contribution']));


Main.getSignInPack = function(main){
	return {
		reputation:main.reputation,
		social:main.social,
		quest:main.quest,
		questActive:main.questActive,
		questHint:main.questHint,
		invList:Main.ItemList.compressClient(main.invList),
		bankList:Main.ItemList.compressClient(main.bankList),
		hudState:main.hudState,	
		dailyTask:main.dailyTask,
		contribution:main.contribution,
		party:Main.Party.compressClient(main.party),
	}
}

Main.setChangeAll = function(){
	var frame = Main.testInterval.get();
	for(var i in Main.LIST)
		Main.setChange(Main.LIST[i],frame);
}
Main.setChange = function(act,frame){
	if(frame % 6 === 0 && Main.initFlag(act)){
		act.change.flag = act.flag;
		Main.resetFlag(act);
	}
	if(frame % 6 === 0 && !act.temp.$isEmpty()){
		act.change.temp = act.temp;
		act.temp = {};
	}
};

Main.compressDb = function(main){ //Main.Quest.compressDb separated
	return {
		invList:Main.ItemList.compressDb(main.invList),
		bankList:Main.ItemList.compressDb(main.bankList),
		social:Main.Social.compressDb(main.social),
		chrono:Main.Chrono.compressDb(main.chrono),
		//
		username:main.username,
		name:main.name,
		reputation:main.reputation,
		questActive:main.questActive,
		dailyTask:main.dailyTask,
		//contribution:main.contribution,
	}
}

Main.uncompressDb = function(main,key){
	main.invList = Main.ItemList.uncompressDb(main.invList,key);
	main.bankList = Main.ItemList.uncompressDb(main.bankList,key);
	
	main.social = Main.Social.uncompressDb(main.social);
	main.chrono = Main.Chrono.uncompressDb(main.chrono);
	
	main.questActive = Main.QuestActive.uncompressDb(main.questActive,main);
	
    return Main(key,main);
}

Main.uncompressChange = function(change){
	if(change.flag){
		for(var i in change.flag)
			change[i] = change.flag[i];
		delete change.flag;
	}
	
	if(change.invList) change.invList = Main.ItemList.uncompressClient(change.invList);
	if(change.bankList) change.bankList = Main.ItemList.uncompressClient(change.bankList);
	if(change.party) change.party = Main.Party.uncompressClient(change.party);
	
	if(change.questHint)	//bad
		change.questHint = (main.questActive || change.questActive)
			? '<span title="Hint for Active Quest: ' + QueryDb.getQuestName(main.questActive || change.questActive) + '">Hint: ' + Message.receive.parseInput(change.questHint) + '</span>'
			: '<span title="Active a quest via the Quest Tab">No Active Quest</span>';
	
	if(change.dialogue !== undefined){	//sometimes null
		if(!change.dialogue){
			Dialog.close('dialogue');
			Dialog.open('chat');
		}
		else {
			Dialog.open('dialogue',change.dialogue);
			Dialog.close('chat');
		}
		delete change.dialogue;
	}

	
	return change;
}

Main.applyChange = function(main,change){
	if(!change) return;
	change = Main.uncompressChange(change);
	//if(change.contribution) Contribution.init(false);	//bad...
	
	if(change.temp)	Main.applyTempChange(main,change.temp);
	
	for(var i in change)
		Tk.viaArray.set({'origin':main,'array':i.split(','),'value':change[i]});	
}

Main.Flag = function(){
	return {};
}

Main.setFlag = function(act,what,info){
	if(what === 'quest') act.flag[info] = 1; //gonna use the Q
	else act.flag[what] = 1;
}

Main.initFlag = function(act){	//return true if not empty
	for(var what in act.flag){
		if(what === 'invList') act.flag[what] = Main.ItemList.compressClient(act.invList);
		else if(what === 'questHint') act.flag[what] = act.questHint; 
		else if(what === 'party') act.flag[what] = Main.Party.compressClient(act.party); 
		else if(what === 'social,friendList')	act.flag[what] = act.social.friendList;
		else if(what === 'social,clanList')	act.flag[what] = act.social.clanList;
		else if(what === 'questActive') act.flag[what] = act.questActive; 
		else if(what === 'dialogue') act.flag[what] = act.dialogue;
		else if(what === 'bankList') act.flag[what] = Main.ItemList.compressClient(act.bankList);
		else if(what === 'currentTab') act.flag[what] = act.currentTab; 
		else if(what === 'dailyTask') act.flag[what] = act.dailyTask;
		else if(what === 'contribution')	act.flag[what] = act.contribution;
		else if(what === 'reputation') act.flag[what] = act.reputation;
		else if(what === 'chrono')	act.flag[what] = act.chrono;
		else if(what === 'social,muteList')	act.flag[what] = act.social.muteList;
		else if(what === 'hudState') act.flag[what] = act.hudState; 
		else if(what[0] === 'Q') act.flag['quest,' + what] = act.quest[what];
		
	}
	for(var i in act.flag) return true;
	return false;
}

Main.resetFlag = function(main){
	main.flag = {};
}

Main.resetChangeForAll = function(){
	for(var i in Main.LIST){ 
		Main.get(i).change = {}; 
	}
}








