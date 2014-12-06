//11/28/2014 3:06 PM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/

'use strict';
var s = loadAPI('v1.0','QlureKill',{
	name:"Lure & Kill",
	author:"",
	scoreModInfo:"Depends on amount of kills. [Only for Infinite Challenge]."
});
var m = s.map; var b = s.boss;

/* COMMENT:
Enter zone.
3 near invincible monsters spawn, need to lure in pit to turn them vulnerable
when monster dies, another spawn.
need to kill 100
*/

s.newVariable({
	killCount:0,
	enemyStart:3,
	enemyToKill:15
});

s.newHighscore('killCount',"Most Kills","Most kills without dying. Use Challenge Infinite",'descending',function(key){
	return s.get(key,'killCount');
});
s.newHighscore('timeEasy',"Fastest Time [Easy]","Kill all monsters and finish quest.",'ascending',function(key){
	if(s.isChallengeActive(key,'insane')) return null;
	return s.get(key,'chrono')*40;
});
s.newHighscore('timeHard',"Fastest Time [Insane]","Kill all monsters and finish quest with Challenge Insanity on.",'ascending',function(key){
	if(!s.isChallengeActive(key,'insane')) return null;
	return s.get(key,'chrono')*40;
});

s.newChallenge('insane',"Insanity!","Fight against 10 enemies at once. Need to kill 50.",2,function(key){
	
});
s.newChallenge('infinite',"Infinite","Fight until you die for highscore. Challenge and quest successful if killed 50 or more.",2,function(key){
	
});
s.newChallenge('speedrun',"Speedrunner","Complete the quest in less than 3 minutes.",2,function(key){
	return s.get(key,'chrono') < 3*60*25;
});

s.newEvent('_start',function(key){ //
	if(s.isAtSpot(key,'QfirstTown-north','t7',200))
		s.callEvent('startGame',key);
});
s.newEvent('_testSignIn',function(key){ //
	s.teleport.test(key,1232,1232,'QfirstTown-north');
});
s.newEvent('_getScoreMod',function(key){ //
	if(!s.isChallengeActive(key,'infinite')) return 1;
	return Math.pow(s.get('key','killCount')/50,1.5);
});
s.newEvent('_hint',function(key){ //
	return 'Killcount: ' + s.get(key,'killCount') + '/' + s.get(key,'enemyToKill') + ' | Red zone weaken monsters and yourself!';
});
s.newEvent('_signIn',function(key){ //
	s.failQuest(key);
});
s.newEvent('_death',function(key){ //
	if(s.get(key,'killCount') >= s.get(key,'enemyToKill')) s.completeQuest(key);	//incase doing challenge
	else s.failQuest(key);
});
s.newEvent('_abandon',function(key){ //
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-north','t7','main',false);
});
s.newEvent('_complete',function(key){ //
	s.set(key,'chrono',s.stopChrono(key,'timer'));
	s.callEvent('_abandon',key);
});
s.newEvent('startGame',function(key){ //teleport and spawn enemy
	if(!s.startQuest(key)) return;
	var chronoVisible = !!s.isChallengeActive(key,'speedrun');
	s.startChrono(key,'timer',chronoVisible);
	s.teleport(key,'main','t1','solo',true);
	s.setRespawn(key,'QfirstTown-north','t7');
	s.message(key,'The strange shape on the ground weakens enemies.');
	s.message(key,'Kill ' + s.get(key,'enemyToKill') + ' enemies to complete the quest.');
	
	if(s.isChallengeActive(key,'insane')){
		s.set(key,'enemyStart',10);
		s.set(key,'enemyToKill',50);
	}
	if(s.isChallengeActive(key,'infinite')){
		s.set(key,'enemyToKill',50);
	}
	
	var amount = s.get(key,'enemyStart');
	for(var i = 0; i < amount; i++){
		s.callEvent('spawnEnemy',key);
	}
});
s.newEvent('spawnEnemy',function(key){ //
	var spot = ['e1','e2','e3','e4','e5','e6','e7','e8'].random();
	var monster = ['plant','bat','bee','mushroom','skeleton','ghost','taurus','mummy'].random();
	s.spawnActor(key,'main',spot,monster,{
		hp:5000,
		globalDmg:0.5,
		deathEvent:'killEnemy',
	});
});
s.newEvent('killEnemy',function(key,e){ //
	var killCount = s.add(key,'killCount',1);	//increase kill count	
	if(s.isChallengeActive(key,'infinite')){
		s.callEvent('spawnEnemy',key);		//when enemy dies, it spawns a new one
		if(killCount > 8 && Math.sqrt(killCount) % 1 === 0)
			s.callEvent('spawnEnemy',key);	//spawn another one
	} else {
		if(killCount >= s.get(key,'enemyToKill')) 
			return s.completeQuest(key); 
		s.callEvent('spawnEnemy',key);		//when enemy dies, it spawns a new one
	}
});
s.newEvent('weakenActor',function(key){ //weaken enemy on red zone, check map loop, last 10 sec
	s.addBoost(key,'globalDef',0.07,25*10);
	s.addAnimOnTop(key,'boostPink');
});

