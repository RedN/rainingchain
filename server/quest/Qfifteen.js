/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
"use strict";
var s = require('./../Quest_exports').init('v1.0','Qfifteen',{
	name:"15-Puzzle",
	scoreModInfo:'Depends on your time.',
});
var q = s.quest; var m = s.map; var b = s.boss;

//Bug: moving 2 blocks real fast in empty jams the puzzle
//use map.load(spot,key)

s.newVariable({
	pushCount:0,
	chrono:0,
	order:'',
});

s.newChallenge('speedrun','Speedrunner','Complete the quest in less than 2 minutes.',null,function(key){
	return s.get(key,'chrono') < 25*2*60;	
},2);
s.newChallenge('wise','Master Mind','Complete the quest in less than 125 moves.',null,function(key){
	return s.get(key,'pushCount') < 125;	
},2);
s.newChallenge('shuffle','Shuffle','You need to order the numbers in a custom order.',null,null,2.5);

s.newHighscore('speedrun','Fastest Time [Easy]','Fastest Completion','ascending',function(key){
	return s.get(key,'chrono') * 40;	
});
s.newHighscore('speedrunShuffle','Fastest Time [Shuffle]','Fastest Completion with Challenge "Shuffle" active.','ascending',function(key){
	if(!s.getChallenge(key,'shuffle')) return null;
	return s.get(key,'chrono') * 40;	
});

s.newEvent('_start',function(key){
	if(s.isAtSpot(key,'QfirstTown-north','t6',200))
		s.event('startGame',key);
});
s.newEvent('_hint',function(key){	
	if(s.getChallenge(key,'shuffle')){
		var array = s.get(key,'order');
		return 'Place numbers in this order: <br> ' 
			+ array.slice(0,4) + '<br> ' 
			+ array.slice(4,8) + '<br> ' 
			+ array.slice(8,12) + '<br> ' 
			+ array.slice(12,16);
	}
	return 'Place the blocks in ascending order.<br>Empty spot should be at bottom right.';
});
s.newEvent('_testSignIn',function(key){	
	s.teleport(key,'QfirstTown-north','t6','main'); 
});
s.newEvent('_signIn',function(key){	
	s.abandonQuest(key);
});
s.newEvent('_death',function(key){	
	s.abandonQuest(key);
});
s.newEvent('_abandon',function(key){
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-north','t6','main',false);
});
s.newEvent('_complete',function(key){
	s.set(key,'chrono',s.chrono(key,'timer','stop'));
	s.event('_abandon',key);
});
s.newEvent('getGrid',function(dimension){
	do {
		var tmp = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].sort(function(){ return Math.randomML(); });
	} while(!s.event('isSolvable',tmp))
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
s.newEvent('isSolvable',function(array){
	var count = 0;
	for(var i = 0 ; i < array.length; i++)
		for(var j = i ; j < array.length; j++)
			if(array[i] !== 16 && array[i] > array[j]) count++;
			
	if(!(array.indexOf(16) <= 3 || (array.indexOf(16) >= 8 && array.indexOf(16) <= 11)))
		count++;
	return count % 2;
});
s.newEvent('viewPreventBlock',function(key){
	return !s.isPlayer(key);
});
s.newEvent('pushBlock',function(key,eid){
	s.add(key,'pushCount',1);
	s.setTimeout(key,'testWin',25*3,function(key){
		if(s.event('testWin',key)){
			s.completeQuest(key);
		}
	});		
});
s.newEvent('testWin',function(key){
	var list = s.getNpcInMap(key,'field','type','piece');
	for(var i in list){
		var tag = s.getTag(list[i]);
		if(!s.isAtPosition(list[i],tag.goalPositionX,tag.goalPositionY)) return false
	}
	return true;
});
s.newEvent('startGame',function(key){	//teleport and spawn enemy
	if(!s.startQuest(key)) return;
	s.chrono(key,'timer','start',true);
	s.teleport(key,'field','t1','solo',true);
	s.chat(key,'Place the blocks in ascending order.');
	s.attackOff(key);
});

s.newMap('field',{
	name:"15-Puzzle",
	tileset:"v1.2",
	grid:["111111111111111111","111111111111111111","111111111111111111","111111111111111111","111111111111111111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111000000000000111","111111111111111111","111111111111111111","111111111111111111"],
	lvl:0,
},{
	spot:{"a":[128,416,192,192],"c":[128,128,224,448],"b1":{"x":192,"y":256},"d":[416,416,224,448],"e":[448,448,224,448],"t1":{"x":288,"y":352},"b":[128,416,480,480],"f":[128,416,512,512]},
	load:function(spot,key){
		var grid = s.event('getGrid',2);
		var goalGrid = s.getChallenge(key,'shuffle') ? s.event('getGrid',1) : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
		
		s.set(key,'order',goalGrid);
		
		for(var i = 0; i < grid.length; i++){
			for(var j = 0; j < grid.length; j++){
				var num = grid[i][j];
				if(num === 16) continue;
				m.spawnActor(m.spotTranslation(spot.b1,j*64,i*64),'pushable-rock2x2',{
					tag:{
						number:grid[i][j],
						type:'piece',
						goalPositionX:spot.b1.x + 64 * (goalGrid.indexOf(num) % 4),
						goalPositionY:spot.b1.y + 64 * (Math.floor(goalGrid.indexOf(num) / 4)),
					},
					'block,condition':'npc',
					'sprite,name':'number-'+grid[i][j],
					'pushable':{event:s.event('pushBlock'),magn:8,time:8},
					'sprite,sizeMod':1,
				});
			}
		}
		
		//to walk around
		m.spawnBlock(spot.a,s.event('viewPreventBlock'),'invisible');
		m.spawnBlock(spot.b,s.event('viewPreventBlock'),'invisible');
		m.spawnBlock(spot.c,s.event('viewPreventBlock'),'invisible');
		m.spawnBlock(spot.d,s.event('viewPreventBlock'),'invisible');
		m.spawnBlock(spot.e,s.event('viewPreventBlock'),'invisible');
		m.spawnBlock(spot.f,s.event('viewPreventBlock'),'invisible');
	},
});
s.newMapAddon('QfirstTown-north',{
	spot:{"t3":{"x":1728,"y":48},"t8":{"x":880,"y":208},"t4":{"x":3152,"y":432},"t7":{"x":1232,"y":1232},"t2":{"x":48,"y":1264},"t5":{"x":3152,"y":1792},"t6":{"x":3152,"y":2448},"t1":{"x":1280,"y":3152}},
	load:function(spot){
		m.spawnTeleport(spot.t6,s.event('startGame'),'zone','right');
	},
});

s.exports(exports);


/*
	
	
test([
	[1,2,3,4],
	[5,6,7,8],
	[9,10,11,12],
	[13,14,15,16]
])
*/


