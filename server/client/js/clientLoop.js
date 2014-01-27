Loop = function(){
	Loop.actor();
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
	$("#warningDiv")[0].style.visibility = $("#warningText")[0].innerHTML ? 'visible' : 'hidden';
}

Loop.actor = function(){
	for(var i in List.actor){
		Actor.loop(List.actor[i]);
	}
}

Loop.player = function(){
	Actor.loop(player);
	if(Loop.player.old.weapon !== player.weapon){ 
		if(Db.equip[player.weapon.id]){ 
			player.weapon = Db.equip[player.weapon.id]; 
			Loop.player.old.weapon = player.weapon; 
		}
	}
	if(Loop.player.old.permBoost !== player.permBoost){
		Actor.update.permBoost(player);	
		Loop.player.old.permBoost = player.permBoost
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


remove = function(i){
	i = typeof i === 'string' ? i : i.id;
	delete List.bullet[i]; 
	delete List.actor[i];
	delete List.drop[i]; 
	delete List.all[i]; 

}

Help = {};
Help.open = function(elID){
	main.help = '';
	var el = document.getElementById('HELP' + elID);
	if(!el) return
	$( "#help" ).dialog( "open" );
	el.scrollIntoView(true);
	document.getElementById('gameDiv').scrollIntoView(true);		
}

if(typeof Actor === 'undefined') Actor = {};
Actor.loop = function(mort){
	Sprite.update(mort);
	Actor.loop.chatHead(mort);	
}

Actor.loop.chatHead = function(mort){	//weird name
	if(!mort.chatHead) return;
	if(--mort.chatHead.timer <= 0){
		mort.chatHead = '';
	}
}





