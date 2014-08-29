//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Actor','Db','Tk','Init','Itemlist','Chat','Loop','requireDb','Ability','Main','Item','Plan','Equip'],['Quest']));

var Quest = exports.Quest = {test:{everyone:true}};
var questList = [
	'Qsystem',
	'QfirstTown',
	'Qhighscore',
	'Qcontribution',
	'Qbtt000',
	'QlureKill',
	'QprotectFirstTown',
	'QtowerDefence',
	'QcollectFight',
	'QbulletHeaven',
	'QpuzzleBridge',
	'Qtutorial',
	'Qdarkness',
	'Qpvp',
	'QbaseDefence',
	'Qminesweeper',
	'Qfifteen',
	//'QexampleSimpleMap2',
];

Quest.test.name = '';

 
//##### DONT TOUCH BELOW ############
Db.quest = {};
Db.highscore = {};
Quest.test.simple = false;
quest = !NODEJITSU;

Init.db.quest = function(){
	var questVar = {};
	for(var i in Db.quest){
		Db.quest[i] = Quest.creation(Db.quest[i]);
		if(Db.quest[i].inMain) questVar[i] = Db.quest[i].variable;
	}
	Main.template.quest = {};
	Main.template.quest = new Function('return ' + Tk.stringify(questVar));	
	for(var i in questVar)	Main.template.quest[i] = new Function('return ' + Tk.stringify(questVar[i]));
}

Init.db.quest.map = function(){	//called before Init.db.quest
	for(var i in questList){
		Db.quest[questList[i]] = require('./quest/'+questList[i]).quest;
		if(Db.quest[questList[i]].id !== questList[i]) return ERROR(1,'quest file doesnt match quest id',Db.quest[questList[i]].id,questList[i]);
	}
	
	for(var i in Db.quest){
		for(var j in Db.quest[i].map){
			var id = i + '-' + j;
			if(Db.map[id]) return;	//ERROR(1,"THERES ALREADY A MAP WITH THAT NAME.",j,i); 	//weird... if computer is bad, its called twice
			Db.map[id] = Db.quest[i].map[j];
		}
	}
}

Quest.creation = function(q){
	Quest.creation.tester(q);
	
	//twitter
	Quest.creation.playerComment(q.id);
	
	//Default Event
	for(var i in q.variable){
		(function(i){
			q.event['$GET_' + i] = function(key){ 
				if(List.all[key].type !== 'player') return true;
				return List.main[key].quest[q.id][i];
			}
			q.event['$GET_!' + i] = function(key){
				if(List.all[key].type !== 'player') return true;
				return !List.main[key].quest[q.id][i];
			}
			q.event['$SET_' + i] = function(key){ 
				if(List.all[key].type !== 'player') return;
				List.main[key].quest[q.id][i] = true;
			}
			q.event['$SET_!' + i] = function(key){ 
				if(List.all[key].type !== 'player') return;
				List.main[key].quest[q.id][i] = false;
			}
		}(i));
	}
	//Highscore
	for(var j in q.highscore) Db.highscore[q.highscore[j].id] = q.highscore[j];
	
	//Variable
	q.variable = Tk.useTemplate(Quest.template.variable(),q.variable,true);
	for(var j in q.challenge){
		q.variable._challenge[j] = 0; 	//0:non-active, 1:active
		q.variable._challengeDone[j] = 0;
	}
	for(var j in q.requirement) q.variable._requirement += '0'; 	//0:non-met, 1:met
	for(var j in q.highscore) q.variable._highscore[j] = null;
	
	//Event
	q.event = Tk.useTemplate(Quest.template.event(),q.event,true);
	
	Db.dialogue[q.id] = q.dialogue;
	
	//load map via Init.db.quest.map
	for(var i in q.mapAddon) Db.map[i].addon[q.id] = q.mapAddon[i];
		
	for(var i in q.item) Item.creation(q.item[i]);
	for(var i in q.equip) Equip.creation(q.equip[i]);
	for(var i in q.ability)	Ability.creation(q.ability[i]);
	for(var i in q.npc)	Db.npc[q.npc[i].id] = q.npc[i];
	for(var i in q.boss) Db.boss[q.boss[i].id] = q.boss[i];
	
	//preset needs nothing...
	
	return q;
}

