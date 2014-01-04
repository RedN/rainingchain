//############################################

var gameStarted = false;
var key = 0;
var btnList = [];   //all buttons
var ctxList = {};   //list of canvas (window,popup,stage)

List = {
	all:{},		//EVERYTHING (player id refers to mortal)
	mortal:{},	//all mortals (player,enemy)
	bullet:{},	//all bullet
	anim:{},	//all anim
	strike:{},	//all strike
	group:{},	//all enemy group
	drop:{},	//all drop
	anim:{},	//all animation
	main:{},	//all List.main of player. (player id) List.main[id].something on server => window.something on client
	map:{},		//all maps including instance 
	socket:{},	//all socket (player id)
};

Db = {	//local compilation of information so server doesnt send many times the same info
	equip:{},
	ability:{},
	item:{},
};  



//############################################

//Set the init values from Main.template.
(function(){ 
	main = {};
	var m = Main.template();
	for(var i in m) main[i] = m[i];
})();


//Log In
Sign = {};
Sign.in = function(){
	var user = $("#user")[0].value;
	var pass = $("#pass")[0].value;
	socket.emit('signIn', { 'username': user,'password': pass });
}

Sign.up = function (){
	var user = $("#user")[0].value;
	var pass = $("#pass")[0].value;
	if(user && pass){ socket.emit('signUp', { 'username': user,'password': pass }); }
}

Sign.log = function(text){
	$("#logInfo")[0].innerHTML = text;	
}


socket.on('signIn', function (data) {
	if(data.success){ id = data.key; cloud9 = data.cloud9; Init.game(data.data);  }
	else { Sign.log(data.message);  } 	
});

socket.on('signUp', function (data) {
	Sign.log(data.message);
});



//############################################


//Init
Init.game = function (data) {
	$("#signDiv")[0].style.display = "none"; 	//remove enter user and psw
	$("#gameDiv")[0].style.display = "inline";  //show game
	
	for(var i in data.main){ main[i] = data.main[i]; }    //set init values sent by server
	
	passiveGrid = Passive.init(main.passiveGrid);  //init Passive Grid
	
	//Add Canvas. param2 = z-index
	canvasDiv = $("#canvasDiv")[0];   
	addCanvas('stage','stage',-10);
	addCanvas('win','windowCanvas',10);
	addCanvas('passiveGrid','passiveGridCanvas',11);
	addCanvas('pop','popCanvas',30);
	
	html.chat.text.innerHTML = 'Welcome!';
	html.pm.text.innerHTML = '<br>'
	
	for(var i in main.social.message.chat){Chat.receive(main.social.message.chat[i]);}	main.social.message.chat = [];   //for offline pm
	
	
	Init.db.stat();
	Init.db.sprite();
	Init.db.anim();
	Init.db.sfx();
	Init.db.map();
	Init.mortal();
	Init.db.quest();
	Init.db.customBoost();
	//initAbilityModDb();   //need fixing
	Img.preload(Img.preloader,function(){   //load images
		initPlayer(data);
		gameStarted = true;
		setInterval(Loop,40);
		socket.emit('clientReady',1); 
		if(cloud9) { Chat.add('Warning, you are running under cloud9 servers. You may experience intense lagging. Downloading the project and running it locally is recommended.');}
	});
}

//To add a canvas to the game
addCanvas = function(name,id,z){
	var cv = document.createElement("canvas");
	cv.id = id;
	cv.width = Cst.WIDTH;
	cv.height = Cst.HEIGHT;
	cv.style.border = '1px solid #000000';
	cv.style.position = 'absolute';
	cv.style.left = '0px';
	cv.style.top = '0px';
	cv.style.zIndex = z;
	if(z > 0) cv.style.pointerEvents = "none";
	
	cv.draggable = false;
	cv.onmousedown = function(e) {e.preventDefault();	return false; };
	canvasDiv.appendChild(cv);
	
	ctxList[name] = cv.getContext("2d");
	ctxList[name].font = '20px Fixedsys';
	ctxList[name].fillStyle = 'black';
	ctxList[name].textAlign = 'left';
	ctxList[name].textBaseline = 'top';
	ctxList[name].save();
}



 
 



socket.on('warning', function (message) {
	warningText.innerHTML = '<font color="red">' + message + '</font>';
});

//Help aka documentation. Called once at start of game. wiki-like parser
Init.help = function(data){
	for(var i = 0 ; i < data.length ; i++){
		
		//Link
		if(data[i] == '[' && data[i+1] == '['){
			var start = i;
			for(var j = start; j < data.length ; j++){
				if(data[j] == ']' && data[j+1] == ']'){
					var tag = data.slice(start+2,j);
					data = data.replaceAll(
					'\\[\\[' + tag + '\\]\\]',
					'<helpLink onclick="updateHelp(\'' + tag + '\')" >' + tag + '</helpLink>'
					);
					break;
				}
			}
		}
		
		//Title 
		if(data[i] == '{' && data[i+1] == '{'){
			var start = i;
			for(var j = start; j < data.length ; j++){
				if(data[j] == '}' && data[j+1] == '}'){
					var end = j+1;
					var tag = data.slice(start+2,end-1);
					data = data.replaceAll(
					'\\{\\{' + tag + '\\}\\}',
					'<br><br><helpTag id="HELP' + tag + '" >' + tag + '</helpTag><br>'
					);
					break;
				}
			}
		}
	}
	return data;
}


