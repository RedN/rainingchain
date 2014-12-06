//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Main','Boss','Combat','ActiveList','Map','Collision','Sprite','Anim','Boost']));

Actor.bumper = {};
Actor.Bumper = Actor.MoveInput = function(){
	return {
		right:false,
		left:false,
		down:false,
		up:false,
	}
}
Actor.bumper.update = function(act){	//HOTSPOT
	if(act.ghost) return;
	
	/*
	if(!Actor.testInterval(act,3) && act.type !== 'player'){	//only update if spd is high, but still update every 3 frames no matter what
		if(!(act.spdX > 7 || act.spdX < -7 || act.spdY > 7 || act.spdY < -7)) return;	//bit faster than Math.abs
	}
	*/
	
	if(Actor.testInterval(act,3) || act.type === 'player'){
		for(var i in act.bumper)
			act.bumper[i] = Collision.actorMap(
				Math.floor((act.x + act.sprite.bumperBox[i].x)/32),
				Math.floor((act.y + act.sprite.bumperBox[i].y)/32),
				act.map,
				act
			);
		if(Actor.testInterval(act,2)) 
			Actor.bumper.testDeath(act);
		return;
	}
	
	
	//for npc, update every 3 frames or if spd more than 7
	if(act.spdX > 7) act.bumper.right = Collision.actorMap(Math.floor((act.x + act.sprite.bumperBox.right.x)/32),Math.floor((act.y + act.sprite.bumperBox.right.y)/32),act.map,act);
	else if(act.spdX < -7) act.bumper.left = Collision.actorMap(Math.floor((act.x + act.sprite.bumperBox.left.x)/32),Math.floor((act.y + act.sprite.bumperBox.left.y)/32),act.map,act);
	if(act.spdY > 7) act.bumper.down = Collision.actorMap(Math.floor((act.x + act.sprite.bumperBox.down.x)/32),Math.floor((act.y + act.sprite.bumperBox.down.y)/32),act.map,act);
	else if(act.spdY < -7) act.bumper.up = Collision.actorMap(Math.floor((act.x + act.sprite.bumperBox.up.x)/32),Math.floor((act.y + act.sprite.bumperBox.up.y)/32),act.map,act);
		
}

Actor.bumper.testDeath = function(act){	//quick fix if manage to past thru wall
	for(var i in act.bumper) if(!act.bumper[i]) return;	//bumper, not bumperBox
	act.hp = -1;	
}

Actor.fall = function(act){	//default fall
	var map = MapModel.get(act.map);
	if(map.fall) map.fall(act.id);
	else act.hp = -1;
}

Actor.move = function(act){
	if(act.pushable) return Actor.pushable.update(act);
	
	Actor.bumper.update(act);   //test if collision with map    
		
	if(act.bumper.right){act.spdX = -Math.abs(act.spdX*0.5)*act.bounce - act.bounce;} 
	if(act.bumper.down){act.spdY = -Math.abs(act.spdY*0.5)*act.bounce - act.bounce;}
	if(act.bumper.left){act.spdX = Math.abs(act.spdX*0.5)*act.bounce + act.bounce;} 
	if(act.bumper.up){act.spdY = Math.abs(act.spdY*0.5)*act.bounce + act.bounce;} 

	if(act.moveInput.right && !act.bumper.right && act.spdX < act.maxSpd){act.spdX += act.acc;}
	if(act.moveInput.down && !act.bumper.down && act.spdY < act.maxSpd){act.spdY += act.acc;}
	if(act.moveInput.left && !act.bumper.left && act.spdX > -act.maxSpd){act.spdX -= act.acc;}
	if(act.moveInput.up && !act.bumper.up && act.spdY > -act.maxSpd){act.spdY -= act.acc;}	
	
	
	//Friction + Min Spd
	if (Math.abs(act.spdX) < 0.1){act.spdX = 0;}	
	if (Math.abs(act.spdY) < 0.1){act.spdY = 0;}
	act.moveAngle = Tk.atan2(act.spdY,act.spdX);
	
	
	//Calculating New Position
	//var dist = Math.pyt(act.spdY,act.spdX);	//slow
	var dist = Math.abs(act.spdY) + Math.abs(act.spdX);
	var amount = Math.ceil(dist/31);
	if(amount < 2){
		act.x += act.spdX;
		act.y += act.spdY;
	} else {    //aka could pass thru walls => move step by step and test bumper every time
		for(var i = 0 ; i < amount && !act.bumper.right && !act.bumper.down && !act.bumper.left && !act.bumper.up  ; i++){
			act.x += act.spdX/amount;
			act.y += act.spdY/amount;
			Actor.bumper.update(act);
		} 
	} 
	act.spdX *= act.friction;	
	act.spdY *= act.friction;
	
	if(act.type === 'player' && Actor.testInterval(act,3)){
		Actor.move.updateAimPenalty(act);
		Actor.move.testFall(act);
	}
		
}

