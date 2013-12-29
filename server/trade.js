//trade

//to be converted to Inventory


tradeItem = function(key,other){
	var i1 = mainList[key].tradeList;
	var i2 = mainList[other].tradeList;
	
	if(mainList[key].invList.test(i2) && mainList[other].invList.test(i1)){
		for(var i in i2){ mainList[key].invList.add(i2[i][0],i2[i][1]);}
		for(var i in i1){ mainList[other].invList.add(i1[i][0],i1[i][1]);}
		mainList[key].tradeList = [];
		mainList[other].tradeList = [];
		mainList[key].windowList.trade = 0;
		mainList[other].windowList.trade = 0;
		Chat.add(key,'Trade Accepted.');
		Chat.add(other,'Trade Accepted.');
	} else {
		mainList[key].windowList.trade.confirm = {'self':0,'other':0};
		mainList[other].windowList.trade.confirm = {'self':0,'other':0};
		Chat.add(key,'Inventory Full.');
		Chat.add(other,'Inventory Full.');
	}

}




//Trade
addTrade = function (key,id,amount){
	if(!amount){ amount = 1; }
	if(itemDb[id].stack && haveTrade(key,id)){
		mainList[key].tradeList[haveTrade(key,id,1,"position")][1] += amount;
	} else if(emptyTrade(key,1)){
		mainList[key].tradeList.push([id,amount]);
	}
	mainList[key].windowList.trade.confirm = {'self':0,'other':0};
	var other = mainList[key].windowList.trade.trader;
	mainList[other].windowList.trade.confirm = {'self':0,'other':0};
		
}

testAddTrade = function (key,id,amount){
	if(!amount){ amount = 1; }
	if(haveTrade(key,id)){ return 1 } 
	else { return emptyTrade(key) >= 1;}
}

removeTrade = function (key,id,amount){
	if(!amount){amount = 1;}	
	for(var i = 0 ; i < mainList[key].tradeList.length ; i ++){
		if(mainList[key].tradeList[i][0] == id){
			mainList[key].tradeList[i][1] -= amount;
			if(mainList[key].tradeList[i][1] <= 0){
				mainList[key].tradeList.splice(i,1);
				break;
			}
		}
	}
	mainList[key].windowList.trade.confirm = {'self':0,'other':0};
	var other = mainList[key].windowList.trade.trader;
	mainList[other].windowList.trade.confirm = {'self':0,'other':0};
}

emptyTrade = function (key,amount){
	if(!amount){return (96 - mainList[key].tradeList.length)} 
	else {return (96 - mainList[key].tradeList.length) >= amount}	
}

haveTrade = function (key,id,amount,info){
	if(!amount){amount = 1;}
	if(!info){info = "bool";}
	
	for(var i = 0 ; i < mainList[key].tradeList.length ; i++){
		if(mainList[key].tradeList[i][0] == id){
			if(info == "bool"){	return (mainList[key].tradeList[i][1] >= amount)} 
			if(info == "amount"){return mainList[key].tradeList[i][1]}
			if(info == "position"){	return i}
			break;
		}
	}
	if(info == "bool"){	return false} 
	if(info == "amount"){return 0}
	if(info == "position"){	return null	}

}



tradeLeftClick=function(key,slot){
	if(mainList[key].tradeList[slot]){transferTradeInv(key,mainList[key].tradeList[slot][0],1);}
}

tradeRightClick=function(key,slot){
	if(mainList[key].tradeList[slot]){transferTradeInv(key,mainList[key].tradeList[slot][0],100);}
}


transferTradeInv = function (key,id,amount){
	if(!amount){amount = 1;}
	amount = Math.min(amount,haveTrade(key,id,0,'amount'));
	if(!itemDb[id].stack){ amount = Math.min(amount,mainList[key].invList.empty()); }
	if(itemDb[id].stack && !mainList[key].invList.have(id) && !mainList[key].invList.empty(1)){ amount = 0 }
	
	if(amount){	removeTrade(key,id,amount);	mainList[key].invList.add(id,amount);	}
}

transferInvTrade = function (key,id,amount){
	if(itemDb[id].trade){	
		if(!amount){amount = 1;}
		amount = Math.min(amount,mainList[key].invList.have(id,0,'amount'));
		if(!haveTrade(key,id) && !emptyTrade(key,1)){ amount = 0 }
		if(amount){	addTrade(key,id,amount);	mainList[key].invList.remove(id,amount);	}
	} else { Chat.add(key,"You can't trade this item."); }
}















