"use strict";
var s = require('./../Quest_exports').init('v1.0','Mtest');
var q = s.quest; var m = s.map; var b = s.boss;

q.map.test2 = function(){
	var map = m.map();
	map.name = "Test";
	map.lvl = 0;
	map.graphic = 'goblinLand';
	map.tileset = 'v1.1';	
	return map;
}

exports.quest = q;
	
		