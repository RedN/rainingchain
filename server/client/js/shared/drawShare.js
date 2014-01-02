var old = {'fl':'','quest':'','abilityShowed':'bulletMulti','abilityTypeShowed':'attack','abilitySub':''};

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
		
		Draw.tab(key);
		Draw.window(key);
		Draw.popup(key);
		
		if(List.main[key].optionList){ Draw.optionList(key); }
		
		Button.context(key);
	}
	if(!server){
		//Clear
		for(var i in ctxList){ctxList[i].clearRect(0, 0, WIDTH, HEIGHT);}
		for(var i = 0 ; i < drawHtmlDiv.length; i++){ drawHtmlDiv[i].style.visibility = 'hidden';}
		drawSortList = [];
		btnList = [];
		Input.event.mouse.drag.update();
		
		//Draw
		Draw.map('b');   //below player
		Draw.anim('b');  //below player
		Draw.entity.drop();
		
		setSortList();  //sort actors by their y
		drawSort();     //then draw them
		
		Draw.entity.bullet();
		
		Draw.anim('a');  //above player
		Draw.map('a');   //above player
		
		for(var i in List.mortal){
			if(List.mortal[i].chatHead){ Draw.entity.mortal.chatHead(List.mortal[i]); } //draw text over head
		}
		if(player.chatHead){ Draw.entity.mortal.chatHead(player); }
		
		Draw.tab();     //bottom right
		Draw.minimap(); //top right
		Draw.resource();    //below map (hp, mana, fury)
		Draw.chat();    //bottom left
	
		Draw.window();
		Draw.popup();
		
		if(optionList){ Draw.optionList(); }    //option when right-click
		
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
			var mort = List.all[i];
			if(mort && !mort.dead && i != key && mort.hitBox){
				var player = List.mortal[key];
				
				var x = WIDTH2 + mort.x - player.x;
				var y = HEIGHT2 + mort.y - player.y;
				var maxX = x + mort.hitBox[0].x ;
				var maxY = y + mort.hitBox[1].y ;
				var minX = x + mort.hitBox[2].x ;
				var minY = y + mort.hitBox[3].y ;
				
				var info = {
					"rect":[minX,maxX,minY,maxY],
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
		var mort = key;
		Draw.entity.sprite(mort);
		if(mort.combat){ Draw.entity.mortal.hpBar(mort); }
	}
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
	updateChatHead(mort);	
}		

//Draw Hp bar above head
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
			
			var numX = WIDTH2 + List.drop[i].x - List.mortal[key].x;
			var numY = HEIGHT2 + List.drop[i].y - List.mortal[key].y;
			
			Button.creation(key,{
			"rect":[numX,numX+32,numY,numY+32],
			"left":{"func":pickDrop,"param":[i]},
			'right':{'func':rightClickDrop,'param':[[List.drop[i].x,List.drop[i].x+32,List.drop[i].y,List.drop[i].y+32]]},
			'text':'Pick ' + Db.item[List.drop[i].item].name,
			
			});	
		
		}
	}
	
	if(!server){
		ctx = ctxList.stage;
		
		for(var i in List.drop){
			var drop = List.drop[i];
					
			var numX = WIDTH2 + drop.x - player.x;
			var numY = HEIGHT2 + drop.y - player.y;
			
			drawItem(drop.item,[numX,numY]);
		
			
			//ctx.drawImage(Img.item,slot.x,slot.y,ITEM,ITEM,numX,numY,32,32);	
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
	
	
	var sx = WIDTH - WIDTH/pref.mapRatio;
	var sy = 0;
	var w = WIDTH/pref.mapRatio;
	var h = HEIGHT/pref.mapRatio;
	
	var mapZoomFact = pref.mapZoom/100;
	
	var mapCst = pref.mapRatio*mapZoomFact;
	
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
	ctx.fillRect(sx,sy,WIDTH/pref.mapRatio,HEIGHT/pref.mapRatio);
	
	ctx.drawImage(mapXY, startX,startY,tailleX,tailleY,sx+(startX-numX)/mapCst*2,sy + (startY-numY)/mapCst*2,tailleX/mapCst*2,tailleY/mapCst*2);
	
	ctx.drawImage(Img.icon,iconIndex['system.square'].x,iconIndex['system.square'].y,ICON,ICON,sx + WIDTH/pref.mapRatio/2-2,sy + HEIGHT/pref.mapRatio/2-2,4,4);
	
	ctx.strokeRect(sx,sy,WIDTH/pref.mapRatio,HEIGHT/pref.mapRatio);
	
	var disX = 50;
	var disY = 22;
	var numX = sx+w-disX;
	var numY = sy+h-disY;
	ctx.fillRect(numX,numY,disX,disY);
	ctx.fillStyle = "white";
	ctx.fillText(pref.mapZoom + '%',numX,numY);
	
	//client button
	Button.creation(0,{
		"rect":[numX,numX+disX,numY,numY+disY],
		"left":{"func":(function(){ addInput('$pref,mapZoom,'); }),"param":[]},
		"text":'Change Map Zoom.'
		});	
	Draw.minimap.icon();
}

Draw.minimap.icon = function(){
	var zoom = pref.mapZoom/100;
	var ratio = pref.mapRatio;
	
	var sx = WIDTH - WIDTH/pref.mapRatio;
	var sy = 0;
	var w = WIDTH/pref.mapRatio;
	var h = HEIGHT/pref.mapRatio;
	
	
	for(var i in List.mortal){
		var m = List.mortal[i];
		if(m.minimapIcon){
			var vx = m.x - player.x;
			var vy = m.y - player.y;
			
			var slot = iconIndex[m.minimapIcon];
			
			var cx = sx + WIDTH/ratio/2; //center
			var cy = sy + HEIGHT/ratio/2;
			
			ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,cx+vx/zoom/ratio-9,cy+vy/zoom/ratio-9,18,18);
			
		}
	}

}

Draw.resource = function (){ ctxrestore();
	ctx = ctxList.stage;
	
	var h = 30; 
	var sx = WIDTH-WIDTH/4;
	var sy = HEIGHT/pref.mapRatio;
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
	
	var size = h;
	for(var i in player.ability){
		if(!player.ability[i]) continue;
		var numX = sx + 25 + (+i * (size + 10));
		var numY = sy;
		var slot = iconIndex[player.ability[i].icon];
		ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX,numY,size,size);
	}
}

