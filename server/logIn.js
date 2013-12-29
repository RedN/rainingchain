
//Log In / Out
//quick fix in Save.main.load
io.sockets.on('connection', function (socket) {
   socket.on('logIn', function (d) {

        var user = customEscape(d.username);
        var pass = customEscape(d.password);

        db.account.find({username:user},function(err, results) {
            if(err) throw err;
            
             if(results[0] !== undefined){
                // Check if the passwords match
				/*
                bcrypt.compare(pass, results[0].password,function(err,goodpassword){
                    if(err) throw err;
                    if(goodpassword){
				*/
					if(pass === results[0].password){
                        // Check if the user is online
                        if(results[0].online) {
                            socket.emit('logIn', { 'success':0, 'message':'<font color="red">This account is already online.</font>' });
                        } else { //Succes!
                            var key = "p" + Math.randomId();
                            Save.load(key,results[0],user,socket);
                        }
                    } else { socket.emit('logIn', { 'success':0,'message':'<font color="red">Wrong Password or Username.</font>' }); }
                //});
            } else { socket.emit('logIn', { 'success':0,'message':'<font color="red">Wrong Password or Username.</font>' }); }
        });
    });

    socket.on('disconnect', function (d) {
        db.account.update({id:socket.key},{'$set':{online:0}},function(err, res) {
            socket.toRemove = 1;
        });
    });
});

//New Player
io.sockets.on('connection', function (socket) {
    socket.on('newPlayer', function (d) {
        var user = customEscape(d.username);    
        if(user === 'sam'){ for(var i in mainList) disconnectPlayer(i); }   //for testing
        var pass = customEscape(d.password);

        var bool = 1;
        var fuser = user.replace(/[^a-z0-9 ]/ig, '');
        if(user != fuser){ bool = 0; socket.emit('newPlayer', { 'success':0, 'message':'<font color="red">Illegal characters in username.</font>'} );  }
        if(pass.length < 3){ bool = 0; socket.emit('newPlayer', {'success':0, 'message':'<font color="red">Too short password.</font>'} );  }
        
        if(bool){
            db.account.find({username:user},function(err, results) {
                if(err) throw err;
                if(results[0] !== undefined){ socket.emit('newPlayer', {'success':0,'message':'<font color="red">This username is already taken.</font>'} );  }	//Player with same username
                else{
					newPlayer(user,pass,socket);
					
					/*
                    bcrypt.genSalt(8, function(err,salt){   //changed to 8
                        if(err) throw err;
                        bcrypt.hash(pass, salt,function(err, hashedpass){
                            if(err) throw err;
                            newPlayer(user,hashedpass,socket);
                        });
                    });
                    */
                }
            });
        }
    });
});

newPlayer = function(user,pass,socket){
    var key = Math.random().toString(36).substring(7);
    var p = defaultPlayer(); p.name = user; p.context = user;
    var m = defaultMain(key); m.name = user;

    var obj = {
        username:user,
        password:pass,
        id:key,
        online:0,
        player:Save.player(p,false),
        main:Save.main(m,false),
        passive:defaultPassive(),
    };
    db.account.insert(obj, function(err) { 
        if (err) throw err;
        socket.emit('newPlayer', {'success':1,'message':'<font color="green">New Account Created.</font>'} );
    });

}



//Disconnection
//need fix
disconnectPlayer = function(key,message){
    if(typeof key === 'string'){
        if(message){ socketList[key].emit('warning','You have been disconnected: ' + message);}
        Save(key);
        ActiveList.remove(fullList[key]);
        socketList[key].disconnect();
        delete nameToKey[fullList[key].name];
        delete mList[key];
        delete socketList[key];
        delete mainList[key];
        delete fullList[key];
    } else {
        if(message){ key.emit('warning','You have been disconnected: ' + message);}
        key.disconnect();
    }
}

//when client is ready, add socket to the list.
io.sockets.on('connection', function (socket) {
    socket.on('clientReady', function (d) {
        if(d){	socketList[socket.key] = socket; }
    });
});




////Saving & Loading////
Save = function(key){
    Save.player(key);
    Save.main(key);
}

//Init Account. key:string, dbb:db.account of that player, user:username, socket:socket
Save.load = function (key,dbb,user,socket){
    Save.player.load(key,dbb.player);
    Save.main.load(key,dbb.main);

    //Init Socket
    socket.key = key;
    socket.toRemove = 0;

    Test.playerStart(key);

    db.account.update({username:user},{'$set':{online:1,id:key}},function(err, res) { if(err) throw err
        socket.emit('logIn', { cloud9:cloud9, success:1, key:key, data:Save.load.initData(key)});
    });
}

