if(typeof Db === 'undefined') Db = {};
Db.quest = {};
var questList = [
	'Qtutorial',
	'QquestId',
];

Init.db.quest = function(){
	
	//Quest are added from the quest folder
	for(var i in questList){
		Db.quest[questList[i]] = require('./quest/'+questList[i]).quest;
	}
	
	//Note: List.main[key].quest[id] only has variable
	var questVar = {};
	for(var i in Db.quest){
		Db.quest[i] = Quest.creation(Db.quest[i]);
		questVar[i] = deepClone(Db.quest[i].variable);
	}
	Main.template.quest = {};
	Main.template.quest = new Function('return ' + stringify(questVar));	
	for(var i in questVar)	Main.template.quest[i] = new Function('return ' + stringify(questVar[i]));	
		
}

Quest = {};

Quest.creation = function(q){
	q = useTemplate(Quest.template(),q)

	//Variable
	q.variable = useTemplate(Quest.template.variable(),q.variable);
	for(var j in q.bonus){ q.variable.bonus[j] = 0; }	//0:non-active, 1:active
	for(var j in q.requirement){ q.variable.requirement += '0'; }	//0:non-met, 1:met
	
	if(!server) return q 
	
	Db.dialogue[q.id] = {};
	for(var i in q.dialogue){
		Db.dialogue[q.id][i] = q.dialogue[i];		
	}
	
	for(var i in q.mapAddOn){
		Db.map[i].addon[q.id] = q.mapAddOn[i];
	}
	
	Db.enemy[q.id] = {};
	for(var i in q.enemy){
		Db.enemy[q.id][i] = q.enemy[i];
	}
	
	for(var i in q.item){
		q.item[i].id = q.id+'-'+i;
		Item.creation(q.item[i]);
	}
	
	for(var i in q.equip){
		q.equip[i].id = q.id+'-'+i;
		Equip.creation(q.equip[i]);
	}
	
	for(var i in q.ability){
		q.ability[i].id = q.id+'-'+i;
		Ability.creation(q.ability[i]);
	}
	
	for(var i in q.plan){
		q.plan[i].id = q.id+'-'+i;
		Plan.creation(q.plan[i]);
	}
	return q;
}

Quest.template = function(){
	return {
		id:Math.random(),
		name:'Default Quest',
		icon:'skill.melee',
		reward:{'stat':'dmg-fire-+','value':[0.05,0.10]},
		rewardMod:0.5,
		description:"Default Description",
		variable:{},
		requirement:[],		
		hintGiver:function(key,mq){ return 'None';},
		dialogue:{},
		bonus:{},
		mapAddOn:{},
		map:{},
		item:{}, 
		equip:{},
		enemy:{},
		ability:{},
		plan:{},
	};
}

Quest.template.variable = function(){
	return {
		hint:'There is no hint.',
		rewardTier:'0%',
		reward:null,
		complete:0,
		started:0,
		bonusSum:1,
		deathCount:0,
		bonus:{},
		requirement:''
	};
}








