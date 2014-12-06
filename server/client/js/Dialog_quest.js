(function(){ //}

Dialog('quest','Quest',Dialog.Size(900,600),Dialog.Refresh(function(){
	return Dialog.quest.apply(this,arguments);
},function(html,variable){
	return Tk.stringify(main.quest[variable.quest]) + variable.quest + main.questActive;
}),{
	quest:null,
});
//Dialog.open('quest')

Dialog.quest = function (html,variable,param){
	var q = QueryDb.get('quest',param,function(){
		Dialog.open('quest',param);
	});
	if(!q) return false;
	var mq = main.quest[param];
	variable.quest = param;
	
	var top = $('<div>');
	html.append('<h2 style="text-decoration:underline;width:100%">Quest:' + q.name + '</h2>');
	html.append(top);
	Dialog.quest.challenge(top,q,mq);
	Dialog.quest.bonus(top,q,mq);
	Dialog.quest.start(top,q,mq);
	
	var bottom = $('<div>');
	html.append(bottom);
	
	Dialog.quest.generalInfo(bottom,q,mq);
	Dialog.quest.playerInfo(bottom,q,mq);
}


Dialog.quest.challenge = function(top,q,mq){
	var el = $('<div>').addClass('inline');
	top.append(el);
	
	el.append('<h2 class="u">Challenges</h2>');
	
	var star = $('<span>★</span>')
		.addClass('shadow360')
		.attr('title',mq._complete ? 'Completed this quest at least once' : 'Never completed this quest')
		.css({color:mq._complete ? 'yellow' : 'gray'});
		
	el.append(star);
	el.append(' - ');
		
	var chalActive = ''; for(var i in mq._challenge) if(mq._challenge[i]) chalActive = i;
	var text = $('<span>No Challenge</span>')
		.addClass('shadow')
		.css({cursor:'pointer',color:chalActive ? 'red' : 'green'})
		.attr('title','Click if you want to do the quest normally.')
		.click(function(){
			if(chalActive)
				Command.execute('win,quest,toggleChallenge',[chalActive]);
		});
	el.append(text);
	el.append('<br>');
		
		
	for(var i in q.challenge){
		var c = q.challenge[i];
		
		var star = $('<span>★</span>')
			.addClass('shadow360')
			.attr('title',mq._challengeDone[i] ? 'Completed this challenge at least once' : 'Never completed this challenge')
			.css({color:mq._challengeDone[i] ? 'yellow' : 'gray'});
		el.append(star);
		el.append(' - ');
		
		var text = $('<span>' + c.name + '</span>')
			.addClass('shadow')
			.css({cursor:'pointer',color:chalActive === i ? 'green' : 'red'})
			.attr('title','Click to toggle challenge: ' + c.description)
			.click((function(i){	
				return function(){
					Command.execute('win,quest,toggleChallenge',[i]);
				}
			})(i));
		el.append(text);
		el.append('<br>');
		
	}
}

Dialog.quest.bonus = function(top,q,mq){
	var el = $('<div>').addClass('inline').css({width:'auto'});
	top.append(el);
	el.append('<h2 class="u">Reward Bonus</h2>');
	el.append(Dialog.quest.generateBonusArray(mq._bonus,mq._challenge,mq._challengeDone));
}	

Dialog.quest.generateBonusArray = function(b,challengeActive,challengeDone){
	var challengeStatus = false;
	for(var i in challengeActive) if(challengeActive[i] === true) challengeStatus = true; 
	
	var titleChallenge = '<span title="Bonus awarded if you beat the currently active challenge.">Active Chal.</span>';
	if(challengeStatus === false)
		titleChallenge = '<span title="You have no active challenge. Activate a challenge to receive an Active Challenge Bonus.">Active Chal.</span>';
	if(challengeStatus === null)
		titleChallenge = '<span title="">Active Chal.</span>';
	
	var challengeDoneCount = 0;
	for(var i in challengeDone) if(challengeDone[i]) challengeDoneCount++;
	
	
	var formatBold = function(num){
		if(num === 1) return 'x' + num.r(3);
		return "<strong> * x" + num.r(3) + ' * </strong>';
	}
	var array = [
		[
			'',
			titleChallenge,
			challengeDoneCount ? '<span title="Bonus awarded because you have completed ' + challengeDoneCount + ' Challenges in the past.">Past Chal.</span>'
				: '<span title="Completing challenges grant a permanent bonus that applies even if the challenge is no longer active.">Past Chal.</span>',
			'<span title="Everytime you complete this quest, its Cycle Bonus decreases. Every midnight, it increases to at least x1.">Cycle</span>',
			'<u title="Bonus used for calculations">Final</u>',
		],
		[
			'<span title="Impact score which impacts amount of Reputation Points gained. Use them to permanently boost stats.">Score:</span>',
			formatBold(b.challenge.score),
			'x' + b.challengeDone.score.r(3),
			'x' + b.cycle.score.r(3),
			'<u>x' + (b.challenge.score*b.challengeDone.score*b.cycle.score).r(3)+'</u>',
		],
		[
			'<span title="Impact exp rewarded for completing the quest, killing monsters and harvesting Skill Plots.">Exp:</span>',
			formatBold(b.challenge.exp),
			'x' + b.challengeDone.exp.r(3),
			'x' + b.cycle.exp.r(3),
			'<u>x' + (b.challenge.exp*b.challengeDone.exp*b.cycle.exp).r(3)+'</u>',
		],
		[
			'<span title="Impact amount of item received from completing the quest, killing monsters and harvesting Skill Plots.">Item:</span>',
			formatBold(b.challenge.item),
			'x' + b.challengeDone.item.r(3),
			'x' + b.cycle.item.r(3),
			'<u>x' + (b.challenge.item*b.challengeDone.item*b.cycle.item).r(3)+'</u>',
		],
	];
	return Tk.arrayToTable(array,true,true,true);
}

Dialog.quest.start = function(top,q,mq){
	var chalActive = ''; for(var i in mq._challenge) if(mq._challenge[i]) chalActive = i;
	
	var btn = $('<button>')
		.css({font:'25px Kelly Slab',verticalAlign:'-100px',display:'inline-block'})	//padding is bad... vertical doesnt work
		.addClass(!main.questActive ? 'myButtonGreen' : 'myButtonRed');
	top.append(btn);
	
	if(!main.questActive){
		btn.attr('title','Start this quest');
		btn.click(function(){
			Command.execute('win,quest,start',[q.id]);
		});
		btn.html('Start Quest<br>' + (chalActive ? 'with Challenge<br>' + q.challenge[chalActive].name.q() : 'without challenge'));
	}
	else if(main.questActive === q.id){
		btn.attr('title','Abandon quest');
		btn.click(function(){
			Command.execute('win,quest,abandon',[q.id]);
		});
		btn.html('Abandon<br>This Quest');
	}
	else if(main.questActive && main.questActive !== q.id){
		var activeQuestName = QueryDb.getQuestName(main.questActive);
		
		btn.attr('title','Abandon Active Quest (' + activeQuestName + ')');
		btn.click(function(){
			Command.execute('win,quest,abandon',[main.questActive]);
		});
		btn.html('Abandon<br>' + activeQuestName.q());
	}
}	

//##################

Dialog.quest.generalInfo = function(bottom,q,mq){
	var el = $('<div>').addClass('inline');
	bottom.append(el);
	
	el.append('<h2 class="u">General Quest Info</h2>');
	el.append('Quest created by: "' + q.author + '".<br>');
	el.append('Rating: ' + q.rating.r(2) + '/3.<br>');
	el.append('Completed by ' + q.statistic.countComplete + ' players.<br>');
	el.append(((q.statistic.countComplete/q.statistic.countStarted*100) || 0).r(1) + '% players who started the quest finished it.<br>');
	el.append('In average, players repeat this quest ' + q.statistic.averageRepeat.r(2) + ' times.<br>');
	el.append('<br>');
	

}

Dialog.quest.playerInfo = function(bottom,q,mq){
	var el = $('<div>').addClass('inline');
	bottom.append(el);
	
	//reward
	el.append('<h2 class="u">Personal Score</h2>');
	el.append('Quest completed: ' + mq._complete + ' times<br>');
	el.append($('<span>')
		.html('Cumulative Quest Score: ' + mq._rewardScore.r(0) + ' / 10000')
		.attr('title',"Everytime you beat a quest, you get a Quest Score that depends on performance and Score Bonus.")
	);
	el.append('<br>');
	
	el.append($('<button>')
		.html('Open Reputation Grid')
		.addClass('myButton')
		.attr('title',"Click here to open the Reputation Grid")
		.click(function(){
			Dialog.open('reputation');
		})
	);
	el.append('<br>');
	//#########################	
		
	el.append('<h2 class="u">Highscores</h2>');
	for(var i in q.highscore){
		el.append(' - ');
		var high = $('<a>')
			.html(q.highscore[i].name + ' : ' + (mq._highscore[i] || '---'))
			.attr('title',q.highscore[i].description)
			.click((function(i){
				return function(){
					Dialog.open('highscore',i);
				}
			})(i));
			
		el.append(high);
		el.append('<br>');
	}	
}

})();








