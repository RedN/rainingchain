/*
"pMace":{                               //id of the sprite
    "src":"img/Sprite/human.png"        //image src
    "size":1.5,                         //size factor
    "side":[2,6,0,4,1,5,3,7],           //side[0] = 2 => the right-facing position is in the 3rd row. 
    'hpBar':-40,                        //hp bar distance from center (in y)
    'legs':35,                          //used when sorting draw by y.
	"preHitBox":[ -12,12,-35,35 ],      //hitbox before size factor (for dmg collision)
	"preBumperBox":[ -12,12,0,35 ],     //bumperbox before size factor  (for map collision)
	"anim": {                           //list of animations
		"Walk":{            //name
		    "startY":0,     //startY pixel
	    	"frame":4,      //how many frames?
	    	"sizeX":70,     //size of 1 frame in x
	    	"sizeY":70,     //size of 1 frame in y
	    	"dir":8,        //how many direction can it face? (usually 4 or 8 if diagonal)
	    	"spd":0.8,      //speed of animation. 1 spd => every game frame, it moves to the next frame
	    	'walk':1,       //if walk, movement speed will impact frame spd
	    	"next":"Walk"   //once animation complete, what animation to do?    //default is Walk
	    },
		"Attack":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,"next":"Walk"}
	}},
*/


spriteList = {};
animList = {};
aList = [];

