//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Server','Save','ItemList','Main','Contribution','Message']));

Main.Question = function(func,answerType){
	return {
		func:func,
		answerType:answerType,
	}
}

Main.question = function(main,func,text,answerType,option,title){
	answerType = answerType || 'boolean';
	text = text || "Are you sure?";
	option = option || [];
	title = title || 'Please answer this question';
	if(answerType === 'boolean') option = [Message.Question.YES,Message.Question.NO];
	
	if(!Main.question.ANSWER_TYPE.contains(answerType)) return ERROR(3,'invalid answerType',answerType);
	
	var msg = Message('question',text,null,Message.Question(answerType,option,title));
	Main.addMessage(main,msg);
	main.question = Main.Question(func,answerType);
	
}
Main.question.ANSWER_TYPE = ['boolean','number','string','option'];

Main.handleQuestionAnswer = function(main,msg){	//both
	if(!main.question) return;
	
	var func = main.question.func;
	var answerType = main.question.answerType;
	main.question = null;	//needed cuz func can remodify question
	if(answerType === 'boolean'){
		if(msg.text === Message.Question.YES)
			SERVER ? func(main.id) : func();
		return;
	}
	SERVER ? func.apply(null,[main.id].concat(msg.text.split(','))) : func.apply(null,msg.text.split(','));
}

Main.question.init = function(){
	Dialog('question','Question',Dialog.Size(300,200),Dialog.Refresh(function(html,variable,msg){
		html.css({textAlign:'center'});
		
		html.append($('<span>')
			.html(msg.text + '<br>')
			.css({fontSize:'1.5em'})
		);
			
		//#####################
		var submitAnswer = function(answer){
			Dialog.close('question');
			if(main.question) //means question was asked on client
				return Main.handleQuestionAnswer(main,answer);
			
			Message.sendToServer(Message('question',answer,player.name));
		}
		
		if(msg.option.length){
			var option = $('<span>');
			
			for(var i in msg.option){
				option.append($('<button>')
					.html(msg.option[i])
					.click((function(answer){	
						return function(){
							submitAnswer(answer);
						}
					})(msg.option[i]))
				);
			}
			html.append(option);
			html.append('<br>');
		} else { //#####################
			var form = $('<form>')
				.append('<input id="questionInput"  placeholder="answer" type="text">')
				.submit(function(e) {
					e.preventDefault();
					submitAnswer($('#questionInput').val());
					return false;
				});
			html.append(form);
		}
		
	}));
	
}

