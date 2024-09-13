import { Player } from "./game_objs/player.mjs";
import { Monster } from "./game_objs/monster.mjs";
import { total_visible_indices, get_view_sqr, get_view_range } from "./methods/visibility.mjs";
import { print_walls } from "./bkgnd_objs/mazegen.mjs";
import { make_maze_dicts } from "./methods/path_finding_nodes.mjs";
import { init_bkgnd } from "./init.mjs";

await PIXI.Assets.load('../Textures/bkgnd/ShadowLands2.png');
await PIXI.Assets.load('../Textures/bkgnd/Desert2.png');
await PIXI.Assets.load('../Textures/bkgnd/GrassyPlains.png');
await PIXI.Assets.load('../Textures/bkgnd/Lava.png');
await PIXI.Assets.load('../Textures/bkgnd/MuddyRainforest2.png');
await PIXI.Assets.load('../Textures/bkgnd/PoisonOoze.png');
await PIXI.Assets.load('../Textures/bkgnd/RockyArea.png');
await PIXI.Assets.load('../Textures/bkgnd/SnowyIce.png');
await PIXI.Assets.load('../Textures/bkgnd/Waves2.png');
await PIXI.Assets.load('../Textures/bkgnd/Dungeon.png');
await PIXI.Assets.load('../Textures/bkgnd/RoomFloor.png');


const app = new PIXI.Application();
let size = 40;
const tot_width = 1000
const tot_height = 800
await app.init({ width: tot_width, height: tot_height });
document.body.appendChild(app.canvas);
let xrectnum = 20;
let yrectnum = 20;
let output = init_bkgnd(xrectnum, yrectnum);
let game_map = output[0];
let game_maze = output[1];
let rooms = output[2];
let chests = output[3];
let ptr = 0;
let monster_num = 15;
print_walls(game_maze, xrectnum, yrectnum)
game_maze[0].exists = false;
game_maze[1].exists = false;
game_maze[2].exists = false;
game_maze[2 * xrectnum + 1].exists = false;
game_map[0].biome = 0;
game_map[1].biome = 0;
game_map[xrectnum].biome = 0;
game_map[xrectnum + 1].biome = 0;

// choose odd numbers for the sectors or they will be on the edge of the sector
let dicts = make_maze_dicts(game_maze, xrectnum, yrectnum, 7)
console.log(dicts[0])
console.log(dicts[1])


// console.log("There are this many chests");
// console.log(chests.length);
// console.log("This is the x and y of all the chests");
// for(let i = 0;i < chests.length;i++)
// {
//     console.log("New");
//     console.log(chests[i].x);
//     console.log(chests[i].y);
// }
let chest_indices = [];
// console.log(chests.length);
// for(let i = 0;i < chests.length;i++)
// {
//     console.log(chests[i].index);
//     console.log(i);
// }
for(let i = 0;i < chests.length;i++)
{
    chest_indices[i] = chests[i].index;
}

function dist(x1, y1, x2, y2)
{
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}
function takeDamage(target, damage)
{
    target.health -= damage;
    if(target.health - damage <= 0)
    {
        //Somehow destroy target
    }
}
function dealDamage(attacker, target)
{
    if(dist(attacker.x, attacker.y, target.x, target.y) <= attacker.range)
    {
        attacker.health += 0.2 * attacker.strength;
        takeDamage(target, attacker.strength);
    }
}
// const container = new PIXI.Container();
export let vis = new PIXI.Container();
export let walls = new PIXI.Container();
vis.x = tot_width/2;
vis.y = tot_height/2;
walls.x = tot_width/2;
walls.y = tot_height/2;
app.stage.addChild(vis);
app.stage.addChild(walls);


let tier = 4;
let players = new Array(4);
let monsters = new Array(monster_num);
let monster_indices = new Array(monsters.length);
let currx = 0;
let curry = 0;
let act_currx = 0;
let act_curry = 0;
let shiftx = 0
let shifty = 0

for(let i = 0; i < monster_num;i++)
{
    console.log((i % 5) + 1)
    monsters[i] = new Monster((i % 5) + 1, size, size, xrectnum, yrectnum);
}
players[0] = new Player(0, size, size, 2);
players[1] = new Player(1, size, size, 5);
// players[1].y = 8;
players[2] = new Player(2, size, size, 3);
// players[2].y = 5;
// players[2].x = 3;
players[3] = new Player(3, size, size, 1);
// players[3].y = 11;

