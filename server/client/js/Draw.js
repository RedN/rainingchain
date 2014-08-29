//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Tk','Loop','Map','Input','Chat','Collision','Button','Command'],['Draw']));

var Draw = exports.Draw = {};
Draw.old = {'fl':'','quest':'','abilityShowed':'start-melee','abilityTypeShowed':'all','abilitySub':''};
Draw.refresh = {};

Draw.loop = function(){
	//Clear
	for(var i in List.ctx){
		if(i === 'minimap') continue;	//managed  in Draw.minimap
		//if(i === 'passiveGrid') continue;	//managed  in Draw.window.passive.grid
		List.ctx[i].clearRect(0, 0, CST.WIDTH, CST.HEIGHT);
	}
	Draw.loop.visibility();
	
	
	List.btn = [];
	Input.event.mouse.drag.update();
	
	//Draw
	Draw.map('b');   //below player
	Draw.anim('b');  //below player
	Draw.drop();
	Draw.strike();
	Draw.actor();
	Draw.bullet();
	Draw.anim('a');  //above player
	Draw.map('a');   //above player
	Draw.actor.chatHead();
	Draw.expPopup();
	Draw.arrow.loop();
	Draw.screenEffect(main.screenEffect);
		
	if(!main.hideHUD.tab) Draw.tab();     //bottom right
	if(!main.hideHUD.chat) Draw.chat();    //bottom left

	if(!main.hideHUD.window) Draw.window();
	if(!main.hideHUD.popup) Draw.popup();
	
	if(!main.hideHUD.minimap && Loop.interval(3)) Draw.minimap();
	if(!main.hideHUD.state) Draw.state();

	Draw.logout();
	Draw.optionList();    //option when right-click

	Button.context();	//update for client buttons only
	Draw.context();     //top left
	Draw.hint();
	Draw.command();			
}

Draw.loop.visibility = function(){	
	for(var i in html){ 
		if(i[0] === '$') continue;
		if(!Draw.loop.visibility.test[i]){ html[i].div.style.visibility = 'hidden'; continue; }
		
		if(Draw.loop.visibility.test[i]() && html[i].div.style.visibility !== 'visible'){	//aka true
			html[i].div.style.visibility = 'visible'
		}
		if(!Draw.loop.visibility.test[i]() && html[i].div.style.visibility !== 'hidden'){	//aka true
			html[i].div.style.visibility = 'hidden'
		}
	}
}

Draw.loop.visibility.test = {
	warning:function(){	return true;},
	map:function(){ return true; },
	pm:function(){ return true; },
	highscoreWin:function(){ return !!main.windowList.highscore; },
	chat:function(){ return !main.dialogue; },
	dialogue:function(){ return !!main.dialogue; },
}

Draw.map = function (layer){ ctxrestore();
	var SIZEFACT = Draw.map.cst.sizeFact;	

	ctx = List.ctx.stage;
	var map = Map.getMap();
	
	var IMAGERATIO = Draw.map.cst.imageRatio;
	var iw = CST.WIDTH / IMAGERATIO;
	var ih = CST.HEIGHT / IMAGERATIO;
	var mapAmount = IMAGERATIO/2+1;		//ex: ratio=4 => 2x2 maps makes whole screen => 3x3 to see everything if player is middle
	
	var startX = (player.x-CST.WIDTH/2)/SIZEFACT;		//top right of screen in map ratio
	var startY = (player.y-CST.HEIGHT/2)/SIZEFACT;
	
	var offsetX = -(startX % iw);				//offset where we need to draw first map
	var offsetY = -(startY % ih);
	
	if(startX < 0) offsetX -= iw;		//if negative, fucks the modulo
	if(startY < 0) offsetY -= ih;
	
	for(var i = 0; i < mapAmount; i++){
		for(var j = 0; j < mapAmount; j++){
			var mapX = Math.floor(startX/iw) + i;
			var mapY = Math.floor(startY/ih) + j;
			if(!map.img[layer][mapX] || !map.img[layer][mapX][mapY]) continue;
			var mapXY = map.img[layer][mapX][mapY];
			
			//problem is map not whole
			var iwResized = iw.mm(0,mapXY.width);
			var ihResized = ih.mm(0,mapXY.height);			
			
			ctx.drawImage(mapXY, 0,0,iwResized,ihResized,(offsetX + iw*i)*SIZEFACT ,(offsetY + ih*j)*SIZEFACT,iwResized*SIZEFACT,ihResized*SIZEFACT);
		}
	}
	
}

Draw.map.cst = {
	sizeFact:2,		//enlarge the map image by this factor
	imageRatio:2  	//basically 1280 / size of 1 image
}

Draw.screenEffect = function(fxx){
	if(fxx.fadeout && --fxx.fadeout.time > 0)  Draw.screenEffect.fadeout(fxx.fadeout);
	if(fxx.torch && --fxx.torch.time > 0)  Draw.screenEffect.torch(fxx.torch);
}

