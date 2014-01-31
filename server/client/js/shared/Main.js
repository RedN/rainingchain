
Main = {};

Main.template = function(key){
	var main = {
		'temp':{'reset':{}},
		"optionList":null,
		'context':'',
		'chatInput':'',
		'pref':Main.template.pref(),
		
		"currentTab":"inventory",
		"windowList":{'bank':0,'trade':0,'offensive':0,'defensive':0,'ability':0,'passive':0,'quest':0,'binding':0,'material':0,},
		"popupList":{'equip':0},
		
		'invList': ['','','','','','','','','','','','','','','','','','','','','','','',''],
		'bankList':[],
		'tradeList':['','','','','','','','','','','','','','','','','','','','','','','',''],
		'dialogue':0,
		'name':'player000',		
		
		'sfx':'',
		'song':'',
		
		
		'help':'',
		'passivePt':0,
		'passive':Passive.template(),
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
		main['material'] = Craft.material.template();		
	} else {
		main['context'] = {'text':''};
		main['clientContext'] = {'text':''};
		main['permContext'] = {'text':''};
	}
	return main;
}

Main.selectPassive = function(main,i,j){
	var key = main.id;
	//when player wants to add a passive
	if(main.passivePt === 0){ Chat.add(key,"You don't have any Passive Points to use."); return;}
	if(main.passive[i][j] === '1'){ Chat.add(key,"You already have this passive.");	return;}
	if(!Passive.test(main.passive,i,j)){Chat.add(key,"You can't choose this passive yet.");	return;}
	
	main.passivePt--;
	main.passive[i] = main.passive[i].slice(0,j) + '1' + main.passive[i].slice(j+1);
	Actor.permBoost(List.all[key],'Passive',Passive.convert(main.passive));
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
	if(name === 'equip'){
		main.popupList.equip = {'x':player.mouseX,'y':player.mouseY,'id':id};
	}	
}

Main.examineEquip = function(main, id){
	Main.openPopup(main,'equip',id);
}

Main.selectInv = function(main,obj){
	main.temp.selectInv = obj;
	main.temp.reset.selectInv = 1;
}

Main.abilityModClick = function(main,id){
	if(!main.windowList.ability){
		Chat.add(main.id,'The Ability Window needs to be opened to use this mod. It will have the following effect: <br>' + abilityModDb[id].info);
		return;
	} else {
		main.chatInput = ['$win,ability,mod,' + id + ',',0];
	}
	
}






























