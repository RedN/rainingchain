//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Server','Debug','QuestVar','ItemList','ActorGroup','Message','Boost','Drop','Quest','Collision','Command','Contribution'],['Main']));

var Main = exports.Main = function(key,extra){
	var main = {
		dialogue:null,
		name:'player000',		
		username:'player000',	
		id:key,
		chrono:Main.Chrono(),
		reputation:Main.Reputation(),
		social:Main.Social(),
		dailyTask:[],
		questActive:'',
		quest:Main.Quest(),
		questHint:'',
		contribution:Contribution.template(),	//check Sign.enterGame
		tradeInfo:{otherId:'',data:null,acceptSelf:false,acceptOther:false},
		change:{},
		old:{},
		flag:Main.Flag(),
		invList:Main.ItemList(),
		bankList:Main.ItemList(),
		pref:Main.Pref(),
		hudState:Main.HudState(),
		currentTab:"inventory",
		question:null,
		party:Main.Party(),
		//part of temp
		temp:{},
		questRating:'',	//name of quest
		sfx:'',
		song:'',
		questComplete:null,
		screenEffect:{},
	};
	for(var i in extra) main[i] = extra[i];
	Main.reputation.updatePt(main);
	
	return main;
}

Main.LIST = {}; //supposed to be only accesable by file starting with Main_

Main.get = function(id){
	return Main.LIST[id] || null;
}

Main.addToList = function(bullet){
	Main.LIST[bullet.id] = bullet;
}

Main.removeFromList = function(id){
	delete Main.LIST[id]; 
}

Main.forEach = function(func){
	for(var i in Main.LIST)
		func(Main.get(i));
}

Main.onSignIn = function(main){	//require act to be inited
	Main.reputation.updateBoost(main);
	Main.social.onSignInOff(main,'in');
}

Main.onSignOff = function(main){	//require act to be inited
	Main.social.onSignInOff(main,'off');
	Main.leaveParty(main);
	QuestVar.onSignOff(main);
}

Main.Pref = function(pref){
	return SERVER ? null : Pref.getDefaultValue(pref);
}

Main.getPref = function(main,id){
	return main.pref[id];
}

Main.getAct = function(main){
	return SERVER ? Actor.get(main.id) : player;
}

//#############

Main.addMessage = function(main,msg){
	if(typeof msg === 'string') msg = Message('game',msg,Message.SERVER);
	main.temp.message = main.temp.message || [];
	main.temp.message.push(msg);
}

Main.dropInv = function(main,id,amount){
	var amount = Math.min(1,Main.haveItem(main,id,0,'amount'));
	if(!amount) return false;
	
	var act = Main.getAct(main);
	Main.removeItem(main,id,amount);
	var spot = ActorGroup.alterSpot(Actor.Spot(act.x,act.y,act.map),25);
	Drop(spot,id,amount);
	Server.log(3,act.id,'dropInv',id,amount);
	return true;
}

Main.destroyInv = function(main,id,amount){
	var amount = Math.min(1,Main.haveItem(main,id,0,'amount'));
	if(!amount) return false;
	
	Main.removeItem(main,id,amount);
	Server.log(3,main.id,'destroyInv',id,amount);
	return true;
}


Main.HudState = function(){
	return {
		tab:0,
		inventory:0,
		'tab-equip':0,
		'tab-ability':0,
		'tab-stat':0,
		'tab-quest':0,
		'tab-reputation':0,
		'tab-highscore':0,
		'tab-friend':0,
		'tab-feedback':0,
		'tab-homeTele':0,
		'tab-setting':0,
		chat:0,
		bottomChatIcon:0,
		reputationBar:0,
		mana:0,
		hp:0,
		party:0,
		clan:0,
		minimap:0,	//impact hint and belowMinimap
		abilityBar:0,
		curseClient:0,
	};
}
Main.hudState = {};
Main.hudState.set = function(main,what,value){
	if(main.hudState[what] !== value){
		main.hudState[what] = value;
		Main.setFlag(main,'hudState');
	}
}
Main.hudState.NORMAL = 0;
Main.hudState.INVISIBLE = 1;
Main.hudState.FLASHING = 2;























