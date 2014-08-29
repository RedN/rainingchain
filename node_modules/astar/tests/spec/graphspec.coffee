basedir = '../../'  # Root directory of the app

Graph = (require basedir + 'graph').Graph

# Unit Tests
describe '2d Graph utils/graph.js', ->
  beforeEach ->
    # Stub data
    @size = 10
    @graph = new Graph @size
  
  it 'Creates a 10x10 empty grid', ->
    expect(@graph).toBeDefined()
    expect(@graph.toString().length).toEqual 211
    expect(@graph.nodes[0][0].isWall()).toBeFalsy()
    expect(@graph.nodes[9][9].isWall()).toBeFalsy()
    expect(@graph.nodes[15]).toBeUndefined()
  
  it 'Can add a wall to the grid at 3, 6', ->
    @graph.nodes[3][6].wall() 
    expect(@graph.nodes[3][6].isWall()).toBeTruthy()