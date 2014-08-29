/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
"use strict";
var s = require('./../Quest_exports').init('v1.0','QbaseDefence',{
	name:"Defend The Base",
	reward:{exp:0.2,item:0.2,passive:{min:1,max:2,mod:10}},
});
var q = s.quest; var m = s.map; var b = s.boss;

/* STEPS TO COMPLETE QUEST
	kill zombies by using the right ability
	get pt by killing them, use pt to upgrade self
	if survive all waves, win
*/

//[amount,timeBeforeNextWave]
var WAVEINFO = [[2,0],[2,8],[3,8],[3,7],[4,7],[4,6],[4,15],[5,6],[5,6],[6,5],[6,15],[7,5],[7,5],[8,5],[8,25],/*hardmode*/[8,3],[9,3],[10,3],[10,3],[10,15]];
var COLOR3 = ['red','blue','yellow'];
var COLOR4 = ['red','blue','yellow','green'];
var SPAWNSPOT = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s'];

s.newVariable({
	wave:0,			//current wave
	amountWave:15,	//amount wave to survive to win
	pt:125,			//current pt
	life:5,			//current life
	upgradeLife:0,	//how many times upgraded
	upgradeAmount:0,
	upgradeSpd:0,
});

s.newPreset('color3',['blue','red','','','','yellow']);
s.newPreset('color4',['blue','red','yellow','green','','']);

s.newHighscore('remainingpteasy','Remaining Pts [Easy]','Most points at the end of the game.','descending',function(key){
	if(!s.getChallenge(key,'hardmode') && !s.getChallenge(key,'color4')) return s.get(key,'pt');	
	return null;
});
s.newHighscore('remainingpthard','Remaining Pts [Hard]','Most points at the end of the game with challenge Hardmode active.','descending',function(key){
	if(s.getChallenge(key,'hardmode')) return s.get(key,'pt');	
	return null;
});
s.newHighscore('remainingpt4','Remaining Pts [4 Colors]','Most points at the end of the game with challenge 4 Colors active.','descending',function(key){
	if(s.getChallenge(key,'color4')) return s.get(key,'pt');	
	return null;
});

s.newChallenge('hardmode','Hardmode!','Only 3 Life. Survive 20 waves.',function(key,qid){
	s.set(key,'life',3);
	s.set(key,'amountWave',20);
	s.set(key,'pt',0);
},null);
s.newChallenge('pt400','400+ Pts','End the quest with 400 remaining points.',function(key){
	return s.get(key,'pt') > 400;	
},null);
s.newChallenge('color4','4 Types',"There are 4 types of enemies.",null,null);

