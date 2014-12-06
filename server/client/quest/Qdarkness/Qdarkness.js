//11/28/2014 3:42 PM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/

'use strict';
var s = loadAPI('v1.0','Qdarkness',{
	name:"Darkness",
	author:""
});
var m = s.map; var b = s.boss;

/* COMMENT:
"Talk with Bimmy in the 2 story house. he needs rings from cave";
need lantern to enter cave
"Talk with Drof in house west.";
"Kill the bat in Drof's well.";
"Talk with Drof to get lantern.";
"Go South of Town and enter cave in middle.";
"Use traps to kill all ghosts.";
"Give the ring to Bimmy.";
*/

s.newVariable({
	deathCount:0,
	bossAmount:1,
	talkBimmy:false,
	talkDrof:false,
	killBatBoss:0,
	gotLantern:false,
	killGhost:0,
	lootChest:false,
	enterCave:false,
	lastTg:'',
	chalStrike:false,
	tgCount:0
});

s.newHighscore('tgCount',"Trapper","Least amount of traps activated to kill the ghosts.",'ascending',function(key){
	return s.get(key,'tgCount');
});

s.newChallenge('strike',"Strike!","Kill at least 6 ghosts at once.",2,function(key){
	return s.get(key,'chalStrike');	 //check tgOn
});
s.newChallenge('survivor',"Survivor","Complete the quest without dying.",2,function(key){
	return s.get(key,'deathCount') < 1;
});
s.newChallenge('x2boss',"Double Trouble","Fight 2 Bat bosses at once.",2,function(key){
	
});

