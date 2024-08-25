import { Priority_Queue } from "./datatypes.mjs"
import { Dictionary } from "./datatypes.mjs"
import { Astar_maze } from "./path_finding.mjs"
import { heur_l2sqr, dijkstra } from "./path_finding.mjs"

function get_sector_indices(numx, numy, sector_size, secx, secy){
    let sector_inds = []
    const base_ind = (secx * sector_size + secy * sector_size * numx)
    for(let i = 0; i < sector_size; i++) {
        let yind = i * numx
        // console.log((base_ind + yind), numy*numx)
        if ((base_ind + yind) >= numy * numx)
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


export function make_maze_dicts(maze, numx, numy, sector_size) {
    // print_walls(maze, numx, numy)
    let xsectors = Math.ceil(numx / sector_size)
    let ysectors = Math.ceil(numy / sector_size)

    let path_dict = new Dictionary() 
    let sector_dict = new Dictionary()
    // key indexing is as follows [[x0,y0],[x1,y1]] for the path_dict
    // for the sector dict it is just [x,y] 

    for (let i = 0; i < xsectors; i++) {
        for (let j = 0; j < ysectors; j++) {
            // console.log("--------------")
            let sector = get_sector_indices(numx, numy, sector_size, i, j)
            // console.log("sector:", i,j, sector)
            let centerind = sector[~~(sector.length / 2)]
            let x0 = centerind % numx
            let y0 = ~~(centerind / numx)
            
            sector_dict.add( [i,j], [centerind, sector] )

            let inds2get = []
 
            if (i + 1 < xsectors)
                inds2get.push([i + 1, j])   
            if (j + 1 < ysectors)
                inds2get.push([i, j + 1])
            if (j + 1 < ysectors && i + 1 < xsectors) 
                inds2get.push([i + 1, j + 1])
            if (j + 1 < ysectors && i > 0)
                inds2get.push([i - 1, j + 1])

            for(let k = 0; k < inds2get.length; k++){
                let sector_new = get_sector_indices(numx, numy, sector_size, inds2get[k][0], inds2get[k][1])
                let new_center = sector_new[~~(sector_new.length / 2)]
                let x1 = new_center % numx
                let y1 = ~~(new_center / numx)
                // let path = Astar_maze(maze, numx, numy, x0, y0, x1, y1, dijkstra)
                let path = Astar_maze(maze, numx, numy, x0, y0, x1, y1, heur_l2sqr)
                // console.log(path)
                path_dict.add( [[i,j],[inds2get[k][0], inds2get[k][1]]]  , path)
            }
        }
    }
    for (let i = 0; i < xsectors; i++) {
        for (let j = 0; j < ysectors; j++) {
            let moreInds2get = []
            if (i > 0)
                moreInds2get.push([i-1, j])
            if (j > 0)
                moreInds2get.push([i, j - 1])
            if (i > 0 && j > 0)
                moreInds2get.push([i-1,j-1])
            if (j > 0 && i + 1 < xsectors)
                moreInds2get.push([i+1,j-1])
            for(let k = 0; k < moreInds2get.length; k++) {
                // console.log([[moreInds2get[k][0],moreInds2get[k][1]],[i,j]])
                let rev_path = path_dict.getElt([ [moreInds2get[k][0],moreInds2get[k][1]], [i,j] ])
                let new_path = rev_path.slice().reverse()
                path_dict.add([[moreInds2get[k][0],moreInds2get[k][1]],[i-1,j]], new_path )
            }
        }
    }
    

    return [sector_dict, path_dict]
}


// function Astar_nodes(maze, numx, numy, x0, y0, xfin, yfin, heur) {
//     // print_walls(maze, numx, numy)
//     let open_points = new Priority_Queue()
//     let visited_nodes = Array(maze.length/2).fill(-1)
//     let best_scores = Array(maze.length/2).fill(-1)
//     best_scores[x0 + y0*numx] = 0

//     let guess_scores = Array(maze.length).fill(-1)
//     guess_scores[x0 + y0*numx] = heur(x0, y0, xfin, yfin)

//     open_points.insert(x0 + y0*numx, guess_scores[x0 + y0*numx])

//     while (!open_points.isEmpty()) {
//         // console.log(best_scores)
//         let current = open_points.get_elt()
//         // console.log(current)
//         let x_comp = current % numx
//         let y_comp = Math.floor(current / numx)

//         if (x_comp == xfin && y_comp == yfin) {
//             let path = remake_path(visited_nodes, current)
//             return path.reverse()
//         }
        
//         let nbrs = []
//         // console.log(current)

//         // if (maze[2*current] == false && y_comp < numy - 1){
//         //     nbrs.push(current + numx)
//         // }
//         // if (maze[2*current+1] == false && x_comp < numx - 1)
//         //     nbrs.push(current + 1)
//         // if (x_comp > 0 && maze[2*current-1] == false)
//         //     nbrs.push(current - 1)
//         // if (y_comp > 0 && maze[2*current-2*numx] == false)
//         //     nbrs.push(current - numx)
//         // console.log(current)
//         if (y_comp < numy - 1 && maze[2*current].getWall() == false){
//             nbrs.push(current + numx)
//         }
//         if (x_comp < numx - 1 && maze[2*current+1].getWall() == false)
//             nbrs.push(current + 1)
//         if (x_comp > 0 && maze[2*current-1].getWall() == false)
//             nbrs.push(current - 1)
//         if (y_comp > 0 && maze[2*current-2*numx].getWall() == false)
//             nbrs.push(current - numx)

//         // console.log(nbrs)
//         // console.log(x0, y0, xfin, yfin, best_scores)
//         for (let i = 0; i < nbrs.length; i++) {
//             let tent_score = best_scores[current] + 1
//             let nbr_x = nbrs[i] % numx
//             let nbr_y = Math.floor(nbrs[i] / numx)
//             if (best_scores[nbrs[i]] == -1 || tent_score < best_scores[nbrs[i]]) {
//                 visited_nodes[nbrs[i]] = current
//                 best_scores[nbrs[i]] = tent_score
//                 guess_scores[nbrs[i]] = tent_score + heur(nbr_x, nbr_y, xfin, yfin)
//                 if (!open_points.contains_elt(nbrs[i]))
//                     open_points.insert(nbrs[i], guess_scores[nbrs[i]])
//             }
//         }
//         // for(let k = 0; k < open_points.elts.length; k++)
//         //     console.log(open_points.elts[k])
//     }
//     console.log("failed")
//     return false
// }


