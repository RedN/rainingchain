Dialogue = {};

//start dialogue. also set start x and y to end dialogue if player walks away
Dialogue.start = function(key,d){
	var dia = Dialogue.db[d.name][d.convo][d.node];
	mainList[key].dialogue = dia;
	mainList[key].dialogueLoc = {'x':fullList[key].x,'y':fullList[key].y};
	
	if(mainList[key].dialogue.func){
		keyFunction(key,mainList[key].dialogue.func,mainList[key].dialogue.param);
	}
	
}

Dialogue.end = function(key){
	mainList[key].dialogue = '';
}

Dialogue.option = function(key,option){
	if(option.func)	keyFunction(key,option.func,option.param);
	
	if(option.next){
		Dialogue.start(key,option.next);
	} else {
		mainList[key].dialogue = '';
	}
}



Dialogue.init = function(){
	Dialogue.db = {}
	Dialogue.db['Jenny'] = {};
	Dialogue.db['Jenny']['quest'] = {
		'intro':{
			'text':'Do you want to help me out?',
			'face':'Jenny',
			'option':[
				{'text':"Sure.",
					'next':{'node':'yes'},
					'func':(function(key){  qDb['questId'].giveDevice(key); }),'param':[]
				},
				{'text':"No. I got other things to do.",
					'next':{'node':'no'}},
				
			]},
		'yes':{
			'text':"Thank you so much! Take this magical shield and teleport to the Fire Monster Lair. Kill him and give me the key he will drop.",
			},
		'no':{
			'text':"What a jerk!",
			},
			
		'intro2':{
			'text':"What are you waiting for? Go kill the boss!",
			},	
				
		'gratz':{
			'text':'Thanks you so much for your help. I can now unlock the barrier.',
			'func':(function(key){  qDb['questId'].giveReward(key); }),'param':[],
			},
		'gratz2':{
			'text':'Thanks again.',
			},
	}
	
	
	//Face Db
	Dialogue.db.face = {
	'Jenny':{'x':0,'y':0,'name':'Jenny'}
	}
	
	for(var i in Dialogue.db){	
		var npc = Dialogue.db[i];
		if(npc.face === undefined){ npc.face = Dialogue.db.face[i] }		
		
		for(var j in Dialogue.db[i]){	
			var convo = Dialogue.db[i][j];
			for(var k in convo){	
				var node = convo[k];
				
				if(node.face === undefined){ node.face = npc.face;}
				else if(node.face){	node.face = Dialogue.db.face[node.face];}
				
				for(var m in node.option){
					var next = node.option[m].next;
					next.name = next.name || i ;
                    next.convo = next.convo || j ;
				}				
			}
		}
	}
}






