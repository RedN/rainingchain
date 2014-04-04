Init = {};


/*
if at home 
node app.js : connect to local db
node app.js 1 : connect mongohq
node app.js x 1: deleteDb

if using nodejitsu: 
if try login with rc: connect to public
for real: need to emit info




*/

var DB;



Init.db = function(data){
	data = data || {};
	var MONGO = {
		username: "public",
		password: "public",
		server: 'widmore.mongohq.com',
		port: '10000',
		db: 'public',
		connectionString: function(){return 'mongodb://'+this.username+':'+this.password+'@'+this.server+':'+this.port+'/'+this.db;},
		options: {server:{auto_reconnect: true,socketOptions:{connectTimeoutMS:Cst.HOUR,keepAlive:Cst.HOUR,socketTimeoutMS:Cst.HOUR}}}
	};
	
	
	var databaseURI;
	if(!data.db && data.localdb) databaseURI = "localhost:27017/test";
	if(!data.db && !data.localdb) databaseURI = MONGO.connectionString();
	if(data.db){
		databaseURI = data.db;
	}
	
	

	var collections = ["report","customMod","player","main","ability","equip","account","clan",'plan'];
	
	//real direct db
	DB = require("mongojs").connect(databaseURI, collections, MONGO.options);
	setInterval(function(){	DB = require("mongojs").connect(databaseURI, collections, MONGO.options);},Server.frequence.db);	//refresh connection
	
	
	//intermediare db
	db = {};
	db.find = function(name,searchInfo,wantedData,cb){
		if(arguments.length === 3) DB[name].find(searchInfo,wantedData);
		else DB[name].find(searchInfo,wantedData,cb);
	}
	db.findOne = function(name,searchInfo,wantedData,cb){
		if(arguments.length === 3) DB[name].findOne(searchInfo,wantedData);
		else DB[name].findOne(searchInfo,wantedData,cb);
	}
	db.save = function(name,info,cb){
		DB[name].save(info,cb);
	}
	db.update = function(name,searchInfo,updateInfo,cb){
		if(arguments.length === 3) DB[name].find(searchInfo,updateInfo);
		else DB[name].update(searchInfo,updateInfo,cb);
	}
	db.insert = function(name,updateInfo,cb){
		DB[name].insert(updateInfo,cb);
	}
	db.remove = function(name,searchInfo,cb){
		DB[name].remove(searchInfo,cb);
	}
	
	//delete everything in db
	db.deleteAll = function(){
		for(var i in collections){
			DB[collections[i]].remove();
		}
		permConsoleLog('DELETED EVERYTHING IN DATABASE!');
	}

	//Clear Db of useless info. ex: weapon dropped by player
	//BROKEN
	db.filterDb = function(){
		//fill bigList
		var bigList = {};	//list of all equip used
		db.find('main',{},function(er,main){ if(er) throw er;
			for(var i in main){
				for(var j in main[i].invList) bigList[main[i].invList[j][0]] = 1;
				for(var j in main[i].bankList) bigList[main[i].bankList[j][0]] = 1;
			}
			db.find('player',{},function(er,act){ if(er) throw er;
				for(var i in act){
					for(var j in act[i].equip) bigList[act[i].equip[j]] = 1;
				}
			
				permConsoleLog('list of used equip:\n',Object.keys(bigList));
				
				//fill equipList
				var equipList = {};	//list of all equip
				db.find('equip',{},function(er,res){ if(er) throw er;
					for(var i in res)	equipList[res[i].id] = 1;
					for(var i in bigList)	delete equipList[i];
					
					permConsoleLog(Object.keys(equipList).length + 'unused equip\n',Object.keys(equipList));
					for(var i in equipList) db.remove('equip',{'id':i});
				});
			});
		});

	}

	db.err = function(err){ if (err) throw err; }
	
	if(data.deletedb) db.deleteAll();
	//db.deleteAll();
	//db.filterDb();
	
	
}


Init.email = function(data){
	if(!data.email) return;
	nodemailer = require("nodemailer").createTransport("SMTP",{service: "Gmail",auth: {user: "rainingchainmail@gmail.com",pass: data.email}});

	nodemailer.email = function(to,subj,text){
		db.find('account',{username:to},function(err, res) { if(err) throw err;
			if(res[0] && res[0].email){
				nodemailer.sendMail({
					from: "Raining Chain <rainingchainmail@gmail.com>",
					to: to + ' ' + res[0].email,
					subject: subj, 
					text: text
				});	
			}
		});	
	}
}



ObjectKeys = (function(){
	return Object.keys(this);
})();


