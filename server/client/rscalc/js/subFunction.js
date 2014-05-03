
//Sub Function
Sub.expBetweenLvl = function(start,end){
	return lvlList[end]-lvlList[start];
}

Sub.setYoutube = function(info){
	if(typeof info == 'number' || typeof info == 'string' ){
		var src = 'http://www.youtube.com/v/' + videoId + '&hl=en_US&start=' + info;
	} else {
		var src = 'http://www.youtube.com/v/' + info.id + '&hl=en_US&start=' + info.time;
	}
	Html.youtubeDiv.innerHTML = '<iframe id="youtube" width="420" height="315" src="' + src + '" frameborder="0" allowfullscreen></iframe>';
}

Sub.convertForSorting = function (a){
	if(typeof a == 'string'){
		a = a.replaceAll(',','');
		a = a.replaceAll('@','');
		a = a.replaceAll(':','');
		a = a.replace(/<[^>]*>/g,'')
		a = a.trim();
	
		if(!isNaN(Number(a))){
			a = Number(a);
		}
	}
	return a;
}


Sub.convertLight = function (str){
	str = str.replaceAll('> ',' >');
	str = str.replaceAll('> ',' >');
	str = str.replaceAll('<br>',' \r\n');
	str = str.replace(/<[^>]*>/g,'');
	str = str.trim();
	return str;
}

Sub.colorSign = function(pre){
	var num = pre;
	if(typeof num == 'string'){ num = Number(num.replaceAll(',','')); }
	
	if(num < 0){ return '<font color="#B00000">' + pre + '</font>' }
	if(num == 0){ return '<font color="yellow">' + pre + '</font>' }
	if(num > 0){ return '<font color="#00B000">' + pre + '</font>' }
}

Sub.getLvlViaExp = function (exp){
	exp = Math.max(0,Math.min(200000000,exp));
	
	var lvl = 0;
	while(exp >= lvlList[lvl]){
		lvl++;
	}
	lvl
	return lvl - 1;
}

Sub.convertTime = function (time){
	return Tk.round(time,2);
}

Sub.minTable = function (div){
	var str = div.innerHTML;
	str = str.replace(/<img[^>]*>/g,'');
	str = str.replace(/<\/img[^>]*>/g,'');
	
	for(var i in minConvert){str = str.replaceAll(i,minConvert[i]);}

	div.innerHTML = str;

}

Sub.changeSkill = function (){
	var newskill = Html.skillInput.value;
	Init.skill[newskill]();
	Init();
	
	document.getElementById('skillImg').src = IMG[newskill];
}

Sub.help = function (){
	document.getElementById('helpDiv').hidden = !document.getElementById('helpDiv').hidden;
}






