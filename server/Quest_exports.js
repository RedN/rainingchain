//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','Main','List','Actor','Tk','Init','Boss','Loop','Itemlist','Quest','Combat','Passive','Map','Chat','Dialogue','Drop','Craft','Collision','Sprite','Anim']));
// Press Alt-1 in Notepad++ to minimize code

//daily task, overwrite first if no space

var Dba = {	//ability for Qsystem, used for template
	attack:{"type":"attack",action:{anim:'attack',func:Combat.attack,funcStr:'Combat.attack',param:{}}},
	heal:{"type":"heal",icon:'heal.plus',action:{animOnSprite:'boostRed',func:Combat.heal,funcStr:'Combat.heal',param:{}}},
	dodge:{"type":"dodge",icon:'blessing.spike',action:{func:Combat.dodge,funcStr:'Combat.dodge',param:{}}},
	summon:{"type":"summon",animOnSprite:'boostPink',action:{func:Combat.summon,funcStr:'Combat.summon',param:{}}},
	idle:{"type":"idle",action:{func:CST.func,param:{}}},
	boost:{"type":"boost",action:{animOnSprite:'boostWhite',func:Combat.boost,funcStr:'Combat.boost',param:[]}},	//idk if [] or {}
};
var Dball = {};	//ability for other quests, used for abilityList

