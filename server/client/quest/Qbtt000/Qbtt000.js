//11/26/2014 6:34 PM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*//*global True, False, loadAPI*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
'use strict';
var s = loadAPI('v1.0','Qbtt000',{
	name:'Break Targets',
	author:'',
	reward:{"exp":0.2,"item":0.2,"reputation":{"min":1,"max":2,"mod":10}}
});
var m = s.map; var b = s.boss;

/* COMMENT:

*/

s.newVariable({
	killTarget:0,
	chrono:0,
	lastReset:0,
	countComplete:0,
	chalTimes:0
});

s.newHighscore('speedrun','Fastest Time','Fastest Time','ascending',function(key){
	return s.get(key,'chrono')*40;		//record = 6 sec
});
s.newHighscore('fireonly','Fire Only','Fastest Time with the Challenge Fire Only active.','ascending',function(key){
	if(s.isChallengeActive(key,'fireonly')) return s.get(key,'chrono')*40;		//record = 11.160
	return null;
});

s.newChallenge('speedrun','Speedrun','Get below 8 seconds.',2,function(key){
	return s.get(key,'chrono') < 25*8;
});
s.newChallenge('fireonly','Fire Only','Get below 15 seconds only using the fire attack.',2,function(key){
	return s.get(key,'chrono') < 25*15;
});
s.newChallenge('fivetimes','5 Times!','Get below 10 seconds five times in a row.',2,function(key){
	
});

s.newEvent('_start',function(key){	//
	if(s.isAtSpot(key,'QfirstTown-east','t6',200))
		s.callEvent('startGame',key);
});
s.newEvent('_debugSignIn',function(key){	//
	s.teleport(key,'QfirstTown-east','t6','main');
});
s.newEvent('_hint',function(key){	//
	return "Kill all 10 targets.<br>[$4] = Restart.";
});
s.newEvent('_death',function(key){	//
	s.failQuest(key);
});
s.newEvent('_signIn',function(key){	//
	s.failQuest(key);
});
s.newEvent('_getScoreMod',function(key){	//
	if(s.get(key,'chrono') < 6*25) return 6;
	if(s.get(key,'chrono') < 8*25) return 4;
	if(s.get(key,'chrono') < 10*25) return 2;
	return 1;
});
s.newEvent('_abandon',function(key){	//
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-east','t6','main',false);
});
s.newEvent('_complete',function(key){	//
	s.callEvent('_abandon',key);
});
s.newEvent('startGame',function(key){	//
	if(!s.startQuest(key)) return;
	s.message(key,"Break all 10 targets.");
	s.message(key,"Press [$4] to restart the quest quickly.");
	if(s.isChallengeActive(key,'fireonly')) 
		s.usePreset(key,'fireonly');
	else s.usePreset(key,'target');
	s.callEvent('teleportCourse',key);
});
s.newEvent('teleportCourse',function(key){	//
	s.teleport(key,'main','t1','solo',true);
	s.removeChrono(key,'timer');
	s.rechargeAbility(key);
	s.enableMove(key,false);
	s.enableAttack(key,false);
	s.setTimeout(key,'startCourse',40);
});
s.newEvent('startCourse',function(key){	//
	s.message(key,"GO!");
	s.startChrono(key,'timer');
	s.enableMove(key,true);
	s.enableAttack(key,true);
});
s.newEvent('killTarget',function(key){	//
	if(s.add(key,'killTarget',1) >= 10){
		s.callEvent('endCourse',key);
	}
});
s.newEvent('endCourse',function(key){	//
	var time = s.stopChrono(key,'timer');
	s.set(key,'chrono',time);
	s.message(key,'Your time: ' + time.frameToChrono());
	if(!s.isChallengeActive(key,'fivetimes')) 
		return s.completeQuest(key);
	
	//else
	if(time < 25*10) 
		s.add(key,'chalTimes',1);
	else {
		s.set(key,'chalTimes',0);
		s.message(key,'Your time was slower than 10 seconds... Your count has been reset.');
	}
	s.message(key,'Challenge 5 Times: ' + s.get(key,'chalTimes') + '/5');
	if(s.get(key,'chalTimes') >= 5)	
		return s.completeQuest(key);
	else 
		s.callEvent('resetCourse',key);
});
s.newEvent('resetCourse',function(key){	//
	s.set(key,'killTarget',0);
	s.callEvent('teleportCourse',key);
});
s.newEvent('abilityReset',function(key){	//
	if(Date.now() - s.get(key,'lastReset') < 2000) return;	//prevent player to restart too fast
	s.set(key,'lastReset',Date.now())
	if(s.isChallengeActive(key,'fivetimes')){
		s.set(key,'chalTimes',0);
		s.message(key,'Challenge 5 Times: ' + s.get(key,'chalTimes') + '/5');
	}
	s.callEvent('resetCourse',key);
});

