//git commit -am "your message goes here"
//git push -u origin master

cloud9 = typeof process.env.PORT !== 'undefined';
nodejitsu = typeof process.env.NODEJITSU !== 'undefined';

//Create Server
var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var express = require('express');
crypto = require('crypto');
astar = require('astar');




router = express();
serv = http.createServer(router);
io = socketio.listen(serv); io.set('log level', 1); io.set('heartbeat timeout', 20); io.set('heartbeat interval', 15);

if(cloud9){ serv.listen(process.env.PORT, process.env.IP);}	//if using cloud9
else {serv.listen(3000);}	//if using on own PC, go http://localhost:3000/ 

var clientPath = 'server/';
router.use(express.static(path.resolve(__dirname, clientPath + 'client')));


DEBUG = function(text){ permConsoleLog(text); }

//Require
require('./' + clientPath + 'client/js/shared/essentialsShare');

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
Db.quest['Qtutorial'] = require('./server/db/quest/Qtutorial').quest;
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


/*
Init.db('test',+process.argv[2],process.argv[3]);	//if(process.argv[2]) => delete db
Init.email('mailmailmail');
main.initServer(); 	
*/

Server  =  {
	ready:0,
}

Server.start = function(data){
	Init.db(data);
	//Init.email(data.mail);
	main.initServer();
	Server.ready = 1;	
}

io.sockets.on('connection', function (socket) { socket.on('Server.start', Server.start)});
//socket.emit('Server.start',{db:'mongodb://test:test@widmore.mongohq.com:10010/RainingChain_copy'});


if(!nodejitsu && !process.argv[4])	Server.start({
	db:false,
	mongohq:+process.argv[2],
	deletedb:process.argv[3],
});

Beta = {};
Beta.amount = nodejitsu ? 0 : 64;

Beta.disconnectAll = function(){
	for(var i in List.main){
		Sign.off(i,"Admin disconnected every player.");
	}
}
Beta.message = '';



