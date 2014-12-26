//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Message','Button','OptionList','ItemModel','Main'],['ItemList']));

var ItemList = exports.ItemList = function(key,data){
	var tmp = {
		key:key,
		id:key,
		data:data || {},	//id:amount
	};
    return tmp;
}

ItemList.getMain = function(inv){
	return Main.get(inv.id);
}

ItemList._item = function(name,amount,icon){
	return {
		name:name,
		amount:amount || 1,
		icon:icon || '',
	};
}

ItemList.format = function(id,amount,calledFromQuest){	//if calledFromQuest, ItemList.format will be called another time, check itemFormat
	var tmp = {};
	if(Array.isArray(id)) return ERROR(3,'no longer supported');
	else if(typeof id === 'string'){ tmp[id] = amount || 1; }
	else if(typeof id === 'object') tmp = id;
	
	if(!calledFromQuest) for(var i in tmp) { var a = tmp[i]; delete tmp[i]; tmp[ItemModel.getId(i)] = a;  }
	
	for(var i in tmp){
		if(!calledFromQuest && !ItemModel.get(i)){ ERROR(3,'item dont exist',i,tmp); delete tmp[i]; }
		if(Math.floor(tmp[i]) !== tmp[i]){ ERROR(3,'item amount isnt whole',i,tmp[i]); delete tmp[i]; }
		if(tmp[i] === 0) delete tmp[i];
	}
		
	return tmp;
}

ItemList.add = function (inv,id,amount){	//only preparing
	var list = ItemList.format(id,amount);	
	for(var i in list) ItemList.add.action(inv,i,list[i]);	
}

ItemList.add.action = function(inv,id,amount){
	ItemList.setFlag(inv);
	
	inv.data[id] = inv.data[id] || 0;
	inv.data[id] += amount;
}

ItemList.setFlag = function(inv){
	var main = ItemList.getMain(inv);
	if(inv === main.invList) Main.setFlag(main,'invList');
	else if(inv === main.bankList) Main.setFlag(main,'bankList');
}

ItemList.remove = function (inv,id,amount){
	var list = ItemList.format(id,amount);	
	for(var i in list) ItemList.remove.action(inv,i,list[i]);		
}

ItemList.remove.action = function (inv,id,amount){
	ItemList.setFlag(inv);
	inv.data[id] = inv.data[id] || 0;
	inv.data[id] -= amount;
	if(inv.data[id] <= 0)
		delete inv.data[id];
}

ItemList.getAmount = function(inv,id){
	return inv.data[id] || 0;
}

ItemList.have = function (inv,id,amount){
	var list = ItemList.format(id,amount);	
	
	for(var i in list) if(ItemList.getAmount(inv,i) < list[i]) return false;
	return true;
}

//############################

ItemList.transfer = function(originInv,destinationInv,id,amount,verifyIfOwn){
	var list = ItemList.format(id,amount);
	if(verifyIfOwn && !ItemList.contains(originInv,list)) return false;
	ItemList.remove(originInv,list);
	ItemList.add(destinationInv,list);	
	return true;
}


ItemList.stringify = function(list,cb){
	var str = '';
	for(var i in list){
		var item = QueryDb.get('item',i,cb);
		if(!item) return false;
		str += 'x' + list[i] + ' ' + item.name + ',';
	}
	return str.slice(0,-1);
}


