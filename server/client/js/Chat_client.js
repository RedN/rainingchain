//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','Input','Button','Command','Tk'],['Chat']));

//Chat
var Chat = exports.Chat = {};
Chat.send = function(){
	//Send message to server.
	var text = html.chat.input.value;
	if(!text.trim()) return;
	
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
	if(typeof pack === 'string') pack = {type:'game',text:pack};
	pack.text = Chat.receive.parseInput(pack.text);
	if(pack.from){ for(var i in main.social.list.mute){ if(i == pack.from){ return; }}}
	
	if(pack.type === 'game')	Chat.receive.addToHtml(html.chat.text,pack.text,pack.timer || 25*60); 
	else if(pack.type === 'client')	Chat.receive.addToHtml(html.chat.text,pack.text,pack.timer || 25*60);  
	else if(pack.type === 'clan') 	Chat.receive.clan(pack);
	else if(pack.type === 'input')	Input.add(pack.text,1);
	else if(pack.type === 'pm')	Chat.receive.pm(pack);
	else if(pack.type === 'offlinepm')	Chat.receive.offlinepm(pack);	
	else if(pack.type === 'public') Chat.receive.public(pack);
	else if(pack.type === 'question') Chat.receive.question(pack);
	else if(pack.type === 'popup') Chat.receive.popup(pack);
	else if(pack.type === 'dialog') Chat.receive.dialog(pack);
	else if(pack.type === 'contribution') Chat.receive.contribution(pack);
	else if(pack.type === 'signIn') Chat.receive.signIn(pack);
	

	//html.chat.text.scrollTop = html.chat.text.scrollHeight;
	//html.pm.text.scrollTop = html.pm.text.scrollHeight;
	
}
Chat.receive.parseInput = function(text){
	if(!text || !text.have('[$')) return text;
	for(var i = 0 ; i <= 6; i++)
		while(text.have('[$' + i + ']'))
			text = text.replace('[$' + i + ']',Input.key.ability[i][0].toString().keyCodeToName(true));	//replaceall with $ is pain
	return text;
}	


Chat.receive.clan = function(pack){
	Chat.receive.addToHtml(html.chat.text,'<span style="color:#00FFFF;">[' + pack.clan + '] ' + pack.from + ': ' + pack.text + "</span>"); 
}
Chat.receive.pm = function(pack){
	if(pack.from === player.name){	//AKA you just sent a pm to someone
		var text = '<span style="color:yellow;">' + 'To ' + pack.to + ': ' +  pack.text + '</span>';
	} else {
		var from = pack.from === 'rc' ? '<span title="Admin" style="color:white">✪</span>rc' : pack.from;
		var text = '<span oncontextmenu="Chat.click.name(\'' + pack.from + '\');" style="color:yellow;">' + 
		'From ' + from + ': ' +  pack.text 
		+ '</span>';
		Chat.send.reply.history.unshift(pack);
	}

	Chat.receive.addToHtml(html.pm.text,text,25*60*5);
}
Chat.receive.offlinepm = function(pack){
	var d = new Date(pack.time);
	d = d.toLocaleString();
	html.pm.text.innerHTML += 	"<br> <span style='color:cyan'>" + d + ' - From ' + pack.from + ': ' +  pack.text + "</span>"; 
}


Chat.receive.public = function(pack){
	//pack.custom = [symbol,color,bold]
	var text = 
	'<span oncontextmenu="Chat.click.name(\'' + pack.from + '\')">' 
	+ Chat.receive.public.symbol(pack) 
	+ Chat.receive.public.from(pack) 
	+ "</span>" + ': ' 
	+ Chat.receive.public.text(pack);
	
	Chat.receive.addToHtml(html.chat.text,text); 
}

Chat.receive.public.symbol = function(pack){
	if(pack.custom[0] == '0') return '';
	if(pack.custom[0] == '1') return '<span title="Admin">✪</span>';
	if(pack.custom[0] == '2') return '<span title="Bronze Contributor" style="color:#CD7F32;">★</span>';
	if(pack.custom[0] == '3') return '<span title="Silver Contributor" style="color:#C0C0C0;">★</span>';
	if(pack.custom[0] == '4') return '<span title="Gold Contributor" style="color:#FFD700;">★</span>';
	if(pack.custom[0] == '5') return '<span title="Diamond Contributor" style="color:white;">★</span>';
	return '';
}
Chat.receive.public.from = function(pack){
	return pack.from;
}

