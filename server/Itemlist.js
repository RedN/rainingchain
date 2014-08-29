//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Tk','Chat','Button'],['Itemlist']));

var Itemlist = exports.Itemlist = {};

Itemlist.template = function(type,data){
	var tmp = {
		type:type,
		key:'not_set',
		toUpdate:1,
		toUpdateOther:1,
		alwaysStack:type === 'bank',
		size:type === 'bank' ? 128 : 20,
		acceptTrade:false,
	};
	tmp.data = Array(tmp.size);	
    for(var i = 0 ; i < tmp.data.length ; i++) tmp.data[i] = [];
	
	if(data) for(var i in data) tmp.data[i] = data[i];
	
    return tmp;
}

Itemlist.format = function(id,amount,verify){	//verify is for quest, verification be done later
	var tmp = {};
	if(Array.isArray(id)){
		for(var i in id){
			if(!id[i][0]) continue;
			tmp[id[i][0]] = tmp[id[i][0]] || 0;
			tmp[id[i][0]] += id[i][1] || 1;
		}
	}
	else if(typeof id === 'string')	tmp[id] = amount || 1;
	else if(typeof id === 'object') tmp = id;
	
	for(var i in tmp){
		if(verify !== false && !Db.item[i]){ ERROR(3,'item dont exist',i,tmp); delete tmp[i]; }
		if(Math.floor(tmp[i]) !== tmp[i]){ ERROR(3,'item amount isnt whole',i,tmp[i]); delete tmp[i]; }
		if(tmp[i] === 0) delete tmp[i];
	}
	return tmp;
}

Itemlist.add = function (inv,id,amount){	//only preparing
	if(typeof inv === 'string') inv = List.main[inv].invList;
	var list = Itemlist.format(id,amount);	
	for(var i in list) Itemlist.add.action(inv,i,list[i]);	
}

Itemlist.add.action = function(inv,id,amount){
	inv.toUpdate = 1;
	inv.toUpdateOther = 1;
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
	inv.toUpdate = 1;
	inv.toUpdateOther = 1;
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
	var list = Itemlist.format(id,amount);	
	
	var spaceNeeded = 0;
	for(var i in list){
		if(Db.item[i].stack || inv.alwaysStack)	spaceNeeded += Itemlist.have(inv,i) ? 0 : 1;
		else spaceNeeded += list[i];
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
	
	var a = Tk.stringify(list);
	for(var i in list){
		list[i] = Math.min(list[i],Itemlist.getAmount(inv,i));
		if(list[i] < 0) delete list[i];
	}
	
	if(allornothing && a !== Tk.stringify(list)) return false;
	if(!Itemlist.test(other,list)) return false;
	
	Itemlist.remove(inv,list);
	Itemlist.add(other,list);	
	return true;
}

Itemlist.transfer.bank = function(key,inv,id,amount){
	Itemlist.transfer(List.main[key].bankList,inv,id,amount);
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
		if(mw.bank){ 
			if(!Db.item[id].bank) return 'cant bank'; 
			var list = m.bankList;
		}
		if(mw.trade){ 
			if(!Db.item[id].trade) return 'cant trade';
			var list = m.tradeList; 
			Itemlist.trade.resetAccept(inv); 
		}
		
		if(side === 'left') return Itemlist.transfer(inv,list,id,1);
		if(side === 'shiftLeft') return Itemlist.transfer(inv,list,id,amount);		
		
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
		
			
		return;		
	}
	
	//No Window
	var item = Db.item[inv.data[slot][0]];
	if(side === 'left'){	
		if(m.selectInv){	//select inv
			var param = Tk.deepClone(m.selectInv.data.param);
			param.push(inv.data[slot][0]);				
			Tk.applyFunc.key(key,m.selectInv.data.func,param,List);
			return;
		}
		var opt = item.option[0];
		if(opt && opt.name !== 'Drop' && opt.name !== 'Destroy' && opt.func && !opt.client){
			Tk.applyFunc.key(key,opt.func,opt.param,List); 
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
	Itemlist.trade.resetAccept(trade);
}

//Actual trade function is Command.list['win,trade,toggle']
Itemlist.trade = function(trade,other){
	if(!Itemlist.trade.test(trade,other)) return false;
	
	Itemlist.add(List.main[trade.key].invList,other.data);
	Itemlist.add(List.main[other.key].invList,trade.data);
	
	Chat.add(trade.key,'Trade Accepted.');
	Chat.add(other.key,'Trade Accepted.');
	
	Itemlist.trade.resetData(trade);
	Itemlist.trade.resetData(other);
	
	Itemlist.trade.reset(trade);
	Itemlist.trade.reset(other);
	return true;
}

Itemlist.trade.reset = function(trade){	//BAD	TODO
	trade.acceptTrade = false;
	Itemlist.add(List.main[trade.key].invList,trade.data);
	Itemlist.trade.resetData(trade);
	
}

Itemlist.trade.resetData = function(list){
	for(var i in list.data) list.data[i] = [];
	list.toUpdate = 1;
	list.toUpdateOther = 1;
}

Itemlist.trade.resetAccept = function(trade){
	trade.acceptTrade = false;
	List.main[trade.key].tradeInfo.acceptTrade = false;
	trade.toUpdate = 1;
	trade.toUpdateOther = 1;
	List.main[trade.key].tradeInfo.toUpdate = 1;
	List.main[trade.key].tradeInfo.toUpdateOther = 1;
}

Itemlist.trade.test = function(trade,other){
	if(!Itemlist.test(List.main[trade.key].invList,other.data)) return false;
	if(!Itemlist.test(List.main[other.key].invList,trade.data)) return false;
	return true;
}















