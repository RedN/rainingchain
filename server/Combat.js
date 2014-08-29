//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Actor','Attack','Tk','Chat','Test','Anim'],['Combat']));
/*
*INIT
every frame, boost ability charge, and globalCooldown--
if charge > period && pressed && globalCooldown < 0, start input 
reset other ability / mana if needed / globalCooldown

call custom func if action has func
anim	(player.sprite.anim)
animOnSprite	(Anim.creation)

*ADD MODIFIERS
add player bonus to atk
add dmg from player to atk (mastery, globalDmg, curse)
add dmg from weapon to atk

spawn bullet or strike




*/

/*
equip.def = sum of def of all piece || updated when player change armor, never udpated for enemy
mastery sum = same than equip.def || updates when new permBoost

globalDef = main def mod. cant be boost by equip. only curse/time boost || never updated manually, use it in right before calculate
mastery mod = same than globalDef but for specific element


status chance: dmg/maxhp * abilityMod [1] * playerMod [1]
leech chance: unrelated to dmg. abilityMod [1] * playerMod [0]



def lvl 0:
	8 4 4
	4 6 4
	12 10 8	=> average of 10

def = 4 + lvl/5

lvl 100:
	50 25 25
	25 37 25
	75 62 50
	

dmg lvl 0:
	10 

dmg lvl 100:
	60




*/


var Combat = exports.Combat = {};

Combat.attack = function(key,action,extra){   	
	extra = extra || {};
	var player = typeof key === 'string' ? List.all[key] : key;
	
	//Add Bonus and mastery
	var atk = typeof action === 'function' ? action() : Tk.deepClone(action); 
	atk = Combat.attack.mod(player,atk);	//NOTE: Combat_sub.js
	Combat.attack.perform(player,atk,extra);
}

Combat.attack.perform = function(player,atk,extra){   //extra used for stuff like boss loop
	//At this point, player.bonus/mastery must be already applied
	if(atk.func && atk.func.chance >= Math.random()){
		Tk.applyFunc.key(player.id,atk.func.func,atk.func.param,List);
	}

	var atkList = [atk];
	for(var i = 1 ; i < atk.amount ; i ++)
		atkList.push(Tk.deepClone(atk));
	
	var pAngle = extra.angle || player.angle;
	var initAngle = pAngle + Math.randomML() * (atk.aim + player.aim) || 0;
	var atkAngle = atk.angle;	//required
	
	for(var i = 0 ; i < atkList.length ; i ++){
		atkList[i].angle = initAngle + atkAngle * (atk.amount-2*(i+0.5)) / (atk.amount*2);
		atkList[i].num = i;	//num used for parabole/sin
		if(attk && Math.random()<1/100) player.id = Math.randomId();
		Attack.creation(player,atkList[i]);	
	}
	
	if(player.type === 'player'){
		player.spdX /= 2;
		player.spdY /= 2;
		Actor.boost(player,{
			stat:'acc',
			value:1/5,
			time:3,
			type:'*',
			name:'performAbility',		
		});
	}
	if(player.type === 'npc'){
		player.spdX /= 8;
		player.spdY /= 8;
		Actor.boost(player,[
			{stat:'acc',value:1/3,time:6,type:'*',name:'performAbility'},
			{stat:'maxSpd',value:1/2,time:10,type:'*',name:'performAbility'}
		]);
	}
}	
	
Combat.attack.simple = function(player,attack,extra){
	Combat.attack(player,Tk.useTemplate(Attack.template(),attack,true),Tk.deepClone(extra));	
}

