//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Contribution','Party','Itemlist','Clan','Sign','Chat','Main','Tk','Dialogue','Craft','Quest','requireDb'],['Command']));
if(SERVER) var db = requireDb();

//List of functions that the client can use.
var Command = exports.Command = {};
Command.list = {};

Command.receive = function(socket,d){	//server	d:{cmd,param:[]}
	d = Command.receive.verifyInput(d);
	if(!d) return;
	d.param.unshift(socket.key);	
	
	Command.list[d.cmd].apply(this,d.param);
}

Command.receive.verifyInput = function(d){
	d.cmd = escape.quote(d.cmd);
	if(Command.client.have(d.cmd) || !Command.list[d.cmd] || !Array.isArray(d.param)) return null;
	
	var p = d.param;
	var doc = Command.list[d.cmd].doc.param;
		
	for(var i = 0 ; i< p.length && i < doc.length; i++){ 
		p[i] = escape.quote(p[i]); 
		
		if(p[i] === undefined && !doc[i].optional) return null;
		
		if(p[i] !== undefined && doc[i].type === 'Number'){
			p[i] = Math.round(+p[i]).mm(doc[i].min || 0,doc[i].max);
			if(isNaN(p[i])) return null;
		}	

		if(p[i] !== undefined && doc[i].type === 'Letters'){
			if(doc[i].whiteList && !doc[i].whiteList.have(p[i])) return null;
			if(doc[i].blackList && doc[i].blackList.have(p[i])) return null;
		}
	}
	for(++i;i < doc.length; i++){
		if(!doc[i].optional) return null;
		if(doc[i].default) p[i] = doc[i].default;
	} 
	
	return d;
}

Command.send = function(text){
	var pack = Command.send.parse(text);
	if(pack) socket.emit('Command.send',pack); 
	if(pack === false) Chat.add('Invalid Command Name.');
}

Command.send.parse = function(txt){
	for(var i in Command.list){
		if(txt.indexOf(i) === 0){	//valid cmd
			var cmd = i;
			var param = txt.slice(i.length+1).split(',');
			
			if(Command.client.have(cmd)){ 
				Tk.applyFunc(Command.list[cmd],param);				
				return null;
			}
			return {'cmd':cmd,'param':param};
		}		
	}
	return false;
}

//{Fl
Command.list['fl,add'] = function(key,user,nick,comment,color){
	nick = nick || user;
	comment = comment || '';
	color = color || 'cyan';
	if(user === List.all[key].name) return Chat.add(key,"You are either bored or very lonely for trying this.");
	
	var list = List.main[key].social.list;
	if(list.friend[user]) return Chat.add(key,"This player is already in your Friend List."); 
	if(list.mute[user]) return Chat.add(key,"This player is in your Mute List.");
	
	
	db.findOne('account',{username:user},function(err, res) {
		if(res){
			List.main[key].social.list.friend[user] = {'nick':nick,'comment':comment, 'color':color};
			Chat.add(key,"Friend added.");
			List.main[key].flag['social,list,friend'] = 1;
		}
		else Chat.add(key,"This player doesn't exist.");
	});
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
		List.main[key].flag['social,list,friend'] = 1;
	} else Chat.add(key, 'This player is not in your Friend List.');
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
	} else Chat.add(key, 'This player is not in your Friend List.');
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
	} else Chat.add(key, 'This player is not in your Friend List.');
}
Command.list['fl,nick'].doc = {
	'description':'Set Nickname for a friend',
	'help':1,'param':[
		{type:'Letters',name:'Username',optional:0},
		{type:'Letters',name:'Nickname',optional:0},
	],
}


Command.list['fl,pm'] = function(key,setting){
	var possible = ['on','off','friend'];
	if(possible.have(setting)){
		List.main[key].social.status = setting;
		Chat.add(key, "Private Setting changed to " + setting + '.');
	} else {
		Chat.add(key, "Wrong Private Setting. Use one of the following: " + possible.toString() + '.');
	}
}
Command.list['fl,pm'].doc = {
	'description':'Change who can PM you right now.',
	'help':1,'param':[
		{type:'Letters',name:'Option (on,off or friend)',optional:0},
	],
}

