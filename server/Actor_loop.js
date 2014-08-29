//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Tk','Main','Boss','Loop','Activelist','Map','Collision','Sprite','Anim']));
//####Update Actor####

var INTERVAL_ABILITY = 3;
var INTERVAL_SUMMON = 5;
var INTERVAL_STATUS = 3;
var INTERVAL_TIMEOUT = 1;	//need to be fast for block... -.-

var interval = function(num){ return Loop.interval(num); }

Actor.loop = function(act){
	
	if(act.dead){
		if(act.type === 'player' && --act.respawn < 0)	Actor.death.respawn(act);
		if(act.type === 'npc' && !act.group) Actor.remove(act);
		return;
	}
	if(Loop.interval(5)) Actor.loop.updateActive(act);
	
	if(!act.active) return;
	act.frame++;
	
	if(interval(INTERVAL_TIMEOUT)) Actor.loop.timeout(act);
	
	if(act.awareNpc){
		if(interval(25)) Activelist.update(act);
		if(interval(10)) Actor.loop.mapMod(act);
	}
	 
		
		
	if(act.combat){
		if(act.hp <= 0) return Actor.death(act);
		if(act.boss) Boss.loop(act.boss);
		if(interval(INTERVAL_ABILITY)){
			Actor.loop.ability.charge(act);
			Actor.loop.ability.test(act);
		}
		if(interval(INTERVAL_STATUS)){
			Actor.loop.regen(act);    
			Actor.loop.status(act);	
		}
		if(interval(INTERVAL_SUMMON)) Actor.loop.summon(act);
		Actor.loop.boost(act);
		if(interval(25)) Actor.loop.attackReceived(act); 	//used to remove attackReceived if too long
	}
	if(act.combat || act.move){
		Actor.loop.setTarget(act);  //update Enemy Target
		Actor.loop.input(act); 		//simulate enemy key press depending on target 
	}
	if(act.pushable) Actor.loop.pushable(act);
	if(act.move){
		Actor.loop.bumper(act);   //test if collision with map    
		Actor.loop.move(act);  	//move the actor
	}
	if(act.type === 'player'){
		if(!act.combat) Actor.loop.boost(act); // duplicate, already under if(act.combat), but if not here too, in town, window open = move still
		if(interval(3)) Actor.loop.move.aim(act);
		if(interval(5)) Actor.loop.bumper.death(act);
		if(interval(INTERVAL_ABILITY)) Actor.loop.ability.chargeClient(act);
		if(interval(3)) Actor.loop.fall(act);						//test if fall
		if(interval(25*10)) act.damagedIf = 'true';	//QUICKFIX
	}

}

Actor.loop.updateActive = function(act){
	act.active = act.alwaysActive || !act.activeList.$empty();	//need to be false for Change.send ?
}
//{Ability
Actor.loop.ability = {};
Actor.loop.ability.charge = function(act){	//HOTSPOT
	var ma = act.abilityChange;
	ma.globalCooldown -= INTERVAL_ABILITY;
	ma.globalCooldown = ma.globalCooldown.mm(-100,250); 	//cuz if atkSpd is low, fuck everything with stun
	var ab = Actor.getAbility(act);
	for(var i in ab){
		var s = ab[i]; if(!s) continue;	//cuz can have hole if player
		ma.charge[s.id] = (ma.charge[s.id] + act.atkSpd * INTERVAL_ABILITY) || 0;
	}
}

Actor.loop.ability.chargeClient = function(act){
	var ab = Actor.getAbility(act);
	var ma = act.abilityChange;
	
	ma.chargeClient = '';
	for(var i in ab){
		var s = ab[i]; if(!s){ ma.chargeClient += '0'; continue; }	//cuz can have hole if player
		//Client
		var rate = ma.charge[s.id] / s.periodOwn;
		ma.chargeClient += rate >= 1 ? 'R' : Math.round(rate*35).toString(36).slice(0,1);
	}
}

Actor.loop.ability.test = function(m){
	if(m.noAbility) return;
	var ab = Actor.getAbility(m);
	var ma = m.abilityChange;
	for(var i in ab){
		var s = ab[i]; if(!s) continue;	//cuz can have hole if player
		
		if(ma.press[i] === '1' && ma.charge[s.id] > s.periodOwn && (s.bypassGlobalCooldown || (ma.globalCooldown <= 0))){
			Actor.performAbility(m,s);
			break;
		}
	}
}

