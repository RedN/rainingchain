//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Tk','Bullet','Loop','Combat','Map','Input'],['Collision']));
/*
rect: [minx,maxx,miny, maxy]
pt: {x:12.3,y:13.23}	//real position
pos: {x:1,y:23}			//grid position
*/

var Collision = exports.Collision = {};

Collision.rectRect = function(rect1,rect2){	//rect1:[minx,maxx,miny,maxy],rect2:[minx,maxx,miny,maxy]
	
	return (rect1[0] <= rect2[1] &&	rect2[0] <= rect1[1] &&	rect1[2] <= rect2[3] &&	rect2[2] <= rect1[3]);
}

Collision.ptRect = function(pt,rect){	//pt:{x:1,y:1},rect:[minx,maxx,miny,maxy]
	return (pt.x >= rect[0] && pt.x <= rect[1] && pt.y >= rect[2] && pt.y <= rect[3])
}

Collision.ptRRect = function(pt,rotRect){	//Collision Pt and Rotated Rect
	//IF WANT REVAMP: local function isPointInsideRectangle(rectangle, x, y)$$$			local c = math.cos(-rectangle.rotation*math.pi/180)$$$			local s = math.sin(-rectangle.rotation*math.pi/180)$$$			$$$			-- UNrotate the point depending on the rotation of the rectangle$$$			local rotatedX = rectangle.x + c * (x - rectangle.x) - s * (y - rectangle.y)$$$			local rotatedY = rectangle.y + s * (x - rectangle.x) + c * (y - rectangle.y)$$$			$$$			-- perform a normal check if the new point is inside the $$$			-- bounds of the UNrotated rectangle$$$			local leftX = rectangle.x - rectangle.width / 2$$$			local rightX = rectangle.x + rectangle.width / 2$$$			local topY = rectangle.y - rectangle.height / 2$$$			local bottomY = rectangle.y + rectangle.height / 2$$$			$$$			return leftX <= rotatedX and rotatedX <= rightX and$$$					topY <= rotatedY and rotatedY <= bottomY$$$	end
	
	var x = pt.x;
	var y = pt.y;
	var pt0 = rotRect[0];
	var pt1 = rotRect[1];
	var pt2 = rotRect[2];
	var pt3 = rotRect[3];
	
	var eq01n23_m = (pt0.y-pt1.y)/(pt0.x-pt1.x);
	var eq01_b = pt0.y-eq01n23_m*pt0.x;
	var e23_b = pt2.y-eq01n23_m*pt2.x;

	var eq13n02_m = (pt1.y-pt3.y)/(pt1.x-pt3.x);
	var eq13_b = pt1.y-eq13n02_m*pt1.x;
	var e02_b = pt0.y-eq13n02_m*pt0.x;

	var bool = false;					
	if(eq13_b >= e02_b && eq01_b >= e23_b){		
		bool = (y >= eq13n02_m*x + e02_b) && (y <= eq13n02_m*x + eq13_b) && (y >= eq01n23_m*x + e23_b) && (y <= eq01n23_m*x + eq01_b);
	} 
	if(eq13_b >= e02_b && eq01_b <= e23_b){		
		bool = (y >= eq13n02_m*x + e02_b) && (y <= eq13n02_m*x + eq13_b) && (y <= eq01n23_m*x + e23_b) && (y >= eq01n23_m*x + eq01_b);
	}
	if(eq13_b <= e02_b && eq01_b >= e23_b){		
		bool = (y <= eq13n02_m*x + e02_b) && (y >= eq13n02_m*x + eq13_b) && (y >= eq01n23_m*x + e23_b) && (y <= eq01n23_m*x + eq01_b);
	} 
	if(eq13_b <= e02_b && eq01_b <= e23_b){		
		bool = (y <= eq13n02_m*x + e02_b) && (y >= eq13n02_m*x + eq13_b) && (y <= eq01n23_m*x + e23_b) && (y >= eq01n23_m*x + eq01_b);
	}
		
	return bool;	

}

Collision.distancePtPt = function(pt1,pt2){
	return Math.sqrt(Math.pow(pt1.x - pt2.x,2) + Math.pow(pt1.y - pt2.y,2));
}

Collision.anglePtPt = function(pt1,pt2){	//pt1 looking towards pt2
	return Tk.atan2(pt2.y-pt1.y,pt2.x-pt1.x);
}

Collision.posMap = function(pos,map,type){	//Test Collision between pos and map	
	try {
		var grid = List.map[map].grid[type];
		return !grid[pos.y] || !+grid[pos.y][pos.x];	//if type === player, this line wont affect return
		//return 1 if collision	
	} catch(err){ 	//faster to try than testing everytime
		if(!List.map[map]) return ERROR(3,'no map',map,type,List.map[map].grid[type]);
	}
}
Collision.posMap.fast = function(x,y,map,type){	//Test Collision between xy and map	
	try {
		var grid = List.map[map].grid[type];
		return !grid[y] || !+grid[y][x];
		//return 1 if collision	
	} catch(err){ 	//faster to try than testing everytime
		if(!List.map[map]) return ERROR(3,'no map',map,type,List.map[map].grid[type]);
	}
}

Collision.getPos = function(pt){
	return {x:Math.floor(pt.x/32),y:Math.floor(pt.y/32)}
}

