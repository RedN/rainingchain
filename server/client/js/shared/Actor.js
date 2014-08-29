//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','Tk','Init','Sprite'],['Actor']));
//Mort
Init.actorTemplate = function(){
	var defaultPreActor = function(type){
		var act = {};
		
		//dont touch
		act.flag = {};
		act.change = {};
		act.old = {};
		act.permBoost = {};    //no timer
		act.boost = {          //timer aka needs to be updated every frame
			'fast':{},'reg':{},'slow':{},'custom':{},
			'toUpdate':{},
			'list':Actor.template.boost(type),
		};
		act.frame = 0;
		act.viewedIf = 'true'; //condition to see. check viewedIfList
		act.activeList = {};   //actors near this object
		act.active = 1;    	//if not active, dont move. no cpu
		act.alwaysActive = 0;
		act.damagedBy = {};   //list of actors that damaged him (used for owner of the drops)
		act.dead = 0;          //dead = invisible
		act.type = type;
		act.combatType = type;
		act.target = {
			main:null,sub:{x:0,y:0},	
			period:{main:90,sub:25,stuck:113},
			cutscene:{active:0,path:[],time:0,func:null},
			stuck:[],
			reachedGoal:0,isStuck:0,maxAngleChange:360,
		}
		act.mapMod = {};
		act.awareNpc = 0;
		act.statCustom = Actor.template.statCustom();
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
		
		act.abilityChange = Actor.template.abilityChange();	
		act.abilityAi = {close:{},middle:{},far:{},range:[60,300]};
		act.abilityList = Actor.template.abilityList();		
		act.ability = Actor.template.ability();
		act.combatContext = {ability:'normal',equip:'normal'};		//or pvp
		act.friction = CST.FRICTIONNPC;
		act.bounce = 1;			//mod
		act.timeout = {};
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
		act.x = 1550;	
		act.y = 550;	
		act.lastX = 0;
		act.lastY = 0;
		act.map = 'QfirstTown-main@MAIN';
		//}
		
		//{Setting Used for Db.enemy
		act.model = "bat";   //for enemy
		act.lvl = 0;
		act.name = "Goblin";     //visible name
		act.username = "player000";     //id name
		act.minimapIcon = 'color.red';     //icon used for minimap
		act.quest = '';
		act.sprite = Actor.template.sprite();		
		act.equip = Actor.template.equip();
		act.weapon = Actor.template.weapon();
		act.moveRange = {
			'ideal':100,                //distance enemy wants to be from target
			'confort':25,               
			'aggressive':400,           //attack player if within this range
			'farthest':500,             //stop follow player if above this range
		};
		act.moveSelf = 1; 		//generate its own input	(ex: block dont but still move)
		
		act.reflect = CST.element.template(0); //% reflected
		act.nevercombat = 0;
		act.boss = '';
		act.resource = {
			'hp':{'max':1000,'regen':1},
			'mana':{'max':100,'regen':10/25},
		};
		act.globalDef = 1;
		act.globalDmg = 1;   //global modifier
		act.aim = 0;       //difference between mouse and actually bullet direction
		act.atkSpd = 1;	
		act.ghost = 0;
		act.nevermove = 0;
		act.noAbility = 0;
		act.maxSpd = 12;	
		act.acc = 8;
		act.immune = {};
		act.weakness = {resist:'',weak:''};
		//}
		
		//{Setting for Map.load extra
		act.dialogue = null;      //function used to trigger dialogue
		act.chatHead = "";     //is talking?
		act.deathAbility = [];
		act.deathEvent = null;	//function param = id of each killer
		act.deathEventOnce = null;	//function param = array id of killers
		act.combat = 1;
		act.damageIf = 'player';
		act.damagedIf = 'true';
		act.targetIf = 'player';  //condition used by monsters to find their target. check targetIfList
		act.onclick = {};
		act.waypoint = null; 		//right click = setRespawn
		act.loot = null;		//right click = gives items;
		act.block = null;			//change map coliision
		act.teleport = null;
		act.tag = '';				//to get enemy in q.event
		act.hideOptionList = false;
		act.lastInteraction = Date.now();
		act.lastAbilitySkill = '';
		//}	
		

		//{Player Only
		if(type === 'player'){
			act.skill = Actor.template.skill();
			act.removeList = {};	//for things that got removed from activeList
			act.type = 'player';
			act.damageIf = 'npc';
			act.privateChange = {};
			act.privateOld = {};
			act.context = 'player0000';
			act.name = 'player0000';
			act.awareNpc = 1;
			act.alwaysActive = 1;
			act.minimapIcon = 'color.yellow';
			act.party = act.name;
			act.item = {"quantity":0,"quality":0,"rarity":0};  //aka magic find
			act.pickRadius = 250;  //distance to pick items on ground
			act.friction = CST.FRICTION;
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

var Actor = exports.Actor = {};
Actor.update = {};
Actor.template = function(){};

Actor.template.skill = function(){
	var value = CST.exp[0];
	return {
		'exp':{'melee':value,'range':value,'magic':value,'metalwork':value,'woodwork':value,'leatherwork':value,'mining':value,'woodcutting':value,'trapping':value},
		'lvl':{'melee':0,'range':0,'magic':0,'metalwork':0,'woodwork':0,'leatherwork':0,'mining':0,'woodcutting':0,'trapping':0},
	}; 
};

Actor.template.weapon = function(){
	return 'Qsystem-unarmed';
};

Actor.template.equip = function(info){
	return {
		normal:info || Actor.template.equip.part(),
		pvp:Actor.template.equip.part(),
		quest:Actor.template.equip.part(),
	}
};
Actor.template.equip.part = function(){
	return {
		"piece":{helm:'',amulet:'',ring:'',body:'',weapon:''},
		"def":CST.element.template(1),
		"dmg":CST.element.template(1),
	}
}

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
	return {
		normal:info || {},
		pvp:{},
		quest:{},
	};	//check Test for added ability
}

Actor.template.ability = function(info){
	return {
		normal:info || [0,0,0,0,0,0],
		pvp:[0,0,0,0,0,0],
		quest:[0,0,0,0,0,0],
	}
}





