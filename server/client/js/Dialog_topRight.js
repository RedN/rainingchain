(function(){ //}

Dialog.UI('minimap',{
	position:'absolute',
	top:0,
},function(html,variable){
	html.css({
		left:CST.WIDTH - CST.WIDTH/Main.getPref(main,'mapRatio'),
		width:CST.WIDTH/Main.getPref(main,'mapRatio'),
		height:CST.HEIGHT/Main.getPref(main,'mapRatio')	
	});

	var canvas = $('<canvas>')
		.css({
			top:0,
			width:CST.WIDTH/Main.getPref(main,'mapRatio'),
			height:CST.HEIGHT/Main.getPref(main,'mapRatio'),
			border:'4px solid #000000',
			background:'rgba(0,0,0,1)',
		})
		.attr({
			width:CST.WIDTH/Main.getPref(main,'mapRatio'),
			height:CST.HEIGHT/Main.getPref(main,'mapRatio'),
			id:'minimapCanvas'
		});
	html.append(canvas);
	
	variable.ctx = canvas[0].getContext('2d');
	
	
},function(){
	return Main.getPref(main,'mapRatio');
},3,function(html,variable){	//loop
	if(main.hudState.minimap === Main.hudState.INVISIBLE){
		html.hide();
	} else {
		html.show();
		Dialog.UI.minimap(variable.ctx);
	}
});


Dialog.UI.minimap = function (ctx){
	ctx.clearRect(0, 0, CST.WIDTH, CST.HEIGHT);
	Dialog.UI.minimap.map(ctx);
	Dialog.UI.minimap.icon(ctx);
}
Dialog.UI.minimap.ZOOM = 16;	//difference in size between real image and minimap image, idk if x2 factor applies,,,?

Dialog.UI.minimap.map = function(ctx){
	var x = -(player.x)/Dialog.UI.minimap.ZOOM + CST.WIDTH2/Main.getPref(main,'mapRatio');	
	var y = -(player.y)/Dialog.UI.minimap.ZOOM + CST.HEIGHT2/Main.getPref(main,'mapRatio');	
	ctx.drawImage(MapModel.getCurrent().img.m, x,y);
}

Dialog.UI.minimap.icon = function(ctx){
	var cx = CST.WIDTH2/Main.getPref(main,'mapRatio')-2;
	var cy = CST.HEIGHT2/Main.getPref(main,'mapRatio')-2;
	
	//normal icons
	
	
	var list = Actor.drawAll.getMinimapList();
	for(var i = 0 ; i < list.length; i++){
		if(main.questActive && list[i].icon === 'minimapIcon.quest') continue;
		
		var numX = cx+list[i].vx/Dialog.UI.minimap.ZOOM;
		var numY = cy+list[i].vy/Dialog.UI.minimap.ZOOM;
		
		var size = list[i].size;
		Img.drawIcon(ctx,list[i].icon,numX-size/2,numY-size/2,size);
	}
	
	//quest marker
	var qm = Actor.getQuestMarkerMinimap(player);
	for(var i in qm){
		var numX = (cx+qm[i].vx/Dialog.UI.minimap.ZOOM).mm(0,CST.WIDTH/Main.getPref(main,'mapRatio'));
		var numY = (cy+qm[i].vy/Dialog.UI.minimap.ZOOM).mm(0,CST.HEIGHT/Main.getPref(main,'mapRatio'));
		var size = qm[i].size;
		Img.drawIcon(ctx,qm[i].icon,numX-size/2,numY-size/2,size);
	}
	
	
	ctx.fillRect(CST.WIDTH2/Main.getPref(main,'mapRatio')-2,CST.HEIGHT2/Main.getPref(main,'mapRatio')-2,4,4);	//player icon
}

Dialog.UI.minimap.isMouseOver = function(){
	return Collision.testPtRect(Collision.getMouse(key),[
		CST.WIDTH-CST.WIDTH/Main.getPref(main,'mapRatio'),
		CST.WIDTH,
		0,
		CST.HEIGHT/Main.getPref(main,'mapRatio')
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
		left:CST.WIDTH - CST.WIDTH/Main.getPref(main,'mapRatio'),
		top:CST.HEIGHT/Main.getPref(main,'mapRatio'),
		width:CST.WIDTH/Main.getPref(main,'mapRatio'),
	});


	html.append($('<span>')
		.html(' + ')
		.attr('title','Enlarge')
		.click(function(){
			Command.execute('pref',['mapRatio',(Main.getPref(main,'mapRatio') - 1)]);
		})
	);
	html.append($('<span>')
		.html(' - ')
		.attr('title','Minimize')
		.click(function(){
			Command.execute('pref',['mapRatio',(Main.getPref(main,'mapRatio') + 1)]);
		})
	);	
	
	html.append(MapModel.getCurrent().name);	
},function(){
	return '' + Main.getPref(main,'mapRatio') + MapModel.getCurrent().name + main.hudState.minimap;
},3);

Dialog.UI('hint',{
	position:'absolute',
	height:25,
	color:'white',
	textShadow:'1px 1px 0 #000'
},function(html){
	if(main.hudState.minimap === Main.hudState.INVISIBLE) return;
	
	html.css({
		left:CST.WIDTH - CST.WIDTH/Main.getPref(main,'mapRatio'),
		top:CST.HEIGHT/Main.getPref(main,'mapRatio') + 25,
		width:CST.WIDTH/Main.getPref(main,'mapRatio'),
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
	return '' + Main.getPref(main,'mapRatio') + main.questHint + main.hudState.minimap;
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



	



















