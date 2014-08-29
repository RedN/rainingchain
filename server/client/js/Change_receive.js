//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Tk','Loop','Activelist','Input','Chat','Sprite','Main']));

//Receive
Change = {};
Change.receive = Receive = function(data){
try {
	Receive.startTime = Date.now();
	if(BISON.active) data = BISON.decode(data);
	
	if(Receive.showData){ //for testing
		var txt = JSON.stringify(data); 
		if(Receive.log) Receive.log += txt;
		else if(!Receive.searchFor || txt.have(Receive.searchFor)) INFO(txt);
	}
	
	if(Receive.freeze.applyUnfreeze) data = Receive.unfreeze(data);
	data = Receive.parse(data);
	
	//Update player
	for(var j in data.p){ 
		Tk.viaArray.set({'origin':player,'array':j.split(','),'value':data.p[j]});	       
	}
	
	//fix bug if in both list
	for(var i in data.i){
		if(data.r && data.r[i]) delete data.r[i];	//incase in both list
	}
	
    //Init Anim
	for(var i in data.a) Anim.creation(data.a[i]);	
	
	Receive.freeze.just = 0;
	
	//Init Full List aka never seen before
	for(var i in data.i) Receive.init(data.i[i],i);
	
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
		if(List.all[i] && List.all[i].sprite){ 
			List.all[i].sprite.dead = 1/data.r[i] || 1;	//ratio will impact alpha or fade out
		} else{Activelist.removeAny(i);}			
	}
    
	//Update Main List
	for(var i in data.m)	Tk.viaArray.set({'origin':main,'array':i.split(','),'value':data.m[i]});	
	
	//Remove Inactive FullList
	for(var i in List.all){
		var act = List.all[i];
		if(!act){continue; }
		if(++act.toRemove > 101){ 
			Activelist.removeAny(i);
		}	//aka no update for 2 sec
	}
	
	
	Loop();
	if(Receive.showTime) INFO(Date.now() - Receive.startTime);
} catch (err){ ERROR.err(3,err) }
}

socket.on('change', Receive);
Receive.showData = false;
Receive.log = '';
Receive.searchFor = '';
Receive.showTime = false;
Receive.startTime = 0;

Receive.parse = function(data){
	if(data.p)	data.p = Receive.parse.player(data.p);
	if(data.m)	data.m = Receive.parse.main(data.m);
	
	if(Receive.freeze.active){
		Receive.freeze.i.push(data.i);
		delete data.i;
		Receive.freeze.u.push(data.u);
		delete data.u;
	}
	
	
    for(var i in data.u){
		data.u[i] = Receive.parse.xya(data.u[i],i);
		data.u[i] = Receive.parse.update(data.u[i],List.all[i]);
	}
	for(var i in data.i){
		data.i[i] = Receive.parse.xya(data.i[i]);
	}
	
	return data;
}
	
//format [x,y,angle] becomes {x:1,y:1,angle:1}
Receive.parse.xya = function(info){
	if(info[0] && info.length === 3) info = {'x':info[0],'y':info[1],angle:info[2]};
	else if(info[0] && info.length === 2) info = {'x':info[0],'y':info[1]};
	else if(info.xya){ info.x = info.xya[0]; info.y = info.xya[1]; info.angle = info.xya[2]; delete info.xya }
	else if(info.xy){ info.x = info.xy[0]; info.y = info.xy[1]; delete info.xy }
	return info;
}
Receive.parse.update = function(info,act){
	if(info.a){ info.angle = info.a; delete info.a; }
	
	if(info.sa){ info['sprite,anim'] = info.sa; delete info.sa; }
	//if(typeof info.spd !== 'undefined'){ info.spdX = info.spd; delete info.spd; }
	
	if(act){
		if(info.x)	info.spdX = info.x - act.x; 
		if(info.y)	info.spdY = info.y - act.y; 
	}
	return info;
}

Receive.init = function(obj,id){
	if(obj[0] === 'b')	Receive.init.bullet(obj,id);
	else if(obj[0] === 's')	Receive.init.strike(obj,id);	
	else if(obj[0] === 'npc0' || obj[0] === 'npc' || obj[0] === 'player') Receive.init.actor(obj,id); 
	else if(obj.type === 'drop')	Receive.init.drop(obj,id);	
}

Receive.init.actor = function(draw,id){

	var act = {};
	act.id = id;
	act.x = draw[1];
	act.y = draw[2];
	act.lastX = draw[1];
	act.lastY = draw[2];
	act.angle = draw[3];
	act.sprite = {'name':draw[4],'anim':'walk','sizeMod':draw[5]};
	act.maxSpd = draw[6];
	act.context = draw[7];
		
	if(draw[0] === 'npc0'){
		act.type = 'npc';
		act.preventAbility = draw[8];
		act.minimapIcon = draw[9];
		act.hp = 1;
		act.resource = {'hp':{'max':1}};
		act.combat = 0;
	} else {
		act.type = draw[0];
		act.preventAbility = act.type === 'player' ? false : draw[8];
		act.minimapIcon = draw[9];
		act.hp = draw[10];
		act.resource = {'hp':{'max':draw[11]}};
		act.weakness = {resist:draw[12].slice(0,-1).split(',') || [],weak:draw[13].slice(0,-1).split(',') || []};	//BAD
		act.modList = draw[14];
		Receive.init.actor.setContext(act);
				
		act.combat = 1;
	}
		
	act.toRemove = 0;
	act.spd = 0;
	act.spdX = 0;
	act.spdY = 0;
	
	Sprite.creation(act,act.sprite);
	List.actor[act.id] = act;	
	List.all[act.id] = act;	
	
}

