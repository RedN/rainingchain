(function(){ //}

Dialog('highscore','Highscore',Dialog.Size(700,700),Dialog.Refresh(function(){
	return Dialog.highscore.apply(this,arguments);
}),{
	param:null,
});
//Dialog.open('highscore')
//QueryDb.get('highscore','QlureKill-_score')

Dialog.highscore = function(html,variable,param){
	if(typeof param === 'string') param = {quest:param.split('-')[0],category:param};
	param = param || {};
	param.quest = param.quest || QueryDb.getHighscoreQuestList().randomAttribute();
	param.category = param.category || QueryDb.getHighscoreForQuest(param.quest).randomAttribute();
	
	variable.param = param;
	
	//Select Quest
	var highscore = QueryDb.get('highscore',param.category,function(){
		Dialog.refresh('highscore',param);
	});
	if(!highscore) return Dialog.close('highscore');
	
	Dialog.highscore.top(html,variable,highscore);
	Dialog.highscore.table(html,variable,highscore);
	
	return variable.param;
}

Dialog.highscore.top = function(html,variable,highscore){
	var sel = $('<select>');
	
	var list = QueryDb.getHighscoreQuestList();
	for(var i in list){
		sel.append('<option value="' + i + '">' + QueryDb.getQuestName(i) + '</option>');
	}
	sel.change(function(){
		Dialog.open('highscore',{quest:sel.val()});
	});
	sel.val(highscore.quest);	//set selected option to the right spot
	html.append('Quest: ');
	html.append(sel);
	
	//#########
	var sel2 = $('<select>');
	var list = QueryDb.getHighscoreForQuest(highscore.quest);
	for(var i in list){
		sel2.append('<option value="' + i + '">' + QueryDb.getHighscoreName(i) + '</option>');
	}
	sel2.change(function(){
		Dialog.open('highscore',{quest:sel.val(),category:sel2.val()});
	});
	sel2.val(highscore.id);
	html.append(' - Category: ');
	html.append(sel2);
	
	//#########
	html.append('<br>');
	html.append($('<div>').css({width:'auto',height:'auto'}).html(QueryDb.getHighscoreDescription(highscore.id)));
	
}

Dialog.highscore.table = function(html,variable,highscore){
	var array = [];
	array.push([
		'Rank',
		'Name',
		'Score',
	]);

	for(var i in highscore.score){
		array.push([
			highscore.score[i].rank,
			highscore.score[i].username,
			highscore.score[i].value === null ? '---' : highscore.score[i].value
		]);
	}
	
	html.append(Tk.arrayToTable(array,true,false,true));
}


})();