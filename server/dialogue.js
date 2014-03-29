Dialogue = {};

Dialogue.start = function(key,d){
	//start dialogue. also set start x and y to end dialogue if player walks away

	var dia = Db.dialogue[d.group][d.npc][d.convo][d.node];
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

Init.db.dialogue = function(){
	
	
	//Face Db
	Db.dialogue.face = {
		'Jenny':{'x':0,'y':0,'name':'Jenny'},
	}
	
	for(var i in Db.dialogue){
		var group = Db.dialogue[i];
		
		for(var ii in group){
			var npc = group[ii];
			
			for(var j in npc){			
				if(j === 'face') continue;
				var convo = npc[j];
				
				for(var k in convo){				
					var node = convo[k];		
					
					if(node.face) node.face = Db.dialogue.face[node.face];
					if(node.face === undefined && (convo.face || npc.face)) 
						node.face = Db.dialogue.face[convo.face || npc.face];
					if(node.face === 'none') delete node.face;
					
					for(var m in node.option){
						var next = node.option[m].next;
						if(!next) continue;
						next.group = next.group || i ;
						next.npc = next.npc || ii ;
						next.convo = next.convo || j ;
					}				
				}
			}
		}
	}
}




/*
NOT USED

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

Actor.creation.dialogue = function(act){
	if(act.dialogue){
		act.dialogue = useTemplate(Actor.template.dialogue,act.dialogue);
	}
	Actor.creation.dialogue.generic(act);
	return act;	
}

Actor.creation.dialogue.generic = function(act){
	var overwrite = act.dialogue.option;
	act.dialogue.option = {};
	Actor.creation.dialogue.generic.recursive(act.dialogue.tag,act.dialogue.option,Dialogue.generic);
	for(var i in overwrite){
		act.dialogue.option[i] = overwrite[i];
	}
	return act;
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


