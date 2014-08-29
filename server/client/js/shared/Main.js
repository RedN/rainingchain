//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Server','Loop','Itemlist','Save','Chat','Dialogue','Drop','Quest','Collision','Passive','Command','Contribution'],['Main']));

var Main = exports.Main = {};

Main.template = function(key){
	var main = {
		"optionList":null,
		'chatInput':'',
		'pref':Main.template.pref(),
		
		"currentTab":"inventory",
		"windowList":{'highscore':0,'bank':0,'trade':0,'offensive':0,'defensive':0,'ability':0,'passive':0,'quest':0,'binding':0},
		"popupList":{'equip':null,'plan':null,count:0},
		'hideHUD':{'tab':0,'tab-equip':0,'tab-inventory':0,'tab-quest':0,'tab-skill':0,'tab-friend':0,'tab-pref':0,'chat':0,'window':0,'popup':0,'minimap':0,'state':0,'advancedStat':0,'passive':0,'advancedAbility':0,questChallenge:0,questOrb:0,equipOrb:0},	
		
		'invList': [],
		'bankList':[],
		'tradeList':[],
		'dialogue':null,
		'name':'player000',		
		'username':'player000',	
		'sfx':'',
		'song':'',
		'chrono':{},
		'screenEffect':{torch:null,fadeout:null},
		'flag':{chrono:0,passive:0},	//used in update and send TOEXPEND
		'questRating':'',	//name of quest
		arrow:{add:[],remove:[]},
		'help':'',
		'passive':Passive.template(),
		'social':{
			'message':[],
			'list':{
				'friend':{},
				'mute':{},
				'clan':[],
			},
			'puush':0,	//TOFIX	no clue what that is... puush is in main.pref
			'customChat':'000',
			'status':'on',
			'muted':0,
		},
		dailyTask:[],
		questActive:'',
		quest:{},
		questComplete:null,
		contribution:Contribution.template(),	//check Sign.enterGame
		tradeInfo:{otherId:'',data:null,acceptSelf:false,acceptOther:false},
	};
	if(SERVER){
		main['change'] = [];
		main['old'] = {};
		main['quest'] = Main.template.quest();
		main['invList'] = Itemlist.template('inventory');
		main['bankList'] = Itemlist.template('bank');
		main['tradeList'] = Itemlist.template('inventory');
		main['id'] = key;
	} else {
		main['context'] = {'text':''};
	}
	return main;
}

Main.template.pref = function(){
	return Command.pref.template();
}

Main.passiveAdd = function(main,num,i,j){
	var key = main.id;
	//when player wants to add a passive
	if(Passive.getUnusedPt(key,num) < 1) return Chat.add(key,"You don't have any Passive Points to use.");
	if(main.passive.grid[num][i][j] !== '0') return Chat.add(key,"You already have this passive.");
	if(!Passive.test.add(main.passive.grid[num],i,j)) return Chat.add(key,"You can't choose this passive yet.");
	
	main.passive.grid[num][i] = main.passive.grid[num][i].set(j,'1');
	
	Passive.updatePt(key);
	Passive.updateBoost(key);
}

Main.passiveRemove = function(main,num,i,j){
	var key = main.id;
	//when player wants to add a passive
	if(main.passive.removePt <= 0) return Chat.add(key,"You don't have any Passive Remove Points to use.");
	if(main.passive.grid[num][i][j] !== '1') return Chat.add(key,"You don't have this passive.");
	if(!Passive.test.remove(main.passive.grid[num],i,j)) return Chat.add(key,"You can't remove this passive because it would create 2 subgroups.");
	
	main.passive.grid[num][i] = main.passive.grid[num][i].set(j,'0');
	main.passive.removePt--;
	Passive.updatePt(key);
	Passive.updateBoost(key);
}

Main.grantRemovePt = function(main,num){
	num = num || 1;
	main.passive.removePt += num;
	Passive.updatePt(main.id);
	Itemlist.remove(main.invList,'orb-removal',num);
}

Main.closeAllWindow = function(main){
	if(main.windowList.trade) Main.closeAllWindow.trade(main);
	
	for(var i in main.windowList){
		main.windowList[i] = 0;
	}
	
	Actor.boost.removeById(List.all[main.id],'maxSpd@window');
	
}

