//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Stat','Boost']));


Actor.Boost = function(type){
	return {          //timer aka needs to be updated every frame
		fast:{},
		reg:{},
		slow:{},
		toUpdate:{},
		list:Actor.Boost.list(type || 'player'),	//bad...
	};
}
Actor.Boost.list = function(type){
	return Stat.actorBoostList(type || 'player');
}



//#################

Actor.boost = function(act, boost){
	//Add a boost to a actor

	//list[i]: i = stat
	//toUpdate[i]: i = stat
	//fast[i]: i = stat@source
	
	if(Array.isArray(boost)){
		for(var i in boost) Actor.boost(act,boost[i]); return;
	}
	
	act.boost[boost.spd][boost.id] = boost;
	act.boost.list[boost.stat].name[boost.id] = boost;
	act.boost.toUpdate[boost.stat] = 1;
	
}

Actor.boost.remove = function(act, boost){
	var stat = boost.stat;
	if(boost.name === Boost.FROM_ABILITY){ 
		delete act.curseClient[stat];	
		Actor.setFlag(act,'curseClient');
	}
	delete act.boost.list[stat].name[boost.id]
	delete act.boost[boost.spd][boost.id];
	Actor.boost.update(act,stat);
}

Actor.boost.removeById = function(act,stat,name){
	var id = stat + Boost.SEPARATOR + name;
	var blist = act.boost.list[stat];
	if(blist && blist.name[id]){
		Actor.boost.remove(act,blist.name[id]);
	}
}

Actor.boost.removeAll = function(act,stringToMatch){
	stringToMatch = stringToMatch || '';	//'' = match all
	for(var i in act.boost.list){
		for(var j in act.boost.list[i].name){
			if(act.boost.list[i].name[j].name.contains(stringToMatch))
				Actor.boost.remove(act,act.boost.list[i].name[j]);
		}
	}
}

Actor.boost.loop = function(act){
	var list = Actor.boost.loop.INTERVAL;
	for(var spd in list){
		if(!Actor.testInterval(act,list[spd])) continue;
		
		for(var j in act.boost[spd]){	//j = boost id
			act.boost[spd][j].time -= list[spd];
			if(act.boost[spd][j].time < 0)
				Actor.boost.remove(act,act.boost[spd][j],spd,j);
		}
	}
	
	for(var i in act.boost.toUpdate){
		Actor.boost.update(act,i);
		delete act.boost.toUpdate[i];
	}
}
Actor.boost.loop.INTERVAL = {fast:2,reg:5,slow:25}; //fast = 2, no idea if good

Actor.boost.update = function(act,statName){	// !statName means all
	if(!statName){ for(var i in act.boost.list) Actor.boost.update(act,i); return; }
	
	var stat = act.boost.list[statName];
	var sum = stat.base;
	
	for(var i in stat.name){
		var boost = stat.name[i];
		if(boost.type === '+') sum += boost.value;
		else if(boost.type === '*'){	sum += (boost.value-1)*stat.base; }
	}
	Stat.setValue(act,statName,sum);
}

Actor.setBoostListBase = function(act){	//could be optimzed to only test things that could be changed via s.newNpc
	act.boost = Actor.Boost(act.type);
	for(var i in act.boost.list){
		act.boost.list[i].base = act.boost.list[i].permBase = Stat.getValue(act,i);	
	}
	if(act.type === 'player') 	//QUICKFIX
		act.boost.list[i].base = act.boost.list['bullet-spd'].permBase *= 3;
}

Actor.permBoost = function(act,source,boost){
	//remove permBoost if boost undefined
	if(boost)	
		act.permBoost[source] = Tk.arrayfy(boost);
	else 
		delete act.permBoost[source];
	
	Actor.permBoost.update(act);
	
	if(Actor.isPlayer(act))	//otherwise overwrite...
		Actor.mastery.update(act);
}

Actor.permBoost.update = function(act){
	var pb = act.boost.list;
	//Reset to PermBase
	var tmp = {};
	for(var i in pb){
		tmp[i] = {
			base:pb[i].permBase,
			max:Stat.get(i).value.max,
			min:Stat.get(i).value.min,
			x:1,xx:1,xxx:1,
			p:0,pp:0,
		}
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
	
	Actor.boost.update(act);
	
	for(var j in act.bonus.statCustom){ 
		Stat.get(j).customFunc(act.boost,act.bonus.statCustom[j],act);
	}	
	
	Actor.setFlag(act,'permBoost');
}










