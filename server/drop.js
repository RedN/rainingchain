//Drop



/*

*/

Init.db.drop = function(){
	Db.drop = {
		'regular':[
			{lvl:0,chance:0.5,table:[
				{name:'wood',amount:[1],chance:1/4},
				{name:'logs',amount:[1,5],chance:1/4},
			]},
			{'lvl':10,chance:0.5,'table':[
				{name:'gold',amount:[1,10],chance:1/4},
			]},
		],
		
		'fish':[
			{'lvl':0,chance:0.5,'table':[
				{name:'gold',amount:[1,10],chance:1/4},
			]},
			{'lvl':10,chance:0.5,'table':[
				{name:'gold',amount:[1,10],chance:1/4},
			]},
		],
	}



	for(var i in Db.drop){
		for(var j in Db.drop[i]){
			var d = Db.drop[i][j];
			if(!d.amount) d.amount = [1,1];
			if(d.amount.length === 1) d.amount[1] = d.amount[0];
		}
	}
	
}


Drop = {};	
Drop.timer = 25*30;	

Drop.getCategoryList = function(drop,lvl,qu){
	var list = [];
	qu = qu || 1;
	
	for(var i in drop.category){
		for(var j in Drop.db[i]){
			var table = Drop.db[i][j];
			var highest = {lvl:0};
			if(lvl >= table.lvl && lvl >= highest.lvl){
				highest = table;
			}
		}
		for(var j in highest){
			var tmp = deepClone(highest[j]);
			tmp.chance *= drop.category[i].chance;
			tmp.chance = Math.pow(tmp.chance,1/qu)
			list.push(tmp);		
		}
	}
	return tmp;
}

Drop.creation = function(drop){
	drop.vx = typeof drop.vx !== 'undefined' ? drop.vx : 25;
	drop.x += Math.randomML(drop.vx);
	drop.y += Math.randomML(drop.vx);
	drop.id = Math.randomId();
	drop.publicId = Math.random().toString(36).substring(13);
	drop.picked = 0;
	drop.type = 'drop';
	drop.change = {};
	drop.old = {};
	drop.viewedBy = {};
	drop.viewedIf = 'true';
	List.drop[drop.id] = drop;
	List.all[drop.id] = drop;
}


Drop.remove = function(drop){
	ActiveList.remove(drop);
	delete List.all[drop.id];
	delete List.drop[drop.id];

}





































