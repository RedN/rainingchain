//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Tk','Quest','Server','Main','Activelist','Itemlist','Map','Chat','Drop','Skill','Collision','Button']));
var DIST = 150;
var TOOFAR = function(key){
	Chat.add(key,"You're too far away.");
}

var TESTDISTANCE = function(act,e){	//return false = good distance
	if(Date.now()-act.lastInteraction < 500) return true;
	act.lastInteraction = Date.now();
	
	if(Collision.distancePtPt(act,e) < DIST/2) return false;
	
	if(Collision.distancePtPt(act,e) > DIST || Collision.ptPtWallCollision(act.map,act,e)){
		TOOFAR(act.id);
		return true;
	}
	
	return false;
}

Actor.teleport = function(act,spot,dontconvertmap){
	Server.log(3,act.id,'teleport',spot);
	
	act.x = spot.x;
	act.y = spot.y;
	var map = dontconvertmap ? spot.map : Actor.teleport.getMapName(act,spot.map);	//allow admin to go in solo instance
	
	if(act.map === map){ 			//regular teleport
		Activelist.update(act);
		return; 
	}
	try {
		if(!List.map[map]){	//test if need to create instance
			Map.creation(Map.getModel(map),Map.getVersion(map),act.id); 
		}
	} catch(err){  ERROR.err(3,err);}
	
	try { Map.leave(act); } catch(err){  ERROR.err(3,err);}
	act.map = map;
	try { Map.enter(act); } catch(err){  ERROR.err(3,err);}
			
	try {  Activelist.update(act); } catch(err){  ERROR.err(3,err);}
	
	//Chat.add(act.id,"You enter " + List.map[act.map].name + '.');
}

Actor.teleport.getMapName = function(act,map){
	if(!map) return act.map;
	if(!map.have("@"))	return map + '@MAIN'; 				//main instance
	if(map.have("@@"))	return map + act.username; 				//alone instance
	if(map[map.length-1] === '@') return map + act.party;	//party instance
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

Actor.teleport.town = function(act,respawntoo){
	if(!List.main[act.id].quest.Qtutorial._complete) return Chat.add(act.id,'You need to complete the tutorial to do that.');
	Actor.teleport(act,{x:40*32,y:70*32,map:'QfirstTown-main'});
	if(respawntoo) Actor.setRespawn.town(act);
	return true;
}


//Optionlist
Actor.click = {};
Actor.click.teleport = function(act,eid){
	var e = List.all[eid];
	
	if(TESTDISTANCE(act,e)) return;
	e.teleport(act.id);
}

Actor.click.dialogue = function(act,eid){
	var e = List.all[eid];
	var dia = e.dialogue;
	if(TESTDISTANCE(act,e)) return;
	dia(act.id);
}

Actor.click.pushable = function(pusher,beingPushed){
	var act = List.all[beingPushed];
	if(!act.pushable) return ERROR(3,'no pushable');
	if(act.timeout.movePush) return;	//BAD
	
	var pusherAngle = Tk.atan2(act.y - pusher.y,act.x - pusher.x);			//only work with square block
	var fact = 360/4;
	var angle = Math.floor((pusherAngle+fact/2)/fact)*fact%360;
	
	Math.floor((pusherAngle+90/2)/90)*90%360
	
	if(Math.abs(pusherAngle-angle) > 30) return;
	
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
	
	if(Collision.distancePtPt(posB,posP) > 64)	return TOOFAR(pusher.id);	//toofar
	
	
	
	//Check if destination is wall
	var map = pusher.map;
	
	var x = Math.floor((act.x + Tk.cos(angle)*act.pushable.magn*act.pushable.time - 1)/32);	//-1 so sure not on edge
	var y = Math.floor((act.y + Tk.sin(angle)*act.pushable.magn*act.pushable.time - 1)/32);
	
	if(Collision.actorMap.fast(x,y,map,act)) return;
	if(Collision.actorMap.fast(x+1,y,map,act)) return;
	if(Collision.actorMap.fast(x,y+1,map,act)) return;
	if(Collision.actorMap.fast(x+1,y+1,map,act)) return;
		
	if(Actor.initPushable(act,angle) !== false){	//if no being in movement already, prevent spam click
		Actor.stickToGrid(act);
		if(act.pushable.event)
			act.pushable.event(pusher.id,act.id);
	}
}

Actor.click.skillPlot = function(act,eid){	
	var e = List.all[eid];
	if(!e.skillPlot) return ERROR(3,'not skillplot');
	var quest = e.skillPlot.quest;
	if(e.skillPlot.type === 'down')	return Chat.add(act.id,'This plot is down. You need to complete the quest ' + Db.quest[quest].name.q() + ' to harvest this plot again.');
	
	var plot = Db.skillPlot[e.skillPlot.type];
	var key = act.id;
	var inv = List.main[key].invList;
	var lvl = act.skill.lvl[plot.skill];
	
	if(Collision.distancePtPt(act,e) > DIST) return;	//cant use TESTDIST cuz if tree in wall, cant click..
	if(+List.main[key].quest[quest]._skillPlot[e.skillPlot.num]) return;
	if(!Itemlist.empty(inv,1)) return Chat.add(key,"Your inventory is full.");
	if(lvl < plot.lvl) return Chat.add(key,"You need at least level " + plot.lvl + ' ' + plot.skill.capitalize() + " to harvest this resource.");
	
	List.main[key].quest[quest]._skillPlot[e.skillPlot.num] = 1;
	if(!plot.getSuccess(lvl)) return Chat.add(key,"You failed to harvest this resource."); 

	var item = plot.item.random();
	var bonus = Quest.getBonus(key,quest);
	var amount = Math.roundRandom(bonus.item);
	if(amount === 0)
		Chat.add(key,'You harvested the plot but there was no enough resource for a whole item.');
	else {
		Itemlist.add(inv,item,amount);
		Chat.add(key,"You harvested the item: " + Db.item[item].name + '.');
	}
	if(quest !== 'Qtutorial') Chat.add(key,Db.quest[quest].name.q() + ' Quest Modifier: x' + bonus.item.r(2) + ' Item, x' + bonus.exp.r(2) + ' Exp'); 
	Skill.addExp(key,plot.skill,plot.exp*bonus.exp);
	Server.log(3,key,'harvest',item);
}

Actor.click.waypoint = function(act,eid){
	var e = List.all[eid];
	if(TESTDISTANCE(act,e)) return;
	
	Chat.add(act.id,"You have changed your respawn point. Upon dying, you will now be teleported here.");

	Actor.setRespawn(act,{x:e.x,y:e.y + 64,map:e.map},e.waypoint === 2);
}

Actor.click.loot = function(act,eid){	//need work
	var e = List.all[eid];
	
	if(TESTDISTANCE(act,e)) return;
	if(e.quest && e.quest !== List.main[act.id].questActive) return Chat.add(act.id,"You need to start this quest via the Quest Tab before making progression in it.");
	
	if(e.viewedIf(act.id)) e.loot(act.id,e);
	if(!e.viewedIf(act.id)){
		Chat.add(act.id,"Nice loot!");
		act.removeList[eid] = 1;
	}
	Server.log(3,act.id,'openChest',eid);
}

Actor.click.toggle = function(act,eid){
	var e = List.all[eid];
	
	if(TESTDISTANCE(act,e)) return;
	if(e.quest && e.quest !== List.main[act.id].questActive) return Chat.add(act.id,"You need to start this quest via the Quest Tab before making progression in it.");
	
	var sw = e.toggle;
	if(!sw) return ERROR(3,'not a toggle',e);
	
	if(e.viewedIf(act.id)) e.toggle(act.id,e,List.map[e.map]);
	Chat.add(act.id,"You interacted with the object.");
	act.removeList[eid] = 1;
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
			ol.option.push({'name':'Pick ' + Db.item[d.item].name,'func':Actor.click.drop,'param':['$actor',i]});
	}
	
	Button.creation.optionList(key,ol);  
}


