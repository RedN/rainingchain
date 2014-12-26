//12/18/2014 1:21 AM
/*jslint node: true, undef:true, sub:true, asi:true, funcscope:true, forin:true, unused:false*//*global True, False, loadAPI*/
/*Go to http://jshint.com/ and copy paste your code to spot syntax errors.*/

'use strict';
var s = loadAPI('v1.0','QaggressiveNpc',{
	name:"Bipolarity",
	author:"rc"
});
var m = s.map; var b = s.boss;

/* COMMENT:
-enter eastCave
-go up to  top of mountain in firstTown
-activate switch
-all npc go aggressive
-you kill them all
-quest complete
*/

s.newVariable({
	toggleSwitch:False,
	killCount:0
});
s.newEvent('_signIn',function(key){ //
	s.failQuest(key);
});
s.newEvent('_hint',function(key){ //
	if(!s.get(key,'toggleSwitch')) return 'I wonder what that switch does...';
	return 'KILL THEM ALL!';
});
s.newEvent('_death',function(key){ //
	s.failQuest(key);
});
s.newEvent('killNpc',function(key){ //
	s.add(key,'killCount',1);
	if(s.get(key,'killCount') >= 8){
		s.teleportTown(key);
		s.completeQuest(key);
	}
});
s.newEvent('toggleSwitch',function(key){ //
	s.forEachActor(key,'fight',function(key2){
		s.callEvent('transformNpc',key2);		
	},'npc',null,{toKill:true});
	
	s.set(key,'toggleSwitch',true);
	s.displayPopup(key,'Kill them all to turn them back to normal.');
});
s.newEvent('transformNpc',function(key){ //
	s.spawnActorOnTop(key,'fight','dragon',{
		deathEvent:'killNpc',
		name:s.getAttr(key,'name'),
		sprite:s.newNpc.sprite(s.getAttr(key,'sprite').name)
	});
});
s.newEvent('clickSwitch',function(key){ //
	s.startDialogue(key,'switch','click');
});
s.newEvent('viewNpc',function(key){ //
	return !s.get(key,'toggleSwitch');
});


s.newDialogue('switch','Switch','',[ //{ 
	s.newDialogue.node('click',"for(var i in npcList)<br> npcList[i].aggressive = true;<br>Are you sure you want to activate this?",[ 
		s.newDialogue.option("Yes!",'','toggleSwitch'),
		s.newDialogue.option("No. That's scary.",'','')
	],'')
]); //}

s.newMap('fight',{
	name:"Town",
	lvl:0,
	graphic:'QfirstTown-main',
},{
	spot:{n6:{x:1616,y:944},n5:{x:1296,y:1008},t1:{x:1488,y:1328},n4:{x:1200,y:1392},n1:{x:2064,y:1456},q1:{x:1520,y:1488},t2:{x:1584,y:1680},n8:{x:2000,y:1744},n3:{x:1200,y:1776},n2:{x:1616,y:1904},n7:{x:944,y:1936}},
	load:function(spot){
		m.spawnTeleporter(spot.t1,function(key){
			if(!s.get(key,'toggleSwitch'))
				s.teleport(key,'QfirstTown-eastCave','t7','main');
			else
				s.teleport(key,'fight','t2');
		},'underground');
		
		m.spawnToggle(spot.q1,function(key){ 
			return !s.get(key,'toggleSwitch');
		},'clickSwitch');
		
		m.spawnTeleporter(spot.t2,function(key){
			s.displayPopup(key,"Don't be a coward. Fight!",25*5);
		},'cave');
		
		
		m.spawnActor(spot.n1,'npc',{
			name:'Biglemic',
			sprite:s.newNpc.sprite('villager-male0'),
			tag:{toKill:true},
			viewedIf:'viewNpc',
		});
		m.spawnActor(spot.n2,'npc',{
			name:'Zeldo',
			sprite:s.newNpc.sprite('villager-male1'),
			tag:{toKill:true},
			viewedIf:'viewNpc',
		});
		m.spawnActor(spot.n3,'npc',{
			name:'Condsmo',
			sprite:s.newNpc.sprite('villager-male2'),
			tag:{toKill:true},
			viewedIf:'viewNpc',
		});
		m.spawnActor(spot.n4,'npc',{
			name:'Klappa',
			sprite:s.newNpc.sprite('villager-male3'),
			tag:{toKill:true},
			viewedIf:'viewNpc',
		});
		m.spawnActor(spot.n5,'npc',{
			name:'Ben',
			sprite:s.newNpc.sprite('villager-male4'),
			tag:{toKill:true},
			viewedIf:'viewNpc',
		});
		m.spawnActor(spot.n6,'npc',{
			name:'Mjolk',
			sprite:s.newNpc.sprite('villager-male5'),
			tag:{toKill:true},
			viewedIf:'viewNpc',
		});
		m.spawnActor(spot.n7,'npc',{
			name:'Esvea',
			sprite:s.newNpc.sprite('villager-male6'),
			tag:{toKill:true},
			viewedIf:'viewNpc',
		});
		m.spawnActor(spot.n8,'npc',{
			name:'Zehefgee',
			sprite:s.newNpc.sprite('villager-male7'),
			tag:{toKill:true},
			viewedIf:'viewNpc',
		});
	}
});
s.newMapAddon('QfirstTown-eastCave',{
	spot:{t7:{x:1232,y:1456}},
	load:function(spot){
		m.spawnTeleporter(spot.t7,function(key){
			s.teleport(key,'fight','t1');
		},'zoneLight','down');
	}
});
s.newMapAddon('QfirstTown-main',{
	spot:{t1:{x:1488,y:1328},q1:{x:1520,y:1488}},
	load:function(spot){
		m.spawnTeleporter(spot.t1,function(){},'underground');
		m.spawnToggle(spot.q1,function(){ return true; },function(){});
	}
});

s.exports(exports);
