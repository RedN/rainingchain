nodejitsu = typeof process.env.NODEJITSU !== 'undefined';

if(nodejitsu){
	require('nodetime').profile({
		accountKey: '7a06997db310e13bef9840cd1d8cfc1ea45fcc57', 
		appName: 'Raining Chain'//'Node.js Application'
	});
}
require('domain').create().on('error', function(err){ permConsoleLog('domain',err);});	//no idea if working



//Create Server
var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var express = require('express');
request = require('request');
	
crypto = require('crypto');
astar = require('astar');
app = express();
serv = http.createServer(app);
io = socketio.listen(serv); io.set('log level', 1); io.set('heartbeat timeout', 20); io.set('heartbeat interval', 15);

serv.listen(3000);

var clientPath = 'server/';
app.use(express.bodyParser());
app.use(express.static(path.resolve(__dirname, clientPath + 'client')));


//Runescape Calculators:
app.get('/rs', function (req, res) { res.sendfile(__dirname  + '/server/client/rscalc/index.html');});
app.post('/getPrice', function(req, res){	res.send(require('./server/RS_calculators').itemDb);});
app.post('/getExp', function(req, res){	require('./server/RS_calculators').appPostGetExp(req,res); });



//Require
require('./' + clientPath + 'client/js/shared/essentialsShare');

require('./server/Server');
require('./server/db/Db');
main = require('./server/main');


require('./' + clientPath + 'client/js/shared/Actor');
require('./' + clientPath + 'client/js/shared/Main');
require('./server/entity/Actor_creation');
require('./server/entity/Attack');
require('./server/entity/Actor_loop');
require('./server/entity/Actor_loop_ai');
require('./server/entity/Attack_loop');
require('./server/entity/Actor_boss');
require('./server/Loop');

require('./server/Itemlist');
require('./server/send');
require('./server/update');
require('./server/logIn');
require('./server/combat');
require('./server/map');
require('./server/input');
require('./server/chat');
require('./server/dialogue');
require('./server/craft');
require('./server/drop');
require('./server/Skill');
require('./server/Test');
require('./server/performance');
require('./server/Draw');

require('./server/db/Db_enemy');
require('./server/db/Db_ability');
require('./' + clientPath + 'client/js/shared/Db_ability_sub');
require('./server/db/Db_item');
require('./server/db/Db_plan');
require('./server/db/Db_equip');
require('./server/db/Db_boost');
require('./server/db/Db_material');
require('./server/db/Db_map');

require('./server/db/Db_quest');
require('./server/Quest');

require('./' + clientPath + 'client/js/shared/customMod');
require('./' + clientPath + 'client/js/shared/Collision');
require('./' + clientPath + 'client/js/shared/Db_stat');
require('./' + clientPath + 'client/js/shared/constant');
require('./' + clientPath + 'client/js/shared/Button');
require('./' + clientPath + 'client/js/shared/Db_sprite');
require('./' + clientPath + 'client/js/shared/anim');
require('./' + clientPath + 'client/js/shared/Actor_init');
require('./' + clientPath + 'client/js/shared/command');
require('./' + clientPath + 'client/js/shared/Combat_sub');
require('./' + clientPath + 'client/js/shared/passiveGrid');
require('./' + clientPath + 'client/js/shared/queryShare');
require('./' + clientPath + 'client/js/shared/clanShare');
require('./' + clientPath + 'client/js/shared/Db_customboost');





io.sockets.on('connection', function (socket) { socket.on('Server.start', Server.start)});

if(!nodejitsu && !process.argv[4])	Server.start({
	db:false,
	localdb:+process.argv[2],
	deletedb:process.argv[3],
});




