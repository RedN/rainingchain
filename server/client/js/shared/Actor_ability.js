//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Server','Message','Combat','Ability','Anim']));

var INTERVAL_ABILITY = 3;

Actor.AbilityList = function(normal,quest){
	return {
		normal:normal || {},	//abilityId:1
		quest:quest || {}
	};
}

Actor.AbilityList.compressDb = function(abilityList){
	return Object.keys(abilityList.normal);
}

Actor.AbilityList.uncompressDb = function(abilityList){
	var tmp = {};	
	for(var i in abilityList) 
		tmp[abilityList[i]] = 1;
	if(!Actor.AbilityList.testIntegrity(tmp)) return Actor.AbilityList.fixIntegrity(tmp);
	return Actor.AbilityList(tmp);
}

Actor.AbilityList.testIntegrity = function(abilityList){
	return Actor.AbilityList.fixIntegrity(abilityList,true);
}

Actor.AbilityList.fixIntegrity = function(abilityList,onlyTesting){
	for(var i in abilityList){
		for(var j in abilityList[i]){
			if(!Ability.get(j)){
				if(onlyTesting) return false;
				ERROR(2,'ability no longer exist',j);
				delete abilityList[i][j];
			}
		}
	}
	if(onlyTesting) return true;
	return abilityList;
}

Actor.AbilityList.compressClient = function(abilityList,act){
	return Object.keys(Actor.getAbilityList(act));
}

Actor.AbilityList.uncompressClient = function(abilityList,act){
	var tmp = {};
	for(var i in abilityList)
		tmp[abilityList[i]] = 1;
	return Actor.AbilityList(tmp);
}

//################
Actor.Ability = function(normal,quest){
	return {
		normal:normal || [null,null,null,null,null,null],	//array of Ability.functionVersion
		quest:quest || [null,null,null,null,null,null],
	}
}

Actor.Ability.compressDb = function(ability){
	for(var i in ability.normal) 
		ability.normal[i] = ability.normal[i] ? ability.normal[i].id : 0;
	return ability.normal;
}

Actor.Ability.uncompressDb = function(ability){
	for(var i in ability)
		ability[i] = ability[i] ? Ability.functionVersion(ability[i]) : null;	//Ability.functionVersion already fix integrity
	return Actor.Ability(ability);
}



Actor.Ability.compressClient = function(ability,act){
	var list = Actor.getAbility(act);
	var tmp = [];
	for(var i in list){
		tmp[i] = list[i] ? list[i].id : 0;		
	}
	return tmp;
}

Actor.Ability.uncompressClient = function(ability,act){
	for(var i in ability) 
		if(!ability[i]) ability[i] = null;
	return Actor.Ability(ability);
}

//################

Actor.AbilityAi = function(array,range){
	var tmp = {
		close:{},
		middle:{},
		far:{},
		range:range || [60,300],
		list:{},
	};
	
	for(var i in array){
		var id = array[i].id;
		var distanceInfo = array[i].distanceInfo;
		
		tmp.close[id] = distanceInfo[0];
		tmp.middle[id] = distanceInfo[1];
		tmp.far[id] = distanceInfo[2];
		tmp.list[id] = 1;
	}
	return tmp;	
} 

Actor.AbilityAi.ability = function(id,distanceInfo){
	return {
		id:id,
		distanceInfo:distanceInfo,
	}
}

Actor.AbilityChange = function(ab){	//ab : ability
	var tmp = {
		press:'00000000000000',	//more than 6 cuz monsters
		charge:{},	//abilityId:charge
		chargeClient:[0,0,0,0,0,0],
		globalCooldown:0
	};
	for(var i in ab) if(ab[i]) tmp.charge[ab[i].id] = 0;
	return tmp;
}



//#################

Actor.setAbilityListUsingAbilityAi = function(act){
	act.abilityList = Actor.AbilityList(act.abilityAi.list);
	for(var id in act.abilityAi.list){
		if(id !== Actor.IDLE_ABILITY_ID) 
			Actor.ability.swap(act,id);
	}
}

//#################

Actor.ability = {};

Actor.ability.remove = function(act,name){
	delete Actor.getAbilityList(act)[name];
	var ab = Actor.getAbility(act);
	for(var i in ab){
		if(ab[i] && ab[i].id === name){
			ab[i] = null;
		}
	}
	Actor.setFlag(act,'ability');
	Actor.setFlag(act,'abilityList');
}

Actor.ability.swap = function(act,name,position,strict){
	if(strict && !Actor.ability.swap.test(act,name,position)) return;
	
	var ab = Actor.getAbility(act);
	if(position === undefined)	for(position = 0; position < 100; position++) if(!ab[position]) break;	//get first empty position
	
	for(var i in ab){ //prevent multiple
		if(ab[i] && ab[i].id === name) ab[i] = null; 
	}	

	var ability = Ability.functionVersion(name);
	ab[position] = ability;
	act.abilityChange = Actor.AbilityChange(ab);
	
	Actor.setFlag(act,'ability');
	Actor.setFlag(act,'abilityList');
}

