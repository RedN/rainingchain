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

router.use(express.static(path.resolve(__dirname, 'client')));

if(cloud9){ serv.listen(process.env.PORT, process.env.IP);}	//if using cloud9
else {serv.listen(3000);}	//if using on own PC, go http://localhost:3000/ 





require('./client/js/shared/essentialsShare');

db = require('./server/db/mongodb');
main = require('./server/main');


require('./client/js/shared/Player');
require('./server/entity/Mortal');
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
require('./server/utility');
require('./server/Bank');

require('./server/db/Enemy');
require('./server/db/ability');
require('./server/db/Item');
require('./server/db/Armor');
require('./server/db/Weapon');
		
require('./client/js/shared/Collision');
require('./client/js/shared/statShare');
require('./client/js/shared/constant');
require('./client/js/shared/buttonShare');
require('./client/js/shared/spriteDb');
require('./client/js/shared/mortShare');
require('./client/js/shared/drawShare');
require('./client/js/shared/commandShare');
require('./client/js/shared/utilityShare');
require('./client/js/shared/drawUtility');
require('./client/js/shared/passiveGrid');
require('./client/js/shared/queryShare');
require('./client/js/shared/clanShare');
require('./client/js/shared/questShare');
require('./client/js/shared/equipBoost');


main.startGame();   //