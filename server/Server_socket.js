//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','io','List','Tk','Init','Server','Sign','Input','Chat','Performance','Command','Account']));

Server.handleSocket = function(name,socket,d){
	var event = Db.socket[name];
	if(!event) return;
	
	if(event.online && !List.main[socket.key]){ socket.disconnect(); return; }
	
	var time = Date.now();
	if(socket.emitCount[name] /Math.max(socket.globalTimer/CST.MIN,5) > event.limitPerMin) return;
	if(time-socket.emitLast[name] < event.minInterval) return;
	
	socket.emitLast[name] = time;
	socket.emitCount[name]++;
	try {	event.func(socket,d); }
	catch (err){	
		ERROR.err(3,err);
		if(socket.key) Sign.off(socket.key,'Error. Reload the page'); 
		else socket.disconnect();
	}
	
	if(Server.ready) Performance.bandwidth('download',d,socket);
}

Init.socket = function(socket){
	var t = Init.socket.template();
	for(var i in t) socket[i] = t[i];
	
	return socket;
}
Init.socket.template = function(){
	var a = {};	for(var i in Db.socket) a[i] = 0;
	
	return {
		emitCount:a,
		emitLast:Tk.deepClone(a),
		toRemove:0,
		timer:0,
		globalTimer:0,
		beingRemoved:0,
		removed:0,
		clientReady:0,
		bandwidth:{upload:0,download:0},
		key:null	//set when sign in
	}
}


io.sockets.on('connection', function (socket) {
	socket = Init.socket(socket);
	
	//Init.socket(socket);
	socket.on('signUp', function (d) { Server.handleSocket('signUp',socket,d);});
	socket.on('signIn', function (d) { Server.handleSocket('signIn',socket,d);});
	socket.on('clientReady', function (d) { Server.handleSocket('clientReady',socket,d);});
    socket.on('disconnect', function (d) { Server.handleSocket('disconnect',socket,d);});
	
    socket.on('sendChat', function (d) { Server.handleSocket('sendChat',socket,d);});
    socket.on('Command.send', function (d) { Server.handleSocket('Command.send',socket,d);});
    socket.on('queryDb', function (d) { Server.handleSocket('queryDb',socket,d);});
    socket.on('testing', function (d) { Server.handleSocket('testing',socket,d);});
    socket.on('click', function (d) { 	Server.handleSocket('click',socket,d);});
    socket.on('input', function (d) { Server.handleSocket('input',socket,d);});
    socket.on('uploadMod', function (d) { Server.handleSocket('uploadMod',socket,d);});
	
	socket.on('ping', function (d) { Server.handleSocket('ping',socket,d);});
	socket.on('account', function (d) { Server.handleSocket('account',socket,d);});
});


Db.socket = {
	'signUp':{
		limitPerMin:1,
		minInterval:1000,
		online:0,
		func:function(socket,d){
			if(Server.ready){
				socket.emit('signUp', { 'message':'Creating account...' }); 
				Sign.up(socket,d); 
			}
			else socket.emit('signIn', { 'success':0,'message':'<font color="red">Server is closed. Next open beta should come soon.</font>' }); 
		},
	},
	'signIn':{
		limitPerMin:1,
		minInterval:1000,
		online:0,
		func:function(socket,d){
			if(Server.ready){
				if(!Server.isAdmin(0,d.username) && Server.getPlayerAmount() >= Server.maxPlayerAmount){
					if(Server.loginMessage)		socket.emit('signIn', { 'success':0,'message':'<font color="red">' + Server.loginMessage + '</font>' }); 
					else if(Server.maxPlayerAmount !== 0)	socket.emit('signIn', { 'success':0,'message':'<font color="red">Server is full.</font>' }); 
					else if(Server.maxPlayerAmount === 0)	socket.emit('signIn', { 'success':0,'message':'<font color="red">Server is closed. Next open beta should come soon.</font>' }); 
					return;
				}
				socket.emit('signIn', { load:1,'message':'Verifying password...' }); 
				Sign.in(socket,d); 
			} else socket.emit('signIn', { 'success':0,'message':'<font color="red">Server is closed. Next open beta should come soon.</font>' }); 
		},
	},
	'clientReady':{
		limitPerMin:1,
		minInterval:1000,
		online:0,
		func:function(socket,d){
			if(!List.socket[socket.key]) return;
			List.socket[socket.key].clientReady = 1; 
		},
	},
	'disconnect':{
		limitPerMin:1,
		minInterval:1000,
		online:0,
		func:function(socket,d){
			socket.toRemove = 1;
		},
	},
	'sendChat':{
		limitPerMin:100,
		minInterval:500,
		online:1,
		func:function(socket,d){
			d.key = socket.key;
			Chat.receive(d);
		},
	},
	'Command.send':{
		limitPerMin:30,
		minInterval:0,
		online:1,
		func:function(socket,d){
			Command.receive(socket,d);
		},
	},
	'queryDb':{
		limitPerMin:20,
		minInterval:0,
		online:1,
		func:function(socket,d){
			d.key = socket.key;
			Db.query(d,function(toreturn){
				if(toreturn) socket.emit('queryDb',toreturn); 
				else socket.emit('queryDb',{'failure':1});
			});
		},
	},
	'testing':{
		limitPerMin:20,
		minInterval:0,
		online:1,
		func:function(socket,d){
			var act = List.all[socket.key];
			if(act && act.name && Server.isAdmin(socket.key))
				Db.query.admin(socket,d);
		},
	},
	'click':{
		limitPerMin:60*1000/40,
		minInterval:10,
		online:1,
		func:function(socket,d){
			Input.click(socket,d);
		},
	},
	'input':{
		limitPerMin:60*1000/40,
		minInterval:10,
		online:1,
		func:function(socket,d){
			Input.key(socket,d);
		},
	},
	'uploadMod':{
		limitPerMin:2,
		minInterval:1000,
		online:0,
		func:function(socket,d){
			//customModHandling(socket,d);	//TOFIX
		},
	},
	'ping':{
		limitPerMin:100,
		minInterval:10,
		online:0,
		func:function(socket,d){
			var tmp = {send:d.send,receive:Date.now()};
			socket.emit('ping', tmp);
		},
	},
	'account':{
		limitPerMin:10,
		minInterval:10,
		online:0,	//some action yes
		func:function(socket,d){
			Account.socketManagement(socket,d);
		},
	},
	
	
}











