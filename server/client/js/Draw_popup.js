//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Tk','Input']));

Draw.popup = function(){
	if(main.popupList.equip) Draw.popup.equip();
	if(main.popupList.plan) Draw.popup.plan();
}

Draw.popup.frame = function(s){
	ctx.globalAlpha = 0.9;
	ctx.fillStyle = "#696969";
	ctx.strokeStyle="black";
	ctx.drawRect(s.x,s.y,s.w,s.h);
	ctx.globalAlpha = 1;
}



//{Equip
Draw.popup.equip = function(){ ctxrestore();
	var s = Draw.popup.equip.main();
	if(!s) return;
	
	Draw.popup.frame(s);
	Draw.popup.equip.top(s);	
	Draw.popup.equip.boost(s);
	
	if(s.equip.creator) ctx.fillText('Creator: ' + s.equip.creator,s.x+5,s.y+s.h-25);
	if(s.equip.accountBound) ctx.fillText('Bound',s.x+195,s.y+s.h-25);
}

Draw.popup.equip.main = function(){
	var pop = main.popupList.equip;
	ctx = List.ctx.win;
	
	if(typeof pop === 'object'){
		var id = pop.id;
		var posx = pop.x;
		var posy = pop.y;
	} else {
		var id = pop;
		var posx = Input.mouse.x;
		var posy = Input.mouse.y;
	}
	
	var equip = Db.query('equip',id);
	if(!equip) return; 
	
	var w = 250;
	var h = 250+25*Math.max(0,equip.boost.length-7);
	
	var sx = Math.max(0,Math.min(posx-w,CST.WIDTH-w));
	var sy = Math.max(0,Math.min(posy-h,CST.HEIGHT - h));	
	
	return {
		'w':w,
		'h':h,
		'x':sx,
		'y':sy,
		'mx':sx+w/2,
		'equip':equip
	};
}

Draw.popup.frame = function(s){
	ctx.globalAlpha = 0.9;
	ctx.fillStyle = "#696969";
	ctx.strokeStyle="black";
	ctx.drawRect(s.x,s.y,s.w,s.h);
	ctx.globalAlpha = 1;
}

Draw.popup.equip.top = function(s){
	//Draw icon
	Draw.icon(s.equip.icon,s.x+2,s.y+2,48);
	
	//Draw Name
	ctx.setFont(25);
	ctx.fillStyle = s.equip.color;
	ctx.textAlign = 'center';
	ctx.fillTextU(s.equip.name,s.x + 150,s.y);
	ctx.textAlign = 'left';
	ctx.fillStyle = 'white';
	
	//Lvl, bottom left below icon
	ctx.setFont(20);
	var string = 'Lv:' + s.equip.lvl;
	ctx.fillText(string,s.x+5,s.y+50);
	//if(!main.hideHUD.equipOrb) string += '  Orb: +' + Tk.round(s.equip.orb.upgrade.bonus*100-100,2) + '% | ' + s.equip.orb.upgrade.amount;
	//ctx.fillText(string,s.x+50+5,s.y+28);
	
	//Draw Def/Dmg right
	ctx.setFont(22);
	ctx.textAlign = 'center';
	
	if(s.equip.category === 'weapon') Draw.popup.equip.top.weapon(s);
	else Draw.popup.equip.top.armor(s);
	
	
	//Separation
	ctx.beginPath();
	ctx.moveTo(s.x,s.y+80);
	ctx.lineTo(s.x+s.w,s.y+80);
	ctx.stroke();
}

Draw.popup.equip.top.weapon = function(s){
	ctx.fillText('Damage: ' + (s.equip.dmg.main * s.equip.orb.upgrade.bonus).r(1),s.x+150,s.y+25);
	
	ctx.fillText('x1.5 Dmg for       ',s.x+150,s.y+25+25);
	var count = 0;
	for(var i in s.equip.dmg.ratio){
		if(s.equip.dmg.ratio[i] === 1) continue;
		Draw.icon('element.'+i,s.x+150+45 + count*25,s.y+25+25,24);
		count++
	}
}

