/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*//*global True, False, loadAPI*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/
"use strict";
var s = loadAPI('v1.0','QcollectFight',{
	name:"Collect & Fight",
	dailyTask:false,
});
var m = s.map; var b = s.boss;

/* COMMENT:
collect ressource in map for 1.5 min.
at the end:
	if solo: need to fight a boss
	if party: need to kill other player

*/

/*
s.newVariable({
	weaponLvl:1,
	armorLvl:1,
	abilityOffLvl:1,
	abilityDefLvl:1,
	killBoss:0,
	bossAmount:1,
	party:false,
});

var TIME = 25*90;

s.newChallenge('x2boss','Double Trouble','Fight 2 bosses at once.',function(key,qid){
	s.set(key,'bossAmount',2);
},null);
s.newChallenge('party','Competitive','Complete the quest with a friend.',null,function(key){
	return s.get(key,'party');
});
s.newChallenge('resourceful','Resourceful','Collect at least 30 resources.',null,function(key){
	return s.get(key,'resourceCount') >= 30;
});

s.newHighscore('resourceful','Most Resource','Most Resources Collected','descending',function(key){
	return s.get(key,'resourceCount');
});

s.newEvent('_start',function(key){
	if(s.isAtSpot(key,'QfirstTown-north','n1',200))
		s.callEvent('talkCarbon',key);
});
s.newEvent('_hint',function(key){
	if(s.isInMap(key,'collect')) return 'Collect resources and use them to craft Equip & Abilities.';
	if(s.isInMap(key,'fight')) return 'Kill everyone!!!';
	return 'Start this quest by talking to Carbon north of Town.';
});
s.newEvent('_debugSignIn',function(key){
	s.teleport.force(key,1296,2608,'QfirstTown-north');
});
s.newEvent('_signIn',function(key){
	return s.failQuest(key);
});
s.newEvent('_death',function(key){
	if(!s.get(key,'party')) return s.failQuest(key);
	
	if(s.isInMap(key,'fight')){
		return s.completeQuest(key);
	}
});
s.newEvent('_abandon',function(key){
	if(s.isInQuestMap(key))
		s.teleport(key,'QfirstTown-north','n1');
	s.setRespawn(key,'QfirstTown-north','n1');
});
s.newEvent('_complete',function(key){
	s.callEvent('_abandon',key);
});
s.newEvent('talkCarbon',function(key){
	if(NODEJITSU && s.getReputationPt(key) < 10)
		return s.startDialogue(key,'_noquest','badreq');

	if(!s.startQuest(key)) return;
	s.startDialogue(key,'carbon','intro');
});
s.newEvent('startCollect',function(key){
	s.usePreset(key,'start');
	s.teleport(key,'collect','a','solo',true);
	s.setTimeout(key,'stopCollect',TIME);
	s.startChrono(key,'startCollect');
});
s.newEvent('startCollectTeam',function(leadkey){
	if(s.getPartySize(leadkey) <= 1) {
		s.message(leadkey,"You are the only player in your party. You started solo quest instead.");
		s.callEvent('startCollect',leadkey);
		return;
	}
	if(!s.startQuestTeam(leadkey)) return;
	
	s.setTimeout(leadkey,'stopCollectTeam',TIME);
	
	s.p artyForEach(leadkey,function(key){
		s.set(key,'party',true);
		s.teleport(key,'collect','a','party',key === leadkey);
		s.setRespawn(key,'collect','a','party');
		s.usePreset(key,'start');
		s.startChrono(key,'startCollect');
		s.enablePvp(key,true);
	});
	
});
s.newEvent('stopCollectTeam',function(leadkey){
	
	s.par tyForEach(leadkey,function(key){
		s.message(key,'TIME OUT!');
		s.stopChrono(key,'startCollect');
		s.respawnPlayer(key);
		s.teleport(key,'fight','t1','party',key === leadkey);
	});
	

});
s.newEvent('stopCollect',function(key){
	s.message(key,'TIME OUT!');
	s.stopChrono(key,'startCollect');
	s.teleport(key,'fight','t1','solo',true);
	s.spawnActorGroup(key,'fight','e1',false,[
		s.spawnActorGroup.list('boss',s.get(key,'bossAmount'),{deathEvent:s.callEvent('killBoss')})
	]);
}),	
s.newEvent('lootResource',function(key,e){
	s.callEvent('addResource',key,1);
	e.viewedIf = function(){ return false; }
});
s.newEvent('craftWeapon',function(key){
	var amountNeeded = Math.pow(s.get(key,'weaponLvl')+1,2);

	if(s.haveItem(key,'resource',amountNeeded)){
		s.removeItem(key,'resource',amountNeeded);
		s.addItem(key,'weapon' + s.get(key,'weaponLvl'));
		s.add(key,'weaponLvl',1);
		s.message("Your weapon was improved.");
	} else {
		s.message(key,'You need ' + amountNeeded + ' resources to improve your weapon.');
	}		
});
s.newEvent('craftArmor',function(key){
	var amountNeeded = Math.pow(s.get(key,'armorLvl')+1,2);

	if(s.haveItem(key,'resource',amountNeeded)){
		s.removeItem(key,'resource',amountNeeded);
		s.addItem(key,'armor' + s.get(key,'armorLvl'));
		s.addItem(key,'amulet' + s.get(key,'armorLvl'));
		s.add(key,'armorLvl',1);
		s.message("Your armor was improved.");
	} else {
		s.message(key,'You need ' + amountNeeded + ' resources to improve your armor.');
	}		
});
s.newEvent('craftAbilityOff',function(key){
	var amountNeeded = Math.pow(s.get(key,'abilityOffLvl')+1,2);

	if(s.haveItem(key,'resource',amountNeeded)){
		s.removeItem(key,'resource',amountNeeded);
		s.addAbility(key,'offensive' + s.get(key,'abilityOffLvl'),0);
		s.add(key,'abilityOffLvl',1);
		s.message("Your offensive ability was improved.");
	} else {
		s.message(key,'You need ' + amountNeeded + ' resources to improve your offensive ability.');
	}		
});
s.newEvent('craftAbilityDef',function(key){
	var amountNeeded = Math.pow(s.get(key,'abilityDefLvl')+1,2);

	if(s.haveItem(key,'resource',amountNeeded)){
		s.removeItem(key,'resource',amountNeeded);
		s.addAbility(key,'defensive' + s.get(key,'abilityDefLvl'),1);
		s.add(key,'abilityDefLvl',1);
		s.message("Your defensive ability was improved.");
	} else {
		s.message(key,'You need ' + amountNeeded + ' resources to improve your defensive ability.');
	}		
});
s.newEvent('killBoss',function(key){
	s.add(key,'killBoss',1);
	if(s.get(key,'killBoss') >= s.get(key,'bossAmount'))
		s.completeQuest(key);		
});
s.newEvent('killEnemy',function(key){
	s.callEvent('addResource',key,3);
});
s.newEvent('addResource',function(key){
	s.addItem(key,'resource',1);
	s.add(key,'resourceCount',1);
});

s.newPreset('start',
	s.newPreset.ability(['offensive0','defensive0']),
	s.newPreset.equip({body:'armor0',weapon:'weapon0'})
);

s.newEquip('weapon0','weapon','mace','Mace Lv0',0.2);
s.newEquip('weapon1','weapon','mace','Mace Lv1',1);
s.newEquip('weapon2','weapon','mace','Mace Lv2',2);
s.newEquip('weapon3','weapon','mace','Mace Lv3',4);
s.newEquip('armor0','body','metal','Body Lv0',0.5);
s.newEquip('armor1','body','metal','Body Lv1',2);
s.newEquip('armor2','body','metal','Body Lv2',4);
s.newEquip('armor3','body','metal','Body Lv3',6);
s.newEquip('amulet0','amulet','ruby','Amulet Lv0',0.5);
s.newEquip('amulet1','amulet','ruby','Amulet Lv1',2);
s.newEquip('amulet2','amulet','ruby','Amulet Lv2',4);
s.newEquip('amulet3','amulet','ruby','Amulet Lv3',6);

s.newAbility('offensive0','fireBullet',{name:'Bullet Lv0'},{
	dmg:s.newAbility.dmg(100,'fire'),
});
s.newAbility('offensive1','fireBullet',{name:'Bullet Lv1'},{
	dmg:s.newAbility.dmg(400,'fire'),
	sprite:s.newAbility.sprite('fireball',1.2),
});
s.newAbility('offensive2','fireBullet',{name:'Bullet Lv2'},{
	dmg:s.newAbility.dmg(400,'fire'),
	amount:3,
});
s.newAbility('offensive3','fireBullet',{name:'Bullet Lv3'},{
	dmg:s.newAbility.dmg(400,'fire'),
	amount:5,
});
s.newAbility('defensive0','healModel',{name:'Heal Lv0',periodOwn:25*15,periodGlobal:25*4});
s.newAbility('defensive1','healModel',{name:'Heal Lv1',periodOwn:25*10,periodGlobal:25*3});
s.newAbility('defensive2','healModel',{name:'Heal Lv2',periodOwn:25*6,periodGlobal:25*2});
s.newAbility('defensive3','healModel',{name:'Heal Lv3',periodOwn:25*5,periodGlobal:25*2});

s.newAbility('center','attack',{},{
	type:"bullet",angleRange:20,amount:5,spd:20,
	sprite:s.newAbility.sprite('fireball',1),
	dmg:s.newAbility.dmg(100,'fire'),
});
s.newAbility('offcenter','attack',{},{
	type:"bullet",angleRange:20,amount:5,spd:30,
	sprite:s.newAbility.sprite('fireball',1),
	dmg:s.newAbility.dmg(150,'fire'),
});
s.newAbility('360fire','attack',{},{
	type:"bullet",angleRange:360,amount:36,
	sprite:s.newAbility.sprite('fireball',1),
	dmg:s.newAbility.dmg(100,'fire'),
});
s.newAbility('slowfire','attack',{},{
	type:"bullet",angleRange:60,amount:4,spd:15,maxTimer:250,
	sprite:s.newAbility.sprite('fireball',1.5),
	dmg:s.newAbility.dmg(300,'fire'),
});
s.newAbility('weakfire','attack',{},{
	type:"bullet",angleRange:40,amount:5,
	sprite:s.newAbility.sprite('fireball',0.75),
	dmg:s.newAbility.dmg(25,'fire'),
});
s.newAbility('bat','summon',{},{
	model:s.newAbility.model('bat'),
	amount:1,
});


s.newDialogue('carbon','Carbon','villager-male.3',[ //{
	s.newDialogue.node('badreq',"Hello there! If you go north, you'll find a cave full of monsters!"),
	s.newDialogue.node('intro',"Hey! Wanna play a game?",[
		s.newDialogue.option("Yes!",'intro2'),
		s.newDialogue.option("No!"),
	]),
	s.newDialogue.node('intro2',"This is how it goes. When the game starts, you will have very bad equip and abilities. You have 1:30 min to collect as many resources as possible from flowers and monsters.",[
		s.newDialogue.option("Okay, what are resources used for?",'intro3'),
	]),
	s.newDialogue.node('intro3',"Use the resource to craft Weapons, Armors and Abilities. When the time runs out, you will have to fight a boss with only what you managed to craft.",[
		s.newDialogue.option("That sounds like a great game! Let's start!",'intro4'),
	]),
	s.newDialogue.node('intro4',"Play alone or with your party?",[
		s.newDialogue.option("Solo",'','startCollect'),
		s.newDialogue.option("Party",'','startCollectTeam'),
	]),
]); //}
s.newDialogue('_noquest','Carbon','villager-male.3',[ //{
	s.newDialogue.node('badreq',"Hello there! If you go north, you'll find a cave full of monsters!"),
]); //}

s.newItem('resource','Resource','leaf.leaf',[	//{
	s.newItem.option('craftWeapon','Weapon','Improve Weapon'),
	s.newItem.option('craftArmor','Armor','Improve Armor'),
	s.newItem.option('craftAbilityOff','Off Ability','Improve Offensive Ability'),
	s.newItem.option('craftAbilityDef','Def Ability','Improve Defensive Ability'),
]);	//}
*/
s.newMap('collect',{
	name:"Northern Mountains",
	graphic:"QfirstTown-north",
	lvl:0,
},{
	spot:{"r":{"x":1744,"y":144},"q":{"x":3088,"y":240},"n":{"x":1040,"y":368},"e3":{"x":1808,"y":464},"e4":{"x":496,"y":880},"p":{"x":2992,"y":976},"l":{"x":1328,"y":1008},"e5":{"x":3024,"y":1072},"m":{"x":272,"y":1168},"o":{"x":3152,"y":1200},"e2":{"x":2032,"y":1232},"d":{"x":1776,"y":1296},"k":{"x":2704,"y":1360},"c":{"x":1136,"y":1456},"e":{"x":2288,"y":1584},"e1":{"x":1232,"y":1904},"b":{"x":1680,"y":1936},"j":{"x":3152,"y":2000},"f":{"x":1840,"y":2288},"h":{"x":2320,"y":2352},"e6":{"x":2512,"y":2544},"n1":{"x":1296,"y":2608},"a":{"x":1264,"y":2736},"i":{"x":2800,"y":2832},"g":{"x":1680,"y":2960}},
	load:function(spot){
		var array = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r'];
		for(var i in array){
			m.spawnLoot(spot[array[i]],true,'lootResource','flower');
		}	
		
		m.spawnActorGroup(spot.e1,[
			m.spawnActorGroup.list("bat",1,{deathEvent:'killEnemy'}),
			m.spawnActorGroup.list("bee",1,{deathEvent:'killEnemy'}),
		]);
		
		m.spawnActorGroup(spot.e2,[
			m.spawnActorGroup.list("bat",1,{deathEvent:'killEnemy'}),
			m.spawnActorGroup.list("bee",1,{deathEvent:'killEnemy'}),
		]);	
		
		m.spawnActorGroup(spot.e3,[
			m.spawnActorGroup.list("bat",1,{deathEvent:'killEnemy'}),
			m.spawnActorGroup.list("bee",1,{deathEvent:'killEnemy'}),
		]);	
		
		m.spawnActorGroup(spot.e4,[
			m.spawnActorGroup.list("bat",1,{deathEvent:'killEnemy'}),
			m.spawnActorGroup.list("bee",1,{deathEvent:'killEnemy'}),
		]);	
		
		m.spawnActorGroup(spot.e5,[
			m.spawnActorGroup.list("bat",1,{deathEvent:'killEnemy'}),
			m.spawnActorGroup.list("bee",1,{deathEvent:'killEnemy'}),
		]);	
		
		m.spawnActorGroup(spot.e6,[
			m.spawnActorGroup.list("bat",1,{deathEvent:'killEnemy'}),
			m.spawnActorGroup.list("bee",1,{deathEvent:'killEnemy'}),
		]);	
	},
});
s.newMap('fight',{
	name:"Arena",
	tileset:"v1.2",
	grid:["00000000000000000000001100000000000000111100000010","01111110000000000000001100000000000000111100000100","11111111000000000000000000000000000000000000000110","11111111011111111111111111111111111111111110000011","01111110111111111111111111111111111111111111000001","00000001111111111111111111111111111111111111100000","00000001111111111111111111111111111111111111100000","11000001100000000000000000000000000000000001100000","00100001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100111","00010001100000000000000000000000000000000001101111","00010001100000000000000000000000000000000001101111","00010001100000000000000000000000000000000001100111","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100110","00010001100000000000000000000000000000000001100110","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001100000","00010001100000000000000000000000000000000001101100","10110001100000000000000000000000000000000001101100","11100001100000000000000000000000000000000001100000","01000001100000000000000000000000000000000001100000","00011111100000000000000000000000000000000001100000","00011111100000000000000000000000000000000001100000","00001111100000000000000000000000000000000001100000","00000111100000000000000000000000000000000001100000","00000001100000000000000000000000000000000001100000","00011100111111111111111111111111111111111111111100","00100010011111111111111111111111111111111110111100","01000001000000000000000000000000000000000000000000","01000001000000000000000000000000000000000000011100","01000000111111111111111111111111111000000000100010","01000000000000000000000000000000000100000000110110","01000000000000000000000000000000000010000000111110","01000000000000000000000000000000000010000000011100"],
	lvl:0,
},{
	spot:{"t2":{"x":1200,"y":432},"t3":{"x":656,"y":496},"e1":{"x":1136,"y":560},"t1":{"x":528,"y":1008},"t4":{"x":1072,"y":1008}},
	load:function(spot){
		//m.spawnActor(spot.e1,q.id,'boss',{deathEvent:'killBoss'});	//boss spawn in stopCollect
	}, 
	loop:function(spot){
		if(!m.testInterval(50)) return;
		/*
		var list = m.getPlayerInMap(spot);
		if(list.length === 1){
			var key = list[0];
			if(s.get(key,'party') === true){
				s.message(key,"You're the last man remaining, you win!");
				s.completeQuest(key);
			}
		}
		*/
	},
});

