//Drop



/*
Db.drop = {

	'regular':{
		{lvl:0,chance:1,table:[
			{name:'wood',amount:[1],chance:1/4},
			{name:'logs',amount:[1,5],chance:1/4},
		]},
		{'lvl':10,'table':[
			{name:'oak-wood',amount:[1],chance:1/4},
			{name:'oak-logs',amount:[1,10],chance:1/4},
		]},
	},
	
	'fish':{
		{'lvl':0,'table':[
			{name:'shrimp',amount:[1],chance:1/4},
		]},
		{'lvl':10,'table':[
			{name:'lobster',amount:[1],chance:1/4},
		]},
	},
}
*/

Init.db.drop = function(){
	Db.drop = {
		'regular':
			[	{name:'gold',amount:[1,10],chance:1/4},
				{name:'lobster',amount:[1],chance:1/4},
				{name:'wood',amount:[1],chance:1/4},
				{name:'logs',amount:[1],chance:1/4},
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

Drop.creation = function(drop){
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





































