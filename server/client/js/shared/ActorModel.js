//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Sprite','Actor'],['ActorModel']));
if(SERVER) eval('var ActorModel;');

(function(){ //}
	
ActorModel = exports.ActorModel = function(id,info){
	var tmp = {
		modelId:id,
		alwaysActive:0,
		type:'npc',
		combatType:'npc',
		mastery:Actor.Mastery(),
		awareNpc:0,
		hp:1000,	
		hpMax:1000,
		hpRegen:1,
		mana:100,
		manaMax:100,
		manaRegen:10/25,
		abilityList:Actor.AbilityList(),
		friction:CST.FRICTIONNPC,
		bounce:1,			//mod
		move:1,
		model:"Qsystem-bat",   //for enemy
		lvl:0,
		name:"Goblin",     //visible name
		minimapIcon:'color.red',     //icon used for minimap
		quest:'',
		sprite:Sprite(Actor.DEFAULT_SPRITENAME,1),
		moveRange:Actor.MoveRange(),
		useUpdateInput:1, 		//generate its own input	(ex: pushable dont but still move)
		reflect:CST.element.template(0), //% reflected
		nevercombat:0,
		boss:'',
		ability:Actor.Ability(),
		
		globalDef:1,
		globalDmg:1,   //global modifier
		aim:0,       //difference between mouse and actually bullet direction
		atkSpd:1,	
		ghost:0,
		nevermove:0,
		maxSpd:CST.NPCSPD,	
		acc:12,
		immune:{},
		abilityAi:Actor.AbilityAi(),	
		
		waypoint:null, 		//right click:setRespawn
		combat:1,
		damageIf:'player',
		damagedIf:'true',
		targetIf:'player',  //condition used by monsters to find their target. check targetIfList
		statusResist:Actor.StatusResist(),
		
		//BAD
		combatContext:Actor.CombatContext(),		//only there cuz need it to access ability... -.-
		flag:Actor.Flag(),
		globalMod:null,
		hideOptionList:false,
	}
	for(var i in info) tmp[i] = info[i];
	
	if(!SERVER) return tmp;
	
	DB[id] = tmp;
	
	return tmp;
}
var DB = ActorModel.DB ={};

ActorModel.init = function(){
	DB['player'] = ActorModel('player',{
		type:"player",
		combatType:'player',
		damageIf:'npc',
		targetIf:'npc',	//important for summon
		awareNpc:1,
		alwaysActive:1,
		minimapIcon:'color.yellow',
		pickRadius:250,
		useUpdateInput:false,
		maxSpd:CST.NPCSPD*2,
		friction:CST.FRICTION,
	});
}
ActorModel.get = function(id){
	return DB[id] || null;
}



})();