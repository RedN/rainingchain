//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Tk','Combat','Input','Chat','Collision','Button','Command','Passive']));

Draw.window = function(){ ctxrestore();
	html.$abilityWinAttackDmg[0].style.visibility = 'hidden';	//set in Draw.window.ability.action.attack	//BAD
	for(var i in main.windowList){
		if(main.windowList[i]){
			Draw.window[i]();
			break;
		}
	}
}

Draw.window.main = function(title){ ctxrestore();	
	var s = Draw.window.main.constant(); 	
	ctx = List.ctx.win;
	ctx.fillStyle = 'black';
	
	var hw = html.win;
	var t = hw.title;
	var titlesize = 40;
	hw.div.style.visibility = 'visible';
	hw.div.style.left = s.x + 'px'; 
	hw.div.style.top = s.y + 'px'; 
	
	//Frame
	ctx.globalAlpha = 0.95;
	ctx.drawImage(Img.frame.window,0,0,Img.frame.window.width,Img.frame.window.height,s.x-30,s.y-25,s.w+75,s.h+25);
	ctx.globalAlpha = 1;
	
	//Title
	t.style.textAlign = 'center';
	t.style.textDecoration = 'underline';
	t.style.width = s.w + 'px';
	t.style.height = titlesize + 'px';
	t.style.font = titlesize + 'px Kelly Slab';
	
	var titlename = title;
	if(typeof title === 'string'){ t.innerHTML = title; } else {
		if(main.hideHUD.passive) delete title.passive;
	
		t.style.textDecoration = 'none';
		var str = '';
		for(var i in title){
			if(title[i]) titlename = i;
			var text = 'Open ' + i.capitalize() + ' Window';
			str += 
			'<span ' + 
			'style="text-decoration:' + (title[i] ? 'underline' : 'none') + '" ' +
			'onclick="' + "main.sfx='menu'; " + 'Command.send(\'' + 'win,open,' + i + '\')' + '" ' + 
			'title="' + text + '"' +
			'>' + i.capitalize() + 
			'</span>';
			str += ' - ';
		}
		str = str.slice(0,-3);
		Draw.setInnerHTML(t,str);
	}
	
	//Help
	titlename = titlename.toLowerCase()
	if(titlename === 'offensive' || titlename === 'defensive') titlename = 'stat';
	if(!titlename.have('Quest')) Help.icon('window_' + titlename,s.x + s.w -45,s.y);	//TOFIX BAD quest break
		
	//Close
	Draw.icon('system.close',s.x + s.w -20,s.y,20);	
	Button.creation(0,{
		"rect":[s.x + s.w -20,s.x + s.w,s.y,s.y+20],
		"left":{"func":Command.send,"param":['win,close']},
		'text':'Close',
		'sfx':'close',
	});
		
	return s;
}

