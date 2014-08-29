/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
"use strict";
var s = require('./../Quest_exports').init('v1.0','Qbtt000',{
	name:"Break Targets",
	reward:{exp:0.2,item:0.2,passive:{min:1,max:2,mod:10}},
	scoreModInfo:'Depends on your time.',
});
var q = s.quest; var m = s.map; var b = s.boss;

var TARGETAMOUNT = 10;

s.newChallenge('speedrun','Speedrun','Get below 8 seconds.',null,function(key){
	return s.get(key,'chrono') < 25*8;
});

s.newChallenge('fireonly','Fire Only','Get below 15 seconds only using the fire attack.',null,function(key){
	return s.get(key,'chrono') < 25*15;
});

s.newChallenge('fivetimes','5 Times!','Get below 10 seconds five times in a row.',null,null);

s.newHighscore('speedrun','Fastest Time','Fastest Time','ascending',function(key){
	return s.get(key,'chrono')*40;		//record = 6 sec
});

s.newHighscore('fireonly','Fire Only','Fastest Time with the Challenge Fire Only active.','ascending',function(key){
	if(s.getChallenge(key,'fireonly')) return s.get(key,'chrono')*40;		//record = 11.160
	return null;
});

s.newVariable({
	killTarget:0,	//target killed
	chrono:0,			
	lastReset:0,	//time when performed reset (prevent spam)
	amountComplete:0,
	chalTimes:0,	//for challenge fivetimes
});

s.newPreset('target',['simple','boomerang','5ways','','reset','fastmove']);
s.newPreset('fireonly',['5ways','','','','reset','']);

s.newEvent('_start',function(key){
	if(s.isAtSpot(key,'QfirstTown-east','t6',200))
		s.event('startGame',key);
});
s.newEvent('_testSignIn',function(key){
	s.teleport(key,'QfirstTown-east','t6','main');
});
s.newEvent('_hint',function(key){
	if(!s.get(key,'_active')) return 'Go south east side of Eastern Valley.';
	return "Kill all 10 targets.<br>[$4] = Restart.";
});
s.newEvent('_death',function(key){
	s.abandonQuest(key);
});
s.newEvent('_signIn',function(key){	s.abandonQuest(key);});
s.newEvent('_getScoreMod',function(key){
	if(s.get(key,'time') < 6000) return 6;
	if(s.get(key,'time') < 8000) return 4;
	if(s.get(key,'time') < 10000) return 2;
	return 1;
});
s.newEvent('_abandon',function(key){
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-east','t6','main',false);
});
s.newEvent('_complete',function(key){
	s.event('_abandon',key);
});
s.newEvent('startGame',function(key){
	if(!s.startQuest(key)) return;
	s.chat(key,"Break all 10 targets.");
	s.chat(key,"Press [$4] to restart the quest quickly.");
	if(s.getChallenge(key,'fireonly')) s.usePreset(key,'fireonly');
	else s.usePreset(key,'target');
	s.event('teleportCourse',key);
});
s.newEvent('teleportCourse',function(key){
	s.teleport(key,'main','t1','solo',true);
	s.chrono(key,'timer','remove');
	s.rechargeAbility(key);
	s.freeze(key,40,s.event('startCourse'));
});
s.newEvent('startCourse',function(key){
	s.chat(key,"GO!");
	s.chrono(key,'timer','start');
});
s.newEvent('killTarget',function(key){
	s.add(key,'killTarget',1);
	if(s.get(key,'killTarget') >= TARGETAMOUNT){
		s.event('endCourse',key);
	}
});
s.newEvent('endCourse',function(key){
	var time = s.chrono(key,'timer','stop');
	s.set(key,'chrono',time);
	s.chat(key,'Your time: ' + time.frameToChrono());
	if(!s.getChallenge(key,'fivetimes')) return s.completeQuest(key);
	
	//else
	if(time < 25*10) s.add(key,'chalTimes',1);
	else {
		s.set(key,'chalTimes',0);
		s.chat(key,'Your time was slower than 10 seconds... Your count has been reset.');
	}
	s.chat(key,'Challenge 5 Times: ' + s.get(key,'chalTimes') + '/5');
	if(s.get(key,'chalTimes') >= 5)	return s.completeQuest(key);
	else s.event('resetCourse',key);
});
s.newEvent('resetCourse',function(key){
	if(Date.now() - s.get(key,'lastReset') < 2000) return;	//prevent player to restart too fast
	s.set(key,'lastReset',Date.now())
	s.set(key,'killTarget',0);
	s.event('teleportCourse',key);
});
s.newEvent('abilityReset',function(key){
	if(s.getChallenge(key,'fivetimes')){
		s.set(key,'chalTimes',0);
		s.chat(key,'Challenge 5 Times: ' + s.get(key,'chalTimes') + '/5');
	}
	s.event('resetCourse',key);
});

