Test = {};

frameCount = 0; 


//Main Test Loop
Test.loop = function(){
	frameCount++;
	Test.performance();
	Test.bandwidth.display();
	
}
	
		
//Performance
Test.performance = function(){
    if(Test.performance.active && frameCount % Test.performance.frequence === 0){
        var d = Date.now();	
        permConsoleLog('Performance: ' + Math.round(40*Test.performance.frequence/(d - Test.performance.oldtime)*100) + '%');	
        Test.performance.oldtime = d;
    }
};
Test.performance.active = false;
Test.performance.oldtime = Date.now();
Test.performance.frequence = 10000/40;


//Bandwidth
Test.bandwidth = function(type,data){
    if(Test.bandwidth[type].active){
        Test.bandwidth[type].size += Test.bandwidth.getSize(data);
    }
}
Test.bandwidth.upload = {'active':false,'size':0};
Test.bandwidth.download = {'active':false,'size':0};
Test.bandwidth.frequence = 10000/40;
Test.bandwidth.getSize = function(obj){
    return stringify(obj).length * 2;   //in bytes
}  
Test.bandwidth.display = function(){
    if(frameCount % Test.bandwidth.frequence === 0){
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

//Call every frame for every mortal
Test.loop.mortal = function(key){
    

}

//Call every frame for every player
Test.loop.player = function(key){
    

}
	
	

Test.a = function(){	//when starting server

	
}

Test.b = function(key){

	
}


Test.c = function(key){

}

Test.d = function(key){

}













