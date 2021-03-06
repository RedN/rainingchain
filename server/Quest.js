//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Highscore','ItemList','Debug','Boss','Message','Challenge','Ability','Main','ItemModel','Equip'],['Quest']));
var db;
var QUEST_FOLDER = './client/quest/';
var QUEST_EXCLUDE = ['QkillTheDragon','Qfifteen'];

var Quest = exports.Quest = function(extra){
	//Quest.getAPItemplate for template
	var tmp = {};	
	for(var i in extra) tmp[i] = extra[i];
	DB[tmp.id] = tmp;
	Debug.createQuestTool(tmp);
	//Quest.fetchPlayerComment(q.id);
	return tmp;
}

var DB = Quest.DB = {};

Quest.getAPItemplate = function(extra){	//todo touse
	var tmp = {	//note: considering i create the things on the fly, its useless
		id:'',
		version:'v1.0',
		name:'Default Name',
		reward:Quest.Reward(),
		showInTab:true,
		showWindowComplete:true,
		includeInSignInPack:true,
		dailyTask:true,
		inMain:true,	//in Main.get(key).quest
		globalHighscore:false,	//call updateHighscore everytime a quest complete
		alwaysActive:false,	//can call event without being questActive (ex: town)
		skillPlotAllowed:false,
		admin:false,		//allow extra in item, ability
		autoStartQuest:true,
		author:'rc',
		scoreModInfo:'',
		lvl:0,
		difficulty:'Easy',
		rating:0,
		statistic:Quest.Statistic(),
		playerComment:[],
		reward:Quest.Reward(),
		//
		mapAddon:{},
		map:{},
		item:{}, 
		equip:{},
		npc:{},
		ability:{},
		dialogue:{},
		boss:{},
		//		
		challenge:{},
		preset:{},
		highscore:{},
		event:Quest.Event(),
		skillPlot:[],
		path:{},		
	};
	for(var i in extra)
		tmp[i] = extra[i];
	return tmp;
}

Quest.Reward = function(reputation,exp,item){
	return {
		reputation:reputation || Quest.Reward.reputation(),
		exp:exp === undefined ? 1 : exp,
		item:item === undefined ? 1 : item,
	};
}	

Quest.Reward.reputation = function(mod,min,max){
	return {
		mod:mod || 10,
		min:min || 1,
		max:max || 2,
	};
}

Quest.Statistic = function(countComplete,countStarted,averageRepeat){
	return {
		countComplete:countComplete || 0,
		countStarted:countStarted || 0,
		averageRepeat:averageRepeat || 0,
	}
}

//#######################

Quest.init = function(dbLink){	//init Module
	db = dbLink;
	
	var filePath = require('path').resolve(__dirname,QUEST_FOLDER + 'QuestList.txt');
	var questList = require('fs').readFileSync(filePath);
	var QUEST_ID_LIST = questList.toString().trim().replaceAll('\r\n','\n').split('\n');
	
	if(NODEJITSU){
		for(var i in QUEST_EXCLUDE){
			QUEST_ID_LIST.remove(QUEST_EXCLUDE[i]);
		}
	}
	
	
	for(var i in QUEST_ID_LIST){
		var qid = QUEST_ID_LIST[i];
		if(!qid) continue;	//in case split mess up...
		try {
			var req = require(QUEST_FOLDER+qid + "/" + qid);
		} catch(err){ 
			ERROR(2,'error with quest file ' + qid + '. Note: NEVER delete a quest folder manually. Use Quest creator.');
			return;
		}
		
		var q = Quest(req.quest);
		if(q.id !== qid) 
			return ERROR(2,'quest filename doesnt match quest id',q.id,qid);
	}
}

Quest.get = function(id){
	return DB[id] || null;
}

Quest.getSignInPack = function(){
	var q = {};	
	for(var i in DB){
		if(DB[i].includeInSignInPack) 
			q[i] = Quest.compressClient(DB[i],false);
	}
	return q;
}
	
Quest.compressClient = function(quest,full){
	if(!full){
		return {
			name:quest.name,
			showInTab:quest.showInTab,
			isPartialVersion:true,
		};
	}
	return {
		id:quest.id,
		name:quest.name,
		icon:quest.icon,
		reward:quest.reward,
		description:quest,
		variable:quest.variable,
		author:quest.author,
		challenge:Quest.compressClient.challenge(quest.challenge),
		highscore:Quest.compressClient.highscore(quest.highscore),
		lvl:quest.lvl,
		difficulty:quest.difficulty,
		rating:quest.rating,
		statistic:quest.statistic,
		playerComment:quest.playerComment,
		showInTab:quest.showInTab,
		isPartialVersion:false,
	};
} 

