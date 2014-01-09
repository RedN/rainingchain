Draw = {};
Draw.old = {'fl':'','quest':'','abilityShowed':'bulletMulti','abilityTypeShowed':'attack','abilitySub':''};

//Drawing Loop
Draw.loop = function (key){
	if(server){
		//Clear
		List.btn[key] = [];
		
		//Draw	
		Draw.drop(key);
		Draw.mortal(key);
		
		
		Button.context(key);
	}
	if(!server){
		//Clear
		for(var i in List.ctx){List.ctx[i].clearRect(0, 0, Cst.WIDTH, Cst.HEIGHT);}
		for(var i in html){ html[i].div.style.visibility = 'hidden';}
		List.btn = [];
		Input.event.mouse.drag.update();
		
		//Draw
		Draw.map('b');   //below player
		Draw.anim('b');  //below player
		Draw.drop();
		Draw.mortal();  		
		Draw.bullet();
		Draw.anim('a');  //above player
		Draw.map('a');   //above player
				
		Draw.tab();     //bottom right
		Draw.minimap(); //top right
		Draw.resource();    //below map (hp, mana, fury)
		Draw.chat();    //bottom left
	
		Draw.window();
		Draw.popup();
		
		Draw.optionList();    //option when right-click
		
		Button.context();	//update for client buttons only
		Draw.context();     //top left
		//clientContext = '';		
	}
}


//Draw Animation
Draw.anim = function (layer){
	ctx = List.ctx.stage;
	
	for(var i in List.anim){
		if(Db.anim[List.anim[i].name].layer === layer){
			
			var anim = List.anim[i];
			var animFromDb = Db.anim[anim.name];
			var image = animFromDb.img;
			var height = image.height;
			var width = image.width;
			var sizeX = image.width / animFromDb.frameX;
			var slotX = anim.slot % animFromDb.frameX;
			var slotY = Math.floor(anim.slot / animFromDb.frameX);
			var sizeY = height / Math.ceil(animFromDb.frame / animFromDb.frameX);
			var size = animFromDb.size*anim.sizeMod;
			var startY = animFromDb.startY;
					
			ctx.drawImage(image,
				sizeX*slotX,sizeY*slotY+startY,
				sizeX,sizeY,
				Cst.WIDTH2+anim.x-player.x-sizeX/2*size,Cst.HEIGHT2+anim.y-player.y-sizeY/2*size,
				sizeX*size,sizeY*size
				);
		}
	}
}



//{Draw Entity
Draw.mortal = function (key){
	if(server){
		for(var i in List.all[key].activeList){
			var mort = List.mortal[i];
			if(mort && !mort.dead && i !== key && mort.hitBox){
				var player = List.mortal[key];
				
				var x = Cst.WIDTH2 + mort.x - player.x;
				var y = Cst.HEIGHT2 + mort.y - player.y;
				
				var info = {
					"rect":Collision.getHitBox({x:x,y:y,hitBox:mort.hitBox}),
					"text":mort.context
				};
				
				if(mort.optionList){
					info['right'] = {'func':'Button.optionList','param':mort.optionList};
				}
				
				Button.creation(key,info);
			}
		}
	}	
	if(!server){
		var array = Draw.mortal.sort();
		for(var i = 0 ; i < array.length ; i ++){
			var mort = array[i];
			Draw.sprite(mort);
			if(mort.combat) Draw.mortal.hpBar(mort); 
			if(mort.chatHead) Draw.mortal.chatHead(mort); 
		}
	}
}	
	
Draw.mortal.sort = function(){
	var drawSortList = [];
	for(var i in List.mortal){
		drawSortList.push(List.mortal[i]);
	}
	drawSortList.push(player);
	drawSortList.sort(function (mort,mort1){
		var spriteFromDb = Db.sprite[mort.sprite.name];
		var sizeMod = spriteFromDb.size* mort.sprite.sizeMod;
		var y0 = mort.y + spriteFromDb.legs * sizeMod
		
		var spriteFromDb1 = Db.sprite[mort1.sprite.name];
		var sizeMod1 = spriteFromDb1.size* mort1.sprite.sizeMod;
		var y1 = mort1.y + spriteFromDb1.legs * sizeMod1
		
		return y0-y1;	
	});	
	return drawSortList;	
}

