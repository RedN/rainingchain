//Button
addButton = function (key,data){
	if(server){ var list = mainList[key].btnList; } 
		else { var list = btnList;	}

	var button = {}
	
	button.left = null;
	button.shiftLeft = null;
	button.ctrlLeft = null;
	
	button.right = null;
	button.shiftRight = null;
	button.ctrlRight = null;
	
	button.rect = [0,0,0,0];
	button.cursor = "pointer";
	button.priority = 0;
	button.highlight = false;
	button.key = key
	button.text = '';
	button.help = '';
	
	for (var i in data) { button[i] = data[i]; }	
	list.push(button);
	
}

//called everytime the player clicks. check the list of buttons at that frame and test for collision
testButton = function (key,x,y,side){
	if(server){ var list = mainList[key].btnList; } 
		else { var list = btnList;}
		
	for(var i = list.length-1 ; i >= 0 ; i--){
		if(list[i][side]){
			if(Collision.PtRect({"x":x,'y':y},list[i].rect)){
				if(server) {
					keyFunction(key,list[i][side].func,list[i][side].param);
					if(list[i].help) mainList[key].help = list[i].help;
				}
				if(!server) {
					innerFunction(list[i][side].func,list[i][side].param);
					if(list[i].help) updateHelp(list[i].help);
				}
				
				break;
			}	
		}
	}
	
}

//check every frame if mouse is over something with a context (aka top left text)
updateContext = function (key){
	if(server){ 
		var list = mainList[key].btnList; 
		var x = fullList[key].mouseX;
		var y = fullList[key].mouseY;
	} else { 
		var list = btnList;	
		var x = mouse.x;
		var y = mouse.y;
	}
		
	for(var i = 0 ; i < list.length ; i++){
		if(Collision.PtRect({"x":x,'y':y},list[i].rect)){
			if(server){ mainList[key].context = {'server':server,'text':list[i].text}; }
			if(!server){ clientContext = {'server':server,'text':list[i].text}; }
			return;
		}	
	}
	if(server){ mainList[key].context = {'server':server,'text':''}; }
	if(!server){ clientContext = {'server':server,'text':''}; }
}

setOptionList = function(key,option){
	if(server){
		var player = fullList[key];
		option.x = player.mouseX;
		option.y = player.mouseY,
		option.server = server;
		mainList[key].optionList = option;
	}
	if(!server){
		key.x = mouseX;
		key.y = mouseY;
		key.client = 1;
		key.count = 2;
		optionList = key;
	}
}


//called when player clicks. used to remove popup
inputReset = function(key){
	if(server){
		mainList[key].optionList = null;
		mainList[key].popupList.weapon = 0;
		mainList[key].popupList.armor = 0;
		
		for(var i in mainList[key].temp.reset){
			mainList[key].temp.reset[i]--;
			if(mainList[key].temp.reset[i] < 0){
				delete mainList[key].temp[i];
				delete mainList[key].temp.reset[i];
			}
		}
	}
	if(!server){
		if(!optionList || !optionList.count || optionList.count <= 0){ optionList = null; return }
		optionList.count--;
	}
}





























