//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
Input = {
	RincomePh:1000000,
	speedFact:90,
	bonusExpFact:3,
	visibleLevel:0,
	excludeList:{},
	startExp:CST.skillList[1],
	endExp:CST.skillList[99],
	sortSign:1,
	sortBy:"Level",
	minimizeTable:false,
	headerWanted:[],
	headerWanted99:[],
	html:{
		RincomePh:doc.get('incomePhInput'),
		speedFact:doc.get('speedInput'),
		bonusExpFact:doc.get('bonusExpInput'),
		visibleLevel:doc.get('visibleInput'),
		startExp:doc.get('startExpInput'),
		endExp:doc.get('endExpInput'),
	}
};

Input.update = function(){
	Input.update.speedFact();
	Input.update.bonusExpFact();
	Input.update.RincomePh();
	
	Input.update.startEndExp();
	
	Input.update.visibleLevel();
	
	Input.update.headerWanted(); 
	Input.update.applyBoost();	//act as filter, also does speedFact and bonus
	//updateExcludeList();



}

Input.update.visibleLevel = function(){
	var lvl = +Input.html.visibleLevel.value;
	lvl = lvl || 0;
	Input.visibleLevel.value = lvl;
	Input.html.visibleLevel.value = lvl;

}

Input.update.speedFact = function(){
	var lvl = Input.html.speedFact.value;
	if(isNaN(Number(lvl))){
		lvl = 90;		
	} 
	lvl = Math.max(0,Math.min(100,Number(lvl)));
	Input.speedFact = lvl;
	Input.html.speedFact.value = lvl;
}

Input.update.bonusExpFact = function(){
	var bonus = Input.html.bonusExpFact.value;
	if(isNaN(Number(bonus))){
		bonus = 3;		
	} 
	bonus = Math.max(0,Math.min(10000,Number(bonus)));
	Input.bonusExpFact = bonus;
	Input.html.bonusExpFact.value = bonus;
}

Input.update.headerWanted = function(){
	Input.headerWanted = [];
	var array = $(":checked.headerInput");
	array.each(	function(i) { Input.headerWanted.push(array[i].value);});
	
	Input.headerWanted99 = [];
	var array = $(":checked.headerInput99");
	array.each(function(i) { Input.headerWanted99.push(array[i].value);});
}

Input.update.RincomePh = function(){
	var val = Input.html.RincomePh.value;
	val = val.replace(/[^\d.]/g, "");
	if(val <= 0){ val = 1000000; }
	Input.html.RincomePh.value = Tk.formatNum(val);
	Input.RincomePh = val;
}

Input.update.startEndExp = function(){
	//Start
	var start = Input.html.startExp.value;
	start = start.replaceAll(',','');
	
	if(!isNaN(Number(start))){
		start = Number(start);
		start = Math.max(0,start);
		
		if(start <= 99 && start % 1 == 0){ start = CST.lvlList[start]; }
	} else {
		if(start.length < 15 && start === start.replace(/[|&;$%@"<>()+,]/g, "")){	//doing request to server to get exp for player name
			Input.requestPlayerExp(start);
		}
		 start = 0;
	}
	
	start = Math.max(0,Math.min(start,200000000));
	Input.startExp = start;
	Input.html.startExp.value = Tk.formatNum(start);
	
	
	//End
	var end = Input.html.endExp.value;
	end = end.replaceAll(',','');
	
	if(!isNaN(Number(end))){
		end = Number(end);
		end = Math.max(0,end);
		
		if(end <= 99 && end % 1 == 0){ end = CST.lvlList[end]; }
		
	} else { end = CST.lvlList[99]; }
	
	end = Math.max(start,Math.min(end,200000000));
	Input.endExp = end;
	Input.html.endExp.value = Tk.formatNum(end);
}

Input.update.applyBoost = function(){	//act as filter
	methodList = Tk.deepClone(Skill.methodDb);
		
	var boost = {};
	var array = $(":checked.boostInput");
	array.each(	function(i) {boost[array[i].value] = 1;	});
	
	for(var i in boost){
		for(var j in methodList){
			for(var k in methodList[j].boost){
				var name = methodList[j].boost[k];
				if(name == i){
					methodList[j] = Skill.boostList[methodList[j].boost[k]].func(methodList[j]);
				}
			}
		
		}
	}
	
	for(var i in methodList){
		methodList[i].actionPh *= Input.speedFact /100;
	}
	for(var i in methodList){
		methodList[i].expPa[0] *= 1 + Input.bonusExpFact /100;
	}
}


Input.changeSort = function (newSort){
	Input.sortBy = newSort;
	Input.sortSign *= -1;
	Update();
}


Input.requestPlayerExp = function(name){
	$.ajax( {
		url: '/getExp',
		data: {name:name},
		type: 'POST',
		success: function(data) {
			if(data == 'error'){
				Input.startExp = CST.skillList[1];				
			} else {
				var obj = JSON.parse(data);
				Input.startExp = obj[Skill.name];
				Input.html.startExp.value = Tk.formatNum(obj[Skill.name]);
				Update();				
			}		
		}
	});
}



Input.changeSkill = function (){
	Init();	
	document.getElementById('skillImg').src = '/rs/img/skill/' + Skill.id + '.png';
}

Input.help = function (){
	document.getElementById('helpDiv').hidden = !document.getElementById('helpDiv').hidden;
}


