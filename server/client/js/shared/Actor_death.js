//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Server','ActorGroup','Main','Quest','Map','ActiveList','Message','Drop','Material','Combat']));

Actor.death = {};

Actor.death.die = function(act){	
	var killers = Actor.death.getKillers(act);
	Actor.death.removeSummonChild(act);
	if(act.type === 'npc') Actor.death.die.npc(act,killers);
	else Actor.death.die.player(act,killers);
}


Actor.death.die.player = function(act,killers){
	Server.log(3,act.id,'death');
	var key = act.id;
	var main = Main.get(key);
	
	Main.screenEffect.add(main,Main.ScreenEffect.fadeout('death',30,'black'));
	
	//Quest
	Main.quest.onDeath(main,killers);
	
	//Message
	var string = 'You are dead... ';
	string += Actor.death.MESSAGE.random();
	Message.add(key,string);
	
	
	act.dead = 1;
	act.respawnTimer = 25;
	
	Actor.endPath(act,true,true);
	
	if(act.deathEvent && killers[0]) 
		act.deathEvent(act.id,killers[0]);	
	
}
Actor.death.MESSAGE = [
	"Please don't ragequit.",
	"You just got a free teleport! Lucky you.",
	"Try harder next time.",
	"You're feeling giddy!",
	"Is that all you got?",
	"This game is harder than it looks.",
	"If someone asks, just say you died on purpose.",	
];

Actor.death.die.npc = function(act,killers){
	act.dead = 1;
	
	Actor.death.generateDrop(act,killers);	//increase _enemyKilled here
	Actor.death.grantExp(act,killers);
	
	Actor.death.useAbility(act);				//custom death ability function
	if(act.deathEvent){ //after drop, otherwise bug
		act.deathEvent(killers[0],act.id,act.map);	//killers[0] may be null
	}
	
	ActiveList.clear(act);
	Actor.remove(act);
	
	
	
}


Actor.death.loop = function(act){
	if(act.type === 'npc'){ ERROR(2,'dead npc should already have been removed'); Actor.remove(act); return }
	
	if(--act.respawnTimer < 0)	
		Actor.death.respawn(act);
}


Actor.death.removeSummonChild = function(act){
	for(var i in act.summon){
		for(var j in act.summon[i].child){
			Actor.remove(Actor.get(j));
		}		
	}
}


Actor.death.getKillers = function(act){
	for(var i in act.damagedBy) 
		if(!Actor.get(i)) delete act.damagedBy[i];

	var tmp = Object.keys(act.damagedBy);	

	for(var i = tmp.length-1; i >= 0; i--){
		if(!Actor.isPlayer(tmp[i])) tmp.splice(i,1);	//remove non-player
	}
	return tmp;

}

Actor.death.useAbility = function(act){
	for(var i in act.deathAbility){
		Actor.useAbility(act,Actor.getAbility(act)[act.deathAbility[i]],false,false);
	}
}

Actor.death.generateDrop = function(act,killers){
	if(!act.quest) return;
	for(var p in killers){
		var key = killers[p];
		var killer = Actor.get(key);
		if(!Actor.isPlayer(killer)) return;
		
		var amount = Main.get(key).quest[act.quest]._enemyKilled++;
		var baseChance = Math.min(1,10 / amount);
		baseChance *= 1/10;		//constant.
		var chanceMod = Quest.get(act.quest).reward.item * (1+killer.magicFind.quantity);
		
		if(Math.random() < Math.probability(baseChance,chanceMod)){	//quantity applied in Drop.getList
			var item = Material.getRandom(Actor.getCombatLevel(killer));
			var spot = Actor.Spot(act.x,act.y,act.map);
			spot = ActorGroup.alterSpot(spot,25);
			Drop(spot,item,1,[key]);			
		}
	}

}

Actor.death.respawn = function(act,teleport){	//for player
	if(teleport !== false){
		var rec = act.respawnLoc.recent;
		var good = Map.get(Actor.teleport.getMapName(act,rec.map)) ? rec : act.respawnLoc.safe;
		Actor.teleport(act, good);
	}
	
	Actor.status.clear(act);
	Actor.boost.removeAll(act);
	act.hp = act.hpMax;
	act.mana = act.manaMax;
	act.dead = 0;
	
	Actor.becomeInvincible(act,25*5);
	Actor.rechargeAbility(act);
	
	Server.log(3,act.id,'respawn',act.x,act.y,act.map);
	
}

Actor.death.grantExp = function(act,killers){
	if(!act.quest) return;
	var expMod = Quest.get(act.quest).reward.exp;
	for(var i in killers){
		var key = killers[i];
		var killer = Actor.get(key);
		
		var amount = Main.get(key).quest[act.quest]._enemyKilled;
		var baseExp = 10;	//constant
		baseExp *= Math.min(1,10 / amount);
		baseExp *= expMod;
		
		var bonus = Main.getSimpleQuestBonus(Actor.getMain(killer),act.quest);
		baseExp *= bonus.exp;
				
		Actor.addExp(killer,baseExp);
	}
}







