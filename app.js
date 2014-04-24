NODEJITSU = typeof process.env.NODEJITSU !== 'undefined';
SERVER = true;

if(NODEJITSU) require('nodetime').profile({accountKey: '7a06997db310e13bef9840cd1d8cfc1ea45fcc57',appName: 'Raining Chain'});

//Create Server
var http = require('http');
var path = require('path');
var express = require('express');


var app = express();
var serv = http.createServer(app);
io = require('socket.io').listen(serv); io.set('log level', 1); io.set('heartbeat timeout', 20); io.set('heartbeat interval', 15);

serv.listen(3000);

var clientPath = './server/client/js/shared/';
var serverPath = './server/';

app.use(express.compress());
app.use(express.bodyParser());
app.use(express.static(path.resolve(__dirname, 'server/client')));	//need to be entered manually


//Runescape Calculators:
app.get('/rs', function (req, res) { res.sendfile(__dirname  + '/server/client/rscalc/index.html');});
app.post('/getPrice', function(req, res){	res.send(require('./server/RS_calculators').itemDb);});
app.post('/getExp', function(req, res){	require('./server/RS_calculators').appPostGetExp(req,res); });


//Require
require(clientPath + 'essentialsShare');
require(serverPath + 'Server');
require(serverPath + 'Db');
require(serverPath + 'main');
require(serverPath + 'cycle');
require(serverPath + 'Socket');


require(clientPath + 'Actor_combat');
require(clientPath + 'Actor_boost');
require(serverPath + 'Actor_interaction');
require(serverPath + 'Actor_death');
require(serverPath + 'Actor_ability');
require(serverPath + 'Actor_equip');
require(serverPath + 'Actor_loop');
require(serverPath + 'Actor_loop_ai');
require(serverPath + 'Actor_creation');
require(clientPath + 'Main');
require(serverPath + 'Attack');
require(serverPath + 'Attack_loop');
require(serverPath + 'Actor_boss');
require(serverPath + 'Loop');

require(serverPath + 'Itemlist');
require(serverPath + 'send');
require(serverPath + 'update');
require(serverPath + 'logIn');
require(serverPath + 'Entergame');
require(serverPath + 'combat');
require(serverPath + 'map');
require(serverPath + 'input');
require(serverPath + 'chat');
require(serverPath + 'dialogue');
require(serverPath + 'craft');
require(serverPath + 'drop');
require(serverPath + 'Skill');
require(serverPath + 'Test');
require(serverPath + 'performance');

require(serverPath + 'Db_enemy');
require(serverPath + 'Db_ability');
require(clientPath + 'Db_ability_sub');
require(serverPath + 'Db_item');
require(serverPath + 'Db_plan');
require(serverPath + 'Db_equip');
require(serverPath + 'Db_boost');
require(serverPath + 'Db_material');
require(serverPath + 'Db_map');

require(serverPath + 'Db_quest');
require(serverPath + 'Quest');
require(serverPath + 'clan');

require(clientPath + 'customMod');
require(clientPath + 'Collision');
require(clientPath + 'Db_stat');
require(clientPath + 'constant');
require(clientPath + 'Button');
require(clientPath + 'Db_sprite');
require(clientPath + 'anim');
require(clientPath + 'Actor_init');
require(clientPath + 'command');
require(clientPath + 'Combat_sub');
require(clientPath + 'passiveGrid');
require(clientPath + 'queryShare');
require(clientPath + 'ts');
require(clientPath + 'Db_customboost');






io.sockets.on('connection', function (socket) { socket.on('Server.start', Server.start)});

if(!NODEJITSU && !process.argv[4])	Server.start({
	db:false,
	localdb:+process.argv[2],
	deletedb:+process.argv[3],
});




