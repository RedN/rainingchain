//11/28/2014 3:39 PM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*//*global True, False, loadAPI*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/

'use strict';
var s = loadAPI('v1.0','QtowerDefence',{
	name:"Tower Defence",
	author:"",
	reward:{"exp":0.2,"item":0.2,"reputation":{"min":1,"max":2,"mod":10}}
});
var m = s.map; var b = s.boss;

/* COMMENT:
place towers to kill mushroom
if mushroom reach bottom, lose life
0 life => fail
need survive x waves
*/

s.newVariable({
	wave:0,
	amountWave:15,
	pt:125,
	life:5
});

s.newHighscore('remainingpteasy',"Remaining Pts [Easy]","Most points at the end of the game.",'descending',function(key){
	if(!s.isChallengeActive(key,'hardmode')) return s.get(key,'pt');	
	return null;
});
s.newHighscore('remainingpthard',"Remaining Pts [Hard]","Most points at the end of the game with challenge Hardmode active.",'descending',function(key){
	if(s.isChallengeActive(key,'hardmode')) return s.get(key,'pt');	
	return null;
});

s.newChallenge('hardmode',"Hardmode!","Only 3 Lifes. Survive 20 waves.",2,function(key){
	
});
s.newChallenge('pt400',"400+ Pts","End the quest with 400 remaining points.",2,function(key){
	return s.get(key,'pt') > 400;
});

