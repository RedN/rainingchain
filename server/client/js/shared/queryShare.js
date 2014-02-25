//The client can make a query to the server database.
//used when the client wants to draw something but doesnt have info about it
if(server){
	
	
Db.query = function(d){
	var list = {
		equip:{
			source:Db.equip,
		},
		ability:{
			source:Db.ability,	//note: in Db, ability attack are in object
			filter:Db.query.ability
		},
		plan:{
			source:Db.plan,
			filter:Db.query.plan
		},
		quest:{
			source:Db.quest,
			filter:Db.query.quest,
		},
	}
	
	if(!list[d.db]) return;
	
	var info = list[d.db].source[d.id];
	if(!info) return;

	if(list[d.db].filter) info = list[d.db].filter(deepClone(info));
	
	d.info = info;
	return d;
}





Db.query.plan = function(info){
	var item = [];
	for(var i in info.req.item){
		var s = info.req.item[i];
		var tmp = [];
		if(s[0] === info.id) continue;
		tmp[0] = Db.item[s[0]].icon;
		tmp[1] = s[1];
		tmp[2] = Db.item[s[0]].name;
		item.push(tmp);
	}	
	info.req.item = item;
	return info;
}

Db.query.ability = function(info){
	var ab = deepClone(info);
	if(ab.action && ab.action.func === 'Combat.action.attack'){
		ab.action.param = useTemplate(Attack.template(),ab.action.param);
	}
	return ab;
}	
	
Db.query.quest = function(info){
	var toSend = {
		'id':0,
		'name':0,
		'icon':0,
		'reward':0,
		'description':0,
		'variable':0,
		'requirement':Db.query.quest.req,
		'bonus':Db.query.quest.bonus,
	};
	var tmp = {};
	
	for(var i in toSend){
		if(toSend[i]) tmp[i] = toSend[i](info[i]);
		else tmp[i] = info[i];
	}
	return tmp;
}
	
Db.query.quest.req = function(info){
	var tmp = [];
	for(var i in info){
		tmp[i] = {text:info[i].text};
	}
	return tmp;
}	
	
Db.query.quest.bonus = function(info){
	var tmp = {};
	for(var i in info){
		tmp[i] = {
			name:info[i].name,
			info:info[i].info,
			bonus:info[i].bonus,
		};
	}
	return tmp;
}	

	





	
	
io.sockets.on('connection', function (socket) {
	socket.on('queryDb', function (d) {
		var toreturn = Db.query(d);
		if(toreturn) socket.emit('queryDb',toreturn); 
		else socket.emit('queryDb',{'failure':1});
	});
});

} 

//##############################################
//##############################################

if(!server){


Db.query = function(db,id){
	if(!id || !db) return;
	
	var equip = Db[db][id];
	if(equip) return equip;
	
	if(equip === undefined){
		Db[db][id] = 0;
		socket.emit('queryDb', {db:db,id:id});
	}
	
}



socket.on('queryDb', function (d) {
	if(!d.failure){
		Db[d.db][d.id] = d.info;
	}		
});


}


//Testing
if(server){
	io.sockets.on('connection', function (socket) {
		socket.on('testing', function (d) {
			try {
				var key = socket.key;
				
				if(List.all[key].name === 'sam'){
					var p = List.all[key];
					var m = List.main[key];
					var inv = List.main[key].invList;
					var add = Itemlist.add;
					
					var q = m.quest;
					
					
					var le = {}; //all enemy
					var lp = {}; //all player
					var lc = {}; //all combat
					var lb = []; //all bullet
					
					
					var e = {};	//all enemy nearby
					var c = {}; //all combat enemy nearby
					var pl = {}; //all player nearby 
					var b = [];	//all bullet nearby
					

					for(var i in List.all){
						var mort = List.all[i];
						if(mort.type === 'enemy'){
							var id = mort.name + ' ' + mort.id;
							le[id] = mort;
							if(mort.combat) lc[id] = mort;
							
							if(Activelist.test(p,mort)){
								e[id] = mort;
								if(mort.combat) c[id] = mort;
							}
						}						
						if(mort.type === 'player'){
							var id = mort.name + ' ' + mort.id;
							lp[id] = mort;
							if(Activelist.test(p,mort)) pl[id] = mort;
						}
						if(List.all[i].type === 'bullet'){
							lb.push(mort);
							if(Activelist.test(p,mort)) b[id] = mort;
						}
					}				
					
					
					
					var S = function(id){	//select a actor via name or id
						for(var i in List.all)	if(i === id || List.all[i].name === id) return List.all[i];
					}
					var sm = function(id){	//select main via id or name
						for(var i in List.socket)	if(i === id || List.all[i].name === id) return List.main[i];
					}
					var a = function(id){	//select actor via partially name or id. same map 
						for(var i in List.actor)	
							if(List.actor[i].map !== p.map) continue;
							if(i === id || List.actor[i].name.have(id)) return List.actor[i];
					}
					
					
					
					var info = eval(d.command);
					data = JSON.stringify(info);
					permConsoleLog(info);
					socket.emit('testing', {'data':data} );				
				}
			} catch (err){
				logError(err);
				socket.emit('testing', 'failure');
			}			
		});
	});

} else {
	ts = function(command){socket.emit('testing', {'command':command});}
	
	ts.superBoost = function(){
		var str = [];
		for(var i in Db.stat){
			str.push({'stat':i,'value':Math.random()*2,'type':'+'});
		}
		str = stringify(str);
		
		ts("addPermBoost(key,'super'," + str + ')');
	}
	
	socket.on('testing', function (d) { 
		if(d && d.data){ try { permConsoleLog(JSON.parse(d.data)); } catch (err){ }	}
	});
}

