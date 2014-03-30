Performance = {};

Performance.loop = function(){
	Performance.cpu();
	Performance.bandwidth.display();
}
	
		
//Performance
Performance.cpu = function(){
    if(Performance.cpu.active && Loop.frameCount % Performance.cpu.frequence === 0){
        var d = Date.now();	
        permConsoleLog('Performance: ' + Math.round(40*Performance.cpu.frequence/(d - Performance.cpu.oldtime)*100+15) + '%');	//+15 cuz weird glitch making 85% them max
        Performance.cpu.oldtime = d;
    }
};
Performance.cpu.active = nodejitsu;
Performance.cpu.oldtime = Date.now();
Performance.cpu.frequence = 30*1000/40;


//Bandwidth
Performance.bandwidth = function(type,data){
    if(Performance.bandwidth[type].active){
        Performance.bandwidth[type].size += Performance.bandwidth.getSize(data);
    }
	
}
Performance.playerAmount = nodejitsu;
Performance.bandwidth.upload = {'active':nodejitsu,'size':0};
Performance.bandwidth.download = {'active':nodejitsu,'size':0};
Performance.bandwidth.frequence = 30*1000/40;
Performance.bandwidth.getSize = function(obj){
    return stringify(obj).length * 2;   //in bytes
}  
Performance.bandwidth.display = function(){
    if(Loop.frameCount % Performance.bandwidth.frequence === 0){
        if(Performance.bandwidth.upload.active) permConsoleLog('Upload: ' + Math.round(Performance.bandwidth.upload.size/1000) + ' K bytes');
        if(Performance.bandwidth.download.active) permConsoleLog('Download: ' + Math.round(Performance.bandwidth.download.size/1000) + ' K bytes');
		if(Performance.playerAmount)	permConsoleLog("Player Count: " + Object.keys(List.main).length);		
	}
}
