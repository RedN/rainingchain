/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
"use strict";
var s = require('./../Quest_exports').init('v1.0','QbulletHeaven',{
	name:"Bullet Heaven",
});
var q = s.quest; var m = s.map; var b = s.boss;

/* STEPS TO COMPLETE QUEST
	enter map, towers keep spawning
	survive long enough and win.
	kill blue towers to make it easier
*/

var SPOT = ['e1','e2','e3','e4','e5','e6','e7','e8','ea'];	//list of spot where towers can spawn	
var TOWER = {dart:3,fire:2,ice:1,nova:1};	//list of tower that can be spawned (number used to impact chance)

s.newVariable({
	time:0,					//time survived, set only at the end with the chrono.
	timeToSurvive:60*25,	//if survived less, quest failed
	survivedEnough:false,
	killTower:0,			//amount tower killed, used for highscore
});

s.newHighscore('killTower','Tower Killed','Most Towers Killed','descending',function(key){
	return s.get(key,'killTower');	
});
s.newHighscore('timer','Longest Time','Longest Time Surviving','descending',function(key){
	return s.get(key,'time')*40;
});

s.newChallenge('killTower','Tower Killer','Kill 50 Towers and finish the quest.',null,null);
s.newChallenge('infinite','Infinite','Last at least 2 minutes to win.',function(key){
	s.set(key,'timeToSurvive',120*25);
},null);
s.newChallenge('powerless','Powerless','You can\'t kill Towers.',function(key){
	s.boost(key,'powerless','globalDmg',0);
},null);

s.newEvent('_start',function(key){
	if(s.isAtSpot(key,'QfirstTown-east','a',200))
		s.event('startGame',key);
});
s.newEvent('_testSignIn',function(key){
	//s.teleport.test(key,1632,48,'QfirstTown-eastCave');
	s.teleport.test(key,1648,208,'QfirstTown-east');
});
s.newEvent('_hint',function(key){
	return "Try to destroy the towers when they turn blue.";
});
s.newEvent('_death',function(key){
	s.set(key,'time',s.chrono(key,'time','stop'));	//used for highscore only
	
	if(s.get(key,'survivedEnough')){
		s.completeQuest(key);
	} else {
		s.chat(key,'You didn\'t survive long enough...');
		s.abandonQuest(key);
	}	
});
s.newEvent('_abandon',function(key){
	//s.teleport(key,'QfirstTown-eastCave','t5','main',false,'fight');
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-east','a','main',false);
});
s.newEvent('_complete',function(key){
	s.event('_abandon',key);
});
s.newEvent('_signIn',function(key){
	s.abandonQuest(key);
});
s.newEvent('startGame',function(key){	//teleport and start timer.
	if(!s.startQuest(key)) return;
	s.teleport(key,'fight','e5','solo',true);
	//s.setRespawn(key,'QfirstTown-eastCave','t5','main',true);
	s.setRespawn(key,'QfirstTown-east','a','main',true);
	
	if(!s.getChallenge(key,'killTower')){
		s.chat(key,'Try to survive for ' + s.get(key,'timeToSurvive').frameToChrono() + ' and you win!');
		s.chrono(key,'time','start');		
		s.setTimeout(key,'timeToSurvive',s.get(key,'timeToSurvive'),s.event('surviveLongEnough'));
	}
	s.boost(key,'helper','hp-regen',2);
});
s.newEvent('surviveLongEnough',function(key){
	s.chat(key,'You survived long enough! Dying now will complete the quest! But you can continue for the highscore.');
	s.set(key,'survivedEnough',true);
});
s.newEvent('spawnEnemy',function(key){	//spawn a random tower at a random spot. called via map loop
	var enemy = 'tower-' + TOWER.random();
	var spot = SPOT.random();
	s.spawnActorGroup(key,'fight',spot,false,[
		[enemy,1,{deathEvent:s.event('killTower')}]
	],{v:300});			//advanced: v:300 means that the enemy will spawn +- 300 px from the spot letter
});
s.newEvent('killTower',function(key){
	var amount = s.add(key,'killTower',1);	//used for highscore
	if(amount >= 50 && s.getChallenge(key,'killTower')) s.completeQuest(key);
});

