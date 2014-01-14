Collision = {};

//Test Collision between rect and rect. format: rect1:[minx,maxx,miny,maxy],rect2:[minx,maxx,miny,maxy]
Collision.RectRect = function(rect1,rect2){
	return (rect1[0] <= rect2[1] &&	rect2[0] <= rect1[1] &&	rect1[2] <= rect2[3] &&	rect2[2] <= rect1[3]);
}

//Test Collision between point and rect. format: pt:{x:1,y:1},rect:[minx,maxx,miny,maxy]
Collision.PtRect = function(pt,rect){
	return (pt.x >= rect[0] && pt.x <= rect[1] && pt.y >= rect[2] && pt.y <= rect[3])
}

//Test Collision between pt and map (can also test with player map mod)
Collision.PtMap = function(pt,map,player){
	var gridX = Math.floor(pt.x/32);
	var gridY = Math.floor(pt.y/32);
	
	if(player && player.mapMod && player.mapMod[map] && player.mapMod[map][gridX + '-' + gridY]){
		return player.mapMod[map][gridX + '-' + gridY];
	}
	
	if(Db.map[map].grid[gridY] === undefined){ return  1;	} 
	else if(Db.map[map].grid[gridY][gridX] === undefined){return  1;} 
	else {return Number(Db.map[map].grid[gridY][gridX]);}
	return 1;
}

Collision.getHitBox = function(player){
	return [player.x + player.hitBox[2].x,player.x + player.hitBox[0].x,player.y + player.hitBox[3].y,player.y + player.hitBox[1].y];
}

Collision.getBumperBox = function(player){
	return [player.x + player.bumperBox[2].x,player.x + player.bumperBox[0].x,player.y + player.bumperBox[3].y,player.y + player.bumperBox[1].y];
}

//Collision Pt and Rotated Rect
Collision.PtRRect = function(pt,rotRect){	
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



//Attack Coll
Collision.BulletMortal = function(atk){
	for(var i in atk.viewedBy){ 
		var player = List.all[i];
		if(Combat.hitIf.global(atk,player)){
			var hIf = typeof atk.hitIf == 'function' ? atk.hitIf : Combat.hitIf.list[atk.hitIf];
			if(!player || !List.all[atk.parent]){ return; }
			
			var a = hIf(player,List.all[atk.parent]);
			if((!atk.hitIfMod && a) || (atk.hitIfMod && !a)){
				if(Collision.PtRect({'x':atk.x,'y':atk.y},Collision.getHitBox(player))){
					Combat.collision(atk,player);
				}
			}
		}
	}	
}

//Collision Bullet and Map
Collision.BulletMap = function(bullet){
	if(Collision.PtMap({x:bullet.x,y:bullet.y},bullet.map,bullet)){
		bullet.toRemove = 1;
	}
}



Collision.StrikeMortal = function(atk){
	for(var j in atk.viewedBy){
		var player = List.all[j];
		
		if(Combat.hitIf.global(atk,player)){
		
		//Test if can hit that target
		var hIf = typeof atk.hitIf == 'function' ? atk.hitIf : Combat.hitIf.list[atk.hitIf];
		var a = hIf(player,List.all[atk.parent]);
		if((!atk.hitIfMod && a) || (atk.hitIfMod && !a)){

			//Test Center First with Rot Rect
			var bol = Collision.PtRRect({'x':player.x,'y':player.y},[atk.point[2],atk.point[8],atk.point[0],atk.point[6]]);	
			
			//Test 9 Pts
			if(!bol){	for(var i = 0 ; i < atk.point.length; i++){
				if(Collision.PtRect(atk.point[i],Collision.getHitBox(player))){ bol = true; break;}
			}}
			
			//If touched
			if(bol){
				Combat.collision(atk,player);
				atk.maxHit--;
			}
			if(atk.maxHit <=0){	break;	}
			
		}}
	}
}

