var doc = document; doc.get = doc.getElementById;

var ONLINE = 1;
var ICON = 24;

var skillList = {'Attack':"http://images3.wikia.nocookie.net/__cb20120122084602/runescape/images/thumb/5/51/Attack-icon.png/21px-Attack-icon.png",'Strength':"http://images1.wikia.nocookie.net/__cb20120122083450/runescape/images/thumb/3/3e/Strength-icon.png/16px-Strength-icon.png",'Defence':"http://images3.wikia.nocookie.net/__cb20120123003536/runescape/images/thumb/d/d8/Defence-icon.png/18px-Defence-icon.png",'Ranged':"http://images1.wikia.nocookie.net/__cb20120122082216/runescape/images/thumb/7/72/Ranged-icon.png/21px-Ranged-icon.png",'Prayer':"http://images4.wikia.nocookie.net/__cb20120121220331/runescape/images/2/24/Prayer-icon.png",'Magic':"http://images1.wikia.nocookie.net/__cb20120122182528/runescape/images/thumb/7/77/Magic-icon.png/21px-Magic-icon.png",'Constitution':"http://images3.wikia.nocookie.net/__cb20120122193809/runescape/images/thumb/1/1d/Constitution-icon.png/21px-Constitution-icon.png",'Crafting':"http://images2.wikia.nocookie.net/__cb20120122231156/runescape/images/thumb/4/48/Crafting-icon.png/21px-Crafting-icon.png",'Mining':"http://images2.wikia.nocookie.net/__cb20120122191028/runescape/images/thumb/2/28/Mining-icon.png/21px-Mining-icon.png",'Smithing':"http://images2.wikia.nocookie.net/__cb20120122232122/runescape/images/thumb/d/df/Smithing-icon.png/21px-Smithing-icon.png",'Fishing':"http://images2.wikia.nocookie.net/__cb20120123002212/runescape/images/thumb/0/0b/Fishing-icon.png/21px-Fishing-icon.png",'Cooking':"http://images1.wikia.nocookie.net/__cb20120122233049/runescape/images/thumb/f/f7/Cooking-icon.png/17px-Cooking-icon.png",'Firemaking':"http://images1.wikia.nocookie.net/__cb20120121214504/runescape/images/thumb/6/6d/Firemaking-icon.png/18px-Firemaking-icon.png",'Woodcutting':"http://images1.wikia.nocookie.net/__cb20120122222711/runescape/images/thumb/0/0f/Woodcutting-icon.png/18px-Woodcutting-icon.png",'Runecrafting':"http://images3.wikia.nocookie.net/__cb20120122223429/runescape/images/thumb/6/64/Runecrafting-icon.png/20px-Runecrafting-icon.png",'Dungeoneering':"http://images4.wikia.nocookie.net/__cb20120207171723/runescape/images/thumb/3/3e/Dungeoneering-icon.png/21px-Dungeoneering-icon.png",'Agility':"http://images3.wikia.nocookie.net/__cb20120122221425/runescape/images/thumb/8/84/Agility-icon.png/18px-Agility-icon.png",'Herblore':"http://images3.wikia.nocookie.net/__cb20120122235048/runescape/images/thumb/f/f1/Herblore-icon.png/21px-Herblore-icon.png",'Thieving':"http://images3.wikia.nocookie.net/__cb20120122201602/runescape/images/thumb/f/f3/Thieving-icon.png/21px-Thieving-icon.png",'Fletching':"http://images3.wikia.nocookie.net/__cb20120122200319/runescape/images/thumb/7/77/Fletching-icon.png/21px-Fletching-icon.png",'Slayer':"http://images2.wikia.nocookie.net/__cb20120121214707/runescape/images/thumb/c/cf/Slayer-icon.png/19px-Slayer-icon.png",'Farming':"http://images1.wikia.nocookie.net/__cb20120122213351/runescape/images/thumb/f/f0/Farming-icon.png/21px-Farming-icon.png",'Construction':"http://images1.wikia.nocookie.net/__cb20120122233806/runescape/images/thumb/e/e5/Construction-icon.png/21px-Construction-icon.png",'Hunter':"http://images1.wikia.nocookie.net/__cb20120122231407/runescape/images/8/83/Hunter-icon.png",'Summoning':"http://images3.wikia.nocookie.net/__cb20120121220228/runescape/images/thumb/e/e3/Summoning-icon.png/19px-Summoning-icon.png",'Divination':"http://images3.wikia.nocookie.net/__cb20130829211820/runescape/images/thumb/c/c3/Divination-icon.png/21px-Divination-icon.png"};
var lvlList = [0,0,83,174,276,388,512,650,801,969,1154,1358,1584,1833,2107,2411,2746,3115,3523,3973,4470,5018,5624,6291,7028,7842,8740,9730,10824,12031,13363,14833,16456,18247,20224,22406,24815,27473,30408,33648,37224,41171,45529,50339,55649,61512,67983,75127,83014,91721,101333,111945,123660,136594,150872,166636,184040,203254,224466,247886,273742,302288,333804,368599,407015,449428,496254,547953,605032,668051,737627,814445,899257,992895,1096278,1210421,1336443,1475581,1629200,1798808,1986068,2192818,2421087,2673114,2951373,3258594,3597792,3972294,4385776,4842295,5346332,5902831,6517253,7195629,7944614,8771558,9684577,10692629,11805606,13034431];

var MILLION = 1000000;


var warnColor = ['green','yellow','orange','red'];


//14391160,15889109,17542976,19368992,21385073,23611006,26068632,28782069,31777943,35085654,38737661,42769801,47221641,52136869,57563718,63555443,70170840,77474828,85539082,94442737,104273167];

var minConvert = {	
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











