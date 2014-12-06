(function(){ //}

Dialog('friend','Friend List',Dialog.Size(300,500),Dialog.Refresh(function(){
	Dialog.friend.apply(this,arguments);
},function(){
	return Tk.stringify(main.social.friendList);
}));
//Dialog.open('friend')

Dialog.friend = function(html,variable){
	var list = main.social.friendList;
		 	
	var all = $('<div>').addClass('shadow');
	all.append('<h2>Friend List</h2>');
	html.append(all);

	
	for(var i in list){
		var el = $('<span>')
			.css({color:list[i].online ? '#00FF00' : '#FF4D49'})
			.attr('title',i + ' : ' + list[i].nick + '  |  '+ list[i].comment)
			.html(i)
			.click((function(i){
				return function(){
					Dialog.chat.setInput('@' + i + ',');
				}
			})(i))
			.bind('contextmenu',(function(i){
				return function(e){
					e.preventDefault();
					Dialog.friend.rightClick(i);
				}
			})(i))
		all.append(el);
		all.append('<br>');
	}
	
	
	html.append($('<button>')
		.addClass('myButton')
		.html('Add a friend.')
		.click(function(){
			Dialog.chat.setInput('$fl,add,');
		})
	);
	html.append('<br>');
	html.append($('<button>')
		.addClass('myButton')
		.html('Remove a friend.')
		.click(function(){
			Dialog.chat.setInput('$fl,remove,');
		})
	);
	html.append('<br>');
	html.append($('<button>')
		.addClass('myButton')
		.html('Mute a player.')
		.click(function(){
			Dialog.chat.setInput('$mute,');
		})
	);

}

Dialog.friend.rightClick = function(name){
	/*
	Main.set OptionList(main,OptionList(name,[
		OptionList.Option(Dialog.chat.setInput,['@' + name + ','],'Send Message'),
		OptionList.Option(Dialog.chat.setInput,['$fl,nick,' + name + ','],'Change Nickname'),
		OptionList.Option(Dialog.chat.setInput,['$fl,comment,' + name + ','],'Change Comment'),
		OptionList.Option(Command.execute,['fl,remove',[name]],'Remove Friend'),
	]));
	*/
}




})();





