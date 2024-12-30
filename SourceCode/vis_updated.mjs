import { Player } from "./game_objs/player.mjs";
import { Monster } from "./game_objs/monster.mjs";
import { total_visible_indices, get_view_sqr, get_view_range } from "./methods/graphics/visibility.mjs";
import { print_walls } from "./bkgnd_objs/mazegen.mjs";
import { make_maze_dicts } from "./methods/monster/path_finding_nodes.mjs";
import { init_bkgnd } from "./init.mjs";
import { sight } from "./methods/graphics/sight.mjs";
import { inRange } from "./methods/combat/inRange.mjs";
import { x_view_range } from "./methods/combat/xRange.mjs";

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
// console.log(dicts[0])
// console.log(dicts[1])


// console.log("There are this many chests");
// console.log(chests.length);
// console.log("This is the x and y of all the chests");
// for(let i = 0;i < chests.length;i++)
// {
//     // console.log("New");
//     // console.log(chests[i].x);
//     // console.log(chests[i].y);
// }
let chest_indices = [];
// // console.log(chests.length);
// for(let i = 0;i < chests.length;i++)
// {
//     // console.log(chests[i].index);
//     // console.log(i);
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
    console.log(target);
    attacker.health += 0.2 * attacker.strength;
    takeDamage(target, attacker.strength);
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
    // console.log((i % 5) + 1)
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

players[1].range_type = "xrange";
players[1].range = 7;

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

let play_inds = new Array(players.length);
function setPlays()
{
    for(let i = 0;i < players.length;i++)
    {
        play_inds[i] = players[i].y * xrectnum + players[i].x;
    }
}

setPlays();

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
let key_v = 86;
let seen_indices;



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
currx = Math.floor((xmax + xmin)/2)
curry = Math.floor( (ymax + ymin)/2 )
act_currx = currx
act_curry = curry
// // console.log("-----------------")
// // console.log(currx,curry)
sight(game_map, game_maze, xrectnum, yrectnum, players, curr_player, monsters, ptr, size, currx, curry, chest_indices, chests, monster_indices, app);

for (let t = 0; t < players.length; t++) {
    players[t].drawMe(size, size, currx, curry)
    // // console.log(players[t].x, players[t].y)
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

function keyStart(e)
{
    // // console.log(shiftx, shifty, currx, curry)
    key = e.keyCode;
    if (key == key_r) {
        if (size > 20)
            size = Math.floor(size / 1.2)
        else
            size = 140
        // // console.log(size)
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
    else if(key == key_v && curr_player.range_type == "xrange" && curr_player.in_combat)
    {
        curr_player.in_combat = false;
        console.log("HEREHRHERHERHEHR");
    }
    else if(key == key_n && !curr_player.turn_end)
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
            }
            
            if(hit)
            {
                console.log("HITITITITITITITIT");
                curr_player.turn_end = true;
                curr_player.in_combat = false;
            }
        }
        else if(curr_player.in_combat && curr_player.range_type == "regular") // Add getValid to check if a sqr is valid for attack
        {
            // Add dealDamage stuff
            
            // Add that if you missed then end combat early
            let hit = inRange(curr_player, ptr, xrectnum, game_maze, monster_indices);
            if(hit && monster_indices.includes(ptr))
            {
                dealDamage(curr_player, monsters[monster_indices.indexOf(ptr)]);
                curr_player.turn_end = false;
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
    else if(key == up && curr_player.in_combat && curr_player.range_type == "regular")
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range, game_maze, curr_player, game_maze).includes(ptr - xrectnum))
        {
            ptr = ptr - xrectnum;
        }
    }
    else if(key == down && curr_player.in_combat && curr_player.range_type == "regular")
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range, game_maze, curr_player, game_maze).includes(ptr + xrectnum))
        {
            ptr = ptr + xrectnum;
        }
    }
    else if(key == left && curr_player.in_combat && curr_player.range_type == "regular")
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range, game_maze, curr_player, game_maze).includes(ptr - 1))
        {
            ptr--;
        }
    }
    else if(key == right && curr_player.in_combat && curr_player.range_type == "regular")
    {
        if(get_view_range(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.range, game_maze, curr_player, game_maze).includes(ptr + 1))
        {
            ptr++;
        }
    }
    else if(key == key_p) //Turn over
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
    else if(!curr_player.in_combat && seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.x - 1 >= 0 && (key == left || key == key_a) && !game_maze[curr_player.y * 2 * xrectnum + curr_player.x * 2 - 1].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x - 1) && !curr_player.turn_end)
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
    else if(!curr_player.in_combat && seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.y - 1 >= 0 && (key == up || key == key_w) && !game_maze[(curr_player.y - 1) * 2 * xrectnum + curr_player.x * 2].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x - xrectnum) && !curr_player.turn_end)
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
    else if(!curr_player.in_combat && seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.x + 1 < xrectnum && (key == right || key == key_d) && !game_maze[curr_player.y * 2 * xrectnum + curr_player.x * 2 + 1].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x + 1) && !curr_player.turn_end)
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
    else if(!curr_player.in_combat && seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curry + 1 < yrectnum && (key == down || key == key_s) && !game_maze[(curr_player.y) * 2 * xrectnum + curr_player.x * 2].getWall() && curr_player.blks_moved != curr_player.speed && !checkPlayer(curr_player.y * xrectnum + curr_player.x + xrectnum) && !curr_player.turn_end)
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