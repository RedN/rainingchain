//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Db','Actor','Tk']));
Actor.boost = function(act, boost){	//boost: { 'stat':'globalDmg','value':1,'type':'*','time':100,'name':'weapon'}
	//Add a boost to a actor

	//list[i]: i = stat
	//toUpdate[i]: i = stat
	//fast[i]: i = stat@source
	
	if(Array.isArray(boost)){
		for(var i in boost) Actor.boost(act,boost[i]); return;
	}
	
	var b = Tk.useTemplate(Actor.boost.template(),boost,true);
	b.id = b.stat + '@' + b.name;
	
	if(b.time >= 250){ b.spd = 'slow'; }
	else if(b.time < 25){ b.spd = 'fast'; }
	
	act.boost[b.spd][b.id] = b;
	act.boost.list[b.stat].name[b.id] = b;
	act.boost.toUpdate[b.stat] = 1;
	
}

Actor.boost.template = function(){
	return {
		name:'Im dumb.',
		time:CST.bigInt,
		type:'+',
		spd:'reg',
	}
}	

Actor.boost.remove = function(act, boost){
	var stat = boost.stat;
	if(boost.name === 'combat.collision.curse'){ delete act.curseClient[stat];	act.flag.curseClient = 1;}
	delete act.boost.list[stat].name[boost.id]
	delete act.boost[boost.spd][boost.id];
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
	var tmp = {};
	for(var i in pb){
		tmp[i] = {};
		tmp[i].base = pb[i].permBase;	
		tmp[i].max = Db.stat[i].boost.permMax;
		tmp[i].min = Db.stat[i].boost.permMin;
		tmp[i].x = 1;
		tmp[i].xx = 1;
		tmp[i].xxx = 1;
		tmp[i].p = 0;
		tmp[i].pp = 0;
	}
	
	//Update Value
	for(var i in act.permBoost){	//i = Source (item)	
		for(var j in act.permBoost[i]){	//each indidual boost boost
			var b = act.permBoost[i][j];
			
			if(b.type === '+' || b.type === 'base'){tmp[b.stat].p += b.value;}
			else if(b.type === '++'){tmp[b.stat].pp += b.value;}
			else if(b.type === '*'){tmp[b.stat].x += b.value;}
			else if(b.type === '**'){tmp[b.stat].xx += b.value;}
			else if(b.type === '***'){tmp[b.stat].xxx *= b.value;}		//used for very global things (map mod)
			else if(b.type === 'min'){tmp[b.stat].min = Math.max(tmp[b.stat].min,b.value);}
			else if(b.type === 'max'){tmp[b.stat].max = Math.min(tmp[b.stat].max,b.value);}			
		}
	}
	
	//Max and min
	for(var i in tmp){
		var sum = ((((tmp[i].base * tmp[i].x) + tmp[i].p) * tmp[i].xx) + tmp[i].pp) * tmp[i].xxx;
		sum = sum.mm(tmp[i].min,tmp[i].max);
		pb[i].base = sum;
	}
	
	Actor.update.boost(act,'all');
	
	for(var j in act.statCustom){ 
		Db.statCustom[j].func(act.boost,act.statCustom[j],act);
	}	
	
	act.flag.permBoost = 1;
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









