//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Sign','Server'],['Performance']));

var Performance = exports.Performance = {};

Performance.loop = function(){
	Performance.loop.FRAME_COUNT++;
	Performance.cpu();
	Performance.bandwidth.display();
}
Performance.loop.FRAME_COUNT = 0;
		
//Performance
Performance.cpu = function(){
	Performance.cpu.LAST_TICK_LENGTH = Date.now()-Performance.cpu.LAST_TICK_TIME;
	Performance.cpu.LAST_TICK_TIME = Date.now();
	
    if(Performance.cpu.DISPLAY && Performance.loop.FRAME_COUNT % Performance.cpu.FREQUENCE === 0){
        var d = Date.now();	
        INFO('Performance (Include Server + Client Lag): ' + Math.round(40*Performance.cpu.FREQUENCE/(d - Performance.cpu.OLD_TIME)*100+15) + '%');	//+15 cuz weird glitch making 85% them max
        Performance.cpu.OLD_TIME = d;
    }
};
Performance.cpu.DISPLAY = NODEJITSU;
Performance.cpu.OLD_TIME = Date.now();
Performance.cpu.FREQUENCE = 60*1000/40;
Performance.cpu.LAST_TICK_LENGTH = 0;
Performance.cpu.LAST_TICK_TIME = 0;

Performance.getTickInfo = function(){
	return Performance.cpu.LAST_TICK_LENGTH + 'ms = ' + 1000/Performance.cpu.LAST_TICK_LENGTH + ' FPS';
}

//Bandwidth
Performance.bandwidth = function(type,data,socket,interval){
	interval = interval || 1;
	var size = Performance.bandwidth.getSize(data) * interval;
	socket.bandwidth[type] += size;
	Performance.bandwidth[type].size += size;
	
	if(socket.bandwidth[type] > Performance.bandwidth[type].limitTotal
		|| socket.bandwidth[type]/Math.max(socket.globalTimer/CST.MIN,2) > Performance.bandwidth[type].limitPerMin){
		Sign.off(socket.key,'You have capped your bandwidth for this session.');
	}
}


Performance.DISPLAY_PLAYER_AMOUNT = NODEJITSU;
Performance.bandwidth.UPLOAD = {display:NODEJITSU,size:0,limitTotal:1000*1000000,limitPerMin:50*1000000};		//what server send
Performance.bandwidth.DOWNLOAD = {display:NODEJITSU,size:0,limitTotal:100*1000000,limitPerMin:100000};	//what client send
Performance.bandwidth.FREQUENCE = 60*1000/40;
Performance.bandwidth.getSize = function(obj){
	return (Tk.stringify(obj||0).length * 2) || 0;   //in bytes
}  
Performance.bandwidth.display = function(){
    if(Performance.loop.FRAME_COUNT % Performance.cpu.FREQUENCE !== 0) return;
	
	if(Performance.bandwidth.UPLOAD.display) INFO('Upload: ' + Math.round(Performance.bandwidth.UPLOAD.size/1000) + ' K bytes');
	if(Performance.bandwidth.DOWNLOAD.display) INFO('Download: ' + Math.round(Performance.bandwidth.DOWNLOAD.size/1000) + ' K bytes');
	if(Performance.DISPLAY_PLAYER_AMOUNT)	INFO("Player Count: " + Server.getPlayerAmount());		
}


