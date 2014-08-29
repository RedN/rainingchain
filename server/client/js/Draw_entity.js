//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Activelist','Draw','Collision','Button'],[]));

Draw.actor = function (){
	var array = Draw.actor.sort();
	for(var i = 0 ; i < array.length ; i ++){
		var act = array[i];
		Draw.sprite(act);
		if(act.combat && (main.pref.overheadHp || act !== player)){
			Draw.actor.status(act); 
		}
	}
}	
	
Draw.actor.sort = function(){
	var drawSortList = [];
	for(var i in List.actor){
		drawSortList.push(List.actor[i]);
	}
	drawSortList.push(player);
	drawSortList.sort(function (act,mort1){
		var spriteFromDb = Db.sprite[Draw.actor.getSpriteName(act)];
		var sizeMod = spriteFromDb.size* act.sprite.sizeMod;
		var y0 = act.y + spriteFromDb.legs * sizeMod
		
		var spriteFromDb1 = Db.sprite[Draw.actor.getSpriteName(mort1)];
		var sizeMod1 = spriteFromDb1.size* mort1.sprite.sizeMod;
		var y1 = mort1.y + spriteFromDb1.legs * sizeMod1
		
		return y0-y1;	
	});	
	return drawSortList;	
}

Draw.actor.chatHead = function(){
	Draw.actor.chatHead.list = {};
	for(var i in List.actor){
		Draw.actor.chatHead.func(List.actor[i]);		
	}
	Draw.actor.chatHead.func(player);
}	
Draw.actor.chatHead.func = function(act){
	if(!act.chatHead) return;
	ctx = List.ctx.stage;
		
	var spriteServer = act.sprite;
	var spriteFromDb = Db.sprite[Draw.actor.getSpriteName(act)];
	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	
	var numX = CST.WIDTH2+act.x-player.x;
	var numY = CST.HEIGHT2+act.y-player.y - 35 + spriteFromDb.hpBar*sizeMod;;
	
	ctx.setFont(20);
	var length = ctx.length(act.chatHead.text);
	var rect = [numX-length/2,numX+length/2,numY,numY+20];
	
	var safe = 0;
	do {
		bad = false;
		for(var i in Draw.actor.chatHead.list){
			if(Collision.rectRect(rect,Draw.actor.chatHead.list[i])){
				numY += 10; rect[2] += 10; rect[3] += 10;
				bad = true;
				break;
			}
		}
	}while(bad && safe++<1000)
	Draw.actor.chatHead.list[act.id] = rect;
	ctx.fillStyle="black";
	ctx.globalAlpha = 0.2;
	ctx.roundRect(numX-5-length/2,numY-2,length+5,24);
	ctx.globalAlpha = 1;
	ctx.textAlign = 'center';
	ctx.fillText(act.chatHead.text,numX,numY);
	ctx.fillStyle="yellow";
	ctx.fillText(act.chatHead.text,numX-1,numY-1);
	ctx.textAlign = 'left';
	ctx.fillStyle="black";
	ctx.setFont(18);

}
Draw.actor.chatHead.list = {
	//playername:[x,x,y,y],
};



Draw.actor.getSpriteName = function(act){
	return act.sprite.name.split(',')[0];
}

