//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
/*process.argv: 
0:node
1:app.js
2:deletedb			0
3:uselocaldb		0
4:notstartserver	0
5:notuseprivate		0
6:port				3000
*/
	
cluster = require('cluster');
cluster.on('exit', function (worker) {
    console.log('Worker ' + worker.id + ' died :(');
    cluster.fork();
});

if(cluster.isMaster) {
	var cpuCount = require('os').cpus().length;   
    for (var i = 0; i < 1 && i < cpuCount; i++){
        cluster.fork();
    }
} else {
	NODEJITSU = typeof process.env.NODEJITSU !== 'undefined';
	SERVER = true;
	penv = process.env;
	
	//Create Server
	var http = require('http');
	var path = require('path');
	var express = require('express');

	var app = express();
	var serv = require('http').Server(app);
	var io = require('socket.io')(serv,{});
	serv.listen(process.env.PORT || +process.argv[6] || 3000);
	//serv.listen(3000 + cluster.worker.id);

	app.use(express.compress());
	app.use(express.bodyParser());
	app.use(express.static(path.resolve(__dirname, 'server/client')));
	
	var busy = require('busy'); var busyCheck = busy();
	app.use(function(req, res, next) { if(busyCheck.blocked) return res.send(503, "I'm busy right now, sorry."); next();});
	
	/*
	app.use(function(err, req, res, next){
		if (err.status == 404){	res.statusCode = 404; res.send('Cant find that file, sorry!'); }
		else next(err);
	});
	*/
	
	var Dm = require('./server/dependencyManager');
	Dm.setIo(io,app);
	
	
	
	//Load
	Dm.loadModuleDb();
	Dm.loadModule('client','Toolkit');
	Dm.loadModule('client','CST');
	Dm.loadModule('server','main');	//List Db
	Dm.loadModule('server','Server');
	Dm.loadModule('server','Server_socket');
	Dm.loadModule('server','Cycle');
	Dm.loadModule('server','Account');
	Dm.loadModule('client','Actor');
	Dm.loadModule('client','Actor_combat');
	Dm.loadModule('client','Actor_boost');
	Dm.loadModule('server','Actor_interaction');
	Dm.loadModule('server','Actor_death');
	Dm.loadModule('server','Actor_ability');
	Dm.loadModule('server','Actor_equip');
	Dm.loadModule('server','Actor_loop');
	Dm.loadModule('server','Actor_loop_ai');
	Dm.loadModule('server','Actor_creation');
	Dm.loadModule('server','Attack');
	Dm.loadModule('server','Attack_loop');
	Dm.loadModule('server','Map');	//before Db_map
	Dm.loadModule('client','Contribution');
	Dm.loadModule('server','Db_npc');
	Dm.loadModule('server','Db_ability');
	Dm.loadModule('server','Db_item');
	Dm.loadModule('server','Db_plan');
	Dm.loadModule('server','Db_equip');
	Dm.loadModule('server','Db_boost');
	Dm.loadModule('server','Db_material');
	Dm.loadModule('server','Db_map');
	Dm.loadModule('server','Db_quest');
	Dm.loadModule('client','Db_statCustom');
	Dm.loadModule('client','Db_customMod');
	Dm.loadModule('server','Party');
	Dm.loadModule('client','Main');
	Dm.loadModule('server','Boss');
	Dm.loadModule('server','Loop');
	Dm.loadModule('server','Itemlist');
	Dm.loadModule('server','Change_send');	//before Change_update
	Dm.loadModule('server','Change_update');
	Dm.loadModule('server','Sign');
	Dm.loadModule('server','Sign_enterGame');
	Dm.loadModule('server','Combat');
	Dm.loadModule('client','Combat_shared');
	Dm.loadModule('server','Input');
	Dm.loadModule('server','Chat');
	Dm.loadModule('server','Dialogue');
	Dm.loadModule('server','Craft');
	Dm.loadModule('server','Drop');
	Dm.loadModule('server','Skill');
	Dm.loadModule('server','Test');
	Dm.loadModule('server','Performance');
	Dm.loadModule('server','Quest');
	Dm.loadModule('server','Clan');
	Dm.loadModule('client','Collision');
	Dm.loadModule('client','Db_stat');
	Dm.loadModule('client','Button');
	Dm.loadModule('client','Db_sprite');
	Dm.loadModule('client','Anim');
	Dm.loadModule('client','Command');
	Dm.loadModule('client','Passive');
	Dm.loadModule('client','Db_query');
	Dm.loadModule('client','Db_query_admin');
	
	//Runescape Calculators:	//rscalc
	var RSCALC = require('./server/client/rs/RS_server');
	app.get('/rs', function (req, res) { res.sendfile(__dirname  + '/server/client/rs/index.html');});
		
	app.post('/getPrice', function(req, res){	res.send({itemDb:RSCALC.itemDb,lastUpdate:RSCALC.lastUpdate});});
	app.post('/getExp', function(req, res){	RSCALC.appPostGetExp(req,res); });
	
	
	//Zelda
	app.get('/zelda', function (req, res) { res.sendfile(__dirname  + '/server/client/zelda/index.html');});
	
	
	
	
}




