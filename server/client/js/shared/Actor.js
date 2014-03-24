//Actor
Actor = typeof Actor !== 'undefined' ? Actor : {};

Actor.remove = function(mort){
	ActiveList.remove(mort);
	delete List.actor[mort.id];
	delete List.all[mort.id]
	if(List.map[mort.map])	delete List.map[mort.map].list[mort.id];
}

//{Combat
Actor.changeHp = function(mort,amount){
    Actor.changeResource(mort,{hp:amount});
}

Actor.changeResource = function(mort,heal){
	for(var i in heal){
		if(typeof heal[i] === 'string'){ mort[i] += heal[i].numberOnly()/100*mort.resource[i].max;	}			
		else {	mort[i] += heal[i];	}
		mort[i] = Math.min(mort[i],mort.resource[i].max);
	}
}

Actor.getDef = function(mort){
	var def = {
		main:mort.globalDef,
		ratio:deepClone(mort.equip.def)
	};
	for(var i in def.ratio){
		def.ratio[i] *= mort.mastery.def[i].mod * mort.mastery.def[i].sum;
		def.ratio[i].mm(1);
	}
	return def;
}

//}

//{Player Command
Actor.updateEquip = function(mort){
	for(var k in Cst.element.list){	//Each Element
		var i = Cst.element.list[k];
		var sum = 0;
		for(var j in mort.equip.piece){	//Each Piece
			var equip = Db.equip[mort.equip.piece[j]];
			if(!equip) continue;
			sum += equip.def.main * equip.def.ratio[i] * equip.orb.upgrade.bonus;
		}
		mort.equip.def[i] = sum || 1;
	}
}

Actor.switchEquip = function(mort,name,piece){
	//the player can have nothing in the equip.piece[i]
	//however, he must have something in the player.weapon
	//if equip.piece[weapon] is '', player.weapon becomes 'unarmed'
	
	var equip = Db.equip[name];
	if(equip && !Actor.switchEquip.req(mort,equip)){
		Chat.add(mort.id,'You need have the level to wear this equip.');
	}
	equip = equip || '';	//incase wants to be unarmed
	
	piece = piece || equip.piece;		//piece is defined when changing to unarmed
	var old = mort.equip.piece[piece];	//get old
	mort.equip.piece[piece] = name;		//set new
	
	if(Cst.isArmor(piece))		//if armor, add boost
		Actor.permBoost(mort,piece,equip.boost);

	Actor.updateEquip(mort);	//update def
	
	
	var inv = List.main[mort.id].invList;
	if(equip) Itemlist.remove(inv,name);		//remove equipped item from inv if equip isnt unarmed
	if(old) Itemlist.add(inv,old);				//add old item if it wasnt unarmed
	
	if(Cst.isWeapon(piece)){
		Actor.swapWeapon(mort,piece);
	}
}

Actor.switchEquip.req = function(mort,equip){
	for(var i in equip.req){
		if(mort.skill.lvl[i] < equip.req[i]) return false;
	}
	return true;
}

Actor.swapWeapon = function(mort,piece){
	//Equip a weapon already present in the weaponList
	mort.weapon = mort.equip.piece[piece] || 'unarmed';
	
	var equip = Db.equip[mort.weapon];
	Sprite.change(mort,equip.sprite);
	Actor.permBoost(mort,'weapon',equip.boost);
}

//}

//{Update
Actor.update = {};
Actor.update.mastery = function(mort){
	//Note: mod is applied in Combat.action.attack.mod.mort
	var mas = mort.mastery;
	for(var i in mas){
		for(var j in mas[i]){
			mas[i][j].sum = Math.pow(mas[i][j]['x'] * mas[i][j]['*'],mas[i][j]['^']) + mas[i][j]['+'];
		}
	}
}

