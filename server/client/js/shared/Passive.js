//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Tk','Init','Cycle','requireDb'],['PassiveGrid','Passive']));
if(SERVER) var db = requireDb();
/*
0 - dont have
1 - have
2 - start with
3 - highway
4 - block
//[[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["dmg-melee-^",1],		["dmg-melee-+",1],		["dmg-melee-x",1],		["dmg-melee-+",1],		["dmg-melee-^",1],		["dmg-melee-+",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["hp-regen",1],		["hp-max",1],		["hp-regen",1],		["maxSpd",1],		["maxSpd",1],		["dmg-melee-+",1],		["dmg-melee-*",1],		["dmg-melee-+",1],		["dmg-melee-*",1],		["maxSpd",1],		["dmg-melee-+",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["hp-max",1],		["hp-max",1],		["hp-max",1],		["maxSpd",1],		["maxSpd",1],		["dmg-melee-x",1],		["dmg-melee-+",1],		["dmg-melee-+",1],		["dmg-melee-+",1],		["dmg-melee-x",1],		["dmg-melee-+",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["leech-magn",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["hp-regen",1],		["hp-max",1],		["hp-regen",1],		["maxSpd",1],		["maxSpd",1],		["dmg-melee-+",1],		["dmg-melee-*",1],		["dmg-melee-+",1],		["dmg-melee-*",1],		["maxSpd",1],		["dmg-melee-+",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["dmg-melee-^",1],		["dmg-melee-+",1],		["dmg-melee-x",1],		["dmg-melee-+",1],		["dmg-melee-^",1],		["dmg-melee-+",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["dmg-melee-*",1],		["dmg-melee-+",1],		["dmg-melee-x",1],		["dmg-melee-^",1],		["maxSpd",1],		["dmg-melee-+",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["crit-magn",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["dmg-lightning-+",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],"balancedAtk",2,2,2,2,["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],2,2,2,2,["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],2,2,2,2,["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["dmg-fire-+",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],2,2,2,2,["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["dmg-cold-+",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["bullet-amount",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["summon-amount",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["dmg-range-+",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["dmg-magic-+",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["hp-regen",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]],[["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1],		["maxSpd",1]]]

*/

//TOFIX save currentCount to db
/* MODEL
PassiveGrid = {
	width:20,
	height:20,
	base:[[{stat:'b',value:100},...],
	count:{
		'2014/10/10':{max:0,min:0,sum:0,option:0,average:0,grid:[[100,100,100],[100,100,100]]}
	},
	moddedGrid:{
		'2014/10/10':{max:0,min:0,sum:0,option:0,average:0,grid:[[{stat:'b',value:642.33,count:100}]]}
	}
}
*/

Init.db.passive = function(cb){
	//Db.passiveGrid = [/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],'balancedAtk',2,2,2,2,['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],2,2,2,2,['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],2,2,2,2,['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],2,2,2,2,['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/		[['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1],['maxSpd',1]],/**/	];
	Db.passiveGrid = PassiveGrid.template();
	
	Init.db.passive.getCurrentCount(function(currentCount){
		Init.db.passive.getOldCount(function(countList){
			for(var i in Db.passiveGrid.count)
				Db.passiveGrid.count[i] = countList[i] || Tk.deepClone(currentCount);	//if exist, use db otherwise use current
			
			Db.passiveGrid = PassiveGrid.setModdedGrid(Db.passiveGrid);	
			Cycle.day.passive();
			cb();
		});
	});

}

Init.db.passive.getOldCount = function(cb){
	db.find('passiveCount',{},{'_id':0},function(err,info){ if(err) throw err;
		var tmp = {};
		for(var i = 0 ; i < info.length; i++){
			tmp[info[i].date] = info[i];
		}
		cb(tmp);
	});
}

Init.db.passive.getCurrentCount = function(cb){
	db.find('main',{},{_id:0,passive:1},function(err,info){ if(err) throw err;
		var count = PassiveGrid.template.count();	//have 100 count already
		
		for(var i = 0 ; i < info.length ; i++){
			var main = info[i];
			for(var m in main.passive.grid){
				var pass = main.passive.grid[m];
				for(var j = 0 ; j < pass.length ; j++){
					for(var k = 0 ; k < pass[j].length ; k++){
						if(pass[j][k] == '1'){
							count.grid[j][k].count++;
						}
					}
				}
			}
		}
		count = PassiveGrid.template.count.setInfo(count);
		count.date = Date.nowDate();
		cb(count);
	});
}


