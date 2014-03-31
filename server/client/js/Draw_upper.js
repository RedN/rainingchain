MAPSIZEFACT = 1;


//{State
Draw.state = function(){
	var s = Draw.state.constant();
	
	Draw.state.resource(s);
	s.y += 5;
	Draw.state.ability(s);
	s.y += 30;
	Draw.state.status(s,player.statusClient);
	s.y += 30;
	Draw.pvpScore(s);
}

Draw.state.constant = function(){
	return {
		x:0,
		y:0,
		w:200,
		h:200,	
	}
}

Draw.state.resource = function (s){ ctxrestore();
	ctx = List.ctx.stage;
		
	var array = [
		{'name':'hp','height':20,'width':s.w},
		{'name':'mana','height':10,'width':s.w},
		// {'name':'heal','height':10,'width':s.w},
		// {'name':'fury','height':10,'width':s.w},
	];
	
	for(var i in array){
		var res = array[i];
		Draw.state.resource.bar(s.x+5,s.y+5,res.width,res.height,res.name);
		
		Button.creation(0,{
			'rect':[s.x+5,s.x+5+res.width,s.y+5,s.y+5+res.height],
			'text':res.name.capitalize() + ': ' + player[res.name] + '/' + player.resource[res.name].max,
		});		
		s.y += res.height + 3;
						
	}	
}

Draw.state.resource.bar = function(numX,numY,w,h,name){	ctxrestore();
	ctx = List.ctx.stage;
	
	var ratio = Math.min(Math.max(player[name]/player.resource[name].max,0),1);
	
	ctx.fillStyle = Cst.resource.toColor[name];
	ctx.strokeStyle= "black";
	ctx.roundRect(numX,numY,w,h,false,1,4);	//empty
	ctx.roundRect(numX,numY,w*ratio,h,1,1,4);			//filled
		
	ctxrestore();
}

Draw.state.ability = function(s){ ctxrestore();
	ctx = List.ctx.stage;
	
	var size = 25;
	
	for(var i in player.ability){
		if(!player.ability[i]) continue;
		var ab =  Db.query('ability',player.ability[i]);
		if(!ab) continue;
		var numX = s.x + 10 + (+i * (size + 5));
		var numY = s.y;
		var charge = player.abilityChange.chargeClient[i];
		
		if(charge !== 1) ctx.globalAlpha = 0.5;
		var str = Input.key.ability[i][0].toString().keyCodeToName().keyFullName();
		Draw.icon(ab.icon,[numX,numY],size,str + ': ' + ab.name);
		ctx.globalAlpha = 1;
		
		if(charge !== 1){	//loading circle
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = 'red';

			ctx.beginPath();
			ctx.moveTo(numX+size/2,numY+size/2);
			ctx.arc(numX+size/2,numY+size/2,size/2,-Math.PI/2,-Math.PI/2 + charge*2*Math.PI);
			ctx.lineTo(numX+size/2,numY+size/2);
			ctx.closePath();
			ctx.fill();
			
			ctx.globalAlpha = 1;
		}
	}
}

Draw.state.status = function(s,status){ ctxrestore();
	ctx = List.ctx.stage;
	var numX = s.x+10;		
	for(var i in status){
		if(+status[i]){
			var text = status !== player.statusClient ? '' : Cst.status.list[i].capitalize();
			Draw.icon('status.' + Cst.status.list[i],[numX,s.y],24,text);
			numX += 30;			
		}
	}
}
//}

//{Pvp
Draw.pvpScore = function(s){
	var pv = main.pvpScore;
	ctx.font = '20px Kelly Slab';
	ctx.fillStyle = 'white';
	for(var i in pv){
		var str = 1+(+i) + ':  ' + pv[i].name + '  (' + pv[i].point + ')';
		var numX = s.x+10;	
		var numY = s.y + 22*i;
		ctx.fillText(str,numX,numY);
	}	
	//main.pvpScore = [{name:'asdasd','point':123},{name:'asdasd','point':123}]
}

//}