Draw.context = function (){ ctxrestore();
	ctx = ctxList.stage;
	
	var numX = 0;
	var numY = 0;
	
	var cont = context.text || clientContext.text || permContext.text;
	
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


//Draw Objects
setSortList = function(){
	for(var i in List.mortal){
		drawSortList.push(List.mortal[i]);
	}
	drawSortList.push(player);
	drawSortList.sort(sortFunction);	
}

sortFunction = function (mort,mort1){
	var spriteServer = mort.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	var y0 = mort.y + spriteFromDb.legs * sizeMod
	
	var spriteServer1 = mort1.sprite;
	var spriteFromDb1 = Db.sprite[spriteServer1.name];
	var sizeMod1 = spriteFromDb1.size* spriteServer1.sizeMod;
	var y1 = mort1.y + spriteFromDb1.legs * sizeMod1
	
	return y0-y1	
}

drawSort = function (){ ctxrestore();
	for(var i = 0 ; i < drawSortList.length ; i ++){
		Draw.entity.mortal(drawSortList[i]);
	}
}


//{Tab	
Draw.tab = function(key){ ctxrestore();
	if(server){ var tab = List.main[key].currentTab; } 
		else { var tab = currentTab; }
	
	Draw.tab[tab](key);
}

Draw.tab.main = function (key){ ctxrestore();
	var s = Draw.tab.main.constant(); var oh = s.oh; var oy = s.oy; var sx = s.x; var sy = s.y; var w = s.w; var h = s.h; var mx = s.mx; var my = s.my;
	if(server) return s;
	ctx = ctxList.stage;
	
	//Main Frame
	ctx.globalAlpha = 0.8;
	ctx.fillStyle = '#6D6968';
	ctx.fillRect(sx,oy,w,oh);
	
	ctx.globalAlpha = 1;
	ctx.strokeStyle = 'black';
	ctx.strokeRect(sx,oy,w,oh);
	
	ctx.beginPath();
	ctx.moveTo(sx,sy);
	ctx.lineTo(sx+w,sy);
	ctx.stroke();	
	
	
	for(var i = 0 ; i < Cst.tab.list.length ; i++){
		var vx = 30;
		var vy = 0;
		var numX = sx + 15 + vx * (i%100)  
		var numY = oy + 8  + vy * Math.floor(i/100)
		
		Button.creation(key,{
			"rect":[numX,numX+24,numY,numY+24],
			"left":{"func":Chat.send.command,"param":['$tab,open,' + Cst.tab.list[i]]},
			'text':Cst.tab.list[i].capitalize(),
			'help':Cst.tab.list[i].capitalize(),
		});	
		
		ctx.drawImage(Img.icon,i*ICON,iconIndex['TAB'],ICON,ICON,numX,numY,24,24);
		if(currentTab === Cst.tab.list[i]){ctx.strokeRect(numX-1,numY-1,24+1,24+1);}
		
	}
	ctxrestore();
	return s;
}

Draw.tab.main.constant = function(){
	var sizeX = 200;
	var sizeY = 300;
	var startX = WIDTH-sizeX;
	var startY = HEIGHT-sizeY;
	
	var dy = 40;
	var s = {'oh':sizeY,'oy':startY,'x':startX,'y':startY+dy,'w':sizeX,'h':sizeY-dy,'mx':(startX+sizeX)/2};
	return s;
}
		
Draw.tab.inventory = function (key){ ctxrestore();
	var s = Draw.tab.main(key);	var sx = s.x; var sy = s.y; var w = s.w; var h = s.h; var mx = s.mx; var my = s.my;
	ctx = ctxList.stage;
	
	if(server){ return; }
	
	//Draw Items
	for (i = 0 ; i < invList.length ; i++){
		if(invList[i]){
			var amountX = 4;
			var numX = sx + 20 + 42*(i%amountX);
			var numY = sy + 15 + 41 * Math.floor(i/amountX);
			
			var text = !(temp.selectInv && temp.reset && temp.reset.selectInv) ? 'Use ' + invList[i][0] : temp.selectInv.name + ' on ' + invList[i][0];
			
			Button.creation(key,{
				"rect":[numX,numX+32,numY,numY+32],
				"left":{"func":Chat.send.command,"param":['$tab,inv,click,left,' + i]},
				"right":{"func":Chat.send.command,"param":['$tab,inv,click,right,' + i]},
				"shiftLeft":{"func":Chat.send.command,"param":['$tab,inv,click,shiftLeft,' + i]},
				"text":text
			});	
			
			drawItem(invList[i],[numX,numY]);
		}
	}		
}

Draw.tab.equip = function (key){ ctxrestore();
	var s = Draw.tab.main(key);	var sx = s.x; var sy = s.y; var w = s.w; var h = s.h; var mx = s.mx; var my = s.my;
	ctx = ctxList.stage;
	
	//Weapon
	if(!server && typeof popupList.weapon !== 'object') popupList.weapon = 0;
	for (var i = 0 ; i < Cst.equip.weapon.piece.length ; i++){
		var numX = sx + 10;
		var numY = sy + 7 + 5 + 45 * i;
				
		if(server){	
			Button.creation(key,{
				"rect":[numX,numX+40,numY,numY+40],
				"left":{"func":Mortal.swapWeapon,"param":[Cst.equip.weapon.piece[i]]},
				"text":'Swap Weapon'
			});
		}
		
		if(!server){
			var piece = Cst.equip.weapon.piece[i];
			if(player.weapon.piece != Cst.equip.weapon.piece[i]){ ctx.globalAlpha = 0.5; } 
			
			var slot = iconIndex[player.weaponList[Cst.equip.weapon.piece[i]].visual];
			ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX,numY,40,40);
			ctx.globalAlpha = 1;
			
			if(Collision.PtRect(Collision.getMouse(key),[numX,numX+40,numY,numY+40])){
				popupList.weapon = player.weaponList[Cst.equip.weapon.piece[i]].id;
			}
		}

			
	}
	
	//Armor
	if(!server && typeof popupList.armor !== 'object') popupList.armor = 0;
	for (i = 0 ; i < Cst.equip.armor.piece.length ; i++){
		var numX = sx + 55 + 45*(i%3);
		var numY = sy + 7 + 5 + 45 * Math.floor(i/3);
		
		if(server){	
			/*
			Button.creation(key,{
				"rect":[numX,numX+40,numY,numY+40],
				//"left":{"func":openPopup,"param":['armor',List.all[key].armor.piece[Cst.equip.armor.piece[i]]]},
				"text":'Swap Armor'
				});
			*/
		}
		
		if(!server){
			var piece = player.armor.piece[Cst.equip.armor.piece[i]];
			
			var slot = iconIndex[piece.visual];
			ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX+10,numY,40,40);
			
			if(Collision.PtRect(Collision.getMouse(key),[numX,numX+40,numY,numY+40])){
				popupList.armor = piece.id;
			}
		}
	}
	
	
	
	
	//AdvancedWindow
	var numX = sx + 10;
	var numY = sy + 150;
	var vy = 25;
	
	if(server){
		Button.creation(key,{
			"rect":[numX,numX+80+vy,numY,numY+20],
			"left":{"func":openWindow,"param":['offensive']},
			"text":'Open Offensive Window'
			});
		numY += vy;
		Button.creation(key,{
			"rect":[numX,numX+80+vy,numY,numY+20],
			"left":{"func":openWindow,"param":['defensive']},
			"text":'Open Defensive Window'
			});
		numY += vy;
		Button.creation(key,{
			"rect":[numX,numX+80+vy,numY,numY+20],
			"left":{"func":openWindow,"param":['ability']},
			"text":'Open Ability Window'
			});
		numY += vy;
		Button.creation(key,{
			"rect":[numX,numX+80+vy,numY,numY+20],
			"left":{"func":openWindow,"param":['passive']},
			"text":'Open Passive Window'
			});
	}
	
	if(!server){
		ctx.fillStyle = 'white';
		ctx.font = '18px Fixedsys';
		
		var slot = iconIndex['offensive.melee'];
		ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX,numY,20,20);
		ctx.fillText('Offensive',numX+vy,numY);
		
		numY += vy;
		
		var slot = iconIndex['body.metal'];
		ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX,numY,20,20);
		ctx.fillText('Defensive',numX+vy,numY);	

		numY += vy;
		
		var slot = iconIndex['offensive.magic'];
		ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX,numY,20,20);
		ctx.fillText('Ability',numX+vy,numY);		

		numY += vy;
		
		var slot = iconIndex['offensive.magic'];
		ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX,numY,20,20);
		ctx.fillText('Passive',numX+vy,numY);			
	}
	
}
		
Draw.tab.skill = function(key){ ctxrestore();
	var s = Draw.tab.main(key);	var sx = s.x; var sy = s.y; var w = s.w; var h = s.h; var mx = s.mx; var my = s.my;
	ctx = ctxList.stage;
	
	if(server){ var exp = List.all[key].exp; var lvl = List.all[key].lvl; } 
		else { var exp = player.exp; var lvl = player.lvl;	}
	
	
	for (var i = 0 ; i < Cst.skill.list.length ; i++){
		var vx = 100;
		var vy = 28;
		var numX = sx + 18 + vx*Math.floor(i/9);
		var numY = sy + 5  + vy *(i%9);
			
		if(!server){
			ctx.fillStyle = 'white';
			
			var slot = iconIndex['skill.' + Cst.skill.list[i]];
			ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX,numY,20,20);
			ctx.fillText(lvl[Cst.skill.list[i]],numX+30,numY);
			
			if(Collision.PtRect(Collision.getMouse(key),[numX,numX+vx,numY,numY+vy])){
				var mouseover = Cst.skill.list[i];
			}
			
		}
	}
	if(!server && mouseover){
		var sk = mouseover;
			
		var vvx = 200;
		var vvy = 100;
		var ssx = mouse.x - vvx;
		var ssy = mouse.y - vvy;
		
		//Frame
		ctx.fillStyle = 'grey';
		ctx.fillRect(ssx,ssy,vvx,vvy);
		ctx.strokeStyle = 'black';
		ctx.strokeRect(ssx,ssy,vvx,vvy);
		ctx.fillStyle = 'white';
		
		//Info
		var slot = iconIndex['skill.' + sk];
		var lvl = player.skill.lvl[sk];
		var exp = player.skill.exp[sk];
		var expMod = player.bonus.exp[sk];
		expMod = expMod == 1 ? '' : '  *' + round(expMod,2)
		
		ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,ssx+5,ssy+1,20,20);
		ctx.fillTextU(sk.capitalize(),ssx + 5 + 30,ssy+1);
		ctx.fillText('Level: ' + lvl,ssx + 5,ssy+1+25*1);
		ctx.fillText('Exp: ' + exp +  expMod,ssx + 5,ssy+1+25*2);
		
		if(lvl < Cst.exp.list.length){
			var expNext = Cst.exp.list[lvl+1]-exp;
			ctx.fillText('Next: ' + expNext,ssx + 5,ssy+1+25*3);
		}		
	}
}	

