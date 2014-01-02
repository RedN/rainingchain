//Weapon

//Init the Weapon Database
Init.db.weapon = function (cb){
	Db.weapon = {};
	weaponPreDb = {};
	
	//Get the info from the actual MongoDb
	db.weapon.find({atk:10},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results){
			weaponPreDb[results[i].id] = results[i];
	}
	
	//Add the default Weapons to the PreDb List
	weaponPreDb['summonWand'] = {
		'piece': 'magic','type':'wand','visual':'magic.wand',
		'name':"Summon Wand",'sprite':{'name':"pWand",'sizeMod':1},
		'dmgMain':10,'dmgRatio':{'melee':0,'range':0,'magic':0.70,'fire':0.70,'cold':0.2,'lightning':0.10},
		'boost': [
		
		],
	}
	
	weaponPreDb['mace'] = {
		'piece': 'melee','type': 'mace','visual':'melee.mace',
		'name':"Mace",'sprite':{'name':"pMace",'sizeMod':1},
		'dmgMain':10,'dmgRatio':{'melee':0.80,'range':0,'magic':0,'fire':0,'cold':0.5,'lightning':0.50},
		'boost': [		
			
		],

	}
	



	weaponPreDb['spear'] = {
		'piece': 'melee','type': 'spear','visual': 'melee.spear',
		'name':"Spear",'sprite':{'name':"pSpear",'sizeMod':1},
		'dmgMain':10,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost': [],

	}
	
	weaponPreDb['sword'] = {
		'piece': 'melee','type': 'sword','visual': 'melee.sword',
		'name':"Sword",'sprite':{'name':"pSword",'sizeMod':1},
		'dmgMain':10,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost': [],

	}
		
	weaponPreDb['bow'] = {
		'piece': 'range','type': 'bow','visual': 'range.bow',
		'name':"Bow",'sprite':{'name':"pBow",'sizeMod':1},
		'dmgMain':10,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[],

	}
	
	weaponPreDb['boomerang'] = {
		'piece': 'range','type': 'boomerang','visual': 'range.boomerang',
		'name':"Boomerang", 'sprite':{'name':"pBow",'sizeMod':1},
		'dmgMain':10,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[	{'stat':'pierce-chance','type':'base','value':1},
		
		],

	}
	
	weaponPreDb['crossbow'] = {
		'piece': 'range','type': 'crossbow','visual': 'range.crossbow',
		'name':"Crossbow", 'sprite':{'name':"pBow",'sizeMod':1},
		'dmgMain':10,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[],
		
	}
	
	weaponPreDb['wand'] = {
		'piece': 'magic','type': 'wand','visual': 'magic.wand',
		'name':"Wand", 'sprite':{'name':"pWand",'sizeMod':1},
		'dmgMain':10,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[],
		
	}
	
	weaponPreDb['staff'] = {
		'piece': 'magic','type': 'staff','visual': 'magic.staff',
		'name':"Staff", 'sprite':{'name':"pWand",'sizeMod':1},
		'dmgMain':10,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[],
		
	}

	weaponPreDb['orb'] = {
		'piece': 'magic','type': 'orb','visual': 'magic.orb',
		'name':"Orb", 'type': 'orb','sprite':{'name':"pWand",'sizeMod':1},
		'dmgMain':10,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[],
		
	}
	
	weaponPreDb['goddess'] = {
		'piece': 'magic','type': 'orb','visual': 'magic.orb',
		'name':"Wand", 'type': 'staff','sprite':{'name':"pWand",'sizeMod':1},
		'dmgMain':10,'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'boost':[],
			
	}
	
	weaponPreDb['nothing'] = {};
    
    
    //Init all weapons
	for(var i in weaponPreDb){	
		weaponPreDb[i].id = i;
		initWeapon(weaponPreDb[i]);
	}
	
	
	
	cb.call();
	
	
	
}); }

//Init a specfic weapon
initWeapon = function(equip){
    
    //Add Default Weapon elements and init weapon
	equip = useTemplate(defaultWeapon(),equip);
	if(equip.dmg === undefined){
		var total = 0;
		equip.dmg = {};
		equip.dmgRatio = normalizeRatio(equip.dmgRatio);
		for(var i in equip.dmgRatio){ equip.dmg[i] = equip.dmgRatio[i] * equip.dmgMain; }
	}
	Db.weapon[equip.id] = equip;
	equip.color = Craft.create.equip.color(equip);
	
	//Create the item version of the weapon
	var id = equip.id;
	var item = {};
	item.name = equip.name;
	item.visual = equip.piece + '.' + equip.type;
	item.option = [	
				{'name':'Examine Weapon','func':'examineWeapon','param':[equip.id]},
				{'name':'Change Weapon','func':'Mortal.switchWeapon','param':[equip.id]},
				{'name':'Salvage','func':'Craft.salvage','param':[equip.id]},	
	];
	item.id = id;
	item.type = 'weapon';
	Item.creation(item);
			
	
	db.weapon.update( {'id':equip.id}, equip, { upsert: true }, function(err) {});
	
}

//Default Weapon
defaultWeapon = function(){
	var weapon = {
		'id':'mace',
		'piece': 'melee',
		'type': 'mace',
		'visual': 'melee.mace',
		'lvl':0,
		'dmgMain':0,
		'dmgRatio':{'melee':0.10,'range':0.10,'magic':0.10,'fire':0.10,'cold':10,'lightning':0.10},
		'name':"Default",
		'sprite':{'name':"pMace",'sizeMod':1},
		'boost':[],
		'input':[],
		'orb':{'upgrade':{'amount':0,'bonus':1},'boost':{'amount':0,'bonus':0,'history':[]}},
		'selfFound':1,
		'accountBound':0,
		'color':'white',
	}
	weapon.seed = Craft.seed.template(weapon);
	return weapon;

}


/*
when account bound =>add 1 bonus
if self found => all boost become *1.1
*/



examineWeapon = function(key, id){
	openPopup(key,'weapon',Db.weapon[id]);
}





