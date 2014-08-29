//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Db','Actor','Tk','Server','Party','Account','Main','requireDb','Itemlist','Quest','Map','Skill','Ability','Passive','Chat'],['Sign','Save','Load']));
var db = requireDb();
var crypto = require('crypto');

/*
changes:
emailActivationKey

*/


var Sign = exports.Sign = {};
Sign.up = function(socket,d){
	for(var i in d)
		d[i] = escape.quote(d[i]);
		
	d.email = escape.email(d.email || '');
	d.password = d.password || '';
	
	if(NODEJITSU && !d.email) return socket.emit('signUp', { 'success':0, 'message':'<font color="red">Invalid Email.</font>'} );
	if(d.username !== escape.user(d.username || '') || Server.bannedName.have(d.username)) return socket.emit('signUp', { 'success':0, 'message':'<font color="red">Illegal characters in username.</font>'} );
	if(!Server.isAdmin(0,d.username) && d.username.length < 3) return socket.emit('signUp', { 'success':0, 'message':'<font color="red">Too short username.</font>'} );
	if(d.password.length < CST.minPasswordLength) return socket.emit('signUp', {'success':0, 'message':'<font color="red">Too short password.</font>'} ); 

	db.findOne('account',{username:d.username},{},function(err, res) { if(err) throw err;		
		if(res) return socket.emit('signUp', {'success':0,'message':'<font color="red">This username is already taken.</font>'} );	//Player with same username		
		Account.encryptString(d.password,'',function(data){
			Sign.up.create(d,data,socket);
		});
	});
}



Sign.up.create = function(d,data,socket){
	db.findOne('account',{username:d.username},{},function(err, res) { if(err) throw err;	
		if(res) return socket.emit('signUp', {'success':0,'message':'<font color="red">This username is already taken.</font>'} ); 		//Player with same username
		
		var key = Math.randomId();
		var p = Tk.useTemplate(Actor.template('player'),{ 
			name:d.username, 
			username:d.username, 
			context:d.username, 
			party:d.username, 
			id:Math.randomId(),
			publicId:Math.randomId(),
		},0,1);
		
		var m = Tk.useTemplate(Main.template(key),{
			name:d.username, 
			username:d.username, 
			'contribution,point,twitch,username':d.twitch,
			'contribution,point,youtube,username':d.youtube,
			'contribution,point,reddit,username':d.reddit,
			'contribution,point,twitter,username':d.twitter,
		},0,1);
		
		var emailActivationKey = Math.random().toString().slice(2);
		var account = Tk.useTemplate(Account.template(),{
			username:d.username, 
			name:d.username, 
			password:data.password,
			salt:data.salt,
			email:d.email,
			emailActivationKey:emailActivationKey,
		},0,1);
		
		
		
		db.insert('account',account, function(err) { 	if (err) throw err;
			db.insert('player',Save.player(p,false), function(err) { 	if (err) throw err;
				db.insert('main',Save.main(m,false), function(err) { 	if (err) throw err;
					socket.emit('signUp', {'success':1,'message':'<font color="green">New Account Created.<br>You can now Sign In.</font>'} );
					
					Account.sendActivationKey(account);
				});
			});
		});
	});
}
         	

Sign.in = function(socket,d){
	var user = escape.quote(d.username);
	var pass = escape.quote(d.password);
	db.findOne('account',{username:user},function(err, account) { if(err) throw err;
		if(!account) return socket.emit('signIn', { 'success':0,'message':'<font color="red">Wrong Password or Username.</font>' });
		
		if(account.banned) return socket.emit('signIn', { 'success':0, 'message':'<font color="red">This account is banned.</font>' });
		
		Account.encryptString(pass,account.salt,function(data){
			var pass = data.password;
			if(pass !== account.password) return socket.emit('signIn', { 'success':0,'message':'<font color="red">Wrong Password or Username.</font>' });
			
			if(account.online){
				if(List.nameToKey[user]) Sign.off(List.nameToKey[user]);
				db.update('account',{username:user},{'$set':{online:0}},db.err);
				return socket.emit('signIn', { 'success':0, 'message':'<font color="red">This account was online.<br>We just logged it off.<br>Try connecting again.</font>' });
			}
			
			if(account.timePlayedThisWeek >= Server.timeLimit.perWeek)
				return socket.emit('signIn', { 'success':0,'message':'<font color="red">You have already played over 24 hours this week.</font>' });
			
			//Success!
			socket.emit('signIn', { 'success':1,'message':'Loading account...' });
			
			
			var key = "P" + Math.randomId();
			Load(key,account,socket);
		});
	});
}

