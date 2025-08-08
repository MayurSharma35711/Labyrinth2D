import { Tile } from "./mapgen.mjs";
import { TileWall } from "./mazegen.mjs";
// Object.defineProperty(Array.prototype, 'flatten', {
//     value: function(depth = 1) {
//       return this.reduce(function (flat, toFlatten) {
//         return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
//       }, []);
//     }
// });

class D_Room{
    size_x;
    size_y;
    start_x;
    start_y;
    constructor(x_init, y_init, x_len, y_len){
        this.size_x = x_len
        this.size_y = y_len
        this.start_x = x_init
        this.start_y = y_init
    }
}

function rev_dung(output){
    const rooms = output[0]
    const corridors = output[1]

    let new_rooms = []
    let new_corrs = []

    for (let l = 0; l < rooms.length; l++) {
        let cur_room = rooms[l]
        // console.log(cur_room)
        let rev_room = new D_Room(cur_room.start_y, cur_room.start_x, cur_room.size_y, cur_room.size_x)
        new_rooms.push(rev_room)
    }
    for (let l = 0; l < corridors.length; l++) {
        let cur_corr = corridors[l]
        let rev_corr = []
        for (let k = 0; k < cur_corr.length; k++) {
            rev_corr.push([cur_corr[k][1], cur_corr[k][0]])
        }
        new_corrs.push(rev_corr)
    }
    return [new_rooms, new_corrs]
}

function dung_type_1(){
    let room1 = new D_Room(0, 0, 5, 4)
    let room2 = new D_Room(8, 2, 3, 6,)
    let room3 = new D_Room(15, 3, 2, 4)
    let room4 = new D_Room(12, 9, 6, 2)
    let room5 = new D_Room(2, 16, 3, 3)
    let room6 = new D_Room(11, 13, 9, 6)
    let room7 = new D_Room(17, 5, 2, 6)
    let room8 = new D_Room(1, 6, 5, 8)

    let corridors = []
    corridors.push([[5,1],[6, 1], [8, 1], [7, 1]])
    corridors.push([[11,3],[12, 3], [13, 3], [14, 3]])
    corridors.push([[11,6],[12, 6], [13, 6], [14, 6]])
    corridors.push([[15,12],[14, 12], [15, 11], [14, 11]])
    corridors.push([[6, 6], [7, 6]])
    corridors.push([[6, 11], [6, 12], [7, 11], [7,12],[8, 11], [8,12], [7, 13], [7, 14], [8, 13], [8,14]])
    corridors.push([[7, 15], [7, 16], [8, 15], [8,16]])
    corridors.push([[5, 17], [6, 17], [7, 17], [8,17], [9,17],[10,17]])

    return [[room1, room2, room3, room4, room5, room6, room7, room8], corridors]
}

function rev_dung_type_1(){
    const output = dung_type_1()
    const better_out = rev_dung(output)
    return better_out
}


function dung_type_2(){
    let room1 = new D_Room(0, 0, 5, 5)
    let room2 = new D_Room(0, 7, 4, 4)
    let room3 = new D_Room(7, 0, 4, 4)
    let room4 = new D_Room(13, 0, 4, 4)
    let room5 = new D_Room(0, 13, 4, 4)
    let room6 = new D_Room(7, 7, 4, 4)
    let room7 = new D_Room(13, 13, 6, 6)
    let corridors = []
    corridors.push([[5, 1], [6,1], [5, 2], [6, 2]])
    corridors.push([[1, 5], [1,6], [2, 5], [2, 6]])
    corridors.push([[4,8],[5, 8], [6,8], [4,9], [5, 9], [6, 9]])
    corridors.push([[8,4],[8, 5], [8,6], [9,4], [9, 5], [9, 6]])
    corridors.push([[12, 1], [11,1], [12, 2], [11, 2]])
    corridors.push([[1, 12], [1,11], [2, 12], [2, 11]])

    corridors.push([[15, 12], [15,11], [16, 12], [16, 11], [15, 10], [15,9], [16, 10], [16, 9]])
    corridors.push([[15, 8], [15,7], [16, 8], [16, 7], [15, 6], [15,5], [16, 6], [16, 5], [15,4], [16,4]])
    corridors.push([[12, 15], [11,15], [12, 16], [11, 16], [10, 15], [9,15], [10, 16], [9, 16]])
    corridors.push([[8, 15], [7,15], [8, 16], [7, 16], [6, 15], [5,15], [6, 16], [5, 16], [4,15], [4,16]])
    // corridors.push([[12, 1], [11,1], [12, 2], [11, 2]])


    return [[room1, room2, room3, room4, room5, room6, room7], corridors]
}

