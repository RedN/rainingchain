//List of functions that the client can use.
Command = {};
Command.list = {};

if(server){
	//Receive command from client
	//format: data:{cmd:command_Name,param:[param1,param2]} io.sockets.on('connection', function (socket) {
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
	if(user == List.all[key].name){ Chat.add(key,"You are either bored or very lonely for trying this."); return }
	
	if(List.main[key].social.list.friend[user]){	Chat.add(key,"This player is already in your Friend List."); }
	if(List.main[key].social.list.mute[user]){	Chat.add(key,"This player is in your Mute List."); }
	
	
	if(!List.main[key].social.list.mute[user] && !List.main[key].social.list.friend[user]){
		db.account.find({username:user},function(err, results) {
			if(results[0]){
				List.main[key].social.list.friend[user] = {'nick':nick,'comment':comment, 'color':color};
				Chat.add(key,"Friend added.");
			}
			if(!results[0]){Chat.add(key,"This player doesn't exist.");}
		});
	}
}

Command.list['fl,remove'] = function(key,user){
	if(List.main[key].social.list.friend[user]){
		delete List.main[key].social.list.friend[user]
		Chat.add(key, 'Friend deleted.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');
		
	}
}

Command.list['fl,comment'] = function(key,user,comment){
	if(List.main[key].social.list.friend[user]){
		List.main[key].social.list.friend[user].comment = comment;
		Chat.add(key, 'Friend Comment changed.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');
	}
}

Command.list['fl,nick'] = function(key,user,nick){
	if(List.main[key].social.list.friend[user]){
		List.main[key].social.list.friend[user].nick = nick;
		Chat.add(key, 'Friend Nick changed.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');
	}
}

Command.list['fl,color'] = function(key,user,color){
	if(List.main[key].social.list.friend[user]){
		List.main[key].social.list.friend[user].color = color;
		Chat.add(key, 'Friend Color changed.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');
	}
}

Command.list['fl,pm'] = function(key,setting){
	var possible = ['on','off','friend'];
	if(possible.indexOf(setting) != -1){
		List.main[key].social.status = setting;
		Chat.add(key, "Private Setting changed to " + setting + '.');
	} else {
		Chat.add(key, "Wrong Private Setting. Use one of the following: " + possible.toString());
	}
}

Command.list['fl,offlinepm'] = function(key,to,text){
	return;


	var from = List.all[key].name;
	
	text = customEscape(text);
	to = customEscape(to);

	if(!text || !to){ return; }
			
	if(to == from){ Chat.add(key,"Ever heard of thinking in your head?"); }
	
	db.account.find({username:to},function(err, results) {
		if(results[0]){
			var main = Save.main.uncompress(results[0].main);
			
			if(main.social.list.friend[from]){ 
				if(!main.social.message.chat){ main.social.message.chat = []; }
				main.social.message.chat.push({'type':'offlinepm','from':from,'text':text,'time':Date.now()});
				Chat.add(key,"Offline PM sent.");
				saveMain(main);
			}
			
			if(!main.social.list.friend[from]){ Chat.add(key,"You can't send an offline PM to that player.");}
		
		}
		
		if(!results[0]){Chat.add(key,"This player doesn't exist.");}
	});
	
	
	
	
}

//Mute
Command.list['mute'] = function(key,user){
	if(user == List.all[key].name){ Chat.add(key,"-.- Seriously?"); return }
	
	if(List.main[key].social.list.friend[user]){	Chat.add(key,"This player is in your Friend List."); }
	if(List.main[key].social.list.mute[user]){ Chat.add(key,"This player is alraedy in your Mute List."); }
		
	if(!List.main[key].social.list.friend[user] && !List.main[key].social.list.mute[user]){
		db.account.find({username:user},function(err, results) {
			if(results[0]){
				List.main[key].social.list.mute[user] = {};
				Chat.add(key,"Player muted.");
			}
			if(!results[0]){Chat.add(key,"This player doesn't exist.");}
		});
	}
}

//Pref. many different preference values can be changed. check Command.pref.verify for more detail.
Command.list['pref'] = function(key,name,value){
	if(List.main[key].pref[name] === undefined){ Chat.add(key, 'Invalid name.'); return; }
	
	value = Command.pref.verify(name,value);
	
	if(value == 'Invalid value.'){ Chat.add(key, 'Invalid value.'); return; }
	
	List.main[key].pref[name] = value;
	Chat.add(key, 'Preferences Changed.');
	
}




//Window
Command.list['win,close'] = function(key){
	Main.closeAllWindow(List.main[key]); 
}

Command.list['win,open'] = function(key,win,param0){
	if(List.main[key].windowList[win] === undefined){ Chat.add(key,'Wrong Input'); return; }
	if(win === 'bank'){ Chat.add(key,'Access denied.'); return;}
	if(win === 'quest' && Db.quest[param0] === undefined){ Chat.add(key,'Wrong Input'); return; }
	
	Main.openWindow(List.main[key],win,param0);
}

