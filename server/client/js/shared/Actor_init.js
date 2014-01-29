//Mort
if(typeof Actor === 'undefined') Actor = {};
if(!Actor.creation) Actor.creation = {};
if(!Actor.template) Actor.template = {};	

Init.actor = function(){
	var defaultPreActor = function(type){
		var mort = {};

		
		//{Dont touch
		mort.change = {};
		mort.old = {};
		mort.permBoost = {};    //no timer
		mort.boost = {          //timer aka needs to be updated every frame
			'fast':{},'reg':{},'slow':{},'custom':{},
			'toUpdate':{},
			'list':Actor.template.boost(type),
		};
		mort.frameCount = 0;
		mort.viewedBy = {};     //list of actors that see this object
		mort.viewedIf = 'true'; //condition to see. check viewedIfList
		mort.activeList = {};   //actors near this object
		mort.active = 1;    	//if not active, dont move. no cpu
		mort.damagedBy = {};   //list of actors that damaged him (used for owner of the drops)
		mort.dead = 0;          //dead = invisible
		mort.killed = 0;        //killed = cant move, 0 hp but visible (aka death animation)
		mort.type = type;
		mort.target = {
			main:{list:[],period:{first:25,renew:150,stuck:250},confort:1},
			sub:{list:[],period:{first:25,renew:150}},
			path:{list:[],period:25},
		};
		
		
		mort.bonus = Actor.template.bonus();	//Bonus applies on top of ability attack. If effect not on ability, do nothing.
		mort.mastery = Actor.template.mastery(type);
		
		mort.status = {
			'knock':{'active':{"time":0,"magn":0,"angle":0},'resist':0},
			'burn':{'active':{"time":0,"magn":0},'resist':0},
			'chill':{'active':{"time":0,"magn":0,"atk":0},'resist':0},
			'confuse':{'active':{"time":0,"magn":0,"input":[0,1,2,3]},'resist':0},
			'bleed':{'active':{"time":0,"list":[]},'resist':0,},
			'drain':{'active':{"time":0,"magn":0},'resist':0},
		}
		
		mort.angle = 1;	
		mort.moveAngle = 1;
		mort.spdX = 0;	
		mort.spdY = 0;	
		mort.mouseX = 0;	
		mort.mouseY = 0;
		mort.moveInput = [0,0,0,0];	    //right,down,left,up
		mort.bumper = [0,0,0,0];        //1 if touchs map
		mort.attackReceived = {};	//so pierce doesnt hit multiple times
		
		mort.hp = 1000;	
		mort.mana = 100;	
		mort.dodge = 100;	
		mort.fury = 100;	
		mort.heal = 100;
		
		mort.abilityList = {};
		mort.abilityChange = Actor.template.abilityChange();	
		
		mort.friction = 0.9;
		mort.move = 1;
		mort.summon = {};       //if actor is master
		mort.summoned = 0;      //if actor is child. .summoned = master id
		//}
		
		//{Setting Affected for Db.enemy
		mort.id = Math.randomId();
		mort.publicId = Math.randomId(6);   //id shared with all players
		mort.optionList = '';   //list of option when right-clicked
		mort.modList = [];  
		mort.group = '';            //enemy group
		mort.x = 1050;	
		mort.y = 550;	
		mort.map = 'test@MAIN';
		//}
		
		//{Setting Used for Db.enemy
		mort.category = "eSlime";   //for enemy
		mort.variant = "Regular";   //for enemy
		mort.lvl = 0;
		mort.name = "Goblin";     //visible name
		mort.drop = {
			"mod":{
				"quantity":0,
				"quality":0,
				"rarity":0
			},
			"category":[],
			'plan':[],
		};    
		mort.minimapIcon = 'minimapIcon.enemy';     //icon used for minimap
		mort.sprite = {"name":"pMace","anim":"walk","sizeMod":1}			
		mort.equip = Actor.template.equip();
		mort.weapon = Actor.template.weapon();
		mort.moveRange = {
			'ideal':100,                //distance enemy wants to be from target
			'confort':25,               
			'aggressive':400,           //attack player if within this range
			'farthest':400,             //stop follow player if above this range
		};
		mort.reflect = Cst.element.template(); //% reflected
		mort.nevercombat = 0;
		mort.boss = '';
		mort.resource = {
			'hp':{'max':1000,'regen':1},
			'mana':{'max':100,'regen':0.1},
			'dodge':{'max':100,'regen':0.1},
			'fury':{'max':100,'regen':0.1},
			'heal':{'max':100,'regen':0.1},
		};
		mort.globalDef = 1;
		mort.globalDmg = 1;   //global modifier
		mort.aim = 0;       //difference between mouse and actually bullet direction
		mort.atkSpd = {'main':1,'support':1};	
		mort.ability = [];
		mort.invisible = 0;
		mort.ghost = 0;
		mort.nevermove = 0;
		mort.maxSpd = 15;	
		mort.acc = 3;
		//}
		
		//{Setting for Map.load extra
		mort.dialogue = '';      //function used to trigger dialogue
		mort.chatHead = "";     //is talking?
		mort.deathAbility = [];
		mort.combat = 1;
		mort.deleteOnceDead = 0;
		mort.hitIf = mort.type;
		mort.targetIf = mort.type;  //condition used by monsters to find their target. check targetIfList
		//}	
	

		

	
		
		//{Player Only
		if(type === 'player'){
			if(server){
				mort.weapon = Db.equip[mort.weapon.id];
				for(var i in mort.equip.piece){	mort.equip.piece[i] = Db.equip[mort.equip.piece[i].id];}
				Actor.updateEquip(mort);
			}
			mort.skill = Actor.template.skill();
			mort.removeList = {};	//for things that got removed from activeList
			mort.type = 'player';
			mort.hitIf = 'player';
			mort.targetIf = 'player';
			mort.privateChange = {};
			mort.privateOld = {};
			mort.context = 'player0000';
			mort.name = 'player0000';
			
			mort.team = mort.name;
			mort.item = {"quantity":0,"quality":0,"rarity":0};  //aka magic find
			mort.pickRadius = 100;  //distance to pick items on ground
			
			mort.mapSignIn = {x:mort.x,y:mort.y,map:mort.map};
			mort.mapDeath = {x:mort.x,y:mort.y,map:mort.map};
			
			Sprite.creation(mort,mort.sprite);
			mort.ability = Actor.template.ability(type);
			mort.abilityList = Actor.template.abilityList();
		}
		//}
		for(var i in mort.boost.list){  //init default Db.stat value
			changeViaArray({'origin':mort,'array':mort.boost.list[i].stat,'value':mort.boost.list[i].base});
		}
		return mort;
	}


	var p = defaultPreActor('player');
	var e = defaultPreActor('enemy');
	
	var temp = Actor.template;
	
	Actor.template = new Function('type', 'return type === "player" ? ' + stringify(p) + ' : ' + stringify(e));
	for(var i in temp) Actor.template[i] = temp[i];
}


