if(server) var Collision = require('./Collision').Collision;

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
		"fireBomb2":{'frame':6,spd:0.4,'sfx':{name:'explosion',volume:0.5}},
		"fireHit":{'frame':12},
		"coldBomb":{'frame':9,spd:0.4},
		"coldHit":{'frame':16},
		"lightningBomb":{'frame':12},
		"lightningBomb2":{'frame':5},
		"lightningHit":{'frame':6},
		
		"scratch":{'frame':6,'sfx':{name:'sword',volume:0.2}},
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
		Db.anim[i].name = i;
		Init.db.anim.creation(Db.anim[i]);		
	}
}

Init.db.anim.creation = function(anim){
	anim.src = anim.src || 'img/anim/' + anim.name + '.png';
	anim.frameX = anim.frameX || Math.min(anim.frame,5);
	
	anim = useTemplate(Init.db.anim.creation.template(),anim);		
	anim.img = newImage(anim.src);
	Img.preloader.push(anim.src);
	Db.anim[anim.name] = anim;
}
Init.db.anim.creation.template = function(anim){
	return {
		layer:'a',
		frameX:10,
		spd:1,
		size:4,
		startY:0,
		src:'img/anim/scratch.png',	
		name:'scratch',
		img:null,
		sfx:null,	// {name:'asd',volume:0.5}
	}
}

Anim = {};
Anim.creation = function(d){	//server
	//Add animation to the game. target = actor id OR an obj { x,y,map,viewedIf }
	var anim = useTemplate(Anim.template(),d);
	
	if(typeof anim.target === 'string') List.map[List.all[anim.target].map].list.anim[anim.id] = anim;
	else List.map[anim.target.map].list.anim[anim.id] = anim;
	
	return anim.id;
}
Anim.template = function(){
	return {
		sizeMod:1,
		name:'scratch',
		target:{x:1,y:1,map:'test@MAIN'},
		id:'a'+Math.randomId(5),
	}
}

Anim.removeAll = function(){	//server
	for(var i in List.map){
		List.map[i].list.anim = {};
	}
}

if(!server){	//client
	Anim.loop = function (anim){	
		var animFromDb = Db.anim[anim.name];
		if(!animFromDb){ DEBUG(1,"anim not found" + anim.name); animFromDb = Db.anim['scratch']; }
		
		anim.timer += animFromDb.spd;
		
		anim.slot = Math.floor(anim.timer);
		if(anim.slot > animFromDb.frame){
			Anim.remove(anim);
		}	
	}

	Anim.remove = function(anim){	
		delete List.anim[anim.id];
	}

	Anim.creation = function(a){
		a = useTemplate(Anim.template(),a);
		if(typeof a.target === 'string'){
			a.target = a.target === player.name ? player : List.all[a.target];
			if(!a.target) return;
		}
		
		List.anim[a.id] = a;
		
		var sfx = Db.anim[a.name].sfx;
		if(sfx){
			var s = deepClone(sfx);
			s.volume *= Math.max(0.1,1 - 0.2*Math.floor(Collision.distancePtPt(player,a.target)/50));
			Sfx.creation(s);
		}	
	}
	
	Anim.template = function(){
		return {
			sizeMod:1,
			name:'scratch',
			target:{x:1,y:1,map:'test@MAIN'},
			id:Math.randomId(),
			sfx:null,
			timer:0,
			slot:0,
		}
	}
	
}





