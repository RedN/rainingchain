Init.db.song = function(){
	Db.song = {	
		'8_bit_inferno':{
			'link':'http://www.newgrounds.com/audio/listen/544595',
			'author':{
				'name':'eliteferrex',
			}
		},
        'blast_away':{
			'link':'http://www.newgrounds.com/audio/listen/561789',
			'author':{
				'name':'sonicsneakers',
			}
		},
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
		'dark_war':{
			'link':'http://www.newgrounds.com/audio/listen/564123',
			'permission':true,
			'author':{
				'name':'Steve Syz',
				'newgroundsName':'DesideratumOfficial',
			},
			'tag':['epic'],
		},
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
		'frozen_factory':{	//same guy than other
			'link':'http://www.newgrounds.com/audio/listen/561312',
			'author':{
				'name':'sonicsneakers',
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
		'virus_busting':{
			'link':'http://www.newgrounds.com/audio/listen/526713',
			'author':{
				'name':'eliteferrex',
			}
		},
		
	}
	//forest http://www.newgrounds.com/audio/listen/483912
	//http://www.newgrounds.com/audio/listen/568699
	
	//jontron-like http://www.newgrounds.com/audio/listen/476685
	
	
	for(var i in Db.song){

		var s = Db.song[i];
		var tmp = new Audio();
		tmp.src = s.src ? 'music/song/' + s.src : 'music/song/' + i + '.mp3';
		tmp.volume = s.volume || 1;
		tmp.name = s.name || i.replaceAll('_',' ').capitalize();
		tmp.id = i;
		tmp.link = s.link;
		tmp.author = s.author;
		tmp.author.link = s.author.link || s.author.name + '.newgrounds.com';
		tmp.addEventListener("ended", Song.ended);
		Db.song[i] = tmp;
	}
	

	
}



Song = {};
Song.play = function(song,volume){
	var id = song.name || song;
	var vol = song.volume || volume || 1;
	vol *= main.pref.volumeSong/100 * main.pref.volumeMaster/100;
	
	var song = Db.song[song];
	song.currentTime = song.duration - 100;
	song.volume = 0;
	if(Song.beingPlayed) Song.beingPlayed.pause();
	Song.beingPlayed = song;
	
	$(song).animate({volume: vol}, 5000);
	song.play();
}


Song.ended = function(){
	do {
		var next = Object.keys(Db.song).random();
	} while(next === Song.beingPlayed.id)
	Song.play(next);	
}

Song.beingPlayed = null;




/*
Hi,

I was listening to the songs you have made on your channel and I really liked your song ...
My name is Samuel Magnan and I'm currently making an open-source MMORPG called Raining Chain.
I was wondering if I could use your song in the commercial project.
Obviously, your name will be mentionned in the credits.
Players can also see the compositor name of the song currently playing directly in-game.

Contact me at rainingchain@gmail.com or via NewGrounds.

Quick Game Presentation:
https://www.youtube.com/watch?v=XsnMmUY69ws


Thanks a lot :D
If you want to get updates about the project, you can check it out directly on Github or via my Youtube Channel.
https://github.com/RainingChain/rainingchain
https://www.youtube.com/user/IdkWhatsRc
*/
