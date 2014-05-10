//####Update Actor####

var ABILITYINTERVAL = 3;
var SUMMONINTERVAL = 5;

Actor.loop = function(act){
	if(act.dead){
		if(act.type === 'player' && --act.respawn < 0)	Actor.death.respawn(act);
		if(act.type !== 'player' && !act.group) Actor.remove(act);
		return;
	}
	Actor.loop.timeout(act);
	Actor.loop.updateActive(act);
	
	act.frame++;
	if(!act.active) return;
	
	var interval = function(num){	return act.frame % num === 0; };
	
	if(interval(25) && act.awareNpc) Activelist.update(act);
	if(interval(10) && act.awareNpc) Actor.loop.mapMod(act); 
		
		
	if(act.combat){
		if(act.hp <= 0){ Actor.death(act); return; }
		if(act.boss){ Boss.loop(act.boss);}
		if(interval(ABILITYINTERVAL)){
			Actor.loop.ability.charge(act);
			Actor.loop.ability.test(act);
		}
		Actor.loop.regen(act);    
		Actor.loop.status(act);	
		Actor.loop.boost(act);
		if(interval(SUMMONINTERVAL)) Actor.loop.summon(act);
		if(interval(25)) Actor.loop.attackReceived(act); 	//used to remove attackReceived if too long
	}
	if(act.combat || act.move){
		Actor.loop.setTarget(act);  //update Enemy Target
		Actor.loop.input(act); 		//simulate enemy key press depending on target 
	}
	if(act.combat && act.move && interval(3)) Actor.loop.move.aim(act); //impact max spd depending on aim
	
	if(act.move){
		Actor.loop.bumper(act);   //test if collision with map    
		Actor.loop.move(act);  	//move the actor
	}
	if(act.type === 'player'){
		if(interval(6)) Actor.loop.ability.chargeClient(act);
		if(interval(3)) Actor.loop.fall(act);						//test if fall
		if(interval(25)) Actor.loop.friendList(act);   				//check if any change in friend list
		if(interval(5)) Actor.loop.trade(act); ;    
		if(interval(5))	Actor.loop.dialogue(act); 
		if(interval(Server.frequence.save)) Save(act.id);    		//save progression
	}

}

Actor.loop.updateActive = function(act){
	act.active = act.activeList.$length() || act.type === 'player' || false;	//need to be false for Change.send
}
//{Ability
Actor.loop.ability = {};
Actor.loop.ability.charge = function(act){	//HOTSPOT
	var ma = act.abilityChange;
	ma.globalCooldown -= ABILITYINTERVAL;
	ma.globalCooldown = ma.globalCooldown.mm(-100,250); 	//cuz if atkSpd is low, fuck everything with stun
	var ab = Actor.getAbility(act);
	for(var i in ab){
		var s = ab[i]; if(!s) continue;	//cuz can have hole if player
		
		ma.charge[s.id] += act.atkSpd.main * s.spd.main * ABILITYINTERVAL;
	}
}

Actor.loop.ability.chargeClient = function(act){
	var ab = Actor.getAbility(act);
	var ma = act.abilityChange;
	
	for(var i in ab){
		var s = ab[i]; if(!s) continue;	//cuz can have hole if player
		//Client
		var rate = ma.charge[s.id] / s.period.own;
		ma.chargeClient[i] = Math.min(rate,1);
	}
}



Actor.loop.ability.test = function(m){
	var ab = Actor.getAbility(m);
	var ma = m.abilityChange;
	for(var i in ab){
		var s = ab[i]; if(!s) continue;	//cuz can have hole if player
		
		if(ma.press[i] === '1' && ma.charge[s.id] > s.period.own && (s.period.bypassGlobalCooldown || (ma.globalCooldown <= 0))){
			Actor.performAbility(m,s);
			break;
		}
	}
}

Actor.performAbility = function(act,ab,mana,reset){
	//Mana
	if(mana !== false && !Actor.performAbility.resource(act,ab.cost)) return;
	if(reset !== false)	Actor.performAbility.resetCharge(act,ab);
	
	
	//Anim
	if(ab.action.anim) Sprite.change(act,{'anim':ab.action.anim});
	if(ab.action.animOnSprite)	Anim.creation({name:ab.action.animOnSprite,target:act.id});
	
	//Do Ability Action (ex: Combat.attack)
	applyFunc.key(act.id,ab.action.func,ab.action.param);
}

