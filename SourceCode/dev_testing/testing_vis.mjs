import { map_init } from "./bkgnd/mapgen.mjs";
import { maze_init2 } from "./bkgnd/mazegen.mjs";
import { print_map } from "./bkgnd/mapgen.mjs";
import { get_view_sqr } from "../methods/visibility.mjs";
const app = new PIXI.Application();
const size = 40;
const tot_width = 1800
const tot_height = 900
await app.init({ width: tot_width, height: tot_height });
document.body.appendChild(app.canvas);
let xrectnum = 60;
let yrectnum = 60;
let game_map = map_init(xrectnum, yrectnum);
let game_maze = maze_init2(xrectnum, yrectnum);
await PIXI.Assets.load('../textures/bkgnd/ShadowLands2.png');
await PIXI.Assets.load('../textures/bkgnd/Desert2.png');
await PIXI.Assets.load('../textures/bkgnd/GrassyPlains.png');
await PIXI.Assets.load('../textures/bkgnd/Lava.png');
await PIXI.Assets.load('../textures/bkgnd/MuddyRainforest2.png');
await PIXI.Assets.load('../textures/bkgnd/PoisonOoze.png');
await PIXI.Assets.load('../textures/bkgnd/RockyArea.png');
await PIXI.Assets.load('../textures/bkgnd/SnowyIce.png');
await PIXI.Assets.load('../textures/bkgnd/Waves2.png');
print_map(game_map, xrectnum, yrectnum);
function show_map(map)
{
    let sprite;
    for(let i = 0;i < yrectnum;i++)
    {
        for(let k = 0;k < xrectnum;k++)
        {
            switch(game_map[i * xrectnum + k].biome)
            {
            case 0:
                sprite = PIXI.Sprite.from('../textures/bkgnd/ShadowLands2.png');
                break;
            case 1:
                sprite = PIXI.Sprite.from('../textures/bkgnd/Desert2.png');
                break;
            case 2:
                sprite = PIXI.Sprite.from('../textures/bkgnd/GrassyPlains.png');
                break;
            case 3:
                sprite = PIXI.Sprite.from('../textures/bkgnd/Lava.png');
                break;
            case 4:
                sprite = PIXI.Sprite.from('../textures/bkgnd/MuddyRainforest2.png');
                break;
            case 5:
                sprite = PIXI.Sprite.from('../textures/bkgnd/PoisonOoze.png');
                break;
            case 6:
                sprite = PIXI.Sprite.from('../textures/bkgnd/RockyArea.png');
                break;
            case 7:
                sprite = PIXI.Sprite.from('../textures/bkgnd/SnowyIce.png');
                break;
            case 8:
                sprite = PIXI.Sprite.from('../textures/bkgnd/Waves2.png');
                break;
            }
            sprite.x = k * size;
            sprite.y = i * size;
            sprite.width = size;
            sprite.height = size;
            app.stage.addChild(sprite);
        }
    }
}
let left = 37;
let up = 38;
let right = 39;
let down = 40;
const container = new PIXI.Container();
let vis_tier = 4;
let vis_objs = container;
app.stage.addChild(vis_objs);
vis_objs.x = Math.floor((tot_width-size)/2);
vis_objs.y = Math.floor((tot_height-size)/2);
function vis(currx, curry)
{
    let map_indices = get_view_sqr(currx, curry, xrectnum, yrectnum, vis_tier);
    let vis_sprites = new Array(map_indices.length);
    for(let i = 0;i < map_indices.length;i++)
    {
        switch(game_map[map_indices[i]].biome)
        {
        case 2:
            vis_sprites[i] = PIXI.Sprite.from('../textures/bkgnd/ShadowLands2.png');
            break;
        case 1:
            vis_sprites[i] = PIXI.Sprite.from('../textures/bkgnd/Desert2.png');
            break;
        case 0:
            vis_sprites[i] = PIXI.Sprite.from('../textures/bkgnd/GrassyPlains.png');
            break;
        case 3:
            vis_sprites[i] = PIXI.Sprite.from('../textures/bkgnd/Lava.png');
            break;
        case 4:
            vis_sprites[i] = PIXI.Sprite.from('../textures/bkgnd/MuddyRainforest2.png');
            break;
        case 5:
            vis_sprites[i] = PIXI.Sprite.from('../textures/bkgnd/PoisonOoze.png');
            break;
        case 6:
            vis_sprites[i] = PIXI.Sprite.from('../textures/bkgnd/RockyArea.png');
            break;
        case 7:
            vis_sprites[i] = PIXI.Sprite.from('../textures/bkgnd/SnowyIce.png');
            break;
        case 8:
            vis_sprites[i] = PIXI.Sprite.from('../textures/bkgnd/Waves2.png');
            break;
        }
        vis_sprites[i].width = size;
        vis_sprites[i].height = size;
        vis_sprites[i].x = ((map_indices[i] % xrectnum) - currx) * size;
        vis_sprites[i].y = (Math.floor((map_indices[i] / xrectnum))-curry) * size;
        vis_objs.addChild(vis_sprites[i]);
    }
    // return map_indices.length
    // alert(vis_objs.x);
}
// let arect = new PIXI.Graphics();
// arect.x = 0.5 * size;
// arect.y = 0.5 * size;
// arect.rect(0.25 * size, 0.25 * size, size/2, size/2)
// app.stage.addChild(arect);
document.addEventListener('keydown', keyStart);
document.addEventListener('keyup', keyStop)
let currx = 0
let curry = 0
let key;
vis(currx, curry);
function keyStart(e)
{
  // alert("Here");
  
// console.log(vis_objs)
    
  key = e.keyCode;
  // alert(key);
  // game_map[curry * xrectnum + currx].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[curry * xrectnum + currx].tile_image);
  // arect.beginFill(0xFF0000);
  // arect.lineStyle(5, 0xFFFFFF);
  // arect.drawRect(arect.x, arect.y, sizer/2, sizer/2);
  // app.stage.addChild(arect);
  // game_map[curry * xrectnum + currx + 1].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[curry * xrectnum + currx + 1].tile_image);
  // game_map[curry * xrectnum + currx - 1].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[curry * xrectnum + currx - 1].tile_image);
  // game_map[(curry - 1) * xrectnum + currx + 1].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[(curry - 1) * xrectnum + currx + 1].tile_image);
  // game_map[(curry + 1) * xrectnum + currx + 1].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[(curry + 1) * xrectnum + currx + 1].tile_image);
  // game_map[curry * xrectnum + currx].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[curry * xrectnum + currx].tile_image);


  // if(currx - 1 >= 0 && !(game_map[curry * xrectnum + currx - 1].rendered == true))
  // {
  //   // alert("HERE");
  //   game_map[curry * xrectnum + currx - 1].drawTile(sizer, sizer);
  //   app.stage.addChild(game_map[curry * xrectnum + currx - 1].tile_image);
  //   game_map[curry * xrectnum + currx - 1].rendered = true;
  // }
  // if(currx + 1 <= xrectnum && !(game_map[curry * xrectnum + currx + 1].rendered == true))
  // {
  //   game_map[curry * xrectnum + currx + 1].drawTile(sizer, sizer);
  //   app.stage.addChild(game_map[curry * xrectnum + currx + 1].tile_image);
  //   game_map[curry * xrectnum + currx + 1].rendered = true;
  // }
  // if(curry - 1 >= 0 && !(game_map[(curry - 1) * xrectnum + currx].rendered == true))
  // {
  //   game_map[(curry - 1) * xrectnum + currx].drawTile(sizer, sizer);
  //   app.stage.addChild(game_map[(curry - 1) * xrectnum + currx + 1].tile_image);
  //   game_map[(curry - 1) * xrectnum + currx].rendered = true;
  // }
  // if(curry + 1 <= yrectnum && !(game_map[(curry + 1) * xrectnum + currx].rendered == true))
  // {
  //   game_map[(curry + 1) * xrectnum + currx].drawTile(sizer, sizer);
  //   app.stage.addChild(game_map[(curry + 1) * xrectnum + currx].tile_image);
  //   game_map[(curry - 1) * xrectnum + currx].rendered = true;
  // }
  // visibility(currx, curry, vis);
//   app.stage.addChild(arect);
  if(currx - 1 >= 0 && key == left/* && !game_maze[curry * 2 * xrectnum + currx * 2 - 1].getWall()*/)
  {
    while(vis_objs.children[0]) { 
        vis_objs.removeChild(vis_objs.children[0]);
    }
     currx--;
     vis(currx, curry);
  }
  else if(curry - 1 >= 0 && key == up/* && !game_maze[(curry - 1) * 2 * xrectnum + currx * 2].getWall()*/)
  {
    while(vis_objs.children[0]) { 
        vis_objs.removeChild(vis_objs.children[0]);
    }
    curry--;
    vis(currx, curry);
  }
  else if(currx + 1 < xrectnum && key == right/* && !game_maze[curry * 2 * xrectnum + currx * 2 + 1].getWall()*/)
  {
    while(vis_objs.children[0]) { 
        vis_objs.removeChild(vis_objs.children[0]);
    }
    currx++;
    vis(currx, curry);
  }
  else if(curry + 1 < yrectnum && key == down/* && !game_maze[(curry) * 2 * xrectnum + currx * 2].getWall()*/)
  {
    while(vis_objs.children[0]) { 
        vis_objs.removeChild(vis_objs.children[0]);
    }
    curry++;
    vis(currx, curry);
  }
//   console.log(currx, curry)
  
  // maze_draw(game_maze, sizer, sizer);
  // if(dist(arect.x, arect.y, endrect.x, endrect.y) < 1)
  // {
  //   alert("End");
  // }
  // parent.addChild(game_map[(curry - 3) * xrectnum + currx]);
}
function keyStop(e){
    key = 0;
    
  }
  