Draw.screenEffect.fadeout = function(fx){
	var third = fx.maxTimer/3;
	var time = fx.maxTimer - fx.time;
	
	var alpha = 1;
	if(time < third)
		alpha = time / third;
	if(time > 2*third)
		alpha = 1- (time - 2*third)/third;
	
	ctx.globalAlpha = alpha;
	ctx.fillStyle = fx.color || 'black';
	ctx.fillRect(0,0,CST.WIDTH,CST.HEIGHT);
	ctx.globalAlpha = 1;
}

Draw.screenEffect.torch = function(fx){
	var grd = ctx.createRadialGradient(
		CST.WIDTH2,
		CST.HEIGHT2,
		fx.radiusInside || 200,
		CST.WIDTH2,
		CST.HEIGHT2,
		fx.radiusOutside || 300
	);
	grd.addColorStop(0.1,'rgba(31,0,0,'+(fx.alpha || 0.5)+')');
	grd.addColorStop(1,"black");
	ctx.fillStyle = grd;
	ctx.fillRect(0,0,CST.WIDTH,CST.HEIGHT);
			
	ctx.globalAlpha = 1;
}


Draw.logout = function(){
	ctx = List.ctx.pop;
	var size = 24;
	Draw.icon('system.close',CST.WIDTH-size,0,size);
	Button.creation(0,{
		'rect':[CST.WIDTH-size,CST.WIDTH,0,size],
		"shiftLeft":{'func':Command.send,'param':['logout']},
		'text':"Shift-Left Click to safely leave the game.",
	});	
	
	
	
	//tele town
	Draw.icon('minimapIcon.door',CST.WIDTH-size*2,0,size);
	Button.creation(0,{
		'rect':[CST.WIDTH-size*2,CST.WIDTH-size*1,0,size],
		"shiftLeft":{'func':Command.send,'param':['hometele']},
		'text':"Shift-Left to abandon quest and teleport to Town.",
	});	
	
	
	//contact me
	Draw.icon('system.flag',600,CST.HEIGHT-size*2,size*2);
	Button.creation(0,{
		'rect':[600,600+2*size,CST.HEIGHT-size*2,CST.HEIGHT],
		"shiftLeft":{'func':Chat.report.open,'param':['misc']},
		'text':"Shift-Left to leave Feedback.",
	});	
}


//Option
Draw.optionList = function(){ ctxrestore();
	var hc = html.$optionListDiv[0];
	if(!main.optionList){ hc.style.visibility = 'hidden'; return; }
	
	//Draw Item Options
	var option = main.optionList.option;
	var name = main.optionList.name;
	var sx = main.optionList.x-60;
	var sy = main.optionList.y;
	
	var w = 120;
	var h = 150;
	
	sx = Math.min(sx,CST.WIDTH - w);
	sx = Math.max(sx,0);
	sy = Math.min(sy,CST.HEIGHT - h);
	sy = Math.max(sy,0);
	
	
	hc.style.visibility = 'visible';
	
	//text:
	//style="color:yellow"
	var str = '<!-- ' + sx + sy + '-->';	//so even if innerHTML is same, if xy diff, redraw
	str += '<span class="u" style="text-align:center;font-size:20px">' + name + '</span><br>';
		
	for(var i = 0 ; i < option.length ; i++){
		var name = Draw.optionList.parse(option[i].name);	//no idea if still used
		var title = option[i].description || option[i].name;
		var side = +!(main.optionList.client || option[i].client);
		str += '<span  title="' + title + '" ';
		str += 'onmousedown="Draw.optionList.click(' + side + ',' + i + ');"';	//onclick wont work
		str += '> - ' + name + '</span><br>';
	}
	
	if(Draw.setInnerHTML(hc,str)){
		hc.style.left = sx + 'px';
		hc.style.top = sy + 'px';
	}
}
Draw.optionList.click = function(server,num){
	if(server) return Command.send('option,' + num);
	
	var op = main.optionList.option[num];
	Tk.applyFunc(op.func,op.param);
}

Draw.optionList.parse = function(data){
	if(data.indexOf('\{') == -1) return data; 
	for(var i = 0 ; i < data.length ; i++){
		if(data[i] == '{' && data[i+1] == '{'){
			var start = i;
			for(var j = start; j < data.length ; j++){
				if(data[j] == '}' && data[j+1] == '}'){
					var end = j+1;
					var tag = data.slice(start+2,end-1);
					
					if(tag.length > 100)  return data;
					data = data.replaceAll(
					'\\{\\{' + tag + '\\}\\}',
					eval(tag)
					);
					break;
				}
			}
		}
	}
	return data;
}

