//First param is invlist
//ts('Main.openWindow(m,"bank")')

Itemlist = {};

Itemlist.add = function (inv,id,amount){
	if(typeof inv === 'string') inv = List.main[inv].invList;
	amount = amount || 1;
	
	if(!Db.item[id]){ DEBUG(0,'item dont exist' + id); return false;}
	if(Db.item[id].stack || inv.alwaysStack){
		if(Itemlist.have(inv,id)){
			inv.data[Itemlist.have(inv,id,1,"position")][1] += amount;
		} else if(Itemlist.empty(inv,1)){
			inv.data[Itemlist.firstEmpty(inv)] = [id,amount];
		}
	} else {
		amount = Math.min(amount,Itemlist.empty(inv));
		for(var i = 0 ; i < amount ; i++){
			inv.data[Itemlist.firstEmpty(inv)] = [id,1];
		}
	}
}

Itemlist.add.bulk = function (inv,array_items){
	for(var i in array_items){
		Itemlist.add(inv,array_items[i][0],array_items[i][1] || 1);
	}	
}

Itemlist.test = function (inv,array_items){ //Test if theres enough place for all the items (array of items)
	if(typeof inv === 'string') inv = List.main[inv].invList;
	
	//Fast Test this
	if(array_items.length <= Itemlist.empty(inv)){	//no true if element is not stackable	//TOFIX
		return true;
	} 
	var spaceNeeded = 0;
	for(var i in array_items){
		var item = array_items[i];
		if(typeof item[0] !== 'string'){ item[0] = item[0].id; }	//Case put obj instead of id
		if(!item[1]){ item[1] = 1; }
		
		if( (!Db.item[item[0]].stack && (!inv.bank || inv.bank && !Itemlist.have(inv,item[0]))) ||
		        (Db.item[item[0]].stack && !Itemlist.have(inv,item[0]))  ){
			spaceNeeded++;
		}	
	}
	return spaceNeeded <= Itemlist.empty(inv);
}

Itemlist.firstEmpty = function(inv){ //Return first position of first empty slot
    for(var i = 0; i < inv.data.length; i++){
	    if(inv.data[i].length === 0){ 
		    return i;	
		}
	}
	return -1;
}

Itemlist.remove = function (inv,id,amount){
	if(typeof inv === 'string') inv = List.main[inv].invList;
	
	amount = amount || 1;
	if(!Db.item[id]){ DEBUG(0,'item dont exist' + id); return false;}
	if(Db.item[id].stack || inv.alwaysStack){
		for(var i = 0 ; i < inv.data.length ; i ++){
			if(inv.data[i][0] === id){
				inv.data[i][1] -= amount;
				if(inv.data[i][1] <= 0){
					inv.data[i] = '';
					break;
				}
			}
		}
	} else {
		for(var i = 0 ; i < inv.data.length && amount > 0 ; i ++){
			if(inv.data[i][0] === id){
				inv.data[i] = '';
				amount--;
				i--;
			}
		}
	}
	
}

Itemlist.remove.bulk = function (inv,array_items){
	for(var i in array_items){
		Itemlist.remove(inv,array_items[i][0],array_items[i][1] || 1);
	}	
}


Itemlist.empty = function (inv,amount){ //Return amount of empty slots. (If amount is speficied, return if empty
	var empty = 0;
	for(var i in inv.data){
		if(inv.data[i].length === 0){ empty++; }
	}

	if(!amount){return empty} 
	else {return (empty >= amount)}	
}

Itemlist.have = function (inv,id,amount,info){
	if(typeof inv === 'string') inv = List.main[inv].invList;
	
	amount = amount || 1;
	info = info || "bool";
	if(!Db.item[id]){ DEBUG(0,'item dont exist ' + id); return false;}
	if(Db.item[id].stack || inv.alwaysStack){	
		for(var i = 0 ; i < inv.data.length ; i++){
			if(inv.data[i][0] === id){
				if(info == "bool"){	return (inv.data[i][1] >= amount)} 
				if(info == "amount"){return inv.data[i][1]}
				if(info == "position"){	return i}
				break;
			}
		}
	} else {
		var num = 0;
		for(var i = 0 ; i < inv.data.length ; i++){
			if(inv.data[i][0] === id){
				num += 1;
			}
		}
		if(info == "bool"){	return (num >= amount)} 
		if(info == "amount"){return num}
		if(info == "position"){	return i}
	}
		
	if(info == "bool"){	return false} 
	if(info == "amount"){return 0}
	if(info == "position"){	return null	}

}

Itemlist.have.bulk = function (inv,array_items){
	for(var i in array_items){
		if(!Itemlist.have(inv,array_items[0],array_items[1] || 1)) return false;
	}	
	return true;
}

Itemlist.transfer = function(inv,other,id,amount){
	amount = Math.min(amount || 1,Itemlist.have(inv,id,0,'amount'));
	if(!Itemlist.test(other,[[id,amount]]) || amount === 0){
		return false;
	} 
	Itemlist.remove(inv,id,amount);
	Itemlist.add(other,id,amount);	
	return true;
}

