Actor.update.equip = function(act){
	var equip = Actor.getEquip(act);
	
	//Def
	for(var i in equip.def){	//Each Element
		var sum = 0;
		for(var j in equip.piece){	//Each Piece
			var eq = Db.equip[equip.piece[j]];
			if(!eq) continue;
			sum += eq.def.main * eq.def.ratio[i] * eq.orb.upgrade.bonus;
		}
		equip.def[i] = sum || 1;
	}

	//Boost
	for(var i in equip.piece){
		if(!Cst.isArmor(i)) continue;
		var dbequip = Db.equip[equip.piece[i]];
		if(dbequip) Actor.permBoost(act,'armor' + i,dbequip.boost);		//have something
		else Actor.permBoost(act,'armor' + i);							//have nothing so reset
	}
	Actor.permBoost(act,'weapon',Db.equip[act.weapon].boost);
}
Actor.equip = function(act,name){
	if(!Itemlist.empty(List.main[act.id].invList,1)){ Chat.add(act.id,'You need at least 1 empty space.'); return;}
	
	var equip = Db.equip[name];
	if(!equip) return;
	
	Actor.equip.remove(act,equip.piece);
	Actor.equip.add(act,name);
	
	if(Cst.isWeapon(equip.piece)) Actor.equip.weapon(act,equip.piece);
	
}
Actor.equip.remove = function(act,piece){
	var equip = Actor.getEquip(act);
	var old = equip.piece[piece];
	if(old) Itemlist.add(act.id,old);				//add old item if it wasnt empty
	Actor.update.equip(act);
}

Actor.equip.add = function(act,name){
	var equip = Db.equip[name];
	if(!equip) return;
	if(!Actor.equip.add.req(act,equip)){
		Chat.add(act.id,'You need have the level to wear this equip.'); return;
	}
	Actor.getEquip(act).piece[equip.piece] = name;
	Itemlist.remove(act.id,name);
	Actor.update.equip(act);
}
Actor.equip.add.req = function(act,equip){
	for(var i in equip.req){
		if(act.skill.lvl[i] < equip.req[i]) return false;
	}
	return true;
}

Actor.equip.weapon = function(act,piece){
	act.weapon = Actor.getEquip(act).piece[piece] || 'unarmed';
}

Actor.getEquip = function(act){
	return act.equip[act.combatContext || 'regular'];
}

