(function(){ //}

Dialog('equip','Equip',Dialog.Size(500,680),Dialog.Refresh(function(){
	Dialog.equip.apply(this,arguments);
},function(){
	return Tk.stringify(Actor.getEquip(player).piece);
}));
//Dialog.open('equip')

Dialog.equip = function (html,variable){
	
	html.append($('<span>')
		.html('Mastery Point: ' + Actor.getExp(player).r(0) + '<br>')
		.attr('title','Obtained by killing monsters, harvesting resources and creating equips.')
		.css({fontSize:'2em'})
	);
	var bigDiv = $('<div>');
	html.append(bigDiv);
	//############
	//
	
	for(var i = 0 ; i < CST.equip.piece.length ; i++){	//1 => skip weapon
		var piece = CST.equip.piece[i];
		
		var id = Actor.getEquip(player).piece[piece];
		if(!id){
			bigDiv.append($('<span>')
				.html('No ' + piece.capitalize())
				.css({fontSize:'1.5em'})
				.attr('title','Wear equipment by clicking the equip in your inventory.')
			,'<br>');
			continue;
		}
		var equip = QueryDb.get('equip',id,function(){
			Dialog.open('equip');	//refresh if wasnt there
		});
		if(!equip) return false;
		
		var div = $('<div>').css(Dialog.equipPopup.globalDivCss);
		var good = Dialog.equipPopup.func(div,{},equip,true);
		bigDiv.append(good,'<br>');
		
	}	
}
	

//#####################
Dialog.equipPopup = {};
Dialog.equipPopup.globalDivCss = {	
	border:'2px solid black',
	padding:'0px 0px',
	zIndex:Dialog.ZINDEX.HIGH,
	font:'1.3em Kelly Slab',
	color:'black',
	backgroundColor:'white',
	height:'auto',
	width:'auto',
	textAlign:'center',
	whiteSpace:'nowrap',
	//display:'inline-block'
}
Dialog.equipPopup.func = function(html,variable,equip,equipWin){
	if(equipWin){
		var unequip = $('<button>')
			.html('X')
			.attr('title','Unequip')
			.mousedown(function(){
				Command.execute('tab,removeEquip',[equip.piece]);
			})
			.css({position:'absolute',left:0});
			
		html.append(unequip);
		/*.append($('<span>').css({position:'absolute',width:'200px',height:'100%'})
		.append(unequip));*/
	}
	
	
	var top = $('<div>')
		.css({width:'auto',height:'auto'});
	html.append(top);
	var icon = Img.drawIcon.html(equip.icon,48,equip.piece + ' ' + equip.type)
			.addClass('inline')
	var topRight = $('<div>')
		.addClass('inline')
		.css({position:'relative',margin:'0px 0px 0 0'})
		.append($('<span>')
			.css({
				color:equip.color === 'white' ? 'grey' : equip.color,
				fontSize:'1.5em',
				textDecoration:'underline',
				textAlign:'center',
			})
			.addClass('shadow')
			.html(equip.name + '<br>')
		)
		.append($('<span>')
			.html('Lv:' + equip.lvl + ' ')
			.attr('title','Reputation level required to use this.')
		)
		.append($('<span>')
			.html('Qual.:' + equip.quality.r(3) + ' ')
			.attr('title','Impact how high the hidden boosts are.')
		);
	
	var to = equip.piece === 'weapon' ? 'damage dealt.' : 'all its defence stats.';
	var bonus = Tk.round(Combat.getMasteryExpMod(equip.masteryExp),3,true);
	topRight.append($('<span>')
		.html('Mastery: ' + equip.masteryExp + ' ')
		.attr('title','Grant bonus of x' + bonus + ' to ' + to)
	);
	if(equip.creator)
		topRight.append($('<span>')
			.html('Creator:' + equip.creator)
			.attr('title','Player who found this equip.')
		);
		
		
	top.append(icon,topRight);
	
	var buttonDiv = $('<div>');
	
	if(equip.accountBound){
		buttonDiv.append($('<span>')
			.html('Bound')
			.attr('title','You can no longer trade this item.')
		);
		buttonDiv.append(' ');
	} else {
		var title = equip.creator === player.name 
			? 'Add a boost and every boost multiplied by x1.2. Equip become untradable.'
			: 'Add a boost. Equip become untradable.';
		buttonDiv.append($('<button>')
			.html('Bind')
			.attr('title',title)
			.mousedown(function(){
				Command.execute('equipBound',[equip.id]);
			})
		);
		buttonDiv.append(' ');
	}
	if(equip.salvagable){
		buttonDiv.append($('<button>')
			.html('Salvage')
			.attr('title','Convert into crafting materials.')
			.mousedown(function(){
				Command.execute('equipSalvage',[equip.id]);
			})
		);
		buttonDiv.append(' ');
	}
	if(equip.upgradable){
		buttonDiv.append($('<button>')
			.html('Add Mastery')
			.attr('title','Spend Mastery Points to improve this equip.')
			.mousedown(function(){
				Command.execute('equipMastery',[equip.id]);
			})
		);
	}
	html.append(buttonDiv);
	
	//##########################
	var ratio = $('<div>')
		.css({fontSize:'1.4em',verticalAlign:'center'});
		
	html.append(ratio);
	if(equip.piece === 'weapon'){
		var dmg = (Math.pow(equip.dmg.main*Combat.WEAPON_MAIN_MOD,10)*100).r(1);
		for(var element in equip.dmg.ratio){
			if(equip.dmg.ratio[element] === 1) break;
		}
		
		ratio.append($('<span>')
			.html('Power: ' + dmg)
			.attr('title','Base Power for this weapon.')
		)
		.append(' ')
		.append(Img.drawIcon.html('element.'+element,24,'x1.5 Damage if using ' + element.capitalize() + ' ability.'));	
	} else {
		var def = (Math.pow(equip.def.main*Combat.ARMOR_MAIN_MOD,10)*100).r(1);
		var elementMain = '';
		var elementSub = [];
		
		for(var elementMain in equip.def.ratio){
			if(equip.def.ratio[elementMain] > 1) break;
		}
		for(var i in equip.def.ratio){
			if(equip.def.ratio[i] === 1)
				elementSub.push(i);
		}
		
		if(elementMain)
			ratio.append($('<span>')
				.append((def*1.5).r(1) + ' ')
				.append(Img.drawIcon.html('element.'+elementMain,24))
				.attr('title','Defence against ' + elementMain.capitalize() + '.')
			);
		if(elementSub[0])
			ratio.append($('<span>')
				.append(' ' + def + ' ')
				.append(Img.drawIcon.html('element.'+elementSub[0],24))
				.attr('title','Defence against ' + elementSub[0].capitalize() + '.')
			);
		
		if(elementSub[1])
			ratio.append($('<span>')
				.append(' ' + def + ' ')
				.append(Img.drawIcon.html('element.'+elementSub[1],24))
				.attr('title','Defence against ' + elementSub[1].capitalize() + '.')
			);
	}
	//##########################
	var boostDiv = $('<div>')
		.css({textAlign:'center',border:'2px solid black',width:'100%',height:'100%'});
		//.css({fontSize:'1.4em',verticalAlign:'center'});
	html.append(boostDiv);
	var array = [];
	for(var i  = 0 ; i < equip.boost.length; i++){
		var boost = equip.boost[i];
		var stat = Stat.get(boost.stat);
		
		var value = boost.value.r(2);
		if(boost.type === '*') value = '+' + (boost.value*100).r(2) + '%';
		
		array.push([
			$('<span>')
				.html(stat.name)
				.attr('title',stat.description),
			$('<span>')
				.html(value)
				.attr('title',stat.description)
		]);
	}
	var table = Tk.arrayToTable(array,false,false,false,'10px 0')
		.css({margin:'0 auto'})
	boostDiv.append(table)
	
	//#########
	if(equip.upgradable){
		var itemNeeded = ItemList.stringify(equip.upgradeInfo.item,function(){
			Dialog.refresh('equipPopup',equip.id)
		});
		if(!itemNeeded) return false;
		var unlockDiv = $('<div>')
			.attr('title','Use ' + itemNeeded + ' to unlock a new boost and get exp.')
				
		for(var i = equip.boost.length; equip.upgradable && i < equip.maxAmount; i++){
			unlockDiv.append($('<button>')
				.addClass('myButton')
				.html('Unlock hidden boost')
				.attr('title','Use ' + itemNeeded + ' to unlock a new boost and get exp.')
				.mousedown(function(){
					Command.execute('equipUpgrade',[equip.id]);
				})
			);
			unlockDiv.append('<br>');
		}
		boostDiv.append(unlockDiv);
	}
	
	//#####################
	
	if(!equipWin){
		var mouse = Input.getMouse();
		var idealX = CST.WIDTH - mouse.x;
		var idealY = CST.HEIGHT - mouse.y;
		
		html.css({
			right:idealX.mm(0,CST.WIDTH-200),
			bottom:idealY.mm(0,CST.HEIGHT-200),
			position:'absolute',
		});
	}
	return html;
};

//Dialog.open('equipPopup','8v_tfE')
Dialog.UI('equipPopup',Dialog.equipPopup.globalDivCss,function(html,variable,param){
	if(!param) return false;
	
	var equip = QueryDb.get('equip',param,function(){
		Dialog.open('equipPopup',param);
	});	
	if(!equip) return false;
	Dialog.equipPopup.func(html,variable,equip);
});


})();