Actor.update.permBoost = function(mort){
	var pb = mort.boost;
	
	//Reset to PermBase
	pb.custom = [];
	for(var i in pb.list){
		pb.list[i].base = pb.list[i].permBase;	
		pb.list[i].max = pb.list[i].permMax;
		pb.list[i].min = pb.list[i].permMin;
		pb.list[i].t = 1;
		pb.list[i].tt = 1;
		pb.list[i].p = 0;
		pb.list[i].pp = 0;
	}
	
	//Update Value
	for(var i in mort.permBoost){	//i = Source (item)	
		for(var j in mort.permBoost[i]){	//each indidual boost boost
			var b = mort.permBoost[i][j];
			
			if(b.type === '+' || b.type === 'base'){pb.list[b.stat].p += b.value;}
			else if(b.type === '*'){pb.list[b.stat].t += b.value;}
			else if(b.type === '++'){pb.list[b.stat].pp += b.value;}
			else if(b.type === '**'){pb.list[b.stat].tt += b.value;}
			else if(b.type === 'min'){pb.list[b.stat].min = Math.max(pb.list[b.stat].min,b.value);}
			else if(b.type === 'max'){pb.list[b.stat].max = Math.min(pb.list[b.stat].max,b.value);}
			else if(b.type === 'custom'){ pb.custom[b.value] = 1; }
			
		}
	}
	
	//Max and min
	for(var i in pb.list){
		pb.list[i].base *= pb.list[i].t;
		pb.list[i].base += pb.list[i].p;
		pb.list[i].base *= pb.list[i].tt;
		pb.list[i].base += pb.list[i].pp;
	
		pb.list[i].base = Math.max(pb.list[i].base,pb.list[i].min);
		pb.list[i].base = Math.min(pb.list[i].base,pb.list[i].max);	
	}
	
	for(var j in pb.custom){ Db.customBoost[j].function(pb,mort.id);}
	
	Actor.update.boost(mort,'all');
}

Actor.update.boost = function(mort,stat){
	if(stat === 'all'){ for(var i in mort.boost.list) Actor.update.boost(mort,i); return; }
	
	
	var stat = mort.boost.list[stat];
	viaArray.set({'origin':mort,'array':stat.stat,'value':stat.base});
	for(var i in stat.name){
		var boost = stat.name[i];
				
		if(boost.type === '+'){	viaArray.add({'origin':mort,'array':stat.stat,'value':boost.value}); }
		else if(boost.type === '*'){	viaArray.add({'origin':mort,'array':stat.stat,'value':(boost.value-1)*stat.base}); }
	}
}

Actor.boost = function(mort, boost){
	//Add a boost to a actor

	//list[i]: i = stat
	//toUpdate[i]: i = stat
	//fast[i]: i = stat@source

	// {stat:'globalDmg',value:1000,type:'*',time:10000,name:'quest'}

	//format: boost { 'stat':'globalDmg','value':1,'type':'*','time':100,'name':'weapon'}
	boost = arrayfy(boost);
	for(var i in boost){ 
		var b = boost[i];
		if(typeof mort === 'string'){ mort = List.all[mort]; }
		var name = b.name || 'Im dumb.';
		var id = b.stat + '@' + name;
		b.time = b.time || 1/0;
		b.timer = b.time;		//otherwise, cuz reference, boost cant be used twice cuz time = 0
		b.type = b.type || '+';
		
		b.spd = 'reg';
		if(b.time > 250){ b.spd = 'slow'; }
		if(b.time < 25){ b.spd = 'fast'; }
		
		mort.boost[b.spd][b.stat + '@' + name] = b;
		mort.boost.list[b.stat].name[name] = b;
		mort.boost.toUpdate[b.stat] = 1;
	}
	
}

