Draw.old.tab = {};

Draw.tab = function(){ ctxrestore();
	Draw.tab[main.currentTab]();
}

Draw.tab.main = function (){ ctxrestore();
	var s = Draw.tab.main.constant(); 
	ctx = List.ctx.stage;
	
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
		var numX = s.x + 15 + vx * i; 
		var numY = s.oy + 8;
		
		Button.creation(0,{
			"rect":[numX,numX+24,numY,numY+24],
			"left":{"func":Command.send,"param":['tab,open,' + Cst.tab.list[i]]},
			'text':Cst.tab.list[i].capitalize(),
			'sfx':'menu',
		});	
		
		Draw.icon('tab.' + Cst.tab.list[i],numX,numY,24);
		if(main.currentTab === Cst.tab.list[i]){ctx.strokeRect(numX-1,numY-1,24+1,24+1);}
		
	}
	
	//Help
	Help.icon('interface_' + main.currentTab,Cst.WIDTH-20,s.oy-20,20);
	
	ctxrestore();
	return s;
}

Draw.tab.main.constant = function(){
	var sizeX = 200;
	var sizeY = 300;
	var startX = Cst.WIDTH-sizeX;
	var startY = Cst.HEIGHT-sizeY;
	
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

Draw.tab.equip = function (){ ctxrestore();
	var s = Draw.tab.main();	
	ctx = List.ctx.stage;
	
	//Weapon
	if(!SERVER && typeof main.popupList.equip !== 'object') main.popupList.equip = 0;
	for (var i = 0 ; i < Cst.equip.weapon.piece.length ; i++){
		var numX = s.x + 10;
		var numY = s.y + 7 + 5 + 45 * i;
		var piece = Cst.equip.weapon.piece[i];
		
		var id = player.equip.piece[piece];
		var equip = Db.query('equip',id);
		
		if(equip){
			if(player.weapon !== player.equip.piece[piece]) ctx.globalAlpha = 0.5;
			Draw.icon(equip.icon,numX,numY,40);
			ctx.globalAlpha = 1;
			
			if(Collision.PtRect(Collision.getMouse(),[numX,numX+40,numY,numY+40])){
				main.popupList.equip = equip.id;
			}
			
			Button.creation(0,{
				"rect":[numX,numX+40,numY,numY+40],
				"left":{"func":Command.send,"param":['tab,swapWeapon,' + piece]},
				"right":{"func":Command.send,"param":['tab,removeEquip,' + piece]},
				"text":'Left: Swap Weapon | Right: Remove'
			});
		} else {
			ctx.fillStyle = 'black';
			ctx.strokeRect(numX,numY,40,40);
		}
	}
	
	//Armor
	for (i = 0 ; i < Cst.equip.armor.piece.length ; i++){
		var numX = s.x + 55 + 45*(i%3);
		var numY = s.y + 7 + 5 + 45 * Math.floor(i/3);
		
		var piece = Cst.equip.armor.piece[i];
		
		var id = player.equip.piece[piece];
		var equip = Db.query('equip',id);
		if(equip){
			Draw.icon(equip.icon,numX,numY,40);
			
			if(Collision.PtRect(Collision.getMouse(0),[numX,numX+40,numY,numY+40])){
				main.popupList.equip = equip.id;
			}
			
			Button.creation(0,{
				"rect":[numX,numX+40,numY,numY+40],
				"right":{"func":Command.send,"param":['tab,removeEquip,' + piece]},
				"text":'Remove Equip'
			});		
			
		} else {
			ctx.fillStyle = 'black';
			ctx.strokeRect(numX,numY,40,40);
		}
	}
	
	
	//AdvancedWindow
	var numX = s.x + 10;
	var numY = s.y + 150;
	var vy = 25;
		
	ctx.fillStyle = 'white';
	ctx.font = '18px Kelly Slab';
	
	var array = [
		['offensive','element.melee'],
		['defensive','body.metal'],
		['ability','element.magic'],
		['passive','element.magic'],
	];
	if(main.hideHUD.passive) array.splice(3,1);
	
	for(var i in array){
		var name = array[i][0];
		var capname = name.capitalize();
		
		Draw.icon(array[i][1],numX,numY,20);
		ctx.fillText(capname,numX+vy,numY);
		Button.creation(0,{
			"rect":[numX,numX+80+vy,numY,numY+20],
			"left":{"func":Command.send,"param":['win,open,' + name]},
			"text":'Open ' + capname + ' Window'
			});
		numY += vy;
	}
	
}
		
Draw.tab.inventory = function (){ ctxrestore();
	var s = Draw.tab.main();	
	ctx = List.ctx.stage;
	
	//Draw Items
	for (i = 0 ; i < main.invList.length ; i++){
		if(main.invList[i]){
			var amountX = 4;
			var numX = s.x + 20 + 45*(i%amountX);
			var numY = s.y + 5 + 50*Math.floor(i/amountX);
			
			var text = 'Use ' + main.invList[i][2];
			// !(temp.selectInv && temp.reset && temp.reset.selectInv) ? 'Use ' + main.invList[i][0] : temp.selectInv.name + ' on ' + invList[i][0];
			
			Button.creation(0,{
				"rect":[numX,numX+32,numY,numY+32],
				"left":{"func":Command.send,"param":['tab,inv,click,left,' + i]},
				"right":{"func":Command.send,"param":['tab,inv,click,right,' + i]},
				"shiftLeft":{"func":Command.send,"param":['tab,inv,click,shiftLeft,' + i + ',' + main.pref.bankTransferAmount]},
				"shiftRight":{"func":Command.send,"param":['tab,inv,click,shiftLeft,' + i + ',' + 999999999]},
				"text":text
			});	
			
			Draw.item(main.invList[i],numX,numY);
		}
	}		
}
	
Draw.tab.quest = function(){ ctxrestore();
	var s = Draw.tab.main(0);	
	ctx = List.ctx.stage;
		
	var count = 0;
	
	var divX = 10;
	var divX = 5;
	var numX = s.x + divX;
	var numY = s.y + divX;
	var charY = 22;
	var iconY = 40;
	
	html.questTab.div.style.left = numX + 'px'; 
	html.questTab.div.style.top = numY + 'px'; 
	html.questTab.div.style.visibility = 'visible';
	
	html.questTab.text.style.font = charY + 'px Kelly Slab';
	html.questTab.text.style.width = (s.w - 2*divX) + 'px'
	html.questTab.text.style.height = (s.h - iconY- 2*divX) + 'px'
	
	if(Draw.old.tab.quest !== Tk.stringify(main.quest)){
		Draw.old.tab.quest = Tk.stringify(main.quest);
		
		html.questTab.text.innerHTML = '<span style="color:white;text-decoration:underline;">' + 'Quest List' + '</span>';
		
		for(var i in main.quest){
			var q = main.quest[i];
			var name = Db.questNameConvert[i];
			
			var color = q.active ? 'yellow' : ( q.complete ? '#00FF00' : 'red');
			
			
			html.questTab.text.innerHTML += 
			'<br><span ' + 
			'class="shadow" ' + 
			'style="color:' + color + '" ' +
			'onclick="Command.send(\'' + 'win,open,quest,' + i + '\')' + '" ' + 
			'title="Check '+ name + '" ' 
			+ '>' + name + 
			'</span>';
			
		}
	}
}
	
Draw.tab.skill = function(){ ctxrestore();
	var s = Draw.tab.main();	
	
	ctx = List.ctx.stage;
	
	for (var i = 0 ; i < Cst.skill.list.length ; i++){
		var vx = 100;
		var vy = 28;
		var numX = s.x + 18 + vx*Math.floor(i/9);
		var numY = s.y + 5  + vy *(i%9);
			
		
		ctx.fillStyle = 'white';
		
		Draw.icon('skill.' + Cst.skill.list[i],numX,numY,20);
		ctx.fillText(player.skill.lvl[Cst.skill.list[i]],numX+30,numY);
		
		if(Collision.PtRect(Collision.getMouse(0),[numX,numX+vx,numY,numY+vy])){
			var mouseover = Cst.skill.list[i];
		}
			
		
	}
	if(mouseover){
		var sk = mouseover;
			
		var vvx = 200;
		var vvy = 100;
		var ssx = Input.mouse.x - vvx;
		var ssy = Input.mouse.y - vvy;
		
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
		expMod = expMod == 1 ? '' : '  *' + Tk.round(expMod,2)
		
		Draw.icon('skill.' + sk,ssx+5,ssy+1,20);
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
	ctx = List.ctx.stage;
	
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
	
	
	hf.text.style.font = charY + 'px Kelly Slab';
	hf.text.style.width = (s.w - 2*divX) + 'px'
	hf.text.style.height = (s.h - iconY- 2*divY) + 'px'
	
	if(Tk.stringify(Draw.old.tab.friend) !== Tk.stringify(list)){
		Draw.old.tab.friend = list;
		
		hf.text.innerHTML = '<span style="color:white; text-decoration:underline;">' + 'Friend List' + '</span>';
		
		for(var i in list){
			var color = list[i].online ? '#00FF00' : '#FF4D49';
			var title = i + ' : ' + list[i].nick + '  |  '+ list[i].comment;
			var onclick = list[i].online ? '@' + i + ',' : '$fl,offlinepm,' + i + ',';
			
			hf.text.innerHTML += 
			'<br><span ' + 
			'class="shadow" ' + 
			'style="color:' + color + '" ' +
			'onclick="Input.add(\'' + onclick + '\')' + '" ' + 
			'oncontextmenu="Draw.tab.friend.rightClick(\'' + i + '\')' + '" ' + 
			'title="'+ title + '" ' + 
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
	
		Draw.icon(array[i][2],numX,numY,20);
		Button.creation(0,{
			"rect":[numX,numX+20,numY,numY+20],
			'left':{'func':Input.add, 'param':[array[i][1]]},
			"text":array[i][0]
		});	
	}



}

Draw.tab.friend.rightClick = function(name){
	var option = {'name':name,'option':[],'count':1};
	
	
	if(main.social.list.friend[name].online){
		option.option[0] = {
			'name':'Send Message',
			'func':Input.add,
			'param':['@' + name + ','],	
		};
	} else {
		option.option[0] = {
			'name':'Offline Message',
			'func':Input.add,
			'param':['$fl,offlinepm,' + name + ','],	
		};
	}
	
	
	option.option[1] = {
		'name':'Change Nickname',
		'func':Input.add,
		'param':['$fl,nick,' + name + ','],	
	};
	
	option.option[2] = {
		'name':'Change Comment',
		'func':Input.add,
		'param':['$fl,comment,' + name + ','],	
	};
	
	option.option[3] = {
		'name':'Change PM Color',
		'func':Input.add,
		'param':['$fl,color,' + name + ','],	
	};
	
	option.option[4] = {
		'name':'Remove Friend',
		'func':Command.send,
		'param':['fl,remove,' + name],	
	};
	
	
	Button.creation.optionList(option);
}

Draw.tab.pref = function(){ 
	var s = Draw.tab.main();	
	ctx = List.ctx.stage;
	
	var list = Command.pref.list;
	var count = 0;
	var hf = html.prefTab;
	
	var divX = 5;
	var divY = 5;
	var numX = s.x + divX;
	var numY = s.y + divY;
	var charY = 22;
	var iconY = 40;
	
	hf.div.style.visibility = 'visible';
	hf.div.style.left = numX + 'px'; 
	hf.div.style.top = numY + 'px'; 
	
	
	hf.text.style.font = charY + 'px Kelly Slab';
	hf.text.style.width = (s.w - 2*divX) + 'px'
	hf.text.style.height = (s.h - iconY- 2*divY) + 'px'
	
	if(Draw.old.tab.pref !== Tk.stringify(main.pref)){
		Draw.old.tab.pref = Tk.stringify(main.pref);
		
		hf.text.innerHTML = '<span style="color:white; text-decoration:underline;">' + 'Preferences' + '</span>';		
		
		//Key Binding
		hf.text.innerHTML += 
		'<br><span ' + 
		'class="shadow" ' + 
		'style="color:' + 'white' + '" ' +
		'onclick="Command.send(\'' + 'win,open,binding' + '\')' + '" ' + 
		'title="Change Key Bindings"' +
		'>' +
		'<font size="4">' +			
		'*Key Bindings*' +
		'</font>' +
		'</span>';
		
		//Regular Pref
		for(var i in list){
			var pref = list[i];
			
			var name = pref.name;
			var value = main.pref[i];
			
			var str2 = '$pref,' + i + ',';
			var str = pref.description + ' (' + pref.min + '-' + pref.max + ')';
			
			
			hf.text.innerHTML += 
			'<br><span ' + 
			'class="shadow" ' + 
			'style="color:' + 'white' + '" ' +
			'onclick="Input.add(\'' + str2 + '\')' + '" ' + 
			'title="'+ str + '" ' + 
			'>' +
			'<font size="3">' +			
			name + ' : ' + value + 
			'</font>' +
			'</span>';
			
		}
	}
	
	
	
	
	
}



