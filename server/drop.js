//Drop


Init.db.drop = function(){
	Db.drop = {
		'regular':
			[	{'item':'gold','min':1,'max':10,'chance':1/4},
				{'item':'lobster','min':1,'max':1,'chance':1/4},
				{'item':'wood','min':1,'max':1,'chance':1/4},
				{'item':'logs','min':2,'max':5,'chance':1/4}
			],
		'plan':
			[	1
			
			
			],
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





































