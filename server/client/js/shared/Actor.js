//Player
//Check client/shared/mortalShare for player attributes information

//Actor
Actor = typeof Actor !== 'undefined' ? Actor : {};

Actor.remove = function(mort){
	ActiveList.remove(mort);
	
	delete List.actor[mort.id];
	delete List.all[mort.id]
	if(List.map[mort.map])	delete List.map[mort.map].list[mort.id];
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

Actor.cutTree = function(mort,tree){	//quick fix...
	Itemlist.add(List.main[mort.id].invList,'wood-0',1);
	Sprite.change(List.all[tree],{'anim':'cut'});
	Chat.add(mort.id,"You manage to cut a branch off this Red Tree.");
	Actor.removeOption(List.all[tree],'Cut Tree');

}

Actor.setRespawn = function(mort,wp){
	Chat.add(mort.id,"You have changed your respawn point. Upon dying, you will now be teleported here.");
	mort.respawnLoc = {x:wp.x,y:wp.y,map:wp.map};
}

Actor.openChest = function(mort,eid){	//need work
	var e = List.all[eid];
	var chest = e.treasure;
	if(!chest) return;
	if(chest.list.have(mort.id)){
		Chat.add(mort.id,"You have already opened that chest.");
		return;
	}
	Chat.add(mort.id,"You opened the chest.");
		
	if(chest.func(mort.id) !== false){
		Sprite.change(e,{'anim':'open'});
		chest.list.push(mort.id);
	};
}

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

Actor.teleport = function(mort,x,y,map,signin){
	//Teleport player. if no map specified, stay in same map.
	mort.x = x;
	mort.y = y;
	if(map){
		if(!map.have("@")){	map += '@MAIN'; }
		if(map.have("@MAIN")){ 
			delete List.map[mort.map].list[mort.id];
			mort.map = map;	
			List.map[mort.map].list[mort.id] = mort.id;
		}
		else if(mort.map !== map){ Actor.teleport.instance(mort,x,y,map,signin);}
	}
	ActiveList.remove(mort);	//need to consider if needed or not
}



Actor.teleport.instance = function(mort,x,y,map,signin){
	if(!map){ Actor.teleport(mort,x,y);  return; }		//regular teleport
	if(!map.have("@")){	map += "@MAIN"; }
	if(map.have("@MAIN")){ Actor.teleport(mort,x,y,map);  return; }		//regular teleport

	if(typeof signin === 'object'){
		mort.mapSignIn = deepClone(signin);
	} else if(mort.map.have("@MAIN")){
		mort.mapSignIn = {map:mort.map,x:mort.x,y:mort.y};	//default signin = place b4 going instance
	}
	
	if(map.have('@@')) map += mort.name;	//solo instance
	else if(map[map.length-1] === '@') map += mort.team;	//team instance
	//test if need to create instance
	if(!List.map[map]){
		var model = map.slice(0,map.indexOf('@'));
		var version = map.slice(map.indexOf('@')+1);
		Map.creation(model,version); 
	}
	mort.x = x;
	mort.y = y;
	delete List.map[mort.map].list[mort.id];
	mort.map = map;	
	List.map[mort.map].list[mort.id] = mort.id;
	
	
	
	ActiveList.remove(mort);
}


Actor.pickDrop = function (mort,id){
	var inv = List.main[mort.id].invList;
	var drop = List.drop[id];
		
	if(drop){
		if(Collision.distancePtPt(mort,drop) <= mort.pickRadius && Itemlist.test(inv,[[List.drop[id].item,List.drop[id].amount]])){
			Itemlist.add(inv,drop.item,drop.amount);
			Drop.remove(drop);		
		}
	}
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
	
	if(ol.option){ 
		Button.optionList(key,ol);  
	}	
}
	
Actor.dropInv = function(mort,id){
	var inv = List.main[mort.id].invList;
	var amount = Math.min(1,Itemlist.have(inv,id,0,'amount'));
	
	if(!amount) return;
	
	Drop.creation({'x':mort.x,'y':mort.y,'map':mort.map,'item':id,'amount':amount,'timer':25*30});
	Itemlist.remove(inv,id,amount);
}





Actor.update = {};
Actor.update.mastery = function(player){
	//Note: mod is applied in Combat.action.attack.mod.player
	var mas = player.mastery;
	for(var i in mas){
		for(var j in mas[i]){
			mas[i][j].sum = Math.pow(mas[i][j]['x'] * mas[i][j]['*'],mas[i][j]['^']) + mas[i][j]['+'];
		}
	}
}

Actor.update.permBoost = function(player){
	player = typeof player === 'object' ? player : List.all[player];
	
	var pb = player.boost;
	
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
	for(var i in player.permBoost){	//i = Source (item)	
		for(var j in player.permBoost[i]){	//each indidual boost boost
			var b = player.permBoost[i][j];
			
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
	
	for(var j in pb.custom){ Db.customBoost[j].function(pb,player.id);}
}

Actor.update.boost = function(player,stat){
	viaArray.set({'origin':player,'array':player.boost.list[stat].stat,'value':player.boost.list[stat].base});
	for(var i in player.boost.list[stat].name){
		var boost = player.boost.list[stat].name[i];
				
		if(boost.type === '+'){	viaArray.add({'origin':player,'array':player.boost.list[stat].stat,'value':boost.value}); }
		else if(boost.type === '*'){	viaArray.add({'origin':player,'array':player.boost.list[stat].stat,'value':(boost.value-1)*player.boost.list[stat].base}); }
	}
}

Actor.boost = function(player, boost){
	//Add a boost to a actor

	//list[i]: i = stat
	//toUpdate[i]: i = stat
	//fast[i]: i = stat@source

	// {stat:'globalDmg',value:1000,type:'*',time:10000,name:'quest'}

	//format: boost { 'stat':'globalDmg','value':1,'type':'*','time':100,'name':'weapon'}
	boost = arrayfy(boost);
	for(var i in boost){ 
		var b = boost[i];
		if(typeof player === 'string'){ player = List.all[player]; }
		var name = b.name || 'Im dumb.';
		var id = b.stat + '@' + name;
		b.time = b.time || 1/0;
		b.timer = b.time;		//otherwise, cuz reference, boost cant be used twice cuz time = 0
		b.type = b.type || '+';
		
		b.spd = 'reg';
		if(b.time > 250){ b.spd = 'slow'; }
		if(b.time < 25){ b.spd = 'fast'; }
		
		player.boost[b.spd][b.stat + '@' + name] = b;
		player.boost.list[b.stat].name[name] = b;
		player.boost.toUpdate[b.stat] = 1;
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

Actor.permBoost.compile = function(b){
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

Actor.talk = function(mort,enemyId){
	if(List.all[enemyId].dialogue){
		List.all[enemyId].dialogue.func(mort.id);
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

//Ability
Actor.removeAbility = function(mort,name){
	delete mort.abilityList[name];
	for(var i in mort.ability){
		if(mort.ability[i] && mort.ability[i].id === name){
			mort.ability[i] = null;
		}
	}
}

Actor.swapAbility = function(mort,name,position){
	
	/*
	if(mort.type === 'player'){
		if(abPos === 4 && mort.abilityList[abListPost].type !== 'heal'){Chat.add(mort.id,'This ability slot can only support Healing abilities.'); return;}	
		if(abPos === 5 && mort.abilityList[abListPost].type !== 'dodge'){Chat.add(mort.id,'This ability slot can only support Dodge abilities.'); return;}	
	}
	*/
	if(!mort.abilityList[name]) return; 		//dont have access to this ability
	var ability = Ability.uncompress(name);
	
	mort.ability[position] = ability;
	mort.abilityChange = Actor.template.abilityChange();
	for(var i in mort.ability){ 
		if(mort.ability[i])		mort.abilityChange.charge[mort.ability[i].id] = 0;
	}

}

Actor.learnAbility = function(mort,name){
	if(!Db.ability[name]) return;
	mort.abilityList[name] = 1;
}

Actor.examineAbility = function(mort){}

//Death
Actor.death = function(mort){	
	if(mort.type === 'enemy') Actor.death.enemy(mort);
	if(mort.type === 'player') Actor.death.player(mort);
	
}

Actor.death.player = function(mort){
	var key = mort.id;
	var main = List.main[key];
	
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
	
	mort.x = mort.respawnLoc.x;
	mort.y = mort.respawnLoc.y;
	mort.map = List.map[mort.respawnLoc.map] ? mort.respawnLoc.map : 'test@MAIN';
	
	for(var i in mort.resource){
		mort[i] = mort.resource[i].max;
	}
	
}

Actor.death.enemy = function(mort){
	mort.dead = 1;
	
	var killers = Actor.death.getKiller(mort);
	Actor.death.drop(mort,killers);
	Actor.death.exp(mort,killers);
	if(mort.deathFunc){ mort.deathFunc(killers); }	//custom death function (ex quest)
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



//ts("Plan.creation({'rarity':0,'quality':0,'piece':'melee','lvl':10,'category':'equip',});")







