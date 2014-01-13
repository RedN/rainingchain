//####Update Mortal####
Mortal.loop = function(mort){	
	Test.loop.mortal(i);
	if(Loop.frameCount % 25 === 0){ Mortal.loop.activeList(mort); }
	if(!mort.active || mort.dead) return;
		
	if(mort.combat){
		if(mort.type == 'enemy'){
			if(Math.random() < 1/mort.targetMod.period || !mort.target){ Mortal.loop.target(mort); }  //update Enemy Target
			if(mort.killed){ Mortal.death(mort);}
			if(mort.hp <= 0){ Mortal.death.start(mort);}
			if(mort.target && mort.boss){ mort.boss.loop();}    //custom boss loop
		}
		Mortal.loop.aim(mort); //impact max spd depending on aim
		Mortal.loop.ability(mort);
		Mortal.loop.regen(mort);    
		Mortal.loop.status(mort);	
		Mortal.loop.boost(mort);
		Mortal.loop.summon(mort);
		if(Loop.frameCount % 25 === 0){ Mortal.loop.attackReceived(mort); }
	}
	
	if(mort.move){
		Mortal.loop.bumper(mort);     //test if collision with map    
		if(mort.type !== 'player'){ Mortal.loop.input(mort); }    //simulate enemy key press depending on target
		Mortal.loop.move(mort);   //move the actor
	}
	if(mort.type === 'player'){
		var i = mort.id;
		if(Loop.frameCount % 2 === 0){ Draw.loop(i); }    //draw everything and add button
		if(Loop.frameCount % 25 === 0){ Mortal.loop.friendList(mort); }    //check if any change in friend list
		if(List.main[i].windowList.trade){ Mortal.loop.trade(mort); };    
		if(List.main[i].dialogue){ Mortal.loop.dialogue(mort); }
		
		
		Test.loop.player(i);	
	}
		
}

//Combat
Mortal.loop.ability = function(m){
	var alreadyBoosted = {};
	m.abilityChange.chargeClient = [0,0,0,0,0,0];
	
	for(var i in m.ability){
		var s = m.ability[i]; if(!s) continue;
		
		var charge = m.abilityChange.charge;
		var press = +m.abilityChange.press[i];
		
		if(!alreadyBoosted[s.id]){  //this is because a player can set the same ability to multiple input
			for(var j in s.spd){
				charge[s.id] += m.atkSpd[j] * s.spd[j];
			}
			alreadyBoosted[s.id] = 1;
		}
		m.abilityChange.chargeClient[+i] = charge[s.id] >= s.period ? 1 : charge[s.id] / s.period;
				
		if(press && charge[s.id] >= s.period){
			Mortal.ability(m,s);
			break;	//1 ability per frame max
		}
	}

}

Mortal.ability = function(mort,ab,mana,reset){
	//Mana
	if(mana !== false && !Mortal.ability.resource(mort,ab.cost)) return;
	
	//Charge
	if(reset !== false) Mortal.ability.charge(mort,ab);
		
	//Do Ability Action (ex: Combat.action.attack)
	applyFunc.key(mort.id,ab.action.func,ab.action.param);
}

Mortal.ability.charge = function(mort,ab){
	var charge = mort.abilityChange.charge;
	charge[ab.id] = Math.min(charge[ab.id] % ab.period,1);
	
	//Reset the ability and related abilities
	for(var j in ab.reset){	//'attack':0,'support':0.5,'summon':1,'tag':'fire':0.2
		if(j === 'tag'){	//custom tag
			for(var p in ab.reset.tag){
				for(var n in mort.ability){
					if(!mort.ability[n]) continue;
					if(n !== i && mort.ability[n].tag && mort.ability[n].tag.have(p)){
						charge[n] = charge[n] * ab.reset.tag[p];
					}
				}
			}
		} else {	//type
			for(var k in mort.ability){
				if(!mort.ability[k]) continue;
				if(mort.ability[k].type === j){
					charge[k] = charge[k] * ab.reset[j];
				}
			}
		}
	}
}

Mortal.ability.resource = function(mort,cost){
	for(var j in cost){
		if(cost[j] > mort[j]){ return false;}
	}
	for(var j in cost){mort[j] -= cost[j];}
	return true;		
}


