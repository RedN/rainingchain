//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(["requireDb","Boss", "Init", "Server", "Tk","Db", "List", "Cycle", "Actor", "Party", "Main", "Attack", "Strike", "Bullet", "Loop", "Activelist", "Group", "Itemlist", "Change", "Sign", "Save", "Load", "Combat", "Map", "Input", "Chat", "Dialogue", "Craft", "Drop", "Skill", "Test", "Performance", "Ability", "Item", "Plan", "Equip", "Quest", "Clan", "Collision", "Button", "Sprite", "Anim", "Command", "PassiveGrid", "Passive",'Contribution']));
Db.query.admin = function(socket,d){
	try {
		var key = socket.key;
		
		var p = List.all[key];
		var m = List.main[key];
		var mq = m.quest[Quest.test.name];
		var mqq = m.quest;
		var inv = List.main[key].invList;
		var add = function(id,amount){ Itemlist.add(inv,id,amount);}
		var tele = function(x,y,map){ Actor.teleport(p,{x:x,y:y,map:map}); }
		var act = p;
		var q = m.quest;
		
		var pa = Server.getPlayerAmount;
		
		//ts("tele(1700,260,'QfirstTown-east')")
		var le = {}; //all enemy
		var lp = {}; //all player
		var lc = {}; //all combat
		var lb = []; //all bullet
		
		
		var e = {};	//all enemy nearby
		var c = {}; //all combat enemy nearby
		var pl = {}; //all player nearby 
		var b = [];	//all bullet nearby
		

		for(var i in List.all){	//cant use act
			var mort = List.all[i];
			if(mort.type === 'npc'){
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
		
		
		
		var s = function(id){	//select a actor via name or id
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
		
		for(var i in e){
			if(e[i].combat && e[i].type !== 'player') var e1 = e[i];
			if(!e[i].combat && e[i].type !== 'player') var n1 = e[i];
			if(e[i].type === 'player')	var p1 = e[i];
		}
		
		
		
		var info = eval(d.command);
		var data = JSON.stringify(info);
		INFO(info);
		socket.emit('testing', {'data':data} );				
	} catch (err){
		ERROR.err(3,err);
		socket.emit('testing', 'failure');
	}			
}


//Testing
if(!SERVER){	//}
	ts = function(command){socket.emit('testing', {'command':command});}
	ts.b = function(){
		$("#tsDiv")[0].style.visibility = 'visible';	
	}
	ts.s = function(){
		var str = [];
		for(var i in Db.stat) str.push({'stat':i,'value':2,'type':'+'});
		str = Tk.stringify(str);
		ts("Actor.permBoost(p,'super'," + str + ')');
	}
	ts.l = function(){
		ts("JSON.stringify(List.nameToKey)");
	}
	ts.h = function(){
		INFO('s:select via name or id' + 
		'\nsm: select main' +
		'\na: actor partial name' +
		'e1, p1, n1: one close' +
		'\nle lp lc lb : all' +
		'\ne c pl b : nearby');	
	}
	
	
	socket.on('testing', function (d) { 
		if(d && d.data){ 
			try { ts.a = JSON.parse(d.data); INFO(ts.a); } 
			catch (err){ ERROR.err(3,err); }	
		}
	});
	
	
	
//{	
}





