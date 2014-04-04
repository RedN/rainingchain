//List of handy functions.



LOG = function(lvl,key,name,param){
	/*
	0:Very important
	1:important (saved)
	2:NOT really important (not saved)
	*/
	var act = List.all[key];
	var id = act ? act.name : key;
	
	if(lvl > LOG.level) return;
	
	var param = '';
	for(var i = 3; i < arguments.length; i++)	param += arguments[i];
	
	LOG.data.push({
		time:Date.now(),
		id:id,
		name:name,
		param:param,
	});
}

LOG.display = function(key){
	if(!key){ permConsoleLog(LOG.data); return; }
	
	for(var i in LOG.data){
		if(LOG.data[i].id === key){
			var date = new Date(LOG.data[i].time).toLocaleString();
			permConsoleLog(date,LOG.data[i].name,LOG.data[i].param);
		}
	}
	
}
LOG.data = [];
LOG.level = 2;



DEBUG = function(lvl,message){
	/*
	0:CRASH
	1:ERR
	2:NOT GOOD
	3:IMPORTANT ACTION
	4:NOT IMPORTANT ACTION	
	*/
	
	if(lvl > DEBUG.level) return;
	
	var arg = '';
	for (var i=1; i<arguments.length; i++) 
		if(typeof arg !== 'undefined') 
			arg += JSON.stringify(arguments[i]) + ',';
	arg = arg.slice(0,-1);
	
	
	var trace = new Error().stack;
	if(!DEBUG.minify){
		permConsoleLog(arg,trace);
		return;
	}
	
	var array = trace.split('\n    at ');		//put in array
	array.splice(0,2);					//remove first 2 line (Error. and info about DEBUG)
	
	var func = [];
	for(var i = 0 ; i < DEBUG.stackSize && i < array.length; i++){
		if(array[i].have("Object"))	//Object.[Actor.updateEquip] (C:\\r
			func.push(array[i].slice(7,array[i].indexOf(' (C:')));
		else if(array[i].have("Function"))	//Function.Load.player.uncompress (C:
			func.push(array[i].slice(9,array[i].indexOf(' (C:')));
		else 
			func.push(array[i].slice(0,array[i].indexOf(' (C:')));
	}
	var str = func[0];
	str += '(' + arg + '); ';
	for(var i =1;i<func.length;i++) str += ' *** ' + func[i];
	permConsoleLog(str);
		
}  

DEBUG.level = 10;
DEBUG.stackSize = 10;
DEBUG.minify = true;



function getParamNames(func) {
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var fnStr = func.toString().replace(STRIP_COMMENTS, '')
	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g)
	if(result === null)  result = []
  return result
}

//Math
sin = function (number){
	return (Math.sin(number/180*Math.PI))
}
cos = function (number){
	return (Math.cos(number/180*Math.PI))
}
atan = function (number){
	return (Math.atan(number)/Math.PI*180)
}
atan2 = function (y,x){
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
binarySearch = function(arr,value){
	var startIndex  = 0,
		stopIndex   = arr.length - 1,
		middle      = Math.floor((stopIndex + startIndex)/2);
	if(value < arr[0]) return 0;
	while(!(value >= arr[middle] && value < arr[middle+1]) && startIndex < stopIndex){

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
Math.randomId = function(num){
	num = num || 9;
	return Math.random().toString(36).slice(2,num+2);
}

Math.randomML = function(num){
	num = num || 1;
	return (Math.random()*2-1)*num
}
Math.probability = function(base,mod){
	return 1 - Math.pow(1-base,mod);
}
findMin = function(list,func){
	var min = func(list[0]);
	for(var i = 1 ; i  < list.length ; i++){
		min = Math.min(min,func(list[i]));
	}
	return min;
}
findMax = function(list,func){
	var max = func(list[0]);
	for(var i = 1 ;i  < list.length ; i++){
		max = Math.max(max,func(list[i]));
	}
	return max;
}
parseFloatInBase = function(n, radix) {
	radix = radix || 10;
    var nums = n.split(".");
    var iPart = parseInt(nums[0], radix);
	if(nums.length === 1) return iPart;
    var fPart = parseInt(nums[1], radix) / Math.pow(radix, nums[1].length);
	return iPart + fPart
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
		return round(this*100,num || 0) + '%';
	}
});	
	
Object.defineProperty(Number.prototype, "toChrono", {
    enumerable: false,
    value: function() {
		var time = this;
		var hour = Math.floor(time / Cst.HOUR);
		time %= Cst.HOUR;
		var min = Math.floor(time / Cst.MIN);
		min = min < 10 ? '0' + min : min;
		time %= Cst.MIN;
		var sec = Math.floor(time / Cst.SEC);
		sec = sec < 10 ? '0' + sec : sec;
		var milli = time % Cst.SEC;
		
		return hour + ':' + min + ':' + sec + '.' + milli;		
	}
});	



	
	
	
//Function
applyFunc = function(func,param){
	if(typeof func === 'string'){
		if(func.indexOf('.') !== -1){
			if(func.indexOf('Actor') === 0) param[0] = List.actor[param[0]]; 
			else if(func.indexOf('Main') === 0) param[0] = List.main[param[0]];
			
			func = viaArray.get({'origin':this,'array':func.split('.')});
		} else {
			func = this[func];
		}
	}
	
	return func.apply(this, param);
}
applyFunc.key = function(key,func,param){
	return applyFunc(func,[key].concat(param));
}



//Copy

deepClone = function(obj){
	if(obj === null || typeof(obj) !== 'object')
        return obj;

    var temp = obj.constructor();

    for(var key in obj)
        temp[key] = deepClone(obj[key]);
    return temp;
}
stringify = function(string){
	if(typeof string === 'string'){ return '"' + string + '"'; }
	else if(typeof string === 'number'){ return string.toString(); }
	else { return JSON.stringify(string); }
}
isEqual = function(obj0,obj1){
	if(obj0 === undefined || obj1 === undefined){ return false;}	
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
		if(typeof value !== 'string') return value;
		return ( value.substring(0,8) === 'function') ? eval('('+value+')') : value;
	});
}