Mortal.loop.status = function(mort){
	Mortal.loop.status.knock(mort);
	Mortal.loop.status.burn(mort);
	Mortal.loop.status.bleed(mort);
	Mortal.loop.status.confuse(mort);
}

Mortal.loop.status.knock = function(mort){
	var status = mort.status.knock.active;
	if(status.time > 0){ 
		mort.spdX = cos(status.angle)*status.magn;
		mort.spdY = sin(status.angle)*status.magn;
		status.time--;
	}
}

Mortal.loop.status.confuse = function(mort){
	var status = mort.status.confuse.active;
	if(status.time > 0){
		status.time--;
	} 
}

Mortal.loop.status.burn = function(mort){
	var status = mort.status.burn.active;
	if(status.time> 0){
		if(!status.type || status.type === 'hp'){ Mortal.changeHp(mort, (1-status.magn) + '%'); }
		if(status.type === 'maxHp'){ Mortal.changeHp(mort,-mort.resource.hp.max*status.magn);}
		status.time--;
	}
}

Mortal.loop.status.bleed = function(mort){
	var list = mort.status.bleed.active.list;
	for(var i in list){
		Mortal.changeHp(mort,-list[i].magn);
		list[i].time--;
		if(list[i].time <= 0){ list.splice(i,1); }
	}
	mort.status.bleed.active.time = list.length;
}

Mortal.loop.regen = function(mort){
	for(var i in mort.resource){
		mort[i] += mort.resource[i].regen;
		mort[i] = Math.min(mort[i],mort.resource[i].max);
	}
}

Mortal.loop.summon = function(mort){
    //check if summon child still exist (assume player is the master)
	for(var i in mort.summon){
		for(var j in mort.summon[i].child){
			if(!List.all[j]){ delete mort.summon[i].child[j]; }
		}		
	}
	
	//(assume player is child)
    if(mort.summoned && Loop.frameCount % 5 === 0){
		if(!mort.summoned.father || !List.all[mort.summoned.father]){ Mortal.remove(mort); return; }
	    
	    //if too far, teleport near master
		if(mort.map != List.all[mort.summoned.father].map || distancePtPt(mort,List.all[mort.summoned.father]) >= mort.summoned.distance){
			mort.x = List.all[mort.summoned.father].x + Math.random()*5-2;
			mort.y = List.all[mort.summoned.father].y + Math.random()*5-2;
			mort.map = List.all[mort.summoned.father].map;
		}	
		
		mort.summoned.time -= 5;
		if(mort.summoned.time < 0){
			Mortal.remove(mort);
		}
	}
}

Mortal.loop.bumper = function(mort){
	//test collision with map
	mort.x = Math.max(mort.x,50);
	mort.x = Math.min(mort.x,Db.map[mort.map].grid[0].length*32-50);
	mort.y = Math.max(mort.y,50);
	mort.y = Math.min(mort.y,Db.map[mort.map].grid.length*32-50);
	
	var bumperBox = mort.bumperBox;
		
	for(var i = 0 ; i < 4 ; i ++){
		mort.bumper[i] = Collision.PtMap({x:mort.x + bumperBox[i].x,y:mort.y + bumperBox[i].y},mort.map,mort);
	}
}

