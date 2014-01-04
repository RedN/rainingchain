//First param is invlist AKA requires nokey:true

Itemlist = {};

//Add item in inventory
Itemlist.add = function (inv,id,amount){
	amount = amount || 1;
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

//Itemlist.have(inv,

Itemlist.add.bulk = function (inv,array_items){
	for(var i in array_items){
		Itemlist.add(inv,array_items[0],array_items[1] || 1);
	}	
}

//Test if theres enough place for all the items (array of items)
Itemlist.test = function (inv,array_items){
	//Fast Test this
	if(array_items.length <= Itemlist.empty(inv)){
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
	return spaceNeeded <= inv.empty()
}

//Return first position of first empty slot
Itemlist.firstEmpty = function(inv){
    for(var i = 0; i < inv.data.length; i++){
	    if(inv.data[i].length === 0){ 
		    return i;	
		}
	}
	return -1;
}

//Remove item in inventory
Itemlist.remove = function (inv,id,amount){
	amount = amount || 1;
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
		Itemlist.remove(inv,array_items[0],array_items[1] || 1);
	}	
}

//Return amount of empty slots. (If amount is speficied, return if empty
Itemlist.empty = function (inv,amount){
	var empty = 0;
	for(var i in inv.data){
		if(inv.data[i].length === 0){ empty++; }
	}

	if(!amount){return empty} 
	else {return (empty >= amount)}	
}

Itemlist.have = function (inv,id,amount,info){
	amount = amount || 1;
	info = info || "bool";
	
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
//return what info should be in db
Itemlist.toDb = function(){
    return inv.data;
}

//return what to send to client 
Itemlist.toClient = function(){
    var ret = [];
	
	for(var i in inv.data){
		ret[i] = '';
		if(inv.data[i][0]){
            ret[i] = [];
            ret[i][0] = Db.item[inv.data[i][0]].visual;
			ret[i][1] = inv.data[i][1];
			ret[i][2] = Db.item[inv.data[i][0]].name;
		}
	}
	
	return ret;
}

Itemlist.toString = function(inv){
    return inv.data.toString();
}

Itemlist.transfer = function(inv,other,id,amount){
	amount = amount || 1;
	amount = Math.min(amount,inv.have(id,0,'amount'));
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




//Inventory
Itemlist.template = function(type){
	var tmp = {};
	tmp.type = type;
	tmp.key = 'not_set';
	if(type === 'inventory'){
		tmp.alwaysStack = false;
		var size = 24;	
	}
	if(type === 'bank'){
		tmp.alwaysStack = true;
		var size = 40;	
	}
	tmp.data = Array(size);	
    for(var i = 0 ; i < tmp.data.length ; i++) tmp.data[i] = [];
	
    return tmp;
}



Itemlist.click = {};

Itemlist.click.inventory = function(inv,side,slot){
	var key = inv.key;
	var m = List.main[key];
	var mw = m.windowList;
	if(!inv.data[slot].length) return;
	
			
	//If Bank Window
	if(mw.bank){
		if(side === 'left'){ Itemlist.transfer(inv,List.main[inv.key].bankList,inv.data[slot][0],1); }
		
		if(side === 'right'){ 
			var id = inv.data[slot][0];
			
			Button.optionList(key,{
				'name':Db.item[id].name,
				'option':[
					{'name':'Deposit 5','func':Itemlist.transfer,'param':[inv,m.bankList,id,5],'nokey':true},
					{'name':'Deposit 25','func':Itemlist.transfer,'param':[inv,m.bankList,id,25],'nokey':true},
					{'name':'Deposit 100','func':Itemlist.transfer,'param':[inv,m.bankList,id,100],'nokey':true},
					{'name':'Deposit 1000','func':Itemlist.transfer,'param':[inv,m.bankList,id,1000],'nokey':true},
					{'name':'Deposit ' + m.pref.bankTransferAmount,'func':Itemlist.transfer,'param':[inv,m.bankList,id,m.pref.bankTransferAmount],'nokey':true},
				]
			});
		}
		return;		
	}
	
	//No Window
	var item = Db.item[inv.data[slot][0]];
	if(side === 'left'){	
		if(m.temp.selectInv){
			var array = [inv.data[slot][0]];
			for(var i = List.main[key].temp.selectInv.param.length-1 ; i >= 0 ; i--){
				array.unshift(List.main[key].temp.selectInv.param[i]); }
				
			applyFunc.key(key,List.main[key].temp.selectInv.func,array);
			return;
		}
		
		if(item.option[0] && item.option[0].name !== 'Drop' && item.option[0].func){
			applyFunc.key(key,item.option[0].func,item.option[0].param); 
			if(item.remove){ Itemlist.remove(inv,key,item.id); }
		}	
	}

	if(side === 'shiftLeft'){
		List.main[key].chatInput = ['[[' + item.id + ']]',0,1];
	}


	if(side === 'right'){
		Button.optionList(key,{'name':item.name,'option':item.option});
	}
}




Itemlist.click.bank = function(bank,slot,side){
	if(!bank.data[slot].length){ return; }
	if(side === 'left'){
		var inv = List.main[bank.key].invList;
		Itemlist.transfer(bank,inv.data[slot][0],1);
		return;
	}
	if(side === 'right'){
		var id = bank.data[slot][0];
		Button.optionList(key,{
			'name':Db.item[id].name,
			'option':[
				{'name':'Withdraw 5','func':Itemlist.transfer,'param':[bank,inv.data[slot][0],5]},
				{'name':'Withdraw 25','func':Itemlist.transfer,'param':[bank,inv.data[slot][0],25]},
				{'name':'Withdraw 100','func':Itemlist.transfer,'param':[bank,inv.data[slot][0],100]},
				{'name':'Withdraw 1000','func':Itemlist.transfer,'param':[bank,inv.data[slot][0],1000]},
				{'name':'Withdraw ' + List.main[key].pref.bankTransferAmount,'func':Itemlist.transfer,'param':[bank,inv.data[slot][0],List.main[key].pref.bankTransferAmount]},
			]
		});
	}
}






