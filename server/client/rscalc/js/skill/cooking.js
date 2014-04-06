function initCooking(){
	videoId = 'f6-3fywubCI';
	skill = 'Cooking';

	//Format: actionPh = 
	//tick/h / ((t/a * a/i) + bank + timeInit) * a/i
	var BANK = 6;

	var FISHPH = 6000 / ((4 * 27) + BANK + 0) * 27;
	var WINEPH = 6000 / ((1 * 14) + BANK + 0) * 14;

	methodDb = [];
	methodPreDb = 
[
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Crayfish","icon":"crayfish","lvl":1,"input":{"raw crayfish":1},"output":{"crayfish":1},"expPa":[30],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Shrimps","icon":"shrimps","lvl":1,"input":{"raw shrimps":1},"output":{"shrimps":1},"expPa":[30],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Anchovies","icon":"anchovies","lvl":1,"input":{"raw anchovies":1},"output":{"anchovies":1},"expPa":[30],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Sardine","icon":"sardine","lvl":1,"input":{"raw sardine":1},"output":{"sardine":1},"expPa":[40],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Herring","icon":"herring","lvl":5,"input":{"raw herring":1},"output":{"herring":1},"expPa":[50],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Mackerel","icon":"mackerel","lvl":10,"input":{"raw mackerel":1},"output":{"mackerel":1},"expPa":[60],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Trout","icon":"trout","lvl":15,"input":{"raw trout":1},"output":{"trout":1},"expPa":[70],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Cod","icon":"cod","lvl":18,"input":{"raw cod":1},"output":{"cod":1},"expPa":[75],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Pike","icon":"pike","lvl":20,"input":{"raw pike":1},"output":{"pike":1},"expPa":[80],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Salmon","icon":"salmon","lvl":25,"input":{"raw salmon":1},"output":{"salmon":1},"expPa":[90],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Cooked slimy eel","icon":"cooked slimy eel","lvl":28,"input":{"slimy eel":1},"output":{"cooked slimy eel":1},"expPa":[95],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Cooked Karambwan","icon":"cooked karambwan","lvl":30,"input":{"raw karambwan":1},"output":{"cooked karambwan":1},"expPa":[80],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Tuna","icon":"tuna","lvl":30,"input":{"raw tuna":1},"output":{"tuna":1},"expPa":[100],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Rainbow fish","icon":"rainbow fish","lvl":35,"input":{"raw rainbow fish":1},"output":{"rainbow fish":1},"expPa":[110],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Lobster","icon":"lobster","lvl":40,"input":{"raw lobster":1},"output":{"lobster":1},"expPa":[120],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Bass","icon":"bass","lvl":43,"input":{"raw bass":1},"output":{"bass":1},"expPa":[130],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Swordfish","icon":"swordfish","lvl":45,"input":{"raw swordfish":1},"output":{"swordfish":1},"expPa":[140],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Monkfish","icon":"monkfish","lvl":62,"input":{"raw monkfish":1},"output":{"monkfish":1},"expPa":[150],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Cave eel","icon":"cave eel","lvl":38,"input":{"raw cave eel":1},"output":{"cave eel":1},"expPa":[115],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Shark","icon":"shark","lvl":80,"input":{"raw shark":1},"output":{"shark":1},"expPa":[210],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Sea turtle","icon":"sea turtle","lvl":82,"input":{"raw sea turtle":1},"output":{"sea turtle":0.85},"expPa":[212],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Cavefish","icon":"cavefish","lvl":88,"input":{"raw cavefish":1},"output":{"cavefish":1},"expPa":[214],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Manta ray","icon":"manta ray","lvl":91,"input":{"raw manta ray":1},"output":{"manta ray":0.77},"expPa":[166.3],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Rocktail","icon":"rocktail","lvl":93,"input":{"raw rocktail":1},"output":{"rocktail":1},"expPa":[225],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Redberry pie","icon":"redberry pie","lvl":10,"input":{"uncooked berry pie":1},"output":{"redberry pie":1},"expPa":[70.9],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Meat pie","icon":"meat pie","lvl":20,"input":{"uncooked meat pie":1},"output":{"meat pie":1},"expPa":[100],"actionPh":900},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Mud pie","icon":"mud pie","lvl":29,"input":{"raw mud pie":1},"output":{"mud pie":1},"expPa":[116.4],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Apple pie","icon":"apple pie","lvl":30,"input":{"uncooked apple pie":1},"output":{"apple pie":1},"expPa":[118.2],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Garden pie","icon":"garden pie","lvl":34,"input":{"raw garden pie":1},"output":{"garden pie":1},"expPa":[125.5],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Fish pie","icon":"fish pie","lvl":47,"input":{"raw fish pie":1},"output":{"fish pie":1},"expPa":[149.1],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Admiral pie","icon":"admiral pie","lvl":70,"input":{"raw admiral pie":1},"output":{"admiral pie":1},"expPa":[190.9],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Wild pie","icon":"wild pie","lvl":85,"input":{"raw wild pie":1},"output":{"wild pie":1},"expPa":[218.2],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Summer pie","icon":"summer pie","lvl":95,"input":{"raw summer pie":1},"output":{"summer pie":1},"expPa":[236.4],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Plain pizza","icon":"plain pizza","lvl":35,"input":{"uncooked pizza":1},"output":{"plain pizza":1},"expPa":[130],"actionPh":900},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Meat pizza (Chicken)","icon":"meat pizza","lvl":45,"input":{"plain pizza":1,"cooked chicken":1},"output":{"meat pizza":1},"expPa":[23.6],"actionPh":2000},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Meat pizza (Meat)","icon":"meat pizza","lvl":45,"input":{"plain pizza":1,"cooked meat":1},"output":{"meat pizza":1},"expPa":[23.6],"actionPh":2000},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Anchovy pizza","icon":"anchovy pizza","lvl":55,"input":{"plain pizza":1,"anchovies":1},"output":{"anchovy pizza":1},"expPa":[35.5],"actionPh":2000},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Pineapple pizza (Ring)","icon":"pineapple pizza","lvl":45,"input":{"plain pizza":1,"pineapple ring":1},"output":{"pineapple pizza":1},"expPa":[23.6],"actionPh":2000},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Pineapple pizza (Chunks)","icon":"pineapple pizza","lvl":45,"input":{"plain pizza":1,"pineapple chunks":1},"output":{"pineapple pizza":1},"expPa":[23.6],"actionPh":2000},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Cooked meat (Beef)","icon":"cooked meat","lvl":1,"input":{"raw beef":1},"output":{"cooked meat":1},"expPa":[30],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Cooked meat (Bear)","icon":"cooked meat","lvl":1,"input":{"raw bear meat":1},"output":{"cooked meat":1},"expPa":[30],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Cooked meat (Rat)","icon":"cooked meat","lvl":1,"input":{"raw rat meat":1},"output":{"cooked meat":1},"expPa":[30],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Cooked meat (Yak)","icon":"cooked meat","lvl":1,"input":{"raw yak meat":1},"output":{"cooked meat":1},"expPa":[30],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Cooked chicken","icon":"cooked chicken","lvl":1,"input":{"raw chicken":1},"output":{"cooked chicken":1},"expPa":[30],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Ugthanki meat","icon":"ugthanki meat","lvl":1,"input":{"raw ugthanki meat":1},"output":{"ugthanki meat":1},"expPa":[40],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Cooked rabbit","icon":"cooked rabbit","lvl":1,"input":{"raw rabbit":1},"output":{"cooked rabbit":1},"expPa":[30],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Roast bird meat","icon":"roast bird meat","lvl":11,"input":{"skewered bird meat":1},"output":{"roast bird meat":1},"expPa":[62],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Roast rabbit","icon":"roast rabbit","lvl":16,"input":{"skewered rabbit":1},"output":{"roast rabbit":1},"expPa":[72],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Spider on stick","icon":"spider on stick","lvl":16,"input":{"spider on stick (raw)":1},"output":{"spider on stick":1},"expPa":[80],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Spider on shaft","icon":"spider on shaft","lvl":16,"input":{"spider on shaft (raw)":1},"output":{"spider on shaft":1},"expPa":[80],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Cooked crab meat","icon":"cooked crab meat","lvl":21,"input":{"crab meat (untradable)":1},"output":{"cooked crab meat":1},"expPa":[100],"actionPh":300},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Roast beast meat","icon":"roast beast meat","lvl":21,"input":{"skewered beast":1},"output":{"roast beast meat":1},"expPa":[82.5],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Thin snail meat","icon":"thin snail meat","lvl":12,"input":{"thin snail":1},"output":{"thin snail meat":1},"expPa":[70],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Lean snail meat","icon":"lean snail meat","lvl":17,"input":{"lean snail":1},"output":{"lean snail meat":1},"expPa":[80],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Fat snail meat","icon":"fat snail meat","lvl":22,"input":{"fat snail":1},"output":{"fat snail meat":1},"expPa":[95],"actionPh":FISHPH},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Bread","icon":"bread","lvl":1,"input":{"bread dough":1},"output":{"bread":1},"expPa":[36.4],"actionPh":900},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Pitta bread","icon":"pitta bread","lvl":58,"input":{"pitta dough":1},"output":{"pitta bread":1},"expPa":[36.4],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Stew","icon":"stew","lvl":25,"input":{"uncooked stew":1},"output":{"stew":1},"expPa":[106.4],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Curry","icon":"curry","lvl":60,"input":{"uncooked curry":1},"output":{"curry":1},"expPa":[254.5],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Cake","icon":"cake","lvl":40,"input":{"uncooked cake":1},"output":{"cake":1},"expPa":[163.6],"actionPh":900},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Chocolate cake (Bar)","icon":"chocolate cake","lvl":50,"input":{"cake":1,"chocolate bar":1},"output":{"chocolate cake":1},"expPa":[27.3],"actionPh":2000},
{"exclude":0,"hide":0,"boost":['urn','bonfire','dwarven'],"name":"Chocolate cake (Dust)","icon":"chocolate cake","lvl":50,"input":{"cake":1,"chocolate dust":1},"output":{"chocolate cake":1},"expPa":[27.3],"actionPh":2000},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Spicy sauce","icon":"spicy sauce","lvl":9,"input":{"chopped garlic":1,"gnome spice":1},"output":{"spicy sauce":1},"expPa":[22.7],"actionPh":2000},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Chilli con carne","icon":"chilli con carne","lvl":9,"input":{"spicy sauce":1,"cooked meat":1},"output":{"chilli con carne":1},"expPa":[22.7],"actionPh":2000},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Scrambled egg","icon":"scrambled egg","lvl":13,"input":{"uncooked egg":1},"output":{"scrambled egg":1},"expPa":[45.5],"actionPh":900},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Egg and tomato","icon":"egg and tomato","lvl":23,"input":{"scrambled egg":1,"tomato":1},"output":{"egg and tomato":1},"expPa":[45.5],"actionPh":2000},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Fried onions","icon":"fried onions","lvl":42,"input":{"chopped onion":1},"output":{"fried onions":1},"expPa":[60],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Fried mushrooms","icon":"fried mushrooms","lvl":46,"input":{"sliced mushrooms":1},"output":{"fried mushrooms":1},"expPa":[60],"actionPh":FISHPH},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Baked potato","icon":"baked potato","lvl":7,"input":{"raw potato":1},"output":{"baked potato":1},"expPa":[13.6],"actionPh":900},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Potato with butter","icon":"potato with butter","lvl":39,"input":{"baked potato":1,"pat of butter":1},"output":{"potato with butter":1},"expPa":[36.4],"actionPh":2000},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Chilli potato","icon":"chilli potato","lvl":41,"input":{"potato with butter":1,"chilli con carne":1},"output":{"chilli potato":1},"expPa":[13.6],"actionPh":2000},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Potato with cheese","icon":"potato with cheese","lvl":47,"input":{"potato with butter":1,"cheese":1},"output":{"potato with cheese":1},"expPa":[36.4],"actionPh":2000},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Egg potato","icon":"egg potato","lvl":51,"input":{"potato with butter":1,"egg and tomato":1},"output":{"egg potato":1},"expPa":[45.5],"actionPh":2000},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Mushroom potato","icon":"mushroom potato","lvl":64,"input":{"potato with butter":1,"mushroom & onion":1},"output":{"mushroom potato":1},"expPa":[50],"actionPh":2000},
{"exclude":1,"hide":1,"boost":['urn','bonfire','dwarven'],"name":"Tuna potato","icon":"tuna potato","lvl":68,"input":{"potato with butter":1,"tuna and corn":1},"output":{"tuna potato":1},"expPa":[9.1],"actionPh":2000},

