//Item

/*
a['testing']    //testing is the item id
    = { 'name':'Gold',                      //name of item
        'icon':'system.gold',             //icon used
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
	a['material-currency'] = {'name':'Craft Fragments','icon':'plan.equip','stack':1,'tradeable':0,
			'option':[	{'param':['material'],'name':'Material Window','func':'Main.openWindow'},
					]};
					
					
	a['shard-white'] = {'name':'White Shard','icon':'system.gold','stack':1}
	a['shard-blue'] = {'name':'Blue Shard','icon':'system.gold','stack':1}
	a['shard-yellow'] = {'name':'Yellow Shard','icon':'system.gold','stack':1}
	a['shard-gold'] = {'name':'Gold Shard','icon':'system.gold','stack':1}
	
	a['gold'] = {'name':'Gold','icon':'system.gold','stack':1,
		'option':[	{'name':'Craft Armor','func':'Craft.plan.use','param':['randomArmor']},
						{'name':'Craft Weapon','func':'Craft.plan.use','param':['randomWeapon']},
						{'name':'Open Bank','func':'Main.openWindow','param':['bank']},
			]};	
			
	a['teleport'] = {'name':'Gold','icon':'system.gold','stack':1,
		'option':[
					{'name':'Tele Main','func':'Actor.teleport','param':[1230,1230,'test']},
					{'name':'Tele Team','func':'Actor.teleport','param':[1230,1230,'test@']},
					{'name':'Tele Alone','func':'Actor.teleport','param':[1230,1230,'test@@']},
			]};
	

	
	a['bugged-drop'] = {'name':'I AM ERROR','icon':'system.square'};
	
	a['lobster'] = {'name':'Lobster','icon':'system.square'};
	a['wood'] = {'name':'wood','icon':'system.square'};	
	a['logs'] = {'name':'logs','icon':'system.square'};	
	//}
	
	//{Testing
	a['test'] = {'name':'Test','icon':'system.square','stack':1,
			'option':[	
			    
			]};		
	
	a['ironSword'] = {'name':'Sword','icon':'system.square',
			'option':[	{'name':'Tele Ice','func':'Actor.teleport','param':[500,500,'ice']},
						{'name':'Open Bank','func':'Main.openWindow','param':['bank']},
			]};
	a['shield'] = {'name':'Shield','icon':'system.square',
			'option':[	{'name':'Teleport','func':'Actor.teleport','param':[500,500,'fire']},
						{'name':'Come Back','func':'Actor.teleport','param':[1500,500,'test']}
			]};
	
	
	
	
	
	//}
	
	
	//{Orb
	a['boost_orb'] = {'name':'Orb of Power','icon':'orb.boost','stack':1,
			'option':[	
				{'name':'Use','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',1]}]},
				{'name':'Use x10','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',10]}]},
				{'name':'Use x100','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',100]}]},
				{'name':'Use x1000','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['boost',1000]}]},
			]};	
	a['upgrade_orb'] = {'name':'Orb of Upgrade','icon':'orb.upgrade','stack':1,
			'option':[	
				{'name':'Use','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',1]}]},
				{'name':'Use x10','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',10]}]},
				{'name':'Use x100','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',100]}]},
				{'name':'Use x1000','func':'Main.selectInv','param':[{'name':'Use Orb','func':'Craft.orb','param':['upgrade',1000]}]},
			]};	
	a['removal_orb'] = {'name':'Orb of Removal','icon':'orb.removal','stack':1,
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
		'icon':'system.square',
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


