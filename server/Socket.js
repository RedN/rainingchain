Server.handleSocket = function(name,socket,d){
	var event = Db.socket[name];
	if(!Db.socket[name]) return;
	
	var time = Date.now();
	//if(time - socket.lastEmit[name] < event.minInterval) return;	//TOFIX bug for queryShare
	socket.lastEmit[name] = time;
	Db.socket[name].func(socket,d);
	
	
	Performance.bandwidth('download',d,socket);
}

Init.socket = function(socket){
	socket.lastEmit = {};
	for(var i in Db.socket)
		socket.lastEmit[i] = 0;
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
		minInterval:10000,
		func:function(socket,d){
			if(Server.ready) Sign.up(socket,d); 
		},
	},
	'signIn':{
		minInterval:1000,
		func:function(socket,d){
			if(Server.ready) Sign.in(socket,d); 
		},
	},
	'clientReady':{
		minInterval:1000,
		func:function(socket,d){
			if(!List.socket[socket.key]) return;
			List.socket[socket.key].clientReady = 1; 
		},
	},
	'disconnect':{
		minInterval:10,
		func:function(socket,d){
			socket.toRemove = 1;
		},
	},
	'sendChat':{
		minInterval:100,
		func:function(socket,d){
			d.key = socket.key;
			Chat.receive(d);
		},
	},
	'Chat.send.command':{
		minInterval:100,
		func:function(socket,d){
			Command.receive(socket,d);
		},
	},
	'queryDb':{
		minInterval:100,
		func:function(socket,d){
			var toreturn = Db.query(d);
			if(toreturn) socket.emit('queryDb',toreturn); 
			else socket.emit('queryDb',{'failure':1});
		},
	},
	'testing':{
		minInterval:100,
		func:function(socket,d){
			var act = List.all[socket.key];
			if(act && act.name && Server.admin.have(act.name))
				Db.query.admin(socket,d);
		},
	},
	'click':{
		minInterval:10,
		func:function(socket,d){
			Input.click(socket,d);
		},
	},
	'input':{
		minInterval:10,
		func:function(socket,d){
			Input.key(socket,d);
		},
	},
	'uploadMod':{
		minInterval:1000,
		func:function(socket,d){
			customModHandling(socket,d);
		},
	},
	
}











