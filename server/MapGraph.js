eval(loadDependency(['Map']));

var MapGraph = exports.MapGraph = function(startPoint,destinationMap){
	var map = Map.getModel(startPoint.map);
	LIST[map] = LIST[map] || {};
	LIST[map][destinationMap] = startPoint;
}

var LIST = MapGraph.LIST = {};

MapGraph.findPath = function(start,goal){
	var startMap = Map.getModel(start.map);
	var goalMap = Map.getModel(goal.map);
	
	if(startMap === goalMap)
		return goal;
	
	if(startMap === 'QfirstTown-main'){
		return LIST['QfirstTown-main'][goalMap] || null;
	} else {
		return LIST[startMap] && LIST[startMap]['QfirstTown-main'] || null;
	}
}





