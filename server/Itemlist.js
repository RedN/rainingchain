//First param is invlist
//ts('Main.openWindow(m,"bank")')

Itemlist = {};

Itemlist.format = function(id,amount,verify){	//verify is for quest, verification be done later
	var tmp = {};
	if(Array.isArray(id)){
		for(var i in id){
			tmp[id[i][0]] = tmp[id[i][0]] || 0;
			tmp[id[i][0]] += id[i][1] || 1;
			console.log(tmp[id[i][0]]);
		}
	}
	else if(typeof id === 'string')	tmp[id] = amount || 1;
	else if(typeof id === 'object') tmp = id;
	
	for(var i in tmp){
		if(verify !== false && !Db.item[i]){ ERROR(3,'item dont exist',i,tmp); delete tmp[i]; }
		if(Math.floor(tmp[i]) !== tmp[i]){ ERROR(3,'item amount isnt whole',i,tmp[i]); delete tmp[i]; }
	}
	return tmp;
}

Itemlist.add = function (inv,id,amount){	//only preparing
	if(typeof inv === 'string') inv = List.main[inv].invList;
	var list = Itemlist.format(id,amount);	
	for(var i in list) Itemlist.add.action(inv,i,list[i]);	
}

Itemlist.add.action = function(inv,id,amount){
	if(Db.item[id].stack || inv.alwaysStack){
		var pos = Itemlist.getPosition(inv,id);
		if(pos !== null){ inv.data[pos][1] += amount; return; }
		
		pos = Itemlist.firstEmpty(inv);
		if(pos === null) return;	//no space
		inv.data[pos] = [id,amount];
	} else {
		amount = Math.min(amount,Itemlist.empty(inv));
		for(var i = 0 ; i < amount ; i++){
			inv.data[Itemlist.firstEmpty(inv)] = [id,1];
		}
	}
}

Itemlist.remove = function (inv,id,amount){
	if(typeof inv === 'string') inv = List.main[inv].invList;
	var list = Itemlist.format(id,amount);	
	for(var i in list) Itemlist.remove.action(inv,i,list[i]);		
}

Itemlist.remove.action = function (inv,id,amount){
	if(Db.item[id].stack || inv.alwaysStack){
		for(var i = 0 ; i < inv.data.length ; i ++){
			if(inv.data[i][0] === id){
				inv.data[i][1] -= amount;
				if(inv.data[i][1] <= 0){
					inv.data[i] = [];
					break;
				}
			}
		}
	} else {
		for(var i = 0 ; i < inv.data.length && amount > 0 ; i ++){
			if(inv.data[i][0] === id){
				inv.data[i] = [];
				amount--;
			}
		}
	}
}




Itemlist.test = function (inv,id,amount){ //test if enouhg space
	if(typeof inv === 'string') inv = List.main[inv].invList;
	var list = Itemlist.format(id,amount);	
	
	var spaceNeeded = 0;
	for(var i in list){
		if(Db.item[i].stack || inv.alwaysStack)	spaceNeeded += Itemlist.have(inv,i) ? 0 : 1;
		else spaceNeeded += tmp[i];
	}
	return spaceNeeded <= Itemlist.empty(inv);
}

Itemlist.firstEmpty = function(inv){ //Return first position of first empty slot
    for(var i in inv.data)  if(inv.data[i].length === 0)	return +i;
	return null;
}



Itemlist.empty = function (inv,amount){ //Return amount of empty slots. (If amount is speficied, return if empty
	var empty = 0;
	for(var i in inv.data)	if(inv.data[i].length === 0) empty++; 
	if(amount === undefined) return empty;
	else return empty >= amount;
}

Itemlist.getAmount = function(inv,id){
	if(typeof inv === 'string') inv = List.main[inv].invList;
	
	if(!Db.item[id]){ ERROR(3,'item dont exist',id); return 0;}
	if(Db.item[id].stack || inv.alwaysStack){
		for(var i in inv.data)	if(inv.data[i][0] === id) return inv.data[i][1];
		return 0;
	} else {
		var count = 0;
		for(var i in inv.data)	if(inv.data[i][0] === id) count++;
		return count;
	}
}

Itemlist.getPosition = function(inv,id){
	if(typeof inv === 'string') inv = List.main[inv].invList;
	for(var i in inv.data)	if(inv.data[i][0] === id) return +i;
	return null;
}



Itemlist.have = function (inv,id,amount){
	if(typeof inv === 'string') inv = List.main[inv].invList;
	var list = Itemlist.format(id,amount);	
	
	for(var i in list) if(Itemlist.getAmount(inv,i) < list[i]) return false;
	return true;
}

Itemlist.transfer = function(inv,other,id,amount,allornothing){
	var list = Itemlist.format(id,amount);	
	
	var a = stringify(list);
	for(var i in list){
		list[i] = Math.min(list[i],Itemlist.getAmount(inv,i));
		if(list[i] < 0) delete list[i];
	}
	
	if(allornothing && a !== stringify(list)) return false;
	if(!Itemlist.test(other,list)) return false;
	
	Itemlist.remove(inv,list);
	Itemlist.add(other,list);	
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
		var opt = item.option[0];
		if(opt && opt.name !== 'Drop' && opt.name !== 'Destroy' && opt.func && !opt.client){
			applyFunc.key(key,opt.func,opt.param); 
			if(item.remove){ Itemlist.remove(inv,item.id); }
		}	
	}

	if(side === 'shiftLeft')	List.main[key].chatInput = ['[[' + item.id + ']]',0,1];
	if(side === 'right')	Button.creation.optionList(key,{'name':item.name,'option':item.option});
}

Itemlist.click.bank = function(bank,side,slot,amount){	//amount is from pref
	if(!bank.data[slot] || !bank.data[slot].length){ return; }
	var key = bank.key;
	var inv = List.main[key].invList;
	var id = bank.data[slot][0];
		
	if(side === 'left'){ Itemlist.transfer(bank,inv,id,1);	return;}
	if(side === 'shiftLeft'){ Itemlist.transfer(bank,inv,id,amount); return; }		
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
}

Itemlist.click.trade = function(trade,side,slot){
	Itemlist.click.bank(trade,side,slot);
	Itemlist.trade.reset(trade);
}

//Actual trade function is Command.list['win,trade,toggle']
Itemlist.trade = function(trade,other){
	var temp = Tk.deepClone(trade.data);
	var temp2 = Tk.deepClone(other.data);
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




