//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
/*
var zeldaIp = {};
var updateIp = function(){
	var now = Date.now();
	for(var i in zeldaIp){
		if(now - zeldaIp[i].time > 1000*60)
			zeldaIp[i].amount--;
		if(zeldaIp[i].amount <= 0)
			delete zeldaIp[i];
	}
}

exports.getSavestate = function(req, res, next){
	zeldaIp[req.ip] = zeldaIp[req.ip] || {time:0,amount:0};
	if(zeldaIp[req.ip].amount > 10) 
		return res.send('If you want to download massively, use Savestate Compilation hosted on Mediafire instead.<br>Links on top of table.');		
	zeldaIp[req.ip].time = Date.now();
	zeldaIp[req.ip].amount++;
	
	var info = req.params.file;
	var folder = info.split('@')[0];
	var file = info.split('@')[1];
	var path = __dirname + '/savestate/' + folder + '/' + file;
	res.download(path);
}

exports.getZeldaIp = function(){
	return zeldaIp;
}

*/







