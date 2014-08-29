//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','Init','Actor']));

Init.db.statCustom = function(){
	var a = Db.statCustom = {};
	//pb = player.boost ||| statCustom are added to Db.stat ||| location =  player.statCustom
	
	a.balancedAtk = {
		'name':'Risk Taker',
		'description':'x2 Life Leech. Cannot use Potions.',
		'icon':'element.melee',
		'func':(function(pb,value,act){
			if(!value) return;
			var mod;
			var pbl = pb.list;
			var array = ['x','*','^','+'];
			for(var st in CST.element.list){
				var i = CST.element.list[st];
				var min = 100000;
				for(var j in array){
					if(j == 3){ mod = 1; } else { mod = 0; }
					min = Math.min(min,pbl['dmg-' + i + '-' + array[j]].base + mod);
				}
				for(var j in array){
					if(j == 3){ mod = 1; } else { mod = 0; }
					pbl['dmg-' + i + '-' + array[j]].base = min-mod;
				}		
			}
		})
	}
	
	a.testing = {
		'name':'testing Taker',
		'description':'testing.',
		'icon':'element.melee',
		'func':(function(pb,value,act){
			if(!value) return;
			var pbl = pb.list;
			
			pbl['maxSpd'].min = 0;
			pbl['maxSpd'].max = 0;
		})
	};
	
	for(var i in a)
		if(typeof a[i].displayInWindow === 'undefined') a[i].displayInWindow = 1;
	
	var list = [
		['meleeBig','Bleeding Blood','attackMelee.cube'],
		['windKnock','Wind','attackRange.steady'],
		['magicBullet','Magic Bullet','attackMagic.ball'],
		['magicBomb','Magic Explosion','attackMagic.ball'],
		['fireBullet','Fire Ball','attackMagic.meteor'],
		['coldBullet','Ice Shards','attackMagic.crystal'],
		['lightningBullet','Lightning Bullet','attackMagic.static'],
		['lightningBomb','Lightning Explosion','attackMagic.static'],
		['heal','Regen','heal.plus'],
		['healFast','Fast Regen','heal.plus'],
		['healCost','Expensive Regen','heal.plus'],
		['healSlowCast','Slow Cast Regen','heal.plus'],
		['dodgeFast','Fast Dodge','blessing.spike'],
		['dodgeLife','Life Dodge','blessing.spike'],
	
	]
	for(var i in list)
		ability(a,list[i][0],list[i][1],list[i][2]);
	
}

var ability = function(a,id,name,icon){
	id = 'Qsystem-player-' + id;
	a['ability-' + id] = {
		name:name,
		description:'Grant ability ' + name,
		icon:icon,
		func:ability.func(id),
		displayInWindow:0,
	}
}

ability.func = function(name){
	return function(pb,value,act){
		if(!SERVER) return;
		if(act.combatContext.ability !== 'normal') return;
		if(value && !Actor.getAbilityList(act)[name]){
			Actor.ability.add(act,name,true);			
		}
		if(!value && Actor.getAbilityList(act)[name]){
			Actor.ability.remove(act,name);		
		}
	}
}



//ts("Actor.permBoost(p,'test',[{stat:'custom-testing',value:1,type:'+'}]);");

