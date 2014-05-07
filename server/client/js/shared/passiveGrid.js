if(SERVER) var db = require('./../../../Db');
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
			
			
			Db.passiveGrid = PassiveGrid.setGrid(Db.passiveGrid);	
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
PassiveGrid = {};
PassiveGrid.template = function(){
	var a = {width:20,height:20}
	a.base = PassiveGrid.template.base();
	a.moddedGrid = {};
	a.count = {};
	
	var time = Date.now();
	for(var i = 0 ; i < 30; i++){
		var day = (new Date(time - Cst.DAY*i)).toLocaleDateString();
		a.count[day] = PassiveGrid.template.count();
		a.count[day].date = day;
	}
	
	return a;
}
PassiveGrid.template.base = function(){
	return PassiveGrid.template.base.turnObject(	
		[[["def-fire-+",1],["def-range-*",1],["bleed-chance",1],["dmg-melee-*",1],["def-range-^",1],["hp-regen",1],["burn-time",1],["def-cold-x",1],["weapon-crossbow",1],["def-melee-^",1],["stun-time",1],["def-melee-x",1],["def-range-x",1],["dmg-magic-+",1],["weapon-bow",1],["bullet-spd",1],["def-fire-*",1],["dmg-fire-^",1],["dmg-cold-^",1],["knock-time",1]],[["hp-max",1],["def-fire-x",1],["def-melee-x",1],["dmg-cold-*",1],["mana-regen",1],["def-magic-x",1],["def-cold-*",1],["def-lightning-*",1],["strike-maxHit",1],["def-melee-^",1],["dmg-melee-*",1],["dmg-cold-^",1],["summon-def",1],["drain-chance",1],["bullet-spd",1],["def-lightning-+",1],["weapon-boomerang",1],["knock-time",1],["dmg-magic-^",1],["dmg-cold-x",1]],[["weapon-sword",1],["def-cold-x",1],["dmg-lightning-*",1],["weapon-sword",1],["atkSpd-main",1],["strike-maxHit",1],["dmg-lightning-x",1],["leech-magn",1],["def-magic-x",1],["def-melee-^",1],["def-magic-+",1],["dmg-melee-x",1],["knock-time",1],["weapon-bow",1],["knock-time",1],["chill-magn",1],["knock-time",1],["dmg-melee-*",1],["dmg-magic-^",1],["dmg-lightning-x",1]],[["item-rarity",1],["drain-chance",1],["def-magic-+",1],["bullet-spd",1],["bullet-spd",1],["dmg-range-^",1],["def-fire-*",1],["leech-chance",1],["def-range-*",1],["bleed-time",1],["knock-chance",1],["strike-maxHit",1],["dmg-melee-x",1],["item-quality",1],["bullet-spd",1],["bullet-spd",1],["dmg-magic-^",1],["hp-regen",1],["def-range-x",1],["dmg-lightning-+",1]],[["def-lightning-*",1],["bleed-time",1],["leech-chance",1],["mana-max",1],["def-cold-+",1],["knock-chance",1],["chill-time",1],["leech-magn",1],["bleed-chance",1],["dmg-melee-*",1],["stun-magn",1],["dmg-melee-+",1],["chill-time",1],["dmg-magic-^",1],["def-melee-^",1],["crit-chance",1],["knock-time",1],["item-quantity",1],["def-melee-*",1],["strike-maxHit",1]],[["mana-max",1],["dmg-melee-^",1],["dmg-lightning-*",1],["def-cold-^",1],["summon-def",1],["burn-time",1],["leech-chance",1],["dmg-melee-*",1],["def-cold-^",1],["dmg-cold-*",1],["def-magic-^",1],["def-magic-*",1],["dmg-cold-x",1],["bleed-magn",1],["dmg-magic-x",1],["weapon-sword",1],["def-fire-^",1],["def-melee-*",1],["burn-chance",1],["dmg-range-*",1]],[["dmg-melee-^",1],["def-range-+",1],["stun-magn",1],["weapon-wand",1],["dmg-cold-^",1],["dmg-cold-x",1],["def-lightning-^",1],["chill-time",1],["chill-time",1],["knock-time",1],["stun-time",1],["def-range-x",1],["chill-time",1],["def-lightning-^",1],["mana-max",1],["def-melee-*",1],["acc",1],["dmg-melee-*",1],["dmg-lightning-*",1],["strike-size",1]],[["burn-time",1],["item-quality",1],["dmg-magic-+",1],["dmg-fire-+",1],["leech-magn",1],["dmg-melee-+",1],["atkSpd-main",1],["drain-chance",1],["weapon-boomerang",1],["def-cold-+",1],["drain-magn",1],["dmg-range-+",1],["dmg-lightning-^",1],["drain-time",1],["dmg-range-^",1],["def-fire-^",1],["def-range-x",1],["def-melee-^",1],["weapon-crossbow",1],["def-magic-x",1]],[["burn-time",1],["def-cold-+",1],["weapon-boomerang",1],["item-rarity",1],["crit-magn",1],["drain-time",1],["weapon-wand",1],["hp-regen",1],2,2,2,2,["mana-max",1],["def-magic-x",1],["def-lightning-+",1],["def-magic-*",1],["leech-magn",1],["hp-max",1],["knock-chance",1],["def-melee-*",1]],[["chill-time",1],["bleed-time",1],["def-melee-x",1],["strike-maxHit",1],["dmg-lightning-^",1],["weapon-staff",1],["weapon-sword",1],["stun-magn",1],2,2,2,2,["leech-chance",1],["def-cold-*",1],["bleed-time",1],["def-lightning-+",1],["strike-size",1],["atkSpd-main",1],["stun-magn",1],["atkSpd-main",1]],[["dmg-melee-+",1],["item-rarity",1],["dmg-fire-x",1],["item-quality",1],["dmg-cold-^",1],["def-cold-*",1],["def-magic-+",1],["mana-regen",1],2,2,2,2,["dmg-magic-*",1],["def-cold-*",1],["hp-regen",1],["knock-magn",1],["strike-maxHit",1],["chill-magn",1],["dmg-cold-^",1],["def-range-^",1]],[["dmg-range-x",1],["def-fire-^",1],["def-magic-x",1],["dmg-cold-x",1],["drain-chance",1],["def-cold-x",1],["dmg-cold-^",1],["def-cold-*",1],2,2,2,2,["acc",1],["def-lightning-^",1],["def-lightning-^",1],["dmg-melee-*",1],["maxSpd",1],["def-melee-x",1],["strike-range",1],["dmg-cold-*",1]],[["burn-time",1],["bullet-spd",1],["pickRadius",1],["dmg-range-*",1],["weapon-mace",1],["bullet-amount",1],["summon-amount",1],["dmg-melee-x",1],["dmg-fire-x",1],["def-melee-*",1],["dmg-melee-^",1],["hp-regen",1],["dmg-range-*",1],["dmg-magic-^",1],["def-fire-+",1],["pickRadius",1],["hp-max",1],["def-melee-*",1],["weapon-boomerang",1],["burn-time",1]],[["def-lightning-^",1],["def-lightning-^",1],["dmg-range-x",1],["weapon-orb",1],["def-range-*",1],["def-range-+",1],["def-melee-+",1],["bleed-chance",1],["atkSpd-main",1],["stun-chance",1],["def-lightning-x",1],["leech-chance",1],["dmg-range-x",1],["leech-chance",1],["dmg-lightning-^",1],["dmg-magic-*",1],["weapon-sword",1],["weapon-crossbow",1],["def-range-^",1],["leech-chance",1]],[["weapon-spear",1],["knock-magn",1],["mana-regen",1],["dmg-fire-x",1],["bleed-chance",1],["knock-chance",1],["dmg-melee-+",1],["knock-chance",1],["dmg-range-*",1],["def-range-+",1],["leech-magn",1],["knock-magn",1],["def-melee-*",1],["weapon-spear",1],["def-melee-^",1],["knock-time",1],["item-quality",1],["dmg-lightning-*",1],["dmg-lightning-*",1],["summon-amount",1]],[["atkSpd-main",1],["def-melee-*",1],["def-melee-^",1],["atkSpd-main",1],["def-cold-^",1],["def-cold-x",1],["def-melee-*",1],["def-lightning-+",1],["weapon-wand",1],["weapon-sword",1],["def-range-+",1],["weapon-wand",1],["def-fire-x",1],["stun-time",1],["acc",1],["def-cold-+",1],["dmg-cold-x",1],["mana-regen",1],["def-lightning-^",1],["acc",1]],[["dmg-range-+",1],["chill-magn",1],["def-range-*",1],["knock-magn",1],["dmg-lightning-*",1],["knock-magn",1],["dmg-melee-+",1],["burn-time",1],["dmg-range-x",1],["acc",1],["stun-magn",1],["def-lightning-+",1],["summon-time",1],["item-quality",1],["chill-magn",1],["def-range-+",1],["def-magic-x",1],["weapon-staff",1],["item-quantity",1],["dmg-range-^",1]],[["dmg-range-*",1],["dmg-lightning-+",1],["weapon-staff",1],["summon-time",1],["summon-time",1],["weapon-wand",1],["knock-chance",1],["dmg-magic-x",1],["summon-amount",1],["hp-max",1],["dmg-range-^",1],["mana-max",1],["leech-chance",1],["dmg-melee-x",1],["dmg-melee-x",1],["weapon-spear",1],["mana-max",1],["weapon-crossbow",1],["weapon-mace",1],["weapon-orb",1]],[["dmg-range-^",1],["burn-magn",1],["dmg-range-^",1],["bullet-spd",1],["item-quantity",1],["def-lightning-x",1],["chill-time",1],["dmg-lightning-^",1],["def-lightning-+",1],["maxSpd",1],["summon-amount",1],["mana-regen",1],["dmg-magic-+",1],["mana-max",1],["dmg-cold-x",1],["def-cold-x",1],["acc",1],["summon-amount",1],["weapon-orb",1],["dmg-magic-*",1]],[["def-fire-^",1],["burn-time",1],["def-melee-x",1],["def-lightning-+",1],["summon-atk",1],["dmg-melee-+",1],["dmg-melee-^",1],["strike-range",1],["def-fire-x",1],["dmg-melee-x",1],["item-rarity",1],["dmg-range-+",1],["acc",1],["dmg-cold-^",1],["dmg-lightning-*",1],["weapon-staff",1],["chill-chance",1],["bullet-spd",1],["knock-chance",1],["maxSpd",1]]]	
	);
}
PassiveGrid.template.base.turnObject = function(base){	//turn ['stat',value] into {stat:stat,value:value}
	for(var i = 0 ; i < base.length ; i++){
		for(var j = 0 ; j < base[i].length ; j++){
			var pg = base[i][j];
			if(typeof pg === 'object'){	//aka stat
				//Db.passiveGrid[i][j] = {'stat':Passive.randomStat(),'value':pg[1],'count':100};
				base[i][j] = {'stat':pg[0],'value':pg[1]};
			}
			if(typeof pg === 'string'){	//aka custom
				base[i][j] = {'type':'custom','value':pg};
			}
		}
	}
	return base;
}


