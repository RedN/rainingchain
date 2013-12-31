//clientLoop


Loop = function(){
	Loop.update();
	Loop.send();
	Draw.loop();
}

Loop.send = function(){ 
	Input.send(); 
}

Loop.update = function(){
	for(var i in List.all){
		if(List.all[i].sprite){	Sprite.update(List.all[i]); }
		if(List.all[i].chatHead){ Loop.update.chatHead(List.all[i]); }
	}
	Sprite.update(player);
	if(player.chatHead){ Loop.update.chatHead(player); }
	
	Anim.update();
	// BROKEN Mortal.update.permBoost(player);    //check if server send new boost info
	map = List.map[player.map];
	if(Db.weapon[player.weapon.id]){ player.weapon = Db.weapon[player.weapon.id]; }
	
	//Add to ChatBox which was added by main
	for(var i in chatBox) Chat.receive(chatBox[i]);		
	if(chatInput){	keyFunction(addInput,chatInput);}
	chatBox = [];
	chatInput = '';
	if(help) updateHelp(help);	
	
	
	
	
}

Loop.update.chatHead = function(mort){	//weird name
	mort.chatHead.timer--;
	if(mort.chatHead.timer <= 0){
		mort.chatHead = '';
	}
}



remove = function(i){
	i = typeof i === 'string' ? i : i.id;
	delete List.bullet[i]; 
	delete List.mortal[i];
	delete List.drop[i]; 
	delete List.all[i]; 

}