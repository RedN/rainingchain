"use strict";
var s = require('./../Quest_exports').init('v1.0','Qbtt');
var q = s.quest; var m = s.map; var b = s.boss;

q.name = "Break The Targets";

q.reward = {
	exp:{},
	item:{},
	passive:{min:0.1,max:0.5,mod:10},
};

q.challenge = {
	speedrunner:s.challenge('speedrun','1:05:10.10'),
};

q.variable = {
	killTarget:0,
	time:0,
};
q.highscore = {
	time:{name:'Fastest Time',order:'ascending'},
}

var TARGETAMOUNT = 10;

q.event = {
	_hint:function(key){
		if(!s.get(key,'_active')) return 'You can start this quest by talking to the girl south west of Goblin Land';
		return "Good luck!";
	},
	_test:{
		signIn:function(key){
			
		},
		firstSignIn:function(key){
			s.teleport(key,'goblinLand','n1');
			s.setRespawn(key,'goblinLand','n1');
		}
	},	
	_signIn:function(key){
		s.abandonQuest(key);
	},
	_start:function(key){
		
		
	},
	_abandon:function(key){
		s.teleport(key,'goblinLand','n1');
		s.setRespawn(key,'goblinLand','n1');
		s.chrono(key,'timer','remove');
	},
	_complete:function(key){
		
		
	},
	_highscore:function(key){
		return {
			time:s.get(key,'time'),		
		};	
	},
	talkJenny:function(key){
		if(!s.get(key,'_active')){ s.startQuest(key); return; }
		s.dialogue(key,'jenny','intro','first');
	},
	teleportCourse:function(key){
		s.teleport(key,'btt001@@','q1');
		s.freeze(key,2*25,q.event.startCourse);
	},
	startCourse:function(key){
		s.chat(key,"GO!");
		s.chrono(key,'timer','start');
	},
	killTarget:function(key){
		s.set(key,'killTarget','+1');
		if(s.get(key,'killTarget') >= TARGETAMOUNT){
			q.event.endCourse(key);
		}
	},
	endCourse:function(key){
		var time = s.chrono(key,'timer','stop');
		s.chat(key,'Your time is : ' + time + ' milliseconds.');
		s.completeQuest(key);
		s.teleport(key,'goblinLand','n1');
	},
};	





q.npc["target"] = {  
	"name":"Target",
	"sprite":{'name':"goblin",'sizeMod':1.2},
	"nevermove":1,
	"abilityList":[],
	'resource,hp,max':1,
	'modAmount':false,
	"mastery":{'def':{'melee':0.5,'range':0.5,'magic':0.5,'fire':2,'cold':2,'lightning':2},
				'dmg':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
}; 

q.dialogue['jenny'] = {'face':{'image':'villager-female.0','name':'Jenny'},
	'intro':{
		'first':{
			'text':"Hey! Break all the targets and receive a reward!",
			'exit':0,
			'option':[
				{'text':"Sure. Why not!",event:q.event.teleportCourse},
				{'text':"No."},
			],
		},
	},
};


q.map.btt001 = function(){
	var map = m.map();
	map.name = "Btt001";
	map.graphic = "btt001";
	map.lvl = 0;
	map.tileset = "v1.1";
	map.grid = ["00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000001111111111111111111111111111111111100000000","00000011111111111111111111111111111111111110000000","00000111111111111111111111111111111111111111000000","00000111111111111111111111111111111111111111000000","00000110000000000000000000000000000000000011000000","00000110000000000000000000000000000000000011000000","00000110000000111000000011100000000000000011000000","00000110000000111000000011100000000000000011000000","00000110000000111000000011100000000000000011000000","00000110000000111111000011111110000000000011000000","00000110000000000111000011111110000000000011000000","00000110000000000111000011100000000000000011000000","00000110000000000111000011100000000000000011000000","00000110000000000000000011100000001110000011000000","00000110000000000000000000000000001110000011000000","00000110000000000000000000000000001110000011000000","00000110000000000111000000000000001110000011000000","00000110000000000111000000000000001110000011000000","00000110000000000111000000000000001110000011000000","00000110000000000111000000000000001110000011000000","00000110000111111111000000000000001110000011000000","00000110000111111111000000000000000000000011000000","00000110000111111111111111000111000000000011000000","00000110000111111111111111000111000000000011000000","00000110000000000000111111000111000000000011000000","00000110000000000000111111000111000000000011000000","00000110000000000000000000000000000000000011000000","00000110000000000000000000000000000000000011000000","00000110000000000000000000000000000000000011000000","00000110000000000000000000000000000000000011000000","00000011111111111111111111111111111111111110000000","00000001111111111111111111111111111111111100000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000","00000000000000000000000000000000000000000000000000"]
	var a = map.addon[q.id] = {};
	a.spot = {"e3":{"x":592,"y":496},"e6":{"x":912,"y":496},"e8":{"x":1104,"y":560},"e4":{"x":464,"y":624},"e7":{"x":976,"y":688},"e5":{"x":688,"y":720},"ea":{"x":1232,"y":784},"e2":{"x":464,"y":848},"q1":{"x":816,"y":848},"e1":{"x":496,"y":1136},"eb":{"x":1136,"y":1136}}
	a.path = {}
	a.variable = {}; 
	a.load = function(spot){
	
		m.actor(spot.e1,q.id,"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e2,q.id,"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e3,q.id,"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e4,q.id,"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e5,q.id,"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e6,q.id,"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e7,q.id,"target",{deathEvent:q.event.killTarget});
		m.actor(spot.e8,q.id,"target",{deathEvent:q.event.killTarget});
		m.actor(spot.ea,q.id,"target",{deathEvent:q.event.killTarget});
		m.actor(spot.eb,q.id,"target",{deathEvent:q.event.killTarget});	
	
	} 
	a.loop = function(spot){} 
	return map;
};


q.mapAddon.goblinLand = {
	spot:{"n1":{"x":2704,"y":6032}},
	path:{},
	variable:{},
	load:function(spot){
		m.actor(spot.n1,"npc","regular",{
			name:'Jenny',
			'sprite,name':"villager-female0",
			angle:180,
			nevermove:1,
			dialogue:q.event.talkJenny,
		});
	
	}, 
	loop:function(spot){} 
}


exports.quest = q;





