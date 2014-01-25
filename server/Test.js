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
        permConsoleLog('Performance: ' + Math.round(40*Test.performance.frequence/(d - Test.performance.oldtime)*100) + '%');	
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
    }
}
Test.bandwidth.upload = {'active':false,'size':0};
Test.bandwidth.download = {'active':false,'size':0};
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
    Itemlist.add(inv,'gold');
	Itemlist.add(inv,'test');
	Itemlist.add(inv,'boost_orb',1000);
	Itemlist.add(inv,'upgrade_orb',1000);
	Itemlist.add(inv,'removal_orb',1000);
	
}

//Call every frame for every actor
Test.loop.actor = function(key){
    

}

//Call every frame for every player
Test.loop.player = function(key){
    

}
	
	

Test.a = function(){	//when starting server

		
}

Test.b = function(key,amount){
	
	console.log(1);
	atk = {'type':"bullet",'angle':15,'amount':1, 'aim': 0,'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"ice2",'sizeMod':0.5},
		'dmgMain':1,'dmgRatio':{'melee':15,'range':5,'magic':5,'fire':2,'cold':27,'lightning':0}};

		
	var start = Date.now();
	for(var i = 0 ; i< amount;i++){
		Attack.creation(
			{x:1000,y:1000,map:'ryve@MAIN',hitIf:'enemy',angle:0},
			useTemplate(Attack.template(),atk)
		);
	}
	console.log(Date.now()-start);
}


Test.c = function(){

}

Test.d = function(){

}













