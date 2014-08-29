//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Tk','Main','Map','Input','Chat','Button','Sprite','Anim'],['Loop','Activelist']));

var Loop = exports.Loop = function(){
	Loop.updateController();
	Loop.actor();
	Loop.player();
	Loop.bullet();
	Loop.main();
	Loop.anim();
	Loop.sfx();
	Loop.input();
	Draw.loop();
	Loop.frame++;
	
	
	if(Input.event.typeNormal()) Input.reset();	
	if(Loop.interval(25)) Loop.offset();
	if(Loop.interval(25)) Loop.test();
	
	if(Loop.interval(500)) $(".ui-tooltip-content").parents('div').remove();	//tooltip not disappearing
	if(Loop.interval(25))	Loop.chatBox();
	
	if(Loop.interval(25))	Loop.partyClan();

	
	Loop.performance();
	
	
}

Loop.frame = 0;
Loop.interval = function(num){
	return Loop.frame % num === 0;
}


Loop.test = function(){
	if(!Game.testing || !main.questActive) return;
	var tmp = {}; var q = main.quest[main.questActive];
	for(var i in q) if(i[0] !== '_') tmp[i] = q[i];
	$("#largeLog")[0].innerHTML = JSON.stringify(tmp);
}

Loop.chatBox = function(){
	for(var i in Chat.receive.addToHtml.list){
		Chat.receive.addToHtml.list[i] -= 25;
		if(Chat.receive.addToHtml.list[i] <= 0){
			var a = $("#" + i);	if(a) a.remove();
			delete Chat.receive.addToHtml.list[i];
		}
	}
}

Loop.offset = function(){
	var off = $('#gameDiv').offset();
	Input.offset = {left:off.left - window.pageXOffset,top:off.top - window.pageYOffset};
}

Loop.interval = function(num){
	return Loop.frame % num === 0;
}

Loop.input = function(){ 
	Input.send(); 
}

Loop.actor = function(){
	for(var i in List.actor){
		Actor.loop(List.actor[i]);
	}
}

Loop.player = function(){
	Actor.loop(player);		
	if(Loop.player.old.permBoost !== player.permBoost){
		Loop.player.old.permBoost = player.permBoost;
		Actor.update.permBoost(player);	
	}
	
	if(!Map.getMap())
		Map.creation(Map.getGraphic());
	
}
Loop.player.old = {};

Loop.bullet = function(){
	for(var i in List.bullet){
		var b = List.bullet[i];
		Sprite.update(b);
		if(b.spd === null || b.sprite.dead) continue;	//spd null if boomerang etc...
		b.x += Tk.cos(b.angle)*b.spd;
		b.y += Tk.sin(b.angle)*b.spd;	
		
	}
}




Loop.performance = function(){
	Loop.performance.clientTime = Date.now() - Receive.startTime;
    if(Loop.frame % Loop.performance.frequence === 0){
        var d = Date.now();	
		Loop.performance.result = Math.round(40*Loop.performance.frequence/(d - Loop.performance.oldtime)*100) + '%';
		
        if(main.pref.displayFPS) Draw.performance();
		Loop.performance.oldtime = d;
		Loop.performance.latency();
    }
};
	
Loop.performance.frequence = 5*1000/40;
Loop.performance.oldtime = Date.now();
Loop.performance.result = '100%';
Loop.performance.clientTime = 0;
Loop.performance.latency = function(){socket.emit('ping', {'send':Date.now()});}
socket.on('ping', function (d) { Loop.performance.latency.time = Date.now() - d.send; });

Loop.partyClan = function(){
	var str = (JSON.stringify(player.party) + main.social.list.clan);
	if(Loop.partyClan.old === str || typeof player.party === 'string') return;
	Loop.partyClan.old = str;
	
	var el = $("#aboveChat")[0];
	el.innerHTML = '';
	
	//Party
	el.appendChild(Draw.icon.html('tab.friend',18,'',function(){
		var option = {'name':'Party','option':[
			{'name':'Join','func':function(){
				Input.add('$party,join,');
			},'param':[]},
			{'name':'Invite','func':function(){
				Input.add('$party,invite,');					
			},'param':[]},
		]};

		Button.creation.optionList(option);
	}));
	
	var str = ' Party "' + (player.party.id || '') + '": ';
	for(var i = 0; i < 10 && i < player.party.list.length; i++){
		if(player.party.list[i] !== player.name)
			str += player.party.list[i] + ', '; 
	}
	if(player.party.list.length >= 10) str += '...';
	
	el.appendChild($('<span> ' + str.slice(0,-1) + '</span>')[0]); 
	
	el.appendChild($('<br>')[0]);
	
	//Clan
	el.appendChild(Draw.icon.html('blessing.wave',18,'',function(){
		var option = {'name':'Clan','option':[
			{'name':'Join','func':function(){
				Input.add('$cc,enter,');
			},'param':[]},
			{'name':'Leave','func':function(){
				Input.add('$cc,leave,');					
			},'param':[]},
			{'name':'Create','func':function(){
				Input.add('$cc,create,');					
			},'param':[]},
		]};

		Button.creation.optionList(option);
	}));
	
	var str = ' Clan: ';
	for(var i in main.social.list.clan){str += main.social.list.clan[i] + '  '; }
	
	el.appendChild($('<span> ' + str + '</span>')[0]); 
	
	//style top still in loop
}
Loop.partyClan.old = '';




Loop.main = function(){
	Main.loop.chrono(main);
}

Loop.anim = function(){
	for(var i in List.anim){
		Anim.loop(List.anim[i]);
	}
}

Loop.sfx = function(){
	for(var i in List.sfx){
		var s = List.sfx[i];
		if(--s.delay <= 0){
			Sfx.play(s);
			Sfx.remove(s);
		}
	}
}

var Activelist = exports.Activelist = {};	//to be same than server
Activelist.removeAny = function(i){
	var id = i.id || i;
	delete List.bullet[id]; 
	delete List.actor[id];
	delete List.drop[id]; 
	delete List.all[id]; 
	delete List.strike[id]; 
}

Actor.loop = function(act){
	Sprite.update(act);
	if(!act.chatHead) return;
	if(--act.chatHead.timer <= 0)	act.chatHead = null;	
}

