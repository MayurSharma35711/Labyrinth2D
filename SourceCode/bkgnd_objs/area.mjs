import { init_maze_level } from "./init_level.mjs";
import { init_dungeon_level } from "./init_level.mjs";

class Area{
    id; 
    type;
    size_x;
    size_y;
    doors;
    full_setup;
    constructor(id, x_size, y_size, typer, doors){
        this.id = id
        this.size_x = x_size;
        this.size_y = y_size;
        this.type = typer;
        this.doors = doors
        if (this.typer == "d") {
            this.full_setup = init_dungeon_level(this.size_x, this.size_y)
        }
        if (this.typer == "m") {
            this.full_setup = init_maze_level(this.size_x, this.size_y)
        }
    }
}

class Level_Door{
    loc1; // this is an area
    spot1; // this is an [x,y] array

    loc2;
    spot2;

    constructor(loc1, loc2, spot1, spot2){
        this.loc1 = loc1
        this.loc2 = loc2
        this.spot1 = spot1
        this.spot2 = spot2
    }
    useDoor(loc){
        if (loc.id == this.loc1.id){
            // go to loc2
        }
        else {
            // go to loc1
        }
    }
    
}