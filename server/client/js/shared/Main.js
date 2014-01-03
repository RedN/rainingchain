
Main = {};

Main.template = function(key){
	var main = {
		'change':[],
		'temp':{'reset':{}},
		"optionList":null,
		'context':'',
		'chatInput':'',
		'pref':Main.template.pref(),
		
		
		"currentTab":"inventory",
		"windowList":{'bank':0,'trade':0,'offensive':0,'defensive':0,'shop':0,'ability':0,'passive':0,'quest':0},
		"popupList":{'equip':0},
		
		'invList': ['','','','','','','','','','','','','','','','','','','','','','','',''],
		'bankList':[],
		'tradeList':[],
		'dialogue':0,
		'dialogueLoc':{'x':0,'y':0},
		'name':'player000',		
		
		'help':'',
		'passivePt':0,
		
		
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
		main['quest'] = Main.template.quest();
		main['passive'] = Passive.template();
		main['invList'] = new Inventory(key);
		main['bankList'] = new Bank(key);
		main['old'] = {};
		main['id'] = key;
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
	
	if(name === 'shop'){
		main.windowList.shop = shopList[param];
	}
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







































