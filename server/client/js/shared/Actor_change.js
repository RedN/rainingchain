//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Boss','Map','Main','Debug','Socket','Quest','Message','Actor','Send','Stat','OptionList','Sprite','ActorModel']));

Actor.doInitPack = function(act){
	if(act.nevercombat){
		return [
			'npc0',
			Math.round(act.x),			//1
			Math.round(act.y),
			Math.round(act.angle),		//3
			act.sprite.name,
			act.sprite.sizeMod || 1,	//5
			Math.round(act.maxSpd),
			act.context,				//7
			act.minimapIcon||'',
			act.optionList				//9
		];	
	}
	
	return [
		act.type,	//npc or player
		Math.round(act.x),				//1
		Math.round(act.y),
		Math.round(act.angle),			//3
		act.sprite.name,
		act.sprite.sizeMod || 1,		//5
		Math.round(act.maxSpd),
		act.context,					//7
		act.minimapIcon||'',			
		act.optionList,					//9	
		Math.round(act.hp),				
		Math.round(act.hpMax),			//11	
		act.weakness.resist||'',		
		act.weakness.weak||'',			//13		
	];
}

Actor.undoInitPack = function(draw,id){

	var act = {};
	act.id = id;
	act.x = draw[1];
	act.y = draw[2];
	act.serverX = draw[1];
	act.serverY = draw[2];
	act.angle = draw[3];
	act.sprite = Sprite(draw[4],draw[5]);
	act.maxSpd = draw[6];
	act.context = draw[7];
	act.minimapIcon = draw[8];
	act.optionList = Actor.undoInitPack.generateOptionList(act,draw[9]);
			
	if(draw[0] === 'npc0'){
		act.type = 'npc';
		act.preventAbility = true;
		act.hp = 1;
		act.hpMax = 1;
		act.combat = 0;
	} else {
		act.type = draw[0];
		act.preventAbility = false;
		act.hp = draw[10];
		act.hpMax = draw[11];
		act.weakness = Actor.Weakness(draw[12],draw[13]);
		act.context = Actor.undoInitPack.generateContext(act);
				
		act.combat = 1;
	}
		
	act.toRemove = 0;
	act.spd = 0;
	act.spdX = 0;
	act.spdY = 0;
	Sprite.updateBumper(act);	//bad, idk if needed
	

	return act;
}

Actor.undoInitPack.generateContext = function(act){	//use weakness	//BAD...
	if(!act.weakness.weak || (!act.weakness.weak && !act.weakness.resist)) return act.context;
		
		
	var span = $('<span>')
		.html(act.context + '<br>');
	if(act.weakness.weak){
		span.append("Weak: ");
		span.append($('<span>')
			.html(act.weakness.weak.capitalize())
			.css({color:CST.element.toColor[act.weakness.weak]})
			.addClass('shadow')
		);
		if(act.weakness.resist) span.append(' - ');
	}
	if(act.weakness.resist){
		span.append("Resist: ");
		span.append($('<span>')
			.html(act.weakness.resist.capitalize())
			.css({color:CST.element.toColor[act.weakness.resist]})
			.addClass('shadow')
		);
	}
	
	return span.html();
}

Actor.undoInitPack.generateOptionList = function(act,optionList){	//recreate optionList, atm no func but gonna add func so send info to server when click
	return OptionList.uncompressClient(optionList,'actorOptionList',act.id);
}



//#############
Actor.setChangeAll = function(){
	var frame = Actor.testInterval.get();

	for(var i in Actor.LIST){	
		var act = Actor.LIST[i];
		Actor.setChange(act,frame);
	}
}
	
Actor.setChange = function(act,frame,force){
	if(!act.active && !force) return;
	if(Actor.isPlayer(act)){
		Actor.setChange.player(act,frame);
		Actor.setPrivChange(act,frame);
		act.privateChange = Actor.compressXYA(act.privateChange);
	} else {
		Actor.setChange.npc(act,frame);
	}
	act.change = Actor.compressXYA(act.change);
}

Actor.setChange.npc = function(act,frame){
	if(!act.nevermove){
		if(frame % 2 === 0){
			var x = Math.floor(act.x);	if(act.old.x !== x) act.change.x = act.old.x = x; 
			var y = Math.floor(act.y);	if(act.old.y !== y) act.change.y = act.old.y = y;
			
			if(act['spriteFilter']){ act.change['spriteFilter'] = act['spriteFilter']; act['spriteFilter'] = null; }	//BAD
		}
		if(frame % 4 === 0){
			var angle = Math.floor(act.angle/15)*15+1;	if(act.old.a !== angle) act.change.a = act.old.a = angle;
		}
	}
	if(!act.nevercombat){
		if(frame % 6 === 0){
			var hp = Math.floor(act.hp);	if(act.old.hp !== hp) act.change.hp = act.old.hp = hp;
			if(act.old.statusClient !== act.statusClient) act.change.statusClient = act.old.statusClient = act.statusClient;
			if(act.flag.curseClient){ act.flag.curseClient = 0; act.change.curseClient = act.curseClient; }
		}
		if(frame % 24 === 0){
			var x = Math.floor(act.hpMax);	if(act.old['hpMax'] !== x) act.change['hpMax'] = act.old['hpMax'] = x; 
			if(act.old['combat'] !== act.combat) act.change['combat'] = act.old['combat'] = act.combat; 
		}
	}
	
	if(frame % 6 === 0){
		if(act['sprite']['anim']){ act.change['sa'] = act['sprite']['anim']; act['sprite']['anim'] = ''; }
	}
	
	if(frame % 24 === 0){
		if(act.old['sprite,name'] !== act.sprite.name) act.change['sprite,name'] = act.old['sprite,name'] = act.sprite.name; 
		if(act.old['sprite,sizeMod'] !== act.sprite.sizeMod) act.change['sprite,sizeMod'] = act.old['sprite,sizeMod'] = act.sprite.sizeMod;
	}	
}

