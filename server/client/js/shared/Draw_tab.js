Draw.tab = function(key){ ctxrestore();
	Draw.tab[main.currentTab]();
}

Draw.tab.main = function (){ ctxrestore();
	var s = Draw.tab.main.constant(); 
	ctx = ctxList.stage;
	
	//Main Frame
	ctx.globalAlpha = 0.8;
	ctx.fillStyle = '#6D6968';
	ctx.fillRect(s.x,s.oy,s.w,s.oh);
	
	ctx.globalAlpha = 1;
	ctx.strokeStyle = 'black';
	ctx.strokeRect(s.x,s.oy,s.w,s.oh);
	
	ctx.beginPath();
	ctx.moveTo(s.x,s.y);
	ctx.lineTo(s.x+s.w,s.y);
	ctx.stroke();	
	
	for(var i = 0 ; i < Cst.tab.list.length ; i++){
		var vx = 30;
		var vy = 0;
		var numX = s.x + 15 + vx * (i%100)  
		var numY = s.oy + 8  + vy * Math.floor(i/100)
		
		Button.creation(key,{
			"rect":[numX,numX+24,numY,numY+24],
			"left":{"func":Chat.send.command,"param":['$tab,open,' + Cst.tab.list[i]]},
			'text':Cst.tab.list[i].capitalize(),
			'help':Cst.tab.list[i].capitalize(),
		});	
		
		Draw.icon('tab.' + Cst.tab.list[i],[numX,numY],24);
		if(main.currentTab === Cst.tab.list[i]){ctx.strokeRect(numX-1,numY-1,24+1,24+1);}
		
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
	return {
		'oh':sizeY,		//overall height
		'oy':startY,	//overall starting y
		'x':startX,		//starting x
		'y':startY+dy,	//starting y
		'w':sizeX,		//width
		'h':sizeY-dy,	//height
		'mx':(startX+sizeX)/2,		//middle x	
	}
	
}
		
Draw.tab.inventory = function (){ ctxrestore();
	var s = Draw.tab.main();	
	ctx = ctxList.stage;
	
	//Draw Items
	for (i = 0 ; i < main.invList.length ; i++){
		if(main.invList[i]){
			var amountX = 4;
			var numX = s.x + 20 + 42*(i%amountX);
			var numY = s.y + 15 + 41 * Math.floor(i/amountX);
			
			var text = 'Use ' + main.invList[i][2];
			// !(temp.selectInv && temp.reset && temp.reset.selectInv) ? 'Use ' + main.invList[i][0] : temp.selectInv.name + ' on ' + invList[i][0];
			
			Button.creation(key,{
				"rect":[numX,numX+32,numY,numY+32],
				"left":{"func":Chat.send.command,"param":['$tab,inv,click,left,' + i]},
				"right":{"func":Chat.send.command,"param":['$tab,inv,click,right,' + i]},
				"shiftLeft":{"func":Chat.send.command,"param":['$tab,inv,click,shiftLeft,' + i]},
				"text":text
			});	
			
			Draw.item(main.invList[i],[numX,numY]);
		}
	}		
}

Draw.tab.equip = function (){ ctxrestore();
	var s = Draw.tab.main();	
	ctx = ctxList.stage;
	
	//Weapon
	if(!server && typeof main.popupList.equip !== 'object') main.popupList.equip = 0;
	for (var i = 0 ; i < Cst.equip.weapon.piece.length ; i++){
		var numX = s.x + 10;
		var numY = s.y + 7 + 5 + 45 * i;
		
		var piece = Cst.equip.weapon.piece[i];
		if(player.weapon.piece != Cst.equip.weapon.piece[i]){ ctx.globalAlpha = 0.5; } 
		
		Draw.icon(player.equip.piece[Cst.equip.weapon.piece[i]].visual,[numX,numY],40);
		ctx.globalAlpha = 1;
		
		if(Collision.PtRect(Collision.getMouse(),[numX,numX+40,numY,numY+40])){
			main.popupList.equip = player.equip.piece[Cst.equip.weapon.piece[i]].id;
		}
		
		Button.creation(key,{
			"rect":[numX,numX+40,numY,numY+40],
			"left":{"func":Chat.send.command,"param":['$tab,swapWeapon,' + Cst.equip.weapon.piece[i]]},
			"text":'Swap Weapon'
		});
			
	}
	
	//Armor
	for (i = 0 ; i < Cst.equip.armor.piece.length ; i++){
		var numX = s.x + 55 + 45*(i%3);
		var numY = s.y + 7 + 5 + 45 * Math.floor(i/3);
		var piece = player.equip.piece[Cst.equip.armor.piece[i]];
		
		Draw.icon(piece.visual,[numX+10,numY],40);
		
		if(Collision.PtRect(Collision.getMouse(key),[numX,numX+40,numY,numY+40])){
			main.popupList.equip = piece.id;
		}		
	}
	
	
	//AdvancedWindow
	var numX = s.x + 10;
	var numY = s.y + 150;
	var vy = 25;
		
	ctx.fillStyle = 'white';
	ctx.font = '18px Fixedsys';
	
	var array = [
		['offensive','offensive.melee'],
		['defensive','body.metal'],
		['ability','offensive.magic'],
		['passive','offensive.magic'],
	];
	
	for(var i in array){
		var name = array[i][0];
		var capname = name.capitalize();
		
		Draw.icon(array[i][1],[numX,numY],20);
		ctx.fillText(capname,numX+vy,numY);
		Button.creation(key,{
			"rect":[numX,numX+80+vy,numY,numY+20],
			"left":{"func":Chat.send.command,"param":['$win,open,' + name]},
			"text":'Open ' + capname + ' Window'
			});
		numY += vy;
	}
	
}
		
Draw.tab.skill = function(){ ctxrestore();
	var s = Draw.tab.main();	
	
	ctx = ctxList.stage;
	
	for (var i = 0 ; i < Cst.skill.list.length ; i++){
		var vx = 100;
		var vy = 28;
		var numX = s.x + 18 + vx*Math.floor(i/9);
		var numY = s.y + 5  + vy *(i%9);
			
		
		ctx.fillStyle = 'white';
		
		Draw.icon('skill.' + Cst.skill.list[i],[numX,numY],20);
		ctx.fillText(player.skill.lvl[Cst.skill.list[i]],numX+30,numY);
		
		if(Collision.PtRect(Collision.getMouse(key),[numX,numX+vx,numY,numY+vy])){
			var mouseover = Cst.skill.list[i];
		}
			
		
	}
	if(mouseover){
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
		var lvl = player.skill.lvl[sk];
		var exp = player.skill.exp[sk];
		var expMod = player.bonus.exp[sk];
		expMod = expMod == 1 ? '' : '  *' + round(expMod,2)
		
		Draw.icon('skill.' + sk,[ssx+5,ssy+1],20);
		ctx.fillTextU(sk.capitalize(),ssx + 5 + 30,ssy+1);
		ctx.fillText('Level: ' + lvl,ssx + 5,ssy+1+25*1);
		ctx.fillText('Exp: ' + exp +  expMod,ssx + 5,ssy+1+25*2);
		
		if(lvl < Cst.exp.list.length){
			var expNext = Cst.exp.list[lvl+1]-exp;
			ctx.fillText('Next: ' + expNext,ssx + 5,ssy+1+25*3);
		}		
	}
}	

Draw.tab.friend = function(){ ctxrestore();
	var s = Draw.tab.main();	
	ctx = ctxList.stage;
	
	var list = main.social.list.friend;
	var count = 0;
	var hf = html.friendTab;
	
	var divX = 5;
	var divY = 5;
	var numX = s.x + divX;
	var numY = s.y + divY;
	var charY = 22;
	var iconY = 40;
	
	hf.div.style.visibility = 'visible';
	hf.div.style.left = numX + 'px'; 
	hf.div.style.top = numY + 'px'; 
	
	
	hf.text.style.font = charY + 'px Fixedsys';
	hf.text.style.width = (s.w - 2*divX) + 'px'
	hf.text.style.height = (s.h - iconY- 2*divY) + 'px'
	
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
			'onmouseover="main.permContext.text = \'' + str + '\';' + '" ' + 
			'onmouseout="main.permContext.text = null;' + '" ' + 
			'>' + i + 
			'</span>';
			
		}
	}
	
	//Drawing Button at bottom
	var divX = 25;
	var divY = 5;
	var vx = 40;

	var array = [
		['Check Friend List.','$fl,add,','friend.friend'],
		['Check Mute List.','$fl,add,','friend.mute'],
		['Add a friend.','$fl,add,','friend.add'],
		['Remove a friend.','$fl,remove,','friend.remove'],	
	];
	
	for(var i = 0 ; i < array.length; i ++){
		var numX = s.x + divX + i*vx; 
		var numY = s.y + s.h - iconY + divY;	
	
		Draw.icon(array[i][2],[numX,numY],20);
		Button.creation(0,{
			"rect":[numX,numX+20,numY,numY+20],
			'left':{'func':addInput, 'param':[array[i][1]]},
			"text":array[i][0]
		});	
	}



}

Draw.tab.quest = function(key){ ctxrestore();
	var s = Draw.tab.main(key);	
	ctx = ctxList.stage;
		
	var count = 0;
	
	var divX = 10;
	var divX = 5;
	var numX = s.x + divX;
	var numY = s.y + divX;
	var charY = 15;
	var iconY = 40;
	
	html.questTab.div.style.left = numX + 'px'; 
	html.questTab.div.style.top = numY + 'px'; 
	html.questTab.div.style.visibility = 'visible';
	
	html.questTab.text.style.font = charY + 'px Fixedsys';
	html.questTab.text.style.width = (s.w - 2*divX) + 'px'
	html.questTab.text.style.height = (s.h - iconY- 2*divX) + 'px'
	
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
			'onmouseover="main.permContext.text = \'' + qdb.name + '\';' + '" ' + 
			'onmouseout="main.permContext.text = null;' + '" ' + 
			'>' + qdb.name + 
			'</span>';
			
		}
	}
}

Draw.tab.setting = function(key){ 

}
