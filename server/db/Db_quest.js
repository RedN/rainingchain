if(typeof Db === 'undefined') Db = {};
Db.quest = {};
Init.db.quest = function(){
	
	//Model
	//{questId
	Db.quest['questId'] = function(){
		var q = {};
		q.id = 'questId';
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
							'func':function(key){ Db.quest['questId'].giveDevice(key); },
							'param':[],
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
					'func':function(key){ Db.quest['questId'].giveReward(key); },
					'param':[],
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
					Quest.bonus.update(key, 'questId', 'halfHp',[
						{'stat':'hp-max','value':-500,'type':'base'}
					]);
				}),
				'remove':(function(key){
					Quest.bonus.update(key, 'questId', 'halfHp',[
						{'stat':'hp-max','value':-500,'type':'base'}
					]);
				}),
			},
			'daemonSpd':{
				'name':'Daemon Speed',
				'info':'Complete this quest in less than 1 hour.',
				'bonus':1.2,
				'add':(function(key){
					Quest.bonus.update(key, 'questId', 'daemonSpd',[
						
					]);
				}),
				'remove':(function(key){
					Quest.bonus.update(key, 'questId', 'daemonSpd',[
						
					]);
				}),
			}
		};
		//}
		
		//{ Functions
		q.giveDevice = function(key){
		    Itemlist.add(List.main[key].invList,'Q-questId-teleport');
		    List.main[key].quest['questId'].receivedDevice = true;
		};
		
		q.giveReward = function(key){
		    List.main[key].invList.add('gold',1000);
		    List.main[key].quest['questId'].receivedReward = true;
		};
		
		q.bossKilled = function(key){
		    List.main[key].quest['questId'].bossKilled = true;
		    Chat.add(key,"Congratz! You have slain the demon. Come back to town for reward.");
		};	
		//}
		
		//{Map
		q.map = {};
		q.map['test'] = {};
		q.map['test'].load = function(map){
			Actor.creation.group({'x':1060,'y':1900,'map':map},[
				{"category":"neutral","variant":"julie",'extra':{
					'dialogue':{'func':(function(key){
						var player = List.main[key];
						var quest = player.quest['questId'];
						quest.started = 1;
						if(quest.bossKilled){
							if(quest.receivedReward){
								Dialogue.start(key,{'name':'questId','convo':'Jenny','node':'gratz2'});
							} else { Dialogue.start(key,{'name':'questId','convo':'Jenny','node':'gratz'}); }
						} else {
							if(quest.receivedDevice){	
								Quest.complete(key,'questId');
								Dialogue.start(key,{'name':'questId','convo':'Jenny','node':'intro2'});
							} else { Dialogue.start(key,{'name':'questId','convo':'Jenny','node':'intro'}); }
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
		
		return q;
	}();
	//}
	
	
	
	
	
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

Quest = {};

Quest.creation = function(q){
	q = useTemplate(Quest.template(),q)

	//Variable
	q.variable = useTemplate(Quest.template.variable(),q.variable);
	for(var j in q.bonus){ q.variable.bonus[j] = 0; }	//0:non-active, 1:active
	for(var j in q.requirement){ q.variable.requirement += '0'; }	//0:non-met, 1:met
	
	if(!server) return q 
	
	Db.dialogue[q.id] = {};
	for(var i in q.dialogue) Db.dialogue[q.id][i] = q.dialogue[i];		
	for(var i in q.map)
		for(var j in q.map[i]){
			Db.map[i][j][q.id] = q.map[i][j];
	}
	
	for(var i in q.item){
		q.item.id = 'Q-'+q.id+'-'+i;
		Item.creation(q.item[i]);
	}
	
	return q;
}

Quest.template = function(){
	return {
		id:Math.random(),
		name:'Default Quest',
		icon:'skill.melee',
		reward:{'stat':'dmg-fire-+','value':[0.05,0.10]},
		rewardMod:0.5,
		description:"Default Description",
		variable:{},
		requirement:[],		
		hintGiver:function(key,mq){ return 'Default Hint';},
		dialogue:{},
		bonus:{},
		mapMod:{},
		map:{},
		item:{}, 
	};
}

Quest.template.variable = function(){
	return {
		hint:'There is no hint.',
		rewardTier:'0%',
		reward:null,
		complete:0,
		started:0,
		bonusSum:1,
		deathCount:0,
		bonus:{},
		requirement:''
	};
}








