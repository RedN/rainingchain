Test = {};

//Main Test Loop
Test.loop = function(){
	Test.performance();
	Test.bandwidth.display();
}
	
		
//Performance
Test.performance = function(){
    if(Test.performance.active && Loop.frameCount % Test.performance.frequence === 0){
        var d = Date.now();	
        permConsoleLog('Performance: ' + Math.round(40*Test.performance.frequence/(d - Test.performance.oldtime)*100+15) + '%');	//+15 cuz weird glitch making 85% them max
        Test.performance.oldtime = d;
    }
};
Test.performance.active = false;
Test.performance.oldtime = Date.now();
Test.performance.frequence = 10*1000/40;


//Bandwidth
Test.bandwidth = function(type,data){
    if(Test.bandwidth[type].active){
        Test.bandwidth[type].size += Test.bandwidth.getSize(data);
		if(Test.bandwidth[type].log) Test.bandwidth[type].logString += stringify(data);
    }
	
}
Test.playerAmount = false;
Test.bandwidth.upload = {'active':false,log:false,'size':0,logString:""};
Test.bandwidth.download = {'active':false,log:false,'size':0,logString:""};
Test.bandwidth.frequence = 10*1000/40;
Test.bandwidth.getSize = function(obj){
    return stringify(obj).length * 2;   //in bytes
}  
Test.bandwidth.display = function(){
    if(Loop.frameCount % Test.bandwidth.frequence === 0){
        if(Test.bandwidth.upload.active) permConsoleLog('Upload: ' + Math.round(Test.bandwidth.upload.size/1000) + ' K bytes');
        if(Test.bandwidth.download.active) permConsoleLog('Download: ' + Math.round(Test.bandwidth.download.size/1000) + ' K bytes');
		if(Test.playerAmount)	permConsoleLog("Player Count: " + Object.keys(List.main).length);		
	}
}


Test.serverStart = function(){
    
}

//Called when player logs in
Test.signIn = function(key){	
	Test.signIn.hideHUD(key);
	
	if(Server.testing){
		Test.enemy(key);
		Itemlist.add(key,'gold');
		TestingQuest(key);
	}
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
	var mort = List.all[key];

	Itemlist.add(inv,'gold');
	Itemlist.add(inv,'teleport');
	
	Actor.teleport(mort,56*32,101*32,"tutorial@MAIN");
	mort.respawnLoc = {safe:{x:56*32,y:101*32,map:"tutorial@MAIN"},recent:{x:56*32,y:101*32,map:"tutorial@MAIN"}};
	
	//mort.respawnLoc = {safe:{x:1000,y:1000,map:"pvpF4A@MAIN"},recent:{x:1000,y:1000,map:"pvpF4A@MAIN"}};
	//Actor.teleport(mort,1000,1000,"tutorial@MAIN");
	//Actor.teleport(mort,1000,1000,"pvpF4A@MAIN");
	
	Chat.add(mort.id,"Note: This is a very early beta. Expect things to change... A LOT.");
	Chat.add(mort.id,"Control: WADS. (For AZERTY users, change key binding via Pref Tab)");
	Chat.add(mort.id," ");
	

	
	
	//PVP
	mort.abilityList = {
		'pvp-bullet':1,
		'pvp-fireball':1,
		'pvp-freeze':1,
		'pvp-explosion':1,
		'pvp-invincibility':1,
		'pvp-heal':1,
	};

	Actor.swapAbility(mort,'pvp-bullet',0);
	Actor.swapAbility(mort,'pvp-explosion',1);
	Actor.swapAbility(mort,'pvp-freeze',2);
	Actor.swapAbility(mort,'pvp-fireball',3);
	Actor.swapAbility(mort,'pvp-heal',4);
	Actor.swapAbility(mort,'pvp-invincibility',5);
	
	
	
	Chat.add(mort.id,"====Attacks:=====");
	Chat.add(mort.id,"Left Click: Arrow.");
	Chat.add(mort.id,"Right Click: Explosion.");
	Chat.add(mort.id,"Shift + Left Click: Iceshard that freezes enemy.");
	Chat.add(mort.id,"Shift + Right Click: x9 Fireball.");
	Chat.add(mort.id,"F: Instant 100% Healing.");
	Chat.add(mort.id,"Space: Invincibility for 4 frames.");



}

//Call every frame for every actor
Test.loop.actor = function(key){
    

}

//Call every frame for every player
Test.loop.player = function(key){
    

}
	
	

Test.a = function(){	//when starting server
	
		
}

Test.spawnEnemy = function(key,info){
	var player = List.all[key];
	
	Actor.creation({
		'xym':{x:player.x,y:player.y,map:player.map},
		"category":info[0] || "bat",		
		"variant":info[1] || "normal",		
		"extra":{},
	});
}

Test.enemy = function(key){
	Actor.teleport(List.all[key],250,250,"testEnemy");
	Itemlist.add(key,'QtestEnemy-enemyGenerator');
	Test.generateEquip(key,0,5);
}

Test.generateEquip = function(key,lvl,maxAmount){
	lvl = lvl || 0;
	maxAmount = maxAmount || 5;
	
	var mort = List.all[key];
	for(var i in mort.equip.piece){
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
		Actor.switchEquip(mort,id,i);
	}
	
}


Test.c = function(){

}

Test.d = function(){

}













