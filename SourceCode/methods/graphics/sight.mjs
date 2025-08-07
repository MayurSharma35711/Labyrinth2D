import { vis } from "../../vis_updated.mjs";
import { walls } from "../../vis_updated.mjs";
import { total_visible_indices, test_visible_indices, get_view_range, get_view_sqr, adj_poses } from "./visibility.mjs";
// Sight uses visiblity code to show the map tiles and maze tiles that are visible
export function sight(game_map, game_maze, xrectnum, yrectnum, players, curr_player, monsters, ptr, size, currx, curry, chest_indices, chests, monster_indices, app)
{
    while(vis.children[0])
    {
        vis.removeChild(vis.children[0]);
    }
    while(walls.children[0])
    {
        walls.removeChild(walls.children[0]);
    }
    let map_indices = total_visible_indices(players, xrectnum, yrectnum);
    let curr_player_view = get_view_sqr(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.vis_tier)
    let range = get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range, game_maze, curr_player.range_type)
    range = new Set(range);
    range = range.intersection(new Set(curr_player_view));
    range = Array.from(range)
    // console.log("---########################");
    // console.log(range.length);
    // console.log(range);
    // console.log(curr_player_view);
    
    // console.log("---########################");
    let opac_arr = new Array(map_indices.length);
    for (let k = 0; k < map_indices.length; k++) {
        if(map_indices[k] == ptr && curr_player.in_combat)
        {
            opac_arr[k] = 0.1
            continue
        }
        // if(range.includes(map_indices[k]))
        //     opac_arr[k] = 1;
        if (curr_player_view.includes(map_indices[k]))
            opac_arr[k] = 0.8
        else
            opac_arr[k] = 0.4
    }

    for(let j = 0; j < players.length; j++)
        players[j].bkg_rect.visible = false

    for(let l = 0; l < players.length; l++) {
        let x = players[l].x
        let y = players[l].y 
        let adj_squares = adj_poses(x, y, xrectnum, yrectnum)

        
        for (let k = 0; k < adj_squares.length; k++) {
            let poses = []
            let tiers = []
            for(let i = 0; i < players.length; i++) {
                if (i == l) {
                    poses.push(adj_squares[k])
                } else {
                    poses.push([players[i].x, players[i].y])
                }
                tiers.push(players[i].vis_tier)
            }
            let new_indices = test_visible_indices(poses, tiers, xrectnum, yrectnum)
            for(let i = 1; i < players.length; i++) {
                if (!map_indices.includes(players[i].x + players[i].y * xrectnum))
                    continue
                let testpos;
                if (i == l) {
                    testpos = adj_squares[k][0] + xrectnum * adj_squares[k][1]
                } else {
                    testpos = players[i].x + players[i].y * xrectnum
                }
                if(!new_indices.includes(testpos)) {
                    players[i].bkg_rect.visible = true
                }
            }
        }
    }
    // THIS IS THE ORIGINAL SIGHT WARNING CODE!!
    // only overlapping with 1 player case
    // let closest_player_inds = []
    // let closest_player_overlap_inds = []
    // for (let k = 0; k < players.length; k++) {
    //     let player_view = get_view_sqr(players[k].x, players[k].y, xrectnum, yrectnum, players[k].vis_tier)
    //     let closest_player = 0
    //     let closest_player_overlap = []
    //     for (let j = 0; j < players.length; j++) {
    //         if (j == k)
    //             continue
    //         let test_player_view = get_view_sqr(players[j].x, players[j].y, xrectnum, yrectnum, players[j].vis_tier)
    //         const intersection = test_player_view.filter(item => player_view.includes(item));
    //         // if (k== 3) {

    //         //     console.log(j,intersection)
    //         // }
            
    //         if (intersection.length != 0 && closest_player_overlap.length != 0) {
    //             closest_player = -1
    //         }
    //         else if (closest_player_overlap.length == 0) {
    //             closest_player_overlap = intersection
    //             closest_player = j
    //             // console.log("HERE")
    //         }
    //     }
    //     closest_player_inds.push(closest_player)
    //     closest_player_overlap_inds.push(closest_player_overlap)
    // } 
    // console.log(closest_player_inds)

    // // original warning system
    // for (let k = 0; k < players.length; k++) {
    //     let other_players = []
    //     for (let j = 0; j < players.length; j++) {
    //         if (j == k)
    //             continue
    //         other_players.push(players[j])
    //     }
    //     let player_view = get_view_sqr(players[k].x, players[k].y, xrectnum, yrectnum, players[k].vis_tier)
    //     const other_inds = total_visible_indices(other_players, xrectnum, yrectnum)

    //     const intersection = other_inds.filter(item => player_view.includes(item));

    //     players[k].bkg_rect.visible = false
    //     let x_case = false
    //     let y_case = false
    //     if (intersection.length < 4 && intersection.length > 0) {
    //         players[k].bkg_rect.visible = true
    //     }
    //     for (let l = 0; l < intersection.length; l++) {
    //         if (x_case && y_case)
    //             break
    //         for (let p = 0; p < intersection.length; p++) {
    //             if (x_case && y_case)
    //                 break
    //             if (intersection[l] % xrectnum == intersection[k] % xrectnum)
    //                 x_case = true
    //             else if(Math.floor(intersection[l] / xrectnum) == Math.floor(intersection[k] / xrectnum))
    //                 y_case = true
    //         }
            
    //     }
    //     // console.log(k, x_case, y_case, intersection)
    //     if (intersection.length > 0 && (!x_case || !y_case))
    //         players[k].bkg_rect.visible = true
    // }
    // // console.log(players[3].bkg_rect.visible)
    // let count = 1
    // let players_checked = []
    // for (let j = 0; j < count; j++) {
    //     for (let l = 0; l < players.length; l++) {
    //         if(players[l].bkg_rect.visible && !players_checked.includes(l)) {
    //             players_checked.push(l)
    //             for(let i = 1; i < players.length; i++) {
    //                 if (closest_player_inds[i] == l) {
    //                     count = count + 1
    //                     players[i].bkg_rect.visible = true
    //                 }
    //             }
    //         }
    //     }
    // }
    // ORIGINAL WARNING CODE ENDING
    

    for(let i = 0; i < map_indices.length;i++)
    {
        game_map[map_indices[i]].drawMe(size, size, currx, curry, opac_arr[i]);
        // if(map_indices[i] == ptr)
        // {
        //     console.log(ptr);
        // }
    }
    for(let i = 0;i < map_indices.length;i++)
    {
        let map_indexer = map_indices[i]
        
        if(map_indexer < xrectnum && game_map[map_indexer].getBiome() != -1) {
            let upwall = PIXI.Sprite.from('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/WallsHorizontal.png');
            upwall.height = 0.3 * size;
            upwall.width = size;
            upwall.x = (map_indexer - currx) * size;
            upwall.y = (- curry) * size - 0.15*size;
            walls.addChild(upwall)
        }
        if(map_indexer % xrectnum == 0 && game_map[map_indexer].getBiome() != -1) {
            let leftwall = PIXI.Sprite.from('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/WallsVertical.png');
            leftwall.height = size;
            leftwall.width = 0.3 * size;
            leftwall.x = (0 - currx) * size - 0.15*size;
            leftwall.y = (map_indexer / xrectnum - curry) * size;
            walls.addChild(leftwall)
        }
        if(!map_indices.includes(map_indexer - xrectnum) && map_indexer - xrectnum >= 0) {
            if (opac_arr[i] != 0.3)
                game_maze[2 * map_indices[i] - 2*xrectnum].drawMe(size, size, currx, curry, (1+opac_arr[i])/2);
            else
                game_maze[2 * map_indices[i] - 2*xrectnum].drawMe(size, size, currx, curry, 1);
        }
        if(!map_indices.includes(map_indexer - 1) && map_indexer % xrectnum > 0) {
            if (opac_arr[i] != 0.3)
                game_maze[2 * map_indices[i] - 1].drawMe(size, size, currx, curry, (1+opac_arr[i])/2);
            else
                game_maze[2 * map_indices[i] - 1].drawMe(size, size, currx, curry, 1);
        }
        if (opac_arr[i] != 0.3) {
            game_maze[2 * map_indices[i]].drawMe(size, size, currx, curry, (1+opac_arr[i])/2);
            game_maze[2 * map_indices[i] + 1].drawMe(size, size, currx, curry, (1+opac_arr[i])/2);
        }
        else{
            game_maze[2 * map_indices[i]].drawMe(size, size, currx, curry, 1);
            game_maze[2 * map_indices[i] + 1].drawMe(size, size, currx, curry, 1);
        }
    }
    for(let i = 0;i < chest_indices.length;i++)
    {
        if(map_indices.includes(chest_indices[i]))
        {
            chests[i].drawMe(size, size, currx, curry);
            // console.log("HERE");
            // console.log(chests[i].x);
            // console.log(chests[i].y);
        }
    }
    for(let i = 0;i < monsters.length;i++)
    {
        app.stage.removeChild(monsters[i].rect);
        if(monsters[i].health <= 0)
        {
            delete monsters[i];
            delete monster_indices[i];
        }
        if(monster_indices[i] != undefined && map_indices.includes(monster_indices[i]))
        {
            // console.log(monster_indices[i], i)
            monsters[i].drawMe(size, size, currx, curry);
            app.stage.addChild(monsters[i].rect);
            // console.log("HERE");
            // console.log(chests[i].x);
            // console.log(chests[i].y);
        }
    }
    for(let i = 0;i < monsters.length;i++)
    {
        if(monster_indices[i] == undefined)
        {
            monsters.splice(i, 1);
            monster_indices.splice(i, 1);
        }
    }
    if(curr_player.in_combat)
    {
        // console.log(game_map[range[0]].sprite.saturation)
        for(let i = 0;i < range.length;i++)
        {
            if(!curr_player_view.includes(range[i]))
                continue;
            console.log(game_map[range[i]])
            game_map[range[i]].sprite.alpha = 0.5;
            game_map[range[i]].sprite.tint = 0xFFBB88;
            // game_map[range[i]].sprite.saturation = .1;
        }
        if(curr_player.range_type == "regular")
        {
            game_map[ptr].sprite.alpha = 0
            game_map[ptr].sprite.tint = 0xFFFFFF;
        }
    }
}