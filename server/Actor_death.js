//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Server','Main','Quest','Craft','Activelist','Chat','Drop','Skill','Plan','Combat']));
Actor.death = function(act){	
	var killers = Actor.death.getKillers(act);
	Actor.death.summon(act);
	if(act.type === 'npc') Actor.death.npc(act,killers);
	if(act.type === 'player') Actor.death.player(act,killers);
}

Actor.death.summon = function(act){
	for(var i in act.summon){
		for(var j in act.summon[i].child){
			Actor.remove(List.all[j]);
		}		
	}
}

Actor.death.player = function(act,killers){
	Server.log(3,act.id,'death');
	var key = act.id;
	var main = List.main[key];
	
	Main.screenEffect(main,'fadeout',{'time':30,'maxTimer':30,'color':'black'});
	
	//Quest
	Quest.getQuestActive(act.id,function(quest,qid){
		quest._deathCount++;
		Db.quest[qid].event._death(key,killers);
	});
	//Message
	var string = 'You are dead... ';
	var array = [
		"Please don't ragequit.",
		"You just got a free teleport to a safe place. Lucky you.",
		"Try harder next time.",
		"You're feeling giddy!",
		"Is that all you got?",
		"This game is harder than it looks.",
		"If someone asks, just say you died on purpose.",	
	];
	string += array.random();
	Chat.add(key,string);
	
	
	act.dead = 1;
	act.respawn = 25;
	
	if(act.deathEvent && killers[0]) 
		act.deathEvent(act.id,killers[0]);	
	
}

Actor.death.getKillers = function(act){
	for(var i in act.damagedBy) if(!List.all[i]) delete act.damagedBy[i];

	var tmp = Object.keys(act.damagedBy);	

	for(var i = tmp.length-1; i >= 0; i--){
		if(!List.main[tmp[i]]) tmp.splice(i,1);	//remove non-player
	}
	return tmp;

}

Actor.death.npc = function(act,killers){
	act.dead = 1;
	
	if(act.deathEvent) for(var i in killers) act.deathEvent(killers[i],act,act.map); 
	if(act.deathEventOnce) act.deathEventOnce(killers,act,act.map); 
	

	Actor.death.drop(act,killers);	//increase _enemyKilled here
	Actor.death.exp(act,killers);
	
	Actor.death.performAbility(act);				//custom death ability function
	Activelist.clear(act);
}

Actor.death.performAbility = function(act){
	for(var i in act.deathAbility){
		Actor.performAbility(act,Actor.getAbility(act)[act.deathAbility[i]],false,false);
	}
}

Actor.death.drop = function(act,killers){
	if(!act.quest) return;
	for(var p in killers){
		var key = killers[p];
		var killer = List.all[key];
		
		var amount = List.main[key].quest[act.quest]._enemyKilled++;
		var baseChance = Math.min(1,10 / amount);
		baseChance *= 1/10;		//constant.
		var chanceMod = Db.quest[act.quest].reward.item * (1+killer.item.quantity);
		
		if(Math.random() < Math.probability(baseChance,chanceMod)){	//quantity applied in Drop.getList
			var item = Craft.getRandomMaterial(Actor.getCombatLevel(killer));
			Drop.creation({'x':act.x,'y':act.y,'map':act.map,'item':item,'amount':1,'viewedIf':[key]});			
		}
	}

}

Actor.death.respawn = function(act,teleport){	//for player
	if(teleport !== false){
		var rec = act.respawnLoc.recent;
		var good = List.map[Actor.teleport.getMapName(act,rec.map)] ? rec : act.respawnLoc.safe;
		Actor.teleport(act, good);
	}
	
	Combat.clearStatus(act);
	Actor.boost.removeAll(act);
	for(var i in act.resource)
		act[i] = act.resource[i].max;
	act.dead = 0;
	
	Actor.invincible(act,25*5);
	Actor.rechargeAbility(act);
	
	Server.log(3,act.id,'respawn',act.x,act.y,act.map);
	
}
//ts("Plan.creation({'rarity':0,'quality':0,'piece':'melee','lvl':10,'category':'equip',});")


Actor.death.exp = function(act,killers){
	if(!act.quest) return;
	var q = Db.quest[act.quest].drop;
	for(var i in killers){
		var key = killers[i];
		var killer = List.all[key];
		
		var amount = List.main[key].quest[act.quest]._enemyKilled;
		var baseExp = 10;	//constant
		baseExp *= Math.min(1,10 / amount);
		baseExp *= Db.quest[act.quest].reward.exp;
		
		//var skill = Db.equip[killer.weapon].skill;	
		var skill = act.lastAbilitySkill;
		if(!act.lastAbilitySkill || act.lastAbilitySkill === 'fire' ||
			act.lastAbilitySkill === 'cold' || act.lastAbilitySkill === 'lightning'){
				skill = ['melee','range','magic'].random();
		}
		
		Skill.addExp(key,skill,baseExp);
	}
}







