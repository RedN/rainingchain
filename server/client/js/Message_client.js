//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Input','Button','OptionList','Command','Message']));

Message.sendChatToServer = function(text){
	if(!text.trim()) return;
	
	Dialog.chat.setInput('');
	if(text[0] === '$'){
		Command.execute(Command.textToCommand(text.slice(1)));
		return;
	}
	
	Message.sendToServer(Message.sendChatToServer.textToMessage(text));
}

Message.sendChatToServer.textToMessage = function(txt){
	//Clan Chat
	if(txt[0] === '/'){ 
		var count = 0;
		while(txt[count] === '/') count++;
		var text = txt.slice(count);
		
		return Message('clan',text,player.name,Message.Clan(--count));
	}
		
	//Strict Pm
	if(txt.indexOf('@@') == 0){ 
		txt = txt.slice(2); 
		
		var to = txt.slice(0,txt.indexOf(','));
		var text = txt.slice(txt.indexOf(',') + 1);
		
		return Message('pm',text,player.name,Message.Pm(to));
	}
	
	//Pm with possible nickname
	if(txt.indexOf('@') == 0){ 
		txt = txt.slice(1);
		
		//Check for Nickname
		var nick = txt.slice(0,txt.indexOf(','));
		var to = nick;
		var text = txt.slice(txt.indexOf(',') + 1);
		
		for(var i in main.social.friendList){
			if(nick === main.social.friendList[i].nick) 
				to = i;
		}
				
		return Message('pm',text,player.name,Message.Pm(to));
	}
	
	//Public
	return Message('public',txt,player.name);
}

Message.sendToServer = function(msg){
	Socket.emit('sendChat',msg);
}


Message.reply = function(){
	if(Message.reply.HISTORY.length){
		Dialog.chat.setInput('@' + Message.reply.HISTORY[0].from + ',');
	}
	if(Message.reply.HISTORY.length > 20){
		Message.reply.HISTORY = Message.reply.HISTORY.slice(0,10);
	}
	
}
Message.reply.HISTORY = [];

//###############

Message.add = function(key,msg){
	if(typeof msg === 'string') msg = Message('game',msg,Message.CLIENT);
	Message.receive(msg);
}
Message.addPopup = function(key,text,time){
	Message.add(main.id,Message('questPopup',text,null,Message.QuestPopup(time || 25*30,false)));	
}