Actor.setChange.player = function(act,frame){	//BOB
	if(frame % 2 === 0){
		var x = Math.floor(act.x);	if(act.old.x !== x) act.change.x = act.old.x = x; 
		var y = Math.floor(act.y);	if(act.old.y !== y) act.change.y = act.old.y = y;
		
		if(act['spriteFilter']){ act.change['spriteFilter'] = act['spriteFilter']; act['spriteFilter'] = null; }	//BAD
	}
	if(frame % 4 === 0){
		var angle = Math.floor(act.angle);	if(act.old.a !== angle) act.change.a = act.old.a = angle;	//
	}
	if(frame % 6 === 0){
		//var x = Math.floor((Math.abs(act.spdX)+Math.abs(act.spdY))/2);	if(act.old.spd !== x) act.change.spd = act.old.spd = x;
		
		var hp = Math.floor(act.hp);	if(act.old.hp !== hp) act.change.hp = act.old.hp = hp;
		if(act.old.statusClient !== act.statusClient) act.change.statusClient = act.old.statusClient = act.statusClient;
		
		if(act['sprite']['anim']){ act.change['sa'] = act['sprite']['anim']; act['sprite']['anim'] = ''; }
		if(act['chatHead']){ act.change['chatHead'] = act['chatHead']; act['chatHead'] = null; }
	}
	if(frame % 24 === 0){
		var x = Math.floor(act.hpMax);	if(act.old['hpMax'] !== x) act.change['hpMax'] = act.old['hpMax'] = x; 
		if(act.old['sprite,name'] !== act.sprite.name) act.change['sprite,name'] = act.old['sprite,name'] = act.sprite.name; 
		if(act.old['sprite,sizeMod'] !== act.sprite.sizeMod) act.change['sprite,sizeMod'] = act.old['sprite,sizeMod'] = act.sprite.sizeMod;
		if(act.old['combat'] !== act.combat) act.change['combat'] = act.old['combat'] = act.combat; 
	}	
}

Actor.setPrivChange = function(act,frame){
	for(var i in act.change)	//needed cuz never empty otherwise
		act.privateChange[i] = act.change[i];	

	if(frame % 8 === 0 && Actor.initFlag(act)){
		act.privateChange.flag = act.flag;
		Actor.resetFlag(act);
	}
	
	if(frame % 2 === 0){	//map need to be as fast as x,y for fadeout
		if(act.privateOld.map !== act.map){ act.privateOld.map = act.map; act.privateChange.map = Actor.Map.compressClient(act.map,act); }			  
	}
	if(frame % 6 === 0){
		var chg = act.privateChange;	//means other loop and this one needs to be sync.
		var old = act.privateOld;

		var mana = Math.floor(act.mana);	if(old.mana !== mana) chg.mana = old.mana = mana; 
		if(old['ac'] !== act.abilityChange.chargeClient) chg['ac'] = old['ac'] = act.abilityChange.chargeClient;
	}
	if(frame % 24 === 0){
		var x = Math.floor(act.manaMax);	if(act.old['manaMax'] !== x) act.change['manaMax'] = act.old['manaMax'] = x; 
	}
}

Actor.Flag = function(){
	return {}
}

Actor.setFlag = function(act,what){
	act.flag[what] = 1;
}

Actor.initFlag = function(act){	//return true if not empty
	for(var what in act.flag){
		if(what === 'curseClient') act.flag[what] = act.curseClient;		//must be first cuz public and npc
		else if(what === 'spriteFilter') act.flag[what] = act.spriteFilter;
		else if(what === 'permBoost') act.flag[what] = act.permBoost;
		else if(what === 'equip')	act.flag[what] = Actor.Equip.compressClient(act.equip,act);
		else if(what === 'questMarker') act.flag[what] = act.questMarker;
		else if(what === 'ability') act.flag[what] = Actor.Ability.compressClient(act.ability,act);
		else if(what === 'abilityList')	act.flag[what] = Actor.AbilityList.compressClient(act.abilityList,act);
		else if(what === 'skill') act.flag[what] = act.skill;
	}
	for(var i in act.flag) return true;
	return false;
}

