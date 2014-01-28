Init.db.sfx = function(){
	Db.sfx = {
		'error':{src:'beep-03.ogg'},
		'menu':{src:'button-3.ogg',volume:0.1},
		'close':{src:'switch-1.ogg'},
		
		//Environement
		'river':{src:'stream-1.ogg'},



	


	}


	for(var i in Db.sfx){
		var s = Db.sfx[i];
		s.src = s.src ? 'music/sfx/' + s.src : 'music/sfx/' + i + '.ogg';
		s.volume = 	s.volume || 1;
		s.delay = s.delay || 0;	//not used
			
		s.list = [];
		for(var j = 0 ; j < 3 ; j++){	
			var a = new Audio();
			a.src = s.src;
			s.list.push(a);
		}	
	}

}

Sfx = {};
Sfx.play = function(sfx,volume){
	var id = sfx.name || sfx;
	var vol = sfx.volume || volume || 1;
	vol *= Db.sfx[id].volume;
	vol *= main.pref.volumeSfx/100 * main.pref.volumeMaster/100;
	
	var i = 0;
	while(Db.sfx[id].list[i]){
		if(Db.sfx[id].list[i].ended || !Db.sfx[id].list[i].currentTime){
			var s = Db.sfx[id].list[i];
			s.volume = vol;
			s.play();
			return;
		}
		i++;
	}
}

Sfx.creation = function(sfx){	//not used
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




