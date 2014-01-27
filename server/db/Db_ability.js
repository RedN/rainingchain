/*
a['bulletMulti'] = {
    'type':'attack',                    //attack, buff, curse, summon
    'name':'Multishot',                 //visible name
    'icon':'attackMagic.fireball',      //icon
	'spd':{'main':0.8,'support':0.2},   //how atk spd impact ability spd
	'period':15,                        //atk/s (period = 40 => 1 atk/s)

	//Check Attack.js for more detail about the attribute of attack
	'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{type:"bullet",
			'angle':15,'amount':5, 'aim': 0,'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"thunder2",'sizeMod':0.5},
	}}}};
*/	

Init.db.ability = function(cb){
	Db.ability = {}; var abilityPreDb = {}; var a = abilityPreDb;
	
	db.ability.find({},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results){
			a[results[i].id] = results[i];
		}
	
	a['bulletMulti'] = {'type':'attack','name':'Multishot','icon':'attackMagic.fireball',
		'spd':{'main':0.8,'support':0.2},'period':15,'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{type:"bullet",
			'angle':15,'amount':1, 'aim': 0,'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"thunder2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			'leech':{'chance':1,'magn':1,'time':1}
	}}}};
	
	a['bullet360'] = {'type':'attack','name':'360 Shot','icon':'attackMagic.fire',
		'spd':{'main':0.8,'support':0.2},'period':200,'cost':{'mana':50},'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{type:"bullet",
			'angle':360,'amount':9, 'aim': 0,'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fire_explosion",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
	}}}};	
	
	a['bulletSingle'] = {'type':'attack','name':'Single','icon':'attackMagic.meteor',
		'spd':{'main':0.8,'support':0.2},'period':50,'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{'type':"bullet",
			'angle':15,'amount':1, 'aim': 0,'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"ice2",'sizeMod':0.5},
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
	}}}};

	a['strikeSingle'] = {'type':'attack','name':'Slash','icon':'attackMelee.slash',
		'spd':{'main':0.8,'support':0.2},'period':15,'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{'type':"strike",
			'angle':0,'amount':1, 'aim':0, 'hitImg':{'name':"attack1",'sizeMod':0.5},'objImg':{'name':"attack1",'sizeMod':0.5},
			'delay':2,'maxHit':1,'width':1,'height':1,'minRange':5,'maxRange':50,
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			'hitIfMod':0,'heal':{'hp':100}
	}}}};
	/*
	a['dodgeRegular'] = {'type':'dodge','name':'Dodge','icon':'dodge.start',
		'spd':{'main':0.8,'support':0.2},'period':25,'cost':{"dodge":75},'action':{'func':'Actor.boost','param':[[
			{"stat":"maxSpd","type":"+","value":100,"time":1,"name":"Dodge"},
			{"stat":"acc","type":"+","value":100,"time":1,"name":"Dodge"},
			{"stat":"friction","type":"*","value":0.7,"time":6,"name":"Dodge"},
			]]}
	};
	*/
	a['dodgeRegular'] = {'type':'dodge','name':'Dodge','icon':'dodge.start',
		'spd':{'main':0.8,'support':0.2},'period':25,'cost':{"dodge":75},'action':{'func':'Actor.boost','param':[[
			{"stat":"globalDef","type":"+","value":Cst.bigInt,"time":4,"name":"Dodge"},
			]]}
	};
	
	a['stumble'] = {'type':'curse','name':'Stumble','icon':'curse.stumble',
		'spd':{'main':0.8,'support':0.2},'period':25,'cost':{'mana':50},'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{'type':"strike",
			'angle':0,'amount':1, 'aim': 0,'objImg':{'name':"darkness1",'sizeMod':1},'hitImg':{'name':"darkness1",'sizeMod':0.5},
			'delay':2,'maxHit':10,'width':100,'height':100,'minRange':100,'maxRange':200,
			'dmg':{'main':100,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
			'curse':{'chance':1,'boost':[{'stat':'maxSpd','type':'*','value':0.1,'time':50}]},
	}}}};
	
	a['summonDragon'] = {'type':'summon','name':'Summon Dragon','icon':'summon.dragon',
		'spd':{'main':0.8,'support':0.2},'period':25,'cost':{'mana':50},'action':{'func':'Combat.action.summon','param':[
		{'name':'summonDragon','maxChild':5,'time':1000,'distance':500},{"category":"eSlime","variant":"Big","lvl":0,"modAmount":1,'amount':1}
		
	]}};
	
	
	for(var i in a){
		a[i].id = i;
		Ability.creation(a[i]);
	}	
	cb();});
	
	if(server){
		Init.db.ability.orb();
		Init.db.ability.mod();
		Init.db.ability.template();	
	}
}

Init.db.ability.template = function(){
	Db.ability.template = {}; var a = Db.ability.template;
	
	a['fireball'] = {'type':'attack','name':'Fireball','icon':'attackMagic.fireball','orb':'dmg',
		'spd':{'main':0.8,'support':0.2},'period':[15,20],'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{type:"bullet",
			'angle':0,'amount':1, 'aim': 0,'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"fire_explosion",'sizeMod':0.5},
			'dmg':{'main':[1,1.2],'ratio':{'melee':0,'range':[25,50],'magic':[25,50],'fire':[25,50],'cold':0,'lightning':0}},
			'burn':{'chance':[1.5,2],'magn':[1,1.2],'time':1}
		}}},
	};
		
	for(var i in a){
		if(Db.ability.orb[a[i].orb]){	a[i].orb = {'upgrade':{'amount':0,'bonus':a[i].orb}};	} 
		else { 	Db.ability.orb[a[i].id] = a[i].orb; a[i].orb = a[i].id; }	//custom orbMod (need to be func)
	}
	
}

