Graph = (require './graph').Graph
astar = (require './astar.js').astar

graph = new Graph 10
start = graph.nodes[5][5]
end = graph.nodes[9][9]

path = astar.search graph.nodes, start, end
for hop in path
  graph.nodes[hop.x][hop.y].wall()
console.log graph.toString()
