var db = requireDb();

Db = {};
List = {all:{},actor:{},bullet:{},strike:{},group:{},drop:{},map:{},main:{},socket:{},nameToKey:{},btn:{}};



//Sync DB and Server when Server starts
Init.server = function (){
	Init.db.equip(function(){
	Init.db.ability(function(){
	Init.db.plan(function(){
   
		Init.db.item();
		Init.db.customBoost();
		Init.db.stat();
		Init.db.material();
		
		Init.db.sprite();
		Init.db.quest.map();
		Init.db.map();
		
		
		Init.db.drop();
		Init.changeUpdate();
		Init.db.boost();
		Init.actor();
		
		Init.db.quest();
		
		Init.db.npc();
		Init.db.boss();
		
		Init.db.dialogue();
		Init.db.clan();
		
		Init.db.passive(function(){
			Init.cycle();
			
			Test.serverStart();
			setInterval(Loop,40);
			
			Server.ready = 1;
	
		});
	})})});
	
	db.update('account',{},{'$set':{online:0}},{multi:true},function(err, results) { if(err) throw err });   //set all players offline
}


