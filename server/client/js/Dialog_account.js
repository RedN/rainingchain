(function(){ //}

Account = {};
Account.init = function(){
	Socket.on('account',function(d){
		Account.log(d);
	});
	
	//Dialog.open('account')
	Dialog('account','Account Management',Dialog.Size(550,700),Dialog.Refresh(function(html,variable,param){
		html.append('<h2>Account Management</h2>');
		html.append('Log: <div id="accountLog"></div>');
		
		if(param){
			//###############
			html.append('<h3>Confirm Email</h3>');
			html.append('The Activation Key was sent to your email. Check in the Spam Folder too.<br>');
			html.append('Activation Key: <input id="accountActivationKey"></input><br>');
			html.append($('<button>')
				.html('Send Key To Server')
				.click(function(){ Account.sendActivationKey(); }));
			html.append('<br>');
			html.append($('<button>')
				.html('What Key?')
				.attr('title','Click so server sends the key to your email.')
				.click(function(){ Account.requestActivationKey(); }));
			html.append('<br>');
			//###############
			html.append('<h3>Change Email</h3>');
			html.append('You will be able to change it 7 days after the request. <br>');
			html.append('Current Password: <input type="password" id="accountCurrentPasswordEmail"></input><br>');
			html.append('New Email: <input id="accountNewEmail"></input><br>');
			html.append($('<button>')
				.html('Go!')
				.click(function(){ Account.changeEmail(); }));
			html.append('<br>');
			html.append($('<button>')
				.html('Abort Request')
				.click(function(){ Account.abortChangeEmail(); }));
			html.append('<br>');
			//###############
			html.append('<h3>Change Password</h3>');
			html.append('Current Password: <input type="password" id="accountCurrentPassword"></input><br>');
			html.append('New Password: <input type="password" id="accountNewPassword"></input><br>');
			html.append('Confirm Password: <input type="password" id="accountNewPasswordConfirm"></input><br>');
			html.append($('<button>')
				.html('Go!')
				.click(function(){ Account.changePassword(); }));
			html.append('<br>');
		}
		//###############
		html.append('<h3>Request Reset Password</h3>');
		html.append('This will send a Reset Key to the email address linked with the account.<br>');
		html.append('Username: <input id="accountRequestName"></input><br>');
		html.append('Email: <input id="accountRequestEmail"></input><br>');
		html.append($('<button>')
			.html('Go!')
			.click(function(){ Account.requestResetPassword(); }));
		html.append('<br>');
		
		//###############
		html.append('<h3>Reset Password</h3>');
		html.append('Enter the Reset Key you received via email from "Request Reset Password" to reset your password.<br>');
		html.append('Username: <input id="accountResetName"></input><br>');
		html.append('Reset Key: <input id="accountResetKey"></input><br>');
		html.append($('<button>')
			.html('Go!')
			.click(function(){ Account.resetPassword(); }));
		html.append('<br>');
	}));
	

}

Account.log = function(text){
	$("#accountLog").html(text);
}

Account.changePassword = function(){
	var old = $("#accountCurrentPassword").val();
	
	var pass = $("#accountNewPassword").val();
	if(pass !== $("#accountNewPasswordConfirm").val()) return Account.log("Passwords do not match.");
	
	Socket.emit('account',{
		command:'changePassword',
		oldPassword:old,newPassword:pass
	});
	
	$("#accountNewPassword").val('');
	$("#accountNewPasswordConfirm").val('');
	$("#accountCurrentPassword").val('');
}

Account.requestResetPassword = function(){
	Socket.emit('account',{
		command:'requestResetPassword',
		username:$("#accountRequestName").val(),
		email:$("#accountRequestEmail").val()
	});
}
Account.resetPassword = function(){
	Socket.emit('account',{
		command:'resetPassword',
		username:$("#accountResetName").val(),
		resetPasswordKey:$("#accountResetKey").val()
	});
}
	

Account.changeEmail = function(){
	Socket.emit('account',{
		command:'changeEmail',
		password:$("#accountCurrentPasswordEmail").val(),
		email:$("#accountNewEmail").val()
	});
	$("#accountCurrentPasswordEmail").val('');
}	
Account.abortChangeEmail = function(){
	Socket.emit('account',{command:'abortChangeEmail'});
}
Account.requestActivationKey = function(){
	Socket.emit('account',{command:'requestActivationKey'});
}

Account.sendActivationKey = function(){
	Socket.emit('account',{
		command:'sendActivationKey',
		key:$("#accountActivationKey").val()
	});
}



})();





