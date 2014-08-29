//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Actor','Db','Tk','Init','Quest','Itemlist','Chat','Craft','Test','Main','requireDb'],['Item']));	//actor once random

var db = requireDb();
//Item


//Similar format than Equip
Db.item = {};
Init.db.item = function (){
	var a = Db.item;

	//{Crafting					
	a['shard-white'] = {'name':'White Shard','icon':'shard.white','stack':1,'examine':'A piece of shard that can be used with a plan to craft equipment.' }
	a['shard-blue'] = {'name':'Blue Shard','icon':'shard.blue','stack':1,'examine':'A piece of shard that can be used with a plan to craft equipment.'}
	a['shard-yellow'] = {'name':'Yellow Shard','icon':'shard.yellow','stack':1,'examine':'A piece of shard that can be used with a plan to craft equipment.'}
	a['shard-gold'] = {'name':'Gold Shard','icon':'shard.gold','stack':1,'examine':'A piece of shard that can be used with a plan to craft equipment.'}
	


	//
	a['bugged-drop'] = {'name':'I AM ERR0R','icon':'system.square'};
	
	a['lobster'] = {'name':'Lobster','icon':'system.square'};
	a['wood'] = {'name':'wood','icon':'system.square'};	
	a['logs'] = {'name':'logs','icon':'system.square'};	
	//}
	
	//{Testing
	a['test'] = {'name':'Test','icon':'system.square','stack':1,
			'option':[	
			    
			]};		
	

	
	//}
	
	a['generator'] = {'name':'Generator','icon':'weapon.staff',trade:0,'stack':1,'drop':0,'option':[	
		{'name':'Ghost','param':[],'func':Test.ghost},	
		{'name':'Tele','param':[],'func':function(key){
			Chat.question(key,{text:"x,y,map", func:function(key,x,y,map){
				if(map == '1'){ List.all[key].x += +x; List.all[key].y += +y; return; }
				Actor.teleport(List.all[key],{x:+x,y:+y,map:map});		
			}});	
		}},	
		{'name':'Item','param':[],'func':function(key){
			Chat.question(key,{text:"item,amount", func:function(key,item,amount){
				if(item === 'plan') return Itemlist.add(List.main[key].invList,Plan.creation.simple(key));
				if(Db.item[item])	Itemlist.add(List.main[key].invList,item,+amount || 1);
				else Chat.add(key,'wrong');
			}});	
		}},
		{'name':'Enemy','param':[],'func':function(key){
			Chat.question(key,{text:"Category,Variant", func:function(key,cat,variant){
				Test.spawnEnemy(key,cat,variant);		
			}});	
		}},
		{'name':'Invincible','param':[],'func':Test.invincible},
		{'name':'Quest Complete','param':[],'func':function(key){
			if(List.main[key].questActive)
				Quest.complete(key,List.main[key].questActive);			
		}},
	]};	


	//{Orb
	a['boost_orb'] = {'name':'Orb of Power','icon':'orb.boost','stack':1,'examine':'A orb that adds a boost to an equipment.',
			'option':[	
				{'name':'Use','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['boost',1]}]},
				{'name':'Use x10','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['boost',10]}]},
				{'name':'Use x100','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['boost',100]}]},
				{'name':'Use x1000','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['boost',1000]}]},
			]};	
	a['upgrade_orb'] = {'name':'Orb of Upgrade','icon':'orb.upgrade','stack':1,'examine':'A orb that improves the stats of an equipment.',
			'option':[	
				{'name':'Use','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['upgrade',1]}]},
				{'name':'Use x10','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['upgrade',10]}]},
				{'name':'Use x100','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['upgrade',100]}]},
				{'name':'Use x1000','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['upgrade',1000]}]},
			]};	
	a['removal_orb'] = {'name':'Orb of Removal','icon':'orb.removal','stack':1,'examine':'A orb that removes a boost to an equipment.',
			'option':[	
				{'name':'Use','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['removal',1]}]},
				{'name':'Use x10','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['removal',10]}]},
				{'name':'Use x100','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['removal',100]}]},
				{'name':'Use x1000','func':Main.selectInv,'param':['$main',{'name':'Use Orb','func':Craft.orb,'param':['removal',1000]}]},
			]};
	a['orb-removal'] = {'name':'Orb of Removal','icon':'orb.removal','stack':1,'examine':'A orb that grants 1 Passive Remove Point.',
		'option':[	
			{'name':'Use','func':Main.grantRemovePt,'param':['$main',1]},
		]};	
	//}
	
	for(var i in a){	
		a[i].id = i;
		Item.creation(a[i]);
	}	
}



var Item = exports.Item = {};

Item.creation = function(item){	
	item = Tk.useTemplate(Item.template(),item,true);
	if(item.examine) item.option.push({'name':'Examine','func':Chat.add,'param':[item.examine]})
	if(!item.quest && item.drop && 
		(!item.option[item.option.length-1] || item.option[item.option.length-1].name !== 'Drop'))	//BAD
			item.option.push({'name':'Drop','func':Main.dropInv,'param':['$main',item.id]})
	if(item.destroy &&
		(!item.option[item.option.length-1] || item.option[item.option.length-1].name !== 'Destroy')) 	//BAD
			item.option.push({'name':'Destroy','func':Main.destroyInv,'param':['$main',item.id]})
	Db.item[item.id] = item;
}

Item.template = function(){
	return {
		name:'buggedItem',
		icon:'system.square',
		trade:1, 
		drop:1,
		destroy:0,
		remove:0,
		bank:1,
		stack:0,
		value:1,
		examine:'',
		option: [],
		type:'item',
		quest:'',
	}
}

Item.removeFromDb = function(id){
	db.remove('equip',{id:id});
	db.remove('ability',{id:id});
}


