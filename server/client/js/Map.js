//Map
var mapList = {};

var Map = {};

initMapDb = function(){
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
		Map.creation(i,mapDb[i]);
	}
}

Map.creation = function(name,info){
	var m = {};
	
	m.name = name;
	m.img = {'a':[],'b':[]};	//a: above, b:below

	for(var layer in m.img){
		for(var i = 0 ; i < info[0]; i++){
			m.img[layer][i] = [];
			for(var j = 0 ; j < info[1]; j++){
				var str = "img/Map/" + name + "/" + name + layer.capitalize() + '_(' + i + ',' + j + ')' + ".png";
				var im = newImage(str);
				Img.preloader.push(str);
				m.img[layer][i].push(im);
			}
		}
	}
	mapList[name] = m;
	
}






















