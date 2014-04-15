
Actor.boost = function(act, boost){	//boost: { 'stat':'globalDmg','value':1,'type':'*','time':100,'name':'weapon'}
	//Add a boost to a actor

	//list[i]: i = stat
	//toUpdate[i]: i = stat
	//fast[i]: i = stat@source
	
	if(Array.isArray(boost)){
		for(var i in boost) Actor.boost(act,boost[i]);
		return;
	}
	
	var b = deepClone(boost);
	if(typeof act === 'string'){ act = List.all[act]; }
	var name = b.name || 'Im dumb.';
	var id = b.stat + '@' + name;
	b.time = b.time || 1/0;
	b.timer = b.time;		//otherwise, cuz reference, boost cant be used twice cuz time = 0
	b.type = b.type || '+';
	
	b.spd = 'reg';
	if(b.time > 250){ b.spd = 'slow'; }
	if(b.time < 25){ b.spd = 'fast'; }
	
	act.boost[b.spd][b.stat + '@' + name] = b;
	act.boost.list[b.stat].name[name] = b;
	act.boost.toUpdate[b.stat] = 1;
	
}

Actor.boost.remove = function(act, boost){
	var stat = boost.stat;
	if(boost.name === 'curse') delete act.curseClient[stat];
	delete act.boost.list[stat].name[boost.name]
	delete boost; 
	Actor.update.boost(act,stat);
}

Actor.boost.removeByName = function(act, name){	//TOFIX		name: STAT@ID
	var a = name.split("@");
	var b = act.boost.list[a[0]];
	if(b && b.name[a[1]]){
		Actor.boost.remove(act,b.name[a[1]]);
	}
}

Actor.boost.removeAll = function(act){
	for(var i in act.boost.list)
		for(var j in act.boost.list[i].name)
			delete act.boost.list[i].name[j];
	act.curseClient = {};
	Actor.update.boost(act,'all');
}


Actor.permBoost = function(act,source,boost){
	//remove permBoost if boost undefined
	if(boost){
		act.permBoost[source] = arrayfy(boost);
	} else { delete act.permBoost[source]; }
	
	Actor.update.permBoost(act);
	Actor.update.mastery(act);
}

Actor.permBoost.stack = function(b){	//if boost same thing, add values
	var tmp = {};	var temp = [];
	
	for(var i in b){
		if(b[i].stat){
			var name = b[i].type + '--' + b[i].stat;
			if(tmp[name] === undefined){tmp[name] = {'type':b[i].type,'stat':b[i].stat,'value':0};}
			tmp[name].value += b[i].value;
		} else {
			tmp[b[i].value] = b[i];
		}
	}
	for(var i in tmp){temp.push(tmp[i]);}
	return temp;
}

Actor.update = {};
Actor.update.mastery = function(act){
	//Note: mod is applied in Combat.action.attack.mod.act
	var mas = act.mastery;
	for(var i in mas){
		for(var j in mas[i]){
			mas[i][j].sum = Math.pow(mas[i][j]['x'] * mas[i][j]['*'],mas[i][j]['^']) + mas[i][j]['+'];
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
			else if(b.type === '***'){pb[b.stat].xxx *= b.value;}		//used for very global things (map mod, enemy power)
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
		if(act.customBoost[j])
			Db.customBoost[j].func(act.boost,act.id);
	}	
}

Actor.update.boost = function(act,stat){
	if(!stat || stat === 'all'){ for(var i in act.boost.list) Actor.update.boost(act,i); return; }
	
	var stat = act.boost.list[stat];
	var sum = stat.base;
	
	for(var i in stat.name){
		var boost = stat.name[i];
		if(boost.type === '+') sum += boost.value;
		else if(boost.type === '*'){	sum += (boost.value-1)*stat.base; }
	}
	
	viaArray.set({'origin':act,'array':stat.stat,'value':sum});
}









