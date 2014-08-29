//LICENSED CODE BY SAMUEL MAGNAN FOR RAININGCHAIN.COM, LICENSE INFORMATION AT GITHUB.COM/RAININGCHAIN/RAININGCHAIN
eval(loadDependency(['Db','List','Input','Actor'],['ERROR','INFO','Tk','JSONf'])); if(SERVER) var moduleAll = requireModuleAll();

eval('var INFO = exports.INFO = function(){ co' + 'nsole.log.apply(co' + 'nsole,arguments); }');

var ERROR = exports.ERROR = function(lvl,p0,p1,p2,p3,p4,p5,p6){ 
	//1: fatal, reset server || 2: shouldnt happen || 3: warn, somewhat possible
	ERROR.err(lvl,ERROR.getStack(),p0,p1,p2,p3,p4,p5,p6);
}
ERROR.err = function(lvl,err,p0,p1,p2,p3,p4,p5,p6){
	ERROR.count++;

	var str = '###################################\n' + 'Error Level ' + lvl + ': \n';
	if(p0) str += ' -- ' + JSON.stringify(p0) + '\n';	//im lazy...
	if(p1) str += ' -- ' + JSON.stringify(p1) + '\n';
	if(p2) str += ' -- ' + JSON.stringify(p2) + '\n';
	if(p3) str += ' -- ' + JSON.stringify(p3) + '\n';
	if(p4) str += ' -- ' + JSON.stringify(p4) + '\n';
	if(p5) str += ' -- ' + JSON.stringify(p5) + '\n';
	if(p6) str += ' -- ' + JSON.stringify(p6) + '\n and possibly more...';
	if(typeof err === 'string')	str += err;
	else if(err && typeof err === 'object') str += err.stack || err.message;
	
	if(ERROR.last === str) return INFO('Same: x' + ERROR.count);
	ERROR.last = str;
	
	INFO(str);
}
ERROR.count = 0;
ERROR.last = '';

