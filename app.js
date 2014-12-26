//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN

MINIFY = true;
GAME_VERSION = 'v1.2';
QUEST_CREATOR_VERSION = 'v1.1';
INFO = function(){ console.log.apply(console,arguments); };	//so doesnt show in search all
require(MINIFY ? './server/min.js' : './server/private/App_private').init_app();
