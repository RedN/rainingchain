/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
"use strict";
var s = require('./../Quest_exports').init('v1.0','QprotectFirstTown');
var q = s.quest; var m = s.map; var b = s.boss;

q.name = "Protect Town";

var LIFE = 5000;	//npc life

/* STEPS TO COMPLETE QUEST
	Talk with guy in village.
	need to protect npc for x time. 
	if 1 npc dies, game over
	enemies spawn every x time

*/

s.newVariable({
	interval:5*25,		//interval at which enemy spawn
	started:false,
	time:0,
	timeToSurvive:60*25,
});

s.newChallenge('hardmode','I want MORE!','More enemies! More villagers!',function(key){
	s.set(key,'interval',4*25);
},null);
s.newChallenge('longer','Longer','Protect for 2 minutes.',function(key){
	s.set(key,'timeToSurvive',2*60*25);
},null);
s.newChallenge('weaker','Weaker','You have very low defence.',null,null);

s.newEvent('_start',function(key){
	if(s.isAtSpot(key,'QfirstTown-main','n3',200))
		s.event('talkCyber',key);
});
s.newEvent('_hint',function(key){
	if(!s.get(key,'started')) return 'Talk with Cyber north of Town.';
	return 'Protect the villagers for ' + s.get(key,'timeToSurvive').frameToChrono() + '.';
});
s.newEvent('_signIn',function(key){ s.abandonQuest(key);});
s.newEvent('_death',function(key){ s.abandonQuest(key);});
s.newEvent('_testSignIn',function(key){
	s.teleport.test(key,1650,450,'QfirstTown-main');
});
s.newEvent('_abandon',function(key){
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-main','n3','main',false);
});
s.newEvent('_complete',function(key){
	s.chat(key,'You managed to protect the village!');
	s.event('_abandon',key);
});
s.newEvent('talkCyber',function(key){
	if(!s.startQuest(key)) return;
	s.dialogue(key,'cyber','intro1');
});
s.newEvent('startGame',function(key){
	s.teleport(key,'main','n3','solo',true);
	s.setRespawn(key,'QfirstTown-main','n3','main',true);
	s.chrono(key,'timer','start');	//only used to show time to player
	s.setTimeout(key,'protect',s.get(key,'timeToSurvive'),s.completeQuest);	//use setTimeout for timing
	s.set(key,'started',true);
	s.popup(key,'Protect the villagers.');
	if(s.getChallenge(key,'hardmode')){	//spawn additionnal enemy
	
	}
});
s.newEvent('killNpc',function(eid,villager){ //eid is monster who killed npc, villager is who died
	var key = s.getPlayerInMap(villager.id,'main')[0];
	if(!key) return;	//if player
	s.chat(key,'One of the villagers died... You failed to protect the village.');
	s.abandonQuest(key);
});

s.newDialogue('cyber',{image:'villager-male.5',name:'Cyber'},{
	intro1:{
		text:"The town is about attacked! Protect the village!",
		option:[
			{text:"I'll save you!",event:'startGame'},
			{text:"No.",next:"intro2"},
		]
	},
	intro2:{
		text:"Please...",
		option:[
			{text:"Okay...",event:'startGame'},
			{text:"No.",next:"intro2"},
		]
	},
});

s.newMap('main',{
	name:"Town Under Attack!",
	graphic:"QfirstTown-main",
	lvl:0,
},{
	spot:{"b4":[1536,1952,480,480],"n3":{"x":1552,"y":656},"e3":{"x":1648,"y":656},"e2":{"x":1584,"y":816},"e1":{"x":1424,"y":944},"n2":{"x":1168,"y":1008},"n1":{"x":1744,"y":1200},"b3":[2112,2112,1280,1504],"b1":[992,1344,1312,1312],"e4":{"x":1936,"y":1392},"b2":[1824,2112,1536,1536]},
	variable:{
		spot:['e1','e2','e3','e4'],
		enemy:['gargoyle','mummy','death','skeleton','spirit'],
		interval:5*25,
	},
	load:function(spot,key){
		//restrict area
		m.spawnBlock(spot.b1,function(){ return true;},'spike');	
		m.spawnBlock(spot.b2,function(){ return true;},'spike');	
		m.spawnBlock(spot.b3,function(){ return true;},'spike');
		m.spawnBlock(spot.b4,function(){ return true;},'spike');
		
		//npc to protect, npc&playerLike template is npc that can be attacked by monsters 
		m.spawnActor(spot.n1,'npc-playerLike',{sprite:'villager-male.1',name:'Imdum',deathEventOnce:s.event('killNpc'),'resource,hp,regen':1,hp:LIFE});	
		m.spawnActor(spot.n2,'npc-playerLike',{sprite:'villager-male.2',name:'Imstoopid',deathEventOnce:s.event('killNpc'),'resource,hp,regen':1,hp:LIFE});
		m.spawnActor(spot.n3,'npc-playerLike',{sprite:'villager-male.3',name:'Igonhawdye',deathEventOnce:s.event('killNpc'),'resource,hp,regen':1,hp:LIFE});
		
		if(s.getChallenge(key,'hardmode'))
			m.spawnActor(spot.e2,'npc','playerLike',{sprite:'villager-male.4',name:'Ylbeekyl',deathEventOnce:s.event('killNpc'),'resource,hp,regen':1,hp:LIFE});
		
		this.variable.interval = s.get(key,'interval');	//used in loop to spawn enemies
	},
	loop:function(spot){
		if(!s.interval(this.variable.interval)) return;
		
		var randomSpot = spot[this.variable.spot.random()];
		var randomEnemy = this.variable.enemy.random();
		m.spawnActor(randomSpot,randomEnemy);	//spawn enemy
	},
});
s.newMapAddon('QfirstTown-main',{
	spot:{"e2":{"x":1648,"y":112},"n3":{"x":1648,"y":368},"e3":{"x":1648,"y":656},"e1":{"x":1424,"y":944},"n2":{"x":1168,"y":1008},"b3":[2112,2272,1280,1280],"b1":[992,1344,1312,1312],"n1":{"x":1936,"y":1360},"e4":{"x":2384,"y":1392},"b2":[1824,2368,1536,1536]},
	load:function(spot){
		m.spawnActor(spot.n3,'npc',{sprite:'villager-male.5',dialogue:s.event('talkCyber'),name:'Cyber'});	
	},
});

s.exports(exports);





