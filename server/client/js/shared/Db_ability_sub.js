if(!SERVER) Init.db.ability = function(){ Init.db.ability.mod();Init.db.ability.orb();};

Init.db.ability.mod = function(){	//needed by client
	var a = Db.abilityMod = {};
	
	a['x2b'] = {
		'name':'x2 Bullets',
		'description':'Your ability shoots x2 more bullets. Main damage is reduced by 50%.',
		'item':'abilityMod-x2b',
		'func':function(ab,orb,log){	//orb=amount, log=formulaWithAmount
			var atk = ab.action.param;
			atk.amount *= 2;
			atk.dmg.main /= 1.5;
			return ab;
		}
	};	
	
	if(!SERVER) return;
	for(var i in Db.abilityMod){
	
		Item.creation({
			name:Db.abilityMod[i].name,
			icon:'plan.equip',
			option:[	{'name':'Select Mod','func':'Main.abilityModClick','param':[i]} ],
			type:'abilityMod',
			id:Db.abilityMod[i].item,
		});
		
		
	}
	
	
}

Init.db.ability.orb = function(){	//defined here or directly inside Db.ability.template if unique
	var a = Db.abilityOrb = {};	
	a['dmg'] = {
		'name':'+Dmg',
		'description':'Increases Damage',		
		'func':function(ab,orb,log){
			var atk = ab.action.param;
			atk.amount *= log;	//bad ? if doesnt have param
			return ab;
		},
	};
	
	a['none'] = {
		'name':'Nothing',
		'description':'Does Nothing',		
		'func':function(ab,orb,log){
			return ab;
		},
	};
	
	for(var i in Db.abilityOrb){
		Db.abilityOrb[i].id = i;
	}
	
	
}





