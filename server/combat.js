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


*/

Combat = {};

//NOTE: Combat.action.attack.mod is inside	Combat_sub.js

//ACTION//
Combat.action = {};

Combat.action.attack = function(id,action,extra){   
	var player = typeof id === 'string' ? List.all[id] : id;
	
	//Add Bonus and mastery
	var atk = typeof action === 'function' ? action() : deepClone(action); 
	atk = Combat.action.attack.mod(player,atk);
	Combat.action.attack.perform(player,atk,extra);
}

Combat.action.attack.perform = function(player,attack,extra){   //extra used for stuff like boss loop
	//At this point, player.bonus/mastery must be already applied
	
	if(extra){ attack = deepClone(attack); }    //cuz probably from boss
	
	if(attack.func && attack.func.chance >= Math.random()){
		applyFunc.key(player.id,attack.func.func,attack.func.param);
	}

	var atkList = [attack];
	for(var i = 1 ; i < attack.amount ; i ++)
		atkList.push(deepClone(attack));
	
	
	var initAngle = player.angle + Math.randomML() * (attack.aim + player.aim) || 0;
	var atkAngle = attack.angle; var atkAmount = attack.amount;

	for(var i = 0 ; i < atkList.length ; i ++){
		var angle = initAngle + atkAngle * (atkAmount-2*(i+1/2)) / (atkAmount*2) ;
		angle = (angle+360) % 360;
		
		if(extra && extra.angle !== undefined){ angle = extra.angle; }	//quickfix
		
		Attack.creation(player,atkList[i],{'angle':angle,'num':i});	//num used for parabole/sin
	}
}	
	
Combat.action.summon = function(key,action,enemy){
	var name = action.name || Math.randomId();
	action.maxChild = action.maxChild || 1;
	action.time = action.time || 1/0;
	action.distance = action.distance || 500;
	var master = List.all[key];
	
	if(!master.summon[name]){	master.summon[name] = {'child':{}}; }
	
	amountMod = 1; 
	timeMod = 1;
	atkMod = 1;
	defMod = 1;
	
	if(master.bonus && master.bonus.summon){
		amountMod = master.bonus.summon.amount;
		timeMod = master.bonus.summon.time;
		atkMod = master.bonus.summon.atk;
		defMod = master.bonus.summon.def;
	}
	
	if(action.maxChild*amountMod > Object.keys(master.summon[name].child).length){	
		var param0 = {
			'x':master.x,
			'y':master.y,
			'map':master.map,
			'extra':{'deleteOnceDead':1,
					'summoned':{'father':master.id,'time':action.time*timeMod,'distance':action.distance},
					'targetIf':'summoned',
					'hitIf':'summoned',
					}
		};
		var childList = Actor.creation.group(param0,enemy);
		
		for(var i in childList){
			var cid = childList[i];
			master.summon[name].child[cid] = 1;	
			
			if(atkMod !== 1){ Actor.boost(cid,{'name':'summon','stat':'globalDmg','time':action.time*timeMod,'type':'*','amount':atkMod}); }
			if(defMod !== 1){ Actor.boost(cid,{'name':'summon','stat':'globalDef','time':action.time*timeMod,'type':'*','amount':defMod}); }
		
		}
	}	
}

Combat.action.boost = function(key,info){
    Actor.boost.apply(this, [info]);
}