Draw.mortal.chatHead = function(mort){
	ctx = List.ctx.stage;
	
	var spriteServer = mort.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	
	var numX = Cst.WIDTH2+mort.x-player.x;
	var numY = Cst.HEIGHT2+mort.y-player.y - 35 + spriteFromDb.hpBar*sizeMod;;
	
	ctx.fillStyle="yellow";
	ctx.textAlign = 'center';
	ctx.fillText(mort.chatHead.text,numX,numY);
	ctx.textAlign = 'left';
	ctx.fillStyle="black";
}		

Draw.mortal.hpBar = function(mort){
	ctx = List.ctx.stage;
	
	var spriteServer = mort.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var animFromDb = spriteFromDb.anim[spriteServer.anim];

	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	var numX = Cst.WIDTH2+mort.x-player.x-50;
	var numY = Cst.HEIGHT2+mort.y-player.y + spriteFromDb.hpBar*sizeMod;

	if(mort.type == 'enemy'){ ctx.fillStyle="red"; }
	if(mort.type == 'player'){ ctx.fillStyle="green"; }

	ctx.fillRect(numX,numY,Math.max(mort.hp/mort.resource.hp.max*100,0),5);
	ctx.globalAlpha=1;
	ctx.strokeStyle="black";
	ctx.strokeRect(numX,numY,100,5);
	ctx.fillStyle="black";
}

Draw.bullet = function(){
	for(var i in List.bullet){
		Draw.sprite(List.bullet[i]);
	}
}

Draw.sprite = function (mort){
	ctx = List.ctx.stage;
	
	var spriteServer = mort.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var image = spriteFromDb.img;
	var animFromDb = spriteFromDb.anim[spriteServer.anim];
	
	if(mort.type == 'bullet' && animFromDb == 'Attack') animFromDb = 'Travel';	//quick fix
	
	var sideAngle = Math.round(mort.angle/(360/animFromDb.dir)) % animFromDb.dir;
	
	var startX = spriteServer.startX * animFromDb.sizeX;
	var startY = animFromDb.startY + spriteFromDb.side[sideAngle] * animFromDb.sizeY;
	
	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
		
	ctx.drawImage(image, 
		startX,
		startY,
		animFromDb.sizeX,
		animFromDb.sizeY,
		Cst.WIDTH2-animFromDb.sizeX/2*sizeMod + mort.x-player.x,
		Cst.HEIGHT2-animFromDb.sizeY/2*sizeMod + mort.y-player.y,
		animFromDb.sizeX * sizeMod,
		animFromDb.sizeY * sizeMod);
	
}

Draw.drop = function(key){
	if(server){
		for(var i in List.drop){
			var drop = List.drop[i];
			var numX = Cst.WIDTH2 + drop.x - List.mortal[key].x;
			var numY = Cst.HEIGHT2 + drop.y - List.mortal[key].y;
			
			Button.creation(key,{
			"rect":[numX,numX+32,numY,numY+32],
			"left":{"func":'Mortal.pickDrop',"param":[i]},
			'right':{'func':'Mortal.rightClickDrop','param':[[drop.x,drop.x+32,drop.y,drop.y+32]]},
			'text':'Pick ' + Db.item[drop.item].name,
			});	
		
		}
	}
	
	if(!server){
		ctx = List.ctx.stage;
		
		for(var i in List.drop){
			var drop = List.drop[i];
					
			var numX = Cst.WIDTH2 + drop.x - player.x;
			var numY = Cst.HEIGHT2 + drop.y - player.y;
			
			Draw.item(drop.item,[numX,numY]);
		}
	}
}
//}


