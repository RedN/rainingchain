//Map
Init.db.map = function(){
    //[amount of sub-map in X, amount of sub-maps in Y]
    Db.map = {};
	
	var mapDb = {
		'test':[1,1],
		'ryve':[3,1],
	}


	for(var i in mapDb){
		Map.creation(i,mapDb[i]);
	}
}

Map = {};
Map.creation = function(name,info){
	
	var m = {};
	m.name = name;
	m.img = {'a':[],'b':[],'i':[]};	//a: above, b:below

	for(var layer in m.img){
		for(var i = 0 ; i < info[0]; i++){
			m.img[layer][i] = [];
			for(var j = 0 ; j < info[1]; j++){
				var str = "img/Map/" + name + "/" + layer.capitalize() + "/" + name + layer.capitalize() + '_(' + i + ',' + j + ')' + '.png';
				var im = newImage(str);
				Img.preloader.push(str);
				m.img[layer][i].push(im);
			}
		}
	}
	Db.map[name] = m;
	
}




















