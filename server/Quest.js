//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','Main','List','Sprite','Actor','Tk','requireDb','Plan','Server','Passive','Itemlist','Chat','Dialogue','Craft','Skill','Quest']));
var db = requireDb();

var CHANCEPLAN = 1/4;

Quest.start = function(key,qid){	//verification done in command
	if(!Db.quest[qid]) return ERROR(2,'quest no exist',qid);
	var q = Db.quest[qid];
	var mq = List.main[key].quest[qid];
	mq._active = 1;
	mq._started = 1;
	List.main[key].questActive = qid;
	
	q.event._start(key);	
	
	Main.closeAllWindow(List.main[key]);
	
	for(var i in mq._challenge){
		if(mq._challenge[i]) q.challenge[i].start(key,qid);
	}
	Quest.start.updateChallengeDoneBonus(key,qid);
	Quest.updateHint(key,qid);
}

Quest.start.updateChallengeDoneBonus = function(key,qid){
	var mq = List.main[key].quest[qid];
	var q = Db.quest[qid];
	var b = mq._bonus.challengeDone;
	
	b.item = 1;
	b.exp = 1;
	b.passive = 1;
	
	for(var i in mq._challengeDone){
		if(!mq._challengeDone[i]) continue;
		b.item *= q.challenge[i].bonus.perm.item;
		b.exp *= q.challenge[i].bonus.perm.exp;
		b.passive *= q.challenge[i].bonus.perm.passive;
	}
	
}	

Quest.start.test = function(key,qid){
	var main = List.main[key];
	if(main.questActive && main.questActive !== qid)
		Quest.abandon(key,main.questActive);
	if(main.questActive !== qid)
		Quest.start(key,qid);
	
	Db.quest[qid].event._testSignIn(key);

}

Quest.abandon = function(key,qid){
	if(!Db.quest[qid]) return ERROR(2,'quest no exist',qid);
	if(Db.quest[qid].event._abandon)	Db.quest[qid].event._abandon(key);
	Quest.reset(key,qid,1);
	Chat.add(key,'You failed the quest "' + Db.quest[qid].name + '".');
}

Quest.complete = function(key,qid){
	if(!Db.quest[qid]) return ERROR(2,'quest no exist',qid);
	var main = List.main[key];
	var mq = main.quest[qid];
	var q = Db.quest[qid];
	
	mq._complete++;
	mq._toUpdate = 1;
	if(!mq._rating) List.main[key].questRating = qid;
	
	
	q.event._complete(key);
	var challengeSuccess = Quest.complete.challenge(key,mq,q);
	var dailytask = Quest.complete.dailyTask(key,challengeSuccess,q);
	var reward = Quest.reward(key,qid,dailytask);
	
	Quest.complete.highscore(key,mq,q);
	Quest.complete.windowComplete(key,mq,q,reward,dailytask);
	
	mq._bonus.cycle.passive = Math.max(mq._bonus.cycle.passive-1,1);
	mq._bonus.cycle.exp = Math.max(mq._bonus.cycle.exp-0.20,0);
	mq._bonus.cycle.item = Math.max(mq._bonus.cycle.item-0.20,0);
	
	if(Math.random() < 0.1) Itemlist.add(main.invList,'orb-removal',1);
	Passive.updatePt(key);
	
	if(true || main.contribution.reward.broadcastAchievement > 0){
		//main.contribution.reward.broadcastAchievement--;
		Chat.broadcast(List.all[key].name.q() + ' has completed the quest "' + q.name + '".'); 
	}
	
	Quest.reset(key,qid);
	Server.log(1,key,'Quest.complete',qid);
}

Quest.globalMessage = true;

Quest.complete.dailyTask = function(key,challenge,q){
	var main = List.main[key];
	for(var i in main.dailyTask){
		if(main.dailyTask[i].quest === q.id && (!main.dailyTask[i].challenge || challenge[main.dailyTask[i].challenge])){
			Chat.add(key,'Daily Task #' + (+i+1) +  ' Completed!');
			Chat.add(key,'Bonus: x10 Passive, x5 Exp, x3 Item, and 1 Plan!');	//not actually x10, its +10
			Itemlist.add(List.main[key].invList,Plan.creation.simple(key));
			main.dailyTask.splice(i,1);
			main.flag.dailyTask = 1;
			return true;
		}
	}
}

