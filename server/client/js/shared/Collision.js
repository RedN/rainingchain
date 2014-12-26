//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Bullet','Combat','Input','Actor','MapModel','Map'],['Collision']));
/*
rect: [minx,maxx,miny, maxy]
pt: {x:12.3,y:13.23}	//real position
pos: {x:1,y:23}			//grid position
*/

var Collision = exports.Collision = {};

Collision.testRectRect = function(rect1,rect2){
	if(rect1.length === 4 || rect2.length === 4) return ERROR(4,'rect');
	return rect1.x <= rect2.x+rect2.width 
		&& rect2.x <= rect1.x+rect1.width
		&& rect1.y <= rect2.y + rect2.height
		&& rect2.y <= rect1.y + rect1.height;
}

Collision.testPtRect = function(pt,rect){
	if(rect.length === 4) return ERROR(4,'not a rect');
	return pt.x >= rect.x
		&& pt.y >= rect.y
		&& pt.x <= rect.x+rect.width 
		&& pt.y <= rect.y+rect.height;
}


Collision.testPtRRect = function(pt,rotRect){	//Collision Pt and Rotated Rect
	//IF WANT REVAMP: local function isPointInsideRectangle(rectangle, x, y)$$$			local c = math.cos(-rectangle.rotation*math.pi/180)$$$			local s = math.sin(-rectangle.rotation*math.pi/180)$$$			$$$			-- UNrotate the point depending on the rotation of the rectangle$$$			local rotatedX = rectangle.x + c * (x - rectangle.x) - s * (y - rectangle.y)$$$			local rotatedY = rectangle.y + s * (x - rectangle.x) + c * (y - rectangle.y)$$$			$$$			-- perform a normal check if the new point is inside the $$$			-- bounds of the UNrotated rectangle$$$			local leftX = rectangle.x - rectangle.width / 2$$$			local rightX = rectangle.x + rectangle.width / 2$$$			local topY = rectangle.y - rectangle.height / 2$$$			local bottomY = rectangle.y + rectangle.height / 2$$$			$$$			return leftX <= rotatedX and rotatedX <= rightX and$$$					topY <= rotatedY and rotatedY <= bottomY$$$	end
	var ptInRectReferencial = Tk.rotatePt(pt,-rotRect.angle);
	return Collision.testPtRect(ptInRectReferencial,rotRect);
}

Collision.getDistancePtPt = function(pt1,pt2){
	return Math.sqrt(Math.pow(pt1.x - pt2.x,2) + Math.pow(pt1.y - pt2.y,2));
}

Collision.getAnglePtPt = function(pt1,pt2){	//pt1 looking towards pt2
	return Tk.atan2(pt2.y-pt1.y,pt2.x-pt1.x);
}

Collision.testPosGrid = function(pos,grid){	
	return Collision.testXYMap(pos.x,pos.y,grid);
}
Collision.testXYMap = function(x,y,grid){ //return 1 if collision
	return !grid[y] || !+grid[y][x];
}

Collision.getPos = function(pt){
	return {x:Math.floor(pt.x/32),y:Math.floor(pt.y/32)}
}

Collision.getSquareValue = function(pos,map,type){
	var grid = MapModel.get(map).grid[type];
	if(!grid[pos.y]) return null;
	return grid[pos.y][pos.x];		//return 01234
}

Collision.getPath = function(pos1,pos2){	//straight forward path (linear)
	var array = [];
	for(var i = 0 ; i < 1000 && (pos1.x !== pos2.x || pos1.y !== pos2.y); i++){
		if(pos1.x < pos2.x) pos1.x++;
		else if(pos1.x > pos2.x) pos1.x--;
		
		array.push({x:pos1.x,y:pos1.y});
		
		if(pos1.y < pos2.y) pos1.y++;
		else if(pos1.y > pos2.y) pos1.y--;
		
		array.push({x:pos1.x,y:pos1.y});
	}
	return array;
}

Collision.getHitBox = function(player,vx,vy){
	vx = vx || 0;
	vy = vy || 0;
	return {
		x:vx + player.x + player.sprite.hitBox.left.x,
		width:player.sprite.hitBox.right.x - player.sprite.hitBox.left.x,
		y:vy + player.y + player.sprite.hitBox.up.y,
		height:player.sprite.hitBox.down.y - player.sprite.hitBox.up.y,
	}
}

Collision.getBumperBox = function(player,vx,vy){
	vx = vx || 0;
	vy = vy || 0;
	return {
		x:vx + player.x + player.sprite.bumperBox.left.x,
		width:player.sprite.bumperBox.right.x - player.sprite.bumperBox.left.x,
		y:vy + player.y + player.sprite.bumperBox.up.y,
		height:player.sprite.bumperBox.down.y - player.sprite.bumperBox.up.y,
	}
}

