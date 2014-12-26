(function(){ //}

Dialog.UI('resourceBar',{
	position:'absolute',
	left:2,
	top:2,
	width:200,
	height:50,
	//padding:'0px 0px',
},function(html){
	if(main.hudState.hp !== Main.hudState.INVISIBLE){
		var hp = Math.min(player.hp,player.hpMax);
		var pct = Math.round(hp/player.hpMax*100)+"%";
		var title = 'Hp: ' + hp + ' / ' + player.hpMax;
		var bar = $("<div>")
		.css({background:'rgba(0,0,0,1)',border:'1px solid black',borderRadius:'3px',padding:'2px'})
		.attr('title',title)
		.append($("<div>")
			.css({backgroundColor:'red',width:pct,height:'15px',borderRadius:'2px'})
			.attr('title',title)
		);
		html.append(bar);
	}
	//######################
	if(main.hudState.mana !== Main.hudState.INVISIBLE){
		var pct = Math.round(player.mana/player.manaMax*100)+"%";
		var title = 'Mana: ' + player.mana + ' / ' + player.manaMax;
		var bar = $("<div>")
		.css({background:'rgba(0,0,0,1)',border:'1px solid black',borderRadius:'3px',padding:'2px'})
		.attr('title',title)
		.append($("<div>")
			.css({backgroundColor:'#2222FF',width:pct,height:'8px',borderRadius:'2px'})
			.attr('title',title)
		);
		html.append(bar);
	}
},function(){
	return '' + player.hp + player.hpMax + player.mana + player.manaMax + main.hudState.hp + main.hudState.mana;
},2);

//####################

Dialog.UI('abilityBar',{
	position:'absolute',
	left:2,
	top:2+35,
	width:200,
	height:35,
	//padding:'0px 0px',
},function(html){
	if(main.hudState.abilityBar === Main.hudState.INVISIBLE) return
	
	
	var array = [];
	var size = 28;
	var ability = Actor.getAbility(player);
	for(var i = 0; i < ability.length; i++){
		var str = Input.getKeyName('ability',i,true);
		if(!ability[i]){
			array.push(Img.drawIcon.html(null,size,str));
			continue;
		}
		var ab = QueryDb.get('ability',ability[i],function(){
			Dialog.refresh('abilityBar');
		});
		if(!ab){
			array.push(Img.drawIcon.html(null,size,str));
			continue;
		}
		
		
		var charge = player.abilityChange.chargeClient[i];
		var alpha = charge === 1 ? 1 : 0.5;
		var icon = Img.drawIcon.html(ab.icon,size,str,null,null,alpha);
		
		if(Input.isPressed('ability',i))
			icon.css({border:'1px solid white'});
		
		if(charge !== 1){	//loading circle
			var ctx = icon[0].getContext("2d")
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = 'red';

			ctx.beginPath();
			ctx.moveTo(size/2,size/2);
			ctx.arc(size/2,size/2,size/2,-Math.PI/2,-Math.PI/2 + charge*2*Math.PI);
			ctx.lineTo(size/2,size/2);
			ctx.closePath();
			ctx.fill();
		}
		array.push(icon);
	}
	
	
	var table = Tk.arrayToTable([array],false,false,false,'2px');//.addClass('center')
	html.append(table);	
},function(){
	return Tk.stringify(player.ability) + Tk.stringify(player.abilityChange.chargeClient) + main.hudState.abilityBar;
},3);

//####################

Dialog.UI('curseClient',{
	position:'absolute',
	left:5,
	top:2+35+35,
	width:200,
	height:30,
},function(html){
	if(main.hudState.curseClient === Main.hudState.INVISIBLE) return
	
	for(var i in player.curseClient){
		var stat = Stat.get(i);
		html.append(Img.drawIcon.html(stat.icon,28,player.curseClient[i] + ' ' + stat.name));
		html.append(' ');
	}
},function(){
	return Tk.stringify(player.curseClient) + main.hudState.curseClient;
},3);

//####################

Dialog.UI('chrono',{
	position:'absolute',
	left:2,
	top:2+35+35+50,
},function(html){
	for(var i in main.chrono){
		if(main.chrono[i].visible === false) continue;
				
		html.append($('<span>')
			.html(main.chrono[i].time.frameToChrono())
			.css({color:main.chrono[i].active ? 'white' : 'red',font:'1.5em Kelly Slab'})
			.attr('title',main.chrono[i].text + (main.chrono[i].active ? '' : ' - Click to remove'))
			.bind('contextmenu',(function(i){
				return function(){
					if(main.chrono[i])
						Command.execute('chrono,remove',[i]);
				}			
			})(i))
		);
		html.append('<br>');
	}
},function(){
	return Tk.stringify(main.chrono);
},3);











})();



