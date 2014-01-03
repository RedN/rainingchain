Init.db.quest = function(){
	Db.quest = {};
	
	//Model
	//{questId
	Db.quest['questId'] = function(){
		var q = {};
		q.id = 'questId';
		q.name = 'Default Quest';
		q.icon = 'skill.melee';
		q.reward = {'stat':'dmg-fire-+','value':[0.05,0.10]},
		
		q.requirement = [
			{'text':'Level 11 Magic','func':(function(){ return true; })},
		];
		
		q.description = "Everything you level up, you get a passive point that can be attributed to one of the many passives in the passive grid.The bonus from each passive is dynamic and depends on the current popularity of the passive.Popular passives values, most often used in Overpowered builds, are decreased while unpopular ones are boosted. In other games, nerfs make OP builds become unviable builds brutally while my system allows a smooth transition and auto-balancement. But more importantly, it assures a true and fair character customization, encouraging people to play home-made builds."
		q.hintGiver = function(key,mq){
			if(false){
				return 'something';
			} 
			return 'You can start this quest by talking to God.';
		};
		
		/*
		Db.dialogue['Jenny']['quest'] = {
		'intro':{
			'text':'Do you want to help me out?',
			'face':'Jenny',
			'option':[
				{'text':"Sure.",
					'next':{'node':'yes'},
					'func':(function(key){  Db.quest['questId'].giveDevice(key); }),'param':[]
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
			'func':(function(key){  Db.quest['questId'].giveReward(key); }),'param':[],
			},
		'gratz2':{
			'text':'Thanks again.',
			},
	    }
		*/
		
		q.bonus = {
			'halfHp':{
				'name':'Half Life',
				'info':'Your hp is halved during this quest.',
				'bonus':1.5,
				'add':(function(key){
					Quest.bonus.update(key, q.id, 'halfHp',[
						{'stat':'hp-max','value':-500,'type':'base'}
					]);
				}),
				'remove':(function(key){
					Quest.bonus.update(key, q.id, 'halfHp',[
						{'stat':'hp-max','value':-500,'type':'base'}
					]);
				}),
			},
			'daemonSpd':{
				'name':'Daemon Speed',
				'info':'Complete this quest in less than 1 hour.',
				'bonus':1.2,
				'add':(function(key){
					Quest.bonus.update(key, q.id, 'daemonSpd',[
						
					]);
				}),
				'remove':(function(key){
					Quest.bonus.update(key, q.id, 'daemonSpd',[
						
					]);
				}),
			}
		};
		
		q.variable = {
            receivedDevice:false,
            bossKilled:false,
            receivedReward:false,
		};
		
		//{ Functions
		q.giveDevice = function(key){
		    List.main[key].invList.add('quest-teleport');
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
		return q;
	}();
	//}
	
	/*
	var mort = List.all[key];
	mort.mapMod['test']['42-47'] = 0;
	mort.mapMod['test']['43-47'] = 0;
	mort.mapMod['test']['44-47'] = 0;
	mort.mapMod['test']['45-47'] = 0;
	mort.mapMod['test']['46-47'] = 0;
	*/
	
	//Note: List.main[key].quest[id] only has variable
	for(var i in Db.quest){ 
		Db.quest[i].variable = Db.quest[i].variable || {};
		Db.quest[i].variable.hint = 'There is no hint.';
		Db.quest[i].variable.rewardTier = '0%';
		Db.quest[i].variable.reward = null;
		Db.quest[i].variable.requirement = '';
		Db.quest[i].variable.complete = 0;
		Db.quest[i].variable.started = 0;
		Db.quest[i].variable.bonusSum = 0;
		Db.quest[i].variable.bonus = {};
		for(var j in Db.quest[i].bonus){ Db.quest[i].variable.bonus[j] = 0; }
		for(var j in Db.quest[i].requirement){ Db.quest[i].variable.requirement += '0'; }
	}
	var quest = {};
	for(var i in Db.quest){ quest[i] = deepClone(Db.quest[i].variable);}
	eval('Main.template.quest = function(){ return ' + stringify(quest) + '}');
	
	
}

Quest = {};

Quest.bonus = {};

Quest.bonus.update = function(key,qid,bid,b){
	var mq = List.main[key].quest[qid];
	if(mq.bonus[bid]){
		Mortal.permBoost(List.all[key],'qb-'+qid+'-'+bid,b);
	} else {
		Mortal.permBoost(List.all[key],'qb-'+qid+'-'+bid);	
	}
	mq.bonusSum = 1;
	for(var i in mq.bonus){
		if(mq.bonus[i]){	mq.bonusSum *= Db.quest[qid].bonus[i].bonus; }
	}
	
}

//when a player click on a quest bonus
Quest.bonus.toggle = function(key,qid,bid){
	if(!List.main[key].quest[qid].started){
		List.main[key].quest[qid].bonus[bid] = !List.main[key].quest[qid].bonus[bid];
		
		if(List.main[key].quest[qid].bonus[bid]){
			Db.quest[qid].bonus[bid].add(key);
			Chat.add(key,'Bonus Turned On.');
		} else {
			Db.quest[qid].bonus[bid].remove(key);
			Chat.add(key,'Bonus Turned Off.');
		}
	} else {
		Chat.add(key,'You have already started this quest. You can\'t change the bonus.');
	}
}

//roll the perm stat bonus and check if last one was better
Quest.reward = function(key,id){
	var qp = List.main[key].quest[id];
	var q = Db.quest[id];
	q.reward.quality = qp.bonusSum;	//change for all players
	
	var boost = Craft.boost.generate(q.reward);
	
	Chat.add(key,"The quest reward rolled is " + round(boost.value,4) + ' in ' + Db.stat[boost.stat].name + '.');
	
	if(qp.reward === null || boost.value >= qp.reward.value){
		Chat.add(key,"Congratulations! Your character grows stronger.");
	
		Mortal.permBoost(List.all[key],'Q-'+id,boost);
		qp.complete = 1;
		qp.reward = boost;
		qp.rewardTier = round(boost.tier*100,1) + '%';
	} else {	
		Chat.add(key,"Unfortunately, your last reward for this quest was better. This means you will keep your old reward.");
	} 
}
	
Quest.hint = {};
Quest.hint.update = function(key,id){
	List.main[key].quest[id].hint = Db.quest[id].hintGiver(key,List.main[key].quest[id]);
}

Quest.req = {};
//convert the quest req object into string
Quest.req.convert = function(qvar,req){
	if(!req){ return 'None.'; }
	
	var returnStr = '';
	for(var i in req){
		var q = req[i];
		var temp = q.text;
		if(+qvar[+i]) temp = '<del>' + temp + '</del>';	//if requirement is met
		temp += '<br>';
		returnStr += temp;
	}

	return returnStr.slice(0,-4);
}

//update the test about hte quest req (strike if done)
Quest.req.update = function(key,id){
	var temp = '';
	
	var q = Db.quest[id];
	
	for(var i in q.requirement){
		if(q.requirement[i].func(key)){	temp += '1';}
		else {temp += '0';}
	}
	List.main[key].quest[id].requirement = temp;
}


