Draw.tab.friend = function(key){ ctxrestore();
	var s = Draw.tab.main(key);	var sx = s.x; var sy = s.y; var w = s.w; var h = s.h; var mx = s.mx; var my = s.my;
	ctx = ctxList.stage;
	
	if(server){  return } 
	
	var list = friendList;
	var count = 0;
	var hf = html.friendTab;
	
	var divX = 5;
	var divY = 5;
	var numX = sx + divX;
	var numY = sy + divY;
	var charY = 22;
	var iconY = 40;
	
	hf.div.style.visibility = 'visible';
	hf.div.style.left = numX + 'px'; 
	hf.div.style.top = numY + 'px'; 
	
	
	hf.text.style.font = charY + 'px Fixedsys';
	hf.text.style.width = (w - 2*divX) + 'px'
	hf.text.style.height = (h - iconY- 2*divY) + 'px'
	
	if(stringify(old.fc) != stringify(list)){
		old.fc = list;
		
		hf.text.innerHTML = '<span style="color:white">' + '----Friend List----' + '</span>';
		
		for(var i in list){
			var color = '#FF4D49';
			var str = i + ' : ' + list[i].nick + '  |  '+ list[i].comment;
			var str2 = '$fl,offlinepm,' + i + ',';
			
			if(list[i].online){ color = '#00FF00'; str2 = '@' + i + ','; }

			hf.text.innerHTML += 
			'<br><span ' + 
			'class="shadow" ' + 
			'style="color:' + color + '" ' +
			'onclick="addInput(\'' + str2 + '\')' + '" ' + 
			'oncontextmenu="rightClickFriend(\'' + i + '\')' + '" ' + 
			'onmouseover="permContext.text = \'' + str + '\';' + '" ' + 
			'onmouseout="permContext.text = null;' + '" ' + 
			'>' + i + 
			'</span>';
			
		}
	}

	var divX = 25;
	var divY = 5;
	var numX = sx + divX; 
	var numY = sy + h - iconY + divY;	
	var vx = 40;
	var count = 0;
	//
	//1
	ctx.drawImage(Img.icon,count*ICON,iconIndex['FRIEND'],ICON,ICON,numX,numY,20,20);
		
	Button.creation(0,{
			"rect":[numX,numX+20,numY,numY+20],
			//'left':{'func':(function(){ addInput('$fl,add,');  }), 'param':[]},
			"text":'Check Friend List.'
			});	
	
	//2
	count++;
	numX += vx;
	ctx.drawImage(Img.icon,count*ICON,iconIndex['FRIEND'],ICON,ICON,numX,numY,20,20);
	Button.creation(0,{
			"rect":[numX,numX+20,numY,numY+20],
			//'left':{'func':(function(){ addInput('$fl,add,');  }), 'param':[]},
			"text":'Check Mute List.'
			});
	//3
	count++;
	numX += vx;
	ctx.drawImage(Img.icon,count*ICON,iconIndex['FRIEND'],ICON,ICON,numX,numY,20,20);
	Button.creation(0,{
			"rect":[numX,numX+20,numY,numY+20],
			'left':{'func':(function(){ addInput('$fl,add,');  }), 'param':[]},
			"text":'Add a friend.'
			});
	//4
	count++;
	numX += vx;
	ctx.drawImage(Img.icon,count*ICON,iconIndex['FRIEND'],ICON,ICON,numX,numY,20,20);
	Button.creation(0,{
			"rect":[numX,numX+20,numY,numY+20],
			'left':{'func':(function(){ addInput('$fl,remove,');  }), 'param':[]},
			"text":'Remove a friend.'
			});
			
				



}

Draw.tab.quest = function(key){ ctxrestore();
	var s = Draw.tab.main(key);	var sx = s.x; var sy = s.y; var w = s.w; var h = s.h; var mx = s.mx; var my = s.my;
	ctx = ctxList.stage;
	
	if(server){  return; }
		
	var count = 0;
	
	var divX = 10;
	var divX = 5;
	var numX = sx + divX;
	var numY = sy + divX;
	var charY = 15;
	var iconY = 40;
	
	html.questTab.div.style.left = numX + 'px'; 
	html.questTab.div.style.top = numY + 'px'; 
	html.questTab.div.style.visibility = 'visible';
	
	html.questTab.text.style.font = charY + 'px Fixedsys';
	html.questTab.text.style.width = (w - 2*divX) + 'px'
	html.questTab.text.style.height = (h - iconY- 2*divX) + 'px'
	
	if(old.quest !== stringify(quest)){
		old.quest = stringify(quest);
		
		html.questTab.text.innerHTML = '<span style="color:white">' + '----Quest List----' + '</span>';
		
		for(var i in quest){
			var q = quest[i];
			var qdb = Db.quest[i];
			
			var color = q.complete ? 'green' : (q.started ? 'yellow' : 'red');
			
			
			html.questTab.text.innerHTML += 
			'<br><span ' + 
			'class="shadow" ' + 
			'style="color:' + color + '" ' +
			'onclick="Chat.send.command(\'' + '$win,open,quest,' + i + '\')' + '" ' + 
			'onmouseover="permContext.text = \'' + qdb.name + '\';' + '" ' + 
			'onmouseout="permContext.text = null;' + '" ' + 
			'>' + qdb.name + 
			'</span>';
			
		}
	}
}

Draw.tab.setting = function(key){ 
}
//}

	
//{Window
Draw.window = function(key){ ctxrestore();
	if(server){ var win = List.main[key].windowList; } 
		else { var win = windowList; }
	
	if(win.bank){Draw.window.bank(key);}
	if(win.shop){Draw.window.shop(key);}	
	if(win.trade){Draw.window.trade(key);}
	if(win.offensive){Draw.window.offensive(key);}
	if(win.defensive){Draw.window.defensive(key);}
	if(win.ability){Draw.window.ability(key);}
	if(win.passive){Draw.window.passive(key);}
	if(win.quest){Draw.window.quest(key);}
}

Draw.window.main = function(key,title){ ctxrestore();	
	ctx = ctxList.win;
	var s = Draw.window.main.constant(); var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	
	//Close
	if(!server){
		var hw = html.win;
		var t = hw.title;
		var titlesize = 40;
		hw.div.style.visibility = 'visible';
		hw.div.style.left = sx + 'px'; 
		hw.div.style.top = sy + 'px'; 
	
		//Frame
		ctx.globalAlpha = 0.95;
		ctx.drawImage(Img.frame.window,0,0,Img.frame.window.width,Img.frame.window.height,sx-30,sy-25,w+75,h+25);
		ctx.globalAlpha = 1;
		
		//Title
		t.style.textAlign = 'center';
		t.style.textDecoration = 'underline';
		t.style.width = w + 'px';
		t.style.height = titlesize + 'px';
		t.style.font = titlesize + 'px Fixedsys';
		
		if(typeof title === 'string'){ t.innerHTML = title; } else {
			t.style.textDecoration = 'none';
			var str = '';
			for(var i in title){
				str += 
				'<span ' + 
				'style="text-decoration:' + (title[i] ? 'underline' : 'none') + '" ' +
				'onclick="Chat.send.command(\'' + '$win,open,' + i + '\')' + '" ' + 
				'onmouseover="permContext.text = \'' + 'Open ' + i.capitalize() + ' Window' + '\';' + '" ' + 
				'onmouseout="permContext.text = null;' + '" ' + 
				'>' + i.capitalize() + 
				'</span>';
				str += ' - '
			}
			str = str.slice(0,-3);
			if(old.winTitle !== str){
				old.winTitle = str
				t.innerHTML = str;
			}
		}
		
		//Close
		ctx.drawImage(Img.icon,iconIndex['system.close'].x,iconIndex['system.close'].y,ICON,ICON,sx + w -20,sy,20,20);	
		Button.creation(0,{
			"rect":[sx + w -20,sx + w,sy,sy+20],
			"left":{"func":Chat.send.command,"param":['$win,close']},
			'text':'Close'
		});
	
	}
	
	return s;
}

