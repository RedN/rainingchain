var db = require('./Db');
/*
1- connect db
2- ts("Server.maxPlayerAmount = 16")
3- ts("Server.loginMessage = 'Server is down. <br> Open beta at 3pm East Coast March 29th.'")
4- ts("List.main[key].social.symbol = 1")

pvp too much dmg
reset pvp = bad

*/

Server =  {
	testing:!NODEJITSU,		//will trigger special testing func
	frequence:{
		save:Math.round(60*1000/40),	//save player
		inactivity:10*60*1000,			//quit if no input
		disconnect:6*60*60*1000,		//quit
		db:60*1000,						//refresh db link
	},	
	timeLimit:{
		perWeek:24*60*60*1000,
		active:1,	
	},
	ready:0,
	maxPlayerAmount:NODEJITSU ? 0 : 64,
	customMod:false,					//accept customMod
	report:false,						//accept report
	loginMessage:"Server is down. Come later.",
}


Server.start = function(data){
	if(Server.ready) return;
	Init.db(data);
	Init.email(data);
	Init.server();
}

Server.botwatch = function(key,towatch){
	List.main[key].old = {};
	List.all[key].old = {};
	List.all[key].privateOld = {};
	
	if(!towatch){	//watch first random player
		for(var i in List.socket) if(i !== key) towatch = i;
	}
	List.main[towatch].old = {};
	List.all[towatch].old = {};
	List.all[towatch].privateOld = {};
	Server.botwatch.watcher = key;
	Server.botwatch.watched = towatch;
}
Server.botwatch.watcher = null;
Server.botwatch.watched = null;

Server.disconnectAll = function(){
	for(var i in List.main){
		Sign.off(i,"Admin disconnected every player.");
	}
}

Server.admin = [
	'rc', //'sam','admin','idk whats rc','idkwhatsrc',
];
if(Server.testing) Server.admin = ['rc','sam','sama','admin','idk whats rc','idkwhatsrc']; 


Server.mute = function(name){
	for(var i in List.main){
		if(List.all[i].name === name)
			List.main[i].social.muted = 1;	
	}
}



Server.log = function(lvl,key,type){	//only logs then, no display
	/*
	1:Very important
	2:important (saved)
	3:NOT really important (not saved but if had unlimited space, would save)
	4:NOT important at all (wouldnt be saved ever)
	*/
	var act = List.all[key];
	var username = act ? act.name : key;
	
	if(lvl > Server.log.level) return;
	
	var param = '';
	for(var i = 3; i < arguments.length; i++)	param += arguments[i] + ', ' ;
	
	Server.log.data.push({
		time:Date.now(),
		username:username,
		type:type,
		param:param,
	});
}
Server.log.display = function(name){
	if(!name){ INFO(Server.log.data); return; }
		
	for(var i in Server.log.data){
		if(Server.log.data[i].username === name){
			var date = new Date(Server.log.data[i].time).toLocaleString();
			INFO(date + ': ' + Server.log.data[i].type + '\n  ---  ' + Server.log.data[i].param);
		}
	}
	
}
Server.log.data = [];
Server.log.level = 4;

/*
Server.ban = function(name){
	for(var i in List.main){
		if(List.all[i].name === name)
		
		
		
	}
}
*/




Server.reset = function(save){
	if(save){
		try	{
			for(var i in List.main) Save(key);
		} catch(err){}
	}

	try	{
		for(var i in List.socket)	List.socket[i].disconnect();
	} catch(err){}
	
	for(var i in List)	List[i] = {};
	db.update('account',{},{'$set':{online:0}});
}







