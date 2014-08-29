/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
"use strict";
var s = require('./../Quest_exports').init('v1.0','QexampleSimpleMap2',{
	name:"[NAME]",
});
var q = s.quest; var m = s.map; var b = s.boss;

/* STEPS TO COMPLETE QUEST
	Goal: Cheer up the sad guy by giving him 3 gold.

	STEPS:
*****Enter house.
		-Answer Quiz and get 1 gold
*****Enter Dragon Lair.
*****Kill 10 enemies to unblock path.
		-Kill Dragon King and get 1 gold
		-Activate switch to unlock chest
		-Loot the chest to get 1 gold.
		-Talk with sad guy and give him 3 gold.
*/

s.newVariable({
	killDragon:0,
	haveDoneQuiz:false,
	chestLocked:true,
	lootChest:false,
	killMinion:0,
});

s.newEvent('killMinion',function(key){
	s.set(key,'killMinion','+1');
});
s.newEvent('viewBlock',function(key){
	return s.get(key,'killMinion') < 10;
});
s.newEvent('teleTownLair',function(key){
	s.teleport(key,'dragonLair','t1','solo');
});
s.newEvent('teleLairTown',function(key){
	s.teleport(key,'tinyTown','t2');
});
s.newEvent('teleTownHouse',function(key){
	s.teleport(key,'bobHouse','t1');
});
s.newEvent('teleHouseTown',function(key){
	s.teleport(key,'tinyTown','t1');
});
s.newEvent('viewChest',function(key){
	return s.get(key,'lootChest') === false;
});
s.newEvent('lootChest',function(key){
	if(s.get(key,'chestLocked') === false){
		s.addItem(key,'gold',1);
		s.set(key,'lootChest',true);
	} else {
		s.chat(key,'This chest is locked.');
	}
});
s.newEvent('viewTgOn',function(key){
	return s.get(key,'chestLocked') === true;
});
s.newEvent('tgOnChest',function(key){
	s.set(key,'chestLocked',false);
});
s.newEvent('talkRingo',function(key){
	s.dialogue(key,'ringo','intro');
});
s.newEvent('killDragon',function(key){
	if(s.get(key,'killDragon') === 0){
		s.addItem(key,'gold',1);
		s.set(key,'killDragon',1);
	}
});
s.newEvent('giveGold',function(key){
	s.addItem(key,'gold',1);
	s.set(key,'haveDoneQuiz',true);
});
s.newEvent('talkBob',function(key){
	if(s.get(key,'haveDoneQuiz') === false){
		s.dialogue(key,'bob','intro');
	} else {
		s.dialogue(key,'bob','alreadydone');
	}
});
s.newEvent('testCheerUp',function(key){
	if(s.haveItem(key,'gold',3) === true){
		s.dialogue(key,'ringo','yes');
		s.completeQuest(key);
	} else {
		s.dialogue(key,'ringo','no');
	}
});

s.newItem('gold','Gold');

s.newDialogue('ringo',null,{
	intro:{
		text:"Hello, I'm sad.",
		option:[
			{text:"I'll cheer you up.",
				event:'testCheerUp',
			},
			{text:"Bye."},
		]
	},
	yes:{
		text:"Thanks a lot."
	},
	no:{
		text:"You don't have 3 gold."
	},
});

s.newDialogue('bob',null,{
	intro:{
		text:"Hello, let's do a quiz.",
		option:[
			{text:"Sure.",
				next:{node:'question1'},
			},
			{text:"Bye."},
		]
	},
	alreadydone:{
		text:"You have already done the quiz!",
	},
	wrong:{
		text:"Wrong!",
	},
	question1:{
		text:"What is the name of the NPC you want to cheer up:",
		option:[
			{text:"Zezima.",next:{node:'wrong'}},
			{text:"Ringo.",next:{node:'question2'}},
			{text:"Hulk.",next:{node:'wrong'}},
		]
	},
	question2:{
		text:"0,1,1,2,3,5,8,13,...:",
		option:[
			{text:"21.",next:{node:'success'}},
			{text:"18.",next:{node:'wrong'}},
			{text:"9001.",next:{node:'wrong'}},
		]
	},
	success:{
		text:"Congratz! Here's your gold!",
		event:'giveGold',
	},
});

s.newMap.simple(function(){
	m.spawnActor.simple("Bob",{dialogue:s.event('talkBob'),name:"Bob"});
	m.spawnActor.simple("Ringo",{dialogue:s.event('talkRingo'),name:"Ringo"});
	m.spawnToggle.simple('Toggle',s.event('viewTgOn'),s.event('tgOnChest'),null);
	m.spawnLoot.simple('Chest',s.event('viewChest'),s.event('lootChest'));
	
	m.spawnActor.simple("dragon",{deathEvent:s.event('killDragon')});
	m.spawnActor.simple("minion",{deathEvent:s.event('killMinion')});	
});


s.exports(exports);