Draw.window.main.constant = function(){
	var startX = 20;
	var startY = 50;
	var sizeX = 1020;
	var sizeY = 576;
	var marginX = 15;
	var marginY = 60;
	var s = {
	'sx':startX,
	'sy':startY,
	'mx':marginX,
	'my':marginY,
	'zx':startX + marginX,
	'zy':startY + marginY,
	'dw':sizeX-2*marginX,
	'dh':sizeY-marginY-marginX,	//cuz marginY top is bigger cuz of title
	'mcx':startX+sizeX/2,
	'mdx':(sizeX-2*marginX)/2,
	'w':sizeX,
	'h':sizeY,
	};
	return s;
}

Draw.window.bank = function (key){ ctxrestore();
	var s = Draw.window.main(key,'Bank');	var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	ctx = ctxList.win;
	
	if(server){ return; } 

	//change amount:
		
	var numX = mx+200;
	var numY = sy+15;
	
	var prefAmount = pref.bankTransferAmount;
	var string = 'X-Amount: ' + prefAmount;
	
	ctx.font = '25px Fixedsys';
	ctx.fillText(string,numX,numY);
	Button.creation(0,{
		"rect":[numX,numX+ctx.measureText(string).width,numY,numY+25],
		"left":{"func":(function(){ addInput('$pref,bankTransferAmount,'); }),"param":[]},
		"text":'Change X-Amount.'
		});	
	
	//Draw Items
	for (var i = 0 ; i < bankList.length ; i++){
		if(!bankList[i].length) continue;
		var amountX = Math.floor(w/40)-1;
		var numX = sx + 40 + 40*(i%amountX);
		var numY = sy + 70 + 40*Math.floor(i/amountX);
		
		Button.creation(0,{
			"rect":[numX,numX+32,numY,numY+32],
			"left":{"func":Chat.send.command,"param":['$win,bank,click,left,' + i]},
			"right":{"func":Chat.send.command,"param":['$win,bank,click,right,' + i]},
			'text':'Withdraw ' + bankList[i][0]
		});	
		drawItem(bankList[i],[numX,numY]);
	}
	
	
}

Draw.window.offensive = function (key){ ctxrestore();
	Draw.window.stat(key,'offensive');	
}

Draw.window.defensive = function (key){ ctxrestore();
	Draw.window.stat(key,'defensive');	
}

Draw.window.stat = function(key,type){ ctxrestore();
	var obj = {'offensive':0,'defensive':0,'ability':0,'passive':0}; obj[type] = 1;
	var s = Draw.window.main(key,obj);	var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	ctx = ctxList.win;

	if(!server){
		ctx.font = '22px Monaco';

		//Content
		var listOperation = (type == 'offensive') ? offListOperation : defListOperation;
		for(var i = 0 ; i < listOperation.length ; i++){
			
			var info = listOperation[i];  
			
			var numX = sx + 50 + Math.floor(i/15) * 500;
			var numY = sy + 60 + 30* (i%15);
			
			var string = info.string()
			
			ctx.fillText(info.name + ':',numX,numY);
			ctx.fillText(string,numX+125,numY);
			var slot = iconIndex[info.icon];
			ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX-30,numY,20,20)
			
			if(Collision.PtRect(Collision.getMouse(key),[numX,numX+500,numY,numY+30])){
				var hover = i;
			}
		}
		
		//Bottom, custom effects
		var numX = sx + 10;
		var numY = sy + 60 + 30* 15;
		var str = 'Custom Effects: ';
		for(var i in player.boost.custom){
			str += Db.customBoost[i].name + ' - ';
		}
		str = str.slice(0,-3);
		ctx.font = '30px Fixedsys';
		ctx.fillText(str,numX,numY);
		
		
		if(hover !== undefined){ Draw.window.stat.hover(hover,type); }
		
	}
}

Draw.window.stat.hover = function(hover,type){ ctxrestore();
	var s = Draw.window.main.constant(); var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	var listOperation = (type == 'offensive') ? offListOperation : defListOperation;
	var numX = sx + 550 + Math.floor(hover/15) * -450-15;
	var numY = sy + 70;

	//Frame
	var ctx = ctxList.pop;
	ctx.drawImage(Img.frame.postit,0,0,Img.frame.postit.width,Img.frame.postit.height,numX,numY-15,400,500);
	
	
	var info = listOperation[hover];  
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.font = '25px Fixedsys';
	ctx.fillText(info.name + ':',numX + 200,numY+10);
	ctx.textAlign = 'left';
	ctx.font = '25px Fixedsys';
	var slot = iconIndex[info.icon];
	ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX+50,numY,48,48);
	ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX+400-100,numY,48,48);
	
	numY += 50;
			
	var statList = info.stat;
	
	for(var k in statList){
		var count = 0;
		for(var i in player.permBoost){	//i = source
			if(i.indexOf('Q-') === 0){ continue; } //would spam with quest reward otherwise
			for(var j in player.permBoost[i]){
				if(player.permBoost[i][j].stat === statList[k].stat){
					ctx.fillText(statList[k].name + ' : ' + i + ' => +' + round(player.permBoost[i][j].value,4,1),numX+25,numY);
					numY += 30;
					count++;
				}
			}
		}
	}
}

//{ Ability
Draw.window.ability = function (key){ ctxrestore();
	var s = Draw.window.main(key,{'offensive':0,'defensive':0,'ability':1,'passive':0});	var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	if(server){ return; }  
	ctx = ctxList.win;
	
	var ha = html.abilityWin;
	ha.div.style.visibility = 'visible';
	ha.div.style.left = mx + 'px'; 
	ha.div.style.top = my + 'px'; 
	
	var diffX = 100;
	var diffY = 120;
	Draw.window.ability.leftSide();
	Draw.window.ability.abilityList(diffX);
	Draw.window.ability.generalInfo(diffX,diffY);
	Draw.window.ability.upgrade(diffX+500,diffY+35);
	
	//Combat.action.attack
	old.abilityShowed = player.abilityList[old.abilityShowed] ? old.abilityShowed : Object.keys(player.abilityList)[0];
	if(!old.abilityShowed) return;
	
	if(player.abilityList[old.abilityShowed].action){
		Draw.window.ability.action(diffX,diffY + 120);
	}
	
}

Draw.window.ability.leftSide = function(){ ctxrestore();
	var s = Draw.window.main.constant(); var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	old.abilityShowed = player.abilityList[old.abilityShowed] ? old.abilityShowed : Object.keys(player.abilityList)[0];
	if(!old.abilityShowed) return;
	
	for(var i = 0 ; i < Input.key.ability.length ; i++){
		var numX = sx + 15;
		var numY = sy + 60 + 30 * i;
		
		ctx.font = '25px Fixedsys';
		ctx.fillText(Input.key.ability[i][0].toString().keyCodeToName(),numX,numY);
		
		if(player.ability[i]){
			var slot = iconIndex[player.ability[i].icon];
			ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX+45,numY,20,20);
			
			
		} else {
			ctx.strokeStyle = 'black';
			ctx.strokeRect(numX+45,numY,20,20);
		}	
	
		var text = '';
		if(player.ability[i]){ text = player.ability[i].name; }
		
		Button.creation(0,{
			"rect":[numX, numX+45 + 32, numY, numY + 32 ],
			"left":{"func":Chat.send.command,"param":['$win,ability,swap,' + i + ',' + old.abilityShowed]},
			'text':text + ' => ' + player.abilityList[old.abilityShowed].name
			});	
	}
}

