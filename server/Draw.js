Draw = {};

Draw.loop = function (key){
	List.btn[key] = [];
	
	Draw.drop(key);
	Draw.actor(key);	
	
	Button.context(key);
}

Draw.actor = function (key){
	for(var i in List.all[key].activeList){
		var mort = List.actor[i];
		if(mort && !mort.dead && i !== key && mort.hitBox){
			var player = List.actor[key];
			
			var x = Cst.WIDTH2 + mort.x - player.x;
			var y = Cst.HEIGHT2 + mort.y - player.y;
			
			var info = {
				"rect":Collision.getHitBox({x:x,y:y,hitBox:mort.hitBox}),
				"text":mort.context,
				'textTop':1,
			};
			
			if(mort.optionList){
				info['right'] = {'func':'Button.optionList','param':mort.optionList};
			}
			for(var i in mort.onclick){
				info[i] = {'func':mort.onclick[i].func,'param':mort.onclick[i].param};
			}
			Button.creation(key,info);
		}
	}		
}	
	
Draw.drop = function(key){
	for(var i in List.drop){
		var drop = List.drop[i];
		var numX = Cst.WIDTH2 + drop.x - List.actor[key].x;
		var numY = Cst.HEIGHT2 + drop.y - List.actor[key].y;
		
		Button.creation(key,{
		"rect":[numX,numX+32,numY,numY+32],
		"left":{"func":'Actor.pickDrop',"param":[i]},
		'right':{'func':'Actor.rightClickDrop','param':[[drop.x,drop.x+32,drop.y,drop.y+32]]},
		'text':'Pick ' + Db.item[drop.item].name,
		});	
	
	}
}




