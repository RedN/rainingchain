var db = requireDb();
var crypto = require('crypto');

Sign = {};
Sign.up = function(socket,d){
    var user = escape.quote(d.username);    
	var pass = escape.quote(d.password);
	var email = escape.email(d.email);
	var fuser = escape.user(user);
		
	if(user !==	 fuser){ socket.emit('signUp', { 'success':0, 'message':'<font color="red">Illegal characters in username.</font>'} ); return; }
	if(!Server.admin.have(user) && user.length < 3){ socket.emit('signUp', { 'success':0, 'message':'<font color="red">Too short username.</font>'} ); return; }
	if(pass.length < 3){ socket.emit('signUp', {'success':0, 'message':'<font color="red">Too short password.</font>'} ); return; }
	
	db.findOne('account',{username:user},{},function(err, results) { if(err) throw err;		
		if(results){ socket.emit('signUp', {'success':0,'message':'<font color="red">This username is already taken.</font>'} );  return; }	//Player with same username
				
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
	p.team = user;
	p.id = Math.randomId();
	p.publicId = Math.randomId(6);
	
    var m = Main.template(key); 
	m.name = user; 
	m.username = user;
	
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
	
	
	db.findOne('account',{username:user},{},function(err, results) { if(err) throw err;	
		if(results){ socket.emit('signUp', {'success':0,'message':'<font color="red">This username is already taken.</font>'} );  return; }	//Player with same username
		
		db.insert('account',obj, function(err) { 	if (err) throw err;
			db.insert('player',Save.player(p,false), function(err) { 	if (err) throw err;
				db.insert('main',Save.main(m,false), function(err) { 	if (err) throw err;
					socket.emit('signUp', {'success':1,'message':'<font color="green">New Account Created.</font>'} );
					
					var str = 'Welcome to Raining Chain! This is your activation key for your account "' + user + '": ' + activationKey;
					
					if(email) nodemailer.email(user,'Raining Chain: Activation Key',str);
					
				});
			});
		});
	});
}
         	
			
Sign.in = function(socket,d){
	var user = escape.quote(d.username);
	var pass = escape.quote(d.password);
	
	if(!Server.admin.have(user) && Object.keys(List.main).length >= Server.maxPlayerAmount){
		if(Server.loginMessage)		socket.emit('signIn', { 'success':0,'message':'<font color="red">' + Server.loginMessage + '</font>' }); 
		else if(Server.maxPlayerAmount !== 0)	socket.emit('signIn', { 'success':0,'message':'<font color="red">Server is full.</font>' }); 
		else if(Server.maxPlayerAmount === 0)	socket.emit('signIn', { 'success':0,'message':'<font color="red">Server is closed. Next open beta should come soon.</font>' }); 
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
			var key = "P" + Math.randomId();
			Load(key,account,socket);
		});
	});
}

Sign.off = function(key,message){
	var socket = List.socket[key];
	if(!socket) return ERROR(2,'no socket');
	socket.beingRemoved = 1;
	if(message){ socket.emit('warning',{signOff:1,text:'You have been disconnected: ' + message});}

	Save(key);
	db.update('account',{username:List.main[key].username},{'$set':{online:0},'$inc':{timePlayed:socket.globalTimer,timePlayedThisWeek:socket.globalTimer}},function(err){ 
		if(err) throw err;
		socket.removed = 1;
	});
		
}

Sign.off.remove = function(key){
	var socket = List.socket[key]; if(!socket){ Sign.off.remove.safe(key); ERROR(2,'no socket'); return; }
	
	var act = List.all[key];
	Actor.remove(act);
	delete List.nameToKey[act.name];
	delete List.socket[key];
	delete List.main[key];
	delete List.btn[key];
	socket.disconnect();
}

Sign.off.remove.safe = function(key){
	var act = List.all[key];
	if(act){
		delete List.nameToKey[act.name];
		Map.leave(act);
	}
	
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
    var toSave = ['respawnLoc','username','name','weapon','equip','skill','ability','abilityList','team'];
    for(var i in toSave){	save[toSave[i]] = player[toSave[i]]; }
	
    if(updateDb !== false) db.update('player',{username:player.username},save,db.err);
    else return save;	//when sign up
}


Save.main = function(key,updateDb){
	var main = typeof key === 'string' ? List.main[key] : key;
    main = Save.main.compress(main);
	
	//highscore
	var highscore = {username:main.username};
	for(var i in main.quest)
		for(var j in main.quest[i]._highscore)
			highscore[i + '-' + j] = main.quest[i]._highscore[j];
	if(updateDb !== false)	db.upsert('highscore',{username:main.username},highscore,db.err);
	
	//main
    var save = {};
    var toSave = ['invList','bankList','quest','questActive','username','name','social','passive','chrono'];
    for(var i in toSave){ save[toSave[i]] = main[toSave[i]]; }

    if(updateDb !== false)	db.update('main',{username:main.username},save,db.err);
    else return save; //when sign up
}

