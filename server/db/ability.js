//to be improved



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
	
	
Ability = {};
	
//default ability are inside logIn.js defaultPlayer

initAbilityDb = function(cb){
	abilityDb = {}; abilityPreDb = {}; var a = abilityPreDb;
	//note: defaultplayer depends on at least 1 ability
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
		initAbility(a[i]);
	}	
	cb();});		
	
}

initAbility = function(a){
	
	//Setting Ability
	db.ability.update( {'id':a.id}, a, { upsert: true }, function(err) { if(err) throw err });	
	
	abilityDb[a.id] = a;	
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
				a.action[j].param.attack[k].dmg = setDmgViaRatio(a.action[j].param.attack[k]);
			}
		}
	}	
	
	//Setting Item Part
	var id = a.id;
	var item = {};
	item.name = a.name;
	item.visual = 'plan.planA';
	item.option = [	{'name':'Examine Ability','func':'Ability.examine','param':[a.id]},
					{'name':'Learn Ability','func':'Mortal.learnAbility','param':[a.id]},
	];
	item.type = 'ability';
	item.id = id;
	initItem(item);
	
	return a.id;
}

Ability.examine = function(){}

initAbiConsDb = function(){
	abiConsDb = {}; var a = abiConsDb;
	
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
		if(abilityOrbModDb[a[i].orbMod]){a[i].orb = {'upgrade':{'amount':0,'bonus':a[i].orbMod}};} 
		else { abilityOrbModDb[a[i].id] = a[i].orbMod; a[i].orbMod = a[i].id; }
	}
	
}

abilityOrbModDb = {
	'dmg':(function(ab,lvl){
		return ab;
	}),
	'none':(function(ab,lvl){
		return ab;
	}),

}


/*
ts("useAbiCons({'quality':1,'name':'fireball','lvl':10})")

ts('Mortal.learnAbility(key,"t90ctbj4i")')

ts("addAbilityMod(key,'bulletMulti','x2b')")
*/

useAbiCons = function(seed){
	var qua = seed.quality || 1;
	var an = seed.name || 'fireball';
	//assume that action atk arent arrays

	var ab = deepClone(abiConsDb[an]);
	
	if(typeof ab.period === 'object'){ ab.period = Craft.boost.generate.roll(ab.period,qua); }
	
	if(ab.action && ab.action.func === 'Combat.action.attack'){
		var atk = ab.action.param.attack;
		
		//All
		if(typeof atk.angle === 'object'){ atk.angle = Craft.boost.generate.roll(atk.angle,qua); }
		if(typeof atk.amount === 'object'){ atk.amount = Craft.boost.generate.roll(atk.amount,qua); }
		if(typeof atk.dmgMain === 'object'){ atk.dmgMain = Craft.boost.generate.roll(atk.dmgMain,qua); }
		for(var i in atk.dmgRatio){
			if(typeof atk.dmgRatio[i] === 'object'){ atk.dmgRatio[i] = Craft.boost.generate.roll(atk.dmgRatio[i],qua); }
		}
		
		//Status
		for(var st in Cst.status.list){
			var i = Cst.status.list[st];
			if(typeof atk[i] === 'object'){ 
				if(typeof atk[i].chance === 'object'){ atk[i].chance = Craft.boost.generate.roll(atk[i].chance,qua); }
				if(typeof atk[i].magn === 'object'){ atk[i].magn = Craft.boost.generate.roll(atk[i].magn,qua); }
				if(typeof atk[i].time === 'object'){ atk[i].time = Craft.boost.generate.roll(atk[i].time,qua); }
			}
		}
		if(atk.leech){
			if(typeof atk.leech.chance === 'object'){ atk.leech.chance = Craft.boost.generate.roll(atk.leech.chance,qua); }
			if(typeof atk.leech.magn === 'object'){ atk.leech.magn = Craft.boost.generate.roll(atk.leech.magn,qua); }
			if(typeof atk.leech.time === 'object'){ atk.leech.time = Craft.boost.generate.roll(atk.leech.time,qua); }
		}
		if(atk.pierce){
			if(typeof atk.pierce.chance === 'object'){ atk.pierce.chance = Craft.boost.generate.roll(atk.pierce.chance,qua); }
			if(typeof atk.pierce.dmgReduc === 'object'){ atk.pierce.dmgReduc = Craft.boost.generate.roll(atk.pierce.dmgReduc,qua); }
		}
		
		//need to add curse etc...
		
	}
	ab.id = Math.randomId();
	
	return ab;
}

createNewAbility = function(seed){
	//seed only needs ab id and qual

	var a = useAbiCons(seed);
	
	initAbility(a);
	
	return a.id;	

}


