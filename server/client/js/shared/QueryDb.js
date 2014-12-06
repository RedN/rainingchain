//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Attack','Quest','Equip','Main','Ability','Highscore','ItemModel']));


var QueryDb = exports.QueryDb = function(db,id){
	return {
		db:db,
		id:id,
	}
}

var QueryResponse = function(db,id,value){
	return {
		db:db,
		id:id,
		value:value,
	}
}



//The client can make a query to the server database.
//used when the client wants to draw something but doesnt have info about it
QueryDb.respond = function(key,query,cb){
	if(query.db === 'highscore'){ //async
		return QueryDb.respond.highscore(key,query,cb);
	}	
	if(query.db === 'equip'){
		var value = Equip.compressClient(Tk.deepClone(Equip.get(query.id)) || null);
		return cb(QueryResponse(query.db,query.id,value));
	}
	if(query.db === 'ability'){
		var value = Ability.compressClient(Tk.deepClone(Ability.get(query.id)) || null);
		return cb(QueryResponse(query.db,query.id,value));
	}
	if(query.db === 'quest'){
		var value = Quest.compressClient(Tk.deepClone(Quest.get(query.id)) || null,true);
		return cb(QueryResponse(query.db,query.id,value));
	}
	if(query.db === 'item'){
		var value = ItemModel.compressClient(Tk.deepClone(ItemModel.get(query.id)) || null,true);
		return cb(QueryResponse(query.db,query.id,value));
	}
	//invalid query
	
}
	
QueryDb.respond.highscore = function(key,query,cb){
	var highscore = Highscore.get(query.id);
	if(!highscore) return;
	var main = Main.get(key);
	if(!main.quest[highscore.quest]) return ERROR(3,'main doesnt have highscore',query.id);
	
	Highscore.fetchTop15AndUser(query.id,main.username,function(res){
		cb(QueryResponse(query.db,query.id,Highscore.compressClient(highscore,res)));
	});
};



//##############################################
//##############################################



//QueryDb.get('item','Qsystem-DEV_TOOL')
(function(){ //}
	if(SERVER) return;
	var DB = QueryDb.DB = {};
	
	var QueryDbModel = function(db,alreadyThere,get,set){
		DB[db] = {
			db:db,
			data:{},
			callback:{},
			alreadyThere:alreadyThere || function(id){
				return !!DB[db].data[id];
			},
			get:get || function(id){
				return DB[db].data[id];
			},
			set:set || function(id,value){
				DB[db].data[id] = value
			},
		}	
	}
	
	QueryDbModel('equip');
	QueryDbModel('ability');
	QueryDbModel('item',null,null,function(id,value){
		DB.item.data[id] = ItemModel.uncompressClient(value);
	});
	QueryDbModel('quest',function(id){
		return !!DB.quest.data[id] && !DB.quest.data[id].isPartialVersion;
	});
	QueryDbModel('highscore',function(id){
		return !!DB.highscore.data[id] && !DB.highscore.data[id].isPartialVersion;
	},function(id){
		if(Date.now() - DB.highscore.data[id].timestamp > CST.MIN)	//refresh highscore if too old
			QueryDb.get('highscore',id,null,true);	//request refresh
		return DB.highscore.data[id];
	});
	
	//##################
	
	QueryDb.get = function(db,id,cb,forceUpdate){	//update forces the query
		if(!id || !db) return;
		var model = DB[db];
		
		var alreadyThere = model.alreadyThere(id);
		
		if(!forceUpdate && alreadyThere){
			return model.get(id);
		}
		
		if(forceUpdate || (!alreadyThere && !model.callback[id])){
			model.callback[id] = cb || true;
			Socket.emit('queryDb', QueryDb(db,id));
		}
	}
	QueryDb.getQuestName = function(id){
		return DB.quest.data[id].name || '';
	}
	QueryDb.getQuestShowInTab = function(id){
		return DB.quest.data[id].showInTab || false;
	}
	
	QueryDb.getHighscoreForQuest = function(id){
		var list = {};
		for(var i in DB.highscore.data)
			if(i.have(id)) list[i] = 1;
		return list;
	}
	QueryDb.getHighscoreQuestList = function(){
		var list = {};
		for(var i in DB.highscore.data)
			list[DB.highscore.data[i].quest] = 1;
		return list;
	}
	
	QueryDb.getHighscoreName = function(id){
		return DB.highscore.data[id].name || '';
	}
	QueryDb.getHighscoreDescription = function(id){
		return DB.highscore.data[id].description || '';
	}
	QueryDb.useSignInPack = function(quest,highscore){
		for(var i in quest)
			DB.quest.data[i] = quest[i];
		for(var i in highscore)
			DB.highscore.data[i] = highscore[i];
	}
	
	//##########
	
	QueryDb.init = function(){
		Socket.on('queryDb', function (d) {
			var model = DB[d.db];
			model.set(d.id,d.value);
			if(typeof model.callback[d.id] === 'function')
				model.callback[d.id](d.value);
		});
	}
	
	
	
	
	
	
	
	
})();







