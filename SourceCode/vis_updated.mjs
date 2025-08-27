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
import { init_pause_menu, init_all_player_cards } from "./methods/displays/side_screen.mjs";
import { MonsterSpawner } from "./game_entities/others.mjs";
import { create_inventory_screen } from "./methods/displays/inventory.mjs";
import { Area, Level_Door } from "./bkgnd_objs/area.mjs";
// /Users/mayur/Documents/Github/textures

// // HERE WE LOAD THE TEXTURE REQUIRED FOR THE CODE TO RUN
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/ShadowLands2.png');
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/Desert2.png');
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/GrassyPlains.png');
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/Lava.png');
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/MuddyRainforest2.png');
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/PoisonOoze.png');
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/RockyArea.png');
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/SnowyIce.png');
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/Waves2.png');
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/Dungeon.png');
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/blank.png');
// await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/bkgnd/RoomFloor.png');


// HERE WE CREATE OUR ACTUAL MAP FOR THE GAME
export const app = new PIXI.Application();
export let size = new Wrapper(80);
export const tot_width = new Wrapper(window.innerWidth)
export const tot_height = new Wrapper(window.innerHeight)
export const cutoff_y = new Wrapper(tot_height.item / 5)

await app.init({ width: tot_width.item, height: tot_height.item });
document.body.appendChild(app.canvas);

// window.addEventListener('resize', resize_func);
// function resize_func() {
export const curr_player_index = new Wrapper(0)

// }
function resize_func() {
    cutoff_y.item = window.innerHeight * (cutoff_y.item / tot_height.item)
    tot_width.item = window.innerWidth
    tot_height.item = window.innerHeight
    // console.log(tot_width.item , tot_height.item, currx, curry )
    app.renderer.resize(window.innerWidth, window.innerHeight)
    app.stage.removeChildren()
    // app.stage.removeChild(walls)


    vis.x = tot_width.item/2;
    vis.y = tot_height.item/2  - cutoff_y.item / 2;
    walls.x = tot_width.item/2;
    walls.y = tot_height.item/2  - cutoff_y.item / 2;

    app.stage.addChild(vis);
    app.stage.addChild(walls);

    
    tot_cards.item = init_all_player_cards(players, tot_width.item / 4, tot_height.item * 4 / 5 + size.item * 3/10, tot_width.item / 8,  tot_height.item / 5 - size.item * 4/10 - 10)

    app.stage.addChild(tot_cards.item[0])
    inventory_screen.item = create_inventory_screen()
    
    inventory_screen.item.visible = inventory.item
    

    sight(game_map.item, game_maze.item, xrectnum, yrectnum, cutoff_y, tot_height, players, curr_player.item, monsters, ptr.item, size.item, currx.item, curry.item, chest_indices, chests, monster_indices, monster_spawns, monster_spawn_indices, current_area.item.is_start_level, app);
    for (let t = 0; t < players.length; t++) {
        players[t].drawMe(size.item, size.item, currx.item, curry.item)
        // // console.log(players[t].x, players[t].y)
        app.stage.addChild(players[t].bkg_rect)
        // app.stage.addChild(players[t].rect)
        app.stage.addChild(players[t].sprite)
    }
    app.stage.addChild(inventory_screen.item)
    app.stage.addChild(menu_container)
    
}

window.onresize = resize_func;



// window.addEventListener('resize', resize_screen);
// $(window).resize(function() {
//     console.log("here")
//     tot_width.item = window.innerWidth
//     tot_height.item = window.innerHeight
// });
// function resize_screen() {
//     console.log("here")
//     tot_width.item = window.innerWidth
//     tot_height.item = window.innerHeight
// }




export const menu_container = init_pause_menu(app)
export const pause = new Wrapper(false)

export const pop_up = new Wrapper(false)
export const pop_up_bubble = new Wrapper(false)

export const selector = new Wrapper(false)
export const selector_bubble = new Wrapper(false)

export let xrectnum = 20;
export let yrectnum = 20;

const first_maze = new Area("maze1", xrectnum, yrectnum, "m", true)
const first_dungeon = new Area("dung1", xrectnum, yrectnum, "d", false, 10, 2)
const first_hall = new Area("hall1", xrectnum, yrectnum, "h", false, 9, 1)

const door1 = new Level_Door("door1", first_maze, first_hall, [4,8], [0,0], [4 + 8 *20, 3 + 8 *20, 4 + 7 *20, 3 + 7 *20], [0, 1, 20, 21])
const door2 = new Level_Door("door2", first_maze, first_hall, [10,7], [0,0], [10 + 7 *20, 11 + 7 *20, 10 + 6 *20, 11 + 6 *20], [0, 1, 20, 21])
const door3 = new Level_Door("door3", first_maze, first_dungeon, [17, 14], [0,0], [0, 1, 20, 21], [0, 1, 20, 21])
const door4 = new Level_Door("door4", first_maze, first_dungeon, [14, 17], [14 + 17 *20, 13 + 17 *20, 14 + 16 *20, 13 + 16 *20], [0, 1, 20, 21], [0, 1, 20, 21])
first_maze.set_up_doors([door1, door2, door3, door4])
first_dungeon.set_up_doors([door3, door4])
first_hall.set_up_doors([door1, door2])

export const current_area = new Wrapper(first_maze)


let output = current_area.item.full_setup
// console.log(output)
// console.log(first_maze)
export let game_map = new Wrapper(output[0]);
export let game_maze = new Wrapper(output[1]);
let rooms = output[2];
export let chests = output[3];
export let ptr = new Wrapper(0);
let monster_num = 1;
let monster_spawn_num = 0;
export const sect_size = 5
// print_walls(game_maze, xrectnum, yrectnum)