Command.list['fl,offlinepm'] = function(key,to,text){
	Chat.receive({key:key,to:to,from:List.all[key].name,type:'offlinepm',text:text});
}

Command.list['fl,offlinepm'].doc = {
	'description':"Send a PM to a player who isn't online right now.",
	'help':1,'param':[
		{type:'Letters',name:'Username',optional:0},
		{type:'Letters',name:'Message',optional:0},
	],
}

Command.list['mute'] = function(key,user){
	if(user === List.all[key].name) return Chat.add(key,"-.- Seriously?");
	
	if(List.main[key].social.list.friend[user]) return Chat.add(key,"This player is in your Friend List.");
	if(List.main[key].social.list.mute[user]) return Chat.add(key,"This player is alraedy in your Mute List.");
		
	db.findOne('account',{username:user},function(err, res) {
		if(res){
			List.main[key].social.list.mute[user] = {};
			Chat.add(key,"Player muted.");
			List.main[key].flag['social,list,mute'] = 1;
		}
		else Chat.add(key,"This player doesn't exist.");
	});
}
Command.list['mute'].doc = {
	'description':"Mute a player.",
	'help':1,'param':[
		{type:'Letters',name:'Username',optional:0},
	],
}

Command.list['unmute'] = function(key,user){
	if(List.main[key].social.list.mute[user]){
		delete List.main[key].social.list.mute[user]
		Chat.add(key, 'Player unmuted.');
		List.main[key].flag['social,list,mute'] = 1;
	} else Chat.add(key, 'This player is not in your Mute List.');
}
Command.list['unmute'].doc = {
	'description':"Unmute a player.",
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
	if(win === 'quest' && !Db.quest[param0]) return Chat.add(key,'Wrong Input');
	if(win === 'highscore' && !Db.highscore[param0]) return Chat.add(key,'Wrong Input');
	
	Main.openWindow(List.main[key],win,param0);
}
Command.list['win,open'].doc = {
	'description':"Open a window.",
	'help':0,'param':[
		{type:'Letters',name:'Window Name',optional:0,whiteList:['highscore','passive','quest','offensive','defensive','ability','binding']},
		{type:'Letters',name:'Parameter',optional:1},
	],
}

Command.list['win,bank,click'] = function(key,side,slot,amount){
	var m = List.main[key];
	if(!m.windowList.bank){ Chat.add(key,'Access denied.'); return;}
	Itemlist.click.bank(m.bankList,side,+slot,amount);
}
Command.list['win,bank,click'].doc = {
	'description':"Withdraw Items from Bank.",
	'help':0,'param':[
		{type:'Letters',name:'Mouse Button',optional:0,whiteList:['left','right','shiftLeft','shiftRight']},
		{type:'Number',name:'Bank Slot',optional:0,max:255},
		{type:'Number',name:'Amount to withdraw',optional:1,default:1},
	],
}

Command.list['win,trade,click'] = function(key,side,slot){
	var m = List.main[key];
	if(!m.windowList.trade) return Chat.add(key,'Access denied.');
	Itemlist.click.trade(m.tradeList,side,+slot);
}
Command.list['win,trade,click'].doc = {
	'description':"Withdraw Items from Trade.",
	'help':0,'param':[
		{type:'Letters',name:'Mouse Button',optional:0,whiteList:['left','right','shiftLeft','shiftRight']},
		{type:'Number',name:'Trade Slot',optional:0,max:19},
	],
}
Command.list['win,trade,toggle'] = function(key){
	var m = List.main[key];
	if(!m.windowList.trade || !m.tradeInfo){ Chat.add(key,'Access denied.'); return;}
	m.tradeList.acceptTrade = !m.tradeList.acceptTrade;
	m.tradeList.toUpdate = 1;
	m.tradeList.toUpdateOther = 1;
	
	if(m.tradeList.acceptTrade && m.tradeInfo.acceptTrade){
		if(!List.main[m.tradeInfo.key]) return ERROR(3,'player trading with no online');
		
		if(Itemlist.trade(m.tradeList,m.tradeInfo)){
			Chat.add(key,'Trade was successful.');
			Main.closeAllWindow(List.main[m.tradeInfo.key]);
			Main.closeAllWindow(m);
		} else {
			Itemlist.trade.resetAccept(m.tradeList);
			Chat.add(key,'Either you or the other player have not enough inventory space for the trade.');
		}
	}
}
Command.list['win,trade,toggle'].doc = {
	'description':"Toggle the Accept/Decline Button",
	'help':0,'param':[
	],
}

