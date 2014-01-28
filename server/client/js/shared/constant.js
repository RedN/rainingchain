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

Cst.bigInt = Math.pow(10,10);

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

})();

Cst.skill = {
	'list':['melee','range','magic','metalwork','woodwork','leatherwork','geology','metallurgy','trapping'],
}

Cst.element = {
	'list':["melee","range","magic","fire","cold","lightning"],
	'toStatus':{"melee":"bleed","range":"knock","magic":"drain","fire":"burn","cold":"chill","lightning":"confuse"},
	'toColor':{'melee':'#F97A03','range':'#3EEA31','magic':'#AE52F5','fire':'#FF0000','cold':'#A9F5F2','lightning':'#FFFF00'},
	'physical':["melee","range","magic"],
	'elemental':["fire","cold","lightning"],
	'template':function(num){
		if(!num) return {"melee":0,"range":0,"magic":0,"fire":0,"cold":0,"lightning":0};
		return {"melee":num,"range":num,"magic":num,"fire":num,"cold":num,"lightning":num};
	}
}

Cst.color = {
	'green':'green',
	'red':'red',

	'test':function(bool){	return bool ? Cst.color.green : Cst.color.red;},
}


Cst.status = {
	'list':["bleed","knock","drain","burn","chill","confuse"],
	'toElement':{"bleed":"melee","knock":"range","drain":"magic","burn":"fire","chill":"cold","confuse":"lightning"},
}

Cst.resource = {
	'list':['hp','mana','fury','dodge','heal'],
	'toColor':{'hp':'#FF3333','mana':'#0066FF','fury':'#666699','dodge':'#FF9900','heal':'#F0F8FF'},
}

Cst.exp = {
	'list':[100000,104713,109648,114816,120227,125893,131826,138039,144544,151357,158490,165959,173781,181971,190547,199527,208930,218777,229087,239884,251189,263027,275423,288404,301996,316228,331132,346737,363079,380190,398108,416870,436516,457089,478631,501188,524808,549541,575440,602560,630958,660694,691831,724436,758578,794329,831764,870964,912011,954993,1000000,1047129,1096479,1148154,1202265,1258926,1318257,1380385,1445440,1513562,1584894,1659587,1737801,1819701,1905461,1995263,2089297,2187762,2290868,2398833,2511887,2630268,2754229,2884032,3019952,3162278,3311312,3467369,3630781,3801894,3981072,4168694,4365159,4570882,4786301,5011873,5248075,5495409,5754400,6025596,6309574,6606935,6918310,7244360,7585776,7943283,8317638,8709636,9120109,9549926,10000000],
	'toExp':{"0":100000,"1":104713,"2":109648,"3":114816,"4":120227,"5":125893,"6":131826,"7":138039,"8":144544,"9":151357,"10":158490,"11":165959,"12":173781,"13":181971,"14":190547,"15":199527,"16":208930,"17":218777,"18":229087,"19":239884,"20":251189,"21":263027,"22":275423,"23":288404,"24":301996,"25":316228,"26":331132,"27":346737,"28":363079,"29":380190,"30":398108,"31":416870,"32":436516,"33":457089,"34":478631,"35":501188,"36":524808,"37":549541,"38":575440,"39":602560,"40":630958,"41":660694,"42":691831,"43":724436,"44":758578,"45":794329,"46":831764,"47":870964,"48":912011,"49":954993,"50":1000000,"51":1047129,"52":1096479,"53":1148154,"54":1202265,"55":1258926,"56":1318257,"57":1380385,"58":1445440,"59":1513562,"60":1584894,"61":1659587,"62":1737801,"63":1819701,"64":1905461,"65":1995263,"66":2089297,"67":2187762,"68":2290868,"69":2398833,"70":2511887,"71":2630268,"72":2754229,"73":2884032,"74":3019952,"75":3162278,"76":3311312,"77":3467369,"78":3630781,"79":3801894,"80":3981072,"81":4168694,"82":4365159,"83":4570882,"84":4786301,"85":5011873,"86":5248075,"87":5495409,"88":5754400,"89":6025596,"90":6309574,"91":6606935,"92":6918310,"93":7244360,"94":7585776,"95":7943283,"96":8317638,"97":8709636,"98":9120109,"99":9549926,"100":10000000},
}






