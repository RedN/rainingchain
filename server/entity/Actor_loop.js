//####Update Actor####

abilityUpdatePeriod = {npc:1,player:1};

Actor.loop = function(act){	
	act.frame++;
	if(act.frame % 25 === 0){ Actor.loop.activeList(act); }
	if(!act.active) return;
	
	Actor.loop.timeOut(act);
	if(act.dead){
		if(act.type === 'player' && act.respawn-- <= 0)
			Actor.death.respawn(act);
		return;
	}
	if(act.combat){
		if(act.hp <= 0) Actor.death(act);
		if(act.boss){ Boss.loop(act.boss);}
		if(act.frame % abilityUpdatePeriod[act.type] === 0) Actor.loop.ability(act);
		Actor.loop.regen(act);    
		Actor.loop.status(act);	
		Actor.loop.boost(act);
		Actor.loop.summon(act);
		if(act.frame % 25 === 0){ Actor.loop.attackReceived(act); }	//used to remove attackReceived if too long
	}
	if(act.combat || act.move){
		Actor.loop.setTarget(act);  //update Enemy Target
		Actor.loop.input(act); 		//simulate enemy key press depending on target 
	}
	if(act.combat && act.move && act.frame % 3 === 0) Actor.loop.move.aim(act); //impact max spd depending on aim
	
	if(act.move){
		if(act.frame % 10 === 0){ Actor.loop.mapMod(act); }
		Actor.loop.bumper(act);   //test if collision with map    
		Actor.loop.move(act);  	//move the actor
	}
	if(act.type === 'player'){
		Actor.loop.fall(act);	//test if fall
		
		if(act.frame % 2 === 0){ Draw.loop(act.id); }    						//draw everything and add button
		if(act.frame % 25 === 0){ Actor.loop.friendList(act); }    				//check if any change in friend list
		if(act.frame % round(Server.frequence.save/40) === 0){ Save(act.id); }    //save progression
		if(List.main[act.id].windowList.trade){ Actor.loop.trade(act); };    
		if(List.main[act.id].dialogue){ Actor.loop.dialogue(act); }
	}
		
}

//{Ability
Actor.loop.ability = function(m){	//HOTSPOT
	var alreadyBoosted = {};
	m.abilityChange.chargeClient = [0,0,0,0,0,0];
	
	m.abilityChange.globalCooldown--;
	m.abilityChange.globalCooldown = m.abilityChange.globalCooldown.mm(-100,250); 	//cuz if atkSpd is low, fuck everything
	var ab = Actor.getAbility(m);
	for(var i in ab){
		var s = ab[i]; if(!s) continue;	//cuz can have hole if player AND enemy attack rate is are in m.ability
		
		var charge = m.abilityChange.charge;	//cant used [id] cuz otherwise not longer reference

		//Charge
		if(!alreadyBoosted[s.id]){  //this is because a player can set the same ability to multiple input
			charge[s.id] += m.atkSpd.main * s.spd.main * abilityUpdatePeriod[m.type];
			charge[s.id] = charge[s.id] || 0;	//cuz if null bug
			alreadyBoosted[s.id] = 1;
		}
		
		//Client
		var rate = charge[s.id] / s.period.own;
		m.abilityChange.chargeClient[i] = Math.min(rate,1);
	
		//Perform
		if(m.abilityChange.press[i] == '1' && rate >= 1 && (s.period.bypassGlobalCooldown || (m.abilityChange.globalCooldown <= 0))){
			Actor.performAbility(m,s);
			break;	//1 ability per frame max
		}
	}

}

Actor.performAbility = function(act,ab,mana,reset){
	//Mana
	if(mana !== false && !Actor.performAbility.resource(act,ab.cost)) return;
	
	//Charge
	if(reset !== false)	Actor.performAbility.resetCharge(act,ab);
	
	
	//Anim
	if(ab.action.anim) Sprite.change(act,{'anim':ab.action.anim});
	if(ab.action.animOnSprite){
		Anim.creation(ab.action.animOnSprite,act.id,1);
	}
	
	//Do Ability Action (ex: Combat.action.attack)
	applyFunc.key(act.id,ab.action.func,ab.action.param);
}

Actor.performAbility.resetCharge = function(act,ab){
	var charge = act.abilityChange.charge;
	charge[ab.id] = Math.min(charge[ab.id] % ab.period.own,1);
	act.abilityChange.globalCooldown = act.abilityChange.globalCooldown < 0 ? 0 : act.abilityChange.globalCooldown;	//incase bypassing Global
	act.abilityChange.globalCooldown +=  ab.period.global * (ab.spd.main / act.atkSpd.main.mm(0.01) + ab.spd.support / act.atkSpd.support.mm(0.01));
	
	//Reset the ability and related abilities
	return;
}

