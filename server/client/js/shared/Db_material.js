
Init.db.material = function(){
	Db.material = {
		
		//Mining
		'mine-metal-0':{'name':'Crytal Meth','icon':'metal.metal','exchangeRate':100},
		'mine-metal-20':{'name':'Crytal Meth','icon':'metal.metal','exchangeRate':100},
		'mine-metal-40':{'name':'Crytal Meth','icon':'metal.metal','exchangeRate':100},
		'mine-metal-60':{'name':'Crytal Meth','icon':'metal.metal','exchangeRate':100},
		'mine-metal-80':{'name':'Crytal Meth','icon':'metal.metal','exchangeRate':100},
			
		'mine-chain-0':{'name':'Crytal Meth','icon':'chain.chain','exchangeRate':100},
		'mine-chain-20':{'name':'Crytal Meth','icon':'chain.chain','exchangeRate':100},
		'mine-chain-40':{'name':'Crytal Meth','icon':'chain.chain','exchangeRate':100},
		'mine-chain-60':{'name':'Crytal Meth','icon':'chain.chain','exchangeRate':100},
		'mine-chain-80':{'name':'Crytal Meth','icon':'chain.chain','exchangeRate':100},
		
		//Woodcutting
		'wc-wood-0':{'name':'Crytal Meth','icon':'wood.wood','exchangeRate':100},
		'wc-wood-20':{'name':'Crytal Meth','icon':'wood.wood','exchangeRate':100},
		'wc-wood-40':{'name':'Crytal Meth','icon':'wood.wood','exchangeRate':100},
		'wc-wood-60':{'name':'Crytal Meth','icon':'wood.wood','exchangeRate':100},
		'wc-wood-80':{'name':'Crytal Meth','icon':'wood.wood','exchangeRate':100},
		
		'wc-leaf-0':{'name':'Crytal Meth','icon':'leaf.leaf','exchangeRate':100},
		'wc-leaf-20':{'name':'Crytal Meth','icon':'leaf.leaf','exchangeRate':100},
		'wc-leaf-40':{'name':'Crytal Meth','icon':'leaf.leaf','exchangeRate':100},
		'wc-leaf-60':{'name':'Crytal Meth','icon':'leaf.leaf','exchangeRate':100},
		'wc-leaf-80':{'name':'Crytal Meth','icon':'leaf.leaf','exchangeRate':100},
		
		
		//Hunter
		'hunt-bone-0':{'name':'Crytal Meth','icon':'bone.bone','exchangeRate':100},
		'hunt-bone-20':{'name':'Crytal Meth','icon':'bone.bone','exchangeRate':100},
		'hunt-bone-40':{'name':'Crytal Meth','icon':'bone.bone','exchangeRate':100},
		'hunt-bone-60':{'name':'Crytal Meth','icon':'bone.bone','exchangeRate':100},
		'hunt-bone-80':{'name':'Crytal Meth','icon':'bone.bone','exchangeRate':100},
			
		'hunt-hide-0':{'name':'Crytal Meth','icon':'hide.hide','exchangeRate':100},
		'hunt-hide-20':{'name':'Crytal Meth','icon':'hide.hide','exchangeRate':100},
		'hunt-hide-40':{'name':'Crytal Meth','icon':'hide.hide','exchangeRate':100},
		'hunt-hide-60':{'name':'Crytal Meth','icon':'hide.hide','exchangeRate':100},
		'hunt-hide-80':{'name':'Crytal Meth','icon':'hide.hide','exchangeRate':100},
		
	};
	var tmp = {};
		
	for(var i in Db.material){
		var entry = Db.material[i];
		if(i.have('hunt')) entry.skill = 'hunting';
		if(i.have('wc')) entry.skill = 'woodcutting';
		if(i.have('mine')) entry.skill = 'mining';
		if(typeof entry.lvl === 'undefined') entry.lvl = i.numberOnly();
		
		entry.id = i;
		entry.icon = entry.icon || 'wood.wood';
		entry.name = entry.name || 'Crytal';
		entry.exchangeRate = entry.exchangeRate || 100;
		tmp[i] = 0;
	}
	
	if(!server) return;
	Craft.material.template = new Function('return ' + stringify(tmp));
	Craft.material.list = Object.keys(Db.material).sort();
	for(var i in Db.material){
		var entry = Db.material[i];
		
		Item.creation({
			'id':i,
			'name':entry.name,
			'icon':entry.icon,
			'stack':1,
			'type':'material',
			'option': [
				{'param':['material'],'name':'Material Window','func':'Main.openWindow'},
				{'param':[i,1],'name':'Salvage x1','func':'Craft.material.salvage'},
				{'param':[i,10],'name':'Salvage x10','func':'Craft.material.salvage'},
			],
		});

	}
}






































