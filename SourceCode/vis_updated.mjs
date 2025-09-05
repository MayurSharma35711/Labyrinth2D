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

// THE BELOW WAS ALL CODE THAT I FOUDN USING CHATGPT TO STREAMLINE THE PROCESSS
const loadingContainer = new PIXI.Graphics();
loadingContainer.rect(0, 0, app.screen.width, app.screen.height);
loadingContainer.fill(0x000055);

const loadingText = new PIXI.Text('Loading... 0%', { fill: 0xffffff, fontSize: 24 });
loadingText.anchor.set(0.5);
loadingText.x = app.screen.width / 2;
loadingText.y = app.screen.height / 2;

app.stage.addChild(loadingContainer);
app.stage.addChild(loadingText);

let base_dir_string = "https://mayursharma35711.github.io/Labyrinth2D/"

async function loadAssets() {
  // Register your bundle
  PIXI.Assets.addBundle('game', {
    grass: base_dir_string + '/textures/bkgnd/GrassyPlains.png',
    desert: base_dir_string + '/textures/bkgnd/Desert2.png',
    shadow: base_dir_string + '/textures/bkgnd/ShadowLands2.png',
    lava: base_dir_string + '/textures/bkgnd/Lava.png',
    mud: base_dir_string + '/textures/bkgnd/MuddyRainforest2.png',
    ooze: base_dir_string + '/textures/bkgnd/PoisonOoze.png',
    rock: base_dir_string + '/textures/bkgnd/RockyArea.png',
    snow: base_dir_string + '/textures/bkgnd/SnowyIce.png',
    water: base_dir_string + '/textures/bkgnd/Waves2.png',
    hall: base_dir_string + '/textures/bkgnd/RoomFloor.png',
    dungeon: base_dir_string + '/textures/bkgnd/Dungeon.png',
    blank: base_dir_string + '/textures/bkgnd/blank.png',
    vert_door: base_dir_string + '/textures/bkgnd/vert_door.png',
    horiz_door: base_dir_string + '/textures/bkgnd/horiz_door.png',
    vert_wall: base_dir_string + '/textures/bkgnd/WallsVertical.png',
    horiz_wall: base_dir_string + '/textures/bkgnd/WallsHorizontal.png',
    spawner: base_dir_string + '/textures/sprites/monster_spawner_beta.png',
    stick_man: base_dir_string + '/textures/sprites/stick_man.png',
    devil_man: base_dir_string + '/textures/sprites/devil_man.png',
    indian: base_dir_string + '/textures/sprites/indian.png',
    caricature: base_dir_string + '/textures/sprites/caricature.png',
    chest_closed: base_dir_string + '/textures/items/Chests.png',
    chest_open: base_dir_string + '/textures/items/ChestsOpen.png'
  });

  // Load with progress
  await PIXI.Assets.loadBundle('game', (progress) => {
    loadingText.text = `Loading... ${Math.round(progress * 100)}%`;
  });
}


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
    

    sight(game_map.item, game_maze.item, xrectnum, yrectnum, cutoff_y, tot_height, players, curr_player.item, monsters.item, ptr.item, size.item, currx.item, curry.item, chest_indices.item, chests.item, monster_indices.item, monster_spawns.item, monster_spawn_indices.item, current_area.item.is_start_level, app);
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

export const curr_player_index = new Wrapper(0)

export const menu_container = init_pause_menu(app)
export const pause = new Wrapper(false)

export const pop_up = new Wrapper(false)
export const pop_up_bubble = new Wrapper(false)

export const selector = new Wrapper(false)
export const selector_bubble = new Wrapper(false)

export let xrectnum = 20;
export let yrectnum = 20;

export const current_area = new Wrapper(0)



// console.log(output)
// console.log(first_maze)
export let game_map = new Wrapper(0);
export let game_maze = new Wrapper(0);
// let rooms = output[2];
export let chests = new Wrapper(0);
export let ptr = new Wrapper(0);
export const sect_size = 5
// print_walls(game_maze, xrectnum, yrectnum)


export const maze_dicter = new Wrapper(0)

export let chest_indices = new Wrapper([]);

// const container = new PIXI.Container();
export let vis = new PIXI.Container();
export let walls = new PIXI.Container();

export let currx = new Wrapper(0);
export let curry = new Wrapper(0);
export let act_currx = new Wrapper(0);
export let act_curry = new Wrapper(0);
export let shiftx = new Wrapper(0);
export let shifty = new Wrapper(0);

// HERE WE CREATE THE PLAYERS AND THE MONSTERS FOR THE GAME LEVEL
// need to modify the players, player_inds, seen_indices.item, and maybe the monsters after a key as a result
export let players = new Array(4);

export let monsters = new Wrapper(0)
export let monster_indices = new Wrapper(0)

export let monster_spawns = new Wrapper(0);
export let monster_spawn_indices = new Wrapper(0);

export const visible_player_num = new Wrapper(players.length)


export let play_inds = new Array(players.length);

export const inventory = new Wrapper(false)
export const inventory_screen = new Wrapper(0)


export let seen_indices = new Wrapper(0);

export let curr_player = new Wrapper(0)
export const curr_player_trues = new Wrapper(0)
export const tot_cards = new Wrapper(0)




