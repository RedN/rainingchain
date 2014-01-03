
defaultMain = function(key){
	var main = {
		'change':[],
		"currentTab":"inventory",
		"windowList":{'bank':0,'trade':0,'offensive':0,'defensive':0,'shop':0,'ability':0,'passive':0,'quest':0},
		"popupList":{'equip':0},
		"optionList":null,
		'context':'',
		'bankList':[],
		'tradeList':[],
		'btnList':[],
		'dialogue':0,
		'dialogueLoc':{'x':0,'y':0},
		'name':'player000',		
		'chatBox':[],
		'pmBox':[],
		'friendList':{},
		'muteList':{},
		'pm':'on',
		'help':'',
		'temp':{'reset':{}},
		'passivePt':0,
		'chatInput':'',
		'clanList':[],
		'invList': ['','','','','','','','','','','','','','','','','','','','','','','',''],
	};
	if(server){
		main['quest'] = defaultQuestVariable();
		main['pref'] = Command.pref.default();
		main['passive'] = Passive.template();
		main['invList'] = new Inventory(key);
		main['bankList'] = new Bank(key);
		main['old'] = {};
	} 
	return main;
}


defaultPlayer = function(){
	var p = Mortal.template('player');
	
	p.id = Math.randomId();
	p.publicId = Math.random().toString(36).substring(13);
	
	//below is not useless but could be improved
	p.type = 'player';
	p.hitIf = 'player';
	p.targetIf = 'player';
	p.privateChange = {};
	p.privateOld = {};
	p.context = 'player0000';
	p.name = 'player0000';
	p.active = 1;
	p.loginLocation = null;
	Sprite.creation(p,p.sprite);
	p.activeList = {};
	p.ability = [{id:'bulletMulti'}];
	p.abilityList = {
		'bulletMulti':{id:'bulletMulti'},
		'bulletSingle':{id:'bulletSingle'},
		'strikeSingle':{id:'strikeSingle'},
		'dodgeRegular':{id:'dodgeRegular'},
		'stumble':{id:'stumble'},
		'summonDragon':{id:'summonDragon'},
	};
	
	return p;
}





gradientRG = function(n){
	n = Math.min(1,Math.max(0,n));
	if(n<0.5){
		var R = 0+(n*(255/0.5));
		var G = 255;
		var B = 0;
	} else {
		var n = n-0.5;
		var R = 255;
		var G = 255-(n*(255/0.5));
		var B = 0;
	} 
	return 'rgb(' + Math.round(R) + ',' + Math.round(G) + ',' + Math.round(B) + ')';
}

//Testing
if(server){
	io.sockets.on('connection', function (socket) {
		socket.on('testing', function (d) {
			try {
				var key = socket.key;
				var p = List.all[key];
				var m = List.main[key];
				var q = m.quest;
				
				for(var i in List.all){
					if(List.all[i].type === 'enemy'){var e = List.all[i];}
					if(List.all[i].type === 'bullet'){var b = List.all[i];}
				}				
				
				if(List.all[key].name == 'sam'){
					var info = eval(d.command);
					data = JSON.stringify(info);
					permConsoleLog(info);
					socket.emit('testing', {'data':data} );				
				}
			} catch (err){
				logError(err);
				socket.emit('testing', 'failure');
			}			
			
		});
	});

} else {
	ts = function(command){socket.emit('testing', {'command':command});}
	socket.on('testing', function (d) { 
		if(d && d.data){ try { permConsoleLog(JSON.parse(d.data)); } catch (err){ }	}
	});
}

keyFunction = function (key,func,param){
	if(!server){param = func;func = key;}
	
	param = (param instanceof Array) ? param : [param];
	if(typeof func === 'string'){
		if(func.indexOf('.') !== -1){
			if(func.indexOf('Mortal') === 0) key = List.mortal[key]; 
			func = valueViaArray({'origin':this,'array':func.split('.')});
		} else {
			func = this[func];
		}
	}
	
	if(server){	func.apply(this, [key].concat(param));} 
	else {	func.apply(this, param);}
}

