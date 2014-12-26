//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN

var Receive = function(data,unfreeze){
try {
	Receive.START_TIME = Date.now();
	if(BISON.active) data = BISON.decode(data);
	Receive.showData(data);
	
	if(!Receive.freeze.onReceive(data)) return Receive.loop();	//cuz still need to run game

	//Update player
	Actor.applyChange(player,data.p);
	
    //Init Anim
	for(var i in data.a) 
		Anim(data.a[i]);	
	
	//fix bug if in both list
	for(var i in data.i) 
		if(data.r && data.r[i]) 
			delete data.r[i];	//incase in both list
	
	//Init Full List aka never seen before
	for(var i in data.i) 
		Receive.initEntity(data.i[i],i);
	
	//Update Full List
	for(var i in data.u){	
		var act = ActiveList.get(i);
		if(!act){ ERROR(2,'no act',JSON.stringify(data.u),i); continue;}
		act.toRemove = 0;
		Actor.applyChange(act,data.u[i]); //its not always Actor but doesnt change much,...
	}
   
	for(var i in data.r){	//remove
		var act = ActiveList.get(i);
		if(act && act.sprite){ 
			act.sprite.dead = 1/data.r[i] || 1;	//ratio will impact alpha or fade out
			if(act.isActor)
				act.hp = 0;
		} else {
			ActiveList.removeAny(i);	//ex: strike
		}			
	}
    
	//Update Main List
	Main.applyChange(main,data.m);
	
	//Remove Inactive FullList
	ActiveList.removeInactive();
	
	if(unfreeze !== true) 
		Receive.loop();
	
} catch (err){ ERROR.err(3,err) }
}

Receive.loop = function(){
	if(!CST.ASYNC_LOOP){
		var delay = (Date.now()-Receive.LAST_TIME)/2;
		Receive.LAST_TIME = Date.now();
		delay = delay.mm(1,100).r(0);
		if(Receive.showData.DELAY) INFO(delay);
		Game.loop();		//first
		setTimeout(Game.loop,delay);	//second mid way
	}
	if(Receive.SHOW_TIME) INFO(Date.now() - Receive.START_TIME);
}


Receive.init = function(){
	Socket.on('change', Receive);
}

Receive.SHOW_TIME = false;
Receive.START_TIME = 0;
Receive.LAST_TIME = Date.now();

Receive.showData = function(data){
	if(!Receive.showData.ACTIVE) return;
	var txt = JSON.stringify(data); 
	if(Receive.showData.LOG) Receive.log += txt;
	else INFO(txt);
}
Receive.showData.ACTIVE = false;
Receive.showData.LOG = false;
Receive.showData.DELAY = false;




Receive.initEntity = function(obj,id){
	if(obj[0] === 'b') return Receive.initEntity.bullet(obj,id);
	if(obj[0] === 's') return Receive.initEntity.strike(obj,id);	
	if(obj[0] === 'npc0' || obj[0] === 'npc' || obj[0] === 'player') return Receive.initEntity.actor(obj,id);
	if(obj[0] === 'drop')	return Receive.initEntity.drop(obj,id);
	return ERROR(3,'obj[0] doesnt have good type',obj);
}

Receive.initEntity.actor = function(obj,id){
	var act = Actor.undoInitPack(obj,id);
	Actor.addToList(act);
	ActiveList.addToList(act);
}

Receive.initEntity.strike = function(obj,id){
	var b = Strike.undoInitPack(obj,id);
	Strike.addToList(b);
	ActiveList.addToList(b);
}

Receive.initEntity.bullet = function(obj,id){
	var b = Bullet.undoInitPack(obj,id);
	Bullet.addToList(b);
	ActiveList.addToList(b);
}

Receive.initEntity.drop = function(obj,id){
	var b = Drop.undoInitPack(obj,id);
	if(b.color === 'yellow')
		Sfx.play('explosion');
	Drop.addToList(b);	
	ActiveList.addToList(b);
}


Receive.freeze = function(){
	Receive.freeze.ACTIVE = true;
	Main.screenEffect.add(main,Main.ScreenEffect.fadeout('mapTransition',25));
	setTimeout(function(){
		Receive.unfreeze();
	},500);
}
Receive.freeze.LIST = [];
Receive.unfreeze = function(){
	Receive.freeze.ACTIVE = false;
	for(var i in Receive.freeze.LIST)
		Receive(Receive.freeze.LIST[i],true);
	Receive.freeze.LIST = [];	
}

Receive.freeze.onReceive = function(data){
	if(data.p && data.p.map && typeof data.p.map === 'string' && data.p.map !== player.map){
		setTimeout(function(){
			player.map = data.p.map;
		},250);
		
		Receive.freeze();
	}
	if(Receive.freeze.ACTIVE){
		Receive.freeze.LIST.push(data);
		return false;
	}
	return true;
}






