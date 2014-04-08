//Actor
Actor = typeof Actor !== 'undefined' ? Actor : {};

Actor.remove = function(act){
	Activelist.remove(act);
	delete List.actor[act.id];
	delete List.all[act.id]
	Map.leave(act);
}

//{Combat
Actor.changeCombatContext = function(act,type){
	act.combatContext = type;
	Actor.updateEquip(act);

}

Actor.changeHp = function(act,amount){
	Actor.changeResource(act,{hp:amount});
}

Actor.changeResource = function(act,heal){
	for(var i in heal){
		if(typeof heal[i] === 'string'){ act[i] += heal[i].numberOnly()/100*act.resource[i].max;	}			
		else {	act[i] += heal[i];	}
		act[i] = Math.min(act[i],act.resource[i].max);
	}
}

Actor.getDef = function(act){
	var defratio = server ? Actor.getEquip(act).def : player.equip.def;
	var def = {
		main:act.globalDef,
		ratio:deepClone(defratio)
	};
	for(var i in def.ratio){
		def.ratio[i] *= act.mastery.def[i].mod * act.mastery.def[i].sum;
		def.ratio[i].mm(1);
	}
	return def;
}

//}

//{Player Command
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

//}

//{Update + Boost
Actor.update = {};
Actor.update.mastery = function(act){
	//Note: mod is applied in Combat.action.attack.mod.act
	var mas = act.mastery;
	for(var i in mas){
		for(var j in mas[i]){
			mas[i][j].sum = Math.pow(mas[i][j]['x'] * mas[i][j]['*'],mas[i][j]['^']) + mas[i][j]['+'];
		}
	}
}

Actor.update.permBoost = function(act){
	var pb = act.boost.list;
	
	//Reset to PermBase
	for(var i in pb){
		pb[i].base = pb[i].permBase;	
		pb[i].max = pb[i].permMax;
		pb[i].min = pb[i].permMin;
		pb[i].t = 1;
		pb[i].tt = 1;
		pb[i].p = 0;
		pb[i].pp = 0;
	}
	
	//Update Value
	for(var i in act.permBoost){	//i = Source (item)	
		for(var j in act.permBoost[i]){	//each indidual boost boost
			var b = act.permBoost[i][j];
			
			if(b.type === '+' || b.type === 'base'){pb[b.stat].p += b.value;}
			else if(b.type === '*'){pb[b.stat].t += b.value;}
			else if(b.type === '++'){pb[b.stat].pp += b.value;}
			else if(b.type === '**'){pb[b.stat].tt += b.value;}
			else if(b.type === 'min'){pb[b.stat].min = Math.max(pb[b.stat].min,b.value);}
			else if(b.type === 'max'){pb[b.stat].max = Math.min(pb[b.stat].max,b.value);}			
		}
	}
	
	//Max and min
	for(var i in pb){
		pb[i].base *= pb[i].t;
		pb[i].base += pb[i].p;
		pb[i].base *= pb[i].tt;
		pb[i].base += pb[i].pp;
	
		pb[i].base = Math.max(pb[i].base,pb[i].min);
		pb[i].base = Math.min(pb[i].base,pb[i].max);	
	}
	
	Actor.update.boost(act,'all');
	
	for(var j in act.customBoost){ 
		if(act.customBoost[j])
			Db.customBoost[j].func(act.boost,act.id);
	}	
}

Actor.update.boost = function(act,stat){
	if(!stat || stat === 'all'){ for(var i in act.boost.list) Actor.update.boost(act,i); return; }
	
	var stat = act.boost.list[stat];
	var sum = stat.base;
	
	for(var i in stat.name){
		var boost = stat.name[i];
		if(boost.type === '+') sum += boost.value;
		else if(boost.type === '*'){	sum += (boost.value-1)*stat.base; }
	}
	
	viaArray.set({'origin':act,'array':stat.stat,'value':sum});
}

Actor.boost = function(act, boost){	//boost: { 'stat':'globalDmg','value':1,'type':'*','time':100,'name':'weapon'}
	//Add a boost to a actor

	//list[i]: i = stat
	//toUpdate[i]: i = stat
	//fast[i]: i = stat@source
	
	if(Array.isArray(boost)){
		for(var i in boost) Actor.boost(act,boost[i]);
		return;
	}
	
	var b = deepClone(boost);
	if(typeof act === 'string'){ act = List.all[act]; }
	var name = b.name || 'Im dumb.';
	var id = b.stat + '@' + name;
	b.time = b.time || 1/0;
	b.timer = b.time;		//otherwise, cuz reference, boost cant be used twice cuz time = 0
	b.type = b.type || '+';
	
	b.spd = 'reg';
	if(b.time > 250){ b.spd = 'slow'; }
	if(b.time < 25){ b.spd = 'fast'; }
	
	act.boost[b.spd][b.stat + '@' + name] = b;
	act.boost.list[b.stat].name[name] = b;
	act.boost.toUpdate[b.stat] = 1;
	
}

