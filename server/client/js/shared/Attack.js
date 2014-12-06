//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','ActiveList','Bullet','Strike','Map','Debug','Collision','Combat','Sprite','Anim','AttackModel'],['Attack']));

var Attack = exports.Attack = function(model,act,extra){	//model is AttackModel
	var tmp = {		//+ all properties from model
		change:{},
		old:{},
		activeList:{},
		toRemove:0,
		id:Math.randomId(),
		hitId:Math.randomId(),
		combat:1,
		timer:0,
		point:[],				//used for collision
		rotatedRect:null,
		
		x:extra.x || 0,
		y:extra.y || 0,
		crX:extra.x || 0,			//creation X, used for parabole and sin
		crY:extra.y || 0, 			//creation Y, used for parabole and sin
		
		mouseX:act.mouseX || 0,	//strike and parabole
		mouseY:act.mouseY || 0,
		
		map:act.map || 'QfirstTown-main@MAIN',
		viewedIf:act.viewedIf || 'true',
		damageIf:act.damageIf || 'player',
		parent:act.parent || act.id || null,		
		
		angle:extra.angle,
		crAngle:extra.angle,
		moveAngle:extra.angle,	//where bullet moves (used for knock, boomerang)
		num:extra.num || 0,		//# bullet if many shoot at once
		normal:0,	//for movement, get set inside creation
		
		//for onMove onHit onDamagePhase
		bonus:act.bonus || Actor.Bonus(),
		mastery:act.mastery || Actor.Mastery(),
		globalDmg:1,
		combatContext:act.combatContext || Actor.CombatContext(),
		equip:act.equip || '',
		
	}
	for(var i in model) tmp[i] = model[i];	//adds property, doesnt overwrite tho at least not supposed to...
	
	
	if(tmp.type === 'strike') 
		Attack.Strike(tmp);
	else if(tmp.type === 'bullet'){
		ActiveList.addToList(tmp);
		Attack.Bullet(tmp);	
	}
}; 

Attack.Bullet = function(b){
	if(b.parabole){
		var diff = Math.pyt(b.mouseX - CST.WIDTH2,b.mouseY - CST.HEIGHT2);
		b.parabole.dist = diff.mm(b.parabole.min,b.parabole.max);
		b.parabole.timer *= b.parabole.dist/b.parabole.max;
	}
	if(b.onMove){ b.angle = Math.random()*360;}	//otherwise, circle always the same. moveAngle is same tho

	b.normal = !b.sin && !b.parabole && !b.boomerang;
	
	Sprite.updateBumper(b);	//bad
	Bullet.addToList(b);
	Map.enter(b);
		
	return b;
}; 

//need to remove player.bonus to pre-atk
Attack.Strike = function(s){
	//make sure s.x and s.y is not thru wall
	
	
	
	
	
	//after that, we place 9 points around (s.x,s.y). exact position depends on width and height of strike
	var w = s.width; var h = s.height;
	var startX = -w; var startY = -h;
		
	for(var k = 0 ; k < 9 ; k++){
		var axeX = startX + (k % 3)*w;
		var axeY = startY + Math.floor(k/3)*h;
		var numX = (axeX*Tk.cos(s.angle) - axeY * Tk.sin(s.angle));
		var numY = (axeX*Tk.sin(s.angle) + axeY * Tk.cos(s.angle));

		s.point[k] = {
			x:numX + s.x,
			y:numY + s.y
		};
	}
	s.rotatedRect = {
		x:s.point[0].x,y:s.point[0].y,width:w,height:h,angle:s.angle,
	};
	
	Collision.strikeActor(s);
	
	if(s.onDamagePhase && s.onDamagePhase.chance >= Math.random()){
		Combat.attack(s,s.onDamagePhase.attack);
	}
	
	
	return s;
}


Attack.loop = function(){
	Attack.loop.FRAME_COUNT++;
	Bullet.loop();
}
Attack.loop.FRAME_COUNT = 0;

Attack.testInterval = function(b,num){
	return Attack.loop.FRAME_COUNT % num === 0;
}





