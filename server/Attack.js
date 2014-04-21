Attack = {};

Attack.template = function(type){
	var b = {};
	//NO TOUCH
	b.change = {};
	b.old = {};
	b.viewedBy = {};
	b.viewedIf = 'true';
	b.x = 0;
	b.y = 0;
	b.angle = 0;
	b.crAngle = 0;
	b.moveAngle = 0;	//where bullet moves (used for knock)
	b.crX = 0;  //creation X
	b.crY = 0;  //creation Y
	b.map = 'test@MAIN';
	b.toRemove = 0;
	b.id = Math.randomId();
	b.publicId = Math.randomId(6);
	b.hitId = Math.randomId();
	b.type = 'bullet';				//or strike
	b.combat = 1;
	//NO TOUCH
	
	
	//All
	b.dmg = {main:1,ratio:Cst.element.template(1)};
	b.globalDmg = 1;	//for nova
	
	b.objImg = 0;	//for bullet: sprite when travelling {name,anim,sizeMod} || for strike: anim when performing {name,sizeMod}
	b.hitImg = 0;	//when enemy get hits, use anim on him {name,sizeMod}
	
	
	b.damageIfMod = 0; //if 1, hit allies
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
	b.curse = null;
	b.onHit = null;
	
	//Strike
	
	b.width = 10;      			//width for strike
	b.height = 10;       		//height for strike
	b.delay = 0;   				//delay between cast and dmg phase for strike
	b.point = [];				//used for collision
	b.minRange = 5;				//min distance player-strike
	b.maxRange = 50;			//max distance player-strike
	b.onStrike = 0;				//call another attack when strike goes live
	
	//Bullet
	
	b.maxTimer = 40;
	b.timer = 0;
	b.spd = 15;
	
	b.normal = 0;	//for movement, get set inside creation
	b.nova = 0;
	b.boomerang = 0;
	b.ghost = 0;
	b.parabole = 0;
	b.sin = 0;
	b.mouseX = 0;	//strike and parabole
	b.mouseY = 0;
	b.sprite = {"name":"fireball","anim":"travel",'sizeMod':1};	
	
	return b;
}; 

Attack.template.parabole = function(){
	return {
		'height':10,	//height of parabole (distance from middle)
		'min':100,		//min distance where bullets will collide
		'max':500,		//max distance where bullets will collide
		'timer':50,		//time before bullets collide
	}
}
Attack.template.boomerang = function(){
	return {
		'comeBackTime':50,	//time before bullet turns 180 degre
		'spd':2,			//spd mod
		'spdBack':1.5,		//spd mod when bullet comes back
		'newId':1			//after turn back, renew id so it can hit enemy again
	}
}

Attack.creation = function(player,s,extra){
	if(Test.no.attack) return;
	s = Attack.creation.info(player,s);
	s = Tk.useTemplate(s,extra || {});
	
	s.id = Math.randomId();
	s.publicId = Math.randomId(6);
	s.hitId = Math.randomId();
	
	s.angle = (s.angle%360+360)%360;
	s.crAngle = s.angle; 
	s.moveAngle = s.angle;

	List.all[s.id] = s;
	
	if(s.type === 'strike'){ Attack.creation.strike(s);}
	else if(s.type === 'bullet'){ Attack.creation.bullet(s);}
	
	Activelist.add(s);
	
}; 

Attack.creation.info = function(act,b){
	b.crX = b.x = act.x || 0;
	b.crY = b.y = act.y || 0;
	b.mouseX = act.mouseX || 0;
	b.mouseY = act.mouseY || 0;
	
	b.map = act.map || 'test@MAIN';	
	b.viewedIf = act.viewedIf || 'true';
	b.damageIf = act.damageIf || 'player';
		
	if(b.nova || b.onHit || b.onStrike){
		b.bonus = act.bonus || Actor.template.bonus();
		b.weapon = act.weapon || Actor.template.weapon();
		b.mastery = act.mastery || Actor.template.mastery();
		b.globalDmg = act.globalDmg || 1;
	}
	
	b.parent = act.parent || act.id || null;
	
	return b;
}; 



