//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Message','Main','Actor','Message'],['Clan']));
var db = null; //Clan.init


var Clan = exports.Clan = {};

Clan.init = function(dbLink){	
	db = dbLink;
	return;
	db.clan.find({},{'_id':0},function(err,data){
		for(var i = 0 ; i < data.length ; i++){
			DB[data[i].id] = data[i];
		}
	});
}
var DB = Clan.DB = {};

Clan.get = function(id){
	return DB[id] || null;
}

Clan.creation = function(key,name){
	return Message.add(key,'Clan system is down.');
	/*
	if(DB[name]) return Message.add(key,'This name is already taken.');
	
	var player = Actor.get(key);
	DB[name] = {'name':name,'nick':name,'id':name,'memberList':{}}
	DB[name].memberList[player.name] = {'admin':1,'rank':10,'kick':1};

	Message.add(key,'Clan created.');
	Clan.enter(key,name);
	
	db.clan.save(DB[name]);
	*/
}

Clan.enter = function(key,name){
	return Message.add(key,'Clan system is down.');
	/*
	var main = Main.get(key);
	var pn = Actor.get(key).name;
	
	if(!DB[name]) return Message.add(key,'This clan doesn\'t exist.');
	if(main.social.clanList.have(name)) return Message.add(key,'You are already in this clan chat.');	;
	main.social.clanList.push(name);
	Main.setFlag(main,'social,clanList');
	
	if(DB[name].memberList[pn]){
		DB[name].memberList[pn].active = 1;
	} else {
		DB[name].memberList[pn] = {'rank':0,'active':1}
	}
	
	str = ''; for(var i = 0 ; i < main.social.clanList.length ; i++){ str += '/'; }
	
	Message.add(key,'You are now in clan chat: ' + name + '. Type \"' + str + '\" to talk in it.');	
*/
}

Clan.leave = function(key,name){
	return Message.add(key,'Clan system is down.');
	/*
	var pn = Actor.get(key).name;
	var main = Main.get(key);
	Main.setFlag(main,'social,clanList');
	for(var i in main.social.clanList){
		if(name === 'ALL' || i === 'name'){
			var clan = DB[main.social.clanList[i]];
			clan.memberList[pn].active = 0;
			if(!clan.memberList[pn].rank){
				delete clan.memberList[pn];
			}
		}
	}
	
	if(name === 'ALL')	main.social.clanList = [];
	else main.social.clanList.splice(main.social.clanList.indexOf(name),1);
	*/
	
}
