{"exclude":0,"hide":0,"boost":[],"name":"Jug of wine","icon":"jug of wine","lvl":35,"input":{"jug of water":1,"grapes":1},"output":{"jug of wine":1},"expPa":[200],"actionPh":WINEPH}

];
	
	



	boostList = {
		'urn':{'check':1,'func':(function(method){ method.expPa[0] += method.base.expPa[0] * 0.20; return method; })},
		'bonfire':{'check':1,'func':(function(method){ method.expPa[0] += method.base.expPa[0] * 0.10; return method; })},
		'dwarven':{'check':1,'func':(function(method){ method.expPa[0] += 3; return method; })},
	}

	modList = {
		'sc':(function(m){
			var method = deepClone(m);
			method.mod = {};
			method.name += ' SC';
			
			method.expPa[0] *= 2;
			
			var SC = {
			'expPt':{
				'Crafting':44000,
				'Construction':50750,
				'Smithing':32000,
				'Fletching':46000,
				},
			'timePt':1/5,
			}
			
			var actionPt = SC.expPt[skill] / method.expPa[0];
			var toolUsedPh = method.actionPh / actionPt;
			var timeToolPh = toolUsedPh * SC.timePt;
			
			method.actionPh /= (1 + timeToolPh);
			
			return method;		
		}),


	}
}




