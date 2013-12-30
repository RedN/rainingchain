//Armor

//Exact same system than Weapon.js
initArmorDb = function (cb){
	armorDb = {};
	armorPreDb = {};

	db.armor.find({},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results){
			armorPreDb[results[i].id] = results[i];
			
	}
	
	
	armorPreDb['metalbody'] = {'name':"Hello Kitty",'piece':'body','type':'metal','visual':'body.metal',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['metalhelm'] = {'name':"Hello Kitty",'piece':'helm','type':'metal','visual':'helm.metal',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['metalshield'] = {'name':"Hello Kitty",'piece':'shield','type':'metal','visual':'shield.metal',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
		
	
	armorPreDb['woodbody'] = {'name':"Hello Kitty",'piece':'body','type':'wood','visual':'body.wood',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['woodhelm'] = {'name':"Hello Kitty",'piece':'helm','type':'wood','visual':'helm.wood',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['woodshield'] = {'name':"Hello Kitty",'piece':'shield','type':'wood','visual':'shield.wood',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['bonebody'] = {'name':"Hello Kitty",'piece':'body','type':'bone','visual':'body.bone',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['bonehelm'] = {'name':"Hello Kitty",'piece':'helm','type':'bone','visual':'helm.bone',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['boneshield'] = {'name':"Hello Kitty",'piece':'shield','type':'bone','visual':'shield.bone',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}


	//
	
	armorPreDb['bracelet'] = {'name':"Hello Kitty",'piece':'bracelet','type':'ruby','visual':'bracelet.ruby',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['amulet'] = {'name':"Hello Kitty",'piece':'amulet','type':'ruby','visual':'amulet.ruby',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['gloves'] = {'name':"Hello Kitty",'piece':'gloves','type':'chain','visual':'gloves.chain',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['boots'] = {'name':"Hello Kitty",'piece':'boots','type':'chain','visual':'boots.chain',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['pants'] = {'name':"Hello Kitty",'piece':'pants','type':'chain','visual':'pants.chain',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	armorPreDb['ring'] = {'name':"Hello Kitty",'piece':'ring','type':'ruby','visual':'ring.ruby',
		'defMain':10, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	
	for(var i in armorPreDb){	
		armorPreDb[i].id = i;
		initArmor(armorPreDb[i]);	
	}
	
	cb.call();
	
	
}); }

initArmor = function(equip,mi){
	equip = useTemplate(defaultArmor(),equip);
	
	for(var j in equip.defRatio){ equip.def[j] = equip.defRatio[j] * equip.defMain; }
	
	armorDb[equip.id] = equip;
	equip.color = Craft.create.equip.color(equip);
	
	var id = equip.id;
	
	
	var item = {};
	item.name = equip.name;
	item.visual = equip.piece + '.' + equip.type;
	item.option = [	{'name':'Examine Armor','func':'examineArmor','param':[equip.id]},
					{'name':'Change Armor','func':'switchArmor','param':[equip.id]},
					{'name':'Salvage','func':'Craft.salvage','param':[equip.id]},
	];
	item.type = 'armor';
	item.id = id;
	
	
	initItem(item);
		
	
	db.armor.update( {'id':equip.id}, equip, { upsert: true }, function(err) { if(err) throw err });

}

//################################################

defaultArmor = function(){
	var armor = {
	'name':"Hello Kitty",
	'piece':'pants',
	'type':'chain',
	'visual':'pants.chain',
	'lvl':0,
	'defMain':10, 
	'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
	'def':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
	'boost':[],
	'orb':{'upgrade':{'amount':0,'bonus':1},'boost':{'amount':0,'bonus':0,'history':[]}},
	'selfFound':1,
	'accountBound':0,
	'color':'white',
	}
	armor.seed = Craft.seed.template(armor);
	return armor;
}
	
	

updateArmor = function(player){
	for(var k in Cst.element.list){	//Each Element
		var i = Cst.element.list[k];
		var sum = 0;
		for(var j in player.armor.piece){	//Each Piece
			sum += player.armor.piece[j].def[i] * player.armor.piece[j].orb.upgrade.bonus;
		}
		player.armor.def[i] = sum;
	}
}

switchArmor = function(key,name){
	var old = fullList[key].armor.piece[armorDb[name].piece];
	var armor = armorDb[name];
	mList[key].armor.piece[armor.piece] = armor;
	Mortal.permBoost(key,armor.piece,mList[key].armor.piece[armor.piece].boost);
	updateArmor(mList[key]);
	mainList[key].invList.remove(name);
	mainList[key].invList.add(old.id);
	
}

examineArmor = function(key, id){
	openPopup(key,'armor',armorDb[id]);
}