Actor.performAbility.resetCharge = function(act,ab){
	var charge = act.abilityChange.charge;
	charge[ab.id] = 0;
	act.abilityChange.globalCooldown = Math.max(act.abilityChange.globalCooldown,0);	//incase bypassing Global
	act.abilityChange.globalCooldown +=  ab.period.global * (ab.spd.main / act.atkSpd.main.mm(0.05));

}

Actor.performAbility.resource = function(act,cost){
	for(var j in cost){
		if(cost[j] > act[j]){ return false;}
	}
	for(var j in cost){act[j] -= cost[j];}
	return true;		
}

//}

Actor.loop.timeout = function(act){
	for(var i in act.timeout){
		if(--act.timeout[i].timer < 0){
			try {act.timeout[i].func(act.id);
			}catch(err){ ERROR.err(err); }
			finally{	delete act.timeout[i];	}			
		}	
	}
}


Actor.loop.mapMod = function(act){
	act.mapMod = {};
	
	
	for(var i in act.activeList){
		var b = List.all[i];
		if(!b || !b.block) continue;
		var size = b.block.size;
		var pos = Collision.getPos(b);
		
		for(var j = size[0]; j <= size[1]; j++){
			for(var k = size[2]; k <= size[3]; k++){
				act.mapMod[(pos.x+j) + '-' + (pos.y+k)] = 1;
			}
		}
	}


};



//{Status + boost
Actor.loop.status = function(act){
	Actor.loop.status.knock(act);
	Actor.loop.status.burn(act);
	Actor.loop.status.bleed(act);
	Actor.loop.status.stun(act);
	Actor.loop.status.chill(act);
	Actor.loop.status.drain(act);
	
	act.statusClient = '';
	for(var i in Cst.status.list)	act.statusClient += act.status[Cst.status.list[i]].time > 0 ? '1' : '0';
}

Actor.loop.status.chill = function(act){act.status.chill.time--;}
Actor.loop.status.stun = function(act){act.status.stun.time--;}
Actor.loop.status.drain = function(act){act.status.drain.time--;}

Actor.loop.status.knock = function(act){
	var status = act.status.knock;
	if(status.time-- > 0){ 
		act.spdX = Tk.cos(status.angle)*status.magn;
		act.spdY = Tk.sin(status.angle)*status.magn;
	}
}

Actor.loop.status.burn = function(act){
	var status = act.status.burn;
	if(status.time-- > 0){
		Actor.changeHp(act, -status.magn*act.hp);
	}
}

Actor.loop.status.bleed = function(act){
	var status = act.status.bleed;
	
	if(status.time-- > 0){
		Actor.changeHp(act, -status.magn);
	}
}



Actor.loop.regen = function(act){
	for(var i in act.resource){
		act[i] = Math.min(act[i] + act.resource[i].regen,act.resource[i].max);
	}
}

Actor.loop.boost = function(act){
	var array = {'fast':1,'reg':5,'slow':25};
	for(var j in array){
		if(!Loop.interval(array[j])) continue;
		
		for(var i in act.boost[j]){
			act.boost[j][i].time -= array[j];
			if(act.boost[j][i].time < 0)
				Actor.boost.remove(act,act.boost[j][i]);
		}
	}
	
	for(var i in act.boost.toUpdate){
		Actor.update.boost(act,i);
		delete act.boost.toUpdate[i];
	}
}

Actor.loop.summon = function(act){
    //(assume player is the master)
	for(var i in act.summon){
		for(var j in act.summon[i].child){
			if(!List.all[j]){ delete act.summon[i].child[j]; }
		}		
	}
	
	//(assume player is child)
    if(act.summoned){
		var fat = List.all[act.summoned.father];
		if(!fat || fat.dead){ Actor.remove(act); return; }	//remove if father dead
	    
	    //if too far, teleport near master
		if(act.map !== fat.map || Collision.distancePtPt(act,fat) >= act.summoned.distance){
			act.x = fat.x + Math.randomML()*5;
			act.y = fat.y + Math.randomML()*5;
			act.map = fat.map;
		}	
		
		act.summoned.time -= SUMMONINTERVAL;
		if(act.summoned.time < 0){
			Actor.remove(act);
		}
	}
}

