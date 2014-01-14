
Draw.upper = function(){
	var s = Draw.minimap.constant();
	Draw.minimap(s); //top right
	s.y += s.h;
	Draw.resource(s);    //below map (hp, mana, fury)
	s.y += 45; 
	s.x += 10; 
	Draw.status(s);

}

Draw.minimap = function (s){ ctxrestore();
	ctx = List.ctx.stage;
	Draw.minimap.box(s);
	Draw.minimap.map(s,'b');
	Draw.minimap.map(s,'i');
	Draw.minimap.icon(s);
	Draw.minimap.button(s);
}

Draw.minimap.constant = function(){
	return {
		x:Cst.WIDTH - Cst.WIDTH/main.pref.mapRatio,
		y:0,
		w:Cst.WIDTH/main.pref.mapRatio,
		h:Cst.HEIGHT/main.pref.mapRatio,
	}
}

Draw.minimap.map = function(s,layer){
	var map = Db.map[player.map];
	var mapX = Math.min(map.img[layer].length-1,Math.max(0,Math.floor((player.x-1024)/2048)));
	var mapY = Math.min(map.img[layer][mapX].length-1,Math.max(0,Math.floor((player.y-1024)/2048)));
	var mapXY = map.img[layer][mapX][mapY];
	var pX = player.x-mapX*2048;
	var pY = player.y-mapY*2048;
		
	var mapZoomFact = main.pref.mapZoom/100;
	var mapCst = main.pref.mapRatio*mapZoomFact;
	
	var numX = (pX - Cst.WIDTH/2 * mapZoomFact)/2;
	var numY = (pY - Cst.HEIGHT/2 * mapZoomFact)/2;
	var longueur = Cst.WIDTH* mapZoomFact/2;
	var hauteur = Cst.HEIGHT* mapZoomFact/2;
	var diffX = numX + longueur - mapXY.width;
	var diffY = numY + hauteur - mapXY.height;
	var startX = Math.max(numX,0);
	var startY = Math.max(numY,0);
	var endX = Math.min(numX + longueur,mapXY.width)
	var endY = Math.min(numY + hauteur,mapXY.height)
	var tailleX = Math.min(endX-startX,mapXY.width);
	var tailleY = Math.min(endY-startY,mapXY.height);
	
	if(layer === 'i') ctx.globalAlpha = main.pref.mapIconAlpha/100;
	ctx.drawImage(mapXY, startX,startY,tailleX,tailleY,s.x+(startX-numX)/mapCst*2,s.y + (startY-numY)/mapCst*2,tailleX/mapCst*2,tailleY/mapCst*2);
	ctx.globalAlpha = 1;
}

Draw.minimap.box = function(s){
	ctx.fillStyle = "black";
	ctx.fillRect(s.x,s.y,Cst.WIDTH/main.pref.mapRatio,Cst.HEIGHT/main.pref.mapRatio);
	ctx.strokeRect(s.x,s.y,Cst.WIDTH/main.pref.mapRatio,Cst.HEIGHT/main.pref.mapRatio);
}

Draw.minimap.button = function(s){
	var disX = 50;
	var disY = 22;
	var numX = s.x+s.w-disX;
	var numY = s.y+s.h-disY;
	ctx.fillRect(numX,numY,disX,disY);
	ctx.fillStyle = "white";
	ctx.fillText(main.pref.mapZoom + '%',numX,numY);
	
	//client button
	Button.creation(0,{
		"rect":[numX,numX+disX,numY,numY+disY],
		"left":{"func":(function(){ Input.add('$pref,mapZoom,'); }),"param":[]},
		"text":'Change Map Zoom.'
		});	
}

Draw.minimap.icon = function(s){
	var zoom = main.pref.mapZoom/100;
	var ratio = main.pref.mapRatio;

	for(var i in List.mortal){
		var m = List.mortal[i];
		if(m.minimapIcon){
			var vx = m.x - player.x;
			var vy = m.y - player.y;
			
			var cx = s.x + Cst.WIDTH/ratio/2; //center
			var cy = s.y + Cst.HEIGHT/ratio/2;
			Draw.icon(m.minimapIcon,[cx+vx/zoom/ratio-9,cy+vy/zoom/ratio-9],36/zoom);
		}
	}
	Draw.icon('system.square',[s.x + Cst.WIDTH/main.pref.mapRatio/2-2,s.y + Cst.HEIGHT/main.pref.mapRatio/2-2],4);
}

Draw.resource = function (s){ ctxrestore();
	ctx = List.ctx.stage;
		
	Draw.resource.frame(s);
	
	var array = [
		{'name':'hp','height':30,'width':s.w},
		{'name':'heal','height':10,'width':s.w},
		{'name':'mana','height':25,'width':s.w},
		{'name':'fury','height':25,'width':s.w},
	];
	
	for(var i in array){
		var res = array[i];
		Draw.resource.bar(s.x,s.y,res.width,res.height,res.name);
		s.y += res.height + 3;
	}
	
	
	Draw.resource.ability(s.x,s.y,s.w,s.h);
}

Draw.resource.frame = function(s){ ctxrestore();
	s.h = 30;
	
	ctx.fillStyle = 'grey';
	ctx.globalAlpha = 0.5;
	ctx.roundRect(s.x,s.y,s.w,s.h*4.6,1,1,5);
	ctx.globalAlpha = 1;
}

Draw.resource.bar = function(numX,numY,w,h,name){	ctxrestore();
	ctx = List.ctx.stage;
	if(h >= 20){
		ctx.fillStyle = 'white';
		ctx.font = h*0.9 + 'px Monaco';
		ctx.fillText(name.capitalize(),numX+10,numY);
		ctx.fillStyle = 'black';
	}
	numX += 75;
	var ratio = Math.min(Math.max(player[name]/player.resource[name].max,0),1);
	w -= 75 + 10;
	w *= ratio;
	
	ctx.fillStyle = Cst.resource.toColor[name];
	ctx.strokeStyle= "black";
	ctx.roundRect(numX,numY,w,h,1,1,4);
		
	ctxrestore();
}

Draw.resource.ability = function(sx,sy,w,h){ ctxrestore();
	ctx = List.ctx.stage;
	for(var i in player.ability){
		if(!player.ability[i]) continue;
		var numX = sx + 25 + (+i * (h + 10));
		var numY = sy;
		var charge = player.abilityChange.chargeClient[i];
		
		if(charge !== 1) ctx.globalAlpha = 0.5;
		Draw.icon(player.ability[i].icon,[numX,numY],h);
		ctx.globalAlpha = 1;
		
		if(charge !== 1){	//loading circle
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = 'red';

			ctx.beginPath();
			ctx.moveTo(numX+h/2,numY+h/2);
			ctx.arc(numX+h/2,numY+h/2,h/2,-Math.PI/2,-Math.PI/2 + charge*2*Math.PI);
			ctx.lineTo(numX+h/2,numY+h/2);
			ctx.closePath();
			ctx.fill();
			
			ctx.globalAlpha = 1;
		}
	}
}

Draw.status = function(s){ ctxrestore();
	ctx = List.ctx.stage;
			
	for(var i in player.status){
		var status = +player.status[i];
		if(status){
			Draw.icon('status.' + Cst.status.list[i],[s.x,s.y],24);
			s.x += 30			
		}
	}
}

