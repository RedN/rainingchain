//List of functions that the client can use.
Command = {};
Command.list = {};


//Receive command from client
//format: data:{cmd:command_Name,param:[param1,param2]}
if(server){
    io.sockets.on('connection', function (socket) {
    	socket.on('Chat.send.command', function (data) {
    		var key = socket.key;
    		var cmd = data.cmd;
    		var param = data.param;
    		param.unshift(key);
    		
    		cmd = customEscape(cmd);
    		for(var i in param){ param[i] = customEscape(param[i]); }
    		
    		
    		if(Command.list[cmd]){
    			Command.list[cmd].apply(this,param);
    		}
    		
    	});
    });
}



//Fl
Command.list['fl,add'] = function(key,user,nick,comment,color){
	if(!nick){ nick = user;}
	if(!comment){ comment = '';}
	if(!color){ color = 'cyan'; }
	if(user == fullList[key].name){ Chat.add(key,"You are either bored or very lonely for trying this."); return }
	
	if(mainList[key].friendList[user]){	Chat.add(key,"This player is already in your Friend List."); }
	if(mainList[key].muteList[user]){	Chat.add(key,"This player is in your Mute List."); }
	
	
	if(!mainList[key].muteList[user] && !mainList[key].friendList[user]){
		db.account.find({username:user},function(err, results) {
			if(results[0]){
				mainList[key].friendList[user] = {'nick':nick,'comment':comment, 'color':color};
				Chat.add(key,"Friend added.");
			}
			if(!results[0]){Chat.add(key,"This player doesn't exist.");}
		});
	}
}

Command.list['fl,remove'] = function(key,user){
	if(mainList[key].friendList[user]){
		delete mainList[key].friendList[user]
		Chat.add(key, 'Friend deleted.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');
		
	}
}

Command.list['fl,comment'] = function(key,user,comment){
	if(mainList[key].friendList[user]){
		mainList[key].friendList[user].comment = comment;
		Chat.add(key, 'Friend Comment changed.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');
	}
}

Command.list['fl,nick'] = function(key,user,nick){
	if(mainList[key].friendList[user]){
		mainList[key].friendList[user].nick = nick;
		Chat.add(key, 'Friend Nick changed.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');
	}
}

Command.list['fl,color'] = function(key,user,color){
	if(mainList[key].friendList[user]){
		mainList[key].friendList[user].color = color;
		Chat.add(key, 'Friend Color changed.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');
	}
}

Command.list['fl,pm'] = function(key,setting){
	var possible = ['on','off','friend'];
	if(possible.indexOf(setting) != -1){
		mainList[key].pm = setting;
		Chat.add(key, "Private Setting changed to " + setting + '.');
	} else {
		Chat.add(key, "Wrong Private Setting. Use one of the following: " + possible.toString());
	}
}

Command.list['fl,offlinepm'] = function(key,to,text){
	var from = fullList[key].name;
	
	text = customEscape(text);
	to = customEscape(to);

	if(!text || !to){ return; }
			
	if(to == from){ Chat.add(key,"Ever heard of thinking in your head?"); }
	
	db.account.find({username:to},function(err, results) {
		if(results[0]){
			var main = uncompressMain(results[0].main);
			
			if(main.friendList[from]){ 
				if(!main.chatBox){ main.chatBox = []; }
				main.chatBox.push({'type':'offlinepm','from':from,'text':text,'time':Date.now()});
				Chat.add(key,"Offline PM sent.");
				saveMain(main);
			}
			
			if(!main.friendList[from]){ Chat.add(key,"You can't send an offline PM to that player.");}
		
		}
		
		if(!results[0]){Chat.add(key,"This player doesn't exist.");}
	});
	
	
	
	
}

//Mute
Command.list['mute'] = function(key,user){
	if(user == fullList[key].name){ Chat.add(key,"-.- Seriously?"); return }
	
	if(mainList[key].friendList[user]){	Chat.add(key,"This player is in your Friend List."); }
	if(mainList[key].muteList[user]){ Chat.add(key,"This player is alraedy in your Mute List."); }
		
	if(!mainList[key].friendList[user] && !mainList[key].muteList[user]){
		db.account.find({username:user},function(err, results) {
			if(results[0]){
				mainList[key].muteList[user] = {};
				Chat.add(key,"Player muted.");
			}
			if(!results[0]){Chat.add(key,"This player doesn't exist.");}
		});
	}
}

//Pref. many different preference values can be changed. check Command.pref.verify for more detail.
Command.list['pref'] = function(key,name,value){
	if(mainList[key].pref[name] === undefined){ Chat.add(key, 'Invalid name.'); return; }
	
	value = Command.pref.verify(name,value);
	
	if(value == 'Invalid value.'){ Chat.add(key, 'Invalid value.'); return; }
	
	mainList[key].pref[name] = value;
	Chat.add(key, 'Preferences Changed.');
	
}




