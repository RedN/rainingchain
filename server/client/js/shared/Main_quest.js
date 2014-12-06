//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Server','Debug','Main','QuestVar','ItemList','Save','Message','Dialogue','Boost','Drop','Quest','Collision','Command','Contribution']));

Main.Quest = function(overwrite){
	if(!SERVER) return {};
	var tmp = {};
	overwrite = overwrite || {};
	var list = Quest.getMainVarList();
	for(var i in list){
		tmp[list[i]] = Main.Quest.part(Quest.get(list[i]),overwrite[list[i]]);
	}
	return tmp;	
}
Main.Quest.part = function(quest,overwrite){
	return overwrite || {
		_rewardScore:0,
		_complete:0,
		_started:0,
		_bonus:Main.Quest.bonus(),
		_challenge:Quest.getChallengeList(quest),
		_challengeDone:Quest.getChallengeList(quest),
		_highscore:Quest.getHighscoreList(quest),
		_rating:0,
		_skillPlot:[0,0,0,0,0,0,0],
		_enemyKilled:0,
	};
}

Main.Quest.bonus = function(){
	return {
		cycle:Quest.RewardInfo(1,1,1),
		challenge:Quest.RewardInfo(1,1,1),
		challengeDone:Quest.RewardInfo(1,1,1),
	};
}

Main.Quest.compressDb = function(quest,main,qid){	
	quest.bonusCycleItem = quest._bonus.cycle.item;
	quest.bonusCycleExp = quest._bonus.cycle.exp;
	quest.bonusCycleScore = quest._bonus.cycle.score;
	delete quest._bonus;
	quest.username = main.username;
	quest.quest = qid;
	
	return quest;
}

Main.Quest.uncompressDb = function(quest){ //quest= main.quest[i]
	quest._bonus = Main.Quest.bonus();
	quest._bonus.cycle.item = quest.bonusCycleItem;
	quest._bonus.cycle.exp = quest.bonusCycleExp;
	quest._bonus.cycle.score = quest.bonusCycleScore;
	delete quest.bonusCycleScore;
	delete quest.bonusCycleExp;
	delete quest.bonusCycleItem;
	delete quest.username;
	delete quest.quest;
	
	return quest;
}

Main.Quest.uncompressDb.verifyIntegrity = function(quest){	//quest= main.quest
	//If new or deleted quest
	//check QuestVar.verifyIntegrity for custom quest variable
	var allQuest = QuestVar.getInitVar.all();
	for(var i in allQuest){
		if(!Quest.get(i).inMain) continue;	//not part of
	
		if(!quest[i]){ 	//aka new quest
			quest[i] = Main.Quest.part(i);
			continue; 
		}	
		if(!allQuest[i]){ 	//delete quest
			delete quest[i]; 
			continue; 
		}
		
		//challenge integrity
		var chal = Quest.getChallengeList(i);
		for(var j in chal){	//add new version challenge
			if(typeof quest[i]._challengeDone[j] === 'undefined'){	
				quest[i]._challengeDone[j] = 0;
				quest[i]._challenge[j] = 0;
			}
		}
		for(var j in quest[i]._challengeDone){	//removed challenge
			if(typeof chal[j] === 'undefined'){	
				delete quest[i]._challengeDone[j];
				delete quest[i]._challenge[j];
			}
		}
		
		//highscore integrity
		var high = Quest.getHighscoreList(i);
		for(var j in high){	//add new version highscore
			if(typeof quest[i]._highscore[j] === 'undefined'){	
				quest[i]._highscore[j] = null;
			}
		}
		for(var j in quest[i]._highscore){	//remove highscore
			if(typeof high[j] === 'undefined'){	
				delete quest[i]._highscore[j];
			}
		}
	}
	return quest;
}

Main.QuestActive = function(questActive){
	return questActive || '';
}

Main.QuestActive.uncompressDb = function(questActive){
	if(questActive && !Quest.get(questActive)){
		ERROR(3,'invalid questActive',questActive);
		return '';
	}
	return questActive;
}


//#################

Main.quest = {};
Main.quest.haveDoneTutorial = function(main){
	if(Debug.ACTIVE) return true;
	return !!main.quest.Qtutorial._complete;
}

Main.quest.onDeath = function(main,killers){
	if(!main.questActive) return;
	Quest.get(main.questActive).event._death(main.id,killers);
}

Main.getQuestVar = function(main,id){
	if(id) return main.quest[id];
	if(main.questActive) return main.quest[main.questActive];
	return main.quest;
}

Main.updateQuestHint = function(main){
	var old = main.questHint;
	main.questHint = main.questActive ? 
		Quest.get(main.questActive).event._hint(main.id) || 'None.'
		: 'No quest active right now.';
	if(old !== main.questHint)
		Main.setFlag(main,'questHint');
}

Main.quest.updateChallengeDoneBonus = function(main,qid){
	var mq = Main.getQuestVar(main,qid);
	var q = Quest.get(qid);
	var b = mq._bonus.challengeDone = Quest.RewardInfo(1,1,1);
		
	for(var i in mq._challengeDone){
		if(!mq._challengeDone[i]) continue;
		b.item *= q.challenge[i].bonus.perm.item;
		b.exp *= q.challenge[i].bonus.perm.exp;
		b.score *= q.challenge[i].bonus.perm.score;
	}
}

Main.quest.hasRatedQuest = function(main,qid){
	return !!main.quest[qid]._rating;
}	

Main.quest.updateCycleBonus = function(main){
	var mq = main.quest;
	for(var i in mq){
		mq[i]._bonus.cycle.item = Math.max(mq[i]._bonus.cycle.item,1);	//incase lowered by completing it many times
		mq[i]._bonus.cycle.exp = Math.max(mq[i]._bonus.cycle.exp,1);
		mq[i]._bonus.cycle.score = Math.max(mq[i]._bonus.cycle.score,1);
		
		mq[i]._bonus.cycle.item += 0.02;
		mq[i]._bonus.cycle.exp += 0.04;
		mq[i]._bonus.cycle.score += 0.08;
	}
}

Main.quest.updateChallengeBonus = function(main,qid){	//only used for visual, assume success
	var mq = main.quest[qid];
	
	mq._bonus.challenge = Quest.RewardInfo(1,1,1);
	
	var qChallenge = Quest.get(qid).challenge;
	for(var i in mq._challenge){
		if(!mq._challenge[i]) continue;	//active
		for(var j in qChallenge[i].bonus.success)
			mq._bonus.challenge[j] *= qChallenge[i].bonus.success[j];
	}
}

Main.getQuestActive = function(main){
	return main.questActive || null;
}

//###################














