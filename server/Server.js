
Server =  {
	testing:true,		//will trigger special testing func
	frequence:{
		save:10*1000,
		disconnect:10*60*1000,
		inactivity:6*60*60*1000,
		db:60*1000,
	},	
	ready:0,
	maxPlayerAmount:nodejitsu ? 0 : 64,
	customMod:false,
	loginMessage:"Server is down. Come later.",
}


Server.start = function(data){
	Init.db(data);
	Init.email(data);
	main.initServer();
	Server.ready = 1;	
}

Server.botwatch = function(key,towatch){
	List.main[key].old = {};
	List.all[key].old = {};
	List.all[key].privateOld = {};
	
	if(!towatch){
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
	'sam',//'rc','admin','idk whats rc','idkwhatsrc',
];





















