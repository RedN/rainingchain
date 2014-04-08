
//Boost that grants a custom advanced special effect to a player. 
Init.db.customBoost = function(){
	var b = Db.customBoost = {};
	
	/*
	b.balancedAtk = {
		'name':'Balanced Attack',
		'description':'For each element, your damage mastery is equal to the lowest of the 4 damage masteries.',
		'icon':'element.melee',
		'function':(function(pb,key){
			var mod;
			var pbl = pb.list;
			var array = ['x','*','^','+'];
			for(var st in Cst.element.list){
				var i = Cst.element.list[st];
				var min = 100000;
				for(var j in array){
					if(j == 3){ mod = 1; } else { mod = 0; }
					min = Math.min(min,pbl['dmg-' + i + '-' + array[j]].base + mod);
				}
				for(var j in array){
					if(j == 3){ mod = 1; } else { mod = 0; }
					pbl['dmg-' + i + '-' + array[j]].base = min-mod;
				}		
			}
		})
	}
	*/
	b.balancedAtk = {
		'name':'Risk Taker',
		'description':'x2 Life Leech. Cannot use Potions.',
		'icon':'element.melee',
		'func':(function(pb,key){
			var mod;
			var pbl = pb.list;
			var array = ['x','*','^','+'];
			for(var st in Cst.element.list){
				var i = Cst.element.list[st];
				var min = 100000;
				for(var j in array){
					if(j == 3){ mod = 1; } else { mod = 0; }
					min = Math.min(min,pbl['dmg-' + i + '-' + array[j]].base + mod);
				}
				for(var j in array){
					if(j == 3){ mod = 1; } else { mod = 0; }
					pbl['dmg-' + i + '-' + array[j]].base = min-mod;
				}		
			}
		})
	}
	
	b.testing = {
		'name':'testing Taker',
		'description':'testing.',
		'icon':'element.melee',
		'func':(function(pb,key){
			var pbl = pb.list;
			
			pbl['maxSpd'].base = 0;
			pbl['maxSpd'].min = 0;
			pbl['maxSpd'].max = 0;
		})
	}
}

//ts("Actor.permBoost(p,'test',[{stat:'custom-testing',value:1,type:'+'}]);");

