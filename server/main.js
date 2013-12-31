server = true;

//To make shared files work. barely used anymore

ctxList = {
	'stage':{'restore':(function(){}),'fillText':(function(){}),'drawImage':(function(){})},
	'win':{'restore':(function(){}),'fillText':(function(){}),'drawImage':(function(){})},

};
ctx = {'restore':(function(){}),'fillText':(function(){}),'drawImage':(function(){})};

ctxrestore = function(){};

/////
List = {};
List.all = {};  //EVERYTHING
List.mortal = {}; //all mortals (player,enemy)
List.bullet = {}; //all bullet
List.strike = {}; //all strike
List.group = {}; //all enemy group

List.drop = {};  //all drop
List.anim = {}; //all animation

List.map = {};   //all maps including instance
List.main = {};  //all List.main of player. (player id) List.main[id].something on server => window.something on client
List.socket = {};    //all socket (player id)

nameToKey = {}; //use to convert a player name into the player key
shopList = {}; //all shop


//Start Game
exports.startGame = function() {
	initServer();
	setInterval(Loop,40);	
};	

//Sync DB and Server when Server starts
initServer = function (){
    require('async').series([initItemDb, initArmorDb, initWeaponDb, initAbilityDb,
        (function(){
			initStatDb();
			initDefaultBonus();
			
			initAbilityModDb();
			
			initSpriteDb();
			initShopDb();
			Dialogue.init();
			initMapDb();
			
			initDropDb();
			Change.update.init();
			initBoostDb();
			initUniqueBoostDb();
			initDefaultBoost();
			initDefaultMortal();
			initEDb();
			initBossDb();
								
			initQuestDb();
			initLoadMap();
			
			initPassiveGrid();
			initClanDb();
			initAbiConsDb();
			Test.serverStart();
		})
	]);
	
	db.account.update({},{'$set':{online:0}},{multi:true},function(err, results) { if(err) throw err });   //set all players offline
}