Draw.window.ability.abilityList = function(diffX){ ctxrestore();
	var s = Draw.window.main.constant(); var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	
	mx += diffX; 
	
	var ha = html.abilityWin;
	var charY = 22;
	var ats = old.abilityTypeShowed;
	
	//Subtitle
	ha.subtitle.style.left = diffX + 'px'; 
	ha.subtitle.style.top = 0 + 'px'; 
	ha.subtitle.style.font = charY + 'px Fixedsys';
	ha.subtitle.style.width = 200 + 'px';
	ha.subtitle.style.height = charY*1.2 + 'px';
	
	var obj = {'attack':[],'blessing':[],'curse':[],'dodge':[],'heal':[],'summon':[]};
	for(var i in player.abilityList){
		obj[player.abilityList[i].type].push(player.abilityList[i]);
	}	
	
	var str = '';
	for(var j in obj){
		var numX = sx + 50;
		var numY = sy;
		
		str += 
		'<span ' + 
		'style="text-decoration:' + (j === ats ? 'underline' : 'none') + '" ' +
		'onclick="old.abilityTypeShowed = \'' + j +  '\';' + '" ' + 
		'onmouseover="permContext.text = \'' + j.capitalize() + '\';' + '" ' + 
		'onmouseout="permContext.text = null;' + '" ' + 
		'>' + j.capitalize().slice(0,1) + 
		'</span>';
		str += ' - '
	}	
	str = str.slice(0,-3);
	
	if(old.abilitySub !== str){	
		old.abilitySub = str;
		ha.subtitle.innerHTML = str;
	}
		
		
	//Drawing
	for(var j in obj[ats]){
		var numX = zx + diffX + +j%15 * 25;
		var numY = zy + charY*1.2 + Math.floor(+j/15) * 25;
				
		var slot = iconIndex[obj[ats][j].icon];
		ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX,numY,20,20);
		
		for(var i in player.abilityList){ 
			if(player.abilityList[i].id === obj[ats][j].id){
				Button.creation(0,{
					"rect":[numX, numX + 20, numY, numY + 20 ],
					"left":{"func":(function(a){ old.abilityShowed = a; }),"param":[obj[ats][j].id]},
					'text':'Select Ability: ' + obj[ats][j].name
				});	
			}
		}
	}
}

Draw.window.ability.generalInfo = function(diffX,diffY){ ctxrestore();
	var s = Draw.window.main.constant(); var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	sx += diffX;
	sy += diffY;
	zx += diffX;
	zy += diffY;
	
	//Line
	ctx.fillRect(zx-10,zy-10,dw-200,1);
	
	//Icon
	var ab = player.abilityList[old.abilityShowed];
	var icon = 100;
	var slot = iconIndex[ab.icon];
	ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,zx,zy,icon,icon);
	
	//General Info
	var gi = html.abilityWin.generalinfo;
	var charY = 20;
	gi.style.left = diffX + icon + 10 + 'px'; 
	gi.style.top = diffY + 'px'; 
	gi.style.font = charY + 'px Fixedsys';
	gi.style.width = 500 + 'px';
	gi.style.height = 100 + 'px';
	
	var	str = 
	'<span style="font:30px Fixedsys">' + ab.name + '</span>' +	
	' - Level ' + (ab.lvl || 1) + ' - ( ' + round(25/ab.period,2) + ' Cast/S ';
	if(ab.cost){
		if(ab.cost.mana){ str += ' - ' + ab.cost.mana + ' Mana'; }
		if(ab.cost.fury){ str += ' - ' + ab.cost.fury + ' Fury'; }
		if(ab.cost.hp){ str += ' - ' + ab.cost.hp + ' Life'; }
	}
	str += ' )'
	
	str += '<br><table>';
	var array = Object.keys(ab.modList);
	for(var i = 0 ; i < 6 ;i++){ array[i] = array[i] || null; }
	for(var i in array){
		var j = i % 2;
		
		if(j == 0){str += '<tr>';}
		str += '<td>';
		
		if(array[i]){
			var plus = '<span ' + 
			'onclick="Draw.window.ability.generalInfo.upMod(\'' + array[i] + '\');' + '" ' + 
			'title="Upgrade this Ability Modifier"' + 
			'>' + '+ ' + 
			'</span>';
			
			str += '<span ' +
			'title="' + abilityModDb[array[i]].info + '">' + plus + abilityModDb[array[i]].name + '</span>';
		} else { str += '+ ________________'}
		
		str += '</td>';
		if(j == 1){str += '</tr>';}
	}
	str += '</table>';
	
	if(old.abilityMod !== str){
		old.abilityMod = str;
		gi.innerHTML = str;
	}
}

Draw.window.ability.upgrade = function(diffX,diffY){
	var s = Draw.window.main.constant(); var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	sx += diffX;
	sy += diffY;
	zx += diffX;
	zy += diffY;
	
	var hu = html.abilityWin.upgrade;
	hu.style.left = diffX + 'px'; 
	hu.style.top = diffY + 'px'; 
	hu.style.width = '400px';
	hu.style.height = '400px';
	hu.style.font = 30 + 'px Fixedsys';
	
	var str = 
	'<span ' + 
	'onclick="Draw.window.ability.generalInfo.mod();' + '" ' + 
	'title="Add Ability Modifier"' + 
	'>' + 'Add Mod' + 
	'</span>';
	str +=  '<br>';
	str +=
	'<span ' + 
	'onclick="Draw.window.ability.generalInfo.upgrade();' + '" ' + 
	'title="Upgrade using Ability Upgrades"' + 
	'>' + 'Upgrade' + 
	'</span>';
	
	if(old.abilityUpgrade !== str){
		hu.innerHTML = str;
		old.abilityUpgrade = str;
	}
}	

Draw.window.ability.generalInfo.mod = function(){
	if(html.chat.input.value.indexOf('$win,ability,mod,') !== -1){
		Chat.send.command(html.chat.input.value + old.abilityShowed);
		html.chat.input.value = '';
	} else {
		Chat.add('Select an ability mod in your inventory first.');
	}
}

Draw.window.ability.generalInfo.upgrade = function(){
	var name = old.abilityShowed;
	var option = {'name':'Upgrade ' + name,'option':[],'count':1};
			
	option.option[0] = {'name':'Use 1 Orb','func':(function() { Chat.send.command('$win,ability,upgrade,' + name + ',1'); }),'param':[]};
	option.option[1] = {'name':'Use 10 Orbs','func':(function() { Chat.send.command('$win,ability,upgrade,' + name + ',10'); }),'param':[]};
	option.option[2] = {'name':'Use 100 Orbs','func':(function() { Chat.send.command('$win,ability,upgrade,' + name + ',100'); }),'param':[]};
	option.option[3] = {'name':'Use X Orbs','func':(function() { addInput('$win,ability,upgrade,' + name + ','); }),'param':[]};
	
	Button.optionList(option);
}

Draw.window.ability.generalInfo.upMod = function(mod){
	var name = old.abilityShowed;
	var option = {'name':'Upgrade Mod ' + abilityModDb[mod].name + ' of ' + name,'option':[],'count':1};
			
	option.option[0] = {'name':'Use 1 Orb','func':(function() { Chat.send.command('$win,ability,upMod,' + name + ',' + mod + ',1'); }),'param':[]};
	option.option[1] = {'name':'Use 10 Orbs','func':(function() { Chat.send.command('$win,ability,upMod,' + name + ',' + mod + ',10'); }),'param':[]};
	option.option[2] = {'name':'Use 100 Orbs','func':(function() { Chat.send.command('$win,ability,upMod,' + name + ',' + mod + ',100'); }),'param':[]};
	option.option[3] = {'name':'Use X Orbs','func':(function() { addInput('$win,ability,upMod,' + name + ',' + mod + ','); }),'param':[]};
	
	Button.optionList(option);
}

Draw.window.ability.action = function(diffX,diffY){ ctxrestore();
	var ab = player.abilityList[old.abilityShowed];
	if(ab.action[0].func === 'Combat.action.attack'){ Draw.window.ability.action.attack(diffX,diffY);}
	if(ab.action[0].func === 'Mortal.boost'){ Draw.window.ability.action.boost(diffX,diffY);}
	if(ab.action[0].func === 'Combat.action.summon'){ Draw.window.ability.action.summon(diffX,diffY);}

}

Draw.window.ability.action.attack = function(diffX,diffY){  ctxrestore();
	var s = Draw.window.main.constant(); var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	sx += diffX;
	sy += diffY;
	zx += diffX;
	zy += diffY;
	var ab = player.abilityList[old.abilityShowed];
	var atk = deepClone(ab.action[0].param.attack[0]);
	atk = Combat.action.attack.mod(player,atk);
	
	
	//General Info
	ctx.font = '25px Fixedsys';
	var dmg = round(atk.dmgMain,2);
	var str = 'Damage: ' + dmg + ' x ';
	
	var dist = ctx.length(str);
	drawElementBar(zx+dist,zy,300,25,atk.dmgRatio);
	ctx.fillText(str,zx,zy);
	str = 'x' + atk.amount + ' Bullet' + (atk.amount > 1 ? 's' : '') + ' @ ' + atk.angle + '°';
	ctx.fillText(str,zx,zy+25);
	
	//RIght
	str = 'Weapon Compability: ' + round(atk.weaponCompability,3,1);
	ctx.fillText(str,zx+500,zy);
	var dmg = 0;
	for(var i in atk.dmg){ dmg += atk.dmg[i]; }
	str = 'DPS: ' + round(dmg / ab.period * 25,1);
	ctx.fillText(str,zx+500,zy+30);
	
	//Mods
	for(var i in atk){
		if(atk[i]){
			if(Draw.convert.attackMod[i]){
				//var slot = iconIndex[modToIcon[i]];
				//ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX,numY,20,20);
				var tmp = atk[i];
				
				//Status
				if(Cst.status.list.indexOf(i) !== -1){ tmp.chance = Math.pow(pref.abilityDmgCent,1.5)*atk[i].chance*atk.dmgRatio[Cst.status.toElement[i]];}
				
				if(tmp.chance !== undefined && tmp.chance <= 0.001){ continue;}
				ctx.fillText('=> ' + Draw.convert.attackMod[i](tmp),zx+30,zy+25+30);
				zy += 25;
				
			}
		}
	}
}

