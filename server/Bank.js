
//Bank
Bank = {};

Bank.add = function (key,id,amount){
	if(!amount){ amount = 1; }
	if(Bank.have(key,id)){
		mainList[key].bankList[Bank.have(key,id,1,"position")][1] += amount;
	} else if(Bank.empty(key,1)){
		mainList[key].bankList.push([id,amount]);
	}
	
}

Bank.test = function (key,id,amount){
	if(!amount){ amount = 1; }
	if(Bank.have(key,id)){ return 1 } 
	else { return Bank.empty(key) >= 1;}
}

Bank.remove = function (key,id,amount){
	if(!amount){amount = 1;}	
	for(var i = 0 ; i < mainList[key].bankList.length ; i ++){
		if(mainList[key].bankList[i][0] == id){
			mainList[key].bankList[i][1] -= amount;
			if(mainList[key].bankList[i][1] <= 0){
				mainList[key].bankList.splice(i,1);
				break;
			}
		}
	}
}

Bank.empty = function (key,amount){
	if(!amount){return (96 - mainList[key].bankList.length)} 
	else {return (96 - mainList[key].bankList.length) >= amount}	
}

Bank.have = function (key,id,amount,info){
	if(!amount){amount = 1;}
	if(!info){info = "bool";}
	
	for(var i = 0 ; i < mainList[key].bankList.length ; i++){
		if(mainList[key].bankList[i][0] == id){
			if(info == "bool"){	return (mainList[key].bankList[i][1] >= amount)} 
			if(info == "amount"){return mainList[key].bankList[i][1]}
			if(info == "position"){	return i}
			break;
		}
	}
	if(info == "bool"){	return false} 
	if(info == "amount"){return 0}
	if(info == "position"){	return null	}
}


Bank.click = function(key,slot,side){
	if(!mainList[key].bankList[slot]){ return; }
	if(side === 'left'){
		transferBankInv(key,mainList[key].bankList[slot][0],1);
		return;
	}
	if(side === 'right'){
		var id = mainList[key].bankList[slot][0];
		Button.optionList(key,{
			'name':itemDb[id].name,
			'option':[
				{'name':'Withdraw 5','func':'transferBankInv','param':[id,5]},
				{'name':'Withdraw 25','func':'transferBankInv','param':[id,25]},
				{'name':'Withdraw 100','func':'transferBankInv','param':[id,100]},
				{'name':'Withdraw 1000','func':'transferBankInv','param':[id,1000]},
				{'name':'Withdraw ' + mainList[key].pref.bankTransferAmount,'func':'transferBankInv','param':[id,mainList[key].pref.bankTransferAmount]},
			]
		});
	}
}

transferBankInv = function (key,id,amount){
	if(!amount){amount = 1;}
	amount = Math.min(amount,Bank.have(key,id,0,'amount'));
	if(!itemDb[id].stack){ amount = Math.min(amount,mainList[key].invList.empty()); }
	if(itemDb[id].stack && !mainList[key].invList.have(id) && !mainList[key].invList.empty(1)){ amount = 0 }
	
	if(amount){	Bank.remove(key,id,amount);	mainList[key].invList.add(id,amount);	}
}

transferInvBank = function (key,id,amount){
	if(itemDb[id].bank){	
		if(!amount){amount = 1;}
		amount = Math.min(amount,mainList[key].invList.have(id,0,'amount'));
		if(!Bank.have(key,id) && !Bank.empty(key,1)){ amount = 0 }
		if(amount){	Bank.add(key,id,amount);	mainList[key].invList.remove(id,amount);	}
	} else { Chat.add(key,"You can't bank this item."); }
}