//Chat
Draw.chat = function(){ ctxrestore();
	ctx = List.ctx.stage;
	Draw.chat.main();
	
	if(main.dialogue){
		Draw.chat.dialogue();
	} else {
		var s = Draw.chat.constant();
		ctx.beginPath();
		ctx.moveTo(s.x,s.y+s.h-s.personalChatY-3);
		ctx.lineTo(s.w,s.y+s.h-s.personalChatY-3);
		ctx.stroke();
		/*ctx.globalAlpha = 0.7;
		ctx.fillStyle = 'black';
		ctx.fillRect(s.x,s.y+s.h-s.personalChatY-3,s.y,s.w+250,s.personalChatY+3);*/
	}
}

Draw.chat.main = function(){
	var s = Draw.chat.constant();
	
	//PM
	html.pm.div.style.left = (s.x + s.divX -5) + 'px'; 
	html.pm.div.style.top = (s.y + s.divY - s.pmY - s.pmDivY - s.disPmY - 36) + 'px'; 
	
	html.pm.text.style.font = s.pmcharY + 'px Kelly Slab';
	html.pm.text.style.width = (s.w - 2*s.divX) + 'px';
	html.pm.text.style.height = (s.pmY) + 'px'
	html.pm.text.style.left = s.divX + 'px'; 
	html.pm.text.style.top = (s.divY- s.pmY - s.pmDivY - s.disPmY) + 'px'; 
	
	
	Draw.icon("tab.quest",s.w-24*3,CST.HEIGHT-24,24,{
		"shiftLeft":{"func":Command.send,"param":['reward,open']},
		'text':'Shift-Left: Check Contribution Rewards',
	});
	
	Draw.icon("tab.friend",s.w-48,CST.HEIGHT-24,24,{
		"shiftLeft":{"func":Command.send,"param":['playerlist']},
		'text':'Shift-Left: Get Player Currently Online',
	});
	
	Draw.icon("attackMelee.cube",s.w-24,CST.HEIGHT-24,24,{
		"shiftLeft":{"func":Chat.clear,"param":[]},
		'text':'Shift-Left: Clear Chat and PM',
	});
	
	$("#aboveChat")[0].style.top = (s.y + s.divY - 55) + 'px'; //TOFIX
	
	//HTML
	html.chat.div.style.left = (s.x + s.divX) + 'px'; 
	html.chat.div.style.top = (s.y + s.divY) + 'px'; 

	html.chat.text.style.font = s.chatcharY + 'px Kelly Slab';
	html.chat.text.style.width = (s.w - 2*s.divX) + 'px';
	html.chat.text.style.height = (s.h - 2*s.divY - s.personalChatY) + 'px'
	html.chat.text.style.left = s.divX + 'px'; 
	html.chat.text.style.top = s.divY + 'px'; 
	
	html.chat.text.style.color = 'white';
	html.chat.text.style.color = 'white';
	
	html.$chatUserName[0].style.font = s.personalChatY + 'px Kelly Slab';
	
	html.chat.input.size=(50-player.name.length).toString();
	html.chat.input.maxlength="150";	
	html.chat.input.style.font = s.personalChatY + 'px Kelly Slab';
	html.chat.input.style.height = s.personalChatY + 5 + 'px'
	
	/*	
	html.dialogue.div.style.width = (s.w - 2*s.divX) + 'px';
	html.dialogue.div.style.height = (s.h - 2*s.divY) + 'px'
	html.dialogue.div.style.left = (s.x + s.divX) + 'px'; 
	html.dialogue.div.style.top = (s.y + s.divY + s.dialogueTopDiffY) + 'px'; 
	*/
	
	//MainBox
	ctx.globalAlpha = main.dialogue ? 0.7 : 0.1;
	ctx.fillStyle='black';//"#F5DEB3";
	ctx.fillRect(s.x,s.y,s.w,s.h);
	ctx.globalAlpha = 1;
	ctx.strokeStyle="black";
	ctx.strokeRect(s.x,s.y,s.w,s.h);
	ctx.fillStyle="black";
	
	
}

Draw.chat.dialogue = function(){
	var s = Draw.chat.constant();
	var dia = main.dialogue;
	
	if(dia.face){	s.numX += s.faceX;} 
	if(dia.option){ var nY = s.y+s.h-10-dia.option.length*20; }	
			
	html.dialogue.text.style.width = s.w - 2*s.textBorder + 'px';
	html.dialogue.text.style.font = '20px Kelly Slab';
	html.dialogue.div.style.top = (s.y + s.divY*2) + 'px';
		
	if(dia.face){
		html.dialogue.text.style.width = s.w - 2*s.textBorder-s.faceX + 'px';
		html.dialogue.div.style.left = (s.x + s.divX + s.textBorder + s.faceX) + 'px';
		Draw.face(dia.face,s.facesX,s.y+s.facesY,96);
	} 
	
	//Options
	var str = dia.text;
	for(var i in dia.option){
		str  += '<br><span ' +
			'onclick="Command.send(\'dialogue,option,' + i + '\');" ' +
			'>' +
			'<font size="4">&nbsp; - ' + dia.option[i].text + '</font>' +
			'</span>';
	}
	Draw.setInnerHTML(html.dialogue.text,str);
	
	
	if(dia.exit !== 0){
		Draw.icon('system.close',s.w-24,s.y,24,{
			"left":{'func':Command.send,'param':['dialogue,option,-1']},
			'text':"End dialogue.",
		});	
	}
	
}

