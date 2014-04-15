Actor.updateEquip = function(act,updateboosttoo){
	var equip = Actor.getEquip(act);

	for(var k in Cst.element.list){	//Each Element
		var i = Cst.element.list[k];
		var sum = 0;
		for(var j in equip.piece){	//Each Piece
			var eq = Db.equip[equip.piece[j]];
			if(!eq) continue;
			sum += eq.def.main * eq.def.ratio[i] * eq.orb.upgrade.bonus;
		}
		equip.def[i] = sum || 1;
	}
	
	if(updateboosttoo === false) return;
	
	for(var i in equip.piece){
		if(!Cst.isArmor(i)) continue;
		var dbequip = Db.equip[equip.piece[i]];
		if(dbequip) Actor.permBoost(act,'armor' + i,dbequip.boost);		//have something
		else Actor.permBoost(act,'armor' + i);							//have nothing so reset
	}
	Actor.permBoost(act,'weapon',Db.equip[act.weapon].boost);
	
	
}

Actor.switchEquip = function(act,name,piece){
	//the player can have nothing in the equip.piece[i]
	//however, he must have something in the player.weapon
	//if equip.piece[weapon] is '', player.weapon becomes 'unarmed'
	
	var equip = Db.equip[name];
	if(equip && !Actor.switchEquip.req(act,equip)){
		Chat.add(act.id,'You need have the level to wear this equip.');
	}
	equip = equip || '';	//incase wants to be unarmed
	
	piece = piece || equip.piece;		//piece is defined when changing to unarmed
	
	var aequip = Actor.getEquip(act);
	var old = aequip.piece[piece];	//get old
	aequip.piece[piece] = name;		//set new
	
	
	
	var inv = List.main[act.id].invList;
	if(equip) Itemlist.remove(inv,name);		//remove equipped item from inv if equip isnt unarmed
	if(old) Itemlist.add(inv,old);				//add old item if it wasnt unarmed
	
	if(Cst.isWeapon(piece)){
		Actor.swapWeapon(act,piece);
	}
	
	Actor.updateEquip(act);	//update def
}

Actor.switchEquip.req = function(act,equip){
	for(var i in equip.req){
		if(act.skill.lvl[i] < equip.req[i]) return false;
	}
	return true;
}

Actor.swapWeapon = function(act,piece){
	//Equip a weapon already present in the weaponList
	act.weapon = Actor.getEquip(act).piece[piece] || 'unarmed';
	
	var equip = Db.equip[act.weapon];
	Sprite.change(act,equip.sprite);
}

Actor.getEquip = function(act){
	return act.equip[act.combatContext || 'regular'];
}

