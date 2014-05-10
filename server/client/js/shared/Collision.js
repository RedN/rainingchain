Collision = {};

/*
rect: [minx,maxx,miny, maxy]
pt: {x:12.3,y:13.23}	//real position
pos: {x:1,y:23}			//grid position
*/


Collision.RectRect = function(rect1,rect2){	//rect1:[minx,maxx,miny,maxy],rect2:[minx,maxx,miny,maxy]
	
	return (rect1[0] <= rect2[1] &&	rect2[0] <= rect1[1] &&	rect1[2] <= rect2[3] &&	rect2[2] <= rect1[3]);
}

Collision.PtRect = function(pt,rect){	//pt:{x:1,y:1},rect:[minx,maxx,miny,maxy]
	return (pt.x >= rect[0] && pt.x <= rect[1] && pt.y >= rect[2] && pt.y <= rect[3])
}

Collision.PtRRect = function(pt,rotRect){	//Collision Pt and Rotated Rect
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

Collision.PosMap = function(pos,map,type){	//Test Collision between pos and map	
	var grid = List.map[map].grid[type];
	return !grid[pos.y] || !+grid[pos.y][pos.x];	//if type === player, this line wont affect return
	//return 1 if collision	
}


Collision.getPos = function(pt){
	return {x:Math.floor(pt.x/32),y:Math.floor(pt.y/32)}
}
Collision.getPos.xy = function(pt){
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
Collision.BulletActor = function(b){
	for(var i in b.activeList){ 
		var player = List.all[i];
		if(!player) continue;	//test target exist
		if(!Collision.BulletActor.test(b,player)) continue;	//exist if can attack this type of player
		if(!Collision.PtRect(b,Collision.getHitBox(player))) continue;	//test if nearby
		
		Combat.collision(b,player);
	}	
}

Collision.BulletActor.test = function(atk,def){
	if(!atk.combat || !def.combat) return;
	var normal = Combat.damageIf(atk,def);
	
	if(def.damagedIf === 'false') return false;
	if(normal && def.damagedIf !== 'true'){
		if(Array.isArray(def.damagedIf)) normal = def.damagedIf.have(atk.parent);
		if(typeof def.damagedIf === 'function') normal = def.damagedIf(List.all[atk.parent]);
	}
	return (!atk.damageIfMod && normal) || (atk.damageIfMod && !normal); 
}

Collision.BulletMap = function(bullet){
	if(bullet.ghost) return 0;

	var pos = Collision.getPos(bullet);
	if(Collision.PosMap(pos,bullet.map,'bullet') || +Collision.mapMod[bullet.map + '-' + pos.x + '-' + pos.y] )
		bullet.toRemove = 1;
	
}

Collision.StrikeActor = function(atk){
	for(var j in atk.activeList){
		var player = List.all[j];
		if(!player){ ERROR(3,'no act'); continue; }	//test target exist
		if(!Collision.StrikeActor.test(atk,player)) continue;
		if(!Collision.StrikeActor.collision(atk,player)) continue;
		
		Combat.collision(atk,player);
		if(--atk.maxHit <= 0) return;	//can not longer hit someone
	}
}

Collision.StrikeActor.test = Collision.BulletActor.test;

Collision.StrikeActor.collision = function(atk,player){
	//Test Center First with Rot Rect
	if(Collision.PtRRect({'x':player.x,'y':player.y},[atk.point[2],atk.point[8],atk.point[0],atk.point[6]])) return true;	
	
	//Test 9 Pts
	var hb = Collision.getHitBox(player);
	for(var i = 0 ; i < atk.point.length; i++){
		if(Collision.PtRect(atk.point[i],hb)) return true;
	}
		
	return false;
}

Collision.StrikeMap = function(strike,target){	//gets farthest position with no collision
	var end = Collision.getPos(target);
	var path = Collision.getPath(Collision.getPos(strike),end);
	
	for(var i in path){
		if(Collision.PosMap(path[i],strike.map,'bullet')) return path[i];	
	}

	return end;
}

Collision.ActorMap = function(pos,map,act){
	if(act.ghost) return 0;
	
	if(act.awareNpc){
		if(act.mapMod[pos.x + '-' + pos.y]) return 1;
	} else if(+Collision.mapMod[map + '-' + pos.x + '-' + pos.y]){
		return 1;
	}
		
	return Collision.PosMap(pos,map,act.type || 'npc');
};



Collision.loop = function(){
	if(Loop.interval(25)) Collision.loop.mapMod();
}

Collision.loop.mapMod = function(){
	Collision.mapMod = {};
	for(var i in List.actor){
		var act = List.actor[i];
		if(!act || !act.block) continue;
		
		var size = act.block.size;
		var pos = Collision.getPos(act);
			
		for(var j = size[0]; j <= size[1]; j++){
			for(var k = size[2]; k <= size[3]; k++){
				Collision.mapMod[act.map + '-' + (pos.x+j) + '-' + (pos.y+k)] = 1;
			}
		}
	}
}

Collision.mapMod = {};	//all bullets share the same mapMod


