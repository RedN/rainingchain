//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Main']));

var db = null; //Highscore.init

//QueryDb.get('highscore','Qbtt000-speedrun')
//Socket.emit('queryDb', QueryDb('highscore','Qbtt000-speedrun'));
//QueryDb.getDB().highscore['Qbtt000-speedrun']
//ts("Quest.DB['QlureKill'].highscore['QlureKill-_score'].getScore.toString()")


var Highscore = exports.Highscore = function(quest,id,name,description,order,getScore){	//constructor
	var tmp = {
		quest:quest,
		id:id || '',
		name:name || 'name',
		description:description || 'description',
		order:order || 'ascending', //or descending
		getScore:getScore || function(key){ return null; },	//return number or null is no score
	};
	
	DB[id] = tmp;
	return tmp;
}

var DB = Highscore.DB = {};

Highscore.get = function(id){
	return DB[id] || null;
}

Highscore.init = function(dbLink){
	db = dbLink;
}

Highscore.Score = function(category,rank,value,username){
	return {
		category:category,	
		rank:rank,
		value:value,
		username:username,	
	}
}



Highscore.fetchTopScore = function(category,cb,amount){	//return [Highscore.Score]
	amount = amount || 15;
	var req = {category:category};
	var proj = {username:1,value:1};
	var sort = {value:DB[category].order === 'ascending' ? 1 : -1};	
	
	db.highscore.find(req,proj).limit(amount).sort(sort,function(err,res){ if(err) throw err;
		var tmp = [];
		for(var i = 0; i < res.length; i++){
			tmp.push(Highscore.Score(category,i+1,res[i].value,res[i].username));
		}
		cb(tmp);
	});	
}

Highscore.fetchScore = function(category,username,cb){
	Highscore.fetchValue(category,username,function(value){
		var req = {
			value:DB[category].order === 'ascending' ? 
				{$lt: value || CST.bigInt,$ne:null} :
				{$gt: value || 0,$ne:null},
			category:category,
		}
		db.highscore.find(req).count(function(err,result){
			cb(Highscore.Score(category,result+1,value,username));
		});
	});
}

Highscore.fetchValue = function(category,username,cb){
	var proj = {value:1};
	db.highscore.findOne({username:username,category:category},proj,function(err,res){ if(err) throw err;
		cb(res ? res.value || null : null);
	});
}

Highscore.fetchTop15AndUser = function(category,username,cb){
	Highscore.fetchTopScore(category,function(list){
		for(var i in list){
			if(list[i].username === username) return cb(list);	//player is part of the list		
		}
		Highscore.fetchScore(category,username,function(res){
			list.push(res);
			cb(list);		
		});	
	},15);
}



Highscore.getQuest = function(str){
	return str.split('-')[0];
}

Highscore.getCategory = function(str){
	return str.split('-')[1];
}

Highscore.getSignInPack = function(){
	var h = {}; 
	for(var i in DB) 
		h[i] = Highscore.compressClient(DB[i],null);
	return h;
}

Highscore.compressClient = function(highscore,score){	//score == null for SignInPack
	return {
		name:highscore.name,
		description:highscore.description,
		quest:highscore.quest,
		id:highscore.id,
		score:score || null,
		isPartialVersion:score === null,
		timestamp:Date.now(),
	}
}


Highscore.compressDb = function(category,value,username){
	return {
		category:category,
		value:value,
		username:username,
	}
}

Highscore.setNewScore = function(q,main,mq){
	for(var i in q.highscore){
		var score = q.highscore[i].getScore(main.id);
		if(typeof score !== 'number') continue;
		if(mq._highscore[i] == null
			|| (q.highscore[i].order === 'ascending' && score < mq._highscore[i])
			|| (q.highscore[i].order === 'descending' && score > mq._highscore[i])){
			mq._highscore[i] = score.r(4);
			
			Highscore.saveScore(i,mq._highscore[i],main.username);
		}
	}
}

Highscore.saveAllScore = function(main,cb){
	var maxcount = 0;
	var count = 0;
	for(var i in main.quest){
		for(var j in main.quest[i]._highscore){
			maxcount++
			Highscore.saveScore(j,main.quest[i]._highscore[j],main.username,function(err){
				if(err) throw err;
				if(++count === maxcount){
					if(cb) cb();
				}
			});
		}
	}
	if(maxcount === 0){
		ERROR(3,'highscore count is 0 wtf',main.quest,main.id);
		cb();
	}
}

Highscore.saveScore = function(category,value,username,cb){
	db.highscore.upsert(
		{username:username,category:category},
		Highscore.compressDb(category,value,username),
		cb || db.err
	);	
}




