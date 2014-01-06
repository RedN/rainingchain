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
Sfx.play = function(id){
	var i = 0;
	while(Db.sfx[id][i]){
		if(Db.sfx[id][i].ended || !Db.sfx[id][i].currentTime){
			return Db.sfx[id][i];
		}
		i++;
	}
	return Db.sfx[id][0];
}






