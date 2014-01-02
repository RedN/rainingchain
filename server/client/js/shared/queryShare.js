//The client can make a query to the server database.
//used when the client wants to draw a weapon but doesnt have info about it
if(server){
	io.sockets.on('connection', function (socket) {
		socket.on('queryDb', function (d) {
			var key = socket.key;
			var db = d.db;
			var id = d.id;
			var source;
			
			switch(db){
				case 'Db.equip': source = Db.equip; 	break;		
				case 'Db.equip': source = Db.equip;	break;	
				case 'Db.ability': source = Db.ability;	break;		
			}
			
			if(source && source[id]){
				socket.emit('queryDb',{db:db,id:id,info:source[id]}); 
			} else {
				socket.emit('queryDb',{'failure':1}); 
			}

		
		});
	});
} else {
	queryDb = function(db,id){
		if(window[db][id] === undefined){
			window[db][id] = 0;
			socket.emit('queryDb', {db:db,id:id});
		}
	}

	socket.on('queryDb', function (d) {
		if(!d.failure){
			window[d.db][d.id] = d.info;
		}		
	});
}




