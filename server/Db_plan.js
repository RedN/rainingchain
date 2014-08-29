//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Main','Actor','Db','Init','Tk','Server','Chat','Itemlist','Craft','Item','Skill','requireDb'],['Plan']));
var db = requireDb();
Init.db.plan = function(cb){
	Db.plan = {};
	var a = Db.plan;

	db.find('plan',{},{'_id':0},function(err, results) { if(err) throw err
		for(var i in results)	a[results[i].id] = results[i];
	
	
		a['randomArmor'] = {
			category:'equip',
			req:{item:[],skill:{}},
		};
		a['Qtutorial-bow'] = {
			category:'equip',
			piece:'weapon',	
			type:'bow',		
			req:{item:[['Qtutorial-resource',2]],skill:{}},
			definitive:1,
			quest:'Qtutorial',
			drop:0,
			salvage:0,
			upgrade:0,
		};
		
		a['randomWeapon'] = {
			category:'equip',
			piece:'weapon',	
			type:'sword',		
			req:{item:[],skill:{}},
		};
		
		a['randomWeapon2'] = {
			category:'equip',
			piece:'weapon',	
			type:'wand',		
			req:{item:[],skill:{}},
		};
		
		for(var i in Db.plan){
			Db.plan[i].id = i;
			Db.plan[i].definitive = 1;
			Plan.creation(Db.plan[i]);
		}
		cb();
	})
}
	
var Plan = exports.Plan = {};

Plan.creation = function(preplan){
	//seed: lvl, category,[ piece, type, rarity, quality,]
	//extra: definitive, minBoost, maxBoost
	
	var plan = Tk.useTemplate(Plan.template(),preplan,true);
	if(plan.category === 'equip' || plan.category === 'weapon' || plan.category === 'armor') 
		plan = Plan.template.equip(plan);
	
	Db.plan[plan.id] = plan;
	Item.creation({
		id:plan.id,
		name:plan.name,
		icon:plan.icon,
		quest:plan.quest,
		drop:0,
		trade:0,
		option:[	
			{'name':'Examine','func':Main.examine,'param':['$main','plan',plan.id]},
			{'name':'Craft Equip','func':Plan.use,'param':[plan.id]},
			{'name':'Upgrade Tier',description:'Improve plan but increase items required.','func':Plan.upgrade.click,'param':[plan.id]},
			{'name':'Salvage',description:'Convert into crafting materials.','func':Plan.salvage,'param':[plan.id]},
		]
	});
		
	db.upsert('plan',{'id':plan.id}, plan, db.err);
	
	if(plan.definitive){ db.upsert('plan',{'id':plan.id}, plan, db.err); return plan.id; }
	
	//Lvl Rarity quality
	plan.lvl = Math.floor(plan.lvl * (1 + 0.1*Math.randomML()));	//aka lvl += 10
	plan.rarity = plan.rarity * Math.random() * 0.5 + Math.randomML();	//if not definitive, then rarity&quality is a mod.
	plan.quality = plan.quality * Math.random() * 0.5 + Math.randomML();	
	
	plan.lvl = plan.lvl.mm(0);
	plan.rarity = plan.rarity.mm(0);	
	plan.quality = plan.quality.mm(0);	
	
	
	var num = Math.random();
	if(num < 0.2){ plan.minAmount = 1; plan.minAmountOriginal = 1; }
	if(num < 0.05){ plan.minAmount = 2; plan.minAmountOriginal = 2; }
	if(num < 0.01){ plan.minAmount = 3; plan.minAmountOriginal = 3; }
	
	Plan.setColor(plan);
	
	//Requirements
	plan = Plan.creation.req(plan);	
	
	plan.definitive = 1;
	
	db.upsert('plan',{'id':plan.id}, plan, db.err);
	return plan.id;
}

Plan.creation.simple = function(key){
	var lvl = typeof key === 'number' ? key : (typeof key === 'string' ?  Actor.getCombatLevel(List.all[key]) : 0);

	return Plan.creation({
		'rarity':Math.random(),
		'quality':Math.random(),
		'lvl':lvl,
		'category':'equip',
		'minAmount':0,
		'maxAmount':6,
	});
}

Plan.setColor = function(plan){
	if(plan.minAmount === 0){ plan.color = 'white'; return; }
	if(plan.minAmount <= 2){ plan.color = 'blue'; return ; }
	plan.color = 'yellow';
}

