Loop = function(){
	Loop.mortal();
	Loop.player();
	Loop.bullet();
	Loop.main();
	Loop.anim();
	Loop.sfx();
	Loop.send();
	Draw.loop();
	Loop.warning();
}

Loop.send = function(){ 
	Input.send(); 
}

Loop.warning = function(){
	if(html.warning.text.innerHTML){
		html.warning.div.style.visibility = 'inline';
	}
}

Loop.mortal = function(){
	for(var i in List.mortal){
		Mortal.loop(List.mortal[i]);
	}
}

Loop.player = function(){
	Mortal.loop(player);
	if(Loop.player.old.weapon !== player.weapon){ 
		if(Db.equip[player.weapon.id]){ 
			player.weapon = Db.equip[player.weapon.id]; 
			Loop.player.old.weapon = player.weapon; 
		}
	}
	if(Loop.player.old.permBoost !== player.permBoost){
		Mortal.update.permBoost(player);	
		Loop.player.old.permBoost = player.permBoost
	}
	if(Loop.player.old.map !== player.map){
		Mortal.update.permBoost(player);	
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
	if(main.help) Help.update(main.help);	
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


remove = function(i){
	i = typeof i === 'string' ? i : i.id;
	delete List.bullet[i]; 
	delete List.mortal[i];
	delete List.drop[i]; 
	delete List.all[i]; 

}

Help = {};
Help.update = function(elID){
	main.help = '';
	var el = document.getElementById('HELP' + elID);
	if(el) el.scrollIntoView(true);
	document.getElementById('gameDiv').scrollIntoView(true);		
}


if(typeof Mortal === 'undefined') Mortal = {};
Mortal.loop = function(mort){
	Sprite.update(mort);
	Mortal.loop.chatHead(mort);	
}

Mortal.loop.chatHead = function(mort){	//weird name
	if(!mort.chatHead) return;
	if(--mort.chatHead.timer <= 0){
		mort.chatHead = '';
	}
}





