/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
"use strict";
var s = require('./../Quest_exports').init('v1.0','Qdarkness',{
	name:"Darkness",
});
var q = s.quest; var m = s.map; var b = s.boss;

/* STEPS TO COMPLETE QUEST
	"Talk with Bimmy in the 2 story house. he needs rings from cave";
	need lantern to enter cave
	"Talk with Drof in house west.";
	"Kill the bat in Drof's well.";
	"Talk with Drof to get lantern.";
	"Go South of Town and enter cave in middle.";
	"Use traps to kill all ghosts.";
	"Give the ring to Bimmy.";
*/

s.newHighscore('tgCount','Trapper','Least amount of traps activated to kill the ghosts.','ascending',function(key){
	return s.get(key,'tgCount');
});

s.newChallenge('strike','Strike!','Kill at least 6 ghosts at once.',null,function(key){
	return s.get(key,'chalStrike');	 //check tgOn
});

s.newChallenge('survivor','Survivor','Complete the quest without dying.',null,function(key){
	return s.get(key,'_deathCount') < 1;
});

s.newChallenge('x2boss','Double Trouble','Fight 2 Bat bosses at once.',function(key,qid){
	s.set(key,'bossAmount',2);
},null);

s.newVariable({
	bossAmount:1,
	talkBimmy:false,
	talkDrof:false,
	killBatBoss:0,
	gotLantern:false,
	killGhost:0,
	lootChest:false,
	enterCave:false,	//used for hint
	lastTg:'',			//prevent player from using same trap over and over
	chalStrike:false,			//used for challenge
	tgCount:0,			//for challenge
});

