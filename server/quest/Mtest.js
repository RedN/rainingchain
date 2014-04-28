"use strict";
var s = require('./../Quest_exports').init('v1.0','Mtest');
var q = s.quest;

q.map.test2 = function(){
	var m = s.map();
	m.name = "Test";
	m.lvl = 0;
	m.graphic = 'goblinLand';
	m.tileset = 'v1.1';	
	return m;
}

exports.quest = q;
	
		