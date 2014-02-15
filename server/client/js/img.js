var Img = {};

Img.preloader = []; //hold all images to load

Img.preload = function(arr,cb){
	var newimages = [];
	var	loadedimages = 0;
	var arr = (typeof arr !== "object") ? [arr] : arr
	
	$("#preloader")[0].max = arr.length;
	
    function imageloadpost(){
        /*
		List.ctx.stage.clearRect(0,0,Cst.WIDTH,Cst.HEIGHT);
		List.ctx.stage.fillText('Loading... ' + loadedimages + '/' + arr.length,Cst.WIDTH2,Cst.HEIGHT2);
		*/
		loadedimages++;
		var str = Math.round(loadedimages/arr.length*100) + '%';
		$('.progress-value').html(str);
		$("#preloader")[0].value = loadedimages;
		
        if (loadedimages === arr.length) cb(newimages);
    }
    for (var i = 0; i < arr.length; i++){
        newimages[i] = new Image()
        newimages[i].src = arr[i]
        newimages[i].onload = function(){
            imageloadpost()
        }
        newimages[i].onerror = function(){
            imageloadpost()
        }
    }
}
 

Img.frame = {};
Img.frame.window = newImage('img/img/interface/window.png');
Img.frame.postit = newImage('img/img/interface/postit.png');

//Icon
Img.icon = newImage("img/img/iconSheet.png");
(function(){
	var system = 0;
	var ability = system + 11 + 1;
	var equip = ability + 9 + 1;
	var craft = equip + 12 + 1;
	
	
	
	Img.icon.index = {};
	var iconPreIndex = {
	//System
	'system':{'y':system+0,'x':['square','close','arrow','heart','gold']},
	'system1':{'y':system+1,'x':['left','right','down','up','more','less']},
	'tab':{'y':system+2,'x':['equip','inventory','quest','skill','friend','pref']},
	'element':{'y':system+3,'x':['melee','range','magic','fire','cold','lightning']},
	'status':{'y':system+4,'x':['bleed','knock','drain','burn','chill','confuse']},
	'resource':{'y':system+5,'x':['hp','mana','fury','dodge','heal']},
	'skill':{'y':system+6,'x':['melee','range','magic','metalwork','woodwork','leatherwork','geology','metallurgy','trapping']},
	'friend':{'y':system+7,'x':['friend','mute','add','remove']},
	'minimapIcon':{'y':system+8,'x':['enemy','boss','npc','quest','player']},
	'offensive':{'y':system+9,'x':['pierce','bullet','strike','leech','atkSpd']},
	'defensive':{'y':system+10,'x':['speed','pickup','life','item']},
	
	
	//Ability
	'attackMelee':{'y':ability+0,'x':['slash','pierce','scar','trio','triple','punch','box','slice','bleed','fierce','alert','ground','chop','cube']},
	'attackRange':{'y':ability+1,'x':['trio','steady','rocket','bleed','rain','thunder','head']},
	'attackMagic':{'y':ability+2,'x':['thunder','ring','breathe','fog','nova','crystal','tsunami','fireball','meteor','fire','ball','lightning','static','spark','storm']},
	'blessing':{'y':ability+3,'x':['angel','fly','beat','spike','sumo','muscle','strong','cycle','reflect','multi','wave','block']},
	'curse':{'y':ability+4,'x':['back','nuclear','ghost','fang','death','haunt','bleed','broken','sand','skull','stumble']},
	'dodge':{'y':ability+5,'x':['start','ninja','stand','footprint','wing','stop']},
	'heal':{'y':ability+6,'x':['plus','pill','open','pills','fixed','sink','pot','tower','mix','tree','vial','cake','dropplet','flower']},
	'summon':{'y':ability+7,'x':['wolf','moon','cat','bird','fang','head','peck','fish','dino','ram','gull','dragon','duo','rex','lion']},
	'misc':{'y':ability+8,'x':['teleport','circle','hourglass','timebomb','forward','disync','clock','invisible']},
	
	//Equip
	'melee':{'y':equip+0,'x':['mace','spear','sword']},
	'range':{'y':equip+1,'x':['bow','boomerang','crossbow']},
	'magic':{'y':equip+2,'x':['wand','staff','orb']},
	'amulet':{'y':equip+3,'x':['ruby','sapphire','topaz']},
	'helm':{'y':equip+4,'x':['metal','wood','bone']},
	'ring':{'y':equip+5,'x':['ruby','sapphire','topaz']},
	'gloves':{'y':equip+6,'x':['chain','leaf','hide']},
	'body':{'y':equip+7,'x':['metal','wood','bone']},
	'shield':{'y':equip+8,'x':['metal','wood','bone']},
	'bracelet':{'y':equip+9,'x':['ruby','sapphire','topaz']},
	'pants':{'y':equip+10,'x':['chain','leaf','hide']},
	'boots':{'y':equip+11,'x':['chain','leaf','hide']},
	
	//Craft
	'plan':{'y':craft+0,'x':['equip','ability']},
	'shard':{'y':craft+1,'x':['white','blue','yellow','gold']},
	'orb':{'y':craft+2,'x':['upgrade','boost','removal']},
	'metal':{'y':craft+3,'x':['metal']},
	'chain':{'y':craft+4,'x':['chain']},
	'wood':{'y':craft+5,'x':['wood']},
	'leaf':{'y':craft+6,'x':['leaf']},
	'bone':{'y':craft+7,'x':['bone']},
	'hide':{'y':craft+8,'x':['hide']},
	'rare':{'y':craft+9,'x':['0','1','2','3','4','5','6','7','8','9']},
	
	
	
	};

	for(var i in iconPreIndex){
		Img.icon.index[i.toUpperCase()] = iconPreIndex[i].y * Cst.ICON;
		for(var j = 0 ; j < iconPreIndex[i].x.length; j++){
			var x = j * Cst.ICON;
			var y = iconPreIndex[i].y * Cst.ICON;
			Img.icon.index[i + '.' + iconPreIndex[i].x[j]] = {'x':x,'y':y};
		}
	}
})();


//Npc Face Sheet
Img.face = newImage("img/img/faceSheet.png");






