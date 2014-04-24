Draw.actor = function (){
	var array = Draw.actor.sort();
	for(var i = 0 ; i < array.length ; i ++){
		var act = array[i];
		Draw.sprite(act);
		if(act.combat && act !== player){
			Draw.actor.status(act); 
		}
		if(act.chatHead) Draw.actor.chatHead(act); 
	}
}	
	
Draw.actor.sort = function(){
	var drawSortList = [];
	for(var i in List.actor){
		drawSortList.push(List.actor[i]);
	}
	drawSortList.push(player);
	drawSortList.sort(function (act,mort1){
		var spriteFromDb = Db.sprite[act.sprite.name];
		var sizeMod = spriteFromDb.size* act.sprite.sizeMod;
		var y0 = act.y + spriteFromDb.legs * sizeMod
		
		var spriteFromDb1 = Db.sprite[mort1.sprite.name];
		var sizeMod1 = spriteFromDb1.size* mort1.sprite.sizeMod;
		var y1 = mort1.y + spriteFromDb1.legs * sizeMod1
		
		return y0-y1;	
	});	
	return drawSortList;	
}

Draw.actor.chatHead = function(act){
	ctx = List.ctx.stage;
	
	var spriteServer = act.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	
	var numX = Cst.WIDTH2+act.x-player.x;
	var numY = Cst.HEIGHT2+act.y-player.y - 35 + spriteFromDb.hpBar*sizeMod;;
	
	ctx.fillStyle="yellow";
	ctx.textAlign = 'center';
	ctx.fillText(act.chatHead.text,numX,numY);
	ctx.textAlign = 'left';
	ctx.fillStyle="black";
}		

Draw.actor.status = function(act){	//hp + status
	ctx = List.ctx.stage;
	
	var spriteServer = act.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var animFromDb = spriteFromDb.anim[spriteServer.anim];

	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	var numX = Cst.WIDTH2+act.x-player.x-50;
	var numY = Cst.HEIGHT2+act.y-player.y + spriteFromDb.hpBar*sizeMod;

	//hp
	ctx.strokeStyle = "black";
	ctx.roundRect(numX,numY,100,5);
	ctx.fillStyle = act.type === 'npc' ? 'red' : 'green';
	ctx.roundRect(numX,numY,Math.max(act.hp/act.resource.hp.max*100,0),5,1);	
	ctx.fillStyle="black";
	
	Draw.state.status({
		x:numX,
		y:numY - 30,
	},act.statusClient);
}


Draw.bullet = function(){
	for(var i in List.bullet){
		Draw.sprite(List.bullet[i]);
	}
}

Draw.sprite = function (act){
	ctx = List.ctx.stage;
	
	var spriteServer = act.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var image = spriteFromDb.img;
	var animFromDb = spriteFromDb.anim[spriteServer.anim];
	
	if(act.type === 'bullet' && animFromDb === 'attack') animFromDb = 'travel';	//quick fix
	
	var sideAngle = Math.round(act.angle/(360/animFromDb.dir)) % animFromDb.dir;
	
	var startX = spriteServer.startX * animFromDb.sizeX;
	var startY = animFromDb.startY + spriteFromDb.side[sideAngle] * animFromDb.sizeY;
	
	var sizeMod = spriteFromDb.size * spriteServer.sizeMod;
	
	ctx.globalAlpha = spriteServer.alpha;
	var posX = Cst.WIDTH2-animFromDb.sizeX/2*sizeMod + act.x-player.x;
	var posY = Cst.HEIGHT2-animFromDb.sizeY/2*sizeMod + act.y-player.y;
	ctx.drawImage(image, 
		startX,startY,
		animFromDb.sizeX,animFromDb.sizeY,
		posX,posY,
		animFromDb.sizeX * sizeMod,animFromDb.sizeY * sizeMod
	);
	ctx.globalAlpha = 1;
	
	if(act.context && act !== player && act.hitBox){
		var x = Cst.WIDTH2 + act.x - player.x;
		var y = Cst.HEIGHT2 + act.y - player.y;
	
		Button.creation(0,{
			rect:Collision.getHitBox({x:x,y:y,hitBox:act.hitBox}),
			text:act.context,			
			textTop:1,
		});	
	}
	
}

Draw.drop = function(){
	ctx = List.ctx.stage;
	
	for(var i in List.drop){
		var drop = List.drop[i];
				
		var numX = Cst.WIDTH2 + drop.x - player.x;
		var numY = Cst.HEIGHT2 + drop.y - player.y;
		
		Draw.item(drop.item,numX,numY,32,drop.context);	
	}
}

Draw.anim = function (layer){
	ctx = List.ctx.stage;
	
	for(var i in List.anim){
		var a = Db.anim[List.anim[i].name];
		if(!a){ ERROR(2,"anim not found",anim.name); a = Db.anim['slashMelee']; }
		if(Db.anim[List.anim[i].name].layer === layer){
			
			var anim = List.anim[i];
			var animFromDb = Db.anim[anim.name];
			var image = animFromDb.img;
			var height = image.height;
			var width = image.width;
			var sizeX = image.width / animFromDb.frameX;
			var slotX = anim.slot % animFromDb.frameX;
			var slotY = Math.floor(anim.slot / animFromDb.frameX);
			var sizeY = height / Math.ceil(animFromDb.frame / animFromDb.frameX);
			var size = animFromDb.size*anim.sizeMod;
			var startY = animFromDb.startY;
					
			ctx.drawImage(image,
				sizeX*slotX,sizeY*slotY+startY,
				sizeX,sizeY,
				Cst.WIDTH2+anim.target.x-player.x-sizeX/2*size,Cst.HEIGHT2+anim.target.y-player.y-sizeY/2*size,
				sizeX*size,sizeY*size
				);
		}
	}
}


