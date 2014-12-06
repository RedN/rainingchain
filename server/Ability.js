//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['AttackModel','ItemModel','Actor','Main','Boost','OptionList'],['Ability']));

var Ability = exports.Ability = function(quest,id,ability){
	var tmp = {
		quest:'',
		id:'',
		type:"attack",
		name:"Strike",
		icon:"attackMelee.cube",
		description:"Regular Melee Strike",
		periodOwn:25,
		periodGlobal:25,
		bypassGlobalCooldown:false,
		costMana:0,
		costHp:0,
		//
		funcStr:"",
		param:null,
		//
		delay:2,
		preDelayAnimOverSprite:null,
		spriteFilter:null,
		postDelayAnimOverSprite:null,
	}
	
	for(var i in ability) tmp[i] = ability[i];
	tmp.quest = quest; tmp.id = id;	//need after loop thru ability
	
	
	DB[id] = tmp;
	
	Ability.createItemVersion(tmp);
	
	return tmp;
}

var DB = Ability.DB = {};

Ability.get = function(id){
	return DB[id] || null;	
};	//for quest

Ability.createItemVersion = function(tmp){
	ItemModel(tmp.quest,tmp.id,tmp.name,'plan.ability',[
		ItemModel.Option(Ability.clickScroll,'Learn Ability','Learn Ability',[OptionList.ACTOR,tmp.id])
	],tmp.name,{type:'ability'});
}

Ability.Param = function(funcStr,param){	//unused but sub yes
	if(funcStr === 'Combat.heal') return Ability.Param.heal(param);
	if(funcStr === 'Combat.summon') return Ability.Param.summon(param);
	if(funcStr === 'Combat.attack') return Ability.Param.attack(param);
	if(funcStr === 'Combat.boost') return Ability.Param.boost(param);
	if(funcStr === 'Combat.dodge') return Ability.Param.dodge(param);
	if(funcStr === 'Combat.event') return Ability.Param.event(param);
	if(funcStr === 'Combat.idle') return Ability.Param.idle(param);
	return ERROR(3,'invalid funcStr',funcStr,param);
}
Ability.Param.idle = function(param){
	return {};
}

Ability.Param.heal = function(param){
	return {
		mana:param.mana || 0,
		hp:param.hp || 0,
	}
}
Ability.Param.dodge = function(param){
	return {
		distance:param.distance || 0,
		time:param.time || 0,
	}
}
Ability.Param.event = function(param){
	return {
		event:param.event || CST.func
	}
}

Ability.Param.summon = function(param){
	return {
		maxChild:param.maxChild || 1,
		time:param.time || CST.bigInt,
		distance:param.distance || 500,	//distance before tele back to u
		model:param.model || '',
		amount:param.amount || 1,
		lvl:param.lvl || 0,				//unsued
	}
}

Ability.Param.boost = function(param){
	return {
		boost:param.boost || [],
	}
}
Ability.Param.boost.boost = function(stat,type,value,time){	//bad name...
	return {
		stat:stat || ERROR(3,'stat missing') || 'globalDmg',
		type:type || '*',
		value:value || 0,
		time:time || 100,
		name:Boost.FROM_ABILITY,
	}
}

Ability.Param.attack = function(param){
	return AttackModel(param);
}


//#################

Ability.functionVersion = function(name){	//turn ability into function. called when swapAbility
	var ab = typeof name === 'object' ? name : Tk.deepClone(DB[name]);
	if(!ab) return ERROR(3,'no ability',name);
	
	if(ab.funcStr === 'Combat.attack'){
		ab.param = new Function('return ' + Tk.stringify(AttackModel(ab.param)));
	}
	return ab;
}

Ability.objectVersion = function(name){
	var ab = Ability.functionVersion(name);
	if(!ab) return ERROR(3,'no ability',name);
	if(typeof ab.param === 'function') ab.param = ab.param();
	return ab;
}	

Ability.compressClient = function(ability){	
	return Ability.objectVersion(ability);
}	

Ability.clickScroll = function(act,id){
	Actor.ability.add(act,id);
	Main.removeItem(Actor.getMain(act),id);
}

