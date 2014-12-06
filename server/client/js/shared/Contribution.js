//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Message','Account','Main','Sprite'],['Contribution']));

if(SERVER) eval('var Contribution');
(function(){ //}
Contribution = exports.Contribution = {};

var chat = function(key,text){
	Message.add(key,Message('contribution',text));
}

Contribution.template = function(){
	return {
		reward:{
			broadcastAchievement:0,
			globalMessage:{
				active:0,
				message:'',	
				status:'',
			},
			symbol:{
				bronze:0,
				silver:0,
				gold:0,
				diamond:0,		
			},
			chatText:{
				yellow:0,
				pink:0,
				crimson:0,
				cyan:0,
				orange:0,
				green:0,
				rainbow:0,
			},
			bullet:{
				fireball:{name:'bullet-pony',status:0},	//
				arrow:{name:'bullet-cannon',status:0},	//
				iceshard:{name:'bullet-penguin',status:0},	//
				lightningball:{name:'bullet-happyface',status:0},	//
			},
			history:[],
			player:{
				name:'',
				date:-1,
			}
		},
		point:{
			sum:50,
			usable:50,
			used:0,
			quest:{
				point:0,
				list:[],
				history:[],
			},
			map:{
				point:0,
				list:[],
				history:[],
			},
			art:{
				point:0,
				list:[],
				history:[],
			},
			other:{
				point:0,
				list:[],
				history:[],
			},
			twitch:{
				username:'',
				lastUpdate:-1,
				point:0,
				totalViewer:0,
				list:[],
				history:[],
			},
			youtube:{
				username:'',
				point:0,
				lastUpdate:-1,
				totalView:0,
				history:[],
			},
			reddit:{
				username:'',
				point:0,
				lastUpdate:-1,
				totalPost:0,
				history:[],
			},
			twitter:{
				username:'',
				point:0,
				lastUpdate:-1,
				totalTweet:0,
				follower:0,
				history:[],
			},
		},
	};	
}


Contribution.onSignIn = function(key){
	if(Main.get(key).contribution.reward.player.name){	
		Actor.get(key).sprite.normal = Main.get(key).contribution.reward.player.name;
		Actor.changeSprite(Actor.get(key),{name:'normal'});
	}
	
	if(Contribution.globalMessage.active.text && Date.now() < Contribution.globalMessage.active.end){
		var a = Contribution.globalMessage.active;
		Message.add(key,'<span style="color:#EEEEEE; font-weight:bold;">Message from contributor ' + a.username.q() + ': <br> &nbsp;&nbsp;&nbsp;' + a.text + '</span>');
	}
}

Contribution.globalMessage = {
	request:[],
	active:{username:'rc',text:'',startTime:0,endTime:0},
};
/*
Contribution.globalMessage.approve = function(num){	//no clue if work
	var a = Contribution.globalMessage.request[num];
	Contribution.globalMessage.request.splice(num,1);
	Contribution.globalMessage.active = {
		username:a.username,
		text:a.text,
		startTime:Date.now(),
		endTime:Date.now() + a.duration,
	}
	var cost = Contribution.cost.globalMessage;
	var key = Account.getKeyViaUsername(a.username);
	if(key){
		var main = Main.get(key);
		chat(key,'Your global message has been approved');
		main.contribution.reward.globalMessage.status = 'Approved';
		main.contribution.point.usable -= cost;
		main.contribution.point.used += cost;
		main.contribution.reward.history.push({date:Date.now(),type:'globalMessage',cost:cost,text:a.text,duration:a.duration});
		
	}
	db.main.findOne({username:a.username},{},function(err,res){
		if(err) throw err; if(!res) return;
		res.contribution.reward.point.usable = cost;
		res.contribution.reward.point.used = cost;
		res.contribution.reward.globalMessage.status = 'Approved';
		res.contribution.reward.history.push({date:Date.now(),type:'globalMessage',cost:cost,text:a.text,duration:a.duration});
		db.main.update({username:a.username},res,db.err);
	}
}

Contribution.globalMessage.refuse = function(num,text){
	var a = Contribution.globalMessage.request[num];
	Contribution.globalMessage.request.splice(num,1);
	
	var key = Account.getKeyViaUsername(a.username);
	if(key){
		chat(key,'Your global message has been refused.' + text);
		Main.get(key).contribution.reward.globalMessage.status = 'Refused' + text;4
	}
	db.main.findOne({username:a.username},{},function(err,res){
		if(err) throw err; if(!res) return;
		res.contribution.reward.globalMessage.status = 'Refused' + text;
		db.main.update({username:a.username},res,db.err);
	}
}
*/

Contribution.cost = {
	chatText:{
		yellow:0,
		orange:10,	
		green:20,	
		pink:50,
		cyan:80,
		crimson:100,
		rainbow:500,
	},
	symbol:{
		bronze:10,
		silver:100,
		gold:1000,
		diamond:10000,	
	},
	globalMessage:100,	
	broadcastAchievement:{
		'1':2,
		'10':10,
		'100':50,	
	},
	bullet:{
		lightningball:100,
		iceshard:150,
		arrow:200,
		fireball:250,
	},
	player:50,
};

Contribution.purchase = function(key,type,param){
	var main = Main.get(key);
	var c = main.contribution;
	if(typeof Contribution.cost[type] === 'undefined' || (type !== 'globalMessage' && type !== 'player' && typeof Contribution.cost[type][param] === 'undefined')) 
		return chat(key,'Invalid.');
	if(type === 'chatText'){
		var cost = Contribution.cost[type][param];
		if(c.point.usable < cost) return chat(key,'You need ' + cost + ' CP to get this reward.');
		c.point.usable -= cost;
		c.point.used += cost;
		c.reward.history.push({date:Date.now(),type:type,cost:cost,param:param});
	
		c.reward[type][param] = 1;
		Contribution.select(key,type,param);
		chat(key,'Transaction successfully completed.');
	}
	
	if(type === 'player'){
		var cost = Contribution.cost[type];
		if(c.point.usable < cost) return chat(key,'You need ' + cost + ' CP to get this reward.');
		
		param = param.replaceAll(';',',');	//cuz if send with , Command thinks its separated params...
		var list = param.split(',');
		for(var i = list.length-1 ; i >= 0; i--) if(list[i] === '' || list[i] === 'NONE') list.splice(i,1);
		param = list.toString();
		if(list.length > 8) return chat(key,'Too many layers.');
		if(list.length === 0) return chat(key,'You need at least one layer.');
		//for(var i in list) if(!D b.sprite[list[i]] || !D b.sprite[list[i]].player) return chat(key,'Invalid sprite: ' + list[i] + '.');
		
		c.point.usable -= cost;
		c.point.used += cost;
		c.reward.history.push({date:Date.now(),type:type,cost:cost,param:param});
		c.reward.player = {name:param,date:Date.now()};
		Actor.get(key).sprite.normal = param;
		Actor.changeSprite(Actor.get(key),{name:'normal'});
		chat(key,'Transaction successfully completed.');
	}
	
	if(type === 'bullet'){
		var cost = Contribution.cost[type][param];
		if(c.point.usable < cost) return chat(key,'You need ' + cost + ' CP to get this reward.');
		c.point.usable -= cost;
		c.point.used += cost;
		c.reward.history.push({date:Date.now(),type:type,cost:cost,param:param});
	
		c.reward[type][param].status = 1;
		Contribution.select(key,type,param);
		chat(key,'Transaction successfully completed.');
	}
	
	if(type === 'globalMessage'){
		var cost = Contribution.cost[type];
		if(param.length > 69) return chat(key,'Message is too long.');
		if(c.point.usable < cost) return chat(key,'You need ' + cost + ' CP to get this reward.');
		c.reward.history.push({date:Date.now(),type:type,cost:0,costIfApproved:cost,param:param});
		
		Contribution.globalMessage.request.push({date:Date.now(),username:main.username,text:param,duration:CST.DAY});
		c.reward.globalMessage.status = 'Waiting for admin approval.';
		chat(key,'Transaction successfully completed.');
	}
	
	if(type === 'broadcastAchievement'){
		var cost = Contribution.cost[type][param];
		if(c.point.usable < cost) return chat(key,'You need ' + cost + ' CP to get this reward.');
		c.point.usable -= cost;
		c.point.used += cost;
		c.reward.history.push({date:Date.now(),type:type,cost:cost,param:param});
	
		c.reward[type] += +param;
		chat(key,'Transaction successfully completed.');
	}
	Contribution.updatePt(main);
	Main.setFlag(main,'contribution');
	
}

Contribution.select = function(key,type,param){
	var main = Main.get(key);
	var c = main.contribution;
	
	Main.setFlag(main,'contribution');
	if(type === 'chatText'){
		if(c.reward[type][param] !== 1) return chat(key,'You can\'t active this.');
		
		for(var i in c.reward[type]) if(c.reward[type][i] === 2) c.reward[type][i] = 1;	//desactive others
		c.reward[type][param] = 2;
		main.social.customChat = Contribution.generateCustomChat(key);
		return chat(key,'Chat Text Color is now: ' + param.q() + '.');
	}
	if(type === 'bullet'){
		if(!c.reward[type][param] || c.reward[type][param].status !== 1) return chat(key,'You can\'t active this.');
		c.reward[type][param].status = 2;
		return chat(key,'You have changed the appearance of ' + param.q() + ' bullets.');
	}
	if(type === 'symbol'){
		var cost = Contribution.cost[type][param];
		if(typeof cost === 'undefined' || c.point.sum < cost) return chat(key,'You don\'t have enough CP for this.');
		for(var i in c.reward[type]) if(c.reward[type][i] === 2) c.reward[type][i] = 1;	//desactive others
		c.reward[type][param] = 2;
		main.social.customChat = Contribution.generateCustomChat(key);
		return chat(key,'Name Symbol is now: ' + param.q() + '.');
	}
	
}

Contribution.reset = function(key,type){
	var main = Main.get(key);
	var c = main.contribution;
	Main.setFlag(main,'contribution');
	if(type === 'bullet'){
		for(var i in c.reward[type]) 
			if(c.reward[type][i].status === 2) c.reward[type][i].status = 1;	//desactive others	
	}
	if(type === 'symbol'){
		for(var i in c.reward[type]) 
			if(c.reward[type][i] === 2) c.reward[type][i] = 1;	//desactive others
		main.social.customChat = Contribution.generateCustomChat(key);
	}
	if(type === 'player'){
		Actor.get(key).sprite.normal = Actor.DEFAULT_SPRITENAME;
		c.reward.player = {name:Actor.DEFAULT_SPRITENAME,date:Date.now()};
		Actor.changeSprite(Actor.get(key),{name:'normal'});
	}	
}

Contribution.change = function(key,account,name){
	var main = Main.get(key);
	var p = main.contribution.point;
	if(!p[account]) return;
	p[account].username = name;
	Main.setFlag(main,'contribution');
	chat(key,"You have successfully linked your Raining Chain account with the " + account.capitalize() + " account " + name.q() + '.');
}

Contribution.updateSocialMedia = function(key,account){
	var p = Main.get(key).contribution.point;
	var now = Date.now();
	if(account === 'youtube'){
		if(!p.youtube.username) return chat(key,'Link your Raining Chain account with your Youtube account first by typing your Youtube name and pressing the button "Change Name"');
		var diff = CST.DAY/4 - (now - p.youtube.lastUpdate);
		if(diff > 0) return chat(key,'You will be able to update your Youtube CP in ' + (diff/CST.HOUR).r(2) + ' hour(s).');
		p.youtube.lastUpdate = now;
		Main.setFlag(Main.get(key),'contribution');
		Contribution.updateSocialMedia.youtube(key,p.youtube);
	}
	if(account === 'reddit'){
		if(!p.youtube.username) return chat(key,'Link your Raining Chain account with your Youtube account first by typing your Youtube name and pressing the button "Change Name"');
		var diff = CST.DAY/4 - (now - p.reddit.lastUpdate);
		if(diff > 0) return chat(key,'You will be able to update your Reddit CP in ' + (diff/CST.HOUR).r(2) + ' hour(s).');
		p.reddit.lastUpdate = now;
		Main.setFlag(Main.get(key),'contribution');
		Contribution.updateSocialMedia.reddit(key,p.reddit);
	}
	if(account === 'twitch'){
		if(!p.twitch.username) return chat(key,'Link your Raining Chain account with your Twitch account first by typing your Twitch name and pressing the button "Change Name"');
		var diff = CST.HOUR - (now - p.twitch.lastUpdate);
		if(diff > 0) return chat(key,'You will be able to update your Twitch again in ' + (diff/CST.MIN).r(2) + ' minute(s).');
		p.twitch.lastUpdate = now;
		Main.setFlag(Main.get(key),'contribution');
		Contribution.updateSocialMedia.twitch(key,p.twitch);
	}
	if(account === 'twitter'){
		if(!p.twitter.username) return chat(key,'Link your Raining Chain account with your Twitter account first by typing your Twitter name and pressing the button "Change Name"');
		var diff = CST.DAY - (now - p.twitter.lastUpdate);
		if(diff > 0) return chat(key,'You will be able to update your Twitter again in ' + (diff/CST.MIN).r(2) + ' hour(s).');
		p.twitter.lastUpdate = now;
		Main.setFlag(Main.get(key),'contribution');
		Contribution.updateSocialMedia.twitter(key,p.twitter);
	}
	return chat(key,'Invalid');
	
	
}

Contribution.updateSocialMedia.youtube = function(key,info,cb){
	db.youtube.getListFromUser(info.username,function(list){
		if(list.length !== 0) info.history = list;
		db.youtube.getSumViewViaList(list,function(count){
			info.point = Math.round(count/10);	
			if(cb) cb(key);			
		});	
	});
}

Contribution.updateSocialMedia.reddit = function(key,info,cb){
	//ts("m.contribution.point.reddit.lastUpdate = -1")
	db.reddit.getListFromUser(info.username,function(list){
		for(var i in list){
			var bool = true;
			for(var j in info.history) if(info.history[j].id === list.id) bool = false;
			if(bool) info.history.push(list[i]);
		}
		
		db.reddit.getUpsSumViaList(info.history,function(count){
			info.point = Math.round(count/1);	
			if(cb) cb(key);			
		});	
	});
}


Contribution.updateSocialMedia.twitch = function(key,info,cb){
	db.twitch.getViewerFromUser(info.username,function(count){
		info.history.push({date:Date.now(),viewers:count});
		info.point += Math.round(count/1);	
		if(cb) cb(key);			
	});
}


Contribution.updateSocialMedia.twitter = function(key,info,cb){
	db.twitter.getListFromUser(info.username,function(list){
		for(var i in list){
			var bool = true;
			for(var j in info.history) if(info.history[j].id === list.id) bool = false;
			if(bool) info.history.push(list[i]);
		}
		info.point += info.history.length;	
		if(cb) cb(key);			
	});
}


Contribution.click = function(btn){
	var earn = btn === 'earning';
	$("#contributionBtnEarning")[0].style.textDecoration = earn ? 'underline' : 'none';
	$("#contributionBtnSpending")[0].style.textDecoration = earn ? 'none' : 'underline';
	
	$("#contributionEarning")[0].style.display = earn ? 'block' : 'none';
	$("#contributionSpending")[0].style.display = earn ? 'none' : 'block';
}

Contribution.generateCustomChat = function(key){
	var main = Main.get(key);
	var symbol = 0;
	var color = 0;
	//if(Server.isAdmin(key)) return '100';
	
	for(var i in main.contribution.reward.symbol){
		if(main.contribution.reward.symbol[i] === 2){
			symbol = Contribution.generateCustomChat.LIST[0].indexOf(i);
		}
	}
	for(var i in main.contribution.reward.chatText){
		if(main.contribution.reward.chatText[i] === 2){
			color = Contribution.generateCustomChat.LIST[1].indexOf(i);
		}
	}
	
	return Main.Social.customChat(symbol,color);;
}

Contribution.generateCustomChat.LIST = [
	['normal','admin','bronze','silver','gold','diamond'],
	['yellow','pink','crimson','cyan','orange','green','rainbow']
];

Contribution.player = {};
Contribution.player.update = function(){
	var str = $("#contributionPlayerSel0")[0].value + ';' + 
		$("#contributionPlayerSel1")[0].value + ';' + 
		$("#contributionPlayerSel2")[0].value;// + ';' + 
		/*$("#contributionPlayerSel3")[0].value + ';' + 
		$("#contributionPlayerSel4")[0].value + ';' + 
		$("#contributionPlayerSel5")[0].value + ';' + 
		$("#contributionPlayerSel6")[0].value;*/
		
	$("#contributionPlayerInput")[0].value = str;
	Contribution.player.input();
}
Contribution.player.input = function(){
	return;
	/*
	var str = $("#contributionPlayerInput")[0].value;
	var list = str.split(';');
	//on screen, 60x80
	//image: 24x32
	
	//facing
	var ctx = $("#contributionPlayerCanvasFront")[0].getContext('2d');
	ctx.clearRect(0,0,60,80);
	for(var i in list){	
		var sp = D b.sprite[list[i]];
		if(!sp) continue;
		ctx.drawImage(sp.img,0,32*2,24,32,0,0,60,80);
	}
	//Right
	var ctx = $("#contributionPlayerCanvasRight")[0].getContext('2d');
	ctx.clearRect(0,0,60,80);
	for(var i in list){
		var sp = D b.sprite[list[i]];
		if(!sp) continue;
		ctx.drawImage(sp.img,0,32*3,24,32,0,0,60,80);
	}
	//back
	var ctx = $("#contributionPlayerCanvasBack")[0].getContext('2d');
	ctx.clearRect(0,0,60,80);
	for(var i in list){
		var sp = D b.sprite[list[i]];
		if(!sp) continue;
		ctx.drawImage(sp.img,0,32*0,24,32,0,0,60,80);
	}
	*/
}	

//client
if(!SERVER){ //}

Contribution.init = function(first){	//client, set HTML
	Contribution.init.spend(first);
	Contribution.init.earn(first);
}

Contribution.init.earn = function(first){
	//ts("m.contribution.point.usable = 10000")
	var p = main.contribution.point;
	
	$("#contributionPtUsable")[0].innerHTML = p.usable;
	$("#contributionPtSum")[0].innerHTML = p.sum;

	$("#contributionQuestPt")[0].innerHTML = p.quest.point;
	$("#contributionTwitterPt")[0].innerHTML = p.twitter.point;
	$("#contributionTwitchPt")[0].innerHTML = p.twitch.point;
	$("#contributionRedditPt")[0].innerHTML = p.reddit.point;
	$("#contributionYoutubePt")[0].innerHTML = p.youtube.point;
	
	$("#contributionQuestHistory")[0].innerHTML = Contribution.init.earn.history(p.quest);	//array
	$("#contributionTwitterHistory")[0].innerHTML = Contribution.init.earn.history(p.twitter);	
	$("#contributionTwitchHistory")[0].innerHTML = Contribution.init.earn.history(p.twitch);
	$("#contributionRedditHistory")[0].innerHTML = Contribution.init.earn.history(p.reddit);
	$("#contributionYoutubeHistory")[0].innerHTML = Contribution.init.earn.history(p.youtube);
	
	
	$("#contributionTwitterUsername")[0].value = p.twitter.username;
	if(p.twitter.username) $("#contributionTwitterUsername")[0].style.color = 'green';	
	$("#contributionTwitchUsername")[0].value = p.twitch.username;
	if(p.twitch.username) $("#contributionTwitchUsername")[0].style.color = 'green';	
	$("#contributionRedditUsername")[0].value = p.reddit.username;
	if(p.reddit.username) $("#contributionRedditUsername")[0].style.color = 'green';	
	$("#contributionYoutubeUsername")[0].value = p.youtube.username;
	if(p.youtube.username) $("#contributionYoutubeUsername")[0].style.color = 'green';	
	
	
	
	

}

Contribution.init.earn.history = function(info){
	var str = 'Last Update: ' + (info.lastUpdate < 1 ? 'Never' : (new Date(info.lastUpdate).toLocaleString())) + '<br>';
	for(var i in info.history)
		str += Tk.stringify(info.history[i]) + '<br>';
	if(info.history.length === 0) str += 'None';
	return str;
}

Contribution.init.spend = function(first){
	var r = main.contribution.reward;
	
	$("#contributionPtUsable")[0].innerHTML = main.contribution.point.usable;	
	$("#contributionPtSum")[0].innerHTML = main.contribution.point.sum;	
	
	//Symbol
	var list = Contribution.generateCustomChat.LIST[0];
	for(var i = 2; i < list.length; i++){
		if(main.contribution.point.sum < Contribution.cost.symbol[list[i]]){
			$("#contributionSymbol-" + list[i]).prop('disabled', true);
			continue;
		}	
		var c = $("#contributionSymbol-" + list[i])[0];
		if(r.symbol[list[i]] === 2){
			c.innerHTML = 'Active';
			c.style.backgroundColor = '#55FF55';
		} else {
			c.innerHTML = 'Select';
			c.style.backgroundColor = 'yellow';		
		} 		
	}
	
	//Chat
	var list = Contribution.generateCustomChat.LIST[1];
	for(var i in list){
		if(r.chatText[list[i]] === 1){
			var c = $("#contributionChatText-" + list[i])[0];
			c.innerHTML = 'Select';
			c.style.backgroundColor = 'yellow';
			c.onclick = function(num){
				return function(){ Contribution.select('chatText',num); }
			}(list[i]);
		}
		if(r.chatText[list[i]] === 2){
			var c = $("#contributionChatText-" + list[i])[0];
			c.innerHTML = 'Active';
			c.style.backgroundColor = '#55FF55';
			c.onclick = CST.func;
		}
	}
	//Bullet
	var list = ['lightningball','fireball','arrow','iceshard'];
	for(var i in list){
		if(r.bullet[list[i]].status === 1){	//doesnt happen cuz cant desactivate
			var c = $("#contributionBullet-" + list[i])[0];
			c.innerHTML = 'Select';
			c.style.backgroundColor = 'yellow';
			c.onclick = function(num){
				return function(){ Contribution.select('bullet',num); }
			}(list[i]);
		}
		if(r.bullet[list[i]].status === 2){
			var c = $("#contributionBullet-" + list[i])[0];
			c.innerHTML = 'Active';
			c.style.backgroundColor = '#55FF55';
			c.onclick = CST.func;
		}
	}
	
	
	//broadcast
	$("#contributionBroadcastSpan")[0].innerHTML = r.broadcastAchievement;
	
	//global
	/*
	$("#contributionGlobalStatus")[0].innerHTML = r.globalMessage.status;	
	*/
	//symbol
	/*
	var list = {bronze:100, silver:1000, gold:10000, diamond:100000 };
	
	for(var i in list){
		if(main.contribution.point.sum < list[i]){  }
		
		if(main.contribution.reward.symbol[i] === 2){
			$("#contributionSymbol-" + i)[0].innerHTML = 'Active';
			$("#contributionSymbol-" + i)[0].style.backgroundColor = '#55FF55';
		} else {
			$("#contributionSymbol-" + i)[0].innerHTML = 'Select';
			$("#contributionSymbol-" + i)[0].style.backgroundColor = 'yellow';
		}
	}
	*/
	
	//Player look
	/*
	if(first){
		var str = {};
		//Ini t.db.sprite.player
		for(var i in {}){	//TOFIX	
			str[i] = '<option value="NONE">None</option>';
			for(var j in Ini t.db.sprite.player[i]){
				var s = Ini t.db.sprite.player[i][j];
				str[i] += '<option value="' + s + '">' + s + '</option>'
			}
		}
		str.any = '';
		for(var i in str) if(i !== 'any') str.any += str[i];
			
		$("#contributionPlayerSel0")[0].innerHTML = str.skin;
		$("#contributionPlayerSel1")[0].innerHTML = str.body;
		$("#contributionPlayerSel2")[0].innerHTML = str.helm;
	}
	*/
	Contribution.player.input();
	//light,bedhead,black,brown_longsleeve,cape_blue,golden_helm_male,blonde2

}



Contribution.purchase = function(type,param){
	Command.execute('reward,purchase',[type,param]);
}

Contribution.select = function(type,param){
	Command.execute('reward,select',[type,param]);
}

Contribution.reset = function(type){
	Command.execute('reward,reset',[type]);
}

Contribution.change = function(account,name){
	Command.execute('reward,change',[account,name]);
}
Contribution.updateSocialMedia = function(account){
	Command.execute('reward,updateSocialMedia',[account]);	
}
//{
}



Contribution.updatePt = function(main){
	var c = main.contribution;
	var p = c.point;
	var sum = 50 + p.twitter.point + p.twitch.point + p.youtube.point + p.reddit.point + p.quest.point;
	
	var cost = 0;
	for(var i in c.reward.history) cost += c.reward.history[i].cost || 0;
	
	c.sum = sum;
	c.used = cost;
	c.usable = sum - cost;
}


})();