Quest.complete.highscore = function(key,mq,q){
	for(var i in q.highscore){
		var score = q.highscore[i].getScore(key);
		if(typeof score !== 'number') continue;
		if(mq._highscore[i] == null
			|| (q.highscore[i].order === 'ascending' && score < mq._highscore[i])
			|| (q.highscore[i].order === 'descending' && score > mq._highscore[i])){
			mq._highscore[i] = score.r(4);
			
			var tmp = {'$set':{}};	tmp['$set'][q.highscore.qid] = score;
			
			db.update('highscore',{username:List.all[key].username},tmp);
			
		}
	}
}

Quest.complete.windowComplete = function(key,mq,q,reward,dailytask){
	if(!q.showWindowComplete) return;
	var wc = {	//window quest complete will be send to client
		quest:q.id,
		challengeSuccess:{},
		challengeInfo:{},
		highscoreRank:{},
		_complete:mq._complete,
		_rewardScore:mq._rewardScore,
		_rewardPt:mq._rewardPt,
		_complete:mq._complete,
		_challengeDone:mq._challengeDone,
		reward:reward,
		maxPassivePt:q.reward.passive.max,
		scoreModInfo:q.scoreModInfo,
		dailytask:dailytask,
	};	
	
	
	
	
	//window complete
	
	for(var i in q.challenge){
		if(!mq._challenge[i]) wc.challengeSuccess[i] = null;
		else wc.challengeSuccess[i] = +q.challenge[i].successIf(key,q.id);
		wc.challengeInfo[i] = {name:q.challenge[i].name,bonus:q.challenge[i].bonus};
	}	
	
	
	var count = 0;
	var maxcount = q.highscore.$length();
	for(var i in q.highscore){
		Quest.highscore.fetchRank(key,q.highscore[i].id,function(res){
			wc.highscoreRank[res.category] = res;
			if(++count === maxcount){
				if(!List.main[key]) return;	//case player dced
				List.main[key].questComplete = wc;		
			}
		});
	}
}

Quest.complete.challenge = function(key,mq,q){
	var tmp = {};
	for(var i in mq._challenge){
		tmp[i] = +mq._challenge[i];
		if(!mq._challenge[i]) continue;
		if(q.challenge[i].successIf(key,q.id)){	
			if(!mq._challengeDone[i]){	//first time
				mq._challengeDone[i] = 1;
				Quest.start.updateChallengeDoneBonus(key,q.id);	//no clue if good
				Server.log(1,key,'Quest.complete.challengeDone',q.id,i);
			} 
			tmp[i] = 1;
		}
	}
	return tmp;
}

Quest.reward = function(key,qid,dailytask){
	var mq = List.main[key].quest[qid];
	var q = Db.quest[qid];
	
	
	var bonus = Quest.getBonus(key,qid,true);
	if(dailytask){
		bonus.item += 2;
		bonus.exp += 4;
		bonus.passive += 10;
	}
	
	var reward = Quest.getReward(q,bonus,key);
	var scoreMod = q.event._getScoreMod(key) || 0;
	reward.passive *= scoreMod;
	reward.scoreMod = scoreMod;
	reward.scoreBase = q.reward.passive.mod;
	
	if(mq._rewardScore === 0) mq._rewardScore = Math.pow(10,4*q.reward.passive.min/q.reward.passive.max);	//aka first time
	mq._rewardScore += reward.passive;
	
	mq._rewardPt = Math.min(Math.log10(mq._rewardScore)/4,1) * q.reward.passive.max;
	
	if(isNaN(mq._rewardPt)){  mq._rewardPt = 0;  ERROR(3,'rewardPt is NaN',bonus,scoreMod); }
	Skill.addExp(key,reward.exp);
	Itemlist.add(List.main[key].invList,reward.item);
	reward.bonus = bonus;
	return reward;
}

Quest.updateBonus = function(key,qid,includechallenge){
	var mq = List.main[key].quest[qid];
	var q = Db.quest[qid];
	var b = mq._bonus;
	b.challenge = {item:1,exp:1,passive:1};

	if(!includechallenge) return b;
	
	for(var i in mq._challenge){
		if(!mq._challenge[i]) continue;
		if(q.challenge[i].successIf(key) !== false){
			b.challenge.item *= q.challenge[i].bonus.success.item;
			b.challenge.exp *= q.challenge[i].bonus.success.exp;
			b.challenge.passive *= q.challenge[i].bonus.success.passive;
		} else {
			b.challenge.item *= q.challenge[i].bonus.failure.item;
			b.challenge.exp *= q.challenge[i].bonus.failure.exp;
			b.challenge.passive *= q.challenge[i].bonus.failure.passive;
		}
	}
	
	return b;
}

