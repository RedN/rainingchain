function initFletching(){
	videoId = 'f6-3fywubCI';
	skill = 'Fletching';

	//Format: actionPh = 
	//tick/h / ((t/a * a/i) + bank + timeInit) * a/i
	var BANK = 6;

	var BRUTALPH = 15000;
	var DARTPH = 6000 / ((1 * 1) + 0 + 0) * 10;
	
	var CUTPH = 6000 / ((3 * 28) + BANK + 0) * 28;
	var STRINGPH = 6000 / ((2 * 14) + BANK + 0) * 14;
	var BOLTSPH = 6000 / ((1 * 10) + 1 + 0) * 10*10;
	var ARROWPH = 6000 / ((2 * 10) + 1 + 0) * 10*15;

	var BOLTTIPSPH = 6000 / ((4 * 28) + BANK + 0) * 28*12;

		
	methodDb = [];
	methodPreDb = 
[
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Arrow shaft","icon":"arrow shaft","lvl":1,"input":{"logs":1/15},"output":{"arrow shaft":1},"expPa":[0.333],"actionPh":26250},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Headless arrow","icon":"headless arrow","lvl":1,"input":{"arrow shaft":1,"feather":1},"output":{"headless arrow":1},"expPa":[1],"actionPh":ARROWPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Bronze arrow","icon":"bronze arrow","lvl":1,"input":{"headless arrow":1,"bronze arrowheads":1},"output":{"bronze arrow":1},"expPa":[2.6],"actionPh":ARROWPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Iron arrow","icon":"iron arrow","lvl":15,"input":{"headless arrow":1,"iron arrowheads":1},"output":{"iron arrow":1},"expPa":[3.8],"actionPh":ARROWPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Steel arrow","icon":"steel arrow","lvl":30,"input":{"headless arrow":1,"steel arrowheads":1},"output":{"steel arrow":1},"expPa":[6.3],"actionPh":ARROWPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Mithril arrow","icon":"mithril arrow","lvl":45,"input":{"headless arrow":1,"mithril arrowheads":1},"output":{"mithril arrow":1},"expPa":[8.8],"actionPh":ARROWPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Broad arrow","icon":"broad arrow","lvl":52,"input":{"headless arrow":1,"broad arrowheads":1},"output":{"broad arrow":1},"expPa":[15],"actionPh":ARROWPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Adamant arrow","icon":"adamant arrow","lvl":60,"input":{"headless arrow":1,"adamant arrowheads":1},"output":{"adamant arrow":1},"expPa":[10],"actionPh":ARROWPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Rune arrow","icon":"rune arrow","lvl":75,"input":{"headless arrow":1,"rune arrowheads":1},"output":{"rune arrow":1},"expPa":[13.8],"actionPh":ARROWPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Dragon arrow","icon":"dragon arrow","lvl":90,"input":{"headless arrow":1,"dragon arrowheads":1},"output":{"dragon arrow":1},"expPa":[16.3],"actionPh":ARROWPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Bronze dart","icon":"bronze dart","lvl":1,"input":{"feather":1,"bronze dart tip":1},"output":{"bronze dart":1},"expPa":[1.8],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Off-hand bronze dart","icon":"off-hand bronze dart","lvl":1,"input":{"feather":1,"bronze dart tip":1},"output":{"off-hand bronze dart":1},"expPa":[1.8],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Iron dart","icon":"iron dart","lvl":22,"input":{"feather":1,"iron dart tip":1},"output":{"iron dart":1},"expPa":[3.8],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Off-hand iron dart","icon":"off-hand iron dart","lvl":22,"input":{"feather":1,"iron dart tip":1},"output":{"off-hand iron dart":1},"expPa":[3.8],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Steel dart","icon":"steel dart","lvl":37,"input":{"feather":1,"steel dart tip":1},"output":{"steel dart":1},"expPa":[7.5],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Off-hand steel dart","icon":"off-hand steel dart","lvl":37,"input":{"feather":1,"steel dart tip":1},"output":{"off-hand steel dart":1},"expPa":[7.5],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Mithril dart","icon":"mithril dart","lvl":52,"input":{"feather":1,"mithril dart tip":1},"output":{"mithril dart":1},"expPa":[11.2],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Off-hand mithril dart","icon":"off-hand mithril dart","lvl":52,"input":{"feather":1,"mithril dart tip":1},"output":{"off-hand mithril dart":1},"expPa":[11.2],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Adamant dart","icon":"adamant dart","lvl":67,"input":{"feather":1,"adamant dart tip":1},"output":{"adamant dart":1},"expPa":[15],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Off-hand adamant dart","icon":"off-hand adamant dart","lvl":67,"input":{"feather":1,"adamant dart tip":1},"output":{"off-hand adamant dart":1},"expPa":[15],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Rune dart","icon":"rune dart","lvl":81,"input":{"feather":1,"rune dart tip":1},"output":{"rune dart":1},"expPa":[18.8],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Off-hand rune dart","icon":"off-hand rune dart","lvl":81,"input":{"feather":1,"rune dart tip":1},"output":{"off-hand rune dart":1},"expPa":[18.8],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Dragon dart","icon":"dragon dart","lvl":95,"input":{"feather":1,"dragon dart tip":1},"output":{"dragon dart":1},"expPa":[25],"actionPh":DARTPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Off-hand dragon dart","icon":"off-hand dragon dart","lvl":95,"input":{"feather":1,"dragon dart tip":1},"output":{"off-hand dragon dart":1},"expPa":[25],"actionPh":DARTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Shortbow (u)","icon":"shortbow (u)","lvl":1,"input":{"logs":1},"output":{"shortbow (u)":1},"expPa":[5],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Shieldbow (u)","icon":"shieldbow (u)","lvl":10,"input":{"logs":1},"output":{"shieldbow (u)":1},"expPa":[10],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Oak shortbow (u)","icon":"oak shortbow (u)","lvl":20,"input":{"oak logs":1},"output":{"oak shortbow (u)":1},"expPa":[16.5],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Oak shieldbow (u)","icon":"oak shieldbow (u)","lvl":25,"input":{"oak logs":1},"output":{"oak shieldbow (u)":1},"expPa":[25],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Willow shortbow (u)","icon":"willow shortbow (u)","lvl":35,"input":{"willow logs":1},"output":{"willow shortbow (u)":1},"expPa":[33.25],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Willow shieldbow (u)","icon":"willow shieldbow (u)","lvl":40,"input":{"willow logs":1},"output":{"willow shieldbow (u)":1},"expPa":[41.5],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Maple shortbow (u)","icon":"maple shortbow (u)","lvl":50,"input":{"maple logs":1},"output":{"maple shortbow (u)":1},"expPa":[50],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Maple shieldbow (u)","icon":"maple shieldbow (u)","lvl":55,"input":{"maple logs":1},"output":{"maple shieldbow (u)":1},"expPa":[58.3],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Yew shortbow (u)","icon":"yew shortbow (u)","lvl":65,"input":{"yew logs":1},"output":{"yew shortbow (u)":1},"expPa":[67.5],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Yew shieldbow (u)","icon":"yew shieldbow (u)","lvl":70,"input":{"yew logs":1},"output":{"yew shieldbow (u)":1},"expPa":[75],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Magic shortbow (u)","icon":"magic shortbow (u)","lvl":80,"input":{"magic logs":1},"output":{"magic shortbow (u)":1},"expPa":[83.3],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Magic shieldbow (u)","icon":"magic shieldbow (u)","lvl":85,"input":{"magic logs":1},"output":{"magic shieldbow (u)":1},"expPa":[91.5],"actionPh":CUTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Shortbow","icon":"shortbow","lvl":1,"input":{"shortbow (u)":1,"bow string":1},"output":{"shortbow":1},"expPa":[5],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Shieldbow","icon":"shieldbow","lvl":10,"input":{"shieldbow (u)":1,"bow string":1},"output":{"shieldbow":1},"expPa":[10],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Oak shortbow","icon":"oak shortbow","lvl":20,"input":{"oak shortbow (u)":1,"bow string":1},"output":{"oak shortbow":1},"expPa":[16.5],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Oak shieldbow","icon":"oak shieldbow","lvl":25,"input":{"oak shieldbow (u)":1,"bow string":1},"output":{"oak shieldbow":1},"expPa":[25],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Willow shortbow","icon":"willow shortbow","lvl":35,"input":{"willow shortbow (u)":1,"bow string":1},"output":{"willow shortbow":1},"expPa":[33.25],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Willow shieldbow","icon":"willow shieldbow","lvl":40,"input":{"willow shieldbow (u)":1,"bow string":1},"output":{"willow shieldbow":1},"expPa":[41.5],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Maple shortbow","icon":"maple shortbow","lvl":50,"input":{"maple shortbow (u)":1,"bow string":1},"output":{"maple shortbow":1},"expPa":[50],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Maple shieldbow","icon":"maple shieldbow","lvl":55,"input":{"maple shieldbow (u)":1,"bow string":1},"output":{"maple shieldbow":1},"expPa":[58.3],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Yew shortbow","icon":"yew shortbow","lvl":65,"input":{"yew shortbow (u)":1,"bow string":1},"output":{"yew shortbow":1},"expPa":[67.5],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Yew shieldbow","icon":"yew shieldbow","lvl":70,"input":{"yew shieldbow (u)":1,"bow string":1},"output":{"yew shieldbow":1},"expPa":[75],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Magic shortbow","icon":"magic shortbow","lvl":80,"input":{"magic shortbow (u)":1,"bow string":1},"output":{"magic shortbow":1},"expPa":[83.3],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Magic shieldbow","icon":"magic shieldbow","lvl":85,"input":{"magic shieldbow (u)":1,"bow string":1},"output":{"magic shieldbow":1},"expPa":[91.5],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Wooden stock","icon":"wooden stock","lvl":9,"input":{"logs":1},"output":{"wooden stock":1},"expPa":[6],"actionPh":CUTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Oak stock","icon":"oak stock","lvl":24,"input":{"oak logs":1},"output":{"oak stock":1},"expPa":[16],"actionPh":CUTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Willow stock","icon":"willow stock","lvl":39,"input":{"willow logs":1},"output":{"willow stock":1},"expPa":[22],"actionPh":CUTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Teak stock","icon":"teak stock","lvl":46,"input":{"teak logs":1},"output":{"teak stock":1},"expPa":[27],"actionPh":CUTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Maple stock","icon":"maple stock","lvl":54,"input":{"maple logs":1},"output":{"maple stock":1},"expPa":[32],"actionPh":CUTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Mahogany stock","icon":"mahogany stock","lvl":61,"input":{"mahogany logs":1},"output":{"mahogany stock":1},"expPa":[41],"actionPh":CUTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Yew stock","icon":"yew stock","lvl":69,"input":{"yew logs":1},"output":{"yew stock":1},"expPa":[50],"actionPh":CUTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Magic stock","icon":"magic stock","lvl":94,"input":{"magic logs":1},"output":{"magic stock":1},"expPa":[100],"actionPh":CUTPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Bronze c'bow (u)","icon":"bronze c'bow (u)","lvl":9,"input":{"bronze limbs":1,"wooden stock":1},"output":{"bronze c'bow (u)":1},"expPa":[12],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Iron c'bow (u)","icon":"iron c'bow (u)","lvl":39,"input":{"iron limbs":1,"willow stock":1},"output":{"iron c'bow (u)":1},"expPa":[44],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Steel c'bow (u)","icon":"steel c'bow (u)","lvl":46,"input":{"steel limbs":1,"teak stock":1},"output":{"steel c'bow (u)":1},"expPa":[54],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Mithril c'bow (u)","icon":"mithril c'bow (u)","lvl":54,"input":{"mithril limbs":1,"maple stock":1},"output":{"mithril c'bow (u)":1},"expPa":[64],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Adamant c'bow (u)","icon":"adamant c'bow (u)","lvl":61,"input":{"adamantite limbs":1,"mahogany stock":1},"output":{"adamant c'bow (u)":1},"expPa":[82],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Runite c'bow (u)","icon":"runite c'bow (u)","lvl":69,"input":{"runite limbs":1,"yew stock":1},"output":{"runite c'bow (u)":1},"expPa":[100],"actionPh":STRINGPH},
{"exclude":1,"hide":3,"boost":[],"mod":{},"name":"Dragon c'bow (u)","icon":"dragon c'bow (u)","lvl":94,"input":{"dragon limbs":1,"magic stock":1},"output":{"dragon c'bow (u)":1},"expPa":[200],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Bronze crossbow","icon":"bronze crossbow","lvl":9,"input":{"bronze c'bow (u)":1,"crossbow string":1},"output":{"bronze crossbow":1},"expPa":[6],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Off-hand bronze crossbow","icon":"off-hand bronze crossbow","lvl":9,"input":{"bronze c'bow (u)":1,"crossbow string":1},"output":{"off-hand bronze crossbow":1},"expPa":[6],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Bronze 2h crossbow","icon":"bronze 2h crossbow","lvl":9,"input":{"bronze c'bow (u)":1,"crossbow string":1},"output":{"bronze 2h crossbow":1},"expPa":[6],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Iron crossbow","icon":"iron crossbow","lvl":24,"input":{"iron c'bow (u)":1,"crossbow string":1},"output":{"iron crossbow":1},"expPa":[16],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Off-hand iron crossbow","icon":"off-hand iron crossbow","lvl":24,"input":{"iron c'bow (u)":1,"crossbow string":1},"output":{"off-hand iron crossbow":1},"expPa":[16],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Iron 2h crossbow","icon":"iron 2h crossbow","lvl":24,"input":{"iron c'bow (u)":1,"crossbow string":1},"output":{"iron 2h crossbow":1},"expPa":[16],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Steel crossbow","icon":"steel crossbow","lvl":39,"input":{"steel c'bow (u)":1,"crossbow string":1},"output":{"steel crossbow":1},"expPa":[22],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Off-hand steel crossbow","icon":"off-hand steel crossbow","lvl":39,"input":{"steel c'bow (u)":1,"crossbow string":1},"output":{"off-hand steel crossbow":1},"expPa":[22],"actionPh":STRINGPH},
{"exclude":0,"hide":1,"boost":[],"mod":{},"name":"Steel 2h crossbow","icon":"steel 2h crossbow","lvl":39,"input":{"steel c'bow (u)":1,"crossbow string":1},"output":{"steel 2h crossbow":1},"expPa":[22],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Mith crossbow","icon":"mith crossbow","lvl":54,"input":{"mithril c'bow (u)":1,"crossbow string":1},"output":{"mith crossbow":1},"expPa":[32],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Off-hand mithril crossbow","icon":"off-hand mithril crossbow","lvl":54,"input":{"mithril c'bow (u)":1,"crossbow string":1},"output":{"off-hand mithril crossbow":1},"expPa":[32],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Mithril 2h crossbow","icon":"mithril 2h crossbow","lvl":54,"input":{"mithril c'bow (u)":1,"crossbow string":1},"output":{"mithril 2h crossbow":1},"expPa":[32],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Adamant crossbow","icon":"adamant crossbow","lvl":61,"input":{"adamant c'bow (u)":1,"crossbow string":1},"output":{"adamant crossbow":1},"expPa":[41],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Off-hand adamant crossbow","icon":"off-hand adamant crossbow","lvl":61,"input":{"adamant c'bow (u)":1,"crossbow string":1},"output":{"off-hand adamant crossbow":1},"expPa":[41],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Adamant 2h crossbow","icon":"adamant 2h crossbow","lvl":61,"input":{"adamant c'bow (u)":1,"crossbow string":1},"output":{"adamant 2h crossbow":1},"expPa":[41],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Rune crossbow","icon":"rune crossbow","lvl":69,"input":{"runite c'bow (u)":1,"crossbow string":1},"output":{"rune crossbow":1},"expPa":[50],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Off-hand rune crossbow","icon":"off-hand rune crossbow","lvl":69,"input":{"runite c'bow (u)":1,"crossbow string":1},"output":{"off-hand rune crossbow":1},"expPa":[50],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Rune 2h crossbow","icon":"rune 2h crossbow","lvl":69,"input":{"runite c'bow (u)":1,"crossbow string":1},"output":{"rune 2h crossbow":1},"expPa":[50],"actionPh":STRINGPH},
{"exclude":1,"hide":3,"boost":[],"mod":{},"name":"Dragon crossbow","icon":"dragon crossbow","lvl":94,"input":{"dragon c'bow (u)":1,"crossbow string":1},"output":{"dragon crossbow":1},"expPa":[100],"actionPh":STRINGPH},
{"exclude":1,"hide":3,"boost":[],"mod":{},"name":"Off-hand dragon crossbow","icon":"off-hand dragon crossbow","lvl":94,"input":{"dragon c'bow (u)":1,"crossbow string":1},"output":{"off-hand dragon crossbow":1},"expPa":[100],"actionPh":STRINGPH},
{"exclude":1,"hide":3,"boost":[],"mod":{},"name":"Dragon 2h crossbow","icon":"dragon 2h crossbow","lvl":94,"input":{"dragon c'bow (u)":1,"crossbow string":1},"output":{"dragon 2h crossbow":1},"expPa":[100],"actionPh":STRINGPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Bronze bolts","icon":"bronze bolts","lvl":9,"input":{"bronze bolts (unf)":1,"feather":1},"output":{"bronze bolts":1},"expPa":[0.5],"actionPh":DARTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Iron bolts","icon":"iron bolts","lvl":19,"input":{"iron bolts (unf)":1,"feather":1},"output":{"iron bolts":1},"expPa":[1.5],"actionPh":DARTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Silver bolts","icon":"silver bolts","lvl":43,"input":{"silver bolts (unf)":1,"feather":1},"output":{"silver bolts":1},"expPa":[2.5],"actionPh":DARTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Steel bolts","icon":"steel bolts","lvl":46,"input":{"steel bolts (unf)":1,"feather":1},"output":{"steel bolts":1},"expPa":[3.5],"actionPh":DARTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Mithril bolts","icon":"mithril bolts","lvl":54,"input":{"mithril bolts (unf)":1,"feather":1},"output":{"mithril bolts":1},"expPa":[5],"actionPh":DARTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Broad-tipped bolts","icon":"broad-tipped bolts","lvl":55,"input":{"unfinished broad bolts":1,"feather":1},"output":{"broad-tipped bolts":1},"expPa":[3],"actionPh":DARTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Adamant bolts","icon":"adamant bolts","lvl":61,"input":{"adamant bolts (unf)":1,"feather":1},"output":{"adamant bolts":1},"expPa":[7],"actionPh":DARTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Runite bolts","icon":"runite bolts","lvl":69,"input":{"runite bolts (unf)":1,"feather":1},"output":{"runite bolts":1},"expPa":[10],"actionPh":DARTPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Opal bolts","icon":"opal bolts","lvl":11,"input":{"opal bolt tips":1,"bronze bolts":1},"output":{"opal bolts":1},"expPa":[1.6],"actionPh":BOLTSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Pearl bolts","icon":"pearl bolts","lvl":41,"input":{"pearl bolt tips":1,"iron bolts":1},"output":{"pearl bolts":1},"expPa":[3.2],"actionPh":BOLTSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Topaz bolts","icon":"topaz bolts","lvl":48,"input":{"topaz bolt tips":1,"steel bolts":1},"output":{"topaz bolts":1},"expPa":[3.9],"actionPh":BOLTSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Barbed bolts","icon":"barbed bolts","lvl":51,"input":{"barb bolttips":1,"bronze bolts":1},"output":{"barbed bolts":1},"expPa":[9.5],"actionPh":BOLTSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Sapphire bolts","icon":"sapphire bolts","lvl":56,"input":{"sapphire bolt tips":1,"mithril bolts":1},"output":{"sapphire bolts":1},"expPa":[4.7],"actionPh":BOLTSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Emerald bolts","icon":"emerald bolts","lvl":58,"input":{"emerald bolt tips":1,"mithril bolts":1},"output":{"emerald bolts":1},"expPa":[5.5],"actionPh":BOLTSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Ruby bolts","icon":"ruby bolts","lvl":63,"input":{"ruby bolt tips":1,"adamant bolts":1},"output":{"ruby bolts":1},"expPa":[6.3],"actionPh":BOLTSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Diamond bolts","icon":"diamond bolts","lvl":65,"input":{"diamond bolt tips":1,"adamant bolts":1},"output":{"diamond bolts":1},"expPa":[7],"actionPh":BOLTSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Dragon bolts","icon":"dragon bolts","lvl":71,"input":{"dragon bolt tips":1,"runite bolts":1},"output":{"dragon bolts":1},"expPa":[8.2],"actionPh":BOLTSPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Onyx bolts","icon":"onyx bolts","lvl":73,"input":{"onyx bolt tips":1,"runite bolts":1},"output":{"onyx bolts":1},"expPa":[9.4],"actionPh":BOLTSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Ascension bolts","icon":"ascension bolts","lvl":90,"input":{"ascension shard":1},"output":{"ascension bolts":1},"expPa":[20],"actionPh":BOLTSPH/2},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Opal bolt tips","icon":"opal bolt tips","lvl":11,"input":{"opal":1/12},"output":{"opal bolt tips":1},"expPa":[1.6],"actionPh":BOLTTIPSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Jade bolt tips","icon":"jade bolt tips","lvl":26,"input":{"jade":1/12},"output":{"jade bolt tips":1},"expPa":[2.4],"actionPh":BOLTTIPSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Pearl bolt tips","icon":"pearl bolt tips","lvl":41,"input":{"oyster pearl":1/12},"output":{"pearl bolt tips":1},"expPa":[3.2],"actionPh":BOLTTIPSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Pearl bolt tips","icon":"pearl bolt tips","lvl":41,"input":{"oyster pearls":1/12},"output":{"pearl bolt tips":1},"expPa":[3.2],"actionPh":BOLTTIPSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Topaz bolt tips","icon":"topaz bolt tips","lvl":48,"input":{"red topaz":1/12},"output":{"topaz bolt tips":1},"expPa":[3.9],"actionPh":BOLTTIPSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Sapphire bolt tips","icon":"sapphire bolt tips","lvl":56,"input":{"sapphire":1/12},"output":{"sapphire bolt tips":1},"expPa":[4.7],"actionPh":BOLTTIPSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Emerald bolt tips","icon":"emerald bolt tips","lvl":58,"input":{"emerald":1/12},"output":{"emerald bolt tips":1},"expPa":[5.5],"actionPh":BOLTTIPSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Ruby bolt tips","icon":"ruby bolt tips","lvl":63,"input":{"ruby":1/12},"output":{"ruby bolt tips":1},"expPa":[6.3],"actionPh":BOLTTIPSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Diamond bolt tips","icon":"diamond bolt tips","lvl":65,"input":{"diamond":1/12},"output":{"diamond bolt tips":1},"expPa":[7],"actionPh":BOLTTIPSPH},
{"exclude":0,"hide":0,"boost":[],"mod":{},"name":"Dragon bolt tips","icon":"dragon bolt tips","lvl":71,"input":{"dragonstone":1/12},"output":{"dragon bolt tips":1},"expPa":[8.2],"actionPh":BOLTTIPSPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Onyx bolt tips","icon":"onyx bolt tips","lvl":73,"input":{"onyx":1/24},"output":{"onyx bolt tips":1},"expPa":[9.4],"actionPh":BOLTTIPSPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Bronze brutal","icon":"bronze brutal","lvl":7,"input":{"flighted ogre arrow":1,"bronze nails":1},"output":{"bronze brutal":1},"expPa":[1.4],"actionPh":BRUTALPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Iron brutal","icon":"iron brutal","lvl":18,"input":{"flighted ogre arrow":1,"iron nails":1},"output":{"iron brutal":1},"expPa":[2.6],"actionPh":BRUTALPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Steel brutal","icon":"steel brutal","lvl":33,"input":{"flighted ogre arrow":1,"steel nails":1},"output":{"steel brutal":1},"expPa":[5.1],"actionPh":BRUTALPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Black brutal","icon":"black brutal","lvl":38,"input":{"flighted ogre arrow":1,"black nails":1},"output":{"black brutal":1},"expPa":[6.4],"actionPh":BRUTALPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Mithril brutal","icon":"mithril brutal","lvl":49,"input":{"flighted ogre arrow":1,"mithril nails":1},"output":{"mithril brutal":1},"expPa":[7.5],"actionPh":BRUTALPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Adamant brutal","icon":"adamant brutal","lvl":62,"input":{"flighted ogre arrow":1,"adamantite nails":1},"output":{"adamant brutal":1},"expPa":[10.1],"actionPh":BRUTALPH},
{"exclude":1,"hide":2,"boost":[],"mod":{},"name":"Rune brutal","icon":"rune brutal","lvl":77,"input":{"flighted ogre arrow":1,"rune nails":1},"output":{"rune brutal":1},"expPa":[12.5],"actionPh":BRUTALPH}
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