Plan.creation.req = function(plan){
	var lvl = plan.lvl;
	var rlvl = Math.floor(lvl/20);
	
	//armor
	if(plan.type === 'metal'){
		plan.req.item = [['metal-'+rlvl,10]];
		if(lvl) plan.req.skill = {metalwork:lvl};
	} else if(plan.type === 'wood'){
		plan.req.item = [['wood-'+rlvl,10]];
		if(lvl) plan.req.skill = {woodwork:lvl};
	} else if(plan.type === 'bone'){
		plan.req.item = [['bone-'+rlvl,10]];
		if(lvl) plan.req.skill = {leatherwork:lvl};
	} else if(plan.type === 'ruby' || plan.type === 'sapphire' || plan.type === 'topaz'){
		var random = ['metal-','wood-','bone-'].random();
		plan.req.item = [
			[plan.type + '-'+ rlvl,2],
			[random+rlvl,1]
		];
		var lvl08 = (lvl*0.8).r(0);
		if(lvl) plan.req.skill = {metalwork:lvl08,woodwork:lvl08,leatherwork:lvl08};
	} 
	
	if(plan.type === 'mace' || plan.type === 'sword' || plan.type === 'spear'){
		plan.req.item = [['metal-'+rlvl,15]];
		if(lvl) plan.req.skill = {metalwork:lvl};
	} else if(plan.type === 'bow' || plan.type === 'crossbow' || plan.type === 'boomerang'){
		plan.req.item = [['wood-'+rlvl,15]];
		if(lvl) plan.req.skill = {woodwork:lvl};
	} else if(plan.type === 'wand' || plan.type === 'orb' || plan.type === 'staff'){
		plan.req.item = [['bone-'+rlvl,15]];
		if(lvl) plan.req.skill = {leatherwork:lvl};
	}
	
	return plan;
}

Plan.template = function(){
	var id = 'plan-' + Math.randomId();
	return {
		name:'bugged-plan',
		icon:'plan.equip',
		category:'equip',	
		id:id,
		quality:0, 
		lvl:0,
		rarity:0, 
		req:{'skill':{},'item':[[id,1]]},
		name:'Bugged Plan',
		minAmountOriginal:0,
		minAmount:0,
		maxAmount:6,
		color:'white',
		quest:'',
		salvage:true,
		upgrade:true,
	}
}

Plan.template.equip = function(plan){
	if(plan.category === 'weapon' || plan.category === 'armor'){
		plan.piece = plan.piece || CST.equip.piece.random();
		plan.category = 'equip';
	} else plan.piece = plan.piece || CST.equip.piece.random();	//aka category already equip
	
	plan.name = 'Equip Plan';
	plan.icon = 'plan.equip';
	plan.type = plan.type || CST.equip[plan.piece].random(); 
	
	return plan;
}

Plan.template.ability = function(plan){
	ERROR(3,"NO SUPPORT for Plan.template.ability");
	return plan;
}

Plan.use = function(key,id){	//when player tries to use plan
	var plan = typeof id === 'string' ? Db.plan[id] : id;
	if(!plan) return;
	
	var inv = List.main[key].invList;
	
	if(!Plan.test(key,plan.req)) return Chat.add(key,"You don't meet the requirements to use this plan.");
	//
	Itemlist.remove(inv,plan.req.item);
	
	plan.creator = List.all[key].username;
	var itemid = Craft.equip(plan); 
	
	//add exp
	var base = Craft.equip.salvage.getBase(plan).exp;	//{item:2}
	var mod = Craft.equip.salvage.getModExp(plan);	//{metalwork:1}
	for(var i in mod) mod[i] *= base * 2;	//x2 because craft instead of salvaging
	Skill.addExp(key,mod);
	
	Itemlist.remove(inv, id);
	Itemlist.add(inv, itemid);
	db.remove('plan',{'id':plan.id});
	Server.log(3,key,'Plan.use',id,itemid);
	return itemid;
}

Plan.use.ability = function(key,seed){		//quickfix...
	var id = Craft.ability(seed);
	Actor.ability.add(List.all[key],id);
	Itemlist.remove(List.main[key].invList,seed.item);
	Server.log(3,key,'Plan.use.ability',id);
}

Plan.test = function(key,req){	//test requirement
	var inv = List.main[key].invList;
	var lvl = List.all[key].skill.lvl;
	
	for(var i in req.skill) if(lvl[i] < req.skill[i]) return false;	
	for(var i in req.item) if(!Itemlist.have(inv,req.item[i][0],req.item[i][1])) return false;
	
	return true
}

Plan.upgrade = function(plan){
	db.remove('plan',{'id':plan.id});
	plan = Tk.deepClone(plan);
	for(var i in plan.req.item){
		if(i === plan.id) continue;
		plan.req.item[i][1] = Math.round(plan.req.item[i][1] * (0.5*plan.minAmount+2));
	}
	plan.minAmount++;
	Plan.setColor(plan);
	plan.id = Math.randomId();
	plan.definitive = 1;
	Plan.creation(plan);
	return plan.id;
}

Plan.upgrade.click = function(key,pid){
	var plan = Db.plan[pid];
	if(plan.minAmount >= 3 || !plan.upgrade) return Chat.add(key,'You can not longer upgrade this plan.');
	
	var newid = Plan.upgrade(plan);
	Itemlist.remove(List.main[key].invList,pid);
	Itemlist.add(List.main[key].invList,newid);
}

Plan.salvage = function(key,id){
	if(!Db.plan[id].salvage) return Chat.add(key,'You can\'t salvage this plan.');
	Craft.equip.salvage(key,id);
}





