//PassiveGrid = main.passiveGrid 	aka stats and values
//Passive = main.passive 			aka 0s and 1s
var PassiveGrid = exports.PassiveGrid = {};
PassiveGrid.template = function(){
	var a = {width:15,height:15}
	a.base = PassiveGrid.template.base();
	a.moddedGrid = {};
	a.count = {};
	
	var time = Date.now();
	for(var i = 0 ; i < 40; i++){
		var day = Date.nowDate(time + CST.DAY*10 - CST.DAY*i);	//set for 30 days back and 10 in future
		a.count[day] = PassiveGrid.template.count();
		a.count[day].date = day;
	}
	
	return a;
}
PassiveGrid.template.base = function(){
	return PassiveGrid.template.base.turnObject(	
		//20x20//[[["def-fire-+",0.01],["def-range-*",0.01],["bleed-chance",0.01],["dmg-melee-*",0.01],["def-range-^",0.01],["hp-regen",0.01],["burn-time",0.01],["def-cold-x",0.01],["weapon-crossbow",0.01],["def-melee-^",0.01],["stun-time",0.01],["def-melee-x",0.01],["def-range-x",0.01],["dmg-magic-+",0.01],["weapon-bow",0.01],["bullet-spd",0.01],["def-fire-*",0.01],["dmg-fire-^",0.01],["dmg-cold-^",0.01],["knock-time",0.01]],[["hp-max",0.01],["def-fire-x",0.01],["def-melee-x",0.01],["dmg-cold-*",0.01],["mana-regen",0.01],["def-magic-x",0.01],["def-cold-*",0.01],["def-lightning-*",0.01],["strike-maxHit",0.01],["def-melee-^",0.01],["dmg-melee-*",0.01],["dmg-cold-^",0.01],["summon-def",0.01],["drain-chance",0.01],["bullet-spd",0.01],["def-lightning-+",0.01],["weapon-boomerang",0.01],["knock-time",0.01],["dmg-magic-^",0.01],["dmg-cold-x",0.01]],[["weapon-sword",0.01],["def-cold-x",0.01],["dmg-lightning-*",0.01],["weapon-sword",0.01],["atkSpd",0.01],["strike-maxHit",0.01],["dmg-lightning-x",0.01],["leech-magn",0.01],["def-magic-x",0.01],["def-melee-^",0.01],["def-magic-+",0.01],["dmg-melee-x",0.01],["knock-time",0.01],["weapon-bow",0.01],["knock-time",0.01],["chill-magn",0.01],["knock-time",0.01],["dmg-melee-*",0.01],["dmg-magic-^",0.01],["dmg-lightning-x",0.01]],[["item-rarity",0.01],["drain-chance",0.01],["def-magic-+",0.01],["bullet-spd",0.01],["bullet-spd",0.01],["dmg-range-^",0.01],["def-fire-*",0.01],["leech-chance",0.01],["def-range-*",0.01],["bleed-time",0.01],["knock-chance",0.01],["strike-maxHit",0.01],["dmg-melee-x",0.01],["item-quality",0.01],["bullet-spd",0.01],["bullet-spd",0.01],["dmg-magic-^",0.01],["hp-regen",0.01],["def-range-x",0.01],["dmg-lightning-+",0.01]],[["def-lightning-*",0.01],["bleed-time",0.01],["leech-chance",0.01],["mana-max",0.01],["def-cold-+",0.01],["knock-chance",0.01],["chill-time",0.01],["leech-magn",0.01],["bleed-chance",0.01],["dmg-melee-*",0.01],["stun-magn",0.01],["dmg-melee-+",0.01],["chill-time",0.01],["dmg-magic-^",0.01],["def-melee-^",0.01],["crit-chance",0.01],["knock-time",0.01],["item-quantity",0.01],["def-melee-*",0.01],["strike-maxHit",0.01]],[["mana-max",0.01],["dmg-melee-^",0.01],["dmg-lightning-*",0.01],["def-cold-^",0.01],["summon-def",0.01],["burn-time",0.01],["leech-chance",0.01],["dmg-melee-*",0.01],["def-cold-^",0.01],["dmg-cold-*",0.01],["def-magic-^",0.01],["def-magic-*",0.01],["dmg-cold-x",0.01],["bleed-magn",0.01],["dmg-magic-x",0.01],["weapon-sword",0.01],["def-fire-^",0.01],["def-melee-*",0.01],["burn-chance",0.01],["dmg-range-*",0.01]],[["dmg-melee-^",0.01],["def-range-+",0.01],["stun-magn",0.01],["weapon-wand",0.01],["dmg-cold-^",0.01],["dmg-cold-x",0.01],["def-lightning-^",0.01],["chill-time",0.01],["chill-time",0.01],["knock-time",0.01],["stun-time",0.01],["def-range-x",0.01],["chill-time",0.01],["def-lightning-^",0.01],["mana-max",0.01],["def-melee-*",0.01],["acc",0.01],["dmg-melee-*",0.01],["dmg-lightning-*",0.01],["strike-size",0.01]],[["burn-time",0.01],["item-quality",0.01],["dmg-magic-+",0.01],["dmg-fire-+",0.01],["leech-magn",0.01],["dmg-melee-+",0.01],["atkSpd",0.01],["drain-chance",0.01],["weapon-boomerang",0.01],["def-cold-+",0.01],["drain-magn",0.01],["dmg-range-+",0.01],["dmg-lightning-^",0.01],["drain-time",0.01],["dmg-range-^",0.01],["def-fire-^",0.01],["def-range-x",0.01],["def-melee-^",0.01],["weapon-crossbow",0.01],["def-magic-x",0.01]],[["burn-time",0.01],["def-cold-+",0.01],["weapon-boomerang",0.01],["item-rarity",0.01],["crit-magn",0.01],["drain-time",0.01],["weapon-wand",0.01],["hp-regen",0.01],2,2,2,2,["mana-max",0.01],["def-magic-x",0.01],["def-lightning-+",0.01],["def-magic-*",0.01],["leech-magn",0.01],["hp-max",0.01],["knock-chance",0.01],["def-melee-*",0.01]],[["chill-time",0.01],["bleed-time",0.01],["def-melee-x",0.01],["strike-maxHit",0.01],["dmg-lightning-^",0.01],["weapon-staff",0.01],["weapon-sword",0.01],["stun-magn",0.01],2,2,2,2,["leech-chance",0.01],["def-cold-*",0.01],["bleed-time",0.01],["def-lightning-+",0.01],["strike-size",0.01],["atkSpd",0.01],["stun-magn",0.01],["atkSpd",0.01]],[["dmg-melee-+",0.01],["item-rarity",0.01],["dmg-fire-x",0.01],["item-quality",0.01],["dmg-cold-^",0.01],["def-cold-*",0.01],["def-magic-+",0.01],["mana-regen",0.01],2,2,2,2,["dmg-magic-*",0.01],["def-cold-*",0.01],["hp-regen",0.01],["knock-magn",0.01],["strike-maxHit",0.01],["chill-magn",0.01],["dmg-cold-^",0.01],["def-range-^",0.01]],[["dmg-range-x",0.01],["def-fire-^",0.01],["def-magic-x",0.01],["dmg-cold-x",0.01],["drain-chance",0.01],["def-cold-x",0.01],["dmg-cold-^",0.01],["def-cold-*",0.01],2,2,2,2,["acc",0.01],["def-lightning-^",0.01],["def-lightning-^",0.01],["dmg-melee-*",0.01],["maxSpd",0.01],["def-melee-x",0.01],["strike-range",0.01],["dmg-cold-*",0.01]],[["burn-time",0.01],["bullet-spd",0.01],["pickRadius",0.01],["dmg-range-*",0.01],["weapon-mace",0.01],["bullet-amount",0.01],["summon-amount",0.01],["dmg-melee-x",0.01],["dmg-fire-x",0.01],["def-melee-*",0.01],["dmg-melee-^",0.01],["hp-regen",0.01],["dmg-range-*",0.01],["dmg-magic-^",0.01],["def-fire-+",0.01],["pickRadius",0.01],["hp-max",0.01],["def-melee-*",0.01],["weapon-boomerang",0.01],["burn-time",0.01]],[["def-lightning-^",0.01],["def-lightning-^",0.01],["dmg-range-x",0.01],["weapon-orb",0.01],["def-range-*",0.01],["def-range-+",0.01],["def-melee-+",0.01],["bleed-chance",0.01],["atkSpd",0.01],["stun-chance",0.01],["def-lightning-x",0.01],["leech-chance",0.01],["dmg-range-x",0.01],["leech-chance",0.01],["dmg-lightning-^",0.01],["dmg-magic-*",0.01],["weapon-sword",0.01],["weapon-crossbow",0.01],["def-range-^",0.01],["leech-chance",0.01]],[["weapon-spear",0.01],["knock-magn",0.01],["mana-regen",0.01],["dmg-fire-x",0.01],["bleed-chance",0.01],["knock-chance",0.01],["dmg-melee-+",0.01],["knock-chance",0.01],["dmg-range-*",0.01],["def-range-+",0.01],["leech-magn",0.01],["knock-magn",0.01],["def-melee-*",0.01],["weapon-spear",0.01],["def-melee-^",0.01],["knock-time",0.01],["item-quality",0.01],["dmg-lightning-*",0.01],["dmg-lightning-*",0.01],["summon-amount",0.01]],[["atkSpd",0.01],["def-melee-*",0.01],["def-melee-^",0.01],["atkSpd",0.01],["def-cold-^",0.01],["def-cold-x",0.01],["def-melee-*",0.01],["def-lightning-+",0.01],["weapon-wand",0.01],["weapon-sword",0.01],["def-range-+",0.01],["weapon-wand",0.01],["def-fire-x",0.01],["stun-time",0.01],["acc",0.01],["def-cold-+",0.01],["dmg-cold-x",0.01],["mana-regen",0.01],["def-lightning-^",0.01],["acc",0.01]],[["dmg-range-+",0.01],["chill-magn",0.01],["def-range-*",0.01],["knock-magn",0.01],["dmg-lightning-*",0.01],["knock-magn",0.01],["dmg-melee-+",0.01],["burn-time",0.01],["dmg-range-x",0.01],["acc",0.01],["stun-magn",0.01],["def-lightning-+",0.01],["summon-time",0.01],["item-quality",0.01],["chill-magn",0.01],["def-range-+",0.01],["def-magic-x",0.01],["weapon-staff",0.01],["item-quantity",0.01],["dmg-range-^",0.01]],[["dmg-range-*",0.01],["dmg-lightning-+",0.01],["weapon-staff",0.01],["summon-time",0.01],["summon-time",0.01],["weapon-wand",0.01],["knock-chance",0.01],["dmg-magic-x",0.01],["summon-amount",0.01],["hp-max",0.01],["dmg-range-^",0.01],["mana-max",0.01],["leech-chance",0.01],["dmg-melee-x",0.01],["dmg-melee-x",0.01],["weapon-spear",0.01],["mana-max",0.01],["weapon-crossbow",0.01],["weapon-mace",0.01],["weapon-orb",0.01]],[["dmg-range-^",0.01],["burn-magn",0.01],["dmg-range-^",0.01],["bullet-spd",0.01],["item-quantity",0.01],["def-lightning-x",0.01],["chill-time",0.01],["dmg-lightning-^",0.01],["def-lightning-+",0.01],["maxSpd",0.01],["summon-amount",0.01],["mana-regen",0.01],["dmg-magic-+",0.01],["mana-max",0.01],["dmg-cold-x",0.01],["def-cold-x",0.01],["acc",0.01],["summon-amount",0.01],["weapon-orb",0.01],["dmg-magic-*",0.01]],[["def-fire-^",0.01],["burn-time",0.01],["def-melee-x",0.01],["def-lightning-+",0.01],["summon-atk",0.01],		["dmg-melee-+",0.01],["dmg-melee-^",0.01],["strike-range",0.01],["def-fire-x",0.01],["dmg-melee-x",0.01],["item-rarity",0.01],["dmg-range-+",0.01],["acc",0.01],["dmg-cold-^",0.01],["dmg-lightning-*",0.01],["weapon-staff",0.01],["chill-chance",0.01],["bullet-spd",0.01],["knock-chance",0.01],["maxSpd",0.01]]]	
		//15x15
		[
			[["def-cold-*",0.02],["def-magic-+",0.02],["mana-regen",0.02],["summon-amount",0.02],["weapon-orb",0.02],["dmg-magic-*",0.02],["def-fire-^",0.02],["dmg-magic-*",0.02],["def-cold-*",0.02],["hp-regen",0.02],["knock-magn",0.02],["strike-maxHit",0.25],["chill-magn",0.02],["dmg-cold-^",0.02],["def-range-^",0.02]],
			[["bullet-amount",0.02],["summon-amount",0.02],["dmg-melee-x",0.02],["dmg-fire-x",0.02],["def-melee-*",0.02],["dmg-melee-^",0.02],["hp-regen",0.02],["dmg-range-*",0.02],["dmg-magic-^",0.02],["def-fire-+",0.02],["pickRadius",0.02],["hp-max",0.02],["def-melee-*",0.02],["weapon-boomerang",0.02],["burn-time",0.02]],
			[["weapon-staff",0.02],["custom-ability-Qsystem-player-healSlowCast",0.02],["stun-magn",0.02],["mana-max",0.02],["dmg-cold-x",0.02],["def-cold-x",0.02],["acc",0.02],["leech-chance",0.02],["def-cold-*",0.02],["bleed-time",0.02],["def-lightning-+",0.02],["strike-size",0.02],["atkSpd",0.02],["custom-ability-Qsystem-player-dodgeLife",0.02],["atkSpd",0.02]],
			[["def-cold-x",0.02],["dmg-cold-^",0.02],["def-cold-*",0.02],["burn-time",0.02],["custom-ability-Qsystem-player-healCost",0.02],["def-lightning-+",0.02],["summon-atk",0.02],["acc",0.02],["def-lightning-^",0.02],["def-lightning-^",0.02],["dmg-melee-*",0.02],["maxSpd",0.02],["def-melee-x",0.02],["strike-range",0.02],["dmg-cold-*",0.02]],
			[["def-range-+",0.02],["def-melee-+",0.02],["custom-ability-Qsystem-player-meleeBig",0.02],["atkSpd",0.02],["stun-chance",0.02],["def-lightning-x",0.02],["leech-chance",0.02],["dmg-range-x",0.02],["leech-chance",0.02],["dmg-lightning-^",0.02],["dmg-magic-*",0.02],["weapon-sword",0.02],["weapon-crossbow",0.02],["def-range-^",0.02],["leech-chance",0.02]],
			[["knock-chance",0.02],["dmg-melee-+",0.02],["knock-chance",0.02],["dmg-range-*",0.02],["def-range-+",0.02],["leech-magn",0.02],["knock-magn",0.02],["def-melee-*",0.02],["custom-ability-Qsystem-player-lightningBullet",0.02],["def-melee-^",0.02],["knock-time",0.02],["item-quality",0.02],["dmg-lightning-*",0.02],["dmg-lightning-*",0.02],["summon-amount",0.02]],
		
			[["dmg-cold-x",0.02],["def-lightning-^",0.02],["chill-time",0.02],["chill-time",0.02],["knock-time",0.02],
			["custom-ability-Qsystem-player-fireBullet",0.02],	//special
				["dmg-melee-+",0.02],["atkSpd",0.02],["drain-chance",0.02],	//replaced by freeby
			["mana-max",0.02],["def-melee-*",0.02],["acc",0.02],["dmg-melee-*",0.02],["dmg-lightning-*",0.02],["strike-size",0.02]],
			
			[["dmg-melee-+",0.02],["atkSpd",0.02],["drain-chance",0.02],["weapon-boomerang",0.02],["def-cold-+",0.02],["drain-magn",0.02],
				["dmg-melee-+",0.02],["atkSpd",0.02],["drain-chance",0.02], //replaced by freeby
			["dmg-range-^",0.02],["def-fire-^",0.02],["def-range-x",0.02],["def-melee-^",0.02],["weapon-crossbow",0.02],["def-magic-x",0.02]],
			
			[["drain-time",0.02],["custom-ability-Qsystem-player-magicBullet",0.02],["hp-regen",0.02],["def-fire-+",0.02],["def-range-*",0.02],["bleed-chance",0.02],
				["dmg-melee-+",0.02],["atkSpd",0.02],["drain-chance",0.02], //replaced by freeby
			["def-lightning-+",0.02],["def-magic-*",0.02],["custom-ability-Qsystem-player-lightningBomb",0.02],["hp-max",0.02],["knock-chance",0.02],["def-melee-*",0.02]],
			
			
			[["hp-regen",0.02],["burn-time",0.02],["def-cold-x",0.02],["weapon-crossbow",0.02],["def-melee-^",0.02],["custom-ability-Qsystem-player-coldBullet",0.02],["def-melee-x",0.02],["def-range-x",0.02],["dmg-magic-+",0.02],["weapon-bow",0.02],["bullet-spd",0.02],["def-fire-*",0.02],["dmg-fire-^",0.02],["dmg-cold-^",0.02],["knock-time",0.02]],
			[["def-magic-x",0.02],["def-cold-*",0.02],["def-lightning-*",0.02],["strike-maxHit",0.25],["def-melee-^",0.02],["dmg-melee-*",0.02],["dmg-cold-^",0.02],["summon-def",0.02],["custom-ability-Qsystem-player-magicBomb",0.02],["bullet-spd",0.02],["def-lightning-+",0.02],["weapon-boomerang",0.02],["knock-time",0.02],["dmg-magic-^",0.02],["dmg-cold-x",0.02]],
			[["strike-maxHit",0.25],["dmg-lightning-x",0.02],["leech-magn",0.02],["custom-ability-Qsystem-player-windKnock",0.02],["def-melee-^",0.02],["def-magic-+",0.02],["dmg-melee-x",0.02],["knock-time",0.02],["dmg-cold-+",0.02],["knock-time",0.02],["chill-magn",0.02],["knock-time",0.02],["custom-ability-Qsystem-player-dodgeFast",0.02],["dmg-magic-^",0.02],["dmg-lightning-x",0.02]],
			[["dmg-range-^",0.02],["custom-ability-Qsystem-player-healFast",0.02],["drain-chance",0.02],["def-range-*",0.02],["bleed-time",0.02],["knock-chance",0.02],["strike-maxHit",0.25],["dmg-melee-x",0.02],["item-quality",0.02],["bullet-spd",0.02],["bullet-spd",0.02],["dmg-magic-^",0.02],["hp-regen",0.02],["def-range-x",0.02],["dmg-lightning-+",0.02]],
			[["knock-chance",0.02],["chill-time",0.02],["leech-magn",0.02],["bleed-chance",0.02],["dmg-melee-*",0.02],["stun-magn",0.02],["dmg-melee-+",0.02],["chill-time",0.02],["dmg-magic-^",0.02],["def-melee-^",0.02],["crit-chance",0.02],["knock-time",0.02],["item-quantity",0.02],["def-melee-*",0.02],["strike-maxHit",0.25]],
			[["burn-time",0.02],["leech-chance",0.02],["dmg-melee-*",0.02],["def-cold-^",0.02],["dmg-cold-*",0.02],["def-magic-^",0.02],["def-magic-*",0.02],["dmg-cold-x",0.02],["bleed-magn",0.02],["dmg-magic-x",0.02],["weapon-sword",0.02],["def-fire-^",0.02],["def-melee-*",0.02],["burn-chance",0.02],["dmg-range-*",0.02]],
		
		]
	);
}
PassiveGrid.template.base.turnObject = function(base){	//turn ['stat',value] into {stat:stat,value:value}
	for(var i = 0 ; i < base.length ; i++){
		for(var j = 0 ; j < base[i].length ; j++){
			var pg = base[i][j];
			if(typeof pg === 'object'){	//aka stat
				base[i][j] = {'stat':pg[0],'value':pg[1]};
			}
		}
	}
	return base;
}