//update movement. depends on spd.
Mortal.loop.move = function(mort){
	if(mort.status && mort.status.confuse.active.time > 0){ var bind = mort.status.confuse.active.input;} else { var bind = [0,1,2,3]; }
	if(mort.bumper[0]){mort.spdX = -Math.abs(mort.spdX*0.5) - 1;} 
	if(mort.bumper[1]){mort.spdY = -Math.abs(mort.spdY*0.5) - 1;}
	if(mort.bumper[2]){mort.spdX = Math.abs(mort.spdX*0.5) + 1;} 
	if(mort.bumper[3]){mort.spdY = Math.abs(mort.spdY*0.5) + 1;} 

	if(mort.moveInput[bind[0]] && !mort.bumper[0] && mort.spdX < mort.maxSpd){mort.spdX += mort.acc;}
	if(mort.moveInput[bind[1]] && !mort.bumper[1] && mort.spdY < mort.maxSpd){mort.spdY += mort.acc;}
	if(mort.moveInput[bind[2]] && !mort.bumper[2] && mort.spdX > -mort.maxSpd){mort.spdX -= mort.acc;}
	if(mort.moveInput[bind[3]] && !mort.bumper[3] && mort.spdY > -mort.maxSpd){mort.spdY -= mort.acc;}	
	
	//Friction + Min Spd
	mort.spdX *= mort.friction;	
	mort.spdY *= mort.friction;
	if (Math.abs(mort.spdX) < 0.1){mort.spdX = 0;}	
	if (Math.abs(mort.spdY) < 0.1){mort.spdY = 0;}
	if(mort.spdX || mort.spdY){ mort.moveAngle = atan2(mort.spdY,mort.spdX); } 
	
	//Calculating New Position
	var dist = Math.pyt(mort.spdY,mort.spdX);
	var amount = Math.ceil(dist/30);
	if(amount >= 2){    //aka could pass thru walls => move step by step and test bumper every time
		//need fix, reason y stuck when too fast
		for(var i = 0 ; i < amount && !mort.bumper[0] && !mort.bumper[1] && !mort.bumper[2] && !mort.bumper[3]  ; i++){
			mort.x += mort.spdX/amount;
			mort.y += mort.spdY/amount;
			Sprite.updateBumper(mort);
		} 
	} else {
		mort.x += mort.spdX;
		mort.y += mort.spdY;
	}
	
}

//penalty if looking and moving in opposite direction
Mortal.loop.aim = function (mort){	
	var diffAim = Math.abs(mort.angle - mort.moveAngle);
	if (diffAim > 180){ diffAim = 360 - diffAim;}
	Mortal.boost(mort,{'stat':'maxSpd','type':"*",'value':Math.pow((360-diffAim)/360,1.5),'time':2,'name':'Aim'});
}

Mortal.loop.boost = function(mort,full){
	var array = {'fast':1,'reg':5,'slow':25};
	for(var j in array){
		if(Loop.frameCount % array[j] === 0){
			for(var i in mort.boost[j]){
				if(mort.boost[j][i].timer < 0){ 
					var stat = mort.boost[j][i].stat;
					delete mort.boost.list[stat].name[mort.boost[j][i].name]
					delete mort.boost[j][i]; 
					Mortal.update.boost(mort,stat);
				} else {
					mort.boost[j][i].timer -= array[j];
				}
			}
		}
	}
	
	for(var i in mort.boost.toUpdate){
		Mortal.update.boost(mort,i);
		delete mort.boost.toUpdate[i];
	}
	
	if(full){for(var i in mort.boost.list){Mortal.update.boost(mort,i);}}
}

Mortal.loop.activeList = function(mort){
	//Note: Could mix that together
		
	//Test Already in List if they deserve to stay
	for(var j in mort.activeList){		//bug here if List.all[j] is undefined
		if(!List.all[j]){
			delete mort.activeList[j];
			continue;
		}
		if(!ActiveList.test(mort,List.all[j])){
			delete List.all[j].viewedBy[mort.id];
			delete mort.activeList[j];
		}
	}
	
	//Add New Boys
	for(var j in List.all){
		if(ActiveList.test(mort,List.all[j]) && List.all[j].id != mort.id){
			mort.activeList[j] = List.all[j].id;
			if(mort.type !== 'player'){ List.all[j].viewedBy[mort.id] = mort.id;}
		}
	}
	
	mort.active = (Object.keys(mort.activeList).length !== 0 || mort.type == 'player')

}

Mortal.loop.target = function(enemy){
    var targetList = []; 
	for (var i in enemy.activeList){
		var tar = List.all[i];
		var hIf = typeof enemy.targetIf == 'function' ? enemy.targetIf : Combat.hitIf.list[enemy.targetIf];
			
		if(Combat.targetIf.global(enemy,tar) && hIf(tar,enemy)){
			var diffX = enemy.x - tar.x;
			var diffY = enemy.y - tar.y;
			var diff = Math.sqrt(diffX*diffX+diffY*diffY);
			if(diff <= enemy.moveRange.aggressive){
				var diffModded = 1/(diff+enemy.targetMod.rangeMod);
				targetList.push({'mod':diffModded,'id':i});
			}
		}
	}
	
	if(targetList.length){
		enemy.target = targetList.random().id;	
	}else {enemy.target = null;}	
}

