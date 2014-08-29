(function() {
  var Graph, astar, end, graph, hop, path, start, _i, _len;
  Graph = (require('./graph')).Graph;
  astar = (require('./astar.js')).astar;
  graph = new Graph(10);
  start = graph.nodes[5][5];
  end = graph.nodes[9][9];
  path = astar.search(graph.nodes, start, end);
  for (_i = 0, _len = path.length; _i < _len; _i++) {
    hop = path[_i];
    graph.nodes[hop.x][hop.y].wall();
  }
  console.log(graph.toString());
}).call(this);
