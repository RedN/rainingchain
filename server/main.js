server = true;

//To make shared files work. barely used anymore

ctxList = {
	'stage':{'restore':(function(){}),'fillText':(function(){}),'drawImage':(function(){})},
	'win':{'restore':(function(){}),'fillText':(function(){}),'drawImage':(function(){})},

};
ctx = {'restore':(function(){}),'fillText':(function(){}),'drawImage':(function(){})};

ctxrestore = function(){};

/////

fullList = {};  //EVERYTHING
mList = {}; //all mortals (player,enemy)
bList = {}; //all bullet
sList = {}; //all strike
egList = {}; //all enemy group

dropList = {};  //all drop
aList = {}; //all animation
shopList = {}; //all shop

mapList = {};   //all maps including instance
mainList = {};  //all mainList of player. (player id) mainList[id].something on server => window.something on client
socketList = {};    //all socket (player id)

nameToKey = {}; //use to convert a player name into the player key

//Start Game
exports.startGame = function() {
	initServer();
	setInterval(Loop,40);	
};	

//Sync DB and Server when Server starts
initServer = function (){
    require('async').series([initItemDb, initArmorDb, initWeaponDb, initAbilityDb,
        (function(){
			initStatTo();
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