Init.db.ability.mod = function(){	//needed by client
	Db.ability.mod = {
		'x2b':{
			'name':'x2 Bullets',
			'info':'Your ability shoots x2 more bullets. Main damage is reduced by 50%.',
			'func':(function(ab,orb,log){
				var atk = ab.action.param.attack;
				atk.amount *= 2;
				atk.dmg.main /= 1.5;
				return ab;
			})},	
	}
	
	
	for(var i in Db.ability.mod){
		Item.creation({
			name:Db.ability.mod[i].name,
			visual:'plan.planA',
			option:[	{'name':'Select Mod','func':'Main.abilityModClick','param':[i]} ],
			type:'mod',
			id:'mod-'+i,
		});
	}
	
	
}

Init.db.ability.orb = function(){
	//defined here or directly inside Db.ability.template if unique
	Db.ability.orb = {
		'dmg':(function(ab,orb,log){
			var atk = ab.action.param.attack;
			atk.amount *= log;	//bad
			return ab;
		}),
		'none':(function(ab,orb){
			return ab;
		}),
	}
}


Ability = {};
Ability.creation = function(a){
	
	//Setting Ability
	db.ability.update( {'id':a.id}, a, { upsert: true }, db.err);	
	
	Db.ability[a.id] = a;	
	a.spd.main = a.spd.main / (a.spd.main + a.spd.support);
	a.spd.support = 1- a.spd.main;
	a.cost = a.cost || {};
	a.reset = a.reset || {'attack':0};
	a.tag = a.tag || {};
	a.targetIf = a.targetIf || 0;
	a.charge = 0;
	a.press = 0;
	a.period = a.period  || 25;
	a.modList = a.modList || {};
	a.orb = {'upgrade':{'amount':0,'bonus':'none'}};
	a.action = a.action || [];
	
	if(a.action && a.action.func === 'Combat.action.attack'){
		var at = a.action.param.attack;
		at.dmg = Craft.ratio.normalize(at.dmg);
	}
	
	//Setting Item Part
	Item.creation({
		name:a.name,
		visual:'plan.planA',
		option:[	{'name':'Examine Ability','func':'Actor.examineAbility','param':[a.id]},
					{'name':'Learn Ability','func':'Actor.learnAbility','param':[a.id]},
		],
		type:'ability',
		id:a.id,
	});
	
	return a.id;
}

Ability.uncompress = function(abi){	
	var ab = typeof abi === 'object' ? abi : deepClone(Db.ability[abi]);
	
	ab = Ability.uncompress.mod(ab);
	
	if(ab.action && ab.action.func === 'Combat.action.attack'){
		var at = ab.action.param.attack;
		at = useTemplate(Attack.template(),at);
		ab.action.param.attack = new Function('return ' + stringify(at));
	}
	return ab;
}

Ability.uncompress.mod = function(ab){	
	for(var i in ab.modList){
		ab = abilityModDb[i].func(ab,ab.modList[i],Craft.orb.formula(ab.modList[i]));
	}
	ab = Db.ability.orb[ab.orb.upgrade.bonus](ab,ab.orb.upgrade.amount);
	return ab;
}

Ability.template = function(){
	return {'name':'Fire','tag':[],'icon':'melee.mace',
		'cost':{"dodge":0},'reset':{'attack':0,'tag':{}},
		'spd':{'main':0.8,'support':0.2},'period':25,
			'action':
				{'func':'Combat.action.attack','param':{
					'attack':
						{type:"bullet",'angle':5,'amount':1, 'aim': 0,'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fire2",'sizeMod':0.5},
						'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
						},
					'anim':'Attack',
				}}
			
	};
}

Ability.template.attack = function(){
	return {
	'type':"strike",'angle':0,'amount':1,'aim': 0,'objImg':0,'hitImg':{'name':'attack3','sizeMod':0.5},
	'delay':0,'maxHit':1,'w':1,'h':1,'maxRange':0,'minRange':0,
	'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
	'mods':{},
	};
}


	

/*
Ability

###offensive###

atk normal
atk large with aoe
explode self
mine

1 arrow very fast
3 arrows slower
360
explode arrow


###blessing###
boost-self
boost-other 

aura
aura-group

###healing###

heal
heal-other
heal-group

hp to mana
mana to hp

cure status

###summon###

summon-temp
summon-perm
summon explode
totem

###warp###

invisibility
light 

teleport
teleport-enemy

telekenesis
telekenesis area

detect life

###curse###

disable atk
boost-enemy

###dodge###

1 big use all
dodge + freeze nearby
while dodging, boost def

*/
//need premade ability AND premade ability builder
/*
'pierce':{"amount":2,"dmgReduc":1},
"parabole":{'height':10,'min':100,'max':500,'maxTimer':50},
'boomerang':{'comeBackTime':50,'spd':2,'spdBack':1.5,'newId':1},
'nova':{'period':1,'rotation':10,'attack':{'type':"Bullet",'objImg':"fireball_mini",'angle':360,'amount':8,'aim':0,'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},'mods':{ 'spd':30}}}, 'spd':8,				
'sin':{"amp":5,"freq":2}


'function':{'func':'test','param':[],'chance':0}
if(attack[0].mods[i].chance <= 0.33){ attack[0].mods[i].chance *= 2;} 	else {attack[0].mods[i].chance = 1-(1-attack[0].mods[i].chance)/2}
*/

	