async function start() {
    await loadAssets();
    
    app.stage.removeChild(loadingContainer)
    app.stage.removeChild(loadingText)

    const first_maze = new Area("maze1", xrectnum, yrectnum, "m", true, -1, [4,4,0,0], [[15, 15, 5, 5, 10, [[17, 15], [15, 17]]], [5, 5, 5, 5, 9, [[5,8], [10, 7]]]])
    const first_dungeon = new Area("dung1", xrectnum, yrectnum, "d", false, 2, [], [])
    const first_hall = new Area("hall1", xrectnum, yrectnum, "h", false, 1, [], [])

    const door1 = new Level_Door("door1", first_maze, first_hall, [4,8], [0,0], [4 + 8 *20, 3 + 8 *20, 4 + 7 *20, 3 + 7 *20], [0, 1, 20, 21])
    const door2 = new Level_Door("door2", first_maze, first_hall, [10,7], [0,0], [10 + 7 *20, 11 + 7 *20, 10 + 6 *20, 11 + 6 *20], [0, 1, 20, 21])
    const door3 = new Level_Door("door3", first_maze, first_dungeon, [17, 14], [0,0], [17 + 14 * 20, 17 + 13 * 20 , 18 + 14 * 20 , 18 + 13 * 20], [0, 1, 20, 21])
    const door4 = new Level_Door("door4", first_maze, first_dungeon, [14, 17], [0,0], [14 + 17 *20, 13 + 17 *20, 14 + 16 *20, 13 + 16 *20], [0, 1, 20, 21])
    first_maze.set_up_doors([door1, door2, door3, door4])
    first_dungeon.set_up_doors([door3, door4])
    first_hall.set_up_doors([door1, door2])

    current_area.item = first_maze
    let output = current_area.item.full_setup
    game_map.item = output[0];
    game_maze.item = output[1];
    let rooms = output[2];
    chests.item = output[3];

    // print_walls(game_maze, xrectnum, yrectnum)

    game_maze.item[0].exists = false;
    game_maze.item[1].exists = false;
    game_maze.item[2].exists = false;
    game_maze.item[2 * xrectnum + 1].exists = false;
    maze_dicter.item = make_maze_dicts(game_maze.item, xrectnum, yrectnum, sect_size, game_map.item)

    first_maze.prep_monsters([[4, "patrol",[9,10,-1]], [4, "patrol",[9,10,-1]], [4, "patrol",[9,10,-1]], [4, "patrol",[9,10,-1]], [4, "patrol",[9,10,-1]]], 
        [[5, "tester", "hunt", 9, [9, 10, -1]], [5, "tester", "hunt", 8, [9, 10, -1]], [5, "tester", "hunt", 7, [9, 10, -1]]])
    first_hall.prep_monsters([], [])
    first_dungeon.prep_monsters([[5, "sniff",[9,-1]], [5, "sniff",[9,-1]], [5, "sniff",[9,-1]], [5, "sniff",[9,-1]], [5, "sniff",[9,-1]], [5, "sniff",[9,-1]], [5, "sniff",[9,-1]]], [[4, "tester22", "sniff", 9, [9, -1]], [4, "tester22", "sniff", 11, [9, -1]]])

    for(let i = 0;i < chests.item.length;i++)
    {
        chest_indices.item[i] = chests.item[i].index;
    }

    vis.x = tot_width.item/2;
    vis.y = tot_height.item/2 - cutoff_y.item / 2;
    walls.x = tot_width.item/2;
    walls.y = tot_height.item/2 - cutoff_y.item / 2;
    app.stage.addChild(vis);
    app.stage.addChild(walls);


    monsters.item = output[4]
    monster_indices.item = output[5]
    
    monster_spawns.item = output[6]
    monster_spawn_indices.item = output[7]


    players[0] = new Player(0, size.item, size.item, 40, 'Vivek');
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


    inventory_screen.item = create_inventory_screen()

    setPlays();


    seen_indices.item = total_visible_indices(players, xrectnum, yrectnum);

    curr_player.item = players[0]
    curr_player_trues.item = [true, false, false, false]
    tot_cards.item = init_all_player_cards(players, tot_width.item / 4, tot_height.item * 4 / 5 + size.item * 3/10, tot_width.item / 8,  tot_height.item / 5 - size.item * 4/10 - 10)





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
    sight(game_map.item, game_maze.item, xrectnum, yrectnum, cutoff_y, tot_height, players, curr_player.item, monsters.item, ptr.item, size.item, currx.item, curry.item, chest_indices.item, chests.item, monster_indices.item, monster_spawns.item, monster_spawn_indices.item, current_area.item.is_start_level, app);


    // app.stage.addChild(tot_player_health[0])
    app.stage.addChild(tot_cards.item[0])
    app.stage.addChild(inventory_screen.item)
    inventory_screen.item.visible = inventory.item
    app.stage.addChild(menu_container)
    menu_container.visible = pause.item
}

start()
// window.addEventListener('resize', resize_func);

// first_maze.spawns = monster_spawns.item


// export const tot_player_health = init_health_bars(app, players)



// export let curr_index = 0




