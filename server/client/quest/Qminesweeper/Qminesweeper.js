//11/27/2014 5:40 PM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
'use strict';
var s = loadAPI('v1.0','Qminesweeper',{
	name:"Minesweeper",
	author:"",
	scoreModInfo:"Depends on your time."
});
var m = s.map; var b = s.boss;
/* COMMENT:
*/
s.newVariable({
	clickCount:0,
	chrono:0,
	flagCount:0
});
s.newHighscore('speedrun',"Fastest Time [Easy]","Fastest Completion",'ascending',function(key){
	return s.get(key,'chrono') * 40;
});
s.newHighscore('speedrunHard',"Fastest Time [Hard]","Fastest Completion with Challenge Dodge & Mine active.",'ascending',function(key){
	if(!s.isChallengeActive(key,'monster')) return null;
	return s.get(key,'chrono') * 40;
});
s.newHighscore('noflag',"Fastest Time [No Flag]","Fastest Completion with Challenge No Flag active.",'ascending',function(key){
	if(!s.isChallengeActive(key,'noflag')) return null;
	return s.get(key,'chrono') * 40;
});
s.newChallenge('speedrun',"Speedrunner","Complete the quest in less than 30 seconds.",2,function(key){
	return s.get(key,'chrono') < 25*30;
});
s.newChallenge('monster',"Dodge And Mine","Complete the quest while monsters attack you.",2,function(key){
	
});
s.newChallenge('noflag',"No Flag","You can't use flag.",1.2,function(key){
	
});
s.newEvent('_start',function(key){ //
	if(s.isAtSpot(key,'QfirstTown-north','t5',200))
		s.callEvent('startGame',key);
});
s.newEvent('_getScoreMod',function(key){ //
	if(s.get(key,'chrono') < 25*15) return 6;
	if(s.get(key,'chrono') < 25*20) return 4;
	if(s.get(key,'chrono') < 25*25) return 2;
	if(s.get(key,'chrono') < 25*30) return 1.5;
	if(s.get(key,'chrono') < 25*45) return 1.2;
	if(s.get(key,'chrono') < 25*60) return 1.1;
});
s.newEvent('_hint',function(key){ //
	return 'Left: Mine<br>Shift-Right: Flag';
});
s.newEvent('_debugSignIn',function(key){ //
	s.teleport(key,'QfirstTown-north','t5','main');
});
s.newEvent('_signIn',function(key){ //
	s.failQuest(key);
});
s.newEvent('_death',function(key){ //
	s.failQuest(key);
});
s.newEvent('_abandon',function(key){ //
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-north','t5','main',false);
});
s.newEvent('_complete',function(key){ //
	s.set(key,'chrono',s.stopChrono(key,'timer'));
	s.callEvent('_abandon',key);
});
s.newEvent('newGrid',function(){ //
	var grid = s.callEvent('generateBombGrid',null);
	return s.callEvent('generateFullGrid',grid);
});
s.newEvent('getCst',function(what){ //
	switch(what){
		case 'SIZE': return 10;
		case 'BOMB': return -1;
		case 'BOMBAMOUNT': return 15;
		case 'CLICKTOWIN': return s.callEvent('getCst','SIZE')*s.callEvent('getCst','SIZE') - s.callEvent('getCst','BOMBAMOUNT');
	}
	s.ERROR('invalid',what);
});
s.newEvent('generateBombGrid',function(){ //
	var SIZE = s.callEvent('getCst','SIZE');
	
	var bombPosition = [];
	for(var i = 0 ; i < s.callEvent('getCst','BOMBAMOUNT'); i++){
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
			grid[i][j] = bombPosition.have(num) ? s.callEvent('getCst','BOMB') : 0;
		}
	}
	return grid;
});
s.newEvent('generateFullGrid',function(grid){ //
	for(var i = 0 ; i < grid.length; i++){
		for(var j = 0 ; j < grid[i].length; j++){
			if(grid[i][j] !== s.callEvent('getCst','BOMB'))
				grid[i][j] = s.callEvent('getBombAround',grid,i,j);
		}
	}
	return grid;
});
s.newEvent('getBombAround',function(grid,i,j){ //
	var BOMB = s.callEvent('getCst','BOMB');
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
s.newEvent('startGame',function(key){ //teleport and spawn enemy
	if(!s.startQuest(key)) return;
	s.startChrono(key,'timer',true);
	s.teleport(key,'field','t1','party',true);
	s.setRespawn(key,'QfirstTown-north','t5','main');
	s.message(key,'Left: Mine, Shift-Right: Flag');
	s.enableAttack(key,false);
	
	if(s.isChallengeActive(key,'monster')){
		s.spawnActor(key,'field','t1','death');
		s.spawnActor(key,'field','t1','bat');
		s.spawnActor(key,'field','t1','skeleton');
		s.spawnActor(key,'field','t1','mushroom');
		s.addBoost(key,'hp-regen',10);
	}
});
s.newEvent('clickLeft',function(key,eid){ //
	if(!eid) return;	//caused by 0 proliferation
	var tag = s.getTag(eid);
	if(tag.state === 'flag' || tag.state === 'clicked') return;
	if(tag.value === s.callEvent('getCst','BOMB')){
		s.message(key,'You clicked on a bomb!');
		if(s.get(key,'clickCount') === 0)
			return s.message(key,'But because it\'s your first click, I will let you survive.');
		return s.failQuest(key) || false;
	}		
	s.add(key,'clickCount',1);
	if(s.get(key,'clickCount') >= s.callEvent('getCst','CLICKTOWIN'))
		return s.completeQuest(key) || false;
	s.setSprite(eid,'number-'+tag.value);
	s.setTag(eid,'state','clicked');
	
	if(tag.value === 0){	//proliferation
		var x = tag.positionX, y = tag.positionY;
		if(s.callEvent('clickLeft',key,s.getRandomNpc(key,'field',{position:(x-1)+'-'+(y-1)})) === false) return;	//=== false return is to prevent bug. if complete quest, map is destroyed
		if(s.callEvent('clickLeft',key,s.getRandomNpc(key,'field',{position:(x-1)+'-'+(y)})) === false) return;
		if(s.callEvent('clickLeft',key,s.getRandomNpc(key,'field',{position:(x-1)+'-'+(y+1)}))=== false) return;
		if(s.callEvent('clickLeft',key,s.getRandomNpc(key,'field',{position:(x)+'-'+(y-1)}))=== false) return;
		if(s.callEvent('clickLeft',key,s.getRandomNpc(key,'field',{position:(x)+'-'+(y+1)})) === false) return;
		if(s.callEvent('clickLeft',key,s.getRandomNpc(key,'field',{position:(x+1)+'-'+(y-1)})) === false) return;
		if(s.callEvent('clickLeft',key,s.getRandomNpc(key,'field',{position:(x+1)+'-'+(y)})) === false) return;
		if(s.callEvent('clickLeft',key,s.getRandomNpc(key,'field',{position:(x+1)+'-'+(y+1)})) === false) return;
	}
});
s.newEvent('clickRight',function(key,eid){ //
	if(s.isChallengeActive(key,'noflag')) return;
	var tag = s.getTag(eid);
	if(tag.state === 'clicked') return;
	if(tag.state === 'flag'){
		s.add(key,'flagCount',-1);
		s.setSprite(eid,'number-empty');
		return s.setTag(eid,'state','hidden');
	}
	if(tag.state === 'hidden'){
		if(s.get(key,'flagCount') >= s.callEvent('getCst','BOMBAMOUNT')) s.message(key,"WARNING: You have more flags than the amount of bombs.");
		s.add(key,'flagCount',1);
		s.setSprite(eid,'number-flag');
		return s.setTag(eid,'state','flag');
	}
});
s.newNpc('unknown',{
	name:"",
	nevermove:True,
	nevercombat:True,
	sprite:s.newNpc.sprite('number-empty',1),
	hideOptionList:True
});
s.newMap('field',{
	name:"Minesweeper",
	lvl:0,
	grid:["11111111111111111111111111","11111111111111111111111111","11111111111111111111111111","11111111111111111111111111","11111111111111111111111111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11100000000000000000000111","11111111111111111111111111","11111111111111111111111111","11111111111111111111111111"],
	tileset:'v1.2'
},{
	spot:{a:{x:128,y:192},t1:{x:400,y:464}},
	load: function(spot){
		var grid = s.callEvent('newGrid',null);
		for(var i = 0 ; i < grid.length ; i++){
			for(var j = 0 ; j < grid[i].length ; j++){
				m.spawnActor(m.translateSpot(spot.a,i*64,j*64),'unknown',{
					tag:{
						value:grid[i][j],
						state:'hidden',
						positionX:i,
						positionY:j,
						position:i + '-' + j
					},
					onclick:s.newNpc.onclick(
						null,
						null,
						s.newNpc.onclick.side('Mine','clickLeft'),
						s.newNpc.onclick.side('Flag','clickRight')
					)
				});
			}
		}
	}
});
s.newMapAddon('QfirstTown-north',{
	spot:{t3:{x:1728,y:48},t8:{x:880,y:208},t4:{x:3152,y:432},t7:{x:1232,y:1232},t2:{x:48,y:1264},t5:{x:3152,y:1792},t6:{x:3152,y:2448},t1:{x:1280,y:3152}},
	load: function(spot){
		m.spawnTeleporter(spot.t5,'startGame','zone','right');
	}
});
s.exports(exports);
