//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Actor','Button','OptionList','Quest','ItemList','Message','Debug','Main'],['ItemModel']));	//actor once random
if(SERVER) eval('var ItemModel;');
(function(){ //}

ItemModel = exports.ItemModel = function(quest,id,name,icon,option,description,extra){	//implements OptionList
	if(!id || DB[id]) return ERROR(2,'no item id or already used id',id);
	
	var item = {
		id:id || '',
		name:name || 'buggedItem',
		icon:icon || 'system.square',
		description:description || name || '',
		trade:1, 
		drop:1,
		destroy:0,
		bank:1,
		examine:'',
		option:option ||  [],
		type:'item',
		quest:quest || '',
	};
	extra = extra || {};
	for(var i in extra) item[i] = extra[i];
	
	if(item.examine)
		item.option.push(ItemModel.Option(Message.add,'Examine',null,[item.examine]));
	if(item.drop && (!item.option[item.option.length-1] || item.option[item.option.length-1].name !== 'Drop'))	//BAD
		item.option.push(ItemModel.Option(Main.dropInv,'Drop',null,[OptionList.MAIN,item.id]));
	if(item.destroy && (!item.option[item.option.length-1] || item.option[item.option.length-1].name !== 'Destroy')) 	//BAD
		item.option.push(ItemModel.Option(Main.destroyInv,'Destroy',null,[OptionList.MAIN,item.id]));
	DB[item.id] = item;
	return item;
}

var DB = ItemModel.DB = {};

ItemModel.Option = function(func,name,description,param){
	return OptionList.Option(func,param,name,description);
}	

ItemModel.get = function(id){
	return DB[ItemModel.getId(id)] || null;
}

ItemModel.getId = function(id){
	if(DB[id]) return id;
	id = 'Qsystem-' + id;
	if(DB[id]) return id;
	return ERROR(4,'invalid id',id);
}

ItemModel.use = function(item,key,opPos,notDrop){
	var option = item.option[opPos];
	if(!option || !option.func) return;
	
	if(notDrop && (option.name === 'Drop' || option.name === 'Destroy')) return;
	OptionList.executeOption(Main.get(key),option);
}

ItemModel.displayInChat = function(item,key){	//client
	Message.add(key,Message('input','[[' + item.id + ']]'));
}

ItemModel.compressClient = function(item){
	return item;
}

ItemModel.uncompressClient = function(item){
	return OptionList.uncompressClient(item,'useItem',item.id);	
}


})();
