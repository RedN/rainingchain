
io.sockets.on('connection', function (socket) {
	socket.on('signUp', function (d) { 
		if(Server.ready) Sign.up(socket,d); 
	});
	socket.on('signIn', function (d) { 
		if(Server.ready) Sign.in(socket,d); 
	});
	socket.on('clientReady', function (d) { 
		if(!List.socket[socket.key]) return;
		List.socket[socket.key].clientReady = 1; 
	});

    socket.on('disconnect', function (d) {
		socket.toRemove = 1;
    });

});

Sign = {};
Sign.up = function(socket,d){
	
    var user = escape.quote(d.username);    
	var pass = escape.quote(d.password);
	var email = escape.email(d.email);
	var fuser = escape.user(user);
		
	if(user !==	 fuser){ socket.emit('signUp', { 'success':0, 'message':'<font color="red">Illegal characters in username.</font>'} ); return; }
	if(pass.length < 3){ socket.emit('signUp', {'success':0, 'message':'<font color="red">Too short password.</font>'} ); return; }
	
	db.account.find({username:user},{},function(err, results) { if(err) throw err;		
		if(results[0] !== undefined){ socket.emit('signUp', {'success':0,'message':'<font color="red">This username is already taken.</font>'} );  return; }	//Player with same username
				
		crypto.randomBytes(32, function(err,salt){
			salt = salt.toString('base64');
		
			crypto.pbkdf2(pass,salt,1000,64,function(err,pass){
				pass = new Buffer(pass, 'binary').toString('base64');
				Sign.up.create(user,pass,email,salt,socket);
			});
		});
	});
}

Sign.up.create = function(user,pass,email,salt,socket){
    var key = Math.random().toString(36).substring(7);
    var p = Actor.template('player'); 
	p.name = user; 
	p.context = user;
	p.id = Math.randomId();
	p.publicId = Math.randomId(6);
	
    var m = Main.template(key); m.name = user;
	
	var activationKey = Math.randomId();
    var obj = {
        username:user,
        password:pass,
		email:email,
        salt:salt,
		activationKey:activationKey,
		emailActivated:0,
		signUpDate:Date.now(),
        online:0,
		admin:0,
    };
	
	
	
    db.account.insert(obj, function(err) { 	if (err) throw err;
		db.player.insert(Save.player(p,false), function(err) { 	if (err) throw err;
			db.main.insert(Save.main(m,false), function(err) { 	if (err) throw err;
				socket.emit('signUp', {'success':1,'message':'<font color="green">New Account Created.</font>'} );
				
				var str = 'Welcome to Raining Chain! This is your activation key for your account "' + user + '": ' + activationKey;
				
				if(email) nodemailer.email(user,'Raining Chain: Activation Key',str);
				
			});
		});
    });
}
         
			


		
//could be improved
Sign.in = function(socket,d){
	var user = escape.quote(d.username);
	var pass = escape.quote(d.password);
	
	if(user !== 'sam' && Object.keys(List.main).length >= Beta.amount){
		if(Beta.message)		socket.emit('signIn', { 'success':0,'message':'<font color="red">' + Beta.message + '</font>' }); 
		else if(Beta.amount)		socket.emit('signIn', { 'success':0,'message':'<font color="red">SERVER IS FULL.</font>' }); 
		else if(!Beta.amount)	socket.emit('signIn', { 'success':0,'message':'<font color="red">SERVER IS CLOSED.</font>' }); 
		return;
	}
		
	db.account.find({username:user},function(err, results) { if(err) throw err;		
		if(results[0] === undefined){ socket.emit('signIn', { 'success':0,'message':'<font color="red">Wrong Password or Username.</font>' }); return }
		if(results[0].online) {	socket.emit('signIn', { 'success':0, 'message':'<font color="red">This account is already online.</font>' }); return; }
		
		crypto.pbkdf2(pass,results[0].salt,1000,64,function(err,pass){
			pass = new Buffer(pass, 'binary').toString('base64');
		
			if(pass !== results[0].password){ socket.emit('signIn', { 'success':0,'message':'<font color="red">Wrong Password or Username.</font>' }); return; }
			
			//Success!
			var key = "p" + Math.randomId();
			Load(key,user,socket);
		
		});
	});
}

