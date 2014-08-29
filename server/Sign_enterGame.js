//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Tk','Load','Server','Cycle','Itemlist','Change','Map','Chat','Sign','requireDb','Contribution','Skill','Sprite','Test','Quest']));
var db = requireDb();

Sign.enterGame = function(key,account,act,main,socket){ //Called when player logs in
	if(account.lastSignIn === null){
		Quest.start(key,'Qtutorial');
	} else {
		Sign.enterGame.teleport(key);	//normal tele
		Sign.enterGame.quest(key);	//_testSignIn teleport
		Sign.enterGame.contribution(key);
	}
	
	if(account.lastSignIn === null || Date.nowDate(account.lastSignIn) !== Date.nowDate()){
		Cycle.day.quest(key);
		Cycle.day.task(key);
	}
	
	Sign.enterGame.test(key,account.username);
	
	var time = Math.floor(account.timePlayedThisWeek/CST.HOUR) + 'h ' + Math.floor(account.timePlayedThisWeek%CST.HOUR/CST.MIN) + 'm';
	Chat.add(key,"You have played " + time + " this week.");
	
	if(account.emailChangeRequest){
		if(Date.now()-account.emailChangeRequest < CST.DAY*7) Chat.add(key,'A request to change your email has been made. You can abort the change by going in the account management window via the Pref Tab.');
		else Chat.add(key,'You can now change your email.');
	}
	if(account.randomlyGeneratedPassword) Chat.add(key,'Change your password via the Pref Tab.');
	
	act.boost.list['bullet-spd'].permBase *= 3;
	Actor.update.permBoost(act);
	Sign.enterGame.hideHUD(key);
	Actor.setTimeout(act,'fixAbilityCharge',1*25,Sign.enterGame.fixAbilityCharge);	//TOFIX
	
	db.update('account',{username:account.username},{'$set':{online:1,lastSignIn:Date.now()}},function(err, res) { if(err) throw err
		socket.emit('signIn', { success:1, data:Sign.enterGame.initData(key,act,main,account)});
	});	
	
	
	
}

Sign.enterGame.verifyIntegrity = function(key,main,act){
	//quest intergrity is testing in Load.main.uncompress
	for(var i in act.equip.normal.piece){
		if(act.equip.normal.piece[i] && !Db.equip[act.equip.normal.piece[i]]){
			if(!Server.testing) ERROR(2,'cant find equip',act.equip.normal.piece[i]);
			Chat.add(key,'Sorry, we can\'t find the data about the equip "' + act.equip.normal.piece[i] + '"... :('); 
			act.equip.normal.piece[i] = '';
		}
	}
	
	for(var i in main.invList.data){
		if(main.invList.data[i][0] && !Db.item[main.invList.data[i][0]]){
			if(!Server.testing) ERROR(2,'cant find item',main.invList.data[i][0]);
			Chat.add(key,'Sorry, we can\'t find the data about the item "' + main.invList.data[i][0] + '"... :('); 
			main.invList.data[i] = [];
		}
	}
	for(var i in main.bankList.data){
		if(main.bankList.data[i][0] && !Db.item[main.bankList.data[i][0]]){
			if(!Server.testing) ERROR(2,'cant find item',main.bankList.data[i][0]);
			Chat.add(key,'Sorry, we can\'t find the data about the item "' + main.bankList.data[i][0] + '"... :('); 
			main.bankList.data[i] = [];
		}
	}
	
	if(!Db.quest[main.questActive]) main.questActive = '';
	
	if(!Db.map[Map.getModel(act.respawnLoc.recent.map)]){
		Actor.setRespawn.town(act);
	}
	
	//developper. TOFIX
	setTimeout(function(){
		db.findOne('report',{version:Server.version},{message:1},function(err,res){	if(err) ERROR.err(3,err);
			if(!List.all[key]) return;
			if(res && res.message)	Chat.add(key,{type:'dialog',text:res.message});	
			if(!NODEJITSU) Chat.add(key,'You are using Game Engine v' + Server.version + '.');
		});
	},2000);
	
}

Sign.enterGame.contribution = function(key){
	if(List.main[key].contribution.reward.player.name){	
		List.all[key].sprite.normal = List.main[key].contribution.reward.player.name;
		Sprite.change(List.all[key],{name:'normal'});
	}
	
	if(Contribution.globalMessage.active.text && Date.now() < Contribution.globalMessage.active.end){
		var a = Contribution.globalMessage.active;
		Chat.add(key,'<span style="color:#EEEEEE; font-weight:bold;">Message from contributor ' + a.username.q() + ': <br> &nbsp;&nbsp;&nbsp;' + a.text + '</span>');
	}
	
	
}
Sign.enterGame.test = function(key,name){
	if(Server.isAdmin(0,name)) Itemlist.add(List.main[key].invList,'generator',1);
	if(!Server.testing)	return;
	if(!Quest.test.name) return;
	
	if(name.have('rc',true) || Quest.test.everyone){	//put true when uploading for ppl to create quest
		setTimeout(function(){	//otherwise fucks thing
			Db.quest.Qtutorial.event.skipTutorial(key);		
			Db.quest[Quest.test.name].event._testSignIn(key);
			Itemlist.add(List.main[key].invList,'_questtester-' + Quest.test.name);
			Itemlist.add(List.main[key].invList,'generator',1);
			Chat.add(key,'Game engine set to create the quest: \"' + Quest.test.name + '\".');
			if(List.main[key].questActive !== Quest.test.name){
				if(List.main[key].questActive) Quest.abandon(key,List.main[key].questActive);
				Quest.start(key,Quest.test.name);
			}
		},1000);
	}
	
	//tele
	if(Quest.test.simple)	Actor.teleport(List.all[key],{map:'QfirstTown-simpleMap',x:100,y:100});


}

