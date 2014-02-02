
if(!server) Init.db.ability = function(){
	Init.db.ability.mod();
	Init.db.ability.orb();
};




Init.db.ability.mod = function(){	//needed by client
	Db.abilityMod = {
		'x2b':{
			'name':'x2 Bullets',
			'info':'Your ability shoots x2 more bullets. Main damage is reduced by 50%.',
			'item':'abilityMod-x2b',
			'func':(function(ab,orb,log){
				var atk = ab.action.param;
				atk.amount *= 2;
				atk.dmg.main /= 1.5;
				return ab;
			})},	
	}
	
	if(!server) return;
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

Init.db.ability.orb = function(){
	//defined here or directly inside Db.ability.template if unique
	Db.abilityOrb = {
		'dmg':{
			'info':'Increases Damage',		
			'func':(function(ab,orb,log){
				var atk = ab.action.param;
				atk.amount *= log;	//bad ? if doesnt have param
				return ab;
			}),
		},
		'none':{
			'info':'Does Nothing',		
			'func':(function(ab,orb,log){
				return ab;
			}),
		},
	}
	
	if(!server) return;
	for(var i in Db.abilityOrb){
		Db.abilityOrb[i].id = i;
	}
	
	
}





