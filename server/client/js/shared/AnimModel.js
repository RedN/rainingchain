//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
if(SERVER) eval('var AnimModel;');

(function(){//}

AnimModel = exports.AnimModel = function(id,frame,spd,layer,sfx,extra){
	var tmp = {
		id:id,
		src:'img/anim/' + id + '.png',	
		frame:frame || 10,
		frameX:Math.min(frame,5) || 10,
		spd:spd || 1,
		layer:layer || 'a',
		sfx:sfx || null,	//Sfx.Base {id:'asd',volume:0.5}
		size:4,
		startY:0,
		img:null,	//client side
	};
	for(var i in extra) tmp[i] = extra[i];
	
	DB[id] = tmp;
	
	if(!SERVER){
		tmp.img = Img.load(tmp.src,tmp);
	}
	
	return tmp;
};
var DB = AnimModel.DB = {};

AnimModel.Sfx = function(id,volume){
	return {
		id:id,
		volume:volume || 1,
	}
}

AnimModel.get = function(id){
	return DB[id] || null;
}
AnimModel('aura',30,1,'b');
AnimModel('bind',16);
AnimModel('heal',13);
AnimModel('boostBlue',16,1,'b');
AnimModel('boostGrey',18,1,'b');
AnimModel('boostPink',16,1,'b');
AnimModel('boostRed',16,1,'b');
AnimModel('boostWhite',10,1,'b');
AnimModel('curseBlue',15);
AnimModel('curseGreen',14);
AnimModel('cursePink',14);
AnimModel('cursePurple',9);
AnimModel('earthHit',7);
AnimModel('earthBomb',7);
AnimModel('rangeBomb',10,0.5);
AnimModel('waterBomb',15);
AnimModel('magicBomb',9);
AnimModel('magicHit',9);
AnimModel('fireBomb',30);
AnimModel('fireBomb2',6,0.4,'a',AnimModel.Sfx('explosion',0.5));
AnimModel('fireHit',12);
AnimModel('coldBomb',9,0.4);
AnimModel('coldHit',16);
AnimModel('lightningBomb',12);
AnimModel('lightningBomb2',5);
AnimModel('lightningHit',6);
AnimModel('scratch',6,1,'a',AnimModel.Sfx('sword',0.2));
AnimModel('scratch2',8);
AnimModel('slashCold',13);
AnimModel('slashFire',15);
AnimModel('slashLightning',14);
AnimModel('slashMelee',6);
AnimModel('strikeHit',3);
AnimModel('splashCold',10);
AnimModel('splashFire',7);
AnimModel('splashLightning',7);
AnimModel('splashMelee',9);

})();


