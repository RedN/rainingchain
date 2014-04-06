function initSmithing(){
	videoId = 'f6-3fywubCI';
	skill = 'Smithing';

	//Format: actionPh = 
	//tick/h / ((t/a * a/i) + bank + timeInit) * a/i
	var BANK = 6;

	var SMITH1 = 6000 / ((4 * 28) + BANK + 15) * 28;
	var SMITH2 = 6000 / ((4 * 14) + BANK + 15) * 14;
	var SMITH3 = 6000 / ((4 * 9) + BANK + 15) * 9;
	var SMITH5 = 6000 / ((4 * 5) + BANK + 15) * 5;
	
	var SMITH3YAK = 6000 / ((4 * 18) + 2*BANK + 15) * 18;
	var SMITH5YAK = 6000 / ((4 * 11) + 2*BANK + 15) * 11;
	
	var BURIAL = 360;
	var CEREMONIAL = 50;

	methodDb = [];
	methodPreDb = 
	[
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze dagger","icon":"bronze dagger","lvl":1,"input":{"bronze bar":1},"output":{"bronze dagger":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand bronze dagger","icon":"off-hand bronze dagger","lvl":1,"input":{"bronze bar":1},"output":{"off-hand bronze dagger":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze hatchet","icon":"bronze hatchet","lvl":1,"input":{"bronze bar":1},"output":{"bronze hatchet":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze mace","icon":"bronze mace","lvl":2,"input":{"bronze bar":1},"output":{"bronze mace":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand bronze mace","icon":"off-hand bronze mace","lvl":2,"input":{"bronze bar":1},"output":{"off-hand bronze mace":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze helm","icon":"bronze helm","lvl":3,"input":{"bronze bar":1},"output":{"bronze helm":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze bolts (unf)","icon":"bronze bolts (unf)","lvl":3,"input":{"bronze bar":1},"output":{"bronze bolts (unf)":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze sword","icon":"bronze sword","lvl":4,"input":{"bronze bar":1},"output":{"bronze sword":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand bronze sword","icon":"off-hand bronze sword","lvl":4,"input":{"bronze bar":1},"output":{"off-hand bronze sword":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze wire","icon":"bronze wire","lvl":4,"input":{"bronze bar":1},"output":{"bronze wire":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze dart tip","icon":"bronze dart tip","lvl":4,"input":{"bronze bar":1},"output":{"bronze dart tip":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze nails","icon":"bronze nails","lvl":4,"input":{"bronze bar":1},"output":{"bronze nails":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze arrowheads","icon":"bronze arrowheads","lvl":5,"input":{"bronze bar":1},"output":{"bronze arrowheads":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze scimitar","icon":"bronze scimitar","lvl":5,"input":{"bronze bar":2},"output":{"bronze scimitar":1},"expPa":[25],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand bronze scimitar","icon":"off-hand bronze scimitar","lvl":5,"input":{"bronze bar":2},"output":{"off-hand bronze scimitar":1},"expPa":[25],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze pickaxe","icon":"bronze pickaxe","lvl":5,"input":{"bronze bar":2},"output":{"bronze pickaxe":1},"expPa":[25],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze limbs","icon":"bronze limbs","lvl":6,"input":{"bronze bar":1},"output":{"bronze limbs":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze longsword","icon":"bronze longsword","lvl":6,"input":{"bronze bar":2},"output":{"bronze longsword":1},"expPa":[25],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand bronze longsword","icon":"off-hand bronze longsword","lvl":6,"input":{"bronze bar":2},"output":{"off-hand bronze longsword":1},"expPa":[25],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze knife","icon":"bronze knife","lvl":7,"input":{"bronze bar":1},"output":{"bronze knife":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand bronze knife","icon":"off-hand bronze knife","lvl":7,"input":{"bronze bar":1},"output":{"off-hand bronze knife":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze throwing axe","icon":"bronze throwing axe","lvl":7,"input":{"bronze bar":1},"output":{"bronze throwing axe":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand bronze throwing axe","icon":"off-hand bronze throwing axe","lvl":7,"input":{"bronze bar":1},"output":{"off-hand bronze throwing axe":1},"expPa":[12.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze full helm","icon":"bronze full helm","lvl":7,"input":{"bronze bar":2},"output":{"bronze full helm":1},"expPa":[25],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze sq shield","icon":"bronze sq shield","lvl":8,"input":{"bronze bar":2},"output":{"bronze sq shield":1},"expPa":[25],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze warhammer","icon":"bronze warhammer","lvl":9,"input":{"bronze bar":3},"output":{"bronze warhammer":1},"expPa":[37.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand bronze warhammer","icon":"off-hand bronze warhammer","lvl":9,"input":{"bronze bar":3},"output":{"off-hand bronze warhammer":1},"expPa":[37.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze battleaxe","icon":"bronze battleaxe","lvl":10,"input":{"bronze bar":3},"output":{"bronze battleaxe":1},"expPa":[37.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand bronze battleaxe","icon":"off-hand bronze battleaxe","lvl":10,"input":{"bronze bar":3},"output":{"off-hand bronze battleaxe":1},"expPa":[37.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze chainbody","icon":"bronze chainbody","lvl":11,"input":{"bronze bar":3},"output":{"bronze chainbody":1},"expPa":[37.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze kiteshield","icon":"bronze kiteshield","lvl":12,"input":{"bronze bar":3},"output":{"bronze kiteshield":1},"expPa":[37.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze claw","icon":"bronze claw","lvl":13,"input":{"bronze bar":2},"output":{"bronze claw":1},"expPa":[25],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand bronze claw","icon":"off-hand bronze claw","lvl":13,"input":{"bronze bar":2},"output":{"off-hand bronze claw":1},"expPa":[25],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze 2h sword","icon":"bronze 2h sword","lvl":14,"input":{"bronze bar":3},"output":{"bronze 2h sword":1},"expPa":[37.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze platelegs","icon":"bronze platelegs","lvl":16,"input":{"bronze bar":3},"output":{"bronze platelegs":1},"expPa":[37.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze plateskirt","icon":"bronze plateskirt","lvl":16,"input":{"bronze bar":3},"output":{"bronze plateskirt":1},"expPa":[37.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Bronze platebody","icon":"bronze platebody","lvl":18,"input":{"bronze bar":5},"output":{"bronze platebody":1},"expPa":[62.5],"actionPh":SMITH5},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron dagger","icon":"iron dagger","lvl":15,"input":{"iron bar":1},"output":{"iron dagger":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand iron dagger","icon":"off-hand iron dagger","lvl":15,"input":{"iron bar":1},"output":{"off-hand iron dagger":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron hatchet","icon":"iron hatchet","lvl":16,"input":{"iron bar":1},"output":{"iron hatchet":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron spit","icon":"iron spit","lvl":16,"input":{"iron bar":1},"output":{"iron spit":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron mace","icon":"iron mace","lvl":17,"input":{"iron bar":1},"output":{"iron mace":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand iron mace","icon":"off-hand iron mace","lvl":17,"input":{"iron bar":1},"output":{"off-hand iron mace":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron helm","icon":"iron helm","lvl":18,"input":{"iron bar":1},"output":{"iron helm":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron bolts (unf)","icon":"iron bolts (unf)","lvl":18,"input":{"iron bar":1},"output":{"iron bolts (unf)":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron sword","icon":"iron sword","lvl":19,"input":{"iron bar":1},"output":{"iron sword":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand iron sword","icon":"off-hand iron sword","lvl":19,"input":{"iron bar":1},"output":{"off-hand iron sword":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron dart tip","icon":"iron dart tip","lvl":19,"input":{"iron bar":1},"output":{"iron dart tip":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron nails","icon":"iron nails","lvl":19,"input":{"iron bar":1},"output":{"iron nails":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron arrowheads","icon":"iron arrowheads","lvl":20,"input":{"iron bar":1},"output":{"iron arrowheads":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron scimitar","icon":"iron scimitar","lvl":20,"input":{"iron bar":2},"output":{"iron scimitar":1},"expPa":[50],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand iron scimitar","icon":"off-hand iron scimitar","lvl":20,"input":{"iron bar":2},"output":{"off-hand iron scimitar":1},"expPa":[50],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron pickaxe","icon":"iron pickaxe","lvl":20,"input":{"iron bar":2},"output":{"iron pickaxe":1},"expPa":[50],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron longsword","icon":"iron longsword","lvl":21,"input":{"iron bar":2},"output":{"iron longsword":1},"expPa":[50],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand iron longsword","icon":"off-hand iron longsword","lvl":21,"input":{"iron bar":2},"output":{"off-hand iron longsword":1},"expPa":[50],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron knife","icon":"iron knife","lvl":22,"input":{"iron bar":1},"output":{"iron knife":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand iron knife","icon":"off-hand iron knife","lvl":22,"input":{"iron bar":1},"output":{"off-hand iron knife":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron throwing axe","icon":"iron throwing axe","lvl":22,"input":{"iron bar":1},"output":{"iron throwing axe":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand iron throwing axe","icon":"off-hand iron throwing axe","lvl":22,"input":{"iron bar":1},"output":{"off-hand iron throwing axe":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron full helm","icon":"iron full helm","lvl":22,"input":{"iron bar":2},"output":{"iron full helm":1},"expPa":[50],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron limbs","icon":"iron limbs","lvl":23,"input":{"iron bar":1},"output":{"iron limbs":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron sq shield","icon":"iron sq shield","lvl":23,"input":{"iron bar":2},"output":{"iron sq shield":1},"expPa":[50],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron warhammer","icon":"iron warhammer","lvl":24,"input":{"iron bar":3},"output":{"iron warhammer":1},"expPa":[75],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand iron warhammer","icon":"off-hand iron warhammer","lvl":24,"input":{"iron bar":3},"output":{"off-hand iron warhammer":1},"expPa":[75],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron battleaxe","icon":"iron battleaxe","lvl":25,"input":{"iron bar":3},"output":{"iron battleaxe":1},"expPa":[75],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand iron battleaxe","icon":"off-hand iron battleaxe","lvl":25,"input":{"iron bar":3},"output":{"off-hand iron battleaxe":1},"expPa":[75],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Oil lantern frame","icon":"oil lantern frame","lvl":26,"input":{"iron bar":1},"output":{"oil lantern frame":1},"expPa":[25],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron chainbody","icon":"iron chainbody","lvl":26,"input":{"iron bar":3},"output":{"iron chainbody":1},"expPa":[75],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron kiteshield","icon":"iron kiteshield","lvl":27,"input":{"iron bar":3},"output":{"iron kiteshield":1},"expPa":[75],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron claw","icon":"iron claw","lvl":28,"input":{"iron bar":2},"output":{"iron claw":1},"expPa":[50],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand iron claw","icon":"off-hand iron claw","lvl":28,"input":{"iron bar":2},"output":{"off-hand iron claw":1},"expPa":[50],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron 2h sword","icon":"iron 2h sword","lvl":29,"input":{"iron bar":3},"output":{"iron 2h sword":1},"expPa":[75],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron plateskirt","icon":"iron plateskirt","lvl":31,"input":{"iron bar":3},"output":{"iron plateskirt":1},"expPa":[75],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron platelegs","icon":"iron platelegs","lvl":31,"input":{"iron bar":3},"output":{"iron platelegs":1},"expPa":[75],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Iron platebody","icon":"iron platebody","lvl":33,"input":{"iron bar":5},"output":{"iron platebody":1},"expPa":[125],"actionPh":SMITH5},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel dagger","icon":"steel dagger","lvl":30,"input":{"steel bar":1},"output":{"steel dagger":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand steel dagger","icon":"off-hand steel dagger","lvl":30,"input":{"steel bar":1},"output":{"off-hand steel dagger":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel hatchet","icon":"steel hatchet","lvl":31,"input":{"steel bar":1},"output":{"steel hatchet":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel mace","icon":"steel mace","lvl":32,"input":{"steel bar":1},"output":{"steel mace":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand steel mace","icon":"off-hand steel mace","lvl":32,"input":{"steel bar":1},"output":{"off-hand steel mace":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel helm","icon":"steel helm","lvl":33,"input":{"steel bar":1},"output":{"steel helm":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel bolts (unf)","icon":"steel bolts (unf)","lvl":33,"input":{"steel bar":1},"output":{"steel bolts (unf)":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel sword","icon":"steel sword","lvl":34,"input":{"steel bar":1},"output":{"steel sword":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand steel sword","icon":"off-hand steel sword","lvl":34,"input":{"steel bar":1},"output":{"off-hand steel sword":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel dart tip","icon":"steel dart tip","lvl":34,"input":{"steel bar":1},"output":{"steel dart tip":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel nails","icon":"steel nails","lvl":34,"input":{"steel bar":1},"output":{"steel nails":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel arrowheads","icon":"steel arrowheads","lvl":35,"input":{"steel bar":1},"output":{"steel arrowheads":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel scimitar","icon":"steel scimitar","lvl":35,"input":{"steel bar":2},"output":{"steel scimitar":1},"expPa":[75],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand steel scimitar","icon":"off-hand steel scimitar","lvl":35,"input":{"steel bar":2},"output":{"off-hand steel scimitar":1},"expPa":[75],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel pickaxe","icon":"steel pickaxe","lvl":35,"input":{"steel bar":2},"output":{"steel pickaxe":1},"expPa":[75],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel limbs","icon":"steel limbs","lvl":36,"input":{"steel bar":1},"output":{"steel limbs":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel longsword","icon":"steel longsword","lvl":36,"input":{"steel bar":2},"output":{"steel longsword":1},"expPa":[75],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand steel longsword","icon":"off-hand steel longsword","lvl":36,"input":{"steel bar":2},"output":{"off-hand steel longsword":1},"expPa":[75],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel knife","icon":"steel knife","lvl":37,"input":{"steel bar":1},"output":{"steel knife":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand steel knife","icon":"off-hand steel knife","lvl":37,"input":{"steel bar":1},"output":{"off-hand steel knife":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel throwing axe","icon":"steel throwing axe","lvl":37,"input":{"steel bar":1},"output":{"steel throwing axe":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand steel throwing axe","icon":"off-hand steel throwing axe","lvl":37,"input":{"steel bar":1},"output":{"off-hand steel throwing axe":1},"expPa":[37.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel full helm","icon":"steel full helm","lvl":37,"input":{"steel bar":2},"output":{"steel full helm":1},"expPa":[75],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel sq shield","icon":"steel sq shield","lvl":38,"input":{"steel bar":2},"output":{"steel sq shield":1},"expPa":[75],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel warhammer","icon":"steel warhammer","lvl":39,"input":{"steel bar":3},"output":{"steel warhammer":1},"expPa":[112.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand steel warhammer","icon":"off-hand steel warhammer","lvl":39,"input":{"steel bar":3},"output":{"off-hand steel warhammer":1},"expPa":[112.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel battleaxe","icon":"steel battleaxe","lvl":40,"input":{"steel bar":3},"output":{"steel battleaxe":1},"expPa":[112.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand steel battleaxe","icon":"off-hand steel battleaxe","lvl":40,"input":{"steel bar":3},"output":{"off-hand steel battleaxe":1},"expPa":[112.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel chainbody","icon":"steel chainbody","lvl":41,"input":{"steel bar":3},"output":{"steel chainbody":1},"expPa":[112.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel kiteshield","icon":"steel kiteshield","lvl":42,"input":{"steel bar":3},"output":{"steel kiteshield":1},"expPa":[112.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel claw","icon":"steel claw","lvl":43,"input":{"steel bar":2},"output":{"steel claw":1},"expPa":[75],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Off-hand steel claw","icon":"off-hand steel claw","lvl":43,"input":{"steel bar":2},"output":{"off-hand steel claw":1},"expPa":[75],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel 2h sword","icon":"steel 2h sword","lvl":44,"input":{"steel bar":3},"output":{"steel 2h sword":1},"expPa":[112.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel platelegs","icon":"steel platelegs","lvl":46,"input":{"steel bar":3},"output":{"steel platelegs":1},"expPa":[112.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel plateskirt","icon":"steel plateskirt","lvl":46,"input":{"steel bar":3},"output":{"steel plateskirt":1},"expPa":[112.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{},"name":"Steel platebody","icon":"steel platebody","lvl":48,"input":{"steel bar":5},"output":{"steel platebody":1},"expPa":[187.5],"actionPh":SMITH5},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril dagger","icon":"mithril dagger","lvl":50,"input":{"mithril bar":1},"output":{"mithril dagger":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand mithril dagger","icon":"off-hand mithril dagger","lvl":50,"input":{"mithril bar":1},"output":{"off-hand mithril dagger":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril hatchet","icon":"mithril hatchet","lvl":51,"input":{"mithril bar":1},"output":{"mithril hatchet":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril mace","icon":"mithril mace","lvl":52,"input":{"mithril bar":1},"output":{"mithril mace":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand mithril mace","icon":"off-hand mithril mace","lvl":52,"input":{"mithril bar":1},"output":{"off-hand mithril mace":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril helm","icon":"mithril helm","lvl":53,"input":{"mithril bar":1},"output":{"mithril helm":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril bolts (unf)","icon":"mithril bolts (unf)","lvl":53,"input":{"mithril bar":1},"output":{"mithril bolts (unf)":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril sword","icon":"mithril sword","lvl":54,"input":{"mithril bar":1},"output":{"mithril sword":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand mithril sword","icon":"off-hand mithril sword","lvl":54,"input":{"mithril bar":1},"output":{"off-hand mithril sword":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril dart tip","icon":"mithril dart tip","lvl":54,"input":{"mithril bar":1},"output":{"mithril dart tip":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril nails","icon":"mithril nails","lvl":54,"input":{"mithril bar":1},"output":{"mithril nails":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril arrowheads","icon":"mithril arrowheads","lvl":55,"input":{"mithril bar":1},"output":{"mithril arrowheads":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril scimitar","icon":"mithril scimitar","lvl":55,"input":{"mithril bar":2},"output":{"mithril scimitar":1},"expPa":[100],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand mithril scimitar","icon":"off-hand mithril scimitar","lvl":55,"input":{"mithril bar":2},"output":{"off-hand mithril scimitar":1},"expPa":[100],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril pickaxe","icon":"mithril pickaxe","lvl":55,"input":{"mithril bar":2},"output":{"mithril pickaxe":1},"expPa":[100],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril limbs","icon":"mithril limbs","lvl":56,"input":{"mithril bar":1},"output":{"mithril limbs":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril longsword","icon":"mithril longsword","lvl":56,"input":{"mithril bar":2},"output":{"mithril longsword":1},"expPa":[100],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand mithril longsword","icon":"off-hand mithril longsword","lvl":56,"input":{"mithril bar":2},"output":{"off-hand mithril longsword":1},"expPa":[100],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril knife","icon":"mithril knife","lvl":57,"input":{"mithril bar":1},"output":{"mithril knife":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand mithril knife","icon":"off-hand mithril knife","lvl":57,"input":{"mithril bar":1},"output":{"off-hand mithril knife":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril throwing axe","icon":"mithril throwing axe","lvl":57,"input":{"mithril bar":1},"output":{"mithril throwing axe":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand mithril throwing axe","icon":"off-hand mithril throwing axe","lvl":57,"input":{"mithril bar":1},"output":{"off-hand mithril throwing axe":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril full helm","icon":"mithril full helm","lvl":57,"input":{"mithril bar":2},"output":{"mithril full helm":1},"expPa":[100],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril sq shield","icon":"mithril sq shield","lvl":58,"input":{"mithril bar":2},"output":{"mithril sq shield":1},"expPa":[100],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mith grapple tip","icon":"mith grapple tip","lvl":59,"input":{"mithril bar":1},"output":{"mith grapple tip":1},"expPa":[50],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril warhammer","icon":"mithril warhammer","lvl":59,"input":{"mithril bar":3},"output":{"mithril warhammer":1},"expPa":[150],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand mithril warhammer","icon":"off-hand mithril warhammer","lvl":59,"input":{"mithril bar":3},"output":{"off-hand mithril warhammer":1},"expPa":[150],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril battleaxe","icon":"mithril battleaxe","lvl":60,"input":{"mithril bar":3},"output":{"mithril battleaxe":1},"expPa":[150],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand mithril battleaxe","icon":"off-hand mithril battleaxe","lvl":60,"input":{"mithril bar":3},"output":{"off-hand mithril battleaxe":1},"expPa":[150],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril chainbody","icon":"mithril chainbody","lvl":61,"input":{"mithril bar":3},"output":{"mithril chainbody":1},"expPa":[150],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril kiteshield","icon":"mithril kiteshield","lvl":62,"input":{"mithril bar":3},"output":{"mithril kiteshield":1},"expPa":[150],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril claw","icon":"mithril claw","lvl":63,"input":{"mithril bar":2},"output":{"mithril claw":1},"expPa":[100],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand mithril claw","icon":"off-hand mithril claw","lvl":63,"input":{"mithril bar":2},"output":{"off-hand mithril claw":1},"expPa":[100],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril 2h sword","icon":"mithril 2h sword","lvl":64,"input":{"mithril bar":3},"output":{"mithril 2h sword":1},"expPa":[150],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril platelegs","icon":"mithril platelegs","lvl":66,"input":{"mithril bar":3},"output":{"mithril platelegs":1},"expPa":[150],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril plateskirt","icon":"mithril plateskirt","lvl":66,"input":{"mithril bar":3},"output":{"mithril plateskirt":1},"expPa":[150],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Mithril platebody","icon":"mithril platebody","lvl":68,"input":{"mithril bar":5},"output":{"mithril platebody":1},"expPa":[250],"actionPh":SMITH5},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant dagger","icon":"adamant dagger","lvl":70,"input":{"adamant bar":1},"output":{"adamant dagger":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand adamant dagger","icon":"off-hand adamant dagger","lvl":70,"input":{"adamant bar":1},"output":{"off-hand adamant dagger":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant hatchet","icon":"adamant hatchet","lvl":71,"input":{"adamant bar":1},"output":{"adamant hatchet":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant mace","icon":"adamant mace","lvl":72,"input":{"adamant bar":1},"output":{"adamant mace":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand adamant mace","icon":"off-hand adamant mace","lvl":72,"input":{"adamant bar":1},"output":{"off-hand adamant mace":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant helm","icon":"adamant helm","lvl":73,"input":{"adamant bar":1},"output":{"adamant helm":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant bolts (unf)","icon":"adamant bolts (unf)","lvl":73,"input":{"adamant bar":1},"output":{"adamant bolts (unf)":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant sword","icon":"adamant sword","lvl":74,"input":{"adamant bar":1},"output":{"adamant sword":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand adamant sword","icon":"off-hand adamant sword","lvl":74,"input":{"adamant bar":1},"output":{"off-hand adamant sword":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant dart tip","icon":"adamant dart tip","lvl":74,"input":{"adamant bar":1},"output":{"adamant dart tip":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamantite nails","icon":"adamantite nails","lvl":74,"input":{"adamant bar":1},"output":{"adamantite nails":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant arrowheads","icon":"adamant arrowheads","lvl":75,"input":{"adamant bar":1},"output":{"adamant arrowheads":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant scimitar","icon":"adamant scimitar","lvl":75,"input":{"adamant bar":2},"output":{"adamant scimitar":1},"expPa":[125],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand adamant scimitar","icon":"off-hand adamant scimitar","lvl":75,"input":{"adamant bar":2},"output":{"off-hand adamant scimitar":1},"expPa":[125],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant pickaxe","icon":"adamant pickaxe","lvl":75,"input":{"adamant bar":2},"output":{"adamant pickaxe":1},"expPa":[125],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamantite limbs","icon":"adamantite limbs","lvl":76,"input":{"adamant bar":1},"output":{"adamantite limbs":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant longsword","icon":"adamant longsword","lvl":76,"input":{"adamant bar":2},"output":{"adamant longsword":1},"expPa":[125],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand adamant longsword","icon":"off-hand adamant longsword","lvl":76,"input":{"adamant bar":2},"output":{"off-hand adamant longsword":1},"expPa":[125],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant knife","icon":"adamant knife","lvl":77,"input":{"adamant bar":1},"output":{"adamant knife":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand adamant knife","icon":"off-hand adamant knife","lvl":77,"input":{"adamant bar":1},"output":{"off-hand adamant knife":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant throwing axe","icon":"adamant throwing axe","lvl":77,"input":{"adamant bar":1},"output":{"adamant throwing axe":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand adamant throwing axe","icon":"off-hand adamant throwing axe","lvl":77,"input":{"adamant bar":1},"output":{"off-hand adamant throwing axe":1},"expPa":[62.5],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant full helm","icon":"adamant full helm","lvl":77,"input":{"adamant bar":2},"output":{"adamant full helm":1},"expPa":[125],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant sq shield","icon":"adamant sq shield","lvl":78,"input":{"adamant bar":2},"output":{"adamant sq shield":1},"expPa":[125],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant warhammer","icon":"adamant warhammer","lvl":79,"input":{"adamant bar":3},"output":{"adamant warhammer":1},"expPa":[187.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand adamant warhammer","icon":"off-hand adamant warhammer","lvl":79,"input":{"adamant bar":3},"output":{"off-hand adamant warhammer":1},"expPa":[187.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant battleaxe","icon":"adamant battleaxe","lvl":80,"input":{"adamant bar":3},"output":{"adamant battleaxe":1},"expPa":[187.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand adamant battleaxe","icon":"off-hand adamant battleaxe","lvl":80,"input":{"adamant bar":3},"output":{"off-hand adamant battleaxe":1},"expPa":[187.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant chainbody","icon":"adamant chainbody","lvl":81,"input":{"adamant bar":3},"output":{"adamant chainbody":1},"expPa":[187.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant kiteshield","icon":"adamant kiteshield","lvl":82,"input":{"adamant bar":3},"output":{"adamant kiteshield":1},"expPa":[187.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant claw","icon":"adamant claw","lvl":83,"input":{"adamant bar":2},"output":{"adamant claw":1},"expPa":[125],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand adamant claw","icon":"off-hand adamant claw","lvl":83,"input":{"adamant bar":2},"output":{"off-hand adamant claw":1},"expPa":[125],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant 2h sword","icon":"adamant 2h sword","lvl":84,"input":{"adamant bar":3},"output":{"adamant 2h sword":1},"expPa":[187.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant platelegs","icon":"adamant platelegs","lvl":86,"input":{"adamant bar":3},"output":{"adamant platelegs":1},"expPa":[187.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant plateskirt","icon":"adamant plateskirt","lvl":86,"input":{"adamant bar":3},"output":{"adamant plateskirt":1},"expPa":[187.5],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Adamant platebody","icon":"adamant platebody","lvl":88,"input":{"adamant bar":5},"output":{"adamant platebody":1},"expPa":[312.5],"actionPh":SMITH5},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune dagger","icon":"rune dagger","lvl":85,"input":{"rune bar":1},"output":{"rune dagger":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand rune dagger","icon":"off-hand rune dagger","lvl":85,"input":{"rune bar":1},"output":{"off-hand rune dagger":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune hatchet","icon":"rune hatchet","lvl":86,"input":{"rune bar":1},"output":{"rune hatchet":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune mace","icon":"rune mace","lvl":87,"input":{"rune bar":1},"output":{"rune mace":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand rune mace","icon":"off-hand rune mace","lvl":87,"input":{"rune bar":1},"output":{"off-hand rune mace":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune helm","icon":"rune helm","lvl":88,"input":{"rune bar":1},"output":{"rune helm":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Runite bolts (unf)","icon":"runite bolts (unf)","lvl":88,"input":{"rune bar":1},"output":{"runite bolts (unf)":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune sword","icon":"rune sword","lvl":89,"input":{"rune bar":1},"output":{"rune sword":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand rune sword","icon":"off-hand rune sword","lvl":89,"input":{"rune bar":1},"output":{"off-hand rune sword":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune dart tip","icon":"rune dart tip","lvl":89,"input":{"rune bar":1},"output":{"rune dart tip":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune nails","icon":"rune nails","lvl":89,"input":{"rune bar":1},"output":{"rune nails":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune arrowheads","icon":"rune arrowheads","lvl":90,"input":{"rune bar":1},"output":{"rune arrowheads":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune scimitar","icon":"rune scimitar","lvl":90,"input":{"rune bar":2},"output":{"rune scimitar":1},"expPa":[150],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand rune scimitar","icon":"off-hand rune scimitar","lvl":90,"input":{"rune bar":2},"output":{"off-hand rune scimitar":1},"expPa":[150],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune pickaxe","icon":"rune pickaxe","lvl":90,"input":{"rune bar":2},"output":{"rune pickaxe":1},"expPa":[150],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Runite limbs","icon":"runite limbs","lvl":91,"input":{"rune bar":1},"output":{"runite limbs":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune longsword","icon":"rune longsword","lvl":91,"input":{"rune bar":2},"output":{"rune longsword":1},"expPa":[150],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand rune longsword","icon":"off-hand rune longsword","lvl":91,"input":{"rune bar":2},"output":{"off-hand rune longsword":1},"expPa":[150],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune knife","icon":"rune knife","lvl":92,"input":{"rune bar":1},"output":{"rune knife":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand rune knife","icon":"off-hand rune knife","lvl":92,"input":{"rune bar":1},"output":{"off-hand rune knife":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune throwing axe","icon":"rune throwing axe","lvl":92,"input":{"rune bar":1},"output":{"rune throwing axe":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand rune throwing axe","icon":"off-hand rune throwing axe","lvl":92,"input":{"rune bar":1},"output":{"off-hand rune throwing axe":1},"expPa":[75],"actionPh":SMITH1},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune full helm","icon":"rune full helm","lvl":92,"input":{"rune bar":2},"output":{"rune full helm":1},"expPa":[150],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune sq shield","icon":"rune sq shield","lvl":93,"input":{"rune bar":2},"output":{"rune sq shield":1},"expPa":[150],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune warhammer","icon":"rune warhammer","lvl":94,"input":{"rune bar":3},"output":{"rune warhammer":1},"expPa":[225],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand rune warhammer","icon":"off-hand rune warhammer","lvl":94,"input":{"rune bar":3},"output":{"off-hand rune warhammer":1},"expPa":[225],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune battleaxe","icon":"rune battleaxe","lvl":95,"input":{"rune bar":3},"output":{"rune battleaxe":1},"expPa":[225],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand rune battleaxe","icon":"off-hand rune battleaxe","lvl":95,"input":{"rune bar":3},"output":{"off-hand rune battleaxe":1},"expPa":[225],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune chainbody","icon":"rune chainbody","lvl":96,"input":{"rune bar":3},"output":{"rune chainbody":1},"expPa":[225],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune kiteshield","icon":"rune kiteshield","lvl":97,"input":{"rune bar":3},"output":{"rune kiteshield":1},"expPa":[225],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune claw","icon":"rune claw","lvl":98,"input":{"rune bar":2},"output":{"rune claw":1},"expPa":[150],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Off-hand rune claw","icon":"off-hand rune claw","lvl":98,"input":{"rune bar":2},"output":{"off-hand rune claw":1},"expPa":[150],"actionPh":SMITH2},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune 2h sword","icon":"rune 2h sword","lvl":99,"input":{"rune bar":3},"output":{"rune 2h sword":1},"expPa":[225],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune platelegs","icon":"rune platelegs","lvl":99,"input":{"rune bar":3},"output":{"rune platelegs":1},"expPa":[225],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune plateskirt","icon":"rune plateskirt","lvl":99,"input":{"rune bar":3},"output":{"rune plateskirt":1},"expPa":[225],"actionPh":SMITH3},
{"exclude":0,"hide":0,"boost":['scroll','yak'],"mod":{'sc':1},"name":"Rune platebody","icon":"rune platebody","lvl":99,"input":{"rune bar":5},"output":{"rune platebody":1},"expPa":[375],"actionPh":SMITH5},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Iron burial armour i","icon":"iron burial armour","lvl":30,"input":{"iron ore":1},"output":{"iron burial armour":1},"expPa":[111.1],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Iron burial armour ii","icon":"iron burial armour","lvl":30,"input":{"iron ore":9},"output":{"iron burial armour":1},"expPa":[222.2],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Iron burial armour iii","icon":"iron burial armour","lvl":30,"input":{"iron ore":12},"output":{"iron burial armour":1},"expPa":[264],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Steel burial armour i","icon":"steel burial armour","lvl":45,"input":{"iron ore":1,"coal":2},"output":{"steel burial armour":1},"expPa":[144.1],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Steel burial armour ii","icon":"steel burial armour","lvl":45,"input":{"iron ore":4,"coal":7},"output":{"steel burial armour":1},"expPa":[278.3],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Steel burial armour iii","icon":"steel burial armour","lvl":45,"input":{"iron ore":9,"coal":17},"output":{"steel burial armour":1},"expPa":[389.4],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Mithril burial armour i","icon":"mithril burial armour","lvl":60,"input":{"mithril ore":1,"coal":4},"output":{"mithril burial armour":1},"expPa":[180.4],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Mithril burial armour ii","icon":"mithril burial armour","lvl":60,"input":{"mithril ore":3,"coal":12},"output":{"mithril burial armour":1},"expPa":[347.6],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Mithril burial armour iii","icon":"mithril burial armour","lvl":60,"input":{"mithril ore":6,"coal":24},"output":{"mithril burial armour":1},"expPa":[444.4],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Adamant burial armour i","icon":"adamant burial armour","lvl":70,"input":{"adamantite ore":1,"coal":6},"output":{"adamant burial armour":1},"expPa":[305.8],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Adamant burial armour ii","icon":"adamant burial armour","lvl":70,"input":{"adamantite ore":3,"coal":14},"output":{"adamant burial armour":1},"expPa":[500.5],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Adamant burial armour iii","icon":"adamant burial armour","lvl":70,"input":{"adamantite ore":4,"coal":22},"output":{"adamant burial armour":1},"expPa":[624.8],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Rune burial armour i","icon":"rune burial armour","lvl":90,"input":{"runite ore":1,"coal":8},"output":{"rune burial armour":1},"expPa":[555.5],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Rune burial armour ii","icon":"rune burial armour","lvl":90,"input":{"runite ore":2,"coal":16},"output":{"rune burial armour":1},"expPa":[694.1],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Rune burial armour iii","icon":"rune burial armour","lvl":90,"input":{"runite ore":4,"coal":30},"output":{"rune burial armour":1},"expPa":[833.8],"actionPh":BURIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Iron ceremonial sword","icon":"iron ceremonial sword","lvl":30,"input":{"iron ore":75},"output":{"iron ceremonial sword":1},"expPa":[2593.6],"actionPh":CEREMONIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Steel ceremonial sword","icon":"steel ceremonial sword","lvl":45,"input":{"iron ore":40,"coal":80},"output":{"steel ceremonial sword":1},"expPa":[3630.4],"actionPh":CEREMONIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Mithril ceremonial sword","icon":"mithril ceremonial sword","lvl":60,"input":{"mithril ore":30,"coal":120},"output":{"mithril ceremonial sword":1},"expPa":[4356.8],"actionPh":CEREMONIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Adamant ceremonial sword","icon":"adamant ceremonial sword","lvl":70,"input":{"adamantite ore":25,"coal":150},"output":{"adamant ceremonial sword":1},"expPa":[5498.4],"actionPh":CEREMONIAL},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Rune ceremonial sword","icon":"rune ceremonial sword","lvl":90,"input":{"runite ore":18,"coal":144},"output":{"rune ceremonial sword":1},"expPa":[6846.4],"actionPh":CEREMONIAL},
{"exclude":0,"hide":0,"boost":['urn'],"mod":{},"name":"Bronze bar","icon":"bronze bar","lvl":1,"input":{"copper ore":1,"tin ore":1},"output":{"bronze bar":1},"expPa":[6.2],"actionPh":1100},
{"exclude":0,"hide":0,"boost":['urn'],"mod":{},"name":"Iron bar","icon":"iron bar","lvl":45,"input":{"iron ore":1},"output":{"iron bar":0.8},"expPa":[12.5],"actionPh":1400},
{"exclude":0,"hide":0,"boost":['urn'],"mod":{},"name":"Iron bar (Ring)","icon":"iron bar","lvl":15,"input":{"iron ore":1,"ring of forging":1/140},"output":{"iron bar":1},"expPa":[12.5],"actionPh":1400},
{"exclude":0,"hide":0,"boost":['urn'],"mod":{},"name":"Silver bar","icon":"silver bar","lvl":20,"input":{"silver ore":1},"output":{"silver bar":1},"expPa":[13.7],"actionPh":1400},
{"exclude":0,"hide":0,"boost":['urn'],"mod":{},"name":"Steel bar","icon":"steel bar","lvl":30,"input":{"iron ore":1,"coal":2},"output":{"steel bar":1},"expPa":[17.5],"actionPh":1100},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Gold bar","icon":"gold bar","lvl":40,"input":{"gold ore":1},"output":{"gold bar":1},"expPa":[22.5],"actionPh":1400},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Gold bar (Gauntlets)","icon":"gold bar","lvl":40,"input":{"gold ore":1},"output":{"gold bar":1},"expPa":[56.2],"actionPh":1400},
{"exclude":0,"hide":0,"boost":['urn'],"mod":{},"name":"Mithril bar","icon":"mithril bar","lvl":50,"input":{"mithril ore":1,"coal":4},"output":{"mithril bar":1},"expPa":[25],"actionPh":750},
{"exclude":0,"hide":0,"boost":['urn'],"mod":{},"name":"Adamant bar","icon":"adamant bar","lvl":70,"input":{"adamantite ore":1,"coal":6},"output":{"adamant bar":1},"expPa":[37.5],"actionPh":500},
{"exclude":0,"hide":0,"boost":['urn'],"mod":{},"name":"Rune bar","icon":"rune bar","lvl":85,"input":{"runite ore":1,"coal":8},"output":{"rune bar":1},"expPa":[50],"actionPh":550},


{"name":"Bronze bar","icon":"bronze bar","lvl":1,"input":{"copper ore":1,"tin ore":1,"nature rune":1},"output":{"bronze bar":1},"expPa":[6.2,{'magic':53}],"actionPh":2100},
{"name":"Iron bar","icon":"iron bar","lvl":15,"input":{"iron ore":1,"nature rune":1},"output":{"iron bar":1},"expPa":[12.5,{'magic':53}],"actionPh":2500},
{"name":"Silver bar","icon":"silver bar","lvl":20,"input":{"silver ore":1,"nature rune":1},"output":{"silver bar":1},"expPa":[13.7,{'magic':53}],"actionPh":2500},
{"name":"Steel bar","icon":"steel bar","lvl":30,"input":{"iron ore":1,"coal":2,"nature rune":1},"output":{"steel bar":1},"expPa":[17.5,{'magic':53}],"actionPh":2000},
{"name":"Gold bar (Superheat)","icon":"gold bar","lvl":40,"input":{"gold ore":1,"nature rune":1},"output":{"gold bar":1},"expPa":[22.5,{'magic':53}],"actionPh":2500},
{"name":"Gold bar (Superheat+Gaunt)","icon":"gold bar","lvl":40,"input":{"gold ore":1,"goldsmith gauntlets":1,"nature rune":1},"output":{"gold bar":1},"expPa":[56.2,{'magic':53}],"actionPh":2500},
{"name":"Mithril bar","icon":"mithril bar","lvl":50,"input":{"mithril ore":1,"coal":4,"nature rune":1},"output":{"mithril bar":1},"expPa":[25,{'magic':53}],"actionPh":1600},
{"name":"Adamant bar","icon":"adamant bar","lvl":70,"input":{"adamantite ore":1,"coal":6,"nature rune":1},"output":{"adamant bar":1},"expPa":[37.5,{'magic':53}],"actionPh":1200},
{"name":"Rune bar","icon":"rune bar","lvl":85,"input":{"runite ore":1,"coal":8,"nature rune":1},"output":{"rune bar":1},"expPa":[50,{'magic':53}],"actionPh":1200},


];
	
	
	
	



	boostList = {
		'urn':{'check':1,'func':(function(method){ method.expPa[0] += method.base.expPa[0] * 0.20; return method; })},
		'outfit':{'check':0,'func':(function(method){ method.expPa[0] += method.base.expPa[0] * 0.05; return method; })},
		'yak':{'check':1,'func':(function(method){ 
			if(method.actionPh == SMITH3){ method.actionPh = SMITH3YAK; }
			if(method.actionPh == SMITH5){ method.actionPh = SMITH5YAK; }
			return method; })},
		'scroll':{'check':1,'func':(function(method){ 
			for(var i in method.input){
				if(i == 'bronze bar' && method.input[i] >= 3){ method.input[i] -= 0.5; }
				if(i == 'iron bar' && method.input[i] >= 3){ method.input[i] -= 0.25; }
				if(i == 'steel bar' && method.input[i] >= 3){ method.input[i] -= 0.2; }
				if(i == 'mithril bar' && method.input[i] >= 3){ method.input[i] -= 0.1; }
				if(i == 'adamant bar' && method.input[i] >= 3){ method.input[i] -= 0.08; }
				if(i == 'rune bar' && method.input[i] >= 3){ method.input[i] -= 0.05; }
			}
			return method; })},
		
	};

	modList = {
		'sc':(function(m){
			var method = deepClone(m);
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




