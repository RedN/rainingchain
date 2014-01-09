//chat
Chat = {};
Chat.parse = function(data){
	//Used to transform [[itemId]] into special mouseover info
	//Item [[item.id]]
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
Chat.add = function(key,type,text,extra){
	List.main[key].social.message.chat = List.main[key].social.message.chat || [];
    extra = extra || {};
	if(text === undefined){ text = type; type = 'game';}
	
	extra.text = text;
	extra.type = type;
	
	List.main[key].social.message.chat.push(extra);	
}

//when a player wants to send a text
Chat.send = function(data){
	var key = data.key;									//source (key)
	var from = List.all[key].name;                      //source (name)
	var to = customEscape(data.to);                     //destination (name)
	var text = Chat.parse(customEscape(data.text));      //text
	var type = customEscape(data.type);                 //clan || pm || public
			
	if(!type || !text || !to || !from){ return; }
	if(to === from){ Chat.add(key,"Ever heard of thinking in your head?"); return; }
	
	if(type === 'public') Chat.send.public(key,text,to,type,from,data); 
	else if(type === 'pm') Chat.send.pm(key,text,to,type,from,data); 
	else if(type === 'clan') Chat.send.clan(key,text,to,type,from,data); 
		
};

Chat.send.public = function(key,text,to,type,from,data){
    if(text === data.text){
		List.all[key].chatHead = {'text':text,'timer':25*10};
	}
	for(var i in List.main){	Chat.add(i,'public',text,{'from':from});}
	return;
}

Chat.send.pm = function(key,text,to,type,from,data){
    Chat.send.pm.test(from,to,(function(res,from,to){
		if(res){
			Chat.add(List.nameToKey[to],'pm',text,{'from':from,'to':to});
			Chat.add(key,'pm',text,{'from':from,'to':to});
		}
		if(res === false){
			Chat.add(key,"This player is offline.");
		} 
		if(res === ''){
			Chat.add(key,"This player doesn't exist.");
		}	
	}));
	return
}

Chat.send.pm.test = function(from,to,cb){
	//test if player can send pm to another. check for online but also mute list
	db.account.find({username:to},function(err, r) {
		
		if(r[0]){	//aka exist
			var bool = r[0].id;
			var main = List.main[r[0].id];
			if(!main){ bool = false; } else {
				if(main.social.status === 'off'){ bool = false; }
				if(main.social.status === 'friend'){ 
					if(!main.social.list.friend[from]){ bool = false; }				
				}
			}
			cb(bool,from,to);
		} else { cb('');  }
	});	
}

Chat.send.pm.clan = function(key,text,to,type,from,data){
    var clanName = List.main[key].social.list.clan[+to];
    		
    if(!clanName){ Chat.add(key,'You typed too many \"/\".'); return; }
    var clan = Db.clan[clanName];
    if(!clan){ Chat.add(key,'This clan doesn\'t exist. Strange...'); return; }
    
    for(var i in clan.memberList){	
    	if(clan.memberList[i].active && List.nameToKey[i]){
    		Chat.add(List.nameToKey[i],'clan',text,{'from':[clan.nick,from]});
    	}
    }
    return;
}    

io.sockets.on('connection', function (socket) {
	//server receives information from client that wishes to send a message
	socket.on('sendChat', function (data) {
		data.key = socket.key;
		Chat.send(data);
	})
});







