Actor.boost.remove = function(act, boost){
	var stat = boost.stat;
	if(boost.name === 'curse') delete act.curseClient[stat];
	delete act.boost.list[stat].name[boost.name]
	delete boost; 
	Actor.update.boost(act,stat);
}
Actor.boost.removeByName = function(act, name){	//TOFIX		name: STAT@ID
	var a = name.split("@");
	var b = act.boost.list[a[0]];
	if(b && b.name[a[1]]){
		Actor.boost.remove(act,b.name[a[1]]);
	}
}
Actor.boost.removeAll = function(act){
	for(var i in act.boost.list)
		for(var j in act.boost.list[i].name)
			delete act.boost.list[i].name[j];
	act.curseClient = {};
	Actor.update.boost(act,'all');
}

Actor.permBoost = function(act,source,boost){
	//remove permBoost if boost undefined
	if(boost){
		act.permBoost[source] = arrayfy(boost);
	} else { delete act.permBoost[source]; }
	
	Actor.update.permBoost(act);
	Actor.update.mastery(act);
}

Actor.permBoost.stack = function(b){	//if boost same thing, add values
	var tmp = {};	var temp = [];
	
	for(var i in b){
		if(b[i].stat){
			var name = b[i].type + '--' + b[i].stat;
			if(tmp[name] === undefined){tmp[name] = {'type':b[i].type,'stat':b[i].stat,'value':0};}
			tmp[name].value += b[i].value;
		} else {
			tmp[b[i].value] = b[i];
		}
	}
	for(var i in tmp){temp.push(tmp[i]);}
	return temp;
}

//}

//{Map Interaction	
Actor.teleport = function(act,x,y,mapName){
	if(typeof x === 'object'){ Actor.teleport(act,x.x,x.y,x.mapName); return; }
	act = typeof act === 'string' ? List.all[act] : act;
	LOG(2,act.id,'teleport',x,y,mapName);
	
	//Teleport player. if no map specified, stay in same map.
	act.x = x;
	act.y = y;
	mapName = mapName || act.map;
	
	var map = Actor.teleport.getMapName(act,mapName);
	
	if(act.map === map){ 			//regular teleport
		Activelist.remove(act);
		return; 
	}
	
	if(!List.map[map]){	//test if need to create instance
		var model = map.split("@")[0];
		var version = map.split("@")[1];
		Map.creation(model,version); 
	}
	
	Map.leave(act);
	act.map = map;
	Map.enter(act);	
			
	Activelist.remove(act);

	Chat.add(act.id,"You enter " + List.map[act.map].name + '.');
}

Actor.teleport.getMapName = function(act,map){
	if(!map.have("@"))	return map + '@MAIN'; 				//main instance
	if(map.have("@@"))	return map + act.name; 				//alone instance
	if(map[map.length-1] === '@') return map + act.team;	//team instance
	return map;
}



Actor.teleport.join = function(act,mort2){
	if(mort2.map.have("@@")) return false;
	
	Actor.teleport(act,mort2.respawnLoc.recent.x,mort2.respawnLoc.recent.y,mort2.respawnLoc.recent.map);
	return true;
}

Actor.talk = function(act,enemyId){
	if(List.all[enemyId].dialogue){
		List.all[enemyId].dialogue.func(act.id);
	}
}

Actor.pushing = function(pusher,beingPushed){
	var act = List.all[beingPushed];
	if(!act.block || !act.block.pushable) return
	
	var pusherAngle = atan2(act.y - pusher.y,act.x - pusher.x);			//only work with square block
	var fact = 360/4;
	var angle = Math.floor((pusherAngle+fact/2)/fact)*fact%360;
	
	//Test if too far
		//Block
	var blockVarX = 0;	//only supported direction =4
	var blockVarY = 0;
	if(angle === 0) blockVarX = act.block.size[0];
	if(angle === 90) blockVarY = act.block.size[2];
	if(angle === 180) blockVarX = act.block.size[1];
	if(angle === 270) blockVarY = act.block.size[3];
	
	blockVarX *= 32;
	blockVarY *= 32;
	
		//Player
	var pusherVarX = 0;	//only supported direction =4
	var pusherVarY = 0;
	if(angle === 0) pusherVarX = act.bumperBox[0].x;
	if(angle === 90) pusherVarY = act.bumperBox[1].y;
	if(angle === 180) pusherVarX = act.bumperBox[2].x;
	if(angle === 270) pusherVarY = act.bumperBox[3].y;
	
	var posB = {'x':act.x + blockVarX,'y':act.y+blockVarY};
	var posP = {'x':pusher.x + pusherVarX,'y':pusher.y+pusherVarY};
	
	if(Collision.distancePtPt(posB,posP) > 64) return;	//toofar
	//
	
	act.pushed.time = act.block.time;
	act.pushed.magn = act.block.magn;
	act.pushed.angle = angle;
	
}