Chat.receive.public.text = function(pack){
	var color = 'yellow';
	if(pack.custom[1] == '1') color = 'pink';
	if(pack.custom[1] == '2') color = '#FF5555';
	if(pack.custom[1] == '3') color = 'cyan';
	if(pack.custom[1] == '4') color = 'orange';
	if(pack.custom[1] == '5') color = '#55FF55';
	if(pack.custom[1] == '6') pack.text = Chat.receive.public.text.rainbow(pack.text);
	
	return '<span style="color:' + color + ';">' 
	+ Chat.receive.public.puush(pack)
	+ "</span>";
}	
Chat.receive.public.text.rainbow = function(text){
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

Chat.receive.public.puush = function(pack){
	var friend = false;
	for(var i in main.social.list.friend) if(i === pack.from) friend = true;
	if(pack.from === player.name) friend = true;
	
	if(pack.from !== 'rc' && main.pref.puush === 0 || (main.pref.puush === 1 && friend === false)){
		return pack.text.replaceAll('a href','span href').replaceAll('</a>','</span>');
	}
	return pack.text;
}

Chat.receive.popup = function(pack){
	clearTimeout(Chat.receive.popup.timeout); 
	$("#questPopup")[0].innerHTML = pack.text;
	$("#questPopup")[0].style.visibility = 'visible';
	setTimeout(function(){
		$("#questPopup")[0].style.visibility = 'hidden';
	},(pack.time*40) || 8000);
}
Chat.receive.popup.timeout;

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
		
		$("#questionInput")[0].style.visibility = 'hidden';
	} else {
		$("#questionInput").focus();
		$("#questionInput")[0].style.visibility = 'visible';
	}
}		
Chat.receive.dialog = function(pack){
	$("#popupDialog").html(pack.text);
	$("#popupDialog").dialog('open');
}	

Chat.receive.contribution = function(pack){
	Chat.receive.addToHtml($("#contributionLog")[0],pack.text,25*15);	
	$("#contributionLog")[0].scrollIntoView(true);
}

Chat.receive.addToHtml = function(where,text,timer){
	var id = "ChatreceiveaddToHtml-" + Math.randomId();
	where.innerHTML += '<span id="' + id + '">' + text + '<br></span>';
	Chat.receive.addToHtml.list[id] = timer || main.pref.chatTimePublic * 25;
	where.scrollTop += 50;
}
Chat.receive.addToHtml.list = {};


Chat.receive.signIn = function(pack){
	if(main.pref.signInNotification === 0) return;
	Chat.receive({type:'game',text:pack.text});
	
	if(main.pref.signInNotification === 2) Sfx.play('train');
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

Chat.add = function(text,txt){	//txt incase passing key as first param
	Chat.receive.addToHtml(html.chat.text,text.text || txt || text,text.timer);
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
		else Tk.applyFunc(main.question.func,(main.question.param || []).concat(answer.split(',')));
	}
	if(typeof answer === 'number'){	//aka option
		if(q.server) Command.send('question,' + q.option[answer]);
		else {		
			if(q.option.toString() === 'yes,no'){
				if(q.option[answer] === 'yes')						
					Tk.applyFunc(q.func,q.param);
			}
			else Tk.applyFunc(q.func,q.param.push(q.option[answer]));
		}
						
	}
	$("#questionInput")[0].value = '';
	$( "#questionDiv" ).dialog('close');
	main.question = null;
}
	
Chat.report = function(){
	var text = $("#contactMeText")[0].value;
	var limit = $("#contactMeCategory")[0].value === 'quest' ? 99 : 999;
	if(!text.length) return;
	if(text.length > limit){
		$("#contactMeText")[0].value = "You have " + (text.length-limit) + " too many characters.\n" + text;
		return;
	}	

	socket.emit('sendChat',{
		text:$("#contactMeText")[0].value,
		type:'report',
		to:"rc",
		category:$("#contactMeCategory")[0].value,
		subcategory:$("#contactMeSubcategory")[0].value,
		title:$("#contactMeTitle")[0].value,
	});
	$("#contactMe").dialog("close");
	$("#contactMeText")[0].value = '';
	$("#contactMeTitle")[0].value = '';
	Chat.add("Your message has been sent.");
}
Chat.report.select = function(){
	var cat = $("#contactMeCategory")[0].value;
	if(cat === 'quest'){
		var str = ''; 
		for(var i in Db.questNameConvert){
			str += '<option value="' + i + '">' + Db.questNameConvert[i] + '</option>';
		}
		$("#contactMeSubcategory")[0].innerHTML = str;
		$("#contactMeLimit")[0].innerHTML = 100;
		$("#contactMeTitle")[0].style.visibility = 'hidden';
		
	} else {
		$("#contactMeLimit")[0].innerHTML = 1000;
		$("#contactMeTitle")[0].style.visibility = 'visible';
	}
	if(cat === 'abuse'){
		$("#contactMeSubcategory")[0].innerHTML = 
			'<option value="hack">Hack</option>' +
			'<option value="player">Player</option>';
	}
	if(cat === 'bug'){
		$("#contactMeSubcategory")[0].innerHTML = 
			'<option value="general">General</option>' +
			'<option value="quest">Quest</option>' +
			'<option value="combat">Combat</option>';
	}
	if(cat === 'misc'){
		$("#contactMeSubcategory")[0].innerHTML = 
			'<option value="general">misc</option>';
	}
}		
	
Chat.report.open = function(cat,sub){
	$("#contactMeCategory")[0].value = cat;
	if(sub) {
		Chat.report.select();
		$("#contactMeSubcategory")[0].value = sub;
	}
	$("#contactMe").dialog("open");
}

	
Chat.puush = function(link){
	
}		
	
Chat.clear = function(){
	html.chat.text.innerHTML = '';
	html.pm.text.innerHTML = '';
	Chat.receive.addToHtml.list = {};
}
	