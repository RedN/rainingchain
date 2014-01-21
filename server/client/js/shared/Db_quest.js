Init.db.quest = function(){
	Db.quest = {};
	
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
			if(false){
				return 'something';
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
		
		q.mapMod = {
			'test':{
				'42-47':0,
				'43-47':0,
				'44-47':0,
				'45-47':0,
				'46-47':0,
			}
		};
		
		//{ Functions
		q.giveDevice = function(key){
		    Itemlist.add(List.main[key].invList,'quest-teleport');
		    List.main[key].quest['questId'].receivedDevice = true;
		};
		
		q.giveReward = function(key){
		    List.main[key].invList.add('gold',1000);
		    List.main[key].quest['questId'].receivedReward = true;
		};
		
		q.bossKilled = function(key){
		    List.main[key].quest['questId'].bossKilled = true;
		    Chat.add(key,"Congratz! You have slain the demon. Come back to town for reward.")
		};	
		//}
		
		//{Map
		q.map = {};
		q.map['test'] = function(map){
			
			
			Mortal.creation.group({'x':1060,'y':1900,'map':map},[
				{"category":"neutral","variant":"julie",'extra':{
					'dialogue':{'func':(function(key){
						var player = List.main[key];
						var quest = player.quest['questId'];
						
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
		
		
		
		return q;
	}();
	//}
	
	
	
	
	
	//Note: List.main[key].quest[id] only has variable
	var quest = {};
	for(var i in Db.quest) Quest.creation(Db.quest[i]);
	for(var i in Db.quest) quest[i] = deepClone(Db.quest[i].variable);
	Main.template.quest = {};
	Main.template.quest = new Function('return ' + stringify(quest));	
	for(var i in quest){
		Main.template.quest[i] = new Function('return ' + stringify(quest[i]));	
	}
}

Quest = {};

Quest.creation = function(q){
	var qv = q.variable;
	//Variable
	qv = qv || {};
	qv.hint = 'There is no hint.';
	qv.rewardTier = '0%';
	qv.reward = null;
	qv.complete = 0;
	qv.started = 0;
	qv.bonusSum = 1;
	qv.bonus = {};
	for(var j in q.bonus){ qv.bonus[j] = 0; }	//0:non-active, 1:active
	qv.requirement = '';
	for(var j in q.requirement){ qv.requirement += '0'; }	//0:non-active, 1:active
	
	if(server){
		Db.dialogue[q.id] = {};
		for(var i in q.dialogue) Db.dialogue[q.id][i] = q.dialogue[i];			
		for(var i in q.map)	Db.map[i].load[q.id] = q.map[i];	
		q.reward = arrayfy(q.reward);
		Db.boost[q.id] = q.reward;
	}
	return q;
}











