//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Map','Input','Message','Collision','Button','OptionList','Command'],['Draw']));

var Draw = {};
(function(){ //}

Draw.init = function(){
	Dialog.UI('stage',{
		position:'absolute',
		left:0,
		top:0,
		width:CST.WIDTH,
		height:CST.HEIGHT,
		zIndex:Dialog.ZINDEX.LOW,
	},function(html,variable){
		var canvas = $('<canvas>')
			.css({
				top:0,
				left:0,
				width:CST.WIDTH,
				height:CST.HEIGHT,
				border:'4px solid #000000',
				background:'rgba(0,0,0,1)',
			})
			.attr({
				width:CST.WIDTH,
				height:CST.HEIGHT,
			})
			.click(function(e){
				Dialog.chat.blurInput();
			});
			
		html.append(canvas);
		
		var ctx = canvas[0].getContext("2d");
		ctx.font = '20px Kelly Slab';
		ctx.fillStyle = 'black';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.save();
		variable.ctx = ctx;
		
		//#############
		
		
		
	},null,1,function(html,variable){	//loop
		// !main.hudState.minimap 
		Draw.loop(variable.ctx);
	});

}

Draw.loop = function(ctx){
	ctx.clearRect(0, 0, CST.WIDTH, CST.HEIGHT);
	
	//Draw
	MapModel.draw(ctx,'b');   //below player
	Anim.draw(ctx,'b');  //below player
	
	var context = Drop.drawAll(ctx);
	context = Actor.drawAll(ctx) || context;
	if(context) Dialog.open('context',context);
	else Dialog.close('context');
	
	Strike.drawAll(ctx);
	Bullet.drawAll(ctx);
	Anim.draw(ctx,'a');  //above player
	MapModel.draw(ctx,'a');   //above player
	Actor.drawChatHead(ctx);
	Main.screenEffect.loop(main,ctx);
	
	
	
}


})();



	