Draw.chat.constant = function(){
	return  {
		w:600,
		h:200,
		x:0,
		y:CST.HEIGHT-200,
		numX:5,			//border for text
		faceX:96 + 5,	//push dia text by that if has face
		facesX:15,		//border for face	
		facesY:30,		//border for face
		optionY:20,		//Y between options
		textBorder:20, //distance between border of box and where text starts, applied to start and end
		personalChatY:20, //size for player own written stuff (chatBox not dialogue)
		
		dialogueTopDiffY:10,
		
		chatcharY:20, 
		
		divX:5,
		divY:5,
		
		//pm
		pmY:148,
		disPmY:20, //distance between botoom of pm and top of chat
		pmcharY:18,
		pmDivY:5,
	}
}

Draw.icon = function(info,x,y,size,text,ctxx){
	size = size || 32;
	var slot = Img.icon.index[info];
	if(!slot) return ERROR(4,'no icon',info);
	var whatImage = Math.floor(slot.y/(Img.icon.row*48));

	(ctxx || ctx).drawImage(
		Img.icon[whatImage],
		slot.x,
		slot.y%(Img.icon.row*48),
		CST.ICON,
		CST.ICON,
		x,
		y,
		size,
		size
	);
		
	if(!text) return;
	var button = Tk.deepClone(text);
	if(typeof button === 'string') button = {text:button};
	button.rect = [x,x+size,y,y + size];
	Button.creation(0,button);

	return Collision.ptRect(Collision.getMouse(),button.rect);
}


Draw.icon.html = function(info,size,title,onclick,oncontextmenu,alpha){
	size = size || 24;
	var canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	if(title){
		canvas.style.cursor = "pointer";
		canvas.title = title;
	}
	canvas.onclick = onclick || null;
	canvas.oncontextmenu = oncontextmenu || null;
	canvas.style.zIndex = 21;	//+1 than window
	var ctx = canvas.getContext("2d");
	if(alpha !== undefined) ctx.globalAlpha = alpha;
	Draw.icon(info,0,0,size,'',canvas.getContext("2d"));
	return canvas;
}


Draw.arrow = function(a){
	var ctx = List.ctx.pop;
	var im = Img.help.arrow[a.side];
	ctx.drawImage(im,0,0,im.width,im.height,a.x-a.size/2,a.y-a.size/2,a.size,a.size);
}

Draw.arrow.add = function(pt,time,id,size,side){
	pt.time = pt.time || time || 100;
	pt.size = pt.size || size || 40;
	pt.side = pt.side || side || 'right';
	Draw.arrow.list[pt.id || id || Math.randomId()] = pt;
}
Draw.arrow.remove = function(id){
	delete Draw.arrow.list[id];
}
Draw.arrow.list = {};
Draw.arrow.loop = function(){
	for(var i in Draw.arrow.list){
		var a = Draw.arrow.list[i];
		if(--a.time < 0) delete Draw.arrow.list[i];
		else {
			if(Loop.frame % 30 > 10)
				Draw.arrow(a);
		}
	}
}	

Draw.expPopup = function(){
	//Update
	if(Loop.interval(25)){
		var str = Tk.stringify(player.skill.exp);
		if(Draw.expPopup.old !== str){
			var old = JSON.parse(Draw.expPopup.old);
			Draw.expPopup.old = str;
			Draw.expPopup.list = {};
			Draw.expPopup.time = 25;
			for(var i in old){
				if(old[i] !== player.skill.exp[i])
					Draw.expPopup.list[i] = player.skill.exp[i] - old[i];		
			}
		}
	}
	//Draw
	if(--Draw.expPopup.time >= 0){
		var count = 0;
		ctx.setFont(25);
		for(var i in Draw.expPopup.list){
			count++;
			var str = "+" + Draw.expPopup.list[i] + ' Exp in ' + i.capitalize();
			ctx.fillStyle = 'black';
			ctx.fillText(str,CST.WIDTH2+100,CST.HEIGHT2 -100 + count*30);
			ctx.fillStyle = 'white';
			ctx.fillText(str,CST.WIDTH2+100-1,CST.HEIGHT2 -100 + count*30-1);
		}	
		ctx.fillStyle = 'black';
	}
}
Draw.expPopup.old = '{}';
Draw.expPopup.list = {};
Draw.expPopup.time = 0;


