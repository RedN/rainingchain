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
			
			if(!Command.client.have(cmd) && Command.list[cmd]){
				Command.list[cmd].apply(this,param);
			}
			
		});
	});
}




//{Fl
Command.list['fl,add'] = function(key,user,nick,comment,color){
	if(!nick){ nick = user;}
	if(!comment){ comment = '';}
	if(!color){ color = 'cyan'; }
	if(user == List.all[key].name){ Chat.add(key,"You are either bored or very lonely for trying this."); return }
	
	if(List.main[key].social.list.friend[user]){	Chat.add(key,"This player is already in your Friend List."); }
	if(List.main[key].social.list.mute[user]){	Chat.add(key,"This player is in your Mute List."); }
	
	
	if(!List.main[key].social.list.mute[user] && !List.main[key].social.list.friend[user]){
		db.find('account',{username:user},function(err, results) {
			if(results[0]){
				List.main[key].social.list.friend[user] = {'nick':nick,'comment':comment, 'color':color};
				Chat.add(key,"Friend added.");
			}
			if(!results[0]){Chat.add(key,"This player doesn't exist.");}
		});
	}
}
Command.list['fl,add'].doc = {
	'description':'Add a new Friend to your Friend List',
	'help':1,'param':[
		{type:'Letters',name:'Username to add',optional:0},
		{type:'Letters',name:'Set Nickname',optional:1},
		{type:'Letters',name:'Set Comment',optional:1},
		{type:'Letters',name:'Set PM Color',optional:1},
	],
}
Command.list['fl,remove'] = function(key,user){
	if(List.main[key].social.list.friend[user]){
		delete List.main[key].social.list.friend[user]
		Chat.add(key, 'Friend deleted.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');		
	}
}
Command.list['fl,remove'].doc = {
	'description':'Remove a Friend',
	'help':1,'param':[
		{type:'Letters',name:'Username to remove',optional:0},
	],
}

Command.list['fl,comment'] = function(key,user,comment){
	if(List.main[key].social.list.friend[user]){
		List.main[key].social.list.friend[user].comment = comment;
		Chat.add(key, 'Friend Comment changed.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');
	}
}
Command.list['fl,comment'].doc = {
	'description':'Set Comment of a friend',
	'help':1,'param':[
		{type:'Letters',name:'Username',optional:0},
		{type:'Letters',name:'Comment',optional:0},
	],
}

Command.list['fl,nick'] = function(key,user,nick){
	if(List.main[key].social.list.friend[user]){
		List.main[key].social.list.friend[user].nick = nick;
		Chat.add(key, 'Friend Nick changed.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');
	}
}
Command.list['fl,nick'].doc = {
	'description':'Set Nickname for a friend',
	'help':1,'param':[
		{type:'Letters',name:'Username',optional:0},
		{type:'Letters',name:'Nickname',optional:0},
	],
}

