// HERE ARE THE IMPORTS FOR THE MAIN FILE
import { Player } from "./game_entities/player.mjs";
import { Monster } from "./game_entities/monster.mjs";
import { total_visible_indices, get_view_sqr, get_view_range } from "./methods/graphics/visibility.mjs";
import { print_walls } from "./bkgnd_objs/mazegen.mjs";
import { make_maze_dicts } from "./game_entities/game_AIs/path_finding_nodes.mjs";
import { init_bkgnd } from "./init.mjs";
import { sight } from "./methods/graphics/sight.mjs";
import { inRange } from "./methods/combat/inRangeFuncs.mjs";
import { x_view_range } from "./methods/combat/inRangeFuncs.mjs";
import { print_map } from "./bkgnd_objs/mapgen.mjs";
import { displayMap } from "./bkgnd_objs/mapgenV2.mjs";
import { genBiomes } from "./bkgnd_objs/mapgenV2.mjs";
import {key_setup, setPlays} from "./methods/key_bind.mjs"
import { Wrapper } from "./methods/datatypes.mjs";
import { init_pause_menu, init_health_bars } from "./methods/displays/side_screen.mjs";
// /Users/mayur/Documents/Github/textures

// HERE WE LOAD THE TEXTURE REQUIRED FOR THE CODE TO RUN
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/ShadowLands2.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/Desert2.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/GrassyPlains.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/Lava.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/MuddyRainforest2.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/PoisonOoze.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/RockyArea.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/SnowyIce.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/Waves2.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/Dungeon.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/blank.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/RoomFloor.png');


// HERE WE CREATE OUR ACTUAL MAP FOR THE GAME
export const app = new PIXI.Application();
export let size = new Wrapper(40);
export const tot_width = window.innerWidth
export const tot_height = window.innerHeight
await app.init({ width: tot_width, height: tot_height });
document.body.appendChild(app.canvas);

export const menu_container = init_pause_menu(app)
export const pause = new Wrapper(false)

export let xrectnum = 20;
export let yrectnum = 20;
let output = init_bkgnd(xrectnum, yrectnum);
export let game_map = output[0];
export let game_maze = output[1];
let rooms = output[2];
export let chests = output[3];
export let ptr = new Wrapper(0);
let monster_num = 10;
// print_walls(game_maze, xrectnum, yrectnum)

game_maze[0].exists = false;
game_maze[1].exists = false;
game_maze[2].exists = false;
game_maze[2 * xrectnum + 1].exists = false;

export const maze_dicter = make_maze_dicts(game_maze, xrectnum, yrectnum, 5)
// (above 4 lineS are needed for a MAZE)


export let chest_indices = [];

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


// HERE WE CREATE THE PLAYERS AND THE MONSTERS FOR THE GAME LEVEL
// need to modify the players, player_inds, seen_indices.item, and maybe the monsters after a key as a result
let tier = 4;
export let players = new Array(4);
export let monsters = new Array(monster_num);
export let monster_indices = new Array(monsters.length);
export let currx = new Wrapper(0);
export let curry = new Wrapper(0);
export let act_currx = new Wrapper(0);
export let act_curry = new Wrapper(0);
export let shiftx = new Wrapper(0);
export let shifty = new Wrapper(0);

for(let i = 0; i < monsters.length;i++)
{
    // console.log((i % 5) + 1)
    monsters[i] = new Monster(5, size.item, size.item, xrectnum, yrectnum, "patrol");
}

for(let i = 0;i < monsters.length;i++)
{
    monster_indices[i] = monsters[i].y * xrectnum + monsters[i].x;
}
players[0] = new Player(0, size.item, size.item, 3, 'vivek');
players[1] = new Player(1, size.item, size.item, 1, 'jane');
// players[1].y = 8;
players[2] = new Player(2, size.item, size.item, 4, 'nikki');
// players[2].y = 5;
// players[2].x = 3;
players[3] = new Player(3, size.item, size.item, 2, 'mayur');
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

export const tot_player_health = init_health_bars(app, players)



export let curr_player = new Wrapper(players[0])
// export let curr_index = 0

export let play_inds = new Array(players.length);





setPlays();
export let seen_indices = new Wrapper(total_visible_indices(players, xrectnum, yrectnum));

key_setup()

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
currx.item = Math.floor((xmax + xmin)/2)
curry.item = Math.floor( (ymax + ymin)/2 )
act_currx.item = currx.item
act_curry.item = curry.item


for (let t = 0; t < players.length; t++) {
    players[t].drawMe(size.item, size.item, currx.item, curry.item)
    // // console.log(players[t].x, players[t].y)
    app.stage.addChild(players[t].bkg_rect)
    app.stage.addChild(players[t].rect)
}

// for (let t = 0; t < monsters.length; t++) {
//     monsters[t].drawMe(size.item, size.item, currx.item, curry.item)
//     // // console.log(players[t].x, players[t].y)
//     app.stage.addChild(monsters[t].rect)
// }

sight(game_map, game_maze, xrectnum, yrectnum, players, curr_player.item, monsters, ptr.item, size.item, currx.item, curry.item, chest_indices, chests, monster_indices, app);


app.stage.addChild(tot_player_health[0])
app.stage.addChild(menu_container)
menu_container.visible = pause.item
console.log(monsters)