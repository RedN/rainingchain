//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
var CST = exports.CST = {};

CST.FPS = 25;
CST.MSPF = 1000/CST.FPS;
CST.HEIGHT = 720;
CST.HEIGHT2 = CST.HEIGHT/2;
CST.WIDTH = 1280;
CST.WIDTH2 = CST.WIDTH/2;
CST.ICON = 48;
CST.ITEM = 48;
CST.FACE = 48;
CST.FRICTION = 0.50;
CST.FRICTIONNPC = 0.80;

CST.NPCSPD = 6;

CST.func = function(){};
CST.bigInt = Math.pow(10,10);

CST.SEC = 1000;
CST.MIN = CST.SEC*60;
CST.HOUR = CST.MIN*60;
CST.DAY = CST.HOUR*24;

CST.minPasswordLength = 3;

CST.tab = ['equip','inventory','quest','skill','friend','pref'];

CST.equip = {
	'piece':['weapon','amulet','ring','helm','body'],
	'weapon':["mace","spear","sword","bow","boomerang","crossbow","wand","staff","orb"],
	'amulet':["ruby","sapphire","topaz"],	
	'ring':["ruby","sapphire","topaz"],	
	'helm':['metal','wood','bone'],	
	'body':['metal','wood','bone'],	
};
CST.abbr = {
	melee:'ML',
	range:'RG',
	magic:'MG',
	fire:'FR',
	cold:'CD',
	lightning:'LG',
	//
	bleed:'BLD',
	knock:'KNK',
	drain:'DRN',
	burn:'BRN',
	chill:'CHL',
	stun:'STN',

};

CST.getWeaponSkill = {
	mace:'melee',
	sword:'melee',
	spear:'melee',
	orb:'magic',
	staff:'magic',
	wand:'magic',
	bow:'range',
	crossbow:'range',
	boomerang:'range',		
};
CST.isWeapon = function(piece){
	return piece === 'weapon';
};
CST.isArmor = function(piece){
	return piece !== 'weapon';
};
CST.getPiece = function(txt){
	return txt.split('-')[0];
};
CST.getType = function(txt){
	return txt.split('-')[1];
};

CST.skill = ['melee','range','magic','metalwork','woodwork','leatherwork','mining','woodcutting','trapping'];

CST.element = {
	'list':["melee","range","magic","fire","cold","lightning"],
	'toStatus':{"melee":"bleed","range":"knock","magic":"drain","fire":"burn","cold":"chill","lightning":"stun"},
	'toColor':{'melee':'#F97A03','range':'#3EEA31','magic':'#AE52F5','fire':'#FF0000','cold':'#A9F5F2','lightning':'#FFFF00'},
	'physical':["melee","range","magic"],
	'elemental':["fire","cold","lightning"],
	'template':function(num){
		num = num || 0;
		return {"melee":num,"range":num,"magic":num,"fire":num,"cold":num,"lightning":num};
	},
	custom:function(melee,range,magic,fire,cold,lightning){
		return {
			melee:melee === undefined ? 0 : melee,
			range:range === undefined ? 0 : range,
			magic:magic === undefined ? 0 : magic,
			fire:fire === undefined ? 0 : fire,
			cold:cold === undefined ? 0 : cold,
			lightning:lightning === undefined ? 0 : lightning,
		};
	},
}

CST.status = {
	'list':["bleed","knock","drain","burn","chill","stun"],
	'toElement':{"bleed":"melee","knock":"range","drain":"magic","burn":"fire","chill":"cold","stun":"lightning"},
}

CST.resource = {
	'list':['hp','mana'],
	'toColor':{'hp':'#FF3333','mana':'#0066FF'},
}

//var str = '[';for(var i = 0; i < 101; i++){ str += Math.floor(10000 * Math.pow(10,i/50)) + ',';}INFO(str.slice(0,-1) + ']');
CST.exp = [10000,10471,10964,11481,12022,12589,13182,13803,14454,15135,15848,16595,17378,18197,19054,19952,20892,21877,22908,23988,25118,26302,27542,28840,30199,31622,33113,34673,36307,38018,39810,41686,43651,45708,47863,50118,52480,54954,57543,60255,63095,66069,69183,72443,75857,79432,83176,87096,91201,95499,100000,104712,109647,114815,120226,125892,131825,138038,144543,151356,158489,165958,173780,181970,190546,199526,208929,218776,229086,239883,251188,263026,275422,288403,301995,316227,331131,346736,363078,380189,398107,416869,436515,457088,478630,501187,524807,549540,575439,602559,630957,660693,691830,724435,758577,794328,831763,870963,912010,954992,1000000];

	




