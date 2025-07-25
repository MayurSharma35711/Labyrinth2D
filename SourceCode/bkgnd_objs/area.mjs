

class Area{
    id; 
    type;
    size_x;
    size_y;
    doors;
    constructor(id, x_size, y_size, typer, doors){
        this.size_x = x_size;
        this.size_y = y_size;
        this.type = typer;
        this.doors = doors
    }
    init_bkgnd(){
    // if typer is dungeon => do to dungeon creator
    // if typer is maze => do to maze creator
    // if typer is village / hall => do to village / hall creator
    }
    
}

class Door{
    loc1;
    spot1;

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