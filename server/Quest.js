Quest.bonus = {};
Quest.bonus.update = function(key,qid,bid,b){
	var mq = List.main[key].quest[qid];
	if(mq.bonus[bid]){
		Actor.permBoost(List.all[key],'qb-'+qid+'-'+bid,b);
	} else {
		Actor.permBoost(List.all[key],'qb-'+qid+'-'+bid);	
	}
	mq.bonusSum = 1;
	for(var i in mq.bonus){
		if(mq.bonus[i]){	mq.bonusSum *= Db.quest[qid].bonus[i].bonus; }
	}
	
}

Quest.bonus.toggle = function(key,qid,bid){
	//when a player click on a quest bonus
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

Quest.reward = function(key,id){
	//roll the perm stat bonus and check if last one was better
	var qp = List.main[key].quest[id];
	var q = Db.quest[id];
	
	var seed = {
		'quality':(qp.bonusSum+0.01*qp.complete) * q.reward.mod,
		'cap':Math.max(0.75,1-0.01*qp.deathCount)
	};
	
	var boost = Craft.boost(seed,q.reward);
	
	Chat.add(key,"The quest reward is " + round(boost.value,4) + ' in ' + Db.stat[boost.stat].name + '.');
	
	if(qp.reward === null || boost.value >= qp.reward.value){
		Chat.add(key,"Congratulations! Your character grows stronger.");
		Actor.permBoost(List.all[key],'Q-'+id,boost);
		qp.reward = boost;
		qp.rewardTier = boost.tier;
	} else {	
		Chat.add(key,"Unfortunately, your last reward for this quest was better. This means you will keep your old reward.");
	} 
}
	
Quest.hint = {};
Quest.hint.update = function(key,id){
	List.main[key].quest[id].hint = Db.quest[id].hintGiver(key,List.main[key].quest[id]);
}

Quest.req = {};

Quest.req.update = function(key,id){
	//update the test about hte quest req (strike if done)
	var temp = '';	
	var q = Db.quest[id];
	
	for(var i in q.requirement){
		temp += q.requirement[i].func(key) ? '1' : '0';
	}
	List.main[key].quest[id].requirement = temp;
}


Quest.complete = function(key,id){
	var qp = List.main[key].quest[id];
	var q = Db.quest[id];
	Chat.add(key,"Congratulations! You have completed the quest \"" + q.name + '\"!');
	qp.complete++;
	
	Quest.reward(key,id);
	var tmp = [qp.rewardTier,qp.reward,qp.complete]
	qp = Main.template.quest[id]();
	qp.rewardTier = tmp[0];
	qp.reward =	tmp[1];
	qp.complete = tmp[2];
	qp.deathCount = 0;
	LOG(0,key,'Quest.complete',id);
}

Quest.convert = function(mq){
	var temp = [];
	for(var i in mq){
		if(mq[i].reward) temp.push(mq[i].reward);
	}
	temp = Actor.permBoost.compile(temp);
	return temp;
}











