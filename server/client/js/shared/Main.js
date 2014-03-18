
Main = {};

Main.template = function(key){
	var main = {
		'temp':{'reset':{}},
		"optionList":null,
		'context':'',
		'chatInput':'',
		'pref':Main.template.pref(),
		
		"currentTab":"inventory",
		"windowList":{'bank':0,'trade':0,'offensive':0,'defensive':0,'ability':0,'passive':0,'quest':0,'binding':0},
		"popupList":{'equip':0,'plan':0},
		'hideHUD':{'tab':0,'chat':0,'window':0,'popup':0,'minimap':0,'state':0,'advancedStat':0,'passive':0,'advancedAbility':0},	
		
		'invList': ['','','','','','','','','','','','','','','','','','','','','','','',''],
		'bankList':[],
		'tradeList':['','','','','','','','','','','','','','','','','','','','','','','',''],
		'dialogue':0,
		'name':'player000',		
		'username':'player000',	
		'sfx':'',
		'song':'',
		
		'screenEffect':null,
		
		'pvpScore':[],
		
		
		'help':'',
		'passive':Passive.template(),
		'passiveUsablePt':0,
		'passiveUsedPt':[0,0],
		'passiveRemovePt':0,
		'passiveActive':0,
		'social':{
			'message':{
				'chat':[],
				'pm':[],
			},
			'list':{
				'friend':{},
				'mute':{},
				'clan':[],
			},
			
			'status':'on',
		}
		
		
	};
	if(server){
		main['change'] = [];
		main['quest'] = Main.template.quest();
		main['invList'] = Itemlist.template('inventory');
		main['bankList'] = Itemlist.template('bank');
		main['tradeList'] = Itemlist.template('inventory');
		main['old'] = {};
		main['id'] = key;
		main['dialogueLoc'] = {'x':0,'y':0};		
	} else {
		main['context'] = {'text':''};
		main['clientContext'] = {'text':''};
		main['permContext'] = {'text':''};
	}
	return main;
}

Main.passiveAdd = function(main,num,i,j){
	var key = main.id;
	//when player wants to add a passive
	if(Passive.getUnusedPt(key,num) <= -10){ Chat.add(key,"You don't have any Passive Points to use."); return;}	//TOFIX
	if(main.passive[num][i][j] !== '0'){ Chat.add(key,"You already have this passive.");	return;}
	if(!Passive.test.add(main.passive[num],i,j)){Chat.add(key,"You can't choose this passive yet.");	return;}
	
	main.passive[num][i] = main.passive[num][i].set(j,'1');
	
	Passive.updatePt(key);
	Passive.updateBoost(key);
}
Main.passiveRemove = function(main,num,i,j){
	var key = main.id;
	//when player wants to add a passive
	if(main.passiveRemovePt <= 0){ Chat.add(key,"You don't have any Passive Remove Points to use."); return;}
	if(main.passive[num][i][j] !== '1'){ Chat.add(key,"You don't have this passive.");	return;}
	if(!Passive.test.remove(main.passive[num],i,j)){Chat.add(key,"You can't remove this passive because it would create 2 subgroups.");	return;}
	
	main.passive[num][i] = main.passive[num][i].set(j,'0');
	
	Passive.updatePt(key);
	Passive.updateBoost(key);
}




Main.closeAllWindow = function(main){
	if(main.windowList.trade.trader){ List.main[main.windowList.trade.trader].windowList.trade = 0; }
	
	for(var i in main.windowList){
		main.windowList[i] = 0;
	}
}

Main.openWindow = function(main,name,param){
	Main.closeAllWindow(main);
	main.windowList[name] = 1;
		
	var key = main.id;
	
	if(name === 'quest'){
		main.windowList.quest = param;
		Quest.req.update(key,param);
		Quest.hint.update(key,param);
	}
	if(name === 'trade'){
		tradermain = List.main[param];
		if(!tradermain.windowList.trade){
			Main.closeAllWindow(tradermain);
			main.windowList.trade = {'trader':param,'tradeList':tradermain.tradeList,'confirm':{'self':0,'other':0}};
			tradermain.windowList.trade = {'trader':key,'tradeList':main.tradeList,'confirm':{'self':0,'other':0}};
		} else { Chat.add(key,'This player is busy.');}
	}
}

Main.openPopup = function(main,name,id){
	var player = List.all[main.id];
	if(name === 'equip') main.popupList.equip = {'x':player.mouseX,'y':player.mouseY,'id':id};
	if(name === 'plan')	main.popupList.plan = {'x':player.mouseX,'y':player.mouseY,'id':id};
}

Main.examineEquip = function(main, id){
	Main.openPopup(main,'equip',id);
}

Main.examinePlan = function(main, id){
	Main.openPopup(main,'plan',id);
}

Main.selectInv = function(main,obj){
	main.temp.selectInv = obj;
	main.temp.reset.selectInv = 1;
}

Main.abilityModClick = function(main,id){
	if(!main.windowList.ability){
		Chat.add(main.id,'The Ability Window needs to be opened to use this mod. It will have the following effect: <br>' + Db.abilityMod[id].info);
		return;
	} else {
		main.chatInput = ['$win,ability,addMod,' + id + ','   ,   0];
	}	
}





