s.newEvent('_start',function(key){
	if(s.isAtSpot(key,'QfirstTown-high','n1',200))
		s.event('talkBimmy',key);
});
s.newEvent('_testSignIn',function(key){
	s.teleport(key,'QfirstTown-main','b','main');
});
s.newEvent('_hint',function(key){
	if(!s.get(key,'talkBimmy')) return "Talk with Bimmy in the 2 story house.";
	if(!s.get(key,'talkDrof')) return "Talk with Drof in house west.";
	if(s.get(key,'killBatBoss') < s.get(key,'bossAmount')) return "Kill the bats in Drof's well.";
	if(!s.get(key,'gotLantern')) return "Talk with Drof to get lantern.";
	if(!s.get(key,'enterCave')) return "Cave on east side of Northern Mountains, north of town.";
	if(!s.get(key,'lootChest')) return "Activate switches to kill all ghosts. Alternate between them.";
	return "Give the ring to Bimmy.";
});
s.newEvent('_abandon',function(key){
	if(s.isInMap(key,'well'))
		s.teleport(key,'QfirstTown-north','a','main',false);
	if(s.isInMap(key,'ghost'))
		s.teleport(key,'QfirstTown-main','t2','main',false);
});
s.newEvent('seeTeleCaveTown',function(key){
	return s.get(key,'killBatBoss') >= s.get(key,'bossAmount');
});
s.newEvent('talkBimmy',function(key){
	if(!s.startQuest(key)) return;
	if(!s.getEmptyItem(key,2,true)) return;
	if(s.get(key,'lootChest')) return s.dialogue(key,'bimmy','ringdone');
	if(!s.get(key,'talkBimmy')) return s.dialogue(key,'bimmy','first');
	s.dialogue(key,'bimmy','second');
});
s.newEvent('doneTalkBimmy',function(key){
	s.set(key,'talkBimmy',true);
});
s.newEvent('talkDrof',function(key){
	if(!s.get(key,'talkBimmy')) return s.dialogue(key,'drof','tooearly');
	if(!s.get(key,'talkDrof')) return s.dialogue(key,'drof','first');
	if(s.get(key,'killBatBoss') < s.get(key,'bossAmount')) return s.dialogue(key,'drof','second');
	if(!s.get(key,'gotLantern')) return s.dialogue(key,'drof','killbat');
	s.dialogue(key,'drof','gotLantern');
});
s.newEvent('doneTalkDrof',function(key){
	s.set(key,'talkDrof',true);
});
s.newEvent('teleTownWell',function(key){	//enter well
	if(!s.get(key,'talkDrof')) return s.chat(key,'You have no reason to go down here.');
	s.teleport(key,'well','t1','solo',true);
	s.setRespawn(key,'QfirstTown-main','t2','main',true);	//incase die inside
});
s.newEvent('teleWellTown',function(key){	//leave well
	s.teleport(key,'QfirstTown-main','t2','main',false);
});
s.newEvent('killBatBoss',function(key){
	s.add(key,'killBatBoss',1);
});
s.newEvent('gotLantern',function(key){
	s.addItem(key,'lantern');
	s.set(key,'gotLantern',true);
});
s.newEvent('teleSouthCave',function(key){	//enter cave
	if(!s.haveItem(key,'lantern')) //prevent from entering if no lantern
		return s.chat(key,'The cave is too dark, you would need a lantern before heading in.');
	s.chat(key,'You can not attack while holding the lantern. Find another way to kill the ghosts.');
	s.teleport(key,'ghost','t1','solo',true);
	s.setRespawn(key,'QfirstTown-north','a','main',true);	//incase die inside
	s.set(key,'enterCave',true);
});
s.newEvent('teleCaveSouth',function(key){	//leave cave
	s.set(key,'killGhost',0);
	s.teleport(key,'QfirstTown-north','a','main',false);
});	
s.newEvent('viewBlock',function(key){	//prevent player to reach chest until all ghost dead
	return s.get(key,'killGhost') < 8;
});
s.newEvent('viewChest',function(key){
	return !s.get(key,'lootChest');
});
s.newEvent('lootChest',function(key){
	if(s.event('viewBlock',key)) return s.ERROR(4,'not supposed to be able to loot chest if block there');	//prevent glitch
	s.addItem(key,'ring');
	s.set(key,'lootChest',true);	
	s.chat(key,'Congratz! Now bring the ring back to Bimmy.');
});
s.newEvent('tgOn',function(key,num){		//activating switch
	s.add(key,'tgCount',1);		//for highscore
	s.set(key,'lastTg',num);	//prevent player from activating same switch over and over, check viewTg
	s.addAnim(key,'ghost','s' + num,'heal',3);	//explosion on top of switch
	var list = s.collision(key,'ghost','b' + num,'ghost');	
	
	if(list.length >= 6){
		s.set(key,'chalStrike',true);
		s.chat(key,'Strike Challenge completed!');
	}
	
	for(var i = 0 ; i < list.length; i++){			//for every ghost in trap zone,
		s.killActor(list[i]);					//kill ghost
		s.add(key,'killGhost',1);				//increase killcount
	}
	
	if(s.get(key,'killGhost') >= 8)				//if all dead, see normally
		s.screenEffect(key,'torch',null);
});
s.newEvent('tgOn1',function(key){ return s.event('tgOn',key,1); });
s.newEvent('tgOn2',function(key){ return s.event('tgOn',key,2); });
s.newEvent('tgOn3',function(key){ return s.event('tgOn',key,3); });
s.newEvent('tgOn4',function(key){ return s.event('tgOn',key,4); });
s.newEvent('viewTg',function(key,num){ //if last switch activated is this one, cant use
	return s.get(key,'lastTg') !== num;
});
s.newEvent('viewTg1',function(key){ return s.event('viewTg',key,1); });
s.newEvent('viewTg2',function(key){ return s.event('viewTg',key,2); });
s.newEvent('viewTg3',function(key){ return s.event('viewTg',key,3); });
s.newEvent('viewTg4',function(key){ return s.event('viewTg',key,4); });

s.newItem('lantern','Lantern','status.burn');
s.newItem('ring','Ring','ring.topaz');

