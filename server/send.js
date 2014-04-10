Change = {};

Change.send = function(){
	//Send what has changed to the client.for (var key in List.socket){
	for(var key in List.socket){
		var socket = List.socket[key];
		if(!socket.clientReady) continue;
		if(key === Server.botwatch.watcher) continue;
		var sa = Change.send.template();
		
		//Update Private Player
		var player = List.all[key];
		sa.p = player.privateChange;
		sa.p = Change.send.compressXYA(sa.p);
		
		//Update Activelist AKA List.all
		var array = [];
		for (var i in player.activeList){
			var bool = true;	
			var obj = List.all[i];
			if(!obj){ delete player.activeList[i]; continue; }
			
			for(var j in obj.viewedBy){	if(j === player.id){bool = false;}}	//test if player is in viewedBy list of obj
				
			var id = obj.publicId || obj.id;
			
			if(bool){		//Need to Init
				sa.i[id] = Change.send.init(obj);
				obj.viewedBy[key] = player.id;		//Add so the next time it will update instead of init
			} else {			//Only Update
				sa.u[id] = obj.change;
				sa.u[id] = Change.send.compressXYA(sa.u[id]);
			}
			
		}
		//Remove List
		sa.r = player.removeList;
		
		//Main
		sa.m = List.main[key].change;
		
		//Anim
		//note: remove map and viewedif from .target and slot?
		//ts("Anim.creation('fire2',{x:p.x,y:p.y,map:p.map,viewedIf:'true'})")	
		for(var i in List.map[player.map].list.anim){
			var anim = List.map[player.map].list.anim[i];
			
			if(typeof anim.target === 'string'){	//aka target is an obj
				var targ = List.all[anim.target];
				if(!targ) continue;
				if(player.id === targ.id || Activelist.test(player,targ)){
					anim = Change.send.init.anim(anim);
					sa.a.push(anim); 
				}
			}
			if(typeof anim.target !== 'string'){	//aka target is already in form {x:1,y:1,map:1}
				if(Activelist.test(player,anim.target)){
					anim = Change.send.init.anim(anim);
					sa.a.push(anim); 
				}
			}
		}
		
		
		//Delete things that are empty
		sa = Change.send.clearEmpty(sa);
		//if(Object.keys(sa).length === 0){ continue; }
		
		//Send
		socket.emit('change', sa );
		
		if(key === Server.botwatch.watched){
			if(List.socket[Server.botwatch.watcher])
				List.socket[Server.botwatch.watcher].emit('change', sa );
			else {
				Server.botwatch.watcher = null;
				Server.botwatch.watched = null;
			}
		}
		
	    Performance.bandwidth('upload',sa,socket);
	}
	
	Change.send.reset();

}

Change.send.template = function(){
	return {
		i:{},  //init (first time seen by player		
		u:{},  //update (already init-ed)
		p:{},	//player
		m:{},	//main
		r:[],	//removeList
		a:[],  //animation
	}
}

Change.send.clearEmpty = function(sa){
	if(sa.a.length === 0){ delete sa.a }
		
	if(Object.keys(sa.i).length === 0){ delete sa.i }
	if(Object.keys(sa.p).length === 0){ delete sa.p }
	if(Object.keys(sa.m).length === 0){ delete sa.m }
	if(Object.keys(sa.r).length === 0){ delete sa.r }
	
	if(Loop.frameCount % 10 !== 0 ){ //other, if nothing moves, client thinks enemy is removed
		for(var i in sa.u) if(Object.keys(sa.u[i]).length === 0) delete sa.u[i] 
	}
	if(Object.keys(sa.u).length === 0){ delete sa.u }
	
	return sa;

}

Change.send.compressXYA = function(info){
	//if only change is x,y and angle, compress it into [x,y,angle]
	if(info.x !== undefined && info.y !== undefined){ 
		if(info.angle !== undefined){
			if(Object.keys(info).length === 3){ info = [info.x,info.y,info.angle];}
			else { info.xya = [info.x,info.y,info.angle]; }
		} else {
			if(Object.keys(info).length === 2){ info = [info.x,info.y];}
			else { info.xy = [info.x,info.y]; }
		}
		
		delete info.x
		delete info.y
		delete info.angle		
	}
	return info;
}

Change.send.reset = function(){
	Anim.clearList();
	for(var i in List.all){ List.all[i].change = {}; }
	for(var i in List.main){ 
		List.main[i].change = {}; 
		List.all[i].privateChange = {}; 	
		List.all[i].removeList = [];
	}
}

