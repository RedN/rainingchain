//Map
var mapList = {};
var map;
function Map(name,info){
	var m = {};
	
	m.name = name;
	m.imgA = [];	//imgA : Above the player
	m.imgB = [];    //imgB: Below the player
	

	
	for(var i = 0 ; i < info[0]; i++){
		m.imgA[i] = [];
		m.imgB[i] = [];
		for(var j = 0 ; j < info[1]; j++){
			var im = new Image();
			var str = "img/Map/" + name + "/" + name + "A" + '_(' + i + ',' + j + ')' + ".png";
			im.src = str;
			preloader.push(str);
			m.imgA[i].push(im);
			
			var im = new Image();
			var str = "img/Map/" + name + "/" + name + "B" + '_(' + i + ',' + j + ')' + ".png";
			im.src = str;
			preloader.push(str);
			m.imgB[i].push(im);				
		}
	}
	mapList[name] = m;
	
}



function initMapDb(cb){
    //[amount of sub-map in X, amount of sub-maps in Y]
    
	mapDb = {
	'test':[1,1],
	/*
	'ice'[1,1],
	'fire'[1,1],
	'twitch'[1,1],
	'news'[1,1],
	*/
	'ryve':[3,1],
	}


	for(var i in mapDb){
		Map(i,mapDb[i]);
	}
}























