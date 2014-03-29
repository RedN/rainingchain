Test = {};

Test.loop = function(){


}

Test.serverStart = function(){
    
}


Test.signIn = function(key){	
	//Called when player logs in
	Test.signIn.hideHUD(key);
	
	if(Server.testing){
		Db.quest["QtestEnemy"].func.start(key);	//test enemy
		Itemlist.add(key,'gold');
		TestingQuest(key);
	}
	
	Db.quest.Qopenbeta2.func.start(key);	//OPENBETA
	
	Actor.permBoost(List.all[key],'Player',[
		{stat:'bullet-spd',value:0.5,type:'+'},
	]);	
}

Test.firstSignIn = function(key){
	var inv = List.main[key].invList;
	var act = List.all[key];

	if(Server.testing){
		Itemlist.add(inv,'gold');
		Itemlist.add(inv,'teleport');
	}
	
	/* OPENBETA
	Actor.teleport(act,56*32,101*32,"tutorial@MAIN");
	act.respawnLoc = {safe:{x:56*32,y:101*32,map:"tutorial@MAIN"},recent:{x:56*32,y:101*32,map:"tutorial@MAIN"}};
	*/
		
	Chat.add(act.id,"Note: This is a very early beta. Expect things to change... A LOT.");
	Chat.add(act.id,"Control: WADS. (For AZERTY users, change key binding via Pref Tab)");

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



Test.pvpAbility = function(key){
	var act = List.all[key];
	//PVP
	act.abilityList = {
		'pvp-bullet':1,
		'pvp-fireball':1,
		'pvp-freeze':1,
		'pvp-explosion':1,
		'pvp-invincibility':1,
		'pvp-heal':1,
	};

	Actor.swapAbility(act,'pvp-bullet',0);
	Actor.swapAbility(act,'pvp-explosion',1);
	Actor.swapAbility(act,'pvp-freeze',2);
	Actor.swapAbility(act,'pvp-fireball',3);
	Actor.swapAbility(act,'pvp-heal',4);
	Actor.swapAbility(act,'pvp-invincibility',5);
	
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
	var act = List.all[key];
	
	/*
	if(!nodejitsu){
		lvl = lvl || 0;
		maxAmount = maxAmount || 5;
		
		
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
	
	if(nodejitsu){
		act.equip.melee = "QtestEnemy-weapon";
		//act.equip = {"piece":{"melee":"QtestEnemy-weapon","range":"24fvltcng","magic":"ipw6bxde4","amulet":"kc3fy1ltl","helm":"w74kcmoxj","ring":"xnpno7719","gloves":"5lzcbznld","body":"ub12yl35d","shield":"csb34pzva","bracelet":"ri7qsje6y","pants":"yk4w35h1k","boots":"qjo3fpkpf"},"dmg":{"melee":1,"range":1,"magic":1,"fire":1,"cold":1,"lightning":1},"def":{"melee":1.85622969311756,"range":1.2542729220383129,"magic":3.8250781267619787,"fire":1.1564167262496907,"cold":1.1299560920228722,"lightning":1.1757721163703236}};
		Actor.updateEquip(act);
	}
	*/
	act.equip.melee = "QtestEnemy-weapon";
	Actor.updateEquip(act);
}


Test.removeEquipInventory = function(key){
	for(var i in List.main[key].invList.data){
		var a = List.main[key].invList.data[i];
		if(Db.equip[a[0]]) Itemlist.remove(key,a[0]);
	}
}

Test.a = function(type){
	
}
Test.b = function(){}
Test.c = function(){}
Test.d = function(){}

Test.dmgMod = {player:1,enemy:5,pvp:-0.8};
Test.offPvp = function(){
	for(var i in List.main){
		Command.list.pvp(i);	
	}
}