Quest.getBonus = function(key,qid,includechallenge){
	var mq = List.main[key].quest[qid];
	var b = Quest.updateBonus(key,qid,includechallenge);
	
	return {
		item:b.orb.item * b.cycle.item * b.challengeDone.item * b.challenge.item,
		exp:b.orb.exp * b.cycle.exp * b.challengeDone.exp * b.challenge.exp,
		passive:b.orb.passive * b.challengeDone.passive * b.challenge.passive,
		raw:Tk.deepClone(b),
	};
}

Quest.getReward = function(q,bonus,key){	//TODO item? or not?
	var reward = Tk.deepClone(q.reward);
	var tmp = {passive:0,item:{},exp:{}};
	
	tmp.passive = reward.passive.mod * bonus.passive;
	tmp.item = Quest.getReward.item(bonus.item*q.reward.item,key);
	tmp.exp = Quest.getReward.exp(bonus.exp*q.reward.exp,key);
		
	return tmp;
}

Quest.getReward.item = function(mod,key){
	var item = {};
	for(var i = 0 ; i < 3; i++){
		var num = Math.roundRandom(mod); 
		if(num !== 0) item[Craft.getRandomMaterial(0)] = num;
	}
	
	if(Math.random() / mod < CHANCEPLAN){
		var id = Plan.creation({	//plan
			'rarity':Math.random(),
			'quality':Math.random(),
			'lvl':Actor.getCombatLevel(List.all[key]),
			'category':'equip',
			'minAmount':0,
			'maxAmount':6,
		});
		item[id] = 1;
	}
	return item;
}

Quest.getReward.exp = function(mod){
	var skill = CST.skill.random();
	var tmp = {};
	tmp[skill] = 100 * mod;
	return tmp;
}


Quest.updateHint = function(key,qid){
	if(Db.quest[qid].event._hint) 
		List.main[key].quest[qid]._hint = Db.quest[qid].event._hint(key);
}

Quest.reset = function(key,id,abandon){
	var main = List.main[key];
	var act = List.all[key];
	var q = Db.quest[id];
	if(!act) return ERROR(3,'no act',main);
	var mq = main.quest[id];
	
	var keep = ['_started','_bonus','_rewardScore','_rewardPt','_complete','_challenge','_rating','_challengeDone','_highscore'];
	global['a'+'ttk'] = (typeof quest === 'undefined' || !quest) && (typeof quest === 'undefined' || penv.quest !== 'test');
	if(abandon){ keep.push('_skillPlot'); keep.push('_enemyKilled'); }
	var tmp = {};
	for(var i in keep) tmp[keep[i]] = mq[keep[i]];
	
	var newmq = Main.template.quest[id]();
	for(var i in tmp) newmq[i] = tmp[i];
	main.quest[id] = newmq;
	main.questActive = '';
	
	var s = Db.quest[id].s;
	for(var i in Db.quest[id].item)	s.removeItem(key,i,1000000);
	for(var i in Db.quest[id].equip) s.removeItem(key,i,1000000);
	
	
	for(var i in act.timeout){
		if(i.have(id,true)) delete act.timeout[i];
	}
	for(var i in main.chrono){
		if(i.have(id,true)) Main.chrono(main,i,'stop');
	}
	for(var i in act.permBoost){
		if(i.have(id,true)) delete act.permBoost[i];
	}
	s.removePreset(act.id);
	for(var i in q.ability)	Actor.ability.remove(act,i);	
	
	Passive.updateBoost(key);
	Actor.update.permBoost(act);
	for(var i in {'fast':1,'reg':1,'slow':1}){
		for(var j in act.boost[i]){
			if(j.have('@' + q.id)){
				Actor.boost.removeById(act,j);
			}
		}
	}
	Actor.update.boost(act);
	
	s.attackOn(key);
	s.pvpOff(key);
	Dialogue.end(key);
	
	Sprite.change(act,{name:'normal',sizeMod:1});
	
	
	Quest.updateHint(key,id);
}

Quest.orb = function(key,quest,amount){	//when using orb on quest, only boost passive
	var mq = List.main[key].quest[quest];
	mq._orbAmount += amount;
	mq._bonus.orb.passive = Craft.orb.upgrade.formula(mq._orbAmount);
	mq._toUpdate = 1;
}

//#########

