eval(loadDependency(["Quest","Actor","Main"]));
//11/27/2014 11:14 AM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*//*global True, False, loadAPI*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/

var s = loadAPI('v1.0','Qhighscore',{
	name:'Global Highscore',
	author:'',
	showInTab:false,
	dailyTask:false,
	globalHighscore:true,
});
var m = s.map; var b = s.boss;

/* COMMENT:

*/

s.newVariable({
});

s.newHighscore('questCount',"Quest Count","Most Quests Completed",'descending',function(key){
	var mq = Main.get(key).quest;
	var sum = 0;
	for(var i in mq)
		if(mq[i]._complete) sum++;
	
	return sum;
});
s.newHighscore('challengeCount',"Challenge Count","Most Challenges Completed",'descending',function(key){
	var mq = Main.get(key).quest;
	var sum = 0;
	for(var i in mq){
		for(var j in mq[i]._challengeDone)
			sum += mq[i]._challengeDone[j] || 0;
	}
	
	return sum;
});
s.newHighscore('reputationCount',"Reputation Count","Most Reputation Points",'descending',function(key){
	return s.getReputationPt(key).r(2);
});
s.newHighscore('questScoreSum',"Sum Quest Score","Sum of All Quest Scores",'descending',function(key){
	var mq = Main.get(key).quest;
	var sum = 0;
	for(var i in mq)
		sum += mq[i]._rewardScore || 0;
		
	return sum;
});

s.exports(exports);