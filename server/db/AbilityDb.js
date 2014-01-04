/*
a['bulletMulti'] = {
    'type':'attack',                    //attack, buff, curse, summon
    'name':'Multishot',                  //visible name
    'icon':'attackMagic.fireball',      //icon
	'spd':{'main':0.8,'support':0.2},   //how atk spd impact ability spd
	'period':15,                         //atk/s (period = 40 => 1 atk/s)

	//Check Attack.js for more detail about the attribute of attack
	'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{type:"bullet",
			'angle':15,'amount':5, 'aim': 0,'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"thunder2",'sizeMod':0.5},
			'dmgMain':1,'dmgRatio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0},
			'leech':{'chance':1,'magn':1,'time':1}
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
			'angle':15,'amount':5, 'aim': 0,'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"thunder2",'sizeMod':0.5},
			'dmgMain':10,'dmgRatio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0},
			'leech':{'chance':1,'magn':1,'time':1}
	}}}};
	
	a['bullet360'] = {'type':'attack','name':'360 Shot','icon':'attackMagic.fire',
		'spd':{'main':0.8,'support':0.2},'period':200,'cost':{'mana':50},'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{type:"bullet",
			'angle':360,'amount':9, 'aim': 0,'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fire_explosion",'sizeMod':0.5},
			'dmgMain':0.01,'dmgRatio':{'melee':0,'range':0,'magic':50,'fire':45,'cold':0,'lightning':5},
	}}}};	
	
	a['bulletSingle'] = {'type':'attack','name':'Single','icon':'attackMagic.meteor',
		'spd':{'main':0.8,'support':0.2},'period':50,'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{type:"bullet",
			'angle':15,'amount':1, 'aim': 0,'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"ice2",'sizeMod':0.5},
			'dmgMain':1,'dmgRatio':{'melee':15,'range':5,'magic':5,'fire':2,'cold':27,'lightning':0},
			'leech':{'chance':1,'magn':1,'time':1}
	}}}};

	a['strikeSingle'] = {'type':'attack','name':'Slash','icon':'attackMelee.slash',
		'spd':{'main':0.8,'support':0.2},'period':15,'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{'type':"strike",
			'angle':0,'amount':1, 'aim':0, 'hitImg':{'name':"attack1",'sizeMod':0.5},
			'delay':2,'maxHit':1,'width':1,'height':1,'minRange':50,'maxRange':5,
			'dmgMain':1,'dmgRatio':{'melee':50,'range':0,'magic':0,'fire':50,'cold':0,'lightning':0},
			'hitIfMod':0,'heal':{'hp':100}
	}}}};
	
	a['dodgeRegular'] = {'type':'dodge','name':'Dodge','icon':'dodge.start',
		'spd':{'main':0.8,'support':0.2},'period':25,'cost':{"dodge":75},'action':{'func':'Mortal.boost','param':[[
			{"stat":"maxSpd","type":"+","value":100,"time":1,"name":"Dodge"},
			{"stat":"acc","type":"+","value":100,"time":1,"name":"Dodge"},
			{"stat":"friction","type":"*","value":0.7,"time":6,"name":"Dodge"},
			]]}
	};
	
	a['stumble'] = {'type':'curse','name':'Stumble','icon':'curse.stumble',
		'spd':{'main':0.8,'support':0.2},'period':25,'cost':{'mana':50},'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{'type':"strike",
			'angle':0,'amount':1, 'aim': 0,'objImg':{'name':"darkness1",'sizeMod':1},'hitImg':{'name':"darkness1",'sizeMod':0.5},
			'delay':2,'maxHit':10,'width':100,'height':100,'minRange':100,'maxRange':200,
			'dmgMain':1,'dmgRatio':{'melee':0,'range':0,'magic':1,'fire':0,'cold':0,'lightning':0},
			'curse':{'chance':1,'boost':[{'stat':'maxSpd','type':'*','value':0.1,'time':50}]},
	}}}};
	
	a['summonDragon'] = {'type':'summon','name':'Summon Dragon','icon':'summon.dragon',
		'spd':{'main':0.8,'support':0.2},'period':25,'cost':{'mana':50},'action':{'func':'Combat.action.summon','param':[
		{'name':'summonDragon','maxChild':5,'time':1000,'distance':500},{"category":"eSlime","variant":"Big","lvl":0,"modAmount":1,'amount':1}
		
	]}};
	
	
	/*
	

	a['strikeAoe'] = {'type':'attack','name':'Crush','icon':'attackMelee.pierce',
		'spd':{'main':0.8,'support':0.2},'period':25,'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{'type':"strike",
			'angle':0,'amount':1, 'aim': 0,'hitImg':{'name':"attack1",'sizeMod':0.5},
			'delay':2,'maxHit':5,'width':50,'height':25,'minRange':50,'maxRange':5,
			'dmgMain':1,'dmgRatio':{'melee':80,'range':0,'magic':0,'fire':10,'cold':0,'lightning':5},
	}}}};	
	
	a['explodeSelf'] = {'type':'attack','name':'Explode Self','icon':'attackMelee.scar',
		'spd':{'main':0.8,'support':0.2},'period':25,'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{'type':"strike",
			'angle':0,'amount':1, 'aim': 0,'objImg':{'name':"fire2",'sizeMod':1},'hitImg':{'name':"attack1",'sizeMod':0.5},
			'delay':2,'maxHit':10,'width':100,'height':100,'minRange':0,'maxRange':0,
			'dmgMain':1,'dmgRatio':{'melee':0,'range':0,'magic':25,'fire':75,'cold':0,'lightning':0},
			'hitIfMod':0,'healing':{'hp':100}
	}}}};
	
	
	a['mine'] = {'type':'attack','name':'Mine','icon':'attackMelee.trio',
		'spd':{'main':0.8,'support':0.2},'period':25,'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{'type':"strike",
			'angle':0,'amount':1, 'aim': 0,'objImg':{'name':"ice2",'sizeMod':0.5},'hitImg':{'name':"ice1",'sizeMod':0.5},
			'delay':25,'maxHit':10,'width':25,'height':25,'minRange':100,'maxRange':200,
			'dmgMain':1,'dmgRatio':{'melee':0,'range':0,'magic':5,'fire':0,'cold':90,'lightning':5},
	}}}};

	a['bulletFast'] = {'type':'attack','name':'Fast Arrows','icon':'attackRange.trio',
		'spd':{'main':0.8,'support':0.2},'period':10,'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{type:"bullet",
			'angle':0,'amount':1, 'aim': 0,'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"fire2",'sizeMod':0.5},
			'dmgMain':1,'dmgRatio':{'melee':0,'range':75,'magic':0,'fire':0,'cold':0,'lightning':25},
	}}}};

	
	
	
	
	

	
	
	
	
	a['dodgeBig'] = {'type':'dodge','name':'Evade','icon':'dodge.ninja',
		'spd':{'main':0.8,'support':0.2},'period':250,'cost':{"dodge":100},'action':{'func':'Mortal.boost','param':[[
			{"stat":"maxSpd","type":"+","value":1000,"time":1,"name":"Dodge"},
			{"stat":"acc","type":"+","value":1000,"time":1,"name":"Dodge"},
			{"stat":"friction","type":"*","value":0.7,"time":6,"name":"Dodge"},
			]]}
	};
	*/
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
	
	a['fireball'] = {'type':'attack','name':'Fireball','icon':'attackMagic.fireball','orbMod':'dmg',
		'spd':{'main':0.8,'support':0.2},'period':[15,20],'action':{'func':'Combat.action.attack','param':{'anim':'Attack',
		'attack':{type:"bullet",
			'angle':0,'amount':1, 'aim': 0,'objImg':{'name':"arrow",'sizeMod':1},'hitImg':{'name':"fire_explosion",'sizeMod':0.5},
			'dmgMain':[1,1.2],'dmgRatio':{'melee':0,'range':0,'magic':[25,50],'fire':[25,50],'cold':0,'lightning':0},
			'burn':{'chance':[1.5,2],'magn':[1,1.2],'time':1}
		}}},
	};
	
	
	//need to add arrayfy
	
	for(var i in a){
		if(Db.ability.orb[a[i].orbMod]){a[i].orb = {'upgrade':{'amount':0,'bonus':a[i].orbMod}};} 
		else { Db.ability.orb[a[i].id] = a[i].orbMod; a[i].orbMod = a[i].id; }
	}
	
}

