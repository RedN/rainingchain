//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Quest','Send','ActorModel','MapModel','Highscore','QuestVar','Party','SpriteModel','ItemModel','Account','ItemList','Combat','Message','OptionList','Boss','Server', 'Boost',  'Cycle', 'Actor',  'Main', 'Attack', 'Strike', 'Bullet',  'ActiveList', 'ItemList','Sign', 'Save',  'Combat', 'Map', 'Input', 'Message', 'Dialogue',  'Drop', 'Performance', 'Ability',  'Equip', 'Quest', 'Clan', 'Collision', 'Button', 'Sprite', 'Anim', 'Command', 'ReputationGrid', 'Contribution'],['Debug']));

var db = null; //Debug.init
var DEV_TOOL = 'DEV_TOOL';
var QUEST_TOOL_SUFFIX = '_Tool';
var Debug = exports.Debug = {
	trackQuestVar:!NODEJITSU,
	skipTutorial:true,
	DMG_MOD:{player:1,npc:1,pvp:1},
	ACTIVE:!NODEJITSU,
	TOEVAL:'',
};

Debug.init = function(dbLink){
	db = dbLink;
	Debug.createDevTool();
}

Debug.spawnEnemy = function(key,model){
	model = model || 'Qsystem-bat';
	var player = Actor.get(key);
	try {
		Actor.addToMap(Actor(model),Actor.Spot(player.x,player.y,player.map));
	} catch(err){ ERROR.err(3,err); };
}

Debug.spawnEnemyViaQuestion = function(key){
	Main.question(Main.get(key),function(key,cat,amount){
		amount = +amount;
		Debug.spawnEnemy(key,cat);
		for(var i = 1; i < amount; i++)
			Debug.spawnEnemy(key,cat);
	},"Category,amount",'string');	
}

Debug.invincible = function(key){
	if(Actor.get(key).globalDef < 500){
		Actor.permBoost(Actor.get(key),'Debug.invincible',[
			Boost.Perm('globalDef',1000,'+'),
			Boost.Perm('globalDmg',1000,'+'),
		]);	
		Message.add(key,'Invincible');
	} else {
		Actor.permBoost(Actor.get(key),'Debug.invincible');
		Message.add(key,'Not Invincible');
	}
}

Debug.ghost = function(key){
	var act = Actor.get(key);
	if(act.ghost){
		Actor.permBoost(act,'Debug.ghost');
		Message.add(key,'Not ghost.');
		act.ghost = 0;
	} else {
		Message.add(key,'Ghost.');
		act.ghost = 1;
		act.bumper = Actor.Bumper();
		Actor.permBoost(act,'Debug.ghost',[
			Boost.Perm('acc',40,'+'),
			Boost.Perm('maxSpd',40,'+'),
		]);	
	}
}

Debug.giveRandomEquip = function(key){
	Main.addItem(Main.get(key),Equip.randomlyGenerate().id);
}

Debug.onSignIn = function(key,name){
	Debug.displayDeveloperMessage(key);
	if(Server.isAdmin(0,name)) Debug.giveDevTool(key);
	if(!Debug.ACTIVE)	return;
	
	var main = Main.get(key);
	if(main.questActive)
		Debug.giveQuestTool(key,main.questActive);
	
	if(!Quest.TESTING.name) return;
	
	
	
	/*
	if(name.have('rc',true) || Quest.TESTING.everyone){	//put true when uploading for ppl to create quest
		setTimeout(function(){	//otherwise fucks thing
			var main = Main.get(key);
			Quest.get('Qtutorial').event.skipTutorial(key);
			Quest.get(Quest.TESTING.name).event._debugSignIn(key);
			Debug.giveQuestTool(key,Quest.TESTING.name);
			Message.add(key,'Game engine set to create the quest: \"' + Quest.TESTING.name + '\".');
			if(main.questActive !== Quest.TESTING.name){
				Main.abandonQuest(Main.get(key));
				Main.startQuest(main,Quest.TESTING.name);
			}
		},1000);
	}
	*/
}

Debug.giveDefaultAbility = function(key){
	var act = Actor.get(key);
	Actor.ability.add(act,'Qsystem-start-melee');
	Actor.ability.add(act,'Qsystem-start-bullet');
	Actor.ability.add(act,'Qsystem-start-freeze');
	Actor.ability.add(act,'Qsystem-start-fireball');
	Actor.ability.add(act,'Qsystem-start-heal');
	Actor.ability.add(act,'Qsystem-start-dodge');
	
	Actor.ability.swap(act,'Qsystem-start-melee',0);
	Actor.ability.swap(act,'Qsystem-start-bullet',1);
	Actor.ability.swap(act,'Qsystem-start-freeze',2);
	Actor.ability.swap(act,'Qsystem-start-fireball',3);
	Actor.ability.swap(act,'Qsystem-start-heal',4);
	Actor.ability.swap(act,'Qsystem-start-dodge',5);
}