s.newDialogue('bimmy',{image:'villager-male.5',name:'Bimmy'},{
	ringdone:{
		text:"OMG! You found my ring! Thanks a lot.",
		option:[
			{text:"No problem.",event:s.completeQuest},
		]
	},	
	second:{
		text:"Go talk with the guy in the house north west of the town. He will give you a lantern.",
	},	
	first:{
		text:"Hello. Can you help me?",
		option:[
			{text:"Okay.",next:"okay"},
			{text:"No."},
		]
	},
	okay:{
		text:"I lost a ring in a cave. Could you go get it for me?",
		option:[
			{text:"Sure. Where is the cave?",next:'where'},
		]
	},
	where:{
		text:"Cave is in the mountains, north of town. However, there's a little problem with that cave...",
		option:[
			{text:"What is it?",next:'what'},
		]
	},
	what:{
		text:"The cave is haunted by ghosts and it's really dark inside. You will ABSOLUTELY need a lantern if you want to go inside.",
		option:[
			{text:"Where can I find a lantern?",next:'lantern'},
		]
	},
	lantern:{
		text:"Go in the building north west of the town and talk with the guy there. He's a good friend of mine.",
		option:[
			{text:"Okay great!",event:'doneTalkBimmy'},
		]
	},
});
s.newDialogue('drof',{image:'villager-male.3',name:'Drof'},{
	killbat:{
		text:"Thanks a lot for killing the bat. Take my lantern.",
		event:'gotLantern',
	},	
	gotLantern:{
		text:"Thanks again.",
	},	
	second:{
		text:"If you want my lantern, go kill all the bats in my well right outside of my house.",
	},	
	tooearly:{
		text:"Hey, you should go see my friend Bimmy. He lives in the 2 story house.",
	},	
	first:{
		text:"Hey, what do you want?",
		option:[
			{text:"A lantern!",next:'lantern'},
			{text:"Nothing..."},
		]
	},	
	lantern:{
		text:"Oh, sorry I can't give you my lantern because there are bats in my cave.",
		option:[
			{text:"Okay? I don't see the link...",next:'link',event:'doneTalkDrof'},
		]
	},	
	link:{
		text:"There is none. Just kill the bats and I'll give you the lantern.",
		option:[
			{text:"Okay!"},
		]
	},
});

