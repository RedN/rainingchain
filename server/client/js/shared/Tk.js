//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
//rely on Input but client only

if(typeof exports === 'undefined') exports = {};

eval('INFO = function(){ co' + 'nsole.log.apply(co' + 'nsole,arguments); };');	//so doesnt show in search all

/* DATE

toDateString 		Tue Apr 08 2014
toGMTString 		Tue, 08 Apr 2014 23:05:05 GMT
toISOString 		2014-04-08T23:05:05.249Z
toJSON 				2014-04-08T23:05:05.249Z
toLocaleDateString 	4/8/2014
toLocaleTimeString 	7:05:05 PM
toLocaleString 		4/8/2014 7:05:05 PM
toString 			Tue Apr 08 2014 19:05:05 GMT-0400 (Eastern Daylight Time)
toTimeString 		19:05:05 GMT-0400 (Eastern Daylight Time)
toUTCString 		Tue, 08 Apr 2014 23:05:05 GMT
valueOf 			1396998305249

*/

Date.prototype.toLocaleDateString = function(){	//cuz nodejs sucks
	return this.getMonth()+1 + '/' + this.getDate() + '/' + this.getFullYear();
}
Date.nowDate = function(num){
	return new Date(num || Date.now()).toLocaleDateString();
}

//Math
var Tk = exports.Tk = {};
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
	//faster
	var coeff_1 = Math.PI / 4;
	var coeff_2 = 3 * coeff_1;
	var abs_y = Math.abs(y);
	var angle, r;
	if (x >= 0) {
		r = (x - abs_y) / (x + abs_y);
		angle = coeff_1 - coeff_1 * r;
	} else {
		r = (x + abs_y) / (abs_y - x);
		angle = coeff_2 - coeff_1 * r;
	}
	angle *= 180/Math.PI;
	angle = angle || 0;	//case y=0,x=0
	if(y < 0) angle *= -1;
	
	return (angle+360)%360;
	
	//slower old
	return ((Math.atan2(y,x)/Math.PI*180)+360)%360
}
Math.log10 = function(num){
    return Math.log(num) / Math.log(10);
}
Math.logBase = function(base,num){
    return Math.log(num) / Math.log(base);
}
Math.fact = function (num){
	for(var start = 1; num > 1; num--){ start *= num;}
	return start;
};
Tk.binarySearch = function(arr,value,maxIteration){
	var safetyCount = 0;
	maxIteration = maxIteration || 1000000;
	
	var startIndex = 0,
		stopIndex = arr.length - 1,
		middle = Math.floor((stopIndex + startIndex)/2);
		
	if(value < arr[0]) return 0;
	while(++safetyCount < maxIteration && !(value >= arr[middle] && value < arr[middle+1]) && startIndex < stopIndex){

		if (value < arr[middle]){
			stopIndex = middle - 1;
		} else if (value > arr[middle]){
			startIndex = middle + 1;
		}

		middle = Math.floor((stopIndex + startIndex)/2);
	}

	return middle;
}
Math.pyt = function(a,b){
	return Math.sqrt(a*a+b*b);
}

Math.randomId = function(){
	return Math.randomId.getChars(+((Math.random()+'').slice(8)),'');
}
Math.randomId.chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
Math.randomId.getChars = function(num, res) {
  var mod = num % 64,
      remaining = Math.floor(num / 64),
      chars = Math.randomId.chars.charAt(mod) + res;

  if (remaining <= 0) { return chars; }
  return Math.randomId.getChars(remaining, chars);
};


Tk.getBrowserVersion = function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    return M.join(' ');
};


Math.roundRandom = function(num){
	if(num%1 > Math.random()) num++;
	return Math.floor(num);
}
Math.randomML = function(num){
	num = num || 1;
	return (Math.random()*2-1)*num
}
Math.probability = function(base,mod){
	return 1 - Math.pow(1-base,mod);
}
	
