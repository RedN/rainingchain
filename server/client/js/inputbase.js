//### Start Customization###

var mouse = {x:0,y:0,drag:{active:0,sx:0,sy:0,vx:0,vy:0},left:0,right:0};

Input = {};

Input.init = function(setup){
	if(setup === 0){
		//first works only when not writing message
		//rest works all the time (dont use letters in rest)
		Input.key = {};
		Input.key.combo = [
			{'key':16,'boost':1000,'symbol':'s'},	//shift
			{'key':17,'boost':10000,'symbol':'c'}	//ctrl
		];
		
		Input.key.move = [
			[68,102], //d - right
			[83,98], //s - down
			[65,100], //a - left
			[87,104]  //w - up
		];
	
		Input.key.ability = [
			[1,101],	//left click + num5
			[3,96],		//right click + num+
			[1001],		//(left click+shift)
			[1003],		//(right click+shift)
			[70],		//f			//need to be healing
			[32],		//space		//need to be dodge
		];
		
		Input.key.custom = [
			{'keyCode':[9],'func':(function(){ Chat.send.message.reply(); })},
			{'keyCode':[27],'func':(function(){ addInput('',false); })},
			{'keyCode':[38],'func':(function(){ document.getElementById('gameDiv').scrollIntoView(true); })},
		];
		
	}
	
	
	
	Input.press = {'move':[0,0,0,0],'ability':[],'combo':[]}; 
	for(var i in Input.key.ability){ Input.press.ability.push(0);}
	for(var i in Input.key.combo){ Input.press.combo.push(0);}
}
Input.init(0);
//a	 65$$$b	 66$$$c	 67$$$d	 68$$$e	 69$$$f	 70$$$g	 71$$$h	 72$$$i	 73$$$j	 74$$$k	 75$$$l	 76$$$m	 77$$$n	 78$$$o	 79$$$p	 80$$$q	 81$$$r	 82$$$s	 83$$$t	 84$$$u	 85$$$v	 86$$$w	 87$$$x	 88$$$y	 89$$$z	 90$$$$$$backspace	 8$$$tab	 9$$$enter	 13$$$shift	 16$$$ctrl	 17$$$alt	 18$$$pause/break	 19$$$caps lock	 20$$$escape	 27$$$page up	 33$$$page down	 34$$$end	 35$$$home	 36$$$left arrow	 37$$$up arrow	 38$$$right arrow	 39$$$down arrow	 40$$$insert	 45$$$delete	 46$$$0	 48$$$1	 49$$$2	 50$$$3	 51$$$4	 52$$$5	 53$$$6	 54$$$7	 55$$$8	 56$$$9	 57$$$left window key	 91$$$right window key	 92$$$select key	 93$$$numpad 0	 96$$$numpad 1	 97$$$numpad 2	 98$$$numpad 3	 99$$$numpad 4	 100$$$numpad 5	 101$$$numpad 6	 102$$$numpad 7	 103$$$numpad 8	 104$$$numpad 9	 105$$$multiply	 106$$$add	 107$$$subtract	 109$$$decimal point	 110$$$divide	 111$$$f1	 112$$$f2	 113$$$f3	 114$$$f4	 115$$$f5	 116$$$f6	 117$$$f7	 118$$$f8	 119$$$f9	 120$$$f10	 121$$$f11	 122$$$f12	 123$$$num lock	 144$$$scroll lock	 145$$$semi-colon	 186$$$equal sign	 187$$$comma	 188$$$dash	 189$$$period	 190$$$forward slash	 191$$$grave accent	 192$$$open bracket	 219$$$back slash	 220$$$close braket	 221$$$single quote	 222$$$


//### End Customization###

Input.event = {}
Input.event.key = function(code,dir,event){
	var start = +$("#chatBoxInput").is(":focus");
	var num = dir === 'down' ? 1 : 0;
	
	
	for(var i in Input.key.move){
		for(var j = start ; j < Input.key.move[i].length; j++){
			if(code === Input.key.move[i][j]){
				Input.press.move[i] = num;
				if(gameStarted) event.preventDefault();
			}
		}
	}
	
	for(var i in Input.key.combo){
		if(code === Input.key.combo[i].key){
			Input.press.combo[i] = num;
			//for(var j in abilityInput){ input.ability[j] = 0; }	//was if up
		}
	}
	code += Input.event.combo();
	
	if(dir === 'down'){
		for(var i in Input.key.custom){
			for(var j = start ; j < Input.key.custom[i].keyCode.length; j++){
				if(code === Input.key.custom[i].keyCode[j]){
					Input.key.custom[i].func();
					if(gameStarted) event.preventDefault();
				}
			}
		}
	}
	
	for(var i in Input.key.ability){
		for(var j = start ; j < Input.key.ability[i].length; j++){
			if(code == Input.key.ability[i][j]){
				Input.press.ability[i] = num;
				if(gameStarted) event.preventDefault();
			}
		}
	}
}