Actor.performAbility = function(act,ab,mana,reset){
	//Mana
	if(mana !== false && !Actor.performAbility.resource(act,ab)) return;
	if(reset !== false)	Actor.performAbility.resetCharge(act,ab);
	
	//Anim
	if(ab.action.anim) Sprite.change(act,{'anim':ab.action.anim});
	if(ab.action.animOnSprite)	Anim.creation({name:ab.action.animOnSprite,target:act.id});
	
	//Do Ability Action (ex: Combat.attack)
	Tk.applyFunc.key(act.id,ab.action.func,ab.action.param,List);
}

Actor.performAbility.resetCharge = function(act,ab){
	var charge = act.abilityChange.charge;
	charge[ab.id] = 0;
	act.abilityChange.globalCooldown = Math.max(act.abilityChange.globalCooldown,0);	//incase bypassing Global
	act.abilityChange.globalCooldown +=  ab.periodGlobal / act.atkSpd.mm(0.05);

}

Actor.performAbility.resource = function(act,ab){
	if(act.mana < ab.costMana || act.hp < ab.costHp) return false;
	act.mana -= ab.costMana;
	act.hp -= ab.costHp;
	return true;		
}

//}

Actor.loop.timeout = function(act){
	for(var i in act.timeout){
		act.timeout[i].timer -= INTERVAL_TIMEOUT;
		if(act.timeout[i].timer < 0){
			try {act.timeout[i].func(act.id);
			}catch(err){ ERROR.err(3,err); }
			finally{	delete act.timeout[i];	}			
		}	
	}
}


Actor.loop.mapMod = function(act){
	act.mapMod = {};
	
	for(var i in act.activeList){
		var b = List.all[i].block;
		if(!b) continue;
		if(b.condition === 'npc' && act.type === 'player') continue;
		var pos = Collision.getPos(List.all[i]);
		
		for(var j = b.size[0]; j <= b.size[1]; j++){
			for(var k = b.size[2]; k <= b.size[3]; k++){
				act.mapMod[(pos.x+j) + '-' + (pos.y+k)] = typeof b.value === 'undefined' ? 1 : b.value;
			}
		}
	}


};



//{Status + boost
Actor.loop.status = function(act){
	Actor.loop.status.knock(act);
	Actor.loop.status.burn(act);
	Actor.loop.status.bleed(act);
	if(act.status.stun.time > 0) Actor.loop.status.stun(act);
	if(act.status.chill.time > 0) Actor.loop.status.chill(act);
	if(act.status.drain.time > 0) Actor.loop.status.drain(act);
	
	if(Loop.interval(2*INTERVAL_ABILITY)){
		act.statusClient = '';
		for(var i in CST.status.list)	act.statusClient += act.status[CST.status.list[i]].time > 0 ? '1' : '0';
	}
}

Actor.loop.status.stun = function(act){act.status.stun.time--;}
Actor.loop.status.chill = function(act){act.status.chill.time--;}
Actor.loop.status.drain = function(act){act.status.drain.time--;}

Actor.loop.status.knock = function(act){
	var status = act.status.knock;
	if(status.time > 0){
		status.time -= INTERVAL_ABILITY;
		act.spdX = Tk.cos(status.angle)*status.magn;
		act.spdY = Tk.sin(status.angle)*status.magn;
	}
}

Actor.loop.status.burn = function(act){
	var status = act.status.burn;
	if(status.time > 0){
		status.time -= INTERVAL_ABILITY;
		Actor.changeHp(act, -status.magn*act.hp*INTERVAL_ABILITY);
	}
}

Actor.loop.status.bleed = function(act){
	var status = act.status.bleed;
	
	if(status.time > 0){
		status.time -= INTERVAL_ABILITY;
		Actor.changeHp(act, -status.magn*INTERVAL_ABILITY);
	}
}



Actor.loop.regen = function(act){
	for(var i in act.resource){
		act[i] = Math.min(act[i] + act.resource[i].regen * INTERVAL_ABILITY,act.resource[i].max);
	}
}