PassiveGrid.setGrid = function(pg){		//at this point, count should be the one from db. count should have average/sum/max already
	//TOFIX test if object (aka not freeby)
	for(var i in pg.count){
		
		for(var i in pg.count){
			pg.moddedGrid[i] = Tk.deepClone(pg.count[i]);	//grid should have max/min/average
			for(var j in pg.count[i].grid){
				for(var k in pg.count[i].grid[j]){		//i:date, j:x, k:y
					
					pg.moddedGrid[i].grid[j][k] = {
						stat:	pg.base[j][k].stat,
						value: 	pg.base[j][k].value * pg.moddedGrid[i].average / pg.count[i].grid[j][k],	//value * average / count
						count:	pg.count[i].grid[j][k]					
					};
				}
			}		
		}
	}
	return pg;

}

PassiveGrid.template.count = function(){
	var tmp = {max:100,min:100,sum:0,option:0,grid:[],average:100};

	for(var i = 0; i < 20; i++){
		tmp.grid[i] = [];
		for(var j = 0; j < 20; j++){
			tmp.grid[i][j] = 100;
		}
	}
	return PassiveGrid.template.count.setInfo(tmp);
}

PassiveGrid.template.count.setInfo = function(count){
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

Passive = {};
Passive.randomStat = function(good){
	var good = ["maxSpd","acc","hp-regen","mana-regen","hp-max","mana-max","leech-magn","leech-chance","pickRadius","item-quantity","item-quality","item-rarity","atkSpd-main","crit-chance","crit-magn","bullet-amount","bullet-spd","strike-range","strike-size","strike-maxHit","burn-time","burn-magn","burn-chance","chill-time","chill-magn","chill-chance","stun-time","stun-magn","stun-chance","bleed-time","bleed-magn","bleed-chance","drain-time","drain-magn","drain-chance","knock-time","knock-magn","knock-chance","def-melee-+","def-melee-*","def-melee-^","def-melee-x","def-range-+","def-range-*","def-range-^","def-range-x","def-magic-+","def-magic-*","def-magic-^","def-magic-x","def-fire-+","def-fire-*","def-fire-^","def-fire-x","def-cold-+","def-cold-*","def-cold-^","def-cold-x","def-lightning-+","def-lightning-*","def-lightning-^","def-lightning-x","dmg-melee-+","dmg-melee-*","dmg-melee-^","dmg-melee-x","dmg-range-+","dmg-range-*","dmg-range-^","dmg-range-x","dmg-magic-+","dmg-magic-*","dmg-magic-^","dmg-magic-x","dmg-fire-+","dmg-fire-*","dmg-fire-^","dmg-fire-x","dmg-cold-+","dmg-cold-*","dmg-cold-^","dmg-cold-x","dmg-lightning-+","dmg-lightning-*","dmg-lightning-^","dmg-lightning-x","weapon-mace","weapon-spear","weapon-sword","weapon-bow","weapon-boomerang","weapon-crossbow","weapon-wand","weapon-staff","weapon-orb","summon-amount","summon-time","summon-atk","summon-def"];
	return good.random();
}

Passive.updatePt = function(key){
	var mp = List.main[key].passive;
	for(var i in mp.grid){
		mp.usedPt[i] = Passive.getUsedPt(mp.grid[i]);
	}
	mp.usablePt = Passive.getUsablePt(key);
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
	return Math.floor(sum);
}


Passive.getBoost = function(p){	//convert the list of passive owned by player into actual boost.
	var temp = [];
	var grid = Db.passiveGrid.moddedGrid[Date.nowDate()].grid;	//TOFIX so use freezed one
	
	for(var i = 0 ; i < grid.length ; i++){
		for(var j = 0 ; j < grid[i].length ; j++){
			
			if(p[i][j] == '1' && grid[i][j].stat)	//cuz freeby fucks things
				temp.push({'type':'base','value':grid[i][j].value,'stat':grid[i][j].stat});
			
			/*
			if(p[i][j] == '1' && typeof Db.passiveGrid[i][j] === 'object'){
				if(Db.passiveGrid[i][j].stat){
					temp.push({'type':'base','value':Db.passiveGrid[i][j].value,'stat':Db.passiveGrid[i][j].stat});
				}
				if(Db.passiveGrid[i][j].type === 'custom'){
					temp.push({'type':'custom','value':Db.passiveGrid[i][j].value});
				}
			}
			*/
		}
	}
	return Actor.permBoost.stack(temp);
}



Passive.template = function(){ 
	var grid = [
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000222200000000',
		'00000000222200000000',
		'00000000222200000000',
		'00000000222200000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
		'00000000000000000000',
	];
	return {
		grid:[grid,Tk.deepClone(grid)],
		usablePt:0,
		usedPt:[0,0],
		removePt:0,
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
	
	for(var i in pos){
		var p = passive[pos[i][0]][pos[i][1]];
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
{"stat":"atkSpd-main","value":1,"count":100},
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
{"stat":"atkSpd-main","value":1,"count":100},
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
{"stat":"atkSpd-main","value":1,"count":100},
{"stat":"stun-magn","value":1,"count":100},
{"stat":"atkSpd-main","value":1,"count":100}],[{"stat":"dmg-melee-+","value":1,"count":100},
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
{"stat":"atkSpd-main","value":1,"count":100},
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
{"stat":"summon-amount","value":1,"count":100}],[{"stat":"atkSpd-main","value":1,"count":100},
{"stat":"def-melee-*","value":1,"count":100},
{"stat":"def-melee-^","value":1,"count":100},
{"stat":"atkSpd-main","value":1,"count":100},
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











