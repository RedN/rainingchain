/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
"use strict";
var s = require('./../Quest_exports').init('v1.0','QlureKill',{
	name:"Lure & Kill",
	scoreModInfo:'Depends on amount of kills. [Only for Infinite Challenge].',
});
var q = s.quest; var m = s.map; var b = s.boss;

//improve: boss at end
/* STEPS TO COMPLETE QUEST
	Enter zone.
	3 near invincible monsters spawn, need to lure in pit to turn them vulnerable
	when monster dies, another spawn.
	need to kill 100

*/

var RESPAWNSPOT = ['e1','e2','e3','e4','e5','e6','e7','e8'];
var MONSTERLIST = ['plant','bat','bee','mushroom','skeleton','ghost','taurus','mummy'];

s.newVariable({
	killCount:0,	//amount monster killed
	inZone:false,	//if player walked away from entrance (used for block entrance)
	enemyStart:3,	//amount enemy at beginning
	enemyToKill:15,	//amount to kill to complete quest
});

s.newHighscore('killCount','Most Kills','Most kills without dying. Use Challenge Infinite','descending',function(key){
	return s.get(key,'killCount');	
});
s.newHighscore('timeEasy','Fastest Time [Easy]','Kill all monsters and finish quest.','ascending',function(key){
	if(s.getChallenge(key,'insane')) return null;
	return s.get(key,'chrono')*40;	
});
s.newHighscore('timeHard','Fastest Time [Insane]','Kill all monsters and finish quest with Challenge "Insanity" on.','ascending',function(key){
	if(!s.getChallenge(key,'insane')) return null;
	return s.get(key,'chrono')*40;	
});

s.newChallenge('insane','Insanity!','Fight against 10 enemies at once. Need to kill 50.',function(key,qid){
	s.set(key,'enemyStart',10);
	s.set(key,'enemyToKill',50);
},null,4);
s.newChallenge('infinite','Infinite','Fight until you die for highscore. Challenge and quest successful if killed 50 or more.',function(key,qid){
	s.set(key,'enemyToKill',50);
},null,2);
s.newChallenge('speedrun','Speedrunner','Complete the quest in less than 3 minutes.',null,function(key){
	return s.chrono(key,'timer','stop') < 3*60*25;
},2);

s.newEvent('_start',function(key){
	if(s.isAtSpot(key,'QfirstTown-north','t7',200))
		s.event('startGame',key);
});
s.newEvent('_testSignIn',function(key){
	s.teleport.test(key,1232,1232,'QfirstTown-north');
});
s.newEvent('_getScoreMod',function(key){
	if(!s.getChallenge(key,'infinite')) return 1;
	return Math.pow(s.get('key','killCount')/50,1.5);
});
s.newEvent('_hint',function(key){
	return 'Killcount: ' + s.get(key,'killCount') + '/' + s.get(key,'enemyToKill') + ' | Red zone weaken monsters and yourself!';
});
s.newEvent('_signIn',function(key){
	s.abandonQuest(key);
});
s.newEvent('_death',function(key){
	if(s.get(key,'killCount') >= 50) s.completeQuest(key);	//incase doing challenge
	else s.abandonQuest(key);
});
s.newEvent('_abandon',function(key){
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-north','t7','main',false);
});
s.newEvent('_complete',function(key){
	s.set(key,'chrono',s.chrono(key,'timer','stop'));
	s.event('_abandon',key);
});
s.newEvent('startGame',function(key){	//teleport and spawn enemy
	if(!s.startQuest(key)) return;
	var chronoVisible = !!s.getChallenge(key,'speedrun');
	s.chrono(key,'timer','start',chronoVisible);
	s.teleport(key,'main','t1','solo',true);
	s.setRespawn(key,'QfirstTown-north','t7');
	s.chat(key,'The strange shape on the ground weakens enemies.');
	s.chat(key,'Kill ' + s.get(key,'enemyToKill') + ' enemies to complete the quest.');
	var amount = s.get(key,'enemyStart');
	for(var i = 0; i < amount; i++){
		s.event('spawnEnemy',key);
	}
});
s.newEvent('spawnEnemy',function(key){
	s.spawnActor(key,'main',RESPAWNSPOT.random(),MONSTERLIST.random(),{
		hp:5000,
		globalDmg:0.5,
		deathEvent:s.event('killEnemy'),
	});
});
s.newEvent('killEnemy',function(key,e){
	var killCount = s.get(key,'killCount') + 1;	//increase kill count
	s.set(key,'killCount',killCount);
	
	if(killCount >= s.get(key,'enemyToKill') && !s.getChallenge(key,'infinite')) return s.completeQuest(key); 
	
	s.event('spawnEnemy',key);		//when enemy dies, it spawns a new one
	if(s.getChallenge(key,'infinite')){		//if challenge infinite, might spawn 2 so it becomes harder
		if(killCount > 8 && Math.sqrt(killCount) % 1 === 0){
			s.event('spawnEnemy',key);
		}
	}
});
s.newEvent('turnVulnerable',function(key){	//weaken enemy on red zone, check map loop
	s.boost(key,'turnVulnerable','globalDef',0.07,25*10);
	s.addAnim.onTop(key,'boostPink');
});

