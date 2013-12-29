//Mort

defaultPreMortal = function(type){
	var mort = {};
	mort.change = {};
	mort.old = {};
	
	//Boost
	mort.permBoost = {};    //no timer
	mort.boost = {          //timer aka needs to be updated every frame
	'fast':{},
	'reg':{},
	'slow':{},
	'toUpdate':{},
	'custom':{},
	'list':defaultBoost(type),
	};
	
	//General
	mort.name="Goblin";     //visible name
	mort.viewedBy = {};     //list of actors that see this object
	mort.viewedIf = 'true'; //condition to see. check viewedIfList
	mort.activeList = {};   //actors near this object
	mort.id = Math.randomId();
	mort.publicId = Math.random().toString(36).substring(13);   //id shared with all players
	mort.type = "enemy";
	mort.active = 1;    
	mort.dialogue = 0;      //has dialogue?
	mort.chatHead = "";     //is talking?
	mort.optionList = '';   //list of option when right-clicked
	mort.damagedBy = {};   //list of actors that damaged him (used for owner of the drops)
	mort.drop = {"mod":{"quantity":0,"quality":0,"rarity":0},"category":[]};    
	mort.item = {"quantity":0,"quality":0,"rarity":0};  //aka magic find
	mort.minimapIcon = 'minimapIcon.enemy';     //icon used for minimap
	
	mort.dead = 0;          //dead = invisible
	mort.killed = 0;        //killed = cant move, 0 hp but visible (aka death animation)
	mort.pickRadius = 100;  //distance to pick items on ground
	mort.sprite = {
		"name":"pMace",
		"anim":"Walk" ,
		"sizeMod":1
		}			
	
	mort.targetIf = mort.type;  //condition used by monsters to find their target. check targetIfList
	mort.targetMod = {"period":150,"rangeMod":100};
	mort.target = null;
	
	mort.category = "eSlime";   //for enemy
	mort.variant = "Regular";   //for enemy
	mort.lvl = 0;
	mort.modList = [];  
	mort.group = '';            //enemy group
	
	//Combat
	mort.combat = 1;
	mort.nevercombat = 0;
	mort.attackReceived = {};	//so pierce doesnt hit multiple times
	mort.hitIf = mort.type;
	mort.boss = 0;
	mort.deleteOnceDead = 0;
	
	
	
	//Bonus applies on top of weapon attack. If effect not on weapon, do nothing.
	mort.bonus = defaultBonus();
	mort.mastery = defaultMastery();
	

	
	//Def = DefMain * defArmor * mort.mastery.def
	mort.def =  {"melee":1,"range":1,"magic":1,"fire":1,"cold":1,"lightning":1} ;
	mort.defMain = 1;
	mort.armor={
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
		},
	"def":{"melee":1,"range":1,"magic":1,"fire":1,"cold":1,"lightning":1},
	"resist":{"burn":0,"chill":0,"confuse":0,"knock":0}		};	
	
	if(server && type == 'player'){
		for(var i in mort.armor.piece){	mort.armor.piece[i] = armorDb[mort.armor.piece[i].id];}
		updateArmor(mort);
	}
	
	mort.reflect = {"melee":0,"range":0,"magic":0,"fire":0,"cold":0,"lightning":0}; //% reflected
	
	//Resource
	mort.hp = 1000;	
	mort.mana = 100;	
	mort.dodge = 100;	
	mort.fury = 100;	
	
	mort.resource = {
		'hp':{'max':1000,'regen':1},
		'mana':{'max':100,'regen':0.1},
		'dodge':{'max':100,'regen':0.1},
		'fury':{'max':100,'regen':0.1},
	};
	
	
	
	
	//Resist
	mort.knocked = {"time":0,"magn":0,"angle":0};
	mort.burned = {"time":0,"magn":0};
	mort.chilled = {"time":0,"magn":0,"atk":0};
	mort.confused = {"time":0,"magn":0,"input":[0,1,2,3]};	
	mort.bleeded = [];
	
	
	mort.resist = {"burn":0,"chill":0,"confuse":0,"knock":0,"bleed":0,'drain':0};
	mort.resistMax = {"burn":75,"chill":75,"confuse":75,"knock":25,"bleed":25,"drain":25};
	
	//Atk
	mort.dmgMain = 1;   //global modifier
	mort.dmg =  {"melee":10,"range":10,"magic":10,"fire":10,"cold":10,"lightning":10} ;
	
	mort.aim = 0;       //difference between mouse and actually bullet direction
	mort.atkSpd = {'main':1,'support':1};	
	mort.weapon={"id":"mace"};	
	mort.weaponList = {"melee":{'id':"mace"},"range":{'id':"boomerang"},"magic":{'id':"wand"}};
	
	
	if(server && type == 'player'){
		mort.weapon = weaponDb[mort.weapon.id];
		for(var i in mort.weaponList){ 	mort.weaponList[i] = weaponDb[mort.weaponList[i].id];}
	}
	
	//Ability
	mort.ability = [];
	mort.abilityList = {};
	if(server){ mort.ability = defaultMortAbility(type); }
	mort.abilityChange = {'press':'00000000000000','charge':{}};
	for(var i in mort.ability){ mort.abilityChange.charge[mort.ability[i].id] = 0;}
	
	//Spec
	mort.invisible = 0;
	mort.ghost = 0;
	
	mort.summon = {};       //if actor is master
	mort.summoned = 0;      //if actor is child. .summoned = master id
	
	//Position
	mort.move = 1;
	mort.nevermove = 0;
	mort.friction = 0.9;	
	mort.maxSpd=15;	
	mort.acc=3;
	mort.x=1050;	
	mort.y=550;	
	mort.map = 'test';	
	
	if(server){
		mort.mapMod = deepClone(defaultMapMod); //mapmod: each map has a collision grid. it has as player-bound collision. ex: completing a quest opens a path
		
		mort.mapMod["test"]["42-47"] = 1;
		mort.mapMod["test"]["43-47"] = 1;
		mort.mapMod["test"]["44-47"] = 1;
		mort.mapMod["test"]["45-47"] = 1;
		mort.mapMod["test"]["46-47"] = 1;
	}
	
	mort.angle = 1;	
	mort.moveAngle = 1;
	mort.spdX = 0;	
	mort.spdY = 0;	
	mort.mouseX = 0;	
	mort.mouseY = 0;
	mort.moveInput = [0,0,0,0];	    //right,down,left,up
	mort.bumper = [0,0,0,0];        //1 if touchs map
	mort.changeDir = 40;	        //frequent that enemy change direction
	
	mort.moveRange = {
		'ideal':100,                //distance enemy wants to be from target
		'confort':25,               
		'aggressive':400,           //attack player if within this range
		'farthest':400,             //stop follow player if above this range
	}
	
	if(type == 'player'){
	    mort.skill = {
    	    'exp':{'melee':100000,'range':100000,'magic':100000,'metalwork':100000,'woodwork':100000,'leatherwork':100000,'geology':100000,'metallurgy':100000,'trapping':100000},
    	    'lvl':{'melee':0,'range':0,'magic':0,'metalwork':0,'woodwork':0,'leatherwork':0,'geology':0,'metallurgy':0,'trapping':0},
    	} 
    	//if(server) mort.skill = new Skill();
	}
	
	for(var i in mort.boost.list){  //init default statTo value
		changeViaArray({'origin':mort,'array':mort.boost.list[i].stat,'value':mort.boost.list[i].base});
	}
	
	
	
	return mort;
}

