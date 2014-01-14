Draw = {};

Draw.loop = function (key){
	List.btn[key] = [];
	
	Draw.drop(key);
	Draw.mortal(key);	
	
	Button.context(key);
}

Draw.mortal = function (key){
	for(var i in List.all[key].activeList){
		var mort = List.mortal[i];
		if(mort && !mort.dead && i !== key && mort.hitBox){
			var player = List.mortal[key];
			
			var x = Cst.WIDTH2 + mort.x - player.x;
			var y = Cst.HEIGHT2 + mort.y - player.y;
			
			var info = {
				"rect":Collision.getHitBox({x:x,y:y,hitBox:mort.hitBox}),
				"text":mort.context
			};
			
			if(mort.optionList){
				info['right'] = {'func':'Button.optionList','param':mort.optionList};
			}
			
			Button.creation(key,info);
		}
	}		
}	
	
Draw.drop = function(key){
	for(var i in List.drop){
		var drop = List.drop[i];
		var numX = Cst.WIDTH2 + drop.x - List.mortal[key].x;
		var numY = Cst.HEIGHT2 + drop.y - List.mortal[key].y;
		
		Button.creation(key,{
		"rect":[numX,numX+32,numY,numY+32],
		"left":{"func":'Mortal.pickDrop',"param":[i]},
		'right':{'func':'Mortal.rightClickDrop','param':[[drop.x,drop.x+32,drop.y,drop.y+32]]},
		'text':'Pick ' + Db.item[drop.item].name,
		});	
	
	}
}