Mortal.loop.repulsion = function(enemy){
	for(var i in List.mortal){
		if(enemy != List.mortal[i]){
			if(Collision.RectRect(Collision.getBumperBox(enemy),Collision.getBumperBox(List.mortal[i]))){
				var diffX = enemy.x- List.mortal[i].x;
				var diffY = enemy.y- List.mortal[i].y;
				var angle = atan2(diffY,diffX);
				
				enemy.spdX += 15*cos(angle); enemy.spdY += 15*sin(angle);
				List.mortal[i].spdX += -15*cos(angle); List.mortal[i].spdY += -15*sin(angle);
			}		
		}		
	}
}


Mortal.loop.input = function(mort){
	//update enemy input for movement.
	
	//Combat
	if(mort.combat && mort.target && List.all[mort.target]){
		var target = List.all[mort.target];
		var diffX = target.x - mort.x;
		var diffY = target.y - mort.y;
		var diff = Math.sqrt(diffX*diffX+diffY*diffY);
		
		mort.angle = atan2(diffY,diffX);
		
		//OK
		if(diff  >= mort.moveRange.ideal - mort.moveRange.confort && diff  <= mort.moveRange.ideal + mort.moveRange.confort){
			mort.moveInput = [0,0,0,0];
		}
		//Too Far
		else if(diff  >= mort.moveRange.ideal + mort.moveRange.confort){
			mort.moveInput[0] = diffX > 0;
			mort.moveInput[1] = diffY > 0;
			mort.moveInput[2] = diffX < 0;
			mort.moveInput[3] = diffY < 0;	
		}	
		//Too Close
		else if(diff  <= mort.moveRange.ideal - mort.moveRange.confort){
			mort.moveInput[0] = diffX < 0;
			mort.moveInput[1] = diffY < 0;
			mort.moveInput[2] = diffX > 0;
			mort.moveInput[3] = diffY > 0;	
		}	
		//Out of Zone
		if(diff  >= mort.moveRange.farthest){
			if(!mort.status.knock.active.time){mort.active = 0;}	//Otherwise knock stops weird
			mort.moveInput = [0,0,0,0];
		}
		
		for(var i in mort.moveInput){	if(Math.random()< 0.02){ mort.moveInput[i] = 0;} }	//Prevent Piling
		mort.abilityChange.press = '111111111111111';
		
		mort.mouseX = Cst.WIDTH2+diffX; 
		mort.mouseY = Cst.HEIGHT2+diffY;
		
	}
	
	//Not In Combat
	if(!mort.combat || !mort.target){ 
		mort.abilityChange.press = '000000000000000';
		mort.angle = mort.moveAngle + 10;	//quick fix
		if(Math.random() < 1/mort.changeDir){
			for(var i in mort.moveInput){
				mort.moveInput[i] = Math.floor(Math.random()*1.5);
			}		
		}
	}	
}

Mortal.loop.input.ability = function(mort){
	var target = List.all[mort.target];
	var diffX = target.x - mort.x;
	var diffY = target.y - mort.y;
	var diff = Math.sqrt(diffX*diffX+diffY*diffY);
	
	
	
	

}

//Non-Combat
Mortal.loop.trade = function(mort){
	var key = mort.id;
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

//test if player has move away to end dialogue
Mortal.loop.dialogue = function(mort){
	var key = mort.id;
	var dx = List.main[key].dialogueLoc.x;
	var dy = List.main[key].dialogueLoc.y;
	if(!Collision.PtRect({'x':mort.x,'y':mort.y},[dx-100,dx+100,dy-100,dy+100])){
		Dialogue.end(key);
	}


}

Mortal.loop.friendList = function(mort){
	var key = mort.id;
	var fl = List.main[key].social.list.friend;
    
	for(var i in fl){
		Chat.send.pm.test(List.all[key].name,i,function(status,from,to){
			fl[to].online = status;
		});			
	}
}

Mortal.loop.attackReceived = function(mort){
	for(var i in mort.attackReceived){
		mort.attackReceived[i] -= 25;
		if(mort.attackReceived[i] <= 0){
			delete mort.attackReceived[i];
		}
	}
}