initSpriteDb = function(){

    spriteDb =	{
    	
    //PLAYER
    
    	"pMace":{"src":"img/sprite/human.png","size":1.5,"side":[2,6,0,4,1,5,3,7],'hpBar':-40,'legs':35,
    	"preHitBox":[ -12,12,-35,35 ],"preBumperBox":[ -12,12,0,35 ],
    	"anim": {
    		"Walk":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,'walk':1,"next":"Walk"},
    		"Attack":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,"next":"Walk"}
    	}},
    
    	"pMace2":{"src":"img/sprite/pMace.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"Walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"Walk"},
    		"Attack":{"startY":64*21,"frame":6,"sizeX":64*3,"sizeY":64*3,"dir":4,"spd":1,"next":"Walk"}
    	}},
    	
    	"pSpear":{"src":"img/sprite/pSpear.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"Walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"Walk"},
    		"Attack":{"startY":64*21,"frame":8,"sizeX":64*3,"sizeY":64*3,"dir":4,"spd":1,"next":"Walk"}
    	}},
    	
    	"pSword":{"src":"img/sprite/pSword.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"Walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"Walk"},
    		"Attack":{"startY":64*21,"frame":6,"sizeX":64*3,"sizeY":64*3,"dir":4,"spd":1,"next":"Walk"}
    	}},
    	
    	"pBow":{"src":"img/sprite/pBow.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"Walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"Walk"},
    		"Attack":{"startY":64*16,"frame":13,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"Walk"}
    	}},
    	
    	"pWand":{"src":"img/sprite/pWand.png","size":1.5,"side":[3,2,1,0],'hpBar':-40,'legs':20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"Walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,'walk':1,"next":"Walk"},
    		"Attack":{"startY":64*12,"frame":6,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"Walk"}
    	}},
    	
    //NPC
    	"julie":{"src":"img/sprite/nSprite0.png","size":2,"side":[0,1,2,3],'hpBar':-22,'legs':16,
    	"preHitBox":[ -16,16,-16,16 ],"preBumperBox":[ -16,16,-16,16 ],
    	"anim": {
    		"Walk":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.5,'walk':1,"next":"Walk"},
    	}},
    	
    //ENEMY
    	"eSlime":{"src":"img/sprite/eSlime.png","size":1,"side":[0,1,2,3],'hpBar':-110,'legs':70,
    	"preHitBox":[ -70,70,-45,90 ],"preBumperBox":[ -55,55,-15,80 ],
    	"anim": {
    		"Walk":{"startY":0,"frame":5,"sizeX":200,"sizeY":200,"dir":4,"spd":0.5,"next":"Walk"},
    		"Attack":{"startY":0,"frame":5,"sizeX":200,"sizeY":200,"dir":4,"spd":0.5,"next":"Walk"},
    		"Death":{"startY":800,"frame":5,"sizeX":200,"sizeY":200,"dir":4,"spd":0.5,"next":"Dead"}
    	}},
    
    	"eTroll":{"src":"img/sprite/eTroll.png","size":1,"side":[0,1,2,3],'hpBar':-70,'legs':35,
    	"preHitBox":[ -33,33,-30,64 ],"preBumperBox":[ -33,33,-30,64 ],
    	"anim": {
    		"Walk":{"startY":0,"frame":9,"sizeX":128,"sizeY":128,"dir":4,"spd":0.25,"next":"Walk"},
    		"Attack":{"startY":0,"frame":9,"sizeX":128,"sizeY":128,"dir":4,"spd":0.25,"next":"Walk"},
    		"Death":{"startY":WIDTH2,"frame":9,"sizeX":128,"sizeY":128,"dir":1,"spd":0.25,"next":"Walk"},
    		
    	}},
    	
    //BULLET
    	"fireball":{"src":"img/Bullet/fireball.png","size":1,"side":[0,1,2,3],
    	"anim": {
    		"Travel":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.2,"next":"Travel"},
    	}},
    			
    	"iceshard":{"src":"img/Bullet/iceshard.png","size":1,"side":[0,1,2,3,4,5,6,7],
    	"anim": {
    		"Travel":{"startY":0,"frame":1,"sizeX":54,"sizeY":54,"dir":8,"spd":0,"next":"Travel"},
    	}},
    	"lightningball":{"src":"img/Bullet/lightningball.png","size":1,"side":[0],
    	"anim": {
    		"Travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"Travel"},
    	}},
    	
    	"arrow":{"src":"img/Bullet/arrow.png","size":1,"side":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
    	"anim": {
    		"Travel":{"startY":0,"frame":1,"sizeX":42,"sizeY":42,"dir":16,"spd":0,"next":"Travel"},
    	}},
    	
    	"boomerang":{"src":"img/Bullet/boomerang.png","size":1,"side":[0],
    	"anim": {
    		"Travel":{"startY":0,"frame":8,"sizeX":52,"sizeY":52,"dir":1,"spd":1,"next":"Travel"},
    	}},
    	
    //Picture
    	"barrier":{"src":"img/Picture/barrier.png","size":1,"side":[0],
    	"anim": {
    		"Walk":{"startY":0,"frame":1,"sizeX":80,"sizeY":40,"dir":1,"spd":0,"next":"Walk"},
    	}},
    
    
    
    	
    }
    
    
    for(var i in spriteDb){
    	if(!spriteDb[i].size){  spriteDb[i].size = 1; }
    	if(!spriteDb[i].legs){  spriteDb[i].legs = 0; }
    	
    	for(var j in spriteDb[i]){
    		var anim = spriteDb[i][j];
    		anim.startY = anim.startY || 0; 
    		anim.spd = anim.spd || 1; 
    		anim.next = anim.next || 'Walk';
    	}
    
    
    }
    
    
    
    if(server){
        //Prepare the bumperbox and hitbox of sprites
        //hitbox: used for dmg collisions
        //bumperbox: used for map collisions

        for(var i in spriteDb){
    		var sp = spriteDb[i];
    		sp.sizeMod = 1;
    		if(sp.preHitBox){
    			sp.hitBox = []; sp.bumperBox = [];
    			sp.hitBox[0] = { "x":sp.preHitBox[1]*sp.size,"y":(sp.preHitBox[2]-sp.preHitBox[3])/2*sp.size };
    			sp.hitBox[1] = { "x":(sp.preHitBox[0]-sp.preHitBox[1])/2*sp.size,"y":sp.preHitBox[3]*sp.size };
    			sp.hitBox[2] = { "x":sp.preHitBox[0]*sp.size,"y":(sp.preHitBox[2]-sp.preHitBox[3])/2*sp.size };
    			sp.hitBox[3] = { "x":(sp.preHitBox[0]-sp.preHitBox[1])/2*sp.size,"y":sp.preHitBox[2]*sp.size };
    			
    			sp.bumperBox = []; sp.bumperBox = [];
    			sp.bumperBox[0] = { "x":sp.preBumperBox[1]*sp.size,"y":(sp.preBumperBox[2]+sp.preBumperBox[3])/2*sp.size };
    			sp.bumperBox[1] = { "x":(sp.preBumperBox[0]+sp.preBumperBox[1])/2*sp.size,"y":sp.preBumperBox[3]*sp.size };
    			sp.bumperBox[2] = { "x":sp.preBumperBox[0]*sp.size,"y":(sp.preBumperBox[2]+sp.preBumperBox[3])/2*sp.size };
    			sp.bumperBox[3] = { "x":(sp.preBumperBox[0]+sp.preBumperBox[1])/2*sp.size,"y":sp.preBumperBox[2]*sp.size };
    		}
    		spriteList[i] = sp;	
    	}
    }
    
    if(!server){
        for(var i in spriteDb){
    		var sp = spriteDb[i];
    		sp.img = newImage(sp.src);
    		preloader.push(sp.src);
    		
    		spriteList[i] = sp;	
    	}
    }
}




