
io.sockets.on('connection', function (socket) {
	socket.on('signUp', function (d) { Sign.up(socket,d); });
	socket.on('signIn', function (d) { Sign.in(socket,d); });
	socket.on('clientReady', function (d) { List.socket[socket.key] = socket; });

    socket.on('disconnect', function (d) {
		socket.toRemove = 1;
    });

});

Sign = {};
Sign.up = function(socket,d){
	
    var user = customEscape(d.username);    
	var pass = customEscape(d.password);
	var fuser = user.replace(/[^a-z0-9 ]/ig, '');
	if(user !==	 fuser){ socket.emit('signUp', { 'success':0, 'message':'<font color="red">Illegal characters in username.</font>'} ); return; }
	if(pass.length < 3){ socket.emit('signUp', {'success':0, 'message':'<font color="red">Too short password.</font>'} ); return; }
	
	if(user === 'sam'){ for(var i in List.socket) Sign.off(i); }   //for testing
		
	db.account.find({username:user},function(err, results) { if(err) throw err;		
		if(results[0] !== undefined){ socket.emit('signUp', {'success':0,'message':'<font color="red">This username is already taken.</font>'} );  return; }	//Player with same username
				
		crypto.randomBytes(32, function(err,salt){
			salt = salt.toString('base64');
		
			crypto.pbkdf2(pass,salt,1000,128,function(err,pass){
				pass = new Buffer(pass, 'binary').toString('base64');
				Sign.up.create(user,pass,salt,socket);
			});
		});
	});
}

Sign.up.create = function(user,pass,salt,socket){
    var key = Math.random().toString(36).substring(7);
    var p = Mortal.template('player'); 
	p.name = user; 
	p.context = user;
	p.id = Math.randomId();
	p.publicId = Math.random().toString(36).substring(13);
	
    var m = Main.template(key); m.name = user;

    var obj = {
        username:user,
        password:pass,
        salt:salt,
        id:key,
        online:0,
        player:Save.player(p,false),
        main:Save.main(m,false),
        passive:Passive.template(),
    };
    db.account.insert(obj, function(err) { 
        if (err) throw err;
		socket.emit('signUp', {'success':1,'message':'<font color="green">New Account Created.</font>'} );
    });

}
         
			
			
//could be improved
Sign.in = function(socket,d){
	var user = customEscape(d.username);
	var pass = customEscape(d.password);
		
	db.account.find({username:user},function(err, results) { if(err) throw err;		
		if(results[0] === undefined){ socket.emit('signIn', { 'success':0,'message':'<font color="red">Wrong Password or Username.</font>' }); return }
		if(results[0].online) {	socket.emit('signIn', { 'success':0, 'message':'<font color="red">This account is already online.</font>' }); return; }
		
		crypto.pbkdf2(pass,results[0].salt,1000,128,function(err,pass){
			pass = new Buffer(pass, 'binary').toString('base64');
		
			if(pass !== results[0].password){ socket.emit('signIn', { 'success':0,'message':'<font color="red">Wrong Password or Username.</font>' }); return; }
			
			//Success!
			var key = "p" + Math.randomId();
			Load(key,results[0],socket);
		
		});
	});
}

Sign.off = function(key,message){
	var socket = List.socket[key];
	if(!socket) return;
	if(message){ socket.emit('warning','You have been disconnected: ' + message);}

	Save(key);
	db.account.update({username:List.mortal[socket.key].name},{'$set':{online:0}},function(err){ 
		if(err) throw err;
		ActiveList.remove(List.all[key]);
		delete List.nameToKey[List.all[key].name];
		delete List.mortal[key];
		delete List.socket[key];
		delete List.main[key];
		delete List.all[key];
		delete List.btn[key];
		socket.disconnect();
	});
	
}



//Save account
Save = function(key){
	Save.player(key);
    Save.main(key);
}