Actor.harvest = function(act,eid){	
	var e = List.all[eid];
	if(!e.skillPlot){ DEBUG(2,'trying to harvest not harvestable',eid); return; }
	var type = e.skillPlot.type;
	if(type === 'down'){
		Chat.add(act.id,'This plot is down. Completing the quest ' + Db.quest[e.skillPlot.quest].name + ' will revive this plot.');
		return;
	}
	var plot = Db.skillPlot[type];
	
	var key = act.id;
	var main = List.main[key]
	var inv = main.invList;
	var lvl = act.skill.lvl[plot.skill];
	
	if(Collision.distancePtPt(act,e) > 150){ Chat.add(key,"You're too far away."); return;}
	if(!Itemlist.empty(inv,1)){ Chat.add(key,"Your inventory is full."); return;}
	if(lvl < plot.lvl) {Chat.add(key,"You need at least level " + plot.lvl + ' ' + plot.skill.capitalize() + " to harvest this resource."); return;}
	if(Math.random() > plot.chance(lvl)) {Chat.add(key,"You failed to harvest this resource."); return;}
	
	var item = plot.item.random();
	Itemlist.add(inv,item,1);
	
	main.quest[e.skillPlot.quest].skillPlot[e.skillPlot.num] = 1;
	
	Chat.add(key,"You manage to harvest this resource.");
	
	LOG(2,key,'harvest',item);
}


Actor.setRespawn = function(act,wp){
	Chat.add(act.id,"You have changed your respawn point. Upon dying, you will now be teleported here.");

	act.respawnLoc.recent = {x:wp.x,y:wp.y,map:wp.map};
	if(wp.map.have('@MAIN')) act.respawnLoc.safe = {x:wp.x,y:wp.y,map:wp.map};
}

Actor.openChest = function(act,eid){	//need work
	var e = List.all[eid];
	
	if(Collision.distancePtPt(act,e) > 100){ Chat.add(act.id,"You're too far away."); return;}
	
	if(!e.chest) return;
	if(e.chest.list.have(act.id)){
		Chat.add(act.id,"You have already opened that chest.");
		return;
	}
	Chat.add(act.id,"You opened the chest.");
		
	if(e.chest.func(act.id) !== false){
		Sprite.change(e,{'initAnim':'on'});
		e.chest.list.push(act.id);
	};
	LOG(2,act.id,'openChest',eid);
}

Actor.activateSwitch = function(act,eid){
	var e = List.all[eid];
	
	if(Collision.distancePtPt(act,e) > 100){ Chat.add(act.id,"You're too far away."); return;}
	
	var sw = e.switch;
	if(!sw) return;
	var oldstate = sw.state;
	sw.state = sw.state === 'off' ? 'on' : 'off';
	
	if(sw[sw.state]) sw[sw.state](act.id,e,List.map[e.map]);
	
	Sprite.change(e,{'initAnim':sw.state});
	Chat.add(act.id,"You turned the switch " + sw.state + '.');
		
	if(!sw[oldstate]){
		Actor.removeOption(e,'Pull Switch');
	}


}

Actor.removeOnClick = function(act,side){
	for(var i in act.optionList.option){
		if(act.optionList.option[i] === act.onclick[side]){
			act.optionList.option.splice(i,1);
			delete act.onclick[side];
			return;
		}
	}
}	

Actor.removeOption = function(act,option){	//option is object or name
	for(var i in act.optionList.option){
		if(act.optionList.option[i] === option || act.optionList.option[i].name === option){
			act.optionList.option.splice(i,1);
			return;
		}
	}
}	

Actor.pickDrop = function (act,id){
	var inv = List.main[act.id].invList;
	var drop = List.drop[id];
		
	if(!drop) return;
	
	if(!Collision.distancePtPt(act,drop) > act.pickRadius){
		Chat.add(act.id,"You're too far away.");
		return;
	}

	if(!Itemlist.test(inv,[[List.drop[id].item,List.drop[id].amount]])){
		Chat.add(act.id,"Inventory full.");
		return;
	}
	
	Itemlist.add(inv,drop.item,drop.amount);
	Drop.remove(drop);		
	
	
	LOG(1,act.id,'pickDrop',drop);
}