Actor.click.bank = function(act,eid){
	var e = List.all[eid];
	if(!e.bank) return ERROR(4,'not a bank');
	if(TESTDISTANCE(act,e)) return;
	Main.openWindow(List.main[act.id],'bank');
}

Actor.click.signpost = function(act,eid){
	var e = List.all[eid];
	if(!e.signpost) return ERROR(4,'not a signpost');
	if(TESTDISTANCE(act,e)) return;
	
	if(typeof e.signpost === 'string')	return Chat.add(act.id,e.signpost);
	else e.signpost(act.id,eid);
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
	safe = safe !== false && (spot.map.have("@MAIN") || safe);
	spot.map = Map.getModel(spot.map) + Map.getInstanceType(spot.map);
	if(safe)
		act.respawnLoc.safe = Tk.deepClone(spot);
}

Actor.setRespawn.town = function(act){
	Actor.setRespawn(act,{x:40*32,y:70*32,map:'QfirstTown-main@MAIN'},true);
}

Actor.movePush = function(act,angle,magn,time){	//push that isnt pushable, ex: player fall
	if(act.timeout.movePush) return false;	//only 1 push at a time
	act.friction = 1;
	act.spdX = magn*Tk.cos(angle);
	act.spdY = magn*Tk.sin(angle);
	
	
	Actor.setTimeout(act,'movePush',time,function(eid){
		List.all[eid].spdX = 0;
		List.all[eid].spdY = 0;
		List.all[eid].friction = CST.FRICTION;
	});
}

Actor.initPushable = function(act,angle){	//TOFIX find better name
	if(act.pushable.timer >= 0) return false;	//only 1 push at a time
	
	act.pushable.angle = angle;
	act.pushable.timer = act.pushable.time;
}

Actor.stickToGrid = function(act){
	act.x = Math.round(act.x/16)*16-1; 
	act.y = Math.round(act.y/16)*16-1; 
}

Actor.click.trade = function(act,eid){
	var asker = List.main[act.id];
	var asked = List.main[eid];
	
	if(!List.all[eid] || List.all[eid].combat) return;
	if(act.combat) return;
	
	if(Main.isWindowOpen(asker)) return;
	if(Main.isWindowOpen(asked) || asked.social.list.mute[asker.username]) return Chat.add(act.id,'This player is busy.');
	
	Main.openWindow(asker,'trade',asked.name);
	asker.tradeInfo = asked.tradeList;
	
	Main.openWindow(asked,'trade',asker.name);
	asked.tradeInfo = asker.tradeList;
	
	Itemlist.trade.reset(asked.tradeList);
	Itemlist.trade.reset(asker.tradeList);
}
