Actor.performAbility.resource = function(act,cost){
	for(var j in cost){
		if(cost[j] > act[j]){ return false;}
	}
	for(var j in cost){act[j] -= cost[j];}
	return true;		
}

//}

Actor.loop.timeOut = function(act){
	for(var i in act.timeOut){
		if(--act.timeOut[i].timer < 0){
			act.timeOut[i].func(act.id);
			delete act.timeOut[i];		
		}	
	}
}

Actor.setTimeOut = function(act,name,time,cb){
	name = name || Math.randomId();
	act.timeOut[name] = {timer:time,func:cb};
}

Actor.loop.mapMod = function(act){
	act.mapMod = {};

	for(var i in act.activeList){
		var b = List.all[i];
		if(!b || !b.block || !b.block.condition) continue;
		if(b.block.condition === 'true'
			|| (typeof b.block.condition === 'function' && b.block.condition(act.id,act,b))){
			var size = b.block.size;
			var pos = Collision.getPos(b);
			
			for(var j = size[0]; j <= size[1]; j++){
				for(var k = size[2]; k <= size[3]; k++){
					act.mapMod[(pos.x+j) + '-' + (pos.y+k)] = 1;
				}
			}
		}
	}


};



//{Status + stats
Actor.loop.status = function(act){
	Actor.loop.status.knock(act);
	Actor.loop.status.burn(act);
	Actor.loop.status.bleed(act);
	Actor.loop.status.stun(act);
	Actor.loop.status.chill(act);
	Actor.loop.status.drain(act);
	
	act.statusClient = '';
	for(var i in Cst.status.list)	act.statusClient += act.status[Cst.status.list[i]].active.time > 0 ? '1' : '0';
}

Actor.loop.status.chill = function(act){
	var status = act.status.chill.active;
	if(status.time > 0){ 
		status.time--;	//the actual effect is a boost
	}
}

Actor.loop.status.knock = function(act){
	var status = act.status.knock.active;
	if(status.time > 0){ 
		act.spdX = cos(status.angle)*status.magn;
		act.spdY = sin(status.angle)*status.magn;
		status.time--;
	}
}

Actor.loop.status.stun = function(act){
	var status = act.status.stun.active;
	if(status.time > 0){
		status.time--;
	} 
}

Actor.loop.status.burn = function(act){
	var status = act.status.burn.active;
	if(status.time> 0){
		Actor.changeHp(act, -status.magn*act.hp);
		status.time--;
	}
}

Actor.loop.status.bleed = function(act){
	var status = act.status.bleed.active;
	
	if(status.time> 0){
		Actor.changeHp(act, -status.magn);
		status.time--;
	}
}

Actor.loop.status.drain = function(act){
	var status = act.status.drain.active;
	
	if(status.time> 0){
		status.time--;
	}
}


Actor.loop.regen = function(act){
	for(var i in act.resource){
		act[i] += act.resource[i].regen;
		act[i] = Math.min(act[i],act.resource[i].max);
	}
}

Actor.loop.boost = function(act,full){
	var array = {'fast':1,'reg':5,'slow':25};
	for(var j in array){
		if(!Loop.interval(array[j])) continue;
		
		for(var i in act.boost[j]){
			if(act.boost[j][i].timer < 0){ 
				Actor.boost.remove(act,act.boost[j][i]);
			} else {
				act.boost[j][i].timer -= array[j];
			}
		}
	}
	
	for(var i in act.boost.toUpdate){
		Actor.update.boost(act,i);
		delete act.boost.toUpdate[i];
	}
	
	if(full){for(var i in act.boost.list){Actor.update.boost(act,i);}}
}

