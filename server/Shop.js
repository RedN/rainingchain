//Shop

//no longer used

var SHOP_RESPAWN = 25*60;
var SHOP_RESELL = 0.5;

initShopDb = function(){
	shopDb = {};
		
	shopDb['general'] = {'name':'General Store','stock':{'default':[
		['gold',10],
		['shield',10],
		
		]}};



	for(var i in shopDb){
		for(var j in shopDb[i].stock.default){
			if(!shopDb[i].stock.default[j][2]){
				shopDb[i].stock.default[j][2] = Db.item[shopDb[i].stock.default[j][0]].value;
			}
			shopDb[i].stock.default[j][3] = shopDb[i].stock.default[j][1]; 
		}
	}



}


initShop = function(id,info,extra){
	var shop = info;
	if(typeof info == 'string'){ shop = deepClone(shopDb[shop]); }
	
	if(extra){
		if(extra.name){ shop.name = extra.name; }
		if(extra.stock){ shop.stock.default = shop.stock.default.concat(shop.stock.default,exra.stock); }
	}
	
	shop.id = id;
	shop.type = 'shop';
	shop.stock.player = [];
	
	List.all[shop.id] = shop;
	shopList[shop.id] = shop;
}


Loop.Shop = function(){
	for(var i in shopList){
		for(var j in shopList[i].stock.default){
			var tmp = shopList[i].stock.default[j];
			if(tmp[1] < tmp[3]){
				tmp[1] += tmp[3]/SHOP_RESPAWN;
				tmp[1] = Math.min(tmp[1],tmp[3]);
			}
		}
	}
}



haveShop = function (key,stock,id,amount,info){
	var tmp = shopList[key].stock[stock];
	if(!amount){amount = 1;}
	if(!info){info = "bool";}
	for(var i = 0 ; i < tmp.length ; i++){
		if(tmp[i][0] == id){
			if(info == "bool"){	return (tmp[i][1] >= amount)} 
			if(info == "amount"){return tmp[i][1]}
			if(info == "position"){	return i}
			break;
		}
	}
	
	if(info == "bool"){	return false;} 
	if(info == "amount"){return 0;}
	if(info == "position"){	return null;}
}





addShop = function (key,stock,id,amount){
	var tmp = shopList[key].stock[stock];
	if(!amount){ amount = 1; }
	if(haveShop(key,stock,id)){
		tmp[haveShop(key,stock,id,1,"position")][1] += amount;
	} else if(emptyShop(key,stock,1)){
		tmp.push([id,amount,Db.item[id].value]);
	}
}

testAddShop = function (key,stock,id,amount){
	if(!amount){ amount = 1; }
	if(haveShop(key,stock,id)){ return 1 } 
	else { return emptyShop(key,stock) >= 1;}
}

removeShop = function (key,stock,id,amount){
	var tmp = shopList[key].stock[stock];
	if(!amount){amount = 1;}	
	for(var i = 0 ; i < tmp.length ; i ++){
		if(tmp[i][0] == id){
			tmp[i][1] -= amount;
			if(stock == 'player' && tmp[i][1] < 1){
				tmp.splice(i,1);
				break;
			}
		}
	}
}

emptyShop = function (key,stock,amount){
	if(!amount){return (24 - shopList[key].stock[stock].length)} 
	else {return (24 - shopList[key].stock[stock].length) >= amount}	
}


shopLeftClick = function(key,stock,slot){
	var tmp = List.main[key].windowList.shop.stock[stock][slot];
	var string = Db.item[tmp[0]].name;
	string += ' costs ';
	string += tmp[2];
	string += ' GP each.';
	Chat.add(key,string);
}

shopRightClick = function(key,stock,slot){
	var tmp = List.main[key].windowList.shop.stock[stock][slot];
	var shopid = List.main[key].windowList.shop.id;
	
	var gold = List.main[key].invList.have('gold',1,'amount');
	var cost = tmp[2] * 1;
	if(tmp[1] >= 1){
		if(gold >= cost){
			if(List.main[key].invList.test([[tmp[0],1]])){
				List.main[key].invList.add(tmp[0],1);
				List.main[key].invList.remove('gold',tmp[2]);
				removeShop(shopid,stock,tmp[0],1);	
			} else {Chat.add(key,'Your inventory is full.');	}		
		} else {Chat.add(key,"You don't have enough money for this.");} 
	} else { Chat.add(key,'None in stock right now.'); }
}




transferShopInv = function (key,stock,id,amount){
	var tmp = List.main[key].windowList.shop.stock[stock];
	var shopid = List.main[key].windowList.shop.id;
	if(!amount){amount = 1;}
	amount = Math.min(amount,haveShop(shopid,stock,id,0,'amount'));
	if(!Db.item[id].stack){ amount = Math.min(amount,emptyShop(shopid,stock)); }
	if(Db.item[id].stack && !List.main[key].invList.have(key,id) && !List.main[key].invList.empty(1)){ amount = 0 }
	if(amount){	removeShop(shopid,stock,id,amount); List.main[key].invList.add(id,amount);	}
}

transferInvShop = function (key,stock,id,amount){
	if(Db.item[id].sell){	
		var tmp = List.main[key].windowList.shop.stock[stock];
		var shopid = List.main[key].windowList.shop.id;
		if(!amount){amount = 1;}
		amount = Math.min(amount,List.main[key].invList.have(id,0,'amount'));
		if(!haveShop(shopid,stock,id) && !emptyShop(shopid,stock,1)){ amount = 0 }
		if(amount){	
			addShop(shopid,stock,id,amount); 
			List.main[key].invList.remove(id,amount);
			List.main[key].invList.add('gold',amount*Math.floor(Db.item[id].value*SHOP_RESELL));
		}
	} else {
		Chat.add(key,"You can't sell this item");
	}
}


