s.newAbility('simple','attack',{
	name:'Bullet',
	icon:'offensive.bullet',
	description:'This is an ability.',
	periodOwn:15
},{
	type:'bullet',
	dmg:s.newAbility.dmg(150,'range'),
	hitAnim:s.newAbility.anim('earthBomb',0.4),
	sprite:s.newAbility.sprite('rock',0.5)
});
s.newAbility('boomerang','attack',{
	name:'Boomerang',
	icon:'weapon.boomerang',
	description:'This is an ability.',
	periodGlobal:15
},{
	type:'bullet',
	dmg:s.newAbility.dmg(150,'melee'),
	hitAnim:s.newAbility.anim('strikeHit',0.5),
	maxTimer:250,
	ghost:True,
	boomerang:s.newAbility.boomerang(1,1,0.2,True),
	sprite:s.newAbility.sprite('bone',1),
	pierce:s.newAbility.pierce(1,0.8,5)
});
s.newAbility('5ways','attack',{
	name:'Fire Bullet',
	icon:'attackMagic.fireball',
	description:'This is an ability.',
	periodOwn:100,
	periodGlobal:15
},{
	type:'bullet',
	amount:5,
	angleRange:360,
	dmg:s.newAbility.dmg(150,'fire'),
	hitAnim:s.newAbility.anim('fireHit',0.5),
	ghost:True,
	sprite:s.newAbility.sprite('fireball',1.2)
});
s.newAbility('reset','event',{
	name:'myAbility',
	icon:'attackMelee.cube',
	description:'This is an ability.'
},{
	event:s.getEvent('abilityReset')
});
s.newAbility('fastmove','dodge',{
	name:'Invincibility',
	icon:'attackMelee.cube',
	description:'Dodge all damage.',
	bypassGlobalCooldown:True,
	costMana:30
},{
	distance:200, time:4
});

s.newPreset('target',s.newPreset.ability(['simple','boomerang','5ways','','reset','fastmove']),null,False,False,False,False);
s.newPreset('fireonly',s.newPreset.ability(['5ways','','','','reset','']),null,False,False,False,False);

s.newMap('main',{
	name:'Practice Field',
	lvl: 0,
	grid: ["000000000000000000000000000001100000000000000","000000011110000000000000000001100000000000000","000000011110000000000000000000000000000000000","000000011110111111111111111111111111111110000","000000000001111111111111111111111111111111000","000000000011111111111111111111111100000001000","000000000011111111111111111111111110000001000","000000000011000000000000000000000010111101000","000111100011000000000000000000000010111101000","000111100111000000000000000000000010111101000","000111101111000000000000000000000010001101000","000000011110000110000000011100000011001101000","000000110100000110000000111100000001100001000","000001100100000011000000111111110000111101000","011011000100000011111000111111110000011111000","011010000100000001111000111111110000000011000","000010000100000001111000111111100000000011000","000011111100000001110000111100000000000011000","000011111100000000000000111100000110000011000","000011111100000000000000000000000110000011000","000010001100000000000000000000000110000011000","000010011000000001110000000000000110000011000","000010110000000011110000000000000011000011000","000011100000000011110000000000000011000011000","000011000000000011110000000000000011000011000","000011000000011111110000000000000011000011000","000011000000111111110000000000000000000011000","000011000000111111111111110001110000000011000","000011000000111111111111110011110000000011000","000011000000000000001111110011110000000011000","000011000000000000001111110011100000000011000","000011000000000000000000000000000000000011000","000011000000000000000000000000000000000011000","000011000000000000000000000000000000000011000","000001111111111111110000000000011111111110000","011110111111111111111000000000111111111101111","011110000000000000001111111111101111000001111","011110000000011110000111111111001111000001111","000000000000011110000000000000000000000000000","000000000000011110000000000000000000000000000"],
	tileset:'v1.2'
},{
	spot:{e4:{x:592,y:368},e6:{x:944,y:368},e3:{x:464,y:496},e7:{x:1104,y:496},eb:{x:688,y:624},e5:{x:976,y:624},e8:{x:1200,y:720},e2:{x:464,y:752},t1:{x:848,y:752},ea:{x:1136,y:1008},e1:{x:496,y:1040}},
	load: function(spot){
		var list = ['e1','e2','e3','e4','e5','e6','e7','e8','ea','eb'];
		for(var i = 0 ; i < list.length; i++)
			m.spawnActor(spot[list[i]],"target",{deathEvent:'killTarget'});
	}
});
s.newMapAddon('QfirstTown-east',{
	spot:{t6:{x:2880,y:1536}},
	load: function(spot){
		m.spawnTeleporter(spot.t6,'startGame','zone','down');
	}
});



s.exports(exports);