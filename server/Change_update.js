eval(loadDependency(['Db','List','Init','Loop','Change']));
var convert = Change.send.convert;


//not compress in old. use a custom isequal
Change.update = function(){
	for(var i in List.all){
		var act = List.all[i];
		if(!act) return ERROR(3,'no entities');
		Change.update[act.type](act);
	}
	for(var i in List.main){
		if(!List.socket[i] || !List.socket[i].clientReady) continue;
		Change.update.main(List.main[i]);
		Change.update.priv(List.all[i]);	//need to be after regular update.player 
	}
}
//quest: mq._toUpdate
Change.update.strike = function(){};
Change.update.drop = function(){};

Change.update.bullet = function(act){
	if(act.normal) return;
	
	if(Loop.interval(4)){
		var angle = Math.floor(act.angle);	if(act.old.a !== angle) act.change.a = act.old.a = angle;
	}
}

Change.update.player = function(act){
	if(!List.socket[act.id] || !List.socket[act.id].clientReady) return;
	if(true || Loop.interval(1)){
		var x = Math.floor(act.x);	if(act.old.x !== x) act.change.x = act.old.x = x; 
		var y = Math.floor(act.y);	if(act.old.y !== y) act.change.y = act.old.y = y;
	}
	if(Loop.interval(2)){
		var angle = Math.floor(act.angle);	if(act.old.a !== angle) act.change.a = act.old.a = angle;	//
	}
	
	if(Loop.interval(25)){
		var x = Math.floor(act.resource.hp.max);	if(act.old['resource,hp,max'] !== x) act.change['resource,hp,max'] = act.old['resource,hp,max'] = x; 
		if(act.old['sprite,name'] !== act.sprite.name) act.change['sprite,name'] = act.old['sprite,name'] = act.sprite.name; 
	}	
}
Change.update.npc = function(act){
	if(!Loop.interval(2)) return;
	if(!act.nevermove){
		if(true || Loop.interval(1)){
			var x = Math.floor(act.x);	if(act.old.x !== x) act.change.x = act.old.x = x; 
			var y = Math.floor(act.y);	if(act.old.y !== y) act.change.y = act.old.y = y;
		}
		if(Loop.interval(6)){
			var angle = Math.floor(act.angle/15)*15+1;	if(act.old.a !== angle) act.change.a = act.old.a = angle;
			//var x = Math.floor((Math.abs(act.spdX)+Math.abs(act.spdY))/2);	if(act.old.spd !== x) act.change.spd = act.old.spd = x;
		}
	}
		
	if(Loop.interval(24)){
		if(act.old['sprite,name'] !== act.sprite.name) act.change['sprite,name'] = act.old['sprite,name'] = act.sprite.name; 
		if(act.old['sprite,sizeMod'] !== act.sprite.sizeMod) act.change['sprite,sizeMod'] = act.old['sprite,sizeMod'] = act.sprite.sizeMod;
	}	
}

Change.update.npc.creation = function(act){	//called when creating npc, used to set old
	if(!act.nevermove){
		if(true || Loop.interval(1)){
			var x = Math.floor(act.x);	if(act.old.x !== x) act.change.x = act.old.x = x; 
			var y = Math.floor(act.y);	if(act.old.y !== y) act.change.y = act.old.y = y;
		}
		if(true || Loop.interval(5)){
			var angle = Math.floor(act.angle/15)*15+1;	if(act.old.a !== angle) act.change.a = act.old.a = angle;
			//var x = Math.floor((Math.abs(act.spdX)+Math.abs(act.spdY))/2);	if(act.old.spd !== x) act.change.spd = act.old.spd = x;
		}
	}
	
	if(true || Loop.interval(5)){
		if(act['sprite']['anim']){ act.change['sa'] = act['sprite']['anim']; act['sprite']['anim'] = ''; }
	}
	
	if(true || Loop.interval(25)){
		if(act.old['sprite,name'] !== act.sprite.name) act.change['sprite,name'] = act.old['sprite,name'] = act.sprite.name; 
		if(act.old['sprite,sizeMod'] !== act.sprite.sizeMod) act.change['sprite,sizeMod'] = act.old['sprite,sizeMod'] = act.sprite.sizeMod;
	}	
}

