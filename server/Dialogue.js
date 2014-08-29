//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Tk','Init','Tk.applyFunc'],['Dialogue']));

var Dialogue = exports.Dialogue = {};
Db.dialogue = {};
Dialogue.start = function(key,d){
	//start dialogue. also set start x and y to end dialogue if player walks away
	try { 
	
	var dia = Db.dialogue[d.quest][d.npc][d.node];
	var main = List.main[key];
	main.dialogue = Tk.deepClone(dia);
	main.dialogue.x = List.all[key].x;
	main.dialogue.y = List.all[key].y;
	
	if(dia.event) Tk.applyFunc.key(key,dia.event,[],List);	
	
	}catch(err){ ERROR.err(3,err,d);}
	
	List.main[key].flag.dialogue = 1;
}

Dialogue.end = function(key){
	List.main[key].dialogue = null;
	List.main[key].flag.dialogue = 1;
}

Dialogue.option = function(key,option){
	if(option.next)	Dialogue.start(key,option.next);
	else Dialogue.end(key);
	if(option.event)	Tk.applyFunc.key(key,option.event,[],List);
}







