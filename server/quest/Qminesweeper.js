/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
"use strict";
var s = require('./../Quest_exports').init('v1.0','Qminesweeper',{
	name:'Minesweeper',
	scoreModInfo:'Depends on your time.',
});
var q = s.quest; var m = s.map; var b = s.boss;

s.newVariable({
	clickCount:0,
	chrono:0,
	flagCount:0,
});

s.newChallenge('speedrun','Speedrunner','Complete the quest in less than 30 seconds.',null,function(key){
	return s.get(key,'chrono') < 25*30;	
},2);
s.newChallenge('monster','Dodge And Mine','Complete the quest while monsters attack you.',null,null,2);
s.newChallenge('noflag','No Flag','You can\'t use flag.',null,null,1.2);

s.newHighscore('speedrun','Fastest Time [Easy]','Fastest Completion','ascending',function(key){
	return s.get(key,'chrono') * 40;	
});
s.newHighscore('speedrunHard','Fastest Time [Hard]','Fastest Completion with Challenge "Dodge & Mine" active.','ascending',function(key){
	if(!s.getChallenge(key,'monster')) return null;
	return s.get(key,'chrono') * 40;	
});
s.newHighscore('noflag','Fastest Time [No Flag]','Fastest Completion with Challenge "No Flag" active.','ascending',function(key){
	if(!s.getChallenge(key,'noflag')) return null;
	return s.get(key,'chrono') * 40;	
});

var SIZE = 10, BOMB = -1, BOMBAMOUNT = 15,CLICKTOWIN = SIZE*SIZE-BOMBAMOUNT;

s.newEvent('_start',function(key){
	if(s.isAtSpot(key,'QfirstTown-north','t5',200))
		s.event('startGame',key);
});
s.newEvent('_getScoreMod',function(key){
	if(s.get(key,'chrono') < 25*15) return 6;
	if(s.get(key,'chrono') < 25*20) return 4;
	if(s.get(key,'chrono') < 25*25) return 2;
	if(s.get(key,'chrono') < 25*30) return 1.5;
	if(s.get(key,'chrono') < 25*45) return 1.2;
	if(s.get(key,'chrono') < 25*60) return 1.1;
});
s.newEvent('_hint',function(key){
	return 'Left: Mine<br>Shift-Right: Flag';
});
s.newEvent('_testSignIn',function(key){	
	s.teleport(key,'QfirstTown-north','t5','main'); 
});
s.newEvent('_signIn',function(key){	
	s.abandonQuest(key);
});
s.newEvent('_death',function(key){	
	s.abandonQuest(key);
});
s.newEvent('_abandon',function(key){
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-north','t5','main',false);
	s.attackOn(key);
});
s.newEvent('_complete',function(key){
	s.set(key,'chrono',s.chrono(key,'timer','stop'));
	s.event('_abandon',key);
});
s.newEvent('newGrid',function(){
	var grid = s.event('generateBombGrid',null);
	return s.event('generateFullGrid',grid);
});
s.newEvent('generateBombGrid',function(){
	var bombPosition = [];
	for(var i = 0 ; i < BOMBAMOUNT; i++){
		do {
			var num = Math.floor(Math.random()*100);
		} while(bombPosition.have(num))	//prevent duplicate
			
		bombPosition.push(num);
	}
	
	var grid = [];
	for(var i = 0 ; i < SIZE; i++){
		grid[i] = [];
		for(var j = 0 ; j < SIZE; j++){
			var num = i + j*10;
			grid[i][j] = bombPosition.have(num) ? BOMB : 0;
		}
	}
	return grid;	
});
s.newEvent('generateFullGrid',function(grid){
	for(var i = 0 ; i < grid.length; i++){
		for(var j = 0 ; j < grid[i].length; j++){
			if(grid[i][j] !== BOMB)
				grid[i][j] = s.event('getBombAround',grid,i,j);
		}
	}
	return grid;
});
s.newEvent('getBombAround',function(grid,i,j){
	var count = 0;
	if(grid[i-1]){
		if(grid[i-1][j] === BOMB) count++;	
		if(grid[i-1][j-1] === BOMB) count++;	
		if(grid[i-1][j+1] === BOMB) count++;	
	}
	if(grid[i+1]){
		if(grid[i+1][j] === BOMB) count++;	
		if(grid[i+1][j-1] === BOMB) count++;	
		if(grid[i+1][j+1] === BOMB) count++;	
	}
	if(grid[i]){
		if(grid[i][j] === BOMB) count++;	
		if(grid[i][j-1] === BOMB) count++;	
		if(grid[i][j+1] === BOMB) count++;	
	}
	return count;
});
s.newEvent('startGame',function(key){	//teleport and spawn enemy
	if(!s.startQuest(key)) return;
	s.chrono(key,'timer','start',true);
	s.teleport(key,'field','t1','solo',true);
	s.setRespawn(key,'QfirstTown-north','t5','main');
	s.chat(key,'Left: Mine, Shift-Right: Flag');
	s.attackOff(key);
	
	if(s.getChallenge(key,'monster')){
		s.spawnActor(key,'field','t1','death',{modAmount:0});
		s.spawnActor(key,'field','t1','bat',{modAmount:0});
		s.spawnActor(key,'field','t1','skeleton',{modAmount:0});
		s.spawnActor(key,'field','t1','mushroom',{modAmount:0});
		s.boost(key,'mine','hp-regen',10);
	}
	
});
s.newEvent('clickLeft',function(key,eid){
	if(!eid) return;	//caused by 0 proliferation
	var tag = s.getTag(eid);
	if(tag.state === 'flag' || tag.state === 'clicked') return;
	if(tag.value === BOMB){
		s.chat(key,'You clicked on a bomb!');
		if(s.get(key,'clickCount') === 0)
			return s.chat(key,'But because it\'s your first click, I will let you survive.');
		return s.abandonQuest(key) || false;
	}		
	s.add(key,'clickCount',1);
	if(s.get(key,'clickCount') >= CLICKTOWIN)
		return s.completeQuest(key) || false;
	s.setSprite(eid,'number-'+tag.value);
	s.setTag(eid,'state','clicked');
	
	if(tag.value === 0){
		var x = tag.positionX, y = tag.positionY;
		if(s.event('clickLeft',key,s.getNpcInMap(key,'field','position',(x-1)+'-'+(y-1))[0]) === false) return;	//=== false return is to prevent bug. if complete quest, map is destroyed
		if(s.event('clickLeft',key,s.getNpcInMap(key,'field','position',(x-1)+'-'+(y))[0]) === false) return;
		if(s.event('clickLeft',key,s.getNpcInMap(key,'field','position',(x-1)+'-'+(y+1))[0])=== false) return;
		if(s.event('clickLeft',key,s.getNpcInMap(key,'field','position',(x)+'-'+(y-1))[0])=== false) return;
		if(s.event('clickLeft',key,s.getNpcInMap(key,'field','position',(x)+'-'+(y+1))[0]) === false) return;
		if(s.event('clickLeft',key,s.getNpcInMap(key,'field','position',(x+1)+'-'+(y-1))[0]) === false) return;
		if(s.event('clickLeft',key,s.getNpcInMap(key,'field','position',(x+1)+'-'+(y))[0]) === false) return;
		if(s.event('clickLeft',key,s.getNpcInMap(key,'field','position',(x+1)+'-'+(y+1))[0]) === false) return;
	}
});
s.newEvent('clickRight',function(key,eid){
	if(s.getChallenge(key,'noflag')) return;
	var tag = s.getTag(eid);
	if(tag.state === 'clicked') return;
	if(tag.state === 'flag'){
		s.add(key,'flagCount',-1);
		s.setSprite(eid,'number-empty');
		return s.setTag(eid,'state','hidden');
	}
	if(tag.state === 'hidden'){
		if(s.get(key,'flagCount') >= BOMBAMOUNT) s.chat(key,"WARNING: You have more flags than the amount of bombs.");
		s.add(key,'flagCount',1);
		s.setSprite(eid,'number-flag');
		return s.setTag(eid,'state','flag');
	}
});

