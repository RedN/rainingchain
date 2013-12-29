var Encryption = function(){};

// Generate a salt
Encryption.prototype.genSalt = function(amountOfChars, cb){
    var bcrypt = require('bcrypt');
    bcrypt.genSalt(amountOfChars, cb);
};

// Encrypt a string
Encryption.prototype.encrypt = function(stringToEncrypt, salt, cb) {
    var bcrypt = require('bcrypt');
    bcrypt.hash(stringToEncrypt, salt, cb);
};

// inputPass not encrypted, hashedPass is (Password from DB)
// Note: it returns true when they match, false when they don't
Encryption.prototype.checkMatch = function(inputString, hashedString,cb){
    var bcrypt = require('bcrypt');
    bcrypt.compare(inputString, hashedString, cb);
};

exports.ref_encryption = Encryption;