Attack.creation.bullet = function(b){
	
	if(b.parabole){
		b.parabole = Tk.useTemplate(Attack.template.parabole(),b.parabole);
		var diff = Math.pyt(b.mouseX - Cst.WIDTH2,b.mouseY - Cst.HEIGHT2);
		b.parabole.dist = diff.mm(b.parabole.min,b.parabole.max);
		b.parabole.timer *= b.parabole.dist/b.parabole.max;
	}
	if(b.nova){ b.angle = Math.random()*360;}	//otherwise, circle always the same. moveAngle is same tho
	if(b.boomerang) b.boomerang = Tk.useTemplate(Attack.template.boomerang(),b.boomerang);
	
	b.normal = !b.sin && !b.parabole && !b.boomerang;
	
	Sprite.creation(b,{'name':b.objImg.name,'anim':"travel",'sizeMod':b.objImg.sizeMod});
	
	List.bullet[b.id] = b;
	Map.enter(b);
	
	Attack.creation.neverstrike(b);
	
	return b;
}; 



//need to remove player.bonus to pre-atk
Attack.creation.strike = function(s){
			
	//Position
	var dist = Math.pyt( s.mouseX-Cst.WIDTH2, s.mouseY-Cst.HEIGHT2);
	dist = dist.mm(s.minRange,s.maxRange);
	
	if(s.middleX === undefined){ s.middleX = dist * Tk.cos(s.angle); }	//could be set in extra
	if(s.middleY === undefined){ s.middleY = dist * Tk.sin(s.angle); }
	
	var pos = Collision.StrikeMap(s,{x:s.x + s.middleX,y:s.y + s.middleY});	//get farthest possible without touching wall
	s.middleX = pos.x*32-s.x;
	s.middleY = pos.y*32-s.y;
	
	//s.crX: where attack created (player position)
	//s.middleX : when the strike is depending on mouseX. 
	//then we check how far we can go in that direction until we face wall. (already done)
	//after that, we place 9 points around this middleX. exact position depends on width and height of strike
	
	
	var w = s.width; var h = s.height;
	var startX = -w; var startY = -h;
		
	for(var k = 0 ; k < 9 ; k++){
		var axeX = startX + (k % 3)*w;
		var axeY = startY + Math.floor(k/3)*h;
		var numX = (axeX*Tk.cos(s.angle) - axeY * Tk.sin(s.angle));
		var numY = (axeX*Tk.sin(s.angle) + axeY * Tk.cos(s.angle));
				
		s.point[k] = {'x':numX + s.crX + s.middleX,'y':numY + s.crY + s.middleY};
	}
	
	if(s.preDelayAnim){ 
		Anim.creation({
			name:s.preDelayAnim.name,
			target:{'x':s.crX + s.middleX,'y':s.crY + s.middleY,'map':s.map,'viewedIf':s.viewedIf},
			sizeMod:s.preDelayAnim.sizeMod}
		);
	}
	
	s.x = s.crX + s.middleX;
	s.y = s.crY + s.middleY;
	List.strike[s.id] = s;
	
	Attack.creation.neverbullet(s);
	return s;
}


Attack.creation.neverbullet = function(s){
	delete s.maxTimer;
	delete s.timer;
	delete s.spd;
	delete s.normal;
	delete s.nova;
	delete s.boomerang;
	delete s.ghost;
	delete s.parabole;
	delete s.sin;
	delete s.mouseX;
	delete s.mouseY;
	delete s.sprite;
}

Attack.creation.neverstrike = function(b){
	delete b.width;
	delete b.height;
	delete b.delay;
	delete b.point;
	delete b.minRange;
	delete b.maxRange;
	delete b.onStrike;
}



Bullet = {};
Bullet.remove = function(b){
	Activelist.remove(b);
	
	Map.leave(b);
	delete List.bullet[b.id];
	delete List.all[b.id];
}




