//Load Account
Load = function (key,account,socket,cb){
	Load.player(key,account,function(player){
		Load.main(key,account,function(main){
			//Player
			List.actor[key] = player;
			List.all[key] = player;
			List.nameToKey[player.name] = key;
			
			List.main[key] = main;
			List.btn[key] = [];
		
			//Main
			Passive.updateBoost(key);
			Actor.update.equip(player);
			Quest.challenge.signIn(key);
			
			
			//Init Socket
			socket.key = key;
			List.socket[key] = socket;
			
			
			//Cycle
			Load.enterGame(key,account,player,main,socket);
			
		});	
	});	
}

Load.main = function(key,account,cb){
    db.findOne('main',{username:account.username},{_id:0},function(err, db) { if(err) throw err;	
		cb(Tk.useTemplate(Main.template(key),Load.main.uncompress(db,key)));
	});
}

Save.main.compress = function(main){
	main = Tk.deepClone(main);
	
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
		muted:main.social.muted,
		puush:main.social.puush,
		message:main.social.message,
		symbol:main.social.symbol,
	}
	
	
	//quest
	for(var i in main.quest){
		var mq = main.quest[i];
		if(i !== main.questActive)
			main.quest[i] = {
				_rewardScore:mq._rewardScore,
				_rewardPt:mq._rewardPt,
				_complete:mq._complete,
				_skillPlot:mq._skillPlot,
				_challengeDone:mq._challengeDone,
				_bonus:mq._bonus,
				_highscore:mq._highscore,
			}
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
		  clan: []
		},
		status: "on",
		symbol:main.social.symbol,
		muted:main.social.muted,
		puush:main.social.puush,
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
   db.findOne('player',{username:account.username},{_id:0},function(err, db) { if(err) throw err;
		var player = Tk.useTemplate(Actor.template('player'),Load.player.uncompress(db));
		player.context = player.name;
		player.id = key;
		player.publicId = player.name;
		player = Actor.creation.optionList(player);
	
		cb(player);
	});
}

Save.player.compress = function(p){
	p = Tk.deepClone(p);
	
	//Ability
	p.ability = p.ability.regular;
	for(var i in p.ability)	p.ability[i] = p.ability[i] ? p.ability[i].id : 0;
	p.abilityList = Object.keys(p.abilityList.regular);
	
	
	p.respawnLoc.recent.x = Math.round(p.respawnLoc.recent.x);
	p.respawnLoc.recent.y = Math.round(p.respawnLoc.recent.y);
	p.respawnLoc.safe.x = Math.round(p.respawnLoc.safe.x);
	p.respawnLoc.safe.y = Math.round(p.respawnLoc.safe.y);
	
	//Skill
	var tmp = [];
	for(var i in Cst.skill.list) tmp.push(p.skill.exp[Cst.skill.list[i]]);	//must use cst for order
	p.skill = tmp;
	
	//Equip
	var tmp = [];
	for(var i in Cst.equip.piece) tmp.push(p.equip.regular.piece[Cst.equip.piece[i]]);
	p.equip = tmp;
	
	
    return p;
}

Load.player.uncompress = function(p){
	//Skill
	p.skill = {exp:p.skill,lvl:{}};
	var tmp = {};
	for(var i in Cst.skill.list) tmp[Cst.skill.list[i]] = p.skill.exp[i];
	p.skill.exp = tmp;
	for(var i in p.skill.exp) p.skill.lvl[i] = Skill.getLvlViaExp(p.skill.exp[i]);
	
	//Equip
	p.equip = {piece:p.equip,dmg:Cst.element.template(1),def:Cst.element.template(1)}
	var tmp = {};
	for(var i in Cst.equip.piece) tmp[Cst.equip.piece[i]] = p.equip.piece[i];
	p.equip.piece = tmp;	
	p.equip = Actor.template.equip(p.equip);
								
    for(var i in p.ability)	p.ability[i] = Ability.uncompress(p.ability[i]);
	p.ability = Actor.template.ability(p.ability);
	p.abilityChange = Actor.template.abilityChange(p.abilityList.regular);
	
	var tmp = {};	for(var i in p.abilityList) tmp[p.abilityList[i]] = 1;
	p.abilityList = Actor.template.abilityList(tmp);
	
	return p;
}











