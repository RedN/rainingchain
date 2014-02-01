//The client can make a query to the server database.
//used when the client wants to draw something but doesnt have info about it
if(server){
	Db.query = function(d){
		var source; var filter;
	
		switch(d.db){
			case 'equip': source = Db.equip;	break;
			case 'ability': source = Db.ability;	break;		
			case 'plan': source = Db.plan; filter = Db.query.plan; break;
		}
		if(!source) return;
		d.info = source[d.id];
		if(!d.info) return;

		if(filter) d.info = filter(deepClone(d.info));
		
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
	
	io.sockets.on('connection', function (socket) {
		socket.on('queryDb', function (d) {
			var toreturn = Db.query(d);
			if(toreturn) socket.emit('queryDb',toreturn); 
			else socket.emit('queryDb',{'failure':1});
		});
	});
} else {
	Db.query = function(db,id){
		if(Db[db][id] === undefined){
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

