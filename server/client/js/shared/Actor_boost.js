Actor.boost = function(act, boost){	//boost: { 'stat':'globalDmg','value':1,'type':'*','time':100,'name':'weapon'}
	//Add a boost to a actor

	//list[i]: i = stat
	//toUpdate[i]: i = stat
	//fast[i]: i = stat@source
	
	if(Array.isArray(boost)){
		for(var i in boost) Actor.boost(act,boost[i]); return;
	}
	
	var b = Tk.useTemplate(Actor.boost.template(),boost);
	b.id = b.stat + '@' + b.name;
	
	if(b.time > 250){ b.spd = 'slow'; }
	if(b.time < 25){ b.spd = 'fast'; }
	
	act.boost[b.spd][b.id] = b;
	act.boost.list[b.stat].name[b.id] = b;
	act.boost.toUpdate[b.stat] = 1;
	
}

Actor.boost.template = function(){
	return {
		name:'Im dumb.',
		time:Cst.bigInt,
		type:'+',
		spd:'reg',
	}
}	

Actor.boost.remove = function(act, boost){
	var stat = boost.stat;
	if(boost.name === 'curse') delete act.curseClient[stat];
	delete act.boost.list[stat].name[boost.id]
	delete boost; 
	Actor.update.boost(act,stat);
}

Actor.boost.removeById = function(act, id){	//TOFIX		name: STAT@ID
	var stat = id.split("@")[0];
	var blist = act.boost.list[stat];
	if(blist && blist.name[id]){
		Actor.boost.remove(act,blist.name[id]);
	}
}

Actor.boost.removeAll = function(act){
	for(var i in act.boost.list)
		for(var j in act.boost.list[i].name)
			delete act.boost.list[i].name[j];
	act.curseClient = {};
	Actor.update.boost(act,'all');
}


Actor.boost.enemyPower = function(act,num){
	var dmg = 1 + Math.sqrt(num-1) * 0.25;
	var def = 1 + Math.sqrt(num-1) * 0.50;
	Actor.boost(act,[
		{'stat':'globalDmg','value':dmg || 1,'type':'*','time':60*1000,'name':'enemypower'},
		{'stat':'globalDef','value':def || 1,'type':'*','time':60*1000,'name':'enemypower'},
	]);
}


Actor.permBoost = function(act,source,boost){
	//remove permBoost if boost undefined
	if(boost){	act.permBoost[source] = Tk.arrayfy(boost);
	} else { delete act.permBoost[source]; }
	
	Actor.update.permBoost(act);
	Actor.update.mastery(act);
}

Actor.permBoost.stack = function(b){	//if boost same thing, add values
	var tmp = {};	
	for(var i in b){
		var name = b[i].type + '-onlyusedhere-' + b[i].stat;
		if(!tmp[name]) tmp[name] = {'type':b[i].type,'stat':b[i].stat,'value':0};
		tmp[name].value += b[i].value;
	}
	return tmp.$toArray();
}

Actor.update = {};
Actor.update.mastery = function(act){
	//Note: mod is applied in Combat.attack.mod.act
	var mas = act.mastery;
	for(var i in mas){
		for(var j in mas[i]){
			var m = mas[i][j];
			m.sum = Math.pow(m['x'] * m['*'],m['^']) + m['+'];
		}
	}
}

Actor.update.permBoost = function(act){
	var pb = act.boost.list;
	
	//Reset to PermBase
	for(var i in pb){
		pb[i].base = pb[i].permBase;	
		pb[i].max = pb[i].permMax;
		pb[i].min = pb[i].permMin;
		pb[i].x = 1;
		pb[i].xx = 1;
		pb[i].xxx = 1;
		pb[i].p = 0;
		pb[i].pp = 0;
	}
	
	//Update Value
	for(var i in act.permBoost){	//i = Source (item)	
		for(var j in act.permBoost[i]){	//each indidual boost boost
			var b = act.permBoost[i][j];
			
			if(b.type === '+' || b.type === 'base'){pb[b.stat].p += b.value;}
			else if(b.type === '++'){pb[b.stat].pp += b.value;}
			else if(b.type === '*'){pb[b.stat].x += b.value;}
			else if(b.type === '**'){pb[b.stat].xx += b.value;}
			else if(b.type === '***'){pb[b.stat].xxx *= b.value;}		//used for very global things (map mod)
			else if(b.type === 'min'){pb[b.stat].min = Math.max(pb[b.stat].min,b.value);}
			else if(b.type === 'max'){pb[b.stat].max = Math.min(pb[b.stat].max,b.value);}			
		}
	}
	
	//Max and min
	for(var i in pb){
		pb[i].base *= pb[i].x;
		pb[i].base += pb[i].p;
		pb[i].base *= pb[i].xx;
		pb[i].base += pb[i].pp;
		pb[i].base *= pb[i].xxx;
		pb[i].base = Math.max(pb[i].base,pb[i].min);
		pb[i].base = Math.min(pb[i].base,pb[i].max);
	}
	
	Actor.update.boost(act,'all');
	
	for(var j in act.customBoost){ 
		if(act.customBoost[j] > 0)
			Db.customBoost[j].func(act.boost,act.customBoost[j],act.id);
	}	
}

Actor.update.boost = function(act,stat){	//for time manage, Actor.loop.boost
	if(!stat || stat === 'all'){ for(var i in act.boost.list) Actor.update.boost(act,i); return; }
	
	var stat = act.boost.list[stat];
	var sum = stat.base;
	
	for(var i in stat.name){
		var boost = stat.name[i];
		if(boost.type === '+') sum += boost.value;
		else if(boost.type === '*'){	sum += (boost.value-1)*stat.base; }
	}
	
	Tk.viaArray.set({'origin':act,'array':stat.stat,'value':sum});
}









