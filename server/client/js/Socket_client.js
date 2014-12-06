(function(){ //}

var socket = io();

Socket = {};
Socket.emit = function(what,data){
	socket.emit(what,data);
}

Socket.on = function(what,data){
	socket.on(what,data);
}


})();

