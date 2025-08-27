import { print_walls } from "./mazegen.mjs";
import { Stack } from "../methods/datatypes.mjs";
import { get_nbr } from "./mazegen.mjs";

function room_gen(startx, starty, xnum, ynum, xsize, ysize, maze, map, new_biome)
{
    let start_point = starty * xnum + startx;
    for(let i = 0;i < ysize;i++)
    {
        if (start_point + i*xnum > map.length)
            break
        for(let k = 0;k < xsize ;k++)
        {
            if ((k + start_point) % xnum == 0)
                break
            maze[2 * start_point + 2 * (i * xnum + k)].exists = false;
            maze[2 * start_point + 2 * (i * xnum + k) + 1].exists = false;
            map[start_point + (i * xnum + k)].biome = new_biome
        }
    }
    for(let i = 0;i < xsize;i++)
    {
        maze[2 * (Math.max(starty * xnum - xnum, 0) + Math.min(i + startx, xnum - 1))].exists = true;
        maze[2 * (Math.min((starty + ysize - 1), ynum -1) * xnum + Math.min(i + startx,xnum - 1))].exists = true;
    }
    for(let i = 0;i < ysize;i++)
    {
        // this case needs to be improved
        // console.log(starty, startx)
        maze[2 * (Math.min(Math.min((starty + i), ynum - 1) * xnum + startx)) - 1].exists = true;
        maze[2 * (Math.min((starty + i), ynum - 1) * xnum + Math.min(startx + xsize - 1,xnum - 1)) + 1].exists = true;
    }
    
    return [maze, map];
}


// roominfo gives [xstart, ystart, xlen, ylen, room_biome, doors]
export function precise_rooms(xnum, ynum, room_infos, maze, map) {
    let out;
    for (let k = 0; k < room_infos.length; k++) {
        out = room_gen(room_infos[k][0], room_infos[k][1], xnum, ynum, room_infos[k][2], room_infos[k][3], maze, map, room_infos[k][4]);
        maze = out[0]
        map = out[1]
    }
    let door_inds = []
    for (let k = 0; k < room_infos.length; k++) {
        for (let l = 0; l < room_infos[k][5].length; l++) {
            let startx = room_infos[k][0]
            let starty = room_infos[k][1]
            let xsize = room_infos[k][2]
            let ysize = room_infos[k][3]
            room_infos[k][5][l][0] + room_infos[k][5][l][1] * xnum
            if (room_infos[k][5][l][0] == startx){
                door_inds.push(2 * (room_infos[k][5][l][0] + room_infos[k][5][l][1] * xnum) - 1)
                maze[2 * (room_infos[k][5][l][0] + room_infos[k][5][l][1] * xnum) - 3].exists = false
                maze[2 * (room_infos[k][5][l][0] + (room_infos[k][5][l][1] - 1) * xnum) - 3].exists = false
                maze[2 * (room_infos[k][5][l][0] + (room_infos[k][5][l][1] - 1) * xnum) - 2].exists = false
            }
            if (room_infos[k][5][l][0] == startx + xsize) {
                door_inds.push(2 * (room_infos[k][5][l][0] + room_infos[k][5][l][1] * xnum) - 1)
            }
            if (room_infos[k][5][l][1] == starty){
                door_inds.push(2 * (room_infos[k][5][l][0] + (room_infos[k][5][l][1] - 1) * xnum))
            }
            if (room_infos[k][5][l][1] == starty + ysize) {
                door_inds.push(2 * (room_infos[k][5][l][0] + (room_infos[k][5][l][1]) * xnum))
            }
            
        }
    }
    for (let l = 0; l < door_inds.length; l++) {
        // console.log(door_inds)
        maze[door_inds[l]].isDoor()
    }
    return [maze, map];
}