Draw.window.main.constant = function(){
	var startX = 20;
	var startY = 20;
	var sizeX = 1020;
	var sizeY = 576;
	var marginX = 15;
	var marginY = 60;
	return {
		'x':startX,
		'y':startY,
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
}

Draw.window.bank = function (){ ctxrestore();
	var s = Draw.window.main('Bank');	
	ctx = List.ctx.win;
	
	var numX = s.mx+200;
	var numY = s.y+15;
	
	var prefAmount = main.pref.bankTransferAmount;
	var string = 'Shift-Left Click Amount: ' + prefAmount;
	
	ctx.font = '25px Kelly Slab';
	ctx.fillText(string,numX-150,numY);
	Button.creation(0,{
		"rect":[numX,numX+ctx.measureText(string).width,numY,numY+25],
		"left":{"func":Input.add,"param":['$pref,bankTransferAmount,']},
		"text":'Change Shift-Left Click Amount.'
		});	
	
	//Draw Items
	for (var i = 0 ; i < main.bankList.data.length ; i++){
		var d = main.bankList.data[i];
		if(!d.length) continue;
		var amountX = Math.floor(s.w/40)-1;
		var numX = s.x + 40 + 40*(i%amountX);
		var numY = s.y + 70 + 40*Math.floor(i/amountX);
		
		Button.creation(0,{
			"rect":[numX,numX+32,numY,numY+32],
			"left":{"func":Command.send,"param":['win,bank,click,left,' + i]},
			"shiftLeft":{"func":Command.send,"param":['win,bank,click,shiftLeft,' + i+ ',' + main.pref.bankTransferAmount]},
			"shiftRight":{"func":Command.send,"param":['win,bank,click,shiftLeft,' + i + ',' + 999999999]},
			"right":{"func":Command.send,"param":['win,bank,click,right,' + i]},
			'text':'Withdraw ' + d[2]
		});	
		Draw.item(d,numX,numY);
	}
	
	
}

Draw.window.trade = function (){ ctxrestore();
	html.tradeWin.div.style.visibility = 'visible';
	var s = Draw.window.main('Trade');	
	ctx = List.ctx.win;

	/*
	//change amount:
		
	var numX = s.mx+200;
	var numY = s.y+15;
	
	var prefAmount = main.pref.bankTransferAmount;
	var string = 'X-Amount: ' + prefAmount;
	
	ctx.setFont(25);
	ctx.fillText(string,numX,numY);
	*/
	
	//##################################
	
	var myList = main.tradeList;
	var hisList = main.tradeInfo;
	
	if(!myList.data) return ERROR(3,'no myList');
	if(!hisList.data) return ERROR(3,'no hisList');
	
	var s = Draw.window.main('Trading ' + main.windowList.trade);	//bad	
	ctx = List.ctx.win;
		
	//Draw Own Items
	for (var i = 0 ; i < myList.data.length ; i++){
		if(!myList.data[i].length) continue;
		var numX = s.x + 160 + 65*(i%4);
		var numY = s.y + 70 + 65*Math.floor(i/4);
		
		Button.creation(0,{
			"rect":[numX,numX+56,numY,numY+56],
			"left":{"func":Command.send,"param":['win,trade,click,left,' + i]},
			"right":{"func":Command.send,"param":['win,trade,click,right,' + i]},
			'text':'Withdraw ' + myList.data[i][2]
		});	
		
		
		Draw.item(myList.data[i],numX,numY,56);
		
	}	
	
	//Draw Other Items
	for (var i = 0 ; i < hisList.data.length ; i++){
		if(!hisList.data[i].length) continue;
		var numX = s.x + 570 + 65*(i%4);
		var numY = s.y +  70 + 65*Math.floor(i/4);
			
		Button.creation(0,{
			"rect":[numX,numX+56,numY,numY+56],
			'text':hisList.data[i][2]
		});	
		
		Draw.item(hisList.data[i],numX,numY,56);
	}	
	
	//Accept
	html.tradeWin.btnSelf.style.top = (500 + -25) + 'px';
	html.tradeWin.btnSelf.style.left = (100 + 100) + 'px';
	Draw.setInnerHTML(html.tradeWin.btnSelf,myList.acceptTrade ? 'Refuse Trade' : 'Accept Trade');
	
	html.tradeWin.btnOther.style.top = (500 + -25) + 'px';
	html.tradeWin.btnOther.style.left = (100 + 500) + 'px';
	Draw.setInnerHTML(html.tradeWin.btnOther,hisList.acceptTrade ? 'Other player is accepting trade' : 'Waiting for other player...');
	
	
	
	/*
	var numX = s.x+160; 
	var numY = s.h-50; 
	var wi = 250; 
	var he = 35;
	
	//My button
	Button.creation(0,{
		"rect":[numX,numX+wi,numY,numY+he],
		'text':myList.acceptTrade ? 'Click to Refuse Trade' : 'Click to Accept Trade',
		"left":{"func":Command.send,"param":['win,trade,toggle']},
	});
	
	
	ctx.textAlign = "center";
	ctx.setFont(25);
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = 'yellow';
	
	ctx.fillText('Trade State ',numX+wi/2,numY+3);
	ctx.strokeRect(numX,numY,wi,he);
		
	Draw.icon(hisList.acceptTrade ? 'system.heart' : 'system.close',numX+7,numY+7,20);

	var numX = s.x+570; var numY = s.h-50; var wi = 250; var he = 35;
	ctx.fillText('Trade State ',numX+wi/2,numY+3);
	ctx.strokeRect(numX,numY,wi,he);
	
	
	Draw.icon(hisList.acceptTrade ? 'system.heart' : 'system.close',numX+7,numY+7,20);
	*/
	
}

Draw.window.binding = function (){ ctxrestore();
	var s = Draw.window.main('Key Bindings');	
	ctx = List.ctx.win;
	
	var hq = html.bindingWin;
	hq.div.style.visibility = 'visible';
	hq.div.style.left = s.mx + 'px'; 
	hq.div.style.top = s.my + 'px'; 
	
	//Table
	hq.table.style.left = 50 + 'px'; 
	hq.table.style.top = 0 + 'px'; 
	
	var str = '<table>';
	
	str += '<tr>';
	str += '<td>Action</td>'
	str += '<td>Key Id</td>'
	str += '<td>Key Name</td>'
	str += '</tr>';
	
	var list = [
		{'id':'move','name':'Move','list':['Right','Down','Left','Up']},
		{'id':'ability','name':'Ability','list':[0,1,2,3,4,5]}
	];
	
	for(var j in list){
		var info = list[j];
		for(var i = 0; i < Input.key[info.id].length; i++){
			var keycode = Input.key[info.id][i][0].toString();
			var name = keycode.keyCodeToName();	//
			if(name != keycode.keyCodeToName(true)) name += ' - (' + keycode.keyCodeToName(true) + ')';	// != important 
			
			if(Input.binding[info.id] === i){
				keycode = '***';
				name = '***';
			}
			
			var str2 = 'Change Key Binding for ' + info.name + ' ' + info.list[i];
			
			str += '<tr ' +
					'onclick="Input.binding.' + info.id + ' = ' + i + ';" ' + 
					'title="' + str2 + '"' +
					'>'
			str += '<td>' + info.name + ' ' + info.list[i] + '</td>'
			str += '<td>' + keycode + '</td>'
			str += '<td>' + name + '</td>'
			str += '</tr>';
		}
	}
	str += '</table>';
	
	Draw.setInnerHTML(hq.table,str);
	
	//Template
	var array = ['QWERTY','AZERTY','NUMBER'];
	var str = '<font size="6">Default Bindings</font>';
	for(var i = 0; i < array.length; i++){
		str  += '<div ' +
				'onclick="Input.init(' + i + ');" ' +
				'style="width=auto"' + 
				'title="Change for ' + array[i] + '"' + 
				'>' +
				'<font size="4"> -' + array[i] + '</font>' +
				'</div>';	
	}
	Draw.setInnerHTML(hq.template,str);
	
	hq.template.style.left = 600 + 'px'; 
	hq.template.style.top = 25 + 'px'; 
	
}

//{ Stat
Draw.window.offensive = function (){ ctxrestore();
	var hover = Draw.window.stat('offensive');	
	if(hover !== undefined){ Draw.window.stat.hover(hover,'offensive'); }
	
}

Draw.window.defensive = function (){ ctxrestore();
	var hover = Draw.window.stat('defensive');	
	
	//Final (RUSHED)
	var def = Actor.getDef(player);
	var fontSize = 20;
	ctx.setFont(fontSize);
	var s = {zx:700,zy:400};
	ctx.fillTextU("Overall Defence",s.zx+20,s.zy-10);
	s.zy += fontSize;
	
	var count = 0;
	for(var i in def.ratio){
		var numX = s.zx + (count%3)*125-100;
		var numY = s.zy + Math.floor(count/3)*fontSize*1.1;
		ctx.fillStyle = CST.element.toColor[i];
		ctx.roundRect(numX-5,numY,125,fontSize*1.1);
		ctx.fillStyle = 'black';
		ctx.fillText(i.capitalize() + ': ' + Tk.round(def.ratio[i]*def.main),numX,numY);		
		count++;
	}
	ctx.fillStyle = 'black';
	
	if(hover !== undefined){ Draw.window.stat.hover(hover,'defensive'); }
	
}

Draw.window.stat = function(type){ ctxrestore();
	var obj = {'offensive':0,'defensive':0,'ability':0,'passive':0}; obj[type] = 1;
	var s = Draw.window.main(obj);	
	
	//Content
	var array = [];
	for(var i = 0 ; i < Draw.window.stat.list[type].length ; i++){
		var info = Draw.window.stat.list[type][i];  
		array.push([
			'<span id="Drawwindowstatlist' + type + i + '"></span>',	//then add icon to that...
			info.name + ':',
			info.string(),
		]);
	}
	var hqc = html.statWin.left;
	hqc.style.visibility = 'visible';
	var str = '<table class="CSSTableGenerator">' + Tk.arrayToTable(array,0,0) + '</table>';
	Draw.setInnerHTML(hqc,str);
	//Draw.icon(info.icon,numX-30,numY,20)
	/*
	if(Collision.ptRect(Collision.getMouse(),[numX,numX+500,numY,numY+30])){
			var hover = i;
		}
	*/
	/*
	//Bottom, custom effects	//TOFIX add title
	var numX = s.x + 10;
	var numY = s.y + 60 + 30* 15;
	var str = 'Custom Effects: ';
	for(var i in player.statCustom){
		if(player.statCustom[i] && Db.statCustom[i].displayInWindow)
			str += Db.statCustom[i].name + ', ';
	}
	str = str.slice(0,-2);
	ctx.font = '30px Kelly Slab';
	ctx.fillText(str,numX,numY);
	
	return hover;
	*/
}

Draw.window.stat.list = {
'offensive':[
	{'name':'Melee','icon':'element.melee','stat':[{'name':'x','stat':'dmg-melee-x'},{'name':'*','stat':'dmg-melee-*'},{'name':'^','stat':'dmg-melee-^'},{'name':'+','stat':'dmg-melee-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','melee')})},
	{'name':'Range','icon':'element.range','stat':[{'name':'x','stat':'dmg-range-x'},{'name':'*','stat':'dmg-range-*'},{'name':'^','stat':'dmg-range-^'},{'name':'+','stat':'dmg-range-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','range')})},
	{'name':'Magic','icon':'element.magic','stat':[{'name':'x','stat':'dmg-magic-x'},{'name':'*','stat':'dmg-magic-*'},{'name':'^','stat':'dmg-magic-^'},{'name':'+','stat':'dmg-magic-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','magic')})},
	{'name':'Fire','icon':'element.fire','stat':[{'name':'x','stat':'dmg-fire-x'},{'name':'*','stat':'dmg-fire-*'},{'name':'^','stat':'dmg-fire-^'},{'name':'+','stat':'dmg-fire-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','fire')})},
	{'name':'Cold','icon':'element.cold','stat':[{'name':'x','stat':'dmg-cold-x'},{'name':'*','stat':'dmg-cold-*'},{'name':'^','stat':'dmg-cold-^'},{'name':'+','stat':'dmg-cold-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','cold')})},
	{'name':'Lightning','icon':'element.lightning','stat':[{'name':'x','stat':'dmg-lightning-x'},{'name':'*','stat':'dmg-lightning-*'},{'name':'^','stat':'dmg-lightning-^'},{'name':'+','stat':'dmg-lightning-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','lightning')})},
	
	{'name':'Weapon','icon':'element.melee2','stat':[{'name':'Mace','stat':'weapon-mace'},{'name':'Spear','stat':'weapon-spear'},{'name':'Sword','stat':'weapon-sword'}],'string':(function(){ return 'Mace: ' + Tk.round(player.boost.list['weapon-mace'].base,2,1) + ', Spear: ' + Tk.round(player.boost.list['weapon-spear'].base,2,1) + ', Sword: ' + Tk.round(player.boost.list['weapon-sword'].base,2,1)						})},
	{'name':'Weapon','icon':'element.range2','stat':[{'name':'Bow','stat':'weapon-bow'},{'name':'Boomerang','stat':'weapon-boomerang'},{'name':'Crossbow','stat':'weapon-crossbow'}],'string':(function(){ return 'Bow: ' + Tk.round(player.boost.list['weapon-bow'].base,2,1) + ', Boom.: ' + Tk.round(player.boost.list['weapon-boomerang'].base,2,1) + ', CBow: ' + Tk.round(player.boost.list['weapon-crossbow'].base,2,1)						})},
	{'name':'Weapon','icon':'element.magic2','stat':[{'name':'Wand','stat':'weapon-wand'},{'name':'Staff','stat':'weapon-staff'},{'name':'Orb','stat':'weapon-orb'}],'string':(function(){ return 'Wand: ' + Tk.round(player.boost.list['weapon-wand'].base,2,1) + ', Staff: ' + Tk.round(player.boost.list['weapon-staff'].base,2,1) + ', Orb: ' + Tk.round(player.boost.list['weapon-orb'].base,2,1)						})},
	
	{'name':'Burn','icon':'status.burn','stat':[{'name':'Chance','stat':'burn-chance'},{'name':'Magn','stat':'burn-magn'},{'name':'Time','stat':'burn-time'}],'string':(function(){ return Draw.window.stat.list.status('off','burn')})},
	{'name':'Chill','icon':'status.chill','stat':[{'name':'Chance','stat':'chill-chance'},{'name':'Magn','stat':'chill-magn'},{'name':'Time','stat':'chill-time'}],'string':(function(){ return Draw.window.stat.list.status('off','chill')})},
	{'name':'Stun','icon':'status.stun','stat':[{'name':'Chance','stat':'stun-chance'},{'name':'Magn','stat':'stun-magn'},{'name':'Time','stat':'stun-time'}],'string':(function(){ return Draw.window.stat.list.status('off','stun')})},
	{'name':'Knockback','icon':'status.knock','stat':[{'name':'Chance','stat':'knock-chance'},{'name':'Magn','stat':'knock-magn'},{'name':'Time','stat':'knock-time'}],'string':(function(){ return Draw.window.stat.list.status('off','knock')})},
	{'name':'Bleed','icon':'status.bleed','stat':[{'name':'Chance','stat':'bleed-chance'},{'name':'Magn','stat':'bleed-magn'},{'name':'Time','stat':'bleed-time'}],'string':(function(){ return Draw.window.stat.list.status('off','bleed')})},
	{'name':'Drain','icon':'status.drain','stat':[{'name':'Chance','stat':'drain-chance'},{'name':'Magn','stat':'drain-magn'},{'name':'Time','stat':'drain-time'}],'string':(function(){ return Draw.window.stat.list.status('off','drain')})},
	
	
	{'name':'Leech Hp','icon':'resource.hp','stat':[{'name':'Chance','stat':'leech-chance'},{'name':'Magn','stat':'leech-magn'}],'string':(function(){ return 'Chance: ' + Tk.round(player.boost.list['leech-chance'].base,2,1) + ', Magn: ' + Tk.round(player.boost.list['leech-magn'].base,2,1); })},
	{'name':'Critical','icon':'resource.hp','stat':[{'name':'Chance','stat':'crit-chance'},{'name':'Magn','stat':'crit-magn'}],'string':(function(){ return 'Chance: ' + Tk.round(player.boost.list['crit-chance'].base,2,1) + ', Magn: ' + Tk.round(player.boost.list['crit-magn'].base,2,1); })},
	
	{'name':'Bullet','icon':'offensive.bullet','stat':[{'name':'Amount','stat':'bullet-amount'},{'name':'Spd','stat':'bullet-spd'}],'string':(function(){ return 'Amount: ' + Tk.round(player.boost.list['bullet-amount'].base,2,1) + ', Spd: ' + Tk.round(player.boost.list['bullet-spd'].base,2,1); })},
	{'name':'Strike','icon':'offensive.bullet','stat':[{'name':'AoE','stat':'bullet-amount'},{'name':'Range','stat':'aim'},{'name':'Max','stat':'aim'}],'string':(function(){ return 'AoE: ' + Tk.round(player.boost.list['strike-size'].base,2,1) + ', Range: ' + Tk.round(player.boost.list['strike-range'].base,2,1) + ', Max: ' + Tk.round(player.boost.list['strike-maxHit'].base,2,1); })},
	{'name':'Summon','icon':'summon.wolf','stat':[{'name':'Amount','stat':'summon-amount'},{'name':'Time','stat':'summon-time'},{'name':'Attack','stat':'summon-atk'},{'name':'Defence','stat':'summon-def'}],'string':(function(){ return '#:' + Tk.round(player.boost.list['summon-amount'].base,2,1) + ', Time:' + Tk.round(player.boost.list['summon-time'].base,2,1) + ', A:' + Tk.round(player.boost.list['summon-atk'].base,2,1)+ ', D:' + Tk.round(player.boost.list['summon-def'].base,2,1); })},

	{'name':'Atk Spd','icon':'offensive.atkSpd','stat':[{'name':'Atk Spd','stat':'atkSpd'}],'string':(function(){ return Tk.round(player.boost.list['atkSpd'].base,2,1); })},
	
],

