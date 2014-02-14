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
    }
}


Test.serverStart = function(){
    
}

//Called when player logs in
Test.playerStart = function(key){	
	var inv = List.main[key].invList;
	var mort = List.all[key];
    
	
	
	Itemlist.add(inv,'gold');
    /*
	Itemlist.add(inv,'teleport');
	*/
	
	var al = {
		'bulletMulti':1,
		'bulletMulti-boom':1,
		'bulletMulti-para':1,
		'bulletMulti-sin':1,
		'bulletMulti-hitmod':1,
		'bulletMulti-fast':1
	};
	for(var i in al) mort.abilityList[i] = al[i];
	
	
	Actor.teleport(mort,56*32,101*32,"tutorial@MAIN");
	mort.respawnLoc = {safe:{x:56*32,y:101*32,map:"tutorial@MAIN"},recent:{x:56*32,y:101*32,map:"tutorial@MAIN"}};
	Itemlist.add(inv,'teleport');
	
	/*
	Itemlist.add(inv,'test');
	Itemlist.add(inv,'wood-20',1000);
	Itemlist.add(inv,'boost_orb',1000);
	Itemlist.add(inv,'upgrade_orb',1000);
	Itemlist.add(inv,'removal_orb',1000);
	*/
	
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













