/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
"use strict";
var s = require('./../Quest_exports').init('v1.0','QtowerDefence',{
	name:"Tower Defence",
	reward:{exp:0.2,item:0.2,passive:{min:1,max:2,mod:10}},
});
var q = s.quest; var m = s.map; var b = s.boss;

/*	STEPS TO COMPLETE QUEST
	place towers to kill mushroom
	if mushroom reach bottom, lose life
	0 life => fail
	need survive x waves
*/

s.newHighscore('remainingpteasy','Remaining Pts [Easy]','Most points at the end of the game.','descending',function(key){
	if(!s.getChallenge(key,'hardmode')) return s.get(key,'pt');	
	return null;
});
s.newHighscore('remainingpthard','Remaining Pts [Hard]','Most points at the end of the game with challenge Hardmode active.','descending',function(key){
	if(s.getChallenge(key,'hardmode')) return s.get(key,'pt');	
	return null;
});

s.newChallenge('hardmode','Hardmode!','Only 3 Lifes. Survive 20 waves.',function(key,qid){
	s.set(key,'life',3);
	s.set(key,'amountWave',20);
	s.set(key,'pt',100);
	s.attackOff(key);	//and if logs out => game over
});
s.newChallenge('pt400','400+ Pts','End the quest with 400 remaining points.',function(key){
	return s.get(key,'pt') > 400;	
});
s.newChallenge('nocontribution','No Help',"Can't use abilities.",function(key,qid){
	s.attackOff(key);	//and if logs out => game over
});

//[amount,timeBeforeNextWave]
var WAVEINFO = [[2,15],[3,8],[3,8],[4,7],[4,7],[5,6],[5,6],[6,6],[6,6],[7,5],[7,5],[8,5],[8,5],[10,5],[12,15],/**/[8,3],[9,3],[10,3],[10,3],[10,15]];
var TOWER_DISTANCE = 45;
var TOWER_REGULAR = 25;
var TOWER_AOE = 35;
var TOWER_ICE = 50;

s.newVariable({
	wave:0,			//current wave
	amountWave:15,	//amount wave to survive to win
	pt:125,			//current pt
	life:5,			//current life
});