Command.list['win,quest,toggleChallenge'] = function(key,id,challenge){
	var mq = List.main[key].quest[id];
	if(!mq) return Chat.add(key,'Wrong Input.');
	if(mq._active) return Chat.add(key,'You have already started this quest. You can\'t change challenges anymore.');
	
	var q = Db.quest[id].challenge[challenge];
	if(!q) return Chat.add(key,'Wrong Input.');
	
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
	var q = Db.quest[id]._bonus[bonus];
	if(!q){ Chat.add(key,'Wrong Input.'); return; }
	
	amount = Math.min(Itemlist.have(List.main[key].invList,'orb-quest',0,'amount'),amount);
	if(!amount){ Chat.add(key,'You have no orb.'); return; }
	Quest.orb(key,id,amount);
}
Command.list['win,quest,orb'].doc = {
	'description':"Toggle a Quest Bonus.",
	'help':0,'param':[
		{type:'Letters',name:'Quest Id',optional:0},
		{type:'Letters',name:'Bonus Id',optional:0},
		{type:'Number',name:'Amount',optional:1,default:1},
	],
}

Command.list['win,quest,start'] = function(key,id){
	var mq = List.main[key].quest[id];
	if(!mq) return Chat.add(key,'Wrong Input.');
	
	if(List.main[key].questActive) return Chat.add(key,'You can only have 1 active quest at once. Finish or abandon the quest "' + Db.quest[List.main[key].questActive].name + '" before starting a new one.');
	
	
	Quest.requirement.update(key,id);
	for(var i in mq._requirement) if(mq._requirement[i] === '0') return Chat.add(key,'You do not meet the requirements to start this quest.');
	
	
	if(!Party.testQuest(List.all[key],List.all[key].party,id)) return Chat.add(key,"You can't start this quest because someone in your party already started another quest. Leave this party or start the same quest."); 
	
	
	Quest.start(key,id);
}
Command.list['win,quest,start'].doc = {
	'description':"Start a quest.",
	'help':0,'param':[
		{type:'Letters',name:'Quest Id',optional:0},
	],
}
Command.list['win,quest,abandon'] = function(key,id){
	var mq = List.main[key].quest[id];
	if(!mq){ Chat.add(key,'Wrong Input.'); return; }	
	if(!mq._active){ Chat.add(key,"You can't abandon a quest you haven't even started yet."); return; }	
	
	Quest.abandon(key,id);
}
Command.list['win,quest,abandon'].doc = {
	'description':"Abandon a quest.",
	'help':0,'param':[
		{type:'Letters',name:'Quest Id',optional:0},
	],
}


