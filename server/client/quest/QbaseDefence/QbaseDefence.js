//11/28/2014 4:11 PM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*//*global True, False, loadAPI*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/

'use strict';
var s = loadAPI('v1.0','QbaseDefence',{
	name:"Defend The Base",
	author:"",
	reward:{"exp":0.2,"item":0.2,"reputation":{"min":1,"max":2,"mod":10}}
});
var m = s.map; var b = s.boss;

/* COMMENT:
kill zombies by using the right ability
get pt by killing them, use pt to upgrade self
if survive all waves, win
*/

s.newVariable({
	wave:0,
	amountWave:15,
	pt:125,
	life:5,
	upgradeLife:0,
	upgradeAmount:0,
	upgradeSpd:0
});

s.newHighscore('remainingpteasy',"Remaining Pts [Easy]","Most points at the end of the game.",'descending',function(key){
	if(!s.isChallengeActive(key,'hardmode') && !s.isChallengeActive(key,'color4')) return s.get(key,'pt');	
	return null;
});
s.newHighscore('remainingpthard',"Remaining Pts [Hard]","Most points at the end of the game with challenge Hardmode active.",'descending',function(key){
	if(s.isChallengeActive(key,'hardmode')) return s.get(key,'pt');	
	return null;
});
s.newHighscore('remainingpt4',"Remaining Pts [4 Colors]","Most points at the end of the game with challenge 4 Colors active.",'descending',function(key){
	if(s.isChallengeActive(key,'color4')) return s.get(key,'pt');	
	return null;
});

s.newChallenge('hardmode',"Hardmode!","Only 3 Life. Survive 20 waves.",2,function(key){
	
});
s.newChallenge('pt400',"400+ Pts","End the quest with 400 remaining points.",2,function(key){
	return s.get(key,'pt') > 400;
});
s.newChallenge('color4',"4 Types","There are 4 types of enemies.",2,function(key){
	
});

