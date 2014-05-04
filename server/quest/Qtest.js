"use strict";
var s = require('./../Quest_exports').init('v1.0','Qtest');
var q = s.quest; var m = s.map; var b = s.boss;


q.variable = {
	
};

q.event = {
	start:function(key){
		var act = s.getAct(key);
		s.addItem(key,'generator');
		s.addItem(key,'equipGenerator');
		Test.generateEquip(key,0,5);
				
		s.addItem(key,'weapon');
		Actor.equip(act,'Qtest-weapon');
		
		//act.abilityList = {'Qtest-simple':1};
		//Actor.ability.swap(act,'Qtest-simple',0);
		
		Test.removeEquipInventory(key);
		
	}
}

q.item['generator'] = {'name':'Generator','icon':'magic.staff','stack':1,'drop':0,'option':[		
	{'name':'Tele','param':[],'func':function(key){
		s.question(key,{text:"x,y,map", func:function(key,x,y,map){
			Actor.teleport(s.getAct(key),{x:+x,y:+y,map:map});		
		}});	
	}},	
	{'name':'Item','param':[],'func':function(key){
		s.question(key,{text:"item,amount", func:function(key,item,amount){
			if(Db.item[item])	Itemlist.add(key,item,amount || 1);
			else Chat.add(key,'wrong');
		}});	
	}},
	{'name':'Enemy','param':[],'func':function(key){
		Chat.question(key,{text:"Category,Variant", func:function(key,cat,variant){
			Test.spawnEnemy(key,cat,variant);		
		}});	
	}},
	{'name':'Equip','param':[],'func':Test.generateEquip},
	{'name':'Ability','param':[],'func':Test.setAbility},
	{'name':'Invincible','param':[],'func':Test.invincible},
]};	

q.item['equipGenerator'] = {'name':'Equip Gen','icon':'system.gold','stack':1,'option':[
	{'name':'Craft Armor','func':'Plan.use','param':['randomArmor'],question:true,description:'Generate a armor'},
	{'name':'Craft Weapon','func':'Plan.use','param':['randomWeapon']},
	{'name':'Craft Weapon2','func':'Plan.use','param':['randomWeapon2']},
	{'name':'Open Bank','func':'Main.openWindow','param':['bank']},
]};	

//}	

q.equip['weapon'] = {'piece': 'melee','type': 'mace','icon':'melee.mace',
	'name':"Mace",'sprite':{'name':"mace",'sizeMod':1},
	'dmg':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
}

q.ability['simple'] = {'type':'attack','name':'Fire Basic','icon':'attackMagic.fireball',
	'spd':{'main':1,'support':0},'period':{'own':25,'global':25},
	'action':{'func':'Combat.attack','param':{
		'type':"bullet",'angle':0,'amount':1,
		'objImg':{'name':"fireball",'sizeMod':1.2},'hitImg':{'name':"fireHit",'sizeMod':0.5},
		'dmg':{'main':100,'ratio':{'melee':100,'range':100,'magic':100,'fire':100,'cold':100,'lightning':100}},
	}
}};
	

//{Map
q.map.test = function(){
	var map = m.init();
	map.name = "Test Zone";
	map.graphic = "goblinLand";
	map.tileset = 'v1.1';
	map.lvl = 0;	

	var a = map.addon.main = {};
	return map;
};





//}


exports.quest = q;