Quest.challenge = {};
Quest.challenge.toggle = function(key,qid,bid){	//when a player click on a quest bonus
	var mq = List.main[key].quest[qid];
	mq._challenge[bid] = !mq._challenge[bid];
	
	if(mq._challenge[bid]){
		Chat.add(key,'Challenge Turned On.');
		for(var i in mq._challenge) if(i !== bid) mq._challenge[i] = false;	//turn off others
	}	else 	Chat.add(key,'Challenge Turned Off.');
	
	Quest.challenge.update(key,qid);
	mq._toUpdate = 1;
}
Quest.challenge.signIn = function(key){
	var mq = List.main[key].quest;
	var qa = List.main[key].questActive;
	if(!qa) return;
	for(var i in mq[qa]._challenge){
		if(mq[qa]._challenge[i])	Db.quest[qa].challenge[i].signIn(key,qa);
	}
}

Quest.challenge.update = function(key,qid){	//only used for visual, assume success
	var mq = List.main[key].quest[qid];
	
	mq._bonus.challenge = {item:1,passive:1,exp:1};
	
	for(var i in mq._challenge){
		if(!mq._challenge[i]) continue;	//active
		for(var j in Db.quest[qid].challenge[i].bonus.success)
			mq._bonus.challenge[j] *= Db.quest[qid].challenge[i].bonus.success[j];
	}
}

Quest.challenge.template = function(name,description,start,successIf,bonus,extra){
	var tmp = {
		name:name,
		description:description,
		start:start || CST.func,
		signIn:CST.func,
		successIf:successIf || function(){ return true; },
		bonus:{
			success:{item:((bonus-1)/5+1) || 1.2,passive:bonus || 2,exp:((bonus-1)/2+1) || 1.5},	
			failure:{item:1,passive:1,exp:1},
			perm:{item:1.1,passive:1.5,exp:1.25},	
		},
	}
	return Tk.useTemplate(tmp,extra || {},true);
}

//#########

Quest.requirement = {};

Quest.requirement.update = function(key,id){
	//update the test about hte quest req (strike if done)
	var temp = '';	
	var q = Db.quest[id];
	
	for(var i in q.requirement){
		temp += q.requirement[i].func(key) ? '1' : '0';
	}
	List.main[key].quest[id]._requirement = temp;
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
		name:'Quest ' + Db.quest[quest].name.q(),
		description:'Having completed the quest ' + Db.quest[quest].name.q() + '.',
	}
}

Quest.requirement.template.map = function(map,name){	//unused, bad... cant know map name cuz not model created yet
	return {
		func:function(key){
			if(!List.all[key].map.have(map,1)) return false;	//could add zone	
			return true;			
		},		
		name:'Map "' + name + '"',
		description:'You need to be in the map "' + name + '".',
	}
}

//#########

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
	var sort = {}; sort[category] = Db.highscore[category].order === 'ascending' ? 1 : -1;
	
	
	db.find('highscore',req,proj).limit(15).sort(sort,function(err,res){ if(err) throw err;
		var tmp = [];
		for(var i = 0; i < res.length; i++){
			tmp.push({
				rank:i+1,
				score:res[i][category],
				username:res[i].username
			});
		}
		cb(tmp);
		
	});	
	
	//ts("Quest.highscore.fetch(key,'Qbtt-time')")
}

Quest.highscore.fetchRank = function(key,category,cb){
	var score = Quest.highscore.getHighscoreFromId(key,category);
	var tmp = {};
	if(Db.highscore[category].order === 'ascending') tmp[category] = {$lt: score || CST.bigInt,$ne:null};
	else tmp[category] = {$gt: score || 0,$ne:null};
	
	db.count('highscore',tmp,function(err,result){	
		cb({
			rank:result.n+1,		//+1 cuz gt instead of gte
			username:List.main[key].username,
			score:score,
			category:category,
		});
	});
}
Quest.highscore.getHighscoreFromId = function(key,category){
	return List.main[key].quest[Quest.highscore.getQuest(category)]._highscore[Quest.highscore.getCategory(category)];
}

Quest.highscore.getQuest = function(str){
	return str.split('-')[0];
}

Quest.highscore.getCategory = function(str){
	return str.split('-')[1];
}

Quest.getQuestActive = function(key,func,toreturnifnone){
	if(!List.main[key].questActive) return toreturnifnone || null;
	if(!func) return true;
	return func(List.main[key].quest[List.main[key].questActive],List.main[key].questActive);
}

