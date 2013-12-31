var databaseURI = 'mongodb://test:' + dbpsw + '@widmore.mongohq.com:10010/RainingChain_copy';  
var collections = ["ability","weapon","armor","account","item","clan"];

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
			for(var j in a.main.invList){list.push(a.main.invList[i][0]);}
			for(var j in a.main.bankList){list.push(a.main.bankList[i][0]);}
			for(var j in a.player.weaponList){list.push(a.player.weaponList[j].id);}
			for(var j in a.player.armor.piece){list.push(a.player.armor.piece[j].id);}
			for(var j in list){	bigList[list[j]] = true;}
		}
		permConsoleLog('list of items exisiting:\n',Object.keys(bigList));
			
		db.weapon.find(function(er,res){ if(er) throw er;
			var weaponList = {};
			for(var i in res){weaponList[res[i].id] = true;	}
			for(var i in bigList){	delete weaponList[i];}
			permConsoleLog(Object.keys(weaponList).length + 'unused weapon\n',Object.keys(weaponList));
			for(var i in weaponList){db.weapon.remove({'id':i});}
		});
		
		db.armor.find(function(er,res){ if(er) throw er;
			var weaponList = {};
			for(var i in res){weaponList[res[i].id] = true;	}
			for(var i in bigList){	delete weaponList[i];}
			permConsoleLog(Object.keys(weaponList).length + 'unused armors\n',Object.keys(weaponList));
			for(var i in weaponList){db.armor.remove({'id':i});}
		});
		
	});

}

//db.deleteAll();
//db.filterDb();





Init = {};
Init.db = {};
