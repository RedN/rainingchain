
Main = {};

Main.template = function(key){
	var main = {
		'temp':{'reset':{}},
		"optionList":null,
		'context':'',
		'chatInput':'',
		'pref':Main.template.pref(),
		
		"currentTab":"inventory",
		"windowList":{'bank':0,'trade':0,'offensive':0,'defensive':0,'ability':0,'passive':0,'quest':0},
		"popupList":{'equip':0},
		
		'invList': ['','','','','','','','','','','','','','','','','','','','','','','',''],
		'bankList':[],
		'tradeList':[],
		'dialogue':0,
		'name':'player000',		
		
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
		if(!List.main[param].windowList.trade){
			Main.closeAllWindow(main);
			main.windowList.trade = {'trader':param,'tradeList':List.main[param].tradeList,'confirm':{'self':0,'other':0}};
			List.main[param].windowList.trade = {'trader':key,'tradeList':main.tradeList,'confirm':{'self':0,'other':0}};
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



































