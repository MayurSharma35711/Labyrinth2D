import { map_init } from "./bkgnd_objs/mapgen.mjs";
import { maze_init2 } from "./bkgnd_objs/mazegen.mjs";
import { print_map } from "./bkgnd_objs/mapgen.mjs";
import { Player } from "./game_objs/player.mjs";
import { total_visible_indices } from "./methods/visibility.mjs";
import { print_walls } from "./bkgnd_objs/mazegen.mjs";
import { chest, chest_gen } from "./game_objs/equipment.mjs";
import { multiRooms } from "./methods/rooms.mjs";
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
const size = 40;
const tot_width = 1000
const tot_height = 800
await app.init({ width: tot_width, height: tot_height });
document.body.appendChild(app.canvas);
let xrectnum = 40;
let yrectnum = 40;
let game_map = map_init(xrectnum, yrectnum);
let game_maze = maze_init2(xrectnum, yrectnum);
let output = multiRooms(xrectnum, yrectnum, 7, 12, game_maze, game_map, 6);
game_maze = output[0]
game_map = output[1]
let rooms = output[2]
print_walls(game_maze, xrectnum, yrectnum);
let chests = chest_gen(40, game_maze, xrectnum, yrectnum);
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
let currx = 0;
let curry = 0;
players[0] = new Player(0, size, size);
players[1] = new Player(1, size, size);
// players[1].y = 8;
players[1].vis_tier = 4;
players[2] = new Player(2, size, size);
// players[2].y = 5;
// players[2].x = 3;
players[2].vis_tier = 3;
players[3] = new Player(3, size, size);
// players[3].y = 11;
players[3].vis_tier = 1;

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
    for(let i = 0;i < map_indices.length;i++)
    {
        // console.log(game_map[map_indices[i]].biome)
        game_map[map_indices[i]].drawMe(size, size, currx, curry);
    }
    for(let i = 0;i < map_indices.length;i++)
    {
        let map_indexer = map_indices[i]
        if(map_indexer < xrectnum) {
            let upwall = PIXI.Sprite.from('../Textures/bkgnd/WallsHorizontal2.png');
            upwall.height = 0.3 * size;
            upwall.width = size;
            upwall.x = (map_indexer - currx) * size;
            upwall.y = (- curry) * size - 0.15*size;
            walls.addChild(upwall)
        }
        if(map_indexer % xrectnum == 0) {
            let leftwall = PIXI.Sprite.from('../Textures/bkgnd/WallsVertical2.png');
            leftwall.height = size;
            leftwall.width = 0.3 * size;
            leftwall.x = (0 - currx) * size - 0.15*size;
            leftwall.y = (map_indexer / xrectnum - curry) * size;
            walls.addChild(leftwall)
        }
        if(!map_indices.includes(map_indexer - xrectnum) && map_indexer - xrectnum >= 0) {
            game_maze[2 * map_indices[i] - 2*xrectnum].drawMe(size, size, currx, curry);
        }
        if(!map_indices.includes(map_indexer - 1) && map_indexer % xrectnum > 0) {
            game_maze[2 * map_indices[i] - 1].drawMe(size, size, currx, curry);
        }
        game_maze[2 * map_indices[i]].drawMe(size, size, currx, curry);
        game_maze[2 * map_indices[i] + 1].drawMe(size, size, currx, curry);
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
}

document.addEventListener('keydown', keyStart)

let key
let keyone = 49
let keytwo = 50
let keythree = 51
let keyfour = 52
let left = 37;
let up = 38;
let right = 39;
let down = 40;
let key_open = 69;
let curr_player = players[0]
let seen_indices;

for(let i = 0;i < players.length;i++)
{
    currx += players[i].x;
    curry += players[i].y;
}
currx /= players.length;
curry /= players.length;

seen_indices = total_visible_indices(players, xrectnum, yrectnum);
sight();

for (let t = 0; t < players.length; t++) {
    players[t].drawMe(size, size, currx, curry)
    // console.log(players[t].x, players[t].y)
    app.stage.addChild(players[t].rect)
}


function keyStart(e)
{
    // alert("Here");
    key = e.keyCode;
    if(key == key_open && (chest_indices.includes(curr_player.y * xrectnum + curr_player.x) && !chests[chest_indices.indexOf(curr_player.y * xrectnum + curr_player.x)].opened))
    {
        // alert("Good");
        chests[chest_indices.indexOf(curr_player.y * xrectnum + curr_player.x)].Open();
        chests[chest_indices.indexOf(curr_player.y * xrectnum + curr_player.x)].listItems();
    }
    if (key == keyone) {
        curr_player = players[0]
    }
    else if(key == keytwo) {
        curr_player = players[1]
    }
    else if(key == keythree) {
        curr_player = players[2]
    }
    else if(key == keyfour) {
        curr_player = players[3]
    }
    else if(seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.x - 1 >= 0 && key == left && !game_maze[curr_player.y * 2 * xrectnum + curr_player.x * 2 - 1].getWall())
    {
        curr_player.x--;
    }
    else if(seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.y - 1 >= 0 && key == up && !game_maze[(curr_player.y - 1) * 2 * xrectnum + curr_player.x * 2].getWall())
    {
        curr_player.y--;
    }
    else if(seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curr_player.x + 1 < xrectnum && key == right && !game_maze[curr_player.y * 2 * xrectnum + curr_player.x * 2 + 1].getWall())
    {
        curr_player.x++;
    }
    else if(seen_indices.includes(curr_player.x + curr_player.y*xrectnum) && curry + 1 < yrectnum && key == down && !game_maze[(curr_player.y) * 2 * xrectnum + curr_player.x * 2].getWall())
    {
        curr_player.y++;
    }
    else
        return null

    let counter = 0
    seen_indices = total_visible_indices(players, xrectnum, yrectnum);
    currx = 0
    curry = 0
    for(let i = 0; i < players.length; i++)
    {
        if(seen_indices.includes(players[i].x + players[i].y*xrectnum)) {
            counter = counter + 1
            currx += players[i].x;
            curry += players[i].y;
        }
    }
    if (counter == 0)
        alert('wtf')
    currx = Math.floor(currx / counter);
    curry = Math.floor(curry / counter);
    // console.log(currx, curry)
    sight();
    for (let t = 0; t < players.length; t++) {
        players[t].drawMe(size, size, currx, curry)
        // console.log(players[t])
        // app.stage.addChild(players[t].rect)
    }
}
