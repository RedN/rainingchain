




Map.getEnemy = function(map,tag){
	var list = List.map[map].list.npc;
	for(var i in list){
		if(List.all[i].tag === tag)
			return List.all[i];
	}
	return null;
}

