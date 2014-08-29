//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Tk','Input','Chat','Collision','Actor'],['Button']));

var Button = exports.Button = {};

Button.creation = function (key,data){
	var list = SERVER ? List.btn[key] : List.btn;
	data.key = key;
	list.push(Tk.useTemplate(Button.template(),data,true));	//true important
}

Button.creation.optionList = function(key,option){
	if(SERVER){
		var player = List.all[key];
		option.x = player.mouseX;
		option.y = player.mouseY,
		option.client = option.client || 0;
		option.count = 2;
		List.main[key].optionList = option;
		List.main[key].flag.optionList = 1;
	}
	if(!SERVER){
		option = key;
		option.x = Input.mouse.x;
		option.y = Input.mouse.y;
		option.client = 1;
		option.count = 0;
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
		if(!Collision.ptRect({"x":x,'y':y},list[i].rect)) continue;
		
		var opt = list[i][side];
		if(opt.question){
			var tmp = {server:SERVER,func:opt.func,param:opt.param};
			if(opt.question === true){	tmp.text = 'Are you sure?';	tmp.option = ['yes','no'];} 
			else {	tmp.text = opt.question.text; tmp.option = opt.question.option;	}
			Chat.question(key,tmp);
			break;
		}
		
		if(SERVER) {
			Tk.applyFunc.key(key,opt.func,opt.param,List);
			if(opt.help) List.main[key].help = opt.help;
		} else {
			Tk.applyFunc(opt.func,opt.param);
			if(opt.help) Help.open(opt.help);
			if(opt.sfx) Sfx.play(opt.sfx);
		}
		return true;
		break;	//max 1 button per click
	}
	
}

Button.context = function (key){ 	//client only
	var list = List.btn;	
	var x = Input.mouse.x;
	var y = Input.mouse.y;
		
	for(var i = list.length-1 ; i >= 0  ; i--){
		if(Collision.ptRect({"x":x,'y':y},list[i].rect)){
			var tmp = {'text':list[i].text,'textTop':list[i].textTop};
			main.context = tmp; 
			return;
		}	
	}
	main.context = {'text':''};
}

Button.reset = function(key){	//called when player clicks. used to remove popup
	if(SERVER){	
		var m = List.main[key];
		
		if(m.optionList && --m.optionList.count < 0){
			m.optionList = null; 
			m.flag.optionList = 1;
		}
		
		if((m.popupList.equip || m.popupList.plan) && --m.popupList.count < 0){
			m.popupList.equip = null;
			m.popupList.plan = null;
			m.popupList.count = 0;
			m.flag.popupList = 1;
		}
		if(m.selectInv && --m.selectInv.count < 0) m.selectInv = '';
		
		
	}
	if(!SERVER){
		if(!main.optionList || !main.optionList.count || --main.optionList.count < 0){
			main.optionList = null;
		}
		main.popupList.equip = null;
		main.popupList.plan = null;
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
			
		var x = CST.WIDTH2 + act.x - player.x;
		var y = CST.HEIGHT2 + act.y - player.y;
		
		var info = {
			"rect":Collision.getHitBox({x:x,y:y,hitBox:act.hitBox}),
		};
		if(act.optionList && !act.combat){
			info['right'] = {'func':Button.creation.optionList,'param':act.optionList};
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
		var numX = CST.WIDTH2 + drop.x - List.actor[key].x;
		var numY = CST.HEIGHT2 + drop.y - List.actor[key].y;
		
		Button.creation(key,{
			"rect":[numX,numX+32,numY,numY+32],
			"left":{"func":Actor.click.drop,"param":['$actor',i]},
			'right':{'func':Actor.click.drop.rightClick,'param':['$actor',{x:drop.x,y:drop.y}]},
		});	
	}
}