Quest.compressClient.challenge = function(info){
	var tmp = {};
	for(var i in info){
		tmp[i] = Challenge.compressClient(info[i]);
	}
	return tmp;
}
Quest.compressClient.highscore = function(info){
	var tmp = {};
	for(var i in info){
		tmp[i] = Highscore.compressClient(info[i]);
	}
	return tmp;
}

//#######################

Quest.TESTING = {simple:false,name:'',everyone:true};

Quest.getMainVarList = function(){
	var list = [];
	for(var i in DB)
		if(DB[i].inMain) list.push(i);
	return list;
};

Quest.fetchPlayerComment = function(id){
	return;
	//var db = requi reDb();
	if(!db.twitter || !NODEJITSU) return;
	db.twitter.getOwn(id,function(list){
		DB[id].playerComment = list;		
	});
}

Quest.Event = function(obj){
	var tmp = {
		_complete:CST.func,
		_start:CST.func,
		_abandon:CST.func,
		_signIn:CST.func,
		_hint:CST.func,
		_death:CST.func,
		_debugSignIn:CST.func,
		_getScoreMod:function(){ return 1; },	//return NUMBER
	}
	obj = obj || {};
	for(var i in obj) tmp[i] = obj[i];
	return tmp;
}

Quest.RewardInfo = function(score,exp,item){	//not an attribute of quest...
	return {
		score:score === undefined ? 1 : score, 
		exp:exp === undefined ? 1 : exp, 
		item:item === undefined ? 1 : item, 
	}
}



Quest.getChallengeList = function(q){
	if(typeof q === 'string') return ERROR(3,'q needs to be object');
	var tmp = {};
	for(var i in q.challenge){
		tmp[i] = 0;
	}	
	return tmp;
}

Quest.getHighscoreList = function(q){
	if(typeof q === 'string') return ERROR(3,'q needs to be object');
	var tmp = {};
	for(var i in q.highscore){
		tmp[i] = null;
	}
	return tmp;
}


Quest.rate = function(main,quest,rating,text){
	if(!main.quest[quest]) return;
	db.questRating.insert({
		quest:quest,
		rating:rating || 0,
		text:(text || '').slice(0,1000),
		username:main.username,
		timestamp:Date.now(),	
	})
}
//ts("Quest.updateRating(true)")
//Dialog.open('questRating','QlureKill')
Quest.updateRating = function(force){
	db.questRating.aggregate([
		//{$match : {quest : 'QlureKill'} },
		{
			$group: {
				_id: "$quest",
				avgRating: { $avg: "$rating" }
			}
		},
		
	   ],
	   function(err,res){
			for(var i = 0 ; i < res.length; i++)
				DB[res[i]._id].rating = res[i].avgRating;
	   }
	);
	
	for(var i in DB){
		var func = function(i){
			return function(err,res){
				DB[i].playerComment = res;
			}
		};
		
		db.questRating.find({quest:i},{_id:0,text:1,username:1}).sort({timestamp:1}).limit(2,func(i));
	}
	/*
	db.questRating.aggregate([
		{$match : {quest : 'QlureKill'} },
		{$sort:},
		{$limit:2},
		{$projection:{text:1,username:1}},
	],function(err,res){
		
	});
	*/
	
	
	
	//}
}

//ts("Quest.updateStatistic('QlureKill')")
Quest.updateStatistic = function(i){
	if(!i) for(var i in DB) Quest.updateStatistic(i);
	
	var countCompleted = 0;
	var countStarted = 0;
	var countCompletedAtLeastOnce = 0;
	
	db.mainQuest.find({quest:i},{_id:0,_complete:1,_started:1}).forEach(function(err,res){
		if(!res){
			DB[i].statistic = Quest.Statistic(countCompletedAtLeastOnce,countStarted,countCompleted/countCompletedAtLeastOnce);
			return;
		}
		countCompleted += res._complete;
		if(res._complete) countCompletedAtLeastOnce++;
		countStarted += res._started;
	});
}





