Init.db.sfx = function(){
	Db.sfx = {
		'fire1':{},
        







	}


	for(var i in Db.sfx){
		var tmp = [];
		for(var j = 0 ; j < 3 ; j++){
			var s = new Audio();
			s.src = Db.sfx[i].src ? 'snd/sfx/' + Db.sfx[i].src : 'snd/sfx/' + i + '.wav';
			s.volume = Db.sfx[i].volume || 1;
			s.delay = Db.sfx[i].delay || 0;
			tmp.push(s);
		}		
		
		Db.sfx[i] = tmp;
	}

}

Sfx = {};
Sfx.play = function(sfx){
	var i = 0;
	var id = sfx.name || sfx;
	while(Db.sfx[id][i]){
		if(Db.sfx[id][i].ended || !Db.sfx[id][i].currentTime){
			var s = Db.sfx[id][i];
			s.volume = sfx.volume;
			s.play();
			return;
		}
		i++;
	}
}

Sfx.creation = function(sfx){
	var s = useTemplate(Sfx.template(),sfx);
	s.id = Math.randomId();
	s.volume *= Db.sfx[s.name].volume;
	s.delay += Db.sfx[s.name].delay;
	if(s.delay === 0){
		Sfx.play(s); return;
	}
	List.sfx[s.id] = s;
}

Sfx.template = function(){
	return {
		'id':'fire1',
		'delay':0,
		'volume':1,	
	};
}

Sfx.remove = function(sfx){
	delete List.sfx[sfx.id];
}