Actor.rightClickDrop = function(act,rect){
	var key = act.id;
	var ol = {'name':'Pick Items','option':[]};
	for(var i in List.drop){
		var d = List.drop[i];
		if(d.map == List.all[key].map && Collision.RectRect(rect,[d.x,d.x+32,d.y,d.y+32]) ){
			ol.option.push({'name':'Pick ' + Db.item[List.drop[i].item].name,'func':'Actor.pickDrop','param':[i]});
		}
	}
	
	if(ol.option)	Button.optionList(key,ol);  
}
	
Actor.dropInv = function(act,id){
	var inv = List.main[act.id].invList;
	var amount = Math.min(1,Itemlist.have(inv,id,0,'amount'));
	
	if(!amount) return;
	
	Drop.creation({'x':act.x,'y':act.y,'map':act.map,'item':id,'amount':amount,'timer':25*30});
	Itemlist.remove(inv,id,amount);
	
	LOG(1,act.id,'dropInv',id,amount);
}




//}

//{Ability
Actor.removeAbility = function(act,name){
	delete Actor.getAbilityList(act)[name];
	var ab = Actor.getAbility(act);
	for(var i in ab){
		if(ab[i] && ab[i].id === name){
			ab[i] = null;
		}
	}
	LOG(1,act.id,'removeAbility',name);
}

Actor.swapAbility = function(act,name,position){
	
	/*
	if(act.type === 'player'){
		if(abPos === 4 && act.abilityList[abListPost].type !== 'heal'){Chat.add(act.id,'This ability slot can only support Healing abilities.'); return;}	
		if(abPos === 5 && act.abilityList[abListPost].type !== 'dodge'){Chat.add(act.id,'This ability slot can only support Dodge abilities.'); return;}	
	}
	*/
	if(act.type === 'player' && !Actor.getAbilityList(act)[name]) return; 		//dont have access to this ability
	var ability = Ability.uncompress(name);
	
	var ab = Actor.getAbility(act);
	ab[position] = ability;
	act.abilityChange = Actor.template.abilityChange();
	for(var i in ab){ 
		if(ab[i])		act.abilityChange.charge[ab[i].id] = 0;
	}

}

Actor.learnAbility = function(act,name){
	if(!Db.ability[name]) return;
	Chat.add(act.id,"You have learnt a new ability: \"" + Db.ability[name].name + '".');
	Actor.getAbilityList(act)[name] = 1;
	LOG(1,act.id,'learnAbility',name);
}

Actor.useAbilityPlan = function(act,name){
	Actor.learnAbility(act,name);
	Itemlist.remove(List.main[act.id].invList,name,1);
}

Actor.examineAbility = function(act){}
//}

//{Death
Actor.death = function(act){	
	if(act.type === 'enemy') Actor.death.enemy(act);
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

Actor.death.enemy = function(act){
	act.dead = 1;
	
	/*
	var killers = Actor.death.getKiller(act);
	Actor.death.drop(act,killers);
	Actor.death.exp(act,killers);
	*/
	//if(act.deathFunc)	for(var i in killers) act.deathFunc(killers[i],act,act.map) //custom death function (ex quest)
	if(act.deathFunc){	
		for(var i in act.damagedBy){
			if(List.all[i]) act.deathFunc(i,act,act.map) 
		}
	}
		
		//custom death function (ex quest)
	if(act.deathFuncArray) act.deathFuncAll(killers,act,act.map)
	
	Actor.death.performAbility(act);				//custom death ability function
	Activelist.remove(act);
}

Actor.death.performAbility = function(act){	//HERE
	for(var i in act.deathAbility){
		Actor.performAbility(act,Actor.getAbility(act)[act.deathAbility[i]],false,false);
	}
}

Actor.death.getKiller = function(act){
	for(var i in act.damagedBy) if(!List.all[i]) delete act.damagedBy[i];
	
	var tmp = Object.keys(act.damagedBy);	
	if(!tmp.length) return [];
	if(tmp.length === 1) return tmp;
	
	var killer = null; var max = -1;
	for(var i in act.damagedBy){
		if(act.damagedBy[i] > max){
			killer = i;
		} 
	}
	return tmp.splice(tmp.indexOf(killer),1).unshift(killer);	//place main killer in [0]
}

Actor.death.drop = function(act,killers){
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

Actor.death.exp = function(act,killers){
	for(var i in killers){
		var killer = List.all[killers[i]];
		if(!killer) continue;
		var equip = Db.equip[killer.weapon];
		if(!equip) continue;
		var style = equip.piece;
		Skill.addExp(killers[i],style,act.deathExp);
	}
}
//}

Actor.respawn = {};

Actor.respawn.player = function(act){
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


Actor.getAbility = function(act){
	return act.ability[act.combatContext];
}

Actor.getAbilityList = function(act){
	return act.abilityList[act.combatContext];
}
Actor.getEquip = function(act){
	return act.equip[act.combatContext || 'regular'];
}
//ts("p.combatContext = 'regular'")