//{Minimap
Draw.minimap = function (){ ctxrestore();
	ctx = List.ctx.minimap;
	Draw.minimap.map();
	
}

	
Draw.minimap.map = function(){
	var x = -(player.x)/16 + Cst.WIDTH2/main.pref.mapRatio;	
	var y = -(player.y)/16 + Cst.HEIGHT2/main.pref.mapRatio;	
	var im = Db.map[player.map].img.m;
	
	List.ctx.minimap.drawImage(Db.map[player.map].img.m, x,y);
	List.ctx.minimap.fillRect(1280/2/main.pref.mapRatio-2,720/2/main.pref.mapRatio-2,4,4);
	return;
	
	/* WORKING better!!!! 
	var zoom = main.pref.mapZoom/100;
	var SIZEFACT = Draw.map.cst.sizeFact / zoom;		//2 => tree appear x2 bigger ingame than on the image
	
	var map = Db.map[player.map];
	
	var IMAGERATIO = Draw.map.cst.imageRatio;
	var imageWidth = Cst.WIDTH / IMAGERATIO;
	var imageHeight = Cst.HEIGHT / IMAGERATIO;
	var mapAmount = 10;
	
	var startX = (player.x-Cst.WIDTH/2*zoom)/Draw.map.cst.sizeFact;		//top right of screen in map ratio
	var startY = (player.y-Cst.HEIGHT/2*zoom)/Draw.map.cst.sizeFact;
	
	var offsetX = -(startX % imageWidth);				//offset where we need to draw first map
	var offsetY = -(startY % imageHeight);
	
	if(startX < 0) offsetX -= imageWidth;		//if negative, fucks the modulo
	if(startY < 0) offsetY -= imageHeight;
			
	for(var i = 0; i < mapAmount; i++){
		for(var j = 0; j < mapAmount; j++){
			var mapX = Math.floor(startX/320) + i;
			var mapY = Math.floor(startY/180) + j;
			if(!map.img[layer][mapX] || !map.img[layer][mapX][mapY]) continue;
			var mapXY = map.img[layer][mapX][mapY];
			
			ctx.drawImage(mapXY, 
				0,
				0,
				320,
				180,
				(offsetX + 320*i)*SIZEFACT/main.pref.mapRatio,
				(offsetY + 180*j)*SIZEFACT/main.pref.mapRatio,
				320*SIZEFACT/main.pref.mapRatio,
				180*SIZEFACT/main.pref.mapRatio
			);
		}
	}
	ctx.fillRect(1280/2-50, 720/2-50, 100, 100);
	*/
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/* WORKING basic!!!!
	return;
	var zoom = main.pref.mapZoom/100;
	var SIZEFACT = Draw.map.cst.sizeFact / zoom;		//2 => tree appear x2 bigger ingame than on the image
	
	var map = Db.map[player.map];
	
	var IMAGERATIO = Draw.map.cst.imageRatio;
	var imageWidth = Cst.WIDTH / IMAGERATIO;
	var imageHeight = Cst.HEIGHT / IMAGERATIO;
	var mapAmount = 10;
	
	var startX = (player.x-Cst.WIDTH/2*zoom)/Draw.map.cst.sizeFact;		//top right of screen in map ratio
	var startY = (player.y-Cst.HEIGHT/2*zoom)/Draw.map.cst.sizeFact;
	
	var offsetX = -(startX % imageWidth);				//offset where we need to draw first map
	var offsetY = -(startY % imageHeight);
	
	if(startX < 0) offsetX -= imageWidth;		//if negative, fucks the modulo
	if(startY < 0) offsetY -= imageHeight;
	
	if(SHOW) console.log(startX,startY);
			
	for(var i = 0; i < mapAmount; i++){
		for(var j = 0; j < mapAmount; j++){
			var mapX = Math.floor(startX/320) + i;
			var mapY = Math.floor(startY/180) + j;
			if(!map.img[layer][mapX] || !map.img[layer][mapX][mapY]) continue;
			var mapXY = map.img[layer][mapX][mapY];
			
			ctx.drawImage(mapXY, 0,0,320,180,(offsetX + 320*i)*SIZEFACT ,(offsetY + 180*j)*SIZEFACT,320*SIZEFACT,180*SIZEFACT);
		}
	}
	ctx.fillRect(1280/2-50, 720/2-50, 100, 100);
	 */
}

Draw.minimap.map.updateSize = function(){
	$("#minimapCanvas").css({
		left:Cst.WIDTH-Cst.WIDTH/main.pref.mapRatio,
		width:Cst.WIDTH/main.pref.mapRatio,
		height:Cst.HEIGHT/main.pref.mapRatio,
	});
	$("#minimapCanvas")[0].width = Cst.WIDTH/main.pref.mapRatio;
	$("#minimapCanvas")[0].height = Cst.HEIGHT/main.pref.mapRatio;
	
}

Draw.minimap.icon = function(s){	//creates lag? TOFIX
	return;
	var zoom = main.pref.mapZoom/100;
	var ratio = main.pref.mapRatio;

	for(var i in List.actor){
		var m = List.actor[i];
		if(m.minimapIcon){
			var vx = m.x - player.x;
			var vy = m.y - player.y;
			
			var cx = s.x + Cst.WIDTH/ratio/2; //center
			var cy = s.y + Cst.HEIGHT/ratio/2;
			var size = 36/zoom;
			
			var numX = cx+vx/zoom/ratio-size/2;
			var numY = cy+vy/zoom/ratio-size/2;
		
			if(Collision.PtRect({x:numX+size/2,y:numY+size/2},[s.x,s.x+Cst.WIDTH/main.pref.mapRatio,s.y,s.y+Cst.HEIGHT/main.pref.mapRatio])){
				Draw.icon(m.minimapIcon,[numX,numY],size);
			}
		}
	}
	//Draw.icon('system.square',[s.x + Cst.WIDTH/main.pref.mapRatio/2-2,s.y + Cst.HEIGHT/main.pref.mapRatio/2-2],4);
}
//}