Sign.enterGame.initData = function(key,player,main,account){	//send data when log in
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
			'party':Change.send.convert.party,
        },
        'main':{
            'passive':0,
            'social':Tk.deepClone,
            'quest':0,
			'questActive':0,
			'invList':Change.send.convert.itemlist,
			'bankList':Change.send.convert.itemlist,
			'tradeList':Change.send.convert.itemlist,
			'hideHUD':0,	
			dailyTask:0,
			contribution:0,			
        }
    }
	for(var i in array){
        for(var j in array[i]){
            if(array[i][j]){ data[i][j] = array[i][j](obj[i][j],player);  continue;}
            data[i][j] = obj[i][j];
        }
    }
	data.player['sprite,name'] = player.sprite.name;
	main.social.message = [];	//Tk.deepClone above. this is to prevent x2 messages when logging
	
	data.other.passiveGrid = [
		Db.passiveGrid.moddedGrid[main.passive.freeze[0] || Date.nowDate()],
		Db.passiveGrid.moddedGrid[main.passive.freeze[1] || Date.nowDate()]
	];
	
	var q = {};	for(var i in Db.quest){
		if(i[0] === 'Q') q[i] = {name:Db.quest[i].name,showInTab:Db.quest[i].showInTab};
	}
	data.other.quest = q;
	
	var h = {}; for(var i in Db.highscore) h[i] = {name:Db.highscore[i].name,description:Db.highscore[i].description};
	data.other.highscore = h;
	
	
	var m = {}; for(var i in Db.map) m[i] = {name:Db.map[i].name,graphic:Db.map[i].graphic};
	data.other.map = m;
	
	data.other.firstSignIn = !account.lastSignIn;
	
	data.other.infoDay = Sign.enterGame.infoDay.random();
	data.other.testing = Server.testing;
	data.other.toEval = Server.toEval;
	
	return data;
}

Sign.enterGame.teleport = function(key){
	var act = List.all[key];
	act.map = null;
	
	var recentmap = Actor.teleport.getMapName(act,act.respawnLoc.recent.map);
	if(List.map[recentmap])
		Actor.teleport(act,act.respawnLoc.recent);
	else Actor.teleport(act,act.respawnLoc.safe);
}


Sign.enterGame.fixAbilityCharge = function(key){
	for(var i in List.all[key].abilityChange.charge) 
		List.all[key].abilityChange.charge[i] = 0;
}

Sign.enterGame.hideHUD = function(key){
	if(!List.main[key].quest.Qtutorial._complete){
		List.main[key].hideHUD['tab-skill'] = 1;
		List.main[key].hideHUD['tab-quest'] = 1;
		List.main[key].hideHUD['tab-friend'] = 1;
		List.main[key].hideHUD['tab-friend'] = 1;
		List.main[key].hideHUD.passive = 1;
	}

	var total = Skill.getTotalLvl(key);
	if(total < 40) List.main[key].hideHUD.advancedAbility = 1;
	if(total < 30) List.main[key].hideHUD.equipOrb = 1;
	if(total < 25) List.main[key].hideHUD.questOrb = 1;
	if(total < 20) List.main[key].hideHUD.questChallenge = 1;
	if(total < 15) List.main[key].hideHUD.advancedStat = 1;
	
}

Sign.enterGame.quest = function(key){
	var mq = List.main[key].questActive;
	if(mq)	Db.quest[mq].event._signIn(key);	
	
	for(var i in List.main[key].invList.data){
		var item = List.main[key].invList.data[i];
		if(item[0] && item[0][0] === 'Q' && (!mq || !item[0].have(mq,true))){
			ERROR(3,'has quest item on log in when he shouldnt',item[0],mq);
			List.main[key].invList.data[i] = [];		
		}
	}
}


Sign.enterGame.infoDay = [ //{
	"If popup text doesn't disappear, press Esc.",
	"Press tab to reply to last player who PMed you.",
	"Press Esc to remove current input in chat and close window.",
	"If someone is bothering you, add him to your mute list. ($mute,[name] or right-click his name in the chat.)",
	"This game started off as a Flash game.",
	"Coding for this game was done exclusively with Notepad++.",
	"There are 3 types of map instances: public, party and solo.",
	"You can use any ability with any weapon. However, the damage will be decreased if they don't match well.",
	//"If you plan on sharing your Passive Build, don't forget that you can freeze the values to prevent popularity changes.",
	"Every day, every quest receives a bonus to its rewards (stackable bonus). Completing the quest will reset this bonus.",
	"You can only harvest Skill Plots once (ex: trees). To harvest it again, you need to complete the related quest. This is to prevent farming/grinding and botters.",
	"Monsters give exp and items upon killing. However, the loot has diminishing returns. (The more you kill, the less likely you will get loot.) Completing the quest related to the enemies will reset the diminishing returns.",
	"Levelling your combat stats will increase damage dealt and your defence. You will also be able to use better weapons and armors.",
	"The exp you get after killing an enemy depends on the last ability you used.",
	"If you no longer need an equip, you can salvage it into useful materials.",
	
	"In a regular game, random tips like this one are shown on loading screens. Unfortunately, this game has none so there are showed here instead. XD",
	"This game supports <a title=\"Puush is a 3rd party software that allows images and texts sharing instantly via a keyboard shortcut.\" href=\"http://puush.me/\" target=\"blank\">puush</a> links. Just copy paste the link in the chat and it will turn into a clickable link. You can change setting to only see puush links from your friends.",
	
	"In the quest tab, you can shift-left click to start/abandon quests quickly. (Useful for speedruns)",
	
];//}