Draw.actor.status = function(act){	//hp + status
	if(act.resource.hp.max <= 5) return; //QUICKFIX for targets
	
	ctx = List.ctx.stage;
	
	var spriteServer = act.sprite;
	var spriteFromDb = Db.sprite[Draw.actor.getSpriteName(act)];
	var animFromDb = spriteFromDb.anim[spriteServer.anim];

	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	var numX = CST.WIDTH2+act.x-player.x-50;
	var numY = CST.HEIGHT2+act.y-player.y + spriteFromDb.hpBar*sizeMod;

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

Draw.sprite = function(act,customname){
	ctx = List.ctx.stage;
	
	var spriteServer = act.sprite;
	
	var list = spriteServer.name.split(',');
	
	for(var i in list){
	
		var spriteFromDb = Db.sprite[list[i]];	//customname overwrite regular name
		var image = spriteFromDb.img;
		var animFromDb = spriteFromDb.anim[spriteServer.anim];
		
		if(act.type === 'bullet' && animFromDb === 'attack') animFromDb = 'travel';	//quick fix
		
		var sideAngle = Math.round(act.angle/(360/animFromDb.dir)) % animFromDb.dir;
		
		var startX = spriteServer.startX * animFromDb.sizeX;
		var startY = animFromDb.startY + spriteFromDb.side[sideAngle] * animFromDb.sizeY;
			
		var sizeMod = spriteFromDb.size * spriteServer.sizeMod;
		
		ctx.globalAlpha = spriteServer.alpha;
		var offX = animFromDb.sizeX/2*sizeMod;
		var offY = animFromDb.sizeY/2*sizeMod;
		var posX = CST.WIDTH2 + act.x-player.x;
		var posY = CST.HEIGHT2 + act.y-player.y;
		
		if(act.type === 'npc'){
			var posX = CST.WIDTH2-player.x + (act.x + act.lastX)/2;
			var posY = CST.HEIGHT2-player.y + (act.y + act.lastY)/2;
			act.lastX = act.x*3/3 + act.lastX*0/3;
			act.lastY = act.y*3/3 + act.lastY*0/3;
		}
		
		if(spriteFromDb.centerY)	//BAD
			posY += spriteFromDb.centerY;
		
		
		if(!spriteFromDb.canvasRotate){
			ctx.drawImage(image, 
				startX,Math.floor(startY+1),	//bad way to fix random line on top of player
				animFromDb.sizeX,Math.floor(animFromDb.sizeY-1),
				posX-offX,posY-offY,
				animFromDb.sizeX * sizeMod,animFromDb.sizeY * sizeMod
			);
		} else {
			ctx.save();
			ctx.translate(posX,posY);
			ctx.rotate(act.angle/180*Math.PI);
			
			ctx.drawImage(image, 
				startX,startY,
				animFromDb.sizeX,animFromDb.sizeY,
				-offX,-offY,
				animFromDb.sizeX * sizeMod,animFromDb.sizeY * sizeMod
			);
			ctx.restore();
			
		}
		ctx.globalAlpha = 1;
	}
	
	if((act.context || act.preventAbility) && act !== player && act.hitBox){
		var x = CST.WIDTH2 + act.x - player.x;
		var y = CST.HEIGHT2 + act.y - player.y;
		if(Main.isWindowOpen(main)) text = '';
		else {	text = act.context;	}
		
		
		
		Button.creation(0,{
			rect:Collision.getHitBox({x:x,y:y,hitBox:act.hitBox}),
			text:text,			
			textTop:1,
			left:act.preventAbility ? {func:CST.func,param:[]} : null,
			shiftLeft:act.preventAbility ? {func:CST.func,param:[]} : null,
			right:act.preventAbility ? {func:CST.func,param:[]} : null,
			shiftRight:act.preventAbility ? {func:CST.func,param:[]} : null,
		});	
	}
	
}

Draw.drop = function(){
	ctx = List.ctx.stage;
	
	for(var i in List.drop){
		var drop = List.drop[i];
				
		var numX = CST.WIDTH2 + drop.x - player.x;
		var numY = CST.HEIGHT2 + drop.y - player.y;
		
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
				CST.WIDTH2+anim.target.x-player.x-sizeX/2*size,
				CST.HEIGHT2+anim.target.y-player.y-sizeY/2*size,
				sizeX*size,sizeY*size
			);
		}
	}
}


Draw.strike = function(){
	if(!main.pref.displayAoE) return;
	
	ctx.fillStyle = 'red';
	for(var i in List.strike){
		var s = List.strike[i];
		var p = s.point;
		
		var x = CST.WIDTH2 - player.x;
		var y = CST.HEIGHT2 - player.y;
		
		
		ctx.globalAlpha = Math.min(0.5,1/Math.abs(s.delay));
		
		ctx.beginPath();
		ctx.moveTo(x+p[0].x,y+p[0].y);
		ctx.lineTo(x+p[1].x,y+p[1].y);
		ctx.lineTo(x+p[2].x,y+p[2].y);
		ctx.lineTo(x+p[3].x,y+p[3].y);
		ctx.lineTo(x+p[0].x,y+p[0].y);
		ctx.closePath();
		ctx.fill();
		
		if(--s.delay < -4) Activelist.removeAny(s);
	}
	ctx.fillStyle = 'black';
	ctx.globalAlpha = 1;
	
	
}




