//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Message','Button','OptionList','MapModel','ItemModel','Main','ItemList']));

Main.ItemList = function(key,list){
	return ItemList(key,list);
}

Main.ItemList.compressDb = Main.ItemList.compressDb = function(list){
	return list.data;
}

Main.ItemList.uncompressDb = function(list,key){
	var inv = ItemList(key,list);
	
	if(!Main.ItemList.checkIntegrity(inv)){
		setTimeout(function(){
			if(Main.get(key))
				Message.add(key,'Sorry, we can\'t find the data about one or multiples items you own... :('); 
		},1000);
	}
	return inv;
}

Main.ItemList.compressClient = function(list){
	return list.data;
}

Main.ItemList.uncompressClient = function(list){
	return ItemList(key,list);
}

Main.ItemList.checkIntegrity = function(inv){
	var good = true;
	for(var i in inv.data){
		if(!ItemModel.get(i)){
			ERROR(2,'cant find item',i);
			delete inv.data[i];
			good = false;
		}
	}
	return good;
};

Main.canUseBank = function(main){
	if(!MapModel.get(Main.getAct(main).map).isTown)
		return Main.addMessage(main,'Access denied.');
	return true;
}

Main.addItem = function(main,id,amount){
	return ItemList.add(main.invList,id,amount);
}

Main.removeItem = function(main,id,amount){
	return ItemList.remove(main.invList,id,amount);
}

Main.haveItem = function(main,id,amount){
	return ItemList.have(main.invList,id,amount);
}

Main.getItemAmount = function(main,id){
	return ItemList.getAmount(main.invList,id);
}

Main.addItemBank = function(main,id,amount){
	ItemList.add(main.bankList,id,amount);
}

//###########################

Main.transferInvBank = function(main,id,amount){
	if(!Main.canUseBank(main)) return;
	
	amount = Math.min(amount,Main.getItemAmount(main,id));
	if(amount === 0) return;
	if(!ItemModel.get(id)) return;
	if(!ItemModel.get(id).bank) return Main.addMessage(main,'You can\'t bank this item.');
	ItemList.transfer(main.invList,main.bankList,id,amount);
}
Main.transferBankInv = function(main,id,amount){
	if(!Main.canUseBank(main)) return;
	amount = Math.min(amount,ItemList.getAmount(main.bankList,id));
	if(amount === 0) return;
	ItemList.transfer(main.bankList,main.invList,id,amount);
}

Main.useItem = function(main,id,slot){
	if(!Main.haveItem(main,id)) return;
	var item = ItemModel.get(id);
	if(!item) return;
	var option = item.option[slot];
	if(!option) return;
	OptionList.executeOption(main,option);
}






//Dialog.open('bank')
Main.ItemList.init = function(){ //}
	Dialog('bank','Bank',Dialog.Size(500,500),Dialog.Refresh(function(html,variable,param){
		html.append('Shift-Left Click Amount: ');
		
		var input = $('<input>')
			.val(main.pref.bankTransferAmount)
			.attr('type','number')
			.attr('max',999999999)
			.attr('min',1)
		input.change(function(e){
			var newValue = input.val();
			Command.execute('pref',['bankTransferAmount',newValue]);
		});
		html.append(input);
			
		html.append('<br>');
		
		//#############
		var array = [[]];
		var arrayPosition = 0;
		for(var i in main.bankList.data){
			if(array[arrayPosition].length >= 20){
				arrayPosition++;
				array.push([]);
			}
			var item = QueryDb.get('item',i,function(){
				Dialog.refresh('bank');
			});
			if(!item) continue;
			var amount = main.bankList.data[i];
			
			var itemHtml = Img.drawItem(item.icon,40,'Transfer ' + item.name,amount);
			
			
			itemHtml.click((function(i){
				return function(e){
					if(!e.shiftKey) Command.execute('transferBankInv',[i,1]);
					else Command.execute('transferBankInv',[i,main.pref.bankTransferAmount]);
				}
			})(i))
			.bind('contextmenu',(function(i){
				return function(e){
					if(!e.shiftKey) Command.execute('transferBankInv',[i,25]);
					else Command.execute('transferBankInv',[i,99999999999]);
				}
			})(i));
				
			array[arrayPosition].push(itemHtml);
		}	
		
		html.append(Tk.arrayToTable(array,false,false,false,'4px'));	
	},function(){
		return Tk.stringify(main.bankList.data);
	},10));
		
}

