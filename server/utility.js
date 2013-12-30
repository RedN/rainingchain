
//Make it so dmg ratio is always 0<x<1
setDmgViaRatio = function(info){
	var dmg = {};
	var sum = 0;
	for(var i in info.dmgRatio){sum += info.dmgRatio[i];}
	for(var i in info.dmgRatio){info.dmgRatio[i] = info.dmgRatio[i] / sum;}
	for(var i in info.dmgRatio){ dmg[i] = info.dmgRatio[i] * info.dmgMain; }
	return dmg;
}






