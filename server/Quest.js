var db = require('./Db');

Quest.reward = function(key,id){	//roll the perm stat bonus and check if last one was better	
	var mq = List.main[key].quest[id];
	var q = Db.quest[id];
	
	var bonus = Quest.getBonus(key,id);
	var reward = Quest.getReward(q,bonus);
	
	if(mq._rewardScore === 0) mq._rewardScore = Math.pow(10,4*q.reward.passive.min/q.reward.passive.max);
	mq._rewardScore += reward.passive;
	
	mq._rewardPt = Math.min(Math.log10(mq._rewardScore)/4,1) * q.reward.passive.max;
	
	Chat.add(key,"You total quest score is " + Tk.round(mq._rewardScore,1) + " equivalent to " + Tk.round(mq._rewardPt,3) + " passive point. Repeat the quest to improve your reward.");
	Itemlist.add(key,reward.item);	//TOFIX test if space
	Skill.addExp.bulk(key,reward.exp,false);
}


Quest.getBonus = function(key,id){
	var mq = List.main[key].quest[id];
	var q = Db.quest[id];
	var r = q.reward;
	var b = mq._bonus;
	
	var tmp = {
		item:b.orb.item * b.cycle.item ,
		exp:b.orb.exp * b.cycle.exp ,
		passive:b.orb.passive * b.cycle.passive,
	};
	for(var i in mq._challenge){
		if(!mq._challenge[i]) continue;
		if(q.challenge[i].successIf(key)){
			tmp.item *= q.challenge[i].bonus.success.item;
			tmp.exp *= q.challenge[i].bonus.success.exp;
			tmp.passive *= q.challenge[i].bonus.success.passive;
		} else {
			tmp.item *= q.challenge[i].bonus.failure.item;
			tmp.exp *= q.challenge[i].bonus.failure.exp;
			tmp.passive *= q.challenge[i].bonus.failure.passive;
		}
	}
	
	return tmp;
}

Quest.getReward = function(q,bonus){	//TODO item
	var reward = Tk.deepClone(q.reward);
	var tmp = {passive:0,item:{},exp:{}};
	
	tmp.passive = reward.passive.mod * bonus.passive;
	
	for(var i in reward.exp) tmp.exp[i] = reward.exp[i] * bonus.exp;
	
	return tmp;
}




Quest.hint = function(key,id){
	if(Db.quest[id].event._hint) List.main[key].quest[id]._hint = Db.quest[id].event._hint(key);
}

Quest.complete = function(key,id){
	var mq = List.main[key].quest[id];
	var q = Db.quest[id];
	Chat.add(key,"Congratulations! You have completed the quest \"" + q.name + '\"!');
	mq._complete++;
	
	if(q.event._complete) q.event._complete(key); 
	
	Quest.reward(key,id);
	Quest.reset(key,id);
	Server.log(1,key,'Quest.complete',id);
}

Quest.reset = function(key,qid,abandon){
	var main = List.main[key];
	var mq = main.quest[qid];
	
	var keep = ['_rewardScore','_rewardPt','_complete','_challengeDone'];
	if(abandon) keep.push('_skillPlot');
	var tmp = {};
	for(var i in keep) tmp[keep[i]] = mq[keep[i]];
	
	
	
	for(var i in Db.quest[qid].item){
		Itemlist.remove(main.invList,qid + '-' + i, 10000);
		Itemlist.remove(main.bankList,qid + '-' + i, 10000);
	}
	
	for(var i in mq._challenge){
		if(mq._challenge[i]) Db.quest[qid].challenge[i].off(key,qid);
	}
	
	var newmq = Main.template.quest[qid]();
	for(var i in tmp) newmq[i] = tmp[i];
	
	main.questActive = '';
	main.quest[qid] = newmq;
	
}

Quest.orb = function(key,quest,amount){	//when using orb on quest, only boost passive
	var mq = List.main[key].quest[quest];
	mq._orbAmount += amount;
	mq._bonus.orb.passive = Craft.orb.upgrade.formula(mq._orbAmount);
}


Quest.start = function(key,id){	//verification done in command
	var q = Db.quest[id];
	var mq = List.main[key].quest[id];
	mq._active = 1;
	List.main[key].questActive = id;
	
	if(q.event._start)	q.event._start(key);	
	
	for(var i in mq._challenge){
		if(mq._challenge[i]) q.challenge[i].on(key,id);
	}
	
}

Quest.abandon = function(key,id){
	Quest.reset(key,id,1);
	if(Db.quest[id].event._abandon)	Db.quest[id].event._abandon(key);
}


Quest.challenge = {};
Quest.challenge.toggle = function(key,qid,bid){	//when a player click on a quest bonus
	var mq = List.main[key].quest[qid];
	mq._challenge[bid] = !mq._challenge[bid];
	
	if(mq._challenge[bid])	Chat.add(key,'Bonus Turned On.');	//function activate when starting quest
	else 	Chat.add(key,'Bonus Turned Off.');
	
	Quest.challenge.update(key,qid);	
}
Quest.challenge.signIn = function(key){
	var mq = List.main[key].quest;
	var qa = List.main[key].questActive;
	if(!qa) return;
	for(var i in mq[qa]._challenge){
		if(mq[qa]._challenge[i])		Db.quest[qa].challenge[i].on(key,qa);
	}

}

