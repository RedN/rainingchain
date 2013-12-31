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














