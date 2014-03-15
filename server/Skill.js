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

Skill.addExp.bulk = function(key,array,bonus){
	for(var i in array){
		Skill.addExp(key,array[i][0],array[i][0],bonus);
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
			main.passivePt += lvlDiff;
			
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

Skill.testLvl = function(key,sk,lvl){
	var player = List.all[key];
	
	if(typeof sk !== 'object'){	var skill = {};	skill[sk] = lvl;	} 
	else {var skill = sk;}
	
	for(var i in skill){
		if(player.skill.lvl[i] < skill[i]) return false;		
	}
		
	return true;
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







