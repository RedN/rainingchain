var old = {'fl':'','quest':'','abilityShowed':'bulletMulti','abilityTypeShowed':'attack','abilitySub':''};
var key = 1;

Draw = {
	'window':{},
	'anim':{},
	'entity':{},
	'map':{},
	'minimap':{},
	'popup':{},
	'loop':{},
	'context':{},
	'tab':{},
};


//Drawing Loop
Draw.loop = function (key){
	if(server){
		//Clear
		List.main[key].btnList = [];
		
		//Draw	
		Draw.entity.drop(key);
		Draw.entity.mortal(key);
		
		if(List.main[key].dialogue && List.main[key].dialogue.option){ Draw.chat(key); }
		
		Draw.optionList(key);
		
		Button.context(key);
	}
	if(!server){
		//Clear
		for(var i in ctxList){ctxList[i].clearRect(0, 0, WIDTH, HEIGHT);}
		for(var i = 0 ; i < drawHtmlDiv.length; i++){ drawHtmlDiv[i].style.visibility = 'hidden';}
		btnList = [];
		Input.event.mouse.drag.update();
		
		//Draw
		Draw.map('b');   //below player
		Draw.anim('b');  //below player
		Draw.entity.drop();
		Draw.entity.mortal();  		
		Draw.entity.bullet();
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
	ctx = ctxList.stage;
	
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
				WIDTH2+anim.x-player.x-sizeX/2*size,HEIGHT2+anim.y-player.y-sizeY/2*size,
				sizeX*size,sizeY*size
				);
		}
	}
}



