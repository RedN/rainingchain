(function(){ //}
Dialog('basic','Message',Dialog.Size('auto','auto'),Dialog.Refresh(function(html,variable,param){
	if(typeof param === 'string'){
		html.append(param);
		html.dialog('option','title','Message');
	} else {
		html.append(param.text);
		html.dialog('option','title',param.title);
	}
}));

//###########################

Dialog('testQuest','Test Quest',Dialog.Size('auto',300),Dialog.Refresh(function(html,variable,param){
	html.css({fontSize:'1.5em'});
	
	html.append('Click links below to quickly test quests:<br>');
	
	var div = $('<div>').css({marginLeft:'50px'});
	html.append(div);
	for(var i in main.quest){
		div.append($('<a>')
			.click((function(i){
				return function(){
					ts("Debug.startQuest(key,'" + i + "')");
				}
			})(i))
			.html('Quest "' + QueryDb.getQuestName(i) + '"<br>')
		);
	}
}));


//################

Dialog('hax','Most Wanted Hax List',Dialog.Size(700,700),Dialog.Refresh(function(html,variable,param){
	$.get('../html/hax.html').success(function(data){ 
		html.html(data);
	});
}));
//###########################

Dialog('contactAdmin','Contact Admin',Dialog.Size(600,400),Dialog.Refresh(function(html,variable,param){
	html.append('Title: ');
	var title = $('<input>')
		.val(param || '');
	html.append(title);
	
	html.append('<br>');
	var text = $('<textarea>')
		.attr({rows:10,cols:50});
	html.append(text)
	html.append('<br>');
	html.append($('<button>')
		.addClass('myButton')
		.html('Submit')
		.click(function(){
			Message.sendToServer(Message('report',text.val(),player.name,Message.Report(title.val())));
			Message.add(key,"Your message has been sent.");
			Dialog.close('contactAdmin');
		})
	);	
}));

//###########################

Dialog('disconnect','You have been disconnected.',Dialog.Size(400,200),Dialog.Refresh(function(html,variable,d){
	var text = '<strong>Alert:</strong><br> ' + d.message;
	html.css({color:'white',font:'1.5em Kelly Slab',backgroundColor:'red'})
	html.append(text);
	
	setTimeout(function(){
		Dialog.close('disconnect');
		location.reload();
	},5000);
	
}));

//#####################

Dialog.UI('context',{	
	position:'relative',	//html width = CST.WIDTH, but only act as container
	height:150,
	width:CST.WIDTH,
	textAlign:'center',
	zIndex:Dialog.ZINDEX.HIGH,
},function(html,variable,text){	//param:{x,y,text}
	if(!text) return false;
	
	var context = $('<div>')
		.css({
			marginTop:'15px',
			padding:'3px',
			border:'2px solid black',
			font:'1.5em Kelly Slab',
			color:'black',
			lineHeight:'100%',
			backgroundColor:'white',
			height:'auto',
			width:'auto',
			textAlign:'center',
			whiteSpace:'nowrap',
			display:'inline-block'
		})
		.html(text);
		
	html.append(context);	
});

//#####################
//Dialog.open('questPopup',{text:'hey',time:100})
//Dialog.open('questPopup',{text:'heasdad asd asjkhd askjd askjd haskdh askd haskd haskdhj akdhas kjdh akjdha kjdhaskj hdask dhasdkj asy',time:3000})

//param:{text,time}
Dialog('questPopup','Quest Help',Dialog.Size('auto','auto'),Dialog.Refresh(function(html,variable,param){
	html.css({	
		zIndex:Dialog.ZINDEX.HIGH,	
		font:'18px Kelly Slab',
		fontSize:'1.5em',
		color:'black',
		lineHeight:'100%',
		backgroundColor:'whit1e',
		maxWidth:'400px',
		height:'auto',
		textAlign:'center',
		display:'inline-block',
	});
	
	if(!param) return false;
	if(variable.timeout) 
		clearTimeout(variable.timeout)
	
	variable.timeout = setTimeout(function(){
		Dialog.close('questPopup');
	},param.time * 40);
	
	html.html(param.text);

}));



//#####################


Dialog.UI('optionList',{	
	position:'absolute',
	
	marginTop:'15px',
	padding:'3px',
	border:'2px solid black',
	zIndex:Dialog.ZINDEX.HIGH,	
	font:'1.1em Kelly Slab',
	color:'black',
	lineHeight:'100%',
	backgroundColor:'white',
	height:'auto',
	width:'auto',
	textAlign:'center',
	whiteSpace:'nowrap',
	display:'inline-block'

},function(html,variable,info){	//param:text
	if(!info) return false;
	$(document).tooltip('disable');
	
	html.append($('<span>')
		.html(info.name + '<br>')
		.css({font:'1.3em Kelly Slab'})
	);
	
	var optionHtml = $('<div>')
		.css({textAlign:'left'});
	var option = info.option;
	for(var i = 0 ; i < option.length ; i++){
		optionHtml.append($('<span>')
			.html(' - ' + option[i].name)
			//.attr('title',option[i].description || option[i].name)	//annoying as fuck
			.addClass('underlineHover')
			.mousedown((function(i){		//mousedown and NOT click... cuz Button.onclick is on down
				return function(){
					OptionList.executeOption(main,option[i]);
				}
			})(i))
		);
		if(i !== option.length-1)
			optionHtml.append('<br>');
	}
	html.append(optionHtml);
	
	var width = html.outerWidth(true).mm(50);
	var height = html.outerHeight(true).mm(50);
	
	var mouse = Input.getMouse();
	var idealX = CST.WIDTH - mouse.x;
	var idealY = CST.HEIGHT - mouse.y - height;
	html.css({
		right:idealX.mm(0,CST.WIDTH - width-5),
		bottom:idealY.mm(0,CST.HEIGHT - height-5),
	});
	
	
},null,null,null,function(){	//onclose
	$(document).tooltip('enable');
});











//#####################

//Dialog.open('questRating','QlureKill');
Dialog.UI('questRating',{	
	position:'absolute',
	top:15,
	left:CST.WIDTH/2,
	marginTop:'15px',
	padding:'3px',
	border:'2px solid black',
	zIndex:Dialog.ZINDEX.HIGH,
	font:'1.1em Kelly Slab',
	color:'black',
	backgroundColor:'white',
	height:'auto',
	width:'auto',
	textAlign:'center',
	whiteSpace:'nowrap',
	
},function(html,variable,quest){
	if(!quest) return false;
	var star = ' ★ ';
	html.append($('<span>')
		.html('Rate ' + QueryDb.getQuestName(quest) + ':<br>')
		.css({fontSize:'1.5em'})
	);
	//###################
	var STAR_CLICKED = null;
	var array = [];
	
	var mouseout = function(){
		if(STAR_CLICKED !== null) return;
		for(var i=0;i<array.length;i++)
			array[i].css({color:'white'})
	}
	
	var click = function(i){
		return function(){
			STAR_CLICKED = i;
			div.show();
		}
	}	
	for(var i = 0 ; i < 3; i++){
		var span = $('<span>')
			.html(star)
			.css({color:'white',fontSize:'2em'})
			.addClass('shadow360')
			.hover((function(i){
					return function(){
						if(STAR_CLICKED !== null) return;
						for(var j=0;j<array.length;j++)
							array[j].css({color:i >= j ? 'gold' : 'white'});
					}
				})(i),
				mouseout
			)
			.click(click(i));
		array.push(span)		
		html.append(span);
	}
	var div = $('<div>')
		.css({textAlign:'center'})
		.hide();
	var textarea = $('<textarea>')
		.attr({rows:5,col:50,placeholder:'Comment (optional)'})	
	var button = $('<button>')
		.html('Submit')
		.addClass('myButton skinny')
		.attr('title','Submit Quest Rating')
		.click(function(){
			Command.execute('questRating',[quest,STAR_CLICKED,textarea.val()]);
			Dialog.close('questRating');
			Message.add(key,'Thanks for your feedback.');
		})
		
	div.append(textarea).append('<br>').append(button);
	html.append('<br>')
	html.append(div);
	
	
});



Dialog.UI('expPopup',{
	position:'absolute',
	left:CST.WIDTH2 + 100,
	top:CST.HEIGHT2,
	width:'auto',
	height:'auto',
	color:'white',
	font:'1.3em Kelly Slab',
},function(html,variable,param){
	if(!param) return false;
	var val = param.r(0);
	var str = val < 0 ? val : '+' + val;
	html.html(val + ' Exp');
	if(variable.timeout)
		clearTimeout(variable.timeout);
	variable.timeout = setTimeout(function(){
		Dialog.close('expPopup');
	},2000);
},function(){
	return '' + Performance.latencyTime + Performance.clientPerformance + main.pref.displayFPS;
});






})();

