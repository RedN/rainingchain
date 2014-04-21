//Mort
Init.actor = function(){
	var defaultPreActor = function(type){
		var act = {};
		
		//dont touch
		act.change = {};
		act.old = {};
		act.permBoost = {};    //no timer
		act.boost = {          //timer aka needs to be updated every frame
			'fast':{},'reg':{},'slow':{},'custom':{},
			'toUpdate':{},
			'list':Actor.template.boost(type),
		};
		act.frame = 0;
		act.viewedBy = {};     //list of actors that see this object
		act.viewedIf = 'true'; //condition to see. check viewedIfList
		act.activeList = {};   //actors near this object
		act.active = 1;    	//if not active, dont move. no cpu
		act.damagedBy = {};   //list of actors that damaged him (used for owner of the drops)
		act.dead = 0;          //dead = invisible
		act.type = type;
		act.target = {
			main:null,sub:{x:0,y:0},	
			period:{main:90,sub:25,stuck:113},
			cutscene:{active:0,path:[],time:0,func:null},
			stuck:[],
			reachedGoal:0,isStuck:0,maxAngleChange:180,
		}
		
		act.customBoost = Actor.template.customBoost();
		act.bonus = Actor.template.bonus();	//Bonus applies on top of ability attack. If effect not on ability, do nothing.
		act.mastery = Actor.template.mastery(type);
		
		act.status = {
			'bleed':{"time":0,"list":[],'resist':0,},				//fixed dmg per frame, fast but short
			'knock':{"time":0,"magn":0,"angle":0,'resist':0},		//push
			'drain':{"time":0,"magn":0,'resist':0},					//leech mana
			'burn':{"time":0,"magn":0,'resist':0},					//dmg/frame depending on hp, long but slow
			'chill':{"time":0,"magn":0,'resist':0},					//slower move
			'stun':{"time":0,"magn":0,'resist':0},					//stun, remove attack charge
		};
		act.statusClient = '000000';
		act.curseClient = {};
		act.block = 0; 						//{direction:4,distance:0};
			
		act.angle = 1;	
		act.moveAngle = 1;
		act.spdX = 0;	
		act.spdY = 0;	
		act.mouseX = 0;	
		act.mouseY = 0;
		act.moveInput = [0,0,0,0];	    //right,down,left,up
		act.bumper = [0,0,0,0];        //1 if touchs map
		act.attackReceived = {};	//so pierce doesnt hit multiple times
		
		act.hp = 1000;	
		act.mana = 100;	
		act.dodge = 100;	
		act.fury = 100;	
		act.heal = 100;
		
		act.abilityChange = Actor.template.abilityChange();	
		act.abilityAi = {close:{},middle:{},far:{},range:[60,300]};
		act.abilityList = Actor.template.abilityList();		
		act.ability = Actor.template.ability();
		act.combatContext = 'regular';		//or pvp
		act.friction = 0.9;
		act.bounce = 1;			//mod
		act.timeOut = {};
		act.move = 1;
		act.summon = {};       //if actor is master
		act.summoned = '';      //if actor is child. .summoned = master id
		//}}
		
		//{Setting Affected for Db.enemy
		act.id = Math.randomId();
		act.publicId = Math.randomId(6);   //id shared with all players
		act.optionList = null;   //list of option when right-clicked
		act.modList = [];  		//list of enemy mods (ex immuneFire)
		act.group = '';            //enemy group
		act.x = 1050;	
		act.y = 550;	
		act.map = 'test@MAIN';
		//}
		
		//{Setting Used for Db.enemy
		act.category = "slime";   //for enemy
		act.variant = "Regular";   //for enemy
		act.lvl = 0;
		act.name = "Goblin";     //visible name
		act.username = "player000";     //id name
		act.minimapIcon = 'color.red';     //icon used for minimap
		act.sprite = Actor.template.sprite();		
		act.equip = Actor.template.equip();
		act.weapon = Actor.template.weapon();
		act.moveRange = {
			'ideal':100,                //distance enemy wants to be from target
			'confort':25,               
			'aggressive':400,           //attack player if within this range
			'farthest':400,             //stop follow player if above this range
		};
		act.moveSelf = 1; 		//generate its own input	(ex: block dont but still move)
		
		act.reflect = Cst.element.template(0); //% reflected
		act.nevercombat = 0;
		act.boss = '';
		act.resource = {
			'hp':{'max':1000,'regen':1},
			'mana':{'max':100,'regen':0.1},
			'dodge':{'max':100,'regen':0.1},
			'fury':{'max':100,'regen':0.1},
			'heal':{'max':100,'regen':0.1},
		};
		act.globalDef = 1;
		act.globalDmg = 1;   //global modifier
		act.aim = 0;       //difference between mouse and actually bullet direction
		act.atkSpd = {'main':1,'support':1};	
		act.ghost = 0;
		act.nevermove = 0;
		act.maxSpd = 15;	
		act.acc = 3;
		act.immune = {};
		//}
		
		//{Setting for Map.load extra
		act.dialogue = null;      //function used to trigger dialogue
		act.chatHead = "";     //is talking?
		act.deathAbility = [];
		act.deathFunc = null;	//function param = id of each killer
		act.deathFuncArray = null;	//function param = array id of killers
		act.combat = 1;
		act.deleteOnceDead = 0;
		act.damageIf = 'player';
		act.damagedIf = 'true';
		act.targetIf = 'player';  //condition used by monsters to find their target. check targetIfList
		act.onclick = {};			
		act.waypoint = null; 		//right click = setRespawn
		act.loot = null;		//right click = gives items;
		act.block = null;			//change map coliision
		act.teleport = null;
		act.tag = '';				//to get enemy in q.event
		//}	
		

		//{Player Only
		if(type === 'player'){
			act.skill = Actor.template.skill();
			act.removeList = [];	//for things that got removed from activeList
			act.type = 'player';
			act.damageIf = 'npc';
			act.privateChange = {};
			act.privateOld = {};
			act.context = 'player0000';
			act.name = 'player0000';
			
			act.team = act.name;
			act.item = {"quantity":0,"quality":0,"rarity":0};  //aka magic find
			act.pickRadius = 100;  //distance to pick items on ground
			
			act.respawnLoc = {safe:{x:act.x,y:act.y,map:act.map},recent:{x:act.x,y:act.y,map:act.map}};
			Sprite.creation(act,act.sprite);
		}
		//}
		for(var i in act.boost.list){  //init default Db.stat value
			Tk.viaArray.set({'origin':act,'array':act.boost.list[i].stat,'value':act.boost.list[i].base});
		}
		return act;
	}
	
	var p = defaultPreActor('player');
	var e = defaultPreActor('npc');
	
	var temp = Actor.template;
	Actor.template = function(type){
		if(type === 'player') return Tk.deepClone(p);
		return Tk.deepClone(e);	
	}
	for(var i in temp) Actor.template[i] = temp[i];
}


