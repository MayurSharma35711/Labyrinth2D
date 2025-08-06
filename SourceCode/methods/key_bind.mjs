import { total_visible_indices, get_view_sqr, get_view_range } from "../methods/graphics/visibility.mjs";
import {game_map, game_maze, xrectnum, yrectnum, players, play_inds, curr_player, monsters, pause, menu_container, ptr, size, currx, curry, act_currx, act_curry, shiftx, shifty, chest_indices, chests, monster_indices, app, seen_indices} from "../vis_updated.mjs"
import { sight } from "./graphics/sight.mjs";
import { x_view_range } from "./combat/inRangeFuncs.mjs";
import { inRange } from "./combat/inRangeFuncs.mjs";
import { take_game_turn } from "../game_entities/game_AIs/game_turn.mjs";
import { update_health_bars } from "./displays/side_screen.mjs";

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

let key_h = 72
let key_i = 73
let key_j = 74
let key_k = 75
let key_l = 76

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
// let pause.item = false;




function keyStart(e)
{
    // // console.log(shiftx.item, shifty.item, currx.item, curry.item)
    key = e.keyCode;
    if (!pause.item && key == key_r) {
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
    }
    else if(!pause.item && key == key_i)
        shifty.item = Math.max(shifty.item - 1, -act_curry.item +1 )
    else if(!pause.item && key == key_j)
        shiftx.item = Math.max(shiftx.item - 1, -act_currx.item + 1)
    else if(!pause.item && key == key_k)
        shifty.item = Math.min(shifty.item + 1, yrectnum - act_curry.item - 2)
    else if(!pause.item && key == key_l)
        shiftx.item = Math.min(shiftx.item + 1, xrectnum - act_currx.item - 2)
    else if(!pause.item && key == key_h) {
        shifty.item = 0 
        shiftx.item = 0
    }
    else if(!pause.item && key == key_open && (chest_indices.includes(curr_player.item.y * xrectnum + curr_player.item.x) && !chests[chest_indices.indexOf(curr_player.item.y * xrectnum + curr_player.item.x)].opened))
    {
        // alert("Good");
        chests[chest_indices.indexOf(curr_player.item.y * xrectnum + curr_player.item.x)].Open();
        chests[chest_indices.indexOf(curr_player.item.y * xrectnum + curr_player.item.x)].listItems();
    }
    else if (!pause.item && key == keyone) {
        curr_player.item.in_combat = false;
        curr_player.item = players[0]
        ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
    }
    else if(!pause.item && key == keytwo) {
        curr_player.item.in_combat = false;
        curr_player.item = players[1]
        ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
    }
    else if(!pause.item && key == keythree) {
        curr_player.item.in_combat = false;
        curr_player.item = players[2]
        ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
    }
    else if(!pause.item && key == keyfour) {
        curr_player.item.in_combat = false;
        curr_player.item = players[3]
        ptr.item = curr_player.item.y * xrectnum + curr_player.item.x;
    }
    else if(!pause.item && key == key_v && curr_player.item.range_type == "xrange" && curr_player.item.in_combat)
    {
        curr_player.item.in_combat = false;
        console.log("HEREHRHERHERHEHR");
    }
    else if(!pause.item && key == key_n && !curr_player.item.turn_end)
    {
        if(curr_player.item.in_combat && curr_player.item.range_type == "xrange")
        {
            let x_indices = x_view_range(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.range);
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
                dealDamage(curr_player.item, monsters[monster_indices.indexOf(hit_indices[i])]);
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
                curr_player.item.turn_end = true;
            }
            curr_player.item.in_combat = false;
        }
        else if(curr_player.item.in_combat && curr_player.item.range_type == "regular") // Add getValid to check if a sqr is valid for attack
        {
            // Add dealDamage stuff
            
            // Add that if you missed then end combat early
            let hit = inRange(curr_player.item, ptr.item, xrectnum, game_maze, monster_indices);
            if(hit && monster_indices.includes(ptr.item))
            {
                dealDamage(curr_player.item, monsters[monster_indices.indexOf(ptr.item)]);
                if(monsters[monster_indices.indexOf(ptr.item)].health <= 0)
                {
                    app.stage.removeChild(monsters[monster_indices.indexOf(ptr.item)].rect);
                    monsters.splice(monster_indices.indexOf(ptr.item), 1);
                    monster_indices.splice(monster_indices.indexOf(ptr.item), 1);
                }
                curr_player.item.turn_end = true;
                curr_player.item.in_combat = false;
            }
            if(!hit) //This will also just run through the entire function so even if it hits the rigth functino will be carried out
            {
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
    else if(!pause.item && key == up && curr_player.item.in_combat && curr_player.item.range_type == "regular")
    {
        if(get_view_range(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.range, game_maze, curr_player.item, game_maze).includes(ptr.item - xrectnum))
        {
            ptr.item = ptr.item - xrectnum;
        }
    }
    else if(!pause.item && key == down && curr_player.item.in_combat && curr_player.item.range_type == "regular")
    {
        if(get_view_range(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.range, game_maze, curr_player.item, game_maze).includes(ptr.item + xrectnum))
        {
            ptr.item = ptr.item + xrectnum;
        }
    }
    else if(!pause.item && key == left && curr_player.item.in_combat && curr_player.item.range_type == "regular")
    {
        if(get_view_range(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.range, game_maze, curr_player.item, game_maze).includes(ptr.item - 1))
        {
            ptr.item--;
        }
    }
    else if(!pause.item && key == right && curr_player.item.in_combat && curr_player.item.range_type == "regular")
    {
        if(get_view_range(curr_player.item.x, curr_player.item.y, xrectnum, yrectnum, curr_player.item.range, game_maze, curr_player.item, game_maze).includes(ptr.item + 1))
        {
            ptr.item++;
        }
    }
    else if(!pause.item && key == key_p) //Turn over
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
    else if(!pause.item && !curr_player.item.in_combat && curr_player.item.health > 0 && seen_indices.item.includes(curr_player.item.x + curr_player.item.y*xrectnum) && curr_player.item.x - 1 >= 0 && (key == left || key == key_a) && !game_maze[curr_player.item.y * 2 * xrectnum + curr_player.item.x * 2 - 1].getWall() && curr_player.item.blks_moved != curr_player.item.speed && !checkPlayer(curr_player.item.y * xrectnum + curr_player.item.x - 1) && !curr_player.item.turn_end && !checkMonster(curr_player.item.y * xrectnum + curr_player.item.x - 1))
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
    else if(!pause.item && !curr_player.item.in_combat && curr_player.item.health > 0 && seen_indices.item.includes(curr_player.item.x + curr_player.item.y*xrectnum) && curr_player.item.y - 1 >= 0 && (key == up || key == key_w) && !game_maze[(curr_player.item.y - 1) * 2 * xrectnum + curr_player.item.x * 2].getWall() && curr_player.item.blks_moved != curr_player.item.speed && !checkPlayer(curr_player.item.y * xrectnum + curr_player.item.x - xrectnum) && !curr_player.item.turn_end && !checkMonster((curr_player.item.y * xrectnum + curr_player.item.x - xrectnum)))
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
    else if(!pause.item && !curr_player.item.in_combat && curr_player.item.health > 0 && seen_indices.item.includes(curr_player.item.x + curr_player.item.y*xrectnum) && curr_player.item.x + 1 < xrectnum && (key == right || key == key_d) && !game_maze[curr_player.item.y * 2 * xrectnum + curr_player.item.x * 2 + 1].getWall() && curr_player.item.blks_moved != curr_player.item.speed && !checkPlayer(curr_player.item.y * xrectnum + curr_player.item.x + 1) && !curr_player.item.turn_end && !checkMonster((curr_player.item.y * xrectnum + curr_player.item.x + 1)))
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
    else if(!pause.item && !curr_player.item.in_combat && curr_player.item.health > 0 && seen_indices.item.includes(curr_player.item.x + curr_player.item.y*xrectnum) && curry.item + 1 < yrectnum && (key == down || key == key_s) && !game_maze[(curr_player.item.y) * 2 * xrectnum + curr_player.item.x * 2].getWall() && curr_player.item.blks_moved != curr_player.item.speed && !checkPlayer(curr_player.item.y * xrectnum + curr_player.item.x + xrectnum) && !curr_player.item.turn_end && !checkMonster((curr_player.item.y * xrectnum + curr_player.item.x + xrectnum)))
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
    else if(key == key_esc && !pause.item)
    {
        //display screens
        pause.item = true;
        menu_container.visible = true
        console.log("GAME IS pause.itemD");
    }
    else if(key == key_esc && pause.item)
    {
        //escape display
        pause.item = false;
        menu_container.visible = false
        console.log("GAME IS UNpause.itemD");
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
    
    sight(game_map, game_maze, xrectnum, yrectnum, players, curr_player.item, monsters, ptr.item, size.item, currx.item, curry.item, chest_indices, chests, monster_indices, app);
    
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
    update_health_bars();
}