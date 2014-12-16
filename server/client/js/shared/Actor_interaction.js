//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['SkillPlotModel','Actor','Quest','Server','ItemModel','Main','ActiveList','ItemList','Map','Message','Drop','Collision','OptionList','Button','OptionList']));

(function(){ //}

var DIST = 200;
var TOOFAR = function(key){
	Message.add(key,"You're too far away.");
}

var TESTDISTANCE = function(act,e){	//return false = good distance
	if(Date.now()-act.lastInteraction < 500) return true;
	act.lastInteraction = Date.now();
	
	if(Collision.getDistancePtPt(act,e) < DIST/2) return false;
	
	if(Collision.getDistancePtPt(act,e) > DIST || Collision.testLineMap(act.map,act,e)){
		TOOFAR(act.id);
		return true;
	}
	
	return false;
}



//Optionlist
Actor.click = {};

Actor.click.optionList = function(act,eid,slot){
	var e = Actor.get(eid);
	if(!e || !e.optionList) return;
	var option = e.optionList.option[slot];
	if(!option) return;
	if(act.activeList[eid] === undefined) return;
	OptionList.executeOption(Actor.getMain(act),option);
}



Actor.click.teleport = function(act,eid){
	var e = Actor.get(eid);
	
	if(TESTDISTANCE(act,e)) return;
	e.teleport(act.id);
}

Actor.click.dialogue = function(act,eid){
	var e = Actor.get(eid);
	var dia = e.dialogue;
	if(TESTDISTANCE(act,e)) return;
	dia(act.id);
}

Actor.click.pushable = function(pusher,beingPushed){
	var act = Actor.get(beingPushed);
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
	if(angle === 0) blockVarX = act.block.size.right*32;
	if(angle === 90) blockVarY = act.block.size.left*32;
	if(angle === 180) blockVarX = act.block.size.down*32;
	if(angle === 270) blockVarY = act.block.size.up*32;
	
		//Player
	var pusherVarX = 0;	//only supported direction =4
	var pusherVarY = 0;
	if(angle === 0) pusherVarX = act.sprite.bumperBox.right.x;
	if(angle === 90) pusherVarY = act.sprite.bumperBox.down.y;
	if(angle === 180) pusherVarX = act.sprite.bumperBox.left.x;
	if(angle === 270) pusherVarY = act.sprite.bumperBox.up.y;
	
	var posB = {'x':act.x + blockVarX,'y':act.y+blockVarY};
	var posP = {'x':pusher.x + pusherVarX,'y':pusher.y+pusherVarY};
	
	if(Collision.getDistancePtPt(posB,posP) > 64)	return TOOFAR(pusher.id);	//toofar
	
	
	
	//Check if destination is wall
	var map = pusher.map;
	
	var x = Math.floor((act.x + Tk.cos(angle)*act.pushable.magn*act.pushable.time - 1)/32);	//-1 so sure not on edge
	var y = Math.floor((act.y + Tk.sin(angle)*act.pushable.magn*act.pushable.time - 1)/32);
	
	if(Collision.actorMap(x,y,map,act)) return;
	if(Collision.actorMap(x+1,y,map,act)) return;
	if(Collision.actorMap(x,y+1,map,act)) return;
	if(Collision.actorMap(x+1,y+1,map,act)) return;
		
	if(Actor.initPushable(act,angle) !== false){	//if no being in movement already, prevent spam click
		Actor.stickToGrid(act);
		if(act.pushable.event)
			act.pushable.event(pusher.id,act.id);
	}
}

Actor.click.skillPlot = function(act,eid){	
	var e = Actor.get(eid);
	if(!e.skillPlot) return ERROR(3,'not skillplot');
	var quest = e.skillPlot.quest;
	if(e.skillPlot.type === 'down')	return Message.add(act.id,'This plot is down. You need to complete the quest ' + Quest.get(quest).name.q() + ' to harvest this plot again.');
	
	var plot = SkillPlotModel.get(e.skillPlot.type);
	var key = act.id;
	var main = Main.get(key);
	
	if(Collision.getDistancePtPt(act,e) > DIST) return;	//cant use TESTDIST cuz if tree in wall, cant click..
	if(+main.quest[quest]._skillPlot[e.skillPlot.num]) return;
	
	main.quest[quest]._skillPlot[e.skillPlot.num] = 1;
	
	var item = plot.item.random();
	
	var amount = 1;
	var exp = plot.exp;
	if(plot.useQuestBonus){
		var bonus = Main.getSimpleQuestBonus(main,quest);
		amount = Math.roundRandom(bonus.item);
		Message.add(key,Quest.get(quest).name.q() + ' Quest Modifier: x' + bonus.item.r(2) + ' Item, x' + bonus.exp.r(2) + ' Exp');
		exp *= bonus.exp;
	} 
	if(amount === 0)
		Message.add(key,'You harvested the plot but there was no enough resource for a whole item.');
	else {
		Main.addItem(main,item,amount);
		Message.add(key,"You harvested the item: " + ItemModel.get(item).name + '.');
	}
	Actor.addExp(act,exp);
	Server.log(3,key,'harvest',item);
}

Actor.click.waypoint = function(act,eid){
	var e = Actor.get(eid);
	if(TESTDISTANCE(act,e)) return;
	
	Message.add(act.id,"You have changed your respawn point. Upon dying, you will now be teleported here.");

	Actor.setRespawn(act,Actor.Spot(e.x,e.y + 64,e.map),e.waypoint === 2);
}

Actor.click.loot = function(act,eid){	//need work
	var e = Actor.get(eid);
	
	if(TESTDISTANCE(act,e)) return;
	if(e.quest && e.quest !== Actor.getMain(act).questActive) return Message.add(act.id,"You need to start this quest via the Quest Tab before making progression in it.");
	
	if(e.viewedIf(act.id)) e.loot(act.id,eid);
	if(!e.viewedIf(act.id)){
		Message.add(act.id,"Nice loot!");
		act.removeList[eid] = 1;
	}
	Server.log(3,act.id,'openChest',eid);
}

Actor.click.toggle = function(act,eid){
	var e = Actor.get(eid);
	
	if(TESTDISTANCE(act,e)) return;
	if(e.quest && e.quest !== Actor.getMain(act).questActive) return Message.add(act.id,"You need to start this quest via the Quest Tab before making progression in it.");
	
	var sw = e.toggle;
	if(!sw) return ERROR(3,'not a toggle',e.name);
	
	if(e.viewedIf(act.id)){
		var showMessage = e.toggle(act.id,eid);
		if(showMessage !== false)
			Message.add(act.id,"You interacted with the object.");
	} else
		act.removeList[eid] = 1;
}

Actor.click.drop = function (act,id){
	var main = Actor.getMain(act);
	var drop = Drop.get(id);
	if(!drop) return;
	
	if(Collision.getDistancePtPt(act,drop) > act.pickRadius) return TOOFAR(act.id);
		
	Main.addItem(main,drop.item,drop.amount);
	Drop.remove(drop);	
	
	Server.log(3,act.id,'pickDrop',drop);
}

Actor.click.drop.rightClick = function(act,pt){
	var key = act.id;
	var option = [];
	var list = Map.get(act.map).list.drop;
	for(var i in list){
		var d = Drop.get(i);
		if(Collision.getDistancePtPt(d,pt) < 48)
			option.push(OptionList.Option(Actor.click.drop,[OptionList.ACTOR,i],'Pick ' + ItemModel.get(d.item).name));
	}
	
	//Main.setOptionList(Actor.getMain(act),OptionList('Pick',option,false));
}


Actor.click.bank = function(act,eid){
	var e = Actor.get(eid);
	if(!e.bank) return ERROR(4,'not a bank');
	if(TESTDISTANCE(act,e)) return;
	Main.openDialog(Actor.getMain(act),'bank');
}

Actor.click.signpost = function(act,eid){
	var e = Actor.get(eid);
	if(!e.signpost) return ERROR(4,'not a signpost');
	if(TESTDISTANCE(act,e)) return;
	e.signpost(act.id,eid);
}


Actor.movePush = function(act,angle,magn,time){	//push that isnt pushable, ex: player fall
	if(act.timeout.movePush) return false;	//only 1 push at a time
	act.friction = 1;
	act.spdX = magn*Tk.cos(angle);
	act.spdY = magn*Tk.sin(angle);
	
	Actor.setTimeout(act,function(eid){
		var act = Actor.get(eid);
		act.spdX = 0;
		act.spdY = 0;
		act.friction = CST.FRICTION;
	},time,'movePush');
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
	
}

})();