PassiveGrid.setModdedGrid = function(pg){		//at this point, count should be the one from db. count should have average/sum/max already
	//TOFIX test if object (aka not freeby)
	for(var i in pg.count){
		pg.moddedGrid[i] = Tk.deepClone(pg.count[i]);	//grid should have max/min/average
		for(var j in pg.count[i].grid){
			for(var k in pg.count[i].grid[j]){		//i:date, j:x, k:y
				if(typeof pg.base[j][k] !== 'object') continue;
				pg.moddedGrid[i].grid[j][k] = {
					stat:	pg.base[j][k].stat,
					value: 	pg.base[j][k].value * pg.moddedGrid[i].average / pg.count[i].grid[j][k],	//value * average / count
					count:	pg.count[i].grid[j][k]					
				};
			}
		}		
	}
	return pg;

}

PassiveGrid.template.count = function(){
	var tmp = {max:100,min:100,sum:0,option:0,grid:[],average:100};

	for(var i = 0; i < 15; i++){
		tmp.grid[i] = [];
		for(var j = 0; j < 15; j++){
			tmp.grid[i][j] = 100;
		}
	}
	return PassiveGrid.template.count.setInfo(tmp);
}

PassiveGrid.template.count.setInfo = function(count){	//set average, sum, min
	count.sum = 0;
	count.min = 10000;
	count.max = 0;
	count.option = 0;
	for(var i in count.grid){
		for(var j in count.grid[i]){
			count.option++;
			count.max = Math.max(count.max,count.grid[i][j]);
			count.min = Math.min(count.min,count.grid[i][j]);
			count.sum += count.grid[i][j];
		}
	}
	count.average = count.sum/count.option;
	return count;
}

