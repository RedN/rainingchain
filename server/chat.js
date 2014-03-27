//chat
Chat = {};
Chat.parse = function(data){
	//Used to transform [[itemId]] into special mouseover info
	for(var i = 0 ; i < data.length ; i++){
		if(data[i] == '[' && data[i+1] == '['){
			var start = i;
			for(var j = start; j < data.length ; j++){
				if(data[j] == ']' && data[j+1] == ']'){
					var id = data.slice(start+2,j);
					
					var item = Db.item[id];
					
					if(item){
						if(item.type == 'armor' || item.type == 'weapon'){
							var str = '<span ' + 
							'style="color:' + 'green' + '" ' +
							'onclick="popupList.equip = \'' + item.id + '\';' + '" ' + 
							'onmouseout="popupList.equip = null;' + '" ' + 
							'>[[' + item.name + 
							']]</span>';
							
							data = data.replaceAll('\\[\\[' + id + '\\]\\]',str	);
								
						}
					}
					break;
				}
			}
		}
	}
	
	
	return data;
}

//add text to chat of player.
Chat.add = function(key,text,type,extra){
	if(!List.main[key]) return;
	List.main[key].social.message.chat = List.main[key].social.message.chat || [];
	type = type || 'game';
	extra = extra || {};
	
	extra.text = text;
	extra.type = type;
	List.main[key].social.message.chat.push(extra);	
}


Chat.question = function(key,q){	//q:{text, func, repeat, [option]}
	List.main[key].question = q;
	Chat.add(key,q.text || '','question',{option:q.option});
}


//when a player wants to send a text
Chat.receive = function(data){
	var key = data.key;									//source (key)
	var act = List.all[key];
	if(!act) return;
	var from = act.name;                     			 //source (name)
	var to = escape.quote(data.to);                     //destination (name)
	var text = Chat.parse(escape.quote(data.text));      //text
	var type = escape.quote(data.type);                 //clan || pm || public
			
	if(!type || !text || !to || !from){ return; }
	if(to === from){ Chat.add(key,"Ever heard of thinking in your head?"); return; }
	
	if(type === 'public') Chat.receive.public(key,text,to,type,from,data); 
	else if(type === 'pm') Chat.receive.pm(key,text,to,type,from,data); 
	else if(type === 'clan') Chat.receive.clan(key,text,to,type,from,data); 
	else if(type === 'report') Chat.receive.report(key,data); 
		
};

Chat.receive.public = function(key,text,to,type,from,data){
    if(text === data.text){
		List.all[key].chatHead = {'text':text,'timer':25*10};
	}
	var from = {'from':from};
	if(List.main[key].social.symbol) from.symbol = List.main[key].social.symbol;
	for(var i in List.main){ Chat.add(i,text,'public',from);}
}

Chat.receive.pm = function(key,text,to,type,from,data){
    var res = Chat.receive.pm.test(from,to);
	if(res){
		Chat.add(List.nameToKey[to],text,'pm',{'from':from,'to':to});
		Chat.add(key,text,'pm',{'from':from,'to':to});
	}
	if(res === false) Chat.add(key,"This player is offline.");
	if(res === null) Chat.add(key,"This player doesn't exist.");
}

Chat.receive.pm.test = function(from,to){
	//test if player can send pm to another. check for online but also mute list
	var main = List.main[List.nameToKey[to]];
	if(!main) return null;
	if(main.social.status === 'off') return false;
	if(main.social.status === 'friend' && !main.social.list.friend[from]) return false;
	return true;
}

Chat.receive.clan = function(key,text,to,type,from,data){
    var clanName = List.main[key].social.list.clan[to];
    		
    if(!clanName){ Chat.add(key,'You typed too many \"/\".'); return; }
    var clan = Db.clan[clanName];
    if(!clan){ Chat.add(key,'This clan doesn\'t exist. Strange...'); return; }
    
    for(var i in clan.memberList){	
    	if(clan.memberList[i].active && List.nameToKey[i]){
    		Chat.add(List.nameToKey[i],text,'clan',{'from':[clan.nick,from]});
    	}
    }
    return;
}    

Chat.receive.report = function(key,data){
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

io.sockets.on('connection', function (socket) {
	//server receives information from client that wishes to send a message
	socket.on('sendChat', function (data) {
		data.key = socket.key;
		Chat.receive(data);
	})
});







































