//Collections of handy scripts.


//Disable Text Select
/*
(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);
*/

/* Close Browser
window.onbeforeunload = function(){
	return 'Note: Ctrl + W closes the window.';
}
*/

navigator.browserVersion = (function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    return M.join(' ');
})();


//Disable space - scrollbar
$(function(){
    var rx = /INPUT|SELECT|TEXTAREA/i;

    $(document).bind("keydown keypress", function(e){
        if( e.which == 8 ){ // 8 = backspace
            if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                e.preventDefault();
            }
        }
    });
});



ctxrestore = function(){
	for(var i in List.ctx){
		List.ctx[i].font = '20px Monaco';
		List.ctx[i].fillStyle = 'black';
		List.ctx[i].strokeStyle = 'black';
		List.ctx[i].globalAlpha = 1; 
		List.ctx[i].textAlign = 'left';
		List.ctx[i].textBaseline = 'top';
		List.ctx[i].shadowColor = 'black';
		List.ctx[i].shadowBlur = 0;
		List.ctx[i].shadowOffsetX = 0;
		List.ctx[i].shadowOffsetY = 0;
	}
}


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

CanvasRenderingContext2D.prototype.fillTextU = function(text, x, y){
	var tmp = this.strokeStyle;
	this.strokeStyle = this.fillStyle;
	
	this.fillText(text, x, y);
		
	var textSize = +this.font.numberOnly();
	
	var textWidth = this.measureText(text).width;  
	if(this.textAlign == "center"){
		var startX = x - (textWidth/2);
		var endX = x + (textWidth/2);
	}else if(this.textAlign == "right"){
		var startX = x-textWidth;
		var endX = x;
	}else{
		var startX = x;
		var endX = x + textWidth;
	}
	this.lineWidth = 1;
	
	this.beginPath();
	this.moveTo(startX,y+textSize);
	this.lineTo(endX,y+textSize);
	this.stroke();
	
	this.strokeStyle = tmp;
}



CanvasRenderingContext2D.prototype.drawRect = function(x,y, vx, vy){
	ctx.fillRect(x,y, vx, vy);
	ctx.strokeRect(x,y, vx, vy);
}


CanvasRenderingContext2D.prototype.length = function(a){
	return this.measureText(a).width;
}