s.newEvent('_start',function(key){ //
	if(s.isAtSpot(key,'QfirstTown-high','n1',200))
		s.callEvent('talkBimmy',key);
});
s.newEvent('_debugSignIn',function(key){ //
	s.teleport(key,'QfirstTown-main','b','main');
});
s.newEvent('_hint',function(key){ //
	if(!s.get(key,'talkBimmy')) return "Talk with Bimmy in the 2 story house.";
	if(!s.get(key,'talkDrof')) return "Talk with Drof in house west.";
	if(s.get(key,'killBatBoss') < s.get(key,'bossAmount')) return "Kill the bats in Drof's well.";
	if(!s.get(key,'gotLantern')) return "Talk with Drof to get lantern.";
	if(!s.get(key,'enterCave')) return "Cave on east side of Northern Mountains, north of town.";
	if(!s.get(key,'lootChest')) return "Activate switches to kill all ghosts. Alternate between them.";
	return "Give the ring to Bimmy.";
});
s.newEvent('_abandon',function(key){ //
	if(s.isInMap(key,'well'))
		s.teleport(key,'QfirstTown-north','a','main',false);
	if(s.isInMap(key,'ghost'))
		s.teleport(key,'QfirstTown-main','t2','main',false);
});
s.newEvent('seeTeleCaveTown',function(key){ //
	return s.get(key,'killBatBoss') >= s.get(key,'bossAmount');
});
s.newEvent('talkBimmy',function(key){ //
	if(!s.startQuest(key)) return;
	if(s.get(key,'lootChest')) return s.startDialogue(key,'bimmy','ringdone');
	if(!s.get(key,'talkBimmy')) return s.startDialogue(key,'bimmy','first');
	s.startDialogue(key,'bimmy','second');
	
	if(s.isChallengeActive(key,'x2boss')){
		s.set(key,'bossAmount',2);
	}
});
s.newEvent('doneTalkBimmy',function(key){ //
	s.set(key,'talkBimmy',true);
});
s.newEvent('finishQuest',function(key){ //
	s.completeQuest(key);
});
s.newEvent('_death',function(key){ //
	s.add(key,'deathCount',1);
});
s.newEvent('talkDrof',function(key){ //
	if(!s.get(key,'talkBimmy')) return s.startDialogue(key,'drof','tooearly');
	if(!s.get(key,'talkDrof')) return s.startDialogue(key,'drof','first');
	if(s.get(key,'killBatBoss') < s.get(key,'bossAmount')) return s.startDialogue(key,'drof','second');
	if(!s.get(key,'gotLantern')) return s.startDialogue(key,'drof','killbat');
	s.startDialogue(key,'drof','gotLantern');
});
s.newEvent('doneTalkDrof',function(key){ //
	s.set(key,'talkDrof',true);
});
s.newEvent('teleTownWell',function(key){ //enter well
	if(!s.get(key,'talkDrof')) return s.message(key,'You have no reason to go down here.');
	s.teleport(key,'well','t1','solo',true);
	s.setRespawn(key,'QfirstTown-main','t2','main',true);	//incase die inside
	
	var amount = s.get(key,'bossAmount');
	for(var i = 0; i < amount; i++)
		s.spawnActor(key,'well','e1','bigbat',{deathEvent:'killBatBoss'});
});
s.newEvent('teleWellTown',function(key){ //leave well
	s.teleport(key,'QfirstTown-main','t2','main',false);
});
s.newEvent('killBatBoss',function(key){ //
	s.add(key,'killBatBoss',1);
});
s.newEvent('gotLantern',function(key){ //
	s.addItem(key,'lantern');
	s.set(key,'gotLantern',true);
});
s.newEvent('teleSouthCave',function(key){ //enter cave
	if(!s.haveItem(key,'lantern')) //prevent from entering if no lantern
		return s.message(key,'The cave is too dark, you would need a lantern before heading in.');
	s.message(key,'You can not attack while holding the lantern. Find another way to kill the ghosts.');
	s.teleport(key,'ghost','t1','solo',true);
	s.setRespawn(key,'QfirstTown-north','a','main',true);	//incase die inside
	s.set(key,'enterCave',true);
});
s.newEvent('teleCaveSouth',function(key){ //leave cave
	s.set(key,'killGhost',0);
	s.teleport(key,'QfirstTown-north','a','main',false);
});
s.newEvent('viewBlock',function(key){ //prevent player to reach chest until all ghost dead
	return s.get(key,'killGhost') < 8;
});
s.newEvent('viewChest',function(key){ //
	return !s.get(key,'lootChest');
});
s.newEvent('lootChest',function(key){ //
	if(s.callEvent('viewBlock',key)) return s.ERROR(4,'not supposed to be able to loot chest if block there');	//prevent glitch
	s.addItem(key,'ring');
	s.set(key,'lootChest',true);	
	s.message(key,'Congratz! Now bring the ring back to Bimmy.');
});
s.newEvent('tgOn',function(key,num){ //activating switch
	s.add(key,'tgCount',1);		//for highscore
	s.set(key,'lastTg',num);	//prevent player from activating same switch over and over, check viewTg
	s.addAnim(key,'ghost','s' + num,'heal',3);	//explosion on top of switch
	
	var count = 0;
	s.forEachActor(key,'ghost',function(key2){	//for every ghost in trap zone,
		if(!s.isAtSpot(key2,'ghost','s' + num,200))
			return;
		count++;
		if(count === 6){
			s.set(key,'chalStrike',true);
			s.message(key,'Strike Challenge completed!');
		}
		s.killActor(key2);	//kill ghost
		s.add(key,'killGhost',1);	//increase killcount
	},'npc',null,{ghost:true});	//cant use atSpot cuz need range of 200
	
	if(s.get(key,'killGhost') >= 8)				//if all dead, see normally
		s.removeTorchEffect(key,'torch');
});
s.newEvent('tgOn1',function(key){ //
	return s.callEvent('tgOn',key,1);
});
s.newEvent('tgOn2',function(key){ //
	return s.callEvent('tgOn',key,2);
});
s.newEvent('tgOn3',function(key){ //
	return s.callEvent('tgOn',key,3);
});
s.newEvent('tgOn4',function(key){ //
	return s.callEvent('tgOn',key,4);
});
s.newEvent('tgOff',function(key){ //
	s.message(key,'You can\'t activate the same switch two times in a row.');
	return false;
});
s.newEvent('viewTg',function(key,num){ //if last switch activated is this one, cant use
	return s.get(key,'lastTg') !== num;
});
s.newEvent('viewTg1',function(key){ //
	return s.callEvent('viewTg',key,1);
});
s.newEvent('viewTg2',function(key){ //
	return s.callEvent('viewTg',key,2);
});
s.newEvent('viewTg3',function(key){ //
	return s.callEvent('viewTg',key,3);
});
s.newEvent('viewTg4',function(key){ //
	return s.callEvent('viewTg',key,4);
});

