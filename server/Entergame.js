var db = require('./Db');

Load.enterGame = function(key,account,act,main,socket){ //Called when player logs in
	if(account.lastSignIn === null) Load.enterGame.first(key,account);
	else if(Date.nowDate(account.lastSignIn) !== Date.nowDate())
		Cycle.day.quest(key);
		
	db.update('account',{username:account.username},{'$set':{online:1,lastSignIn:Date.now()}},function(err, res) { if(err) throw err
		socket.emit('signIn', { success:1, data:Load.enterGame.initData(key,act,main)});
	});
	
	var time = Math.floor(account.timePlayedThisWeek/Cst.HOUR) + 'h ' + Math.floor(account.timePlayedThisWeek%Cst.HOUR/Cst.MIN) + 'm';
	Chat.add(key,"You have played " + time + " this week.");
	
	
	Load.enterGame.hideHUD(key);
	Load.enterGame.quest(key);
	Load.enterGame.teleport(key);
	if(Server.testing) Load.enterGame.testing(key);
	
	
	act.boost.list['bullet-spd'].permBase *= 3;
	Actor.update.permBoost(act);
		
	
	Actor.setTimeout(act,'bugAbility',2*25,Test.setAbility);	//TOFIX
	if(!List.main[key].questActive) Quest.start(key,'QgoblinJewel');
	
	//Load.enterGame.fixAbilityCharge(key);	//BUG?
}

Load.enterGame.testing = function(key){
	Db.quest["Qtest"].event._start(key);	//test
	if(Quest.test){
		Itemlist.add(key,Quest.test + '-QuestTester');
		if(Db.quest[Quest.test].event._test && Db.quest[Quest.test].event._test.signIn)
			Db.quest[Quest.test].event._test.signIn(key);
	}
}

Load.enterGame.initData = function(key,player,main){
	//Value sent to client when starting game
    var data = {'player':{},'main':{},'other':{}};
    var obj = {'player':player, 'main':main}

    var array = {
        'player':{
            'name':0,
            'x':0,
            'y':0,
            'map':Change.send.convert.map,
            'equip':Change.send.convert.equip,
            'weapon':0,
            'skill':0,
            'ability':Change.send.convert.ability,
            'abilityList':Change.send.convert.abilityList,
			'permBoost':0,
        },
        'main':{
            'passive':0,
            'social':0,
            'quest':0,
			'questActive':0,
			'invList':Change.send.convert.itemlist,
			'bankList':Change.send.convert.itemlist,
			'tradeList':Change.send.convert.itemlist,
			'hideHUD':0,			
        }
    }
    for(var i in array){
        for(var j in array[i]){
            if(array[i][j]){ data[i][j] = array[i][j](obj[i][j],player);  continue;}
            data[i][j] = obj[i][j];
        }
    }
		
	data.other.passiveGrid = [
		Db.passiveGrid.moddedGrid[main.passive.freeze[0] || Date.nowDate()],
		Db.passiveGrid.moddedGrid[main.passive.freeze[1] || Date.nowDate()]
	];
	
	var q = {};	for(var i in Db.quest) if(Db.quest[i].visible) q[i] = Db.quest[i].name;
	data.other.quest = q;
	
	var h = {}; for(var i in Quest.highscore.list) h[i] = Quest.highscore.list[i].name;
	data.other.highscore = h;
	
	return data;
}

Load.enterGame.teleport = function(key){
	var act = List.all[key];
	act.map = null;
	
	var recentmap = Actor.teleport.getMapName(act,act.respawnLoc.recent.map);
	if(List.map[recentmap])
		Actor.teleport(act,act.respawnLoc.recent);
	else Actor.teleport(act,act.respawnLoc.safe);
}

Load.enterGame.first = function(key){
	var inv = List.main[key].invList;
	var act = List.all[key];
			
	Chat.add(act.id,"Note: This is a very early beta. Expect things to change... A LOT.");
	Chat.add(act.id,"Control: WADS. (For AZERTY users, change key binding via Pref Tab)");
	
	Actor.setRespawn(act,{x:1800,y:5600,map:'goblinLand@MAIN'});	//here if no Quest.test
	if(Db.quest[Quest.test] && Db.quest[Quest.test].event._test && Db.quest[Quest.test].event._test.firstSignIn){
		Db.quest[Quest.test].event._test.firstSignIn(key);
	}
	
	for(var i in Cst.equip.armor.piece)
		Actor.equip(act,'start-' + Cst.equip.armor.piece[i]);
	Actor.equip(act,'start-weapon');
	
	
}

Load.enterGame.fixAbilityCharge = function(key){
	for(var i in List.all[key].abilityChange.charge) 
		List.all[key].abilityChange.charge[i] = 0;
}

Load.enterGame.hideHUD = function(key){
	var total = Skill.getTotalLvl(key);
	if(total < 40) List.main[key].hideHUD.advancedAbility = 1;
	if(total < 30) List.main[key].hideHUD.equipOrb = 1;
	if(total < 25) List.main[key].hideHUD.questOrb = 1;
	if(total < 20) List.main[key].hideHUD.questChallenge = 1;
	if(total < 15) List.main[key].hideHUD.advancedStat = 1;
	if(total < 10) List.main[key].hideHUD.passive = 1;
}

Load.enterGame.quest = function(key){
	var mq = List.main[key].questActive;
	
	if(mq && Db.quest[mq].event._signIn)
		Db.quest[mq].event._signIn(key);	
}