Sign.off = function(key,message){
	var socket = List.socket[key];
	if(!socket) return;
	socket.beingRemoved = 1;
	if(message){ socket.emit('warning','You have been disconnected: ' + message);}

	Save(key);
	db.account.update({username:List.actor[key].name},{'$set':{online:0}},function(err){ 
		if(err) throw err;
		socket.removed = 1;
	});
		
}

Sign.off.remove = function(key){
	var socket = List.socket[key]; if(!socket){ Sign.off.remove.safe(key); return; }
	
	ActiveList.remove(List.all[key]);
	delete List.nameToKey[List.all[key].name];
	delete List.actor[key];
	delete List.socket[key];
	if(List.all[key] && List.map[List.all[key].map]) delete List.map[List.all[key].map].list[key];
	delete List.main[key];
	delete List.all[key];
	delete List.btn[key];
	socket.disconnect();
}

Sign.off.remove.safe = function(key){
	var mort = List.all[key];
	if(mort) delete List.nameToKey[List.all[key].name];
	
	if(mort && List.map[mort.map]) delete List.map[mort.map].list[key];
	
	delete List.actor[key];
	delete List.socket[key];
	delete List.main[key];
	delete List.all[key];
	delete List.btn[key];
}


//Save account
Save = function(key){
	Save.player(key);
    Save.main(key);
}

Save.player = function(key,updateDb){
	var player = typeof key === 'string' ? List.all[key] : key;
	player = Save.player.compress(player);
	player.username = player.username || player.name;
	var save = {};
    var toSave = ['x','y','map','username','weapon','equip','skill','ability','abilityList'];
    for(var i in toSave){	save[toSave[i]] = player[toSave[i]]; }
	
    if(updateDb !== false){
        db.player.update({username:player.username},save,db.err);
    } else { return save; }	//when sign up
}


Save.main = function(key,updateDb){
	var main = typeof key === 'string' ? List.main[key] : key;
    main = Save.main.compress(main);
	main.username = main.username || main.name;
    var save = {};
    var toSave = ['invList','bankList','tradeList','quest','username','social','passive','passivePt'];
    for(var i in toSave){ save[toSave[i]] = main[toSave[i]]; }

    if(updateDb !== false){
        db.main.update({username:main.username},save,db.err);
    } else { return save; } //when sign up
}


//Load Account
Load = function (key,user,socket){
	Load.player(key,user,function(player){
		Load.main(key,user,function(main){
			//Player
			List.actor[key] = player;
			List.all[key] = player;
			List.map[player.map].list[player.id] = key;
			List.nameToKey[player.name] = key;
			
			//Main
			Actor.permBoost(player,'Passive',Passive.convert(main.passive));
			Actor.permBoost(player,'Quest',Quest.convert(main.quest));
			List.main[key] = main;
			List.btn[key] = [];
		
			//Init Socket
			socket.key = key;
			socket.toRemove = 0;
			socket.timer = 0;
			socket.beingRemoved = 0;
			socket.removed = 0;
			socket.clientReady = 0;
			List.socket[key] = socket;
			
			Test.playerStart(key);

			db.account.update({username:player.name},{'$set':{online:1,key:key}},function(err, res) { if(err) throw err
				socket.emit('signIn', { cloud9:cloud9, success:1, key:key, data:Load.initData(key,player,main)});
			});
		});	
	});	
}

Load.main = function(key,user,cb){
    db.main.find({username:user},{_id:0},function(err, db) { if(err) throw err;	
		db = db[0];
		var main = useTemplate(Main.template(key),Load.main.uncompress(db,key));
		main.name = main.username;
		cb(main);
	});
}

Save.main.compress = function(main){
	delete main.tradeList;
	
	main.invList = main.invList.data;
	for(var i = main.invList.length-1; i>=0; i--){
		if(!main.invList[i].length) main.invList.splice(i,1);
	}
	
	main.bankList = main.bankList.data;
	for(var i = main.bankList.length-1; i>=0; i--){
		if(!main.bankList[i].length) main.bankList.splice(i,1);
	}
	
	main.social = {
		friend:main.social.list.friend,
		mute:main.social.list.mute,
		message:main.social.message,
	}

    return main;
}

