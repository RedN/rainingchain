Button = {};

//Button
Button.creation = function (key,data){
	var list = server ? List.btn[key] : List.btn;
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
		key:0,
		text:'',
		textTop:0,
		help:'',
		sfx:null
	};
}

Button.test = function (key,x,y,side){	//on click
	//called everytime the player clicks. check the list of buttons at that frame and test for collision
	var list = server ? List.btn[key] : List.btn;
	for(var i = list.length-1 ; i >= 0 ; i--){
		if(!list[i][side]) continue;
		if(!Collision.PtRect({"x":x,'y':y},list[i].rect)) continue;
		
		var opt = list[i][side];
		if(opt.question){
			var tmp = {server:server,func:opt.func,param:opt.param};
			if(opt.question === true){	tmp.text = 'Are you sure?';	tmp.option = ['yes','no'];} 
			else {	tmp.text = opt.question.text; tmp.option = opt.question.option;	}
			Chat.question(key,tmp);
			break;
		}
		
		if(server) {
			applyFunc.key(key,opt.func,opt.param);
			if(opt.help) List.main[key].help = opt.help;
		} else {
			applyFunc(opt.func,opt.param);
			if(opt.help) Help.open(opt.help);
			if(opt.sfx) Sfx.play(opt.sfx);
		}
		
		break;	//max 1 button per click
	}
	
}

Button.context = function (key){	//always
	//check every frame if mouse is over something with a context (aka top left text)

	var list = server ? List.btn[key] : List.btn;	
	var x = server ? List.all[key].mouseX : Input.mouse.x;
	var y = server ? List.all[key].mouseY : Input.mouse.y;
		
	for(var i = list.length-1 ; i >= 0  ; i--){
		if(Collision.PtRect({"x":x,'y':y},list[i].rect)){
			if(server){ List.main[key].context = {'server':server,'text':list[i].text,'textTop':list[i].textTop}; }
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
		option.client = option.client || 0;
		option.count = 2;
		List.main[key].optionList = option;
	}
	if(!server){
		option = key;
		option.x = Input.mouse.x;
		option.y = Input.mouse.y;
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
			if(m.optionList.count <= 0){ m.optionList = null; } 
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





























