//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['ActiveList','Sprite'],['SpriteModel']));
if(SERVER) eval('var SpriteModel');

(function(){ //}
var SIGN_IN_PACK = {};

SpriteModel = exports.SpriteModel = function(id,src,bumperBox,extra,anim){
	bumperBox = SpriteModel.bumperBox.apply(this,bumperBox);
	SIGN_IN_PACK[id] = [id,src,bumperBox,extra,anim];	//data sent to client
	var a = {
		id:'',
		src:"actor/main.png",
		img:null,	//client only
		filteredImg:{},	//client only
		size:1,
		side:[0,1,2,3],
		hpBar:0,
		legs:0,
		bumperBox:bumperBox,
		hitBox:SpriteModel.hitBox(-10,10,-10,10),
		anim:{},
		defaultAnim:"walk",
		alpha:1,
		canvasRotate:0,
		mirror:0,			//UNUSED: if 90 < angle < 270, symetry
		offsetY:0,
		offsetX:0
	};
	
	a.id = id;
	a.src = 'img/sprite/' + src;
	if(!extra.hitBox) extra.hitBox = Tk.deepClone(bumperBox);
	for(var i in extra) a[i] = extra[i];
	
	for(var i in anim){
		a.anim[anim[i].name] = anim[i];
		a.anim['walk'] = anim[i];	//BAD temp
		a.anim['attack'] = anim[i];
		a.anim['travel'] = anim[i];
		a.anim['move'] = anim[i];
		break;	
	}
		
	DB[id] = a;
	return id;
}
var DB = SpriteModel.DB = {};

SpriteModel.get = function(id){
	return DB[id] || null;
}

SpriteModel.useSignInPack = function(pack){	//client side only, for now
	for(var i in pack)
		SpriteModel.apply(this,pack[i]);
}

SpriteModel.hitBox = SpriteModel.bumperBox = function(minX,maxX,minY,maxY){
	if(Array.isArray(minX)){ maxX = minX[1]; minY = minX[2]; maxY = minX[3]; minX = minX[0]; }
	return {
		right:{ "x":maxX,"y":(minY+maxY)/2 },
		down:{ "x":(minX+maxX)/2,"y":maxY },
		left:{ "x":minX,"y":(minY+maxY)/2 },
		up:{ "x":(minX+maxX)/2,"y":minY }
	};
}


SpriteModel.bullet = function(id,src,sizeX,sizeY,frame,canvasRotate,extra){
	extra = extra || {};
	extra.side = extra.side || [0];
	extra.canvasRotate = canvasRotate || 0;
	return SpriteModel(id,src,[-1,1,-1,1],extra,[
		SpriteModel.anim('move',3,sizeX,sizeY,1,{dir:extra.side.length})
	]);
}
SpriteModel.player = function(id,src){
	var extra = {player:1,size:2.7,side:[1,2,3,0],hpBar:-17,legs:20,hitBox:[ -12,12,-12,12]}
	return SpriteModel(id,src,[-12,12,-5,20],extra,[
		SpriteModel.anim("move",4,24,32,0.5)
	]);
}
SpriteModel.picture = function(id,src,sizeX,sizeY,size,extra){
	extra = extra || {};
	extra.side = extra.side || [0];
	extra.size = size || 1;
	return SpriteModel(id,src,[-sizeX/2+1,sizeX/2-1,-sizeY/2+1,sizeY/2-1],extra,[
		SpriteModel.anim('move',1,sizeX,sizeY,0,{dir:extra.side.length})
	]);
}
SpriteModel.rpgvx = function(id,src){
	var extra = {size:2,side:[2,0,1,3],hpBar:-22,legs:16};
	return SpriteModel(id,src,[-16,16,-16,16 ],extra,[
		SpriteModel.anim('move',3,32,32,0.5)
	]);
}
SpriteModel.anim = function(name,frame,sizeX,sizeY,spd,extra){	//part of model
	var a = {
		name:'walk',
		startY:0,
		frame:4,
		sizeX:24,
		sizeY:32,
		dir:4,
		spd:0.4,
		walk:1,
		next:'walk'
	};
	a.name = name;
	a.frame = frame || a.frame;
	a.sizeX = sizeX || a.sizeX;
	a.sizeY = sizeY || a.sizeY;
	a.spd = Tk.nu(spd,a.spd);
	extra = extra || {};
	for(var i in extra) a[i] = extra[i];
	return a;
}


SpriteModel.getSignInPack = function(){
	return SIGN_IN_PACK;
}





if(SERVER) return;
var Filter = function(name,func){
	Filter.LIST[name] = func;
}
Filter.LIST = {};

Filter('red',function(red,green,blue,alpha){
	if(red > 100) red += 100;
	else red *= 2;
	return [
		red.mm(10),
		green,
		blue,
		alpha
	];
});

Filter('green',function(red,green,blue,alpha){
	if(green > 100) green += 100;
	else green *= 2;
	return [
		red,
		green.mm(10),
		blue,
		alpha
	]
});

Filter('blue',function(red,green,blue,alpha){
	if(blue > 100) blue += 100;
	else blue *= 2;
	return [
		red,
		green,
		blue.mm(10),
		alpha
	]
});

//TEST(SpriteModel.DB['warrior-male0']);
SpriteModel.generateFilteredImg = function(spriteModel,filter){
	if(!filter)
		for(var j in Filter.LIST){
			SpriteModel.generateFilteredImg(spriteModel,j);
			return;
		}
	//#####################
	
	var canvas = $('<canvas>')
		.attr({
			width:spriteModel.img.width,
			height:spriteModel.img.height
		})[0];
	var ctx = canvas.getContext("2d");
	ctx.drawImage(spriteModel.img,0,0);
	
	var imgDataNormal = ctx.getImageData(0,0,canvas.width,canvas.height);
		
	var imgData = imgDataNormal.data;
			
	for (var i = 0; i < imgData.length; i+=4){
		var res = Filter.LIST[filter](imgData[i+0],imgData[i+1],imgData[i+2],imgData[i+3]);
		imgData[i+0] = res[0];
		imgData[i+1] = res[1];
		imgData[i+2] = res[2];
		imgData[i+3] = res[3];
	}
	ctx.putImageData(imgDataNormal,0,0);
	spriteModel.filteredImg[filter] = new Image();
	spriteModel.filteredImg[filter].src = canvas.toDataURL();
	
}
	
	

SpriteModel.getImage = function(model,act){	//BAD with act...
	if(!act || !act.spriteFilter){
		if(model.img && model.img.complete) 
			return model.img;	//idk if complete is good...
		else {
			model.img = new Image();
			model.img.src = model.src;
			return;
		}
	}
	
	var filter = act.spriteFilter.filter;
	if(act.spriteFilter.time-- < 0) act.spriteFilter = null;
	if(model.filteredImg[filter] && model.filteredImg[filter].complete)
		return model.filteredImg[filter];
	else {
		SpriteModel.generateFilteredImg(model,filter);	
		return SpriteModel.getImage(model,null);	//return normal version
	}
	
	
	
}








})();

