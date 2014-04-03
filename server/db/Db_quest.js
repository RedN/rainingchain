if(typeof Db === 'undefined') Db = {};
Db.quest = {};
var questList = [
	'Qtutorial',
	'QquestId',
	'Qopenbeta2',
	'QtestEnemy',
];

if(Server.testing){
	questList.push('QtestEnemy');
}


TestingQuest = function(key){
	


}

Init.db.quest = function(){
	//Note: List.main[key].quest[id] only has variable
	var questVar = {};
	for(var i in Db.quest){
		Db.quest[i] = Quest.creation(Db.quest[i]);
		questVar[i] = deepClone(Db.quest[i].variable);
	}
	Main.template.quest = {};
	Main.template.quest = new Function('return ' + stringify(questVar));	
	for(var i in questVar)	Main.template.quest[i] = new Function('return ' + stringify(questVar[i]));	
		
}
Init.db.quest.map = function(){
	//Quest are added from the quest folder
	for(var i in questList){
		Db.quest[questList[i]] = require('./quest/'+questList[i]).quest;
	}
	
	for(var i in Db.quest){
		for(var j in Db.quest[i].map){
			Db.map[j] = Db.quest[i].map[j];
			Db.quest[i].map[j] = Db.quest[i].map[j]().addon;
		}
	}
}
Quest = {};

Quest.creation = function(q){
	q = useTemplate(Quest.template(),q)

	//Variable
	q.variable = useTemplate(Quest.template.variable(),q.variable);
	for(var j in q.challenge){ q.variable.challenge[j] = 0; }	//0:non-active, 1:active
	for(var j in q.requirement){ q.variable.requirement += '0'; }	//0:non-met, 1:met
	
	if(!server) return q 
	
	Db.dialogue[q.id] = {};
	for(var i in q.dialogue){
		Db.dialogue[q.id][i] = q.dialogue[i];		
	}
	//load map via Init.db.quest.map
	for(var i in q.mapAddOn){
		Db.map[i].addon[q.id] = q.mapAddOn[i];
	}
	
	Db.enemy[q.id] = {};
	for(var i in q.enemy){
		Db.enemy[q.id][i] = q.enemy[i];
	}
	
	for(var i in q.item){
		var start = q.id+'-';
		q.item[i].id = i.indexOf(start) === 0 ? i : start + i;
		Item.creation(q.item[i]);
	}
	
	for(var i in q.equip){
		var start = q.id+'-';
		q.equip[i].id = i.indexOf(start) === 0 ? i : start + i;
		Equip.creation(q.equip[i]);
	}
	
	for(var i in q.ability){
		var start = q.id+'-';
		q.ability[i].id = i.indexOf(start) === 0 ? i : start + i;
		Ability.creation(q.ability[i]);
	}
	
	for(var i in q.plan){
		var start = q.id+'-';
		q.plan[i].id = i.indexOf(start) === 0 ? i : start + i;
		Plan.creation(q.plan[i]);
	}
	
	if(Server.testing){
		Quest.createVariableTester(q);
	}
	
	
	
	return q;
}

Quest.createVariableTester = function(q){
	var item = {"id":'QuestTester-' + q.id,'name':q.id,'icon':'system.gold','stack':1,'drop':0,
		'option':[]};
	
	for(var i in q.variable){
		if(["hint", "rewardTier", "reward", "complete", "started", "deathCount", "bonus", "challenge", "requirement", "skillPlot"].have(i)) continue;
		
		item.option.push({'name':i,'func':function(key,param){
			Chat.question(key,{text:q.id + '.' + param,func:(function(){
				return function(key,value){
					if(Server.testing) List.main[key].quest[q.id][param] = eval(value);
					Chat.add(key,"Variable changed");
				}
			})()});		
		},'param':[i]});
	}

	Item.creation(item);

}


Quest.template = function(id,version){
	return {
		id:id || Math.random(),
		version: version || 'v1.0',
		name:'Default Quest',
		icon:'skill.melee',
		reward:{
			boost:{'stat':'dmg-fire-+','value':[0.05,0.10]},
			exp:{}
		},
		description:"Default Description",
		variable:{},
		requirement:[],		
		dialogue:{},
		challenge:{},
		mapAddOn:{},
		map:{},
		item:{}, 
		equip:{},
		enemy:{},
		ability:{},
		plan:{},
		event:{},
		skillPlot:[],
	};
}

Quest.template.variable = function(){
	return {
		hint:'None.',
		rewardTier:0,
		reward:null,
		complete:0,
		started:0,
		deathCount:0,
		bonus:{
			challenge:1,
			orb:1,
			cycle:1
		},
		challenge:{},
		requirement:'',
		skillPlot:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	};
}

Quest.getActor = function(key){ return List.all[key]; }
Quest.getMain = function(key,quest){return List.main[key].quest[quest];}
Quest.itemExist = function(id){ return !!Db.item[id]; }


require('fs').readFile('./server/db/Db_quest_eval.js', 'utf8', function (err,data) {
	if(err) permConsoleLog(1,err);
	Quest.template.eval = function(){ return data; }
});
/*
require('fs').readFile('./Db_quest_eval.js', 'utf8', function (err,data) {
	if(err) permConsoleLog(2,err);
	Quest.template.eval = function(){ return data; }
});

require('fs').readFile('Db_quest_eval.js', 'utf8', function (err,data) {
	if(err) permConsoleLog(3,err);
	Quest.template.eval = function(){ return data; }
});

*/