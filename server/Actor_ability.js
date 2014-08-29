//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Db','Actor','Server','Chat','Ability']));

Actor.ability = {};

Actor.ability.remove = function(act,name){
	delete Actor.getAbilityList(act)[name];
	var ab = Actor.getAbility(act);
	for(var i in ab){
		if(ab[i] && ab[i].id === name){
			ab[i] = null;
		}
	}
	act.flag.ability = 1;
	act.flag.abilityList = 1;
}

Actor.ability.swap = function(act,name,position,strict){
	var ab = Actor.getAbility(act);
	if(position === undefined)	for(position = 0; position < 100; position++) if(!ab[position]) break;

	var ability = Ability.functionVersion(name);
	if(strict){
		if(position === 4 && ability.type !== 'heal'){Chat.add(act.id,'This ability slot can only support Healing abilities.'); return;}	
		if(position === 5 && ability.type !== 'dodge'){Chat.add(act.id,'This ability slot can only support Dodge abilities.'); return;}	
	}
	
	ab[position] = ability;
	act.abilityChange = Actor.template.abilityChange();
	for(var i in ab){ 
		if(ab[i]) act.abilityChange.charge[ab[i].id] = 0;
	}
	act.flag.ability = 1;
	act.flag.abilityList = 1;
}

Actor.ability.add = function(act,name,message){
	if(!Db.ability[name]) return ERROR(3,'ability not exist',name);
	if(message !== false) Chat.add(act.id,"You have learnt a new ability: \"" + Db.ability[name].name + '".');
	Actor.getAbilityList(act)[name] = 1;
	Server.log(1,act.id,'learnAbility',name);
	
	act.flag.ability = 1;
	act.flag.abilityList = 1;
}


Actor.getAbility = function(act){
	return act.ability[act.combatContext.ability];
}

Actor.getAbilityList = function(act){
	return act.abilityList[act.combatContext.ability];
}

