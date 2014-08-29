//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Init','Quest','Tk','Chat','requireDb'],['Cycle']));

var db = requireDb();

Init.cycle = function(){
	Cycle.day.timeNext = new Date(Date.nowDate()).getTime() + CST.DAY - 60*1000;	
	var daysTilNextWeekUpdate = (11-new Date(Cycle.day.timeNext).getDay())%7;
	Cycle.week.timeNext = daysTilNextWeekUpdate * CST.DAY + Cycle.day.timeNext + 10000;
	
	if(Cycle.day.timeNext-Date.now() > 0){	//otherwise server no ready
		setTimeout(Cycle.day,Cycle.day.timeNext-Date.now());
		setTimeout(Cycle.week,Cycle.week.timeNext-Date.now());
	}
	
	Cycle.day.questRating();
	Cycle.day.task.init();
}


var Cycle = exports.Cycle = {};
Cycle.day = function(){
	Cycle.day.passive();
	Cycle.day.questRating();	//TOFIX probable reason y server crash
	
	//Set new
	Cycle.day.timeNext += CST.DAY;
	setTimeout(Cycle.day,CST.DAY);
}

Cycle.day.passive = function(day){
	return;	//TOFIX, should set value of  Db.passiveGrid.count[day] before?
	var day = Date.nowDate();
	db.upsert('passiveCount',{date:day},Db.passiveGrid.count[day],db.err);
}
Cycle.day.quest = function(key){	//triggered upon login
	var mq = List.main[key].quest;
	for(var i in mq){
		mq[i]._bonus.cycle.item = Math.max(mq[i]._bonus.cycle.item,1);	//incase lowered by completing it many times
		mq[i]._bonus.cycle.exp = Math.max(mq[i]._bonus.cycle.exp,1);
		mq[i]._bonus.cycle.passive = Math.max(mq[i]._bonus.cycle.passive,1);
		
		mq[i]._bonus.cycle.item += 0.02;
		mq[i]._bonus.cycle.exp += 0.04;
		mq[i]._bonus.cycle.passive += 0.08;
	}
}

Cycle.day.task = function(key){
	var main = List.main[key];
	if(main.dailyTask.length >= 3)	main.dailyTask.shift();
	
	var task = Cycle.day.task.list[Date.nowDate()];
	if(!task) return ERROR(4,'no task for',Date.nowDate());
	main.dailyTask.push(Tk.deepClone(task));
	
	Chat.add(key,'Complete this Daily Challenge for massive rewards: ' + task.description);
}

Cycle.day.task.list = {};

Cycle.day.task.generate = function(){
	var time = Date.now();
	for(var i = 0 ; i < 100; i++){
		do var quest = Db.quest.randomAttribute();
		while(!Db.quest[quest].dailyTask)
		
		var challenge = Db.quest[quest].challenge.randomAttribute() || '';
		Cycle.day.task.list[Date.nowDate(time)] = {quest:quest, challenge:challenge}
		time += CST.DAY;
	}
}

Cycle.day.task.init = function(){
	Cycle.day.task.generate();	//cuz too lazy to do myself

	for(var i in Cycle.day.task.list){
		var t = Cycle.day.task.list[i];
		t.date = i;
		if(t.description) continue;
		if(t.quest){
			var q = Db.quest[t.quest];
			if(t.challenge) t.description = 'Complete the quest ' + q.name + ' with the challenge ' + q.challenge[t.challenge].name + ' active.';
			else t.description = 'Complete the quest ' + q.name + '.';
		}
	}	
}

Cycle.week = function(){
	db.update('account',{},{'$set':{timePlayedThisWeek:0}},db.err);
	
	//Set new
	Cycle.week.timeNext += CST.DAY*7;
	setTimeout(Cycle.week,CST.DAY*7);
}

Cycle.day.questRating = function(){
	db.find('main',{},{quest:1},function(err,res){
		for(var j in Db.quest){
			if(!Db.quest[j].inMain) continue;
			var q = Db.quest[j].statistic = Quest.template.statistic();
			for(var i = 0; i < res.length; i++){
				var mq = res[i].quest[j];
				if(!mq) continue;
				if(mq._complete){
					q.amountComplete++;
					q.averageRepeat += mq._complete;
				}
				if(mq._started) q.amountStarted++;
				if(mq._rating){
					q.ratingGlobal += mq._rating;
				}
			}
			q.ratingGlobal /= q.amountComplete || 1;
			q.averageRepeat /= q.amountComplete || 1;
			
			
		}		
	});
}

Cycle.day.updateContribution = function(){

	

}



















