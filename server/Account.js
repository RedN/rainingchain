//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','Tk','List','requireDb','Sign','Chat','Contribution',],['Account']));

var db = requireDb();
var crypto = require('crypto');

var Account = exports.Account = {};

Account.socketManagement = function(socket,d){
	//note, client can cheat and send any d.user
	var key = socket.key;
	
	if(d.command === 'changePassword'){
		//socket.emit('account',{command:'changePassword',password:'hello'});
		if(!List.all[key]) return socket.emit('account','You need to be logged in to perform that action.');
		if(typeof d.oldPassword !== 'string' || typeof d.newPassword !== 'string') return;
		var user = List.all[key].username;
		
		db.findOne('account',{username:user},function(err, account) { if(err) throw err;
			if(!account) return;
			Account.encryptString(d.oldPassword,account.salt,function(data){
				if(data.password !== account.password) return socket.emit('account','Wrong current password.');	;
				//else he had current pass right
				if(d.newPassword.length < CST.minPasswordLength) return socket.emit('account','Password too short.');
				Account.changePassword(user,d.newPassword,function(err){
					socket.emit('account','Password changed.');	
				});
			});
		});
		return;	
	}
	if(d.command === 'abortChangeEmail'){
		if(!List.all[key]) return socket.emit('account','You need to be logged in to perform that action.');
		db.update('account',{username:List.all[key].username},{$set:{email:email,emailChangeRequest:0}});
		return socket.emit('account','You successfully aborted the change of your email.');
	}
	
	if(d.command === 'changeEmail'){
		//socket.emit('account',{command:'changePassword',password:'hello'});
		if(!List.all[key]) return socket.emit('account','You need to be logged in to perform that action.');
		if(typeof d.password !== 'string' || typeof d.email !== 'string') return;
		var user = List.all[key].username;
		var email = escape.email(d.email);
		if(!email) return socket.emit('account','Invalid email.');	;
		db.findOne('account',{username:user},function(err, account) { if(err) throw err;
			if(!account) return;
			Account.encryptString(d.password,account.salt,function(data){
				if(data.password !== account.password) return socket.emit('account','Wrong current password.');	;
				
				if(!account.emailChangeRequest){
					db.update('account',{username:user},{$set:{emailChangeRequest:Date.now()}});
					return socket.emit('account','You successfully requested a email change. You will be able to change the email in 7 days.');
				}
				if(Date.now()-account.emailChangeRequest < CST.DAY*7){
					return socket.emit('account','You will be able to change your email in ' + ((CST.DAY*7-(Date.now()-account.emailChangeRequest))/CST.HOUR).r(0) + ' hours.');
				}
				//if !activated || after 7 days
				db.update('account',{username:user},{$set:{email:email,emailChangeRequest:0}});
				return socket.emit('account','Email changed.');	
				
			});
		});
		return;	
	}
	
	if(d.command === 'resetPassword'){
		//socket.emit('account',{command:'resetPassword',user:'rc',resetPasswordKey:'asdasdasd'});
		Account.resetPassword(d.user,d.resetPasswordKey,function(res){
			if(res === 'no account') return socket.emit('account','No account found with this username.');	
			if(res === 'no email') return socket.emit('account','This account has no email.');	
			if(res === 'no resetPasswordKey') return socket.emit('account','No request was made to reset this password.');	
			if(res === 'bad resetPasswordKey') return socket.emit('account','Wrong Reset Password Key. The key was sent to you via email.');	
			if(res === 'old resetPasswordKey') return socket.emit('account','Your Reset Password Key has expired, please send a new request to reset the password.');	
			if(res === true) socket.emit('account','Password reset. A new randomly-generated password has been sent to you via email.<br> Upon signing in, you will be asked to change it.');	
		});
		return;	
	}
	if(d.command === 'requestResetPassword'){
		//socket.emit('account',{command:'requestResetPassword',user:'rc',email:'test'});
		Account.requestResetPassword(d.user,d.email,function(res){
			if(res === 'no account') return socket.emit('account','No account found with this username.');	
			if(res === 'no email') return socket.emit('account','Your account has no email linked to it. The only way for you to recover it is to remember your password.');	
			if(res === 'bad email') return socket.emit('account','Email doesn\'t match username.<br> Email: ' + d.email + ', User: ' + d.user);	
			if(res === true) socket.emit('account','A Reset Password Key has been sent to you by email. You will need use it to reset your password.');	
		});
		return;	
	}
	
	if(d.command === 'sendActivationKey'){
		if(!List.all[key]) return socket.emit('account','You need to be logged in to perform that action.');
		
		db.findOne('account',{username:user},function(err, account) { if(err) throw err;
			if(!account) return;
			if(account.emailActivationKey !== d.key) socket.emit('account','Wrong key.');
			
			db.update('account',{username:List.all[key].username},{$set:{emailActivated:1}});
			return socket.emit('account','You successfully activated your account.');
		});
	}

}


