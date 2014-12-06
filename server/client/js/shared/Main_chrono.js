//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Server','Main','ItemList','Save','Message','Dialogue','Boost','Drop','Quest','Collision','Command','Contribution']));

Main.chrono = {}; 

Main.Chrono = function(chrono){	//should do something cuz can store timer in db...
	return chrono || {};
}
Main.Chrono.compressDb = function(chrono){
	return Main.Chrono(chrono);
}
Main.Chrono.uncompressDb = function(chrono){
	for(var i in chrono){
		if(!chrono[i].active) delete chrono[i];
	}
	return chrono;
}

Main.chrono.start = function(main,id,visible,text){
	main.chrono[id] = Chrono(id,visible,text);
	Main.setFlag(main,'chrono');
}
Main.chrono.stop = function(main,id){
	if(!main.chrono[id]) return ERROR(3,'no chrono',id);
	main.chrono[id].active = 0;
	Main.setFlag(main,'chrono');
	return main.chrono[id].time;	//send # frames 
}
Main.chrono.remove = function(main,id){
	delete main.chrono[id];	
	Main.setFlag(main,'chrono');
}

Main.chrono.loop = function(main){	//only function ran on client side
	for(var i in main.chrono){
		if(main.chrono[i].active) main.chrono[i].time += 1;
		else if(main.chrono[i].removeTime++ > 25*30 && SERVER) Main.chrono.remove(main,i);
	}
}

var Chrono = function(id,visible,text){
	return {
		id:id || '',
		visible:visible !== false,
		text:text || '',
		time:0,
		removeTime:0,
		active:1,
	};
}















