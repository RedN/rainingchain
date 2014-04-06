
//Sub Function
function expBetweenLvl(start,end){
	return lvlList[end]-lvlList[start];
}

function setYoutube(info){
	if(typeof info == 'number' || typeof info == 'string' ){
		var src = 'http://www.youtube.com/v/' + videoId + '&hl=en_US&start=' + info;
	} else {
		var src = 'http://www.youtube.com/v/' + info.id + '&hl=en_US&start=' + info.time;
	}
	youtubeDiv.innerHTML = '<iframe id="youtube" width="420" height="315" src="' + src + '" frameborder="0" allowfullscreen></iframe>';
}

function convertForSorting(a){
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

function changeSort(newSort){
	sortBy = newSort;
	sortSign *= -1;
	update();
}

function convertLight(str){
	str = str.replaceAll('> ',' >');
	str = str.replaceAll('> ',' >');
	str = str.replaceAll('<br>',' \r\n');
	str = str.replace(/<[^>]*>/g,'');
	str = str.trim();
	return str;
}

function colorSign(pre){
	var num = pre;
	if(typeof num == 'string'){ num = Number(num.replaceAll(',','')); }
	
	if(num < 0){ return '<font color="#B00000">' + pre + '</font>' }
	if(num == 0){ return '<font color="yellow">' + pre + '</font>' }
	if(num > 0){ return '<font color="#00B000">' + pre + '</font>' }
}

function getLvlViaExp(exp){
	exp = Math.max(0,Math.min(200000000,exp));
	
	var lvl = 0;
	while(exp >= lvlList[lvl]){
		lvl++;
	}
	lvl
	return lvl - 1;
}

function convertTime(time){
	/*
	var hour = Math.floor(time/1);
	var r = time % 1;
	r  = Math.round(r * 60,0);
	r = '' + r;
	if(r.length == 1){ r = '0'+r; }
	return hour + ':' + r;
	*/
	return round(time,2);
}


function minTable(div){
	var str = div.innerHTML;
	str = str.replace(/<img[^>]*>/g,'');
	str = str.replace(/<\/img[^>]*>/g,'');
	
	for(var i in minConvert){str = str.replaceAll(i,minConvert[i]);}

	div.innerHTML = str;

}

function changeSkill(){
	var newskill = skillInput.value;
	window['init' + newskill]();
	initAll();
	
	document.getElementById('skillImg').src = skillList[newskill];
}

function help(){
	document.getElementById('helpDiv').hidden = !document.getElementById('helpDiv').hidden;
}






