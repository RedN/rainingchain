//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Tk','Init','Db','Map'],['Drop']));

Init.db.drop = function(){
	Db.drop = {
		'woodcutting':[
			{lvl:0,chance:1/10,table:[	//chance is real chance, chance in quest is mod that should be 1 normally
				{name:'wood-0',amount:[1],chance:1},	//chance here is relative and is ratioed
			]},
			{lvl:20,chance:1/10,table:[
				{name:'wood-0',amount:[1],chance:1},
				{name:'wood-20',amount:[1],chance:4},
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
			var sum = 0;
			for(var k in Db.drop[i][j].table){
				var d = Db.drop[i][j].table[k];				
				if(!d.amount) d.amount = [1,1];
				if(d.amount.length === 1) d.amount[1] = d.amount[0];
				sum += d.chance;
			}
			for(var k in Db.drop[i][j].table){
				Db.drop[i][j].table[k].chance /= sum;
			}
		}
	}
	
}

var TIMER = 25*60;

var Drop = exports.Drop = {};	

Drop.getCategoryList = function(drop,lvl,qu){
	var list = [];
	qu = qu || 1;	//quantity
	
	for(var i in drop){
		var highest = {lvl:0};
		for(var j in Db.drop[i]){
			var table = Db.drop[i][j];
			if(lvl >= table.lvl && table.lvl >= highest.lvl){
				highest = table;
			}
		}
		for(var j in highest.table){
			var tmp = Tk.deepClone(highest.table[j]);
			tmp.chance *= drop[i];
			tmp.chance = Math.pow(tmp.chance,1/qu);
			list.push(tmp);		
		}
	}
	return list;
}

Drop.creation = function(d){
	if(!Db.item[d.item]){ ERROR(3,'drop with non-existing item',d.item); d.item = 'bugged-drop'; }
	
	Map.convertSpot(d);
	
	var drop = Tk.useTemplate(Drop.template(),d,true);
	
	drop.x += Math.randomML(drop.vx);
	drop.y += Math.randomML(drop.vx);
	
	List.drop[drop.id] = drop;
	List.all[drop.id] = drop;
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
		activeList:{},
		viewedIf:'true',
		x:0,
		y:0,
		item:'bugged-drop',
		amount:1,
		timer:TIMER,
	};
}

Drop.remove = function(drop){
	Map.leave(drop);
	delete List.all[drop.id];
	delete List.drop[drop.id];
}





