Actor.permBoost = function(mort,source,boost){
	//remove permBoost with boost undefined
	if(boost){
		mort.permBoost[source] = arrayfy(boost);
	} else { delete mort.permBoost[source]; }
	
	Actor.update.permBoost(mort);
	Actor.update.mastery(mort);
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
Actor.teleport = function(mort,x,y,map){
	mort = typeof mort === 'string' ? List.all[mort] : mort;
	LOG(2,mort.id,'teleport',x,y,map);
	
	//Teleport player. if no map specified, stay in same map.
	mort.x = x;
	mort.y = y;
	
	if(!map){ //regular teleport
		ActiveList.remove(mort);
		return; 
	}		
	
	if(!map.have("@"))	map += '@MAIN'; 			//main instance
	if(map[map.length-1] === '@') map += mort.team;	//team instance
	if(map.have("@@"))	map += mort.name; 			//alone instance
	
	if(mort.map === map){ //regular teleport
		ActiveList.remove(mort);
		return; 
	}
	
	if(!List.map[map]){	//test if need to create instance
		var model = map.slice(0,map.indexOf('@'));
		var version = map.slice(map.indexOf('@')+1);
		Map.creation(model,version); 
	}
	
	var oldmap = List.map[mort.map];
	for(var i in oldmap.addon)
		if(oldmap.addon[i].playerLeave)
			oldmap.addon[i].playerLeave(mort.id,mort.map,oldmap.addon[i].spot,oldmap.addon[i].variable,oldmap);
	
	delete List.map[mort.map].list[mort.id];
	mort.map = map;	
	List.map[mort.map].list[mort.id] = mort.id;
	
	var newmap = List.map[mort.map];
	for(var i in newmap.addon)
		if(newmap.addon[i].playerEnter)
			newmap.addon[i].playerEnter(mort.id,mort.map,newmap.addon[i].spot,newmap.addon[i].variable,newmap);
			
	ActiveList.remove(mort);

		Chat.add(mort.id,"You leave " + oldmap.name + " and you enter " + newmap.name + '.');
}

Actor.talk = function(mort,enemyId){
	if(List.all[enemyId].dialogue){
		List.all[enemyId].dialogue.func(mort.id,List.main[mort.id].quest);
		//TOFIX not taking into consideration param
	}
}

Actor.pushing = function(pusher,beingPushed){
	var mort = List.all[beingPushed];
	if(!mort.block || !mort.block.pushable) return
	
	var pusherAngle = atan2(mort.y - pusher.y,mort.x - pusher.x);			//only work with square block
	var fact = 360/4;
	var angle = Math.floor((pusherAngle+fact/2)/fact)*fact%360;
	
	//Test if too far
		//Block
	var blockVarX = 0;	//only supported direction =4
	var blockVarY = 0;
	if(angle === 0) blockVarX = mort.block.size[0];
	if(angle === 90) blockVarY = mort.block.size[2];
	if(angle === 180) blockVarX = mort.block.size[1];
	if(angle === 270) blockVarY = mort.block.size[3];
	
	blockVarX *= 32;
	blockVarY *= 32;
	
		//Player
	var pusherVarX = 0;	//only supported direction =4
	var pusherVarY = 0;
	if(angle === 0) pusherVarX = mort.bumperBox[0].x;
	if(angle === 90) pusherVarY = mort.bumperBox[1].y;
	if(angle === 180) pusherVarX = mort.bumperBox[2].x;
	if(angle === 270) pusherVarY = mort.bumperBox[3].y;
	
	var posB = {'x':mort.x + blockVarX,'y':mort.y+blockVarY};
	var posP = {'x':pusher.x + pusherVarX,'y':pusher.y+pusherVarY};
	
	if(Collision.distancePtPt(posB,posP) > 64) return
	//
	
	mort.pushed.time = mort.block.time;
	mort.pushed.magn = mort.block.magn;
	mort.pushed.angle = angle;
	
}


Actor.harvest = function(mort,eid){	
	var e = List.all[eid];
	if(!e.skillPlot){ DEBUG(2,'trying to harvest not harvestable',eid); return; }
	var type = e.skillPlot.type;
	if(type === 'down'){
		Chat.add(mort.id,'This plot is down. Completing the quest ' + Db.quest[e.skillPlot.quest].name + ' will revive this plot.');
		return;
	}
	var plot = Db.skillPlot[type];
	
	var key = mort.id;
	var main = List.main[key]
	var inv = main.invList;
	var lvl = mort.skill.lvl[plot.skill];
	
	if(Collision.distancePtPt(mort,e) > 150){ Chat.add(key,"You're too far away."); return;}
	if(!Itemlist.empty(inv,1)){ Chat.add(key,"Your inventory is full."); return;}
	if(lvl < plot.lvl) {Chat.add(key,"You need at least level " + plot.lvl + ' ' + plot.skill.capitalize() + " to harvest this resource."); return;}
	if(Math.random() > plot.chance(lvl)) {Chat.add(key,"You failed to harvest this resource."); return;}
	
	var item = plot.item.random();
	Itemlist.add(inv,item,1);
	
	main.quest[e.skillPlot.quest].skillPlot[e.skillPlot.num] = 1;
	
	Chat.add(key,"You manage to harvest this resource.");
	
	LOG(2,key,'harvest',item);
}


Actor.setRespawn = function(mort,wp){
	Chat.add(mort.id,"You have changed your respawn point. Upon dying, you will now be teleported here.");

	mort.respawnLoc.recent = {x:wp.x,y:wp.y,map:wp.map};
	if(wp.map.have('@MAIN')) mort.respawnLoc.safe = {x:wp.x,y:wp.y,map:wp.map};
}

Actor.openChest = function(mort,eid){	//need work
	var e = List.all[eid];
	
	if(Collision.distancePtPt(mort,e) > 100){ Chat.add(mort.id,"You're too far away."); return;}
	
	if(!e.chest) return;
	if(e.chest.list.have(mort.id)){
		Chat.add(mort.id,"You have already opened that chest.");
		return;
	}
	Chat.add(mort.id,"You opened the chest.");
		
	if(e.chest.func(mort.id) !== false){
		Sprite.change(e,{'initAnim':'on'});
		e.chest.list.push(mort.id);
	};
	LOG(2,mort.id,'openChest',eid);
}

Actor.activateSwitch = function(mort,eid){
	var e = List.all[eid];
	
	if(Collision.distancePtPt(mort,e) > 100){ Chat.add(mort.id,"You're too far away."); return;}
	
	var sw = e.switch;
	if(!sw) return;
	var oldstate = sw.state;
	sw.state = sw.state === 'off' ? 'on' : 'off';
	
	if(sw[sw.state]) sw[sw.state](mort.id,e,List.map[e.map]);
	
	Sprite.change(e,{'initAnim':sw.state});
	Chat.add(mort.id,"You turned the switch " + sw.state + '.');
		
	if(!sw[oldstate]){
		Actor.removeOption(e,'Pull Switch');
	}


}

Actor.removeOnClick = function(mort,side){
	for(var i in mort.optionList.option){
		if(mort.optionList.option[i] === mort.onclick[side]){
			mort.optionList.option.splice(i,1);
			delete mort.onclick[side];
			return;
		}
	}
}	

Actor.removeOption = function(mort,option){	//option is object or name
	for(var i in mort.optionList.option){
		if(mort.optionList.option[i] === option || mort.optionList.option[i].name === option){
			mort.optionList.option.splice(i,1);
			return;
		}
	}
}	

Actor.pickDrop = function (mort,id){
	var inv = List.main[mort.id].invList;
	var drop = List.drop[id];
		
	if(!drop) return;
	
	if(!Collision.distancePtPt(mort,drop) > mort.pickRadius){
		Chat.add(mort.id,"You're too far away.");
		return;
	}

	if(!Itemlist.test(inv,[[List.drop[id].item,List.drop[id].amount]])){
		Chat.add(mort.id,"Inventory full.");
		return;
	}
	
	Itemlist.add(inv,drop.item,drop.amount);
	Drop.remove(drop);		
	
	
	LOG(1,mort.id,'pickDrop',drop);
}

Actor.rightClickDrop = function(mort,rect){
	var key = mort.id;
	var ol = {'name':'Pick Items','option':[]};
	for(var i in List.drop){
		var d = List.drop[i];
		if(d.map == List.all[key].map && Collision.RectRect(rect,[d.x,d.x+32,d.y,d.y+32]) ){
			ol.option.push({'name':'Pick ' + Db.item[List.drop[i].item].name,'func':'Actor.pickDrop','param':[i]});
		}
	}
	
	if(ol.option)	Button.optionList(key,ol);  
}
	
Actor.dropInv = function(mort,id){
	var inv = List.main[mort.id].invList;
	var amount = Math.min(1,Itemlist.have(inv,id,0,'amount'));
	
	if(!amount) return;
	
	Drop.creation({'x':mort.x,'y':mort.y,'map':mort.map,'item':id,'amount':amount,'timer':25*30});
	Itemlist.remove(inv,id,amount);
	
	LOG(1,mort.id,'dropInv',id,amount);
}




//}

//{Ability
Actor.removeAbility = function(mort,name){
	delete mort.abilityList[name];
	for(var i in mort.ability){
		if(mort.ability[i] && mort.ability[i].id === name){
			mort.ability[i] = null;
		}
	}
	LOG(1,mort.id,'removeAbility',name);
}

Actor.swapAbility = function(mort,name,position){
	
	/*
	if(mort.type === 'player'){
		if(abPos === 4 && mort.abilityList[abListPost].type !== 'heal'){Chat.add(mort.id,'This ability slot can only support Healing abilities.'); return;}	
		if(abPos === 5 && mort.abilityList[abListPost].type !== 'dodge'){Chat.add(mort.id,'This ability slot can only support Dodge abilities.'); return;}	
	}
	*/
	if(mort.type === 'player' && !mort.abilityList[name]) return; 		//dont have access to this ability
	var ability = Ability.uncompress(name);
	
	mort.ability[position] = ability;
	mort.abilityChange = Actor.template.abilityChange();
	for(var i in mort.ability){ 
		if(mort.ability[i])		mort.abilityChange.charge[mort.ability[i].id] = 0;
	}

}

Actor.learnAbility = function(mort,name){
	if(!Db.ability[name]) return;
	Chat.add(mort.id,"You have learnt a new ability: \"" + Db.ability[name].name + '".');
	mort.abilityList[name] = 1;
	LOG(1,mort.id,'learnAbility',name);
}

Actor.useAbilityPlan = function(mort,name){
	Actor.learnAbility(mort,name);
	Itemlist.remove(List.main[mort.id].invList,name,1);
}

Actor.examineAbility = function(mort){}
//}

//{Death
Actor.death = function(mort){	
	if(mort.type === 'enemy') Actor.death.enemy(mort);
	if(mort.type === 'player') Actor.death.player(mort);
	
}

Actor.death.player = function(mort){
	LOG(2,mort.id,'death');
	var key = mort.id;
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
	
	
	mort.dead = 1;
	mort.respawn = 25;
	
	if(mort.deathFunc){	
		var killers = Actor.death.getKiller(mort);
		mort.deathFunc(mort.id,killers[0]);	//[0] is most dmg. used for pvp
	}	
	
}

Actor.death.enemy = function(mort){
	mort.dead = 1;
	
	var killers = Actor.death.getKiller(mort);
	Actor.death.drop(mort,killers);
	Actor.death.exp(mort,killers);
	if(mort.deathFunc)	for(var i in killers) mort.deathFunc(killers[i],mort,mort.map) //custom death function (ex quest)
	if(mort.deathFuncArray) mort.deathFuncAll(killers,mort,mort.map)
	
	Actor.death.performAbility(mort);				//custom death ability function
	ActiveList.remove(mort);
}

Actor.death.performAbility = function(mort){
	for(var i in mort.deathAbility){
		Actor.performAbility(mort,mort.ability[mort.deathAbility[i]],false,false);
	}
}

Actor.death.getKiller = function(mort){
	for(var i in mort.damagedBy) if(!List.all[i]) delete mort.damagedBy[i];
	
	var tmp = Object.keys(mort.damagedBy);	
	if(!tmp.length) return [];
	if(tmp.length === 1) return tmp;
	
	var killer = null; var max = -1;
	for(var i in mort.damagedBy){
		if(mort.damagedBy[i] > max){
			killer = i;
		} 
	}
	return tmp.splice(tmp.indexOf(killer),1).unshift(killer);	//place main killer in [0]
}

Actor.death.drop = function(mort,killers){
	var drop = mort.drop;
	
	var quantity = (1 + drop.mod.quantity).mm(0); 
	var quality = drop.mod.quality;
	var rarity = drop.mod.rarity;
	if(killers[0] && List.all[killers[0]]){ 
		quantity += List.all[killers[0]].item.quantity; 
		quality += List.all[killers[0]].item.quality; 	//only for plan
		rarity += List.all[killers[0]].item.rarity; 		//only for plan
	}
	
	//Category
	var list = Drop.getCategoryList(drop.category,mort.lvl,quantity);
	
	for(var i in list){
		var item = list[i];
		if(Math.random() < item.chance){	//quantity applied in Drop.getList
			var killer = killers.random();
			var amount = Math.round(item.amount[0] + Math.random()*(item.amount[1]-item.amount[0]));	
			Drop.creation({'x':mort.x,'y':mort.y,'map':mort.map,'item':item.name,'amount':amount,'timer':Drop.timer,'viewedIf':[killer]});			
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
					'lvl':mort.lvl,
					'category':'equip',
					'minAmount':0,
					'maxAmount':0,
				});
			
				Drop.creation({'x':mort.x,'y':mort.y,'map':mort.map,'item':id,'amount':1,'timer':Drop.timer,'viewedIf':[killer]});	
			}	

			if(Math.pow(Math.random(),quantity) < drop.plan[i][j]){
				var randomKiller = killers.random();
				
				var id = Plan.creation({	//craft plan
					'rarity':rarity,
					'quality':quality,
					'piece':i,
					'type':j,
					'lvl':mort.lvl,
					'category':'equip',
				});
			
				Drop.creation({'x':mort.x,'y':mort.y,'map':mort.map,'item':id,'amount':1,'timer':Drop.timer,'viewedIf':[killer]});	
				break planLoop;
			}
		}
	}

}

Actor.death.exp = function(mort,killers){
	for(var i in killers){
		var killer = List.all[killers[i]];
		if(!killer) continue;
		var equip = Db.equip[killer.weapon];
		if(!equip) continue;
		var style = equip.piece;
		Skill.addExp(killers[i],style,mort.deathExp);
	}
}
//}

Actor.respawn = {};

Actor.respawn.player = function(mort){
	var rec = mort.respawnLoc.recent;
	
	if(!rec.x) rec = rec[rec.randomAttribute()];	//aka when multi possible spawn aka pvp
	
	if(List.map[rec.map]){
		mort.x = rec.x;
		mort.y = rec.y;
		mort.map = rec.map;
	} else {
		var safe = mort.respawnLoc.safe;
		mort.x = safe.x;
		mort.y = safe.y;
		mort.map = safe.map;
	}
	
	for(var i in mort.resource)
		mort[i] = mort.resource[i].max;
	
	mort.dead = 0;
	
	LOG(2,mort.id,'respawn',mort.x,mort.y,mort.map);
	
}
//ts("Plan.creation({'rarity':0,'quality':0,'piece':'melee','lvl':10,'category':'equip',});")