s.newEvent('_start',function(key){
	if(s.isAtSpot(key,'QfirstTown-east','t4',200))
		s.event('startGame',key);
});
s.newEvent('_hint',function(key){
	return 'Pt: ' + s.get(key,'pt') + ' | Wave: ' + s.get(key,'wave') + '/' + s.get(key,'amountWave') + ' | Life: ' + s.get(key,'life'); 
});
s.newEvent('_testSignIn',function(key){	
	s.teleport(key,'QfirstTown-east','t4','main');
});
s.newEvent('_signIn',function(key){
	s.abandonQuest(key);
});
s.newEvent('_death',function(key){ 
	s.abandonQuest(key);
});
s.newEvent('_abandon',function(key){
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-east','t4','main',false);
});
s.newEvent('_complete',function(key){
	s.event('_abandon',key);
});
s.newEvent('startGame',function(key){
	if(!s.getEmptyItem(key,2,true)) return;
	if(!s.startQuest(key)) return;
	s.teleport(key,'base','t1','solo',true);
	s.addItem(key,'upgradeSpd');
	s.addItem(key,'upgradeAmount');
	s.popup(key,'Use items to upgrade attack.');
	if(!s.getChallenge(key,'color4')){
		s.chat(key,'Use the right ability to defeat the enemies (Left, Right and Space Bar).');
		s.usePreset(key,'color3');
	} else {
		s.chat(key,'Use the right ability to defeat the enemies (Left, Right, Shift-Left and Shift-Right).');
		s.usePreset(key,'color4');
	}
	s.setTimeout(key,'wave',10*25,s.event('nextWave'));	//call the first wave in 10 sec
});
s.newEvent('nextWave',function(key){
	if(s.get(key,'wave') >= s.get(key,'amountWave')){ 	//if survived long enough, complete quest
		return s.completeQuest(key); 
	}
	if(!s.isInMap(key,'base')) return s.ERROR('nextWave timeout should have been removed if no longer in map');
	
	var info = WAVEINFO[s.get(key,'wave')];		//get info about wave. [amount,time]
	
	for(var i = 0 ; i < info[0]; i++){
		s.event('spawnEnemy',key);
	}
	
	s.add(key,'wave',1);
	
	s.setTimeout(key,'wave'+s.get(key,'wave'),info[1]*25,s.event('nextWave'));	//set next wave
});
s.newEvent('spawnEnemy',function(key){
	var color = s.getChallenge(key,'color4') ? COLOR4.random() : COLOR3.random();
	var spot = SPAWNSPOT.random();
	var eid = s.spawnActor(key,'base',spot,color,{deathEvent:s.event('killEnemy'),modAmount:0,v:32})
	s.path(eid,'base','blue',{combat:1});		//makes them follow blue path (check tiled)
});
s.newEvent('killEnemy',function(key){
	s.mapForEach(key,'base',s.event('addPt'));
});
s.newEvent('addPt',function(key){
	var currentPt = s.get(key,'pt');
	var ptToAdd = s.event('getPtToAdd',key,currentPt);
	s.add(key,'pt',ptToAdd);
});
s.newEvent('getPtToAdd',function(key){	//the more pt you save, the more you get
	var mod = 1;
	var num = s.get(key,'pt');
	if(num < 25) return Math.round(5*mod);
	if(num < 50) return Math.round(6*mod);
	if(num < 100) return Math.round(7*mod);
	if(num < 200) return Math.round(8*mod);
	if(num < 400) return Math.round(9*mod);
	if(num < 800) return Math.round(10*mod);
	return Math.round(11*mod);
});
s.newEvent('upgradeSpd',function(key){
	var cost = 50 * (1 + s.get(key,'upgradeSpd'));
	if(s.get(key,'pt') < cost) return s.chat(key,'You need ' + cost + ' points.');
	s.add(key,'pt',-cost);
	s.add(key,'upgradeSpd',1);
	
	var boost = 1 + s.get(key,'upgradeSpd')*0.5;
	s.boost(key,'spd','atkSpd',boost);
	
	s.chat(key,'You shoot x' + boost + ' faster now.');
});
s.newEvent('upgradeAmount',function(key){
	var cost = 200 * (1 + s.get(key,'upgradeAmount'));
	if(s.get(key,'pt') < cost) return s.chat(key,'You need ' + cost + ' points.');
	s.add(key,'pt',-cost);
	s.add(key,'upgradeAmount',1);
	
	var boost = 1 + s.get(key,'upgradeAmount')*2;
	s.boost(key,'amount','bullet-amount',boost);
	
	s.chat(key,'You shoot ' + boost + ' at a time now.');
});
s.newEvent('reachEnd',function(key){	//when mushroom reach end, check map loop
	s.add(key,'life',-1);
	if(s.get(key,'life') <= 0){
		s.chat(key,"You lost because too many enemies past through your defence.");
		s.abandonQuest(key);
		return 'return';	//stops the loop in the map loop. prevent bug
	}
});

s.newItem('upgradeAmount','Amount','element.range',[	//{
	['upgradeAmount','Upgrade Amount','Increase how many bullet you shoot.'],
]); //}
s.newItem('upgradeSpd','Speed','defensive.speed',[ //{
	['upgradeSpd','Upgrade Spd','Upgrade Attack Speed.'],
]); //}

s.newAbility('red','fireBullet',{name:'Red'},{angle:10});
s.newAbility('blue','coldBullet',{name:'Blue'},{angle:10});
s.newAbility('yellow','lightningBullet',{name:'Yellow'},{angle:10});
s.newAbility('green','rangeBullet',{name:'Green'},{angle:10});


s.newNpc("blue",{
	name:"Blue",
	hp:4,
	sprite:{name:"tower-blue",sizeMod:0.7},
	maxSpd:1/4,
	modAmount:0,
	alwaysActive:true,
	targetIf:'false',
	damageIf:'false',
	immune:s.element(1,1,1,1,0,1),
}); 
s.newNpc("yellow",{
	name:"Yellow",
	hp:4,
	sprite:{name:"tower-yellow",sizeMod:0.7},
	maxSpd:1/4,
	modAmount:0,
	alwaysActive:true,
	targetIf:'false',
	damageIf:'false',
	immune:s.element(1,1,1,1,1,0),
}); 
s.newNpc("red",{
	name:"Red",
	hp:4,
	sprite:{name:"tower-red",sizeMod:0.7},
	maxSpd:1/4,
	modAmount:0,
	alwaysActive:true,
	targetIf:'false',
	damageIf:'false',
	immune:s.element(1,1,1,0,1,1),
}); 
s.newNpc("green",{
	name:"Green",
	hp:4,
	sprite:{name:"tower-green",sizeMod:0.7},
	maxSpd:1/4,
	modAmount:0,
	alwaysActive:true,
	targetIf:'false',
	damageIf:'false',
	immune:s.element(1,0,1,1,1,1),
}); 

