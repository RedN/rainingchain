setTimeout(function(){ //}

},1000); //{
//##############################################################
//check Debug.js
ts = function(command){
	Socket.emit('testing', {command:command});
}
ts.list = function(){
	ts("JSON.stringify(Account.USERNAME_TO_ID)");
}
ts.help = function(){
	INFO(
	'npc: npc nearby' + '\n' +
	'combat: combat npc nearby' + '\n' +
	'bullet: bullet nearby' + '\n' +
	'human: player nearby' + '\n' +
	'npcAll, combatAll, bulletAll, humanAll: all nearby' + '\n' +
	'all: everything nearby' + '\n' +
	'########################' + '\n' +
	'pa: Player online' + '\n' +
	'name: return player object with that name' + '\n' + 
	'ts.list: Account.USERNAME_TO_ID' + '\n'
	);	
}
ts.npc = function(){ ts('npc'); }
ts.combat = function(){ ts('combat'); }
ts.human = function(){ ts('human'); }
ts.bullet = function(){ ts('bullet'); }
ts.get = function(name){ ts('name("' + name + '");'); }


ts.init = function(){
	Socket.on('testing', function (d) { 
		if(d && d.data){ 
			try { ts.a = JSON.parse(d.data); INFO(ts.a); } 
			catch (err){ ERROR.err(3,err); }	
		}
	});
}


	
	