Actor.move.updateAimPenalty = function (act){	
	//penalty if looking and moving in opposite direction
	var diffAim = Math.abs(act.angle - act.moveAngle);
	if (diffAim > 180){ diffAim = 360 - diffAim;}
	Actor.boost(act,Boost('Aim','maxSpd',Math.pow(1-diffAim/360,1.5),4,"*"));
}

Actor.move.testFall = function(act){
	var xy = {x: act.x +act.sprite.bumperBox.down.x,y:act.y + act.sprite.bumperBox.right.y};	//center of bumper
	xy = Collision.getPos(xy);
	var value = Collision.getSquareValue(xy,act.map,'player');
	
	if(value === '4'){ Actor.fall(act); }
	if(value === '3'){ 
		var list = Actor.move.testFall.ARRAY;	
		for(var i in list){
			if(Collision.getSquareValue({x:xy.x+list[i][0],y:xy.y+list[i][1]},act.map,'player') === '4'){
				Actor.movePush(act,list[i][2],5,5);
				break;
			}
		}
	}
}
Actor.move.testFall.ARRAY = [[1,0,0],[0,1,90],[-1,0,180],[0,-1,270],[1,1,45],[-1,1,135],[-1,1,225],[1,-1,315],];

Actor.pushable = {};
Actor.pushable.update = function(act){
	if(!(act.pushable.timer-- > 0)) return;
	act.x += Tk.cos(act.pushable.angle) * act.pushable.magn;
	act.y += Tk.sin(act.pushable.angle) * act.pushable.magn;
}

Actor.mapMod = {}
Actor.mapMod.update = function(act){
	act.mapMod = {};
	
	for(var i in act.activeList){
		var actBlock = Actor.get(i);
		if(!actBlock || !actBlock.block) continue;	//normal no act cuz idk if actor
		var b = actBlock.block;
		if(!b.impactPlayer && act.type === 'player') continue;
		if(!b.impactNpc && act.type === 'npc') continue;
		
		var pos = Collision.getPos(actBlock);
		
		for(var j = 0; j < b.size.width; j++){
			var x = pos.x + b.size.x + j;
			for(var k = 0; k < b.size.height; k++){
				var y = pos.y + b.size.y + k;
				act.mapMod[x + '-' + y] = typeof b.value === 'undefined' ? 1 : b.value;
			}
		}
	}
};

Actor.getBulletCollisionMapModList = function(){	//note: Collision.MAP_MOD also impact npc with no awareNpc...
	var toReturn = [];
	for(var i in Actor.LIST){
		var act = Actor.LIST[i];
		if(!act || !act.block || !act.block.impactBullet) continue;
		
		var b = act.block;
		var pos = Collision.getPos({
			x:act.x-1,
			y:act.y-1
		});
			
		for(var j = 0; j < b.size.width; j++){
			var x = pos.x + b.size.x + j;
			for(var k = 0; k < b.size.height; k++){
				var y = pos.y + b.size.y + k;
				toReturn.push({map:act.map,x:x,y:y});
			}
		}
	}
	return toReturn;
}





