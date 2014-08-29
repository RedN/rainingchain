//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
if(NODEJITSU){
	process.on('uncaughtException', function(err) {	//TOFIX cluster/domain
		if(Date.now() - startServer > 10000) moduleAll.Server.reset(err.stack);
	});
}
var startServer = Date.now();

//Require Hax
var moduleList = ["requireDb","Contribution","Boss", "Init", "Server", "Db", "List", "Cycle", "Actor", "Account","Party", "Main", "Attack", "Strike", "Bullet", "Loop", "Activelist", "Group", "Itemlist", "Change", "Sign", "Save", "Load", "Combat", "Map", "Input", "Chat", "Dialogue", "Craft", "Drop", "Skill", "Test", "Performance", "Ability", "Item", "Plan", "Equip", "Quest", "Clan", "Collision", "Button", "Sprite", "Anim", "Command", "PassiveGrid", "Passive"];
var moduleAll = {};
exports.setIo = function(io,app){ 
	moduleAll.io = io;
	moduleAll.app = app;	
}


	
	
var onready = function(){
	moduleAll.io.sockets.on('connection', function (socket) { 
		socket.on('Server.start', function(d){
			if(moduleAll.Server.ready) return socket.disconnect();
			moduleAll.Server.start(d);
		});
	});
	
	if(!NODEJITSU && !+process.argv[4])
		moduleAll.Server.start({
			db:false,
			deletedb:+process.argv[2],
		});
	else console['log']("Send info to connect to the database");
}

//CST, ERROR, INFO always included
exports.loadModule = function(source,str,onlyinclude){
	if(source === 'client') str = './client/js/shared/' + str;
	if(source === 'server') str = './' + str;
	
	var exp = require(str);
	for(var i in exp)
		if(!onlyinclude || onlyinclude.indexOf(i) !== -1)
			moduleAll[i] = exp[i];
}

exports.loadModuleDb = function(){
	if(+process.argv[5]){ Dm.loadModule('server','Db'); return ;}
	
	try { 
		exports.loadModule('server','Db_private',['requireDb','Init']); 
	} catch(err){ 
		if(err.stack.indexOf('Error: Cannot find module') === -1) eval('conso' + 'le.log(err.stack)');
		exports.loadModule('server','Db'); 
	}
}

loadDependency = function(toload, tocreate,later){
	if(toload.indexOf('ERROR') === -1) toload.push('ERROR');
	if(toload.indexOf('INFO') === -1) toload.push('INFO');
	
	Tree.add(toload, tocreate,later);
	
	var str = '';
	if(!later){
		loadDependency.count++;
		for(var i in moduleList)
			str += 'var ' + moduleList[i] + '; ';
		
		for(var i in moduleAll){
			if(toload.indexOf(i) !== -1)	//.have no defined yet...
				str += 'var ' + i + ' = requireModuleAll().' + i + '; ';
		}
		str += 'setTimeout(function(){ eval(loadDependency(' + JSON.stringify(toload) + ',0,true)); },20000000); ';
	} 
	
	if(later){
		for(var i in moduleAll)
			if(toload.indexOf(i) !== -1)
				str += i + ' = requireModuleAll().' + i + '; ';
		if(loadDependency.count === 0 && !loadDependency.onreadyCalledAlready){	
			loadDependency.onreadyCalledAlready = 1;
			onready();
		}
	}
	exports.loadModule('server','Db_private',['requireDb','Init']); 
	return str;
}
loadDependency.count = 0;
loadDependency.onreadyCalledAlready = 0;	//fix qierd bug with loadDependency in /quest/Qpvp, probably if loading everything takes more than 1000 ms

requireModuleAll = function(){
	return moduleAll;
}


//Dependency Tree
var Tree = {};
Tree.display = false;
Tree.add = function(toload, tocreate,later){
	if(Tree.display && later){
		var tmp = {};
		for(var i in moduleAll){
			tmp[i] = [];
			for(var j in Tree.list)
				if(Tree.list[j].need.indexOf(i) !== -1)
					tmp[i].push(j);
		}
		for(var i in tmp) tmp[i] = JSON.stringify(tmp[i]).replaceAll('\'','').replaceAll('\"','');
		moduleAll.INFO(tmp);
		Tree.display = false;
	}
	if(later) return;
	
	var file = Tree.getName(new Error().stack);
	Tree.list[file] = {need:toload,create:tocreate || []};	

}
Tree.list = {};

Tree.getName = function(str){
	var end = str.indexOf(':1:');
	var startstr = 'at Object.<anonymous> (C:\\rc\\rainingchain\\server\\';
	var start = str.indexOf(startstr) + startstr.length;
	var raw = str.slice(start,end);
	var clean = raw.replace('client\\js\\shared\\','');
	return clean;
};