Command.list['win,passive,add'] = function(key,num,i,j){	
	if(Quest.getQuestActive(key) !== null) 
		return Chat.add(key,'Finish the quest you\'re doing before modifying your Passive.');
	Main.passiveAdd(List.main[key],num,i,j);
}
Command.list['win,passive,add'].doc = {
	'description':"Select a Passive",
	'help':0,'param':[
		{type:'Number',name:'Which Page',optional:0,max:1},
		{type:'Number',name:'Position Y',optional:0,max:19},
		{type:'Number',name:'Position X',optional:0,max:19},
	],
}
Command.list['win,passive,remove'] = function(key,num,i,j){
	if(Quest.getQuestActive(key) !== null) 
		return Chat.add(key,'Finish the quest you\'re doing before modifying your Passive.');
	Main.passiveRemove(List.main[key],num,i,j);
}
Command.list['win,passive,remove'].doc = {
	'description':"Remove a Passive",
	'help':0,'param':[
		{type:'Number',name:'Which Page',optional:0,max:1},
		{type:'Number',name:'Position Y',optional:0,max:19},
		{type:'Number',name:'Position X',optional:0,max:19},
	],
}
Command.list['win,passive,page'] = function(key,num){
	if(Quest.getQuestActive(key) !== null) 
		return Chat.add(key,'Finish the quest you\'re doing before modifying your Passive.');
	List.main[key].passive.active = num;
	Passive.updateBoost(key);
}
Command.list['win,passive,page'].doc = {
	'description':"Change Active Passive Page",
	'help':0,'param':[
		{type:'Number',name:'Which Page',optional:0,max:1},
	],
}

Command.list['win,passive,freeze'] = function(key,num){
	if(Quest.getQuestActive(key) !== null) 
		return Chat.add(key,'Finish the quest you\'re doing before modifying your Passive.');
	List.main[key].passive.freeze[num] = Date.nowDate();
}
Command.list['win,passive,freeze'].doc = {
	'description':"Freeze a page.",
	'help':0,'param':[
		{type:'Number',name:'Which Page',optional:0,max:1},
	],
}
Command.list['win,passive,unfreeze'] = function(key,num){
	if(Quest.getQuestActive(key) !== null) 
		return Chat.add(key,'Finish the quest you\'re doing before modifying your Passive.');
	List.main[key].passive.freeze[num] = null;
}
Command.list['win,passive,unfreeze'].doc = {
	'description':"Unfreeze a page. Effect will go live on new login.",
	'help':0,'param':[
		{type:'Number',name:'Which Page',optional:0},
	],
}


Command.list['win,ability,swap'] = function(key,name,position){
	if(List.all[key].combatContext.ability !== 'normal') 
		return Chat.add(key,'You can\'t change your ability at this point of the quest.');
		
	var abl = Actor.getAbilityList(List.all[key]);
	var ab = Actor.getAbility(List.all[key]);
	
	if(!abl[name]) return;
	for(var i in ab){ 
		if(ab[i] && ab[i].id === name) ab[i] = null; 
	}	//prevent multiple
	
	Actor.ability.swap(List.all[key],name,position,true);
}
Command.list['win,ability,swap'].doc = {
	'description':"Set an Ability to a Key",
	'help':0,'param':[
		{type:'Letters',name:'Ability Id',optional:0},
		{type:'Number',name:'Key Position (0-5)',optional:0,max:5},
	],
}
//}

//{Tab
Command.list['tab,open'] = function(key,tab){
	List.main[key].currentTab = tab;
}
Command.list['tab,open'].doc = {
	'description':"Open a Tab",
	'help':0,'param':[
		{type:'Letters',name:'Tab Name',optional:0,whiteList:CST.tab},
	],
}


Command.list['tab,close'] = function(key,tab){
	List.main[key].currentTab = '';
}
Command.list['tab,close'].doc = {
	'description':"Hide Tab",
	'help':0,'param':[
		
	],
}

Command.list['tab,inv,click'] = function(key,side,slot,amount){
	if(List.main[key].currentTab !== 'inventory'){ Chat.add(key,'Access denied.'); return;}
	var res = Itemlist.click.inventory(List.main[key].invList,side,slot,amount);
	
	if(res === 'cant bank') return Chat.add(key,'You can\'t bank this item.');
	if(res === 'cant trade') return Chat.add(key,'You can\'t trade this item.');	
	
	
}
Command.list['tab,inv,click'].doc = {
	'description':"Deposit/Use Items in Inventory.",
	'help':0,'param':[
		{type:'Letters',name:'Mouse Button',optional:0,whiteList:['left','right','shiftLeft','shiftRight']},
		{type:'Number',name:'Inventory Slot',optional:0,max:19},
		{type:'Number',name:'Amount to withdraw',optional:1,default:1},
	],
}

