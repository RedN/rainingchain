Init.skill.herblore = function(){
	Skill.videoId = 'f6-3fywubCI';
	Skill.name = 'Herblore';
	Skill.id = 'herblore';
	/*
	prayer renwe legs
	
	*/
	
	//Format: actionPh = 
	//tick/h / ((t/a * a/i) + bank + timeInit) * a/i
var BANK = 6;	

var POTPH = 6000 / ((3 * 14) + BANK + 0) * 14;
var POTPHSCROLL = 6000 / ((2.625 * 14) + BANK + 0) * 14;

var HERBPH = 6000 / ((1 * 28) + BANK + 0) * 28;
var UNFPH = 6000 / ((2 * 14) + BANK + 0) * 14;
var POTPH2ING = 6000 / ((3 * 9) + BANK + 0) * 9;
var TAR = 1;	//TOFIX
var EXTREMEMAGIC = 6000 / ((4 * 14) + BANK + 0) * 14;
var EXTREMERANGING = 6000 / ((3 * 27) + BANK + 0) * 27;

var TIME1kEXTREME = 1000 / EXTREMERANGING + 1000/EXTREMEMAGIC + 1000/UNFPH * 3;
var CRAFT1kOVL = 0.5;
var TOTALTIME1kOVL = TIME1kEXTREME + CRAFT1kOVL;	//3
var OVLPH = 1000/TOTALTIME1kOVL;
	
	
	
	
	
	
	Skill.methodDb = [];
	Skill.methodPreDb = 
[
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean guam","icon":"clean guam","lvl":1,"input":{"grimy guam":1},"output":{"clean guam":1},"expPa":[2.5],"actionPh":HERBPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Guam potion (unf)","icon":"guam potion (unf)","lvl":1,"input":{"clean guam":1,"vial of water":1},"output":{"guam potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Attack potion (3)","icon":"attack potion (3)","lvl":3,"input":{"guam potion (unf)":1,"eye of newt":1},"output":{"attack potion (3)":1},"expPa":[25],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Ranging potion (3)","icon":"ranging potion (3)","lvl":3,"input":{"guam potion (unf)":1,"redberries":1},"output":{"ranging potion (3)":1},"expPa":[30],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Strength potion (3)","icon":"strength potion (3)","lvl":3,"input":{"tarromin potion (unf)":1,"limpwurt root":1},"output":{"strength potion (3)":1},"expPa":[25],"actionPh":POTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Attack mix (2)","icon":"attack mix (2)","lvl":4,"input":{"attack potion (2)":1,"roe":1},"output":{"attack mix (2)":1},"expPa":[8],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Antipoison (3)","icon":"antipoison (3)","lvl":5,"input":{"marrentill potion (unf)":1,"unicorn horn dust":1},"output":{"antipoison (3)":1},"expPa":[37.5],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean marrentill","icon":"clean marrentill","lvl":5,"input":{"grimy marrentill":1},"output":{"clean marrentill":1},"expPa":[3.8],"actionPh":HERBPH},
{"exclude":0,"hide":1,"boost":['fpf','scroll',],"mod":{},"name":"Magic potion (3)","icon":"magic potion (3)","lvl":5,"input":{"tarromin potion (unf)":1,"red bead":1},"output":{"magic potion (3)":1},"expPa":[35],"actionPh":POTPH},
{"exclude":0,"hide":1,"boost":['fpf','scroll',],"mod":{},"name":"Magic potion (3)","icon":"magic potion (3)","lvl":5,"input":{"tarromin potion (unf)":1,"white bead":1},"output":{"magic potion (3)":1},"expPa":[35],"actionPh":POTPH},
{"exclude":0,"hide":1,"boost":['fpf','scroll',],"mod":{},"name":"Magic potion (3)","icon":"magic potion (3)","lvl":5,"input":{"tarromin potion (unf)":1,"black bead":1},"output":{"magic potion (3)":1},"expPa":[35],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Magic potion (3)","icon":"magic potion (3)","lvl":5,"input":{"tarromin potion (unf)":1,"yellow bead":1},"output":{"magic potion (3)":1},"expPa":[35],"actionPh":POTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Ranging mix (2)","icon":"ranging mix (2)","lvl":5,"input":{"ranging potion (2)":1,"roe":1},"output":{"ranging mix (2)":1},"expPa":[8],"actionPh":POTPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Tarromin potion (unf)","icon":"tarromin potion (unf)","lvl":5,"input":{"clean tarromin":1,"vial of water":1},"output":{"tarromin potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Antipoison mix (2)","icon":"antipoison mix (2)","lvl":6,"input":{"antipoison (2)":1,"roe":1},"output":{"antipoison mix (2)":1},"expPa":[12],"actionPh":POTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Magic mix (2)","icon":"magic mix (2)","lvl":7,"input":{"magic potion (2)":1,"roe":1},"output":{"magic mix (2)":1},"expPa":[8],"actionPh":POTPH},
{"exclude":1,"hide":5,"boost":['fpf','scroll',],"mod":{},"name":"Relicym's balm (3)","icon":"relicym's balm (3)","lvl":8,"input":{"vial of water":1,"clean rogue's purse":1,"clean snake weed":1},"output":{"relicym's balm (3)":1},"expPa":[41],"actionPh":90},
{"exclude":1,"hide":5,"boost":[],"mod":{},"name":"Relicym's mix (2)","icon":"relicym's mix (2)","lvl":9,"input":{"relicym's balm (2)":1,"roe":1},"output":{"relicym's mix (2)":1},"expPa":[14],"actionPh":POTPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Marrentill potion (unf)","icon":"marrentill potion (unf)","lvl":9,"input":{"clean marrentill":1,"vial of water":1},"output":{"marrentill potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean tarromin","icon":"clean tarromin","lvl":11,"input":{"grimy tarromin":1},"output":{"clean tarromin":1},"expPa":[5],"actionPh":HERBPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Strength mix (2)","icon":"strength mix (2)","lvl":14,"input":{"strength potion (2)":1,"roe":1},"output":{"strength mix (2)":1},"expPa":[17],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Serum 207 (3)","icon":"serum 207 (3)","lvl":15,"input":{"tarromin potion (unf)":1,"ashes":1},"output":{"serum 207 (3)":1},"expPa":[50],"actionPh":UNFPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Harralander potion (unf)","icon":"harralander potion (unf)","lvl":18,"input":{"clean harralander":1,"vial of water":1},"output":{"harralander potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":1,"hide":2,"boost":['fpf','scroll',],"mod":{},"name":"Guthix rest (3)","icon":"guthix rest (3)","lvl":18,"input":{"harralander potion (unf)":1,"clean marrentill":1},"output":{"guthix rest (3)":1},"expPa":[59.5],"actionPh":POTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Guam tar","icon":"guam tar","lvl":19,"input":{"clean guam":1,"swamp tar":1},"output":{"guam tar":15},"expPa":[30],"actionPh":TAR},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean harralander","icon":"clean harralander","lvl":20,"input":{"grimy harralander":1},"output":{"clean harralander":1},"expPa":[6.3],"actionPh":HERBPH},
{"exclude":1,"hide":2,"boost":['fpf','scroll',],"mod":{},"name":"Guthix balance (3)","icon":"guthix balance (3)","lvl":22,"input":{"guthix balance (3) (unf)":1,"silver dust":1},"output":{"guthix balance (3)":1},"expPa":[25],"actionPh":POTPH},
{"exclude":1,"hide":2,"boost":['fpf','scroll',],"mod":{},"name":"Guthix balance (3) (unf)","icon":"guthix balance (3) (unf)","lvl":22,"input":{"restore potion (3)":1,"garlic":1},"output":{"guthix balance (3) (unf)":1},"expPa":[25],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Restore potion (3)","icon":"restore potion (3)","lvl":22,"input":{"harralander potion (unf)":1,"red spiders' eggs":1},"output":{"restore potion (3)":1},"expPa":[62.5],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Restore mix (2)","icon":"restore mix (2)","lvl":24,"input":{"restore potion (2)":1,"roe":1},"output":{"restore mix (2)":1},"expPa":[21],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean ranarr","icon":"clean ranarr","lvl":25,"input":{"grimy ranarr":1},"output":{"clean ranarr":1},"expPa":[7.5],"actionPh":HERBPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Ranarr potion (unf)","icon":"ranarr potion (unf)","lvl":25,"input":{"clean ranarr":1,"vial of water":1},"output":{"ranarr potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Energy potion (3)","icon":"energy potion (3)","lvl":26,"input":{"harralander potion (unf)":1,"chocolate dust":1},"output":{"energy potion (3)":1},"expPa":[67.5],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Energy mix (2)","icon":"energy mix (2)","lvl":29,"input":{"energy potion (2)":1,"caviar":1},"output":{"energy mix (2)":1},"expPa":[23],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean toadflax","icon":"clean toadflax","lvl":30,"input":{"grimy toadflax":1},"output":{"clean toadflax":1},"expPa":[8],"actionPh":HERBPH},
{"exclude":0,"hide":1,"boost":['fpf','scroll',],"mod":{},"name":"Defence potion (3)","icon":"defence potion (3)","lvl":30,"input":{"ranarr potion (unf)":1,"white berries":1},"output":{"defence potion (3)":1},"expPa":[75],"actionPh":POTPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Toadflax potion (unf)","icon":"toadflax potion (unf)","lvl":30,"input":{"clean toadflax":1,"vial of water":1},"output":{"toadflax potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Marrentill tar","icon":"marrentill tar","lvl":31,"input":{"clean marrentill":1,"swamp tar":1},"output":{"marrentill tar":15},"expPa":[42.5],"actionPh":TAR},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Super fishing explosive","icon":"super fishing explosive","lvl":31,"input":{"guam potion (unf)":1,"rubium":1},"output":{"super fishing explosive":1},"expPa":[55],"actionPh":200},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Defence mix (2)","icon":"defence mix (2)","lvl":33,"input":{"defence potion (2)":1,"caviar":1},"output":{"defence mix (2)":1},"expPa":[25],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Agility potion (3)","icon":"agility potion (3)","lvl":34,"input":{"toadflax potion (unf)":1,"toad's legs":1},"output":{"agility potion (3)":1},"expPa":[80],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean spirit weed","icon":"clean spirit weed","lvl":35,"input":{"grimy spirit weed":1},"output":{"clean spirit weed":1},"expPa":[7.8],"actionPh":HERBPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Spirit weed potion (unf)","icon":"spirit weed potion (unf)","lvl":35,"input":{"clean spirit weed":1,"vial of water":1},"output":{"spirit weed potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Combat potion (3)","icon":"combat potion (3)","lvl":36,"input":{"harralander potion (unf)":1,"goat horn dust":1},"output":{"combat potion (3)":1},"expPa":[84],"actionPh":POTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Agility mix (2)","icon":"agility mix (2)","lvl":37,"input":{"agility potion (2)":1,"caviar":1},"output":{"agility mix (2)":1},"expPa":[27],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Prayer potion (3)","icon":"prayer potion (3)","lvl":38,"input":{"ranarr potion (unf)":1,"snape grass":1},"output":{"prayer potion (3)":1},"expPa":[87.5],"actionPh":POTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Tarromin tar","icon":"tarromin tar","lvl":39,"input":{"clean tarromin":1,"swamp tar":1},"output":{"tarromin tarl":15},"expPa":[55],"actionPh":TAR},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Combat mix (2)","icon":"combat mix (2)","lvl":40,"input":{"combat potion (2)":1,"caviar":1},"output":{"combat mix (2)":1},"expPa":[28],"actionPh":POTPH},
{"exclude":1,"hide":2,"boost":['fpf','scroll',],"mod":{},"name":"Crafting potion (3)","icon":"crafting potion (3)","lvl":40,"input":{"wergali potion (unf)":1,"frog spawn":1},"output":{"crafting potion (3)":1},"expPa":[92],"actionPh":90},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean irit","icon":"clean irit","lvl":40,"input":{"grimy irit":1},"output":{"clean irit":1},"expPa":[8.8],"actionPh":HERBPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Irit potion (unf)","icon":"irit potion (unf)","lvl":40,"input":{"clean irit":1,"vial of water":1},"output":{"irit potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Summoning potion (3)","icon":"summoning potion (3)","lvl":40,"input":{"spirit weed potion (unf)":1,"cockatrice egg":1},"output":{"summoning potion (3)":1},"expPa":[92],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean wergali","icon":"clean wergali","lvl":41,"input":{"grimy wergali":1},"output":{"clean wergali":1},"expPa":[9.5],"actionPh":HERBPH},
{"exclude":1,"hide":2,"boost":['fpf','scroll',],"mod":{},"name":"Wergali potion (unf)","icon":"wergali potion (unf)","lvl":41,"input":{"clean wergali":1,"vial of water":1},"output":{"wergali potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Prayer mix (2)","icon":"prayer mix (2)","lvl":42,"input":{"prayer potion (2)":1,"caviar":1},"output":{"prayer mix (2)":1},"expPa":[29],"actionPh":POTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Harralander tar","icon":"harralander tar","lvl":44,"input":{"clean harralander":1,"swamp tar":1},"output":{"harralander tar":1},"expPa":[72.5],"actionPh":TAR},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Super attack (3)","icon":"super attack (3)","lvl":45,"input":{"irit potion (unf)":1,"eye of newt":1},"output":{"super attack (3)":1},"expPa":[100],"actionPh":POTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Super attack mix (2)","icon":"super attack mix (2)","lvl":47,"input":{"super attack (2)":1,"caviar":1},"output":{"super attack mix (2)":1},"expPa":[33],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean avantoe","icon":"clean avantoe","lvl":48,"input":{"grimy avantoe":1},"output":{"clean avantoe":1},"expPa":[10],"actionPh":HERBPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Avantoe potion (unf)","icon":"avantoe potion (unf)","lvl":48,"input":{"clean avantoe":1,"vial of water":1},"output":{"avantoe potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Super antipoison (3)","icon":"super antipoison (3)","lvl":48,"input":{"irit potion (unf)":1,"unicorn horn dust":1},"output":{"super antipoison (3)":1},"expPa":[106.3],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Fishing potion (3)","icon":"fishing potion (3)","lvl":50,"input":{"avantoe potion (unf)":1,"snape grass":1},"output":{"fishing potion (3)":1},"expPa":[112.5],"actionPh":POTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Anti-p supermix (2)","icon":"anti-p supermix (2)","lvl":51,"input":{"super antipoison (2)":1,"caviar":1},"output":{"anti-p supermix (2)":1},"expPa":[35],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Super energy (3)","icon":"super energy (3)","lvl":52,"input":{"avantoe potion (unf)":1,"mort myre fungus":1},"output":{"super energy (3)":1},"expPa":[117.5],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Hunter potion (3)","icon":"hunter potion (3)","lvl":53,"input":{"avantoe potion (unf)":1,"kebbit teeth dust":1},"output":{"hunter potion (3)":1},"expPa":[120],"actionPh":POTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Fishing mix (2)","icon":"fishing mix (2)","lvl":53,"input":{"fishing potion (2)":1,"caviar":1},"output":{"fishing mix (2)":1},"expPa":[39],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean kwuarm","icon":"clean kwuarm","lvl":54,"input":{"grimy kwuarm":1},"output":{"clean kwuarm":1},"expPa":[11.3],"actionPh":HERBPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Kwuarm potion (unf)","icon":"kwuarm potion (unf)","lvl":54,"input":{"clean kwuarm":1,"vial of water":1},"output":{"kwuarm potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Super strength (3)","icon":"super strength (3)","lvl":55,"input":{"kwuarm potion (unf)":1,"limpwurt root":1},"output":{"super strength (3)":1},"expPa":[125],"actionPh":POTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Super energy mix (2)","icon":"super energy mix (2)","lvl":56,"input":{"super energy (2)":1,"caviar":1},"output":{"super energy mix (2)":1},"expPa":[39],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Magic essence (3)","icon":"magic essence (3)","lvl":57,"input":{"vial of water":1,"star flower":1,"gorak claw powder":1},"output":{"magic essence (3)":1},"expPa":[131],"actionPh":120},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Hunting mix (2)","icon":"hunting mix (2)","lvl":58,"input":{"hunter potion (2)":1,"caviar":1},"output":{"hunting mix (2)":1},"expPa":[40],"actionPh":POTPH},
{"exclude":1,"hide":2,"boost":['fpf','scroll',],"mod":{},"name":"Fletching potion (3)","icon":"fletching potion (3)","lvl":58,"input":{"wergali potion (unf)":1,"wimpy feather":1},"output":{"fletching potion (3)":1},"expPa":[132],"actionPh":2500},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean snapdragon","icon":"clean snapdragon","lvl":59,"input":{"grimy snapdragon":1},"output":{"clean snapdragon":1},"expPa":[11.8],"actionPh":HERBPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Snapdragon potion (unf)","icon":"snapdragon potion (unf)","lvl":59,"input":{"clean snapdragon":1,"vial of water":1},"output":{"snapdragon potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Super strength mix (2)","icon":"super strength mix (2)","lvl":59,"input":{"super strength (2)":1,"caviar":1},"output":{"super strength mix (2)":1},"expPa":[42],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Weapon poison (3)","icon":"weapon poison (3)","lvl":60,"input":{"kwuarm potion (unf)":1,"dragon scale dust":1},"output":{"weapon poison (3)":1},"expPa":[137.5],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Super restore (3)","icon":"super restore (3)","lvl":63,"input":{"snapdragon potion (unf)":1,"red spiders' eggs":1},"output":{"super restore (3)":1},"expPa":[142.5],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean cadantine","icon":"clean cadantine","lvl":65,"input":{"grimy cadantine":1},"output":{"clean cadantine":1},"expPa":[12.5],"actionPh":HERBPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Cadantine potion (unf)","icon":"cadantine potion (unf)","lvl":65,"input":{"clean cadantine":1,"vial of water":1},"output":{"cadantine potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":1,"hide":1,"boost":['fpf','scroll',],"mod":{},"name":"Sanfew serum (3)","icon":"sanfew serum (3)","lvl":65,"input":{"mixture - step 2 (3)":1,"nail beast nails":1},"output":{"sanfew serum (3)":1},"expPa":[60],"actionPh":POTPH},
{"exclude":1,"hide":1,"boost":['fpf','scroll',],"mod":{},"name":"Mixture - step 1 (3)","icon":"mixture - step 1 (3)","lvl":65,"input":{"super restore (3)":1,"unicorn horn dust":1},"output":{"mixture - step 1 (3)":1},"expPa":[47.5],"actionPh":POTPH},
{"exclude":1,"hide":1,"boost":['fpf','scroll',],"mod":{},"name":"Mixture - step 2 (3)","icon":"mixture - step 2 (3)","lvl":65,"input":{"mixture - step 1 (3)":1,"clean snake weed":1},"output":{"mixture - step 2 (3)":1},"expPa":[52.5],"actionPh":180},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Super defence (3)","icon":"super defence (3)","lvl":66,"input":{"cadantine potion (unf)":1,"white berries":1},"output":{"super defence (3)":1},"expPa":[150],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean lantadyme","icon":"clean lantadyme","lvl":67,"input":{"grimy lantadyme":1},"output":{"clean lantadyme":1},"expPa":[13.1],"actionPh":HERBPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Lantadyme potion (unf)","icon":"lantadyme potion (unf)","lvl":67,"input":{"clean lantadyme":1,"vial of water":1},"output":{"lantadyme potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Super restore mix (2)","icon":"super restore mix (2)","lvl":67,"input":{"super restore (2)":1,"caviar":1},"output":{"super restore mix (2)":1},"expPa":[48],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Antipoison+ (4)","icon":"antipoison+ (4)","lvl":68,"input":{"coconut milk":1,"clean toadflax":1,"yew roots":1},"output":{"antipoison+ (4)":1},"expPa":[156],"actionPh":1100},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Antifire (3)","icon":"antifire (3)","lvl":69,"input":{"lantadyme potion (unf)":1,"dragon scale dust":1},"output":{"antifire (3)":1},"expPa":[157.5],"actionPh":POTPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Dwarf weed potion (unf)","icon":"dwarf weed potion (unf)","lvl":70,"input":{"clean dwarf weed":1,"vial of water":1},"output":{"dwarf weed potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean dwarf weed","icon":"clean dwarf weed","lvl":70,"input":{"grimy dwarf weed":1},"output":{"clean dwarf weed":1},"expPa":[13.8],"actionPh":HERBPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Fellstalk potion (unf)","icon":"fellstalk potion (unf)","lvl":71,"input":{"clean fellstalk":1,"vial of water":1},"output":{"fellstalk potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Super defence mix (2)","icon":"super defence mix (2)","lvl":71,"input":{"super defence (2)":1,"caviar":1},"output":{"super defence mix (2)":1},"expPa":[50],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Super ranging potion (3)","icon":"super ranging potion (3)","lvl":72,"input":{"dwarf weed potion (unf)":1,"wine of zamorak":1},"output":{"super ranging potion (3)":1},"expPa":[162.5],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Weapon poison (3)","icon":"weapon poison (3)","lvl":73,"input":{"coconut milk":1,"cactus spine":1,"red spiders' eggs":1},"output":{"weapon poison (3)":1},"expPa":[166],"actionPh":1100},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Antidote+ mix (2)","icon":"antidote+ mix (2)","lvl":74,"input":{"antipoison+ (2)":1,"caviar":1},"output":{"antidote+ mix (2)":1},"expPa":[52],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean torstol","icon":"clean torstol","lvl":75,"input":{"grimy torstol":1},"output":{"clean torstol":1},"expPa":[15],"actionPh":HERBPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Antifire mix (2)","icon":"antifire mix (2)","lvl":75,"input":{"antifire (2)":1,"caviar":1},"output":{"antifire mix (2)":1},"expPa":[53],"actionPh":POTPH},
{"exclude":1,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Torstol potion (unf)","icon":"torstol potion (unf)","lvl":75,"input":{"clean torstol":1,"vial of water":1},"output":{"torstol potion (unf)":1},"expPa":[1],"actionPh":UNFPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Super magic potion (3)","icon":"super magic potion (3)","lvl":76,"input":{"lantadyme potion (unf)":1,"potato cactus":1},"output":{"super magic potion (3)":1},"expPa":[172.5],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Zamorak brew (3)","icon":"zamorak brew (3)","lvl":78,"input":{"torstol potion (unf)":1,"jangerberries":1},"output":{"zamorak brew (3)":1},"expPa":[175],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Antipoison++ (4)","icon":"antipoison++ (4)","lvl":79,"input":{"coconut milk":1,"clean irit":1,"magic roots":1},"output":{"antipoison++ (4)":1},"expPa":[178.5],"actionPh":1100},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Super ranging mix (2)","icon":"super ranging mix (2)","lvl":80,"input":{"super ranging potion (2)":1,"caviar":1},"output":{"super ranging mix (2)":1},"expPa":[54],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Saradomin brew (3)","icon":"saradomin brew (3)","lvl":81,"input":{"toadflax potion (unf)":1,"crushed nest":1},"output":{"saradomin brew (3)":1},"expPa":[180],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Weapon poison++ (3)","icon":"weapon poison++ (3)","lvl":82,"input":{"coconut milk":1,"poison ivy berries":1,"cave nightshade":1},"output":{"weapon poison++ (3)":1},"expPa":[191],"actionPh":80},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Super magic mix (2)","icon":"super magic mix (2)","lvl":83,"input":{"super magic potion (2)":1,"caviar":1},"output":{"super magic mix (2)":1},"expPa":[57],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Adrenaline potion (3)","icon":"adrenaline potion (3)","lvl":84,"input":{"super energy (3)":1,"papaya fruit":1},"output":{"adrenaline potion (3)":1},"expPa":[200],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Super antifire (3)","icon":"super antifire (3)","lvl":85,"input":{"antifire (3)":1,"phoenix feather":1},"output":{"super antifire (3)":1},"expPa":[210],"actionPh":450},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Zamorak mix (2)","icon":"zamorak mix (2)","lvl":85,"input":{"zamorak brew (2)":1,"caviar":1},"output":{"zamorak mix (2)":1},"expPa":[58],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Extreme attack (3)","icon":"extreme attack (3)","lvl":88,"input":{"super attack (3)":1,"clean avantoe":1},"output":{"extreme attack (3)":1},"expPa":[220],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Extreme strength (3)","icon":"extreme strength (3)","lvl":89,"input":{"super strength (3)":1,"clean dwarf weed":1},"output":{"extreme strength (3)":1},"expPa":[230],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Extreme defence (3)","icon":"extreme defence (3)","lvl":90,"input":{"super defence (3)":1,"clean lantadyme":1},"output":{"extreme defence (3)":1},"expPa":[240],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Extreme magic (3)","icon":"extreme magic (3)","lvl":91,"input":{"super magic potion (3)":1,"mud runes":1},"output":{"extreme magic (3)":1},"expPa":[250],"actionPh":EXTREMEMAGIC},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Clean fellstalk","icon":"clean fellstalk","lvl":91,"input":{"grimy fellstalk":1},"output":{"clean fellstalk":1},"expPa":[16.8],"actionPh":HERBPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Extreme ranging (3)","icon":"extreme ranging (3)","lvl":92,"input":{"super ranging potion (3)":1,"grenwall spikes":5},"output":{"extreme ranging (3)":1},"expPa":[260],"actionPh":EXTREMERANGING},
{"exclude":1,"hide":2,"boost":['fpf','scroll',],"mod":{},"name":"Super Guthix rest (3)","icon":"super guthix rest (3)","lvl":93,"input":{"guthix rest (3)":1,"wine of guthix":1},"output":{"super guthix rest (3)":1},"expPa":[59.5],"actionPh":POTPH},
{"exclude":1,"hide":1,"boost":['fpf','scroll',],"mod":{},"name":"Super Zamorak brew (3)","icon":"super zamorak brew (3)","lvl":93,"input":{"zamorak brew (3)":1,"wine of zamorak":1},"output":{"super zamorak brew (3)":1},"expPa":[180],"actionPh":POTPH},
{"exclude":1,"hide":1,"boost":['fpf','scroll',],"mod":{},"name":"Super Saradomin brew (3)","icon":"super saradomin brew (3)","lvl":93,"input":{"saradomin brew (3)":1,"wine of saradomin":1},"output":{"super saradomin brew (3)":1},"expPa":[180],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll','morytania task'],"mod":{},"name":"Prayer renewal (3)","icon":"prayer renewal (3)","lvl":94,"input":{"fellstalk potion (unf)":1,"morchella mushroom":1},"output":{"prayer renewal (3)":1},"expPa":[190],"actionPh":POTPH},
{"exclude":0,"hide":0,"boost":['fpf','scroll',],"mod":{},"name":"Super prayer (3)","icon":"super prayer (3)","lvl":94,"input":{"prayer potion (3)":1,"wyvern bonemeal":1},"output":{"super prayer (3)":1},"expPa":[270],"actionPh":200},
{"exclude":0,"hide":0,"boost":['fpf','scroll'],"mod":{},"name":"Overload (3)","icon":"overload (3)","lvl":96,"input":{"clean torstol":1,"super attack (3)":1,"super strength (3)":1,"super defence (3)":1,"super ranging potion (3)":1,"super magic potion (3)":1,"clean avantoe":1,"clean dwarf weed":1,"clean lantadyme":1,"mud runes":1,"grenwall spikes":5},"output":{"overload (3)":1},"expPa":[2200],"actionPh":OVLPH}
];
	
	
	



	Skill.boostList = {
		'fpf':{'check':1,'func':(function(method){ 
			for(var i in method.output){
				method.output[i] *= 31/30;
			}
			return method; })},
			
		'morytania task':{'check':1,'func':(function(method){ 
			for(var i in method.output){
				method.output[i] *= 16/15;
			}
			return method; })},
		
		'scroll':{'check':1,'func':(function(method){ 
			for(var i in method.input){
				if(i.indexOf('(unf)') == -1 && i.indexOf('super') == -1){
					method.input[i] *= 0.9;
				}
			}
			method.actionPh *= POTPHSCROLL / POTPH;
			return method; })},
	
	};

	Skill.modList = {
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
			
			var actionPt = SC.expPt[Skill.name] / method.expPa[0];
			var toolUsedPh = method.actionPh / actionPt;
			var timeToolPh = toolUsedPh * SC.timePt;
			
			method.actionPh /= (1 + timeToolPh);
			
			return method;		
		}),


	}
}