Draw.window.ability.action.boost = function(diffX,diffY){  ctxrestore();
	var s = Draw.window.main.constant(); var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	sx += diffX;
	sy += diffY;
	zx += diffX;
	zy += diffY;
	var ab = player.abilityList[old.abilityShowed];
	var boost = ab.action[0].param[0];
	
	for(var i in boost){
		var slot = iconIndex[Db.stat[boost[i].stat].icon];
		ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,zx,zy,20,20);
		var str = boost[i].type + round(boost[i].value,2) + ' ' + Db.stat[boost[i].stat].name + ' for ' + round(boost[i].time/25,2) + 's.';
		ctx.fillText(str,zx+30,zy);
		zy += 30;
	}
	
}

Draw.window.ability.action.summon = function(diffX,diffY){  ctxrestore();
	var s = Draw.window.main.constant(); var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	sx += diffX;
	sy += diffY;
	zx += diffX;
	zy += diffY;
	var ab = player.abilityList[old.abilityShowed];
	var info = ab.action[0].param;
	ctx.font = '30px Fixedsys';
	
	var str = 'Summon a ' + info[1].variant + ' ' + info[1].category + ' Level ' + info[1].lvl + ' for ' + round(info[0].time/25,2) + 's. (Up to ' + info[0].maxChild + ')';
	ctx.fillText(str,zx,zy);
}

//}

Draw.window.trade = function (key){ ctxrestore();
	if(server){ var trade = List.main[key].windowList.trade; 
				var	tList = List.main[key].tradeList;  } 
		else {	var trade = windowList.trade;	
				var tList = tradeList;	}
	
	var s = Draw.window.main(key,'Trading ' + trade.trader);	var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	ctx = ctxList.win;
	
	
	//Draw Own Items
	for (var i = 0 ; i < tList.length ; i++){
		var numX = sx + 160 + 65*(i%4);
		var numY = sy + 70 + 65*Math.floor(i/4);
		
		if(server){
			Button.creation(key,{
			"rect":[numX,numX+56,numY,numY+56],
			"left":{"func":tradeLeftClick,"param":[i]},
			"right":{"func":tradeRightClick,"param":[i]},
			'text':'Withdraw ' + Db.item[tList[i][0]].name
			});	
		}
		
		if(!server){
			drawItem(tList[i],[numX,numY],56);
		}
	}	
	

	
	
	//Draw Other Items
	for (var i = 0 ; i < trade.tradeList.length ; i++){
		var numX = sx + 570 + 65*(i%4);
		var numY = sy +  70 + 65*Math.floor(i/4);
			
		if(server){
			Button.creation(key,{
			"rect":[numX,numX+56,numY,numY+56],
			'text':'Withdraw ' + Db.item[trade.tradeList[i][0]].name
			});	
		}
		
		if(!server){
			drawItem(trade.tradeList[i],[numX,numY],56);
		}
	}	
	
	//Accept
	var numX = sx+160; var numY = h-50; var wi = 250; var he = 35;
	
	if(server){
		if(!trade.confirm.self){
			Button.creation(key,{
			"rect":[numX,numX+wi,numY,numY+he],
			'text':'Click to Accept Trade',
			'left':{'func':(function(key){ trade.confirm.self = 1; }),'param':[]}
			});	
		} else {
			Button.creation(key,{
			"rect":[numX,numX+wi,numY,numY+he],
			'text':'Click to Refuse Trade',
			'left':{'func':(function(key){ trade.confirm.self = 0; }),'param':[]}
			});	
		}
	}
	
	if(!server){
		ctx.textAlign="center";
		ctx.font="25px Fixedsys";
		ctx.fillStyle = "yellow";
		ctx.strokeStyle = 'yellow';
		
		ctx.fillText('Trade State ',numX+wi/2,numY+3);
		ctx.strokeRect(numX,numY,wi,he);
		if(trade.confirm.self){ 
		ctx.drawImage(Img.icon,iconIndex['system.heart'].x,iconIndex['system.heart'].y,ICON,ICON,numX+7,numY+7,20,20);
		} else { ctx.drawImage(Img.icon,iconIndex['system.close'].x,iconIndex['system.close'].y,ICON,ICON,numX+7,numY+7,20,20); }
		
		var numX = sx+570; var numY = h-50; var wi = 250; var he = 35;
		ctx.fillText('Trade State ',numX+wi/2,numY+3);
		ctx.strokeRect(numX,numY,wi,he);
		if(trade.confirm.other){ ctx.drawImage(Img.icon,iconIndex['system.heart'].x,iconIndex['system.heart'].y,ICON,ICON,numX+7,numY+7,20,20);
		} else { ctx.drawImage(Img.icon,iconIndex['system.close'].x,iconIndex['system.close'].y,ICON,ICON,numX+7,numY+7,20,20); }
	}
	
}

Draw.window.shop = function (key){ ctxrestore();
	if(server){ var shop = List.main[key].windowList.shop; } 
		else { var shop = windowList.shop;	}
		
	var s = Draw.window.main(key,shop.name);	var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	ctx = ctxList.win;
	
	//Draw Items
	for(var m = 0; m < ['default','player'].length; m++){
		var stock = ['default','player'][m];
		for (var i = 0 ; i < shop.stock[stock].length ; i++){
			
			var amountX = 12;
			var numX = sx + 40 + 55*(i%amountX);
			var numY = sy + 70 + m * 225 + 55 * Math.floor(i/amountX);
	
	
			if(server){
				Button.creation(key,{
				"rect":[numX,numX+48,numY,numY+48],
				"left":{"func":shopLeftClick,"param":[stock,i]},
				"right":{"func":shopRightClick,"param":[stock,i]},
				'text':'Price of ' + Db.item[shop.stock[stock][i][0]].name
				});
			}
			
			if(!server){
				drawItem(shop.stock[stock][i],[numX,numY],48);	
			}
			
		}
	}
	
}

//{ Passive
Draw.window.passive = function (key){ ctxrestore();
	var s = Draw.window.main(key,{'offensive':0,'defensive':0,'ability':0,'passive':1});	var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	ctx = ctxList.win;
	if(server){ return; }
	
	ctx.font = '25px Fixedsys';
	ctx.fillStyle = 'black';
	
	var hp = html.passiveWin;
	hp.div.style.visibility = 'visible';
	hp.div.style.left = mx + 'px'; 
	hp.div.style.top = my - 65 + 'px'; 
	
	//Subtitle
	var charY = 25;
	hp.text.style.left = 15 + 'px'; 
	hp.text.style.top = 5 + 'px'; 
	hp.text.style.font = 25 + 'px Fixedsys';
	hp.text.style.width = '125px';
	hp.text.style.height = 'auto';
	hp.text.style.backgroundColor = 'white';
	
	var str = 'Points: ' + passivePt + '<br>';
	
	str += 
	'<span ' + 
	'onclick="Draw.window.passive.grid.info.reset();' + '" ' + 
	'>' + 'Reset View' + 
	'</span>';
	
	if(old.passiveText !== str){
		old.passiveText = str
		hp.text.innerHTML = str;
	}
	
	Draw.window.passive.grid();
}

