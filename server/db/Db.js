Init = {};
Init.db = function(dbpsw){
	var databaseURI = 'mongodb://test:' + dbpsw + '@widmore.mongohq.com:10010/RainingChain_copy';  
	var collections = ["player","main","ability","equip","account","clan"];

	db = require("mongojs").connect(databaseURI, collections);

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


