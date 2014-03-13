var q = {};
		
q.id = 'Qtutorial';
q.name = 'Tutorial';
q.icon = 'skill.melee';
q.reward = {'stat':'dmg-fire-+','value':[0.05,0.10]};
q.rewardMod = 0.5;
q.description = "Raining Chain Tutorial";

q.requirement = [];
q.hintGiver = function(key,mq){	return 'None.';};

q.dialogue = {};
q.bonus = {};


q.variable = {
	beeDead:false,
	bossDead:false,
};


q.ability = {};
q.equip = {};
q.item = {};
q.plan = {};
q.enemy = {};
q.map = {};

q.ability['Aiceshard'] = {'type':'attack','name':'Ice Shard','icon':'attackMagic.crystal',
	'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
	'action':{'func':'Combat.action.attack','param':{
		'type':"bullet",'angle':0,'amount':1,
		'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"ice2",'sizeMod':0.5},
		'dmg':{'main':100,'ratio':{'melee':0,'range':0,'magic':30,'fire':0,'cold':70,'lightning':0}},
	}
}};
	
q.equip['Estaff'] = {
	'piece': 'magic','type': 'staff','icon':'magic.staff',
	'name':"Crappy Staff",'sprite':{'name':"mace",'sizeMod':1},
	'dmg':{'main':10,'ratio':{'melee':20,'range':0,'magic':40,'fire':40,'cold':0,'lightning':0}},
	'boost': [],
}

q.item['Ifakestaff'] = {'name':'Staff','icon':'magic.staff','option':[		
	{'name':'Examine Equip','func':'Main.examineEquip','param':['Qtutorial-Estaff']},
	{'name':'Change Equip','param':[],'func':function(key){
		Actor.learnAbility(List.all[key],'fireball');
		Actor.swapAbility(List.all[key],'fireball',0);
		Itemlist.remove(List.main[key].invList,'Qtutorial-Ifakestaff',1);
		Chat.add(key,"You can now throw fireballs with Left-Click.");
		Chat.add(key,"You can now manage your abilities via the ABILITY button under the EQUIP Tab.");
		Actor.switchEquip(List.all[key],'E-tutorial-staff');
	}},
]};	

q.plan['Pstaff'] = {
	category:'equip',
	piece:'magic',	
	type:'staff',
	unique:'Qtutorial-Ifakestaff',
	definitive:1,
	req:{item:[['wood-0',1],['Qtutorial-Pstaff',1]],skill:{}},
};
		


//{Enemy
q.enemy["bee"] = {  //{
	"name":"Bee",
	"sprite":{'name':"bee",'sizeMod':1},
	"abilityList":{'pierce':0.8},
	'resource':{'hp':{'max':1,'regen':1},'mana':{'max':100,'regen':1}},
	
	'globalDef':1,
	'globalDmg':0.1,
	'deathExp':1,
	"equip":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
	"acc":2,
	"maxSpd":5,
	"moveRange":{'ideal':50,"confort":50,"aggressive":200,"farthest":300},	
}; //}

