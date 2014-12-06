//11/27/2014 10:59 AM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*//*global True, False, loadAPI*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/

'use strict';
var s = loadAPI('v1.0','Qfifteen',{
	name:'15-Puzzle',
	author:'',
	scoreModInfo:'Depends on your time.'
});
var m = s.map; var b = s.boss;

/* COMMENT:
Bug: moving 2 blocks real fast in empty jams the puzzle
use map.load(spot,key)
*/

s.newVariable({
	pushCount:0,
	chrono:0,
	order:''
});

s.newHighscore('speedrun',"Fastest Time [Easy]","Fastest Completion",'ascending',function(key){
	return s.get(key,'chrono') * 40;
});
s.newHighscore('speedrunShuffle',"Fastest Time [Shuffle]","Fastest Completion with Challenge Shuffle active.",'ascending',function(key){
	if(!s.isChallengeActive(key,'shuffle')) return null;
	return s.get(key,'chrono') * 40;
});

s.newChallenge('speedrun',"Speedrunner","Complete the quest in less than 2 minutes.",2,function(key){
	return s.get(key,'chrono') < 25*2*60;
});
s.newChallenge('wise',"Master Mind","Complete the quest in less than 125 moves.",2,function(key){
	return s.get(key,'pushCount') < 125;
});
s.newChallenge('shuffle',"Shuffle","You need to order the numbers in a custom order.",2.5,function(key){
	
});

s.newEvent('_start',function(key){ //
	if(s.isAtSpot(key,'QfirstTown-north','t6',200))
		s.callEvent('startGame',key);
});
s.newEvent('_hint',function(key){ //
	if(s.isChallengeActive(key,'shuffle')){
		var array = s.get(key,'order');
		return 'Place numbers in this order: <br> ' 
			+ array.slice(0,4) + '<br> ' 
			+ array.slice(4,8) + '<br> ' 
			+ array.slice(8,12) + '<br> ' 
			+ array.slice(12,16);
	}
	return 'Place the blocks in ascending order.<br>Empty spot should be at bottom right.';
});
s.newEvent('_debugSignIn',function(key){ //
	s.teleport(key,'QfirstTown-north','t6','main');
});
s.newEvent('_signIn',function(key){ //
	s.failQuest(key);
});
s.newEvent('_death',function(key){ //
	s.failQuest(key);
});
s.newEvent('_abandon',function(key){ //
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-north','t6','main',false);
});
s.newEvent('_complete',function(key){ //
	s.set(key,'chrono',s.stopChrono(key,'timer'));
	s.callEvent('_abandon',key);
});
s.newEvent('getGrid',function(dimension){ //
	do {
		var tmp = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].sort(function(){ return Math.randomML(); });
	} while(!s.callEvent('isSolvable',tmp))
	if(dimension === 1) return tmp;
	
	var array = [];
	for(var i = 0 ; i < 4 ; i++){
		array[i] = [];
		for(var j = 0 ; j < 4 ; j++){
			array[i][j] = tmp[i*4+j];
		}
	}
	return array;
});
s.newEvent('isSolvable',function(array){ //
	var count = 0;
	for(var i = 0 ; i < array.length; i++)
		for(var j = i ; j < array.length; j++)
			if(array[i] !== 16 && array[i] > array[j]) count++;
			
	if(!(array.indexOf(16) <= 3 || (array.indexOf(16) >= 8 && array.indexOf(16) <= 11)))
		count++;
	return count % 2;
});
s.newEvent('viewPreventBlock',function(key){ //
	return !s.isPlayer(key);
});
s.newEvent('pushBlock',function(key,eid){ //
	s.add(key,'pushCount',1);
	s.setTimeout(key,function(key){
		if(s.callEvent('testWin',key)){
			s.completeQuest(key);
		}
	},25*3);
});
s.newEvent('testWin',function(key){ //
	var bool = true;
	s.forEachActor(key,'field',function(key){
		var tag = s.getTag(key);
		if(!s.isAtPosition(key,tag.goalPositionX,tag.goalPositionY))
			bool = false
	},'npc',null,{'type':'piece'});
	return bool;
});
s.newEvent('startGame',function(key){ //teleport and spawn enemy
	if(!s.startQuest(key)) return;
	s.startChrono(key,'timer',true);
	s.teleport(key,'field','t1','solo',true);
	s.message(key,'Place the blocks in ascending order.');
	s.enableAttack(key,false);
});

s.newMap('field',{
	name:"15-Puzzle",
	lvl:0,
	grid:["111111111111111111","111111111111111111","111111111111111111","111111111111111111","111111111111111111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111111111111111111","111111111111111111","111111111111111111"],
	tileset:'v1.2'
},{
	spot:{a:{x:128,y:192},c:{x:128,y:224},b1:{x:192,y:256},d:{x:416,y:224},e:{x:448,y:224},t1:{x:288,y:352},b:{x:128,y:480},f:{x:128,y:512}},
	load: function(spot){
		return ERROR(3,'tofix...');
		var grid = s.callEvent('getGrid',2);
		var goalGrid = s.isChallengeActive(key,'shuffle') ? s.callEvent('getGrid',1) : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
		
		s.set(key,'order',goalGrid);
		
		for(var i = 0; i < grid.length; i++){
			for(var j = 0; j < grid.length; j++){
				var num = grid[i][j];
				if(num === 16) continue;
				m.spawnActor(m.translateSpot(spot.b1,j*64,i*64),'pushable-rock2x2',{
					tag:{
						number:grid[i][j],
						type:'piece',
						goalPositionX:spot.b1.x + 64 * (goalGrid.indexOf(num) % 4),
						goalPositionY:spot.b1.y + 64 * (Math.floor(goalGrid.indexOf(num) / 4)),
					},
					block:s.newNpc.block(s.newNpc.block.size(2,2),1,'npc'),
					sprite:s.newNpc.sprite('number-'+grid[i][j],1),
					pushable:s.newNpc.pushable(8,8,'pushBlock'),
				});
			}
		}
		
		//to walk around
		m.spawnBlock(spot.a,'viewPreventBlock','invisible');
		m.spawnBlock(spot.b,'viewPreventBlock','invisible');
		m.spawnBlock(spot.c,'viewPreventBlock','invisible');
		m.spawnBlock(spot.d,'viewPreventBlock','invisible');
		m.spawnBlock(spot.e,'viewPreventBlock','invisible');
		m.spawnBlock(spot.f,'viewPreventBlock','invisible');
	}
});
s.newMapAddon('QfirstTown-north',{
	spot:{t3:{x:1728,y:48},t8:{x:880,y:208},t4:{x:3152,y:432},t7:{x:1232,y:1232},t2:{x:48,y:1264},t5:{x:3152,y:1792},t6:{x:3152,y:2448},t1:{x:1280,y:3152}},
	load: function(spot){
		m.spawnTeleporter(spot.t6,'startGame','zone','right');
	}
});



s.exports(exports);