//Via Array
viaArray = {};
viaArray.get = function(d){
	try {
		if(typeof d.array != 'object'){ return d.origin[array]; }
		if(!d.origin){ d.origin = (server ? this : window);}
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
	} catch (err) { logError(err); }
}
viaArray.set = function(d){
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
	} catch (err) { logError(err); }
}
viaArray.add = function(d){
	try {
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
	} catch (err) { logError(err); }
}

//Round
round = function (num,decimals,str){
	if(!str){ 
		decimals = decimals || 0;
		return Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals); 
	}
	if(!decimals){ return Math.round(num).toString(); }
	
	
	
	var num = round(num,decimals).toString();
	
	var dot = num.indexOf('.');
	if(dot == -1){ num += '.'; dot = num.length-1; }
	
	var missing0 = decimals - num.length + dot + 1;
	
	for(var i=0 ; i < missing0; i++){ num += '0'; }
	
	return num;
}
formatNum = function(num){
	 return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//String
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
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
		
	if(charCode == 1) return boost + 'l';
	if(charCode == 2) return boost + 'm';
	if(charCode == 3) return boost + 'r';
	if (charCode == 8) return boost + "backspace"; //  backspace
	if (charCode == 9) return boost + "tab"; //  tab
	if (charCode == 13) return boost + "enter"; //  enter
	if (charCode == 16) return boost + "shift"; //  shift
	if (charCode == 17) return boost + "ctrl"; //  ctrl
	if (charCode == 18) return boost + "alt"; //  alt
	if (charCode == 19) return boost + "pause/break"; //  pause/break
	if (charCode == 20) return boost + "caps lock"; //  caps lock
	if (charCode == 27) return boost + "escape"; //  escape
    if (charCode == 32) return boost + "_";	 //space        
    if (charCode == 33) return boost + "page up"; // page up, to avoid displaying alternate character and confusing people	         
	if (charCode == 34) return boost + "page down"; // page down
	if (charCode == 35) return boost + "end"; // end
	if (charCode == 36) return boost + "home"; // home
	if (charCode == 37) return boost + "left arrow"; // left arrow
	if (charCode == 38) return boost + "up arrow"; // up arrow
	if (charCode == 39) return boost + "right arrow"; // right arrow
	if (charCode == 40) return boost + "down arrow"; // down arrow
	if (charCode == 45) return boost + "insert"; // insert
	if (charCode == 46) return boost + "delete"; // delete
	if (charCode == 91) return boost + "left window"; // left window
	if (charCode == 92) return boost + "right window"; // right window
	if (charCode == 93) return boost + "select key"; // select key
	if (charCode == 96) return boost + "N0"; // N0
	if (charCode == 97) return boost + "N1"; // N1
	if (charCode == 98) return boost + "N2"; // N2
	if (charCode == 99) return boost + "N3"; // N3
	if (charCode == 100) return boost + "N4"; // N4
	if (charCode == 101) return boost + "N5"; // N5
	if (charCode == 102) return boost + "N6"; // N6
	if (charCode == 103) return boost + "N7"; // N7
	if (charCode == 104) return boost + "N8"; // N8
	if (charCode == 105) return boost + "N9"; // N9
	if (charCode == 106) return boost + "multiply"; // multiply
	if (charCode == 107) return boost + "add"; // add
	if (charCode == 109) return boost + "subtract"; // subtract
	if (charCode == 110) return boost + "decimal point"; // decimal point
	if (charCode == 111) return boost + "divide"; // divide
	if (charCode == 112) return boost + "F1"; // F1
	if (charCode == 113) return boost + "F2"; // F2
	if (charCode == 114) return boost + "F3"; // F3
	if (charCode == 115) return boost + "F4"; // F4
	if (charCode == 116) return boost + "F5"; // F5
	if (charCode == 117) return boost + "F6"; // F6
	if (charCode == 118) return boost + "F7"; // F7
	if (charCode == 119) return boost + "F8"; // F8
	if (charCode == 120) return boost + "F9"; // F9
	if (charCode == 121) return boost + "F10"; // F10
	if (charCode == 122) return boost + "F11"; // F11
	if (charCode == 123) return boost + "F12"; // F12
	if (charCode == 144) return boost + "num lock"; // num lock
	if (charCode == 145) return boost + "scroll lock"; // scroll lock
	if (charCode == 186) return boost + ";"; // semi-colon
	if (charCode == 187) return boost + "="; // equal-sign
	if (charCode == 188) return boost + ","; // comma
	if (charCode == 189) return boost + "-"; // dash
	if (charCode == 190) return boost + "."; // period
	if (charCode == 191) return boost + "/"; // forward slash
	if (charCode == 192) return boost + "`"; // grave accent
	if (charCode == 219) return boost + "["; // open bracket
	if (charCode == 220) return boost + "\\"; // back slash
	if (charCode == 221) return boost + "]"; // close bracket
	if (charCode == 222) return boost + "'"; // single quote

	return boost + String.fromCharCode(charCode);
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



//Testing
eval('permCo' + 'nsoleLog = function(){ co' + 'nsole.log.apply(co' + 'nsole,arguments); }');
logError = function(err) {
	//permConsoleLog(err); return;
	if (typeof err === 'object') {
		if (err.message) { permConsoleLog('\nMessage: ' + err.message) }
		if (err.stack) { permConsoleLog(err.stack); }
	} else {
		permConsoleLog('logError :: argument is not an object');
	}
}

//Misc
escape.quote = function(str){
	if(typeof str !== 'string'){ return '' }
	
	str.replaceAll('"','\"');
	str.replaceAll("'","\'");
	return str;
}

escape.user = function(name){
	return name.replace(/[^a-z0-9 ]/ig, '')
}
escape.email = function(str){
	if(typeof str !== 'string'){ return '' }

    var re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    re.test(str) ? str : '';
}


changeVisibility = function(id){
	var el = document.getElementById(id);
	el.style.visibility = el.style.visibility === 'hidden' ? 'visible' : 'hidden';
}
useTemplate = function(temp,obj,deep,viaarray){
	if(deep !== 0) obj = deepClone(obj); 
	
	if(viaarray){
		for(var i in obj) viaArray.set({origin:temp,array:i.split(','),value:obj[i]});
		return temp;
	}
	
	for(var i in obj)	temp[i] = obj[i];	
	return temp;
}


arrayfy = function(a){
	return (a instanceof Array) ? a : [a];
}





newImage = function(src){
	var tmp = new Image();
	tmp.src = '/' + src;
	return tmp
}


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

Object.defineProperty(Array.prototype, "normalize", {	// convertRatio for array
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
		
		if(name){ var ratioed = {}; for(var i in this) ratioed[i] = this[i][name]; }
		else { var ratioed = this;}
		
		
		ratioed = convertRatio(ratioed);		
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

Object.defineProperty(Object.prototype, "$sum", {
    enumerable: false,
    value: function(){
		var count = 0;
		for(var i in this) count += this[i];
		return count;
	}
});	
	
	
convertRatio = function(ratio){
	var sum = 0;
	for(var i in ratio) sum += ratio[i];
	for(var i in ratio) ratio[i] /= sum;
	return ratio;
}



Object.defineProperty(Array.prototype, "have", {
    enumerable: false,
    value: function(name){
		return this.indexOf(name) !== -1;
	}
});	
Object.defineProperty(Array.prototype, "insert", {
    enumerable: false,
    value: function (index, item) {
	  this.splice(index, 0, item);
	}
});


