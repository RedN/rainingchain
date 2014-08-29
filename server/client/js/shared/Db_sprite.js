//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','Tk','Init','Activelist'],['Sprite']));

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
    
	a["mace"] = {"src":"actor/main.png","size":2.7,"side":[1,2,3,0],"hpBar":-17,"legs":20,
    	"preHitBox":[ -12,12,-12,12],"preBumperBox":[ -12,12,-5,20 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.5,"next":"walk"}
    	}};
	
	/*
	a["mace"] = {"src":"actor/main.png","size":1.5,"side":[3,2,1,0],"hpBar":-40,"legs":32,
    	"preHitBox":[ -24,24,-20,24],"preBumperBox":[ -36/3*2.5/1.5,36/3*2.5/1.5,-16/3*2.5/1.5,56/3*2.5/1.5 ],"anim": {
		//"preHitBox":[ -24,24,-20,24],"preBumperBox":[ -24,24,0,48 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":64,"sizeY":64,"dir":4,"spd":2,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":64,"sizeY":64,"dir":4,"spd":2,"next":"walk"},
    		"travel":{"startY":0,"frame":4,"sizeX":64,"sizeY":64,"dir":4,"spd":2,"next":"walk"},
    	}};
	*/
	
	var tmp = Init.db.sprite.player = {
		body:[
			205,206,207,208,209,210,211,221,222,223,224,225,325,326,327,328,410,411,412,413,680,
		],
		helm:[
			//120,
			132,133,134,135,136,137,138,139,140,141,15085,15088,15191,15192,15193,15194,15195,15196,15197,15198,15199,15200,15201,15202,15203,15204,15205,168,169,170,171,172,173,174,175,176,177,178,179,
			1389,1507,230,253,254,255,256,257,361,641
		],
		skin:[
			115,291,432,434
		],
	};
	for(var i in tmp)
		for(var j in tmp[i]) 
			a[tmp[i][j]] = {"src":"player/" + i + '/' + tmp[i][j] + ".png",player:1,"size":2.7,"side":[1,2,3,0],"hpBar":-17,"legs":20,
			"preHitBox":[ -12,12,-12,12],"preBumperBox":[ -12,12,-5,20 ],"anim": {
				"walk":{"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
				"attack":{"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.5,"next":"walk"}
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
   
	
	var list = {'warrior-male':6,'warrior-female':5,'villager-male':10,'villager-female':9,'villager-child':6,'fairy':8,'bad-monster':3,'bad-human':5};
	for(var i in list)	for(var j = 0; j < list[i]; j++) a[i + j] = {"src":"actor/" + i + j +".png",rgpvx:1};

	a["villager-female1"] ={"src":"actor/villager-female1.png","size":2,"side":[0,1,2,3],"hpBar":-22,"legs":16,
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
    	
		
	a["orc-magic"] ={"src":"actor/orc-magic.png","size":2,"side":[2,0,1,3],"hpBar":-30,"legs":25,
    	"preHitBox":[ -20,20,-10,25 ],"preBumperBox":[ -20,20,-10,25 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"next":"walk"},
    	}};
	a["orc-melee"] ={"src":"actor/orc-melee.png","size":2,"side":[2,0,1,3],"hpBar":-30,"legs":25,
    	"preHitBox":[ -20,20,-10,25 ],"preBumperBox":[ -20,20,-10,25 ],"anim": {
    		"walk":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"walk":1,"next":"walk"},
    		"attack":{"startY":0,"frame":4,"sizeX":32,"sizeY":48,"dir":4,"spd":0.25,"next":"walk"},
    	}};
	a["orc-range"] ={"src":"actor/orc-range.png","size":2,"side":[2,0,1,3],"hpBar":-30,"legs":25,
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
    a["fireball"] ={"src":"bullet/fireball.png","size":1,"side":[0],canvasRotate:1,"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0.2,"next":"travel"},
    	}};
    			
    a["iceshard"] ={"src":"bullet/iceshard.png","size":1,"side":[0],canvasRotate:1,"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"travel"},
    	}};
    a["lightningball"] ={"src":"bullet/lightningball.png","size":1,"side":[0],canvasRotate:1,"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"travel"},
    	}};
    	
		/*
    a["arrow"] ={"src":"picture/pony.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":50,"sizeY":40,"dir":1,"spd":0,"next":"travel"},
    	}};
		*/
		
	a["bullet-pony"] ={"src":"bullet/bullet-pony.png","size":1,"side":[0,1],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":2,"spd":0,"next":"travel"},
    	}};
	a["bullet-happyface"] ={"src":"bullet/bullet-happyface.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"travel"},
    	}};	
	a["bullet-penguin"] ={"src":"bullet/bullet-penguin.png","size":1,"side":[0],"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"travel"},
    	}};	
		
	a["arrow"] ={"src":"bullet/arrow.png","size":1,"side":[0],canvasRotate:1,"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":42,"sizeY":11,"dir":1,"spd":0,"next":"travel"},
    }};
	
	a["bullet-cannon"] ={"src":"bullet/bullet-cannon.png","size":1,"side":[0],canvasRotate:1,"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":42,"sizeY":11,"dir":1,"spd":0,"next":"travel"},
    }};	
	//a["pony"] = {"src":"picture/pony.png","size":2,"preBumperBox":[ -25,25,-20,20 ]};
		
	
	a["dart"] ={"src":"bullet/dart.png","size":2,"side":[0],canvasRotate:1,"anim": {
    		"travel":{"startY":0,"frame":1,"sizeX":16,"sizeY":16,"dir":1,"spd":0,"next":"travel"},
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
	for(var i = 0 ; i<= 15; i++)
		a["number-" + i] ={"src":"picture/number" + i + ".png","size":2,legs:-100,"preBumperBox":[ -16,16,-16,16 ]};
	
	a["number-empty"] ={"src":"picture/numberEmpty.png",legs:-100,"size":2,"preBumperBox":[ -16,16,-16,16 ]};
	a["number-flag"] ={"src":"picture/numberFlag.png",legs:-100,"size":2,"preBumperBox":[ -16,16,-16,16 ]};
	
	
	a["system-sign"] ={"src":"picture/sign.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	
	a["system-target"] ={"src":"picture/target.png","size":0.5,"preBumperBox":[ -48,48,-48,48 ]};
	
	a["pushable-rock1x1"] ={"src":"picture/pushable-rock2x2.png","size":0.5,"preBumperBox":[ -31,31,-31,31 ]};
	a["waypoint-grave"] ={"src":"picture/waypoint-grave.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	
	a["loot-chestOn"] ={"src":"picture/loot-chestOn.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	a["loot-chestOff"] ={"src":"picture/loot-chestOff.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	
	a["toggle-boxOff"] ={"src":"picture/toggle-boxOff.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	a["toggle-boxOn"] ={"src":"picture/toggle-boxOn.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	a["toggle-wallOff"] ={"src":"picture/toggle-wallOff.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	a["toggle-wallOn"] ={"src":"picture/toggle-wallOn.png","size":2,"preBumperBox":[ -16,16,-16,16 ]};
	
	a["tree-red"] ={"src":"picture/tree-red.png","size":2,'legs':40,"preBumperBox":[ -32,32,-40,40 ]};
	a["tree-down"] ={"src":"picture/tree-down.png","size":2,"preBumperBox":[ -32,32,-40,40 ]};
	
	a["rock-bronze"] ={"src":"picture/rock-bronze.png",'legs':30,"size":1.5,"preBumperBox":[ -32,32,-32,32 ]};
	a["rock-down"] ={"src":"picture/rock-down.png",'legs':30,"size":1.5,"preBumperBox":[ -32,32,-32,32 ]};
	
	a["hunt-down"] ={"src":"picture/hunt-down.png",'legs':35,"size":1.5,"preBumperBox":[ -16,16,-32,32 ]};
	
	a["hunt-squirrel"] = {
		"src":"actor/squirrel.png",	
		"size":2,
		"link":"http://charas-project.net/resources_download.php?id=15580&file=resources%2FCharasets%2F1%2F10052_1098590341.png",
		"side":[1,2,3,0],
		"preHitBox":[ -12,12,-12,12],
		"anim": {
			"walk":{"startY":0,"frame":3,"sizeX":24,"sizeY":24,"dir":4,"spd":0.4,"walk":true,"next":"walk"},
		}
	}
	
	
	a["teleport-door"] ={"src":"picture/teleport-door.png","size":2,"side":[0],"preBumperBox":[ -16,16,-40,8 ],"anim": {
		"walk":{"startY":0,"frame":1,"sizeX":32,"sizeY":80,"dir":1,"spd":1,"next":"walk"},
	}};	
	a["teleport-cave"] ={"src":"picture/teleport-cave.png","size":1,"side":[0],"centerY":-32,"preBumperBox":[ -64,64,-50,52 ],"anim": {
		"walk":{"startY":0,"frame":1,"sizeX":128,"sizeY":102,"dir":1,"spd":1,"next":"walk"},
	}};
	a["teleport-zone"] ={"src":"picture/teleport-zone.png","size":1.5,legs:-1000,"side":[0,1,2,3],"preBumperBox":[ -16,16,-16,16 ]};
	a["teleport-underground"] ={"src":"picture/teleport-underground.png","size":2.5,"preBumperBox":[ -16,16,-16,16 ]};
	a["teleport-well"] ={"src":"picture/teleport-well.png","size":2,"preBumperBox":[ -24,24,-24,24 ]};
	
	a["block-rock1x1"] ={"src":"picture/block-rock2x2.png","size":0.5,"preBumperBox":[ -31,31,-31,31]};
	a["block-barrier"] ={"src":"picture/block-barrier.png","size":1,hpBar:-40,"preBumperBox":[ -64,64,-32,32 ]};
	a["block-spike"] ={"src":"picture/block-spike1x1.png","size":2,"preBumperBox":[ -8,8,-16,16 ]};
	a["block-spike1x1"] ={"src":"picture/block-spike1x1.png","size":2,"preBumperBox":[ -8,8,-16,16 ]};
	
	a["block-spike1x3"] ={"src":"picture/block-spike1x3.png","size":2,"preBumperBox":[ -8,40,-16,16 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":80,"sizeY":32,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	a["block-spike1x5"] ={"src":"picture/block-spike1x5.png","size":2,"preBumperBox":[ -8,72,-16,16 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":144,"sizeY":32,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	a["block-spike1x9"] ={"src":"picture/block-spike1x9.png","size":2,"preBumperBox":[ -8,104,-16,16 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":272,"sizeY":32,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	
	a["block-spike3x1"] ={"src":"picture/block-spike3x1.png","size":2,"preBumperBox":[ -8,8,-16,48 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":16,"sizeY":96,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	a["block-spike5x1"] ={"src":"picture/block-spike5x1.png","size":2,"preBumperBox":[ -8,8,-16,80 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":16,"sizeY":160,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	a["block-spike9x1"] ={"src":"picture/block-spike9x1.png","size":2,"preBumperBox":[ -8,8,-16,112 ],anim:{
		"walk":{"startY":0,"frame":1,"sizeX":16,"sizeY":256,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
		
	a["block-bridgeH"] ={"src":"picture/block-bridgeH.png","size":2,"preBumperBox":[ -15,15,-15,15 ],legs:-50,anim:{
		"walk":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	
	a["block-bridgeV"] ={"src":"picture/block-bridgeV.png","size":2,"preBumperBox":[ -15,15,-15,15 ],legs:-50,anim:{
		"walk":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"walk":0,"next":"walk"},
	}};
	
	a["invisible"] ={"src":"picture/invisible.png","size":1,"preBumperBox":[ -16,16,-16,16 ]};
	
	a["loot-flowerOn"] = {"src":"picture/loot-flowerOn.png","size":4,"preBumperBox":[ -16,16,-16,16 ]};
	a["loot-flowerOff"] = {"src":"picture/loot-flowerOff.png","size":4,"preBumperBox":[ -16,16,-16,16 ]};
	
	
	
	
	//TOWER
	a["tower-green"] ={"src":"picture/tower-green.png","size":1,"preBumperBox":[ -32,32,-32,32 ],"anim": {
		"walk":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},
		"attack":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},
	}};
	a["tower-yellow"] ={"src":"picture/tower-yellow.png","size":1,"preBumperBox":[ -32,32,-32,32 ],"anim": {
		"walk":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},
		"attack":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},
	}};
	a["tower-red"] ={"src":"picture/tower-red.png","size":1,"preBumperBox":[ -32,32,-32,32 ],"anim": {
		"walk":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},
		"attack":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},
	}};
	a["tower-blue"] ={"src":"picture/tower-blue.png","size":1,"preBumperBox":[ -32,32,-32,32 ],"anim": {
		"walk":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},
		"attack":{"startY":0,"frame":1,"sizeX":64,"sizeY":64,"dir":1,"spd":0,"next":"walk"},
	}};
	a["tower-enemy"] ={"src":"picture/tower-enemy.png","size":2,"preBumperBox":[ -16,16,-16,16 ],"anim": {
		"walk":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"walk"},
		"attack":{"startY":0,"frame":1,"sizeX":32,"sizeY":32,"dir":1,"spd":0,"next":"walk"},
	}};
	//}
    
    
    for(var i in Db.sprite){
		Db.sprite[i].id = i;
    	Sprite.creation.model(Db.sprite[i]);    
    }
        
}

Init.db.sprite.template = function(){
	return {
		src:"actor/main.png",
		img:null,
		size:1,
		side:[0,1,2,3],
		hpBar:0,
		legs:0,
		preHitBox:[-10,10,-10,10],
		preBumperBox:[-10,10,-10,10],
		bumperBox:[-10,10,-10,10],
		hitBox:[-10,10,-10,10],
		anim:{walk:Init.db.sprite.template.anim()},
		defaultAnim:"walk",
		alpha:1,
		canvasRotate:0,
	}
}

Init.db.sprite.template.anim = function(){
	return {"startY":0,"frame":4,"sizeX":24,"sizeY":32,"dir":4,"spd":0.4,"walk":0,"next":"walk"};
}

Init.db.sprite.template.rpgvx = function(){
	return {"size":2,"side":[2,0,1,3],"hpBar":-22,"legs":16,
		"preHitBox":[ -16,16,-16,16 ],"preBumperBox":[ -16,16,-16,16 ],
		"anim": {
			"walk":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.5,"walk":1,"next":"walk"},
			"attack":{"startY":0,"frame":3,"sizeX":32,"sizeY":32,"dir":4,"spd":0.5,"next":"attack"},
		}};
}

var Sprite = exports.Sprite = {};

Sprite.creation = function(act,info){	
	if(!info.anim) info.anim = Db.sprite[info.name || 'mace'].defaultAnim;
	info.oldAnim = info.anim;	
	act.sprite = Tk.useTemplate(Sprite.template(),info,true);
	Sprite.updateBumper(act);
}

Sprite.creation.model = function(sp){
	if(sp.rgpvx)	sp = Tk.useTemplate(Init.db.sprite.template.rpgvx(),sp,true);	//cuz im lazy...'
	
	if(!sp.side) sp.side = [0];
	if(!sp.preHitBox && sp.preBumperBox) sp.preHitBox = Tk.deepClone(sp.preBumperBox);
	if(!sp.anim) sp.anim = {"walk":{"startY":0,"frame":1,"sizeX":sp.preHitBox[1]*2,"sizeY":sp.preHitBox[3]*2,"dir":sp.side.length,"spd":0,"walk":0,"next":"walk"}};
	
	sp = Tk.useTemplate(Init.db.sprite.template(),sp,true);
	
	for(var j in sp.anim)	sp.anim[j] = Tk.useTemplate(Init.db.sprite.template.anim(),sp.anim[j],true);

	//Prepare the bumperbox and hitbox of sprites       //hitbox: used for dmg collisions       //bumperbox: used for map collisions
	sp.bumperBox = [];
	sp.bumperBox[0] = { "x":sp.preBumperBox[1]*sp.size,"y":(sp.preBumperBox[2]+sp.preBumperBox[3])/2*sp.size };
	sp.bumperBox[1] = { "x":(sp.preBumperBox[0]+sp.preBumperBox[1])/2*sp.size,"y":sp.preBumperBox[3]*sp.size };
	sp.bumperBox[2] = { "x":sp.preBumperBox[0]*sp.size,"y":(sp.preBumperBox[2]+sp.preBumperBox[3])/2*sp.size };
	sp.bumperBox[3] = { "x":(sp.preBumperBox[0]+sp.preBumperBox[1])/2*sp.size,"y":sp.preBumperBox[2]*sp.size };

	sp.hitBox = []; 
	sp.hitBox[0] = { "x":sp.preHitBox[1]*sp.size,"y":(sp.preHitBox[2]-sp.preHitBox[3])/2*sp.size };
	sp.hitBox[1] = { "x":(sp.preHitBox[0]-sp.preHitBox[1])/2*sp.size,"y":sp.preHitBox[3]*sp.size };
	sp.hitBox[2] = { "x":sp.preHitBox[0]*sp.size,"y":(sp.preHitBox[2]-sp.preHitBox[3])/2*sp.size };
	sp.hitBox[3] = { "x":(sp.preHitBox[0]-sp.preHitBox[1])/2*sp.size,"y":sp.preHitBox[2]*sp.size };
    
    if(!SERVER){
		sp.src = 'img/sprite/' + sp.src
		sp.img = Tk.newImage(sp.src);
		Img.preloader.push(sp.src);
    }
	Db.sprite[sp.id] = sp;
}


Sprite.template = function(){
	return {
    	name:'mace',
		anim:"walk",		//on SERVER: normally null. change for 1 frame when attack
    	oldAnim:"walk",		//client stuff
		sizeMod : 1,
    	startX : 0,
    	timer : 0,
		alpha: 1,
		dead: 0,			//used to change alpha
		normal:'mace',		//default appearance, contribution reward
		mirror:0,			//if 90 < angle < 270, symetry
		rotateCanvas:0,		
	}
}

Sprite.change = function(act,info){
    if(!act || !act.sprite) return ERROR(5,'no sprite');

	if(info.anim){ 
		act.sprite.anim = info.anim;
		act.sprite.startX = 0;
		act.sprite.timer = 0;
	}
	
	if(info.name){
		if(info.name === 'normal')  act.sprite.name = act.sprite.normal;
		else act.sprite.name = info.name;
	}
	act.sprite.sizeMod = info.sizeMod || act.sprite.sizeMod;
		
	if(info.sizeMod || info.name) Sprite.updateBumper(act);
}

Sprite.getRegular = function(act){	//check equip
	return 'mace';
}

Sprite.updateBumper = function(act){		//server only
	//Set the Sprite Bumper Box to fit the sizeMod
	if(!act.sprite.name) return ERROR(3,'no sprite name',act.name);
	var dsp = Db.sprite[act.sprite.name.split(',')[0]];
	if(!dsp) return ERROR(4,'no sprite',act.sprite.name);
	if(!dsp.hitBox) return;	//Attack Dont
	
	act.hitBox = Tk.deepClone(dsp.hitBox);
	act.bumperBox = Tk.deepClone(dsp.bumperBox);	
	
	for(var i = 0 ; i < act.hitBox.length ; i++){
		act.hitBox[i].x *= act.sprite.sizeMod;
		act.hitBox[i].y *= act.sprite.sizeMod;
		act.bumperBox[i].x *= act.sprite.sizeMod;
		act.bumperBox[i].y *= act.sprite.sizeMod;	
	}
}



Sprite.update = function (act){	//client side only
	if(!act.sprite) return;
	var dsp = Db.sprite[Draw.actor.getSpriteName(act)];
	if(!dsp){ ERROR(4,"sprite dont exist",act.sprite.name); dsp = Db.sprite['mace'];}
	if(act.sprite.animOld !== act.sprite.anim){	//otherwise, animation can be cut if timer for walk is high 
		act.sprite.animOld = act.sprite.anim;
		Sprite.change(act,{'anim':act.sprite.anim});
	}
	var animFromDb = dsp.anim[act.sprite.anim];	
	if(!animFromDb) return ERROR(4,"sprite anim dont exist",act.sprite.name,act.sprite.anim);
	var mod = 1;
	if(animFromDb.walk){    //if walking, the speed of animation depends on movement speed
		var spd =  Math.max(Math.abs(act.spdX),Math.abs(act.spdY))/2;	//divide by 2, idk why but it works, probably because xy update only send 1/2 times
		mod = Math.abs(spd/act.maxSpd) || 0;
		
		var angle = Math.round(act.angle/(360/4));
		if(angle === 0 && act.angle >= 180-45 && act.angle <= 180+45) mod *= -1;
		if(angle === 90 && act.angle >= 270-45 && act.angle <= 270+45) mod *= -1;
		if(angle === 180 && (act.angle >= 360-45 || act.angle <= 0+45)) mod *= -1;
		if(angle === 270 && act.angle >= 90-45 && act.angle <= 90+45) mod *= -1;
	}
	act.sprite.timer += animFromDb.spd * mod;	
	act.sprite.startX = Math.floor(act.sprite.timer);
	if(act.sprite.startX < 0){	//weird... cuz backwalk
		act.sprite.startX = animFromDb.frame
	}
	if(act.sprite.startX > animFromDb.frame-1){
		Sprite.change(act,{'anim':animFromDb.next});
	}
	if(act.sprite.dead){
		act.sprite.alpha -= act.sprite.dead;
		if(act.sprite.alpha < 0)	Activelist.removeAny(act.id);
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




