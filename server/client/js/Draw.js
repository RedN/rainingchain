Draw = {};
Draw.old = {'fl':'','quest':'','abilityShowed':'bulletMulti','abilityTypeShowed':'attack','abilitySub':''};

Draw.loop = function (){
	//Clear
	for(var i in List.ctx){List.ctx[i].clearRect(0, 0, Cst.WIDTH, Cst.HEIGHT);}
	for(var i in html){ 
		if(i === 'warning') continue;
		//if(i === 'command') continue;
		//if(i === 'context') continue;
		html[i].div.style.visibility = 'hidden';
	}
	List.btn = [];
	Input.event.mouse.drag.update();
	
	//Draw
	Draw.map('b');   //below player
	Draw.anim('b');  //below player
	Draw.drop();
	Draw.actor();  		
	Draw.bullet();
	Draw.anim('a');  //above player
	Draw.map('a');   //above player
			
	Draw.tab();     //bottom right
	Draw.chat();    //bottom left

	Draw.window();
	Draw.popup();
	
	Draw.minimap();
	Draw.state();
	
	Draw.optionList();    //option when right-click
	
	Button.context();	//update for client buttons only
	Draw.context();     //top left
	Draw.command();
	//clientContext = '';		
}

Draw.map = function (layer){ ctxrestore();
	var SIZEFACT = 2;	//image is x2 smaller than ingame

	ctx = List.ctx.stage;
	var map = Db.map[player.map];
	var mapX = Math.floor((player.x-1024)/2048).mm(0,map.img[layer].length-1);
	var mapY = Math.floor((player.y-1024)/2048).mm(0,map.img[layer][mapX].length-1);
	var mapXY = map.img[layer][mapX][mapY];
	var pX = player.x-mapX*2048;
	var pY = player.y-mapY*2048;
	
	var numX = (pX - Cst.WIDTH/2)/SIZEFACT ;
	var numY = (pY - Cst.HEIGHT/2)/SIZEFACT ;
	var longueur = Cst.WIDTH/2;
	var hauteur = Cst.HEIGHT/2;
	var diffX = numX + longueur - mapXY.width;
	var diffY = numY + hauteur - mapXY.height;
	var startX = Math.max(numX,0);
	var startY = Math.max(numY,0);
	var endX = Math.min(numX + longueur,mapXY.width)
	var endY = Math.min(numY + hauteur,mapXY.height)
	var tailleX = Math.min(endX-startX,mapXY.width);
	var tailleY = Math.min(endY-startY,mapXY.height);
	
	ctx.drawImage(mapXY, startX,startY,tailleX,tailleY,(startX-numX)*SIZEFACT,(startY-numY)*SIZEFACT,tailleX*SIZEFACT,tailleY*SIZEFACT);	
}


//Option
Draw.optionList = function(){ ctxrestore();
	if(!main.optionList) return;
	ctx = List.ctx.pop;
	
	//Draw Item Options
	var option = main.optionList.option;
	var name = main.optionList.name;
	var sx = main.optionList.x-60;
	var sy = main.optionList.y;
	
	var nameX = 5;
	var nameY = 20;
	var optionX = 7;
	var optionY = 25;

	var w = 120;
	var h = nameY + optionY*option.length
	
	sx = Math.min(sx,Cst.WIDTH - w);
	sx = Math.max(sx,0);
	sy = Math.min(sy,Cst.HEIGHT - h);
	sy = Math.max(sy,0);
	
	

	ctx.textAlign = 'left';
	
	//Name Frame;
	ctx.fillStyle = "#333333";
	ctx.fillRect(sx,sy,w,nameY);
	
	ctx.strokeStyle="black";
	ctx.strokeRect(sx,sy,w,nameY);
	
	ctx.font="15px Monaco";
	ctx.fillStyle = "white";
	ctx.fillText(name,sx+nameX,sy);
		
		
	//Option Frame
	ctx.globalAlpha = 0.9;
	ctx.fillStyle = "#696969";
	ctx.fillRect(sx,sy+nameY,w,optionY*option.length);
	ctx.globalAlpha = 1;
	
	ctx.strokeStyle="black";
	ctx.strokeRect(sx,sy+nameY,w,optionY*option.length);


	//Text + Button
	ctx.font="14px Monaco";
	ctx.fillStyle = "yellow";
		
	for(var i = 0 ; i < option.length ; i++){
	
		var name = Draw.optionList.parse(option[i].name);
		ctx.fillText(name,sx+optionX,sy+optionY*(i+1));
		
		if(main.optionList.client || option[i].client){ 
			Button.creation(0,{
				'rect':[sx,sx+w,sy+nameY+optionY*i,sy+nameY+optionY*(i+1)],
				"left":option[i],
				'text':name,
				});		
				
		}else {
			Button.creation(0,{
				'rect':[sx,sx+w,sy+nameY+optionY*i,sy+nameY+optionY*(i+1)],
				"left":{'func':Chat.send.command,'param':['$option,' + i]},
				'text':name,
				});	
		}
				
		
	}
	
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
		html.chat.div.style.visibility = "visible";
		ctx.beginPath();
		ctx.moveTo(s.x,s.y+s.h-s.personalChatY-3);
		ctx.lineTo(s.w,s.y+s.h-s.personalChatY-3);
		ctx.stroke();	
	}
}

