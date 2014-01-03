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
	queryDb = function(db,id){
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




