//List of constant shared by client and server

Cst = {};

Cst.FPS = 25;
Cst.MSPF = 1000/Cst.FPS;
Cst.HEIGHT = 720;
Cst.HEIGHT2 = Cst.HEIGHT/2;
Cst.WIDTH = 1280;
Cst.WIDTH2 = Cst.WIDTH/2;
Cst.ICON = 48;
Cst.ITEM = 48;
Cst.FACE = 48;
Cst.FRICTION = 0.80;

Cst.bigInt = Math.pow(10,10);

Cst.SEC = 1000;
Cst.MIN = Cst.SEC*60;
Cst.HOUR = Cst.MIN*60;
Cst.DAY = Cst.HOUR*24;


Cst.tab = {
	'list':['equip','inventory','quest','skill','friend','pref'],
}

Cst.equip = {
	'category':['weapon','armor'],
	'weapon':{'piece':['melee','range','magic']},
	'armor':{'piece':['amulet','helm','ring','gloves','body','shield','bracelet','pants','boots']},
	
	'piece':['melee','range','magic','amulet','helm','ring','gloves','body','shield','bracelet','pants','boots'],
	'melee':{'type':["mace","spear","sword"]},
	'range':{'type':["bow","boomerang","crossbow"]},
	'magic':{'type':["wand","staff","orb"]},
	'amulet':{'type':["ruby","sapphire","topaz"]},	
	'helm':{'type':['metal','wood','bone']},	
	'ring':{'type':["ruby","sapphire","topaz"]},	
	'gloves':{'type':['chain','leaf','hide']},	
	'body':{'type':['metal','wood','bone']},	
	'shield':{'type':['metal','wood','bone']},	
	'bracelet':{'type':["ruby","sapphire","topaz"]},	
	'pants':{'type':['chain','leaf','hide']},	
	'boots':{'type':['chain','leaf','hide']},
};
(function(){
	for(var i in Cst.equip.weapon.piece)
		Cst.equip.weapon[Cst.equip.weapon.piece[i]] = Cst.equip[Cst.equip.weapon.piece[i]];
	for(var i in Cst.equip.armor.piece)
		Cst.equip.armor[Cst.equip.armor.piece[i]] = Cst.equip[Cst.equip.armor.piece[i]];
	
	
	Cst.isWeapon = function(piece){
		return Cst.equip.weapon.piece.have(piece);
	}
	Cst.isArmor = function(piece){
		return Cst.equip.armor.piece.have(piece);
	}
})();

Cst.skill = {
	'list':['melee','range','magic','metalwork','woodwork','leatherwork','mining','woodcutting','trapping'],
}

Cst.element = {
	'list':["melee","range","magic","fire","cold","lightning"],
	'toStatus':{"melee":"bleed","range":"knock","magic":"drain","fire":"burn","cold":"chill","lightning":"stun"},
	'toColor':{'melee':'#F97A03','range':'#3EEA31','magic':'#AE52F5','fire':'#FF0000','cold':'#A9F5F2','lightning':'#FFFF00'},
	'physical':["melee","range","magic"],
	'elemental':["fire","cold","lightning"],
	'template':function(num){
		if(!num) return {"melee":0,"range":0,"magic":0,"fire":0,"cold":0,"lightning":0};
		return {"melee":num,"range":num,"magic":num,"fire":num,"cold":num,"lightning":num};
	}
}

Cst.status = {
	'list':["bleed","knock","drain","burn","chill","stun"],
	'toElement':{"bleed":"melee","knock":"range","drain":"magic","burn":"fire","chill":"cold","stun":"lightning"},
}

Cst.resource = {
	'list':['hp','mana','fury','dodge','heal'],
	'toColor':{'hp':'#FF3333','mana':'#0066FF','fury':'#666699','dodge':'#FF9900','heal':'#F0F8FF'},
}

Cst.exp = {
	//var str = '[';for(var i = 0; i < 101; i++){ str += Math.floor(10000 * Math.pow(10,i/50)) + ',';}INFO(str.slice(0,-1) + ']');
	'list':[10000,10471,10964,11481,12022,12589,13182,13803,14454,15135,15848,16595,17378,18197,19054,19952,20892,21877,22908,23988,25118,26302,27542,28840,30199,31622,33113,34673,36307,38018,39810,41686,43651,45708,47863,50118,52480,54954,57543,60255,63095,66069,69183,72443,75857,79432,83176,87096,91201,95499,100000,104712,109647,114815,120226,125892,131825,138038,144543,151356,158489,165958,173780,181970,190546,199526,208929,218776,229086,239883,251188,263026,275422,288403,301995,316227,331131,346736,363078,380189,398107,416869,436515,457088,478630,501187,524807,549540,575439,602559,630957,660693,691830,724435,758577,794328,831763,870963,912010,954992,1000000],
}






