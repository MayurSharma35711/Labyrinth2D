import { maze_creator } from "../bkgnd_objs/mazegen.mjs";
import { Priority_Queue } from "./datatypes.mjs";
import { Dictionary } from "./datatypes.mjs";

// -------------------------- Classes Used ------------------------------------------

// -------------------------- Heuristics ------------------------------------------

// these heuristics are given relative to the actual cost of the path
function heur_linfty(xinit, yinit, xfin, yfin){
    return Math.max(Math.abs(xinit - xfin), Math.abs(yinit - yfin))
}
function heur_l1(xinit, yinit, xfin, yfin){
    return Math.abs(xinit - xfin) + Math.abs(yinit - yfin)
}
function heur_l2sqr(xinit, yinit, xfin, yfin){
    return (xinit - xfin)*(xinit - xfin) + (yinit - yfin)*(yinit - yfin)
}
function heur_l2(xinit, yinit, xfin, yfin){
    return Math.sqrt((xinit - xfin)*(xinit - xfin) + (yinit - yfin)*(yinit - yfin))
}
function heur_xy_2(xinit, yinit, xfin, yfin){
    return Math.abs(xinit - xfin) * Math.abs(yinit - yfin) / 2
}
function heur_norm_mods(xinit, yinit, xfin, yfin){
    let val = Math.sqrt((xinit - xfin)*(xinit - xfin) + (yinit - yfin)*(yinit - yfin))
    return val * (Math.abs(xinit - xfin) + Math.abs(yinit - yfin))
}
function heur_xy_4(xinit, yinit, xfin, yfin){
    let val = Math.abs(xinit - xfin) + Math.abs(yinit - yfin)
    return val + Math.abs(xinit - xfin) * Math.abs(yinit - yfin) / 4
}
function heur_xy_9(xinit, yinit, xfin, yfin){
    let val = Math.abs(xinit - xfin) + Math.abs(yinit - yfin)
    return val + Math.abs(xinit - xfin) * Math.abs(yinit - yfin) / 9
}
function heur_garbo(xinit, yinit, xfin, yfin){
    let val = 1/Math.abs(xinit - xfin + 0.1) + 1/Math.abs(yinit - yfin + 0.1)
    return val
}
function dijkstra(xinit, yinit, xfin, yfin) {
    return 0
}

// -------------------------- A* Algorithm ------------------------------------------

// implementation of A* algorithm (went through wikipedia guide)
function remake_path(prior_list, curr_node){
    let full_path = []
    let counter = 0
    for (let k = 0; k < prior_list.length; k++){
        if (prior_list[k] != -1) 
            counter = counter + 1
    }
    // console.log("num points checked:", counter)
    while (curr_node != -1) {
        full_path.push(curr_node)
        curr_node = prior_list[curr_node]
    }
    return full_path
}

function Astar_maze(maze, numx, numy, x0, y0, xfin, yfin, heur) {
    let open_points = new Priority_Queue()
    let visited_nodes = Array(maze.length/2).fill(-1)
    let best_scores = Array(maze.length/2).fill(-1)
    best_scores[x0 + y0*numx] = 0

    let guess_scores = Array(maze.length).fill(-1)
    guess_scores[x0 + y0*numx] = heur(x0, y0, xfin, yfin)

    open_points.insert([x0 + y0*numx, guess_scores[x0 + y0*numx]])

    while (!open_points.isEmpty()) {
        // console.log(best_scores)
        let current = open_points.get_elt()[0]
        // console.log(current)
        let x_comp = current % numx
        let y_comp = Math.floor(current / numx)

        if (x_comp == xfin && y_comp == yfin) 
            return remake_path(visited_nodes, current)
        
        let nbrs = []
        // console.log(current)
        if (maze[2*current].getWall() == false && y_comp < numy - 1){
            nbrs.push(current + numx)
        }
        if (maze[2*current+1].getWall() == false && x_comp < numx - 1)
            nbrs.push(current + 1)
        if (x_comp > 0 && maze[2*current-1].getWall() == false)
            nbrs.push(current - 1)
        if (y_comp > 0 && maze[2*current-2*numx].getWall() == false)
            nbrs.push(current - numx)
        // console.log(nbrs)
        // console.log(best_scores)
        for (let i = 0; i < nbrs.length; i++) {
            let tent_score = best_scores[current] + 1
            let nbr_x = nbrs[i] % numx
            let nbr_y = Math.floor(nbrs[i] / numx)
            if (best_scores[nbrs[i]] == -1 || best_scores[nbrs[i]] > tent_score) {
                visited_nodes[nbrs[i]] = current
                best_scores[nbrs[i]] = tent_score
                guess_scores[nbrs[i]] = tent_score + heur(nbr_x, nbr_y, xfin, yfin)
                if (!open_points.contains_elt(nbrs[i]))
                    open_points.insert([nbrs[i], guess_scores[nbrs[i]]])
            }
        }
    }
    console.log("failed")
    return false
}

// ---------------- Loading Pathfinding for Maze Initially -------------------------

function get_sector_indices(numx, numy, sector_size, secx, secy){
    let sector_inds = []
    const base_ind = (secx * sector_size + secy * sector_size * numx)
    for(let i = 0; i < sector_size; i++) {
        let yind = i * numx
        if (base_ind + yind)
            break
        for(let j = 0; j < sector_size; j++) {
            let xind = j
            if (xind != 0 && (base_ind + xind) % numx == 0)
                break
            sector_inds.push(base_ind + yind + xind)
        }
    }
    return sector_inds
}

// function 

// const xrows = Math.ceil(numx / sector_size)
// const yrows = Math.ceil(numy / sector_size)

// const sidelen = 20
// const maze = maze_creator(sidelen,sidelen)
// print_bool_maze(maze, sidelen, sidelen)
// console.log("dijkstra")
// console.log(Astar(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, dijkstra))
// console.log("l1 norm")
// console.log(Astar(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_l1))
// // console.log("l2 norm")
// // console.log(Astar(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_l2))
// console.log("garbo")
// console.log(Astar(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_garbo))
// console.log("l2 squared")
// console.log(Astar(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_l2sqr))
// console.log("xy/2")
// console.log(Astar(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_xy_2))
// console.log("x+y + xy/4")
// console.log(Astar(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_xy_4))
// console.log("x+y + xy/9")
// console.log(Astar(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_xy_9))
// console.log("l2 * l1")
// console.log(Astar(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_norm_mods))