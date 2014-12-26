//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Server','Save','Party','Social','Account','Actor','Clan','ItemList','Main','Contribution','Message']));

var db;

Message.init = function(dblink){
	db = dblink;
}

Message.add = function(key,textOrMsg){
	Main.addMessage(Main.get(key),textOrMsg);
}
Message.addPopup = function(key,text,time){
	Message.add(key,Message('questPopup',text,null,Message.QuestPopup(time || 25*30,false)));
}
		
Message.broadcast = function(text){
	Main.forEach(function(main){
		Main.addMessage(main,text);
	});		
}

//##################

Message.receive = function(key,msg){
	msg.from = Main.get(key).username;
	if(!Message.receive.test(key,msg)) return;
	
	var parse = Message.parseText(msg.text);     	//text
	msg.hasItem = parse.item;
	msg.hasPuush = parse.puush;
	msg.text = parse.text;
	
	
	if(msg.type === 'public') Message.receive.public(key,msg);
	else if(msg.type === 'pm') Message.receive.pm(key,msg); 
	else if(msg.type === 'question') Message.receive.question(key,msg); 
	else if(msg.type === 'report') Message.receive.report(key,msg); 
	/*
	else if(msg.type === 'clan') Message.receive.clan(key,msg); 
	*/	
};

Message.receive.test = function(key,msg){
	if(!msg.type || !msg.text || typeof msg.text !== 'string') return false;
	if(msg.to === msg.from) return Message.add(key,"Ever heard of thinking in your head?") || false;
	if(msg.type !== 'feedback' && msg.text.length > 200) return false;	//text too long
	if(Message.receive.ZALGO_REGEX.test(msg.text)) return false;
	if(Main.get(key).social.muted) return false;				//player is muted
	return true;
}

Message.receive.ZALGO_REGEX = /[^\x20-\x7E]/;

Message.receive.public = function(key,msg){
	var act = Actor.get(key);
	var main = Main.get(key);
	
	msg.text = unescape.html(msg.text);	//allow html. but was parsed earlier
	
    if(!msg.hasItem && !msg.hasPuush)
		act.chatHead = Actor.ChatHead(msg.text);
	
	var newMsg = Message('public',msg.text,msg.from,Message.Public(main.social.customChat));
	
	//Send info
	var alreadySentTo = {};
	Message.add(key,newMsg);
	for(var i in act.activeList){
		if(!Actor.isPlayer(i)) continue;	//aka non player
		alreadySentTo[i] = 1;
		Message.add(i,newMsg);
	}
	Party.addMessage(Main.getParty(Main.get(key)),msg.text,key);

}

Message.receive.pm = function(key,msg){
	if(!Main.canSendMessage(msg.from,msg.to))
		return Message.add(key,"This player is offline.");
	Message.add(Account.getKeyViaName(msg.to),msg);
	Message.add(key,msg);
}

Message.receive.clan = function(key,msg){
    var clanName = Main.get(key).social.clanList[msg.clan];
    if(!clanName) return Message.add(key,'You typed too many \"/\".');
	var clan = Clan.get(clanName);
    if(!clan) return Message.add(key,'This clan doesn\'t exist. Strange...');
    
	var newMsg = Message('clan',msg.text,msg.from,Message.Clan(clan.nick));
	
    for(var i in clan.memberList){	//including speaker
    	if(Actor.isOnline(i))	//is online
			Message.add(Account.getKeyViaUserName(i),newMsg);
    }
}    


Message.receive.report = function(key,d){
	if(d.text.length > 1000 && d.title.length > 50) return Message.add(key,'Too long text or title.');
	
	//db.email.report(d.title || '',(d.subcategory || '') + ':' + d.text,name);
	
	return db.report.insert({
		date:new Date().toLocaleString(),
		user:Actor.get(key).username,
		text:d.text,
		title:d.title,
	});
	
}

Message.receive.question = function(key,msg){
	Main.handleQuestionAnswer(Main.get(key),msg);
}




Message.parseText = function(data){	//TODO
	return {text:data};
}

/*
Message.parseText = function(data){
	data = escape.html(data);
	var puush = data;
	data = data.replaceCustomPattern('http://puu.sh/','.png',Message.parseText.puush);
	data = data.replaceCustomPattern('http://puu.sh/','.jpg',Message.parseText.puush);
	data = data.replaceCustomPattern('http://puu.sh/','.txt',Message.parseText.puush);
	var item = data;
	data = data.replacePattern(Message.parseText.item);
	return {text:data,item:data !== item,puush:puush !== item};
}


Message.parseText.puush = function(link){
	return	'<a style="color:cyan" href="' + link + '" target="_blank">[' + link.slice(-9,-4) + ']</a>';
}
 

//'http://puu.sh/8H2H1.png'.slice(-9,-4)
Message.parseText.item = function(id){
	var item = ItemModel.get(id);
	if(!item || item.type !== 'equip') return '[' + id + ']';
	
	return '<span ' + 
	'style="color:green" ' +
	'onclick="Dialog.open(\'equipPopup\',\'' + item.id + '\');" ' + 
	'onmouseout="Dialog.close(\'equipPopup\');' + '" ' + 
	'>[' + item.name + 
	']</span>';
}.('',id);
*/