Save.player = function(key,updateDb){
	var player = typeof key === 'string' ? List.all[key] : key;
	player = Save.player.compress(player);
	
	var save = {};
    var toSave = ['x','y','map','name','context','weapon','equip','mapMod','lvl','ability','abilityList'];
    for(var i in toSave){	save[toSave[i]] = player[toSave[i]]; }

    if(updateDb !== false){
        db.account.update({username:player.name},{'$set': {player:save}},db.err);
    } else { return save; }	//when sign up
}

Save.player.compress = function(player){
    player.weapon = {"id":player.weapon.id};
    for(var i in player.equip.piece){ player.equip.piece[i] = {"id":player.equip.piece[i].id}; }
    player.equip = {'piece':player.equip.piece};

    for(var i in player.ability){
        if(player.ability[i]){
            player.ability[i] = {"id":player.ability[i].id};
        }
    }
    for(var i in player.abilityList){ player.abilityList[i] = {"id":player.abilityList[i].id}; }

	
	if(player.map.indexOf("@") !== -1){
		player.x = player.mapLogIn.x || 0;
		player.y = player.mapLogIn.y || 0;
		player.map = player.mapLogIn.map || 'test';		
	}
	
    return player;
}

Save.main = function(key,updateDb){
	var main = typeof key === 'string' ? List.main[key] : key;
    main = Save.main.compress(main);
	
    var save = {};
    var toSave = ['invList','bankList','tradeList','quest','name','social','pref','passive','passivePt',];
    for(var i in toSave){ save[toSave[i]] = main[toSave[i]]; }

    if(updateDb !== false){
        db.account.update({username:main.name},{'$set': {main:save,passive:main.passive}},db.err);
    } else { return save; } //when sign up
}

Save.main.compress = function(main){
	//could compress invlist and banklist
	
	
	
    return main;
}


//Load Account
Load = function (key,dbb,socket){
	var player = Load.player(key,dbb.player);	//need to load first for passive
    var main = Load.main(key,dbb.main);

    //Init Socket
    socket.key = key;
    socket.toRemove = 0;
	socket.timer = 0;

    Test.playerStart(key);

    db.account.update({username:player.name},{'$set':{online:1,key:key}},function(err, res) { if(err) throw err
        socket.emit('signIn', { cloud9:cloud9, success:1, key:key, data:Load.initData(key,player,main)});
    });
}

Load.main = function(key,db){
    List.main[key] = useTemplate(Main.template(key),Load.main.uncompress(db,key));
	List.btn[key] = [];
	Mortal.permBoost(List.all[key],'Passive',Passive.convert(db.passive));
	return List.main[key];
}

Load.main.uncompress = function(main,key){
    main.invList.key = key;
    main.bankList.key = key;
    main.tradeList.key = key;
    return main;
}

Load.player = function(key,db){
    var player = Mortal.template('player');   //set default player
    db = Load.player.uncompress(db);      //use info from the db

    for (var i in db) { player[i] = db[i]; }

    player.id = key;
    player.publicId = player.name;
    player = Mortal.creation.optionList(player);
	
	List.mortal[key] = player;
    List.all[key] = player;
    List.nameToKey[player.name] = key;
	return player;
}

Load.player.uncompress = function(player){
    player.weapon = Db.equip[player.weapon.id];
    for(var i in player.equip.piece){ player.equip.piece[i] = Db.equip[player.equip.piece[i].id]; }
    player.equip.def = {'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1};
    player.equip.dmg = {'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1};
    Mortal.updateEquip(player);


    for(var i in player.abilityList){
        player.abilityList[i] = Ability.uncompress(player.abilityList[i].id);
    }
    for(var i in player.ability){
        if(player.ability[i]){
            Mortal.swapAbility(player,+i,player.ability[i].id);
        }
    }
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
            'map':0,
            'equip':0,
            'weapon':0,
            'skill':0,
            'ability':Change.send.convert.abilityList,
            'abilityList':Change.send.convert.abilityList
        },
        'main':{
            'passive':0,
            'social':0,
            'pref':0,
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










