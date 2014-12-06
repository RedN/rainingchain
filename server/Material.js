//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['ItemModel','Quest'],['Material']));

var DB = {};

var Material = exports.Material = function(id,name,icon,skill,lvl){
	var tmp = {
		id:id || ERROR(2,'id missing') || '',
		name:name || '',
		icon:icon || '',
		skill:skill || '',
		lvl:lvl || 0
	}
	ItemModel('Qsystem',Quest.addPrefix('Qsystem',id),tmp.name,tmp.icon,[],'Crafting Material',{
		type:'material',
		examine:'A material used to create equip with plans.'
	});

	DB[id] = tmp;
}

Material.getRandom = function(lvl){
	lvl = Material.roundLevel(lvl);
	var random = Material.DROP_RATE.random();
	return random + '-' + lvl;
}

Material.getMaterialRelatedToSkill = function(skill,lvl){
	lvl = Material.roundLevel(lvl);
	if(skill === 'metalwork') return 'metal-' + lvl;
	if(skill === 'woodwork') return 'wood-' + lvl;
	if(skill === 'leatherwork') return 'bone-' + lvl;
	
	return Material.getRandom(lvl);	
}

Material.roundLevel = function(lvl){
	return Math.floor((lvl ||0)/20);	
}	

Material.DROP_RATE = {
	metal:1/4,
	wood:1/4,
	bone:1/4,
	ruby:1/12,
	topaz:1/12,
	sapphire:1/12,
};

Material.init = function(){	//init requires cuz call ItemModel which require st00f
	Material('metal-0','Bronze Metal','metal.metal','mining',0);
	Material('metal-20','Iron Metal','metal.metal','mining',20);
	Material('metal-40','Steel Metal','metal.metal','mining',40);
	Material('metal-60','Gold Metal','metal.metal','mining',60);
	Material('metal-80','Crystal Metal','metal.metal','mining',80);

	Material('wood-0','Red Wood','wood.wood','woodcutting',0);
	Material('wood-20','Yellow Wood','wood.wood','woodcutting',20);
	Material('wood-40','Blue Wood','wood.wood','woodcutting',40);
	Material('wood-60','Grey Wood','wood.wood','woodcutting',60);
	Material('wood-80','Dark Wood','wood.wood','woodcutting',80);

	Material('bone-0','Squirrel Bone','bone.bone','hunting',0);
	Material('bone-20','Rabbit Bone','bone.bone','hunting',20);
	Material('bone-40','Fox Bone','bone.bone','hunting',40);
	Material('bone-60','Wolf Bone','bone.bone','hunting',60);
	Material('bone-80','Dragon Bone','bone.bone','hunting',80);

	Material('ruby-0','Chipped Ruby','orb.ruby','',0);
	Material('ruby-20','Flawed Ruby','orb.ruby','',20);
	Material('ruby-40','Normal Ruby','orb.ruby','',40);
	Material('ruby-60','Flawless Ruby','orb.ruby','',60);
	Material('ruby-80','Perfect Ruby','orb.ruby','',80);

	Material('sapphire-0','Chipped Sapphire','orb.sapphire','',0);
	Material('sapphire-20','Flawed Sapphire','orb.sapphire','',20);
	Material('sapphire-40','Normal Sapphire','orb.sapphire','',40);
	Material('sapphire-60','Flawless Sapphire','orb.sapphire','',60);
	Material('sapphire-80','Perfect Sapphire','orb.sapphire','',80);

	Material('topaz-0','Chipped Topaz','orb.topaz','',0);
	Material('topaz-20','Flawed Topaz','orb.topaz','',20);
	Material('topaz-40','Normal Topaz','orb.topaz','',40);
	Material('topaz-60','Flawless Topaz','orb.topaz','',60);
	Material('topaz-80','Perfect Topaz','orb.topaz','',80);
}



