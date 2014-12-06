//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Init']));




(function(){ //}

Sfx = function(id,src,volume){
	var tmp = {
		id:id,
		src:'music/sfx/' + src,
		volume:volume || 1,
		list:[],
	};
	for(var j = 0 ; j < 3 ; j++){	//cant only use 1 copy otherwise impossible to play 2 times same sfx same time	
		var audio = new Audio();
		audio.src = tmp.src;
		tmp.list.push(audio);
	}	
	DB[id] = tmp;
}
var DB = Sfx.DB = {};


Sfx('error','beep-03.ogg');
Sfx('menu','button-3.ogg',0.1);
Sfx('close','switch-1.ogg');		
Sfx('explosion','explosion.mp3');//SoundBible.com-1777900486
Sfx('train','train.mp3');//http://soundbible.com/2070-Railroad-Crossing-Bell.html
Sfx('swoosh','swoosh.mp3');//SoundBible.com-231145780
Sfx('sword','sword.ogg'); //SoundBible.com-912903192
	

Sfx.play = function(id,volume){
	var sfx = DB[id];
	if(!sfx) return ERROR(3,'no sfx with that id',id);
	var vol = volume || 1;
	vol *= sfx.volume;
	vol *= main.pref.volumeSfx/100 * main.pref.volumeMaster/100;
	if(vol === 0) return;
	
	for(var i in sfx.list){
		if(sfx.list[i].ended || !sfx.list[i].currentTime){	//ended or never started
			var s = sfx.list[i];
			s.volume = vol;
			s.play();
			return;
		}
	}
}


Sfx.Base = function(id,volume){	//used by AnimModel
	return {
		id:id,
		volume:volume || 1,	
	}
}
})();


