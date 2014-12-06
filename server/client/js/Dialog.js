(function(){ //}
Dialog = function(id,title,size,refresh,variable,notDialog){
	var html = $('<div>')
		.attr('title',title||'')
		
	if(!notDialog)
		html.dialog({
			autoOpen: false,
			width:size.width, 
			height:size.height,
			close: function( event, ui ) {
				Dialog.close(id);
			},
		});
	
	LIST[id] = {
		html:html,
		refresh:refresh || CST.func,
		variable:variable || {},
		param:null,
		isDialog:!notDialog,
	}
	if(id !== 'stage')
		html.css({zIndex:Dialog.ZINDEX.NORMAL});
	
	return html;
}
var LIST = Dialog.LIST = {};
var ACTIVE = Dialog.ACTIVE = {};
var FRAME_COUNT = 0;

Dialog.Size = function(width,height){
	return {
		width:width || 600,
		height:height || 400,
	}
}	
Dialog.Refresh = function(create,getOld,interval,loop,close){
	return {
		create:create,	//if return value, it will become dialog.param
		getOld:getOld || CST.func,
		interval:interval || 10,
		oldValue:undefined,
		loop:loop || CST.func,
		close:close || CST.func
	}
}

Dialog.open = function(name,param){
	var dialog = LIST[name];
	dialog.param = param || null;
	dialog.html.html('');	//reset
	var ret = dialog.refresh.create(dialog.html,dialog.variable,dialog.param);	
	if(ret === false) return Dialog.close(name);
	
	/*
	if($.contains(dialog[0],$('.toolTipDetails')[0])){
		$('.toolTipDetails').remove();
	}
	*/
	
	dialog.param = ret || dialog.param;
	
	dialog.refresh.oldValue = dialog.refresh.getOld(dialog.html,dialog.variable,dialog.param);
	
	if(dialog.isDialog)
		dialog.html.dialog('open');
	else {
		$('#gameDiv').append(dialog.html);
		if(ret !== null)
			dialog.html.show();
	}
	/* cant use fuck everytime hp changes...
	$(".ui-tooltip-content").parents('div').remove();
	setTimeout(function(){	//bad... bug fix
		$(".ui-tooltip-content").parents('div').remove();
	},100);
	*/
	
	ACTIVE[name] = true;
}

Dialog.close = function(name){
	if(!ACTIVE[name]) return;
	var dialog = LIST[name];
	if(dialog.isDialog)
		dialog.html.dialog('close');
	else dialog.html.hide();
	dialog.refresh.close();
	delete ACTIVE[name];
}

Dialog.closeAll = function(){
	var alreadyAllClosed = true;
	for(var i in LIST){
		if(LIST[i].isDialog){
			if(ACTIVE[i]){
				alreadyAllClosed = false;
				Dialog.close(i);
			}
		}
	}
	return alreadyAllClosed;
}

Dialog.loop = function(){
	FRAME_COUNT++;
	for(var i in ACTIVE){
		var dialog = LIST[i];
		
		if(FRAME_COUNT % dialog.refresh.interval !== 0) continue;
		var old = dialog.refresh.getOld(dialog.html,dialog.variable,dialog.param);
		if(dialog.refresh.oldValue !== old){
			Dialog.refresh(i,dialog.param);
		} else {
			dialog.refresh.loop(dialog.html,dialog.variable,dialog.param);	
		}
	}
}

Dialog.refresh = function(name,param){
	Dialog.close(name);
	Dialog.open(name,param);
}

Dialog.get = function(name){
	return LIST[name].html;
}

Dialog.init = function(){
	for(var i in LIST){
		if(!LIST[i].isDialog)
			Dialog.open(i);
	}
}

Dialog.isOpened = function(name){
	return !!ACTIVE[name];
}

Dialog.UI = function(id,css,create,getOld,interval,loop,close,variable){
	var myDialog = Dialog(id,'',null,Dialog.Refresh(create,getOld,interval,loop,close),variable,true);

	css = css || {};
	css.zIndex = css.zIndex === undefined ? Dialog.ZINDEX.NORMAL : css.zIndex;
	myDialog.css(css || {});
	return myDialog;
}

Dialog.isMouseOverDialog = function(){
	var list = document.querySelectorAll( ":hover" );
	for(var i = 0 ; i < list.length; i++)
		if(list[i].id && list[i].id.have('ui-id')) return true;
	return false;
}


Dialog.ZINDEX = {
	LOW:0,
	NORMAL:10,
	jqueryDialog:50,	//Check css.css		.ui-dialog { z-index: 50 !important ;}
	HIGH:100,
}


})();