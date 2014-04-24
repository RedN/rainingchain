var TIMER = {'fast':1,'reg':5,'slow':25};


//not compress in old. use a custom isequal

//Complex system to track the data that has changed and that need to be send to the client.

Change.update = function(){
	//Entity
	for(var i in List.all){
		var act = List.all[i];
		if(act.dead || act.active === false) continue;
		for(var m in Change.update.list[act.type]){         //m = watch or exist
			for (var k in Change.update.list[act.type][m]){     //k = priority , reg , slow
				if(Loop.frame % TIMER[k] !== 0) continue;
				for(var j in Change.update.list[act.type][m][k])
					Change.update[m](act,Change.update.list[act.type][m][k][j]);	
    }}}
	//MainList
	for(var i in List.main){
		var act = List.main[i];
		for(var m in Change.update.list.main){
    		for (var k in Change.update.list.main[m]){
    	        if(Loop.frame % TIMER[k] !== 0) continue;
				for(var j in Change.update.list.main[m][k])
					Change.update[m](act,Change.update.list.main[m][k][j]);	
    }}}
	//Private
	for(var i in List.main){
		var act = List.all[i];
    	for(var m in Change.update.list.priv){		
    	    for (var k in Change.update.list.priv[m]){
    	        if(Loop.frame % TIMER[k] !== 0) continue;
				for(var j in Change.update.list.priv[m][k])
					Change.update[m](act,Change.update.list.priv[m][k][j],true);	
    }}}
	
	
}

Init.changeUpdate = function(){
	//NOTE: for .e being in 2 category, must put r:noreset. otherwise, second wont get
	//MEANS PRIVATE MUST BE LAST
	
	Change.update.list = {};
	//Fulllist
	Change.update.list['npc'] = {
		'watch':{
			'fast':[
				{'array':['x'],'filter':Math.round},
				{'array':['y'],'filter':Math.round},
				{'array':['angle'],'filter':Math.round},
			],
			'reg':[
				{'array':['hp'],'filter':Math.round,'condition':(function(e){ return !e.nevercombat; })},
				{'array':['resource','hp','max'],'filter':Math.round,'condition':(function(e){ return !e.nevercombat; })},
				{'array':['spdX'],'filter':Math.round,'condition':(function(e){ return !e.nevermove; })},
				{'array':['spdY'],'filter':Math.round,'condition':(function(e){ return !e.nevermove; })},
				{'array':['statusClient'],'condition':(function(e){ return e.combat; })},
				{'array':['curseClient'],'condition':(function(e){ return e.combat; })},
			],
			'slow':[
				{'array':['combat']},
				{'array':['sprite','name']},
				{'array':['sprite','sizeMod']},
			]},	
		'exist':{'reg':[
				{'array':['sprite','anim']},
				{'array':['chatHead']},
			]}
	};
		
	Change.update.list['bullet'] = {
		'watch':{
			'fast':[
				{'array':['x'],'filter':Math.round,'condition':(function(e){ return !e.normal; })},
				{'array':['y'],'filter':Math.round,'condition':(function(e){ return !e.normal; })},
				{'array':['angle'],'filter':Math.round,'condition':(function(e){ return !e.normal; })},
			],
		}
	};
	Change.update.list['player'] = {
		'watch':{
			'fast':[
				{'array':['x'],'filter':Math.round},
				{'array':['y'],'filter':Math.round},
				{'array':['angle'],'filter':Math.round},
			],
			'reg':[
				{'array':['spdX'],'filter':Math.round},
				{'array':['spdY'],'filter':Math.round},
				{'array':['hp'],'filter':Math.round},
				{'array':['statusClient']},
				{'array':['curseClient']},
			],
			'slow':[
				{'array':['resource','hp','max'],'filter':Math.round},
				{'array':['sprite','name']},
				{'array':['sprite','sizeMod']},
				{'array':['combat']},
			]
			
			},	
		'exist':{
			'reg':[
				{'array':['sprite','anim'],'reset':'noreset'},
				{'array':['chatHead'],'reset':'noreset'},
			]}
	};
	
	//Main
	Change.update.list['main'] = {
		'watch':{
			'fast':[],
			'reg':[
				{'array':['currentTab']},
				{'array':['context']},
				{'array':['dialogue']},	
				
				{'array':['popupList']},
				
				{'array':['windowList'],'filter':Change.send.convert.windowList},
				
				{'array':['invList'],'filter':Change.send.convert.itemlist},
				{'array':['bankList'],'filter':Change.send.convert.itemlist},
				{'array':['tradeList'],'filter':Change.send.convert.itemlist},
				{'array':['optionList'],'filter':Change.send.convert.optionList},
				
				{'array':['temp']},
			],
			'slow':[
				{'array':['social','list']},	
				
				{'array':['quest']},
				
				{'array':['passive']},	
				{'array':['hideHUD']},
				
				{'array':['pvpScore']},	
				{'array':['chrono']},	
			]
			},	
		'exist':{
			'reg':[
				{'array':['social','message'],'reset':''},
				{'array':['chatInput'],'reset':''},
				{'array':['screenEffect']},
			],
			'slow':[
				{'array':['sfx'],'reset':''},
				{'array':['song'],'reset':''},
				{'array':['help'],'reset':''},
			],
			
			
			}
	};
	
	//Private
	Change.update.list['priv'] = {
		'watch':{
			'fast':[
				{'array':['x'],'filter':Math.round},
				{'array':['y'],'filter':Math.round},
				{'array':['angle'],'filter':Math.round},
				
			],
			'reg':[
				{'array':['spdX'],'filter':Math.round},
				{'array':['spdY'],'filter':Math.round},
				{'array':['map'],'filter':Change.send.convert.map},
				{'array':['hp'],'filter':Math.round},
				{'array':['mana'],'filter':Math.round},
				{'array':['sprite','name']},
				{'array':['sprite','sizeMod']},
				{'array':['abilityChange','chargeClient'],'filter':Change.send.convert.abilityChangeClient},
				
				
				{'array':['statusClient']},
				{'array':['curseClient']},
				
				{'array':['equip'],'filter':Change.send.convert.equip},	
				{'array':['weapon']},
			
				
				
			],
			'slow':[
				{'array':['resource'],'filter':Change.send.convert.resource},
				
				{'array':['permBoost']},
				// {'array':['equip','def']},
				// {'array':['equip','dmg']},
				{'array':['def']},
						
				
				{'array':['ability'],'filter':Change.send.convert.ability},
				{'array':['abilityList'],'filter':Change.send.convert.abilityList},
				
				{'array':['skill','exp']},
				{'array':['skill','lvl']},
			]
			},	
		'exist':{
			'reg':[
				{'array':['sprite','anim']},
				{'array':['chatHead']},
			]}
	};
	Change.update.list['strike'] = null;
	Change.update.list['drop'] = null;
	
	for(var i in Change.update.list){
		if(!Change.update.list[i]){ Change.update.list[i] = {'watch':{'fast':[],'reg':[],'slow':[]},'exist':{'fast':[],'reg':[],'slow':[]}}; }
		
		for(var j in Change.update.list[i]){
		    var w = Change.update.list[i][j];
			w.fast = w.fast || []; 
			w.reg = w.reg || []; 
			w.slow = w.slow || []; 
			
			for(var k in w){
				for(var m in w[k]){
				    w[k][m].id = w[k][m].sendArray ? w[k][m].sendArray.toString() : w[k][m].array.toString();
				}
			}
		}
	}
	
}



