//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Quest','Message','Main','Account'],['Cycle']));

var Cycle = exports.Cycle = {};

Cycle.init = function(){
	Cycle.day.timeNext = new Date(Date.nowDate()).getTime() + CST.DAY - 60*1000;	
	var daysTilNextWeekUpdate = (11-new Date(Cycle.day.timeNext).getDay())%7;
	Cycle.week.timeNext = daysTilNextWeekUpdate * CST.DAY + Cycle.day.timeNext + 10000;
	
	if(Cycle.day.timeNext-Date.now() > 0){	//otherwise server no ready
		setTimeout(Cycle.day,Cycle.day.timeNext-Date.now());
		setTimeout(Cycle.week,Cycle.week.timeNext-Date.now());
	}
	
	Quest.updateRating();
}

Cycle.onSignIn = function(key,account){
	if(account.lastSignIn === null || Date.nowDate(account.lastSignIn) !== Date.nowDate()){
		Main.quest.updateCycleBonus(Main.get(key));
		Main.updateDailyTask(Main.get(key));
	}
}

Cycle.day = function(){
	Quest.updateRating();
	
	//Set new
	Cycle.day.timeNext += CST.DAY;
	setTimeout(Cycle.day,CST.DAY);
}



//####################

Cycle.week = function(){
	Account.resetTimePlayedThisWeek();
	
	//Set new
	Cycle.week.timeNext += CST.DAY*7;
	setTimeout(Cycle.week,CST.DAY*7);
}


Cycle.day.updateContribution = function(){

	

}



