players[1].x = 1;
players[2].y = 1;
players[3].x = 1;
players[3].y = 1;

players[0].speed = 100;
players[1].speed = 100;
players[2].speed = 100;
players[3].speed = 100;

let curr_player = players[0]

for(let i = 0;i < monsters.length;i++)
{
    monster_indices[i] = monsters[i].y * xrectnum + monsters[i].x;
}

function printMonsterLoc()
{
    for(let i = 0;i < monster_indices.length;i++)
    {
        if(monster_indices[i] < 35)
        {
            console.log(monster_indices[i]);
            console.log(monsters[i].health);
        }
    }
}
printMonsterLoc();

// Sight uses visiblity code to show the map tiles and maze tiles that are visible
function sight()
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
    let range = get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range)
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
        if(map_indexer < xrectnum) {
            let upwall = PIXI.Sprite.from('../Textures/bkgnd/WallsHorizontal.png');
            upwall.height = 0.3 * size;
            upwall.width = size;
            upwall.x = (map_indexer - currx) * size;
            upwall.y = (- curry) * size - 0.15*size;
            walls.addChild(upwall)
        }
        if(map_indexer % xrectnum == 0) {
            let leftwall = PIXI.Sprite.from('../Textures/bkgnd/WallsVertical.png');
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
        if(map_indices.includes(monster_indices[i]))
        {
            console.log(monster_indices[i], i)
            monsters[i].drawMe(size, size, currx, curry);
            app.stage.addChild(monsters[i].rect)
            // console.log("HERE");
            // console.log(chests[i].x);
            // console.log(chests[i].y);
        }
    }
    if(curr_player.in_combat)
    {
        // console.log(game_map[range[0]].sprite.saturation)
        for(let i = 0;i < range.length;i++)
        {
            console.log(game_map[range[i]])
            game_map[range[i]].sprite.alpha = 0.5;
            game_map[range[i]].sprite.tint = 0xFFBB88;
            // game_map[range[i]].sprite.saturation = .1;
        }
        game_map[ptr].sprite.alpha = 0
        game_map[ptr].sprite.tint = 0xFFFFFF;
    }
}

let play_inds = new Array(players.length);
function setPlays()
{
    for(let i = 0;i < players.length;i++)
    {
        play_inds[i] = players[i].y * xrectnum + players[i].x;
    }
}

setPlays();

function inRange(attacker, target_pos)
{
    if(!monster_indices.includes(target_pos))
        return false;
    let target = monsters[monster_indices.indexOf(target_pos)];
    let atk_pos = attacker.y * xrectnum + attacker.x;
    if(target_pos == atk_pos)
        return false;
    if(attacker.atk_str)
    {
        if(Math.abs(atk_pos - target_pos) % xrectnum != 0 && ~~((atk_pos) / xrectnum) != ~~(target_pos / xrectnum))
            return false;
        let dir;
        if((atk_pos - target_pos) % xrectnum == 0 && atk_pos - target_pos > 0)
            dir = 0; // dir is up
        else if((atk_pos - target_pos) % xrectnum == 0 && atk_pos - target_pos < 0)
            dir = 1; // dir is down
        else if(atk_pos - target_pos < 0 && ~~((atk_pos) / xrectnum) == ~~(target_pos / xrectnum))
            dir = 2; // dir is right
        else if(atk_pos - target_pos > 0 && ~~((atk_pos) / xrectnum) == ~~(target_pos / xrectnum))
            dir = 3; // dir is left
        else
        {
            console.log("OH NO!")
            console.log(atk_pos + " and " + target_pos);
        }
        let pos;
        switch(dir)
        {
        case 0:
            pos = atk_pos - xrectnum;
            while(pos != target_pos)
            {
                if(game_maze[2 * pos].exists)
                    return false;
                pos -= xrectnum
            }
            if(game_maze[2 * target_pos].exists)
                return false;
            break;
        case 1:
            pos = atk_pos;
            while(pos != target_pos)
            {
                if(game_maze[2 * pos].exists)
                    return false;
                pos += xrectnum
            }
            break;
        case 2:
            pos = atk_pos;
            while(pos != target_pos)
            {
                if(game_maze[2 * pos + 1].exists)
                    return false;
                pos++;
            }
            break;
        case 3:
            pos = atk_pos;
            while(pos != target_pos)
            {
                if(2 * pos - 1 > 0)
                {
                    if(game_maze[2 * pos - 1].exists)
                        return false;
                    pos--;
                    break;
                }
            }
            break;
        }
        // console.log(dir);
        // dealDamage(attacker, monsters[monster_indices.indexOf(target_pos)]);
        // console.log(monsters[monster_indices.indexOf(target_pos)].health);
        console.log("HIT");
        return true;
    }
}

