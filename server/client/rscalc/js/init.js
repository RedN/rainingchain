
(function(){
	for(var i in skillList){
		IMG[i] = '<img src="' + skillList[i] + '" alt="" height=' + ICON + ' width=' + ICON + '></img>';
	}


	var array = {'sell':[1,2,3],'buy':[1,2,3]};
	for(var i in array){
		for(var j in array[i]){
			IMG[i+array[i][j]] = '<img title="Warning: Some items may be hard to ' + i + '." src="/img/' + i+array[i][j] + '.png' + '" alt="" height=' + ICON/1.2 + ' width=' + ICON/1.2 + '></img>';
		}
	}



	var str = '<form>'; 
	for(var i in headerList){
		var checkStatus = '';
		if(headerList[i]){ checkStatus = 'checked'; }
		str += '<input onchange="update();" type="checkbox" title="'+ i +'" class="headerInput" value="' + i + '"' + checkStatus + '>' + minConvert[i] +' ';
	}
	str += '</form>'; 
	wantedHeaderDiv.innerHTML = str;


	var str = '<form>'; 
	for(var i in headerList99){
		var checkStatus = '';
		if(headerList99[i]){ checkStatus = 'checked'; }
		str += '<input onchange="update();" type="checkbox" title="'+ i +'" class="headerInput99" value="' + i + '"' + checkStatus + '>' + minConvert[i] +' ';
	}
	str += '</form>'; 
	wantedHeaderDiv99.innerHTML = str;
})();







//Start Everything
function initAll(){
	initBoostInput();	
	methodList = initMethodDb();
	update();
}

function initBoostInput(){
	var str = 'Boost: ';
	for(var i in boostList){
		var name = i; if(minConvert[i]){ name = minConvert[i]; }
		var checkStatus = ''; if(boostList[i].check){ checkStatus = 'checked'; }
		str += '<input onchange="update();" type="checkbox" title="'+ i +'" class="boostInput" value="' + i + '"' + checkStatus + '>' + name +' ';
	}
	boostDiv.innerHTML = str;
}

function initMethodDb(){
	//Add Methods to Db for Mod/Function
	for(var i = 0 ; i < methodPreDb.length ; i++){
		var m = methodPreDb[i];
		for(var j in m.mod){
			var newMethod = modList[j](m);
			newMethod.hide = m.mod[j];
			methodPreDb.push(newMethod);		
		}		
	}	
	
	
		
	for(var i in methodPreDb){
		var m = methodPreDb[i];
		if(m.hide == undefined){ m.hide = 0; }
		if(m.credit == undefined){ m.credit = ""; }
		if(m.exclude == undefined){ m.exclude = 0; }
		if(m.req == undefined){ m.req = {}; }
		if(m.boost == undefined){ m.boost = []; }
		if(m.video == undefined){ m.video = ''; }
		
		if(typeof m.expPa != 'object'){ m.expPa = [m.expPa]; }
		m.id = m.name + m.lvl;
		var temp = Tk.deepClone(m);
		m.base = temp;
		
		if(m.warn == undefined){
			m.warn = {'sell':0,'buy':0};
			for(var i in m.input){
				if(!itemDb[i]){	initItem(i); }
				if(itemDb[i].buy){ m.warn.buy = Math.max(m.warn.buy,itemDb[i].buy); }
			}
			for(var i in m.output){
				if(!itemDb[i]){	initItem(i); }
				if(itemDb[i].sell){ m.warn.sell = Math.max(m.warn.sell,itemDb[i].sell); }
			}
		}
		
		excludeList[m.id] = m.exclude;
		methodDb.push(m);
	}
		
		
		
	/*
	if(typeof m.actionPh == 'function'){
		for(var i = m.lvl ; i <= 99 ; i++){
			var newMethod = Tk.deepClone(m);
			newMethod.lvl = i;
			newMethod.nameBase = newMethod.name;
			newMethod.name += ' Lv' + i;
			newMethod.hide = 3;
			newMethod.actionPh = m.actionPh(i);		
			methodDb.push(newMethod);
		}
		var n = methodDb[methodDb.indexOf(m)];
		n.actionPhRange = [n.actionPh(n.lvl),n.actionPh(99)];
		n.actionPh = n.actionPh(n.lvl);
		
	}
	*/
	
		
	return methodDb
	
}


function initItem(i,data){
	if(!data){ data = {}; }
	if(!data.price){ data.price = 0; }
	if(!data.id){ data.id = 555; }
	if(!data.name){ data.name = i.capitalize(); }
	
	itemDb[i] = data;
	
	GEP[i] = data.price;
	
	if(data.price == 0){
		IMG[i] = '<img src="/img/items/' + data.id + '.png" alt=" =/ "  onerror="imgError(this);" itemId="' + data.id + '"height=' + ICON + ' width=' + ICON + '>';
	} else {
		IMG[i] = '<img src="http://services.runescape.com/m=itemdb_rs/4213_obj_sprite.gif?id=' + data.id + '" itemId="' + data.id + '" alt=" =/ " onerror="imgError(this);" height=' + ICON + ' width=' + ICON + '>';
	}
	itemDb[i].image = IMG[i];
}


updatePrice((function(){ initCrafting(); initAll();}));





function imgError(image) {
	if(image.errorCount === undefined){ image.errorCount = 0; }
	image.errorCount++;
	
	var itemId = '';
	itemId = image.src.slice(image.src.indexOf('id=')+3);
	
	image.onerror = "";
	if(image.errorCount == 1){
		image.src = "http://services.runescape.com/m=itemdb_rs/4221_obj_sprite.gif?id=" + itemId;
	}
	if(image.errorCount == 2){
		image.src = '"/img/items/' +itemId + '.png"';
	}
	if(image.errorCount > 2){
		image.src = "";
	}
	return true;
}









