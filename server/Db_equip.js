var db = require('./Db');

Db.equip = {};	//for quest
Init.db.equip = function (cb){
	var a = Db.equip;
	db.find('equip',{},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results)	a[results[i].id] = Equip.uncompress(results[i]);
			
	a['unarmed'] = {		//DONT TOUCH
		'piece': 'melee','type': 'mace','icon':'melee.mace',
		'name':"Mace",'sprite':{'name':"mace",'sizeMod':1},
		'dmg':{'main':1,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
	};					//DONT TOUCH
	
	
	a['start-body'] = {'name':"Body",'piece':'body','type':'metal','icon':'body.metal',
		'def':{'main':2.451,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},'boost':[]
	}
	
	a['start-helm'] = {'name':"Helm",'piece':'helm','type':'metal','icon':'helm.metal',
		'def':{'main':1.471,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},'boost':[]
	}
	
	a['start-shield'] = {'name':"Shield",'piece':'shield','type':'metal','icon':'shield.metal',
		'def':{'main':1.961,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},'boost':[]
	}
			
	a['start-bracelet'] = {'name':"Bracelet",'piece':'bracelet','type':'ruby','icon':'bracelet.ruby',
		'def':{'main':0.588,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},'boost':[]
	}
	
	a['start-amulet'] = {'name':"Amulet",'piece':'amulet','type':'ruby','icon':'amulet.ruby',
		'def':{'main':0.392,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},'boost':[]
	}
	
	a['start-gloves'] = {'name':"Gloves",'piece':'gloves','type':'chain','icon':'gloves.chain',
		'def':{'main':0.784,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},'boost':[]
	}
	
	a['start-boots'] = {'name':"Boots",'piece':'boots','type':'chain','icon':'boots.chain',
		'def':{'main':0.98,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},'boost':[]
	}
	
	a['start-pants'] = {'name':"Pants",'piece':'pants','type':'chain','icon':'pants.chain',
		'def':{'main':1.176,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},'boost':[]
	}
	
	a['start-ring'] = {'name':"Ring",'piece':'ring','type':'ruby','icon':'ring.ruby',
		'def':{'main':0.196,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},'boost':[]
	}
	
	
	a['start-mace'] = {
		'piece': 'melee','type': 'mace','icon':'melee.mace','name':"Mace",
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost': [],
	}
	a['start-weapon'] = {
		'piece': 'melee','type': 'mace','icon':'melee.mace','name':"n00b Weapon",'sprite':{'name':"mace",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1}},
		'boost': [],
	}
	
	a['spear'] = {
		'piece': 'melee','type': 'spear','icon': 'melee.spear',
		'name':"Spear",'sprite':{'name':"spear",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost': [],
	}
	
	a['sword'] = {
		'piece': 'melee','type': 'sword','icon': 'melee.sword',
		'name':"Sword",'sprite':{'name':"sword",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost': [],

	}
		
	a['bow'] = {
		'piece': 'range','type': 'bow','icon': 'range.bow',
		'name':"Bow",'sprite':{'name':"bow",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],

	}
	
	a['boomerang'] = {
		'piece': 'range','type': 'boomerang','icon': 'range.boomerang',
		'name':"Boomerang", 'sprite':{'name':"bow",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[	
		
		],

	}
	
	a['crossbow'] = {
		'piece': 'range','type': 'crossbow','icon': 'range.crossbow',
		'name':"Crossbow", 'sprite':{'name':"bow",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}
	
	a['wand'] = {
		'piece': 'magic','type': 'wand','icon': 'magic.wand',
		'name':"Wand", 'sprite':{'name':"wand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}
	
	a['staff'] = {
		'piece': 'magic','type': 'staff','icon': 'magic.staff',
		'name':"Staff", 'sprite':{'name':"wand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}

	a['orb'] = {
		'piece': 'magic','type': 'orb','icon': 'magic.orb',
		'name':"Orb", 'type': 'orb','sprite':{'name':"wand",'sizeMod':1},
		'dmg':{'main':10,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}},
		'boost':[],
		
	}

	for(var i in a){	
		a[i].id = i;
		Equip.creation(a[i]);	
	}
	
	cb.call();
	
	
}); }

Equip = {};

Equip.creation = function(equip){
	equip = Tk.useTemplate(Equip.template(),equip);
	
	equip.color = Equip.creation.color(equip);
	equip.category = Cst.isWeapon(equip.piece) ? 'weapon' : 'armor';
	
	equip.def.ratio = Tk.convertRatio(equip.def.ratio);
	equip.dmg.ratio = Tk.convertRatio(equip.dmg.ratio);

	
	Db.equip[equip.id] = equip;
	
	var item = {
		'name':equip.name,
		'icon':equip.piece + '.' + equip.type,
		'type':'equip',
		'id':equip.id,
		'drop':0,
		'option':[	
			{'name':'Examine Equip','func':'Main.examine','param':['equip',equip.id]},
			{'name':'Change Equip','func':'Actor.equip','param':[equip.id]},
		],
	};
	if(!equip.accountBound && equip.creator !== null)	item.option.push({'name':'Account Bound','func':'Equip.accountBound','param':[equip.id]});
	if(equip.salvagable)	item.option.push({'name':'Salvage','func':'Craft.equip.salvage','param':[equip.id]});
	else item.destroy = 1;
	
	Item.creation(item);
	
	db.upsert('equip',{'id':equip.id}, Equip.compress(equip), db.err);
}

Equip.creation.color = function(w){
	if(w.boost.length === 0) return 'white'; 
	if(w.boost.length <= 2) return 'blue';  
	return 'yellow';  
}

Equip.compress = function(e){
	e = Tk.deepClone(e);
	e.dmg = Equip.compress.element(e.dmg);
	e.def = Equip.compress.element(e.def);
	return e;
}

Equip.uncompress = function(e){
	e.dmg = Equip.uncompress.element(e.dmg);
	e.def = Equip.uncompress.element(e.def);
	return e;
}

Equip.compress.element = function(e){
	for(var i in e.ratio) e.ratio[i] = Tk.round(e.ratio[i],4);
	e.main = Tk.round(e.main,4);
	var r = e.ratio;
	return [e.main,r.melee,r.range,r.magic,r.fire,r.cold,r.lightning];	
}

Equip.uncompress.element = function(r){
	return {
		main:r[0],
		ratio:{
			melee:r[1],
			range:r[2],
			magic:r[3],
			fire:r[4],
			cold:r[5],
			lightning:r[6],	
		}
	}
}
	
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
		'creator':null,
		'accountBound':0,
		'color':'white',
		'salvagable':1,
	}
}

Equip.accountBound = function(key,eid){
	/*
	when account bound =>add 1 bonus
	if self found => all boost become *1.2
	*/
	
	var equip = Db.equip[eid];
	
	if(equip.accountBound){	Chat.add(key,'This equip is already account bound.');	return;	}
	
	Craft.orb.boost(key,equip,1);	//add boost
	
	if(equip.creator === List.all[key].username){
		for(var i in equip.boost)
			equip.boost[i].value *= 1.2;	
	}
	
	
	Item.removeFromDb(equip.id);
	Itemlist.remove(List.main[key].invList,equip.id);
	Chat.add(key,'Equip succesfully account bound.');
	equip.id = Math.randomId();
	equip.accountBound = 1;
	
	Equip.creation(equip);
	Itemlist.add(List.main[key].invList,equip.id);
	
}