s.newEvent('_start',function(key){ //
	if(s.isAtSpot(key,'QfirstTown-east','t2',200))
		s.callEvent('startGame',key);
});
s.newEvent('_hint',function(key){ //
	return 'Pt: ' + s.get(key,'pt') + ' | Wave: ' + s.get(key,'wave') + '/' + s.get(key,'amountWave') + ' | Life: ' + s.get(key,'life');
});
s.newEvent('_debugSignIn',function(key){ //
	s.teleport.force(key,1232,48,'QfirstTown-east');
});
s.newEvent('_signIn',function(key){ //
	s.failQuest(key);
});
s.newEvent('_death',function(key){ //
	s.failQuest(key);
});
s.newEvent('_abandon',function(key){ //
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-east','t2','main',false);
});
s.newEvent('_complete',function(key){ //
	s.callEvent('_abandon',key);
});
s.newEvent('startGame',function(key){ //
	s.teleport(key,'main','t1','solo',true);
	s.addItem(key,'basic');
	s.addItem(key,'ice');
	s.addItem(key,'aoe');
	s.displayPopup(key,'Use items to place towers and kill mushrooms.');
	s.message(key,'Use the items "Basic", "Fire" and "Ice" to place towers.');
	s.message(key,'Enemies must not reach the bottom of the map.');
	
	if(s.isChallengeActive(key,'hardmode')){
		s.set(key,'life',3);
		s.set(key,'amountWave',20);
		s.set(key,'pt',100);
	}
	
	s.setTimeout(key,'nextWave',10*25);	//call the first wave in 10 sec
	s.enableAttack(key,false);
});
s.newEvent('nextWave',function(key){ //
	if(s.get(key,'wave') >= s.get(key,'amountWave')){ 	//if survived long enough, complete quest
		return s.completeQuest(key); 
	}
	if(!s.isInMap(key,'main')) 
		return s.ERROR('nextWave timeout should have been removed if no longer in map');
	
	var info = s.callEvent('getWaveInfo',s.get(key,'wave'));
	s.spawnActorGroup(key,'main','e1',false,[	//create group
		s.spawnActorGroup.list(info.model,info.amount,{
			deathEvent:'killEnemy',
			tag:{wave:s.get(key,'wave')},
		})
	],function(eid){
		s.followPath(eid,'myPath',function(){	//no key in param cuz using key of nextWave
			s.killActor(eid);
			if(s.add(key,'life',-1) <= 0)
				s.failQuest(key);
		},true);	
	});
	
	s.add(key,'wave',1);
	s.setTimeout(key,'nextWave',info.time*25);	//set next wave
});
s.newEvent('test',function(key){ //
	s.spawnActorGroup(key,'main','e1',false,[	//create group
		s.spawnActorGroup.list('enemy',123)
	]);
});
s.newEvent('getWaveInfo',function(num){ //
	if(num === 0) return {amount:2,time:15,model:'enemy'};
	if(num === 1) return {amount:3,time:8,model:'enemy'};
	if(num === 2) return {amount:3,time:8,model:'enemy'};
	if(num === 3) return {amount:4,time:7,model:'enemy'};
	if(num === 4) return {amount:4,time:7,model:'enemy'};
	if(num === 5) return {amount:5,time:6,model:'enemy'};
	if(num === 6) return {amount:5,time:6,model:'enemy'};
	if(num === 7) return {amount:6,time:6,model:'enemy2'};
	if(num === 8) return {amount:6,time:6,model:'enemy2'};
	if(num === 9) return {amount:7,time:5,model:'enemy2'};
	if(num === 10) return {amount:7,time:5,model:'enemy2'};
	if(num === 11) return {amount:8,time:5,model:'enemy2'};
	if(num === 12) return {amount:8,time:5,model:'enemy2'};
	if(num === 13) return {amount:10,time:5,model:'enemy2'};
	if(num === 14) return {amount:12,time:15,model:'enemy2'};
	//if challenge
	if(num === 15) return {amount:8,time:3,model:'enemy2'};
	if(num === 16) return {amount:9,time:3,model:'enemy2'};
	if(num === 17) return {amount:10,time:3,model:'enemy2'};
	if(num === 18) return {amount:10,time:3,model:'enemy2'};
	if(num === 19) return {amount:10,time:15,model:'enemy2'};
	return s.ERROR('bad wave:' + num);
});
s.newEvent('killEnemy',function(killer,deadNpc,map){ //
	var key = s.getRandomPlayer(deadNpc,'main');
	s.callEvent('addPt',key)
});
s.newEvent('addPt',function(key){ //
	var currentPt = s.get(key,'pt');
	var ptToAdd = s.callEvent('getPtToAdd',key,currentPt);
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
s.newEvent('testPlaceTower',function(key){ //test if can place tower. if another tower too close, cant
	var bool = true;
	s.forEachActor(key,'main',function(key2){
		if(s.getDistance(key,key2) < 45) 
			bool = false;
	},'npc',null,{tower:true});
	if(!bool){
		s.message(key,"Too close from another tower.")
		return false;
	}
	if(!s.isAtSpot(key,'main','b1')){
		s.message(key,'Place towers between the 2 rows of trees.');
		return false;
	}
	return true;
});
s.newEvent('placeTowerRegular',function(key){ //
	var COST = 25;
	if(!s.callEvent('testPlaceTower',key)) 
		return;
	if(s.get(key,'pt') < COST) 
		return s.message(key,'You need ' + COST + ' points to place the tower.');
	s.spawnActorOnTop(key,'main','tower-normal',{tag:{tower:true}});	//add tower where player is
	s.add(key,'pt',-COST);
});
s.newEvent('placeTowerAoe',function(key){ //
	var COST = 35;
	if(!s.callEvent('testPlaceTower',key)) 
		return s.message(key,"Too close from another tower.");
	if(s.get(key,'pt') < COST) 
		return s.message(key,'You need ' + COST + ' points to place the tower.');
	s.spawnActorOnTop(key,'main','tower-aoe',{tag:{tower:true}});
	s.add(key,'pt',-COST);
});
s.newEvent('placeTowerIce',function(key){ //
	var COST = 50;
	if(!s.callEvent('testPlaceTower',key)) 
		return s.message(key,"Too close from another tower.");
	if(s.get(key,'pt') < COST) 
		return s.message(key,'You need ' + COST + ' points to place the tower.');
	s.spawnActorOnTop(key,'main','tower-ice',{tag:{tower:true}});
	s.add(key,'pt',-COST);
});

s.newItem('basic',"Basic",'element.range2',[    //{
	s.newItem.option('placeTowerRegular',"Basic Tower","Place 1 basic tower. (25 Pts)")
],''); //}
s.newItem('aoe',"Fire",'element.fire2',[    //{
	s.newItem.option('placeTowerAoe',"AoE Tower","Place 1 AoE tower. (35 Pts)")
],''); //}
s.newItem('ice',"Ice",'element.cold2',[    //{
	s.newItem.option('placeTowerIce',"Ice Tower","Place 1 Ice tower. (50 Pts)")
],''); //}

s.newAbility('tower-normal0','attack',{
	name:"dart",
	icon:'attackRange.head',
	periodOwn:10,
	periodGlobal:10,
	delay:5
},{
	type:'bullet',
	dmg:s.newAbility.dmg(200,'range'),
	hitAnim:s.newAbility.anim('strikeHit',0.5),
	spd:40,
	sprite:s.newAbility.sprite('dart',1)
});
s.newAbility('tower-ice0','attack',{
	name:"Cold Bullet",
	icon:'attackMagic.crystal'
},{
	type:'bullet',
	amount:5,
	angleRange:50,
	dmg:s.newAbility.dmg(1,'cold'),
	hitAnim:s.newAbility.anim('coldHit',0.5),
	chill:s.newAbility.status(1,2,1),
	spd:40,
	sprite:s.newAbility.sprite('iceshard',1)
});
s.newAbility('tower-aoe0','attack',{
	name:"fireBomb",
	icon:'attackMagic.fireball',
	periodOwn:50,
	periodGlobal:50,
	delay:5
},{
	type:'strike',
	dmg:s.newAbility.dmg(500,'fire'),
	initPosition:s.newAbility.initPosition(0,200),
	maxHit:3,
	preDelayAnim:s.newAbility.anim('fireBomb',1)
});

s.newNpc('enemy',{
	name:"Mushroom",
	alwaysActive:True,
	sprite:s.newNpc.sprite('tower-enemy',1),
	hideOptionList:True,
	targetIf:'false',
	damageIf:'false'
});
s.newNpc('enemy2',{
	name:"Mushroom",
	alwaysActive:True,
	maxSpd:s.newNpc.maxSpd(1.5),
	sprite:s.newNpc.sprite('tower-enemy',1),
	mastery:s.newNpc.mastery([1,2,1,1,1,1]),
	hideOptionList:True,
	targetIf:'false',
	damageIf:'false'
});
s.newNpc('tower-normal',{
	name:"Tower",
	hp:1,
	nevermove:True,
	alwaysActive:True,
	sprite:s.newNpc.sprite('tower-yellow',0.8),
	awareNpc:True,
	combatType:'player',
	targetIf:'npc',
	damageIf:'npc',
	abilityAi:s.newNpc.abilityAi([
		s.newNpc.abilityAi.ability('tower-normal0',[1,1,1])
	])
});
s.newNpc('tower-ice',{
	name:"Tower",
	hp:1,
	nevermove:True,
	alwaysActive:True,
	sprite:s.newNpc.sprite('tower-blue',0.8),
	awareNpc:True,
	combatType:'player',
	targetIf:'npc',
	damageIf:'npc',
	abilityAi:s.newNpc.abilityAi([
		s.newNpc.abilityAi.ability('tower-ice0',[1,1,1])
	])
});
s.newNpc('tower-aoe',{
	name:"Tower",
	hp:1,
	nevermove:True,
	alwaysActive:True,
	sprite:s.newNpc.sprite('tower-red',0.8),
	awareNpc:True,
	combatType:'player',
	targetIf:'npc',
	damageIf:'npc',
	abilityAi:s.newNpc.abilityAi([
		s.newNpc.abilityAi.ability('tower-aoe0',[1,1,1])
	])
});

s.newMap('main',{
	name:"Tower Defence",
	lvl:0,
	grid:["0110000110000000110011000","1110001110000000111111000","1100011110000000111111111","0001111100000000011111111","0011111000000000001111110","0111110000000000000111110","0111100000000000000011110","0110000000000000000011110","0110000000000000000111110","0110000000000000000111110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0111111111111110000000110","0111111111111110000000110","0111111111111110000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000111111111111110","0110000000111111111111110","0110000000111111111111110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0111111100000000000000110","0111111100000000000000110","0110000000000000000000110","0110000000000000000000110","0110000000000000000000110","0111111100000000001111110","0111111110000000011111110","0110000011000000110011110","0000000001100001100011110"],
	tileset:'v1.2'
},{
	spot:{e1:{x:400,y:80},blue0:{x:400,y:240},blue1:{x:592,y:432},b1:{x:96,y:640,width:608,height:288},blue3:{x:208,y:784},blue2:{x:592,y:784},blue4:{x:208,y:1200},blue5:{x:432,y:1328},t1:{x:400,y:1584},blue6:{x:432,y:1616}},
	load:function(spot){
	
	}
});
s.newMapAddon('QfirstTown-east',{
	spot:{t2:{x:1232,y:48}},
	load:function(spot){
		m.spawnTeleporter(spot.t2,'startGame','zone','up');
	}
});

s.newPath('myPath',s.newPath.compileSpotList('main',s.newPath.spotList([s.newPath.spotChain('blue',0,6)])));

s.exports(exports);
