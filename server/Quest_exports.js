
exports.init = function(version,questname){	//}
	var Q = questname;
	
	var getItemName = function(name){
		if(name.have(Q)) return name;
		else return Q + '-' + name;
	}
	
	
	var s = {};	
	s.quest = Quest.template(Q);
	
	s.interval = function(num){ return Loop.interval(num); }
	s.get = function(key,attr){
		var mq = List.main[key].quest[Q];		
		var a = mq[attr];
		return typeof a === 'object' ? deepClone(a) : a;	//prevent setting
	}

	s.set = function(key,attr,attr2,value){
		var mq = List.main[key].quest[Q];	
		
		if(attr === 'started'){
			mq[attr] = true;
			Chat.add(key,"You started the quest '" + q.name + "'.");
			return;
		}	
		if(!mq.started){
			Chat.add(key,"You need to start this quest via the Quest Tab before making progress in it."); 
			return;
		}
		if(value === undefined) mq[attr] = attr2;	//aka deep = 1
		else mq[attr][attr2] = value;
		
		if(attr === 'complete' && attr2)	Quest.complete(key,Q);
	}

	s.getAct = function(key){
		return List.all[key];
	}

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
				func:function(){Actor.teleport(s.getAct(key),spot);},
				option:true,			
			});
		}
	}
	
	s.respawn = function(key,map,letter,safe){	//must be same map
		var spot = s.getSpot(map,Q,letter);
		if(spot) Actor.setRespawn(s.getAct(key),spot,safe);
	}

	s.getMapAddon = function(key){
		return List.map[s.getAct(key).map].addon[Q];
	}
	
	s.getSpot = function(id,addon,spot){
		var a = Db.map[Map.getModel(id)].addon[addon].spot[spot];	//cant use list cuz map could not be created yet
		if(!a){ DEBUG(0,'spot not found ' + id + addon + spot); return }
		return {x:a.x,y:a.y,map:id}
	}
	
	s.sprite = function(key,name,size){
		var tmp = {name:name};
		if(size && size !== 1) tmp.sizeMod = size;
		Sprite.change(s.getAct(key),tmp);
	}

	//Item
	s.addItem = function(key,item,amount){
		if(typeof item === 'object'){
			for(var i in item) s.addItem(key,i,item[i]);
			return;
		}

		item = getItemName(item);
		if(s.itemExist(item))	Itemlist.add(key,item,amount);
		else Chat.add(key,"BUG. ITEM DOES NOT EXIST @ " + item);
	}

	s.removeItem = function(key,item,amount){
		if(typeof item === 'object'){
			for(var i in item) s.removeItem(key,i,item[i]);
			return;
		}

		item = getItemName(item);
		if(s.itemExist(item))	Itemlist.remove(key,item,amount);
		else Chat.add(key,"BUG. ITEM DOES NOT EXIST @ " + item);
	}

	s.haveItem = function(key,item,amount,removeifgood){
		if(typeof item === 'object'){
			for(var i in item){
				if(!s.haveItem(key,i,item[i])) return false;
			}
			if(amount) s.removeItem(key,item);	//amount acts as removeifgood
			return true;
		}

		item = getItemName(item);
		if(s.itemExist(item)){
			var success = Itemlist.have(key,item,amount);
			if(success && removeifgood) Itemlist.remove(key,item,amount);
			return success;
		}
		else Chat.add(key,"BUG. ITEM DOES NOT EXIST @ " + item);
		return false;
	}

	s.testItem = function (key,item,amount,addifgood){
		if(typeof item === 'object'){
			var success = Itemlist.test(key,Itemlist.objToArray(item));
			if(amount) s.addItem(key,item);	//amount acts as addifgood
			return true;
		}
		
		
		item = getItemName(item);
		var success = Itemlist.test(key,[[item,amount || 1]]);
		if(success && addifgood) s.addItem(key,item,amount);
		return success;
	}
	
	s.itemExist = function(id){ return !!Db.item[id]; }
	

	//Cutscene
	s.cutscene = function(key,map,path){
		Actor.setCutscene(s.getAct(key),q.map[map][Q].path[path]);
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


	//Map
	s.bullet = function(spot,atk,angle,dif){
		var act = {damageIf:dif || 'player-simple',spot:spot};
		Map.convertSpot(act);
		
		Attack.creation(act,atk,{angle:angle});
	}
	s.strike = function(spot,atk,angle,dif,extra){
		Combat.attack.simple({damageIf:dif || 'player-simple',spot:spot,angle:angle},atk,extra);
	}
	s.actor = function(spot,cat,variant,extra){
		Actor.creation({spot:spot,category:cat,variant:variant,extra:(extra || {})});
	}

	s.actorGroup = function(spot,respawn,list,extra){
		var tmp = [];
		for(var i in list){
			var m = list[i];
			tmp.push({
				"category":m[0],"variant":m[1],'amount':m[2] || 1,'modAmount':1,'extra':(m[3] || {})
			});
		}
		Actor.creation.group({'spot':spot,'respawn':respawn},tmp);
	}


	s.collision = function(spot,cb){
		if(!Loop.interval(5)) return;
			Map.collisionRect(spot.map,spot,'player',cb);
	}

	s.block = function(zone,extra,image){
		image = image || 'spike';
		extra = extra || {};
		if(zone[2] === zone[3]){	//horizontal
			for(var i = zone[0]; i <= zone[1]; i += 32){
				s.actor({x:i+16,y:zone[2],map:zone.map,addon:zone.addon},'block',image,extra);
			}
		}
		if(zone[0] === zone[1]){
			for(var i = zone[2]; i <= zone[3]; i += 32){
				s.actor({x:zone[0],y:i+16,map:zone.map,addon:zone.addon},'block',image,extra);
			}	
		}
	}

	s.drop = function(key,spot,name,amount,time){
		time = time || 25*120;
		if(!s.itemExist(Q+ '-' + name)) return;
		
		var tmp = {'spot':spot,"item":Q + '-' + name,"amount":amount,'timer':time};
		if(typeof key === 'string') tmp.viewedIf = [key];
		Drop.creation(tmp);	
	}


	//Boss
	s.bossAttack = Boss.attack;
	s.bossSummon = Boss.summon;

	//Init
	s.map = Init.db.map.model;
	s.boss = Boss.template;

	return s;
}