Collision.getSquareValue = function(pos,map,type){
	var grid = Db.map[Map.getModel(map)].grid[type];
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

Collision.getHitBox = function(player){
	return [player.x + player.hitBox[2].x,player.x + player.hitBox[0].x,player.y + player.hitBox[3].y,player.y + player.hitBox[1].y];
}

Collision.getBumperBox = function(player){
	return [player.x + player.bumperBox[2].x,player.x + player.bumperBox[0].x,player.y + player.bumperBox[3].y,player.y + player.bumperBox[1].y];
}

Collision.getMouse = function(key){
	if(SERVER){ return {x:List.all[key].mouseX,y:List.all[key].mouseY}  }
	else{ return {x:Input.mouse.x,y:Input.mouse.y} }
}


//
Collision.bulletActor = function(b){
	for(var i in b.activeList){ 
		var player = List.all[i];
		if(!player) continue;	//test target exist
		if(!Collision.ptRect(b,Collision.getHitBox(player))) continue;	//test if nearby
		if(!Collision.bulletActor.test(b,player)) continue;	//exist if can attack this type of player
		
		Combat.collision(b,player);
	}	
}

Collision.bulletActor.test = function(atk,def){
	if(!atk.combat || !def.combat) return;
	if(!List.all[atk.parent]) return;// ERROR(3,'no atk.parent');	//not sure if normal, shoot bullet and parent dies
	var normal = Combat.damageIf(atk,def);
	
	if(def.damagedIf === 'false') return false;
	if(normal && def.damagedIf !== 'true'){
		if(Array.isArray(def.damagedIf)) normal = def.damagedIf.have(atk.parent);
		if(def.damagedIf === 'player') normal = List.all[atk.parent].type === 'player';
		if(def.damagedIf === 'npc') normal = List.all[atk.parent].type === 'npc';
		if(typeof def.damagedIf === 'function') normal = def.damagedIf(List.all[atk.parent]);
	}
	return (!atk.damageIfMod && normal) || (atk.damageIfMod && !normal); 
}

Collision.bulletMap = function(bullet){
	if(bullet.ghost) return 0;

	if(!List.map[bullet.map]){
		Bullet.remove(bullet);
		return ERROR(3,'no map',bullet.map);
	}
	var pos = Collision.getPos(bullet);
	if(Collision.posMap(pos,bullet.map,'bullet') || +Collision.mapMod[bullet.map + '-' + pos.x + '-' + pos.y] )
		bullet.toRemove = 1;
	
}

Collision.strikeActor = function(atk){
	for(var j in atk.activeList){
		var act = List.actor[j];
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
	if(Collision.ptRRect({'x':player.x,'y':player.y},[atk.point[2],atk.point[8],atk.point[0],atk.point[6]])) return true;	
	
	//Test 9 Pts
	var hb = Collision.getHitBox(player);
	for(var i = 0 ; i < atk.point.length; i++){
		if(Collision.ptRect(atk.point[i],hb)) return true;
	}
		
	return false;
}

Collision.strikeMap = function(strike,target){	//gets farthest position with no collision
	var end = Collision.getPos(target);
	var path = Collision.getPath(Collision.getPos(strike),end);
	
	for(var i in path){
		if(Collision.posMap(path[i],strike.map,'bullet')) return path[i];	
	}

	return end;
}


Collision.ptPtWallCollision = function(map,start,end){
	var path = Collision.getPath(Collision.getPos(start),Collision.getPos(end));
	
	for(var i in path){
		if(Collision.posMap(path[i],map,'bullet')) return true;	
	}
	return false;
}


Collision.actorMap = function(pos,map,act){
	if(act.ghost) return 0;
	
	if(act.awareNpc){
		if(typeof act.mapMod[pos.x + '-' + pos.y] !== 'undefined') return act.mapMod[pos.x + '-' + pos.y];
	} else if(typeof Collision.mapMod[map + '-' + pos.x + '-' + pos.y] !== 'undefined'){
		return +Collision.mapMod[map + '-' + pos.x + '-' + pos.y];
	}
		
	return Collision.posMap(pos,map,act.type || 'npc');
};
Collision.actorMap.fast = function(x,y,map,act){
	if(act.awareNpc){
		if(typeof act.mapMod[x + '-' + y] !== 'undefined') return act.mapMod[x + '-' + y];
	} else if(typeof Collision.mapMod[map + '-' + x + '-' + y] !== 'undefined'){
		return +Collision.mapMod[map + '-' + x + '-' + y];
	}
		
	return Collision.posMap.fast(x,y,map,act.type || 'npc');
}

Collision.loop = function(){
	if(Loop.interval(25)) Collision.loop.mapMod();
}

Collision.loop.mapMod = function(){
	Collision.mapMod = {};
	for(var i in List.actor){
		var act = List.actor[i];
		if(!act || !act.block) continue;
		
		var size = act.block.size;
		var pos = Collision.getPos({
			x:act.x-1,
			y:act.y-1
		});
			
		for(var j = size[0]; j <= size[1]; j++){
			for(var k = size[2]; k <= size[3]; k++){
				Collision.mapMod[act.map + '-' + (pos.x+j) + '-' + (pos.y+k)] = 1;
			}
		}
	}
}

Collision.mapMod = {};	//all bullets share the same mapMod


