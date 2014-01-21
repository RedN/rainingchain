//boss
Init.db.boss = function(){
	Db.boss = {};
	
	Db.boss['fireTroll'] = function(){
		var boss = Boss.template();
		
		//Attributes
		boss.hole = Math.floor(Math.random()*6) + 2;
		boss.center = Math.random()*360;
		boss.opening = 10;
		
		//Attacks
		boss.attack['explosion'] = 
		{type:"strike",'angle':0,'amount':1, 'aim': 0,'objImg':{'name':'fire4','sizeMod':0.75},
		'delay':15,'maxHit':3,'w':25,'h':25,'maxRange':10000,'minRange':0,
		'dmg':{'melee':25,'range':25,'magic':25,'fire':10,'cold':10,'lightning':5},
		'mods':	{}};
		
		boss.attack['spiral'] = 
		{type:"strike",'angle':0,'amount':1, 'aim': 0,'objImg':{'name':'fire4','sizeMod':0.5},
		'delay':0,'maxHit':3,'w':25,'h':25,'maxRange':10000,'minRange':0,
		'dmg':{'melee':25,'range':25,'magic':25,'fire':10,'cold':10,'lightning':5},
		'mods':	{}};
		
		//Loop
		boss.loop = function(){
		
			var boss = this;
			var mort = boss.parent;
			boss.frame++;
			
			Boss.target(boss);
		

			if(boss.frame % 1 == 0){
				for(var i = 0 ; i < 3 ; i++){
					var angle = Math.random()*360;
					var dist = Math.random()*200 + 500;
					var middleX = cos(angle)*dist;
					var middleY = sin(angle)*dist;
						
					Attack.creation(mort,boss.attack['explosion'],{'middleX':middleX,'middleY':middleY});    //attack?
				}
			}	

			
			if(boss.phase == 0){
				boss.center += 4.3;

				if(boss.frame % 1 == 0){
					var angle = boss.center;
					
					if(angle%360 < 5){ boss.hole = Math.floor(Math.random()*6) + 2;}
					
					for(var i = 0 ; i < 11 ; i++){
						var dist = 0 + 55*i;
						var middleX = cos(angle)*dist;
						var middleY = sin(angle)*dist;
							
						if(i != boss.hole && i != boss.hole+1){
							addStrike(mort,boss.attack['spiral'],{'middleX':middleX,'middleY':middleY});
						}
					}
				}
			}
		}
		return boss;
	}

	Db.boss['iceTroll'] = function(){
		
		var boss = Boss.template();
	
		boss.attack['fastSpear'] = 
		{type:"bullet",'angle':0,'amount':1, 'aim': 0,
		'objImg':{'name':"iceshard",'sizeMod':1},
		'dmg':{'melee':25,'range':25,'magic':25,'fire':10,'cold':10,'lightning':5},
		'mods':	{
		'spd':40
		}};			
		boss.attack['slowSpear'] = 
		{type:"bullet",'angle':0,'amount':1, 'aim': 0,
		'objImg':{'name':"iceshard",'sizeMod':1},
		'dmg':{'melee':25,'range':25,'magic':25,'fire':10,'cold':10,'lightning':5},
		'mods':	{
		'spd':5
		}};
		
		
		boss.attack['tooFar'] = 
		{type:"strike",'angle':0,'amount':1, 'aim': 0,'objImg':{'name':'iceshard','sizeMod':1.5},'hitImg':{'name':"ice1",'sizeMod':0.5},
		'delay':20,'maxHit':3,'w':50,'h':50,'maxRange':10000,'minRange':0,
		'dmg':{'melee':25,'range':25,'magic':25,'fire':10,'cold':10,'lightning':5},
		};
		
		
		boss.attack['midSpear'] = {type:"bullet",
			'angle':15,'amount':1, 'aim': 0,'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"ice2",'sizeMod':0.5},
			'dmgMain':1,'dmgRatio':{'melee':15,'range':5,'magic':5,'fire':2,'cold':27,'lightning':0},
			//'leech':{'chance':1,'magn':1,'time':1}
		};
		
		
		for(var i in boss.attack){
			boss.attack[i] = useTemplate(Attack.template(),boss.attack[i]);
		}
				
		boss.loop = function(){
			var boss = this;	var mort = boss.parent;		boss.frame++;	Boss.target(boss);
						
			if(boss.phase === 0){	//if boss on phase 0
				boss.opening = 30;
				for(var i in boss.target){	//for each player around the boss
					if(boss.frame % 4 == 0){	//every 4 frame
						//to form the V
						Combat.action.attack.perform(mort,boss.attack['midSpear'],{'angle':boss.angle[i]+boss.opening});
						Combat.action.attack.perform(mort,boss.attack['midSpear'],{'angle':boss.angle[i]-boss.opening});
						
						//random projectiles inside the V
						if(Math.random() < 0.4){
							Combat.action.attack.perform(mort,boss.attack['midSpear'],{'angle':boss.angle[i]+Math.randomML()*boss.opening});
							Combat.action.attack.perform(mort,boss.attack['midSpear'],{'angle':boss.angle[i]+Math.randomML()*boss.opening});
						}
					}
					break;
				}
				if(mort.hp/mort.resource.hp.max <= 3/5){	//if has 3/5 hp, transition to phase 1
					boss.phase = 1;
					boss.frame = 1;
					boss.hole = 6;
					boss.opening = 8;
				} 
			}
			
			if(boss.phase === 1){ //if boss on phase 1
				if(boss.frame % 80 === 0){	//every 80 frame
					boss.center = Math.random()*360;
					for(var j = 0 ; j < boss.hole ; j++){
						for(var k = 0 ; k < (360/boss.hole-2*boss.opening) ; k+=4){
							Combat.action.attack.perform(mort,boss.attack['midSpear'],{'angle':boss.center+360/boss.hole*j+boss.opening+k});
						}	
					}
				}		
			}
		}
		return boss;
	}

	
}

Boss = {};

Boss.template = function(){
	return {
		'phase':0,
		'frame':0,
		'target':{},
		'angle':{},
		'minion':{},
		'tooFar':1000,
		'attack':{},
		'ability':{},
	}
}

//Update Boss Target. can have multiple targets unlike regular enemy
Boss.target = function(boss){
	var mort = boss.parent;
	boss.target = {};
	for(var key in mort.activeList){ 
		if(List.all[key].type == 'player'){
			boss.target[key] = List.all[key];	
		}
	}
			
	for(var i in boss.target){
		var diffX = boss.target[i].x - mort.x;
		var diffY = boss.target[i].y - mort.y;
		var diff = Math.sqrt(diffX*diffX+diffY*diffY);
		boss.angle[i] = atan2(diffY,diffX);			
	}
}




