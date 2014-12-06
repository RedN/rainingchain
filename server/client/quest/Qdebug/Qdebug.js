//10/11/2014 4:29 PM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/

var s = loadAPI('v1.0','Qdebug',{
	name:'Debug',
	author:'Admin',
	dailyTask:false,
});
var m = s.map; var b = s.boss;


//0,0,Qdebug-testCutscene

s.newVariable({
});

s.newEvent('myEvent',function(key){
	s.followPath(key,'myCutscene',function(){
		
	});
});
s.newEvent('myEvent2',function(key){
	s.followPath(key,'myCutscene',function(){
		
	},true);
});

s.newEvent('w00t',function(key){
	s.endPath(key);
});

s.newNpc("npcBoss",{
	name:"Dragon Boss",
	sprite:s.newNpc.sprite("birdBlue",1.2),
	mastery:s.newNpc.mastery(null,[0.2,0.2,0.2,0.2,0.2,0.2]),
	maxSpd:s.newNpc.maxSpd(0.25),
	moveRange:s.newNpc.moveRange(3.5,3),
	boss:s.newNpc.boss('dragon'),
	targetSetting:s.newNpc.targetSetting(10),
	hpRegen:0,
	hp:20000,
	//nevermove:true,
	statusResist:s.newNpc.statusResist(0,1,0,0,0,0),
});

s.newAbility('fireball','attack',{},{
	type:"bullet",angleRange:20,amount:1,
	sprite:s.newAbility.sprite("iceshard",1.5),
	hitAnim:s.newAbility.anim("fireHit",0.5),
	dmg:s.newAbility.dmg(100,'fire'),
	spd:20,
});
s.newAbility('fireball-360','attack',{},{
	type:"bullet",angleRange:20,amount:1,
	sprite:s.newAbility.sprite("iceshard",1),
	hitAnim:s.newAbility.anim("fireHit",0.5),
	dmg:s.newAbility.dmg(200,'fire'),
	spd:40,
});
s.newAbility('fireball-fast','attack',{},{
	type:"bullet",angleRange:60,amount:2,
	sprite:s.newAbility.sprite("iceshard",1),
	hitAnim:s.newAbility.anim("fireHit",0.5),
	dmg:s.newAbility.dmg(25,'fire'),
	spd:40,
});
s.newAbility('fireball-oob','attack',{},{
	type:"bullet",
	sprite:s.newAbility.sprite("iceshard",1),
	hitAnim:s.newAbility.anim("fireHit",0.5),
	dmg:s.newAbility.dmg(250,'fire'),
	spd:30,
});

s.newBoss('dragon',s.newBoss.variable({
	direction:1,
	rotationAngle:0,
	randomAngle:0,
}),function(boss){
	var SPD = 1;
	s.newBoss.phase(boss,'phase2',{
		loop:function(boss){
			if(b.get(boss,'_framePhase') % 75 === 0)
				for(var i = 0; i < 360; i += 15)
					b.useAbility(boss,'fireball-oob',b.get(boss,'randomAngle') + i);
		},
		transitionTest:function(boss){
			if(b.get(boss,'_framePhase') > 500) return 'phase0';
		},
	});
	
	s.newBoss.phase(boss,'phase0',{
		loop:function(boss){
			var num = b.get(boss,'_framePhase') % 100;
			if(num === 40) 
				b.set(boss,'randomAngle',b.get(boss,'_angle') + Math.randomML()*50);
			if(num === 40 || num === 60 || num === 80)	
				b.useAbility(boss,'fireball',b.get(boss,'randomAngle'));
			if(num === 75)
				for(var i = 0; i < 340; i += 5)	
					b.useAbility(boss,'fireball-360',b.get(boss,'randomAngle')+i+10);
		},
		transitionTest:function(boss){
			if(b.get(boss,'_framePhase') > 400) return 'phase1'	
		},
	});
	s.newBoss.phase(boss,'phase1',{
		loop:function(boss){
			var toadd = b.get(boss,'direction') * SPD;
			b.add(boss,'rotationAngle',toadd);
			b.useAbility(boss,'fireball-fast',b.get(boss,'rotationAngle'));
			if(b.get(boss,'_framePhase') % 50 === 0)
				for(var i = 0; i < 300; i += 5)	b.useAbility(boss,'fireball-oob',b.get(boss,'rotationAngle')+i+30);
		},
		transitionTest:function(boss){
			if(b.get(boss,'_framePhase') > 250) return 'phase2';
		},
		transitionIn:function(boss){
			b.set(boss,'rotationAngle',b.get(boss,'_angle'));
			b.set(boss,'direction',Math.random() > 0.5 ? -1 : 1);
		}
	});
	
	
});

//MAP:s.newMap.constructor('testCutscene',{ "$id": "32722981", "addon": { "$id": "32722982", "load": [], "loop": [], "playerEnter": [], "playerLeave": [], "spot": { "$id": "32722983", "blue,0": { "$id": "32722984", "$type": "RainingChainQuestApplication.SpotXY, RainingChainQuestApplication", "x": 176, "y": 144, "type": "spot", "letter": "blue,0" }, "blue,1": { "$id": "32722985", "$type": "RainingChainQuestApplication.SpotXY, RainingChainQuestApplication", "x": 432, "y": 144, "type": "spot", "letter": "blue,1" }, "blue,2": { "$id": "32722986", "$type": "RainingChainQuestApplication.SpotXY, RainingChainQuestApplication", "x": 816, "y": 368, "type": "spot", "letter": "blue,2" }, "a": { "$id": "32722987", "$type": "RainingChainQuestApplication.SpotXY, RainingChainQuestApplication", "x": 432, "y": 528, "type": "spot", "letter": "a" }, "blue,3": { "$id": "32722988", "$type": "RainingChainQuestApplication.SpotXY, RainingChainQuestApplication", "x": 752, "y": 752, "type": "spot", "letter": "blue,3" }, "blue,4": { "$id": "32722989", "$type": "RainingChainQuestApplication.SpotXY, RainingChainQuestApplication", "x": 368, "y": 848, "type": "spot", "letter": "blue,4" } } }, "id": "testCutscene", "name": "test", "graphic": null, "tmxPath": "C:\\rc\\IDE\\Qtest2\\map\\testCutscene\\testCutscene.tmx", "addonOnly": false, "lvl": 0});
s.newMap('testCutscene',{
	name:'test',
	lvl: 0,
	tileset:"v1.2",
	//grid dimension is bad...
	grid:["00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000"],
},{
	spot:{blue0:{x:176,y:144},blue1:{x:432,y:144},blue2:{x:816,y:368},a:{x:432,y:528},blue3:{x:752,y:752},blue4:{x:368,y:848}},
	load: function(spot){
	
		m.spawnActor(spot.a,'npcBoss');
		m.spawnActor(spot.a,'npcBoss');
		m.spawnActor(spot.a,'npcBoss');
		m.spawnActor(spot.a,'npcBoss');
		m.spawnActor(spot.a,'npcBoss');
	}
});

s.newPath('myCutscene',s.newPath.compileSpotList('testCutscene',s.newPath.spotList([ //{ 
	s.newPath.spot('blue0',25*5,null,0.1),
	s.newPath.spot('blue1',25*2,null,0.1),
	s.newPath.spotChain('blue',2,3),
	s.newPath.spot('blue4',25*3),
]))); //}

s.exports(exports);



