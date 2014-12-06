//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Map','Sprite','Combat','ActiveList','Actor','Attack','Collision'],['Bullet']));
if(SERVER) eval('var Bullet;');

(function(){ //}

Bullet = exports.Bullet = {};
var LIST = Bullet.LIST = {};	//Bullet.LIST only for debug

Bullet.remove = function(b){
	if(typeof b === 'string') b = LIST[b];
	Map.leave(b);
	Bullet.removeFromList(b.id);
	ActiveList.removeFromList(b.id);
}

Bullet.addToList = function(bullet){
	LIST[bullet.id] = bullet;
}

Bullet.removeFromList = function(id){
	delete LIST[id]; 
}

Bullet.doInitPack = function(obj){
	var draw = [
		'b',
		Math.round(obj.x),
		Math.round(obj.y),
		Math.round(obj.moveAngle),
		obj.sprite.name,
		obj.sprite.sizeMod,
	];
	if(obj.normal) draw.push(obj.spd);
	
	return draw;
}

Bullet.undoInitPack = function(obj,id){
	var b = {
		toRemove:0,
		id:id,
		x:obj[1],
		y:obj[2],
		serverX:obj[1],
		serverY:obj[2],
		angle:obj[3],
		sprite:Sprite(obj[4],obj[5]),
		spd:obj[6] || null,
		handleClientSide:!!obj[6],
		type:'bullet'
	}
	return b;
}

Bullet.setChangeAll = function(){
	for(var i in LIST)
		Bullet.setChange(LIST[i]);
}

Bullet.setChange = function(act){
	if(act.normal) return;
	var x = Math.floor(act.x);	if(act.old.x !== x) act.change.x = act.old.x = x; 
	var y = Math.floor(act.y);	if(act.old.y !== y) act.change.y = act.old.y = y;
	var angle = Math.floor(act.angle);	if(act.old.a !== angle) act.change.a = act.old.a = angle;
}

//##########################

Bullet.loop = function(){
	Bullet.loop.FRAME_COUNT++;
	for(var i in LIST)
		Bullet.loop.forEach(LIST[i]);
		
	if(Bullet.loop.FRAME_COUNT % 2 === 0)
		Bullet.setChangeAll();
}
Bullet.loop.FRAME_COUNT = 0;

Bullet.loop.forEach = function (b){
	Bullet.verifyCollision(b);
	Bullet.move(b);
	
	if(b.onMove) Bullet.onMove(b);
	if(++b.timer >= b.maxTimer || b.toRemove || !Actor.get(b.parent)){
		Bullet.remove(b);
	}
}

Bullet.onMove = function(b){ //A bullet that shoots other bullets/strikes
	b.angle += b.onMove.rotation;
	if(b.timer % b.onMove.period === 0){
		Combat.attack(b,b.onMove.attack);
	}
}

Bullet.move = function(b){
	if(b.normal) return Bullet.move.normal(b);
	if(b.sin) return Bullet.move.sin(b);
	if(b.parabole) Bullet.move.parabole(b);
	if(b.boomerang) Bullet.move.boomerang(b);
}

Bullet.move.normal = function(b){
	b.x += b.spd * Tk.cos(b.moveAngle);
	b.y += b.spd * Tk.sin(b.moveAngle);
}

Bullet.move.sin = function(b){
	var axeX = b.timer;
	var axeY = ((b.num%2)*2-1) * b.sin.amp * Tk.sin(b.timer*b.sin.freq*25);
	var numX = b.spd *(axeX*Tk.cos(b.crAngle) - axeY * Tk.sin(b.crAngle));
	var numY = b.spd *(axeX*Tk.sin(b.crAngle) + axeY * Tk.cos(b.crAngle));

	b.x = b.crX + numX;
	b.y = b.crY + numY;
}

Bullet.move.parabole = function(b){
	var axeX = b.parabole.dist*(b.timer/b.parabole.timer);
	
	var a = 1/b.parabole.dist/10 
			* b.parabole.height 
			* ((b.num%2)*2-1) 		//half are opposite
	
	var axeY = 	a * axeX * (axeX-b.parabole.dist);

	var	numX = (axeX*Tk.cos(b.crAngle) - axeY* Tk.sin(b.crAngle));
	var	numY = (axeX*Tk.sin(b.crAngle) + axeY* Tk.cos(b.crAngle));

	b.x = b.crX + numX;
	b.y = b.crY + numY;
	if(b.timer >= b.parabole.timer){ b.toRemove = 1; };
}
		
Bullet.move.boomerang = function(b){
	var timeSpdMod = Math.min(2,Math.abs(b.timer - b.boomerang.comeBackTime)/b.boomerang.comeBackTime);
	var spd = b.spd * b.boomerang.spd * timeSpdMod;
	
	if(b.timer < b.boomerang.comeBackTime){
		b.x += Tk.cos(b.moveAngle)*spd;
		b.y += Tk.sin(b.moveAngle)*spd;
	}
	
	if(b.timer >= b.boomerang.comeBackTime){		//AKA come back
		var parent = Actor.get(b.parent);
		if(!parent) return;
	
		spd *= b.boomerang.spdBack;
		
		if(!b.boomerang.comingBack){
			b.boomerang.comingBack = 1;
			b.ghost = 1;
			b.angle += 180;
			
			if(b.boomerang.newId){
				b.boomerang.newId = false;
				b.hitId = Math.random();
			}
		}
		
		var diffX = b.x - parent.x;
		var diffY = b.y - parent.y;
	
		var diff = Math.sqrt(diffX*diffX + diffY *diffY);
		
		b.moveAngle = (Tk.atan2(diffY,diffX) + 360) % 360;
		b.angle = b.moveAngle;
		
		b.x -= Tk.cos(b.moveAngle)*spd;
		b.y -= Tk.sin(b.moveAngle)*spd;
		
		if(diff <= spd*2) b.toRemove = 1;
	}	
}		
		
Bullet.verifyCollision = function(b){
	Collision.bulletActor(b); 
	Collision.bulletMap(b);
}





if(!SERVER){ //}
	Bullet.loop = function(){
		for(var i in LIST){
			var b = LIST[i];
			Sprite.updateAnim(b);
			if(b.sprite.dead) continue;
			if(b.handleClientSide){ 	//spd null if boomerang etc...
				b.x += Tk.cos(b.angle)*b.spd;
				b.y += Tk.sin(b.angle)*b.spd;	
			} else {
				b.x = (b.serverX + b.x)/2;
				b.y = (b.serverY + b.y)/2;
			}
		};
	}
		
	Bullet.drawAll = function(ctx){
		for(var i in LIST){
			Sprite.draw(ctx,LIST[i]);
		}
	}

}


})();
