//Chat
Chat = {};

Chat.send = function(){
	//Send message to server.
	var text = html.chat.input.value;
	if(text[0] === '$'){  Chat.send.command(text); }
	else { Chat.send.message(text); }
	Input.add(''); 
}


Chat.send.command = function(text){
	//Send command to server. check /shared/commandShare for list of commands.
	text = Chat.send.command.parse(text);
	
	if(text){ socket.emit('Chat.send.command',text); }
	if(text === false){ main.social.message.chat.push({'type':'client','text':'Invalid Command Entry.'}); } //only work if no message from server same frame
}


Chat.send.command.parse = function(txt){
	if(typeof txt !== 'string') return;
	txt = txt.slice(1); //remove $
	
	for(var i in Command.list){
		if(txt.indexOf(i) === 0){	//valid cmd
			
			var cmd = i;
			var param = [];
			var preParam = txt.slice(i.length+1) + ',';

			while(preParam.indexOf(',') != -1){
				var pos = preParam.indexOf(',');
				var par = preParam.slice(0,pos);
				param.push(par);
				preParam = preParam.slice(pos+1);
			}
			
			if(Command.client.have(cmd)){ 
				applyFunc(Command.list[cmd],param);
				return null;
			}
			return {'cmd':cmd,'param':param}
			
		}		
	}

	return false;
}

Chat.send.message = function(text){
	//Send Chat to other players
	if(typeof text === 'string'){ text = Chat.send.message.parse(text); }
	
	if(text){ socket.emit('sendChat',text);  }
	else { main.social.message.chat.push({'type':'client','text':'Invalid Chat Entry.'}); } //only work if no message from server same frame
}		

Chat.send.message.parse = function(txt){
	
	//Clan Chat
	if(txt.indexOf('/') == 0){ 
		var count = 0;
		while(txt[count] == '/'){count++;};
		
		var text = txt.slice(count);
		return {'type':'clan','to':--count + '','text':text};	
	}
		
	//Strict Pm
	if(txt.indexOf('@@') == 0){ 
		txt = txt.slice(2); 
		
		var to = txt.slice(0,txt.indexOf(','));
		var text = txt.slice(txt.indexOf(',') + 1);
		
		return {'type':'pm','to':to,'text':text};	
	}
	
	//Pm with possible nickname
	if(txt.indexOf('@') == 0){ 
		txt = txt.slice(1);
		
		//Check for Nickname
		var nick = txt.slice(0,txt.indexOf(','));
		var to = nick;
		var text = txt.slice(txt.indexOf(',') + 1);
		
		for(var i in main.social.list.friend){
			if(nick === main.social.list.friend[i].nick){
				to = i;
			}
		}
				
		return {'type':'pm','to':to,'text':text};	
	}
	
	//Public
	return {'type':'public','to':'@public','text':txt};	
}

Chat.send.message.reply = function(){
	if(Chat.send.message.reply.history.length){
		Input.add('@' + Chat.send.message.reply.history[0].from + ',');
	}
	if(Chat.send.message.reply.history.length > 20){
		Chat.send.message.reply.history = Chat.send.message.reply.history.slice(0,10);
	}
}
Chat.send.message.reply.history = [];

Chat.receive = function(pack){
	if(pack.from){ for(var i in main.social.list.mute){ if(i == pack.from){ return; }}}
	
	if(pack.type === 'game')	html.chat.text.innerHTML += '<br>' + pack.text; 
	if(pack.type === 'client')	html.chat.text.innerHTML += '<br>' + pack.text; 
	if(pack.type === 'clan') 	html.chat.text.innerHTML += "<br> <span style='color:" + '#800080' + "'>" + '[' + pack.from[0] + '] ' + pack.from[1] + ': ' + pack.text + "</span>"; 
	if(pack.type === 'input')	Input.add(pack.text,1);
	
	if(pack.type === 'pm'){
		var color = 'cyan';
		if(pack.from === player.name){	//AKA you just sent a pm to someone
			if(main.social.list.friend[pack.to]){color = main.social.list.friend[pack.to].color;}
			html.pm.text.innerHTML += "<br> <span style='color:" + color + "'>" + 'To ' + pack.to + ': ' +  pack.text + "</span>"; 
		} else {
			if(main.social.list.friend[pack.from]){color = main.social.list.friend[pack.from].color;}
			html.pm.text.innerHTML += "<br> <span style='color:" + color + "'>" + 'From ' + pack.from + ': ' +  pack.text + "</span>"; 
			Chat.send.message.reply.history.unshift(pack);
		}
	}
	
	if(pack.type === 'offlinepm'){
		var d = new Date(pack.time);
		d = d.toLocaleString();
		html.pm.text.innerHTML += 	"<br> <span style='color:cyan'>" + d + ' - From ' + pack.from + ': ' +  pack.text + "</span>"; 
	}
	
	if(pack.type === 'public'){	
		var text = '<span oncontextmenu="Chat.click.name(\'' + pack.from + '\')">' + Chat.receive.symbol(pack.symbol) + pack.from + "</span>" + ': ' + '<span style="color:blue">' + pack.text + "</span>";
		html.chat.text.innerHTML += '<br>' + text; 
	}
	if(pack.type === 'question'){
		if(pack.option === 'boolean') pack.option === ['yes','no'];
		pack.server = 1;
		pack.client = 0;
		Chat.receive.question(pack);
	}
	
	html.chat.text.scrollTop += 50;
	html.pm.text.scrollTop += 50;
	//html.chat.text.scrollTop = html.chat.text.scrollHeight;
	//html.pm.text.scrollTop = html.pm.text.scrollHeight;
	
}
Chat.receive.symbol = function(symbol){
	if(!symbol) return '';
	else return '✪';
}

