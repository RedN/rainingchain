(function(){ //}
Dialog('setting','Settings',Dialog.Size(350,550),Dialog.Refresh(function(){
	Dialog.setting.apply(this,arguments);
},function(){
	return Tk.stringify(main.pref);
}));
//Dialog.open('setting')


//Draw.openSetting
Dialog.setting = function(html,variable){
	var list = Pref.get();
	html.append('<h2>Preferences</h2>');
	
	html.append($('<button>')
		.addClass('myButton')
		.click(function(){
			Dialog.open('binding');
		})
		.html('Key Bindings')
		.attr('title','Change Key Bindings')
	);
	html.append('<br>');
	html.append($('<button>')
		.addClass('myButton')
		.click(function(){
			Dialog.open('account',true);
		})
		.html('Account Management')
		.attr('title','Open Account Management Window')
	);
	
	html.append('<br>');
	html.append('Volume:');
	html.append($('<button>')
		.click(function(){
			Command.execute('pref',['volumeMaster',(main.pref.volumeMaster+10).mm(0,100)]);
			Command.execute('pref',['volumeSong',(main.pref.volumeSong+10).mm(0,100)]);
			Command.execute('pref',['volumeSfx',(main.pref.volumeSfx+10).mm(0,100)]);
		})
		.html('+')
		.attr('title','Increase volume')
	);
	html.append($('<button>')
		.click(function(){
			Command.execute('pref',['volumeMaster',(main.pref.volumeMaster-10).mm(0,100)]);
			Command.execute('pref',['volumeSong',(main.pref.volumeSong-10).mm(0,100)]);
			Command.execute('pref',['volumeSfx',(main.pref.volumeSfx-10).mm(0,100)]);
		})
		.html('-')
		.attr('title','Decrease volume')
	);
	html.append($('<button>')
		.click(function(){
			Command.execute('pref',['volumeMaster',0]);
		})
		.html('Mute')
		.attr('title','Mute volume')
	);
	html.append('<br>');
		
	//Regular Pref
	var array = [];
	for(var i in list){
		var pref = list[i];
		
		var text = $('<span>')
			.html(pref.name + ':')
			.attr('title',pref.description + ' (' + pref.min + '-' + pref.max + ')')
		
		var input = $('<input>')
			.val(main.pref[i])
			.attr('type','number')
			.attr('max',pref.max)
			.attr('min',pref.min);
		input.change((function(i,input){
			return function(e){
				var newValue = input.val();
				Command.execute('pref',[i,newValue]);
			}			
		})(i,input));
		
		array.push([
			text,
			input		
		]);		
	}
	html.append(Tk.arrayToTable(array,false,false,false,'10px 0'));
}




})();