'defensive':[
	{'name':'Melee','icon':'element.melee','stat':[{'name':'x','stat':'def-melee-x'},{'name':'*','stat':'def-melee-*'},{'name':'^','stat':'def-melee-^'},{'name':'+','stat':'def-melee-+'}],'string':(function(){ return Draw.window.stat.list.element('def','melee')})},
	{'name':'Range','icon':'element.range','stat':[{'name':'x','stat':'def-range-x'},{'name':'*','stat':'def-range-*'},{'name':'^','stat':'def-range-^'},{'name':'+','stat':'def-range-+'}],'string':(function(){ return Draw.window.stat.list.element('def','range')})},
	{'name':'Magic','icon':'element.magic','stat':[{'name':'x','stat':'def-magic-x'},{'name':'*','stat':'def-magic-*'},{'name':'^','stat':'def-magic-^'},{'name':'+','stat':'def-magic-+'}],'string':(function(){ return Draw.window.stat.list.element('def','magic')})},
	{'name':'Fire','icon':'element.fire','stat':[{'name':'x','stat':'def-fire-x'},{'name':'*','stat':'def-fire-*'},{'name':'^','stat':'def-fire-^'},{'name':'+','stat':'def-fire-+'}],'string':(function(){ return Draw.window.stat.list.element('def','fire')})},
	{'name':'Cold','icon':'element.cold','stat':[{'name':'x','stat':'def-cold-x'},{'name':'*','stat':'def-cold-*'},{'name':'^','stat':'def-cold-^'},{'name':'+','stat':'def-cold-+'}],'string':(function(){ return Draw.window.stat.list.element('def','cold')})},
	{'name':'Lightning','icon':'element.lightning','stat':[{'name':'x','stat':'def-lightning-x'},{'name':'*','stat':'def-lightning-*'},{'name':'^','stat':'def-lightning-^'},{'name':'+','stat':'def-lightning-+'}],'string':(function(){ return Draw.window.stat.list.element('def','lightning')})},
			
	{'name':'Speed','icon':'defensive.speed','stat':[{'name':'Max','stat':'maxSpd'}],'string':(function(){ return Tk.round(player.boost.list['maxSpd'].base,2,1)})},
	{'name':'Pick Radius','icon':'defensive.pickup','stat':[{'name':'Pick Radius','stat':'pickRadius'}],'string':(function(){ return Tk.round(player.boost.list['pickRadius'].base,2,1)})},
	{'name':'Item Find','icon':'defensive.item','stat':[{'name':'Quality','stat':'item-quality'},{'name':'Quantity','stat':'item-quantity'},{'name':'Rarity','stat':'item-rarity'}],'string':(function(){ return 'Qual.: ' + Tk.round(player.boost.list['item-quality'].base,2,1) + ', Quant.: ' + Tk.round(player.boost.list['item-quantity'].base,2,1)+ ', Rarity: ' + Tk.round(player.boost.list['item-rarity'].base,2,1)})},

	{'name':'Life','icon':'resource.hp','stat':[{'name':'Max','stat':'hp-max'},{'name':'Regen','stat':'hp-regen'}],'string':(function(){ return 'Max: ' + Tk.round(player.boost.list['hp-max'].base,0,1) + ', Regen: ' + Tk.round(player.boost.list['hp-regen'].base,2,1)})},
	{'name':'Mana','icon':'resource.mana','stat':[{'name':'Max','stat':'mana-max'},{'name':'Regen','stat':'mana-regen'}],'string':(function(){ return 'Max: ' + Tk.round(player.boost.list['mana-max'].base,0,1) + ', Regen: ' + Tk.round(player.boost.list['mana-regen'].base,2,1)})},
	
	
	
],

};

Draw.window.stat.list.element = function(type,name){
	type += '-';
	var b0 = Tk.round(player.boost.list[type + name + '-x'].base,2,1);
	var b1 = Tk.round(player.boost.list[type + name + '-*'].base,2,1);
	var b2 = Tk.round(player.boost.list[type + name + '-^'].base,2,1);
	var b3 = Tk.round(player.boost.list[type + name + '-+'].base,2,1);
	var sum = Tk.round(Math.pow(player.boost.list[type + name + '-x'].base*player.boost.list[type + name + '-*'].base,player.boost.list[type + name + '-^'].base) + player.boost.list[type + name + '-+'].base,3);
	var string = '( ' + b0 + ' * ' + b1 + ' ) ^ ' + b2 + ' + ' + b3 + ' = ' + sum;
	if(main.hideHUD.advancedStat) string = sum;
	return string
}