q.enemy["demon"] = {  //{
	"name":"Demon Immune To Fireballs.",
	"sprite":{'name':"demon",'sizeMod':1},
	"abilityList":{
	//'fireNova':0.4,
	fireCircle:0.7},
	'resource':{'hp':{'max':100,'regen':0.3},'mana':{'max':100,'regen':1}},
	'immune':{'fire':1},
	'globalDef':1,
	'globalDmg':0.2,
	'deathExp':1,
	"equip":{'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
	"acc":2,
	"maxSpd":5,
	"moveRange":{'ideal':200,"confort":50,"aggressive":300,"farthest":400},	
}; //}
	
	
//}	


//{Map
var tut = q.map.tutorial = {};

tut.spot = {"m":{"x":1904,"y":272},"n":[864,1024,352,384],"l":{"x":1840,"y":464},"k":{"x":944,"y":656},"q":{"x":1056,"y":1184},"e":{"x":576,"y":1680},"j":{"x":992,"y":1696},"i":{"x":976,"y":1872},"a":{"x":240,"y":1904},"f":{"x":544,"y":1968},"o":{"x":912,"y":2288},"b":{"x":2176,"y":2464},"c":{"x":2080,"y":2496},"d":{"x":1552,"y":2544},"g":{"x":1760,"y":2880},"h":{"x":1824,"y":3136},"p":{"x":1808,"y":3248}};

tut.variable = {
	rotation: -9,
	angle:0,
	arrow:{'type':"bullet",'angle':15,'amount':1,'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"ice2",'sizeMod':0.5},
		'dmg':{'main':10000,'ratio':{'melee':100,'range':0,'magic':0,'fire':0,'cold':0,'lightning':0}}},	
	fireball:{maxTimer:20,'type':"bullet",'angle':0,'amount':1,'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"ice2",'sizeMod':0.5},
		'dmg':{'main':10000,'ratio':{'melee':100,'range':0,'magic':0,'fire':0,'cold':0,'lightning':0}}},		

};
		
tut.load = function(map,spot,v,m){
	//grave
	Actor.creation({'xymm':spot.h,
		"category":"system","variant":"grave"
	});
	
	Actor.creation({'xym':spot.q,
		"category":"system","variant":"grave"
	});
	
	//chest
	Actor.creation({'xym':spot.m,
		"category":"system","variant":"chest",extra:{
			'treasure':function(key){
				Itemlist.add(List.main[key].invList,'Qtutorial-Aiceshard',1);
				return true;
			}
		}
	});
	
	//drop staff
	Drop.creation({'xym':spot.o,
		"item":"Qtutorial-Pstaff","amount":1,'timer':1/0
	});
	
	//block for switch
	Actor.creation({'xym':spot.b,
		"category":"block","variant":"2x2"
	});
	//Block to block arrow
	Actor.creation({'xym':spot.f,
		"category":"block","variant":"2x2"
	});
	
	//Block that disppear when bee dead
	Actor.creation({'xym':spot.j,
		"category":"block","variant":"2x2Fix",extra:{
			'viewedIf':function(key){
				if(List.all[key].type !== 'player') return true;
				return !List.main[key].quest['Qtutorial'].beeDead;
			}				
		}
	});
	
	//First monster
	Actor.creation({'xym':spot.i,
		"category":"Qtutorial","variant":"bee",lvl:'+100',extra:{
			'deathFunc':function(key){
				List.main[key].quest['Qtutorial'].beeDead = true;						
			}		
		}
	});
	
	//Bees Near Chest
	Actor.creation.group({'xym':spot.l,'respawn':25*100},[
		{'amount':3,"category":"Qtutorial","variant":"bee",'modAmount':0}
	]);
	
	//Boss Fire
	Actor.creation({'xym':spot.k,
		"category":"Qtutorial","variant":"demon",lvl:'+100',extra:{
			deathFunc:function(key){
				List.main[key].quest.Qtutorial.bossDead = true;
			}
		}
	});
	
	//Switch
	Actor.creation({'xym':spot.c,
		"category":"system","variant":"switch",extra:function(mort){
			mort.switch = {
				on:function(key,mortid,map){
					map.addon.Qtutorial.variable.rotation *= -1;		
				}
			};
		}
	});
	
};
tut.playerEnter = function(key,map,spot,v,m){
	Actor.creation({'xym':spot.e,
		"category":"tree","variant":"red",extra:{
			viewedIf:[key],		
		}
	});
	
	Actor.creation({'xym':spot.h,
		"category":"tree","variant":"red",extra:{
			viewedIf:[key],		
		}
	});
	Actor.creation({'xym':spot.q,
		"category":"tree","variant":"red",extra:{
			viewedIf:[key],		
		}
	});
	console.log(1);
}

tut.loop =  function(map,spot,v,m){
	if(Loop.interval(25)){
		Map.collisionRect(map,spot.n,'player',function(key){
			var mort = List.all[key];
			if(List.main[key].quest.Qtutorial.bossDead){
				Chat.add(key,'Congratz! You have beaten the tutorial!.');
			} else {
				Chat.add(key,'You need to kill the Fire Demon first to leave this area.');
			}	
			
		});
	}	
	
	if(Loop.interval(6)){
		//Arrow
		Attack.creation(
			{hitIf:'player-simple',xym:spot.a,angle:Math.randomML()*2},
			useTemplate(Attack.template(),v.arrow)
		);
	}

	if(Loop.interval(4)){
		//Fireball
		v.angle += v.rotation;
		v.angle = v.angle+360;
		Attack.creation(
			{hitIf:'player-simple',xym:spot.d,angle:v.angle},
			useTemplate(Attack.template(),v.fireball)
		);
		
		Attack.creation(
			{hitIf:'player-simple',xym:spot.d,angle:v.angle+120},
			useTemplate(Attack.template(),v.fireball)
		);
		
		Attack.creation(
			{hitIf:'player-simple',xym:spot.d,angle:v.angle+240},
			useTemplate(Attack.template(),v.fireball)
		);
		
	}
	
}




exports.quest = q;