/*
Draw.arrow.add({"x":1064,"y":692},1000,'equipTab',0,'right'); 	//to equip tab
Draw.arrow.add({"x":254,"y":114},1000,'',0,'right'); 	//to open ability win
Draw.arrow.add({"x":1070,"y":630},1000,'',0,'left');	//to ability list
*/

Draw.ptTracker = function(code){	//used for creation
	if(!Game.started) return;
	if(Draw.ptTracker.ignoreNext){ Draw.ptTracker.ignoreNext = false; return; }
	if(code === 'left') Draw.ptTracker.list.push({x:Math.floor(Input.mouse.x),y:Math.floor(Input.mouse.y)});	//aka left
	if(code === 'right'){
		Draw.ptTracker.list.push('||');
		Draw.ptTracker.ignoreNext = true;
	}
	if(Draw.ptTracker.list.length >= 20) Draw.ptTracker.list.splice(0,10);
}
Draw.ptTracker.list = [];
Draw.ptTracker.active = true;
Draw.ptTracker.ignoreNext = false;
Draw.ptTracker.get = function(){ return Tk.stringify(Draw.ptTracker.list); }

//[{"x":1049,"y":701},{"x":1042,"y":629},{"x":329,"y":117},{"x":122,"y":250}]

Draw.item = function(info,x,y,size,cb){
	size = size || 32;
	info = typeof info === 'string' ? [info,1] : info;
	
	Draw.icon(info[0],x,y,size,cb);
	var amount = info[1];
	
	if(amount === 1) return;
	
	if(amount >= 100000){
		amount = Math.floor(amount/1000);
		if(amount >= 10000)	amount = Math.floor(amount/1000) + "M";
		else amount = amount + "K";
	}
		
	ctx.globalAlpha = 0.8;
	ctx.fillStyle = "black";
	ctx.strokeStyle = "white";
	ctx.roundRect(x-2,y+size-2,size+4,15);
	ctx.globalAlpha = 1;
	
			
	ctx.fillStyle = "yellow";
	ctx.setFont(size/32*13);
	ctx.fillText(amount,x,y+size-2);
	
}

Draw.element = function(x,y,w,h,data,noover){
	var initCtx = ctx.name;
	var xx = x;
	ctx.save();
	ctx.textAlign = 'left';
	ctx.strokeRect(x,y,w,h);
	var total = 0; for(var i in data){	total += data[i]; }
	
	var mx = Math.min(Input.mouse.x,CST.WIDTH-150);
	var my = Math.min(Input.mouse.y,CST.HEIGHT-25);
	
	for(var i in data){
		var length = w*data[i]/total;
		
		if(length > 2){
			ctx.fillStyle = CST.element.toColor[i];
			ctx.roundRect(x,y,length,h);
		}
		if(Collision.ptRect(Collision.getMouse(),[x,x+length,y,y+h])){
			var mouseOverRatio = i; 
		}
		x += length;
	}
	
	ctx.lineWidth = 2;
	ctx.roundRect(xx,y,w,h,0,1);
	ctx.lineWidth = 1;
	
	if(!noover && mouseOverRatio){
		ctx = List.ctx['pop'];
		var amount = data[mouseOverRatio];
		if(amount < 1){ amount = Tk.round(data[mouseOverRatio]*100,0) + '%' }
		else { amount = Tk.round(data[mouseOverRatio],0) }
		
		var text = mouseOverRatio.capitalize() + ': ' + amount;
		var width = ctx.measureText(text).width;
		ctx.fillStyle = CST.element.toColor[mouseOverRatio];
		ctx.roundRect(mx,my-30,width+10,30);
		ctx.fillStyle = 'black';
		ctx.fillText(text,mx+5,my+3-30);
	}
	ctx = List.ctx[initCtx];
	ctx.restore();
}

Draw.convert = {};

Draw.convert.boost = function(boost){
	//Convert a boost object into a string.
	if(boost.type === 'custom'){ return Db.statCustom[boost.value].name; }
	
	
	var name = Db.stat[boost.stat].name;
	
	//Round and add %
	var value = boost.value;
	var rawValue = boost.value;
	if(Math.abs(value) < 1){ 
		value *= 100; value = Tk.round(value,2).toString() + '%';
	} else { value = Tk.round(value,2)};
	
	
	var last = name[name.length-1];
	if(last == 'x' ||  last == '*' || last == '+' || last == '^'){
		if(rawValue < 0){value = '-' + last + value;}
		if(rawValue > 0){value = last + value;}
		name = name.slice(0,-1);
	} else {
		if(value < 0){value = '-' + value;}
		if(value > 0){value = '+' + value;}
	}
	
	return [name,value];
	 
	/*
	if(boost.type == 'base'){	}
	else if(boost.type == 'max'){
		return '-Set Max ' + prename + ' to ' + value;
	} else if(boost.type == 'min'){
		return '-Set Min ' + prename + ' to ' + value;
	}
	*/
}