Draw.window.stat.list.status = function(type,name){
	if(type === 'off'){
		var b0 = Tk.round(player.boost.list[name + '-chance'].base,2,1);
		var b1 = Tk.round(player.boost.list[name + '-magn'].base,2,1);
		var b2 = Tk.round(player.boost.list[name + '-time'].base,2,1);

		var string = '%: ' + b0 + ', Magn: ' + b1 + ', Time: ' + b2;
		return string
	}
	if(type === 'def'){
		var b0 = Tk.round(player.boost.list['resist-' + name].base,2,1);
		
		var string = 'Resist: ' + b0 
		return string
	}
}

Draw.window.stat.hover = function(hover,type){ ctxrestore();
	var s = Draw.window.main.constant();
	var numX = s.x + 550 + Math.floor(hover/15) * -450-15;
	var numY = s.y + 70;

	//Frame
	ctx = List.ctx.pop;
	ctx.drawImage(Img.frame.postit,0,0,Img.frame.postit.width,Img.frame.postit.height,numX,numY-15,400,500);
	
	var info = Draw.window.stat.list[type][hover];  
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.setFont(25);
	ctx.fillText(info.name + ':',numX + 200,numY+10);
	ctx.textAlign = 'left';
	ctx.setFont(25);
	Draw.icon(info.icon,numX+50,numY,48);	//not working ?
	Draw.icon(info.icon,numX+400-100,numY,48);
	
	numY += 50;
			
	var statList = info.stat;
	
	for(var k in statList){
		var count = 0;
		for(var i in player.permBoost){	//i = source
			if(i.indexOf('Q-') === 0){ continue; } //would spam with quest reward otherwise
			for(var j in player.permBoost[i]){
				if(player.permBoost[i][j].stat === statList[k].stat){
					ctx.fillText(statList[k].name + ' : ' + i + ' => +' + Tk.round(player.permBoost[i][j].value,4,1),numX+25,numY);
					numY += 30;
					count++;
				}
			}
		}
	}
}
//}

//{ Ability
Draw.window.ability = function (){ ctxrestore();
	var s = Draw.window.main({'offensive':0,'defensive':0,'ability':1,'passive':0});
	ctx = List.ctx.win;
	var ha = html.abilityWin;
	ha.div.style.visibility = 'visible';
	ha.div.style.left = s.mx + 'px'; 
	ha.div.style.top = s.my + 'px'; 
	
	var diffX = 100;
	var diffY = 100;
	
	Draw.old.abilityShowed = Draw.old.abilityShowed || Object.keys(player.abilityList)[0];
	if(typeof Draw.old.abilityShowed === 'string'){
		Draw.old.abilityShowed = Db.query('ability',Draw.old.abilityShowed);
	}
	if(!Draw.old.abilityShowed) return;
	
	
	Draw.window.ability.leftSide();
	Draw.window.ability.abilityList(diffX);
	Draw.window.ability.generalInfo(diffX,diffY);
	

	if(Draw.old.abilityShowed.action){
		Draw.window.ability.action(diffX,diffY + 120);
	}
	
}

Draw.window.ability.leftSide = function(){ ctxrestore();
	var s = Draw.window.main.constant(); 
	
	
	ctx.setFont(25);
	ctx.fillText('Active',s.x + 12,s.y + 100-65);
	ctx.fillText('Abilities',s.x + 12,s.y + 100-35);

		
	for(var i = 0 ; i < Input.key.ability.length ; i++){
		var numX = s.x + 15;
		var numY = s.y + 100 + 30 * i;
		
		
		ctx.fillText(Input.key.ability[i][0].toString().keyCodeToName(),numX,numY);
		
		var ability = Db.query('ability',player.ability[i]);
		if(ability){
			Draw.icon(ability.icon,numX+45,numY,20);
		} else {
			ctx.strokeStyle = 'black';
			ctx.strokeRect(numX+45,numY,20,20);
		}	
	
		var text = '';
		if(ability){ text = ability.name; }
		
		
		var button = ('' + Input.key.ability[i][0]).keyCodeToName();
		button = button.keyCodeToName(true) || button;
		
		if(button === 'l') button = 'Left Click'; 
		if(button === 'r') button = 'Right Click';
		if(button === 'sl') button = 'Shift-Left Click'; 
		if(button === 'sr') button = 'Shift-Right Click';
		if(button === '_') button = 'Space';
		
		Button.creation(0,{
			"rect":[numX, numX+45 + 32, numY, numY + 32 ],
			"left":{"func":Command.send,"param":['win,ability,swap,' + Draw.old.abilityShowed.id + ',' + i ]},
			'text':"Assign " + Draw.old.abilityShowed.name + " to " + button
			});	
	}
	
	ctx.fillText('Change',s.x + 12,s.y + 100-65+250);
	ctx.fillText('Binding',s.x + 12,s.y + 100-35+250);
	
	Button.creation(0,{
		"rect":[s.x + 12, s.x + 12+90, s.y + 100-65+250, s.y + 100-65+250+60 ],
		"left":{"func":function(){ Command.send('win,open,binding');},"param":[]},
		'text':"Open Key Bindings Window"
		});	
}

Draw.window.ability.abilityList = function(diffX){ ctxrestore();
	var s = Draw.window.main.constant();
	s.mx += diffX; 
	
	var ha = html.abilityWin;
	var charY = 22;
	var ats = Draw.old.abilityTypeShowed;
	
	//Subtitle
	ha.subtitle.style.left = diffX + 'px'; 
	ha.subtitle.style.top = 0 + 'px'; 
	ha.subtitle.style.font = charY + 'px Kelly Slab';
	ha.subtitle.style.width = 400 + 'px';
	ha.subtitle.style.height = charY*1.2 + 'px';
	
	var obj = {'all':[],'attack':[],'boost':[],'dodge':[],'heal':[],'summon':[]};
	for(var i in player.abilityList){
		var ability = Db.query('ability',i);
		if(ability){
			obj[ability.type].push(ability);
			obj.all.push(ability);
		}
	}	
	
	var str = 'List of Abilities: ';
	for(var j in obj){
		var numX = s.x + 50;
		var numY = s.y;
		var title = 'Display ' + j.capitalize() + ' Abilities';
		str += 
		'<span ' + 
		'style="text-decoration:' + (j === ats ? 'underline' : 'none') + '" ' +
		'onclick="Draw.old.abilityTypeShowed = \'' + j +  '\';' + '" ' + 
		'title="' + title + '"' +
		'>' + j.capitalize() + 
		'</span>';
		str += ' - '
	}	
	str = str.slice(0,-3);
	
	Draw.setInnerHTML(ha.subtitle,str);
		
		
	//Drawing
	for(var j in obj[ats]){
		var numX = s.zx + diffX + +j%20 * 35;
		var numY = s.zy + charY*1.2 + Math.floor(+j/20) * 35;
				
		var ability = obj[ats][j];	
		Draw.icon(ability.icon,numX,numY,30);
		
		Button.creation(0,{
			"rect":[numX, numX + 30, numY, numY + 30 ],
			"left":{
				"func":(function(id){ Draw.old.abilityShowed = Db.query('ability',id); }),
				"param":[ability.id]
			},
			'text':'Select Ability: ' + ability.name
		});	
		
	}
}
	
Draw.window.ability.generalInfo = function(diffX,diffY){ ctxrestore();
	var s = Draw.window.main.constant(); 
	s.x += diffX;
	s.y += diffY;
	s.zx += diffX;
	s.zy += diffY;
	
	//Line
	ctx.fillRect(s.zx-10,s.zy-10,s.dw-200,1);
	
	//Icon
	var ab = Draw.old.abilityShowed;
	var icon = 100;
	Draw.icon(ab.icon,s.zx,s.zy,icon);
	
	//General Info
	var gi = html.abilityWin.generalinfo;
	var charY = 20;
	gi.style.left = diffX + icon + 10 + 'px'; 
	gi.style.top = diffY + 'px'; 
	gi.style.font = charY + 'px Kelly Slab';
	gi.style.width = 500 + 'px';
	gi.style.height = 100 + 'px';
	
	var	str = 
	'<span style="font:30px Kelly Slab">' + ab.name + '</span>' + '<br>' +
	' - Time/Cast: ' + Tk.round(ab.periodOwn/25,2) + ' Sec<br>' +
	' - Cost: ' ;
	if(ab.costMana && !ab.costHp) str += Tk.round(ab.costMana,1) + ' Mana'; 
	if(ab.costMana && ab.costHp) str += Tk.round(ab.costMana,1) + ' Mana, ' + Tk.round(ab.costHp,1) + ' Life';
	if(!ab.costMana && ab.costHp) str += Tk.round(ab.costHp,1) + ' Life';
	if(!ab.costMana && !ab.costHp) str += 'None';
	
	//Orb
	if(!main.hideHUD.advancedAbility) str += str2;
	
	
	Draw.setInnerHTML(gi,str);
}


