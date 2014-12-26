
ERROR = exports.ERROR = function(lvl,p0,p1,p2,p3,p4,p5,p6){ 
	//1: fatal, reset server || 2: shouldnt happen || 3: warn, somewhat possible
	
	var stack = ERROR.getStack().split('\n');	//remove first 3 useless stack
	for(var i = 0 ; i < stack.length;){
		if(!stack[i]) break;
		if(stack[i].contains('ERROR')) stack.splice(0,1);
		else break;
	}
	
	stack = stack.join('\r\n');
	
	ERROR.err(lvl,stack,p0,p1,p2,p3,p4,p5,p6);
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
	
	if(!ERROR.display) return;
	if(ERROR.count > ERROR.resetAt) return;
	var all = SERVER ? global : window;
	if(ERROR.last === str) return all['con' + 'sole'].log('Same: x' + ERROR.count);
	ERROR.last = str;
	
	all['con' + 'sole'].log(str);
	
	//quest
	if(SERVER && str.contains('(C:\\rc\\rainingchain\\server\\client\\quest\\')){
		var list = str.split('(C:\\rc\\rainingchain\\server\\client\\quest\\');
		for(var i = list.length-1; i >= 0; i--){
			if(list[i][0] !== 'Q'){
				list.removeAt(i);
			} else {
				list[i] = list[i].slice(0,list[i].indexOf(')'));
			}
		}
		var str2 = '';
		str2 = '*** This error originated from: *** \r\n';
		for(var i in list){
			var questName = list[i].split(':')[0].split('\\')[1];
			var line = list[i].split(':')[1];
			str2 += '       Quest file "' + questName + '" at line ' + line + '\r\n';
		}
		all['con' + 'sole'].log('');
		all['con' + 'sole'].log(str2);
	}
	
	
}
ERROR.count = 0;
ERROR.last = '';
ERROR.display = true;
ERROR.resetAt = 100;

ERROR.getStack = function(){
	if(SERVER || window.chrome) return (new Error()).stack;
	try { !createError; } catch(err) {
		return (new Error()).stack || err.stack || err.message;	//cuz ie sucks
	}
}

ERROR.loop = function(){
	ERROR.count = Math.max(ERROR.count - 0.1,0);
	if(ERROR.count > ERROR.resetAt){
		ERROR.count = 0;
		return ERROR.last;
	}
	return false;
}

		