// this function needs to start producing less randomness and more human input 
export function multiRooms(xnum, ynum, minsize, maxsize, maze, map, room_num)
{
    let room_size1, room_size2, room_startx, room_starty;
    let room_dets = []
    const buffer_x = Math.floor(xnum / 10)
    const buffer_y = Math.floor(ynum / 10)
    let counter = -1
    for(let i = 0;i < room_num;i++)
    {
        counter = counter + 1
        if (counter > 100)
            break
        room_size1 = Math.floor(Math.random() * (maxsize - minsize) + minsize);
        room_size2 = Math.floor(Math.random() * (maxsize - minsize) + minsize);
        room_startx = Math.floor(Math.random() * (xnum - 2*buffer_x)+buffer_x);
        room_starty = Math.floor(Math.random() * (ynum - 2*buffer_y)+buffer_y);
        let room_biome;
        if (Math.random() > 0.7)
            room_biome = 10
        else
            room_biome = 9
        let x1 = room_startx
        let x2 = room_startx + room_size1
        let y1 = room_starty
        let y2 = room_starty + room_size2
        
        let k = 0;
        for (; k < room_dets.length; k++){
            let room = room_dets[k]
            if (x1 >= room[0] && x1 <= room[0] + room[2] && y1 >= room[1] && y1 <= room[1] + room[3]) {
                i = i - 1
                break
            }
            if (x2 >= room[0] && x2 <= room[0] + room[2] && y1 >= room[1] && y1 <= room[1] + room[3]) {
                i = i - 1
                break
            }
            if (x1 >= room[0] && x1 <= room[0] + room[2] && y2 >= room[1] && y2 <= room[1] + room[3]) {
                i = i - 1
                break
            }
            if (x2 >= room[0] && x2 <= room[0] + room[2] && y2 >= room[1] && y2 <= room[1] + room[3]) {
                i = i - 1
                break
            }
        }
        if (k < room_dets.length)
            continue
        room_dets.push([room_startx, room_starty, room_size1, room_size2, room_biome])
    }

    let out;
    for (let k = 0; k < room_num; k++) {
        if (room_dets[k] == undefined || room_dets[k].length == 0)
            continue
        out = room_gen(room_dets[k][0], room_dets[k][1], xnum, ynum, room_dets[k][2], room_dets[k][3], maze, map, room_dets[k][4]);
        maze = out[0]
        map = out[1]
    }
    return [maze, map, room_dets];
}

export function rand_inds(arr)
{
    let retArr = [];
    let newArr = [];
    for(let i = 0;i < arr.length;i++)
    {
        newArr.push(arr[i]);
    }
    let len = arr.length;
    let ind = 0;
    while(newArr.length != 0)
    {
        ind = Math.floor(Math.random() * newArr.length);
        retArr.push(newArr[ind]);
        newArr.splice(ind, 1);
    }
    // console.log(retArr);
    return retArr;
}

function delWall(map_ind1, map_ind2, maze, width, room_wall_inds)
{
    // console.log(map_ind1, map_ind2)
    switch(map_ind1 - map_ind2)
    {
    case 1:
        if (!room_wall_inds.includes(2 * map_ind1 - 1)){
            // console.log("1")
            maze[2 * map_ind1 - 1].exists = false;
        }
        break;
    case -1:
        if (!room_wall_inds.includes(2 * map_ind1 + 1)) {
            // console.log("-1")
            maze[2 * map_ind1 + 1].exists = false;
        }
        break;
    case width:
        if (!room_wall_inds.includes(2 * (map_ind1 - width))) {
            // console.log("100")
            maze[2 * (map_ind1 - width)].exists = false;
        }
        break;
    case -width:
        if (!room_wall_inds.includes(2 * map_ind1)) {
            // console.log("-100")
            maze[2 * map_ind1].exists = false;
        }
        break;
    }
}