Collision.getMouse = function(key){
	return SERVER ? Actor.getMouse(Actor.get(key)) : Actor.getMouse(player);
}
Collision.testMouseRect = function(key,rect){
	return Collision.testPtRect(Collision.getMouse(key),rect);
}

//
Collision.bulletActor = function(b){
	for(var i in b.activeList){ 
		var act = Actor.get(i);
		if(!act) continue;	//test target exist
		if(!Collision.testPtRect(b,Collision.getHitBox(act))) continue;	//test if nearby
		if(!Collision.bulletActor.test(b,act)) continue;	//exist if can attack this type of player
		
		Combat.collision(b,act);
	}	
}

Collision.bulletActor.test = function(atk,def){
	if(!atk.combat || !def.combat) return;
	var parent = Actor.get(atk.parent);
	if(!parent) return;// ERROR(3,'no atk.parent');	//not sure if normal, shoot bullet and parent dies
	var normal = Combat.damageIf(atk,def);
	
	if(def.damagedIf === 'false') return false;
	if(normal && def.damagedIf !== 'true'){
		if(Array.isArray(def.damagedIf)) normal = def.damagedIf.contains(atk.parent);
		if(def.damagedIf === 'player') normal = parent.type === 'player';
		if(def.damagedIf === 'npc') normal = parent.type === 'npc';
		if(typeof def.damagedIf === 'function') normal = def.damagedIf(parent);
	}
	return (!atk.damageIfMod && normal) || (atk.damageIfMod && !normal); 
}

Collision.bulletMap = function(bullet){
	if(bullet.ghost) return 0;
	var map = MapModel.get(bullet.map);
	var pos = Collision.getPos(bullet);
	var grid = map.grid['bullet'];
	if(Collision.testPosGrid(pos,grid) || +Collision.MAP_MOD[bullet.map + '-' + pos.x + '-' + pos.y] )
		bullet.toRemove = 1;
	
}

Collision.strikeActor = function(atk){
	var map = Map.get(atk.map);
	if(!map) return ERROR(3,'no map');
	for(var j in map.list.actor){
		var act = Actor.get(j);
		if(!act) continue;	//normal because strike is not in activeList of enemy.
		if(!Collision.strikeActor.test(atk,act)) continue;
		if(!Collision.strikeActor.collision(atk,act)) continue;
		
		Combat.collision(atk,act);
		if(--atk.maxHit <= 0) return;	//can not longer hit someone
	}
}

Collision.strikeActor.test = Collision.bulletActor.test;

Collision.strikeActor.collision = function(atk,player){
	//Test Center First with Rot Rect
	if(Collision.testPtRRect(player,atk.rotatedRect)) return true;	
	
	//Test 9 Pts
	var hb = Collision.getHitBox(player);
	for(var i = 0 ; i < atk.point.length; i++){
		if(Collision.testPtRect(atk.point[i],hb)) return true;
	}
		
	return false;
}

Collision.strikeMap = function(strike,target){	//gets farthest position with no collision
	var end = Collision.getPos(target);
	var path = Collision.getPath(Collision.getPos(strike),end);
	
	var grid = MapModel.get(strike.map).grid['bullet'];
	for(var i in path){
		if(Collision.testPosGrid(path[i],grid)) 
			return {x:path[i].x*32,y:path[i].y*32};	
	}

	return target;
}


Collision.testLineMap = function(map,start,end){
	var path = Collision.getPath(Collision.getPos(start),Collision.getPos(end));
	
	for(var i in path){
		var grid = MapModel.get(map).grid['bullet'];
		if(Collision.testPosGrid(path[i],grid)) return true;	
	}
	return false;
}

Collision.actorMap = function(x,y,map,act){
	if(act.ghost) return 0;
	if(act.awareNpc){
		if(typeof act.mapMod[x + '-' + y] !== 'undefined') return act.mapMod[x + '-' + y];
	} else if(typeof Collision.MAP_MOD[map + '-' + x + '-' + y] !== 'undefined'){
		return +Collision.MAP_MOD[map + '-' + x + '-' + y];
	}
	var grid = MapModel.get(map).grid[act.type || 'npc'];
	return Collision.testXYMap(x,y,grid);
}

Collision.loop = function(){
	Collision.loop.FRAME_COUNT++;
	if(Collision.loop.FRAME_COUNT % 25 === 0) Collision.loop.mapMod();
}
Collision.loop.FRAME_COUNT = 0;

Collision.loop.mapMod = function(){	//note, 
	Collision.MAP_MOD = {};
	var list = Actor.getBulletCollisionMapModList();
	for(var i in list)
		Collision.MAP_MOD[list[i].map + '-' + list[i].x + '-' + list[i].y] = 1;
	
}

Collision.MAP_MOD = {};	//all bullets share the same mapMod