Chat.click = {};
Chat.click.name = function(name){
	var option = {'name':name,'option':[],'count':0};
			
	option.option[0] = {
	'name':'Send Message',
	'func':function(name){ Input.add('@' + name + ','); },
	'param':[name],	
	};
	
	option.option[1] = {
	'name':'Add Friend',
	'func':function() {  Chat.send.command('$fl,add,' + name); } ,
	'param':[name],	
	};

	option.option[2] = {
	'name':'Mute Player',
	'func':function() {  Chat.send.command('$mute,' + name); },
	'param':[name],	
	};
		
	Button.optionList(option);
}

Chat.add = function(text,txt){
	html.chat.text.innerHTML += '<br>' + (txt || text); 	//incase passing key as first param
}
Chat.question = function(uselesskey,q){	//client question
	q.param = q.param || [];
	q.repeat = q.repeat || 0;
	q.text = q.text || 'Are you sure?';
	if(q.option === true) q.option = ['yes','no'];
	q.server = 0;
	main.question = q;
	Chat.receive.question(q);
}

Chat.question.answer = function(answer){
	var q = main.question;
	if(!q) return;
	
	if(typeof answer === 'string'){	//aka textboxt		
		if(q.server){	Chat.send.command('$question,' + answer); }
		else applyFunc(main.question.func,(main.question.param || []).concat(answer.split(',')));
	}
	if(typeof answer === 'number'){	//aka option
		if(q.server) Chat.send.command('$question,' + q.option[answer]);
		else {		
			if(q.option.toString() === 'yes,no'){
				if(q.option[answer] === 'yes')						
					applyFunc(q.func,q.param);
			}
			else applyFunc(q.func,q.param.push(q.option[answer]));
		}
						
	}
	$("#questionInput")[0].value = '';
	$( "#questionDiv" ).dialog('close');
	main.question = null;
}

//Chat.question(0,{func:permConsoleLog,param:['1'],'server':0,'option':['yes','no']});
Chat.receive.question = function(q){
	$( "#questionDiv" ).dialog( "open" );
	$("#questionText")[0].innerHTML = q.text;
	
	var ho = $("#questionOption")[0];
	ho.innerHTML = '';
	main.question = q;
	
	if(q.option){
		for(var i in q.option){
			var but = document.createElement('button');
			but.innerHTML = q.option[i];
			but.onclick = function(ii){	return function(){
				Chat.question.answer(+ii);
			}}(i);
			ho.appendChild(but);
		}
		
		$("#questionInput").prop('disabled', true);
	} else {
		$("#questionInput").focus();
		$("#questionInput").prop('disabled', false);
	}
	
	
}


		
Chat.report = function(){
	var text = $("#contactMeText")[0].value;
	if(text.length > 999){
		$("#contactMeText")[0].value = "You have " + (text.length-999) + " too many characters.\n" + text;
		return;
	}	

	socket.emit('sendChat',{
		text:$("#contactMeText")[0].value,
		type:'report',
		to:"RC",
		category:$("#contactMeSelect")[0].value,
		title:$("#contactMeTitle")[0].value,
	});
	$("#contactMe").dialog("close");
	Chat.add(0,"Your report has been sent.");
}
		