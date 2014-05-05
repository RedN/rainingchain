//Skill
Skill = {};

Skill.addExp = function(key,skill,amount,bonus){
	var player = List.all[key];
	var mod = bonus === false ? 1 : player.bonus.exp[skill];
	amount = typeof amount !== 'function' ? amount : amount(player.skill.lvl[skill],key);
	player.skill.exp[skill] += amount * mod;		
	Skill.updateLvl(key,skill);
	Server.log(2,key,'addExp',skill,amount);
}


Skill.addExp.bulk = function(key,obj,bonus){
	for(var i in obj){
		Skill.addExp(key,i,obj[i],bonus);
	}
}

Skill.updateLvl = function(key,sk){
	var ps = List.all[key].skill;
	var main = List.main[key];
	
	if(!sk) sk = Cst.skill.list;	//if no sk, update all skills
	sk = Tk.arrayfy(sk);
	
	for(var i in sk){
		var s = sk[i];
		if(ps.exp[s] >= Cst.exp.list[ps.lvl[s]+1]){
			var newLvl = Skill.getLvlViaExp(ps.exp[s]);			
			var lvlDiff = newLvl-ps.lvl[s];
			
			ps.lvl[s] = newLvl;
			Skill.lvlUp(key,s);
		}
	}
}

Skill.getLvlViaExp = function(exp){
	return Tk.binarySearch(Cst.exp.list,exp)
}


Skill.lvlUp = function(key,skill){
	var sk = List.all[key].skill;
	Chat.add(key,'You are level ' + sk.lvl[skill] + ' in ' + skill.capitalize() + '!');
	Server.log(1,key,'Skill.lvlUp',skill,sk.lvl[skill]);
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


Db.skillPlot = {
	'treeRed':{
		category:'tree',
		variant:'red',
		lvl:0,
		skill:'woodcutting',
		exp:100,
		chance:function(lvl){
			return 1;			
		},
		item:{
			'wood-0':0.5,
			'leaf-0':0.5,			
		},
	},
}


SkillPlot = {};
SkillPlot.creation = function(data){	//spot, type, num, quest
	var plot = Db.skillPlot[data.type];
	
	//create 2 copy. if not harvest, view up tree. else view down
	var id = Actor.creation({'spot':data.spot,
		"category":plot.category,"variant":plot.variant,"extra":{
			skillPlot:{
				quest:data.quest,
				num:data.num,
				type:data.type,
			},
			viewedIf:function(key,eid){
				if(List.all[key].type !== 'player') return true;
				var plot = List.all[eid].skillPlot;
				return List.main[key].quest[plot.quest]._skillPlot[plot.num] == 0;			
			}		
		}
	});
	Db.quest[data.quest].skillPlot.push(id);
	
	Actor.creation({'spot':data.spot,
		"category":plot.category,"variant":"down","extra":{
			skillPlot:{
				quest:data.quest,
				num:data.num,
				type:'down',
			},
			viewedIf:function(key,eid){
				if(List.all[key].type !== 'player') return true;
				var plot = List.all[eid].skillPlot;
				return List.main[key].quest[plot.quest]._skillPlot[plot.num] == 1;			
			},
			
		}
	});

}







