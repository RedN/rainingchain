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
	for(var i in fullList){
		if(fullList[i].sprite){	Sprite.update(fullList[i]); }
		if(fullList[i].chatHead){ Loop.update.chatHead(fullList[i]); }
	}
	Sprite.update(player);
	if(player.chatHead){ Loop.update.chatHead(player); }
	
	Anim.update();
	// BROKEN Mortal.update.permBoost(player);    //check if server send new boost info
	map = mapList[player.map];
	if(weaponDb[player.weapon.id]){ player.weapon = weaponDb[player.weapon.id]; }
	
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
	i = i === 'string' ? i : i.id;
	delete bList[i]; 
	delete mList[i];
	delete dropList[i]; 
	delete fullList[i]; 

}