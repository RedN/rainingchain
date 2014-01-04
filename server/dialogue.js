Dialogue = {};

//start dialogue. also set start x and y to end dialogue if player walks away
Dialogue.start = function(key,d){
	var dia = Db.dialogue[d.name][d.convo][d.node];
	List.main[key].dialogue = dia;
	List.main[key].dialogueLoc = {'x':List.all[key].x,'y':List.all[key].y};
	
	if(List.main[key].dialogue.func){
		applyFunc.key(key,List.main[key].dialogue.func,List.main[key].dialogue.param);
	}
	
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






