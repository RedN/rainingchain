(function(){ //}
var HEIGHT = 200;
var WIDTH = 600;

Dialog.chatBoxText = null;

Dialog.UI('chat',{
	position:'absolute',
	left:0,
	top:CST.HEIGHT-HEIGHT,
	width:WIDTH,
	height:HEIGHT,
	background:'rgba(0,0,0,0.2)',
	padding:'0px 0px',
	border:'1px solid black',
	color:'white',
	font:'1.3em Kelly Slab',
},function(html){
	if(main.hudState.chat === Main.hudState.INVISIBLE){
		html.hide();
		return null;
	}
	html.show();
	
	Dialog.chatBoxText = Dialog.chatBoxText || $("<div>")
		.attr('id','chatBoxText')
		.addClass('onlyTextScroll shadow')
		.css({height:175,padding:'5px 5px'})
		.html('Welcome!<br>');
	html.append(Dialog.chatBoxText);
	
	//#############
	
	var form = $('<form>')
		.css({
			border:'1px solid black',
			height:25,
			padding:'4px -4px',
			width:WIDTH
		})
		.append($('<span>')
			.html(player.name + ": ")
			.attr('id','chatUserName')
		)
		.append($('<input>')
			.attr('id','chatBoxInput')
			.addClass('onlyText')
			.css({width:400})
		)
		.submit(function(e) {
			e.preventDefault();
			if(Dialog.chat.getInput())
				Message.sendChatToServer(Dialog.chat.getInput());
			else
				Dialog.chat.blurInput();
				
			return false;
		})
		.click(function(){
			Dialog.chat.focusInput();
		})
		.keyup(function(){
			Dialog.open('command');
		});
		
	html.append(form);	
	
	if(main.hudState.bottomChatIcon === Main.hudState.INVISIBLE) return;
	html.append($('<span>')
		.css({
			position:'absolute',
			left:WIDTH-24*2-4,	//-4 cuz border
			top:HEIGHT-24,
		})
		.append(Img.drawIcon.html("tab.friend",24,'Shift-Left: Get Player Currently Online')
			.click(function(e){
				if(!e.shiftKey) return 
				Command.execute('playerlist',[]);
			})
		)
		.append(Img.drawIcon.html("attackMelee.cube",24,'Shift-Left: Clear Chat and PM')
			.click(function(e){
				if(!e.shiftKey) return;
				$('#chatBoxText').html('');
				$("#pmText").html('');
			})
		)
	);
	
},function(){
	return "" + main.hudState.chat + main.hudState.bottomChatIcon;
});

Dialog.chat = {};

Dialog.chat.setInput = function(text,focus,add){	//input chat
	var input = $('#chatBoxInput');
	if(add) input.val(input.val() + text);
	else input.val(text);
	if(focus !== false){ 
		input.focus();
		setTimeout(function(){ 
			input.focus();
			input.selectRange(input.val().length);
		},100);
	}
}

Dialog.chat.getInput = function(){
	return $('#chatBoxInput').val();
}

Dialog.chat.addText = function(text,time){
	$('#chatBoxText').append(text);
	$('#chatBoxText').append('<br>');
	$('#chatBoxText')[0].scrollTop += 50;
	/*
	if(typeof where === 'string') where = Message.addToHtml.getBox(where);
	
	var id = "ChatreceiveaddToHtml-" + Math.randomId();
	where.innerHTML += '<span id="' + id + '">' + text + '<br></span>';
	Message.addToHtml.LIST[id] = timer || main.pref.chatTimePublic * 25;
	where.scrollTop += 50;
	
	for(var i in Message.addToHtml.LIST){
		Message.addToHtml.LIST[i] -= 25;
		if(Message.addToHtml.LIST[i] <= 0){
			var a = $("#" + i);	if(a) a.remove();
			delete Message.addToHtml.LIST[i];
		}
	}
	*/
}

Dialog.chat.isInputActive = function(text){
	if(typeof text === 'string')
		return $('#chatBoxInput').is(":focus") && $('#chatBoxInput').val() === text;
	return $('#chatBoxInput').is(":focus");
};

Dialog.chat.blurInput = function(){
	//$('#chatBoxInput').blur();
	$('#gameDiv').focus();
};

Dialog.chat.focusInput = function(){
	setTimeout(function(){
		$('#chatBoxInput').focus();
	},20);	
};

//##################################

var PM_HEIGHT = 110;
Dialog.UI('pm',{
	position:'absolute',
	left:0,
	top:CST.HEIGHT-HEIGHT-PM_HEIGHT,
	width:WIDTH,
	height:PM_HEIGHT,
	background:'rgba(0,0,0,0)',
	padding:'4px 4px',
	color:'yellow',
	font:'1.3em Kelly Slab',
},function(html){
	html.addClass('onlyText container shadow');
	html.append($('<div>')
		.attr('id','pmText')
	);
});

Dialog.pm = {};
Dialog.pm.addText = function(text,time){
	$("#pmText").append(text);
	$("#pmText").append('<br>');
}

//###########################

Dialog.UI('dialogue',{
	position:'absolute',
	left:0,
	top:CST.HEIGHT-HEIGHT,
	width:WIDTH,
	height:HEIGHT,
	background:'rgba(0,0,0,0.5)',
	padding:'5px 5px',
	border:'1px solid black',
	color:'white',
	font:'1.3em Kelly Slab',
},function(html,variable,dia){
	if(!dia) return false;
	html.addClass('onlyText container shadow');
	
	var FACE = false;
	
	if(dia.face && dia.face.image){
		var face = Img.drawFace(dia.face,96);
		face.css({
			position:'absolute',
			left:3,
			top:3,
			width:100,
		})
		.addClass('inline');
		html.append(face);
		FACE = true;
	}
	var text = $('<div>')
		.css({
			position:'absolute',
			left:FACE ? 105 : 0,
			top:5,	
			width:FACE ? WIDTH - 105 : WIDTH,
		})
		.addClass('inline')
		.append(dia.node.text)
		.append('<br>');
	html.append(text);
	
	for(var i = 0 ; i < dia.node.option.length; i++){
		text.append('&nbsp; - ');
		text.append($('<span>')
			.html(dia.node.option[i].text + '<br>')	//padding?
			.css({cursor:'pointer'})
			.click((function(i){
				return function(){
					Command.execute('dialogue,option',[i]);
				}			
			})(i))
			.addClass('underlineHover')
		);
	}
	
	
});



//#########


Dialog.UI('partyClan',{
	position:'absolute',
	left:0,
	top:CST.HEIGHT-HEIGHT-30,
	width:WIDTH,
	height:HEIGHT,
	padding:'5px 5px',
	color:'white',
	font:'1.3em Kelly Slab',
},function(html,variable,dia){
	if(main.hudState.party === Main.hudState.INVISIBLE) return;
	
	var party = $('<span>');
	var icon = Img.drawIcon.html('tab.friend',18,'Right-Click to change Party')
		.contextmenu(function(){
			Dialog.chat.setInput('$party,join,');
		});
	party.append(icon);
	party.append(' Party "' + (main.party.id || '') + '": ');
	party.append($('<u>')
		.attr('title','Leader')
		.html(main.party.leader)
	);
	var str = ', ';
	for(var i = 0; i < 10 && i < main.party.list.length; i++){
		if(main.party.list[i] !== main.name && main.party.list[i] !== main.party.leader)
			str += main.party.list[i] + ', '; 
	}
	if(main.party.list.length >= 10) str += '...';
	party.append(str);
	
	html.append(party);
	
},function(){
	return Tk.stringify(main.party) + Tk.stringify(main.social.clanList) + main.hudState.party;
});



/* partyClan

	//Party
	var func = function(){
		
	};
	el.appendChild();
	
	var str = ;
	str += '<u title="Leader">' +  + '</u>, ';
	
	el.appendChild($('<span> ' + str.slice(0,-1) + '</span>')[0]); 
	
	el.appendChild($('<br>')[0]);
	
	//Clan
	var func = function(){
		Main.setOp tionList(main,OptionList('Clan',[
			OptionList.Option(Dialog.chat.setInput,['$cc,enter,'],'Join'),
			OptionList.Option(Dialog.chat.setInput,['$cc,leave,'],'Leave'),
			OptionList.Option(Dialog.chat.setInput,['$cc,create,'],'Create'),
		]));
	}
	el.appendChild(Img.drawIcon.html('blessing.wave',18,'',func,func));
	
	var str = ' Clan: ';
	for(var i in main.social.clanList){str += main.social.clanList[i] + '  '; }
	
	el.appendChild($('<span> ' + str + '</span>')[0]); 
	
	//style top still in loop
}
Loop.partyClan.OLD = '';

*/


})();




