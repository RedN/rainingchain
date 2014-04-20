Actor.ability = {};

Actor.ability.remove = function(act,name){
	delete Actor.getAbilityList(act)[name];
	var ab = Actor.getAbility(act);
	for(var i in ab){
		if(ab[i] && ab[i].id === name){
			ab[i] = null;
		}
	}
	LOG(1,act.id,'removeAbility',name);
}

Actor.ability.swap = function(act,name,position){
	var ab = Actor.getAbility(act);
	if(position === undefined) position = ab.length;
	
	var ability = Ability.uncompress(name);
	if(act.type === 'player'){
		if(position === 4 && ability.type !== 'heal'){Chat.add(act.id,'This ability slot can only support Healing abilities.'); return;}	
		if(position === 5 && ability.type !== 'dodge'){Chat.add(act.id,'This ability slot can only support Dodge abilities.'); return;}	
	}
	
	ab[position] = ability;
	act.abilityChange = Actor.template.abilityChange();
	for(var i in ab){ 
		if(ab[i]) act.abilityChange.charge[ab[i].id] = 0;
	}
}

Actor.ability.add = function(act,name){
	if(!Db.ability[name]) return;
	Chat.add(act.id,"You have learnt a new ability: \"" + Db.ability[name].name + '".');
	Actor.getAbilityList(act)[name] = 1;
	LOG(1,act.id,'learnAbility',name);
}


Actor.getAbility = function(act){
	return act.ability[act.combatContext];
}

Actor.getAbilityList = function(act){
	return act.abilityList[act.combatContext];
}



