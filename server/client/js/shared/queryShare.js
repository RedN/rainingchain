//The client can make a query to the server database.
//used when the client wants to draw a weapon but doesnt have info about it
if(server){
	io.sockets.on('connection', function (socket) {
		socket.on('queryDb', function (d) {
			var source;
			
			switch(d.db){
				case 'equip': source = Db.equip; 	break;
				case 'ability': source = Db.ability;	break;		
			}
			if(source && source[d.id]){
				socket.emit('queryDb',{db:d.db,id:d.id,info:source[d.id]}); 
			} else {
				socket.emit('queryDb',{'failure':1}); 
			}

		
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