Main.closeAllWindow.trade = function(main){
	main.windowList.trade = 0;
	Main.closeAllWindow(List.main[main.tradeInfo.key]);
	Itemlist.trade.reset(main.tradeList);
	main.tradeInfo = null;
}


Main.openWindow = function(main,name,param){
	Main.closeAllWindow(main);
	main.windowList[name] = param || 1;
		
	var key = main.id;
	
	if(name === 'quest'){
		Quest.requirement.update(key,param);
		Quest.updateHint(key,param);
		main.quest[param]._toUpdate = 1;
	}
	
	Actor.boost(List.all[main.id],{stat:'maxSpd',type:'*',value:0,time:CST.bigInt,name:'window'});
}

Main.isWindowOpen = function(mainn){
	var m = mainn || main;
	for(var i in m.windowList) if(m.windowList[i]) return true;
	return false;
}


Main.openPopup = function(main,name,id){
	var player = List.all[main.id];
	if(name === 'equip') main.popupList.equip = {'x':player.mouseX,'y':player.mouseY,'id':id};
	if(name === 'plan')	main.popupList.plan = {'x':player.mouseX,'y':player.mouseY,'id':id};
	main.flag.popupList = 1;
	main.popupList.count = 1;
}

Main.examine = function(main, type, id){
	Main.openPopup(main,type,id);
}

Main.selectInv = function(main,obj){
	main.selectInv = {count:1,data:obj};
}


Main.chrono = function(main,name,action,visible,text){
	main.flag.chrono = 1;
	visible = visible === false ? false : true;
	
	var chrono = main.chrono;
	if(action === 'start')
		chrono[name] = {time:0,removeTime:0,active:1,text:text || '',visible:visible};
	if(action === 'stop'){
		if(!chrono[name]) return;
		chrono[name].active = 0;
		return chrono[name].time;	//send # frames 
	}
	if(action === 'remove')
		delete chrono[name];
} //Update is in Actor.loop.chrono

Main.dropInv = function(main,id,amount){
	var inv = main.invList;
	var amount = Math.min(1,Itemlist.have(inv,id,0,'amount'));
	if(!amount) return false;
	
	var act = List.all[main.id];
	Itemlist.remove(inv,id,amount);
	Drop.creation({'x':act.x,'y':act.y,'map':act.map,'item':id,'amount':amount,'timer':25*30});
	Server.log(3,act.id,'dropInv',id,amount);
	return true;
}

Main.destroyInv = function(main,id,amount){
	var inv = main.invList;
	var amount = Math.min(1,Itemlist.have(inv,id,0,'amount'));
	if(!amount) return false;
	
	Itemlist.remove(inv,id,amount);
	Server.log(3,main.id,'destroyInv',id,amount);
	return true;
}

Main.screenEffect = function(main,name,info){
	info = info || {};
	info.name = name;
	main.screenEffect[name] = info;
}

Main.loop = function(main){	//server
	if(Loop.interval(5))	Main.loop.dialogue(main); 
	if(Loop.interval(Server.frequence.save)) Save(main.id);    		//save progression
	Main.loop.chrono(main); 
	if(Loop.interval(25*60)) Main.loop.friendList(main);   				//check if any change in friend list
}

Main.loop.dialogue = function(main){
	//test if player has move away to end dialogue	
	var key = main.id;
	if(!main.dialogue) return;
	if(Collision.distancePtPt(List.all[key],main.dialogue) > 100){
		Dialogue.end(key);
	}


}

Main.loop.friendList = function(main){
	var key = main.id;
	var fl = List.main[key].social.list.friend;
    
	for(var i in fl){
		var bool = Chat.receive.pm.test(List.all[key].name,i) || false;
		if(fl[i].online !== bool) main.flag['social,list,friend'] = 1;
		fl[i].online = bool;
	}
}

Main.loop.chrono = function(main){	//only function ran on client side
	for(var i in main.chrono){
		if(main.chrono[i].active) main.chrono[i].time += 1;
		else if(main.chrono[i].removeTime++ > 25*30 && SERVER) Main.chrono(main,i,'remove');
	}
}


Main.arrow = {};

Main.arrow.add = function(main,info){
	main.arrow.add = main.arrow.add || [];
	main.arrow.add.push(info);
};

Main.arrow.remove = function(main,info){
	main.arrow.remove = main.arrow.remove || [];
	main.arrow.remove.push(info);
}

Main.addSfx = function(main,name){
	main.sfx = name;
}




