basedir = '../../'  # Root directory of the app

Graph = (require basedir + 'graph').Graph
astar = (require basedir + 'astar').astar

# Unit Tests
describe 'A* Pathing utils/astar.js', ->
  beforeEach ->
    # Stub data
    @size = 10
    @graph = new Graph @size
  
  it 'Can path from 0,0 to 4,4', ->
    start = @graph.nodes[0][0]
    end = @graph.nodes[4][4]
    @path = astar.search @graph.nodes, start, end
    
    # apply the path to the graph
    for hop in @path
      @graph.nodes[hop.x][hop.y].path()
    
    expect(@graph.nodes[0][0].isWall()).toBeFalsy() 
    expect(@graph.nodes[4][4].isWall()).toBeFalsy()
    expect(@graph.nodes[0][0].isPath()).toBeFalsy() # Current point is not path'd
    expect(@graph.nodes[4][4].isPath()).toBeTruthy() 
    expect(@graph.nodes[8][9].isPath()).toBeFalsy()
  
  it 'Can path around a single wall at 2, 2', ->
    start = @graph.nodes[0][0]
    end = @graph.nodes[4][4]
    wall = @graph.nodes[3][4]
    wall.wall()
    @path = astar.search @graph.nodes, start, end
    
    # apply the path to the graph
    for hop in @path
      @graph.nodes[hop.x][hop.y].path()
  
    expect(@graph.nodes[3][4].isWall()).toBeTruthy() 
    expect(@graph.nodes[0][0].isPath()).toBeFalsy() # Current point is not path'd
    expect(@graph.nodes[4][4].isPath()).toBeTruthy() 
    expect(@graph.nodes[8][9].isPath()).toBeFalsy()