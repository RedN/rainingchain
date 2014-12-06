//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Input','OptionList','Message','Collision','Main','Drop','Actor'],['Button']));

if(SERVER) eval('var Button');

(function(){ //}

var WHITELIST = ['left','right','shiftLeft','shiftRight'];	//bad cuz global client

Button = exports.Button = function(type,id,preventAbility){
	return {
		type:type,
		id:id,
		preventAbility:preventAbility || false,	//value returned by Button.click
	};
}

Button.Click = function(func,param/*...*/,textIfParamArray){	//used on server side. actor.onclick.left is type Button.Click
	var tmp = [];
	for(var i = 1 ; i < arguments.length; i++) tmp.push(arguments[i]);
	var text = '';
	if(Array.isArray(param)) text = textIfParamArray || '';
	return OptionList.Option(func,tmp,text,'');
}

Button.executeOption = function(option,main,button){
	OptionList.executeOption(main,option);
}

Button.handClickServerSide = function(socket,d){ //d format: [type,id,side]
	socket.timer = 0;
	var player = Actor.get(socket.key);
	
	if(!player.activeList[d[1]]) return;	//not nearby or not exist
		
	if(d[0] === 'actor'){
		var act = Actor.get(d[1]);
		if(!act) return;	//possible if client cheat
		if(act.onclick && act.onclick[d[2]])
			Button.executeOption(act.onclick[d[2]],Main.get(socket.key));
	}
	if(d[0] === 'drop'){
		var act = Drop.get(d[1]);
		if(!act) return;	//possible if client cheat
		Actor.click.drop(player,d[1]);
	}
}

//CLIENT SIDE
if(SERVER) return;

Button.onclick = function(side){	//called when clicking
	Dialog.close('optionList');
	Dialog.close('equipPopup');
	
	if(Dialog.isMouseOverDialog()) return true;
	var btn = Button.getBtnUnderMouse();	
	if(!btn) return false;

	
	//send input to server...
	Socket.emit('click',[btn.type,btn.id,side]);
	if(btn.type === 'actor'){
		var act = Actor.get(btn.id);
		if(!act) return false;
		if(side === 'right' && act.optionList)
			Dialog.open('optionList',act.optionList);
	}
	
	return btn.preventAbility;
}




Button.getBtnUnderMouse = function(){	//server
	var btn = null;
	btn = Button.getBtnUnderMouse.drop(btn);
	btn = Button.getBtnUnderMouse.actor(btn);
	return btn;
}

Button.getBtnUnderMouse.actor = function(btn){
	for(var i in Actor.LIST){
		var act = Actor.LIST[i];
		if(!act || act.dead) continue;
		
		var vx = CST.WIDTH2 - player.x;
		var vy = CST.HEIGHT2 - player.y;
		
		if(Collision.testMouseRect(key,Collision.getHitBox(act,vx,vy))){
			btn = Button('actor',act.id,act.preventAbility);
		}
	}	
	return btn;	
}	
	
Button.getBtnUnderMouse.drop = function(btn){	//linked with Drop.drawAll for size 32
	for(var i in Drop.LIST){
		var drop = Drop.LIST[i];
		
		var vx = drop.x + CST.WIDTH2 - player.x;
		var vy = drop.y + CST.HEIGHT2 - player.y;
		
		if(Collision.testMouseRect(key,{x:vx,y:vy,width:32,height:32}))
			btn = Button('drop',drop.id,false);
	}
	return btn;	
}

})();
//################



