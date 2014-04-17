server = true;


Db = {};
Db.dialogue = {};


List = {
	all:{},		//EVERYTHING (player id refers to actor)
	actor:{},	//all mortals (player,enemy)
	bullet:{},	//all bullet
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



//Sync DB and Server when Server starts
Init.server = function (){
	Init.db.item(function(){
	Init.db.equip(function(){
	Init.db.ability(function(){
	Init.db.plan(function(){
   
		Init.db.customBoost();
		Init.db.stat();
		Init.db.material();
		
		Init.db.sprite();
		Init.db.quest.map();
		Init.db.map();
		
		Init.db.drop();
		Change.update.init();
		Init.db.boost();
		Init.actor();
		
		Init.db.quest();
		
		Init.db.npc();
		Init.db.boss();
							
		
		Init.db.dialogue();
		Map.creation.all();
		
		Init.db.passive(function(){
			Init.cycle();
			Init.db.clan();
			Test.serverStart();
			setInterval(Loop,40);
			
			Server.ready = 1;
			//Track Global Variables
			var tmp = Object.keys(this); for(var i in ObjectKeys) tmp.splice(tmp.indexOf(ObjectKeys[i]),1);
			//permConsoleLog(tmp);
		});
	})})})});
	
	db.update('account',{},{'$set':{online:0}},{multi:true},function(err, results) { if(err) throw err });   //set all players offline
}


