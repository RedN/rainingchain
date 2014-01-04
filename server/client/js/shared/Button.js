Button = {};

//Button
Button.creation = function (key,data){
	if(server){ var list = List.main[key].btnList; } 
		else { var list = btnList;	}
	data.key = key;
	list.push(useTemplate(Button.template(),data));
}

Button.template = function(){
	return {
		left:null,
		shiftLeft:null,
		ctrlLeft:null,
		right:null,
		shiftRight:null,
		ctrlRight:null,
		rect:[0,0,0,0],
		cursor:"pointer",
		priority:0,
		highlight:false,
		key:0,
		text:'',
		help:'',	
	};
}

Button.test = function (key,x,y,side){
	//called everytime the player clicks. check the list of buttons at that frame and test for collision
	if(server){ var list = List.main[key].btnList; } 
		else { var list = btnList;}
		
	for(var i = list.length-1 ; i >= 0 ; i--){
		if(list[i][side]){
			if(Collision.PtRect({"x":x,'y':y},list[i].rect)){
				if(server) {
					if(!list[i].nokey){
						applyFunc.key(key,list[i][side].func,list[i][side].param);
					} else {
						applyFunc(list[i][side].func,list[i][side].param);
					}
					if(list[i].help) List.main[key].help = list[i].help;
				} else {
					applyFunc(list[i][side].func,list[i][side].param);
					if(list[i].help) updateHelp(list[i].help);
				}
				
				break;
			}	
		}
	}
	
}

Button.context = function (key){
	//check every frame if mouse is over something with a context (aka top left text)
	if(server){ 
		var list = List.main[key].btnList; 
		var x = List.all[key].mouseX;
		var y = List.all[key].mouseY;
	} else { 
		var list = btnList;	
		var x = mouse.x;
		var y = mouse.y;
	}
		
	for(var i = 0 ; i < list.length ; i++){
		if(Collision.PtRect({"x":x,'y':y},list[i].rect)){
			if(server){ List.main[key].context = {'server':server,'text':list[i].text}; }
			if(!server){ main.clientContext = {'server':server,'text':list[i].text}; }
			return;
		}	
	}
	if(server){ List.main[key].context = {'server':server,'text':''}; }
	if(!server){ main.clientContext = {'server':server,'text':''}; }
}

Button.optionList = function(key,option){
	if(server){
		var player = List.all[key];
		option.x = player.mouseX;
		option.y = player.mouseY,
		option.server = server;
		option.count = 2;
		List.main[key].optionList = option;
	}
	if(!server){
		option = key;
		option.x = mouse.x;
		option.y = mouse.y;
		option.client = 1;
		option.count = 2;
		main.optionList = option;
	}
}


//called when player clicks. used to remove popup
Button.reset = function(key){
	if(server){
		var m = List.main[key];
		
		if(m.optionList){
			if(m.optionList.count <= 0){ optionList = null; } 
			else {	m.optionList.count--; }
		}
		
		for(var i in m.popupList){
			m.popupList[i] = 0;
		}
		
		for(var i in m.temp.reset){
			m.temp.reset[i]--;
			if(m.temp.reset[i] < 0){
				delete m.temp[i];
				delete m.temp.reset[i];
			}
		}
	}
	if(!server){
		if(!main.optionList || !main.optionList.count || main.optionList.count <= 0){ main.optionList = null;}
		else {	main.optionList.count--; }
	}
}





























