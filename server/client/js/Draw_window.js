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
	t.style.font = titlesize + 'px Monaco';
	
	if(typeof title === 'string'){ t.innerHTML = title; } else {
		t.style.textDecoration = 'none';
		var str = '';
		for(var i in title){
			str += 
			'<span ' + 
			'style="text-decoration:' + (title[i] ? 'underline' : 'none') + '" ' +
			'onclick="Chat.send.command(\'' + '$win,open,' + i + '\')' + '" ' + 
			'onmouseover="main.permContext.text = \'' + 'Open ' + i.capitalize() + ' Window' + '\';' + '" ' + 
			'onmouseout="main.permContext.text = null;' + '" ' + 
			'>' + i.capitalize() + 
			'</span>';
			str += ' - ';
		}
		str = str.slice(0,-3);
		if(Draw.old.winTitle !== str){
			Draw.old.winTitle = str
			t.innerHTML = str;
		}
	}
	
	//Close
	Draw.icon('system.close',[s.x + s.w -20,s.y],20);	
	Button.creation(0,{
		"rect":[s.x + s.w -20,s.x + s.w,s.y,s.y+20],
		"left":{"func":Chat.send.command,"param":['$win,close']},
		'text':'Close'
	});
		
	return s;
}

Draw.window.main.constant = function(){
	var startX = 20;
	var startY = 50;
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

	//change amount:
		
	var numX = s.mx+200;
	var numY = s.y+15;
	
	var prefAmount = main.pref.bankTransferAmount;
	var string = 'X-Amount: ' + prefAmount;
	
	ctx.font = '25px Monaco';
	ctx.fillText(string,numX,numY);
	Button.creation(0,{
		"rect":[numX,numX+ctx.measureText(string).width,numY,numY+25],
		"left":{"func":Input.add,"param":['$pref,bankTransferAmount,']},
		"text":'Change X-Amount.'
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
}

Draw.window.stat = function(type){ ctxrestore();
	var obj = {'offensive':0,'defensive':0,'ability':0,'passive':0}; obj[type] = 1;
	var s = Draw.window.main(obj);	
	ctx = List.ctx.win;
	if(server){ return; }
	
	ctx.font = '22px Monaco';

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
	var str = 'Custom Effects: ';
	for(var i in player.boost.custom){
		str += Db.customBoost[i].name + ' - ';
	}
	str = str.slice(0,-3);
	ctx.font = '30px Monaco';
	ctx.fillText(str,numX,numY);
	
	
	if(hover !== undefined){ Draw.window.stat.hover(hover,type); }
	
}

Draw.window.stat.list = {
'defensive':[
	{'name':'Melee','icon':'offensive.melee','stat':[{'name':'x','stat':'def-melee-x'},{'name':'*','stat':'def-melee-*'},{'name':'^','stat':'def-melee-^'},{'name':'+','stat':'def-melee-+'}],'string':(function(){ return Draw.window.stat.list.element('def','melee')})},
	{'name':'Range','icon':'offensive.range','stat':[{'name':'x','stat':'def-range-x'},{'name':'*','stat':'def-range-*'},{'name':'^','stat':'def-range-^'},{'name':'+','stat':'def-range-+'}],'string':(function(){ return Draw.window.stat.list.element('def','range')})},
	{'name':'Magic','icon':'offensive.magic','stat':[{'name':'x','stat':'def-magic-x'},{'name':'*','stat':'def-magic-*'},{'name':'^','stat':'def-magic-^'},{'name':'+','stat':'def-magic-+'}],'string':(function(){ return Draw.window.stat.list.element('def','magic')})},
	{'name':'Fire','icon':'offensive.fire','stat':[{'name':'x','stat':'def-fire-x'},{'name':'*','stat':'def-fire-*'},{'name':'^','stat':'def-fire-^'},{'name':'+','stat':'def-fire-+'}],'string':(function(){ return Draw.window.stat.list.element('def','fire')})},
	{'name':'Cold','icon':'offensive.cold','stat':[{'name':'x','stat':'def-cold-x'},{'name':'*','stat':'def-cold-*'},{'name':'^','stat':'def-cold-^'},{'name':'+','stat':'def-cold-+'}],'string':(function(){ return Draw.window.stat.list.element('def','cold')})},
	{'name':'Lightning','icon':'offensive.lightning','stat':[{'name':'x','stat':'def-lightning-x'},{'name':'*','stat':'def-lightning-*'},{'name':'^','stat':'def-lightning-^'},{'name':'+','stat':'def-lightning-+'}],'string':(function(){ return Draw.window.stat.list.element('def','lightning')})},
		
	{'name':'Burn','icon':'defensive.burn','stat':[{'name':'Resist','stat':'resist-burn'}],'string':(function(){ return Draw.window.stat.list.status('def','burn')})},
	{'name':'Chill','icon':'defensive.chill','stat':[{'name':'Resist','stat':'resist-chill'}],'string':(function(){ return Draw.window.stat.list.status('def','chill')})},
	{'name':'Confuse','icon':'defensive.confuse','stat':[{'name':'Resist','stat':'resist-confuse'}],'string':(function(){ return Draw.window.stat.list.status('def','confuse')})},
	{'name':'Knockback','icon':'defensive.knock','stat':[{'name':'Resist','stat':'resist-knock'}],'string':(function(){ return Draw.window.stat.list.status('def','knock')})},
	{'name':'Bleed','icon':'defensive.bleed','stat':[{'name':'Resist','stat':'resist-bleed'}],'string':(function(){ return Draw.window.stat.list.status('def','bleed')})},
	{'name':'Drain','icon':'defensive.drain','stat':[{'name':'Resist','stat':'resist-drain'}],'string':(function(){ return Draw.window.stat.list.status('def','drain')})},
	
	{'name':'Speed','icon':'defensive.speed','stat':[{'name':'Max','stat':'maxSpd'},{'name':'Acc.','stat':'acc'},{'name':'Fric.','stat':'friction'}],'string':(function(){ return 'Max: ' + round(player.boost.list['maxSpd'].base,2,1) + ', Acc.: ' + round(player.boost.list['acc'].base,2,1)+ ', Fric.: ' + round(player.boost.list['friction'].base,2,1)})},
	{'name':'Pick Radius','icon':'defensive.pickup','stat':[{'name':'Pick Radius','stat':'pickRadius'}],'string':(function(){ return round(player.boost.list['pickRadius'].base,2,1)})},
	{'name':'Item Finding','icon':'defensive.item','stat':[{'name':'Quality','stat':'item-quality'},{'name':'Quantity','stat':'item-quantity'},{'name':'Rarity','stat':'item-rarity'}],'string':(function(){ return 'Qual.: ' + round(player.boost.list['item-quality'].base,2,1) + ', Quant.: ' + round(player.boost.list['item-quantity'].base,2,1)+ ', Rarity: ' + round(player.boost.list['item-rarity'].base,2,1)})},


	{'name':'Life','icon':'resource.hp','stat':[{'name':'Max','stat':'hp-max'},{'name':'Regen','stat':'hp-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['hp-max'].base,0,1) + ', Regen: ' + round(player.boost.list['hp-regen'].base,2,1)})},
	{'name':'Mana','icon':'resource.mana','stat':[{'name':'Max','stat':'mana-max'},{'name':'Regen','stat':'mana-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['mana-max'].base,0,1) + ', Regen: ' + round(player.boost.list['mana-regen'].base,2,1)})},
	{'name':'Fury','icon':'resource.fury','stat':[{'name':'Max','stat':'fury-max'},{'name':'Regen','stat':'fury-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['fury-max'].base,0,1) + ', Regen: ' + round(player.boost.list['fury-regen'].base,2,1)})},
	{'name':'Dodge','icon':'resource.dodge','stat':[{'name':'Max','stat':'dodge-max'},{'name':'Regen','stat':'dodge-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['dodge-max'].base,0,1) + ', Regen: ' + round(player.boost.list['dodge-regen'].base,2,1)})},
	{'name':'Heal','icon':'resource.heal','stat':[{'name':'Max','stat':'heal-max'},{'name':'Regen','stat':'heal-regen'}],'string':(function(){ return 'Max: ' + round(player.boost.list['heal-max'].base,0,1) + ', Regen: ' + round(player.boost.list['heal-regen'].base,2,1)})},

	
	
],

'offensive':[
	{'name':'Melee','icon':'offensive.melee','stat':[{'name':'x','stat':'dmg-melee-x'},{'name':'*','stat':'dmg-melee-*'},{'name':'^','stat':'dmg-melee-^'},{'name':'+','stat':'dmg-melee-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','melee')})},
	{'name':'Range','icon':'offensive.range','stat':[{'name':'x','stat':'dmg-range-x'},{'name':'*','stat':'dmg-range-*'},{'name':'^','stat':'dmg-range-^'},{'name':'+','stat':'dmg-range-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','range')})},
	{'name':'Magic','icon':'offensive.magic','stat':[{'name':'x','stat':'dmg-magic-x'},{'name':'*','stat':'dmg-magic-*'},{'name':'^','stat':'dmg-magic-^'},{'name':'+','stat':'dmg-magic-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','magic')})},
	{'name':'Fire','icon':'offensive.fire','stat':[{'name':'x','stat':'dmg-fire-x'},{'name':'*','stat':'dmg-fire-*'},{'name':'^','stat':'dmg-fire-^'},{'name':'+','stat':'dmg-fire-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','fire')})},
	{'name':'Cold','icon':'offensive.cold','stat':[{'name':'x','stat':'dmg-cold-x'},{'name':'*','stat':'dmg-cold-*'},{'name':'^','stat':'dmg-cold-^'},{'name':'+','stat':'dmg-cold-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','cold')})},
	{'name':'Lightning','icon':'offensive.lightning','stat':[{'name':'x','stat':'dmg-lightning-x'},{'name':'*','stat':'dmg-lightning-*'},{'name':'^','stat':'dmg-lightning-^'},{'name':'+','stat':'dmg-lightning-+'}],'string':(function(){ return Draw.window.stat.list.element('dmg','lightning')})},
	
	{'name':'Weapon','icon':'offensive.melee','stat':[{'name':'Mace','stat':'weapon-mace'},{'name':'Spear','stat':'weapon-spear'},{'name':'Sword','stat':'weapon-sword'}],'string':(function(){ return 'Mace: ' + round(player.boost.list['weapon-mace'].base,2,1) + ', Spear: ' + round(player.boost.list['weapon-spear'].base,2,1) + ', Sword: ' + round(player.boost.list['weapon-sword'].base,2,1)						})},
	{'name':'Weapon','icon':'offensive.range','stat':[{'name':'Bow','stat':'weapon-bow'},{'name':'Boomerang','stat':'weapon-boomerang'},{'name':'Crossbow','stat':'weapon-crossbow'}],'string':(function(){ return 'Bow: ' + round(player.boost.list['weapon-bow'].base,2,1) + ', Boom.: ' + round(player.boost.list['weapon-boomerang'].base,2,1) + ', CBow: ' + round(player.boost.list['weapon-crossbow'].base,2,1)						})},
	{'name':'Weapon','icon':'offensive.magic','stat':[{'name':'Wand','stat':'weapon-wand'},{'name':'Staff','stat':'weapon-staff'},{'name':'Orb','stat':'weapon-orb'}],'string':(function(){ return 'Wand: ' + round(player.boost.list['weapon-wand'].base,2,1) + ', Staff: ' + round(player.boost.list['weapon-staff'].base,2,1) + ', Orb: ' + round(player.boost.list['weapon-orb'].base,2,1)						})},
	
	{'name':'Burn','icon':'offensive.burn','stat':[{'name':'Chance','stat':'burn-chance'},{'name':'Magn','stat':'burn-magn'},{'name':'Time','stat':'burn-time'}],'string':(function(){ return Draw.window.stat.list.status('off','burn')})},
	{'name':'Chill','icon':'offensive.chill','stat':[{'name':'Chance','stat':'chill-chance'},{'name':'Magn','stat':'chill-magn'},{'name':'Time','stat':'chill-time'}],'string':(function(){ return Draw.window.stat.list.status('off','chill')})},
	{'name':'Confuse','icon':'offensive.confuse','stat':[{'name':'Chance','stat':'confuse-chance'},{'name':'Magn','stat':'confuse-magn'},{'name':'Time','stat':'confuse-time'}],'string':(function(){ return Draw.window.stat.list.status('off','confuse')})},
	{'name':'Knockback','icon':'offensive.knock','stat':[{'name':'Chance','stat':'knock-chance'},{'name':'Magn','stat':'knock-magn'},{'name':'Time','stat':'knock-time'}],'string':(function(){ return Draw.window.stat.list.status('off','knock')})},
	{'name':'Bleed','icon':'offensive.bleed','stat':[{'name':'Chance','stat':'bleed-chance'},{'name':'Magn','stat':'bleed-magn'},{'name':'Time','stat':'bleed-time'}],'string':(function(){ return Draw.window.stat.list.status('off','bleed')})},
	{'name':'Drain','icon':'offensive.drain','stat':[{'name':'Chance','stat':'drain-chance'},{'name':'Magn','stat':'drain-magn'},{'name':'Time','stat':'drain-time'}],'string':(function(){ return Draw.window.stat.list.status('off','drain')})},
	{'name':'Leech Hp','icon':'resource.hp','stat':[{'name':'Chance','stat':'leech-chance'},{'name':'Magn','stat':'leech-magn'},{'name':'Time','stat':'leech-time'}],'string':(function(){ return Draw.window.stat.list.status('off','leech'); })},
	
	{'name':'Pierce','icon':'offensive.pierce','stat':[{'name':'Chance','stat':'pierce-chance'},{'name':'Dmg Mod','stat':'pierce-dmgReduc'}],'string':(function(){ return 'Chance: ' + round(player.boost.list['pierce-chance'].base,2,1) + ', Dmg Mod: ' + round(player.boost.list['pierce-dmgReduc'].base,2,1); })},
	{'name':'Bullet','icon':'offensive.bullet','stat':[{'name':'Amount','stat':'bullet-amount'},{'name':'Aim','stat':'aim'}],'string':(function(){ return 'Amount: ' + round(player.boost.list['bullet-amount'].base,2,1) + ' , Aim: ' + round(player.boost.list['aim'].base,2,1); })},
	{'name':'Strike','icon':'offensive.bullet','stat':[{'name':'AoE','stat':'bullet-amount'},{'name':'Range','stat':'aim'},{'name':'Max','stat':'aim'}],'string':(function(){ return 'AoE: ' + round(player.boost.list['strike-size'].base,2,1) + ', Range: ' + round(player.boost.list['strike-range'].base,2,1) + ', Max: ' + round(player.boost.list['strike-maxHit'].base,2,1); })},
	{'name':'Summon','icon':'summon.wolf','stat':[{'name':'Amount','stat':'summon-amount'},{'name':'Time','stat':'summon-time'},{'name':'Attack','stat':'summon-atk'},{'name':'Defence','stat':'summon-def'}],'string':(function(){ return '#:' + round(player.boost.list['summon-amount'].base,2,1) + ', Time:' + round(player.boost.list['summon-time'].base,2,1) + ', A:' + round(player.boost.list['summon-atk'].base,2,1)+ ', D:' + round(player.boost.list['summon-def'].base,2,1); })},

	{'name':'Atk Spd','icon':'offensive.atkSpd','stat':[{'name':'Main','stat':'atkSpd-main'},{'name':'Support','stat':'atkSpd-support'}],'string':(function(){ return 'Main:' + round(player.boost.list['atkSpd-main'].base,2,1) + ', Support:' + round(player.boost.list['atkSpd-support'].base,2,1); })},
]}

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
	ctx.font = '25px Monaco';
	ctx.fillText(info.name + ':',numX + 200,numY+10);
	ctx.textAlign = 'left';
	ctx.font = '25px Monaco';
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
	if(server){ return; }  
	ctx = List.ctx.win;
	
	var ha = html.abilityWin;
	ha.div.style.visibility = 'visible';
	ha.div.style.left = s.mx + 'px'; 
	ha.div.style.top = s.my + 'px'; 
	
	var diffX = 100;
	var diffY = 120;
	Draw.window.ability.leftSide();
	Draw.window.ability.abilityList(diffX);
	Draw.window.ability.generalInfo(diffX,diffY);
	Draw.window.ability.upgrade(diffX+500,diffY+35);
	
	//Combat.action.attack
	Draw.old.abilityShowed = player.abilityList[Draw.old.abilityShowed] ? Draw.old.abilityShowed : Object.keys(player.abilityList)[0];
	if(!Draw.old.abilityShowed) return;
	
	if(player.abilityList[Draw.old.abilityShowed].action){
		Draw.window.ability.action(diffX,diffY + 120);
	}
	
}

Draw.window.ability.leftSide = function(){ ctxrestore();
	var s = Draw.window.main.constant(); 
	Draw.old.abilityShowed = player.abilityList[Draw.old.abilityShowed] ? Draw.old.abilityShowed : Object.keys(player.abilityList)[0];
	if(!Draw.old.abilityShowed) return;
	
	for(var i = 0 ; i < Input.key.ability.length ; i++){
		var numX = s.x + 15;
		var numY = s.y + 60 + 30 * i;
		
		ctx.font = '25px Monaco';
		ctx.fillText(Input.key.ability[i][0].toString().keyCodeToName(),numX,numY);
		
		if(player.ability[i]){
			Draw.icon(player.ability[i].icon,[numX+45,numY],20);
		} else {
			ctx.strokeStyle = 'black';
			ctx.strokeRect(numX+45,numY,20,20);
		}	
	
		var text = '';
		if(player.ability[i]){ text = player.ability[i].name; }
		
		Button.creation(0,{
			"rect":[numX, numX+45 + 32, numY, numY + 32 ],
			"left":{"func":Chat.send.command,"param":['$win,ability,swap,' + i + ',' + Draw.old.abilityShowed]},
			'text':text + ' => ' + player.abilityList[Draw.old.abilityShowed].name
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
	ha.subtitle.style.font = charY + 'px Monaco';
	ha.subtitle.style.width = 200 + 'px';
	ha.subtitle.style.height = charY*1.2 + 'px';
	
	var obj = {'attack':[],'blessing':[],'curse':[],'dodge':[],'heal':[],'summon':[]};
	for(var i in player.abilityList){
		obj[player.abilityList[i].type].push(player.abilityList[i]);
	}	
	
	var str = '';
	for(var j in obj){
		var numX = s.x + 50;
		var numY = s.y;
		
		str += 
		'<span ' + 
		'style="text-decoration:' + (j === ats ? 'underline' : 'none') + '" ' +
		'onclick="Draw.old.abilityTypeShowed = \'' + j +  '\';' + '" ' + 
		'onmouseover="main.permContext.text = \'' + j.capitalize() + '\';' + '" ' + 
		'onmouseout="main.permContext.text = null;' + '" ' + 
		'>' + j.capitalize().slice(0,1) + 
		'</span>';
		str += ' - '
	}	
	str = str.slice(0,-3);
	
	if(Draw.old.abilitySub !== str){	
		Draw.old.abilitySub = str;
		ha.subtitle.innerHTML = str;
	}
		
		
	//Drawing
	for(var j in obj[ats]){
		var numX = s.zx + diffX + +j%15 * 25;
		var numY = s.zy + charY*1.2 + Math.floor(+j/15) * 25;
				
		Draw.icon(obj[ats][j].icon,[numX,numY],20);
		
		for(var i in player.abilityList){ 
			if(player.abilityList[i].id === obj[ats][j].id){
				Button.creation(0,{
					"rect":[numX, numX + 20, numY, numY + 20 ],
					"left":{"func":(function(a){ Draw.old.abilityShowed = a; }),"param":[obj[ats][j].id]},
					'text':'Select Ability: ' + obj[ats][j].name
				});	
			}
		}
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
	var ab = player.abilityList[Draw.old.abilityShowed];
	var icon = 100;
	Draw.icon(ab.icon,[s.zx,s.zy],icon);
	
	//General Info
	var gi = html.abilityWin.generalinfo;
	var charY = 20;
	gi.style.left = diffX + icon + 10 + 'px'; 
	gi.style.top = diffY + 'px'; 
	gi.style.font = charY + 'px Monaco';
	gi.style.width = 500 + 'px';
	gi.style.height = 100 + 'px';
	
	var	str = 
	'<span style="font:30px Monaco">' + ab.name + '</span>' +	
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
	
	if(Draw.old.abilityMod !== str){
		Draw.old.abilityMod = str;
		gi.innerHTML = str;
	}
}

Draw.window.ability.upgrade = function(diffX,diffY){
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
	hu.style.font = 30 + 'px Monaco';
	
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
	
	if(Draw.old.abilityUpgrade !== str){
		hu.innerHTML = str;
		Draw.old.abilityUpgrade = str;
	}
}	

Draw.window.ability.generalInfo.mod = function(){
	if(html.chat.input.value.indexOf('$win,ability,mod,') !== -1){
		Chat.send.command(html.chat.input.value + Draw.old.abilityShowed);
		html.chat.input.value = '';
	} else {
		Chat.add('Select an ability mod in your inventory first.');
	}
}

Draw.window.ability.generalInfo.upgrade = function(){
	var name = Draw.old.abilityShowed;
	var option = {'name':'Upgrade ' + name,'count':1,'option':[
		{'name':'Use 1 Orb','func':Chat.send.command,'param':['$win,ability,upgrade,' + name + ',1']},
		{'name':'Use 10 Orbs','func':Chat.send.command,'param':['$win,ability,upgrade,' + name + ',10']},
		{'name':'Use 100 Orbs','func':Chat.send.command,'param':['$win,ability,upgrade,' + name + ',100']},
		{'name':'Use X Orbs','func':Input.add,'param':['$win,ability,upgrade,' + name + ',']},
	]};
	Button.optionList(option);
}

Draw.window.ability.generalInfo.upMod = function(mod){
	var name = Draw.old.abilityShowed;
	var option = {'name':'Upgrade Mod ' + abilityModDb[mod].name + ' of ' + name,'count':1,'option':[
		{'name':'Use 1 Orb','func':Chat.send.command,'param':['$win,ability,upMod,' + name + ',' + mod + ',1']},
		{'name':'Use 10 Orbs','func':Chat.send.command,'param':['$win,ability,upMod,' + name + ',' + mod + ',10']},
		{'name':'Use 100 Orbs','func':Chat.send.command,'param':['$win,ability,upMod,' + name + ',' + mod + ',100']},
		{'name':'Use X Orbs','func':Input.add,'param':['$win,ability,upMod,' + name + ',' + mod + ',']},
	]};
	
	Button.optionList(option);
}

Draw.window.ability.action = function(diffX,diffY){ ctxrestore();
	var ab = player.abilityList[Draw.old.abilityShowed];
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
	
	var ab = player.abilityList[Draw.old.abilityShowed];
	var atk = deepClone(ab.action.param.attack);
	atk = Combat.action.attack.mod(player,atk);
	
	
	//General Info
	ctx.font = '25px Monaco';
	var dmg = round(atk.dmgMain,2);
	var str = 'Damage: ' + dmg + ' x ';
	
	var dist = ctx.length(str);
	Draw.element(s.zx+dist,s.zy,300,25,atk.dmgRatio);
	ctx.fillText(str,s.zx,s.zy);
	str = 'x' + atk.amount + ' Bullet' + (atk.amount > 1 ? 's' : '') + ' @ ' + atk.angle + '°';
	ctx.fillText(str,s.zx,s.zy+25);
	
	//RIght
	str = 'Weapon Compability: ' + round(atk.weaponCompability,3,1);
	ctx.fillText(str,s.zx+500,s.zy);
	var dmg = 0;
	for(var i in atk.dmg){ dmg += atk.dmg[i]; }
	str = 'DPS: ' + round(dmg / ab.period * 25,1);
	ctx.fillText(str,s.zx+500,s.zy+30);
	
	//Mods
	for(var i in atk){
		if(atk[i]){
			if(Draw.window.ability.action.attack.modTo[i]){
				var tmp = atk[i];
				
				//Status
				if(Cst.status.list.have(i)){ 
					var mod = tmp.chance * player.bonus[i].chance;
					var base = Math.pow(main.pref.abilityDmgStatusTrigger/100*atk.dmgRatio[Cst.status.toElement[i]],1.5);
					tmp.chance = Math.probability(base,mod);
				}	
				if(tmp.chance !== undefined && tmp.chance <= 0.01){ continue;}
				Draw.icon(Draw.window.ability.action.attack.modTo[i].icon,[s.zx,s.zy+25+30],20);
				ctx.fillText('=> ' + Draw.window.ability.action.attack.modTo[i].text(tmp),s.zx+30,s.zy+25+30);
				s.zy += 25;
				
			}
		}
	}
}


Draw.window.ability.action.attack.modTo = {
	'burn':{icon:'offensive.burn',
			text:(function(a){ return round(a.chance*100,2) + '% to Burn for ' + round(a.magn*100*a.time,2) + '% Hp of Monster\'s Remaining Hp over ' + round(a.time/25,2) + 's.'; }),},
	'chill':{icon:'offensive.chill',
			text:(function(a){ return round(a.chance*100,2) + '% to Chill, reducing Speed by -' + round(a.magn*100,2) + '% for ' + round(a.time/25,2) + 's.'; })},
	'confuse':{icon:'offensive.confuse',
			text:(function(a){ return round(a.chance*100,2) + '% to Confuse for ' + round(a.time/25,2) + 's.'; })},
	'bleed':{icon:'offensive.bleed',
			text:(function(a){ return round(a.chance*100,2) + '% to Bleed for ' + round(a.magn*100*a.time,2) + '% Initial Dmg over ' + round(a.time/25,2) + 's.'; })},
	'knock':{icon:'offensive.knock',
			text:(function(a){ return round(a.chance*100,2) + '% to Knockback by ' + round(a.magn*a.time,2) + ' pixel over ' + round(a.time/25,2) + 's.'; })},	
	'drain':{icon:'offensive.drain',
			text:(function(a){ return round(a.chance*100,2) + '% to Drain ' + round(a.magn*100,2) + '% Mana.'; })},
	'leech':{icon:'offensive.leech',
			text:(function(a){ return round(a.chance*100,2) + '% to Life Leech ' + round(a.magn*100,2) + '% Hp'; })},
	'pierce':{icon:'offensive.leech',
			text:(function(a){ return round(a.chance*100,2) + '% to Pierce, reducing this attack damage by ' + round(100-a.dmgReduc*100,2) + '% Dmg.'; })},	
			
	'curse':{icon:'curse.skull',
			text:(function(a){ return round(a.chance*100,2) + '% to Lower ' + Db.stat[a.boost[0].stat].name + ' by ' + round(100-a.boost[0].value*100,2) + '% for ' + round(a.boost[0].time/25,2) + 's.'; })},
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
	var ab = player.abilityList[Draw.old.abilityShowed];
	var boost = ab.action.param;
	
	for(var i in boost){
		Draw.icon(Db.stat[boost[i].stat].icon,[s.zx,s.zy],20);
		var str = boost[i].type + round(boost[i].value,2) + ' ' + Db.stat[boost[i].stat].name + ' for ' + round(boost[i].time/25,2) + 's.';
		ctx.fillText(str,s.zx+30,s.zy);
		s.zy += 30;
	}
	
}

Draw.window.ability.action.summon = function(diffX,diffY){  ctxrestore();
	var s = Draw.window.main.constant(); 
	s.x += diffX;
	s.y += diffY;
	s.zx += diffX;
	s.zy += diffY;
	var ab = player.abilityList[Draw.old.abilityShowed];
	var info = ab.action.param;
	ctx.font = '30px Monaco';
	
	var str = 'Summon a ' + info[1].variant + ' ' + info[1].category + ' Level ' + info[1].lvl + ' for ' + round(info[0].time/25,2) + 's. (Up to ' + info[0].maxChild + ')';
	ctx.fillText(str,s.zx,s.zy);
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
	
	ctx.font = '25px Monaco';
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
	ctx.font = "25px Monaco";
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


Draw.window.quest = function (){ ctxrestore();
	var s = Draw.window.main('Quest');	
	ctx = List.ctx.win;
	
	var q = Db.quest[main.windowList.quest];
	var hq = html.questWin;
	var mq = main.quest[main.windowList.quest];
	
	var charY = 22;
	var icon = charY*4;
	
	hq.div.style.visibility = 'visible';
	hq.div.style.left = s.mx + 'px'; 
	hq.div.style.top = s.my + 'px'; 
	
	//Icon
	Draw.icon(q.icon,[s.zx,s.zy],icon);
	
	//Info
	hq.info.style.left = icon + 5 + 'px'; 
	hq.info.style.top = 0 + 'px'; 
	
	hq.info.style.font = charY + 'px Monaco';
	hq.info.style.width = s.dw/2 - icon - 5 + 'px';
	hq.info.style.height = charY*4*1.2 + 'px';

	
	var str = '';
	str += 'Name: ' + q.name + '<br>';
	var state = mq.complete ? 'Complete (x' + mq.complete + ')' : (mq.started ? 'Started' : 'Not Started');
	str += 'State: ' + state + '<br>';
	str += 'Reward: ' + round(q.reward.value[0],3,1) + ' - ' + round(q.reward.value[1],3,1) + ' in ' + Db.stat[q.reward.stat].name + '<br>';
	if(mq.complete){
		var boost = Draw.convert.boost(mq.reward);
		str += 'Current Reward: ' + boost[1] + ' in ' + boost[0] + '(' + mq.rewardTier + ')' + '<br>';
	}
	
	hq.info.innerHTML = str;
	
	
	
	//Hint
	var diffY = 10 + hq.info.style.top.numberOnly(1) + hq.info.style.height.numberOnly(1);
	
	ctx.font = charY-2 + 'px Monaco';
	ctx.fillStyle = 'black';
	
	ctx.fillTextU('Hint:',s.zx-2,s.zy+diffY);
	hq.hint.style.left = 0 + 'px'; 
	hq.hint.style.top = diffY + charY + 'px'; 
	
	hq.hint.style.font = charY + 'px Monaco';
	hq.hint.style.width = s.dw/2 -10 + 'px'
	hq.hint.style.height = charY*2*1.2 + 'px'
	
	hq.hint.innerHTML = mq.hint;
	
	//Description
	var diffY = 30 + hq.hint.style.top.numberOnly(1) + hq.hint.style.height.numberOnly(1);
	
	ctx.font = charY-2 + 'px Monaco';
	ctx.fillStyle = 'black';
	
	ctx.fillTextU('Description:',s.zx-2,s.zy+diffY);
	hq.description.style.left = 0 + 'px'; 
	hq.description.style.top = diffY + charY + 'px'; 
	
	hq.description.style.font = charY + 'px Monaco';
	hq.description.style.width = s.dw/2 -10 + 'px'
	hq.description.style.height = charY*5*1.2 + 'px'
	
	hq.description.innerHTML = q.description;
	
	
	//Requirements	
	ctx.font = charY-2 + 'px Monaco';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'left';
	ctx.fillTextU('Requirements:',s.mcx,s.zy);
	hq.requirement.style.left = s.mdx + 'px'; 
	hq.requirement.style.top = charY + 'px'; 
	
	hq.requirement.style.font = charY + 'px Monaco';
	hq.requirement.style.width = s.dw/2 + 'px'
	hq.requirement.style.height = charY*q.requirement.length*1.2 + 'px'
	
	hq.requirement.innerHTML = Quest.req.convert(mq.requirement,q.requirement);
	
	
	//Bonus	
	var diffY = 30 + hq.requirement.style.top.numberOnly(1) + hq.requirement.style.height.numberOnly(1);
	
	ctx.font = charY-2 + 'px Monaco';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'left';
	
	hq.bonus.style.left = s.mdx + 'px'; 
	hq.bonus.style.top = diffY + charY + 'px'; 
	
	hq.bonus.style.font = charY + 'px Monaco';
	hq.bonus.style.width = s.dw/2 + 'px'
	hq.bonus.style.height = charY*Object.keys(q.bonus).length*1.2 + 'px'
	
	var str = '';
	for(var i in q.bonus){
		var b = q.bonus[i];
		
		var color = mq.bonus[i] ? '#00FF00' : '#FF0000';
		
		str += 
			'<span ' + 
			'class="shadow" ' + 
			'style="color:' + color + '" ' +
			'onclick="Chat.send.command(\'' + '$win,quest,toggleBonus,' + q.id + ',' + i + '\')' + '" ' + 
			'onmouseover=\"main.permContext.text = \'Toggle Bonus\'\" ' +
			'onmouseout="main.permContext.text = null;' + '" ' + 
			'>' + b.info + ' - (x' + b.bonus + ')' +
			'</span><br>';
	}
	str = str.slice(0,-4);
	if(Draw.old.questWin !== str){	
		Draw.old.questWin = str;
		hq.bonus.innerHTML = str;
	}
	
	ctx.fillTextU('Bonus:  x' + round(mq.bonusSum + 0.01*mq.complete,3),s.mcx,s.zy+diffY);
	
}


	
//{ Passive
Draw.window.passive = function (){ ctxrestore();
	var s = Draw.window.main({'offensive':0,'defensive':0,'ability':0,'passive':1});	
	ctx = List.ctx.win;
	
	ctx.font = '25px Monaco';
	ctx.fillStyle = 'black';
	
	var hp = html.passiveWin;
	hp.div.style.visibility = 'visible';
	hp.div.style.left = s.mx + 'px'; 
	hp.div.style.top = s.my - 65 + 'px'; 
	
	//Subtitle
	var charY = 25;
	hp.text.style.left = 15 + 'px'; 
	hp.text.style.top = 5 + 'px'; 
	hp.text.style.font = 25 + 'px Monaco';
	hp.text.style.width = '125px';
	hp.text.style.height = 'auto';
	hp.text.style.backgroundColor = 'white';
	
	var str = '<span ' + 
	'onclick="Draw.window.passive.grid.info.toggleFullscreen();' + '" ' + 
	'>' + 'Fullscreen' + 
	'</span>';
	str += '<br>'
	str += 
	'<span ' + 
	'onclick="Draw.window.passive.grid.info.reset();' + '" ' + 
	'>' + 'Reset View' + 
	'</span>';
	str += '<br>'
	str += 'Points: ' + main.passivePt + '<br>';
	
	if(Draw.old.passiveText !== str){
		Draw.old.passiveText = str
		hp.text.innerHTML = str;
	}
	
	Draw.window.passive.grid();
}

Draw.window.passive.grid = function(key){ ctxrestore();
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
		ctx.font = '20px Monaco';
		ctx.fillText(st.description,ssx + 5,ssy+1+25*1);
	}
}
//}




