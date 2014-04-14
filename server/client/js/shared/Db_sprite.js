/*
"mace":{                               //id of the sprite
    "src":"img/Sprite/human.png"        //image src
    "size":1.5,                         //size factor
    "side":[2,6,0,4,1,5,3,7],           //side[0] = 2 => the right-facing position is in the 3rd row. 
    "hpBar":-40,                        //hp bar distance from center (in y)
    "legs":35,                          //used when sorting draw by y.
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
	    	"walk":1,       //if walk, movement speed will impact frame spd
	    	"next":"walk"   //once animation complete, what animation to do?    //default is Walk
	    },
		"attack":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,"next":"walk"}
	}},
*/



Init.db.sprite = function(){
	
	var a = Db.sprite =	{};
    //ts('Sprite.change(p,{name:"taurus"});')
    //{ PLAYER
    a["mace"] = {"src":"actor/main.png","size":2.5,"side":[1,2,3,0],"hpBar":-50/3,"legs":20,
    	"preHitBox":[ -36/3,36/3,-16/3,56/3],"preBumperBox":[ -36/3,36/3,-16/3,56/3 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.4,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.4,"next":"walk"}
    	}};
		
	a["sword"] = {"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}};
		
	a["spear"] = {"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}};
		
	a["bow"] ={"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}};
		
	a["wand"] ={"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}};
		
	//}
    //{ NPC
    a["jenny"] ={"src":"actor/jenny.png","size":2,"side":[0,1,2,3],"hpBar":-22,"legs":16,
    	"preHitBox":[ -16,16,-16,16 ],"preBumperBox":[ -16,16,-16,16 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    	}};
    //}	
    //{ ENEMY
    a["slime"] ={"src":"actor/slimeJerome.png","size":1,"side":[0,1,2,3],"hpBar":-110,"legs":70,
    	"preHitBox":[ -70,70,-45,90 ],"preBumperBox":[ -55,55,-15,80 ],"anim": {
    		"walk":{"startY":0,"frame":5,"sizeX":200,"sizeY":200,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":5,"sizeX":200,"sizeY":200,"dir":4,"spd":0.5,"next":"walk"},
    	}};
    
    a["troll"] ={"src":"actor/troll.png","size":1,"side":[0,1,2,3],"hpBar":-70,"legs":35,
    	"preHitBox":[ -33,33,-30,64 ],"preBumperBox":[ -33,33,-30,64 ],"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":128,"sizeY":128,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":128,"sizeY":128,"dir":4,"spd":0.25,"next":"walk"},
    	}};
    	
		
	a["orcMagic"] ={"src":"actor/orcMagic.png","size":2,"side":[2,0,1,3],"hpBar":-30,"legs":25,
    	"preHitBox":[ -20,20,-10,25 ],"preBumperBox":[ -20,20,-10,25 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"next":"walk"},
    	}};
	a["orcMelee"] ={"src":"actor/orcMelee.png","size":2,"side":[2,0,1,3],"hpBar":-30,"legs":25,
    	"preHitBox":[ -20,20,-10,25 ],"preBumperBox":[ -20,20,-10,25 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"next":"walk"},
    	}};
	a["orcRange"] ={"src":"actor/orcRange.png","size":2,"side":[2,0,1,3],"hpBar":-30,"legs":25,
    	"preHitBox":[ -20,20,-10,25 ],"preBumperBox":[ -20,20,-10,25 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"next":"walk"},
    	}};
	//}
	//{ RPG MAKER
	a["aquanite"] = {"src":"actor/aquanite.png",rgpvx:1};
	a["aquagoblin"] ={"src":"actor/aquagoblin.png","size":2,"side":[2,0,1,3],"hpBar":-40,"legs":35,
    	"preHitBox":[ -15,15,-15,32 ],"preBumperBox":[ -15,15,-15,32 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":48,"sizeY":64,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":48,"sizeY":64,"dir":4,"spd":0.5,"next":"walk"},
    	}};
	
	a["bat"] = {"src":"actor/bat.png",rgpvx:1};
	
	a["basilisk"] ={"src":"actor/basilisk.png","size":1,"side":[2,0,1,3],"hpBar":-40,"legs":35,
    	"preHitBox":[ -15,15,-15,32 ],"preBumperBox":[ -15,15,-15,32 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":64,"sizeY":64,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":64,"sizeY":64,"dir":4,"spd":0.5,"next":"walk"},
    	}};
	a["bee"] = {"src":"actor/bee.png",rgpvx:1};
	
	a["draco"] ={"src":"actor/draco.png","size":1,"side":[2,0,1,3],"hpBar":-55,"legs":50,
    	"preHitBox":[ -30,30,-30,40 ],"preBumperBox":[ -30,30,-30,40 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    	}};
	a["demon"] = {"src":"actor/demon.png",rgpvx:1};
	a["dragon"] = {"src":"actor/dragon.png",rgpvx:1};
	a["dragonBaby"] = {"src":"actor/dragonBaby.png",rgpvx:1};
	a["death"] = {"src":"actor/death.png",rgpvx:1};
	
	a["dragonKing"] ={"src":"actor/dragonKing.png","size":1,"side":[2,0,1,3],"hpBar":-55,"legs":50,
    	"preHitBox":[ -30,30,-30,40 ],"preBumperBox":[ -30,30,-30,40 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    	}};
		
	a["larva"] = {"src":"actor/larva.png",rgpvx:1};
	a["gargoyle"] = {"src":"actor/gargoyle.png",rgpvx:1};
	a["ghost"] = {"src":"actor/ghost.png",rgpvx:1};
	a["goblin"] = {"src":"actor/goblin.png",rgpvx:1};
	a["goddessFire"] = {"src":"actor/goddessFire.png",rgpvx:1};
	a["goddessIce"] = {"src":"actor/goddessIce.png",rgpvx:1};
	
	a["plant"] = {"src":"actor/plant.png",rgpvx:1};
	a["mushroom"] = {"src":"actor/mushroom.png",rgpvx:1};
	a["skeleton"] = {"src":"actor/skeleton.png",rgpvx:1};
	a["mosquito"] = {"src":"actor/mosquito.png",rgpvx:1};
	
	
	a["scorpion"] ={"src":"actor/scorpion.png","size":2,"side":[2,0,1,3],"hpBar":-30,"legs":50,
    	"preHitBox":[ -15,15,-15,20 ],"preBumperBox":[ -15,15,-15,20 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":64,"sizeY":64,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":64,"sizeY":64,"dir":4,"spd":0.5,"next":"walk"},
    	}};
	a["mummy"] ={"src":"actor/mummy.png","size":1.5,"side":[2,0,1,3],"hpBar":-40,"legs":40,
    	"preHitBox":[ -30,30,-20,40 ],"preBumperBox":[ -30,30,-20,40 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":80,"sizeY":80,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":80,"sizeY":80,"dir":4,"spd":0.5,"next":"walk"},
    	}};
	a["birdBlue"] ={"src":"actor/birdBlue.png","size":1,"side":[2,0,1,3],"hpBar":-50,"legs":50,
    	"preHitBox":[ -30,30,-20,40 ],"preBumperBox":[ -30,30,-20,40 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    	}};	
		
		
	a["salamander"] ={"src":"actor/salamander.png","size":2,"side":[2,0,1,3],"hpBar":-40,"legs":40,
    	"preHitBox":[ -30,30,-20,30 ],"preBumperBox":[ -30,30,-20,30 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":64,"sizeY":48,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":64,"sizeY":48,"dir":4,"spd":0.25,"next":"walk"},
    	}};	
		
	a["spirit"] = {"src":"actor/spirit.png",rgpvx:1};
	
	a["slime"] ={"src":"actor/slime.png","size":1.5,"side":[2,0,1,3],"hpBar":-30,"legs":30,
    	"preHitBox":[ -20,20,-10,20 ],"preBumperBox":[ -20,20,-10,20 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":48,"sizeY":48,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":48,"sizeY":48,"dir":4,"spd":0.5,"next":"walk"},
    	}};	
		
	a["snake"] ={"src":"actor/snake.png","size":1,"side":[2,0,1,3],"hpBar":-30,"legs":30,
    	"preHitBox":[ -20,20,-10,20 ],"preBumperBox":[ -20,20,-10,20 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":48,"sizeY":48,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":48,"sizeY":48,"dir":4,"spd":0.5,"next":"walk"},
    	}};	
		
	a["birdRed"] ={"src":"actor/birdRed.png","size":1,"side":[2,0,1,3],"hpBar":-50,"legs":50,
    	"preHitBox":[ -40,40,-30,40 ],"preBumperBox":[ -40,40,-30,40 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    	}};
		
	a["taurus"] ={"src":"actor/taurus.png","size":1.5,"side":[2,0,1,3],"hpBar":-55,"legs":50,
    	"preHitBox":[ -60,60,-40,60 ],"preBumperBox":[ -60,60,-40,60 ],"anim": {
    		"walk":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":3,"sizeX":96,"sizeY":96,"dir":4,"spd":0.5,"next":"walk"},
    	}};	
	
	a["werewolf"] ={"src":"actor/werewolf.png","size":2,"side":[2,0,1,3],"hpBar":-40,"legs":32,
    	"preHitBox":[ -30,30,-20,30 ],"preBumperBox":[ -30,30,-20,30 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":64,"sizeY":48,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":64,"sizeY":48,"dir":4,"spd":0.5,"next":"walk"}
    	}};		
	//}	
    //{ BULLET
    a["fireball"] ={"src":"bullet/fireball.png","size":1,"side":[0,1,2,3],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":4,"spd":0.2,"next":"travel"},
    	}};
    			
    a["iceshard"] ={"src":"bullet/iceshard.png","size":1,"side":[0,1,2,3,4,5,6,7],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":8,"spd":0,"next":"travel"},
    	}};
    a["lightningball"] ={"src":"bullet/lightningball.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"travel"},
    	}};
    	
    a["arrow"] ={"src":"bullet/arrow.png","size":1,"side":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":42,"sizeY":42,"dir":16,"spd":0,"next":"travel"},
    	}};
     a["dart"] ={"src":"bullet/dart.png","size":2,"side":[0,1,2,3,4],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":16,"sizeY":16,"dir":4,"spd":0,"next":"travel"},
    	}};	
    a["boomerang"] ={"src":"bullet/boomerang.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":8,"sizeX":52,"sizeY":52,"dir":1,"spd":1,"next":"travel"},
    	}};
	a["bone"] ={"src":"bullet/bone.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":8,"sizeX":48,"sizeY":48,"dir":1,"spd":1,"next":"travel"},
    	}};
	a["spore"] ={"src":"bullet/spore.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":48,"sizeY":48,"dir":1,"spd":1,"next":"travel"},
    	}};
	a["rock"] ={"src":"bullet/rock.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":48,"sizeY":48,"dir":1,"spd":1,"next":"travel"},
    	}};
	a["shadowball"] ={"src":"bullet/shadowball.png","size":1,"side":[0],'link':'http://mohsin-kun.deviantart.com/art/Shadow-Ball-73303663',"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":48,"sizeY":48,"dir":1,"spd":1,"next":"travel"},
    	}};	
	a["tornado"] ={"src":"bullet/tornado.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":5,"sizeX":48,"sizeY":48,"dir":1,"spd":1,"next":"travel"},
    	}};	

    //}	
    //{ System
	a["block1x1"] ={"src":"picture/block2x2.png","size":0.5,"side":[0],
		"preBumperBox":[ -26,26,-26,26 ],"preHitBox":[ -26,26,-26,26 ],"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},    	
    	}};
		
	a["grave"] ={"src":"picture/grave.png","size":2,"side":[0],
    	"preBumperBox":[ -16,16,-16,16 ],"preHitBox":[ -16,16,-16,16 ],"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"walk"},    	
    	}};
		
	a["chest"] ={"src":"picture/chest.png","size":2,"side":[0],
    	"preBumperBox":[ -16,16,-16,16 ],"preHitBox":[ -16,16,-16,16 ],'defaultAnim':'off',"anim": {
    		"on":{"startY":32,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"on"},
			"off":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"off"},			
    	}};
		
	a["block1x1-black"] ={"src":"picture/block2x2Fix.png","size":0.5,"side":[0],
    	"preBumperBox":[ -26,26,-26,26 ],"preHitBox":[ -26,26,-26,26 ],"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},    	
    	}};
		
	a["treeRed"] ={"src":"picture/treeRed.png","size":2,"side":[0],
    	"preBumperBox":[ -32,32,-40,40 ],"preHitBox":[ -32,32,-40,40 ],'defaultAnim':'on',"anim": {
    		"on":{"startY":0,"frame":1,"sizeX":64,"sizeY":80,"dir":1,"spd":0,"next":"on"},
			"off":{"startY":80,"frame":1,"sizeX":64,"sizeY":80,"dir":1,"spd":0,"next":"off"},  		  			
    	}};
		
	a["switchBox"] ={"src":"picture/switch.png","size":2,"side":[0],
    	"preBumperBox":[ -16,16,-16,16 ],"preHitBox":[ -16,16,-16,16 ],'defaultAnim':'off',"anim": {
    		//"walk":{"startY":64,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"walk"},  
			"off":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"off"},	
			"on":{"startY":64,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"on"},							
    	}};
	
	a["door"] ={"src":"picture/door.png","size":1,"side":[0],
    	"preBumperBox":[ -16,16,-8,40 ],"preHitBox":[ -16,16,-8,40 ],"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":32,"sizeY":80,"dir":1,"spd":0,"next":"walk"},  
    	}};
		
	a["teleZone"] ={"src":"picture/teleZone.png","size":1.5,"side":[0,1,2,3],
    	"preBumperBox":[ -16,16,-16,16 ],"preHitBox":[ -16,16,-16,16 ],"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":4,"spd":0,"next":"walk"},  
    	}};
	
	a["barrier"] ={"src":"picture/barrier.png","size":1,"side":[0],
    	"preBumperBox":[ -64,64,-32,32 ],"preHitBox":[ -64,64,-32,32 ],"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":128,"sizeY":64,"dir":1,"spd":0,"next":"walk"},  
    	}};
	a["spike"] ={"src":"picture/spike.png","size":1,"side":[0],"legs":32,
    	"preBumperBox":[ -16,16,-32,32 ],"preHitBox":[ -16,16,-32,32 ],"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":32,"sizeY":64,"dir":1,"spd":0,"next":"walk"},  
    	}};
	a["underground"] ={"src":"picture/barrier.png","size":2,"side":[0],
    	"preBumperBox":[ -16,16,-16,16 ],"preHitBox":[ -16,16,-16,16 ],"anim": {
    		"walk":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"walk"},  
    	}};
	
	//}
    
    
    for(var i in Db.sprite){
		var spr = Db.sprite[i];
    	
		if(spr.rgpvx){
			var src = spr.src;
			spr = {"size":2,"side":[2,0,1,3],"hpBar":-22,"legs":16,
			"preHitBox":[ -16,16,-16,16 ],"preBumperBox":[ -16,16,-16,16 ],
			"anim": {
				"walk":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
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
    		anim.next = anim.next || "walk";
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
		initAnim:"walk",			//info about anim sent to client when init. use when anim is constant (ex: switch off)
    	anim:"walk",				//normally null. change for 1 frame when attack etc... changing initAnim will also change anim
    	sizeMod : 1,
    	oldAnim:"walk",				//client stuff
		startX : 0,
    	timer : 0,
    	walk : 0,	//??
		alpha: 1,
		dead: 0,
	}
}


Sprite.change = function(act,info){
    if(!act || !act.sprite) return;

	if(info.initAnim || info.anim){ 
		act.sprite.initAnim = info.initAnim || act.sprite.initAnim;
		act.sprite.anim = info.initAnim || info.anim;
		
		act.sprite.startX = 0;
		act.sprite.timer = 0;
	}
	act.sprite.name = info.name || act.sprite.name || 'mace';
	act.sprite.sizeMod = info.sizeMod || act.sprite.sizeMod || 1;
	
	if(info.sizeMod || info.name) Sprite.updateBumper(act);
	
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



Sprite.update = function (act){	//client side only
	if(!act.sprite) return;
	var spriteFromDb = Db.sprite[act.sprite.name];
	if(!spriteFromDb){ DEBUG(1,"sprite dont exist"); spriteFromDb = Db.sprite['mace'];}
	if(act.sprite.animOld !== act.sprite.anim){	//otherwise, animation can be cut if timer for walk is high 
		act.sprite.animOld = act.sprite.anim;
		Sprite.change(act,{'anim':act.sprite.anim});
	}
	var animFromDb = spriteFromDb.anim[act.sprite.anim];
	
	
	
	
	var mod = 1;
	if(animFromDb.walk){    //if walking, the speed of animation depends on movement speed
		var spd =  Math.max(Math.abs(act.spdX),Math.abs(act.spdY));
		mod = Math.abs(spd/act.maxSpd);
	}
	
	act.sprite.timer += animFromDb.spd * mod;	if(!act.sprite.timer){act.sprite.timer = 0;}
	act.sprite.startX = Math.floor(act.sprite.timer);
	
	if(act.sprite.startX > animFromDb.frame-1){
		Sprite.change(act,{'anim':animFromDb.next});
	}
	if(act.sprite.dead){
		act.sprite.alpha -= act.sprite.dead;
		if(act.sprite.alpha < 0){
			removeAny(act.id);
		}
	}
	
}




/*
    	"mace":{"src":"actor/mace.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		*/
		/*
		"mace":{"src":"actor/mace.png","size":1.5*0.9,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -18,18,4,35 ],
    	"anim": {
    		"walk":{"startY":0,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":256,"frame":6,"sizeX":128,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		
		
		"mace2":{"src":"actor/human.png","size":1.5,"side":[2,6,0,4,1,5,3,7],"hpBar":-40,"legs":35,
    	"preHitBox":[ -12,12,-35,35 ],"preBumperBox":[ -12,12,0,35 ],
    	"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":70,"sizeY":70,"dir":8,"spd":0.8,"next":"walk"}
    	}},
		
    	"spear":{"src":"actor/spear.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":64*21,"frame":8,"sizeX":64*3,"sizeY":64*3,"dir":4,"spd":1,"next":"walk"}
    	}},
    	
    	"sword":{"src":"actor/sword.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":64*21,"frame":6,"sizeX":64*3,"sizeY":64*3,"dir":4,"spd":1,"next":"walk"}
    	}},
    	
    	"bow":{"src":"actor/bow.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":64*16,"frame":13,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
    	
    	"wand":{"src":"actor/wand.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":20,
    	"preHitBox":[ -20,20,-20,32 ],"preBumperBox":[ -12,12,4,30 ],
    	"anim": {
    		"walk":{"startY":64*8,"frame":9,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"walk":1,"next":"walk"},
    		"attack":{"startY":64*12,"frame":6,"sizeX":64,"sizeY":64,"dir":4,"spd":1,"next":"walk"}
    	}},
		
		*/