Actor.ability.swap.test = function(act,name,position){
	if(act.combatContext.ability !== 'normal') 
		return Message.add(key,'You can\'t change your ability at this point of the quest.');
	
	if(!Actor.getAbilityList(act)[name]) return Message.add(key,'You don\'t have this ability');
	
	var ability = Ability.functionVersion(name);
	
	if(position === 4 && ability.type !== 'heal') return Message.add(act.id,'This ability slot can only support Healing abilities.');
	if(position === 5 && ability.type !== 'dodge') return Message.add(act.id,'This ability slot can only support Dodge abilities.');
	
	return true;
}


Actor.ability.add = function(act,name,message){
	if(!Ability.get(name)) return ERROR(3,'ability not exist',name);
	if(message !== false) Message.add(act.id,"You have learnt a new ability: \"" + Ability.get(name).name + '".');
	Actor.getAbilityList(act)[name] = 1;
	Server.log(1,act.id,'learnAbility',name);
	
	Actor.setFlag(act,'ability');
	Actor.setFlag(act,'abilityList');
}


Actor.getAbility = function(act){
	return act.ability[act.combatContext.ability];
}

Actor.getAbilityList = function(act){
	return act.abilityList[act.combatContext.ability];
}




Actor.ability.loop = function(act){
	if(!Actor.testInterval(act,INTERVAL_ABILITY)) return;
	Actor.ability.loop.charge(act);
	Actor.ability.loop.clickVerify(act);
	if(act.type === 'player')
		Actor.ability.loop.chargeClient(act);
};
Actor.ability.loop.charge = function(act){	//HOTSPOT
	var ma = act.abilityChange;
	ma.globalCooldown -= INTERVAL_ABILITY;
	ma.globalCooldown = ma.globalCooldown.mm(-100,250); 	//cuz if atkSpd is low, fuck everything with stun
	var ab = Actor.getAbility(act);
	for(var i in ab){
		var s = ab[i]; if(!s) continue;	//cuz can have hole if player
		ma.charge[s.id] = (ma.charge[s.id] + act.atkSpd * INTERVAL_ABILITY) || 0;
	}
}

Actor.ability.loop.chargeClient = function(act){
	var ab = Actor.getAbility(act);
	var ma = act.abilityChange;
	
	ma.chargeClient = '';
	for(var i in ab){
		var s = ab[i]; if(!s){ ma.chargeClient += '0'; continue; }	//cuz can have hole if player
		//Client
		var rate = ma.charge[s.id] / s.periodOwn;
		ma.chargeClient += rate >= 1 ? 'R' : Math.round(rate*35).toString(36).slice(0,1);
	}
}

Actor.ability.loop.clickVerify = function(act){
	if(act.noAbility) return;
	var ab = Actor.getAbility(act);
	var ma = act.abilityChange;
	for(var i in ab){
		var s = ab[i]; if(!s) continue;	//cuz can have hole if player
		
		if(ma.press[i] === '1' && ma.charge[s.id] > s.periodOwn && (s.bypassGlobalCooldown || (ma.globalCooldown <= 0))){
			Actor.useAbility(act,s);
			break;
		}
	}
}



Actor.ability.fullyRecharge = function(act){
	var ab = Actor.getAbility(act);
	act.abilityChange.globalCooldown = 0;
	for(var i in ab){
		var s = ab[i]; if(!s) continue;	//cuz can have hole if player
		act.abilityChange.charge[s.id] = 1000;
	}
}

Actor.useAbility = function(act,ab,mana,reset,extra){
	//Mana
	if(mana !== false && !Actor.useAbility.testResource(act,ab)) return;
	if(reset !== false)	Actor.useAbility.resetCharge(act,ab);
	
	//Anim
	if(ab.spriteFilter && act.isActor){
		act.spriteFilter = ab.spriteFilter;
	}
	
	if(ab.preDelayAnimOverSprite)
		Anim(ab.preDelayAnimOverSprite,Anim.Target(act.id));
	
	Actor.setTimeout(act,function(){
		if(ab.postDelayAnimOverSprite)	
			Anim(ab.postDelayAnimOverSprite,Anim.Target(act.id));
	
		//Do Ability Action
		if(ab.funcStr === 'Combat.attack') return Combat.attack(act,ab.param,extra);
		if(ab.funcStr === 'Combat.dodge') return Combat.dodge(act,ab.param);
		if(ab.funcStr === 'Combat.heal') return Combat.heal(act,ab.param);
		if(ab.funcStr === 'Combat.summon') return Combat.summon(act,ab.param);
		if(ab.funcStr === 'Combat.event') return Combat.event(act,ab.param);
		if(ab.funcStr === 'Combat.idle') return Combat.idle(act,ab.param);
		if(ab.funcStr === 'Combat.boost') return Combat.boost(act,ab.param);
		ERROR(3,'invalid funcStr',ab.funcStr,act.name);
	},ab.delay);
	
}

Actor.useAbility.resetCharge = function(act,ab){
	var charge = act.abilityChange.charge;
	charge[ab.id] = 0;
	act.abilityChange.globalCooldown = Math.max(act.abilityChange.globalCooldown,0);	//incase bypassing Global
	act.abilityChange.globalCooldown +=  ab.periodGlobal / act.atkSpd.mm(0.05);

}

Actor.useAbility.testResource = function(act,ab){
	if(act.mana < ab.costMana || act.hp < ab.costHp) return false;
	act.mana -= ab.costMana;
	act.hp -= ab.costHp;
	return true;		
}