document.addEventListener('keydown', keyStart)

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
let seen_indices;



seen_indices = total_visible_indices(players, xrectnum, yrectnum);
let xmin = xrectnum;
let xmax = 0;
let ymin = xrectnum;
let ymax = 0;
for(let i = 0;i < seen_indices.length;i++)
{
    // console.log(xmax, xmin, ymax, ymin)
    if(seen_indices[i] % xrectnum > xmax)
        xmax = seen_indices[i] % xrectnum
    if(seen_indices[i] % xrectnum < xmin)
        xmin = seen_indices[i] % xrectnum
    if(~~(seen_indices[i] / xrectnum) > ymax)
        ymax = ~~(seen_indices[i] / xrectnum)
    if(~~(seen_indices[i] / xrectnum) < ymin)
        ymin = ~~(seen_indices[i] / xrectnum)
}
// console.log("*****")
// console.log(xmax, xmin, ymax, ymin)
currx = Math.floor((xmax + xmin)/2)
curry = Math.floor( (ymax + ymin)/2 )
act_currx = currx
act_curry = curry
// console.log("-----------------")
// console.log(currx,curry)
sight();

for (let t = 0; t < players.length; t++) {
    players[t].drawMe(size, size, currx, curry)
    // console.log(players[t].x, players[t].y)
    app.stage.addChild(players[t].rect)
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
    for(let i = 0;i < players.length;i++)
    {
        if(players[i].y * xrectnum + players[i].x == map_ind)
        {
            return true;
        }
    }
    return false;
}

