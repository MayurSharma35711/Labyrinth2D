import { Priority_Queue } from "../datatypes.mjs";
import { maze_init2, print_walls } from "../../bkgnd_objs/mazegen.mjs";
import { maze_check } from "../../bkgnd_objs/rooms.mjs";


// -------------------------- Classes Used ------------------------------------------

// -------------------------- Heuristics ------------------------------------------

// these heuristics are given relative to the actual cost of the path
function heur_linfty(xinit, yinit, xfin, yfin){
    return Math.max(Math.abs(xinit - xfin), Math.abs(yinit - yfin))
}
export function heur_l1(xinit, yinit, xfin, yfin){
    return Math.abs(xinit - xfin) + Math.abs(yinit - yfin)
}
export function heur_l2sqr(xinit, yinit, xfin, yfin){
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

export function dijkstra(xinit, yinit, xfin, yfin) {
    return 0
}

// -------------------------- A* Algorithm ------------------------------------------

// implementation of A* algorithm (went through wikipedia guide)
function remake_path(prior_list, curr_node){
    let full_path = []
    let counter = 0
    // for (let k = 0; k < prior_list.length; k++){
    //     if (prior_list[k] != -1) 
    //         counter = counter + 1
    // }
    // console.log("num points checked:", counter)
    while (curr_node != -1) {
        full_path.push(curr_node)
        curr_node = prior_list[curr_node]
    }
    return full_path
}

export function Astar_maze(maze, numx, numy, x0, y0, xfin, yfin, heur) {
    // print_walls(maze, numx, numy)
    let open_points = new Priority_Queue()
    let visited_nodes = Array(maze.length/2).fill(-1)
    let best_scores = Array(maze.length/2).fill(-1)
    best_scores[x0 + y0*numx] = 0

    let guess_scores = Array(maze.length).fill(-1)
    guess_scores[x0 + y0*numx] = heur(x0, y0, xfin, yfin)

    open_points.insert(x0 + y0*numx, guess_scores[x0 + y0*numx])

    while (!open_points.isEmpty()) {
        // console.log(best_scores)
        let current = open_points.get_elt()
        // console.log(current)
        let x_comp = current % numx
        let y_comp = Math.floor(current / numx)

        if (x_comp == xfin && y_comp == yfin) {
            let path = remake_path(visited_nodes, current)
            return path.reverse()
        }
        
        let nbrs = []

        if (y_comp < numy - 1 && maze[2*current].getWall() == false){
            nbrs.push(current + numx)
        }
        if (x_comp < numx - 1 && maze[2*current+1].getWall() == false)
            nbrs.push(current + 1)
        if (x_comp > 0 && maze[2*current-1].getWall() == false)
            nbrs.push(current - 1)
        if (y_comp > 0 && maze[2*current-2*numx].getWall() == false)
            nbrs.push(current - numx)

        // console.log(nbrs)
        // console.log(x0, y0, xfin, yfin, best_scores)
        for (let i = 0; i < nbrs.length; i++) {
            let tent_score = best_scores[current] + 1
            let nbr_x = nbrs[i] % numx
            let nbr_y = Math.floor(nbrs[i] / numx)
            if (best_scores[nbrs[i]] == -1 || tent_score < best_scores[nbrs[i]]) {
                visited_nodes[nbrs[i]] = current
                best_scores[nbrs[i]] = tent_score
                guess_scores[nbrs[i]] = tent_score + heur(nbr_x, nbr_y, xfin, yfin)
                if (!open_points.contains_elt(nbrs[i]))
                    open_points.insert(nbrs[i], guess_scores[nbrs[i]])
            }
        }
        // for(let k = 0; k < open_points.elts.length; k++)
        //     console.log(open_points.elts[k])
    }
    console.log("failed")
    return false
}





// let sidelen = 40
// let maze = maze_init2(sidelen, sidelen)
// // print_walls(maze, sidelen, sidelen)
// let output = maze_check(maze, sidelen, sidelen)
// maze = output[1]
// print_walls(maze, sidelen, sidelen)

// console.log("dijkstra")
// console.log(Astar_maze(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, dijkstra).length)
// console.log("l1 norm")
// console.log(Astar_maze(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_l1).length)
// console.log("linfty norm")
// console.log(Astar_maze(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_linfty).length)
// console.log("l2 norm")
// console.log(Astar_maze(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_l2).length)
// console.log("garbo")
// console.log(Astar_maze(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_garbo).length)
// console.log("l2 squared")
// console.log(Astar_maze(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_l2sqr).length)
// console.log("xy/2")
// console.log(Astar_maze(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_xy_2).length)
// console.log("x+y + xy/4")
// console.log(Astar_maze(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_xy_4).length)
// console.log("x+y + xy/9")
// console.log(Astar_maze(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_xy_9).length)
// console.log("l2 * l1")
// console.log(Astar_maze(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, heur_norm_mods).length)
// console.log("best_heur")
// console.log(Astar_maze(maze, sidelen, sidelen, 0, 0, sidelen - 1, sidelen - 1, best_heur).length)