s.newNpc("unknown",{
	name:"",
	sprite:s.newNpc.sprite("number-empty"),
	nevercombat:1,
	nevermove:1,
	hideOptionList:true,
});

s.newMap('field',{
	name:"Minesweeper",
	tileset:"v1.2",
	grid:["11111111111111111111111111","11111111111111111111111111","11111111111111111111111111","11111111111111111111111111","11111111111111111111111111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11111111111111111111111111","11111111111111111111111111","11111111111111111111111111"],
	lvl:0,
},{
	spot:{"a":{"x":128,"y":192},"t1":{"x":400,"y":464}},
	load:function(spot){
		var grid = s.event('newGrid',null);
		for(var i = 0 ; i < grid.length ; i++){
			for(var j = 0 ; j < grid[i].length ; j++){
				m.spawnActor(m.spotTranslation(spot.a,i*64,j*64),'unknown',{
					tag:{value:grid[i][j],state:'hidden',positionX:i,positionY:j,position:i + '-' + j},
					shiftRightClick:{name:'Flag',event:s.event('clickRight')},
					leftClick:{name:'Mine',event:s.event('clickLeft')},
				});
			}
		}
	},
});

s.newMapAddon('QfirstTown-north',{
	spot:{"t3":{"x":1728,"y":48},"t8":{"x":880,"y":208},"t4":{"x":3152,"y":432},"t7":{"x":1232,"y":1232},"t2":{"x":48,"y":1264},"t5":{"x":3152,"y":1792},"t6":{"x":3152,"y":2448},"t1":{"x":1280,"y":3152}},
	load:function(spot){
		m.spawnTeleport(spot.t5,s.event('startGame'),'zone','right');
	},
});

s.exports(exports);