//Template
Actor.template.skill = function(){
	return {
		'exp':{'melee':100000,'range':100000,'magic':100000,'metalwork':100000,'woodwork':100000,'leatherwork':100000,'geology':100000,'metallurgy':100000,'trapping':100000},
		'lvl':{'melee':0,'range':0,'magic':0,'metalwork':0,'woodwork':0,'leatherwork':0,'geology':0,'metallurgy':0,'trapping':0},
	}; 
};


Actor.template.weapon = function(){
	return {"id":"mace",'dmg':{'main':1,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}}};
};

Actor.template.equip = function(type){
	if(type === 'enemy')
		return {"def":Cst.element.template(1),"dmg":Cst.element.template(1)};	

	return {
		"piece":{				
			"bracelet":{"id":"bracelet"},
			"helm":{"id":"metalhelm"},
			"amulet":{"id":"amulet"},
			"gloves":{"id":"gloves"},
			"body":{"id":"metalbody"},
			"shield":{"id":"metalshield"},
			"boots":{"id":"boots"},
			"pants":{"id":"pants"},	
			"ring":{"id":"ring"},
			"melee":{'id':"mace"},
			"range":{'id':"boomerang"},
			"magic":{'id':"wand"},
		},
		"def":Cst.element.template(1),
		"dmg":Cst.element.template(1),
	};
};




Actor.template.abilityChange = function(){
	return {'press':'00000000000000','charge':{},'chargeClient':[0,0,0,0,0,0],'globalCooldown':0};
}

Actor.template.mastery = function(type){
	if(type === 'enemy'){
		return {	
			'def':{'melee':{'sum':1,'mod':1},'range':{'sum':1,'mod':1},'magic':{'sum':1,'mod':1},'fire':{'sum':1,'mod':1},'cold':{'sum':1,'mod':1},'lightning':{'sum':1,'mod':1}},
			'dmg':{'melee':{'sum':1,'mod':1},'range':{'sum':1,'mod':1},'magic':{'sum':1,'mod':1},'fire':{'sum':1,'mod':1},'cold':{'sum':1,'mod':1},'lightning':{'sum':1,'mod':1}},
		};
	}
	return {	
		'def':{'melee':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'range':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'magic':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'fire':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'cold':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'lightning':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1}},
		'dmg':{'melee':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'range':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'magic':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'fire':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'cold':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'lightning':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1}},
	};
};

Actor.template.abilityList = function(){
	return {
		'bulletMulti':{id:'bulletMulti'},
		'bulletMulti-boom':{id:'bulletMulti-boom'},
		'bulletMulti-para':{id:'bulletMulti-para'},
		'bulletMulti-sin':{id:'bulletMulti-sin'},
		'bulletMulti-hitmod':{id:'bulletMulti-hitmod'},
		'bulletMulti-fast':{id:'bulletMulti-fast'},
		
		//'bulletSingle':{id:'bulletSingle'},
		//'strikeSingle':{id:'strikeSingle'},
		//'dodgeRegular':{id:'dodgeRegular'},
		//'stumble':{id:'stumble'},
		//'summonDragon':{id:'summonDragon'},
	};
}
Actor.template.ability = function(){
	return [{id:'bulletMulti'}];
}



Actor.template.dialogue = function(){
	return {
		'talkIf':true,	//can be function
		'location':{},
		'tag':[],
		'option':{},
		'func':function(){},
	}
}





