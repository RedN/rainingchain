Loop = function(){
	Loop.actor();
	Loop.player();
	Loop.bullet();
	Loop.main();
	Loop.anim();
	Loop.sfx();
	Loop.input();
	Draw.loop();
	Loop.frame++;
	if(Loop.frame % 5 === 0) Input.offset = $('#gameDiv').offset();
	
	if(Input.event.typeNormal()) Input.reset();
	main.hideHUD.passive = 0;
	
	Loop.performance();
	
	if(Loop.frame % 500 === 0) $(".ui-tooltip-content").parents('div').remove();	//tooltip not disappearing
}

	
Loop.frame = 0;

Loop.interval = function(num){
	return Loop.frame % num === 0;
}

Loop.input = function(){ 
	Input.send(); 
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
	
	if(!Db.map[player.map])
		Map.creation(player.map);
	
}
Loop.player.old = {};

Loop.bullet = function(){
	for(var i in List.bullet){
		//cant put position update here cuz desync
		Sprite.update(List.bullet[i]);
	}
}


Loop.performance = function(){
    if(Loop.frame % Loop.performance.frequence === 0){
        var d = Date.now();	
		Loop.performance.result = Math.round(40*Loop.performance.frequence/(d - Loop.performance.oldtime)*100) + '%';
        if(main.pref.displayFPS) Draw.performance();
		Loop.performance.oldtime = d;
    }
};

Loop.performance.frequence = 5*1000/40;
Loop.performance.oldtime = Date.now();
Loop.performance.result = '100%';


Loop.main = function(){
	for(var i in main.social.message) Chat.receive(main.social.message[i]);		
	if(main.chatInput){	applyFunc(Input.add,main.chatInput);}
	main.social.message = [];
	main.chatInput = '';
	
	if(main.sfx) Sfx.play(main.sfx); main.sfx = '';
	if(main.song) Song.play(main.song);	main.song = '';
	if(main.help) Help.open(main.help);	main.help = '';
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

Activelist = {};	//to be same than server
Activelist.removeAny = function(i){
	var id = i.id || i;
	delete List.bullet[id]; 
	delete List.actor[id];
	delete List.drop[id]; 
	delete List.all[id]; 
	delete List.strike[id]; 
}

Actor.loop = function(act){
	Sprite.update(act);
	if(!act.chatHead) return;
	if(--act.chatHead.timer <= 0)	act.chatHead = null;	
}

