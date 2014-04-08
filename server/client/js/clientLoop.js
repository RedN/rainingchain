Loop = function(){
	
	if(!Db.map[player.map]){
		permConsoleLog("map not in Db.map in Map.js");
		Map.creation(player.map,[3,3]);
	}
	
	Loop.actor();
	Loop.player();
	Loop.bullet();
	Loop.main();
	Loop.anim();
	Loop.sfx();
	Loop.send();
	Draw.loop();
	Loop.warning();
	Loop.frameCount++;
	
	if(+$("#chatBoxInput").is(":focus")){
		Input.press = {'move':[0,0,0,0],'ability':[0,0,0,0,0,0],'combo':[0,0]};	
	}
	
}
window.onblur = function(){
	Input.press = {'move':[0,0,0,0],'ability':[0,0,0,0,0,0],'combo':[0,0]}; 	
}
	
Loop.frameCount = 0;

Loop.interval = function(num){
	return Loop.frameCount % num === 0;
}
Loop.send = function(){ 
	Input.send(); 
}

Loop.warning = function(){
	$("#warningDiv")[0].style.visibility = $("#warningText")[0].innerHTML ? 'visible' : 'hidden';
}

Loop.actor = function(){
	for(var i in List.actor){
		Actor.loop(List.actor[i]);
	}
}

Loop.player = function(){
	Actor.loop(player);
	if(Loop.player.old.permBoost !== player.permBoost){
		Loop.player.old.permBoost = player.permBoost;
		Actor.update.permBoost(player);	
	}
	if(Loop.player.old.map !== player.map){
		Actor.update.permBoost(player);	
		Loop.player.old.map = player.map
	}
}

Loop.player.old = {};

Loop.bullet = function(){
	for(var i in List.bullet){
		Sprite.update(List.bullet[i]);
	}
}

Loop.main = function(){
	for(var i in main.social.message.chat) Chat.receive(main.social.message.chat[i]);		
	if(main.chatInput){	applyFunc(Input.add,main.chatInput);}
	main.social.message.chat = [];
	main.chatInput = '';
	
	if(main.sfx) Sfx.play(main.sfx); main.sfx = '';
	if(main.song) Song.play(main.song);	main.song = '';
	
	
	if(main.help) Help.open(main.help);	
}

Loop.anim = function(){
	for(var i in List.anim){
		Anim.loop(List.anim[i]);
	}
}

Loop.sfx = function(){
	for(var i in List.sfx){
		var s = List.sfx[i];
		if(--s.delay <= 0){
			Sfx.play(s);
			Sfx.remove(s);
		}
	}
}

removeAny = function(i){
	i = typeof i === 'string' ? i : i.id;
	delete List.bullet[i]; 
	delete List.actor[i];
	delete List.drop[i]; 
	delete List.all[i]; 

}

if(typeof Actor === 'undefined') Actor = {};
Actor.loop = function(act){
	Sprite.update(act);
	Actor.loop.chatHead(act);	
}

Actor.loop.chatHead = function(act){	//weird name
	if(!act.chatHead) return;
	if(--act.chatHead.timer <= 0){
		act.chatHead = '';
	}
}


// Help
Init.help = function(data){
	data = data.replaceAll('<i','<details');
	data = data.replaceAll('</i>','</details>');
	data = data.replaceAll('<t','<summary');
	data = data.replaceAll('</t>','</summary>');

	//Help aka documentation. Called once at start of game. wiki-like parser	
	for(var i = 0 ; i < data.length ; i++){
		
		//Link
		if(data[i] == '[' && data[i+1] == '['){
			var start = i;
			for(var j = start; j < data.length ; j++){
				if(data[j] == ']' && data[j+1] == ']'){
					var tag = data.slice(start+2,j);
					data = data.replaceAll(
					'\\[\\[' + tag + '\\]\\]',
					'<span class="helpLink" onclick="Help.open(\'' + tag + '\')" >' + tag + '</span>'
					);
					break;
				}
			}
		}
		
		//Title 
		/*
		if(data[i] == '{' && data[i+1] == '{'){
			var start = i;
			for(var j = start; j < data.length ; j++){
				if(data[j] == '}' && data[j+1] == '}'){
					var end = j+1;
					var tag = data.slice(start+2,end-1);
					data = data.replaceAll(
					'\\{\\{' + tag + '\\}\\}',
					'<div data-role="collapsible"' + 
					'<span class="helpTag" id="HELP_' + tag + '" >' + tag + '</span>'
					+ '</div>'
					);
					break;
				}
			}
		}
		*/
	}
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
	
	$('#HELP_' + elID)[0].scrollIntoView(true);	//TOFIX
	document.getElementById('gameDiv').scrollIntoView(true);		
}
Help.closeAll = function(){
	var a = $( "details" );
	for(var i in a)
		if(a[i].removeAttribute)
			a[i].removeAttribute('open');
}

Help.icon = function(txt,x,y,size){
	size = size || 20;
	Draw.icon('system.question',x,y,20);	
	Button.creation(0,{
		"rect":[x,x+size,y,y+size],
		"left":{"func":Help.open,"param":[txt]},
		'text':'Open Documentation',
	});
}
