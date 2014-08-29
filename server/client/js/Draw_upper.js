//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Tk','Loop','Map','Input','Button','Command']));

//{State
Draw.state = function(){
	var s = Draw.state.constant();
	
	Draw.state.resource(s);
	s.y += 5;
	Draw.state.ability(s);
	s.y += 30;
	Draw.state.status(s,player.statusClient,player.curseClient,1);
	s.y += 30;
	Draw.chrono(s);
	s.y += 30;
}

Draw.state.constant = function(){
	return {
		x:0,
		y:0,
		w:200,
		h:200,	
	}
}

Draw.state.resource = function (s){ ctxrestore();
	ctx = List.ctx.stage;
		
	var array = [
		{'name':'hp','height':20,'width':s.w},
		{'name':'mana','height':15,'width':s.w},
		// {'name':'heal','height':10,'width':s.w},
		// {'name':'fury','height':10,'width':s.w},
	];
	
	for(var i in array){
		var res = array[i];
		Draw.state.resource.bar(s.x+5,s.y+5,res.width,res.height,res.name);
		
		Button.creation(0,{
			'rect':[s.x+5,s.x+5+res.width,s.y+5,s.y+5+res.height],
			'text':res.name.capitalize() + ': ' + player[res.name] + '/' + player.resource[res.name].max,
		});		
		s.y += res.height + 3;
						
	}	
}

Draw.state.resource.bar = function(numX,numY,w,h,name){	ctxrestore();
	ctx = List.ctx.stage;
	
	var ratio = Math.min(Math.max(player[name]/player.resource[name].max,0),1);
	
	ctx.fillStyle = CST.resource.toColor[name];
	ctx.strokeStyle= "black";
	ctx.roundRect(numX,numY,w,h,false,1,4);	//empty
	ctx.roundRect(numX,numY,w*ratio,h,1,1,4);			//filled
		
	ctxrestore();
}

Draw.state.status = function(s,status,curse,showtext){ ctxrestore();		//also use over head
	ctx = List.ctx.stage;
	var numX = s.x+10;		
	for(var i in status){
		if(+status[i]){
			var text = showtext ? CST.status.list[i].capitalize() : "";	
			Draw.icon('status.' + CST.status.list[i],numX,s.y,24,text);
			numX += 30;
		}
	}
	
	for(var i in curse){
		var value = curse[i];
		if(value[1] === '-') value = value.slice(1);
		
		var text = showtext ? Db.stat[i].name + ':' + value : "";	
		Draw.icon(Db.stat[i].icon,numX,s.y,24,text);
		numX += 30;
	}
}






Draw.state.ability = function(s){ ctxrestore();
	ctx = List.ctx.stage;
	
	var size = 25;
		
	for(var i in player.ability){
		var str = Input.key.ability[i][0].toString().keyCodeToName().keyCodeToName(true);
		var numX = s.x + 10 + (+i * (size + 5));
		var numY = s.y;
		
		if(!player.ability[i]){
			Draw.icon('system.square',numX,numY,size,{
				text:str,
				left:{ func:function(num){ 
					if(Draw.state.ability.click === false)
						Draw.state.ability.click = num; 
					else Draw.state.ability.click = false;
				},param:[+i]},
			});
			continue;
		}
		
		var ab =  Db.query('ability',player.ability[i]);
		if(!ab) continue;
		
		var charge = player.abilityChange.chargeClient[i];
		
		if(charge !== 1) ctx.globalAlpha = 0.5;
		Draw.icon(ab.icon,numX,numY,size,{
			text:str + ': ' + ab.name,
			left:{ func:function(num){ 
				if(Draw.state.ability.click === false)
					Draw.state.ability.click = num; 
				else Draw.state.ability.click = false;
			},param:[+i]},
		});
		ctx.globalAlpha = 1;
		
		if(Input.press.ability[i]){
			ctx.strokeStyle = 'white';
			ctx.strokeRect(numX,numY,size,size);
			ctx.strokeStyle = 'black';			
		}
		
		if(charge !== 1){	//loading circle
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = 'red';

			ctx.beginPath();
			ctx.moveTo(numX+size/2,numY+size/2);
			ctx.arc(numX+size/2,numY+size/2,size/2,-Math.PI/2,-Math.PI/2 + charge*2*Math.PI);
			ctx.lineTo(numX+size/2,numY+size/2);
			ctx.closePath();
			ctx.fill();
			
			ctx.globalAlpha = 1;
		}
	}
		
	if(typeof Draw.state.ability.click === 'number')
		Draw.state.ability.drawList(s,Draw.state.ability.click,size);
	
}
Draw.state.ability.click = false;

Draw.state.ability.drawList = function(s,num,size){
	var count = 0;
	var numX = s.x + 10 + (num * (size + 5));
	for(var i in player.abilityList){
		var ab =  Db.query('ability',i);
		if(!ab) continue;
		if(num === 4 && ab.type !== 'heal') continue;
		if(num === 5 && ab.type !== 'dodge') continue;
		count++;
		var numY = s.y + (size + 5)*count;
		Draw.icon(ab.icon,numX,numY,size,{
			text:"Assign to " + ab.name,
			left:{ func:function(id){ Draw.state.ability.drawList.click(id); },param:[i]},
		});
	}
}	
Draw.state.ability.drawList.click = function(name){
	Command.send('win,ability,swap,' + name + ',' + Draw.state.ability.click);
	Draw.state.ability.click = false;
}

