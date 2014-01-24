Draw.actor = function (){
	var array = Draw.actor.sort();
	for(var i = 0 ; i < array.length ; i ++){
		var mort = array[i];
		Draw.sprite(mort);
		if(mort.combat) Draw.actor.hpBar(mort); 
		if(mort.chatHead) Draw.actor.chatHead(mort); 
	}
}	
	
Draw.actor.sort = function(){
	var drawSortList = [];
	for(var i in List.actor){
		drawSortList.push(List.actor[i]);
	}
	drawSortList.push(player);
	drawSortList.sort(function (mort,mort1){
		var spriteFromDb = Db.sprite[mort.sprite.name];
		var sizeMod = spriteFromDb.size* mort.sprite.sizeMod;
		var y0 = mort.y + spriteFromDb.legs * sizeMod
		
		var spriteFromDb1 = Db.sprite[mort1.sprite.name];
		var sizeMod1 = spriteFromDb1.size* mort1.sprite.sizeMod;
		var y1 = mort1.y + spriteFromDb1.legs * sizeMod1
		
		return y0-y1;	
	});	
	return drawSortList;	
}

Draw.actor.chatHead = function(mort){
	ctx = List.ctx.stage;
	
	var spriteServer = mort.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	
	var numX = Cst.WIDTH2+mort.x-player.x;
	var numY = Cst.HEIGHT2+mort.y-player.y - 35 + spriteFromDb.hpBar*sizeMod;;
	
	ctx.fillStyle="yellow";
	ctx.textAlign = 'center';
	ctx.fillText(mort.chatHead.text,numX,numY);
	ctx.textAlign = 'left';
	ctx.fillStyle="black";
}		

Draw.actor.hpBar = function(mort){
	ctx = List.ctx.stage;
	
	var spriteServer = mort.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var animFromDb = spriteFromDb.anim[spriteServer.anim];

	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	var numX = Cst.WIDTH2+mort.x-player.x-50;
	var numY = Cst.HEIGHT2+mort.y-player.y + spriteFromDb.hpBar*sizeMod;

	if(mort.type == 'enemy'){ ctx.fillStyle="red"; }
	if(mort.type == 'player'){ ctx.fillStyle="green"; }

	ctx.fillRect(numX,numY,Math.max(mort.hp/mort.resource.hp.max*100,0),5);
	ctx.globalAlpha=1;
	ctx.strokeStyle="black";
	ctx.strokeRect(numX,numY,100,5);
	ctx.fillStyle="black";
}

Draw.bullet = function(){
	for(var i in List.bullet){
		Draw.sprite(List.bullet[i]);
	}
}

Draw.sprite = function (mort){
	ctx = List.ctx.stage;
	
	var spriteServer = mort.sprite;
	var spriteFromDb = Db.sprite[spriteServer.name];
	var image = spriteFromDb.img;
	var animFromDb = spriteFromDb.anim[spriteServer.anim];
	
	if(mort.type == 'bullet' && animFromDb == 'Attack') animFromDb = 'Travel';	//quick fix
	
	var sideAngle = Math.round(mort.angle/(360/animFromDb.dir)) % animFromDb.dir;
	
	var startX = spriteServer.startX * animFromDb.sizeX;
	var startY = animFromDb.startY + spriteFromDb.side[sideAngle] * animFromDb.sizeY;
	
	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
		
	ctx.drawImage(image, 
		startX,
		startY,
		animFromDb.sizeX,
		animFromDb.sizeY,
		Cst.WIDTH2-animFromDb.sizeX/2*sizeMod + mort.x-player.x,
		Cst.HEIGHT2-animFromDb.sizeY/2*sizeMod + mort.y-player.y,
		animFromDb.sizeX * sizeMod,
		animFromDb.sizeY * sizeMod);
	
}

Draw.drop = function(){
	ctx = List.ctx.stage;
	
	for(var i in List.drop){
		var drop = List.drop[i];
				
		var numX = Cst.WIDTH2 + drop.x - player.x;
		var numY = Cst.HEIGHT2 + drop.y - player.y;
		
		Draw.item(drop.item,[numX,numY]);
	}
}

Draw.anim = function (layer){
	ctx = List.ctx.stage;
	
	for(var i in List.anim){
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
				Cst.WIDTH2+anim.x-player.x-sizeX/2*size,Cst.HEIGHT2+anim.y-player.y-sizeY/2*size,
				sizeX*size,sizeY*size
				);
		}
	}
}


