//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Main','Sprite','QuestVar','Debug','Actor','Challenge','Preset','Highscore','Server','Material','ItemList','Message','Dialogue','Quest']));

var CHANCEPLAN = 1/4;

//## START ##################
Quest.onStart = function(quest,main){
	var mq = main.quest[quest.id];
	QuestVar.addToList(QuestVar(quest.id,main));
	Challenge.onStart(main);
	quest.event._start(main.id);
}

Quest.onSignIn = function(main,questVar,account){
	if(account.lastSignIn === null)
		return setTimeout(function(){
			if(!Main.get(main.id)) return;
			Main.startQuest(main,'Qtutorial');
		},1000);
		
	if(questVar){
		var q = Quest.get(questVar.quest);
		q.event._signIn(main.id);	//after preset cuz
		if(!main.questActive) return;	//cuz signIn can failQuest
		Challenge.onSignIn(main);
		if(!main.questActive) return;
		//QuestVar.addToList done in QuestVar.onSignIn
		Preset.onSignIn(main,q,questVar);
		
		Main.updateQuestHint(main);
	}
	
}


//## COMPLETE ##################

var QuestReward = function(score,item,exp){
	return {
		score:score || 0,
		item:item || {},
		exp:exp || {},	
	}
}

Quest.getScoreMod = function(q,main){
	return q.event._getScoreMod(main.id) || 0;
}
Quest.getReward = function(q,bonus,scoreMod,firstTimeCompleted){
	var finalScore = q.reward.reputation.mod * bonus.score * scoreMod;
	if(firstTimeCompleted) finalScore += Quest.getFirstTimeBonus(q.reward.reputation);
	
	return QuestReward(
		finalScore,
		Quest.getReward.item(bonus.item*q.reward.item),
		100 * bonus.exp*q.reward.exp
	);
}

Quest.getReward.item = function(mod){
	var item = {};
	for(var i = 0 ; i < 3; i++){
		var num = Math.roundRandom(mod); 
		if(num !== 0) item[Material.getRandom(0)] = num;
	}
	if(Math.random() / mod < CHANCEPLAN){
		//item[Plan().id] = 1;
	}
	return item;
}


Quest.scoreToReputationPoint = function(score,reputation){
	score = Math.max(score,1);	//other pp could be <0
	return Math.min(Math.log10(score)/4,1) * reputation.max;
}

Quest.getFirstTimeBonus = function(reputation){
	return Math.pow(10,4*reputation.min/reputation.max);	//normally 100
}

//## RESET ##################

Quest.onAbandon = function(q,main){
	q.event._abandon(main.id);	
}

Quest.getChallengeSuccess = function(q,main,mq){	//null:non-active
	var tmp = {};
	for(var i in mq._challenge){
		tmp[i] = null;
		if(!mq._challenge[i]) continue;
		if(Challenge.testSuccess(Challenge.get(i),main.id)){	
			mq._challengeDone[i] = 1;
			tmp[i] = true;
			Main.quest.updateChallengeDoneBonus(main,q.id);
		} else {
			tmp[i] = false;
		}
	}
	return tmp;
}




Quest.onReset = function(q,main){	//undo what the quest could have done
	var key = main.id;
	var act = Main.getAct(main);
	
	QuestVar.removeFromList(q.id,main);
	QuestVar.removeFromDb(q.id,main);
	
	var s = q.s;
	for(var i in q.item)	s.removeItem(key,i,CST.bigInt);
	for(var i in q.equip) s.removeItem(key,i,CST.bigInt);
	
	
	for(var i in act.timeout){
		if(i.have(q.id,true)) 
			Actor.timeout.remove(act,i);
	}
	for(var i in main.chrono){
		if(i.have(q.id,true)) 
			Main.chrono.stop(main,i);
	}
	for(var i in act.permBoost){
		if(i.have(q.id,true)) 
			Actor.permBoost(act,i);
	}
	s.removePreset(act.id);
	for(var i in q.ability)	
		Actor.ability.remove(act,i);	
	
	Main.reputation.updateBoost(main);
	Actor.boost.removeAll(act,q.id);
	
	s.enableAttack(key,true);
	s.enablePvp(key,false);
	s.enableMove(key,true);
	Main.dialogue.end(main);
	Actor.setCombatContext(act,'ability','normal');
	Actor.setCombatContext(act,'equip','normal');
	Actor.changeSprite(act,{name:'normal',sizeMod:1});
	Actor.removeAllQuestMarker(act);
	Main.screenEffect.remove(main,Main.screenEffect.REMOVE_ALL);
	
}

//############

Quest.getRandomDaily = function(){
	do var quest = Quest.DB.randomAttribute();
	while(!Quest.DB[quest].dailyTask)
	return Quest.DB[quest];
}

Quest.addPrefix = function(Q,name){
	if(name.have(Q + '-',true)) return name;
	else return Q + '-' + name;
}

//#########