//}

Draw.chrono = function(s){
	for(var i in main.chrono){
		if(main.chrono[i].visible === false) continue;
		
		var str = main.chrono[i].time.frameToChrono();
		
		ctx.fillStyle = main.chrono[i].active ? 'white' : 'red';
		ctx.setFont(30);
		ctx.fillText(str,s.x+10,s.y);
		
		var right = null;
		if(main.chrono[i]) right = {func: Command.send,param:['chrono,remove,' + i]};
		
		Button.creation(0,{
			'rect':[s.x+10,s.x+160,s.y,s.y+30],
			'text':main.chrono[i].text + (main.chrono[i].active ? '' : ' - Right-Click to remove'),
			'right':right,
		});	
		
		s.y += 35;		
	}
	ctx.fillStyle = 'black';
}


//{Minimap
Draw.minimap = function (){ ctxrestore();
	ctx = List.ctx.minimap;
	ctx.clearRect(0, 0, CST.WIDTH, CST.HEIGHT);
	Draw.minimap.map();
	Draw.minimap.icon();
	Draw.minimap.below();
}
Draw.minimap.zoom = 16;

Draw.minimap.map = function(){
	var x = -(player.x)/Draw.minimap.zoom + CST.WIDTH2/main.pref.mapRatio;	
	var y = -(player.y)/Draw.minimap.zoom + CST.HEIGHT2/main.pref.mapRatio;	
	ctx.drawImage(Map.getMap().img.m, x,y);
	
	
	//TODO add name
}

Draw.minimap.map.updateSize = function(){
	$("#minimapCanvas").css({
		left:CST.WIDTH-CST.WIDTH/main.pref.mapRatio,
		width:CST.WIDTH/main.pref.mapRatio,
		height:CST.HEIGHT/main.pref.mapRatio,
	});
	$("#minimapCanvas")[0].width = CST.WIDTH/main.pref.mapRatio;	//not same than style.width
	$("#minimapCanvas")[0].height = CST.HEIGHT/main.pref.mapRatio;
	
	//minimapBelow
	$("#minimapBelow").css({
		left:CST.WIDTH-CST.WIDTH/main.pref.mapRatio,
		width:CST.WIDTH/main.pref.mapRatio,
		height:30,
		top:CST.HEIGHT/main.pref.mapRatio,	//height of map
		fontFamily:'Kelly Slab',
		fontSize:'20px',
		whiteSpace:'normal',
		color:'white',
		backgroundColor:"rgba(0,0,0,0.5)",
		borderStyle:"solid",
		borderWidth:"2px",
		borderColor:"black",

	});
	
	//Perf
	$("#performanceDiv").css({
		left:CST.WIDTH-CST.WIDTH/main.pref.mapRatio-50,
		width:50,
		height:30,
		fontFamily:'Kelly Slab',
		fontSize:'20px',
		whiteSpace:'normal',
		color:'white',
	});
}

Draw.minimap.icon = function(){
	var cx = CST.WIDTH2/main.pref.mapRatio-2;
	var cy = CST.HEIGHT2/main.pref.mapRatio-2;
	
	for(var i in List.actor){
		var m = List.actor[i];
		if(!m.minimapIcon) continue;
		
		var vx = m.x - player.x;
		var vy = m.y - player.y;
		
		var numX = cx+vx/Draw.minimap.zoom;
		var numY = cy+vy/Draw.minimap.zoom;
		
		if(m.type === 'player' && main.social.list.friend[m.id]) m.minimapIcon = 'color.purple';
		
		var size = m.minimapIcon.have('color') ? 6 : 16;
		Draw.icon(m.minimapIcon,numX-size/2,numY-size/2,size);
	}
	
	ctx.fillRect(1280/2/main.pref.mapRatio-2,720/2/main.pref.mapRatio-2,4,4);	//player icon
}
Draw.minimap.below = function(){
	if(typeof player === 'undefined') return;	//TOFIX cuz on login, player doesnt exist...
	Draw.setInnerHTML($("#minimapMap")[0],Db.mapNameConvert[player.map].name);
}
Draw.minimap.below.change = function(num){
	Command.send('pref,mapRatio,' + (main.pref.mapRatio + num));
}
//}



Draw.hint = function(){
	var text = '<span title="Active a quest via the Quest Tab">No Active Quest</span>';
	if(main.questActive) text = '<span title="Hint for Active Quest: ' + Db.questNameConvert[main.questActive] + '">Hint: ' + Chat.receive.parseInput(main.quest[main.questActive]._hint) + '</span>';
	//could only parseInput once...
	
	if(Draw.setInnerHTML($("#hintDiv")[0],text) && (main.questActive === 'Qtutorial')){
		Draw.arrow.add({x:1035,"y":172,id:'hint',side:'right',time:25*2});
	}
}


Draw.performance = function(){
	var text = '<span title="Ping: ' + Loop.performance.latency.time + 'ms | Client Lag:' + Tk.round(Loop.performance.clientTime/40*100,0) + '%">' + Loop.performance.result + '</span>';
	Draw.setInnerHTML($("#performanceDiv")[0],text);
}












