
Init.db.material = function(){
	Db.material = {
		
		//Mining
		'metal-0':{'name':'Bronze Metal','icon':'metal.metal'},
		'metal-20':{'name':'Iron Metal','icon':'metal.metal'},
		'metal-40':{'name':'Steel Metal','icon':'metal.metal'},
		'metal-60':{'name':'Gold Metal','icon':'metal.metal'},
		'metal-80':{'name':'Crystal Metal','icon':'metal.metal'},
			
		'chain-0':{'name':'Bronze Chain','icon':'chain.chain'},
		'chain-20':{'name':'Iron Chain','icon':'chain.chain'},
		'chain-40':{'name':'Steel Chain','icon':'chain.chain'},
		'chain-60':{'name':'Gold Chain','icon':'chain.chain'},
		'chain-80':{'name':'Crystal Chain','icon':'chain.chain'},
		
		//Woodcutting
		'wood-0':{'name':'Ash Wood','icon':'wood.wood'},
		'wood-20':{'name':'Oak Wood','icon':'wood.wood'},
		'wood-40':{'name':'Birch Wood','icon':'wood.wood'},
		'wood-60':{'name':'Maple Wood','icon':'wood.wood'},
		'wood-80':{'name':'Hickory Wood','icon':'wood.wood'},
		
		'leaf-0':{'name':'Ash Leaf','icon':'leaf.leaf'},
		'leaf-20':{'name':'Oak Leaf','icon':'leaf.leaf'},
		'leaf-40':{'name':'Birch Leaf','icon':'leaf.leaf'},
		'leaf-60':{'name':'Maple Leaf','icon':'leaf.leaf'},
		'leaf-80':{'name':'Hickory Leaf','icon':'leaf.leaf'},
		
		
		//Hunter
		'bone-0':{'name':'Squirrel Bone','icon':'bone.bone'},
		'bone-20':{'name':'Rabbit Bone','icon':'bone.bone'},
		'bone-40':{'name':'Fox Bone','icon':'bone.bone'},
		'bone-60':{'name':'Wolf Bone','icon':'bone.bone'},
		'bone-80':{'name':'Dragon Bone','icon':'bone.bone'},
			
		'hide-0':{'name':'Squirrel Leather','icon':'hide.hide'},
		'hide-20':{'name':'Rabbit Leather','icon':'hide.hide'},
		'hide-40':{'name':'Fox Leather','icon':'hide.hide'},
		'hide-60':{'name':'Wolf Leather','icon':'hide.hide'},
		'hide-80':{'name':'Dragon Leather','icon':'hide.hide'},
		
		
		'rare-0':{'name':'Rare Material 0','icon':'hide.hide'},
		'rare-1':{'name':'Rare Material 1','icon':'hide.hide'},
		'rare-2':{'name':'Rare Material 2','icon':'hide.hide'},
		'rare-3':{'name':'Rare Material 3','icon':'hide.hide'},
		'rare-4':{'name':'Rare Material 4','icon':'hide.hide'},
		'rare-5':{'name':'Rare Material 5','icon':'hide.hide'},
		'rare-6':{'name':'Rare Material 6','icon':'hide.hide'},
		'rare-7':{'name':'Rare Material 7','icon':'hide.hide'},
		'rare-8':{'name':'Rare Material 8','icon':'hide.hide'},
		'rare-9':{'name':'Rare Material 9','icon':'hide.hide'},
		
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
			],
		});

	}
}






































