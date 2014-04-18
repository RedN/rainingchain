//chat
Chat = {};

Chat.parse = function(data){
	return data.replacePattern(Chat.parse.item);
}

Chat.parse.item = function(id){
	var item = Db.item[id];
	if(!item || !item.type === 'armor' && !item.type === 'weapon') return '[' + id + ']';
	
	return '<span ' + 
	'style="color:' + 'green' + '" ' +
	'onclick="main.popupList.equip = \'' + item.id + '\';' + '" ' + 
	'onmouseout="main.popupList.equip = null;' + '" ' + 
	'>[' + item.name + 
	']</span>';
}

Chat.add = function(key,text,type,extra){	//add text to chat of player.
	if(!List.main[key]) return;
	List.main[key].social.message.chat = List.main[key].social.message.chat || [];
	type = type || 'game';
	extra = extra || {};
	
	extra.text = text;
	extra.type = type;
	List.main[key].social.message.chat.push(extra);	
}


Chat.question = function(key,q){	//q:{text, func, param, repeat, [option]}
	q.param = q.param || [];
	q.text = q.text || 'Are you sure?';
	q.repeat = q.repeat || 0;
	if(q.option === true) q.option = ['yes','no'];
	List.main[key].question = q;
	Chat.add(key,q.text,'question',{option:q.option});
}



Chat.receive = function(data){	//when a player wants to send a text
	var key = data.key;									//source (key)
	if(List.main[key].social.muted) return;				//player is muted
	var from = List.all[key].name;                     	//source (name)
	var to = escape.quote(data.to);                     //destination (name)
	var text = Chat.parse(escape.quote(data.text));     //text
	var type = data.type;                				 //clan || pm || public
			
	if(!type || !text || !to || !from){ return; }
	if(to === from){ Chat.add(key,"Ever heard of thinking in your head?"); return; }
	
	if(type === 'public') Chat.receive.public(key,text,to,type,from,data); 
	else if(type === 'pm') Chat.receive.pm(key,text,to,type,from,data); 
	else if(type === 'clan') Chat.receive.clan(key,text,to,type,from,data); 
	else if(type === 'report') Chat.receive.report(key,data); 
		
};

Chat.receive.public = function(key,text,to,type,from,data){
	var act = List.all[key];
	var main = List.main[key];
	
    if(text === data.text){	//if no item
		act.chatHead = {'text':text,'timer':25*10};
	}
	var pack = {'from':from};
	pack.symbol = main.social.symbol || null;
	
	//Send info
	Chat.add(key,text,'public',pack);
	for(var i in act.activeList)
		if(List.main[i]) Chat.add(i,text,'public',pack);
		
	for(var i in List.team[act.team])
		if(List.main[i] && i !== key) Chat.add(i,text,'public',pack);
	
}

Chat.receive.pm = function(key,text,to,type,from,data){
    var res = Chat.receive.pm.test(from,to);
	if(res){	
		var pack = {'from':from,'to':to};
		pack.symbol = List.main[key].social.symbol || null;
		Chat.add(List.nameToKey[to],text,'pm',pack);
		Chat.add(key,text,'pm',pack);
	}
	if(!res) Chat.add(key,"This player is offline.");
}

Chat.receive.pm.test = function(from,to){ //test if player can send pm to another. check for online but also mute list
	var main = List.main[List.nameToKey[to]];
	if(!main) return null;
	if(main.social.status === 'off') return false;
	if(main.social.status === 'friend' && !main.social.list.friend[from]) return false;
	return true;
}

Chat.receive.clan = function(key,text,to,type,from,data){	//to is the number of /
    var clanName = List.main[key].social.list.clan[to];
    		
    if(!clanName){ Chat.add(key,'You typed too many \"/\".'); return; }
    var clan = Db.clan[clanName];
    if(!clan){ Chat.add(key,'This clan doesn\'t exist. Strange...'); return; }
    
    for(var i in clan.memberList){	//including speaker
    	if(clan.memberList[i].active && List.nameToKey[i]){
    		Chat.add(List.nameToKey[i],text,'clan',{'from':from,'clan':clan.nick});
    	}
    }
    return;
}    

Chat.receive.report = function(key,data){
	if(!Server.report) return;
	if(data.text.length < 1000 && data.title.length < 100){
		db.insert('report',{
			date:new Date().toLocaleString(),
			user:List.all[key].username,
			text:data.text,
			title:data.title,
			category:data.category,			
		});
	}
}







