export function maze_check(maze, width, height, room_infos, map){
    // print_walls(maze, width, height)
    const area = width*height;
    let regions = []
    let curr_cell_visited = Array(area);
    let cell_visited = [];
    for (let l = 0; l < 2*area; l++){
        // walls[l] = true;
        if (l % 2 == 0)
        {
            
            cell_visited[Math.floor(l/2)] = false
            curr_cell_visited[0] = false;
        }
    }

    let room_wall_inds = []
    // roominfo gives [xstart, ystart, xlen, ylen, room_biome, doors]
    for (let k = 0; k < room_infos.length; k++) {
        let startx = room_infos[k][0]
        let starty = room_infos[k][1]
        let xsize = room_infos[k][2]
        let ysize = room_infos[k][3]
        let ind1 
        let ind2
        for(let i = 0;i < xsize;i++)
        {
            ind1 = 2 * (Math.max(starty * width - width, 0) + Math.min(i + startx, width - 1))
            ind2 = 2 * (Math.min((starty + ysize - 1), height -1) * width + Math.min(i + startx,width - 1))
            room_wall_inds.push(ind1)
            room_wall_inds.push(ind2)
        }
        for(let i = 0;i < ysize;i++)
        { 
            ind1 = 2 * (Math.min(Math.min((starty + i), height - 1) * width + startx)) - 1
            ind2 = 2 * (Math.min((starty + i), height - 1) * width + Math.min(startx + xsize - 1,width - 1)) + 1
            room_wall_inds.push(ind1)
            room_wall_inds.push(ind2)
        }
    }
    
    // console.log(door_inds)
    // console.log(room_wall_inds.sort())



    let visited_cells = new Stack()
    visited_cells.push(0)
    let curr_cell;
    let nbrs;
    let visitors;

    
    while (cell_visited.includes(false)){
        // console.log(visited_cells)
        if(!visited_cells.isEmpty()) {
            curr_cell = visited_cells.pop();
        }
        else
        {
            regions.push([]);
            // console.log(cell_visited+"------------");
            let act_cell_vis = []
            for(let i = 0;i < cell_visited.length;i++)
            {
                if(cell_visited[i] && (map[i].getBiome() != 9 && map[i].getBiome() != 10)) {
                    act_cell_vis.push(i)
                }
            }
            let shuffle_inds = rand_inds(act_cell_vis)
            // console.log(shuffle_inds+"------------");
            let cell_val = 0;
            let nbr_vals
            let t
            let ind = 0;
            let out = false;

            // console.log("hiiii")
            // console.log(act_cell_vis.length)
            // console.log(cell_visited.filter(item => item == true).length)

            for(let k=0; k < shuffle_inds.length; k++) {
                out = false;
                cell_val = shuffle_inds[k];
                // ind = shuffle_inds[k];
                // if(!cell_val)
                //     continue
                nbr_vals = get_nbr(cell_val, width, height)
                // console.log(nbr_vals);
                for(t = 0; t < nbr_vals.length; t++) {
                    if(!act_cell_vis.includes(nbr_vals[t]))
                    {
                        out = true;
                        break
                    }
                }
                if(out)
                    break
            }
            for(let i = 0;i < cell_visited.length;i++)
            {
                if(curr_cell_visited[i] == true)
                {
                    regions[regions.length - 1].push(i);
                }
            }
            // console.log(cell_val,nbr_vals[t])
            delWall(cell_val, nbr_vals[t], maze, width, room_wall_inds);
            // if (cell_visited[curr_cell - 1] && curr_cell % width != 0) {
            //     maze[2*curr_cell - 1].exists = false
            // } else if(curr_cell/width >= 1){
            //     maze[2*curr_cell - 2*width].exists = false
            // }
            curr_cell = nbr_vals[t];
            curr_cell_visited.splice(0, curr_cell_visited.length);
        }
        
        cell_visited[curr_cell] = true;
        curr_cell_visited[curr_cell] = true;


        nbrs = get_nbr(curr_cell, width, height); 
        visitors = []
        for (let k = 0; k < nbrs.length; k++) { 
            if (cell_visited[nbrs[k]] == false)
            {
                switch(nbrs[k] - curr_cell)
                {
                case 1:
                    if(maze[2 * curr_cell + 1].getWall())
                        continue;
                    break;
                case -1:
                    if(maze[2 * curr_cell - 1].getWall())
                        continue;
                    break;
                case -width:
                    if(maze[2 * curr_cell - 2 * width].getWall())
                        continue;
                    break;
                case width:
                    if(maze[2 * curr_cell].getWall())
                        continue;
                    break;
                }
                visitors.push(nbrs[k])
            }
        }

        if (visitors.length > 0)
            visited_cells.push(curr_cell)
        // const randpos = visitors[Math.floor(Math.random() * visitors.length)];
        for(let t = 0; t < visitors.length; t++)
            visited_cells.push(visitors[t])
    }



    regions.push([]);
    for(let i = 0;i < curr_cell_visited.length;i++)
    {
        if(curr_cell_visited[i])
            regions[regions.length - 1].push(i);
    }
    // print_walls(maze, width, height)
    // console.log(cell_visited)
    return [regions, maze];
}
