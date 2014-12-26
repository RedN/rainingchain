(function(){ //}
Sign = {};

var SERVER_DOWN = false;
var DOWN_MSG = 'The server or your browser seems to have some difficulties...<br> Restart browser and try again. If still doesn\'t work, try later.';
var LAST_CLICK_TIME = -1;
var DOWN_TIMEOUT = null;
var SERVER_RESPONDED = false;
var HIDE_SOCIALMEDIA = true;

Sign.init = function(){
	Sign.init.html();
	Sign.init.html.highscore();
	Sign.init.html.about();
	Sign.init.socket();
	
	if(localStorage.getItem('username')){
		$("#lg-signInUsername").val(localStorage.getItem('username'));
		Sign.display('in');
	}
}

Sign.init.html = function(){
	var full = $('<div>')
		.addClass("lg-container");
		
	$('#startDiv').append(full);
	
	var containerDiv =  $('<div>')
		.css({width:'auto',height:'auto',textAlign:'center',font:'20px Kelly Slab'});
	full.append(containerDiv);
	
	containerDiv.append('<h1>Raining Chain<span style="font-size:25px"> Beta</h1>');
	containerDiv.append('<br>');
	
	var signUpBtn = $('<button>')
		.attr({title:"Create A New Account",id:'lg-signUpBtn'})
		.html('Sign Up')
		.css({textDecoration:'underline'})
		.click(function(){
			Sign.display('up');
		})
	containerDiv.append(signUpBtn);
	
	var signInBtn = $('<button>')
		.attr({title:"Log In An Existing Account",id:'lg-signInBtn'})
		.html('Sign In')
		.css({textDecoration:'none'})
		.click(function(){
			Sign.display('in');
		})
	containerDiv.append(signInBtn);
	containerDiv.append('<br>');
	
	var signUpDiv = $('<form>')
		.attr('id','lg-signUpDiv')
		.addClass("lg-form")
		.submit(function(e) {
			e.preventDefault();
			return false;
		});

	signUpDiv.append('<br>');
	
	
	var array = [
		[
			'Username:',
			$('<input>').attr({id:"lg-signUpUsername",placeholder:"username",type:'text'})
		],
		[
			'Password:',
			$('<input>').attr({id:"lg-signUpPassword",placeholder:"password",type:'password'})
		],
		[
			'Confirm:',
			$('<input>').attr({id:"lg-signUpPasswordConfirm",placeholder:"confirm password",type:'password'})
		],
		[
			'Email:',
			$('<input>').attr({id:"lg-signUpEmail",placeholder:"recovery email",type:'text'})
		],
		[
			$('<span>')
				.attr('title',"If you have been referred by a friend, enter his username here.")
				.html('Referral:'),
			$('<input>').attr({id:"lg-signUpReferral",placeholder:"friend username *optional*",type:'text'})
		]	
	];
	signUpDiv.append(Tk.arrayToTable(array).addClass('center'));
	signUpDiv.append('<br>');
	//#############
	
	var socialMedia = $('<div>');
	signUpDiv.append(socialMedia);
	
	socialMedia.append('<h3 class="u">Social Media: Optional</h3>');
	socialMedia.append($('<div>')
		.html('Posting about Raining Chain on these accounts will automatically grant you Contribution Points used for cosmetic rewards.')
	);
	socialMedia.append('<br>');
	var array = [
		[
			'Youtube:',
			$('<input>').attr({id:"lg-signUpYoutube",placeholder:"ex: IdkWhatsRc *optional*",type:'text'})
		],
		[
			'Twitch:',
			$('<input>').attr({id:"lg-signUpTwitch",placeholder:"*optional*",type:'text'})
		],
		[
			'Reddit:',
			$('<input>').attr({id:"lg-signUpReddit",placeholder:"*optional*",type:'text'})
		],
		[
			'Twitter:',
			$('<input>').attr({id:"lg-signUpTwitter",placeholder:"*optional*",type:'text'})
		]
	];
	socialMedia.append(Tk.arrayToTable(array).addClass('center'));
	socialMedia.append('<br>');	
	if(HIDE_SOCIALMEDIA)
		socialMedia.hide();
	
	signUpDiv.append($('<button>')
		.html('Create Account And Play')
		.click(function(){
			Sign.up();
		})
	);
	containerDiv.append(signUpDiv);
	//###############################
	
	var signInDiv = $('<form>')
		.attr('id','lg-signInDiv')
		.addClass("lg-form")
		.hide()
		.submit(function(e) {
			e.preventDefault();
			Sign.in();	
			Sign.display('in');
			return false;
		});
		
	signInDiv.append('<br>');
	var array = [
		[
			'Username:',
			$('<input>').attr({id:"lg-signInUsername",placeholder:"username",type:'text'})
		],
		[
			'Password:',
			$('<input>').attr({id:"lg-signInPassword",placeholder:"password",type:'password'})
		],
	];
	signInDiv.append(Tk.arrayToTable(array).addClass('center'));
	signInDiv.append('<br>');
	
	signInDiv.append($('<button>')
		.html('Enter The Game')
		.click(function(e){
			e.preventDefault();
			Sign.in();
			return false;
		})
	);
	signInDiv.append('<br>');
	signInDiv.append($('<button>')
		.html('Lost Password')
		.css({fontSize:'0.8em'})
		.click(function(e){
			e.preventDefault();
			Dialog.open('account',false);
			return false;
		})
	);
	
	signInDiv.append('<br>');
	
	containerDiv.append(signInDiv);
	containerDiv.append($('<div>')
		.attr({id:"lg-message"})
	);
	
}

Sign.init.html.about = function(){
	var full = $('<div>')
		.addClass("lg-container")
		.css({font: '20px Kelly Slab',textAlign:'center'});
	$('#startDiv').append(full);
	full.append($('<h2>')
		.html('What is Raining Chain?') 
	);
	
	full.append('Raining Chain is a F2P <a style="color:blue" href="https://github.com/RainingChain/rainingchain">open-source</a> MMORPG.<br><br>');
	
	full.append('Latest gameplay video:<br>')
	full.append($('<object>')
		.attr({width:450,height:300,data:"https://www.youtube.com/embed/Xnjb2ZshyHM"})
	);
	full.append('<br><br>Run the game on your own computer and <br>'
		+ 'contribute to the project with the <a style="color:blue" href="http://www.rainingchain.com/contribution/">Quest Creator</a>:<br>')
	full.append($('<object>')
		.attr({width:450,height:300,data:"http://www.youtube.com/embed/CCAjNcfS5OI"})
	);
	return full;
}	


Sign.init.html.highscore = function(){
	var full = $('<div>')
		.addClass("lg-container")
		.css({font: '20px Kelly Slab',textAlign:'center'});
	$('#startDiv').append(full);
	full.append($('<h2>')
		.html('Highscore - Most Quests Complete') 
	);
	full.hide();
	
	$.ajax({
		url: '/highscoreHomePage',
		data: '',
		type: 'POST',
		success: function(data) {
			for(var i = 0 ; i < data.highscore.length; i++){
				full.append('Rank ' + data.highscore[i].rank + ': ' + data.highscore[i].username + ' (' + data.highscore[i].value + ' Quests)<br>');
			}
			full.show();
		}
	});
	
	
	
	return full;
}	


Sign.init.socket = function(){
	Socket.on('signIn', function (data) {
		SERVER_RESPONDED = true;
		if(data.message) Sign.log(data.message);
		if(data.data) Game.init(data.data);
	});

	Socket.on('signUp', function (data) {
		SERVER_RESPONDED = true;
		Sign.log(data.message);
		if(data.success === true){
			setTimeout(function(){
				Sign.display('in');
				$("#lg-signInUsername").val($("#lg-signUpUsername").val());
				$("#lg-signInPassword").val($("#lg-signUpPassword").val());
				Sign.in();
			},1000);
		}
	});

	Socket.on('signOff', function (d){
		Dialog.open('disconnect',d);
	});
}

Sign.display = function(num){
	if(num === 'in'){
		$('#lg-signInDiv').show();
		$('#lg-signUpDiv').hide();
		$('#lg-signInBtn').css({textDecoration:'underline'});
		$('#lg-signUpBtn').css({textDecoration:'none'});
	} else {
		$('#lg-signInDiv').hide();
		$('#lg-signUpDiv').show();
		$('#lg-signInBtn').css({textDecoration:'none'});
		$('#lg-signUpBtn').css({textDecoration:'underline'});
	}
}

//#######

Sign.in = function(){
	var user = $("#lg-signInUsername").val();
	if(!user) return Sign.log('You need to enter a username.');
	
	var pass = $("#lg-signInPassword").val();
	if(!pass) return Sign.log('You need to enter a password.');
	if(!Sign.onclick()) return;
	
	Sign.log('Info sent.');
	Socket.emit('signIn', {username: user,password: pass });
}

Sign.updateServerDown = function(){
	$('#lg-signInDiv').find('button').hide();
	$('#lg-signUpDiv').find('button').hide();
	
	Sign.log(DOWN_MSG,true);
}

Sign.onclick = function(){
	if(Date.now() - LAST_CLICK_TIME < 200) return Sign.log("Don't click too fast!");
	
	if(Game.loading) return Sign.log("Loading images...");
	
	if(Tk.getBrowserVersion().contains('Safari'))
		return Sign.log("Safari supports canvas-based games very poorly.<br> Use Google Chrome, Firefox, Opera or IE instead.<br>"+
			//"You are currently using " + Tk.getBrowserVersion() + '.<br>' +
			'You can download Google Chrome at <br><a target="_blank" href="https://www.google.com/chrome/">www.google.com/chrome/</a>');
	
	
	LAST_CLICK_TIME = Date.now();
	
	clearTimeout(DOWN_TIMEOUT);
	DOWN_TIMEOUT = setTimeout(function(){
		if(!SERVER_RESPONDED)
			Sign.updateServerDown();
		SERVER_RESPONDED = false;
	},15*1000);
	
	return true;
}

Sign.up = function (){
	var user = $("#lg-signUpUsername").val();
	if(!user) return Sign.log('You need to enter a username.');
	
	var pass = $("#lg-signUpPassword").val();
	if(!pass) return Sign.log('You need to enter a password.');
	
	var confirm = $("#lg-signUpPasswordConfirm").val();
	if(pass !== confirm) return Sign.log('Passwords do not match.');
	
	var email = $("#lg-signUpEmail").val();
	if(window.location.hostname.contains('rainingchain') && !escape.email(email)) 
		return Sign.log('Invalid Email.<br> Keep in mind that it\'s your own way to recover your account.');
	
	if(!Sign.onclick()) return;
	Sign.log('Info sent.');
	Socket.emit('signUp', {
		username: user,
		password: pass,
		email:email,
		referral:$("#lg-signUpReferral").val(),
		youtube:$("#lg-signUpYoutube").val(),
		reddit:$("#lg-signUpReddit").val(),
		twitch:$("#lg-signUpTwitch").val(),
		twitter:$("#lg-signUpTwitter").val(),
	});
}

Sign.log = function(text,notimeout){
	var span = $('<span>')
		.html(text + '<br>');
	$("#lg-message").prepend(span);
	
	Sign.log.array.push(span);
	if(Sign.log.array.length > 5){
		Sign.log.array[0].remove();
		Sign.log.array.shift();
	}
	
}
Sign.log.array = [];


})();
