
Actor.death = function(act){	
	if(act.type === 'npc') Actor.death.npc(act);
	if(act.type === 'player') Actor.death.player(act);
	
}

Actor.death.player = function(act){
	LOG(2,act.id,'death');
	var key = act.id;
	var main = List.main[key];
	
	main.screenEffect = {'name':'fadeout','time':50,'maxTimer':50,'color':'black'};
	
	//Quest
	for(var i in main.quest)	if(main.quest[i].started)	main.quest[i].deathCount++;	
	
	//Message
	var string = 'You are dead... ';
	var array = [
		"Please don't ragequit.",
		"You just got a free teleport to a safe place. Lucky you.",
		"Try harder next time.",
		"You're Feeling Giddy",
		"This game is harder than it looks apparently.",
		"If someone asks, just say you died on purpose.",	
	];
	string += array.random();
	Chat.add(key,string);
	
	
	act.dead = 1;
	act.respawn = 25;
	
	if(act.deathFunc){	
		var killers = Actor.death.getKiller(act);
		act.deathFunc(act.id,killers[0]);	//[0] is most dmg. used for pvp
	}	
	
}

Actor.death.npc = function(act){
	act.dead = 1;
	
	//if(act.deathFunc)	for(var i in killers) act.deathFunc(killers[i],act,act.map) //custom death function (ex quest)
	if(act.deathFunc){	
		for(var i in act.damagedBy){
			if(List.all[i]) act.deathFunc(i,act,act.map); 
		}
	}
		
	Actor.death.performAbility(act);				//custom death ability function
	Activelist.remove(act);
}

Actor.death.performAbility = function(act){
	for(var i in act.deathAbility){
		Actor.performAbility(act,Actor.getAbility(act)[act.deathAbility[i]],false,false);
	}
}


Actor.death.drop = function(act,killers){		//TOFIX toremove
	return;	
	var drop = act.drop;
	
	var quantity = (1 + drop.mod.quantity).mm(0); 
	var quality = drop.mod.quality;
	var rarity = drop.mod.rarity;
	if(killers[0] && List.all[killers[0]]){ 
		quantity += List.all[killers[0]].item.quantity; 
		quality += List.all[killers[0]].item.quality; 	//only for plan
		rarity += List.all[killers[0]].item.rarity; 		//only for plan
	}
	
	//Category
	var list = Drop.getCategoryList(drop.category,act.lvl,quantity);
	
	for(var i in list){
		var item = list[i];
		if(Math.random() < item.chance){	//quantity applied in Drop.getList
			var killer = killers.random();
			var amount = Math.round(item.amount[0] + Math.random()*(item.amount[1]-item.amount[0]));	
			Drop.creation({'x':act.x,'y':act.y,'map':act.map,'item':item.name,'amount':amount,'timer':Drop.timer,'viewedIf':[killer]});			
		}
	}
		
	
	//Plan
	planLoop:
	for(var i in drop.plan){
		for(var j in drop.plan[i]){
			
			if(Math.pow(Math.random(),quantity)/5 < drop.plan[i][j]){
				var randomKiller = killers.random();
				
				var id = Craft.equip({	//craft white
					'rarity':rarity,
					'quality':quality,
					'piece':i,
					'type':j,
					'lvl':act.lvl,
					'category':'equip',
					'minAmount':0,
					'maxAmount':0,
				});
			
				Drop.creation({'x':act.x,'y':act.y,'map':act.map,'item':id,'amount':1,'timer':Drop.timer,'viewedIf':[killer]});	
			}	

			if(Math.pow(Math.random(),quantity) < drop.plan[i][j]){
				var randomKiller = killers.random();
				
				var id = Plan.creation({	//craft plan
					'rarity':rarity,
					'quality':quality,
					'piece':i,
					'type':j,
					'lvl':act.lvl,
					'category':'equip',
				});
			
				Drop.creation({'x':act.x,'y':act.y,'map':act.map,'item':id,'amount':1,'timer':Drop.timer,'viewedIf':[killer]});	
				break planLoop;
			}
		}
	}

}

Actor.death.respawn = function(act){	//for player
	var rec = act.respawnLoc.recent;
	
	if(!rec.x) rec = rec[rec.randomAttribute()];	//aka when multi possible spawn aka pvp
	
	var good = List.map[rec.map] ? rec : act.respawnLoc.safe;
	
	Actor.teleport(act, good);
		
	Combat.clearStatus(act);
	Actor.boost.removeAll(act);
	for(var i in act.resource)
		act[i] = act.resource[i].max;
	act.dead = 0;
	
	LOG(2,act.id,'respawn',act.x,act.y,act.map);
	
}
//ts("Plan.creation({'rarity':0,'quality':0,'piece':'melee','lvl':10,'category':'equip',});")