// put walls around the border of the entire dungeon

export function full_dungeon(sizex, sizey, typer) {
    // let full_starting_tree = cut_up(sizex, sizey, iterations)
    // console.log(full_starting_tree)


    // let output2 = make_rooms(full_starting_tree, iterations, sizex, sizey)
    // let corridors = place_corridors(dung_rooms, sub_tree_rooms, full_starting_tree, iterations)
    // console.log(output2)
    // let dung_rooms = output2[0]
    // let sub_tree_rooms = output2[1]
    // let extender = output2[2]


    // console.log(extender)
    // sizex = sizex + extender[0]
    // sizey = sizey + extender[1]

    let output = dung_type_2()
    let dung_rooms = output[0]
    let corridors = output[1]
    

    // console.log(sizex, sizey)
    let dung_map = new Array(sizex * sizey)
    let dung_walls = new Array(2 * sizex * sizey) 
    
    for (let x = 0; x < sizex; x++) {
        for (let y = 0; y < sizey; y++) {
            dung_map[y * sizex + x] = new Tile();
            dung_map[y * sizex + x].ind_x = x;
            dung_map[y * sizex + x].ind_y = y;
            dung_map[y * sizex + x].setBiome(-1);
        }
    }
    for (let l = 0; l < dung_rooms.length; l++) {
        let curr_room = dung_rooms[l]
        for (let x = curr_room.start_x; x < curr_room.start_x + curr_room.size_x; x++){
            for (let y = curr_room.start_y; y < curr_room.start_y + curr_room.size_y; y++){
                // console.log(dung_map[y * sizex + x])
                // console.log("--------")
                // console.log(x)
                // console.log(y)
                // console.log(curr_room)
                dung_map[y * sizex + x].setBiome(10);
            }
        }
    }
    for (let k = 0; k < corridors.length; k++) {
        let corr_now = corridors[k]
        // console.log(corr_now)
        for (let i = 0; i < corr_now.length; i++){
            let new_tile = corr_now[i]
            let new_x = new_tile[0]
            let new_y = new_tile[1]
            dung_map[new_y * sizex + new_x].setBiome(10);
        }
    }
    // even walls are the horizontal _ ones, odd are the vertical | walls
    // wall_tiles[index] = new TileWall(ind_x,ind_y,walls[index],index %2)
    // console.log(sizex)
    // console.log(sizey)
    // console.log(dung_walls.length)
    for (let index = 0; index < dung_walls.length; index++) {
        let ind_x = Math.floor((index % (2*sizex)) / 2);
        let ind_y = Math.floor(index / (2*sizex))
        let valer = false
        if (index % 2 == 0) {
            // console.log("-----")
            // console.log(index)
            // console.log(ind_y)
            // console.log(ind_x)
            // if (ind_y == 0) 
            //     valer = true
            // if (ind_y == sizey - 1)
            //     valer = true
            // else 
            if (ind_y < sizey - 1 && dung_map[(ind_y) * sizex + ind_x].getBiome() != dung_map[(ind_y + 1) * sizex + ind_x].getBiome())
                valer = true
        }
        if (index % 2 == 1) {
            // if (ind_x == 0) 
            //     valer = true
            // if (ind_x == sizex - 1)
            //     valer = true
            // else 
            if (ind_x < sizex - 1 && dung_map[ind_y * sizex + (ind_x)].getBiome() != dung_map[(ind_y) * sizex + (ind_x + 1)].getBiome())
                valer = true
        }
        
        dung_walls[index] = new TileWall(ind_x,ind_y, valer ,index %2)
    }

    // still need to do the walls for the dungeon here
    // dung_walls[0].isDoor()
    return [dung_map, dung_walls]
}