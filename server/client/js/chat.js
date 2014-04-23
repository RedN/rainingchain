//Chat
Chat = {};

Chat.send = function(){
	//Send message to server.
	var text = html.chat.input.value;
	Input.add('',false);
	if(text[0] === '$'){  Command.send(text.slice(1)); return; }
	
	var pack = Chat.send.parse(text);
	if(pack){ socket.emit('sendChat',pack);  }
	
}

Chat.send.parse = function(txt){
	//Clan Chat
	if(txt.indexOf('/') === 0){ 
		var count = 0;
		while(txt[count] === '/'){count++;};
		
		var text = txt.slice(count);
		return {'type':'clan','to':'' + --count,'text':text};	
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
	return {'type':'public','to':'anything','text':txt};	
}

Chat.send.reply = function(){
	if(Chat.send.reply.history.length){
		Input.add('@' + Chat.send.reply.history[0].from + ',');
	}
	if(Chat.send.reply.history.length > 20){
		Chat.send.reply.history = Chat.send.reply.history.slice(0,10);
	}
}
Chat.send.reply.history = [];

Chat.receive = function(pack){
	if(pack.from){ for(var i in main.social.list.mute){ if(i == pack.from){ return; }}}
	
	if(pack.type === 'game')	html.chat.text.innerHTML += '<br>' + pack.text; 
	if(pack.type === 'client')	html.chat.text.innerHTML += '<br>' + pack.text; 
	if(pack.type === 'clan') 	Chat.receive.clan(pack);
	if(pack.type === 'input')	Input.add(pack.text,1);
	if(pack.type === 'pm')	Chat.receive.pm(pack);
	if(pack.type === 'offlinepm')	Chat.receive.offlinepm(pack);	
	if(pack.type === 'public') Chat.receive.public(pack);
	if(pack.type === 'question') Chat.receive.question(pack);
	
	html.chat.text.scrollTop += 50;
	html.pm.text.scrollTop += 50;
	//html.chat.text.scrollTop = html.chat.text.scrollHeight;
	//html.pm.text.scrollTop = html.pm.text.scrollHeight;
	
}
Chat.receive.symbol = function(symbol){
	if(!symbol) return '';
	else return '✪';
}
Chat.receive.clan = function(pack){
	html.chat.text.innerHTML += "<br> <span style='color:" + '#800080' + "'>" + '[' + pack.clan + '] ' + pack.from + ': ' + pack.text + "</span>"; 
}
Chat.receive.pm = function(pack){
	var color = 'cyan';
	if(pack.from === player.name){	//AKA you just sent a pm to someone
		if(main.social.list.friend[pack.to]){color = main.social.list.friend[pack.to].color;}
		html.pm.text.innerHTML += "<br> <span style='color:" + color + "'>" + 'To ' + pack.to + ': ' +  pack.text + "</span>"; 
	} else {
		if(main.social.list.friend[pack.from]){color = main.social.list.friend[pack.from].color;}
		html.pm.text.innerHTML += "<br> <span style='color:" + color + "'>" + 'From ' + pack.from + ': ' +  pack.text + "</span>"; 
		Chat.send.reply.history.unshift(pack);
	}
}
Chat.receive.offlinepm = function(pack){
	var d = new Date(pack.time);
	d = d.toLocaleString();
	html.pm.text.innerHTML += 	"<br> <span style='color:cyan'>" + d + ' - From ' + pack.from + ': ' +  pack.text + "</span>"; 
}
Chat.receive.public = function(pack){
	var text = '<span oncontextmenu="Chat.click.name(\'' + pack.from + '\')">' + Chat.receive.symbol(pack.symbol) + pack.from + "</span>" + ': ' + '<span style="color:blue">' + pack.text + "</span>";
	html.chat.text.innerHTML += '<br>' + text; 
}		
Chat.receive.question = function(pack){	
	if(pack.option === true) pack.option === ['yes','no'];
	pack.server = 1;
	pack.client = 0;
	
	//Chat.question(0,{func:INFO,param:['1'],'server':0,'option':['yes','no']});
	$( "#questionDiv" ).dialog( "open" );
	$("#questionText")[0].innerHTML = pack.text;
	
	var ho = $("#questionOption")[0];
	ho.innerHTML = '';
	main.question = pack;
	
	if(pack.option){
		for(var i in pack.option){
			var but = document.createElement('button');
			but.innerHTML = pack.option[i];
			but.onclick = function(ii){	return function(){
				Chat.question.answer(+ii);
			}}(i);
			ho.appendChild(but);
		}
		
		$("#questionInput").prop('visibility', 'hidden');
	} else {
		$("#questionInput").focus();
		$("#questionInput").prop('visibility', 'visible');
	}
}		
		
		
Chat.click = {};
Chat.click.name = function(name){	//in public chat
	var option = {'name':name,'option':[],'count':0};
			
	option.option[0] = {
		'name':'Send Message',
		'func':function(name){ Input.add('@' + name + ','); },
		'param':[name],	
	};
	
	option.option[1] = {
		'name':'Add Friend',
		'func':function() {  Command.send('fl,add,' + name); } ,
		'param':[name],	
	};

	option.option[2] = {
		'name':'Mute Player',
		'func':function() {  Command.send('mute,' + name); },
		'param':[name],	
	};
		
	Button.creation.optionList(option);
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
		if(q.server){	Command.send('question,' + answer); }
		else applyFunc(main.question.func,(main.question.param || []).concat(answer.split(',')));
	}
	if(typeof answer === 'number'){	//aka option
		if(q.server) Command.send('question,' + q.option[answer]);
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
		
		
		
		