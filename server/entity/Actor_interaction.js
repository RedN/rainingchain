Actor.teleport = function(act,x,y,mapName){
	if(typeof x === 'object'){ Actor.teleport(act,x.x,x.y,x.map); return; }
	act = typeof act === 'string' ? List.all[act] : act;
	LOG(2,act.id,'teleport',x,y,mapName);
	//Teleport player. if no map specified, stay in same map.
	act.x = x;
	act.y = y;
	mapName = mapName || act.map;
	
	var map = Actor.teleport.getMapName(act,mapName);
	
	if(act.map === map){ 			//regular teleport
		Activelist.remove(act);
		return; 
	}
	
	if(!List.map[map]){	//test if need to create instance
		Map.creation(Map.getModel(map),Map.getVersion(map)); 
	}
	
	Map.leave(act);
	act.map = map;
	Map.enter(act);	
			
	Activelist.remove(act);

	Chat.add(act.id,"You enter " + List.map[act.map].name + '.');
}

Actor.teleport.getMapName = function(act,map){
	if(!map.have("@"))	return map + '@MAIN'; 				//main instance
	if(map.have("@@"))	return map + act.name; 				//alone instance
	if(map[map.length-1] === '@') return map + act.team;	//team instance
	return map;
}

Actor.teleport.selectInstance = function(act,eid){
	//TODO
	Actor.teleport.click(act,eid);
}

Actor.teleport.join = function(act,mort2){
	if(mort2.map.have("@@")) return false;
	
	Actor.teleport(act,mort2.respawnLoc.recent);
	return true;
}


//Optionlist
Actor.click = {};
Actor.click.teleport = function(act,eid){
	var e = List.all[eid];
	var tele = e.teleport;
	if(Collision.distancePtPt(act,e) > 150){ Chat.add(act.id,"You're too far."); return; }
	tele(act.id);

}

Actor.click.dialogue = function(act,eid){
	var e = List.all[eid];
	var dia = e.dialogue;
	if(Collision.distancePtPt(act,e) > 150){ Chat.add(act.id,"You're too far."); return; }
	dia(act.id);
}

Actor.click.block = function(pusher,beingPushed){
	var act = List.all[beingPushed];
	if(!act.block || !act.block.pushable) return
	
	var pusherAngle = atan2(act.y - pusher.y,act.x - pusher.x);			//only work with square block
	var fact = 360/4;
	var angle = Math.floor((pusherAngle+fact/2)/fact)*fact%360;
	
	//Test if too far
		//Block
	var blockVarX = 0;	//only supported direction =4
	var blockVarY = 0;
	if(angle === 0) blockVarX = act.block.size[0];
	if(angle === 90) blockVarY = act.block.size[2];
	if(angle === 180) blockVarX = act.block.size[1];
	if(angle === 270) blockVarY = act.block.size[3];
	
	blockVarX *= 32;
	blockVarY *= 32;
	
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
	
	act.pushed.time = act.block.time;
	act.pushed.magn = act.block.magn;
	act.pushed.angle = angle;
	
}

Actor.click.skillPlot = function(act,eid){	
	var e = List.all[eid];
	if(!e.skillPlot){ DEBUG(2,'trying to harvest not harvestable',eid); return; }
	var type = e.skillPlot.type;
	if(type === 'down'){
		Chat.add(act.id,'This plot is down. Completing the quest ' + Db.quest[e.skillPlot.quest].name + ' will revive this plot.');
		return;
	}
	var plot = Db.skillPlot[type];
	
	var key = act.id;
	var main = List.main[key]
	var inv = main.invList;
	var lvl = act.skill.lvl[plot.skill];
	
	if(Collision.distancePtPt(act,e) > 150){ Chat.add(key,"You're too far away."); return;}
	if(!Itemlist.empty(inv,1)){ Chat.add(key,"Your inventory is full."); return;}
	if(lvl < plot.lvl) {Chat.add(key,"You need at least level " + plot.lvl + ' ' + plot.skill.capitalize() + " to harvest this resource."); return;}
	if(Math.random() > plot.chance(lvl)) {Chat.add(key,"You failed to harvest this resource."); return;}
	
	var item = plot.item.random();
	Itemlist.add(inv,item,1);
	
	main.quest[e.skillPlot.quest].skillPlot[e.skillPlot.num] = 1;
	
	Chat.add(key,"You manage to harvest this resource.");
	
	LOG(2,key,'harvest',item);
}

