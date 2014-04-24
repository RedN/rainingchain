//Receive
Change = {};

Receive = Change.receive = function(data){
try {
	if(BISON.active) data = BISON.decode(data);
	if(Receive.showData) INFO(JSON.stringify(data));  //for testing
	if(!data) return;
	data = Receive.parse(data);
 
    //Init Anim
	for(var i in data.a) Anim.creation(data.a[i]);	
	
	//Init Full List aka never seen before
	for(var i in data.i) Receive.init(data.i[i],i);
	
	//Update Player Private
	for(var j in data.p)   Tk.viaArray.set({'origin':player,'array':j.split(','),'value':data.p[j]});	       

	//Update Full List
	for(var i in data.u){
		if(List.all[i]) List.all[i].toRemove = 0; 	
		else { ERROR(2,'no act',JSON.stringify(data.u),i); continue;}
		
		var changeList = data.u[i];
		for(var j in changeList){
			Tk.viaArray.set({'origin':List.all[i],'array':j.split(','),'value':changeList[j]});
		}
	}
    	
	for(var i in data.r){	//remove
		var id = data.r[i];
		if(List.all[id] && List.all[id].sprite){ 
			List.all[id].sprite.dead = List.all[id].type === 'npc' ? 1/12 : 1/3;	//ratio will impact alpha or fade out
		} else{removeAny(id);}			
	}
    
	//Update Main List
	for(var i in data.m)	Tk.viaArray.set({'origin':main,'array':i.split(','),'value':data.m[i]});	
	
	//Remove Inactive FullList
	for(var i in List.all){
		var act = List.all[i];
		if(!act){continue; }
		if(++act.toRemove > 40){ removeAny(i);}	//aka no update for 1 sec
	}
	
	//Update Bullet
	for(var i in List.bullet){	//need to be here so same tempo than server
		var b = List.bullet[i];
		if(b.spd === null || b.sprite.dead) continue;	//spd null if boomerang etc...
		b.x += Tk.cos(b.angle)*b.spd;
		b.y += Tk.sin(b.angle)*b.spd;	
	}

} catch (err){ ERROR.err(err) }
}

socket.on('change', Receive);
Receive.showData = false;

Receive.parse = function(data){
	if(data.p){
		data.p = Receive.parse.xya(data.p); 
		data.p = Receive.parse.chargeClient(data.p);
	}
    for(var i in data.u) data.u[i] = Receive.parse.xya(data.u[i]);   	
	for(var i in data.i) data.i[i] = Receive.parse.xya(data.i[i]);
	
	return data;
}

//format [x,y,angle] becomes {x:1,y:1,angle:1}
Receive.parse.xya = function(info){
	if(info[0] && info.length == 3){info = {'x':info[0],'y':info[1],'angle':info[2]};}
	else if(info[0] && info.length == 2){info = {'x':info[0],'y':info[1]};}
	else if(info.xya){ info.x = info.xya[0]; info.y = info.xya[1]; info.angle = info.xya[2]; delete info.xya }
	else if(info.xy){ info.x = info.xy[0]; info.y = info.xy[1]; delete info.xy }
	return info;
}
Receive.parse.chargeClient = function(info){	//could be used when needed instead of all the time
	if(typeof info['abilityChange,chargeClient'] === 'string'){
		var charge = info['abilityChange,chargeClient'];
		var tmp = [0,0,0,0,0,0];
		for(var i = 0 ; i < charge.length ; i++){ 
			tmp[i] = charge[i] === 'R' ? 1 : parseInt(charge[i],36)/36;
		}
		info['abilityChange,chargeClient'] = tmp;
	}
	return info;
}


Receive.init = function(obj,id){
	if(obj[0] === 'b'){	Receive.init.bullet(obj,id);}	
	if(obj.type === 'npc' || obj.type === 'player'){ Receive.init.actor(obj); }	
	else if(obj.type === 'drop'){	Receive.init.drop(obj);	}
}

Receive.init.actor = function(act){
	act.toRemove = 0;
	Sprite.creation(act,act.sprite);
	List.actor[act.id] = act;	
	List.all[act.id] = act;	
	
}

Receive.init.bullet = function(obj,id){
	/*
	bullet.toRemove = 0;
	Sprite.creation(bullet,bullet.sprite);
	List.bullet[bullet.id] = bullet;	
	List.all[bullet.id] = bullet;
	*/
	// ['b',Math.round(bullet.x),Math.round(bullet.y),Math.round(bullet.angle),bullet.sprite.name,bullet.sprite.sizeMod];
	
	var bullet = {
		toRemove:0,
		id:id,
		x:obj[1],
		y:obj[2],
		angle:obj[3],
		sprite:{name:obj[4],sizeMod:obj[5],anim:'travel'},
		spd:obj[6] || null,
	}
	Sprite.creation(bullet,bullet.sprite);
	List.bullet[id] = bullet;	
	List.all[id] = bullet;	
}


Receive.init.drop = function(drop){
	drop.toRemove = 0;
	List.drop[drop.id] = drop;
	List.all[drop.id] = drop;	
}