Draw.chat.main = function(){
	var s = Draw.chat.constant();
	
	//PM
	html.pm.div.style.visibility = 'visible';
	html.pm.div.style.left = (s.x + s.divX) + 'px'; 
	html.pm.div.style.top = (s.y + s.divY - s.pmY - s.pmDivY - s.disPmY) + 'px'; 
	
	html.pm.text.style.font = s.pmcharY + 'px Monaco';
	html.pm.text.style.width = (s.w - 2*s.divX) + 'px';
	html.pm.text.style.height = (s.pmY) + 'px'
	html.pm.text.style.left = s.divX + 'px'; 
	html.pm.text.style.top = (s.divY- s.pmY - s.pmDivY - s.disPmY) + 'px'; 
	
	//Clan
	var str = 'Clan: ';
	for(var i in main.social.list.clan){ str += main.social.list.clan[i] + '  '; }
	ctx.font = '15px Monaco';
	ctx.fillStyle = 'white';
	ctx.fillText(str,(s.x + s.divX),(s.y - s.disPmY));
	
	
	//HTML
	html.chat.div.style.left = (s.x + s.divX) + 'px'; 
	html.chat.div.style.top = (s.y + s.divY) + 'px'; 
	
	html.chat.text.style.font = s.chatcharY + 'px Monaco';
	html.chat.text.style.width = (s.w - 2*s.divX) + 'px';
	html.chat.text.style.height = (s.h - 2*s.divY - s.personalChatY) + 'px'
	html.chat.text.style.left = s.divX + 'px'; 
	html.chat.text.style.top = s.divY + 'px'; 
	
	chatUserName.style.font = s.personalChatY + 'px Monaco';
	
	html.chat.input.size=(50-player.name.length).toString();
	html.chat.input.maxlength="150";	
	html.chat.input.style.font = s.personalChatY + 'px Monaco';
	html.chat.input.style.height = s.personalChatY + 'px'
		
	html.dialogue.div.style.width = (s.w - 2*s.divX) + 'px';
	html.dialogue.div.style.height = (s.h - 2*s.divY) + 'px'
	html.dialogue.div.style.left = (s.x + s.divX) + 'px'; 
	html.dialogue.div.style.top = (s.y + s.divY + s.dialogueTopDiffY) + 'px'; 
	
	//MainBox
	ctx.globalAlpha = 0.8;
	ctx.fillStyle="#F5DEB3";
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
			
	html.dialogue.div.style.visibility = "visible";
	html.dialogue.text.style.width = s.w - 2*s.textBorder + 'px';
	html.dialogue.text.innerHTML = dia.text;		
	
	if(dia.face){
		html.dialogue.text.style.width = s.w - 2*s.textBorder-s.faceX + 'px';
		html.dialogue.div.style.left = (s.x + s.divX + s.textBorder + s.faceX) + 'px';
		ctx.drawImage(Img.face,0,0,96,96,s.facesX,s.y+s.facesY,96,96);
		ctx.font="20px Monaco";
		ctx.textAlign = 'center';
		ctx.fillText(dia.face.name,s.facesX+96/2,s.y+s.facesY+96+5);
		ctx.textAlign = 'left';
	} 
	
	//Options
	if(dia.option){
		ctx.font = s.optionY + 'px Monaco';
		for(var i in dia.option){
			ctx.fillText('-' + dia.option[i].text,s.numX,nY+i*s.optionY);
			
			Button.creation(0,{
				"rect":[s.numX,s.numX+s.h,nY+i*s.optionY,nY+s.optionY+i*s.optionY],
				"left":{"func":Chat.send.command,"param":['$dia,option,' + i]},
				"text":dia.option[i].text
			});	
			
		}
	}
}

