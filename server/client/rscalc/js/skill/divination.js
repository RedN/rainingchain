function initDivination(){
	videoId = 'f6-3fywubCI';
	skill = 'Divination';

	//Format: actionPh = 
	//tick/h / ((t/a * a/i) + bank + timeInit) * a/i
	var DIV3 = 1200;
	var DIV4 = 1000;
	var DIV6 = 800;
	var COLLECT = 1100*1.1;
	
	methodDb = [];
	methodPreDb = 
[

{"name":"Draynor Rift (Own)","icon":"pale energy","lvl":1,"input":{},"output":{},"expPa":[4.55490909090909],"actionPh":COLLECT},
{"name":"Falador Rift (Own)","icon":"flickering energy","lvl":10,"input":{},"output":{},"expPa":[8.07381818181818],"actionPh":COLLECT},
{"name":"Digsite Rift (Own)","icon":"bright energy","lvl":20,"input":{},"output":{},"expPa":[11.192727272727272],"actionPh":COLLECT},
{"name":"Seer's Rift (Own)","icon":"glowing energy","lvl":30,"input":{},"output":{},"expPa":[15.379636363636362],"actionPh":COLLECT},
{"name":"Rellekka Rift (Own)","icon":"sparkling energy","lvl":40,"input":{},"output":{},"expPa":[23.670545454545454],"actionPh":COLLECT},
{"name":"Karamja Rift (Own)","icon":"gleaming energy","lvl":50,"input":{},"output":{},"expPa":[34.69745454545454],"actionPh":COLLECT},
{"name":"Mob. Armies Rift (Own)","icon":"vibrant energy","lvl":60,"input":{},"output":{},"expPa":[44.35636363636363],"actionPh":COLLECT},
{"name":"Canifis Rift (Own)","icon":"lustrous energy","lvl":70,"input":{},"output":{},"expPa":[55.38327272727272],"actionPh":COLLECT},
{"name":"MTA Rift (Own)","icon":"brillant energy","lvl":80,"input":{},"output":{},"expPa":[60.93818181818182],"actionPh":COLLECT},
{"name":"Dragontooth Rift (Own)","icon":"radiant energy","lvl":85,"input":{},"output":{},"expPa":[66.49309090909092],"actionPh":COLLECT},
{"name":"Sophanem Rift (Own)","icon":"luminous energy","lvl":90,"input":{},"output":{},"expPa":[73.416],"actionPh":1050},
{"name":"Poison Waste Rift (Own)","icon":"incandescent energy","lvl":95,"input":{},"output":{},"expPa":[78.97090909090907],"actionPh":COLLECT},

{"name":"Draynor Rift (Sell)","icon":"pale energy","lvl":1,"input":{},"output":{"pale energy":1},"expPa":[3.872727272727273],"actionPh":COLLECT} ,
{"name":"Falador Rift (Sell)","icon":"flickering energy","lvl":10,"input":{},"output":{"flickering energy":1},"expPa":[7.045454545454546],"actionPh":COLLECT} ,
{"name":"Digsite Rift (Sell)","icon":"bright energy","lvl":20,"input":{},"output":{"bright energy":1},"expPa":[9.818181818181818],"actionPh":COLLECT} ,
{"name":"Seer's Rift (Sell)","icon":"glowing energy","lvl":30,"input":{},"output":{"glowing energy":1},"expPa":[13.49090909090909],"actionPh":COLLECT} ,
{"name":"Rellekka Rift (Sell)","icon":"sparkling energy","lvl":40,"input":{},"output":{"sparkling energy":1},"expPa":[20.763636363636362],"actionPh":COLLECT} ,
{"name":"Karamja Rift (Sell)","icon":"gleaming energy","lvl":50,"input":{},"output":{"gleaming energy":1},"expPa":[30.436363636363637],"actionPh":COLLECT} ,
{"name":"Mob. Armies Rift (Sell)","icon":"vibrant energy","lvl":60,"input":{},"output":{"vibrant energy":2},"expPa":[38.90909090909091],"actionPh":COLLECT} ,
{"name":"Canifis Rift (Sell)","icon":"lustrous energy","lvl":70,"input":{},"output":{"lustrous energy":2},"expPa":[48.58181818181818],"actionPh":COLLECT} ,
{"name":"MTA Rift (Sell)","icon":"brillant energy","lvl":80,"input":{},"output":{"brillant energy":3},"expPa":[53.45454545454546],"actionPh":COLLECT} ,
{"name":"Dragontooth Rift (Sell)","icon":"radiant energy","lvl":85,"input":{},"output":{"radiant energy":3},"expPa":[58.327272727272735],"actionPh":COLLECT} ,
{"name":"Sophanem Rift (Sell)","icon":"luminous energy","lvl":90,"input":{},"output":{"luminous energy":3},"expPa":[64.4],"actionPh":1050} ,
{"name":"Poison Waste Rift (Sell)","icon":"incandescent energy","lvl":95,"input":{},"output":{"incandescent energy":3},"expPa":[69.27272727272727],"actionPh":COLLECT}, 


{"name":"Draynor Rift (Buy)","icon":"pale energy","lvl":1,"input":{"pale energy":4.454545454545454},"output":{},"expPa":[4.896],"actionPh":COLLECT},
{"name":"Falador Rift (Buy)","icon":"flickering energy","lvl":10,"input":{"flickering energy":4.454545454545454},"output":{},"expPa":[8.588],"actionPh":COLLECT},
{"name":"Digsite Rift (Buy)","icon":"bright energy","lvl":20,"input":{"bright energy":4.454545454545454},"output":{},"expPa":[11.88],"actionPh":COLLECT},
{"name":"Seer's Rift (Buy)","icon":"glowing energy","lvl":30,"input":{"glowing energy":4.454545454545454},"output":{},"expPa":[16.323999999999998],"actionPh":COLLECT},
{"name":"Rellekka Rift (Buy)","icon":"sparkling energy","lvl":40,"input":{"sparkling energy":4.454545454545454},"output":{},"expPa":[25.124],"actionPh":COLLECT},
{"name":"Karamja Rift (Buy)","icon":"gleaming energy","lvl":50,"input":{"gleaming energy":4.454545454545454},"output":{},"expPa":[36.827999999999996],"actionPh":COLLECT},
{"name":"Mob. Armies Rift (Buy)","icon":"vibrant energy","lvl":60,"input":{"vibrant energy":3.4545454545454546},"output":{},"expPa":[47.08],"actionPh":COLLECT},
{"name":"Canifis Rift (Buy)","icon":"lustrous energy","lvl":70,"input":{"lustrous energy":3.4545454545454546},"output":{},"expPa":[58.784],"actionPh":COLLECT},
{"name":"MTA Rift (Buy)","icon":"brillant energy","lvl":80,"input":{"brillant energy":2.4545454545454546},"output":{},"expPa":[64.68],"actionPh":COLLECT},
{"name":"Dragontooth Rift (Buy)","icon":"radiant energy","lvl":85,"input":{"radiant energy":2.4545454545454546},"output":{},"expPa":[70.57600000000001],"actionPh":COLLECT},
{"name":"Sophanem Rift (Buy)","icon":"luminous energy","lvl":90,"input":{"luminous energy":2.4545454545454546},"output":{},"expPa":[77.92399999999999],"actionPh":COLLECT*0.95},
{"name":"Poison Waste Rift (Buy)","icon":"incandescent energy","lvl":95,"input":{"incandescent energy":2.4545454545454546},"output":{},"expPa":[83.82],"actionPh":COLLECT}, 



{"hide":1,"name":"Oak logs","icon":"oak logs","lvl":13,"input":{"logs":3,"flickering energy":2},"output":{"oak logs":1},"expPa":[3.3],"actionPh":DIV3},
{"hide":1,"name":"Raw trout (Shrimps)","icon":"raw trout","lvl":16,"input":{"raw shrimps":3,"flickering energy":2},"output":{"raw trout":1},"expPa":[3.6],"actionPh":DIV3},
{"hide":1,"name":"Raw trout (Sardines)","icon":"raw trout","lvl":16,"input":{"raw sardine":3,"flickering energy":2},"output":{"raw trout":1},"expPa":[3.6],"actionPh":DIV3},
{"hide":1,"name":"Raw trout (Crayfish)","icon":"raw trout","lvl":16,"input":{"raw crayfish":3,"flickering energy":2},"output":{"raw trout":1},"expPa":[3.6],"actionPh":DIV3},
{"hide":1,"name":"Raw trout (Anchovies)","icon":"raw trout","lvl":16,"input":{"raw anchovies":3,"flickering energy":2},"output":{"raw trout":1},"expPa":[3.6],"actionPh":DIV3},
{"hide":1,"name":"Iron ore","icon":"iron ore","lvl":17,"input":{"copper ore":3,"flickering energy":2},"output":{"iron ore":1},"expPa":[3.7],"actionPh":DIV3},
{"hide":1,"name":"Iron ore","icon":"iron ore","lvl":17,"input":{"copper ore":3,"flickering energy":2},"output":{"iron ore":1},"expPa":[3.7],"actionPh":DIV3},
{"hide":1,"name":"Silver ore","icon":"silver ore","lvl":22,"input":{"iron ore":3,"bright energy":2},"output":{"silver ore":1},"expPa":[5.2],"actionPh":DIV3},
{"hide":1,"name":"Uncut emerald","icon":"uncut emerald","lvl":26,"input":{"uncut sapphire":3,"bright energy":2},"output":{"uncut emerald":1},"expPa":[5.7],"actionPh":DIV3},
{"hide":1,"name":"Coal","icon":"coal","lvl":29,"input":{"iron ore":3,"bright energy":2},"output":{"coal":1},"expPa":[6],"actionPh":DIV3},
{"hide":1,"name":"Willow logs","icon":"willow logs","lvl":32,"input":{"oak logs":3,"glowing energy":2},"output":{"willow logs":1},"expPa":[7.3],"actionPh":DIV3},
{"hide":1,"name":"Uncut ruby","icon":"uncut ruby","lvl":33,"input":{"uncut emerald":3,"glowing energy":2},"output":{"uncut ruby":1},"expPa":[7.4],"actionPh":DIV3},
{"hide":1,"name":"Raw tuna","icon":"raw tuna","lvl":36,"input":{"raw trout":4,"glowing energy":2},"output":{"raw tuna":1},"expPa":[7.7],"actionPh":DIV4},
{"hide":1,"name":"Gold ore","icon":"gold ore","lvl":39,"input":{"silver ore":3,"glowing energy":2},"output":{"gold ore":1},"expPa":[8],"actionPh":DIV3},
{"hide":1,"name":"Uncut diamond","icon":"uncut diamond","lvl":42,"input":{"uncut ruby":3,"sparkling energy":2},"output":{"uncut diamond":1},"expPa":[9.1],"actionPh":DIV3},
{"hide":1,"name":"Raw bass","icon":"raw bass","lvl":46,"input":{"raw tuna":3,"sparkling energy":2},"output":{"raw bass":1},"expPa":[9.6],"actionPh":DIV3},
{"hide":1,"name":"Maple logs","icon":"maple logs","lvl":49,"input":{"willow logs":3,"sparkling energy":2},"output":{"maple logs":1},"expPa":[10],"actionPh":DIV3},
{"hide":1,"name":"Uncut dragonstone","icon":"uncut dragonstone","lvl":58,"input":{"uncut diamond":3,"gleaming energy":2},"output":{"uncut dragonstone":1},"expPa":[12],"actionPh":DIV3},
{"hide":1,"name":"Mithril ore","icon":"mithril ore","lvl":63,"input":{"coal":3,"vibrant energy":2},"output":{"mithril ore":1},"expPa":[13.3],"actionPh":DIV3},
{"hide":1,"name":"Raw monkfish","icon":"raw monkfish","lvl":66,"input":{"raw bass":3,"vibrant energy":2},"output":{"raw monkfish":1},"expPa":[13.7],"actionPh":DIV3},
{"hide":1,"name":"Yew logs","icon":"yew logs","lvl":72,"input":{"maple logs":3,"lustrous energy":2},"output":{"yew logs":1},"expPa":[15.2],"actionPh":DIV3},
{"hide":1,"name":"Adamantite ore","icon":"adamantite ore","lvl":76,"input":{"mithril ore":3,"lustrous energy":2},"output":{"adamantite ore":1},"expPa":[15.7],"actionPh":DIV3},
{"hide":1,"name":"Magic logs","icon":"magic logs","lvl":93,"input":{"yew logs":3,"luminous energy":2},"output":{"magic logs":1},"expPa":[21.7],"actionPh":DIV3},
{"hide":1,"name":"Runite ore","icon":"runite ore","lvl":96,"input":{"adamantite ore":6,"incandescent energy":10},"output":{"runite ore":1},"expPa":[23.2],"actionPh":DIV6},


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




