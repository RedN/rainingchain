
Init.help = function(data){	//Help aka documentation. Called once at start of game. wiki-like parser	
	data = data.replaceAll('<i','<details');
	data = data.replaceAll('</i>','</details>');
	data = data.replaceAll('<t','<summary');
	data = data.replaceAll('</t>','</summary>');
	
	data = data.replacePattern(function(tag){
		return '<span class="helpLink" onclick="Help.open(\'' + tag + '\')" >' + tag + '</span>'
	});
	
	return data;
}

Help = {};
Help.open = function(elID){
	main.help = '';
	var help = $( "#help" );
	help.dialog( "open" );
	
	var el = $('#HELP_' + elID)[0];
	if(!el) return;
	
	Help.closeAll();
	
	while(el !== help[0]){
		el.setAttribute('open',true);
		el = el.parentElement
	}
	
	$('#HELP_' + elID)[0].scrollIntoView(true);
	document.getElementById('gameDiv').scrollIntoView(true);		
}
Help.closeAll = function(){
	var a = $( "details" );
	for(var i in a)
		if(a[i].removeAttribute)
			a[i].removeAttribute('open');
}

Help.icon = function(txt,x,y,size){
	Draw.icon('system.question',x,y,size || 20,{
		"left":{"func":Help.open,"param":[txt]},
		'text':'Open Documentation',
	});
}

