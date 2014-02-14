/*
"mace":{                               //id of the sprite
    "src":"img/Sprite/human.png"        //image src
    "size":1.5,                         //size factor
    "side":[2,6,0,4,1,5,3,7],           //side[0] = 2 => the right-facing position is in the 3rd row. 
    'hpBar':-40,                        //hp bar distance from center (in y)
    'legs':35,                          //used when sorting draw by y.
	"preHitBox":[ -12,12,-35,35 ],      //hitbox before size factor (for dmg collision)
	"preBumperBox":[ -12,12,0,35 ],     //bumperbox before size factor  (for map collision)
	"anim": {                           //list of animations
		"walk":{            //name
		    "startY":0,     //startY pixel
	    	"frame":4,      //how many frames?
	    	"sizeX":70,     //size of 1 frame in x
	    	"sizeY":70,     //size of 1 frame in y
	    	"dir":8,        //how many direction can it face? (usually 4 or 8 if diagonal)
	    	"spd":0.8,      //speed of animation. 1 spd => every game frame, it moves to the next frame
	    	'walk':1,       //if walk, movement speed will impact frame spd
	    	"next":"walk"   //once animation complete, what animation to do?    //default is Walk
	    },
		"attack":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,"next":"walk"}
	}},
*/



Init.db.sprite = function(){
	
    Db.sprite =	{
    	
    //PLAYER
    
    	//ts("Sprite.change(p,{'anim':'attack'})")
		/*
    	"mace":{"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		*/
		/*
		"mace":{"src":"actor/mace.png","size":1.5*0.9,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -18,18,4,35 ],
    	"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"walk"},
    		"attack":{"startY":256,"frame":6,"sizeX":128,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		*/
		"mace":{"src":"actor/newMain.png","size":2.5,"side":[1,2,3,0],'hpBar':-50/3,'legs':20,
    	"preHitBox":[ -30/3,30/3,-10/3,50/3],"preBumperBox":[ -30/3,30/3,-10/3,50/3 ],
    	"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.4,'walk':1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.4,"next":"walk"}
    	}},
		
		"sword":{"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		
		"spear":{"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		
		"bow":{"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		
		"wand":{"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		
		/*
    	"mace2":{"src":"actor/human.png","size":1.5,"side":[2,6,0,4,1,5,3,7],'hpBar':-40,'legs':35,
    	"preHitBox":[ -12,12,-35,35 ],"preBumperBox":[ -12,12,0,35 ],
    	"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,'walk':1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,"next":"walk"}
    	}},
		
    	"spear":{"src":"actor/spear.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"walk"},
    		"attack":{"startY":64*21,"frame":8,"sizeX":64*3,"sizeY":64*3,"dir":4,"spd":1,"next":"walk"}
    	}},
    	
    	"sword":{"src":"actor/sword.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"walk"},
    		"attack":{"startY":64*21,"frame":6,"sizeX":64*3,"sizeY":64*3,"dir":4,"spd":1,"next":"walk"}
    	}},
    	
    	"bow":{"src":"actor/bow.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"walk"},
    		"attack":{"startY":64*16,"frame":13,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
    	
    	"wand":{"src":"actor/wand.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"walk"},
    		"attack":{"startY":64*12,"frame":6,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
    	*/
    //NPC
    	"jenny":{"src":"actor/nSprite0.png","size":2,"side":[0,1,2,3],'hpBar':-22,'legs':16,
    	"preHitBox":[ -16,16,-16,16 ],"preBumperBox":[ -16,16,-16,16 ],
    	"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.5,'walk':1,"next":"walk"},
    	}},
    	
    //ENEMY
    	"slime":{"src":"actor/slime.png","size":1,"side":[0,1,2,3],'hpBar':-110,'legs':70,
    	"preHitBox":[ -70,70,-45,90 ],"preBumperBox":[ -55,55,-15,80 ],
    	"anim": {
    		"walk":{"startY":0,"frame":5,"sizeX":200,"sizeY":200,"dir":4,"spd":0.5,'walk':1,"next":"walk"},
    		"attack":{"startY":0,"frame":5,"sizeX":200,"sizeY":200,"dir":4,"spd":0.5,"next":"walk"},
    	}},
    
    	"troll":{"src":"actor/troll.png","size":1,"side":[0,1,2,3],'hpBar':-70,'legs':35,
    	"preHitBox":[ -33,33,-30,64 ],"preBumperBox":[ -33,33,-30,64 ],
    	"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":128,"sizeY":128,"dir":4,"spd":0.25,'walk':1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":128,"sizeY":128,"dir":4,"spd":0.25,"next":"walk"},
    		
    	}},
    	
		"bee":{"src":"actor/bee.png",rgpvx:1},
		"demon":{"src":"actor/demon.png",rgpvx:1},
		
    //BULLET
    	"fireball":{"src":"bullet/fireball.png","size":1,"side":[0,1,2,3],
    	"anim": {
    		"travel":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.2,"next":"travel"},
    	}},
    			
    	"iceshard":{"src":"bullet/iceshard.png","size":1,"side":[0,1,2,3,4,5,6,7],
    	"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":54,"sizeY":54,"dir":8,"spd":0,"next":"travel"},
    	}},
    	"lightningball":{"src":"bullet/lightningball.png","size":1,"side":[0],
    	"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"travel"},
    	}},
    	
    	"arrow":{"src":"bullet/arrow.png","size":1,"side":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    	"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":42,"sizeY":42,"dir":16,"spd":0,"next":"travel"},
    	}},
    	
    	"boomerang":{"src":"bullet/boomerang.png","size":1,"side":[0],
    	"anim": {
    		"travel":{"startY":0,"frame":8,"sizeX":52,"sizeY":52,"dir":1,"spd":1,"next":"travel"},
    	}},
    	
    //System
		"block1x1":{"src":"picture/block2x2.png","size":0.5,"side":[0],
    	"preBumperBox":[ -26,26,-26,26 ],"preHitBox":[ -26,26,-26,26 ],
		"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},    	
    	}},
		
		"grave":{"src":"picture/grave.png","size":2,"side":[0],
    	"preBumperBox":[ -16,16,-16,16 ],"preHitBox":[ -16,16,-16,16 ],
		"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"walk"},    	
    	}},
		
		"chest":{"src":"picture/chest.png","size":2,"side":[0],
    	"preBumperBox":[ -16,16,-16,16 ],"preHitBox":[ -16,16,-16,16 ],
		"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"walk"},  
			"close":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"close"},
			"open":{"startY":32,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"open"},			
    	}},
		
		"block1x1-black":{"src":"picture/block2x2Fix.png","size":0.5,"side":[0],
    	"preBumperBox":[ -26,26,-26,26 ],"preHitBox":[ -26,26,-26,26 ],
		"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},    	
    	}},
		
		"tree-red":{"src":"picture/red_tree.png","size":2,"side":[0],
    	"preBumperBox":[ -32,32,-40,40 ],"preHitBox":[ -32,32,-40,40 ],'defaultAnim':'ready',
		"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":64,"sizeY":80,"dir":1,"spd":0,"next":"walk"}, 
			"ready":{"startY":0,"frame":1,"sizeX":64,"sizeY":80,"dir":1,"spd":0,"next":"ready"},
			"cut":{"startY":80,"frame":1,"sizeX":64,"sizeY":80,"dir":1,"spd":0,"next":"cut"},  		  			
    	}},
		
		"switchBox":{"src":"picture/switch.png","size":2,"side":[0],
    	"preBumperBox":[ -16,16,-16,16 ],"preHitBox":[ -16,16,-16,16 ],'defaultAnim':'off',
		"anim": {
    		//"walk":{"startY":64,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"walk"},  
			"off":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"off"},	
			"on":{"startY":64,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"on"},							
    	}},
    	
    }
    
    
    for(var i in Db.sprite){
		var spr = Db.sprite[i];
    	
		if(spr.rgpvx){
			var src = spr.src;
			spr = {"size":2,"side":[2,0,1,3],'hpBar':-22,'legs':16,
			"preHitBox":[ -16,16,-16,16 ],"preBumperBox":[ -16,16,-16,16 ],
			"anim": {
				"walk":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.5,'walk':1,"next":"walk"},
				"attack":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.5,"next":"attack"},
			}};
			spr.src = src;
			Db.sprite[i] = spr;
		}
		
		
		
		spr.defaultAnim = spr.defaultAnim || Object.keys(spr.anim)[0];
		spr.size = spr.size || 1;
    	spr.legs = spr.legs || 0;
		
		if(spr.preBumperBox) spr.preHitBox = spr.preHitBox || deepClone(spr.preBumperBox);
		
    	for(var j in spr.anim){
    		var anim = spr.anim[j];
    		anim.startY = anim.startY || 0; 
    		anim.spd = anim.spd || 1; 
    		anim.next = anim.next || 'walk';
    	}
		
    
    }
    
    
    
    if(server){
        //Prepare the bumperbox and hitbox of sprites
        //hitbox: used for dmg collisions
        //bumperbox: used for map collisions

        for(var i in Db.sprite){
    		var sp = Db.sprite[i];
    		sp.sizeMod = 1;
    		if(sp.preBumperBox){			
    			sp.bumperBox = [];
    			sp.bumperBox[0] = { "x":sp.preBumperBox[1]*sp.size,"y":(sp.preBumperBox[2]+sp.preBumperBox[3])/2*sp.size };
    			sp.bumperBox[1] = { "x":(sp.preBumperBox[0]+sp.preBumperBox[1])/2*sp.size,"y":sp.preBumperBox[3]*sp.size };
    			sp.bumperBox[2] = { "x":sp.preBumperBox[0]*sp.size,"y":(sp.preBumperBox[2]+sp.preBumperBox[3])/2*sp.size };
    			sp.bumperBox[3] = { "x":(sp.preBumperBox[0]+sp.preBumperBox[1])/2*sp.size,"y":sp.preBumperBox[2]*sp.size };
    		}
			if(sp.preHitBox){
    			sp.hitBox = []; 
    			sp.hitBox[0] = { "x":sp.preHitBox[1]*sp.size,"y":(sp.preHitBox[2]-sp.preHitBox[3])/2*sp.size };
    			sp.hitBox[1] = { "x":(sp.preHitBox[0]-sp.preHitBox[1])/2*sp.size,"y":sp.preHitBox[3]*sp.size };
    			sp.hitBox[2] = { "x":sp.preHitBox[0]*sp.size,"y":(sp.preHitBox[2]-sp.preHitBox[3])/2*sp.size };
    			sp.hitBox[3] = { "x":(sp.preHitBox[0]-sp.preHitBox[1])/2*sp.size,"y":sp.preHitBox[2]*sp.size };
    		}
			
    	}
    }
    
    if(!server){
        for(var i in Db.sprite){
    		var sp = Db.sprite[i];
			sp.src = 'img/sprite/' + sp.src
    		sp.img = newImage(sp.src);
    		Img.preloader.push(sp.src);
    	}
    }
}


