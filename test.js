

var a = '';
var b = null;
var c;
var d = 0;
var e = false;


//#############################################
//#############################################
//#############################################

var start = Date.now();
for(var i = 0 ; i < 1000000 ; i++){

	if(b){}

}	var end = Date.now();		console.log(end-start);	


var start = Date.now();
for(var i = 0 ; i < 1000000 ; i++){

	if(c){}

}	var end = Date.now();		console.log(end-start);	









function deepClone(info){
	if(typeof info == 'object'){
		return JSON.parse(stringify(info));
	} else {
		return info;
	}
}
function deepString(info){
	if(typeof info == 'object'){
		return stringify(info);
	} else {
		return info;
	}
}
function stringify(string){
	if(typeof string == 'string'){ return '"' + string + '"'; }
	else if(typeof string == 'number'){ return string.toString(); }
	else { return JSON.stringify(string); }
}
