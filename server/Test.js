Test = {};

Test.loop = function(){


}

Test.serverStart = function(){
    
}


Test.signIn = function(key){	
	//Called when player logs in
	Test.signIn.hideHUD(key);
	
	if(Server.testing){
		Test.a(key);	//test enemy
		Itemlist.add(key,'gold');
		TestingQuest(key);
	}
	
	Actor.permBoost(List.all[key],'Player',[
		{stat:'bullet-spd',value:0.5,type:'+'},
	]);	
}

Test.signIn.hideHUD = function(key){
	var total = Skill.getTotalLvl(key);
	if(total < 40) List.main[key].hideHUD.advancedAbility = 1;
	if(total < 30) List.main[key].hideHUD.equipOrb = 1;
	if(total < 25) List.main[key].hideHUD.questOrb = 1;
	if(total < 20) List.main[key].hideHUD.questChallenge = 1;
	if(total < 15) List.main[key].hideHUD.advancedStat = 1;
	if(total < 10) List.main[key].hideHUD.passive = 1;
}


Test.dayCycle = function(key){
	var mq = List.main[key].quest;
	for(var i in mq){
		mq[i].bonus.cycle += 0.02;
	}	
}

Test.firstSignIn = function(key){
	var inv = List.main[key].invList;
	var act = List.all[key];

	if(Server.testing){
		Itemlist.add(inv,'gold');
		Itemlist.add(inv,'teleport');
	}
	
	Actor.teleport(act,56*32,101*32,"tutorial@MAIN");
	act.respawnLoc = {safe:{x:56*32,y:101*32,map:"tutorial@MAIN"},recent:{x:56*32,y:101*32,map:"tutorial@MAIN"}};
	
		
	Chat.add(act.id,"Note: This is a very early beta. Expect things to change... A LOT.");
	Chat.add(act.id,"Control: WADS. (For AZERTY users, change key binding via Pref Tab)");

}



Test.spawnEnemy = function(key,info){
	var player = List.all[key];
	info = info || ["bat","normal"];
	if(!Db.enemy[info[0]][info[1]]){ DEBUG(0,"no enemy with that cat and var"); return;}
	Actor.creation({
		'xym':{x:player.x,y:player.y,map:player.map},
		"category":info[0],		
		"variant":info[1],		
		"extra":{},
	});
}

Test.generateEquip = function(key,lvl,maxAmount){
	lvl = lvl || 0;
	maxAmount = maxAmount || 5;
	
	var act = List.all[key];
	for(var i in act.equip.piece){
		var id = Plan.use(key,{
			piece: i,
			type: Cst.equip[i].type.random(),
			lvl: lvl,
			
			category: "equip",
			color: "white",
			icon: "plan.equip",
			id: Math.randomId(),
			maxAmount: maxAmount,
			minAmount: 0,
			name: "Equip Plan",
			quality: 0,
			rarity: 0,
			req: {item: [],skill:{}},
		});
		Actor.switchEquip(act,id,i);
	}
	
}

Test.a = function(key){ Db.quest["QtestEnemy"].func.start(key); }
Test.b = function(){}
Test.c = function(){}
Test.d = function(){}