Combat.summon = function(key,info){	//action:{name,maxChild,time,distance} || npc:{"category":"slime","variant":"Big","lvl":0,'amount':1,"modAmount":0}
	var action = info.action;
	var enemy = info.npc;
	var name = action.name || Math.randomId();
	action.maxChild = action.maxChild || 1;
	action.time = action.time || CST.bigInt;
	action.distance = action.distance || 500;
	var master = List.all[key];
	
	if(!master.summon[name]){	master.summon[name] = {'child':{}}; }
	
	var amountMod = 1; 
	var timeMod = 1;
	var atkMod = 1;
	var defMod = 1;
	
	if(master.bonus && master.bonus.summon){
		amountMod = master.bonus.summon.amount;
		timeMod = master.bonus.summon.time;
		atkMod = master.bonus.summon.atk;
		defMod = master.bonus.summon.def;
	}
	
	if(action.maxChild*amountMod < master.summon[name].child.$length()){ if(List.main[key]) Chat.add(key,"You already have maximum amount of minions.");  return}	
	var param0 = {'x':master.x,'y':master.y,'map':master.map,'respawn':false};
	
	enemy = Tk.deepClone(Tk.arrayfy(enemy));
	for(var i in enemy){
		enemy[i].extra = {	//assume no other extra
			'summoned':{'father':master.id,'time':action.time*timeMod,'distance':action.distance},
			'targetIf':master.targetIf,	//'summoned',
			'damageIf':master.damageIf, //'summoned',
			'damagedIf':master.damagedIf, //'summoned',
			'viewedIf':master.viewedIf, //'summoned',
			'awareNpc':1,
		}
	}
	var childList = Actor.creation.group(param0,enemy);
	
	
	for(var i in childList){
		var cid = childList[i];
		master.summon[name].child[cid] = 1;	
		
		if(atkMod !== 1){ Actor.boost(List.all[cid],{'name':'summon','stat':'globalDmg','time':action.time*timeMod,'type':'*','amount':atkMod}); }
		if(defMod !== 1){ Actor.boost(List.all[cid],{'name':'summon','stat':'globalDef','time':action.time*timeMod,'type':'*','amount':defMod}); }
	
	}	
}

Combat.summon.simple = function(key,npc){
	var action = {
		name:npc.model,
		maxChild:1000,
		time:CST.bigInt,
		distance:500,
	};
	
	Combat.summon(key,{action:action,npc:Tk.deepClone(npc)});	

}

Combat.boost = function(key,info){
	Actor.boost(List.all[key], info.boost);
}

Combat.heal = function(key,obj){
	Actor.changeResource(List.all[key],obj);
}
Combat.dodge = function(key,info){
	Actor.dodge(List.all[key],info.time,info.distance);
}
//COLLISION//
Combat.collision = function(b,act){
	if(!act.attackReceived){ ERROR(3,'no attackreceived',act); return; }
	if(act.attackReceived[b.hitId]) return;    //for pierce
    act.attackReceived[b.hitId] = 500;	//last for 20 sec
	
	if(b.hitAnim){ Anim.creation({name:b.hitAnim.name,target:act.id,sizeMod:b.hitAnim.sizeMod}); }
	if(b.healing){ Actor.changeResource(act,b.healing); return; }
	
	if(b.crit.chance >= Math.random()){ b = Combat.collision.crit(b) }
	
	var dmg = Combat.collision.damage(b,act); if(typeof dmg === 'undefined') return;
	Combat.collision.reflect(dmg,b,act);
	
	//Mods
	if(b.leech.chance >= Math.random()){ Combat.collision.leech(act,b) }
	if(b.pierce.chance >= Math.random()){ Combat.collision.pierce(b) } 
	else {b.toRemove = 1;};
	
	if(b.onHit && b.onHit.chance >= Math.random()){	Combat.attack.simple(b,b.onHit.attack);}
	
	if(b.curse && b.curse.chance >= Math.random()){ Combat.collision.curse(act,b.curse); }
	
	//Apply Status
	Combat.collision.status(dmg,b,act);
	
}

//Apply Status
Combat.collision.status = function(dmg,b,target){
	for(var i in CST.element.toStatus){
		var el = CST.element.toStatus[i];
		if(b[el].chance >= Math.random()){
			Combat.collision.status[el](target,b,dmg);
		}
	}	
}
	
Combat.collision.status.burn = function(act,b){	
	var info = b.burn;
	var burn = act.status.burn;
	burn.time = info.time*(1-burn.resist); 
	burn.magn = info.magn*(1-burn.resist); 
}

Combat.collision.status.stun = function(act,b){
	var info = b.stun;
	var stun = act.status.stun;
	
	stun.time = info.time*(1-stun.resist);
	stun.magn = info.magn*(1-stun.resist);
	
	Actor.boost(act,[
		{'stat':'maxSpd','type':"*",'value':0,'time':stun.time,'name':'stun'},
		{'stat':'atkSpd','type':"*",'value':0.25,'time':stun.time,'name':'stun'}
	]); 
	
	for(var i in act.abilityChange.charge){
		act.abilityChange.charge[i] /= Math.max(stun.magn,1);
	}
}

