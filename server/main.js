server = true;


Db = {};
Db.dialogue = {};


List = {
	all:{},		//EVERYTHING (player id refers to actor)
	actor:{},	//all mortals (player,enemy)
	bullet:{},	//all bullet
	anim:{},	//all anim
	strike:{},	//all strike
	group:{},	//all enemy group
	drop:{},	//all drop
	map:{},		//all animation
	main:{},	//all List.main of player. (player id) List.main[id].something on server => window.something on client
	map:{},		//all maps including instance 
	socket:{},	//all socket (player id),
	nameToKey:{},	//used to convert a player name into the player key
	btn:{},		//all buttons
	map:{},		//all maps
};


Init.timer = function(){
	var nextDailyUpdate = new Date((new Date().toLocaleDateString())).getTime() + 86400000 - 60000;	
	var daysTilNextWeekUpdate = (11-new Date(nextDailyUpdate).getDay())%7;
	var nextWeeklyUpdate = daysTilNextWeekUpdate * 86400000 + nextDailyUpdate + 10000;
	
	var dailyFunc = function(){
		
	
		nextDailyUpdate += 86400000;
		setTimeout(dailyFunc,86400000);
	}
	
	var weeklyFunc = function(){
		db.update('account',{},{'$set':{timePlayedThisWeek:0}},db.err);
	
		nextWeeklyUpdate += 86400000*7;
		setTimeout(weeklyFunc,86400000*7);
	}
	
	setTimeout(dailyFunc,nextDailyUpdate-Date.now());
	setTimeout(weeklyFunc,nextWeeklyUpdate-Date.now());

}

//Sync DB and Server when Server starts
exports.initServer = function (){
    Init.timer();
	
	Init.db.item(function(){
	Init.db.equip(function(){
	Init.db.ability(function(){
	Init.db.plan(function(){
		
		Init.db.stat();
		Init.db.material();
		
		//initAbilityModDb();
		
		Init.db.sprite();
		Init.db.quest.map();
		Init.db.map();
		
		Init.db.drop();
		Change.update.init();
		Init.db.boost();
		Init.db.customBoost();
		Init.actor();
		
		Init.db.quest();
		
		Init.db.enemy();
		Init.db.boss();
							
		
		Init.db.dialogue();
		Map.creation.all();
		
		Init.db.passive();
		Init.db.clan();
		Test.serverStart();
		setInterval(Loop,40);
		
		//Track Global Variables
		var tmp = Object.keys(this); for(var i in ObjectKeys) tmp.splice(tmp.indexOf(ObjectKeys[i]),1);
		//permConsoleLog(tmp);
    
	})})})});
	
	db.update('account',{},{'$set':{online:0}},{multi:true},function(err, results) { if(err) throw err });   //set all players offline
}


