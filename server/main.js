//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Init','Server','requireDb','Loop','Test'],['Db','List']));

var db = requireDb();

var Db = exports.Db = {};
var List = exports.List = {all:{},actor:{},bullet:{},strike:{},group:{},drop:{},map:{},main:{},socket:{},nameToKey:{},btn:{},party:{}};

//Sync DB and Server when Server starts
Init.game = function (){
	Init.db.equip(function(){
	Init.db.ability(function(){
	Init.db.plan(function(){
		Init.db.item();
		Init.db.statCustom();
		Init.db.stat();
		Init.db.material();
		
		Init.db.sprite();
		Init.db.quest.map();
		Init.db.map();
		
		
		Init.db.drop();
		Init.db.boost();
		Init.actorTemplate();
		
		Init.db.quest();
		
		Init.db.npc();
		Init.db.boss();
		
		Init.db.clan();
		
		Init.db.passive(function(){
			Init.cycle();
			
			Test.serverStart();
			setInterval(Loop,40);
			INFO("Server ready");
			Server.ready = 1;
	
		});
	})})});
	
	db.update('account',{},{'$set':{online:0}},{multi:true},function(err, results) { if(err) throw err });   //set all players offline
}