Init.db.ability.mod = function(){	//needed by client
	Db.ability.mod = {
		'x2b':{
			'name':'x2 Bullets',
			'info':'Your ability shoots x2 more bullets. Main damage is reduced by 50%.',
			'func':(function(ab,orb,log){
				try {
					var atk = ab.action[0].param.attack[0];
					atk.amount *= 2;
					atk.dmgMain /= 1.5;
					return ab;
				} catch(err){ return ab; }
			})},	
		
	}
	
	
	for(var i in Db.ability.mod){
		var item = {};
		item.name = Db.ability.mod[i].name;
		item.visual = 'plan.planA';
		item.option = [	{'name':'Select Mod','func':'Main.abilityModClick','param':[i]} ];
		item.type = 'mod';
		item.id = 'mod-'+i;
		Item.creation(item);
	
	}
	
	
}

Init.db.ability.orb = function(){
	Db.ability.orb = {
		'dmg':(function(ab,lvl){
			return ab;
		}),
		'none':(function(ab,lvl){
			return ab;
		}),
	}
}


Ability = {};
Ability.creation = function(a){
	
	//Setting Ability
	db.ability.update( {'id':a.id}, a, { upsert: true }, function(err) { if(err) throw err });	
	
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
	a.action = arrayfy(a.action);
	for(var j in a.action){ 
		if(a.action[j].param.attack){ a.action[j].param.attack = arrayfy(a.action[j].param.attack); }
		a.action[j].param.anim = a.action[j].param.anim || 'Attack';
		for(var k in a.action[j].param.attack){
			if(a.action[j].param.attack[k]){
				a.action[j].param.attack[k].dmg = Craft.setDmgViaRatio(a.action[j].param.attack[k]);
			}
		}
	}	
	
	//Setting Item Part
	var id = a.id;
	var item = {};
	item.name = a.name;
	item.visual = 'plan.planA';
	item.option = [	{'name':'Examine Ability','func':'Mortal.examineAbility','param':[a.id]},
					{'name':'Learn Ability','func':'Mortal.learnAbility','param':[a.id]},
	];
	item.type = 'ability';
	item.id = id;
	Item.creation(item);
	
	return a.id;
}

