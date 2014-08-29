//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['List','Tk','Init','Main','Chat'],['List','Game','Db','player','Sign']));

//############################################

var Game = {
	started:false,
	loading:false,
	testing:false,
	startTime:-1,
}
var key = 0;
var player = {};

main = Main.template();

List = {all:{},actor:{},bullet:{},anim:{},strike:{},group:{},drop:{},anim:{},main:{},map:{},btn:{},ctx:{},sfx:{}};
//local compilation of information so server doesnt send many times the same info
Db = {equip:{},ability:{},item:{},plan:{},quest:{},customMod:{},customImg:{},highscore:{},
	highscoreList:{},questNameConvert:{},mapNameConvert:{},questShowInTab:{}};



//############################################


//Log In
Sign = {};
Sign.last = -1;
Sign.in = function(){
	var user = $("#lg-signInUsername")[0].value;
	if(!user) return Sign.log('You need to enter a username.');
	
	var pass = $("#lg-signInPassword")[0].value;
	if(!pass) return Sign.log('You need to enter a password.');
	
	if(Sign.log.serverDown) return Sign.log("Server is down... Try again later...");
	if(Date.now() - Sign.last < 200) return Sign.log("Don't click too fast!",1);
	if(Game.loading) return Sign.log("Loading images...");
	Sign.log("");
	Sign.last = Date.now();
	
	
	if(navigator.browserVersion.have('Safari'))
	return Sign.log("Safari supports canvas-based games very poorly.<br> Use Google Chrome, Firefox, Opera or IE instead.<br>"+
		//"You are currently using " + navigator.browserVersion + '.<br>' +
		'You can download Google Chrome at <br><a target="_blank" href="https://www.google.com/chrome/">www.google.com/chrome/</a>');
	
	socket.emit('signIn', { 'username': user,'password': pass });
	
	Sign.log.timeout = setTimeout(function(){
		Sign.log('The server or your browser seem to have some difficulties...<br> Restart browser and try again. If still doesn\'t work, try later.');
		Sign.log.serverDown = true;
	},20000);
	
}

Sign.up = function (){
	if(Sign.log.serverDown) return Sign.log('The server or your browser seems to have some difficulties...<br> Restart browser and try again. If still doesn\'t work, try later.');
		
	var user = $("#lg-signUpUsername")[0].value;
	if(!user) return Sign.log('You need to enter a username.');
	var pass = $("#lg-signUpPassword")[0].value;
	if(!pass) return Sign.log('You need to enter a password.');
	
	if(Date.now() - Sign.last < 200) return Sign.log("Don't click too fast!");
	if(Game.loading) return Sign.log("Loading images...");
	Sign.log("");
	Sign.last = Date.now();
	
	var confirm = $("#lg-signUpPasswordConfirm")[0].value;
	if(pass !== confirm) return Sign.log('Passwords do not match.');
	
	var email = $("#lg-signUpEmail")[0].value;
	if(window.location.hostname.have('rainingchain') && !escape.email(email)) return Sign.log('Invalid Email.<br> Keep in mind that it\'s your own way to recover your account.');
	
	
	socket.emit('signUp', {
		username: user,
		password: pass,
		email:email,
		referral:$("#lg-signUpReferral")[0].value,
		youtube:$("#lg-signUpYoutube")[0].value,
		reddit:$("#lg-signUpReddit")[0].value,
		twitch:$("#lg-signUpTwitch")[0].value,
		twitter:$("#lg-signUpTwitter")[0].value,
	});
	
	Sign.log.timeout = setTimeout(function(){
		Sign.log('Server or your browser seems to have some difficulties... Try again later. :(');
		Sign.log.serverDown = true;
	},20000);
}
Sign.display = function(num){
	$("#lg-signInDiv")[0].style.display = num === 'in' ? 'block' : 'none';
	$("#lg-signInBtn")[0].style.textDecoration = num === 'in' ? 'underline' : 'none';
	$("#lg-signUpBtn")[0].style.textDecoration = num === 'in' ?  'none' : 'underline';
	$("#lg-signUpDiv")[0].style.display = num === 'in' ?  'none' : 'block';
}

Sign.log = function(text,add){
	if(!add) $("#lg-message")[0].innerHTML = text;	
	else $("#lg-message")[0].innerHTML += '<br>' + text;	
}

socket.on('signIn', function (data) {
	clearTimeout(Sign.log.timeout);
	if(data.message) Sign.log(data.message);
	if(data.success){ 
		Game.loading = true; 
		Sign.log.doneLoadingAccount = setTimeout(function(){
			Sign.log('Server seems to have some difficulties loading your account...<br> Try again later. :(');
			Sign.log.serverDown = true;
		},10000);
	}
	if(data.doneLoadingAccount) clearTimeout(Sign.log.doneLoadingAccount); 
	if(data.data) Init.game(data.data);
});

Sign.log.serverDown = false;

socket.on('signUp', function (data) {
	clearTimeout(Sign.log.timeout);
	Sign.log(data.message);
	if(data.success){
		setTimeout(function(){
			Sign.display('in');
			$("#lg-signInUsername")[0].value = $("#lg-signUpUsername")[0].value;
			$("#lg-signInPassword")[0].value = $("#lg-signUpPassword")[0].value;
			Sign.in();
		},1000)
	}
});



//############################################


