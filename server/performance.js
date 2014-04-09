Performance = {};

Performance.loop = function(){
	Performance.cpu();
	Performance.bandwidth.display();
}
	
		
//Performance
Performance.cpu = function(){
    if(Performance.cpu.display && Loop.frameCount % Performance.cpu.frequence === 0){
        var d = Date.now();	
        permConsoleLog('Performance: ' + Math.round(40*Performance.cpu.frequence/(d - Performance.cpu.oldtime)*100+15) + '%');	//+15 cuz weird glitch making 85% them max
        Performance.cpu.oldtime = d;
    }
};
Performance.cpu.display = nodejitsu;
Performance.cpu.oldtime = Date.now();
Performance.cpu.frequence = 30*1000/40;


//Bandwidth
Performance.bandwidth = function(type,data,socket){
	var size = Performance.bandwidth.getSize(data);
	socket.bandwidth[type] += size;
	Performance.bandwidth[type].size += size;
	
	if(socket.bandwidth[type] > Performance.bandwidth[type].limitTotal
		|| socket.bandwidth[type]/Math.max(socket.globalTimer/Cst.MIN,2) > Performance.bandwidth[type].limitPerMin){
		Sign.off(socket.key,'You have capped your bandwidth for this session.');
	}
}


Performance.playerAmount = nodejitsu;
Performance.bandwidth.upload = {'display':nodejitsu,'size':0,'limitTotal':1000*1000000,limitPerMin:50*1000000};		//what server send
Performance.bandwidth.download = {'display':nodejitsu,'size':0,'limitTotal':100*1000000,limitPerMin:100000};	//what client send
Performance.bandwidth.frequence = 30*1000/40;
Performance.bandwidth.getSize = function(obj){
    return stringify(obj||0).length * 2;   //in bytes
}  
Performance.bandwidth.display = function(){
    if(Loop.frameCount % Performance.bandwidth.frequence === 0){
        if(Performance.bandwidth.upload.display) permConsoleLog('Upload: ' + Math.round(Performance.bandwidth.upload.size/1000) + ' K bytes');
        if(Performance.bandwidth.download.display) permConsoleLog('Download: ' + Math.round(Performance.bandwidth.download.size/1000) + ' K bytes');
		if(Performance.playerAmount)	permConsoleLog("Player Count: " + Object.keys(List.main).length);		
	}
}
