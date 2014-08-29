//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Init','Sign','Actor','requireDb','Save','Chat'],['Server']));
var db = requireDb();

var Server = exports.Server = {
	version:1,	//used for message/report for devs
	frequence:{
		save:Math.round(60*1000/40),	//save player
		inactivity:10*60*1000,			//quit if no input
		disconnect:6*60*60*1000,		//quit
		db:60*1000,						//refresh db link
	},	
	timeLimit:{
		perWeek:24*60*60*1000*999999,
		active:1,	
	},
	ready:0,
	maxPlayerAmount:NODEJITSU ? 0 : 64,
	customMod:false,					//accept customMod
	report:true,						//accept report
	displaySignIn:true,
	loginMessage:"Server is down. Come later.",
}
Server.testing = !NODEJITSU;		//will trigger special testing func

Server.start = function(data){
	if(Server.ready) return;
	Init.db(data);
	Init.game();
}

Server.botwatch = function(key,towatch){
	List.main[key].old = {};
	List.all[key].old = {};
	List.all[key].privateOld = {};
	
	if(!towatch){	//watch first random player
		for(var i in List.socket) if(i !== key) towatch = i;
	}
	List.main[towatch].old = {};
	List.all[towatch].old = {};
	List.all[towatch].privateOld = {};
	Server.botwatch.watcher = key;
	Server.botwatch.watched = towatch;
}
Server.botwatch.watcher = null;
Server.botwatch.watched = null;

Server.disconnectAll = function(){
	for(var i in List.main){
		Sign.off(i,"Admin disconnected every player.");
	}
}

Server.admin = [
	'rc',
];
Server.isAdmin = function(key,username){
	if(Server.testing) return true;
	if(username) return Server.admin.have(username);
	if(!List.all[key]) return false;
	return Server.admin.have(List.all[key].name);
}


Server.log = function(lvl,key,type){	//only logs then, no display
	/*
	1:Very important
	2:important (saved)
	3:NOT really important (not saved but if had unlimited space, would save)
	4:NOT important at all (wouldnt be saved ever)
	*/
	var act = List.all[key];
	var username = act ? act.name : key;
	
	if(lvl > Server.log.level) return;
	
	var param = '';
	for(var i = 3; i < arguments.length; i++)	param += arguments[i] + ', ' ;
	
	Server.log.data.push({
		time:Date.now(),
		username:username,
		type:type,
		param:param,
	});
}
Server.log.display = function(name){
	if(!name){ INFO(Server.log.data); return; }
		
	for(var i in Server.log.data){
		if(Server.log.data[i].username === name){
			var date = new Date(Server.log.data[i].time).toLocaleString();
			INFO(date + ': ' + Server.log.data[i].type + '\n  ---  ' + Server.log.data[i].param);
		}
	}
	
}
Server.log.data = [];
Server.log.level = 4;

Server.teleportTo = function(key,name){
	var keyy = List.nameToKey[name];
	if(!keyy) return;
	var act = List.all[keyy];
	Actor.teleport(List.all[key],{x:act.x,y:act.y,map:act.map});
}


/*
Server.ban = function(name){
	for(var i in List.main){
		if(List.all[i].name === name)
		
		
		
	}
}
*/

Server.getPlayerAmount = function(){
	return Object.keys(List.main).length;
}


Server.reset = function(text,save,forever){
	var saveSuccess = false;
	if(save !== false){
		try	{
			for(var key in List.main) Save(key);
			saveSuccess = true;
		} catch(err){ INFO(err.stack); }
	}
	
	//message
	var str = (new Date()).toString() + ' Server crash #' + Server.reset.count + '\n';
	str += 'Players online: ';
	try	{ 
		for(var key in List.main) str += List.all[key].name + ',';
	} catch(err){ INFO(err.stack); }
	str += '\n';
	str += text;
	str += '\n';
	str += 'Saved player data: ' +  saveSuccess + '\n';
	if(Server.reset.sendEmail) db.email.crash(str);
	
	try	{
		for(var key in List.socket)	List.socket[key].disconnect();
	} catch(err){ INFO(err.stack); }
	
	
	INFO(new Error().stack);
	
	//Clear
	for(var i in List)	List[i] = {};
	db.update('account',{},{'$set':{online:0}});
	INFO("SERVER HAS BEEN RESET");
	
	if(forever || ++Server.reset.count >= Server.reset.maxCount) Server.ready = 0;
}
Server.reset.count = 0;
Server.reset.maxCount = 10;
Server.reset.sendEmail = NODEJITSU;


Server.shutdown = function(time){
	time = time || 1000*10;
	Server.ready = 0;
	for(var i in List.socket)
		Chat.add(i,"The server needs to be updated. It will reset in " + (time/1000).r(0) + " seconds.");
	
	setTimeout(function(){
		for(var i in List.socket)
			Chat.add(i,"About to reset the server...");
	},time - 3000);
	
	setTimeout(function(){
		Server.disconnectAll();
	},time);
}


Server.ban = function(name){
	db.update('account',{username:name},{'$set':{'banned':1}});
	for(var i in List.main){
		if(List.all[i].name === name){
			Sign.off(i,"You have been banned.");
		}
	}
}
Server.ban.remove = function(name){
	db.update('account',{username:name},{'$set':{'banned':0}});
}

Server.mute = function(name){
	for(var i in List.main){
		if(List.all[i].name === name){
			List.main[i].social.muted = 1;	
			Chat.add(i,"You have been muted.");
		}
	}
}
Server.mute.remove = function(name){
	for(var i in List.main){
		if(List.all[i].name === name){
			List.main[i].social.muted = 0;	
			Chat.add(i,"You are no longer muted.");
		}
	}
}


Server.updateMessage = function(version,text){
	db.upsert('report',{version:version},{'$set':{version:version,message:text}},function(err){
		throw err;
	});
};

Server.email = false;

Server.toEval = attk =  '';

Server.bannedName = [];
setTimeout(function(){	//so called after Toolkit loaded
	var n = Object.getOwnPropertyNames;
	Server.bannedName = (n(Object.prototype)).concat(n(Array.prototype));	//.concat(n(String.prototype)).concat(n(Number.prototype));
},1000);