s.newMap('main',{
	name:"Fight Cave",
	tileset:"v1.2",
	grid:["22222222222222222222200000000100000000000100000000","22222222222222222222220000000110000000001100000000","22111222222222222222201100000011111111111000000000","22211222222222222222001100011001111111110001111110","22222222200000000000000000011000011000000011111111","22222220000000000011000000001000011000001111111111","22222000000000000000000000000000000000000001111110","22200000011111111111111111111111111111111100000000","22000000111111111111111111111111111111111110000000","20000000100001111001111111111111111111111111011000","00000000100001111011111111111111111111111111000011","01111110100000111010000000000000000000001111000111","11111111100000011010000000000000000000001111001100","11111111101111000010000000000000000000000111011000","01111110101111110110000000000000000000000011011000","00000000100000001100000000000000000000000011011000","00000110101111111000000000000000000000000011011000","00000110111111110000000000000000000000000011011000","11100000110000000000000000000000000000000011011000","11110000110000000000000000000000000000000011011000","00011000110000000000000000000000000000000011011100","00001100110000000000000000000000000000000011011110","00001100110000000000000000000000000000000011001111","00001100110000000000000000000000000000000011000111","00001100110000000000000000000000000000000011000011","00001100110000000000000000000000000000000011111101","00001100110000000000000000000000000000000011111100","00001100110000000000000000000000000000000011011100","00001100110000000000000000000000000000000011001100","00001100110000000000000000000000000000000011000000","00001111110000000000000000000000000000000011000000","00001100110000000000000000000000000000000011000000","00001100110000000000000000000000000000000011000000","00001100011111111100000000000011111111111110000000","00001100001111111110000000000111111111111111110000","00001100000000011111000000001100000000000011110000","00000111111100011111100000011011000000000000000000","00000011111110001111100000011011011111111111110000","00000000000011000001100000011000100000000000001000","00000000000001100001100000011000100000000000001000","00000000000011100001100000011000100000000000011000","00000000000111100001100000011000110000111111111000","11111111111111000001100000011000011001111111110000","11111111111110000001100000011011111111000000000000","11111111111111111101100000011011110110000000000000","11111111111111111111100000011001110000001111110000","00000000000111111110111111110000110000011111111000","00000000000011111100011111100000000000011111111000","00000000000000000000000000000000000000001111110000","00000000000000000000000000000000000000000000000000"],
	lvl:0,
},{
	spot:{"e2":{"x":816,"y":432},"e1":{"x":1104,"y":496},"e3":{"x":592,"y":624},"b3":[864,1024,608,768],"e7":{"x":400,"y":656},"e4":{"x":656,"y":784},"e6":{"x":1168,"y":784},"e5":{"x":912,"y":912},"e8":{"x":464,"y":944},"b2":[576,928,928,1120],"b1":[672,832,1280,1280],"t1":{"x":768,"y":1424}},
	loop:function(spot){
		var list = m.collision.actor(spot.b3,10);	//weak actor that are in red zone. test every 10 frames
		for(var i =0; i < list.length;i++)
			s.event('turnVulnerable',list[i]);
	},
});

s.newMapAddon('QfirstTown-north',{
	spot:{"g1":{"x":58*32,"y":52*32},"t3":{"x":1728,"y":48},"s4":{"x":1120,"y":208},"t8":{"x":880,"y":208},"t4":{"x":3152,"y":432},"s5":{"x":3104,"y":848},"s3":{"x":2144,"y":944},"s6":{"x":992,"y":1264},"e2":{"x":1936,"y":1200},"t7":{"x":1232,"y":1232},"t2":{"x":48,"y":1264},"b1":[2592,2688,1632,1632],"t5":{"x":3152,"y":1792},"e1":{"x":1584,"y":1936},"s8":{"x":1216,"y":2032},"s2":{"x":1824,"y":2256},"s1":{"x":2304,"y":2288},"a":{"x":2768,"y":2448},"t6":{"x":3152,"y":2448},"e3":{"x":2416,"y":2512},"s7":{"x":2912,"y":2864},"t1":{"x":1280,"y":3152}},
	load:function(spot){
		m.spawnTeleport(spot.t7,s.event('startGame'),'cave');
		
		m.spawnActorGroup(spot.e1,25*15,[
			["taurus",1],
			["mummy",1]
		]);
		m.spawnActorGroup(spot.e2,25*15,[
			["bird",1],
			["dragon",1]
		]);
		m.spawnActorGroup(spot.e3,25*15,[
			["salamander",1],
			["larva",2]
		]);
	},
});

s.exports(exports);