Draw.window.ability.action = function(diffX,diffY){ ctxrestore();
	var ab = Draw.old.abilityShowed;
	if(ab.action.funcStr === 'Combat.attack'){ Draw.window.ability.action.attack(diffX,diffY);}
	if(ab.action.funcStr === 'Combat.boost'){ Draw.window.ability.action.boost(diffX,diffY);}
	if(ab.action.funcStr === 'Combat.summon'){ Draw.window.ability.action.summon(diffX,diffY);}
	if(ab.action.funcStr === 'Combat.heal'){ Draw.window.ability.action.heal(diffX,diffY);}
	if(ab.action.funcStr === 'Combat.dodge'){ Draw.window.ability.action.dodge(diffX,diffY);}
}

Draw.window.ability.action.attack = function(diffX,diffY){  ctxrestore();
	var s = Draw.window.main.constant(); 
	s.x += diffX;
	s.y += diffY;
	s.zx += diffX;
	s.zy += diffY;
	
	
	var weapon = Db.query('equip',player.weapon);
	if(!weapon){return;} //waiting for query answer
	
	
	var ab = Draw.old.abilityShowed;
	var preatk = Tk.deepClone(ab.action.param);
	var atk = Combat.attack.mod(player,Tk.deepClone(preatk));
	
	var fontSize = 30;	
	ctx.setFont(30);
	
	var el = html.$abilityWinAttackDmg;
	el[0].style.visibility = 'visible';
	el[0].style.left = s.x + 500 - 175 + 'px';
	el[0].style.top = s.y - 140 + 'px';
	el[0].style.font = '30px Kelly Slab';
	el[0].innerHTML = '';
	
	el.append('Ability: &nbsp;');
	for(var i in preatk.dmg.ratio) if(preatk.dmg.ratio[i]){ var element = i; break; }
	if(!element) return ERROR(4,'ability with no element');
	el.append(Draw.icon.html('element.' + element,30,''));
	el.append(' <span title="Ability Base Damage">' + preatk.dmg.main.r(0) + '</span><br>');
	
	el.append('Weapon: ');
	var elementW = [];	for(var i in weapon.dmg.ratio) if(weapon.dmg.ratio[i] === 1.5) elementW.push(i);
	if(weapon.dmg.ratio[element] === 1.5){
		el.append(Draw.icon.html('element.' + element,30,''));
		el.append(' <span title="Weapon Base Damage">x' + weapon.dmg.main.r(1) + '</span>');
		el.append(' <span title="x1.5 Dmg Bonus because Weapon Type matches Ability Type (both ' + element.capitalize() + ')"> &nbsp;x1.5</span>');
	} else {
		var canvas = Draw.icon.html('element.' + element,30,'',null,null,0.3);
		canvas.getContext('2d').fillText('X',0,0);
		canvas.getContext('2d').fillText('X',12,12);
		canvas.getContext('2d').fillText('X',24,24);
		el.append(canvas);
		el.append(' <span title="Weapon Base Damage">x' + weapon.dmg.main.r(1) + '</span>');
		el.append(' <span title="No Bonus because Weapon Type (' + elementW[0].capitalize() + ', ' + elementW[1].capitalize() + ')' +
			' Doesn\'t Match Ability Type (' + element.capitalize() + ')"> &nbsp;x1</span>');
	}
	
	//add final
	var boost = Actor.getCombatLevelDmgMod(player);
	
	Actor.update.mastery(player);
	
	el.append(' &nbsp; &nbsp;} Final: ');
	el.append(Draw.icon.html('element.' + element,30,''));
	el.append(' ' + (preatk.dmg.main*weapon.dmg.main*weapon.dmg.ratio[element]*player.mastery.dmg[element].sum * boost).r(0));

	el.append('<br>Mastery: ');
	el.append(Draw.icon.html('element.' + element,30,''));
	el.append('<span title="From Passive Tree + Equipment"> x' + player.mastery.dmg[element].sum.r(3) + '</span>');
	
	//HERE player.skill.lvl[skill]
	el.append('&nbsp; <span title="Bonus From Your Combat Skill Levels"> x' + boost.r(3) + '</span>');
		

	//General Info
	var dmg = 0;	for(var i in atk.dmg.ratio){ dmg += atk.dmg.ratio[i]; } dmg *= atk.dmg.main;
	str = 'x' + atk.amount + ' Bullet' + (atk.amount > 1 ? 's' : '') + ' @ ' + atk.angle + '°';
	ctx.fillText(str,s.zx,s.zy);
	s.zy += fontSize;
	
	
	//Mods
	s.zy += fontSize;
	ctx.fillText('Special Effects on Hit:',s.zx,s.zy);
	s.zy += fontSize/4;
		
	for(var i in atk){
		if(atk[i] && Draw.window.ability.action.attack.modTo[i]){
			var tmp = atk[i];
			//player bonus have already been applied
			if(tmp.chance === 0) continue;
			Draw.icon(Draw.window.ability.action.attack.modTo[i].icon,s.zx,s.zy+30,30);
			ctx.fillText(' => ' + Draw.window.ability.action.attack.modTo[i].text(tmp),s.zx+35,s.zy+30);
			s.zy += fontSize;
		}
	}
	
		
}
Draw.window.ability.action.attack.modTo = {
	'burn':{icon:'status.burn',	text:(function(a){ 
		return Tk.round(a.chance*100,2) + '% chance to Burn for ' + (100-Math.pow(1-a.magn,a.time)*100).r(0) + '% Hp over ' + Tk.round(a.time/25,2) + 's.'; }),},
	'chill':{icon:'status.chill',text:(function(a){ 
		return Tk.round(a.chance*100,2) + '% chance to Chill, reducing Speed by ' + ((1-(1/a.magn))*100).r(0) + '% for ' + Tk.round(a.time/25,2) + 's.'; })},
	'stun':{icon:'status.stun',text:(function(a){ 
		return Tk.round(a.chance*100,2) + '% chance to Stun for ' + Tk.round(a.time/25,2) + 's.'; })},
	'bleed':{icon:'status.bleed',text:(function(a){ 
		return Tk.round(a.chance*100,2) + '% chance to Bleed for ' + Tk.round(a.magn*a.time,2) + ' Dmg over ' + Tk.round(a.time/25,2) + 's.'; })},
	'knock':{icon:'status.knock',text:(function(a){ 
		return Tk.round(a.chance*100,2) + '% chance to Knockback by ' + Tk.round(a.magn*a.time,2) + ' pixel over ' + Tk.round(a.time/25,2) + 's.'; })},	
	'drain':{icon:'status.drain',text:(function(a){ 
		return Tk.round(a.chance*100,2) + '% chance to Drain ' + Tk.round(a.magn*100,2) + '% Mana.'; })},
	'leech':{icon:'offensive.leech',text:(function(a){ 
		return Tk.round(a.chance*100,2) + '% chance to Life Leech ' + Tk.round(a.magn*100,2) + '% Hp'; })},
	'pierce':{icon:'offensive.pierce',text:(function(a){ 
		return Tk.round(a.chance*100,2) + '% chance to Pierce, with ' + Tk.round(100-(100-a.dmgReduc*100),0) + '% Dmg Reduction for each pierce.'; })},	
	'curse':{icon:'curse.skull',text:(function(a){ 
		return Tk.round(a.chance*100,2) + '% chance to Lower ' + Db.stat[a.boost[0].stat].name + ' by ' + Tk.round(100-a.boost[0].value*100,2) + '% for ' + Tk.round(a.boost[0].time/25,2) + 's.'; })},
	'sin':{icon:'offensive.bullet',text:(function(a){ 
		return 'Sin Bullet'; })},
	'parabole':{icon:'offensive.bullet',text:(function(a){ 
		return 'Parabole Bullet'; })},
	'nova':{icon:'offensive.bullet',text:(function(a){ 
		return 'Nova'; })},
	'boomerang':{icon:'offensive.bullet',text:(function(a){ 
		return 'Boomerang'; })},
	'onHit':{icon:'offensive.bullet',text:(function(a){ 
		return 'Explosive'; })},
	'damageIfMod':{icon:'system.heart',text:(function(a){ 
		return 'Affect Allies'; })},
	'heal':{icon:'system.heart',text:(function(a){ 
		return 'Heal for ' + Tk.stringify(a) ; })},
}

