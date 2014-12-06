//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Server','Save','ItemList','Main','Contribution'],['Message']));

var Message = exports.Message = function(type,text,from,extra){	//extra comes from Message._something
	if(!Message.TYPE.have(type)) return ERROR(3,'invalid type',type);
	var msg = {
		type:type,
		text:text,
		from:from || Message.SERVER,
	}
	for(var i in extra) msg[i] = extra[i];
	return msg;	
}
Message.SERVER = '$server';
Message.TYPE = [ //{
	'game',	//appear in chatbox
	'public', //appear in chatbox
	'clan', //appear in chatbox with clan name
	'pm', //appear in pmbox
	'report',	//logged in db
	'input',	//overwrite chat input
	'dialog',	//popup in jquery dialog
	'questPopup', //popup for quest
	'question',	//prompt asking for answer, call function with answer as param
	'contribution',	//appear in contribution box
	'signNotification',	//appear chatbox. called when player logs in game
]; //}


Message.Clan = function(clan){
	return {
		clan:clan
	}
}
Message.Pm = function(to){
	return {
		to:to,
	}
}

//#############

Message.Public = function(customChat){
	return {
		symbol:customChat.symbol,
		color:customChat.color,
	}
}
Message.QuestPopup = function(time,title){
	return {
		time:time || 8*1000,
	}
}

Message.Report = function(title){
	return {
		title:title || '',
	};
}

Message.uncompressClient = function(msg){
	if(typeof msg === 'string') return Message('game',msg,Message.SERVER);	//for compression
	return msg;
}
	
//###############

Message.Question = function(answerType,option,title){
	var tmp = {
		answerType:answerType || 'boolean',	//string, number, option
		option:option || [],
		title:title || '',
	}
	return tmp;
}
Message.Question.YES = 'Yes';
Message.Question.NO = 'No';