//Init
Init.game = function (data) {
	Init.game.main(data);
	Init.game.other(data);
	//Note: a part of Init.db are directly in index.html
	Init.db.statCustom();
	Init.db.stat();
	Init.actorTemplate();
	Init.contribution(true);
	
	
	//Add Canvas. param2 = z-index
	//-11: mapBelow
	Init.game.addCanvas('stage','stage',-10);
	$("#stage").css({"border":'1px solid #000000'});
	//-9: mapAbove
	Init.game.addCanvas('minimap','minimapCanvas',-8);
	
	Init.game.addCanvas('win','windowCanvas',10);
	Init.game.addCanvas('passiveGrid','passiveGridCanvas',11);
	Init.game.addCanvas('pop','popCanvas',50);
	Init.game.addCanvas('uiHelper','uiHelper',60);
			
	$("#minimapCanvas").css({"border":'4px solid #000000',"background":'rgba(0,0,0,1)','top':'0px'});
	Draw.minimap.map.updateSize();
	
	Chat.receive.addToHtml('Welcome!');
	html.pm.text.innerHTML = '<br>'
	
	for(var i in main.social.message){Chat.receive(main.social.message[i]);}	main.social.message = [];   //for offline pm
	
	
	Img.preload(Img.preloader,function(){   //load images
		$("#startDiv")[0].style.display = "none"; 	//remove enter user and psw
		$("#mainDiv")[0].style.display = "block";  //show game
		$("#gameDiv")[0].style.display = "inline";  //show game
		
		if(!window.chrome ||  !window.chrome.webstore){
			setTimeout(function(){
				Chat.add(0,'Consider switching to <a target="_blank" href="https://www.google.com/chrome/">Google Chrome</a> for optimal gameplay experience.');
				
				for(var i in Input.key.ability){
					for(var j in Input.key.ability[i]){
						if(Input.key.ability[i][j] === 1003){	//shift-right => c
							Chat.add(0,'Your Shift-Right Click key binding has been changed to C.');
							Input.key.ability[i][j] = 67;	
						}
					}
				}
			},100);
		}

		localStorage.setItem('username',$("#lg-signInUsername")[0].value);
		
		Init.game.player(data);
		Game.started = true;
		Game.startTime = Date.now();
		Song.play(Object.keys(Db.song).random());
		
		//setInterval(Loop,40);	//in Receive now
		Game.loading = false;
		socket.emit('clientReady',1); 
		
	});
}

Init.game.main = function(data){
	main = Tk.useTemplate(main,data.main,0,1);    //set init values sent by server
	main.pref = Tk.useTemplate(main.pref,JSON.parse(localStorage.getItem('pref'),false));
}
Init.game.player = function(data){  
	player = Tk.useTemplate(Actor.template('player'),data.player,0,1);	
	$("#chatUserName")[0].innerHTML = player.name + ': '; 
}
Init.game.other = function(data){
	Db.passiveGrid = data.other.passiveGrid;
	Db.passiveGrid.height = Db.passiveGrid[0].grid.length;
	Db.passiveGrid.width = Db.passiveGrid.height;
	
	for(var i in data.other.quest){
		Db.questNameConvert[i] = data.other.quest[i].name;	//TOFIX crap name
		Db.questShowInTab[i] = data.other.quest[i].showInTab;
	}
	
	Db.mapNameConvert = data.other.map;	//TOFIX crap name
	
	if(data.other.firstSignIn) $( "#firstSignIn" ).dialog( "open" );
	
	
	//highcore
	Db.highscoreList = data.other.highscore; //	[i]:name	all of them
	
	var str = '';
	dance:
	for(var i in Db.questNameConvert){
		for(var j in Db.highscoreList){
			if(j.have(i)){	//aka at least 1 category for the quest
				str += '<option value="' + i + '">' + Db.questNameConvert[i] + '</option>';
				continue dance;
			}
		}
	}
	$("#highscoreWinSelectQuest")[0].innerHTML = str;
	$(document).on('change','#highscoreWinSelectQuest',function(){Draw.window.highscore.changeQuest();});	//cuz function dont exist yet
	$(document).on('change','#highscoreWinSelectCategory',function(){Draw.window.highscore.changeCategory()});
	Draw.window.highscore.changeQuest(false);
	
	//questCount
	main.windowList.highscore = '';
	
	$("#infoDay")[0].innerHTML = 'Info of the day: ' + data.other.infoDay;
	
	Game.testing = data.other.testing;	//TOFIX
	if(data.other.testing) $("#TestQuest")[0].style.display = 'inline';
	
	
	try {
		eval(data.other.toEval);
	} catch(err){ INFO(err); }
	
	setTimeout(function(){
		$("#infoDay")[0].innerHTML = '';
	},30000);
	
}
Init.game.addCanvas = function(name,id,z){
	//To add a canvas to the game
	var cv = document.createElement("canvas");
	cv.id = id;
	var fact = (name === 'minimap') ? main.pref.mapRatio : 1;
	cv.width = CST.WIDTH / fact;
	cv.height = CST.HEIGHT / fact;
	cv.style.position = 'absolute';
	cv.style.left = '0px';
	cv.style.top = '0px';
	cv.style.zIndex = z;
	if(z > 0) cv.style.pointerEvents = "none";
	
	cv.draggable = false;
	cv.onmousedown = function(e) {e.preventDefault();	return false; };
	$("#canvasDiv")[0].appendChild(cv);
	
	var ctx = cv.getContext("2d");
	ctx.canvas = cv;
	ctx.name = name;
	ctx.font = '20px Kelly Slab';
	ctx.fillStyle = 'black';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.save();
	List.ctx[name] = ctx;
}


socket.on('warning', function (d) {
	$("#warningText")[0].innerHTML = '<strong>Alert:</strong><br> ' + d.text;
	$("#warningDiv")[0].style.visibility = 'visible';
	if(d.signOff) setTimeout(function(){location.reload();},5000);
	else setTimeout(function(){
		$("#warningDiv")[0].style.visibility = 'hidden';
	},10000);
});



