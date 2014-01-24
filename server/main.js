server = true;


Db = {};
Db.dialogue = {};

List = {
	all:{},		//EVERYTHING (player id refers to mortal)
	mortal:{},	//all mortals (player,enemy)
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


//Sync DB and Server when Server starts
exports.initServer = function (){
    require('async').series([Init.db.item, Init.db.equip, Init.db.ability,
        (function(){
			Init.db.stat();
			
			
			//initAbilityModDb();
			
			Init.db.sprite();
			Init.db.map();
			
			Init.db.drop();
			Change.update.init();
			Init.db.boost();
			Init.db.customBoost();
			Init.mortal();
			Init.db.enemy();
			Init.db.boss();
								
			Init.db.quest();
			Init.db.dialogue();
			Map.creation.all();
			
			Init.db.passive();
			Init.db.clan();
			//initAbiConsDb();
			Test.serverStart();
			setInterval(Loop,40);
			
			//Track Global Variables
			var tmp = Object.keys(this); for(var i in ObjectKeys) tmp.splice(tmp.indexOf(ObjectKeys[i]),1);
			//permConsoleLog(tmp);
    
			
		})
	]);
	
	db.account.update({},{'$set':{online:0}},{multi:true},function(err, results) { if(err) throw err });   //set all players offline
}


