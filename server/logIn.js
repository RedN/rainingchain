






Sign = {};
Sign.up = function(socket,d){
	
    var user = escape.quote(d.username);    
	var pass = escape.quote(d.password);
	var email = escape.email(d.email);
	var fuser = escape.user(user);
		
	if(user !==	 fuser){ socket.emit('signUp', { 'success':0, 'message':'<font color="red">Illegal characters in username.</font>'} ); return; }
	if(!Server.admin.have(user) && user.length < 3){ socket.emit('signUp', { 'success':0, 'message':'<font color="red">Too short username.</font>'} ); return; }
	if(pass.length < 3){ socket.emit('signUp', {'success':0, 'message':'<font color="red">Too short password.</font>'} ); return; }
	
	db.find('account',{username:user},{},function(err, results) { if(err) throw err;		
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
	p.username = user; 
	p.context = user;
	p.id = Math.randomId();
	p.publicId = Math.randomId(6);
	
    var m = Main.template(key); m.name = user; m.username = user;
	
	var activationKey = Math.randomId();
    var obj = {
        username:user,
        password:pass,
		email:email,
        salt:salt,
		activationKey:activationKey,
		emailActivated:0,
		signUpDate:Date.now(),
		lastSignIn:null,
		timePlayed:0,
		timePlayedThisWeek:0,
        online:0,
		admin:0,
    };
	
	
	
    db.insert('account',obj, function(err) { 	if (err) throw err;
		db.insert('player',Save.player(p,false), function(err) { 	if (err) throw err;
			db.insert('main',Save.main(m,false), function(err) { 	if (err) throw err;
				socket.emit('signUp', {'success':1,'message':'<font color="green">New Account Created.</font>'} );
				
				var str = 'Welcome to Raining Chain! This is your activation key for your account "' + user + '": ' + activationKey;
				
				if(email) nodemailer.email(user,'Raining Chain: Activation Key',str);
				
			});
		});
    });
}
         	
			
Sign.in = function(socket,d){
	var user = escape.quote(d.username);
	var pass = escape.quote(d.password);
	
	if(!Server.admin.have(user) && Object.keys(List.main).length >= Server.maxPlayerAmount){
		if(Server.loginMessage)		socket.emit('signIn', { 'success':0,'message':'<font color="red">' + Server.loginMessage + '</font>' }); 
		else if(Server.maxPlayerAmount !== 0)		socket.emit('signIn', { 'success':0,'message':'<font color="red">SERVER IS FULL.</font>' }); 
		else if(Server.maxPlayerAmount === 0)	socket.emit('signIn', { 'success':0,'message':'<font color="red">SERVER IS CLOSED.</font>' }); 
		return;
	}
	db.findOne('account',{username:user},function(err, account) { if(err) throw err;	
		if(!account){ socket.emit('signIn', { 'success':0,'message':'<font color="red">Wrong Password or Username.</font>' }); return }
		if(account.online) {	socket.emit('signIn', { 'success':0, 'message':'<font color="red">This account is already online.</font>' }); return; }
		if(account.banned) {	socket.emit('signIn', { 'success':0, 'message':'<font color="red">This account is banned.</font>' }); return; }
		crypto.pbkdf2(pass,account.salt,1000,64,function(err,pass){
			pass = new Buffer(pass, 'binary').toString('base64');
		
			if(pass !== account.password){ socket.emit('signIn', { 'success':0,'message':'<font color="red">Wrong Password or Username.</font>' }); return; }
			
			
			if(account.timePlayedThisWeek >= Server.timeLimit.perWeek){ 
				socket.emit('signIn', { 'success':0,'message':'<font color="red">You have already played over 24 hours this week.</font>' }); return; }

			//Success!
			var key = "p" + Math.randomId();
			Load(key,account,socket);
		});
	});
}

Sign.off = function(key,message){
	var socket = List.socket[key];
	if(!socket) return;
	socket.beingRemoved = 1;
	if(message){ socket.emit('warning','You have been disconnected: ' + message);}

	Save(key);
	db.update('account',{username:List.main[key].username},{'$set':{online:0},'$inc':{timePlayed:socket.globalTimer,timePlayedThisWeek:socket.globalTimer}},function(err){ 
		if(err) throw err;
		socket.removed = 1;
	});
		
}

Sign.off.remove = function(key){
	var socket = List.socket[key]; if(!socket){ Sign.off.remove.safe(key); return; }
	
	var act = List.all[key];
	if(act && List.map[act.map]) delete List.map[act.map].list[key];
	Activelist.remove(List.all[key]);
	delete List.nameToKey[List.all[key].name];
	delete List.actor[key];
	delete List.socket[key];
	delete List.main[key];
	delete List.all[key];
	delete List.btn[key];
	socket.disconnect();
}

Sign.off.remove.safe = function(key){
	var act = List.all[key];
	if(act) delete List.nameToKey[List.all[key].name];
	
	if(act && List.map[act.map])	delete List.map[act.map].list[key];
	
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
	var save = {};
    var toSave = ['respawnLoc','username','name','weapon','equip','skill','ability','abilityList'];
    for(var i in toSave){	save[toSave[i]] = player[toSave[i]]; }
	
    if(updateDb !== false){
        db.update('player',{username:player.username},save,db.err);
    } else { return save; }	//when sign up
}


Save.main = function(key,updateDb){
	var main = typeof key === 'string' ? List.main[key] : key;
    main = Save.main.compress(main);
    var save = {};
    var toSave = ['invList','bankList','tradeList','quest','username','name','social','passive','chrono'];
    for(var i in toSave){ save[toSave[i]] = main[toSave[i]]; }

    if(updateDb !== false){
        db.update('main',{username:main.username},save,db.err);
    } else { return save; } //when sign up
}

//Load Account
Load = function (key,account,socket,cb){
	Load.player(key,account,function(player){
		Load.main(key,account,function(main){
			//Player
			List.actor[key] = player;
			List.all[key] = player;
			List.map[player.map].list[player.id] = key;
			List.nameToKey[player.name] = key;
			
			List.main[key] = main;
			List.btn[key] = [];
		
			//Main
			Passive.updateBoost(key);
			Actor.permBoost(player,'Quest',Quest.reward.stack(main.quest));
			Quest.challenge.signIn(key);
			
			
			//Init Socket
			socket.key = key;
			socket.toRemove = 0;
			socket.timer = 0;
			socket.globalTimer = 0;
			socket.beingRemoved = 0;
			socket.removed = 0;
			socket.clientReady = 0;
			List.socket[key] = socket;
			
			
			//Cycle
			var now = Date.now();
			if(account.lastSignIn === null) Test.firstSignIn(key);
			else if((new Date(account.lastSignIn)).toLocaleDateString() !== (new Date(now).toLocaleDateString()))
				Test.dayCycle(key);
				
			db.update('account',{username:player.username},{'$set':{online:1,key:key,lastSignIn:now}},function(err, res) { if(err) throw err
				socket.emit('signIn', { success:1, key:key, data:Load.initData(key,player,main)});
			});
			
			var time = Math.floor(account.timePlayedThisWeek/Cst.HOUR) + 'h ' + Math.floor(account.timePlayedThisWeek%Cst.HOUR/Cst.MIN) + 'm';
			Chat.add(key,"You have played " + time + " this week.");
			
			Test.signIn(key);
			
		});	
	});	
}

Load.main = function(key,account,cb){
    db.find('main',{username:account.username},{_id:0},function(err, db) { if(err) throw err;	
		db = db[0];
		var main = useTemplate(Main.template(key),Load.main.uncompress(db,key));
		cb(main);
	});
}

Save.main.compress = function(mainn){
	var main = deepClone(mainn);
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
		symbol:main.social.symbol,
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
		status: "on",
		symbol:main.social.symbol
	};
	
	//If changes with quest
	var allQuest = Main.template.quest();
	for(var i in allQuest){
		if(!main.quest[i]) main.quest[i] = allQuest[i];
		for(var j in allQuest[i]){
			if(typeof main.quest[i][j] === 'undefined')
				main.quest[i][j] = allQuest[i][j];
		}
	}
	
	
	
    return main;
}

Load.player = function(key,account,cb){
   db.find('player',{username:account.username},{_id:0},function(err, db) { if(err) throw err;
		db = db[0];
		
		var player = Actor.template('player');   //set default player
		db = Load.player.uncompress(db);      //use info from the db

		for (var i in db) { player[i] = db[i]; }
		player.context = player.name;
		player.id = key;
		player.publicId = player.name;
		player.team = player.name;
		player = Actor.creation.optionList(player);

		cb(player);
	});
}

Save.player.compress = function(playerr){
	var player = deepClone(playerr);
	for(var i in player.ability.regular)	player.ability.regular[i] = player.ability.regular[i] ? player.ability.regular[i].id : 0;
	player.ability = player.ability.regular;
	
	player.respawnLoc.recent.x = Math.round(player.respawnLoc.recent.x);
	player.respawnLoc.recent.y = Math.round(player.respawnLoc.recent.y);
	player.respawnLoc.safe.x = Math.round(player.respawnLoc.safe.x);
	player.respawnLoc.safe.y = Math.round(player.respawnLoc.safe.y);
		
	//Skill
	player.skill = player.skill.exp;
	var tmp = [];
	for(var i in Cst.skill.list) tmp.push(player.skill[Cst.skill.list[i]]);
	player.skill = tmp;
	
	//Equip
	player.equip = player.equip.regular.piece;
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
	player.equip = {piece:player.equip,dmg:Cst.element.template(1),def:Cst.element.template(1)}
	var tmp = {};
	for(var i in Cst.equip.piece) tmp[Cst.equip.piece[i]] = player.equip.piece[i];
	player.equip.piece = tmp;	
	player.equip = Actor.template.equip(player.equip);
	Actor.updateEquip(player,false);
	
	
	player.respawnLoc = {safe:{x:player.x,y:player.y,map:player.map},
							recent:{x:player.x,y:player.y,map:player.map}};
							
    for(var i in player.ability)	player.ability[i] = Ability.uncompress(player.ability[i]);
	player.ability = Actor.template.ability(player.ability);
	
	
	
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
            'map':Change.send.convert.map,
            'equip':Change.send.convert.equip,
            'weapon':0,
            'skill':0,
            'ability':Change.send.convert.ability,
            'abilityList':Change.send.convert.abilityList,
			'permBoost':0,
        },
        'main':{
            'passive':0,
            'social':0,
            'quest':0,
			'invList':Change.send.convert.itemlist,
			'bankList':Change.send.convert.itemlist,
			'tradeList':Change.send.convert.itemlist,
			'hideHUD':0,			
        }
    }
    for(var i in array){
        for(var j in array[i]){
            if(array[i][j]){ data[i][j] = array[i][j](obj[i][j],player);  continue;}
            data[i][j] = obj[i][j];
        }
    }
		
	data.other.passiveGrid = [
		Db.passiveGrid.moddedGrid[main.passive.freeze[0] || Date.nowDate()],
		Db.passiveGrid.moddedGrid[main.passive.freeze[1] || Date.nowDate()]
	];
	
    return data;
}