Object.defineProperty(Number.prototype, "mm", {
    enumerable: false,
    value: function(min,max) {
		if(min === undefined){ return this; }
		if(max === undefined){ return Math.max(min,this); }
		return Math.min(max,Math.max(min,this));
	}
});	

Object.defineProperty(Number.prototype, "toPercent", {
    enumerable: false,
    value: function(num) {
		return Tk.round(this*100,num || 0) + '%';
	}
});	
	
Object.defineProperty(Number.prototype, "toChrono", {
    enumerable: false,
    value: function() {
		var time = this;
		var hour = Math.floor(time / CST.HOUR);
		time %= CST.HOUR;
		var min = Math.floor(time / CST.MIN);
		min = min < 10 ? '0' + min : min;
		time %= CST.MIN;
		var sec = Math.floor(time / CST.SEC);
		sec = sec < 10 ? '0' + sec : sec;
		var milli = time % CST.SEC;
		if(milli < 10) milli = '00' + milli;
		else if(milli < 100) milli = '0' + milli;
		
		if(+hour) return hour + ':' + min + ':' + sec + '.' + milli;	
		if(+min) return min + ':' + sec + '.' + milli;	
		return sec + '.' + milli;		
	}
});	

Object.defineProperty(Number.prototype, "interval", {
    enumerable: false,
    value: function(num) {
		return this % num === 0;
	}
});	

Object.defineProperty(Number.prototype, "frameToChrono", {
    enumerable: false,
    value: function() {
		return (this*40).toChrono();
	}
});	


Object.defineProperty(Number.prototype, "r", {
    enumerable: false,
    value: function(num) {
		return Tk.round(this,num || 0);
	}
});	

Tk.argumentsToArray = function(arg){
	return [].slice.call(arg);
}

//Function
Tk.nu = function(test,value){	//used for default values
	return typeof test !== 'undefined' ? test : value;
}

//Copy

Tk.deepClone = function(obj){
	if(obj === null || typeof(obj) !== 'object')
        return obj;

    var temp = obj.constructor();

    for(var key in obj)
        temp[key] = Tk.deepClone(obj[key]);
    return temp;
}


Tk.deepClone.partial = function(obj,toExclude){
	if(obj === null || typeof(obj) !== 'object')
        return obj;

    var temp = obj.constructor();

    for(var key in obj){
		if(!toExclude[key])
			temp[key] = Tk.deepClone(obj[key]);
	}
    return temp;
}


Tk.stringify = function(string){
	if(typeof string === 'string'){ return '"' + string + '"'; }
	else if(typeof string === 'number'){ return string.toString(); }
	else { return JSON.stringify(string); }
}
Tk.isEqual = function(obj0,obj1){
	if(obj0 === undefined || obj1 === undefined){ return false;}	
	return obj0 == obj1;
}


//Via Array
Tk.viaArray = {};
Tk.viaArray.get = function(d){
	try {
		if(!d.origin){ d.origin = (SERVER ? global : window);}
		if(typeof d.array != 'object'){ return d.origin[array]; }
		var a = d.array;
		switch (a.length) {
			case 1: return d.origin[a[0]]; break;
			case 2: return d.origin[a[0]][a[1]];break;
			case 3: return d.origin[a[0]][a[1]][a[2]];break;
			case 4: return d.origin[a[0]][a[1]][a[2]][a[3]];break;
			case 5: return d.origin[a[0]][a[1]][a[2]][a[3]][a[4]];break;
			case 6: return d.origin[a[0]][a[1]][a[2]][a[3]][a[4]][a[5]];break;
			default: break;
		}
	} catch (err) { ERROR.err(3,err); }
}
Tk.viaArray.set = function(d){
	try {
		if(!d.origin){ d.origin = window;}
		var a = d.array;
		switch (a.length) {
			case 1: d.origin[a[0]] = d.value; break;
			case 2: d.origin[a[0]][a[1]] = d.value;break;
			case 3: d.origin[a[0]][a[1]][a[2]] = d.value;break;
			case 4: d.origin[a[0]][a[1]][a[2]][a[3]] = d.value;break;
			case 5: d.origin[a[0]][a[1]][a[2]][a[3]][a[4]] = d.value;break;
			case 6: d.origin[a[0]][a[1]][a[2]][a[3]][a[4]][a[5]] = d.value;break;
			default: break;
		}	
	} catch (err) { ERROR.err(3,d.array); }
}