Input.event.combo = function(){
	var sum = 0;
	for(var i in Input.key.combo){
		if(Input.press.combo[i]){
			sum += Input.key.combo[i].boost;
		}
	}
	return sum;
}

Input.event.mouse = {};
Input.event.mouse.click = function(code,dir){
	var start = +$("#chatBoxInput").is(":focus");
	var num = dir === 'down' ? 1 : 0;
	if(code === 1) mouse.left = num; 
	if(code === 3) mouse.right = num; 
	code += Input.event.combo();
	
	//Update Input
	for(var i in Input.key.ability){
		for(var j = start ; j < Input.key.ability[i].length; j++){
			if(code === Input.key.ability[i][j]){
				Input.press.ability[i] = num;
				if(gameStarted) event.preventDefault();
			}
		}
	}
	
	//Emit Mouse Click
	if(dir === 'down'){
		var side = 'left';
		switch(code){
			case 1: side = 'left'; break;
			case 3: side = 'right'; break;
			case 1001: side = 'shiftLeft'; break;
			case 1003: side = 'shiftRight'; break;
			case 10001: side = 'ctrlLeft'; break;
			case 10003: side = 'ctrlRight'; break;
		}
		
		socket.emit('click', [side,mouse.x,mouse.y]);
		Button.reset();
		Button.test(0,mouse.x,mouse.y,side);
	}
}

Input.event.mouse.wheel = function(side){
	if(windowList.passive){
		Draw.window.passive.grid.info.size += 3*side;
	}
}

Input.event.mouse.move = function (evt){
	mouse.x = evt.x;
	mouse.y = evt.y;
}

Input.event.mouse.drag = function(){
	mouse.drag.active = 1;
	mouse.drag.sx = mouse.x;
	mouse.drag.sy = mouse.y;
	mouse.drag.vx = 0;
	mouse.drag.vy = 0;
	//mouse.left = 1;
}

Input.event.mouse.drag.update  = function(){
	if(mouse.drag.active && mouse.left){
		mouse.drag.vx = mouse.x - mouse.drag.sx; 
		mouse.drag.vy = mouse.y - mouse.drag.sy; 
		mouse.drag.sx = mouse.x;
		mouse.drag.sy = mouse.y;
	} else {
		mouse.drag.active = 0;
		mouse.drag.vx = 0;
		mouse.drag.vy = 0;
	}
}	



//Mouse Down/Up || Key Down/Up
$(document).mousedown(function(event) { Input.event.mouse.click(event.which,'down',event);});
$(document).mouseup(function(event) {Input.event.mouse.click(event.which,'up',event);});
document.onmousewheel = function(event){Input.event.mouse.wheel(event.wheelDeltaY > 0 ? 1 : -1);}
document.addEventListener('keydown', function(event) {	Input.event.key(event.keyCode,'down',event);});
document.addEventListener('keyup', function(event) {Input.event.key(event.keyCode,'up',event);});
document.activeElement.addEventListener("mousemove", Input.event.mouse.move);

$(document).bind('contextmenu', function(e){return false;});	//Disable Right Click Context Menu and Lose Focus
$(window).keydown(function(e) { if(e.ctrlKey) { e.preventDefault();}});	//Disable Ctrl Shortcut

//Send
Input.send = function(){
	if($("#chatBoxInput").is(":focus") && Input.press.move.toString() !== "0,0,0,0"){ 
		mouse.x = WIDTH2 + 10*input.move[0] - 10*Input.press.move[2];
		mouse.y = HEIGHT2 + 10*input.move[1] - 10*Input.press.move[3];		
	}

	var d = {};
	var newKey = Input.press.move.join('') + Input.press.ability.join('');
	var newMouse = [Math.round(mouse.x),Math.round(mouse.y)];

	if(Input.send.old.key !== newKey){ d.i = newKey; }
	if(Input.send.old.mouse.toString() !== newMouse.toString()){ d.m = newMouse; }
	
	if(d.i || d.m){ socket.emit("input", d ); }
	
	Input.send.old.key = newKey;
	Input.send.old.mouse = newMouse;
}
	
Input.send.old = {'key':'','mouse':[0,0]};



	