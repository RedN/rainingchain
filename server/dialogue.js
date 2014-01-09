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






