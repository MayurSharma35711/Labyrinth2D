import { game_map, game_maze, play_inds, players, xrectnum, yrectnum, cutoff_y, tot_height, curr_player, monsters, ptr, size, currx, curry, chest_indices, chests, monster_indices, monster_spawn_indices, monster_spawns, app, current_area, shiftx } from "../vis_updated.mjs";
import { init_maze_level } from "./init_level.mjs";
import { init_dungeon_level } from "./init_level.mjs";
import { sight } from "../methods/graphics/sight.mjs";

export class Area{
    id; 
    type;
    size_x;
    size_y;
    doors;
    full_setup;
    is_start_level;
    constructor(id, x_size, y_size, typer, is_start_level, biome, dtype = 0){
        this.id = id
        this.size_x = x_size;
        this.size_y = y_size;
        this.type = typer;
        this.is_start_level = is_start_level
        this.doors_used = [] 
        this.dtype = dtype
        console.log(id, x_size, y_size, typer)
        // this.doors = doors
        if (this.type == "d") {
            this.full_setup = init_dungeon_level(this.size_x, this.size_y, this.dtype, 10)
        }
        if (this.type == "h") {
            this.full_setup = init_dungeon_level(this.size_x, this.size_y, this.dtype, 9)
        }
        if (this.type == "m") {
            // console.log('got to maze set up')
            this.full_setup = init_maze_level(this.size_x, this.size_y)
            // console.log(this.full_setup)
        }
    }
    set_up_doors(doors){
        this.doors = doors
    }
}

export class Level_Door{
    loc1; // this is an area
    spot1; // this is an [x,y] array

    loc2;
    spot2;
    id;

    constructor(id, loc1, loc2, spot1, spot2, placement_spots1, placement_spots2){
        this.id = id
        this.loc1 = loc1
        this.spot1 = spot1
        this.loc2 = loc2
        this.spot2 = spot2
        this.placement_spots1 = placement_spots1
        this.placement_spots2 = placement_spots2
    }
    useDoor(loc){
        // shiftx.item = 0
        // shifty.item = 0
        if (loc.id == this.loc1.id){
            game_map.item = this.loc2.full_setup[0]
            game_maze.item = this.loc2.full_setup[1]
            for (let l = 0; l < players.length; l++) {
                players[l].x = this.placement_spots2[l] % this.loc2.size_x
                players[l].y = Math.floor(this.placement_spots2[l] / this.loc2.size_x)
                play_inds[l] = this.placement_spots2[l]
                players[l].blks_moved = 0
                if (this.loc2.type == "h" || this.loc2.type == "d") {
                    players[l].used_vis = players[l].vis_tier - 1
                }
                else {
                    players[l].used_vis = players[l].vis_tier
                }
                    
            }
            current_area.item = this.loc2
        }
        else {
            game_map.item = this.loc1.full_setup[0]
            game_maze.item = this.loc1.full_setup[1]
            for (let l = 0; l < players.length; l++) {
                players[l].x = this.placement_spots1[l] % this.loc1.size_x
                players[l].y = Math.floor(this.placement_spots1[l] / this.loc1.size_x)
                play_inds[l] = this.placement_spots1[l]
                players[l].blks_moved = 0
                if (this.loc1.type == "h" || this.loc1.type == "d") {
                    players[l].used_vis = players[l].vis_tier - 1
                }
                else {
                    players[l].used_vis = players[l].vis_tier
                }
            }
            current_area.item = this.loc1
        }

        console.log("first onen")
        for(let l = 0; l < this.loc1.doors_used.length; l++) {
            console.log(this.loc1.doors_used[l].id)
        }
        console.log("second onen")
        for(let l = 0; l < this.loc2.doors_used.length; l++) {
            console.log(this.loc2.doors_used[l].id)
        }

        let ind1 = 0
        for (let k = 0; k < this.loc1.doors_used.length; k++) {
            if(this.loc1.doors_used[k].id == this.id) {
                ind1 = k
                console.log("FOUND MATCH 1")
            }
        }
        if (ind1 != -1) 
            this.loc1.doors_used.splice(ind1)
        this.loc1.doors_used.push(this)

        let ind2 = 0
        for (let k = 0; k < this.loc2.doors_used.length; k++) {
            if(this.loc2.doors_used[k].id == this.id){
                ind2 = k
                console.log("FOUND MATCH 2")
            }
        }
        if (ind2 != -1) 
            this.loc2.doors_used.splice(ind2)
        this.loc2.doors_used.push(this)

        console.log("--------\nn\nn after \n\n -------- \n")
        console.log("first onen")
        for(let l = 0; l < this.loc1.doors_used.length; l++) {
            console.log(this.loc1.doors_used[l].id)
        }
        console.log("second onen")
        for(let l = 0; l < this.loc2.doors_used.length; l++) {
            console.log(this.loc2.doors_used[l].id)
        }
        sight(game_map.item, game_maze.item, xrectnum, yrectnum, cutoff_y, tot_height, players, curr_player.item, monsters, ptr.item, size.item, currx.item, curry.item, chest_indices, chests, monster_indices, monster_spawns, monster_spawn_indices, current_area.item.is_start_level, app);
    }
    
}