//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Tk','Server','Change','Anim'],['Change']));
var BISON = require('./client/js/shared/BISON');

var Change = exports.Change = {};

var COUNT = 0;
//send 31k string = 2 ms, send small = 0.02 ms
Change.send = function(){
	//Send what has changed to the client.for (var key in List.socket){
	for(var key in List.socket){
		var socket = List.socket[key];
		if(!socket.clientReady) continue;
		if(key === Server.botwatch.watcher) continue;
		var sa = {};	// {u:{},i:{}};	//Change.send.template();
		
		//Update Private Player
		var player = List.all[key];
		if(!player.privateChange.$empty()){
			sa.p = player.privateChange;
			sa.p = Change.send.compressXYA(sa.p);
		}
		
		
		if(sa.u && sa.u.$empty()) delete sa.u;
		
		//Remove List
		if(!player.removeList.$empty()) sa.r = player.removeList;
		
		//Main
		if(!List.main[key].change.$empty()) sa.m = List.main[key].change;
		
		
		
		//Send
		if(BISON.active) sa = BISON.encode(sa);
		socket.emit('change', sa );
		
		if(key === Server.botwatch.watched){
			if(List.socket[Server.botwatch.watcher])
				List.socket[Server.botwatch.watcher].emit('change', sa );
			else {
				Server.botwatch.watcher = null;
				Server.botwatch.watched = null;
			}
		} 
		
		if(Loop.interval(10)) Performance.bandwidth('upload',sa,socket,10);
	}
	
	Change.send.reset();

}

Change.send.template = function(){
	return {
		u:{},  //update (already init-ed)
		p:{},	//player
		m:{},	//main
		i:{},  //init (first time seen by player		
		r:{},	//removeList	
		a:[],  //animation
	}
}

Change.send.compressXYA = function(info){
	//if only change is x,y and angle, compress it into [x,y,angle]
	if(info.x !== undefined && info.y !== undefined){ 
		if(info.a !== undefined){
			if(Object.keys(info).length === 3){ info = [info.x,info.y,info.a];}
			else { info.xya = [info.x,info.y,info.a]; }
		} else {
			if(Object.keys(info).length === 2){ info = [info.x,info.y];}
			else { info.xy = [info.x,info.y]; }
		}
		
		delete info.x;
		delete info.y;
		delete info.a;	
	}
	return info;
}

Change.send.reset = function(){
	Anim.removeAll();
	for(var i in List.all){ List.all[i].change = {}; }
	for(var i in List.main){ 
		List.main[i].change = {}; 
		List.all[i].privateChange = {}; 	
		List.all[i].removeList = {};
	}
}

//####################################
Change.send.init = function(obj){ //create object that has all info for the client to init the object
	if(obj.type == 'bullet') return Change.send.init.bullet(obj);
	else if(obj.type == 'strike') return Change.send.init.strike(obj);
	else if(obj.type == 'drop') return Change.send.init.drop(obj);
	else if(obj.type == 'npc' || obj.type == 'player')	return Change.send.init.actor(obj);
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

Change.send.init.strike = function(s){
	var p = s.point;
	var r = Math.round;
	
	return [
		's',
		s.delay,
		r(p[2].x),r(p[2].y),
		r(p[8].x),r(p[8].y),
		r(p[6].x),r(p[6].y),
	];
}

Change.send.init.actor = function(act){	//For Init
	return [
		act.type,	//npc or player
		Math.round(act.x),
		Math.round(act.y),
		Math.round(act.angle),
		act.sprite.name,
		act.sprite.sizeMod || 1,		//5
		Math.round(act.maxSpd),
		act.context,					
		+!!act.optionList,
		act.minimapIcon||'',
		Math.round(act.hp),				//10
		Math.round(act.resource.hp.max),
		act.weakness.resist||'',
		act.weakness.weak||'',
		act.modList
	];
	
	
	
	
}

Change.send.init.drop = function(drop){
	var draw = {};
	draw.x = Math.round(drop.x);
	draw.y = Math.round(drop.y);
	draw.id = drop.publicId;
	draw.type = drop.type;
	draw.item = Db.item[drop.item].icon;
	draw.context = Db.item[drop.item].name;
	
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
	if(!ol) return '';
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

Change.send.convert.itemlist = function(inv,other){
	var draw = [];
	for(var i in inv.data){
		draw[i] = '';
		if(inv.data[i][0]){
			draw[i] = [];
			draw[i][0] = Db.item[inv.data[i][0]].icon;
			draw[i][1] = inv.data[i][1];
		}
	}
	inv[other ? 'toUpdateOther' : 'toUpdate'] = 0;
	
	return {
		data:draw,
		acceptTrade:inv.acceptTrade,
	};
}



Change.send.convert.windowList = function(data){
	return data;
}

Change.send.convert.ability = function(ab,act){
	var list = ab[act.combatContext.ability || 'normal'];
	var tmp = [];
	for(var i in list){
		tmp[i] = list[i] ? list[i].id : 0;		
	}
	return tmp;
}

Change.send.convert.abilityList = function(ab,act){
	return ab[act.combatContext.ability || 'normal'];
}



Change.send.convert.map = function(name){
	//used for instanced. client doesnt need to know its instanced
	return Map.getModel(name);	//List.map[name].graphic;
}

Change.send.convert.equip = function(eq,act){
	return eq[act.combatContext.equip || 'normal'];
}


Change.send.convert.resource = function(w){
	for(var i in w)
		for(var j in w[i])
			w[i][j] = Math.round(w[i][j]); 
	return w;				
}


Change.send.convert.party = function(party){
	var t = Tk.deepClone(List.party[party]);	
	return t;	
}



























