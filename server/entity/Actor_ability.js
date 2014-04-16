Actor.removeAbility = function(act,name){
	delete Actor.getAbilityList(act)[name];
	var ab = Actor.getAbility(act);
	for(var i in ab){
		if(ab[i] && ab[i].id === name){
			ab[i] = null;
		}
	}
	LOG(1,act.id,'removeAbility',name);
}

Actor.swapAbility = function(act,name,position){
	
	/*
	if(act.type === 'player'){
		if(abPos === 4 && act.abilityList[abListPost].type !== 'heal'){Chat.add(act.id,'This ability slot can only support Healing abilities.'); return;}	
		if(abPos === 5 && act.abilityList[abListPost].type !== 'dodge'){Chat.add(act.id,'This ability slot can only support Dodge abilities.'); return;}	
	}
	*/
	if(act.type === 'player' && !Actor.getAbilityList(act)[name]) return; 		//dont have access to this ability
	var ability = Ability.uncompress(name);
	
	var ab = Actor.getAbility(act);
	ab[position] = ability;
	act.abilityChange = Actor.template.abilityChange();
	for(var i in ab){ 
		if(ab[i])		act.abilityChange.charge[ab[i].id] = 0;
	}

}

Actor.learnAbility = function(act,name){
	if(!Db.ability[name]) return;
	Chat.add(act.id,"You have learnt a new ability: \"" + Db.ability[name].name + '".');
	Actor.getAbilityList(act)[name] = 1;
	LOG(1,act.id,'learnAbility',name);
}

Actor.useAbilityPlan = function(act,name){
	Actor.learnAbility(act,name);
	Itemlist.remove(List.main[act.id].invList,name,1);
}

Actor.examineAbility = function(act){}

Actor.getAbility = function(act){
	return act.ability[act.combatContext];
}

Actor.getAbilityList = function(act){
	return act.abilityList[act.combatContext];
}



