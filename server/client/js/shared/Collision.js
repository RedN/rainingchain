Collision = {};

/*
rect: [minx,maxx,miny, maxy]
pt: {x:12.3,y:13.23}	//real position
pos: {x:1,y:23}			//grid position
*/


Collision.RectRect = function(rect1,rect2){
	//Test Collision between rect and rect. format: rect1:[minx,maxx,miny,maxy],rect2:[minx,maxx,miny,maxy]
	return (rect1[0] <= rect2[1] &&	rect2[0] <= rect1[1] &&	rect1[2] <= rect2[3] &&	rect2[2] <= rect1[3]);
}

Collision.PtRect = function(pt,rect){
	//Test Collision between point and rect. format: pt:{x:1,y:1},rect:[minx,maxx,miny,maxy]
	return (pt.x >= rect[0] && pt.x <= rect[1] && pt.y >= rect[2] && pt.y <= rect[3])
}


Collision.PosMap = function(pos,map,type){
	//Test Collision between pt and map
	if(!map) console.log(map,pos);
	var grid = Db.map[Map.getModel(map)].grid[type];
	return !grid[pos.y] || !+grid[pos.y][pos.x];		//return 1 if collision
}

Collision.ActorMap = function(pos,map,player){
	if(player.ghost) return 0;

	if(player.mapMod && player.mapMod[pos.x + '-' + pos.y]){
		return player.mapMod[pos.x + '-' + pos.y];
	}
	return Collision.PosMap(pos,map,player.type || 'enemy');
};

Collision.getSquareValue = function(pos,map,type){
	var grid = Db.map[Map.getModel(map)].grid[type];
	if(!grid[pos.y]) return null;
	return grid[pos.y][pos.x];		//return if in a falling zone
}


Collision.getHitBox = function(player){
	return [player.x + player.hitBox[2].x,player.x + player.hitBox[0].x,player.y + player.hitBox[3].y,player.y + player.hitBox[1].y];
}

Collision.getBumperBox = function(player){
	return [player.x + player.bumperBox[2].x,player.x + player.bumperBox[0].x,player.y + player.bumperBox[3].y,player.y + player.bumperBox[1].y];
}

Collision.PtRRect = function(pt,rotRect){	
	//Collision Pt and Rotated Rect
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

Collision.getMouse = function(key){
	if(server){ return {x:List.all[key].mouseX,y:List.all[key].mouseY}  }
	else{ return {x:Input.mouse.x,y:Input.mouse.y} }
}

Collision.BulletActor = function(atk){
	for(var i in atk.viewedBy){ 
		var player = List.all[i];
		if(!player) continue;	//test target exist
		if(!Combat.damageIf.global(atk,player)) continue;	//exist is same map, not himself etc
		if(!Collision.BulletActor.test(atk,player)) continue;	//exist if can attack this type of player
		if(!Collision.PtRect({'x':atk.x,'y':atk.y},Collision.getHitBox(player))) continue;	//test if nearby
		
		Combat.collision(atk,player);
	}	
}

Collision.BulletActor.test = function(atk,player){
	var normal = true;
	if(!['map','true','all'].have(atk.damageIf)){	//no testing needed
		if(['player-simple','enemy-simple'].have(atk.damageIf)){	//only testing type
			normal = Combat.damageIf.list[atk.damageIf](player);
		} else {					
			var hIf = typeof atk.damageIf == 'function' ? atk.damageIf : Combat.damageIf.list[atk.damageIf]; //testing type and summon
			normal = List.all[atk.parent] && hIf(player,List.all[atk.parent])
		}
	}
	if(player.damagedIf !== 'true'){
		if(Array.isArray(player.damagedIf)) normal = player.damagedIf.have(atk.parent);
		if(typeof player.damagedIf === 'function') normal = player.damagedIf(List.all[atk.parent]);
	}
	
	return (!atk.damageIfMod && normal) || (atk.damageIfMod && !normal); 
}




Collision.BulletMap = function(bullet){
	if(bullet.ghost) return;

	var pos = Collision.getPos(bullet);
	var str = bullet.map + '-' + pos.x + '-' + pos.y;
	if(Bullet.mapMod[str] || Collision.PosMap(pos,bullet.map,'bullet'))
		bullet.toRemove = 1;
	
}

Collision.StrikeActor = function(atk){
	for(var j in atk.viewedBy){	//could be optimized with other function and return;
		var player = List.all[j];
		if(!player) continue;	//test target exist
		if(!Combat.damageIf.global(atk,player)) continue;	
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
	for(var i = 0 ; i < atk.point.length; i++){
		if(Collision.PtRect(atk.point[i],Collision.getHitBox(player))) return true;
	}
		
	return false;
}



Collision.distancePtPt = function(pt1,pt2){
	return Math.sqrt(Math.pow(pt1.x - pt2.x,2) + Math.pow(pt1.y - pt2.y,2));
}

Collision.anglePtPt = function(pt1,pt2){
	return atan2(pt2.y-pt1.y,pt2.x-pt1.x);
}

Collision.getPos = function(pt){
	return {x:Math.floor(pt.x/32),y:Math.floor(pt.y/32)}
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


Collision.StrikeMap = function(strike,target){	//gets farthest position with no collision
	var end = Collision.getPos(target);
	var path = Collision.getPath(Collision.getPos(strike),end);
	
	for(var i in path){
		if(Collision.PosMap(path[i],strike.map,'bullet')) return path[i];	
	}

	return end;
}


