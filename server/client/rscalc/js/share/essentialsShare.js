Tk = {};

//Math
Tk.sin = function (number){
	return (Math.sin(number/180*Math.PI))
}

Tk.cos = function (number){
	return (Math.cos(number/180*Math.PI))
}

Tk.atan = function (number){
	return (Math.atan(number)/Math.PI*180)
}

Tk.atan2 = function (y,x){
	return ((Math.atan2(y,x)/Math.PI*180)+360)%360
}



//Function
innerFunction = function (func,param){
	func.apply(this, param);	
}

//Copy
Tk.deepClone = function(info){
	if(typeof info == 'object'){
		return JSON.parse(Tk.stringify(info));
	} else {
		return info;
	}
}

deepString = function(info){
	if(typeof info == 'object'){
		return Tk.stringify(info);
	} else {
		return info;
	}
}

Tk.stringify = function(string){
	//return JSON.stringify(string);	
	
	if(typeof string == 'string'){ return '"' + string + '"'; }
	else if(typeof string == 'number'){ return string.toString(); }
	else { return JSON.stringify(string); }
}

Tk.isEqual = function(obj0,obj1){
	if(obj0 === undefined || obj1 == undefined){ return false;}	
	return obj0 == obj1;
}


JSONf = {};
JSONf.stringify = function(obj) {
	return JSON.stringify(obj,function(key, value){
			return (typeof value === 'function' ) ? value.toString() : value;
		});
}
JSONf.parse = function(str) {
	return JSON.parse(str,function(key, value){
		if(typeof value != 'string') return value;
		return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
	});
}


//Via Array
valueViaArray = function(d){
	if(typeof d.array != 'object'){ return d.origin[array]; }
	if(!d.origin){ d.origin = window;}
	var origin = d.origin;
	var array = d.array;
	switch (array.length) {
        case 1: return origin[array[0]]; break;
        case 2: return origin[array[0]][array[1]];break;
        case 3: return origin[array[0]][array[1]][array[2]];break;
        case 4: return origin[array[0]][array[1]][array[2]][array[3]];break;
		case 5: return origin[array[0]][array[1]][array[2]][array[3]][array[4]];break;
		case 6: return origin[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]];break;
        default: break;
    }
}

changeViaArray = function(d){
	if(!d.origin){ d.origin = window;}
	var origin = d.origin;
	var array = d.array;
	var value = d.value;
	switch (array.length) {
        case 1: origin[array[0]] = value; break;
        case 2: origin[array[0]][array[1]] = value;break;
        case 3: origin[array[0]][array[1]][array[2]] = value;break;
        case 4: origin[array[0]][array[1]][array[2]][array[3]] = value;break;
		case 5: origin[array[0]][array[1]][array[2]][array[3]][array[4]] = value;break;
		case 6: origin[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]] = value;break;
        default: break;
    }	
}

addViaArray = function(d){
	if(!d.origin){ d.origin = window;}
	var origin = d.origin;
	var array = d.array;
	var value = d.value;
	switch (array.length) {
        case 1: origin[array[0]] += value; break;
        case 2: origin[array[0]][array[1]] += value;break;
        case 3: origin[array[0]][array[1]][array[2]] += value;break;
        case 4: origin[array[0]][array[1]][array[2]][array[3]] += value;break;
		case 5: origin[array[0]][array[1]][array[2]][array[3]][array[4]] += value;break;
		case 6: origin[array[0]][array[1]][array[2]][array[3]][array[4]][array[5]] += value;break;
		default:  break;
    }
}

stringToArray = function(string){
	var array = [];
	
	while(string.indexOf(',') != -1){
		var firsti = string.indexOf(',');
		var first = string.slice(0,firsti);
		array.push(first);
		string  = string.replace(first + ',','');
	}
	array.push(string);
	
	return array;
}



//Round
stringRound = function (num,decimals){
	var num = Tk.round(num,decimals).toString();
	
	var dot = num.indexOf('.');
	if(dot == -1){ num += '.'; dot = num.length-1; }
	
	var missing0 = decimals - num.length + dot + 1;
	
	for(var i=0 ; i < missing0; i++){ num += '0'; }
	
	return num;
}

round = function (num,decimals){
	return Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals);
}



Tk.formatNum = function(num){
	 return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};
String.prototype.capitalize = function() {  return this.charAt(0).toUpperCase() + this.slice(1);}
String.prototype.insertAt=function(index, string) { 
  return this.substr(0, index) + string + this.substr(index);
}

customEscape = function(str){
	if(typeof str != 'string'){ return false }
	
	str.replaceAll('"','\"');
	str.replaceAll("'","\'");
	return str;
}







//this function will work cross-browser for loading scripts asynchronously
function loadScript(src, callback)
{
  var s,
      r,
      t;
  r = false;
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  s.onload = s.onreadystatechange = function() {
    if ( !r && (!this.readyState || this.readyState == 'complete') )
    {
      r = true;
      callback();
    }
  };
  t = document.getElementsByTagName('script')[0];
  t.parent.insertBefore(s, t);
}



