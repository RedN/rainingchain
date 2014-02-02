//The client can make a query to the server database.
//used when the client wants to draw something but doesnt have info about it
if(server){
	
	
Db.query = function(d){
	var list = {
		equip:{
			source:Db.equip,
		},
		ability:{
			source:Db.ability,	//note: in Db, ability attack are in object
			filter:Db.query.ability
		},
		plan:{
			source:Db.plan,
			filter:Db.query.plan
		},
	}
	
	if(!list[d.db]) return;
	
	var info = list[d.db].source[d.id];
	if(!info) return;

	if(list[d.db].filter) info = list[d.db].filter(deepClone(info));
	
	d.info = info;
	return d;
}


Db.query.plan = function(info){
	for(var i in info.req.item){
		var s = info.req.item[i];
		var tmp = [];
		tmp[0] = Db.item[s[0]].icon;
		tmp[1] = s[1];
		tmp[2] = Db.item[s[0]].name;
		info.req.item[i] = tmp;
	}	
	return info;
}

Db.query.ability = function(info){
	var ab = deepClone(info);
	if(ab.action && ab.action.func === 'Combat.action.attack'){
		ab.action.param = useTemplate(Attack.template(),ab.action.param);
	}
	return ab;
}	
	
	
io.sockets.on('connection', function (socket) {
	socket.on('queryDb', function (d) {
		var toreturn = Db.query(d);
		if(toreturn) socket.emit('queryDb',toreturn); 
		else socket.emit('queryDb',{'failure':1});
	});
});

} 

//##############################################
//##############################################

if(!server){


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
	if(!d.failure){
		Db[d.db][d.id] = d.info;
	}		
});


}


//Testing
if(server){
	io.sockets.on('connection', function (socket) {
		socket.on('testing', function (d) {
			try {
				var key = socket.key;
				var p = List.all[key];
				var m = List.main[key];
				var q = m.quest;
				var e = [];
				var pl = [];
				for(var i in List.all){
					if(List.all[i].type === 'enemy'){e.push(List.all[i]);}
					if(List.all[i].type === 'player'){pl.push(List.all[i]);}
					if(List.all[i].type === 'bullet'){var b = List.all[i];}
				}				
				
				if(List.all[key].name == 'sam'){
					var info = eval(d.command);
					data = JSON.stringify(info);
					permConsoleLog(info);
					socket.emit('testing', {'data':data} );				
				}
			} catch (err){
				logError(err);
				socket.emit('testing', 'failure');
			}			
		});
	});

} else {
	ts = function(command){socket.emit('testing', {'command':command});}
	
	ts.superBoost = function(){
		var str = [];
		for(var i in Db.stat){
			str.push({'stat':i,'value':Math.random()*2,'type':'+'});
		}
		str = stringify(str);
		
		ts("addPermBoost(key,'super'," + str + ')');
	}
	
	socket.on('testing', function (d) { 
		if(d && d.data){ try { permConsoleLog(JSON.parse(d.data)); } catch (err){ }	}
	});
}