Draw.window.ability.action.boost = function(diffX,diffY){  ctxrestore();
	var s = Draw.window.main.constant(); 
	s.x += diffX;
	s.y += diffY;
	s.zx += diffX;
	s.zy += diffY;
	var ab = Draw.old.abilityShowed;
	var boost = ab.action.param.boost;
	if(!boost) return
	
	var fontSize = 40;
	
	ctx.font = fontSize + 'px Kelly Slab';

	for(var i in boost[0]){
		Draw.icon(Db.stat[boost[0][i].stat].icon,s.zx,s.zy,fontSize);
		var value = Tk.round(boost[0][i].value,2);
		if(+value >= + CST.bigInt) value = 'Infinity';
		var str = boost[0][i].type + value + ' ' + Db.stat[boost[0][i].stat].name + ' for ' + Tk.round(boost[0][i].time/25,2) + 's.';
		ctx.fillText(str,s.zx+fontSize*1.2,s.zy);
		s.zy += fontSize*1.5;
	}
	
}

Draw.window.ability.action.summon = function(diffX,diffY){  ctxrestore();
	var s = Draw.window.main.constant(); 
	s.x += diffX;
	s.y += diffY;
	s.zx += diffX;
	s.zy += diffY;
	var ab = Draw.old.abilityShowed;
	var info = ab.action.param;
	ctx.setFont(30);
	
	var str = 'Summon a ' + info[1].variant + ' ' + info[1].category + ' Level ' + info[1].lvl + ' for ' + Tk.round(info[0].time/25,2) + 's. (Up to ' + info[0].maxChild + ')';
	ctx.fillText(str,s.zx,s.zy);
}

Draw.window.ability.action.heal = function(diffX,diffY){  ctxrestore();
	var s = Draw.window.main.constant(); 
	s.x += diffX;
	s.y += diffY;
	s.zx += diffX;
	s.zy += diffY;
	var ab = Draw.old.abilityShowed;
	var info = ab.action.param;
	ctx.setFont(30);
	
	var str = '';
	for(var i in info)
		str += 'Regenerate ' + info[i] + ' ' + i.capitalize();
	ctx.fillText(str,s.zx,s.zy);
}

Draw.window.ability.action.dodge = function(diffX,diffY){  ctxrestore();
	var s = Draw.window.main.constant(); 
	s.x += diffX;
	s.y += diffY;
	s.zx += diffX;
	s.zy += diffY;
	var ab = Draw.old.abilityShowed;
	var info = ab.action.param;
	ctx.setFont(30);
	
	str = 'Invincibility for ' + info.time + ' frames and move ' + info.distance + ' pixels.';
	ctx.fillText(str,s.zx,s.zy);
}

//}

//{ Quest
Draw.window.quest = function (){ ctxrestore();
	var q = Db.query('quest',main.windowList.quest);
	var s = Draw.window.main('Quest: ' + (q ? q.name : ''));	
	if(!q) return;
	ctx = List.ctx.win;
	
	var hq = html.questWin;	
	hq.div.style.visibility = 'visible';
	
	if(Draw.window.quest.refreshIf(q,main.quest[main.windowList.quest])) 
		Draw.window.quest.refresh(s,q)
}

Draw.window.quest.refresh = function(s,q){
	var hq = html.questWin;	
	hq.div.style.left = s.mx + 'px'; 
	hq.div.style.top = s.my + 'px'; 
	
	var mq = main.quest[main.windowList.quest];
	
	s.charY = 22;
	Draw.window.quest.start(s,q,mq,hq);
	Draw.window.quest.challenge(s,q,mq,hq);
	Draw.window.quest.left(s,q,mq,hq);
	Draw.window.quest.right(s,q,mq,hq);

}

Draw.window.quest.refreshIf = function(q,mq){
	var str = Tk.stringify(q) + Tk.stringify(mq) + main.questActive;
	var bool = Draw.refresh.winQuest !== str;
	Draw.refresh.winQuest = str;
	return bool;
}

Draw.window.quest.left = function(s,q,mq,hq){
	var hqc = hq.left;
	//Info
	hqc.style.left = 5 + 'px'; 
	hqc.style.top = 175 + 'px'; 
	
	hqc.style.font = s.charY + 'px Kelly Slab';
	hqc.style.width = s.dw - 5 + 'px';
	
	
	var str = '<h2 class="u">General Quest Info</h2>';
	str += 'Quest created by: ' + q.author.q() + '.<br>';
	str += 'Rating: ' + q.statistic.ratingGlobal.r(2) + '/5.<br>';
	str += 'Completed by ' + q.statistic.amountComplete + ' players.<br>'; 
	str += ((q.statistic.amountComplete/q.statistic.amountStarted*100) || 0).r(1) + '% players who started the quest finished it.<br>';
	str += 'In average, players repeat this quest ' + q.statistic.averageRepeat.r(2) + ' times.<br>';
	str += '<br>';
	str += 'Last Quest Comment: ';
	if(q.playerComment[0]){
		str += '<br> &emsp; &emsp;<b>' + q.playerComment[0].name + '</b>: <i>' + q.playerComment[0].text.slice(0,75) + '...</i> | ';
		str += '<br><a onclick="Draw.window.quest.left.openQuestComment(\'' + q.id + '\')"> - All comments</a>'
	} else {
		str += ' None...<br>'
		str += ' - <a onclick="onclick="Chat.report.open(\'quest\',\'' + q.id + '\');">Be the first!</a>';
	}	
	
	Draw.setInnerHTML(hqc,str);
	

}

Draw.window.quest.left.openQuestComment = function(id){
	var q = Db.quest[id];
	var str = '<h2>Comments for the Quest "' + q.name + '"</h2>';
	str += '<p class="u" onclick="Chat.report.open(\'quest\',\'' + id + '\');">Click here to post your own comment.</p>'
	
	for(var i in q.playerComment){
		str += q.playerComment[i].name + ': ' + q.playerComment[i].text + '<br>';
	}
	
	Tk.openDialog('questComment',str);

}

Draw.window.quest.start = function(s,q,mq,hq){
	var hqc = hq.start;
	hqc.style.left = 200 + 25 + s.dw/2 + 'px'; 
	hqc.style.top = 50 + 'px'; 
	
	hqc.style.font = s.charY*1.5 + 'px Kelly Slab';
	
	var str = '';
	var chal = ''; for(var i in mq._challenge) if(mq._challenge[i]) chal = i;
	if(!main.questActive){
		str += '<button style="font:25px Kelly Slab" class="myButtonGreen" title="Start this quest" onclick="Command.send(\'win,quest,start,' + q.id + '\');">' +
			(chal ? 'Start Quest<br>with Challenge<br>' + q.challenge[chal].name.q() : 'Start Quest<br>without challenge')
			+ '</button><br>';
	}
	if(main.questActive === q.id){
		str += '<button style="font:25px Kelly Slab" class="myButtonRed" title="Abandon Quest" onclick="Command.send(\'win,quest,abandon,' + q.id + '\');">Abandon Quest</button><br>';
	}
	
	if(main.questActive && main.questActive !== q.id){
		str += '<button style="font:25px Kelly Slab" class="myButtonRed" title="Abandon Active Quest (' +Db.questNameConvert[main.questActive] + ')" ' +
			'onclick="Command.send(\'win,quest,abandon,' + main.questActive + '\');">Abandon Active Quest</button><br>';
	}
	Draw.setInnerHTML(hqc,str);
}	

Draw.window.quest.right = function(s,q,mq,hq){	//BAD
	var hqc = hq.right;
	hqc.style.left = s.dw/2 + 'px'; 
	hqc.style.top = 175 + 'px'; 
	hqc.style.width = s.dw/2 - 5 + 'px';
	hqc.style.font = s.charY + 'px Kelly Slab';
	
	var str = '';

	//reward
	str +=  '<h2 class="u">Personal Score:</h2>';
	str += 'Quest completed: ' + mq._complete + ' times<br>';
	str += '<span title="Everytime you beat a quest, you get a Quest Score that depends on performance and Passive Bonus.">' +
		'Cumulative Quest Score: ' + mq._rewardScore.r(0) + ' / 10000 </span><br>';
	str += '<span title="Depends on your Cumulative Quest Score. Use Passive Points to boost stats via Passive Grid.">' +
		'Passive Points: ' + mq._rewardPt.r(4) + ' / ' + q.reward.passive.max.r(1) + '</span>';
	
	str += '<br><h2 class="u">Highscores</h2>';
	for(var i in Db.highscoreList)
		if(i.have(q.id,0)) str += '<a title="' + Db.highscoreList[i].description 
			+ '" onclick="Draw.window.highscore.open(\'' + i + '\');"> - ' + Db.highscoreList[i].name + '</a><br>'
	
	Draw.setInnerHTML(hqc,str);
}

