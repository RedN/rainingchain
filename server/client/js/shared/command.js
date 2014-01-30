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
			
			cmd = escape.quote(cmd);
			for(var i in param){ param[i] = escape.quote(param[i]); }
			
			
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
	var from = List.all[key].name;
	
	text = escape.quote(text);
	to = escape.quote(to);

	if(!text || !to || !from){ return; }	
	if(to === from){ Chat.add(key,"Ever heard of thinking in your head?"); }
	
	db.main.find({username:to},function(err, res) { if(err) throw err;
		if(res[0]){
			var main = Load.main.uncompress(res[0]);
			
			if(main.social.list.friend[from]){ 
				if(!main.social.message.chat){ main.social.message.chat = []; }
				main.social.message.chat.push({'type':'offlinepm','from':from,'text':text,'time':Date.now()});
				Chat.add(key,"Offline PM sent.");
				Save.main(main);
			}
			
			if(!main.social.list.friend[from]){ Chat.add(key,"You can't send an offline PM to that player.");}
		
		}
		
		if(!res[0]){Chat.add(key,"This player doesn't exist.");}
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

Command.list['win,bank,click'] = function(key,side,slot,amount){
	var m = List.main[key];
	if(!m.windowList.bank){ Chat.add(key,'Access denied.'); return;}
	amount = +amount || 1;
	if(typeof amount !== 'number') amount = 1;
	amount = Math.round(amount.mm(1));
	Itemlist.click.bank(m.bankList,side,+slot,amount);
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
	Actor.swapAbility(List.all[key],input,ab);
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

Command.list['tab,inv,click'] = function(key,side,slot,amount){
	if(List.main[key].currentTab !== 'inventory'){ Chat.add(key,'Access denied.'); return;}
	amount = +amount || 1;
	if(typeof amount !== 'number') amount = 1;
	amount = Math.round(amount.mm(1));
	Itemlist.click.inventory(List.main[key].invList,side,slot,amount);
}

Command.list['tab,swapWeapon'] = function(key,type){
	if(['melee','range','magic'].indexOf(type) === -1){ Chat.add(key,'Invalid Param.'); return;}
	Actor.swapWeapon(List.all[key],type);
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

Command.list['email,activate'] = function(key,str){
	var name = List.all[key].name;
	db.account.find({username:name},{activationKey:1},function(err,res){	if(err) throw err
		if(res[0] && res[0].activationKey === str){
			db.account.update({username:name},{ $set:{emailActivated:1}},function(err){	if(err) throw err
				Chat.add(key, 'Your account is now activated.');
			});
		} else {Chat.add(key, 'Wrong Activation Key.');}	
	});
}



Command.list['team,join'] = function(key,name){
	name = escape.user(name);
	List.all[key].team = name;
	Chat.add(key, 'You are now in team "' + name + '".');
}


Command.list['salvage,material'] = function(key,name,amount){
	amount = Math.round(+amount);
	if(Db.craft[name] || !amount) return;
	Craft.salvage.material(key,name,amount);
}



//CLIENT SIDE: Pref. many different preference values can be changed. check Command.pref.verify for more detail.
Command.list['pref'] = function(name,value){
	if(server) return;
	
	if(name === 'reset'){
		main.pref = Main.template.pref();
		Chat.add('Preferences Reset to Default.');
		return;
	}
	
	if(main.pref[name] === undefined){ Chat.add('Invalid name.'); return; }
	value = Command.pref.verify(name,value);
	if(value === 'Invalid value.'){ Chat.add('Invalid value.'); return; }
	
	main.pref[name] = value;
	if(Command.pref.list[name].func) Command.pref.list[name].func(value);
	Chat.add('Preferences Changed.');
	localStorage.setItem('pref',JSON.stringify(main.pref))
}

Command.list['binding'] = function(type,position,value){
	if(server) return;
	
	value = Math.round(+value);
	position = Math.round(+position);
	if((type !== 'move' && type !== 'ability') || position + '' === 'NaN' || value + '' === 'NaN'){
		Chat.add('Wrong');
		return;
	}
	Input.key[type][position][0] = value;
	
	Chat.add('Bindings Changed.');
	Input.save();
}


Command.list['music,next'] = function(type,position,value){
	if(server) return;
	Song.ended();
}
Command.list['music,info'] = function(){
	if(server) return;
	var str = 'Song name: "' + Song.beingPlayed.name + '" by ' + Song.beingPlayed.author.name;
	Chat.add(str);
}

Command.client = ['pref','binding','music,next','music,info'];


Command.pref = {};
Command.pref.list = {
	'volumeSong':{name:'Volume Song',initValue:20,min:0,max:100,description:'Volume Song.','func':function(value){ Song.beingPlayed.volume = value/100 * main.pref.volumeMaster/100; }},
	'volumeSfx':{name:'Volume Effects',initValue:100,min:0,max:100,description:'Volume Sound Effects.'},
	'volumeMaster':{name:'Volume Master',initValue:100,min:0,max:100,description:'Volume Master. 0:Mute','func':function(value){ Song.beingPlayed.volume = value/100 * main.pref.volumeSong/100; }},
	'mapZoom':{name:'Map Zoom',initValue:200,min:1,max:999,description:'Minimap Zoom'},
	'mapRatio':{name:'Map Ratio',initValue:5,min:2,max:10,description:'Minimap Size'},
	'bankTransferAmount':{name:'X- Bank',initValue:1000,min:1,max:9999999999,description:'Amount of items transfered with Shift + Left Click'},
	'orbAmount':{name:'X- Orb',initValue:1000,min:1,max:9999999999,description:'Amount of orbs used with X- option'},
	'passiveView':{name:'Passive View',initValue:0,min:0,max:1,description:'Impact Passive Colors. 0:Access. 1:Popularity'},
	'abilityDmgStatusTrigger':{name:'%Dmg Ability',initValue:10,min:0,max:100,description:'%Life Dealt per attack. Used to calculate chance to proc status.'}, //% life of monster per attack (used to calc % chance to trigger status)
	'mapIconAlpha':{name:'Icon Alpha',initValue:100,min:0,max:100,description:'Minimap Icon Transparence.'},
	
}
Command.pref.verify = function(name,value){
	var req = Command.pref.list[name];

	if(!req.type || req.type === 'number'){ 
		value = Number(value); 
		if(value.toString() === 'NaN'){ return 'Invalid value.'; }
		
		value = value.mm(req.min,req.max);			
		value = round(value,req.round || 0);
		
		return value;
	}
	if(req.type === 'string'){
		if(req.option.have(value)){
			return value;
		} else {
			return 'Invalid value.';
		}
	}
	
	if(req.type && typeof value !== req.type) return 'Invalid value.'; 
	
}

Main.template.pref = function(){
	var a = {};
	for(var i in Command.pref.list){a[i] = Command.pref.list[i].initValue;}
	return a;
}