Sign.off = function(key,message){
	var socket = List.socket[key];
	if(!socket) return ERROR(2,'no socket');
	Main.closeAllWindow(List.main[key]);	//for trade
	socket.beingRemoved = 1;
	if(message){ socket.emit('warning',{signOff:1,text:'You have been disconnected:<br> ' + message});}
	
	Sign.updateFriendList(key,'off');
	Save(key);
	db.update('account',{username:List.main[key].username},{'$set':{online:0},'$inc':{timePlayedTotal:socket.globalTimer,timePlayedThisWeek:socket.globalTimer}},function(err){ 
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


Sign.updateFriendList = function(key,direction,name){
	var act = List.all[key];
	if(!act) return;
	for(var i in List.main){
		if(i === key) continue;	//otherwise, it adds and stay in db and show log off on log in
		var text = act.name.q() + ' just logged ' + direction + '.';
		if(direction === 'in')
			Chat.add(i,{type:'signIn',text:text});
		else Chat.add(i,text);
		if(List.main[i].social.list.friend[act.username]) List.main[i].flag['social,list,friend'] = 1;
		
	}
}



//Save account
var Save = exports.Save = function(key){	//51 ms to save
	Save.highscore(key);
	try { Save.main(key);}catch(err){ ERROR.err(3,err);}
	try {Save.player(key);}catch(err){ ERROR.err(3,err);}
}

Save.player = function(key,updateDb){
	var player = typeof key === 'string' ? List.all[key] : key;
	try { player = Save.player.compress(player); }catch(err){ ERROR.err(3,err);}
	var save = {};
    var toSave = ['respawnLoc','username','name','weapon','equip','skill','ability','abilityList','party'];
    for(var i in toSave){	save[toSave[i]] = player[toSave[i]]; }
	
    if(updateDb !== false) db.update('player',{username:player.username},save,db.err);
    else return save;	//when sign up
}


Save.main = function(key,updateDb,cb){
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
    var toSave = ['invList','bankList','quest','questActive','username','name','social','passive','chrono','dailyTask','contribution'];
    for(var i in toSave){ save[toSave[i]] = main[toSave[i]]; }

    if(updateDb !== false)	db.update('main',{username:main.username},save,cb);
    else return save; //when sign up
}

Save.highscore = function(key){
	var main = typeof key === 'string' ? List.main[key] : key;
	Quest.complete.highscore(key,main.quest['Qhighscore'],Db.quest['Qhighscore']);
	Quest.complete.highscore(key,main.quest['Qcontribution'],Db.quest['Qcontribution']);
}

//Load Account
var Load = exports.Load = function (key,account,socket,cb){	//90ms to load
	Load.player(key,account,function(player){
		Load.main(key,account,function(main){
			Sign.enterGame.verifyIntegrity(key,main,player);
	
			//Player
			List.actor[key] = player;
			List.all[key] = player;
			List.nameToKey[player.name] = key;
			
			List.main[key] = main;
			List.btn[key] = [];
			Party.join(player,player.party);
			
			//Main
			Passive.updateBoost(key);
			Passive.updatePt(key);
			Actor.update.equip(player);
			Quest.challenge.signIn(key);
			
			
			//Init Socket
			socket.key = key;
			List.socket[key] = socket;
			
			
			//Cycle
			Sign.enterGame(key,account,player,main,socket);
			Sign.updateFriendList(key,'in');
			
			socket.emit('signIn', { 'doneLoadingAccount':1,'message':'Done loading account. Waiting for images.' });
		});	
	});	
}

Load.main = function(key,account,cb){
    db.findOne('main',{username:account.username},{_id:0},function(err, db) { if(err) throw err;	
		cb(Tk.useTemplate(Main.template(key),Load.main.uncompress(db,key),false));
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
		puush:main.social.puush,	//if player can send puush
		message:main.social.message,
		customChat:main.social.customChat,
	}

	
	//quest
	for(var i in main.quest){
		var mq = main.quest[i];
		if(i !== main.questActive)
			main.quest[i] = {	//what to save if not active
				_rewardScore:mq._rewardScore,
				_rewardPt:mq._rewardPt,
				_complete:mq._complete,
				_skillPlot:mq._skillPlot,
				_challengeDone:mq._challengeDone,
				_bonus:mq._bonus,
				_highscore:mq._highscore,
				_rating:mq._rating,
				_started:mq._started,
				_enemyKilled:mq._enemyKilled,
			}
	}
	
	//chrono
	for(var i in main.chrono){
		if(!main.chrono[i].active) delete main.chrono[i];
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
		customChat:main.social.customChat,
		muted:main.social.muted,
		puush:main.social.puush,
	};
	
	//If changes with quest
	var allQuest = Main.template.quest();
	for(var i in allQuest){
		if(!main.quest[i]) main.quest[i] = allQuest[i];
		for(var j in allQuest[i]){
			if(typeof main.quest[i][j] === 'undefined')	//add lost on compression var + add new version variable
				main.quest[i][j] = allQuest[i][j];
		}
		
		for(var j in allQuest[i]._challengeDone){	//add new version challenge
			if(typeof main.quest[i]._challengeDone[j] === 'undefined'){	
				main.quest[i]._challengeDone[j] = 0;
				main.quest[i]._challenge[j] = 0;
			}
		}
		for(var j in allQuest[i]._highscore){	//add new version highscore
			if(typeof main.quest[i]._highscore[j] === 'undefined'){	
				main.quest[i]._highscore[j] = null;
				main.quest[i]._highscore[j] = null;
			}
		}
	}
	
	
	
    return main;
}

Load.player = function(key,account,cb){
	db.findOne('player',{username:account.username},{_id:0},function(err, db) { if(err) throw err;
		var player = Tk.useTemplate(Actor.template('player'),Load.player.uncompress(db),false);
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
	p.ability = p.ability.normal;
	for(var i in p.ability)	p.ability[i] = p.ability[i] ? p.ability[i].id : 0;
	p.abilityList = Object.keys(p.abilityList.normal);
	
	
	p.respawnLoc.recent.x = Math.round(p.respawnLoc.recent.x);
	p.respawnLoc.recent.y = Math.round(p.respawnLoc.recent.y);
	p.respawnLoc.safe.x = Math.round(p.respawnLoc.safe.x);
	p.respawnLoc.safe.y = Math.round(p.respawnLoc.safe.y);
	
	//Skill
	var tmp = [];
	for(var i in CST.skill) tmp.push(p.skill.exp[CST.skill[i]]);	//must use cst for order
	p.skill = tmp;
	
	//Equip
	var tmp = [];
	for(var i in CST.equip.piece) tmp.push(p.equip.normal.piece[CST.equip.piece[i]]);
	p.equip = tmp;
	
	
    return p;
}

Load.player.uncompress = function(p){
	//Skill
	p.skill = {exp:p.skill,lvl:{}};
	var tmp = {};
	for(var i in CST.skill) tmp[CST.skill[i]] = p.skill.exp[i];
	p.skill.exp = tmp;
	for(var i in p.skill.exp) p.skill.lvl[i] = Skill.getLvlViaExp(p.skill.exp[i]);
	
	//Equip
	p.equip = {piece:p.equip,dmg:CST.element.template(1),def:CST.element.template(1)}
	var tmp = {};
	for(var i in CST.equip.piece) tmp[CST.equip.piece[i]] = p.equip.piece[i];
	p.equip.piece = tmp;	
	p.equip = Actor.template.equip(p.equip);
	
	for(var i in p.ability)	if(p.ability[i]) p.ability[i] = Ability.functionVersion(p.ability[i]);
	p.ability = Actor.template.ability(p.ability);
	p.abilityChange = Actor.template.abilityChange(p.abilityList.normal);
	
	var tmp = {};	for(var i in p.abilityList) tmp[p.abilityList[i]] = 1;
	p.abilityList = Actor.template.abilityList(tmp);
	
	return p;
}











