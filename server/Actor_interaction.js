var DIST = 150;
var TOOFAR = function(key){
	Chat.add(key,"You're too far away.");
}

Actor.teleport = function(act,spot){
	Server.log(3,act.id,'teleport',spot);
	
	act.x = spot.x;
	act.y = spot.y;
	var map = Actor.teleport.getMapName(act,spot.map);
	
	if(act.map === map){ 			//regular teleport
		Activelist.update(act);
		return; 
	}
	
	if(!List.map[map]){	//test if need to create instance
		Map.creation(Map.getModel(map),Map.getVersion(map)); 
	}
	
	Map.leave(act);
	act.map = map;
	Map.enter(act);	
			
	Activelist.update(act);

	Chat.add(act.id,"You enter " + List.map[act.map].name + '.');
}

Actor.teleport.getMapName = function(act,map){
	if(!map) return act.map;
	if(!map.have("@"))	return map + '@MAIN'; 				//main instance
	if(map.have("@@"))	return map + act.name; 				//alone instance
	if(map[map.length-1] === '@') return map + act.team;	//team instance
	return map;
}

Actor.teleport.selectInstance = function(act,eid){
	//TODO
	Actor.teleport.click(act,eid);
}

Actor.teleport.join = function(act,mort2){	//TOFIX
	if(mort2.map.have("@@")) return false;
	
	Actor.teleport(act,mort2.respawnLoc.recent);
	return true;
}


//Optionlist
Actor.click = {};
Actor.click.teleport = function(act,eid){
	var e = List.all[eid];
	var tele = e.teleport;
	if(Collision.distancePtPt(act,e) > DIST) return TOOFAR(act.id);
	tele(act.id);
}

Actor.click.dialogue = function(act,eid){
	var e = List.all[eid];
	var dia = e.dialogue;
	if(Collision.distancePtPt(act,e) > DIST) return TOOFAR(act.id);
	dia(act.id);
}

Actor.click.pushable = function(pusher,beingPushed){
	var act = List.all[beingPushed];
	if(!act.pushable) return
	
	var pusherAngle = Tk.atan2(act.y - pusher.y,act.x - pusher.x);			//only work with square block
	var fact = 360/4;
	var angle = Math.floor((pusherAngle+fact/2)/fact)*fact%360;
	
	//Test if too far
		//Block
	var blockVarX = 0;	//only supported direction =4
	var blockVarY = 0;
	if(angle === 0) blockVarX = act.block.size[0]*32;
	if(angle === 90) blockVarY = act.block.size[2]*32;
	if(angle === 180) blockVarX = act.block.size[1]*32;
	if(angle === 270) blockVarY = act.block.size[3]*32;
	
		//Player
	var pusherVarX = 0;	//only supported direction =4
	var pusherVarY = 0;
	if(angle === 0) pusherVarX = act.bumperBox[0].x;
	if(angle === 90) pusherVarY = act.bumperBox[1].y;
	if(angle === 180) pusherVarX = act.bumperBox[2].x;
	if(angle === 270) pusherVarY = act.bumperBox[3].y;
	
	var posB = {'x':act.x + blockVarX,'y':act.y+blockVarY};
	var posP = {'x':pusher.x + pusherVarX,'y':pusher.y+pusherVarY};
	
	if(Collision.distancePtPt(posB,posP) > 64) return;	//toofar
	//
	
	Actor.movePush(act,angle,act.pushable.magn,act.pushable.time);

}

Actor.click.skillPlot = function(act,eid){	
	var e = List.all[eid];
	if(!e.skillPlot) return;
	var type = e.skillPlot.type;
	if(type === 'down'){
		Chat.add(act.id,'This plot is down. Completing the quest ' + Db.quest[e.skillPlot.quest].name + ' will revive this plot.');
		return;
	}
	var plot = Db.skillPlot[type];
	
	var key = act.id;
	var main = List.main[key];
	var inv = main.invList;
	var lvl = act.skill.lvl[plot.skill];
	
	if(Collision.distancePtPt(act,e) > DIST) return TOOFAR(act.id);
	if(!Itemlist.empty(inv,1)){ Chat.add(key,"Your inventory is full."); return;}
	if(lvl < plot.lvl) {Chat.add(key,"You need at least level " + plot.lvl + ' ' + plot.skill.capitalize() + " to harvest this resource."); return;}
	if(Math.random() > plot.chance(lvl)) {Chat.add(key,"You failed to harvest this resource."); return;}
	
	var item = plot.item.random();
	Itemlist.add(inv,item,1);
	
	main.quest[e.skillPlot.quest]._skillPlot[e.skillPlot.num] = 1;
	
	Chat.add(key,"You manage to harvest this resource.");
	
	Server.log(3,key,'harvest',item);
}

