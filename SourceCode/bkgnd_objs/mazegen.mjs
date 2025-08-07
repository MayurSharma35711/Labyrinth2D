import { walls } from "../vis_updated.mjs";
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/WallsVertical.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/WallsHorizontal.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/horiz_door.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/vert_door.png');
import { Stack } from "../methods/datatypes.mjs";

export class TileWall{
    ind_x;
    ind_y;
    exists;
    isVertical;
    isClimbable;
    isBreakable;
    color;
    borderColor;
    wall_image;
    constructor(ind_x, ind_y, exists, isVertical, isClimbable = false, isBreakable = false) {
        this.ind_x = ind_x
        this.ind_y = ind_y
        this.exists = exists;
        this.isVertical = isVertical
        this.isClimbable = isClimbable
        this.isBreakable = isBreakable
        this.setColor()
        this.rendered = false;
        this.setDoor = false;
    }
    isDoor()
    {
        this.setDoor = true;
        this.exists = false;
    }
    setColor() {
        if (this.isClimbable) 
            this.color = 0x777777
        else
            this.color = 0xFFFFFF
        if (this.isBreakable)
            this.borderColor = 0x00FFFF
        else
            this.borderColor = 0x000000
    }
    drawMe(cell_width, cell_height, currx, curry, opac){
        if (this.setDoor) {
            this.wall_image = new PIXI.Sprite();
            if(this.isVertical)
            {
                this.wall_image = PIXI.Sprite.from('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/vert_door.png');
                this.wall_image.height = cell_height;
                this.wall_image.width = 0.3 * cell_width;
                this.wall_image.x = (this.ind_x - currx) * cell_width  + 0.85*cell_width;
                this.wall_image.y = (this.ind_y - curry) * cell_height;
                this.wall_image.borderColor = 0xFFFFFF
                this.wall_image.alpha = opac
            }
            else
            {
                this.wall_image = PIXI.Sprite.from('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/horiz_door.png');
                this.wall_image.height = 0.3 * cell_height;
                this.wall_image.width = cell_width;
                this.wall_image.x = (this.ind_x - currx) * cell_width;
                this.wall_image.y = (this.ind_y - curry) * cell_height + 0.85*cell_height;
                this.wall_image.borderColor = 0xFFFFFF
                this.wall_image.alpha = opac
            }
            walls.addChild(this.wall_image);
        }
        else if (this.exists){
            this.wall_image = new PIXI.Sprite();
            if(this.isVertical)
            {
                this.wall_image = PIXI.Sprite.from('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/WallsVertical.png');
                this.wall_image.height = cell_height;
                this.wall_image.width = 0.3 * cell_width;
                this.wall_image.x = (this.ind_x - currx) * cell_width  + 0.85*cell_width;
                this.wall_image.y = (this.ind_y - curry) * cell_height;
                this.wall_image.borderColor = 0xFFFFFF
                this.wall_image.alpha = opac
            }
            else
            {
                this.wall_image = PIXI.Sprite.from('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/WallsHorizontal.png');
                this.wall_image.height = 0.3 * cell_height;
                this.wall_image.width = cell_width;
                this.wall_image.x = (this.ind_x - currx) * cell_width;
                this.wall_image.y = (this.ind_y - curry) * cell_height + 0.85*cell_height;
                this.wall_image.borderColor = 0xFFFFFF
                this.wall_image.alpha = opac
            }
            walls.addChild(this.wall_image);
        }
	}
    getWall() {
        return this.exists || this.setDoor
    }
}

export function get_nbr(position, width, height){
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
    // print_bool_maze(walls,width,height)
    // this is a later addition to the maze to give it some character and more branching paths
    let prob_cond = 0.5
    for (let k = 0; k < walls.length; k++) {
        if (walls[k] || k % (2*width) == 2*width - 1 || k % (2*width) == -1 || (k % 2 == 0 && k >= walls.length - 2*width)) 
            continue
        if (Math.random() > prob_cond)
        {
            walls[k] = true
            continue;
        }
    }
    for (let k = 0; k < walls.length; k++) {
        if (!walls[k] || k % (2*width) == 2*width - 1 || k % (2*width) == -1 || (k % 2 == 0 && k >= walls.length - 2*width)) 
            continue
        if (Math.random() > prob_cond)
        {
            walls[k] = false
            continue;
        }
    }
    

    return walls
}

export function print_walls(walls, width, height) {
    // console.log(walls)
    let strval=""
    for (let k = 0; k < height; k++) {
        for (let l = 0; l < 2*width; l++) {
            let charval = " "
            if (l % 2 == 0 && walls[l+k*2*width].getWall())
                charval = "_"
            if (l % 2 == 1 && walls[l+k*2*width].getWall())
                charval = "|"
            strval = strval + charval
        }
        strval = strval + "\n"
    }
    console.log(strval)
}

export function print_bool_maze(walls, width, height) {
    // console.log(walls)
    let strval=""
    for (let k = 0; k < height; k++) {
        for (let l = 0; l < 2*width; l++) {
            let charval = " "
            if (l % 2 == 0 && walls[l+k*2*width])
                charval = "_"
            if (l % 2 == 1 && walls[l+k*2*width])
                charval = "|"
            strval = strval + charval
        }
        strval = strval + "\n"
    }
    console.log(strval)
}

export function maze_init2(xrectnum, yrectnum) {
    const walls = maze_creator(xrectnum, yrectnum);
    let wall_tiles = Array(walls.length)
    // print_walls(walls,xrectnum,yrectnum)
    // print_map(map, xrectnum, yrectnum)
    for (let index = 0; index < walls.length; index++) {
        let ind_x = Math.floor((index % (2*xrectnum)) / 2);
        let ind_y = Math.floor(index / (2*xrectnum))
        wall_tiles[index] = new TileWall(ind_x,ind_y,walls[index],index %2)
    }
    return wall_tiles
}
