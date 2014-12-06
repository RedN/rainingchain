//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','ActorModel','Server','Account','Main','ItemList','Quest','Map','Ability','Message','Social']));


Main.Social = function(){
	return {
		message:[],
		friendList:{},
		muteList:{},
		clanList:[],
		customChat:Main.Social.customChat(),
		status:'on',
		muted:0,
		allowedToSendPuush:true,	//TODO
	};
}
Main.Social.customChat = function(symbol,color){
	return {
		symbol:symbol || 0,
		color:color || 0,	
	}
}

Main.Social.compressDb = function(social){
	return social;
}
Main.Social.uncompressDb = function(social){	//bad should use constructor
	return social;
}

//##################

Main.social = {};

Main.social.update = function(main){	//should only be for safety, Main.onSignInOff should in theory handle everything
	if(!Main.testInterval(main,25*60)) return;
	var key = main.id;
	var fl = Main.get(key).social.friendList;
    
	for(var i in fl){
		var bool = Main.canSendMessage(Actor.get(key).name,i) || false;
		if(fl[i].online !== bool) Main.setFlag(main,'social,friendList');
		fl[i].online = bool;
	}
}


Main.social.onSignInOff = function(main,direction){
	var name = main.username;
	var text = name.q() + ' just logged ' + direction + '.';
	var msg = Message('signNotification',text,name);
	for(var i in Main.LIST){
		var otherMain = Main.LIST[i];
		if(otherMain.username === name) continue;
		Main.addMessage(otherMain,msg);
		
		if(otherMain.social.friendList[name]){
			otherMain.social.friendList[name].online = direction === 'in';
			Main.setFlag(otherMain,'social,friendList');
		}
	}
}

Main.addFriend = function(main,user,nick,comment){
	nick = nick || user;
	comment = comment || '';
	if(user === main.username) return Main.addMessage(main,"You are either bored or very lonely for trying this.");
	
	var social = main.social;
	if(social.friendList[user]) return Main.addMessage(main,"This player is already in your Friend List."); 
	if(social.muteList[user]) return Main.addMessage(main,"This player is in your Mute List.");
	
	social.friendList[user] = Friend(user,nick,comment);
	Main.addMessage(main,"Friend added.");
	Main.setFlag(main,'social,friendList');
}

Main.removeFriend = function(main,user){
	var social = main.social;
	if(!social.friendList[user]) return Main.addMessage(main,'This player is not in your Friend List.');
	delete social.friendList[user]
	Main.addMessage(main,'Friend deleted.');
	Main.setFlag(main,'social,friendList');
}

Main.social.changeFriendComment = function(main,user,comment){
	var social = main.social;
	if(!social.friendList[user]) return Main.addMessage(main,'This player is not in your Friend List.');
	social.friendList[user].comment = comment;
	Main.addMessage(main,'Friend Comment changed.');
}

Main.social.changeFriendNick = function(main,user,nick){
	var social = main.social;
	if(!social.friendList[user]) return Main.addMessage(main,'This player is not in your Friend List.');
	social.friendList[user].nick = nick;
	Main.addMessage(main,'Friend Nick changed.');
}

Main.changeStatus = function(main,setting){
	main.social.status = setting;
	Main.addMessage(main,"Private Setting changed to " + setting + '.');
}
Main.changeStatus.ON = 'on';
Main.changeStatus.OFF = 'off';
Main.changeStatus.FRIEND_ONLY = 'friend';


Main.mutePlayer = function(main,user){
	if(user === main.username) return Main.addMessage(main,"-.- Seriously?");
	var social = main.social;
	if(social.friendList[user]) return Main.addMessage(main,"This player is in your Friend List.");
	if(social.muteList[user]) return Main.addMessage(main,"This player is alraedy in your Mute List.");

	social.muteList[user] = true;
	Main.addMessage(main,"Player muted.");
	Main.setFlag(main,'social,muteList');
}

Main.unmutePlayer = function(main,user){
	var social = main.social;
	if(!social.muteList[user]) Main.addMessage(main,'This player was not in your Mute List.');
	delete social.muteList[user];
	Main.addMessage(main,'Player unmuted.');
	Main.setFlag(main,'social,muteList');
}

Main.canSendMessage = function(from,to){
	var mainReceiver = Main.LIST[Account.getKeyViaName(to)];
	if(!mainReceiver) return null;
	if(mainReceiver.social.status === Main.changeStatus.OFF) return false;
	if(mainReceiver.social.status === Main.changeStatus.FRIEND_ONLY && !mainReceiver.social.friendList[from]) return false;
	return true;
}

//##################

var Friend = function(name,nick,comment){
	return {
		name:name,
		nick:nick,
		comment:comment,	
	}
}


