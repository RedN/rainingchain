//############################################
//temp
var gameStarted = false;

var timeStamp = 1372118670887;
var context = {'text':''}, clientContext = {'text':''}, permContext = {'text':''};
var help = '';

var canvasX = 0, canvasY = 0;  

var ctxList = {};   //list of canvas (window,popup,stage)
var drawSortList = [];  //used to store the actors to draw in the right order (z-index)

List = {};
List.all = {};  //EVERYTHING
List.mortal = {}; //all mortals (player,enemy)
List.bullet = {}; //all bullet
List.drop = {};  //all drop

List.strike = {}; //all strike
List.anim = {}; //all animation
List.map = {};

Db = {};
Db.weapon = {};
Db.armor = {};
Db.ability = {};
Db.item = {};   //local compilation of information so server doesnt send many times the same info



//############################################

//Set the init values from defaultMain.
(function(){ 
	var main = defaultMain();
	for(var i in main) window[i] = main[i];
})();

//############################################


var initData;
//############################################
//############################################

var btnList = [];   //all buttons
var clientContext = null;

var pref = Command.pref.default();   //preference (see commandShare.js)


//Log In
logIn = function(){
	var user = document.getElementById("user").value;
	var pass = document.getElementById("pass").value;
	socket.emit('logIn', { 'username': user,'password': pass });
}

socket.on('logIn', function (data) {
	if(!data.success){ writeLogInfo(data.message); }
	else {	id = data.key; cloud9 = data.cloud9; startGame(data.data); } 	
});

writeLogInfo = function(text){
	document.getElementById("logInfo").innerHTML = text;	
}

//New Player
newPlayer = function (){
	var user = document.getElementById("user").value;
	var pass = document.getElementById("pass").value;
	if(user && pass){ socket.emit('newPlayer', { 'username': user,'password': pass }); }
}

socket.on('newPlayer', function (data) {
	writeLogInfo(data.message);
});


//############################################


//Init
startGame = function (data) {
	document.getElementById("logInDiv").style.display = "none"; //remove enter user and psw
	document.getElementById("gameDiv").style.display = "inline";    //show game
	
	initData = data;
	for(var i in data.main){ window[i] = data.main[i]; }    //set init values sent by server
	
	initPassive();  //init Passive Grid
	
	//Add Canvas. param2 = z-index
	var canvasDiv = document.getElementById("canvasDiv");   
	addCanvas('stage','stage',-10);
	addCanvas('win','windowCanvas',10);
	addCanvas('passiveGrid','passiveGridCanvas',11);
	addCanvas('pop','popCanvas',30);
	
	html.chat.text.innerHTML = 'Welcome!';
	html.pm.text.innerHTML = '<br>'
	
	for(var i in chatBox){Chat.receive(chatBox[i]);}	chatBox = [];   //for offline pm
	
	//On Focus
	$("#chatBoxInput" ).focus();	//initInput was as param???
	
	
	
	initDb(function(){
		initPlayer(initData);
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
	cv.width = WIDTH;
	cv.height = HEIGHT;
	cv.style.border = '1px solid #000000';
	cv.style.position = 'absolute';
	cv.style.left = canvasX + 'px';
	cv.style.top = canvasY + 'px';
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


initDb = function (cb){
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
		cb.call();
	});
}



 
 



socket.on('warning', function (message) {
	warningText.innerHTML = '<font color="red">' + message + '</font>';
});

//Help aka documentation. Called once at start of game. wiki-like parser
parseHelp = function(data){
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

