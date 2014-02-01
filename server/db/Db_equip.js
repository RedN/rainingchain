//Armor

//Exact same system than Weapon.js
Init.db.equip = function (cb){
	Db.equip = {};
	var pre = {};

	db.equip.find({},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results)	pre[results[i].id] = results[i];
			
	
	
	pre['metalbody'] = {'name':"Hello Kitty",'piece':'body','type':'metal','icon':'body.metal',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['metalhelm'] = {'name':"Hello Kitty",'piece':'helm','type':'metal','icon':'helm.metal',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['metalshield'] = {'name':"Hello Kitty",'piece':'shield','type':'metal','icon':'shield.metal',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
		
	
	pre['woodbody'] = {'name':"Hello Kitty",'piece':'body','type':'wood','icon':'body.wood',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['woodhelm'] = {'name':"Hello Kitty",'piece':'helm','type':'wood','icon':'helm.wood',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['woodshield'] = {'name':"Hello Kitty",'piece':'shield','type':'wood','icon':'shield.wood',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['bonebody'] = {'name':"Hello Kitty",'piece':'body','type':'bone','icon':'body.bone',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['bonehelm'] = {'name':"Hello Kitty",'piece':'helm','type':'bone','icon':'helm.bone',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['boneshield'] = {'name':"Hello Kitty",'piece':'shield','type':'bone','icon':'shield.bone',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}


	//
	
	pre['bracelet'] = {'name':"Hello Kitty",'piece':'bracelet','type':'ruby','icon':'bracelet.ruby',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['amulet'] = {'name':"Hello Kitty",'piece':'amulet','type':'ruby','icon':'amulet.ruby',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['gloves'] = {'name':"Hello Kitty",'piece':'gloves','type':'chain','icon':'gloves.chain',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['boots'] = {'name':"Hello Kitty",'piece':'boots','type':'chain','icon':'boots.chain',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['pants'] = {'name':"Hello Kitty",'piece':'pants','type':'chain','icon':'pants.chain',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	pre['ring'] = {'name':"Hello Kitty",'piece':'ring','type':'ruby','icon':'ring.ruby',
		'def':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost':[]
	}
	
	//Add the default Weapons to the PreDb List
	pre['summonWand'] = {
		'piece': 'magic','type':'wand','icon':'magic.wand',
		'name':"Summon Wand",'sprite':{'name':"pWand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost': [
		
		],
	}
	
	pre['mace'] = {
		'piece': 'melee','type': 'mace','icon':'melee.mace',
		'name':"Mace",'sprite':{'name':"pMace",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost': [		
			
		],

	}
	



	pre['spear'] = {
		'piece': 'melee','type': 'spear','icon': 'melee.spear',
		'name':"Spear",'sprite':{'name':"pSpear",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost': [],

	}
	
	pre['sword'] = {
		'piece': 'melee','type': 'sword','icon': 'melee.sword',
		'name':"Sword",'sprite':{'name':"pSword",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost': [],

	}
		
	pre['bow'] = {
		'piece': 'range','type': 'bow','icon': 'range.bow',
		'name':"Bow",'sprite':{'name':"pBow",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],

	}
	
	pre['boomerang'] = {
		'piece': 'range','type': 'boomerang','icon': 'range.boomerang',
		'name':"Boomerang", 'sprite':{'name':"pBow",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[	
		
		],

	}
	
	pre['crossbow'] = {
		'piece': 'range','type': 'crossbow','icon': 'range.crossbow',
		'name':"Crossbow", 'sprite':{'name':"pBow",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}
	
	pre['wand'] = {
		'piece': 'magic','type': 'wand','icon': 'magic.wand',
		'name':"Wand", 'sprite':{'name':"pWand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}
	
	pre['staff'] = {
		'piece': 'magic','type': 'staff','icon': 'magic.staff',
		'name':"Staff", 'sprite':{'name':"pWand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}

	pre['orb'] = {
		'piece': 'magic','type': 'orb','icon': 'magic.orb',
		'name':"Orb", 'type': 'orb','sprite':{'name':"pWand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}
	
	pre['goddess'] = {
		'piece': 'magic','type': 'orb','icon': 'magic.orb',
		'name':"Wand", 'type': 'staff','sprite':{'name':"pWand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
			
	}
	
	for(var i in pre){	
		pre[i].id = i;
		Equip.creation(pre[i]);	
	}
	
	cb.call();
	
	
}); }

Equip = {};

Equip.creation = function(equip){
	equip = useTemplate(Equip.template(),equip);
	
	equip.color = Craft.equip.color(equip);
	equip.category = Cst.equip.weapon.piece.have(equip.piece) ? 'weapon' : 'armor';
	
	equip.def.ratio = convertRatio(equip.def.ratio);
	equip.dmg.ratio = convertRatio(equip.dmg.ratio);

	
	Db.equip[equip.id] = equip;
	
	var item = {
		'name':equip.name,
		'icon':equip.piece + '.' + equip.type,
		'type':'equip',
		'id':equip.id,
		'option':[	
			{'name':'Examine Equip','func':'Main.examineEquip','param':[equip.id]},
			{'name':'Change Equip','func':'Actor.switchEquip','param':[equip.id]},
			{'name':'Salvage','func':'Craft.equip.salvage','param':[equip.id]},
		],
	};
	
	Item.creation(item);
		
	
	db.equip.update( {'id':equip.id}, equip, { upsert: true }, db.err);

}
//Add Default Weapon elements and init weapon
	
	
//################################################

Equip.template = function(){
	return {
		'name':"Hello Kitty",
		'piece':'pants',
		'type':'chain',
		'icon':'pants.chain',
		'lvl':0,
		'def':{'main':0,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},	
		'dmg':{'main':0,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},		
		'boost':[],
		'orb':{'upgrade':{'amount':0,'bonus':1},'boost':{'amount':0,'bonus':0,'history':[]}},
		'selfFound':1,
		'accountBound':0,
		'color':'white',
		'sprite':{'name':"pMace",'sizeMod':1},
	}
	//equip.seed = Craft.seed.template(equip);
}
	

/*
when account bound =>add 1 bonus
if self found => all boost become *1.1
*/
	