var Passive = exports.Passive = {};
Passive.randomStat = function(good){
	var good = ["maxSpd","acc","hp-regen","mana-regen","hp-max","mana-max","leech-magn","leech-chance","pickRadius","item-quantity","item-quality","item-rarity","atkSpd","crit-chance","crit-magn","bullet-amount","bullet-spd","strike-range","strike-size","strike-maxHit","burn-time","burn-magn","burn-chance","chill-time","chill-magn","chill-chance","stun-time","stun-magn","stun-chance","bleed-time","bleed-magn","bleed-chance","drain-time","drain-magn","drain-chance","knock-time","knock-magn","knock-chance","def-melee-+","def-melee-*","def-melee-^","def-melee-x","def-range-+","def-range-*","def-range-^","def-range-x","def-magic-+","def-magic-*","def-magic-^","def-magic-x","def-fire-+","def-fire-*","def-fire-^","def-fire-x","def-cold-+","def-cold-*","def-cold-^","def-cold-x","def-lightning-+","def-lightning-*","def-lightning-^","def-lightning-x","dmg-melee-+","dmg-melee-*","dmg-melee-^","dmg-melee-x","dmg-range-+","dmg-range-*","dmg-range-^","dmg-range-x","dmg-magic-+","dmg-magic-*","dmg-magic-^","dmg-magic-x","dmg-fire-+","dmg-fire-*","dmg-fire-^","dmg-fire-x","dmg-cold-+","dmg-cold-*","dmg-cold-^","dmg-cold-x","dmg-lightning-+","dmg-lightning-*","dmg-lightning-^","dmg-lightning-x","weapon-mace","weapon-spear","weapon-sword","weapon-bow","weapon-boomerang","weapon-crossbow","weapon-wand","weapon-staff","weapon-orb","summon-amount","summon-time","summon-atk","summon-def"];
	return good.random();
}

