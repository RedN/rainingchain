eval(loadDependency(['Quest','List','Actor'],[]));
var s = require('./../Quest_exports').init('v1.0','Qhighscore',{
	name:'Global Highscore',
	showInTab:false,
	dailyTask:false,
});
var q = s.quest; var m = s.map; var b = s.boss;

s.newHighscore('questCount','Quest Count','Most Quests Completed','descending',function(key){
	var mq = List.main[key].quest;
	var sum = 0;
	for(var i in mq)
		if(mq[i]._complete) sum++;
	
	return sum;
});

s.newHighscore('challengeCount','Challenge Count','Most Challenges Completed','descending',function(key){
	var mq = List.main[key].quest;
	var sum = 0;
	for(var i in mq){
		for(var j in mq[i]._challengeDone)
			sum += mq[i]._challengeDone[j] || 0;
	}
	
	return sum;
});

s.newHighscore('passiveCount','Passive Count','Most Passive Points','descending',function(key){
	return s.getPassivePt(key).r(2);
});

s.newHighscore('questScoreSum','Sum Quest Score','Sum of All Quest Scores','descending',function(key){
	var mq = List.main[key].quest;
	var sum = 0;
	for(var i in mq)
		sum += mq[i]._rewardScore || 0;
		
	return sum;
});

s.newHighscore('overallLvl','Overall Lvl','Overall Level','descending',function(key){
	var sum = 0;
	for(var i in List.all[key].skill.lvl)
		sum += List.all[key].skill.lvl[i];
	return sum;
});

for(var i in CST.skill){
	var skill = CST.skill[i];
	s.newHighscore(skill + 'Exp',skill.capitalize() + ' Exp','Most ' + skill.capitalize() + ' Exp','descending',
		function(sk){
			return function(key){
				return List.all[key].skill.exp[sk];
			}
		}(skill));
}


s.exports(exports);
