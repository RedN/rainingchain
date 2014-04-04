
var q = Quest.template();
q.id = 'QquestId';
q.name = 'Default Quest';
q.icon = 'skill.melee';
q.reward = {
	boost:{'stat':'dmg-fire-+','value':[0.05,0.10],mod:0.5},
	exp:{
		melee:100
	}
}
q.description = "Everything you level up, you get a passive point that can be attributed to one of the many passives in the passive grid.The bonus from each passive is dynamic and depends on the current popularity of the passive.Popular passives values, most often used in Overpowered builds, are decreased while unpopular ones are boosted. In other games, nerfs make OP builds become unviable builds brutally while my system allows a smooth transition and auto-balancement. But more importantly, it assures a true and fair character customization, encouraging people to play home-made builds."

q.variable = {
	receivedDevice:false,
	bossKilled:false,
	receivedReward:false,
};

q.requirement = [
	{'text':'Level 0 Magic','func':(function(key){ return List.all[key].skill.lvl.magic >= 0; })},
];

//{Dialogue
q.dialogue = {}

//}

//{challenge
q.challenge = {
	'halfHp':{
		'name':'Half Life',
		'info':'Your hp is halved during this quest.',
		'bonus':1.5,
		'add':(function(key){
			Actor.permBoost(List.all[key],'QquestId-halfHp',[
				{'stat':'hp-max','value':-500,'type':'base'}
			]);
		}),
		'remove':(function(key){
			Actor.permBoost(List.all[key],'QquestId-halfHp',[
			
			]);
		}),
	},
	'daemonSpd':{
		'name':'Daemon Speed',
		'info':'Complete this quest in less than 1 hour.',
		'bonus':1.2,
		'add':(function(key){
			
			
		}),
		'remove':(function(key){
			
			
		}),
	}
};
//}

//{ Functions
q.event.giveDevice = function(key){
	Itemlist.add(List.main[key].invList,'Q-QquestId-teleport');
	List.main[key].quest['QquestId'].receivedDevice = true;
};

q.event.giveReward = function(key){
	List.main[key].invList.add('gold',1000);
	List.main[key].quest['QquestId'].receivedReward = true;
};

q.event.bossKilled = function(key){
	List.main[key].quest['QquestId'].bossKilled = true;
	Chat.add(key,"Congratz! You have slain the demon. Come back to town for reward.");
};	
//}

//{Map
var test = q.mapAddon['test'] = {};
test.load = function(map){
	Actor.creation.group({'x':1060,'y':1900,'map':map},[
		{"category":"neutral","variant":"jenny",'extra':{
			'dialogue':{'func':(function(key){
				var player = List.main[key];
				var quest = player.quest['QquestId'];
				Dialogue.start(key,{'group':'QquestId','npc':'Jenny','convo':'intro','node':'intro'});
				
				
			})},
			'viaArray':{
				'target,sub,period':{first:100,renew:100},
			}
			
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

