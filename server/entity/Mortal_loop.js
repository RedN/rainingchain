//####Update Mortal####
Mortal.loop = function(mort){	
	if(frameCount % 25 === 0){ Mortal.loop.activeList(mort); }
	if(!mort.active) return;
	
	Test.loop.mortal(i);
	
	if(!mort.dead){
		if(mort.combat){
			if(mort.type == 'enemy'){
				if(Math.random() < 1/mort.targetMod.period || !mort.target){ Mortal.Enemy.loop.target(mort); }  //update Enemy Target
				if(mort.hp <= 0){death(mort);}
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
			if(mort.type != 'player'){ Mortal.Enemy.loop.input(mort); }    //simulate enemy key press depending on target
			Mortal.loop.move(mort);   //move the actor
		}
		if(mort.type === 'player'){
			var i = mort.id;
			if(frameCount % 2 == 0){ Draw.loop(i); }    //draw everything and add button
			if(frameCount % 25 == 0){ Mortal.Player.loop.fl(i); }    //check if any change in friend list
			if(mainList[i].windowList.trade){ Mortal.Player.loop.trade(i); };    
			if(mainList[i].dialogue){ Mortal.Player.loop.dialogue(i); }
			
			Test.loop.player(i);	
		}
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

Mortal.loop.status = function(player){
	Mortal.loop.status.knock(player);
	Mortal.loop.status.burn(player);
	Mortal.loop.status.bleed(player);
	Mortal.loop.status.confuse(player);
}

Mortal.loop.status.knock = function(player){
	if(player.knocked.time > 0){ 
		player.spdX = cos(player.knocked.angle)*player.knocked.magn;
		player.spdY = sin(player.knocked.angle)*player.knocked.magn;
		player.knocked.time--;
	}
}

Mortal.loop.status.confuse = function(player){
	if(player.confused.time > 0){
		player.confused.time--;
	} 
}

Mortal.loop.status.burn = function(player){
	if(player.burned.time > 0){
		if(!player.burned.type || player.burned.type == 'hp'){ player.hp *= (1-player.burned.magn);}
		if(player.burned.type == 'maxHp'){ player.hp -= player.resource.hp.max*player.burned.magn;}
		player.burned.time--;
	}
}

Mortal.loop.status.bleed = function(player){
	for(var i in player.bleeded){
		player.hp -= player.bleeded[i].magn;
		player.bleeded[i].time--;
		if(player.bleeded[i].time <= 0){ player.bleeded.splice(i,1); }
	}
}

Mortal.loop.regen = function(player){
	for(var i in player.resource){
		player[i] += player.resource[i].regen;
		player[i] = Math.min(player[i],player.resource[i].max);
	}
}

Mortal.loop.summon = function(player){
    //check if summon child still exist (assume player is the master)
	for(var i in player.summon){
		for(var j in player.summon[i].child){
			if(!fullList[j]){ delete player.summon[i].child[j]; }
		}		
	}
	
	//(assume player is child)
    if(player.summoned && frameCount % 5 == 0){
		if(!player.summoned.father || !fullList[player.summoned.father]){ Mortal.Enemy.remove(player); return; }
	    
	    //if too far, teleport near master
		if(player.map != fullList[player.summoned.father].map || distancePtPt(player,fullList[player.summoned.father]) >= player.summoned.distance){
			player.x = fullList[player.summoned.father].x + Math.random()*5-2;
			player.y = fullList[player.summoned.father].y + Math.random()*5-2;
			player.map = fullList[player.summoned.father].map;
		}	
		
		player.summoned.time -= 5;
		if(player.summoned.time < 0){
			Mortal.Enemy.remove(player);
		}
	}
}

//test collision with map
Mortal.loop.bumper = function(player){
	player.x = Math.max(player.x,50);
	player.x = Math.min(player.x,mapList[player.map].grid[0].length*32-50);
	player.y = Math.max(player.y,50);
	player.y = Math.min(player.y,mapList[player.map].grid.length*32-50);
	
	var bumperBox = player.bumperBox;
		
	for(var i = 0 ; i < 4 ; i ++){
		player.bumper[i] = Collision.PtMap({x:player.x + bumperBox[i].x,y:player.y + bumperBox[i].y},player.map,player);
	}
}

//update movement. depends on spd.
Mortal.loop.move = function(player){
	if(player.confused && player.confused.time > 0){ var bind = player.confused.input;} else { var bind = [0,1,2,3]; }
	if(player.bumper[0]){player.spdX = -Math.abs(player.spdX*0.5) - 1;} 
	if(player.bumper[1]){player.spdY = -Math.abs(player.spdY*0.5) - 1;}
	if(player.bumper[2]){player.spdX = Math.abs(player.spdX*0.5) + 1;} 
	if(player.bumper[3]){player.spdY = Math.abs(player.spdY*0.5) + 1;} 

	if(player.moveInput[bind[0]] && !player.bumper[0] && player.spdX < player.maxSpd){player.spdX += player.acc;}
	if(player.moveInput[bind[1]] && !player.bumper[1] && player.spdY < player.maxSpd){player.spdY += player.acc;}
	if(player.moveInput[bind[2]] && !player.bumper[2] && player.spdX > -player.maxSpd){player.spdX -= player.acc;}
	if(player.moveInput[bind[3]] && !player.bumper[3] && player.spdY > -player.maxSpd){player.spdY -= player.acc;}	
	
	//Friction + Min Spd
	player.spdX *= player.friction;	
	player.spdY *= player.friction;
	if (Math.abs(player.spdX) < 0.1){player.spdX = 0;}	
	if (Math.abs(player.spdY) < 0.1){player.spdY = 0;}
	if(player.spdX || player.spdY){ player.moveAngle = atan2(player.spdY,player.spdX); } 
	
	//Calculating New Position
	var dist = Math.pyt(player.spdY,player.spdX);
	var amount = Math.ceil(dist/30);
	if(amount >= 2){    //aka could pass thru walls => move step by step and test bumper every time
		//need fix, reason y stuck when too fast
		for(var i = 0 ; i < amount && !player.bumper[0] && !player.bumper[1] && !player.bumper[2] && !player.bumper[3]  ; i++){
			player.x += player.spdX/amount;
			player.y += player.spdY/amount;
			updateBumper(player);
		} 
	} else {
		player.x += player.spdX;
		player.y += player.spdY;
	}
	
}

//penalty if looking and moving in opposite direction
Mortal.loop.aim = function (mort){	
	var diffAim = Math.abs(mort.angle - mort.moveAngle);
	if (diffAim > 180){ diffAim = 360 - diffAim;}
	Mortal.boost(mort,{'stat':'maxSpd','type':"*",'value':Math.pow((360-diffAim)/360,1.5),'time':2,'name':'Aim'});
}

Mortal.loop.boost = function(player,full){
	var array = {'fast':1,'reg':5,'slow':25};
	for(var j in array){
		if(frameCount % array[j] === 0){
			for(var i in player.boost[j]){
				if(player.boost[j][i].timer < 0){ 
					var stat = player.boost[j][i].stat;
					delete player.boost.list[stat].name[player.boost[j][i].name]
					delete player.boost[j][i]; 
					updateSpecificBoostStat(player,stat);
				} else {
					player.boost[j][i].timer -= array[j];
				}
			}
		}
	}
	
	for(var i in player.boost.toUpdate){
		updateSpecificBoostStat(player,i);
		delete player.boost.toUpdate[i];
	}
	
	if(full){for(var i in player.boost.list){updateSpecificBoostStat(player,i);}}
}

Mortal.loop.activeList = function(mort){
	//Note: Could mix that together
		
	//Test Already in List if they deserve to stay
	for(var j in mort.activeList){		//bug here if fullList[j] is undefined
		if(!fullList[j]){
			delete mort.activeList[j];
			continue;
		}
		if(!ActiveList.test(mort,fullList[j])){
			delete fullList[j].viewedBy[mort.id];
			delete mort.activeList[j];
		}
	}
	
	//Add New Boys
	for(var j in fullList){
		if(ActiveList.test(mort,fullList[j]) && fullList[j].id != mort.id){
			mort.activeList[j] = fullList[j].id;
			if(mort.type !== 'player'){ fullList[j].viewedBy[mort.id] = mort;}
		}
	}
	
	mort.active = (Object.keys(mort.activeList).length !== 0 || mort.type == 'player')

}

Mortal.Enemy.loop = {};
Mortal.Enemy.loop.target = function(enemy){
    var targetList = {}; 
	for (var i in enemy.activeList){
		var tar = fullList[i];
		var hIf = typeof enemy.targetIf == 'function' ? enemy.targetIf : hitIfList[enemy.targetIf];
			
		if(globalTargetIf(enemy,tar) && hIf(tar,enemy)){
			var diffX = enemy.x - tar.x;
			var diffY = enemy.y - tar.y;
			var diff = Math.sqrt(diffX*diffX+diffY*diffY);
			if(diff <= enemy.moveRange.aggressive){
				var diffModded = 1/(diff+enemy.targetMod.rangeMod);
				targetList[i] = {'mod':diffModded,'id':i};
			}
		}
	}
	
	if(Object.keys(targetList).length){
		enemy.target = randomViaMod(targetList).id;	
	}else {enemy.target = null;}	
}

Mortal.Enemy.loop.repulsion = function(enemy){
	for(var i in mList){
		if(enemy != mList[i]){
			if(Collision.RectRect(Collision.getBumperBox(enemy),Collision.getBumperBox(mList[i]))){
				var diffX = enemy.x- mList[i].x;
				var diffY = enemy.y- mList[i].y;
				var angle = atan2(diffY,diffX);
				
				enemy.spdX += 15*cos(angle); enemy.spdY += 15*sin(angle);
				mList[i].spdX += -15*cos(angle); mList[i].spdY += -15*sin(angle);
			}		
		}		
	}
}

//updat enemy input for movement.
Mortal.Enemy.loop.input = function(mort){
	//Combat
	if(mort.combat && mort.target && fullList[mort.target]){
		var target = fullList[mort.target];
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


Mortal.Player.loop = {};
//Non-Combat
Mortal.Player.loop.trade = function(key){
	if(mainList[mainList[key].windowList.trade.trader]){
		mainList[key].windowList.trade.tradeList = mainList[mainList[key].windowList.trade.trader].tradeList;	
		mainList[key].windowList.trade.confirm.other = mainList[mainList[key].windowList.trade.trader].windowList.trade.confirm.self;
	
		if(mainList[key].windowList.trade.confirm.other && mainList[key].windowList.trade.confirm.self){
			tradeItem(key,mainList[key].windowList.trade.trader);
		}
	} else {
		mainList[key].windowList.trade = 0;
	}
}

//test if player has move away to end dialogue
Mortal.Player.loop.dialogue = function(key){
	var x = fullList[key].x;
	var y = fullList[key].y;
	var dx = mainList[key].dialogueLoc.x;
	var dy = mainList[key].dialogueLoc.y;
	if(!Collision.PtRect({'x':x,'y':y},[dx-100,dx+100,dy-100,dy+100])){
		Dialogue.end(key);
	}


}

Mortal.Player.loop.fl = function(key){
	var fl = mainList[key].friendList;
    
    var test = function(res){
		fl[to].online = res;
	};
		
	for(var i in fl){
		testSendPm(fullList[key].name,i,test);			
	}
}