Draw.popup.equip.top.armor = function(s){
	var def = s.equip.def.main * s.equip.orb.upgrade.bonus;
	
	ctx.textAlign = 'left';
	for(var i in s.equip.def.ratio){
		if(s.equip.def.ratio[i] > 1){
			Draw.icon('element.'+i,s.x+85+37,s.y+25+3,24);
			ctx.fillText((def*s.equip.def.ratio[i]).r(1),s.x+85+37+27,s.y+25+3,24);
		}
	}
	var count = 0;
	for(var i in s.equip.def.ratio)
		if(s.equip.def.ratio[i] === 1){
			Draw.icon('element.'+i,s.x+85+count*75,s.y+25+3+25,24);
			ctx.fillText((def*s.equip.def.ratio[i]).r(1),s.x+85+count*75+27,s.y+25+3+25,24);
			count++
		}
}

Draw.popup.equip.boost = function(s){
	//Boost
	ctx.setFont(20);
	ctx.textAlign = 'left';
	var numY = s.y+80;
	var sum = 0;
	for(var i in s.equip.boost){
		var boost = s.equip.boost[i];
		var info = Draw.convert.boost(boost);
		ctx.fillText('-' + info[0],s.x+10,numY+sum*20);
		ctx.fillText(info[1],s.x+10+170,numY+sum*20);
		sum++;	
	}
}
//}


//{Plan
Draw.popup.plan = function(){ ctxrestore();
	var s = Draw.popup.plan.main();
	if(!s) return;
	
	Draw.popup.frame(s);
	Draw.popup.plan.top(s);	
	Draw.popup.plan.req(s);
}

Draw.popup.plan.main = function(){
	var pop = main.popupList.plan;
	ctx = List.ctx.win;
	
	if(typeof pop === 'object'){
		var id = pop.id;
		var posx = pop.x;
		var posy = pop.y;
	} else {
		var id = pop;
		var posx = Input.mouse.x;
		var posy = Input.mouse.y;
	}
	
	var equip = Db.query('plan',id);
	if(!equip) return;
	
	var w = 250;
	var h = 250;
	
	var sx = Math.max(0,Math.min(posx-w,CST.WIDTH-w));
	var sy = Math.max(0,Math.min(posy-h,CST.HEIGHT - h));	
	
	return {
		'w':w,
		'h':h,
		'x':sx,
		'y':sy,
		'mx':sx+w/2,
		'equip':equip
	};
}

Draw.popup.plan.top = function(s){
	//Draw icon
	Draw.icon(s.equip.icon,s.x+2,s.y+2,48);
	
	//Draw Name
	ctx.fillStyle = s.equip.color;
	ctx.setFont(25);
	ctx.textAlign = 'center';
	ctx.fillTextU(s.equip.name,s.x+ 150,s.y);
	ctx.textAlign = 'left';
	ctx.fillStyle = 'white';
	
	ctx.setFont(15);
	var str = 'Lv:' + s.equip.lvl + ', Boost: ' + s.equip.minAmount + ' - ' + s.equip.maxAmount;
	ctx.fillText(str,s.x+50+5,s.y+28);
	
	//Piece Type
	ctx.setFont(25);
	var str = s.equip.piece.capitalize(); 
	if(s.equip.type) str += ' - ' + s.equip.type.capitalize();
	ctx.textAlign = 'center';
	ctx.fillText(str,s.mx,s.y+50);
	ctx.textAlign = 'left';
	
	
	//Separation
	ctx.beginPath();
	ctx.moveTo(s.x,s.y+80);
	ctx.lineTo(s.x+s.w,s.y+80);
	ctx.stroke();
}

Draw.popup.plan.req = function(s){
	//Skill
	var fontSize = 20;
	
	ctx.font= fontSize + "px Kelly Slab";
	ctx.textAlign = 'left';
	
	var count = 0;
	var numX = s.x+10;
	
	if(Object.keys(s.equip.req.skill).length){
		ctx.fillText('Skills Required:',numX,s.y+80+count*20);
		count++;
		
		for(var i in s.equip.req.skill){
			var numY = s.y+80+count*20;
			
			Draw.icon('skill.' + i,numX-2,numY+2,16);	
			
			var str = 'Level '  + s.equip.req.skill[i] + ' ' + i.capitalize();
			ctx.fillText(str,numX+25,numY);
			count++;	
		}
		
		count++;	
	}
	ctx.fillText('Items Required:',numX,s.y+80+count*20);
	count++;	
	
	for(var i in s.equip.req.item){
		var numY = s.y+80+count*20;
		
		var info = s.equip.req.item[i];
		Draw.icon(info[0],numX-2,numY+2,16);	
		var str = 'x'  + info[1] + ' ' + info[2];
		ctx.fillText(str,numX+25,numY);
		count++;	
	}
}



//}