initAbilityModDb = function(){
	abilityModDb = {
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
	if(!server){ return;}
	
	
	for(var i in abilityModDb){
		var item = {};
		item.name = abilityModDb[i].name;
		item.visual = 'plan.planA';
		item.option = [	{'name':'Select Mod','func':'abilityModClick','param':[i]} ];
		item.type = 'mod';
		item.id = 'mod-'+i;
		initItem(item);
	
	}
	
	
}
//abid: Ability Id, mod: mod Id
addAbilityMod = function(key,abid,mod){
		//Verify
		var ab = deepClone(abilityDb[abid]);
		if(ab.modList[mod] !== undefined){ Chat.add(key,'This ability already has this mod.'); return; }
		if(Object.keys(ab.modList).length > 5){ Chat.add(key,'This ability already has the maximal amount of mods.'); return; }
		
		//Add
		ab.modList[mod] = 0;
		Mortal.removeAbility(key,abid);
		ab.id = Math.randomId();
		initAbility(ab);
		Mortal.learnAbility(key,ab.id);
		Chat.add(key,'Mod Added.');
		mainList[key].invList.remove('mod-'+ mod);	
}

//##############################################################

Ability.uncompress = function(abi){	
	var ab = typeof abi === 'object' ? abi : deepClone(abilityDb[abi]);
	
	for(var i in ab.modList){
		ab = abilityModDb[i].func(ab,ab.modList[i],orbFormula(ab.modList[i]));
	}
	ab = abilityOrbModDb[ab.orb.upgrade.bonus](ab,ab.orb.upgrade.amount);
	
	if(ab.action && ab.action[0].func === 'Combat.action.attack'){
		var at = ab.action[0].param.attack[0];
		at = useTemplate(Attack.template(),at);
		ab.action[0].param.attack[0] = new Function('return ' + stringify(at));
	}
	return ab;
}

//###############################################################

abilityModClick = function(key,id){
	if(!mainList[key].windowList.ability){
		Chat.add(key,'The Ability Window needs to be opened to use this mod. It will have the following effect: <br>' + abilityModDb[id].info);
		return;
	} else {
		mainList[key].chatInput = ['$win,ability,mod,' + id + ',',0];
	}
	
}
		
//Default
Ability.template = function(){
	var ab = 
	{'name':'Fire','tag':[],'icon':'melee.mace',
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
	return ab;

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

//Random
Ability.template.attack.element = function(seed){
	var possible = {
		's':[
			{'mod':1,'hit':'attack3','dmgRatio':{'melee':100,'range':0,'magic':0,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'hit':'fire2','dmgRatio':{'melee':100,'range':0,'magic':0,'fire':25,'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'hit':'ice2','dmgRatio':{'melee':100,'range':0,'magic':0,'fire':5*Math.random(),'cold':25,'lightning':5*Math.random()}},
			{'mod':1,'hit':'thunder2','dmgRatio':{'melee':100,'range':0,'magic':0,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':25}},
			{'mod':1,'hit':'darkness1','dmgRatio':{'melee':100,'range':0,'magic':0,'fire':25,'cold':25,'lightning':25}},
			],

		
		'b':[
			{'mod':1,'image':'arrow','hit':'attack3','dmgRatio':{'melee':0,'range':100,'magic':0,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'image':'arrow','hit':'fire2','dmgRatio':{'melee':0,'range':100,'magic':0,'fire':25,'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'image':'arrow','hit':'ice2','dmgRatio':{'melee':0,'range':100,'magic':0,'fire':5*Math.random(),'cold':25,'lightning':5*Math.random()}},
			{'mod':1,'image':'arrow','hit':'thunder2','dmgRatio':{'melee':0,'range':100,'magic':0,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':25}},
			{'mod':1,'image':'arrow','hit':'darkness1','dmgRatio':{'melee':0,'range':100,'magic':0,'fire':25,'cold':25,'lightning':25}},
			
			{'mod':1,'image':'fireball','hit':'fire2','dmgRatio':{'melee':0,'range':0,'magic':100,'fire':100,'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'image':'fireball','hit':'fire2','dmgRatio':{'melee':0,'range':0,'magic':50,'fire':150,'cold':5*Math.random(),'lightning':5*Math.random()}},
			{'mod':1,'image':'fireball','hit':'fire2','dmgRatio':{'melee':0,'range':0,'magic':150,'fire':50,'cold':5*Math.random(),'lightning':5*Math.random()}},
			
			{'mod':1,'image':'iceshard','hit':'ice2','dmgRatio':{'melee':0,'range':0,'magic':100,'fire':5*Math.random(),'cold':100,'lightning':5*Math.random()}},
			{'mod':1,'image':'iceshard','hit':'ice2','dmgRatio':{'melee':0,'range':0,'magic':50,'fire':5*Math.random(),'cold':150,'lightning':5*Math.random()}},
			{'mod':1,'image':'iceshard','hit':'ice2','dmgRatio':{'melee':0,'range':0,'magic':150,'fire':5*Math.random(),'cold':50,'lightning':5*Math.random()}},
		
			{'mod':1,'image':'lightningball','hit':'thunder2','dmgRatio':{'melee':0,'range':0,'magic':100,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':100}},
			{'mod':1,'image':'lightningball','hit':'thunder2','dmgRatio':{'melee':0,'range':0,'magic':50,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':150}},
			{'mod':1,'image':'lightningball','hit':'thunder2','dmgRatio':{'melee':0,'range':0,'magic':150,'fire':5*Math.random(),'cold':5*Math.random(),'lightning':50}},
		]
	}
	
	return randomViaMod(possible[seed.type]);
	
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

	
