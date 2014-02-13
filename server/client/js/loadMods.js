readFiles = function(files) {
	for (var i in files) { //for multiple files          
		(function(file) {
			var reader = new FileReader();  
			
			reader.fileName = file.name;
			console.log(file);
			if(file.type === "image/png"){
				reader.onload = readFiles.image;
				reader.readAsDataURL(file, "UTF-8");
			}
			if(file.type === "text/plain"){
				reader.onload = readFiles.script;
				reader.readAsText(file, "UTF-8");
			}
		})(files[i]);
	}
}

readFiles.image = function(e) {  
	var image = new Image();
	image.src = this.result;
	
	var name = this.fileName.slice(0,this.fileName.indexOf('.'));
	var array = name.split(' ');
	
	if(array[0] === 'sprite'){
		if(!Db.sprite[array[1]]) permConsoleLog('Wrong Name',this.fileName);
		else Db.sprite[array[1]].img.src = this.result;
	}
	if(array[0] === 'anim'){
		if(!Db.anim[array[1]]) permConsoleLog('Wrong Name',this.fileName);
		else Db.anim[array[1]].img.src = this.result;
	}
	if(array[0] === 'icon')
		Img.icon.src = this.result;
	
	
}


readFiles.script = function(e) {  
	var text = e.target.result; 
	
	var checksum = readFiles.script.adler32(text);
	console.log(aaa)
	//console.log(e);
	//console.log(text);
	eval(text);
	
	var id = this.fileName + checksum;
	socket.emit('uploadMod', {name:this.fileName,id:id});

}
//{name:,author:,adler32:,code:}

socket.on('queryMod', function (d) {
	



io.sockets.on('connection', function (socket) {
	socket.on('uploadMod', function (d) {
		db.playerMod.find({id:d.id},{},function(err,res){ if(err) throw err;
			//if dont exist in db, ask for it
			if(!res[0]){
				if(!d.text)	//aka just want to test if exist
					socket.emit('queryMod',{id:d.id});	
				else { 	//aka want to add to db
					var mort = List.all[socket.key];
					//if(!mort || mort.lvl < 0) return;	//aka requirement to post new script

					db.playerMod.insert(d,function(err){ if(err) throw err;});
			
				}
			}				
		});
	});
});



socket.on('queryMod', function (d) {
	

})







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
		
		
		
		
		
		