//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Tk','Input','Collision','Button','Command']));

Draw.old.tab = {};

Draw.tab = function(){ ctxrestore();
	if(main.currentTab) Draw.tab[main.currentTab]();
	else Draw.tab.main();
}

Draw.tab.main = function (){ ctxrestore();
	var s = Draw.tab.main.constant(); 
	ctx = List.ctx.stage;
	
	//Main Frame
	if(main.currentTab){
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = 'black';//'#6D6968';
		ctx.fillRect(s.x,s.y,s.w,s.h);
		ctx.globalAlpha = 1; 
		ctx.strokeRect(s.x,s.y,s.w,s.h);
	}	
	
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = 'black';//'#6D6968';
	ctx.fillRect(s.x,s.oy,s.w,s.dy);
	ctx.globalAlpha = 1; 
	ctx.strokeRect(s.x,s.oy,s.w,s.dy);

	
	ctx.beginPath();
	ctx.moveTo(s.x,s.oy);
	ctx.lineTo(s.x+s.w,s.oy);
	ctx.stroke();	
	
	for(var i = 0 ; i < CST.tab.length ; i++){
		var vx = 30;
		var vy = 0;
		var numX = s.x + 15 + vx * i; 
		var numY = s.oy + 8;
		
		if(main.hideHUD['tab-' + CST.tab[i]]) continue;
		
		if(main.currentTab === CST.tab[i]){
			ctx.strokeRect(numX-1,numY-1,24+1,24+1);
			Button.creation(0,{	//hide
				"rect":[numX,numX+24,numY,numY+24],
				"left":{"func":Command.send,"param":['tab,close']},
				'text':"Hide Tab",
				'sfx':'menu',
			});	
		} else {
			Button.creation(0,{
				"rect":[numX,numX+24,numY,numY+24],
				"left":{"func":Command.send,"param":['tab,open,' + CST.tab[i]]},
				'text':CST.tab[i].capitalize(),
				'sfx':'menu',
			});	
		}
		Draw.icon('tab.' + CST.tab[i],numX,numY,24);
		
		
	}
	
	//Help
	//Help.icon('interface_' + main.currentTab,CST.WIDTH-40,s.oy-40,40,'uihelper');	//TOFIX
	
	ctxrestore();
	return s;
}

Draw.tab.main.constant = function(){
	var sizeX = 200;
	var sizeY = 300;
	var startX = CST.WIDTH-sizeX;
	var startY = CST.HEIGHT-sizeY;
	
	var dy = 40;
	return {
		'oh':sizeY,		//overall height
		'oy':CST.HEIGHT-dy,	//overall starting y
		'x':startX,		//starting x
		'y':startY,	//starting y
		'w':sizeX,		//width
		'h':sizeY-dy,	//height
		'mx':(startX+sizeX)/2,	//middle x	
		dy:dy,
	}
	
}