Quest.challenge.update = function(key,qid){	//only used for visual, assume success
	var mq = List.main[key].quest[qid];
	
	mq._bonus.challenge.item = 1;
	mq._bonus.challenge.passive = 1;
	mq._bonus.challenge.exp = 1;
	
	for(var i in mq._challenge){
		if(mq._challenge[i]){	//active
			for(var j in Db.quest[qid].challenge[i].bonus.success)
				mq._bonus.challenge[j] *= Db.quest[qid].challenge[i].bonus.success[j];
		}	
	}
}

Quest.challenge.template = {};
Quest.challenge.template.speedrun = function(time,bonus){
	if(typeof time === 'string') time = time.chronoToTime();
	
	return {
		name:'Speedrunner',
		description:'Complete the quest in less than ' + time.toChrono() + '.',
		
		on:function(key,qid){
			var main = List.main[key];
			if(!main.chrono[qid])
				Main.chrono(main,qid,'start',Db.quest[qid].name);
		},
		off:function(key,qid){
			Main.chrono(List.main[key],qid,'stop');
		},
		successIf:function(key,qid){
			return Main.chrono(List.main[key],qid,'stop') < this.timeLimit;
		},
		timeLimit:time,
		bonus:bonus || {
			success:{
				item:1.2,
				passive:1.5,
				exp:1.2,		
			},	
			failure:{
				item:0.8,
				passive:0.8,
				exp:0.8,
			}
		},
	}
}

Quest.challenge.template.survivor = function(amount,bonus){
	return {
		name:'Survivor',
		description:'Complete the quest dying less than ' + amount + ' times.',
		
		on:function(key,qid){},
		off:function(key,qid){},
		successIf:function(key,qid){
			return List.main[key].quest[qid]._deathCount < this.deathLimit;
		},
		deathLimit:amount,
		bonus:bonus || {
			success:{
				item:1.2,
				passive:1.5,
				exp:1.2,		
			},	
			failure:{
				item:0.8,
				passive:0.8,
				exp:0.8,
			}
		},
	}
}

Quest.challenge.template.boost = function(boost,bonus){
	return {
		name:'Nerfed Stats',
		description:'Complete this quest with nerfed stats.',
		
		on:function(key,qid){
			Actor.permBoost(List.all[key],qid + 'boostChallenge', boost);
		},
		off:function(key,qid){
			Actor.permBoost(List.all[key],qid + 'boostChallenge');
		},
		successIf:function(key,qid){	return true;},
		
		bonus:bonus || {
			success:{
				item:1.2,
				passive:1.5,
				exp:1.2,		
			},	
			failure:{
				item:0.8,
				passive:0.8,
				exp:0.8,
			}
		},
	}
}



Quest.requirement = {};

Quest.requirement.update = function(key,id){
	//update the test about hte quest req (strike if done)
	var temp = '';	
	var q = Db.quest[id];
	
	for(var i in q.requirement){
		temp += q.requirement[i].func(key) ? '1' : '0';
	}
	List.main[key].quest[id].requirement = temp;
}


Quest.requirement.template = {}

Quest.requirement.template.skill = function(skill,lvl){
	return {
		func:function(key){
			return List.all[key].skill.lvl[skill] >= lvl;
		},		
		name:'Level ' + lvl + ' ' + skill.capitalize(),
		description:'Having at least level ' + lvl + ' in ' + skill.capitalize() + '.',	
	}
}

Quest.requirement.template.quest = function(quest){
	return {
		func:function(key){
			return List.main[key].quest[quest]._complete;		
		},		
		name:'Quest "' + Db.quest[quest].name + '"',
		description:'Having completed the quest ' + Db.quest[quest].name + '.',
	}
}









Quest.highscore = {};
Quest.highscore.template = function(){
	return {
		name:"Fastest Completion",
		order:"ascending",	//descending
	}
}

Quest.highscore.fetch = function(category,cb){
	var req = {}; req[category] = {$ne:null};
	var proj = {username:1,_id:0};	proj[category] = 1;
	var sort = {}; sort[category] = 1;
	
	db.find('highscore',req,proj,function(err,res){	if(err) throw err;
		for(var i = 0; i < res.length; i++){
			res[i].rank = i+1;
			res[i].score = res[i][category];
			delete res[i][category];
		}
		cb(res);
	}).sort(sort).limit(25);
	
	//ts("Quest.highscore.fetch(key,'Qbtt-time')")
}

Quest.highscore.fetchRank = function(key,category,cb){
	var score = List.main[key].quest[Quest.highscore.getQuest(category)]._highscore[Quest.highscore.getCategory(category)];
	
	var tmp = {};
	if(Quest.highscore.list[category].order === 'ascending') tmp[category] = {$lt: score || Cst.bigInt,$ne:null};
	else tmp[category] = {$gt: score || 0,$ne:null};
	
	db.count('highscore',tmp,function(err,result){	
		cb({
			rank:result.n+1,		//+1 cuz gt instead of gte
			username:List.main[key].username,
			score:score,
		});
	});
}

Quest.highscore.list = {};

Quest.highscore.getQuest = function(str){
	return str.split('-')[0];
}
Quest.highscore.getCategory = function(str){
	return str.split('-')[1];
}




/*
test = function(key){
	Quest.highscore.fetchRank(key,'Qbtt-time',INFO);
}*/
