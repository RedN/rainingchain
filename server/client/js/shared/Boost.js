//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Stat'],['Boost']));



var Boost = exports.Boost = function(name,stat,value,time,type){
	time = time || CST.bigInt;
	var spd = time < 25 ? 'fast' : (time >= 250 ? 'fast' : 'reg');
	if(!Stat.get(stat)) return ERROR(3,'invalid stat',stat);
	return {
		id:stat + Boost.SEPARATOR + name,
		stat:stat || ERROR(3,'stat needed'),
		name:name || ERROR(3,'name needed'),
		value:value,
		type:type || '*',
		time:time,
		spd:spd
	}
}

Boost.Perm = function(stat,value,type){
	if(!Stat.get(stat)) return ERROR(3,'invalid stat',stat);
	return {
		stat:stat,
		value:value,
		type:type,	
	}
}

Boost.stackSimilarPerm = function(list){	//if boost same thing, add values
	var tmp = {};	
	for(var i in list){
		var name = list[i].type + list[i].stat;
		if(!tmp[name]) tmp[name] = list[i];
		else tmp[name].value += list[i].value;
	}
	var array = [];
	for(var i in tmp) array.push(tmp[i]);
	return array;
}

Boost.FROM_ABILITY = 'combat.collision.curse';
Boost.SEPARATOR = '@';	//separator
