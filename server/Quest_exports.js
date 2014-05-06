exports.init = function(version,questname){	//}
	var Q = questname;
	
	var getItemName = function(name){
		if(name.have(Q)) return name;
		else return Q + '-' + name;
	}
	
	
	var convertSetEvent = function(event){
		if(typeof event !== 'string') return event;
		if(s.quest.event['$SET_' + event]) return s.quest.event['$SET_' + event]
	}
	var convertGetEvent = function(event){
		if(typeof event !== 'string') return event;
		if(s.quest.event['$GET_' + event]) return s.quest.event['$GET_' + event]
	}
	
	var parseViewedIf = function(vif){
		if(typeof vif !== 'string') return vif;
		else return convertGetEvent(vif);
	}
	var parseEvent = function(event){
		if(typeof event !== 'string') return event;
		else return convertSetEvent(event);
	}
	var parseExtra = function(extra){
		if(!extra) return {};
		if(extra.viewedIf) extra.viewedIf = parseViewedIf(extra.viewedIf);
		extra.quest = Q;
		return extra;
	}
	
	
	var s = {};	
	s.interval = function(num){ return Loop.interval(num); }
	
	s.quest = Quest.template(Q);
	
	s.startQuest = function(key){
		Main.openWindow(List.main[key],'quest',Q);	
	}
	
	s.abandonQuest = function(key){
		Quest.abandon(key,Q);
	}
	s.completeQuest = function(key){
		Quest.complete(key,Q);
	}
	s.get = function(key,attr){
		if(!List.main[key]) return;	//case enemy
		var mq = List.main[key].quest[Q];		
		var a = mq[attr];
		return typeof a === 'object' ? Tk.deepClone(a) : a;	//prevent setting
	}

	s.set = function(key,attr,value){
		var mq = List.main[key].quest[Q];	
		
		if(!mq._active){
			Chat.add(key,"You need to start this quest via the Quest Tab before making progress in it."); 
			return;
		}
		if(typeof value === 'string' && typeof mq[attr] === 'number' && !isNaN(value) && (value[0] === '+' || value[0] === '-'))	mq[attr] += (+value);
		else mq[attr] = value;		
	}

	s.getAct = function(key){
		return List.all[key];
	}
	
	s.setTimeout = function(key,name,time,func){
		Actor.setTimeout(s.getAct(key),Q + '-' + name,time,func);	
	};
	
	s.chat = Chat.add;
	s.question = Chat.question;
	
	s.dialogue = function(key,npc,convo,node){
		Dialogue.start(key,{group:Q,npc:npc,convo:convo,node:node});
	}

	s.teleport = function(key,map,letter,popup){	//type: 0=immediate, 1=popup
		var spot = s.getSpot(map,Q,letter);
		
		if(!popup) Actor.teleport(s.getAct(key),spot);
		else {
			Chat.question(key,{
				//could show text to where hes going
				func:function(){Actor.teleport(s.getAct(key),spot);},
				option:true,
			});
		}
	}
	
	s.setRespawn = function(key,map,letter,safe){	//must be same map
		var spot = s.getSpot(map,Q,letter);
		if(!spot) return ERROR(3,'no spot');
		Actor.setRespawn(s.getAct(key),spot,safe);
	}

	s.getMapAddon = function(key){
		return List.map[s.getAct(key).map].addon[Q];
	}
	
	s.getSpot = function(id,addon,spot){
		var a = Db.map[Map.getModel(id)].addon[addon].spot[spot];	//cant use list cuz map could not be created yet
		if(!a){ ERROR(3,'spot not found ',id,addon,spot); return }
		return {x:a.x,y:a.y,map:id}
	}
	
	s.setSprite = function(key,name,size){
		var tmp = {};
		if(name) tmp.name = name;
		if(size) tmp.sizeMod = size;
		Sprite.change(s.getAct(key),tmp);
	}

	s.boost = function(key,boost){
		Actor.boost(s.getAct(key),boost);	
	}
	
	//Item
	s.itemFormat = function(item,amount){
		var list = Itemlist.format(item,amount,false);
		var goodList = {};
		for(var i in list) goodList[getItemName(i)] = list[i];
		return goodList;
	}
	
	s.addItem = function(key,item,amount){
		if(s.get(key,'_active') === false) return false;
		
		Itemlist.add(key,s.itemFormat(item,amount));
	}

	s.removeItem = function(key,item,amount){
		Itemlist.remove(key,s.itemFormat(item,amount));
	}

	s.haveItem = function(key,item,amount,removeifgood){
		var list = s.itemFormat(item,amount);
		var success = Itemlist.have(key,list);
		if(success && (removeifgood || amount === true)) Itemlist.remove(key,list);
		return success;
	}

	s.testItem = function (key,item,amount,addifgood,variable){
		if(s.get(key,'_active') === false) return false;
		
		var list = s.itemFormat(item,amount);
		var success = Itemlist.test(key,list);
		if(success && ((addifgood || amount) === true)) Itemlist.add(key,list);
		
		if(success && (variable || typeof addifgood === 'string')){
			s.set(key,variable || addifgood,true);
		}
		return success;
	}
	
	s.getTeam = function(key){	//TODO
		//for(var i in List.team[
	
	}

	//Cutscene
	s.cutscene = function(key,map,path){
		var act = s.getAct(key);
		if(Map.getModel(act.map) !== map){ ERROR(3,'act in wrong map for cutscene'); return; }
		Actor.setCutscene(act,s.quest.map[map][Q].path[path]);
		//ts("p.x = 1500; p.y = 3000;Actor.setCutscene(p,[{x:1600,y:3100},25*10,{x:1800,y:3200}]);")
	}

	s.freeze = function(key,time,cb){
		Actor.freeze(s.getAct(key),time,cb);
	}
	
	s.unfreeze = function(key){
		Actor.freeze.remove(s.getAct(key));
	}

	s.getNpc = function(key,tag){
		var list = List.map[s.getAct(key).map].list.npc;
		for(var i in list){
			if(List.all[i].tag === tag)
				return List.all[i];
		}
		return null;
	}

	s.actor = function(key,spot,cat,variant,extra,lvl){
		var spot = s.getSpot(s.getAct(key).map,Q,spot);
		Actor.creation({spot:spot,category:cat,variant:variant,lvl:lvl || 0,extra:parseExtra(extra)});
	}
	
	s.drop = function(key,e,item,amount){
		item = getItemName(item);
		amount = amount || 1;
		
		var tmp = {'x':e.x,y:e.y,map:e.map,"item":item,"amount":amount};
		tmp.viewedIf = Tk.arrayfy(key);	//key can be string or array of keys
		Drop.creation(tmp);			
	}
	
	s.chrono = function(key,name,action,text){
		return Main.chrono(List.main[key],Q + '-' + name, action, text);
	}
	
	//Map
	var m = s.map = {};
	m.map = Init.db.map.template;
	m.bullet = function(spot,atk,angle,dif){
		var act = {damageIf:dif || 'player-simple',spot:spot};
		Map.convertSpot(act);
		
		Attack.creation(act,atk,{angle:angle});
	}
	
	m.strike = function(spot,atk,angle,dif,extra){
		Combat.attack.simple({damageIf:dif || 'player-simple',spot:spot,angle:angle},atk,parseExtra(extra));
	}
	
	m.actor = function(spot,cat,variant,extra,lvl){
		Actor.creation({spot:spot,category:cat,variant:variant,lvl:lvl || 0,extra:parseExtra(extra)});
	}
	
	
	m.actorGroup = function(spot,respawn,list,extra){
		var tmp = [];
		for(var i in list){
			var m = list[i];
			tmp.push({"category":m[0],"variant":m[1],'amount':m[2] || 1,'modAmount':true,'extra':parseExtra(m[3])});
		}
		Actor.creation.group({'spot':spot,'respawn':respawn},tmp);
	}


	m.collision = function(spot,cb){
		if(!Loop.interval(5)) return;
			Map.collisionRect(spot.map,spot,'player',cb);
	}

	m.block = function(zone,viewedIf,sprite,extra){
		extra = extra || {};
		if(viewedIf) extra.viewedIf = viewedIf;
		if(sprite) extra['sprite,name'] = sprite;
		
		if(zone[2] === zone[3]){	//horizontal
			for(var i = zone[0]; i <= zone[1]; i += 32){
				m.actor({x:i+16,y:zone[2],map:zone.map,addon:zone.addon},'block','spike',parseExtra(extra));
			}
		}
		if(zone[0] === zone[1]){
			for(var i = zone[2]; i <= zone[3]; i += 32){
				m.actor({x:zone[0],y:i+16,map:zone.map,addon:zone.addon},'block','spike',parseExtra(extra));
			}	
		}
	}

	m.drop = function(key,spot,name,amount,time){	//TOFIX
		time = time || 25*120;
		if(!s.existItem(Q+ '-' + name)) return;
		
		var tmp = {'spot':spot,"item":Q + '-' + name,"amount":amount,'timer':time};
		if(typeof key === 'string') tmp.viewedIf = [key];
		Drop.creation(tmp);	
	}
	
	m.toggle = function(spot,viewedIf,on,off,sprite,extraOff,extraOn){
		sprite = sprite || 'box';
		viewedIf = parseViewedIf(viewedIf);
		
		//Off
		extraOff = parseExtra(extraOff);
		extraOff.viewedIf = function(key){
			if(s.getAct(key).type !== 'player') return true;
			return viewedIf(key);
		};
		extraOff.toggle = parseEvent(on);

		m.actor(spot,'toggle',sprite+'Off',extraOff);

		//On
		extraOn = parseExtra(extraOn);
		extraOn.viewedIf = function(key){
			if(s.getAct(key).type !== 'player') return true;
			return !viewedIf(key);
		};
		if(off) extraOn.toggle = parseEvent(off);
		
		m.actor(spot,'toggle',sprite + 'On',extraOn);
	}
	
	m.teleport = function(spot,event,sprite,extra){
		extra = extra || {};
		extra.teleport = event;
		m.actor(spot,'teleport',sprite || 'zone',extra);
	}
	
	m.waypoint = function(spot,safe,extra){
		extra = parseExtra(extra);
		if(safe) extra.waypoint = 2;
		m.actor(spot,'waypoint','grave',extra);
	}
	
	m.loot = function(spot,viewedIf,open,sprite,extraOff,extraOn){
		sprite = sprite || 'chest';
		viewedIf = parseViewedIf(viewedIf);
		
		//Off
		extraOff = parseExtra(extraOff);
		extraOff.viewedIf = function(key){
			if(s.getAct(key).type !== 'player') return true;
			return viewedIf(key);
		};
		extraOff.loot = open;

		m.actor(spot,'loot',sprite + 'Off',extraOff);

		//On
		extraOn = parseExtra(extraOn);
		extraOn.viewedIf = function(key){
			if(s.getAct(key).type !== 'player') return true;
			return !viewedIf(key);
		};
		
		m.actor(spot,'loot',sprite + 'On',extraOn);
	}
	
	//Boss
	var b = s.boss = {};
	b.init = Boss.template;
	b.attack = Boss.attack;
	b.summon = Boss.summon;

	
	
	//Template
	s.requirement = function(){
		if(Quest.requirement.template[arguments[0]])
			return Quest.requirement.template[arguments[0]](arguments[1],arguments[2],arguments[3],arguments[4]);	
	}
	s.challenge = function(){
		if(Quest.challenge.template[arguments[0]])
			return Quest.challenge.template[arguments[0]](arguments[1],arguments[2],arguments[3],arguments[4]);	
	}
	
	
	
	
	s.ERROR = function(txt){
		ERROR(3,txt);
	}
	return s;
}