//{Draw Entity
Draw.entity.mortal = function (key){
	if(server){
		for(var i in List.all[key].activeList){
			var mort = List.mortal[i];
			if(mort && !mort.dead && i !== key && mort.hitBox){
				var player = List.mortal[key];
				
				var x = WIDTH2 + mort.x - player.x;
				var y = HEIGHT2 + mort.y - player.y;
				
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
		var array = Draw.entity.mortal.sort();
		for(var i = 0 ; i < array.length ; i ++){
			var mort = array[i];
			Draw.entity.sprite(mort);
			if(mort.combat) Draw.entity.mortal.hpBar(mort); 
			if(mort.chatHead) Draw.entity.mortal.chatHead(mort); 
		}
	}
}	
	
Draw.entity.mortal.sort = function(){
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

Draw.entity.mortal.chatHead = function(mort){
	ctx = ctxList.stage;
	
	var spriteServer = mort.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	
	var numX = WIDTH2+mort.x-player.x;
	var numY = HEIGHT2+mort.y-player.y - 35 + spriteFromDb.hpBar*sizeMod;;
	
	ctx.fillStyle="yellow";
	ctx.textAlign = 'center';
	ctx.fillText(mort.chatHead.text,numX,numY);
	ctx.textAlign = 'left';
	ctx.fillStyle="black";
	Loop.update.chatHead(mort);	
}		

Draw.entity.mortal.hpBar = function(mort){
	ctx = ctxList.stage;
	
	var spriteServer = mort.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var animFromDb = spriteFromDb.anim[spriteServer.anim];

	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	var numX = WIDTH2+mort.x-player.x-50;
	var numY = HEIGHT2+mort.y-player.y + spriteFromDb.hpBar*sizeMod;

	if(mort.type == 'enemy'){ ctx.fillStyle="red"; }
	if(mort.type == 'player'){ ctx.fillStyle="green"; }

	ctx.fillRect(numX,numY,Math.max(mort.hp/mort.resource.hp.max*100,0),5);
	ctx.globalAlpha=1;
	ctx.strokeStyle="black";
	ctx.strokeRect(numX,numY,100,5);
	ctx.fillStyle="black";
}

Draw.entity.bullet = function(){
	for(var i in List.bullet){
		Draw.entity.sprite(List.bullet[i]);
	}
}

Draw.entity.sprite = function (mort){
	ctx = ctxList.stage;
	
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
		WIDTH2-animFromDb.sizeX/2*sizeMod + mort.x-player.x,
		HEIGHT2-animFromDb.sizeY/2*sizeMod + mort.y-player.y,
		animFromDb.sizeX * sizeMod,
		animFromDb.sizeY * sizeMod);
	
}

Draw.entity.drop = function(key){
	if(server){
		for(var i in List.drop){
			var drop = List.drop[i];
			var numX = WIDTH2 + drop.x - List.mortal[key].x;
			var numY = HEIGHT2 + drop.y - List.mortal[key].y;
			
			Button.creation(key,{
			"rect":[numX,numX+32,numY,numY+32],
			"left":{"func":'Mortal.pickDrop',"param":[i]},
			'right':{'func':'Mortal.rightClickDrop','param':[[drop.x,drop.x+32,drop.y,drop.y+32]]},
			'text':'Pick ' + Db.item[drop.item].name,
			});	
		
		}
	}
	
	if(!server){
		ctx = ctxList.stage;
		
		for(var i in List.drop){
			var drop = List.drop[i];
					
			var numX = WIDTH2 + drop.x - player.x;
			var numY = HEIGHT2 + drop.y - player.y;
			
			Draw.item(drop.item,[numX,numY]);
		}
	}
}
//}


//{Upper Interface
Draw.minimap = function (){ ctxrestore();
	ctx = ctxList.stage;
	var map = List.map[player.map];
	var mapX = Math.min(map.img.b.length-1,Math.max(0,Math.floor((player.x-1024)/2048)));
	var mapY = Math.min(map.img.b[mapX].length-1,Math.max(0,Math.floor((player.y-1024)/2048)));
	var mapXY = map.img.b[mapX][mapY];
	var pX = player.x-mapX*2048;
	var pY = player.y-mapY*2048;
	
	
	var sx = WIDTH - WIDTH/main.pref.mapRatio;
	var sy = 0;
	var w = WIDTH/main.pref.mapRatio;
	var h = HEIGHT/main.pref.mapRatio;
	
	var mapZoomFact = main.pref.mapZoom/100;
	
	var mapCst = main.pref.mapRatio*mapZoomFact;
	
	var numX = (pX - WIDTH/2 * mapZoomFact)/2;
	var numY = (pY - HEIGHT/2 * mapZoomFact)/2;
	var longueur = WIDTH* mapZoomFact/2;
	var hauteur = HEIGHT* mapZoomFact/2;
	var diffX = numX + longueur - mapXY.width;
	var diffY = numY + hauteur - mapXY.height;
	var startX = Math.max(numX,0);
	var startY = Math.max(numY,0);
	var endX = Math.min(numX + longueur,mapXY.width)
	var endY = Math.min(numY + hauteur,mapXY.height)
	var tailleX = Math.min(endX-startX,mapXY.width);
	var tailleY = Math.min(endY-startY,mapXY.height);
	
	//Box
	ctx.fillStyle = "black";
	ctx.fillRect(sx,sy,WIDTH/main.pref.mapRatio,HEIGHT/main.pref.mapRatio);
	
	ctx.drawImage(mapXY, startX,startY,tailleX,tailleY,sx+(startX-numX)/mapCst*2,sy + (startY-numY)/mapCst*2,tailleX/mapCst*2,tailleY/mapCst*2);
	
	Draw.icon('system.square',[sx + WIDTH/main.pref.mapRatio/2-2,sy + HEIGHT/main.pref.mapRatio/2-2],4);
	
	
	ctx.strokeRect(sx,sy,WIDTH/main.pref.mapRatio,HEIGHT/main.pref.mapRatio);
	
	var disX = 50;
	var disY = 22;
	var numX = sx+w-disX;
	var numY = sy+h-disY;
	ctx.fillRect(numX,numY,disX,disY);
	ctx.fillStyle = "white";
	ctx.fillText(main.pref.mapZoom + '%',numX,numY);
	
	//client button
	Button.creation(0,{
		"rect":[numX,numX+disX,numY,numY+disY],
		"left":{"func":(function(){ Input.add('$pref,mapZoom,'); }),"param":[]},
		"text":'Change Map Zoom.'
		});	
	Draw.minimap.icon();
}

Draw.minimap.icon = function(){
	var zoom = main.pref.mapZoom/100;
	var ratio = main.pref.mapRatio;
	
	var sx = WIDTH - WIDTH/main.pref.mapRatio;
	var sy = 0;
	var w = WIDTH/main.pref.mapRatio;
	var h = HEIGHT/main.pref.mapRatio;
	
	
	for(var i in List.mortal){
		var m = List.mortal[i];
		if(m.minimapIcon){
			var vx = m.x - player.x;
			var vy = m.y - player.y;
			
			var cx = sx + WIDTH/ratio/2; //center
			var cy = sy + HEIGHT/ratio/2;
			Draw.icon(m.minimapIcon,[cx+vx/zoom/ratio-9,cy+vy/zoom/ratio-9],18);
		}
	}

}

Draw.resource = function (){ ctxrestore();
	ctx = ctxList.stage;
	
	var h = 30; 
	var sx = WIDTH-WIDTH/4;
	var sy = HEIGHT/main.pref.mapRatio;
	var w = WIDTH/4;
	
	ctx.fillStyle = 'grey';
	ctx.globalAlpha = 0.5;
	ctx.roundRect(sx,sy,w,h*4.4,1,1,5);
	ctx.globalAlpha = 1;
		
	var array = ['hp','mana','fury'];
	for(var i in array){
		Draw.resource.bar(sx,sy,w,h,array[i]);
		sy += h + 3;
	}
	
	Draw.resource.ability(sx,sy,w,h);
}

Draw.resource.bar = function(numX,numY,w,h,name){	ctxrestore();
	ctx = ctxList.stage;
	ctx.fillStyle = 'white';
	ctx.font = '25px Fixedsys';
	ctx.fillText(name.capitalize(),numX+10,numY);
	ctx.fillStyle = 'black';
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
	ctx = ctxList.stage;
	for(var i in player.ability){
		if(!player.ability[i]) continue;
		var numX = sx + 25 + (+i * (h + 10));
		var numY = sy;
		Draw.icon(player.ability[i].icon,[numX,numY],h);
	}
}

Draw.context = function (){ ctxrestore();
	ctx = ctxList.stage;
	
	var numX = 0;
	var numY = 0;
	
	var cont = main.context.text || main.clientContext.text || main.permContext.text;
	
	if(cont){
		ctx.font="25px Fixedsys";
		
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
	ctx = ctxList.stage;
	var map = List.map[player.map];
	var mapX = Math.min(map.img[layer].length-1,Math.max(0,Math.floor((player.x-1024)/2048)));
	var mapY = Math.min(map.img[layer][mapX].length-1,Math.max(0,Math.floor((player.y-1024)/2048)));
	var mapXY = map.img[layer][mapX][mapY];
	var pX = player.x-mapX*2048;
	var pY = player.y-mapY*2048;
	
	var numX = (pX - WIDTH/2)/2 ;
	var numY = (pY - HEIGHT/2) /2 ;
	var longueur = WIDTH/2;
	var hauteur = HEIGHT/2;
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






//Popup
Draw.popup = function(){
	if(main.popupList.equip){Draw.popup.equip();}
}

Draw.popup.equip = function(){ ctxrestore();
	if(server) return;
	
	var w = 250;
	var h = 250;
	var pop = main.popupList.equip;
	ctx = ctxList.win;
	
	if(typeof pop === 'object'){
		var id = pop.id;
		var posx = pop.x;
		var posy = pop.y;
	} else {
		var id = pop;
		var posx = mouse.x;
		var posy = mouse.y;
	}
	
	var equip = Db.equip[id];
	if(equip === undefined){queryDb('equip',id); return; }
	if(equip === 0){return;} //waiting for query answer
	
	var sx = Math.max(0,Math.min(posx-w,WIDTH-w));
	var sy = Math.max(0,Math.min(posy-h,HEIGHT - h));	
	
	//Frame
	ctx.globalAlpha = 0.9;
	ctx.fillStyle = "#696969";
	ctx.strokeStyle="black";
	ctx.drawRect(sx,sy,w,h);
	ctx.globalAlpha = 1;
	
	
	//Draw icon
	Draw.icon(equip.visual,[sx+2,sy+2],48);
	
	//Draw Name
	ctx.font="25px Fixedsys";
	ctx.fillStyle = equip.color;
	ctx.textAlign = 'center';
	ctx.fillTextU(equip.name,sx + 150,sy);
	ctx.textAlign = 'left';
	ctx.fillStyle = 'white';
	
	ctx.font="15px Fixedsys";
	var string = 'Lv:' + equip.lvl + '  Orb: +' + round(equip.orb.upgrade.bonus*100-100,2) + '% | ' + equip.orb.upgrade.amount;
	ctx.fillText(string,sx+50+5,sy+28);
	
	//Draw Def/Dmg
	var num = equip.dmgMain; var bar = 'dmgRatio';
	if(equip.category === 'armor'){ var num = equip.defMain; var bar = 'def';}
	ctx.font="25px Fixedsys";
	ctx.textAlign = 'center';
	ctx.fillText(round(num,0),sx+25,sy+50);
	Draw.element(sx+52,sy+50,190,25,equip[bar]);
	
	
	//Separation
	ctx.beginPath();
	ctx.moveTo(sx,sy+80);
	ctx.lineTo(sx+w,sy+80);
	ctx.stroke();
	
	//Boost
	ctx.font="20px Fixedsys";
	ctx.textAlign = 'left';
	var numY = sy+80;
	var sum = 0;
	for(var i in equip.boost){
		var boost = equip.boost[i];
		var info = Draw.convert.boost(boost);
		ctx.fillText('-' + info[0],sx+10,numY+sum*20);
		ctx.fillText(info[1],sx+10+150,numY+sum*20);
		sum++;
		
	}
}

openPopup = function(key,name,id){
	var player = List.all[key];
	if(name === 'equip'){
		List.main[key].popupList.equip = {'x':player.mouseX,'y':player.mouseY,'id':id};
	}	
}

//Option
Draw.optionList = function(key){ ctxrestore();
	if(server){ var opt = List.main[key].optionList; } 
		else { var opt = main.optionList; }
	if(!opt) return;
	ctx = ctxList.pop;
	
	//Draw Item Options
	var option = opt.option;
	var name = opt.name;
	var sx = opt.x-60;
	var sy = opt.y;
	
	var nameX = 5;
	var nameY = 20;
	var optionX = 7;
	var optionY = 25;

	var w = 120;
	var h = nameY + optionY*option.length
	
	sx = Math.min(sx,WIDTH - w);
	sx = Math.max(sx,0);
	sy = Math.min(sy,HEIGHT - h);
	sy = Math.max(sy,0);
	
	
	if(server){
		for(var i = 0 ; i < option.length ; i++){
			//var name = parseOptionName(option[i].name); //bug cuz would need to use List.main[key].pref
			name = option[i].name;
			
			Button.creation(key,{
				"rect":[sx,sx+w,sy+nameY+optionY*i,sy+nameY+optionY*(i+1)],
				"left":option[i],
				"text":name,			
			});
		}
	}
	
	if(!server){
		ctx.textAlign = 'left';
		
		//Name Frame;
		ctx.fillStyle = "#333333";
		ctx.fillRect(sx,sy,w,nameY);
		
		ctx.strokeStyle="black";
		ctx.strokeRect(sx,sy,w,nameY);
		
		ctx.font="15px Fixedsys";
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
		ctx.font="14px Fixedsys";
		ctx.fillStyle = "yellow";
			
		for(var i = 0 ; i < option.length ; i++){
		
			var name = parseOptionName(option[i].name);
			ctx.fillText(name,sx+optionX,sy+optionY*(i+1));
			
			if(main.optionList.client){ 
				Button.creation(0,{
					'rect':[sx,sx+w,sy+nameY+optionY*i,sy+nameY+optionY*(i+1)],
					"left":option[i],
					'text':name,
					});			
			}			
		}
	}
}

parseOptionName = function(data){
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
Draw.chat = function(key){ ctxrestore();
	ctx = ctxList.stage;
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
	
	html.pm.text.style.font = s.pmcharY + 'px Fixedsys';
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
	
	html.chat.text.style.font = s.chatcharY + 'px Fixedsys';
	html.chat.text.style.width = (s.w - 2*s.divX) + 'px';
	html.chat.text.style.height = (s.h - 2*s.divY - s.personalChatY) + 'px'
	html.chat.text.style.left = s.divX + 'px'; 
	html.chat.text.style.top = s.divY + 'px'; 
	
	chatUserName.style.font = s.personalChatY + 'px Fixedsys';
	
	html.chat.input.size=(69-player.name.length).toString();
	html.chat.input.maxlength="150";	
	html.chat.input.style.font = s.personalChatY + 'px Fixedsys';
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
		ctx.font="20px Fixedsys";
		ctx.textAlign = 'center';
		ctx.fillText(dia.face.name,s.facesX+96/2,s.y+s.facesY+96+5);
		ctx.textAlign = 'left';
	} 
	
	//Options
	if(dia.option){
		ctx.font = s.optionY + 'px Fixedsys';
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
		y:HEIGHT-200,
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
	ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,xy[0],xy[1],size,size);
}

Draw.item = function(info,xy,size){
	size = size || 32;
	
	var name = typeof info === 'string' ? info : info[0];
	var amount = typeof info === 'string' ? 1 : Math.floor(info[1]);
	var slot = Img.item.index[name];
	ctx.drawImage(Img.item,slot.x,slot.y,ITEM,ITEM,xy[0],xy[1],size,size);
	
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
	
	var mx = Math.min(mouse.x,WIDTH-150);
	var my = Math.min(mouse.y,HEIGHT-25);
	
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

//Convert a boost object into a string.
Draw.convert.boost = function(boost){
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

//Convert attack mod into a string
Draw.convert.attackMod = {
	'bleed':(function(a){ return round(a.chance*100,2) + '% to Bleed for ' + round(a.magn*100*a.time,2) + '% Initial Dmg over ' + round(a.time/25,2) + 's.'; }),
	'knock':(function(a){ return round(a.chance*100,2) + '% to Knockback by ' + round(a.magn*a.time,2) + ' pixel over ' + round(a.time/25,2) + 's.'; }),	
	'drain':(function(a){ return round(a.chance*100,2) + '% to Drain ' + round(a.magn*100,2) + '% Mana.'; }),
	'burn':(function(a){ return round(a.chance*100,2) + '% to Burn for ' + round(a.magn*100*a.time,2) + '% Hp of Monster\'s Remaining Hp over ' + round(a.time/25,2) + 's.'; }),
	'chill':(function(a){ return round(a.chance*100,2) + '% to Chill, reducing Speed by -' + round(a.magn*100,2) + '% for ' + round(a.time/25,2) + 's.'; }),
	'confuse':(function(a){ return round(a.chance*100,2) + '% to Confuse for ' + round(a.time/25,2) + 's.'; }),
	'leech':(function(a){ return round(a.chance*100,2) + '% to Life Leech ' + round(a.magn*100,2) + '% Hp'; }),
	'pierce':(function(a){ return round(a.chance*100,2) + '% to Pierce, reducing this attack damage by ' + round(100-a.dmgReduc*100,2) + '% Dmg.'; }),
	'curse':(function(a){ return round(a.chance*100,2) + '% to Lower ' + Db.stat[a.boost[0].stat].name + ' by ' + round(100-a.boost[0].value*100,2) + '% for ' + round(a.boost[0].time/25,2) + 's.'; }),
	'boomerang':(function(a){ return 'Boomerang'; }),
	'nova':(function(a){ return 'Nova'; }),
	'parabole':(function(a){ return 'Parabole Bullet'; }),
	'sin':(function(a){ return 'Sin Bullet'; }),
	'onHit':(function(a){ return 'Explosive'; }),
	'hitIfMod':(function(a){ return 'Affect Allies'; }),
}





Draw.convert.elementMod = function(type,name){
	type += '-';
	var b0 = round(player.boost.list[type + name + '-x'].base,2,1);
	var b1 = round(player.boost.list[type + name + '-*'].base,2,1);
	var b2 = round(player.boost.list[type + name + '-^'].base,2,1);
	var b3 = round(player.boost.list[type + name + '-+'].base,2,1);
	var sum = round(Math.pow(player.boost.list[type + name + '-x'].base*player.boost.list[type + name + '-*'].base,player.boost.list[type + name + '-^'].base) + player.boost.list[type + name + '-+'].base,3);
	var string = '( ' + b0 + ' * ' + b1 + ' ) ^ ' + b2 + ' + ' + b3 + ' = ' + sum;
	return string
}

Draw.convert.statusMod = function(type,name){
	if(type === 'off'){
		var b0 = round(player.boost.list[name + '-chance'].base,2,1);
		var b1 = round(player.boost.list[name + '-magn'].base,2,1);
		var b2 = round(player.boost.list[name + '-time'].base,2,1);

		var string = '%: ' + b0 + ', Magn: ' + b1 + ', Time: ' + b2;
		return string
	}
	if(type === 'def'){
		var b0 = round(player.boost.list['resist-' + name].base,2,1);
		var b1 = round(player.boost.list['resistMax-' + name].base,2,1);
		
		var string = 'Resist: ' + b0 + ', Max: ' + b1;
		return string
	}
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