Draw.gradientRG = function(n){
	n = Math.min(1,Math.max(0,n));
	if(n<0.5){
		var R = 0+(n*(255/0.5));
		var G = 255;
		var B = 0;
	} else {
		var n = n-0.5;
		var R = 255;
		var G = 255-(n*(255/0.5));
		var B = 0;
	} 
	return 'rgb(' + Math.round(R) + ',' + Math.round(G) + ',' + Math.round(B) + ')';
}

Draw.context = function (){ ctxrestore();
	var text = main.context.text;
	if(!text) return;
	
	var top = main.context.textTop;
	var hc = html.context.div;
	
	hc.style.visibility = 'visible';
	if(hc.innerHTML === text) return;	//same texts
	
	if(!top){
		hc.innerHTML = text;
		hc.style.left = (Input.mouse.x + 25).mm(0,CST.WIDTH-hc.offsetWidth) + 'px';
		hc.style.top = (Input.mouse.y + 25).mm(0,CST.HEIGHT-hc.offsetHeight) + 'px';
	} else {
		hc.style.left = CST.WIDTH/2-150 + 'px'
		hc.style.top = "25px";
		if(!text.have('\>')) text = '<font size="5">' + text + '</font>'
		hc.innerHTML = text;
	}
	
	
}

Draw.command = function(){
	html.command.div.style.visibility = html.command.div.innerHTML ? 'visible' : 'hidden';
	
	html.command.div.style.top = '550px';
	html.command.div.style.left = '100px';
	
	if(html.chat.input.value[0] !== '$'){
		html.command.div.innerHTML = '';
		return;
	}
	
	if(Draw.old.command === html.chat.input.value) return;
	
	Draw.old.command = html.chat.input.value;
	
	var info = html.command.div;
	
	var txt = html.chat.input.value.slice(1);
	for(var i in Command.list){
		if(txt.have(i)){
			var cmd = Command.list[i].doc;
			var str = cmd.description;
			for(var j in cmd.param){
				str += '<br>@param' + j + ' ' + cmd.param[j].name + ' [' + cmd.param[j].type + ']';
				if(cmd.param[j].optional) str += ' -Optional'
			}
			info.innerHTML = str;	
			return;			
		}
	}
	info.innerHTML = '';
	
}

Draw.setInnerHTML = function(el,str){
	var name = el.id;

	if(Draw.old[name] !== str){
		Draw.old[name] = str;
		el.innerHTML = str;
		return true;
	}
	return false;
}

Draw.face = function(info,x,y,size){
	size = size || 96;
	if(info === 'player') info = {image:'warrior-man.0','name':player.name};
	var slot = Img.face.index[info.image];
	ctx.drawImage(Img.face,slot.x,slot.y,CST.FACE,CST.FACE,x,y,size,size);

	Button.creation(0,{
		'rect':[x,x+size,y,y + size],
		'text':info.name,
	});	
	
	ctx.textAlign = 'center';
	ctx.fillStyle = 'white';
	ctx.fillText(info.name,x+size/2,y+size+5);
	ctx.fillStyle = 'black';
	ctx.textAlign = 'left';
	
}



Draw.mapOtherSystemUnused = function(){
	//'map':{'a':{'canvas':$("#mapAbove" + "Canvas")[0],'ctx':$("#mapAbove" + "Canvas")[0].getContext('2d')},'b':{'canvas':$("#mapBelow" + "Canvas")[0],'ctx':$("#mapBelow" + "Canvas")[0].getContext('2d')}},
	//<canvas id="mapAboveCanvas" class='posAbs' width='12800' height='7200' style="z-index:-9; width:12800px; height:7200px; background-color:red;"></canvas>
	//<canvas id="mapBelowCanvas" class='posAbs' width='12800' height='7200' style="z-index:-11; width:12800px; height:7200px; background-color:yellow;"></canvas>
					
	Draw.mapLoop = function(layer){
		html.map.a.canvas.style.left = (-player.x + CST.WIDTH/2) + 'px';
		html.map.a.canvas.style.top = (-player.y + CST.HEIGHT/2) + 'px';
		html.map.b.canvas.style.left = (-player.x + CST.WIDTH/2) + 'px';
		html.map.b.canvas.style.top = (-player.y + CST.HEIGHT/2) + 'px';
	}

	Draw.mapInit = function(layer){
		var map = Map.getMap();
		var mapAmount = 10;
		var width = 640;
		var height = 360;
		
		for(var i = 0; i < mapAmount; i++){
			for(var j = 0; j < mapAmount; j++){
				if(!map.img['b'][i] || !map.img['b'][i][j]) continue;
				//problem is map not whole
				//html.map.b.ctx.drawImage(map.img['b'][i][j],0,0,width,height, i*width*2,j*height*2,width*2,height*2);
				html.map.a.ctx.drawImage(map.img['a'][i][j],0,0,width,height, i*width*2,j*height*2,width*2,height*2);
			}
		}
	}
}