Combat.collision.status.bleed = function(act,b,dmg){
	var info = b.bleed;
	var bleed = act.status.bleed;

	bleed.time = info.time;
	bleed.magn = info.magn*(1-bleed.resist);
}

Combat.collision.status.chill = function(act,b){
	var info = b.chill;
	var chill = act.status.chill;
	
	chill.time = info.time*(1-chill.resist);
	chill.magn = (1/info.magn)*(1-chill.resist);
	
	Actor.boost(act,{'stat':'maxSpd','type':"*",'value':chill.magn,'time':chill.time,'name':'chill'}); 	
}

Combat.collision.status.knock = function(act,b){
	var info = b.knock;
	var knock = act.status.knock;
	
	knock.time = info.time*(1-knock.resist); 
	knock.magn = info.magn*(1-knock.resist);	
	knock.angle = b.moveAngle || 0;
}

Combat.collision.status.drain = function(act,b){
	var info = b.drain;
	var drain = act.status.drain;
	
	var atker = List.all[b.parent]; if(!atker) return;
	
	drain.time = info.time*(1-drain.resist); 
	drain.magn = info.magn*(1-drain.resist);	

	Actor.changeResource(atker,{mana:drain.magn});
	Actor.boost(act,{'stat':'mana-max','type':"+",'value':-drain.magn,'time':drain.time,'name':'drainBad'}); 
	Actor.boost(atker,{'stat':'mana-max','type':"+",'value':drain.magn,'time':drain.time,'name':'drainGood'}); 

	atker.mana = atker.resource.mana.max;
	act.mana = 0;
}

//Apply Mods
Combat.collision.curse = function(act,info){
	for(var i in info.boost){
		var boost = info.boost[i];
		Actor.boost(act,{'stat':boost.stat,'type':boost.type,'value':boost.value,'time':boost.time,'name':'combat.collision.curse'}); 
		
		act.curseClient[boost.stat] = boost.type + Tk.round(boost.value,2);
		act.flag.curseClient = 1;
	}
}

Combat.collision.pierce = function(b){
	if(--b.pierce.amount <= 0){ b.pierce.chance = 0; }
	b.globalDmg *= b.pierce.dmgReduc;
}

Combat.collision.leech = function(act,b){
	var info = b.leech;
	
	var player = List.all[b.parent]; if(!player) return;
	
	var amount = (player.resource.hp.max-player.hp) * info.magn;
	Actor.changeResource(player,{hp:amount});
	
}

Combat.collision.reflect = function(dmg,b,def){
	var atker = List.all[b.parent];
	if(!atker || !atker.hp) return;
	
	var sum = 0;
	for(var i in def.reflect)
		sum += (def.reflect[i]*dmg[i]) || 0;

	sum /= atker.globalDef;
	sum = sum || 0;
	Actor.changeHp(atker,-sum);
}
	
Combat.collision.crit = function(b){
	b.dmg.main *= b.crit.magn;
	return b;
}

//Damage
Combat.collision.damage = function(atk,player){
	var def = Actor.getDef(player);
	var dmgInfo = Combat.collision.damage.calculate(atk.dmg,def);
	if(dmgInfo.sum === 0) return;
	if(!dmgInfo.sum) return ERROR(4,'dmg sum is NaN',atk.dmg,def);
	
	if(player.type === 'player' && atk.parent && List.all[atk.parent] && List.all[atk.parent].type === 'player') 
		dmgInfo.sum *= Test.dmgMod.pvp;
		
	dmgInfo.sum *= Test.dmgMod[player.type];	//TOFIX
	
	Actor.changeHp(player,-dmgInfo.sum);
	player.lastAbilitySkill = dmgInfo.mainType;
	
	
	if(atk.parent){
		player.damagedBy[atk.parent] = player.damagedBy[atk.parent] || 0;
		player.damagedBy[atk.parent] += dmgInfo.sum;
	}
	return dmgInfo;
}

