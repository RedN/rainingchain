//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','Init'],['Song']));

Init.db.song = function(){
	Db.song = {	
		
		'carol_of_the_balls':{
			'link':'http://www.newgrounds.com/audio/listen/561212',
			'permission':true,
			'author':{
				'name':'Evil-Dog',
			}
		},
		'crimson_crisis':{
			'link':'http://www.newgrounds.com/audio/listen/556797',
			'permission':true,
			'author':{
				'name':'Darknessbreaker',
			}
		},
		
		/*'dark_war':{
			'link':'http://www.newgrounds.com/audio/listen/564123',
			'permission':true,
			'author':{
				'name':'Steve Syz',
				'newgroundsName':'DesideratumOfficial',
			},
			'tag':['epic'],
		},*/
		'digital_insanity':{
			'link':'http://www.newgrounds.com/audio/listen/517360',
			'permission':true,
			'author':{
				'name':'DJM4C',
			}
		},
		
		'final_battle':{
			'link':'http://www.newgrounds.com/audio/listen/546497',
			'permission':true,
			'author':{
				'name':'K-Pone',
			}
		},
		
		'jur':{
			'link':'http://www.newgrounds.com/audio/listen/488195',
			'permission':true,
			'author':{
				'name':'3kliksphilip',
			}
		},
		'super_gourmet_race':{
			'link':'http://www.newgrounds.com/audio/listen/540968',
			'permission':true,
			'author':{
				'name':'MiguelVolkov',
			}
		},
		
		'game_it_all_day':{
			'link':'http://www.newgrounds.com/audio/listen/476685',
			'permission':true,
			'author':{
				'name':'Getcheffy',
			}
		},
	}
	//forest http://www.newgrounds.com/audio/listen/483912
	//http://www.newgrounds.com/audio/listen/568699
	
	
	
	for(var i in Db.song){
		var s = Db.song[i];
		
		var tmp = {};
		tmp.song = new Audio();
		tmp.song.src = s.src ? 'music/song/' + s.src : 'music/song/' + i + '.mp3';
		tmp.song.volume = s.volume || 1;
		tmp.song.addEventListener("ended", Song.ended);
		tmp.name = s.name || i.replaceAll('_',' ').capitalize();
		tmp.id = i;
		tmp.link = s.link;
		tmp.author = s.author;
		tmp.author.link = s.author.link || s.author.name + '.newgrounds.com';
		Db.song[i] = tmp;
	}
}

Song = {};
Song.play = function(song,volume){
	var id = song.name || song;
	var vol = song.volume || volume || 1;
	vol *= main.pref.volumeSong/100 * main.pref.volumeMaster/100;
	
	var song = Db.song[song];
	var audio = song.song;
	//audio.currentTime = audio.duration - 100;	//not sure
	audio.volume = 0;
	if(Song.beingPlayed) Song.beingPlayed.song.pause();
	Song.beingPlayed = song;
	
	$(audio).animate({volume: vol}, 5000);
	audio.play();
}


Song.ended = function(){
	do { var next = Object.keys(Db.song).random();
	} while(next === Song.beingPlayed.id)
	Song.play(next);	
}

Song.beingPlayed = null;




