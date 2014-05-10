var db = requireDb();

Init.cycle = function(){
	Cycle.day.timeNext = new Date(Date.nowDate()).getTime() + Cst.DAY - 60000;	
	var daysTilNextWeekUpdate = (11-new Date(Cycle.day.timeNext).getDay())%7;
	Cycle.week.timeNext = daysTilNextWeekUpdate * Cst.DAY + Cycle.day.timeNext + 10000;
	
	if(Cycle.day.timeNext-Date.now() > 0){	//otherwise server no ready
		setTimeout(Cycle.day,Cycle.day.timeNext-Date.now());
		setTimeout(Cycle.week,Cycle.week.timeNext-Date.now());
	}
}


Cycle = {};
Cycle.day = function(){
	Cycle.day.passive();
	
	//Set new
	Cycle.day.timeNext += Cst.DAY;
	setTimeout(Cycle.day,Cst.DAY);
}

Cycle.day.passive = function(day){
	var day = Date.nowDate();
	db.upsert('passiveCount',{date:day},Db.passiveGrid.count[day],db.err);
}
Cycle.day.quest = function(key){
	var mq = List.main[key].quest;
	for(var i in mq){
		mq[i]._bonus.cycle.item += 0.02;
		mq[i]._bonus.cycle.passive += 0.04;
		mq[i]._bonus.cycle.exp += 0.08;
	}
}

Cycle.week = function(){
	db.update('account',{},{'$set':{timePlayedThisWeek:0}},db.err);
	
	//Set new
	Cycle.weekly.timeNext += Cst.DAY*7;
	setTimeout(weeklyFunc,Cst.DAY*7);
}