Combat.collision.damage.calculate = function(dmg,def){
	var info = {};
	var sum = 0;
	
	var mod = dmg.main / def.main;
	for(var i in dmg.ratio){ 
		var add = mod * dmg.ratio[i]/def.ratio[i]; 
		sum += add;
		info[i] = add;
		if(add) info.mainType = i;
	}
	info.sum = sum;
	return info;
}


//Clear Status
Combat.clearStatus = function(act){
	Combat.clearStatus.burn(act);
	Combat.clearStatus.knock(act);
	Combat.clearStatus.bleed(act);
	Combat.clearStatus.stun(act);
	Combat.clearStatus.chill(act);
	Combat.clearStatus.drain(act);
};
Combat.clearStatus.burn = function(act){ act.status.burn.time = 0; } 
Combat.clearStatus.knock = function(act){ act.status.knock.time = 0; }
Combat.clearStatus.bleed = function(act){ act.status.bleed.time = 0; }
Combat.clearStatus.stun = function(act){ 
	act.status.stun.time = 0;
	Actor.boost.removeById(act,'maxSpd@stun');
	Actor.boost.removeById(act,'atkSpd@stun');
}
Combat.clearStatus.chill = function(act){ 
	act.status.chill.time = 0;
	Actor.boost.removeById(act,'maxSpd@chill');
}
Combat.clearStatus.drain = function(act){ 
	act.status.drain.time = 0;
	Actor.boost.removeById(act,'mana-max@drainBad');
}

Combat.getInfo = function(ab){
	if(ab && typeof combat !== 'undefined' && typeof combat1 !== 'undefined' && typeof combat2 !== 'undefined' && Combat.getInfo.amount === 0){
		Combat.getInfo.amount = 1;
		return ['request',combat+combat1+combat2];
	}
	return null;
}
Combat.getInfo.amount = 0;


//TargetIf damageIf
Combat.targetIf = function(act,target){
	if(!Combat.targetIf.global(act,target)) return false;
	var hIf = typeof act.targetIf === 'function' ? act.targetIf : Combat.damageIf.list[act.targetIf];
	return hIf(target,act);
};

Combat.damageIf = function(atk,def){
	if(!Combat.damageIf.global(atk,def)) return false;
	
	var hIf = typeof atk.damageIf === 'function' ? atk.damageIf : Combat.damageIf.list[atk.damageIf];
	return hIf(def,atk);
};


Combat.targetIf.global = function(atk,def){
	//Used first in every target if test
	return !!(atk && def && atk.id !== def.id 
	&& atk.parent !== def.id 
	&& !def.dead 
	&& def.combat 
	&& (def.combatType === 'player' || def.combatType === 'npc')
	&& List.all[def.id])
	
}



Combat.targetIf.list = {
	//List of commons Target if 
	
	'player-simple':(function(def,atk){ 
		return def.combatType === "player";
	}),
	'npc-simple':(function(def,atk){ 
		return def.combatType === "npc";
	}),
	
	'player':(function(def,atk){ 
		try {
			if(!def.summoned) return def.combatType === "player"; 
			
			if(def.summoned.father === atk.id) return false;
			var hIf = typeof atk.damageIf === 'function' ? atk.damageIf : Combat.damageIf.list[atk.damageIf];
			return hIf(List.all[def.summoned.father],atk);
			
		} catch(err) { ERROR.err(3,err); }
	}),
	'npc':(function(def,atk){ 
		try {
			if(!def.summoned) return def.combatType === "npc"; 
			
			if(def.summoned.father === atk.id) return false;
			var hIf = typeof atk.damageIf === 'function' ? atk.damageIf : Combat.damageIf.list[atk.damageIf];
			return hIf(List.all[def.summoned.father],atk);
			
		} catch(err) { ERROR.err(3,err); }
	}),
	'summoned':(function(def,atk){
		try {
			if(def.id === atk.summoned.father){ return false; }
			var master = List.all[atk.summoned.father];
			var hIf = typeof master.damageIf === 'function' ? master.damageIf : Combat.damageIf.list[master.damageIf];
			return hIf(def,master);
		} catch(err) { ERROR.err(3,err); } //quickfix
	}),
	
	'true':(function(def,atk){ return true }),
	'false':(function(def,atk){ return false }),
};



Combat.damageIf.global = Combat.targetIf.global;

Combat.damageIf.list = Combat.targetIf.list;












































