//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN

(function(){ //}
Song = function(id,src,author,link,name,volume){
	var tmp = {
		id:id,
		src:'music/song/' + src,
		audio:new Audio(),
		name:name || id.replaceAll('_',' ').capitalize() ,
		link:link || '',
		author:author || '',
	}
	tmp.audio.src = tmp.src;
	tmp.audio.volume = volume || 1;
	tmp.audio.addEventListener("ended", Song.ended);
	DB[id] = tmp;
};
var DB = Song.DB = {};
Song('carol_of_the_balls','carol_of_the_balls.mp3','Evil-Dog','http://www.newgrounds.com/audio/listen/561212');
Song('crimson_crisis','crimson_crisis.mp3','Darknessbreaker','http://www.newgrounds.com/audio/listen/556797');
Song('digital_insanity','digital_insanity.mp3','DJM4C','http://www.newgrounds.com/audio/listen/517360');
Song('final_battle','final_battle.mp3','K-Pone','http://www.newgrounds.com/audio/listen/546497');
Song('jur','jur.mp3','3kliksphilip','http://www.newgrounds.com/audio/listen/488195');
Song('super_gourmet_race','super_gourmet_race.mp3','MiguelVolkov','http://www.newgrounds.com/audio/listen/540968');
Song('game_it_all_day','game_it_all_day.mp3','Getcheffy','http://www.newgrounds.com/audio/listen/476685');


//forest http://www.newgrounds.com/audio/listen/483912
//http://www.newgrounds.com/audio/listen/568699
	
Song.play = function(id,volume){
	var song = DB[id];
	var vol = volume || 1;
	vol *= Main.getPref(main,'volumeSong')/100 * Main.getPref(main,'volumeMaster')/100;
	
	var audio = song.audio;
	audio.volume = 0;
	if(Song.BEING_PLAYED) Song.BEING_PLAYED.audio.pause();
	Song.BEING_PLAYED = song;
	
	$(audio).animate({volume: vol}, 5000);
	audio.play();	
}


Song.ended = function(){
	do { var next = Object.keys(DB).random();
	} while(next === Song.BEING_PLAYED.id)
	Song.play(next);	
}
Song.getSongBeingPlayed = function(){
	return Song.BEING_PLAYED;
}	
Song.BEING_PLAYED = null;

Song.updateVolume = function(){
	if(Song.BEING_PLAYED)
		Song.BEING_PLAYED.audio.volume = Main.getPref(main,'volumeSong')/100 * Main.getPref(main,'volumeMaster')/100;
}
Song.getCurrentSongInfo = function(){
	if(!Song.BEING_PLAYED) return 'No song being played...';
	return '<a style="color:cyan;text-decoration:underline;" target="_blank" href="' + Song.BEING_PLAYED.link + '">\"' + Song.BEING_PLAYED.name + '\"</a> by ' + Song.BEING_PLAYED.author;
}

Song.playRandom = function(){
	Song.play(Object.keys(DB).random());
}

})();


