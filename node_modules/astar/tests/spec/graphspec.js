(function() {
  var Graph, basedir;
  basedir = '../../';
  Graph = (require(basedir + 'graph')).Graph;
  describe('2d Graph utils/graph.js', function() {
    beforeEach(function() {
      this.size = 10;
      return this.graph = new Graph(this.size);
    });
    it('Creates a 10x10 empty grid', function() {
      expect(this.graph).toBeDefined();
      expect(this.graph.toString().length).toEqual(211);
      expect(this.graph.nodes[0][0].isWall()).toBeFalsy();
      expect(this.graph.nodes[9][9].isWall()).toBeFalsy();
      return expect(this.graph.nodes[15]).toBeUndefined();
    });
    return it('Can add a wall to the grid at 3, 6', function() {
      this.graph.nodes[3][6].wall();
      return expect(this.graph.nodes[3][6].isWall()).toBeTruthy();
    });
  });
}).call(this);
