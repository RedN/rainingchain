{
	"id":"newMain",
	"src":"actor/newMain.png",	
	"size":2.5,
	"side":[1,2,3,0],
	"hpBar":-17,
	"legs":20,
	"preHitBox":[ -10,10,-10,17],
	"preBumperBox":[ -10,10,-10,17 ],
	"anim": {
		"walk":{
			"startY":0,
			"frame":4,
			"sizeX":24,
			"sizeY":32,
			"dir":4,
			"spd":0.4,
			"walk":1,
			"next":"walk"
		},
		"attack":{
			"startY":0,
			"frame":4,
			"sizeX":24,
			"sizeY":32,
			"dir":4,
			"spd":0.4,
			"next":"walk"
		}
    }
}