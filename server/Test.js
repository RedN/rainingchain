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
Test.playerStart = function(key){	
	var inv = List.main[key].invList;
	var mort = List.all[key];
    
	Test.firstLog(key);
}

Test.firstLog = function(key){
	var inv = List.main[key].invList;
	var mort = List.all[key];
    
	
	/*
	Itemlist.add(inv,'gold');
	Itemlist.add(inv,'teleport');
	*/
	
	var al = {
		'pvp-bullet':1,
		'pvp-fireball':1,
		'pvp-freeze':1,
		'pvp-explosion':1,
		'pvp-invincibility':1,
		'pvp-heal':1,

	};
	for(var i in al) mort.abilityList[i] = al[i];
	
	
	Actor.swapAbility(mort,'pvp-bullet',0);
	Actor.swapAbility(mort,'pvp-explosion',1);
	Actor.swapAbility(mort,'pvp-freeze',2);
	Actor.swapAbility(mort,'pvp-fireball',3);
	Actor.swapAbility(mort,'pvp-heal',4);
	Actor.swapAbility(mort,'pvp-invincibility',5);
	
	//Actor.teleport(mort,56*32,101*32,"tutorial@MAIN");
	//mort.respawnLoc = {safe:{x:56*32,y:101*32,map:"tutorial@MAIN"},recent:{x:56*32,y:101*32,map:"tutorial@MAIN"}};
	
	//mort.respawnLoc = {safe:{x:1000,y:1000,map:"pvpF4A@MAIN"},recent:{x:1000,y:1000,map:"pvpF4A@MAIN"}};
	Actor.teleport(mort,1000,1000,"tutorial@MAIN");
	//Actor.teleport(mort,1000,1000,"pvpF4A@MAIN");
	
	Chat.add(mort.id,"Note: This is a very early beta. Expect things to change... A LOT.");
	Chat.add(mort.id,"Control: WADS. (For AZERTY users, change key binding via Pref Tab)");
	Chat.add(mort.id," ");
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
	
	
Test.ratio = function(info){
	var tmp = deepClone(info);
	tmp.main = round(tmp.main,2);
	var array = [];
	for(var i in tmp.ratio){
		array.push(round(tmp.ratio[i],2))
	}
	tmp.ratio = array;
	return tmp;
}

Test.a = function(){	//when starting server
	
		
}

Test.b = function(key,amount){
	
}


Test.c = function(){

}

Test.d = function(){

}













