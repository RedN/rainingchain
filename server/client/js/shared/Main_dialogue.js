//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Main','Party','Collision','Actor','Dialogue']));

Main.Dialogue = function(node,face,x,y){
	return {
		node:node || ERROR(3,'node missing'),
		face:face || null,
		x:x || 0,
		y:y || 0,		
	}
}

Main.dialogue = {};
Main.dialogue.start = function(main,d){
	//start dialogue. also set start x and y to end dialogue if player walks away
	var key = main.id;
	var npc = Dialogue.get(d.quest,d.npc);
	if(!npc) return ERROR(3,'no dialogue',d);
	var node = npc.nodeList[d.node];
	var face = node.noFace ? null : Dialogue.Face(npc.image,npc.name); //temp TOFIX
	main.dialogue = Main.Dialogue(node,face,Actor.get(key).x,Actor.get(key).y);
	if(node.event) node.event(key);	
	Main.setFlag(main,'dialogue');
}

Main.dialogue.end = function(main){
	main.dialogue = null;
	Main.setFlag(main,'dialogue');
}

Main.dialogue.selectOption = function(main,option){
	if(main.questActive && !Party.isLeader(main.id))
		return Message.add(main.id,Message('questPopup','Only the leader can choose dialogue options.',null,Message.QuestPopup(25*8,false)));
	
	if(option.next)
		Main.dialogue.start(main,{quest:option.quest,npc:option.npc,node:option.next});
	else Main.dialogue.end(main);
	
	if(option.event)	//after end so can trigger another dialogue
		option.event(main.id);
}

Main.dialogue.loop = function(main){
	if(!Main.testInterval(main,5)) return;	
	//test if player has move away to end dialogue	
	var key = main.id;
	if(!main.dialogue) return;
	if(Collision.getDistancePtPt(Actor.get(key),main.dialogue) > 100){
		Main.dialogue.end(main);
	}
}