s.newNpc("tower-fire",{
	name:"Tower",
	hp:1,
	sprite:s.newNpc.sprite("tower-red"),
	abilityList:[
		s.newNpc.abilityList(s.newAbility(null,'fireBullet',{},{
			angle:360,amount:4,maxTimer:25*20,aim:25,
			dmg:s.newAbility.dmg(150,'fire'),
		}),[1,1,1]),
	],
	modAmount:0,
	nevermove:1,
	boss:'tower',
	moveRange:s.newNpc.moveRange(5,5),
});
s.newNpc("tower-dart",{
	name:"Tower",
	hp:1,
	sprite:s.newNpc.sprite("tower-red"),
	abilityList:[
		s.newNpc.abilityList(s.newAbility(null,'lightningBullet',{},{
			aim:25,spd:20,maxTimer:25*20,
			dmg:s.newAbility.dmg(150,'lightning'),
		}),[1,1,1]),
	],
	modAmount:0,
	nevermove:1,
	boss:'tower',
	moveRange:s.newNpc.moveRange(5,5),
});
s.newNpc("tower-ice",{
	name:"Tower",
	hp:1,
	sprite:s.newNpc.sprite("tower-red"),
	abilityList:[
		s.newNpc.abilityList(s.newAbility(null,'coldBullet',{},{
			aim:25,spd:20,maxTimer:25*20,
			dmg:s.newAbility.dmg(1,'cold'),
			chill:s.newAbility.status(1,1,1),
		}),[1,1,1]),
	],
	modAmount:0,
	nevermove:1,
	boss:'tower',
	moveRange:s.newNpc.moveRange(5,5),
});
s.newNpc("tower-nova",{
	name:"Tower",
	hp:1,
	sprite:s.newNpc.sprite("tower-red"),
	abilityList:[
		s.newNpc.abilityList(s.newAbility(null,'fireNova',{},{
			dmg:s.newAbility.dmg(100,'fire'),
		}),[1,1,1]),
	],
	aim:25,
	modAmount:0,
	nevermove:1,
	boss:'tower',
	moveRange:s.newNpc.moveRange(5,5),
});

s.newBoss('tower',{},function(boss){
	s.newBoss.phase(boss,'intro',{
		transitionTest:function(boss){
			return 'invincible';
		},
	});
	
	s.newBoss.phase(boss,'invincible',{
		transitionTest:function(boss){
			if(b.get(boss,'_framePhase') > 25*10) return 'vulnerable';
		},
		transitionIn:function(boss){
			s.boost(boss,'boss','globalDef',1000000000,10*25);	//TOFIX weird, need to be 8 sec and not 10
			s.setSprite(boss,'tower-red');
		},
		transitionOut:function(boss){
			s.boost.remove(boss,'boss','globalDef');	//TOFIX weird, need to be 8 sec and not 10
			s.setSprite(boss,'tower-blue');		
		}
	});
	
	s.newBoss.phase(boss,'vulnerable',{
		transitionTest:function(boss){
			if(b.get(boss,'_framePhase') > 25*4) return 'invincible';
		}
	});	
});

s.newMap('fight',{
	name:"Bullet Heaven",
	graphic:"QcollectFight-fight",
	lvl:0,
},{
	spot:{"e1":{"x":496,"y":432},"e2":{"x":848,"y":432},"e3":{"x":1168,"y":432},"e4":{"x":496,"y":816},"e5":{"x":848,"y":816},"e6":{"x":1168,"y":816},"e7":{"x":496,"y":1136},"e8":{"x":848,"y":1136},"ea":{"x":1168,"y":1136}},
	loop:function(spot){
		if(!s.interval(100)) return;	//every 4 sec
		
		var key = m.getPlayerInMap(spot)[0];
		if(!key) return;			//check if at least 1 player, note:in theory, loop not called if nobody in map
		s.event('spawnEnemy',key);	//if so, spawn 2 towers
		s.event('spawnEnemy',key);
	},
});
s.newMapAddon('QfirstTown-east',{
	spot:{"a":{"x":1648,"y":208}},
	load:function(spot){
		m.spawnTeleport(spot.a,s.event('startGame'),'cave');	//add telezone so player can start the quest
	},
});

s.exports(exports);





