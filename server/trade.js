//trade

//to be converted to Inventory


tradeItem = function(key,other){
	var i1 = List.main[key].tradeList;
	var i2 = List.main[other].tradeList;
	
	if(List.main[key].invList.test(i2) && List.main[other].invList.test(i1)){
		for(var i in i2){ List.main[key].invList.add(i2[i][0],i2[i][1]);}
		for(var i in i1){ List.main[other].invList.add(i1[i][0],i1[i][1]);}
		List.main[key].tradeList = [];
		List.main[other].tradeList = [];
		List.main[key].windowList.trade = 0;
		List.main[other].windowList.trade = 0;
		Chat.add(key,'Trade Accepted.');
		Chat.add(other,'Trade Accepted.');
	} else {
		List.main[key].windowList.trade.confirm = {'self':0,'other':0};
		List.main[other].windowList.trade.confirm = {'self':0,'other':0};
		Chat.add(key,'Inventory Full.');
		Chat.add(other,'Inventory Full.');
	}

}





tradeLeftClick=function(key,slot){
	if(List.main[key].tradeList[slot]){transferTradeInv(key,List.main[key].tradeList[slot][0],1);}
}

tradeRightClick=function(key,slot){
	if(List.main[key].tradeList[slot]){transferTradeInv(key,List.main[key].tradeList[slot][0],100);}
}


transferTradeInv = function (key,id,amount){
	if(!amount){amount = 1;}
	amount = Math.min(amount,haveTrade(key,id,0,'amount'));
	if(!Db.item[id].stack){ amount = Math.min(amount,List.main[key].invList.empty()); }
	if(Db.item[id].stack && !List.main[key].invList.have(id) && !List.main[key].invList.empty(1)){ amount = 0 }
	
	if(amount){	removeTrade(key,id,amount);	List.main[key].invList.add(id,amount);	}
}