Account.template = function(){
	return {
		username:'',
		name:'',
		password:'',
		salt:'',
		email:'',
		emailActivated:0,
		emailChangeRequest:0,
		emailActivationKey:'',
		resetPasswordKey:'',
		resetPasswordSalt:'',
		resetPasswordTime:0,
		
		timePlayedTotal:0,
		timePlayedThisWeek:0,
		online:0,
		admin:0,	
		lastSignIn:null,
		signUpDate:Date.now(),
		
		randomlyGeneratedPassword:0,			//1= password has been reset, aka send message to change for own password on login
	}
}

//socket.emit('account',

Account.sendActivationKey = function(account){
	var str = 'Welcome to Raining Chain! This is your activation key for your account "' + account.username + '": ' + account.emailActivationKey;
	db.email(account.email,'Raining Chain: Activation Key',str);
}

Account.encryptString = function(pass,sel,cb){
	if(!sel) 
		Account.getSalt(function(salt){
			crypto.pbkdf2(pass,salt,1000,64,function(err,pass){
				var buff = new Buffer(pass, 'binary');
				pass = buff.toString('base64');
				buff = null;
				cb({password:pass,salt:salt});
			});
		});
	else
		crypto.pbkdf2(pass,sel,1000,64,function(err,pass){
			var buff = new Buffer(pass, 'binary');
			pass = buff.toString('base64');
			buff = null;
			cb({password:pass,salt:sel});
		});
}
		
Account.getSalt = function(cb){
	crypto.randomBytes(32, function(err,salt){
		cb(salt.toString('base64'));
	});
}

Account.randomString = function(){
	return Math.random().toString(36).slice(2);
}

Account.changePassword = function(user,newpass,cb){
	Account.encryptString(newpass,'',function(data){
		db.update('account',{username:user},{'$set':{password:data.password,salt:data.salt,randomlyGeneratedPassword:0}},cb);
	});
}

Account.requestResetPassword = function(user,email,cb){
	db.findOne('account',{username:user},{email:1},function(err,res){ if(err) throw err;	
		if(!res) return cb('no account');
		if(!res.email) return cb('no email');
		if(res.email !== email) return cb('bad email');
		
		var resetKey = Account.randomString();
		
		Account.encryptString(resetKey,'',function(data){
			db.update('account',{username:user},{'$set':{resetPasswordKey:data.password,resetPasswordSalt:data.salt,resetPasswordTime:Date.now()}},function(){
				db.email(user,'Raining Chain Reset Password Key','A request to reset the password for the account ' + user + ' has been made. If you have not requested this, ignore this message.'
					+ 'Here is your Reset Password Key: ' + resetKey);
				cb(true);
			});
		});
	});
}


Account.resetPassword = function(user,resetPasswordKey,cb){
	db.findOne('account',{username:user},{email:1,resetPasswordKey:1,resetPasswordTime:1,resetPasswordSalt:1},function(err,res){ if(err) throw err;	
		if(!res) return cb('no account');
		if(!res.email) return cb('no email');
		if(!res.resetPasswordKey) return cb('no resetPasswordKey');
		if(Date.now() - res.resetPasswordTime > CST.day) return cb('old resetPasswordKey');
		
		Account.encryptString(resetPasswordKey,res.resetPasswordSalt,function(data){
			if(res.resetPasswordKey !== data.password) return cb('bad resetPasswordKey');
			
			var newpass = Account.randomString();
			Account.encryptString(newpass,'',function(data){
				db.update('account',{username:user},{'$set':{password:data.password,salt:data.salt,resetPasswordKey:'',randomlyGeneratedPassword:1}},function(){
					db.email(user,'Raining Chain Password Reset','The password for the account ' + user + ' has been reset to: ' + newpass + ' .');
					cb(true);
				});
			});
		});
	});
}