s.newAbility('simple','rangeBullet',{
	periodOwn:15
},{
	objSprite:s.newAbility.sprite('rock',0.5),
});
s.newAbility('boomerang','boomerang',{
	periodOwn:25,periodGlobal:15,
},{
	boomerang:s.newAbility.boomerang(1,1,0.2,1),
	ghost:1
});
s.newAbility('5ways','fireBullet',{
	periodOwn:100,periodGlobal:15,
},{
	angle:360,amount:5,ghost:1
});
s.newAbility.event('reset',s.event('abilityReset'));
s.newAbility('fastmove','start-dodge',{},{});

s.newMap('main',{
	name:"Practice Field",
	tileset:"v1.2",
	grid:["000000000000000000000000000001100000000000000","000000011110000000000000000001100000000000000","000000011110000000000000000000000000000000000","000000011110111111111111111111111111111110000","000000000001111111111111111111111111111111000","000000000011111111111111111111111100000001000","000000000011111111111111111111111110000001000","000000000011000000000000000000000010111101000","000111100011000000000000000000000010111101000","000111100111000000000000000000000010111101000","000111101111000000000000000000000010001101000","000000011110000110000000011100000011001101000","000000110100000110000000111100000001100001000","000001100100000011000000111111110000111101000","011011000100000011111000111111110000011111000","011010000100000001111000111111110000000011000","000010000100000001111000111111100000000011000","000011111100000001110000111100000000000011000","000011111100000000000000111100000110000011000","000011111100000000000000000000000110000011000","000010001100000000000000000000000110000011000","000010011000000001110000000000000110000011000","000010110000000011110000000000000011000011000","000011100000000011110000000000000011000011000","000011000000000011110000000000000011000011000","000011000000011111110000000000000011000011000","000011000000111111110000000000000000000011000","000011000000111111111111110001110000000011000","000011000000111111111111110011110000000011000","000011000000000000001111110011110000000011000","000011000000000000001111110011100000000011000","000011000000000000000000000000000000000011000","000011000000000000000000000000000000000011000","000011000000000000000000000000000000000011000","000001111111111111110000000000011111111110000","011110111111111111111000000000111111111101111","011110000000000000001111111111101111000001111","011110000000011110000111111111001111000001111","000000000000011110000000000000000000000000000","000000000000011110000000000000000000000000000"],
	lvl:0,
},{
	spot:{"e4":{"x":592,"y":368},"e6":{"x":944,"y":368},"e3":{"x":464,"y":496},"e7":{"x":1104,"y":496},"eb":{"x":688,"y":624},"e5":{"x":976,"y":624},"e8":{"x":1200,"y":720},"e2":{"x":464,"y":752},"t1":{"x":848,"y":752},"ea":{"x":1136,"y":1008},"e1":{"x":496,"y":1040}},
	load:function(spot){
		var list = ['e1','e2','e3','e4','e5','e6','e7','e8','ea','eb'];
		for(var i = 0 ; i < list.length; i++)
			m.spawnActor(spot[list[i]],"target",{deathEvent:s.event('killTarget')});
	},
});

s.newMapAddon('QfirstTown-east',{
	spot:{"t6":{"x":90*32,"y":48*32}},
	load:function(spot){
		m.spawnTeleport(spot.t6,s.event('startGame'),'zone','down');
	},
});


s.exports(exports);

