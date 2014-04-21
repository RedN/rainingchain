//Update Bullet
Bullet.loop = function(b){
	Bullet.loop.collision(b);
	Bullet.loop.move(b);
	
	if(b.nova){Bullet.loop.nova(b);}
	
	if(++b.timer >= b.maxTimer || b.toRemove){
		Bullet.remove(b);
	}
}

//A bullet that shoots other bullets/strikes
Bullet.loop.nova = function(b){
	b.angle += b.nova.rotation;
	if(b.timer % b.nova.period === 0){
		Combat.attack(b,Tk.useTemplate(Attack.template(),b.nova.attack));
	}

}

Bullet.loop.move = function(b){
	if(b.normal){Bullet.loop.move.normal(b);}
	else if(b.sin){Bullet.loop.move.sin(b);}
	else if(b.parabole){Bullet.loop.move.parabole(b);}
	else if(b.boomerang){Bullet.loop.move.boomerang(b);}	
}

Bullet.loop.move.normal = function(b){
	b.x += b.spd * Tk.cos(b.moveAngle);
	b.y += b.spd * Tk.sin(b.moveAngle);
}

Bullet.loop.move.sin = function(b){
	var axeX = b.timer;
	var axeY = ((b.num%2)*2-1) * b.sin.amp * Tk.sin(b.timer*b.sin.freq*25);
	var numX = b.spd *(axeX*Tk.cos(b.crAngle) - axeY * Tk.sin(b.crAngle));
	var numY = b.spd *(axeX*Tk.sin(b.crAngle) + axeY * Tk.cos(b.crAngle));

	b.x = b.crX + numX;
	b.y = b.crY + numY;
}

Bullet.loop.move.parabole = function(b){
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
		
Bullet.loop.move.boomerang = function(b){	
	var spdBoost = b.boomerang.spd*( Math.abs(b.timer - b.boomerang.comeBackTime/2)/b.boomerang.comeBackTime*2 )

	if(b.timer < b.boomerang.comeBackTime/2){
		b.x += b.spd * Tk.cos(b.moveAngle)*spdBoost;
		b.y += b.spd * Tk.sin(b.moveAngle)*spdBoost;
	}

	if(b.timer >= b.boomerang.comeBackTime/2){		//AKA come back
		if(!List.actor[b.parent]) return;
		spdBoost *= b.boomerang.spdBack;
		
		if(b.boomerang.newId){
			b.hitId = Math.random();
			b.angle += 180;
			b.boomerang.newId = 0;
		}
		
		var diffX = b.x - List.actor[b.parent].x;
		var diffY = b.y - List.actor[b.parent].y;
	
		var diff = Math.sqrt(diffX*diffX + diffY *diffY);
		
		b.moveAngle = (Tk.atan2(diffY,diffX) + 360) % 360;
		b.angle = b.moveAngle;
		
		b.x -= Tk.cos(b.moveAngle)*b.spd*spdBoost;
		b.y -= Tk.sin(b.moveAngle)*b.spd*spdBoost;
		
		if(diff <= 10*spdBoost*b.boomerang.spdBack){ b.toRemove = 1;}
		
	}	
}		
		
Bullet.loop.collision = function(b){
	Collision.BulletActor(b); 
	Collision.BulletMap(b);
}

Bullet.mapMod = {};	//all bullets share the same mapMod
Bullet.loop.mapMod = function(){
	Bullet.mapMod = {};
	for(var i in List.actor){
		var act = List.actor[i];
		if(!act || !act.block || !act.block.condition || act.block.condition !== 'true') continue;
		
		var size = act.block.size;
		var pos = Collision.getPos(act);
			
		for(var j = size[0]; j <= size[1]; j++){
			for(var k = size[2]; k <= size[3]; k++){
				Bullet.mapMod[act.map + '-' + (pos.x+j) + '-' + (pos.y+k)] = 1;
			}
		}
	}
}


//Update Strike

Strike = {};
Strike.loop = function(s){
	if(s.delay-- <= 0){
		if(s.onStrike && s.onStrike.chance >= Math.random()){	Combat.attack.simple(s,s.onStrike.attack);}
	
		Strike.loop.collision(s);
		
		if(s.postDelayAnim){ 
			Anim.creation({
				name:s.postDelayAnim.name,
				target:{'x':s.x,'y':s.y,'map':s.map,'viewedIf':s.viewedIf},	//cant put all cuz Tk.deepClone
				sizeMod:s.postDelayAnim.sizeMod
			});
		}
		s.toRemove = 1;
	}
	
	if(s.toRemove)	Strike.remove(s);
}

//Collision Strike / Life 
Strike.loop.collision = function(atk){
	Collision.StrikeActor(atk);
}


Strike.remove = function(strike){
	Activelist.remove(strike);
	
	delete List.strike[strike.id];
	delete List.all[strike.id]
}