s.newEvent('_start',function(key){ //
	if(s.isAtSpot(key,'QfirstTown-east','t4',200))
		s.callEvent('startGame',key);
});
s.newEvent('_hint',function(key){ //
	return 'Pt: ' + s.get(key,'pt') + ' | Wave: ' + s.get(key,'wave') + '/' + s.get(key,'amountWave') + ' | Life: ' + s.get(key,'life');
});
s.newEvent('_debugSignIn',function(key){ //
	s.teleport(key,'QfirstTown-east','t4','main');
});
s.newEvent('_signIn',function(key){ //
	s.failQuest(key);
});
s.newEvent('_death',function(key){ //
	s.failQuest(key);
});
s.newEvent('_abandon',function(key){ //
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-east','t4','main',false);
});
s.newEvent('_complete',function(key){ //
	s.callEvent('_abandon',key);
});
s.newEvent('startGame',function(key){ //
	if(!s.startQuest(key)) return;
	
	s.teleport(key,'base','t1','solo',true);
	s.addItem(key,'upgradeSpd');
	s.addItem(key,'upgradeAmount');
	s.displayPopup(key,'Use items to upgrade attack.');
	
	if(s.isChallengeActive(key,'hardmode')){
		s.set(key,'life',3);
		s.set(key,'amountWave',20);
		s.set(key,'pt',0);
	}
	
	if(!s.isChallengeActive(key,'color4')){
		s.message(key,'Use the right ability to defeat the enemies ([$0], [$1], [$5]).');
		s.usePreset(key,'color3');
	} else {
		s.message(key,'Use the right ability to defeat the enemies ([$0], [$1], [$2], [$3]).');
		s.usePreset(key,'color4');
	}
	s.setTimeout(key,'nextWave',10*25);	//call the first wave in 10 sec
});
s.newEvent('nextWave',function(key){ //
	if(s.get(key,'wave') >= s.get(key,'amountWave')){ 	//if survived long enough, complete quest
		return s.completeQuest(key); 
	}
	if(!s.isInMap(key,'base')) 	
		return s.ERROR('nextWave timeout should have been removed if no longer in map');
	
	var info = s.callEvent('getWaveInfo',s.get(key,'wave'));		//get info about wave. [amount,time]
	
	for(var i = 0 ; i < info.amount; i++){
		s.callEvent('spawnEnemy',key);
	}
	
	s.add(key,'wave',1);
	s.setTimeout(key,'nextWave',info.time*25);	//set next wave
});
s.newEvent('getWaveInfo',function(num){ //
	if(num === 0) return {amount:2,time:15};
	if(num === 1) return {amount:3,time:8};
	if(num === 2) return {amount:3,time:8};
	if(num === 3) return {amount:4,time:7};
	if(num === 4) return {amount:4,time:7};
	if(num === 5) return {amount:5,time:6};
	if(num === 6) return {amount:5,time:6};
	if(num === 7) return {amount:6,time:6};
	if(num === 8) return {amount:6,time:6};
	if(num === 9) return {amount:7,time:5};
	if(num === 10) return {amount:7,time:5};
	if(num === 11) return {amount:8,time:8};
	if(num === 12) return {amount:8,time:10};
	if(num === 13) return {amount:8,time:10};
	if(num === 14) return {amount:8,time:10};
	//if challenge
	if(num === 15) return {amount:8,time:5};
	if(num === 16) return {amount:9,time:5};
	if(num === 17) return {amount:10,time:5};
	if(num === 18) return {amount:10,time:5};
	if(num === 19) return {amount:10,time:15};
	return s.ERROR('bad wave:' + num);
});
s.newEvent('spawnEnemy',function(key){ //
	var color = s.isChallengeActive(key,'color4') 
		? ['red','blue','yellow','green'].random() 
		: ['red','blue','yellow'].random();
	var spot = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s'].random();
	var eid = s.spawnActor(key,'base',spot,color,{deathEvent:'killEnemy',v:32});
	
	s.followPath(eid,'myPath',function(){	//no key in param cuz using key of nextWave
		s.killActor(eid);
		if(s.add(key,'life',-1) <= 0)
			s.failQuest(key);
	},true);
});
s.newEvent('killEnemy',function(key){ //
	s.callEvent('addPt',key);
});
s.newEvent('addPt',function(key){ //
	var currentPt = s.get(key,'pt');
	var ptToAdd = s.callEvent('getPtToAdd',key,currentPt);
	s.add(key,'pt',ptToAdd);
});
s.newEvent('getPtToAdd',function(key){ //the more pt you save, the more you get
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
s.newEvent('upgradeSpd',function(key){ //
	var cost = 50 * (1 + s.get(key,'upgradeSpd'));
	if(s.get(key,'pt') < cost) 
		return s.message(key,'You need ' + cost + ' points.');
	s.add(key,'pt',-cost);
	s.add(key,'upgradeSpd',1);
	
	var boost = 1 + s.get(key,'upgradeSpd')*0.5;
	s.addBoost(key,'atkSpd',boost);
	
	s.message(key,'You shoot x' + boost + ' faster now.');
});
s.newEvent('upgradeAmount',function(key){ //
	var cost = 200 * (1 + s.get(key,'upgradeAmount'));
	if(s.get(key,'pt') < cost) 
		return s.message(key,'You need ' + cost + ' points.');
	s.add(key,'pt',-cost);
	s.add(key,'upgradeAmount',1);
	
	var boost = 1 + s.get(key,'upgradeAmount')*2;
	s.addBoost(key,'bullet-amount',boost);
	
	s.message(key,'You shoot ' + boost + ' at a time now.');
});
s.newEvent('reachEnd',function(key){ //when mushroom reach end
	if(s.add(key,'life',-1) <= 0){
		s.message(key,"You lost because too many enemies past through your defence.");
		s.failQuest(key);
		return true;	//stops the loop in the map loop
	}
});

s.newItem('upgradeAmount',"Amount",'element.range',[    //{
	s.newItem.option('upgradeAmount',"Upgrade Amount","Increase how many bullet you shoot.")
],''); //}
s.newItem('upgradeSpd',"Speed",'defensive.speed',[    //{
	s.newItem.option('upgradeSpd',"Upgrade Spd","Upgrade Attack Speed.")
],''); //}

s.newAbility('green','attack',{
	name:"Green",
	icon:'offensive.bullet',
	description:"This is an ability.",
	periodOwn:15,
	periodGlobal:15
},{
	type:'bullet',
	dmg:s.newAbility.dmg(10,'range'),
	hitAnim:s.newAbility.anim('earthBomb',0.4),
	sprite:s.newAbility.sprite('rock',1)
});
s.newAbility('red','attack',{
	name:"Red",
	icon:'attackMagic.fireball',
	description:"This is an ability.",
	periodOwn:15,
	periodGlobal:15
},{
	type:'bullet',
	dmg:s.newAbility.dmg(10,'fire'),
	hitAnim:s.newAbility.anim('fireHit',0.5),
	sprite:s.newAbility.sprite('fireball',1.2)
});
s.newAbility('blue','attack',{
	name:"Blue",
	icon:'attackMagic.crystal',
	description:"This is an ability.",
	periodOwn:15,
	periodGlobal:15
},{
	type:'bullet',
	dmg:s.newAbility.dmg(10,'cold'),
	hitAnim:s.newAbility.anim('coldHit',0.5),
	sprite:s.newAbility.sprite('iceshard',1)
});
s.newAbility('yellow','attack',{
	name:"Yellow",
	icon:'attackMagic.static',
	description:"This is an ability.",
	periodOwn:15,
	periodGlobal:15
},{
	type:'bullet',
	dmg:s.newAbility.dmg(10,'lightning'),
	hitAnim:s.newAbility.anim('lightningHit',0.5),
	sprite:s.newAbility.sprite('lightningball',1)
});

s.newPreset('color3',s.newPreset.ability(['blue','red','','','','yellow']),null,False,False,False,False);
s.newPreset('color4',s.newPreset.ability(['blue','red','yellow','green','','']),null,False,False,False,False);

s.newNpc('blue',{
	name:"Blue",
	hp:4,
	alwaysActive:True,
	ghost:True,
	maxSpd:s.newNpc.maxSpd(0.25),
	sprite:s.newNpc.sprite('tower-blue',1),
	mastery:s.newNpc.mastery([1000,1000,1000,1000,0.001,1000]),
	targetIf:'false',
	damageIf:'false'
});
s.newNpc('yellow',{
	name:"Yellow",
	hp:4,
	alwaysActive:True,
	ghost:True,
	maxSpd:s.newNpc.maxSpd(0.25),
	sprite:s.newNpc.sprite('tower-yellow',1),
	mastery:s.newNpc.mastery([1000,1000,1000,1000,1000,0.001]),
	targetIf:'false',
	damageIf:'false'
});
s.newNpc('red',{
	name:"Red",
	hp:4,
	alwaysActive:True,
	ghost:True,
	maxSpd:s.newNpc.maxSpd(0.25),
	sprite:s.newNpc.sprite('tower-red',1),
	mastery:s.newNpc.mastery([1000,1000,1000,0.001,1000,1000]),
	targetIf:'false',
	damageIf:'false'
});
s.newNpc('green',{
	name:"Green",
	hp:4,
	alwaysActive:True,
	ghost:True,
	maxSpd:s.newNpc.maxSpd(0.25),
	sprite:s.newNpc.sprite('tower-green',1),
	mastery:s.newNpc.mastery([1000,0.001,1000,1000,1000,1000]),
	targetIf:'false',
	damageIf:'false'
});

s.newMap('base',{
	name:"Base",
	lvl:0,
	grid:["00000000000111100110011000000000000001100000000000","00000000000011111111111000000000000001110001100000","00000000000001111111111000000000000001111001100000","00000000000000111111110000000000000000111111111110","10000000000000011111100000000000000000011111111110","11000000000000001111000000000000000000001111111111","01100000000000000110000000000000000000000111111111","00110000000000000000000000000000000000000001111111","00011000000000000000000000000000000000000001111111","00001100000000000000000000000000000000000001111111","00001110000000000000000000000000000000000000111111","01111111000000000000000000000000000000000000011111","01111111000000000000000000000000000000000000001111","00011111000000000000000000000000000000000000000111","00011110000000000000000000000000000000000000000000","01111100000000000000000000000000000000000000000000","11111000000000000000000000000000000000000000000000","11110000000000000000000000000000000000000000000000","11100000000000000000000000000000000000000000000000","10000000000000000000000000000000000000000000011111","00000000000000000000000022222220000000000000111111","00000000000000000000000222222222000000000001111111","00000000000000000000000220000022000000000011111111","00000000000000000000000220000022000000000011111111","00000000000000000000000220000022000000000011111100","00000000000000000000000220000022000000000001111100","00000000000000000000000220000022000000000000111110","00000000000000000000000222222222000000000000011111","00000000000000000000000022222220000000000000001111","11000000000000000000000000000000000000000000000011","11100000000000000000000000000000000000000000000001","11110000000000000000000000000000000000000000000000","11111000000000000000000000000000000000000000000000","01111000000000000000000000000000000000000000000000","01111000000000000000000000000000000000000000000000","11110000000000000000000000000000000000000000000000","11100000000000000000000000000000000000000000000000","11000000000000000000000000000000000000000000000000","10000000000000000000000000000000000000000000000011","00000000000000000000000000000000000000000000000111","00000000000000000000000000000000000000000000001100","00000000000000000000000000000000000000000000011000","00000000000000000000000000000000000000000000011000","00000000000000000000000000000000000000000000011000","00000000000000000000000000000000000000000011111000","00000000000000011111100000000000000000000111111110","00000000000111111111110000000000000000001111111111","00000000001111111111111000000000000000011111111111","00000000011000001111001100000000000000011001111110","00000000110000001111001100000000000000011000000000"],
	tileset:'v1.2'
},{
	spot:{c:{x:272,y:48},d:{x:816,y:48},e:{x:944,y:48},f:{x:1072,y:48},b:{x:176,y:80},a:{x:112,y:144},g:{x:1488,y:464},s:{x:48,y:688},r:{x:48,y:784},blue0:{x:880,y:784},t1:{x:880,y:816},q:{x:48,y:880},h:{x:1552,y:1072},i:{x:1552,y:1168},p:{x:48,y:1392},o:{x:80,y:1488},n:{x:144,y:1552},m:{x:848,y:1552},l:{x:944,y:1552},k:{x:1040,y:1552},j:{x:1168,y:1552}},
	load:function(spot){
		
	}
});
s.newMapAddon('QfirstTown-east',{
	spot:{t3:{x:752,y:48},t2:{x:1232,y:48},a:{x:1648,y:208},t8:{x:48,y:272},s3:{x:2368,y:336},s5:{x:2112,y:560},t1:{x:48,y:528},e1:{x:1136,y:784},t7:{x:48,y:816},s4:{x:704,y:912},e2:{x:2064,y:944},t5:{x:3152,y:1008},s1:{x:2496,y:1168},undefined:{x:1360,y:1200},s2:{x:1056,y:1392},t4:{x:1680,y:1552},t6:{x:2896,y:1552}},
	load:function(spot){
		m.spawnTeleporter(spot.t4,'startGame','zone','down');
		
		m.spawnActorGroup(spot.e1,[
			m.spawnActorGroup.list("slime",1),
			m.spawnActorGroup.list("death",1),
		]);
		m.spawnActorGroup(spot.e2,[
			m.spawnActorGroup.list("demon",1),
			m.spawnActorGroup.list("spirit",1),
		]);
	}
});

s.newPath('myPath',s.newPath.compileSpotList('base',s.newPath.spotList([s.newPath.spotChain('blue',0,0)])));

s.exports(exports);
