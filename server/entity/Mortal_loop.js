//####Update Mortal####
Mortal.loop = function(mort){	
	Test.loop.mortal(i);
	if(frameCount % 25 === 0){ Mortal.loop.activeList(mort); }
	if(!mort.active || mort.dead) return;
		
	if(mort.combat){
		if(mort.type == 'enemy'){
			if(Math.random() < 1/mort.targetMod.period || !mort.target){ Mortal.loop.target(mort); }  //update Enemy Target
			if(mort.hp <= 0){ Mortal.death(mort);}
			if(mort.target && mort.boss){ mort.boss.loop();}    //custom boss loop
		}
		Mortal.loop.aim(mort); //impact max spd depending on aim
		Mortal.loop.ability(mort);
		Mortal.loop.regen(mort);    
		Mortal.loop.status(mort);	
		Mortal.loop.boost(mort);
		Mortal.loop.summon(mort);				
	}
	
	if(mort.move){
		Mortal.loop.bumper(mort);     //test if collision with map    
		if(mort.type !== 'player'){ Mortal.loop.input(mort); }    //simulate enemy key press depending on target
		Mortal.loop.move(mort);   //move the actor
	}
	if(mort.type === 'player'){
		var i = mort.id;
		if(frameCount % 2 == 0){ Draw.loop(i); }    //draw everything and add button
		if(frameCount % 25 == 0){ Mortal.loop.friendList(mort); }    //check if any change in friend list
		if(List.main[i].windowList.trade){ Mortal.loop.trade(mort); };    
		if(List.main[i].dialogue){ Mortal.loop.dialogue(mort); }
		
		Test.loop.player(i);	
	}
		
}

//Combat
Mortal.loop.ability = function(m){
	var alreadyBoosted = {};
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
		
		if(press && charge[s.id] >= s.period){
			//Mana
			//for(var j in s.cost){if(s.cost[j] > m.mana[j]){ return;}}
			//for(var j in s.cost){m.mana[j] -= s.cost[j];}
			
			//Charge
			charge[s.id] = Math.min(charge[s.id] % s.period,1);
			
			//Reset the ability and related abilities
			for(var j in s.reset){
				for(var k in m.ability){
					if(!m.ability[k]) continue;
					if(m.ability[k].type == j){
						m.abilityChange.charge[k] = m.abilityChange.charge[k] * s.reset[j];
					}
				}
				if(j == 'tag'){
					for(var p in s.reset.tag){
						for(var n in m.ability){
							if(!m.ability[n]) continue;
							if(m.ability[n].tag && n != i && m.ability[n].tag.indexOf(p) != -1){
								m.abilityChange.charge[n] = m.abilityChange.charge[n] * s.reset.tag[p];
							}
						}
					}
				}
				
			}
			
			
			
			//Do Ability Action (ex: Combat.action.attack)
			for(var j in s.action){
				keyFunction(m.id,s.action[j].func,s.action[j].param);
			}
			break;	//1 ability per frame max
		}
	}

}

Mortal.loop.status = function(mort){
	Mortal.loop.status.knock(mort);
	Mortal.loop.status.burn(mort);
	Mortal.loop.status.bleed(mort);
	Mortal.loop.status.confuse(mort);
}

Mortal.loop.status.knock = function(mort){
	if(mort.knocked.time > 0){ 
		mort.spdX = cos(mort.knocked.angle)*mort.knocked.magn;
		mort.spdY = sin(mort.knocked.angle)*mort.knocked.magn;
		mort.knocked.time--;
	}
}

Mortal.loop.status.confuse = function(mort){
	if(mort.confused.time > 0){
		mort.confused.time--;
	} 
}

Mortal.loop.status.burn = function(mort){
	if(mort.burned.time > 0){
		if(!mort.burned.type || mort.burned.type == 'hp'){ mort.hp *= (1-mort.burned.magn);}
		if(mort.burned.type == 'maxHp'){ mort.hp -= mort.resource.hp.max*mort.burned.magn;}
		mort.burned.time--;
	}
}

Mortal.loop.status.bleed = function(mort){
	for(var i in mort.bleeded){
		mort.hp -= mort.bleeded[i].magn;
		mort.bleeded[i].time--;
		if(mort.bleeded[i].time <= 0){ mort.bleeded.splice(i,1); }
	}
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
    if(mort.summoned && frameCount % 5 == 0){
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

//test collision with map
Mortal.loop.bumper = function(mort){
	mort.x = Math.max(mort.x,50);
	mort.x = Math.min(mort.x,List.map[mort.map].grid[0].length*32-50);
	mort.y = Math.max(mort.y,50);
	mort.y = Math.min(mort.y,List.map[mort.map].grid.length*32-50);
	
	var bumperBox = mort.bumperBox;
		
	for(var i = 0 ; i < 4 ; i ++){
		mort.bumper[i] = Collision.PtMap({x:mort.x + bumperBox[i].x,y:mort.y + bumperBox[i].y},mort.map,mort);
	}
}

//update movement. depends on spd.
Mortal.loop.move = function(mort){
	if(mort.confused && mort.confused.time > 0){ var bind = mort.confused.input;} else { var bind = [0,1,2,3]; }
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
			updateBumper(mort);
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
		if(frameCount % array[j] === 0){
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
			if(mort.type !== 'player'){ List.all[j].viewedBy[mort.id] = mort;}
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

//updat enemy input for movement.
Mortal.loop.input = function(mort){
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
			if(!mort.knocked.time){mort.active = 0;}	//Otherwise knock stops weird
			mort.moveInput = [0,0,0,0];
		}
		
		for(var i in mort.moveInput){	if(Math.random()< 0.02){ mort.moveInput[i] = 0;} }	//Prevent Piling
		mort.abilityChange.press = '111111111111111';
		
		mort.mouseX = WIDTH2+diffX; 
		mort.mouseY = HEIGHT2+diffY;
		
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











