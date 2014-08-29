//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Combat','Attack','Tk','Init','Main']));
//Enemy
Db.npc = {};
Init.db.npc = function(){
	for(var i in Db.npc){
		Init.db.npc.creation(Db.npc[i],i);			
	}
}

/*
enemy = red
npc = green
good or bad = yellow
quest = blue
grave = purple
boss = skull
*/

Init.db.npc.creation = function(e,id){	//npc models
	e = Tk.useTemplate(Actor.template('npc'),e,1,1);		//ability and abilityList as written in Db.npc 
	
	e = Init.db.npc.creation.ability(e);
	Db.npc[e.id] = e;
	return e;
}
	
Init.db.npc.creation.ability = function(e){	//use abilityList to create custom ability
	if(e.abilityList.normal)	return e;	//aka dont have ability or already set
	/*
	"abilityList":[
		{id:'scratch',aiChance:[0.2,0,0]},
	
	],
	*/
		
	for(var i in e.abilityList){
		e.abilityAi.close[e.abilityList[i].id] = e.abilityList[i].aiChance[0];
		e.abilityAi.middle[e.abilityList[i].id] = e.abilityList[i].aiChance[1];
		e.abilityAi.far[e.abilityList[i].id] = e.abilityList[i].aiChance[2];
		var ability = Combat.getInfo(e.abilityList[i]);
		if(ability){
			var ab = require(ability[0]);
			ab(ability[1],CST.func);
		}
		if(e.abilityList[i].id !== 'Qsystem-idle') Actor.ability.swap(e,e.abilityList[i].id);
	}
	/*for(var i = e.ability.normal.length-1; i >= 0; i--){	//?
		if(!e.ability.normal[i]) e.ability.normal.splice(i,1);
	}*/
	
	e.abilityList = Actor.template.ability(e.abilityList);
	
	return e;
}