Draw.chat.constant = function(){
	return  {
		w:600,
		h:200,
		x:0,
		y:Cst.HEIGHT-200,
		numX:5,			//border for text
		faceX:96 + 5,	//push dia text by that if has face
		facesX:8,		//border for face	
		facesY:30,		//border for face
		optionY:20,		//Y between options
		textBorder:20, //distance between border of box and where text starts, applied to start and end
		personalChatY:20, //size for player own written stuff (chatBox not dialogue)
		
		dialogueTopDiffY:10,
		
		chatcharY:20, 
		
		divX:5,
		divY:5,
		
		//pm
		pmY:200,
		disPmY:20, //distance between botoom of pm and top of chat
		pmcharY:20,
		pmDivY:5,
	}
}

Draw.icon = function(info,xy,size){
	size = size || 32;
	var slot = Img.icon.index[info];
	ctx.drawImage(Img.icon,slot.x,slot.y,Cst.ICON,Cst.ICON,xy[0],xy[1],size,size);
}

Draw.item = function(info,xy,size){
	size = size || 32;
	Draw.icon(typeof info === 'string' ? info : info[0],xy,size);
	
	var amount = typeof info === 'string' ? 1 : Math.floor(info[1]);
	
	if(amount > 1){
		if(amount >= 100000){
			amount = Math.floor(amount/1000);
			if(amount >= 10000){
				amount = Math.floor(amount/1000);
				amount = amount + "M";} 
			else { amount = amount + "K";}
		}
			
		ctx.globalAlpha = 0.8;
		ctx.fillStyle = "black";
		ctx.strokeStyle = "white";
		ctx.roundRect(xy[0]-2,xy[1]+size-2,size+4,15);
		ctx.globalAlpha = 1;
		
				
		ctx.fillStyle = "yellow";
		ctx.font= size/32*13 + "px Monaco";
		ctx.fillText(amount,xy[0],xy[1]+size-2);
	}
	
}

Draw.element = function(x,y,w,h,data,noover){
	var initCtx = ctx.name;
	var xx = x;
	ctx.save();
	ctx.textAlign = 'left';
	ctx.strokeRect(x,y,w,h);
	var total = 0; for(var i in data){	total += data[i]; }
	
	var mx = Math.min(Input.mouse.x,Cst.WIDTH-150);
	var my = Math.min(Input.mouse.y,Cst.HEIGHT-25);
	
	for(var i in data){
		var length = w*data[i]/total;
		
		if(length > 2){
			ctx.fillStyle = Cst.element.toColor[i];
			ctx.roundRect(x,y,length,h);
		}
		if(Collision.PtRect(Collision.getMouse(),[x,x+length,y,y+h])){
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
		if(amount < 1){ amount = round(data[mouseOverRatio]*100,0) + '%' }
		else { amount = round(data[mouseOverRatio],0) }
		
		var text = mouseOverRatio.capitalize() + ': ' + amount;
		var width = ctx.measureText(text).width;
		ctx.fillStyle = Cst.element.toColor[mouseOverRatio];
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
	if(boost.type === 'custom'){ return Db.customBoost[boost.value].name; }

	var name = Db.stat[boost.stat].name;
	
	//Round and add %
	var value = boost.value;
	var rawValue = boost.value;
	if(Math.abs(value) < 1){ 
		value *= 100; value = round(value,2).toString() + '%';
	} else { value = round(value,2)};
	
	
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
	var text = main.context.text || main.clientContext.text || main.permContext.text;
	var top = main.context.textTop;
	var hc = html.context.div;
	
	if(!hc.innerHTML || hc.innerHTML !== text){
		if(!top){
			hc.style.left = (Input.mouse.x + 25).mm(0,Cst.WIDTH-25) + 'px';
			hc.style.top = (Input.mouse.y + 25).mm(0,Cst.HEIGHT-25) + 'px';
		} else {
			hc.style.left = Cst.WIDTH/2-150 + 'px'
			hc.style.top = "25px"
			text = '<font size="5">' + text + '</font>'
		}
	}
	hc.innerHTML = text;
	if(hc.innerHTML){
		hc.style.visibility = 'visible';
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





