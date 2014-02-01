
Init.db.material = function(){
	Db.material = {
		
		//Mining
		'metal-0':{'name':'Bronze Metal','icon':'metal.metal','exchangeRate':100},
		'metal-20':{'name':'Iron Metal','icon':'metal.metal','exchangeRate':100},
		'metal-40':{'name':'Steel Metal','icon':'metal.metal','exchangeRate':100},
		'metal-60':{'name':'Gold Metal','icon':'metal.metal','exchangeRate':100},
		'metal-80':{'name':'Crystal Metal','icon':'metal.metal','exchangeRate':100},
			
		'chain-0':{'name':'Bronze Chain','icon':'chain.chain','exchangeRate':100},
		'chain-20':{'name':'Iron Chain','icon':'chain.chain','exchangeRate':100},
		'chain-40':{'name':'Steel Chain','icon':'chain.chain','exchangeRate':100},
		'chain-60':{'name':'Gold Chain','icon':'chain.chain','exchangeRate':100},
		'chain-80':{'name':'Crystal Chain','icon':'chain.chain','exchangeRate':100},
		
		//Woodcutting
		'wood-0':{'name':'Ash Wood','icon':'wood.wood','exchangeRate':100},
		'wood-20':{'name':'Oak Wood','icon':'wood.wood','exchangeRate':100},
		'wood-40':{'name':'Birch Wood','icon':'wood.wood','exchangeRate':100},
		'wood-60':{'name':'Maple Wood','icon':'wood.wood','exchangeRate':100},
		'wood-80':{'name':'Hickory Wood','icon':'wood.wood','exchangeRate':100},
		
		'leaf-0':{'name':'Ash Leaf','icon':'leaf.leaf','exchangeRate':100},
		'leaf-20':{'name':'Oak Leaf','icon':'leaf.leaf','exchangeRate':100},
		'leaf-40':{'name':'Birch Leaf','icon':'leaf.leaf','exchangeRate':100},
		'leaf-60':{'name':'Maple Leaf','icon':'leaf.leaf','exchangeRate':100},
		'leaf-80':{'name':'Hickory Leaf','icon':'leaf.leaf','exchangeRate':100},
		
		
		//Hunter
		'bone-0':{'name':'Squirrel Bone','icon':'bone.bone','exchangeRate':100},
		'bone-20':{'name':'Rabbit Bone','icon':'bone.bone','exchangeRate':100},
		'bone-40':{'name':'Fox Bone','icon':'bone.bone','exchangeRate':100},
		'bone-60':{'name':'Wolf Bone','icon':'bone.bone','exchangeRate':100},
		'bone-80':{'name':'Dragon Bone','icon':'bone.bone','exchangeRate':100},
			
		'hide-0':{'name':'Squirrel Leather','icon':'hide.hide','exchangeRate':100},
		'hide-20':{'name':'Rabbit Leather','icon':'hide.hide','exchangeRate':100},
		'hide-40':{'name':'Fox Leather','icon':'hide.hide','exchangeRate':100},
		'hide-60':{'name':'Wolf Leather','icon':'hide.hide','exchangeRate':100},
		'hide-80':{'name':'Dragon Leather','icon':'hide.hide','exchangeRate':100},
		
		
		'rare-0':{'name':'Rare Material 0','icon':'hide.hide','exchangeRate':100},
		'rare-1':{'name':'Rare Material 1','icon':'hide.hide','exchangeRate':100},
		'rare-2':{'name':'Rare Material 2','icon':'hide.hide','exchangeRate':100},
		'rare-3':{'name':'Rare Material 3','icon':'hide.hide','exchangeRate':100},
		'rare-4':{'name':'Rare Material 4','icon':'hide.hide','exchangeRate':100},
		'rare-5':{'name':'Rare Material 5','icon':'hide.hide','exchangeRate':100},
		'rare-6':{'name':'Rare Material 6','icon':'hide.hide','exchangeRate':100},
		'rare-7':{'name':'Rare Material 7','icon':'hide.hide','exchangeRate':100},
		'rare-8':{'name':'Rare Material 8','icon':'hide.hide','exchangeRate':100},
		'rare-9':{'name':'Rare Material 9','icon':'hide.hide','exchangeRate':100},
		
	};
	var tmp = {};
		
	for(var i in Db.material){
		var entry = Db.material[i];
		if(i.have('bone') || i.have('hide')) entry.skill = 'hunting';
		if(i.have('wood' || i.have('leaf'))) entry.skill = 'woodcutting';
		if(i.have('metal' || i.have('chain'))) entry.skill = 'mining';
		if(typeof entry.lvl === 'undefined') entry.lvl = i.numberOnly();
		
		entry.id = i;
		entry.icon = entry.icon || 'wood.wood';
		entry.name = entry.name || 'Crytal';
		entry.exchangeRate = entry.exchangeRate || 100;
		tmp[i] = 0;
	}
	
	if(!server) return;
	Craft.material.template = new Function('return ' + stringify(tmp));
	Craft.material.list = Object.keys(Db.material).sort();
	for(var i in Db.material){
		var entry = Db.material[i];
		
		Item.creation({
			'id':i,
			'name':entry.name,
			'icon':entry.icon,
			'stack':1,
			'type':'material',
			'option': [
				{'param':['material'],'name':'Material Window','func':'Main.openWindow'},
				{'param':[i,1],'name':'Salvage x1','func':'Craft.material.salvage'},
				{'param':[i,10],'name':'Salvage x10','func':'Craft.material.salvage'},
			],
		});

	}
}






