Draw.window.passive.grid = function(key){ ctxrestore();
	var s = Draw.window.main.constant();	var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	ctx = ctxList.passiveGrid;
	
	//Update Drag
	var info = Draw.window.passive.grid.info;
	info.x += mouse.drag.vx; var dx = info.x;
	info.y += mouse.drag.vy; var dy = info.y;
	
	info.size = Math.max(0.1,info.size);
	info.size = Math.min(200,info.size);
	var icon = info.size ;
	var border = info.size/20;
	var border2 = border/2;
	var ic = icon + border;
	
	//Draw Stat	
	for(var i = 0 ; i < passiveGrid.length ; i++){
		for(var j = 0 ; j < passiveGrid[i].length ; j++){
			var numX = sx + 300 + ic * j + dx;	
			var numY = sy + 60 + ic * i + dy;
			
			ctx.globalAlpha = 1;
			
			//Freebies
			if(typeof passiveGrid[i][j] !== 'object'){
				ctx.globalAlpha = 0.5;
				ctx.fillStyle = 'green';
				ctx.fillRect(numX,numY,ic,ic);
				continue;
			}
			
			//Border
			ctx.globalAlpha = 0.5;
			if(pref.passiveView === 'normal'){ ctx.fillStyle =	+passive[i][j] ? 'green' : (Passive.test(passive,i,j) ? '#FFFF00': 'red');}
			if(pref.passiveView === 'heat'){var n = (passiveGrid[i][j].count-passiveGrid.min) / (passiveGrid.max-passiveGrid.min);	ctx.fillStyle =	gradientRG(n);}
			ctx.fillRect(numX,numY,ic,ic);
		
			//Icon
			ctx.globalAlpha = 0.5;
			if(+passive[i][j]){ ctx.globalAlpha = 1; }
			var slot = passiveGrid[i][j].stat ? iconIndex[Db.stat[passiveGrid[i][j].stat].icon] : iconIndex[Db.customBoost[passiveGrid[i][j].value].icon];
			ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,numX+border2,numY+border2,icon,icon);
			
			//Hover
			if(!mouse.drag.active && Collision.PtRect(Collision.getMouse(key),[numX,numX+ic,numY,numY+ic])){
				var hover = passiveGrid[i][j];
			}
			
			//Button
			if(typeof passiveGrid[i][j] === 'object'){
				Button.creation(0,{
				"rect":[numX,numX+ic,numY,numY+ic],
				"right":{"func":Chat.send.command,"param":['$win,passive,select,' + i + ',' + j]},
				'text':'Choose ' + (passiveGrid[i][j].stat ? Db.stat[passiveGrid[i][j].stat].name : Db.customBoost[passiveGrid[i][j].value].name) ,
				});	
			}
			
		}
	}
	
	if(hover){ Draw.window.passive.hover(hover); }

	Button.creation(0,{
		"rect":[sx,sx+w,sy+50,sy+50+h],	//+50 or close doesnt work
		"left":{"func":Input.event.mouse.drag,"param":[]},
		});	
	
}

Draw.window.passive.grid.info = {
	size:20,
	x:0,
	y:0,
	reset:(function(){
		Draw.window.passive.grid.info.x = 0;
		Draw.window.passive.grid.info.y = 0;
		Draw.window.passive.grid.info.size = 20;
	}),
}

Draw.window.passive.hover = function(over){ ctxrestore();
	var s = Draw.window.main.constant(); var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	var ctx = ctxList.pop;
	
	var st = over.stat ? Db.stat[over.stat] : Db.customBoost[over.value];
	
	var vvx = 300;
	var vvy = 100;
	var ssx = Math.max(0,mouse.x - vvx);
	var ssy = Math.max(0,mouse.y - vvy);
	
	//Frame
	ctx.fillStyle = 'grey';
	ctx.fillRect(ssx,ssy,vvx,vvy);
	ctx.strokeStyle = 'black';
	ctx.strokeRect(ssx,ssy,vvx,vvy);
	ctx.fillStyle = 'white';
	
	//Info
	var slot = iconIndex[st.icon];
	
	ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,ssx+5,ssy+1,20,20);
	ctx.fillTextU(st.name,ssx + 5 + 30,ssy+1);
	
	if(over.stat){
		var pop = 'Popularity: ';
		pop += round(100*over.count/passiveGrid.average,1) + '%';
		ctx.fillText(pop,ssx + 5,ssy+1+25*1);
		var value = 'Value: +' + round(over.value,5);
		ctx.fillText(value,ssx + 5,ssy+1+25*2);
	} else {
		ctx.font = '20px Fixedsys';
		ctx.fillText(st.description,ssx + 5,ssy+1+25*1);
	}
}
//}

Draw.window.quest = function (key){ ctxrestore();
	var s = Draw.window.main(key,'Quest');	var sx = s.sx; var sy = s.sy; var mx = s.mx; var my = s.my; var zx = s.zx; var zy = s.zy; var dw = s.dw; var dh = s.dh; var mdx = s.mdx; var mcx = s.mcx; var w = s.w; var h = s.h; 
	ctx = ctxList.win;
	if(server){ return; }
	
	var q = Db.quest[windowList.quest];
	var hq = html.questWin;
	var mq = quest[windowList.quest];
	
	var charY = 22;
	var icon = charY*4;
	
	hq.div.style.visibility = 'visible';
	hq.div.style.left = mx + 'px'; 
	hq.div.style.top = my + 'px'; 
	
	//Icon
	var slot = iconIndex[q.icon];
	ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,zx,zy,icon,icon);
	
	//Info
	hq.info.style.left = icon + 5 + 'px'; 
	hq.info.style.top = 0 + 'px'; 
	
	hq.info.style.font = charY + 'px Fixedsys';
	hq.info.style.width = dw/2 - icon - 5 + 'px';
	hq.info.style.height = charY*4*1.2 + 'px';

	
	var str = '';
	str += 'Name: ' + q.name + '<br>';
	var state = mq.complete ? 'Complete' : (mq.started ? 'Started' : 'Not Started');
	str += 'State: ' + state + '<br>';
	str += 'Reward: ' + round(q.reward.value[0],3,1) + ' - ' + round(q.reward.value[1],3,1) + ' in ' + Db.stat[q.reward.stat].name + '<br>';
	if(mq.complete){
		var boost = Draw.convert.boost(mq.reward);
		str += 'Current Reward: ' + boost[1] + ' in ' + boost[0] + '(' + mq.rewardTier + ')' + '<br>';
	}
	
	hq.info.innerHTML = str;
	
	
	
	//Hint
	var diffY = 10 + hq.info.style.top.numberOnly(1) + hq.info.style.height.numberOnly(1);
	
	ctx.font = charY-2 + 'px Fixedsys';
	ctx.fillStyle = 'black';
	
	ctx.fillTextU('Hint:',zx-2,zy+diffY);
	hq.hint.style.left = 0 + 'px'; 
	hq.hint.style.top = diffY + charY + 'px'; 
	
	hq.hint.style.font = charY + 'px Fixedsys';
	hq.hint.style.width = dw/2 -10 + 'px'
	hq.hint.style.height = charY*2*1.2 + 'px'
	
	hq.hint.innerHTML = mq.hint;
	
	//Description
	var diffY = 30 + hq.hint.style.top.numberOnly(1) + hq.hint.style.height.numberOnly(1);
	
	ctx.font = charY-2 + 'px Fixedsys';
	ctx.fillStyle = 'black';
	
	ctx.fillTextU('Description:',zx-2,zy+diffY);
	hq.description.style.left = 0 + 'px'; 
	hq.description.style.top = diffY + charY + 'px'; 
	
	hq.description.style.font = charY + 'px Fixedsys';
	hq.description.style.width = dw/2 -10 + 'px'
	hq.description.style.height = charY*5*1.2 + 'px'
	
	hq.description.innerHTML = q.description;
	
	
	//Requirements	
	ctx.font = charY-2 + 'px Fixedsys';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'left';
	ctx.fillTextU('Requirements:',mcx,zy);
	hq.requirement.style.left = mdx + 'px'; 
	hq.requirement.style.top = charY + 'px'; 
	
	hq.requirement.style.font = charY + 'px Fixedsys';
	hq.requirement.style.width = dw/2 + 'px'
	hq.requirement.style.height = charY*q.requirement.length*1.2 + 'px'
	
	hq.requirement.innerHTML = Quest.req.convert(mq.requirement,q.requirement);
	
	
	//Bonus	
	var diffY = 30 + hq.requirement.style.top.numberOnly(1) + hq.requirement.style.height.numberOnly(1);
	
	ctx.font = charY-2 + 'px Fixedsys';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'left';
	
	hq.bonus.style.left = mdx + 'px'; 
	hq.bonus.style.top = diffY + charY + 'px'; 
	
	hq.bonus.style.font = charY + 'px Fixedsys';
	hq.bonus.style.width = dw/2 + 'px'
	hq.bonus.style.height = charY*Object.keys(q.bonus).length*1.2 + 'px'
	
	var str = '';
	for(var i in q.bonus){
		var b = q.bonus[i];
		
		var color = mq.bonus[i] ? 'green' : 'red';
		
		str += 
			'<span ' + 
			'class="shadow" ' + 
			'style="color:' + color + '" ' +
			'onclick="Chat.send.command(\'' + '$win,quest,toggleBonus,' + q.id + ',' + i + '\')' + '" ' + 
			'onmouseover=\"permContext.text = \'Toggle Bonus\'\" ' +
			'onmouseout="permContext.text = null;' + '" ' + 
			'>' + b.info + ' - (x' + b.bonus + ')' +
			'</span><br>';
	}
	str = str.slice(0,-4);
	if(old.questWin !== str){	
		old.questWin = str;
		hq.bonus.innerHTML = str;
	}
	
	ctx.fillTextU('Bonus:  x' + round(mq.bonusSum,3),mcx,zy+diffY);
	
}
//}