Change.update.watch = function(act,info,priv){
	//Test condition to test
	if(info.condition && !info.condition(act)) return; 

	//Get Old and New Value and Set Old = to New
	var valRaw = Tk.viaArray.get({'origin':act,'array':info.array});
	if(valRaw && info.filter) valRaw = info.filter(valRaw,act);
	        
	var val0 = Tk.stringify(valRaw);                              		//Get new
	var val1 = priv ? act.privateOld[info.id] : act.old[info.id]; 		//Get old
	
	//Test !=
	if(Tk.isEqual(val0, val1)) return;
	
	if(!priv){ act.old[info.id] = val0; }                  //Set Old
	else { act.privateOld[info.id] = val0; }

	if(info.sendArray){                                                 //Modify array of what to send
		var valRaw = Tk.viaArray.get({'origin':act,'array':info.sendArray});
		if(info.sendFilter) valRaw = info.sendFilter(valRaw);
		var val0 = Tk.stringify(valRaw);
	}
	
	if(!priv){ act.change[info.id] = valRaw; }          //Add to change list for send.js know
	else {	act.privateChange[info.id] = valRaw; }

}	

Change.update.exist = function(act,info,priv){
	//Test condition to test
	if(info.condition && !info.condition(act)) return; 

	var valRaw = Tk.viaArray.get({'origin':act,'array':info.array});
	if(!valRaw) return;
	if(Array.isArray(valRaw) && valRaw.length === 0) return;
	
	var val0 = Tk.stringify(valRaw); 
	
	if(!priv){ act.change[info.id] = valRaw; }
	else {	act.privateChange[info.id] = valRaw; }
		
	if(!info.reset){ Tk.viaArray.set({'origin':act,'array':info.array,'value':null}); }
	else if(info.reset !== 'noreset'){ Tk.viaArray.set({'origin':act,'array':info.array,'value':Tk.deepClone(info.reset)}); }
		
}
