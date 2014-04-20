var MW = Middleware = {Init:{},Quest:{},Map:{},Combat:{},Chat:{},Actor:{},Dialogue:{},Sprite:{},Boss:{},Itemlist:{},Attack:{},Drop:{}};

MW.Init.db = {map:{model:Init.db.map.model}};

MW.Quest.getActor = function(key){ return List.all[key]; }
MW.Quest.getMain = function(key,quest){return List.main[key].quest[quest];}
MW.Quest.itemExist = function(id){ return !!Db.item[id]; }
MW.Quest.complete = Quest.complete;
MW.Quest.template = Quest.template;
MW.Quest.template.eval = Quest.template.eval;

MW.Dialogue.start = Dialogue.start;

MW.Actor.teleport = Actor.teleport;
MW.Actor.setRespawn = Actor.setRespawn;
MW.Actor.setCutscene = Actor.setCutscene;
MW.Actor.freeze = Actor.freeze;
MW.Actor.freeze.remove = Actor.freeze.remove;
MW.Actor.creation = Actor.creation;
MW.Actor.creation.group = Actor.creation.group;
MW.Actor.boost = Actor.boost;

MW.Map.getSpot = function(id,addon,spot){
	var a = Db.map[Map.getModel(id)].addon[addon].spot[spot];	//cant use list cuz map could not be created yet
	
	if(!a){ DEBUG(0,'spot not found ' + id + addon + spot); return }
	return {
		x:a.x,
		y:a.y,
		map:id,
	}
}
MW.Map.getAddon = function(id,addon){
	return List.map[id].addon[addon];	
}
MW.Map.getEnemy = function(map,tag){
	var list = List.map[map].list.npc;
	for(var i in list){
		if(List.all[i].tag === tag)
			return List.all[i];
	}
	return null;
}
MW.Map.convertSpot = Map.convertSpot;
MW.Map.collisionRect = Map.collisionRect;

MW.Attack.creation = Attack.creation;

MW.Combat.attack = {};
MW.Combat.attack.simple = Combat.attack.simple;

MW.Chat.add = Chat.add;
MW.Chat.question = Chat.question;

MW.Drop.creation = Drop.creation;

MW.Boss.attack = Boss.attack;
MW.Boss.summon = Boss.summon;
MW.Boss.template = Boss.template;

MW.Sprite.change = Sprite.change;

MW.Itemlist.add = Itemlist.add;
MW.Itemlist.remove = Itemlist.remove;
MW.Itemlist.have = Itemlist.have;
MW.Itemlist.test = Itemlist.test;