Draw.questRating = function(quest){
	$("#questRating").css('visibility','visible');
	Draw.questRating.quest = quest;
}
Draw.questRating.quest = '';
Draw.questRating.click = function(num){
	Command.send('questRating,' + Draw.questRating.quest + ',' + num);
	$("#questRating").css('visibility','hidden');
	Draw.questRating.quest = '';			
}


Draw.questComplete = function(info){
	var mq = main.quest[info.quest];
	var q = Db.quest[info.quest];
	var str = '<h2 class="u">Quest "' + Db.questNameConvert[info.quest] + '" Complete!</h3>';
	if(info.dailytask) str += '<h4 class="u">Daily Task Completed!</h4>';
	
	//
	//Challenge
	str += '<table><tr><td></td><td style="padding:20px 20px">';
	str += '<h3>Challenge Status</h3>';
	
	for(var i in info.challengeSuccess){
		var c = info.challengeSuccess[i];
		var color = c ? '#00AA00' : '#FF0000';
		var permColor = info._challengeDone[i] ? '#00AA00' : '#FF0000';
		var textStatus = c ? 'Success!' : 'Failure';
		
		str += (info._challengeDone[i] ? 
					'<span style="color:orange;" title="Completed at least once">★</span>'
					: '<span style="color:gray;" title="Never completed">★</span>') 
				+ ' - <span class="shadow" style="color:' + color + '">'
				+ '<b>' + info.challengeInfo[i].name + ': </b>'
				+ (c === null ? 
					'Not Active' :
					textStatus + ' => ' + (c ? 'x' + info.challengeInfo[i].bonus.success.passive : 'No ') + ' Bonus ')
				+ ' | <span title="Bonus for completing the challenge at least once." style="color:' + permColor + '">' 
				+ (info._challengeDone[i] ? 
					'Perm Bonus: x' + info.challengeInfo[i].bonus.perm.passive 
					: ' No Perm Bonus')
				+ '</span>' 
				+ '</span><br>';
	}	
	str += '</td><td>';
	//
	var r = info.reward;	//final			{passive:base*scoremod*bonus}
	var s = r.bonus;		//bonus sum		{passive:4}
	var b = s.raw;			//bonus with each category separated 	{orb:{passive,..}}
	str += '<h3>Reward Bonus</h3>'
	
	var active = false;
	for(var i in info.challengeSuccess) if(info.challengeSuccess[i] !== null) active = true; 
	var count = 0;
	for(var i in info._challengeDone) if(info._challengeDone[i]) count++;
	str += '<table class="CSSTableGenerator CSSTableGeneratorHead">' + Tk.arrayToTable(Draw.window.quest.challenge.array(b,active,count),1,1) + '</table>';
	
	str += '</td></tr></table>';
	
	//Highscore
	str += '<h3>Highscore:</h3>';
	for(var i in info.highscoreRank){
		var c = info.highscoreRank[i];
		var color = c ? '#00AA00' : '#FF0000';
		str += 	'<b>' + Db.highscoreList[i].name + ' - </b>' + 				
				'Score: ' + c.score + ' | ' +
				'<span class="u" title="Open Highscore Window" onclick="Draw.window.highscore.open(\'' + i + '\');">Rank: ' + c.rank + '</span>';
		str += '<br>';
		
	}
	//Score
	str += '<h3 class="u">Score</h3>'
	str += '<b title="For the quest you have just done. Depends on performance and Passive Bonus.">Quest Score: </b>' + r.passive.r(0) 
		+ ' - (<span title="Base Score. Always the same.">Base: ' + r.scoreBase + '</span>, ' +
			(info.scoreModInfo ? '<span title="' + (info.scoreModInfo) + '">Performance Mod: x' + r.scoreMod.r(2) + '</span>, ' : '') 
		+ '<span title="Check table above">Passive Bonus: x' + s.passive.r(2) + '</span>)<br>';
	str += '<b title="Sum of all Quest Scores for this quest. Repeat the quest to increase it as many times as you want.">'
			+ 'Cumulative Quest Score: </b>' + info._rewardScore.r(0) + ' / 10000 <br>';
	str += '<b title="Depends on your Cumulative Quest Score. Use Passive Points to boost stats via Passive Grid.">'
			+ 'Passive Points:</b>' + info._rewardPt.r(2) + ' / ' + info.maxPassivePt.r(2) + '<br>';
	

	
	/*
	//str += '<b>Exp: </b>' + Tk.stringify(info.reward.exp) + '<br>';
	//str += '<b>Item: </b>' + Tk.stringify(info.reward.item) + '<br>';
		
	str += '<b>Performance Mod:</b> ' + (info.scoreModInfo || "Depends on how well you completed the quest.") + '<br>';
	str += 'The cycle mod can also go over x1, granting better reward, if you haven\'t completed the quest recently.<br>';
	str += 'The purpose of the cycle mod is to auto-balance the game.<br>';
	str += 'It also prevents doing the same quest over and over to be the most efficient way to play.<br>';
	*/
	
	
	
	//http://puu.sh/9zVCy.png
	//ts("Quest.complete(key,'Qbtt000')");
	
	Tk.openDialog('questComplete',str);
	
	
	
	/*	Quest "asjfha" Complete
	
	Challenge Bonus:
	* Speedrun: Success! Perm bonus: x1.5. Additional bonus: x2.
	
	Highscore:
	Fastest Time: Rank: 100, Score: 1000	(New Highscore!)
	
	Reward Modifier:
	Item: x24 (x1 (orb) * x2 (item) * 
	
	Reward:
	Score: 12323			<reward.passive
	Total Score: 2313122	<_rewardScore
	Passive Points: 1.3/2
	Exp: adasdsd
	Item: asdasd
	*/
	/*
	{
    "quest": "Qbtt000",
    "challengeSuccess": {
        "speedrun": 0,
        "fireonly": 0,
        "fivetimes": 0
    },
    "challengeInfo": {
        "speedrun": {
            "name": "Speedrun",
            "bonus": {
                "success": {
                    "item": 2,
                    "passive": 2,
                    "exp": 2
                },
                "failure": {
                    "item": 1,
                    "passive": 1,
                    "exp": 1
                },
                "perm": {
                    "item": 1.5,
                    "passive": 1.5,
                    "exp": 1.5
                }
            }
        },
        "fireonly": {
            "name": "Fire Only",
            "bonus": {
                "success": {
                    "item": 2,
                    "passive": 2,
                    "exp": 2
                },
                "failure": {
                    "item": 1,
                    "passive": 1,
                    "exp": 1
                },
                "perm": {
                    "item": 1.5,
                    "passive": 1.5,
                    "exp": 1.5
                }
            }
        },
        "fivetimes": {
            "name": "5 Times!",
            "bonus": {
                "success": {
                    "item": 2,
                    "passive": 2,
                    "exp": 2
                },
                "failure": {
                    "item": 1,
                    "passive": 1,
                    "exp": 1
                },
                "perm": {
                    "item": 1.5,
                    "passive": 1.5,
                    "exp": 1.5
                }
            }
        }
    },
    "highscoreRank": {
        "Qbtt000-speedrun": {
            "rank": 6,
            "username": "asdsss",
            "score": 0,
            "category": "Qbtt000-speedrun"
        },
        "Qbtt000-fireonly": {
            "rank": 2,
            "username": "asdsss",
            "score": 0,
            "category": "Qbtt000-fireonly"
        }
    },
    "_complete": 9,
    "_rewardScore": 320.625,
    "_rewardPt": 1.2529986912279456,
    "_challengeDone": {
        "speedrun": 1,
        "fireonly": 1,
        "fivetimes": 0
    },
    "reward": {
        "passive": 50.625,
        "item": {},
        "exp": {},
        "bonus": {
            "item": 5.0625,
            "exp": 5.0625,
            "passive": 5.0625,
            "raw": {
                "challengeDone": {
                    "passive": 2.25,
                    "exp": 2.25,
                    "item": 2.25
                },
                "challenge": {
                    "item": 1,
                    "exp": 1,
                    "passive": 1
                },
                "orb": {
                    "passive": 1,
                    "exp": 1,
                    "item": 1
                },
                "cycle": {
                    "passive": 1,
                    "exp": 1,
                    "item": 1
                }
            }
        }
    },
    "maxPassivePt": 2
}
	*/
	
	


}















/*
Draw.arrow.complex = function(start,end,text){
	var ctx = List.ctx.pop;
	ctx.save();
	ctx.lineWidth = 6;
	ctx.strokeStyle = 'white';
	var headlen = 40;   // length of head in pixels
    var angle = Math.atan2(end.y-start.y,end.x-start.x);
	
	ctx.beginPath();
	ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
	ctx.lineTo(end.x-10*Math.cos(angle-Math.PI/6),end.y-headlen*Math.sin(angle-Math.PI/6));
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x-10*Math.cos(angle+Math.PI/6),end.y-headlen*Math.sin(angle+Math.PI/6));
    
	ctx.stroke();
	ctx.restore();
}
Draw.arrow.complex.add = function(start,end,time){
	Draw.arrow.complex.list[Math.randomId()] = {start:start,end:end,time:time};
}
Draw.arrow.complex.list = {};
Draw.arrow.complex.loop = function(){
	for(var i in Draw.arrow.complex.list){
		var a = Draw.arrow.complex.list[i];
		if(--a.time < 0) delete Draw.arrow.complex.list[i];
		else Draw.arrow.complex(a.start,a.end);
	}
}

*/
