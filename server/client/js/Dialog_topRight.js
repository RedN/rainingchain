(function(){ //}

Dialog.UI('minimap',{
	position:'absolute',
	top:0,
},function(html,variable){
	html.css({
		left:CST.WIDTH - CST.WIDTH/main.pref.mapRatio,
		width:CST.WIDTH/main.pref.mapRatio,
		height:CST.HEIGHT/main.pref.mapRatio	
	});

	var canvas = $('<canvas>')
		.css({
			top:0,
			width:CST.WIDTH/main.pref.mapRatio,
			height:CST.HEIGHT/main.pref.mapRatio,
			border:'4px solid #000000',
			background:'rgba(0,0,0,1)',
		})
		.attr({
			width:CST.WIDTH/main.pref.mapRatio,
			height:CST.HEIGHT/main.pref.mapRatio,
			id:'minimapCanvas'
		});
	html.append(canvas);
	
	variable.ctx = canvas[0].getContext('2d');
	
	
},function(){
	return main.pref.mapRatio;
},3,function(html,variable){	//loop
	if(main.hudState.minimap === Main.hudState.INVISIBLE){
		html.hide();
	} else {
		html.show();
		drawMinimap(variable.ctx);
	}
});


var drawMinimap = function (ctx){
	ctx.clearRect(0, 0, CST.WIDTH, CST.HEIGHT);
	drawMinimap.map(ctx);
	drawMinimap.icon(ctx);
}
drawMinimap.ZOOM = 16;	//difference in size between real image and minimap image, idk if x2 factor applies,,,?

drawMinimap.map = function(ctx){
	var x = -(player.x)/drawMinimap.ZOOM + CST.WIDTH2/main.pref.mapRatio;	
	var y = -(player.y)/drawMinimap.ZOOM + CST.HEIGHT2/main.pref.mapRatio;	
	ctx.drawImage(MapModel.getCurrent().img.m, x,y);
}

drawMinimap.icon = function(ctx){
	var cx = CST.WIDTH2/main.pref.mapRatio-2;
	var cy = CST.HEIGHT2/main.pref.mapRatio-2;
	
	var list = Actor.drawAll.getMinimapList();
	list = list.concat(Actor.getQuestMarkerMinimap(player));
	
	for(var i = 0 ; i < list.length; i++){
		var numX = cx+list[i].vx/drawMinimap.ZOOM;
		var numY = cy+list[i].vy/drawMinimap.ZOOM;
		
		var size = list[i].size;
		Img.drawIcon(ctx,list[i].icon,numX-size/2,numY-size/2,size);
	}	
	
	ctx.fillRect(CST.WIDTH2/main.pref.mapRatio-2,CST.HEIGHT2/main.pref.mapRatio-2,4,4);	//player icon
}

drawMinimap.isMouseOver = function(){
	return Collision.testPtRect(Collision.getMouse(key),[
		CST.WIDTH-CST.WIDTH/main.pref.mapRatio,
		CST.WIDTH,
		0,
		CST.HEIGHT/main.pref.mapRatio
	]);
}

//#####################

Dialog.UI('minimapBelow',{
	position:'absolute',
	height:25,
	font:'1.2em Kelly Slab',
	color:'white',
	backgroundColor:"rgba(0,0,0,0.5)",
	border:"2px solid black",
	whiteSpace:'nowrap',
},function(html){
	if(main.hudState.minimap === Main.hudState.INVISIBLE){
		html.hide();
		return null;
	}
	html.show();
	
	html.css({
		left:CST.WIDTH - CST.WIDTH/main.pref.mapRatio,
		top:CST.HEIGHT/main.pref.mapRatio,
		width:CST.WIDTH/main.pref.mapRatio,
	});


	html.append($('<span>')
		.html(' + ')
		.attr('title','Enlarge')
		.click(function(){
			Command.execute('pref',['mapRatio',(main.pref.mapRatio - 1)]);
		})
	);
	html.append($('<span>')
		.html(' - ')
		.attr('title','Minimize')
		.click(function(){
			Command.execute('pref',['mapRatio',(main.pref.mapRatio + 1)]);
		})
	);	
	
	html.append(MapModel.getCurrent().name);	
},function(){
	return '' + main.pref.mapRatio + MapModel.getCurrent().name + main.hudState.minimap;
},3);

Dialog.UI('hint',{
	position:'absolute',
	height:25,
	color:'white',
	textShadow:'1px 1px 0 #000'
},function(html){
	if(main.hudState.minimap === Main.hudState.INVISIBLE) return;
	
	html.css({
		left:CST.WIDTH - CST.WIDTH/main.pref.mapRatio,
		top:CST.HEIGHT/main.pref.mapRatio + 25,
		width:CST.WIDTH/main.pref.mapRatio,
	});
	
	var hint = $('<div>')
		.css({
			font:'1.2em Kelly Slab',
			color:'white',
		})
		.attr('id','hintDiv')
		.html(main.questHint);
		
	html.append(hint);
	
},function(){
	return '' + main.pref.mapRatio + main.questHint + main.hudState.minimap;
},3);


Dialog.UI('quitGame',{
	position:'absolute',
	top:0,
	left:CST.WIDTH-24,
	zIndex:Dialog.ZINDEX.HIGH,
},function(html){
	var el = Img.drawIcon.html('system.close',24,"Shift-Left Click to safely leave the game.");
	el.click(function(e){
		if(e.shiftKey)
			Command.execute('logout');
	});
	html.append(el);
	
},null,10000);
	
	
})();



	



















