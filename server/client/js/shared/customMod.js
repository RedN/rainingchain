if(SERVER){
	var db = require('./../../../db');
	var request = require('request');
}
if(!SERVER){
	
readFiles = function(files) {
	for (var i in files) { //for multiple files          
		(function(file) {
			var reader = new FileReader();  
			
			reader.fileName = file.name;
			if(file.type === "image/png"){
				reader.onload = readFiles.image;
				reader.readAsDataURL(file, "UTF-8");
			}
			if(file.type === "text/plain" || file.type === "application/javascript"){
				reader.onload = readFiles.script;
				reader.readAsText(file, "UTF-8");
			}
		})(files[i]);
	}
}

readFiles.image = function(e) {  
	var name = this.fileName.slice(0,this.fileName.indexOf('.'));
	name = name.replaceAll(' ','_');
	var array = name.split('_');
	
	if(array[0] === 'sprite'){
		if(!Db.sprite[array[1]]) INFO('Wrong Name',this.fileName);
		else Db.sprite[array[1]].img.src = this.result;
	}
	if(array[0] === 'anim'){
		if(!Db.anim[array[1]]) INFO('Wrong Name',this.fileName);
		else Db.anim[array[1]].img.src = this.result;
	}
	if(array[0] === 'icon')
		Img.icon.src = this.result;
		
		
	var image = new Image();
	image.src = this.result;
	image.id = this.fileName;
	image.name = this.fileName;
	Db.customImg[this.fileName] = image;
	readFiles.update();
}


readFiles.script = function(e) {  
	var text = e.target.result; 
	
	//var id = this.fileName + readFiles.script.adler32(text);
	var pastebin = this.fileName.slice(0,this.fileName.indexOf('.'));
	socket.emit('uploadMod', {id:pastebin});
	
	Db.customMod[pastebin] = {
		name:this.fileName,
		id:pastebin,
		text:text,
		approved:0,
	}
	
	readFiles.update();
}

socket.on('uploadMod', function (d) {
	var mod = Db.customMod[d.id];
	if(d.success){
		eval(mod.text);
		mod.approved = 1;
		readFiles.update();		
	} else { alert("pastebin.com/" + d.id + " doesn't exist. Make sure you uploaded your script on pastebin.com and that the file name matches the url.");}
});

//{name:,author:,adler32:,code:}

readFiles.script.adler32 = function(data) {
  var MOD_ADLER = 65521;
  var a = 1, b = 0;

  for (var i = 0; i < data.length; i++) {
    a += data.charCodeAt(i);
    b += a;
  }

  a %= MOD_ADLER;
  b %= MOD_ADLER;

  return (b << 16) | a;
}
	
readFiles.update = function(){	//#customModList
	var str = '';
	for(var i in Db.customImg)
		str += '-' + Db.customImg[i].name + '<br>';	
	
	for(var i in Db.customMod)
		str += '-' + Db.customMod[i].name + ' (' + (Db.customMod[i].approved ? 'APPROVED' : 'PENDING...') + ')<br>';	
	
	$("#customModList")[0].innerHTML = str;
}

readFiles.open = function(){
	$( "#customMod" ).dialog( "open" );
}




}

//###################################
//###################################


customModHandling = function(socket,d){
	if(typeof d.id !== 'string') return;
	
	var str = 'http://pastebin.com/raw.php?i=' + d.id; 
	if(d.id.length === 8){
		request(str, function (err, ress, body) {
			var success = ress.statusCode === 200 && body[0] !== '<';
			socket.emit('uploadMod',{id:d.id,success:success});
		});
	} else {
		socket.emit('uploadMod',{id:d.id,success:0});
	}

	

	/*
	db.find('customMod',{id:d.id},{},function(err,res){ if(err) throw err;
		//if dont exist in db, ask for it
		if(!res[0]){
			if(!d.text)	//aka just want to test if exist
				socket.emit('queryMod',{id:d.id});	
			else if(Server.customMod){ //aka want to add to db
				var act = List.all[socket.key];
				//if(!act || act.lvl < 0) return;	//aka requirement to post new script
				
				d.creationDate = Date.now();
				//d.author = act.name || '$unknown';
				d.insert('customMod',d,function(err){ if(err) throw err;});
		
			}
		}				
	});
	*/
}











	
		
		
		
		
		