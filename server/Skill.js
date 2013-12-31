//Skill
//testing github
Skill = function(key,data){
    this.exp = {'melee':100000,'range':100000,'magic':100000,'metalwork':100000,'woodwork':100000,'leatherwork':100000,'geology':100000,'metallurgy':100000,'trapping':100000};
    this.lvl = {'melee':0,'range':0,'magic':0,'metalwork':0,'woodwork':0,'leatherwork':0,'geology':0,'metallurgy':0,'trapping':0};
    this.bonus = {'melee':0,'range':0,'magic':0,'metalwork':0,'woodwork':0,'leatherwork':0,'geology':0,'metallurgy':0,'trapping':0};
}


//Need to work
//Skill.prototype.
Skill.prototype.addExp = function(key,sk,amount,bonus){
	var player = List.all[key];
	if(bonus === undefined){ bonus = true; }
	
	if(typeof sk != 'object'){	var skill = {};	skill[sk] = amount;	} 
	else {var skill = sk;}
	
	for(var i in skill){
		mod = bonus ? player.bonus.exp[i] : 1;
		if(typeof skill[i] === 'function'){ skill[i] = skill[i](player.lvl[i],key); }
		player.exp[i] += skill[i] * mod;
		
		updateLvl(key,i);
	}
}

Skill.prototype.updateLvl = function(key,sk){
	var player = List.all[key];
	var main = List.main[key];
	
	if(!sk) sk = Cst.skill.list;
	else { sk = typeof sk == 'object' ? sk : [sk]; }
	
	for(var i in sk){
		var skill = sk[i];
		if(player.exp[skill] >= Cst.exp.list[player.lvl[skill]+1]){
			var newLvl = binarySearch(Cst.exp.list,player.exp[skill]);
			
			var lvlDiff = newLvl-player.lvl[skill];
			main.passivePt += lvlDiff;
			
			player.lvl[skill] = newLvl;
			lvlUp(key,skill);
			
		}
	}
}

Skill.prototype.lvlUp = function(key,skill){
	Chat.add(key,'You are level ' + List.all[key].lvl[skill] + ' in ' + skill.capitalize() + '!');
}

Skill.prototype.testLvl = function(key,sk,lvl){
	var player = List.all[key];
	
	if(typeof sk != 'object'){	var skill = {};	skill[sk] = lvl;	} 
	else {var skill = sk;}
	
	for(var i in skill){
		if(player.lvl[i] < skill[i]) return false;		
	}
		
	return true;
}