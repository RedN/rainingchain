Inventory = function(key,data,length,alwaysStack){
	this.key = key;
	this.alwaysStack = alwaysStack || false;	
	
	if(data){
	    this.data = data;
	    return this;
	}
	
	length = length || 24; 
    this.data = Array(length);	
    for(var i = 0 ; i < this.data.length ; i++) this.data[i] = [];
    
    return this;
}



//Add item in inventory
Inventory.prototype.add = function (id,amount){
	amount = amount || 1;
	if(itemDb[id].stack || this.alwaysStack){
		if(this.have(id)){
			this.data[this.have(id,1,"position")][1] += amount;
		} else if(this.empty(1)){
			this.data[this.firstEmpty()] = [id,amount];
		}
	} else {
		amount = Math.min(amount,this.empty());
		for(var i = 0 ; i < amount ; i++){
			this.data[this.firstEmpty()] = [id,1];
		}
	}
	
	
}

//Test if theres enough place for all the items (array of items)
Inventory.prototype.test = function (array_items){
	//Fast Test this
	if(array_items.length <= this.empty()){
		return true;
	} 
	var spaceNeeded = 0;
	for(var i in array_items){
		var item = array_items[i];
		if(typeof item[0] !== 'string'){ item[0] = item[0].id; }	//Case put obj instead of id
		if(!item[1]){ item[1] = 1; }
		
		if( (!itemDb[item[0]].stack && (!this.bank || this.bank && !this.have(item[0]))) ||
		        (itemDb[item[0]].stack && !this.have(item[0]))  ){
			spaceNeeded++;
		}	
	}
	return spaceNeeded <= this.empty()
}

//Return first position of first empty slot
Inventory.prototype.firstEmpty = function(){
    for(var i = 0; i < this.data.length; i++){
	    if(this.data[i].length === 0){ 
		    return i;	
		}
	}
	return -1;
}

//Remove item in inventory
Inventory.prototype.remove = function (id,amount){
	amount = amount || 1;
	if(itemDb[id].stack || this.alwaysStack){
		for(var i = 0 ; i < this.data.length ; i ++){
			if(this.data[i][0] === id){
				this.data[i][1] -= amount;
				if(this.data[i][1] <= 0){
					this.data[i] = '';
					break;
				}
			}
		}
	} else {
		for(var i = 0 ; i < this.data.length && amount > 0 ; i ++){
			if(this.data[i][0] === id){
				this.data[i] = '';
				amount--;
				i--;
			}
		}
	}
	
}

//Return amount of empty slots. (If amount is speficied, return if empty
Inventory.prototype.empty = function (amount){
	var empty = 0;
	for(var i in this.data){
		if(this.data[i].length === 0){ empty++; }
	}

	if(!amount){return empty} 
	else {return (empty >= amount)}	
}

Inventory.prototype.have = function (id,amount,info){
	amount = amount || 1;
	info = info || "bool";
	
	if(itemDb[id].stack || this.alwaysStack){	
		for(var i = 0 ; i < this.data.length ; i++){
			if(this.data[i][0] === id){
				if(info == "bool"){	return (this.data[i][1] >= amount)} 
				if(info == "amount"){return this.data[i][1]}
				if(info == "position"){	return i}
				break;
			}
		}
	} else {
		var num = 0;
		for(var i = 0 ; i < this.data.length ; i++){
			if(this.data[i][0] === id){
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

//return what info should be in db
Inventory.prototype.toDb = function(){
    return this.data;
}

//return what to send to client 
Inventory.prototype.toClient = function(){
    var ret = [];
	
	for(var i in this.data){
		ret[i] = '';
		if(this.data[i][0]){
            ret[i] = [];
            ret[i][0] = itemDb[this.data[i][0]].visual;
			ret[i][1] = this.data[i][1];
		}
	}
	
	return ret;
}

Inventory.prototype.toString = function(){
    return this.data.toString();
}

Inventory.prototype.click = function(slot,side){
	var key = this.key;
	var m = mainList[key];
	var inv = m.invList;
	var mw = m.windowList;
	if(!inv.data[slot][0]) return;
	
		//Left
	if(side === 'left'){
		if(mw.bank){transferInvBank(key,inv.data[slot][0],1);	return;}
		if(mw.trade){transferInvTrade(key,inv.data[slot][0],1);	return;}
		if(mw.shop){transferInvShop(key,'player',inv.data[slot][0],1);	return;}
		
		if(m.temp.selectInv){
			var array = [this.data[slot][0]];
			for(var i = mainList[key].temp.selectInv.param.length-1 ; i >= 0 ; i--){
				array.unshift(mainList[key].temp.selectInv.param[i]); }
				
			keyFunction(key,mainList[key].temp.selectInv.func,array);
			return;
		}
		
		var item = itemDb[this.data[slot][0]];
		if(item.option[0] && item.option[0].name != 'Drop' && item.option[0].func){
			keyFunction(key,item.option[0].func,item.option[0].param); 
			if(item.remove){ this.remove(key,item.id); }
		}
	}	


	if(side === 'shiftLeft'){
		var item = itemDb[this.data[slot][0]];
		mainList[key].chatInput = ['[[' + item.id + ']]',0,1];
	}


	if(side === 'right'){
		if(!mw.bank && !mw.shop && !mw.trade){
			var item = itemDb[inv.data[slot][0]];
			var player = fullList[key];
			setOptionList(key,{'name':item.name,'option':item.option});
		}

		if(mw.bank){
			var id = this.data[slot][0];
			setOptionList(key,{
				'name':itemDb[id].name,
				'option':[
					{'name':'Deposit 5','func':'transferInvBank','param':[id,5]},
					{'name':'Deposit 25','func':'transferInvBank','param':[id,25]},
					{'name':'Deposit 100','func':'transferInvBank','param':[id,100]},
					{'name':'Deposit 1000','func':'transferInvBank','param':[id,1000]},
					{'name':'Deposit ' + m.pref.bankTransferAmount,'func':'transferInvBank','param':[id,m.pref.bankTransferAmount]},
				]
			});
		}
		
		if(mw.shop){transferInvShop(key,'player',this.data[slot][0],100);}
	}

};