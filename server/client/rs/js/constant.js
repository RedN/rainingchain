var doc = document; doc.get = doc.getElementById;

var ONLINE = 1;
var ICON = 20;
var MILLION = 1000000;

var CST = {};
CST.skillList = ["Fletching","Cooking","Firemaking","Strength","Attack","Defence","Constitution","Woodcutting","Fishing","Magic","Hunter","Construction","Smithing","Crafting","Mining","Theiving","Agility","Slayer","Prayer","Herblore","Farming","Dungeoneering","Divination"];
CST.lvlList = [0,0,83,174,276,388,512,650,801,969,1154,1358,1584,1833,2107,2411,2746,3115,3523,3973,4470,5018,5624,6291,7028,7842,8740,9730,10824,12031,13363,14833,16456,18247,20224,22406,24815,27473,30408,33648,37224,41171,45529,50339,55649,61512,67983,75127,83014,91721,101333,111945,123660,136594,150872,166636,184040,203254,224466,247886,273742,302288,333804,368599,407015,449428,496254,547953,605032,668051,737627,814445,899257,992895,1096278,1210421,1336443,1475581,1629200,1798808,1986068,2192818,2421087,2673114,2951373,3258594,3597792,3972294,4385776,4842295,5346332,5902831,6517253,7195629,7944614,8771558,9684577,10692629,11805606,13034431];


//14391160,15889109,17542976,19368992,21385073,23611006,26068632,28782069,31777943,35085654,38737661,42769801,47221641,52136869,57563718,63555443,70170840,77474828,85539082,94442737,104273167];

CST.minConvert = {	
	//Headers
	'X':'X',
	'Method':'Way',
	'Video':'Vid',
	'Wikia':'Wikia',
	'Requirements':'Req',
	'Exp/Action':'Xp/A',
	'Exp/H':'Xp/H',
	'Exp+/Action':'Xp+/A',
	'Exp+/H':'Xp+/H',
	'Gp/Action':'Gp/A',
	'Gp/Exp':'Gp/Xp',
	'Gp/Exp+':'Gp/Xp+',
	'Gp/H':'Gp/H',
	'Action/H':'A/H',
	'Time/1M Exp':'Time',
	'Time For Gp/1M Exp':'Time Gp',
	'Time For Exp/1M Exp':'Time Xp',
	'Gp/1M Exp':'Gp/1M',
	
	'Input':'In',
	'Output':'Out',
	'Level':'Lv',
	
	'Total Action':'T A',
	'Total Exp':'T Exp',
	'Total Exp+':'T Exp+',
	'Total Input':'In',
	'Total Output':'Out',
	'Total Gp':'Gp',
	'Total Time For Gp':'Time Gp',
	'Total Time For Exp':'Time Xp',		
	'Total Time':'Time',
	

	//Others	
	',000,000':'M',
	',000':'K',

	//Skills
	'Attack':'Atk',
	'Strength':'Str',
	'Defence':'Def',
	'Ranged':'Rng',
	'Prayer':'Pray',
	'Magic':'Mage',
	'Constitution':'Hp',
	'Crafting':'Craft',
	'Mining':'Mine',
	'Smithing':'Smith',
	'Fishing':'Fish',
	'Cooking':'Cook',
	'Firemaking':'Fm',
	'Woodcutting':'Wc',
	'Runecrafting':'Rc',
	'Dungeoneering':'Dung',
	'Agility':'Agi',
	'Herblore':'Herb',
	'Thieving':'Thief',
	'Fletching':'Fletch',
	'Slayer':'Slay',
	'Farming':'Farm',
	'Construction':'Cons',
	'Hunter':'Hunt',
	'Summoning':'Summon',
	'Divination':'Div',
	
};