Actor.resetFlag = function(act){	//only called if was not empty, so no point in tracking if toReset
	act.flag = {};
}

Actor.resetChangeForAll = function(){
	for(var i in Actor.LIST){ 
		var act = Actor.get(i);
		act.change = {};
		if(Actor.isPlayer(act)){
			act.privateChange = {}; 	
			act.removeList = {};
		}
	}
}


//#############

Actor.uncompressChange = function(change){
	if(change.flag){
		for(var i in change.flag){
			change[i] = change.flag[i];
		}
		delete change.flag;
	}
	
	change = Actor.uncompressXYA(change);
	change = Actor.uncompressChange.chargeClient(change);
	change = Actor.uncompressChange.serverXY(change);
	
	
	if(change.ability) change.ability = Actor.Ability.uncompressClient(change.ability);
	if(change.equip) change.equip = Actor.Equip.uncompressClient(change.equip);
	if(change.abilityList) change.abilityList = Actor.AbilityList.uncompressClient(change.abilityList);
	
	if(change.sa){ change['sprite,action'] = change.sa; delete change.sa; }
	if(change.skill){
		Dialog.open('expPopup',change.skill.exp - Actor.getExp(player))
	}
	
	return change;
}

Actor.uncompressChange.chargeClient = function(p){	//could be used when needed instead of all the time
	if(typeof p['ac'] === 'string'){
		var charge = p['ac'];
		var tmp = [0,0,0,0,0,0];
		for(var i = 0 ; i < charge.length ; i++){ 
			tmp[i] = charge[i] === 'R' ? 1 : parseInt(charge[i],36)/36;
		}
		p['abilityChange,chargeClient'] = tmp;
		delete p.ac
	}
	return p;
}

Actor.uncompressChange.serverXY = function(c){
	if(c.x){
		c.serverX = c.x; 
		delete c.x;
	}
	if(c.y){
		c.serverY = c.y; 
		delete c.y;
	}
	return c;
}

Actor.compressXYA = function(change){
	//if only change is x,y and angle, compress it into [x,y,angle]
	if(change.x !== undefined && change.y !== undefined){ 
		if(change.a !== undefined){
			if(Object.keys(change).length === 3){ return [change.x,change.y,change.a];}
			else { change.xya = [change.x,change.y,change.a]; }
		} else {
			if(Object.keys(change).length === 2){ return [change.x,change.y];}
			else { change.xy = [change.x,change.y]; }
		}
		
		delete change.x;
		delete change.y;
		delete change.a;	
	}
	return change;
}

Actor.uncompressXYA = function(info){
	if(info[0] && info.length === 3) 
		return {x:info[0],y:info[1],angle:info[2]};
	if(info[0] && info.length === 2) 
		return {x:info[0],y:info[1]};
	if(info.xya){ 
		info.x = info.xya[0]; info.y = info.xya[1]; info.angle = info.xya[2]; 
		delete info.xya;
		return info;
	}
	if(info.xy){ 
		info.x = info.xy[0]; info.y = info.xy[1]; 
		delete info.xy 
		return info;
	}
	if(info.a){ 
		info.angle = info.a; 
		delete info.a; 
	}
	
	return info;
}

Actor.applyChange = function(act,change){
	if(!change) return;
	change = Actor.uncompressChange(change);
	
	for(var j in change)
		Tk.viaArray.set({'origin':act,'array':j.split(','),'value':change[j]});	
}

Actor.getSignInPack = function(act){	//for player sign in
	return {
		name:act.name,
		id:act.id,
		x:act.x,
		y:act.y,
		map:Actor.Map.compressClient(act.map,act),
		equip:Actor.Equip.compressClient(act.equip,act),
		ability:Actor.Ability.compressClient(act.ability,act),
		abilityList:Actor.AbilityList.compressClient(act.abilityList,act),
		skill:act.skill,
		permBoost:act.permBoost,
		'sprite,name':act.sprite.name,	//bad... should compress and uncompress
	};
}

Actor.compressDb = function(act){
	var tmp = {
		ability:Actor.Ability.compressDb(act.ability),
		abilityList:Actor.AbilityList.compressDb(act.abilityList),
		equip:Actor.Equip.compressDb(act.equip),
		respawnLoc:Actor.RespawnLoc.compressDb(act.respawnLoc),
		//
		username:act.username,
		name:act.name,
		skill:act.skill,
	}
	return tmp;
}

Actor.uncompressDb = function(act,key){
	try {
		act.equip = Actor.Equip.uncompressDb(act.equip);
		act.ability = Actor.Ability.uncompressDb(act.ability);
		act.abilityList = Actor.AbilityList.uncompressDb(act.abilityList);
		act.abilityChange = Actor.AbilityChange(act.ability.normal);	//bad...
		act.respawnLoc = Actor.RespawnLoc.uncompressDb(act.respawnLoc);
		
		act.skill = act.skill;	//kinda dumb but we
		act.context = act.name;
		act.id = key;

		return act;
	} catch(err){ 
		ERROR.err(3,err,'error with uncompress Db');
		return null;
	}
}