//####################################
Change.send.init = function(obj){
	//convertInit: create object that has all needed information for the client to init the object. these information are only sent when init.
	if(obj.type == 'bullet'){return Change.send.init.bullet(obj)}
	if(obj.type == 'drop'){return Change.send.init.drop(obj)}
	if(obj.type == 'enemy' || obj.type == 'player'){	return Change.send.init.actor(obj)}
}

Change.send.init.bullet = function(bullet){	//For Init
	var draw = [
		'b',
		Math.round(bullet.x),
		Math.round(bullet.y),
		Math.round(bullet.moveAngle),
		bullet.sprite.name,
		bullet.sprite.sizeMod,
	];
	if(bullet.normal) draw.push(bullet.spd);
	
	return draw;
}

Change.send.init.actor = function(enemy){	//For Init
	var draw = {};
	draw.id = enemy.publicId;
	draw.xya = [Math.round(enemy.x),Math.round(enemy.y),Math.round(enemy.angle)];
	draw.sprite = {'name':enemy.sprite.name,'anim':enemy.sprite.initAnim || "walk",'sizeMod':enemy.sprite.sizeMod || 1};
	draw.hp = Math.round(enemy.hp);
	draw.resource = {'hp':{'max':Math.round(enemy.resource.hp.max)}};
	draw.maxSpd = Math.round(enemy.maxSpd);
	draw.type = enemy.type;
	draw.combat = enemy.combat;
	if(enemy.minimapIcon){ draw.minimapIcon = enemy.minimapIcon; }
	return draw;
}

Change.send.init.drop = function(drop){
	var draw = {};
	draw.x = Math.round(drop.x);
	draw.y = Math.round(drop.y);
	draw.id = drop.publicId;
	draw.type = drop.type;
	draw.item = Db.item[drop.item].icon;
	
	return draw;
}

Change.send.init.anim = function(anim){
	var t = {name:anim.name};
	if(anim.sizeMod !== 1) t.sizeMod = anim.sizeMod;
	if(typeof anim.target === 'string')
		t.target = List.all[anim.target].publicId || List.all[anim.target].id;
	else
		t.target = {x:Math.round(anim.target.x),y:Math.round(anim.target.y)}
	
	return t;
};

//########################################

Change.send.convert = {};

Change.send.convert.optionList = function(ol){
	var draw = {};
	draw.x = ol.x;
	draw.y = ol.y;
	draw.name = ol.name;
	
	draw.option = [];
	for(var i = 0; i < ol.option.length ; i++){
		var tmp = {'name':ol.option[i].name};
		if(ol.option[i].description) tmp.description = ol.option[i].description;
		if(ol.option[i].question) tmp.question = ol.option[i].question;
		draw.option.push(tmp);
	}
	return draw;
}

Change.send.convert.itemlist = function(inv){
	var draw = [];
	for(var i in inv.data){
		draw[i] = '';
		if(inv.data[i][0]){
			draw[i] = [];
			draw[i][0] = Db.item[inv.data[i][0]].icon;
			draw[i][1] = inv.data[i][1];
			draw[i][2] = Db.item[inv.data[i][0]].name;
		}
	}
	return draw;
}


Change.send.convert.windowList = function(data){
	if(data.trade)	data.trade = Change.send.convert.windowList.trade(deepClone(data.trade));
	return data;
}

Change.send.convert.windowList.trade = function(data){
	var draw = deepClone(data);
	draw.tradeList = Change.send.convert.itemlist(draw.tradeList);
	draw.trader = List.all[draw.trader].publicId;
	return draw;
}

Change.send.convert.ability = function(ab,act){
	var list = ab[act.combatContext || 'regular'];
	var tmp = [];
	for(var i in list){
		tmp[i] = list[i] ? list[i].id : 0;		
	}
	return tmp;
}
Change.send.convert.abilityList = function(ab,act){
	return ab[act.combatContext || 'regular'];
}

Change.send.convert.abilityChangeClient = function(info){
	var tmp = '';
	for(var i in info)
		tmp += info[i] === 1 ? 'R' : Math.round(info[i]*35).toString(36).slice(0,1);
	return tmp;	
}

Change.send.convert.map = function(name){
	//used for instanced. client doesnt need to know its instanced
	return List.map[name].graphic;
}


Change.send.convert.equipPiece = function(w){ 
	if(!w) return '';
	return {'icon':w.icon,id:w.id} 
}
				
Change.send.convert.equipWeapon = function(w){ 
	if(!w) return '';
	return {'type':w.type,'piece':w.piece,'icon':w.icon,id:w.id} 
}

Change.send.convert.equip = function(eq,act){
	return eq[act.combatContext || 'regular'];
}


