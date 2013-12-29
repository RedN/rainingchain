//List of constant shared by client and server

HEIGHT = 720;
HEIGHT2 = HEIGHT/2;
WIDTH = 1280;
WIDTH2 = WIDTH/2;

ICON = 48;
ITEM = 48;

tabDName = ['Equip','Inventory','Quest','Skill','Friend','Setting'];
tabName = ['equip','inventory','quest','skill','friend','setting'];
tabCName = {'equip':'Equip','inventory':'Inventory','quest':'Quest','skill':'Skill','friend':'Friend','setting':'Setting'};


elementToStatus = {"melee":"bleed","range":"knock","magic":"drain","fire":"burn","cold":"chill","lightning":"confuse"}
statusToElement = {"bleed":"melee","knock":"range","drain":"magic","burn":"fire","chill":"cold","confuse":"lightning"}

pieceName = ['melee','range','magic','amulet','helm','ring','gloves','body','shield','bracelet','pants','boots'];
skillName = ['melee','range','magic','metalwork','woodwork','leatherwork','geology','metallurgy','trapping'];
weaponName = ["mace","spear","sword","bow","boomerang","crossbow","wand","staff","orb"];
weaponPieceName = ['melee','range','magic'];
armorPieceName = ['amulet','helm','ring','gloves','body','shield','bracelet','pants','boots'];
elementName = ["melee","range","magic","fire","cold","lightning"];
resistName = ["bleed","knock","drain","burn","chill","confuse"];
armorStyleName = ["metal","wood","bone"];

pieceDName = ['Melee','Range','Magic','Amulet','Helm','Ring','Gloves','Body','Shield','Bracelet','Pants','Boots'];
skillDName = ['Melee','Range','Magic','Metalwork','Woodwork','Leatherwork','Geology','Metallurgy','Trapping'];
weaponDName = ["Mace","Spear","Sword","Bow","Boomerang","Crossbow","Wand","Staff","Orb"];
weaponPieceDName = ['Melee','Range','Magic'];
armorPieceDName = ['Amulet','Helm','Ring','Gloves','Body','Shield','Bracelet','Pants','Boots'];
elementDName = ["Melee","Range","Magic","Fire","Cold","Lightning"];
resistDName = ["Bleed","Knock","Drain","Burn","Chill","Confuse"];
armorStyleDName = ["Metal","Wood","Bone"];

pieceCName = {'melee':'Melee','range':'Range','magic':'Magic','bracelet':'Bracelet','helm':'Helm','amulet':'Amulet','gloves':'Gloves','body':'Body','shield':'Shield','boots':'Boots','pants':'Pants','ring':'Ring'};
skillCName = {'melee':'Melee','range':'Range','magic':'Magic','metalwork':'Metalwork','woodwork':'Woodwork','leatherwork':'Leatherwork','geology':'Geology','metallurgy':'Metallurgy','trapping':'Trapping'};

expChart = [100000,104713,109648,114816,120227,125893,131826,138039,144544,151357,158490,165959,173781,181971,190547,199527,208930,218777,229087,239884,251189,263027,275423,288404,301996,316228,331132,346737,363079,380190,398108,416870,436516,457089,478631,501188,524808,549541,575440,602560,630958,660694,691831,724436,758578,794329,831764,870964,912011,954993,1000000,1047129,1096479,1148154,1202265,1258926,1318257,1380385,1445440,1513562,1584894,1659587,1737801,1819701,1905461,1995263,2089297,2187762,2290868,2398833,2511887,2630268,2754229,2884032,3019952,3162278,3311312,3467369,3630781,3801894,3981072,4168694,4365159,4570882,4786301,5011873,5248075,5495409,5754400,6025596,6309574,6606935,6918310,7244360,7585776,7943283,8317638,8709636,9120109,9549926,10000000];
expChartObj = {"0":100000,"1":104713,"2":109648,"3":114816,"4":120227,"5":125893,"6":131826,"7":138039,"8":144544,"9":151357,"10":158490,"11":165959,"12":173781,"13":181971,"14":190547,"15":199527,"16":208930,"17":218777,"18":229087,"19":239884,"20":251189,"21":263027,"22":275423,"23":288404,"24":301996,"25":316228,"26":331132,"27":346737,"28":363079,"29":380190,"30":398108,"31":416870,"32":436516,"33":457089,"34":478631,"35":501188,"36":524808,"37":549541,"38":575440,"39":602560,"40":630958,"41":660694,"42":691831,"43":724436,"44":758578,"45":794329,"46":831764,"47":870964,"48":912011,"49":954993,"50":1000000,"51":1047129,"52":1096479,"53":1148154,"54":1202265,"55":1258926,"56":1318257,"57":1380385,"58":1445440,"59":1513562,"60":1584894,"61":1659587,"62":1737801,"63":1819701,"64":1905461,"65":1995263,"66":2089297,"67":2187762,"68":2290868,"69":2398833,"70":2511887,"71":2630268,"72":2754229,"73":2884032,"74":3019952,"75":3162278,"76":3311312,"77":3467369,"78":3630781,"79":3801894,"80":3981072,"81":4168694,"82":4365159,"83":4570882,"84":4786301,"85":5011873,"86":5248075,"87":5495409,"88":5754400,"89":6025596,"90":6309574,"91":6606935,"92":6918310,"93":7244360,"94":7585776,"95":7943283,"96":8317638,"97":8709636,"98":9120109,"99":9549926,"100":10000000};

statusName = ['bleed','knock','drain','burn','chill','confuse'];

statusCName = {'bleed':'Bleed','knock':"Knock",'drain':'Drain','burn':'Burn','chill':'Chill','confuse':"Confuse"};

elementCName = {"melee":"Melee","range":"Range","magic":"Magic","fire":"Fire","cold":"Cold","lightning":"Lightning"};


resourceCName = {
	'hp':'Life',
	'dodge':'Dodge',
	'mana':'Mana',
	'fury':'Fury',
}

resourceToColor = {
	'hp':'#FF3333',	//red
	'mana':'#0066FF',	//blue
	'fury':'#666699',	//blue-purple
	'dodge':'#FF9900',	//orange
}

modToIcon = {
	'burn':'offensive.burn',
	'chill':'offensive.chill',
	'confuse':'offensive.confuse',
	'bleed':'offensive.bleed',
	'knock':'offensive.knock',
	'drain':'offensive.drain',
	'leech':'offensive.leech',
	
	'sin':'offensive.bullet',
	'parabole':'offensive.bullet',
	'nova':'offensive.bullet',
	'boomerang':'offensive.bullet',
	'onHit':'offensive.bullet',
	'curse':'curse.skull',
	'hitIfMod':'system.heart',
	'heal':'system.heart',
}



typeForPiece = 	{
	'melee':['mace','spear','sword'],
	'range':['bow','boomerang','crossbow'],
	'magic':['wand','staff','orb'],
	'bracelet':['ruby','sapphire','topaz'],
	'helm':['metal','wood','bone'],
	'amulet':['ruby','sapphire','topaz'],
	'gloves':['chain','leaf','hide'],
	'body':['metal','wood','bone'],
	'shield':['metal','wood','bone'],
	'boots':['chain','leaf','hide'],
	'pants':['chain','leaf','hide'],
	'ring':['ruby','sapphire','topaz'],
};

colorForElement = {
	'melee':'#F97A03',
	'range':'#3EEA31',
	'magic':'#AE52F5',
	'fire':'#FF0000',
	'cold':'#A9F5F2',
	'lightning':'#FFFF00',
}

