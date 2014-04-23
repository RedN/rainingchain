Test = {};

Test.loop = function(){


}

Test.serverStart = function(){
    
}

Test.no = {
	npc:false,
	attack:false,
};

Test.signIn = function(key){ //Called when player logs in
	var act = List.all[key];
	Test.signIn.hideHUD(key);
	Test.signIn.quest(key);
	Test.signIn.teleport(key);
	
	if(Server.testing){
		Db.quest["Qtest"].event.start(key);	//test
		if(Quest.test){
			Itemlist.add(key,Quest.test + '-QuestTester');
			if(Db.quest[Quest.test].event.test && Db.quest[Quest.test].event.test.signIn)
				Db.quest[Quest.test].event.test.signIn(key);
		}
	}

	Actor.permBoost(act,'Player',[
		{stat:'bullet-spd',value:0.5,type:'+'},
	]);	
	
	
	
	Test.signIn.fixAbilityCharge(key);	//BUG?
}

Test.signIn.teleport = function(key){
	var act = List.all[key];
	act.map = null;
	
	var recentmap = Actor.teleport.getMapName(act,act.respawnLoc.recent.map);
	if(List.map[recentmap])
		Actor.teleport(act,act.respawnLoc.recent);
	else Actor.teleport(act,act.respawnLoc.safe);
}

Test.firstSignIn = function(key){
	var inv = List.main[key].invList;
	var act = List.all[key];
			
	Chat.add(act.id,"Note: This is a very early beta. Expect things to change... A LOT.");
	Chat.add(act.id,"Control: WADS. (For AZERTY users, change key binding via Pref Tab)");
	
	Actor.setRespawn(act,{x:1500,y:5000,map:'goblinLand@MAIN'});	//here if no Quest.test
	if(Db.quest[Quest.test] && Db.quest[Quest.test].event.test && Db.quest[Quest.test].event.test.firstSignIn){
		Db.quest[Quest.test].event.test.firstSignIn(key);
	}
	
	
}

Test.signIn.fixAbilityCharge = function(key){
	for(var i in List.all[key].abilityChange.charge) 
		List.all[key].abilityChange.charge[i] = 0;
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

Test.signIn.quest = function(key){
	var mq = List.main[key].quest;
	for(var i in mq){
		if(mq[i].started && Db.quest[i].event.signIn)
			Db.quest[i].event.signIn(key);	
	}
}


Test.setAbility = function(key){
	var act = List.all[key];
	//PVP
	act.abilityList = Actor.template.abilityList({
		'pvp-bullet':1,
		'pvp-fireball':1,
		'pvp-freeze':1,
		'pvp-explosion':1,
		'pvp-invincibility':1,
		'pvp-heal':1,
	});

	Actor.ability.swap(act,'pvp-bullet',0);
	Actor.ability.swap(act,'pvp-explosion',1);
	Actor.ability.swap(act,'pvp-freeze',2);
	Actor.ability.swap(act,'pvp-fireball',3);
	Actor.ability.swap(act,'pvp-heal',4);
	Actor.ability.swap(act,'pvp-invincibility',5);
	
}

Test.spawnEnemy = function(key,cat,variant){
	cat = cat || 'bat';
	variant = variant || 'normal';
	
	var player = List.all[key];
	if(!Db.npc[cat][variant]){ ERROR(4,"no npc with that cat and var"); return;}
	Actor.creation({
		'spot':{x:player.x,y:player.y,map:player.map},
		"category":cat,		
		"variant":variant,		
		"extra":{},
	});
}

Test.invincible = function(key){
	Actor.permBoost(List.all[key],'Test.invincible',[
		{stat:'globalDef',value:1000,type:'+'},
		{stat:'globalDmg',value:1000,type:'+'},
	]);	
}


Test.generateEquip = function(key,lvl,maxAmount){
	var act = List.all[key];
	
	/*
	if(!NODEJITSU){
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
			Actor.equip(act,id);
		}
	}
	
	if(NODEJITSU){
		act.equip.melee = "QtestEnemy-weapon";
		//act.equip = {"piece":{"melee":"QtestEnemy-weapon","range":"24fvltcng","magic":"ipw6bxde4","amulet":"kc3fy1ltl","helm":"w74kcmoxj","ring":"xnpno7719","gloves":"5lzcbznld","body":"ub12yl35d","shield":"csb34pzva","bracelet":"ri7qsje6y","pants":"yk4w35h1k","boots":"qjo3fpkpf"},"dmg":{"melee":1,"range":1,"magic":1,"fire":1,"cold":1,"lightning":1},"def":{"melee":1.85622969311756,"range":1.2542729220383129,"magic":3.8250781267619787,"fire":1.1564167262496907,"cold":1.1299560920228722,"lightning":1.1757721163703236}};
		Actor.update.equip(act);
	}
	*/
	act.equip.melee = "QtestEnemy-weapon";
	Actor.update.equip(act);
}


Test.removeEquipInventory = function(key){
	for(var i in List.main[key].invList.data){
		var a = List.main[key].invList.data[i];
		if(Db.equip[a[0]]) Itemlist.remove(key,a[0]);
	}
}

Test.a = function(){
	
}
Test.b = function(){}
Test.c = function(){}
Test.d = function(){}

Test.dmgMod = {player:1,npc:5,pvp:-0.8};
Test.offPvp = function(){
	for(var i in List.main){
		Command.list.pvp(i);	
	}
}








