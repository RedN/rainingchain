//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Tk','Init']));

//quick fix QUICKFIX
Audio = typeof Audio !== 'undefined' ? Audio : function(){
	return {
		src:'',
		play:function(){},
		currentTime:0,
		ended:false,	
		fake:true,
		addEventListener:function(){},
	}
}

Init.db.sfx = function(){
	Db.sfx = {
		'error':{src:'beep-03.ogg'},
		'menu':{src:'button-3.ogg',volume:0.1},
		'close':{src:'switch-1.ogg'},
		
		
		'explosion':{src:'explosion.mp3','link':'SoundBible.com-1777900486'},
		'train':{src:'train.mp3','link':'http://soundbible.com/2070-Railroad-Crossing-Bell.html'},
		'swoosh':{src:'swoosh.mp3','link':'SoundBible.com-231145780'},
		'sword':{src:'sword.ogg','link':'SoundBible.com-912903192'},
		
	}


	for(var i in Db.sfx){
		var s = Db.sfx[i];
		s.src = s.src ? 'music/sfx/' + s.src : 'music/sfx/' + i + '.ogg';
		s.volume = 	s.volume || 1;
		s.delay = s.delay || 0;
			
		s.list = [];
		for(var j = 0 ; j < 3 ; j++){	//cant only use 1 copy otherwise impossible to play 2 times same sfx same time	
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
	if(vol === 0) return;
	
	for(var i in Db.sfx[id].list){
		if(Db.sfx[id].list[i].ended || !Db.sfx[id].list[i].currentTime){
			var s = Db.sfx[id].list[i];
			s.volume = vol;
			s.play();
			return;
		}
	}
}

Sfx.creation = function(s){		//used by anim
	s = Tk.useTemplate(Sfx.template(),s,true);
	s.id = Math.randomId();
	s.volume *= Db.sfx[s.name].volume;
	s.delay += Db.sfx[s.name].delay;
	if(s.delay === 0){
		Sfx.play(s); return;
	}
	List.sfx[s.id] = s;
}

Sfx.template = function(){	//template for List.sfx. (not Db.sfx)
	return {
		'id':'fire1',
		'delay':0,
		'volume':1,	
	};
}

Sfx.remove = function(sfx){
	delete List.sfx[sfx.id];
}




