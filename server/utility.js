
//Used first in every target if test
globalTargetIf = function(atk,def){
	return atk.id != def.id && !def.dead && def.combat && (def.type == 'player' || def.type == 'enemy') && fullList[def.id];
}

//Used first in every hit if test
globalHitIf = function(atk,def){
	return atk.id != def.id && atk.id != def.parent && !def.dead && def.combat && (def.type == 'player' || def.type == 'enemy') && fullList[def.id];
}

//Make it so dmg ratio is always 0<x<1
setDmgViaRatio = function(info){
	var dmg = {};
	var sum = 0;
	for(var i in info.dmgRatio){sum += info.dmgRatio[i];}
	for(var i in info.dmgRatio){info.dmgRatio[i] = info.dmgRatio[i] / sum;}
	for(var i in info.dmgRatio){ dmg[i] = info.dmgRatio[i] * info.dmgMain; }
	return dmg;
}

//Randomly select a mod in a list where mod[i].lvl >= lvl. Take into consideration the mod factor.
randomViaMod = function(list,lvl){
	var sum = 0; 
	for(var i in list){ 
		if(!lvl || (lvl && list[i].lvl <= lvl)){
			sum += list[i].mod; 
		}
	}
	var random = Math.random() * sum;
	for(var i in list){ 
		if(!lvl || (lvl && list[i].lvl <= lvl)){
			if(random < list[i].mod){ return deepClone(list[i]); } 
			random -= list[i].mod;	
		}
	}
	return -1
}


talkTo = function(key,enemyId){
	if(fullList[enemyId].dialogue){
		fullList[enemyId].dialogue(key);
	}
}

//List of commons Target if 
targetIfList = {
	'player':(function(tar,self){ 
		try {
			if(tar.summoned){
				if(tar.summoned.father == self.id){ return false }
				var hIf = typeof self.hitIf == 'function' ? self.hitIf : hitIfList[self.hitIf];
				return hIf(fullList[tar.summoned.father],self);
			}
			return tar.type == "enemy"; 
		} catch(err) { logError(err); }
	}),
	'enemy':(function(tar,self){ 
		try {
		if(tar.summoned){
			if(tar.summoned.father == self.id){ return false }
			var hIf = typeof self.hitIf == 'function' ? self.hitIf : hitIfList[self.hitIf];
			return hIf(fullList[tar.summoned.father],self);
		}
		return tar.type == "player"; 
		} catch(err) { logError(err); }
	}),
	'all':(function(tar,self){ return true }),
	'true':(function(tar,self){ return true }),
	'none':(function(tar,self){ return false }),
	'false':(function(tar,self){ return false }),
	'summoned':(function(tar,self){
		try {
			if(tar.id == self.summoned.father){ return false; }
			var hIf = typeof fullList[self.summoned.father].hitIf == 'function' ? fullList[self.summoned.father].hitIf : hitIfList[fullList[self.summoned.father].hitIf];
			return hIf(tar,fullList[self.summoned.father]);
		} catch(err) { logError(err); } //quickfix
	}),
}

for(var i in targetIfList){targetIfList[i].id = i;}
hitIfList = targetIfList;


