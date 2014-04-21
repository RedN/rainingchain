var m = Init.db.map.template();
m.name = "Test";
m.lvl = 0;
m.graphic = 'goblinLand';

var a = m.addon.main = {};
a.load = function(map,spot,v){
	
}

a.loop = function(map,spot,v){
	
}


a.variable = {
	atk:{'type':"bullet",'angle':15,'amount':1, 'aim': 0,'objImg':{'name':"iceshard",'sizeMod':1},'hitImg':{'name':"coldHit",'sizeMod':0.5},
		'dmg':{'main':1,'ratio':{'melee':0,'range':10,'magic':80,'fire':10,'cold':0,'lightning':0}}},	
};
exports.map = function(){ return m; }
		
		