s.newEvent('_start',function(key){
	if(s.isAtSpot(key,'QfirstTown-east','t2',200))
		s.event('startGame',key);
});
s.newEvent('_hint',function(key){
	return 'Pt: ' + s.get(key,'pt') + ' | Wave: ' + s.get(key,'wave') + '/' + s.get(key,'amountWave') + ' | Life: ' + s.get(key,'life'); 
});
s.newEvent('_testSignIn',function(key){	s.teleport.test(key,1232,48,'QfirstTown-east');});
s.newEvent('_signIn',function(key){ s.abandonQuest(key);});
s.newEvent('_death',function(key){s.abandonQuest(key);});
s.newEvent('_abandon',function(key){
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-east','t2','main',false);
});
s.newEvent('_complete',function(key){
	s.event('_abandon',key);
});
s.newEvent('startGame',function(key){
	if(!s.getEmptyItem(key,3,true)) return;
	if(!s.startQuest(key)) return
	s.teleport(key,'main','t1','solo',true);
	s.addItem(key,{'basic':1,'ice':1,'aoe':1});
	s.popup(key,'Use items to place towers.');
	s.chat(key,'Use the items "Basic", "Fire" and "Ice" to place towers.');
	s.chat('Enemies must not reach the bottom of the map.');
	s.chat(key,'Using your own abilities to kill enemies decreases your score. If it drops below -25, you lose.');
	s.setTimeout(key,'wave',10*25,s.event('nextWave'));	//call the first wave in 10 sec
	
	s.boost(key,'td','globalDmg',0.4,25*3600);		//otherwise player 1-hit mushroom
});
s.newEvent('nextWave',function(key){
	if(s.get(key,'wave') >= s.get(key,'amountWave')){ 	//if survived long enough, complete quest
		return s.completeQuest(key); 
	}
	if(!s.isInMap(key,'main')) return s.ERROR('nextWave timeout should have been removed if no longer in map');
	
	var info = WAVEINFO[s.get(key,'wave')];		//get info about wave. [amount,time]
	var elist = s.spawnActorGroup(key,'main','e1',false,[	//create group
		['enemy',info[0],{deathEventOnce:s.event('killEnemy'),modAmount:0}]
	],{v:50});
	
	for(var i = 0; i < elist.length; i++){		//makes them follow blue path (check tiled)
		s.path(elist[i],'main','blue',{combat:1});	
	}
	s.add(key,'wave',1);
	
	s.setTimeout(key,'wave'+s.get(key,'wave'),info[1]*25,s.event('nextWave'));	//set next wave
});
s.newEvent('killEnemy',function(killers,act,map){
	//check if the player contributed to the mushroom kill directly (if part of killers)
	for(var i = 0; i < killers.length; i++){
		var key = killers[i];
		if(s.isPlayer(key)){
			s.event('removePtIfContibuted',key);
			return;
		}
	}
	s.mapForEach(act.id,'main',s.event('addPt'));	//if no interfering, add pt to every player in same map than enemy killed
});
s.newEvent('removePtIfContibuted',function(key){
	s.add(key,'pt',-10);
	s.chat(key,"Your score decreased for interfering in battle.");
	if(s.get(key,'pt') < -25){
		s.chat(key,"Your score dropped below -25. Game over.");
		s.abandonQuest(key);
	}	
});
s.newEvent('addPt',function(key){
	var currentPt = s.get(key,'pt');
	var ptToAdd = s.event('getPtToAdd',key,currentPt);
	s.add(key,'pt',ptToAdd);
});
s.newEvent('getPtToAdd',function(key,num){ //the more pt you save, the more you get
	var mod = 1; //(20-s.get(key,'wave'))/20;
	
	if(num < 25) return Math.round(5*mod);
	if(num < 50) return Math.round(6*mod);
	if(num < 100) return Math.round(7*mod);
	if(num < 200) return Math.round(8*mod);
	if(num < 400) return Math.round(9*mod);
	if(num < 800) return Math.round(10*mod);
	return Math.round(11*mod);
});
s.newEvent('testTower',function(key){	//test if can place tower. if another tower too close, cant
	var list = s.getNpcInMap(key,'main','tower');
	for(var i = 0; i < list.length;i++)
		if(s.getDistance(key,list[i]) < TOWER_DISTANCE) return false;
	return true;
});
s.newEvent('placeTowerRegular',function(key){
	if(!s.event('testTower',key)) return s.chat(key,"Too close from another tower.");
	if(s.get(key,'pt') < 25) return s.chat(key,'You need ' + TOWER_REGULAR + ' points to place the tower.');
	s.spawnActor.onTop(key,'main','tower-normal',{tag:'tower'});	//add tower where player is
	s.add(key,'pt',-TOWER_REGULAR);
	
});
s.newEvent('placeTowerAoe',function(key){
	if(!s.event('testTower',key)) return s.chat(key,"Too close from another tower.");
	if(s.get(key,'pt') < TOWER_AOE) return s.chat(key,'You need ' + TOWER_AOE + ' points to place the tower.');
	s.spawnActor.onTop(key,'main','tower-aoe',{tag:'tower'});
	s.add(key,'pt',-TOWER_AOE);
});
s.newEvent('placeTowerIce',function(key){
	if(!s.event('testTower',key)) return s.chat(key,"Too close from another tower.");
	if(s.get(key,'pt') < TOWER_ICE) return s.chat(key,'You need ' + TOWER_ICE + ' points to place the tower.');
	s.spawnActor.onTop(key,'main','tower-ice',{tag:'tower'});
	s.add(key,'pt',-TOWER_ICE);
});
s.newEvent('reachEnd',function(key){	//when mushroom reach end, check map loop
	s.add(key,'life',-1);
	if(s.get(key,'life') <= 0){
		s.chat(key,"You lost because too many enemies past through your defence.");
		s.abandonQuest(key);
		return 'return';	//stops the loop in the map loop. prevent bug
	}
});

s.newItem('basic','Basic','element.range2',[	//{
	['placeTowerRegular','Basic Tower','Place 1 basic tower. (' + TOWER_REGULAR + ' Pts)'],
]); //}
s.newItem('aoe','Fire','element.fire2',[	//{
	['placeTowerAoe','AoE Tower','Place 1 AoE tower. (' + TOWER_AOE + ' Pts)'],
]); //}
s.newItem('ice','Ice','element.cold2',[	//{
	['placeTowerIce','Ice Tower','Place 1 Ice tower. (' + TOWER_ICE + ' Pts)'],
]); //}

