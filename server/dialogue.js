Dialogue = {};

//start dialogue. also set start x and y to end dialogue if player walks away
Dialogue.start = function(key,d){
	var dia = Db.dialogue[d.name][d.convo][d.node];
	List.main[key].dialogue = dia;
	List.main[key].dialogueLoc = {'x':List.all[key].x,'y':List.all[key].y};
	
	if(List.main[key].dialogue.func){
		keyFunction(key,List.main[key].dialogue.func,List.main[key].dialogue.param);
	}
	
}

Dialogue.end = function(key){
	List.main[key].dialogue = '';
}

Dialogue.option = function(key,option){
	if(option.func)	keyFunction(key,option.func,option.param);
	
	if(option.next){
		Dialogue.start(key,option.next);
	} else {
		List.main[key].dialogue = '';
	}
}



Init.db.dialogue = function(){
	Db.dialogue = {}
	Db.dialogue['Jenny'] = {};
	Db.dialogue['Jenny']['quest'] = {
		'intro':{
			'text':'Do you want to help me out?',
			'face':'Jenny',
			'option':[
				{'text':"Sure.",
					'next':{'node':'yes'},
					'func':(function(key){  Db.quest['questId'].giveDevice(key); }),'param':[]
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
			'func':(function(key){  Db.quest['questId'].giveReward(key); }),'param':[],
			},
		'gratz2':{
			'text':'Thanks again.',
			},
	}
	
	
	//Face Db
	Db.dialogue.face = {
	'Jenny':{'x':0,'y':0,'name':'Jenny'}
	}
	
	for(var i in Db.dialogue){	
		var npc = Db.dialogue[i];
		if(npc.face === undefined){ npc.face = Db.dialogue.face[i] }		
		
		for(var j in Db.dialogue[i]){	
			var convo = Db.dialogue[i][j];
			for(var k in convo){	
				var node = convo[k];
				
				if(node.face === undefined){ node.face = npc.face;}
				else if(node.face){	node.face = Db.dialogue.face[node.face];}
				
				for(var m in node.option){
					var next = node.option[m].next;
					next.name = next.name || i ;
                    next.convo = next.convo || j ;
				}				
			}
		}
	}
}