Sprite = {};

Sprite.creation = function(player,info){
	if(!info.anim) info.anim = Db.sprite[info.name || 'mace'].defaultAnim;
	info.oldAnim = info.anim;
	info.initAnim = info.anim;
	
	player.sprite = useTemplate(Sprite.template(),info);
	if(server)	Sprite.updateBumper(player);
}
Sprite.template = function(){
	return {
    	name:'mace',
		initAnim:'walk',			//info about anim sent to client when init. use when anim is constant (ex: switch off)
    	anim:'walk',				//normally null. change for 1 frame when attack etc... changing initAnim will also change anim
    	sizeMod : 1,
    	oldAnim:'walk',				//client stuff
		startX : 0,
    	spdBoost : 1,
    	timer : 0,
    	walk : 0,
		alpha: 1,
		dead: 0,
	}
}


Sprite.change = function(mort,info){
    if(!mort || !mort.sprite) return;

	if(info.initAnim || info.anim){ 
		mort.sprite.initAnim = info.initAnim || mort.sprite.initAnim;
		mort.sprite.anim = info.initAnim || info.anim;
		
		mort.sprite.startX = 0;
		mort.sprite.spdBoost = 1;
		mort.sprite.timer = 0;
	}
	mort.sprite.name = info.name || mort.sprite.name || 'mace';
	mort.sprite.sizeMod = info.sizeMod || mort.sprite.sizeMod || 1;
	
	if(info.sizeMod || info.name) Sprite.updateBumper(mort);
	
}

