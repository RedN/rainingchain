//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Attack','Collision','Message','Debug','Anim','Boost'],['Combat']));
/*
*INIT
every frame, boost ability charge, and globalCooldown--
if charge > period && pressed && globalCooldown < 0, start input 
reset other ability / mana if needed / globalCooldown

call custom func if action has func
anim	(player.sprite.anim)
preDelayAnimOverSprite	(Anim)

*ADD MODIFIERS
add player bonus to atk
add dmg from player to atk (mastery, globalDmg, curse)
add dmg from weapon to atk

spawn bullet or strike
*/



var Combat = exports.Combat = {};

Combat.attack = function(act,param,extra){   	
	var atk = typeof param === 'function' ? param() : Tk.deepClone(param); 
	
	extra = extra || {};
	
	if(extra.angle === undefined){
		extra.angle = act.angle;
	}
	
	if(extra.x === undefined){
		if(atk.initPosition.type === 'actor'){
			extra.x = act.x;
			extra.y = act.y;
		}	
		if(atk.initPosition.type === 'mouse'){
			var mouse = Actor.getMouse(act);
			var diff = Math.pyt(mouse.x - CST.WIDTH2,mouse.y - CST.HEIGHT2); //difference between actor and mouse
			diff = diff.mm(atk.initPosition.min,atk.initPosition.max);
			
			var goal = {x:diff * Tk.cos(act.angle) + act.x,y:diff * Tk.sin(act.angle) + act.y};
			
			var pos = atk.ghost ? goal : Collision.strikeMap(act,goal);	//get farthest possible without touching wall
			
			extra.x = pos.x;
			extra.y = pos.y;
		}
	}
		
	//Add Bonus and mastery
	atk = Combat.attack.mod(act,atk);	//Combat_sub.js	
	
	if(atk.preDelayAnim){
		Anim(atk.preDelayAnim,Anim.Target(extra.x,extra.y,act.map,act.viewedIf));	
	}
	Actor.setTimeout(act,function(){
		if(atk.postDelayAnim)
			Anim(atk.postDelayAnim,Anim.Target(extra.x,extra.y,act.map,act.viewedIf));
		Combat.attack.perform(act,atk,extra);
	},atk.delay);
}

Combat.attack.perform = function(player,atk,extra){   //extra used for stuff like boss loop
	//At this point, player.bonus/mastery must be already applied
	var atkList = [atk];
	for(var i = 1 ; i < atk.amount ; i ++)
		atkList.push(Tk.deepClone(atk));
	
	var initAngle = extra.angle + Math.randomML() * (atk.aim + player.aim) || 0;
	var atkAngle = atk.angleRange;	//required
	
	for(var i = 0 ; i < atkList.length ; i ++){
		var angle = initAngle + atkAngle * (atk.amount-2*(i+0.5)) / (atk.amount*2);
		Attack(atkList[i],player,{
			num:i,
			angle:(angle%360+360)%360,
			x:extra.x,
			y:extra.y
		});	
	}
	
	if(player.type === 'player'){
		player.spdX /= 2;
		player.spdY /= 2;
		Actor.boost(player,Boost('useAbility','acc',1/5,3,'*'));
	}
	if(player.type === 'npc'){
		player.spdX /= 8;
		player.spdY /= 8;
		Actor.boost(player,[
			Boost('useAbility','acc',1/5,6,'*'),
			Boost('useAbility','maxSpd',1/2,10,'*'),
		]);
	}
}


Combat.summon = function(master,param){
	var name = param.model;
	
	if(!master.summon[name]) master.summon[name] = Actor.Summon();

	var maxChild = param.maxChild; 
	var time = param.time;
	var atkMod = 1;
	var defMod = 1;
	
	if(master.bonus && master.bonus.summon){
		maxChild *= master.bonus.summon.amount;
		time *= master.bonus.summon.time;
		atkMod *= master.bonus.summon.atk;
		defMod *= master.bonus.summon.def;
	}
	
	if(master.summon[name].child.$length() > maxChild){ 
		if(Actor.isPlayer(master)) 
			Message.add(key,"You already have maximum amount of minions.");  
		return;
	}	
	
	for(var i = 0 ; i < param.amount && master.summon[name].child.$length() < maxChild; i++){
		var extra = {	//assume no other extra
			summoned:Actor.Summoned(master.id,name,time,param.distance),		
			targetIf:master.targetIf,//'summoned',
			damageIf:master.damageIf,//'summoned',
			damagedIf:master.damagedIf,//'summoned',
			viewedIf:master.viewedIf,//'summoned',
			combatType:master.combatType,
			quest:master.quest,	//for _enemyKilled
			awareNpc:1,
		}
		
		var spot = Actor.Spot(master.x,master.y,master.map);
		var act = Actor(param.model,extra);
		Actor.addToMap(act,spot);
		master.summon[name].child[act.id] = 1;	
		
		if(atkMod !== 1)
			Actor.boost(act,Boost('summon','globalDmg',atkMod,time,'*'));
		if(defMod !== 1)
			Actor.boost(act,Boost('summon','globalDmg',defMod,time,'*'));
	}	
}

