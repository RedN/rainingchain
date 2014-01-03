
Draw.convert = {};

//Convert a boost object into a string.
Draw.convert.boost = function(boost){
	if(boost.type === 'custom'){ return Db.customBoost[boost.value].name; }

	var name = Db.stat[boost.stat].name;
	
	//Round and add %
	var value = boost.value;
	var rawValue = boost.value;
	if(Math.abs(value) < 1){ 
		value *= 100; value = round(value,2).toString() + '%';
	} else { value = round(value,2)};
	
	
	var last = name[name.length-1];
	if(last == 'x' ||  last == '*' || last == '+' || last == '^'){
		if(rawValue < 0){value = '-' + last + value;}
		if(rawValue > 0){value = last + value;}
		name = name.slice(0,-1);
	} else {
		if(value < 0){value = '-' + value;}
		if(value > 0){value = '+' + value;}
	}
	
	return [name,value];
	 
	/*
	if(boost.type == 'base'){	}
	else if(boost.type == 'max'){
		return '-Set Max ' + prename + ' to ' + value;
	} else if(boost.type == 'min'){
		return '-Set Min ' + prename + ' to ' + value;
	}
	*/
}

//Convert attack mod into a string
Draw.convert.attackMod = {
	'bleed':(function(a){ return round(a.chance*100,2) + '% to Bleed for ' + round(a.magn*100*a.time,2) + '% Initial Dmg over ' + round(a.time/25,2) + 's.'; }),
	'knock':(function(a){ return round(a.chance*100,2) + '% to Knockback by ' + round(a.magn*a.time,2) + ' pixel over ' + round(a.time/25,2) + 's.'; }),	
	'drain':(function(a){ return round(a.chance*100,2) + '% to Drain ' + round(a.magn*100,2) + '% Mana.'; }),
	'burn':(function(a){ return round(a.chance*100,2) + '% to Burn for ' + round(a.magn*100*a.time,2) + '% Hp of Monster\'s Remaining Hp over ' + round(a.time/25,2) + 's.'; }),
	'chill':(function(a){ return round(a.chance*100,2) + '% to Chill, reducing Speed by -' + round(a.magn*100,2) + '% for ' + round(a.time/25,2) + 's.'; }),
	'confuse':(function(a){ return round(a.chance*100,2) + '% to Confuse for ' + round(a.time/25,2) + 's.'; }),
	'leech':(function(a){ return round(a.chance*100,2) + '% to Life Leech ' + round(a.magn*100,2) + '% Hp'; }),
	'pierce':(function(a){ return round(a.chance*100,2) + '% to Pierce, reducing this attack damage by ' + round(100-a.dmgReduc*100,2) + '% Dmg.'; }),
	'curse':(function(a){ return round(a.chance*100,2) + '% to Lower ' + Db.stat[a.boost[0].stat].name + ' by ' + round(100-a.boost[0].value*100,2) + '% for ' + round(a.boost[0].time/25,2) + 's.'; }),
	'boomerang':(function(a){ return 'Boomerang'; }),
	'nova':(function(a){ return 'Nova'; }),
	'parabole':(function(a){ return 'Parabole Bullet'; }),
	'sin':(function(a){ return 'Sin Bullet'; }),
	'onHit':(function(a){ return 'Explosive'; }),
	'hitIfMod':(function(a){ return 'Affect Allies'; }),
}





Draw.convert.elementMod = function(type,name){
	type += '-';
	var b0 = round(player.boost.list[type + name + '-x'].base,2,1);
	var b1 = round(player.boost.list[type + name + '-*'].base,2,1);
	var b2 = round(player.boost.list[type + name + '-^'].base,2,1);
	var b3 = round(player.boost.list[type + name + '-+'].base,2,1);
	var sum = round(Math.pow(player.boost.list[type + name + '-x'].base*player.boost.list[type + name + '-*'].base,player.boost.list[type + name + '-^'].base) + player.boost.list[type + name + '-+'].base,3);
	var string = '( ' + b0 + ' * ' + b1 + ' ) ^ ' + b2 + ' + ' + b3 + ' = ' + sum;
	return string
}

Draw.convert.statusMod = function(type,name){
	if(type === 'off'){
		var b0 = round(player.boost.list[name + '-chance'].base,2,1);
		var b1 = round(player.boost.list[name + '-magn'].base,2,1);
		var b2 = round(player.boost.list[name + '-time'].base,2,1);

		var string = '%: ' + b0 + ', Magn: ' + b1 + ', Time: ' + b2;
		return string
	}
	if(type === 'def'){
		var b0 = round(player.boost.list['resist-' + name].base,2,1);
		var b1 = round(player.boost.list['resistMax-' + name].base,2,1);
		
		var string = 'Resist: ' + b0 + ', Max: ' + b1;
		return string
	}
}





Draw.gradientRG = function(n){
	n = Math.min(1,Math.max(0,n));
	if(n<0.5){
		var R = 0+(n*(255/0.5));
		var G = 255;
		var B = 0;
	} else {
		var n = n-0.5;
		var R = 255;
		var G = 255-(n*(255/0.5));
		var B = 0;
	} 
	return 'rgb(' + Math.round(R) + ',' + Math.round(G) + ',' + Math.round(B) + ')';
}