ERROR.getStack = function(){
	if(SERVER || window.chrome) return (new Error()).stack;
	try { !createError; } catch(err) {
		return (new Error()).stack || err.stack || err.message;	//cuz ie sucks
	}
}

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
Tk.binarySearch = function(arr,value){
	var safetyCount = 0;
	
	var startIndex  = 0,
		stopIndex   = arr.length - 1,
		middle      = Math.floor((stopIndex + startIndex)/2);
	if(value < arr[0]) return 0;
	while(++safetyCount < 1000000 && !(value >= arr[middle] && value < arr[middle+1]) && startIndex < stopIndex){

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
	var id = (Math.randomId.count++).toString(36);
	for(var i in Db)
		if(Db[i][id]) return Math.randomId();	//if id is already picked send new one
	for(var i in List)
		if(List[i][id]) return Math.randomId();	//if id is already picked send new one
	return id;
	/*
	num = num || 9;
	var id = Math.random().toString(36).slice(2,num+2);
	return List.all[id] ? Math.randomId(num) : id;	//if id is already picked send new one
	*/
}
Math.randomId.count = 0;


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
	

Tk.newImage = function(src){
	var tmp = new Image();
	tmp.src = '/' + src;
	return tmp
}

//Function
Tk.applyFunc = exports.Tk.applyFunc = function(func,param){
	return func.apply(moduleAll, param);
}
Tk.applyFunc.key = function(key,func,param,List){
	if(!param) return func(key);
	param = Tk.arrayfy(param);
	if(param[0] === '$main') return Tk.applyFunc(func,[List.main[key]].concat(param.slice(1)));	//give access to List
	if(param[0] === '$actor') return Tk.applyFunc(func,[List.actor[key]].concat(param.slice(1)));
	return Tk.applyFunc(func,[key].concat(param));
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
Tk.stringify = function(string,func){
	if(func) return JSONf.stringify(string);
	if(typeof string === 'string'){ return '"' + string + '"'; }
	else if(typeof string === 'number'){ return string.toString(); }
	else { return JSON.stringify(string); }
}
Tk.isEqual = function(obj0,obj1){
	if(obj0 === undefined || obj1 === undefined){ return false;}	
	return obj0 == obj1;
}
var JSONf = exports.JSONf = {
	stringify:function(obj) {
		return JSON.stringify(obj,function(key, value){
			return (typeof value === 'function' ) ? value.toString() : value;
		});
	},
	parse:function(str) {
		return JSON.parse(str,function(key, value){
			if(typeof value !== 'string') return value;
			return ( value.substring(0,8) === 'function') ? eval('('+value+')') : value;
		});
	}
}

//Via Array
Tk.viaArray = {};
Tk.viaArray.get = function(d){
	try {
		if(!d.origin){ d.origin = (SERVER ? global : window);}
		if(d.array[0] === 'Actor'){ ERROR(3,'wtf');  d.origin = Actor; d.array.shift(); }	//TOFIX
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
		if(d.array[0] === 'Actor'){ ERROR(3,'wtf');  d.origin = Actor; d.array.shift(); }	//TOFIX
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
	} catch (err) { ERROR.err(3,err); }
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
	if(typeof str !== 'string'){ return '' }

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


Tk.arrayToTable = function(array,top,left){
	var str = '';
	for(var i in array){
		if(+i === 0 && top) str += '<tr class="tableHead">';
		else str += '<tr>'
		for(var j in array[i]){
			if(+j === 0 && left) str += '<td class="tableHead" style="color:white;">';
			else str += '<td>'
			str += array[i][j] + '</td>';
		}
		str += '</tr>';
	}
	return str;
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

Tk.openDialog = function(name,str){
	var a = $("#" + name);
	if(str) a.html(str);
	a.dialog('open');
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

Object.defineProperty(Object.prototype, "random", {	//return attribute
    enumerable: false,
    value: function(name){
		if(!Object.keys(this).length) return null;
		
		var ratioed = {}; 
		if(name) for(var i in this)	ratioed[i] = this[i][name]; 
		else var ratioed = this;
		
		for(var i in ratioed)
			if(typeof ratioed[i] !== 'number'){
				return ERROR(2,'not numbers',i,ratioed,Object.keys(ratioed),ratioed[i] + '');	//\server\Actor_loop_ai.js:101:32)
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

Object.defineProperty(Object.prototype, "$empty", {
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
	
	for(var i = Input.key.combo.length-1 ; i >= 0; i--){
		if(charCode >= Input.key.combo[i].boost){
			charCode -= Input.key.combo[i].boost;
			boost = Input.key.combo[i].symbol;
			break;
		}
	}
	var m;
	if(charCode == 1) var m = 'l';
	if(charCode == 2) var m = 'm';
	if(charCode == 3) var m = 'r';
	if (charCode == 8) var m = "backspace"; //  backspace
	if (charCode == 9) var m = "tab"; //  tab
	if (charCode == 13) var m = "enter"; //  enter
	if (charCode == 16) var m = "shift"; //  shift
	if (charCode == 17) var m = "ctrl"; //  ctrl
	if (charCode == 18) var m = "alt"; //  alt
	if (charCode == 19) var m = "pause/break"; //  pause/break
	if (charCode == 20) var m = "caps lock"; //  caps lock
	if (charCode == 27) var m = "escape"; //  escape
    if (charCode == 32) var m = "_";	 //space        
    if (charCode == 33) var m = "page up"; // page up, to avoid displaying alternate character and confusing people	         
	if (charCode == 34) var m = "page down"; // page down
	if (charCode == 35) var m = "end"; // end
	if (charCode == 36) var m = "home"; // home
	if (charCode == 37) var m = "left arrow"; // left arrow
	if (charCode == 38) var m = "up arrow"; // up arrow
	if (charCode == 39) var m = "right arrow"; // right arrow
	if (charCode == 40) var m = "down arrow"; // down arrow
	if (charCode == 45) var m = "insert"; // insert
	if (charCode == 46) var m = "delete"; // delete
	if (charCode == 91) var m = "left window"; // left window
	if (charCode == 92) var m = "right window"; // right window
	if (charCode == 93) var m = "select key"; // select key
	if (charCode == 96) var m = "N0"; // N0
	if (charCode == 97) var m = "N1"; // N1
	if (charCode == 98) var m = "N2"; // N2
	if (charCode == 99) var m = "N3"; // N3
	if (charCode == 100) var m = "N4"; // N4
	if (charCode == 101) var m = "N5"; // N5
	if (charCode == 102) var m = "N6"; // N6
	if (charCode == 103) var m = "N7"; // N7
	if (charCode == 104) var m = "N8"; // N8
	if (charCode == 105) var m = "N9"; // N9
	if (charCode == 106) var m = "multiply"; // multiply
	if (charCode == 107) var m = "add"; // add
	if (charCode == 109) var m = "subtract"; // subtract
	if (charCode == 110) var m = "decimal point"; // decimal point
	if (charCode == 111) var m = "divide"; // divide
	if (charCode == 112) var m = "F1"; // F1
	if (charCode == 113) var m = "F2"; // F2
	if (charCode == 114) var m = "F3"; // F3
	if (charCode == 115) var m = "F4"; // F4
	if (charCode == 116) var m = "F5"; // F5
	if (charCode == 117) var m = "F6"; // F6
	if (charCode == 118) var m = "F7"; // F7
	if (charCode == 119) var m = "F8"; // F8
	if (charCode == 120) var m = "F9"; // F9
	if (charCode == 121) var m = "F10"; // F10
	if (charCode == 122) var m = "F11"; // F11
	if (charCode == 123) var m = "F12"; // F12
	if (charCode == 144) var m = "num lock"; // num lock
	if (charCode == 145) var m = "scroll lock"; // scroll lock
	if (charCode == 186) var m = ";"; // semi-colon
	if (charCode == 187) var m = "="; // equal-sign
	if (charCode == 188) var m = ","; // comma
	if (charCode == 189) var m = "-"; // dash
	if (charCode == 190) var m = "."; // period
	if (charCode == 191) var m = "/"; // forward slash
	if (charCode == 192) var m = "`"; // grave accent
	if (charCode == 219) var m = "["; // open bracket
	if (charCode == 220) var m = "\\"; // back slash
	if (charCode == 221) var m = "]"; // close bracket
	if (charCode == 222) var m = "'"; // single quote
	
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
    return '"' + this + '"';
};