//{Upper Interface
Draw.minimap = function (layer){ ctxrestore();
	ctx = List.ctx.stage;
	var s = Draw.minimap.constant();
	Draw.minimap.box(s);
	Draw.minimap.map(s,'b');
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
	
	ctx.drawImage(mapXY, startX,startY,tailleX,tailleY,s.x+(startX-numX)/mapCst*2,s.y + (startY-numY)/mapCst*2,tailleX/mapCst*2,tailleY/mapCst*2);

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
			Draw.icon(m.minimapIcon,[cx+vx/zoom/ratio-9,cy+vy/zoom/ratio-9],18);
		}
	}
	Draw.icon('system.square',[s.x + Cst.WIDTH/main.pref.mapRatio/2-2,s.y + Cst.HEIGHT/main.pref.mapRatio/2-2],4);
	
	//if(main.pref.mapIcon) Draw.minimap.map(s,'i');
}

Draw.resource = function (){ ctxrestore();
	ctx = List.ctx.stage;
	
	var h = 30; 
	var sx = Cst.WIDTH-Cst.WIDTH/4;
	var sy = Cst.HEIGHT/main.pref.mapRatio;
	var w = Cst.WIDTH/4;
	
	ctx.fillStyle = 'grey';
	ctx.globalAlpha = 0.5;
	ctx.roundRect(sx,sy,w,h*4.6,1,1,5);
	ctx.globalAlpha = 1;
		
	var array = [
		{'name':'hp','height':30,'width':w},
		{'name':'heal','height':10,'width':w},
		{'name':'mana','height':25,'width':w},
		{'name':'fury','height':25,'width':w},
	];
	
	for(var i in array){
		var res = array[i];
		Draw.resource.bar(sx,sy,res.width,res.height,res.name);
		sy += res.height + 3;
	}
	
	
	Draw.resource.ability(sx,sy,w,h);
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

Draw.context = function (){ ctxrestore();
	ctx = List.ctx.stage;
	
	var numX = 0;
	var numY = 0;
	
	var cont = main.context.text || main.clientContext.text || main.permContext.text;
	
	if(cont){
		ctx.font="25px Monaco";
		
		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'white';
		ctx.globalAlpha = 0.7;
		var length = Math.max(100,ctx.measureText(cont).width+30);
		ctx.roundRect(0,0,length,30,1,1);
		
		ctx.globalAlpha = 1;
		
		ctx.fillStyle = "white";
		ctx.fillText(cont,numX+10,numY);
	}
}
//}

//Map
Draw.map = function (layer){ ctxrestore();
	ctx = List.ctx.stage;
	var map = Db.map[player.map];
	var mapX = Math.min(map.img[layer].length-1,Math.max(0,Math.floor((player.x-1024)/2048)));
	var mapY = Math.min(map.img[layer][mapX].length-1,Math.max(0,Math.floor((player.y-1024)/2048)));
	var mapXY = map.img[layer][mapX][mapY];
	var pX = player.x-mapX*2048;
	var pY = player.y-mapY*2048;
	
	var numX = (pX - Cst.WIDTH/2)/2 ;
	var numY = (pY - Cst.HEIGHT/2) /2 ;
	var longueur = Cst.WIDTH/2;
	var hauteur = Cst.HEIGHT/2;
	var diffX = numX + longueur - mapXY.width;
	var diffY = numY + hauteur - mapXY.height;
	var startX = Math.max(numX,0);
	var startY = Math.max(numY,0);
	var endX = Math.min(numX + longueur,mapXY.width)
	var endY = Math.min(numY + hauteur,mapXY.height)
	var tailleX = Math.min(endX-startX,mapXY.width);
	var tailleY = Math.min(endY-startY,mapXY.height);
	
	ctx.drawImage(mapXY, startX,startY,tailleX,tailleY,(startX-numX)*2,(startY-numY)*2,tailleX*2,tailleY*2);	
}






//Option
Draw.optionList = function(){ ctxrestore();
	if(!main.optionList) return;
	ctx = List.ctx.pop;
	
	//Draw Item Options
	var option = main.optionList.option;
	var name = main.optionList.name;
	var sx = main.optionList.x-60;
	var sy = main.optionList.y;
	
	var nameX = 5;
	var nameY = 20;
	var optionX = 7;
	var optionY = 25;

	var w = 120;
	var h = nameY + optionY*option.length
	
	sx = Math.min(sx,Cst.WIDTH - w);
	sx = Math.max(sx,0);
	sy = Math.min(sy,Cst.HEIGHT - h);
	sy = Math.max(sy,0);
	
	

	ctx.textAlign = 'left';
	
	//Name Frame;
	ctx.fillStyle = "#333333";
	ctx.fillRect(sx,sy,w,nameY);
	
	ctx.strokeStyle="black";
	ctx.strokeRect(sx,sy,w,nameY);
	
	ctx.font="15px Monaco";
	ctx.fillStyle = "white";
	ctx.fillText(name,sx+nameX,sy);
		
		
	//Option Frame
	ctx.globalAlpha = 0.9;
	ctx.fillStyle = "#696969";
	ctx.fillRect(sx,sy+nameY,w,optionY*option.length);
	ctx.globalAlpha = 1;
	
	ctx.strokeStyle="black";
	ctx.strokeRect(sx,sy+nameY,w,optionY*option.length);


	//Text + Button
	ctx.font="14px Monaco";
	ctx.fillStyle = "yellow";
		
	for(var i = 0 ; i < option.length ; i++){
	
		var name = Draw.optionList.parse(option[i].name);
		ctx.fillText(name,sx+optionX,sy+optionY*(i+1));
		
		if(main.optionList.client){ 
			Button.creation(0,{
				'rect':[sx,sx+w,sy+nameY+optionY*i,sy+nameY+optionY*(i+1)],
				"left":option[i],
				'text':name,
				});			
		}else {
			Button.creation(0,{
				'rect':[sx,sx+w,sy+nameY+optionY*i,sy+nameY+optionY*(i+1)],
				"left":{'func':Chat.send.command,'param':['$option,' + i]},
				'text':name,
				});			
		}
	}
	
}

Draw.optionList.parse = function(data){
	if(data.indexOf('\{') == -1) return data; 
	for(var i = 0 ; i < data.length ; i++){
		if(data[i] == '{' && data[i+1] == '{'){
			var start = i;
			for(var j = start; j < data.length ; j++){
				if(data[j] == '}' && data[j+1] == '}'){
					var end = j+1;
					var tag = data.slice(start+2,end-1);
					
					if(tag.length > 100)  return data;
					data = data.replaceAll(
					'\\{\\{' + tag + '\\}\\}',
					eval(tag)
					);
					break;
				}
			}
		}
	}
	return data;
}

//Chat
Draw.chat = function(){ ctxrestore();
	ctx = List.ctx.stage;
	Draw.chat.main();
	
	if(main.dialogue){
		Draw.chat.dialogue();
	} else {
		var s = Draw.chat.constant();
		html.chat.div.style.visibility = "visible";
		ctx.beginPath();
		ctx.moveTo(s.x,s.y+s.h-s.personalChatY-3);
		ctx.lineTo(s.w,s.y+s.h-s.personalChatY-3);
		ctx.stroke();	
	}
}

Draw.chat.main = function(){
	var s = Draw.chat.constant();
	
	//PM
	html.pm.div.style.visibility = 'visible';
	html.pm.div.style.left = (s.x + s.divX) + 'px'; 
	html.pm.div.style.top = (s.y + s.divY - s.pmY - s.pmDivY - s.disPmY) + 'px'; 
	
	html.pm.text.style.font = s.pmcharY + 'px Monaco';
	html.pm.text.style.width = (s.w - 2*s.divX) + 'px';
	html.pm.text.style.height = (s.pmY) + 'px'
	html.pm.text.style.left = s.divX + 'px'; 
	html.pm.text.style.top = (s.divY- s.pmY - s.pmDivY - s.disPmY) + 'px'; 
	
	//Clan
	var str = 'Clan: ';
	for(var i in main.social.list.clan){ str += main.social.list.clan[i] + '  '; }
	ctx.font = '15px Monaco';
	ctx.fillStyle = 'white';
	ctx.fillText(str,(s.x + s.divX),(s.y - s.disPmY));
	
	
	//HTML
	html.chat.div.style.left = (s.x + s.divX) + 'px'; 
	html.chat.div.style.top = (s.y + s.divY) + 'px'; 
	
	html.chat.text.style.font = s.chatcharY + 'px Monaco';
	html.chat.text.style.width = (s.w - 2*s.divX) + 'px';
	html.chat.text.style.height = (s.h - 2*s.divY - s.personalChatY) + 'px'
	html.chat.text.style.left = s.divX + 'px'; 
	html.chat.text.style.top = s.divY + 'px'; 
	
	chatUserName.style.font = s.personalChatY + 'px Monaco';
	
	html.chat.input.size=(69-player.name.length).toString();
	html.chat.input.maxlength="150";	
	html.chat.input.style.font = s.personalChatY + 'px Monaco';
	html.chat.input.style.height = s.personalChatY + 'px'
		
	html.dialogue.div.style.width = (s.w - 2*s.divX) + 'px';
	html.dialogue.div.style.height = (s.h - 2*s.divY) + 'px'
	html.dialogue.div.style.left = (s.x + s.divX) + 'px'; 
	html.dialogue.div.style.top = (s.y + s.divY + s.dialogueTopDiffY) + 'px'; 
	
	//MainBox
	ctx.globalAlpha = 0.8;
	ctx.fillStyle="#F5DEB3";
	ctx.fillRect(s.x,s.y,s.w,s.h);
	ctx.globalAlpha = 1;
	ctx.strokeStyle="black";
	ctx.strokeRect(s.x,s.y,s.w,s.h);
	ctx.fillStyle="black";

}

Draw.chat.dialogue = function(){
	var s = Draw.chat.constant();
	var dia = main.dialogue;
	
	if(dia.face){	s.numX += s.faceX;} 
	if(dia.option){ var nY = s.y+s.h-10-dia.option.length*20; }	
			
	html.dialogue.div.style.visibility = "visible";
	html.dialogue.text.style.width = s.w - 2*s.textBorder + 'px';
	html.dialogue.text.innerHTML = dia.text;		
	
	if(dia.face){
		html.dialogue.text.style.width = s.w - 2*s.textBorder-s.faceX + 'px';
		html.dialogue.div.style.left = (s.x + s.divX + s.textBorder + s.faceX) + 'px';
		ctx.drawImage(Img.face,0,0,96,96,s.facesX,s.y+s.facesY,96,96);
		ctx.font="20px Monaco";
		ctx.textAlign = 'center';
		ctx.fillText(dia.face.name,s.facesX+96/2,s.y+s.facesY+96+5);
		ctx.textAlign = 'left';
	} 
	
	//Options
	if(dia.option){
		ctx.font = s.optionY + 'px Monaco';
		for(var i in dia.option){
			ctx.fillText('-' + dia.option[i].text,s.numX,nY+i*s.optionY);
			
			Button.creation(0,{
				"rect":[s.numX,s.numX+s.h,nY+i*s.optionY,nY+s.optionY+i*s.optionY],
				"left":{"func":Chat.send.command,"param":['$dia,option,' + i]},
				"text":dia.option[i].text
			});	
			
		}
	}
}

Draw.chat.constant = function(){
	return  {
		w:600,
		h:200,
		x:0,
		y:Cst.HEIGHT-200,
		numX:5,			//border for text
		faceX:96 + 5,	//push dia text by that if has face
		facesX:8,		//border for face	
		facesY:30,		//border for face
		optionY:20,		//Y between options
		textBorder:20, //distance between border of box and where text starts, applied to start and end
		personalChatY:20, //size for player own written stuff (chatBox not dialogue)
		
		dialogueTopDiffY:10,
		
		chatcharY:20, 
		
		divX:5,
		divY:5,
		
		//pm
		pmY:200,
		disPmY:20, //distance between botoom of pm and top of chat
		pmcharY:20,
		pmDivY:5,
	}
}

Draw.icon = function(info,xy,size){
	size = size || 32;
	var slot = Img.icon.index[info];
	ctx.drawImage(Img.icon,slot.x,slot.y,Cst.ICON,Cst.ICON,xy[0],xy[1],size,size);
}

Draw.item = function(info,xy,size){
	size = size || 32;
	
	var name = typeof info === 'string' ? info : info[0];
	var amount = typeof info === 'string' ? 1 : Math.floor(info[1]);
	var slot = Img.item.index[name];
	ctx.drawImage(Img.item,slot.x,slot.y,Cst.ITEM,Cst.ITEM,xy[0],xy[1],size,size);
	
	if(amount > 1){
		if(amount >= 100000){
			amount = Math.floor(amount/1000);
			if(amount >= 10000){
				amount = Math.floor(amount/1000);
				amount = amount + "M";} 
			else { amount = amount + "K";}
		}
			
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = "black";
		ctx.strokeStyle = "white";
		ctx.roundRect(xy[0]-2,xy[1]+size-9,size+4,15);
		ctx.globalAlpha = 1;
		
				
		ctx.fillStyle = "yellow";
		ctx.font= size/32*13 + "px Monaco";
		ctx.fillText(amount,xy[0],xy[1]+size-9);
	}
	
}

Draw.element = function(x,y,w,h,data,noover){
	var xx = x;
	ctx.save();
	ctx.textAlign = 'left';
	ctx.strokeRect(x,y,w,h);
	var total = 0; for(var i in data){	total += data[i]; }
	
	console.log(x,y,w,h,data);
	
	var mx = Math.min(Input.mouse.x,Cst.WIDTH-150);
	var my = Math.min(Input.mouse.y,Cst.HEIGHT-25);
	
	for(var i in data){
		var length = w*data[i]/total;
		
		if(length > 2){
			ctx.fillStyle = Cst.element.toColor[i];
			ctx.roundRect(x,y,length,h);
		}
		if(Collision.PtRect(Collision.getMouse(),[x,x+length,y,y+h])){
			var mouseOverRatio = i; 
		}
		x += length;
	}
	
	ctx.lineWidth = 2;
	ctx.roundRect(xx,y,w,h,0,1);
	ctx.lineWidth = 1;
	
	if(!noover && mouseOverRatio){
		var amount = data[mouseOverRatio];
		if(amount < 1){ amount = round(data[mouseOverRatio]*100,0) + '%' }
		else { amount = round(data[mouseOverRatio],0) }
		
		var text = mouseOverRatio.capitalize() + ': ' + amount;
		var width = ctx.measureText(text).width;
		ctx.fillStyle = Cst.element.toColor[mouseOverRatio];
		ctx.roundRect(mx,my-30,width+10,30);
		ctx.fillStyle = 'black';
		ctx.fillText(text,mx+5,my+3-30);
	}
	ctx.restore();
}

Draw.convert = {};

Draw.convert.boost = function(boost){
	//Convert a boost object into a string.
	if(boost.type === 'custom'){ return Db.customBoost[boost.value].name; }

	var name = Db.stat[boost.stat].name;
	
	//Round and add %
	var value = boost.value;
	var rawValue = boost.value;
	if(Math.abs(value) < 1){ 
		value *= 100; value = round(value,2).toString() + '%';
	} else { value = round(value,2)};
	
	
	var last = name[name.length-1];
	if(last == 'x' ||  last == '*' || last == '+' || last == '^'){
		if(rawValue < 0){value = '-' + last + value;}
		if(rawValue > 0){value = last + value;}
		name = name.slice(0,-1);
	} else {
		if(value < 0){value = '-' + value;}
		if(value > 0){value = '+' + value;}
	}
	
	return [name,value];
	 
	/*
	if(boost.type == 'base'){	}
	else if(boost.type == 'max'){
		return '-Set Max ' + prename + ' to ' + value;
	} else if(boost.type == 'min'){
		return '-Set Min ' + prename + ' to ' + value;
	}
	*/
}

Draw.gradientRG = function(n){
	n = Math.min(1,Math.max(0,n));
	if(n<0.5){
		var R = 0+(n*(255/0.5));
		var G = 255;
		var B = 0;
	} else {
		var n = n-0.5;
		var R = 255;
		var G = 255-(n*(255/0.5));
		var B = 0;
	} 
	return 'rgb(' + Math.round(R) + ',' + Math.round(G) + ',' + Math.round(B) + ')';
}