initSprite = function(player,info){
	player.sprite = useTemplate(defaultSprite(),info);
    if(server)	Sprite.updateBumper(player);
}
defaultSprite = function(){
	return {
    	name:'pBow',
    	anim:'Walk',
    	sizeMod : 1,
    	startX : 0,
    	spdBoost : 1,
    	timer : 0,
    	walk : 0
	}
}


Sprite = {};
Sprite.change = function(mort,info){
    if(!mort || !mort.sprite) return;
    if(info.name){ initSprite(mort,info);}
	if(info.anim){ 
		mort.sprite.anim = info.anim;
		mort.sprite.startX = 0;
		mort.sprite.spdBoost = 1;
		mort.sprite.timer = 0;
	}
	mort.sprite.anim = mort.sprite.anim || "Walk";
	mort.sprite.sizeMod = info.sizeMod || mort.sprite.sizeMod || 1;
	
	if(server && (info.name || info.sizeMod)) Sprite.updateBumper(mort);
}

//Set the Sprite Bumper Box to fit the sizeMod
Sprite.updateBumper = function(player){
	if(spriteList[player.sprite.name].hitBox){	//Attack Dont
		player.hitBox = deepClone(spriteList[player.sprite.name].hitBox);
		player.bumperBox = deepClone(spriteList[player.sprite.name].bumperBox);	
	
		for(var i = 0 ; i < player.hitBox.length ; i++){
			player.hitBox[i].x *= player.sprite.sizeMod;
			player.hitBox[i].y *= player.sprite.sizeMod;
			player.bumperBox[i].x *= player.sprite.sizeMod;
			player.bumperBox[i].y *= player.sprite.sizeMod;	
		}	
	}
}



Sprite.update = function (mort){
	var spriteServer = mort.sprite;
	var spriteFromDb = spriteList[spriteServer.name];
	var image = spriteFromDb.img;
	var animFromDb = spriteFromDb.anim[spriteServer.anim];
	
	var mod = 1;
	if(animFromDb.walk){    //if walking, the speed of animation depends on movement speed
		var spd =  Math.max(Math.abs(mort.spdX),Math.abs(mort.spdY));
		mod = Math.abs(spd/mort.maxSpd);
	}
	
	mort.sprite.timer += animFromDb.spd * mod;	if(!mort.sprite.timer){mort.sprite.timer = 0;}
	mort.sprite.startX = Math.floor(mort.sprite.timer);
	
	if(mort.sprite.startX > animFromDb.frame-1){
		if(!animFromDb.remove){
			Sprite.change(mort,{'anim':animFromDb.next});
		} else {
			remove(mort.id);    //aka death animation
		}
	}
	
}






//Sprite Animations

//Add animation to the game. target can be a string to specific an actor, or an obj x:1,y:1
addAnim = function(anim,target,sizeMod){
	sizeMod = sizeMod || 1;
	aList[a.id] = {'sizeMod':sizeMod,'name':anim,'target':target,'id':'a'+Math.randomId(5)};
}







