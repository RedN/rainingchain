function initCrafting(){
	videoId = 'f6-3fywubCI';
	skill = 'Crafting';

	//Format: actionPh = 
	//tick/h / ((t/a * a/i) + bank + timeInit) * a/i
	var BANK = 6;

	var BSTAFFPH = 6000 / ((2 * 14) + BANK + 0) * 14;
	var GEMCUTPH = 6000 / ((1 * 28) + BANK + 0) * 28;
	var JEWEL1PH = 6000 / ((3 * 28) + BANK + 10) * 28;
	var JEWEL2PH = 6000 / ((3 * 14) + BANK + 10) * 14;
	
	var URNPH = 550; //include pots too
	var HEADDRESSPH  = 7000;
	
	var HIDE1PH = 6000 / ((3 * 27) + BANK + 0) * 27;
	var HIDE2PH = 6000 / ((3 * 13) + BANK + 0) * 13;
	var HIDE3PH = 6000 / ((3 * 9) + BANK + 0) * 9;
	var HIDE4PH = 6000 / ((3 * 6) + BANK + 0) * 6;
	var HIDE5PH = 6000 / ((3 * 5) + BANK + 0) * 5;
	
	var HIDE8PH = 6000 / ((3 * 3) + BANK + 0) * 3;
	var HIDE12PH = 6000 / ((3 * 2) + BANK + 0) * 2;
	var HIDE15PH = 6000 / ((3 * 1) + BANK + 0) * 1;
	
	
	methodDb = [];
	methodPreDb = 
	[
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Ball of wool","icon":"ball of wool","lvl":1,"input":{"wool":1},"output":{"ball of wool":1},"expPa":[2.5],"actionPh":1150},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Beer glass","icon":"beer glass","lvl":1,"input":{"molten glass":1},"output":{"beer glass":1},"expPa":[17.5],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Bow string","icon":"bow string","lvl":1,"input":{"flax":1},"output":{"bow string":1},"expPa":[15],"actionPh":1150},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Cracked mining urn (nr)","icon":"cracked mining urn (nr)","lvl":1,"input":{"soft clay":2},"output":{"cracked mining urn (nr)":1},"expPa":[16.8],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Empty pot","icon":"empty pot","lvl":1,"input":{"soft clay":1},"output":{"empty pot":1},"expPa":[12.6],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Leather gloves","icon":"leather gloves","lvl":1,"input":{"leather":1},"output":{"leather gloves":1},"expPa":[13.75],"actionPh":HIDE1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Opal","icon":"opal","lvl":1,"input":{"uncut opal":1},"output":{"opal":1},"expPa":[15],"actionPh":GEMCUTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Cracked cooking urn (nr)","icon":"cracked cooking urn (nr)","lvl":2,"input":{"soft clay":2},"output":{"cracked cooking urn (nr)":1},"expPa":[18],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Cracked fishing urn (nr)","icon":"cracked fishing urn (nr)","lvl":2,"input":{"soft clay":2},"output":{"cracked fishing urn (nr)":1},"expPa":[18],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Impious urn (nr)","icon":"impious urn (nr)","lvl":2,"input":{"soft clay":2},"output":{"impious urn (nr)":1},"expPa":[18],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Candle lantern (empty)","icon":"candle lantern (empty)","lvl":4,"input":{"molten glass":1},"output":{"candle lantern (empty)":1},"expPa":[19],"actionPh":HIDE1PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Cracked smelting urn (nr)","icon":"cracked smelting urn (nr)","lvl":4,"input":{"soft clay":2},"output":{"cracked smelting urn (nr)":1},"expPa":[23.8],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Cracked woodcutting urn (nr)","icon":"cracked woodcutting urn (nr)","lvl":4,"input":{"soft clay":2},"output":{"cracked woodcutting urn (nr)":1},"expPa":[23.1],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Gold ring","icon":"gold ring","lvl":5,"input":{"gold bar":1},"output":{"gold ring":1},"expPa":[15],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Gold necklace","icon":"gold necklace","lvl":6,"input":{"gold bar":1},"output":{"gold necklace":1},"expPa":[20],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Gold bracelet","icon":"gold bracelet","lvl":7,"input":{"gold bar":1},"output":{"gold bracelet":1},"expPa":[25],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Leather boots","icon":"leather boots","lvl":7,"input":{"leather":1},"output":{"leather boots":1},"expPa":[16.25],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Pie dish","icon":"pie dish","lvl":7,"input":{"soft clay":1},"output":{"pie dish":1},"expPa":[25],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Bowl","icon":"bowl","lvl":8,"input":{"soft clay":1},"output":{"bowl":1},"expPa":[33],"actionPh":URNPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Clockwork","icon":"clockwork","lvl":8,"input":{"steel bar":1},"output":{"clockwork":1},"expPa":[15],"actionPh":1400},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Gold amulet","icon":"gold amulet","lvl":8,"input":{"gold bar":1},"output":{"gold amulet":1},"expPa":[30],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Leather cowl","icon":"leather cowl","lvl":9,"input":{"leather":1},"output":{"leather cowl":1},"expPa":[18.5],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Crossbow string","icon":"crossbow string","lvl":10,"input":{"sinew":1},"output":{"crossbow string":1},"expPa":[15],"actionPh":1150},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Imphide gloves","icon":"imphide gloves","lvl":10,"input":{"imphide":1},"output":{"imphide gloves":1},"expPa":[10],"actionPh":HIDE1PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Strip of cloth","icon":"strip of cloth","lvl":10,"input":{"ball of wool":4},"output":{"strip of cloth":1},"expPa":[12],"actionPh":1050},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Imphide boots","icon":"imphide boots","lvl":11,"input":{"imphide":1},"output":{"imphide boots":1},"expPa":[10],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Leather vambraces","icon":"leather vambraces","lvl":11,"input":{"leather":1},"output":{"leather vambraces":1},"expPa":[22],"actionPh":HIDE1PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Fragile cooking urn (nr)","icon":"fragile cooking urn (nr)","lvl":12,"input":{"soft clay":2},"output":{"fragile cooking urn (nr)":1},"expPa":[24],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Imphide hood","icon":"imphide hood","lvl":12,"input":{"imphide":2},"output":{"imphide hood":1},"expPa":[20],"actionPh":JEWEL1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Oil lamp (empty)","icon":"oil lamp (empty)","lvl":12,"input":{"molten glass":1},"output":{"oil lamp (empty)":1},"expPa":[25],"actionPh":HIDE1PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Imphide robe bottom","icon":"imphide robe bottom","lvl":13,"input":{"imphide":2},"output":{"imphide robe bottom":1},"expPa":[20],"actionPh":JEWEL1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Jade","icon":"jade","lvl":13,"input":{"uncut jade":1},"output":{"jade":1},"expPa":[20],"actionPh":GEMCUTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Toy soldier","icon":"toy soldier","lvl":13,"input":{"clockwork":1,"plank":1},"output":{"toy soldier":1},"expPa":[15],"actionPh":800},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Imphide robe top","icon":"imphide robe top","lvl":14,"input":{"imphide":3},"output":{"imphide robe top":1},"expPa":[30],"actionPh":HIDE3PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Leather body","icon":"leather body","lvl":14,"input":{"leather":1},"output":{"leather body":1},"expPa":[25],"actionPh":HIDE1PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Fragile fishing urn (nr)","icon":"fragile fishing urn (nr)","lvl":15,"input":{"soft clay":2},"output":{"fragile fishing urn (nr)":1},"expPa":[30],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Fragile woodcutting urn (nr)","icon":"fragile woodcutting urn (nr)","lvl":15,"input":{"soft clay":2},"output":{"fragile woodcutting urn (nr)":1},"expPa":[30],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Imphide book","icon":"imphide book","lvl":15,"input":{"imphide":3},"output":{"imphide book":1},"expPa":[30],"actionPh":HIDE3PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Imp horn wand","icon":"imp horn wand","lvl":16,"input":{"imphide":3},"output":{"imp horn wand":1},"expPa":[30],"actionPh":HIDE3PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Red topaz","icon":"red topaz","lvl":16,"input":{"uncut red topaz":1},"output":{"red topaz":1},"expPa":[25],"actionPh":GEMCUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Unstrung symbol","icon":"unstrung symbol","lvl":16,"input":{"silver bar":1},"output":{"unstrung symbol":1},"expPa":[50],"actionPh":JEWEL1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Wooden cat","icon":"wooden cat","lvl":16,"input":{"plank":1,"fur":1},"output":{"wooden cat":1},"expPa":[15],"actionPh":1400},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Fragile mining urn (nr)","icon":"fragile mining urn (nr)","lvl":17,"input":{"soft clay":2},"output":{"fragile mining urn (nr)":1},"expPa":[31.8],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Fragile smelting urn (nr)","icon":"fragile smelting urn (nr)","lvl":17,"input":{"soft clay":2},"output":{"fragile smelting urn (nr)":1},"expPa":[31.8],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Imphide shield","icon":"imphide shield","lvl":17,"input":{"imphide":4},"output":{"imphide shield":1},"expPa":[40],"actionPh":HIDE4PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Unstrung emblem","icon":"unstrung emblem","lvl":17,"input":{"silver bar":1},"output":{"unstrung emblem":1},"expPa":[50],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Leather chaps","icon":"leather chaps","lvl":18,"input":{"leather":1},"output":{"leather chaps":1},"expPa":[27],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Silver sickle","icon":"silver sickle","lvl":18,"input":{"silver bar":1},"output":{"silver sickle":1},"expPa":[50],"actionPh":JEWEL1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Toy doll","icon":"toy doll","lvl":18,"input":{"clockwork":1,"plank":1},"output":{"toy doll":1},"expPa":[15],"actionPh":800},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Leather shield","icon":"leather shield","lvl":19,"input":{"leather":1},"output":{"leather shield":1},"expPa":[30],"actionPh":HIDE1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Magic string","icon":"magic string","lvl":19,"input":{"magic roots":1},"output":{"magic string":1},"expPa":[30],"actionPh":1150},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Plant pot","icon":"plant pot","lvl":19,"input":{"soft clay":1},"output":{"plant pot":1},"expPa":[37.5],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Sapphire","icon":"sapphire","lvl":20,"input":{"uncut sapphire":1},"output":{"sapphire":1},"expPa":[50],"actionPh":GEMCUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Sapphire ring","icon":"sapphire ring","lvl":20,"input":{"gold bar":1,"sapphire":1},"output":{"sapphire ring":1},"expPa":[40],"actionPh":JEWEL2PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Spider silk gloves","icon":"spider silk gloves","lvl":20,"input":{"spider silk":1},"output":{"spider silk gloves":1},"expPa":[12.5],"actionPh":HIDE1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Empty sack","icon":"empty sack","lvl":21,"input":{"jute fibre":4},"output":{"empty sack":1},"expPa":[38],"actionPh":1050},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Silver bolts (unf)","icon":"silver bolts (unf)","lvl":21,"input":{"silver bar":1},"output":{"silver bolts (unf)":1},"expPa":[5],"actionPh":16500},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Spider silk boots","icon":"spider silk boots","lvl":21,"input":{"spider silk":1},"output":{"spider silk boots":1},"expPa":[12.5],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Sapphire necklace","icon":"sapphire necklace","lvl":22,"input":{"gold bar":1,"sapphire":1},"output":{"sapphire necklace":1},"expPa":[55],"actionPh":JEWEL2PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Spider silk hood","icon":"spider silk hood","lvl":22,"input":{"spider silk":2},"output":{"spider silk hood":1},"expPa":[25],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Sapphire bracelet","icon":"sapphire bracelet","lvl":23,"input":{"gold bar":1,"sapphire":1},"output":{"sapphire bracelet":1},"expPa":[60],"actionPh":JEWEL2PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Spider silk robe bottom","icon":"spider silk robe bottom","lvl":23,"input":{"spider silk":2},"output":{"spider silk robe bottom":1},"expPa":[25],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Tiara","icon":"tiara","lvl":23,"input":{"silver bar":1},"output":{"tiara":1},"expPa":[52.5],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Sapphire amulet","icon":"sapphire amulet","lvl":24,"input":{"gold bar":1,"sapphire":1},"output":{"sapphire amulet":1},"expPa":[65],"actionPh":JEWEL2PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Spider silk robe top","icon":"spider silk robe top","lvl":24,"input":{"spider silk":3},"output":{"spider silk robe top":1},"expPa":[37.5],"actionPh":HIDE3PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Hard leather gloves","icon":"hard leather gloves","lvl":25,"input":{"hard leather":1},"output":{"hard leather gloves":1},"expPa":[32],"actionPh":HIDE1PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Pot lid","icon":"pot lid","lvl":25,"input":{"soft clay":1},"output":{"pot lid":1},"expPa":[40],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Spider orb","icon":"spider orb","lvl":25,"input":{"spider silk":2},"output":{"spider orb":1},"expPa":[25],"actionPh":JEWEL1PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Accursed urn (nr)","icon":"accursed urn (nr)","lvl":26,"input":{"soft clay":2},"output":{"accursed urn (nr)":1},"expPa":[37.5],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Spider wand","icon":"spider wand","lvl":26,"input":{"spider silk":2},"output":{"spider wand":1},"expPa":[25],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Emerald","icon":"emerald","lvl":27,"input":{"uncut emerald":1},"output":{"emerald":1},"expPa":[67.5],"actionPh":GEMCUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Emerald ring","icon":"emerald ring","lvl":27,"input":{"gold bar":1,"emerald":1},"output":{"emerald ring":1},"expPa":[55],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Hard leather boots","icon":"hard leather boots","lvl":27,"input":{"hard leather":1},"output":{"hard leather boots":1},"expPa":[34],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Hard leather body","icon":"hard leather body","lvl":28,"input":{"hard leather":1},"output":{"hard leather body":1},"expPa":[35],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Emerald necklace","icon":"emerald necklace","lvl":29,"input":{"gold bar":1,"emerald":1},"output":{"emerald necklace":1},"expPa":[60],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Hard leather shield","icon":"hard leather shield","lvl":29,"input":{"hard leather":1},"output":{"hard leather shield":1},"expPa":[36],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Carapace gloves","icon":"carapace gloves","lvl":30,"input":{"carapace":1},"output":{"carapace gloves":1},"expPa":[12],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Emerald bracelet","icon":"emerald bracelet","lvl":30,"input":{"gold bar":1,"emerald":1},"output":{"emerald bracelet":1},"expPa":[65],"actionPh":JEWEL2PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Rope","icon":"rope","lvl":30,"input":{"hair":1},"output":{"rope":1},"expPa":[25],"actionPh":1150},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Carapace boots","icon":"carapace boots","lvl":31,"input":{"carapace":1},"output":{"carapace boots":1},"expPa":[12],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Emerald amulet","icon":"emerald amulet","lvl":31,"input":{"gold bar":1,"emerald":1},"output":{"emerald amulet":1},"expPa":[70],"actionPh":JEWEL2PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Mining urn (nr)","icon":"mining urn (nr)","lvl":32,"input":{"soft clay":2},"output":{"mining urn (nr)":1},"expPa":[40.8],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Carapace helm","icon":"carapace helm","lvl":33,"input":{"carapace":2},"output":{"carapace helm":1},"expPa":[24],"actionPh":JEWEL1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Toy mouse","icon":"toy mouse","lvl":33,"input":{"clockwork":1,"plank":1},"output":{"toy mouse":1},"expPa":[15],"actionPh":800},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Vial","icon":"vial","lvl":33,"input":{"molten glass":1},"output":{"vial":1},"expPa":[35],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Carapace legs","icon":"carapace legs","lvl":34,"input":{"carapace":2},"output":{"carapace legs":1},"expPa":[24],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Ruby","icon":"ruby","lvl":34,"input":{"uncut ruby":1},"output":{"ruby":1},"expPa":[85],"actionPh":GEMCUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Ruby ring","icon":"ruby ring","lvl":34,"input":{"gold bar":1,"ruby":1},"output":{"ruby ring":1},"expPa":[70],"actionPh":JEWEL2PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Basket","icon":"basket","lvl":35,"input":{"willow branch":6},"output":{"basket":1},"expPa":[56],"actionPh":1050},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Carapace torso","icon":"carapace torso","lvl":35,"input":{"carapace":3},"output":{"carapace torso":1},"expPa":[36],"actionPh":HIDE3PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Smelting urn (nr)","icon":"smelting urn (nr)","lvl":35,"input":{"soft clay":2},"output":{"smelting urn (nr)":1},"expPa":[42],"actionPh":URNPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Cooking urn (nr)","icon":"cooking urn (nr)","lvl":36,"input":{"soft clay":2},"output":{"cooking urn (nr)":1},"expPa":[42.8],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Coif","icon":"coif","lvl":38,"input":{"leather":1},"output":{"coif":1},"expPa":[37],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Ruby necklace","icon":"ruby necklace","lvl":40,"input":{"gold bar":1,"ruby":1},"output":{"ruby necklace":1},"expPa":[75],"actionPh":JEWEL2PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Fishing urn (nr)","icon":"fishing urn (nr)","lvl":41,"input":{"soft clay":2},"output":{"fishing urn (nr)":1},"expPa":[46.8],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Studded body","icon":"studded body","lvl":41,"input":{"leather body":1,"steel studs":1},"output":{"studded body":1},"expPa":[40],"actionPh":JEWEL2PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Fishbowl","icon":"fishbowl","lvl":42,"input":{"molten glass":1},"output":{"fishbowl":1},"expPa":[42.5],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Ruby bracelet","icon":"ruby bracelet","lvl":42,"input":{"gold bar":1,"ruby":1},"output":{"ruby bracelet":1},"expPa":[80],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Studded leather gloves","icon":"studded leather gloves","lvl":42,"input":{"leather gloves":1,"steel studs":1},"output":{"studded leather gloves":1},"expPa":[40],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Diamond","icon":"diamond","lvl":43,"input":{"uncut diamond":1},"output":{"diamond":1},"expPa":[107.5],"actionPh":GEMCUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Diamond ring","icon":"diamond ring","lvl":43,"input":{"gold bar":1,"diamond":1},"output":{"diamond ring":1},"expPa":[85],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Studded leather boots","icon":"studded leather boots","lvl":43,"input":{"leather boots":1,"steel studs":1},"output":{"studded leather boots":1},"expPa":[40],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Yak-hide armour (legs)","icon":"yak-hide armour (legs)","lvl":43,"input":{"cured yak-hide":1},"output":{"yak-hide armour (legs)":1},"expPa":[32],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Studded chaps","icon":"studded chaps","lvl":44,"input":{"leather chaps":1,"steel studs":1},"output":{"studded chaps":1},"expPa":[42],"actionPh":JEWEL2PH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Woodcutting urn (nr)","icon":"woodcutting urn (nr)","lvl":44,"input":{"soft clay":2},"output":{"woodcutting urn (nr)":1},"expPa":[48],"actionPh":URNPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Snakeskin boots","icon":"snakeskin boots","lvl":45,"input":{"snakeskin":6},"output":{"snakeskin boots":1},"expPa":[30],"actionPh":1150},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Studded leather shield","icon":"studded leather shield","lvl":45,"input":{"leather shield":1,"steel studs":1},"output":{"studded leather shield":1},"expPa":[43],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Unpowered orb","icon":"unpowered orb","lvl":46,"input":{"molten glass":1},"output":{"unpowered orb":1},"expPa":[52.5],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Yak-hide armour (top)","icon":"yak-hide armour (top)","lvl":46,"input":{"cured yak-hide":1},"output":{"yak-hide armour (top)":1},"expPa":[32],"actionPh":HIDE1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Snakeskin vambraces","icon":"snakeskin vambraces","lvl":47,"input":{"snakeskin":8},"output":{"snakeskin vambraces":1},"expPa":[35],"actionPh":HIDE8PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Snakeskin bandana","icon":"snakeskin bandana","lvl":48,"input":{"snakeskin":5},"output":{"snakeskin bandana":1},"expPa":[45],"actionPh":HIDE5PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Strong mining urn (nr)","icon":"strong mining urn (nr)","lvl":48,"input":{"soft clay":2},"output":{"strong mining urn (nr)":1},"expPa":[49.2],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Lantern lens","icon":"lantern lens","lvl":49,"input":{"molten glass":1},"output":{"lantern lens":1},"expPa":[55],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Strong smelting urn (nr)","icon":"strong smelting urn (nr)","lvl":49,"input":{"soft clay":2},"output":{"strong smelting urn (nr)":1},"expPa":[50.8],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Batwing gloves","icon":"batwing gloves","lvl":50,"input":{"batwing":1},"output":{"batwing gloves":1},"expPa":[50],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Ruby amulet","icon":"ruby amulet","lvl":50,"input":{"gold bar":1,"ruby":1},"output":{"ruby amulet":1},"expPa":[85],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Snakeskin chaps","icon":"snakeskin chaps","lvl":51,"input":{"snakeskin":12},"output":{"snakeskin chaps":1},"expPa":[50],"actionPh":HIDE12PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Strong cooking urn (nr)","icon":"strong cooking urn (nr)","lvl":51,"input":{"soft clay":2},"output":{"strong cooking urn (nr)":1},"expPa":[52.8],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Batwing boots","icon":"batwing boots","lvl":52,"input":{"batwing":1},"output":{"batwing boots":1},"expPa":[50],"actionPh":HIDE1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Empty seaweed net","icon":"empty seaweed net","lvl":52,"input":{"flax":5,"bronze wire":1},"output":{"empty seaweed net":1},"expPa":[83],"actionPh":350},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Snakeskin body","icon":"snakeskin body","lvl":53,"input":{"snakeskin":15},"output":{"snakeskin body":1},"expPa":[55],"actionPh":HIDE15PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Strong fishing urn (nr)","icon":"strong fishing urn (nr)","lvl":53,"input":{"soft clay":2},"output":{"strong fishing urn (nr)":1},"expPa":[54],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Air battlestaff","icon":"air battlestaff","lvl":54,"input":{"battlestaff":1,"air orb":1},"output":{"air battlestaff":1},"expPa":[137.5],"actionPh":BSTAFFPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Batwing hood","icon":"batwing hood","lvl":54,"input":{"batwing":2},"output":{"batwing hood":1},"expPa":[100],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Batwing legs","icon":"batwing legs","lvl":55,"input":{"batwing":2},"output":{"batwing legs":1},"expPa":[100],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Dragonstone","icon":"dragonstone","lvl":55,"input":{"uncut dragonstone":1},"output":{"dragonstone":1},"expPa":[137.5],"actionPh":GEMCUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Dragonstone ring","icon":"dragonstone ring","lvl":55,"input":{"gold bar":1,"dragonstone":1},"output":{"dragonstone ring":1},"expPa":[100],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Batwing torso","icon":"batwing torso","lvl":56,"input":{"batwing":3},"output":{"batwing torso":1},"expPa":[150],"actionPh":HIDE3PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Diamond necklace","icon":"diamond necklace","lvl":56,"input":{"gold bar":1,"diamond":1},"output":{"diamond necklace":1},"expPa":[90],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Batwing shield","icon":"batwing shield","lvl":58,"input":{"batwing":4},"output":{"batwing shield":1},"expPa":[200],"actionPh":HIDE4PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Diamond bracelet","icon":"diamond bracelet","lvl":58,"input":{"gold bar":1,"diamond":1},"output":{"diamond bracelet":1},"expPa":[95],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Fire battlestaff","icon":"fire battlestaff","lvl":58,"input":{"battlestaff":1,"fire orb":1},"output":{"fire battlestaff":1},"expPa":[125],"actionPh":BSTAFFPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Bat book","icon":"bat book","lvl":59,"input":{"batwing":4},"output":{"bat book":1},"expPa":[200],"actionPh":HIDE4PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Decorated mining urn (nr)","icon":"decorated mining urn (nr)","lvl":59,"input":{"soft clay":2},"output":{"decorated mining urn (nr)":1},"expPa":[57],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Green d'hide vambraces","icon":"green d'hide vambraces","lvl":60,"input":{"green dragon leather":1},"output":{"green d'hide vambraces":1},"expPa":[62],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Bat wand","icon":"bat wand","lvl":61,"input":{"batwing":4},"output":{"bat wand":1},"expPa":[200],"actionPh":HIDE4PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Strong woodcutting urn (nr)","icon":"strong woodcutting urn (nr)","lvl":61,"input":{"soft clay":2},"output":{"strong woodcutting urn (nr)":1},"expPa":[58.2],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Earth battlestaff","icon":"earth battlestaff","lvl":62,"input":{"battlestaff":1,"earth orb":1},"output":{"earth battlestaff":1},"expPa":[112.5],"actionPh":BSTAFFPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Infernal urn (nr)","icon":"infernal urn (nr)","lvl":62,"input":{"soft clay":2},"output":{"infernal urn (nr)":1},"expPa":[60],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":0},"name":"Green d'hide body","icon":"green d'hide body","lvl":63,"input":{"green dragon leather":3},"output":{"green d'hide body":1},"expPa":[186],"actionPh":HIDE3PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Green d'hide chaps","icon":"green d'hide chaps","lvl":63,"input":{"green dragon leather":2},"output":{"green d'hide chaps":1},"expPa":[124],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Green d'hide shield","icon":"green d'hide shield","lvl":64,"input":{"green dragon leather":4},"output":{"green d'hide shield":1},"expPa":[248],"actionPh":HIDE4PH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":1},"name":"Blue d'hide vambraces","icon":"blue d'hide vambraces","lvl":66,"input":{"blue dragon leather":1},"output":{"blue d'hide vambraces":1},"expPa":[70],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Water battlestaff","icon":"water battlestaff","lvl":66,"input":{"battlestaff":1,"water orb":1},"output":{"water battlestaff":1},"expPa":[100],"actionPh":BSTAFFPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Onyx","icon":"onyx","lvl":67,"input":{"uncut onyx":1},"output":{"onyx":1},"expPa":[167.5],"actionPh":GEMCUTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Onyx ring","icon":"onyx ring","lvl":67,"input":{"gold bar":1,"onyx":1},"output":{"onyx ring":1},"expPa":[150],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":1},"name":"Blue d'hide chaps","icon":"blue d'hide chaps","lvl":68,"input":{"blue dragon leather":2},"output":{"blue d'hide chaps":1},"expPa":[140],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Diamond amulet","icon":"diamond amulet","lvl":70,"input":{"gold bar":1,"diamond":1},"output":{"diamond amulet":1},"expPa":[100],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":0},"name":"Blue d'hide body","icon":"blue d'hide body","lvl":71,"input":{"blue dragon leather":3},"output":{"blue d'hide body":1},"expPa":[210],"actionPh":HIDE3PH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":1},"name":"Blue d'hide shield","icon":"blue d'hide shield","lvl":72,"input":{"blue dragon leather":4},"output":{"blue d'hide shield":1},"expPa":[280],"actionPh":HIDE4PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Dragon necklace","icon":"dragon necklace","lvl":72,"input":{"gold bar":1,"dragonstone":1},"output":{"dragon necklace":1},"expPa":[105],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":1},"name":"Red d'hide vambraces","icon":"red d'hide vambraces","lvl":73,"input":{"red dragon leather":1},"output":{"red d'hide vambraces":1},"expPa":[78],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Dragon bracelet","icon":"dragon bracelet","lvl":74,"input":{"gold bar":1,"dragonstone":1},"output":{"dragon bracelet":1},"expPa":[110],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":1},"name":"Red d'hide chaps","icon":"red d'hide chaps","lvl":75,"input":{"red dragon leather":2},"output":{"red d'hide chaps":1},"expPa":[156],"actionPh":JEWEL1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Decorated fishing urn (nr)","icon":"decorated fishing urn (nr)","lvl":76,"input":{"soft clay":2},"output":{"decorated fishing urn (nr)":1},"expPa":[72],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":1},"name":"Red d'hide body","icon":"red d'hide body","lvl":77,"input":{"red dragon leather":3},"output":{"red d'hide body":1},"expPa":[234],"actionPh":HIDE3PH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":1},"name":"Red d'hide shield","icon":"red d'hide shield","lvl":78,"input":{"red dragon leather":4},"output":{"red d'hide shield":1},"expPa":[312],"actionPh":HIDE4PH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":1},"name":"Black d'hide vambraces","icon":"black d'hide vambraces","lvl":79,"input":{"black dragon leather":1},"output":{"black d'hide vambraces":1},"expPa":[86],"actionPh":HIDE1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Feather headdress (red)","icon":"feather headdress (red)","lvl":79,"input":{"coif":1,"red feather":20},"output":{"feather headdress (red)":1},"expPa":[50],"actionPh":HEADDRESSPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Feather headdress (orange)","icon":"feather headdress (orange)","lvl":79,"input":{"coif":1,"orange feather":20},"output":{"feather headdress (orange)":1},"expPa":[50],"actionPh":HEADDRESSPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Feather headdress (yellow)","icon":"feather headdress (yellow)","lvl":79,"input":{"coif":1,"yellow feather":20},"output":{"feather headdress (yellow)":1},"expPa":[50],"actionPh":HEADDRESSPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Feather headdress (stripy)","icon":"feather headdress (stripy)","lvl":79,"input":{"coif":1,"stripy feather":20},"output":{"feather headdress (stripy)":1},"expPa":[50],"actionPh":HEADDRESSPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Feather headdress (blue)","icon":"feather headdress (blue)","lvl":79,"input":{"coif":1,"blue feather":20},"output":{"feather headdress (blue)":1},"expPa":[50],"actionPh":HEADDRESSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Dragonstone ammy","icon":"dragonstone ammy","lvl":80,"input":{"gold bar":1,"dragonstone":1},"output":{"dragonstone ammy":1},"expPa":[150],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Decorated cooking urn (nr)","icon":"decorated cooking urn (nr)","lvl":81,"input":{"soft clay":2},"output":{"decorated cooking urn (nr)":1},"expPa":[78],"actionPh":URNPH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":1},"name":"Black d'hide chaps","icon":"black d'hide chaps","lvl":82,"input":{"black dragon leather":2},"output":{"black d'hide chaps":1},"expPa":[172],"actionPh":JEWEL1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Onyx necklace","icon":"onyx necklace","lvl":82,"input":{"gold bar":1,"onyx":1},"output":{"onyx necklace":1},"expPa":[150],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":0},"name":"Black d'hide body","icon":"black d'hide body","lvl":84,"input":{"black dragon leather":3},"output":{"black d'hide body":1},"expPa":[258],"actionPh":HIDE3PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Onyx bracelet","icon":"onyx bracelet","lvl":84,"input":{"gold bar":1,"onyx":1},"output":{"onyx bracelet":1},"expPa":[150],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Black d'hide shield","icon":"black d'hide shield","lvl":85,"input":{"black dragon leather":4},"output":{"black d'hide shield":1},"expPa":[344],"actionPh":HIDE4PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Clockwork cat","icon":"clockwork cat","lvl":85,"input":{"clockwork":1,"plank":1},"output":{"clockwork cat":1},"expPa":[15],"actionPh":800},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":1},"name":"Royal d'hide vambraces","icon":"royal d'hide vambraces","lvl":87,"input":{"royal dragon leather":1},"output":{"royal d'hide vambraces":1},"expPa":[94],"actionPh":HIDE1PH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":1},"name":"Royal d'hide chaps","icon":"royal d'hide chaps","lvl":89,"input":{"royal dragon leather":2},"output":{"royal d'hide chaps":1},"expPa":[188],"actionPh":JEWEL1PH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Onyx amulet","icon":"onyx amulet","lvl":90,"input":{"gold bar":1,"onyx":1},"output":{"onyx amulet":1},"expPa":[150],"actionPh":JEWEL2PH},
{"exclude":0,"hide":0,"boost":[],"mod":{"sc":0},"name":"Royal d'hide body","icon":"royal d'hide body","lvl":93,"input":{"royal dragon leather":3},"output":{"royal d'hide body":1},"expPa":[282],"actionPh":HIDE3PH}
];


	Skill.boostList = {
		
	};

	modList = {
		'sc':(function(m){
			var method = Tk.deepClone(m);
			method.mod = {};
			method.name += ' SC';
			
			method.expPa[0] *= 2;
			
			var SC = {
			'expPt':{
				'Crafting':24450,
				'Construction':24450,
				'Smithing':24450,
				'Fletching':24450,
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




