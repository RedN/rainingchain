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

Chat.add = function(key,pack){
	var main = List.main[key];
	if(!main) return;
	main.social.message = main.social.message || [];
	if(typeof pack === 'string') pack = {type:'game',text:pack};
	
	main.social.message.push(pack);	
}

Chat.question = function(key,q){	//q:{text, func, param, repeat, [option]}
	q.param = q.param || [];
	q.text = q.text || 'Are you sure?';
	q.repeat = q.repeat || 0;
	if(q.option === true) q.option = ['yes','no'];
	List.main[key].question = q;
	Chat.add(key,{type:'question',option:q.option,text:q.text});
}



Chat.receive = function(d){	//data:{to,key,type,text,	[title,category for report]
	var key = d.key;									//source (key)
	if(List.main[key].social.muted) return;				//player is muted
	d.from = List.all[key].name;                     	//source (name)
	d.to = escape.quote(d.to);                     		//destination (name)
	var text = Chat.parse(escape.quote(d.text));     		//text
	if(text !== d.text) d.item = 1;
	d.text = text;
	
	if(!d.type || !d.text || !d.to || !d.from){ return; }
	if(d.to === d.from){ Chat.add(key,"Ever heard of thinking in your head?"); return; }
	
	if(d.type === 'public') Chat.receive.public(key,d); 
	else if(d.type === 'pm') Chat.receive.pm(key,d); 
	else if(d.type === 'clan') Chat.receive.clan(key,d); 
	else if(d.type === 'report') Chat.receive.report(key,d); 
	else if(d.type === 'offlinepm') Chat.receive.offlinepm(key,d); 
		
};

Chat.receive.public = function(key,d){
	var act = List.all[key];
	var main = List.main[key];
	
    if(!d.item)	act.chatHead = {'text':d.text,'timer':25*10};
	
	var pack = {type:'public',from:d.from,text:d.text,symbol:main.social.symbol};
	
	//Send info
	Chat.add(key,pack);
	for(var i in act.activeList)
		if(List.main[i]) Chat.add(i,pack);
		
	for(var i in List.team[act.team])
		if(List.main[i] && i !== key) Chat.add(i,pack);
	
}

Chat.receive.pm = function(key,d){
    var res = Chat.receive.pm.test(d.from,d.to);
	if(res){	
		var pack = {type:'pm',from:d.from,to:d.to,symbol:List.main[key].social.symbol,text:d.text};
		Chat.add(List.nameToKey[d.to],pack);
		Chat.add(key,pack);
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

Chat.receive.clan = function(key,d){	//to is the number of /
    var clanName = List.main[key].social.list.clan[d.to];
    		
    if(!clanName){ Chat.add(key,'You typed too many \"/\".'); return; }
    var clan = Db.clan[clanName];
    if(!clan){ Chat.add(key,'This clan doesn\'t exist. Strange...'); return; }
    
	var pack = {type:'clan',from:d.from,clan:clan.nick,text:d.text}
    for(var i in clan.memberList){	//including speaker
    	if(clan.memberList[i].active && List.nameToKey[i]){
			Chat.add(List.nameToKey[i],pack);
    	}
    }
    return;
}    

Chat.receive.report = function(key,d){
	if(!Server.report){ Chat.add(key,"Report system is down."); return;}
	if(d.text.length < 1000 && d.title.length < 100){
		db.insert('report',{
			date:new Date().toLocaleString(),
			user:List.all[key].username,
			text:d.text,
			title:d.title,
			category:d.category,			
		});
	}
}


Chat.receive.offlinepm = function(key,d){
	db.findOne('main',{username:d.to},function(err, res) { if(err) throw err;
		if(!res){Chat.add(key,"This player doesn't exist."); return; }
		
		var main = Load.main.uncompress(res);
		
		if(!main.social.list.friend[d.from]){ Chat.add(key,"You can't send an offline PM to that player."); return; }
		
		main.social.message = main.social.message || [];
		main.social.message.push({'type':'offlinepm','from':d.from,'text':d.text,'time':Date.now()});
		Chat.add(key,"Offline PM sent.");
		Save.main(main);
	});
}

































