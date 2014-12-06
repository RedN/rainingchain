eval(loadDependency(["Main"]));
//11/26/2014 7:46 PM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*//*global True, False, loadAPI*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
var s = loadAPI('v1.0','Qcontribution',{
	name:'Contribution',
	author:'',
	showIntab:false,
	dailyTask:false
});
var m = s.map; var b = s.boss;

/* COMMENT:

*/

s.newVariable({
});

s.newHighscore('overall','Overall','Sum of all CP.','descending',function(key){
	return Main.get(key).contribution.point.sum;
});
s.newHighscore('twitter','Twitter','Most Twitter CP. Get CP by tweeting #rainingchain.','descending',function(key){
	return Main.get(key).contribution.point.twitter.point;
});
s.newHighscore('reddit','Reddit','Most Reddit CP. Get CP by posting on <a href="http://www.reddit.com/r/rainingchain" target="_blank">www.reddit.com/r/rainingchain</a>','descending',function(key){
	return Main.get(key).contribution.point.reddit.point;
});
s.newHighscore('twitch','Twitch','Most Twitch CP. Get CP by streaming under the game <a href="http://www.twitch.tv/directory/game/Raining%20Chain" target="_blank" title="Your stream should appear in this list.">"Raining Chain"</a>.','descending',function(key){
	return Main.get(key).contribution.point.twitch.point;
});
s.newHighscore('youtube','Youtube','Most Youtube CP. Get CP by posting a video on Youtube with "Raining Chain" in the title.','descending',function(key){
	return Main.get(key).contribution.point.youtube.point;
});












s.exports(exports);