s.newMap('base',{
	name:"Base",
	tileset:"v1.2",
	grid:["00000000000111100110011000000000000001100000000000","00000000000011110110111000000000000001110001100000","00000000000001111001111000000000000001111001100000","00000000000000111111110000000000000000111110111110","10000000000000011111100000000000000000011111011110","11000000000000001111000000000000000000001111101111","01100000000000000110000000000000000000000111101111","00110000000000000000000000000000000000000001100111","00011000000000000000000000000000000000000001110011","00001100000000000000000000000000000000000001111000","00000110000000000000000000000000000000000000111111","01111011000000000000000000000000000000000000011111","01111111000000000000000000000000000000000000001111","00001111000000000000000000000000000000000000000111","00011110000000000000000000000000000000000000000000","01111100000000000000000000000000000000000000000000","11111000000000000000000000000000000000000000000000","11110000000000000000000000000000000000000000000000","11100000000000000000000000000000000000000000000000","10000000000000000000000000000000000000000000011111","00000000000000000000000000000000000000000000111111","00000000000000000000000022222220000000000001100000","00000000000000000000000020000020000000000011001111","00000000000000000000000020000020000000000011101111","00000000000000000000000020000020000000000011110000","00000000000000000000000020000020000000000001111100","00000000000000000000000020000020000000000000111110","00000000000000000000000022222220000000000000011111","00000000000000000000000000000000000000000000001111","11000000000000000000000000000000000000000000000011","11100000000000000000000000000000000000000000000001","11110000000000000000000000000000000000000000000000","11011000000000000000000000000000000000000000000000","00111000000000000000000000000000000000000000000000","01111000000000000000000000000000000000000000000000","11110000000000000000000000000000000000000000000000","11100000000000000000000000000000000000000000000000","11000000000000000000000000000000000000000000000000","10000000000000000000000000000000000000000000000011","00000000000000000000000000000000000000000000000111","00000000000000000000000000000000000000000000001100","00000000000000000000000000000000000000000000011000","00000000000000000000000000000000000000000000011000","00000000000000000000000000000000000000000000011000","00000000000000000000000000000000000000000011110000","00000000000000011111100000000000000000000111111110","00000000000111111111110000000000000000001111111111","00000000001111100000011000000000000000011011111111","00000000011000001111001100000000000000011001111110","00000000110000001111001100000000000000011000000000"],
	lvl:0,
},{
	spot:{"c":{"x":272,"y":48},"d":{"x":816,"y":48},"e":{"x":944,"y":48},"f":{"x":1072,"y":48},"b":{"x":176,"y":80},"a":{"x":112,"y":144},"g":{"x":1552,"y":528},"b1":[704,1024,608,928],"s":{"x":48,"y":688},"r":{"x":48,"y":784},"t1":{"x":880,"y":816},"q":{"x":48,"y":880},"h":{"x":1552,"y":1072},"i":{"x":1552,"y":1168},"p":{"x":48,"y":1392},"o":{"x":80,"y":1488},"n":{"x":144,"y":1552},"m":{"x":848,"y":1552},"l":{"x":944,"y":1552},"k":{"x":1040,"y":1552},"j":{"x":1168,"y":1552}},
	path:{"blue":[{"x":880,"y":784}]},
	loop:function(spot){
		if(!s.interval(50)) return;	//every 2 sec
		var list = m.collision.npc(spot.b1);	//check mushroom reached end
		for(var i = 0 ; i < list.length; i++){
			s.killActor(list[i]);				//if so kill mushroom
			if(m.mapForEach(spot,s.event('reachEnd')) === 'return') return;	//makes player lose life
			
			//the === 'return' is used to prevent a bug. 
			//if 2 mushroom in list, player dies cuz of 1st one, teleport outside of map and delete instance
			//the loop continues and tries to access 2nd mushroom that no longer exists and crash
		};
	},
});

s.newMapAddon('QfirstTown-east',{
	spot:{"t3":{"x":752,"y":48},"t2":{"x":1232,"y":48},"a":{"x":1648,"y":208},"t8":{"x":48,"y":272},"s3":{"x":2368,"y":336},"s5":{"x":2112,"y":560},"t1":{"x":48,"y":528},"e1":{"x":1136,"y":784},"t7":{"x":48,"y":816},"s4":{"x":704,"y":912},"e2":{"x":2064,"y":944},"t5":{"x":3152,"y":1008},"s1":{"x":2496,"y":1168},"undefined":{"x":1360,"y":1200},"s2":{"x":1056,"y":1392},"t4":{"x":1680,"y":1552},"t6":{"x":2896,"y":1552}},
	load:function(spot){
		m.spawnTeleport(spot.t4,s.event('startGame'),'zone','down');
		
		m.spawnActorGroup(spot.e1,25*15,[
			["slime",1],
			["death",1]
		]);
		m.spawnActorGroup(spot.e2,25*15,[
			["demon",1],
			["spirit",1]
		]);
	},
});

s.exports(exports);







