import { Priority_Queue } from "../datatypes.mjs"
import { Dictionary } from "../datatypes.mjs"
import { Astar_maze } from "./path_finding.mjs"
import { heur_l2sqr, dijkstra, heur_l1 } from "./path_finding.mjs"

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
                path_dict.add([[moreInds2get[k][0],moreInds2get[k][1]],[i,j]], new_path )
            }
        }
    }
    

    return [sector_dict, path_dict]
}

// function remake_nodes_path(prior_list, curr_node){
//     let full_path = []
//     let counter = 0
//     // for (let k = 0; k < prior_list.length; k++){
//     //     if (prior_list[k] != -1) 
//     //         counter = counter + 1
//     // }
//     // console.log("num points checked:", counter)
//     while (curr_node != -1) {
//         full_path.push(curr_node)
//         curr_node = prior_list.getElt(curr_node)
//     }
//     return full_path
// }

// export function Astar_nodes(nodes, numx, numy, x0, y0, xfin, yfin, sect_size) {
//     // print_walls(maze, numx, numy)
//     let open_points = new Priority_Queue()
//     // let visited_nodes = Array(maze.length/2).fill(-1)
//     // let best_scores = Array(maze.length/2).fill(-1)
//     let visited_nodes = new Dictionary()
//     let best_scores = new Dictionary()
//     let guess_scores = new Dictionary()
//     for (let i = 0; i < numx; i++) {
//         for (let j = 0; j < numy; j++) {
//             best_scores.add([i,j], -1)
//             visited_nodes.add([i,j], -1)
//             guess_scores.add([i,j], -1)
//         }
//     }
//     best_scores.assign([x0, y0], 0)
//     guess_scores.assign([x0, y0], sect_size*dijkstra(x0, y0, xfin, yfin))

//     // let guess_scores = Array(maze.length).fill(-1)

//     open_points.insert([x0, y0], guess_scores.getElt([x0, y0]), false)

//     while (!open_points.isEmpty()) {
//         // console.log("--------------------")
//         // console.log(visited_nodes.keys, visited_nodes.elts)
//         let str = ""
//         for(let k = 0; k < best_scores.elts.length; k++){
//             str = str + " (" + best_scores.keys[k] + "): " + best_scores.elts[k] + "|"
//         }
//         console.log("-------------------")
//         console.log("best: " + str)
//         let current = open_points.get_elt()
//         // console.log(current)
//         let x_comp = current[0]
//         let y_comp = current[1]

//         console.log(current)

//         if (x_comp == xfin && y_comp == yfin) {
//             let path = remake_nodes_path(visited_nodes, current)
//             return path.reverse()
//         }
        
//         let nbrs = []
//         if (x_comp > 0 && y_comp > 0) // top left
//             nbrs.push([x_comp - 1, y_comp - 1])
//         if (x_comp > 0) // left
//             nbrs.push([x_comp - 1, y_comp])
//         if (y_comp > 0) // top
//             nbrs.push([x_comp, y_comp - 1])
//         if (x_comp > 0 && y_comp + 1 < numy) // bottom left
//             nbrs.push([x_comp - 1, y_comp + 1])
//         if (y_comp + 1 < numy) // bottom
//             nbrs.push([x_comp, y_comp + 1])
//         if (x_comp + 1 < numx && y_comp + 1 < numy) // bottom right
//             nbrs.push([x_comp + 1, y_comp + 1])
//         if (x_comp + 1 < numx) // right
//             nbrs.push([x_comp + 1, y_comp])
//         if (x_comp + 1 < numx && y_comp > 0)
//             nbrs.push([x_comp + 1, y_comp - 1])
//         console.log(nbrs)

//         for (let i = 0; i < nbrs.length; i++) {
//             let tent_score = best_scores.getElt(current) + nodes.getElt([current, nbrs[i]]).length - 1
//             // the minus one is above to not include the first element
//             let nbr_x = nbrs[i][0]
//             let nbr_y = nbrs[i][1]
//             if (best_scores.getElt(nbrs[i]) == -1 || tent_score < best_scores.getElt(nbrs[i])) {
//                 console.log(nbrs[i], tent_score)
//                 visited_nodes.assign(nbrs[i], current)
//                 best_scores.assign(nbrs[i], tent_score)
//                 guess_scores.assign(nbrs[i], tent_score + sect_size*dijkstra(nbr_x, nbr_y, xfin, yfin))
//                 if (!open_points.contains_elt(nbrs[i]))
//                     open_points.insert(nbrs[i], guess_scores.getElt(nbrs[i]), false)
//             }
//         }
//         // for(let k = 0; k < open_points.elts.length; k++)
//         //     console.log(open_points.elts[k])
//     }
//     console.log("failed")
//     return false
// }

