//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Actor','Tk','Button'],['Input']));
var Input = exports.Input = {};
Input.click = function(socket,d){
	//data format: [side,x,y]
	socket.timer = 0;
	var key = socket.key;
	d[1] = d[1].mm(0,CST.WIDTH);
	d[2] = d[2].mm(0,CST.HEIGHT);
	
	if(!d[3]) Button.test(key,d[1],d[2],d[0]);	//d[3] is 1 if a window is opened
	Button.reset(key);
}

Input.key = function(socket,d){
	socket.timer = 0;
	var player = List.all[socket.key];
	
	if(d.i){
		//d.i format: right,down,left,up,ability0,ability1...
		var move = d.i.slice(0,4);
		for(var i = 0 ; i < 4 ; i++){player.moveInput[i] = +move[i];}
		player.abilityChange.press = d.i.slice(4);
		
		if(player.abilityChange.press !== '000000' && player.combat) Actor.loop.ability.test(player);
	}
	
	if(d.m){
		player.mouseX = Math.min(Math.max(d.m[0],0),CST.WIDTH);
		player.mouseY = Math.min(Math.max(d.m[1],0),CST.HEIGHT);
	}
	player.angle = Tk.atan2(player.mouseY - CST.HEIGHT/2,player.mouseX - CST.WIDTH/2);	
}
















