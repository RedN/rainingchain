Draw = {};

Draw.loop = function (key){
	List.btn[key] = [];
	
	Draw.drop(key);
	Draw.actor(key);	
	
	Button.context(key);
}

Draw.actor = function (key){
	for(var i in List.all[key].activeList){
		var act = List.actor[i];
		if(act && !act.dead && i !== key && act.hitBox){
			var player = List.actor[key];
			
			var x = Cst.WIDTH2 + act.x - player.x;
			var y = Cst.HEIGHT2 + act.y - player.y;
			
			var info = {
				"rect":Collision.getHitBox({x:x,y:y,hitBox:act.hitBox}),
				"text":act.context,
				'textTop':1,
			};
			
			if(act.optionList && !act.combat){
				info['right'] = {'func':'Button.optionList','param':act.optionList};
			}
			for(var i in act.onclick){
				info[i] = {'func':act.onclick[i].func,'param':act.onclick[i].param};
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
		"left":{"func":'Actor.click.drop',"param":[i]},
		'right':{'func':'Actor.click.drop.rightClick','param':[{x:drop.x,y:drop.y}]},
		'text':'Pick ' + Db.item[drop.item].name,
		});	
	
	}
}