//Value sent to client when starting game
Save.load.initData = function(key){
    var data = {'player':{},'main':{}};
    var obj = {'player':fullList[key], 'main':mainList[key]}

    var array = {
        'player':{
            'name':0,
            'x':0,
            'y':0,
            'map':0,
            'armor':0,
            'weapon':0,
            'weaponList':0,
            'skill':0,
            'ability':Change.send.convert.abilityList,
            'abilityList':Change.send.convert.abilityList
        },
        'main':{
            'passiveGrid':(function(){ return passiveGrid; }),
            'passive':0,
            'friendList':0,
            'muteList':0,
            //'bankList':Change.send.convert.invList,
            'chatBox':0,
            'pref':0,
            'quest':0,    
        }
    }
    for(var i in array){
        for(var j in array[i]){
            if(array[i][j]){ data[i][j] = array[i][j](obj[i][j]);  continue;}
            data[i][j] = obj[i][j];
        }
    }

   data.main.invList = obj.main.invList.toClient();

    return data;
}

Save.player = function(key,updateDb){
    if(typeof key === 'string'){ var player = Save.player.compress(fullList[key]); }
    else { var player = Save.player.compress(key); }

    var username = player.name;

    var save = {};

    var toSave = ['x','y','map','name','context','weapon','weaponList','armor','loginLocation','mapMod','exp','lvl','ability','abilityList'];
    for(var i in toSave){	save[toSave[i]] = player[toSave[i]]; }

    if(updateDb !== false){
        db.account.update({username:username},{'$set': {player:save}},function(err) { if (err) throw err; });
    } else { return save; }
}

Save.player.compress = function(player){
    player.weapon = {"id":player.weapon.id};
    for(var i in player.weaponList){ player.weaponList[i] = {"id":player.weaponList[i].id}; }
    for(var i in player.armor.piece){ player.armor.piece[i] = {"id":player.armor.piece[i].id}; }
    player.armor = {'piece':player.armor.piece};

    for(var i in player.ability){
        if(player.ability[i]){
            player.ability[i] = {"id":player.ability[i].id};
        }
    }
    for(var i in player.abilityList){ player.abilityList[i] = {"id":player.abilityList[i].id}; }

    return player;
}

Save.player.uncompress = function(player){

    player.weapon = weaponDb[player.weapon.id];
    for(var i in player.weaponList){ player.weaponList[i] = weaponDb[player.weaponList[i].id]; }

    for(var i in player.armor.piece){ player.armor.piece[i] = armorDb[player.armor.piece[i].id]; }
    player.armor.def = {'melee':1,'range':1,'magic':1,'fire':1,'cold':1,'lightning':1};
    player.armor.resist = {'burn':0,'chill':0,'confuse':0,'knock':0};
    updateArmor(player);


    for(var i in player.abilityList){
        player.abilityList[i] = uncompressAbility(player.abilityList[i].id);
    }
    for(var i in player.ability){
        if(player.ability[i]){
            swapAbility(player,+i,player.ability[i].id);
        }
    }
    return player;
}

Save.player.load = function(key,db){
    var player = defaultPlayer();   //set default player
    db = Save.player.uncompress(db);      //use info from the db

    for (var i in db) { player[i] = db[i]; }

    player.id = key;
    player.publicId = player.name;
    mList[key] = player;
    fullList[key] = player;
    nameToKey[player.name] = key;
    player = Mortal.creation.optionList(player);


    //wtf
    /*
     if(player.loginLocation){
     if(!mapList[player.loginLocation.map]){
     var old = player.loginLocation.map.slice(0,player.loginLocation.map.indexOf('~'));
     var version = player.loginLocation.map.replace(old + '~','');
     cloneMap(old,version);
     }
     Mortal.teleport(player.id,player.loginLocation.x,player.loginLocation.y,player.loginLocation.map);
     } else {
     if(!mapList[player.map]){
     var old = player.map.slice(0,player.map.indexOf('~'))
     var version = player.map.replace(old + '~','');
     cloneMap(old,version);
     }
     }
     */
    //wtf

}



Save.main = function(key,dbb){
    if(typeof key == 'string'){ var main = Save.main.compress(mainList[key]); }
    else { var main = Save.main.compress(key); }

    var username = main.name;

    var save = {};

    var toSave = ['invList','bankList','quest','tradeList','friendList','name','chatBox','pref','passive','passivePt',];
    for(var i in toSave){ save[toSave[i]] = main[toSave[i]]; }

    //save = stringify(save);

    if(dbb !== false){
        db.account.update({username:username},{'$set': {main:save}},function(err) { if (err) throw err; });
        db.account.update({username:username},{'$set': {passive:main.passive}},function(err) { if (err) throw err; }); //quick fix
    } else { return save; }
}

Save.main.compress = function(main){
    
    main.invList = main.invList.toDb();
    
    return main;
}

Save.main.uncompress = function(main,key){
    main.invList = new Inventory(key,main.invList);
    return main;
}

Save.main.load = function(key,db){
    mainList[key] = defaultMain(key);
    db = Save.main.uncompress(db,key);

    Mortal.permBoost(key,'Passive',convertPassive(db.passive));

    for(var i in db){	mainList[key][i] = db[i]; }
}














