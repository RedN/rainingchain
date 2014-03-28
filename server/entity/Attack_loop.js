//Update Bullet
Bullet = {};

Bullet.remove = function(b){
	ActiveList.remove(b);
	
	delete List.bullet[b.id];
	delete List.all[b.id]
	if(List.map[b.map])	delete List.map[b.map].list[b.id];
}

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
	if((b.timer % b.nova.period) === 0){
		Combat.action.attack(b,useTemplate(Attack.template(),b.nova.attack));
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
	var axeX = b.parabole.dist*(b.timer/b.parabole.timer);
	
	var a = 1/b.parabole.dist/10 
			* b.parabole.height 
			* ((b.num%2)*2-1) 		//half are opposite
	
	var axeY = 	a * axeX * (axeX-b.parabole.dist);


	var	numX = (axeX*cos(b.crAngle) - axeY* sin(b.crAngle));
	var	numY = (axeX*sin(b.crAngle) + axeY* cos(b.crAngle));

	b.x = b.crX + numX;
	b.y = b.crY + numY;
	if(b.timer >= b.parabole.timer){ b.toRemove = 1; };
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
			b.angle += 180;
			b.boomerang.newId = 0;
		}
		
		if(List.actor[b.parent]){
			var diffX = b.x - List.actor[b.parent].x;
			var diffY = b.y - List.actor[b.parent].y;
		
			var diff = Math.sqrt(diffX*diffX + diffY *diffY);
			
			b.moveAngle = (atan2(diffY,diffX) + 360) % 360;
			
			b.x -= cos(b.moveAngle)*b.spd*b.boomerang.spdBack*spdBoost;
			b.y -= sin(b.moveAngle)*b.spd*b.boomerang.spdBack*spdBoost;
			
			if(diff <= 10*spdBoost*b.boomerang.spdBack){ b.toRemove = 1;}
		}
		
	}	
}		
		
Bullet.loop.collision = function(bullet){
	Collision.BulletActor(bullet); //collisions with living thing
	Collision.BulletMap(bullet); //collision with map
}

Bullet.mapMod = {};
Bullet.loop.mapMod = function(){
	Bullet.mapMod = {};
	for(var i in List.all){
		var b = List.all[i];
		if(!b || !b.block || !b.block.condition || b.block.condition !== 'true') continue;
		
		var size = b.block.size;
		var pos = Collision.getPos(b);
			
		for(var j = size[0]; j <= size[1]; j++){
			for(var k = size[2]; k <= size[3]; k++){
				Bullet.mapMod[b.map + '-' + (pos.x+j) + '-' + (pos.y+k)] = 1;
			}
		}
	}
}


//Update Strike

Strike = {};
Strike.loop = function(s){
	if(s.delay <= 0){
		if(s.onStrike && s.onStrike.chance >= Math.random()){	Combat.action.attack(s,useTemplate(Attack.template(),s.onStrike.attack));}
	
		Strike.loop.collision(s);
		
		if(s.delayAnim){ Anim.creation(s.delayAnim.name,{'x':s.crX + s.middleX,'y':s.crY + s.middleY,'map':s.map,'viewedIf':s.viewedIf},s.delayAnim.sizeMod);}
		s.toRemove = 1;
	}
	s.delay--;
	
	if(s.toRemove){	Strike.remove(s);}
}

//Collision Strike / Life 
Strike.loop.collision = function(atk){
	Collision.StrikeActor(atk);
}


Strike.remove = function(strike){
	ActiveList.remove(strike);
	
	delete List.strike[strike.id];
	delete List.all[strike.id]
}

