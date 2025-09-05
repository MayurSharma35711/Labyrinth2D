import { map_init } from "./mapgen.mjs";
import { maze_init2 } from "./mazegen.mjs";
import { chest_gen } from "../items/equipment.mjs";
import { maze_check } from "./rooms.mjs";
import { multiRooms } from "./rooms.mjs";
import { full_dungeon } from "./dungeon.mjs";
import { precise_rooms } from "./rooms.mjs";
import { monster_indices, size, sect_size } from "../vis_updated.mjs";
import { spawn_mon } from "../game_entities/others.mjs";
import { Monster } from "../game_entities/monster.mjs";
import { MonsterSpawner } from "../game_entities/others.mjs";
// xrectnum = 20;
// yrectnum = 20;

// room generation needs to start being less automated and more input driven!! 


export function init_maze_level(xrectnum, yrectnum, biomes, roominfos) {
//    console.log("Here"+xrectnum);
        // let biomes = [1,1,0,0]
        // console.log("biomes", biomes)
        let game_map = map_init(xrectnum, yrectnum, biomes);
        let game_maze = maze_init2(xrectnum, yrectnum);
        // roominfo gives [xstart, ystart, xlen, ylen, room_biome, doors]
        // let roominfos = [[15, 15, 5, 5, 10, [[17, 15], [15, 17]]], [5, 5, 5, 5, 9, [[5,8], [10, 7]]]]
        
        let output = precise_rooms(xrectnum, yrectnum, roominfos, game_maze, game_map);
        game_maze = output[0]
        // print_walls(game_maze, xrectnum, yrectnum)
        game_map = output[1]
        let rooms = output[2]
        // console.log(rooms);
        // print_walls(game_maze, xrectnum, yrectnum);
    
    
        let output2 = maze_check(game_maze, xrectnum, yrectnum, roominfos, game_map);
        game_maze = output2[1]
        let regions = output2[0] 
        // console.log(regions)
        let chests = chest_gen(40, game_maze, xrectnum, yrectnum);

        
   
       return [game_map, game_maze, rooms, chests]
}

export function init_dungeon_level(xrectnum, yrectnum, dtype, biome){
    // dungeon testing
    // console.log("Here"+xrectnum);
    let output = full_dungeon(xrectnum, yrectnum, dtype, biome)
    return [output[0], output[1], [], []]
}


// monster_info gives 0: tier; 1: brain type, 2: biomes to avoid
// monster_spawn_info gives 0: tier; 1: label; 2: type; 3: freq; 4: biomes to avoid
export function create_level_monsters(xrectnum, yrectnum, game_map, monster_info, spawn_info) {
    let maze_monsters = new Array(monster_info.length)
    for(let i = 0; i < monster_info.length;i++)
    {
        // console.log((i % 5) + 1)
        let x = Math.floor(Math.random() * xrectnum)
        let y = Math.floor(Math.random() * yrectnum)
        let ind = x + xrectnum * y
        let overlap = false
        while((x < 4 && y < 4) || overlap || monster_info[i][2].includes(game_map[ind].getBiome())) {
            x = Math.floor(Math.random() * xrectnum)
            y = Math.floor(Math.random() * yrectnum)
            ind = x + xrectnum * y

            overlap = false
            for (let j = 0; j < i; j++) {
                if (x == maze_monsters[j].x && y == maze_monsters[j].y) {
                    overlap = true
                    break
                }
            }
        }
        
        // x = Math.floor(Math.random() * xrectnum)
        // y = Math.floor(Math.random() * yrectnum)
        maze_monsters[i] = new Monster(monster_info[i][0], size.item, size.item, xrectnum, yrectnum, monster_info[i][1], game_map, sect_size, x, y);
        
    }
    let monster_indices = new Array(maze_monsters.length)
    for(let i = 0;i < maze_monsters.length;i++)
    {
        monster_indices[i] = maze_monsters[i].y * xrectnum + maze_monsters[i].x;
    }



    let monsters_spawns = new Array(spawn_info.length)
    for(let i = 0; i < spawn_info.length;i++)
    {
        // console.log((i % 5) + 1)
        let x = Math.floor(Math.random() * xrectnum)
        let y = Math.floor(Math.random() * yrectnum)
        let ind = x + xrectnum * y
        let overlap = false
        while((x < 4 && y < 4) || overlap || spawn_info[i][4].includes(game_map[ind].getBiome())) {
            x = Math.floor(Math.random() * xrectnum)
            y = Math.floor(Math.random() * yrectnum)
            ind = x + xrectnum * y

            overlap = false
            for (let j = 0; j < i; j++) {
                if (x == monsters_spawns[j].x && y == monsters_spawns[j].y) {
                    overlap = true
                    break
                }
            }
        }
        
        // x = Math.floor(Math.random() * xrectnum)
        // y = Math.floor(Math.random() * yrectnum)
        // constructor(tier, x, y, sizex, sizey, num_x, num_y, map, label, type, freq)
        monsters_spawns[i] = new MonsterSpawner(spawn_info[i][0], x, y, size.item, size.item, xrectnum, yrectnum, game_map, spawn_info[i][1], spawn_info[i][2], spawn_info[i][3]);
        
    }
    let spawn_indices = new Array(monsters_spawns.length)
    for(let i = 0;i < monsters_spawns.length;i++)
    {
        spawn_indices[i] = monsters_spawns[i].y * xrectnum + monsters_spawns[i].x;
    }
    return [maze_monsters, monster_indices, monsters_spawns, spawn_indices]
}