

function keyStart(e)
{
    // // console.log(shiftx, shifty, currx, curry)
    key = e.keyCode;
    if (!pause && key == key_r) {
        if (size > 20)
            size = Math.floor(size / 1.2)
        else
            size = 140
        // // console.log(size)
        for (let t = 0; t < players.length; t++) {
            players[t].resize(size, size)
        }
    }
    else if(!pause && key == key_i)
        shifty = Math.max(shifty - 1, -act_curry +1 )
    else if(!pause && key == key_j)
        shiftx = Math.max(shiftx - 1, -act_currx + 1)
    else if(!pause && key == key_k)
        shifty = Math.min(shifty + 1, yrectnum - act_curry - 2)
    else if(!pause && key == key_l)
        shiftx = Math.min(shiftx + 1, xrectnum - act_currx - 2)
    else if(!pause && key == key_h) {
        shifty = 0 
        shiftx = 0
    }
    else if(!pause && key == key_open && (chest_indices.includes(curr_player.y * xrectnum + curr_player.x) && !chests[chest_indices.indexOf(curr_player.y * xrectnum + curr_player.x)].opened))
    {
        // alert("Good");
        chests[chest_indices.indexOf(curr_player.y * xrectnum + curr_player.x)].Open();
        chests[chest_indices.indexOf(curr_player.y * xrectnum + curr_player.x)].listItems();
    }
    else if (!pause && key == keyone) {
        curr_player.in_combat = false;
        curr_player = players[0]
        ptr = curr_player.y * xrectnum + curr_player.x;
    }
    else if(!pause && key == keytwo) {
        curr_player.in_combat = false;
        curr_player = players[1]
        ptr = curr_player.y * xrectnum + curr_player.x;
    }
    else if(!pause && key == keythree) {
        curr_player.in_combat = false;
        curr_player = players[2]
        ptr = curr_player.y * xrectnum + curr_player.x;
    }
    else if(!pause && key == keyfour) {
        curr_player.in_combat = false;
        curr_player = players[3]
        ptr = curr_player.y * xrectnum + curr_player.x;
    }
    else if(!pause && key == key_v && curr_player.range_type == "xrange" && curr_player.in_combat)
    {
        curr_player.in_combat = false;
        console.log("HEREHRHERHERHEHR");
    }
    else if(!pause && key == key_n && !curr_player.turn_end)
    {
        if(curr_player.in_combat && curr_player.range_type == "xrange")
        {
            let x_indices = x_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range);
            let hit_indices = [];
            let hit = false;
            for(let i = 0;i < x_indices.length;i++)
            {
                if(monster_indices.includes(x_indices[i]))
                {
                    hit_indices.push(x_indices[i]);
                    hit = true;
                }
            }
            console.log("-------------------");
            console.log(hit_indices.length);
            console.log("######################");
            for(let i = 0;i < hit_indices.length; i++)
            {
                console.log("VEIRGB IERGVIE EIRVEIRV")
                console.log('------222222222---------2222222----------')
                console.log(monsters[monster_indices.indexOf(hit_indices[i])])
                dealDamage(curr_player, monsters[monster_indices.indexOf(hit_indices[i])]);
                if(monsters[monster_indices.indexOf(hit_indices[i])].health <= 0)
                {
                    app.stage.removeChild(monsters[monster_indices.indexOf(hit_indices[i])].rect);
                    monsters.splice(monster_indices.indexOf(hit_indices[i]), 1);
                    monster_indices.splice(monster_indices.indexOf(hit_indices[i]), 1);
                }
            }
            
            if(hit)
            {
                console.log("HITITITITITITITIT");
                curr_player.turn_end = true;
            }
            curr_player.in_combat = false;
        }
        else if(curr_player.in_combat && curr_player.range_type == "regular") // Add getValid to check if a sqr is valid for attack
        {
            // Add dealDamage stuff
            
            // Add that if you missed then end combat early
            let hit = inRange(curr_player, ptr, xrectnum, game_maze, monster_indices);
            if(hit && monster_indices.includes(ptr))
            {
                dealDamage(curr_player, monsters[monster_indices.indexOf(ptr)]);
                if(monsters[monster_indices.indexOf(ptr)].health <= 0)
                {
                    app.stage.removeChild(monsters[monster_indices.indexOf(ptr)].rect);
                    monsters.splice(monster_indices.indexOf(ptr), 1);
                    monster_indices.splice(monster_indices.indexOf(ptr), 1);
                }
                curr_player.turn_end = true;
                curr_player.in_combat = false;
            }
            if(!hit) //This will also just run through the entire function so even if it hits the rigth functino will be carried out
            {
                curr_player.in_combat = false;
                ptr = curr_player.y * xrectnum + curr_player.x;
            }
        }
        else
        {
            curr_player.in_combat = true;
            ptr = curr_player.y * xrectnum + curr_player.x;
        }
    }
    else if(!pause && key == up && curr_player.in_combat && curr_player.range_type == "regular")
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range, game_maze, curr_player, game_maze).includes(ptr - xrectnum))
        {
            ptr = ptr - xrectnum;
        }
    }
    else if(!pause && key == down && curr_player.in_combat && curr_player.range_type == "regular")
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range, game_maze, curr_player, game_maze).includes(ptr + xrectnum))
        {
            ptr = ptr + xrectnum;
        }
    }
    else if(!pause && key == left && curr_player.in_combat && curr_player.range_type == "regular")
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range, game_maze, curr_player, game_maze).includes(ptr - 1))
        {
            ptr--;
        }
    }
    else if(!pause && key == right && curr_player.in_combat && curr_player.range_type == "regular")
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range, game_maze, curr_player, game_maze).includes(ptr + 1))
        {
            ptr++;
        }
    }
    else if(!pause && key == key_p) //Turn over
    {
        // console.log("Turn over");
        // // console.log(players[0].blks_moved);
        for(let n = 0;n < 4;n++)
        {
            players[n].blks_moved = 0;
            players[n].turn_end = false;
        }
        curr_player.in_combat = false;
        //Call monster stuff here or somewhere else
        return;
    }
    else if(!pause && !curr_player.in_combat && seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.x - 1 >= 0 && (key == left || key == key_a) && !game_maze[curr_player.y * 2 * xrectnum + curr_player.x * 2 - 1].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x - 1) && !curr_player.turn_end && !checkMonster(curr_player.y * xrectnum + curr_player.x - 1))
    {
        curr_player.x--;
        curr_player.blks_moved++;
        shifty = Math.max(shifty, -curry)
        shiftx = Math.max(shiftx, -currx)
        shifty = Math.min(shifty, yrectnum - curry - 2)
        shiftx = Math.min(shiftx, xrectnum - curry - 2)
        ptr = curr_player.y * xrectnum + curr_player.x;
        // // console.log(ptr);
    }
    else if(!pause && !curr_player.in_combat && seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.y - 1 >= 0 && (key == up || key == key_w) && !game_maze[(curr_player.y - 1) * 2 * xrectnum + curr_player.x * 2].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x - xrectnum) && !curr_player.turn_end && !checkMonster((curr_player.y * xrectnum + curr_player.x - xrectnum)))
    {
        curr_player.y--;
        curr_player.blks_moved++;
        shifty = Math.max(shifty, -curry)
        shiftx = Math.max(shiftx, -currx)
        shifty = Math.min(shifty, yrectnum - curry - 2)
        shiftx = Math.min(shiftx, xrectnum - curry - 2)
        ptr = curr_player.y * xrectnum + curr_player.x;
        // // console.log(ptr);
    }
    else if(!pause && !curr_player.in_combat && seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.x + 1 < xrectnum && (key == right || key == key_d) && !game_maze[curr_player.y * 2 * xrectnum + curr_player.x * 2 + 1].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x + 1) && !curr_player.turn_end && !checkMonster((curr_player.y * xrectnum + curr_player.x + 1)))
    {
        curr_player.x++;
        curr_player.blks_moved++;
        shifty = Math.max(shifty, -curry)
        shiftx = Math.max(shiftx, -currx)
        shifty = Math.min(shifty, yrectnum - curry - 2)
        shiftx = Math.min(shiftx, xrectnum - curry - 2)
        ptr = curr_player.y * xrectnum + curr_player.x;
        // // console.log(ptr);
    }
    else if(!pause && !curr_player.in_combat && seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curry + 1 < yrectnum && (key == down || key == key_s) && !game_maze[(curr_player.y) * 2 * xrectnum + curr_player.x * 2].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x + xrectnum) && !curr_player.turn_end && !checkMonster((curr_player.y * xrectnum + curr_player.x + xrectnum)))
    {
        curr_player.y++;
        curr_player.blks_moved++;
        shifty = Math.max(shifty, -curry)
        shiftx = Math.max(shiftx, -currx)
        shifty = Math.min(shifty, yrectnum - curry - 2)
        shiftx = Math.min(shiftx, xrectnum - curry - 2)
        ptr = curr_player.y * xrectnum + curr_player.x;
        // // console.log(ptr);
    }
    else if(key == key_esc && !pause)
    {
        //display screens
        pause = true;
        console.log("GAME IS PAUSED");
    }
    else if(key == key_esc && pause)
    {
        //escape display
        pause = false;
        console.log("GAME IS UNPAUSED");
    }
    else
        return null

    let counter = 0
    seen_indices = total_visible_indices(players, xrectnum, yrectnum);
    let xmin = xrectnum;
    let xmax = 0;
    let ymin = xrectnum;
    let ymax = 0;
    for(let i = 0;i < seen_indices.length;i++)
    {
        // // console.log(xmax, xmin, ymax, ymin)
        if(seen_indices[i] % xrectnum > xmax)
            xmax = seen_indices[i] % xrectnum
        if(seen_indices[i] % xrectnum < xmin)
            xmin = seen_indices[i] % xrectnum
        if(~~(seen_indices[i] / xrectnum) > ymax)
            ymax = ~~(seen_indices[i] / xrectnum)
        if(~~(seen_indices[i] / xrectnum) < ymin)
            ymin = ~~(seen_indices[i] / xrectnum)
    }
    // // console.log("*****")
    // // console.log(xmax, xmin, ymax, ymin)
    act_currx = Math.floor((xmax + xmin)/2)
    act_curry = Math.floor( (ymax + ymin)/2 )
    
    currx = act_currx + shiftx
    curry = act_curry + shifty
    // // console.log("-----------------")
// // console.log(currx,curry)
    // // console.log(currx, curry)
    sight(game_map, game_maze, xrectnum, yrectnum, players, curr_player, monsters, ptr, size, currx, curry, chest_indices, chests, monster_indices, app);
    for (let t = 0; t < players.length; t++) {
        players[t].drawMe(size, size, currx, curry)
        // // console.log(players[t])
        // app.stage.addChild(players[t].rect)
    }
    let x_indices = x_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range);
    console.log("START");
    console.log(x_indices);
    console.log("END");
    // // console.log(ptr);
    // // console.log(get_view_sqr(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.vis_tier));
    // // console.log(game_map[ptr].biome);
    setPlays();
}