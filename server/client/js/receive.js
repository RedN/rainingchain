//Receive
Change = {};

Receive = Change.receive = function(data){
try {
	if(Receive.showData) permConsoleLog(JSON.stringify(data));  //for testing
	data = Receive.parse(data);
 
    //Init Anim
	for(var i in data.a) Anim.creation(data.a[i]);	
	
	//Init Full List aka never seen before
	if(data.i){
		for(var i in data.i.f){
			Receive.init(data.i.f[i]);			
		}
	}
	
	//Update Player Private
	if(data.u){ 
        if(data.u.p){
            for(var j in data.u.p){
               viaArray.set({'origin':player,'array':j.split(','),'value':data.u.p[j]});	
            }
        }

    	//Update Full List
    	for(var i in data.u.f){
            var changeList = data.u.f[i];
            for(var j in changeList){
                viaArray.set({'origin':List.all[i],'array':j.split(','),'value':changeList[j]});
    		}
    		if(List.all[i]) List.all[i].toRemove = 0; 	
    	}
    	
		for(var i in data.u.r){
			if(List.all[i] && List.all[i].sprite){ 
				List.all[i].sprite.dead = List.all[i].type === 'enemy' ? 1/12 : 1/3;
			} else{removeAny(i);}			
		}
    
    	//Update Main List
    	for(var i in data.u.m){
    		viaArray.set({'origin':main,'array':i.split(','),'value':data.u.m[i]});	
    	}
	}
	
	//Remove Inactive FullList
	for(var i in List.all){
		var mort = List.all[i];
		if(mort){	
			mort.toRemove++;
			if(mort.toRemove > 40){ //&& (!mort.sprite || (mort.sprite && mort.sprite.anim && !mort.sprite.anim.remove))){
				removeAny(i);
			}
		}
	}
	
} catch (err){ logError(err) }
}

socket.on('change', Receive);
Receive.showData = false;

Receive.parse = function(data){
	if(data.u){ 
	    if(data.u.p){
			data.u.p = Receive.parse.xya(data.u.p); 
			data.u.p = Receive.parse.chargeClient(data.u.p);
		}
    	for(var i in data.u.f)	data.u.f[i] = Receive.parse.xya(data.u.f[i]);   
	}
	if(data.i){		
		for(var i in data.i.f) data.i.f[i] = Receive.parse.xya(data.i.f[i]);
	}
	
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


Receive.init = function(obj){
	if(obj.type === 'enemy' || obj.type === 'player'){ Receive.init.actor(obj); }	
	else if(obj.type === 'bullet'){	Receive.init.bullet(obj);}	
	else if(obj.type === 'drop'){	Receive.init.drop(obj);	}
}

Receive.init.actor = function(mort){
	mort.toRemove = 0;
	Sprite.creation(mort,mort.sprite);
	List.actor[mort.id] = mort;	
	List.all[mort.id] = mort;	
	
}

Receive.init.bullet = function(bullet){
	bullet.toRemove = 0;
	Sprite.creation(bullet,bullet.sprite);
	List.bullet[bullet.id] = bullet;	
	List.all[bullet.id] = bullet;	
}


Receive.init.drop = function(drop){
	drop.toRemove = 0;
	List.drop[drop.id] = drop;
	List.all[drop.id] = drop;	
}



