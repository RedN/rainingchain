//Skill
Skill = {};

Skill.addExp = function(key,skill,amount,bonus){
	var player = List.all[key];
	var mod = bonus === false ? 1 : player.bonus.exp[skill];
	amount = typeof amount !== 'function' ? amount : amount(player.skill.lvl[skill],key);
	player.skill.exp[skill] += amount * mod;		
	Skill.updateLvl(key,skill);
	LOG(2,key,'addExp',skill,amount);
}

Skill.addExp.bulk = function(key,obj,bonus){
	for(var i in obj){
		Skill.addExp(key,i,obj[i],bonus);
	}
}

Skill.updateLvl = function(key,sk){
	var player = List.all[key];
	var main = List.main[key];
	
	if(!sk) sk = Cst.skill.list;
	sk = arrayfy(sk);
	
	for(var i in sk){
		var skill = sk[i];
		if(player.skill.exp[skill] >= Cst.exp.list[player.skill.lvl[skill]+1]){
			var newLvl = binarySearch(Cst.exp.list,player.skill.exp[skill]);
			
			var lvlDiff = newLvl-player.skill.lvl[skill];
				
			player.skill.lvl[skill] = newLvl;
			Skill.lvlUp(key,skill);
			
		}
	}
}

Skill.getLvlViaExp = function(exp){
	return binarySearch(Cst.exp.list,exp)
}


Skill.lvlUp = function(key,skill){
	Chat.add(key,'You are level ' + List.all[key].skill.lvl[skill] + ' in ' + skill.capitalize() + '!');
	LOG(0,key,'Skill.lvlUp',skill,List.all[key].skill.lvl[skill]);
}

Skill.unlockableContent = function(key){
	var total = Skill.getTotalLvl(key);
	//TOFIX
	switch (total){
		case 10: Chat.add(key,"You have unlocked the Passive Grid! You can access it via the Equip Tab. The Passive Grid allows you to customize your character when you level up."; List.main[key].hideHUD.passive = 0;
		case 15: Chat.add(key,"The offensive and defensive windows now display the complete Elemental Dmg and Def formula! You can access it via the Equip Tab."; List.main[key].hideHUD.advancedStat = 0;
		case 20: Chat.add(key,"You can now increase the quest difficulty by activating Quest Challenges via the Quest Window."; List.main[key].hideHUD.questChallenge = 0;
		case 25: Chat.add(key,"You can now increase the quest difficulty by activating Quest Challenges via the Quest Window."; List.main[key].hideHUD.questChallenge = 0;
	
	}
	
	

}

Skill.testLvl = function(key,sk,lvl){
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
	'tree-red':{
		category:'tree',
		variant:'red',
		lvl:0,
		skill:'woodcutting',
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
SkillPlot.creation = function(data){	//xym, type, num, quest
	var plot = Db.skillPlot[data.type];
	
	var id = Actor.creation({'xym':data.xym,
		"category":plot.category,"variant":plot.variant,"extra":{
			skillPlot:{
				quest:data.quest,
				num:data.num,
				type:data.type,
			},
			viewedIf:function(key,eid){
				if(List.all[key].type !== 'player') return true;
				var plot = List.all[eid].skillPlot;
				return List.main[key].quest[plot.quest].skillPlot[plot.num] == 0;			
			}		
		}
	});
	Db.quest[data.quest].skillPlot.push(id);
	
	Actor.creation({'xym':data.xym,
		"category":plot.category,"variant":"down","extra":{
			skillPlot:{
				quest:data.quest,
				num:data.num,
				type:'down',
			},
			viewedIf:function(key,eid){
				if(List.all[key].type !== 'player') return true;
				var plot = List.all[eid].skillPlot;
				return List.main[key].quest[plot.quest].skillPlot[plot.num] == 1;			
			},
			
		}
	});

}