/*
s.newMapAddon('QfirstTown-north',{
	spot:{"n1":{"x":1296,"y":2694},"t3":{"x":752,"y":48},"t2":{"x":1232,"y":48},"a":{"x":1648,"y":208},"t8":{"x":48,"y":272},"t1":{"x":48,"y":528},"t7":{"x":48,"y":816},"t5":{"x":3152,"y":1008},"t4":{"x":1680,"y":1552},"t6":{"x":2896,"y":1552}},
	load:function(spot){
		m.spawnActor(spot.n1,'npc',{
			sprite:s.newNpc.sprite('villager-male3'),
			name:'Carbon',
			dialogue:'talkCarbon'
		});
	},
});

s.newNpc("boss",{
	name:"Goblin",
	sprite:s.newNpc.sprite("goblin",1.2),
	moveRange:s.newNpc.moveRange(3.5,2),
	boss:s.newNpc.boss('test'),
	targetSetting:s.newNpc.targetSetting(10),
	hpRegen:1,
	hp:10000,
});

s.newBoss('tower',s.newBoss.variable({
	opening:20,
}),function(boss){
	s.newBoss.phase(boss,'intro',{
		loop:function(boss){
			if(!m.testInterval(25)) return;	//every 25 frame
			if(Math.random() < 0.5){
				b.useAbility(boss,'center',b.get(boss,'_angle'));
			} else {
				b.useAbility(boss,'offcenter',b.get(boss,'_angle')+b.get(boss,'opening'));
				b.useAbility(boss,'offcenter',b.get(boss,'_angle')-b.get(boss,'opening'));			
			}
		},
		transitionTest:function(boss){
			if(b.get(boss,'_hpRatio') < 0.25) return 'big';
		}
	});
	
	s.newBoss.phase(boss,'big',{
		loop:function(boss){
			if(b.get(boss,'_frame') % 10 !== 0) return;	
			b.useAbility(boss,'slowfire',b.get(boss,'_angle'));
		},
		transitionTest:function(boss){
			if(b.get(boss,'_framePhase') % 250 === 0) return 'weak';
		},
		transitionIn:function(boss){
			if(b.getSummonCount(boss,'bat') < 4) b.useAbility(boss,'bat');
			b.useAbility(boss,'360fire',b.get(boss,'_angle'));
			b.attackOff(boss,25);
			s.setSprite(boss,'',2);
			s.addBoost(boss,'boss','globalDef',10,250);
		},
		transitionOut:function(boss){
			s.setSprite(boss,'',0.75);
		},
	});
	
	s.newBoss.phase(boss,'weak',{
		loop:function(boss){
			if(!m.testInterval(25)) return;
			b.useAbility(boss,'weakfire',b.get(boss,'_angle'));
		},
		transitionTest:function(boss){
			if(b.get(boss,'_framePhase') % 100 === 0) return 'weak';
		},
	});
});
*/
s.exports(exports);








