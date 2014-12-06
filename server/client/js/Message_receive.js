
Message.receive = function(msg){
	msg.text = Message.receive.parseInput(msg.text);
	for(var i in main.social.muteList) if(i === msg.from) return; 
	
	if(msg.type === 'game')	Dialog.chat.addText(msg.text,msg.timer || 25*60); 
	else if(msg.type === 'public') Message.receive.public(msg);
	else if(msg.type === 'input')	Dialog.chat.setInput(msg.text);
	else if(msg.type === 'signNotification') Message.receive.signNotification(msg);
	else if(msg.type === 'pm')	Message.receive.pm(msg);
	else if(msg.type === 'dialog') Dialog.open('basic',msg);
	else if(msg.type === 'questPopup') Dialog.open('questPopup',msg);
	else if(msg.type === 'question') Dialog.open('question',msg);
	
	/*
	else if(msg.type === 'clan') 	Message.receive.clan(msg);
	
	else if(msg.type === 'contribution') Message.receive.contribution(msg);
	*/

	
}

Message.receive.parseInput = function(text){	//replace [$1] with Input 1 keycode
	if(!text || !text.have('[$')) return text;
	for(var i = 0 ; i <= 6; i++){
		var str = '[$' + i + ']';
		while(text.have(str))
			text = text.replace(str,Input.getKeyName('ability',i,true));	//replaceall with $ is pain
	}
	return text;
}	

Message.receive.public = function(msg){
	var text = 
	'<span oncontextmenu="Message.clickUsername(\'' + msg.from + '\')">' 
	+ (Message.receive.public.SYMBOL_CHART[msg.symbol] || '')
	+ msg.from 
	+ "</span>" + ': ' 
	+ Message.receive.public.getText(msg);
	
	Dialog.chat.addText(text); 
}

Message.receive.public.SYMBOL_CHART = [ //{
	'',
	'<span title="Admin" style="color:white;">✪</span>',
	'<span title="Bronze Contributor" style="color:#CD7F32;">★</span>',
	'<span title="Silver Contributor" style="color:#C0C0C0;">★</span>',
	'<span title="Gold Contributor" style="color:#FFD700;">★</span>',
	'<span title="Diamond Contributor" style="color:white;">★</span>'
]; //}

Message.receive.public.getText = function(msg){
	var color = 'yellow';
	if(msg.color == '1') color = 'pink';
	if(msg.color == '2') color = '#FF5555';
	if(msg.color == '3') color = 'cyan';
	if(msg.color == '4') color = 'orange';
	if(msg.color == '5') color = '#55FF55';
	if(msg.color == '6') msg.text = Message.receive.public.getText.rainbow(msg.text);
	
	return '<span style="color:' + color + ';">' 
	+ msg.text //Message.receive.public.puush(msg)
	+ "</span>";
}

Message.receive.public.getText.rainbow = function(text){
	var list = ['yellow','cyan','pink','#FF5555;','orange','#55FF55'];
	var t = text.split(' ');
	var str = '';
	var lastcolor = '';
	var limit = 0;
	for(var i in t){
		do { var color = list.random();
		} while(lastcolor === color && limit++ < 1000);
		lastcolor = color;
		str += '<span style="color:' + color + ';">' + t[i] + ' ' + '</span>';
	}
	return str;
}

Message.receive.public.puush = function(pack){
	var friend = false;
	for(var i in main.social.friendList) if(i === pack.from) friend = true;
	if(pack.from === player.name) friend = true;
	
	if(pack.from !== Message.ADMIN_USERNAME && main.pref.puush === 0 || (main.pref.puush === 1 && friend === false)){
		return pack.text.replaceAll('a href','span href').replaceAll('</a>','</span>');
	}
	return pack.text;
}

//#######

Message.receive.pm = function(msg){
	//Message.receive.pm({from:'asd',to:'asd',text:'hello!'})
	if(msg.from === player.name){	//AKA you just sent a pm to someone
		var text = $('<span>')
			.html('To ' + msg.to + ': ' +  msg.text);
	} else {
		var from = msg.from === Message.ADMIN_USERNAME ? Message.receive.public.SYMBOL_CHART[1] + Message.ADMIN_USERNAME : msg.from;
		var text = $('<span>')
			.html('From ' + from + ': ' +  msg.text)
			.bind('contextmenu',function(e){
				e.preventDefault();
				Message.clickUsername(msg.from);
				return false;
			});
		Message.reply.HISTORY.unshift(msg);
	}

	Dialog.pm.addText(text,25*60*5);
}


Message.receive.clan = function(pack){
	var span = $('<span>')
		.css({color:'#00FFFF'})
		.html('[' + pack.clan + '] ' + pack.from + ': ' + pack.text);
	Dialog.chat.addText(span); 
}


Message.receive.contribution = function(pack){
	return/*
	Mess age.addToHtml($("#contributionLog")[0],pack.text,25*15);	
	$("#contributionLog")[0].scrollIntoView(true);*/
}

Message.receive.signNotification = function(msg){
	if(main.pref.signNotification === 0) return;
	Message.receive(Message('game',msg.text));	
	if(main.pref.signNotification === 2) Sfx.play('train');
}

Message.ADMIN_USERNAME = 'rc';

Message.clickUsername = function(name){	//in public chat
	/*
	Main.setOpti onList(main,OptionList(name,[
		OptionList.Option(Dialog.chat.setInput,['@' + name + ','],'Send Message'),
		OptionList.Option(Command.execute,['fl,add',[name]],'Add Friend'),
		OptionList.Option(Command.execute,['mute',[name]],'Mute Player'),
	]));
	*/
}

