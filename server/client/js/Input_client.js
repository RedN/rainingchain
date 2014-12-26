//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
//a 65,b 66,c 67,d 68,e 69,f 70,g 71,h 72,i 73,j 74,k 75,l 76,m 77,n 78,o 79,p 80,q 81,r 82,s 83,t 84,u 85,v 86,w 87,x 88,y 89,z 90,,backspace 8,tab 9,enter 13,shift 16,ctrl 17,alt 18,pause/break 19,caps lock 20,escape 27,page up 33,page down 34,end 35,home 36,left arrow 37,up arrow 38,right arrow 39,down arrow 40,insert 45,delete 46,0 48,1 49,2 50,3 51,4 52,5 53,6 54,7 55,8 56,9 57,left window key 91,right window key 92,select key 93,numpad 0 96,numpad 1 97,numpad 2 98,numpad 3 99,numpad 4 100,numpad 5 101,numpad 6 102,numpad 7 103,numpad 8 104,numpad 9 105,multiply 106,add 107,subtract 109,decimal point 110,divide 111,f1 112,f2 113,f3 114,f4 115,f5 116,f6 117,f7 118,f8 119,f9 120,f10 121,f11 122,f12 123,num lock 144,scroll lock 145,semi-colon 186,equal sign 187,comma 188,dash 189,period 190,forward slash 191,grave accent 192,open bracket 219,back slash 220,close braket 221,single quote 222,
(function(){ //}
var SHIFTKEY = 1000;

//################
//Setting
Input = exports.Input = {
	setting:null,
	state:null,
	binding:{move:null,ability:null},
};

Input.Setting = function(move,ability,custom){
	return {
		move:move,
		ability:ability,
		custom:custom		
	}
}

Input.Setting.move = function(right,down,left,up){
	return [right,down,left,up];
}
Input.Setting.ability = function(a,b,c,d,e,f){
	return [a,b,c,d,e,f];
}
Input.Setting.custom = function(keyCode,func){
	return {
		keyCode:keyCode,
		func:func	
	}
}

Input.changeSetting = function(move,ability,custom){
	custom = custom || [
		Input.Setting.custom(9,function(event){ 	//tab
			Message.reply();
			return false;
		}),
		Input.Setting.custom(13,function(event){ 	//enter
			if(Input.hasFocusOnInput()) return true;

			if(!Dialog.chat.isInputActive()){
				Dialog.chat.focusInput();
			}
			return false;
		}),
		Input.Setting.custom(27,function(event){ 	//esc
			Dialog.closeAll();
			
			if(Dialog.chat.isInputActive('')){
				Dialog.chat.blurInput();
			}
			
			Dialog.chat.setInput('',false); 
			
			$(".ui-tooltip-content").parents('div').remove();
			return false;
		}),
	];
	Input.setting = Input.Setting(move,ability,custom);
	Input.reset();
}
	
Input.usePreset = function(preset){
	preset = preset || 'qwerty';
	if(preset === 'qwerty')
		Input.changeSetting(
			Input.Setting.move(68,83,65,87),	//d s a w
			Input.Setting.ability(1,3,SHIFTKEY+1,SHIFTKEY+3,70,32) //clk left, clk right, click left sshift, click right shift, f, space
		);
	if(preset === 'azerty')
		Input.changeSetting(
			Input.Setting.move(68,83,81,90),	//d s q z
			Input.Setting.ability(1,3,SHIFTKEY+1,SHIFTKEY+3,70,32) //clk left, clk right, click left sshift, click right shift, f, space
		);
	if(preset === 'number')
		Input.changeSetting(
			Input.Setting.move(68,83,65,87),	//d s a w
			Input.Setting.ability(1,49,50,51,52,53) //clk left, 1,2,3,4,5
		);
}

Input.saveSetting = function(){
	localStorage.setItem('bindingMove',JSON.stringify(Input.setting.move));
	localStorage.setItem('bindingAbility',JSON.stringify(Input.setting.ability));
}
Input.loadSetting = function(){
	var move = JSON.parse(localStorage.getItem('bindingMove'));
	var ability = JSON.parse(localStorage.getItem('bindingAbility'));
		
	//integrity test
	if(!move || !ability) return Input.usePreset();
	if(typeof move !== 'object' || typeof move[0] !== 'number') return Input.usePreset();
	if(typeof ability !== 'object' || typeof ability[0] !== 'number') return Input.usePreset();
	Input.changeSetting(move,ability);
}

Input.getKeyName = function(what,position,full){
	if(!Input.setting) return;
	var keycode = Input.setting[what][position];
	return keycode.toString().keyCodeToName(full);	
}

//################
//State
Input.State = function(){
	return {
		move:[0,0,0,0],	//right,down,left,up
		ability:[0,0,0,0,0,0],
		mouseX:0,
		mouseY:0,
	}
}

Input.reset = function(){
	Input.state = Input.State();
}

Input.offset = {left:0,top:0};	//updated in loop

Input.isPressed = function(what,position){
	return !!Input.state[what][position];
}	

Input.getMouse = function(){
	return {
		x:Input.state.mouseX,
		y:Input.state.mouseY,
	}
}

//################
//Event
Input.init = function(){
	Input.loadSetting();
	
	window.onblur = function(){
		Input.reset();
	}
	//EVENT
	$(document).mousedown(function(event) { 
		return Input.onclick(event.which,'down',event);  
	});
	$(document).mouseup(function(event) { 
		return Input.onclick(event.which,'up',event); 
	});
	$(document).bind('mousewheel',function(event){ 
		Input.onwheel(event.wheelDeltaY > 0 ? 1 : -1);
	});
	$(document).mousemove(function(event){ 
		Input.onmove(event);
	});
	
	window.onscroll = function(){ 
		if(Input.getMouse().y < CST.HEIGHT) 
		window.scrollTo(0, 0); 
	};
	$(document).keydown(function(event) {	
		Input.onkeydown(event.keyCode,'down',event);
	});
	$(document).keyup(function(event) { 
		Input.onkeydown(event.keyCode,'up',event);
	});
	$(document).bind('contextmenu', function(e){	//Disable Right Click Context Menu and Lose Focus
		return false;
	});	
	
	//prevent firefox context box on shift right
	/*
	document.onclick = document.dblclick = function(event){	
		if(!event.shiftKey) return;
		event.preventDefault(); 
		event.stopPropagation();
		return false;
	}
	*/
	/* window.onbeforeunload = function(){	//on close browser
		return 'Note: Ctrl + W closes the window.';
	}*/
}

Input.hasFocusOnInput = function(){
	var str = document.activeElement.constructor.toString();
	return str.contains('HTMLInputElement') || str.contains('HTMLTextAreaElement');
}

Input.onkeydown = function(code,dir,event){
	var num = dir === 'down' ? 1 : 0;
	if(dir === 'down'){
		for(var i in Input.setting.custom){
			if(code === Input.setting.custom[i].keyCode){
				if(!Input.setting.custom[i].func(event))
					event.preventDefault();
			}
		}
	}
	
	if(Input.hasFocusOnInput()) return false;
	
	for(var i = 0; i < Input.setting.move.length; i++){
		if(code === Input.setting.move[i]){
			Input.state.move[i] = num;
		}
	}
	
	if(event.shiftKey) code += SHIFTKEY;
	
	for(var i in Input.setting.ability){
		if(code === Input.setting.ability[i]){
			Input.state.ability[i] = num;
			event.preventDefault();
		}
		//quick fix for shiftkey
		if(Input.setting.ability[i] >= SHIFTKEY && code < SHIFTKEY)
			Input.state.ability[i] = 0;
		if(Input.setting.ability[i] < SHIFTKEY && code >= SHIFTKEY)
			Input.state.ability[i] = 0;
	}
	// if (e.ctrlKey)
	if(Input.binding.move !== null){ 
		Input.setting.move[Input.binding.move] = code; 
		Input.binding.move = null;
		Input.saveSetting();		
	}
	if(Input.binding.ability !== null){ 
		Input.setting.ability[Input.binding.ability] = code; 
		Input.binding.ability = null;
		Input.saveSetting(); 
	}
	
	
	return false;
}

Input.onclick = function(code,dir,event){	
	if(Date.now() - Input.onclick.LAST < 50) return;
	Input.onclick.LAST = Date.now();
	
	
	var num = dir === 'down' ? 1 : 0;
	if(event.shiftKey) code += SHIFTKEY;
	
	//Binding
	if(Input.binding.ability !== null){
		Input.setting.ability[Input.binding.ability] = code;
		Input.binding.ability = null;
		Input.saveSetting();
	}
	
	//Emit Mouse Click
	if(dir === 'down'){
		if(code === 1) var side = 'left';
		if(code === 3) var side = 'right';
		if(code === SHIFTKEY + 1) var side = 'shiftLeft';
		if(code === SHIFTKEY + 3) var side = 'shiftRight';
		
		//call button function, if returns true prevent use ability when clicking on non-combat actor
		if(Button.onclick(side))	
			return;		
	}
	
	//Update Input
	for(var i in Input.setting.ability){
		if(code === Input.setting.ability[i]){
			Input.state.ability[i] = num;
		}
		//quick fix for shiftkey
		if(Input.setting.ability[i] >= SHIFTKEY && code < SHIFTKEY)
			Input.state.ability[i] = 0;
		if(Input.setting.ability[i] < SHIFTKEY && code >= SHIFTKEY)
			Input.state.ability[i] = 0;
	}
	
}
Input.onclick.LAST = Date.now();

Input.onwheel = function(side){

}

Input.onmove = function (evt){
	var off = $('#gameDiv').offset();
	Input.state.mouseX = evt.clientX - (off.left - window.pageXOffset);
	Input.state.mouseY = evt.clientY - (off.top - window.pageYOffset);
	Input.onmove.COUNT++;
}
Input.onmove.COUNT = 0;

//Send
Input.loop = function(){
	if(Input.hasFocusOnInput()) Input.reset();	
	
	Input.controller.loop();
	
	var d = {};
	var newKey = Input.state.move.join('') + Input.state.ability.join('');
	var mouse = Input.getMouse();
	var newMouse = [Math.round(mouse.x),Math.round(mouse.y)];

	if(Input.loop.OLD.key !== newKey) 
		d.i = newKey;
	if(Input.loop.OLD.mouse.toString() !== newMouse.toString())
		d.m = newMouse;
	
	if(d.i || d.m)
		Socket.emit("input", d );
	
	Input.loop.OLD.key = newKey;
	Input.loop.OLD.mouse = newMouse;
}
	
Input.loop.OLD = {key:'',mouse:[0,0]};



//##############
/*
0:a,1:b,2:x,3:y,4:lb,5:rb,
6:lt,7:rt,8:back,9:start,10:lJoy,
11:rJoy,12:padUp,13:padDown,14:padLeft,15:padRight,

axe:
0:left horizontal (-1 = left) - 1:left vertical (-1 = up)
2:right horizontal (-1 = left) - 3:right vertical (-1 = up)
*/

Input.controller = {};
Input.controller.loop = function(){	//TOFIX bad name
	return;
	/*
	if(!navigator.getGamepads) return;
	var list = navigator.getGamepads();
	var con = list[0] || list[1] || list[2] || list[3];
	if(!con || !Main.getPref(main,'controller')) return;
	var but = con.buttons;
	if(!but[0]) return;	//not loaded properly
	var axe = con.axes;
	
	var p = Input.state;
	
	p.ability[4] = +but[4].pressed;	//lb, heal
	p.ability[5] = +but[10].pressed; //lJoy, dodge
	p.combo[0] = +but[6].pressed;	//BAD TO FIX
	
	p.move[0] = +(axe[0] > 0.4);
	p.move[2] = +(axe[0] < -0.4);
	p.move[1] = +(axe[1] > 0.4);
	p.move[3] = +(axe[1] < -0.4);
	*/
}

})();