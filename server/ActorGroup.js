//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Tk','Map'],['ActorGroup']));

var ActorGroup = exports.ActorGroup = function(spot,list,respawn,v){
	var enemyIdList = [];
		
	var id = Math.randomId();
	LIST[id] = {
		id:id,
		map:spot.map,
		list:{},             		//hold enemies
		respawn:respawn || false,  		//time before respawn when all monster dead, false = remove group when dead
		param:Tk.deepClone([spot,list,respawn,v]),		//used to revive node appgroup
	};
	
	Map.addToEntityList(Map.get(spot.map),'group',id);
	
	for(var i in list){
		//list[i].extra.group = id;
		for(var j = 0 ; j < list[i].amount; j++){
			var pos = ActorGroup.alterSpot(Tk.deepClone(spot),v);
			var e = Actor(list[i].model,list[i].extra);
			e.group = id;
			Actor.addToMap(e,pos);
			LIST[id].list[e.id] = 1;
			enemyIdList.push(e.id);
		}
	}
	return enemyIdList;
	
}

var LIST = ActorGroup.LIST = {};

ActorGroup.get = function(id){
	return LIST[id] || null;
}
ActorGroup.addToList = function(bullet){
	LIST[bullet.id] = bullet;
}
ActorGroup.removeFromList = function(id){
	delete LIST[id]; 
}

ActorGroup.removeActorFromGroup = function(act){
	var group = LIST[act.group];
	if(!group) return ERROR(3,'Actor.remove no group','name',act.name);
	delete group.list[act.id];
}

ActorGroup.alterSpot = function(spot,v){
	if(!v) return spot;
	
	for(var i = 0; i < 100; i++){
		var x = spot.x + Math.randomML() * v;
		var y = spot.y + Math.randomML() * v;
		if(!Actor.isStuck(
			{map:spot.map,x:spot.x,y:spot.y,type:'npc'},
			{map:spot.map,x:x,y:y,type:'npc'})
		){
			return {x:x,y:y,map:spot.map};
		}
	}
	return spot;	//if all 100 tries fail
	
}

ActorGroup.List = function(model,amount,extra){
	return {
		model:model,
		amount:amount || 1,
		extra:extra||{},
	}
}

ActorGroup.loop = function(){	//static
	for(var i in LIST)
		ActorGroup.loop.forEach(LIST[i]);
}

ActorGroup.loop.forEach = function(g){
	for(var i in g.list){
		var e = Actor.get(i);
		if(!e) delete g.list[i];
	}
	if(!g.list.$isEmpty()) return;
	
	//if no return => all dead
	if(g.respawn === false) return ActorGroup.remove(g);

	if(--g.respawn <= 0){
		ActorGroup(g.param[0],g.param[1],g.param[2],g.param[3]); 	
		ActorGroup.remove(g);
	}

}

ActorGroup.remove = function(g){
	if(typeof g === 'string') g = LIST[g];
	if(!g) return ERROR(3,'no group');
	for(var i in g.list){
		var e = Actor.get(i);
		if(!e){ ERROR(2,'no actor');  continue; }
		Actor.remove(e);
	}
	ActorGroup.removeFromList(g.id);
	Map.removeFromEntityList(Map.get(g.map),'group',g.id);
}








