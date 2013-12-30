clanDb = {};

initClanDb = function(){
	db.clan.find({},{'_id':0},function(err,data){
		for(var i = 0 ; i < data.length ; i++){
			clanDb[data[i].id] = data[i];
			delete clanDb[data[i].id]._id
		}
	});
}

Clan = {};

Clan.creation = function(key,name){
	if(clanDb[name] !== undefined){
		Chat.add(key,'This name is already taken.');	return;
	}
	var player = fullList[key];
	clanDb[name] = {'name':name,'nick':name,'id':name,'memberList':{}}
	clanDb[name].memberList[player.name] = {'admin':1,'rank':10,'kick':1};

	Chat.add(key,'Clan created.');
	Clan.enter(key,name);
	
	db.clan.save(clanDb[name]);
}


Clan.enter = function(key,name){
	var main = mainList[key];
	var pn = fullList[key].name;
	
	if(!clanDb[name]){
		Chat.add(key,'This clan doesn\'t exist.');	return;
	}
	if(main.clanList.indexOf(name) !== -1){
		Chat.add(key,'You are already in this clan chat.');	return;
	}
	main.clanList.push(name);
	
	if(clanDb[name].memberList[pn]){
		clanDb[name].memberList[pn].active = 1;
	} else {
		clanDb[name].memberList[pn] = {'rank':0,'active':1}
	}
	
	str = ''; for(var i = 0 ; i < main.clanList.length ; i++){ str += '/'; }
	
	Chat.add(key,'You are now in clan chat: ' + name + '. Type \"' + str + '\" to talk in it.');	

}

Clan.leave = function(key,name){
	var pn = fullList[key].name;
	var main = mainList[key];
	
	for(var i in main.clanList){
		if(name == 'ALL' || i == 'name'){
			clanDb[main.clanList[i]].memberList[pn].active = 0;
			if(!clanDb[main.clanList[i]].memberList[pn].rank){
				delete clanDb[main.clanList[i]].memberList[pn];
			}
		}
	}
	
	if(name == 'ALL'){	
		main.clanList = [];
	} else {
		main.clanList.splice(main.clanList.indexOf(name),1);
	}
	
}
























