//Map
Init.db.map = function(){
    //[amount of sub-map in X, amount of sub-maps in Y]
    Db.map = {};
	
	var mapDb = {
		'test':[0,0],
		'ryve':[2,0],
		'tutorial':[1,1],
		'pvpF4A':[0,0],
	}


	for(var i in mapDb){
		Map.creation(i,mapDb[i]);
	}
}

Map = {};
Map.creation = function(name,info){
	
	var m = {};
	m.name = name;
	m.img = {'a':[],'b':[]};	//a: above, b:below

	for(var layer in m.img){
		for(var i = 0 ; i <= info[0]; i++){
			m.img[layer][i] = [];
			for(var j = 0 ; j <= info[1]; j++){
				var str = "img/Map/" + name + "/" + name + layer.capitalize() + '_(' + i + ',' + j + ')' + '.png';
				var im = newImage(str);
				Img.preloader.push(str);
				m.img[layer][i].push(im);
			}
		}
	}
	Db.map[name] = m;
	
}




















