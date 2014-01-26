//Item

/*
a['testing']    //testing is the item id
    = { 'name':'Gold',                      //name of item
        'visual':'system.gold',             //icon used
        'stack':1,                          //stack?
		'option':[	{'name':'Craft Armor',  //visible ttext for client
		            'func':'Actor.teleport',        //function to call when clicked
		            'param':[1230,1230,'ryve']},    //parameters used with function
		            
					{'name':'Craft Weapon','func':'Craft.plan.use','param':[{'category':'weapon'},{'item':[]}]},
					{'name':'Tele','func':'Actor.teleport','param':[1230,1230,'ryve']},
					{'name':'Open Bank','func':'Main.openWindow','param':['bank']},
			
			]};
*/

//Similar format than Equip
Init.db.item = function (cb){
	Db.item = {}; var a = Db.item;
	

	//{Crafting
	a['shard-white'] = {'name':'White Shard','visual':'system.gold','stack':1}
	a['shard-blue'] = {'name':'Blue Shard','visual':'system.gold','stack':1}
	a['shard-yellow'] = {'name':'Yellow Shard','visual':'system.gold','stack':1}
	a['shard-gold'] = {'name':'Gold Shard','visual':'system.gold','stack':1}
	
	a['gold'] = {'name':'Gold','visual':'system.gold','stack':1,
		'option':[	{'name':'Craft Armor','func':'Craft.plan.use','param':[{'category':'armor'},{'item':[]}]},
						{'name':'Craft Weapon','func':'Craft.plan.use','param':[{'category':'weapon'},{'item':[]}]},
						{'name':'Open Bank','func':'Main.openWindow','param':['bank']},
			
			]};
	a['teleport'] = {'name':'Gold','visual':'system.gold','stack':1,
		'option':[
					{'name':'Tele Main','func':'Actor.teleport','param':[1230,1230,'test']},
					{'name':'Tele Team','func':'Actor.teleport','param':[1230,1230,'test@']},
					{'name':'Tele Alone','func':'Actor.teleport','param':[1230,1230,'test@@']},
			]};
	

	
	a['bugged-drop'] = {'name':'I AM ERROR','visual':'craft.lobster'};
	
	a['lobster'] = {'name':'Lobster','visual':'craft.lobster'};
	a['wood'] = {'name':'wood','visual':'craft.wood'};	
	a['logs'] = {'name':'logs','visual':'craft.logs'};	
	//}
	
	//{Testing
	a['test'] = {'name':'Test','visual':'system.shield','stack':1,
			'option':[	
			    
			]};		
	
	a['ironSword'] = {'name':'Sword','visual':'system.ironSword',
			'option':[	{'name':'Tele Ice','func':'Actor.teleport','param':[500,500,'ice']},
						{'name':'Open Bank','func':'Main.openWindow','param':['bank']},
			]};
	a['shield'] = {'name':'Shield','visual':'system.shield',
			'option':[	{'name':'Teleport','func':'Actor.teleport','param':[500,500,'fire']},
						{'name':'Come Back','func':'Actor.teleport','param':[1500,500,'test']}
			]};
	
	
	
	
	
	
	a['planA'] = {'name':'Plan','visual':'plan.planA',
			'option':[	{'name':'Craft Item','func':'Craft.plan.use','param':[{},{'item':[]}]}
					]};
	//}
	
	
	//{Orb
	a['boost_orb'] = {'name':'Orb of Power','visual':'orb.boost','stack':1,
			'option':[	
				{'name':'Use','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',1]}]},
				{'name':'Use x10','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',10]}]},
				{'name':'Use x100','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',100]}]},
				{'name':'Use x1000','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',1000]}]},
			]};	
	a['upgrade_orb'] = {'name':'Orb of Upgrade','visual':'orb.upgrade','stack':1,
			'option':[	
				{'name':'Use','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',1]}]},
				{'name':'Use x10','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',10]}]},
				{'name':'Use x100','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',100]}]},
				{'name':'Use x1000','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',1000]}]},
			]};	
	a['removal_orb'] = {'name':'Orb of Removal','visual':'orb.removal','stack':1,
			'option':[	
				{'name':'Use','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['removal',1]}]},
				{'name':'Use x10','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['removal',10]}]},
				{'name':'Use x100','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['removal',100]}]},
				{'name':'Use x1000','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['removal',1000]}]},
			]};	
	//}
	
	for(var i in Db.item){	
		Db.item[i].id = i;
		Item.creation(Db.item[i]);
	}
	
	cb.call();
	
}



Item = {};

Item.creation = function(item){	
	item = useTemplate(Item.template(),item);
	if(item.drop){	item.option.push({'name':'Drop','func':'Actor.dropInv','param':[item.id]})}
	Db.item[item.id] = item;
}

Item.template = function(){
	var item = {
		'name':'buggedItem',
		'visual':'system.gold',
		'trade':1, 
		'sell':0,  
		'drop':1,
		'remove':0,
		'bank':1,
		'stack':0,
		'value':1,
		'option': [],
		'type':'item',
	}
	return item;
}

Item.remove = function(id){
	db.equip.remove({id:id});
	db.equip.remove({id:id});
	db.ability.remove({id:id});
}


