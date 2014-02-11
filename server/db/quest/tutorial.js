var q = {};
Db.quest['Qtutorial'] = q;
		
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
q.item = {};

q.variable = {
	beeDead:false,
	bossDead:false,
};


q.map = {};
var tut = {};
q.map.tutorial = tut;

tut.hotspot = {"m":{"x":1904,"y":272},"n":[864,1024,352,384],"l":{"x":1840,"y":464},"k":{"x":944,"y":656},"q":{"x":1056,"y":1184},"e":{"x":576,"y":1680},"j":{"x":992,"y":1696},"i":{"x":976,"y":1872},"a":{"x":240,"y":1904},"f":{"x":544,"y":1968},"o":{"x":912,"y":2288},"b":{"x":2176,"y":2464},"c":{"x":2080,"y":2496},"d":{"x":1552,"y":2544},"g":{"x":1760,"y":2880},"h":{"x":1824,"y":3136},"p":{"x":1808,"y":3248}};

tut.cst = {
	arrow:{'type':"bullet",'angle':15,'amount':1,'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"ice2",'sizeMod':0.5},
		'dmg':{'main':10000,'ratio':{'melee':100,'range':0,'magic':0,'fire':0,'cold':0,'lightning':0}}},	
	fireball:{maxTimer:15,'type':"bullet",'angle':0,'amount':1,'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"ice2",'sizeMod':0.5},
		'dmg':{'main':10000,'ratio':{'melee':100,'range':0,'magic':0,'fire':0,'cold':0,'lightning':0}}},		
};

tut.variable = {
	rotation: -9,
	angle:0,
};
		
tut.load = function(map,hotspot,variable,cst){
	//grave
	Actor.creation({'xy':hotspot.h,'map':map,
		"category":"system","variant":"grave"
	});
	Actor.creation({'xy':hotspot.q,'map':map,
		"category":"system","variant":"grave"
	});
	
	//chest
	Actor.creation({'xy':hotspot.m,'map':map,
		"category":"system","variant":"chest",extra:{
			'treasure':function(key){
				Itemlist.add(List.main[key].invList,'tutorial-iceshard',1);
				return true;
			}
		}
	});
	
	//tree
	Actor.creation({'xy':hotspot.e,'map':map,
		"category":"tree","variant":"red"
	});
	
	
	
	//drop staff
	Drop.creation({'xy':hotspot.o,'map':map,
		"item":"Q-tutorial-staff","amount":1,'timer':1/0
	});
	
	//block for switch
	Actor.creation({'xy':hotspot.b,'map':map,
		"category":"block","variant":"2x2"
	});
	//Block to block arrow
	Actor.creation({'xy':hotspot.f,'map':map,
		"category":"block","variant":"2x2"
	});
	
	//Block that disppear when bee dead
	Actor.creation({'xy':hotspot.j,'map':map,
		"category":"block","variant":"2x2Fix",extra:{
			'viewedIf':function(key){
				if(List.all[key].type !== 'player') return true;
				return !List.main[key].quest['Qtutorial'].beeDead;
			}				
		}
	});
	
	//First monster
	Actor.creation({'xy':hotspot.i,'map':map,
		"category":"tutorial","variant":"bee",extra:{
			'deathFunc':function(key){
				List.main[key].quest['Qtutorial'].beeDead = true;						
			}		
		}
	});
	
	//Bees Near Chest
	Actor.creation.group({'xy':hotspot.l,'map':map,'respawn':25*100},[
		{'amount':3,"category":"tutorial","variant":"bee","lvl":0,'modAmount':0}
	]);
	
	//Boss Fire
	Actor.creation({'xy':hotspot.k,'map':map,
		"category":"tutorial","variant":"demon",extra:{
			deathFunc:function(key){
				List.main[key].quest.Qtutorial.bossDead = true;
			}
		}
	});
	
	//Switch
	Actor.creation({'xy':hotspot.c,'map':map,
		"category":"system","variant":"switch",extra:function(mort){
			mort.switch = {
				on:function(key,mortid,map){
					map.variable.Qtutorial.rotation *= -1;		
				}
			};
		}
	});
	
};


tut.loop =  function(map,hotspot,variable,cst){
	if(Loop.interval(25)){
		Map.collisionRect(map,hotspot.n,'player',function(key){
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
			{hitIf:'player-simple',xy:hotspot.a,map:map,angle:Math.randomML()*2},
			useTemplate(Attack.template(),cst.arrow)
		);
	}

	if(Loop.interval(4)){
		//Fireball
		variable.angle += variable.rotation;
		variable.angle = variable.angle+360;
		Attack.creation(
			{hitIf:'player-simple',xy:hotspot.d,map:map,angle:variable.angle},
			useTemplate(Attack.template(),cst.fireball)
		);
		
		Attack.creation(
			{hitIf:'player-simple',xy:hotspot.d,map:map,angle:variable.angle+120},
			useTemplate(Attack.template(),cst.fireball)
		);
		
		Attack.creation(
			{hitIf:'player-simple',xy:hotspot.d,map:map,angle:variable.angle+240},
			useTemplate(Attack.template(),cst.fireball)
		);
		
	}
	
}


	
	

	
	
	
	
	
	