Actor.loop.boost = function(act){
	var list = Actor.loop.boost.list;
	for(var j in list){
		if(!Loop.interval(list[j])) continue;
		
		for(var i in act.boost[j]){
			act.boost[j][i].time -= list[j];
			if(act.boost[j][i].time < 0)
				Actor.boost.remove(act,act.boost[j][i],j,i);
		}
	}
	
	for(var i in act.boost.toUpdate){
		Actor.update.boost(act,i);
		delete act.boost.toUpdate[i];
	}
}
Actor.loop.boost.list = {'fast':2,'reg':5,'slow':25}; //fast = 2, no idea if good


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
		
		act.summoned.time -= INTERVAL_SUMMON;
		if(act.summoned.time < 0){
			Actor.remove(act);
		}
	}
}

//}

//{Move
Actor.loop.bumper = function(act){	//HOTSPOT
	if(act.ghost) return;
	
	/*
	if(!interval(3) && act.type !== 'player'){	//only update if spd is high, but still update every 3 frames no matter what
		if(!(act.spdX > 7 || act.spdX < -7 || act.spdY > 7 || act.spdY < -7)) return;	//bit faster than Math.abs
	}
	*/
	if(interval(3) || act.type === 'player'){
		for(var i = 0 ; i < 4 ; i++)
			act.bumper[i] = Collision.actorMap.fast(Math.floor((act.x + act.bumperBox[i].x)/32),Math.floor((act.y + act.bumperBox[i].y)/32),act.map,act);
		return;
	}
	
	//for npc, update every 3 frames or if spd more than 7
	if(act.spdX > 7) act.bumper[0] = Collision.actorMap.fast(Math.floor((act.x + act.bumperBox[0].x)/32),Math.floor((act.y + act.bumperBox[0].y)/32),act.map,act);
	else if(act.spdX < -7) act.bumper[2] = Collision.actorMap.fast(Math.floor((act.x + act.bumperBox[2].x)/32),Math.floor((act.y + act.bumperBox[2].y)/32),act.map,act);
	if(act.spdY > 7) act.bumper[1] = Collision.actorMap.fast(Math.floor((act.x + act.bumperBox[1].x)/32),Math.floor((act.y + act.bumperBox[1].y)/32),act.map,act);
	else if(act.spdY < -7) act.bumper[3] = Collision.actorMap.fast(Math.floor((act.x + act.bumperBox[3].x)/32),Math.floor((act.y + act.bumperBox[3].y)/32),act.map,act);

	
}

Actor.loop.bumper.death = function(act){	//quick fix if manage to past thru wall
	for(var i in act.bumper) if(!act.bumper[i]) return;
	act.hp = -1;	
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
	//var dist = Math.pyt(act.spdY,act.spdX);	//slow
	var dist = Math.abs(act.spdY) + Math.abs(act.spdX);
	var amount = Math.ceil(dist/31);
	if(amount < 2){
		act.x += act.spdX;
		act.y += act.spdY;
	} else {    //aka could pass thru walls => move step by step and test bumper every time
		for(var i = 0 ; i < amount && !act.bumper[0] && !act.bumper[1] && !act.bumper[2] && !act.bumper[3]  ; i++){
			act.x += act.spdX/amount;
			act.y += act.spdY/amount;
			Actor.loop.bumper(act);
		} 
	} 
	act.spdX *= act.friction;	
	act.spdY *= act.friction;
}


Actor.loop.move.aim = function (act){	
	//penalty if looking and moving in opposite direction
	var diffAim = Math.abs(act.angle - act.moveAngle);
	if (diffAim > 180){ diffAim = 360 - diffAim;}
	Actor.boost(act,{'stat':'maxSpd','type':"*",'value':Math.pow(1-diffAim/360,1.5),'time':4,'name':'Aim'});
}
//}

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
	var oldcombat = act.combat;
	if(oldcombat) act.combat = 0;
	
	time = time || CST.MIN*10;	
	Actor.setTimeout(act,'freeze',time,function(key){
		List.all[key].move = 1;
		if(oldcombat) List.all[key].combat = 1;
		if(cb) cb(key);
	});
}

Actor.freeze.remove = function(act){
	if(act.timeout.freeze)
		act.timeout.freeze.timer = -1;
	act.move = 1;
}

Actor.loop.pushable = function(act){
	if(!(act.pushable.timer-- > 0)) return;
	act.x += Tk.cos(act.pushable.angle) * act.pushable.magn;
	act.y += Tk.sin(act.pushable.angle) * act.pushable.magn;
}