rightClickFriend = function(name){
	var option = {'name':name,'option':[],'count':1};
	
	
	if(friendList[name].online){
		option.option[0] = {
		'name':'Send Message',
		'func':(function(name){ addInput('@' + name + ','); }),
		'param':[name],	
		};
	}
	if(!friendList[name].online){
		option.option[0] = {
		'name':'Offline Message',
		'func':(function(name){ addInput('$fl,offlinepm,' + name + ','); }),
		'param':[name],	
		};
	}
	
	
	option.option[1] = {
	'name':'Change Nickname',
	'func':(function(name){ addInput('$fl,nick,' + name + ','); }),
	'param':[name],	
	};
	
	option.option[2] = {
	'name':'Change Comment',
	'func':(function(name){ addInput('$fl,comment,' + name + ','); }),
	'param':[name],	
	};
	
	option.option[3] = {
	'name':'Change PM Color',
	'func':(function(name){ addInput('$fl,color,' + name + ','); }),
	'param':[name],	
	};
	
	option.option[4] = {
	'name':'Remove Friend',
	'func':(function(name){ Chat.send.command('$fl,remove,' + name); }),
	'param':[name],	
	};
	
	
	Button.optionList(option);
}

addInput = function(text,focus,add){
	if(add) {html.chat.input.value += text;}
	else {html.chat.input.value = text;}
	
	if(focus !== false){ html.chat.input.focus(); }
}

setClientContext = function(text){
	clientContext = text;
}


//Element Bar
drawElementBar = function(x,y,w,h,data,noover){
	var xx = x;
	ctx.save();
	ctx.textAlign = 'left';
	ctx.strokeRect(x,y,w,h);
	var total = 0; for(var i in data){	total += data[i]; }
	
	var mx = Math.min(mouse.x,WIDTH-150);
	var my = Math.min(mouse.y,HEIGHT-25);
	
	for(var i in data){
		var length = w*data[i]/total;
		
		if(length > 2){
			ctx.fillStyle = Cst.element.toColor[i];
			ctx.roundRect(x,y,length,h);
		}
		if(Collision.PtRect(Collision.getMouse(),[x,x+length,y,y+h])){
			var mouseOverRatio = i; 
		}
		x += length;
	}
	
	ctx.lineWidth = 2;
	ctx.roundRect(xx,y,w,h,0,1);
	ctx.lineWidth = 1;
	
	if(!noover && mouseOverRatio){
		var amount = data[mouseOverRatio];
		if(amount < 1){ amount = round(data[mouseOverRatio]*100,0) + '%' }
		else { amount = round(data[mouseOverRatio],0) }
		
		var text = mouseOverRatio.capitalize() + ': ' + amount;
		var width = ctx.measureText(text).width;
		ctx.fillStyle = Cst.element.toColor[mouseOverRatio];
		ctx.roundRect(mx,my-30,width+10,30);
		ctx.fillStyle = 'black';
		ctx.fillText(text,mx+5,my+3-30);
	}
	ctx.restore();
}

normalizeRatio = function(info){
	var total = 0; for(var i in info){ total += info[i]; }
	for(var i in info){ 
		info[i] /= total;
	}
	return info;
}



updateHelp = function(elID){
	help = '';
	var el = document.getElementById('HELP' + elID);
	if(el) el.scrollIntoView(true);
	document.getElementById('gameDiv').scrollIntoView(true);		
}

compilePermBoost = function(b){
	var tmp = {};	var temp = [];
	
	for(var i in b){
		if(b[i].stat){
			var name = b[i].type + '--' + b[i].stat;
			if(tmp[name] === undefined){tmp[name] = {'type':b[i].type,'stat':b[i].stat,'value':0};}
			tmp[name].value += b[i].value;
		} else {
			tmp[b[i].value] = b[i];
		}
	}
	for(var i in tmp){temp.push(tmp[i]);}
	return temp;
}