Quest.creation.playerComment = function(id){
	var db = requireDb();
	if(!db.twitter || !NODEJITSU) return;
	db.twitter.getOwn(id,function(list){
		Db.quest[id].playerComment = list;		
	});
}


Quest.creation.tester = function(q){
	var item = {"id":'_questtester-'+ q.id,'name':q.id,'icon':'system.gold','stack':1,trade:0,'drop':0,'option':[]};
	
	item.option.push({name:'Teleport','func':function(key){
		Chat.question(key,{text:"enter spot",func:function(key,param){
			try{ 
				var spot = List.map[List.all[key].map].addon[q.id].spot[param];
				Actor.teleport(List.all[key],spot);
			} catch(err) { ERROR.err(3,err); Chat.add(key,"no found"); }
		}});
	}});
	
	item.option.push({name:'Add Item','func':function(key){
		Chat.question(key,{text:"item,amount", func:function(key,item,amount){
			item = q.id + '-' + item;
			if(Db.item[item])	Itemlist.add(List.main[key].invList,item,amount || 1);
			else Chat.add(key,'wrong');
		}});	
	}});
	
	item.option.push({name:'Call Event','func':function(key){
		Chat.question(key,{text:'event',func:function(key,param){
			if(q.event[param]) return q.event[param](key);
			else for(var i in q.event.test)	if(q.event.test[param]) return q.event.test[param](key);
			Chat.add(key,"no found");
		}});
	}});
	
	item.option.push({name:'Change Var','func':function(key){
		Chat.question(key,{text:'variable,value',func:function(key,param,value){
			var mq = List.main[key].quest[q.id];
			if(value === undefined)	return Chat.add(key,param + ' : ' + mq[param]);
			if(mq[param] !== undefined){
				if(value === 'true') mq[param] = true;
				else if(value === 'false') mq[param] = false;
				else if(!isNaN(value)) mq[param] = +value;
				else mq[param] = value;
			}
			else Chat.add(key,"bad name");
		}});
	}});
	
	
	Item.creation(item);
}

Quest.template = function(){
	return {
		id:'',
		version:'v1.0',
		name:'Default Quest',
		icon:'skill.melee',	//usued
		reward:{
			passive:{min:1,max:2,mod:10},
			exp:1,
			item:1,
		},
		description:"Default Description",	//unused
		showInTab:true,
		showWindowComplete:true,
		dailyTask:true,
		inMain:true,	//in List.main[key].quest
		alwaysActive:false,	//can call event without being questActive (ex: town)
		skillPlotAllowed:false,
		author:'rc',
		playerComment:[],
		statistic:Quest.template.stat,
		scoreModInfo:'',
		lvl:0,
		difficulty:'Easy',
		rating:0,
		variable:{},
		requirement:[],		
		dialogue:{},
		challenge:{},
		preset:{},
		highscore:{},
		mapAddon:{},
		map:{},
		item:{}, 
		equip:{},
		npc:{},
		ability:{},
		event:{},
		skillPlot:[],
		boss:{},
	};
}

Quest.template.variable = function(){
	return {
		_hint:'None.',
		_rewardScore:0,
		_rewardPt:0,
		_complete:0,
		_active:0,
		_started:0,
		_bonus:{
			challengeDone:{passive:1,exp:1,item:1},
			challenge:{passive:1,exp:1,item:1},	//only used so client can see, only hold success values
			orb:{passive:1,exp:1,item:1},
			cycle:{passive:1,exp:1,item:1},
		},
		_challenge:{},
		_challengeDone:{},
		_requirement:'',
		_highscore:{},
		_orbAmount:0,
		_deathCount:0,
		_rating:0,
		_skillPlot:[0,0,0,0,0,0,0],
		_enemyKilled:0,
		_toUpdate:0,	//if 1, send mq to client
		_presetActive:'',
	};
}

Quest.template.statistic = function(){
	return {
		ratingGlobal:0,
		amountComplete:0,
		amountStarted:0,
		averageRepeat:0,
	}
}

Quest.template.event = function(){
	return {
		_complete:CST.func,
		_start:CST.func,
		_abandon:CST.func,
		_signIn:CST.func,
		_hint:CST.func,
		_death:CST.func,
		_testSignIn:CST.func,
		_getScoreMod:function(){ return 1; },	//return NUMBER
	}
}





















