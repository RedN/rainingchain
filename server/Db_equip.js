//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Tk','Db','Init','Itemlist','Chat','Craft','Item','Main','requireDb','Actor'],['Equip']));

var db = requireDb();

Db.equip = {};	//for quest
Init.db.equip = function (cb){
	var a = Db.equip;
	db.find('equip',{},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results)	a[results[i].id] = Equip.uncompress(results[i]);
			

	for(var i in a){	
		a[i].id = i;
		Equip.creation(a[i]);	
	}
	
	cb.call();
	
	
}); }

var Equip = exports.Equip = {};

Equip.creation = function(equip){
	equip = Tk.useTemplate(Equip.template(),equip,true);
	
	equip.color = Equip.creation.color(equip);
	equip.category = CST.isWeapon(equip.piece) ? 'weapon' : 'armor';

	Db.equip[equip.id] = equip;
	
	var item = {
		'name':equip.name,
		'icon':equip.piece + '.' + equip.type,
		'type':'equip',
		'id':equip.id,
		'drop':0,
		'option':[	
			{'name':'Examine Equip','func':Main.examine,'param':['$main','equip',equip.id]},
			{'name':'Change Equip','func':Actor.equip.click,'param':['$actor',equip.id]},
		],
	};
	if(!equip.accountBound && equip.creator !== null)	item.option.push({description:'Improve equip but become untradable.',name:'Account Bound','func':Equip.accountBound,'param':[equip.id]});
	if(equip.salvagable)	item.option.push({'name':'Salvage',description:'Convert into crafting materials.','func':Craft.equip.salvage,'param':[equip.id]});
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

Equip.template = function(){
	return {
		name:"Hello Kitty",
		piece:'pants',
		type:'chain',
		icon:'pants.chain',
		lvl:0,
		def:{main:0,ratio:{melee:1,range:1,magic:1,fire:1,cold:1,lightning:1}},	
		dmg:{main:0,ratio:{melee:1,range:1,magic:1,fire:1,cold:1,lightning:1}},		
		boost:[],
		orb:{upgrade:{amount:0,bonus:1},boost:{amount:0,bonus:0,history:[]}},
		creator:null,
		accountBound:0,
		color:'white',
		salvagable:1,
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



