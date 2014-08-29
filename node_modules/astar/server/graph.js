(function() {
  /* graph.js from http://github.com/bgrins/javascript-astar
  # 	  MIT License
  #	
  #	    Creates a Graph class used in the astar search algorithm.
  #   	Includes Binary Heap (with modifications) from Marijn Haverbeke
  */  var Graph, GraphNode, GraphNodeType, astar;
  astar = (require('./astar')).astar;
  GraphNodeType = {
    OPEN: 0,
    WALL: 1,
    PATH: 8
  };
  exports.Graph = Graph = (function() {
    function Graph(size) {
      var x, y, _ref, _ref2;
      this.nodes = [];
      this.size = size;
      for (x = 0, _ref = this.size; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
        this.nodes[x] = [];
        for (y = 0, _ref2 = this.size; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
          this.nodes[x].push(new GraphNode(x, y, GraphNodeType.OPEN));
        }
      }
      this.nodes;
    }
    Graph.prototype.path = function(x, y, end_x, end_y, callback) {
      var end, path, start;
      start = this.nodes[x][y];
      end = this.nodes[end_x][end_y];
      path = astar.search(this.nodes, start, end);
      return callback(path);
    };
    Graph.prototype.set = function(x, y, type, callback) {
      switch (type) {
        case 'tower':
          return this.nodes[x][y].wall();
      }
    };
    Graph.prototype.isInGraph = function(x, y) {
      if (x >= 0 && x <= this.size && y >= 0 && y <= this.size) {
        return true;
      } else {
        return false;
      }
    };
    Graph.prototype.toString = function() {
      var graphString, nodes, row, rowDebug, x, y, _ref, _ref2;
      graphString = '\n';
      nodes = this.nodes;
      for (x = 0, _ref = nodes.length; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
        rowDebug = '';
        row = nodes[x];
        for (y = 0, _ref2 = row.length; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
          rowDebug += row[y].type + ' ';
        }
        graphString = graphString + rowDebug + '\n';
      }
      return graphString;
    };
    return Graph;
  })();
  exports.GraphNode = GraphNode = (function() {
    function GraphNode(x, y, type) {
      this.data = {};
      this.x = x;
      this.y = y;
      this.pos = {
        x: x,
        y: y
      };
      this.type = type;
    }
    GraphNode.prototype.toString = function() {
      return '[' + this.x + ' ' + this.y + ']';
    };
    GraphNode.prototype.wall = function() {
      return this.type = GraphNodeType.WALL;
    };
    GraphNode.prototype.path = function() {
      return this.type = GraphNodeType.PATH;
    };
    GraphNode.prototype.isWall = function() {
      return this.type === GraphNodeType.WALL;
    };
    GraphNode.prototype.isPath = function() {
      return this.type === GraphNodeType.PATH;
    };
    return GraphNode;
  })();
}).call(this);
