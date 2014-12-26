//11/28/2014 4:13 PM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*//*global True, False, loadAPI*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/

'use strict';
var s = loadAPI('v1.0','QprotectFirstTown',{
	name:"Protect Town",
	author:""
});
var m = s.map; var b = s.boss;

/* COMMENT:

*/

s.newVariable({
	interval:125,
	started:false,
	time:0,
	timeToSurvive:1500
});

s.newChallenge('hardmode',"I want MORE!","More enemies! More villagers!",2,function(key){
	
});
s.newChallenge('longer',"Longer","Protect for 2 minutes.",2,function(key){
	
});

s.newEvent('_start',function(key){ //
	if(s.isAtSpot(key,'QfirstTown-main','n3',200))
		s.callEvent('talkCyber',key);
});
s.newEvent('_hint',function(key){ //
	if(!s.get(key,'started')) return 'Talk with Cyber north of Town.';
	return 'Protect the villagers for ' + s.get(key,'timeToSurvive').frameToChrono() + '.';
});
s.newEvent('_signIn',function(key){ //
	s.failQuest(key);
});
s.newEvent('_death',function(key){ //
	s.failQuest(key);
});
s.newEvent('_debugSignIn',function(key){ //
	s.teleport.force(key,1650,450,'QfirstTown-main');
});
s.newEvent('_abandon',function(key){ //
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-main','n3','main',false);
});
s.newEvent('_complete',function(key){ //
	s.message(key,'You managed to protect the village!');
	s.callEvent('_abandon',key);
});
s.newEvent('startGame',function(key){ //
	var LIFE = 1000;
	
	s.teleport(key,'main','n3','solo',true);
	s.setRespawn(key,'QfirstTown-main','n3','main',true);
	s.startChrono(key,'timer');	//only used to show time to player
	
	if(s.isChallengeActive(key,'hardmode')){
		s.set(key,'interval',4*25);
		s.spawnActor(key,'main','e2','npc','playerLike',{
			sprite:s.newNpc.sprite('villager-male4'),
			name:'Ylbeekyl',
			deathEvent:'killNpc',
			hp:LIFE
		});	
	}
	if(s.isChallengeActive(key,'longer')){
		s.set(key,'timeToSurvive',2*60*25);
	}
		
	s.setTimeout(key,s.completeQuest,s.get(key,'timeToSurvive'));	//use setTimeout for timing
	s.set(key,'started',true);
	s.displayPopup(key,'Protect the villagers.');
	
	s.spawnActor(key,'main','n1','npc-playerLike',{
		sprite:s.newNpc.sprite('villager-male1'),
		name:'Imdum',
		deathEvent:'killNpc',
		hp:LIFE
	});	
	s.spawnActor(key,'main','n2','npc-playerLike',{
		sprite:s.newNpc.sprite('villager-male2'),
		name:'Imstoopid',
		deathEvent:'killNpc',
		hp:LIFE
	});
	s.spawnActor(key,'main','n3','npc-playerLike',{
		sprite:s.newNpc.sprite('villager-male3'),
		name:'Igonhawdye',
		deathEvent:'killNpc',
		hp:LIFE
	});
});
s.newEvent('talkCyber',function(key){ //
	s.startDialogue(key,'cyber','intro1');
});
s.newEvent('killNpc',function(killer,villagerId){ //
	var key = s.getRandomPlayer(villagerId,'main');
	if(!key) return ERROR(3,'no player');
	s.message(key,'One of the villagers died... You failed to protect the village.');
	s.failQuest(key);
});

s.newDialogue('cyber','Cyber','villager-male.5',[ //{ 
	s.newDialogue.node('intro1',"The town is about attacked! Protect the village!",[ 
		s.newDialogue.option("I'll save you!",'','startGame'),
		s.newDialogue.option("No.",'intro2','')
	],''),
	s.newDialogue.node('intro2',"Please!",[ 
		s.newDialogue.option("Okay...",'','startGame'),
		s.newDialogue.option("No.",'intro2','')
	],'')
]); //}

s.newMap('main',{
	name:"Town Under Attack!",
	lvl:0,
	graphic:'QfirstTown-main',
},{
	spot:{b4:{x:1536,y:480,width:448,height:32},n3:{x:1552,y:656},e3:{x:1648,y:656},e2:{x:1584,y:816},e1:{x:1424,y:944},n2:{x:1168,y:1008},n1:{x:1744,y:1200},b3:{x:2112,y:1280,width:32,height:256},b1:{x:992,y:1312,width:384,height:32},e4:{x:1936,y:1392},b2:{x:1824,y:1536,width:320,height:32}},
	load:function(spot){
		//restrict area
		m.spawnBlock(spot.b1,function(){ return true;},'spike');	
		m.spawnBlock(spot.b2,function(){ return true;},'spike');	
		m.spawnBlock(spot.b3,function(){ return true;},'spike');
		m.spawnBlock(spot.b4,function(){ return true;},'spike');
		
		//npc to protect, npc&playerLike template is npc that can be attacked by monsters
	},
	loop:function(spot){
		var key = m.getRandomPlayer(spot);
		if(!key) return ERROR(3,'no player');
		if(!m.testInterval(s.get(key,'interval'))) return;
		
		var possibleSpot = ['e1','e2','e3','e4'];
		var possibleEnemy = ['mummy','spirit','skeleton','death','ghost','orc-melee'];
		var randomSpot = spot[possibleSpot.random()];
		var randomEnemy = possibleEnemy.random();
		m.spawnActor(randomSpot,randomEnemy,{globalDmg:0.7});	//spawn enemy
	}
});
s.newMapAddon('QfirstTown-main',{
	spot:{b4:{x:1536,y:480,width:448,height:32},n3:{x:1552,y:656},e3:{x:1648,y:656},e2:{x:1584,y:816},e1:{x:1424,y:944},n2:{x:1168,y:1008},n1:{x:1744,y:1200},b3:{x:2112,y:1280,width:32,height:256},b1:{x:992,y:1312,width:384,height:32},e4:{x:1936,y:1392},b2:{x:1824,y:1536,width:320,height:32}},
	load:function(spot){
		m.spawnActor(spot.n3,'npc',{
			sprite:s.newNpc.sprite('villager-male5'),
			dialogue:'talkCyber',
			name:'Cyber',
			minimapIcon:'minimapIcon.quest',
		});
	}
});

s.exports(exports);
