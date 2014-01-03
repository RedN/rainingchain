//git commit -am "your message goes here"
//git push -u origin master

cloud9 = typeof process.env.PORT !== 'undefined';
dbpsw = process.argv[2] || 'test';


//Create Server
http = require('http');
path = require('path');
socketio = require('socket.io');
express = require('express');
//bcrypt = require('bcrypt');

router = express();
serv = http.createServer(router);
io = socketio.listen(serv); io.set('log level', 1); io.set('heartbeat timeout', 20); io.set('heartbeat interval', 15);

var clientPath = 'server/';

router.use(express.static(path.resolve(__dirname, clientPath + 'client')));

if(cloud9){ serv.listen(process.env.PORT, process.env.IP);}	//if using cloud9
else {serv.listen(3000);}	//if using on own PC, go http://localhost:3000/ 

require('./' + clientPath + 'client/js/shared/essentialsShare');

require('./server/db/Db');
main = require('./server/main');


require('./' + clientPath + 'client/js/shared/Mortal');
require('./' + clientPath + 'client/js/shared/Main');
require('./server/entity/Mortal_creation');
require('./server/entity/Attack');
require('./server/entity/Mortal_loop');
require('./server/entity/Attack_loop');
require('./server/entity/boss');
require('./server/Loop');

require('./server/Inventory');
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
require('./server/Shop');
require('./server/trade');
require('./server/Skill');
require('./server/Test');

require('./server/db/EnemyDb');
require('./server/db/AbilityDb');
require('./server/db/ItemDb');
require('./server/db/EquipDb');
		
require('./' + clientPath + 'client/js/shared/Collision');
require('./' + clientPath + 'client/js/shared/stat');
require('./' + clientPath + 'client/js/shared/constant');
require('./' + clientPath + 'client/js/shared/buttonShare');
require('./' + clientPath + 'client/js/shared/sprite');
require('./' + clientPath + 'client/js/shared/anim');
require('./' + clientPath + 'client/js/shared/Mortal_init');
require('./' + clientPath + 'client/js/shared/drawShare');
require('./' + clientPath + 'client/js/shared/command');
require('./' + clientPath + 'client/js/shared/utilityShare');
require('./' + clientPath + 'client/js/shared/drawUtility');
require('./' + clientPath + 'client/js/shared/passiveGrid');
require('./' + clientPath + 'client/js/shared/queryShare');
require('./' + clientPath + 'client/js/shared/clanShare');
require('./' + clientPath + 'client/js/shared/questShare');
require('./' + clientPath + 'client/js/shared/equipBoost');


main.initServer();   //