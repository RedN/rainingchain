/*
Db.boost = {'piece':{},'base':{}};
var a = Db.boost.piece;

a = {
	amulet:[
		{'stat':'dmg','boostMod':123,'chanceMod':1231},
		
	
	
	
	
	
	],
	




}


Db.boost.base = 
	'dmg':[012,2312],

}

Db.boost.group = 
	'dmg-fire':['dmg-fire-x','dmg-fire-+'],
	'amulet-base':['dmg-fire'],



}




for(var i in Db.boost.group){
	for(var j in Db.boost.group[i]){
		Db.boost.group[i] = helper(Db.boost.group[i][j]);		
	}
}

var helper = function(info){
	if(typeof help === 'string) return [info];
	var array = [];
	for(var i in info){
		if(typeof info[i] === 'string'){	//aka also a nickname
			array.push(helper(Db.boost.group[info[i]));
		} else {
			array.push(info[i]);
		}
	}
	return array.toString().split(',');
}









*/




//BOOST
Init.db.boost = function(){
	//stats in [] are transformed into multiple stats using boostPreDbConvertList.
	//value: [min,max], mod: chance to be picked
	
	var boostPreDb = {};
	boostPreDb['melee'] = [
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];
	boostPreDb['range'] = [
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];
	
	boostPreDb['magic'] = [
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];
	
	boostPreDb['bracelet'] = [
		{'stat':'acc','lvl':0,'mod':1,'value':[0.2,0.4]},
		{'stat':'pickRadius','lvl':0,'mod':1,'value':[1000,1000]},
		{'stat':'item-quantity','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];
	
	boostPreDb['helm'] = [
		{'stat':'pickRadius','lvl':0,'mod':1,'value':[1000,1000]},
		{'stat':'item-quality','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];
	
	boostPreDb['amulet'] = [
		{'stat':'pickRadius','lvl':0,'mod':1,'value':[1000,1000]},
		{'stat':'item-rarity','lvl':0,'mod':1,'value':[.3,.3]},		
		{'stat':['status-all'],'lvl':0,'mod':5,'value':[.1,.3]},		
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];
	
	boostPreDb['gloves'] = [
		{'stat':'pickRadius','lvl':0,'mod':1,'value':[1000,1000]},
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':'strike-range','lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];
	
	boostPreDb['body'] = [
		{'stat':'item-quantity','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];
	
	boostPreDb['shield'] = [
		{'stat':'strike-size','lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':'item-quality','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];

	boostPreDb['boots'] = [
		{'stat':'maxSpd','lvl':0,'mod':1,'value':[1,3]},
		{'stat':'acc','lvl':0,'mod':1,'value':[0.2,0.4]},
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
	];

	boostPreDb['pants'] = [
		{'stat':'maxSpd','lvl':0,'mod':1,'value':[1,3]},
		{'stat':'acc','lvl':0,'mod':1,'value':[0.2,0.4]},
		{'stat':'item-quantity','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':'bullet-amount','lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];


	boostPreDb['ring'] = [
		{'stat':'item-quantity','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':'item-quality','lvl':0,'mod':1,'value':[.3,.3]},
		{'stat':'item-rarity','lvl':0,'mod':1,'value':[.3,.3]},		
		{'stat':['status-all'],'lvl':0,'mod':5,'value':[.1,.3]},		
		{'stat':['dmg'],'lvl':0,'mod':5,'value':[0.05,0.10]},
		{'stat':['def'],'lvl':0,'mod':3,'value':[0.05,0.10]},
		{'stat':['weapon'],'lvl':0,'mod':3,'value':[0.05,0.10]},
	];


	
	var boostPreDbConvertList = {
		'dmg':['dmg-melee-+','dmg-melee-*','dmg-melee-x','dmg-melee-^','dmg-range-+','dmg-range-*','dmg-range-x','dmg-range-^','dmg-magic-+','dmg-magic-*','dmg-magic-x','dmg-magic-^','dmg-fire-+','dmg-fire-*','dmg-fire-x','dmg-fire-^','dmg-cold-+','dmg-cold-*','dmg-cold-x','dmg-cold-^','dmg-lightning-+','dmg-lightning-*','dmg-lightning-x','dmg-lightning-^'],
		'dmg-+':['dmg-melee-+','dmg-range-+','dmg-magic-+','dmg-fire-+','dmg-cold-+','dmg-lightning-+'],'dmg-^':['dmg-melee-^','dmg-range-^','dmg-magic-^','dmg-fire-^','dmg-cold-^','dmg-lightning-^'],'dmg-*':['dmg-melee-*','dmg-range-*','dmg-magic-*','dmg-fire-*','dmg-cold-*','dmg-lightning-*'],'dmg-x':['dmg-melee-x','dmg-range-x','dmg-magic-x','dmg-fire-x','dmg-cold-x','dmg-lightning-x'],'dmg-+':['dmg-melee-+','dmg-range-+','dmg-magic-+','dmg-fire-+','dmg-cold-+','dmg-lightning-+'],'dmg-^':['dmg-melee-^','dmg-range-^','dmg-magic-^','dmg-fire-^','dmg-cold-^','dmg-lightning-^'],'dmg-*':['dmg-melee-*','dmg-range-*','dmg-magic-*','dmg-fire-*','dmg-cold-*','dmg-lightning-*'],'dmg-x':['dmg-melee-x','dmg-range-x','dmg-magic-x','dmg-fire-x','dmg-cold-x','dmg-lightning-x'],
		'dmg-melee':['dmg-melee-+','dmg-melee-*','dmg-melee-x','dmg-melee-^'],
		'dmg-range':['dmg-range-+','dmg-range-*','dmg-range-x','dmg-range-^'],
		'dmg-magic':['dmg-magic-+','dmg-magic-*','dmg-magic-x','dmg-magic-^'],
		'dmg-fire':['dmg-fire-+','dmg-fire-*','dmg-fire-x','dmg-fire-^'],
		'dmg-cold':['dmg-cold-+','dmg-cold-*','dmg-cold-x','dmg-cold-^'],
		'dmg-lightning':['dmg-lightning-+','dmg-lightning-*','dmg-lightning-x','dmg-lightning-^'],
	
		'def':['def-melee-+','def-melee-*','def-melee-x','def-melee-^','def-range-+','def-range-*','def-range-x','def-range-^','def-magic-+','def-magic-*','def-magic-x','def-magic-^','def-fire-+','def-fire-*','def-fire-x','def-fire-^','def-cold-+','def-cold-*','def-cold-x','def-cold-^','def-lightning-+','def-lightning-*','def-lightning-x','def-lightning-^'],
		'def-+':['def-melee-+','def-range-+','def-magic-+','def-fire-+','def-cold-+','def-lightning-+'],'def-^':['def-melee-^','def-range-^','def-magic-^','def-fire-^','def-cold-^','def-lightning-^'],'def-*':['def-melee-*','def-range-*','def-magic-*','def-fire-*','def-cold-*','def-lightning-*'],'def-x':['def-melee-x','def-range-x','def-magic-x','def-fire-x','def-cold-x','def-lightning-x'],'dmg-+':['dmg-melee-+','dmg-range-+','dmg-magic-+','dmg-fire-+','dmg-cold-+','dmg-lightning-+'],'dmg-^':['dmg-melee-^','dmg-range-^','dmg-magic-^','dmg-fire-^','dmg-cold-^','dmg-lightning-^'],'dmg-*':['dmg-melee-*','dmg-range-*','dmg-magic-*','dmg-fire-*','dmg-cold-*','dmg-lightning-*'],'dmg-x':['dmg-melee-x','dmg-range-x','dmg-magic-x','dmg-fire-x','dmg-cold-x','dmg-lightning-x'],
		'def-melee':['def-melee-+','def-melee-*','def-melee-x','def-melee-^'],
		'def-range':['def-range-+','def-range-*','def-range-x','def-range-^'],
		'def-magic':['def-magic-+','def-magic-*','def-magic-x','def-magic-^'],
		'def-fire':['def-fire-+','def-fire-*','def-fire-x','def-fire-^'],
		'def-cold':['def-cold-+','def-cold-*','def-cold-x','def-cold-^'],
		'def-lightning':['def-lightning-+','def-lightning-*','def-lightning-x','def-lightning-^'],
		
		'weapon':['weapon-mace','weapon-spear','weapon-sword','weapon-bow','weapon-boomerang','weapon-crossbow','weapon-wand','weapon-staff','weapon-orb'],		
		'weapon-melee':['weapon-mace','weapon-spear','weapon-sword'],
		'weapon-range':['weapon-bow','weapon-boomerang','weapon-crossbow'],
		'weapon-magic':['weapon-wand','weapon-staff','weapon-orb'],
			
		'status-all':['burn-magn','burn-chance','burn-time','chill-magn','chill-chance','chill-time','confuse-magn','confuse-chance','confuse-time','bleed-magn','bleed-chance','bleed-time','knock-magn','knock-chance','knock-time','drain-magn','drain-chance','drain-time'],
		'status-magn':['burn-magn','chill-magn','confuse-magn','bleed-magn','knock-magn','drain-magn'],
		'status-chance':['burn-chance','chill-chance','confuse-chance','bleed-chance','knock-chance','drain-chance'],
		'status-time':['burn-time','chill-time','confuse-time','bleed-time','knock-time','drain-time'],
		'burn-all':['burn-magn','burn-chance','burn-time'],
		'chill-all':['chill-magn','chill-chance','chill-time'],
		'confuse-all':['confuse-magn','confuse-chance','confuse-time'],
		'bleed-all':['bleed-magn','bleed-chance','bleed-time'],
		'knock-all':['knock-magn','knock-chance','knock-time'],
		'drain-all':['drain-magn','drain-chance','drain-time'],
		
	
	}
	
	var toRemove = [];  //remove the stats in [] and transform in list of stat
	for(var i in boostPreDb){
		for(var k in boostPreDb[i]){
			if(typeof boostPreDb[i][k].stat !== 'string'){
				var stat = boostPreDb[i][k].stat[0];
				var array = boostPreDbConvertList[stat];
				for(var j in array){
					boostPreDb[i].push({'stat':array[j],'lvl':boostPreDb[i][k].lvl,'mod':boostPreDb[i][k].mod/array.length,
											'value':boostPreDb[i][k].value});
				}
				toRemove.push(boostPreDb[i][k]);
			}
		}
		for(var m in toRemove){	boostPreDb[i].splice(boostPreDb[i].indexOf(toRemove[m]),1); }
	}
		
	Db.boost = boostPreDb;
}
