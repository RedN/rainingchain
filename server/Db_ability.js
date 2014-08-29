//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','Attack','Tk','Init','Craft','Item','Plan','Actor','Main','Combat','requireDb','List'],['Ability']));
var db = requireDb();

Db.ability = {};	//for quest
var a = {};
Init.db.ability = function(cb){	//pointless now...
	for(var i in a){
		a[i].id = i;
		Ability.creation(a[i]);
	}	
	cb();
	
}

var Ability = exports.Ability = {};
Ability.creation = function(a){	//GOAL = ability doesnt crash game.  for nice looking ability, check Quest.exports
	a.action = Tk.useTemplate(Ability.template.action(),a.action);
	a = Tk.useTemplate(Ability.template(),a,1,1);
	
	Db.ability[a.id] = a;
		
	//Setting Item Part
	Item.creation({
		name:a.name,
		icon:'plan.ability',
		option:[	
			{name:'Learn Ability','remove':1,'func':Actor.ability.add,param:['$actor',a.id]},
		],
		type:'ability',
		id:a.id,
	});
	return a.id;
}

Ability.functionVersion = function(name){	//turn ability into function. called when swapAbility
	var ab = typeof name === 'object' ? name : Tk.deepClone(Db.ability[name]);
	if(!ab) return ERROR(3,'no ability',name);
	
	if(ab.action && ab.action.funcStr === 'Combat.attack'){
		var at = ab.action.param;
		at = Tk.useTemplate(Attack.template(),at,true);
		ab.action.param = new Function('return ' + Tk.stringify(at));
	}
	return ab;
}

Ability.objectVersion = function(name){	//BAD...
	var ab = Ability.functionVersion(name);
	if(typeof ab.action.param === 'function') ab.action.param = ab.action.param();
	return ab;
}	


Ability.template = function(){
	return {
		"type":"attack",
		"name":"Strike",
		"icon":"attackMelee.cube",
		"description":"Regular Melee Strike",
		"periodOwn":25,
		"periodGlobal":25,
		"id":"Qbug",
		"bypassGlobalCooldown":false,
		"costMana":0,
		"costHp":0,
		"action":{},
	}
}

Ability.template.action = function(){	//idk where to use...
	return {
		"funcStr":"",
		"animOnSprite":"",
		"param":[],
		"anim":"",
	}
}
Ability.template.action.attack = function(){
	return {
		"type":"strike",
		"angle":0,
		"amount":1,
		"dmg":{"main":500,"ratio":{"melee":1,"range":0,"magic":0,"fire":0,"cold":0,"lightning":0}},
	};	
}


