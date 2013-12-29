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
	if(dropList[id]){
		var dist = distancePtPt(mList[key],dropList[id]);

		if(dist <= mList[key].pickRadius && mainList[key].invList.test([[dropList[id].item,dropList[id].amount]])){
			mainList[key].invList.add(dropList[id].item,dropList[id].amount);
			removeDrop(dropList[id]);		
		}
	}
}

rightClickDrop = function(key,rect){
	var ol = {'name':'Pick Items','option':[]};
	for(var i in dropList){
		var d = dropList[i];
		if(d.map == fullList[key].map && Collision.RectRect(rect,[d.x,d.x+32,d.y,d.y+32]) ){
			ol.option.push({'name':'Pick ' + itemDb[dropList[i].item].name,'func':'pickDrop','param':[i]});
		}
	}
	
	if(ol.option){ 
		setOptionList(key,ol);  
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
	dropList[drop.id] = drop;
	fullList[drop.id] = drop;
}

Loop.Drop = function(){
	for(var i in dropList){ 
		var drop = dropList[i];
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
			var itemList = dropDb[drop.category[i]];
			for(var j in itemList){
				var item = itemList[j];
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
	delete fullList[drop.id];
	delete dropList[drop.id];

}

dropInv = function(key, iii){
	var item = itemDb[iii];
	var player = fullList[key];
	var amount = 1;
	if(item.stack){ amount = mainList[key].invList.have(iii,'amount'); }
	
	addDrop({'x':player.x,'y':player.y,'map':player.map,'item':iii,'amount':amount,'timer':25*30});
	mainList[key].invList.remove(iii,amount);
}



































