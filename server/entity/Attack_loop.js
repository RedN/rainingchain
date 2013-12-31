//Update Bullet
Bullet = {};

Bullet.remove = function(b){
	ActiveList.remove(b);
	
	delete List.bullet[b.id];
	delete List.all[b.id]
}

Bullet.loop = function(b){
	Bullet.loop.collision(b);
	Bullet.loop.move(b);
	
	if(b.nova){Bullet.loop.Nova(b);}
	
	if(++b.timer >= b.maxTimer || b.toRemove){
		Bullet.remove(b);
	}
}

//A bullet that shoots other bullets/strikes
Bullet.loop.nova = function(b){
	b.angle += b.nova.rotation;
	if((b.timer % b.nova.period) === 0){
		Combat.action.attack.perform(b,b.nova.attack);
	}

}

Bullet.loop.move = function(b){
	if(b.normal){Bullet.loop.move.normal(b);}
	else if(b.sin){Bullet.loop.move.sin(b);}
	else if(b.parabole){Bullet.loop.move.parabole(b);}
	else if(b.boomerang){Bullet.loop.move.boomerang(b);}	
}

Bullet.loop.move.normal = function(b){
	b.x += b.spd * cos(b.moveAngle);
	b.y += b.spd * sin(b.moveAngle);
}

Bullet.loop.move.sin = function(b){
	var axeX = b.timer;
	var axeY = ((b.num%2)*2-1) * b.sin.amp * sin(b.timer*b.sin.freq*25);
	var numX = b.spd		*(axeX*cos(b.crAngle) - axeY * sin(b.crAngle));
	var numY = b.spd		*(axeX*sin(b.crAngle) + axeY * cos(b.crAngle));

	b.x = b.crX + numX;
	b.y = b.crY + numY;
}

Bullet.loop.move.parabole = function(b){
	var axeX = (b.parabole.dist/b.parabole.maxTimer*b.timer);
	var axeY = 1/b.parabole.dist/10 
				* b.parabole.height 
				* ((b.num%2)*2-1) * Math.floor(b.num/2)*2/b.maxNum
				* (b.parabole.dist/b.parabole.maxTimer*b.timer)
				*((b.parabole.dist/b.parabole.maxTimer*b.timer)
				-b.parabole.dist);

	var	numX = (axeX*cos(b.crAngle) - axeY* sin(b.crAngle));
	var	numY = (axeX*sin(b.crAngle) + axeY* cos(b.crAngle));

	b.x = b.crX + numX;
	b.y = b.crY + numY;
	if(b.timer >= b.parabole.maxTimer){ b.toRemove = 1; };
}
		
Bullet.loop.move.boomerang = function(b){	
	var spdBoost = b.boomerang.spd*( Math.abs(b.timer - b.boomerang.comeBackTime/2)/b.boomerang.comeBackTime*2 )

	if(b.timer < b.boomerang.comeBackTime/2){
		b.x += b.spd * cos(b.moveAngle)*spdBoost;
		b.y += b.spd * sin(b.moveAngle)*spdBoost;
	}

	if(b.timer >= b.boomerang.comeBackTime/2){		//AKA come back

		if(b.boomerang.newId){
			b.hitId = Math.random();
			b.boomerang.newId = 0;
		}
		
		if(List.mortal[b.parent]){
			var diffX = b.x - List.mortal[b.parent].x;
			var diffY = b.y - List.mortal[b.parent].y;
		
			var diff = Math.sqrt(diffX*diffX + diffY *diffY);
			
			b.moveAngle = (atan2(diffY,diffX) + 360) % 360;
			
			b.x -= cos(b.moveAngle)*b.spd*b.boomerang.spdBack*spdBoost;
			b.y -= sin(b.moveAngle)*b.spd*b.boomerang.spdBack*spdBoost;
			
			if(diff <= 10*spdBoost*b.boomerang.spdBack){ b.toRemove = 1;}
		}
		
	}	
}		
		
Bullet.loop.collision = function(bullet){
	Collision.BulletMortal(bullet); //collisions with living thing
	Collision.BulletMap(bullet); //collision with map
}




//Update Strike

Strike = {};
Strike.loop = function(s){
	if(s.delay <= 0){
		Strike.loop.collision(s);
		s.toRemove = 1;
	}
	s.delay--;
	
	if(s.toRemove){	Strike.remove(s);}
}

//Collision Strike / Life 
Strike.loop.collision = function(atk){
	Collision.StrikeMortal(atk);
}


Strike.remove = function(strike){
	ActiveList.remove(strike);
	
	delete List.strike[strike.id];
	delete List.all[strike.id]
}

