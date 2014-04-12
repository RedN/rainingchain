Init.db.drop = function(){
	Db.drop = {
		'regular':[
			{lvl:0,chance:0.5,table:[
				{name:'wood',amount:[1],chance:1/4},
				{name:'logs',amount:[1,5],chance:1/4},
			]},
			{lvl:10,chance:0.5,table:[
				{name:'gold',amount:[1,10],chance:1/4},
			]},
		],
		
		'fish':[
			{lvl:0,chance:0.5,table:[
				{name:'gold',amount:[1,10],chance:1/4},
			]},
			{lvl:10,chance:0.5,table:[
				{name:'gold',amount:[1,10],chance:1/4},
			]},
		],
	}



	for(var i in Db.drop){
		for(var j in Db.drop[i]){
			for(var k in Db.drop[i][j].table){
				var d = Db.drop[i][j].table[k];				
				if(!d.amount) d.amount = [1,1];
				if(d.amount.length === 1) d.amount[1] = d.amount[0];
			}
		}
	}
	
}


Drop = {};	
Drop.timer = 25*30;	

Drop.getCategoryList = function(drop,lvl,qu){
	var list = [];
	qu = qu || 1;
	
	for(var i in drop){
		var highest = {lvl:0};
		for(var j in Db.drop[i]){
			var table = Db.drop[i][j];
			if(lvl >= table.lvl && table.lvl >= highest.lvl){
				highest = table;
			}
		}
		for(var j in highest.table){
			var tmp = deepClone(highest.table[j]);
			tmp.chance *= drop[i];
			tmp.chance = Math.pow(tmp.chance,1/qu);
			list.push(tmp);		
		}
	}
	return list;
}

Drop.creation = function(d){
	Map.convertSpot(d);
	
	var drop = useTemplate(Drop.template(),d);
	
	drop.x += Math.randomML(drop.vx);
	drop.y += Math.randomML(drop.vx);
	
	List.drop[drop.id] = drop;
	Map.enter(drop);
}


Drop.template = function(){
	return {
		vx:25,
		id:Math.randomId(),
		publicId:Math.randomId(6),
		type:'drop',
		change:{},
		old:{},
		viewedBy:{},
		viewedIf:'true',
		x:0,
		y:0,
		item:'bugged-drop',
		amount:1,
	};
}

Drop.remove = function(drop){
	Activelist.remove(drop);
	delete List.all[drop.id];
	delete List.drop[drop.id];
	Map.leave(drop);
}





