exports.init = function(version,questname,extra){	//}
	//{ For Admins Only
	var Q = questname;
	if(Q[0] !== 'Q') return ERROR(1,'quest id needs to start with Q',questname);
	var s = {};
	extra = extra || {};
	extra.id = questname;
	extra.version = version;
	
	var q = s.quest = Tk.useTemplate(Quest.template(),extra);
	var acceptNew = true;
	
	var Qid = function(name){
		if(name.have(Q + '-',true)) return name;
		else return Q + '-' + name;
	}
		
	var itemFormat = function(item,amount){
		var list = Itemlist.format(item,amount,false);
		var goodList = {};
		for(var i in list) goodList[Qid(i)] = list[i];
		return goodList;
	}
	
	var mapFormat = function(name){
		if(name[0] !== 'Q')
			return Q + '-' + name;
		return name;
	}
	
	var parseExtra = function(extra){
		if(!extra) return {quest:Q};
		if(extra.name) extra.context = extra.name;
		if(extra.hp) extra['resource,hp,max'] = extra.hp;
		if(extra.viewedIf) extra.viewedIf = parseViewedIf(extra.viewedIf);
		if(extra.sprite && typeof extra.sprite === 'string'){
			if(extra.sprite.have('.')) extra.sprite = extra.sprite.replace('.','');
			extra['sprite,name'] = extra.sprite;
			delete extra.sprite;
		}
		if(extra.skillPlot && !q.skillPlotAllowed) return ERROR(2,'not allowed skillplot');
		extra.quest = Q;
		if(extra.boss && extra.boss[0] !== 'Q') extra.boss = Qid(extra.boss);
		if(extra.leftClick){
			extra['onclick,left'] = {func:extra.leftClick.event,param:extra.leftClick.param || [],name:extra.leftClick.name || ''};
			delete extra.leftClick;
		}	
		if(extra.rightClick){
			extra['onclick,right'] = {func:extra.rightClick.event,param:extra.rightClick.param || [],name:extra.rightClick.name || ''};
			delete extra.rightClick;
		}	
		if(extra.shiftRightClick){
			extra['onclick,shiftRight'] = {func:extra.shiftRightClick.event,param:extra.shiftRightClick.param || [],name:extra.shiftRightClick.name || ''};
			delete extra.shiftRightClick;
		}
		if(extra.shiftLeftClick){
			extra['onclick,shiftLeft'] = {func:extra.shiftLeftClick.event,param:extra.shiftLeftClick.param || [],name:extra.shiftLeftClick.name || ''};
			delete extra.shiftLeftClick;
		}
		
		
		return extra;
	}
	
	var convertSetEvent = function(event){
		if(typeof event !== 'string') return event;
		if(s.quest.event['$SET_' + event]) return s.quest.event['$SET_' + event]
	}
	var convertGetEvent = function(event){
		if(typeof event !== 'string') return event;
		if(s.quest.event['$GET_' + event]) return s.quest.event['$GET_' + event]
	}
	
	var parseViewedIf = function(vif){
		if(typeof vif !== 'string') return vif;
		else return convertGetEvent(vif);
	}
	var parseEvent = function(event){
		if(typeof event !== 'string') return event;
		else return convertSetEvent(event);
	}
	var getAct = function(key){
		return List.all[key];
	}
	var getMapAddon = function(key){
		return List.map[getAct(key).map].addon[Q];
	}
	var modelFormat = function(model){
		if(Db.npc[Qid(model)]) return Qid(model);
		if(Db.npc['Qsystem-' + model]) return 'Qsystem-' + model;
		return ERROR(4,'no npc with that model',model);
	}
	
	var getSpot = function(key,map,spot,noerror){
		if(!s.isInMap(key,map)) return ERROR(4,'monster spawning in wrong map',key,map,spot);
		return getSpot.map(getAct(key).map,spot);
	}
	getSpot.map = function(map,spot){
		if(typeof spot === 'object') return {x:spot.x,y:spot.y,map:map};
		var a = Db.map[Map.getModel(map)].addon[Q].spot[spot];	//cant use list cuz map could not be created yet
		if(!a) return ERROR(3,'spot not found ',map,spot);
		a = Tk.deepClone(a);
		a.map = map;
		return a;
	}
	
	
	s.exports = function(exp){
		delete s.quest;
		exp.quest = q;
		q.s = s;
		
		if(q.showInTab)
			s.newHighscore('_score','Quest Score','Cumulative Quest Score (Increase every time you complete the quest.)','descending',function(key){
				return List.main[key].quest[Q]._rewardScore;
			});
		
		acceptNew = false;
		
		for(var i in q.item){
			for(var j in q.item[i].option){
				if(typeof q.item[i].option[j].func === 'string')
					q.item[i].option[j].func = q.event[q.item[i].option[j].func] || ERROR(2,'no quest event matches that name',q.item[i].option[j].func); 
			}
		}
		
		for(var i in q.dialogue){
			var face = q.dialogue[i].face;
			delete q.dialogue[i].face;
			for(var j in q.dialogue[i]){
				if(typeof q.dialogue[i][j].face === 'undefined')
					q.dialogue[i][j].face = Tk.deepClone(face);
				if(typeof q.dialogue[i][j].event === 'string') 
					q.dialogue[i][j].event = q.event[q.dialogue[i][j].event] || ERROR(2,'no quest event matches that name',q.dialogue[i][j].event,typeof q.dialogue[i][j].event); 
				for(var k in q.dialogue[i][j].option){
					var option = q.dialogue[i][j].option[k];
					if(typeof option.event === 'string') 
						option.event = q.event[option.event] || ERROR(2,'no quest event matches that name',option.event); 
					if(!option.next) continue;
					if(typeof option.next === 'string') option.next = {node:option.next};
					option.next.npc = option.next.npc || i;
					option.next.quest = Q;
				}
			}
		}
	}
	
	//TOFIX
	/*
	s.requirement = function(){
		if(Quest.requirement.template[arguments[0]])
			return Quest.requirement.template[arguments[0]](arguments[1],arguments[2],arguments[3],arguments[4]);	
	}
	*/
	//} Admins Only End
	

	//Quest Creation
	/**
	* Add quest variables. Attributes cant start with _ or $. 
	* Values are recommended to be Boolean or Number. 
	* String Value are OK. JSON Object values are "tolerated". Function values wont work.
	* 
	* @param	obj		Object		attribute=id, value=default value
	* @return
	*
	* Example:
		s.newVariable({
			interval:5*25,		//interval at which enemy spawn
			started:false,
			time:0,
			timeToSurvive:60*25,
		});
	*/
	s.newVariable = function(obj){
		for(var i in obj){
			if(i[0] === '_' || i[0] === '$') return ERROR(2,'quest variables cant start with _ or $',i);
			q.variable[i] = obj[i];
		}
	}
	/**
	* Add a quest event.
	* 
	* @param	id			String		id
	* @param	func		Function	what happens when its called
	* @return
	*/
	s.newEvent = function(id,func){
		if(!acceptNew) return ERROR(2,'cant create new stuff at this point');
		q.event[id] = func;
	}
	/**
	* Add a quest item in the database. Once added, you will be able to use s.itemAdd.
	* the id of the item (the one used to add and remove item) is not defined in the function
	* 
	* @param	id			String		id
	* @param	name		String		visible name to the player	
	* @param	icon		String		check sdk/icon & face for list of icons
	* @param	[option]	2D Array	[ [event,name,[description]],[event,name,[description]],... ]
	* @param	[desc]		String		
	* @return				Object		correctely formatted item.	
	
	Example
	
	s.newItem('tower','Tower','blessing.multi',[	//{
		['placeTowerRegular','Basic Tower','Place 1 basic tower. (25 Pts)'],
		['placeTowerAoe','AoE Tower','Place 1 AoE tower. (50 Pts)'],
		['placeTowerIce','Ice Tower','Place 1 Ice tower. (75 Pts)'],
	]);	//}
	'tower' is the id. to add this item: s.addItem(key,'tower',1);
		
	s.newItem('leaf','Red Leaf','leaf.leaf');
	
	Note: The //{ and //} are only for code appearance. In Notepad++, putting that allows folding the function code.
	
	*/
	s.newItem = function(id,name,icon,option,desc){
		if(!acceptNew) return ERROR(2,'cant create new stuff at this point');
		var tmp = {id:Qid(id),name:name,icon:icon || 'minimapIcon.loot',description:desc||name,option:[],trade:0,stack:1,bank:0,drop:0,quest:Q};
		for(var i in option){
			tmp.option.push({'func':option[i][0],'name':option[i][1],'description':option[i][2] || option[i][0],'param':[]});
			//at this point, func is string, check s.exports
		}
		q.item[id] = tmp;
	}
	/**
	* Add a challenge to your quest. Maximum of 3 per quest. Only 1 challenge can be active at once.
	* Challenges make the quest harder and grant player better reward.
	* Use s.getChallenge to know if a challenge is active.
	* 
	* @param	id			String			id
	* @param	name		String 			visible name
	* @param	desc		String 			description
	* @param	start		Function/Null 	called when starting the quest if challenge active
	* @param	successIf	Function/Null 	RETURN BOOLEAN. PARAM: key. called after s.completeQuest(). if returns true, challenge is successful and player get bonus
	*										if null, returns true no matter what.
	* @param	[bonus]		Number 			reward modifier. default=2	(ADMIN ONLY)
	* @param	[signIn]	Function/Null 	called when player signs in (after logging out)
	* @return				Object			correctly formatted challenge 	
	*/
	s.newChallenge = function(id,name,desc,start,successIf,bonus,signIn,extra){
		if(!acceptNew) return ERROR(2,'cant create new stuff at this point');
		extra = extra || {};
		if(signIn) extra.signIn = signIn;
		var c = Quest.challenge.template(name,desc,start,successIf,bonus,extra);
		c.id = Qid(id);
		q.challenge[id] = c;
	}
	/**
	* Add a highscore to your quest. The score needs to be a number.
	* Try to prevent ties. (Ex: Do not make a highscore for least death, everyone will be tied at 0.)
	* Highscore should involve minimal luck/randomness.
	* Scores will be round at 4 decimals past the point. Multiply by 1000 if needed.
	* 
	* @param	id			String			id
	* @param	name		String 			visible name
	* @param	desc		String 			description
	* @param	order		String		 	either "ascending" (rank 1 has smallest score) or "descending" (rank 1 has highest score)
	* @param	getScore	Function 		RETURN NUMBER/NULL. PARAM: key. called after s.completeQuest(). 
	*										the value will be used to compare with other players.
											if returns null, score wont be taking into consideration.
	* @return				Object			correctly formatted highscore 	
	*/
	s.newHighscore = function(id,name,description,order,getScore){
		if(!acceptNew) return ERROR(2,'cant create new stuff at this point');
		q.highscore[id] = {
			id:Qid(id),
			name:name,
			description:description,
			order:order,
			getScore:getScore,		
		}
	
	}
	/**
	* Create new ability using a template in Db_ability.js
	* 
	* @param	id			String			id
	* @param	template	String 			check Db_ability.js. Most commons ones follow pattern:
											[element][Bullet,Bomb,Strike,Nova]
											ex: fireBullet, meleeBomb, coldStrike, lightningNova
	* @param	extra		Object 			extra for the ability in general.
			Most common extra (for attack ability):
				period: 	Object		{global:Number,own:Number}	global=frames before using any other ability. own=frames before using same ability
						or	Number		will put global and own at same
				name: 		String		visible name
				icon: 		String		icon, refer to rc_sdk icon selector
											
	* @param	param		Object		 	extra for the attack. 
			Most common extra (for attack ability):
				dmg: 		Number		damage dealt
				angle: 		Number		angle between first and last bullet
				amount: 	Number		can be a fraction.
				
				###Bullet Only:###
				spd:		Number		bullet travelling speed, default=15
				ghost:		Boolean		if bullet past thru walls
				pierce:		{}			goes thru enemies, 			putting {} will use default param
				sin:		{}			move in wave, 				putting {} will use default param
				parabole:	{}			move in parabole. requires amount>1. putting {} will use default param
				boomerang:	{}			comes back to player. 		putting {} will use default param
				
				###Strike Only###	
				width:		Number		width size of the strike hitbox
				height:		Number		height size of the strike hitbox
				minRange:	Number		min distance between player and the center of the strike hitbox
				maxRange:	Number		max distance between player and the center of the strike hitbox
				delay:		Number		delay in frame between clicking/performing anim and the actual damage phase
				maxHit:		Number		max amount of enemy that can be hit by each strike
				
	* @return				String		ability id
	*
	* Examples:
	*	s.newAbility('superFireBall','fireBullet',{period:30},{angle:360,amount:5,ghost:1,boomerang:{}});
	*
	* Note: For healing self ability, use:
	* 	s.newAbility('myHealAbility','healModel',{period:{own:25*10,global:25*2}},{hp:500});
	*
	*/
	s.newAbility = function(id,template,extra,param){
		if(!acceptNew) return ERROR(2,'cant create new stuff at this point');
		if(!id) id = Math.randomId();	//for admin
		
		if(!Dba[template]) return ERROR(4,'no ability template',template);
		extra = extra || {};
		param = param || {};
		
		var ab = Tk.deepClone(Dba[template]);
		ab.action.param = Tk.useTemplate(ab.action.param,param,1,1);
		ab = Tk.useTemplate(ab,extra,1,1);
		
		var aa = ab.action;
		if(aa.funcStr === 'Combat.attack'){			
			for(var el in aa.param.dmg.ratio) if(aa.param.dmg.ratio[el]) break;	//select 1st element, add 5% status default
			if(!aa.param[CST.element.toStatus[el]])
				aa.param[CST.element.toStatus[el]] = {chance:0.05,magn:1,time:1};
		}
		if(aa.funcStr === 'Combat.summon'){			
			if(q.npc[aa.param.npc.model]) aa.param.npc.model = Qid(aa.param.npc.model);
			else aa.param.npc.model = 'Qsystem-' + aa.param.npc.model;
		}
		ab.id = Qid(id)
		q.ability[id] = ab;
		if(Q === 'Qsystem') Dba[id] = ab;	//means Qsystem needs to be loaded b4 the other quests
		else Dball[Qid(id)] = ab;
		return id;
	}
	
	s.newAbility.dmg = function(num,type){
		if(!CST.element.list.have(type)) return ERROR(2,'wrong type');
		var a = s.element(0,0,0,0,0,0);
		a[type] = 1;
		return {main:num,ratio:a};
	}
	s.newAbility.anim = s.newAbility.sprite = function(name,size){
		return {name:name,sizeMod:size || 1};
	}
	s.newAbility.onHit = s.newAbility.onStrike = function(chance,atk){
		return {chance:chance || 1,attack:atk};
	}
	s.newAbility.pierce = function(chance,dmgReduc,amount){
		return {chance:chance,dmgReduc:dmgReduc,amount:amount};
	}
	s.newAbility.nova = function(period,rotation,attack){
		return {period:period,rotation:rotation,attack:attack};
	}
	s.newAbility.status = function(chance,magn,time){
		return {chance:chance,magn:magn,time:time};
	}
	s.newAbility.boomerang = function(comeBackTime,spd,spdBack,newId){
		return {comeBackTime:comeBackTime,spd:spd,spdBack:spdBack,newId:newId};
	}

	s.newAbility.parabole = function(){	//TODO
		return {};
	}
	s.newAbility.curse = function(chance,boost){
		return {chance:chance,boost:boost};
	}
	/**
	* Create new ability that triggers an event
	*
	* @param	id		String			id
	* @param	event	Function	event to call when player use ability. PARAM: key
	* @return			Object		correctly formatted ability
	*
	*/
	s.newAbility.event = function(id,event){
		return s.newAbility(id,'eventModel',{'action,func':event},{});
	}
	/**
	* Create new equip (armor or weapon)
	*
	* @param	piece	String		either: weapon, body, helm, ring, amulet
	* @param	type	String		check below for list of compatible
	* @param	name	String		visible name
	* @param	value	Number		if weapon: dmg main, if armor: def main. 
										normally weapon dmg main are 10 + lvl/2,
										normally armor def main are 2.5 + lvl/8
	* @param	boost	Array		[{stat:'name',value:num,type:'*'}]
	* @return			Object		correctly formatted equip
	*
	*/
	s.newEquip = function(id,piece,type,name,value,boost){
		if(!acceptNew) return ERROR(2,'cant create new stuff at this point');
		if(!CST.equip.piece.have(piece)) return ERROR(3,'invalid piece',piece);
		if(!CST.equip[piece].have(type)) return ERROR(3,'piece and type doesnt match',piece,type);
			
		var ratio = Craft.equip.getRatio(piece,type);
		q.equip[id] = {id:Qid(id),quest:Q,salvagable:0,
			piece:piece,type:type,name:name,dmg:{main:value||1,ratio:ratio},boost:boost || []};
	}
	/**
	* Create new preset. The equip and abilities must be exclusive for the quest and must have been created via s.newAbility and s.newEquip.
	*
	* @param	id			String
	* @param	ability		String Array/False		array of ability ids, if '', then no ability in that slot,	if false, preset wont change ability
	* @param	equip		Object/False			attribute=piece, value=equip id, if false, preset wont change equip
	* @return 
	example:	
		s.preset(['fireball','','','iceshard'],{amulet:'amuletRuby',weapon:'superMace'});
	*/
	s.newPreset = function(id,ability,equip,passive){
		if(!acceptNew) return ERROR(2,'cant create new stuff at this point');
		var preset = {ability:ability,equip:equip,passive:passive};
		if(preset.ability){
			for(var i = preset.ability.length; i < 6; i++)
				preset.ability.push('');
		} else preset.ability = false;
		
		if(preset.equip){
			for(var i in CST.equip.piece){
				var p = CST.equip.piece[i];
				preset.equip[p] = preset.equip[p] || '';
			}
		} else preset.equip = false;
		
		preset.passive = typeof preset.passive === 'undefined' ? true : !!preset.passive;
		preset.id = Qid(id);
		q.preset[id] = preset;
	}
	/**
	* Create a new npc.
	*
	* @param	id			String
	* @param	info		Object			npc attributes
	* @return
	*/
	s.newNpc = function(id,info){
		if(info.boss && info.boss[0] !== 'Q') info.boss = Qid(info.boss);
		for(var i in info){	//so never use '' for attributes
			if(i.have('_')){
				info[i.replaceAll('_',',')] = info[i];
				delete info[i];
			}
		}
		if(typeof info.maxSpd === 'undefined') info.maxSpd = 1;
		info.maxSpd *= CST.NPCSPD;
		info.id = Qid(id);
		q.npc[id] = info;
	}
	s.newNpc.moveRange = function(ideal,max){
		return {ideal:100*ideal,confort:25,aggressive:max*400,farthest:max*600};
	}
	s.newNpc.sprite = function(name,sizeMod){
		return {name:name,sizeMod:sizeMod || 1};
	}
	
	s.newNpc.ability = function(template,ai,extra,param){
		if(template === 'idle') return ai;
		extra = extra || {};
		if(param) extra.param = param;
		return {template:template,aiChance:ai,extra:extra};
	}
	
	s.newNpc.mastery = function(melee,range,magic,fire,cold,lightning){
		return {
			'melee':{'+':0,'*':0,'x':0,'^':0,'sum':melee,'mod':1},
			'range':{'+':0,'*':0,'x':0,'^':0,'sum':range,'mod':1},
			'magic':{'+':0,'*':0,'x':0,'^':0,'sum':magic,'mod':1},
			'fire':{'+':0,'*':0,'x':0,'^':0,'sum':fire,'mod':1},
			'cold':{'+':0,'*':0,'x':0,'^':0,'sum':cold,'mod':1},
			'lightning':{'+':0,'*':0,'x':0,'^':0,'sum':lightning,'mod':1}
		};		
	}
	s.newNpc.abilityList = function(id,aiChance){
		if(Dball[Qid(id)]) var goodid = Qid(id);
		else if(Dba[id]) var goodid = 'Qsystem-' + id;
		else return ERROR(3,'no ability',id);
		return {id:goodid,aiChance:aiChance};
	}
	/**
	* Create new map. Check /rc_sdk/map for more info
	*
	* @param	id		String
	* @param	map		Object	{
									name:'visibleName',
									tileset:'v1.2',
									grid:[[]],				//generated automatically. Check /rc_sdk/map 
									lvl:0
								}	
	* @param	[addon]	Object	{
									spot:{},				//generated automatically. Check /rc_sdk/map 
									path:{},				//generated automatically. Check /rc_sdk/map 
									load:Function,			//called once when creating the map
									loop:Function,			//called every frame
									variable:{},			//sandbox, each instance has own copies of variable
									playerEnter:Function,	//called when player enters the map
									playerLeave:Function	//called when player leaves the map
								}
	* @return
	*
	*/
	s.newMap = function(id,map,addon){
		if(!acceptNew) return ERROR(2,'cant create new stuff at this point');
		
		map.id = Qid(id);
		map.addon = {};
		if(addon) map.addon[Q] = addon;
		map.graphic = map.graphic || map.id;
		q.map[id] = map;
		//template gonna be used late in Map.creation
	}
	/**
	* Create a simple map. Check /rc_sdk/map/simple for more info
	* If Quest.test.name is set, game will teleport player to the simple map on login.
	*
	* @param	map		Function	load function. must use simple map functions inside (ex: s.spawnActor.simple)
	* @return
	*/
	s.newMap.simple = function(load){
		s.newMapAddon('QfirstTown-simpleMap',{
			spot:{"a":{"x":240,"y":272},"b":{"x":400,"y":272},"c":{"x":560,"y":272},"d":{"x":720,"y":272},"e":{"x":880,"y":272},"f":{"x":1040,"y":272},"g":{"x":1200,"y":272},"h":{"x":1360,"y":272},"i":{"x":240,"y":464},"j":{"x":400,"y":464},"k":{"x":560,"y":464},"l":{"x":720,"y":464},"m":{"x":880,"y":464},"n":{"x":1040,"y":464},"o":{"x":1200,"y":464},"p":{"x":1360,"y":464},"q":{"x":240,"y":656},"r":{"x":400,"y":656},"s":{"x":560,"y":656},"t":{"x":720,"y":656},"u":{"x":880,"y":656},"v":{"x":1040,"y":656},"w":{"x":1200,"y":656},"x":{"x":1360,"y":656},"A":{"x":784,"y":752},"e1":{"x":240,"y":848},"e2":{"x":400,"y":848},"e3":{"x":560,"y":848},"e4":{"x":720,"y":848},"e5":{"x":880,"y":848},"e6":{"x":1040,"y":848},"e7":{"x":1200,"y":848},"e8":{"x":1360,"y":848},"n1":{"x":240,"y":1040},"n2":{"x":400,"y":1040},"n3":{"x":560,"y":1040},"n4":{"x":720,"y":1040},"t1":{"x":880,"y":1040},"t2":{"x":1040,"y":1040},"t3":{"x":1200,"y":1040},"t4":{"x":1360,"y":1040},"q1":{"x":240,"y":1232},"q2":{"x":400,"y":1232},"q3":{"x":560,"y":1232},"q4":{"x":720,"y":1232},"b1":{"x":880,"y":1232},"b2":{"x":1040,"y":1232},"b3":{"x":1200,"y":1232},"b4":{"x":1360,"y":1232}},
			load:load,
			loop:function(spot){
				if(!Loop.interval(50)) return;
				for(var i in List.main)	
					Quest.getQuestActive(i,function(quest,qid){		//update even if hint the same
						quest._toUpdate = 1;
					});	
			},
		});
		if(Quest.test.name === Q) Quest.test.simple = true;	
	}
	/**
	* Modify a pre-existing map.
	*
	* @param	id		String		format:'questId-mapId'		ex: QtowerDefence-base
	* @param	addon	Object	(Check s.map)
	* @return
	*
	*/
	s.newMapAddon = function(id,addon){
		if(!acceptNew) return ERROR(2,'cant create new stuff at this point');
		q.mapAddon[id] = addon;
		//template gonna be used later in Map.creation
	}
	/**
	* Create a new dialogue. Dialogue doesnt necessarily needs to be linked with an npc.
	* For more details, check /rc_sdk/quest/dialogue
	*
	* @param	npc		String			one of the id for dialogue
	* @param	face	Object/Null		if null, no face in dialogue
										if object: {image:'face icon used',name:'Name of Npc'},
	* @param	list	Object			check /rc_sdk/quest/dialogue
	* @return
	*/
	s.newDialogue = function(npc,face,list){
		list.face = face;
		q.dialogue[npc] = list;
		//check s.exports for dialogue init
	}
	/**
	* Either get a quest event or call a quest event.
	*
	* @param	id		String			id of the event to call. must have been created via s.newEvent('id',function(){...});
	* @param	p0-9	Any/Undefined	if undefined, return the function without calling it. if at least 1 p0-9 defined, then call the function with the params
	* @return			Function/Any	if p0-9 undefined, then return the function, else return whatever the function will return
	*/
	s.event = function(id,p0,p1,p2,p3,p4,p5,p6,p7,p8,p9){
		if(typeof p0 === 'undefined') return q.event[id] || ERROR(2,'no quest event has this name',id);
		else return q.event[id](p0,p1,p2,p3,p4,p5,p6,p7,p8,p9);
	}
	
	/**
	* Use to assign values to elements (ex: mastery, ability dmg, immune)
	* By default, value is 0
	*
	* @param	melee		Number		amount for melee attribute
	* @param	range		Number		amount for range attribute
	* @param	magic		Number		amount for magic attribute
	* @param	fire		Number		amount for fire attribute
	* @param	cold		Number		amount for cold attribute
	* @param	lightning	Number		amount for lightning attribute
	* @return				Object		correctly formatted element object
	*/
	s.element = function(melee,range,magic,fire,cold,lightning){
		return CST.element.custom(melee,range,magic,fire,cold,lightning);
	}
	
	/**	DO NOTHING YET...
	* Create new attack. Used for boss
	*
	* @param	type	String		"bullet" or "strike"
	* @param	obj		Object		check s.newAbility extra for attack
	* @return			Object		correctly formatted attack
	*
	*/
	s.attack = function(type,obj){
		obj.type = type;
		return obj;
	}
	
	
	//Events
	/**
	* Return true every x frames. (Game runs at 25 FPS) Used for interval.
	* 
	* @param	frame			Integer 	amount of frames
	* @return					Boolean 	
	*/
	s.interval = function(frame){ return Loop.interval(frame); }
	/**
	* Output an error in the terminal.
	* 
	* @param	txt			String
	* @return	 	
	*/
	s.ERROR = function(txt){
		ERROR(4,txt);
	}
	
	//Quest Status
	/**
	* If player hasn't started the quest, open the Quest Window and return false. If he has, return true.
	* 
	* @param	key			String
	* @param	force		No not use. Reserved for admins.
	* @return				Boolean
	*/
	s.startQuest = function(key,force){
		if(s.testActive(key)) return true;
		if(force){ Quest.start(key,Q); return true; }
		Main.openWindow(List.main[key],'quest',Q);
		Main.arrow.add(List.main[key],{"x":837,"y":80,side:'up',time:25*3});
			
		return false;
	}
	/**
	* Check if every player in party has started the quest. If not, display message to every player with list of people who havent and return false.
	* 
	* @param	key			String
	* @return				Boolean
	*/
	s.startQuestTeam = function(key){
		var list = s.getTeam(key);
		var badlist = [];
		for(var i in list){
			if(!s.startQuest(list[i])) badlist.push(list[i]);		
		}
		if(badlist.length === 0) return true;
		for(var i in list){
			s.chat(list[i],'Waiting after ' + badlist.toString() + ' to set the quest as active quest.');
		}
		return false;
	}
	/**
	* Abandon the quest. Triggers s.event('_abandon'). Quest variables are reset.
	* 
	* @param	key			String
	* @return				Boolean
	*/
	s.abandonQuest = function(key){
		Quest.abandon(key,Q);
	}
	/**
	* Complete the quest. Triggers s.event('_complete'). Quest variables are reset.
	* 
	* @param	key			String
	* @return				Boolean
	*/
	s.completeQuest = function(key){
		Quest.complete(key,Q);
	}
	/**
	* Return true if player active quest is the quest.
	* 
	* @param	key			String
	* @return				Boolean
	*/
	s.testActive = function(key){
		if(q.alwaysActive) return true;
		if(List.main[key].questActive === Q) return true;
		return false;
	}
	/**
	* Is online? Return true if player with this key is online.
	* 
	* @param	key			String
	* @return				Boolean
	*/
	s.isOnline = function(key){
		return !!List.main[key];
	}
	
		
	//Quest Variable
	/**
	* Return quest variable. Can be Boolean/Number/Object/String. If variable was object, it returns a copy of the variable.
	* 
	* @param	key			String
	* @param	attr		String		name of quest variable		
	* @return				Any
	*/
	s.get = function(key,attr){
		if(!attr) return ERROR(4,'no attrbiute');
		if(!List.main[key]) return;	//case enemy
		var mq = List.main[key].quest[Q];	
		var a = mq[attr];
		if(typeof a === 'string' && (a[0] === '{' || a[0] === '[')) return JSON.parse(a);
		return  a;	//prevent setting
	}
	/**
	* Set a quest variable. Variable will be stringify when store in DB. Avoid using Object.
	* 
	* @param	key			String
	* @param	attr		String		name of quest variable	
	* @param	value		Any			new value
	* @return				Any			new value
	*/
	s.set = function(key,attr,value){	
		if(!attr) return ERROR(4,'no attrbiute');
		if(attr[0] === '_') return ERROR(2,'cant modify attributes that start with _');
		var mq = List.main[key].quest[Q];	
		if(!mq._active)	return Chat.add(key,"You need to start this quest via the Quest Tab before making progress in it."); 
		
		if(typeof value === 'object') value = Tk.stringify(value);
		if(typeof value === 'string' && typeof mq[attr] === 'number' && !isNaN(value) && (value[0] === '+' || value[0] === '-'))	mq[attr] += (+value);
		else mq[attr] = value;
		
		Quest.updateHint(key,Q);
		
		return mq[attr];		
	}
	/**
	* Increase/decrease a number quest variable.
	* 
	* @param	key			String
	* @param	attr		String		name of quest variable	
	* @param	value		Number		amount to add (can be negative)
	* @return				Number		new value
	*/
	s.add = function(key,attr,value){
		return s.set(key,attr,s.get(key,attr) + value);
	}
	/**
	* Return true is challenge is active.
	* 
	* @param	key			String
	* @param	name		String		challenge id
	* @return				Boolean	
	*/
	s.getChallenge = function(key,name){
		return List.main[key].quest[Q]._challenge[name];
	},
	
	//Communication - Misc
	/**
	* Add message in player chat box. HTML coding works.
	* 
	* @param	key			String
	* @param	text		String		text
	* @param	[color]		String		color of text. Can use color name or hex code.
	* @return	
	*/
	s.chat = function(key,text,color){
		if(color) text = '<span style="color:' + color + '">' + text + '</span>';
		Chat.add(key,text);
	}
	/**
	* Open a popup box in top of screen with message. HTML coding works.
	* Only 1 popup can be opened at a time. They will overwrite each other.
	* 
	* @param	key			String
	* @param	text		String		text
	* @param	[time]		Number		number of frames its displayed, default = 25*10
	* @return	
	*/
	s.popup = function(key,text,time){
		Chat.add(key,{type:'popup',text:text,time:time || 25*8});
	}
	/**
	* Ask a true/false question to player. Call function if player answers yes.
	* 
	* @param	key			String
	* @param	text		String		question text
	* @param	event		Function
	* @return	
	*/
	s.question = function(key,text,event,option){
		if(option === undefined) option = true;
		Chat.question(key,{text:text,func:event,option:option});
	}	
	/**
	* Open highscore window.
	* 
	* @param	key			String
	* @param	category	String		highscore id
	* @return	
	*/
	s.highscoreWindow = function(key,category){
		if(!Db.highscore[Q + '-' + category]) return ERROR(2,'hs category not exist',Q + '-' + category);
		Main.openWindow(List.main[key],'highscore',Q + '-' + category);
	}
	/**
	* Start dialogue. The dialogue doesnt need to be linked with a npc.
	* Quest must be active else Quest Windows shows instead. 
	* Only exception is if npc === '_noquest'. To use when player doesnt meet requirement to do quest. Dialogue event will be disabled if quest is not active.
	*
	* @param	key			String
	* @param	npc			String		npc id
	* @param	node		String		node id
	* @return	
	*/
	s.dialogue = function(key,npc,node){		
		if(npc !== '_noquest' && !s.get(key,'_active')) return s.startQuest(key);
		Dialogue.start(key,{quest:Q,npc:npc,node:node});
	}
	/**
	* Manage chronometer.
	* 
	* @param	key			String
	* @param	name		String		chrono id
	* @param	action		String		"start" or "stop"
	* @param	[visible]	Boolean		if visible
	* @param	[text]		String		text showed to player on mouseover
	* @return				Null/Number	If action is "stop" returns time in ms.
	*/
	s.chrono = function(key,name,action,visible,text){
		return Main.chrono(List.main[key],Q + '-' + name, action,visible,text);
	}
	/**
	* Call a function in the future. Linked with a player.
	* 
	* @param	key			String
	* @param	name		String		timeout id
	* @param	time		Number		frames before calling it
	* @param	func		Function		event to call
	* @return
	*/
	s.setTimeout = function(key,name,time,func){
		Actor.setTimeout(getAct(key),Q + '-' + name,time,func);	
	};
	/**
	* Perform a screen effect on client screen:
	* "fadeout": Screen turns black then goes back to normal. 
	* 			num: time in frame
	* "torch": screen is black except a circle around the player. 
	*			num: radius of the circle
	* if no fx specified, remove screen effect.
	*
	* @param	key			String
	* @param	[fx]		String		either "fadeout" or "torch"
	* @param	[num]		Number		check above
	* @return
	*/
	s.screenEffect = function(key,name,num){
		if(num === null) return Main.screenEffect(List.main[key],name);
		
		if(name === 'fadeout')
			Main.screenEffect(List.main[key],name,{time:num || 25,maxTimer:num || 25});
			
		if(name === 'torch')
			Main.screenEffect(List.main[key],name,{time:CST.bigInt,radiusInside:num || 200,radiusOutside:(2*num) || 350});
			
	}
	/**
	* Return amount of passive points. Needs to be a player.
	*
	* @param	key		String
	* @return			Number
	*/
	s.getPassivePt = function(key){
		if(!s.isPlayer(key)) return ERROR(4,'no a player');
		return List.main[key].passive.usablePt;
	}	
		
	//Teleport - Positions
	/**
	* Teleport the player in a new map instance.
	* 
	* @param	key			String
	* @param	map			String		map model id
	* @param	letter		String		spot letter
	* @param	instance	String		"main", "party" or "solo"
	* @param	[newmap]	Boolean		if true and map already exists, create new instance instead of teleporting to old instance.
	* @param	[deleteold]	String		map model id. if player was in this map when event called, destroy the old map.
	* @return
	*/
	s.teleport = function(key,map,letter,instance,newmap,deleteold){	//
		map = mapFormat(map);
		if(Quest.test.simple) return Chat.add(key,"Can't teleport because in simple map mode.");
		if(!s.testActive(key)) return Chat.add(key,"Can't teleport because quest not active.");
		
		var p = getAct(key);
		var oldmap = p.map;
		if(instance === 'party') map += '@';
		if(instance === 'solo') map += '@@';
		if(newmap){
			var targetmap = Actor.teleport.getMapName(p,map);
			if(List.map[targetmap]){	//TODO verify if other players in instance
				if(oldmap === targetmap){	//if player in map, teleport out,
					Actor.teleport(p,{x:500,y:500,map:'QfirstTown-main@MAIN'});
				} 
				Map.remove(List.map[targetmap]);
			}
		}
		var spot = getSpot.map(map,letter);		
		Actor.teleport(getAct(key),spot);
		
		if(deleteold !== false && List.map[oldmap] && List.map[oldmap].list.player.$length() === 0)
			Map.remove(List.map[oldmap]);
	}
	//For Admin
	s.teleport.test = function(key,x,y,map){
		map = mapFormat(map);
		Actor.teleport(getAct(key),{x:x,y:y,map:map});	
	}
	/**
	* Teleport the player to the main town. Also set the respawn point there.
	* 
	* @param	key			String
	* @return
	*/
	s.teleport.town = function(key){
		Actor.teleport.town(List.all[key],true);
	}
	/**
	* Set Respawn of player. When he dies, this is where he will respawn.
	* 
	* @param	key			String
	* @param	map			String		map model id
	* @param	letter		String		spot letter
	* @param	instance	String		"main", "party" or "solo"
	* @param	[safe]		Boolean		if map does no longer exist when player dies, create a new instance and still teleport him.
	* @return
	*/
	s.setRespawn = function(key,map,letter,instance,safe){
		map = mapFormat(map);
		if(instance === 'party') map += '@';
		if(instance === 'solo') map += '@@';
		
		var spot = getSpot.map(map,letter);
		if(!spot) return ERROR(3,'no spot');
		Actor.setRespawn(getAct(key),spot,safe);
	}
	/**
	* Force the actor to follow a predetermined path. (check Tiled) Player must be in right map.
	* 
	* @param	key			String
	* @param	map			String		map model id
	* @param	path		String		path letter
	* @param	[extra]		Object		extra.combat:	Number:	Attackable while following path.	
										extra.boost:	Object:	Boost while following path.
										extra.event:	Function:	Called reach last path point.
	* @return
	*/
	s.path = function(key,map,path,extra){
		map = mapFormat(map);
		var act = getAct(key);
		if(Map.getModel(act.map) !== map) return ERROR(3,'act in wrong map for path'); 
		if(!Db.map[map].addon[Q].path[path]) return ERROR(3,'no path found');
		Actor.setCutscene(act,Db.map[map].addon[Q].path[path],extra.event,extra.boost,extra.combat);
		//ts("p.x = 1500; p.y = 3000;Actor.setCutscene(p,[{x:1600,y:3100},25*10,{x:1800,y:3200}]);")
	}
	/**
	* If player is dead, respawn him.
	* 
	* @param	key			String
	* @return
	*/
	s.respawnPlayer = function(key){
		var act = getAct(key);
		if(act.dead) Actor.death.respawn(act,false);
	}
	
	//Map Get
	/**
	* Return array of player keys who are in the map. Return [] if no player.
	* 
	* @param	key			String	Key of an actor already in the map
	* @param	map			String	Map model id.
	* @return				StringArray	player keys
	*/
	s.getPlayerInMap = function(key,map){
		map = mapFormat(map);
		if(map && !s.isInMap(key,map)){ ERROR(4,'monster spawning in wrong map'); return {}; }
		return Object.keys(List.map[getAct(key).map].list.player);	
	}
	/**
	* Return array of npcs keys who are in the map. Can restrict the search with only those who have a certain tag. Tag is an extra attribute when creating actor.
	* 
	* @param	key			String		Key of an actor already in the map
	* @param	map			String		Map model id
	* @param	[tag]		String		only returns npc that has that tag
	* @param	[value]		String		if .tag is object, only returns npc that has actor.tag[tag] === value
	* @return				StringArray	npc keys
	*/
	s.getNpcInMap = function(key,map,tag,value){
		if(map && !s.isInMap(key,map)){ ERROR(4,'wrong map'); return []; }
		if(!tag) return Object.keys(List.map[getAct(key).map].list.actor);	
		var tmp = [];
		var list = List.map[getAct(key).map].list.actor;
		for(var i in list){
			if(typeof value === 'undefined'){
				if(List.all[i].tag === tag) tmp.push(i);
			} else {
				if(List.all[i].tag[tag] === value) tmp.push(i);
			}
		}
		return tmp;		
	}
	/**	TOFIX
	* Call function for every player in map.
	* 
	* @param	key			String		Key of an actor already in the map
	* @param	map			String		Map model id.
	* @param	event		Function
	* @return	
	*/
	s.mapForEach = function(key,map,event,action){
		map = mapFormat(map);
		var bool = true;
		var party = s.getPlayerInMap(key,map);
		
		for(var ii in party){
			var i = party[ii];
			if(!getAct(i)){ ERROR(3,'no party member'); delete party[i]; continue; }
			var res = event(i);
			if(res === 'break') break;
			if(res === 'return') return 'return';
			bool = bool && res;
		}
		
		if(bool && action){
			for(var ii in party){
				var i = party[ii];
				var res = action(i);
				if(res === 'break') break;
				if(res === 'return') return 'return';
			}
		}
		return bool;	
	}
	/**
	* Return true if player is in the map.
	* 
	* @param	key			String
	* @param	map			String		Map model id.
	* @return				Boolean
	*/
	s.isInMap = function(key,map){
		map = mapFormat(map);
		return getAct(key).map.have(map,true);
	}
	/**
	* Return true if player is in quest map. (map part of q.map)
	* 
	* @param	key			String
	* @return				Boolean
	*/
	s.isInQuestMap = function(key){
		return getAct(key).map.have(Q,true);
	}
	/**
	* Return distance in pixel between 2 actors. Do not check if in same map.
	* 
	* @param	key			String
	* @param	key2		String
	* @return				Number
	*/
	s.getDistance = function(key,key2){
		return Collision.distancePtPt(getAct(key),getAct(key2));
	}
	
	/**
	* Return Object with x and y of the actor.
	* 
	* @param	key			String
	* @return				Object	{x:Number,y:Number}
	*/
	s.getPosition = function(key){
		var act = getAct(key);
		return {x:act.x,y:act.y};	
	}
	
	//Map Creation in Event
	/**
	* Add an actor in the same map instance than the player with the key (first param).
	* Use m.spawnActor in map load to create the actor automatically.
	* Use s.spawnActor only if you want to spawn the actor after a specific action.
	* 
	* @param	key			String		note: required to know which instance exactly
	* @param	map			String		map model id
	* @param	spot		String		letter from tiled project
	* @param	category	String		category of npc to create (Check Db_npc)
	* @param	variant		String		variant of npc to create
	* @param	[extra]		Object		difference between template and npc to create (Check doc about map)
	* @param	[lvl]		Number		lvl modifier comapred to map lvl
	* @return				String		key of npc created
	*/
	s.spawnActor = function(key,map,spot,model,extra,lvl){
		map = mapFormat(map);
		var spot = getSpot(key,map,spot);
		if(extra && extra.v){ 
			spot = Tk.deepClone(spot); 
			spot.x += Math.randomML()*extra.v; 
			spot.y += Math.randomML()*extra.v; 
			delete extra.v; 
		}
		
		return m.spawnActor(spot,model,extra,lvl);
	}
	/**
	* Same than above but instead of using a predetermined spot, it creates the npc over the player.
	* 
	* 
	* @param	key			String		note: required to know which instance exactly
	* @param	map			String		map model id
	* @param	category	String		category of npc to create (Check Db_npc)
	* @param	variant		String		variant of npc to create
	* @param	[extra]		Object		difference between template and npc to create (Check doc about map)
	* @param	[lvl]		Number		lvl modifier comapred to map lvl
	* @return				String		key of npc created
	*/
	s.spawnActor.onTop = function(key,map,model,extra,lvl){
		var act = getAct(key);
		var spot = {x:act.x,y:act.y,map:act.map,quest:Q,addon:Q};
		return m.spawnActor(spot,model,extra,lvl);	
	}
	/**
	* Create a group of npc. Unlike s.spawnActor, s.spawnActorGroup spawn 1 or many npcs that can respawn.
	* 
	* 
	* @param	key			String		note: required to know which instance exactly
	* @param	map			String		map model id
	* @param	spot		String		letter from tiled project
	* @param	respawn		Number/Boolean		amount of frame before respawn. if false, never respawn.
	* @param	list		2D Array	[[category,variant,amount,extra],...]	(Check Db_npc)
	* @return				ArrayString	list of keys of npcs created
	*/
	s.spawnActorGroup = function(key,map,spot,respawn,list,extra){
		map = mapFormat(map);
		var spot = getSpot(key,map,spot);
		if(extra && extra.v){ 
			spot = Tk.deepClone(spot); 
			spot.x += Math.randomML()*extra.v; 
			spot.y += Math.randomML()*extra.v; 
			delete extra.v; 
		}
		return m.spawnActorGroup(spot,respawn,list,extra);
	}
	/** TOFIX
	* Create a drop on the ground.
	*/
	s.drop = function(key,e,item,amount){
		item = Qid(item);
		amount = amount || 1;
		
		var tmp = {'x':e.x,y:e.y,map:e.map,"item":item,"amount":amount};
		tmp.viewedIf = Tk.arrayfy(key);	//key can be string or array of keys
		return Drop.creation(tmp);			
	}
	/**
	* Create an animation at a specific location visible by everyone nearby 
	* @param	key		String		note: required to know which instance exactly
	* @param	map		String		map model id
	* @param	spot	String		letter on tiled project
	* @param	name	String		id of the animation (Check anim.js)
	* @param	[size]	Number		size modifier default = 1
	* @return			String		id of anim created
	*/
	s.addAnim = function(key,map,spot,name,size){
		map = mapFormat(map);
		var spot = getSpot(key,map,spot);
		spot.viewedIf = function(){return true;}
		return Anim.creation({name:name,target:spot,sizeMod:size || 1});
	}
	/**
	* Create an animation on top of the actor with the key by everyone nearby 
	* @param	key		String		
	* @param	name	String		id of the animation (Check anim.js)
	* @param	[size]	Number		size modifier default = 1
	* @return			String		id of anim created
	*/
	s.addAnim.onTop = function(key,name,size){
		return Anim.creation({name:name,target:key,sizeMod:size || 1});
	}
	/**
	* Return true if actor has the tag specified
	*
	* @param	key			String		
	* @param	tag			String		
	* @return				Boolean		
	*/
	s.hasTag = function(key,tag){
		return getAct(key).tag === tag;
	}
	/**
	* Return list of actor keys in the rectangular collision box.
	*
	* @param	key			String		note: required to know which instance exactly
	* @param	map			String		map model id
	* @param	spot		String		letter from tiled project
	* @param	[tag]		String		only include actor with that tag
	* @return				StringArray		
	*/
	s.collision = function(key,map,spot,tag){
		map = mapFormat(map);
		var spot = getSpot(key,map,spot);
		var list = Map.collisionRect(spot.map,spot,'actor');
		if(!tag) return list;
		var list2 = [];
		for(var i in list) if(getAct(list[i]).tag === tag) list2.push(list[i]);
		return list2;
	}	
	
	//Preset Related
	/**
	* Force the player to use predetermined equip and/or abilities instead of his regular ones.
	* Presets need to be predetermined via q.preset.
	*
	* @param	key		String		
	* @param	name	String		id of the preset in q.preset
	* @return			
	*/
	s.usePreset = function(key,name){	//TOTEST
		var preset = Db.quest[Q].preset[name];
		if(!preset) return ERROR(3,'no preset with name',name);
		preset = Tk.deepClone(preset);
		List.main[key].quest[Q]._presetActive = name;
		var act = getAct(key);
		
		if(preset.ability){
			Actor.setCombatContext(act,'ability','quest',1);
			for(var i = 0 ; i < preset.ability.length; i++){
				if(preset.ability[i])
					s.addAbility(key,preset.ability[i],i);
			}
			s.rechargeAbility(key);
		}
		
		
		if(preset.equip){
			Actor.setCombatContext(act,'equip','quest',1);
			act.equip.quest.piece = Tk.deepClone(preset.equip);	//should be s.addEquip
		}
		
		if(!preset.passive) s.passiveOff(key);
	}
	/**
	* Allow the player to use his regular abilities and equips again.
	* 
	* @param	key		String		
	* @return			
	*/
	s.removePreset = function(key){
		Actor.setCombatContext(getAct(key),'ability','normal');
		Actor.setCombatContext(getAct(key),'equip','normal');
		s.passiveOn(key);
	}
	/**
	* Teach and assign to a slot an ability in q.ability to the player.
	* Doing so will change the combat context to quest. 
	* This means player will only be able to use the equips and abilities granted by the quest via s.preset, s.addAbility, s.addEquip
	* 
	* @param	key		String		
	* @param	name	String		id of ability
	* @param	slot	Number		0-5.
	* @return			
	*/
	s.addAbility = function(key,name,slot){
		if(!q.ability[name]) return ERROR(4,'no ability',name);
		var act = getAct(key);
		Actor.ability.add(act,Qid(name),false);
		Actor.ability.swap(act,Qid(name),slot);
	}
	/**	TODO
	* Teach and assign to a slot an ability in q.ability to the player.
	* Doing so will change the combat context to quest. 
	* This means player will only be able to use the equips and abilities granted by the quest via s.preset, s.addAbility, s.addEquip
	* 
	* @param	key		String		
	* @param	name	String		id of equip
	* @param	slot	Number		0-5.
	* @return			
	*/
	s.addEquip = function(key,name){	//TODO
		var act = getAct(key);
		Actor.equip(act,Qid(name));
	}
	/**
	* Actor no longer receives boost from Passive Grid. This includes Abilities.
	* Logging out and back in will re-enable the passive.
	* Sp put that in q._start in order to remove the passive grid upon login.
	*
	* @param	key		String
	* @return			
	*/
	s.passiveOff = function(key){
		Actor.permBoost(getAct(key),'Passive');
	}
	/**
	* Actor receives boost from Passive Grid. This includes Abilities.
	* 
	* @param	key		String
	* @return			
	*/
	s.passiveOn = function(key){
		Passive.updateBoost(key);
	}
	
	//Player Mods
	/**
	* Actor can no longer use ability.
	* 
	* @param	key		String
	* @return			
	*/
	s.attackOff = function(key){
		getAct(key).noAbility = 1;	
	}
	/**
	* Actor can longer use ability again.
	* 
	* @param	key		String
	* @return			
	*/
	s.attackOn = function(key){
		getAct(key).noAbility = 0;	
	}
	/**
	* Allow that actor to damage any other actor. Used mainly for pvp.
	* 
	* @param	key		String
	* @return			
	*/
	s.pvpOn = function(key){
		getAct(key).damageIf = 'true';	
	}
	/**
	* Actor can attack only what he can attack normally.
	* 
	* @param	key		String
	* @return			
	*/
	s.pvpOff = function(key){
		getAct(key).damageIf = getAct(key).type === 'player' ? 'npc' : 'player';	
	}
	/**
	* Change apparence of actor. Will also change bumperbox and hitbot automatically.
	* 
	* @param	key		String		
	* @param	name	String		id of the sprite (Check Db_sprite.js)
	* @param	[size]	Number		size modifier for the sprite (default = 1)
	* @return			
	*/
	s.setSprite = function(key,name,size){
		var tmp = {};
		if(name) tmp.name = name;
		if(size) tmp.sizeMod = size;
		Sprite.change(getAct(key),tmp);
	}
	/**
	* Increase or decrease a stat of an actor.
	* 
	* @param	key		String		
	* @param	name	String		id of the boost (used for s.boost.remove) you can choose anything.
	* @param	stat	String		id of the stat (Check Db_stat.js)
	* @param	value	Number		multiplier. 0.5 => stat is halved. 1=> do nothing. 2 => double
	* @param	[time]	Number		time in frames. if 0, permanent boost until quest over.
	* @return			
	*/
	s.boost = function(key,name,stat,value,time){
		if(!time) 
			Actor.permBoost(getAct(key),Q + '-' +name,[
				{stat:stat,value:value,type:'***'}		
			]);
		else Actor.boost(getAct(key),{name:Q + '-' + name,time:time,stat:stat,value:value,type:'*'});	
	}
	/**
	* Remove a boost added previously via s.boost
	* 
	* @param	key		String		
	* @param	name	String		id of the boost
	* @param	stat	String		id of the stat (Check Db_stat.js)
	* @return			
	*/
	s.boost.remove = function(key,name,stat){
		Actor.boost.removeById(getAct(key),stat + '@' + Q + '-' + name);
	}
	/**	TODO
	* Prevent the player from attacking and moving for a set amount of frames.
	* Player is invincible meanwhile. Used mainly for cutscene.
	* 
	* @param	key		String		
	* @param	time	Number		in frames
	* @param	event	Function	event to call at the end
	* @return			
	*/
	s.freeze = function(key,time,event){
		Actor.freeze(getAct(key),time,event);
	}
	/**	TODO
	* Unfreeze immediately a player that was s.freeze. Still trigger the event of s.freeze.
	* 
	* @param	key		String
	* @return			
	*/
	s.unfreeze = function(key){
		Actor.freeze.remove(getAct(key));
	}
	/**
	* Kill an actor. Will trigger deathEvent and deathEventOnce.
	* 
	* @param	key		String
	* @return			
	*/
	s.killActor = function(key){
		getAct(key).hp = -1;
	}
	/**
	* All abilities of that actor get ready to be used.
	* 
	* @param	key		String
	* @return			
	*/
	s.rechargeAbility = function(key){
		Actor.rechargeAbility(getAct(key));		
	}	
	/**
	* Return true is the actor is a player.
	* 
	* @param	key		String
	* @return			
	*/
	s.isPlayer = function(key){
		return getAct(key).type === 'player';
	}
	/**
	* Return actor tag. If tag is object, returned value is the object reference. 
	* This means modify it will change the actor tag.
	* 
	* @param	key		String		
	* @return			String/Object
	*/
	s.getTag = function(key){
		return getAct(key).tag;
	}
	/**
	* Set actor tag. 
	*
	* If tag is object:
	* @param	key		String		
	* @param	tag		String		attribute	
	* @param	value	Any
	* @return
	*
	* If tag is string:
	* @param	key		String		
	* @param	tag		Any			new value	
	* @return	
	*/
	s.setTag = function(key,tag,value){
		if(typeof value === 'undefined') return getAct(key).tag = tag;
		getAct(key).tag[tag] = value;
	}
	/**
	* Return true if actor is near the xy position.
	* 
	* @param	key		String		
	* @param	x		Number		
	* @param	y		Number		
	* @param	[delta]	Number		+- range at which it still counts has same position. JS uses float, 2 numbers will most likely not be equal.
	* @return			Boolean
	*/
	s.isAtPosition = function(key,x,y,delta){
		delta = delta || 4;
		var act = getAct(key);
		if(Math.abs(act.x - x) > delta) return false;
		if(Math.abs(act.y - y) > delta) return false;
		return true;
	}
	/**
	* Return true if actor is near a map spot.
	* 
	* @param	key		String		
	* @param	map		String		
	* @param	letter	String		
	* @param	[delta]	Number		+- range at which it still counts has same position. JS uses float, 2 numbers will most likely not be equal.
	* @return			Boolean
	*/
	s.isAtSpot = function(key,map,letter,delta){
		if(!s.isInMap(key,map)) return false;
		var spot = getSpot(key,map,letter);
		return s.isAtPosition(key,spot.x,spot.y,delta);
	}
	/**
	* Modify lifepoints of an actor
	* 
	* @param	key		String		
	* @param	amount	Number
	* @return			
	*/
	s.changeHp = function(key,num){
		getAct(key).hp += num;
	}
	
	//Party
	/**	TOFIX
	* Call function for every player in the same party than the player with the key.
	* The function is called first for the player with the key then for others.
	* For teleporting the party in new instance use something like:
	* 	s.partyForEach(leadkey,function(key){ s.teleport(key,'map','a','party',key === leadkey); });
	* 
	* @param	leadkey		String		key of the party leader
	* @param	event		Function
	* @return				Boolean
	*/
	s.partyForEach = function(leadkey,event,action){
		var bool = true;
		
		var party = List.party[getAct(leadkey).party].list;
		var result = event(leadkey);
		bool = bool && result;	//call lead first
		for(var i in party){
			var partymember = getAct(i); if(!partymember){ ERROR(3,'no party member'); continue; }
			if(i === leadkey) continue;
			var result = event(i);
			bool = bool && result;
		}
		
		if(bool && action){
			action(leadkey);
			for(var i in party){
				if(i === leadkey) continue;
				action(i);
			}
		}
		return bool;	
	}
	/**
	* Return list of the player keys in same party.
	* 
	* @param	key			String
	* @return				StringArray		player keys
	*/
	s.getTeam = function(key){	
		return Object.keys(List.party[getAct(key).party].list);
	}
	
	
	
	//Item
	/**
	* Add quest items to player inventory.  Quest needs to be active. 
	* You can only add items exclusive to your quest. (part of q.item)
	* Assumes it has space for it. If no space, do nothing. Verify if space via s.testItem. 
	*	
	*
	* Format 1:
	* @param	key			String
	* @param	item		String		item id
	* @param	[amount]	Number		amount, default = 1
	* @return				Boolean		there was enough space
	*
	* Format 2:
	* @param	key			String
	* @param	item		Object		{itemId:amount,itemId,amount,...}
	* @return				Boolean		there was enough space
	*/
	s.addItem = function(key,item,amount){
		if(s.get(key,'_active') === false) return false;
		
		Itemlist.add(List.main[key].invList,itemFormat(item,amount));
	}
	/**
	* Remove quest items to player inventory.
	*
	* Format 1:
	* @param	key			String
	* @param	item		String		item id
	* @param	[amount]	Number		amount, default = 1
	* @return
	*
	* Format 2:
	* @param	key			String
	* @param	item		Object		{itemId:amount,itemId,amount,...}
	* @return
	*/
	s.removeItem = function(key,item,amount){
		Itemlist.remove(List.main[key].invList,itemFormat(item,amount));
	}
	/**
	* Return true if player has the items specified in his inventory.
	*
	* Format 1:
	* @param	key			String
	* @param	item		String		item id
	* @param	[amount]	Number		amount, default = 1
	* @return				Boolean		
	*
	* Format 2:
	* @param	key			String
	* @param	item		Object		{itemId:amount,itemId,amount,...}
	* @return				Boolean	
	*
	*
	* Shortcut: You can use s.haveItem to test and remove the items at the same time.
	*
	* Format 3:
	* @param	key			String
	* @param	item		String		item id
	* @param	[amount]	Number		amount, default = 1
	* @param	removeifgood Boolean	if true and player has the items, remove them	
	* @return				Boolean		player has the items
	*
	* Both are equivalent: 
	*	if(s.haveItem(key,'axe',2)) s.removeItem(key,'axe',2);
	*	s.haveItem(key,'axe',2,true);
	*
	*	
	*/
	s.haveItem = function(key,item,amount,removeifgood){
		var list = itemFormat(item,amount);
		var success = Itemlist.have(key,list);
		if(success && (removeifgood || amount === true)) Itemlist.remove(List.main[key].invList,list);
		return success;
	}
	/**
	* Return true if player has enough space to add the items in his inventory.
	*
	* Format 1:
	* @param	key			String
	* @param	item		String		item id
	* @param	[amount]	Number		amount, default = 1
	* @return				Boolean		
	*
	* Format 2:
	* @param	key			String
	* @param	item		Object		{itemId:amount,itemId,amount,...}
	* @return				Boolean	
	*
	*
	* Shortcut: You can use s.testItem to test and add the items at the same time.
	*
	* Format 3:
	* @param	key			String
	* @param	item		String		item id
	* @param	[amount]	Number		amount, default = 1
	* @param	addifgood 	Boolean		if true and player has space for the items, add them	
	* @return				Boolean		player has space for the items
	*
	* Both are equivalent: 
	*	if(s.testItem(key,'axe',2)) s.addItem(key,'axe',2);
	*	s.testItem(key,'axe',2,true);
	*/
	s.testItem = function (key,item,amount,addifgood,variable){
		if(s.get(key,'_active') === false) return false;
		
		var list = itemFormat(item,amount);
		var success = Itemlist.test(List.main[key].invList,list);
		if(success && ((addifgood || amount) === true)) Itemlist.add(List.main[key].invList,list);
		
		if(success && (variable || typeof addifgood === 'string')){
			s.set(key,variable || addifgood,true);
		}
		return success;
	}
		
	/**
	* Return amount of empty inventory slot
		or, if amount is specified, return true if player equal or more empty inventory slot
	*
	* Format 1:
	* @param	key			String
	* @return				Number	
	*		
	* Format 2:
	* @param	key			String
	* @param	amount		Number		item id
	* @param	[message]	Boolean		if not false, display a message warning the player he doesnt have enough inv slot
	* @return				Boolean		
	*/
	s.getEmptyItem = function(key,amount,message){
		if(!amount) return Itemlist.empty(List.main[key].invList);
		var bool = Itemlist.empty(List.main[key].invList,amount);
		if(message !== false && bool === false) Chat.add(key,'You need at least ' + amount + ' empty inventory slots.');
		return bool;
	}	
		
	//##### Map ####
	var m = s.map = {}; m.map = Init.db.map.template; m.spawnon = function(){ return {}; };
	
	//Load
	/**
	* Add an actor to a spot.
	* 
	* @param	spot		Object		ex: spot.a
	* @param	category	String		category of npc to create (Check Db_npc)
	* @param	variant		String		variant of npc to create
	* @param	[extra]		Object		difference between template and npc to create (Check doc about map)
	* @param	[lvl]		Number		lvl modifier comapred to map lvl
	* @return				String		key of npc created
	
	Example
	
	m.spawnActor(spot.n3,'npc','normal',{
		sprite:'villager-male.5',
		dialogue:s.event('talkCyber'),
		name:'Cyber'
	});	
	
	*/
	m.spawnActor = function(spot,model,extra,lvl){
		return Actor.creation({spot:spot,model:modelFormat(model),extra:parseExtra(extra),lvl:lvl || 0});
	}
	/**
	* Create a group of npc. Unlike m.spawnActor, m.spawnActorGroup spawn 1 or many npcs that can respawn.
	* 
	* 
	* @param	spot		Object		ex: spot.a
	* @param	respawn		Number/Boolean		amount of frame before respawn. if false, never respawn.
	* @param	list		2D Array	[[category,variant,amount,extra],...]	(Check Db_npc)
	* @return				ArrayString	list of keys of npcs created
	
	Example
	
	m.spawnActorGroup(spot.e6,25*30,[
		["bat","normal",1,{deathEvent:s.event('killBat')}],
		["bee","normal",2,{deathEvent:s.event('killBee')}]
	]);	
	
	*/
	m.spawnActorGroup = function(spot,respawn,list,extraGroup){
		var tmp = [];
		for(var i in list){
			var m = list[i];
			tmp.push({"model":modelFormat(m[0]),'amount':m[1] || 1,'modAmount':true,'extra':parseExtra(m[2])});
		}
		var gr = Tk.useTemplate({'spot':spot,'respawn':respawn},extraGroup || {},true);
		return Actor.creation.group(gr,tmp);
	}
	/**
	* Create a series of unpushable blocks. Useful to prevent the player to reach a certain zone.
	* viewedIf condition for bullets is ALWAYS true.  This means bullets can't pass through those blocks.
	*  
	* @param	zone		Object		ex: spot.a	(need to be a linear zone)
	* @param	viewedIf	Function	if viewedIf(key) return true, then palyer with key can see and is blocked by blocks
	* @param	[sprite]	String		name of sprite used, either "spike", "invisible"
	* @param	[extra]		Object		(Check map creation)
	* @return
	
	Example
	
	m.spawnBlock(spot.b1,s.event('viewBlock'),'spike');
	
	s.newEvent('viewBlock',function(key){
		return s.get(key,'killMinion') < 10;
	});
	
	*/
	m.spawnBlock = function(zone,viewedIf,sprite,extra){	//only support spikes
		extra = extra || {};
		if(viewedIf) extra.viewedIf = viewedIf;
		if(!sprite){
			extra['sprite,name'] = 'invisible';
		}
		extra = parseExtra(extra);
		
		var totalinit = Math.abs(zone[1] - zone[0])/32 + Math.abs(zone[3] - zone[2])/32 + 1; //one should have value, other be 0
		var total = totalinit;	
		var a9 = Math.floor(total/9);	total -= a9*9;
		var a5 = Math.floor(total/5);	total -= a5*5;
		var a3 = Math.floor(total/3);	total -= a3*3;
		var a1 = total;
		var list = {'1':a1,'3':a3,'5':a5,'9':a9};	
		var block = true;		
		
		if(zone[2] === zone[3]){	//horizontal
			var x = zone[0] + 16;
			for(var i in list){
				var ext = Tk.deepClone(extra);
				if(sprite) ext['sprite,name'] = 'block-spike1x' + i;
				
				for(var j = 0 ; j < list[i]; j++){
					if(block) ext.block = {size:[0,totalinit-1,0,0]};
					m.spawnActor({x:x,y:zone[2]+16,map:zone.map,addon:zone.addon},'block-template',ext);
					if(block){ ext = Tk.deepClone(ext); delete ext.block; block = false;}
					x += 32*(+i);
				}
			}
		}
		if(zone[0] === zone[1]){	//vertical
			var y = zone[2] + 16;
			for(var i in list){
				var ext = Tk.deepClone(extra);
				if(sprite) ext['sprite,name'] = 'block-spike' + i + 'x1';
					
				for(var j = 0 ; j < list[i]; j++){
					if(block) ext.block = {size:[0,0,0,totalinit-1]};
					m.spawnActor({x:zone[0]+16,y:y,map:zone.map,addon:zone.addon},'block-template',ext);
					if(block){ ext = Tk.deepClone(ext); delete ext.block; block = false;}
					y += 32*(+i);
				}
			}
		}
	}
	/**
	* Create a toggle (switch): 
	* Call quest event when player activate/desactivate this actor. 
	* It starts in the "off" position. (Player activating it for first time will trigger "turnOn" event)
	* 
	* @param	spot		Object		ex: spot.a
	* @param	viewedIf	Function	if viewedIf(key) return true, then player with key can see and use the Off-Switch (the switch that will trigger the s.event('turnOn'))
										normally, if player hasn't activated it yet, it should return true.
	* @param	on			Function	event called when activating the Off-Switch		(PARAM: key | e: switch being clicked object | map: map object)
	* @param	off			Function	event called when activating the On-Switch		(PARAM: key | e: switch being clicked object | map: map object)
										if null, means the switch can only be activated once
	* @param	[sprite]	String		name of sprite, "box"
	* @return
	
	Example
	
	m.spawnToggle(spot.s1,s.event('viewTg,s.event('tgOnChest'),s.event('tgOffChest'));
		
	s.newEvent('viewTg',function(){
		return s.get(key,'tgChest');	
	});
	s.newEvent('tgOnChest',function(){
		s.set(key,'tgChest',true);
	});
	s.newEvent('tgOffChest',function(){
		s.set(key,'tgChest',false);
	});
	
	*/	
	m.spawnToggle = function(spot,viewedIf,on,off,sprite,extraOff,extraOn){
		sprite = sprite || 'box';
		viewedIf = parseViewedIf(viewedIf);
		
		//Off
		extraOff = parseExtra(extraOff);
		extraOff.viewedIf = function(key){
			if(getAct(key).type !== 'player') return true;
			return viewedIf(key,this.id) === true;
		};
		extraOff.toggle = parseEvent(on);

		m.spawnActor(spot,'toggle-' + sprite+'Off',extraOff);

		//On
		extraOn = parseExtra(extraOn);
		extraOn.viewedIf = function(key){
			if(getAct(key).type !== 'player') return true;
			return viewedIf(key,this.id) === false;
		};
		if(off) extraOn.toggle = parseEvent(off);
		
		m.spawnActor(spot,'toggle-' + sprite + 'On',extraOn);
	}
	/**
	* Create an actor that allows players who click on it to be teleported: 
	* 
	* @param	spot		Object		ex: spot.a
	* @param	event		Function	event to call when player click. normally involves s.teleport.
	* @param	sprite		String		"door", "underground", "zone"
	* @param	[extra]		Object		regular extra. useful to set angle and viewedIf
							Number		if number, extra is the angle in degree.
							String		if string, extra is the angle ("up","down","right","left").
	* @return
	*
	* Example
	
	m.spawnTeleport(spot.t1,s.event('teleportEvent'),'zone',"up");
				
	s.event('teleportEvent',function(key){
		if(s.get(key,'doorLocked') === true){
			s.chat(key,"The door is locked.");
		} else {
			s.teleport(key,'dragonLair','t1','solo',true);		//teleport to new solo instance for map dragonLair
		}
	});	
	
	*/	
	m.spawnTeleport = function(spot,event,sprite,extra){
		if(extra === 'up') extra = 270;
		if(extra === 'down') extra = 90;
		if(extra === 'left') extra = 180;
		if(extra === 'right') extra = 0;
		if(typeof extra === 'number') extra = {angle:extra};
		extra = parseExtra(extra);
		extra.teleport = event;
		m.spawnActor(spot,'teleport-' + (sprite || 'zone'),extra);
	}
	/**
	* Create a gravestone that allow players to set their respawn point there.
	* 
	* @param	spot		Object		ex: spot.a
	* @param	[safe]		Boolean		if true, if player dies and map containing that gravestone no longer exist, create map and teleport anyway
	* @return
	*/
	m.spawnWaypoint = function(spot,safe,extra){
		extra = parseExtra(extra);
		if(safe) extra.waypoint = 2;
		m.spawnActor(spot,'waypoint-grave',extra);
	}
	/**
	* Create a loot (chest): 
	* Call quest event when player activate/desactivate this actor. 
	* It starts in the "off" position. (Player activating it for first time will trigger "turnOn" event)
	* 
	* @param	spot		Object		ex: spot.a
	* @param	viewedIf	Function	if viewedIf(key) return true, then player with key can open the chest
										if returns null, chest invisible. false => displays already open chest
	* @param	open		Function	event called when opening the chest. normally makes it so viewedIf(key) returns false
	* @param	[sprite]	String		name of sprite, "chest", "flower"
	* @return
	
	Example
	
	m.spawnLoot(spot.q2,s.event('viewChest'),s.event('lootChest'),'chest');
			
	s.newEvent('viewChest',function(key){
		return s.get(key,'lootChest') === false;
	});
	s.newEvent('lootChest',function(key){
		if(s.get(key,'chestLocked') === false){
			s.addItem(key,'gold',1);
			s.set(key,'lootChest',true);
		} else {
			s.chat(key,'This chest is locked.');
		}
	});
	
	*/	
	m.spawnLoot = function(spot,viewedIf,open,sprite,extraOff,extraOn){
		sprite = sprite || 'chest';
		viewedIf = parseViewedIf(viewedIf);
		
		//Off
		extraOff = parseExtra(extraOff);
		extraOff.viewedIf = function(key){
			if(getAct(key).type !== 'player') return true;
			return viewedIf(key) === true;
		};
		extraOff.loot = open;

		m.spawnActor(spot,'loot-' + sprite + 'Off',extraOff);

		//On
		extraOn = parseExtra(extraOn);
		extraOn.viewedIf = function(key){
			if(getAct(key).type !== 'player') return true;
			return viewedIf(key) === false;
		};
		
		m.spawnActor(spot,'loot-' + sprite + 'On',extraOn);
	}
	/**
	* Create a sign. 
	* If text is string, upon clicking it will display a text in players chatbox. 
	* If text is function, upon clicking it will call that function. 
	* 
	* @param	spot		Object		ex: spot.a
	* @param	text		String	
	* @return
	*/
	m.spawnSignpost = function(spot,text,extra){
		extra = parseExtra(extra);
		extra.signpost = text;
		return m.spawnActor(spot,'system-sign',extra);	
	}
	/**
	* Create a new spot using a pre-existing spot. 
	* If text is string, upon clicking it will display a text in players chatbox. 
	* If text is function, upon clicking it will call that function. 
	* 
	* @param	spot		Object		ex: spot.a
	* @param	x			Number		difference in x between base spot and new spot
	* @param	y			Number		difference in y between base spot and new spot
	* @return				Object		new spot correctly formatted
	*/
	m.spotTranslation = function(spot,x,y){
		spot = Tk.deepClone(spot);
		spot.x += x;
		spot.y += y;
		return spot;
	}
	
	//Loop
	/**
	* Return list of player keys in the map.
	*
	* Format 1:
	* @param	spot		Object			ex: spot.a
	* @return				StringArray		
	*/
	m.getPlayerInMap = function(spot){
		if(!List.map[spot.map]) return [];
		return Object.keys(List.map[spot.map].list.player);
	}
	/**
	* Return list of player keys in the rectangular collision box.
	*
	* Format 1:
	* @param	spot		Object			ex: spot.a
	* @param	[time]		Number			only test every x frames
	* @return				StringArray		
	*/
	m.collision = function(spot,time){
		if(!Loop.interval(time || 5)) return [];
		return Map.collisionRect(spot.map,spot,'player');
	}
	/**
	* Return list of actor (npc+player) keys in the rectangular collision box.
	*
	* Format 1:
	* @param	spot		Object			ex: spot.a
	* @return				StringArray		
	*
	*/
	m.collision.actor = function(spot,time){
		if(!Loop.interval(time || 25)) return [];
		return Map.collisionRect(spot.map,spot,'actor');
	}
	/**
	* Return list of npc keys in the rectangular collision box.
	*
	* Format 1:
	* @param	spot		Object			ex: spot.a
	* @param	[time]		Number			only test every x frames
	* @return				StringArray		
	*/
	m.collision.npc = function(spot,time){
		if(!Loop.interval(time || 25)) return [];
		return Map.collisionRect(spot.map,spot,'npc');
	}
	/**	TOFIX
	* Call function for every player in map.
	* If the event function returns "break", break the loop. If returns "return", stop the loop.
	* 
	* @param	spot		Object		ex: spot.a
	* @param	event		Function
	* @return	
	*/
	m.mapForEach = function(spot,event,action){
		var bool = true;
		var party = m.getPlayerInMap(spot);
		
		for(var ii in party){
			var i = party[ii];
			if(!getAct(i)){ ERROR(3,'no party member'); delete party[i]; continue; }
			var res = event(i);
			if(res === 'break') break;
			if(res === 'return') return 'return';
			bool = bool && res;
		}
		
		if(bool && action){
			for(var i in party){
				var res = action(i);
				if(res === 'break') break;
				if(res === 'return') return 'return';
			}
		}
		return bool;	
	}
	
	
	// TOFIX
	m.bullet = function(spot,atk,angle,dif){
		var act = {damageIf:dif || 'player-simple',spot:spot};
		Map.convertSpot(act);
		
		Attack.creation(act,atk,{angle:angle});
	}
	// TOFIX
	m.strike = function(spot,atk,angle,dif,extra){
		Combat.attack.simple({damageIf:dif || 'player-simple',spot:spot,angle:angle},atk,parseExtra(extra));
	}
	// TOFIX
	m.drop = function(key,spot,name,amount,time){
		time = time || 25*120;
		if(!s.existItem(Q+ '-' + name)) return;
		
		var tmp = {'spot':spot,"item":Q + '-' + name,"amount":amount,'timer':time};
		if(typeof key === 'string') tmp.viewedIf = [key];
		Drop.creation(tmp);	
	}
	
	
	//For Admins Only
	m.spawnSkillPlot = function(spot,quest,type,num){
		var plot = Db.skillPlot[type];
		
		//create 2 copy. if not harvest, view up tree. else view down
		m.spawnActor(spot,plot.model,{
			skillPlot:{quest:quest,num:num,type:type},
			viewedIf:function(key,eid){
				if(List.all[key].type !== 'player') return true;
				var plot = List.all[eid].skillPlot;
				return List.main[key].quest[plot.quest]._skillPlot[plot.num] == 0;			
			}		
		});

		m.spawnActor(spot,plot.downModel,{
			skillPlot:{quest:quest,	num:num,type:'down'},
			viewedIf:function(key,eid){
				if(List.all[key].type !== 'player') return true;
				var plot = List.all[eid].skillPlot;
				return List.main[key].quest[plot.quest]._skillPlot[plot.num] == 1;			
			},
		});
	}
	//For Admins Only
	m.spawnBank = function(spot,extra){
		return m.spawnActor(spot,'system-bank',parseExtra(extra));	
	}
	
	
	//Minimized
	m.spawnActor.count = 0;	m.spawnActor.list = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','e1','e2','e3','e4','e5','e6','e7','n1','n2','n3','n4','t1','t2','t3','t4','q1','q2','q3','q4','b1','b2','b3','b4'];
	m.spawnActor.simple = function(name,extra){
		var spot = List.map['QfirstTown-simpleMap@MAIN'].addon[Q].spot[m.spawnActor.list[m.spawnActor.count++]];
		extra = parseExtra(extra);
		
		extra.context = name;
		extra.name = name;
		extra.nevermove = 1;
		extra.nevercombat = 1;
		extra.angle = 90;
		m.spawnActor(spot,'npc',extra);
	};
	m.spawnToggle.simple = function(name,viewedIf,on,off){ 
		var spot = List.map['QfirstTown-simpleMap@MAIN'].addon[Q].spot[m.spawnActor.list[m.spawnActor.count++]];
		
		var extra = {context:name,name:name};
		m.spawnToggle(spot,viewedIf,on,off,'box',extra,Tk.deepClone(extra));
	}
	m.spawnLoot.simple = function(name,viewedIf,open){ 
		var spot = List.map['QfirstTown-simpleMap@MAIN'].addon[Q].spot[m.spawnActor.list[m.spawnActor.count++]];
		
		var extra = {context:name,name:name};
		
		m.spawnLoot(spot,viewedIf,open,'chest',extra,Tk.deepClone(extra));
	}
	
	
	//Boss
	s.newBoss = function(id,variable,func){
		var boss = Boss.template();
		boss.id = Qid(id);
		for(var i in variable){
			if(i.have('_',true)) return ERROR(3,'cant have boss variable starting with _');
			boss.variable[i] = variable[i];
		}
		func(boss);
		q.boss[id] = boss;
	};
	s.newBoss.phase = function(boss,phase,info){
		if(boss.phase.$empty()) boss.currentPhase = phase;
		boss.phase[phase] = {
			loop:info.loop || CST.func,
			transitionTest:info.transitionTest,
			transitionIn:info.transitionIn,
			transitionOut:info.transitionOut,
		};
	};
	/*
	s.newBoss = function(id,variable,array){
		var boss = Boss.template();
		boss.id = Qid(id);
		for(var i in variable){
			if(i.have('_',true)) return ERROR(3,'cant have boss variable starting with _');
			boss.variable[i] = variable[i];
		}
		for(var i in array) boss.phase[array[i].phase] = array[i].info;
		boss.currentPhase = array[0].phase;
		q.boss[id] = boss;
	};
	s.newBoss.phase = function(phase,info){
		return {phase:phase,info:{
			loop:info.loop || CST.func,
			transitionTest:info.transitionTest,
			transitionIn:info.transitionIn,
			transitionOut:info.transitionOut,
		}};
	};
	*/
	var b = s.boss = {};
	b.ability = function(boss,name,extra){
		if(Db.ability[Qid(name)]) name = Qid(name);
		else name = 'Qsystem-' + name;
		Boss.ability(getAct(boss).boss,name,extra);
	}
	b.getSummon = function(boss,name){
		if(q.npc[name]) name = Qid(name);
		else name = 'Qsystem-' + name;
		return Boss.getSummon(getAct(boss).boss,name);
	}
	b.set = function(boss,attr,value){
		if(attr.have('_',true)) return ERROR(2,'cant modify internal values');
		var act = getAct(boss);
		if(!act || !act.boss) return ERROR(2,'no act or not boss');
		var mq = act.boss.variable;		
		if(typeof value === 'object') value = Tk.stringify(value);
		if(typeof value === 'string' && typeof mq[attr] === 'number' && !isNaN(value) && (value[0] === '+' || value[0] === '-'))	mq[attr] += (+value);
		else mq[attr] = value;
		return mq[attr];
	}
	b.add = function(boss,attr,value){
		return b.set(boss,attr,value > 0 ? '+' + value : '' + value);
	}
	b.attackOff = function(boss,time){
		if(isNaN(time)) return ERROR(3,'NaN');
		var act = getAct(boss);
		if(!act || !act.boss) return ERROR(2,'no act or not boss');
		act.boss.variable._noattack = time;
	}
	b.get = function(boss,attr){
		var act = getAct(boss);
		if(!act || !act.boss) return ERROR(2,'no act or not boss');
		var mq = act.boss.variable;
		var a = mq[attr];
		if(typeof a === 'string' && (a[0] === '{' || a[0] === '[')) return JSON.parse(a);
		return a;
	}
	
	return s;
}















