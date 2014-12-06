//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor']));

Actor.setCombatContext = function(act,what,type,reset){
	act.combatContext[what] = type;
	if(what === 'ability'){
		if(reset){
			act.abilityList[type] = {};
			act.ability[type] = [];
		}
		act.abilityChange = Actor.AbilityChange(act.abilityList[type]);
		Actor.setFlag(act,'ability');
		Actor.setFlag(act,'abilityList');
	}
	if(what === 'equip'){
		if(reset) act.equip[type] = [];
		Actor.equip.update(act);	//act.flag.equip set there
	}
}

Actor.changeHp = function(act,amount){
	Actor.resource.add(act,amount);
}

Actor.changeResource = function(act,heal){
	Actor.resource.add(act,heal.hp,heal.mana);
}


Actor.resource = {};
Actor.resource.loop = function(act){
	if(!Actor.testInterval(act,5)) return;
	Actor.resource.add(act,act.hpRegen*5,act.manaRegen*5);	
}

Actor.resource.add = function(act,hp,mana){
	if(typeof hp === 'string')	//ex: 50%
		hp = hp.numberOnly()/100*act.hpMax; 
	if(typeof mana === 'string')
		mana = mana.numberOnly()/100*act.manaMax;
	
	act.hp = Math.min(act.hpMax,act.hp + (hp || 0));
	act.mana = Math.min(act.manaMax,act.mana + (mana || 0));
}


Actor.getDef = function(act){
	var defratio = Actor.getEquip(act).def;
	var def = {
		main:act.globalDef,
		ratio:Tk.deepClone(defratio)
	};
	for(var i in def.ratio){
		def.ratio[i] *= act.mastery.def[i].mod * act.mastery.def[i].sum;
		def.ratio[i].mm(1);
	}
	return def;
}

Actor.dodge = function(act,time,dist){
	
	Actor.becomeInvincible(act,time);
	
	//movement
	Actor.movePush(act,act.angle,dist/time,time)
	
}

Actor.becomeInvincible = function(act,time){
	//invincibility
	var oldtouch = act.damagedIf;
	act.damagedIf = 'false';
	Actor.setTimeout(act,function(key){
		Actor.get(key).damagedIf = oldtouch;	
	},time,'actor.invincible');

}

Actor.rechargeAbility = function(act){
	Actor.ability.fullyRecharge(act);
}