s.newItem('lantern',"Lantern",'status.burn',[    //{
],''); //}
s.newItem('ring',"Ring",'ring.topaz',[    //{
],''); //}

s.newAbility('bigbat0','attack',{
	name:"Scratch",
	icon:'attackMelee.scar',
	delay:10
},{
	type:'strike',
	dmg:s.newAbility.dmg(150,'melee'),
	hitAnim:s.newAbility.anim('cursePink',0.5),
	leech:s.newAbility.status(0.25,1,1),
	initPosition:s.newAbility.initPosition(0,50),
	preDelayAnim:s.newAbility.anim('scratch',0.5)
});
s.newAbility('bigbat1','attack',{
	name:"Lightning Bullet",
	icon:'attackMagic.static'
},{
	type:'bullet',
	amount:5,
	angleRange:30,
	dmg:s.newAbility.dmg(150,'lightning'),
	hitAnim:s.newAbility.anim('lightningHit',0.5),
	sprite:s.newAbility.sprite('lightningball',1)
});
s.newAbility('lightning','attack',{
},{
	type:'bullet',
	amount:16,
	angleRange:360,
	dmg:s.newAbility.dmg(25,'lightning'),
	spd:40,
	sprite:s.newAbility.sprite('lightningball',1)
});
s.newAbility('curse','attack',{
},{
	type:'strike',
	dmg:s.newAbility.dmg(150,'cold'),
	hitAnim:s.newAbility.anim('bind',0.25),
	chill:s.newAbility.status(1,1,1),
	curse:s.newAbility.curse(0.25,[s.newBoost('maxSpd',0.3,250),s.newBoost('globalDef',0.5,250)]),
	initPosition:s.newAbility.initPosition(0,100),
	delay:10,
	width:25,
	height:25,
	preDelayAnim:s.newAbility.anim('bind',1)
});
s.newAbility('bat','summon',{
},{
		model:s.newAbility.model('bat'),
		amount:2,
		maxChild:100,
		time:0
	
});

s.newDialogue('bimmy','Bimmy','villager-male.5',[ //{ 
	s.newDialogue.node('ringdone',"OMG! You found my ring! Thanks a lot.",[ 
		s.newDialogue.option("No problem.",'','finishQuest')
	],''),
	s.newDialogue.node('second',"Go talk with the guy in the house north west of the town. He will give you a lantern.",[ 	],''),
	s.newDialogue.node('first',"Hello. Can you help me?",[ 
		s.newDialogue.option("Okay.",'okay',''),
		s.newDialogue.option("No.",'','')
	],''),
	s.newDialogue.node('okay',"I lost a ring in a cave. Could you go get it for me?",[ 
		s.newDialogue.option("Sure. Where is the cave?",'where','')
	],''),
	s.newDialogue.node('where',"Cave is in the mountains, north of town. However, there's a little problem with that cave...",[ 
		s.newDialogue.option("What is it?",'what','')
	],''),
	s.newDialogue.node('what',"The cave is haunted by ghosts and it's really dark inside. You will ABSOLUTELY need a lantern if you want to go inside.",[ 
		s.newDialogue.option("Where can I find a lantern?",'lantern','')
	],''),
	s.newDialogue.node('lantern',"Go in the building north west of the town and talk with the guy there. He's a good friend of mine.",[ 
		s.newDialogue.option("Okay great!",'','doneTalkBimmy')
	],'')
]); //}
s.newDialogue('drof','Drof','villager-male.3',[ //{ 
	s.newDialogue.node('killbat',"Thanks a lot for killing the bat. Take my lantern.",[ 	],'gotLantern'),
	s.newDialogue.node('gotLantern',"Thanks again.",[ 	],''),
	s.newDialogue.node('second',"If you want my lantern, go kill all the bats in my well right outside of my house.",[ 	],''),
	s.newDialogue.node('tooearly',"Hey, you should go see my friend Bimmy. He lives in the 2 story house.",[ 	],''),
	s.newDialogue.node('first',"Hey, what do you want?",[ 
		s.newDialogue.option("A lantern!",'lantern',''),
		s.newDialogue.option("Nothing...",'','')
	],''),
	s.newDialogue.node('lantern',"Oh, sorry I can't give you my lantern because there are bats in my cave.",[ 
		s.newDialogue.option("Okay? Kinda weird but whatever.",'link','doneTalkDrof')
	],''),
	s.newDialogue.node('link',"There is none. Just kill the bats and I'll give you the lantern.",[ 
		s.newDialogue.option("Okay!",'','')
	],'')
]); //}