Actor.loop.summon = function(act){
    //check if summon child still exist (assume player is the master)
	for(var i in act.summon){
		for(var j in act.summon[i].child){
			if(!List.all[j]){ delete act.summon[i].child[j]; }
		}		
	}
	
	//(assume player is child)
    if(act.summoned && act.frame % 5 === 0){
		if(!act.summoned.father || !List.all[act.summoned.father]){ Actor.remove(act); return; }
	    
	    //if too far, teleport near master
		if(act.map != List.all[act.summoned.father].map || Collision.distancePtPt(act,List.all[act.summoned.father]) >= act.summoned.distance){
			act.x = List.all[act.summoned.father].x + Math.random()*5-2;
			act.y = List.all[act.summoned.father].y + Math.random()*5-2;
			act.map = List.all[act.summoned.father].map;
		}	
		
		act.summoned.time -= 5;
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
		act.x = Math.max(act.x,50);
		act.x = Math.min(act.x,Db.map[Map.getModel(act.map)].grid.bullet[0].length*32-50);
		act.y = Math.max(act.y,50);
		act.y = Math.min(act.y,Db.map[Map.getModel(act.map)].grid.bullet.length*32-50);
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
	
	if(value === '4'){ Actor.fall(act); return; }	//TOFIX check for map fall
	if(value === '3'){ 
		
		
		var list = [
			[1,0,0],
			[0,1,90],
			[-1,0,180],
			[0,-1,270],
			[1,1,45],
			[-1,1,135],
			[-1,1,225],
			[1,-1,315],
		]
	
		for(var i in list){
			if(Collision.getSquareValue({x:xy.x+list[i][0],y:xy.y+list[i][1]},act.map,'player') === '4'){
				Actor.push(act,list[i][2],2,2);
				break;
			}
		}
	}
	
	
	
	
	
	
	
	//var xy2 = {x: act.x +act.bumperBox[1].x,y:act.y + (act.bumperBox[1].y + act.bumperBox[0].y)/2};	//x = middle, y = 3/4 below
	//&& !Collision.ActorMap.fall(Collision.getPos(xy2),act.map,act)
}

Actor.fall = function(act){
	List.map[act.map].fall(act.id,act);
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
	act.spdX *= act.friction;	
	act.spdY *= act.friction;
	if (Math.abs(act.spdX) < 0.1){act.spdX = 0;}	
	if (Math.abs(act.spdY) < 0.1){act.spdY = 0;}
	if(act.spdX || act.spdY){ act.moveAngle = atan2(act.spdY,act.spdX); } 
	
	
	
	//Calculating New Position
	var dist = Math.pyt(act.spdY,act.spdX);
	var amount = Math.ceil(dist/30);
	if(amount >= 2){    //aka could pass thru walls => move step by step and test bumper every time
		//need fix, reason y stuck when too fast
		for(var i = 0 ; i < amount && !act.bumper[0] && !act.bumper[1] && !act.bumper[2] && !act.bumper[3]  ; i++){
			act.x += act.spdX/amount;
			act.y += act.spdY/amount;
			Sprite.updateBumper(act);
		} 
	} else {
		act.x += act.spdX;
		act.y += act.spdY;
	}
	
}

Actor.loop.move.aim = function (act){	
	//penalty if looking and moving in opposite direction
	var diffAim = Math.abs(act.angle - act.moveAngle);
	if (diffAim > 180){ diffAim = 360 - diffAim;}
	Actor.boost(act,{'stat':'maxSpd','type':"*",'value':Math.pow((360-diffAim)/360,1.5),'time':4,'name':'Aim'});
}
//}


Actor.loop.activeList = function(act){
	//Note: Could mix that together
		
	//Test Already in List if they deserve to stay
	for(var j in act.activeList){		//bug here if List.all[j] is undefined
		if(!List.all[j]){
			delete act.activeList[j];
			continue;
		}
		if(!Activelist.test(act,List.all[j])){
			delete List.all[j].viewedBy[act.id];
			delete act.activeList[j];
			if(act.removeList) act.removeList.push(List.all[j].publicId || j);
		}
	}
	
	//Add New Boys
	if(List.map[act.map]){
		for(var j in List.map[act.map].list.all){
			if(Activelist.test(act,List.all[j])){
				act.activeList[j] = 1;
				if(act.type !== 'player'){ List.all[j].viewedBy[act.id] = 1;}	//for player, viewedBy is used in send init data
			}
		}
	}
	act.active = Object.keys(act.activeList).length || act.type == 'player';

}

Actor.loop.trade = function(act){
	var key = act.id;
	if(List.main[List.main[key].windowList.trade.trader]){
		List.main[key].windowList.trade.tradeList = List.main[List.main[key].windowList.trade.trader].tradeList;	
		List.main[key].windowList.trade.confirm.other = List.main[List.main[key].windowList.trade.trader].windowList.trade.confirm.self;
	
		if(List.main[key].windowList.trade.confirm.other && List.main[key].windowList.trade.confirm.self){
			tradeItem(key,List.main[key].windowList.trade.trader);
		}
	} else {
		List.main[key].windowList.trade = 0;
	}
}

Actor.loop.dialogue = function(act){
	//test if player has move away to end dialogue	
	var key = act.id;
	var dx = List.main[key].dialogueLoc.x;
	var dy = List.main[key].dialogueLoc.y;
	if(!Collision.PtRect({'x':act.x,'y':act.y},[dx-100,dx+100,dy-100,dy+100])){
		Dialogue.end(key);
	}


}

Actor.loop.friendList = function(act){
	var key = act.id;
	var fl = List.main[key].social.list.friend;
    
	for(var i in fl){
		fl[i].online = Chat.receive.pm.test(List.all[key].name,i);
	}
}

Actor.loop.attackReceived = function(act){
	for(var i in act.attackReceived){
		act.attackReceived[i] -= 1;		//per second
		if(act.attackReceived[i] <= 0){
			delete act.attackReceived[i];
		}
	}
}