Itemlist.transfer.bulk = function(inv,other,array_items,allornothing){
	allornothing = allornothing || true;
	if(allornothing){
		if((!Itemlist.test.transfer(other,array_items) || !Itemlist.have.bulk(inv,array_items)))		return false;
	} else {
		array_items = deepClone(array_items);
		for(var i in array_items){
			array_items[i][1] = Math.min((array_items[i][1] || 1),Itemlist.have(inv,array_items[i][0],0,'amount'));
		}
	}
	Itemlist.remove.bulk(inv,array_items);
	Itemlist.add.bulk(other,array_items);
	return true;	
}

Itemlist.transfer.bank = function(key,inv,id,amount){
	Itemlist.transfer(List.main[key].bankList,inv,id,amount);
}

Itemlist.template = function(type,data){
	var tmp = {};
	tmp.type = type;
	tmp.key = 'not_set';
	if(type === 'inventory'){
		tmp.alwaysStack = false;
		var size = 20;	
	}
	if(type === 'bank'){
		tmp.alwaysStack = true;
		var size = 400;	
	}
	tmp.data = Array(size);	
    for(var i = 0 ; i < tmp.data.length ; i++) tmp.data[i] = [];
	
	if(data) for(var i in data) tmp.data[i] = data[i];
	
    return tmp;
}

Itemlist.click = {};

Itemlist.click.inventory = function(inv,side,slot,amount){
	var key = inv.key;
	var m = List.main[key];
	var mw = m.windowList;
	if(!inv.data[slot].length) return;
	var id = inv.data[slot][0];
			
	//If Bank Window
	if(mw.bank || mw.trade){
		if(mw.bank) var list = m.bankList;
		if(mw.trade){ var list = m.tradeList; Itemlist.trade.reset(inv); }
		
		
		if(side === 'left'){ Itemlist.transfer(inv,list,id,1); }
		
		if(side === 'right'){ 
			Button.creation.optionList(key,{
				'name':Db.item[id].name,
				'option':[
					{'name':'Deposit 5','func':Itemlist.transfer,'param':[list,id,5]},
					{'name':'Deposit 25','func':Itemlist.transfer,'param':[list,id,25]},
					{'name':'Deposit 100','func':Itemlist.transfer,'param':[list,id,100]},
					{'name':'Deposit 1000','func':Itemlist.transfer,'param':[list,id,1000]},
				]
			});
		}
		
		if(side === 'shiftLeft'){ Itemlist.transfer(inv,list,id,amount);}				
		return;		
	}
	
	//No Window
	var item = Db.item[inv.data[slot][0]];
	if(side === 'left'){	
		if(m.temp.selectInv){	//select inv
			var array = [inv.data[slot][0]];
			for(var i = List.main[key].temp.selectInv.param.length-1 ; i >= 0 ; i--){
				array.unshift(List.main[key].temp.selectInv.param[i]); }
				
			applyFunc.key(key,List.main[key].temp.selectInv.func,array);
			return;
		}
		
		if(item.option[0] && item.option[0].name !== 'Drop' && item.option[0].func && !item.option[0].client){
			applyFunc.key(key,item.option[0].func,item.option[0].param); 
			if(item.remove){ Itemlist.remove(inv,item.id); }
		}	
	}

	if(side === 'shiftLeft'){
		List.main[key].chatInput = ['[[' + item.id + ']]',0,1];
	}


	if(side === 'right'){
		Button.creation.optionList(key,{'name':item.name,'option':item.option});
	}
}

Itemlist.click.bank = function(bank,side,slot,amount){
	if(!bank.data[slot] || !bank.data[slot].length){ return; }
	var inv = List.main[bank.key].invList;
	var id = bank.data[slot][0];
	var key = bank.key;
		
	if(side === 'left'){
		Itemlist.transfer(bank,inv,id,1);
		return;
	}
	if(side === 'right'){
		Button.creation.optionList(key,{
			'name':Db.item[id].name,
			'option':[
				{'name':'Withdraw 5','func':Itemlist.transfer.bank,'param':[inv,id,5]},
				{'name':'Withdraw 25','func':Itemlist.transfer.bank,'param':[inv,id,25]},
				{'name':'Withdraw 100','func':Itemlist.transfer.bank,'param':[inv,id,100]},
				{'name':'Withdraw 1000','func':Itemlist.transfer.bank,'param':[inv,id,1000]},
			]
		});
	}
	if(side === 'shiftLeft'){ Itemlist.transfer(bank,inv,id,amount);}		
}

Itemlist.click.trade = function(trade,side,slot){
	Itemlist.click.bank(trade,side,slot);
	Itemlist.trade.reset(trade);
}

//Actual trade function is Command.list['win,trade,toggle']
Itemlist.trade = function(trade,other){
	var temp = deepClone(trade.data);
	var temp2 = deepClone(other.data);
	other.data = temp;
	trade.data = temp2;
	Chat.add(trade.key,'Trade Accepted.');
	Chat.add(other.key,'Trade Accepted.');
	Itemlist.trade.reset(trade);
}

Itemlist.trade.reset = function(trade){
	var other = List.main[trade.key].windowList.trade.trader;
	List.main[trade.key].windowList.trade.confirm = {'self':0,'other':0};
	List.main[other].windowList.trade.confirm = {'self':0,'other':0};
}




Itemlist.arrayToObj = function(list){
	var tmp = {};
	for(var i in list)	tmp[list[i][0]] = list[i][1];
	return tmp;
}
Itemlist.objToArray = function(list){
	var tmp = [];
	for(var i in list)	tmp.push([i,list[i]]);
	return tmp;
}