s.newNpc("enemy",{
	name:"Mushroom",
	sprite:s.newNpc.sprite("tower-enemy"),
	maxSpd:0.7,
	modAmount:0,
	targetIf:'false',
	damageIf:'false',
	alwaysActive:true,
	hideOptionList:true,
});
s.newNpc("tower-normal",{
	name:"Tower",
	sprite:s.newNpc.sprite("tower-yellow"),
	nevermove:1,
	modAmount:0,
	alwaysActive:true,
	hp:1,
	awareNpc:1,
	combatType:'player',
	targetIf:'npc',
	damageIf:'npc',
	abilityList:[
		s.newNpc.abilityList(s.newAbility(null,'dart',{},{
			spd:40,
			dmg:s.newAbility.dmg(200,'range'),
		}),[1,1,1]),
	],
});
s.newNpc("tower-ice",{
	name:"Tower",
	sprite:s.newNpc.sprite("tower-blue"),
	nevermove:1,
	modAmount:0,
	alwaysActive:true,
	hp:1,
	awareNpc:1,
	combatType:'player',
	targetIf:'npc',
	damageIf:'npc',
	abilityList:[
		s.newNpc.abilityList(s.newAbility(null,'coldBullet',{},{
			spd:40,amount:5,angle:50,
			chill:s.newAbility.status(1,0.5,1),
			dmg:s.newAbility.dmg(1,'cold'),
		}),[1,1,1]),
	],
});
s.newNpc("tower-aoe",{
	name:"Tower",
	sprite:s.newNpc.sprite("tower-red"),
	nevermove:1,
	modAmount:0,
	alwaysActive:true,
	hp:1,
	awareNpc:1,
	combatType:'player',
	targetIf:'npc',
	damageIf:'npc',
	abilityList:[
		s.newNpc.abilityList(s.newAbility(null,'fireBomb',{},{
			delay:0,maxHit:3,
			dmg:s.newAbility.dmg(300,'fire'),
		}),[1,1,1]),
	],
});

s.newMap('main',{
	name:"Tower Defence",
	tileset:"v1.2",
	grid:["0000000110000000110000000","0000001110000000111000000","0000011110000000111100011","0001111100000000011111011","0011111000000000001111100","0111110000000000000111110","0111100000000000000011110","0110000000000000000000110","0110000000000000000110110","0110000000000000000110110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0111111111111110000000110","0111111111111110000000110","0111111111111110000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000111111111111110","0110000000111111111111110","0110000000111111111111110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0111111100000000000000110","0111111100000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0011111100000000001111100","0111111110000000011111110","0110000011000000110011110","0000000001100001100011110"],
	lvl:0,
},{
	spot:{"e1":{"x":400,"y":80},"b1":[256,544,1504,1632],"t1":{"x":416,"y":1584}},
	path:{"blue":[{"x":400,"y":240},{"x":592,"y":432},{"x":592,"y":784},{"x":208,"y":784},{"x":208,"y":1200},{"x":432,"y":1328},{"x":432,"y":1616}]},
	loop:function(spot){
		if(!s.interval(50)) return;	//every 2 sec
		var list = m.collision.npc(spot.b1);	//check mushroom reached end
		for(var i = 0 ; i < list.length; i++){
			s.killActor(list[i]);				//if so kill mushroom
			if(m.mapForEach(spot,s.event('reachEnd')) === 'return') return;	//makes player lose life
			
			//the === 'return' is used to prevent a bug. 
			//if 2 mushroom in list, player dies cuz of 1st one, teleport outside of map and delete instance
			//the loop continues and tries to access 2nd mushroom that no longer exists and crash
		}
	}, 
});
s.newMapAddon('QfirstTown-east',{
	spot:{"t3":{"x":752,"y":48},"t2":{"x":1232,"y":48},"a":{"x":1648,"y":208},"t8":{"x":48,"y":272},"t1":{"x":48,"y":528},"t7":{"x":48,"y":816},"t5":{"x":3152,"y":1008},"undefined":{"x":1360,"y":1200},"t4":{"x":1680,"y":1552},"t6":{"x":2896,"y":1552}},
	load:function(spot){
		m.spawnTeleport(spot.t2,s.event('startGame'),'zone',{angle:270});
	},
});

s.exports(exports);






