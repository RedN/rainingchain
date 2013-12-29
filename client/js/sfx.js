initSfxDb = function(){
	sfxDb = {
		'fire1':{},
        












	}


	for(var i in sfxDb){
		var tmp = [];
		for(var j = 0 ; j < 3 ; j++){
			var s = new Audio();
			s.src = sfxDb[i].src ? 'snd/sfx/' + sfxDb[i].src : 'snd/sfx/' + i + '.wav';
			s.volume = sfxDb[i].volume || 1;
			s.delay = sfxDb[i].delay || 0;
			tmp.push(s);
		}
		
		
		sfxDb[i] = tmp;
	}

}



selectSfx = function(id){
	var i = 0;
	while(sfxDb[id][i]){
		if(sfxDb[id][i].ended || !sfxDb[id][i].currentTime){
			return sfxDb[id][i];
		}
		i++;
	}
	return sfxDb[id][0];
}