//Round
Tk.round = function (num,decimals,str){
	if(!str){ 
		decimals = decimals || 0;
		return Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals); 
	}
	if(!decimals){ return Math.round(num).toString(); }
	
	
	
	var num = Tk.round(num,decimals).toString();
	
	var dot = num.indexOf('.');
	if(dot == -1){ num += '.'; dot = num.length-1; }
	
	var missing0 = decimals - num.length + dot + 1;
	
	for(var i=0 ; i < missing0; i++){ num += '0'; }
	
	return num;
}
Tk.formatNum = function(num){
	 return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



//Misc
escape.quote = function(str){
	if(typeof str !== 'string'){ return '' }
	
	str.replaceAll('"','\"');
	str.replaceAll("'","\'");
	return str;
}

escape.user = function(name){
	var str = name.replace(/[^a-z0-9 ]/ig, '');
	str = str.trim();
	return str;
}

escape.email = function(str){
	if(typeof str !== 'string') return '' 

    var re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(str) ? str : '';
}

escape.html = function(text) {
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

unescape.html = function(text){
	return text
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, "\"")
		.replace(/&#039;/g, "'");
}

Tk.useTemplate = function(temp,obj,deep,viaarray){
	if(deep) obj = Tk.deepClone(obj); 
	if(viaarray){
		for(var i in obj){
			Tk.viaArray.set({origin:temp,array:i.split(','),value:obj[i]});
		}
		return temp;
	}
	
	for(var i in obj)	temp[i] = obj[i];	
	return temp;
}

Tk.arrayToTable = function(array,top,left,CSSTableGenerator,spacing){
	var table = $('<table>');
	if(spacing)	table.css({borderCollapse:'separate',borderSpacing:spacing});
	
	
	for(var i=0; i<array.length; i++){
		var row = $('<tr>');
		if(i === 0 && top) row.addClass("tableHead");
		
		for(var j=0; j<array[i].length; j++){
			var cell = $('<td>');
			if(j === 0 && left) cell.addClass("tableHead").css({color:'white'});
			cell.append(array[i][j]);	//can be text or html
			row.append(cell);
		}
		table.append(row);
	}
	if(CSSTableGenerator === true) table.addClass('CSSTableGenerator');
	return table;
}




Tk.arrayfy = function(a){
	return (a instanceof Array) ? a : [a];
}

Tk.convertRatio = function(ratio){	//normalize vector
	var sum = 0;
	for(var i in ratio) sum += ratio[i];
	for(var i in ratio) ratio[i] /= sum;
	return ratio;
}


Tk.rotatePt = function(pt,angle,anchor){
	anchor = anchor || {};
	anchor.x = anchor.x || 0;
	anchor.y = anchor.y || 0;
	return {
		x:Tk.cos(angle) * (pt.x-anchor.x) - Tk.sin(angle) * (pt.y-anchor.y) + anchor.x,
		y:Tk.sin(angle) * (pt.x-anchor.x) + Tk.cos(angle) * (pt.y-anchor.y) + anchor.y,
	}	
}


//Prototype
Object.defineProperty(Array.prototype, "random", {	// !name: return random element || name:  [{name:10},{name:1}] and return obj
    enumerable: false,
    value: function(name){
		if(!this.length) return null;
		if(!name) return this[Math.floor(this.length*Math.random())];
		
		var obj = {};	
		for(var i in this) obj[i] = this[i][name];
		var choosen = obj.random();
		return choosen !== null ? this[choosen] : null
	}
});

Object.defineProperty(Array.prototype, "normalize", {	// Tk.convertRatio for array
    enumerable: false,
    value: function(){
		var sum = 0;
		for(var i in this)
			sum += this[i];
		for(var i in this)
			this[i] /= sum;
	}
});

Object.defineProperty(Object.prototype, "random", {	//return attribute, must be {attribute:NUMBER}, chance of being picked depends on NUMBER
    enumerable: false,
    value: function(name){
		if(!Object.keys(this).length) return null;
		
		var ratioed = {}; 
		if(name) for(var i in this)	ratioed[i] = this[i][name]; 
		else var ratioed = this;
		
		for(var i in ratioed)
			if(typeof ratioed[i] !== 'number'){
				return ERROR(2,'not numbers',i,ratioed,Object.keys(ratioed),ratioed[i] + '');
			}
		ratioed = Tk.convertRatio(ratioed);		
		var a = Math.random();
		for(var i in ratioed){
			if(ratioed[i] >= a) return i;
			a -= ratioed[i];
		}
		
		return null;
	}
});

Object.defineProperty(Object.prototype, "randomAttribute", {	//return random attribute
    enumerable: false,
    value: function(){
		return Object.keys(this).random();
	}
});	
	
Object.defineProperty(Object.prototype, "$count", {
    enumerable: false,
    value: function(){
		var count = 0;
		for(var i in this) if(this[i]) count++;
		return count;
	}
});	

Object.defineProperty(Object.prototype, "$isEmpty", {
    enumerable: false,
    value: function(){
		for(var i in this)
			return false;
		return true;
	}
});


Object.defineProperty(Object.prototype, "$sum", {
	enumerable: false,
	value: function(){
		var count = 0;
		for(var i in this) count += this[i];
		return count;
	}
});	
	
Object.defineProperty(Object.prototype, "$length", {
    enumerable: false,
    value: function(){
		return Object.keys(this).length;
	}
});	

Object.defineProperty(Object.prototype, "$toArray", {
    enumerable: false,
    value: function(){
		var tmp = [];
		for(var i in this)
			tmp.push(this[i]);
		return tmp;
	}
});	

Object.defineProperty(Object.prototype, "$keys", {
    enumerable: false,
    value: function(){
		return Object.keys(this);
	}
});	

Object.defineProperty(Array.prototype, "have", {
    enumerable: false,
    value: function(name,begin){
		if(begin) return this.indexOf(name) === 0;
		return this.indexOf(name) !== -1;
	}
});	

Object.defineProperty(Array.prototype, "insert", {
    enumerable: false,
    value: function (index, item) {
	  this.splice(index, 0, item);
	}
});


Object.defineProperty(Object.prototype, "$getMax", {
    enumerable: false,
    value: function() {
		var attr = Object.keys(this)[0];
		var max = this[attr];	//-.-
		
		for(var i in this){
			if(this[i] >= max){
				max = this[i];
				attr = i;
			}				
		}
		return attr;
	}
});

Object.defineProperty(Object.prototype, "$getMin", {
    enumerable: false,
    value: function() {
		var attr = Object.keys(this)[0];
		var min = this[attr];	//-.-
		
		for(var i in this){
			if(this[i] <= min){
				min = this[i];
				attr = i;
			}				
		}
		return attr;
	}
});


//String
String.prototype.replaceAll = function (find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
};

String.prototype.keyCodeToName = function(full){	//TOFIX fusion bothfunctions
	var charCode = Number(this);
	var boost = '';
	
	if(charCode > 1000){	//bad... check Input SHIFTKEY
		charCode -= 1000;
		boost = 's';
	}
	
	var m;
	if(charCode == 1) var m = 'l';
	else if(charCode == 2) var m = 'm';
	else if(charCode == 3) var m = 'r';
	else if (charCode == 8) var m = "backspace"; //  backspace
	else if (charCode == 9) var m = "tab"; //  tab
	else if (charCode == 13) var m = "enter"; //  enter
	else if (charCode == 16) var m = "shelse ift"; //  shelse ift
	else if (charCode == 17) var m = "ctrl"; //  ctrl
	else if (charCode == 18) var m = "alt"; //  alt
	else if (charCode == 19) var m = "pause/break"; //  pause/break
	else if (charCode == 20) var m = "caps lock"; //  caps lock
	else if (charCode == 27) var m = "escape"; //  escape
    else if (charCode == 32) var m = "_";	 //space        
    else if (charCode == 33) var m = "page up"; // page up, to avoid displaying alternate character and confusing people	         
	else if (charCode == 34) var m = "page down"; // page down
	else if (charCode == 35) var m = "end"; // end
	else if (charCode == 36) var m = "home"; // home
	else if (charCode == 37) var m = "left arrow"; // left arrow
	else if (charCode == 38) var m = "up arrow"; // up arrow
	else if (charCode == 39) var m = "right arrow"; // right arrow
	else if (charCode == 40) var m = "down arrow"; // down arrow
	else if (charCode == 45) var m = "insert"; // insert
	else if (charCode == 46) var m = "delete"; // delete
	else if (charCode == 91) var m = "left window"; // left window
	else if (charCode == 92) var m = "right window"; // right window
	else if (charCode == 93) var m = "select key"; // select key
	else if (charCode == 96) var m = "N0"; // N0
	else if (charCode == 97) var m = "N1"; // N1
	else if (charCode == 98) var m = "N2"; // N2
	else if (charCode == 99) var m = "N3"; // N3
	else if (charCode == 100) var m = "N4"; // N4
	else if (charCode == 101) var m = "N5"; // N5
	else if (charCode == 102) var m = "N6"; // N6
	else if (charCode == 103) var m = "N7"; // N7
	else if (charCode == 104) var m = "N8"; // N8
	else if (charCode == 105) var m = "N9"; // N9
	else if (charCode == 106) var m = "multiply"; // multiply
	else if (charCode == 107) var m = "add"; // add
	else if (charCode == 109) var m = "subtract"; // subtract
	else if (charCode == 110) var m = "decimal point"; // decimal point
	else if (charCode == 111) var m = "divide"; // divide
	else if (charCode == 112) var m = "F1"; // F1
	else if (charCode == 113) var m = "F2"; // F2
	else if (charCode == 114) var m = "F3"; // F3
	else if (charCode == 115) var m = "F4"; // F4
	else if (charCode == 116) var m = "F5"; // F5
	else if (charCode == 117) var m = "F6"; // F6
	else if (charCode == 118) var m = "F7"; // F7
	else if (charCode == 119) var m = "F8"; // F8
	else if (charCode == 120) var m = "F9"; // F9
	else if (charCode == 121) var m = "F10"; // F10
	else if (charCode == 122) var m = "F11"; // F11
	else if (charCode == 123) var m = "F12"; // F12
	else if (charCode == 144) var m = "num lock"; // num lock
	else if (charCode == 145) var m = "scroll lock"; // scroll lock
	else if (charCode == 186) var m = ";"; // semi-colon
	else if (charCode == 187) var m = "="; // equal-sign
	else if (charCode == 188) var m = ","; // comma
	else if (charCode == 189) var m = "-"; // dash
	else if (charCode == 190) var m = "."; // period
	else if (charCode == 191) var m = "/"; // forward slash
	else if (charCode == 192) var m = "`"; // grave accent
	else if (charCode == 219) var m = "["; // open bracket
	else if (charCode == 220) var m = "\\"; // back slash
	else if (charCode == 221) var m = "]"; // close bracket
	else if (charCode == 222) var m = "'"; // single quote
	
	if(!m) m = String.fromCharCode(charCode);
	m = boost + m;
	if(full && m) m = m.keyFullName();
	
	return m;
}

String.prototype.keyFullName = function(){
	if(this == 'l') return 'Left Click'; 
	if(this == 'r') return 'Right Click';
	if(this == 'sl') return 'Shift-Left Click'; 
	if(this == 'sr') return 'Shift-Right Click';
	if(this == '_') return 'Space';
	return this;
}

String.prototype.capitalize = function() {
	if(!this.have(' '))    return this.charAt(0).toUpperCase() + this.slice(1);
	
	var array = this.split(' ');
	for(var i in array) array[i] = array[i].capitalize();
	return array.join(' ');
}

String.prototype.numberOnly = function(num){
	var sign = this[0] === '-';
	var a = this.replace(/[^\d.]/g, "");
	if(sign) a = '-' + a;
	if(num){ a = +a; }
	return a;
}

String.prototype.have = function(name){
	return this.indexOf(name) !== -1;
}

String.prototype.set = function(pos,value){
	return this.slice(0,pos) + value + this.slice(pos+1);
}

String.prototype.replacePattern = function(func){	//only works like [[sdadsa]]
	var data = this;
	for(var i = 0; i < 100; i++){
		var data2 = data.replace(/(.*?)\[\[(.*?)\]\](.*)/, function(match, p1, p2, p3) {
			return p1 + func(p2) + p3;
		});
		if(data2 === data) break;
		data = data2;
	}
	return data;
}

String.prototype.replaceCustomPattern = function(begin,ending,func){	//only works like [[sdadsa]]
	var data = this;
	
	var start = data.indexOf(begin); if(start === -1) return data + '';
	var end = data.indexOf(ending); if(end === -1 || end < start) return data + '';
	
	var center = data.slice(start,end+ending.length);
	center = func(center);
	
	data = data.slice(0,start) + center + data.slice(end+ending.length);
	
	return data + '';
}


String.prototype.chronoToTime = function(func){	//1:04:10.10
	var array = this.split(":");
	var time = (+array[array.length-1] * CST.SEC) || 0;
	time += (+array[array.length-2] * CST.MIN) || 0;
	time += (+array[array.length-3] * CST.HOUR) || 0;
	return time;
}

String.prototype.q = function () {
    return '&quot;' + this + '&quot;';
};





if(typeof $ !== 'undefined' && typeof CanvasRenderingContext2D !== 'undefined'){ //}
	$.fn.selectRange = function(start, end) {
		if(!end) end = start; 
		return this.each(function() {
			if (this.setSelectionRange) {
				this.focus();
				this.setSelectionRange(start, end);
			} else if (this.createTextRange) {
				var range = this.createTextRange();
				range.collapse(true);
				range.moveEnd('character', end);
				range.moveStart('character', start);
				range.select();
			}
		});
	};
	$.fn.contextmenu = function(func) {
		this.bind('contextmenu',function(e){
			e.preventDefault();
			func();
			return false;
		});
		return this;
	};

	CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, fill, stroke, radius) {
		if (typeof stroke === "undefined" ) {  stroke = true; }
		if (typeof fill === "undefined" ) {  fill = true; }
		if (typeof radius === "undefined") {  radius = 5; }
		this.beginPath();
		this.moveTo(x + radius, y);
		this.lineTo(x + width - radius, y);
		this.quadraticCurveTo(x + width, y, x + width, y + radius);
		this.lineTo(x + width, y + height - radius);
		this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		this.lineTo(x + radius, y + height);
		this.quadraticCurveTo(x, y + height, x, y + height - radius);
		this.lineTo(x, y + radius);
		this.quadraticCurveTo(x, y, x + radius, y);
		this.closePath();
		if (fill) {  this.fill(); }        
		if (stroke) {  this.stroke(); }
	}

	CanvasRenderingContext2D.prototype.length = function(a){
		return this.measureText(a).width;
	}

	CanvasRenderingContext2D.prototype.clear = function(a){
		this.clearRect(0,0,this.width,this.height);
	}

	CanvasRenderingContext2D.prototype.setFont = function(size){
		this.font = size + 'px Kelly Slab'
	}


}; //{

Audio = typeof Audio !== 'undefined' ? Audio : function(){	//quick fix QUICKFIX for safari... and opera
	return {
		src:'',
		play:function(){},
		currentTime:0,
		ended:false,	
		fake:true,
		addEventListener:function(){},
	}
};