//{Popup
Draw.popup = function(key){
	if(server){ var pop = List.main[key].popupList; } 
		else { var pop = popupList; }
	
	if(pop.weapon){Draw.popup.equip(key,'weapon');}
	if(pop.armor){Draw.popup.equip(key,'armor');}
}

Draw.popup.equip = function(key,type){ ctxrestore();
	var w = 250;
	var h = 250;
	
	if(server) return;
	
	ctx = ctxList.win;
	
	var id = typeof popupList[type] === 'object' ? popupList[type].info.id : popupList[type];
	
	var equip = window[type + 'Db'][id];
	if(equip === undefined){queryDb(type+'Db',id); return; }
	if(equip === 0){return;} //waiting for query answer
	
	var posx = popupList[type].x || mouse.x;
	var posy = popupList[type].y || mouse.y;
	
	var sx = Math.max(0,Math.min(posx-w,WIDTH-w));
	var sy = Math.max(0,Math.min(posy-h,HEIGHT - h));	
	
	
	//Frame
	ctx.globalAlpha = 0.9;
	ctx.fillStyle = "#696969";
	ctx.strokeStyle="black";
	ctx.drawRect(sx,sy,w,h);
	ctx.globalAlpha = 1;
	
	
	//Draw icon
	var slot = iconIndex[equip.visual];
	ctx.drawImage(Img.icon,slot.x,slot.y,ICON,ICON,sx+2,sy+2,48,48);
	
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
	if(type == 'armor'){ var num = equip.defMain; var bar = 'def';}
	if(type == 'weapon'){ var num = equip.dmgMain; var bar = 'dmgRatio';}
	ctx.font="25px Fixedsys";
	ctx.textAlign = 'center';
	ctx.fillText(round(num,0),sx+25,sy+50);
	drawElementBar(sx+52,sy+50,190,25,equip[bar]);
	
	
	
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

openPopup = function(key,name,param){
	var player = List.all[key];
	if(name === 'weapon'){
		List.main[key].popupList.weapon = {'x':player.mouseX,'y':player.mouseY,'info':param};
	}
	if(name === 'armor'){
		List.main[key].popupList.armor = {'x':player.mouseX,'y':player.mouseY,'info':param};
	}
	
}
//}

//Option
Draw.optionList = function(key){ ctxrestore();
	if(server){ var opt = List.main[key].optionList; } 
		else { var opt = optionList; }
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
			
			if(optionList.client){ 
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
	if(server){ var dia = List.main[key].dialogue; } 
		else { var dia = dialogue; }
	ctx = ctxList.stage;
	
	var w = 600;
	var h = 200;
	var sx = 0;
	var sy = HEIGHT-h;
	var numX = 5;		//border for text
	var faceX = 96 + 5;	//push dia text by that if has face
	var facesX = 8;		//border for face	
	var facesY = 30;	//border for face
	var	optionY = 20;	//Y between options
	var textBorder = 20; //distance between border of box and where text starts, applied to start and end
	var personalChatY = 20; //size for player own written stuff (chatBox not dialogue)
	
	var dialogueTopDiffY = 10;
	
	var chatcharY = 20; 
	
	var divX = 5;
	var divY = 5;
	
	//pm
	var pmY = 200;
	var disPmY = 20; //distance between botoom of pm and top of chat
	var pmcharY = 20;
	var pmDivY = 5;
	
	if(!server){
		//PM
		html.pm.div.style.visibility = 'visible';
		html.pm.div.style.left = (sx + divX) + 'px'; 
		html.pm.div.style.top = (sy + divY - pmY - pmDivY - disPmY) + 'px'; 
		
		html.pm.text.style.font = pmcharY + 'px Fixedsys';
		html.pm.text.style.width = (w - 2*divX) + 'px';
		html.pm.text.style.height = (pmY) + 'px'
		html.pm.text.style.left = divX + 'px'; 
		html.pm.text.style.top = (divY- pmY - pmDivY - disPmY) + 'px'; 
		
		//Clan
		var str = 'Clan: ';
		for(var i in clanList){ str += clanList[i] + '  '; }
		ctx.font = '15px Monaco';
		ctx.fillStyle = 'white';
		ctx.fillText(str,(sx + divX),(sy - disPmY));
		
		
		//HTML
		html.chat.div.style.left = (sx + divX) + 'px'; 
		html.chat.div.style.top = (sy + divY) + 'px'; 
		
		html.chat.text.style.font = chatcharY + 'px Fixedsys';
		html.chat.text.style.width = (w - 2*divX) + 'px';
		html.chat.text.style.height = (h - 2*divY - personalChatY) + 'px'
		html.chat.text.style.left = divX + 'px'; 
		html.chat.text.style.top = divY + 'px'; 
		
		chatUserName.style.font = personalChatY + 'px Fixedsys';
		
		html.chat.input.size=(69-player.name.length).toString();
		html.chat.input.maxlength="150";	
		html.chat.input.style.font = personalChatY + 'px Fixedsys';
		html.chat.input.style.height = personalChatY + 'px'
			
		html.dialogue.div.style.width = (w - 2*divX) + 'px';
		html.dialogue.div.style.height = (h - 2*divY) + 'px'
		html.dialogue.div.style.left = (sx + divX) + 'px'; 
		html.dialogue.div.style.top = (sy + divY + dialogueTopDiffY) + 'px'; 
		
		//MainBox
		ctx.globalAlpha = 0.8;
		ctx.fillStyle="#F5DEB3";
		ctx.fillRect(sx,sy,w,h);
		ctx.globalAlpha = 1;
		ctx.strokeStyle="black";
		ctx.strokeRect(sx,sy,w,h);
		ctx.fillStyle="black";
	}
	
	//DialogueBox
	if(dia){
		if(dia.face){	numX += faceX;} 
		if(dia.option){ var numY = sy+h-10-dia.option.length*20; }	
				
		if(server){
			if(dia.option){
				for(var i in dia.option){
					Button.creation(key,{
					"rect":[numX,numX+h,numY+i*optionY,numY+optionY+i*optionY],
					"left":{"func":Dialogue.option,"param":[dia.option[i]]},
					"text":dia.option[i].text
					});	
				}
			}
		}
		
		if(!server){
			html.dialogue.div.style.visibility = "visible";
			html.dialogue.text.style.width = w - 2*textBorder + 'px';
			html.dialogue.text.innerHTML = dia.text;		
			
			if(dia.face){
				html.dialogue.text.style.width = w - 2*textBorder-faceX + 'px';
				html.dialogue.div.style.left = (sx + divX + textBorder + faceX) + 'px';
				ctx.drawImage(Img.face,0,0,96,96,facesX,sy+facesY,96,96);
				ctx.font="20px Fixedsys";
				ctx.textAlign = 'center';
				ctx.fillText(dia.face.name,facesX+96/2,sy+facesY+96+5);
				ctx.textAlign = 'left';
			} 
			
			//Options
			if(dia.option){
				ctx.font = optionY + 'px Fixedsys';
				for(var i in dia.option){
					ctx.fillText('-' + dia.option[i].text,numX,numY);
					numY += optionY;
				}
			}
		}
	}
	
	//ChatBox
	if(!dia){
		if(server){}
		if(!server){
			html.chat.div.style.visibility = "visible";
			ctx.beginPath();
			ctx.moveTo(sx,sy+h-personalChatY-3);
			ctx.lineTo(w,sy+h-personalChatY-3);
			ctx.stroke();		
		}		
	}
}

















