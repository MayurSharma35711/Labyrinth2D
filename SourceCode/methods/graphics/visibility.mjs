// this is the function we would change for more varied visibility conditions
// tier indicates the visibility index
// tier 0 gets the 4 sides displayed
// tier 1 gets a 3x3 visibility square
// tier 2 gets a 5x5 visibility square without corners
// tier 3 gets a 7x7 visibility square with 3-triangles cut from corners

// can us get view square for AOE damage
export function get_view_sqr (center_x, center_y, numx, numy, tier) {
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

function blocked(pt1, pt2, xrectnum, game_maze) // pt1 is curr pos, pt2 is questioned pos
{
    if(Math.abs(pt1 - pt2) % xrectnum != 0 && ~~((pt1) / xrectnum) != ~~(pt2 / xrectnum))
        return false;
    let dir;
    if((pt1 - pt2) % xrectnum == 0 && pt1 - pt2 > 0)
        dir = 0; // dir is up
    else if((pt1 - pt2) % xrectnum == 0 && pt1 - pt2 < 0)
        dir = 1; // dir is down
    else if(pt1 - pt2 < 0 && ~~((pt1) / xrectnum) == ~~(pt2 / xrectnum))
        dir = 2; // dir is right
    else if(pt1 - pt2 > 0 && ~~((pt1) / xrectnum) == ~~(pt2 / xrectnum))
        dir = 3; // dir is left
    let pos;
    switch(dir)
    {
    case 0:
        pos = pt1 - xrectnum;
        while(pos != pt2)
        {
            if(game_maze[2 * pos].exists)
                return false;
            pos -= xrectnum
        }
        if(game_maze[2 * pt2].exists)
            return false;
        break;
    case 1:
        pos = pt1;
        while(pos != pt2)
        {
            if(game_maze[2 * pos].exists)
                return false;
            pos += xrectnum
        }
        break;
    case 2:
        pos = pt1;
        while(pos != pt2)
        {
            if(game_maze[2 * pos + 1].exists)
                return false;
            pos++;
        }
        break;
    case 3:
        pos = pt1;
        while(pos != pt2)
        {
            if(2 * pos - 1 > 0)
            {
                if(game_maze[2 * pos - 1].exists)
                    return false;
                pos--;
            }
        }
        break;
    }
    return true; // This means I wasn't blocked
}

// can use this for most other damages
export function get_view_range (center_x, center_y, numx, numy, tier, game_maze) {
    // These give the shape of the visibility square
    // let cutoff;
    // if (tier == 0) 
    //     cutoff = 1
    // else if (tier == 1)
    //     cutoff = 0
    // else if (tier == 2)
    //     cutoff = 1
    // else if (tier > 2)
    //     cutoff = tier - 1
    const off_cen_size = Math.max(1, tier)

    // We now use this to give our side indices
    let map_indices = []
    for (let y_off = -off_cen_size; y_off < off_cen_size + 1; y_off++) {
        if (center_y + y_off < 0 || center_y + y_off > numy - 1)
            continue
        if (!blocked(center_y * numx + center_x, center_x + numx*(center_y + y_off), numx, game_maze))
            continue;
        map_indices.push(center_x + numx*(center_y + y_off))
    }  
    for (let x_off = -off_cen_size; x_off < off_cen_size + 1; x_off++) {
        // remove corners
        // console.log(y_off, x_off)
        // remove indices outside
        
        // if ((Math.abs(y_off) + cutoff > off_cen_size) && (Math.abs(x_off) + cutoff > 2*off_cen_size - Math.abs(y_off))){
        //     // console.log("here")
        //     continue
        // }
        if (center_x + x_off < 0 || center_x + x_off > numx - 1)
            continue
        if (!blocked(center_y * numx + center_x, (center_x+x_off) + numx*(center_y), numx, game_maze))
            continue;
        map_indices.push((center_x+x_off) + numx*(center_y))
    }
    return map_indices
}

function dist(x1, y1, x2, y2)
{
    return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}
// gets the indices for all the players
// compares to see if they intersect with the captain
// returns all the ones that do, to give all map-tiles of interest
export function total_visible_indices (players, numx, numy) {
    // give in captain player first
    let players_indices = [];
    for (let k = 0; k < players.length; k++){
        let new_inds = get_view_sqr(players[k].x,players[k].y,numx,numy,players[k].vis_tier)
        // console.log(new_inds)
        players_indices.push(new Set(new_inds))
    }
    let keep_indices = new Set(players_indices[0])
    // let dist = new Array(players.length - 1);
    let connected = new Array(players.length - 1);
    for(let i = 0;i < connected.length;i++)
    {
        connected[i] = false;
    }
    for (let k = 1; k < players.length; k++){
        if ((keep_indices.intersection(players_indices[k])).size > 0) {
            keep_indices = keep_indices.union(players_indices[k])
            connected[k - 1] = true;
        }
    }
    for (let k = 1; k < players.length; k++){
        if ((keep_indices.intersection(players_indices[k])).size > 0 && !connected[k - 1]) {
            keep_indices = keep_indices.union(players_indices[k])
            connected[k - 1] = true;
        }
    }
    for (let k = 1; k < players.length; k++){
        if ((keep_indices.intersection(players_indices[k])).size > 0 && !connected[k - 1]) {
            keep_indices = keep_indices.union(players_indices[k])
            connected[k - 1] = true;
        }
    }
    return Array.from(keep_indices)
}



// let game_map = map_init(xrectnum,yrectnum);
// let game_maze = maze_init2(xrectnum, yrectnum);

// let a = new Player(sizer, sizer);


