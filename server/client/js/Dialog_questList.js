(function(){ //}

Dialog('questList','Quest List',Dialog.Size(300,500),Dialog.Refresh(function(){
	Dialog.questList.apply(this,arguments);
},function(){
	return main.questActive;
},10));
//Dialog.open('questList')

Dialog.questList = function(html,variable,param){
		
	//Daily Task
	/*
	if(!main.dailyTask.$isEmpty()){
		str += '<span style="color:yellow;" title="Huge Bonus Upon Completing Those Tasks">Daily Task: ';
		for(var i in main.dailyTask)
			str += '<span title="' + main.dailyTask[i].date + ': ' + main.dailyTask[i].description + '"> #' + (+i+1) + ' </span>';	
		str += '</span><br>';
	} else {
		str += '<span style="color:' + CST.color.green + ';" title="Good job! Come back tomorrow for another task.">Daily Task: All Done!</span><br>';
	}
	*/
		
	//Quest
	var all = $('<div>').addClass('shadow');
	all.append('<h2>Quest List</h2>');
	html.append(all);
	
	for(var i in main.quest){
		if(!QueryDb.getQuestShowInTab(i)) continue;
		var mq = main.quest[i];
		
		var amountChal = Object.keys(mq._challengeDone).length;
		var challengeDone = 0; for(var j in mq._challengeDone)	if(mq._challengeDone[j]) challengeDone++;
		
		var color = 'yellow';
		if(challengeDone === 0) color = 'red';
		if(challengeDone === amountChal) color = 'green';
		
		var el = $('<span>')
			.css({color:color})
			.attr('title',challengeDone + ' out of ' + amountChal + ' challenges completed')
			.html(challengeDone + '/' + amountChal + ' ');
			
		all.append(el);
		
		//##############
		var color = 'red';
		if(main.questActive === i) color = 'orange';
		else if(mq._complete) color = 'green';
		
		var text = QueryDb.getQuestName(i);
		if(main.questActive === i) text = '<u>* ' + text + ' *</u>';
		
		var el = $('<span>')
			.css({color:color})
			.attr('title','Check '+ QueryDb.getQuestName(i))
			.html(text)
			.click((function(i){
				return function(event){
					if(!event.shiftKey) Dialog.open('quest',i);
					else if(main.questActive === i) Command.execute('win,quest,abandon',[i]);
					else Command.execute('win,quest,start',[i]);
				}
			})(i))
		all.append(el);	
		
		all.append('<br>');
		
	}
}


})();




