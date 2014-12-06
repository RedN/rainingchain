//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Main','Server','Message','Boost']));

Actor.Skill = function(exp){
	return {
		exp:exp||0,	
	}
}

Actor.SkillPlot = function(quest,num,type){
	return {
		quest:quest,
		num:num,
		type:type
	};	
}


//###############

Actor.getCombatLevel = function(act){
	return Actor.getMain(act).reputation.lvl;
}

Actor.addExp = function(act,num){
	act.skill.exp += num || 0;
	Actor.setFlag(act,'skill');
}


Actor.getExp = function(act){
	return act.skill.exp;
}