Load.main.uncompress = function(main,key){
	main.invList = Itemlist.template('inventory', main.invList);
	main.bankList = Itemlist.template('bank', main.bankList);
	main.tradeList = Itemlist.template('inventory');
	
    main.invList.key = key;
    main.bankList.key = key;
    main.tradeList.key = key;
	
	
	main.social = {
		message: main.social.message,
		list: {
		  friend: main.social.friend,
		  mute: main.social.mute,
		  clan: [ ]
		},
		status: "on"
	};
	
	
	
    return main;
}

Load.player = function(key,user,cb){
   db.player.find({username:user},{_id:0},function(err, db) { if(err) throw err;
		db = db[0];
		
		var player = Actor.template('player');   //set default player
		db = Load.player.uncompress(db);      //use info from the db

		for (var i in db) { player[i] = db[i]; }
		player.name = player.username;
		player.context = player.username;
		player.id = key;
		player.publicId = player.name;
		player.team = player.name;
		player = Actor.creation.optionList(player);

		cb(player);
	});
}

Save.player.compress = function(player){
	for(var i in player.ability)	player.ability[i] = player.ability[i] ? player.ability[i].id : 0;

	if(!player.map.have("@MAIN")){	//then need to modify xymap
		player.x = player.respawnLoc.safe.x || 0;
		player.y = player.respawnLoc.safe.y || 0;
		player.map = player.respawnLoc.safe.map || 'test@MAIN';
	}
	
	player.x = Math.round(player.x);
	player.y = Math.round(player.y);
	
	//Skill
	player.skill = player.skill.exp;
	var tmp = [];
	for(var i in Cst.skill.list) tmp.push(player.skill[Cst.skill.list[i]]);
	player.skill = tmp;
	
	//Equip
	player.equip = player.equip.piece;
	var tmp = [];
	for(var i in Cst.equip.piece) tmp.push(player.equip[Cst.equip.piece[i]]);
	player.equip = tmp;
	
    return player;
}

Load.player.uncompress = function(player){
	//Skill
	player.skill = {exp:player.skill,lvl:{}};
	var tmp = {};
	for(var i in Cst.skill.list) tmp[Cst.skill.list[i]] = player.skill.exp[i];
	player.skill.exp = tmp;
	for(var i in player.skill.exp) player.skill.lvl[i] = Skill.getLvlViaExp(player.skill.exp[i]);
	
	//Equip
	player.equip = {piece:player.equip,dmg:Cst.element.template(1),def:Cst.element.template(1)};
	var tmp = {};
	for(var i in Cst.equip.piece) tmp[Cst.equip.piece[i]] = player.equip.piece[i];
	player.equip.piece = tmp;
	Actor.updateEquip(player);
	
	
	player.respawnLoc = {safe:{x:player.x,y:player.y,map:player.map},
							recent:{x:player.x,y:player.y,map:player.map}};
							
    for(var i in player.ability)	player.ability[i] = Ability.uncompress(player.ability[i]);
    return player;
}

Load.initData = function(key,player,main){
	//Value sent to client when starting game
    var data = {'player':{},'main':{},'other':{}};
    var obj = {'player':player, 'main':main}

    var array = {
        'player':{
            'name':0,
            'x':0,
            'y':0,
            'map':Map.getModel,
            'equip':0,
            'weapon':0,
            'skill':0,
            'ability':Change.send.convert.ability,
            'abilityList':0,
        },
        'main':{
            'passive':0,
            'social':0,
            'quest':0,
			'invList':Change.send.convert.itemlist,
			'bankList':Change.send.convert.itemlist,
			'tradeList':Change.send.convert.itemlist,
        }
    }
    for(var i in array){
        for(var j in array[i]){
            if(array[i][j]){ data[i][j] = array[i][j](obj[i][j]);  continue;}
            data[i][j] = obj[i][j];
        }
    }
	data.other.passive = {'db':Db.passive,'min':Db.passive.min,'max':Db.passive.max,'sum':Db.passive.sum,'option':Db.passive.option,'average':Db.passive.average};
    return data;
}












