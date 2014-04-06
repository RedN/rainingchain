
Init.db.anim = function(){	//client
	Db.anim ={
		"aura":{'frame':30,'layer':'b'},
		"bind":{'frame':16},
		"heal":{'frame':13},
		
		"boostBlue":{'frame':16,'layer':'b'},
		"boostGrey":{'frame':18,'layer':'b'},
		"boostPink":{'frame':16,'layer':'b'},
		"boostRed":{'frame':16,'layer':'b'},
		"boostWhite":{'frame':10,'layer':'b'},
		
		"curseBlue":{'frame':15},
		"curseGreen":{'frame':14},
		"cursePink":{'frame':14},
		"cursePurple":{'frame':9},
		
		"earthHit":{'frame':7},
		"earthBomb":{'frame':7},
		"windBomb":{'frame':10,spd:0.5},
		"waterBomb":{'frame':15},
		
		"magicBomb":{'frame':9},
		"magicHit":{'frame':9},
		
		"fireBomb":{'frame':30},
		"fireBomb2":{'frame':6,spd:0.4},
		"fireHit":{'frame':12},
		"coldBomb":{'frame':9,spd:0.4},
		"coldHit":{'frame':16},
		"lightningBomb":{'frame':12},
		"lightningBomb2":{'frame':5},
		"lightningHit":{'frame':6},
		
		"scratch":{'frame':6},
		"scratch2":{'frame':8},
		
		"slashCold":{'frame':13},
		"slashFire":{'frame':15},
		"slashLightning":{'frame':14},
		"slashMelee":{'frame':6},
		"strikeHit":{'frame':3},	

		"splashCold":{'frame':10},
		"splashFire":{'frame':7},
		"splashLightning":{'frame':7},
		"splashMelee":{'frame':9},		
	}
		
			
			
	for(var i in Db.anim){
		var anim = Db.anim[i];
		
		anim.layer = anim.layer || 'a';
		anim.frameX = anim.frameX || Math.min(anim.frame,5);
		anim.spd = anim.spd || 1;
		anim.size = anim.size || 4;
		anim.startY = anim.startY || 0;
		anim.src = anim.src || 'img/anim/' + i + '.png';
		
		anim.name = i;
		anim.img = newImage(anim.src);
		Img.preloader.push(anim.src);
	}
	
}

Anim = {};
Anim.creation = function(name,target,sizeMod){	//server
	//Add animation to the game. target = actor id OR an obj x,y,map,viewedIf
	sizeMod = sizeMod || 1;
	var id = 'a'+Math.randomId(5);	
	var anim = {'sizeMod':sizeMod,'name':name,'target':target,'id':id};
	
	if(typeof target === 'string') List.map[List.all[target].map].list.anim[id] = anim;
	else List.map[target.map].list.anim[id] = anim;
	
	return id;
}

Anim.clearList = function(){	//server
	for(var i in List.map){
		List.map[i].list.anim = {};
	}
}

Anim.loop = function (anim){	//client
	var animFromDb = Db.anim[anim.name];
	if(!animFromDb){ DEBUG(1,"anim not found" + anim.name); animFromDb = Db.anim['slashMelee']; }
	
	anim.timer += animFromDb.spd * anim.spdMod;
	
	anim.x = anim.target.x;
	anim.y = anim.target.y;
	
	anim.slot = Math.floor(anim.timer);
	if(anim.slot > animFromDb.frame){
		delete List.anim[anim.id];
	}	
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





