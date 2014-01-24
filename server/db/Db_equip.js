//Armor

//Exact same system than Weapon.js
Init.db.equip = function (cb){
	Db.equip = {};
	var pre = {};

	db.equip.find({},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results){
			pre[results[i].id] = results[i];
			
	}
	
	
	pre['metalbody'] = {'name':"Hello Kitty",'piece':'body','type':'metal','visual':'body.metal',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['metalhelm'] = {'name':"Hello Kitty",'piece':'helm','type':'metal','visual':'helm.metal',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['metalshield'] = {'name':"Hello Kitty",'piece':'shield','type':'metal','visual':'shield.metal',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
		
	
	pre['woodbody'] = {'name':"Hello Kitty",'piece':'body','type':'wood','visual':'body.wood',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['woodhelm'] = {'name':"Hello Kitty",'piece':'helm','type':'wood','visual':'helm.wood',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['woodshield'] = {'name':"Hello Kitty",'piece':'shield','type':'wood','visual':'shield.wood',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['bonebody'] = {'name':"Hello Kitty",'piece':'body','type':'bone','visual':'body.bone',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['bonehelm'] = {'name':"Hello Kitty",'piece':'helm','type':'bone','visual':'helm.bone',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['boneshield'] = {'name':"Hello Kitty",'piece':'shield','type':'bone','visual':'shield.bone',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}


	//
	
	pre['bracelet'] = {'name':"Hello Kitty",'piece':'bracelet','type':'ruby','visual':'bracelet.ruby',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['amulet'] = {'name':"Hello Kitty",'piece':'amulet','type':'ruby','visual':'amulet.ruby',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['gloves'] = {'name':"Hello Kitty",'piece':'gloves','type':'chain','visual':'gloves.chain',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['boots'] = {'name':"Hello Kitty",'piece':'boots','type':'chain','visual':'boots.chain',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['pants'] = {'name':"Hello Kitty",'piece':'pants','type':'chain','visual':'pants.chain',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	pre['ring'] = {'name':"Hello Kitty",'piece':'ring','type':'ruby','visual':'ring.ruby',
		'defMain':1, 'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		'boost':[]
	}
	
	//Add the default Weapons to the PreDb List
	pre['summonWand'] = {
		'piece': 'magic','type':'wand','visual':'magic.wand',
		'name':"Summon Wand",'sprite':{'name':"pWand",'sizeMod':1},
		'dmgMain':100,'dmgRatio':{'melee':0,'range':0,'magic':0.70,'fire':0.70,'cold':0.2,'lightning':0.10},
		'boost': [
		
		],
	}
	
	pre['mace'] = {
		'piece': 'melee','type': 'mace','visual':'melee.mace',
		'name':"Mace",'sprite':{'name':"pMace",'sizeMod':1},
		'dmgMain':100,'dmgRatio':{'melee':0.80,'range':0,'magic':0,'fire':0,'cold':0.5,'lightning':0.50},
		'boost': [		
			
		],

	}
	



	pre['spear'] = {
		'piece': 'melee','type': 'spear','visual': 'melee.spear',
		'name':"Spear",'sprite':{'name':"pSpear",'sizeMod':1},
		'dmgMain':100,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost': [],

	}
	
	pre['sword'] = {
		'piece': 'melee','type': 'sword','visual': 'melee.sword',
		'name':"Sword",'sprite':{'name':"pSword",'sizeMod':1},
		'dmgMain':100,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost': [],

	}
		
	pre['bow'] = {
		'piece': 'range','type': 'bow','visual': 'range.bow',
		'name':"Bow",'sprite':{'name':"pBow",'sizeMod':1},
		'dmgMain':100,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[],

	}
	
	pre['boomerang'] = {
		'piece': 'range','type': 'boomerang','visual': 'range.boomerang',
		'name':"Boomerang", 'sprite':{'name':"pBow",'sizeMod':1},
		'dmgMain':100,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[	{'stat':'pierce-chance','type':'base','value':1},
		
		],

	}
	
	pre['crossbow'] = {
		'piece': 'range','type': 'crossbow','visual': 'range.crossbow',
		'name':"Crossbow", 'sprite':{'name':"pBow",'sizeMod':1},
		'dmgMain':100,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[],
		
	}
	
	pre['wand'] = {
		'piece': 'magic','type': 'wand','visual': 'magic.wand',
		'name':"Wand", 'sprite':{'name':"pWand",'sizeMod':1},
		'dmgMain':100,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[],
		
	}
	
	pre['staff'] = {
		'piece': 'magic','type': 'staff','visual': 'magic.staff',
		'name':"Staff", 'sprite':{'name':"pWand",'sizeMod':1},
		'dmgMain':100,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[],
		
	}

	pre['orb'] = {
		'piece': 'magic','type': 'orb','visual': 'magic.orb',
		'name':"Orb", 'type': 'orb','sprite':{'name':"pWand",'sizeMod':1},
		'dmgMain':100,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[],
		
	}
	
	pre['goddess'] = {
		'piece': 'magic','type': 'orb','visual': 'magic.orb',
		'name':"Wand", 'type': 'staff','sprite':{'name':"pWand",'sizeMod':1},
		'dmgMain':100,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
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
	Db.equip[equip.id] = equip;
	
	var item = {
		'name':equip.name,
		'visual':equip.piece + '.' + equip.type,
		'type':'equip',
		'id':equip.id,
		'option':[	
			{'name':'Examine Equip','func':'Main.examineEquip','param':[equip.id]},
			{'name':'Change Equip','func':'Actor.switchEquip','param':[equip.id]},
			{'name':'Salvage','func':'Craft.salvage','param':[equip.id]},
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
		'visual':'pants.chain',
		'lvl':0,
		
		'defMain':10, 
		'defRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
		
		'dmgMain':10, 
		'dmgRatio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1},
			
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
	