//COLLISION//
Combat.collision = function(b,mort){
	if(mort.attackReceived[b.hitId]) return;    //for pierce
    mort.attackReceived[b.hitId] = 250;	//last for 10 sec
	
	if(b.hitImg){Anim.creation(b.hitImg.name,mort.id,b.hitImg.sizeMod || 1);}
	if(b.healing){ Actor.changeResource(mort,b.healing); return; }
	
	if(b.crit.chance >= Math.random()){ b = Combat.collision.crit(b) }
	
	var dmg = Combat.collision.damage(b,mort); if(!dmg) return;
	Combat.collision.reflect(dmg,b,mort);
	
	//Mods
	if(b.leech.chance && b.leech.chance >= Math.random()){ Combat.collision.leech(mort,b) }
	if(b.pierce.chance && b.pierce.chance >= Math.random()){ Combat.collision.pierce(b) } else {b.toRemove = 1;};
	
	if(b.onHit && b.onHit.chance >= Math.random()){	Combat.action.attack(b,useTemplate(Attack.template(),b.onHit.attack));}
	
	
	if(b.curse && b.curse.chance >= Math.random()){ Combat.collision.curse(mort,b.curse); }
	
	//Apply Status
	Combat.collision.status(dmg,b,mort);
	
}

//Apply Status
Combat.collision.status = function(dmg,b,target){
	var ar = {	//could use Cst instead
		'melee':'bleed',
		'range':'knock',
		'magic':'drain',
		'fire':'burn',
		'cold':'chill',
		'lightning':'confuse'
	}
	for(var i in ar){
		var maxToRoll = Math.probability(Math.pow(dmg[i] / target.resource.hp.max,1.5),b[ar[i]].chance);
				
		if(0.001 <= maxToRoll && Math.random() <= maxToRoll){ 
			Combat.collision.status[ar[i]](target,b,dmg);
		}
	}	
}
	
Combat.collision.status.burn = function(mort,b){	
	var info = b.burn;
	var burn = mort.status.burn;
	burn.active.time = info.time*(1-burn.resist); 
	burn.active.magn = info.magn*(1-burn.resist); 
	burn.active.type = info.type || 'hp'; 
}

Combat.collision.status.confuse = function(mort,b){
	var info = b.confuse;
	var confuse = mort.status.confuse;
	
	confuse.active.time = info.time*(1-confuse.resist);
	confuse.active.magn = info.magn*(1-confuse.resist);
	var left = Math.floor(Math.random()*4);
	confuse.active.input = [left%4,(left+3)%4,(left+2)%4,(left+1)%4];
	Actor.boost(mort,{'stat':'aim','type':"+",'value':confuse.active.magn,'time':confuse.active.time,'name':'confuse'});
}

Combat.collision.status.bleed = function(mort,b,dmg){
	var info = b.bleed;
	var bleed = mort.status.bleed;
	
	bleed.active.list.push({'time':info.time,'magn':dmg.melee * info.magn/info.time *(1-bleed.resist)});
	bleed.active.time = bleed.active.list.length;
}

Combat.collision.status.chill = function(mort,b){
	var info = b.chill;
	var chill = mort.status.chill;
	
	Actor.boost(mort,{'stat':'maxSpd','type':"*",'value':(1/b.chill.magn)*(1-chill.resist),'time':b.chill.time*(1-chill.resist),'name':'chill'}); 
	//if(b.chill.atk){ addBoost(mort,{'stat':'atkSpd-0','type':"*",'value':b.chill.magn*(1-mort.resist.chill),'time':b.chill.time*(1-mort.resist.chill),'name':'chill'}); }}
	chill.active.time = Math.max(chill.active.time,b.chill.time*(1-chill.resist));
}

Combat.collision.status.knock = function(mort,b){
	var info = b.knock;
	var knock = mort.status.knock;
	
	knock.active.time = info.time*(1-knock.resist); 
	knock.active.magn = info.magn*(1-knock.resist);	
	knock.active.angle = b.moveAngle;
}

Combat.collision.status.drain = function(mort,b){
	return;
	//BROKEN
	
	var info = b.drain;
	
	var player = List.all[b.parent]; if(!player) return;
	
	var amount = mort.resource.mana.max * 0.05 * info.magn;

	player.mana += amount;
	mort.mana -= amount;
	mort.mana = mort.mana.mm(0);
}


