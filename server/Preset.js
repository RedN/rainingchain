//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Main']));

var Preset = exports.Preset = function(quest,id,ability,equip,noReputation,pvp,noAttack,noCombat){
	var tmp = {
		quest:quest || '',
		id:id || '',
		ability:ability || false,
		equip:equip || false,
		noReputation:noReputation || false,
		pvp:pvp || false,
		noAttack:noAttack || false,
		noCombat:noCombat || false,
	};

	DB[id] = tmp;
	return tmp;
}

var DB = Preset.DB = {};
Preset.get = function(id){
	return DB[id];
}
Preset.Ability = function(ability){
	for(var i = ability.length; i < 6; i++)
		ability.push('');
	return ability;
}
Preset.Equip = function(equip){
	for(var i in CST.equip.piece){
		var p = CST.equip.piece[i];
		equip[p] = equip[p] || '';
	}
}

Preset.activate = function(preset,key,s){
	if(!preset) return ERROR(3,'no preset with name',name);
	var act = Actor.get(key);
	if(preset.ability){
		Actor.setCombatContext(act,'ability','quest',true);
		for(var i = 0 ; i < preset.ability.length; i++){
			if(preset.ability[i])
				s.addAbility(act.id,preset.ability[i],i);
		}
		s.rechargeAbility(act.id);
	}
	
	
	if(preset.equip){
		Actor.setCombatContext(act,'equip','quest',true);
		for(var i in preset.equip){
			if(preset.equip[i])
				s.addEquip(act.id,preset.equip[i]);
		}
	}
	
	if(preset.noReputation)
		s.enableReputation(key,false);
	if(preset.noAbility)
		s.enableAttack(key,false);
	if(preset.pvp)
		s.enablePvp(key,true);
	if(preset.noCombat)
		s.enableCombat(key,false);	//case quest isAlwaysActive
	s.set(key,'_preset',preset.id)
}

Preset.desactivate = function(key,s){
	Actor.setCombatContext(Actor.get(key),'ability','normal');
	Actor.setCombatContext(Actor.get(key),'equip','normal');
	s.enableAttack(key,true);
	s.enableCombat(key,true);
	s.enableReputation(key,true);
	s.enablePvp(key,false);
	s.set(key,'_preset','');
}
Preset.onSignIn = function(main,q,questVar){
	if(questVar._preset)
		Preset.activate(Preset.get(questVar._preset),main.id,q.s);
}














