

Actor.drawAll = function (ctx){
	var array = Actor.drawAll.getSortedList();
	var context = null;
	for(var i = 0 ; i < array.length ; i++){
		var act = array[i];
		context = Sprite.draw(ctx,act) || context;
		if(act.combat && (Main.getPref(main,'overheadHp') || act !== player)){
			Actor.drawStatus(act,ctx); 
		}
	}
	return context;
}	
	
Actor.drawAll.getSortedList = function(){
	var drawSortList = [];
	for(var i in Actor.LIST){
		drawSortList.push(Actor.LIST[i]);
	}
	drawSortList.push(player);
	drawSortList.sort(function (act,mort1){
		var spriteFromDb = SpriteModel.get(Actor.getSpriteName(act));
		var sizeMod = spriteFromDb.size* act.sprite.sizeMod;
		var y0 = act.y + spriteFromDb.legs * sizeMod
		
		var spriteFromDb1 = SpriteModel.get(Actor.getSpriteName(mort1));
		var sizeMod1 = spriteFromDb1.size* mort1.sprite.sizeMod;
		var y1 = mort1.y + spriteFromDb1.legs * sizeMod1
		
		return y0-y1;	
	});	
	return drawSortList;	
}

Actor.drawChatHead = function(ctx){
	Actor.drawChatHead.list = {};
	for(var i in Actor.LIST){
		Actor.drawChatHead.func(Actor.LIST[i],ctx);		
	}
	Actor.drawChatHead.func(player,ctx);
}	
Actor.drawChatHead.func = function(act,ctx){
	if(!act.chatHead) return;
		
	var spriteServer = act.sprite;
	var spriteFromDb = SpriteModel.get(Actor.getSpriteName(act));
	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	
	var numX = CST.WIDTH2+act.x-player.x;
	var numY = CST.HEIGHT2+act.y-player.y - 35 + spriteFromDb.hpBar*sizeMod;;
	
	ctx.setFont(20);
	var length = ctx.length(act.chatHead.text);
	var rect = {x:numX-length/2,width:length,y:numY,height:20};
	
	var safe = 0;
	do {
		bad = false;
		for(var i in Actor.drawChatHead.list){
			if(Collision.testRectRect(rect,Actor.drawChatHead.list[i])){
				numY += 10; 
				rect.y += 10;
				bad = true;
				break;
			}
		}
	}while(bad && safe++<1000)
	Actor.drawChatHead.list[act.id] = rect;
	ctx.fillStyle="black";
	ctx.globalAlpha = 0.7;
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
Actor.drawChatHead.list = {
	//playername:rect,
};

Actor.getSpriteName = function(act){
	return act.sprite.name.split(',')[0];
}

Actor.drawStatus = function(act,ctx){	//hp + status
	if(act.hpMax <= 5) return; //QUICKFIX for targets
		
	var spriteServer = act.sprite;
	var spriteFromDb = SpriteModel.get(Actor.getSpriteName(act));
	var animFromDb = spriteFromDb.anim[spriteServer.anim];

	var sizeMod = spriteFromDb.size* spriteServer.sizeMod;
	var numX = CST.WIDTH2+act.x-player.x-50;
	var numY = CST.HEIGHT2+act.y-player.y + spriteFromDb.hpBar*sizeMod;

	//hp
	if(act.hp <= 0) return;
	ctx.globalAlpha = spriteServer.alpha;
	ctx.strokeStyle = "black";
	ctx.roundRect(numX,numY,100,5);
	ctx.fillStyle = act.type === 'npc' ? 'red' : 'green';
	var hp = Math.min(act.hp,act.hpMax);
	ctx.roundRect(numX,numY,Math.max(hp/act.hpMax*100,0),5,1);	
	ctx.fillStyle="black";
	
	//################
	
	for(var i = 0, count = 0; act.statusClient && i < act.statusClient.length; i++){	//statusClient = '000000'
		var x = numX + 30*count;
		var y = numY - 30;
		
		if(act.statusClient[i] == '1'){
			Img.drawIcon(ctx,'status.' + CST.status.list[i],x,y,24);
			count++;
		}
	}
	ctx.globalAlpha = 1;
}

Actor.drawAll.getMinimapList = function(){	//bad...
	var toReturn = [];
	for(var i in Actor.LIST){
		var m = Actor.LIST[i];
		if(!m.minimapIcon) continue;
		
		var icon = m.minimapIcon;
		if(m.type === 'player' && main.social.friendList[m.id]) 
			icon = 'color.purple';
		toReturn.push({
			vx:m.x - player.x,
			vy:m.y - player.y,
			icon:icon,
			size:Img.getMinimapIconSize(icon),
		});
	}
	return toReturn;
}
	
	
	
	
	