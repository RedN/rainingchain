Attack = {};

Attack.template = function(){
	var b = {};
	//NO TOUCH
	b.change = {};
	b.old = {};
	b.viewedBy = {};
	b.viewedIf = 'true';
	b.x = 0;
	b.y = 0;
	b.angle = 0;
	b.crX = 0;  //creation X
	b.crY = 0;  //creation Y
	b.map = 'test@MAIN';
	b.toRemove = 0;
	b.id = Math.randomId();
	b.publicId = Math.randomId(6);
	b.hitId = Math.randomId();
	b.type = 'bullet';				//or strike
	//NO TOUCH
	
	
	//All
	b.dmg = {main:1,ratio:Cst.element.template(1)};
	b.globalDmg = 1;	//for nova
	
	b.objImg = 0;	//for bullet: sprite when travelling {name,anim,sizeMod} || for strike: anim when performing {name,sizeMod}
	b.hitImg = 0;	//when enemy get hits, use anim on him {name,sizeMod}
	
	
	b.hitIfMod = 0; //if 1, hit allies
	b.num = 0;		//# bullet if many shoot at once
	b.amount = 1;	//# bullets shot (useless here tho)
	b.aim = 0;
	
	b.bleed = {'baseChance':0,'chance':1,'magn':1,'time':1};	//act as modifier
	b.knock = {'baseChance':0,'chance':1,'magn':1,'time':1};
	b.drain = {'baseChance':0,'chance':1,'magn':1,'time':1};	
	b.burn = {'baseChance':0,'chance':1,'magn':1,'time':1};
	b.chill = {'baseChance':0,'chance':1,'magn':1,'time':1};
	b.stun = {'baseChance':0,'chance':1,'magn':1,'time':1};
	b.crit = {'baseChance':0,'chance':1,'magn':1};
	b.leech = {'baseChance':0,'chance':1,'magn':1,'time':1};	
	b.pierce = {'baseChance':0,'chance':0,'dmgReduc':0.5};		//will be overwrite completly
	b.curse = 0;
	b.onHit = 0;
	
	//Strike
	b.width = 10;      			 //width for strike
	b.height = 10;       		//height for strike
	b.delay = 0;   				 //delay between cast and dmg phase for strike
	b.point = [{'x':10,'y':10}];	//used for collision
	b.minRange = 5;				//min distance player-strike
	b.maxRange = 50;			//max distance player-strike
	b.onStrike = 0;				//call another attack when strike goes live
	
	//Bullet
	b.maxTimer = 40;
	b.timer = 0;
	b.spd = 15;
	
	b.normal = 0;	//get set inside creation
	b.nova = 0;
	b.boomerang = 0;
	b.ghost = 0;
	b.parabole = 0;
	b.sin = 0;
	b.moveAngle = 0;	//where bullet moves (not facing necesrraly)
	b.mouseX = 0;	//strike and parabole
	b.mouseY = 0;
	b.sprite = {"name":"fireball","anim":"travel",'sizeMod':1};	
	
	
	return b;
}; 


Attack.creation = function(player,attack,extra){
	if(player.xym){ player.x = player.xym.x; player.y = player.xym.y; player.map = player.xym.map; delete player.xym;}
	
	var s = attack;
	s = Attack.creation.info(player,s);
	
	s.id = Math.randomId();
	s.publicId = Math.randomId();
	s.hitId = Math.randomId();
	
	attack = useTemplate(attack,extra); //need here so angle isnt always player angle
	s.angle = (s.angle%360+360)%360
	s.crAngle = s.angle; s.moveAngle = s.angle;

	List.all[s.id] = s;
	Activelist.add(s);
	
	if(attack.type === 'strike'){ return Attack.creation.strike(attack);}
	if(attack.type === 'bullet'){ return Attack.creation.bullet(attack);}
}; 

Attack.creation.info = function(player,bullet){
	bullet.x = player.x || 0;
	bullet.y = player.y || 0;
	bullet.crX = bullet.x;
	bullet.crY = bullet.y;
	bullet.mouseX = player.mouseX || 0;
	bullet.mouseY = player.mouseY || 0;
	
	bullet.map = player.map || 'test@MAIN';	
	bullet.viewedIf = player.viewedIf || 'true';
	bullet.hitIf = player.hitIf || 'player';
	
	bullet.angle = (player.angle || 0 +360)%360;
	
	if(bullet.nova || bullet.onHit || bullet.onStrike){
		bullet.bonus = player.bonus || Actor.template.bonus();
		bullet.weapon = player.weapon || Actor.template.weapon();
		bullet.mastery = player.mastery || Actor.template.mastery();		
	}
	
	bullet.parent = player.parent || player.id || null;
	
	return bullet;
}; 



Attack.creation.bullet = function(b){
	if(b.parabole){
		var diffX = b.mouseX - Cst.WIDTH2;	var diffY = b.mouseY - Cst.HEIGHT2;
		var diff = Math.sqrt(diffX*diffX+diffY*diffY);
		b.parabole.dist = diff.mm(b.parabole.min,b.parabole.max);
		b.parabole.timer *= b.parabole.dist/b.parabole.max;
	}
	if(b.nova){ b.angle = Math.random()*360;}	//otherwise, circle always the same. moveAngle is same tho
	
	if(!b.sin && !b.parabole && !b.boomerang) { b.normal = 1; }
	
	Sprite.creation(b,{'name':b.objImg.name,'anim':"travel",'sizeMod':b.objImg.sizeMod});
	
	List.bullet[b.id] = b;
	Map.enter(b);
	
	return b;
}; 


//need to remove player.bonus to pre-atk
Attack.creation.strike = function(s){
			
	//Position
	var dist = Math.pyt( s.mouseX-Cst.WIDTH2, s.mouseY-Cst.HEIGHT2);
	var angle = s.angle;
	
	if(s.middleX === undefined){ s.middleX = dist * cos(angle); }
	if(s.middleY === undefined){ s.middleY = dist * sin(angle); }
	
	if(dist > s.maxRange){
		s.middleX = s.middleX * s.maxRange / dist;
		s.middleY = s.middleY * s.maxRange / dist
	}
	if(dist < s.minRange){
		s.middleX = s.middleX * s.minRange / dist;
		s.middleY = s.middleY * s.minRange / dist
	}
	var pos = Collision.StrikeMap(s,{x:s.x + s.middleX,y:s.y + s.middleY});
	s.middleX = pos.x*32-s.x;
	s.middleY = pos.y*32-s.y;
	
	//s.crX: where attack created (player position)
	//s.middleX : when the strike is depending on mouseX. 
	//then we check how far we can go in that direction until we face wall.
	//after that, we place 9 points around this middleX. exact position depends on width and height of strike
	
	
	var w = s.width; var h = s.height;
	var startX = -w; var startY = -h;
		
	for(var k = 0 ; k < 9 ; k++){
		var axeX = startX + (k % 3)*w;
		var axeY = startY + Math.floor(k/3)*h;
		var numX =  (axeX*cos(angle) - axeY * sin(angle));
		var numY =  (axeX*sin(angle) + axeY * cos(angle));
				
		s.point[k] = 
		{'x':numX + s.crX + s.middleX,'y':numY + s.crY + s.middleY};
	}
	
	if(s.preDelayAnim){ Anim.creation(s.preDelayAnim.name,{'x':s.crX + s.middleX,'y':s.crY + s.middleY,'map':s.map,'viewedIf':s.viewedIf},s.preDelayAnim.sizeMod);}
	
	s.x = s.crX + s.middleX;
	s,y = s.crY + s.middleY;
	List.strike[s.id] = s;
	
	return s;
}




























