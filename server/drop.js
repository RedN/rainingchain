//Drop

var DROP_TIMER = 25*30;

initDropDb = function(){
	dropDb = {
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



pickDrop = function (key,id){
	if(List.drop[id]){
		var dist = distancePtPt(List.mortal[key],List.drop[id]);

		if(dist <= List.mortal[key].pickRadius && List.main[key].invList.test([[List.drop[id].item,List.drop[id].amount]])){
			List.main[key].invList.add(List.drop[id].item,List.drop[id].amount);
			removeDrop(List.drop[id]);		
		}
	}
}

rightClickDrop = function(key,rect){
	var ol = {'name':'Pick Items','option':[]};
	for(var i in List.drop){
		var d = List.drop[i];
		if(d.map == List.all[key].map && Collision.RectRect(rect,[d.x,d.x+32,d.y,d.y+32]) ){
			ol.option.push({'name':'Pick ' + itemDb[List.drop[i].item].name,'func':'pickDrop','param':[i]});
		}
	}
	
	if(ol.option){ 
		Button.optionList(key,ol);  
	}	
}
			
		
addDrop = function(drop){
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

Loop.Drop = function(){
	for(var i in List.drop){ 
		var drop = List.drop[i];
		drop.timer--; 
		if(drop.timer <= 0){ removeDrop(drop); }
	}
}

enemyDropItem = function(enemy,killer){
	var quantity = enemy.drop.mod.quantity; var quality = enemy.drop.mod.quality; var rarity = enemy.drop.mod.rarity;
	if(killer){ quantity += killer.item.quantity; }
	if(killer){ quality += killer.item.quality; }
	if(killer){ rarity += killer.item.rarity; }
	
	var drop = enemy.drop;
	
	for(var i in drop.category){
		
		if(drop.category[i] != 'plan'){
			var list = dropDb[drop.category[i]];
			for(var j in list){
				var item = list[j];
				if(Math.pow(Math.random(),quantity+1) < item.chance){
					var amount = Math.floor(item.min + (item.max-item.min)*( Math.pow(Math.random(),1/(quantity+1)))) ;	//player quantity
					addDrop({'x':enemy.x+(Math.random()-0.5)*50,'y':enemy.y+(Math.random()-0.5)*50,'map':enemy.map,'item':item.item,'amount':amount,'timer':DROP_TIMER});		
				}	
			}
		} else {
			if(Math.pow(Math.random(),(quantity+1)) < dropDb.plan){
				var itemId = 'planA' + Math.randomId();
				var item = {'name':"Plan",'visual':'plan.planA',
							'option':[	{'name':'Craft Item','func':'Craft.plan',
										'param':[{'lvl':Math.max(0,Math.floor(enemy.lvl*1+(Math.random()-0.5)*15)),'rarity':rarity,'quality':quality},{'item':[{'item':itemId,'amount':1}]}]}
							]};
				
				
				item.id = itemId;
				initItem(item);
				
				addDrop({'x':enemy.x+(Math.random()-0.5)*50,'y':enemy.y+(Math.random()-0.5)*50,'map':enemy.map,'item':itemId,'amount':1,'timer':DROP_TIMER});		
			}
		}
	}
}

removeDrop = function(drop){
	ActiveList.remove(drop);
	delete List.all[drop.id];
	delete List.drop[drop.id];

}

dropInv = function(key, iii){
	var item = itemDb[iii];
	var player = List.all[key];
	var amount = 1;
	if(item.stack){ amount = List.main[key].invList.have(iii,'amount'); }
	
	addDrop({'x':player.x,'y':player.y,'map':player.map,'item':iii,'amount':amount,'timer':25*30});
	List.main[key].invList.remove(iii,amount);
}



































