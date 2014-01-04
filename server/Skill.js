//Skill
//testing github
Skill = {};

Skill.addExp = function(key,skill,amount,bonus){
	var player = List.all[key];
	var mod = bonus === false ? 1 : player.bonus.exp[skill];
	amount = typeof amount !== 'function' ? amount : amount(player.skill.lvl[skill],key);
	player.skill.exp[skill] += amount * mod;		
	Skill.updateLvl(key,skill);
}

Skill.addExp.bulk = function(key,array,bonus){
	for(var i in array){
		Skill.addExp(key,array[i][0],array[i][0],bonus);
	}
}


Skill.updateLvl = function(key,sk){
	var player = List.all[key];
	var main = List.main[key];
	
	if(!sk) sk = Cst.skill.list;
	sk = arrayfy(sk);
	
	for(var i in sk){
		var skill = sk[i];
		if(player.skill.exp[skill] >= Cst.exp.list[player.skilllvl[skill]+1]){
			var newLvl = binarySearch(Cst.exp.list,player.skillexp[skill]);
			
			var lvlDiff = newLvl-player.skill.lvl[skill];
			main.passivePt += lvlDiff;
			
			player.skill.lvl[skill] = newLvl;
			Skill.lvlUp(key,skill);
			
		}
	}
}

Skill.lvlUp = function(key,skill){
	Chat.add(key,'You are level ' + List.all[key].skill.lvl[skill] + ' in ' + skill.capitalize() + '!');
}

Skill.testLvl = function(key,sk,lvl){
	var player = List.all[key];
	
	if(typeof sk !== 'object'){	var skill = {};	skill[sk] = lvl;	} 
	else {var skill = sk;}
	
	for(var i in skill){
		if(player.skill.lvl[i] < skill[i]) return false;		
	}
		
	return true;
}