Actor.click.waypoint = function(act,eid){
	var e = List.all[eid];
	var wp = e.waypoint;
	if(Collision.distancePtPt(act,e) > 150){ Chat.add(act.id,"You're too far."); return; }
	
	Chat.add(act.id,"You have changed your respawn point. Upon dying, you will now be teleported here.");

	act.respawnLoc.recent = {x:wp.x,y:wp.y + 64,map:wp.map};
	if(wp.map.have('@MAIN')) act.respawnLoc.safe = {x:wp.x,y:wp.y + 64,map:wp.map};
}

Actor.click.chest = function(act,eid){	//need work
	var e = List.all[eid];
	
	if(Collision.distancePtPt(act,e) > 100){ Chat.add(act.id,"You're too far away."); return;}
	
	if(!e.chest) return;
	if(e.chest.list.have(act.id)){
		Chat.add(act.id,"You have already opened that chest.");
		return;
	}
	Chat.add(act.id,"You opened the chest.");
		
	if(e.chest.func(act.id) !== false){
		Sprite.change(e,{'initAnim':'on'});
		e.chest.list.push(act.id);
	};
	LOG(2,act.id,'openChest',eid);
}

Actor.click.switch = function(act,eid){
	var e = List.all[eid];
	
	if(Collision.distancePtPt(act,e) > 100){ Chat.add(act.id,"You're too far away."); return;}
	
	var sw = e.switch;
	if(!sw) return;
	var oldstate = sw.state;
	sw.state = sw.state === 'off' ? 'on' : 'off';
	
	if(sw[sw.state]) sw[sw.state](act.id);
	
	Sprite.change(e,{'initAnim':sw.state});
	Chat.add(act.id,"You turned the switch " + sw.state + '.');
		
	if(!sw[oldstate]){
		Actor.removeOption(e,'Pull Switch');
	}


}

Actor.click.drop = function (act,id){
	var inv = List.main[act.id].invList;
	var drop = List.drop[id];
		
	if(!drop) return;
	
	if(!Collision.distancePtPt(act,drop) > act.pickRadius){
		Chat.add(act.id,"You're too far away.");
		return;
	}

	if(!Itemlist.test(inv,[[List.drop[id].item,List.drop[id].amount]])){
		Chat.add(act.id,"Inventory full.");
		return;
	}
	
	Itemlist.add(inv,drop.item,drop.amount);
	Drop.remove(drop);		
	
	
	LOG(1,act.id,'pickDrop',drop);
}

Actor.click.drop.right = function(act,rect){
	var key = act.id;
	var ol = {'name':'Pick Items','option':[]};
	for(var i in List.drop){
		var d = List.drop[i];
		if(d.map == List.all[key].map && Collision.RectRect(rect,[d.x,d.x+32,d.y,d.y+32]) ){
			ol.option.push({'name':'Pick ' + Db.item[List.drop[i].item].name,'func':'Actor.click.drop','param':[i]});
		}
	}
	
	if(ol.option)	Button.optionList(key,ol);  
}


Actor.click.player = function(act,eid){
	Main.openWindow(act.id,'trade',eid);
}
//

Actor.removeOnClick = function(act,side){
	for(var i in act.optionList.option){
		if(act.optionList.option[i] === act.onclick[side]){
			act.optionList.option.splice(i,1);
			delete act.onclick[side];
			return;
		}
	}
}	

Actor.removeOption = function(act,option){	//option is object or name
	for(var i in act.optionList.option){
		if(act.optionList.option[i] === option || act.optionList.option[i].name === option){
			act.optionList.option.splice(i,1);
			return;
		}
	}
}	


























