Server.handleSocket = function(name,socket,d){
	var event = Db.socket[name];
	if(!event) return;
	
	var time = Date.now();
	if(socket.emitCount[name] /Math.max(socket.globalTimer/Cst.MIN,5) > event.limitPerMin) return;
	if(time-socket.emitLast[name] < event.minInterval) return;
	
	socket.emitLast[name] = time;
	socket.emitCount[name]++;
	event.func(socket,d);
	
	Performance.bandwidth('download',d,socket);
}

Init.socket = function(socket){
	socket.emitCount = {};
	socket.emitLast = {};
	for(var i in Db.socket){
		socket.emitCount[i] = 0;
		socket.emitLast[i] = 0;
	}
	socket.bandwidth = {upload:0,download:0};
	return socket;
}

io.sockets.on('connection', function (socket) {
	socket = Init.socket(socket);
	
	//Init.socket(socket);
	socket.on('signUp', function (d) { Server.handleSocket('signUp',socket,d);});
	socket.on('signIn', function (d) { Server.handleSocket('signIn',socket,d);});
	socket.on('clientReady', function (d) { Server.handleSocket('clientReady',socket,d);});
    socket.on('disconnect', function (d) { Server.handleSocket('disconnect',socket,d);});
	
    socket.on('sendChat', function (d) { Server.handleSocket('sendChat',socket,d);});
    socket.on('Chat.send.command', function (d) { Server.handleSocket('Chat.send.command',socket,d);});
    socket.on('queryDb', function (d) { Server.handleSocket('queryDb',socket,d);});
    socket.on('testing', function (d) { Server.handleSocket('testing',socket,d);});
    socket.on('click', function (d) { 	Server.handleSocket('click',socket,d);});
    socket.on('input', function (d) { Server.handleSocket('input',socket,d);});
    socket.on('uploadMod', function (d) { Server.handleSocket('uploadMod',socket,d);});
});


Db.socket = {
	'signUp':{
		limitPerMin:1,
		minInterval:1000,
		func:function(socket,d){
			if(Server.ready) Sign.up(socket,d); 
			else socket.emit('signIn', { 'success':0,'message':'<font color="red">SERVER IS CLOSED. Next open beta should come soon.</font>' }); 
		},
	},
	'signIn':{
		limitPerMin:1,
		minInterval:1000,
		func:function(socket,d){
			if(Server.ready) Sign.in(socket,d); 
			else socket.emit('signIn', { 'success':0,'message':'<font color="red">SERVER IS CLOSED. Next open beta should come soon.</font>' }); 
		},
	},
	'clientReady':{
		limitPerMin:1,
		minInterval:1000,
		func:function(socket,d){
			if(!List.socket[socket.key]) return;
			List.socket[socket.key].clientReady = 1; 
		},
	},
	'disconnect':{
		limitPerMin:1,
		minInterval:1000,
		func:function(socket,d){
			socket.toRemove = 1;
		},
	},
	'sendChat':{
		limitPerMin:100,
		minInterval:500,
		func:function(socket,d){
			d.key = socket.key;
			Chat.receive(d);
		},
	},
	'Chat.send.command':{
		limitPerMin:30,
		minInterval:0,
		func:function(socket,d){
			Command.receive(socket,d);
		},
	},
	'queryDb':{
		limitPerMin:20,
		minInterval:0,
		func:function(socket,d){
			var toreturn = Db.query(d);
			if(toreturn) socket.emit('queryDb',toreturn); 
			else socket.emit('queryDb',{'failure':1});
		},
	},
	'testing':{
		limitPerMin:20,
		minInterval:0,
		func:function(socket,d){
			var act = List.all[socket.key];
			if(act && act.name && Server.admin.have(act.name))
				Db.query.admin(socket,d);
		},
	},
	'click':{
		limitPerMin:60*1000/40,
		minInterval:10,
		func:function(socket,d){
			Input.click(socket,d);
		},
	},
	'input':{
		limitPerMin:60*1000/40,
		minInterval:10,
		func:function(socket,d){
			Input.key(socket,d);
		},
	},
	'uploadMod':{
		limitPerMin:2,
		minInterval:1000,
		func:function(socket,d){
			customModHandling(socket,d);
		},
	},
	
}