Debug.ts = function(socket,d){
	try {
		var key = socket.key;
		
		var p = Actor.get(key);
		var act = p;
		var player = p;
		var m = Main.get(key);
		var main = m;
		var q = m.quest;
		var mq = m.quest[Quest.TESTING.name];
		var add = function(id,amount){ Main.addItem(m,id,amount);}
		var tele = function(x,y,map){ Actor.teleport(p,{x:x,y:y,map:map}); }
		
		var pa = Server.getPlayerAmount();
		
		//ts("tele(1700,260,'QfirstTown-east')")
		
		var npcAll = {};	//all enemy nearby
		var combatAll = {}; //all combat enemy nearby
		var playerAll = {}; //all player nearby 
		var humanAll = {};
		var bulletAll = {};	//all bullet nearby
		
		var all = {};
		
		var npc = {};
		var combat = {};
		var human = {};
		var bullet = {};
		
		var name = function(name){
			return Actor.get(Account.getViaUserName(name));
		}
		
		for(var i in p.activeList){	
			var mort = ActiveList.get(i); //cant use var act
			var id = mort.name + ' ' + mort.id;
			all[id] = mort;
			if(mort.type === 'npc'){
				if(mort.combat){
					combat = mort;
					combatAll[id] = mort;
				} else {
					npc = mort;
					npcAll[id] = mort;
				}
			}						
			if(mort.type === 'player'){
				human = mort;
				humanAll[id] = mort;
			}
			if(mort.type === 'bullet'){
				bullet = mort;
				bulletAll[id] = mort;
			}
		}				
		
		var info = eval(d.command);
		var data = JSON.stringify(info);
		INFO(info);
		socket.emit('testing', {'data':data} );				
	} catch (err){
		ERROR.err(3,err);
		socket.emit('testing', 'failure');
	}			
}

Debug.displayDeveloperMessage = function(key){
	//developper. TOFIX
	setTimeout(function(){
		db.report.findOne({version:Server.version},{message:1},function(err,res){	if(err) ERROR.err(3,err);
			if(!Actor.get(key)) return; //dced
			if(res && res.message)	Message.add(key,Message('dialog',res.message));	
			if(!NODEJITSU) Message.add(key,'You are using Game Engine v' + Server.version + '.');
		});
	},2000);
}

Debug.changeDeveloperMessage = function(version,text){
	db.report.upsert({version:version},{'$set':{version:version,message:text}},db.err);
};

Debug.addItemViaQuestion = function(key){
	Main.question(Main.get(key),function(key,item,amount){
		if(item === 'equip') return Debug.giveRandomEquip(key);
		if(ItemModel.get(item))	Main.addItem(Main.get(key),item,+amount || 1);
		else Message.add(key,'wrong');
	},"item,amount",'string');	
}

Debug.teleportViaQuestion = function(key){
	Main.question(Main.get(key),function(key,x,y,map){
		var act = Actor.get(key);
		if(!map || map === '1'){ act.x += +x; act.y += +y; return; }
		if(!MapModel.get(map)) return ERROR(3,'mapmodel not exist',map);
		Actor.teleport(act,Actor.Spot(+x,+y,map));		
	},"x,y,map",'string');
}

Debug.completeQuest = function(key){
	if(Main.get(key).questActive)
		Main.completeQuest(Main.get(key));			
}

Debug.teleportTo = function(key,name){
	var act = Actor.getViaUserName(name);
	if(!act) return 'no player with that name';
	Actor.teleport(Actor.get(key),Actor.Spot(act.x,act.y,act.map));
}