//Apply Mods
Combat.collision.curse = function(mort,info){
	for(var i in info.boost){
		var boost = info.boost[i];
		Actor.boost(mort,{'stat':boost.stat,'type':boost.type,'value':boost.value,'time':boost.time,'name':'curse'}); 
	}
}

Combat.collision.pierce = function(b){
	b.pierce.amount--; 
	if(b.pierce.amount <= 0){ b.pierce.chance = 0; }
	b.globalDmg *= b.pierce.dmgReduc;
}

Combat.collision.leech = function(mort,b,element){
	var info = b.leech;
	
	var player = List.all[b.parent]; if(!player) return;
	
	var amount = (player.resource.hp.max-player.hp) * 0.01 * info.magn;
	Actor.changeResource(player,{hp:amount});
	
}

Combat.collision.reflect = function(dmg,bullet,mort){
	var attacker = List.all[bullet.parent];
	if(attacker && attacker.hp){
		for(var i in Cst.element.list){
			Actor.changeHp(attacker,-mort.reflect[Cst.element.list[i]]*dmg[Cst.element.list[i]]/attacker.globalDef);
		}
	}
}
	
Combat.collision.crit = function(b){
	b.dmg.main *= b.crit.magn;
	return b;
}

//Damage
Combat.collision.damage = function(bullet,player){
	var def = Actor.getDef(player);
	var dmgInfo = Combat.collision.damage.calculate(bullet.dmg,def);
	if(!dmgInfo.sum) return;
	
	Actor.changeHp(player,-dmgInfo.sum);
	
	if(player.damagedBy[bullet.parent] === undefined) { player.damagedBy[bullet.parent] = 0; }
	player.damagedBy[bullet.parent] += dmgInfo.sum;
	
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
	}
	info.sum = sum;
	return info;
}



//TargetIf hitIf
Combat.targetIf = {};
Combat.hitIf = {};

Combat.targetIf.global = function(atk,def){
	//Used first in every target if test
	return atk.id !== def.id 
	&& atk.parent !== def.id 
	&& !def.dead 
	&& def.combat 
	&& (def.type === 'player' || def.type === 'enemy')
	&& List.all[def.id];
}

Combat.targetIf.list = {
	//List of commons Target if 
	
	'player-simple':(function(def,atk){ 
		return def.type === "player";
	}),
	'enemy-simple':(function(def,atk){ 
		return def.type === "enemy";
	}),
	
	'player':(function(def,atk){ 
		try {
			if(!def.summoned) return def.type === "player"; 
			
			if(def.summoned.father === atk.id) return false;
			var hIf = typeof atk.hitIf === 'function' ? atk.hitIf : Combat.hitIf.list[atk.hitIf];
			return hIf(List.all[def.summoned.father],atk);
			
		} catch(err) { logError(err); }
	}),
	'enemy':(function(def,atk){ 
		try {
			if(!def.summoned) return def.type === "enemy"; 
			
			if(def.summoned.father === atk.id) return false;
			var hIf = typeof atk.hitIf === 'function' ? atk.hitIf : Combat.hitIf.list[atk.hitIf];
			return hIf(List.all[def.summoned.father],atk);
			
		} catch(err) { logError(err); }
	}),
	'summoned':(function(def,atk){
		try {
			if(def.id === atk.summoned.father){ return false; }
			var master = List.all[atk.summoned.father];
			var hIf = typeof master.hitIf === 'function' ? master.hitIf : Combat.hitIf.list[master.hitIf];
			return hIf(def,master);
		} catch(err) { logError(err); } //quickfix
	}),
	
	'all':(function(def,atk){ return true }),
	'true':(function(def,atk){ return true }),
	'map':(function(def,atk){ return true }),
	'none':(function(def,atk){ return false }),
	'false':(function(def,atk){ return false }),
	
};



Combat.hitIf.global = Combat.targetIf.global;

(function(){
	for(var i in Combat.targetIf.list){Combat.targetIf.list[i].id = i;}
	Combat.hitIf.list = Combat.targetIf.list;
})();














































