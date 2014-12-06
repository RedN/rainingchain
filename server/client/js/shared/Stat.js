//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor'],['Stat']));
if(SERVER) eval('var Stat');

(function(){ //}

//assumes 'Qsystem-player-' is in front of custom ability

Stat = exports.Stat = function(id,name,description,icon,path,value,playerOnly,customFunc,customVisible){
	if(DB[id]) return ERROR('id already taken');
	DB[id] = {
		id:id || ERROR(2,'id needed'),
		name:name || '',
		description:description || '',
		icon:icon || '',
		path:path || ERROR(2,'path needed'),
		value:value || Stat.Value(),
		playerOnly:playerOnly || false, //if not playerOnly : cant be boosted with equip/curse for non player
		custom:!!customFunc,
		customFunc:customFunc || null,
		customVisible:!!customVisible	//for custom, if appear in Custom:... in stat window
	}
}
var DB = Stat.DB = {};

Stat.get = function(id){
	return DB[id] || null;
}

Stat.Value = function(info){
	info = info || {};
	return {
		base:info.base || 0,
		min:info.min || 0,
		max:info.max || 100000,
	}
}

Stat.actorBonus = null;	

Stat.actorStatCustom = null;

Stat.actorBoostList = null;

Stat.setValue = function(act,stat,value){
	var path = DB[stat].path;
	Tk.viaArray.set({'origin':act,'array':path,'value':value});
}

Stat.getValue = function(act,stat){
	var path = DB[stat].path;
	return Tk.viaArray.get({'origin':act,'array':path});
}
	
//################
	
var initStat = function(){	//global in client...
	Stat('maxSpd','Max Speed','Movement Speed.','defensive.speed',["maxSpd"],Stat.Value({
		base:12,
	}),false);
	Stat('acc','Acceleration','Movement Acceleration.','defensive.speed',["acc"],Stat.Value({
		base:12,
	}),false);
	Stat('friction','Friction','Movement Friction','defensive.speed',["friction"],Stat.Value({
		base:0.5,max:1,
	}),true);
	Stat('aim','Aim','How precise your attacks are. Only affect direction. (Still same chance to deal damage.)','element.range',["aim"],Stat.Value({}),false);
	Stat('hp-regen','Regen Life','Life Regeneration per frame.','resource.hp',["hpRegen"],Stat.Value({
		base:1,
	}),false);
	Stat('mana-regen','Regen Mana','Mana Regeneration per frame.','resource.mana',["manaRegen"],Stat.Value({
		base:0.4,
	}),false);
	Stat('hp-max','Max Life','Maximum Life Points.','resource.hp',["hpMax"],Stat.Value({
		base:1000,
	}),false);
	Stat('mana-max','Max Mana','Maximum Mana Points.','resource.mana',["manaMax"],Stat.Value({
		base:100,
	}),false);
	Stat('leech-magn','Leech Life Magn.','Affect %Life recovered if the Life Leech is successful. Leech is not affected by damage dealt.','resource.hp',["bonus","leech","magn"],Stat.Value({
		base:0.01,
	}),false);
	Stat('leech-chance','Leech Life Chance','Affect Chance to Life Leech when hitting an enemy.','resource.hp',["bonus","leech","chance"],Stat.Value({}),false);
	Stat('pickRadius','Pick Radius','Maximum distance that you can still pick items on the ground.','defensive.pickup',["pickRadius"],Stat.Value({
		base:250,min:5,
	}),true);
	Stat('magicFind-quantity','Item Quantity','Chance to receive more drops from enemies. Quantity impacts chance that an enemy will drop something.','defensive.magicFind',["magicFind","quantity"],Stat.Value({}),true);
	Stat('magicFind-quality','Item Quality','Chance to receive higher quality plans from enemies. Quality impacts chance to roll top-bracket stats.','defensive.magicFind',["magicFind","quality"],Stat.Value({}),true);
	Stat('magicFind-rarity','Item Rarity','Chance to receive higher rarity plans from enemies. Rarity impacts chance to have additional boost on crafted equip.','defensive.magicFind',["magicFind","rarity"],Stat.Value({}),true);
	Stat('atkSpd','Atk Speed','Affect how fast your character can use abilities.','offensive.atkSpd',["atkSpd"],Stat.Value({
		base:1,
	}),false);
	Stat('crit-chance','Crit Chance','Affect chance to do a Critical Hit.','offensive.strike',["bonus","crit","chance"],Stat.Value({
		base:0.05,
	}),false);
	Stat('crit-magn','Crit Magn','Affect Additional Damage when doing a Critical Hit.','offensive.strike',["bonus","crit","magn"],Stat.Value({
		base:1.5,
	}),false);
	Stat('bullet-amount','Proj. Amount','Shoot x times additional bullets.  If amount is not whole, it is rounded up or down randomly.','offensive.bullet',["bonus","bullet","amount"],Stat.Value({
		base:1,
	}),false);
	Stat('bullet-spd','Proj. Spd','Affect speed at which your bullet travels.','offensive.bullet',["bonus","bullet","spd"],Stat.Value({
		base:1,
	}),false);
	Stat('strike-range','Strike Range','Affect the minimum and maximum distance where you can strike.','offensive.strike',["bonus","strike","range"],Stat.Value({
		base:1,
	}),true);
	Stat('strike-size','AoE Size','Affect the width and height of your strike.','offensive.strike',["bonus","strike","size"],Stat.Value({
		base:1,
	}),true);
	Stat('strike-maxHit','AoE Max Target','Affect the maximum amount of target that can be hit by the same strike.','offensive.strike',["bonus","strike","maxHit"],Stat.Value({
		base:1,
	}),true);
	Stat('burn-time','Burn Time','Affect Burn Duration.','status.burn',["bonus","burn","time"],Stat.Value({
		base:100,
	}),false);
	Stat('burn-magn','Burn Magn','Affect damage dealt to a burnt enemy.','status.burn',["bonus","burn","magn"],Stat.Value({
		base:0.005,
	}),false);
	Stat('burn-chance','Burn Chance','Affect chance to burn enemy.','status.burn',["bonus","burn","chance"],Stat.Value({
		base:1,
	}),false);
	Stat('chill-time','Chill Time','Affect Chill Duration.','status.chill',["bonus","chill","time"],Stat.Value({
		base:50,
	}),false);
	Stat('chill-magn','Chill Magn','Affect how much speed and attack speed with be reduced.','status.chill',["bonus","chill","magn"],Stat.Value({
		base:2,
	}),false);
	Stat('chill-chance','Chill Chance','Affect chance to chill enemy.','status.chill',["bonus","chill","chance"],Stat.Value({
		base:1,
	}),false);
	Stat('stun-time','Stun Time','Affect Stun Duration.','status.stun',["bonus","stun","time"],Stat.Value({
		base:10,
	}),false);
	Stat('stun-magn','Stun Magn','Affect how reduced the sight of view of stund enemy is.','status.stun',["bonus","stun","magn"],Stat.Value({
		base:2,
	}),false);
	Stat('stun-chance','Stun Chance','Affect chance to stun enemy.','status.stun',["bonus","stun","chance"],Stat.Value({
		base:1,
	}),false);
	Stat('bleed-time','Bleed Time','Affect Bleed Duration.','status.bleed',["bonus","bleed","time"],Stat.Value({
		base:25,
	}),false);
	Stat('bleed-magn','Bleed Magn','Affect damage dealt by bleeding enemy.','status.bleed',["bonus","bleed","magn"],Stat.Value({
		base:4,
	}),false);
	Stat('bleed-chance','Bleed Chance','Affect chance to bleed enemy.','status.bleed',["bonus","bleed","chance"],Stat.Value({
		base:1,
	}),false);
	Stat('drain-time','Drain Time','USELESS. Affect how long the enemy will be drained.','status.drain',["bonus","drain","time"],Stat.Value({
		base:100,
	}),false);
	Stat('drain-magn','Drain Magn','Affect how much mana is drained from enemy.','status.drain',["bonus","drain","magn"],Stat.Value({
		base:25,
	}),false);
	Stat('drain-chance','Drain Chance','Affect chance to drain enemy.','status.drain',["bonus","drain","chance"],Stat.Value({
		base:1,
	}),false);
	Stat('knock-time','Knock Time','Affect how long the enemy will be pushed back.','status.knock',["bonus","knock","time"],Stat.Value({
		base:25,
	}),false);
	Stat('knock-magn','Knock Magn','Affect how far away the enemy will be pushed.','status.knock',["bonus","knock","magn"],Stat.Value({
		base:10,
	}),false);
	Stat('knock-chance','Knock Chance','Affect chance to push enemy with your attack.','status.knock',["bonus","knock","chance"],Stat.Value({
		base:1,
	}),false);
	Stat('resist-burn','Burn Resist','','status.burn',["statusResist","burn"],Stat.Value({}),false);
	Stat('resist-chill','Chill Resist','','status.chill',["statusResist","chill"],Stat.Value({}),false);
	Stat('resist-drain','Drain Resist','','status.drain',["statusResist","drain"],Stat.Value({}),false);
	Stat('resist-stun','Stun Resist','','status.stun',["statusResist","stun"],Stat.Value({}),false);
	Stat('resist-knock','Knock Resist','','status.knock',["statusResist","knock"],Stat.Value({}),false);
	Stat('resist-bleed','Bleed Resist','','status.bleed',["statusResist","bleed"],Stat.Value({}),false);
	
	
	
	for(var i in {def:1,dmg:1}){
		for(var j in CST.element.list){
			var el = CST.element.list[j];
			for(var k in {'+':1,'*':1,'^':1,'x':1,'mod':1}){
				var id = i + '-' + el + '-' + k;
				var name = i.capitalize() + '-' + el.capitalize() + '-' + k;
				if(i === 'def')	var description = 'Reduce ' + el.capitalize() + ' Damage Taken';
				else var description = 'Increase ' + el.capitalize() + ' Damage Dealt';
				var icon = 'element.' + el;
				var path = ["mastery",i,el,k];
				var value = {base:k === '+' ? 0 : 1};
				var playerOnly = k !== 'mod';
				Stat(id,name,description,icon,path,Stat.Value(value),playerOnly);
			}		
		}
	}
	
	for(var i in CST.equip.weapon){
		var w = CST.equip.weapon[i];
		Stat('weapon-' + w,'Dmg ' + w.capitalize(),'Increase Damage Dealt with ' + w.capitalize(),'weapon.' + w,["bonus","weapon",w],Stat.Value({}),true);
	}
		
	Stat('globalDef','Main Defense','Reduce Damage Taken from all elements.','blessing.multi',["globalDef"],Stat.Value({
		base:1,
	}),false);
	Stat('globalDmg','Main Damage','Increase Damage Dealt for all elements.','element.melee2',["globalDmg"],Stat.Value({
		base:1,
	}),false);
	Stat('summon-amount','Summon Amount','Affect how many summons you can have at once.','summon.wolf',["bonus","summon","amount"],Stat.Value({
		base:1,
	}),true);
	Stat('summon-time','Summon Time','Affect how long your summons last.','summon.wolf',["bonus","summon","time"],Stat.Value({
		base:1,
	}),true);
	Stat('summon-atk','Summon Atk','Affect the overall damage of your summons.','summon.wolf',["bonus","summon","atk"],Stat.Value({
		base:1,
	}),true);
	Stat('summon-def','Summon Def','Affect the overall defence of your summons.','summon.wolf',["bonus","summon","def"],Stat.Value({
		base:1,
	}),true);

	//custom
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
	];
	for(var i in list){
		var s = list[i];
		var id = 'Qsystem-player-' + s[0];	//ability id
		Stat(id,s[1],'Grant ability ' + s[1],s[2],
			['bonus','statCustom',id],Stat.Value({base:0}),true,funcGenerator(id),false);
	}
		
	initStat.actorBonus();
	initStat.actorBoostList();
};

initStat.actorBoostList = function(){
	//generate boost list attribute for Actor
	var p = {};
	var e = {};
	
	for(var i in DB){
		var s = DB[i];
		var b = {
			name:{},	//rename to list
			base:s.value.base,
			permBase:s.value.base,
			min:s.value.min,
			max:s.value.max,
		};
		p[i] = b;
		if(!s.playerOnly)
			e[i] = b;
	}
	
	Stat.actorBoostList = new Function('type', 'return type === "player" ? ' + Tk.stringify(p) + ' : ' + Tk.stringify(e));
	
}
	
	
initStat.actorBonus = function(){
	//generate bonus attribute for Actor
	var info = {};
	
	for(var i in DB){
		if(DB[i].path[0] === 'bonus'){
			var a = DB[i].path;
			var base = DB[i].value.base;
			
			info[a[1]] = info[a[1]] || {};	//always format ['bonus','category','precise']
			info[a[1]][a[2]] = base;
		}
	}
	Stat.actorBonus = new Function('return ' + Tk.stringify(info));
}
	
var funcGenerator = function(name){ //for custom ability
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




initStat();




})();
