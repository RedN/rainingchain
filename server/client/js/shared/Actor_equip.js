//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Message','Equip','Combat','ItemList','Quest','Main']));

(function(){ //}

Actor.Equip = function(normal,quest){
	return {
		normal:normal || Actor.Equip.part(),
		quest:quest || Actor.Equip.part(),
	}
};

Actor.Equip.part = function(weapon,amulet,ring,helm,body){
	var equip = {
		piece:{helm:helm||'',amulet:amulet || '',ring:ring||'',body:body||'',weapon:weapon || ''},
		def:CST.element.template(1),
		dmg:CST.element.template(1),
	}
	//Actor.equip.updateDef(equip);	//bad... if do that, called for npc and npc has 0.5 def...
	return equip;
}

Actor.Equip.compressDb = function(equip){
	var tmp = [];
	for(var i in CST.equip.piece) tmp.push(equip.normal.piece[CST.equip.piece[i]]);
	return tmp;
}

Actor.Equip.uncompressDb = function(equip){
	var equip = Actor.Equip(Actor.Equip.part.apply(this,equip),null);
	if(!Actor.Equip.testIntegrity(equip)) return Actor.Equip.fixIntegrity(equip);
	return equip;
	//Message.add(key,'Sorry, we can\'t find the data about one or multiples equips you own... :('); 
	
}

Actor.Equip.compressClient = function(equip,act){
	return Actor.getEquip(act);
}

Actor.Equip.uncompressClient = function(equip){
	return Actor.Equip(equip);
}

Actor.Equip.testIntegrity = function(equip){
	return Actor.Equip.fixIntegrity(equip,true);
}

Actor.Equip.fixIntegrity = function(equip,isOnlyTesting){
	for(var j in equip){
		for(var i in equip[j].piece){
			if(equip[j].piece[i] && !Equip.get(equip[j].piece[i])){
				if(isOnlyTesting) return false;
				ERROR(2,'cant find equip',equip[j].piece[i]);
				equip[j].piece[i] = '';
			}
		}
	}
	if(isOnlyTesting) return true;
	return equip;	
}


//#######################



Actor.equip = {};

Actor.equip.click = function(act,eid){	//called when clicking in inventory
	var equip = Equip.get(eid);
	if(!equip) return ERROR(3,'equip dont exist',eid);
	
	if(act.combatContext.equip === 'quest' && Actor.getMain(act).questActive !== equip.quest)
		return Message.add(act.id,"You can only use equips you received from the quest you're doing.");
	
	Actor.changeEquip(act,eid);
}

Actor.changeEquip = function(act,eid){
	var equip = Equip.get(eid);
	if(!equip) return ERROR(3,'equip dont exist',eid);
	Actor.removeEquip(act,equip.piece,true);
	//##
	Actor.getEquip(act).piece[equip.piece] = equip.id;
	Main.removeItem(Actor.getMain(act),equip.id);
	Actor.equip.update(act);
}

Actor.removeEquip = function(act,piece){
	var equip = Actor.getEquip(act);
	var old = equip.piece[piece];
	if(old) //add old item if it wasnt empty
		Main.addItem(Actor.getMain(act),old);
	equip.piece[piece] = '';
	Actor.equip.update(act);
	return old;
}
Actor.haveEquip = function(act,eid){
	var equip = Actor.getEquip(act);
	for(var i in equip.piece)
		if(equip.piece[i] === eid)
			return true;
	return false;
}
Actor.getEquip = function(act){
	return act.equip[act.combatContext.equip || 'normal'];
}

Actor.equip.update = function(act){	//accept act or equip directly
	if(act.type !== 'player') return;
	var equip = Actor.getEquip(act);
	
	Actor.equip.updateDef(equip);

	//Boost
	for(var i in equip.piece){
		if(!equip.piece[i]) continue;	//no equip on that slot
		var eq = Equip.get(equip.piece[i]);
		if(eq) Actor.permBoost(act,'equip-' + i,eq.boost);		//have something
		else Actor.permBoost(act,'equip-' + i);					//have nothing so reset
	}
	Actor.setFlag(act,'equip');
}

Actor.equip.updateDef = function(equip){
	for(var i in equip.def){	//Each Element
		var sum = 0;
		for(var j in equip.piece){	//Each Piece
			if(!equip.piece[j]) continue;	//no equip on that slot
			var eq = Equip.get(equip.piece[j]);
			if(!eq){ ERROR(3,'no equip',equip.piece[j]); continue; }
			sum += eq.def.main * eq.def.ratio[i];
		}
		equip.def[i] = Math.max(sum,Combat.MIN_EQUIP_DEF);
	}
}

Actor.getWeapon = function(act){
	return Actor.getEquip(act).piece.equip || CST.UNARMED;
}

})();

