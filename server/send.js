Change = {};

//Send what has changed to the client.
Change.send = function(){
	for (var key in List.socket){
		var sa = {};
	
		sa.i = {'f':{},'p':{},'m':{}};  //init (first time seen by player)
		sa.u = {'f':{},'p':{},'m':{},'r':{}};  //update (already init-ed)
		sa.a = [];  //animation
		
		//Update Private Player
		var player = List.all[key];
		sa.u.p = player.privateChange;
		sa.u.p = Change.send.compressXYA(sa.u.p);
		
		
		
		//Update ActiveList AKA List.all
		var array = [];
		for (var i in player.activeList){
			var bool = true;	var obj = List.all[i];
			
			if(!obj){ delete player.activeList[i]; continue; }
			
			for(var j in obj.viewedBy){	if(obj.viewedBy[j].id === player.id){bool = false;}}
				
			if(bool){		//Need to Init
				var id = obj.id;
				if(obj.publicId){ id = obj.publicId;}
				sa.i.f[id] = Change.send.init(obj);
				obj.viewedBy[key] = player;		//Add so the next time it will update instead of init
			} else {			//Only Update
				var id = obj.id;
				if(obj.publicId){ id = obj.publicId;}
				sa.u.f[id] = obj.change;
				sa.u.f[id] = Change.send.compressXYA(sa.u.f[id]);
			}
			
		}
		sa.u.r = player.removeList;
		
		//Main
		sa.u.m = List.main[key].change;
		
		//Anim
		//note: remove map and viewedif from .target and slot?
		for(var i in List.anim){
			var testTarget = List.anim[i].target;
			if(typeof testTarget !== 'object'){ testTarget = List.all[testTarget]; }
			
			if(testTarget && ActiveList.test(player,testTarget))	{
				if(typeof List.anim[i].target !== 'object'){ List.anim[i].target = List.all[List.anim[i].target].publicId; }
				sa.a.push(List.anim[i]); 
			}	
		}
		
		
		//Delete things that are empty
		if(Object.keys(sa.i.f).length === 0){ delete sa.i.f }
		if(Object.keys(sa.i.p).length === 0){ delete sa.i.p }
		if(Object.keys(sa.i.m).length === 0){ delete sa.i.m }
		if(Object.keys(sa.i).length === 0){ delete sa.i }
		
		if(typeof sa.u.f === 'object' && Object.keys(sa.u.f).length === 0){ delete sa.u.f }
		if(typeof sa.u.p === 'object' && Object.keys(sa.u.p).length === 0){ delete sa.u.p }
		if(typeof sa.u.m === 'object' && Object.keys(sa.u.m).length === 0){ delete sa.u.m }
		if(typeof sa.u.r === 'object' && Object.keys(sa.u.r).length === 0){ delete sa.u.r }
		
		if(sa.a.length === 0){ delete sa.a }
		if(Object.keys(sa.u).length === 0){ delete sa.u }
		if(Object.keys(sa).length === 0){ continue; }
		//Send
		List.socket[key].emit('change', sa );
	    
	    Test.bandwidth('upload',sa);
	}
	
	Change.send.reset();

}

//if only change is x,y and angle, compress it into [x,y,angle]
Change.send.compressXYA = function(info){
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
	List.anim = {};
	for(var i in List.all){ List.all[i].change = {}; }
	for(var i in List.main){ List.main[i].change = {}; List.all[i].privateChange = {}; List.all[i].removeList = {};}
}


//####################################

//convertInit: create object that has all needed information for the client to init the object. these information are only sent when init.
Change.send.init = function(obj){
	if(obj.type == 'bullet'){return Change.send.init.bullet(obj)}
	if(obj.type == 'drop'){return Change.send.init.drop(obj)}
	if(obj.type == 'enemy' || obj.type == 'player'){	return Change.send.init.mortal(obj)}
}

Change.send.init.bullet = function(bullet){	//For Init
	var draw = {};
	draw.id = bullet.id;
	draw.xya = [Math.round(bullet.x),Math.round(bullet.y),Math.round(bullet.angle)];
	draw.type = 'bullet';
	draw.sprite = {'name':bullet.sprite.name,'anim':bullet.sprite.anim || 'Walk','sizeMod':bullet.sprite.sizeMod || 1};
	return draw;
}

Change.send.init.mortal = function(enemy){	//For Init
	var draw = {};
	draw.id = enemy.publicId;
	draw.xya = [Math.round(enemy.x),Math.round(enemy.y),Math.round(enemy.angle)];
	draw.sprite = {'name':enemy.sprite.name,'anim':enemy.sprite.anim || 'Walk','sizeMod':enemy.sprite.sizeMod || 1};
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
	draw.item = Db.item[drop.item].visual;
	
	return draw;
}

//########################################

Change.send.convert = {};

Change.send.convert.optionList = function(option){
	var draw = {};
	draw.x = option.x;
	draw.y = option.y;
	draw.name = option.name;
	
	draw.option = [];
	for(var i = 0; i < option.option.length ; i++){
		draw.option.push({'name':option.option[i].name});
	}
	return draw;
}

Change.send.convert.itemlist = function(inv){
	var draw = [];
	for(var i in inv.data){
		draw[i] = '';
		if(inv.data[i][0]){
			draw[i] = [];
			draw[i][0] = Db.item[inv.data[i][0]].visual;
			draw[i][1] = inv.data[i][1];
			draw[i][2] = Db.item[inv.data[i][0]].name;
		}
	}
	return draw;
}



Change.send.convert.tradeWindow = function(data){
	var draw = deepClone(data);
	draw.tradeList = Change.send.convert.itemlist(draw.tradeList);
	draw.trader = List.all[draw.trader].publicId;
	return draw;
}

Change.send.convert.abilityList = function(list){
	var copy = deepClone(list);
	for(var i in copy){
		var ab = copy[i];
		if(ab && ab.action && ab.action[0].func == 'Combat.action.attack'){
			ab.action[0].param.attack[0] = list[i].action[0].param.attack[0]();
		}
	}
	return copy;
}

//used for instanced. client doesnt need to know its instanced
Change.send.convert.map = function(name){
	return Map.convertId[name];
}







