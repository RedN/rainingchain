//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Init','Db','Chat','Chat','requireDb'],['Clan']));
var db = requireDb();

Db.clan = {};

Init.db.clan = function(){
	db.find('clan',{},{'_id':0},function(err,data){
		for(var i = 0 ; i < data.length ; i++){
			Db.clan[data[i].id] = data[i];
		}
	});
}

var Clan = exports.Clan = {};
Clan.creation = function(key,name){
	if(Db.clan[name]){ Chat.add(key,'This name is already taken.');	return;}
	
	var player = List.all[key];
	Db.clan[name] = {'name':name,'nick':name,'id':name,'memberList':{}}
	Db.clan[name].memberList[player.name] = {'admin':1,'rank':10,'kick':1};

	Chat.add(key,'Clan created.');
	Clan.enter(key,name);
	
	db.save('clan',Db.clan[name]);
}

Clan.enter = function(key,name){
	var main = List.main[key];
	var pn = List.all[key].name;
	
	if(!Db.clan[name]) return Chat.add(key,'This clan doesn\'t exist.');
	if(main.social.list.clan.have(name)) return Chat.add(key,'You are already in this clan chat.');	;
	main.social.list.clan.push(name);
	main.flag['social,list,clan'] = 1;
	
	if(Db.clan[name].memberList[pn]){
		Db.clan[name].memberList[pn].active = 1;
	} else {
		Db.clan[name].memberList[pn] = {'rank':0,'active':1}
	}
	
	str = ''; for(var i = 0 ; i < main.social.list.clan.length ; i++){ str += '/'; }
	
	Chat.add(key,'You are now in clan chat: ' + name + '. Type \"' + str + '\" to talk in it.');	

}

Clan.leave = function(key,name){
	var pn = List.all[key].name;
	var main = List.main[key];
	main.flag['social,list,clan'] = 1;
	for(var i in main.social.list.clan){
		if(name === 'ALL' || i === 'name'){
			var clan = Db.clan[main.social.list.clan[i]];
			clan.memberList[pn].active = 0;
			if(!clan.memberList[pn].rank){
				delete clan.memberList[pn];
			}
		}
	}
	
	if(name === 'ALL')	main.social.list.clan = [];
	else main.social.list.clan.splice(main.social.list.clan.indexOf(name),1);
	
	
}
