Passive.updatePt = function(key){
	var mp = List.main[key].passive;
	for(var i in mp.grid){
		mp.usedPt[i] = Passive.getUsedPt(mp.grid[i]);
	}
	mp.usablePt = Passive.getUsablePt(key);
	
	List.main[key].flag.passive = 1;
}

Passive.getUnusedPt = function(key,num){
	num = num || List.main[key].passive.active;
	var p = List.main[key].passive.grid[num];
	return Passive.getUsablePt(key)-Passive.getUsedPt(p);
}

Passive.getUsedPt = function(p){
	var used = 0;
	for(var i in p)
		for(var j = 0; j < p[i].length;j++)
			if(p[i][j] === '1') used++;
	return used;
}

Passive.getUsablePt = function(key){
	var sum = 0; 
	var mq = List.main[key].quest;
	for(var i in mq) sum += mq[i]._rewardPt;
	
	sum += 5;		//TOFIX
	
	if(sum > 25)	sum = 25 + Math.pow(sum-25,0.8);	//diminushing returns
	
	return sum;
}

Passive.getBoost = function(p){	//convert the list of passive owned by player into actual boost.
	var temp = [];
	if(!Db.passiveGrid.moddedGrid[Date.nowDate()]){
		Db.passiveGrid.moddedGrid[Date.nowDate()] = Db.passiveGrid.moddedGrid[Object.keys(Db.passiveGrid.moddedGrid)[0]];
		ERROR(2,'no passivegrid for that date',Date.nowDate());
	}
	var grid = Db.passiveGrid.moddedGrid[Date.nowDate()].grid;	//TOFIX so use freezed one
	
	for(var i = 0 ; i < grid.length ; i++){
		for(var j = 0 ; j < grid[i].length ; j++){
			
			if(p[i][j] == '1' && grid[i][j].stat)	//cuz freeby fucks things
				temp.push({
					'type':'base',
					'value':(Db.stat[grid[i][j].stat].boost.permBase || 1) * grid[i][j].value,
					'stat':grid[i][j].stat
				});
		}
	}
	return Actor.permBoost.stack(temp);
}

Passive.template = function(){
	var grid = [
		'000000000000000',
		'000000000000000',
		'000000000000000',
		'000000000000000',
		'000000000000000',
		'000000000000000',
		'000000222000000',
		'000000222000000',
		'000000222000000',
		'000000000000000',
		'000000000000000',
		'000000000000000',
		'000000000000000',
		'000000000000000',
		'000000000000000',
	];
	return {
		grid:[grid,Tk.deepClone(grid)],
		usablePt:0,
		usedPt:[0,0],
		removePt:10,
		active:0,
		freeze:[null,null],
	}
}

Passive.updateBoost = function(key){
	var act = List.all[key];
	var main = List.main[key];
	Actor.permBoost(act,'Passive',Passive.getBoost(main.passive.grid[main.passive.active]));
}		


//test if player can choose a certain passive
Passive.test = {};
Passive.test.add = function(passive,i,j){
	var n = [Math.max(0,i-1),j];
	var s = [Math.min(Db.passiveGrid.height-1,i+1),j];
	var w = [i,Math.max(0,j-1)];
	var e = [i,Math.min(Db.passiveGrid.width-1,j+1)];
	var pos = [n,s,w,e];
	
	for(var num = 0; num < pos.length; num++){
		var p = passive[pos[num][0]][pos[num][1]];
		if(p === '1' || p === '2'){
			return true;
		}
	}
	return false;	
}

Passive.test.remove = function(passive,yy,xx){
	if(passive[yy][xx] === '2') return false;

	var pass = Tk.deepClone(passive);
	pass[yy] = pass[yy].set(xx,'0');
	
	var listValid = {};
	var listTested = {};	//list where i already checked the pts around and added they to listValid
	var listToTest = {'8-8':1};
	var listNeedToBeValid = {};
	
	for(var i =0; i < pass.length; i++)
		for(var j =0; j < pass[i].length; j++)
			if(pass[i][j] !== '0')
				listNeedToBeValid[i+'-'+j] = 1;
	

	while(Object.keys(listToTest).length){
		for(var i in listToTest){
			var y = +i.slice(0,i.indexOf('-'));
			var x = +i.slice(i.indexOf('-')+1);
			
			var n = [Math.max(0,y-1),x];
			var s = [Math.min(Db.passiveGrid.height-1,y+1),x];
			var w = [y,Math.max(0,x-1)];
			var e = [y,Math.min(Db.passiveGrid.width-1,x+1)];
			
			var pos = [n,s,w,e];
			
			for(var k in pos){
				var p = pass[pos[k][0]][pos[k][1]];	
				var str = pos[k][0] + '-' + pos[k][1];
				if(p === '1' || p === '2'){
					if(!listTested[str])	listToTest[str] = 1;
				}
				listValid[str] = 1;
			}
			
			listTested[i] = 1;
			delete listToTest[i];
		}
	}	
	
	for(var i in listValid){
		delete listNeedToBeValid[i];
	}
	return !Object.keys(listNeedToBeValid).length
	
	
}




