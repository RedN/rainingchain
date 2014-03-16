Draw.window = function(){ ctxrestore();
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
	
	if(typeof title === 'string'){ t.innerHTML = title; } else {
		t.style.textDecoration = 'none';
		var str = '';
		for(var i in title){
			var text = 'Open ' + i.capitalize() + ' Window';
			str += 
			'<span ' + 
			'style="text-decoration:' + (title[i] ? 'underline' : 'none') + '" ' +
			'onclick="' + "main.sfx='menu'; " + 'Chat.send.command(\'' + '$win,open,' + i + '\')' + '" ' + 
			'title="' + text + '"' +
			'>' + i.capitalize() + 
			'</span>';
			str += ' - ';
		}
		str = str.slice(0,-3);
		Draw.setInnerHTML(t,str);
	}
	
	//Close
	Draw.icon('system.close',[s.x + s.w -20,s.y],20);	
	Button.creation(0,{
		"rect":[s.x + s.w -20,s.x + s.w,s.y,s.y+20],
		"left":{"func":Chat.send.command,"param":['$win,close']},
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
	for (var i = 0 ; i < main.bankList.length ; i++){
		if(!main.bankList[i].length) continue;
		var amountX = Math.floor(s.w/40)-1;
		var numX = s.x + 40 + 40*(i%amountX);
		var numY = s.y + 70 + 40*Math.floor(i/amountX);
		
		Button.creation(0,{
			"rect":[numX,numX+32,numY,numY+32],
			"left":{"func":Chat.send.command,"param":['$win,bank,click,left,' + i]},
			"shiftLeft":{"func":Chat.send.command,"param":['$win,bank,click,shiftLeft,' + i+ ',' + main.pref.bankTransferAmount]},
			"shiftRight":{"func":Chat.send.command,"param":['$win,bank,click,shiftLeft,' + i + ',' + 999999999]},
			"right":{"func":Chat.send.command,"param":['$win,bank,click,right,' + i]},
			'text':'Withdraw ' + main.bankList[i][2]
		});	
		Draw.item(main.bankList[i],[numX,numY]);
	}
	
	
}

//{Stat
Draw.window.offensive = function (){ ctxrestore();
	Draw.window.stat('offensive');	
}

Draw.window.defensive = function (){ ctxrestore();
	Draw.window.stat('defensive');	
	
	
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
		ctx.fillStyle = Cst.element.toColor[i];
		ctx.roundRect(numX-5,numY,125,fontSize*1.1);
		ctx.fillStyle = 'black';
		ctx.fillText(i.capitalize() + ': ' + round(def.ratio[i]*def.main),numX,numY);		
		count++;
	}
	ctx.fillStyle = 'black';
	
	
}

Draw.window.stat = function(type){ ctxrestore();
	var obj = {'offensive':0,'defensive':0,'ability':0,'passive':0}; obj[type] = 1;
	var s = Draw.window.main(obj);	
	ctx = List.ctx.win;
	if(server){ return; }
	
	ctx.setFont(22);
	
	//Content
	for(var i = 0 ; i < Draw.window.stat.list[type].length ; i++){
		
		var info = Draw.window.stat.list[type][i];  
		
		var numX = s.x + 50 + Math.floor(i/15) * 500;
		var numY = s.y + 60 + 30* (i%15);
		
		var string = info.string()
		
		ctx.fillText(info.name + ':',numX,numY);
		ctx.fillText(string,numX+125,numY);
		Draw.icon(info.icon,[numX-30,numY],20)
		
		if(Collision.PtRect(Collision.getMouse(),[numX,numX+500,numY,numY+30])){
			var hover = i;
		}
	}
	
	//Bottom, custom effects
	var numX = s.x + 10;
	var numY = s.y + 60 + 30* 15;
	var str = '';
	for(var i in player.boost.custom){
		str += Db.customBoost[i].name + ', ';
	}
	str = str.slice(0,-2);
	str = 'Custom Effects: ' + str;
	ctx.font = '30px Kelly Slab';
	ctx.fillText(str,numX,numY);
	
	
	if(hover !== undefined){ Draw.window.stat.hover(hover,type); }
	
}

	

Draw.window.stat.list = {
'offensive':[
	{'name':'Melee','icon':'element.melee','stat':[{'name':'x','stat':'dmg-melee-x'},{'name':'*','stat':'dmg-melee-*'},{'name':'^','stat':'dmg-melee-^'},{'name':'+','stat':'dmg-melee-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','melee')})},
	{'name':'Range','icon':'element.range','stat':[{'name':'x','stat':'dmg-range-x'},{'name':'*','stat':'dmg-range-*'},{'name':'^','stat':'dmg-range-^'},{'name':'+','stat':'dmg-range-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','range')})},
	{'name':'Magic','icon':'element.magic','stat':[{'name':'x','stat':'dmg-magic-x'},{'name':'*','stat':'dmg-magic-*'},{'name':'^','stat':'dmg-magic-^'},{'name':'+','stat':'dmg-magic-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','magic')})},
	{'name':'Fire','icon':'element.fire','stat':[{'name':'x','stat':'dmg-fire-x'},{'name':'*','stat':'dmg-fire-*'},{'name':'^','stat':'dmg-fire-^'},{'name':'+','stat':'dmg-fire-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','fire')})},
	{'name':'Cold','icon':'element.cold','stat':[{'name':'x','stat':'dmg-cold-x'},{'name':'*','stat':'dmg-cold-*'},{'name':'^','stat':'dmg-cold-^'},{'name':'+','stat':'dmg-cold-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','cold')})},
	{'name':'Lightning','icon':'element.lightning','stat':[{'name':'x','stat':'dmg-lightning-x'},{'name':'*','stat':'dmg-lightning-*'},{'name':'^','stat':'dmg-lightning-^'},{'name':'+','stat':'dmg-lightning-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','lightning')})},
	
	{'name':'Weapon','icon':'element.melee','stat':[{'name':'Mace','stat':'weapon-mace'},{'name':'Spear','stat':'weapon-spear'},{'name':'Sword','stat':'weapon-sword'}],'string':(function(){ return 'Mace: ' + round(player.boost.list['weapon-mace'].base,2,1) + ', Spear: ' + round(player.boost.list['weapon-spear'].base,2,1) + ', Sword: ' + round(player.boost.list['weapon-sword'].base,2,1)						})},
	{'name':'Weapon','icon':'element.range','stat':[{'name':'Bow','stat':'weapon-bow'},{'name':'Boomerang','stat':'weapon-boomerang'},{'name':'Crossbow','stat':'weapon-crossbow'}],'string':(function(){ return 'Bow: ' + round(player.boost.list['weapon-bow'].base,2,1) + ', Boom.: ' + round(player.boost.list['weapon-boomerang'].base,2,1) + ', CBow: ' + round(player.boost.list['weapon-crossbow'].base,2,1)						})},
	{'name':'Weapon','icon':'element.magic','stat':[{'name':'Wand','stat':'weapon-wand'},{'name':'Staff','stat':'weapon-staff'},{'name':'Orb','stat':'weapon-orb'}],'string':(function(){ return 'Wand: ' + round(player.boost.list['weapon-wand'].base,2,1) + ', Staff: ' + round(player.boost.list['weapon-staff'].base,2,1) + ', Orb: ' + round(player.boost.list['weapon-orb'].base,2,1)						})},
	
	{'name':'Burn','icon':'status.burn','stat':[{'name':'Chance','stat':'burn-chance'},{'name':'Magn','stat':'burn-magn'},{'name':'Time','stat':'burn-time'}],'string':(function(){ return Draw.window.stat.list.status('off','burn')})},
	{'name':'Chill','icon':'status.chill','stat':[{'name':'Chance','stat':'chill-chance'},{'name':'Magn','stat':'chill-magn'},{'name':'Time','stat':'chill-time'}],'string':(function(){ return Draw.window.stat.list.status('off','chill')})},
	{'name':'Confuse','icon':'status.confuse','stat':[{'name':'Chance','stat':'confuse-chance'},{'name':'Magn','stat':'confuse-magn'},{'name':'Time','stat':'confuse-time'}],'string':(function(){ return Draw.window.stat.list.status('off','confuse')})},
	{'name':'Knockback','icon':'status.knock','stat':[{'name':'Chance','stat':'knock-chance'},{'name':'Magn','stat':'knock-magn'},{'name':'Time','stat':'knock-time'}],'string':(function(){ return Draw.window.stat.list.status('off','knock')})},
	{'name':'Bleed','icon':'status.bleed','stat':[{'name':'Chance','stat':'bleed-chance'},{'name':'Magn','stat':'bleed-magn'},{'name':'Time','stat':'bleed-time'}],'string':(function(){ return Draw.window.stat.list.status('off','bleed')})},
	{'name':'Drain','icon':'status.drain','stat':[{'name':'Chance','stat':'drain-chance'},{'name':'Magn','stat':'drain-magn'},{'name':'Time','stat':'drain-time'}],'string':(function(){ return Draw.window.stat.list.status('off','drain')})},
	
	
	{'name':'Leech Hp','icon':'resource.hp','stat':[{'name':'Chance','stat':'leech-chance'},{'name':'Magn','stat':'leech-magn'}],'string':(function(){ return 'Chance: ' + round(player.boost.list['leech-chance'].base,2,1) + ', Magn: ' + round(player.boost.list['leech-magn'].base,2,1); })},
	{'name':'Critical','icon':'resource.hp','stat':[{'name':'Chance','stat':'crit-chance'},{'name':'Magn','stat':'crit-magn'}],'string':(function(){ return 'Chance: ' + round(player.boost.list['crit-chance'].base,2,1) + ', Magn: ' + round(player.boost.list['crit-magn'].base,2,1); })},
	
	{'name':'Bullet','icon':'offensive.bullet','stat':[{'name':'Amount','stat':'bullet-amount'},{'name':'Spd','stat':'bullet-spd'}],'string':(function(){ return 'Amount: ' + round(player.boost.list['bullet-amount'].base,2,1) + ', Spd: ' + round(player.boost.list['bullet-spd'].base,2,1); })},
	{'name':'Strike','icon':'offensive.bullet','stat':[{'name':'AoE','stat':'bullet-amount'},{'name':'Range','stat':'aim'},{'name':'Max','stat':'aim'}],'string':(function(){ return 'AoE: ' + round(player.boost.list['strike-size'].base,2,1) + ', Range: ' + round(player.boost.list['strike-range'].base,2,1) + ', Max: ' + round(player.boost.list['strike-maxHit'].base,2,1); })},
	{'name':'Summon','icon':'summon.wolf','stat':[{'name':'Amount','stat':'summon-amount'},{'name':'Time','stat':'summon-time'},{'name':'Attack','stat':'summon-atk'},{'name':'Defence','stat':'summon-def'}],'string':(function(){ return '#:' + round(player.boost.list['summon-amount'].base,2,1) + ', Time:' + round(player.boost.list['summon-time'].base,2,1) + ', A:' + round(player.boost.list['summon-atk'].base,2,1)+ ', D:' + round(player.boost.list['summon-def'].base,2,1); })},

	{'name':'Atk Spd','icon':'offensive.atkSpd','stat':[{'name':'Atk Spd','stat':'atkSpd-main'}],'string':(function(){ return round(player.boost.list['atkSpd-main'].base,2,1); })},
	
],

