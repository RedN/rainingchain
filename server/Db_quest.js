Db.quest = {};
var questList = [
	//'Qtutorial',
	//'Qopenbeta2',
	//'Qtest',
	//'QgoblinJewel'
	'testNew',
];
Quest = {};
Quest.test = 'QgoblinJewel';	//give player vaTester for this quest




Init.db.quest = function(){
	var questVar = {};
	for(var i in Db.quest){
		Db.quest[i] = Quest.creation(Db.quest[i]);
		questVar[i] = Db.quest[i].variable;
	}
	Main.template.quest = {};
	Main.template.quest = new Function('return ' + stringify(questVar));	
	for(var i in questVar)	Main.template.quest[i] = new Function('return ' + stringify(questVar[i]));	
		
}
Init.db.quest.map = function(){	//called before Init.db.quest
	for(var i in questList){
		Db.quest[questList[i]] = require('./quest/'+questList[i]).quest;
	}
	
	for(var i in Db.quest){
		for(var j in Db.quest[i].map){
			if(Db.map[j]) permConsoleLog("MAJOR ERROR: THERES ALREADY A MAP WITH THAT NAME. " + j + ' '+ i); 
			Db.map[j] = Db.quest[i].map[j];
			Db.quest[i].map[j] = Db.quest[i].map[j]().addon;
		}
	}
}


Quest.creation = function(q){
	q = useTemplate(Quest.template(),q)

	//Variable
	q.variable = useTemplate(Quest.template.variable(),q.variable);
	for(var j in q.challenge){ q.variable.challenge[j] = 0; }	//0:non-active, 1:active
	for(var j in q.requirement){ q.variable.requirement += '0'; }	//0:non-met, 1:met
	
	Db.dialogue[q.id] = {};
	for(var i in q.dialogue)	Db.dialogue[q.id][i] = q.dialogue[i];		
	
	//load map via Init.db.quest.map
	for(var i in q.mapAddon)	Db.map[i].addon[q.id] = q.mapAddon[i];
	
	Db.npc[q.id] = {};
	for(var i in q.npc)	Db.npc[q.id][i] = q.npc[i];
	for(var i in q.boss) Db.boss[q.id+'-'+ i] = q.boss[i];
	
	for(var i in q.item){
		q.item[i].id = q.id+'-'+ i;
		Item.creation(q.item[i]);
	}
	
	for(var i in q.equip){
		q.equip[i].id = q.id+'-'+ i;
		Equip.creation(q.equip[i]);
	}
	
	for(var i in q.ability){
		q.ability[i].id = q.id+'-'+ i;
		Ability.creation(q.ability[i]);
	}
	
	for(var i in q.plan){
		q.plan[i].id = q.id+'-'+ i;
		Plan.creation(q.plan[i]);
	}
	
	if(Server.testing){
		Quest.creation.tester(q);
	}
		
	return q;
}

Quest.creation.tester = function(q){
	var item = {"id":q.id + '-QuestTester','name':q.id + " Tester",'icon':'system.gold','stack':1,'drop':0,'option':[]};
		
	item.option.push({name:'Teleport','func':function(key){
		Chat.question(key,{text:"enter spot",func:function(key,param){
			try{ 
				var spot = List.map[List.all[key].map].addon[q.id].spot[param];
				Actor.teleport(List.all[key],spot);
			} catch(err) { logError(err); Chat.add(key,"no found"); }
		}});
	}});
	
	item.option.push({name:'Add Item','func':function(key){
		Chat.question(key,{text:"item,amount", func:function(key,item,amount){
			item = q.id + '-' + item;
			if(Db.item[item])	Itemlist.add(key,item,amount || 1);
			else Chat.add(key,'wrong');
		}});	
	}});
	
	item.option.push({name:'Call Event','func':function(key){
		Chat.question(key,{text:'event',func:function(key,param){
			if(q.event[param]) q.event[param](key);
			else if(q.event.test && q.event.test.list && q.event.test.list[param]) q.event.test.list[param](key);
			else Chat.add(key,"no found");
		}});
	}});
	
	item.option.push({name:'Change Var','func':function(key){
		Chat.question(key,{text:'variable,value',func:function(key,param,param1){
			var mq = List.main[key].quest[q.id];
			if(mq[param] !== undefined) mq[param] = param1;
			else Chat.add(key,"bad name");
		}});
	}});
	
	
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
		lvl:0,
		difficulty:'Easy',
		variable:{},
		requirement:[],		
		dialogue:{},
		challenge:{},
		mapAddon:{},
		map:{},
		item:{}, 
		equip:{},
		npc:{},
		ability:{},
		plan:{},
		event:{},
		skillPlot:[],
		boss:{},
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

