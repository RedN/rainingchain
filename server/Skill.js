//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Tk','Server','Chat'],['Skill']));

var Skill = exports.Skill = {};

//TODO: same than itemlist, format function
Skill.addExp = function(key,skill,amount,globalmod){
	if(typeof skill === 'object') Skill.addExp.action(key,skill,amount || 1);
	else {
		var tmp = {}; tmp[skill] = amount || 0;
		Skill.addExp.action(key,tmp,globalmod || 1);
	} 
	List.all[key].flag['skill,exp'] = 1;
}



Skill.addExp.action = function(key,obj,globalmod){
	var player = List.all[key];
	for(var i in obj){
		var amount = typeof obj[i] !== 'function' ? obj[i] : obj[i](player.skill.lvl[i],key);
		amount *= globalmod;
		amount = Math.round(amount);
		if(isNaN(amount)) return ERROR(4,'exp given is nan');
		player.skill.exp[i] += amount;		
		Skill.updateLvl(key,i);
		Server.log(2,key,'addExp',i,amount);
	}
}


Skill.updateLvl = function(key,sk){
	var ps = List.all[key].skill;
	var main = List.main[key];
	
	if(!sk) sk = CST.skill;	//if no sk, update all skills
	sk = Tk.arrayfy(sk);
	
	for(var i in sk){
		var s = sk[i];
		if(ps.exp[s] >= CST.exp[ps.lvl[s]+1]){
			var newLvl = Skill.getLvlViaExp(ps.exp[s]);			
			var lvlDiff = newLvl-ps.lvl[s];
			
			ps.lvl[s] = newLvl;
			Skill.lvlUp(key,s);
		}
	}
}

Skill.getLvlViaExp = function(exp){
	if(isNaN(exp)) return ERROR(4,'exp is NaN');
	return Tk.binarySearch(CST.exp,exp)
}


Skill.lvlUp = function(key,skill){
	var sk = List.all[key].skill;
	Chat.add(key,'You are now level ' + sk.lvl[skill] + ' in ' + skill.capitalize() + '!');
	
	if(['melee','range','magic'].have(skill)) Chat.add(key,'You now deal more damage in ' + skill.capitalize() + '.');
	
	Server.log(1,key,'Skill.lvlUp',skill,sk.lvl[skill]);
	Skill.applyLvlDmgBoost(key);
	List.all[key].flag['skill,lvl'] = 1;
	
	if(List.main[key].contribution.reward.broadcastAchievement > 0){
		List.main[key].contribution.reward.broadcastAchievement--;
		Chat.broadcast(List.all[key].name.q() + ' is now level ' + sk.lvl[skill] + ' in ' + skill.capitalize() + '!'); 
	}
}



Skill.unlockableContent = function(key){
	var total = Skill.getTotalLvl(key);
	var m = List.main[key];
	
	switch (total){
		case 10: Chat.add(key,"You have unlocked the Passive Grid! You can access it via the Equip Tab. The Passive Grid allows you to customize your character when you level up."); m.hideHUD.passive = 0; break;
		case 15: Chat.add(key,"The offensive and defensive windows now display the complete Elemental Dmg and Def formula! You can access it via the Equip Tab."); m.hideHUD.advancedStat = 0; break;
		case 20: Chat.add(key,"You can now increase the quest difficulty by activating Quest Challenges via the Quest Window."); m.hideHUD.questChallenge = 0; break;
		case 25: Chat.add(key,"You can now use Quest Orbs to increase your quest reward via the Quest Window."); m.hideHUD.questOrb = 0; break;
		case 30: Chat.add(key,"You can now use Upgrade Orbs to improve your equipment."); m.hideHUD.equipOrb = 0; break;
		case 40: Chat.add(key,"You can now use Upgrade Orbs to improve your abilities."); m.hideHUD.advancedAbility = 0; break;
	}
	
}

Skill.testLvl = function(key,sk,lvl){	//for req
	var player = List.all[key];
	
	if(typeof sk !== 'object'){	var skill = {};	skill[sk] = lvl;	} 
	else {var skill = sk;}
	
	for(var i in skill){
		if(player.skill.lvl[i] < skill[i]) return false;		
	}
		
	return true;
}


Skill.getTotalLvl = function(key){
	var sum = 0;
	for(var i in List.all[key].skill.lvl)
		sum += List.all[key].skill.lvl[i];
	return sum;
}

Skill.applyLvlDmgBoost = function(key){
	var act = List.all[key];	
	var boost = Actor.getCombatLevelDmgMod(act);
	Actor.permBoost(act,'applyLvlDmgBoost',[{stat:'globalDmg',value:boost,type:'***'}]);
}



Db.skillPlot = {
	'tree-red':{
		model:'tree-red',
		downModel:'tree-down',
		lvl:0,
		skill:'woodcutting',
		exp:100,
		getSuccess:function(lvl){
			return true;	
		},
		item:{
			'wood-0':0.9,
			'ruby-0':0.05,
			'sapphire-0':0.025,
			'topaz-0':0.025,
		},
	},
	'rock-bronze':{
		model:'rock-bronze',
		downModel:'rock-down',
		lvl:0,
		skill:'mining',
		exp:100,
		getSuccess:function(lvl){
			return true;	
		},
		item:{
			'metal-0':0.9,
			'ruby-0':0.025,
			'sapphire-0':0.05,
			'topaz-0':0.025,		
		},
	},
	'hunt-squirrel':{
		model:'hunt-squirrel',
		downModel:'hunt-down',
		lvl:0,
		skill:'trapping',
		exp:100,
		getSuccess:function(lvl){
			return true;	
		},
		item:{
			'bone-0':0.9,
			'ruby-0':0.025,
			'sapphire-0':0.025,
			'topaz-0':0.05,				
		},
	},
	'Qtutorial-tree-red':{	//sketchy
		model:'tree-red',
		downModel:'tree-down',
		lvl:0,
		skill:'woodcutting',
		exp:100,
		getSuccess:function(lvl){
			return true;	
		},
		item:{
			'Qtutorial-resource':1,
		},
	},
}