Draw.tab.equip = function (){ ctxrestore();
	var s = Draw.tab.main();	
	ctx = List.ctx.stage;
	
	//Equip
	var removepopup = true;
	
	for (i = 0 ; i < CST.equip.piece.length ; i++){	//1 => skip weapon
		if(i === 1) var num = 1;	//change order so helm - ammy
		if(i === 2) var num = 3;	//				body - ring
		if(i === 3) var num = 0;
		if(i === 4) var num = 2;
		var numX = s.x + 10 + 64 + 64*(num%2);
		var numY = s.y + 7 + 5 + 64 * Math.floor(num/2);
		if(i === 0){	//for weapon
			var numX = s.x + 10;
			var numY = s.y + 7 + 5 + 32;
		}
		
		
		var icon = 50;
		var piece = CST.equip.piece[i];
		
		var id = player.equip.piece[piece];
		var equip = Db.query('equip',id);
		if(equip){
			Draw.icon(equip.icon,numX,numY,icon);
			
			if(Collision.ptRect(Collision.getMouse(0),[numX,numX+icon,numY,numY+icon])){
				main.popupList.equip = equip.id; 
				removepopup = false;
			}
			
			Button.creation(0,{
				"rect":[numX,numX+icon,numY,numY+icon],
				"right":{"func":Command.send,"param":['tab,removeEquip,' + piece]},
				"text":'Right Click: Remove Equip'
			});		
			
		} else {
			ctx.fillStyle = 'black';
			ctx.strokeRect(numX,numY,icon,icon);
		}
	}
	if(removepopup) main.popupList.equip = 0;
	
	//AdvancedWindow
	var numX = s.x + 10;
	var numY = s.y + 150;
	var vy = 25;
		
	ctx.fillStyle = 'white';
	ctx.font = '18px Kelly Slab';
	
	var array = [
		['offensive','element.melee2'],
		['defensive','body.metal'],
		['ability','element.magic2'],
		['passive','minimapIcon.quest'],
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
	for (i = 0 ; i < main.invList.data.length ; i++){
		var d = main.invList.data[i];
		if(d){
			var amountX = 4;
			var numX = s.x + 20 + 45*(i%amountX);
			var numY = s.y + 5 + 50*Math.floor(i/amountX);
			
			var text = 'Use ' + d[2];
			if(main.selectInv) text = 'Use Orb on ' + d[2];
						
			Button.creation(0,{
				"rect":[numX,numX+32,numY,numY+32],
				"left":{"func":Command.send,"param":['tab,inv,click,left,' + i]},
				"right":{"func":Command.send,"param":['tab,inv,click,right,' + i]},
				"shiftLeft":{"func":Command.send,"param":['tab,inv,click,shiftLeft,' + i + ',' + main.pref.bankTransferAmount]},
				"shiftRight":{"func":Command.send,"param":['tab,inv,click,shiftLeft,' + i + ',' + 999999999]},
				"text":text
			});	
			
			Draw.item(d,numX,numY);
		}
	}		
}
	
Draw.tab.quest = function(){ ctxrestore();
	var s = Draw.tab.main(0);	
	ctx = List.ctx.stage;
		
	var count = 0;
	
	var divX = 10;
	var divY = 10;
	var numX = s.x + divX;
	var numY = s.y + divY;
	var charY = 16;
	var iconY = 40;
	
	html.questTab.div.style.left = numX + 'px'; 
	html.questTab.div.style.top = numY + 'px'; 
	html.questTab.div.style.visibility = 'visible';
	
	html.questTab.text.style.font = charY + 'px Kelly Slab';
	html.questTab.text.style.width = (s.w - 2*divX) + 'px';
	html.questTab.text.style.height = (s.h - 2*divX) + 'px';	//need to be put in the div below too
	
	//
	
	
	if(Draw.old.tab.quest !== main.questActive){
		Draw.old.tab.quest = main.questActive;
		
		//'<span style="color:white;text-decoration:underline;">' + 'Quest List' + '</span>';
		//Daily Task
		var str = '<span style="font-size:25px; text-decoration:underline;color:white;">Quest List</span><br>';
		
		str += '<div class="shadowBig onlyTextScroll" style="height:220px;">';
		
		str += '<span style="color:yellow;" title="Huge Bonus Upon Completing Those Tasks">Daily Task: ';
		for(var i in main.dailyTask)
			str += '<span title="' + main.dailyTask[i].date + ': ' + main.dailyTask[i].description + '"> #' + (+i+1) + ' </span>';	
		str += '</span><br>';
		
		//Quest
		for(var i in main.quest){
			if(!Db.questShowInTab[i]) continue;
			var mq = main.quest[i];
			var name = Db.questNameConvert[i];
			if(!name) continue;	//TOFIX
			var color = main.questActive === i ? 'yellow' : ( mq._complete ? '#11FF11' : '#FF1111');
			var challenge = 0;
			var amountChal = Object.keys(mq._challengeDone).length;
			for(var j in mq._challengeDone)	if(mq._challengeDone[j]) challenge++;
			
			var colorChal = 'yellow';
			if(challenge === 0) colorChal = '#FF1111';
			if(challenge === amountChal) colorChal = '#11FF11';
			
			str	+= 
			'<span class="shadowBig" style="color:' + colorChal + '" title="' + challenge + ' out of ' + amountChal + ' challenges completed">'
			+ challenge + '/' + amountChal + ' </span>' + 
			
			'<span class="shadowBig" style="color:' + color + '" ' +
			'onclick="Draw.tab.quest.click(\'' + i + '\')' + '" ' + 
			'title="Check '+ name + '" ' 
			+ '>' + name + 
			'</span><br>';
			
		}
		str += '</div>';
		html.questTab.text.innerHTML = str;
	}
	
	Draw.icon('tab.quest',numX + 135,numY,24,{
		"left":{"func":Draw.window.highscore.open,"param":['Qhighscore-questCount']},
		'text':'Open Highscore Window',
	});
	
	
}

Draw.tab.quest.click = function(id){	//FIREFOX
	if(!event.shiftKey) Command.send('win,open,quest,'+ id );
	else if(main.questActive === id) Command.send('win,quest,abandon,' + id);
	else Command.send('win,quest,start,' + id);
}
	
Draw.tab.skill = function(){ ctxrestore();
	var s = Draw.tab.main();	
	
	ctx = List.ctx.stage;
	ctx.setFont(18);
	
	for (var i = 0 ; i < CST.skill.length ; i++){
		var vx = 100;
		var vy = 28;
		var numX = s.x + 18 + vx*Math.floor(i/9);
		var numY = s.y + 5  + vy *(i%9);
			
		
		ctx.fillStyle = 'white';
		
		Draw.icon('skill.' + CST.skill[i],numX,numY,20);
		ctx.fillText(player.skill.lvl[CST.skill[i]],numX+30,numY);
		
		if(Collision.ptRect(Collision.getMouse(0),[numX,numX+vx,numY,numY+vy])){
			var mouseover = CST.skill[i];
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
		
		if(lvl < CST.exp.length){
			var expNext = CST.exp[lvl+1]-exp;
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
		var str = '<span style="color:white; text-decoration:underline;">' + 'Friend List' + '</span>';
		
		str += '<div style="height:190px" class="onlyTextScroll">';
		
		for(var i in list){
			var color = list[i].online ? '#00FF00' : '#FF4D49';
			var title = i + ' : ' + list[i].nick + '  |  '+ list[i].comment;
			var onclick = list[i].online ? '@' + i + ',' : '$fl,offlinepm,' + i + ',';
			
			str += 
			'<span ' + 
			'class="shadow" ' + 
			'style="color:' + color + '" ' +
			'onclick="Input.add(\'' + onclick + '\')' + '" ' + 
			'oncontextmenu="Draw.tab.friend.rightClick(\'' + i + '\')' + '" ' + 
			'title="'+ title + '" ' + 
			'>' + i + 
			'</span><br>';
			
		}
		str += '</div>'
		hf.text.innerHTML = str;
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
		
		var str = '<span style="color:white; text-decoration:underline;">' + 'Preferences' + '</span>';		
		str += '<div style="height:230px; color:white; font:16px Kelly Slab;" class="shadow onlyTextScroll">';
		
		str += '<span title="Change Key Bindings" onclick="Command.send(\'win,open,binding\')">*Key Bindings*</span><br>';
		str += '<span title="Open Account Management Window" onclick="$(\'#accountManagement\').dialog(\'open\')">*Account Management*</span><br>';
		
		str += 'Volume:' +		
		'<span title="Increase volume" onclick="Draw.tab.pref.volume(10)"> + </span>' + 
		'<span title="Decrease volume" onclick="Draw.tab.pref.volume(-10)"> - </span><br>'
		
		
		//Regular Pref
		for(var i in list){
			var pref = list[i];
			
			var name = pref.name;
			var value = main.pref[i];
			
			var str2 = '$pref,' + i + ',';
			var str3 = pref.description + ' (' + pref.min + '-' + pref.max + ')';
			
			var onclick = 'onclick="Input.add(\'' + str2 + '\')' + '" ';
			if(pref.min === 0 && pref.max === 1){
				var newvalue = value === 1 ? 0 : 1;
				onclick = 'onclick="Command.send(\'pref,' + i + ',' + newvalue + '\')" ';
			}
			str += 
			'<span ' + onclick + 'title='+ str3.q() + '>' +		
				name + ' : ' + value + 
			'</span><br>';
			
		}
		str += '</div>';
		hf.text.innerHTML = str;
	}	
}

Draw.tab.pref.volume = function(num){
	Command.send('pref,volumeMaster,' + (main.pref.volumeMaster+num).mm(0,100));	
}












