//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','Init','Item'],[]));

Init.db.material = function(){
	Db.material = {
		//Mining
		'metal-0':{'name':'Bronze Metal','icon':'metal.metal'},
		'metal-20':{'name':'Iron Metal','icon':'metal.metal'},
		'metal-40':{'name':'Steel Metal','icon':'metal.metal'},
		'metal-60':{'name':'Gold Metal','icon':'metal.metal'},
		'metal-80':{'name':'Crystal Metal','icon':'metal.metal'},
		
		//Woodcutting
		'wood-0':{'name':'Red Wood','icon':'wood.wood'},
		'wood-20':{'name':'Yellow Wood','icon':'wood.wood'},
		'wood-40':{'name':'Blue Wood','icon':'wood.wood'},
		'wood-60':{'name':'Grey Wood','icon':'wood.wood'},
		'wood-80':{'name':'Dark Wood','icon':'wood.wood'},
				
		
		//Hunter
		'bone-0':{'name':'Squirrel Bone','icon':'bone.bone'},
		'bone-20':{'name':'Rabbit Bone','icon':'bone.bone'},
		'bone-40':{'name':'Fox Bone','icon':'bone.bone'},
		'bone-60':{'name':'Wolf Bone','icon':'bone.bone'},
		'bone-80':{'name':'Dragon Bone','icon':'bone.bone'},
				
		//Ruby
		'ruby-0':{'name':'Chipped Ruby','icon':'orb.ruby'},
		'ruby-20':{'name':'Flawed Ruby','icon':'orb.ruby'},
		'ruby-40':{'name':'Normal Ruby','icon':'orb.ruby'},
		'ruby-60':{'name':'Flawless Ruby','icon':'orb.ruby'},
		'ruby-80':{'name':'Perfect Ruby','icon':'orb.ruby'},
		
		//Sapphire
		'sapphire-0':{'name':'Chipped Sapphire','icon':'orb.sapphire'},
		'sapphire-20':{'name':'Flawed Sapphire','icon':'orb.sapphire'},
		'sapphire-40':{'name':'Normal Sapphire','icon':'orb.sapphire'},
		'sapphire-60':{'name':'Flawless Sapphire','icon':'orb.sapphire'},
		'sapphire-80':{'name':'Perfect Sapphire','icon':'orb.sapphire'},
		
		//Topaz
		'topaz-0':{'name':'Chipped Topaz','icon':'orb.topaz'},
		'topaz-20':{'name':'Flawed Topaz','icon':'orb.topaz'},
		'topaz-40':{'name':'Normal Topaz','icon':'orb.topaz'},
		'topaz-60':{'name':'Flawless Topaz','icon':'orb.topaz'},
		'topaz-80':{'name':'Perfect Topaz','icon':'orb.topaz'},
		
			
	};
	var tmp = {};
		
	for(var i in Db.material){
		var mat = Db.material[i];
		if(i.have('bone') || i.have('hide')) mat.skill = 'hunting';
		if(i.have('wood') || i.have('leaf')) mat.skill = 'woodcutting';
		if(i.have('metal') || i.have('chain')) mat.skill = 'mining';
		if(mat.lvl === undefined) mat.lvl = i.numberOnly();
		
		mat.id = i;
		mat.icon = mat.icon || 'wood.wood';
		mat.name = mat.name || 'Crytal';
		tmp[i] = 0;
	}
	
	for(var i in Db.material){
		var mat = Db.material[i];
		
		Item.creation({
			'id':i,
			'name':mat.name,
			'icon':mat.icon,
			'stack':1,
			'type':'material',
			'option': [
			],
		});

	}
}






