s.newMap('main',{
	name:"Fight Cave",
	lvl:0,
	grid:["22222222222222222222200000000100000000000100000000","22222222222222222222220000000110000000001100000000","22111222222222222222201100000011111111111000000000","22211222222222222222001100011001111111110001111110","22222222200000000000000000011000011000000011111111","22222220000000000011000000001000011000001111111111","22222000000000000000000000000000000000000001111110","22200000011111111111111111111111111111111100000000","22000000111111111111111111111111111111111110000000","20000000100001111001111111111111111111111111011000","00000000100001111011111111111111111111111111000011","01111110100000111010000000000000000000001111000111","11111111100000011010000000000000000000001111001100","11111111101111000010000000000000000000000111011000","01111110101111110110000000000000000000000011011000","00000000100000001100000000000000000000000011011000","00000110101111111000000000000000000000000011011000","00000110111111110000000000000000000000000011011000","11100000110000000000000000000000000000000011011000","11110000110000000000000000000000000000000011011000","00011000110000000000000000000000000000000011011100","00001100110000000000000000000000000000000011011110","00001100110000000000000000000000000000000011001111","00001100110000000000000000000000000000000011000111","00001100110000000000000000000000000000000011000011","00001100110000000000000000000000000000000011111101","00001100110000000000000000000000000000000011111100","00001100110000000000000000000000000000000011011100","00001100110000000000000000000000000000000011001100","00001100110000000000000000000000000000000011000000","00001111110000000000000000000000000000000011000000","00001100110000000000000000000000000000000011000000","00001100110000000000000000000000000000000011000000","00001100011111111100000000000011111111111110000000","00001100001111111110000000000111111111111111110000","00001100000000011111000000001100000000000011110000","00000111111100011111100000011011000000000000000000","00000011111110001111100000011011011111111111110000","00000000000011000001100000011000100000000000001000","00000000000001100001100000011000100000000000001000","00000000000011100001100000011000100000000000011000","00000000000111100001100000011000110000111111111000","11111111111111000001100000011000011001111111110000","11111111111110000001100000011011111111000000000000","11111111111111111101100000011011110110000000000000","11111111111111111111100000011001110000001111110000","00000000000111111110111111110000110000011111111000","00000000000011111100011111100000000000011111111000","00000000000000000000000000000000000000001111110000","00000000000000000000000000000000000000000000000000"],
	tileset:'v1.2'
},{
	spot:{e2:{x:816,y:432},e1:{x:1104,y:496},e3:{x:592,y:624},b3:{x:864,y:608,width:192,height:192},e7:{x:400,y:656},e4:{x:656,y:784},e6:{x:1168,y:784},e5:{x:912,y:912},e8:{x:464,y:944},t1:{x:752,y:1424}},
	load:function(spot){
		
	},
	loop:function(spot){
		//weak actor that are in red zone. test every 10 frames
		m.forEachActor(spot,10,'weakenActor','actor',spot.b3);
	}
});
s.newMapAddon('QfirstTown-north',{
	spot:{g1:{x:1856,y:1664},t3:{x:1728,y:48},s4:{x:1120,y:208},t8:{x:880,y:208},t4:{x:3152,y:432},s5:{x:3104,y:848},s3:{x:2144,y:944},s6:{x:992,y:1264},e2:{x:1936,y:1200},t7:{x:1232,y:1232},t2:{x:48,y:1264},b1:{x:0,y:0},t5:{x:3152,y:1792},e1:{x:1584,y:1936},s8:{x:1216,y:2032},s2:{x:1824,y:2256},s1:{x:2304,y:2288},a:{x:2768,y:2448},t6:{x:3152,y:2448},e3:{x:2416,y:2512},s7:{x:2912,y:2864},t1:{x:1280,y:3152}},
	load:function(spot){
		m.spawnTeleporter(spot.t7,'startGame','cave');
		
		m.spawnActorGroup(spot.e1,[
			m.spawnActorGroup.list("taurus",1),
			m.spawnActorGroup.list("mummy",1),
		]);
		m.spawnActorGroup(spot.e2,[
			m.spawnActorGroup.list("bird",1),
			m.spawnActorGroup.list("dragon",1),
		]);
		m.spawnActorGroup(spot.e3,[
			m.spawnActorGroup.list("salamander",1),
			m.spawnActorGroup.list("larva",1),
		]);
	}
});

s.exports(exports);
