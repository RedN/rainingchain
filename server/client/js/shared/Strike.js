//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['ActiveList','Combat','Collision','Anim'],['Strike']));
if(SERVER) eval('var Strike;');

(function(){ //}

Strike = exports.Strike = {};
var LIST = Strike.LIST = {};

Strike.remove = function(strike){
	if(typeof strike === 'string') strike = LIST[strike];
	ActiveList.clear(strike);
	
	delete LIST[strike.id];
	ActiveList.removeFromList(strike.id);
}

Strike.doInitPack = function(obj){
	var p = obj.point;
	var r = Math.round;
	
	return [
		's',
		obj.delay,
		r(p[0].x),r(p[0].y),
		r(p[2].x),r(p[2].y),
		r(p[8].x),r(p[8].y),
		r(p[6].x),r(p[6].y),
	];
}

Strike.undoInitPack = function(obj,id){
	var st = {
		type:'strike',
		id:id,
		toRemove:0,
		delay:obj[1],
		point:[
			{x:obj[2],y:obj[3]},
			{x:obj[4],y:obj[5]},
			{x:obj[6],y:obj[7]},
			{x:obj[8],y:obj[9]},
		],	
	}
	return st;
}

Strike.addToList = function(bullet){
	LIST[bullet.id] = bullet;
}

Strike.removeFromList = function(id){
	delete LIST[id]; 
}

Strike.drawAll = function(ctx){	//unused cuz no longer send strike info to client
	if(!Main.getPref(main,'displayAoE')) return;
	
	ctx.fillStyle = 'red';
	for(var i in LIST){
		var s = LIST[i];
		var p = s.point;
		
		var x = CST.WIDTH2 - player.x;
		var y = CST.HEIGHT2 - player.y;
		
		
		ctx.globalAlpha = Math.min(0.5,1/Math.abs(s.delay));
		
		ctx.beginPath();
		ctx.moveTo(x+p[0].x,y+p[0].y);
		ctx.lineTo(x+p[1].x,y+p[1].y);
		ctx.lineTo(x+p[2].x,y+p[2].y);
		ctx.lineTo(x+p[3].x,y+p[3].y);
		ctx.lineTo(x+p[0].x,y+p[0].y);
		ctx.closePath();
		ctx.fill();
		
		if(--s.delay < -4) ActiveList.removeAny(s);
	}
	ctx.fillStyle = 'black';
	ctx.globalAlpha = 1;	
}

})();


