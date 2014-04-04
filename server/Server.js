/*
1- connect db
2- ts("Server.maxPlayerAmount = 16")
3- ts("Server.loginMessage = 'Server is down. <br> Open beta at 3pm East Coast March 29th.'")
4- ts("List.main[key].social.symbol = 1")

pvp too much dmg
reset pvp = bad


ts("for(var i = 0; i < 100; i++){ Test.spawnEnemy(key,['larva','normal']); }")

ts("for(var i = 0; i < Test.spawnEnemy(key,['bat','normal']);")

ts("for(var i in List.actor) List.actor[i].hp = Math.random()-0.98;")


ts('Actor.creation.group({x:0,y:0,map:"goblinLand@MAIN",respawn:10},[{"amount":100,"category":"dragon","variant":"king","lvl":0,"modAmount":1}]);');

*/








Server =  {
	testing:!nodejitsu,		//will trigger special testing func
	frequence:{
		save:60*1000,
		inactivity:10*60*1000,
		disconnect:6*60*60*1000,
		db:60*1000,
	},	
	timeLimit:{
		perWeek:24*60*60*1000,
		active:1,	
	},
	ready:0,
	maxPlayerAmount:nodejitsu ? 0 : 64,
	customMod:false,
	report:false,
	loginMessage:"Server is down. Come later.",
}


Server.start = function(data){
	Init.db(data);
	Init.email(data);
	main.initServer();
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
	'rc', //'sam','admin','idk whats rc','idkwhatsrc',
];
if(Server.testing) Server.admin = ['rc','sam','sama','admin','idk whats rc','idkwhatsrc']; 


Server.mute = function(name){
	for(var i in List.main){
		if(List.all[i].name === name)
			List.main[i].social.muted = 1;	
	}
}




/*
Server.ban = function(name){
	for(var i in List.main){
		if(List.all[i].name === name)
		
		
		
	}
}
*/












