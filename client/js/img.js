var imgFrame = {};
imgFrame.window = newImage('img/Frame/window.png');
imgFrame.postit = newImage('img/Frame/postit.png');

//Icon
var iconSheet = newImage("img/Icon/iconSheet.png");
var iconIndex = {};
(function(){
	var equip = 10;
	var ability = equip + 12;

	var iconPreIndex = {
	'system':{'y':0,'x':['square','close','arrow','heart','gold']},
	'tab':{'y':1,'x':['equip','inventory','quest','skill','friend','pref']},
	'element':{'y':2,'x':['melee','range','magic','fire','cold','lightning']},
	'resist':{'y':3,'x':['bleed','knock','drain','burn','chill','confused']},
	'resource':{'y':4,'x':['hp','mana','fury','dodge']},
	'skill':{'y':5,'x':['melee','range','magic','metalwork','woodwork','leatherwork','geology','metallurgy','trapping']},
	'friend':{'y':6,'x':['friend','mute','add','remove']},
	'minimapIcon':{'y':7,'x':['enemy','boss','npc','quest','player']},
	'offensive':{'y':8,'x':['melee','range','magic','fire','cold','lightning','mace','spear','sword','bow','boomerang','crossbow','wand','staff','orb','bleed','knock','drain','burn','chill','confuse','pierce','bullet','strike','leech','atkSpd']},
	'defensive':{'y':9,'x':['melee','range','magic','fire','cold','lightning','bleed','knock','drain','burn','chill','confuse','speed','pickup','life','item']},
	
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
	
	'attackMelee':{'y':ability+0,'x':['slash','pierce','scar','trio','triple','punch','box','slice','bleed','fierce','alert','ground','chop','cube']},
	'attackRange':{'y':ability+1,'x':['trio','steady','rocket','bleed','rain','thunder','head']},
	'attackMagic':{'y':ability+2,'x':['thunder','ring','breathe','fog','nova','crystal','tsunami','fireball','meteor','fire','ball','lightning','static','spark','storm']},
	'blessing':{'y':ability+3,'x':['angel','fly','beat','spike','sumo','muscle','strong','cycle','reflect','multi','wave','block']},
	'curse':{'y':ability+4,'x':['back','nuclear','ghost','fang','death','haunt','bleed','broken','sand','skull','stumble']},
	'dodge':{'y':ability+5,'x':['start','ninja','stand','footprint','wing','stop']},
	'heal':{'y':ability+6,'x':['plus','pill','open','pills','fixed','sink','pot','tower','mix','tree','vial','cake','dropplet','flower']},
	'summon':{'y':ability+7,'x':['wolf','moon','cat','bird','fang','head','peck','fish','dino','ram','gull','dragon','duo','rex','lion']},
	'heal':{'y':ability+8,'x':['teleport','circle','hourglass','timebomb','forward','disync','clock','invisible']},
	
	
	};

	for(var i in iconPreIndex){
		iconIndex[i.toUpperCase()] = iconPreIndex[i].y * ICON;
		for(var j = 0 ; j < iconPreIndex[i].x.length; j++){
			var x = j * ICON;
			var y = iconPreIndex[i].y * ICON;
			iconIndex[i + '.' + iconPreIndex[i].x[j]] = {'x':x,'y':y};
		}
	}
})();

//Item
var itemSheet = newImage("img/Icon/itemSheet.png");
var itemIndex = {};
(function(){
	var itemPreIndex =
	{
	'system':{'y':0,'x':['gold','ironSword','shield']},
	'melee':{'y':1,'x':['mace','spear','sword']},
	'range':{'y':2,'x':['bow','boomerang','crossbow']},
	'magic':{'y':3,'x':['wand','staff','orb']},
	'amulet':{'y':4,'x':['ruby','sapphire','topaz']},
	'helm':{'y':5,'x':['metal','wood','bone']},
	'ring':{'y':6,'x':['ruby','sapphire','topaz']},
	'gloves':{'y':7,'x':['chain','leaf','hide']},
	'body':{'y':8,'x':['metal','wood','bone']},
	'shield':{'y':9,'x':['metal','wood','bone']},
	'bracelet':{'y':10,'x':['ruby','sapphire','topaz']},
	'pants':{'y':11,'x':['chain','leaf','hide']},
	'boots':{'y':12,'x':['chain','leaf','hide']},
	'plan':{'y':13,'x':['planA']},
	'craft':{'y':14,'x':['lobster','logs','wood']},
	'orb':{'y':15,'x':['upgrade','boost','removal']},
	};

	for(var i in itemPreIndex){
		itemIndex[i.toUpperCase()] = itemPreIndex[i].y * ITEM;
		for(var j = 0 ; j < itemPreIndex[i].x.length; j++){
			var x = j * ITEM;
			var y = itemPreIndex[i].y * ITEM;
			itemIndex[i + '.' + itemPreIndex[i].x[j]] = {'x':x,'y':y};
		}
	}
})();



//Npc Face Sheet
var npcFaceSheet = newImage("img/Npc/npcFaceSheet.png");






