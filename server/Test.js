//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Actor','Itemlist','Plan','Chat'],['Test']));
var Test = exports.Test = {};

Test.loop = function(){


}

Test.serverStart = function(){
    
}

Test.no = {
	npc:false,
	attack:false,
};


Test.spawnEnemy = function(key,model){
	model = model || 'Qsystem-bat';
	
	var player = List.all[key];
	if(!Db.npc[model]){ ERROR(4,"no npc",model); return;}
	Actor.creation({
		'spot':{x:player.x,y:player.y,map:player.map},
		"model":model,	
		"extra":{},
	});
}

Test.invincible = function(key){
	if(List.all[key].globalDef < 500){
		Actor.permBoost(List.all[key],'Test.invincible',[
			{stat:'globalDef',value:1000,type:'+'},
			{stat:'globalDmg',value:1000,type:'+'},
		]);	
		Chat.add(key,'Invincible');
	} else {
		Actor.permBoost(List.all[key],'Test.invincible');
		Chat.add(key,'Not Invincible');
	}
}
Test.ghost = function(key){
	if(List.all[key].ghost){
		Actor.permBoost(List.all[key],'Test.ghost');
		Chat.add(key,'Not ghost');
		List.all[key].ghost = 0;
	} else {
		List.all[key].ghost = 1;
		List.all[key].bumper = [0,0,0,0];
		Actor.permBoost(List.all[key],'Test.ghost',[
			{stat:'maxSpd',value:40,type:'+'},
			{stat:'acc',value:40,type:'+'},
		]);	
	}
}

Test.generateEquip = function(key,lvl,maxAmount){
	var act = List.all[key];
	Actor.update.equip(act);
}


Test.removeEquipInventory = function(key){
	for(var i in List.main[key].invList.data){
		var a = List.main[key].invList.data[i];
		if(Db.equip[a[0]]) Itemlist.remove(List.main[key].invList,a[0]);
	}
}

Test.a = function(){
	
}
Test.b = function(){}
Test.c = function(){}
Test.d = function(){}

Test.dmgMod = {player:1,npc:1,pvp:1};
Test.offPvp = function(){

}

Test.aa = function(){
	setInterval(function(){
		var	start = Date.now();
		db.find('main',{username:'rc'},{invList:1},function(err,res){
			INFO(Date.now()-start);
		});
	},25);
}


Test.createPlan = function(key){
	var id = Plan.creation({	//plan
		'rarity':Math.random(),
		'quality':Math.random(),
		'lvl':Actor.getCombatLevel(List.all[key]),
		'category':'equip',
		'minAmount':0,
		'maxAmount':6,
	});
	Itemlist.add(List.main[key].invList,id);
}


var b = {name:'asdasd',age:100,x:123,hp:12,'sprite,name':'sdgsgsdg'}
var c = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
var d = '{"name":"asdasd","age":100,"x":123,"hp":12,"sprite,name":"sdgsgsdg"}';

Test.bb = function(){
	var start = Date.now();
	for(var i in List.socket){
		for(var j = 0 ;j < 10000; j++){
			List.socket[i].emit('asd',JSON.stringify(b).replace(/\"/g,''));
		}
	}
	INFO(Date.now()-start);
	
	var start = Date.now();
	for(var i in List.socket){
		for(var j = 0 ;j < 10000; j++){
			List.socket[i].emit('asd',b);
		}
	}
	INFO(Date.now()-start);
	
	
}

