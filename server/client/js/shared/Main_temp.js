//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Server','ItemList','Save','Message','Dialogue','Boost','Drop','Quest','Collision','Command','Contribution','Main']));

Main.Temp = function(){	//unsued...
	return {};
	/*
	questRating:'',	//name of quest
	help:'',
	sfx:'',
	song:'',
	questComplete:null,
	screenEffectAdd:[],
	screenEffectRemove:[],

	message:'',
	dialog:{},
	*/
}


//##################



//##################

Main.ScreenEffect = {};
Main.ScreenEffect.fadeout = function(id,timer,color){
	return {
		type:'fadeout',
		id:id || Math.randomId(),
		timer:timer || 25,
		maxTimer:timer || 25,
		color:color || 'black',	
	}
}
Main.ScreenEffect.torch = function(id,radiusInside,color,radiusOutside){
	return {
		type:'torch',
		id:id || Math.randomId(),
		color:color || 'black',	
		radiusInside:radiusInside || 200,
		radiusOutside:radiusOutside || (2*radiusInside) || 350,
	}
}

Main.screenEffect = {};


Main.screenEffect.add = function(main,se){
	if(SERVER){
		main.temp.screenEffectAdd = main.temp.screenEffectAdd  || [];
		main.temp.screenEffectAdd.push(se);
	} else {
		main.screenEffect[se.id] = se;
	}
}
Main.screenEffect.remove = function(main,id){
	if(SERVER){
		main.temp.screenEffectRemove = main.temp.screenEffectRemove  || [];
		main.temp.screenEffectRemove.push(id);
	} else {
		if(id === Main.screenEffect.REMOVE_ALL) main.screenEffect = {};
		else delete main.screenEffect[id];
	}
}


Main.screenEffect.REMOVE_ALL = '$all';
Main.screenEffect.loop = function(main,ctx){
	for(var i in main.screenEffect){
		var sf = main.screenEffect[i];
		if(sf.type === 'fadeout' && --sf.timer < 0) Main.screenEffect.remove(main,sf.id);
		else Main.screenEffect.draw(sf,ctx);
	}
}
Main.screenEffect.draw = function(fx,ctx){
	if(fx.type === 'fadeout') Main.screenEffect.draw.fadeout(fx,ctx);
	if(fx.type === 'torch') Main.screenEffect.draw.torch(fx,ctx);
}
Main.screenEffect.draw.fadeout = function(fx,ctx){
	var third = fx.maxTimer/3;
	var timer = fx.maxTimer - fx.timer;
	
	var alpha = 1;
	if(timer < third)
		alpha = timer / third;
	if(timer > 2*third)
		alpha = 1- (timer - 2*third)/third;
	
	ctx.globalAlpha = alpha;
	ctx.fillStyle = fx.color || 'black';
	ctx.fillRect(0,0,CST.WIDTH,CST.HEIGHT);
	ctx.globalAlpha = 1;
}

Main.screenEffect.draw.torch = function(fx,ctx){
	var grd = ctx.createRadialGradient(
		CST.WIDTH2,
		CST.HEIGHT2,
		fx.radiusInside || 200,
		CST.WIDTH2,
		CST.HEIGHT2,
		fx.radiusOutside || 300
	);
	grd.addColorStop(0.1,'rgba(31,0,0,0.5)');
	grd.addColorStop(1,fx.color);
	ctx.fillStyle = grd;
	ctx.fillRect(0,0,CST.WIDTH,CST.HEIGHT);
			
	ctx.globalAlpha = 1;
}

//############


Main.playSfx = function(main,sfx){	//todo
	main.temp.sfx = sfx;
}

Main.playSong = function(main,song){
	main.temp.song = song;
}


//################

Main.openDialog = function(main,what,param){	//param = false => close
	main.temp.dialog = main.temp.dialog || {};
	main.temp.dialog[what] = param === undefined ? 0 : param;
}
Main.closeDialog = function(main,what){
	Main.openDialog(main,what,false);
}

Main.closeDialogAll = function(main){
	Main.openDialog(main,'ALL',false);
}


Main.displayQuestRating = function(main,questRating){
	main.temp.questRating = questRating;
}


Main.applyTempChange = function(main,temp){	//on client when receive
	if(!temp) return;
	main.popupList = temp.popupList || main.popupList;
	for(var i in temp.message) Message.receive(Message.uncompressClient(temp.message[i]));
	if(temp.sfx) Sfx.play(temp.sfx);
	if(temp.song) Song.play(temp.song);
	
	for(var i in temp.dialog){
		if(i === 'ALL'){
			Dialog.closeAll();
			break;
		}
		if(temp.dialog[i] === false)
			Dialog.close(i);
		else
			Dialog.open(i,temp.dialog[i]);
	}
	
	for(var i in temp.screenEffectAdd)
		Main.screenEffect.add(main,temp.screenEffectAdd[i]);
	for(var i in temp.screenEffectRemove)
		Main.screenEffect.remove(main,temp.screenEffectRemove[i]);	
}


