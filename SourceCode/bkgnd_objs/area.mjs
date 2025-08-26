import { game_map, game_maze, play_inds, players, xrectnum, yrectnum, cutoff_y, tot_height, curr_player, monsters, ptr, size, currx, curry, chest_indices, chests, monster_indices, monster_spawn_indices, monster_spawns, app, current_area } from "../vis_updated.mjs";
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
    constructor(id, x_size, y_size, typer, is_start_level){
        this.id = id
        this.size_x = x_size;
        this.size_y = y_size;
        this.type = typer;
        this.is_start_level = is_start_level
        console.log(id, x_size, y_size, typer)
        // this.doors = doors
        if (this.type == "d") {
            this.full_setup = init_dungeon_level(this.size_x, this.size_y)
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

    constructor(loc1, loc2, spot1, spot2, placement_spots1, placement_spots2){
        this.loc1 = loc1
        this.spot1 = spot1
        this.loc2 = loc2
        this.spot2 = spot2
        this.placement_spots1 = placement_spots1
        this.placement_spots2 = placement_spots2
    }
    useDoor(loc){
        if (loc.id == this.loc1.id){
            game_map.item = this.loc2.full_setup[0]
            game_maze.item = this.loc2.full_setup[1]
            for (let l = 0; l < players.length; l++) {
                players[l].x = this.placement_spots2[l] % this.loc2.size_x
                players[l].y = Math.floor(this.placement_spots2[l] / this.loc2.size_x)
                play_inds[l] = this.placement_spots2[l]
                players[l].blks_moved = 0
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
            }
            current_area.item = this.loc1
        }
        sight(game_map.item, game_maze.item, xrectnum, yrectnum, cutoff_y, tot_height, players, curr_player.item, monsters, ptr.item, size.item, currx.item, curry.item, chest_indices, chests, monster_indices, monster_spawns, monster_spawn_indices, current_area.item.is_start_level, app);
    }
    
}