Receive.init.actor.setContext = function(act){	//use weakness
	var text = '<span style="font:bold 20px Kelly Slab;line-height:100%;" >' + act.context + '</span>';
	
	for(var i in act.modList)	text += '<br><span class="shadow" style="font:15px Kelly Slab;line-height:100%;">' + act.modList[i] + '</span>';
	
	if(act.weakness.resist[0] === '') act.weakness.resist = [];
	if(act.weakness.weak[0] === '') act.weakness.weak = [];
	if(act.weakness && act.weakness.weak && (act.weakness.weak.length || act.weakness.resist.length)){
		text += '<br><span style="font:bold 15px Kelly Slab;line-height:100%;">';
		if(act.weakness.weak.length){
			text += "Weak: ";
			text += '<span class="shadow" style="color:' + CST.element.toColor[act.weakness.weak[0]] + ';">' + act.weakness.weak[0].capitalize() + '</span>';
			if(act.weakness.resist.length) text += ' - ';
		}
		if(act.weakness.resist.length){
			text += "Resist: ";
			text += '<span class="shadow" style="color:' + CST.element.toColor[act.weakness.resist[0]] + ';">' + act.weakness.resist[0].capitalize() + '</span>';
			text = text.slice(0,-1);
		}	
		text += '</span>';
	}
	act.context = text;
}

Receive.init.strike = function(s,id){

	var st = {
		type:'strike',
		id:id,
		delay:s[1],
		point:[
			{x:s[2],y:s[3]},
			{x:s[4],y:s[5]},
			{x:s[6],y:s[7]},
			{x:s[8],y:s[9]},
		],	
	}
	
	
	List.strike[id] = st;
	List.all[id] = st;


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


Receive.parse.player = function(p){
	p = Receive.parse.xya(p); 
	p = Receive.parse.update(p,player); 
	p = Receive.parse.player.chargeClient(p);
	
	//teleport fadeout
	if(p.map){
		Main.screenEffect(main,'fadeout',{'time':30,'maxTimer':30,'color':'black'});
		Receive.freeze.active = true;
		setTimeout(function(){ Receive.freeze.applyUnfreeze = true; }, 15*40);
	}
	if(Receive.freeze.active){
		Receive.freeze.x = p.x || Receive.freeze.x;
		Receive.freeze.y = p.y || Receive.freeze.y;
		Receive.freeze.map = p.map || Receive.freeze.map;
		delete p.map; delete p.x; delete p.y;
	}
	return p;
}

Receive.parse.player.chargeClient = function(p){	//could be used when needed instead of all the time
	if(typeof p['ac'] === 'string'){
		var charge = p['ac'];
		var tmp = [0,0,0,0,0,0];
		for(var i = 0 ; i < charge.length ; i++){ 
			tmp[i] = charge[i] === 'R' ? 1 : parseInt(charge[i],36)/36;
		}
		p['abilityChange,chargeClient'] = tmp;
		delete p.ac
	}
	return p;
}


Receive.freeze = {
	active:false,
	x:0,
	y:0,
	map:0,
	i:[],
	u:[],
	applyUnfreeze:0,
};

Receive.unfreeze = function(data){ 
	Receive.freeze.applyUnfreeze = false;

	Receive.freeze.active = false;
	player.x = Receive.freeze.x || player.x;
	player.y = Receive.freeze.y || player.y;
	player.map = Receive.freeze.map;
	
	data.i = data.i || {};
	for(var i in Receive.freeze.i)
		for(var j in Receive.freeze.i[i])
			data.i[j] = Receive.freeze.i[i][j];
	Receive.freeze.i = [];
	
	data.u = data.u || {};		//problem because overwrite him other
	for(var i in Receive.freeze.u)
		for(var j in Receive.freeze.u[i]){
			data.u[j] = Tk.useTemplate(data.u[j] || {},Receive.freeze.u[i][j]);
		}
	Receive.freeze.u = [];
	
	return data;
}


Receive.parse.main = function(m){
	for(var i in m['social,message']) Chat.receive(m['social,message'][i]);		
	if(m.chatInput){	Tk.applyFunc(Input.add,m.chatInput);}
	
	if(m.sfx) Sfx.play(m.sfx);
	if(m.song) Song.play(m.song);
	if(m.help) Help.open(m.help);

	if(m['arrow,add']){
		for(var i = 0; i < m['arrow,add'].length; i++)
			Draw.arrow.add(m['arrow,add'][i]);
	}
	if(m['arrow,remove']){
		for(var i = 0; i < m['arrow,remove'].length; i++) 
			Draw.arrow.remove(m['arrow,remove'][i]);
	}
	if(m.questComplete){
		var a = m.questComplete;
		setTimeout(function(){
			Draw.questComplete(a);
		},3000);
	}
	if(m.questRating) Draw.questRating(m.questRating);
	
	if(m.contribution)	setTimeout(function(){ Init.contribution(false); },250);
	
	delete m.questRating;
	
	delete m.questComplete;
	delete m['arrow,remove'];
	delete m['arrow,add'];
	
	delete m['social,message'];
	delete m['chatInput'];
	delete m['sfx'];
	delete m['song'];
	delete m['help'];
	
	return m;
	
	
}


