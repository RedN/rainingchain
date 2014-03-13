
var q = Quest.template();
q.id = 'QquestId';
q.name = 'Default Quest';
q.icon = 'skill.melee';
q.reward = {'stat':'dmg-fire-+','value':[0.05,0.10]};
q.rewardMod = 0.5;
q.description = "Everything you level up, you get a passive point that can be attributed to one of the many passives in the passive grid.The bonus from each passive is dynamic and depends on the current popularity of the passive.Popular passives values, most often used in Overpowered builds, are decreased while unpopular ones are boosted. In other games, nerfs make OP builds become unviable builds brutally while my system allows a smooth transition and auto-balancement. But more importantly, it assures a true and fair character customization, encouraging people to play home-made builds."

q.variable = {
	receivedDevice:false,
	bossKilled:false,
	receivedReward:false,
};

q.requirement = [
	{'text':'Level 0 Magic','func':(function(key){ return List.all[key].skill.lvl.magic >= 0; })},
];

q.hintGiver = function(key,mq){
	if(mq.receivedDevice){
		return 'Vas tuer le boss';
	} 
	return 'You can start this quest by talking to God.';
};

//{Dialogue
q.dialogue = { 
	'Jenny' :{
		'face':'Jenny',
		'intro':{
			'text':'Do you want to help me out?',
			'face':'Jenny',
			'option':[
				{'text':"Sure.",
					'next':{'node':'yes'},
					//'func':function(key){ Db.quest['QquestId'].giveDevice(key); },
					//'param':[],
				},
				{'text':"No. I got other things to do.",
					'next':{'node':'no'}},
			]},
		'yes':{
			'text':"Thank you so much! Take this magical shield and teleport to the Fire Monster Lair. Kill him and give me the key he will drop.",
			},
		'no':{
			'text':"What a jerk!",
			},
			
		'intro2':{
			'text':"What are you waiting for? Go kill the boss!",
			},	
				
		'gratz':{
			'text':'Thanks you so much for your help. I can now unlock the barrier.',
			//'func':function(key){ Db.quest['QquestId'].giveReward(key); },
			//'param':[],
			},
		'gratz2':{
			'text':'Thanks again.',
			},
	},
};
//}

//{Bonus
q.bonus = {
	'halfHp':{
		'name':'Half Life',
		'info':'Your hp is halved during this quest.',
		'bonus':1.5,
		'add':(function(key){
			Quest.bonus.update(key, 'QquestId', 'halfHp',[
				{'stat':'hp-max','value':-500,'type':'base'}
			]);
		}),
		'remove':(function(key){
			Quest.bonus.update(key, 'QquestId', 'halfHp',[
				{'stat':'hp-max','value':-500,'type':'base'}
			]);
		}),
	},
	'daemonSpd':{
		'name':'Daemon Speed',
		'info':'Complete this quest in less than 1 hour.',
		'bonus':1.2,
		'add':(function(key){
			Quest.bonus.update(key, 'QquestId', 'daemonSpd',[
				
			]);
		}),
		'remove':(function(key){
			Quest.bonus.update(key, 'QquestId', 'daemonSpd',[
				
			]);
		}),
	}
};
//}

//{ Functions
q.func.giveDevice = function(key){
	Itemlist.add(List.main[key].invList,'Q-QquestId-teleport');
	List.main[key].quest['QquestId'].receivedDevice = true;
};

q.func.giveReward = function(key){
	List.main[key].invList.add('gold',1000);
	List.main[key].quest['QquestId'].receivedReward = true;
};

q.func.bossKilled = function(key){
	List.main[key].quest['QquestId'].bossKilled = true;
	Chat.add(key,"Congratz! You have slain the demon. Come back to town for reward.");
};	
//}

//{Map
var test = q.mapAddOn['test'] = {};
test.load = function(map){
	Actor.creation.group({'x':1060,'y':1900,'map':map},[
		{"category":"neutral","variant":"jenny",'extra':{
			'dialogue':{'func':(function(key){
				var player = List.main[key];
				var quest = player.quest['QquestId'];
				Dialogue.start(key,{'name':'QquestId','convo':'Jenny','node':'intro'});
				
				return;
				
				quest.started = 1;
				if(quest.bossKilled){
					if(quest.receivedReward){
						Dialogue.start(key,{'name':'QquestId','convo':'Jenny','node':'gratz2'});
					} else { Dialogue.start(key,{'name':'QquestId','convo':'Jenny','node':'gratz'}); }
				} else {
					if(quest.receivedDevice){	
						Quest.complete(key,'QquestId');
						Dialogue.start(key,{'name':'QquestId','convo':'Jenny','node':'intro2'});
					} else { Dialogue.start(key,{'name':'QquestId','convo':'Jenny','node':'intro'}); }
				}
			})},
			'viaArray':[
				{'array':['target','sub','period'],'value':{first:100,renew:100}},
			]
			
			}
		},
	]);
}
//}

//{Item
q.item = {	
	'teleport' :{'name':'Teleport','icon':'plan.ability','option':[
			{'name':'Tele To Demon','func':'Actor.teleport','param':[1230,1230,'ryve']},
			{'name':'Tele Back','func':'Actor.teleport','param':[1100,1230,'test']},
			{'name':'Boost','func':'addBoost','param':[{stat:'globalDmg',value:1000,type:'*',time:10000,name:'quest'}]},
		]},
		

}
//}


exports.quest = q;

