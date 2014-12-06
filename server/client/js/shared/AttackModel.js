//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Sprite']));



var AttackModel = exports.AttackModel = function(info,addDefaultStatus){
	var tmp = {
		//All
		type:'bullet',
		dmg:AttackModel.Dmg(0,'melee'),
		hitAnim:null,	//when enemy get hits, use anim on him {name,sizeMod}
		damageIfMod:0, //if 1, hit allies
		amount:1,	//# bullets shot
		aim:0,
		angleRange:5,
		bleed:AttackModel.Status(),	//magn and time act as modifier
		knock:AttackModel.Status(),
		drain:AttackModel.Status(),
		burn:AttackModel.Status(),
		chill:AttackModel.Status(),
		stun:AttackModel.Status(),
		crit:AttackModel.Status(),	//100% will be multiplied by the 0.05 of player
		leech:AttackModel.Status(),	
		curse:null,	//not in IDE yet
		onHit:null,
		onHitHeal:null,
		ghost:0,
		
		//Strike Only
		width:10,      			//width for strike
		height:10,       		//height for strike
		delay:0,   				//delay between cast and dmg phase for strike
		onDamagePhase:null,				//call another attack when strike goes live
		maxHit:5,
		preDelayAnim:null,
		postDelayAnim:null,
		
		initPosition:AttackModel.InitPosition(),
		
		//Bullet Only
		pierce:null,
		maxTimer:40,
		spd:10,
		onMove:null,
		boomerang:null,
		parabole:null,
		sin:null,
		sprite:AttackModel.Sprite('fireball',1),	//overwritten by sprite
	}
	for(var i in info) tmp[i] = info[i];
	if(addDefaultStatus !== false) AttackModel.addDefaultStatus(tmp);
	return tmp;
}

AttackModel.Parabole = function(height,min,max,timer){
	return {
		height:height*10,	//height of parabole (distance from middle)
		min:min*100,		//min distance where bullets will collide
		max:max*500,		//max distance where bullets will collide
		timer:timer*50,		//time before bullets collide
	}
}
AttackModel.Sin = function(amp,freq){
	return {
		amp:amp*2,
		freq:freq*2,
	}
}
AttackModel.Boomerang = function(comeBackTime,spd,spdBack,newId){
	return {
		comeBackTime:comeBackTime*15,//time before bullet turns 180 degre
		spd:spd*2,					//spd mod
		spdBack:spdBack*2,			//spd mod when bullet comes back
		newId:Tk.nu(newId,true),	//after turn back, renew id so it can hit enemy again
	}
}
AttackModel.Dmg = function(main,me,ra,ma,fi,co,li){
	return {
		main:main || 0,
		ratio:CST.element.template(me,ra,ma,fi,co,li)
	};
}
AttackModel.Status = function(chance,magn,time){
	return {
		chance:chance || 0,
		magn:magn || 1,
		time:time || 1
	};
}
AttackModel.Pierce = function(chance,dmgReduc,amount){
	return {
		chance:chance||0,
		dmgReduc:dmgReduc||0.5,
		amount:amount||5
	};
}	
AttackModel.OnMove = function(period,rotation,attack){
	return {
		period:period || 25,
		rotation:rotation || 0,
		attack:AttackModel(attack)
	};
}
AttackModel.Curse = function(chance,boost){
	return {
		chance:chance || 0,
		boost:boost || null
	};
}
AttackModel.OnHit = AttackModel._onDamagePhase = function(chance,attack){
	return {
		chance:chance || 0,
		attack:AttackModel(attack)
	};
}
AttackModel.Sprite = function(name,sizeMod){
	return Sprite(name,sizeMod);
}
AttackModel.OnHitHeal = function(hp,mana){
	return {
		hp:hp||0,
		mana:mana||0,
	};
}

//###################

AttackModel.addDefaultStatus = function(model){	//select 1st element, if no status, add 5% status default
	var el = AttackModel.getElement(model);
	var status = CST.element.toStatus[el];
	if(model[status]) return;	//do not overwrite
	model[status] = AttackModel.Status(0.05,1,1);
}

AttackModel.getElement = function(model){
	for(var el in model.dmg.ratio) 
		if(model.dmg.ratio[el]) return el;	
}

AttackModel.InitPosition = function(min,max,type){
	return {
		type:min === undefined ? 'actor' : 'mouse',	//or mouse
		min:min || 0,
		max:max === undefined ? 50 : max,
	}
}


