(function() {
  var Graph, astar, basedir;
  basedir = '../../';
  Graph = (require(basedir + 'graph')).Graph;
  astar = (require(basedir + 'astar')).astar;
  describe('A* Pathing utils/astar.js', function() {
    beforeEach(function() {
      this.size = 10;
      return this.graph = new Graph(this.size);
    });
    it('Can path from 0,0 to 4,4', function() {
      var end, hop, start, _i, _len, _ref;
      start = this.graph.nodes[0][0];
      end = this.graph.nodes[4][4];
      this.path = astar.search(this.graph.nodes, start, end);
      _ref = this.path;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hop = _ref[_i];
        this.graph.nodes[hop.x][hop.y].path();
      }
      expect(this.graph.nodes[0][0].isWall()).toBeFalsy();
      expect(this.graph.nodes[4][4].isWall()).toBeFalsy();
      expect(this.graph.nodes[0][0].isPath()).toBeFalsy();
      expect(this.graph.nodes[4][4].isPath()).toBeTruthy();
      return expect(this.graph.nodes[8][9].isPath()).toBeFalsy();
    });
    return it('Can path around a single wall at 2, 2', function() {
      var end, hop, start, wall, _i, _len, _ref;
      start = this.graph.nodes[0][0];
      end = this.graph.nodes[4][4];
      wall = this.graph.nodes[3][4];
      wall.wall();
      this.path = astar.search(this.graph.nodes, start, end);
      _ref = this.path;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hop = _ref[_i];
        this.graph.nodes[hop.x][hop.y].path();
      }
      expect(this.graph.nodes[3][4].isWall()).toBeTruthy();
      expect(this.graph.nodes[0][0].isPath()).toBeFalsy();
      expect(this.graph.nodes[4][4].isPath()).toBeTruthy();
      return expect(this.graph.nodes[8][9].isPath()).toBeFalsy();
    });
  });
}).call(this);
