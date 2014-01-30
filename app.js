//git commit -am "your message goes here"
//git push -u origin master

cloud9 = typeof process.env.PORT !== 'undefined';

//Create Server
http = require('http');
path = require('path');
socketio = require('socket.io');
express = require('express');
crypto = require('crypto');
astar = require('astar');




router = express();
serv = http.createServer(router);
io = socketio.listen(serv); io.set('log level', 1); io.set('heartbeat timeout', 20); io.set('heartbeat interval', 15);

if(cloud9){ serv.listen(process.env.PORT, process.env.IP);}	//if using cloud9
else {serv.listen(3000);}	//if using on own PC, go http://localhost:3000/ 

var clientPath = 'server/';
router.use(express.static(path.resolve(__dirname, clientPath + 'client')));

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
require('./server/trade');
require('./server/Skill');
require('./server/Test');
require('./server/Draw');

require('./server/db/Db_enemy');
require('./server/db/Db_ability');
require('./server/db/Db_item');
require('./server/db/Db_equip');
require('./server/db/Db_boost');
require('./server/db/Db_material');
		
require('./' + clientPath + 'client/js/shared/Collision');
require('./' + clientPath + 'client/js/shared/Db_stat');
require('./' + clientPath + 'client/js/shared/constant');
require('./' + clientPath + 'client/js/shared/Button');
require('./' + clientPath + 'client/js/shared/Db_sprite');
require('./' + clientPath + 'client/js/shared/anim');
require('./' + clientPath + 'client/js/shared/Actor_init');
require('./' + clientPath + 'client/js/shared/Command');
require('./' + clientPath + 'client/js/shared/Combat_sub');
require('./' + clientPath + 'client/js/shared/passiveGrid');
require('./' + clientPath + 'client/js/shared/queryShare');
require('./' + clientPath + 'client/js/shared/clanShare');
require('./' + clientPath + 'client/js/shared/Db_quest');
require('./' + clientPath + 'client/js/shared/Quest');
require('./' + clientPath + 'client/js/shared/Db_customboost');

Init.db('test');
Init.email('mailmailmail');
main.initServer(); 	
/*	
io.sockets.on('connection', function (socket) {
	socket.on('initServer', function (data) {
		Init.db(data.db);
		Init.email(data.mail);
		main.initServer(); 	
	});
});
*/