Init.cycle = function(){
	var nextDailyUpdate = new Date(Date.nowDate()).getTime() + Cst.DAY - 60000;	
	var daysTilNextWeekUpdate = (11-new Date(nextDailyUpdate).getDay())%7;
	var nextWeeklyUpdate = daysTilNextWeekUpdate * Cst.DAY + nextDailyUpdate + 10000;
	
	var dailyFunc = function(){
		Cycle.daily.passive();
		nextDailyUpdate += Cst.DAY;
		setTimeout(dailyFunc,Cst.DAY);
	}
	
	var weeklyFunc = function(){
		db.update('account',{},{'$set':{timePlayedThisWeek:0}},db.err);
	
		nextWeeklyUpdate += Cst.DAY*7;
		setTimeout(weeklyFunc,Cst.DAY*7);
	}
	
	setTimeout(dailyFunc,nextDailyUpdate-Date.now());
	setTimeout(weeklyFunc,nextWeeklyUpdate-Date.now());

}




Cycle = {};
Cycle.daily = {};
Cycle.daily.passive = function(day){
	var day = Date.nowDate();
	db.upsert('passiveCount',{date:day},Db.passiveGrid.count[Date.nowDate()],db.err);

}
Cycle.daily.quest = function(key){
	var mq = List.main[key].quest;
	for(var i in mq){
		mq[i].bonus.cycle += 0.02;
	}	
}



