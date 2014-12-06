//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Button','OptionList','Main'],['Input']));
var Input = exports.Input = {};


Input.key = function(socket,d){
	socket.timer = 0;
	var player = Actor.get(socket.key);
	if(player.useUpdateInput) return;
	if(d.i){
		//d.i format: right,down,left,up,ability0,ability1...
		var move = d.i.slice(0,4);
		player.moveInput.right = !!+move[0];
		player.moveInput.down = !!+move[1];
		player.moveInput.left = !!+move[2];
		player.moveInput.up = !!+move[3];
		player.abilityChange.press = d.i.slice(4);
		
		if(player.abilityChange.press !== '000000' && player.combat) Actor.ability.loop.clickVerify(player);
	}
	
	if(d.m){
		player.mouseX = Math.min(Math.max(d.m[0],0),CST.WIDTH);
		player.mouseY = Math.min(Math.max(d.m[1],0),CST.HEIGHT);
	}
	player.angle = Tk.atan2(player.mouseY - CST.HEIGHT/2,player.mouseX - CST.WIDTH/2);	
}
















