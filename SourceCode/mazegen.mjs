class Stack{
    constructor(){
        this.items = []
    }
    isEmpty() {
        return (this.items.length == 0)
    }
    push(item) {
        this.items.push(item);
    }
    pop() {
        if (this.isEmpty()) 
            return 'uh oh'
        return this.items.pop();
    }
    peek() {
        if (this.isEmpty()) 
            return 'uh oh'
        return this.items[this.items.length - 1];
    }
    size() {
        return this.items.length;
    }
}

function get_nbr(position, width, height){
    let nbr_arr = []
    nbr_arr.push(position - 1)
    nbr_arr.push(position + 1)
    nbr_arr.push(position - width)
    nbr_arr.push(position + width)
    let keep_terms = [true, true, true, true]
    if (position % width == 0)
        keep_terms[0] = false
    if (position % width == -1 || position % width == width-1)
        keep_terms[1] = false
    if (nbr_arr[2] < 0)
        keep_terms[2] = false
    if (nbr_arr[3] > width*height - 1)
        keep_terms[3] = false
    let act_nbrs = [];
    for (let l = 0; l < 4; l++){
        if (keep_terms[l])
            act_nbrs.push(nbr_arr[l])
    }
    return act_nbrs
}

export function maze_creator(width, height){
    const area = width*height;
    let walls = Array(2*area); // even walls are the horizontal _ ones, odd are the vertical | walls
    let cell_visited = Array(area);
    for (let l = 0; l < 2*area; l++){
        walls[l] = true;
        if (l % 2 == 0)
            cell_visited[Math.floor(l/2)] = false
    }
    let visited_cells = new Stack()
    visited_cells.push(0)
    let curr_cell;
    let nbrs;
    let visitors;
    while (!visited_cells.isEmpty()){
        // console.log(visited_cells.items)
        curr_cell = visited_cells.pop();
        cell_visited[curr_cell] = true;
        nbrs = get_nbr(curr_cell, width, height); 
        visitors = []
        for (let k = 0; k < nbrs.length; k++) { 
            if (cell_visited[nbrs[k]] == false)
                visitors.push(nbrs[k])
        }
        if (visitors.length == 0)
            continue;
        visited_cells.push(curr_cell)
        const randpos = visitors[Math.floor(Math.random() * visitors.length)];
        // console.log("visited cells", cell_visited)
        // console.log("current cell", curr_cell)
        // console.log("neighbors",nbrs)
        // console.log("unvisited neighbors", visitors)
        // console.log("next cell", randpos)
        // console.log("walls",walls)
        visited_cells.push(randpos)
        let indexer = -1
        if (randpos - curr_cell == 1)
            indexer = 2*curr_cell+1
        if (randpos - curr_cell == width)
            indexer = 2*curr_cell
        if (randpos - curr_cell == -1)
            indexer = 2*(curr_cell-1)+1
        if (randpos - curr_cell == -width)
            indexer = 2*(curr_cell-width)
        // console.log("wall remove", indexer)
        // console.log("-------------------------")
        walls[indexer] = false
    }
    return walls
}

export function print_walls(walls, width, height) {
    // console.log(walls)
    let strval=""
    for (let k = 0; k < height; k++) {
        for (let l = 0; l < 2*width; l++) {
            let charval = " "
            if (l % 2 == 0 && walls[l+k*2*width] == true)
                charval = "_"
            if (l % 2 == 1 && walls[l+k*2*width] == true)
                charval = "|"
            strval = strval + charval
        }
        strval = strval + "\n"
    }
    console.log(strval)
}
// print_walls(maze_creator(30,30), 30,30)

// console.log(get_nbr(1,2,2))