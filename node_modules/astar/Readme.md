# a*star

A* Pathing implementation for NodeJS in Coffeescript

(Forked from bgrins' awesome Javascript implementation via MIT License)

_Uses a Binary Heap for speeeeeed!_

Note: This is just the server-side code to get a* pathing working in NodeJS. If you want the client-side code, check out bgrins' library here: https://github.com/bgrins/javascript-astar

## Install
```npm install astar```

## Usage
**Create the Graph:**
    
    Graph = (require 'astar').Graph # This a* implementation uses a graph

    graph = new Graph 10


**Search the Graph:**
    # Starting point
    x = 0
    y = 1

    # Ending point
    end_x = 8
    end_y = 9

    graph.path x, y, end_x, end_y, (path) ->
      # Do stuff with the path here or do a callback path to use it elsewhere


**Add some walls:**
    # We want a wall at 5, 6
    x = 5
    y = 6

    graph.set 5, 6 ->
  
**To run the tests**
    npm install
    
    cake tests#
