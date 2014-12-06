//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Boost','Combat']));


/* IDK IF RELEVANT NOW
equip.def = sum of def of all piece || updated when player change armor, never udpated for enemy
mastery sum = same than equip.def || updates when new permBoost

globalDef = main def mod. cant be boost by equip. only curse/time boost || never updated manually, use it in right before calculate
mastery mod = same than globalDef but for specific element


status chance: dmg/maxhp * abilityMod [1] * playerMod [1]
leech chance: unrelated to dmg. abilityMod [1] * playerMod [0]



def lvl 0:
	8 4 4
	4 6 4
	12 10 8	=> average of 10

def = 4 + lvl/5

lvl 100:
	50 25 25
	25 37 25
	75 62 50
	

dmg lvl 0:
	10 

dmg lvl 100:
	60




*/

Combat.MIN_EQUIP_DEF = 0.5;	//if naked, only apply on player
Combat.WEAPON_MAIN_MOD = 1.5;
Combat.ARMOR_MAIN_MOD = 2.25;

Combat.getMasteryExpMod = function(mastery){
	return Math.log10(mastery + 100) * 0.1 + 0.8;	//1.1 at 900, 1.2 at 9900
}
Combat.getMainDmgDefByLvl = function(lvl){	//in average, has 1.25 * main. in def cuz of ratio
	return 1 + 0.01*lvl;				//but ok cuz weapon boost by 1.5 certain attack
}

Combat.getEnemyPower = function(act,num){
	if(num === 1) return [];
	var dmg = 1 + Math.sqrt(num-1) * 0.25;	//1=1,	2=1.25,	3:1.35,		5:	1.5		10: 1.75
	var def = 1 + Math.sqrt(num-1) * 0.50;	//1=1,	2=1.5,	3:1.70,		5:  2		10: 2.5
	return [
		Boost('enemypower','globalDmg',dmg || 1,60*1000,"*"),
		Boost('enemypower','globalDef',def || 1,60*1000,"*"),
	];
}
/*
def: 
ring:1.5,	
amulet:2,		
helm:1.5,	
body:2,
weapon:1.5,
*/






