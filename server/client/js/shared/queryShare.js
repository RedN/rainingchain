//The client can make a query to the server database.
//used when the client wants to draw something but doesnt have info about it
if(SERVER){ //}
	
Db.query = function(d,cb){
	if(d.db === 'highscore'){ Db.query.highscore(d,cb); return; }	//async
	
	var list = {
		equip:{source:Db.equip,},
		ability:{source:Db.ability,filter:Db.query.ability},	//note: in Db, ability attack are in object
		plan:{source:Db.plan,filter:Db.query.plan},
		quest:{source:Db.quest,filter:Db.query.quest,},
	}
	
	if(!list[d.db]) return;
	
	var info = list[d.db].source[d.id];
	if(!info) return;

	if(list[d.db].filter) info = list[d.db].filter(Tk.deepClone(info));
	
	cb({
		info:info,
		id:d.id,
		db:d.db	
	});
}

Db.query.plan = function(info){
	var item = [];
	for(var i in info.req.item){
		var s = info.req.item[i];
		var tmp = [];
		if(s[0] === info.id) continue;
		tmp[0] = Db.item[s[0]].icon;
		tmp[1] = s[1];
		tmp[2] = Db.item[s[0]].name;
		item.push(tmp);
	}	
	info.req.item = item;
	return info;
}

Db.query.ability = function(info){
	var ab = Tk.deepClone(info);
	if(ab.action && ab.action.func === 'Combat.attack'){
		ab.action.param = Tk.useTemplate(Attack.template(),ab.action.param);
	}
	return ab;
}	
	
Db.query.quest = function(info){
	var toSend = {
		'id':0,
		'name':0,
		'icon':0,
		'reward':0,
		'description':0,
		'variable':0,
		'author':0,
		'requirement':Db.query.quest.req,
		'challenge':Db.query.quest.challenge,
		lvl:0,
		difficulty:0,
	};
	var tmp = {};
	
	for(var i in toSend){
		if(toSend[i]) tmp[i] = toSend[i](info[i]);
		else tmp[i] = info[i];
	}
	return tmp;
}
	
Db.query.quest.req = function(info){
	var tmp = [];
	for(var i in info){
		tmp[i] = {
			description:info[i].description,
			name:info[i].name,
		};
	}
	return tmp;
}	
	
Db.query.quest.challenge = function(info){	//dunno if good
	var tmp = {};
	for(var i in info){
		tmp[i] = {
			name:info[i].name,
			description:info[i].description,
			bonus:info[i].bonus,
		};
	}
	return tmp;
}	

Db.query.highscore = function(d,cb){	//TOFIX temp
	if(!Quest.highscore.list[d.id]) return;
	
	Quest.highscore.fetch(d.id,function(res){
		Quest.highscore.fetchRank(d.key,d.id,function(res2){
			res.push(res2);
			cb({
				info:res,
				db:'highscore',
				id:d.id,
			});	
		});
	});
	
	
}




} // END SERVER

//##############################################
//##############################################

if(!SERVER){

Db.query = function(db,id){
	if(!id || !db) return;
	
	var equip = Db[db][id];
	if(equip) return equip;
	
	if(equip === undefined){
		Db[db][id] = 0;
		socket.emit('queryDb', {db:db,id:id});
	}
	
}


socket.on('queryDb', function (d) {
	if(!d.failure)	Db[d.db][d.id] = d.info;
});

} //END !SERVER