Command.list['win,bank,click'] = function(key,side,slot){
	var m = List.main[key];
	if(!m.windowList.bank){ Chat.add(key,'Access denied.'); return;}
	Itemlist.click.bank(m.bankList,side,+slot);
}

Command.list['win,trade,click'] = function(key,side,slot){
	var m = List.main[key];
	if(!m.windowList.trade){ Chat.add(key,'Access denied.'); return;}
	Itemlist.click.trade(m.tradeList,side,+slot);
}
Command.list['win,trade,toggle'] = function(key){
	var m = List.main[key];
	if(!m.windowList.trade || !m.windowList.trade.confirm){ Chat.add(key,'Access denied.'); return;}
	m.windowList.trade.confirm.self = !m.windowList.trade.confirm.self;
	var other = m.windowList.trade.trader;
	List.main[other].windowList.trade.confirm.other = m.windowList.trade.confirm.self;
	
	if(m.windowList.trade.confirm.self && m.windowList.trade.confirm.other){
		Itemlist.trade(m.tradeList,List.main[other].tradeList);
	}
}
Command.list['win,quest,toggleBonus'] = function(key,id,bonus){
	var mq = List.main[key].quest[id];
	if(!mq){ Chat.add(key,'Wrong Input.'); return; }	
	var q = Db.quest[id].bonus[bonus];
	if(!q){ Chat.add(key,'Wrong Input.'); return; }
	
	Quest.bonus.toggle(key,id,bonus);
}

Command.list['win,passive,select'] = function(key,i,j){
	i = Math.floor(+i); j = Math.floor(+j);
	if(!Db.passive[i] || !Db.passive[i][j]){ return; }
	
	if(typeof i !== 'number' || typeof j !== 'number'){ return; }
	
	Main.selectPassive(List.main[key],i,j);
}

Command.list['win,ability,swap'] = function(key,input,ab){
	input = +input;
	if(typeof input !== 'number' || typeof ab !== 'string'){ return; }
	if(input < 0 || !List.all[key].abilityList[ab]){ return; } 
	Mortal.swapAbility(List.all[key],input,ab);
}

Command.list['win,ability,mod'] = function(key,modid,abid){
	if(!List.all[key].abilityList[abid] || !abilityModDb[modid] || !Itemlist.have(List.main[key].invList,'mod-'+modid)){ Chat.add(key,'bad'); }
	Craft.ability.mod(key,abid,modid);
}

Command.list['win,ability,upgrade'] = function(key,abid,amount){
	amount = +amount;
	if(!amount || !List.all[key].abilityList[abid] || amount < 1){ Chat.add(key,'Wrong'); return;}
	Craft.orb(key,'upgrade',amount,abid);	
}
Command.list['win,ability,upMod'] = function(key,abid,mod,amount){
	amount = +amount;
	if(!amount || !List.all[key].abilityList[abid] || amount < 1){ Chat.add(key,'Wrong'); return;}
	Craft.orb(key,'upgrade',amount,abid,mod);	
}



//Tab
Command.list['tab,open'] = function(key,tab){
	if(Cst.tab.list.indexOf(tab) === -1){ Chat.add(key,'Wrong Input'); return; }
	List.main[key].currentTab = tab;
}

Command.list['tab,inv,click'] = function(key,side,slot){
	if(List.main[key].currentTab !== 'inventory'){ Chat.add(key,'Access denied.'); return;}
	Itemlist.click.inventory(List.main[key].invList,side,slot);
}

Command.list['tab,swapWeapon'] = function(key,type){
	if(['melee','range','magic'].indexOf(type) === -1){ Chat.add(key,'Invalid Param.'); return;}
	Mortal.swapWeapon(List.all[key],type);
}


//Clan
Command.list['cc,create'] = function(key,name){
	Clan.creation(key,name);	
}
Command.list['cc,enter'] = function(key,name){
	Clan.enter(key,name);	
}
Command.list['cc,log'] = function(key,name){
	Clan.enter(key,name);	
}
Command.list['cc,leave'] = function(key,name){
	Clan.leave(key,name);	
}



Command.list['dia,option'] = function(key,slot){
	var main = List.main[key];
	if(main.dialogue && main.dialogue.option[slot]){
		Dialogue.option(key,main.dialogue.option[slot]);
	}	
}

Command.list['option'] = function(key,slot){
	var main = List.main[key];
	if(main.optionList && main.optionList.option[slot]){
		if(!main.optionList.option[slot].nokey){
			applyFunc.key(key,main.optionList.option[slot].func,main.optionList.option[slot].param);	
		} else {
			applyFunc(main.optionList.option[slot].func,main.optionList.option[slot].param);	
		}
	
		
	}	
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
Command.pref.default = Main.template.pref = function(){
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