game_maze.item[0].exists = false;
game_maze.item[1].exists = false;
game_maze.item[2].exists = false;
game_maze.item[2 * xrectnum + 1].exists = false;

export const maze_dicter =  make_maze_dicts(game_maze.item, xrectnum, yrectnum, sect_size, game_map.item)
// (above 4 lineS are needed for a MAZE)


export let chest_indices = [];

for(let i = 0;i < chests.length;i++)
{
    chest_indices[i] = chests[i].index;
}


// const container = new PIXI.Container();
export let vis = new PIXI.Container();
export let walls = new PIXI.Container();
vis.x = tot_width.item/2;
vis.y = tot_height.item/2 - cutoff_y.item / 2;
walls.x = tot_width.item/2;
walls.y = tot_height.item/2 - cutoff_y.item / 2;
app.stage.addChild(vis);
app.stage.addChild(walls);


// HERE WE CREATE THE PLAYERS AND THE MONSTERS FOR THE GAME LEVEL
// need to modify the players, player_inds, seen_indices.item, and maybe the monsters after a key as a result
let tier = 4;
export let players = new Array(4);
export let monsters = new Array(monster_num);
export let monster_indices = new Array(monsters.length);
export let monster_spawns = new Array(monster_spawn_num);
export let monster_spawn_indices = new Array(monster_spawns.length);
export let currx = new Wrapper(0);
export let curry = new Wrapper(0);
export let act_currx = new Wrapper(0);
export let act_curry = new Wrapper(0);
export let shiftx = new Wrapper(0);
export let shifty = new Wrapper(0);

for(let i = 0; i < monsters.length;i++)
{
    // console.log((i % 5) + 1)

    let x = Math.floor(Math.random() * xrectnum)
    let y = Math.floor(Math.random() * yrectnum)
    let ind = x + xrectnum * y
    while(game_map.item[ind].getBiome() == 9 || game_map.item[ind].getBiome() == -1 || game_map.item[ind].getBiome() == 10) {
        x = Math.floor(Math.random() * xrectnum)
        y = Math.floor(Math.random() * yrectnum)
        ind = x + xrectnum * y
    }
    monsters[i] = new Monster(5, size.item, size.item, xrectnum, yrectnum, "hunt", game_map.item, sect_size, x, y);
}

for(let i = 0;i < monsters.length;i++)
{
    monster_indices[i] = monsters[i].y * xrectnum + monsters[i].x;
}

for(let i = 0; i < monster_spawns.length;i++)
{
    // console.log((i % 5) + 1)
    monster_spawns[i] = new MonsterSpawner(5, size.item, size.item, xrectnum, yrectnum, game_map.item, "spawn", "sniff", 4)
}

for(let i = 0;i < monster_spawns.length;i++)
{
    monster_spawn_indices[i] = monster_spawns[i].y * xrectnum + monster_spawns[i].x;
}

players[0] = new Player(0, size.item, size.item, 2, 'Vivek');
players[1] = new Player(1, size.item, size.item, 1, 'Jane');
// players[1].y = 8;
players[2] = new Player(2, size.item, size.item, 3, 'Nikki');
// players[2].y = 5;
// players[2].x = 3;
players[3] = new Player(3, size.item, size.item, 4, 'Mayur');

// players[3].y = 11;
// console.log("players", players)
players[1].range_type = "xrange";
players[1].range = 7;

players[1].x = 1;
players[2].y = 1;
players[3].x = 1;
players[3].y = 1;


const min_speed_val = 1000;
players[0].speed = Math.max(2*players[0].vis_tier, min_speed_val);
players[1].speed = Math.max(2*players[1].vis_tier, min_speed_val);
players[2].speed = Math.max(2*players[2].vis_tier, min_speed_val);
players[3].speed = Math.max(2*players[3].vis_tier, min_speed_val);
export const visible_player_num = new Wrapper(players.length)

// export const tot_player_health = init_health_bars(app, players)



// export let curr_index = 0

export let play_inds = new Array(players.length);



export const inventory = new Wrapper(false)
export const inventory_screen = new Wrapper(create_inventory_screen())


setPlays();
export let seen_indices = new Wrapper(total_visible_indices(players, xrectnum, yrectnum));

export let curr_player = new Wrapper(players[0])
export const curr_player_trues = new Wrapper([true, false, false, false])
export const tot_cards = new Wrapper(init_all_player_cards(players, tot_width.item / 4, tot_height.item * 4 / 5 + size.item * 3/10, tot_width.item / 8,  tot_height.item / 5 - size.item * 4/10 - 10))


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
    // app.stage.addChild(players[t].rect)
    app.stage.addChild(players[t].sprite)
}

// for (let t = 0; t < monsters.length; t++) {
//     monsters[t].drawMe(size.item, size.item, currx.item, curry.item)
//     // // console.log(players[t].x, players[t].y)
//     app.stage.addChild(monsters[t].rect)
// }
// console.log(monster_spawn_indices)
sight(game_map.item, game_maze.item, xrectnum, yrectnum, cutoff_y, tot_height, players, curr_player.item, monsters, ptr.item, size.item, currx.item, curry.item, chest_indices, chests, monster_indices, monster_spawns, monster_spawn_indices, current_area.item.is_start_level, app);


// app.stage.addChild(tot_player_health[0])
app.stage.addChild(tot_cards.item[0])
app.stage.addChild(inventory_screen.item)
inventory_screen.item.visible = inventory.item
app.stage.addChild(menu_container)
menu_container.visible = pause.item
