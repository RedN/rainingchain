(function() {
  /* 	astar.js http://github.com/bgrins/javascript-astar
  	MIT License
  	
  	Implements the astar search algorithm in javascript using a binary heap
  
    Example usage:
      start = graph.nodes[0][0]
      end = graph.nodes[1][2]
      astar.search graph.nodes, start, end
  
  */  var BinaryHeap, astar;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  exports.astar = astar = {
    init: function(grid) {
      var node, x, y, _ref, _results;
      _results = [];
      for (x = 0, _ref = grid.length; 0 <= _ref ? x < _ref : x > _ref; 0 <= _ref ? x++ : x--) {
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (y = 0, _ref2 = grid.length; 0 <= _ref2 ? y < _ref2 : y > _ref2; 0 <= _ref2 ? y++ : y--) {
            node = grid[x][y];
            node.f = 0;
            node.g = 0;
            node.h = 0;
            node.visited = false;
            node.closed = false;
            node.debug = '';
            _results2.push(node.parent = null);
          }
          return _results2;
        })());
      }
      return _results;
    },
    search: function(grid, start, end, heuristic) {
      var beenVisited, curr, currentNode, gScore, i, neighbor, neighbors, openHeap, ret, _ref;
      astar.init(grid);
      heuristic = heuristic || astar.manhattan;
      openHeap = new BinaryHeap(__bind(function(node) {
        return node.f;
      }, this));
      openHeap.push(start);
      while (openHeap.size() > 0) {
        currentNode = openHeap.pop();
        if (currentNode === end) {
          curr = currentNode;
          ret = [];
          while (curr.parent) {
            ret.push(curr);
            curr = curr.parent;
          }
          return ret.reverse();
        }
        currentNode.closed = true;
        neighbors = astar.neighbors(grid, currentNode);
        for (i = 0, _ref = neighbors.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
          neighbor = neighbors[i];
          if (neighbor.closed || neighbor.isWall()) {
            continue;
          }
          gScore = currentNode.g + 1;
          beenVisited = neighbor.visited;
          if (!beenVisited || gScore < neighbor.g) {
            neighbor.visited = true;
            neighbor.parent = currentNode;
            neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
            neighbor.g = gScore;
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.debug = "F: " + neighbor.f + " G: " + neighbor.g + " H: " + neighbor.h;
            if (!beenVisited) {
              openHeap.push(neighbor);
            } else {
              openHeap.rescoreElement(neighbor);
            }
          }
        }
      }
      return [];
    },
    manhattan: function(pos0, pos1) {
      var d1, d2;
      d1 = Math.abs(pos1.x - pos0.x);
      d2 = Math.abs(pos1.y - pos0.y);
      return d1 + d2;
    },
    neighbors: function(grid, node) {
      var ret, x, y;
      ret = [];
      x = node.x;
      y = node.y;
      if (grid[x - 1] && grid[x - 1][y]) {
        ret.push(grid[x - 1][y]);
      }
      if (grid[x + 1] && grid[x + 1][y]) {
        ret.push(grid[x + 1][y]);
      }
      if (grid[x] && grid[x][y - 1]) {
        ret.push(grid[x][y - 1]);
      }
      if (grid[x] && grid[x][y + 1]) {
        ret.push(grid[x][y + 1]);
      }
      return ret;
    }
  };
  exports.BinaryHeap = BinaryHeap = (function() {
    function BinaryHeap(scoreFunction) {
      this.content = [];
      this.scoreFunction = scoreFunction;
    }
    BinaryHeap.prototype.push = function(element) {
      this.content.push(element);
      return this.sinkDown(this.content.length - 1);
    };
    BinaryHeap.prototype.pop = function() {
      var end, result;
      result = this.content[0];
      end = this.content.pop();
      if (this.content.length > 0) {
        this.content[0] = end;
        this.bubbleUp(0);
      }
      return result;
    };
    BinaryHeap.prototype.remove = function(node) {
      var end, i;
      i = this.content.indexOf(node);
      end = this.content.pop();
      if (i !== (this.content.length - 1)) {
        this.content[i] = end;
        if ((this.scoreFunction(end)) < (this.scoreFunction(node))) {
          return this.sinkDown(i);
        } else {
          return this.bubbleUp(i);
        }
      }
    };
    BinaryHeap.prototype.size = function() {
      return this.content.length;
    };
    BinaryHeap.prototype.rescoreElement = function(node) {
      return this.sinkDown(this.content.indexOf(node));
    };
    BinaryHeap.prototype.sinkDown = function(n) {
      var element, parent, parentN, _results;
      element = this.content[n];
      _results = [];
      while (n > 0) {
        parentN = ((n + 1) >> 1) - 1;
        parent = this.content[parentN];
        if ((this.scoreFunction(element)) < (this.scoreFunction(parent))) {
          this.content[parentN] = element;
          this.content[n] = parent;
          n = parentN;
        } else {
          break;
        }
      }
      return _results;
    };
    BinaryHeap.prototype.bubbleUp = function(n) {
      var child1, child1N, child1Score, child2, child2N, child2Score, elemScore, element, length, swap, tmpscore, _results;
      length = this.content.length;
      element = this.content[n];
      elemScore = this.scoreFunction(element);
      _results = [];
      while (true) {
        child2N = (n + 1) << 1;
        child1N = child2N - 1;
        swap = null;
        if (child1N < length) {
          child1 = this.content[child1N];
          child1Score = this.scoreFunction(child1);
          if (child1Score < elemScore) {
            swap = child1N;
          }
        }
        if (child2N < length) {
          child2 = this.content[child2N];
          child2Score = this.scoreFunction(child2);
          tmpscore;
          if (swap === null) {
            tmpscore = elemScore;
          } else {
            tmpscore = child1Score;
          }
          if (child2Score < tmpscore) {
            swap = child2N;
          }
        }
        if (swap !== null) {
          this.content[n] = this.content[swap];
          this.content[swap] = element;
          n = swap;
        } else {
          break;
        }
      }
      return _results;
    };
    return BinaryHeap;
  })();
}).call(this);
