//Receive
Change = {};
Receive = Change.receive = {};

Receive.showData = false;

socket.on('change', function (data) {
try {
	if(Receive.showData) permConsoleLog(JSON.stringify(data));  //for testing
	data = Receive.parse(data);
 
    //Init Anim
	for(var i in data.a) Receive.init.anim(data.a[i]);	
	
	//Init Full List aka never seen before
	if(data.i){
		for(var i in data.i.f){
			Receive.init(data.i.f[i]);			
		}
        if(data.i.p) player = data.i.p;
	}
	
	//Update Player Private
	if(data.u){ 
        if(data.u.p){
            for(var j in data.u.p){
               changeViaArray({'origin':player,'array':j.split(','),'value':data.u.p[j]});	
            }
        }

    	//Update Full List
    	for(var i in data.u.f){
            var changeList = data.u.f[i];
            for(var j in changeList){
                changeViaArray({'origin':fullList[i],'array':j.split(','),'value':changeList[j]});
    		}
    		if(fullList[i]) fullList[i].toRemove = 0; 	
    	}
    	
    
    
    	//Update Main List
    	for(var i in data.u.m){
    		changeViaArray({'array':i.split(','),'value':data.u.m[i]});	
    	}
	}
	
	//Remove Inactive FullList
	for(var i in fullList){
		var mort = fullList[i];
		if(mort){	
			mort.toRemove++;
			if(mort.toRemove > 1){ //&& (!mort.sprite || (mort.sprite && mort.sprite.anim && !mort.sprite.anim.remove))){
				remove(i);
			}
		}
	}
	
} catch (err){ logError(err) }
});


Receive.parse = function(data){
	if(data.u){ 
	    if(data.u.p) data.u.p = Receive.parse.xya(data.u.p);
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

Receive.init = function(obj){
	if(obj.type === 'enemy' || obj.type === 'player'){ Receive.init.mortal(obj); }	
	else if(obj.type === 'bullet'){	Receive.init.bullet(obj);}	
	else if(obj.type === 'drop'){	Receive.init.drop(obj);	}
}

Receive.init.mortal = function(mort){
	mort.toRemove = 0;
	initSprite(mort,mort.sprite);
	mList[mort.id] = mort;	
	fullList[mort.id] = mort;	
	
}

Receive.init.bullet = function(bullet){
	bullet.toRemove = 0;
	initSprite(bullet,bullet.sprite);
	bList[bullet.id] = bullet;	
	fullList[bullet.id] = bullet;	
}

Receive.init.anim = function(a){
	if(typeof a.target === 'string'){
		if(a.target === player.name){	a.target = player;
		} else {a.target = fullList[a.target];}
	}
	
	a.id = Math.randomId();
	a.timer = 0;
	a.spdMod = a.spdMod || 1;
	if(a.target){  
		a.x = a.target.x;
		a.y = a.target.y;
		a.slot = 0;
			
		aList[a.id] = a;
	}
	
	if(sfxDb[animDb[a.name].sfx]){
		var sfx = Sfx.play(animDb[a.name].sfx);
		sfx.volume = Math.max(0.1,1 - 0.2*Math.floor(distancePtPt(player,a)/50));	
		sfx.play();
	}
	
	
}

Receive.init.drop = function(drop){
	drop.toRemove = 0;
	dropList[drop.id] = drop;
	fullList[drop.id] = drop;	
}