Draw.window.quest.challenge = function(s,q,mq,hq){
	var hqc = hq.challenge;
	hqc.style.left = 0 + 'px'; 
	hqc.style.top = -30 + 'px'; 
	
	hqc.style.font = s.charY + 'px Kelly Slab';
	
	var str = '<table><tr><td>';
	//challenge
	if(q.challenge && q.challenge.$length()){ 
		str += '<h2 class="u">Challenges:</h2>';
		
		str += mq._completed ? 
				'<span style="color:yellow;" title="Completed this quest at least once">★</span>'
				: '<span style="color:gray;" title="Never completed this quest">★</span>';
		var chal = ''; for(var i in mq._challenge) if(mq._challenge[i]) chal = i;
		str += ' - <span class="shadow" style="cursor:pointer;color:' + 
				(chal ? ('red" onclick="Command.send(\'win,quest,toggleChallenge,' + q.id + ',' + chal + '\');") ')
					: 'yellow" ') + 
				'title="Click if you want to do the quest normally."> No Challenge</span><br>';
		
		
		for(var i in q.challenge){
			var c = q.challenge[i];
			var color = mq._challenge[i] ? '#00AA00' : '#FF0000';
			var star = mq._challengeDone[i] ? 
					'<span style="color:yellow;" title="Completed this challenge at least once">★</span>'
					: '<span style="color:gray;" title="Never completed this challenge">★</span>';
					
			str += star +
				' - <span class="shadow" style="cursor:pointer;color:' + color + '" ' +
				'onclick="Command.send(\'win,quest,toggleChallenge,' + q.id + ',' + i + '\');" ' + 
				'title="Click to toggle challenge: ' + c.description + '"' +
				'>' + c.name + ' - (x' + c.bonus.success.passive + ')' +
				'</span><br>';
		}
		//str += '<br><br>';
	}
	
	str += '</td><td>  <td><td style="padding:20px;width=1000px;">'
	
	//bonus
	str += '<h2 class="u">Reward Bonus:</h2>';
	var b = mq._bonus;
	var count = 0;	for(var i in mq._challengeDone) if(mq._challengeDone[i]) count++;
	var active = 0;	for(var i in mq._challenge) if(mq._challenge[i]) active++;
	
	var array = Draw.window.quest.challenge.array(b,active,count);
	str += '<div class="CSSTableGenerator CSSTableGeneratorHead"><table class="arrayToTable">' + Tk.arrayToTable(array,1,1) + '</table></div>';
	str += '</td></tr></table>';
	Draw.setInnerHTML(hqc,str);
}

Draw.window.quest.challenge.array = function(b,active,count){
	return [
		[
			'',
			active ? '<span title="Bonus awarded if you beat the currently active challenge.">Active Chal.</span>'
				: '<span title="You have no active challenge. Activate a challenge to receive an Active Challenge Bonus.">Active Chal.</span>',
			count ? '<span title="Bonus awarded because you have completed ' + count + ' Challenges in the past.">Past Chal.</span>'
				: '<span title="Completing challenges grant a permanent bonus that applies even if the challenge is no longer active.">Past Chal.</span>',
			'<span title="Everytime you complete this quest, its Cycle Bonus decreases. Every midnight, it increases to at least x1.">Cycle</span>',
			'<u>Final</u>',
		],
		[
			'<span title="Impact Quest Score which impacts amount of Passive Points (PP) gained. Use PP to boost stats via the Passive Grid.">Passive:</span>',
			'x' + b.challenge.passive.r(3),
			'x' + b.challengeDone.passive.r(3),
			'x' + b.cycle.passive.r(3),
			'<u>x' + (b.challenge.passive*b.challengeDone.passive*b.cycle.passive).r(3)+'</u>',
		],
		[
			'<span title="Impact exp rewarded for completing the quest, killing monsters and harvesting Skill Plots.">Exp:</span>',
			'x' + b.challenge.exp.r(3),
			'x' + b.challengeDone.exp.r(3),
			'x' + b.cycle.exp.r(3),
			'<u>x' + (b.challenge.exp*b.challengeDone.exp*b.cycle.exp).r(3)+'</u>',
		],
		[
			'<span title="Impact amount of item received from completing the quest, killing monsters and harvesting Skill Plots.">Item:</span>',
			'x' + b.challenge.item.r(3),
			'x' + b.challengeDone.item.r(3),
			'x' + b.cycle.item.r(3),
			'<u>x' + (b.challenge.item*b.challengeDone.item*b.cycle.item).r(3)+'</u>',
		],
	];
}
//}

//{ Passive
Draw.window.passive = function (){ ctxrestore();
	var s = Draw.window.main({'offensive':0,'defensive':0,'ability':0,'passive':1});	
	ctx = List.ctx.win;
	
	ctx.setFont(25);
	ctx.fillStyle = 'black';
	
	var hp = html.passiveWin;
	hp.div.style.visibility = 'visible';
	hp.div.style.left = s.mx + 'px'; 
	hp.div.style.top = s.my - 65 + 'px'; 
	
	//Subtitle
	var charY = 25;
	hp.text.style.left = 10 + 'px'; 
	hp.text.style.top = 100 + 'px'; 
	hp.text.style.font = 20 + 'px Kelly Slab';
	hp.text.style.width = 'auto';
	hp.text.style.height = 'auto';
	hp.text.style.whiteSpace = 'nowrap';
	hp.text.style.backgroundColor = 'white';
	
	var str = 'Quests grant passive points<br>';
	str += 'which give bonus to a stat.<br>';
	str += '<br>'
	str += '<span style="font-size:30px" title="' + (main.passive.usablePt-main.passive.usedPt[main.passive.active]).r(0) + ' Available Point(s). Complete/Repeat quests to get more points.">'
		+ 'Points: ' + main.passive.usedPt[main.passive.active] + '/' + Tk.round(main.passive.usablePt,2) + '</span><br>';
	str += '<span title="Use Orb of Removal obtained from completing quests to get more Remove Points.">Remove Pts: ' + main.passive.removePt.r(1) + '</span><br>';
	str += '<br>';
	/*
	str += '<span ' + 
	'onclick="Draw.window.passive.grid.info.toggleFullscreen();' + '" ' + 
	'title="Toggle Fullscreen"' + 
	'>' + 'Fullscreen' + 
	'</span><br>';
	str += 	'<span ' + 
	'onclick="Draw.window.passive.grid.info.reset();' + '" ' + 
	'title="Reset Position and Zoom"' +
	'>' + 'Reset View' + 
	'</span>';
	str += '<br>';
	str += '<br>';
	*/
	/*
	str += 'Page: ';
	for(var i in main.passive.grid){
		str += '<span ' + 
		'onclick="Command.send(\'win,passive,page,' + i + '\');'+ '" ' +
		'style="text-decoration:' + (+i == main.passive.active ? 'underline' : 'none') + '" ' +
		'title="Change Active Page ' + i + '" ' + 
		'>' + i +
		'</span> ';
	}
	str += '<br>';
	str += '<br>';
	if(main.passive.freeze[main.passive.active]){	//aka frozen
		str += 'Freeze: ' + main.passive.freeze[main.passive.active];	
		str += '<br>';
		str += 	'<span ' + 
		'onclick="Command.send(\'win,passive,unfreeze,' +main.passive.active + '\');' + '" ' + 
		'title="Unfreeze. Changes will go live upon relogging."' +
		'>' + 'Unfreeze' + 
		'</span>';
	} else {
		str += 	'<span ' + 
		'onclick="Command.send(\'win,passive,freeze,' +main.passive.active + '\');' + '" ' + 
		'title="You will keep this grid and values until you unfreeze. Future changes of popularity won\'t affect this grid if frozen."' +
		'>' + 'Freeze' + 
		'</span>';
	}	
	*/
	
	
	Draw.setInnerHTML(hp.text,str);
	Draw.window.passive.grid();
}

Draw.window.passive.refreshIf = function(){
	var str = Tk.stringify(main.passive);// + Tk.stringify(Draw.window.passive.grid.info);
	if(Draw.old.passiveWin !== str){
		Draw.old.passiveWin = str;
		return true;
	}
	return false;
}