/*
2014-07-23
  requireDb: '[main.js,Server.js,Cycle.js,Account.js,Contribution.js,Db_ability.js,Db_item.js,Db_plan.js,Db_equip.js,Db_quest.js,Db_customMod.js,Sign.js,Sign_enterGame.js,Chat.js,Quest.js,Clan.js,Command.js,Passive.js,Db_query_admin.js]',
  Init: '[main.js,Server.js,Server_socket.js,Cycle.js,Actor.js,Contribution.js,Db_npc.js,Db_ability.js,Db_ability_shared.js,Db_item.js,Db_plan.js,Db_equip.js,Db_boost.js,Db_material.js,Db_map.js,Db_quest.js,Db_statCustom.js,Boss.js,Change_update.js,Dialogue.js,Drop.js,Clan.js,Db_stat.js,Db_sprite.js,Anim.js,Passive.js,Db_query_admin.js]',
  INFO: '[Db_private.js,Toolkit.js,main.js,Server.js,Server_socket.js,Cycle.js,Account.js,Actor.js,Actor_combat.js,Actor_boost.js,Actor_interaction.js,Actor_death.js,Actor_ability.js,Actor_equip.js,Actor_loop.js,Actor_loop_ai.js,Actor_creation.js,Attack.js,Attack_loop.js,Map.js,Contribution.js,Db_npc.js,Db_ability.js,Db_ability_shared.js,Db_item.js,Db_plan.js,Db_equip.js,Db_boost.js,Db_material.js,Db_map.js,Db_quest.js,Db_statCustom.js,Db_customMod.js,Party.js,Main.js,Boss.js,Loop.js,Itemlist.js,Change_send.js,Change_update.js,Sign.js,Sign_enterGame.js,Combat.js,Combat_shared.js,Input.js,Chat.js,Dialogue.js,Craft.js,Drop.js,Skill.js,Test.js,Performance.js,Quest.js,Clan.js,Collision.js,Db_stat.js,Button.js,Db_sprite.js,Anim.js,Command.js,Passive.js,Db_query.js,Db_query_admin.js]',
  ERROR: '[Db_private.js,Toolkit.js,main.js,Server.js,Server_socket.js,Cycle.js,Account.js,Actor.js,Actor_combat.js,Actor_boost.js,Actor_interaction.js,Actor_death.js,Actor_ability.js,Actor_equip.js,Actor_loop.js,Actor_loop_ai.js,Actor_creation.js,Attack.js,Attack_loop.js,Map.js,Contribution.js,Db_npc.js,Db_ability.js,Db_ability_shared.js,Db_item.js,Db_plan.js,Db_equip.js,Db_boost.js,Db_material.js,Db_map.js,Db_quest.js,Db_statCustom.js,Db_customMod.js,Party.js,Main.js,Boss.js,Loop.js,Itemlist.js,Change_send.js,Change_update.js,Sign.js,Sign_enterGame.js,Combat.js,Combat_shared.js,Input.js,Chat.js,Dialogue.js,Craft.js,Drop.js,Skill.js,Test.js,Performance.js,Quest.js,Clan.js,Collision.js,Db_stat.js,Button.js,Db_sprite.js,Anim.js,Command.js,Passive.js,Db_query.js,Db_query_admin.js]',
  Tk: '[Server_socket.js,Cycle.js,Account.js,Actor.js,Actor_combat.js,Actor_boost.js,Actor_interaction.js,Actor_loop.js,Actor_loop_ai.js,Actor_creation.js,Attack.js,Attack_loop.js,Db_npc.js,Db_ability.js,Db_item.js,Db_plan.js,Db_equip.js,Db_boost.js,Db_map.js,Db_quest.js,Boss.js,Itemlist.js,Change_send.js,Sign.js,Sign_enterGame.js,Combat.js,Combat_shared.js,Input.js,Dialogue.js,Craft.js,Drop.js,Skill.js,Performance.js,Quest.js,Collision.js,Db_stat.js,Button.js,Db_sprite.js,Anim.js,Command.js,Passive.js,Db_query.js,Db_query_admin.js]',
  JSONf: '[]',
  CST: '[Db_private.js,Toolkit.js,main.js,Server.js,Server_socket.js,Cycle.js,Account.js,Actor.js,Actor_combat.js,Actor_boost.js,Actor_interaction.js,Actor_death.js,Actor_ability.js,Actor_equip.js,Actor_loop.js,Actor_loop_ai.js,Actor_creation.js,Attack.js,Attack_loop.js,Map.js,Contribution.js,Db_npc.js,Db_ability.js,Db_ability_shared.js,Db_item.js,Db_plan.js,Db_equip.js,Db_boost.js,Db_material.js,Db_map.js,Db_quest.js,Db_statCustom.js,Db_customMod.js,Party.js,Main.js,Boss.js,Loop.js,Itemlist.js,Change_send.js,Change_update.js,Sign.js,Sign_enterGame.js,Combat.js,Combat_shared.js,Input.js,Chat.js,Dialogue.js,Craft.js,Drop.js,Skill.js,Test.js,Performance.js,Quest.js,Clan.js,Collision.js,Db_stat.js,Button.js,Db_sprite.js,Anim.js,Command.js,Passive.js,Db_query.js,Db_query_admin.js]',
  Db: '[Db_private.js,Toolkit.js,Server_socket.js,Cycle.js,Account.js,Actor.js,Actor_boost.js,Actor_interaction.js,Actor_death.js,Actor_ability.js,Actor_equip.js,Actor_loop.js,Actor_loop_ai.js,Actor_creation.js,Contribution.js,Db_npc.js,Db_ability.js,Db_ability_shared.js,Db_item.js,Db_plan.js,Db_equip.js,Db_boost.js,Db_material.js,Db_map.js,Db_quest.js,Db_statCustom.js,Db_customMod.js,Main.js,Boss.js,Itemlist.js,Change_send.js,Change_update.js,Sign.js,Sign_enterGame.js,Combat_shared.js,Chat.js,Dialogue.js,Craft.js,Drop.js,Skill.js,Test.js,Quest.js,Clan.js,Collision.js,Db_stat.js,Db_sprite.js,Anim.js,Command.js,Passive.js,Db_query.js,Db_query_admin.js]',
  List: '[Toolkit.js,Server.js,Server_socket.js,Cycle.js,Account.js,Actor_combat.js,Actor_boost.js,Actor_interaction.js,Actor_death.js,Actor_ability.js,Actor_equip.js,Actor_loop.js,Actor_loop_ai.js,Actor_creation.js,Attack.js,Attack_loop.js,Map.js,Contribution.js,Db_npc.js,Db_ability.js,Db_ability_shared.js,Db_item.js,Db_plan.js,Db_equip.js,Db_map.js,Db_quest.js,Db_customMod.js,Party.js,Main.js,Boss.js,Loop.js,Itemlist.js,Change_send.js,Change_update.js,Sign.js,Sign_enterGame.js,Combat.js,Input.js,Chat.js,Dialogue.js,Craft.js,Drop.js,Skill.js,Test.js,Performance.js,Quest.js,Clan.js,Collision.js,Button.js,Anim.js,Command.js,Passive.js,Db_query.js,Db_query_admin.js]',
  Server: '[Db_private.js,main.js,Server_socket.js,Actor_interaction.js,Actor_death.js,Actor_ability.js,Db_plan.js,Main.js,Loop.js,Change_send.js,Sign.js,Sign_enterGame.js,Chat.js,Skill.js,Quest.js,Db_query_admin.js]',
  Cycle: '[Sign_enterGame.js,Passive.js,Db_query_admin.js]',
  Account: '[Server_socket.js,Sign.js]',
  Actor: '[Toolkit.js,Server.js,Actor_combat.js,Actor_boost.js,Actor_interaction.js,Actor_death.js,Actor_ability.js,Actor_equip.js,Actor_loop.js,Actor_loop_ai.js,Actor_creation.js,Attack.js,Map.js,Contribution.js,Db_npc.js,Db_ability.js,Db_item.js,Db_plan.js,Db_equip.js,Db_map.js,Db_quest.js,Db_statCustom.js,Main.js,Boss.js,Loop.js,Sign.js,Sign_enterGame.js,Combat.js,Combat_shared.js,Input.js,Craft.js,Skill.js,Test.js,Quest.js,Db_stat.js,Button.js,Command.js,Passive.js,Db_query_admin.js]',
  Attack: '[Attack_loop.js,Db_npc.js,Db_ability.js,Combat.js,Db_query.js,Db_query_admin.js]',
  Strike: '[Attack_loop.js,Db_map.js,Loop.js,Db_query_admin.js]',
  Bullet: '[Attack_loop.js,Db_map.js,Loop.js,Collision.js,Db_query_admin.js]',
  Map: '[Actor_interaction.js,Actor_loop.js,Actor_loop_ai.js,Actor_creation.js,Attack.js,Db_map.js,Loop.js,Change_send.js,Sign.js,Sign_enterGame.js,Drop.js,Collision.js,Db_query_admin.js]',
  Contribution: '[Db_private.js,Account.js,Main.js,Sign_enterGame.js,Chat.js,Command.js,Db_query_admin.js]',
  Ability: '[Actor_ability.js,Db_quest.js,Sign.js,Craft.js,Db_query_admin.js]',
  Item: '[Db_ability.js,Db_ability_shared.js,Db_plan.js,Db_equip.js,Db_material.js,Db_quest.js,Craft.js,Db_query_admin.js]',
  Plan: '[Actor_death.js,Db_ability.js,Db_quest.js,Test.js,Quest.js,Db_query_admin.js]',
  Equip: '[Db_quest.js,Craft.js,Db_query_admin.js]',
  Quest: '[Cycle.js,Actor_interaction.js,Actor_creation.js,Db_item.js,Main.js,Sign.js,Sign_enterGame.js,Quest.js,Command.js,Db_query.js,Db_query_admin.js]',
  Party: '[Actor_creation.js,Sign.js,Command.js,Db_query_admin.js]',
  Main: '[Actor_interaction.js,Actor_death.js,Actor_loop.js,Contribution.js,Db_npc.js,Db_ability.js,Db_ability_shared.js,Db_item.js,Db_plan.js,Db_equip.js,Db_quest.js,Loop.js,Sign.js,Quest.js,Command.js,Db_query_admin.js]',
  Boss: '[Actor_loop.js,Actor_creation.js,Boss.js,Db_query_admin.js]',
  Loop: '[main.js,Actor_loop.js,Map.js,Db_quest.js,Main.js,Boss.js,Change_send.js,Change_update.js,Performance.js,Collision.js,Db_query_admin.js]',
  Activelist: '[Actor_interaction.js,Actor_death.js,Actor_loop.js,Attack.js,Map.js,Change_send.js,Db_sprite.js,Db_query_admin.js]',
  Group: '[Db_map.js,Db_query_admin.js]',
  Itemlist: '[Actor_interaction.js,Actor_equip.js,Db_item.js,Db_plan.js,Db_equip.js,Db_quest.js,Main.js,Sign.js,Sign_enterGame.js,Craft.js,Test.js,Quest.js,Command.js,Db_query_admin.js]',
  Change: '[Actor_creation.js,Loop.js,Change_send.js,Change_update.js,Sign_enterGame.js,Db_query_admin.js]',
  Sign: '[Server.js,Server_socket.js,Account.js,Loop.js,Sign_enterGame.js,Performance.js,Command.js,Db_query_admin.js]',
  Save: '[Server.js,Main.js,Chat.js,Db_query_admin.js]',
  Load: '[Sign_enterGame.js,Chat.js,Db_query_admin.js]',
  Combat: '[Actor_death.js,Actor_loop_ai.js,Attack_loop.js,Db_ability.js,Boss.js,Combat_shared.js,Collision.js,Db_query_admin.js]',
  Input: '[Toolkit.js,Server_socket.js,Collision.js,Button.js,Db_query_admin.js]',
  Chat: '[Server.js,Server_socket.js,Cycle.js,Account.js,Actor_interaction.js,Actor_death.js,Actor_ability.js,Actor_equip.js,Actor_creation.js,Contribution.js,Db_item.js,Db_plan.js,Db_equip.js,Db_quest.js,Party.js,Main.js,Itemlist.js,Sign.js,Sign_enterGame.js,Combat.js,Craft.js,Skill.js,Test.js,Quest.js,Clan.js,Button.js,Command.js,Db_query_admin.js]',
  Dialogue: '[Main.js,Quest.js,Command.js,Db_query_admin.js]',
  Craft: '[Actor_death.js,Db_ability.js,Db_item.js,Db_plan.js,Db_equip.js,Quest.js,Command.js,Db_query_admin.js]',
  Drop: '[Actor_interaction.js,Actor_death.js,Db_map.js,Main.js,Loop.js,Db_query_admin.js]',
  Skill: '[Actor_interaction.js,Actor_death.js,Db_plan.js,Sign.js,Sign_enterGame.js,Craft.js,Quest.js,Db_query_admin.js]',
  Test: '[main.js,Actor_creation.js,Attack.js,Db_item.js,Loop.js,Sign_enterGame.js,Combat.js,Db_query_admin.js]',
  Performance: '[Server_socket.js,Loop.js,Change_send.js,Db_query_admin.js]',
  Clan: '[Command.js,Db_query_admin.js]',
  Collision: '[Actor_interaction.js,Actor_loop.js,Actor_loop_ai.js,Attack.js,Attack_loop.js,Map.js,Main.js,Boss.js,Loop.js,Button.js,Anim.js,Db_query_admin.js]',
  Button: '[Actor_interaction.js,Itemlist.js,Input.js,Db_query_admin.js]',
  Sprite: '[Actor.js,Actor_loop.js,Actor_creation.js,Attack.js,Contribution.js,Sign_enterGame.js,Quest.js,Db_query_admin.js]',
  Anim: '[Actor_loop.js,Attack.js,Attack_loop.js,Change_send.js,Combat.js,Db_query_admin.js]',
  Command: '[Server_socket.js,Main.js,Db_query_admin.js]',
  PassiveGrid: '[Db_query_admin.js]',
  Passive: '[Main.js,Sign.js,Quest.js,Db_query_admin.js]'

*/