initDefaultMortal = function(){
	initDefaultBoost();
	
	var p = defaultPreMortal('player');
	var e = defaultPreMortal('enemy');

	eval('defaultMortal = function(type){ if(type === "player"){' + 'return ' + stringify(p) + '; } return ' + stringify(e) + '}');
	
	/*
	defaultMortal.enemy = {};
	defaultMortal.player = {};
	
	
	var funcE = []; for(var k in e){if(typeof e[k] === 'function') funcE.push(k);}
	for(var k in funcE){defaultMortal.enemy[funcE[k]] = e[funcE[k]];}	
	
	var funcP = []; for(var k in p){if(typeof p[k] === 'function') funcP.push(k);}
	for(var k in funcP){defaultMortal.player[funcP[k]] = p[funcP[k]];}
	*/
}


initDefaultBoost = function(){
	defaultMortBoost = {};
	defaultEnemyBoost = {};
	
	for(var i in statTo){
		defaultMortBoost[i] = statTo[i].boost;
		if(!statTo[i].playerOnly){
			defaultEnemyBoost[i] = statTo[i].boost;
		}
	}
	
	defaultBoost = function(type){
		if(type == 'player'){ return deepClone(defaultMortBoost); }
		if(type == 'enemy'){ return deepClone(defaultEnemyBoost); }
	}
}			
				
defaultMastery = function(){
	return {	
		'def':{'melee':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'range':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'magic':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'fire':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'cold':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'lightning':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1}},
		'dmg':{'melee':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'range':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'magic':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'fire':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'cold':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1},'lightning':{'+':0,'*':0,'x':0,'^':0,'sum':1,'mod':1}},
	};
}

initDefaultBonus = function(){
	var info = {};
	
	for(var i in statTo){
		if(statTo[i].boost.stat[0] === 'bonus'){
			var a = statTo[i].boost.stat;
			var value = statTo[i].boost.base;
			
			if(a.length === 3){
				info[a[1]] = info[a[1]] || {};
				info[a[1]][a[2]] = value;
			}
			if(a.length === 4){
				info[a[1]] = info[a[1]] || {};
				info[a[1]][a[2]] = info[a[1]][a[2]] || {};
				info[a[1]][a[2]][a[3]]= value;
			}
		}
	}
	
	defaultBonus = function(){ return info; }
}

defaultMortAbility = function(type){
	if(type == 'player'){
		var a = [
		//abilityDb['strikeSingle'], //bad need to be function
		//abilityDb['bulletMulti'], //bad need to be function
		];
		return deepClone(a);
	}
	return [];
	
}