//}

//{Move
Actor.loop.bumper = function(act){	//HOTSPOT
	//test collision with map
	if(Loop.interval(100)){	//test global limit
		act.x = act.x.mm(50,act.x,Db.map[Map.getModel(act.map)].grid.bullet[0].length*32-50);
		act.y = act.y.mm(50,act.y,Db.map[Map.getModel(act.map)].grid.bullet.length*32-50);
	}
	//test bumpers
	for(var i = 0 ; i < 4 ; i ++){
		var pos = Collision.getPos({x:act.x + act.bumperBox[i].x,y:act.y + act.bumperBox[i].y});
		act.bumper[i] = Collision.ActorMap(pos,act.map,act);
	}
}

Actor.loop.fall = function(act){
	var xy = {x: act.x +act.bumperBox[1].x,y:act.y + act.bumperBox[0].y};	//center of bumper
	xy = Collision.getPos(xy);
	var value = Collision.getSquareValue(xy,act.map,'player');
	
	if(value === '4'){ Actor.fall(act); }
	if(value === '3'){ 
		var list = Actor.loop.fall.array;	
		for(var i in list){
			if(Collision.getSquareValue({x:xy.x+list[i][0],y:xy.y+list[i][1]},act.map,'player') === '4'){
				Actor.movePush(act,list[i][2],5,5);
				break;
			}
		}
	}
}
Actor.loop.fall.array = [[1,0,0],[0,1,90],[-1,0,180],[0,-1,270],[1,1,45],[-1,1,135],[-1,1,225],[1,-1,315],];



Actor.fall = function(act){	//default fall
	if(List.map[act.map].fall) List.map[act.map].fall(act.id,act);
	else act.hp = -1;
}

Actor.loop.move = function(act){
	if(act.bumper[0]){act.spdX = -Math.abs(act.spdX*0.5)*act.bounce - act.bounce;} 
	if(act.bumper[1]){act.spdY = -Math.abs(act.spdY*0.5)*act.bounce - act.bounce;}
	if(act.bumper[2]){act.spdX = Math.abs(act.spdX*0.5)*act.bounce + act.bounce;} 
	if(act.bumper[3]){act.spdY = Math.abs(act.spdY*0.5)*act.bounce + act.bounce;} 

	if(act.moveInput[0] && !act.bumper[0] && act.spdX < act.maxSpd){act.spdX += act.acc;}
	if(act.moveInput[1] && !act.bumper[1] && act.spdY < act.maxSpd){act.spdY += act.acc;}
	if(act.moveInput[2] && !act.bumper[2] && act.spdX > -act.maxSpd){act.spdX -= act.acc;}
	if(act.moveInput[3] && !act.bumper[3] && act.spdY > -act.maxSpd){act.spdY -= act.acc;}	
	
	
	//Friction + Min Spd
	if (Math.abs(act.spdX) < 0.1){act.spdX = 0;}	
	if (Math.abs(act.spdY) < 0.1){act.spdY = 0;}
	act.moveAngle = Tk.atan2(act.spdY,act.spdX);
	
	
	
	//Calculating New Position
	var dist = Math.pyt(act.spdY,act.spdX);
	var amount = Math.ceil(dist/30);
	if(amount < 2){
		act.x += act.spdX;
		act.y += act.spdY;
	} else {    //aka could pass thru walls => move step by step and test bumper every time
		for(var i = 0 ; i < amount && !act.bumper[0] && !act.bumper[1] && !act.bumper[2] && !act.bumper[3]  ; i++){
			act.x += act.spdX/amount;
			act.y += act.spdY/amount;
			Sprite.updateBumper(act);
		} 
	} 
	act.spdX *= act.friction;	
	act.spdY *= act.friction;
}

