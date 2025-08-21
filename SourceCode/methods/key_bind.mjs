import { total_visible_indices, get_view_sqr, get_view_range, adj_poses } from "../methods/graphics/visibility.mjs";
import {game_map, game_maze, xrectnum, yrectnum, players, play_inds, curr_player, monsters, pause, menu_container, ptr, size, currx, curry, act_currx, act_curry, shiftx, shifty, chest_indices, chests, monster_indices, app, seen_indices, pop_up, pop_up_bubble, selector, selector_bubble, monster_spawn_indices, monster_spawns, inventory, inventory_screen} from "../vis_updated.mjs"
import { sight } from "./graphics/sight.mjs";
import { x_view_range } from "./combat/inRangeFuncs.mjs";
import { inRange } from "./combat/inRangeFuncs.mjs";
import { take_game_turn } from "../game_entities/game_AIs/game_turn.mjs";
import { update_player_cards } from "./displays/side_screen.mjs";

export function key_setup(){
    document.addEventListener('keydown', keyStart)
}

function dist(x1, y1, x2, y2)
{
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
function takeDamage(target, damage)
{
    target.health = Math.max(0, target.health - damage);
    if(target.health - damage <= 0)
    {
        //Somehow destroy target
    }
}
export function dealDamage(attacker, target)
{
    // console.log(target);
    // attacker.health += 0.2 * attacker.strength;
    takeDamage(target, attacker.strength);
}


export function setPlays()
{
    for(let i = 0;i < players.length;i++)
    {
        play_inds[i] = players[i].y * xrectnum + players[i].x;
    }
    // return play_inds
}

function checkPlayer(map_ind)
{
    for(let i = 0;i < players.length;i++)
    {
        if(players[i].y * xrectnum + players[i].x == map_ind)
        {
            return true;
        }
    }
    return false;
}

function checkDoor(player, maze, xrectnum, yrectnum) {
    let x = player.item.x 
    let y = player.item.y

    let check_inds = []

    if(x > 0) 
        check_inds.push(2 * (x + y * xrectnum) - 1)
    if(x < xrectnum - 1)
        check_inds.push(2 * (x + y * xrectnum) + 1)
    if(y > 0)
        check_inds.push(2 * (x + (y - 1) * xrectnum))
    if(y < yrectnum)
        check_inds.push(2 * (x + y * xrectnum))

    for(let l = 0; l < check_inds.length; l++) {
        console.log(check_inds)
        if (maze[check_inds[l]].setDoor)
            return [true, check_inds[l]]
    }
    return [false]

}

function checkMonster(map_ind)
{
    for(let i = 0;i < monsters.length;i++)
    {
        if(monster_indices[i] == map_ind)
        {
            return true;
        }
    }
}

let key
let key_w = 87;
let key_a = 65;
let key_s = 83;
let key_d = 68;

let keyone = 49
let keytwo = 50
let keythree = 51
let keyfour = 52

let key_g = 71
let key_h = 72
let key_i = 73
let key_j = 74
let key_k = 75
let key_l = 76
let key_u = 85

let left = 37;
let up = 38;
let right = 39;
let down = 40;

let key_r = 82;
let key_open = 69;
let key_p = 80;
let key_n = 78;
let key_v = 86;
let key_esc = 27;
let key_y = 89;
// let pause.item = false;




function keyStart(e)
{
    // // console.log(shiftx.item, shifty.item, currx.item, curry.item)
    key = e.keyCode;
    if (pop_up.item) {
        app.stage.removeChild(pop_up_bubble.item)
        pop_up_bubble.item = false
        pop_up.item = false
        return null
    }
    if (inventory.item && !pause.item) {
        console.log(inventory.item)
        if (key == key_i) {
            inventory.item = false
            inventory_screen.visible = false
        }
        if(key == key_esc)
        {
            //display screens
            pause.item = true;
            menu_container.visible = true
            console.log("GAME IS pause.itemD");
        }
    }
    else if (!pause.item) {
        if (key == key_r) {
            if (size.item > 20)
                size.item = Math.floor(size.item / 1.2)
            else
                size.item = 140
            // // console.log(size.item)
            for (let t = 0; t < players.length; t++) {
                players[t].resize(size.item, size.item)
            }
            for (let t = 0; t < monsters.length; t++) {
                monsters[t].resize(size.item, size.item)
            }
            for (let t = 0; t < monster_spawns.length; t++) {
                monster_spawns[t].resize(size.item, size.item)
            }
            // console.log(size.item)
        }
        else if(key == key_u)
            shifty.item = Math.max(shifty.item - 1, -act_curry.item +1 )
        else if(key == key_h)
            shiftx.item = Math.max(shiftx.item - 1, -act_currx.item + 1)
        else if(key == key_j)
            shifty.item = Math.min(shifty.item + 1, yrectnum - act_curry.item - 2)
        else if(key == key_k)
            shiftx.item = Math.min(shiftx.item + 1, xrectnum - act_currx.item - 2)
        else if(key == key_g) {
            shifty.item = 0 
            shiftx.item = 0
        }
        else if(key == key_open && (chest_indices.includes(curr_player.item.y * xrectnum + curr_player.item.x) && !chests[chest_indices.indexOf(curr_player.item.y * xrectnum + curr_player.item.x)].opened))
        {
            // alert("Good");
            chests[chest_indices.indexOf(curr_player.item.y * xrectnum + curr_player.item.x)].Open();
            pop_up_bubble.item = chests[chest_indices.indexOf(curr_player.item.y * xrectnum + curr_player.item.x)].listItems();
        }
        else if(key == key_open) {
            let caser = checkDoor(curr_player, game_maze, xrectnum, yrectnum)
            if (caser[0]) {
                game_maze[caser[1]].setDoor = false
                game_maze[caser[1]].wall_image.visible = false
            }
        }
        else if (key == keyone && players[0].health > 0) {
            curr_player.item.in_combat = false;
            curr_player.item = players[0]
            ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
        }
        else if(key == keytwo && players[1].health > 0) {
            curr_player.item.in_combat = false;
            curr_player.item = players[1]
            ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
        }
        else if(key == keythree && players[2].health > 0) {
            curr_player.item.in_combat = false;
            curr_player.item = players[2]
            ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
        }
        else if(key == keyfour && players[3].health > 0) {
            curr_player.item.in_combat = false;
            curr_player.item = players[3]
            ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
        }
        else if(key == key_v && curr_player.item.range_type == "xrange" && curr_player.item.in_combat)
        {
            curr_player.item.in_combat = false;
            console.log("HEREHRHERHERHEHR");
        }
        else if(key == key_n && !curr_player.item.turn_end)
        {
            // just need to concatenate other entities here and can do damage to anything then

            let attPlayers = [];
            for(let i = 0;i < players.length;i++)
            {
                if(curr_player.item.play_inds == i)
                {
                    continue;
                }
                attPlayers.push(players[i]);
            }
            let entities = attPlayers.concat(monsters)
            let entities_inds = play_inds.concat(monster_indices)
            if(curr_player.item.in_combat && curr_player.item.range_type == "xrange")
            {
                let x_indices = x_view_range(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.range);
                let hit_indices = [];
                let hit = false;
                
                for(let i = 0;i < x_indices.length;i++)
                {
                    if (x_indices[i] == curr_player.item.x + curr_player.item.y * xrectnum)
                        continue
                    if(entities_inds.includes(x_indices[i]))
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
                    console.log(entities[entities_inds.indexOf(hit_indices[i])])
                    dealDamage(curr_player.item, entities[entities_inds.indexOf(hit_indices[i])]);
                    // if(monsters[monster_indices.indexOf(hit_indices[i])].health <= 0)
                    // {
                    //     app.stage.removeChild(monsters[monster_indices.indexOf(hit_indices[i])].rect);
                    //     monsters.splice(monster_indices.indexOf(hit_indices[i]), 1);
                    //     monster_indices.splice(monster_indices.indexOf(hit_indices[i]), 1);
                    // }
                }
                
                if(hit)
                {
                    console.log("HITITITITITITITIT");
                    curr_player.item.turn_end = true;
                }
                curr_player.item.in_combat = false;
            }
            else if(curr_player.item.in_combat && curr_player.item.range_type == "regular") // Add getValid to check if a sqr is valid for attack
            {
                // Add dealDamage stuff
                
                // Add that if you missed then end combat early
                let hit = inRange(curr_player.item, ptr.item, xrectnum, game_maze, entities_inds);
                if(hit && entities_inds.includes(ptr.item) && (ptr.item != curr_player.item.x + curr_player.item.y * xrectnum))
                {
                    dealDamage(curr_player.item, entities[entities_inds.indexOf(ptr.item)]);
                    // if(entities[entities_inds.indexOf(ptr.item)].health <= 0)
                    // {
                    //     app.stage.removeChild(monsters[entities_inds.indexOf(ptr.item)].rect);
                    //     monsters.splice(entities_inds.indexOf(ptr.item), 1);
                    //     entities_inds.splice(entities_inds.indexOf(ptr.item), 1);
                    // }
                    curr_player.item.turn_end = true;
                    curr_player.item.in_combat = false;
                }
                                    console.log("PTR = " + ptr.item);

                if(!hit || ptr.item == curr_player.item.x + curr_player.item.y * xrectnum) //This will also just run through the entire function so even if it hits the rigth functino will be carried out
                {
                    console.log(ptr.item);
                    curr_player.item.in_combat = false;
                    ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
                }
            }
            else
            {
                curr_player.item.in_combat = true;
                ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
            }
        }
        else if((key == up || key == key_w) && curr_player.item.in_combat && curr_player.item.range_type == "regular")
        {
            if(get_view_range(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.range, game_maze, curr_player.item, game_maze).includes(ptr.item - xrectnum))
            {
                ptr.item = ptr.item - xrectnum;
            }
        }
        else if((key == down || key == key_s) && curr_player.item.in_combat && curr_player.item.range_type == "regular")
        {
            if(get_view_range(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.range, game_maze, curr_player.item, game_maze).includes(ptr.item + xrectnum))
            {
                ptr.item = ptr.item + xrectnum;
            }
        }
        else if((key == left || key == key_a) && curr_player.item.in_combat && curr_player.item.range_type == "regular")
        {
            if(get_view_range(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.range, game_maze, curr_player.item, game_maze).includes(ptr.item - 1))
            {
                ptr.item--;
            }
        }
        else if((key == right || key == key_d) && curr_player.item.in_combat && curr_player.item.range_type == "regular")
        {
            if(get_view_range(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.range, game_maze, curr_player.item, game_maze).includes(ptr.item + 1))
            {
                ptr.item++;
            }
        }
        else if(key == key_p) //Turn over
        {
            // console.log("Turn over");
            // console.log(players[0].blks_moved);
            for(let n = 0;n < 4;n++)
            {
                players[n].blks_moved = 0;
                players[n].turn_end = false;
            }
            curr_player.item.in_combat = false;
            for (let l = 0; l < players.length; l++){
                if(!seen_indices.item.includes(play_inds[l]))
                    players[l].health -= 0.5
            }
            take_game_turn()

            // return;
        }
        else if(!curr_player.item.in_combat && curr_player.item.health > 0 && seen_indices.item.includes(curr_player.item.x + curr_player.item.y*xrectnum) && curr_player.item.x - 1 >= 0 && (key == left || key == key_a) && !game_maze[curr_player.item.y * 2 * xrectnum + curr_player.item.x * 2 - 1].getWall() && curr_player.item.blks_moved != curr_player.item.speed && !checkPlayer(curr_player.item.y * xrectnum + curr_player.item.x - 1) && !curr_player.item.turn_end && !checkMonster(curr_player.item.y * xrectnum + curr_player.item.x - 1))
        {
            curr_player.item.x--;
            curr_player.item.blks_moved++;
            shifty.item = Math.max(shifty.item, -curry.item)
            shiftx.item = Math.max(shiftx.item, -currx.item)
            shifty.item = Math.min(shifty.item, yrectnum - curry.item - 2)
            shiftx.item = Math.min(shiftx.item, xrectnum - curry.item - 2)
            ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
            // // console.log(ptr.item);
        }
        else if(!curr_player.item.in_combat && curr_player.item.health > 0 && seen_indices.item.includes(curr_player.item.x + curr_player.item.y*xrectnum) && curr_player.item.y - 1 >= 0 && (key == up || key == key_w) && !game_maze[(curr_player.item.y - 1) * 2 * xrectnum + curr_player.item.x * 2].getWall() && curr_player.item.blks_moved != curr_player.item.speed && !checkPlayer(curr_player.item.y * xrectnum + curr_player.item.x - xrectnum) && !curr_player.item.turn_end && !checkMonster((curr_player.item.y * xrectnum + curr_player.item.x - xrectnum)))
        {
            curr_player.item.y--;
            curr_player.item.blks_moved++;
            shifty.item = Math.max(shifty.item, -curry.item)
            shiftx.item = Math.max(shiftx.item, -currx.item)
            shifty.item = Math.min(shifty.item, yrectnum - curry.item - 2)
            shiftx.item = Math.min(shiftx.item, xrectnum - curry.item - 2)
            ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
            // // console.log(ptr.item);
        }
        else if(!curr_player.item.in_combat && curr_player.item.health > 0 && seen_indices.item.includes(curr_player.item.x + curr_player.item.y*xrectnum) && curr_player.item.x + 1 < xrectnum && (key == right || key == key_d) && !game_maze[curr_player.item.y * 2 * xrectnum + curr_player.item.x * 2 + 1].getWall() && curr_player.item.blks_moved != curr_player.item.speed && !checkPlayer(curr_player.item.y * xrectnum + curr_player.item.x + 1) && !curr_player.item.turn_end && !checkMonster((curr_player.item.y * xrectnum + curr_player.item.x + 1)))
        {
            curr_player.item.x++;
            curr_player.item.blks_moved++;
            shifty.item = Math.max(shifty.item, -curry.item)
            shiftx.item = Math.max(shiftx.item, -currx.item)
            shifty.item = Math.min(shifty.item, yrectnum - curry.item - 2)
            shiftx.item = Math.min(shiftx.item, xrectnum - curry.item - 2)
            ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
            // // console.log(ptr.item);
        }
        else if(!curr_player.item.in_combat && curr_player.item.health > 0 && seen_indices.item.includes(curr_player.item.x + curr_player.item.y*xrectnum) && curry.item + 1 < yrectnum && (key == down || key == key_s) && !game_maze[(curr_player.item.y) * 2 * xrectnum + curr_player.item.x * 2].getWall() && curr_player.item.blks_moved != curr_player.item.speed && !checkPlayer(curr_player.item.y * xrectnum + curr_player.item.x + xrectnum) && !curr_player.item.turn_end && !checkMonster((curr_player.item.y * xrectnum + curr_player.item.x + xrectnum)))
        {
            curr_player.item.y++;
            curr_player.item.blks_moved++;
            shifty.item = Math.max(shifty.item, -curry.item)
            shiftx.item = Math.max(shiftx.item, -currx.item)
            shifty.item = Math.min(shifty.item, yrectnum - curry.item - 2)
            shiftx.item = Math.min(shiftx.item, xrectnum - curry.item - 2)
            ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
            // // console.log(ptr.item);
        }
        else if(key == key_i)
        {
            //display screens
            inventory.item = true;
            inventory_screen.visible = true

            console.log("check inventory");
        }
        else if(key == key_esc)
        {
            //display screens
            pause.item = true;
            menu_container.visible = true
            console.log("GAME IS pause.itemD");
        }
        if (key != key_esc && key != keyone && key != keytwo && key != keythree && key != keyfour) {
            if (selector.item) {
                app.stage.removeChild(selector_bubble.item)
                selector.item = false
                selector_bubble.item = false
            }
        }
        // else if(key == key_y) {
        //     inventory_case.item = true
        // }
    }
    else if(key == key_esc && pause.item)
    {
        //escape display
        pause.item = false;
        menu_container.visible = false
        // console.log("GAME IS UNpause.itemD");
    }
    else
        return null

    let counter = 0
    seen_indices.item = total_visible_indices(players, xrectnum, yrectnum);
    let xmin = xrectnum;
    let xmax = 0;
    let ymin = xrectnum;
    let ymax = 0;
    for(let i = 0;i < seen_indices.item.length;i++)
    {
        // // console.log(xmax, xmin, ymax, ymin)
        if(seen_indices.item[i] % xrectnum > xmax)
            xmax = seen_indices.item[i] % xrectnum
        if(seen_indices.item[i] % xrectnum < xmin)
            xmin = seen_indices.item[i] % xrectnum
        if(~~(seen_indices.item[i] / xrectnum) > ymax)
            ymax = ~~(seen_indices.item[i] / xrectnum)
        if(~~(seen_indices.item[i] / xrectnum) < ymin)
            ymin = ~~(seen_indices.item[i] / xrectnum)
    }
    // // console.log("*****")
    // // console.log(xmax, xmin, ymax, ymin)
    act_currx.item = Math.floor((xmax + xmin)/2)
    act_curry.item = Math.floor( (ymax + ymin)/2 )
    
    currx.item = act_currx.item + shiftx.item
    curry.item = act_curry.item + shifty.item
    // // console.log("-----------------")
// // console.log(currx.item,curry.item)
    // // console.log(currx.item, curry.item)
    
    sight(game_map, game_maze, xrectnum, yrectnum, players, curr_player.item, monsters, ptr.item, size.item, currx.item, curry.item, chest_indices, chests, monster_indices, monster_spawns, monster_spawn_indices, app);
    
    for (let t = 0; t < players.length; t++) {
        players[t].drawMe(size.item, size.item, currx.item, curry.item)
        // // console.log(players[t])
        // app.stage.addChild(players[t].rect)
    }
    for (let t = 0; t < monsters.length; t++) {
        monsters[t].drawMe(size.item, size.item, currx.item, curry.item)
    }
    let x_indices = x_view_range(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.range);
    // console.log("START");
    // console.log(x_indices);
    // console.log("END");
    // // console.log(ptr.item);
    // // console.log(get_view_sqr(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.vis_tier));
    // // console.log(game_map[ptr.item].biome);
    setPlays();
    update_player_cards();
    if (selector.item) {
        app.stage.addChild(selector_bubble.item)
    }
    if (pop_up.item) {
        app.stage.addChild(pop_up_bubble.item)
    }
    if (inventory.item) {
        if (selector_bubble.item) {
            app.stage.removeChild(selector_bubble.item)
            selector.item = false
            selector_bubble.item = false
        }
        app.stage.removeChild(inventory_screen)
        app.stage.addChild(inventory_screen)
    }
    if (pause.item) {
        if (selector_bubble.item) {
            app.stage.removeChild(selector_bubble.item)
            selector.item = false
            selector_bubble.item = false
        }
        app.stage.removeChild(menu_container)
        app.stage.addChild(menu_container)
    }
    
}