Sprite.updateBumper = function(player){		//server only
	//Set the Sprite Bumper Box to fit the sizeMod
	if(Db.sprite[player.sprite.name].hitBox){	//Attack Dont
		player.hitBox = deepClone(Db.sprite[player.sprite.name].hitBox);
		player.bumperBox = deepClone(Db.sprite[player.sprite.name].bumperBox);	
		
		
		for(var i = 0 ; i < player.hitBox.length ; i++){
			player.hitBox[i].x *= player.sprite.sizeMod;
			player.hitBox[i].y *= player.sprite.sizeMod;
			player.bumperBox[i].x *= player.sprite.sizeMod;
			player.bumperBox[i].y *= player.sprite.sizeMod;	
		}	
	}
}



Sprite.update = function (mort){	//client side only
	if(!mort.sprite) return;
	var spriteFromDb = Db.sprite[mort.sprite.name];
	
	if(mort.sprite.animOld !== mort.sprite.anim){	//otherwise, animation can be cut if timer for walk is high 
		mort.sprite.animOld = mort.sprite.anim;
		Sprite.change(mort,{'anim':mort.sprite.anim});
	}
	var animFromDb = spriteFromDb.anim[mort.sprite.anim];
	
	
	
	
	var mod = 1;
	if(animFromDb.walk){    //if walking, the speed of animation depends on movement speed
		var spd =  Math.max(Math.abs(mort.spdX),Math.abs(mort.spdY));
		mod = Math.abs(spd/mort.maxSpd);
	}
	
	mort.sprite.timer += animFromDb.spd * mod;	if(!mort.sprite.timer){mort.sprite.timer = 0;}
	mort.sprite.startX = Math.floor(mort.sprite.timer);
	
	if(mort.sprite.startX > animFromDb.frame-1){
		Sprite.change(mort,{'anim':animFromDb.next});
	}
	if(mort.sprite.dead){
		mort.sprite.alpha -= mort.sprite.dead;
		if(mort.sprite.alpha < 0){
			removeAny(mort.id);
		}
	}
	
}









