function updateInput(){
	updateSpeed();
	updateBonusExp();
	updateIncomePh();
	updateStartEndExp();
	updateVisibleLvl();
	
	updateWantedList(); 
	updateBoostList();
	//updateExcludeList();



}

function updateVisibleLvl(){
	var lvl = visibleInput.value;
	if(isNaN(Number(lvl))){
		lvl = 0;		
	} 
	visibleInput.value = Number(lvl);
	visibleLevel = visibleInput.value;

}
function updateSpeed(){
	var lvl = speedInput.value;
	if(isNaN(Number(lvl))){
		lvl = 90;		
	} 
	lvl = Math.max(0,Math.min(100,Number(lvl)));
	speedFact = lvl;
	speedInput.value = lvl;
}

function updateBonusExp(){
	var bonus = bonusExpInput.value;
	if(isNaN(Number(bonus))){
		bonus = 3;		
	} 
	bonus = Math.max(0,Math.min(10000,Number(bonus)));
	bonusExpFact = bonus;
	bonusExpInput.value = bonus;
}

function updateWantedList(){
	headerWanted = [];
	var array = $(":checked.headerInput");
	array.each(
		function(i) {
			headerWanted.push(array[i].value);	
		}
	);
	
	headerWanted99 = [];
	var array = $(":checked.headerInput99");
	array.each(
		function(i) {
			headerWanted99.push(array[i].value);	
		}
	);
}

function updateIncomePh(){
	var val = incomePhInput.value;
	val = val.replace(/[^\d.]/g, "");
	if(val <= 0){ val = 1000000; }
	incomePhInput.value = formatNum(val);
	RincomePh = val;
}

function updateStartEndExp(){
	//Start
	var start = startExpInput.value;
	start = start.replaceAll(',','');
	
	if(!isNaN(Number(start))){
		start = Number(start);
		start = Math.max(0,start);
		
		if(start <= 99 && start % 1 == 0){ start = lvlList[start]; }
	} else {
		var bool = true;
		
		if(start.length > 15){ bool = false; }
		var test = start.replace(/[|&;$%@"<>()+,]/g, "");
		if(test != start){ bool = false; }
	
		if(bool){getExp(start); start = 0; } //temp 
		else {start = 0;}
	}
	
	start = Math.max(0,Math.min(start,200000000));
	startExp = start;
	startExpInput.value = formatNum(startExp);
	
	
	//End
	var end = endExpInput.value;
	end = end.replaceAll(',','');
	
	if(!isNaN(Number(end))){
		end = Number(end);
		end = Math.max(0,end);
		
		if(end <= 99 && end % 1 == 0){ end = lvlList[end]; }
		
	} else { end = lvlList[99]; }
	
	end = Math.max(start,Math.min(end,200000000));
	endExp = end;
	endExpInput.value = formatNum(endExp);
}

function updateBoostList(){
	methodList = deepClone(methodDb);
		
	var boost = {};
	var array = $(":checked.boostInput");
	array.each(
		function(i) {
			boost[array[i].value] = 1;
		}
	);
	
	for(var i in boost){
		for(var j in methodList){
			for(var k in methodList[j].boost){
				var name = methodList[j].boost[k];
				if(name == i){
					methodList[j] = boostList[methodList[j].boost[k]].func(methodList[j]);
				}
			}
		
		}
	}
	
	for(var i in methodList){
		methodList[i].actionPh *= speedFact /100;
	}
	for(var i in methodList){
		methodList[i].expPa[0] *= 1 + bonusExpFact /100;
	}
}

/*
function updateExcludeList(){
	var array = $(".excludeInput");
	array.each(
		function(i){
			excludeList[array[i].value] = array[i].checked;
			console.log(array[i].checked);			
		}
	);
}
*/









