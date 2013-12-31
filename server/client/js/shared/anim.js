

initAnimDb = function(){
	animDb ={
			"slash":{'frame':8},
			"attack1":{'frame':3},
			"attack2":{'frame':8},
			"attack3":{'frame':10},
			"attack4":{'frame':7},
			"attack5":{'frame':7},		
			"attack6":{'frame':10},
			"blow1":{'frame':6},
			"blow2":{'frame':28},
			"blow3":{'frame':6},
			"darkness1":{'frame':9,'spd':0.5},
			"darkness2":{'frame':26},
			"death1":{'frame':24},
			"earth1":{'frame':7},		
			"earth2":{'frame':8},
			"fire1":{'frame':10},
			"fire2":{'frame':12},
			"fire3":{'frame':30},
			"fire4":{'frame':6,'spd':0.5,'layer':'b'},
			"heal1":{'frame':30},
			"heal2":{'frame':18},
			"heal3":{'frame':30},
			"heal4":{'frame':22},		
			"heal5":{'frame':13},
			"heal6":{'frame':28},
			"ice1":{'frame':9,'spd':0.4},
			"ice2":{'frame':16},
			"ice3":{'frame':4},
			"ice4":{'frame':14},
			"ice5":{'frame':25,'layer':'b'},
			"ice6":{'frame':10,'layer':'b'},
			"light1":{'frame':15},
			"light2":{'frame':30},
			"spear1":{'frame':9},
			"spear2":{'frame':11},
			"special1":{'frame':16},
			"special2":{'frame':15},
			"special3":{'frame':25},
			"special4":{'frame':11},
			"special5":{'frame':14},			
			"special6":{'frame':6},
			"special7":{'frame':5},
			"special8":{'frame':16},
			"special9":{'frame':16},
			"state1":{'frame':14},
			"state2":{'frame':15},
			"state3":{'frame':10},
			"state4":{'frame':10},
			"state5":{'frame':9},
			"state6":{'frame':14},
			"sword1":{'frame':6},
			"sword2":{'frame':14},	
			"sword3":{'frame':13},
			"sword4":{'frame':14},
			"sword5":{'frame':24},
			"sword6":{'frame':16},
			"thunder1":{'frame':12},
			"thunder2":{'frame':6},
			"thunder3":{'frame':5},
			"water1":{'frame':15},
			"water2":{'frame':4},
			"wind1":{'frame':14},
			"wind2":{'frame':10},
			
			"fire_explosion":{'frame':40,'frameX':40,'spd':2}
		}
		
			
			
	for(var i in animDb){
		var anim = animDb[i];
		
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
Anim.update = function (){
	for(var i in List.anim){
		var anim = List.anim[i];
		var animFromDb = animDb[anim.name];
		anim.timer += animFromDb.spd * anim.spdMod;
		
		anim.x = anim.target.x;
		anim.y = anim.target.y;
		
		anim.slot = Math.floor(anim.timer);
		if(anim.slot > animFromDb.frame){
			delete List.anim[anim.id];
		}	
	}
}

//Add animation to the game. target can be a string to specific an actor, or an obj x:1,y:1
Anim.creation = function(anim,target,sizeMod){
	sizeMod = sizeMod || 1;
	List.anim[a.id] = {'sizeMod':sizeMod,'name':anim,'target':target,'id':'a'+Math.randomId(5)};
}