Command.list['fl,color'] = function(key,user,color){
	if(List.main[key].social.list.friend[user]){
		List.main[key].social.list.friend[user].color = color;
		Chat.add(key, 'Friend Color changed.');
	} else {
		Chat.add(key, 'This player is not in your Friend List.');
	}
}
Command.list['fl,color'].doc = {
	'description':'Set Nickname for a friend',
	'help':1,'param':[
		{type:'Letters',name:'Username',optional:0},
		{type:'Letters',name:'Color',optional:0},
	],
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
Command.list['fl,pm'].doc = {
	'description':'Change who can PM you right now.',
	'help':1,'param':[
		{type:'Letters',name:'Option (on,off or friend)',optional:0},
	],
}

Command.list['fl,offlinepm'] = function(key,to,text){
	var from = List.all[key].name;
	
	text = escape.quote(text);
	to = escape.quote(to);

	if(!text || !to || !from){ return; }	
	if(to === from){ Chat.add(key,"Ever heard of thinking in your head?"); }
	
	db.find('main',{username:to},function(err, res) { if(err) throw err;
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

Command.list['fl,offlinepm'].doc = {
	'description':"Send a PM to a player who isn't online right now.",
	'help':1,'param':[
		{type:'Letters',name:'Username',optional:0},
		{type:'Letters',name:'Message',optional:0},
	],
}

Command.list['mute'] = function(key,user){
	if(user == List.all[key].name){ Chat.add(key,"-.- Seriously?"); return }
	
	if(List.main[key].social.list.friend[user]){	Chat.add(key,"This player is in your Friend List."); }
	if(List.main[key].social.list.mute[user]){ Chat.add(key,"This player is alraedy in your Mute List."); }
		
	if(!List.main[key].social.list.friend[user] && !List.main[key].social.list.mute[user]){
		db.find('account',{username:user},function(err, results) {
			if(results[0]){
				List.main[key].social.list.mute[user] = {};
				Chat.add(key,"Player muted.");
			}
			if(!results[0]){Chat.add(key,"This player doesn't exist.");}
		});
	}
}
Command.list['mute'].doc = {
	'description':"Mute a player.",
	'help':1,'param':[
		{type:'Letters',name:'Username',optional:0},
	],
}

//}

//{Window
Command.list['win,close'] = function(key){
	Main.closeAllWindow(List.main[key]); 
}
Command.list['win,close'].doc = {
	'description':"Close the window.",
	'help':0,'param':[
		
	],
}
Command.list['win,open'] = function(key,win,param0){
	if(List.main[key].windowList[win] === undefined){ Chat.add(key,'Wrong Input'); return; }
	if(win === 'bank'){ Chat.add(key,'Access denied.'); return;}
	if(win === 'quest' && Db.quest[param0] === undefined){ Chat.add(key,'Wrong Input'); return; }
	
	Main.openWindow(List.main[key],win,param0);
}
Command.list['win,open'].doc = {
	'description':"Open a window.",
	'help':0,'param':[
		{type:'Letters',name:'Window Name',optional:0},
	],
}

Command.list['win,bank,click'] = function(key,side,slot,amount){
	var m = List.main[key];
	if(!m.windowList.bank){ Chat.add(key,'Access denied.'); return;}
	amount = +amount || 1;
	if(typeof amount !== 'number') amount = 1;
	amount = Math.round(amount.mm(1));
	Itemlist.click.bank(m.bankList,side,+slot,amount);
}
Command.list['win,bank,click'].doc = {
	'description':"Withdraw Items from Bank.",
	'help':0,'param':[
		{type:'Letters',name:'Mouse Button',optional:0},
		{type:'Number',name:'Bank Slot',optional:0},
		{type:'Number',name:'Amount to withdraw',optional:1},
	],
}

Command.list['win,trade,click'] = function(key,side,slot){
	var m = List.main[key];
	if(!m.windowList.trade){ Chat.add(key,'Access denied.'); return;}
	Itemlist.click.trade(m.tradeList,side,+slot);
}
Command.list['win,trade,click'].doc = {
	'description':"Withdraw Items from Trade.",
	'help':0,'param':[
		{type:'Letters',name:'Mouse Button',optional:0},
		{type:'Number',name:'Trade Slot',optional:0},
	],
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
Command.list['win,trade,toggle'].doc = {
	'description':"Toggle the Accept/Decline Button",
	'help':0,'param':[
	],
}

Command.list['win,quest,toggleChallenge'] = function(key,id,challenge){
	var mq = List.main[key].quest[id];
	if(!mq){ Chat.add(key,'Wrong Input.'); return; }	
	var q = Db.quest[id].challenge[challenge];
	if(!q){ Chat.add(key,'Wrong Input.'); return; }
	
	if(mq.started){
		Chat.add(key,'You have already started this quest. You can\'t change challenges anymore.');
		return;
	}
	
	Quest.challenge.toggle(key,id,challenge);
}
Command.list['win,quest,toggleChallenge'].doc = {
	'description':"Toggle a Quest Challenge. Only possible before starting the quest.",
	'help':0,'param':[
		{type:'Letters',name:'Quest Id',optional:0},
		{type:'Letters',name:'Bonus Id',optional:0},
	],
}

Command.list['win,quest,orb'] = function(key,id,amount){
	var mq = List.main[key].quest[id];
	if(!mq){ Chat.add(key,'Wrong Input.'); return; }	
	var q = Db.quest[id].bonus[bonus];
	if(!q){ Chat.add(key,'Wrong Input.'); return; }
	
	amount = Math.min(Itemlist.have(List.main[key].invList,'orb-quest',0,'amount'),amount);
	if(!amount){ Chat.add(key,'You have no orb.'); return; }
	Quest.orb(key,id,amount);
}
Command.list['win,quest,toggleChallenge'].doc = {
	'description':"Toggle a Quest Bonus.",
	'help':0,'param':[
		{type:'Letters',name:'Quest Id',optional:0},
		{type:'Letters',name:'Bonus Id',optional:0},
	],
}

Command.list['win,passive,add'] = function(key,num,i,j){
	i = Math.floor(+i); j = Math.floor(+j); num = +num;
	if(!Db.passive[i] || !Db.passive[i][j]){ return; }
	
	var pass= List.main[key].passive[num];
	if(!pass) return;
		
	Main.passiveAdd(List.main[key],num,i,j);
}
Command.list['win,passive,add'].doc = {
	'description':"Select a Passive",
	'help':0,'param':[
		{type:'Number',name:'Which Page',optional:0},
		{type:'Number',name:'Position Y',optional:0},
		{type:'Number',name:'Position X',optional:0},
	],
}
Command.list['win,passive,remove'] = function(key,num,i,j){
	i = Math.floor(+i); j = Math.floor(+j); num = +num;
	if(!Db.passive[i] || !Db.passive[i][j]){ return; }
	
	var pass= List.main[key].passive[num];
	if(!pass) return;
		
	Main.passiveRemove(List.main[key],num,i,j);
}
Command.list['win,passive,remove'].doc = {
	'description':"Remove a Passive",
	'help':0,'param':[
		{type:'Number',name:'Which Page',optional:0},
		{type:'Number',name:'Position Y',optional:0},
		{type:'Number',name:'Position X',optional:0},
	],
}

Command.list['win,passive,page'] = function(key,num){
	num = +num;
	if(!List.main[key].passive[num]) return;
	List.main[key].passiveActive = num;
	Passive.updateBoost(key);
}
Command.list['win,passive,page'].doc = {
	'description':"Change Active Passive Page",
	'help':0,'param':[
		{type:'Number',name:'Which Page',optional:0},
	],
}


Command.list['win,ability,swap'] = function(key,name,position){
//(key,input,ab){
	position = +position;
	if(typeof position !== 'number' || typeof name !== 'string'){ return; }
	if(position < 0 || !List.all[key].abilityList[name]){ return; } 
	Actor.swapAbility(List.all[key],name,position);
}
Command.list['win,ability,swap'].doc = {
	'description':"Set an Ability to a Key",
	'help':0,'param':[
		{type:'Letters',name:'Ability Id',optional:0},
		{type:'Number',name:'Key Position (0-6)',optional:0},
	],
}
Command.list['win,ability,upgrade'] = function(key,abid,amount){
	amount = +amount;
	if(!amount || !List.all[key].abilityList[abid] || amount < 1){ Chat.add(key,'Wrong'); return;}
	Craft.orb(key,'upgrade',amount,abid);
}
Command.list['win,ability,upgrade'].doc = {
	'description':"Upgrade an Ability",
	'help':0,'param':[
		{type:'Letters',name:'Ability Id',optional:0},
		{type:'Number',name:'Amount of Orbs Used',optional:0},
	],
}
Command.list['win,ability,addMod'] = function(key,mod,abid){
	if(!List.all[key].abilityList[abid] || !Db.abilityMod[mod]){ Chat.add(key,'Wrong Input.'); return; }
	if(!Itemlist.have(List.main[key].invList,Db.abilityMod[mod].item)){ Chat.add(key,'You don\'t have this mod.'); return; }

	Craft.ability.mod(key,abid,mod);
}
Command.list['win,ability,addMod'].doc = {
	'description':"Add a Mod to an Ability",
	'help':0,'param':[
		{type:'Letters',name:'Mod Id',optional:0},
		{type:'Letters',name:'Ability Id',optional:0},
	],
}
Command.list['win,ability,upMod'] = function(key,abid,mod,amount){	//cant be named upgradeMod cuz inteference with ability,upgrade
	amount = +amount;
	if(!amount || !List.all[key].abilityList[abid] || amount < 1){ Chat.add(key,'Wrong'); return;}
	Craft.orb(key,'upgrade',amount,abid,mod);	
}
Command.list['win,ability,upMod'].doc = {
	'description':"Upgrade a Mod of an Ability",
	'help':0,'param':[
		{type:'Letters',name:'Ability Id',optional:0},
		{type:'Letters',name:'Mod Id',optional:0},
		{type:'Number',name:'Amount of Orbs Used',optional:0},
	],
}
//}

//{Tab
Command.list['tab,open'] = function(key,tab){
	if(Cst.tab.list.indexOf(tab) === -1){ Chat.add(key,'Wrong Input'); return; }
	List.main[key].currentTab = tab;
}
Command.list['tab,open'].doc = {
	'description':"Open a Tab",
	'help':0,'param':[
		{type:'Letters',name:'Tab Name',optional:0},
	],
}
Command.list['tab,inv,click'] = function(key,side,slot,amount){
	if(List.main[key].currentTab !== 'inventory'){ Chat.add(key,'Access denied.'); return;}
	amount = +amount || 1;
	if(typeof amount !== 'number') amount = 1;
	amount = Math.round(amount.mm(1));
	Itemlist.click.inventory(List.main[key].invList,side,slot,amount);
}
Command.list['tab,inv,click'].doc = {
	'description':"Deposit/Use Items in Inventory.",
	'help':0,'param':[
		{type:'Letters',name:'Mouse Button',optional:0},
		{type:'Number',name:'Inventory Slot',optional:0},
		{type:'Number',name:'Amount to withdraw',optional:1},
	],
}
Command.list['tab,swapWeapon'] = function(key,type){
	if(['melee','range','magic'].indexOf(type) === -1){ Chat.add(key,'Invalid Param.'); return;}
	Actor.swapWeapon(List.all[key],type);
}
Command.list['tab,swapWeapon'].doc = {
	'description':"Change Weapon for another already Equipped",
	'help':0,'param':[
		{type:'Letters',name:'New Weapon Type',optional:0},
	],
}


Command.list['tab,removeEquip'] = function(key,type){
	if(!Cst.equip.piece.have(type)){ Chat.add(key,'Invalid Param.'); return;}
	if(!Itemlist.empty(List.main[key].invList,1)){ Chat.add(key,'No Inventory room.'); return;}
	Actor.switchEquip(List.all[key],'',type);
}
Command.list['tab,removeEquip'].doc = {
	'description':"Remove a piece of equipment",
	'help':0,'param':[
		{type:'Letters',name:'Equipement Piece',optional:0},
	],
}




//}

//{Clan
Command.list['cc,create'] = function(key,name){
	Clan.creation(key,name);	
}
Command.list['cc,create'].doc = {
	'description':"Create a new Clan",
	'help':1,'param':[
		{type:'Letters',name:'Clan Name',optional:0},
	],
}
Command.list['cc,enter'] = function(key,name){
	Clan.enter(key,name);	
}
Command.list['cc,enter'].doc = {
	'description':"Enter a Clan",
	'help':1,'param':[
		{type:'Letters',name:'Clan Name',optional:0},
	],
}

Command.list['cc,leave'] = function(key,name){
	Clan.leave(key,name);	
}
Command.list['cc,leave'].doc = {
	'description':"Leave a Clan",
	'help':1,'param':[
		{type:'Letters',name:'Clan Name (ALL will leave all clans)',optional:0},
	],
}
//}

Command.list['question'] = function(key){
	var q = List.main[key].question;
	if(!q) return;
	
	try {
		var success = applyFunc(q.func,arguments);
		if(!success && q.repeat){
			Chat.add(key,'Invalid answer to server question.');
			Chat.question(key,q);
		} else List.main[key].question = null;
	} catch(err){ }
	
	
}
Command.list['question'].doc = {
	'description':"Answer custom questions from server",
	'help':0,'param':[
	],
}


Command.list['logout'] = function(key){
	Sign.off(key,"You safely quit the game.");
}
Command.list['logout'].doc = {
	'description':"Safe way to log uut of the game",
	'help':0,'param':[
	],
}


Command.list['dia,option'] = function(key,slot){
	var main = List.main[key];
	if(main.dialogue && main.dialogue.option[slot]){
		Dialogue.option(key,main.dialogue.option[slot]);
	}	
}
Command.list['dia,option'].doc = {
	'description':"Choose a dialogue option.",
	'help':0,'param':[
		{type:'Number',name:'Dialogue Option #',optional:0},
	],
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
Command.list['option'].doc = {
	'description':"Select an option from the Right-Click Option List.",
	'help':0,'param':[
		{type:'Number',name:'Option Position',optional:0},
	],
}
Command.list['email,activate'] = function(key,str){
	var name = List.all[key].name;
	db.find('account',{username:name},{activationKey:1},function(err,res){	if(err) throw err
		if(res[0] && res[0].activationKey === str){
			db.update('account',{username:name},{ $set:{emailActivated:1}},function(err){	if(err) throw err
				Chat.add(key, 'Your account is now activated.');
			});
		} else {Chat.add(key, 'Wrong Activation Key.');}	
	});
}
Command.list['email,activate'].doc = {
	'description':"Activate your Email.",
	'help':1,'param':[
		{type:'Letters',name:'Activation Code',optional:0},
	],
}
Command.list['team,join'] = function(key,name){
	name = escape.user(name);
	List.all[key].team = name;
	Chat.add(key, 'You are now in team "' + name + '".');
}
Command.list['team,join'].doc = {
	'description':"Join a team.",
	'help':1,'param':[
		{type:'Letters',name:'Team Name (Usually Username)',optional:0},
	],
}

Command.list['team,tele'] = function(key,name){
	name = escape.user(name);
	var act = List.all[key];
	var mort2 = List.all[List.nameToKey[name]];
	if(!mort2){ Chat.add(key, 'This player is not online.'); return; }
	if(mort2.team !== act.team){ Chat.add(key, 'You are not in the same team than this player. Note: $team,join,[TEAMNAME]'); return; }
	if(!Actor.teleport.join(act,mort2)){
		Chat.add(key, 'This player is in a solo instance.')
	}
}
Command.list['team,tele'].doc = {
	'description':"Teleport to a teammate.",
	'help':1,'param':[
		{type:'Letters',name:'Player Name',optional:0},
	],
}

Actor.teleport.join

Command.list['pvp'] = function(key,slot){
	var act = List.all[key];
	if(act.map.have('pvpF4A')){
		Actor.teleport(act,act.respawnLoc.safe.x,act.respawnLoc.safe.y,act.respawnLoc.safe.map);
		Chat.add(key,"You can no longer attack or be attacked by other players.");
	}
	
	else Actor.teleport(act,250,250,'pvpF4A');
}
Command.list['pvp'].doc = {
	'description':"Teleport/Quit to PvP Zone.",
	'help':1,'param':[
		{type:'Number',name:'0:Free For All. 1:Ranked. 2:Custom',optional:1},
	],
}



//{CLIENT SIDE: Pref. many different preference values can be changed. check Command.pref.verify for more detail.
Command.client = ['pref','music,next','music,info','help','mod','doc'];

Command.list['help'] = function(lvl){
	lvl = typeof lvl === 'undefined' ? lvl : 1;
	for(var i in Command.list){
		if(!Command.list[i] || !Command.list[i].doc) continue;
		if(Command.list[i].doc.help >= lvl){
			var str = '$' + i + ' :     ' + Command.list[i].doc.description;
			Chat.add(str);
		}
	}
}
Command.list['help'].doc = {
	'description':"Show List of Commands.",
	'help':1,'param':[
		{type:'Number',name:'Show ALL Options (Not Recommended)',optional:1},
	],
}

Command.list['mod'] = function(lvl){
	readFiles.open();
}
Command.list['mod'].doc = {
	'description':"Open the Mod Window.",
	'help':1,'param':[
	
	],
}

Command.list['doc'] = function(key){
	Help.open();
}
Command.list['doc'].doc = {
	'description':"Open the Help Documentation",
	'help':1,'param':[
	],
}

Command.list['pref'] = function(name,value){
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
Command.list['pref'].doc = {
	'description':"Change a Preference.",
	'help':1,'param':[
		{type:'Letters',name:'Pref Id',optional:0},
		{type:'Number',name:'New Pref Value',optional:0},
	],
}


Command.list['music,next'] = function(){
	Song.ended();
}
Command.list['music,next'].doc = {
	'description':"Skip this song.",
	'help':1,'param':[	
	],
}
Command.list['music,info'] = function(){
	var str = 'Song name: "' + Song.beingPlayed.name + '" by ' + Song.beingPlayed.author.name;
	Chat.add(str);
}
Command.list['music,info'].doc = {
	'description':"Get info about song being played.",
	'help':1,'param':[	
	],
}

//}

//{Pref
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

//}
