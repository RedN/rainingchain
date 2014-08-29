//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Init'],['Help']));

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

var Help = exports.Help = {};
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

Help.icon = function(txt,x,y,size,image){
	var over = Draw.icon('system.question',x,y,size || 20,{
		"left":{"func":Help.open,"param":[txt]},
		'text':'Open Documentation',
	});
	
	if(over && image && main.pref.displayHelp){
		List.ctx.uiHelper.drawImage(Img.help[image],0,0,Img.help[image].width,Img.help[image].height,0,0,1280,720);
	}
}

