Actor.template = {};	

Actor.template.skill = function(){
	var value = Cst.exp.list[0];
	return {
		'exp':{'melee':value,'range':value,'magic':value,'metalwork':value,'woodwork':value,'leatherwork':value,'geology':value,'metallurgy':value,'trapping':value},
		'lvl':{'melee':0,'range':0,'magic':0,'metalwork':0,'woodwork':0,'leatherwork':0,'geology':0,'metallurgy':0,'trapping':0},
	}; 
};

Actor.template.weapon = function(){
	return 'unarmed';
};

Actor.template.equip = function(info){
	return {
		regular:info || {
			"piece":{"bracelet":'',"helm":'',"amulet":'',"gloves":'',"body":'',"shield":'',"boots":'',"pants":'',"ring":'',"melee":'',"range":'',"magic":'',},
			"def":Cst.element.template(1),
			"dmg":Cst.element.template(1),
		},
		pvp:{
			"piece":{"bracelet":'',"helm":'',"amulet":'',"gloves":'',"body":'',"shield":'',"boots":'',"pants":'',"ring":'',"melee":'',"range":'',"magic":'',},
			"def":Cst.element.template(1),
			"dmg":Cst.element.template(1),
		},
	}
};

Actor.template.sprite = function(){
	return {"name":"mace","anim":"walk","sizeMod":1};
}

Actor.template.abilityChange = function(ab){	//ab : abilityList
	var tmp = {'press':'00000000000000','charge':{},'chargeClient':[0,0,0,0,0,0],'globalCooldown':0};
	
	for(var i in ab) tmp.charge[i] = 0;
	return tmp;
}

Actor.template.mastery = function(type){
	return {	
		'def':{'melee':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'range':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'magic':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'fire':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'cold':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'lightning':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1}},
		'dmg':{'melee':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'range':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'magic':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'fire':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'cold':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'lightning':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1}},
	};
};

Actor.template.abilityList = function(info){
	info = info || {};
	return {
		regular:info,
		pvp:{},
		quest:{},
		type:'regular'	
	};	//check Test for added ability
}

Actor.template.ability = function(info){
	info = info || [0,0,0,0,0,0];
	return {
		regular:info,
		pvp:[0,0,0,0,0,0],
		quest:[0,0,0,0,0,0],
		type:'regular'	
	}
}