Actor.click.waypoint = function(act,eid){
	var e = List.all[eid];
	if(Collision.distancePtPt(act,e) > DIST) return TOOFAR(act.id);
	
	Chat.add(act.id,"You have changed your respawn point. Upon dying, you will now be teleported here.");

	Actor.setRespawn(act,{x:e.x,y:e.y + 64,map:e.map},e.waypoint === 2);
}

Actor.click.loot = function(act,eid){	//need work
	var e = List.all[eid];
	
	if(Collision.distancePtPt(act,e) > DIST) return TOOFAR(act.id);
	if(e.quest && e.quest !== List.main[act.id].questActive) return Chat.add(act.id,"You need to start this quest via the Quest Tab before making progression in it.");
	
	if(e.loot(act.id) !== false){
		Chat.add(act.id,"Nice loot!");
	}
	Server.log(3,act.id,'openChest',eid);
}

Actor.click.toggle = function(act,eid){
	var e = List.all[eid];
	
	if(Collision.distancePtPt(act,e) > DIST) return TOOFAR(act.id);
	if(e.quest && e.quest !== List.main[act.id].questActive) return Chat.add(act.id,"You need to start this quest via the Quest Tab before making progression in it.");
	
	var sw = e.toggle;
	if(!sw) return ERROR(3,'not a toggle',e);
	
	e.toggle(act.id,e,List.map[e.map]);
	Chat.add(act.id,"You pulled the toggle.");
}

Actor.click.drop = function (act,id){
	var inv = List.main[act.id].invList;
	var drop = List.drop[id];
	if(!drop) return;
	
	if(Collision.distancePtPt(act,drop) > act.pickRadius) return TOOFAR(act.id);
	if(!Itemlist.test(inv,drop.item,drop.amount)){
		Chat.add(act.id,"Inventory full.");
		return;
	}
	
	Itemlist.add(inv,drop.item,drop.amount);
	Drop.remove(drop);	
	
	Server.log(3,act.id,'pickDrop',drop);
}

Actor.click.drop.rightClick = function(act,pt){
	var key = act.id;
	var ol = {'name':'Pick Items','option':[]};
	var list = List.map[act.map].list.drop;
	for(var i in list){
		var d = List.drop[i];
		if(Collision.distancePtPt(d,pt) < 48)
			ol.option.push({'name':'Pick ' + Db.item[d.item].name,'func':'Actor.click.drop','param':[i]});
	}
	
	Button.creation.optionList(key,ol);  
}

Actor.click.player = function(act,eid){
	Main.openWindow(act.id,'trade',eid);
}
//

Actor.removeOption = function(act,option){	//option is object or name
	for(var i in act.optionList.option){
		if(act.optionList.option[i] === option || act.optionList.option[i].name === option){
			act.optionList.option.splice(i,1);
			return;
		}
	}
}	

Actor.setRespawn = function(act,spot,safe){
	act.respawnLoc.recent = Tk.deepClone(spot);	//spot.map can have no @ cuz use Actor.teleport
	if(spot.map.have("@MAIN") || safe)
		act.respawnLoc.safe = Tk.deepClone(spot);
}

Actor.movePush = function(act,angle,magn,time){	//TOFIX find better name
	if(act.timeout.push) return;	//only 1 push at a time
	
	act.friction = 1;
	act.spdX = magn*Tk.cos(angle);
	act.spdY = magn*Tk.sin(angle);
	
	Actor.setTimeout(act,'push',time,function(eid){
		List.all[eid].spdX = 0;
		List.all[eid].spdY = 0;
		List.all[eid].friction = 0.9;
	});
}




