//Window
Command.list['win,close'] = function(key){
	closeAllWindow(key); 
}

Command.list['win,open'] = function(key,win,param0){
	if(mainList[key].windowList[win] === undefined){ Chat.add(key,'Wrong Input'); return; }
	if(win === 'bank'){ Chat.add(key,'Access denied.'); return;}
	if(win === 'quest' && qDb[param0] === undefined){ Chat.add(key,'Wrong Input'); return; }
	
	openWindow(key,win,param0);
}

Command.list['win,bank,click'] = function(key,side,id){
	if(!mainList[key].windowList.bank){ Chat.add(key,'Access denied.'); return;}
	Bank.click(key,id,side);
}

Command.list['win,quest,toggleBonus'] = function(key,id,bonus){
	var mq = mainList[key].quest[id];
	if(!mq){ Chat.add(key,'Wrong Input.'); return; }	
	var q = qDb[id].bonus[bonus];
	if(!q){ Chat.add(key,'Wrong Input.'); return; }
	
	toggleQuestBonus(key,id,bonus);
}

Command.list['win,passive,select'] = function(key,i,j){
	i = Math.floor(+i); j = Math.floor(+j);
	if(!passiveGrid[i] || !passiveGrid[i][j]){ return; }
	
	if(typeof i !== 'number' || typeof j !== 'number'){ return; }
	
	selectPassive(key,i,j);
}

Command.list['win,ability,swap'] = function(key,input,ab){
	input = +input;
	if(typeof input !== 'number' || typeof ab !== 'string'){ return; }
	if(input < 0 || !fullList[key].abilityList[ab]){ return; } 
	swapAbility(key,input,ab);
}

Command.list['win,ability,mod'] = function(key,modid,abid){
	if(!fullList[key].abilityList[abid] || !abilityModDb[modid] || !mainList[key].invList.have('mod-'+modid)){ Chat.add(key,'bad'); }
	addAbilityMod(key,abid,modid);
}

Command.list['win,ability,upgrade'] = function(key,abid,amount){
	amount = +amount;
	if(!amount || !fullList[key].abilityList[abid] || amount < 1){ Chat.add(key,'Wrong'); return;}
	Craft.orb(key,'upgrade',amount,abid);	
}
Command.list['win,ability,upMod'] = function(key,abid,mod,amount){
	amount = +amount;
	if(!amount || !fullList[key].abilityList[abid] || amount < 1){ Chat.add(key,'Wrong'); return;}
	Craft.orb(key,'upgrade',amount,abid,mod);	
}



//Tab
Command.list['tab,open'] = function(key,tab){
	if(Cst.tab.list.indexOf(tab) === -1){ Chat.add(key,'Wrong Input'); return; }
	mainList[key].currentTab = tab;
}

Command.list['tab,inv,click'] = function(key,side,id){
	if(mainList[key].currentTab !== 'inventory'){ Chat.add(key,'Access denied.'); return;}
	mainList[key].invList.click(id,side);
}


//Clan
Command.list['cc,create'] = function(key,name){
	createClan(key,name);	
}
Command.list['cc,enter'] = function(key,name){
	enterClanChat(key,name);	
}
Command.list['cc,log'] = function(key,name){
	enterClanChat(key,name);	
}
Command.list['cc,leave'] = function(key,name){
	leaveClanChat(key,name);	
}




Command.pref = {};
Command.pref.list = {
	'mapZoom':{'default':200,'type':'number','min':1,'max':999,'round':1},
	'mapRatio':{'default':4,'type':'number','min':2,'max':10},
	'bankTransferAmount':{'default':1000,'type':'number','min':1,'max':999999999999,'round':0},
	'orbAmount':{'default':1000,'type':'number','min':1,'max':999999999999,'round':0},
	'passiveView':{'default':'normal','type':'string','option':['normal','heat']},
	'abilityDmgCent':{'default':0.10,'type':'number','min':0,'max':1,'round':3},
}
Command.pref.default = function(){
	var a = {};
	for(var i in Command.pref.list){a[i] = Command.pref.list[i].default;}
	return a;
}
Command.pref.verify = function(name,value){
	var req = Command.pref.list[name];
	
	if(req){
		if(req.type === 'number'){ 
			value = Number(value); 
			if(value.toString() == 'NaN'){ return 'Invalid value.'; }
			
			if(req.min){ value = Math.max(req.min,value); }
			if(req.max){ value = Math.min(req.max,value); }
			
			if(req.round){ value = Math.round(value); }
			
			return value;
		}
		if(req.type === 'string'){
			if(req.option.indexOf(value) !== -1){
				return value;
			}
		}
		
		if(req.type && typeof value !== req.type) return 'Invalid value.'; 
	}
	
	
	if(!req){ return value; }
}




