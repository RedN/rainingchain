//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Server','Save','Load','requireDb','Contribution'],['Chat']));

var db = requireDb();

//chat
var Chat = exports.Chat = {};
Chat.parse = function(data){
	data = escape.html(data);
	var puush = data;
	data = data.replaceCustomPattern('http://puu.sh/','.png',Chat.parse.puush);
	data = data.replaceCustomPattern('http://puu.sh/','.jpg',Chat.parse.puush);
	data = data.replaceCustomPattern('http://puu.sh/','.txt',Chat.parse.puush);
	var item = data;
	data = data.replacePattern(Chat.parse.item);
	return {text:data,item:data !== item,puush:puush !== item};
}

//<a href="http:www.youtube.com">Click</a>


//'http://puu.sh/8H2H1.png'.slice(-9,-4)

Chat.parse.item = function(id){
	var item = Db.item[id];
	if(!item || item.type !== 'equip') return '[' + id + ']';
	
	return '<span ' + 
	'style="color:green" ' +
	'onclick="main.popupList.equip = \'' + item.id + '\';' + '" ' + 
	'onmouseout="main.popupList.equip = null;' + '" ' + 
	'>[' + item.name + 
	']</span>';
}

Chat.add = function(key,pack){
	var main = List.main[key];
	if(!main) return;
	main.social.message = main.social.message || [];
		
	main.social.message.push(pack);		
}

Chat.broadcast = function(text){
	for(var i in List.main)
		Chat.add(i,text);
}

Chat.question = function(key,q){	//q:{text, func, param, repeat, [option]}
	q.param = q.param || [];
	q.text = q.text || 'Are you sure?';
	q.repeat = q.repeat || 0;
	if(q.option === true) q.option = ['yes','no'];
	List.main[key].question = q;
	Chat.add(key,{type:'question',option:q.option,text:q.text});
}

Chat.parse.puush = function(link){
	return	'<a style="color:cyan" href="' + link + '" target="_blank">[' + link.slice(-9,-4) + ']</a>';
}
 
Chat.receive = function(d){	//data:{to,key,type,text,	[title,category for report]
	if(d.type !== 'report' && d.text.length > 200) return;	//too long
	if(Chat.receive.regex.test(d.text)) return;
	
	var key = d.key;									//source (key)
	if(List.main[key].social.muted) return;				//player is muted
	d.from = List.all[key].name;                     	//source (name)
	d.to = escape.quote(d.to);                     		//destination (name)
	var parse = Chat.parse(d.text);     	//text
	d.item = parse.item;
	d.puush = parse.puush;
	d.text = parse.text;
	
	if(!d.type || !d.text || !d.to || !d.from){ return; }
	if(d.to === d.from){ Chat.add(key,"Ever heard of thinking in your head?"); return; }
	
	if(d.type === 'public') Chat.receive.public(key,d); 
	else if(d.type === 'pm') Chat.receive.pm(key,d); 
	else if(d.type === 'clan') Chat.receive.clan(key,d); 
	else if(d.type === 'report') Chat.receive.report(key,d); 
	else if(d.type === 'offlinepm') Chat.receive.offlinepm(key,d); 
		
};
Chat.receive.regex = /[^\x20-\x7E]/;

Chat.receive.public = function(key,d){
	var act = List.all[key];
	var main = List.main[key];
	
    if(!d.item && !d.puush)	act.chatHead = {'text':unescape.html(d.text),'timer':25*10};
	
	var pack = {type:'public',from:d.from,text:d.text,custom:main.social.customChat};
	
	//Send info
	var alreadySentTo = {};
	Chat.add(key,pack);
	for(var i in act.activeList){
		if(List.main[i]){
			alreadySentTo[i] = 1;
			Chat.add(i,pack);
		}
	}
	for(var i in List.party[act.party].list)
		if(List.main[i] && i !== key && !alreadySentTo[i]) Chat.add(i,pack);
	
}

Chat.receive.pm = function(key,d){
    var res = Chat.receive.pm.test(d.from,d.to);
	if(res){	
		var pack = {type:'pm',from:d.from,to:d.to,text:d.text};
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

Chat.receive.report = function(key,d){
	if(!Server.report) return Chat.add(key,"Report system is down.");
	if(d.text.length > 1000 && d.title.length > 50) return Chat(key,'Too long text or title.');
	
	var name = List.all[key].username;
	
	db.text = unescape.html(d.text);
	
	//if(d.category === 'misc'){
		db.email.feedback(d.title || '',(d.subcategory || '') + ':' + d.text,List.all[key].name);
	// }
	/*
	if(d.category !== 'quest'){
		return db.insert('report',{
			date:new Date().toLocaleString(),
			user:name,
			text:d.text,
			title:d.title,
			category:d.category,
			subcategory:d.subcategory,
		});
	}
	*/
	if(d.category === 'quest'){
		if(d.text.length > 100) return;
		if(db.twitter) db.twitter.post('#' + d.subcategory + ' ' + name + ': ' + d.text);	//doesnt work if no Db_private
	}
	
}