Ability.uncompress = function(abi){	
	var ab = typeof abi === 'object' ? abi : deepClone(Db.ability[abi]);
	
	for(var i in ab.modList){
		ab = abilityModDb[i].func(ab,ab.modList[i],Craft.orb.formula(ab.modList[i]));
	}
	ab = Db.ability.orb[ab.orb.upgrade.bonus](ab,ab.orb.upgrade.amount);
	
	if(ab.action && ab.action[0].func === 'Combat.action.attack'){
		var at = ab.action[0].param.attack[0];
		at = useTemplate(Attack.template(),at);
		ab.action[0].param.attack[0] = new Function('return ' + stringify(at));
	}
	return ab;
}

Ability.template = function(){
	return {'name':'Fire','tag':[],'icon':'melee.mace',
		'cost':{"dodge":0},'reset':{'attack':0,'tag':{}},
		'spd':{'main':0.8,'support':0.2},'period':25,
			'action':[
				{'func':'Combat.action.attack','param':{
					'attack':[
						{type:"bullet",'angle':5,'amount':1, 'aim': 0,'objImg':{'name':"fireball",'sizeMod':1},'hitImg':{'name':"fire2",'sizeMod':0.5},
						'dmgMain':1000,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':0.10,'lightning':0.5},
						'dmg':{'melee':1000,'range':1000,'magic':1000,'fire':1000,'cold':1000,'lightning':1000},
						'mods':	{}
						}],
					'anim':'Attack',
				}}
			]
	};
}

Ability.template.attack = function(){
	return {
	'type':"s",'angle':0,'amount':1,'aim': 0,'objImg':0,'hitImg':{'name':'attack3','sizeMod':0.5},
	'delay':0,'maxHit':1,'w':1,'h':1,'maxRange':0,'minRange':0,
	'dmgMain':0,'dmgRatio':{'melee':0,'range':0,'magic':0,'fire':0,'cold':0,'lightning':0},
	'dmg':{'melee':1000,'range':1000,'magic':1000,'fire':1000,'cold':1000,'lightning':1000},
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
'nova':{'period':1,'rotation':10,'attack':{'type':"Bullet",'objImg':"fireball_mini",'angle':360,'amount':8,'aim':0,'dmgMain':1000,'dmgRatio':[100,100,100,100,100,100],'mods':{ 'spd':30}}}, 'spd':8,				
'sin':{"amp":5,"freq":2}


'function':{'func':'test','param':[],'chance':0}
if(attack[0].mods[i].chance <= 0.33){ attack[0].mods[i].chance *= 2;} 	else {attack[0].mods[i].chance = 1-(1-attack[0].mods[i].chance)/2}
*/

	