s.newNpc('bigbat',{
	name:"Big Bat",
	hp:3000,
	boss:s.newNpc.boss('bigbat'),
	sprite:s.newNpc.sprite('bat',2),
	moveRange:s.newNpc.moveRange(3.5,3),
	targetSetting:s.newNpc.targetSetting(10,50,90),
	abilityAi:s.newNpc.abilityAi([
		s.newNpc.abilityAi.ability('bigbat0',[0.2,0,0]),
		s.newNpc.abilityAi.ability('bigbat1',[0.4,0.4,1]),
		s.newNpc.abilityAi.ability('idle',[0.4,0.4,1])
	])
});

s.newMapAddon('QfirstTown-nwLong',{
	spot:{n1:{x:368,y:912}},
	load:function(spot){
		m.spawnActor(spot.n1,'npc',{
			sprite:s.newNpc.sprite('villager-male3'),
			name:'Drof',
			dialogue:'talkDrof'
		});
	}
});
s.newMapAddon('QfirstTown-high',{
	spot:{n1:{x:368,y:592}},
	load:function(spot){
		m.spawnActor(spot.n1,'npc',{
			sprite:s.newNpc.sprite('villager-male5'),
			name:'Bimmy',
			dialogue:'talkBimmy'
		});
	}
});
s.newMapAddon('QfirstTown-main',{
	spot:{t1:{x:192,y:1088},t2:{x:320,y:1088},b:{x:1824,y:2432}},
	load:function(spot){
		m.spawnTeleporter(spot.t1,'teleTownWell','well');
	}
});
s.newMap('well',{
	name:"Drof Well",
	lvl:0,
	grid:["0000000000001101100000011011000000000000","0111100000011101100000011011100000000000","0111101111111111111111111111111111000000","0000011111111111111111111111111111100111","0000111111111111111111111111111111110111","0001111111111111111111111111111111111011","0011110000000111100000011110000000111101","0011100111111111111111111111111110011100","0011001111111111111111111111111111001100","0011011111111111111111111111111111101100","0011011111111111111111111111111111101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011001111111111111111111111111111001100","0001100111111111111111111111111110011111","0000110000001111000000001100000000111111","0000011111001101100000011111111111101111","0000001111100101101100111111111111001111","0000000000110001101101111001100000000111"],
	tileset:'v1.2'
},{
	spot:{t1:{x:944,y:432},e1:{x:656,y:656}},
	load:function(spot){
		m.spawnTeleporter(spot.t1,'teleWellTown','zone','up');
	},
	playerEnter:function(key){
		s.addTorchEffect(key,'torch'); //dark screen
	},
	playerLeave:function(key){
		s.removeTorchEffect(key,'torch');		//regular screen
	}
});
s.newMap('ghost',{
	name:"Ghosts Cave",
	lvl:0,
	grid:["00000011000000000001100000000000000000000000011000","00000001111111111111000000000111100000000000011100","00000000111111111110000000000111100001100000011110","00110000000000000000000000000000000000000000001111","00000111111111111111111111111111111111111111110111","00001111111111111111111111111111111111111111111011","00011111111111111111100000001111111111111111111101","00011111111111111111100000001111111111111111111100","00011111111111111111100000001001110000000000111100","00011111111111111100000000001010111000000000111100","00011111111111111100000000001010111000000000011100","00011000000000000100000000001010001000000000001111","00011000000000000100000000001010001000000000001100","00011000000000000110000000011010001000000000001100","00011000000000000011110011110010001000000000001100","01111000000000000001110011100111101000000000001100","01111000000000000000110011001111111000000000001100","00011000000000000000010010010000110000000000001100","00011000000000000000000000011001100000000000001100","00011000000000000000000000011111000000000000001100","00011000000011111110000000001110000000000011111111","00011000000111111111000000000000000000000111111111","00011000001100000001100000000000000000001100000000","00011000011000000000110000000000000000011001111110","00011000011000000000110000000000000000011011111111","00011000011000000000110000000000000000011011111111","00011000011000000000110000000000000000011001111110","00011000011100000001110000000000000000011100001111","00011000011111000111110000000000000000011110001111","11111000011111000111100000000000000000001111110111","11111111111111000111000000000000000000000111111011","01110111111111000110000000000000000000000011111100","00110000011111000100000000000000000000000001111100","00011100001111000100000000000000000000000000001100","00111110001111000000000000000000000000000000001100","01100011001111000000000000000000000000000000001100","11000001101100000000000010001000000000000000001100","11000001101100000000000100000100000000000000001100","11000001101100000000001000000010000000000000001100","11000001101100000000001000000010000000000000001100","11000001101100000000001000000010000000000000001100","11000001101100000000001000000010000000000000001100","11100011101100000000001110000010000000000000001100","11110111101100000000001110000010000000000000001100","01111111000111111111111110000011111111111111111000","00111111111011111111111111111111111111111111111111","00011101111000000000111100000000000000000000001111","00001000000000110000111100000000000000000000000111","00000000000000000000011100000000111100000000000011","00000000000000000000001100000000111100000000000000"],
	tileset:'v1.2'
},{
	spot:{q1:{x:784,y:272},b5:{x:672,y:576},s3:{x:1264,y:432},s1:{x:336,y:464},e2:{x:432,y:592},e7:{x:1264,y:624},s2:{x:496,y:784},e1:{x:208,y:848},e8:{x:464,y:848},e3:{x:816,y:848},e6:{x:1200,y:944},e4:{x:624,y:1104},s4:{x:1296,y:1136},e5:{x:1104,y:1296},t1:{x:848,y:1392}},
	load:function(spot){
		var list = ['e1','e2','e3','e4','e5','e6','e7','e8'];
		for(var i = 0 ; i < list.length; i++)
			m.spawnActor(spot[list[i]],'ghost',{
				tag:{ghost:true},
			});			
		m.spawnBlock(spot.b5,'viewBlock','spike');
		m.spawnLoot(spot.q1,'viewChest','lootChest','chest');
		
		m.spawnTeleporter(spot.t1,'teleCaveSouth','zone','down');
		
		//traps, s1 switch will trigger b1 trap zone
		m.spawnToggle(spot.s1,'viewTg1','tgOn1','tgOff');
		m.spawnToggle(spot.s2,'viewTg2','tgOn2','tgOff');
		m.spawnToggle(spot.s3,'viewTg3','tgOn3','tgOff');
		m.spawnToggle(spot.s4,'viewTg4','tgOn4','tgOff');
	},
	playerEnter:function(key){
		s.addTorchEffect(key,'torch');
		s.addBoost(key,'hp-regen',10,0,'helper');
		
		s.enableAttack(key,false); //prevent use of ability (check q.preset.nothing)
	},
	playerLeave:function(key){
		s.removeTorchEffect(key,'torch');
		s.removeBoost(key,'helper','hp-regen');
		s.enableAttack(key,true);		//allow ability again
		s.set('killGhost',0);
	}
});
s.newMapAddon('QfirstTown-north',{
	spot:{a:{x:2768,y:2448}},
	load:function(spot){
		m.spawnTeleporter(spot.a,'teleSouthCave','cave');
	}
});

s.newBoss('bigbat',s.newBoss.variable({}),function(boss){
	s.newBoss.phase(boss,'phase0',{
		loop:function(boss){
			if(b.get(boss,'_framePhase') % 50 === 0 && b.getSummonCount(boss,'bat') < 8)
				b.useAbility(boss,'bat');
		},
		transitionTest:function(boss){
			if(b.get(boss,'_hpRatio') < 0.33) return 'phase1';
		}
	});
	s.newBoss.phase(boss,'phase1',{
		loop:function(boss){
			if(b.get(boss,'_framePhase') % 25 === 0)
				b.useAbility(boss,'curse');
			if(b.get(boss,'_framePhase') % 25 === 0 && b.getSummonCount(boss,'bat') > 0){
				s.changeHp(boss,2000);
			}
		},
		transitionIn:function(boss){
			b.useAbility(boss,'lightning');
		},
	});
});

s.exports(exports);
