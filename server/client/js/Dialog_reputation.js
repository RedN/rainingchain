(function(){ //}
Dialog('reputation','Reputation Reward',Dialog.Size(600,600),Dialog.Refresh(function(){
	Dialog.reputation.apply(this,arguments);
},function(){
	return Tk.stringify(main.reputation)
}));
//Dialog.open('reputation')
Dialog.reputation = function (html,variable){
	Dialog.reputation.left(html,variable);
	Dialog.reputation.grid(html,variable);
}



Dialog.reputation.left = function(html,variable){
	var usablePt = main.reputation.usablePt.r(2);
	var usedPt = main.reputation.list[main.reputation.activeGrid].usedPt;	//bad
	var unusedPt = (usablePt-usedPt).r(0);
	var removePt = main.reputation.removePt.r(1);
	
	var el = $('<div>');
		
	var str = '<span style="font-size:30px" title="' + unusedPt + ' Available Point(s). Complete/Repeat quests to get more points.">'
		+ 'Points: ' + usedPt + '/' + usablePt + '</span>';
	str += '<span title="Use Orb of Removal obtained from completing quests to get more Remove Points."> - Remove Pts: ' + removePt + '</span><br>';
	str += ' - Quests grant reputation points which give bonus to a stat.';

	el.append($('<span>').html(str));
	
	html.append(el);
}

Dialog.reputation.grid = function(html,variable){
	var iconSize = 24;
	var border = iconSize/3;
	var border2 = border/2;
	var ic = iconSize + border;
	
	var el = $('<div>')
		.css({
			lineHeight:iconSize/2 + 'px',
		});
	html.append(el);
	
	var grid = Main.reputation.getGrid(main);
	
	//Draw Stat	
	var gridBase = ReputationGrid.get().base;
	for(var i = 0 ; i < grid.length ; i++){
		for(var j = 0 ; j < grid[i].length ; j++){
			var base = gridBase[i][j];
			var canvas = $('<canvas>').attr({height:ic,width:ic});
			var ctx = canvas[0].getContext('2d');
			
			var value = Main.reputation.getValue(grid,i,j);
			//Freebies
			if(value === 2){	//TOFIX should only be ===2
				ctx.fillStyle = 'green';
				ctx.fillRect(0,0,ic,ic);
				el.append(canvas);
				continue;
			}
			
			//Border
			ctx.fillStyle = value === 1 ? 'green' : ((Main.reputation.testAdd(grid,i,j) ? '#FFFF00': 'red'));
			ctx.fillRect(0,0,ic,ic);
			
			//Boost
			canvas.click((function(i,j){
				return function(){
					Command.execute('win,reputation,add' ,[main.reputation.activeGrid,i,j]);
				};
			})(i,j));
			canvas.bind('contextmenu',(function(i,j){
				return function(){
					Command.execute('win,reputation,remove',[main.reputation.activeGrid,i,j]);
				};
			})(i,j));
			
			//#####################
			var stat = Stat.get(base.stat);
			if(value === 1) 
				canvas.attr('title','Right Click: Remove ' + stat.name);
			else {
				if(stat.custom) canvas.attr('title','Left Click: ' + stat.description);
				else canvas.attr('title','Left Click: Boost ' + stat.name + ' by x0.02');
			}
				
			
			if(stat.custom){
				Img.drawIcon(ctx,stat.icon,border2,border2,iconSize);
				ctx.strokeStyle = value === 1 ? 'white' : 'blue';
				ctx.lineWidth = 2;
				ctx.strokeRect(border2-2,border2-2,iconSize+4,iconSize+4);
			} else {
				ctx.globalAlpha = value === 1 ? 1 : 0.5;
				Img.drawIcon(ctx,stat.icon,border2,border2,iconSize);
			}	
			
			el.append(canvas);			
		}
		el.append("<br>");
	}
}

})();