function keyStart(e)
{
    // console.log(shiftx, shifty, currx, curry)
    key = e.keyCode;
    if (key == key_r) {
        if (size > 20)
            size = Math.floor(size / 1.2)
        else
            size = 140
        // console.log(size)
        for (let t = 0; t < players.length; t++) {
            players[t].resize(size, size)
        }
    }
    else if(key == key_i)
        shifty = Math.max(shifty - 1, -act_curry +1 )
    else if(key == key_j)
        shiftx = Math.max(shiftx - 1, -act_currx + 1)
    else if(key == key_k)
        shifty = Math.min(shifty + 1, yrectnum - act_curry - 2)
    else if(key == key_l)
        shiftx = Math.min(shiftx + 1, xrectnum - act_currx - 2)
    else if(key == key_h) {
        shifty = 0 
        shiftx = 0
    }
    else if(key == key_open && (chest_indices.includes(curr_player.y * xrectnum + curr_player.x) && !chests[chest_indices.indexOf(curr_player.y * xrectnum + curr_player.x)].opened))
    {
        // alert("Good");
        chests[chest_indices.indexOf(curr_player.y * xrectnum + curr_player.x)].Open();
        chests[chest_indices.indexOf(curr_player.y * xrectnum + curr_player.x)].listItems();
    }
    else if (key == keyone) {
        curr_player.in_combat = false;
        curr_player = players[0]
        ptr = curr_player.y * xrectnum + curr_player.x;
    }
    else if(key == keytwo) {
        curr_player.in_combat = false;
        curr_player = players[1]
        ptr = curr_player.y * xrectnum + curr_player.x;
    }
    else if(key == keythree) {
        curr_player.in_combat = false;
        curr_player = players[2]
        ptr = curr_player.y * xrectnum + curr_player.x;
    }
    else if(key == keyfour) {
        curr_player.in_combat = false;
        curr_player = players[3]
        ptr = curr_player.y * xrectnum + curr_player.x;
    }
    else if(key == key_n && !curr_player.turn_end)
    {
        if(curr_player.in_combat) // Add getValid to check if a sqr is valid for attack
        {
            // Add dealDamage stuff
            
            // Add that if you missed then end combat early
            let hit = inRange(curr_player, ptr);
            if(hit)
            {
                dealDamage(curr_player, ptr);
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
    else if(key == up && curr_player.in_combat)
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range).includes(ptr - xrectnum))
        {
            ptr = ptr - xrectnum;
        }
    }
    else if(key == down && curr_player.in_combat)
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range).includes(ptr + xrectnum))
        {
            ptr = ptr + xrectnum;
        }
    }
    else if(key == left && curr_player.in_combat)
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range).includes(ptr - 1))
        {
            ptr--;
        }
    }
    else if(key == right && curr_player.in_combat)
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range).includes(ptr + 1))
        {
            ptr++;
        }
    }
    else if(key == key_p) //Turn over
    {
        console.log("Turn over");
        // console.log(players[0].blks_moved);
        for(let n = 0;n < 4;n++)
        {
            players[n].blks_moved = 0;
            players[n].turn_end = false;
        }
        curr_player.in_combat = false;
        //Call monster stuff here or somewhere else
        return;
    }
    else if(seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.x - 1 >= 0 && (key == left || key == key_a) && !game_maze[curr_player.y * 2 * xrectnum + curr_player.x * 2 - 1].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x - 1) && !curr_player.turn_end)
    {
        curr_player.x--;
        curr_player.blks_moved++;
        shifty = Math.max(shifty, -curry)
        shiftx = Math.max(shiftx, -currx)
        shifty = Math.min(shifty, yrectnum - curry - 2)
        shiftx = Math.min(shiftx, xrectnum - curry - 2)
        ptr = curr_player.y * xrectnum + curr_player.x;
        // console.log(ptr);
    }
    else if(seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.y - 1 >= 0 && (key == up || key == key_w) && !game_maze[(curr_player.y - 1) * 2 * xrectnum + curr_player.x * 2].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x - xrectnum) && !curr_player.turn_end)
    {
        curr_player.y--;
        curr_player.blks_moved++;
        shifty = Math.max(shifty, -curry)
        shiftx = Math.max(shiftx, -currx)
        shifty = Math.min(shifty, yrectnum - curry - 2)
        shiftx = Math.min(shiftx, xrectnum - curry - 2)
        ptr = curr_player.y * xrectnum + curr_player.x;
        // console.log(ptr);
    }
    else if(seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.x + 1 < xrectnum && (key == right || key == key_d) && !game_maze[curr_player.y * 2 * xrectnum + curr_player.x * 2 + 1].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x + 1) && !curr_player.turn_end)
    {
        curr_player.x++;
        curr_player.blks_moved++;
        shifty = Math.max(shifty, -curry)
        shiftx = Math.max(shiftx, -currx)
        shifty = Math.min(shifty, yrectnum - curry - 2)
        shiftx = Math.min(shiftx, xrectnum - curry - 2)
        ptr = curr_player.y * xrectnum + curr_player.x;
        // console.log(ptr);
    }
    else if(seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curry + 1 < yrectnum && (key == down || key == key_s) && !game_maze[(curr_player.y) * 2 * xrectnum + curr_player.x * 2].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x + xrectnum) && !curr_player.turn_end)
    {
        curr_player.y++;
        curr_player.blks_moved++;
        shifty = Math.max(shifty, -curry)
        shiftx = Math.max(shiftx, -currx)
        shifty = Math.min(shifty, yrectnum - curry - 2)
        shiftx = Math.min(shiftx, xrectnum - curry - 2)
        ptr = curr_player.y * xrectnum + curr_player.x;
        // console.log(ptr);
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
        // console.log(xmax, xmin, ymax, ymin)
        if(seen_indices[i] % xrectnum > xmax)
            xmax = seen_indices[i] % xrectnum
        if(seen_indices[i] % xrectnum < xmin)
            xmin = seen_indices[i] % xrectnum
        if(~~(seen_indices[i] / xrectnum) > ymax)
            ymax = ~~(seen_indices[i] / xrectnum)
        if(~~(seen_indices[i] / xrectnum) < ymin)
            ymin = ~~(seen_indices[i] / xrectnum)
    }
    // console.log("*****")
    // console.log(xmax, xmin, ymax, ymin)
    act_currx = Math.floor((xmax + xmin)/2)
    act_curry = Math.floor( (ymax + ymin)/2 )
    
    currx = act_currx + shiftx
    curry = act_curry + shifty
    // console.log("-----------------")
// console.log(currx,curry)
    // console.log(currx, curry)
    sight();
    for (let t = 0; t < players.length; t++) {
        players[t].drawMe(size, size, currx, curry)
        // console.log(players[t])
        // app.stage.addChild(players[t].rect)
    }
    // console.log(ptr);
    // console.log(get_view_sqr(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.vis_tier));
    // console.log(game_map[ptr].biome);
    setPlays();
}
