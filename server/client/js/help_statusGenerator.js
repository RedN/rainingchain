Math.probability = function(base,mod){
	return 1 - Math.pow(1-base,mod);
}
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
Object.defineProperty(Number.prototype, "toPercent", {
    enumerable: false,
    value: function(num) {
		return round(this*100,num || 0) + '%';
	}
});	
	
	
var str = '<table>'
str += '<tr>  <td></td>  <td>0.8</td>   <td>0.9</td>  <td>1.0</td>  <td>1.1</td>  <td>1.2</td>  <td>1.3</td>  <td>1.4</td>  <td>1.5</td></tr>'

for(var i = 0.05; i < 1; i += 0.1){
	str += '<tr><td>'+ i.toPercent(0) +'</td>';
	for(var j = 0.8; j < 1.51; j+= 0.1){
		str += '<td>' + (Math.probability(Math.pow(i,1.5),j)).toPercent(1) + '</td>'
	}
	str += '</tr>';
}
str += '</table>';