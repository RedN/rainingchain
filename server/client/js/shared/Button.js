Button = {};

//Button
Button.creation = function (key,data){
	var list = SERVER ? List.btn[key] : List.btn;
	data.key = key;
	list.push(Tk.useTemplate(Button.template(),data));
}

Button.creation.optionList = function(key,option){
	if(SERVER){
		var player = List.all[key];
		option.x = player.mouseX;
		option.y = player.mouseY,
		option.client = option.client || 0;
		option.count = 2;
		List.main[key].optionList = option;
	}
	if(!SERVER){
		option = key;
		option.x = Input.mouse.x;
		option.y = Input.mouse.y;
		option.client = 1;
		option.count = 2;
		main.optionList = option;
	}
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

Button.test = function (key,x,y,side){	//called everytime the player clicks
	if(SERVER) Button.updateList(key);
	var list = SERVER ? List.btn[key] : List.btn;
	
	for(var i = list.length-1 ; i >= 0 ; i--){
		if(!list[i][side]) continue;
		if(!Collision.PtRect({"x":x,'y':y},list[i].rect)) continue;
		
		var opt = list[i][side];
		if(opt.question){
			var tmp = {server:SERVER,func:opt.func,param:opt.param};
			if(opt.question === true){	tmp.text = 'Are you sure?';	tmp.option = ['yes','no'];} 
			else {	tmp.text = opt.question.text; tmp.option = opt.question.option;	}
			Chat.question(key,tmp);
			break;
		}
		
		if(SERVER) {
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

Button.context = function (key){ 	//check every frame

	var list = SERVER ? List.btn[key] : List.btn;	
	var x = SERVER ? List.all[key].mouseX : Input.mouse.x;
	var y = SERVER ? List.all[key].mouseY : Input.mouse.y;
		
	for(var i = list.length-1 ; i >= 0  ; i--){
		if(Collision.PtRect({"x":x,'y':y},list[i].rect)){
			var tmp = {'server':SERVER,'text':list[i].text,'textTop':list[i].textTop};
			if(SERVER) List.main[key].context = tmp; 
			if(!SERVER) main.clientContext = tmp; 
			return;
		}	
	}
	if(SERVER){ List.main[key].context = {'server':SERVER,'text':''}; }
	if(!SERVER){ main.clientContext = {'server':SERVER,'text':''}; }
}

Button.reset = function(key){	//called when player clicks. used to remove popup
	if(SERVER){	
		var m = List.main[key];
		
		if(m.optionList){
			if(m.optionList.count <= 0){ m.optionList = null; } 
			else {	m.optionList.count--; }
		}
		
		for(var i in m.popupList)	m.popupList[i] = 0;
		
		for(var i in m.temp.reset){	//TOFIX
			if(--m.temp.reset[i] < 0){
				delete m.temp[i];
				delete m.temp.reset[i];
			}
		}
	}
	if(!SERVER){
		if(!main.optionList || !main.optionList.count || main.optionList.count <= 0){ main.optionList = null;}
		else {	main.optionList.count--; }
	}
}

Button.updateList = function (key){	//server
	List.btn[key] = [];
	Button.updateList.drop(key);
	Button.updateList.actor(key);	
}

Button.updateList.actor = function (key){
	var player = List.all[key];
	for(var i in player.activeList){
		var act = List.actor[i];
		if(!act || act.dead || i === key || !act.hitBox) continue;
			
		var x = Cst.WIDTH2 + act.x - player.x;
		var y = Cst.HEIGHT2 + act.y - player.y;
		
		var info = {
			"rect":Collision.getHitBox({x:x,y:y,hitBox:act.hitBox}),
		};
		
		if(act.optionList && !act.combat){
			info['right'] = {'func':'Button.creation.optionList','param':act.optionList};
		}
		for(var i in act.onclick){
			info[i] = {'func':act.onclick[i].func,'param':act.onclick[i].param};
		}
		Button.creation(key,info);
	}		
}	
	
Button.updateList.drop = function(key){
	var act = List.actor[key];
	for(var i in act.activeList){
		var drop = List.drop[i];
		if(!drop){ continue; }
		var numX = Cst.WIDTH2 + drop.x - List.actor[key].x;
		var numY = Cst.HEIGHT2 + drop.y - List.actor[key].y;
		
		Button.creation(key,{
			"rect":[numX,numX+32,numY,numY+32],
			"left":{"func":'Actor.click.drop',"param":[i]},
			'right':{'func':'Actor.click.drop.rightClick','param':[{x:drop.x,y:drop.y}]},
		});	
	}
}



