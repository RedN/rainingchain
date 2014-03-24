
Init.db.anim = function(){
	Db.anim ={
		"aura":{'frame':30},
		"bind":{'frame':16},
		"heal":{'frame':13},
		
		"boostBlue":{'frame':16},
		"boostGrey":{'frame':18},
		"boostPink":{'frame':16},
		"boostRed":{'frame':16},
		"boostWhite":{'frame':10},
		
		"curseBlue":{'frame':15},
		"curseGreen":{'frame':14},
		"cursePink":{'frame':14},
		"cursePurple":{'frame':9},
		
		"earthBomb":{'frame':7},
		"windBomb":{'frame':10},
		"waterBomb":{'frame':15},
		
		"fireBomb":{'frame':30},
		"fireBomb2":{'frame':6},
		"fireHit":{'frame':12},
		"iceBomb":{'frame':9},
		"iceHit":{'frame':16},
		"lightningBomb":{'frame':12},
		"lightningBomb2":{'frame':5},
		"lightningHit":{'frame':5},
		
		"scratch":{'frame':6},
		"scratch2":{'frame':8},
		
		"slashCold":{'frame':13},
		"slashFire":{'frame':15},
		"slashLightning":{'frame':14},
		"slashMelee":{'frame':6},
		"strikeHit":{'frame':3},		
	}
		
			
			
	for(var i in Db.anim){
		var anim = Db.anim[i];
		
		anim.layer = anim.layer || 'a';
		anim.frameX = anim.frameX || Math.min(anim.frame,5);
		anim.spd = anim.spd || 1;
		anim.size = anim.size || 1;
		anim.startY = anim.startY || 0;
		anim.src = anim.src || 'img/anim/' + i + '.png';
		
		anim.name = i;
		anim.img = newImage(anim.src);
		Img.preloader.push(anim.src);
	}
	
}

Anim = {};
Anim.loop = function (anim){
	var animFromDb = Db.anim[anim.name];
	anim.timer += animFromDb.spd * anim.spdMod;
	
	anim.x = anim.target.x;
	anim.y = anim.target.y;
	
	anim.slot = Math.floor(anim.timer);
	if(anim.slot > animFromDb.frame){
		delete List.anim[anim.id];
	}	
}

Anim.creation = function(name,target,sizeMod){	//server side
	//Add animation to the game. target = actor id OR an obj x,y,map,viewedIf
	sizeMod = sizeMod || 1;
	var id = 'a'+Math.randomId(5);
	List.anim[id] = {'sizeMod':sizeMod,'name':name,'target':target,'id':id};
	return id;
}




if(!server){
	Anim.creation = function(a){	//client side
		if(typeof a.target === 'string'){
			if(a.target === player.name){	a.target = player;
			} else {a.target = List.all[a.target];}
		}
		
		a.id = Math.randomId();
		a.timer = 0;
		a.sizeMod = a.sizeMod || 1;
		a.spdMod = a.spdMod || 1;
		if(a.target){  
			a.x = a.target.x;
			a.y = a.target.y;
			a.slot = 0;			
			List.anim[a.id] = a;
		}
		
		var sfx = a.sfx || Db.anim[a.name].sfx;
		if(sfx && a.sfx !== false){	
			sfx.volume = sfx.volume || 1;
			sfx.volume *= Math.max(0.1,1 - 0.2*Math.floor(Collision.distancePtPt(player,a)/50));	
			Sfx.play(sfx);
		}	
	}
}