/*
ts("Mortal.permBoost(p,'asdsd',[{'type':'custom','value':'balancedAtk'}])")
ts("Mortal.permBoost(p,'asdsd',[{'type':'custom','value':'balancedAtk'}])")
*/



superBoost = function(){
	var str = [];
	for(var i in Db.stat){
		str.push({'stat':i,'value':Math.random()*2,'type':'+'});
	}
	str = stringify(str);
	
	ts("addPermBoost(key,'super'," + str + ')');
}


//Randomly select a mod in a list where mod[i].lvl >= lvl. Take into consideration the mod factor.
randomViaMod = function(list,lvl){
	var sum = 0; 
	for(var i in list){ 
		if(!lvl || (lvl && list[i].lvl <= lvl)){
			sum += list[i].mod; 
		}
	}
	var random = Math.random() * sum;
	for(var i in list){ 
		if(!lvl || (lvl && list[i].lvl <= lvl)){
			if(random < list[i].mod){ return deepClone(list[i]); } 
			random -= list[i].mod;	
		}
	}
	return -1
}


//Combat: Sub Functions
if(!server) Combat = {action:{attack:{}}};
Combat.action.attack.mod = function(player,atk){
	atk = Combat.action.attack.mod.bonus(player.bonus,atk);
	atk = Combat.action.attack.mod.player(player,atk);
	atk = Combat.action.attack.mod.weapon(player.weapon,atk);
	return atk;
}

Combat.action.attack.mod.bonus = function(bon,atk){
	var bon = useTemplate(Mortal.template.bonus(),bon,0);
	
	//Status Effect
	var list = ['time','magn','chance'];
	for(var i in Cst.status.list){
		for(var j in list){
			atk[Cst.status.list[i]][list[j]] *= bon[Cst.status.list[i]][list[j]];
		}
	}
	for(var j in list){
		atk.leech[list[j]] *= bon.leech[list[j]];
	}
	atk.crit.magn *= bon.crit.magn; atk.crit.chance *= bon.crit.chance;
	
	
	if(atk.type == 'b' || atk.type == 'bullet'){
		atk.amount *= bon.bullet.amount; if(Math.random() <= atk.amount%1){atk.amount += 1; } atk.amount = Math.floor(atk.amount);
		atk.pierce.chance *= bon.pierce.chance; atk.pierce.dmgReduc *= bon.pierce.dmgReduc;
	}
	if(atk.type == 's' || atk.type == 'strike'){
		atk.width *= bon.strike.size; 
		atk.height *= bon.strike.size; 
		atk.maxHit *= bon.strike.maxHit; if(Math.random() <= atk.maxHit%1){atk.maxHit += 1; } atk.maxHit = Math.floor(atk.maxHit);
		atk.maxRange *= bon.strike.range; 
	}
	return atk;
}

Combat.action.attack.mod.player = function(player,attack){
	for(var i in attack.dmg){ 
		attack.dmg[i] *= player.dmgMain * player.mastery.dmg[i].sum * player.mastery.dmg[i].mod;
	}
	return attack;
}

Combat.action.attack.mod.weapon = function(weapon,attack){
	for (var i in attack.dmg){ 
		attack.dmg[i] *= weapon.dmgMain * weapon.dmgRatio[i] 
		attack.dmg[i] *= (1 - Math.abs(attack.dmgRatio[i] - weapon.dmgRatio[i]));
	}
	if(!server){ 
		var maxDmg = Combat.action.attack.mod.weapon.compability(weapon,attack);
		var sum = 0;
		for (var i in attack.dmg){ sum += attack.dmg[i]; }
		attack.weaponCompability = sum/maxDmg;
	}
	return	attack;
}

Combat.action.attack.mod.weapon.compability = function(weapon,atk){
	var attack = deepClone(atk);
	var sum = 0;
	for (var i in attack.dmg){ 
		attack.dmg[i] *= weapon.dmgMain * attack.dmgRatio[i];
		sum += attack.dmg[i];
	}
	return sum;
}










