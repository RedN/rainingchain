

modify icon sdk
simulate submission
tester for
	anim
	sprite (with default map for collision and bullet)
	map
	quest environment



displayname

link plot with quest




DEBUG: track someone in particular
db fake
finish doc


quest bonus in a object


passive:
multipage
change pts system
draw passive for special balancedAtk
remove passive




plan revamp:
already know what min and max mods are

ability window

add knockback on close range melee


add lvl to unlock stuff (act like tutorial)


//patch for release
Loop
//



remake tileset




#Priority 2:
-Crafting System with White

#Priority 3:


easy mode
cycle system

revamp a*


html window

protect db, list, itemlist
contact ppl for music





$$$$$$$$$$$

upgrade weapon
upgrade equip
upgrade ability

unlocked full formula for element dmg def

unlock passive
















Selling points:
no generic quest: fetch, kill X,  => puzzle, unique boss
no p2w
50% skills, 25% gear, 25% lvlup
best gear = require effort, create own gear
encourage collect things yourself
quest as hard as you can handle it.
open source
fight enemy pack; boss fight
no download.
changeable graphics
dark souls dodge
enemy different with lvl

reduce traveling time.
dialogue less

encourage team play








lets face it, we are currently in a mmorpg crisis. the p2w model is invading our beloved games.
its because of that that i decided to start my own open-source mmorpg raining chain.

ill be honest with you guys, raining chain isnt meant for everyone
if youre looking for fancy graphics, youre probably better off with genereic 3d mmorpg already on the market
if you want a casual game that can be played with a hand and the other one on your balls while watching a movie, youll be disppaointed.

raining chain is meant for hardcore gamers.
you will die. you will die alot actually.
unlike regular mmorpg that can be beaten by any casual player


the game is based on the fact that u can dodge any attack at any time, similiar to dodging in dark souls

















<canvas id="ctx" width="500" height="500" style="border:1px solid #000000;"></canvas>

<script>
/* Anim */
  
var ctx = document.getElementById("ctx").getContext("2d"); 
ctx.font = '30px Arial';


Anim = {};
Anim.loop = function (anim){
	var animFromDb = Db.anim[anim.name];
	anim.timer += animFromDb.spd * anim.spdMod;
	
	anim.x = anim.target.x;
	anim.y = anim.target.y;
	
	anim.slot = Math.floor(anim.timer);
	if(anim.slot > animFromDb.frame){
		delete List.anim[anim.id];
	}	
}

Anim.creation = function(name,target,sizeMod){	//server side
	//Add animation to the game. target = actor id OR an obj x,y,map,viewedIf
	sizeMod = sizeMod || 1;
	var id = 'a'+Math.randomId(5);
	List.anim[id] = {'sizeMod':sizeMod,'name':name,'target':target,'id':id};
	return id;
}

Anim.creation = function(a){	//client side
		if(typeof a.target === 'string'){
			if(a.target === player.name){	a.target = player;
			} else {a.target = List.all[a.target];}
		}
		
		a.id = Math.randomId();
		a.timer = 0;
		a.sizeMod = a.sizeMod || 1;
		a.spdMod = a.spdMod || 1;
		if(a.target){  
			a.x = a.target.x;
			a.y = a.target.y;
			a.slot = 0;			
			List.anim[a.id] = a;
		}
		
		var sfx = a.sfx || Db.anim[a.name].sfx;
		if(sfx && a.sfx !== false){	
			sfx.volume = sfx.volume || 1;
			sfx.volume *= Math.max(0.1,1 - 0.2*Math.floor(Collision.distancePtPt(player,a)/50));	
			Sfx.play(sfx);
		}	
	}

	
Draw = {};
Draw.anim = function (layer){
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
	
readFiles = function(files) {
	for (var i in files) { //for multiple files          
		(function(file) {
			var reader = new FileReader();  
			
			reader.fileName = file.name;
			if(file.type === "image/png"){
				reader.onload = readFiles.image;
				reader.readAsDataURL(file, "UTF-8");
			}
			if(file.type === "text/plain" || file.type === "application/javascript"){
				reader.onload = readFiles.script;
				reader.readAsText(file, "UTF-8");
			}
		})(files[i]);
	}
}

readFiles.image = function(e) {  
	var name = this.fileName.slice(0,this.fileName.indexOf('.'));
	name = name.replaceAll(' ','_');
	var array = name.split('_');
	
	if(array[0] === 'sprite'){
		if(!Db.sprite[array[1]]) permConsoleLog('Wrong Name',this.fileName);
		else Db.sprite[array[1]].img.src = this.result;
	}
	if(array[0] === 'anim'){
		if(!Db.anim[array[1]]) permConsoleLog('Wrong Name',this.fileName);
		else Db.anim[array[1]].img.src = this.result;
	}
	if(array[0] === 'icon')
		Img.icon.src = this.result;
		
		
	var image = new Image();
	image.src = this.result;
	image.id = this.fileName;
	image.name = this.fileName;
	Db.customImg[this.fileName] = image;
	readFiles.update();
}


readFiles.script = function(e) {  
	var text = e.target.result; 
	
	//var id = this.fileName + readFiles.script.adler32(text);
	var pastebin = this.fileName.slice(0,this.fileName.indexOf('.'));
	socket.emit('uploadMod', {id:pastebin});
	
	Db.customMod[pastebin] = {
		name:this.fileName,
		id:pastebin,
		text:text,
		approved:0,
	}
	
	readFiles.update();
}

socket.on('uploadMod', function (d) {
	var mod = Db.customMod[d.id];
	if(d.success){
		eval(mod.text);
		mod.approved = 1;
		readFiles.update();		
	} else { alert("pastebin.com/" + d.id + " doesn't exist. Make sure you uploaded your script on pastebin.com and that the file name matches the url.");}
});

//{name:,author:,adler32:,code:}

readFiles.script.adler32 = function(data) {
  var MOD_ADLER = 65521;
  var a = 1, b = 0;

  for (var i = 0; i < data.length; i++) {
    a += data.charCodeAt(i);
    b += a;
  }

  a %= MOD_ADLER;
  b %= MOD_ADLER;

  return (b << 16) | a;
}
	
readFiles.update = function(){	//#customModList
	var str = '';
	for(var i in Db.customImg)
		str += '-' + Db.customImg[i].name + '<br>';	
	
	for(var i in Db.customMod)
		str += '-' + Db.customMod[i].name + ' (' + (Db.customMod[i].approved ? 'APPROVED' : 'PENDING...') + ')<br>';	
	
	$("#customModList")[0].innerHTML = str;
}

readFiles.open = function(){
	$( "#customMod" ).dialog( "open" );
}

</script>

