Combat.boost = function(act,param){
	Actor.boost(act,param.boost);
}

Combat.heal = function(act,param){
	Actor.changeResource(act,param);
}
Combat.dodge = function(act,param){
	Actor.dodge(act,param.time,param.distance);
}

Combat.event = function(act,param){   	
	param.event(act.id);
}
Combat.idle = function(act,action){}

//COLLISION//
Combat.collision = function(b,act){
	if(act.attackReceived[b.hitId]) return;    //for pierce
    act.attackReceived[b.hitId] = 20*25;	//last for 20 sec
	
	if(b.hitAnim) 
		Anim(b.hitAnim,Anim.Target(act.id));
	if(b.onHitHeal)
		return Actor.changeResource(act,b.onHitHeal);
	
	if(b.crit && b.crit.chance >= Math.random())
		Combat.collision.crit(b)
	
	var dmg = Combat.collision.damage(b,act); if(typeof dmg === 'undefined') return;
	Combat.collision.reflect(dmg,b,act);
	
	//Mods
	if(b.leech && b.leech.chance >= Math.random())
		Combat.collision.leech(act,b);
		
	if(b.pierce && b.pierce.chance >= Math.random())
		Combat.collision.pierce(b)
	else b.toRemove = 1;
	
	if(b.onHit && b.onHit.chance >= Math.random())
		Combat.attack(b,b.onHit.attack);
	
	if(b.curse && b.curse.chance >= Math.random())
		Combat.collision.curse(act,b.curse);
	
	//Apply Status
	Actor.status.afflict(dmg,b,act);
	
}

//Apply Mods
Combat.collision.curse = function(act,info){
	for(var i in info.boost){
		var boost = info.boost[i];
		Actor.boost(act,boost); 
		
		act.curseClient[boost.stat] = boost.type + Tk.round(boost.value,2);
		Actor.setFlag(act,'curseClient');
	}
}

Combat.collision.pierce = function(b){
	if(--b.pierce.amount <= 0){ b.pierce.chance = 0; }
	b.globalDmg *= b.pierce.dmgReduc;
}

Combat.collision.leech = function(act,b){
	var info = b.leech;
	
	var player = Actor.get(b.parent);	
	var amount = (player.hpMax-player.hp) * info.magn;
	Actor.changeResource(player,{hp:amount});
	
}

Combat.collision.reflect = function(dmg,b,def){
	var atker = Actor.get(b.parent);
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
}

//Damage
Combat.collision.damage = function(atk,player){
	var def = Actor.getDef(player);
	var dmgInfo = Combat.collision.damage.calculate(atk.dmg,def);
	if(dmgInfo.sum === 0) return;
	if(!dmgInfo.sum) return ERROR(4,'dmg sum is NaN',atk.dmg,def);
	
	if(player.type === 'player' && Actor.isPlayer(atk.parent)) 
		dmgInfo.sum *= Debug.DMG_MOD.pvp;
		
	dmgInfo.sum *= Debug.DMG_MOD[player.type];	//TOFIX
	
	Actor.changeHp(player,-dmgInfo.sum);
	player.lastAbilitySkill = dmgInfo.mainType;
	
	player.damagedBy[atk.parent] = player.damagedBy[atk.parent] || 0;
	player.damagedBy[atk.parent] += dmgInfo.sum;
	
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
	&& Actor.get(def.id))
	
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
			
			if(def.summoned.parent === atk.id) return false;
			var hIf = typeof atk.damageIf === 'function' ? atk.damageIf : Combat.damageIf.list[atk.damageIf];
			return hIf(Actor.get(def.summoned.parent),atk);
			
		} catch(err) { ERROR.err(3,err); }
	}),
	'npc':(function(def,atk){ 
		try {
			if(!def.summoned) return def.combatType === "npc"; 
			
			if(def.summoned.parent === atk.id) return false;
			var hIf = typeof atk.damageIf === 'function' ? atk.damageIf : Combat.damageIf.list[atk.damageIf];
			return hIf(Actor.get(def.summoned.parent),atk);
			
		} catch(err) { ERROR.err(3,err); }
	}),
	'summoned':(function(def,atk){
		try {
			if(def.id === atk.summoned.parent){ return false; }
			var master = Actor.get(atk.summoned.parent);
			var hIf = typeof master.damageIf === 'function' ? master.damageIf : Combat.damageIf.list[master.damageIf];
			return hIf(def,master);
		} catch(err) { ERROR.err(3,err); } //quickfix
	}),
	
	'true':(function(def,atk){ return true }),
	'false':(function(def,atk){ return false }),
};

Combat.damageIf.global = Combat.targetIf.global;

Combat.damageIf.list = Combat.targetIf.list;



























