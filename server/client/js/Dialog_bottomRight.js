(function(){ //}
var HEIGHT_BTN = 60;
var HEIGHT_INV = 110;
var HEIGHT_BAR = 110;

//Dialog.open('inventory')
Dialog.UI('tabButton',{
	position:'absolute',
	left:CST.WIDTH-200,
	top:CST.HEIGHT-HEIGHT_BTN,
	width:200,
	height:HEIGHT_BTN,
	background:'rgba(0,0,0,0.2)',
	padding:'2px 2px',
	overflowY:"hidden",
	border:'1px solid black',
},function(html){
	applyHudState.clearInterval();
	if(main.hudState.tab === Main.hudState.INVISIBLE){
		html.hide();
		return null;
	}
	html.show();
	
	var array = [
		[
			applyHudState('tab-equip',Img.drawIcon.html('tab.equip',24,'Open Equip Window',function(){
				Dialog.open('equip');
			})),
			applyHudState('tab-ability',Img.drawIcon.html('tab.ability',24,'Open Ability Window',function(){
				Dialog.open('ability');
			})),
			applyHudState('tab-stat',Img.drawIcon.html('attackMelee.slash',24,'Open Stat Window',function(){
				Dialog.open('stat');
			})),
			applyHudState('tab-quest',Img.drawIcon.html('tab.quest',24,'Open Quest List Window',function(){
				Dialog.open('questList');
			})),
			applyHudState('tab-reputation',Img.drawIcon.html('tab.reputation',24,'Open Reputation Grid',function(){
				Dialog.open('reputation');
			})),
		],
		[
			applyHudState('tab-highscore',Img.drawIcon.html('tab.quest',24,'Open Highscore Window',function(){
				Dialog.open('highscore');
			})),
			applyHudState('tab-friend',Img.drawIcon.html('tab.friend',24,'Open Friend List',function(){
				Dialog.open('friend');
			})),
			applyHudState('tab-feedback',Img.drawIcon.html('system.flag',24,'Leave Feedback',function(){
				Message.addPopup(main.id,'Click the Display/Hide Comments button below the game box.');
			})),
			applyHudState('tab-homeTele',Img.drawIcon.html('minimapIcon.door',24,'Abandon Active Quest and teleport to Town',function(){
				Command.execute('hometele',[]);
			})),	
			applyHudState('tab-setting',Img.drawIcon.html('tab.pref',24,'Settings',function(){
				Dialog.open('setting');
			}))
		],
	];	
	/*
	Main.a ddBtn(main,Button(Dr aw.icon("tab.quest",s.w-24*3,CST.HEIGHT-24,24),'Shift-Left: Check Contribution Rewards',{
			"shiftLeft":Button.Click(Command.execute,'reward,open'),
		}));
	*/	
	
	var table = Tk.arrayToTable(array,false,false,false,'4px 1px');
	table.addClass('center');
	html.append(table);
},function(){
	return Tk.stringify(main.hudState);
});

var applyHudState = function(name,html){
	if(main.hudState[name] === Main.hudState.NORMAL) return html;
	else if(main.hudState[name] === Main.hudState.INVISIBLE) return '';
	else if(main.hudState[name] === Main.hudState.FLASHING){
		applyHudState.BOOL[name] = true;
		applyHudState.FLASHING_INTERVAL[name] = setInterval(function() {
			applyHudState.BOOL[name] = !applyHudState.BOOL[name];
			if(applyHudState.BOOL[name])
				html.css({border:'2px solid white'});
			else html.css({border:'2px solid black'});
		},1000);
		return html;
	} 
	return html;	//shouldnt happen
}	
applyHudState.FLASHING_INTERVAL = {};
applyHudState.BOOL = {};
applyHudState.clearInterval = function(){
	for(var i in applyHudState.FLASHING_INTERVAL){
		if(applyHudState.FLASHING_INTERVAL[i])
			clearInterval(applyHudState.FLASHING_INTERVAL[i]);
	}
	applyHudState.FLASHING_INTERVAL = {};
}	
//##################
WHATEVER = null;
//Dialog.open('inventory')
Dialog.UI('inventory',{
	position:'absolute',
	left:CST.WIDTH-200,
	top:CST.HEIGHT-HEIGHT_INV-HEIGHT_BTN,
	width:250,	//BAD.. but if 200, 2nd table goes down cuz wrap
	height:HEIGHT_INV,
	background:'rgba(0,0,0,0.2)',
	padding:'0px 0px',
	border:'1px solid black',
},function(html){
	WHATEVER = html;
	if(main.hudState.inventory === Main.hudState.INVISIBLE){
		html.hide();
		return null;
	}
	html.show();
	
	var nonquest = {};
	var quest = {};
	for(var i in main.invList.data)
		if(main.questActive && i.contains(main.questActive))
			quest[i] = main.invList.data[i];
		else 
			nonquest[i] = main.invList.data[i];
	
	if(!quest.$isEmpty()){
		var array = convertItemListToArray(quest,2);
		var table = Tk.arrayToTable(array,false,false,false,'4px');
		
		table.addClass('inline').css({
			margin:'0px 0px 0px 0px',
			padding:'0px 0px 0px 0px',
			width:100,
			overflowY:"scroll",
			height:HEIGHT_INV,
		});
		html.append(table);
	}
	var amountPerRow = quest.$isEmpty() ? 4 : 2;
	var width = quest.$isEmpty() ? 200 : 100;
		
	var array = convertItemListToArray(nonquest,amountPerRow);
	var table = Tk.arrayToTable(array,false,false,false,'4px');
	table.addClass('inline').css({
		margin:'0px 0px 0px 0px',
		padding:'0px 0px 0px 0px',
		width:width,
		overflowY:"scroll",
		height:HEIGHT_INV,
	});
	html.append(table);
	
},function(){
	return Tk.stringify(main.invList.data) + Dialog.isOpened('bank') + main.questActive + main.hudState.inventory;
});

var convertItemListToArray = function(list,amountPerRow){
	var array = [[]];
	var arrayPosition = 0;
	for(var i in list){
		var amount = list[i];
		if(array[arrayPosition].length >= amountPerRow){
			arrayPosition++;
			array.push([]);
		}
		var item = QueryDb.get('item',i,function(){
			Dialog.refresh('inventory');
		});
		if(!item) continue;
		
		var word = Dialog.isOpened('bank') ? 'Transfer ' : 'Use ';
		var itemHtml = Img.drawItem(item.icon,36,word + item.name,amount);
				
		if(Dialog.isOpened('bank')){
			//BANK
			itemHtml.click((function(i){
				return function(e){
					if(!e.shiftKey) Command.execute('transferInvBank',[i,1]);
					else Command.execute('transferInvBank',[i,Main.getPref(main,'bankTransferAmount')]);
				}
			})(i))
			.bind('contextmenu',(function(i){
				return function(e){
					if(!e.shiftKey) Command.execute('transferInvBank',[i,25]);
					else Command.execute('transferInvBank',[i,99999999999]);
				}
			})(i));
		} else {
			//NORMAL
			itemHtml.click((function(i,item){
				return function(e){
					if(!e.shiftKey) Command.execute('useItem',[i,0]);	//first slot
					//else Command.execute('useItem',[i,1]);			//second slot
				}
			})(i,item))
			.bind('contextmenu',(function(i,item){
				return function(e){
					if(!e.shiftKey) Dialog.open('optionList',item);
					else ItemModel.displayInChat(item);
				}
			})(i,item));		
		}
			
		array[arrayPosition].push(itemHtml);
	}
	return array;
}



Dialog.UI('reputationBar',{
	position:'absolute',
	left:CST.WIDTH-200,
	top:CST.HEIGHT-HEIGHT_INV-HEIGHT_BTN-20,
	width:200,
	height:20,
	padding:'0px 0px',
},function(html,variable,param){
	if(main.hudState.reputationBar === Main.hudState.INVISIBLE){
		html.hide();
		return null;
	}
	
	html.show();
	
	var lvl = main.reputation.lvl;
	var exp = main.reputation.exp;
	
	if(variable.oldLvl !== undefined && variable.oldLvl !== lvl){
		var lvlUp = $('<div>')
			.css({top:-40,left:40,position:'absolute',color:'white',fontSize:'2em',background:'rgba(0,0,0,0.5)'})
			.addClass('shadow')
			.html('Level Up!')
		html.append(lvlUp);
		setTimeout(function(){
			lvlUp.hide();
		},10*1000);
		Message.add(key,'Level Up! You now have a Reputation Level ' + lvl + '. You gain 1 extra Reputation Point to strengthen your character.');
	} else if(variable.oldExp !== undefined && variable.oldExp !== exp){
		var diff = Math.round((exp - variable.oldExp)*1000);
		lvlUp = $('<div>')
			.css({top:-40,left:20,position:'absolute',color:'white',fontSize:'2em',background:'rgba(0,0,0,0.5)'})
			.addClass('shadow')
			.html('+' + diff + ' Rep')
		html.append(lvlUp);
		setTimeout(function(){
			lvlUp.hide();
		},10*1000);
		Message.add(key,'Completing this quest grant you ' + diff + ' Reputation Exp.');
	}
	variable.oldLvl = lvl;
	variable.oldExp = exp;
	
	
	var value = exp - CST.exp[lvl];
	var visibleExp = Math.round(exp*1000);
	
	var max = CST.exp[lvl+1]-CST.exp[lvl];
	value *= 1000;
	max *= 1000;
	var pct = Math.round(value/max*100) + "%";
	
	var title = 'Quest Reputation: Lv' + lvl + '. Xp: ' + visibleExp + '. Lv Up in ' + (max-value).r(0) + ' Xp.';
	var bar = $("<div>")
		.css({background:'rgba(0,0,0,0.4)',border:'1px solid black',borderRadius:'5px',padding:'3px'})
		.attr('title',title)
		.append($("<div>")
			.css({backgroundColor:'rgba(255,255,255,0.4)',width:pct,height:'15px',borderRadius:'5px'})
			.attr('title',title)
			.hover(function(){
				$(this).css({background:'rgba(255,255,255,1)'});
			},function(){
				$(this).css({background:'rgba(255,255,255,0.4)'});
			})
		);
	html.append(bar);
	

},function(){
	return '' + main.reputation.lvl + main.reputation.exp + main.hudState.reputationBar;
});
TRUUUE = true;




})();



