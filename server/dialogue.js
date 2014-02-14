Dialogue = {};

Dialogue.start = function(key,d){
	//start dialogue. also set start x and y to end dialogue if player walks away

	var dia = Db.dialogue[d.name][d.convo][d.node];
	var main = List.main[key];
	main.dialogue = dia;
	main.dialogueLoc = {'x':List.all[key].x,'y':List.all[key].y};
	
	if(dia.func) applyFunc.key(key,dia.func,dia.param);	
}

Dialogue.end = function(key){
	List.main[key].dialogue = '';
}

Dialogue.option = function(key,option){
	if(option.func)	applyFunc.key(key,option.func,option.param);
	
	if(option.next){
		Dialogue.start(key,option.next);
	} else {
		List.main[key].dialogue = '';
	}
}

/*
'ryve':{
	'option':{
		'greet':{'text':'Hey!','name':'ryve','convo':'greetings':'first'},
		'fun':{'text':'yo','name':'ryve','convo':'place of interest':'first'},	
	},
	'elf':{
		'option':{
			'fun':{'text':'yo','name':'ryve','convo':'place of interest':'child'},
		},
	},
}
*/

Init.db.dialogue = function(){
	/*
	Db.dialogue.questId = {
		'Jenny' :{
			'face':'Jenny',
			'intro':{
				'text':'Do you want to help me out?',
				'face':'Jenny',
				'option':[
					{'text':"Sure.",
						'next':{'node':'yes'},
						'func':function(key){ Db.quest['questId'].giveDevice(key); },
						'param':[],
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
				'func':function(key){ Db.quest['questId'].giveReward(key); },
				'param':[],
				},
			'gratz2':{
				'text':'Thanks again.',
				},
		}
	}
	*/
	
	//Face Db
	Db.dialogue.face = {
		'Jenny':{'x':0,'y':0,'name':'Jenny'}
	}
	
	for(var i in Db.dialogue){
		var name = Db.dialogue[i];					
		for(var j in name){			
			if(j === 'face') continue;
			var convo = name[j];
			
			for(var k in convo){				
				var node = convo[k];		
				
				if(node.face) node.face = Db.dialogue.face[node.face];
				if(node.face === undefined && (convo.face || name.face)) 
					node.face = Db.dialogue.face[convo.face || name.face];
				if(node.face === 'none') delete node.face;
				
				for(var m in node.option){
					var next = node.option[m].next;
					next.name = next.name || i ;
                    next.convo = next.convo || j ;
				}				
			}
		}
	}
}




/*
Actor.creation.dialogue = function(mort){
	if(mort.dialogue){
		mort.dialogue = useTemplate(Actor.template.dialogue,mort.dialogue);
	}
	Actor.creation.dialogue.generic(mort);
	return mort;	
}

Actor.creation.dialogue.generic = function(mort){
	var overwrite = mort.dialogue.option;
	mort.dialogue.option = {};
	Actor.creation.dialogue.generic.recursive(mort.dialogue.tag,mort.dialogue.option,Dialogue.generic);
	for(var i in overwrite){
		mort.dialogue.option[i] = overwrite[i];
	}
	return mort;
}

Actor.creation.dialogue.generic.recursive = function(tag,option,dialogue){
	for(var j in dialogue.option){
		option[j] = dialogue.option[j];
	}
	for(var j in dialogue){
		if(j !== 'option' && tag.have(j)){
			Actor.creation.dialogue.generic.recursive(tag,option,dialogue[j]);
		}
	}
}
*/


