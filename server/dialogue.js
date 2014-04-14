Dialogue = {};

Dialogue.start = function(key,d){
	//start dialogue. also set start x and y to end dialogue if player walks away
	try {
	
	var dia = Db.dialogue[d.group][d.npc][d.convo][d.node];
	var main = List.main[key];
	main.dialogue = dia;
	main.dialogueLoc = {'x':List.all[key].x,'y':List.all[key].y};
	
	if(dia.func) applyFunc.key(key,dia.func);	
	
	}catch(err){ logError(err);}
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
	for(var i in Db.dialogue){
		var group = Db.dialogue[i];
		
		for(var ii in group){
			var npc = group[ii];
			
			for(var j in npc){			
				if(j === 'face') continue;
				var convo = npc[j];
				
				for(var k in convo){				
					var node = convo[k];		
					
					node.face = node.face || convo.face || npc.face;
					if(node.face === 'none') delete node.face;
					
					for(var m in node.option){
						var next = node.option[m].next;
						if(!next) continue;
						next.group = next.group || i ;
						next.npc = next.npc || ii ;
						next.convo = next.convo || j ;
					}				
				}
				delete convo.face;
			}
			delete npc.face;
		}
	}
}





