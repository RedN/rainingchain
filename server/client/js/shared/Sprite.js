//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['ActiveList','Actor','SpriteModel'],['Sprite']));


//TODO: Sprite first argument is sprite
var Sprite = exports.Sprite = function(name,sizeMod){
	var s = {
    	name:'mace',
		anim:"walk",		//on SERVER: normally null. change for 1 frame when attack
    	oldAnim:"walk",		//client stuff
		sizeMod : 1,
    	startX : 0,
    	timer : 0,
		alpha: 1,
		dead: 0,			//used to change alpha
		normal:'mace',		//default appearance, contribution reward
	};
	s.name = name;
	s.sizeMod = sizeMod || 1;
	var model = SpriteModel.get(name);
	if(!model) return ERROR(4,'no model for name',name);
	s.anim = s.oldAnim = model.defaultAnim;
	return s;
};

Sprite.change = function(act,info){
    if(!act || !act.sprite) return ERROR(5,'no act or no sprite');

	if(info.name){
		if(info.name === 'normal')  act.sprite.name = act.sprite.normal;
		else act.sprite.name = info.name;
	}
	act.sprite.sizeMod = info.sizeMod || act.sprite.sizeMod;
		
	Sprite.updateBumper(act);
}

Sprite.updateBumper = function(act){		//server only
	//Set the Sprite Bumper Box to fit the sizeMod
	var model = SpriteModel.get(act.sprite.name.split(',')[0]);
	if(!model) return ERROR(4,'no sprite model',act.sprite.name);
	
	act.sprite.hitBox = Sprite.resizeBumper(Tk.deepClone(model.hitBox),act.sprite.sizeMod * model.size);
	act.sprite.bumperBox = Sprite.resizeBumper(Tk.deepClone(model.bumperBox),act.sprite.sizeMod * model.size);
		
}

Sprite.updateAnim = function (act){	//client side only
	var dsp = SpriteModel.get(Actor.getSpriteName(act));
	if(!dsp) return ERROR(4,"sprite dont exist",act.sprite);
	
	if(act.sprite.animOld !== act.sprite.anim){	//otherwise, animation can be cut if timer for walk is high 
		act.sprite.animOld = act.sprite.anim;
		Sprite.change(act,{'anim':act.sprite.anim});
	}
	var animFromDb = dsp.anim[act.sprite.anim];	
	if(!animFromDb) return ERROR(4,"sprite anim dont exist",act.sprite);
	
	var mod = 1;
	if(animFromDb.walk){    //if walking, the speed of animation depends on movement speed
		var spd =  Math.max(Math.abs(act.spdX),Math.abs(act.spdY))/2;	//divide by 2, idk why but it works, probably because xy update only send 1/2 times
		mod = Math.abs(spd/act.maxSpd) || 0;
	}
	
	act.sprite.timer += animFromDb.spd * mod;	
	act.sprite.startX = Math.floor(act.sprite.timer);
	if(act.sprite.startX > animFromDb.frame-1){
		Sprite.changeAnim(act,animFromDb.next);
	}
	if(act.sprite.dead){
		act.sprite.alpha -= act.sprite.dead;
		if(act.sprite.alpha < 0)
			ActiveList.removeAny(act.id);
	}
	
}

Sprite.changeAnim = function(act,anim){
	act.sprite.anim = anim;
	act.sprite.startX = 0;
	act.sprite.timer = 0;
}


Sprite.resizeBumper = function(bumperBox,size){
	for(var i in bumperBox)
		for(var j in bumperBox[i])
			bumperBox[i][j] *= size;
	return bumperBox;
}


Sprite.draw = function(ctx,act){	//also does position update calc, client prediction
	var sp = act.sprite;
	var list = sp.name.split(',');
	
	
	var mouseOverInterface = false;
	for(var i in list){
	
		var model = SpriteModel.get(list[i]);
		
		var image = SpriteModel.getImage(model,act);
		if(!image) continue;
		
		
		var animFromDb = model.anim[sp.anim];
		
		var sideAngle = Math.round(act.angle/(360/animFromDb.dir)) % animFromDb.dir;
		
		var startX = sp.startX * animFromDb.sizeX;
		var startY = animFromDb.startY + model.side[sideAngle] * animFromDb.sizeY;
			
		var sizeMod = model.size * sp.sizeMod;
		
		ctx.globalAlpha = sp.alpha;
		var sizeOffX = animFromDb.sizeX/2*sizeMod;
		var sizeOffY = animFromDb.sizeY/2*sizeMod;
		var offsetX = model.offsetX*sizeMod;
		var offsetY = model.offsetY*sizeMod;
		var posX = (CST.WIDTH2 - player.x) + act.x + offsetX;
		var posY = (CST.HEIGHT2 - player.y) + act.y + offsetY;
		
		if(!model.canvasRotate){
			ctx.drawImage(image, 
				startX,Math.floor(startY+1),	//bad way to fix random line on top of player
				animFromDb.sizeX,Math.floor(animFromDb.sizeY-1),
				posX - sizeOffX,posY - sizeOffY,
				animFromDb.sizeX * sizeMod,animFromDb.sizeY * sizeMod
			);	
		} else {
			ctx.save();
			ctx.translate(posX,posY);
			ctx.rotate(act.angle/180*Math.PI);
			
			ctx.drawImage(image, 
				startX,startY,
				animFromDb.sizeX,animFromDb.sizeY,
				- sizeOffX,- sizeOffY,
				animFromDb.sizeX * sizeMod,animFromDb.sizeY * sizeMod
			);
			ctx.restore();
		}
		ctx.globalAlpha = 1;
	}
	if(mouseOverInterface || act.type === 'bullet' || act === player) return;
	
	if(Collision.testMouseRect(key,{x:posX- sizeOffX,y:posY- sizeOffY,width:sizeOffX*2,height:sizeOffY*2})){
		if(main.pref.highlightHover){
			ctx.globalAlpha = 0.2;
			ctx.fillRect(posX- sizeOffX,posY- sizeOffY,sizeOffX*2,sizeOffY*2);
			ctx.globalAlpha = 1;
		}
		if(act.context)
			return act.context;
	}
	
	
}

	
