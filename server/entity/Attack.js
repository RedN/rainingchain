Attack = {};

Attack.template = function(){
	var b = {};
	b.change = {};
	b.old = {};
	b.x = 0;
	b.y = 0;
	b.angle =0;
	b.crX = 0;  //creation X
	b.crY = 0;  //creation Y
	b.map = 'test';
	b.normal = 0;
	b.maxTimer = 40;
	b.timer = 0;
	b.toRemove = 0;
	b.spd = 15;
	
	b.width = 10;       //width for strike
	b.height = 10;       //height for strike
	b.delay = 0;    //delay between cast and dmg phase for strike
	b.point = [{'x':10,'y':10}];
	
	b.id = Math.randomId();
	b.hitId = Math.randomId();
	b.hitIfMod = 0; //if 1, hit allies
	b.num = 0;
	b.maxNum = 0;
	b.aim = 0;
	
	b.dmg = {'melee':0,'range':0,'magic':0,'fire':0,'cold':0,'lightning':0} ;
	b.dmgMain = 1;
		
	//Mods
	b.normal = 0;	//get set inside creation
	b.nova = 0;
	b.boomerang = 0;
	b.ghost = 0;
	b.parabole = 0;
	b.sin = 0;
	b.moveAngle = 0;
	b.mouseX = 0;
	b.mouseY = 0;
	b.sprite = {"name":"fireball","anim":"Travel",'sizeMod':1};	
	
	b.bleed = {'chance':1,'magn':1,'time':1};
	b.knock = {'chance':1,'magn':1,'time':1};
	b.drain = {'chance':1,'magn':1,'time':1};	
	b.burn = {'chance':1,'magn':1,'time':1};
	b.chill = {'chance':1,'magn':1,'time':1};
	b.confuse = {'chance':1,'magn':1,'time':1};
	
	b.leech = {'chance':1,'magn':1,'time':1};
	b.pierce = {'chance':1,'dmgReduc':1};
	b.crit = {'chance':1,'magn':1};
	b.curse = 0;
	
	
	b.viewedBy = {};
	b.viewedIf = 'true';
	

	return b;
}; 


Attack.creation = function(player,attack,extra){
	var s = attack;
	s = Attack.creation.info(player,s);
	
	s.id = Math.randomId();
	s.hitId = Math.randomId();
	
	attack = useTemplate(attack,extra); //need here so angle isnt player angle
	s.crAngle = s.angle; s.moveAngle = s.angle;

	List.all[s.id] = s;
	ActiveList.add(s);
	
	if(attack.type === 'strike'){ return Attack.creation.strike(player,attack);}
	if(attack.type === 'bullet'){ return Attack.creation.bullet(player,attack);}
}; 

Attack.creation.info = function(player,bullet){
	bullet.x = player.x;
	bullet.y = player.y;
	bullet.crX = player.x;
	bullet.crY = player.y;
	bullet.map = player.map;	
	bullet.viewedIf = player.viewedIf;

	bullet.angle = (player.angle+360)%360;
	
	bullet.bonus = player.bonus;
	if(player.parent){	bullet.parent = player.parent; }
	else {bullet.parent = player.id;}
	
	bullet.hitIf = player.hitIf;	
	return bullet;
}; 


Attack.creation.bullet = function(player,b){
	if(b.parabole){
		var diffX = player.mouseX - Cst.WIDTH2;	var diffY = player.mouseY - Cst.HEIGHT2;
		var diff = Math.sqrt(diffX*diffX+diffY*diffY);
		b.parabole.dist = Math.min(Math.max(diff,b.parabole.min),b.parabole.max);
		b.parabole.maxTimer *= b.parabole.dist/b.parabole.max;
	}
	if(b.nova){ b.angle = Math.random()*360;}
	if(!b.nova && !b.onHit){ delete b.bonus; }
	if(!b.sin && !b.parabole && !b.boomerang) { b.normal = 1; }
	
	Sprite.creation(b,{'name':b.objImg.name,'anim':"Travel",'sizeMod':b.objImg.sizeMod});
	
	List.bullet[b.id] = b;
	return b;
}; 


//need to remove player.bonus to pre-atk
Attack.creation.strike = function(player,s){
			
	//Position
	s.preMiddleX = player.mouseX-Cst.WIDTH2; 
	s.preMiddleY = player.mouseY-Cst.HEIGHT2;
	
	var dist = Math.sqrt( s.preMiddleX*s.preMiddleX + s.preMiddleY*s.preMiddleY );
	var angle = s.angle;
	
	if(s.middleX === undefined){ s.middleX = dist * cos(angle); }
	if(s.middleY === undefined){ s.middleY = dist * sin(angle); }
	
	var middleX = s.middleX;
	var middleY = s.middleY;
	
	if(dist > s.maxRange){
		middleX = middleX * s.maxRange / dist;
		middleY = middleY * s.maxRange / dist
	}
	if(dist < s.minRange){
		middleX = middleX * s.minRange / dist;
		middleY = middleY * s.minRange / dist
	}
	
	var w = s.width; var h = s.height;
	var startX = -w; var startY = -h;
	
	for(var k = 0 ; k < 9 ; k++){
		var axeX = startX + (k % 3)*w;
		var axeY = startY + Math.floor(k/3)*h;
		var numX =  (axeX*cos(angle) - axeY * sin(angle));
		var numY =  (axeX*sin(angle) + axeY * cos(angle));
				
		s.point[k] = 
		{'x':numX + s.crX + middleX,'y':numY + s.crY + middleY};
	}
	
	if(s.objImg){ Anim.creation(s.objImg.name,{'x':s.crX + middleX,'y':s.crY + middleY,'map':s.map,'viewedIf':s.viewedIf},s.objImg.sizeMod);}
	
	
	
	List.strike[s.id] = s;
	
	return s;
}




