/*



[[{"stat":"def-fire-+","value":1,"count":100},
{"stat":"def-range-*","value":1,"count":100},
{"stat":"bleed-chance","value":1,"count":100},
{"stat":"dmg-melee-*","value":1,"count":100},
{"stat":"def-range-^","value":1,"count":100},
{"stat":"hp-regen","value":1,"count":100},
{"stat":"burn-time","value":1,"count":100},
{"stat":"def-cold-x","value":1,"count":100},
{"stat":"weapon-crossbow","value":1,"count":100},
{"stat":"def-melee-^","value":1,"count":100},
{"stat":"stun-time","value":1,"count":100},
{"stat":"def-melee-x","value":1,"count":100},
{"stat":"def-range-x","value":1,"count":100},
{"stat":"dmg-magic-+","value":1,"count":100},
{"stat":"weapon-bow","value":1,"count":100},
{"stat":"bullet-spd","value":1,"count":100},
{"stat":"def-fire-*","value":1,"count":100},
{"stat":"dmg-fire-^","value":1,"count":100},
{"stat":"dmg-cold-^","value":1,"count":100},
{"stat":"knock-time","value":1,"count":100}],[{"stat":"hp-max","value":1,"count":100},
{"stat":"def-fire-x","value":1,"count":100},
{"stat":"def-melee-x","value":1,"count":100},
{"stat":"dmg-cold-*","value":1,"count":100},
{"stat":"mana-regen","value":1,"count":100},
{"stat":"def-magic-x","value":1,"count":100},
{"stat":"def-cold-*","value":1,"count":100},
{"stat":"def-lightning-*","value":1,"count":100},
{"stat":"strike-maxHit","value":1,"count":100},
{"stat":"def-melee-^","value":1,"count":100},
{"stat":"dmg-melee-*","value":1,"count":100},
{"stat":"dmg-cold-^","value":1,"count":100},
{"stat":"summon-def","value":1,"count":100},
{"stat":"drain-chance","value":1,"count":100},
{"stat":"bullet-spd","value":1,"count":100},
{"stat":"def-lightning-+","value":1,"count":100},
{"stat":"weapon-boomerang","value":1,"count":100},
{"stat":"knock-time","value":1,"count":100},
{"stat":"dmg-magic-^","value":1,"count":100},
{"stat":"dmg-cold-x","value":1,"count":100}],[{"stat":"weapon-sword","value":1,"count":100},
{"stat":"def-cold-x","value":1,"count":100},
{"stat":"dmg-lightning-*","value":1,"count":100},
{"stat":"weapon-sword","value":1,"count":100},
{"stat":"atkSpd","value":1,"count":100},
{"stat":"strike-maxHit","value":1,"count":100},
{"stat":"dmg-lightning-x","value":1,"count":100},
{"stat":"leech-magn","value":1,"count":100},
{"stat":"def-magic-x","value":1,"count":100},
{"stat":"def-melee-^","value":1,"count":100},
{"stat":"def-magic-+","value":1,"count":100},
{"stat":"dmg-melee-x","value":1,"count":100},
{"stat":"knock-time","value":1,"count":100},
{"stat":"weapon-bow","value":1,"count":100},
{"stat":"knock-time","value":1,"count":100},
{"stat":"chill-magn","value":1,"count":100},
{"stat":"knock-time","value":1,"count":100},
{"stat":"dmg-melee-*","value":1,"count":100},
{"stat":"dmg-magic-^","value":1,"count":100},
{"stat":"dmg-lightning-x","value":1,"count":100}],[{"stat":"item-rarity","value":1,"count":100},
{"stat":"drain-chance","value":1,"count":100},
{"stat":"def-magic-+","value":1,"count":100},
{"stat":"bullet-spd","value":1,"count":100},
{"stat":"bullet-spd","value":1,"count":100},
{"stat":"dmg-range-^","value":1,"count":100},
{"stat":"def-fire-*","value":1,"count":100},
{"stat":"leech-chance","value":1,"count":100},
{"stat":"def-range-*","value":1,"count":100},
{"stat":"bleed-time","value":1,"count":100},
{"stat":"knock-chance","value":1,"count":100},
{"stat":"strike-maxHit","value":1,"count":100},
{"stat":"dmg-melee-x","value":1,"count":100},
{"stat":"item-quality","value":1,"count":100},
{"stat":"bullet-spd","value":1,"count":100},
{"stat":"bullet-spd","value":1,"count":100},
{"stat":"dmg-magic-^","value":1,"count":100},
{"stat":"hp-regen","value":1,"count":100},
{"stat":"def-range-x","value":1,"count":100},
{"stat":"dmg-lightning-+","value":1,"count":100}],[{"stat":"def-lightning-*","value":1,"count":100},
{"stat":"bleed-time","value":1,"count":100},
{"stat":"leech-chance","value":1,"count":100},
{"stat":"mana-max","value":1,"count":100},
{"stat":"def-cold-+","value":1,"count":100},
{"stat":"knock-chance","value":1,"count":100},
{"stat":"chill-time","value":1,"count":100},
{"stat":"leech-magn","value":1,"count":100},
{"stat":"bleed-chance","value":1,"count":100},
{"stat":"dmg-melee-*","value":1,"count":100},
{"stat":"stun-magn","value":1,"count":100},
{"stat":"dmg-melee-+","value":1,"count":100},
{"stat":"chill-time","value":1,"count":100},
{"stat":"dmg-magic-^","value":1,"count":100},
{"stat":"def-melee-^","value":1,"count":100},
{"stat":"crit-chance","value":1,"count":100},
{"stat":"knock-time","value":1,"count":100},
{"stat":"item-quantity","value":1,"count":100},
{"stat":"def-melee-*","value":1,"count":100},
{"stat":"strike-maxHit","value":1,"count":100}],[{"stat":"mana-max","value":1,"count":100},
{"stat":"dmg-melee-^","value":1,"count":100},
{"stat":"dmg-lightning-*","value":1,"count":100},
{"stat":"def-cold-^","value":1,"count":100},
{"stat":"summon-def","value":1,"count":100},
{"stat":"burn-time","value":1,"count":100},
{"stat":"leech-chance","value":1,"count":100},
{"stat":"dmg-melee-*","value":1,"count":100},
{"stat":"def-cold-^","value":1,"count":100},
{"stat":"dmg-cold-*","value":1,"count":100},
{"stat":"def-magic-^","value":1,"count":100},
{"stat":"def-magic-*","value":1,"count":100},
{"stat":"dmg-cold-x","value":1,"count":100},
{"stat":"bleed-magn","value":1,"count":100},
{"stat":"dmg-magic-x","value":1,"count":100},
{"stat":"weapon-sword","value":1,"count":100},
{"stat":"def-fire-^","value":1,"count":100},
{"stat":"def-melee-*","value":1,"count":100},
{"stat":"burn-chance","value":1,"count":100},
{"stat":"dmg-range-*","value":1,"count":100}],[{"stat":"dmg-melee-^","value":1,"count":100},
{"stat":"def-range-+","value":1,"count":100},
{"stat":"stun-magn","value":1,"count":100},
{"stat":"weapon-wand","value":1,"count":100},
{"stat":"dmg-cold-^","value":1,"count":100},
{"stat":"dmg-cold-x","value":1,"count":100},
{"stat":"def-lightning-^","value":1,"count":100},
{"stat":"chill-time","value":1,"count":100},
{"stat":"chill-time","value":1,"count":100},
{"stat":"knock-time","value":1,"count":100},
{"stat":"stun-time","value":1,"count":100},
{"stat":"def-range-x","value":1,"count":100},
{"stat":"chill-time","value":1,"count":100},
{"stat":"def-lightning-^","value":1,"count":100},
{"stat":"mana-max","value":1,"count":100},
{"stat":"def-melee-*","value":1,"count":100},
{"stat":"acc","value":1,"count":100},
{"stat":"dmg-melee-*","value":1,"count":100},
{"stat":"dmg-lightning-*","value":1,"count":100},
{"stat":"strike-size","value":1,"count":100}],[{"stat":"burn-time","value":1,"count":100},
{"stat":"item-quality","value":1,"count":100},
{"stat":"dmg-magic-+","value":1,"count":100},
{"stat":"dmg-fire-+","value":1,"count":100},
{"stat":"leech-magn","value":1,"count":100},
{"stat":"dmg-melee-+","value":1,"count":100},
{"stat":"atkSpd","value":1,"count":100},
{"stat":"drain-chance","value":1,"count":100},
{"stat":"weapon-boomerang","value":1,"count":100},
{"stat":"def-cold-+","value":1,"count":100},
{"stat":"drain-magn","value":1,"count":100},
{"stat":"dmg-range-+","value":1,"count":100},
{"stat":"dmg-lightning-^","value":1,"count":100},
{"stat":"drain-time","value":1,"count":100},
{"stat":"dmg-range-^","value":1,"count":100},
{"stat":"def-fire-^","value":1,"count":100},
{"stat":"def-range-x","value":1,"count":100},
{"stat":"def-melee-^","value":1,"count":100},
{"stat":"weapon-crossbow","value":1,"count":100},
{"stat":"def-magic-x","value":1,"count":100}],[{"stat":"burn-time","value":1,"count":100},
{"stat":"def-cold-+","value":1,"count":100},
{"stat":"weapon-boomerang","value":1,"count":100},
{"stat":"item-rarity","value":1,"count":100},
{"stat":"crit-magn","value":1,"count":100},
{"stat":"drain-time","value":1,"count":100},
{"stat":"weapon-wand","value":1,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"stat":"mana-max","value":1,"count":100},
{"stat":"def-magic-x","value":1,"count":100},
{"stat":"def-lightning-+","value":1,"count":100},
{"stat":"def-magic-*","value":1,"count":100},
{"stat":"leech-magn","value":1,"count":100},
{"stat":"hp-max","value":1,"count":100},
{"stat":"knock-chance","value":1,"count":100},
{"stat":"def-melee-*","value":1,"count":100}],[{"stat":"chill-time","value":1,"count":100},
{"stat":"bleed-time","value":1,"count":100},
{"stat":"def-melee-x","value":1,"count":100},
{"stat":"strike-maxHit","value":1,"count":100},
{"stat":"dmg-lightning-^","value":1,"count":100},
{"stat":"weapon-staff","value":1,"count":100},
{"stat":"weapon-sword","value":1,"count":100},
{"stat":"stun-magn","value":1,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"stat":"leech-chance","value":1,"count":100},
{"stat":"def-cold-*","value":1,"count":100},
{"stat":"bleed-time","value":1,"count":100},
{"stat":"def-lightning-+","value":1,"count":100},
{"stat":"strike-size","value":1,"count":100},
{"stat":"atkSpd","value":1,"count":100},
{"stat":"stun-magn","value":1,"count":100},
{"stat":"atkSpd","value":1,"count":100}],[{"stat":"dmg-melee-+","value":1,"count":100},
{"stat":"item-rarity","value":1,"count":100},
{"stat":"dmg-fire-x","value":1,"count":100},
{"stat":"item-quality","value":1,"count":100},
{"stat":"dmg-cold-^","value":1,"count":100},
{"stat":"def-cold-*","value":1,"count":100},
{"stat":"def-magic-+","value":1,"count":100},
{"stat":"mana-regen","value":1,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"stat":"dmg-magic-*","value":1,"count":100},
{"stat":"def-cold-*","value":1,"count":100},
{"stat":"hp-regen","value":1,"count":100},
{"stat":"knock-magn","value":1,"count":100},
{"stat":"strike-maxHit","value":1,"count":100},
{"stat":"chill-magn","value":1,"count":100},
{"stat":"dmg-cold-^","value":1,"count":100},
{"stat":"def-range-^","value":1,"count":100}],[{"stat":"dmg-range-x","value":1,"count":100},
{"stat":"def-fire-^","value":1,"count":100},
{"stat":"def-magic-x","value":1,"count":100},
{"stat":"dmg-cold-x","value":1,"count":100},
{"stat":"drain-chance","value":1,"count":100},
{"stat":"def-cold-x","value":1,"count":100},
{"stat":"dmg-cold-^","value":1,"count":100},
{"stat":"def-cold-*","value":1,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"value":null,"count":100},
{"stat":"acc","value":1,"count":100},
{"stat":"def-lightning-^","value":1,"count":100},
{"stat":"def-lightning-^","value":1,"count":100},
{"stat":"dmg-melee-*","value":1,"count":100},
{"stat":"maxSpd","value":1,"count":100},
{"stat":"def-melee-x","value":1,"count":100},
{"stat":"strike-range","value":1,"count":100},
{"stat":"dmg-cold-*","value":1,"count":100}],[{"stat":"burn-time","value":1,"count":100},
{"stat":"bullet-spd","value":1,"count":100},
{"stat":"pickRadius","value":1,"count":100},
{"stat":"dmg-range-*","value":1,"count":100},
{"stat":"weapon-mace","value":1,"count":100},
{"stat":"bullet-amount","value":1,"count":100},
{"stat":"summon-amount","value":1,"count":100},
{"stat":"dmg-melee-x","value":1,"count":100},
{"stat":"dmg-fire-x","value":1,"count":100},
{"stat":"def-melee-*","value":1,"count":100},
{"stat":"dmg-melee-^","value":1,"count":100},
{"stat":"hp-regen","value":1,"count":100},
{"stat":"dmg-range-*","value":1,"count":100},
{"stat":"dmg-magic-^","value":1,"count":100},
{"stat":"def-fire-+","value":1,"count":100},
{"stat":"pickRadius","value":1,"count":100},
{"stat":"hp-max","value":1,"count":100},
{"stat":"def-melee-*","value":1,"count":100},
{"stat":"weapon-boomerang","value":1,"count":100},
{"stat":"burn-time","value":1,"count":100}],[{"stat":"def-lightning-^","value":1,"count":100},
{"stat":"def-lightning-^","value":1,"count":100},
{"stat":"dmg-range-x","value":1,"count":100},
{"stat":"weapon-orb","value":1,"count":100},
{"stat":"def-range-*","value":1,"count":100},
{"stat":"def-range-+","value":1,"count":100},
{"stat":"def-melee-+","value":1,"count":100},
{"stat":"bleed-chance","value":1,"count":100},
{"stat":"atkSpd","value":1,"count":100},
{"stat":"stun-chance","value":1,"count":100},
{"stat":"def-lightning-x","value":1,"count":100},
{"stat":"leech-chance","value":1,"count":100},
{"stat":"dmg-range-x","value":1,"count":100},
{"stat":"leech-chance","value":1,"count":100},
{"stat":"dmg-lightning-^","value":1,"count":100},
{"stat":"dmg-magic-*","value":1,"count":100},
{"stat":"weapon-sword","value":1,"count":100},
{"stat":"weapon-crossbow","value":1,"count":100},
{"stat":"def-range-^","value":1,"count":100},
{"stat":"leech-chance","value":1,"count":100}],[{"stat":"weapon-spear","value":1,"count":100},
{"stat":"knock-magn","value":1,"count":100},
{"stat":"mana-regen","value":1,"count":100},
{"stat":"dmg-fire-x","value":1,"count":100},
{"stat":"bleed-chance","value":1,"count":100},
{"stat":"knock-chance","value":1,"count":100},
{"stat":"dmg-melee-+","value":1,"count":100},
{"stat":"knock-chance","value":1,"count":100},
{"stat":"dmg-range-*","value":1,"count":100},
{"stat":"def-range-+","value":1,"count":100},
{"stat":"leech-magn","value":1,"count":100},
{"stat":"knock-magn","value":1,"count":100},
{"stat":"def-melee-*","value":1,"count":100},
{"stat":"weapon-spear","value":1,"count":100},
{"stat":"def-melee-^","value":1,"count":100},
{"stat":"knock-time","value":1,"count":100},
{"stat":"item-quality","value":1,"count":100},
{"stat":"dmg-lightning-*","value":1,"count":100},
{"stat":"dmg-lightning-*","value":1,"count":100},
{"stat":"summon-amount","value":1,"count":100}],[{"stat":"atkSpd","value":1,"count":100},
{"stat":"def-melee-*","value":1,"count":100},
{"stat":"def-melee-^","value":1,"count":100},
{"stat":"atkSpd","value":1,"count":100},
{"stat":"def-cold-^","value":1,"count":100},
{"stat":"def-cold-x","value":1,"count":100},
{"stat":"def-melee-*","value":1,"count":100},
{"stat":"def-lightning-+","value":1,"count":100},
{"stat":"weapon-wand","value":1,"count":100},
{"stat":"weapon-sword","value":1,"count":100},
{"stat":"def-range-+","value":1,"count":100},
{"stat":"weapon-wand","value":1,"count":100},
{"stat":"def-fire-x","value":1,"count":100},
{"stat":"stun-time","value":1,"count":100},
{"stat":"acc","value":1,"count":100},
{"stat":"def-cold-+","value":1,"count":100},
{"stat":"dmg-cold-x","value":1,"count":100},
{"stat":"mana-regen","value":1,"count":100},
{"stat":"def-lightning-^","value":1,"count":100},
{"stat":"acc","value":1,"count":100}],[{"stat":"dmg-range-+","value":1,"count":100},
{"stat":"chill-magn","value":1,"count":100},
{"stat":"def-range-*","value":1,"count":100},
{"stat":"knock-magn","value":1,"count":100},
{"stat":"dmg-lightning-*","value":1,"count":100},
{"stat":"knock-magn","value":1,"count":100},
{"stat":"dmg-melee-+","value":1,"count":100},
{"stat":"burn-time","value":1,"count":100},
{"stat":"dmg-range-x","value":1,"count":100},
{"stat":"acc","value":1,"count":100},
{"stat":"stun-magn","value":1,"count":100},
{"stat":"def-lightning-+","value":1,"count":100},
{"stat":"summon-time","value":1,"count":100},
{"stat":"item-quality","value":1,"count":100},
{"stat":"chill-magn","value":1,"count":100},
{"stat":"def-range-+","value":1,"count":100},
{"stat":"def-magic-x","value":1,"count":100},
{"stat":"weapon-staff","value":1,"count":100},
{"stat":"item-quantity","value":1,"count":100},
{"stat":"dmg-range-^","value":1,"count":100}],[{"stat":"dmg-range-*","value":1,"count":100},
{"stat":"dmg-lightning-+","value":1,"count":100},
{"stat":"weapon-staff","value":1,"count":100},
{"stat":"summon-time","value":1,"count":100},
{"stat":"summon-time","value":1,"count":100},
{"stat":"weapon-wand","value":1,"count":100},
{"stat":"knock-chance","value":1,"count":100},
{"stat":"dmg-magic-x","value":1,"count":100},
{"stat":"summon-amount","value":1,"count":100},
{"stat":"hp-max","value":1,"count":100},
{"stat":"dmg-range-^","value":1,"count":100},
{"stat":"mana-max","value":1,"count":100},
{"stat":"leech-chance","value":1,"count":100},
{"stat":"dmg-melee-x","value":1,"count":100},
{"stat":"dmg-melee-x","value":1,"count":100},
{"stat":"weapon-spear","value":1,"count":100},
{"stat":"mana-max","value":1,"count":100},
{"stat":"weapon-crossbow","value":1,"count":100},
{"stat":"weapon-mace","value":1,"count":100},
{"stat":"weapon-orb","value":1,"count":100}],[{"stat":"dmg-range-^","value":1,"count":100},
{"stat":"burn-magn","value":1,"count":100},
{"stat":"dmg-range-^","value":1,"count":100},
{"stat":"bullet-spd","value":1,"count":100},
{"stat":"item-quantity","value":1,"count":100},
{"stat":"def-lightning-x","value":1,"count":100},
{"stat":"chill-time","value":1,"count":100},
{"stat":"dmg-lightning-^","value":1,"count":100},
{"stat":"def-lightning-+","value":1,"count":100},
{"stat":"maxSpd","value":1,"count":100},
{"stat":"summon-amount","value":1,"count":100},
{"stat":"mana-regen","value":1,"count":100},
{"stat":"dmg-magic-+","value":1,"count":100},
{"stat":"mana-max","value":1,"count":100},
{"stat":"dmg-cold-x","value":1,"count":100},
{"stat":"def-cold-x","value":1,"count":100},
{"stat":"acc","value":1,"count":100},
{"stat":"summon-amount","value":1,"count":100},
{"stat":"weapon-orb","value":1,"count":100},
{"stat":"dmg-magic-*","value":1,"count":100}],[{"stat":"def-fire-^","value":1,"count":100},
{"stat":"burn-time","value":1,"count":100},
{"stat":"def-melee-x","value":1,"count":100},
{"stat":"def-lightning-+","value":1,"count":100},
{"stat":"summon-atk","value":1,"count":100},
{"stat":"dmg-melee-+","value":1,"count":100},
{"stat":"dmg-melee-^","value":1,"count":100},
{"stat":"strike-range","value":1,"count":100},
{"stat":"def-fire-x","value":1,"count":100},
{"stat":"dmg-melee-x","value":1,"count":100},
{"stat":"item-rarity","value":1,"count":100},
{"stat":"dmg-range-+","value":1,"count":100},
{"stat":"acc","value":1,"count":100},
{"stat":"dmg-cold-^","value":1,"count":100},
{"stat":"dmg-lightning-*","value":1,"count":100},
{"stat":"weapon-staff","value":1,"count":100},
{"stat":"chill-chance","value":1,"count":100},
{"stat":"bullet-spd","value":1,"count":100},
{"stat":"knock-chance","value":1,"count":100},
{"stat":"maxSpd","value":1,"count":100}]]
*/