/*
Actor.loop.move = function(act){
	if(act.bumper[0]){act.spdX = -Math.abs(act.spdX*0.5)*act.bounce - act.bounce;} 
	if(act.bumper[1]){act.spdY = -Math.abs(act.spdY*0.5)*act.bounce - act.bounce;}
	if(act.bumper[2]){act.spdX = Math.abs(act.spdX*0.5)*act.bounce + act.bounce;} 
	if(act.bumper[3]){act.spdY = Math.abs(act.spdY*0.5)*act.bounce + act.bounce;} 

	if(act.moveInput[0] && !act.bumper[0] && act.spdX < act.maxSpd){act.spdX += act.acc;}
	if(act.moveInput[1] && !act.bumper[1] && act.spdY < act.maxSpd){act.spdY += act.acc;}
	if(act.moveInput[2] && !act.bumper[2] && act.spdX > -act.maxSpd){act.spdX -= act.acc;}
	if(act.moveInput[3] && !act.bumper[3] && act.spdY > -act.maxSpd){act.spdY -= act.acc;}	
	
	
	//Friction + Min Spd
	if (Math.abs(act.spdX) < 0.1){act.spdX = 0;}	
	if (Math.abs(act.spdY) < 0.1){act.spdY = 0;}
	act.moveAngle = Tk.atan2(act.spdY,act.spdX);
	
	
	
	//Calculating New Position
	var dist = Math.pyt(act.spdY,act.spdX);
	var amount = Math.ceil(dist/30);
	if(amount < 2){
		act.x += act.spdX;
		act.y += act.spdY;
	} else {    //aka could pass thru walls => move step by step and test bumper every time
		for(var i = 0 ; i < amount && !act.bumper[0] && !act.bumper[1] && !act.bumper[2] && !act.bumper[3]  ; i++){
			act.x += act.spdX/amount;
			act.y += act.spdY/amount;
			Sprite.updateBumper(act);
		} 
	} 
	act.spdX *= act.friction;	
	act.spdY *= act.friction;
}

*/



Actor.loop.move.aim = function (act){	
	//penalty if looking and moving in opposite direction
	var diffAim = Math.abs(act.angle - act.moveAngle);
	if (diffAim > 180){ diffAim = 360 - diffAim;}
	Actor.boost(act,{'stat':'maxSpd','type':"*",'value':Math.pow(1-diffAim/360,1.5),'time':4,'name':'Aim'});
}
//}






Actor.loop.trade = function(act){	//BAD
	var key = act.id;
	if(!List.main[key].windowList.trade) return;
	
	if(List.main[List.main[key].windowList.trade.trader]){
		List.main[key].windowList.trade.tradeList = List.main[List.main[key].windowList.trade.trader].tradeList;	
		List.main[key].windowList.trade.confirm.other = List.main[List.main[key].windowList.trade.trader].windowList.trade.confirm.self;
	
		if(List.main[key].windowList.trade.confirm.other && List.main[key].windowList.trade.confirm.self){
			//tradeItem(key,List.main[key].windowList.trade.trader);	//TOFIXBUG
		}
	} else {
		List.main[key].windowList.trade = 0;
	}
}

Actor.loop.dialogue = function(act){
	//test if player has move away to end dialogue	
	var key = act.id;
	if(!List.main[key].dialogue) return;
	if(Collision.distancePtPt(act,List.main[key].dialogue) > 100){
		Dialogue.end(key);
	}


}

Actor.loop.friendList = function(act){
	var key = act.id;
	var fl = List.main[key].social.list.friend;
    
	for(var i in fl){
		fl[i].online = Chat.receive.pm.test(act.name,i);
	}
}

Actor.loop.attackReceived = function(act){
	for(var i in act.attackReceived){
		act.attackReceived[i] -= 25;		//per second. doesnt depend on dmg, set at 500 on hit
		if(act.attackReceived[i] <= 0){
			delete act.attackReceived[i];
		}
	}
}

Actor.setTimeout = function(act,name,time,cb){
	name = name || Math.randomId();
	act.timeout[name] = {timer:time,func:cb};
}

Actor.freeze = function(act,time,cb){
	act.move = 0;
	time = time || Cst.MIN*10;	
	Actor.setTimeout(act,'freeze',time,function(key){
		List.all[key].move = 1;
		if(cb) cb(key);
	});
}

Actor.freeze.remove = function(act){
	if(act.timeout.freeze)
		act.timeout.freeze.timer = -1;
	act.move = 1;
}





