//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Chat','Itemlist','Quest']));
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
		var dbequip = Db.equip[equip.piece[i]];
		if(dbequip) Actor.permBoost(act,'equip-' + i,dbequip.boost);		//have something
		else Actor.permBoost(act,'equip-' + i);							//have nothing so reset
	}
	act.flag.equip = 1;
}

Actor.equip = function(act,name){	
	var equip = Db.equip[name];
	if(!equip) return ERROR(4,'equip no exist',name);
	
	Actor.equip.remove(act,equip.piece);
	Actor.equip.add(act,name);
	
	if(CST.isWeapon(equip.piece)) Actor.equip.weapon(act,equip.piece);
	
}
Actor.equip.click = function(act,name){
	if(act.combatContext.equip !== 'normal') 
		return Chat.add(key,'You can\'t change your equip at this point of the quest.');
	if(!Itemlist.empty(List.main[act.id].invList,1)) return Chat.add(act.id,'You need at least 1 empty space.');
	if(act.combatContext.equip === 'quest' && List.main[act.id].questActive && !name.have(List.main[act.id].questActive,true)){
		return Chat.add(act.id,"You can only use equips you received from the quest you're doing.");
	}
	Actor.equip(act,name);
}

Actor.equip.remove = function(act,piece){
	var equip = Actor.getEquip(act);
	var old = equip.piece[piece];
	if(old){	//add old item if it wasnt empty
		var inv = List.main[act.id].invList;
		if(Itemlist.empty(inv,1)) Itemlist.add(inv,old);				
		else if(Itemlist.empty(List.main[act.id].bankList,1)) Itemlist.add(List.main[act.id].bankList,old);
		else Chat.add(act.id,'You are fucked... ' + old);	//BAD		
	}
	equip.piece[piece] = '';
	Actor.update.equip(act);
}

Actor.equip.add = function(act,name){
	var equip = Db.equip[name];
	if(!equip) return;
	if(!Actor.equip.add.req(act,equip)) return;
	Actor.getEquip(act).piece[equip.piece] = name;
	Itemlist.remove(List.main[act.id].invList,name);
	Actor.update.equip(act);
}
Actor.equip.add.req = function(act,equip){
	for(var i in equip.req){
		if(act.skill.lvl[i] < equip.req[i]) 
			return Chat.add(act.id,'You need level ' + equip.req[i] + ' ' + i.capitalize() + ' to wear this equip.');
	}
	return true;
}

Actor.equip.weapon = function(act){
	act.weapon = Actor.getEquip(act).piece.weapon || 'Qsystem-unarmed';
}

Actor.getEquip = function(act){	//"":"" BUG
	return act.equip[act.combatContext.equip || 'normal'];
}