Debug.createQuestTool = function(q){
	var option = [];
	option.push(ItemModel.Option(function(key){
		if(Main.get(key).questActive !== q.id) return;
		
		INFO('########### ' + Date.now() + ' ###########');
		var mq = QuestVar.getViaMain(Main.get(key));
		for(var i in mq){
			if(['quest','username','key','_preset'].have(i)) continue;
			var attr = i;
			for(var j = attr.length; j < 15; j++)
				attr += ' ';
			INFO('   ' + attr + ' : ' + mq[i]);
		}
	},'Get Var'));
	
	option.push(ItemModel.Option(function(key){
		Main.question(Main.get(key),function(key,param,value){
			var mq = QuestVar.getViaMain(Main.get(key));
			if(value === undefined)	return Message.add(key,param + ' : ' + mq[param]);
			if(mq[param] !== undefined){
				if(value === 'true') mq[param] = true;
				else if(value === 'false') mq[param] = false;
				else if(!isNaN(value)) mq[param] = +value;
				else mq[param] = value;
			}
			else Message.add(key,"bad name");
		},'variable,value','string');
	},'Change Var'));
	
	option.push(ItemModel.Option(function(key){
		Main.question(Main.get(key),function(key,param){
			var spot = Map.getSpot(Map.get(Actor.get(key).map),q.id,param);
			if(spot) Actor.teleport(Actor.get(key),spot);
			else INFO('not found');
		},"enter spot",'string');
	},'Teleport'));
	
	option.push(ItemModel.Option(function(key){
		Main.question(Main.get(key),function(key,item,amount){
			item = q.id + '-' + item;
			if(ItemModel.get(item))	Main.addItem(Main.get(key),item,amount || 1);
			else Message.add(key,'wrong');
		},"item,amount",'string');	
	},'Add Item'));
	
	option.push(ItemModel.Option(function(key){
		Main.question(Main.get(key),function(key,param){
			if(q.event[param]) return q.event[param](key);
			else for(var i in q.event.test)	if(q.event.test[param]) return q.event.test[param](key);
			Message.add(key,"no found");
		},'event','string');
	},'Call Event',null));
	
	
	
	var itemId = Quest.addPrefix('Qsystem',q.id + QUEST_TOOL_SUFFIX);
	var itemName = q.id + ' Tool';
	ItemModel('Qsystem',itemId,itemName,'system.gold',option,itemName,{
		trade:0,drop:0
	});
}

Debug.addAbility = function(key){
	Main.question(Main.get(key),function(key,ability,slot){
		var act = Actor.get(key);
		if(!Ability.get(ability)) return ERROR(3,'ability dont exist',ability);
		slot = +slot || 0;
		Actor.ability.swap(act,ability,slot);
	},"ability,slot",'string');
}

Debug.createDevTool = function(){
	var option = [
		ItemModel.Option(Debug.ghost,'Ghost'),
		ItemModel.Option(Debug.invincible,'Invincible'),
		ItemModel.Option(Debug.teleportViaQuestion,'Tele'),
		ItemModel.Option(Debug.addItemViaQuestion,'Add Item'),	
		ItemModel.Option(Debug.addAbility,'Ability'),
		ItemModel.Option(Debug.spawnEnemyViaQuestion,'Enemy'),
		ItemModel.Option(Debug.testQuest,'Test Quest'),
		ItemModel.Option(Debug.completeQuest,'Quest Complete'),
	];
	
	var itemId = Quest.addPrefix('Qsystem',DEV_TOOL);
	ItemModel('Qsystem',itemId,'Dev Tool','system.gold',option,'Dev Tool',{
		trade:0,drop:0
	});
	

}

Debug.testQuest = function(key){
	var main = Main.get(key);
	Main.question(main,function(key,quest){
		Debug.startQuest(key,quest);
	},'quest','option',Object.keys(Quest.DB));
}

Debug.giveDevTool = function(key){
	Main.addItem(Main.get(key),DEV_TOOL);
}

Debug.giveQuestTool = function(key,quest){
	Main.addItem(Main.get(key),quest + QUEST_TOOL_SUFFIX);
}

Debug.giveRandomHighscore = function(key){
	var main = Main.get(key);
	for(var i in main.quest){
		for(var j in main.quest[i]._highscore)
			main.quest[i]._highscore[j] = Math.floor(Math.random()*1000);
	}
}

Debug.startQuest = function(key,qid){
	var main = Main.get(key);
	if(main.questActive && main.questActive !== qid)
		Main.abandonQuest(main);
	if(main.questActive !== qid)
		Main.startQuest(main,qid);
}

Debug.onStartQuest = function(key,qid){
	if(!Debug.ACTIVE) return;
	Quest.get(qid).event._debugSignIn(key);
	Debug.giveQuestTool(key,qid);
}

Debug.skipTutorial = function(key){
	var act = Actor.get(key);
	Actor.ability.add(act,'Qsystem-start-melee',false);
	Actor.ability.swap(act,'Qsystem-start-melee',0);
	
	Actor.ability.add(act,'Qsystem-start-bullet',false);
	Actor.ability.swap(act,'Qsystem-start-bullet',1);
		
	Actor.ability.add(act,'Qsystem-start-freeze',false);
	Actor.ability.swap(act,'Qsystem-start-freeze',2);
	
	Actor.ability.add(act,'Qsystem-start-fireball',false);
	Actor.ability.swap(act,'Qsystem-start-fireball',3);
	
	Actor.ability.add(act,'Qsystem-start-heal',false);
	Actor.ability.swap(act,'Qsystem-start-heal',4);
	
	Actor.ability.add(act,'Qsystem-start-dodge',false);
	Actor.ability.swap(act,'Qsystem-start-dodge',5);
	
	Main.completeQuest(Main.get(key));
}


