s.newMapAddon('QfirstTown-nwLong',{
	spot:{"n1":{"x":368,"y":912}},
	load:function(spot){
		m.spawnActor(spot.n1,'npc',{sprite:'villager-male.3',name:'Drof',dialogue:s.event('talkDrof')});	
	},
});
s.newMapAddon('QfirstTown-high',{
	spot:{"n1":{"x":368,"y":592}},
	load:function(spot){
		m.spawnActor(spot.n1,'npc',{sprite:'villager-male.5',name:'Bimmy',dialogue:s.event('talkBimmy')});	
	},
});
s.newMapAddon('QfirstTown-main',{
	spot:{"t1":{"x":6*32,"y":34*32},"t2":{"x":10*32,"y":34*32},"b":{"x":57*32,"y":76*32}},
	load:function(spot){
		m.spawnTeleport(spot.t1,s.event('teleTownWell'),'well');
	},
});
s.newMap('well',{
	name:"Drof's Well",
	tileset:"v1.2",
	grid:["0000000000001101100000011011000000000000","0111100000011101100000011011100000000000","0111101111111111111111111111111111000000","0000011111111111111111111111111111100111","0000111111111111111111111111111111110111","0001111111111111111111111111111111111011","0011110000000111100000011110000000111101","0011100111111111111111111111111110011100","0011001111111111111111111111111111001100","0011011111111111111111111111111111101100","0011011111111111111111111111111111101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011011000000000000000000000000001101100","0011001111111111111111111111111111001100","0001100111111111111111111111111110011111","0000110000001111000000001100000000111111","0000011111001101100000011111111111101111","0000001111100101101100111111111111001111","0000000000110001101101111001100000000111"],
	lvl:0,
},{
	spot:{"t1":{"x":944,"y":432},"e1":{"x":656,"y":656}},
	load:function(spot,key){
		var amount = s.get(key,'bossAmount');
		for(var i = 0; i < amount; i++)
			m.spawnActor(spot.e1,'bigbat',{deathEvent:s.event('killBatBoss')});	
			
		m.spawnTeleport(spot.t1,s.event('teleWellTown'),'zone',270);	
	},
	playerEnter:function(key){
		s.screenEffect(key,'torch');	//dark screen
	},
	playerLeave:function(key){
		s.screenEffect(key,'torch',null);		//regular screen
	},
});
s.newMap('ghost',{
	name:"Ghosts Cave",
	tileset:"v1.2",
	grid:["00000011000000000001100000000000000000000000011000","00000001111111111111000000000111100000000000011100","00000000111111111110000000000111100001100000011110","00110000000000000000000000000000000000000000001111","00000111111111111111111111111111111111111111110111","00001111111111111111111111111111111111111111111011","00011111111111111111100000001111111111111111111101","00011111111111111111100000001111111111111111111100","00011111111111111111100000001001110000000000111100","00011111111111111100000000001010111000000000111100","00011111111111111100000000001010111000000000011100","00011000000000000100000000001010001000000000001111","00011000000000000100000000001010001000000000001100","00011000000000000110000000011010001000000000001100","00011000000000000011110011110010001000000000001100","01111000000000000001110011100111101000000000001100","01111000000000000000110011001111111000000000001100","00011000000000000000010010010000110000000000001100","00011000000000000000000000011001100000000000001100","00011000000000000000000000011111000000000000001100","00011000000011111110000000001110000000000011111111","00011000000111111111000000000000000000000111111111","00011000001100000001100000000000000000001100000000","00011000011000000000110000000000000000011001111110","00011000011000000000110000000000000000011011111111","00011000011000000000110000000000000000011011111111","00011000011000000000110000000000000000011001111110","00011000011100000001110000000000000000011100001111","00011000011111000111110000000000000000011110001111","11111000011111000111100000000000000000001111110111","11111111111111000111000000000000000000000111111011","01110111111111000110000000000000000000000011111100","00110000011111000100000000000000000000000001111100","00011100001111000100000000000000000000000000001100","00111110001111000000000000000000000000000000001100","01100011001111000000000000000000000000000000001100","11000001101100000000000010001000000000000000001100","11000001101100000000000100000100000000000000001100","11000001101100000000001000000010000000000000001100","11000001101100000000001000000010000000000000001100","11000001101100000000001000000010000000000000001100","11000001101100000000001000000010000000000000001100","11100011101100000000001110000010000000000000001100","11110111101100000000001110000010000000000000001100","01111111000111111111111110000011111111111111111000","00111111111011111111111111111111111111111111111111","00011101111000000000111100000000000000000000001111","00001000000000110000111100000000000000000000000111","00000000000000000000011100000000111100000000000011","00000000000000000000001100000000111100000000000000"],
	lvl:0,
},{
	spot:{"q1":{"x":784,"y":272},"b3":[1120,1376,288,544],"b1":[192,448,352,576],"s3":{"x":1264,"y":432},"s1":{"x":336,"y":464},"e2":{"x":432,"y":592},"b5":[672,768,576,576],"e7":{"x":1264,"y":624},"b2":[352,608,672,928],"s2":{"x":496,"y":784},"e1":{"x":208,"y":848},"e8":{"x":464,"y":848},"e3":{"x":816,"y":848},"e6":{"x":1200,"y":944},"b4":[1152,1408,992,1248],"e4":{"x":624,"y":1104},"s4":{"x":1296,"y":1136},"e5":{"x":1104,"y":1296},"t1":{"x":848,"y":1392}},
	variable:{
		enemy:['e1','e2','e3','e4','e5','e6','e7','e8'],
	},
	load:function(spot,key){
		for(var i = 0 ; i < this.variable.enemy.length; i++)
			m.spawnActor(spot[this.variable.enemy[i]],'ghost',{
				tag:'ghost'
			});			
		m.spawnBlock(spot.b5,s.event('viewBlock'),'spike');
		m.spawnLoot(spot.q1,s.event('viewChest'),s.event('lootChest'),'chest');
		
		m.spawnTeleport(spot.t1,s.event('teleCaveSouth'),'zone','down');
		
		//traps, s1 switch will trigger b1 trap zone
		m.spawnToggle(spot.s1,s.event('viewTg1'),s.event('tgOn1'));
		m.spawnToggle(spot.s2,s.event('viewTg2'),s.event('tgOn2'));
		m.spawnToggle(spot.s3,s.event('viewTg3'),s.event('tgOn3'));
		m.spawnToggle(spot.s4,s.event('viewTg4'),s.event('tgOn4'));
	},
	playerEnter:function(key){
		s.screenEffect(key,'torch');
		s.boost(key,'helper','hp-regen',10);
		
		s.attackOff(key); //prevent use of ability (check q.preset.nothing)
	},
	playerLeave:function(key){
		s.screenEffect(key,'torch',null);
		s.boost.remove(key,'helper');
		s.attackOn(key);		//allow ability again
		s.set('killGhost',0);
	},
});
s.newMapAddon('QfirstTown-north',{
	spot:{"a":{"x":86*32+16,"y":76*32+16}},
	load:function(spot){
		m.spawnTeleport(spot.a,s.event('teleSouthCave'),'cave');	
	},
});