Draw.window.passive.grid = function(){ ctxrestore();
	var s = Draw.window.main.constant();	
	ctx = List.ctx.passiveGrid;
	
	if(!Draw.window.passive.refreshIf()) return;
	
	var info = Draw.window.passive.grid.info;
	
	//Hide Background
	if(info.fullscreen){
		ctx.fillStyle = 'white';
		ctx.fillRect(0,0,CST.WIDTH,CST.HEIGHT);
		html.win.div.style.visibility = 'hidden';
		ctx.fillStyle = 'black';	
	}
	
	//Update Drag
	/*
	info.x += Input.mouse.drag.vx; var dx = info.x;
	info.y += Input.mouse.drag.vy; var dy = info.y;
	
	info.size = Math.max(0.1,info.size);
	info.size = Math.min(200,info.size);
	*/
	info.size = 24;
	
	var iconSize = info.size ;
	var border = info.size/3;
	var border2 = border/2;
	var ic = iconSize + border;
	
	var pass = main.passive.grid[main.passive.active];
	
	var el = html.passiveWin.grid;
	el.innerHTML = '';
	el.style.lineHeight = iconSize/2 + 'px';
	
	el.style.left = Draw.window.passive.grid.info.x + 'px';
	el.style.top = Draw.window.passive.grid.info.y + 'px';
	
	
	//Draw Stat	
	var grid = Db.passiveGrid[main.passive.active].grid;
	for(var i = 0 ; i < grid.length ; i++){
		for(var j = 0 ; j < grid[i].length ; j++){
			var boost = grid[i][j];
			var canvas = document.createElement('canvas');
			canvas.height = ic;
			canvas.width = ic;
			var ctx = canvas.getContext('2d');
			
			//Freebies
			if(pass[i][j] === '2' || !Db.stat[boost.stat]){	//TOFIX should only be ===2
				ctx.globalAlpha = 1;
				ctx.fillStyle = 'green';
				ctx.fillRect(0,0,ic,ic);
				el.appendChild(canvas);
				continue;
			}
			
			//Border
			ctx.globalAlpha = 1;
			if(true || main.pref.passiveView === 0){ ctx.fillStyle = +pass[i][j] ? 'green' : (Passive.test.add(pass,i,j) ? '#FFFF00': 'red');}
			//else if(main.pref.passiveView === 1){ var n = (boost.count-grid.min) / (grid.max-grid.min);	ctx.fillStyle =	Draw.gradientRG(n);}
			ctx.fillRect(0,0,ic,ic);
			
			//Boost
			canvas.onclick = (function(ii,jj){
				return function(){
					Command.send('win,passive,add,' + main.passive.active + ',' + ii + ',' + jj);
				};
			})(i,j);
			canvas.oncontextmenu = (function(ii,jj){
				return function(){
					Command.send('win,passive,remove,' + main.passive.active + ',' + ii + ',' + jj);
				};
			})(i,j);
			
			if(+pass[i][j]) canvas.title = 'Right Click: Remove "' + Db.stat[boost.stat].name + '"';
			else {
				if(Db.stat[boost.stat].custom) canvas.title = 'Left Click: ' + Db.stat[boost.stat].description;
				else canvas.title = 'Left Click: Boost "' + Db.stat[boost.stat].name + '" by x0.02';
			}
				
			
			var name = Db.stat[boost.stat].icon;
			
			if(Db.stat[boost.stat].custom){
				ctx.globalAlpha = 1;
				Draw.icon(name,border2,border2,iconSize,'',ctx);
				ctx.strokeStyle = +pass[i][j] ? 'white' : 'blue';
				ctx.lineWidth = 2;
				ctx.strokeRect(border2-2,border2-2,iconSize+4,iconSize+4);
			} else {
				ctx.globalAlpha = +pass[i][j] ? 1 : 0.5;
				Draw.icon(name,border2,border2,iconSize,'',ctx);
			}	
			
			el.appendChild(canvas);			
		}
		var br = document.createElement("br");
		el.appendChild(br);
	}
}

Draw.window.passive.grid.info = {
	size:22,
	x:380,
	y:60,
	fullscreen:false,
	reset:(function(){
		Draw.window.passive.grid.info.x = 0;
		Draw.window.passive.grid.info.y = 0;
		Draw.window.passive.grid.info.size = 22;
	}),
	toggleFullscreen:(function(){
		Draw.window.passive.grid.info.fullscreen = !Draw.window.passive.grid.info.fullscreen;
	}),
}

Draw.window.passive.hover = function(over){ ctxrestore();
	var s = Draw.window.main.constant(); 
	ctx = List.ctx.pop;
	
	var st = Db.stat[over.stat];
	
	var vvx = 300;
	var vvy = 100;
	var ssx = Math.max(0,Input.mouse.x - vvx);
	var ssy = Math.max(0,Input.mouse.y - vvy);
	
	//Frame
	ctx.fillStyle = 'grey';
	ctx.fillRect(ssx,ssy,vvx,vvy);
	ctx.strokeStyle = 'black';
	ctx.strokeRect(ssx,ssy,vvx,vvy);
	ctx.fillStyle = 'white';
	
	//Info

	Draw.icon(st.icon,ssx+5,ssy+1,20);

	ctx.fillTextU(st.name,ssx + 5 + 30,ssy+1);

	var pop = 'Popularity: ';
	var grid = Db.passiveGrid[main.passive.active];
	pop += Tk.round(100*over.count/grid.average,1) + '%';
	ctx.fillText(pop,ssx + 5,ssy+1+25*1);
	var value = 'Value: +' + Tk.round(over.value,5);
	ctx.fillText(value,ssx + 5,ssy+1+25*2);
	//TOFIX add description
	
	ctx.fillStyle = 'black';
}
//}

//{ Highscore
Draw.window.highscore = function (){ ctxrestore();
	var s = Draw.window.main('Highscore');	
	ctx = List.ctx.win;
	
	var hq = html.highscoreWin;
	hq.div.style.visibility = 'visible';
	hq.div.style.left = s.mx + 'px'; 
	hq.div.style.top = s.my + 'px'; 
	
	//Select Quest
	var rank = Db.query('highscore',html.highscoreWin.selectCategory.value);
	if(!rank){  return Draw.setInnerHTML(hq.table,''); }
	
	/*if(!main.windowList.highscore.have($("#highscoreWinSelectQuest")[0].value)){
		$("#highscoreWinSelectQuest")[0].value = main.windowList.highscore.split('-')[0];
		Draw.window.highscore.changeQuest();
	}*/
	
	//Table
	hq.table.style.left = 250 + 'px'; 
	hq.table.style.top = 100 + 'px'; 
	
	var str = '<table class="maxSize">';
	str += '<tr>';
	str += '<td>Rank</td>'
	str += '<td>Name</td>'
	str += '<td>Score</td>'
	str += '</tr>';
	
	for(var i in rank){
		str += '<tr>';
		str += '<td>'+ rank[i].rank + '</td>'
		str += '<td>'+ rank[i].username + '</td>'
		str += '<td>'+ (rank[i].score || 0) +'</td>'
		str += '</tr>';
	}
	str += '</table>';
	
	
	Draw.setInnerHTML(hq.table,str);
}
Draw.window.highscore.open = function(category){
	$("#highscoreWinSelectQuest")[0].value = category.split('-')[0];
	Draw.window.highscore.changeQuest();
	$("#highscoreWinSelectCategory")[0].value = category;
	Draw.window.highscore.changeCategory();
	Command.send('win,open,highscore,' + category);
}

Draw.window.highscore.changeQuest = function(open){	//called when selecting
	var quest = $("#highscoreWinSelectQuest")[0].value;
	
	var str = '';
	var goodvalue;
	for(var i in Db.highscoreList){
		if(!i.have(quest)) continue;
		goodvalue = goodvalue || i;
		str += '<option value="' + i + '">' + Db.highscoreList[i].name + '</option>';
	}	
	$("#highscoreWinSelectCategory")[0].innerHTML = str;
	
	$("#highscoreWinSelectCategory")[0].value = goodvalue;	//first one
	Draw.window.highscore.changeCategory(open);
}
Draw.window.highscore.changeCategory = function(open){ //called when selecting
	var category = $("#highscoreWinSelectCategory")[0].value;
	
	$("#highscoreWinDescription")[0].innerHTML = Db.highscoreList[category].description;
	
	if(open !== false) Command.send('win,open,highscore,' + category);
}

Draw.window.highscore.update = function(){
	if(Date.now() - Draw.window.highscore.update.lastClick > 2000){
		Draw.window.highscore.update.lastClick = Date.now();
		Db.query('highscore',html.highscoreWin.selectCategory.value,true);
		Chat.add(0,"Highscores take about 15 seconds to update. =/");
	}	
}
Draw.window.highscore.update.lastClick = Date.now();

//}






