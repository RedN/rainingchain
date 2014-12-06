//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Map','ItemList','ActiveList','ItemModel','Equip','Actor','Main'],['Drop']));
if(SERVER) eval('var Drop;');

(function(){ //}

var TIMER = 25*60;

Drop = exports.Drop = function(spot,item,amount,viewedIf,timer){
	var tmp = {
		id:Math.randomId(),
		type:'drop',
		activeList:{},
		viewedIf:viewedIf || 'true',
		x:spot.x || 0,
		y:spot.y || 0,
		map:spot.map || ERROR(3,'no map',spot) || Actor.DEFAULT_SPOT.map,
		item:item || 'bugged-drop',
		amount:amount || 1,
		timer:timer || TIMER,
		color:'',
		change:{},	//for send
	};
	
	if(!ItemModel.get(tmp.item))
		return ERROR(3,'drop with non-existing item',tmp.item);
	if(Equip.get(tmp.item))
		tmp.color = Equip.get(tmp.item).color;
	
	LIST[tmp.id] = tmp;
	ActiveList.addToList(tmp);
	Map.enter(tmp);
};	
var LIST = Drop.LIST = {};

Drop.get = function(id){
	return LIST[id] || null;
}

Drop.addToList = function(bullet){
	LIST[bullet.id] = bullet;
}
Drop.removeFromList = function(id){
	delete LIST[id]; 
}


Drop.loop = function(){	//static
	for(var i in LIST){ 
		var drop = LIST[i];
		if(--drop.timer <= 0) Drop.remove(drop);
	}
}

Drop.remove = function(drop){
	if(typeof drop === 'string') drop = LIST[drop];
	Map.leave(drop);
	delete LIST[drop.id];
	ActiveList.removeFromList(drop.id);
}

Drop.doInitPack = function(drop){
	var draw = [
		'drop',
		Math.round(drop.x),
		Math.round(drop.y),
		drop.item,
		drop.color
	];	
	return draw;
}

Drop.undoInitPack = function(obj,id){
	var b = {
		type:'drop',
		id:id,
		toRemove:0,
		x:obj[1],
		y:obj[2],
		item:obj[3],
		color:obj[4],
	};
	return b;
}


Drop.drawAll = function(ctx){	//linked with Button.updateList.drop for size 32
	var context;
	for(var i in LIST){
		var drop = LIST[i];
				
		var numX = CST.WIDTH2 + drop.x - player.x;
		var numY = CST.HEIGHT2 + drop.y - player.y;
		
		var item = QueryDb.get('item',drop.item);
		if(!item) continue;
		Img.drawIcon(ctx,item.icon,numX,numY,32);
		
		if(drop.color){
			ctx.strokeStyle = drop.color;
			ctx.lineWidth = 4;
			ctx.strokeRect(numX,numY,32,32);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 1;
		}
		
		if(Collision.testMouseRect(key,{x:numX,y:numY,width:32,height:32}))
			context = item.name;
	}
	return context;
}


			
})();