Command.list['tab,removeEquip'] = function(key,piece){
	if(List.all[key].combatContext.equip !== 'normal') 
		return Chat.add(key,'You can\'t change your equip at this point of the quest.');
	
	if(!Itemlist.empty(List.main[key].invList,1)){ Chat.add(key,'No inventory room.'); return;}
	Actor.equip.remove(List.all[key],piece);
}
Command.list['tab,removeEquip'].doc = {
	'description':"Remove a piece of equipment",
	'help':0,'param':[
		{type:'Letters',name:'Equipement Piece',optional:0,whiteList:CST.equip.piece},
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

Command.list['question'] = function(key,param0){
	var q = List.main[key].question;
	if(!q) return;
	
	if(q.option && (q.option === true || q.option === 'boolean' || q.option.toString() === 'yes,no')){
		if(param0 === 'yes') Tk.applyFunc.key(key,q.func,q.param,List);	
		return;
	}
	try {		
		var success = Tk.applyFunc(q.func,arguments);
		if(!success && q.repeat){
			Chat.add(key,'Invalid answer to server question.');
			Chat.question(key,q);
		} else List.main[key].question = null;
	} catch(err){ ERROR.err(3,err); }
	
	
}
Command.list['question'].doc = {
	'description':"Answer custom questions from server",
	'help':0,'param':[
	],
}

Command.list['playerlist'] = function(key){	//to improve, save the list every 1 sec
	var str = 'Player Count: ' + Object.keys(List.main).length + ' | ';
	for(var i in List.main)
		str += List.all[i].name + ', ';
	str = str.slice(0,-2);
	Chat.add(key,str);
}
Command.list['playerlist'].doc = {
	'description':"Get list of player online.",
	'help':1,'param':[
	],
}

Command.list['chrono,remove'] = function(key,name){
	var main = List.main[key];
	if(main.chrono[name] && !main.chrono[name].active)
		Main.chrono(main,name,'remove');
}
Command.list['chrono,remove'].doc = {
	'description':"Remove a stopped chronometer.",
	'help':0,'param':[
		{type:'Letters',name:'Chrono Name',optional:0},
	],
}


Command.list['logout'] = function(key){
	Sign.off(key,"You safely quit the game.");
}
Command.list['logout'].doc = {
	'description':"Safe way to log out of the game",
	'help':0,'param':[
	],
}
Command.list['hometele'] = function(key){
	if(Actor.teleport.town(List.all[key],true) !== true) return;
	if(List.main[key].questActive) Quest.abandon(key,List.main[key].questActive);
	Chat.add(key,'You were teleported to first town.');
	
}
Command.list['hometele'].doc = {
	'description':"Abandon active quest and teleport to Town. Useful if stuck.",
	'help':0,'param':[
	],
}

Command.list['dialogue,option'] = function(key,slot){
	var main = List.main[key];
	if(slot === -1 && main.dialogue && main.dialogue.exit !== 0){ Dialogue.end(key); return; }
	if(main.dialogue && main.dialogue.option[slot]){
		Dialogue.option(key,main.dialogue.option[slot]);
	}	
}
Command.list['dialogue,option'].doc = {
	'description':"Choose a dialogue option.",
	'help':0,'param':[
		{type:'Number',name:'Dialogue Option #',optional:0,min:-1},
	],
}
Command.list['option'] = function(key,slot){
	var main = List.main[key];
	if(!main.optionList ||  !main.optionList.option[slot]){ return; }
	var opt = main.optionList.option[slot];
	Tk.applyFunc.key(key,opt.func,opt.param,List);	
}
Command.list['option'].doc = {
	'description':"Select an option from the Right-Click Option List.",
	'help':0,'param':[
		{type:'Number',name:'Option Position',optional:0},
	],
}
Command.list['email,activate'] = function(key,str){
	var name = List.all[key].name;
	db.find('account',{username:name},{emailActivationKey:1},function(err,res){	if(err) throw err
		if(res[0] && res[0].emailActivationKey === str){
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
Command.list['party,join'] = function(key,name){
	if(name[0] === '@' || name[0] === '!') return Chat.add(key,"You can't join this party.");	//reserved
	
	Party.join(List.all[key],name);
}
Command.list['party,join'].doc = {
	'description':"Join a party.",
	'help':1,'param':[
		{type:'Letters',name:'Party Name (Usually Username)',optional:0},
	],
}

Command.list['party,tele'] = function(key,name){
	name = escape.user(name);
	var act = List.all[key];
	var mort2 = List.all[List.nameToKey[name]];
	if(!mort2){ Chat.add(key, 'This player is not online.'); return; }
	if(mort2.party !== act.party){ Chat.add(key, 'You are not in the same party than this player. Note: $party,join,[TEAMNAME]'); return; }
	if(!Actor.teleport.join(act,mort2)){
		Chat.add(key, 'This player is in a solo instance.')
	}
}
Command.list['party,tele'].doc = {
	'description':"Teleport to a party member.",
	'help':1,'param':[
		{type:'Letters',name:'Player Name',optional:0},
	],
}

Command.list['party,leave'] = function(key){
	Chat.add(key, 'You left your party.');
	Party.join(List.all[key],'!TEMP-' + List.all[key].name);
}
Command.list['party,leave'].doc = {
	'description':"Leave your party.",
	'help':1,'param':[
		
	],
}


Command.list['pvp'] = function(key){
	return;
	var act = List.all[key];
	if(act.map.have('pvpF4A')){	//TOFIX
		Actor.teleport(act,act.respawnLoc.safe);
		Chat.add(key,"You can no longer attack or be attacked by other players.");
	}
}
Command.list['pvp'].doc = {
	'description':"Teleport/Quit to PvP Zone.",
	'help':1,'param':[
		{type:'Number',name:'0:Free For All. 1:Ranked. 2:Custom',optional:1,max:2},
	],
}


Command.list['questRating'] = function(key,quest,rating){
	if(!List.main[key].quest[quest]){
		return Chat.add(key, 'You can\'t rate this quest.');
	}
	Chat.add(key, 'Thanks for your feedback. '+
		'<span class="u" onclick="Chat.report.open(\'quest\',\'' + quest + '\');">Click here to comment the quest.</span>');
	List.main[key].quest[quest]._rating = rating;
}
Command.list['questRating'].doc = {
	'description':"Rate a quest.",
	'help':0,'param':[
		{type:'Letters',name:'Quest',optional:0},
		{type:'Number',name:'Rating',optional:0,min:1,max:5},
	],
}



Command.list['reward,purchase'] = function(key,type,param){
	Contribution.purchase(key,type,param);
}
Command.list['reward,purchase'].doc = {
	'description':"Purchase a Contribution Reward",
	'help':0,'param':[
		{type:'Letters',name:'Type',optional:0},
		{type:'Letters',name:'Param',optional:0},
	],
}

Command.list['reward,select'] = function(key,type,param){
	Contribution.select(key,type,param);
}
Command.list['reward,select'].doc = {
	'description':"Select a Contribution Reward",
	'help':0,'param':[
		{type:'Letters',name:'Type',optional:0},
		{type:'Letters',name:'Param',optional:0},
	],
}

Command.list['reward,reset'] = function(key,type){
	Contribution.reset(key,type);
}
Command.list['reward,reset'].doc = {
	'description':"Reset a Contribution Reward",
	'help':0,'param':[
		{type:'Letters',name:'Type',optional:0},
	],
}

Command.list['reward,change'] = function(key,account,name){
	Contribution.change(key,account,name);
}
Command.list['reward,change'].doc = {
	'description':"Change the social media accounts linked with your Raining Chain account.",
	'help':0,'param':[
		{type:'Letters',name:'Website',optional:0,whiteList:['reddit','youtube','twitch','twitter']},
		{type:'Letters',name:'Account Name',optional:0},
	],
}
Command.list['reward,updateSocialMedia'] = function(key,account){
	Contribution.updateSocialMedia(key,account);
}
Command.list['reward,updateSocialMedia'].doc = {
	'description':"Update Social Media Contribution Points",
	'help':0,'param':[
		{type:'Letters',name:'Website',optional:0,whiteList:['reddit','youtube','twitch','twitter']},
	],
}



//{CLIENT SIDE: Pref. many different preference values can be changed. check Command.pref.verify for more detail.
Command.client = ['pref','music,next','music,info','help','mod','doc','reward,open'];

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
Command.list['reward,open'] = function(key){
	$( "#contribution" ).dialog('open');
}

Command.list['reward,open'].doc = {
	'description':"Open Contribution Window",
	'help':0,'param':[
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
	if(value === false){ Chat.add('Invalid value.'); return; }
	
	main.pref[name] = value;
	if(Command.pref.list[name].func) Command.pref.list[name].func(value);
	Chat.add({text:'Preferences Changed.',timer:100});
	localStorage.setItem('pref',JSON.stringify(main.pref));
	
	if(name === 'mapRatio') Draw.minimap.map.updateSize();
	$(".ui-tooltip-content").parents('div').remove();
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
	var str = '<a style="color:cyan;text-decoration:underline;" target="_blank" href="' + Song.beingPlayed.link + '">\"' + Song.beingPlayed.name + '\"</a> by ' + Song.beingPlayed.author.name;
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
	'displayFPS':{name:'Display FPS',initValue:1,min:0,max:1,description:'Display FPS Performance. 0=false, 1=true' },
	'overheadHp':{name:'Overhead Hp',initValue:0,min:0,max:1,description:'Display HP Bar and Status Effect over player head.'},
	'volumeMaster':{name:'Volume Master',initValue:30,min:0,max:100,description:'Volume Master. 0:Mute','func':function(value){ Song.beingPlayed.song.volume = value/100 * main.pref.volumeSong/100; }},
	'volumeSong':{name:'Volume Song',initValue:10,min:0,max:100,description:'Volume Song.','func':function(value){ Song.beingPlayed.song.volume = value/100 * main.pref.volumeMaster/100; }},
	'volumeSfx':{name:'Volume Effects',initValue:20,min:0,max:100,description:'Volume Sound Effects.'},
	'signInNotification':{name:'Notify Log In',initValue:1,min:0,max:2,description:'Notify you if someone logs in or out of the game. 0=none, 1=text, 2=sound'},
	'puush':{name:'Allow Puush Link',initValue:2,min:0,max:2,description:'Allow Puush Link in chat. 0=never, 1=friend only, 2=always' },
	'chatTimePublic':{name:'Chat Time',initValue:120,min:15,max:999,description:'Time in seconds before chat box messages disappear.'},
	//'displayHelp':{name:'Display Help',initValue:1,min:0,max:1,description:'Display Help Image that explains the interface'},
	'displayAoE':{name:'Display AoE',initValue:0,min:0,max:1,description:'Display Damage Zone For Strikes. 0=false, 1=true' },
	'mapRatio':{name:'Map Ratio',initValue:6,min:4,max:7,description:'Minimap Size'},
	'bankTransferAmount':{name:'X- Bank',initValue:1000,min:1,max:9999999999,description:'Amount of items transfered with Shift + Left Click'},
	'orbAmount':{name:'X- Orb',initValue:1000,min:1,max:9999999999,description:'Amount of orbs used with X- option'},
	'controller':{name:'Enable Controller',initValue:0,min:0,max:1,description:'Play the game with a Xbox 360 Controller.'},
	//'passiveView':{name:'Passive View',initValue:1,min:0,max:1,description:'Impact Passive Colors. 0:Access. 1:Popularity'},
}

Command.pref.verify = function(name,value){
	var req = Command.pref.list[name];

	value = +value; 
	if(isNaN(value)) return false;
	
	return value.mm(req.min,req.max);	
}
Command.pref.template = function(){
	var a = {};
	for(var i in Command.pref.list){a[i] = Command.pref.list[i].initValue;}
	return a;
}

//}