'defensive':[
	{'name':'Melee','icon':'element.melee','stat':[{'name':'x','stat':'def-melee-x'},{'name':'*','stat':'def-melee-*'},{'name':'^','stat':'def-melee-^'},{'name':'+','stat':'def-melee-+'}],'string':(function(){ return Draw.window.stat.list.element('def','melee')})},
	{'name':'Range','icon':'element.range','stat':[{'name':'x','stat':'def-range-x'},{'name':'*','stat':'def-range-*'},{'name':'^','stat':'def-range-^'},{'name':'+','stat':'def-range-+'}],'string':(function(){ return Draw.window.stat.list.element('def','range')})},
	{'name':'Magic','icon':'element.magic','stat':[{'name':'x','stat':'def-magic-x'},{'name':'*','stat':'def-magic-*'},{'name':'^','stat':'def-magic-^'},{'name':'+','stat':'def-magic-+'}],'string':(function(){ return Draw.window.stat.list.element('def','magic')})},
	{'name':'Fire','icon':'element.fire','stat':[{'name':'x','stat':'def-fire-x'},{'name':'*','stat':'def-fire-*'},{'name':'^','stat':'def-fire-^'},{'name':'+','stat':'def-fire-+'}],'string':(function(){ return Draw.window.stat.list.element('def','fire')})},
	{'name':'Cold','icon':'element.cold','stat':[{'name':'x','stat':'def-cold-x'},{'name':'*','stat':'def-cold-*'},{'name':'^','stat':'def-cold-^'},{'name':'+','stat':'def-cold-+'}],'string':(function(){ return Draw.window.stat.list.element('def','cold')})},
	{'name':'Lightning','icon':'element.lightning','stat':[{'name':'x','stat':'def-lightning-x'},{'name':'*','stat':'def-lightning-*'},{'name':'^','stat':'def-lightning-^'},{'name':'+','stat':'def-lightning-+'}],'string':(function(){ return Draw.window.stat.list.element('def','lightning')})},
		
	{'name':'Burn','icon':'status.burn','stat':[{'name':'Resist','stat':'resist-burn'}],'string':(function(){ return Draw.window.stat.list.status('def','burn')})},
	{'name':'Chill','icon':'status.chill','stat':[{'name':'Resist','stat':'resist-chill'}],'string':(function(){ return Draw.window.stat.list.status('def','chill')})},
	{'name':'Confuse','icon':'status.confuse','stat':[{'name':'Resist','stat':'resist-confuse'}],'string':(function(){ return Draw.window.stat.list.status('def','confuse')})},
	{'name':'Knockback','icon':'status.knock','stat':[{'name':'Resist','stat':'resist-knock'}],'string':(function(){ return Draw.window.stat.list.status('def','knock')})},
	{'name':'Bleed','icon':'status.bleed','stat':[{'name':'Resist','stat':'resist-bleed'}],'string':(function(){ return Draw.window.stat.list.status('def','bleed')})},
	{'name':'Drain','icon':'status.drain','stat':[{'name':'Resist','stat':'resist-drain'}],'string':(function(){ return Draw.window.stat.list.status('def','drain')})},
	
	{'name':'Speed','icon':'defensive.speed','stat':[{'name':'Max','stat':'maxSpd'}],'string':(function(){ return round(player.boost.list['maxSpd'].base,2,1)})},
	{'name':'Pick Radius','icon':'defensive.pickup','stat':[{'name':'Pick Radius','stat':'pickRadius'}],'string':(function(){ return round(player.boost.list['pickRadius'].base,2,1)})},
	{'name':'Item Find','icon':'defensive.item','stat':[{'name':'Quality','stat':'item-quality'},{'name':'Quantity','stat':'item-quantity'},{'name':'Rarity','stat':'item-rarity'}],'string':(function(){ return 'Qual.: ' + round(player.boost.list['item-quality'].base,2,1) + ', Quant.: ' + round(player.boost.list['item-quantity'].base,2,1)+ ', Rarity: ' + round(player.boost.list['item-rarity'].base,2,1)})},


	{'name':'Life','icon':'resource.hp','stat':[{'name':'Max','stat':'hp-max'},{'name':'Regen','stat':'hp-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['hp-max'].base,0,1) + ', Regen: ' + round(player.boost.list['hp-regen'].base,2,1)})},
	{'name':'Mana','icon':'resource.mana','stat':[{'name':'Max','stat':'mana-max'},{'name':'Regen','stat':'mana-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['mana-max'].base,0,1) + ', Regen: ' + round(player.boost.list['mana-regen'].base,2,1)})},
	
	
	
],
/*
{'name':'Speed','icon':'defensive.speed','stat':[{'name':'Max','stat':'maxSpd'},{'name':'Acc.','stat':'acc'},{'name':'Fric.','stat':'friction'}],'string':(function(){ return 'Max: ' + round(player.boost.list['maxSpd'].base,2,1) + ', Acc.: ' + round(player.boost.list['acc'].base,2,1)+ ', Fric.: ' + round(player.boost.list['friction'].base,2,1)})},
{'name':'Atk Spd','icon':'offensive.atkSpd','stat':[{'name':'Main','stat':'atkSpd-main'},{'name':'Support','stat':'atkSpd-support'}],'string':(function(){ return 'Main:' + round(player.boost.list['atkSpd-main'].base,2,1) + ', Support:' + round(player.boost.list['atkSpd-support'].base,2,1); })},
{'name':'Fury','icon':'resource.fury','stat':[{'name':'Max','stat':'fury-max'},{'name':'Regen','stat':'fury-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['fury-max'].base,0,1) + ', Regen: ' + round(player.boost.list['fury-regen'].base,2,1)})},
{'name':'Dodge','icon':'resource.dodge','stat':[{'name':'Max','stat':'dodge-max'},{'name':'Regen','stat':'dodge-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['dodge-max'].base,0,1) + ', Regen: ' + round(player.boost.list['dodge-regen'].base,2,1)})},
{'name':'Heal','icon':'resource.heal','stat':[{'name':'Max','stat':'heal-max'},{'name':'Regen','stat':'heal-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['heal-max'].base,0,1) + ', Regen: ' + round(player.boost.list['heal-regen'].base,2,1)})},
*/

};


Draw.window.stat.list.element = function(type,name){
	type += '-';
	var b0 = round(player.boost.list[type + name + '-x'].base,2,1);
	var b1 = round(player.boost.list[type + name + '-*'].base,2,1);
	var b2 = round(player.boost.list[type + name + '-^'].base,2,1);
	var b3 = round(player.boost.list[type + name + '-+'].base,2,1);
	var sum = round(Math.pow(player.boost.list[type + name + '-x'].base*player.boost.list[type + name + '-*'].base,player.boost.list[type + name + '-^'].base) + player.boost.list[type + name + '-+'].base,3);
	var string = '( ' + b0 + ' * ' + b1 + ' ) ^ ' + b2 + ' + ' + b3 + ' = ' + sum;
	return string
}

Draw.window.stat.list.status = function(type,name){
	if(type === 'off'){
		var b0 = round(player.boost.list[name + '-chance'].base,2,1);
		var b1 = round(player.boost.list[name + '-magn'].base,2,1);
		var b2 = round(player.boost.list[name + '-time'].base,2,1);

		var string = '%: ' + b0 + ', Magn: ' + b1 + ', Time: ' + b2;
		return string
	}
	if(type === 'def'){
		var b0 = round(player.boost.list['resist-' + name].base,2,1);
		
		var string = 'Resist: ' + b0 
		return string
	}
}

Draw.window.stat.hover = function(hover,type){ ctxrestore();
	var s = Draw.window.main.constant();
	var numX = s.x + 550 + Math.floor(hover/15) * -450-15;
	var numY = s.y + 70;

	//Frame
	var ctx = List.ctx.pop;
	ctx.drawImage(Img.frame.postit,0,0,Img.frame.postit.width,Img.frame.postit.height,numX,numY-15,400,500);
	
	var info = Draw.window.stat.list[type][hover];  
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.setFont(25);
	ctx.fillText(info.name + ':',numX + 200,numY+10);
	ctx.textAlign = 'left';
	ctx.setFont(25);
	Draw.icon(info.icon,[numX+50,numY],48);	//not working ?
	Draw.icon(info.icon,[numX+400-100,numY],48);
	
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
	Draw.window.ability.upgrade(diffX+500,diffY+35);
	

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
			Draw.icon(ability.icon,[numX+45,numY],20);
		} else {
			ctx.strokeStyle = 'black';
			ctx.strokeRect(numX+45,numY,20,20);
		}	
	
		var text = '';
		if(ability){ text = ability.name; }
		
		
		var button = ('' + Input.key.ability[i][0]).keyCodeToName();
		if(button === 'l') button = 'Left Click'; 
		if(button === 'r') button = 'Right Click';
		if(button === 'sl') button = 'Shift-Left Click'; 
		if(button === 'sr') button = 'Shift-Right Click';
		if(button === '_') button = 'Space';
		
		Button.creation(0,{
			"rect":[numX, numX+45 + 32, numY, numY + 32 ],
			"left":{"func":Chat.send.command,"param":['$win,ability,swap,' + Draw.old.abilityShowed.id + ',' + i ]},
			'text':"Assign " + Draw.old.abilityShowed.name + " to " + button
			});	
	}
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
	
	var obj = {'attack':[],'blessing':[],'curse':[],'dodge':[],'heal':[],'summon':[]};
	for(var i in player.abilityList){
		var ability = Db.query('ability',i);
		if(ability) obj[ability.type].push(ability);
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
		'>' + j.capitalize().slice(0,1) + 
		'</span>';
		str += ' - '
	}	
	str = str.slice(0,-3);
	
	Draw.setInnerHTML(ha.subtitle,str);
		
		
	//Drawing
	for(var j in obj[ats]){
		var numX = s.zx + diffX + +j%15 * 25;
		var numY = s.zy + charY*1.2 + Math.floor(+j/15) * 25;
				
		var ability = obj[ats][j];	
		Draw.icon(ability.icon,[numX,numY],20);
		
		Button.creation(0,{
			"rect":[numX, numX + 20, numY, numY + 20 ],
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
	Draw.icon(ab.icon,[s.zx,s.zy],icon);
	
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
	' - Cast/S: ' + round(25/ab.period.own,2) + '<br>' +
	' - Cost: ' ;
	if(ab.cost.mana){ str += round(ab.cost.mana,1) + ' Mana'; }
	if(ab.cost.hp){ str += ' + ' + round(ab.cost.hp,1) + ' Life'; }
	if(!ab.cost.mana && !ab.cost.hp) str += 'None';
	str += '<br>' +
	' - Orbs: ' + ab.orb.upgrade.amount + ' | ' + 'Effect: ';
	
	var orb = Db.abilityOrb[ab.orb.upgrade.bonus];
	str += '<span ' + 
	'title="' + orb.info + '"' + 
	'>' + orb.name + 
	'</span>';
	
	str += ' | ' + '<span ' + 
	'onclick="Draw.window.ability.generalInfo.upgrade();' + '" ' + 
	'oncontextmenu="Draw.window.ability.generalInfo.upgrade();' + '" ' + 
	'title="Click to upgrade this ability (requires Orbs of Upgrade)"' + 
	'>' + '[UPGRADE]' + 
	'</span>';
	
	/*	no longer used
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
			'title="' + Db.abilityMod[array[i]].info + '">' + plus + Db.abilityMod[array[i]].name + '</span>';
		} else { str += '+ ________________'}
		
		str += '</td>';
		if(j == 1){str += '</tr>';}
	}
	str += '</table>';
	*/
	
	Draw.setInnerHTML(gi,str);
}

Draw.window.ability.upgrade = function(diffX,diffY){ //not longer used
	return;
	var s = Draw.window.main.constant(); 
	s.x += diffX;
	s.y += diffY;
	s.zx += diffX;
	s.zy += diffY;
	
	var hu = html.abilityWin.upgrade;
	hu.style.left = diffX + 'px'; 
	hu.style.top = diffY + 'px'; 
	hu.style.width = '400px';
	hu.style.height = '400px';
	hu.style.font = 30 + 'px Kelly Slab';
	
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
	
	Draw.setInnerHTML(hu,str);
}

Draw.window.ability.generalInfo.mod = function(){
	if(html.chat.input.value.have('$win,ability,addMod,')){
		Chat.send.command(html.chat.input.value + Draw.old.abilityShowed.id);
		html.chat.input.value = '';
	} else {
		Chat.add('Select an ability mod in your inventory first.');
	}
}

Draw.window.ability.generalInfo.upgrade = function(){
	var name = Draw.old.abilityShowed.id;
	var option = {'name':'Upgrade','count':1,'option':[
		{'name':'Use 1 Orb','func':Chat.send.command,'param':['$win,ability,upgrade,' + name + ',1']},
		{'name':'Use 10 Orbs','func':Chat.send.command,'param':['$win,ability,upgrade,' + name + ',10']},
		{'name':'Use 100 Orbs','func':Chat.send.command,'param':['$win,ability,upgrade,' + name + ',100']},
		{'name':'Use X Orbs','func':Input.add,'param':['$win,ability,upgrade,' + name + ',']},
	]};
	Button.optionList(option);
}

Draw.window.ability.generalInfo.upMod = function(mod){	//unused
	return;
	var name = Draw.old.abilityShowed.id;
	var option = {'name':'Upgrade Mod','count':1,'option':[
		{'name':'Use 1 Orb','func':Chat.send.command,'param':['$win,ability,upMod,' + name + ',' + mod + ',1']},
		{'name':'Use 10 Orbs','func':Chat.send.command,'param':['$win,ability,upMod,' + name + ',' + mod + ',10']},
		{'name':'Use 100 Orbs','func':Chat.send.command,'param':['$win,ability,upMod,' + name + ',' + mod + ',100']},
		{'name':'Use X Orbs','func':Input.add,'param':['$win,ability,upMod,' + name + ',' + mod + ',']},
	]};
	
	Button.optionList(option);
}

Draw.window.ability.action = function(diffX,diffY){ ctxrestore();
	var ab = Draw.old.abilityShowed;
	if(ab.action.func === 'Combat.action.attack'){ Draw.window.ability.action.attack(diffX,diffY);}
	if(ab.action.func === 'Actor.boost'){ Draw.window.ability.action.boost(diffX,diffY);}
	if(ab.action.func === 'Combat.action.summon'){ Draw.window.ability.action.summon(diffX,diffY);}

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
	var preatk = deepClone(ab.action.param);
	var atk = Combat.action.attack.mod(player,deepClone(preatk));
	
	var fontSize = 20;	
	ctx.font = fontSize + 'px Kelly Slab';
	
	//Weapon, Ability Combined
	var helper = function(atk,name,length){
		var str = name + ':';
		ctx.fillText(str,s.zx,s.zy);
		var dist = 125;	
		Draw.element(s.zx+dist,s.zy,length,fontSize,atk.dmg.ratio);
		ctx.fillText('x' + round(atk.dmg.main,1),s.zx+150+dist+15,s.zy);
	}
	
	helper(preatk,'Ability',150);
	s.zy += fontSize;
	helper(weapon,'Weapon',150);
	s.zy += fontSize;
	helper(atk,'Combined',150*atk.weaponCompability);
	
	//Final
	s.zy -= 2*fontSize;
	s.zx += 500;
	ctx.fillTextU("Final Damage",s.zx+20,s.zy-10);
	s.zy += fontSize;
	
	var count = 0;
	for(var i in atk.dmg.ratio){
		var numX = s.zx + (count%3)*125-100;
		var numY = s.zy + Math.floor(count/3)*fontSize*1.1;
		ctx.fillStyle = Cst.element.toColor[i];
		ctx.roundRect(numX-5,numY,125,fontSize*1.1);
		ctx.fillStyle = 'black';
		ctx.fillText(i.capitalize() + ': ' + round(atk.dmg.ratio[i]*atk.dmg.main),numX,numY);		
		count++;
	}
	ctx.fillStyle = 'black';
	
	s.zx -= 500;
	s.zy += fontSize*2.5;
	
	

	//General Info
	var dmg = 0;	for(var i in atk.dmg.ratio){ dmg += atk.dmg.ratio[i]; } dmg *= atk.dmg.main;
	str = 'x' + atk.amount + ' Bullet' + (atk.amount > 1 ? 's' : '') + ' @ ' + atk.angle + '°';
	str += '  =>  DPS: ' + round(dmg / ab.period.own * 25,1);
	ctx.fillText(str,s.zx,s.zy);
	s.zy += fontSize;
	
	
	//Mods
	s.zy += fontSize;
	ctx.fillText('Special Effects on Hit:',s.zx,s.zy);
	s.zy += fontSize/4;
		
	for(var i in atk){
		if(atk[i] && Draw.window.ability.action.attack.modTo[i]){
			var tmp = atk[i];

			
			//Status
			if(Cst.status.list.have(i)){ 
				var mod = tmp.chance * player.bonus[i].chance;
				var base = Math.pow(main.pref.abilityDmgStatusTrigger/100*atk.dmg.ratio[Cst.status.toElement[i]],1.5);
				tmp.chance = Math.probability(base,mod);
			}	
			if(tmp.chance !== undefined && tmp.chance <= 0.01){ continue;}
			Draw.icon(Draw.window.ability.action.attack.modTo[i].icon,[s.zx,s.zy+30],20);
			ctx.fillText('=> ' + Draw.window.ability.action.attack.modTo[i].text(tmp),s.zx+30,s.zy+30);
			s.zy += fontSize;
			
		}
	}
	
	//%Dmg
		
	var hd = html.abilityWin.dmgTrigger;
	hd.style.left = s.zx + 'px'; 
	hd.style.top = s.zy + 'px'; 
	hd.style.font = fontSize + 'px Kelly Slab';
	//hd.style.width = 500 + 'px';
	//hd.style.height = 100 + 'px';
	
	var str = 'Assuming <span ' + 
		'style="color:' + 'white' + '" ' +
		'onclick="Input.add(\'' + '$pref,abilityDmgStatusTrigger,' + '\')' + '" ' + 
		'title="Change Default %Dmg Dealt"' +
		'>' +
		main.pref.abilityDmgStatusTrigger + '%' +
		'</span>'
		+ ' Dealt';
	
	Draw.setInnerHTML(hd,str);
		
}

Draw.window.ability.action.attack.modTo = {
	'burn':{icon:'status.burn',
			text:(function(a){ return round(a.chance*100,2) + '% Chance to Burn for ' + round(a.magn*100*a.time,2) + '% Hp of Monster\'s Remaining Hp over ' + round(a.time/25,2) + 's.'; }),},
	'chill':{icon:'status.chill',
			text:(function(a){ return round(a.chance*100,2) + '% Chance to Chill, reducing Speed by -' + round(a.magn*100,2) + '% for ' + round(a.time/25,2) + 's.'; })},
	'confuse':{icon:'status.confuse',
			text:(function(a){ return round(a.chance*100,2) + '% Chance to Confuse for ' + round(a.time/25,2) + 's.'; })},
	'bleed':{icon:'status.bleed',
			text:(function(a){ return round(a.chance*100,2) + '% Chance to Bleed for ' + round(a.magn*100*a.time,2) + '% Initial Dmg over ' + round(a.time/25,2) + 's.'; })},
	'knock':{icon:'status.knock',
			text:(function(a){ return round(a.chance*100,2) + '% Chance to Knockback by ' + round(a.magn*a.time,2) + ' pixel over ' + round(a.time/25,2) + 's.'; })},	
	'drain':{icon:'status.drain',
			text:(function(a){ return round(a.chance*100,2) + '% Chance to Drain ' + round(a.magn*100,2) + '% Mana.'; })},
	'leech':{icon:'offensive.leech',
			text:(function(a){ return round(a.chance*100,2) + '% Chance to Life Leech ' + round(a.magn*100,2) + '% Hp'; })},
	'pierce':{icon:'offensive.pierce',
			text:(function(a){ return round(a.chance*100,2) + '% Chance to Pierce, reducing this attack damage by ' + round(100-a.dmgReduc*100,2) + '% Dmg.'; })},	
			
	'curse':{icon:'curse.skull',
			text:(function(a){ return round(a.chance*100,2) + '% Chance to Lower ' + Db.stat[a.boost[0].stat].name + ' by ' + round(100-a.boost[0].value*100,2) + '% for ' + round(a.boost[0].time/25,2) + 's.'; })},
	'sin':{icon:'offensive.bullet',
			text:(function(a){ return 'Sin Bullet'; })},
	'parabole':{icon:'offensive.bullet',
			text:(function(a){ return 'Parabole Bullet'; })},
	'nova':{icon:'offensive.bullet',
			text:(function(a){ return 'Nova'; })},
	'boomerang':{icon:'offensive.bullet',
			text:(function(a){ return 'Boomerang'; })},
	'onHit':{icon:'offensive.bullet',
			text:(function(a){ return 'Explosive'; })},
	'hitIfMod':{icon:'system.heart',
			text:(function(a){ return 'Affect Allies'; })},
	'heal':{icon:'system.heart',
			text:(function(a){ return 'HEAL NEED TO BE DONE'; })},
}

Draw.window.ability.action.boost = function(diffX,diffY){  ctxrestore();
	var s = Draw.window.main.constant(); 
	s.x += diffX;
	s.y += diffY;
	s.zx += diffX;
	s.zy += diffY;
	var ab = Draw.old.abilityShowed;
	var boost = ab.action.param;
	if(!boost) return
	
	var fontSize = 40;
	
	ctx.font = fontSize + 'px Kelly Slab';

	for(var i in boost[0]){
		Draw.icon(Db.stat[boost[0][i].stat].icon,[s.zx,s.zy],fontSize);
		var value = round(boost[0][i].value,2);
		if(+value >= + Cst.bigInt) value = 'Infinity';
		var str = boost[0][i].type + value + ' ' + Db.stat[boost[0][i].stat].name + ' for ' + round(boost[0][i].time/25,2) + 's.';
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
	
	var str = 'Summon a ' + info[1].variant + ' ' + info[1].category + ' Level ' + info[1].lvl + ' for ' + round(info[0].time/25,2) + 's. (Up to ' + info[0].maxChild + ')';
	ctx.fillText(str,s.zx,s.zy);
}

//}


//{quest
Draw.window.quest = function (){ ctxrestore();
	var s = Draw.window.main('Quest');	
	ctx = List.ctx.win;
	
	var q = Db.query('quest',main.windowList.quest);
	if(!q) return;
	var hq = html.questWin;	
	hq.div.style.visibility = 'visible';
	hq.div.style.left = s.mx + 'px'; 
	hq.div.style.top = s.my + 'px'; 
	
	var mq = main.quest[main.windowList.quest];
	
	var charY = 22;
	Draw.window.quest.upper(s,charY,q,mq,hq);
	Draw.window.quest.hint(s,charY,q,mq,hq);
	Draw.window.quest.description(s,charY,q,mq,hq);
	Draw.window.quest.req(s,charY,q,mq,hq);
	Draw.window.quest.bonus(s,charY,q,mq,hq);
}

Draw.window.quest.upper = function(s,charY,q,mq,hq){
	var icon = charY*4;
	
	//Icon
	Draw.icon(q.icon,[s.zx,s.zy],icon);
	
	//Info
	hq.info.style.left = icon + 5 + 'px'; 
	hq.info.style.top = 0 + 'px'; 
	
	hq.info.style.font = charY + 'px Kelly Slab';
	hq.info.style.width = s.dw/2 - icon - 5 + 'px';
	hq.info.style.height = charY*5*1.2 + 'px';

	
	var str = '';
	str += 'Name: ' + q.name + '<br>';
	var state = mq.complete ? 'Complete (x' + mq.complete + ')' : (mq.started ? 'Started' : 'Not Started');
	str += 'State: ' + state + '<br>';
	var rewardstat = round(q.reward.stat.value[0],3,1) + ' - ' + round(q.reward.stat.value[1],3,1) + ' in ' + Db.stat[q.reward.stat.stat].name;
	str += 'Reward: ' + rewardstat + '<br>';
	if(mq.reward){
		var boost = Draw.convert.boost(mq.reward);
		str += 'Current: ' + boost[1] + ' in ' + boost[0] + '(' + mq.rewardTier.toPercent(1) + ')' + '<br>';
	}
	var str2 = '';
	for(var i in q.reward.exp) str2 += q.reward.exp[i] + ' ' + i.capitalize() + ' Exp,';
	str2 = str2.slice(0,-1);
	if(!str2) str2 = 'None';
	str += 'Exp Reward: <span class="u" title="' + str2 + '">List<span> <br>'
	
	
	hq.info.innerHTML = str;

}

Draw.window.quest.hint = function(s,charY,q,mq,hq){
	//Hint
	var diffY = 10 + hq.info.style.top.numberOnly(1) + hq.info.style.height.numberOnly(1);
	
	ctx.font = charY-2 + 'px Kelly Slab';
	ctx.fillStyle = 'black';
	
	ctx.fillTextU('Hint:',s.zx-2,s.zy+diffY);
	hq.hint.style.left = 0 + 'px'; 
	hq.hint.style.top = diffY + charY + 'px'; 
	
	hq.hint.style.font = charY + 'px Kelly Slab';
	hq.hint.style.width = s.dw/2 -10 + 'px'
	hq.hint.style.height = charY*2*1.2 + 'px'
	
	hq.hint.innerHTML = mq.hint;

}

Draw.window.quest.description = function(s,charY,q,mq,hq){
	//Description
	var diffY = 30 + hq.hint.style.top.numberOnly(1) + hq.hint.style.height.numberOnly(1);
	
	ctx.font = charY-2 + 'px Kelly Slab';
	ctx.fillStyle = 'black';
	
	ctx.fillTextU('Description:',s.zx-2,s.zy+diffY);
	hq.description.style.left = 0 + 'px'; 
	hq.description.style.top = diffY + charY + 'px'; 
	
	hq.description.style.font = charY + 'px Kelly Slab';
	hq.description.style.width = s.dw/2 -10 + 'px'
	hq.description.style.height = charY*5*1.2 + 'px'
	
	hq.description.innerHTML = q.description;
}

Draw.window.quest.req = function(s,charY,q,mq,hq){
	//Requirements	
	ctx.font = charY-2 + 'px Kelly Slab';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'left';
	ctx.fillTextU('Requirements:',s.mcx,s.zy);
	hq.requirement.style.left = s.mdx + 'px'; 
	hq.requirement.style.top = charY + 'px'; 
	
	hq.requirement.style.font = charY + 'px Kelly Slab';
	hq.requirement.style.width = s.dw/2 + 'px'
	hq.requirement.style.height = charY*q.requirement.length*1.2 + 'px'
	
	hq.requirement.innerHTML = Draw.window.quest.req.convert(mq.requirement,q.requirement);
}

Draw.window.quest.req.convert = function(qvar,req){
	//convert the quest req object into string
	if(!req || !req.length){ return 'None.'; }
	
	var returnStr = '';
	for(var i in req){
		var text = req[i].text;
		if(+qvar[i]) returnStr += '<del>' + text + '</del>';	//if requirement is met
		else returnStr += text;		
		returnStr += '<br>';
	}

	return returnStr.slice(0,-4);
}

Draw.window.quest.bonus = function(s,charY,q,mq,hq){
	//Bonus	
	var diffY = 30 + hq.requirement.style.top.numberOnly(1) + hq.requirement.style.height.numberOnly(1);
	
	ctx.font = charY-2 + 'px Kelly Slab';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'left';
	
	hq.bonus.style.left = s.mdx + 'px'; 
	hq.bonus.style.top = diffY + charY + 'px'; 
	
	hq.bonus.style.font = charY + 'px Kelly Slab';
	hq.bonus.style.width = s.dw/2 + 'px'
	hq.bonus.style.height = charY*(1+Object.keys(q.bonus).length*1.2) + 'px'
	
	var title = 'Challenge:' + mq.bonus.challenge + ' * Orb:' + mq.bonus.orb + ' * Cycle:' + mq.bonus.cycle + ' + Complete:' + (0.01*mq.complete);
	var sum = mq.bonus.challenge*mq.bonus.orb*mq.bonus.cycle+(0.01*mq.complete);
	var str = '<span class="u" title="' + title + '"> Bonus: x' + round(sum,3) + '</span><br>';
	
	for(var i in q.challenge){
		var b = q.challenge[i];
		
		var color = mq.challenge[i] ? '#00FF00' : '#FF0000';
		
		str += 
			'<span ' + 
			'class="shadow" ' + 
			'style="color:' + color + '" ' +
			'onclick="Chat.send.command(\'' + '$win,quest,toggleChallenge,' + q.id + ',' + i + '\')' + '" ' + 
			'title="Toggle Challenge"' +
			'>' + b.info + ' - (x' + b.bonus + ')' +
			'</span><br>';
		
	}
	str = str.slice(0,-4);
	Draw.setInnerHTML(hq.bonus,str);	
		
}
//}

Draw.window.trade = function (){ ctxrestore();
	var s = Draw.window.main('Bank');	
	ctx = List.ctx.win;

	//change amount:
		
	var numX = s.mx+200;
	var numY = s.y+15;
	
	var prefAmount = main.pref.bankTransferAmount;
	var string = 'X-Amount: ' + prefAmount;
	
	ctx.setFont(25);
	ctx.fillText(string,numX,numY);
	
	//##################################
	
	var trade = main.windowList.trade;
	var myList = main.tradeList;
	var hisList = trade.tradeList;
	
	var s = Draw.window.main('Trading ' + trade.trader);	
	ctx = List.ctx.win;
	
	
	//Draw Own Items
	for (var i = 0 ; i < myList.length ; i++){
		if(!myList[i].length) continue;
		var numX = s.x + 160 + 65*(i%4);
		var numY = s.y + 70 + 65*Math.floor(i/4);
		
		Button.creation(0,{
			"rect":[numX,numX+56,numY,numY+56],
			"left":{"func":Chat.send.command,"param":['$win,trade,click,left,' + i]},
			"right":{"func":Chat.send.command,"param":['$win,trade,click,right,' + i]},
			'text':'Withdraw ' + main.bankList[i][2]
		});	
		
		
		Draw.item(myList[i],[numX,numY],56);
		
	}	
	
	//Draw Other Items
	for (var i = 0 ; i < hisList.length ; i++){
		if(!hisList[i].length) continue;
		var numX = s.x + 570 + 65*(i%4);
		var numY = s.y +  70 + 65*Math.floor(i/4);
			
		Button.creation(0,{
			"rect":[numX,numX+56,numY,numY+56],
			'text':hisList[i][2]
		});	
		
		Draw.item(hisList[i],[numX,numY],56);
	}	
	
	//Accept
	var numX = s.x+160; 
	var numY = s.h-50; 
	var wi = 250; 
	var he = 35;
	
	//My button
	Button.creation(0,{
		"rect":[numX,numX+wi,numY,numY+he],
		'text':trade.confirm.self ? 'Click to Refuse Trade' : 'Click to Accept Trade',
		"left":{"func":Chat.send.command,"param":['$win,trade,toggle,']},
	});
	
	
	ctx.textAlign = "center";
	ctx.setFont(25);
	ctx.fillStyle = "yellow";
	ctx.strokeStyle = 'yellow';
	
	ctx.fillText('Trade State ',numX+wi/2,numY+3);
	ctx.strokeRect(numX,numY,wi,he);
		
	Draw.icon(trade.confirm.self ? 'system.heart' : 'system.close',[numX+7,numY+7],20);

	var numX = s.x+570; var numY = s.h-50; var wi = 250; var he = 35;
	ctx.fillText('Trade State ',numX+wi/2,numY+3);
	ctx.strokeRect(numX,numY,wi,he);
	
	
	Draw.icon(trade.confirm.other ? 'system.heart' : 'system.close',[numX+7,numY+7],20);
	
	
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
			var id = Input.key[info.id][i][0];
			var name = Input.key[info.id][i][0].toString().keyCodeToName();
			if(Input.binding[info.id] === i){
				id = '***';
				name = '***';
			}
			
			var str2 = 'Change Key Binding for ' + info.name + ' ' + info.list[i];
			
			str += '<tr ' +
					'onclick="Input.binding.' + info.id + ' = ' + i + ';" ' + 
					'title="' + str2 + '"' +
					'>'
			str += '<td>' + info.name + ' ' + info.list[i] + '</td>'
			str += '<td>' + id + '</td>'
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
	hp.text.style.top = 5 + 'px'; 
	hp.text.style.font = 20 + 'px Kelly Slab';
	hp.text.style.width = 'auto';
	hp.text.style.height = 'auto';
	hp.text.style.whiteSpace = 'nowrap';
	hp.text.style.backgroundColor = 'white';
	
	var str = '<span ' + 
	'onclick="Draw.window.passive.grid.info.toggleFullscreen();' + '" ' + 
	'title="Toggle Fullscreen"' + 
	'>' + 'Fullscreen' + 
	'</span>';
	str += '<br>'
	str += 
	'<span ' + 
	'onclick="Draw.window.passive.grid.info.reset();' + '" ' + 
	'title="Reset Position and Zoom"' +
	'>' + 'Reset View' + 
	'</span>';
	str += '<br>'
	str += 'Points: ' + main.passivePt + '<br>';
	
	Draw.setInnerHTML(hp.text,str);
	Draw.window.passive.grid();
}

Draw.window.passive.grid = function(){ ctxrestore();
	var s = Draw.window.main.constant();	
	ctx = List.ctx.passiveGrid;
	
	var info = Draw.window.passive.grid.info;
	
	//Hide Background
	if(info.fullscreen){
		ctx.fillStyle = 'white';
		ctx.fillRect(0,0,Cst.WIDTH,Cst.HEIGHT);
		html.win.div.style.visibility = 'hidden';
		ctx.fillStyle = 'black';	
	}
	
	//Update Drag
	info.x += Input.mouse.drag.vx; var dx = info.x;
	info.y += Input.mouse.drag.vy; var dy = info.y;
	
	info.size = Math.max(0.1,info.size);
	info.size = Math.min(200,info.size);
	var icon = info.size ;
	var border = info.size/20;
	var border2 = border/2;
	var ic = icon + border;
	
	//Draw Stat	
	for(var i = 0 ; i < Db.passive.length ; i++){
		for(var j = 0 ; j < Db.passive[i].length ; j++){
			var numX = s.x + 300 + ic * j + dx;	
			var numY = s.y + 60 + ic * i + dy;
			
			ctx.globalAlpha = 1;
			
			//Freebies
			if(typeof Db.passive[i][j] !== 'object'){
				ctx.globalAlpha = 0.5;
				ctx.fillStyle = 'green';
				ctx.fillRect(numX,numY,ic,ic);
				continue;
			}
			
			//Border
			ctx.globalAlpha = 0.5;
			if(main.pref.passiveView === 0){ ctx.fillStyle =	+main.passive[i][j] ? 'green' : (Passive.test(main.passive,i,j) ? '#FFFF00': 'red');}
			if(main.pref.passiveView === 1){ var n = (Db.passive[i][j].count-Db.passive.min) / (Db.passive.max-Db.passive.min);	ctx.fillStyle =	Draw.gradientRG(n);}
			ctx.fillRect(numX,numY,ic,ic);
		
			//Icon
			ctx.globalAlpha = 0.5;
			if(+main.passive[i][j]){ ctx.globalAlpha = 1; }
			var name = Db.passive[i][j].stat ? Db.stat[Db.passive[i][j].stat].icon : Db.customBoost[Db.passive[i][j].value].icon;
			Draw.icon(name,[numX+border2,numY+border2],icon);
			
			//Hover
			if(!Input.mouse.drag.active && Collision.PtRect(Collision.getMouse(key),[numX,numX+ic,numY,numY+ic])){
				var hover = Db.passive[i][j];
			}
			
			//Button
			if(typeof Db.passive[i][j] === 'object'){
				Button.creation(0,{
					"rect":[numX,numX+ic,numY,numY+ic],
					"right":{"func":Chat.send.command,"param":['$win,passive,select,' + i + ',' + j]},
					'text':'Choose ' + (Db.passive[i][j].stat ? Db.stat[Db.passive[i][j].stat].name : Db.customBoost[Db.passive[i][j].value].name),
				});	
			}
			
		}
	}
	
	if(hover){ Draw.window.passive.hover(hover); }
	
	//Dragging
	Button.creation(0,{
		"rect":[s.x,s.x+s.w,s.y+50,s.y+50+s.h],	//+50 or close doesnt work
		"left":{"func":Input.event.mouse.drag,"param":[]},
		});	
	
}

Draw.window.passive.grid.info = {
	size:20,
	x:0,
	y:0,
	fullscreen:false,
	reset:(function(){
		Draw.window.passive.grid.info.x = 0;
		Draw.window.passive.grid.info.y = 0;
		Draw.window.passive.grid.info.size = 20;
	}),
	toggleFullscreen:(function(){
		Draw.window.passive.grid.info.fullscreen = !Draw.window.passive.grid.info.fullscreen;
	}),
}


Draw.window.passive.hover = function(over){ ctxrestore();
	var s = Draw.window.main.constant(); 
	var ctx = List.ctx.pop;
	
	var st = over.stat ? Db.stat[over.stat] : Db.customBoost[over.value];
	
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
	Draw.icon(st.icon,[ssx+5,ssy+1],20);
	ctx.fillTextU(st.name,ssx + 5 + 30,ssy+1);
	
	if(over.stat){
		var pop = 'Popularity: ';
		pop += round(100*over.count/Db.passive.average,1) + '%';
		ctx.fillText(pop,ssx + 5,ssy+1+25*1);
		var value = 'Value: +' + round(over.value,5);
		ctx.fillText(value,ssx + 5,ssy+1+25*2);
	} else {
		ctx.setFont(20);
		ctx.fillText(st.description,ssx + 5,ssy+1+25*1);
	}
}
//}




