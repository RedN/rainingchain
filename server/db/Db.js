Init = {};





Init.db = function(dbpsw,deleteDb,whatDb){
	
	var MONGO = {
		username: "test",
		password: dbpsw,
		server: 'widmore.mongohq.com',
		port: '10010',
		db: 'RainingChain_copy',
		connectionString: function(){
			return 'mongodb://'+this.username+':'+this.password+'@'+this.server+':'+this.port+'/'+this.db;
		},
		options: {
			server:{
				auto_reconnect: true,
				socketOptions:{
					connectTimeoutMS:3600000,
					keepAlive:3600000,
					socketTimeoutMS:3600000
				}
			}
		}
	};
	
	var databaseURI = whatDb ? "localhost:27017/test" : MONGO.connectionString();  
	var collections = ["customMod","player","main","ability","equip","account","clan",'plan'];
	
	db = require("mongojs").connect(databaseURI, collections, MONGO.options);
	
	setInterval(function(){
		db = require("mongojs").connect(databaseURI, collections, MONGO.options);
	},60*1000);
	
	db.on('error', function(err) {
		console.log("DB connection Error: "+err);
	});
	db.on('open', function() {
		console.log("DB connected");
	});
	db.on('close', function(str) {
		console.log("DB disconnected: "+str);
	});
	
	
	
	//delete everything in db
	db.deleteAll = function(){
		for(var i in collections){
			db[collections[i]].remove();
		}
		permConsoleLog('DELETED EVERYTHING IN DATABASE!');
	}

	//Clear Db of useless info. ex: weapon dropped by player
	db.filterDb = function(){
		db.account.find(function(er,res){ if(er) throw er;
			var account = res;
			var bigList = {};
			
			for(var i in account){
				var a = account[i];
				var list = [];
				for(var j in a.main.invList.data){list.push(a.main.invList.data[i][0]);}
				for(var j in a.main.bankList.data){list.push(a.main.bankList.data[i][0]);}
				for(var j in a.player.equip.piece){list.push(a.player.equip.piece[j].id);}
				for(var j in list){	bigList[list[j]] = true;}
			}
			permConsoleLog('list of items exisiting:\n',Object.keys(bigList));
				
			db.equip.find(function(er,res){ if(er) throw er;
				var equipList = {};
				for(var i in res){equipList[res[i].id] = true;	}
				for(var i in bigList){	delete equipList[i];}
				permConsoleLog(Object.keys(equipList).length + 'unused weapon\n',Object.keys(equipList));
				for(var i in equipList){db.equip.remove({'id':i});}
			});
			
		});

	}

	db.err = function(err){ if (err) throw err; }
	
	if(deleteDb) db.deleteAll();
	//db.deleteAll();
	//db.filterDb();
	
	
}


Init.email = function(mailpsw){
	nodemailer = require("nodemailer").createTransport("SMTP",{service: "Gmail",auth: {user: "rainingchainmail@gmail.com",pass: mailpsw}});

	nodemailer.email = function(to,subj,text){
		db.account.find({username:to},function(err, res) { if(err) throw err;
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


