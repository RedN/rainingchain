//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Collision','Map','Actor'],['Anim']));
if(SERVER) eval('var Anim;');

(function(){ //}
	Anim = exports.Anim = function(base,target){
		var tmp = {
			modelId:base.id || ERROR(3,'base.id needed'),
			sizeMod:base.sizeMod || 1,
			target:target,
			id:'a'+Math.randomId(5),
			type:'anim',
		}
		
		Map.addToEntityList(Map.get(Anim.getMap(tmp)),'anim',tmp.id);
		LIST[tmp.id] = tmp;
		return tmp;
	}

	var LIST = Anim.LIST = {};
	Anim.Base = function(id,sizeMod){	//for ability and stuff
		return {
			id:id,
			sizeMod:sizeMod || 1,
		};
	}

	Anim.Target = function(x,y,map,viewedIf){
		if(typeof x === 'string') 
			return {
				type:'id',
				id:x,
			}
			
		return {
			type:'position',
			x:x || 0,
			y:y||0,
			map:map||'',
			viewedIf:viewedIf||'true',	
		};	
	}

	Anim.doInitPack = function(anim){
		var c = [
			anim.modelId,
			anim.sizeMod,
		];
		if(anim.target.type === 'id')
			c.push(anim.target.id);
		else c.push({x:Math.round(anim.target.x),y:Math.round(anim.target.y)});
			
		return c;
	}
	
	Anim.get = function(id){
		return LIST[id] || null;
	}
	Anim.remove = function(id){
		Map.removeFromEntityList(Map.get(Anim.getMap(LIST[id])),'anim',id);
		delete LIST[id];
	}
	Anim.getMap = function(anim){
		if(anim.target.type === 'id') return Actor.get(anim.target.id).map;
		return anim.target.map;
	}	
	Anim.removeAll = function(){
		Map.removeAllAnim();
		LIST = {};
	}

	




	if(SERVER) return;
	Anim = function(compressAnim){
		var tmp = {
			modelId:compressAnim[0],
			sizeMod:compressAnim[1],
			target:null,	// {x,y}
			id:'a'+Math.randomId(5),
			timer:0,
			slot:0,
			type:null,
		};	
		
		if(typeof compressAnim[2] === 'string'){	//aka anim.target.type === 'id'
			tmp.type = 'id';
			var target = compressAnim[2] === player.id ? player : Actor.get(compressAnim[2]);
			tmp.target = target;
			if(!tmp.target) return;
		} else {
			tmp.type = 'position';
			tmp.target = {x:compressAnim[2].x,y:compressAnim[2].y};
		}
		Anim.LIST[tmp.id] = tmp;
		
		Anim.playSfx(tmp);
	}

	var LIST = Anim.LIST = {};
	
	Anim.remove = function(anim){	
		if(typeof anim === 'string') anim = Anim.LIST[anim.id];	//kinda dumb lol..
		delete Anim.LIST[anim.id];
	}

	Anim.playSfx = function(anim){
		var sfx = AnimModel.get(anim.modelId).sfx;
		if(!sfx) return;
		var volume = sfx.volume * Math.max(0.1,1 - 0.2*Math.floor(Collision.getDistancePtPt(player,anim.target)/50));
		Sfx.play(sfx.id,volume);
	}


	Anim.draw = function (ctx,layer){
		for(var i in Anim.LIST){
			var anim = Anim.LIST[i];
			var model = AnimModel.get(anim.modelId);
			if(!model) return ERROR(2,"anim model not found",anim.modelId);
			if(!model.layer === layer) return;
			
			var image = model.img;
			var height = image.height;
			var width = image.width;
			var sizeX = image.width / model.frameX;
			var slotX = anim.slot % model.frameX;
			var slotY = Math.floor(anim.slot / model.frameX);
			var sizeY = height / Math.ceil(model.frame / model.frameX);
			var size = model.size*anim.sizeMod;
			var startY = model.startY;
					
			ctx.drawImage(image,
				sizeX*slotX,sizeY*slotY+startY,
				sizeX,sizeY,
				CST.WIDTH2+anim.target.x-player.x-sizeX/2*size,
				CST.HEIGHT2+anim.target.y-player.y-sizeY/2*size,
				sizeX*size,sizeY*size
			);
		}
	}

	Anim.loop = function(){
		for(var i in Anim.LIST){
			Anim.loop.forEach(Anim.LIST[i]);
		}
	}

	Anim.loop.forEach = function (anim){	
		var animFromDb = AnimModel.get(anim.modelId);
		if(!animFromDb){ ERROR(2,"anim not found",anim.modelId); animFromDb = AnimModel.get('scratch'); }
		
		anim.timer += animFromDb.spd;
		
		anim.slot = Math.floor(anim.timer);
		if(anim.slot > animFromDb.frame){
			Anim.remove(anim);
		}	
	}
})();
