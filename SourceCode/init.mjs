import { map_init } from "./bkgnd_objs/mapgen.mjs";
import { maze_init2 } from "./bkgnd_objs/mazegen.mjs";
import { chest_gen } from "./game_entities/equipment.mjs";
import { maze_check } from "./bkgnd_objs/rooms.mjs";
import { multiRooms } from "./bkgnd_objs/rooms.mjs";
import { full_dungeon } from "./bkgnd_objs/dungeon.mjs";
// xrectnum = 20;
// yrectnum = 20;


export function init_bkgnd(xrectnum, yrectnum) {
    console.log("Here"+xrectnum);
    let game_map = map_init(xrectnum, yrectnum,[1,1,0,0]);
    let game_maze = maze_init2(xrectnum, yrectnum);
    let output = multiRooms(xrectnum, yrectnum, 5, 8, game_maze, game_map, 2);
    game_maze = output[0]
    // print_walls(game_maze, xrectnum, yrectnum)
    game_map = output[1]
    let rooms = output[2]
    // console.log(rooms);
    // print_walls(game_maze, xrectnum, yrectnum);
    let output2 = maze_check(game_maze, xrectnum, yrectnum);
    game_maze = output2[1]
    let regions = output2[0] 
    // console.log(regions)
    let chests = chest_gen(40, game_maze, xrectnum, yrectnum);
    return [game_map, game_maze, rooms, chests]

    // dungeon testing
    // console.log("Here"+xrectnum);
    // let output = full_dungeon(xrectnum, yrectnum, 2)
    // return [output[0], output[1], [], []]
}