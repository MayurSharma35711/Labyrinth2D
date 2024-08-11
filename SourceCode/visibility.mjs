let xrectnum = 20;
let yrectnum = 20;

// this is the function we would change for more varied visibility conditions
// tier indicates the visibility index
// tier 0 gets the 4 sides displayed
// tier 1 gets a 3x3 visibility square
// tier 2 gets a 5x5 visibility square without corners
// tier 3 gets a 7x7 visibility square with 3-triangles cut from corners
function get_view_sqr (center_x, center_y, numx, numy, tier) {
    // These give the shape of the visibility square
    let cutoff;
    if (tier == 0) 
        cutoff = 1
    else if (tier == 1)
        cutoff = 0
    else if (tier == 2)
        cutoff = 1
    else if (tier > 2)
        cutoff = tier - 1
    const off_cen_size = Math.max(1, tier)

    // We now use this to give our side indices
    let map_indices = []
    for (let y_off = -off_cen_size; y_off < off_cen_size + 1; y_off++) {
        for (let x_off = -off_cen_size; x_off < off_cen_size + 1; x_off++) {
            // remove corners
            // console.log(y_off, x_off)
            if ((Math.abs(y_off) + cutoff > off_cen_size) && (Math.abs(x_off) + cutoff > 2*off_cen_size - Math.abs(y_off))){
                // console.log("here")
                continue
            }
            // remove indices outside
            if (center_x + x_off < 0 || center_x + x_off > numx - 1)
                continue
            if (center_y + y_off < 0 || center_y + y_off > numy - 1)
                continue
            map_indices.push((center_x+x_off) + numx*(center_y+y_off))
        }
    }   
    return map_indices
}

// gets the indices for all the players
// compares to see if they intersect with the captain
// returns all the ones that do, to give all map-tiles of interest
export function total_visible_indices (players, numx, numy) {
    // give in captain player first
    let players_indices = []
    for (let k = 0; k < players.length; k++){
        players_indices.push(Set(get_view_sqr(players[k].x,players[k].y,numx,numy,players[k].vis_tier)))
    }
    let keep_indices = []
    keep_indices = Array.from(players_indices[0])
    for (let k = 1; k < players.length; k++){
        if ((players_indices[0].intersection(players_indices[k])).size > 0)
            keep_indices.concat(Array.from(players_indices[k]))
    }
    return keep_indices
}






// let game_map = map_init(xrectnum,yrectnum);
// let game_maze = maze_init2(xrectnum, yrectnum);

// let a = new Player(sizer, sizer);