s.newNpc("bigbat",{
	name:"Big Bat",
	sprite:s.newNpc.sprite("bat",2),
	moveRange:s.newNpc.moveRange(3.5,3),	
	boss:'bigbat',
	target_maxAngleChance:10,
	resource_hp_regen:0,
	resource_hp_max:3000,
	modAmount:false,
	abilityList:[
		s.newNpc.abilityList(s.newAbility(null,'scratch',{},{
			leech:s.newAbility.status(0.25,1,1),	//25 magn
			hitAnim:s.newAbility.anim('cursePink',0.5),
		}),[0.2,0,0]),
		s.newNpc.abilityList(s.newAbility(null,'lightningBullet',{},{
			amount:5,angle:30,
		}),[0.4,0.4,1]),
		s.newNpc.abilityList('idle',[0.4,0.4,1]),
	],
});





s.newAbility('lightning','attack',{},{
	type:"bullet",angle:360,amount:16,
	objSprite:s.newAbility.sprite('lightningball',1),
	dmg:s.newAbility.dmg(25,'lightning'),
	spd:20,
});
		
s.newAbility('curse','attack',{},{
	type:"strike",width:25,height:25,delay:10,minRange:0,maxRange:100,
	preDelayAnim:s.newAbility.anim('bind',1),
	hitAnim:s.newAbility.anim('bind',0.25),
	dmg:s.newAbility.dmg(100,'cold'),
	chill:s.newAbility.status(1,1,1),
	curse:s.newAbility.curse(0.25,[
		{stat:'maxSpd',type:'*',value:0.3,time:250},
		{stat:'globalDef',type:'*',value:0.5,time:250},	
	]),
});	
s.newAbility('bat','summon',{},{
	npc:{
		model:'bat',
		amount:2,
		modAmount:0,
	},
});			

s.newBoss('bigbat',{},function(boss){
	s.newBoss.phase(boss,'phase0',{
		loop:function(boss){
			if(b.get(boss,'_framePhase') % 50 === 0 && b.getSummon(boss,'bat').length < 8)
				b.ability(boss,'bat');
		},
		transitionTest:function(boss){
			if(b.get(boss,'_hpRatio') < 0.33) return 'phase1';
		}
	});
	s.newBoss.phase(boss,'phase1',{
		loop:function(boss){
			if(b.get(boss,'_framePhase') % 25 === 0)
				b.ability(boss,'curse');
			if(b.get(boss,'_framePhase') % 25 === 0 && b.getSummon(boss,'bat').length > 0){
				s.changeHp(boss,2000);
			}
		},
		transitionIn:function(boss){
			b.ability(boss,'lightning');
		},
	});
});

s.exports(exports);