Change.update.main = function(act){
	if(Loop.interval(7)){
		if(act.old['currentTab'] !== act.currentTab) act.change['currentTab'] = act.old['currentTab'] = act.currentTab; 
		if(act.old['selectInv'] !== act.selectInv) act.change['selectInv'] = act.old['selectInv'] = act.selectInv; 
		if(act.old['questActive'] !== act.questActive) act.change['questActive'] = act.old['questActive'] = act.questActive; 
		
		if(act.flag.dialogue){ act.flag.dialogue = 0; act.change.dialogue = act.dialogue; }
		if(act.flag.popupList){ act.flag.popupList = 0; act.change.popupList = act.popupList; }
		 		
		if(act.tradeList.toUpdate){ /*act.invList.toUpdate = 0; //already done in convert*/ act.change.tradeList = convert.itemlist(act.tradeList); }
		//TODO: tradeList
		
		if(act.flag.optionList){ act.flag.optionList = 0; act.change.optionList = convert.optionList(act.optionList); }
		
	}	
	if(Loop.interval(15)){
		if(act['social']['message']){ act.change['social,message'] = act['social']['message']; act['social']['message'] = ''; }
		if(act['chatInput']){ act.change['chatInput'] = act['chatInput']; act['chatInput'] = ''; }
		if(act['screenEffect']['torch']){ act.change['screenEffect,torch'] = act['screenEffect']['torch']; act['screenEffect']['torch'] = ''; }
		if(act['screenEffect']['fadeout']){ act.change['screenEffect,fadeout'] = act['screenEffect']['fadeout']; act['screenEffect']['fadeout'] = ''; }
		if(act['sfx']){ act.change['sfx'] = act['sfx']; act['sfx'] = ''; }
	}
	if(Loop.interval(25)){
		if(act.old['questActive'] !== act.questActive) act.change['questActive'] = act.old['questActive'] = act.questActive; 
		if(act.questActive)
			if(act.old['questActiveHint'] !== act.quest[act.questActive]._hint) act.change['quest,' + act.questActive + ',_hint'] = act.old['questActiveHint'] = act.quest[act.questActive]._hint; 
		if(act['arrow']['remove']){ act.change['arrow,remove'] = act['arrow']['remove']; act['arrow']['remove'] = ''; }
		
		
	}
	if(Loop.interval(50)){
		for(var i in act.hideHUD)
			if(act.old['hideHUD,' + i] !== act.hideHUD[i]) act.change['hideHUD,' + i] = act.old['hideHUD,' + i] = act.hideHUD[i]; 
			
		if(act.flag['social,list,friend']){ act.flag['social,list,friend'] = 0; act.change['social,list,friend'] = act.social.list.friend; }
		if(act.flag['social,list,clan']){ act.flag['social,list,clan'] = 0; act.change['social,list,clan'] = act.social.list.clan; }
		if(act.flag['social,list,mute']){ act.flag['social,list,mute'] = 0; act.change['social,list,mute'] = act.social.list.mute; }
		
		
		if(act.flag['dailyTask']){ act.flag['dailyTask'] = 0; act.change['dailyTask'] = act.dailyTask; }
		if(act.flag['contribution']){ act.flag['contribution'] = 0; act.change['contribution'] = act.contribution; }
		
	}	
};

Change.update.priv = function(act){
	for(var i in act.change) act.privateChange[i] = act.change[i];	
	
	if(true || Loop.interval(1)){	//need to be as fast as x,y for fadeout
		if(act.privateOld.map !== act.map){ act.privateOld.map = act.map; act.privateChange.map = convert.map(act.map,act); }			  
	}
	if(Loop.interval(25)){	//
		if(act.flag.equip){	act.flag.equip = 0; chg['equip'] = convert.equip(act.equip,act); }
		if(old['weapon'] !== act.weapon) chg['weapon'] = old['weapon'] = act.weapon; 
		
		var x = Math.floor(act.resource.mana.max);	if(old['resource,mana,max'] !== x) chg['resource,mana,max'] = old['resource,mana,max'] = x; 
		//resource regen not covered
		if(old['weapon'] !== act.weapon) chg['weapon'] = old['weapon'] = act.weapon; 
		
		if(act.flag['permBoost']){ act.flag['permBoost'] = 0; chg['permBoost'] = act.permBoost; }
		
		if(act.flag.ability){	act.flag.ability = 0; chg['ability'] = convert.ability(act.ability,act); }
		if(act.flag.abilityList){	act.flag.abilityList = 0; chg['abilityList'] = convert.abilityList(act.abilityList,act); }
		
		if(act.flag['skill,exp']){ act.flag['skill,exp'] = 0; chg['skill,exp'] = act.skill.exp; }
		if(act.flag['skill,lvl']){ act.flag['skill,lvl'] = 0; chg['skill,lvl'] = act.skill.lvl; }
		
		if(act.flag.party){	act.flag.party = 0; chg['party'] = convert.party(act.party,act); }
		
	}
}






